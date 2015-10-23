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
    private static final String SYMKEY = "bxdnldW5lg9Fryar";
    private static final String SECRET = System.getProperty("netease.secret", Util.aesDecrypt(SYMKEY, "c90e89db10670d7e2a458cc90754292d63f0028456232453f3847daa93ff3d60"));
    private static final String REFERER = "http://music.163.com";

    public NetEaseService(HttpClientService httpClientService) {
        Unirest.setObjectMapper(new JacksonObjectMapper());
        Unirest.setDefaultHeader("Referer", REFERER);
        Unirest.setDefaultHeader("User-Agent", HttpClientService.USER_AGENT);
        Unirest.setHttpClient(httpClientService.getHttpClient());
    }

    @Override
    public NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception {
        NESongSearchResultResponse response = search(searchString, offset, limit, NESearchType.songs, NESongSearchResultResponse.class);
        return response.result;
    }

    @Override
    public NEArtistSearchResult searchArtists(String searchString, int offset, int limit) throws Exception {
        NEArtistSearchResultResponse response = search(searchString, offset, limit, NESearchType.artists, NEArtistSearchResultResponse.class);
        return response.result;
    }

    @Override
    public NEAlbumSearchResult searchAlbums(String searchString, int offset, int limit) throws Exception {
        NEAlbumSearchResultResponse response = search(searchString, offset, limit, NESearchType.albums, NEAlbumSearchResultResponse.class);
        return response.result;
    }

    @Override
    public NEPlaylistSearchResult searchPlaylists(String searchString, int offset, int limit) throws Exception {
        NEPlaylistSearchResultResponse response = search(searchString, offset, limit, NESearchType.playlists, NEPlaylistSearchResultResponse.class);
        return response.result;
    }

    private <T extends NEResponse> T search(String searchString, int offset, int limit, NESearchType searchType, Class<T> responseClass) throws com.mashape.unirest.http.exceptions.UnirestException {
        HttpResponse<T> httpResponse = Unirest.post(MUSIC163_API + "/search/get")
                .field("s", searchString)
                .field("type", searchType.getType())
                .field("offset", offset)
                .field("limit", limit)
                .field("sub", false)
                .asObject(responseClass);
        T response = httpResponse.getBody();
        if (response.code != 200) throw new NetEaseException("error getting " + searchType + ": " + response.code);
        return response;
    }

    @Override
    public NEArtistDetailsResponse getHotSongs(long artistID) throws Exception {
        // this request ignores offset and limit
        HttpResponse<NEArtistDetailsResponse> httpResponse = Unirest.get(MUSIC163_API + "/artist/{artistID}")
                .routeParam("artistID", Long.toString(artistID))
                .asObject(NEArtistDetailsResponse.class);
        NEArtistDetailsResponse response = httpResponse.getBody();
        if (response.code != 200) throw new NetEaseException("error getting artists top songs: " + response.code);
        return response;
    }

    @Override
    public NEArtistAlbumsResultResponse getAlbums(long artistID, int offset, int limit) throws Exception {
        HttpResponse<NEArtistAlbumsResultResponse> httpResponse = Unirest.get(MUSIC163_API + "/artist/albums/{artistID}")
                .routeParam("artistID", Long.toString(artistID))
                .queryString("offset", offset)
                .queryString("limit", limit)
                .asObject(NEArtistAlbumsResultResponse.class);
        NEArtistAlbumsResultResponse response = httpResponse.getBody();
        if (response.code != 200) throw new NetEaseException("error getting artists albums: " + response.code);
        return response;
    }

    @Override
    public NEAlbum getAlbum(long albumID) throws Exception {
        HttpResponse<NEAlbumDetailsResponse> httpResponse = Unirest.get(MUSIC163_API + "/album/{albumID}")
                .routeParam("albumID", Long.toString(albumID))
                .asObject(NEAlbumDetailsResponse.class);
        NEAlbumDetailsResponse response = httpResponse.getBody();
        if (response.code != 200) throw new NetEaseException("error getting album details: " + response.code);
        return response.album;
    }

    @Override
    public Map<Long, NESongDetails> getSongDetails(long[] songIDs) throws Exception {
        String songIDList = "[" + Util.join(songIDs, ',') + "]";
        HttpResponse<NESongDetailsResponse> httpResponse = Unirest.post(MUSIC163_API + "/song/detail")
                .field("ids", songIDList)
                .asObject(NESongDetailsResponse.class);
        NESongDetailsResponse result = httpResponse.getBody();
        if (result.code != 200) throw new NetEaseException("error getting song details: " + result.code);
        if (result.songs == null || result.songs.length == 0) throw new NetEaseException("song details not found for song ids: " + songIDList);
        Map<Long, NESongDetails> map = new HashMap<>();
        for (NESongDetails song : result.songs) {
            map.put(song.id, song);
        }
        return map;
    }

    @Override
    public NEPlaylistDetails getPlaylistDetails(long playlistID) throws Exception {
        HttpResponse<NEPlaylistDetailsResponse> httpResponse = Unirest.get(MUSIC163_API + "/playlist/detail")
                .queryString("id", Long.toString(playlistID))
                .asObject(NEPlaylistDetailsResponse.class);
        NEPlaylistDetailsResponse response = httpResponse.getBody();
        if (response.code != 200) throw new NetEaseException("error getting playlist details: " + response.code);
        return response.result;
    }

    @Override
    public NESuggestionsResult getSuggestions(String query, int limit) throws Exception {
        HttpResponse<NESuggestionsResultResponse> httpResponse = Unirest.post(MUSIC163_API + "/search/suggest")
                .field("s", query)
                .field("limit", limit)
                .asObject(NESuggestionsResultResponse.class);
        NESuggestionsResultResponse response = httpResponse.getBody();
        if (response.code != 200) throw new NetEaseException("error getting song details: " + response.code);
        return response.result;
    }

    @Override
    public NEDownloadInfo getDownloadInfo(NESongDetails songDetails) {
        NEDownloadInfo downloadInfo = new NEDownloadInfo();
        NEStreamInfo streamInfo = findBestStreamInfo(songDetails);
        if (streamInfo != null) {
            String encryptedId = encryptId(streamInfo);
            String baseUrl = Util.stripPath(songDetails.mp3Url);
            if (baseUrl == null) baseUrl = "http://m1.music.126.net";
            downloadInfo.url = String.format("%s/%s/%s.%s", baseUrl, encryptedId, streamInfo.dfsId, streamInfo.extension);
            downloadInfo.bitrate = streamInfo.bitrate;
        } else if (Util.isEmpty(songDetails.mp3Url)) {
            throw new NetEaseException("no download location for song id " + songDetails.id);
        } else {
            downloadInfo.url = songDetails.mp3Url;
            downloadInfo.bitrate = null; // bitrate is unknown
        }
        return downloadInfo;
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
