package groovejames.service.search;

import groovejames.model.Album;
import groovejames.model.Artist;
import groovejames.model.AutocompleteType;
import groovejames.model.Country;
import groovejames.model.ItemByPageNameResult;
import groovejames.model.Playlist;
import groovejames.model.SearchPlaylistsResultType;
import groovejames.model.SearchSongsResultType;
import groovejames.model.SearchUsersResultType;
import groovejames.model.Song;
import groovejames.model.Songs;
import groovejames.model.StreamKey;
import groovejames.model.User;
import groovejames.service.Grooveshark;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

public class SearchService {

    private static final Log log = LogFactory.getLog(SearchService.class);

    private final Grooveshark grooveshark;

    public SearchService(Grooveshark grooveshark) {
        this.grooveshark = grooveshark;
    }

    public List<String> getAutocomplete(String query) throws Exception {
        Song[] autocomplete = grooveshark.getAutocomplete(AutocompleteType.artist, query);
        ArrayList<String> result = new ArrayList<String>(autocomplete.length);
        for (Song s : autocomplete) {
            result.add(s.getArtistName());
        }
        return result;
    }

    public Song[] searchSongs(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Song[] result;
        switch (searchType) {
            case General: {
                // search for song names via string search
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = grooveshark.getResultsFromSearch(SearchSongsResultType.Songs, searchString);
                break;
            }
            case Album: {
                // search for songs of the given album
                Long albumID = ((AlbumSearch) searchParameter).getAlbumID();
                Song[] songs = grooveshark.albumGetAllSongs(albumID);
                result = filterDuplicateSongs(songs);
                break;
            }
            case Artist: {
                // search for all songs of the given artist
                String artistID;
                if (searchParameter instanceof ArtistURLNameSearch) {
                    // if we only got an url page name then we have to search for the artist ID first, using getItemByPageName()
                    String artistURLName = ((ArtistURLNameSearch) searchParameter).getArtistURLName();
                    ItemByPageNameResult itemByPageName = grooveshark.getItemByPageName(artistURLName);
                    Artist artist = itemByPageName.getArtist();
                    if (artist == null) {
                        log.error("no artist found for name=" + artistURLName);
                        result = new Song[]{};
                        break;
                    }
                    artistID = artist.getArtistID();
                } else {
                    // if we get an ArtistSearch instance we already have the artist ID
                    artistID = ((ArtistSearch) searchParameter).getArtistID().toString();
                }
                Song[] songs = grooveshark.artistGetAllSongs(artistID);
                result = filterDuplicateSongs(songs);
                break;
            }
            case User: {
                // search for library songs of the given user
                String userID = ((UserSearch) searchParameter).getUserID().toString();
                java.util.ArrayList<Song> allSongs = new java.util.ArrayList<Song>();
                int page = 0;
                boolean hasMore = true;
                while (hasMore) {
                    Songs songs = grooveshark.userGetSongsInLibrary(userID, page);
                    allSongs.addAll(Arrays.asList(songs.getSongs()));
                    hasMore = songs.isHasMore();
                    page++;
                }
                // search for favorites, too
                Song[] favorites = grooveshark.getFavorites(userID, SearchSongsResultType.Songs);
                allSongs.addAll(Arrays.asList(favorites));
                result = filterDuplicateSongs(allSongs.toArray(new Song[allSongs.size()]));
                break;
            }
            case Playlist: {
                Long playlistID = ((PlaylistSearch) searchParameter).getPlaylistID();
                Songs songs = grooveshark.playlistGetSongs(playlistID);
                result = songs.getSongs();
                // renumber tracks in playlist order
                long trackNum = 1L;
                for (Song song : result) {
                    song.setTrackNum(trackNum++);
                }
                break;
            }
            default: {
                throw new IllegalArgumentException("invalid search type: " + searchType);
            }
        }
        return normalizeScoreAndPopularity(result);
    }

