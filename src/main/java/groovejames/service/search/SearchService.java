package groovejames.service.search;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import groovejames.model.Album;
import groovejames.model.Artist;
import groovejames.model.ItemByPageNameResult;
import groovejames.model.Playlist;
import groovejames.model.Scoreable;
import groovejames.model.Song;
import groovejames.model.StreamKey;
import groovejames.model.User;
import groovejames.service.netease.NESong;
import groovejames.service.netease.NESongDetails;
import groovejames.service.netease.NESongDetailsResultResponse;
import groovejames.service.netease.NetEaseException;
import groovejames.service.netease.NetEaseService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import static groovejames.util.Util.isEmpty;

public class SearchService {

    private static final Log log = LogFactory.getLog(SearchService.class);

    private final NetEaseService netEaseService;

    public SearchService(NetEaseService netEaseService) {
        this.netEaseService = netEaseService;
    }

    public List<String> getAutocomplete(String query) throws Exception {
        return Collections.emptyList();
    }

    public NESongDetails getSongDetails(long songID) throws Exception {
        NESongDetails songDetails = netEaseService.getSongDetails(songID);

        HttpResponse<NESongDetailsResultResponse> r = Unirest.post("http://music.163.com/api/song/detail")
                .header("Referer", "http://music.163.com")
                .field("ids", "[" + songID + "]")
                .asObject(NESongDetailsResultResponse.class);
        NESongDetailsResultResponse result = r.getBody();
        if (result.code != 200) throw new NetEaseException("error getting song details: " + result.code);
        if (result.songs == null || result.songs.length == 0) throw new NetEaseException("song id not found: " + songID);
        return result.songs[0];
    }

    public Song[] searchSongs(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Song[] result;
        switch (searchType) {
            case General: {
                // search for song names via string search
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                List<NESong> songs = netEaseService.searchSongs(searchString);
                result = new Song[songs.size()];
                int i = 0;
                for (NESong neSong : songs) {
                    Song song = new Song();
                    song.setName(neSong.name);
                    song.setSongName(neSong.name);
                    song.setSongID(neSong.id);
                    song.setAlbumName(neSong.album.name);
                    song.setAlbumID(neSong.album.id);
                    song.setArtistName(neSong.artists[0].name);
                    song.setArtistID(neSong.artists[0].id);
                    result[i++] = song;
                }
                break;
            }
            case Album: {
                // search for songs of the given album
                Long albumID = ((AlbumSearch) searchParameter).getAlbumID();
                Song[] songs = new Song[0];
                result = songs;
                break;
            }
            case Artist: {
                // search for all songs of the given artist
                Long artistID = getArtistID(searchParameter);
                Song[] songs = new Song[0];
                result = filterDuplicateSongs(songs);
                break;
            }
            case User: {
                // search for library songs of the given user
                String userID = ((UserSearch) searchParameter).getUserID().toString();
                Song[] songs = new Song[0];
                result = filterDuplicateSongs(songs);
                break;
            }
            case Playlist: {
                Long playlistID = ((PlaylistSearch) searchParameter).getPlaylistID();
                Song[] songs = new Song[0];
                result = filterDuplicateSongs(songs);
                break;
            }
            case Songs: {
                Set<Long> songIDs = ((SongSearch) searchParameter).getSongIDs();
                Song[] songs = new Song[0];
                result = filterDuplicateSongs(songs);
                break;
            }
            default: {
                throw new IllegalArgumentException("invalid search type: " + searchType);
            }
        }
        normalize(result);
        return result;
    }

    public StreamKey getStreamKeyFromSongID(long songID) throws Exception {
        return new StreamKey("dummy", "ip");
    }

    public Song autoplayGetSong(Iterable<Song> songsAlreadySeen) throws Exception {
        /*
       {"header":{"privacy":0,"country":{"DMA":807,"CC1":0,"ID":223,"CC2":0,"IPR":0,"CC4":1073741824,"CC3":0},"session":"d9c5aaa75a9a11ea52adf8e242938b72","token":"727e15ab9ccf8f098ba6a5047987d451796bf3255dedea","uuid":"2FBE082B-BF60-4E23-9EBC-7CC77CEB5AE0","client":"jsqueue","clientRevision":"20120830"},"parameters":{"songIDsAlreadySeen":[35501],"recentArtists":[822],"minDuration":60,"seedArtistWeightRange":[70,100],"country":{"DMA":807,"CC1":0,"ID":223,"CC2":0,"IPR":0,"CC4":1073741824,"CC3":0},"secondaryArtistWeightModifier":0.9,"weightModifierRange":[-9,9],"seedArtists":{"822":"p"},"songQueueID":"1346948642359","frowns":[],"maxDuration":1500},"method":"autoplayGetSong"}
        */
        ArrayList<Long> songIDsAlreadySeen = new ArrayList<Long>();
        TreeSet<Long> recentArtistIDs = new TreeSet<Long>();
        for (Song song : songsAlreadySeen) {
            songIDsAlreadySeen.add(song.getSongID());
            recentArtistIDs.add(song.getArtistID());
        }
        Map<String, String> seedArtists = new HashMap<String, String>();
        seedArtists.put(recentArtistIDs.iterator().next().toString(), "p");
//        return grooveshark.autoplayGetSong(
//            songIDsAlreadySeen,
//            recentArtistIDs,
//            /*minDuration*/ 60,
//            /*maxDuration*/ 1500,
//            seedArtists,
//            /*frowns*/ new ArrayList<Long>(),
//            /*songQueueID*/ 0,
//            Country.DEFAULT_COUNTRY);
        return null;
    }


