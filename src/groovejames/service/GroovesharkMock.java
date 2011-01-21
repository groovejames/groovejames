package groovejames.service;

import groovejames.model.Artist;
import groovejames.model.Country;
import groovejames.model.SearchSongsResultType;
import groovejames.model.SearchUsersResultType;
import groovejames.model.Song;
import groovejames.model.Songs;
import groovejames.model.StreamKey;
import groovejames.model.User;

import java.io.IOException;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

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
    public Song[] getSearchResultsEx(SearchSongsResultType type, String query) {
        if (type == SearchSongsResultType.Artists) {
            Song song1 = new Song();
            song1.setArtistID("1");
            song1.setArtistName("Beck");
            song1.setRank(1.0);

            Song song2 = new Song();
            song2.setArtistID("2");
            song2.setArtistName("Depeche Mode");
            song2.setRank(0.8);

            return new Song[]{song1, song2};
        } else {
            Song song1 = new Song();
            song1.setSongID("1000");
            song1.setArtistID("1");
            song1.setArtistName("Beck");
            song1.setAlbumID("1");
            song1.setAlbumName("Odelay");
            song1.setSongName("New Pollution");
            song1.setTrackNum(1);
            song1.setEstimateDuration(278L);
            song1.setRank(1.0);

            Song song2 = new Song();
            song2.setSongID("1001");
            song2.setArtistID("1");
            song2.setArtistName("Beck");
            song2.setAlbumID("1");
            song2.setAlbumName("Odelay");
            song2.setSongName("Devil's Haircut");
            song2.setTrackNum(2);
            song2.setEstimateDuration(328L);
            song2.setRank(0.8);

            Song song3 = new Song();
            song3.setSongID("1002");
            song3.setArtistID("2");
            song3.setArtistName("Depeche Mode");
            song3.setAlbumID("2");
            song3.setAlbumName("Black Celebration");
            song3.setSongName("Black Celebration");
            song3.setTrackNum(1);
            song3.setEstimateDuration(199L);
            song3.setRank(0.5);

            Song song4 = new Song();
            song4.setSongID("1003");
            song4.setArtistID("2");
            song4.setArtistName("Depeche Mode");
            song4.setAlbumID("2");
            song4.setAlbumName("Black Celebration");
            song4.setSongName("Flies on the windscreen");
            song4.setTrackNum(2);
            song4.setEstimateDuration(2032L);
            song4.setRank(0.0);

            return new Song[]{song1, song2, song3, song4};
        }
    }

    @Override
    public User[] getSearchResultsEx(SearchUsersResultType type, String query) {
        User user1 = new User();
        user1.setUserID("aaa");
        user1.setUsername("riuerigurig");
        user1.setRank(1.0);

        User user2 = new User();
        user2.setUserID("bbb");
        user2.setUsername("ergrgruirutirugri");
        user2.setRank(0.9);

        User user3 = new User();
        user3.setUserID("ccc");
        user3.setUsername("dfeuieurrrt");
        user3.setRank(0.8);

        return new User[]{user1, user2, user3};
    }

    @Override
    public Songs albumGetSongs(String albumID, int offset, boolean isVerified) {
        return artistGetSongs(null, 0, false);
    }

    @Override
    public Songs artistGetSongs(String artistID, int offset, boolean isVerified) {
        Songs songs = new Songs();
        songs.setSongs(getSearchResultsEx(SearchSongsResultType.Songs, null));
        songs.setHasMore(false);
        return songs;
    }

    @Override
    public Artist[] artistGetSimilarArtists(long artistID) {
        Artist artist1 = new Artist();
        artist1.setArtistID("1");
        artist1.setName("Beck");

        Artist artist2 = new Artist();
        artist2.setArtistID("2");
        artist2.setName("Depeche Mode");

        return new Artist[]{artist1, artist2};
    }

    @Override
    public Song[] userGetSongsInLibrary(String userID, int page) throws Exception {
        return getSearchResultsEx(SearchSongsResultType.Songs, null);
    }

    @Override
    public StreamKey getStreamKeyFromSongIDEx(long songID, boolean mobile, boolean prefetch, Country country) {
        return new StreamKey("dummystreamkey-" + songID, "dummystreamserver.com", 1L);
    }
}
