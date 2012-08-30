(function (c) {
    GS.Models.Base.extend("GS.Models.Playlist",
    {
        SAVE_DELAY:1E3, 
        id:"PlaylistID", 
        cache:{}, 
        artPath:"http://images.grooveshark.com/static/playlists/", 
        defaults:{PlaylistID:0, PlaylistName:"", UserID:0, Username:"", UserName:"", FName:"", LName:"", Description:"", NumSongs:0, Picture:"", Sort:null, Collaborative:false, Collaborators:null, isFavorite:0, songs:[], originalOrder:[], songsLoaded:false, hasUnsavedChanges:false, searchText:"", fanbase:null, gridKey:1, gridKeyLookup:{}, songIDLookup:{}, changeLog:[], isDeleted:false},

        playlistsLoaded:false, playlistIDs:[], getPlaylist:function (a, b, d) {
            var f = this.getOneFromCache(a);
            if (f)c.isFunction(b) && b(f); else GS.service.getPlaylistByID(a, this.callback(["wrap", b]), d, {async:false})
        }, getOneSynchronous:function (a) {
            var b = this.getOneFromCache(a);
            if (b)return b; else {
                GS.service.getPlaylistByID(a, this.callback(this.wrap), null, {async:false});
                return this.getOneFromCache(a)
            }
        }, getPlaylistsOrdered:function (a, b, d) {
            b = _.orEqual(b, false);
            d = _.orEqual(d, false);
            a = _.orEqual(a, "PlaylistName");
            d = b === false ?
                    d ? GS.user.collabPlaylists : GS.user.playlists : GS.user.favorites.playlists;
            var f = [];
            if (d) {
                c.each(d, function (g, k) {
                    var m = GS.Models.Playlist.getOneFromCache(k.PlaylistID);
                    if (m)k = m;
                    if (b)k.TSAdded = k.TSFavorited;
                    f.push(k)
                });
                f.sort(function (g, k) {
                    var m, h;
                    try {
                        m = g[a].toString().toLowerCase();
                        h = k[a].toString().toLowerCase()
                    } catch (n) {
                        console.warn("playlistOrdered error: " + n, a, g[a], k[a]);
                        return 0
                    }
                    return m == h ? 0 : m > h ? 1 : -1
                })
            }
            return f
        }, getPlaylistsMenu:function (a, b, d, f, g) {
            a = c.makeArray(a);
            var k = "", m = "", h = null;
            if (g) {
                k =
                        g.menuType;
                m = g.multiClick;
                h = g.gridController
            }
            var n = {};
            n = m ? GS.getGuts().extractMultiSongInfo(h, a) : GS.getGuts().extractSongItemInfo(h);
            d = _.orEqual(d, false);
            f = _.orEqual(f, true);
            var q;
            q = [];
            if (f) {
                q.push({title:c.localize.getString("CONTEXT_NEW_PLAYLIST"), customClass:"jj_menu_item_hasIcon jj_menu_item_new_playlist", action:{type:"fn", callback:function () {
                    GS.getLightbox().open("newPlaylist", a)
                }, log:function () {
                    GS.getGuts().onContextMenuClick("contextNewPlaylist", k, m, n)
                }}});
                _.isEmpty(GS.user.playlists) || q.push({customClass:"separator"})
            }
            var s =
                    false;
            c.each(this.getPlaylistsOrdered("PlaylistName"), function (w, o) {
                q.push({title:o.PlaylistName, customClass:"jj_menu_item_hasIcon jj_menu_item_playlist", action:{type:"fn", callback:function () {
                    b(o);
                    return true
                }, log:function () {
                    GS.getGuts().onContextMenuClick("contextAddToExistingPlaylist", k, m, n, o.PlaylistID)
                }}});
                s = true
            });
            f = this.getPlaylistsOrdered("PlaylistName", false, true);
            s && f.length && q.push({customClass:"separator"});
            c.each(f, function (w, o) {
                o.UserID != GS.user.UserID && q.push({title:o.PlaylistName, customClass:"jj_menu_item_hasIcon jj_menu_item_playlist",
                    action:{type:"fn", callback:function () {
                        b(o);
                        return true
                    }, log:function () {
                        GS.getGuts().onContextMenuClick("contextAddToExistingPlaylist", k, m, n, o.PlaylistID)
                    }}})
            });
            d && c.each(this.getPlaylistsOrdered("PlaylistName", true), function (w, o) {
                q.push({title:o.PlaylistName, customClass:"jj_menu_item_hasIcon jj_menu_item_playlist_subscribed", action:{type:"fn", callback:function () {
                    b(o)
                }}})
            });
            return q
        }, itemRenderer:function (a) {
            var b = "", d = "PLAYLIST_SUBSCRIBE";
            if (a.isFavorite) {
                b = "subscribed";
                d = "PLAYLIST_UNSUBSCRIBE"
            }
            var f =
                    ['<a href="', a.toUserUrl(), '">', a.UserName, "</a>"].join("");
            f = c("<span></span>").localeDataString("BY_ARTIST", {artist:f});
            var g = ['<span class="lineHeight"><a class="name ellipsis" href="', a.toUrl(), '">' + a.PlaylistName + "</a></span>"].join(""), k = ['<a href="', a.toUrl(), '"class="playlistImage insetBorder height70"><img width="70" height="70" src="', a.getImageURL(), '"/></a>'].join("");
            a = a.UserID === GS.user.UserID ? "" : ['<button class="btn button_style2 ', b, '" data-follow-userid="', a.UserID, '" ><div><span class="label" data-translate-text="',
                d, '">', c.localize.getString(d), "</span></div></button>"].join("");
            return[k, '<div class="meta">', g, '<span class="ellipsis by">', f.render(), "</span>", a, "</div>"].join("")
        }, exploreItemRenderer:function (a) {
            var b = "" + ('<a class="name ellipsis" href="' + a.toUrl() + '">' + a.PlaylistName + "</a>"), d;
            d = a.uri && a.uri.length > 6 && a.uri !== "" ? a.uri.indexOf("grooveshark.com") == -1 ? _.printf("BY_USER", {user:'<a href="' + a.uri + '" target="_blank">' + a.attributor + "</a>"}) : _.printf("BY_USER", {user:'<a href="' + a.uri + '">' + a.attributor +
                    "</a>"}) : _.printf("BY_USER", {user:a.attributor});
            var f = ['<img height="120" src="', a.hasCustomImage ? GS.Models.Explore.IMG_PATH + "120_" + a.Picture : a.getImageURL(200), '"/>'].join(""), g = a.tags ? '<div class="tags"> <span class="icon"></span> <span class="label ellipsis" title="' + a.tags + '">' + a.tags + "</span></div>" : "";
            return['<div class="tooltip" data-tip-type="playlist" data-playlistID="', a.PlaylistID, '" data-cachePrefix="', a.cachePrefix, '"><a href="', a.toUrl(), '" class="playlistImage insetBorder height120">',
                f, '<span class="playBtn" data-playlistid="', a.PlaylistID, '"></span></a><div class="meta">', b, '<span class="by ellipsis">', d, "</span>", g, "</div></div>"].join("")
        }, prettySort:function (a, b) {
            return a.Picture || !b.Picture ? -1 : b.Picture ? 1 : 0
        }, matchFilter:function (a) {
            var b = RegExp(a, "gi");
            return function (d) {
                return d.PlaylistName.match(b) || d.UserName.match(b)
            }
        }
        },
        {
        init:function (a) {
        this._super(a);
        this.PlaylistName = _.defined(a.PlaylistName) ? _.cleanText(a.PlaylistName) : _.cleanText(a.Name);
        this.Description = _.orEqual(a.Description,
                a.About || "");
        this.Username = this.Username && this.Username.length ? this.Username : a.Username;
        this.UserName = _.cleanText(c.trim(this.FName + (this.LName && this.LName.length ? " " + this.LName : "")));
        this.Collaborative = _.orEqual(a.Collaborative, false);
        this.Collaborators = a.Collaborators ? GS.Models.User.wrapCollectionInObject(a.Collaborators) : {};
        this.fanbase = false;
        this.searchText = [this.PlaylistName, this.FName, this.Description].join(" ").toLowerCase();
        this.songs = [];
        this.albums = {};
        this.originalOrder = [];
        this.images = [];
        this.songsLoaded = _.orEqual(a.songsLoaded, false);
        this.changeLog = [];
        this.hasUnsavedChanges = false;
        delete this.Name;
        delete this.About
    }, getSongs:function (a, b) {
        var d = arguments[arguments.length - 1] === b ? {} : arguments[arguments.length - 1];
        if (this.songsLoaded) {
            this._updateSongs();
            a(this.songs)
        } else GS.service.playlistGetSongs(this.PlaylistID, this.callback(["wrapManySongs", a]), b, d)
    }, validate:function () {
        if (this.PlaylistID > 0)return true;
        return false
    }, wrapManySongs:function (a) {
        var b = [];
        if (this.hasUnsavedChanges)b =
                this.songs;
        var d = a.Songs || a.songs || a.result || a;
        this.songs = [];
        this.gridKeyLookup = {};
        this.songIDLookup = {};
        var f, g;
        d.sort(function (m, h) {
            return parseFloat(m.Sort, 10) - parseFloat(h.Sort, 10)
        });
        var k;
        f = 0;
        for (g = d.length; f < g; f++) {
            a = GS.Models.Song.wrap(d[f], true).dupe();
            a.Sort = f;
            a.GridKey = this.gridKey;
            if (!this.albums[a.AlbumID]) {
                k = GS.Models.Album.wrap({AlbumName:a.AlbumName, AlbumID:a.AlbumID, ArtistName:a.ArtistName, ArtistID:a.ArtistID, CoverArtFilename:a.CoverArtFilename, IsVerified:a.IsVerified}, false);
                this.albums[a.AlbumID] =
                        k
            }
            this.songs.push(a);
            this.gridKeyLookup[a.GridKey] = a;
            this.songIDLookup[a.SongID] = a;
            this.gridKey++
        }
        d = 0;
        for (g = b.length; d < g; d++) {
            a = b[d];
            a.Sort = d + f;
            a.GridKey = this.gridKey;
            b[d] = a;
            this.gridKeyLookup[a.GridKey] = a;
            this.songIDLookup[a.SongID] = a;
            this.gridKey++
        }
        this.originalOrder = this.songs.concat();
        this.songs = this.songs.concat(b);
        this.songsLoaded = true;
        c.publish("gs.playlist.view.update", this);
        this.songs._use_call = true;
        return this.songs
    }, _updateSongs:function () {
        var a, b, d = GS.Models.Song;
        for (a = 0; a < this.songs.length; a++) {
            b =
                    d.getOneFromCache(this.songs[a].SongID);
            this.songs[a].isFavorite = b.isFavorite;
            this.songs[a].fromLibrary = b.fromLibrary
        }
    }, reapplySorts:function () {
        for (var a = 0, b = this.songs.length; a < b; a++)this.songs[a].Sort = a
    }, play:function (a, b, d) {
        this.getSongs(this.callback("playSongs", {index:a, playOnAdd:b, shuffle:d}), null)
    }, playSongs:function (a) {
        var b = _.orEqual(a.shuffle, false), d = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_PLAYLIST, this), f = [];
        if (b) {
            var g = this.songs.shuffle();
            for (b = 0; b < g.length; b++)f.push(g[b].SongID)
        } else for (b =
                            0; b < this.songs.length; b++)f.push(this.songs[b].SongID);
        GS.player.addSongsToQueueAt(f, a.index, a.playOnAdd, d)
    }, getImageURL:function (a) {
        a = _.orEqual(a, 200);
        var b = GS.Models.Playlist.artPath + a + "_playlist.png";
        if (this.Picture)b = GS.Models.Playlist.artPath + a + "_" + this.Picture;
        return b
    }, getDefaultImageUrl:function (a) {
        return GS.Models.Playlist.artPath + a + "_playlist.png"
    }, getPlaylistArt:function (a) {
        a = _.orEqual(a, 200);
        if (this.Picture)return[GS.Models.Playlist.artPath + a + "_" + this.Picture];
        var b = [], d = {}, f = [];
        _.forEach(this.songs,
                function (k) {
                    if (k.CoverArtFilename)if (d.hasOwnProperty(k.AlbumID))d[k.AlbumID].weight++; else d[k.AlbumID] = {CoverArtFilename:k.CoverArtFilename, weight:1}
                });
        for (var g in d)d.hasOwnProperty(g) && f.push([g, d[g]]);
        f = f.sort(function (k, m) {
            return m[1].weight - k[1].weight
        }).slice(0, 4);
        if (f.length >= 4)a = 70;
        for (g = 0; g < f.length && g < 4; ++g)b.push(GS.Models.Album.artPath + a + "_" + f[g][1].CoverArtFilename);
        return b.length ? b : [this.getDefaultImageUrl(a)]
    }, _addSongAtEnd:function (a) {
        this.hasUnsavedChanges && this.addSongs([a],
                this.songs.length, true);
        if (!this.isEditable(GS.user.UserID))return false;
        if (!(a <= 0)) {
            var b = GS.Models.Song.getOneFromCache(a).dupe(), d = {messageType:"playlist", action:"append", time:Math.floor(+new Date / 1024), data:{userID:GS.user.UserID, songs:[b.getDetailsForFeeds()], playlistID:this.PlaylistID, uuid:gsConfig.uuid}};
            if (this.songsLoaded) {
                this.hasUnsavedChanges = true;
                GS.Controllers.PageController.ALLOW_LOAD = false;
                this.addSongsUpdate([b], -1, true);
                GS.user.isLoggedIn ? GS.service.playlistAddSongToExisting(this.PlaylistID,
                        a, b.getDetailsForFeeds(), this.callback("saveSuccess", true, d), this.callback("saveFailed")) : this.saveSuccess(true, false);
                c.publish("gs.playlist.view.update", this)
            } else if (GS.user.isLoggedIn)GS.service.playlistAddSongToExisting(this.PlaylistID, a, b.getDetailsForFeeds(), this.callback("addSongSuccess", d), this.callback("saveFailed")); else return false
        }
    }, addSongsUpdate:function (a, b, d) {
        var f = [], g = a.length && _.isObject(a[0]), k, m, h, n;
        h = 0;
        for (n = a.length; h < n; h++) {
            if (g)m = a[h].dupe(); else {
                if (a[h] <= 0)continue;
                m = GS.Models.Song.getOneFromCache(a[h]).dupe()
            }
            m.GridKey =
                    this.gridKey;
            this.gridKeyLookup[m.GridKey] = m;
            this.songIDLookup[m.SongID] = m;
            this.gridKey++;
            f.push(m);
            if (!this.albums[m.AlbumID]) {
                k = GS.Models.Album.wrap({AlbumName:m.AlbumName, AlbumID:m.AlbumID, ArtistName:m.ArtistName, ArtistID:m.ArtistID, CoverArtFilename:m.CoverArtFilename, IsVerified:m.IsVerified}, false);
                this.albums[m.AlbumID] = k
            }
            typeof d != "undefined" && d && GS.getGuts().logEvent("songAddedToPlaylist", {songID:m.SongID})
        }
        b == -1 ? this.songs.push.apply(this.songs, f) : this.songs.splice.apply(this.songs, [b, 0].concat(f));
        this.reapplySorts()
    }, addSongs:function (a, b, d) {
        b = _.orEqual(b, this.songs.length);
        d = _.orEqual(d, false);
        if (this.songsLoaded && a.length + this.songs.length > 2500) {
            a = (new GS.Models.DataString(c.localize.getString("POPUP_FAIL_ADD_PLAYLIST_TOO_MANY_MSG"), {playlist:this.PlaylistName, numSongs:a.length})).render();
            c.publish("gs.notification", {type:"error", message:a})
        } else if (a.length == 1 && !this.hasUnsavedChanges && d && (b == this.songs.length || b === -1))this._addSongAtEnd(a[0]); else {
            if (!this.isEditable(GS.user.UserID))return false;
            this.hasUnsavedChanges = true;
            GS.Controllers.PageController.ALLOW_LOAD = false;
            this.addSongsUpdate(a, b, true);
            d && this.save();
            c.publish("gs.playlist.view.update", this)
        }
    }, removeSongs:function (a, b) {
        if (!this.isEditable(GS.user.UserID))return false;
        b = _.orEqual(b, false);
        this.hasUnsavedChanges = true;
        GS.Controllers.PageController.ALLOW_LOAD = false;
        for (var d, f = 0; f < a.length; f++)if (d = this.songs[a[f]])d.isDeleted = true;
        this.reapplySorts();
        b ? this.save() : this.saveLater();
        c.publish("gs.playlist.view.update", this)
    }, overwriteWithSongs:function (a, b) {
        if (!this.isEditable(GS.user.UserID))return false;
        b = _.orEqual(b, false);
        this.songs = [];
        for (var d, f = 0; f < a.length; f++)if (!(a[f] <= 0)) {
            d = GS.Models.Song.getOneFromCache(a[f]).dupe();
            d.GridKey = this.gridKey;
            this.gridKeyLookup[d.GridKey] = d;
            this.songIDLookup[d.SongID] = d;
            this.gridKey++;
            this.songs.push(d)
        }
        this.reapplySorts();
        this.hasUnsavedChanges = this.songsLoaded = true;
        GS.Controllers.PageController.ALLOW_LOAD = false;
        b && this.save();
        c.publish("gs.playlist.view.update", this)
    }, moveSongsTo:function (a, b, d) {
        if (!this.isEditable(GS.user.UserID))return false;
        d = _.orEqual(d, false);
        this.hasUnsavedChanges = true;
        GS.Controllers.PageController.ALLOW_LOAD = false;
        var f, g = [];
        for (f = 0; f < a.length; f++)g.push(this.songs[a[f]]);
        for (f = 0; f < g.length; f++) {
            a = this.songs.indexOf(g[f]);
            this.songs.splice(a, 1);
            a < b && b--
        }
        this.songs.splice.apply(this.songs, [b, 0].concat(g));
        this.reapplySorts();
        d ? this.save() : this.saveLater();
        c.publish("gs.playlist.view.update", this)
    }, broadcastOverwrite:function (a) {
        if (a instanceof Object)a = a; else {
            a = [];
            for (var b = 0, d = this.songs.length; b < d; b++)a.push(this.songs[b].getDetailsForFeeds());
            a = {messageType:"playlist", action:"overwrite", time:Math.floor(+new Date / 1024), data:{userID:GS.user.UserID, songs:a, playlistID:this.PlaylistID, uuid:gsConfig.uuid}}
        }
        var f = {publishers:[this.UserID + ""]};
        if (this.Collaborators) {
            c.each(this.Collaborators, function (g) {
                f.publishers.push(g + "")
            });
            c.unique(f.publishers)
        }
        GS.player.player.broadcastToChannel("playlist" + this.PlaylistID, a, f)
    }, saveTimer:null, saveLater:function (a) {
        a = _.orEqual(a, true);
        this.saveTimer && clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(this.callback("save",
                a), GS.Models.Playlist.SAVE_DELAY)
    }, save:function (a) {
        if (this.songsLoaded) {
            var b, d, f = [], g = [], k = [];
            for (b = 0; d = this.songs[b]; b++)if (d.isDeleted)GS.getGuts().logEvent("songRemovedFromPlaylist", {songID:d.SongID}); else {
                f.push(d.SongID);
                k.push(d.getDetailsForFeeds())
            }
            b = 0;
            for (d = this.originalOrder.length; b < d; b++)g.push(this.originalOrder[b].SongID);
            if (f.join(".") == g.join(".")) {
                this.originalOrder = this.songs.concat();
                this.hasUnsavedChanges = false;
                GS.Controllers.PageController.ALLOW_LOAD = true;
                c.publish("gs.playlist.view.update",
                        this)
            } else {
                GS.user.isLoggedIn ? GS.service.overwritePlaylist(this.PlaylistID, this.PlaylistName, f, k, this.callback("saveSuccess", a, true), this.callback("saveFailed")) : this.saveSuccess();
                GS.getGuts().gaTrackEvent("playlist", "savePlaylist")
            }
        } else this.getSongs(this.callback("save"), this.callback("saveFailed"), false)
    }, saveHistory:function (a) {
        this.changeLog.push(a);
        this.changeLog.length > 10 && this.changeLog.shift()
    }, saveSuccess:function (a, b) {
        for (var d = [], f = 0; f < this.songs.length; f++)this.songs[f].isDeleted ||
        d.push(this.songs[f]);
        (a = _.orEqual(a, true)) && this.saveHistory(this.originalOrder);
        this.songsLoaded = true;
        this.songs = d;
        this.originalOrder = this.songs.concat();
        this.hasUnsavedChanges = false;
        this.TSModified = (new Date).getTime();
        GS.Controllers.PageController.ALLOW_LOAD = true;
        d = (new GS.Models.DataString(c.localize.getString("POPUP_SAVE_PLAYLIST_MSG"), {playlist:this.PlaylistName, playlistID:this.PlaylistID})).render();
        c.publish("gs.notification", {type:"notice", message:d});
        c.publish("gs.playlist.view.update",
                this);
        b && this.broadcastOverwrite(b)
    }, addSongSuccess:function (a) {
        var b = (new GS.Models.DataString(c.localize.getString("POPUP_SAVE_PLAYLIST_MSG"), {playlist:this.PlaylistName, playlistID:this.PlaylistID})).render();
        c.publish("gs.notification", {type:"notice", message:b});
        c.publish("gs.playlist.view.update", this);
        this.broadcastOverwrite(a)
    }, saveFailed:function () {
        c.publish("gs.notification", {type:"error", message:c.localize.getString("POPUP_FAIL_SAVE_PLAYLIST_MSG")})
    }, remove:function (a) {
        GS.user.deletePlaylist(this.PlaylistID,
                a);
        GS.getGuts().logEvent("playlistDeleted", {playlistID:this.PlaylistID})
    }, restore:function (a) {
        GS.user.restorePlaylist(this.PlaylistID, a)
    }, setCollaborative:function (a) {
        if (GS.user.UserID > 0 && GS.user.UserID == this.UserID)GS.service.playlistSetCollaboration(this.PlaylistID, a ? 1 : 0, this.callback("_setCollaborate", a ? 1 : 0))
    }, _setCollaborate:function (a) {
        this.Collaborative = a;
        if (GS.user.UserID == this.UserID) {
            if (GS.user.PageNameData.CollabPlaylists)if (a)GS.user.PageNameData.CollabPlaylists[this.PlaylistID] = this; else GS.user.PageNameData.CollabPlaylists.hasOwnProperty(this.PlaylistID) &&
            delete GS.user.PageNameData.CollabPlaylists[this.PlaylistID];
            if (GS.user.playlists && GS.user.playlists.hasOwnProperty(this.PlaylistID))GS.user.playlists[this.PlaylistID].Collaborative = a;
            GS.user._updateCollabPlaylists()
        }
        c.publish("gs.playlist.view.update", this)
    }, setCollaborativePermissions:function (a, b) {
        if (GS.user.UserID > 0 && (GS.user.UserID == this.UserID || GS.user.UserID == a))GS.service.playlistSetUserPermissions(this.PlaylistID, a, b, this.callback("_setUserPermissions", a, b))
    }, isCollaborator:function (a) {
        return this.Collaborators &&
                this.Collaborators.hasOwnProperty(a)
    }, isEditable:function (a) {
        return a == this.UserID || this.Collaborative && this.isCollaborator(a)
    }, _setUserPermissions:function (a, b) {
        var d = GS.Models.User.getOneFromCache(a);
        if (d) {
            if (b >= 0) {
                this.Collaborative = true;
                this.Collaborators[d.UserID] = d;
                var f = {publishers:[this.UserID + ""]};
                if (this.Collaborators) {
                    c.each(this.Collaborators, function (g) {
                        f.publishers.push(g + "")
                    });
                    c.unique(f.publishers)
                }
                GS.player.player.subscribeToPlaylistChannel(this.PlaylistID, f)
            } else {
                delete this.Collaborators[a];
                if (GS.user.UserID == a) {
                    delete GS.user.PageNameData.CollabPlaylists[this.PlaylistID];
                    GS.user._updateCollabPlaylists()
                }
            }
            c.publish("gs.playlist.view.update", this)
        }
    }, undo:function () {
        var a, b;
        if (this.hasUnsavedChanges) {
            this.songs = this.originalOrder.concat();
            a = 0;
            for (b = this.songs.length; a < b; a++)this.songs[a].isDeleted = false;
            this.hasUnsavedChanges = false;
            GS.Controllers.PageController.ALLOW_LOAD = true
        } else if (this.changeLog.length) {
            this.songs = this.changeLog.pop();
            this.gridKeyLookup = {};
            a = 0;
            for (b = this.songs.length; a <
                    b; a++) {
                this.songs[a].isDeleted = false;
                this.gridKeyLookup[this.songs[a].GridKey] = this.songs[a]
            }
            this.save(false);
            this.originalOrder = this.songs.concat()
        }
        this.reapplySorts();
        c.publish("gs.playlist.view.update", this)
    }, rename:function (a, b, d) {
        var f = {messageType:"playlist", action:"rename", time:Math.floor(+new Date / 1024), data:{userID:GS.user.UserID, name:a, playlistID:this.PlaylistID, uuid:gsConfig.uuid}}, g = {publishers:[this.UserID + ""]};
        if (this.Collaborators) {
            c.each(this.Collaborators, function (k) {
                g.publishers.push(k +
                        "")
            });
            c.unique(g.publishers)
        }
        GS.player.player.broadcastToChannel("playlist" + this.PlaylistID, f, g);
        GS.service.renamePlaylist(this.PlaylistID, a, this.Collaborative, this.callback([this._renameSuccess, b], a), this.callback([this._renameFailed, d]))
    }, _renameSuccess:function (a, b) {
        this.PlaylistName = a;
        var d = this.Class.getOneFromCache(this.PlaylistID);
        if (d)d.PlaylistName = a;
        if (d = GS.user.playlists[this.PlaylistID])d.PlaylistName = a;
        this._updateUserPageNameData();
        c.publish("gs.playlist.view.update", this);
        c.publish("gs.auth.playlists.update",
                this);
        return b
    }, _renameFailed:function (a) {
        return a
    }, changeDescription:function (a, b, d) {
        GS.service.setPlaylistAbout(this.PlaylistID, a, this.Collaborative, this.callback([this._changeDescSuccess, b], a), this.callback([this._changeDescFailed, d]))
    }, _changeDescSuccess:function (a, b) {
        this.Description = a;
        var d = this.Class.getOneFromCache(this.PlaylistID);
        if (d)d.Description = a;
        if (d = GS.user.playlists[this.PlaylistID])d.Description = a;
        c.publish("gs.playlist.view.update", this);
        return b
    }, _changeDescFailed:function (a) {
        return a
    },
        getDetailsForFeeds:function () {
            var a = {playlistID:this.PlaylistID, playlistName:_.uncleanText(this.PlaylistName), userID:this.UserID, displayName:this.FName + (this.LName && this.LName.length ? " " + this.LName : ""), artFilename:this.Picture};
            if (this.songs) {
                a.songs = [];
                for (var b = 0; b < a.songs; b++)a.songs.push(this.songs[b].getDetailsForFeeds())
            }
            return a
        }, getTitle:function () {
            return['"', this.PlaylistName, '" by ', this.UserName].join("")
        }, isSubscribed:function () {
            return GS.user.UserID != this.UserID && this.isFavorite || !_.isEmpty(GS.user.favorites.playlists[this.PlaylistID])
        },
        subscribe:function () {
            GS.user.addToPlaylistFavorites(this.PlaylistID)
        }, unsubscribe:function () {
            GS.user.removeFromPlaylistFavorites(this.PlaylistID)
        }, _updateUserPageNameData:function () {
            if (this.UserID != GS.user.UserID)if (GS.user.PageNameData.CollabPlaylists && GS.user.PageNameData.CollabPlaylists[this.PlaylistID]) {
                var a = GS.user.PageNameData.CollabPlaylists[this.PlaylistID], b = false;
                if (a.Name != this.PlaylistName) {
                    b = true;
                    GS.user.PageNameData.CollabPlaylists[this.PlaylistID].Name = this.PlaylistName
                }
                if (a.Picture !=
                        this.Picture) {
                    b = true;
                    GS.user.PageNameData.CollabPlaylists[this.PlaylistID].Picture = this.Picture
                }
                if (a.FName != this.UserName) {
                    b = true;
                    GS.user.PageNameData.CollabPlaylists[this.PlaylistID].FName = this.UserName
                }
                if (b) {
                    GS.service.userCollaborativePlaylistChanged(this.getDetailsForFeeds());
                    GS.user._updateCollabPlaylists(true)
                }
            }
        }, updateFromBroadcast:function (a) {
            if (a.data.uuid == gsConfig.uuid)return false;
            var b;
            if (a.data.songs)b = GS.Models.Song.wrapCollection(a.data.songs);
            if (b && this.hasUnsavedChanges && (GS.user.UserID ==
                    this.UserID || a.data.userID > GS.user.UserID))this.broadcastOverwrite(); else {
                switch (a.action) {
                    case "rename":
                        this.TSModified = a.time;
                        this._renameSuccess(_.cleanText(a.data.name));
                        location.hash = this.toUrl();
                        return;
                    case "description":
                        this.Description = a.data.description;
                        this.TSModified = a.time;
                        break;
                    case "append":
                        this.saveHistory(this.songs.concat());
                        this.TSModified = a.time;
                        this.addSongsUpdate(b, -1, false);
                        this.originalOrder = this.songs.concat();
                        break;
                    case "overwrite":
                        this.saveHistory(this.songs.concat());
                        this.songs =
                                [];
                        this.songs._use_call = true;
                        this.albums = {};
                        this.gridKeyLookup = {};
                        this.songIDLookup = {};
                        this.TSModified = a.time;
                        this.addSongsUpdate(b, -1, false);
                        this.originalOrder = this.songs.concat();
                        break
                }
                c.publish("gs.playlist.view.update", this)
            }
        }, getContextMenu:function () {
            var a = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_PLAYLIST, this), b = [
                {title:c.localize.getString("CONTEXT_PLAY_PLAYLIST"), customClass:"last jj_menu_item_hasIcon jj_menu_item_play", action:{type:"fn", callback:this.callback(function () {
                    this.getSongs(function (d) {
                        var f =
                                [];
                        c.each(d, function (g, k) {
                            f.push(k.SongID)
                        });
                        GS.player.addSongsToQueueAt(f, GS.player.INDEX_DEFAULT, true, a)
                    }, null)
                })}},
                {title:c.localize.getString("CONTEXT_PLAY_PLAYLIST_NEXT"), customClass:"last jj_menu_item_hasIcon jj_menu_item_play_next", action:{type:"fn", callback:this.callback(function () {
                    this.getSongs(function (d) {
                        var f = [];
                        c.each(d, function (g, k) {
                            f.push(k.SongID)
                        });
                        GS.player.addSongsToQueueAt(f, GS.player.INDEX_NEXT, false, a)
                    }, null)
                })}},
                {title:c.localize.getString("CONTEXT_PLAY_PLAYLIST_LAST"), customClass:"last jj_menu_item_hasIcon jj_menu_item_play_last",
                    action:{type:"fn", callback:this.callback(function () {
                        this.getSongs(function (d) {
                            var f = [];
                            c.each(d, function (g, k) {
                                f.push(k.SongID)
                            });
                            GS.player.addSongsToQueueAt(f, GS.player.INDEX_LAST, false, a)
                        }, null)
                    })}},
                {customClass:"separator"}
            ];
            if (this.PlaylistID > 0)b = b.concat([
                {title:c.localize.getString("SHARE_PLAYLIST"), customClass:"jj_menu_item_hasIcon jj_menu_item_share", action:{type:"fn", callback:this.callback(function () {
                    GS.getLightbox().open("share", {type:"playlist", id:this.PlaylistID})
                })}},
                {customClass:"separator"}
            ]);
            b = b.concat([
                {title:c.localize.getString("CONTEXT_REPLACE_ALL_SONGS"), customClass:"last jj_menu_item_hasIcon jj_menu_item_now_playing", action:{type:"fn", callback:this.callback(function () {
                    this.getSongs(function (d) {
                        var f = [], g = GS.player.isPlaying;
                        c.each(d, function (k, m) {
                            f.push(m.SongID)
                        });
                        GS.player.addSongsToQueueAt(f, GS.player.INDEX_REPLACE, g, a)
                    }, null)
                })}},
                {customClass:"separator"}
            ]);
            GS.user.getIsShortcut("playlist", this.PlaylistID) ? b.push({title:c.localize.getString("CONTEXT_REMOVE_FROM_PINBOARD"), customClass:"last jj_menu_item_hasIcon jj_menu_item_remove_pinboard",
                action:{type:"fn", callback:this.callback(function () {
                    GS.user.removeFromShortcuts("playlist", this.PlaylistID)
                })}}) : b.push({title:c.localize.getString("CONTEXT_ADD_TO_PINBOARD"), customClass:"last jj_menu_item_hasIcon jj_menu_item_pinboard", action:{type:"fn", callback:this.callback(function () {
                GS.user.addToShortcuts("playlist", this.PlaylistID, this.PlaylistName)
            })}});
            return b
        }, getShareMenu:function () {
            var a = [];
            GS.user.isLoggedIn && a.push({title:c.localize.getString("SHARE_EMAIL"), customClass:"jj_menu_item_hasIcon jj_menu_item_share_email",
                action:{type:"fn", callback:this.callback(function () {
                    GS.getLightbox().open("share", {service:"email", type:"playlist", id:this.PlaylistID})
                })}});
            return a = a.concat([
                {title:c.localize.getString("SHARE_FACEBOOK"), customClass:"jj_menu_item_hasIcon jj_menu_item_share_facebook", action:{type:"fn", callback:this.callback(function () {
                    GS.getLightbox().open("share", {service:"facebook", type:"playlist", id:this.PlaylistID})
                })}},
                {title:c.localize.getString("SHARE_TWITTER"), customClass:"jj_menu_item_hasIcon jj_menu_item_share_twitter",
                    action:{type:"fn", callback:this.callback(function () {
                        GS.getLightbox().open("share", {service:"twitter", type:"playlist", id:this.PlaylistID})
                    })}},
                {title:c.localize.getString("SHARE_STUMBLE"), customClass:"jj_menu_item_hasIcon jj_menu_item_share_stumbleupon", action:{type:"fn", callback:this.callback(function () {
                    window.open(_.makeUrlForShare("stumbleupon", "playlist", this), "_blank");
                    c("div[id^=jjmenu]").remove()
                })}},
                {title:c.localize.getString("SHARE_REDDIT"), customClass:"jj_menu_item_hasIcon jj_menu_item_share jj_menu_item_share_reddit",
                    action:{type:"fn", callback:this.callback(function () {
                        window.open(_.makeUrlForShare("reddit", "playlist", this), "_blank");
                        c("div[id^=jjmenu]").remove()
                    })}},
                {title:c.localize.getString("SHARE_WIDGET"), customClass:"jj_menu_item_hasIcon jj_menu_item_share_widget", action:{type:"fn", callback:this.callback(function () {
                    GS.getLightbox().open("share", {service:"widget", type:"playlist", id:this.PlaylistID})
                })}},
                {title:c.localize.getString("PLAYLIST_URL"), customClass:"playlistUrl jj_menu_item_hasIcon jj_menu_item_copy"}
            ])
        },
        toUrl:function (a) {
            return _.cleanUrl(this.PlaylistName, this.PlaylistID, "playlist", null, a)
        }, toUserUrl:function (a) {
            return _.cleanUrl(this.UserName, this.UserID, "user", null, a)
        }, toProxyLabel:function () {
            return _.getString("SELECTION_PLAYLIST_SINGLE", {PlaylistName:_.cleanText(this.PlaylistName), Username:_.cleanText(this.UserName)})
        }, partyUrls:{}, getPartyUrl:function (a, b, d) {
            this.partyUrls[a] ? b(this.partyUrls[a]) : GS.service.getPlaylist3DES(this.PlaylistID, a, this.callback(["savePartyUrl", b], a), d)
        }, savePartyUrl:function (a, b) {
            if (b && b.length) {
                this.partyUrls[a] = GS.Controllers.PartyController.partyPath + b;
                return this.partyUrls[a]
            }
        }, toString:function (a) {
            return(a = _.orEqual(a, false)) ? ["Playlist. pid: ", this.PlaylistID, ", pname:", this.PlaylistName, ", uid:", this.UserID, ", uname: ", this.UserName].join("") : _.getString("SELECTION_PLAYLIST_SINGLE", {PlaylistName:_.cleanText(this.PlaylistName), Username:_.cleanText(this.UserName)})
        }})
})(jQuery);

