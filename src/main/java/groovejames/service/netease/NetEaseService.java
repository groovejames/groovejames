package groovejames.service.netease;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import groovejames.service.HttpClientService;
import groovejames.util.Util;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

public class NetEaseService implements INetEaseService {

    private static final String MUSIC163_API = "http://music.163.com/api";
    private static final String SECRET = System.getProperty("netease.secret", "3go8&$8*3*3h0k(2)2");
    private static final int SEARCH_TYPE_SONGS = 1;
    private static final int SEARCH_TYPE_ALBUMS = 10;
    private static final int SEARCH_TYPE_ARTISTS = 100;
    private static final int SEARCH_TYPE_PLAYLISTS = 1000;

    public NetEaseService(HttpClientService httpClientService) {
        Unirest.setHttpClient(httpClientService.getHttpClient());
        Unirest.setObjectMapper(new JacksonObjectMapper());
    }

    @Override
    public NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception {
        HttpResponse<NESongSearchResultResponse> r1 = Unirest.post(MUSIC163_API + "/search/get")
                .header("Referer", "http://music.163.com")
                .field("s", searchString)
                .field("type", SEARCH_TYPE_SONGS)
                .field("offset", offset)
                .field("limit", limit)
                .field("sub", false)
                .asObject(NESongSearchResultResponse.class);
        NESongSearchResultResponse response = r1.getBody();
        if (response.code != 200) throw new NetEaseException("error getting songs: " + response.code);
        return response.result;
    }

    @Override
    public Map<Long, NESongDetails> getSongDetails(long[] songIDs) throws Exception {
        String songIDList = "[" + Util.join(songIDs, ',') + "]";
        HttpResponse<NESongDetailsResultResponse> r = Unirest.post(MUSIC163_API + "/song/detail")
                .header("Referer", "http://music.163.com")
                .field("ids", songIDList)
                .asObject(NESongDetailsResultResponse.class);
        NESongDetailsResultResponse result = r.getBody();
        if (result.code != 200) throw new NetEaseException("error getting song details: " + result.code);
        if (result.songs == null || result.songs.length == 0) throw new NetEaseException("song details not found for song ids: " + songIDList);
        Map<Long, NESongDetails> map = new HashMap<>();
        for (NESongDetails song : result.songs) {
            map.put(song.id, song);
        }
        return map;
    }

    @Override
    public String getDownloadUrl(NESongDetails songDetails) {
        NEStreamInfo streamInfo = findBestStreamInfo(songDetails);
        if (streamInfo == null) {
            if (Util.isEmpty(songDetails.mp3Url))
                throw new NetEaseException("no download location for song id " + songDetails.id);
            return songDetails.mp3Url;
        }
        String encryptedId = encryptId(streamInfo);
        String baseUrl = Util.stripPath(songDetails.mp3Url);
        if (baseUrl == null) baseUrl = "http://m1.music.126.net";
        return String.format("%s/%s/%s.%s", baseUrl, encryptedId, streamInfo.dfsId, streamInfo.extension);
    }

    private NEStreamInfo findBestStreamInfo(NESongDetails songDetails) {
        if (songDetails.hMusic != null) return songDetails.hMusic;
        if (songDetails.mMusic != null) return songDetails.mMusic;
        if (songDetails.lMusic != null) return songDetails.lMusic;
        return songDetails.bMusic;
    }

    private String encryptId(NEStreamInfo streamInfo) {
        try {
            // from https://github.com/yanunon/NeteaseCloudMusic
            byte[] byte1 = SECRET.getBytes("US-ASCII");
            byte[] byte2 = String.valueOf(streamInfo.dfsId).getBytes("US-ASCII");
            int byte1_len = byte1.length;
            for (int i = 0; i < byte2.length; i++) {
                byte2[i] = (byte) (byte2[i] ^ byte1[i % byte1_len]);
            }
            MessageDigest m = MessageDigest.getInstance("MD5");
            m.update(byte2);
            String result = Base64.encodeBase64String(m.digest());
            result = result.replace('/', '_');
            result = result.replace('+', '-');
            return result;
        } catch (UnsupportedEncodingException | NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

}
