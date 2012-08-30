(function (c) {
    GS.Models.Base.extend("GS.Models.Artist", 
    {
    id:"ArtistID",
    cache:{},
    artPath:"http://images.grooveshark.com/static/artists/",
    defaults:{ArtistName:"", ArtistID:null, CoverArtFilename:"", PathName:null, PathNameEmpty:false, mbID:null, isFavorite:0, songsLoaded:false, eventsLoaded:false, eventIDs:[], fanbase:null, lastFMInfo:{}},

    getArtist:function (a, b, d) {
        var f = this.getOneFromCache(a);
        if (f)c.isFunction(b) && b(f); else GS.service.getArtistByID(a, this.callback(["wrap", b]), d)
    }, getOneSynchronous:function (a) {
        var b =
                this.getOneFromCache(a);
        if (b)return b; else {
            GS.service.getArtistByID(a, this.callback(this.wrap), null, {async:false});
            return this.getOneFromCache(a)
        }
    }, getFilterAll:function () {
        return this.wrap({ArtistID:-1, ArtistName:c.localize.getString("ALL_ARTISTS"), IsVerified:2, isFilterAll:1}, false)
    }, defaultSongSort:function (a, b) {
        var d = _.orEqual(a.AlbumName, ""), f = _.orEqual(a.AlbumName, "");
        if (d > f)return 1; else if (d < f)return-1;
        return GS.Models.Album.defaultSongSort(a, b)
    }, itemRenderer:function (a) {
        var b = "", d = "ARTIST_FOLLOW";
        if (a.isFavorite) {
            b = "following";
            d = "ARTIST_FOLLOWING"
        }
        var f = ['<a class="name ellipsis" href="', a.toUrl(), '">', a.ArtistName, "</a>"].join("");
        ['<a href="', a.toUrl(), '">', a.ArtistName, "</a>"].join("");
        var g = ['<img width="70" height="70" src="', a.getImageURL(), '"/>'].join("");
        b = ['<button class="btn button_style2 followArtist artistID', a.ArtistID, " ", b, '" data-artistid="', a.ArtistID, '"><div><span class="icon"></span><span class="label" data-translate-text="', d, '">', c.localize.getString(d), "</span></div></button>"].join("");
        return['<a href="', a.toUrl(), '" class="artistImage insetBorder height70">', g, '</a><div class="meta">', f, b, "</div>"].join("")
    }, exploreItemRenderer:function (a) {
        var b = "", d = "";
        if (a.isFavorite) {
            b = "following";
            d = c.localize.getString("UNFOLLOW")
        }
        var f = ['<a class="name ellipsis" href="', a.toUrl(), '">', a.ArtistName, "</a>"].join("");
        ['<a href="', a.toUrl(), '">', a.ArtistName, "</a>"].join("");
        var g = ['<img src="', a.getImageURL(120), '"/>'].join("");
        b = ['<button class="followArtist artistID', a.ArtistID, " ", b, '"data-artistid="',
            a.ArtistID, '" title="', d, '" data-cachePrefix="' + a.cachePrefix + '"><div><span class="icon"></span></div></button>'].join("");
        d = a.tags ? '<div class="tags"><span class="icon"></span><span class="label ellipsis">' + a.tags + "</span></div>" : "";
        return['<div class="tooltip" data-tip-type="artist" data-artistid="', a.ArtistID, '" data-cachePrefix="', a.cachePrefix, '"><a href="', a.toUrl(), '" class="artistImage insetBorder height120">', g, "</a>", b, '<div class="meta">', f, d, "</div></div>"].join("")
    }, matchFilter:function (a) {
        var b =
                RegExp(a, "gi");
        return function (d) {
            return d.ArtistName.match(b) || d.AlbumName.match(b)
        }
    }
    },
    {
    smallCollection:10, artistFeed:null, init:function (a) {
        this._super(a);
        this.ArtistName = _.cleanText(_.orEqual(a.ArtistName, a.Name) || "Unknown Artist");
        this.CoverArtFilename = _.orEqual(a.ArtistCoverArtFilename, a.CoverArtFilename);
        this.fanbase = false;
        this.songs = {};
        this.albums = {};
        this.songsUnverifiedLoaded = this.songsLoaded = false;
        this.eventIDs = [];
        this.eventsLoaded = false;
        this.searchText = this.ArtistName.toLowerCase();
        this.feed =
                false
    }, loadSongs:function (a, b) {
        this.allSongs ? a(this.allSongs) : GS.service.artistGetAllSongs(this.ArtistID, this.callback(function (d) {
            this.allSongs = d;
            a(d)
        }), b, {})
    }, getSongs:function (a, b, d) {
        this.loadSongs(this.callback(function (f) {
            f = this._returnFreshSongCollection(f, b);
            a(f)
        }), d)
    }, getAlbums:function (a, b, d) {
        this.loadSongs(this.callback(function (f) {
            var g = [], k = {}, m, h, n;
            h = 0;
            for (n = f.length; h < n; h++) {
                m = f[h];
                if (!k[m.AlbumID] && m.AlbumID) {
                    g.push({AlbumName:m.AlbumName, AlbumID:m.AlbumID, ArtistName:m.ArtistName, ArtistID:m.ArtistID,
                        CoverArtFilename:_.orEqualEx(m.CoverArtFilename, m.artFilename, ""), IsVerified:_.orEqual(parseFloat(m.IsVerified, 10), 0)});
                    k[m.AlbumID] = true
                }
            }
            g = g.sort(function (q, s) {
                return parseFloat(q.AlbumID, 10) <= parseFloat(s.AlbumID, 10) ? -1 : 1
            });
            g = b(g);
            h = 0;
            for (n = g.length; h < n; h++)g[h] = GS.Models.Album.wrap(g[h], false);
            a(g)
        }), d)
    }, wrap:function (a, b, d) {
        a = _.orEqual(a, {});
        try {
            delete a.AlbumID
        } catch (f) {
        }
        a.ArtistName = _.cleanText(a.ArtistName) || "Unknown Artist";
        a.CoverArtFilename = _.orEqual(a.ArtistCoverArtFilename, a.CoverArtFilename);
        return this._super(a, b, d)
    }, _returnFreshSongCollection:function (a, b) {
        if (typeof b === "function") {
            a = b(a);
            this.songsLoaded = false
        } else this.songsLoaded = true;
        return this.wrapSongCollection(a, {Popularity:"0"})
    }, getEvent:function (a, b) {
        var d = {};
        if (this.eventsLoaded) {
            d = GS.Models.Event.getManyFromCache(this.eventIDs);
            a(d)
        } else GS.service.artistGetEvents(this.ArtistID, this.ArtistName, this.callback([GS.Models.Event.wrapMany, a]), b, d)
    }, cacheAndReturnEvents:function (a) {
        for (var b = GS.Models.User.wrapMany(a.Users || a.Return.fans ||
                a.Return), d = 0; d < b.length; d++) {
            var f = b[d];
            this.userIDs.push(f.UserID);
            GS.Models.User.cache[f.UserID] = f
        }
        if (_.defined(a.hasMore) && a.hasMore)this.currentPage++; else this.fansLoaded = true;
        return b
    }, validate:function () {
        if (this.ArtistID > 0)return true;
        return false
    }, getDetailsForFeeds:function () {
        return{artistID:this.ArtistID, artistName:_.uncleanText(this.ArtistName), artFilename:this.CoverArtFilename}
    }, toUrl:function (a) {
        return this.PathName ? _.makeUrlFromPathName(this.PathName, a) : _.cleanUrl(this.ArtistName, this.ArtistID,
                "artist", null, a)
    }, getPathName:function (a) {
        if (this.PathName || this.PathNameEmpty)c.isFunction(a) && a(this.PathName); else GS.service.getPageInfoByIDType(this.ArtistID, "artist", this.callback(this._onPathNameSuccess, a), this.callback(this._onPathNameFailed, a))
    }, _onPathNameSuccess:function (a, b) {
        if (b.Name) {
            this.PathName = b.Name;
            if (b.Data && b.Data.mbID)this.mbID = b.Data.mbID
        } else {
            this.PathName = "";
            this.PathNameEmpty = true
        }
        c.isFunction(a) && a(this.PathName)
    }, _onPathNameFailed:function (a) {
        this.PathName = "";
        this.PathNameEmpty =
                true;
        c.isFunction(a) && a(this.PathName)
    }, getImageURL:function (a) {
        a = _.orEqual(a, 70);
        if (this.CoverArtFilename)return GS.Models.Artist.artPath + a + "_" + this.CoverArtFilename;
        return GS.Models.Artist.artPath + a + "_artist.png"
    }, getTitle:function () {
        return this.ArtistName
    }, play:function (a, b, d) {
        this.getSongs(this.callback("playSongs", {index:a, playOnAdd:b, verified:true, shuffle:d}))
    }, getArtAttribution:function (a) {
        if (this.artAttribution)c.isFunction(a) && a(this.artAttribution); else GS.service.artistGetArtAttribution(this.ArtistID,
                this.callback(function (b) {
                    this.artAttribution = b;
                    c.isFunction(a) && a(b)
                }))
    }, getContextMenu:function () {
        new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_ARTIST, this);
        var a = [
            {title:c.localize.getString("CONTEXT_PLAY_ARTIST"), action:{type:"fn", callback:this.callback(function () {
                this.play(GS.player.INDEX_DEFAULT, true)
            })}, customClass:"jj_menu_item_hasIcon jj_menu_item_play"},
            {title:c.localize.getString("CONTEXT_PLAY_ARTIST_NEXT"), action:{type:"fn", callback:this.callback(function () {
                this.play(GS.player.INDEX_NEXT,
                        false)
            })}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_next"},
            {title:c.localize.getString("CONTEXT_PLAY_ARTIST_LAST"), action:{type:"fn", callback:this.callback(function () {
                this.play(GS.player.INDEX_LAST, false)
            })}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_last"},
            {customClass:"separator"},
            {title:c.localize.getString("CONTEXT_REPLACE_ALL_SONGS"), action:{type:"fn", callback:this.callback(function () {
                this.play(GS.player.INDEX_REPLACE, GS.player.isPlaying)
            })}, customClass:"jj_menu_item_hasIcon jj_menu_item_replace_playlist"},
            {customClass:"separator"}
        ];
        a = a.concat([
            {title:c.localize.getString("SHARE_ARTIST"), customClass:"jj_menu_item_hasIcon jj_menu_item_share", action:{type:"fn", callback:this.callback(function () {
                GS.getLightbox().open("share", {type:"artist", id:this.ArtistID})
            })}},
            {customClass:"separator"}
        ]);
        GS.user.getIsShortcut("artist", this.ArtistID) ? a.push({title:c.localize.getString("CONTEXT_REMOVE_FROM_PINBOARD"), customClass:"last jj_menu_item_hasIcon jj_menu_item_remove_pinboard", action:{type:"fn", callback:this.callback(function () {
            GS.user.removeFromShortcuts("artist",
                    this.ArtistID)
        })}}) : a.push({title:c.localize.getString("CONTEXT_ADD_TO_PINBOARD"), customClass:"last jj_menu_item_hasIcon jj_menu_item_pinboard", action:{type:"fn", callback:this.callback(function () {
            GS.user.addToShortcuts("artist", this.ArtistID, this.ArtistName)
        })}});
        return a
    }, getShareMenu:function () {
        var a = [], b = this.ArtistID;
        a.push({title:c.localize.getString("SHARE_FACEBOOK"), action:{type:"fn", callback:function () {
                    GS.getLightbox().open("share", {service:"facebook", type:"artist", id:b})
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_share_facebook"},
                {title:c.localize.getString("SHARE_TWITTER"), action:{type:"fn", callback:function () {
                    GS.getLightbox().open("share", {service:"twitter", type:"artist", id:b})
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_share_twitter"}, {title:c.localize.getString("SHARE_STUMBLE"), action:{type:"fn", callback:this.callback(function () {
                    window.open(_.makeUrlForShare("stumbleupon", "artist", this), "_blank");
                    c("div[id^=jjmenu]").remove()
                })}, customClass:"jj_menu_item_hasIcon jj_menu_item_share_stumbleupon"}, {title:c.localize.getString("SHARE_REDDIT"),
                    action:{type:"fn", callback:this.callback(function () {
                        window.open(_.makeUrlForShare("reddit", "artist", this), "_blank");
                        c("div[id^=jjmenu]").remove()
                    })}, customClass:"jj_menu_item_hasIcon jj_menu_item_share_reddit"}, {title:c.localize.getString("ARTIST_URL"), customClass:"artistUrl jj_menu_item_hasIcon jj_menu_item_copy"});
        return a
    }, toProxyLabel:function () {
        return _.cleanText(this.ArtistName)
    }, toString:function (a) {
        return(a = _.orEqual(a, false)) ? ["Artist. aid:", this.ArtistID, ", arname: ", this.ArtistName].join("") :
                _.cleanText(this.ArtistName)
    }})
})(jQuery);

