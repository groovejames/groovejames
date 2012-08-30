(function (c) {
    GS.Models.Base.extend("GS.Models.Station", {id:"StationID", TAG_STATIONS:[
        {StationID:136, StationTitle:"STATION_INDIE", TagID:136},
        {StationID:67, StationTitle:"STATION_ELECTRONICA", TagID:67},
        {StationID:750, StationTitle:"STATION_CLASSICAL", TagID:750},
        {StationID:56, StationTitle:"STATION_POP", TagID:56},
        {StationID:3, StationTitle:"STATION_RAP", TagID:3},
        {StationID:80, StationTitle:"STATION_COUNTRY", TagID:80},
        {StationID:13, StationTitle:"STATION_ALTERNATIVE", TagID:13},
        {StationID:29, StationTitle:"STATION_HIP_HOP",
            TagID:29},
        {StationID:3529, StationTitle:"STATION_CLASSIC_ROCK", TagID:3529},
        {StationID:75, StationTitle:"STATION_AMBIENT", TagID:75},
        {StationID:111, StationTitle:"STATION_PUNK", TagID:111},
        {StationID:9, StationTitle:"STATION_90S_ALT_ROCK", TagID:9},
        {StationID:230, StationTitle:"STATION_BLUES", TagID:230},
        {StationID:12, StationTitle:"STATION_ROCK", TagID:12},
        {StationID:43, StationTitle:"STATION_JAZZ", TagID:43},
        {StationID:4, StationTitle:"STATION_RNB", TagID:4},
        {StationID:122, StationTitle:"STATION_FOLK", TagID:122},
        {StationID:2563, StationTitle:"STATION_DUBSTEP", TagID:2563},
        {StationID:55, StationTitle:"STATION_80s", TagID:55},
        {StationID:69, StationTitle:"STATION_TRANCE", TagID:69},
        {StationID:96, StationTitle:"STATION_BLUEGRASS", TagID:96},
        {StationID:160, StationTitle:"STATION_REGGAE", TagID:160},
        {StationID:17, StationTitle:"STATION_METAL", TagID:17},
        {StationID:102, StationTitle:"STATION_OLDIES", TagID:102},
        {StationID:191, StationTitle:"STATION_EXPERIMENTAL", TagID:191},
        {StationID:528, StationTitle:"STATION_LATIN", TagID:528}
    ],
        tagStations:[], extraStations:{}, stationsByName:{}, getStationsStartMenu:function () {
            for (var a = [], b, d = function (g) {
                return function () {
                    GS.player.setAutoplay(true, g)
                }
            }, f = 0; f < GS.Models.Station.tagStations.length; f++) {
                b = GS.Models.Station.tagStations[f];
                a.push({title:c.localize.getString(b.StationTitle), customClass:"jj_menu_item_hasIcon jj_menu_item_station", action:{type:"fn", callback:d(b.TagID)}})
            }
            a.sort(function (g, k) {
                var m = g.title.toLowerCase(), h = k.title.toLowerCase();
                return m == h ? 0 : m > h ? 1 : -1
            });
            return a
        }, getStationsStartMenuForPinboard:function () {
            for (var a =
                    [], b, d = function (g) {
                return function () {
                    GS.user.addToShortcuts("station", g, true)
                }
            }, f = 0; f < GS.Models.Station.tagStations.length; f++) {
                b = GS.Models.Station.tagStations[f];
                GS.user.getIsShortcut("station", b.TagID) || a.push({title:c.localize.getString(b.StationTitle), customClass:"jj_menu_item_hasIcon jj_menu_item_station", action:{type:"fn", callback:d(b.TagID)}})
            }
            a.sort(function (g, k) {
                var m = g.title.toLowerCase(), h = k.title.toLowerCase();
                return m == h ? 0 : m > h ? 1 : -1
            });
            return a
        }, getStationByName:function (a) {
            if (c.localize.ready &&
                    GS.getLocale && GS.Models.Station.stationsByName.locale != GS.getLocale().locale) {
                GS.Models.Station.stationsByName = {};
                _.forEach(GS.Models.Station.TAG_STATIONS, function (b) {
                    var d = c.localize.getString(b.StationTitle).toLowerCase();
                    GS.Models.Station.stationsByName[d] = b
                }, this);
                GS.Models.Station.stationsByName.locale = GS.getLocale().locale
            }
            if (GS.Models.Station.stationsByName[a])return GS.Models.Station.stationsByName[a];
            return false
        }, FeedStation:null, lastHeardFeedEvent:0, init:function () {
            c.subscribe("gs.player.nowplaying",
                    this.callback("onSongPlay"));
            c.subscribe("gs.app.ready", this.callback(function () {
                _.forEach(GS.Models.Station.TAG_STATIONS, function (a) {
                    GS.Models.Station.tagStations.push(GS.Models.Station.wrap(a))
                }, this)
            }))
        }, setFeedStation:function (a) {
            if (a && this.Station !== a) {
                this.lastHeardFeedEvent = 0;
                a.playSongs(-1, true)
            }
            GS.Models.Station.FeedStation = a
        }, onSongPlay:function () {
            if (this.Station) {
                GS.Models.Feed.Station.play(-1, false, GS.Models.Feed.lastHeardFeedEvent);
                GS.Models.Feed.lastHeardFeedEvent = GS.Models.Feed.Station.newestTime
            }
        },
        itemRenderer:function (a, b) {
            return b = ['<a class="name ellipsis" href="#!/station/-/', a, '">', b, "</a>"].join("")
        }, makeChristmasHappen:function () {
            GS.player.setAutoplay(true, 703)
        }}, {StationID:0, TagID:0, StationTitle:"", StationName:"", Artists:[], init:function (a) {
        this._super(a);
        this.StationName = c.localize.getString(a.StationTitle);
        if (!this.StationName)this.StationName = this.StationTitle
    }, toProxyLabel:function () {
        return _.cleanText(c.localize.getString(this.StationTitle))
    }, getContextMenu:function () {
        var a = [];
        a.push({title:c.localize.getString("CONTEXT_START_STATION"), customClass:"jj_menu_item_hasIcon jj_menu_item_station", action:{type:"fn", callback:this.callback(function () {
            GS.player.setAutoplay(true, this.TagID)
        })}});
        a.push({title:c.localize.getString("CONTEXT_ADD_TO_PINBOARD"), customClass:"jj_menu_item_hasIcon jj_menu_item_pinboard", action:{type:"fn", callback:this.callback(function () {
            GS.user.addToShortcuts("station", this.StationID, true)
        })}});
        return a
    }})
})(jQuery);

