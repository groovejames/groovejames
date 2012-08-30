GS.Controllers.BaseController.extend("GS.Controllers.PartyController", {isGSSingleton:true}, {partyPath:"http://" + (gsConfig && gsConfig.httpHost) + "/u/", partyHash:null, shortURL:"", enabled:false, playlist:null, syncPlaylist:false, voteDowns:{}, voteDownGotoNext:6, init:function () {
    this._super()
}, enable:function (c) {
    this.enabled && this.disable();
    this.voteDowns = {};
    this.shortURL = "";
    this.syncPlaylist = false;
    if (GS.user.UserID > 0) {
        if (c && c.UserID == GS.user.UserID) {
            this.playlist = c;
            GS.player.clearQueue();
            this.playlist.play(-1,
                    true, false)
        }
        GS.service.getPartyHash(this.callback("onHashSuccess"), this.callback("onHashFail"))
    }
}, onHashSuccess:function (c) {
    this.partyHash = c;
    this.user = GS.user;
    this.enabled = true;
    $.publish("gs.player.party", c);
    c = "http://api.bitly.com/v3/shorten?login=grooveshark&apiKey=R_44014f5c4cfe09348eced3baebeadcc3&longUrl=" + this.getPartyUrl();
    $.ajax({url:c, dataType:"jsonp", success:this.callback(function (a) {
        this.shortURL = a.data.url;
        $.publish("gs.player.party.update", {playlist:this.playlist})
    })})
}, onHashFail:function () {
    console.warn("failed to get party hash -- not much of a party anymore")
},
    getPartyUrl:function (c) {
        if (this.enabled && this.partyHash) {
            if (!c && this.shortURL)return this.shortURL;
            return this.partyPath + this.partyHash
        }
    }, disable:function () {
        this.enabled = false;
        this.playlist = null;
        $.publish("gs.player.party", false)
    }, updateQueueFromBroadcast:function (c) {
        var a = [], b = [];
        if (c.data.songs)a = GS.Models.Song.wrapCollection(c.data.songs);
        for (var d = 0, f = a.length; d < f; d++)b.push(a[d].SongID);
        if (this.enabled)switch (c.action) {
            case "append":
                c = !Boolean(GS.player.getCurrentQueue().activeSong);
                GS.player.addSongsToQueueAt(b,
                        -3, c);
                this.playlist && this.syncPlaylist && this.playlist.addSongs(a, -1, true);
                break;
            case "voteDown":
                a = c.data.songID;
                b = GS.player && GS.player.currentSong;
                if (this.voteDowns[a])this.voteDowns[a]++; else this.voteDowns[a] = 1;
                if (this.voteDowns[a] >= this.voteDownGotoNext && b && b.SongID == a) {
                    this.voteDowns[a] = 0;
                    GS.player.nextSong()
                }
                break
        }
    }});

