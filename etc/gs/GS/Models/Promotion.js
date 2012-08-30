(function () {
    GS.Models.Base.extend("GS.Models.Promotion", {promotions:{1:{title:"Can't Wait to Get It On Playlists", view:"trojan"}, 557:{title:"Samsung Note Valentines", view:"samsung", query:"romance love valentine"}}, submitPlaylistForCampaign:function (c, a, b, d) {
        GS.service.submitPlaylistForCampaign(c, a, b, d)
    }, submitSongVoteForCampaign:function (c, a, b, d) {
        GS.service.submitSongVoteForCampaign(c, a, b, d)
    }}, {campaignID:0, title:null, view:null, query:null, playlists:null, init:function (c) {
        this.campaignID = c;
        this.title =
                GS.Models.Promotion.promotions[this.campaignID].title;
        this.view = GS.Models.Promotion.promotions[this.campaignID].view;
        this.query = GS.Models.Promotion.promotions[this.campaignID].query
    }, getPlaylistsForCampaign:function (c, a) {
        this.query ? this.getQueryPlaylistsForCampaign(this.query, c, a) : GS.service.getPlaylistsForCampaign(this.campaignID, this.callback(["savePlaylists", c]), a)
    }, getQueryPlaylistsForCampaign:function (c, a, b) {
        GS.service.getResultsFromSearch(c, "Playlists", false, this.callback([function (d) {
            return this.playlists =
                    GS.Models.Playlist.wrapCollection(d.result)
        }, a]), b)
    }, savePlaylists:function (c) {
        return this.playlists = GS.Models.Playlist.wrapCollection(c)
    }})
})(jQuery);

