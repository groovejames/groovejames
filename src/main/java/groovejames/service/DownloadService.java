package groovejames.service;

import groovejames.model.FileStore;
import groovejames.model.MemoryStore;
import groovejames.model.Song;
import groovejames.model.Store;
import groovejames.model.Track;
import groovejames.service.search.SearchService;
import groovejames.util.FileUtils;
import groovejames.util.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpResponseException;
import org.apache.http.client.methods.HttpGet;
import org.apache.pivot.collections.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

import static com.google.common.base.Strings.isNullOrEmpty;
import static java.lang.String.format;

public class DownloadService {

    private static final Logger log = LoggerFactory.getLogger(DownloadService.class);

    private static final int numberOfParallelDownloads = Integer.getInteger("numberOfParallelDownloads", 1);
    private static final int maxRetries = Integer.getInteger("maxRetries", 3);

    private static final int downloadBufferSize = 10240;

    public static final File defaultDownloadDir;

    private static final boolean mockNet = Boolean.getBoolean("mockNet");

    static {
        String downloadDir = System.getProperty("downloadDir");
        if (downloadDir != null) {
            defaultDownloadDir = new File(downloadDir);
        } else {
            // must use Swing class FileSystemView here, it's the only way to get the
            // user directory on Windows
            File userDir = FileSystemView.getFileSystemView().getDefaultDirectory();
            defaultDownloadDir = new File(userDir, "GrooveJames").getAbsoluteFile();
        }
    }

    private final ExecutorService executorService;
    private final ExecutorService executorServiceForPlay;
    private final HttpClientService httpClientService;
    private final SearchService searchService;
    private final ArrayList<DownloadTask> currentlyRunningDownloads = new ArrayList<>();
    private final FilenameSchemeParser filenameSchemeParser;

    private File downloadDir;

    public DownloadService(HttpClientService httpClientService, SearchService searchService) {
        this.httpClientService = httpClientService;
        this.searchService = searchService;
        this.downloadDir = defaultDownloadDir;
        this.executorService = Executors.newFixedThreadPool(numberOfParallelDownloads);
        this.executorServiceForPlay = Executors.newFixedThreadPool(1);
        this.filenameSchemeParser = new FilenameSchemeParser();
    }

    public void setDownloadDir(File downloadDir) {
        this.downloadDir = downloadDir;
    }

    public FilenameSchemeParser getFilenameSchemeParser() {
        return filenameSchemeParser;
    }

    public synchronized Track download(Song song) {
        return download(song, null);
    }

    /** used only for experimental batch downloader */
    public synchronized Track download(Song song, DownloadListener downloadListener) {
        String filename = FileUtils.sanitizeFilepath(filenameSchemeParser.parse(song));
        File file = new File(downloadDir, filename + ".mp3");
        Store store = new FileStore(file, downloadDir);
        return download(song, store, downloadListener, false);
    }

    public synchronized Track downloadToMemory(Song song, DownloadListener downloadListener) {
        Store store = new MemoryStore(song.toString());
        return download(song, store, downloadListener, true);
    }

    private Track download(Song song, Store store, DownloadListener downloadListener, boolean forPlay) {
        Track track = new Track(song, store);
        int initialDelay = 0;
        boolean downloadWasInterrupted = cancelDownload(track, true);
        if (downloadWasInterrupted && !forPlay)
            initialDelay += 5000;
        DownloadTask downloadTask = new DownloadTask(track, initialDelay, downloadListener);
        downloadTask.fireDownloadStatusChanged();
        currentlyRunningDownloads.add(downloadTask);
        if (forPlay) {
            executorServiceForPlay.submit(downloadTask);
        } else {
            executorService.submit(downloadTask);
        }
        return track;
    }

    public synchronized boolean cancelDownload(Track track, boolean deleteStore) {
        DownloadTask downloadTask = findDownloadTask(track);
        return cancelDownload(downloadTask, deleteStore);
    }

    private synchronized boolean cancelDownload(DownloadTask downloadTask, boolean deleteStore) {
        boolean downloadWasInterrupted = false;
        if (downloadTask != null) {
            currentlyRunningDownloads.remove(downloadTask);
            downloadWasInterrupted = downloadTask.abort();
            if (deleteStore) {
                downloadTask.track.getStore().deleteStore();
            }
            downloadTask.track.setStatus(Track.Status.CANCELLED);
            downloadTask.fireDownloadStatusChanged();
        }
        return downloadWasInterrupted;
    }

