(function (c) {
    GS.Models.Base.extend("GS.Models.FeedEvent", {id:"eventID", cache:{}, ListenTypes:{}, PlaylistTypes:{}, SongTypes:{}, AlbumTypes:{}, ArtistTypes:{}, init:function () {
        GS.Models.FeedEvent.setTypes();
        c.subscribe("gs.locale.ready", this.callback(this.updateDaysOfWeek));
        c.subscribe("gs.locale.update", this.callback(this.updateDaysOfWeek));
        this.updateDaysOfWeek()
    }, setTypes:function () {
        var a = {};
        a.songPlayed = true;
        a.obsession = true;
        a.playlistPlayed = true;
        a.artistPlayed = true;
        a.albumPlayed = true;
        a.broadcast = true;
        var b = {};
        b.songPlayed = true;
        b.obsession = true;
        b.playlistPlayed = true;
        b.artistPlayed = true;
        b.albumPlayed = true;
        var d = {};
        d.playlistPlayed = true;
        var f = {};
        f.albumPlayed = true;
        var g = {};
        g.artistPlayed = true;
        GS.Models.FeedEvent.ListenTypes = a;
        GS.Models.FeedEvent.SongTypes = b;
        GS.Models.FeedEvent.PlaylistTypes = d;
        GS.Models.FeedEvent.AlbumTypes = f;
        GS.Models.FeedEvent.ArtistTypes = g
    }, songPlayed:function (a) {
        var b = {};
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.song = ['<a class="songLink" href="', _.cleanUrl(a.data.songs[0].songName,
                a.data.songs[0].songID, "song"), '">', _.cleanText(a.data.songs[0].songName), "</a>"].join("");
        b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
        b.album = ['<a href="', _.cleanUrl(a.data.songs[0].albumName, a.data.songs[0].albumID, "album"), '">', _.cleanText(a.data.songs[0].albumName), "</a>"].join("");
        b.numSongs = a.data.songs.length;
        if (b.numSongs > 2) {
            a.dataKey = "FEED_LISTEN_SONGS_MANY";
            b.numSongs--
        } else if (b.numSongs ==
                2) {
            b.song2 = ['<a class="songLink" data-song-index="1">', _.cleanText(a.data.songs[1].songName), "</a>"].join("");
            a.dataKey = "FEED_LISTEN_SONGS_TWO"
        } else a.dataKey = "FEED_LISTEN_SONG";
        return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
    }, favoriteSong:function (a) {
        var b = {};
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.song = ['<a class="songLink" href="', _.cleanUrl(a.data.songs[0].songName, a.data.songs[0].songID, "song"), '">', _.cleanText(a.data.songs[0].songName), "</a>"].join("");
        b.artist = ['<a href="',
            _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
        b.album = ['<a href="', _.cleanUrl(a.data.songs[0].albumName, a.data.songs[0].albumID, "album"), '">', _.cleanText(a.data.songs[0].albumName), "</a>"].join("");
        b.numSongs = a.data.songs.length;
        if (b.numSongs > 2) {
            a.dataKey = "FEED_FAVORITE_SONGS_MANY";
            b.numSongs--
        } else if (b.numSongs == 2) {
            b.song2 = ['<a class="songLink" data-song-index="1">', _.cleanText(a.data.songs[1].songName), "</a>"].join("");
            a.dataKey = "FEED_FAVORITE_SONGS_TWO"
        } else a.dataKey = "FEED_FAVORITE_SONG";
        return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
    }, obsession:function (a) {
        var b = {};
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.song = ['<a class="songLink" href="', _.cleanUrl(a.data.songs[0].songName, a.data.songs[0].songID, "song"), '">', _.cleanText(a.data.songs[0].songName), "</a>"].join("");
        b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName),
            "</a>"].join("");
        b.album = ['<a href="', _.cleanUrl(a.data.songs[0].albumName, a.data.songs[0].albumID, "album"), '">', _.cleanText(a.data.songs[0].albumName), "</a>"].join("");
        b.numSongs = a.data.songs.length;
        if (b.numSongs > 2) {
            a.dataKey = "FEED_SONG_OBSESSION_MANY";
            b.numSongs--
        } else if (b.numSongs == 2) {
            b.song2 = ['<a class="songLink" data-song-index="1">', _.cleanText(a.data.songs[1].songName), "</a>"].join("");
            a.dataKey = "FEED_SONG_OBSESSION_TWO"
        } else a.dataKey = a.data.songs[0].timestamp.length >= 11 ? "FEED_SONG_OBSESSION_COWBELL" :
                a.data.songs[0].timestamp.length >= 7 ? "FEED_SONG_OBSESSION_BLEEDING" : a.data.songs[0].timestamp.length >= 5 ? "FEED_SONG_OBSESSION_ADDICT" : "FEED_SONG_OBSESSION";
        return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
    }, addSongsToLibrary:function (a) {
        var b = {};
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.song = ['<a class="songLink" href="', _.cleanUrl(a.data.songs[0].songName, a.data.songs[0].songID, "song"), '">', _.cleanText(a.data.songs[0].songName), "</a>"].join("");
        b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName,
                a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
        b.album = ['<a href="', _.cleanUrl(a.data.songs[0].albumName, a.data.songs[0].albumID, "album"), '">', _.cleanText(a.data.songs[0].albumName), "</a>"].join("");
        b.numSongs = a.data.songs.length;
        if (b.numSongs > 2) {
            a.dataKey = "FEED_ADD_LIBRARY_SONGS_MANY";
            b.numSongs--
        } else if (b.numSongs == 2) {
            b.song2 = ['<a class="songLink" data-song-index="1">', _.cleanText(a.data.songs[1].songName), "</a>"].join("");
            a.dataKey = a.user.Sex ==
                    "M" ? "FEED_ADD_LIBRARY_SONGS_TWO_MALE" : a.user.Sex == "F" ? "FEED_ADD_LIBRARY_SONGS_TWO_FEMALE" : "FEED_ADD_LIBRARY_SONGS_TWO_ALIEN"
        } else a.dataKey = a.user.Sex == "M" ? "FEED_ADD_LIBRARY_SONG_MALE" : a.user.Sex == "F" ? "FEED_ADD_LIBRARY_SONG_FEMALE" : "FEED_ADD_LIBRARY_SONG_ALIEN";
        return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
    }, createPlaylist:function (a) {
        var b = {};
        a.data.playlists[0].owningName = a.user.Name;
        a.data.playlists[0].owningID = a.user.UserID;
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.playlist =
                ['<a href="', _.cleanUrl(a.data.playlists[0].playlistName, a.data.playlists[0].playlistID, "playlist"), '">', _.cleanText(a.data.playlists[0].playlistName), "</a>"].join("");
        b.numSongs = _.isArray(a.data.songIDs) ? a.data.songIDs.length : 0;
        a.dataKey = b.numSongs && b.numSongs > 1 ? "FEED_PLAYLIST_CREATED" : "FEED_PLAYLIST_CREATED_NO_SONGS";
        return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
    }, overwritePlaylist:function (a) {
        var b = {};
        a.data.playlists[0].owningName = a.user.Name;
        a.data.playlists[0].owningID = a.user.UserID;
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.playlist = ['<a href="', _.cleanUrl(a.data.playlists[0].playlistName, a.data.playlists[0].playlistID, "playlist"), '">', _.cleanText(a.data.playlists[0].playlistName), "</a>"].join("");
        b.numSongs = _.isArray(a.data.songIDs) ? a.data.songIDs.length : 0;
        a.dataKey = b.numSongs && b.numSongs > 1 ? "FEED_PLAYLIST_EDITED" : "FEED_PLAYLIST_EDITED_NO_SONGS";
        return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
    }, subscribePlaylist:function (a) {
        var b = {}, d = a.data.playlists[0].owningName,
                f = a.data.playlists[0].subscribingName;
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.playlist = ['<a href="', _.cleanUrl(a.data.playlists[0].playlistName, a.data.playlists[0].playlistID, "playlist"), '">', _.cleanText(a.data.playlists[0].playlistName), "</a>"].join("");
        b.author = ['<a href="', _.cleanUrl(d, a.data.playlists[0].owningUserID, "user"), '">', d, "</a>"].join("");
        b.fan = ['<a href="', _.cleanUrl(f, a.userID, "user"), '">', f, "</a>"].join("");
        a.dataKey = "FEED_PLAYLIST_FOLLOWED";
        return new GS.Models.DataString(c.localize.getString(a.dataKey),
                b)
    }, playlistPlayed:function (a) {
        var b = {};
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.playlist = ['<a href="', _.cleanUrl(a.data.playlists[0].playlistName, a.data.playlists[0].playlistID, "playlist"), '">', _.cleanText(a.data.playlists[0].playlistName), "</a>"].join("");
        a.dataKey = "FEED_LISTEN_PLAYLIST";
        return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
    }, playlistAddCollaborator:function (a) {
        var b = {};
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.playlist = ['<a href="', _.cleanUrl(a.data.playlists[0].name,
                a.data.playlists[0].playlistID, "playlist"), '">', _.cleanText(a.data.playlists[0].name), "</a>"].join("");
        a.dataKey = "FEED_ADD_COLLABORATOR_PLAYLIST";
        return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
    }, favoriteArtist:function (a) {
        var b = {};
        b.user = GS.Models.FeedEvent.getUserLink(a.user);
        b.artist = ['<a href="', _.cleanUrl(a.data.artists[0].artistName, a.data.artists[0].artistID, "artist"), '">', _.cleanText(a.data.artists[0].artistName), "</a>"].join("");
        b.numArtists = a.data.artists.length;
        if (b.numArtists >
                2) {
            a.dataKey = "FEED_FAVORITE_ARTIST_MANY";
            b.artist2 = ['<a href="', _.cleanUrl(a.data.artists[1].artistName, a.data.artists[1].artistID, "artist"), '">', _.cleanText(a.data.artists[1].artistName), "</a>"].join("");
            b.numArtists -= 2
        } else if (b.numArtists == 2) {
            a.dataKey = "FEED_FAVORITE_ARTIST_TWO";
            b.artist2 = ['<a href="', _.cleanUrl(a.data.artists[1].artistName, a.data.artists[1].artistID, "artist"), '">', _.cleanText(a.data.artists[1].artistName), "</a>"].join("")
        } else a.dataKey = "FEED_FAVORITE_ARTIST_ONE";
        return null
    },
        addArtistToLibrary:function (a) {
            var b = {};
            b.user = GS.Models.FeedEvent.getUserLink(a.user);
            b.numSongs = a.data.songs.length - 1;
            b.song = ['<a class="songLink" href="', _.cleanUrl(a.data.songs[0].songName, a.data.songs[0].songID, "song"), '">', _.cleanText(a.data.songs[0].songName), "</a>"].join("");
            b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
            a.dataKey = "FEED_ADD_LIBRARY_ARTIST";
            return new GS.Models.DataString(c.localize.getString(a.dataKey),
                    b)
        }, artistPlayed:function (a) {
            var b = {};
            b.user = GS.Models.FeedEvent.getUserLink(a.user);
            b.numSongs = a.data.songs.length;
            b.song = ['<a class="songLink" href="', _.cleanUrl(a.data.songs[0].songName, a.data.songs[0].songID, "song"), '">', _.cleanText(a.data.songs[0].songName), "</a>"].join("");
            b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
            a.dataKey = "FEED_LISTEN_ARTIST";
            return new GS.Models.DataString(c.localize.getString(a.dataKey),
                    b)
        }, albumPlayed:function (a) {
            var b = {};
            b.user = GS.Models.FeedEvent.getUserLink(a.user);
            b.numSongs = a.data.songs.length;
            b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
            b.album = ['<a href="', _.cleanUrl(a.data.songs[0].albumName, a.data.songs[0].albumID, "album"), '">', _.cleanText(a.data.songs[0].albumName), "</a>"].join("");
            a.dataKey = "FEED_LISTEN_ALBUM";
            return new GS.Models.DataString(c.localize.getString(a.dataKey),
                    b)
        }, addAlbumToLibrary:function (a) {
            var b = {};
            b.user = GS.Models.FeedEvent.getUserLink(a.user);
            b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
            b.album = ['<a href="', _.cleanUrl(a.data.songs[0].albumName, a.data.songs[0].albumID, "album"), '">', _.cleanText(a.data.songs[0].albumName), "</a>"].join("");
            b.numSongs = a.data.songs.length;
            a.dataKey = "FEED_ADD_LIBRARY_ALBUM";
            return new GS.Models.DataString(c.localize.getString(a.dataKey),
                    b)
        }, favoriteUser:function (a) {
            var b = {};
            b.user = GS.Models.FeedEvent.getUserLink(a.user);
            b.followed = ['<a href="', a.getUrlByType("user", 0), '">', a.getMetaByType("user", 0), "</a>"].join("");
            b.numUsers = a.data.users.length;
            if (b.numUsers > 2) {
                a.dataKey = "FEED_FAVORITE_USER_MANY";
                b.numUsers--
            } else if (b.numUsers == 2) {
                a.dataKey = "FEED_FAVORITE_USER_TWO";
                b.followed2 = ['<a href="', a.getUrlByType("user", 1), '">', a.getMetaByType("user", 1), "</a>"].join("")
            } else a.dataKey = "FEED_FAVORITE_USER_ONE";
            console.warn(a.dataKey, b);
            return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
        }, share:function (a) {
            var b = {};
            if (a.data.playlists) {
                var d = a.data.playlists[0].owningName, f = a.data.playlists[0].subscribingName;
                b.user = GS.Models.FeedEvent.getUserLink(a.user);
                b.playlist = ['<a href="', _.cleanUrl(a.data.playlists[0].playlistName, a.data.playlists[0].playlistID, "playlist"), '">', _.cleanText(a.data.playlists[0].playlistName), "</a>"].join("");
                b.author = ['<a href="', _.cleanUrl(d, a.data.playlists[0].userID, "user"), '">', d, "</a>"].join("");
                b.fan = ['<a href="', _.cleanUrl(f, a.userID, "user"), '">', f, "</a>"].join("");
                a.dataKey = "FEED_SHARE_PLAYLIST"
            } else {
                b.user = GS.Models.FeedEvent.getUserLink(a.user);
                b.song = ['<a class="songLink" href="', _.cleanUrl(a.data.songs[0].songName, a.data.songs[0].songID, "song"), '">', _.cleanText(a.data.songs[0].songName), "</a>"].join("");
                b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
                b.album = ['<a href="', _.cleanUrl(a.data.songs[0].albumName,
                        a.data.songs[0].albumID, "album"), '">', _.cleanText(a.data.songs[0].albumName), "</a>"].join("");
                b.numSongs = a.data.songs.length;
                if (b.numSongs > 2) {
                    a.dataKey = "FEED_SHARE_SONGS_MANY";
                    b.numSongs--
                } else if (b.numSongs == 2) {
                    b.song2 = ['<a class="songLink" data-song-index="1">', _.cleanText(a.data.songs[1].songName), "</a>"].join("");
                    a.dataKey = "FEED_SHARE_SONGS_TWO"
                } else a.dataKey = "FEED_SHARE_SONG"
            }
            return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
        }, broadcast:function (a) {
            var b = {}, d, f = false, g = a.people ?
                    a.people.length : 0;
            b.user = GS.Models.FeedEvent.getUserLink(a.user);
            for (d = 0; d < g; d++)if (a.people[d].userID == GS.user.UserID) {
                f = true;
                break
            }
            if (a.data.playlists) {
                b.playlist = ['<a href="', _.cleanUrl(a.data.playlists[0].playlistName, a.data.playlists[0].playlistID, "playlist"), '">', _.cleanText(a.data.playlists[0].playlistName), "</a>"].join("");
                if (a.people && a.people.length)if (a.people.length > 2) {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    b.numUsers =
                            a.people.length - 1;
                    a.dataKey = f ? "FEED_BROADCAST_PLAYLIST_MANY_USERS_AND_YOU" : "FEED_BROADCAST_PLAYLIST_MANY_USERS"
                } else if (a.people.length == 2) {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    b.person2 = ['<a href="', a.getUrlByType("taggedUser", 1), '">', a.getMetaByType("taggedUser", 1), "</a>"].join("");
                    a.dataKey = "FEED_BROADCAST_PLAYLIST_TWO_USERS"
                } else {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    a.dataKey = "FEED_BROADCAST_PLAYLIST_ONE_USER"
                } else a.dataKey = "FEED_BROADCAST_PLAYLIST_NO_USERS"
            } else if (a.data.songs) {
                GS.Models.Song.wrap(a.data.songs[0]);
                b.song = ['<a class="songLink" data-songid="', a.data.songs[0].songID, '">', _.cleanText(a.data.songs[0].songName), "</a>"].join("");
                b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
                b.album = ['<a href="', _.cleanUrl(a.data.songs[0].albumName, a.data.songs[0].albumID,
                        "album"), '">', _.cleanText(a.data.songs[0].albumName), "</a>"].join("");
                if (a.people && a.people.length)if (a.people.length > 2) {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    b.numUsers = a.people.length - 1;
                    a.dataKey = f ? "FEED_BROADCAST_SONG_MANY_USERS_AND_YOU" : "FEED_BROADCAST_SONG_MANY_USERS"
                } else if (a.people.length == 2) {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    b.person2 = ['<a href="',
                        a.getUrlByType("taggedUser", 1), '">', a.getMetaByType("taggedUser", 1), "</a>"].join("");
                    a.dataKey = "FEED_BROADCAST_SONG_TWO_USERS"
                } else {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    a.dataKey = "FEED_BROADCAST_SONG_ONE_USER"
                } else a.dataKey = "FEED_BROADCAST_SONG_NO_USERS"
            } else if (a.data.artists) {
                b.artist = ['<a href="', _.cleanUrl(a.data.artists[0].artistName, a.data.artists[0].artistID, "artist"), '">', _.cleanText(a.data.artists[0].artistName), "</a>"].join("");
                if (a.people && a.people.length)if (a.people.length > 2) {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    b.numUsers = a.people.length - 1;
                    a.dataKey = f ? "FEED_BROADCAST_ARTIST_MANY_USERS_AND_YOU" : "FEED_BROADCAST_ARTIST_MANY_USERS"
                } else if (a.people.length == 2) {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    b.person2 = ['<a href="', a.getUrlByType("taggedUser", 1), '">', a.getMetaByType("taggedUser", 1),
                        "</a>"].join("");
                    a.dataKey = "FEED_BROADCAST_ARTIST_TWO_USERS"
                } else {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    a.dataKey = "FEED_BROADCAST_ARTIST_ONE_USER"
                } else a.dataKey = "FEED_BROADCAST_ARTIST_NO_USERS"
            } else if (a.data.albums) {
                b.artist = ['<a href="', _.cleanUrl(a.data.albums[0].artistName, a.data.albums[0].artistID, "artist"), '">', _.cleanText(a.data.albums[0].artistName), "</a>"].join("");
                b.album = ['<a href="', _.cleanUrl(a.data.albums[0].albumName,
                        a.data.albums[0].albumID, "album"), '">', _.cleanText(a.data.albums[0].albumName), "</a>"].join("");
                if (a.people && a.people.length)if (a.people.length > 2) {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    b.numUsers = a.people.length - 1;
                    a.dataKey = f ? "FEED_BROADCAST_ALBUM_MANY_USERS_AND_YOU" : "FEED_BROADCAST_ALBUM_MANY_USERS"
                } else if (a.people.length == 2) {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    b.person2 = ['<a href="', a.getUrlByType("taggedUser", 1), '">', a.getMetaByType("taggedUser", 1), "</a>"].join("");
                    a.dataKey = "FEED_BROADCAST_ALBUM_TWO_USERS"
                } else {
                    b.person = ['<a href="', a.getUrlByType("taggedUser", 0), '">', a.getMetaByType("taggedUser", 0), "</a>"].join("");
                    a.dataKey = "FEED_BROADCAST_ALBUM_ONE_USER"
                } else a.dataKey = "FEED_BROADCAST_ALBUM_NO_USERS"
            }
            return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
        }, usersAddArtistToLibrary:function (a) {
            var b = {};
            b.user = GS.Models.FeedEvent.getUserLink(a.user);
            b.artist = ['<a href="', _.cleanUrl(a.data.songs[0].artistName, a.data.songs[0].artistID, "artist"), '">', _.cleanText(a.data.songs[0].artistName), "</a>"].join("");
            a.dataKey = a.user.Sex == "M" ? "FEED_USERS_ADD_LIBRARY_ARTIST_MALE" : a.user.Sex == "F" ? "FEED_USERS_ADD_LIBRARY_ARTIST_FEMALE" : "FEED_USERS_ADD_LIBRARY_ARTIST_ALIEN";
            return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
        }, usersAddAlbumToLibrary:function (a) {
            var b = {};
            b.user = GS.Models.FeedEvent.getUserLink(a.user);
            b.artist = ['<a href="', _.cleanUrl(a.data.albums[0].artistName,
                    a.data.albums[0].artistID, "artist"), '">', _.cleanText(a.data.albums[0].artistName), "</a>"].join("");
            b.album = ['<a href="', _.cleanUrl(a.data.albums[0].albumName, a.data.albums[0].albumID, "album"), '">', _.cleanText(a.data.albums[0].albumName), "</a>"].join("");
            b.numAlbums = a.data.albums.length;
            a.dataKey = a.user.Sex == "M" ? "FEED_USERS_ADD_LIBRARY_ALBUM_MALE" : a.user.Sex == "F" ? "FEED_USERS_ADD_LIBRARY_ALBUM_FEMALE" : "FEED_USERS_ADD_LIBRARY_ALBUM_ALIEN";
            return new GS.Models.DataString(c.localize.getString(a.dataKey),
                    b)
        }, comments:function (a) {
            var b = {}, d = GS.Models.User.getOneFromCache(a.userID);
            b.user = GS.Models.FeedEvent.getUserLink(a.user);
            b.event = '<a href="' + d.toUrl("event/" + a.eventID) + '">event</a>';
            a.dataKey = "FEED_USER_COMMENT_NOTICE";
            return new GS.Models.DataString(c.localize.getString(a.dataKey), b)
        }, generic:function (a) {
            var b;
            if (a.genericType == 1)b = GS.Models.FeedEvent.playlistAddCollaborator(a);
            return b
        }, getUserLink:function (a) {
            return['<a href="', a.toUrl(), '">', a.Name.length ? a.Name : a.FName, "</a>"].join("")
        },
        wrapUsers:function (a) {
            for (var b = [], d, f = 0; f < a.length; f++) {
                d = a[f];
                b.push(GS.Models.User.wrap({UserID:d.userID, displayName:d.displayName, Picture:d.userPicture}))
            }
            return b
        }, updateDaysOfWeek:function () {
            var a = c.localize.getString("WEEK_DAYS");
            if (a && a.length)this.daysOfWeek = a.split(",")
        }, getEvent:function (a, b, d) {
            var f = this.getOneFromCache(a);
            if (f)c.isFunction(b) && b(f); else GS.service.getUserFeedEvent(a, this.callback(["wrap", b]), d)
        }}, {eventID:null, activityName:null, activity:0, data:null, timestamp:null, userID:0,
        user:null, date:null, data:null, dataString:null, dataKey:null, users:null, validate:function () {
            return event.userID && event.data
        }, init:function (a) {
            this._super(a);
            if (_.defined(a.userIDFrom)) {
                this.user = GS.Models.User.getOneFromCache(a.userIDFrom);
                if (!this.user && a.displayName)this.user = GS.Models.User.wrap({UserID:a.userIDFrom, displayName:a.displayName, Picture:a.userPicture}, false); else if (!this.user)throw"no_user";
            } else this.user = GS.Models.User.getOneFromCache(a.userID);
            if (!this.user && a.userID && a.userID == GS.user.UserID)this.user =
                    GS.user; else if (!this.user && a.data.users && a.data.users.length) {
                this.users = GS.Models.FeedEvent.wrapUsers(a.data.users);
                this.user = this.users[0]
            } else if (!this.user && a.displayName)this.user = GS.Models.User.wrap({UserID:a.userID, displayName:a.displayName, Picture:a.userPicture}, false);
            this.date = new Date(a.timestamp * 1E3);
            this.dataString = GS.Models.FeedEvent[a.activityName] ? GS.Models.FeedEvent[a.activityName](this) : null;
            if (!this.dataString || !this.user)throw"no_dataString";
        }, toHTML:function () {
            return this.dataString ?
                    this.dataString.render() : ""
        }, playSongs:function (a, b) {
            b = _.orEqual(b, false);
            if (this.data.songs && this.data.songs.length) {
                var d = [], f = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_FEED, this);
                GS.Models.Song.wrapCollection(this.data.songs);
                for (var g in this.data.songs)this.data.songs.hasOwnProperty(g) && d.push(this.data.songs[g].songID);
                GS.player.addSongsToQueueAt(d, a, b, f)
            } else this.data.playlists && this.data.playlists.playlistID && GS.Models.Playlist.getPlaylist(this.data.playlists.playlistID, this.callback("playPlaylist",
                    {index:a, playOnAdd:b}), null, false)
        }, getSongs:function (a) {
            var b = this.data.songs && this.data.songs.length ? GS.Models.Song.wrapCollection(this.data.songs) : [];
            return a ? b.reverse() : b
        }, getSongsWithArt:function (a) {
            a = _.orEqual(a, 7);
            var b = [], d = {};
            if (this.data.songs && this.data.songs.length)for (var f = 0; f < this.data.songs.length; f++) {
                if (this.data.songs[f].artFilename && !d[this.data.songs[f].artFilename]) {
                    b.push(f);
                    d[this.data.songs[f].artFilename] = true
                }
                if (b.length == a)break
            }
            return b
        }, getUrlByType:function (a, b) {
            b =
                    _.orEqual(b, 0);
            try {
                switch (a) {
                    case "album":
                        if (this.data && this.data.songs)return _.cleanUrl(this.data.songs[b].albumName, this.data.songs[b].albumID, "album"); else if (this.data && this.data.albums)return _.cleanUrl(this.data.albums[b].albumName, this.data.albums[b].albumID, "album");
                        break;
                    case "artist":
                        if (this.data && this.data.songs)return _.cleanUrl(this.data.songs[b].artistName, this.data.songs[b].artistID, "artist"); else if (this.data && this.data.artists)return _.cleanUrl(this.data.artists[b].artistName, this.data.artists[b].artistID,
                                "artist"); else if (this.data && this.data.albums)return _.cleanUrl(this.data.albums[b].artistName, this.data.albums[b].artistID, "artist");
                        break;
                    case "playlist":
                        if (this.data && this.data.playlists)return _.cleanUrl(this.data.playlists[b].playlistName, this.data.playlists[b].playlistID, "playlist");
                        break;
                    case "playlistAuthor":
                        if (this.data && this.data.playlists)return _.cleanUrl(this.data.playlists[b].owningName, this.data.playlists[b].owningUserID, "user");
                        break;
                    case "user":
                        if (this.data && this.data.users)if (this.data.users[b].userName)return _.cleanUrl(this.data.users[b].userName,
                                this.data.users[b].userID, "user"); else if (this.data.users[b].displayName)return _.cleanUrl(this.data.users[b].displayName, this.data.users[b].userID, "user");
                        break;
                    case "taggedUser":
                        if (this.data && this.people)return _.cleanUrl(this.people[b].userName, this.people[b].userID, "user");
                        break;
                    default:
                        return null
                }
            } catch (d) {
                return null
            }
        }, getMetaByType:function (a, b) {
            b = _.orEqual(b, 0);
            try {
                switch (a) {
                    case "song":
                        return _.cleanText(this.data.songs[b].songName);
                    case "album":
                        if (this.data.songs && this.data.songs[b])return _.cleanText(this.data.songs[b].albumName);
                        else if (this.data.albums && this.data.albums[b])return _.cleanText(this.data.albums[b].albumName);
                        break;
                    case "artist":
                        if (this.data.songs)return _.cleanText(this.data.songs[b].artistName); else if (this.data.artists)return _.cleanText(this.data.artists[b].artistName); else if (this.data.albums)return _.cleanText(this.data.albums[b].artistName);
                        break;
                    case "playlist":
                        return _.cleanText(this.data.playlists[b].playlistName);
                    case "playlistAuthor":
                        return _.cleanText(this.data.playlists[b].owningName);
                    case "user":
                        if (this.data.users[b].userName)return _.cleanText(this.data.users[b].userName);
                        else if (this.data.users[b].displayName)return _.cleanText(this.data.users[b].displayName);
                        break;
                    case "taggedUser":
                        return _.cleanText(this.people[b].userName)
                }
            } catch (d) {
                return null
            }
            return null
        }, getImageURL:function (a, b, d) {
            var f = "", g = "";
            b = _.orEqual(b, 0);
            d = _.orEqual(d, 70);
            switch (a) {
                case "song":
                case "album":
                    g = this.data.songs && this.data.songs[b] && this.data.songs[b].artFilename ? _.cleanText(this.data.songs[b].artFilename) : this.data.albums && this.data.albums[b] && this.data.albums[b].artFilename ? _.cleanText(this.data.albums[b].artFilename) :
                            "album.png";
                    f = GS.Models.Album.artPath + d + "_" + g;
                    break;
                case "artist":
                    g = this.data.songs && this.data.songs[b] && this.data.songs[b].artFilename ? _.cleanText(this.data.songs[b].artFilename) : this.data.artists && this.data.artists[b] && this.data.artists[b].artFilename ? _.cleanText(this.data.artists[b].artFilename) : "artist.png";
                    f = GS.Models.Artist.artPath + d + "_" + g;
                    break;
                case "playlist":
                    if (this.data.playlists && this.data.playlists[b] && this.data.playlists[b].artFilename) {
                        g = _.cleanText(this.data.playlists[b].artFilename);
                        f = GS.Models.Playlist.artPath + d + "_" + g
                    } else {
                        g = "album.png";
                        f = GS.Models.Album.artPath + d + "_" + g
                    }
                    break;
                case "user":
                    g = this.data.users && this.data.users[b] && this.data.users[b].picture ? _.cleanText(this.data.users[b].picture) : "user.png";
                    f = GS.Models.User.artPath + d + "_" + g;
                    break;
                case "taggedUser":
                    g = this.people && this.people[b] && this.people[b].picture ? _.cleanText(this.people[b].picture) : "user.png";
                    f = GS.Models.User.artPath + d + "_" + g;
                    break
            }
            return f
        }, playPlaylist:function (a, b) {
            b && b.PlaylistID && GS.player.playPlaylist(a,
                    b)
        }, remove:function (a, b) {
            this.user.UserID == GS.user.UserID && GS.service.hideUserEvent(this.eventID, a, b)
        }, getDetailsForFeeds:function () {
            return{user:this.user.getDetailsForFeeds(), eventID:this.eventID, activityName:this.activityName}
        }, canComment:function () {
            if (!GS.user.fanbase)GS.user.fanbase = GS.Models.Fanbase.wrap({objectID:GS.user.UserID, objectType:"user"});
            if (GS.user.UserID > 0 && (GS.user.UserID == this.user.UserID || GS.user.fanbase.userIDs.indexOf(this.user.UserID) != -1))return true;
            return false
        }, addComment:function (a, b, d) {
            GS.service.addEventComment(this.eventID, a, this.callback([this.addCommentSuccess, b]), d)
        }, addCommentSuccess:function (a) {
            if (!a || !a._id)return false;
            this.hasComments = true;
            if (!this.comments)this.comments = [];
            this.comments.push(a);
            return a
        }, removeComment:function (a) {
            for (var b = 0; b < this.comments.length; b++) {
                var d = this.comments[b];
                if (a == d._id && (GS.user.UserID == d.userID || GS.user.UserID == this.user.UserID)) {
                    GS.service.hideEventComment(a, this.eventID);
                    this.comments.splice(b, 1);
                    return
                }
            }
        }, toString:function () {
            return["Feed. type:",
                this.activityName, ", usname: ", this.user.UserName].join("")
        }})
})(jQuery);

