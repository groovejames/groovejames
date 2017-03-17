package groovejames.batch;

import groovejames.model.Album;
import groovejames.model.Artist;
import groovejames.model.SearchResult;
import groovejames.model.Song;
import groovejames.model.Track;
import groovejames.service.DownloadListener;
import groovejames.service.DownloadService;
import groovejames.service.FilenameSchemeParser;
import groovejames.service.Services;
import groovejames.service.search.AlbumSearch;
import groovejames.service.search.ArtistSearch;
import groovejames.service.search.GeneralSearch;
import groovejames.service.search.SearchParameter;
import groovejames.service.search.SearchType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.text.Collator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.Semaphore;
import java.util.regex.Pattern;

public class BatchDownloader {

    private static final Logger log = LoggerFactory.getLogger(BatchDownloader.class);
    private static final Marker BATCHLOG = MarkerFactory.getMarker("BATCHLOG");

    public static void main(String[] args) throws IOException {
        if (args.length != 1) {
            System.err.println("Usage: BatchDownloader <missingfiles.txt>");
            System.exit(1);
        }
        Runtime.getRuntime().addShutdownHook(new Thread("batchdownloader-shutdownhook") {
            @Override
            public void run() {
                Services.getDownloadService().shutdownNicely();
            }
        });
        new BatchDownloader().processMissingTracks(new File(args[0]));
        System.exit(0);
    }

    private final DownloadStatusListener downloadListener;
    private final String separator = "|";
    private final Map<String, Artist> artistCache = new HashMap<>();
    private final Map<String, Album> albumCache = new HashMap<>();
    private final Artist ARTIST_NOT_FOUND = new Artist();
    private final Album ALBUM_NOT_FOUND = new Album();
    private Writer stillMissingTracksFileWriter;

    private BatchDownloader() {
        DownloadService downloadService = Services.getDownloadService();
        downloadService.setDownloadDir(new File(System.getProperty("user.dir")));
        downloadService.getFilenameSchemeParser().setFilenameScheme(FilenameSchemeParser.DEFAULT_FILENAME_SCHEME);
        this.downloadListener = new DownloadStatusListener();
    }

    private void processMissingTracks(File missingTracksFile) throws IOException {
        File stillMissingTracksFile = computeStillMissingTracksFileName(missingTracksFile);
        stillMissingTracksFileWriter = new FileWriter(stillMissingTracksFile);
        try {
            try (BufferedReader reader = new BufferedReader(new FileReader(missingTracksFile))) {
                String line;
                int lineNo = 0;
                while ((line = reader.readLine()) != null) {
                    lineNo++;
                    String[] split = line.split(Pattern.quote(separator));
                    if (split.length != 3) {
                        log.error(BATCHLOG, "ERROR: Invalid line at {}:{}:\n  {}", missingTracksFile.getName(), lineNo, line);
                    } else {
                        log.info(BATCHLOG, "line {}: searching for: {}", lineNo, line);
                        processLine(split[0], split[1], split[2]);
                    }
                }
            }
            downloadListener.waitUntilDownloadsComplete();
        } finally {
            stillMissingTracksFileWriter.close();
        }
    }

    private File computeStillMissingTracksFileName(File missingTracksFile) {
        for (int i = 1; ; i++) {
            File f = new File(missingTracksFile.getParentFile(), missingTracksFile.getName() + "." + i);
            if (!f.exists()) return f;
        }
    }

    private void processLine(String searchArtist, String searchAlbum, String searchTitle) throws IOException {
        Song song = null;
        try {
            song = search(searchArtist, searchAlbum, searchTitle);
        } catch (Exception ex) {
            log.error(BATCHLOG, "SEARCH ERROR: {}{}{}{}{} - {}", searchArtist, separator, searchAlbum, separator, searchTitle, ex.toString(), ex);
        }
        if (song != null) {
            Services.getDownloadService().download(song, downloadListener);
        } else {
            writeStillMissing(searchArtist, searchAlbum, searchTitle);
        }
    }

    private Song search(String searchArtist, String searchAlbum, String searchTitle) throws Exception {
        Artist artist = findArtist(searchArtist);
        if (artist == null) {
            log.warn(BATCHLOG, "  artist not found: {}", searchArtist);
            return null;
        }
        log.info(BATCHLOG, "  artist found: {}", artist.getArtistName());
        Album album = findAlbum(artist, searchAlbum);
        if (album == null) {
            log.warn(BATCHLOG, "  album not found: {}", searchAlbum);
            return null;
        }
        log.info(BATCHLOG, "  album found: {}", album.getAlbumName());
        Song song = findSong(album, searchTitle);
        if (song == null) {
            log.warn(BATCHLOG, "    title not found: {}", searchTitle);
            return null;
        }
        log.info(BATCHLOG, "    title found: {}", song.getSongName());
        return song;
    }

    private Artist findArtist(String searchArtist) throws Exception {
        Artist cachedArtist = artistCache.get(searchArtist);
        if (cachedArtist != null) return cachedArtist == ARTIST_NOT_FOUND ? null : cachedArtist;
        GeneralSearch generalSearch = new GeneralSearch(searchArtist);
        List<Artist> artists = getAll(generalSearch, SearchType.Artist);
        for (Artist artist : artists) {
            if (fuzzyEquals(searchArtist, artist.getArtistName())) {
                artistCache.put(searchArtist, artist);
                return artist;
            } else {
                log.info(BATCHLOG, "  artist not matching: {}", artist.getArtistName());
            }
        }
        artistCache.put(searchArtist, ARTIST_NOT_FOUND);
        return null;
    }

