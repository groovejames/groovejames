GS.Controllers.BaseController.extend("GS.Controllers.AirbridgeController",
    {onDocument:true},
    {
    isDesktop:false, _bridge:null, oldWindowOpen:null,
    init:function () {
        if (window.parentSandboxBridge) {
            this.isDesktop = true;
            this._bridge = window.parentSandboxBridge;
            window.childSandboxBridge = this;
            window.console.error = this._bridge.consoleError;
            GS.store.set = this._bridge.storeSet;
            GS.store.get = this._bridge.storeGet;
            GS.store.remove = this._bridge.storeRemove;
            GS.store.clear = this._bridge.storeClear;
            gsConfig.assetHost = "http://" +
                    window.location.host;
            this.subscribe("gs.player.playstatus", this.callback(this._onPlayStatus));
            this.subscribe("gs.player.song.change", this.callback(this._onSongChange));
            this.subscribe("gs.player.queue.change", this.callback(this._onQueueChange));
            this.subscribe("gs.auth.favorites.songs.add", this.callback(this._onFavLibChanged));
            this.subscribe("gs.auth.favorites.songs.remove", this.callback(this._onFavLibChanged));
            this.subscribe("gs.auth.library.add", this.callback(this._onFavLibChanged));
            this.subscribe("gs.auth.library.remove",
                    this.callback(this._onFavLibChanged));
            var c = this;
            $("body").delegate('a[target="_blank"]', "click", function (a) {
                if (!$(a.target).closest("a").hasClass("airNoFollow")) {
                    a.preventDefault();
                    a = $(a.target).closest("a").attr("href");
                    c._bridge.consoleWarn(a);
                    a && c._bridge.navigateToUrl(a, "_blank");
                    return false
                }
            });
            this.oldWindowOpen = window.open;
            window.open = function (a, b, d) {
                d = _.orEqual(d, "width=800,height=600");
                return b == "_blank" ? c._bridge.navigateToUrl(a, b) : c.oldWindowOpen.call(window, a, b, d)
            }
        }
        this._super()
    },
    _lastStatus:null,
    _onPlayStatus:function (c) {
        if (c && this._lastStatus)if (c.status === this._lastStatus.status)if (!c.activeSong && !this._lastStatus.activeSong) {
            this._lastStatus = c;
            return
        } else if (c.activeSong && this._lastStatus.activeSong)if (c.activeSong.SongID == this._lastStatus.activeSong.SongID && c.activeSong.autoplayVote == this._lastStatus.activeSong.autoplayVote) {
            this._lastStatus = c;
            return
        }
        this._lastStatus = c;
        this._bridge && this._bridge.playerChange()
    }, _onQueueChange:function () {
        this._bridge && this._bridge.playerChange()
    }, _onSongChange:function (c) {
        if (!this._lastStatus ||
                this._lastStatus.activeSong && this._lastStatus.activeSong.SongID === c.SongID && this._lastStatus.activeSong.autoplayVote !== c.autoplayVote) {
            if (this._lastStatus)this._lastStatus.activeSong.autoplayVote = c.autoplayVote;
            this._bridge && this._bridge.playerChange()
        }
    }, _onFavLibChanged:function (c) {
        if (c && GS.player.queue && GS.player.queue.activeSong && parseInt(c.SongID, 10) == parseInt(GS.player.queue.activeSong.SongID, 10)) {
            GS.player.queue.activeSong.isFavorite = c.isFavorite;
            GS.player.queue.activeSong.fromLibrary = c.fromLibrary;
            this._bridge && this._bridge.playerChange()
        }
    }, appReady:function () {
        this._bridge && this._bridge.ready()
    }, getDesktopPreferences:function () {
        return this._bridge ? this._bridge.getDesktopPreferences() : null
    }, setDesktopPreferences:function (c) {
        this._bridge && this._bridge.setDesktopPreferences(c)
    }, displayNotification:function (c, a) {
        $.publish("gs.notification", {type:c, message:$.localize.getString(a)})
    }, getQueueStatus:function () {
        var c = GS.player.getCurrentQueue(true);
        c || (c = {});
        if (c.activeSong) {
            c.activeSong.url = "http://grooveshark.com/" +
                    c.activeSong.toUrl().replace("#!/", "");
            c.activeSong.imageUrl = c.activeSong.getImageURL()
        }
        c.playStatus = GS.player.lastStatus;
        return c
    }, setHash:function (c) {
        GS.router.setHash(c)
    }, safeToClose:function () {
        return window.onbeforeunload()
    }, addSongsToQueueAt:function () {
        return GS.player.addSongsToQueueAt.apply(GS.player, arguments)
    }, playSong:function () {
        return GS.player.playSong.apply(GS.player, arguments)
    }, pauseSong:function () {
        return GS.player.pauseSong.apply(GS.player, arguments)
    }, resumeSong:function () {
        return GS.player.resumeSong.apply(GS.player,
                arguments)
    }, stopSong:function () {
        return GS.player.stopSong.apply(GS.player, arguments)
    }, previousSong:function () {
        return GS.player.previousSong.apply(GS.player, arguments)
    }, nextSong:function () {
        return GS.player.nextSong.apply(GS.player, arguments)
    }, flagSong:function () {
        return GS.player.flagSong.apply(GS.player, arguments)
    }, voteSong:function () {
        return GS.player.voteSong.apply(GS.player, arguments)
    }, getIsMuted:function () {
        return GS.player.getIsMuted.apply(GS.player, arguments)
    }, setIsMuted:function () {
        return GS.player.setIsMuted.apply(GS.player,
                arguments)
    }, getVolume:function () {
        return GS.player.getVolume.apply(GS.player, arguments)
    }, setVolume:function () {
        return GS.player.setVolume.apply(GS.player, arguments)
    }, getShuffle:function () {
        return GS.player.getShuffle.apply(GS.player, arguments)
    }, setShuffle:function () {
        return GS.player.setShuffle.apply(GS.player, arguments)
    }, setAutoplay:function () {
        return GS.player.setAutoplay.apply(GS.player, arguments)
    }, clearQueue:function () {
        return GS.player.clearQueue.apply(GS.player, arguments)
    }, getRepeat:function () {
        return GS.player.getRepeat.apply(GS.player,
                arguments)
    }, setRepeat:function () {
        return GS.player.setRepeat.apply(GS.player, arguments)
    }, addPlaylist:function (c, a, b) {
        GS.Models.Playlist.getPlaylist(c, function (d) {
            d.play(a, b)
        }, null, false)
    }, addSongFromToken:function (c, a, b) {
        GS.Models.Song.getSongFromToken(c, function (d) {
            GS.player.addSongsToQueueAt([d.SongID], a, b)
        }, null)
    }, favoriteSong:function (c) {
        GS.user.addToSongFavorites(c)
    }, unfavoriteSong:function (c) {
        GS.user.removeFromSongFavorites(c)
    }, addSongToLibrary:function (c) {
        GS.user.addToLibrary([c])
    }, removeSongFromLibrary:function (c) {
        GS.user.removeFromLibrary(c)
    },
    executeProtocol:function (c) {
        GS.Controllers.ApiController.instance().executeProtocol(c)
    }
});

