package groovejames.service.netease;

public interface INetEaseService {

    NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception;

    NESongDetails getSongDetails(long songID) throws Exception;

    String getDownloadUrl(NESongDetails songDetails);

}
