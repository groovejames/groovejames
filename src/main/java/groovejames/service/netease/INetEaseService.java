package groovejames.service.netease;

import java.util.Map;

public interface INetEaseService {

    NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception;

    NEArtistSearchResult searchArtists(String searchString, int offset, int limit) throws Exception;

    NEAlbumSearchResult searchAlbums(String searchString, int offset, int limit) throws Exception;

    NEPlaylistSearchResult searchPlaylists(String searchString, int offset, int limit) throws Exception;

    NEArtistDetailsResponse getHotSongs(long artistID) throws Exception;

    NEArtistAlbumsResultResponse getAlbums(long artistID, int offset, int limit) throws Exception;

    NEAlbum getAlbum(long albumID) throws Exception;

    Map<Long, NESongDetails> getSongDetails(long[] songIDs) throws Exception;

    NESuggestionsResult getSuggestions(String query, int limit) throws Exception;

    NEDownloadInfo getDownloadInfo(NESongDetails songDetails);

}
