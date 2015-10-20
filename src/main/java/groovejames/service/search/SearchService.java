package groovejames.service.search;

import groovejames.model.Album;
import groovejames.model.Artist;
import groovejames.model.Playlist;
import groovejames.model.SearchResult;
import groovejames.model.Song;
import groovejames.model.StreamInfo;
import groovejames.model.User;
import groovejames.service.netease.INetEaseService;
import groovejames.service.netease.NEAlbum;
import groovejames.service.netease.NEAlbumSearchResult;
import groovejames.service.netease.NEArtist;
import groovejames.service.netease.NEArtistAlbumsResultResponse;
import groovejames.service.netease.NEArtistDetailsResponse;
import groovejames.service.netease.NEArtistSearchResult;
import groovejames.service.netease.NEPlaylist;
import groovejames.service.netease.NEPlaylistSearchResult;
import groovejames.service.netease.NESong;
import groovejames.service.netease.NESongDetails;
import groovejames.service.netease.NESongSearchResult;
import groovejames.util.Util;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public class SearchService {

    private static final Log log = LogFactory.getLog(SearchService.class);

    private final INetEaseService netEaseService;

    public SearchService(INetEaseService netEaseService) {
        this.netEaseService = netEaseService;
    }

    public List<String> getAutocomplete(String query) throws Exception {
        return Collections.emptyList();
    }

    public StreamInfo getStreamInfo(long songID) throws Exception {
        NESongDetails songDetails = netEaseService.getSongDetails(new long[] {songID}).get(songID);
        String downloadUrl = netEaseService.getDownloadUrl(songDetails);
        String imageURL = songDetails.album.picUrl;
        return new StreamInfo(downloadUrl, songDetails.duration, imageURL);
    }

    public SearchResult<Song> searchSongs(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        int offset = searchParameter.getOffset();
        int limit = searchParameter.getLimit();
        int total;
        Song[] result;
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
                    long[] songIDs = new long[songSearchResult.songs.length];
                    int i = 0;
                    for (NESong neSong : songSearchResult.songs) {
                        Song song = new Song();
                        song.setSongID(neSong.id);
                        song.setRelevance(1.0 - (((double) (searchParameter.getOffset() + i)) / (double) total));
                        result[i] = song;
                        songIDs[i] = neSong.id;
                        i++;
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
                Song[] songs = new Song[neAlbum.songs.length];
                int i = 0;
                for (NESongDetails neSongDetails : neAlbum.songs) {
                    Song song = new Song();
                    setSongAttributes(song, neSongDetails);
                    song.setTrackNum(neSongDetails.no);
                    songs[i++] = song;
                }
                total = songs.length;
                result = songs;
                break;
            }
            case Artist: {
                // search for all songs of the given artist
                long artistID = ((ArtistSearch) searchParameter).getArtistID();
                NEArtistDetailsResponse response = netEaseService.getHotSongs(artistID);
                Song[] songs = new Song[response.hotSongs.length];
                int i = 0;
                for (NESongDetails neSongDetails : response.hotSongs) {
                    Song song = new Song();
                    setSongAttributes(song, neSongDetails);
                    songs[i++] = song;
                }
                total = songs.length;
                result = songs;
                break;
            }
            case User: {
                // search for library songs of the given user
                String userID = ((UserSearch) searchParameter).getUserID().toString();
                Song[] songs = new Song[0];
                total = 0;
                result = songs;
                break;
            }
            case Playlist: {
                Long playlistID = ((PlaylistSearch) searchParameter).getPlaylistID();
                Song[] songs = new Song[0];
                total = 0;
                result = songs;
                break;
            }
            case Songs: {
                Set<Long> songIDs = ((SongSearch) searchParameter).getSongIDs();
                long[] songIDArray = Util.convert(songIDs);
                Map<Long, NESongDetails> songDetails = netEaseService.getSongDetails(songIDArray);
                Song[] songs = new Song[songDetails.size()];
                int i = 0;
                for (NESongDetails neSongDetails : songDetails.values()) {
                    Song song = new Song();
                    setSongAttributes(song, neSongDetails);
                    songs[i++] = song;
                }
                total = songs.length;
                result = songs;
                break;
            }
            default: {
                throw new IllegalArgumentException("invalid search type: " + searchType);
            }
        }
        return new SearchResult<>(result, total);
    }

    private void setSongAttributes(Song song, NESongDetails neSongDetails) {
        song.setSongID(neSongDetails.id);
        song.setSongName(neSongDetails.name);
        song.setAlbumName(neSongDetails.album.name);
        song.setAlbumID(neSongDetails.album.id);
        song.setArtistName(neSongDetails.artists[0].name);
        song.setArtistID(neSongDetails.artists[0].id);
        //song.setImageURL(neSongDetails.artists[0].img1v1Url);
        song.setImageURL(neSongDetails.album.picUrl);
        song.setPopularity(neSongDetails.popularity / 100.0);
        song.setDuration(neSongDetails.duration / 1000);
    }

    public Song autoplayGetSong(Iterable<Song> songsAlreadySeen) throws Exception {
        /*
       {"header":{"privacy":0,"country":{"DMA":807,"CC1":0,"ID":223,"CC2":0,"IPR":0,"CC4":1073741824,"CC3":0},"session":"d9c5aaa75a9a11ea52adf8e242938b72","token":"727e15ab9ccf8f098ba6a5047987d451796bf3255dedea","uuid":"2FBE082B-BF60-4E23-9EBC-7CC77CEB5AE0","client":"jsqueue","clientRevision":"20120830"},"parameters":{"songIDsAlreadySeen":[35501],"recentArtists":[822],"minDuration":60,"seedArtistWeightRange":[70,100],"country":{"DMA":807,"CC1":0,"ID":223,"CC2":0,"IPR":0,"CC4":1073741824,"CC3":0},"secondaryArtistWeightModifier":0.9,"weightModifierRange":[-9,9],"seedArtists":{"822":"p"},"songQueueID":"1346948642359","frowns":[],"maxDuration":1500},"method":"autoplayGetSong"}
        */
        ArrayList<Long> songIDsAlreadySeen = new ArrayList<>();
        TreeSet<Long> recentArtistIDs = new TreeSet<>();
        for (Song song : songsAlreadySeen) {
            songIDsAlreadySeen.add(song.getSongID());
            recentArtistIDs.add(song.getArtistID());
        }
        Map<String, String> seedArtists = new HashMap<>();
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
                Long artistID = ((ArtistSearch) searchParameter).getArtistID();
                NEArtistAlbumsResultResponse response = netEaseService.getAlbums(artistID, searchParameter.getOffset(), searchParameter.getLimit());
                Album[] result = convert(response.hotAlbums, -1, -1);
                return new SearchResult<>(result, response.more);
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

}
