package groovejames.service;

import groovejames.model.Country;
import groovejames.model.SearchSongsResultType;
import groovejames.model.Song;
import groovejames.model.StreamKey;

public class GsProxyTest {

    public static void main(String[] args) throws Exception {
        System.setProperty("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.SimpleLog");
        System.setProperty("org.apache.commons.logging.simplelog.showdatetime", "true");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.wire", "ERROR");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.impl.conn", "DEBUG");
        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.impl.client", "DEBUG");

        HttpClientService httpClientService = new HttpClientService();
//        httpClientService.setProxySettings(new ProxySettings("myproxy", 8080));
        Grooveshark grooveshark = GroovesharkService.connect(httpClientService);
        Song[] songs = grooveshark.getSearchResultsEx(SearchSongsResultType.Songs, "The Cure");
        for (Song song : songs) {
            System.out.printf("%s (%s) - %s (%s) - %f%n", song.getArtistName(), song.getArtistID(),
                    song.getAlbumName(), song.getAlbumID(), song.getRank());
        }

        long songID = songs[0].getSongID();
        StreamKey streamKey = grooveshark.getStreamKeyFromSongIDEx(songID,
                false, false, Country.GSLITE_GERMAN_COUNTRY);
        System.out.printf("%n%nstream key for song #0 id=%s: %s%n", songID, streamKey);
    }
}
