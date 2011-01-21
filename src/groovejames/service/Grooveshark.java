package groovejames.service;

import groovejames.model.Artist;
import groovejames.model.Country;
import groovejames.model.SearchSongsResultType;
import groovejames.model.SearchUsersResultType;
import groovejames.model.Song;
import groovejames.model.Songs;
import groovejames.model.StreamKey;
import groovejames.model.User;

public interface Grooveshark {

    @ResultPath("result") Song[] getSearchResultsEx(@Param("type") SearchSongsResultType type,
                                                    @Param("query") String query)
            throws Exception;

    @ResultPath("result") User[] getSearchResultsEx(@Param("type") SearchUsersResultType type,
                                                    @Param("query") String query)
            throws Exception;

    Songs albumGetSongs(@Param("albumID") String albumID,
                        @Param("offset") int offset,
                        @Param("isVerified") boolean isVerified)
            throws Exception;


    Songs artistGetSongs(@Param("artistID") String artistID,
                         @Param("offset") int offset,
                         @Param("isVerified") boolean isVerified)
            throws Exception;

    @ResultPath("SimilarArtists") Artist[] artistGetSimilarArtists(@Param("artistID") long artistID)
            throws Exception;

    @ResultPath("Songs") Song[] userGetSongsInLibrary(@Param("userID") String userID,
                                                      @Param("page") int page)
            throws Exception;

    StreamKey getStreamKeyFromSongIDEx(@Param("songID") long songID,
                                       @Param("mobile") boolean mobile,
                                       @Param("prefetch") boolean prefetch,
                                       @Param("country") Country country)
            throws Exception;

}
