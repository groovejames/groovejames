package groovejames.model;

import groovejames.util.FileUtils;
import org.blinkenlights.jid3.ID3Exception;
import org.blinkenlights.jid3.MP3File;
import org.blinkenlights.jid3.v1.ID3V1Tag;
import org.blinkenlights.jid3.v1.ID3V1_1Tag;
import org.blinkenlights.jid3.v2.ID3V2_3_0Tag;
import org.blinkenlights.jid3.v2.TPE2TextInformationID3V2Frame;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class FileStore implements Store {

    private static final Logger log = LoggerFactory.getLogger(FileStore.class);
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
        log.info("writing ID3 tags to {}", track);

        try {
            ID3V1Tag id3V1Tag = new ID3V1_1Tag();
            ID3V2_3_0Tag id3V2Tag = new ID3V2_3_0Tag();

            String artistName = track.getSong().getArtistName();
            if (artistName != null) {
                id3V1Tag.setArtist(fixLongIDV1String(artistName));
                id3V2Tag.setArtist(artistName);
            }

            String albumName = track.getSong().getAlbumName();
            if (albumName != null) {
                id3V1Tag.setAlbum(fixLongIDV1String(albumName));
                id3V2Tag.setAlbum(albumName);
            }

            String albumArtisName = track.getSong().getAlbumArtistName();
            if (albumArtisName != null) {
                id3V2Tag.removeTPE2TextInformationFrame();
                id3V2Tag.setTPE2TextInformationFrame(new TPE2TextInformationID3V2Frame(albumArtisName));
            }

            String songName = track.getSong().getSongName();
            if (songName != null) {
                id3V1Tag.setTitle(fixLongIDV1String(songName));
                id3V2Tag.setTitle(songName);
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

    @Override public void deleteStore() {
        if (file.exists()) {
            if (file.delete())
                log.debug("deleted: {}", file);
            else
                log.debug("could not delete: {}", file);
        }

        // delete empty directories, recursively up to (but not including) the top download dir
        File dir = file.getParentFile();
        synchronized (directoryDeleteLock) {
            while (dir != null && !dir.equals(downloadDir)) {
                File parent = dir.getParentFile();
                if (FileUtils.isEmptyDirectory(dir)) {
                    FileUtils.deleteQuietly(dir);
                    log.debug("deleted dir: {}", dir);
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

    /**
     * This method fixes a bug in org.blinkenlights.jid3:JID3 v0.46:
     * if the first 30 characters of a song/album/artist string contains
     * a Unicode character > 256 then the IDv3 tag is not properly truncated
     * to the maximum allowed amount of 30 chars, leading to a
     * NegativeArraySizeException. This fixup method returns a properly
     * truncated string, whose bytes representation is no longer than 30
     * chars, even if it contains two-byte Unicode codepoints.
     *
     * @param s song/album/artist name
     * @return properly truncated string
     */
    private static String fixLongIDV1String(String s) {
        if (s.length() > 30) s = s.substring(0, 30);
        byte[] bytes;
        do {
            bytes = s.getBytes();
            if (bytes.length > 30) s = s.substring(s.length() - 1);
        } while (bytes.length > 30);
        return new String(bytes);
    }

}
