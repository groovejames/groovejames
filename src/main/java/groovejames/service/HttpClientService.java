package groovejames.service;

import com.google.common.base.Strings;
import groovejames.util.IOUtils;
import org.apache.http.HttpHost;
import org.apache.http.client.CookieStore;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.LaxRedirectStrategy;

public class HttpClientService {

    public static final String USER_AGENT = System.getProperty("userAgent",
            "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)");

    private static final int SOCKET_TIMEOUT = Integer.getInteger("socketTimeout", 30);

    private ProxySettings proxySettings;
    private CloseableHttpClient httpClient;
    private Integer connectTimeout;
    private Integer socketTimeout;
    private final CookieStore cookieStore = new BasicCookieStore();

    public HttpClientService() {
    }

    /** override default connect timeout, in ms. */
    public void setConnectTimeout(Integer connectTimeout) {
        this.connectTimeout = connectTimeout;
    }

    /** override default socket timeout, in ms. */
    public void setSocketTimeout(Integer socketTimeout) {
        this.socketTimeout = socketTimeout;
    }

    public synchronized void setProxySettings(ProxySettings proxySettings) {
        if (proxySettings == null && this.proxySettings != null
                || proxySettings != null && !proxySettings.equals(this.proxySettings)) {
            shutdown();
            this.proxySettings = proxySettings;
        }
    }

    public synchronized boolean isUsingProxy() {
        return proxySettings != null && proxySettings.getHost() != null;
    }

    public synchronized HttpClient getHttpClient() {
        if (httpClient == null)
            httpClient = createHttpClient(proxySettings);
        return httpClient;
    }

    public synchronized void shutdown() {
        if (httpClient != null) {
            IOUtils.closeQuietly(httpClient);
            httpClient = null;
        }
    }

    private CloseableHttpClient createHttpClient(ProxySettings proxySettings) {
        HttpClientBuilder httpClientBuilder = HttpClientBuilder.create()
                /* set user agent string */
                .setUserAgent(USER_AGENT)
                /* redirect on POSTs, too */
                .setRedirectStrategy(new LaxRedirectStrategy())
                /* increase max total connections from 20 to 200 */
                .setMaxConnTotal(200)
                /* increate max connections per route from 2 to 200 (we only have one route) */
                .setMaxConnPerRoute(200)
                /* set retry handler with maximum 3 retries and requestSentRetryEnabled=true so that even POST requests are retried (default is false) */
                .setRetryHandler(new DefaultHttpRequestRetryHandler(3, true))
                .setDefaultCookieStore(cookieStore)
                .setDefaultRequestConfig(RequestConfig.custom()
                        /* timeout in milliseconds until a connection is established, in ms */
                        .setConnectTimeout(connectTimeout != null ? connectTimeout : SOCKET_TIMEOUT * 1000)
                        /* socket timeout in milliseconds, which is the timeout for waiting for data */
                        .setSocketTimeout(socketTimeout != null ? socketTimeout : SOCKET_TIMEOUT * 1000)
                        /* don't use "Expect: 100-continue" because some proxies don't understand */
                        .setExpectContinueEnabled(false)
                        /* need to relax default cookie policy to avoid problem with cookies with invalid expiry dates */
                        .setCookieSpec(CookieSpecs.BROWSER_COMPATIBILITY)
                        .build());
        if (proxySettings != null) {
            httpClientBuilder.setProxy(new HttpHost(proxySettings.getHost(), proxySettings.getPort()));
        }
        return httpClientBuilder.build();
    }

}
