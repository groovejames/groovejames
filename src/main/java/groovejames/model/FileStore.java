package groovejames.model;

import groovejames.util.Util;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.blinkenlights.jid3.ID3Exception;
import org.blinkenlights.jid3.MP3File;
import org.blinkenlights.jid3.v1.ID3V1Tag;
import org.blinkenlights.jid3.v1.ID3V1_1Tag;
import org.blinkenlights.jid3.v2.ID3V2Tag;
import org.blinkenlights.jid3.v2.ID3V2_3_0Tag;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class FileStore implements Store {

    private static final Log log = LogFactory.getLog(FileStore.class);
    private static final Object directoryDeleteLock = new Object();

    private final File file;
    private final File downloadDir;

    public FileStore(File file, File downloadDir) {
        this.file = file;
        this.downloadDir = downloadDir;
    }

    @Override public OutputStream getOutputStream() throws IOException {
        File dir = file.getParentFile();
        if (!dir.exists()) {
            //noinspection ResultOfMethodCallIgnored
            dir.mkdirs();
            if (!dir.exists()) {
                throw new IOException("could not create directory " + dir);
            }
        }
        return new FileOutputStream(file);
    }

    @Override public InputStream getInputStream() throws IOException {
        return new BufferedInputStream(new FileInputStream(file));
    }

    @Override public void writeTrackInfo(Track track) throws IOException {
        log.info("writing ID3 tags to " + track);

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

            Long trackNum = track.getSong().getTrackNum();
            if (trackNum != null) {
                id3V2Tag.setTrackNumber(trackNum.intValue());
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

    @Override public void deleteStore() {
        if (file.exists()) {
            if (file.delete())
                log.debug("deleted: " + file);
            else
                log.debug("could not delete: " + file);
        }

        // delete empty directories, recursively up to (but not including) the top download dir
        File dir = file.getParentFile();
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

    @Override public String getDescription() {
        return file.getAbsolutePath();
    }

    @Override public boolean isSameLocation(Store other) {
        return other instanceof FileStore && file.equals(((FileStore)other).file);
    }
}
