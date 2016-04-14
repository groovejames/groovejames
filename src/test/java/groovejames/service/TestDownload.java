package groovejames.service;

import groovejames.model.SearchResult;
import groovejames.model.Song;
import groovejames.service.netease.NetEaseService;
import groovejames.service.search.SearchService;
import groovejames.service.search.SongSearch;

import java.io.File;

public class TestDownload {

    public static void main(String[] args) throws Exception {
        System.setProperty("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.SimpleLog");
        System.setProperty("org.apache.commons.logging.simplelog.showdatetime", "true");
        System.setProperty("org.apache.commons.logging.simplelog.log.groovejames", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.wire", "WARN");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.impl.conn", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.impl.client", "DEBUG");

        HttpClientService httpClientService = new HttpClientService();
        NetEaseService netEaseService = new NetEaseService(httpClientService);
        SearchService searchService = new SearchService(netEaseService);

        SearchResult<Song> songSearchResult = searchService.searchSongs(new SongSearch(1782142L, "Can Your Love Find It's Way (Club Vocal)", true));
        Song song = songSearchResult.getResult()[0];

        DownloadService downloadService = new DownloadService(httpClientService, searchService);
        downloadService.setDownloadDir(new File("/tmp"));
        downloadService.download(song);
    }

}
