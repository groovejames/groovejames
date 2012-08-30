package groovejames.service;

import groovejames.model.Country;
import groovejames.util.JsonMarshaller;
import groovejames.util.JsonUnmarshaller;
import groovejames.util.Util;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.protocol.HTTP;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.ParseException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.StringTokenizer;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static groovejames.util.Util.gunzip;

class GroovesharkProxy implements InvocationHandler {

    private static final Log log = LogFactory.getLog(GroovesharkProxy.class);

    /**
     * how long a communication token is valid before a new one must be fetched, in milliseconds.
     * default: 25 minutes.
     */
    private static final int GS_COMMUNICATION_TOKEN_DURATION = 1500000;

    private static List<Method> methodsOfClassObject = Arrays.asList(Object.class.getMethods());

    private static final String controllerKey = "breakfastBurritos";

    private final HttpClientService httpClientService;
    private final String sessionID;
    private final UUID uuid;
    private CommunicationToken communicationToken;
    private String lastRandomizer;


    public GroovesharkProxy(HttpClientService httpClientService) throws IOException {
        this.httpClientService = httpClientService;
        this.uuid = UUID.randomUUID();
        this.sessionID = getSessionID();
    }

    @Override @SuppressWarnings({"unchecked"})
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (methodsOfClassObject.contains(method))
            return null;

        String clientName = Grooveshark.CLIENT_NAME;
        String clientRevision = Grooveshark.CLIENT_REVISION;
        String secret = Grooveshark.SECRET;
        Header headerAnnotation = method.getAnnotation(Header.class);
        if (headerAnnotation != null) {
            clientName = headerAnnotation.clientName();
            clientRevision = headerAnnotation.clientRevision();
            secret = headerAnnotation.secret();
        }

        String methodName = method.getName();
        String token = createToken(methodName, clientName, clientRevision, secret);

        JSONObject jsonRequest = new JSONObject();
        jsonRequest.put("method", methodName);

        JSONObject jsonParameters = new JSONObject();
        Annotation[][] allParameterAnnotations = method.getParameterAnnotations();
        int paramNumber = 0;
        for (Annotation[] parameterAnnotations : allParameterAnnotations) {
            Param paramAnnotation = findParamAnnotation(parameterAnnotations);
            if (paramAnnotation != null) {
                String paramName = paramAnnotation.value();
                Object arg = args[paramNumber];
                jsonParameters.put(paramName, JsonMarshaller.marshall(arg));
            } else {
                throw new RuntimeException("method " + method + ": parameter #" + paramNumber + " has no @Param annotation");
            }
            paramNumber++;
        }
        jsonRequest.put("parameters", jsonParameters);

        JSONObject jsonHeader = new JSONObject();
        jsonHeader.put("client", clientName);
        jsonHeader.put("clientRevision", clientRevision);
        jsonHeader.put("privacy", 0);
        jsonHeader.put("session", sessionID);
        jsonHeader.put("uuid", uuid.toString().toUpperCase());
        jsonHeader.put("token", token);
        jsonHeader.put("country", JsonMarshaller.marshall(Country.DEFAULT_COUNTRY));
        jsonRequest.put("header", jsonHeader);

        if (log.isDebugEnabled())
            log.debug("REQUEST: " + jsonRequest.toJSONString());