    private Album findAlbum(Artist artist, String searchAlbum) throws Exception {
        String cacheKey = artist.getArtistID() + "@" + searchAlbum;
        Album cachedAlbum = albumCache.get(cacheKey);
        if (cachedAlbum != null) return cachedAlbum == ALBUM_NOT_FOUND ? null : cachedAlbum;
        ArtistSearch artistSearch = new ArtistSearch(artist.getArtistID(), artist.getArtistName());
        List<Album> albums = getAll(artistSearch, SearchType.Album);
        for (Album album : albums) {
            if (fuzzyEquals(searchAlbum, album.getAlbumName())) {
                albumCache.put(cacheKey, album);
                return album;
            } else {
                log.info(BATCHLOG, "  album not matching: {}", album.getAlbumName());
            }
        }
        albumCache.put(cacheKey, ALBUM_NOT_FOUND);
        return null;
    }

    private Song findSong(Album album, String searchTitle) throws Exception {
        AlbumSearch albumSearch = new AlbumSearch(album.getAlbumID(), album.getAlbumName(), album.getArtistName(), false);
        List<Song> songs = getAll(albumSearch, SearchType.Songs);
        for (Song song : songs) {
            if (fuzzyEquals(searchTitle, song.getSongName()))
                return song;
            else
                log.info(BATCHLOG, "    title not matching: {}", song.getSongName());
        }
        log.info(BATCHLOG, "  searching misc songs...");
        ArtistSearch artistSearch = new ArtistSearch(album.getArtistID(), album.getArtistName());
        songs = getAll(artistSearch, SearchType.Songs);
        for (Song song : songs) {
            if (fuzzyEquals(searchTitle, song.getSongName()))
                return song;
            else
                log.info(BATCHLOG, "    title not matching: {}", song.getSongName());
        }
        return null;
    }

    private void writeStillMissing(String searchArtist, String searchAlbum, String searchTitle) throws IOException {
        stillMissingTracksFileWriter.write(searchArtist + separator + searchAlbum + separator + searchTitle + "\n");
        stillMissingTracksFileWriter.flush();
    }

    private <T> List<T> getAll(SearchParameter searchParameter, SearchType searchType) throws Exception {
        ArrayList<T> list = new ArrayList<>();
        do {
            SearchResult<?> searchResult;
            switch (searchType) {
                default:
                case Artist:
                    searchResult = Services.getSearchService().searchArtists(searchParameter);
                    break;
                case Album:
                    searchResult = Services.getSearchService().searchAlbums(searchParameter);
                    break;
                case Songs:
                    searchResult = Services.getSearchService().searchSongs(searchParameter);
                    break;
            }
            T[] result = getResult(searchResult);
            if (result != null && result.length > 0) {
                list.addAll(Arrays.asList(result));
                if (searchResult.isTotalUnknown() && searchResult.hasMore()) {
                    searchParameter.setOffset(searchParameter.getOffset() + result.length);
                }
            }
            if (!searchResult.isTotalUnknown() && searchResult.getTotal() <= list.size()) {
                break;
            }
        } while (true);
        return list;
    }

    @SuppressWarnings("unchecked")
    private <T> T[] getResult(SearchResult<?> searchResult) {
        return (T[]) searchResult.getResult();
    }


    private class DownloadStatusListener implements DownloadListener {
        private final Semaphore semaphore = new Semaphore(1);
        private volatile int numberOfDownloads = 0;
        private volatile boolean trackQueued = false;

        {
            semaphore.acquireUninterruptibly();
        }

        @Override
        public synchronized void statusChanged(Track track) {
            if (track.getStatus() == Track.Status.QUEUED) {
                numberOfDownloads++;
                trackQueued = true;
            } else if (track.getStatus().isFinished()) {
                numberOfDownloads--;
                if (numberOfDownloads <= 0) semaphore.release();
                if (track.getStatus() == Track.Status.ERROR) {
                    log.error(BATCHLOG, "DOWNLOAD ERROR: {}|{}|{} (id:{}): {}", track.getArtistName(), separator, track.getAlbumName(), separator, track.getSongName(), separator, track.getSong().getSongID(), track.getFault(), track.getFault());
                    try {
                        writeStillMissing(track.getArtistName(), track.getAlbumName(), track.getSongName());
                    } catch (IOException ex) {
                        log.error(BATCHLOG, "DOWNLOAD ERROR: cannot write missing entry", ex);
                    }
                }
            }
        }

        @Override
        public void downloadedBytesChanged(Track track) {
        }

        void waitUntilDownloadsComplete() {
            if (trackQueued) semaphore.acquireUninterruptibly();
        }
    }


    private static final Collator collator = Collator.getInstance(Locale.ENGLISH);

    static {
        collator.setStrength(Collator.PRIMARY);
    }

    private static boolean fuzzyEquals(String a, String b) {
        return collator.compare(normalize(a), normalize(b)) == 0;
    }

    private static String normalize(String s) {
        s = s.toLowerCase(Locale.ENGLISH);
        s = s.replaceAll("[ !\"§$%&/()\\[\\]=?`*+#'<>,;.:-_’]", "");
        return s;
    }

}
