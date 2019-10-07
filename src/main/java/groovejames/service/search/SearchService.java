package groovejames.service.search;

import groovejames.model.Album;
import groovejames.model.Artist;
import groovejames.model.Playlist;
import groovejames.model.SearchResult;
import groovejames.model.Song;
import groovejames.model.User;
import groovejames.service.netease.INetEaseService;
import groovejames.service.netease.NEAlbum;
import groovejames.service.netease.NEAlbumSearchResult;
import groovejames.service.netease.NEArtist;
import groovejames.service.netease.NEArtistAlbumsResultResponse;
import groovejames.service.netease.NEArtistDetailsResponse;
import groovejames.service.netease.NEArtistSearchResult;
import groovejames.service.netease.NEPlaylist;
import groovejames.service.netease.NEPlaylistDetails;
import groovejames.service.netease.NEPlaylistSearchResult;
import groovejames.service.netease.NESearchType;
import groovejames.service.netease.NESong;
import groovejames.service.netease.NESongDetails;
import groovejames.service.netease.NESongSearchResult;
import groovejames.service.netease.NESuggestionsResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class SearchService {

    private static final Logger log = LoggerFactory.getLogger(SearchService.class);

    private final INetEaseService netEaseService;

    public SearchService(INetEaseService netEaseService) {
        this.netEaseService = netEaseService;
    }

    public List<SearchParameter> getAutocomplete(String query) throws Exception {
        NESuggestionsResult suggestions = netEaseService.getSuggestions(query, 15);
        List<SearchParameter> result = new ArrayList<>();
        for (NESearchType searchType : suggestions.order) {
            switch (searchType) {
                case artists:
                    if (suggestions.artists != null) {
                        for (NEArtist artist : suggestions.artists) {
                            result.add(new ArtistSearch(artist.id, artist.name));
                        }
                    }
                    break;
                case albums:
                    if (suggestions.albums != null) {
                        for (NEAlbum album : suggestions.albums) {
                            result.add(new AlbumSearch(album.id, album.name, album.artist.name, false));
                        }
                    }
                    break;
                case songs:
                    if (suggestions.songs != null) {
                        for (NESong song : suggestions.songs) {
                            result.add(new SongSearch(song.id, song.name, false));
                        }
                    }
                    break;
            }
        }
        return result;
    }

    public SearchResult<Song> searchSongs(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        int offset = searchParameter.getOffset();
        int limit = searchParameter.getLimit();
        int total;
        Song[] result;
        String updatedSearchLabel = null;
        switch (searchType) {
            case General: {
                // search for song names via string search
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                NESongSearchResult songSearchResult = netEaseService.searchSongs(searchString, offset, limit);
                total = songSearchResult.songCount;
                if (total == 0 || songSearchResult.songs == null) {
                    result = new Song[0];
                } else {
                    result = new Song[songSearchResult.songs.length];
                    ArrayList<Long> songIDs = new ArrayList<>();
                    int i = 0;
                    for (NESong neSong : songSearchResult.songs) {
                        Song song = new Song();
                        song.setSongID(neSong.id);
                        song.setRelevance(1.0 - (((double) (searchParameter.getOffset() + i)) / (double) total));
                        songIDs.add(neSong.id);
                        result[i++] = song;
                    }
                    Map<Long, NESongDetails> songDetailsMap = netEaseService.getSongDetails(songIDs);
                    for (Song song : result) {
                        NESongDetails neSongDetails = songDetailsMap.get(song.getSongID());
                        setSongAttributes(song, neSongDetails);
                    }
                }
                break;
            }
            case Album: {
                // search for songs of the given album
                Long albumID = ((AlbumSearch) searchParameter).getAlbumID();
                NEAlbum neAlbum = netEaseService.getAlbum(albumID);
                Song[] songs = convert(neAlbum.songs, true);
                total = songs.length;
                result = songs;
                updatedSearchLabel = "Album: \"" + neAlbum.name + "\"" + (neAlbum.artist == null ? "" : " by " + neAlbum.artist.name);
                break;
            }
            case Artist: {
                // search for all songs of the given artist
                long artistID = ((ArtistSearch) searchParameter).getArtistID();
                NEArtistDetailsResponse response = netEaseService.getHotSongs(artistID);
                Song[] songs = convert(response.hotSongs, false);
                total = songs.length;
                result = songs;
                break;
            }
            case User: {
                // search for library songs of the given user
                long userID = ((UserSearch) searchParameter).getUserID();
                Song[] songs = new Song[0];
                total = 0;
                result = songs;
                break;
            }
            case Playlist: {
                // search for songs of the given playlist
                long playlistID = ((PlaylistSearch) searchParameter).getPlaylistID();
                NEPlaylistDetails nePlaylistDetails = netEaseService.getPlaylistDetails(playlistID);
                Song[] songs = convert(nePlaylistDetails.tracks, true);
                total = songs.length;
                result = songs;
                break;
            }
            case Songs: {
                // search for songs with the given song IDs
                Set<Long> songIDs = ((SongSearch) searchParameter).getSongIDs();
                Map<Long, NESongDetails> songDetails = netEaseService.getSongDetails(songIDs);
                Song[] songs = convert(songDetails.values(), false);
                total = songs.length;
                result = songs;
                break;
            }
            default: {
                throw new IllegalArgumentException("invalid search type: " + searchType);
            }
        }
        return new SearchResult<>(result, total, updatedSearchLabel);
    }

    private Song[] convert(NESongDetails[] neSongs, boolean setTrackNum) throws Exception {
        return convert(Arrays.asList(neSongs), setTrackNum);
    }

    private Song[] convert(Collection<NESongDetails> neSongs, boolean setTrackNum) throws Exception {
        Song[] songs = new Song[neSongs.size()];
        int i = 0;
        for (NESongDetails neSongDetails : neSongs) {
            Song song = new Song();
            setSongAttributes(song, neSongDetails);
            if (setTrackNum) {
                song.setTrackNum(i + 1);
                //song.setTrackNum(neSongDetails.no);
            }
            songs[i++] = song;
        }
        return songs;
    }

    private void setSongAttributes(Song song, NESongDetails neSongDetails) throws Exception {
        song.setSongID(neSongDetails.id);
        song.setSongName(neSongDetails.name);
        song.setAlbumName(neSongDetails.album.name);
        song.setAlbumID(neSongDetails.album.id);
        song.setAlbumArtistName(neSongDetails.album.artists[0].name);
        song.setArtistName(neSongDetails.artists[0].name);
        song.setArtistID(neSongDetails.artists[0].id);
        song.setImageURL(neSongDetails.album.picUrl);
        song.setPopularity(neSongDetails.popularity / 100.0);
        song.setDuration(neSongDetails.duration / 1000);
        song.setDownloadURL(neSongDetails.mp3Url);
        song.setAlternativeDownloadURL(netEaseService.determineDownloadURL1(neSongDetails));
        song.setBitrate(neSongDetails.bitrate);
    }

    public Song[] autoplayGetSongs(Iterable<Song> songsAlreadySeen) throws Exception {
        Set<Long> songIDsAlreadySeen = new HashSet<>();
        long latestSongId = -1L;
        for (Song song : songsAlreadySeen) {
            latestSongId = song.getSongID();
            songIDsAlreadySeen.add(latestSongId);
        }
        NESongDetails[] similarSongs = netEaseService.getSimilarSongs(latestSongId);
        return convert(similarSongs, false);
    }


    public SearchResult<Artist> searchArtists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Artist[] result;
        int total;
        switch (searchType) {
            case General:
                // search for artists via string search
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                NEArtistSearchResult artistSearchResult = netEaseService.searchArtists(searchString, searchParameter.getOffset(), searchParameter.getLimit());
                total = artistSearchResult.artistCount;
                if (total == 0 || artistSearchResult.artists == null) {
                    result = new Artist[0];
                } else {
                    result = new Artist[artistSearchResult.artists.length];
                    int i = 0;
                    for (NEArtist neArtist : artistSearchResult.artists) {
                        Artist artist = new Artist();
                        artist.setArtistID(neArtist.id);
                        artist.setArtistName(neArtist.name);
                        artist.setImageURL(neArtist.img1v1Url);
                        artist.setRelevance(1.0 - (((double) (searchParameter.getOffset() + i)) / (double) total));
                        result[i++] = artist;
                    }
                }
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        return new SearchResult<>(result, total);
    }

    public SearchResult<Album> searchAlbums(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        switch (searchType) {
            case General: {
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                NEAlbumSearchResult neAlbumSearchResult = netEaseService.searchAlbums(searchString, searchParameter.getOffset(), searchParameter.getLimit());
                int total = neAlbumSearchResult.albumCount;
                Album[] result = total == 0 || neAlbumSearchResult.albums == null ? new Album[0] : convert(neAlbumSearchResult.albums, searchParameter.getOffset(), total);
                return new SearchResult<>(result, total);
            }
            case Artist: {
                // search for albums of a certain artist
                long artistID = ((ArtistSearch) searchParameter).getArtistID();
                NEArtistAlbumsResultResponse response = netEaseService.getAlbums(artistID, searchParameter.getOffset(), searchParameter.getLimit());
                Album[] result = convert(response.hotAlbums, -1, -1);
                return new SearchResult<>(result, response.artist.albumSize, response.artist.name);
            }
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
    }

    private Album[] convert(NEAlbum[] neAlbums, int startOffset, int total) {
        Album[] result = new Album[neAlbums.length];
        int i = 0;
        for (NEAlbum neAlbum : neAlbums) {
            Album album = new Album();
            album.setAlbumID(neAlbum.id);
            album.setAlbumName(neAlbum.name);
            album.setArtistID(neAlbum.artist.id);
            album.setArtistName(neAlbum.artist.name);
            album.setImageURL(neAlbum.picUrl);
            album.setPublishingTime(new Date(neAlbum.publishTime));
            album.setNumSongs(neAlbum.size);
            if (total > 0) album.setRelevance(1.0 - (((double) (startOffset + i)) / (double) total));
            result[i++] = album;
        }
        return result;
    }

    public SearchResult<User> searchPeople(SearchParameter searchParameter) throws Exception {
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
        return new SearchResult<>(result, result.length);
    }

    public SearchResult<Playlist> searchPlaylists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Playlist[] result;
        int total;
        switch (searchType) {
            case General:
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                NEPlaylistSearchResult nePlaylistSearchResult = netEaseService.searchPlaylists(searchString, searchParameter.getOffset(), searchParameter.getLimit());
                if (nePlaylistSearchResult.playlistCount == 0 || nePlaylistSearchResult.playlists == null) {
                    total = 0;
                    result = new Playlist[0];
                } else {
                    total = nePlaylistSearchResult.playlistCount;
                    result = new Playlist[nePlaylistSearchResult.playlists.length];
                    int i = 0;
                    for (NEPlaylist nePlaylist : nePlaylistSearchResult.playlists) {
                        Playlist playlist = new Playlist();
                        playlist.setPlaylistID(nePlaylist.id);
                        playlist.setName(nePlaylist.name);
                        playlist.setPicture(nePlaylist.coverImgUrl);
                        playlist.setNumSongs(nePlaylist.trackCount);
                        playlist.setUserID(nePlaylist.userId);
                        playlist.setUserName(nePlaylist.creator.nickname);
                        playlist.setRelevance(1.0 - (((double) (searchParameter.getOffset() + i)) / (double) total));
                        result[i++] = playlist;
                    }
                }
                break;
            case User:
                Long userID = ((UserSearch) searchParameter).getUserID();
                total = 0;
                result = new Playlist[0];
                break;
            default:
                throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        return new SearchResult<>(result, total);
    }

    public String getDownloadURL(Song song) throws Exception {
        try {
            return netEaseService.determineDownloadURL2(song.getSongID(), song.getBitrate());
        } catch(Exception ex) {
            log.error("could not determine download url using service", ex);
            return null;
        }
    }

}
