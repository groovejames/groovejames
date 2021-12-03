package groovejames.service;

import com.google.common.base.Optional;
import groovejames.service.netease.NESuggestionsResult;
import groovejames.service.netease.NetEaseService;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.pivot.collections.Map;
import org.apache.pivot.json.JSONSerializer;
import org.apache.pivot.serialization.SerializationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;
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

    public ProxySettings findProxyExcept(ProxySettings proxy, ProxyTestListener proxyTestListener) {
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

    private SortedSet<? extends ProxySettings> getProxyList() {
        log.info("Fetching proxy list...");
        TreeSet<ExtendedProxySettings> proxyList = new TreeSet<>();
        int numTries = 1;
        while (proxyList.size() < 5 && numTries <= 30) {
            try {
                proxyList.add(fetchOneProxy());
            } catch (IOException | SerializationException | ParseException e) {
                log.error("error fetching next proxy (try #{})", numTries, e);
            }
            numTries++;
        }
        log.info("Got {} proxies: {}", proxyList.size(), proxyList);
        return proxyList;
    }

    private ExtendedProxySettings fetchOneProxy() throws IOException, SerializationException, ParseException {
        try (CloseableHttpClient httpClient = createHttpClientForFetchingProxyList()) {
            try (CloseableHttpResponse response = httpClient.execute(new HttpGet("https://api.getproxylist.com/proxy?protocol=http&country[]=CN&allowsRefererHeader=1&allowsUserAgentHeader=1&allowsCookies=1&allowsPost=1&allowsHttps=1&lastTested=600"))) {
                try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                    response.getEntity().writeTo(baos);
                    String jsonContent = new String(baos.toByteArray(), StandardCharsets.UTF_8);
                    Map<String, ?> payload = JSONSerializer.parseMap(jsonContent);
                    String ip = (String) payload.get("ip");
                    int port = (Integer) payload.get("port");
                    int downloadSpeed = NumberFormat.getInstance(Locale.ENGLISH).parse(Optional.fromNullable((String) payload.get("downloadSpeed")).or("0")).intValue();
                    return new ExtendedProxySettings(ip, port, downloadSpeed);
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
