package groovejames.service.search;

import groovejames.model.AutocompleteType;
import groovejames.model.Country;
import groovejames.model.Playlist;
import groovejames.model.SearchPlaylistsResultType;
import groovejames.model.SearchSongsResultType;
import groovejames.model.SearchUsersResultType;
import groovejames.model.Song;
import groovejames.model.Songs;
import groovejames.model.StreamKey;
import groovejames.model.User;
import groovejames.service.Grooveshark;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class SearchService {

    private final Grooveshark grooveshark;

    public SearchService(Grooveshark grooveshark) {
        this.grooveshark = grooveshark;
    }

    public List<String> getAutocomplete(String query) {
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
                result = grooveshark.getSearchResultsEx(SearchSongsResultType.Songs, searchString);
                break;
            }
            case Album: {
                // search for songs of the given album
                Long albumID = ((AlbumSearch) searchParameter).getAlbumID();
                java.util.ArrayList<Song> allSongs = new java.util.ArrayList<Song>();
                Songs songs = grooveshark.albumGetSongs(albumID, 0, true);
                allSongs.addAll(Arrays.asList(songs.getSongs()));
                boolean hasMore = true;
                int offset = 0;
                while (hasMore) {
                    songs = grooveshark.albumGetSongs(albumID, offset, false);
                    allSongs.addAll(Arrays.asList(songs.getSongs()));
                    hasMore = songs.isHasMore();
                    offset += songs.getSongs().length;
                }
                result = filterDuplicateSongs(allSongs);
                break;
            }
            case Artist: {
                // search for all songs of the given artist
                String artistID = ((ArtistSearch) searchParameter).getArtistID().toString();
                java.util.ArrayList<Song> allSongs = new java.util.ArrayList<Song>();
                Songs songs = grooveshark.artistGetSongs(artistID, 0, true);
                allSongs.addAll(Arrays.asList(songs.getSongs()));
                boolean hasMore = true;
                int offset = 0;
                while (hasMore) {
                    songs = grooveshark.artistGetSongs(artistID, offset, false);
                    allSongs.addAll(Arrays.asList(songs.getSongs()));
                    hasMore = songs.isHasMore();
                    offset += songs.getSongs().length;
                }
                result = filterDuplicateSongs(allSongs);
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
                result = filterDuplicateSongs(allSongs);
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
        return grooveshark.getStreamKeyFromSongIDEx(songID, /*mobile*/ false, /*prefetch*/ false, Country.GSLITE_DEFAULT_COUNTRY);
    }

    public Song[] searchArtists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Song[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = normalizeScoreAndPopularity(grooveshark.getSearchResultsEx(SearchSongsResultType.Artists, searchString));
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        return result;
    }

    public Song[] searchAlbums(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Song[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = normalizeScoreAndPopularity(grooveshark.getSearchResultsEx(SearchSongsResultType.Albums, searchString));
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        return result;
    }

    public User[] searchPeople(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        User[] result;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                result = normalizeScore(grooveshark.getSearchResultsEx(SearchUsersResultType.Users, searchString));
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

    private Song[] filterDuplicateSongs(java.util.ArrayList<Song> allSongs) {
        HashSet<Long> allSongsIds = new HashSet<Long>();
        ArrayList<Song> resultList = new ArrayList<Song>(allSongs.size());
        for (Song song : allSongs) {
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


