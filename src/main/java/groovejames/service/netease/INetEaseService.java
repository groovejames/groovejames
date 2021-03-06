package groovejames.service.netease;

import java.util.List;

public interface INetEaseService {

    NEAccount login(String username, String password) throws Exception;

    NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception;

    NEArtistSearchResult searchArtists(String searchString, int offset, int limit) throws Exception;

    NEAlbumSearchResult searchAlbums(String searchString, int offset, int limit) throws Exception;

    NEPlaylistSearchResult searchPlaylists(String searchString, int offset, int limit) throws Exception;

    NEArtistDetailsResponse getHotSongs(long artistID) throws Exception;

    NEArtistAlbumsResultResponse getAlbums(long artistID, int offset, int limit) throws Exception;

    NEAlbum getAlbum(long albumID) throws Exception;

    /** return details for a list of songs. Return the details in the same order as specified in the {@code songIDs} list */
    NESongDetails[] getSongDetails(List<Long> songIDs) throws Exception;

    NEPlaylistDetails getPlaylistDetails(long playlistID) throws Exception;

    NESongDetails[] getSimilarSongs(long songID) throws Exception;

    NEArtist[] getSimilarArtists(long artistID) throws Exception;

    NESuggestionsResult getSuggestions(String query, int limit) throws Exception;

    String determineDownloadURL(long songID, int bitrate) throws Exception;

    String determineAlternativeDownloadURL(NESongDetails songDetails) throws Exception;

}
