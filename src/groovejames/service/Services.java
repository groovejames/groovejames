package groovejames.service;

import groovejames.service.search.SearchService;

import java.io.IOException;

/**
 * This is something like a Spring ApplicationContext, built manually.
 */
public class Services {

    private static final HttpClientService httpClientService = new HttpClientService();
    private static final DownloadService downloadService = new DownloadService(httpClientService);
    private static final PlayService playService = new PlayService(downloadService);
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
        return new SearchService(getGrooveshark());
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

}
