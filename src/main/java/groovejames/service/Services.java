package groovejames.service;

import groovejames.gui.clipboard.WatchClipboardTask;
import groovejames.model.Settings;
import groovejames.service.netease.INetEaseService;
import groovejames.service.netease.NetEaseService;
import groovejames.service.netease.NetEaseServiceMock;
import groovejames.service.search.SearchService;

import java.io.File;
import java.io.IOException;

import static com.google.common.base.Strings.isNullOrEmpty;

/**
 * This is something like a Spring ApplicationContext, built manually.
 */
public class Services {

    private static final HttpClientService httpClientService = new HttpClientService();
    private static final INetEaseService neteaseService = Boolean.getBoolean("mockNet") ? new NetEaseServiceMock() : new NetEaseService(httpClientService);
    private static final SearchService searchService = new SearchService(neteaseService);
    private static final DownloadService downloadService = new DownloadService(httpClientService, searchService);
    private static final PlayService playService = new PlayService(downloadService);
    private static final WatchClipboardTask watchClipboardTask = new WatchClipboardTask();

    /**
     * scope: singleton, init:eager.
     */
    public static HttpClientService getHttpClientService() {
        return httpClientService;
    }

    /**
     * scope: singleton, init:eager.
     */
    public static DownloadService getDownloadService() {
        return downloadService;
    }

    /**
     * scope: singleton, init:eager.
     */
    public static PlayService getPlayService() {
        return playService;
    }

    /**
     * scope: singleton, init:eager.
     */
    public static SearchService getSearchService() throws IOException {
        return searchService;
    }

    public static WatchClipboardTask getWatchClipboardTask() {
        return watchClipboardTask;
    }

    private static synchronized void setWatchClipboardTaskEnabled(boolean enabled) {
        if (enabled) {
            if (!watchClipboardTask.isWatching()) {
                watchClipboardTask.startWatching();
            }
        } else {
            watchClipboardTask.stopWatching();
        }
    }

    public static void applySettings(Settings settings) {
        httpClientService.setProxySettings(settings.isProxyEnabled() && !isNullOrEmpty(settings.getProxyHost()) ? new ProxySettings(settings.getProxyHost(), settings.getProxyPort()) : null);
        downloadService.setDownloadDir(new File(settings.getDownloadLocation()));
        downloadService.getFilenameSchemeParser().setFilenameScheme(settings.getFilenameScheme());
        setWatchClipboardTaskEnabled(settings.isWatchClipboard());
    }

}