    public StreamKey getStreamKeyFromSongID(long songID) throws Exception {
        Exception lastEx = null;
        for (int i = 1, maxRetries = 5; i <= maxRetries; i++) {
            try {
                return grooveshark.getStreamKeyFromSongIDEx(songID, /*type*/ 0, /*mobile*/ false, /*prefetch*/ false, Country.DEFAULT_COUNTRY);
            } catch (Exception ex) {
                lastEx = ex;
                log.warn("error calling getStreamKeyFromSongIDEx retry #" + i + "/" + maxRetries + ": " + ex);
                Thread.sleep(300);
            }
        }
        throw lastEx;
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
        return grooveshark.autoplayGetSong(
            songIDsAlreadySeen,
            recentArtistIDs,
            /*minDuration*/ 60,
            /*maxDuration*/ 1500,
            seedArtists,
            /*frowns*/ new ArrayList<Long>(),
            /*songQueueID*/ 0,
            Country.DEFAULT_COUNTRY);
    }


    public Song[] searchArtists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Song[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = normalizeScoreAndPopularity(grooveshark.getResultsFromSearch(SearchSongsResultType.Artists, searchString));
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        return result;
    }

    public Album[] searchAlbums(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Album[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                Song[] songs = grooveshark.getResultsFromSearch(SearchSongsResultType.Albums, searchString);
                result = Album.createAlbumsFromSongs(songs);
                break;
            case Artist:
                Long artistID = ((ArtistSearch) searchParameter).getArtistID();
                result = grooveshark.artistGetAllAlbums(artistID);
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        result = normalizePopularity(result);
        return result;
    }

    public User[] searchPeople(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        User[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = normalizeScore(grooveshark.getResultsFromSearch(SearchUsersResultType.Users, searchString));
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        return result;
    }

    public Playlist[] searchPlaylists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Playlist[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = grooveshark.getResultsFromSearch(SearchPlaylistsResultType.Playlists, searchString);
                break;
            case User:
                Long userID = ((UserSearch) searchParameter).getUserID();
                result = grooveshark.userGetPlaylists(userID);
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
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

    private Song[] normalizeScoreAndPopularity(Song[] songs) {
        double minScore = Double.MAX_VALUE, maxScore = Double.MIN_VALUE;
        double minPopularity = Double.MAX_VALUE, maxPopularity = Double.MIN_VALUE;
        for (Song song : songs) {
            if (song.getScore() > 0.0) {
                minScore = Math.min(minScore, song.getScore());
                maxScore = Math.max(maxScore, song.getScore());
            }
            if (song.getPopularity() > 0.0) {
                minPopularity = Math.min(minPopularity, song.getPopularity());
                maxPopularity = Math.max(maxPopularity, song.getPopularity());
            }
        }
        double rangeScore = maxScore - minScore;
        double rangePopularity = maxPopularity - minPopularity;
        if (maxScore > Double.MIN_VALUE || maxPopularity > Double.MIN_VALUE
            || rangeScore > 0.0 || rangePopularity > 0.0) {
            for (Song song : songs) {
                if (maxScore > Double.MIN_VALUE && rangeScore > 0.0)
                    song.setScorePercentage((song.getScore() - minScore) / rangeScore);
                if (maxPopularity > Double.MIN_VALUE && rangePopularity > 0.0)
                    song.setPopularityPercentage((song.getPopularity() - minPopularity) / rangePopularity);
            }
        }
        return songs;
    }

    private Album[] normalizePopularity(Album[] albums) {
        double minPopularity = Double.MAX_VALUE, maxPopularity = Double.MIN_VALUE;
        for (Album album : albums) {
            if (album.getPopularity() > 0.0) {
                minPopularity = Math.min(minPopularity, album.getPopularity());
                maxPopularity = Math.max(maxPopularity, album.getPopularity());
            }
        }
        double rangePopularity = maxPopularity - minPopularity;
        if (maxPopularity > Double.MIN_VALUE || rangePopularity > 0.0) {
            for (Album album : albums) {
                if (maxPopularity > Double.MIN_VALUE && rangePopularity > 0.0)
                    album.setPopularityPercentage((album.getPopularity() - minPopularity) / rangePopularity);
            }
        }
        return albums;
    }

    private User[] normalizeScore(User[] users) {
        double minScore = Double.MAX_VALUE, maxScore = Double.MIN_VALUE;
        for (User song : users) {
            minScore = Math.min(minScore, song.getScore());
            maxScore = Math.max(maxScore, song.getScore());
        }
        double range = maxScore - minScore;
        if (range > 0.0) {
            for (User song : users) {
                song.setScorePercentage((song.getScore() - minScore) / range);
            }
        }
        return users;
    }

}


