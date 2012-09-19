package groovejames.service;

import groovejames.model.FileStore;
import groovejames.model.MemoryStore;
import groovejames.model.Song;
import groovejames.model.Store;
import groovejames.model.StreamKey;
import groovejames.model.Track;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpResponseException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.BasicManagedEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.protocol.HTTP;
import org.apache.pivot.collections.ArrayList;

import javax.swing.filechooser.FileSystemView;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static java.lang.String.format;

public class DownloadService {

    private static final Log log = LogFactory.getLog(DownloadService.class);

    private static final int numberOfParallelDownloads = Integer.getInteger("numberOfParallelDownloads", 1);

    private static final int downloadBufferSize = 10240;

    public static final File defaultDownloadDir;

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
    private final ArrayList<DownloadTask> currentlyRunningDownloads = new ArrayList<DownloadTask>();
    private final FilenameSchemeParser filenameSchemeParser;

    private File downloadDir;
    private long nextSongMustSleepUntil;

    public DownloadService(HttpClientService httpClientService) {
        this.httpClientService = httpClientService;
        this.downloadDir = defaultDownloadDir;
        this.executorService = Executors.newFixedThreadPool(numberOfParallelDownloads);
        this.executorServiceForPlay = Executors.newFixedThreadPool(1);
        this.filenameSchemeParser = new FilenameSchemeParser();
    }

    public File getDownloadDir() {
        return downloadDir;
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

    public synchronized Track download(Song song, DownloadListener downloadListener) {
        File file = new File(downloadDir, filenameSchemeParser.parse(song));
        Store store = new FileStore(file, downloadDir);
        return download(song, store, downloadListener, false);
    }

    public synchronized Track downloadToMemory(Song song) {
        return downloadToMemory(song, null);
    }

    public synchronized Track downloadToMemory(Song song, DownloadListener downloadListener) {
        Store store = new MemoryStore(song.toString());
        return download(song, store, downloadListener, true);
    }

    private Track download(Song song, Store store, DownloadListener downloadListener, boolean forPlay) {
        Track track = new Track(song, store);
        int additionalAbortDelay = 0;
        boolean downloadWasInterrupted = cancelDownload(track, true);
        if (downloadWasInterrupted && !forPlay)
            additionalAbortDelay += 5000;
        additionalAbortDelay += Math.max(nextSongMustSleepUntil - System.currentTimeMillis(), 0);
        DownloadTask downloadTask = new DownloadTask(track, additionalAbortDelay, downloadListener);
        currentlyRunningDownloads.add(downloadTask);
        if (forPlay) {
            executorServiceForPlay.submit(downloadTask);
        } else {
            executorService.submit(downloadTask);
        }
        nextSongMustSleepUntil = Math.max(System.currentTimeMillis(), nextSongMustSleepUntil + 1000);
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

    public void shutdown() {
        executorService.shutdownNow();
        executorServiceForPlay.shutdownNow();
        ArrayList<DownloadTask> downloadsCopy = new ArrayList<DownloadTask>(currentlyRunningDownloads);
        for (DownloadTask downloadTask : downloadsCopy) {
            cancelDownload(downloadTask, true);
        }
    }


    private class DownloadTask implements Runnable {
        private final Track track;
        private final int initialDelay;
        private final DownloadListener downloadListener;
        private volatile HttpPost httpPost;
        private volatile boolean aborted;

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
                log.info("start download track " + track);
                track.setStatus(Track.Status.INITIALIZING);
                fireDownloadStatusChanged();
                StreamKey streamKey = Services.getSearchService().getStreamKeyFromSongID(track.getSong().getSongID());
                track.setStatus(Track.Status.DOWNLOADING);
                track.setStartDownloadTime(System.currentTimeMillis());
                if ((track.getSong().getEstimateDuration() == null || track.getSong().getEstimateDuration() <= 0.0) && streamKey.getuSecs() > 0)
                    track.getSong().setEstimateDuration(streamKey.getuSecs() / 1000000.0);
                fireDownloadStatusChanged();
                if (Boolean.getBoolean("mockNet"))
                    fakedownload(streamKey);
                else
                    download(streamKey);
                track.setStatus(Track.Status.FINISHED);
                fireDownloadStatusChanged();
                log.info("finished download track " + track);
            } catch (Exception ex) {
                if (aborted || ex instanceof InterruptedException) {
                    log.info("cancel download by request: " + track);
                    track.setStatus(Track.Status.CANCELLED);
                } else {
                    log.error("error download track " + track, ex);
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
                    httpPost = null;
                }
                fireDownloadStatusChanged();
            }
        }

        public synchronized boolean abort() {
            if (httpPost != null) {
                aborted = true;
                httpPost.abort();
                return true;
            }
            return false;
        }

        private void download(StreamKey streamKey) throws IOException {
            String url = format("http://%s/stream.php", streamKey.getIp());
            httpPost = new HttpPost(url);
            httpPost.setHeader(HTTP.CONTENT_TYPE, "application/x-www-form-urlencoded");
            httpPost.setHeader(HTTP.CONN_KEEP_ALIVE, "300");
            httpPost.setEntity(new StringEntity("streamKey=" + streamKey.getStreamKey()));
            HttpResponse httpResponse = httpClientService.getHttpClient().execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            OutputStream outputStream = null;
            try {
                StatusLine statusLine = httpResponse.getStatusLine();
                int statusCode = statusLine.getStatusCode();
                if (statusCode == HttpStatus.SC_OK) {
                    track.setTotalBytes(httpEntity.getContentLength());
                    Store store = track.getStore();
                    OutputStream storeOutputStream = store.getOutputStream();
                    outputStream = new MonitoredOutputStream(storeOutputStream);
                    InputStream instream = httpEntity.getContent();
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
                } else {
                    throw new HttpResponseException(statusCode,
                        format("%s: %d %s", url, statusCode, statusLine.getReasonPhrase()));
                }
            } finally {
                close(httpEntity);
                close(outputStream);
            }
        }

        private void fakedownload(StreamKey streamKey) throws InterruptedException, IOException {
            httpPost = new HttpPost(format("http://%s/stream.php", streamKey.getIp()));
            Thread.sleep(1000);
            String songName = track.getSongName();
            songName = songName.contains("track1") ? "track1" : songName.contains("track2") ? "track2" : songName;
            File file = new File(format("test/groovejames/mp3player/%s.mp3", songName));
            Store store = track.getStore();
            OutputStream storeOutputStream = store.getOutputStream();
            OutputStream outputStream = new MonitoredOutputStream(storeOutputStream);
            InputStream instream = new FileInputStream(file);
            track.setTotalBytes(file.length());
            try {
                byte[] buf = new byte[downloadBufferSize];
                int l;
                while ((l = instream.read(buf)) != -1) {
                    outputStream.write(buf, 0, l);
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
                close(outputStream);
                close(instream);
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

        private void close(HttpEntity httpEntity) {
            try {
                httpEntity.consumeContent();
            } catch (IOException ignore) {
                // ignored
            }
            try {
                ((BasicManagedEntity) httpEntity).abortConnection();
            } catch (IOException ignore) {
                // ignored
            }
        }

        private void close(Closeable closeable) {
            if (closeable != null) {
                try {
                    closeable.close();
                } catch (IOException ignore) {
                    // ignored
                }
            }
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
