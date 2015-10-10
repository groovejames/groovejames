package groovejames.service.netease;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import groovejames.service.HttpClientService;

import java.util.ArrayList;
import java.util.List;

import static java.util.Arrays.asList;

public class NetEaseService {

    private static final String MUSIC163_API = "http://music.163.com/api";

    public NetEaseService(HttpClientService httpClientService) {
        Unirest.setHttpClient(httpClientService.getHttpClient());
        Unirest.setObjectMapper(new JacksonObjectMapper());
    }

    public NESongDetails getSongDetails(long songID) throws Exception {
        HttpResponse<NESongDetailsResultResponse> r = Unirest.post(MUSIC163_API + "/song/detail")
                .header("Referer", "http://music.163.com")
                .field("ids", "[" + songID + "]")
                .asObject(NESongDetailsResultResponse.class);
        NESongDetailsResultResponse result = r.getBody();
        if (result.code != 200) throw new NetEaseException("error getting song details: " + result.code);
        if (result.songs == null || result.songs.length == 0) throw new NetEaseException("song details not found for song id: " + songID);
        return result.songs[0];
    }

    public List<NESong> searchSongs(String searchString, boolean fetchAll) throws Exception {
        List<NESong> result = new ArrayList<>();
        NESongSearchResult r = searchSongs(searchString, 0, 50);
        if (r.songs == null) return result;
        result.addAll(asList(r.songs));
        if (fetchAll && r.songCount > r.songs.length) {
            do {
                r = searchSongs(searchString, result.size(), 50);
                if (r.songs == null) break;
                result.addAll(asList(r.songs));
            } while (r.songs.length > 0);
        }
        return result;
    }

    private NESongSearchResult searchSongs(String searchString, int offset, int limit) throws com.mashape.unirest.http.exceptions.UnirestException {
        HttpResponse<NESongSearchResultResponse> r = Unirest.post(MUSIC163_API + "/search/get")
                .header("Referer", "http://music.163.com")
                .field("s", searchString)
                .field("type", 1) // 1=songs, 10=albums, 100=artists
                .field("offset", offset)
                .field("limit", limit)
                .field("sub", false)
                .asObject(NESongSearchResultResponse.class);
        NESongSearchResultResponse response = r.getBody();
        if (response.code != 200) throw new NetEaseException("error getting songs: " + response.code);
        return response.result;
    }
}
