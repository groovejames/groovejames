package groovejames.service;

import groovejames.model.Country;
import groovejames.util.JsonMarshaller;
import groovejames.util.JsonUnmarshaller;
import groovejames.util.Util;
import static groovejames.util.Util.decryptDES;
import static groovejames.util.Util.gunzip;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.cookie.Cookie;
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

class GroovesharkProxy implements InvocationHandler {

    private static final Log log = LogFactory.getLog(GroovesharkProxy.class);

    private static final String GS_CLIENT_NAME = System.getProperty("grooveshark.client.name", "gslite");
    private static final String GS_CLIENT_REVISION = System.getProperty("grooveshark.client.revision", "20101012.37");
    private static final String GS_SECRET = System.getProperty("grooveshark.secret", decryptDES("1011a209e00aae570c595cf4bd0b8dcd6ae5f9231af59965"));

    /**
     * how long a communication token is valid before a new one must be fetched, in milliseconds.
     */
    private static final int GS_COMMUNICATION_TOKEN_DURATION = 1000 * 60 * 25; // 25min.

    private static List<Method> methodsOfClassObject = Arrays.asList(Object.class.getMethods());

    private final HttpClientService httpClientService;
    private final String sessionID;
    private final UUID uuid;
    private String communicationToken;
    private long communicationTokenExpires;

    public GroovesharkProxy(HttpClientService httpClientService) throws IOException {
        this.httpClientService = httpClientService;
        this.uuid = UUID.randomUUID();
        this.sessionID = getSessionID();
    }

    @SuppressWarnings({"unchecked"})
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (methodsOfClassObject.contains(method))
            return null;

        String methodName = method.getName();
        String token = createToken(methodName);

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
        jsonHeader.put("client", GS_CLIENT_NAME);
        jsonHeader.put("clientRevision", GS_CLIENT_REVISION);
        jsonHeader.put("privacy", 0);
        jsonHeader.put("session", sessionID);
        jsonHeader.put("uuid", uuid.toString().toUpperCase());
        jsonHeader.put("token", token);
        jsonHeader.put("country", JsonMarshaller.marshall(Country.GSLITE_GERMAN_COUNTRY));
        jsonRequest.put("header", jsonHeader);

        if (log.isDebugEnabled())
            log.debug("REQUEST: " + jsonRequest.toJSONString());

        HttpPost httpPost = new HttpPost("http://cowbell.grooveshark.com/more.php?" + methodName);
        httpPost.setHeader(HTTP.CONTENT_TYPE, "application/json");
        httpPost.setHeader(HTTP.CONN_KEEP_ALIVE, "300");
        httpPost.setHeader(HTTP.CONN_DIRECTIVE, HTTP.CONN_KEEP_ALIVE);
        httpPost.setHeader("Accept-Encoding", "gzip");
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

        Header contentEncoding = httpResponse.getLastHeader(HTTP.CONTENT_ENCODING);
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

    private String createToken(String methodName) throws IOException, ParseException {
        String communicationToken = getCommunicationToken();
        String sixRandomLettersAndNumbers = Util.createRandomLettersAndNumbersOfLength(6);
        String s = String.format("%s:%s:%s:%s",
                methodName, communicationToken, GS_SECRET, sixRandomLettersAndNumbers);
        s = Util.sha1(s);
        return sixRandomLettersAndNumbers + s;
    }

    private String getSessionID() throws IOException {
        HttpGet httpGet = new HttpGet("http://listen.grooveshark.com");
        try {
            HttpResponse response = httpClientService.getHttpClient().execute(httpGet);
            if (response.getStatusLine().getStatusCode() != HttpStatus.SC_OK) {
                throw new IOException("could not get session cookie (" + response.getStatusLine() + ")");
            }
            for (Cookie cookie : httpClientService.getHttpClient().getCookieStore().getCookies()) {
//                log.info("cookie: " + cookie);
                if ("PHPSESSID".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        } finally {
            httpGet.abort();
        }
        return null;
    }

    private String getCommunicationToken() throws IOException, ParseException {
        checkCommunicationToken();
        return communicationToken;
    }

    private synchronized void checkCommunicationToken() throws IOException, ParseException {
        if (communicationToken == null || System.currentTimeMillis() > communicationTokenExpires) {
            communicationToken = fetchNewCommunicationToken();
            communicationTokenExpires = System.currentTimeMillis() + GS_COMMUNICATION_TOKEN_DURATION;
            if (log.isDebugEnabled()) {
                log.debug("new communication token: " + communicationToken);
                log.debug("new communication token expires: " + new Date(communicationTokenExpires));
            }
        }
    }

    @SuppressWarnings("unchecked")
    private String fetchNewCommunicationToken() throws IOException, ParseException {
        JSONObject jsonObject = new JSONObject();
        JSONObject jsonHeaderObject = new JSONObject();
        jsonHeaderObject.put("client", GS_CLIENT_NAME);
        jsonHeaderObject.put("clientRevision", GS_CLIENT_REVISION);
        jsonHeaderObject.put("privacy", 0);
        jsonHeaderObject.put("session", sessionID);
        jsonHeaderObject.put("uuid", uuid.toString().toUpperCase());
        JSONObject jsonParametersObject = new JSONObject();
        jsonParametersObject.put("secretKey", Util.md5(sessionID));
        jsonObject.put("header", jsonHeaderObject);
        jsonObject.put("method", "getCommunicationToken");
        jsonObject.put("parameters", jsonParametersObject);
        if (log.isDebugEnabled()) log.debug("getCommunicationToken request: " + jsonObject.toJSONString());

        HttpPost httpPost = new HttpPost("https://cowbell.grooveshark.com/more.php");
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

        return communicationToken;
    }
}
