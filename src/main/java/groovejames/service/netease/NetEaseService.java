package groovejames.service.netease;

import com.google.common.base.Charsets;
import com.google.common.base.Joiner;
import com.google.common.base.Strings;
import com.mashape.unirest.http.Unirest;
import groovejames.service.HttpClientService;
import groovejames.util.CryptUtils;
import groovejames.util.StringUtils;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import static com.google.common.base.Strings.isNullOrEmpty;

public class NetEaseService implements INetEaseService {

    private static final String GROOVEJAMES_SYMKEY = "bxdnldW5lg9Fryar";
    private static final String MUSIC163_API = "http://music.163.com/api";
    private static final String MUSIC163_LOGIN_API = "https://music.163.com/weapi/login/";
    private static final String MUSIC163_STREAMING_SERVER_URL = System.getProperty("netease.streamingserver", "http://p3.music.126.net");
    private static final String MUSIC163_REFERER = "http://music.163.com";
    private static final String NETEASE_URLDECODE_SECRET = CryptUtils.aesDecrypt(GROOVEJAMES_SYMKEY, "c90e89db10670d7e2a458cc90754292d63f0028456232453f3847daa93ff3d60");
    private static final String NETEASE_NONCE = CryptUtils.aesDecrypt(GROOVEJAMES_SYMKEY, "591d78e816c9d376167ed673dcc5775333b9c52d730cdc996304eacf620c8d23");
    private static final String NETEASE_LOGIN_IV = CryptUtils.aesDecrypt(GROOVEJAMES_SYMKEY, "c3f95e352cbd3522adfeefef887a465133b9c52d730cdc996304eacf620c8d23");
    private static final String NETEASE_PUBLIC_KEY = CryptUtils.aesDecrypt(GROOVEJAMES_SYMKEY, "4c399f9df1d907c1c429f5b4cc72ddcc");
    private static final String NETEASE_MODULUS = CryptUtils.aesDecrypt(GROOVEJAMES_SYMKEY,
        "4feae23a0ce6a3fd1ed821984bba7afd5daae18697df3a7e84abed626693f41b" +
            "fde5057ba9f95cd0cc930aefe06b5578b7835f397224e776a10536fdf199b67f" +
            "00896b1f1b6ba9ba4e9459aa3e279028738b931fd973326ed83e892fd45e4762" +
            "26201d327e92d86b0ee3796404fcaf257b05936e13424b63d3d3f96277468479" +
            "31931da29c794c3a4a64ff4ef4e111eae9033d727907f0c5b90ff3a11cafd619" +
            "f39992eed81b2751071b750642a4f178424c3478033337c7b72c2d979329dbd9" +
            "f220ba22023eb26fda41ac6c1352d8efbb1607fd72a96f0af9cf9f7432dea0df" +
            "08c3479b6c72947cc5b4f453806153645e86d41ecc142faf4122cdef19a7e5fa" +
            "09eff6de2abf4a7b38dea4ad4f91763f");

    private static final Logger log = LoggerFactory.getLogger(NetEaseService.class);

    static {
        log.info("GROOVEJAMES_SYMKEY={}", GROOVEJAMES_SYMKEY);
        log.info("MUSIC163_API={}", MUSIC163_API);
        log.info("MUSIC163_LOGIN_API={}", MUSIC163_LOGIN_API);
        log.info("MUSIC163_STREAMING_SERVER_URL={}", MUSIC163_STREAMING_SERVER_URL);
        log.info("MUSIC163_REFERER={}", MUSIC163_REFERER);
        log.info("NETEASE_URLDECODE_SECRET={}", NETEASE_URLDECODE_SECRET);
        log.info("NETEASE_NONCE={}", NETEASE_NONCE);
        log.info("NETEASE_LOGIN_IV={}", NETEASE_LOGIN_IV);
        log.info("NETEASE_PUBLIC_KEY={}", NETEASE_PUBLIC_KEY);
        log.info("NETEASE_MODULUS={}", NETEASE_MODULUS);
    }

    public NetEaseService(HttpClientService httpClientService) {
        Unirest.setObjectMapper(new JacksonObjectMapper());
        Unirest.setDefaultHeader("Referer", MUSIC163_REFERER);
        Unirest.setDefaultHeader("User-Agent", HttpClientService.USER_AGENT);
        Unirest.setHttpClient(httpClientService.getHttpClient());
    }

