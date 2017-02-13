package groovejames.service;

import groovejames.service.netease.NEAccount;
import groovejames.service.netease.NEArtist;
import groovejames.service.netease.NESongDetails;
import groovejames.service.netease.NetEaseService;

import static java.util.Collections.singletonList;

public class TestNetEaseService {

    public static void main(String[] args) throws Exception {
        HttpClientService httpClientService = new HttpClientService();
        //httpClientService.setProxySettings(new ProxySettings("124.88.67.81", 80)); //China
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
        long songID = 22727009L;
        NESongDetails songDetails = netEaseService.getSongDetails(singletonList(songID)).get(songID);
        String url = netEaseService.determineDownloadURL2(songDetails.id, songDetails.bitrate);
        System.out.printf("URL: %s%nBitrate: %s%n", url, songDetails.bitrate);
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
