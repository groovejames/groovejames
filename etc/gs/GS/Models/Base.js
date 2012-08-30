$.Model.extend("GS.Models.Base",
{
	cache:{},
	getOneFromCache:function (c, a) {
	    return this.addLibraryFavoriteFlags(this.cache[_.orEqual(a, "") + c])
	},
	addLibraryFavoriteFlags:function (c) {
	    var a = this.shortName.toLowerCase() + "s";
	    if (c && GS.user) {
		var b = c[c.Class.id];
		if (GS.user.favorites[a])c.isFavorite = _.defined(GS.user.favorites[a][b]) ? 1 : 0;
		if (a == "songs" && GS.user.library.songs)c.fromLibrary = _.defined(GS.user.library.songs[b]) ? 1 : 0
	    }
	    return c
	},
	getManyFromCache:function (c, a) {
	    for (var b = [], d = 0, f = c.length; d < f; d++)b.push(this.getOneFromCache(c[d],
		    a));
	    return b
	},
	wrap:function (c, a, b) {
	    var d = this.id, f = c[d];
	    a = _.orEqual(a, true);
	    b = _.orEqual(b, "");
	    if (f && a)if (f = this.getOneFromCache(f, b))return f;
	    c = this.addLibraryFavoriteFlags(this._super(c));
	    if (a && c[d]) {
		this.cache[b + c[d]] = c;
		c.cachePrefix = b
	    }
	    return c
	},
	wrapCollection:function (c, a, b, d, f, g) {
	    var k, m, h = [], n, q;
	    a = _.orEqual(a, null);
	    b = _.orEqual(b, false);
	    d = _.orEqual(d, false);
	    f = _.orEqual(f, true);
	    g = _.orEqual(g, "");
	    for (k in c)if (c.hasOwnProperty(k)) {
		n = c[k];
		q = this.wrap(n, f, g).dupe();
		if (b)for (m in n) {
		    if (n.hasOwnProperty(m))q[m] =
			    n[m]
		} else if (a)for (m in a)if (a.hasOwnProperty(m))if (m === "USE_INDEX")q[a[m]] = parseInt(k, 10) + 1; else q[m] = _.orEqual(n[m], a[m]);
		if (!d || !$.isFunction(q.validate) || q.validate())h.push(q)
	    }
	    h._use_call = true;
	    return h
	},
	wrapCollectionInObject:function (c, a, b, d, f, g) {
	    var k, m, h, n, q;
	    k = {};
	    a = _.orEqual(a, null);
	    b = _.orEqual(b, false);
	    d = _.orEqual(d, false);
	    f = _.orEqual(f, true);
	    g = _.orEqual(g, "");
	    for (m in c)if (c.hasOwnProperty(m)) {
		n = c[m];
		(q = this.getOneFromCache(n[this.id], g)) || (q = this.wrap(n, f, g).dupe());
		if (b)for (h in n) {
		    if (n.hasOwnProperty(h))q[h] =
			    n[h]
		} else if (a)for (h in a)if (a.hasOwnProperty(h))q[h] = _.orEqual(n[h], a[h]);
		if (!d || !$.isFunction(q.validate) || q.validate())k[n[this.id]] = q
	    }
	    return k
	}
},

{
	songs:{},
	albums:{},
	cachePrefix:"",
	dupe:function () {
	    return new this.Class(this.attrs())
	},
	wrapSongCollection:function (c, a, b) {
	    a = GS.Models.Song.wrapCollection(c.Songs || c.songs || c.result || c, a, b, true);
	    for (b = 0; b < a.length; b++) {
		this.songs[a[b].SongID] = a[b];
		if (a[b].AlbumName && a[b].AlbumName.length) {
		    if (this.albums[a[b].AlbumID]) {
		        if (this.albums[a[b].AlbumID].ArtistName !=
		                a[b].ArtistName)this.albums[a[b].AlbumID].ArtistName = "Various Artists"
		    } else {
		        album = GS.Models.Album.wrap({AlbumName:a[b].AlbumName, AlbumID:a[b].AlbumID, ArtistName:a[b].ArtistName, ArtistID:a[b].ArtistID, CoverArtFilename:a[b].CoverArtFilename, IsVerified:a[b].IsVerified}, true, "s_");
		        this.albums[a[b].AlbumID] = album
		    }
		    this.albums[a[b].AlbumID].songs[a[b].SongID] = a[b]
		}
	    }
	    if (c && c.hasMore)this.currentPage++; else this.songsLoaded = true;
	    return a
	}, 
	playSongs:function (c) {
	    var a = _.orEqual(c.index, -1), b = _.orEqual(c.playOnAdd,
		    false), d = _.orEqual(c.shuffle, false), f = _.orEqual(c.sort, false), g = _.orEqual(c.numericSort, false), k = new GS.Models.PlayContext((this.shortName || "").toLowerCase(), this);
	    c.verified && _.isEmpty(this.songs) && this.getSongs(this.callback("playSongs", {index:a, playOnAdd:b, sort:"TrackNum", numericSort:true, verified:false}), null, false);
	    a = [];
	    var m = [];
	    _.forEach(this.songs, function (h) {
		m.push(h)
	    });
	    if (d)m = m.shuffle(); else if (f)m = m.sort(function (h, n) {
		if (h.hasOwnProperty(f) && n.hasOwnProperty(f)) {
		    var q = h[f], s = n[f];
		    if (g) {
		        q =
		                parseFloat(q, 10);
		        if (isNaN(q))q = 0;
		        s = parseFloat(s, 10);
		        if (isNaN(s))s = 0;
		        return q - s
		    }
		    if (q > s)return 1; else if (q < s)return-1;
		    return 0
		} else if (h.hasOwnProperty(f))return 1;
		return 0
	    });
	    for (d = 0; d < m.length; d++)a.push(m[d].SongID);
	    GS.player.addSongsToQueueAt(a, c.index, c.playOnAdd, k)
	}, 
	getClipboardAction:function (c, a) {
	    if (!window.contextMenuClipboards)window.contextMenuClipboards = [];
	    return this.callback(function () {
		if (ZeroClipboard && c) {
		    var b = $("div[id^=jjmenu_main_sub]");
		    $.each(c, function (d, f) {
		        var g = $(f.selector, b);
		        if (window.contextMenuClipboards[d])window.contextMenuClipboards[d].reposition(g.get(0)); else {
		            window.contextMenuClipboards[d] = new ZeroClipboard.Client(g.get(0));
		            window.contextMenuClipboards[d].addEventListener("complete", function (k, m) {
		                console.log("copied: ", m);
		                $("div[id^=jjmenu]").remove();
		                var h = $("#grid").controller();
		                if (h) {
		                    var n = GS.getGuts().extractSongItemInfo(h);
		                    if (n) {
		                        var q = m.substr(7).split("/");
		                        n = GS.getGuts().extractSongItemInfo(h);
		                        if (q[1] == "album")GS.getGuts().onContextMenuClick("contextCopyAlbumURL",
		                                a, false, n); else if (q[1] == "artist")GS.getGuts().onContextMenuClick("contextCopyArtistURL", a, false, n); else if (q[1] == "song" || q[1] == "s")GS.getGuts().onContextMenuClick("contextCopySongURL", a, false, n)
		                    }
		                }
		            })
		        }
		        window.contextMenuClipboards[d].setText(f.text);
		        g.bind("remove", function () {
		            try {
		                $.each(window.contextMenuClipboards, function (m, h) {
		                    h.hide()
		                })
		            } catch (k) {
		            }
		        })
		    })
		}
	    })
	}
});


