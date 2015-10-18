package groovejames.service.netease;

import java.util.Map;

public interface INetEaseService {

    NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception;

    Map<Long, NESongDetails> getSongDetails(long[] songIDs) throws Exception;

    String getDownloadUrl(NESongDetails songDetails);

}
