GS.Controllers.BaseController.extend("GS.Controllers.SidebarController", {onElement:"#sidebar", isGSSingleton:true, preSetup:function () {
    var c = GS.Controllers.BaseController.singletonCallback, a = $.subscribe;
    a("gs.auth.update", c("sidebar", "update"));
    a("gs.auth.pinboard.update", c("sidebar", "populateByType"));
    a("gs.auth.playlists.update", c("sidebar", "populateByType", {type:"playlists"}));
    a("gs.auth.favorites.playlists.update", c("sidebar", "populateByType", {type:"subscribedPlaylists"}));
    a("gs.page.view", c("sidebar",
            "updateSection"));
    a("gs.app.ready", c("sidebar", "update"))
}}, {playlists:[], subscribedPlaylists:[], stations:[], sortBy:"sidebarSort", doingSubscribed:false, doResize:true, isOpen:false, lastClickedPinnedElement:false, doubleClickTimeout:false, init:function () {
    var c = GS.store.get("gs.sort.sidebar");
    if (["sidebarSort", "PlaylistName"].indexOf(c) != -1)this.sortBy = c;
    this.subscribe("gs.auth.sidebar.loaded", this.callback(function () {
        this.populateByType({type:"all"})
    }));
    this.subscribe("gs.app.resize", this.callback("resize"));
    this._super()
}, appReady:function () {
    this.update()
}, updateSection:function (c) {
    if (c === "UserMusicController")if (GS.user.UserID == GS.page.activePageIdentifier && !GS.page.activePageParams.subpage)$(".sidebar_myMusic").addClass("active").siblings().removeClass("active"); else if (GS.user.UserID == GS.page.activePageIdentifier && GS.page.activePageParams.subpage == "favorites")$(".sidebar_myFavorites").addClass("active").siblings().removeClass("active"); else GS.user.UserID == GS.page.activePageIdentifier && GS.page.activePageParams.subpage ==
            "playlists" ? $(".sidebar_playlists").addClass("active").siblings().removeClass("active") : $(".sidebar_music_link").removeClass("active"); else $(".sidebar_music_link").removeClass("active")
}, show:function () {
    if (!this.isOpen) {
        this.isOpen = true;
        this.element.addClass("active").removeClass("hide").width(180);
        if (this.tinyScrollbar)this.tinyScrollbar.update(); else this.tinyScrollbar = $("#sidebar_pinboard").tinyscrollbar({animationOptions:{duration:50, easing:"linear"}});
        GS.resize()
    }
}, hide:function () {
    if (this.isOpen) {
        this.isOpen =
                false;
        this.element.removeClass("active").addClass("hide").width(0);
        GS.resize()
    }
}, resize:function () {
    this.tinyScrollbar && !this.element.hasClass("hide") && this.tinyScrollbar.update()
}, update:function () {
    if (GS.user) {
        this.user = GS.user;
        this.tinyScrollbar && this.tinyScrollbar.remove();
        this.tinyScrollbar = null;
        this.element.html(this.view("index"));
        this.populateByType({type:"all"});
        this.beginDragDrop()
    }
}, changeSort:function (c) {
    this.sortBy = c;
    this.populateByType({type:"all"});
    GS.store.set("gs.sort.sidebar", c)
},
    playlistSort:function (c, a) {
        var b, d;
        try {
            if (this.sortBy === "sidebarSort") {
                b = c[this.sortBy];
                d = a[this.sortBy]
            } else {
                b = c[this.sortBy].toString().toLowerCase();
                d = a[this.sortBy].toString().toLowerCase()
            }
        } catch (f) {
        }
        return b == d ? 0 : b > d ? 1 : -1
    }, populateByType:function (c) {
        if (GS.user.sidebarLoaded) {
            switch (c.type) {
                case "all":
                    this.populateSidebarStations();
                    this.populateSidebarSubscribedPlaylists();
                    this.populateSidebarPlaylists();
                    this.populateSidebarSongs();
                    this.populateSidebarArtists();
                    this.populateSidebarAlbums();
                    break;
                case "playlists":
                    this.populateSidebarPlaylists();
                    break;
                case "subscribedPlaylists":
                    this.populateSidebarSubscribedPlaylists();
                    break;
                case "stations":
                    this.populateSidebarStations();
                    break;
                case "songs":
                    this.populateSidebarSongs();
                    break;
                case "artists":
                    this.populateSidebarArtists();
                    break;
                case "albums":
                    this.populateSidebarAlbums();
                    break
            }
            if (this.tinyScrollbar)this.tinyScrollbar.update(); else this.tinyScrollbar = $("#sidebar_pinboard").tinyscrollbar({animationOptions:{duration:50, easing:"linear"}})
        }
    }, populateSidebarPlaylists:function () {
        if (GS.user.sidebarLoaded) {
            this.playlists =
                    [];
            for (var c = GS.user.sidebar.playlists, a = 0; a < c.length; a++) {
                var b = GS.user.playlists[c[a]];
                if (b) {
                    b.sidebarSort = a + 1;
                    this.playlists.push(b)
                }
            }
            this.playlists.sort(this.callback(this.playlistSort));
            this.showPlaylists()
        }
    }, populateSidebarSubscribedPlaylists:function () {
        if (GS.user.sidebarLoaded) {
            this.subscribedPlaylists = [];
            for (var c = GS.user.sidebar.subscribedPlaylists, a = 0; a < c.length; a++) {
                var b = c[a], d = GS.Models.Playlist.getOneFromCache(b), f = d ? d.PlaylistName : GS.user.sidebar.meta.subscribedPlaylists[b];
                if (d) {
                    if (d.UserID !==
                            GS.user.UserID) {
                        d.sidebarSort = a + 1;
                        this.subscribedPlaylists.push(d)
                    }
                } else f ? this.subscribedPlaylists.push({PlaylistID:b, PlaylistName:f, sidebarSort:a + 1}) : console.log("subscribedPlaylist shortcut with no name!", b)
            }
            this.subscribedPlaylists.sort(this.callback(this.playlistSort));
            this.showSubscribedPlaylists()
        }
    }, populateSidebarStations:function () {
        if (GS.user.sidebarLoaded) {
            this.stations = [];
            var c, a, b, d, f = GS.user.sidebar.stations;
            b = 0;
            for (d = f.length; b < d; b++) {
                c = f[b];
                if (a = GS.Models.Station.getOneFromCache(c))if (a =
                        a.StationTitle) {
                    a = {StationID:c, Station:a, Name:a, PlaylistName:a, sidebarSort:b + 1};
                    this.stations.push(a)
                }
            }
            this.stations.sort(this.callback(this.playlistSort));
            this.showStations()
        }
    }, populateSidebarSongs:function () {
        if (GS.user.sidebarLoaded) {
            this.songs = [];
            for (var c = GS.user.sidebar.songs, a = 0; a < c.length; a++) {
                var b = c[a], d = GS.Models.Song.getOneFromCache(b);
                (d = d ? d.SongName : GS.user.sidebar.meta.songs[b]) ? this.songs.push({SongName:d, SongID:b, sidebarSort:a + 1}) : console.log("song shortcut with no name!", b)
            }
            this.songs.sort(this.callback(this.playlistSort));
            this.showSongs()
        }
    }, populateSidebarArtists:function () {
        if (GS.user.sidebarLoaded) {
            this.artists = [];
            for (var c = GS.user.sidebar.artists, a = 0; a < c.length; a++) {
                var b = c[a], d = GS.Models.Artist.getOneFromCache(b);
                (d = d ? d.ArtistName : GS.user.sidebar.meta.artists[b]) ? this.artists.push({ArtistName:d, ArtistID:b, sidebarSort:a + 1}) : console.log("artist shortcut with no name!", b)
            }
            this.artists.sort(this.callback(this.playlistSort));
            this.showArtists()
        }
    }, populateSidebarAlbums:function () {
        if (GS.user.sidebarLoaded) {
            this.albums =
                    [];
            for (var c = GS.user.sidebar.albums, a = 0; a < c.length; a++) {
                var b = c[a], d = GS.Models.Album.getOneFromCache(b);
                (d = d ? d.AlbumName : GS.user.sidebar.meta.albums[b]) ? this.albums.push({AlbumName:d, AlbumID:b, sidebarSort:a + 1}) : console.log("album shortcut with no name!", b)
            }
            this.albums.sort(this.callback(this.playlistSort));
            this.showAlbums()
        }
    }, showPlaylists:function () {
        $("#sidebar_playlists").html(this.view("playlists", {playlists:this.playlists, doingSubscribed:false}));
        $("#sidebar_playlists_divider").show();
        $("#sidebar_playlist_new").toggle(!this.playlists.length)
    },
    showSubscribedPlaylists:function () {
        $("#sidebar_subscribed_playlists").html(this.view("playlists", {playlists:this.subscribedPlaylists, doingSubscribed:true}));
        $("#sidebar_playlists_divider").show()
    }, showStations:function () {
        $("#sidebar_stations").html(this.view("stations"));
        $("#sidebar_stations_divider").show();
        $("#sidebar_station_new").toggle(!this.stations.length)
    }, showSongs:function () {
        $("#sidebar_songs").html(this.view("songs"));
        var c = $("#sidebar_songs_divider"), a = c.toggle(!!this.songs.length).hasClass("sidebar_pin_collapsed");
        c.next(".sidebar_pin_group").toggle(!a && !!this.songs.length)
    }, showArtists:function () {
        $("#sidebar_artists").html(this.view("artists"));
        var c = $("#sidebar_artists_divider"), a = c.toggle(!!this.artists.length).hasClass("sidebar_pin_collapsed");
        c.next(".sidebar_pin_group").toggle(!a && !!this.artists.length)
    }, showAlbums:function () {
        $("#sidebar_albums").html(this.view("albums"));
        var c = $("#sidebar_albums_divider"), a = c.toggle(!!this.albums.length).hasClass("sidebar_pin_collapsed");
        c.next(".sidebar_pin_group").toggle(!a &&
                !!this.albums.length)
    }, ".sidebar_pin_divider click":function (c) {
        $(c).toggleClass("sidebar_pin_collapsed");
        $(c).next(".sidebar_pin_group").toggle()
    }, "a.sidebar_playlist click":function (c, a) {
        a.preventDefault();
        var b = parseInt($(c).attr("rel"), 10);
        if (c[0] != this.lastClickedPinnedElement[0]) {
            clearTimeout(this.doubleClickTimeout);
            this.doubleClickTimeout = false
        }
        if (b) {
            if (this.doubleClickTimeout) {
                clearTimeout(this.doubleClickTimeout);
                this.doubleClickTimeout = false;
                GS.Models.Playlist.getPlaylist(b, function (f) {
                    f &&
                    f.play(GS.player.INDEX_LAST, true)
                })
            } else {
                var d = this;
                this.doubleClickTimeout = setTimeout(function () {
                    d.doubleClickTimeout = false;
                    GS.Models.Playlist.getPlaylist(b, function (f) {
                        f && GS.router.setHash(f.toUrl())
                    })
                }, 900)
            }
            this.lastClickedPinnedElement = c
        }
    }, "a.sidebar_playlist_new click":function (c, a) {
        a.preventDefault();
        GS.getLightbox().open("newPlaylist")
    }, ".sidebar_playlist .remove click":function (c, a) {
        a.stopPropagation();
        a.preventDefault();
        var b = c.parent().attr("rel"), d = GS.Models.Playlist.getOneFromCache(b),
                f = d.isSubscribed(), g = $(c).closest(".link_group"), k = function () {
                    if ($(".sidebar_link", g).length === 0)if (!f) {
                        $("#sidebar_subscribed_divider").addClass("sidebar_pin_collapsed");
                        $("#sidebar_subscribed_wrapper").css("display", "none")
                    }
                };
        GS.getLightbox().open({type:"removePlaylistSidebar", view:{header:"POPUP_DELETE_PLAYLIST_TITLE", messageHTML:(new GS.Models.DataString($.localize.getString("POPUP_DELETE_PLAYLIST_QUESTION"), {playlist:d.PlaylistName})).render(), buttonsLeft:[
            {className:"close", label:"CANCEL"}
        ],
            buttonsRight:[
                {className:"submit playlist", label:f ? "PLAYLIST_UNSUBSCRIBE" : "POPUP_DELETE_PLAYLIST_LABEL"},
                {className:"submit shortcut", label:"POPUP_REMOVE_PINBOARD_LABEL"}
            ]}, callbacks:{"button.playlist":function () {
            f ? d.unsubscribe() : d.remove();
            k()
        }, "button.shortcut":function () {
            GS.user.removeFromShortcuts("playlist", d.PlaylistID, true);
            k()
        }}});
        return false
    }, "a.playlist contextmenu":function (c, a) {
        var b = c.attr("rel");
        b = GS.Models.Playlist.getOneFromCache(b).getContextMenu();
        $(c).jjmenu(a, b, null, {xposition:"mouse",
            yposition:"mouse", show:"show", className:"playlistmenu"})
    }, "a.station click":function (c, a) {
        a.stopPropagation();
        var b = c.attr("rel");
        GS.player.setAutoplay(true, b);
        return false
    }, "a.station .remove click":function (c, a) {
        a.stopPropagation();
        var b = c.parent().attr("rel");
        this.removeStationID = b;
        var d = $(c).closest(".link_group");
        GS.user.removeFromShortcuts("station", b, true);
        if ($(".sidebar_link", d).length === 0) {
            $("#sidebar_stations_divider").addClass("sidebar_pin_collapsed");
            $("#sidebar_stations_wrapper").css("display",
                    "none")
        }
        return false
    }, "a.noProfile click":function () {
        GS.getLightbox().open("login")
    }, "a.upload click":function () {
        window.open("http://" + location.host + "/upload", "_blank")
    }, "a.sidebar_song click":function (c, a) {
        a.preventDefault();
        var b = parseInt($(c).attr("rel"), 10);
        if (c[0] != this.lastClickedPinnedElement[0]) {
            clearTimeout(this.doubleClickTimeout);
            this.doubleClickTimeout = false
        }
        if (b)if (this.doubleClickTimeout) {
            clearTimeout(this.doubleClickTimeout);
            this.doubleClickTimeout = false;
            GS.Models.Song.getSong(b, function (f) {
                f &&
                GS.player.addSongAndPlay(f.SongID)
            })
        } else {
            var d = this;
            this.doubleClickTimeout = setTimeout(function () {
                d.doubleClickTimeout = false;
                GS.Models.Song.getSong(b, function (f) {
                    f && GS.router.setHash(f.toUrl())
                })
            }, 900)
        }
        this.lastClickedPinnedElement = c
    }, ".sidebar_song .remove click":function (c, a) {
        a.stopPropagation();
        a.preventDefault();
        var b = c.parent().attr("rel"), d = c.parent().attr("title");
        GS.getLightbox().open({type:"removeSongSidebar", view:{header:"POPUP_REMOVE_FROM_PINBOARD_TITLE", messageHTML:(new GS.Models.DataString($.localize.getString("POPUP_REMOVE_FROM_PINBOARD_MSG"),
                {name:d, type:$.localize.getString("SONG").toLowerCase()})).render(), buttonsLeft:[
            {className:"close", label:"CANCEL"}
        ], buttonsRight:[
            {className:"submit shortcut", label:"POPUP_REMOVE_PINBOARD_LABEL"}
        ]}, callbacks:{"button.shortcut":function () {
            GS.user.removeFromShortcuts("song", b)
        }}});
        return false
    }, "a.sidebar_song contextmenu":function (c, a) {
        var b = parseInt($(c).attr("rel"), 10);
        b && GS.Models.Song.getSong(b, function (d) {
            if (d) {
                d = d.getContextMenu();
                $(c).jjmenu(a, d, null, {xposition:"mouse", yposition:"mouse", show:"show",
                    className:"songmenu"})
            }
        })
    }, "a.sidebar_album click":function (c, a) {
        a.preventDefault();
        var b = parseInt($(c).attr("rel"), 10);
        if (c[0] != this.lastClickedPinnedElement[0]) {
            clearTimeout(this.doubleClickTimeout);
            this.doubleClickTimeout = false
        }
        if (b)if (this.doubleClickTimeout) {
            clearTimeout(this.doubleClickTimeout);
            this.doubleClickTimeout = false;
            GS.Models.Album.getAlbum(b, function (f) {
                f && f.play(GS.player.INDEX_LAST, true)
            })
        } else {
            var d = this;
            this.doubleClickTimeout = setTimeout(function () {
                d.doubleClickTimeout = false;
                GS.Models.Album.getAlbum(b,
                        function (f) {
                            f && GS.router.setHash(f.toUrl())
                        })
            }, 900)
        }
        this.lastClickedPinnedElement = c
    }, ".sidebar_album .remove click":function (c, a) {
        a.stopPropagation();
        a.preventDefault();
        var b = c.parent().attr("rel"), d = c.parent().attr("title");
        GS.getLightbox().open({type:"removeAlbumSidebar", view:{header:"POPUP_REMOVE_FROM_PINBOARD_TITLE", messageHTML:(new GS.Models.DataString($.localize.getString("POPUP_REMOVE_FROM_PINBOARD_MSG"), {name:d, type:$.localize.getString("ALBUM").toLowerCase()})).render(), buttonsLeft:[
            {className:"close",
                label:"CANCEL"}
        ], buttonsRight:[
            {className:"submit shortcut", label:"POPUP_REMOVE_PINBOARD_LABEL"}
        ]}, callbacks:{"button.shortcut":function () {
            GS.user.removeFromShortcuts("album", b)
        }}});
        return false
    }, "a.sidebar_album contextmenu":function (c, a) {
        var b = parseInt($(c).attr("rel"), 10);
        b && GS.Models.Album.getAlbum(b, function (d) {
            if (d) {
                d = d.getContextMenu();
                $(c).jjmenu(a, d, null, {xposition:"mouse", yposition:"mouse", show:"show", className:"albummenu"})
            }
        })
    }, "a.sidebar_artist click":function (c, a) {
        a.preventDefault();
        var b = c.attr("rel");
        b && GS.Models.Artist.getArtist(b, function (d) {
            d && GS.router.setHash(d.toUrl())
        })
    }, ".sidebar_artist .remove click":function (c, a) {
        a.stopPropagation();
        a.preventDefault();
        var b = c.parent().attr("rel"), d = c.parent().attr("title");
        GS.getLightbox().open({type:"removeSongSidebar", view:{header:"POPUP_REMOVE_FROM_PINBOARD_TITLE", messageHTML:(new GS.Models.DataString($.localize.getString("POPUP_REMOVE_FROM_PINBOARD_MSG"), {name:d, type:$.localize.getString("ARTIST").toLowerCase()})).render(), buttonsLeft:[
            {className:"close",
                label:"CANCEL"}
        ], buttonsRight:[
            {className:"submit shortcut", label:"POPUP_REMOVE_PINBOARD_LABEL"}
        ]}, callbacks:{"button.shortcut":function () {
            GS.user.removeFromShortcuts("artist", b)
        }}});
        return false
    }, "a.sidebar_artist contextmenu":function (c, a) {
        var b = parseInt($(c).attr("rel"), 10);
        b && GS.Models.Artist.getArtist(b, function (d) {
            if (d) {
                d = d.getContextMenu();
                $(c).jjmenu(a, d, null, {xposition:"mouse", yposition:"mouse", show:"show", className:"artistmenu"})
            }
        })
    }, "#pinboard_new click":function (c, a) {
        c.jjmenu(a, this.getPinboardMenu(),
                null, {xposition:"left", yposition:"auto", show:"default", className:"pinboardmenu"})
    }, getPinboardMenu:function () {
        return[
            {title:$.localize.getString("SIDEBAR_CONTEXT_ADD_PLAYLIST"), action:{type:"fn", callback:function () {
                GS.getLightbox().open("newPlaylist", null)
            }, log:function () {
                GS.getGuts().onContextMenuClick("contextNewPlaylist", "pinboard_new", null, null)
            }}, customClass:"jj_menu_item_hasIcon jj_menu_item_add_playlist"},
            {title:$.localize.getString("SIDEBAR_CONTEXT_ADD_STATION"), type:"sub", src:GS.Models.Station.getStationsStartMenuForPinboard(),
                customClass:"stations jj_menu_item_hasIcon jj_menu_item_station"}
        ]
    }, beginDragDrop:function () {
        function c(f, g, k) {
            _.orEqual(k, false);
            if (!($("#sidebar").within(f.clientX, f.clientY).length <= 0)) {
                f = $(".sidebar_link a", "#sidebar").within(f.clientX, f.clientY);
                $("#sidebar .sidebar_link a").removeClass("hover");
                f.length && g.draggedItemsType !== "playlist" && f.addClass("hover")
            }
        }

        function a(f, g) {
            var k = [], m, h;
            f.draggedItemsType = f.draggedItemsType || _.guessDragType(f.draggedItems);
            switch (f.draggedItemsType) {
                case "song":
                    for (m =
                                 0; m < f.draggedItems.length; m++)k.push(f.draggedItems[m].SongID);
                    var n, q = [], s = [];
                    if ($("#grid").controller()) {
                        var w = $("#grid").controller().dataView.rows;
                        $('#grid .slick-row.selected[id!="showQueue"]').each(function (u, z) {
                            n = parseInt($(z).attr("row"), 10);
                            if (!isNaN(n)) {
                                q.push(n + 1);
                                var D = w[n].ppVersion;
                                D && s.push(D)
                            }
                        })
                    }
                    m = {ranks:q, songIDs:k};
                    if (s.length > 0)m.ppVersions = s.join();
                    GS.getGuts().logMultiSongDrag("OLSongsDraggedToSidebar", m);
                    break;
                case "album":
                    var o = function (u) {
                        u.sort(GS.Models.Album.defaultSongSort);
                        for (h = 0; h < u.length; h++)k.push(u[h].SongID)
                    };
                    for (m = 0; m < f.draggedItems.length; m++)f.draggedItems[m].getSongs(o, null, true, {async:false});
                    break;
                case "artist":
                    o = function (u) {
                        u.sort(GS.Models.Artist.defaultSongSort);
                        for (h = 0; h < u.length; h++)k.push(u[h].SongID)
                    };
                    for (m = 0; m < f.draggedItems.length; m++)f.draggedItems[m].getSongs(o, null, {async:false});
                    break;
                case "playlist":
                    o = function (u) {
                        for (h = 0; h < u.length; h++)k.push(u[h].SongID)
                    };
                    for (m = 0; m < f.draggedItems.length; m++)f.draggedItems[m].getSongs(o, null, {async:false});
                    break;
                case "user":
                    o = function (u) {
                        for (h = 0; h < u.length; h++)k.push(u[h].SongID)
                    };
                    for (m = 0; m < f.draggedItems.length; m++)f.draggedItems[m].getFavoritesByType("Song", o, null, {async:false});
                    break;
                default:
                    console.error("sidebar drop, invalid drag type", f, f.draggedItemsType);
                    return
            }
            if (g === "library")GS.user.addToLibrary(k, true); else if (g === "favorites")for (m = 0; m < k.length; m++)GS.user.addToSongFavorites(k[m]); else if (g === "newPlaylist")GS.getLightbox().open("newPlaylist", k); else if (g instanceof GS.Models.Playlist)g.addSongs(k,
                    null, true); else {
                console.error("sidebar drop, invalid thing", g);
                return
            }
            GS.getGuts().gaTrackEvent("sidebar", "dropSuccess")
        }

        var b = $("li.sidebar_myMusic"), d = $("li.sidebar_favorites");
        $("#sidebar_playlists,#sidebar_subscribed_playlists,#sidebar_songs,#sidebar_artists,#sidebar_albums,#sidebar_stations").bind("draginit",function (f, g) {
            var k = $(f.target).closest(".sidebar_link");
            if (k.length === 0)return false;
            g.draggedSidebarItem = k;
            g.proxyOffsetX = f.clientX - k.offset().left;
            g.proxyOffsetY = f.clientY - k.offset().top
        }).bind("dragstart",
                function (f, g) {
                    var k = g.draggedSidebarItem.attr("rel"), m, h;
                    if (g.draggedSidebarItem.hasClass("sidebar_playlist")) {
                        m = "playlist";
                        h = GS.Models.Playlist.getOneSynchronous(k)
                    } else if (g.draggedSidebarItem.hasClass("sidebar_artist")) {
                        m = "artist";
                        h = GS.Models.Artist.getOneSynchronous(k)
                    } else if (g.draggedSidebarItem.hasClass("sidebar_album")) {
                        m = "album";
                        h = GS.Models.Album.getOneSynchronous(k)
                    } else if (g.draggedSidebarItem.hasClass("sidebar_song")) {
                        m = "song";
                        h = GS.Models.Song.getOneSynchronous(k)
                    } else if (g.draggedSidebarItem.hasClass("sidebar_station")) {
                        m =
                                "station";
                        h = GS.Models.Station.getOneFromCache(k)
                    } else return false;
                    if (!h)return false;
                    g.draggedItems = [h];
                    g.draggedIemsType = m;
                    g.draggedItemsSource = "sidebar";
                    g.deleteAction = {label:"CONTEXT_REMOVE_FROM_PINBOARD", method:function () {
                        GS.user.removeFromShortcuts(m, k, true)
                    }};
                    $.publish("gs.drag.start", g);
                    return $('<div class="dragProxy" style="position:absolute; z-index: 99999;"><div class="status"></div></div>').prepend($(g.draggedSidebarItem).clone()).appendTo("body").mousewheel(_.globalDragProxyMousewheel)
                }).bind("drag",
                function (f, g) {
                    g.clientX = f.clientX;
                    g.clientY = f.clientY;
                    $(g.proxy).css({top:f.clientY - g.proxyOffsetY, left:f.clientX - g.proxyOffsetX});
                    var k = false, m = false;
                    _.forEach(g.drop, function (h) {
                        $.isFunction(h.updateDropOnDrag) && h.updateDropOnDrag(f, g);
                        if (!k)if ($(h).within(f.clientX, f.clientY).length > 0)if ($(h).data("ignoreForOverDrop"))m = true; else {
                            m = false;
                            k = true
                        }
                    });
                    m || (k ? $(g.proxy).addClass("valid").removeClass("invalid") : $(g.proxy).addClass("invalid").removeClass("valid"))
                }).bind("dragend",function (f, g) {
                    $(g.proxy).remove();
                    GS.getGuts().gaTrackEvent("sidebar", "dragEnd");
                    $.publish("gs.drag.end", g)
                }).bind("dropinit",function () {
                    this.updateDropOnDrag = function (f, g) {
                        c(f, g, g.draggedItemsType === "playlist")
                    }
                }).bind("dropstart",function (f, g) {
                    if (!g.draggedItems) {
                        this.updateDropOnDrag = null;
                        return false
                    }
                    g.draggedItemsType = g.draggedItemsType || _.guessDragType(g.draggedItems);
                    if (g.draggedItemsSource == "sidebar") {
                        this.updateDropOnDrag = null;
                        return false
                    }
                    if (g.draggedItemsType !== "playlist" || $(this).attr("id") !== "sidebar_playlists") {
                        this.updateDropOnDrag =
                                null;
                        return false
                    }
                }).bind("dropend",function () {
                    $("#sidebar .sidebar_link a").removeClass("hover")
                }).bind("drop", function (f, g) {
                    if ($("#sidebar").width() !== 0) {
                        g.draggedItemsType = g.draggedItemsType || _.guessDragType(g.draggedItems);
                        var k, m;
                        if (g.draggedItemsType === "playlist")for (k = 0; k < g.draggedItems.length; k++) {
                            m = g.draggedItems[k];
                            m.UserID == GS.user.UserID || m.isSubscribed() ? GS.user.addToShortcuts("playlist", m.PlaylistID, m.PlaylistName, true) : GS.user.addToPlaylistFavorites(m.PlaylistID, true)
                        } else {
                            k = $(".playlist",
                                    "#sidebar_playlists").within(f.clientX, f.clientY).attr("rel");
                            m = GS.Models.Playlist.getOneFromCache(k);
                            if (m instanceof GS.Models.Playlist)a(g, m); else k == "new" && a(g, "newPlaylist")
                        }
                    }
                });
        b.bind("dropinit",function () {
            this.updateDropOnDrag = function (f, g) {
                c(f, g, true)
            }
        }).bind("dropstart",function (f, g) {
            if (!g.draggedItems) {
                this.updateDropOnDrag = null;
                return false
            }
        }).bind("dropend",function () {
            $("#sidebar .sidebar_link a").removeClass("hover")
        }).bind("drop", function (f, g) {
            a(g, "library")
        });
        d.bind("dropinit",function () {
            this.updateDropOnDrag =
                    function (f, g) {
                        c(f, g, true)
                    }
        }).bind("dropstart",function (f, g) {
                    if (!g.draggedItems) {
                        this.updateDropOnDrag = null;
                        return false
                    }
                }).bind("dropend",function () {
                    $("#sidebar .sidebar_link a").removeClass("hover")
                }).bind("drop", function (f, g) {
                    a(g, "favorites")
                })
    }});

