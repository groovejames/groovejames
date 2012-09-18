package groovejames.service;

import groovejames.model.AutocompleteType;
import groovejames.model.Country;
import groovejames.model.ItemByPageNameResult;
import groovejames.model.Playlist;
import groovejames.model.SearchPlaylistsResultType;
import groovejames.model.SearchSongsResultType;
import groovejames.model.SearchUsersResultType;
import groovejames.model.Song;
import groovejames.model.Songs;
import groovejames.model.StreamKey;
import groovejames.model.User;

import java.util.Collection;
import java.util.Map;

public interface Grooveshark {

    final String CLIENT_NAME = System.getProperty("grooveshark.client.name", "htmlshark");
    final String CLIENT_REVISION = System.getProperty("grooveshark.client.revision", "20120312");

    // hint: search for "$.Class.extend("GS.Controllers.ServiceController" in app.js
    // or controllerKey in com.grooveshark.jsQueue.Controller in JSQueue.swf
    final String SECRET = System.getProperty("grooveshark.secret", "breakfastBurritos");

    Song[] getAutocomplete(@Param("type") AutocompleteType type,
                           @Param("query") String query)
        throws Exception;

    @ResultPath("result") Song[] getResultsFromSearch(@Param("type") SearchSongsResultType type,
                                                      @Param("query") String query)
        throws Exception;

    @ResultPath("result") User[] getResultsFromSearch(@Param("type") SearchUsersResultType type,
                                                      @Param("query") String query)
        throws Exception;

    @ResultPath("result") Playlist[] getResultsFromSearch(@Param("type") SearchPlaylistsResultType type,
                                                          @Param("query") String query)
        throws Exception;

    Song[] albumGetAllSongs(@Param("albumID") Long albumID)
        throws Exception;

    Song[] artistGetAllSongs(@Param("artistID") String artistID)
        throws Exception;

    Songs playlistGetSongs(@Param("playlistID") long playlistID)
        throws Exception;

    Song[] getFavorites(@Param("userID") String userID,
                        @Param("ofWhat") SearchSongsResultType ofWhat)
        throws Exception;

    Songs userGetSongsInLibrary(@Param("userID") String userID,
                                @Param("page") int page)
        throws Exception;

    @ResultPath("Playlists") Playlist[] userGetPlaylists(@Param("userID") long userID)
        throws Exception;

    // hint: class com.grooveshark.jsQueue.Service in JSQueue.swf
    @Header(clientName = "jsqueue", clientRevision = "20120312.08", secret = "circlesAndSquares")
    StreamKey getStreamKeyFromSongIDEx(@Param("songID") long songID,
                                       @Param("type") long type,
                                       @Param("mobile") boolean mobile,
                                       @Param("prefetch") boolean prefetch,
                                       @Param("country") Country country)
        throws Exception;

    @Header(clientName = "jsqueue", clientRevision = "20120312.08", secret = "circlesAndSquares")
    Song autoplayGetSong(@Param("songIDsAlreadySeen") Collection<Long> songIDsAlreadySeen,
                         @Param("recentArtists") Collection<Long> recentArtists,
                         @Param("minDuration") int minDuration,
                         @Param("maxDuration") int maxDuration,
                         @Param("seedArtists") Map<String, String> seedArtists,
                         @Param("frowns") Collection<Long> frowns,
                         @Param("songQueueID") long songQueueID,
                         @Param("country") Country country)
        throws Exception;

    @ResultPath("Token") String getTokenForSong(@Param("songID") long songID, @Param("country") Country country)
        throws Exception;

    Song getSongFromToken(@Param("token") String token, @Param("country") Country country)
        throws Exception;

    ItemByPageNameResult getItemByPageName(@Param("name") String name)
        throws Exception;
}
