package groovejames.service;

import com.google.common.base.Splitter;
import groovejames.service.netease.NESuggestionsResult;
import groovejames.service.netease.NetEaseService;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Random;
import java.util.TreeSet;
import java.util.regex.Pattern;

public class ProxyTestService {

    public interface ProxyTestListener {
        void checking(String hostnameAndPort);
    }

    private static final Logger log = LoggerFactory.getLogger(ProxyTestService.class);

    private final TreeSet<ProxySettings> currentProxyList = new TreeSet<>();
    private final Random random = new Random();

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

    public ProxySettings findProxyExcept(ProxySettings proxy, ProxyTestListener proxyTestListener) throws IOException {
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

    @SuppressWarnings("UnstableApiUsage")
    private TreeSet<? extends ProxySettings> getProxyList() throws IOException {
        log.info("Fetching proxy list...");
        TreeSet<ExtendedProxySettings> proxyList = new TreeSet<>();
        try (CloseableHttpClient httpClient = createHttpClientForFetchingProxyList()) {
            try (CloseableHttpResponse response = httpClient.execute(new HttpGet("https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=5000&country=CN&ssl=1&anonymity=all"))) {
                try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                    response.getEntity().writeTo(baos);
                    String content = new String(baos.toByteArray(), StandardCharsets.UTF_8);
                    log.info("New proxy list content:\n{}", content);
                    List<String> strings = Splitter.on(Pattern.compile("\r?\n")).omitEmptyStrings().trimResults().splitToList(content);
                    for (String string : strings) {
                        List<String> parts = Splitter.on(':').splitToList(string);
                        String ip = parts.get(0);
                        int port = Integer.parseInt(parts.get(1));
                        int speed = random.nextInt(); // api.proxyscrape.com doesn't provide speed info. List will be sorted by speed, so use random sorting
                        proxyList.add(new ExtendedProxySettings(ip, port, speed));
                    }
                }
            }
        }
        log.info("New proxy list: {}", proxyList);
        return proxyList;
    }

    private CloseableHttpClient createHttpClientForFetchingProxyList() {
        return HttpClientBuilder
            .create()
            .setDefaultRequestConfig(RequestConfig.custom()
                /* timeout in milliseconds until a connection is established, in ms */
                .setConnectTimeout(10000)
                /* socket timeout in milliseconds, which is the timeout for waiting for data */
                .setSocketTimeout(10000)
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
