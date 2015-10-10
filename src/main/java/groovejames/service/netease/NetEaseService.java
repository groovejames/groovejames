package groovejames.service.netease;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import groovejames.service.HttpClientService;

import java.util.Arrays;
import java.util.List;

public class NetEaseService {

    private static final String MUSIC163_API = "http://music.163.com/api";

    private final HttpClientService httpClientService;

    public NetEaseService(HttpClientService httpClientService) {
        this.httpClientService = httpClientService;
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

    public List<NESong> searchSongs(String searchString) throws Exception {
        HttpResponse<NESongSearchResultResponse> r = Unirest.post(MUSIC163_API + "/search/get")
                .header("Referer", "http://music.163.com")
                .field("s", searchString)
                .field("type", 1) // 1=songs, 10=albums, 100=artists
                .field("offset", 0)
                .field("limit", 50)
                .field("sub", false)
                .asObject(NESongSearchResultResponse.class);
        NESongSearchResultResponse response = r.getBody();
        if (response.code != 200) throw new NetEaseException("error getting songs: " + response.code);
        NESong[] songs = response.result.songs;
        return Arrays.asList(songs);
    }
}
