package groovejames.service.search;

import groovejames.model.Album;
import groovejames.model.Artist;
import groovejames.model.AutocompleteType;
import groovejames.model.Country;
import groovejames.model.ItemByPageNameResult;
import groovejames.model.Playlist;
import groovejames.model.Scoreable;
import groovejames.model.SearchAlbumsResultType;
import groovejames.model.SearchArtistsResultType;
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
import java.util.Set;
import java.util.TreeSet;

import static groovejames.util.Util.isEmpty;

public class SearchService {

    private static final Log log = LogFactory.getLog(SearchService.class);

    private final Grooveshark grooveshark;

    public SearchService(Grooveshark grooveshark) {
        this.grooveshark = grooveshark;
    }

    public List<String> getAutocomplete(String query) throws Exception {
        Artist[] autocomplete = grooveshark.getAutocomplete(AutocompleteType.artist, query);
        ArrayList<String> result = new ArrayList<String>(autocomplete.length);
        for (Artist artist : autocomplete) {
            result.add(artist.getArtistName());
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
                Long artistID = getArtistID(searchParameter);
                Song[] songs = artistID != null ? grooveshark.artistGetArtistSongs(artistID) : new Song[0];
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
            case Songs: {
                Set<Long> songIDs = ((SongSearch) searchParameter).getSongIDs();
                List<Song> songs = new ArrayList<Song>();
                for (long songID : songIDs) {
                    try {
                        String token = grooveshark.getTokenForSong(songID, Country.DEFAULT_COUNTRY);
                        Song song = grooveshark.getSongFromToken(token, Country.DEFAULT_COUNTRY);
                        if (song != null && song.getSongID() != null) {
                            songs.add(song);
                        }
                    } catch (Exception ex) {
                        log.error("cannot convert songID=" + songID + " to song", ex);
                    }
                }
                result = songs.toArray(new Song[songs.size()]);
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
        normalize(result);
        return result;
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


    public Artist[] searchArtists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Artist[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = grooveshark.getResultsFromSearch(SearchArtistsResultType.Artists, searchString);
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
                result = grooveshark.getResultsFromSearch(SearchAlbumsResultType.Albums, searchString);
                break;
            case Artist:
                Long artistID = getArtistID(searchParameter);
                String artistName = getArtistName(searchParameter);
                result = artistID != null ? grooveshark.artistGetAllAlbums(artistID) : new Album[0];
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
                result = grooveshark.getResultsFromSearch(SearchUsersResultType.Users, searchString);
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
                result = grooveshark.getResultsFromSearch(SearchPlaylistsResultType.Playlists, searchString);
                break;
            case User:
                Long userID = ((UserSearch) searchParameter).getUserID();
                result = grooveshark.userGetPlaylists(userID);
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
        double minScore = Double.MAX_VALUE, maxScore = Double.MIN_VALUE;
        double minPopularity = Double.MAX_VALUE, maxPopularity = Double.MIN_VALUE;
        for (Scoreable scoreable : scoreables) {
            if (scoreable.getScore() > 0.0) {
                minScore = Math.min(minScore, scoreable.getScore());
                maxScore = Math.max(maxScore, scoreable.getScore());
            }
            if (scoreable.getPopularity() > 0.0) {
                minPopularity = Math.min(minPopularity, scoreable.getPopularity());
                maxPopularity = Math.max(maxPopularity, scoreable.getPopularity());
            }
        }
        double rangeScore = maxScore - minScore;
        double rangePopularity = maxPopularity - minPopularity;
        if (maxScore > Double.MIN_VALUE || maxPopularity > Double.MIN_VALUE
            || rangeScore > 0.0 || rangePopularity > 0.0) {
            for (Scoreable scoreable : scoreables) {
                if (maxScore > Double.MIN_VALUE && rangeScore > 0.0)
                    scoreable.setScorePercentage((scoreable.getScore() - minScore) / rangeScore);
                if (maxPopularity > Double.MIN_VALUE && rangePopularity > 0.0)
                    scoreable.setPopularityPercentage((scoreable.getPopularity() - minPopularity) / rangePopularity);
            }
        }
    }

    private Long getArtistID(SearchParameter searchParameter) throws Exception {
        if (searchParameter instanceof ArtistURLNameSearch) {
            // if we only got an url page name then we have to search for the artist ID first, using getItemByPageName()
            String artistURLName = ((ArtistURLNameSearch) searchParameter).getArtistURLName();
            ItemByPageNameResult itemByPageName = grooveshark.getItemByPageName(artistURLName);
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
