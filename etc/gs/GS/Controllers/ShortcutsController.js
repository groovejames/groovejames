(function () {
    function c(k) {
        if (!b) {
            var m = k.draggedItemsType = k.draggedItemsType || _.guessDragType(k.draggedItems);
            if (m != "user") {
                $("#shortcuts").show();
                if (m == "song" && k.draggedItems.length > 1)m = "manySongs";
                var h = _.orEqual(GS.shareTypes[m], []), n = $("#shortcuts_bar .share_option"), q = $("#shortcuts_share_wrapper"), s = GS.user.isLoggedIn && k.draggedItems.length === 1 && g.indexOf(m) !== -1;
                if (!GS.user.isLoggedIn) {
                    h = h.concat();
                    var w = h.indexOf("email");
                    w != -1 && h.splice(w, 1)
                }
                n.hide();
                if (h.length || s) {
                    q.show();
                    _.forEach(h, function (o) {
                        n.filter("." +
                                o).show()
                    });
                    s && n.filter(".broadcast").show()
                } else q.hide();
                $("#shortcuts_add_pinboard").toggle(k.draggedItems.length === 1 && f.indexOf(m) !== -1 && k.draggedItemsSource != "sidebar");
                $("#shortcuts_add_favorites").toggle(m === "song");
                $("#shortcuts_add_library").add("#shortcuts_playlists_wrapper").toggle(m !== "station");
                $("#shortcuts_add_wrapper").toggle($("#shortcuts_add").children(":visible").length > 0);
                $("#shortcuts_scroll").height($("#shortcuts_bar").height());
                if (k.deleteAction) {
                    m = $("#shortcuts_trash_label");
                    $("#shortcuts_trash_wrapper").show();
                    m.removeClass("ellipsis");
                    m.localeDataString(k.deleteAction.label, k.deleteAction.labelParams);
                    m.addClass("ellipsis")
                } else $("#shortcuts_trash_wrapper").hide();
                k = $("#shortcuts_scroll .viewport").innerHeight() < $("#shortcuts_scroll .overview").outerHeight() ? 0 : -15;
                $("#shortcuts_bar").stop().animate({right:k}, "fast", function () {
                    if (d)d.update(); else {
                        d = $("#shortcuts_scroll").tinyscrollbar();
                        d.find(".viewport").scroll(function () {
                            d.update()
                        })
                    }
                });
                b = true
            }
        }
    }

    function a(k) {
        clearTimeout(k.shortcutsAutoScrollWaitTimeout);
        k.shortcutsAutoScrollWaitTimeout = false;
        k.shortcutsAutoScrollHasWaited = false;
        clearInterval(k.shortcutsAutoScrollInterval);
        k.shortcutsAutoScrollInterval = false
    }

    var b = false, d = false, f = ["song", "playlist", "album", "artist", "station"], g = ["song", "playlist", "album", "artist"];
    GS.Controllers.BaseController.extend("GS.Controllers.ShortcutsController", {onElement:"#shortcuts"}, {playlists:[], playlistsDirty:true, init:function () {
        this.subscribe("gs.drag.start", this.callback("onGlobalDragStart"));
        this.subscribe("gs.drag.end",
                this.callback("onGlobalDragEnd"));
        this.subscribe("gs.auth.update", this.callback("dirtyPlaylists"));
        this.subscribe("gs.auth.playlists.update", this.callback("dirtyPlaylists"));
        this._super()
    }, appReady:function () {
        this.update()
    }, update:function () {
        this.element.html(this.view("index"));
        this.beginDragDrop()
    }, dirtyPlaylists:function () {
        this.playlistsDirty = true;
        b && this.populatePlaylists()
    }, populatePlaylists:function () {
        this.playlists = [];
        GS.user && _.forEach(GS.user.playlists, function (k) {
                    this.playlists.push(k)
                },
                this);
        this.playlists.sort(function (k, m) {
            var h = k.PlaylistName.toLowerCase(), n = m.PlaylistName.toLowerCase();
            return h == n ? k == m ? 0 : k < m ? -1 : 1 : h < n ? -1 : 1
        });
        $("#shortcuts_playlists").html(this.view("playlists", {playlists:this.playlists}));
        this.playlistsDirty = false
    }, beginDragDrop:function () {
        function k(o) {
            return function () {
                if (o.hasOwnProperty("clientX") && o.clientX < q.offset().left)a(o); else w = setTimeout(k(o), 100)
            }
        }

        function m(o, u) {
            function z() {
                var F = (new Date).valueOf();
                if (u.shortcutsAutoScrollHasWaited && (!u.shortcutsAutoScrollLast ||
                        F - u.shortcutsAutoScrollLast >= E)) {
                    u.shortcutsAutoScrollLast = F;
                    $scrollable.scrollTop(Math.max(0, $scrollable.scrollTop() - 41))
                }
            }

            function D() {
                var F = (new Date).valueOf();
                if (u.shortcutsAutoScrollHasWaited && (!u.shortcutsAutoScrollLast || F - u.shortcutsAutoScrollLast >= E)) {
                    u.shortcutsAutoScrollLast = F;
                    $scrollable.scrollTop(Math.min(scrollHeight, $scrollable.scrollTop() + 41))
                }
            }

            $scrollable = $("#shortcuts_scroll .viewport");
            var B = Math.ceil($scrollable.height() * 0.2), E = 200;
            scrollHeight = $scrollable[0].scrollHeight;
            if (u.shortcutsAutoScrollWaitTimeout)if ($scrollable.offset().top +
                    B > o.clientY) {
                z();
                clearInterval(u.shortcutsAutoScrollInterval);
                u.shortcutsAutoScrollInterval = setInterval(z, E)
            } else if ($scrollable.offset().top + $scrollable.height() - B < o.clientY) {
                D();
                clearInterval(u.shortcutsAutoScrollInterval);
                u.shortcutsAutoScrollInterval = setInterval(D, E)
            } else a(u); else u.shortcutsAutoScrollWaitTimeout = setTimeout(function () {
                u.shortcutsAutoScrollHasWaited = true;
                u.shortcutsAutoScrollWaitTimeout = false
            }, 500)
        }

        function h(o) {
            var u = [], z, D;
            o.draggedItemsType = o.draggedItemsType || _.guessDragType(o.draggedItems);
            switch (o.draggedItemsType) {
                case "song":
                    for (z = 0; z < o.draggedItems.length; z++)u.push(o.draggedItems[z].SongID);
                    var B, E = [], F = [];
                    if ($("#grid").controller()) {
                        var y = $("#grid").controller().dataView.rows;
                        $('#grid .slick-row.selected[id!="showQueue"]').each(function (C, H) {
                            B = parseInt($(H).attr("row"), 10);
                            if (!isNaN(B)) {
                                E.push(B + 1);
                                var K = y[B].ppVersion;
                                K && F.push(K)
                            }
                        })
                    }
                    o = {ranks:E, songIDs:u};
                    if (F.length > 0)o.ppVersions = F.join();
                    GS.getGuts().logMultiSongDrag("OLSongsDraggedToShortcuts", o);
                    break;
                case "album":
                    var I =
                            function (C) {
                                C.sort(GS.Models.Album.defaultSongSort);
                                for (D = 0; D < C.length; D++)u.push(C[D].SongID)
                            };
                    for (z = 0; z < o.draggedItems.length; z++)o.draggedItems[z].getSongs(I, null, {async:false});
                    break;
                case "artist":
                    I = function (C) {
                        C.sort(GS.Models.Artist.defaultSongSort);
                        for (D = 0; D < C.length; D++)u.push(C[D].SongID)
                    };
                    for (z = 0; z < o.draggedItems.length; z++)o.draggedItems[z].getSongs(I, null, {async:false});
                    break;
                case "playlist":
                    I = function (C) {
                        for (D = 0; D < C.length; D++)u.push(C[D].SongID)
                    };
                    for (z = 0; z < o.draggedItems.length; z++)o.draggedItems[z].getSongs(I,
                            null, {async:false});
                    break;
                case "user":
                    I = function (C) {
                        for (D = 0; D < C.length; D++)u.push(C[D].SongID)
                    };
                    for (z = 0; z < o.draggedItems.length; z++)o.draggedItems[z].getFavoritesByType("Song", I, null, {async:false});
                    break;
                default:
                    console.error("shortcut drop, invalid drag type", o, o.draggedItemsType)
            }
            return u
        }

        function n(o, u) {
            if (u === "library")GS.user.addToLibrary(o, true); else if (u === "favorites")for (i = 0; i < o.length; i++)GS.user.addToSongFavorites(o[i]); else if (u === "newPlaylist")GS.getLightbox().open("newPlaylist", o); else u instanceof
                    GS.Models.Playlist ? u.addSongs(o, null, true) : console.error("shortcut drop, invalid thing", u)
        }

        var q = $("#shortcuts"), s = $("#shortcuts_bar"), w = false;
        q.data("ignoreForOverDrop", true).bind("dropinit",function () {
            this.updateDropOnDrag = function (o, u) {
                if (!(s.within(o.clientX, o.clientY).length <= 0)) {
                    var z = s.find(".shortcuts_link a");
                    z.removeClass("hover");
                    z = z.within(o.clientX, o.clientY);
                    z.addClass("hover");
                    z.length ? $(u.proxy).addClass("valid").removeClass("invalid") : $(u.proxy).addClass("invalid").removeClass("valid")
                }
                m(o,
                        u)
            }
        }).bind("dropend",function (o, u) {
                    u.isOverShortcuts = false;
                    clearTimeout(w);
                    w = setTimeout(k(u), 100)
                }).bind("dropstart",function (o, u) {
                    u.isOverShortcuts = true;
                    clearTimeout(w);
                    if (!u.draggedItems) {
                        this.updateDropOnDrag = null;
                        return false
                    }
                    u.draggedItemsType = u.draggedItemsType || _.guessDragType(u.draggedItems)
                }).bind("drop", function (o, u) {
                    u.draggedItemsType = u.draggedItemsType || _.guessDragType(u.draggedItems);
                    var z = s.find(".shortcuts_link").within(o.clientX, o.clientY).last(), D = z.attr("rel");
                    if (z.is(".share_option"))a:{
                        u.draggedItemsType =
                                u.draggedItemsType || _.guessDragType(u.draggedItems);
                        D = {service:D};
                        switch (u.draggedItemsType) {
                            case "song":
                                D.id = h(u);
                                if (D.id.length == 1) {
                                    D.id = D.id[0];
                                    D.type = "song"
                                } else D.type = "manySongs";
                                break;
                            case "playlist":
                                D.id = u.draggedItems[0].PlaylistID;
                                D.type = "playlist";
                                break;
                            case "album":
                                D.id = u.draggedItems[0].AlbumID;
                                D.type = "album";
                                break;
                            case "artist":
                                D.id = u.draggedItems[0].ArtistID;
                                D.type = "artist";
                                break;
                            default:
                                console.error("shortcut share drop, invalid type", u.draggedItemsType);
                                break a
                        }
                        D.service != "widget" &&
                                D.type != "manySongs" ? GS.getLightbox().open("share", D) : GS.getLightbox().open("widget", D)
                    } else if (z.is(".add_option"))if (z.is(".pinboard")) {
                        z = u.draggedItems[0];
                        switch (u.draggedItemsType) {
                            case "playlist":
                                D = z.PlaylistID;
                                z = z.PlaylistName;
                                break;
                            case "song":
                                D = z.SongID;
                                z = z.SongName;
                                break;
                            case "album":
                                D = z.AlbumID;
                                z = z.AlbumName;
                                break;
                            case "artist":
                                D = z.ArtistID;
                                z = z.ArtistName;
                                break;
                            case "station":
                                D = z.StationID;
                                z = "";
                                break;
                            default:
                                return
                        }
                        GS.user.addToShortcuts(u.draggedItemsType, D, z)
                    } else n(h(u), D); else if (z.is(".playlist_option")) {
                        z =
                                GS.Models.Playlist.getOneFromCache(D);
                        if (z instanceof GS.Models.Playlist)n(h(u), z); else D == "new" && n(h(u), "newPlaylist")
                    } else if (z.is(".trash_option"))u.deleteAction && $.isFunction(u.deleteAction.method) && u.deleteAction.method.call(); else return;
                    GS.getGuts().gaTrackEvent("shortcuts", "dropSuccess")
                })
    }, onGlobalDragStart:function (k) {
        this.playlistsDirty && this.populatePlaylists();
        c(k)
    }, onGlobalDragEnd:function (k) {
        if (b) {
            $("#shortcuts_bar").stop().css({right:-215}).find(".shortcuts_link a").removeClass("hover");
            $("#shortcuts").hide();
            b = false
        }
        a(k)
    }})
})();

