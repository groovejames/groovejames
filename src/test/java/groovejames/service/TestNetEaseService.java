package groovejames.service;

import groovejames.service.netease.NEAccount;
import groovejames.service.netease.NEArtist;
import groovejames.service.netease.NEDownloadInfo;
import groovejames.service.netease.NESongDetails;
import groovejames.service.netease.NetEaseService;

public class TestNetEaseService {

    public static void main(String[] args) throws Exception {
        System.setProperty("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.SimpleLog");
        System.setProperty("org.apache.commons.logging.simplelog.showdatetime", "true");
        System.setProperty("org.apache.commons.logging.simplelog.log.groovejames", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.wire", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.impl.conn", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.impl.client", "DEBUG");

        HttpClientService httpClientService = new HttpClientService();
        NetEaseService netEaseService = new NetEaseService(httpClientService);

        testDownloadInfo(netEaseService);

        if (args.length == 2) {
            String username = args[0];
            String password = args[1];
            testLogin(netEaseService, username, password);
            testGetSimilarSongs(netEaseService);
            testGetSimilarArtists(netEaseService);
        }
    }

    private static void testDownloadInfo(NetEaseService netEaseService) throws Exception {
        long songID = 28240577L;
        NESongDetails songDetails = netEaseService.getSongDetails(new long[] {songID}).get(songID);
        NEDownloadInfo downloadInfo = netEaseService.getDownloadInfo(songDetails);
        System.out.printf("URL: %s%nBitrate: %s%n", downloadInfo.url, downloadInfo.bitrate);
    }

    private static NEAccount testLogin(NetEaseService netEaseService, String username, String password) throws Exception {
        NEAccount account = netEaseService.login(username, password);
        System.out.printf("account id: %d%n", account.id);
        return account;
    }

    private static void testGetSimilarSongs(NetEaseService netEaseService) throws Exception {
        NESongDetails[] similarSongs = netEaseService.getSimilarSongs(32619806L);
        for (NESongDetails song : similarSongs) {
            System.out.printf("id:%d %s%n", song.id, song.name);
        }
    }

    private static void testGetSimilarArtists(NetEaseService netEaseService) throws Exception {
        NEArtist[] similarArtists = netEaseService.getSimilarArtists(29320L);
        for (NEArtist artist : similarArtists) {
            System.out.printf("id:%d %s%n", artist.id, artist.name);
        }
    }
}