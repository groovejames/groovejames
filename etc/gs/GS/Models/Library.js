(function () {
    GS.Models.Base.extend("GS.Models.Library", {}, {currentPage:0, userID:null, lastModified:0, songsLoaded:false, init:function (c) {
        this.songsLoaded = false;
        this.lastModified = this.currentPage = 0;
        this.songs = _.orEqual(c.songs, {});
        this._super(c)
    }, getSongs:function (c, a) {
        if (this.songsLoaded) {
            this.songs = this.wrapSongCollection(this.songs, {TSAdded:"", TSFavorited:""});
            c(this.songs)
        } else GS.service.userGetSongsInLibrary(this.userID, this.currentPage, !(GS.user && GS.user.UserID === this.userID), this.callback(["saveLastModified",
            "loadSongs", c]), a)
    }, reloadLibrary:function (c, a) {
        this.songsLoaded = false;
        this.lastModified = this.currentPage = 0;
        this.songs = {};
        this.getSongs(c, a)
    }, loadSongs:function (c) {
        return this.wrapSongCollection(c, {TSAdded:"", TSFavorited:"", fromLibrary:GS.user.UserID == this.userID ? 1 : 0})
    }, saveLastModified:function (c) {
        this.lastModified = c.TSModified;
        return c
    }, refreshLibrary:function (c) {
        c.TSModified > this.lastModified && this.reloadLibrary(null, null, false)
    }})
})(jQuery);

