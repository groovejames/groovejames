package groovejames.service.search;

import groovejames.model.Album;
import groovejames.model.Artist;
import groovejames.model.Playlist;
import groovejames.model.SearchResult;
import groovejames.model.Song;
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
import groovejames.service.netease.NetEaseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
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
        int total;
        Song[] result;
        String updatedSearchLabel = null;
        switch (searchType) {
            case General: {
                // search for song names via string search
                int offset = searchParameter.getOffset();
                int limit = searchParameter.getLimit();
                int searchTotal = searchParameter.getTotal(); // -1 on first call, but when offset > 0 contains total of latest call
                if (offset > 0 && searchTotal > offset && offset + limit > searchTotal) {
                    limit = searchTotal - offset;
                }
                String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                NESongSearchResult songSearchResult = netEaseService.searchSongs(searchString, offset, limit);
                total = offset == 0 || searchTotal <= 0 ? songSearchResult.songCount : searchTotal;
                if (total == 0 || songSearchResult.songs == null || songSearchResult.songs.length == 0) {
                    result = new Song[0];
                } else {
                    ArrayList<Long> songIDs = new ArrayList<>();
                    for (NESong neSong : songSearchResult.songs) {
                        songIDs.add(neSong.id);
                    }
                    NESongDetails[] songDetails = netEaseService.getSongDetails(songIDs);
                    result = convert(songDetails, false);
                    for (int i = 0; i < result.length; i++) {
                        Song song = result[i];
                        song.setRelevance(1.0 - (((double) (searchParameter.getOffset() + i)) / (double) total));
                    }
                }
                break;
            }
            case Album: {
                // search for songs of the given album
                long albumID = ((AlbumSearch) searchParameter).getAlbumID();
                NEAlbum neAlbum = netEaseService.getAlbum(albumID);
                result = convert(neAlbum.songs, true);
                total = result.length;
                updatedSearchLabel = "Album: \"" + neAlbum.name + "\"" + (neAlbum.artist == null ? "" : " by " + neAlbum.artist.name);
                break;
            }
            case Artist: {
                // search for all songs of the given artist
                long artistID = ((ArtistSearch) searchParameter).getArtistID();
                NEArtistDetailsResponse response = netEaseService.getHotSongs(artistID);
                result = convert(response.hotSongs, false);
                total = result.length;
                break;
            }
            case Playlist: {
                // search for songs of the given playlist
                long playlistID = ((PlaylistSearch) searchParameter).getPlaylistID();
                NEPlaylistDetails nePlaylistDetails = netEaseService.getPlaylistDetails(playlistID);
                result = convert(nePlaylistDetails.tracks, true);
                total = result.length;
                break;
            }
            case Songs: {
                // search for songs with the given song IDs
                List<Long> songIDs = ((SongSearch) searchParameter).getSongIDs();
                NESongDetails[] songDetails = netEaseService.getSongDetails(songIDs);
                result = convert(songDetails, false);
                total = result.length;
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
        // TODO: instead of fencing between 0.0 and 100.0 it would be better to normalize it between real min and max
        //   but for this to work correctly you'd have to normalize over _all_ fetched songs after each fetch
        song.setPopularity(Math.min(Math.max(neSongDetails.popularity, 0.0), 100.0) / 100.0);
        song.setDuration(neSongDetails.duration / 1000);
        song.setDownloadURL(neSongDetails.mp3Url);
        song.setAlternativeDownloadURL(netEaseService.determineAlternativeDownloadURL(neSongDetails));
        song.setBitrate(neSongDetails.bitrate);
    }

    public Song[] autoplayGetSongs(Iterable<Song> songsAlreadySeen) throws Exception {
        Set<Long> songIDsAlreadySeen = new HashSet<>();
        long latestSongId = -1L;
        for (Song song : songsAlreadySeen) {
            latestSongId = song.getSongID();
            songIDsAlreadySeen.add(latestSongId);
        }
        ArrayList<NESongDetails> freeSongsNotSeenYet = new ArrayList<>();
        NESongDetails[] similarSongs = netEaseService.getSimilarSongs(latestSongId);
        for (NESongDetails similarSong : similarSongs) {
            if (similarSong.fee != 1 && !songIDsAlreadySeen.contains(similarSong.id)) {
                freeSongsNotSeenYet.add(similarSong);
            }
        }
        if (freeSongsNotSeenYet.isEmpty()) {
            return new Song[0];
        } else {
            return convert(freeSongsNotSeenYet, false);
        }
    }


    public SearchResult<Artist> searchArtists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Artist[] result;
        int total;
        if (searchType == SearchType.General) {
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
        } else {
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
                int albumCount = neAlbumSearchResult.albumCount;
                Album[] result = albumCount == 0 || neAlbumSearchResult.albums == null ? new Album[0] : convert(neAlbumSearchResult.albums, searchParameter.getOffset(), albumCount);
                // update total when result is suddenly null (this happens)
                int total = neAlbumSearchResult.albums == null && searchParameter.getOffset() > 0 ? searchParameter.getOffset() + searchParameter.getLimit() : albumCount;
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

    public SearchResult<Playlist> searchPlaylists(SearchParameter searchParameter) throws Exception {
        SearchType searchType = searchParameter.getSearchType();
        Playlist[] result;
        int total;
        if (searchType == SearchType.General) {
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
        } else {
            throw new IllegalArgumentException("invalid search type: " + searchType);
        }
        return new SearchResult<>(result, total);
    }

    public String getDownloadURL(Song song) throws Exception {
        try {
            return netEaseService.determineDownloadURL(song.getSongID(), song.getBitrate());
        } catch (NetEaseException ex) {
            log.error("could not determine download url using service", ex);
            return null;
        }
    }

}