    private DownloadTask findDownloadTask(Track track) {
        for (DownloadTask downloadTask : currentlyRunningDownloads) {
            if (downloadTask.track.getStore().isSameLocation(track.getStore())) {
                return downloadTask;
            }
        }
        return null;
    }

    public int getNumberOfCurrentRunningDownloads() {
        int num = 0;
        for (DownloadTask downloadTask : currentlyRunningDownloads) {
            if (downloadTask.track.getStatus().isRunning()) {
                num++;
            }
        }
        return num;
    }

    public void shutdown() {
        executorService.shutdownNow();
        executorServiceForPlay.shutdownNow();
        ArrayList<DownloadTask> downloadsCopy = new ArrayList<>(currentlyRunningDownloads);
        for (DownloadTask downloadTask : downloadsCopy) {
            cancelDownload(downloadTask, true);
        }
    }

    public void shutdownNicely() {
        executorService.shutdown();
        executorServiceForPlay.shutdown();
        try {
            executorService.awaitTermination(1, TimeUnit.DAYS);
        } catch (InterruptedException e) {
            log.warn("interrupted", e);
        }
        try {
            executorServiceForPlay.awaitTermination(1, TimeUnit.DAYS);
        } catch (InterruptedException e) {
            log.warn("interrupted", e);
        }
    }

    private class DownloadTask implements Runnable {
        private final Track track;
        private final int initialDelay;
        private final DownloadListener downloadListener;
        private volatile HttpGet httpGet;
        private volatile boolean aborted;
        private volatile String primaryDownloadURL;
        private volatile String realDownloadURL;

        public DownloadTask(Track track, int initialDelay, DownloadListener downloadListener) {
            this.track = track;
            this.initialDelay = initialDelay;
            this.downloadListener = downloadListener;
        }

        public void run() {
            try {
                if (track.getStatus() == Track.Status.CANCELLED)
                    return;
                Thread.sleep(initialDelay);
                if (track.getStatus() == Track.Status.CANCELLED)
                    return;
                log.info("start download track {}", track);
                track.setStatus(Track.Status.INITIALIZING);
                fireDownloadStatusChanged();
                determineDownloadURL();
                track.setStartDownloadTime(System.currentTimeMillis());
                fireDownloadStatusChanged();
                if (mockNet)
                    fakedownload();
                else
                    download();
                track.setStatus(Track.Status.FINISHED);
                fireDownloadStatusChanged();
                log.info("finished download track {}", track);
            } catch (Exception ex) {
                if (aborted || ex instanceof InterruptedException) {
                    log.info("cancel download by request: {}", track);
                    track.setStatus(Track.Status.CANCELLED);
                } else {
                    log.error("error download track {}", track, ex);
                    track.setStatus(Track.Status.ERROR);
                    track.setFault(ex);
                }
                track.getStore().deleteStore();
                fireDownloadStatusChanged();
            } finally {
                track.setStopDownloadTime(System.currentTimeMillis());
                synchronized (DownloadService.this) {
                    currentlyRunningDownloads.remove(this);
                }
                synchronized (this) {
                    httpGet = null;
                }
                fireDownloadStatusChanged();
            }
        }

        public synchronized boolean abort() {
            if (httpGet != null) {
                aborted = true;
                httpGet.abort();
                return true;
            }
            return false;
        }

        private void determineDownloadURL() throws Exception {
            if (mockNet) return;
            this.primaryDownloadURL = searchService.getDownloadURL(track.getSong());
            if (!isNullOrEmpty(this.primaryDownloadURL)) {
                this.realDownloadURL = this.primaryDownloadURL;
            }
            if (isNullOrEmpty(this.realDownloadURL)) {
                this.realDownloadURL = track.getSong().getAlternativeDownloadURL();
            }
            if (isNullOrEmpty(this.realDownloadURL)) {
                this.realDownloadURL = track.getSong().getDownloadURL();
            }
            if (isNullOrEmpty(this.realDownloadURL)) {
                throw new IllegalStateException("No download location.\n\nMaybe this song is not available for your country. Try using a chinese proxy to circumvent geoblocking.");
            }
        }

