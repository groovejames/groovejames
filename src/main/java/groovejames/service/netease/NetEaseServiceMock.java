package groovejames.service.netease;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class NetEaseServiceMock implements INetEaseService {

    private static final int total = 234;
    private static final int delay = 1000;

    private String latestSearch;

    @Override
    public NEAccount login(String username, String password) throws Exception {
        NEAccount account = new NEAccount();
        account.id = 1L;
        return account;
    }

    @Override
    public NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception {
        int cnt = 0;
        ArrayList<NESong> songs = new ArrayList<>();
        for (int i = offset; i < total && cnt < limit; i++, cnt++) {
            NESong song = new NESong();
            song.id = searchString.hashCode() + i;
            songs.add(song);
        }
        NESongSearchResult result = new NESongSearchResult();
        result.songCount = total;
        result.songs = songs.toArray(new NESong[songs.size()]);
        this.latestSearch = searchString; // for getSongDetails()
        delay();
        return result;
    }

    @Override
    public NEArtistSearchResult searchArtists(String searchString, int offset, int limit) throws Exception {
        return null; // TODO
    }

    @Override
    public NEAlbumSearchResult searchAlbums(String searchString, int offset, int limit) throws Exception {
        return null; // TODO
    }

    @Override
    public NEPlaylistSearchResult searchPlaylists(String searchString, int offset, int limit) throws Exception {
        return null; // TODO
    }

    @Override
    public NEArtistDetailsResponse getHotSongs(long artistID) throws Exception {
        return null; // TODO
    }

    @Override
    public NEArtistAlbumsResultResponse getAlbums(long artistID, int offset, int limit) throws Exception {
        return null; // TODO
    }

    @Override
    public NEAlbum getAlbum(long albumID) throws Exception {
        return null; // TODO
    }

    @Override
    public Map<Long, NESongDetails> getSongDetails(Collection<Long> songIDs) throws Exception {
        Map<Long, NESongDetails> result = new HashMap<>();
        int i = 0;
        for (long songID : songIDs) {
            NESongDetails songDetails = new NESongDetails();
            songDetails.id = songID;
            songDetails.name = latestSearch + i;
            songDetails.album = createAlbum(latestSearch);
            songDetails.artists = new NEArtist[] {createArtist(latestSearch)};
            songDetails.duration = 3 * 60 * 1000;
            result.put(songID, songDetails);
        }
        delay();
        return result;
    }

    @Override
    public NEPlaylistDetails getPlaylistDetails(long playlistID) {
        return null; // TODO
    }

    @Override
    public NESongDetails[] getSimilarSongs(long songID) throws Exception {
        return null; // TODO
    }

    @Override
    public NEArtist[] getSimilarArtists(long artistID) throws Exception {
        return null; // TODO
    }

    @Override
    public NESuggestionsResult getSuggestions(String query, int limit) {
        return null; // TODO
    }

    @Override
    public String determineDownloadURL1(NESongDetails songDetails) throws Exception {
        return null;
    }

    @Override
    public String determineDownloadURL2(long songID, int bitrate) throws Exception {
        return null;
    }

    private NEAlbum createAlbum(String name) {
        NEAlbum album = new NEAlbum();
        album.name = "Album " + name;
        album.id = album.name.hashCode();
        return album;
    }

    private NEArtist createArtist(String name) {
        NEArtist artist = new NEArtist();
        artist.name = "Artist " + name;
        artist.id = artist.name.hashCode();
        return artist;
    }

    private void delay() throws InterruptedException {
        Thread.sleep(delay);
    }
}