    public Artist[] searchArtists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Artist[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = new Artist[0];
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        normalize(result);
        return result;
    }

    public Album[] searchAlbums(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Album[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = new Album[0];
                break;
            case Artist:
                Long artistID = getArtistID(searchParameter);
                String artistName = getArtistName(searchParameter);
                result = new Album[0];
                // sometimes grooveshark doesn't send artist names when we search by artistID, so:
                for (Album album : result) {
                    if (isEmpty(album.getArtistName())) {
                        album.setArtistName(artistName);
                    }
                }
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        normalize(result);
        return result;
    }

    public User[] searchPeople(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        User[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = new User[0];
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        normalize(result);
        return result;
    }

    public Playlist[] searchPlaylists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Playlist[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = new Playlist[0];
                break;
            case User:
                Long userID = ((UserSearch) searchParameter).getUserID();
                result = new Playlist[0];
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        normalize(result);
        return result;
    }

    private Song[] filterDuplicateSongs(Song[] songs) {
        HashSet<Long> allSongsIds = new HashSet<Long>();
        ArrayList<Song> resultList = new ArrayList<Song>(songs.length);
        for (Song song : songs) {
            Long songID = song.getSongID();
            if (!allSongsIds.contains(songID)) {
                resultList.add(song);
                allSongsIds.add(songID);
            }
        }
        return resultList.toArray(new Song[resultList.size()]);
    }

    private void normalize(Scoreable[] scoreables) {
        Double minScore = null, maxScore = null;
        Long minPopularityIndex = null, maxPopularityIndex = null;
        Double minPopularity = null, maxPopularity = null;
        for (Scoreable scoreable : scoreables) {
            Double score = scoreable.getScore();
            if (score != null && score > 0.0) {
                if (minScore == null || score < minScore) minScore = score;
                if (maxScore == null || score > maxScore) maxScore = score;
            }
            Long popularityIndex = scoreable.getPopularityIndex();
            if (popularityIndex != null && popularityIndex > 0) {
                if (minPopularityIndex == null || popularityIndex < minPopularityIndex) minPopularityIndex = popularityIndex;
                if (maxPopularityIndex == null || popularityIndex > maxPopularityIndex) maxPopularityIndex = popularityIndex;
            }
            Double popularity = scoreable.getPopularity();
            if (popularity != null && popularity > 0.0) {
                if (minPopularity == null || popularity < minPopularity) minPopularity = popularity;
                if (maxPopularity == null || popularity > maxPopularity) maxPopularity = popularity;
            }
            if (scoreable instanceof Song) {
                fixup((Song) scoreable);
            }
        }
        boolean canAdjustScore = minScore != null && maxScore != null && minScore < maxScore;
        boolean canAdjustPopularityIndex = minPopularityIndex != null && maxPopularityIndex != null && minPopularityIndex < maxPopularityIndex;
        boolean canAdjustPopularity = minPopularity != null && maxPopularity != null && minPopularity < maxPopularity;
        if (!canAdjustScore && !canAdjustPopularityIndex && !canAdjustPopularity) {
            return;
        }
        for (Scoreable scoreable : scoreables) {
            if (canAdjustScore)
                if (scoreable.getScore() != null)
                    scoreable.setScorePercentage((scoreable.getScore() - minScore) / (maxScore - minScore));
                else
                    scoreable.setScore(0.0);
            if (canAdjustPopularityIndex)
                if (scoreable.getPopularityIndex() != null)
                    scoreable.setPopularityPercentage(((double) (scoreable.getPopularityIndex() - minPopularityIndex)) / ((double) (maxPopularityIndex - minPopularityIndex)));
                else
                    scoreable.setPopularityIndex(0L);
            else if (canAdjustPopularity)
                if (scoreable.getPopularity() != null)
                    scoreable.setPopularityPercentage((scoreable.getPopularity() - minPopularity) / (maxPopularity - minPopularity));
                else
                    scoreable.setPopularity(0.0);
        }
    }

    private void fixup(Song song) {
        if (song.getEstimateDuration() != null) {
            if (song.getEstimateDuration() <= 0 || song.getEstimateDuration() >= 4096.0 /* unreasonable value (1:08h) */) {
                song.setEstimateDuration(null);
            }
        }
    }

    private Long getArtistID(SearchParameter searchParameter) throws Exception {
        if (searchParameter instanceof ArtistURLNameSearch) {
            // if we only got an url page name then we have to search for the artist ID first, using getItemByPageName()
            String artistURLName = ((ArtistURLNameSearch) searchParameter).getArtistURLName();
            ItemByPageNameResult itemByPageName = null; //grooveshark.getItemByPageName(artistURLName);
            Artist artist = itemByPageName.getArtist();
            if (artist == null) {
                log.error("no artist found for name=" + artistURLName);
                return null;
            }
            return artist.getArtistID();
        } else if (searchParameter instanceof ArtistSearch) {
            // if we get an ArtistSearch instance we already have the artist ID
            return ((ArtistSearch) searchParameter).getArtistID();
        } else {
            throw new IllegalArgumentException("illegal searchParameter type: " + searchParameter.getClass());
        }
    }

    private String getArtistName(SearchParameter searchParameter) throws Exception {
        if (searchParameter instanceof ArtistURLNameSearch) {
            return ((ArtistURLNameSearch) searchParameter).getArtistName();
        } else if (searchParameter instanceof ArtistSearch) {
            return ((ArtistSearch) searchParameter).getArtistName();
        } else {
            throw new IllegalArgumentException("illegal searchParameter type: " + searchParameter.getClass());
        }
    }

}
