package groovejames.service.netease;

import java.util.ArrayList;

public class NetEaseServiceMock implements INetEaseService {

    private static final int total = 234;

    @Override
    public NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception {
        int cnt = 0;
        ArrayList<NESong> songs = new ArrayList<>();
        for (int i = offset; i < total && cnt < limit; i++, cnt++) {
            NESong song = new NESong();
            song.id = searchString.hashCode() + i;
            song.name = searchString + i;
            song.album = createAlbum(searchString);
            song.artists = new NEArtist[]{createArtist(searchString)};
            songs.add(song);
        }
        NESongSearchResult result = new NESongSearchResult();
        result.songCount = total;
        result.songs = songs.toArray(new NESong[songs.size()]);
        return result;
    }

    @Override
    public NESongDetails getSongDetails(long songID) throws Exception {
        NESongDetails songDetails = new NESongDetails();
        songDetails.id = songID;
        songDetails.duration = 3 * 60 * 1000;
        return songDetails;
    }

    @Override
    public String getDownloadUrl(NESongDetails songDetails) {
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
}