        private void download() throws IOException {
            httpGet = new HttpGet(realDownloadURL);
            for (int i = 1; i <= maxRetries; i++) {
                try {
                    HttpResponse httpResponse = httpClientService.getHttpClient().execute(httpGet);
                    HttpEntity httpEntity = httpResponse.getEntity();
                    track.setStatus(Track.Status.DOWNLOADING);
                    fireDownloadStatusChanged();
                    OutputStream outputStream = null;
                    InputStream instream = null;
                    try {
                        StatusLine statusLine = httpResponse.getStatusLine();
                        int statusCode = statusLine.getStatusCode();
                        if (statusCode == HttpStatus.SC_OK) {
                            track.setTotalBytes(httpEntity.getContentLength());
                            Store store = track.getStore();
                            OutputStream storeOutputStream = store.getOutputStream();
                            outputStream = new MonitoredOutputStream(storeOutputStream);
                            instream = httpEntity.getContent();
                            byte[] buf = new byte[downloadBufferSize];
                            int l;
                            while ((l = instream.read(buf)) != -1) {
                                outputStream.write(buf, 0, l);
                            }
                            // need to close immediately otherwise we cannot write ID tags
                            outputStream.close();
                            outputStream = null;
                            // write ID tags
                            store.writeTrackInfo(track);
                            return;
                        } else if (statusCode == HttpStatus.SC_NOT_FOUND && isNullOrEmpty(primaryDownloadURL)) {
                            throw new IllegalStateException("No valid download location found.\n\nMaybe this song is not available for your country. Try using a chinese proxy to circumvent geoblocking.");
                        } else {
                            throw new HttpResponseException(statusCode,
                                format("%s: %d %s", realDownloadURL, statusCode, statusLine.getReasonPhrase()));
                        }
                    } finally {
                        IOUtils.closeQuietly(instream, track.getStore().getDescription());
                        IOUtils.closeQuietly(outputStream, track.getStore().getDescription());
                    }
                } catch (ConnectException | SocketTimeoutException ex) {
                    if (i >= maxRetries)
                        throw ex;
                    else
                        log.warn("Error downloading track {} - will be retried (this was retry {} of {}); error was: {}", track, i, maxRetries, ex);
                }
            }
        }

        private void fakedownload() throws InterruptedException, IOException {
            Thread.sleep(1000);
            String songName = track.getSongName();
            boolean isEven = songName.charAt(songName.length() - 1) % 2 == 0;
            String trackName = isEven ? "track1" : "track2";
            File file = new File(format("src/test/resources/%s.mp3", trackName));
            Store store = track.getStore();
            OutputStream storeOutputStream = store.getOutputStream();
            OutputStream outputStream = new MonitoredOutputStream(storeOutputStream);
            track.setTotalBytes(file.length());
            InputStream instream = new FileInputStream(file);
            long errorAtByte = ThreadLocalRandom.current().nextLong(file.length());
            try {
                byte[] buf = new byte[downloadBufferSize];
                int l;
                while ((l = instream.read(buf)) != -1) {
                    outputStream.write(buf, 0, l);
                    if (!isEven && track.getDownloadedBytes() > errorAtByte)
                        throw new IOException("mockNet: fake I/O exception");
                    Thread.sleep(100);
                    if (aborted)
                        return;
                }
                // need to close immediately otherwise we cannot write ID tags
                outputStream.close();
                outputStream = null;
                // write ID tags
                store.writeTrackInfo(track);
            } finally {
                IOUtils.closeQuietly(outputStream, store.getDescription());
                IOUtils.closeQuietly(instream, file.getAbsolutePath());
            }
        }

        private void fireDownloadStatusChanged() {
            if (downloadListener != null)
                downloadListener.statusChanged(track);
        }

        private void fireDownloadBytesChanged() {
            if (downloadListener != null)
                downloadListener.downloadedBytesChanged(track);
        }


        private class MonitoredOutputStream extends OutputStream {
            private final OutputStream outputStream;

            public MonitoredOutputStream(OutputStream outputStream) {
                this.outputStream = outputStream;
            }

            @Override
            public void close() throws IOException {
                outputStream.close();
            }

            @Override
            public void flush() throws IOException {
                outputStream.flush();
            }

            @Override
            public void write(byte[] b) throws IOException {
                outputStream.write(b);
                track.incDownloadedBytes(b.length);
                fireDownloadBytesChanged();
            }

            @Override
            public void write(byte[] b, int off, int len) throws IOException {
                outputStream.write(b, off, len);
                track.incDownloadedBytes(len);
                fireDownloadBytesChanged();
            }

            @Override
            public void write(int b) throws IOException {
                outputStream.write(b);
                track.incDownloadedBytes(1);
                fireDownloadBytesChanged();
            }
        }
    }
}