    @Override
    public NEAccount login(String username, String password) throws Exception {
        // https://github.com/wu-nerd/dmusic-plugin-NeteaseCloudMusic/blob/master/neteasecloudmusic/netease_api.py
        String body = new JacksonObjectMapper().writeValue(new Credentials(username, CryptUtils.md5(password)));
        String secretKey = CryptUtils.createRandomHexNumber(16);
        String params = aesEncrypt(aesEncrypt(body, NETEASE_NONCE), secretKey);
        String encSecKey = rsaEncrypt(secretKey, NETEASE_PUBLIC_KEY, NETEASE_MODULUS);
        NELoginResponse response = Unirest.post(MUSIC163_LOGIN_API)
            .field("params", params)
            .field("encSecKey", encSecKey)
            .asObject(NELoginResponse.class)
            .getBody();
        if (response.code != 200) throw new NetEaseException(response.code, "login error");
        return response.account;
    }

    @Override
    public NESongSearchResult searchSongs(String searchString, int offset, int limit) throws Exception {
        return search(searchString, offset, limit, NESearchType.songs, NESongSearchResultResponse.class).result;
    }

    @Override
    public NEArtistSearchResult searchArtists(String searchString, int offset, int limit) throws Exception {
        return search(searchString, offset, limit, NESearchType.artists, NEArtistSearchResultResponse.class).result;
    }

    @Override
    public NEAlbumSearchResult searchAlbums(String searchString, int offset, int limit) throws Exception {
        return search(searchString, offset, limit, NESearchType.albums, NEAlbumSearchResultResponse.class).result;
    }

    @Override
    public NEPlaylistSearchResult searchPlaylists(String searchString, int offset, int limit) throws Exception {
        return search(searchString, offset, limit, NESearchType.playlists, NEPlaylistSearchResultResponse.class).result;
    }

    private <T extends NEResponse> T search(String searchString, int offset, int limit, NESearchType searchType, Class<T> responseClass) throws Exception {
        T response = Unirest.post(MUSIC163_API + "/search/get")
            .field("s", searchString)
            .field("type", searchType.getType())
            .field("offset", offset)
            .field("limit", limit)
            .field("sub", false)
            .asObject(responseClass)
            .getBody();
        if (response.code != 200) throw new NetEaseException(response.code, "error getting " + searchType);
        return response;
    }

    @Override
    public NEArtistDetailsResponse getHotSongs(long artistID) throws Exception {
        // this request ignores offset and limit
        NEArtistDetailsResponse response = Unirest.get(MUSIC163_API + "/artist/{artistID}")
            .routeParam("artistID", Long.toString(artistID))
            .asObject(NEArtistDetailsResponse.class)
            .getBody();
        if (response.code != 200) throw new NetEaseException(response.code, "error getting artists top songs");
        return response;
    }

    @Override
    public NEArtistAlbumsResultResponse getAlbums(long artistID, int offset, int limit) throws Exception {
        NEArtistAlbumsResultResponse response = Unirest.get(MUSIC163_API + "/artist/albums/{artistID}")
            .routeParam("artistID", Long.toString(artistID))
            .queryString("offset", offset)
            .queryString("limit", limit)
            .asObject(NEArtistAlbumsResultResponse.class)
            .getBody();
        if (response.code != 200) throw new NetEaseException(response.code, "error getting artists albums");
        return response;
    }

    @Override
    public NEAlbum getAlbum(long albumID) throws Exception {
        NEAlbumDetailsResponse response = Unirest.get(MUSIC163_API + "/album/{albumID}")
            .routeParam("albumID", Long.toString(albumID))
            .asObject(NEAlbumDetailsResponse.class)
            .getBody();
        if (response.code != 200) throw new NetEaseException(response.code, "error getting album details");
        return response.album;
    }

    @Override
    public Map<Long, NESongDetails> getSongDetails(Collection<Long> songIDs) throws Exception {
        String songIDList = "[" + Joiner.on(',').join(songIDs) + "]";
        NESongDetailsResponse response = Unirest.post(MUSIC163_API + "/song/detail")
            .field("ids", songIDList)
            .asObject(NESongDetailsResponse.class)
            .getBody();
        if (response.code != 200 || response.songs == null) throw new NetEaseException(response.code, "error getting song details");
        Map<Long, NESongDetails> map = new HashMap<>();
        for (NESongDetails song : response.songs) {
            map.put(song.id, song);
        }
        return map;
    }

