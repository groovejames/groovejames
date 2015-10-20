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
    private static final String REFERER = "http://music.163.com";

    enum SearchType {
        songs(1), albums(10), artists(100), playlists(1000), users(1002), unknown(1009);

        private final int type;

        SearchType(int type) {
            this.type = type;
        }
    }

    public NetEaseService(HttpClientService httpClientService) {
        Unirest.setObjectMapper(new JacksonObjectMapper());
        Unirest.setDefaultHeader("Referer", REFERER);
        Unirest.setDefaultHeader("User-Agent", HttpClientService.USER_AGENT);
        Unirest.setHttpClient(httpClientService.getHttpClient());
    }

    @Override
    public NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception {
        NESongSearchResultResponse response = search(searchString, offset, limit, SearchType.songs, NESongSearchResultResponse.class);
        return response.result;
    }

    @Override
    public NEArtistSearchResult searchArtists(String searchString, int offset, int limit) throws Exception {
        NEArtistSearchResultResponse response = search(searchString, offset, limit, SearchType.artists, NEArtistSearchResultResponse.class);
        return response.result;
    }

    @Override
    public NEPlaylistSearchResult searchPlaylists(String searchString, int offset, int limit) throws Exception {
        NEPlaylistSearchResultResponse response = search(searchString, offset, limit, SearchType.playlists, NEPlaylistSearchResultResponse.class);
        return response.result;
    }

    private <T extends NEResponse> T search(String searchString, int offset, int limit, SearchType searchType, Class<T> responseClass) throws com.mashape.unirest.http.exceptions.UnirestException {
        HttpResponse<T> httpResponse = Unirest.post(MUSIC163_API + "/search/get")
                .field("s", searchString)
                .field("type", searchType.type)
                .field("offset", offset)
                .field("limit", limit)
                .field("sub", false)
                .asObject(responseClass);
        T response = httpResponse.getBody();
        if (response.code != 200) throw new NetEaseException("error getting " + searchType + ": " + response.code);
        return response;
    }

    @Override
    public NEArtistAlbumsSearchResultResponse getAlbums(long artistID, int offset, int limit) throws Exception {
        HttpResponse<NEArtistAlbumsSearchResultResponse> httpResponse = Unirest.get(MUSIC163_API + "/artist/albums/{artistID}")
                .routeParam("artistID", Long.toString(artistID))
                .queryString("offset", offset)
                .queryString("limit", limit)
                .asObject(NEArtistAlbumsSearchResultResponse.class);
        NEArtistAlbumsSearchResultResponse response = httpResponse.getBody();
        if (response.code != 200) throw new NetEaseException("error getting artists albums: " + response.code);
        return response;
    }

    @Override
    public NEAlbum getAlbum(long albumID) throws Exception {
        HttpResponse<NEAlbumDetailsResultResponse> httpResponse = Unirest.get(MUSIC163_API + "/album/{albumID}")
                .routeParam("albumID", Long.toString(albumID))
                .asObject(NEAlbumDetailsResultResponse.class);
        NEAlbumDetailsResultResponse response = httpResponse.getBody();
        if (response.code != 200) throw new NetEaseException("error getting album details: " + response.code);
        return response.album;
    }

    @Override
    public Map<Long, NESongDetails> getSongDetails(long[] songIDs) throws Exception {
        String songIDList = "[" + Util.join(songIDs, ',') + "]";
        HttpResponse<NESongDetailsResultResponse> httpResponse = Unirest.post(MUSIC163_API + "/song/detail")
                .field("ids", songIDList)
                .asObject(NESongDetailsResultResponse.class);
        NESongDetailsResultResponse result = httpResponse.getBody();
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
