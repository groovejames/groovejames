package groovejames.service;

import groovejames.service.netease.NESongDetails;
import groovejames.service.netease.NetEaseService;

public class NetEaseServiceTest {

    public static void main(String[] args) throws Exception {
        System.setProperty("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.SimpleLog");
        System.setProperty("org.apache.commons.logging.simplelog.showdatetime", "true");
        System.setProperty("org.apache.commons.logging.simplelog.log.groovejames", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.wire", "ERROR");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.impl.conn", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.impl.client", "DEBUG");

        long songID = 28240577L;
        HttpClientService httpClientService = new HttpClientService();
        NetEaseService netEaseService = new NetEaseService(httpClientService);
        NESongDetails songDetails = netEaseService.getSongDetails(new long[] {songID}).get(songID);
        String downloadUrl = netEaseService.getDownloadUrl(songDetails);
        System.out.println(downloadUrl);
    }
}
