package groovejames.service;

import org.apache.http.HttpHost;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.LaxRedirectStrategy;

public class HttpClientService {

    private static final String USER_AGENT = System.getProperty("userAgent",
            "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)");

    private static final int SOCKET_TIMEOUT = Integer.getInteger("socketTimeout", 30);

    private ProxySettings proxySettings;
    private HttpClient httpClient;

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

    public HttpClient getHttpClient() {
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

    private static HttpClient createHttpClient(ProxySettings proxySettings) {
        HttpClientBuilder httpClientBuilder = HttpClientBuilder.create()
                /* set user agent string */
                .setUserAgent(USER_AGENT)
                /* disable gzip compression */
                .disableContentCompression()
                /* redirect on POSTs, too */
                .setRedirectStrategy(new LaxRedirectStrategy())
                .setDefaultRequestConfig(RequestConfig.custom()
                        /* timeout in milliseconds until a connection is established, in ms */
                        .setConnectTimeout(SOCKET_TIMEOUT * 1000)
                        /* socket timeout in milliseconds, which is the timeout for waiting for data */
                        .setSocketTimeout(SOCKET_TIMEOUT * 1000)
                        /* don't use "Expect: 100-continue" because some proxies don't understand */
                        .setExpectContinueEnabled(false)
                        /* need to relax default cookie policy because grooveshark.com sends cookies with invalid expiry dates */
                        .setCookieSpec(CookieSpecs.BROWSER_COMPATIBILITY)
                        .build());
        if (proxySettings != null) {
            httpClientBuilder.setProxy(new HttpHost(proxySettings.getHost(), proxySettings.getPort()));
        }
        return httpClientBuilder.build();

        // the factory for connection manager to use multi-thread connection manager
//        httpClient.getParams().setParameter(
//                ClientPNames.CONNECTION_MANAGER_FACTORY_CLASS_NAME,
//                ThreadSafeClientConnManagerFactory.class.getName());
    }

}