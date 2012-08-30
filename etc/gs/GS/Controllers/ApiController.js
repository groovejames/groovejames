GS.Controllers.BaseController.extend("GS.Controllers.ApiController", {onDocument:true}, {_songStatusCallback:"", _statusLookup:{0:"none", 1:"loading", 2:"loading", 3:"playing", 4:"paused", 5:"buffering", 6:"failed", 7:"completed"}, _protocolActions:["play", "add", "next"], _lastStatus:null, init:function () {
    this.subscribe("gs.player.playstatus", this.callback(this._doStatusCallback));
    this.subscribe("gs.player.song.change", this.callback(this._onSongChange));
    this._super()
}, getApplicationVersion:function () {
    return gsConfig.revision
}, getAPIVersion:function () {
    return 1.5
},
    executeProtocol:function (c) {
        var a = c.toLowerCase();
        if (a.indexOf("gs://") != -1) {
            c = c.substring(5);
            a = a.substring(5)
        }
        if (c.charAt(c.length - 1) == "/") {
            c = c.substring(0, c.length - 1);
            a = a.substring(0, a.length - 1)
        }
        a = a.split("/");
        var b = a.pop();
        if (this._protocolActions.indexOf(b) == -1) {
            a.push(b);
            b = ""
        }
        if (a[0] == "themes")GS.getLightbox().open("themes"); else {
            if (b) {
                c = c.substring(0, c.length - b.length - 1);
                var d = GS.player.INDEX_DEFAULT, f = false;
                switch (b) {
                    case "play":
                        f = true;
                        break;
                    case "next":
                        d = GS.player.INDEX_NEXT;
                        break
                }
                if (GS.player)switch (a[0]) {
                    case "s":
                        GS.Models.Song.getSong(a[2],
                                this.callback(function (g) {
                                    GS.player.addSongsToQueueAt(g.SongID, d, f)
                                }), null);
                        break;
                    case "song":
                        GS.Models.Song.getSongFromToken(a[2], this.callback(function (g) {
                            GS.player.addSongsToQueueAt(g.SongID, d, f)
                        }), null);
                        break;
                    case "album":
                        GS.Models.Album.getAlbum(a[2], this.callback(function (g) {
                            g.play(d, f)
                        }), null);
                        break;
                    case "playlist":
                        GS.Models.Playlist.getPlaylist(a[2], this.callback(function (g) {
                            g.play(d, f)
                        }), null);
                        break
                }
            }
            if (a[0] == "search") {
                a = a[a.length - 1];
                c = c.substring(0, c.length - a.length);
                c += "?q=" + a
            }
            GS.router.setHash("/" +
                    c)
        }
    }, getCurrentSongStatus:function () {
        return this._buildCurrentPlayStatus()
    }, setSongStatusCallback:function (c) {
        if ($.isFunction(c))this._songStatusCallback = c; else if (_.isString(c)) {
            c = c.split(".");
            c = this._getObjectChain(window, c);
            if ($.isFunction(c))this._songStatusCallback = c
        }
        return this._buildCurrentPlayStatus()
    }, _getObjectChain:function (c, a) {
        var b = a.shift();
        return(b = c[b]) ? a.length ? this._getObjectChain(b, a) : b : null
    }, _doStatusCallback:function (c) {
        if (c && this._lastStatus)if (c.status === this._lastStatus.status)if (!c.activeSong &&
                !this._lastStatus.activeSong) {
            this._lastStatus = c;
            return
        } else if (c.activeSong && this._lastStatus.activeSong)if (c.activeSong.SongID === this._lastStatus.activeSong.SongID && c.activeSong.autoplayVote === this._lastStatus.activeSong.autoplayVote) {
            this._lastStatus = c;
            return
        }
        this._lastStatus = c;
        $.isFunction(this._songStatusCallback) && this._songStatusCallback(this._buildCurrentPlayStatus())
    }, _onSongChange:function (c) {
        if (!this._lastStatus || this._lastStatus.activeSong && this._lastStatus.activeSong.SongID === c.SongID &&
                this._lastStatus.activeSong.autoplayVote !== c.autoplayVote) {
            if (this._lastStatus)this._lastStatus.activeSong.autoplayVote = c.autoplayVote;
            $.isFunction(this._songStatusCallback) && this._songStatusCallback(this._buildCurrentPlayStatus())
        }
    }, _buildCurrentPlayStatus:function () {
        var c = {song:null, status:"none"};
        if (GS.player) {
            var a = GS.player.getPlaybackStatus();
            if (a)if (a.activeSong) {
                var b = GS.Models.Song.getOneFromCache(a.activeSong.SongID);
                c.song = {songID:a.activeSong.SongID, songName:a.activeSong.SongName.replace(/&amp\;/g,
                        "&"), artistID:a.activeSong.ArtistID, artistName:a.activeSong.ArtistName.replace(/&amp\;/g, "&"), albumID:a.activeSong.AlbumID, albumName:a.activeSong.AlbumName.replace(/&amp\;/g, "&"), trackNum:b ? b.TrackNum : 0, estimateDuration:a.activeSong.EstimateDuration, artURL:b ? b.getImageURL() : gsConfig.assetHost + "/webincludes/images/default/album_250.png", calculatedDuration:a.duration, position:a.position, vote:a.activeSong.autoplayVote};
                c.status = this._statusLookup[a.status]
            }
        }
        return c
    }, getPreviousSong:function () {
        var c =
                null;
        if (GS.player && GS.player.queue && GS.player.queue.previousSong) {
            c = GS.player.queue.previousSong;
            var a = GS.Models.Song.getOneFromCache(c.SongID);
            c = {songID:c.SongID, songName:c.SongName.replace(/&amp\;/g, "&"), artistID:c.ArtistID, artistName:c.ArtistName.replace(/&amp\;/g, "&"), albumID:c.AlbumID, albumName:c.AlbumName.replace(/&amp\;/g, "&"), trackNum:a ? a.TrackNum : 0, estimateDuration:c.EstimateDuration, artURL:a ? a.getImageURL() : gsConfig.assetHost + "/webincludes/images/default/album_250.png", vote:c.autoplayVote}
        }
        return c
    },
    getNextSong:function () {
        var c = null;
        if (GS.player && GS.player.queue && GS.player.queue.nextSong) {
            c = GS.player.queue.nextSong;
            var a = GS.Models.Song.getOneFromCache(c.SongID);
            c = {songID:c.SongID, songName:c.SongName.replace(/&amp\;/g, "&"), artistID:c.ArtistID, artistName:c.ArtistName.replace(/&amp\;/g, "&"), albumID:c.AlbumID, albumName:c.AlbumName.replace(/&amp\;/g, "&"), trackNum:a ? a.TrackNum : 0, estimateDuration:c.EstimateDuration, artURL:a ? a.getImageURL() : gsConfig.assetHost + "/webincludes/images/default/album_250.png",
                vote:c.autoplayVote}
        }
        return c
    }, addSongsByID:function (c, a) {
        GS.player && GS.player.addSongsToQueueAt(c, GS.player.INDEX_DEFAULT, a)
    }, addSongByToken:function (c, a) {
        GS.player && GS.Models.Song.getSongFromToken(c, this.callback(function (b) {
            GS.player.addSongsToQueueAt([b.SongID], GS.player.INDEX_DEFAULT, a)
        }), null)
    }, addAlbumByID:function (c, a) {
        GS.player && GS.Models.Album.getAlbum(c, this.callback(function (b) {
            b.play(GS.player.INDEX_DEFAULT, a)
        }), null, false)
    }, addPlaylistByID:function (c, a) {
        GS.player && GS.Models.Playlist.getPlaylist(c,
                this.callback(function (b) {
                    b.play(GS.player.INDEX_DEFAULT, a)
                }), null, false)
    }, play:function () {
        if (GS.player && GS.player.queue && GS.player.queue.activeSong)GS.player.isPaused ? GS.player.resumeSong() : GS.player.playSong(GS.player.queue.activeSong.queueSongID)
    }, pause:function () {
        GS.player && GS.player.pauseSong()
    }, seekToPosition:function (c) {
        GS.player && GS.player.seekTo(c)
    }, togglePlayPause:function () {
        if (GS.player)GS.player.isPaused ? GS.player.resumeSong() : GS.player.pauseSong()
    }, previous:function () {
        GS.player && GS.player.previousSong()
    },
    next:function () {
        GS.player && GS.player.nextSong()
    }, setVolume:function (c) {
        GS.player && GS.player.setVolume(c)
    }, getVolume:function () {
        if (GS.player)return GS.player.getVolume();
        return 0
    }, setIsMuted:function (c) {
        GS.player && GS.player.setIsMuted(c)
    }, getIsMuted:function () {
        if (GS.player)return GS.player.getIsMuted();
        return false
    }, voteCurrentSong:function (c) {
        GS.player && GS.player.queue && GS.player.queue.activeSong && GS.player.voteSong(GS.player.queue.activeSong.queueSongID, c)
    }, getVoteForCurrentSong:function () {
        if (GS.player &&
                GS.player.queue && GS.player.queue.activeSong)return GS.player.queue.activeSong.autoplayVote
    }, favoriteCurrentSong:function () {
        GS.player && GS.player.queue && GS.player.queue.activeSong && GS.user.addToSongFavorites(GS.player.queue.activeSong.SongID)
    }, addCurrentSongToLibrary:function () {
        GS.player && GS.player.queue && GS.player.queue.activeSong && GS.user.addToLibrary([GS.player.queue.activeSong.SongID])
    }, removeCurrentSongFromQueue:function () {
        GS.player && GS.player.queue && GS.player.queue.activeSong && GS.player.removeSongs([GS.player.queue.activeSong.queueSongID])
    }});

