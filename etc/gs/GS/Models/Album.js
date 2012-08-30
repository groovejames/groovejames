(function (c) {
    GS.Models.Base.extend("GS.Models.Album", 
    {
    id:"AlbumID", 
    cache:{}, 
    artPath:"http://images.grooveshark.com/static/albums/", 
    smallAlbum:5, 
    defaults:{AlbumName:"", AlbumID:null, ArtistName:"", ArtistID:null, CoverArtFilename:"", Year:"", IsVerified:0, PathName:false, PathNameEmpty:false, isFavorite:0, songsLoaded:false, songsUnverifiedLoaded:false, fanbase:null}, 

    getAlbum:function (a, b, d) {
        var f = this.getOneFromCache(a);
        if (f)c.isFunction(b) && b(f); else GS.service.getAlbumByID(a, this.callback(["wrap", b]), d)
    }, getOneSynchronous:function (a) {
        var b =
                this.getOneFromCache(a);
        if (b)return b; else {
            GS.service.getAlbumByID(a, this.callback(this.wrap), null, {async:false});
            return this.getOneFromCache(a)
        }
    }, getFilterAll:function (a) {
        return this.wrap({AlbumID:-1, AlbumName:c.localize.getString("ALL_ALBUMS"), ArtistName:a || "", ArtistID:-1, IsVerified:2, isFilterAll:1}, false)
    }, defaultSongSort:function (a, b) {
        var d = parseFloat(_.orEqual(a.TrackNum, 0), 10), f = parseFloat(_.orEqual(b.TrackNum, 0), 10);
        if (isNaN(d))d = 0;
        if (isNaN(f))f = 0;
        if (d !== 0 && f === 0)return-1;
        if (f !== 0 && d === 0)return 1;
        return d - f
    }, prettySort:function (a, b) {
        return a.IsVerified && a.CoverArtFilename || a.IsVerified && !b.CoverArtFilename ? -1 : b.IsVerified && b.CoverArtFilename ? 1 : 0
    }, itemRenderer:function (a) {
        var b = "" + ('<a class="name ellipsis" href="' + a.toUrl() + '">' + a.AlbumName + "</a>"), d = ['<a href="', a.toArtistUrl(), '">', a.ArtistName, "</a>"].join("");
        d = c("<span></span>").localeDataString("BY_ARTIST", {artist:d});
        var f = ['<img width="70" height="70" src="', a.getImageURL(70), '"/>'].join(""), g = _.count(a.songs);
        g = g > 0 ? '<p class="numSongs">' +
                _.printf("NUM_SONGS", {numSongs:g}) + "</p>" : "";
        return['<a href="', a.toUrl(), '" class="albumImage insetBorder height70">', f, '<span class="playBtn" data-albumid="', a.AlbumID, '"></span></a><div class="meta">', b, '<span class="by">', d.render(), "</span>", g, "</div>"].join("")
    }, exploreItemRenderer:function (a) {
        var b = "" + ('<a class="name ellipsis" href="' + a.toUrl() + '">' + a.AlbumName + "</a>"), d = ['<a href="', a.toArtistUrl(), '">', a.ArtistName, "</a>"].join("");
        d = c("<span></span>").localeDataString("BY_ARTIST", {artist:d});
        var f = ['<img height="120" src="', a.getImageURL(120), '"/>'].join(""), g = a.tags ? '<div class="tags"><span class="icon"></span><span class="label ellipsis">' + a.tags + "</span></div>" : "";
        return['<div class="tooltip" data-tip-type="album" data-albumid="', a.AlbumID, '" data-cachePrefix="', a.cachePrefix, '"><a href="', a.toUrl(), '" class="albumImage insetBorder height120" >', f, '<span class="playBtn" data-albumid="', a.AlbumID, '"></span></a><div class="meta">', b, '<span class="by ellipsis">', d.render(), "</span>",
            g, "</div></div>"].join("")
    }, wrap:function (a, b, d) {
        a = _.orEqual(a, {});
        a.ArtistName = _.cleanText(a.ArtistName) || "Unknown Artist";
        a.AlbumName = _.cleanText(_.orEqual(a.AlbumName, a.Name)) || "Unknown Album";
        return this._super(a, b, d)
    }, matchFilter:function (a) {
        var b = RegExp(a, "gi");
        return function (d) {
            return d.ArtistName.match(b) || d.AlbumName.match(b)
        }
    }, filterVerified:function (a) {
        var b = {};
        _.forEach(a, function (d) {
            if (d.IsVerified == 1)b[d.SongID] = d
        });
        return b
    }},
    {
    getSongs:function (a, b, d) {
        var f = arguments[arguments.length -
                1] === d ? {} : arguments[arguments.length - 1];
        d = _.orEqual(d, true);
        if (this.songsLoaded) {
            f = this.songs;
            if (d)f = GS.Models.Album.filterVerified(f);
            f = this._wrapManySongs(f);
            c.isFunction(a) && a(f)
        } else GS.service.albumGetAllSongs(this.AlbumID, this.callback("_loadAndProcessSongs", d, a), b, f)
    }, _loadAndProcessSongs:function (a, b, d) {
        this.hasVerified = false;
        var f, g, k, m = {}, h = {}, n = [], q = {}, s = {};
        for (f in d)if (d.hasOwnProperty(f)) {
            g = d[f];
            g = GS.Models.Song.wrap(g);
            g.AlbumName = this.AlbumName;
            g.AlbumID = this.AlbumID;
            g.CoverArtFilename =
                    this.CoverArtFilename;
            q[g.SongID] = g.IsVerified === 1;
            g.IsVerified = 0;
            m[g.SongID] = g;
            k = parseInt(g.TrackNum, 10);
            k = isNaN(k) ? 0 : k;
            if (n[k])n[k].push(g); else n[k] = [g];
            k = this._reduceTitle(g);
            if (h.hasOwnProperty(k))h[k].push(g); else h[k] = [g]
        }
        for (f = 1; f < n.length; f++) {
            d = n[f];
            if (g = this._pickBestSong(d, q, s, false)) {
                k = this._reduceTitle(g);
                if (s[k]) {
                    h = s[k];
                    if (q[h.SongID] || !q[g.SongID]) {
                        if (g = this._pickBestSong(d, q, s, true)) {
                            g.IsVerified = 1;
                            k = this._reduceTitle(g);
                            s[k] = g
                        }
                    } else {
                        h.IsVerified = 0;
                        g.IsVerified = 1;
                        s[k] = g;
                        if (g = this._pickBestSong(n[h.TrackNum],
                                q, s, true)) {
                            g.IsVerified = 1;
                            s[this._reduceTitle(g)] = g
                        }
                    }
                } else {
                    this.hasVerified = true;
                    g.IsVerified = 1;
                    s[k] = g
                }
            }
        }
        this.songs = m;
        this.songsLoaded = true;
        if (c.isFunction(b))a ? b(this._wrapManySongs(GS.Models.Album.filterVerified(m))) : b(this._wrapManySongs(m));
        return m
    }, _cleanTitleForReduce:/\s|\-|\:|\(|\)|\[|\]/g, _reduceTitle:function (a) {
        var b;
        if (a.SongName) {
            b = a.SongName.toLowerCase();
            a = b.replace(a.ArtistName.toLowerCase(), "").replace(this._cleanTitleForReduce, "");
            b = a.length ? a : b.replace(this._cleanTitleForReduce,
                    "")
        } else b = "";
        return b
    }, _isGrossTitle:/\(|\)|\[|\]|live|feat|\sft|remix|demo/i, _pickBestSong:function (a, b, d, f) {
        var g;
        if (!c.isArray(a) || a.length === 0)return false;
        if (a.length === 1) {
            b = a[0];
            g = this._reduceTitle(b);
            if (f && d[g])return false;
            return b
        }
        var k = this;
        a = a.sort(function (h, n) {
            if (h.IsVerified !== n.IsVerified)return n.IsVerified - h.IsVerified;
            var q = k._isGrossTitle.test(h.SongName), s = k._isGrossTitle.test(n.SongName);
            if (q === s)return 0;
            return q && !s ? 1 : -1
        });
        for (var m = 0; m < a.length; m++) {
            b = a[m];
            g = this._reduceTitle(b);
            if (!d[g])return b
        }
        return f ? false : a[0]
    }, _wrapManySongs:function (a) {
        return this.wrapSongCollection(a, {IsVerified:0, TrackNum:0, AlbumName:this.AlbumName, AlbumID:this.AlbumID, CoverArtFilename:this.CoverArtFilename, Popularity:"0"})
    }, play:function (a, b, d, f) {
        _.orEqual(f, true);
        this.getSongs(this.callback("playSongs", {index:a, playOnAdd:b, sort:"TrackNum", numericSort:true, verified:f, shuffle:d}))
    }, validate:function () {
        if (this.AlbumID > 0 && this.ArtistID > 0)return true;
        return false
    }, init:function (a) {
        this._super(a);
        this.AlbumName =
                _.cleanText(_.orEqual(a.AlbumName, a.Name) || "Unknown Album");
        if (!this.isFilterAll)this.ArtistName = _.cleanText(a.ArtistName || "Unknown Artist");
        this.fanbase = false;
        this.songs = {};
        this.songsUnverifiedLoaded = this.songsLoaded = false;
        this.searchText = [this.AlbumName, this.ArtistName].join(" ").toLowerCase()
    }, getDetailsForFeeds:function () {
        return{albumID:this.AlbumID, albumName:_.uncleanText(this.AlbumName), artistID:this.ArtistID, artistName:_.uncleanText(this.ArtistName), artFilename:this.ArtFilename}
    }, toUrl:function (a) {
        return this.PathName ?
                _.makeUrlFromPathName(this.PathName, a) : _.cleanUrl(this.AlbumName, this.AlbumID, "album", null, a)
    }, toArtistUrl:function (a) {
        return _.cleanUrl(this.ArtistName, this.ArtistID, "artist", null, a)
    }, _onPathNameSuccess:function (a, b) {
        if (b.name)this.PathName = b.name; else {
            this.PathName = "";
            this.PathNameEmpty = true
        }
        c.isFunction(a) && a(this.PathName)
    }, _onPathNameFailed:function (a) {
        this.PathName = "";
        this.PathNameEmpty = true;
        c.isFunction(a) && a(this.PathName)
    }, getImageURL:function (a) {
        a = _.orEqual(a, 70);
        var b = GS.Models.Album.artPath +
                a + "_album.png";
        if (this.CoverArtFilename && this.CoverArtFilename.indexOf("default") == -1)return GS.Models.Album.artPath + a + "_" + this.CoverArtFilename;
        return b
    }, getTitle:function () {
        return['"', this.AlbumName, '" by ', this.ArtistName].join("")
    }, getContextMenu:function () {
        new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_ALBUM, this);
        var a = [
            {title:c.localize.getString("CONTEXT_PLAY_ALBUM"), action:{type:"fn", callback:this.callback(function () {
                this.play(GS.player.INDEX_DEFAULT, true)
            })}, customClass:"jj_menu_item_hasIcon jj_menu_item_play"},
            {title:c.localize.getString("CONTEXT_PLAY_ALBUM_NEXT"), action:{type:"fn", callback:this.callback(function () {
                this.play(GS.player.INDEX_NEXT, false)
            })}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_next"},
            {title:c.localize.getString("CONTEXT_PLAY_ALBUM_LAST"), action:{type:"fn", callback:this.callback(function () {
                this.play(GS.player.INDEX_LAST, false)
            })}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_last"},
            {customClass:"separator"},
            {title:c.localize.getString("CONTEXT_REPLACE_ALL_SONGS"), action:{type:"fn",
                callback:this.callback(function () {
                    this.play(GS.player.INDEX_REPLACE, GS.player.isPlaying)
                })}, customClass:"jj_menu_item_hasIcon jj_menu_item_replace_playlist"},
            {customClass:"separator"}
        ];
        a = a.concat([
            {title:c.localize.getString("SHARE_ALBUM"), customClass:"jj_menu_item_hasIcon jj_menu_item_share", action:{type:"fn", callback:this.callback(function () {
                GS.getLightbox().open("share", {type:"album", id:this.AlbumID})
            })}},
            {customClass:"separator"}
        ]);
        GS.user.getIsShortcut("album", this.AlbumID) ? a.push({title:c.localize.getString("CONTEXT_REMOVE_FROM_PINBOARD"),
            customClass:"last jj_menu_item_hasIcon jj_menu_item_remove_pinboard", action:{type:"fn", callback:this.callback(function () {
                GS.user.removeFromShortcuts("album", this.AlbumID)
            })}}) : a.push({title:c.localize.getString("CONTEXT_ADD_TO_PINBOARD"), customClass:"last jj_menu_item_hasIcon jj_menu_item_pinboard", action:{type:"fn", callback:this.callback(function () {
            GS.user.addToShortcuts("album", this.AlbumID, this.AlbumName)
        })}});
        return a
    }, toProxyLabel:function () {
        return _.getString(this.ArtistName ? "SELECTION_ALBUM_SINGLE" :
                "SELECTION_ALBUM_SINGLE_NO_ARTIST", {AlbumName:_.cleanText(this.AlbumName), ArtistName:_.cleanText(this.ArtistName)})
    }, toString:function (a) {
        a = _.orEqual(a, false);
        var b = this.ArtistName ? "SELECTION_ALBUM_SINGLE" : "SELECTION_ALBUM_SINGLE_NO_ARTIST";
        return a ? ["Album. alid: ", this.AlbumID, ", alname:", this.AlbumName, ", aid:", this.ArtistID, ", arname: ", this.ArtistName, ", verified: ", this.IsVerified].join("") : _.getString(b, {AlbumName:_.cleanText(this.AlbumName), ArtistName:_.cleanText(this.ArtistName)})
    }})
})(jQuery);