        HttpPost httpPost = new HttpPost("http://grooveshark.com/more.php?" + methodName);
        httpPost.setHeader(HTTP.CONTENT_TYPE, "application/json");
//        httpPost.setHeader(HTTP.CONN_KEEP_ALIVE, "300");
        httpPost.setHeader(HTTP.CONN_DIRECTIVE, HTTP.CONN_KEEP_ALIVE);
        httpPost.setHeader("Cache-Control", "max-age=0");
        httpPost.setHeader("Accept-Encoding", "gzip");
        httpPost.setHeader("Origin", "http://grooveshark.com");
        httpPost.setEntity(new StringEntity(jsonRequest.toJSONString(), "UTF-8"));
        HttpResponse httpResponse = httpClientService.getHttpClient().execute(httpPost);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        HttpEntity httpEntity = httpResponse.getEntity();
        try {
            StatusLine statusLine = httpResponse.getStatusLine();
            int statusCode = statusLine.getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                httpEntity.writeTo(baos);
            } else {
                throw new RuntimeException("method " + method + ": " + statusLine);
            }
        } finally {
            httpEntity.consumeContent();
        }

        org.apache.http.Header contentEncoding = httpResponse.getLastHeader(HTTP.CONTENT_ENCODING);
        String responseContent;
        if (contentEncoding == null || "gzip".equals(contentEncoding.getValue())) {
            log.debug("unzipping gzipped response");
            byte[] unzipped = gunzip(baos.toByteArray());
            responseContent = new String(unzipped, "UTF-8");
        } else {
            responseContent = baos.toString("UTF-8");
        }
        if (log.isDebugEnabled())
            log.debug("RESPONSE: " + (responseContent != null ? "\"" + responseContent + "\"" : "null"));

        if (responseContent == null || responseContent.length() == 0)
            throw new RuntimeException("method " + method + ": empty response");

        JSONObject jsonResponse = (JSONObject) JSONValue.parseWithException(responseContent);
        if (jsonResponse == null)
            throw new RuntimeException("method " + method + ": unparseable response \"" + responseContent + "\"");

        JSONObject fault = (JSONObject) jsonResponse.get("fault");
        if (fault != null) {
            Long code = (Long) fault.get("code");
            String message = (String) fault.get("message");
            if (code != null && code == 256) {
                // invalid token error
                communicationToken = null;
            }
            throw new RuntimeException("Grooveshark error: " + message + (code != null ? "; error code: " + code : ""));
        }

        Object jsonResult = jsonResponse.get("result");
        if (jsonResult == null)
            throw new RuntimeException("method " + method + ": no result");

        ResultPath resultPath = method.getAnnotation(ResultPath.class);
        if (resultPath != null && !resultPath.value().isEmpty()) {
            StringTokenizer tokenizer = new StringTokenizer(resultPath.value(), ".");
            while (tokenizer.hasMoreTokens()) {
                jsonResult = ((JSONObject) jsonResult).get(tokenizer.nextToken());
            }
        }

        return new JsonUnmarshaller().unmarshall(jsonResult, method.getReturnType());
    }

    private Param findParamAnnotation(Annotation[] parameterAnnotations) {
        for (Annotation parameterAnnotation : parameterAnnotations) {
            if (parameterAnnotation.annotationType().equals(Param.class))
                return (Param) parameterAnnotation;
        }
        return null;
    }

    private String createToken(String methodName, String clientName, String clientRevision, String secret)
        throws IOException, ParseException {
        String communicationToken = getCommunicationToken(clientName, clientRevision);
        String randomizer = createRandomizer();
        if (log.isDebugEnabled())
            log.debug(String.format("createToken: method=%s, clientName=%s, clientRevision=%s, secret=%s, randomizer=%s", methodName, clientName, clientRevision, secret, randomizer));
        lastRandomizer = randomizer;
        String s = String.format("%s:%s:%s:%s", methodName, communicationToken, secret, randomizer);
        s = Util.sha1(s);
        return randomizer + s;
    }

    private String createRandomizer() {
        String randomizer = Util.createRandomHexNumber(6);
        if (!randomizer.equals(lastRandomizer)) {
            return randomizer;
        }
        return createRandomizer();
    }

    private String getSessionID() throws IOException {
        /* previously:
        // create a random PHP session id, something like "fae7efe67e55c2cb1d1777de4cc079b3" or "10bcda1a8690b74a4934b32dc6c13b06"
        // it is a random number of 16 bytes as a 32 char hex string
        return Util.createRandomHexNumber(32);
        */

        String uri = "http://w69b-groove.appspot.com/";
        HttpGet httpGet = new HttpGet(uri);
        httpGet.setHeader("Host", "w69b-groove.appspot.com");
        httpGet.setHeader("Origin", "chrome-extension://docdgimmdejoiemdafcgeodchlbllgac");
        httpGet.setHeader("Referer", "http://grooveshark.com/");
        HttpResponse response = httpClientService.getHttpClient().execute(httpGet);
        if (response.getStatusLine().getStatusCode() != HttpStatus.SC_OK) {
            throw new IOException("could not get session (" + response.getStatusLine() + ")");
        }
        HttpEntity entity = response.getEntity();
        long length = Math.max(500L, Math.min(entity.getContentLength(), 50000L));
        ByteArrayOutputStream baos = new ByteArrayOutputStream((int) length);
        entity.writeTo(baos);
        String encoding = entity.getContentEncoding() != null ? entity.getContentEncoding().getValue() : "UTF8";
        String content = baos.toString(encoding);
        entity.consumeContent();
        Matcher matcher = Pattern.compile("gsConfig\\s*=.*\"sessionID\"\\s*:\\s*\"([^\"]+)\"").matcher(content);
        if (matcher.find()) {
            String sessionID = matcher.group(1);
            log.info("sessionID: " + sessionID);
            return sessionID;
        }
        throw new IOException("could not find sessionID at " + uri);
    }

    private synchronized String getCommunicationToken(String clientName, String clientRevision) throws IOException, ParseException {
        if (communicationToken == null || communicationToken.isExpired()) {
            if (log.isDebugEnabled() && communicationToken != null)
                log.debug("fetching new token for client " + clientName + " because it is expired");
            communicationToken = fetchNewCommunicationToken(clientName, clientRevision);
        }
        return communicationToken.getToken();
    }

    @SuppressWarnings("unchecked")
    private CommunicationToken fetchNewCommunicationToken(String clientName, String clientRevision)
        throws IOException, ParseException {
        JSONObject jsonObject = new JSONObject();
        JSONObject jsonHeaderObject = new JSONObject();
        jsonHeaderObject.put("client", clientName);
        jsonHeaderObject.put("clientRevision", clientRevision);
        jsonHeaderObject.put("privacy", 0);
        jsonHeaderObject.put("country", JsonMarshaller.marshall(Country.DEFAULT_COUNTRY));
        jsonHeaderObject.put("session", sessionID);
        jsonHeaderObject.put("uuid", uuid.toString().toUpperCase());
        JSONObject jsonParametersObject = new JSONObject();
        jsonParametersObject.put("secretKey", Util.md5(sessionID));
        jsonObject.put("header", jsonHeaderObject);
        jsonObject.put("method", "getCommunicationToken");
        jsonObject.put("parameters", jsonParametersObject);
        if (log.isDebugEnabled()) log.debug("getCommunicationToken request: " + jsonObject.toJSONString());

        HttpPost httpPost = new HttpPost("https://grooveshark.com/more.php");
        httpPost.setHeader(HTTP.CONTENT_TYPE, "application/json");
        httpPost.setEntity(new StringEntity(jsonObject.toJSONString(), "UTF-8"));
        HttpResponse httpResponse = httpClientService.getHttpClient().execute(httpPost);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        HttpEntity httpEntity = httpResponse.getEntity();
        try {
            httpEntity.writeTo(baos);
        } finally {
            httpEntity.consumeContent();
        }
        String responseContent = baos.toString("UTF-8");
        if (log.isDebugEnabled()) log.debug("getCommunicationToken response: " + responseContent);

        JSONObject obj = (JSONObject) JSONValue.parseWithException(responseContent);
        String communicationToken = (String) obj.get("result");

        if (communicationToken == null) {
            JSONObject fault = (JSONObject) obj.get("fault");
            Long code = (Long) fault.get("code");
            String message = (String) fault.get("message");
            throw new IOException("Grooveshark connect error: " + message + (code != null ? ", error code: " + code : ""));
        }

        return new CommunicationToken(clientName, communicationToken);
    }


    private static class CommunicationToken {
        private final String token;
        private final long expires;

        private CommunicationToken(String client, String token) {
            this.token = token;
            this.expires = System.currentTimeMillis() + GS_COMMUNICATION_TOKEN_DURATION;
            if (log.isDebugEnabled()) {
                log.debug("new communication token for client " + client + ": " + token);
                log.debug("new communication token expires: " + new Date(expires));
            }
        }

        public String getToken() {
            return token;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() > expires;
        }
    }
}
