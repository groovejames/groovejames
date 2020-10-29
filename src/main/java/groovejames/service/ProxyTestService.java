package groovejames.service;

import groovejames.service.netease.NESuggestionsResult;
import groovejames.service.netease.NetEaseService;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.pivot.collections.List;
import org.apache.pivot.collections.Map;
import org.apache.pivot.json.JSONSerializer;
import org.apache.pivot.serialization.SerializationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.SortedSet;
import java.util.TreeSet;

public class ProxyTestService {

    public interface ProxyTestListener {
        void checking(String hostnameAndPort);
    }

    private static final Logger log = LoggerFactory.getLogger(ProxyTestService.class);

    private final TreeSet<ProxySettings> currentProxyList = new TreeSet<>();

    public void checkProxy(String host, int port) throws Exception {
        checkProxy(new ProxySettings(host, port));
    }

    public void checkProxy(ProxySettings proxySettings) throws Exception {
        HttpClientService httpClientService = new HttpClientService();
        httpClientService.setConnectTimeout(3000);
        httpClientService.setSocketTimeout(5000);
        httpClientService.setProxySettings(proxySettings);
        NetEaseService netEaseService = new NetEaseService(httpClientService);
        NESuggestionsResult result = netEaseService.getSuggestions("depeche mode", 1);
        netEaseService.getAlbums(result.artists[0].id, 0, 1);
    }

    public ProxySettings findProxyExcept(ProxySettings proxy, ProxyTestListener proxyTestListener) throws IOException, SerializationException {
        if (currentProxyList.isEmpty()) {
            currentProxyList.addAll(getProxyList());
            currentProxyList.remove(proxy);
        }
        log.info("Testing proxy list (except {}) ...", proxy);
        ProxySettings testProxy;
        while ((testProxy = currentProxyList.pollFirst()) != null) {
            try {
                if (proxyTestListener != null) proxyTestListener.checking(testProxy.toString());
                checkProxy(testProxy);
                return testProxy;
            } catch (Exception e) {
                log.error("find proxy: this proxy doesn't work: {}, reason: {}", testProxy, e.toString());
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private SortedSet<? extends ProxySettings> getProxyList() throws IOException, SerializationException {
        log.info("Fetching proxy list...");
        String proxyListResponseJson = fetchProxyList();
        log.info("Raw proxy list response: {}", proxyListResponseJson);
        Map<String, ?> proxyListResponse = JSONSerializer.parseMap(proxyListResponseJson);
        List<?> proxyList = (List<?>) proxyListResponse.get("data");
        TreeSet<ExtendedProxySettings> result = new TreeSet<>();
        for (Object entry : proxyList) {
            Map<String, ?> proxy = (Map<String, ?>) entry;
            result.add(new ExtendedProxySettings(
                (String) proxy.get("ip"),
                Integer.parseInt((String) proxy.get("port")),
                Integer.parseInt((String) proxy.get("speed"))));
        }
        log.info("Got {} proxies: {}", result.size(), result);
        return result;
    }

    private String fetchProxyList() throws IOException {
        try (CloseableHttpClient httpClient = createHttpClientForFetchingProxyList()) {
            try (CloseableHttpResponse response = httpClient.execute(new HttpGet("http://pubproxy.com/api/proxy?country=CN&type=http&limit=10&post=true&format=json"))) {
                try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                    response.getEntity().writeTo(baos);
                    return new String(baos.toByteArray(), StandardCharsets.UTF_8);
                }
            }
        }
    }

    private CloseableHttpClient createHttpClientForFetchingProxyList() {
        return HttpClientBuilder
            .create()
            .setDefaultRequestConfig(RequestConfig.custom()
                /* timeout in milliseconds until a connection is established, in ms */
                .setConnectTimeout(3000)
                /* socket timeout in milliseconds, which is the timeout for waiting for data */
                .setSocketTimeout(5000)
                .build())
            .build();
    }

    private static class ExtendedProxySettings extends ProxySettings implements Comparable<ProxySettings> {
        private final int speed;

        public ExtendedProxySettings(String host, int port, int speed) {
            super(host, port);
            this.speed = speed;
        }

        @Override
        public int compareTo(ProxySettings other) {
            if (other instanceof ExtendedProxySettings) {
                return this.speed - ((ExtendedProxySettings) other).speed;
            } else {
                return super.compareTo(other);
            }
        }
    }
}
