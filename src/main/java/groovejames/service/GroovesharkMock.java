package groovejames.service;

import groovejames.model.Album;
import groovejames.model.Artist;
import groovejames.model.AutocompleteType;
import groovejames.model.Country;
import groovejames.model.ItemByPageNameResult;
import groovejames.model.Playlist;
import groovejames.model.SearchAlbumsResultType;
import groovejames.model.SearchArtistsResultType;
import groovejames.model.SearchPlaylistsResultType;
import groovejames.model.SearchSongsResultType;
import groovejames.model.SearchUsersResultType;
import groovejames.model.Song;
import groovejames.model.Songs;
import groovejames.model.User;

import java.io.IOException;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class GroovesharkMock implements InvocationHandler, Grooveshark {

    private int requestDelay = 500;

    public GroovesharkMock() throws IOException {
        this(200);
    }

    public GroovesharkMock(int constructorDelay) throws IOException {
        try {
            Thread.sleep(constructorDelay);
        } catch (InterruptedException ignore) {
        }
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Method mockMethod = this.getClass().getMethod(method.getName(), method.getParameterTypes());
        Thread.sleep(requestDelay);
        return mockMethod.invoke(this, args);
    }

    public int getRequestDelay() {
        return requestDelay;
    }

    public void setRequestDelay(int requestDelay) {
        this.requestDelay = requestDelay;
    }

    @Override
    public Artist[] getAutocomplete(AutocompleteType type, String query) {
        return getResultsFromSearch(SearchArtistsResultType.Artists, query);
    }

    @Override
    public Artist[] getResultsFromSearch(SearchArtistsResultType type, String query) {
        Artist artist1 = new Artist();
        artist1.setArtistID(1L);
        artist1.setArtistName("Beck");
        artist1.setScore(10000.0);

        Artist artist2 = new Artist();
        artist2.setArtistID(2L);
        artist2.setArtistName("Depeche Mode");
        artist2.setScore(8000.0);

        Artist artist3 = new Artist();
        artist3.setArtistID(3L);
        artist3.setArtistName("Dead Kennedys");
        artist3.setScore(7000.0);

        return new Artist[]{artist1, artist2, artist3};
    }

    @Override
    public Song[] getResultsFromSearch(SearchSongsResultType type, String query) {
        Collection<Song> songs = testsongs().values();
        return songs.toArray(new Song[songs.size()]);
    }

    private HashMap<Long, Song> testsongs() {
        Song song1 = new Song();
        song1.setSongID(1000L);
        song1.setArtistID(1L);
        song1.setArtistName("Beck");
        song1.setAlbumID(1L);
        song1.setAlbumName("Odelay");
        song1.setSongName("New Pollution (track2)");
        song1.setTrackNum(1L);
        song1.setEstimateDuration(278.0);
        song1.setScore(10000.0);
        song1.setPopularity(43049344.0);
        song1.setCoverArtFilename("111102.jpg");

        Song song2 = new Song();
        song2.setSongID(1001L);
        song2.setArtistID(1L);
        song2.setArtistName("Beck");
        song2.setAlbumID(1L);
        song2.setAlbumName("Odelay");
        song2.setSongName("Devil's Haircut (track1)");
        song2.setTrackNum(2L);
        song2.setEstimateDuration(328.0);
        song2.setScore(8500.0);
        song2.setPopularity(42042352.0);
        song2.setCoverArtFilename("111102.jpg");

        Song song3 = new Song();
        song3.setSongID(1002L);
        song3.setArtistID(2L);
        song3.setArtistName("Depeche Mode");
        song3.setAlbumID(2L);
        song3.setAlbumName("Black Celebration");
        song3.setSongName("Black Celebration (track2)");
        song3.setTrackNum(1L);
        song3.setEstimateDuration(60.0);
        song3.setScore(5000.0);
        song3.setPopularity(41320393.0);
        song3.setCoverArtFilename("163137.jpg");

        Song song4 = new Song();
        song4.setSongID(1003L);
        song4.setArtistID(2L);
        song4.setArtistName("Depeche Mode");
        song4.setAlbumID(2L);
        song4.setAlbumName("Black Celebration");
        song4.setSongName("Flies on the windscreen (track1)");
        song4.setTrackNum(2L);
        song4.setEstimateDuration(2032.0);
        song4.setScore(0.0);
        song4.setPopularity(40584948.0);
        song4.setCoverArtFilename("1744206.jpg");

        Song song5 = new Song();
        song5.setSongID(1004L);
        song5.setArtistID(2L);
        song5.setArtistName("Depeche Mode");
        song5.setAlbumID(2L);
        song5.setAlbumName("Black Celebration");
        song5.setSongName("A Question Of Lust (track2)");
        song5.setTrackNum(3L);
        song5.setEstimateDuration(30.0);
        song5.setScore(0.0);
        song5.setCoverArtFilename("1744206.jpg");

        Song song6 = new Song();
        song6.setSongID(1L);
        song6.setArtistID(3L);
        song6.setArtistName("Dead Kennedys");
        song6.setAlbumID(3L);
        song6.setSongName("Hyperactive child (track1)");
        song6.setTrackNum(1L);
        song6.setEstimateDuration(37.0);
        song6.setScore(0.0);
        song6.setCoverArtFilename("571642.jpg");

        Song song7 = new Song();
        song7.setSongID(2L);
        song7.setArtistID(3L);
        song7.setArtistName("Dead Kennedys");
        song7.setAlbumID(3L);
        song7.setSongName("I like short songs (track2)");
        song7.setTrackNum(2L);
        song7.setEstimateDuration(28.0);
        song7.setScore(0.0);
        song7.setCoverArtFilename("571642.jpg");

        HashMap<Long, Song> songs = new HashMap<Long, Song>();
        songs.put(song1.getSongID(), song1);
        songs.put(song2.getSongID(), song2);
        songs.put(song3.getSongID(), song3);
        songs.put(song4.getSongID(), song4);
        songs.put(song5.getSongID(), song5);
        songs.put(song6.getSongID(), song6);
        songs.put(song7.getSongID(), song7);
        return songs;
    }

    @Override
    public Album[] getResultsFromSearch(SearchAlbumsResultType type, String query) {
        Album album1 = new Album();
        album1.setArtistID(1L);
        album1.setArtistName("Beck");
        album1.setAlbumID(1L);
        album1.setAlbumName("Odelay");
        album1.setPopularity(43049344.0);
        album1.setReleaseType("1");

        Album album2 = new Album();
        album2.setArtistID(2L);
        album2.setArtistName("Depeche Mode");
        album2.setAlbumID(2L);
        album2.setAlbumName("Black Celebration");
        album2.setPopularity(43040000.0);
        album2.setReleaseType("2");

        Album album3 = new Album();
        album3.setArtistID(2L);
        album3.setArtistName("Depeche Mode");
        album3.setAlbumID(3L);
        album3.setAlbumName("Some Broken Frame");

        return new Album[]{album1, album2, album3};
    }

    @Override
    public User[] getResultsFromSearch(SearchUsersResultType type, String query) {
        User user1 = new User();
        user1.setUserID(300L);
        user1.setUsername("wwonka");
        user1.setName("Willi Wonka");
        user1.setScore(1000.0);

        User user2 = new User();
        user2.setUserID(301L);
        user2.setUsername("lsnicket");
        user2.setName("Lemony Snicket");
        user2.setScore(900.0);

        User user3 = new User();
        user3.setUserID(302L);
        user3.setUsername("mhatter");
        user3.setName("Mad Hatter");
        user3.setScore(800.0);

        return new User[]{user1, user2, user3};
    }

    @Override
    public Playlist[] getResultsFromSearch(SearchPlaylistsResultType type, String query) {
        Playlist playlist1 = new Playlist();
        playlist1.setPlaylistID(1L);
        playlist1.setName("Willi Wonka's Playlist");
        playlist1.setUserID(300L);
        playlist1.setScore(40954.0);

        Playlist playlist2 = new Playlist();
        playlist2.setPlaylistID(2L);
        playlist2.setName("Mad Hatter's playlist");
        playlist2.setUserID(302L);
        playlist2.setScore(4322323.3);

        return new Playlist[]{playlist1, playlist2};
    }

    @Override
    public Song[] albumGetAllSongs(Long albumID) {
        return getResultsFromSearch(SearchSongsResultType.Songs, null);
    }

    @Override
    public Song[] artistGetArtistSongs(Long artistID) {
        return getResultsFromSearch(SearchSongsResultType.Songs, null);
    }

    @Override
    public Album[] artistGetAllAlbums(Long artistID) {
        return getResultsFromSearch(SearchAlbumsResultType.Albums, null);
    }

    @Override
    public Songs playlistGetSongs(long playlistID) throws Exception {
        Songs songs = new Songs();
        songs.setSongs(getResultsFromSearch(SearchSongsResultType.Songs, null));
        songs.setHasMore(false);
        return songs;
    }

    @Override
    public Song[] getFavorites(String userID, SearchSongsResultType ofWhat) {
        return getResultsFromSearch(SearchSongsResultType.Songs, null);
    }

    @Override
    public Songs userGetSongsInLibrary(String userID, int page) throws Exception {
        Songs songs = new Songs();
        songs.setSongs(getResultsFromSearch(SearchSongsResultType.Songs, null));
        songs.setHasMore(false);
        return songs;
    }

    @Override
    public Playlist[] userGetPlaylists(long userID) {
        Playlist[] arr = getResultsFromSearch(SearchPlaylistsResultType.Playlists, "");
        if (userID == 300L)
            return new Playlist[]{arr[0]}; // Willi Wonka's Playlist
        else if (userID == 302L)
            return new Playlist[]{arr[1]}; // Mad Hatters Playlist
        else
            return new Playlist[]{};
    }

    private int lastAutoplaySong = -1;

    @Override
    public Song autoplayGetSong(Collection<Long> songIDsAlreadySeen, Collection<Long> recentArtists, int minDuration, int maxDuration, Map<String, String> seedArtists, Collection<Long> frowns, long songQueueID, Country country) throws Exception {
        Song[] songs = getResultsFromSearch(SearchSongsResultType.Songs, null);
        Random random = new Random(System.currentTimeMillis());
        int songNo;
        do {
            songNo = random.nextInt(songs.length);
        } while (songNo == lastAutoplaySong);
        lastAutoplaySong = songNo;
        return songs[songNo];
    }

    @Override
    public String getTokenForSong(long songID, Country country) throws Exception {
        return "t" + songID;
    }

    @Override
    public Song getSongFromToken(String token, Country country) throws Exception {
        long songId = Long.parseLong(token.substring(1));
        return testsongs().get(songId);
    }

    @Override
    public ItemByPageNameResult getItemByPageName(String name) throws Exception {
        return null;
    }
}