    @Override
    public NEPlaylistDetails getPlaylistDetails(long playlistID) throws Exception {
        NEPlaylistDetailsResponse response = Unirest.get(MUSIC163_API + "/playlist/detail")
            .queryString("id", Long.toString(playlistID))
            .asObject(NEPlaylistDetailsResponse.class)
            .getBody();
        if (response.code != 200) throw new NetEaseException(response.code, "error getting playlist details");
        return response.result;
    }

    @Override
    public NESongDetails[] getSimilarSongs(long songID) throws Exception {
        NESongDetailsResponse response = Unirest.get(MUSIC163_API + "/discovery/simiSong")
            .queryString("songid", songID)
            .asObject(NESongDetailsResponse.class)
            .getBody();
        if (response.code == 301) throw new NetEaseException(response.code, "must be logged in; please perform login");
        if (response.code == 401) throw new NetEaseException(response.code, "account has been used from multiple IPs at the same time; please try again later");
        if (response.code != 200) throw new NetEaseException(response.code, "error similar songs for song id " + songID);
        return response.songs;
    }

    @Override
    public NEArtist[] getSimilarArtists(long artistID) throws Exception {
        NEArtistSimilarResult response = Unirest.get(MUSIC163_API + "/discovery/simiArtist")
            .queryString("artistid", artistID)
            .asObject(NEArtistSimilarResult.class)
            .getBody();
        if (response.code == 301) throw new NetEaseException(response.code, "must be logged in; please perform login");
        if (response.code == 401) throw new NetEaseException(response.code, "account has been used from multiple IPs at the same time; please try again later");
        if (response.code != 200) throw new NetEaseException(response.code, "error similar artists for artist id " + artistID);
        return response.artists;
    }

    @Override
    public NESuggestionsResult getSuggestions(String query, int limit) throws Exception {
        NESuggestionsResultResponse response = Unirest.post(MUSIC163_API + "/search/suggest")
            .field("s", query)
            .field("limit", limit)
            .asObject(NESuggestionsResultResponse.class)
            .getBody();
        if (response.code != 200) throw new NetEaseException(response.code, "error getting suggestions for: " + query);
        return response.result;
    }

    @Override
    public NEDownloadInfo getDownloadInfo(NESongDetails songDetails) throws Exception {
        NEDownloadInfo downloadInfo = new NEDownloadInfo();
        NEStreamInfo streamInfo = findBestStreamInfo(songDetails);
        if (streamInfo != null) {
            String encryptedId = encryptId(streamInfo);
            String baseUrl = MUSIC163_STREAMING_SERVER_URL;
            downloadInfo.url = String.format("%s/%s/%s.%s", baseUrl, encryptedId, streamInfo.dfsId, streamInfo.extension);
            downloadInfo.bitrate = streamInfo.bitrate;
        } else if (!isNullOrEmpty(songDetails.mp3Url)) {
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

    private String encryptId(NEStreamInfo streamInfo) throws Exception {
        // from https://github.com/yanunon/NeteaseCloudMusic
        byte[] byte1 = NETEASE_URLDECODE_SECRET.getBytes("US-ASCII");
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
    }

    private static String aesEncrypt(String plainText, String secretKey) throws Exception {
        int pad = 16 - plainText.length() % 16;
        plainText += Strings.repeat(String.valueOf((char) pad), pad);
        Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");
        SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(Charsets.UTF_8), "AES");
        IvParameterSpec iv = new IvParameterSpec(NETEASE_LOGIN_IV.getBytes(Charsets.UTF_8));
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);
        byte[] encrypted = cipher.doFinal(plainText.getBytes(Charsets.UTF_8));
        return Base64.encodeBase64String(encrypted);
    }

    private static String rsaEncrypt(String text, String publicKey, String modulus) {
        text = StringUtils.reverse(text);
        BigInteger base = new BigInteger(StringUtils.encodeHex(text), 16);
        BigInteger exp = new BigInteger(publicKey, 16);
        BigInteger mod = new BigInteger(modulus, 16);
        BigInteger result = base.modPow(exp, mod);
        String s = result.toString(16);
        return Strings.padStart(s, 256, '0');
    }

    private static class Credentials {
        public final String username;
        public final String password;
        public final String rememberLogin;

        private Credentials(String username, String password) {
            this.username = username;
            this.password = password;
            this.rememberLogin = "true";
        }
    }
}
