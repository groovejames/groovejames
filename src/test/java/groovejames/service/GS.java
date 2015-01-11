package groovejames.service;

import groovejames.model.Country;
import groovejames.model.SearchSongsResultType;
import groovejames.model.Song;
import groovejames.model.StreamKey;
import groovejames.util.JsonMarshaller;
import groovejames.util.JsonUnmarshaller;
import groovejames.util.Util;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.ParseException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@SuppressWarnings("unchecked")
public class GS {

    private static final String SEARCH_CLIENT_NAME = "htmlshark";
    private static final String SEARCH_CLIENT_REVISION = "20130520";
    private static final String SEARCH_SECRET = "20130520";

    private static final String PLAY_CLIENT_NAME = "jsqueue";
    private static final String PLAY_CLIENT_REVISION = "20130520";
    private static final String PLAY_SECRET = "chickenFingers";

    private UUID uuid = UUID.randomUUID();
    private String sessionID = Util.createRandomHexNumber(32);
    private String communicationToken;
    private long communicationTokenExpires;
    private String lastRandomizer;
    private HashSet<String> cookies = new HashSet<String>();

    public Song[] search(SearchSongsResultType type, String query) throws IOException, ParseException {
        JSONObject jsonParametersObject = new JSONObject();
        jsonParametersObject.put("type", type.name());
        jsonParametersObject.put("query", query);
        JSONObject result = (JSONObject) request("getResultsFromSearch", jsonParametersObject, SEARCH_CLIENT_NAME, SEARCH_CLIENT_REVISION, SEARCH_SECRET, false);
        JSONArray result2 = (JSONArray) result.get("result");
        return JsonUnmarshaller.unmarshall(result2, Song[].class);
    }

    public byte[] download(StreamKey streamKey) throws IOException {
        String url = String.format("http://%s/stream.php?streamKey=%s", streamKey.getIp(), streamKey.getStreamKey());
        System.out.printf("GET %s%n", url);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setRequestProperty("Connection", "close");
        InputStream inputStream = conn.getInputStream();
        byte[] buf = new byte[102400];
        int r;
        while ((r = inputStream.read(buf)) != -1) {
            baos.write(buf, 0, r);
        }
        inputStream.close();
        conn.disconnect();
        System.out.printf("downloaded %s bytes%n", baos.size());
        return baos.toByteArray();
    }

    public StreamKey getStreamKey(long songID) throws IOException, ParseException {
        JSONObject jsonParametersObject = new JSONObject();
        jsonParametersObject.put("songID", songID);
        jsonParametersObject.put("type", 0);
        jsonParametersObject.put("mobile", false);
        jsonParametersObject.put("prefetch", false);
        jsonParametersObject.put("country", JsonMarshaller.marshall(Country.DEFAULT_COUNTRY));
        JSONObject result = (JSONObject) request("getStreamKeyFromSongIDEx", jsonParametersObject, PLAY_CLIENT_NAME, PLAY_CLIENT_REVISION, PLAY_SECRET, false);
        StreamKey streamKey = JsonUnmarshaller.unmarshall(result, StreamKey.class);
        System.out.printf("streamKey=%s%n", streamKey);
        return streamKey;
    }

    private String createToken(String methodName, String secret)
        throws IOException, ParseException {
        String communicationToken = getCommunicationToken();
        String randomizer = createRandomizer();
        lastRandomizer = randomizer;
        System.out.printf("createToken: method=%s, communicationToken=%s, secret=%s, randomizer=%s%n", methodName, communicationToken, secret, randomizer);
        String s = String.format("%s:%s:%s:%s", methodName, communicationToken, secret, randomizer);
        s = Util.sha1(s);
        return randomizer + s;
    }

    private synchronized String getCommunicationToken() throws IOException, ParseException {
        if (communicationToken == null || System.currentTimeMillis() > communicationTokenExpires) {
            if (communicationToken != null)
                System.out.println("fetching new token because it is expired");
            communicationToken = fetchNewCommunicationToken();
        }
        return communicationToken;
    }

    private String createRandomizer() {
        String randomizer = Util.createRandomHexNumber(6);
        if (!randomizer.equals(lastRandomizer)) {
            return randomizer;
        }
        return createRandomizer();
    }

    private String fetchNewCommunicationToken()
        throws IOException, ParseException {
        JSONObject jsonParametersObject = new JSONObject();
        jsonParametersObject.put("secretKey", Util.md5(sessionID));
        String communicationToken = (String) request("getCommunicationToken", jsonParametersObject, SEARCH_CLIENT_NAME, SEARCH_CLIENT_REVISION, null, true);
        System.out.printf("new communicationToken: %s%n", communicationToken);
        communicationTokenExpires = System.currentTimeMillis() + 1500000;
        return communicationToken;
    }

