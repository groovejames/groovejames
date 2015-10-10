package groovejames.service;

import groovejames.gui.clipboard.WatchClipboardTask;
import groovejames.model.Settings;
import groovejames.service.netease.NetEaseService;
import groovejames.service.search.SearchService;

import java.io.File;
import java.io.IOException;

import static groovejames.util.Util.isEmpty;

/**
 * This is something like a Spring ApplicationContext, built manually.
 */
public class Services {

    private static final HttpClientService httpClientService = new HttpClientService();
    private static final NetEaseService neteaseService = new NetEaseService(httpClientService);
    private static final DownloadService downloadService = new DownloadService(httpClientService);
    private static final PlayService playService = new PlayService(downloadService);
    private static final WatchClipboardTask watchClipboardTask = new WatchClipboardTask();
    private static Grooveshark grooveshark = null; // lazy initialized

    /**
     * scope: singleton, init:eager.
     */
    public static HttpClientService getHttpClientService() {
        return httpClientService;
    }

    /**
     * scope: singleton, init:eager.
     */
    public static NetEaseService getNeteaseService() { return neteaseService; }

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
     * scope: prototype.
     */
    public static SearchService getSearchService() throws IOException {
        return new SearchService(neteaseService);
    }

    /**
     * scope: singleton, init: lazy.
     */
    private static synchronized Grooveshark getGrooveshark() throws IOException {
        if (grooveshark == null) {
            try {
                grooveshark = GroovesharkService.connect(httpClientService);
            } catch (IOException ex) {
                throw new IOException("could not connect to Grooveshark", ex);
            }
        }
        return grooveshark;
    }

    public static synchronized void resetGrooveshark() {
        grooveshark = null;
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
        httpClientService.setProxySettings(settings.isProxyEnabled() && !isEmpty(settings.getProxyHost()) ? new ProxySettings(settings.getProxyHost(), settings.getProxyPort()) : null);
        downloadService.setDownloadDir(new File(settings.getDownloadLocation()));
        downloadService.getFilenameSchemeParser().setFilenameScheme(settings.getFilenameScheme());
        setWatchClipboardTaskEnabled(settings.isWatchClipboard());
        resetGrooveshark();
    }

}
