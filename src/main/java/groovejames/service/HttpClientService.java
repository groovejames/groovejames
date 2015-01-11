package groovejames.service;

import org.apache.http.HttpHost;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpHead;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.params.ClientPNames;
import org.apache.http.client.params.CookiePolicy;
import org.apache.http.conn.params.ConnRoutePNames;
import org.apache.http.impl.client.AbstractHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.DefaultRedirectHandler;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.params.CoreProtocolPNames;
import org.apache.http.protocol.ExecutionContext;
import org.apache.http.protocol.HttpContext;

public class HttpClientService {

    private static final String USER_AGENT = System.getProperty("userAgent",
            "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)");

    private static final int SOCKET_TIMEOUT = Integer.getInteger("socketTimeout", 30);

    private ProxySettings proxySettings;
    private AbstractHttpClient httpClient;

    public ProxySettings getProxySettings() {
        return proxySettings;
    }

    public void setProxySettings(ProxySettings proxySettings) {
        if (proxySettings == null && this.proxySettings != null
                || proxySettings != null && !proxySettings.equals(this.proxySettings)) {
            closeHttpClient();
            this.httpClient = createHttpClient(proxySettings);
            this.proxySettings = proxySettings;
        }
    }

    public AbstractHttpClient getHttpClient() {
        if (httpClient == null)
            httpClient = createHttpClient(proxySettings);
        return httpClient;
    }

    private void closeHttpClient() {
        if (httpClient != null) {
            httpClient.getConnectionManager().shutdown();
            httpClient = null;
        }
    }

    private static AbstractHttpClient createHttpClient(ProxySettings proxySettings) {
        DefaultHttpClient httpClient = new DefaultHttpClient();
        // set user agent string
        httpClient.getParams().setParameter(CoreProtocolPNames.USER_AGENT, USER_AGENT);
        // need to relax default cookie policy because grooveshark.com sends cookies with invalid expiry dates
        httpClient.getParams().setParameter(ClientPNames.COOKIE_POLICY, CookiePolicy.BROWSER_COMPATIBILITY);
        // don't use "Expect: 100-continue" because some proxies don't understand
        httpClient.getParams().setBooleanParameter(CoreProtocolPNames.USE_EXPECT_CONTINUE, false);
        // the factory for connection manager to use multi-thread connection manager
        httpClient.getParams().setParameter(
                ClientPNames.CONNECTION_MANAGER_FACTORY_CLASS_NAME,
                ThreadSafeClientConnManagerFactory.class.getName());
        // timeout in milliseconds until a connection is established, in ms
        httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, SOCKET_TIMEOUT * 1000);
        // socket timeout in milliseconds, which is the timeout for waiting for data
        httpClient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, SOCKET_TIMEOUT * 1000);
        // use our redirect handler because we need redirect on POSTs
        httpClient.setRedirectHandler(new MyRedirectHandler());
        // proxy settings
        if (proxySettings != null) {
            httpClient.getParams().setParameter(ConnRoutePNames.DEFAULT_PROXY,
                    new HttpHost(proxySettings.getHost(), proxySettings.getPort()));
        }
        return httpClient;
    }


    private static class MyRedirectHandler extends DefaultRedirectHandler {
        public boolean isRedirectRequested(final HttpResponse response, final HttpContext context) {
            if (response == null) {
                throw new IllegalArgumentException("HTTP response may not be null");
            }
            int statusCode = response.getStatusLine().getStatusCode();
            switch (statusCode) {
                case HttpStatus.SC_MOVED_TEMPORARILY:
                case HttpStatus.SC_MOVED_PERMANENTLY:
                case HttpStatus.SC_TEMPORARY_REDIRECT:
                    HttpRequest request = (HttpRequest) context.getAttribute(
                            ExecutionContext.HTTP_REQUEST);
                    String method = request.getRequestLine().getMethod();
                    // redirect on POST, too
                    return method.equalsIgnoreCase(HttpGet.METHOD_NAME)
                            || method.equalsIgnoreCase(HttpHead.METHOD_NAME)
                            || method.equalsIgnoreCase(HttpPost.METHOD_NAME);
                case HttpStatus.SC_SEE_OTHER:
                    return true;
                default:
                    return false;
            } //end of switch
        }
    }
}