    private Object request(String method, JSONObject parameters, String clientName, String clientRevision, String secret, boolean https) throws IOException, ParseException {
        JSONObject jsonHeaderObject = new JSONObject();
        jsonHeaderObject.put("client", clientName);
        jsonHeaderObject.put("clientRevision", clientRevision);
        jsonHeaderObject.put("privacy", 0);
        jsonHeaderObject.put("country", JsonMarshaller.marshall(Country.DEFAULT_COUNTRY));
        jsonHeaderObject.put("session", sessionID);
        jsonHeaderObject.put("uuid", uuid.toString().toUpperCase());
        if (secret != null) jsonHeaderObject.put("token", createToken(method, secret));

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("header", jsonHeaderObject);
        jsonObject.put("method", method);
        jsonObject.put("parameters", parameters);
        System.out.printf("request: %s%n", jsonObject.toJSONString());

        String url = (https ? "https:" : "http:") + "//grooveshark.com/more.php?" + method;
        System.out.printf("POST %s%n", url);
        HttpURLConnection urlConnection = (HttpURLConnection) new URL(url).openConnection();
        urlConnection.setRequestMethod("POST");
        urlConnection.setRequestProperty("Content-Type", "application/json");
//        urlConnection.setRequestProperty("Referer", "http://grooveshark.com/JSQueue.swf?20120521.04");
        urlConnection.setRequestProperty("Connection", "close");
//        urlConnection.setRequestProperty("Connection", "Keep-Alive");
//        urlConnection.setRequestProperty("Cache-Control", "max-age=0");
        urlConnection.setRequestProperty("Accept-Encoding", "gzip");
//        urlConnection.setRequestProperty("Origin", "http://grooveshark.com");
/*
        if (!cookies.isEmpty()) {
            for (String cookie : cookies) {
                urlConnection.setRequestProperty("Cookie", cookie);
                System.out.printf("Cookie: %s%n", cookie);
            }
        }
*/
        urlConnection.setDoOutput(true);
        write(urlConnection.getOutputStream(), jsonObject.toJSONString());

        System.out.printf("response status: %d %s%n", urlConnection.getResponseCode(), urlConnection.getResponseMessage());
        Map<String, List<String>> headerFields = urlConnection.getHeaderFields();
        System.out.printf("headers: %s%n", headerFields);
        System.out.printf("content type: %s%n", urlConnection.getContentType());
        System.out.printf("content length: %d%n", urlConnection.getContentLength());
        byte[] bytes = read(urlConnection.getInputStream());

        String contentEncoding = urlConnection.getHeaderField("Content-Encoding");
        String responseContent;
        if (contentEncoding == null || "gzip".equals(contentEncoding)) {
            System.out.println("unzipping gzipped response");
            byte[] unzipped = Util.gunzip(bytes);
            responseContent = new String(unzipped, "UTF-8");
        } else {
            responseContent = new String(bytes, "UTF-8");
        }
        System.out.printf("response: %s%n", responseContent);
        urlConnection.disconnect();

        if (headerFields.containsKey("Set-Cookie")) {
            List<String> list = headerFields.get("Set-Cookie");
            for (String cookie : list) {
                int p = cookie.indexOf(';');
                cookies.add(p > 0 ? cookie.substring(0, p) : cookie);
            }
        }

        JSONObject response = (JSONObject) JSONValue.parseWithException(responseContent);
        Object result = response.get("result");

        if (result == null) {
            JSONObject fault = (JSONObject) response.get("fault");
            Long code = (Long) fault.get("code");
            String message = (String) fault.get("message");
            throw new IOException("response fault: " + message + (code != null ? ", error code: " + code : ""));
        }

        return result;
    }

    private static byte[] read(InputStream is) throws IOException {
        byte[] buf = new byte[1024];
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int r;
        while ((r = is.read(buf)) != -1)
            baos.write(buf, 0, r);
        is.close();
        return baos.toByteArray();
    }

    private static void write(OutputStream os, String s) throws IOException {
        os.write(s.getBytes("UTF-8"));
        os.close();
    }

    public static void main(String[] args) throws IOException, ParseException {
        GS gs = new GS();
//        Song[] songs = gs.search(SearchSongsResultType.Songs, "The Cure");
//        for (Song song : songs) {
//            System.out.println(song);
//        }
//        StreamKey streamKey = gs.getStreamKey(songs[0].getSongID());
        StreamKey streamKey = gs.getStreamKey(14518616);
//        StreamKey streamKey = new StreamKey("61f6ec2221d08d3d16a2e38bc41f8b5cf9528a14_505c3b99_dd8958_16d2e34_92c4737c_1_0", "stream128a-he.grooveshark.com");
        System.out.printf("streamKey: %s%n", streamKey);

        byte[] bytes = gs.download(streamKey);
    }

}
