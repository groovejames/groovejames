package groovejames.service;

import groovejames.model.Country;
import groovejames.model.SearchSongsResultType;
import groovejames.model.SearchUsersResultType;
import groovejames.model.Song;
import groovejames.model.Songs;
import groovejames.model.StreamKey;
import groovejames.model.User;

public interface Grooveshark {

    final String CLIENT_NAME = System.getProperty("grooveshark.client.name", "htmlshark");
    final String CLIENT_REVISION = System.getProperty("grooveshark.client.revision", "20110722");
    final String SECRET = System.getProperty("grooveshark.secret", "neverGonnaGiveYouUp");

    @ResultPath("result") Song[] getSearchResultsEx(@Param("type") SearchSongsResultType type,
                                                    @Param("query") String query)
        throws Exception;

    @ResultPath("result") User[] getSearchResultsEx(@Param("type") SearchUsersResultType type,
                                                    @Param("query") String query)
        throws Exception;

    Songs albumGetSongs(@Param("albumID") Long albumID,
                        @Param("offset") int offset,
                        @Param("isVerified") boolean isVerified)
        throws Exception;


    Songs artistGetSongs(@Param("artistID") String artistID,
                         @Param("offset") int offset,
                         @Param("isVerified") boolean isVerified)
        throws Exception;

    Song[] getFavorites(@Param("userID") String userID,
                        @Param("ofWhat") SearchSongsResultType ofWhat)
        throws Exception;

    Songs userGetSongsInLibrary(@Param("userID") String userID,
                                @Param("page") int page)
        throws Exception;

    @Header(clientName = "jsqueue", clientRevision = "20110722.01", secret = "neverGonnaLetYouDown")
    StreamKey getStreamKeyFromSongIDEx(@Param("songID") long songID,
                                       @Param("mobile") boolean mobile,
                                       @Param("prefetch") boolean prefetch,
                                       @Param("country") Country country)
        throws Exception;

}
