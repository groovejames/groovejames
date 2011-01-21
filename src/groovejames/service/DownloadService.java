package groovejames.service;

import groovejames.model.Country;
import groovejames.model.Song;
import groovejames.model.StreamKey;
import groovejames.model.Track;
import groovejames.util.Util;
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
import org.apache.pivot.collections.HashMap;
import org.apache.pivot.collections.Map;
import org.blinkenlights.jid3.ID3Exception;
import org.blinkenlights.jid3.MP3File;
import org.blinkenlights.jid3.v1.ID3V1Tag;
import org.blinkenlights.jid3.v1.ID3V1_1Tag;
import org.blinkenlights.jid3.v2.ID3V2Tag;
import org.blinkenlights.jid3.v2.ID3V2_3_0Tag;

import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import static java.lang.String.format;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class DownloadService {

    private static final Log log = LogFactory.getLog(DownloadService.class);

    private static final int numberOfParallelDownloads = Integer.getInteger("numberOfParallelDownloads", 10);

    private static final File defaultDownloadDir;

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

    private static final Object directoryDeleteLock = new Object();

    private final ExecutorService executorService;
    private final HttpClientService httpClientService;
    private final ArrayList<Track> tracks = new ArrayList<Track>();
    private final Map<File, DownloadTask> downloads = new HashMap<File, DownloadTask>();
    private final FilenameSchemeParser filenameSchemeParser;

    private File downloadDir;
    private long nextSongMustSleepUntil;

    public DownloadService(HttpClientService httpClientService) {
        this.httpClientService = httpClientService;
        this.downloadDir = defaultDownloadDir;
        this.executorService = Executors.newFixedThreadPool(numberOfParallelDownloads);
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

    public ArrayList<Track> getTracks() {
        return tracks;
    }

    public synchronized Track download(Song song) {
        return download(song, null);
    }

    public synchronized Track download(Song song, Grooveshark grooveshark) {
        File downloadFile = getDownloadFile(song);
        Track track = new Track(song, downloadFile);
        int initialDelay = 0;
        DownloadTask downloadTask = downloads.get(downloadFile);
        if (downloadTask != null) {
            boolean aborted = downloadTask.abort();
            if (aborted)
                initialDelay = 5000;
        }
        initialDelay += Math.max(nextSongMustSleepUntil - System.currentTimeMillis(), 0);
        tracks.add(track);
        downloadTask = new DownloadTask(track, grooveshark, initialDelay);
        downloads.put(downloadFile, downloadTask);
        executorService.submit(downloadTask);
        nextSongMustSleepUntil = Math.max(System.currentTimeMillis(), nextSongMustSleepUntil + 1000);
        return track;
    }

    public synchronized void cancelDownload(Track track, boolean deleteFile) {
        File file = track.getFile();
        if (file != null) {
            cancelDownload(file, deleteFile);
        }
    }

    private void cancelDownload(File file, boolean deleteFile) {
        DownloadTask downloadTask = downloads.remove(file);
        if (downloadTask != null) {
            downloadTask.abort();
        }
        if (deleteFile) {
            deleteFile(file);
        }
    }

    public void shutdown() {
        executorService.shutdownNow();
        HashMap<File, DownloadTask> downloadsCopy = new HashMap<File, DownloadTask>(downloads);
        for (File file : downloadsCopy) {
            cancelDownload(file, true);
        }
    }

    private File getDownloadFile(Song song) {
        return new File(downloadDir, filenameSchemeParser.parse(song));
    }

    private void deleteFile(File file) {
        File dir = file.getParentFile();

        if (file.exists()) {
            if (file.delete())
                log.debug("deleted: " + file);
            else
                log.debug("could not delete: " + file);
        }

        // delete empty directories, recursively up to (but not including) the top download dir
        synchronized (directoryDeleteLock) {
            while (dir != null && !dir.equals(downloadDir)) {
                File parent = dir.getParentFile();
                if (Util.isEmptyDirectory(dir)) {
                    Util.deleteQuietly(dir);
                    if (log.isDebugEnabled()) log.debug("deleted dir: " + dir);
                } else {
                    break;
                }
                dir = parent;
            }
        }
    }


    private class DownloadTask implements Runnable {
        private final Track track;
        private final int initialDelay;
        private Grooveshark grooveshark;
        private volatile HttpPost httpPost;
        private volatile boolean aborted;

        public DownloadTask(Track track, Grooveshark grooveshark, int initialDelay) {
            this.track = track;
            this.grooveshark = grooveshark;
            this.initialDelay = initialDelay;
        }

        public void run() {
            try {
                log.info("start download track " + track);
                Thread.sleep(initialDelay);
                track.setStatus(Track.Status.INITIALIZING);
                if (grooveshark == null)
                    grooveshark = GroovesharkService.connect(httpClientService);
                StreamKey streamKey = grooveshark.getStreamKeyFromSongIDEx(
                        Long.parseLong(track.getSong().getSongID()),
                        false, false, Country.GSLITE_DEFAULT_COUNTRY);
                track.setStatus(Track.Status.DOWNLOADING);
                track.setStartDownloadTime(System.currentTimeMillis());
                if (Boolean.getBoolean("mockNet"))
                    fakedownload();
                else
                    download(streamKey);
                track.setStatus(Track.Status.FINISHED);
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
                deleteFile(track.getFile());
            } finally {
                track.setStopDownloadTime(System.currentTimeMillis());
                synchronized (DownloadService.this) {
                    downloads.remove(track.getFile());
                }
                synchronized (this) {
                    httpPost = null;
                }
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
            httpPost = new HttpPost(format("http://%s/stream.php", streamKey.getIp()));
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
                    File file = track.getFile();
                    File dir = file.getParentFile();
                    if (!dir.exists()) {
                        //noinspection ResultOfMethodCallIgnored
                        dir.mkdirs();
                        if (!dir.exists()) {
                            throw new IOException("could not create directory " + dir);
                        }
                    }
                    FileOutputStream fis = new FileOutputStream(file);
                    outputStream = new MonitoredOutputStream(fis);
                    httpEntity.writeTo(outputStream);
                    outputStream.close();
                    outputStream = null;
                    writeID3Tags();
                } else {
                    throw new HttpResponseException(statusCode,
                            format("%d %s", statusCode, statusLine.getReasonPhrase()));
                }
            } finally {
                close(httpEntity);
                close(outputStream);
            }
        }

        private void fakedownload() throws InterruptedException, IOException {
            Thread.sleep(1000);
            track.setTotalBytes(2 * 1024 * 1024);
            for (int i = 0; i < 1024; i++) {
                track.incDownloadedBytes(2 * 1024);
                if (i > 200 && (track.getSong().getTrackNum() % 2) == 0) {
                    throw new IOException("fake I/O error");
                }
                Thread.sleep(10);
            }
            track.setTotalBytes(2 * 1024 * 1024);
        }

        private void writeID3Tags() throws IOException {
            log.info("writing ID3 tags to " + track);

            File file = track.getFile();

            try {
                ID3V1Tag id3V1Tag = new ID3V1_1Tag();
                ID3V2Tag id3V2Tag = new ID3V2_3_0Tag();

                String artistName = track.getSong().getArtistName();
                if (artistName != null) {
                    id3V1Tag.setArtist(artistName);
                    id3V2Tag.setArtist(artistName);
                }

                String albumName = track.getSong().getAlbumName();
                if (albumName != null) {
                    id3V1Tag.setAlbum(albumName);
                    id3V2Tag.setAlbum(albumName);
                }

                String songName = track.getSong().getSongName();
                if (songName != null) {
                    id3V1Tag.setTitle(songName);
                    id3V2Tag.setTitle(songName);
                }

                String year = track.getSong().getYear();
                if (year != null) {
                    id3V1Tag.setYear(year);
                    try {
                        id3V2Tag.setYear(Integer.parseInt(year));
                    } catch (NumberFormatException ignore) {
                        // ignored
                    }
                }

                Integer trackNum = track.getSong().getTrackNum();
                if (trackNum != null) {
                    id3V2Tag.setTrackNumber(trackNum);
                }

                MP3File mp3File = new MP3File(file);
                mp3File.setID3Tag(id3V1Tag);
                mp3File.setID3Tag(id3V2Tag);
                mp3File.sync();
            }
            catch (ID3Exception ex) {
                throw new IOException("cannot write ID3 tags to file " + file + "; track: " + track + "; reason: " + ex, ex);
            }
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

        private void close(OutputStream outputStream) {
            if (outputStream != null) {
                try {
                    outputStream.close();
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
            }

            @Override
            public void write(byte[] b, int off, int len) throws IOException {
                outputStream.write(b, off, len);
                track.incDownloadedBytes(len);
            }

            @Override
            public void write(int b) throws IOException {
                outputStream.write(b);
                track.incDownloadedBytes(1);
            }
        }
    }
}
