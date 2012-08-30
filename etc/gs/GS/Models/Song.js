(function (c) {
    GS.Models.Base.extend("GS.Models.Song", {
    id:"SongID", cache:{}, artPath:"http://images.grooveshark.com/static/albums/", defaults:{AlbumID:null, AlbumName:"", ArtistID:null, ArtistName:"", CoverArtFilename:"", EstimateDuration:0, Flags:0, IsLowBitrateAvailable:0, Popularity:"0", SongID:null, SongName:"", TrackNum:"0", Year:"0", isDeleted:false, fromLibrary:0, isFavorite:0, IsVerified:0, TSAdded:"", TSFavorited:"", _token:null, tokenFailed:false}, songsLoaded:false, songsUnverifiedLoaded:false, getSong:function (a, b, d, f) {
        var g = this.getOneFromCache(a);
        f = _.orEqual(f, {});
        if (g)c.isFunction(b) && b(g); else GS.service.getQueueSongListFromSongIDs([a], this.callback(["wrapSingleSongFromIDs", b]), d, f)
    }, getOneSynchronous:function (a) {
        var b = this.getOneFromCache(a);
        if (b)return b; else {
            GS.service.getQueueSongListFromSongIDs([a], this.callback(this.wrapSingleSongFromIDs), null, {async:false});
            return this.getOneFromCache(a)
        }
    }, getSongFromToken:function (a, b, d) {
        var f = this.getOneFromCache(a);
        f ? b(f) : GS.service.getSongFromToken(a, this.callback("wrapSongFromToken",
                a, b), d)
    }, getVerifiedDivider:function () {
        var a = this.wrap({SongID:-1, SongName:"", ArtistName:"", ArtistID:0, AlbumName:"", AlbumID:0, CoverArtFilename:""}, false);
        a.IsVerified = 0.5;
        return a
    }, wrap:function (a, b, d) {
        a = _.orEqual(a, {});
        var f = _.orEqualEx(a.TrackNum, a.trackNum, "0").toString();
        a = this._super({AlbumID:_.orEqualEx(a.AlbumID, a.albumID, 0), AlbumName:_.cleanText(_.orEqual(a.AlbumName, a.albumName)) || "Unknown Album", ArtistID:_.orEqualEx(a.ArtistID, a.artistID, 0), ArtistName:_.cleanText(_.orEqual(a.ArtistName,
                a.artistName)) || "Unknown Artist", CoverArtFilename:_.orEqualEx(a.CoverArtFilename, a.artFilename, ""), EstimateDuration:_.orEqualEx(a.EstimateDuration, a.estimateDuration, 0), Flags:_.orEqualEx(a.Flags, a.flags, 0), IsLowBitrateAvailable:_.orEqualEx(a.IsLowBitrateAvailable, 0), SongID:_.orEqualEx(a.SongID, a.songID, 0), SongName:_.cleanText(_.orEqualEx(a.SongName, a.songName, a.Name)) || "Unknown Title", TrackNum:f, Year:_.cleanText(_.orEqualEx(a.Year, a.year, "0")), Popularity:_.orEqualEx(a.Popularity, a.popularity, 0), IsVerified:_.orEqual(parseFloat(a.IsVerified,
                10), 0), _token:_.orEqualEx(a._token, null)}, b, d);
        if (a.TrackNum !== f && f !== "0")a.TrackNum = f;
        if (a.CoverArtFilename == "default.png")a.CoverArtFilename = null;
        return a
    }, wrapQueue:function (a) {
        return this.wrapCollection(a, {Flags:0, EstimateDuration:0, autoplayVote:0, parentQueueID:0, queueSongID:0, source:"", index:-1, context:null, sponsoredAutoplayID:0}, false, true, true)
    }, wrapSingleSongFromIDs:function (a) {
        a = this.wrapCollection(a);
        if (a.length)return a[0]
    }, wrapSongFromToken:function (a, b, d) {
        if (c.isArray(d))d = {};
        d = this.wrap(d);
        d.validate() && d.checkToken({Token:a});
        c.isFunction(b) && b(d);
        return d
    }, archive:function (a) {
        return{A:a.AlbumID, B:a.AlbumName, C:a.ArtistID, D:a.ArtistName, E:a.CoverArtFilename, F:a.EstimateDuration, G:a.Flags, H:a.Popularity, I:a.SongID, J:a.SongName, K:a.TSAdded, L:a.TrackNum, M:a.Year, N:a.isFavorite}
    }, unarchive:function (a) {
        return{AlbumID:a.A, AlbumName:a.B, ArtistID:a.C, ArtistName:a.D, CoverArtFilename:a.E, EstimateDuration:a.F, Flags:a.G, Popularity:a.H, SongID:a.I, SongName:a.J, TSAdded:a.K, TrackNum:isNaN(a.L) ? "0" :
                a.L, Year:isNaN(a.M) ? "0" : a.M, isFavorite:a.N}
    }, itemRenderer:function (a) {
        var b = "" + ('<a class="name ellipsis" href="' + a.toUrl() + '">' + a.SongName + "</a>");
        ['<a href="', a.toUrl(), '">', a.SongName, "</a>"].join("");
        var d = ['<a href="', a.toArtistUrl(), '">', a.ArtistName, "</a>"].join("");
        d = c("<span></span>").localeDataString("BY_ARTIST", {artist:d});
        var f = ['<img width="70" height="70" src="', a.getImageURL(70), '"/>'].join("");
        return['<a href="', a.toUrl(), '" class="albumImage">', f, '<span class="playBtn" data-albumid="',
            a.AlbumID, '"></span></a><div class="meta">', b, '<span class="by">', d.render(), "</span></div>"].join("")
    }, matchFilter:function (a, b) {
        b = _.orEqual(b, false);
        var d;
        if (b) {
            d = RegExp("^" + a, "i");
            return function (f) {
                f.SongName.match(d)
            }
        } else {
            d = RegExp(a, "gi");
            return function (f) {
                return f.SongName.match(d) || f.ArtistName.match(d) || f.AlbumName.match(d)
            }
        }
    }
    },
    {
        validate:function () {
            if (this.SongID > 0 && this.ArtistID > 0 && this.AlbumID > 0)return true;
            return false
        }, init:function (a) {
            if (a) {
                this._super(a);
                this.SongName = _.orEqual(a.SongName,
                        a.Name) || "Unknown Title";
                this.AlbumName = a.AlbumName || "Unknown Album";
                this.ArtistName = a.ArtistName || "Unknown Artist";
                this.searchText = [this.SongName, this.ArtistName, this.AlbumName].join(" ").toLowerCase();
                this.fanbase = false;
                this.songs = {};
                delete this.Name
            }
        }, toUrl:function (a) {
            if (this._token)return _.cleanUrl(this.SongName, this.SongID, "s", this._token, a); else if (this.tokenFailed)return _.generate404(); else {
                this.getToken();
                return this._token ? _.cleanUrl(this.SongName, this.SongID, "s", this._token, a) : _.generate404()
            }
        },
        toArtistUrl:function (a) {
            return _.cleanUrl(this.ArtistName, this.ArtistID, "artist", null, a)
        }, toAlbumUrl:function (a) {
            return _.cleanUrl(this.AlbumName, this.AlbumID, "album", null, a)
        }, getToken:function () {
            if (this._token)return this._token; else if (this.tokenFailed)return null; else {
                GS.service.getTokenForSong(this.SongID, this.callback(this.checkToken), this.callback(this.tokenCallFail), {async:false});
                return this._token
            }
        }, checkToken:function (a) {
            if (a.Token) {
                this._token = a.Token;
                GS.Models.Song.cache[this._token] =
                        this;
                GS.Models.Song.getOneFromCache(this.SongID)._token = this._token
            } else this.tokenFailed = true
        }, tokenCallFail:function () {
            this._token = null
        }, getImageURL:function (a) {
            a = _.orEqual(a, 70);
            var b = GS.Models.Song.artPath + a + "_album.png";
            if (this.CoverArtFilename && this.CoverArtFilename.indexOf("default") == -1)b = GS.Models.Song.artPath + a + "_" + this.CoverArtFilename;
            return b
        }, getDetailsForFeeds:function () {
            return{songID:this.SongID, songName:_.uncleanText(this.SongName), albumID:this.AlbumID, albumName:_.uncleanText(this.AlbumName),
                artistID:this.ArtistID, artistName:_.uncleanText(this.ArtistName), artFilename:this.CoverArtFilename, track:this.TrackNum, isDeleted:this.isDeleted}
        }, getRelatedSongs:function (a, b, d) {
            d = _.orEqual(d, true);
            this.album ? this.album.getSongs(a, b, d) : GS.Models.Album.getAlbum(this.AlbumID, this.callback(function (f) {
                this.album = f;
                f.getSongs(a, b, d)
            }), b, false)
        }, getAffiliateDownloadURLs:function (a) {
            var b;
            if (_.isEmpty(this.affiliateDownloadURLs))b = this; else return this.affiliateDownloadURLs;
            var d = [];
            GS.service.getAffiliateDownloadURLs(this.SongName,
                    this.ArtistName, function (f) {
                        c.each(f, function (g, k) {
                            if (g === "amazon")g = "Amazon";
                            d.push({name:g, url:k.url})
                        });
                        b.affiliateDownloadURLs = d;
                        a(b.affiliateDownloadURLs)
                    }, function () {
                        a({})
                    })
        }, getContextMenu:function (a) {
            a = _.orEqual(a, {});
            var b;
            if (a)b = _.orEqual(a.menuType, "");
            var d = GS.getGuts().extractSongItemInfo(a.gridController), f = [], g = {menuType:b, multiClick:false, gridController:a.gridController};
            GS.user.library.songs[this.SongID] ? f.push({title:c.localize.getString("CONTEXT_REMOVE_FROM_LIBRARY"), customClass:"last jj_menu_item_hasIcon jj_menu_item_remove_music",
                action:{type:"fn", callback:this.callback(function () {
                    GS.user.removeFromLibrary(this.SongID)
                }), log:this.callback(function () {
                    GS.getGuts().onContextMenuClick("contextRemoveFromLibrary", b, false, d)
                })}}) : f.push({title:c.localize.getString("CONTEXT_ADD_TO_LIBRARY"), customClass:"last jj_menu_item_hasIcon jj_menu_item_music", action:{type:"fn", callback:this.callback(function () {
                GS.user.addToLibrary(this.SongID)
            }), log:this.callback(function () {
                GS.getGuts().onContextMenuClick("contextAddToLibrary", b, false, d)
            })}});
            GS.user.favorites.songs[this.SongID] ? f.push({title:c.localize.getString("CONTEXT_REMOVE_FROM_FAVORITES"), customClass:"last jj_menu_item_hasIcon jj_menu_item_remove_favorite", action:{type:"fn", callback:this.callback(function () {
                GS.user.removeFromSongFavorites(this.SongID)
            }), log:this.callback(function () {
                GS.getGuts().onContextMenuClick("contextRemoveFromFavorites", b, false, d)
            })}}) : f.push({title:c.localize.getString("CONTEXT_ADD_TO_FAVORITES"), customClass:"last jj_menu_item_hasIcon jj_menu_item_favorites",
                action:{type:"fn", callback:this.callback(function () {
                    GS.user.addToSongFavorites(this.SongID)
                }), log:this.callback(function () {
                    GS.getGuts().onContextMenuClick("contextAddToFavorites", b, false, d)
                })}});
            GS.user.getIsShortcut("song", this.SongID) ? f.push({title:c.localize.getString("CONTEXT_REMOVE_FROM_PINBOARD"), customClass:"last jj_menu_item_hasIcon jj_menu_item_remove_music", action:{type:"fn", callback:this.callback(function () {
                GS.user.removeFromShortcuts("song", this.SongID)
            }), log:this.callback(function () {
                GS.getGuts().onContextMenuClick("contextRemoveFromPinboard",
                        b, false, d)
            })}}) : f.push({title:c.localize.getString("CONTEXT_ADD_TO_PINBOARD"), customClass:"last jj_menu_item_hasIcon jj_menu_item_pinboard", action:{type:"fn", callback:this.callback(function () {
                GS.user.addToShortcuts("song", this.SongID, this.SongName)
            }), log:this.callback(function () {
                GS.getGuts().onContextMenuClick("contextAddToPinboard", b, false, d)
            })}});
            f.push({customClass:"separator"});
            if (_.isEmpty(GS.user.playlists))f.push({title:c.localize.getString("CONTEXT_NEW_PLAYLIST"), customClass:"jj_menu_item_hasIcon jj_menu_item_new_playlist",
                action:{type:"fn", callback:this.callback(function () {
                    GS.getLightbox().open("newPlaylist", this.SongID)
                })}}); else {
                f.push({title:c.localize.getString("CONTEXT_ADD_TO_PLAYLIST"), type:"sub", customClass:"jj_menu_item_hasIcon jj_menu_item_playlists", src:GS.Models.Playlist.getPlaylistsMenu(this.SongID, this.callback(function (k) {
                    k.addSongs([this.SongID], -1, true)
                }), null, null, g)});
                !a.isQueue && GS.page.activePage && GS.page.activePage.playlist && GS.page.activePage.playlist.songs && f.push({title:c.localize.getString("CONTEXT_REMOVE_FROM_PLAYLIST"),
                    customClass:"jj_menu_item_hasIcon jj_menu_item_remove_music", action:{type:"fn", callback:this.callback(function () {
                        var k = a.gridController, m = [], h = GS.page.activePage.playlist;
                        if (k && k.selectedRowIDs.length > 0)for (var n = 0; n < k.selectedRowIDs.length; n++) {
                            var q = h.gridKeyLookup[k.selectedRowIDs[n]];
                            q && m.push(h.songs.indexOf(q))
                        }
                        m.length && h.removeSongs(m)
                    })}})
            }
            f.push({customClass:"separator"});
            f = f.concat([
                {title:c.localize.getString("CONTEXT_SHARE_SONG"), customClass:"jj_menu_item_hasIcon jj_menu_item_share",
                    action:{type:"fn", callback:this.callback(function () {
                        GS.getLightbox().open("share", {type:"song", id:this.SongID});
                        GS.getGuts().onContextMenuClick("contextShareSong", b, false, d)
                    })}},
                {title:c.localize.getString("COPY_URL"), type:"sub", action:{type:"fn", callback:this.callback(function () {
                    this.getClipboardAction([
                        {text:"http://grooveshark.com/" + this.toUrl().replace("#!/", ""), selector:"div.songUrl"},
                        {text:"http://grooveshark.com/" + _.cleanUrl(this.AlbumName, this.AlbumID, "album").replace("#!/", ""), selector:"div.albumUrl"},
                        {text:"http://grooveshark.com/" + _.cleanUrl(this.ArtistName, this.ArtistID, "artist").replace("#!/", ""), selector:"div.artistUrl"}
                    ], b)();
                    c("div[name$=Url]", elem).show()
                })}, customClass:"last copyUrl jj_menu_item_hasIcon jj_menu_item_copy", src:[
                    {title:c.localize.getString("SONG_URL"), customClass:"songUrl jj_menu_item_hasIcon jj_menu_item_copy"},
                    {title:c.localize.getString("ALBUM_URL"), customClass:"albumUrl jj_menu_item_hasIcon jj_menu_item_copy"},
                    {title:c.localize.getString("ARTIST_URL"), customClass:" artistUrl jj_menu_item_hasIcon jj_menu_item_copy"}
                ]},
                {customClass:"separator"},
                {title:c.localize.getString("CONTEXT_BUY_SONG"), customClass:"last jj_menu_item_hasIcon jj_menu_item_download", action:{type:"fn", callback:this.callback(function () {
                    GS.getLightbox().open("buySong", this.SongID)
                }), log:this.callback(function () {
                    GS.getGuts().onContextMenuClick("contextBuySong", b, false, d)
                })}}
            ]);
            a.isQueue = _.orEqual(a.isQueue, false);
            if (a.isQueue) {
                f.push({customClass:"separator"}, {title:c.localize.getString("CONTEXT_FLAG_SONG"), customClass:"last jj_menu_item_hasIcon jj_menu_item_flag",
                    type:"sub", src:[
                        {title:c.localize.getString("CONTEXT_FLAG_BAD_SONG"), customClass:"last jj_menu_item_hasIcon jj_menu_item_flag", action:{type:"fn", callback:function () {
                            a.flagSongCallback(1)
                        }}},
                        {title:c.localize.getString("CONTEXT_FLAG_BAD_METADATA"), customClass:"last jj_menu_item_hasIcon jj_menu_item_flag", action:{type:"fn", callback:function () {
                            a.flagSongCallback(4)
                        }}}
                    ]});
                (g = GS.player.getCurrentQueue()) && g.autoplayEnabled && f.push({customClass:"separator"}, {title:c.localize.getString("QUEUE_ITEM_SMILE"),
                    customClass:"last jj_menu_item_hasIcon jj_menu_item_smile", action:{type:"fn", callback:function () {
                        a.voteSongCallback(1)
                    }}}, {title:c.localize.getString("QUEUE_ITEM_FROWN"), customClass:"last jj_menu_item_hasIcon jj_menu_item_frown", action:{type:"fn", callback:function () {
                    a.voteSongCallback(-1)
                }}})
            }
            return f
        }, getTitle:function () {
            return['"', this.SongName, '" by ', this.ArtistName, ' on "', this.AlbumName, '"'].join("")
        }, getVideos:function (a, b, d) {
            d = _.orEqual(d, 5);
            GS.getYoutube().search("", d, this.callback(function (f) {
                var g =
                        [];
                if (f && f[0] && f[0].VideoID) {
                    for (var k = 0; k < f.length; k++) {
                        f[k].title = this.ArtistName + " - " + this.SongName;
                        g.push(f[k])
                    }
                    a(g)
                } else {
                    console.warn("bad youtube search items", f);
                    b([])
                }
            }), b, this)
        }, toProxyLabel:function () {
            return _.getString("SELECTION_SONG_SINGLE", {SongName:_.cleanText(this.SongName), ArtistName:_.cleanText(this.ArtistName)})
        }, toString:function (a) {
            return(a = _.orEqual(a, false)) ? ["Song. sid:", this.SongID, ", name:", this.SongName, ", aid:", this.ArtistID, ", arname: ", this.ArtistName, ", alid: ", this.AlbumID,
                ", alname:", this.AlbumName, ", track: ", this.TrackNum, ", verified: ", this.IsVerified].join("") : _.getString("SELECTION_SONG_SINGLE", {SongName:_.cleanText(this.SongName), ArtistName:_.cleanText(this.ArtistName)})
        }})
})(jQuery);

