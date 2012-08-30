(function () {
    function c(b) {
        b = b.replace(/\_/g, " ");
        b = _.ucwords(b);
        b = b.replace(/\s/g, "");
        return["GS.Controllers.Page.", b, "Controller"].join("")
    }

    var a = {home:true, song:true, search:true, now_playing:true, settings:true, album:true, artist:true, music:true, user:true, user_music:true, playlist:true, surveys:true, signup:true, promotion:true, features:true};
    GS.Controllers.BaseController.extend("GS.Controllers.PageController", {activePage:null, activePageName:null, activePageIdentifier:null, activePageParams:null, SMALL_APP_LIMIT:1200,
        _element:null, getPageClass:function (b) {
            if (a[b])return GS.ClassLoader.get(c(b)); else {
                b = $.Deferred();
                b.resolve(undefined);
                return b.promise()
            }
        }, activate:function (b, d) {
            if (!this._element)this._element = $("#page");
            $(".slick-reorder-proxy").remove();
            $("#tooltip").stop().remove();
            $application = $("#application");
            if (this.activePageName === b.shortName && this.activePageIdentifier === d.identifier) {
                this.activePageParams = d.params;
                $.publish("gs.page.view", this.activePageName);
                return this.activePage
            }
            this.activePage && this.activePage.destroy();
            this.activePage = new b(this._element);
            this.activePageName = b.shortName;
            this.activePageIdentifier = d.identifier;
            this.activePageParams = d.params;
            /(search|song|album|artist)/i.test(b.shortName) || $("#header_search input.search").val("");
            switch (b.shortName) {
                case "HomeController":
                case "BoxeeController":
                    if (GS.user.settings.local.persistSidebar)setTimeout(function () {
                        GS.getSidebar().show()
                    }, 0); else GS.getSidebar.prototype.inst && GS.getSidebar().hide();
                    $("#theme_home *:not(.themehide)").show();
                    GS.theme.themeCenter();
                    break;
                case "SignupController":
                    GS.getSidebar.prototype.inst && GS.getSidebar().hide();
                    $("#theme_home *").hide();
                    break;
                case "UserMusicController":
                    if (d.identifier == GS.user.UserID || GS.user.settings.local.persistSidebar)GS.getSidebar().show(); else GS.getSidebar.prototype.inst && GS.getSidebar().hide();
                    break;
                case "PlaylistController":
                    if (GS.user.settings.local.persistSidebar || GS.user.playlists[this.activePageIdentifier] && $("#application").width() > GS.page.SMALL_APP_LIMIT)GS.getSidebar().show(); else GS.getSidebar.prototype.inst &&
                    GS.getSidebar().hide();
                    $("#theme_home *").hide();
                    $("ul.ui-autocomplete").remove();
                    break;
                case "AlbumController":
                case "MusicController":
                case "ArtistController":
                case "SearchController":
                case "UserController":
                default:
                    if (GS.user.settings.local.persistSidebar)GS.getSidebar().show(); else GS.getSidebar.prototype.inst && GS.getSidebar().hide();
                    $("#theme_home *").hide();
                    $("ul.ui-autocomplete").remove();
                    break
            }
            if (b.shortName !== "HomeController" && GS.getAd()) {
                $("#sidebarCapital_160").removeClass("capital");
                GS.getAd().hideAdBar()
            }
            GS.getLocale();
            $("#theme_page_header").hide().removeClass("measure");
            $("#theme_page_header_expandable").height(0);
            $.publish("gs.page.view", this.activePageName);
            this.activePage.showPageLoading();
            return this.activePage
        }, titlePrepend:"Grooveshark - ", titlePostpend:" - Grooveshark", title:function (b, d) {
            d = typeof d === "undefined" ? true : d;
            document.title = d ? b + this.titlePostpend : this.titlePrepend + b
        }, ALLOW_LOAD:true, justDidConfirm:false, lastPage:"", confirmMessage:$.localize.getString("ONCLOSE_PAGE_CHANGES"), checkLock:function () {
            if (GS.Controllers.PageController.justDidConfirm ||
                    !GS.Controllers.PageController.ALLOW_LOAD && !confirm($.localize.getString("ONCLOSE_SAVE_PLAYLIST"))) {
                GS.Controllers.PageController.justDidConfirm = true;
                location.replace([location.protocol, "//", location.host, location.pathname, GS.Controllers.PageController.lastPage].join(""));
                setTimeout(function () {
                    GS.Controllers.PageController.justDidConfirm = false
                }, 500);
                return false
            } else {
                GS.Controllers.PageController.justDidConfirm = false;
                GS.Controllers.PageController.ALLOW_LOAD = true;
                GS.Controllers.PageController.lastPage =
                        location.hash;
                GS.Controllers.PageController.confirmMessage = $.localize.getString("ONCLOSE_PAGE_CHANGES");
                $.publish("gs.router.before");
                return true
            }
        }, getActiveController:function () {
            return this.activePage
        }, loadFilterCollapseState:function () {
            this.artistFiltersCollapse = GS.store.get(this.shortName + "_artistFiltersCollapse");
            this.albumFiltersCollapse = GS.store.get(this.shortName + "_albumFiltersCollapse");
            if (!this.artistFiltersCollapse)this.artistFiltersCollapse = {collapsed:true, manualCollapse:true, manualOpen:false};
            if (!this.albumFiltersCollapse)this.albumFiltersCollapse = {collapsed:true, manualCollapse:true, manualOpen:false};
            this.storeFilterCollapseState()
        }, storeFilterCollapseState:function () {
            _.defined(this.artistFiltersCollapse) && GS.store.set(this.shortName + "_artistFiltersCollapse", this.artistFiltersCollapse);
            _.defined(this.albumFiltersCollapse) && GS.store.set(this.shortName + "_albumFiltersCollapse", this.albumFiltersCollapse)
        }, refreshTimeout:null, refreshed:null, resetRefreshButton:function () {
            if ($("#page_content_pane .refresh")) {
                $("#page_content_pane .refresh").addClass("disabled");
                GS.page.refreshTimeout && clearTimeout(GS.page.refreshTimeout);
                GS.page.refreshTimeout = setTimeout(function () {
                    GS.page.refreshed = null;
                    GS.page.refreshTimeout = null;
                    $("#page_content_pane .refresh").removeClass("disabled")
                }, 6E4)
            }
        }, fromCorrectUrl:false}, {url:false, type:false, id:false, subpage:false, pageSearchHasFocus:false, slickbox:null, feed:null, header:{name:false, breadcrumbs:[], imageUrl:false, subpages:[], options:[], labels:[]}, list:{doPlayAddSelect:false, doSearchInPage:false, sortOptions:[], gridOptions:{data:[],
        columns:{}, options:{}}}, cache:{}, init:function () {
        this.subscribe("gs.grid.selectedRows", this.callback("changeSelectionCount"));
        this.subscribe("gs.grid.onsort", this.callback("gridOnSort"));
        this._super();
        $(document).keydown(this.callback(function (b) {
            if (!$(b.target).is("input,textarea,select,object")) {
                var d = _.orEqual(b.keyCode, b.which), f = String.fromCharCode(d).replace(/\s+/g, ""), g = {17:true, 91:true, 93:true, 37:true, 38:true, 39:true, 40:true, 16:true}, k = {9:true, 19:true, 20:true, 27:true, 33:true, 34:true, 35:true,
                    36:true, 45:true, 46:true, 112:true, 113:true, 114:true, 115:true, 116:true, 117:true, 118:true, 119:true, 120:true, 121:true, 122:true, 123:true, 145:true};
                if (!$(b.target).is("input,textarea,select,object"))if (d == 8)history.back(); else f.length && f !== "" && !g[d] && !k[d] && !b.metaKey && !b.ctrlKey && !GS.getLightbox().isOpen && $("#header_search input.search").focus();
                if (String.fromCharCode(d) == " " && $(b.target).val().length === 0)return false
            }
        }));
        $("#tooltip.stayOpen").live({mouseenter:this.callback("delayCloseTooltip"), mouseleave:this.callback("closeTooltip")})
    },
        destroy:function () {
            this.searchTimeout && clearTimeout(this.searchTimeout);
            this._super()
        }, index:function () {
            this.url = location.hash;
            this.element.html(this.view("index"))
        }, notFound:function () {
            GS.Controllers.PageController.activate("home", null).notFound()
        }, showPageLoading:function () {
            if (this.element) {
                this.element.html(this.view("/shared/pageLoading"));
                var b = this.element.find(".page_loading");
                b.css("marginLeft", b.width() / 2 * -1 + "px")
            }
        }, showGridLoading:function (b) {
            $el = _.orEqual(b, $("#grid"));
            $el.html(this.view("/shared/loadingIndicator"));
            b = this.element.find(".page_loading");
            b.css("marginLeft", b.width() / 2 * -1 + "px")
        }, changeSelectionCount:function (b) {
            if (b.type === "song") {
                var d = _.isNumber(b.len) && b.len > 0 ? b.len : 0, f = $("#page .page_controls");
                if (d) {
                    f.find(".play.count .label").localeDataString("SELECTION_PLAY_COUNT", {count:d});
                    f.find(".addSongs.count .label").localeDataString("SELECTION_ADD_COUNT", {count:d});
                    f.find(".deleteSongs.count .label").localeDataString("SELECTION_DELETE_COUNT", {count:d})
                } else {
                    f.find(".play.count .label").localeDataString("SELECTION_PLAY_ALL");
                    f.find(".addSongs.count .label").localeDataString("SELECTION_ADD_ALL");
                    f.find(".deleteSongs.count .label").localeDataString("SELECTION_DELETE_ALL")
                }
                f.find(".music_options").toggleClass("hide", d === 0);
                var g = $("#page").attr("class").split("_")[2];
                g = b.len > 0 ? "song" : g;
                var k = f.find("a[name=share]");
                k.parent().hide();
                var m = GS.shareTypes[g];
                if (m) {
                    f.find("button.share").parent().show();
                    $.each(m, function (h, n) {
                        k.filter("[rel=" + n + "]").show().parent().show().removeClass("hide")
                    })
                } else f.find("button.share").parent().hide();
                m = f.find(".share .label");
                if (g === "song")d > 1 ? m.localeDataString("SHARE_SONGS") : m.localeDataString("SHARE_SONG"); else m.localeDataString("SHARE_" + g.toUpperCase());
                if (b.len != 1)g === "playlist" ? f.find("li.shareOptions").show() : f.find("li.shareOptions .share_single").hide(); else {
                    f.find("li.shareOptions").show();
                    f.find("li.shareOptions share_single").show()
                }
                f.find("button.deleteSongs").parent().toggle(b.len > 0);
                $("#page").hasClass("gs_page_now_playing") && f.find("button.delete").toggle(b.len > 0)
            }
        }, correctUrl:function (b, d) {
            function f(g) {
                if ($.isFunction(g.toUrl)) {
                    g = g.toUrl(d);
                    if (window.location.hash !== g) {
                        var k = location.hash.match(/(?:&|\?)fb_comment_id=([a-zA-Z0-9\_\-]+)/);
                        if (k && k[1])g += k[0];
                        if (window.location.hash.replace(/src=\d/, "") !== g.replace(/src=\d/, "")) {
                            GS.page.fromCorrectUrl = true;
                            GS.router.replaceHash(g)
                        }
                    }
                }
            }

            if (b)$.isFunction(b.getPathName) ? b.getPathName(f) : f(b); else console.warn("invalid page.correctUrl obj", b, d)
        }, gridOnSort:function (b) {
            b && b.sortStoreKey && GS.store.set(b.sortStoreKey, b)
        }, getPlayContext:function () {
            var b;
            switch (this.Class.shortName) {
                case "PlaylistController":
                    if (this.hasOwnProperty("playlist") && this.playlist instanceof GS.Models.Playlist)b = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_PLAYLIST, this.playlist);
                    break;
                case "ArtistController":
                    if (this.hasOwnProperty("artist") && this.artist instanceof GS.Models.Artist)b = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_ARTIST, this.artist);
                    break;
                case "AlbumController":
                    if (this.hasOwnProperty("album") && this.album instanceof GS.Models.Album)b = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_ALBUM,
                            this.album);
                    break;
                case "UserController":
                case "UserMusicController":
                    if (this.hasOwnProperty("user") && (this.user instanceof GS.Models.User || this.user instanceof GS.Models.AuthUser))b = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_USER, this.user);
                    break;
                case "MusicController":
                    if (this.subpage == "popular")b = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_POPULAR);
                    break;
                case "SearchController":
                    b = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_SEARCH, {query:this.query, type:this.type ? this.type : "everything"});
                    break
            }
            return _.orEqual(b, new GS.Models.PlayContext)
        }, setSort:function (b, d, f) {
            var g = $("#grid").controller(), k = GS.page.activePage;
            if (g)b == "Rank" ? g.dataView.setItems(g.data) : g.grid.onSort(b); else if (k.slickbox) {
                g = {};
                switch (k.type) {
                    case "playlist":
                        switch (b) {
                            case "Rank":
                                g = {sortType:"relevance", sortFunction:null};
                                break;
                            case "PlaylistName":
                                g = {sortType:"playlistName", sortFunction:_.getSort("PlaylistName", true)};
                                break
                        }
                        break;
                    case "artist":
                        switch (b) {
                            case "Rank":
                                g = {sortType:"relevance", sortFunction:null};
                                break;
                            case "ArtistName":
                                g = {sortType:"artistName", sortFunction:_.getSort("ArtistName", true)};
                                break
                        }
                        break;
                    case "album":
                        switch (b) {
                            case "Rank":
                                g = {sortType:"relevance", sortFunction:null};
                                break;
                            case "AlbumName":
                                g = {sortType:"albumName", sortFunction:_.getSort("AlbumName", true)};
                                break;
                            case "ArtistName":
                                g = {sortType:"artistname", sortFunction:_.getSort("ArtistName", true)};
                                break
                        }
                        break;
                    case "user":
                        switch (b) {
                            case "Rank":
                                g = {sortType:"byPicture", sortFunction:k.sortByPicture};
                                break;
                            case "Name":
                                g = {sortType:"username", sortFunction:_.getSort("Username",
                                        true)};
                                break
                        }
                }
                if (k.currentSort && g && k.currentSort.sortType == g.sortType || !k.currentSort.sortFunction && !g.sortFunction)return;
                k.slickbox.setSort(g.sortFunction);
                k.currentSort = g
            }
            b = d.find("span.label");
            b.attr("data-translate-text", f);
            b.text($.localize.getString(f))
        }, getPlayMenu:function () {
            var b = this.getPlayContext(), d = this.getSongsIDsFromSelectedGridRows(), f = this.element;
            return[
                {title:$.localize.getString("PLAY_NOW"), action:{type:"fn", callback:function () {
                    d.length && GS.player.addSongsToQueueAt(d, GS.player.INDEX_DEFAULT,
                            true, b)
                }, log:function () {
                    GS.getGuts().objectListPlayAdd(d, f, "play")
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play"},
                {title:$.localize.getString("PLAY_NEXT"), action:{type:"fn", callback:function () {
                    d.length && GS.player.addSongsToQueueAt(d, GS.player.INDEX_NEXT, false, b)
                }, log:function () {
                    GS.getGuts().objectListPlayAdd(d, f, "play")
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_next"},
                {title:$.localize.getString("PLAY_LAST"), action:{type:"fn", callback:function () {
                    d.length && GS.player.addSongsToQueueAt(d,
                            GS.player.INDEX_LAST, false, b)
                }, log:function () {
                    GS.getGuts().objectListPlayAdd(d, f, "play")
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_last"},
                {customClass:"separator"},
                {title:$.localize.getString("REPLACE_QUEUE"), action:{type:"fn", callback:function () {
                    d.length && GS.player.addSongsToQueueAt(d, GS.player.INDEX_REPLACE, true, b)
                }, log:function () {
                    GS.getGuts().objectListPlayAdd(d, f, "play")
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_replace_playlist"},
                {title:$.localize.getString("START_RADIO"),
                    action:{type:"fn", callback:function () {
                        if ($("#grid").controller().selectedRowIDs.length)d.length && GS.player.addSongsToQueueAt(d, GS.player.INDEX_REPLACE, true, b, true); else GS.player.addSongsToQueueAt(d[0], GS.player.INDEX_REPLACE, true, b, true)
                    }, log:function () {
                        GS.getGuts().objectListPlayAdd(d, f, "play")
                    }}, customClass:"jj_menu_item_hasIcon jj_menu_item_new_station"}
            ]
        }, getAddMenu:function () {
            var b = this.getPlayContext(), d = this.getSongsIDsFromSelectedGridRows(), f = this.element, g = $("#grid").controller();
            g = g ? g.selectedRowIDs.length :
                    0;
            var k = [
                {title:$.localize.getString("CONTEXT_ADD_TO_QUEUE"), action:{type:"fn", callback:function () {
                    d.length && GS.player.addSongsToQueueAt(d, GS.player.INDEX_LAST, false, b)
                }, log:function () {
                    GS.getGuts().objectListPlayAdd(d, f, "add")
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_now_playing"}
            ];
            if (this.type && d.length && (this.type != "artist" || g !== 0) && !(this.type == "song" && this.song && this.song.fromLibrary) && GS.page.activePageName != "UserMusicController")k.push({title:$.localize.getString("CONTEXT_ADD_TO_LIBRARY"),
                action:{type:"fn", callback:function () {
                    d.length && GS.user.addToLibrary(d)
                }, log:function () {
                    GS.getGuts().objectListPlayAdd(d, f, "add")
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_music"});
            this.song && this.type == "song" && !this.song.isFavorite && k.push({title:$.localize.getString("CONTEXT_ADD_TO_FAVORITES"), action:{type:"fn", callback:function () {
                d.length == 1 && GS.user.addToSongFavorites(d[0], true)
            }, log:function () {
                GS.getGuts().objectListPlayAdd(d, this.element, "add")
            }}, customClass:"jj_menu_item_hasIcon jj_menu_item_favorites"});
            if (this.type != "artist" || g !== 0)k.push({title:$.localize.getString("CONTEXT_ADD_TO_PLAYLIST"), type:"sub", src:GS.Models.Playlist.getPlaylistsMenu(d, function (h) {
                h.addSongs(d, null, true)
            }, false, true), customClass:"jj_menu_item_hasIcon jj_menu_item_add_playlist"});
            if (this.song && this.type == "song") {
                var m = this.song.SongID;
                GS.user.getIsShortcut("song", m) ? k.push({title:$.localize.getString("CONTEXT_REMOVE_FROM_PINBOARD"), action:{type:"fn", callback:function () {
                    GS.user.removeFromShortcuts("song", m);
                    $("#page_header a[name=shortcut]").parent().show();
                    $("#page_header a[name=removeshortcut]").parent().hide()
                }}, customClass:"jj_menu_item_hasIcon jj_menu_remove_music"}) : k.push({title:$.localize.getString("CONTEXT_ADD_TO_PINBOARD"), action:{type:"fn", callback:function () {
                    GS.user.addToShortcuts("song", m, songName, true);
                    $("#page_header a[name=shortcut]").parent().hide();
                    $("#page_header a[name=removeshortcut]").parent().show()
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_pinboard"})
            }
            return k
        }, getSortMenu:function () {
            return[]
        }, getOptionMenu:function () {
            return[]
        },
        "input focus":function (b) {
            $(b).parent().parent().addClass("active")
        }, "textarea focus":function (b) {
            $(b).parent().parent().parent().addClass("active")
        }, "input blur":function (b) {
            $(b).parent().parent().removeClass("active")
        }, "textarea blur":function (b) {
            $(b).parent().parent().parent().removeClass("active")
        }, lastClickEvent:null, doubleClickTime:500, "button click":function (b, d) {
            if (this.lastClickEvent && this.lastClickEvent.target == d.target && d.timeStamp - this.lastClickEvent.timeStamp < this.doubleClickTime) {
                d.stopImmediatePropagation();
                this.lastClickEvent = d;
                return false
            }
            this.lastClickEvent = d
        }, "button.radio click":function (b) {
            b = $(b).attr("data-artists").split(",");
            b.length && GS.player.setAutoplay(true, null, {seeds:b, seedArtistWeightRange:[110, 130], secondaryArtistWeightModifier:0.75})
        }, ".play.dropdownButton click":function (b, d) {
            b.jjmenu(d, this.getPlayMenu(), null, {xposition:"left", yposition:"auto", show:"default", className:"contextmenu", keepState:b, shouldLog:true})
        }, ".addSongs.dropdownButton click":function (b, d) {
            b.jjmenu(d, this.getAddMenu(),
                    null, {xposition:"left", yposition:"auto", show:"default", className:"contextmenu", keepState:b, shouldLog:true})
        }, ".dropdownButton.sort click":function (b, d) {
            var f = this.getSortMenu();
            f && f.length ? b.jjmenu(d, f, null, {xposition:"left", yposition:"auto", show:"default", className:"contextmenu", keepState:b}) : console.warn("no menu")
        }, ".shareOptions .share click":function () {
            var b = this.getSongsIDsFromSelectedGridRows(), d = b > 1 ? "song" : "manySongs", f = $("#grid").controller().grid, g = {};
            if (d == "song") {
                GS.getLightbox().open("share",
                        {type:d, id:b[0]});
                g.ranks = f.getSelectedRows()[0] + 1;
                g.songIDs = this.getSongsIDsFromSelectedGridRows()[0]
            } else {
                GS.getLightbox().open("widget", {type:d, id:b});
                b = f.getSelectedRows();
                _.forEach(b, function (k, m, h) {
                    h[m] = k + 1
                });
                b.sort(_.numSortA);
                g.ranks = b.join();
                g.songIDs = this.getSongsIDsFromSelectedGridRows().join()
            }
            GS.getGuts().logEvent("OLShare", g)
        }, ".dropdownButton.option click":function (b, d) {
            var f = this.getOptionMenu();
            b.jjmenu(d, f, null, {xposition:"left", yposition:"auto", show:"default", className:"contextmenu",
                keepState:b})
        }, ".dropdownButton.shop click":function (b, d) {
            var f = this.getShopMenu();
            b.jjmenu(d, f, null, {xposition:"left", yposition:"auto", show:"default", className:"contextmenu", keepState:b})
        }, ".play.playTop click":function () {
            var b = this.getSongsIDsFromSelectedGridRows();
            b.length && GS.player.addSongsToQueueAt(b, GS.Controllers.PlayerController.INDEX_DEFAULT, true, this.getPlayContext());
            GS.getGuts().objectListPlayAdd(b, this.element, "play")
        }, "#page_header .upload click":function () {
            GS.user.isLoggedIn ? window.open("http://" +
                    location.host + "/upload", "_blank") : GS.getLightbox().open("login")
        }, "#page .dropdownButton click":function () {
            function b(f) {
                if (f.target !== d.target) {
                    f.data.$groups.removeClass("active");
                    $(this).unbind("click", b)
                }
            }

            var d;
            return function (f, g) {
                d = g;
                var k = $("#page .btn_group"), m = $(f).closest(".btn_group");
                if (m.hasClass("active"))k.removeClass("active"); else {
                    k.removeClass("active");
                    m.addClass("active");
                    $(document).unbind("click contextmenu", b).bind("click contextmenu", {$groups:k}, b)
                }
            }
        }(), ".display_toggles .slickbox click":function (b) {
            if (this.displayMethod !=
                    "slickbox") {
                this.displayResults("slickbox");
                GS.store.set("searchDisplay", "slickbox");
                $("#page_header .display_toggles button").removeClass("active");
                b.addClass("active")
            }
        }, ".display_toggles .grid click":function (b) {
            if (this.displayMethod != "grid") {
                this.displayResults("grid");
                GS.store.set("searchDisplay", "grid");
                $("#page_header .display_toggles button").removeClass("active");
                b.addClass("active")
            }
        }, getSongsIDsFromSelectedGridRows:function () {
            var b = $("#grid").controller(), d = [];
            if (b && b.selectedRowIDs.length >
                    0)d = b.selectedRowIDs; else if (b)for (var f = 0; f < b.dataView.rows.length; f++) {
                if (d.length >= 1E3)break;
                d.push(b.dataView.rows[f].SongID)
            } else this.type === "song" && this.song && d.push(this.song.SongID);
            return d
        }, ".inPageFilter input keydown":function (b, d) {
            if (d.which == _.keys.ENTER && !b.parents("form").hasClass("inPageSearch")) {
                d.preventDefault();
                d.stopPropagation()
            } else if (d.which == _.keys.ESC && !b.parents("form").hasClass("inPageSearch")) {
                var f = $("#page_search_results");
                if (f.is(":visible")) {
                    f.hide();
                    $.publish("gs.menu.hide")
                } else {
                    b.siblings("a.remove").addClass("hide");
                    b.val("")
                }
            }
            b.siblings("a.remove").toggleClass("hide", !b.val().length);
            this.inpageFilter(b)
        }, ".inPageSearch input keydown":function (b, d) {
            var f = $("#page_search_results li.selected");
            switch (d.which) {
                case _.keys.ENTER:
                    b.parents("form").submit();
                    return;
                case _.keys.ESC:
                    f = $("#page_search_results");
                    if (f.is(":visible")) {
                        f.hide();
                        $.publish("gs.menu.hide")
                    } else {
                        b.siblings("a.remove").addClass("hide");
                        b.val("");
                        this.inpageSearch(b)
                    }
                    return;
                case _.keys.UP:
                    f.is(":first-child") ? $("#page_search_results li:last").addClass("selected") :
                            f.prev().addClass("selected");
                    f.removeClass("selected");
                    return;
                case _.keys.DOWN:
                    f.is(":last-child") ? $("#page_search_results li:first").addClass("selected") : f.next().addClass("selected");
                    f.removeClass("selected");
                    return
            }
            b.siblings("a.remove").toggleClass("hide", !b.val().length);
            this.inpageSearch(b)
        }, filterTimeout:false, searchTimeout:false, searchTimeoutWait:100, inpageSearch:function (b) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(this.callback(function () {
                if (this.element) {
                    this.element.find(".gs_grid:last").controller();
                    var d = $.trim(b.val().toLowerCase());
                    if (d.length > 0)GS.service.getAutocomplete(d, "artist", this.callback("autocompleteSuccess"), this.callback("autocompleteFail")); else {
                        $("#page_search_results").hide();
                        $.publish("gs.menu.hide")
                    }
                }
            }), this.searchTimeoutWait)
        }, inpageFilter:function (b) {
            clearTimeout(this.filterTimeout);
            this.filterTimeout = setTimeout(this.callback(function () {
                if (this.element) {
                    var d = this.element.find(".gs_grid:last").controller(), f = $.trim($(b).val().toLowerCase());
                    if (d) {
                        var g = f;
                        if ($("#page").is(".gs_page_search") &&
                                _.isString(this.query))if (f.indexOf(this.query.toLowerCase()) === 0)g = f.substring(this.query.length);
                        d.searchString = $.trim(g);
                        d.dataView.refresh()
                    } else if ($("#feed.events").length)if (f === "")$("#feed.events .event").show(); else {
                        (new Date).getTime();
                        $("#feed.events .event").each(function () {
                            var k = $(this);
                            k.text().toLowerCase().indexOf(f) !== -1 ? k.show() : k.hide()
                        });
                        (new Date).getTime()
                    } else this.slickbox && this.filterUsers(f)
                }
            }), this.searchTimeoutWait)
        }, ".inPageSearchBar input focus":function (b) {
            b.siblings(".placeholder").hide();
            this.pageSearchHasFocus = true
        }, ".inPageSearchBar input blur":function (b) {
            if (!b.val()) {
                b.siblings(".placeholder").show();
                b.siblings("a.remove").addClass("hide")
            }
            setTimeout(this.callback(function () {
                if (!this.pageSearchHasFocus) {
                    $("#page_search_results").hide();
                    $.publish("gs.menu.hide")
                }
            }), 500);
            this.pageSearchHasFocus = false
        }, ".inPageSearchBar .search-item a click":function (b) {
            $("#page_search_results li.selected").removeClass("selected");
            $(b).parent().addClass("selected");
            $(b).is(".search-item") && b.closest("input").val($(b).text());
            b.submit()
        }, ".inPageSearchBar a.icon click":function (b) {
            b.siblings("input").focus().select()
        }, ".inPageSearchBar a.remove click":function (b) {
            b.addClass("hide");
            var d = b.siblings("input");
            b = b.parents("form");
            d.val("").focus();
            $("#page_search_results").hide();
            $.publish("gs.menu.hide");
            b.hasClass("inPageSearch") && this.inpageSearch(d);
            b.hasClass("inPageFilter") && this.inpageFilter(d)
        }, ".inPageSearchBar submit":function (b, d) {
            d.preventDefault();
            GS.search = _.orEqual(GS.search, {});
            GS.search.type = $(b).attr("data-search-type") ||
                    "";
            var f = $("#page_search_results li.selected");
            GS.search.query = f.is(".search-item-result") ? f.find("a").text() : $("input[name=q]", b).val();
            if (GS.search.query && GS.search.query.length) {
                this.pageSearchHasFocus = false;
                GS.router.performSearch(GS.search.type, GS.search.query)
            }
        }, autocompleteSuccess:function (b) {
            this.autocompleteResults = b;
            $("#page_search_results").html(this.view("/shared/pageSearchResults"));
            if (this.pageSearchHasFocus) {
                $("#page_search_results").show();
                $.publish("gs.menu.show")
            }
        }, autocompleteFail:function () {
            $("#page_search_results").hide().find(".search-item").remove();
            $.publish("gs.menu.hide")
        }, addAutocomplete:function (b) {
            if (!(GS.getGuts().currentTest && GS.getGuts().currentTest.name == "autocomplete")) {
                b = _.orEqual(b, $("#page").attr("class"));
                b.match(".gs_page_") || (b = ".gs_page_" + b);
                $("input.search.autocomplete", this.element).autocomplete({scroll:true, matchSubset:false, selectFirst:false, source:function (d, f) {
                    if (d = $.trim(d.term || d)) {
                        var g = [], k = $("#searchBar_precomplete");
                        k.hide();
                        GS.service.getAutocomplete(d, "artist", function (m) {
                            if ($("#page").is(b)) {
                                m && m.length && $.each(m,
                                        function (n, q) {
                                            q.hasOwnProperty("Name") && q.hasOwnProperty("ArtistID") && g.push({label:q.Name.toString(), value:q.ArtistID})
                                        });
                                if (b == ".gs_page_home" && g.length) {
                                    m = $("#searchBar_input input").val();
                                    var h = g[0].label;
                                    h = [h.substring(0, m.length), h.substring(m.length)];
                                    m == d && m.toLowerCase() == h[0].toLowerCase() ? k.text(m + h[1]).show() : k.text("").hide()
                                } else k.text("").hide();
                                f(g)
                            }
                        }, function () {
                        })
                    }
                }, select:function (d, f) {
                    d.preventDefault();
                    b == ".gs_page_home" && parseInt(f.item.value, 10) ? GS.router.setHash("/artist/~/" +
                            f.item.value) : $("input.search.autocomplete").val(f.item.label).submit()
                }, focus:function (d, f) {
                    d.preventDefault();
                    $("#searchBar_input input").val(f.item.label);
                    $("#searchBar_precomplete").hide()
                }, close:function () {
                    $("#searchBar_precomplete").show()
                }})
            }
        }, getPlayOptionsMenuForFeeds:function (b) {
            return[
                {title:$.localize.getString("PLAY_NOW"), action:{type:"fn", callback:function () {
                    b.playSongs(-1, true)
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play"},
                {title:$.localize.getString("PLAY_NEXT"), action:{type:"fn",
                    callback:function () {
                        b.playSongs(-2, false)
                    }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_next"},
                {title:$.localize.getString("PLAY_LAST"), action:{type:"fn", callback:function () {
                    b.playSongs(-3, false)
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_last"},
                {title:$.localize.getString("REPLACE_QUEUE"), action:{type:"fn", callback:function () {
                    b.playSongs(-4, true)
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_replace_playlist"}
            ]
        }, scroll:function (b) {
            $page = $(b);
            $controls = $(".page_controls");
            $sticky =
                    $(".page_controls .sticky");
            $("#tooltip").length && this.closeTooltip();
            if ($sticky.length) {
                $sticky.width($controls.width());
                $sticky.hasClass("fixed") || $controls.height($controls.height());
                if ($controls.offset().top < 59)$sticky.addClass("fixed"); else {
                    $sticky.removeClass("fixed");
                    $controls.height("auto")
                }
            }
        }, "#feed.events .play.dropdownButton click":function (b, d) {
            var f = $(b).closest(".event").data("event");
            f ? b.jjmenu(d, this.getPlayOptionsMenuForFeeds(f), null, {xposition:"left", yposition:"auto", show:"default",
                className:"contextmenu", keepState:b}) : console.warn("feed data not attached")
        }, "#feed.events button[name=play] click":function (b) {
            $(b).closest(".event").data("event").playSongs(-1, true)
        }, "#feed.events .event .songLink click":function (b, d) {
            d.preventDefault();
            var f = $(b).closest(".event");
            f = $(f).data("event");
            var g;
            f = GS.Models.Song.wrapCollection(f.data.songs);
            if (_.defined($(b).attr("data-songid"))) {
                g = parseInt($(b).attr("data-songid"), 10);
                g = GS.Models.Song.getOneFromCache(g)
            } else {
                var k = _.defined($(b).attr("data-song-index")) ?
                        parseInt($(b).attr("data-song-index"), 10) : 0;
                if (f.length > 0)g = f[k]
            }
            (g = g && $.isFunction(g.toUrl) ? g.toUrl() : false) && GS.router.setHash(g)
        }, "#feed.events .event button.subscribe click":function (b) {
            var d = $(b).closest(".event").data("event").data.playlists[0].playlistID;
            GS.Models.Playlist.getPlaylist(d, this.callback("subscribePlaylist", b), this.callback("subscribePlaylistError"), false)
        }, subscribePlaylist:function (b, d) {
            if (d.isSubscribed()) {
                GS.user.removeFromPlaylistFavorites(d.PlaylistID);
                b.find("span.label").localeDataString("PLAYLIST_SUBSCRIBE")
            } else {
                GS.user.addToPlaylistFavorites(d.PlaylistID);
                b.find("span.label").localeDataString("PLAYLIST_UNSUBSCRIBE")
            }
        }, subscribePlaylistError:function () {
            $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_FAVORITE_ERROR_GENERAL")})
        }, "#feed.events .event .showSongs click":function (b) {
            b = $(b).closest(".event");
            var d = $(b).data("event"), f = $(b).find(".songWrapper"), g = $(b).find(".songList");
            if (g.children().length)f.toggle(); else {
                var k = GS.Models.Song.wrapCollection(d.data.songs);
                f.css("visibility", "hidden").show();
                oldCols = GS.Controllers.GridController.columns.song.concat();
                d = [oldCols[0], oldCols[1], oldCols[2]];
                g.gs_grid(k, d, {sortCol:"Sort", padding:0});
                $(window).resize();
                f.css("visibility", "visible")
            }
            f = g.is(":visible") ? $.localize.getString("FEED_HIDE_SONGS") : $.localize.getString("FEED_VIEW_SONGS");
            $(b).find("button.showSongs .label").text(f)
        }, "#feed.events .event .remove click":function (b) {
            var d = $(b).closest(".event");
            b = parseInt($(b).attr("rel"), 10);
            b == GS.user.UserID ? $(".warning", d).attr("data-translate-text", "FEED_REMOVE_ACTIVITY_WARNING").attr("rel", b).html($.localize.getString("FEED_REMOVE_ACTIVITY_WARNING")).show() :
                    $(".warning", d).attr("data-translate-text", "FEED_HIDE_USER_WARNING").attr("rel", b).html($.localize.getString("FEED_HIDE_USER_WARNING")).show()
        }, "#feed.events .event .removeComment click":function (b) {
            var d = $(b).closest(".feedComment");
            b = $(b).attr("rel");
            $(".warning", d).attr("data-translate-text", "FEED_REMOVE_COMMENT_WARNING").attr("rel", b).html($.localize.getString("FEED_REMOVE_COMMENT_WARNING")).show()
        }, "#feed.events .event .warning .yesRemove click":function (b) {
            var d = $(b).closest(".event"), f = $(d).data("event");
            b = parseInt($(b).parent().attr("rel"), 10);
            if (b == GS.user.UserID) {
                d.remove();
                f.remove()
            } else {
                this.find("#feed .user_" + b).remove();
                GS.user.changeFollowFlags([
                    {userID:b, flags:1}
                ])
            }
            $(".warning", d).hide()
        }, "#feed.events .event .warning .noRemove click":function (b) {
            b = $(b).closest(".event");
            $(".warning", b).hide()
        }, "#feed.events .event .warning .yesRemoveComment click":function (b) {
            var d = $(b).closest(".event"), f = $(b).closest(".feedComment");
            b = $(b).parents(".warning").attr("rel");
            var g = $(d).data("event");
            g.removeComment(b);
            f.remove();
            if (g.comments.length)g.comments.length == 1 ? d.find(".showCommentForm .label").html($.localize.getString("FEED_COMMENTS_COUNT_ONE")) : d.find(".showCommentForm .label").html(_.getString("FEED_COMMENTS_COUNT", {count:g.comments.length})); else {
                d.find(".commentWrapper").hide();
                d.find(".showCommentForm .label").html($.localize.getString("FEED_COMMENT"))
            }
        }, "#feed.events .event .warning .noRemoveComment click":function (b) {
            b = $(b).closest(".feedComment");
            $(".warning", b).hide()
        }, "#feed.events .event .showCommentForm click":function (b) {
            b =
                    $(b).closest(".event");
            $(b).data("event");
            var d = $(b).find(".commentFormWrapper");
            $(b).find(".commentFormWrapper").hasClass("hide") || d.html(this.view("community/eventCommentForm"));
            d.find(".message").select()
        }, ".feedCommentForm .message keydown":function (b, d) {
            if (d.which == _.keys.ENTER)return false
        }, ".feedCommentForm .message keyup":function (b, d) {
            if (d.which == _.keys.ENTER) {
                d.preventDefault();
                d.stopPropagation();
                b.parents(".feedCommentForm").submit();
                return false
            }
        }, ".feedCommentForm submit":function (b, d) {
            d.preventDefault();
            var f = $(b).closest(".event"), g = $(f).data("event"), k = $("textarea[name=message]", f).val(), m = $(".feedCommentForm .error");
            k = $.trim(k);
            if (k.length) {
                m.hide();
                g.addComment(k, this.callback(this.commentSuccess, f), this.callback(this.commentFailed, f))
            } else m.show().find(".message").html($.localize.getString("FEED_COMMENT_ERROR_EMPTY"))
        }, commentSuccess:function (b, d) {
            if (d) {
                var f = $(b).data("event");
                $(b).find(".commentFormWrapper").html("");
                $(b).find(".commentWrapper").append(this.view("community/eventComments",
                        {comments:[f.comments[f.comments.length - 1]], event:f})).show();
                f.comments.length == 1 ? b.find(".showCommentForm .label").html($.localize.getString("FEED_COMMENTS_COUNT_ONE")) : b.find(".showCommentForm .label").html(_.getString("FEED_COMMENTS_COUNT", {count:f.comments.length}))
            } else this.commentFailed(b, d)
        }, commentFailed:function (b, d) {
            $(".feedCommentForm .error").show().find(".message").html($.localize.getString("FEED_COMMENT_ERROR"));
            console.warn("commentFailed", d)
        }, "#feed.events .event .showMoreComments click":function (b) {
            var d =
                    $(b).closest(".event"), f = $(d).data("event");
            $(d).find(".commentWrapper").html(this.view("community/eventComments", {comments:f.comments, event:f}));
            $(b).remove()
        }, ".feeds_loadMore click":function (b) {
            if (this.feed) {
                this.feed.next(this.callback("showNextFeedPage"));
                $(".showMore", b).hide().siblings().show()
            }
        }, showNextFeedPage:function (b) {
            if (b && b.length) {
                this.activity = b;
                $("#feed").append(this.view("/user/community/feedEvents"));
                for (var d = 0; d < b.length; d++) {
                    event = b[d];
                    $event = $("#feedEvent_" + event.eventID).data("event",
                            event);
                    event.dataString && event.dataString.hookup($event.find("p.what"))
                }
            }
            $(".feeds_loadMore .loading").hide().siblings().show();
            this.feed.hasMore || $(".feeds_loadMore").hide()
        }, ".slick-row .song .options .favorite click":function (b) {
            var d = b.attr("rel"), f = parseInt($(b).parents(".slick-row").attr("row"), 10), g = f + 1, k = "";
            if ($("#grid").controller())k = $("#grid").controller().data[f].ppVersion;
            f = {songID:d, rank:g};
            if (k)f.ppVersion = k;
            if (b.is(".isFavorite")) {
                GS.user.removeFromSongFavorites(d);
                b.removeClass("isFavorite")
            } else {
                GS.user.addToSongFavorites(d);
                b.addClass("isFavorite");
                GS.getGuts().songItemFavoriteClick(f)
            }
        }, ".slick-row .song .options .library click":function (b) {
            var d = b.attr("rel"), f = parseInt($(b).parents(".slick-row").attr("row"), 10), g = f + 1, k = $("#grid"), m = "";
            if (k.controller()) {
                k = k.controller().data;
                if (k[f] && k[f].ppVersion)m = k[f].ppVersion
            }
            f = {songID:d, rank:g};
            if (m)f.ppVersion = m;
            if (b.parent().is(".inLibrary")) {
                GS.user.removeFromLibrary(d);
                b.parent().removeClass("inLibrary")
            } else {
                GS.user.addToLibrary([d]);
                b.parent().addClass("inLibrary");
                GS.getGuts().songItemLibraryClick(f)
            }
        },
        ".slick-row .playlist .subscribe click":function (b) {
            var d = b.attr("rel"), f = GS.Models.Playlist.getOneFromCache(d);
            if (!f && GS.user.PageNameData.CollabPlaylists)f = GS.Models.Playlist.wrap(GS.user.PageNameData.CollabPlaylists[d], false);
            if (f.isSubscribed()) {
                GS.user.removeFromPlaylistFavorites(d);
                b.removeClass("subscribed").find("span.label").text($.localize.getString("PLAYLIST_SUBSCRIBE"))
            } else {
                GS.user.addToPlaylistFavorites(d);
                b.addClass("subscribed").find("span.label").text($.localize.getString("PLAYLIST_UNSUBSCRIBE"))
            }
        },
        ".slick-row .playlist .removePlaylist click":function (b) {
            b = b.attr("rel");
            var d = GS.Models.Playlist.getOneFromCache(b);
            if (!d && GS.user.PageNameData.CollabPlaylists)d = GS.Models.Playlist.wrap(GS.user.PageNameData.CollabPlaylists[b], false);
            d.setCollaborativePermissions(GS.user.UserID, -1)
        }, ".slick-cell.song a.more click":function (b, d) {
            var f = $(b).attr("rel"), g = GS.Models.Song.getOneFromCache(f);
            f = $(b).parents(".slick-row").attr("row");
            var k = $(b).parents(".gs_grid").controller(), m = {}, h;
            if ($("#page").is(".gs_page_now_playing")) {
                h =
                        g.queueSongID;
                m = {isQueue:true, flagSongCallback:function (q) {
                    GS.player.flagSong(h, q)
                }}
            }
            if ($("div.gridrow" + f).is(":visible")) {
                $("div.gridrow" + f).hide();
                b.removeClass("active-context")
            } else {
                m = {menuType:"songOptionMenu", multiClick:false, gridController:k};
                m = g.getContextMenu(m);
                var n = GS.getGuts();
                n.currentTest && n.currentTest.name == "gridRowPlayV2" && n.currentGroup > 1 && m.push({customClass:"separator"}, {title:"Song Page", action:{type:"fn", callback:function () {
                    GS.router.setHash(g.toUrl())
                }, log:this.callback(function () {
                    GS.getGuts().onContextMenuClick("contextNavigateSongPage",
                            menuType, false, songItemInfo)
                })}, customClass:"last jj_menu_item_hasIcon jj_menu_item_song_page"});
                b.addClass("active-context").jjmenu(d, m, null, {xposition:"left", yposition:"auto", show:"show", className:"rowmenu gridrow" + f, keepState:b, shouldLog:true})
            }
            k.currentRow = f;
            k.grid.setSelectedRows([f]);
            k.grid.onSelectedRowsChanged()
        }, playClickSongID:false, ".slick-cell.song a.play, .slick-cell.song a.addToQueue click":function (b, d) {
            var f = parseInt(b.attr("rel"), 10), g = GS.player.getCurrentQueue(), k = GS.player.isPlaying;
            isPaused = GS.player.isPaused;
            if (this.playClickSongID != f) {
                this.playClickSongID = f;
                var m = $(b).parents(".slick-row").attr("row");
                m = parseInt(m, 10) + 1;
                this.playClickSongID = f;
                m = parseInt($(b).parents(".slick-row").attr("row"), 10);
                m = m + 1;
                var h = "";
                if ($("#grid").controller()) {
                    var n = $("#grid").controller().data;
                    if (n[m - 1])h = n[m - 1].ppVersion
                }
                gutsInfo = h ? {songID:f, rank:m, ppVersion:h} : {songID:f, rank:m};
                m = $(b).parents(".slick-row").attr("row");
                m = parseInt(m, 10) + 1;
                if (b.parents(".slick-row.active").length && g.activeSong.SongID ==
                        f)if (!k && !isPaused) {
                    $(b).removeClass("paused");
                    GS.player.playSong(f)
                } else if (k) {
                    $(b).addClass("paused");
                    GS.player.pauseSong()
                } else {
                    $(b).removeClass("paused");
                    GS.player.resumeSong()
                } else if ($(b).hasClass("addToQueue")) {
                    GS.player.addSongsToQueueAt([f], GS.player.INDEX_DEFAULT, false, this.getPlayContext());
                    GS.getGuts().logEvent("songItemAddToQueueButtonButton", gutsInfo)
                } else if (!$("#page").is(".gs_page_now_playing") && GS.getGuts().currentTest && GS.getGuts().currentTest.name == "gridRowPlayV2" && GS.getGuts().currentGroup ==
                        5) {
                    GS.player.addSongAndPlay(f, this.getPlayContext());
                    GS.getGuts().logEvent("songItemPlayButton", gutsInfo)
                } else if ($("#page").is(".gs_page_now_playing")) {
                    d.stopImmediatePropagation();
                    GS.player.playSong($(b).parents(".slick-row").attr("rel"))
                } else if ($(b).parents(".gs_grid.hasSongs").length) {
                    GS.player.addSongsToQueueAt([f], GS.player.INDEX_DEFAULT, false, this.getPlayContext());
                    GS.getGuts().logEvent("songItemAddButton", gutsInfo)
                } else {
                    GS.player.addSongAndPlay(f, this.getPlayContext());
                    GS.getGuts().logEvent("songItemPlayButton",
                            gutsInfo)
                }
                setTimeout(this.callback(function () {
                    this.playClickSongID = false
                }), 500);
                return false
            }
        }, ".slick-row.event .event_tickets click":function (b, d) {
            var f = b.parents(".slick-row").attr("row");
            f = $("#grid").controller().dataView.getItemByIdx(f);
            if (!$(d.target).is("a[href]") && f && f.TicketsURL) {
                window.open(f.TicketsURL, "_blank");
                GS.getGuts().gaTrackEvent("grid", "eventClick", f.TicketsURL);
                return false
            }
        }, "#searchForm, #homeSearch submit":function (b, d) {
            d.preventDefault();
            var f = $("input[name=q]", b).val();
            if (f.substring(0,
                    2).toLowerCase() == "gs")switch (f.toLowerCase()) {
                case "GS.google.lasterror":
                    alert(JSON.stringify(GS.getGoogle().lastError));
                    return false;
                case "GS.facebook.lasterror":
                    alert(JSON.stringify(GS.getFacebook().lastError));
                    return false;
                case "GS.lastfm.lasterror":
                    alert(JSON.stringify(GS.getLastfm().lastError));
                    return false
            } else if (f.toLowerCase() == "floppy music" || f.toLowerCase() == "floppy drive music")GS.getYoutube().loadFloppyMusic(); else if (f.toLowerCase() == "about:dubstep" || f.toLowerCase() == "how do i dubstep")GS.getYoutube().loadDubstep();
            else if (f.toLowerCase() == "about:christmas") {
                GS.Models.Station.makeChristmasHappen();
                return
            }
            GS.search = _.orEqual(GS.search, {});
            GS.search.query = f;
            GS.search.type = $(b).attr("data-search-type") || "";
            GS.search.query && GS.search.query.length && GS.router.performSearch(GS.search.type, GS.search.query);
            return false
        }, "a.searchLink click":function (b, d) {
            d.preventDefault();
            var f = b.data("searchtype"), g = b.data("searchquery");
            f = f ? f : "";
            g = g ? g : "";
            GS.router.performSearch(f, g)
        }, "#feed .what>a click":function (b, d) {
            GS.getGuts().handleFeedEventClick(b,
                    d)
        }, "#feed li.option click":function (b, d) {
            GS.getGuts().handleFeedEventClick(b, d)
        }, "#feed li.show click":function (b, d) {
            GS.getGuts().handleFeedEventClick(b, d)
        }, "#profile_artists a click":function (b, d) {
            GS.getGuts().handleSearchSidebarClick(b, d, "artist")
        }, "#profile_albums a click":function (b, d) {
            GS.getGuts().handleSearchSidebarClick(b, d, "album")
        }, "#profile_playlists a click":function (b, d) {
            GS.getGuts().handleSearchSidebarClick(b, d, "playlist")
        }, "#profile_users a click":function (b, d) {
            GS.getGuts().handleSearchSidebarClick(b,
                    d, "user")
        }, "#profile_events a click":function (b, d) {
            GS.getGuts().handleSearchSidebarEventClick(b, d)
        }, "a.follow, button.follow click":function (b) {
            var d = parseInt($(b).attr("data-follow-userid"), 10), f = _.orEqual($(b).attr("data-cachePrefix"), ""), g = "", k = function () {
                if (b.is(".following")) {
                    GS.user.removeFromUserFavorites(d);
                    b.removeClass("following").addClass("add");
                    g = "FOLLOW"
                } else {
                    GS.user.addToUserFavorites(d);
                    b.addClass("following").removeClass("add");
                    g = "FOLLOWING"
                }
                b.find("span.label").attr("data-translate-text",
                        g).text($.localize.getString(g))
            };
            GS.Models.User.getOneFromCache(d, f) ? k() : GS.Models.User.getUser(d, k, null, false)
        }, "a.signup, button.signup click":function () {
            GS.router.setHash("/signup")
        }, "a.login, button.login click":function () {
            GS.getLightbox().open("login")
        }, "a.uploadMusic, button.uploadMusic click":function () {
            GS.user.isLoggedIn ? window.open("http://" + location.host + "/upload", "_blank") : GS.getLightbox().open("login")
        }, "a.saveQueue, button.saveQueue click":function () {
            GS.player.saveQueue()
        }, "a.newPlaylist, button.newPlaylist click":function () {
            GS.getLightbox().open("newPlaylist")
        },
        "a.inviteFriends, button.inviteFriends click":function () {
            GS.getLightbox().open("invite")
        }, "select.launchStation change":function (b) {
            (b = $(b).val()) && GS.player.setAutoplay(true, b)
        }, "select change":function (b) {
            $(b).prev("span").text($(b).find("option:selected").html())
        }, "button.playRecent click":function () {
            if (this.feed)this.feed.play(GS.player.INDEX_DEFAULT, true); else this.user && this.user.profileFeed.play(GS.player.INDEX_DEFAULT, true)
        }, "button.playDropdownRecent click":function (b, d) {
            var f;
            if (this.feed)f =
                    this.feed; else if (this.user)f = this.user.profileFeed;
            this.user && b.jjmenu(d, this.getFeedPlayRecentDropdown(f), null, {xposition:"left", yposition:"auto", show:"default", className:"contextmenu", keepState:b})
        }, getFeedPlayRecentDropdown:function (b) {
            return b ? [
                {title:$.localize.getString("PLAY_NOW"), action:{type:"fn", callback:function () {
                    b.play(GS.player.INDEX_DEFAULT, true)
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play"},
                {title:$.localize.getString("PLAY_NEXT"), action:{type:"fn", callback:function () {
                    b.play(GS.player.INDEX_NEXT,
                            false)
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_next"},
                {title:$.localize.getString("PLAY_LAST"), action:{type:"fn", callback:function () {
                    b.play(GS.player.INDEX_LAST, false)
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_last"},
                {customClass:"separator"},
                {title:$.localize.getString("REPLACE_QUEUE"), action:{type:"fn", callback:function () {
                    b.play(GS.player.INDEX_REPLACE, true)
                }}, customClass:"jj_menu_item_hasIcon jj_menu_item_replace_playlist"}
            ] : []
        }, "button.refresh click":function (b) {
            feedType =
                    $(b).attr("data-feed-type");
            if (!GS.page.refreshed || GS.page.refreshed.type !== this.feed.type || GS.page.refreshed.user !== this.user.UserID) {
                switch (this.feed.type) {
                    case "profile":
                        this.user.UserID == GS.user.UserID ? this.loadMyProfile(GS.user) : this.loadProfile(this.user);
                        break;
                    case "community":
                        this.user.communityFeed.isDirty = true;
                        this.user.UserID == GS.user.UserID || this.UserID == -1 ? this.loadMyCommunity(this.user) : this.loadCommunity(this.user);
                        break
                }
                GS.page.refreshed = {type:this.feed.type, user:this.user.UserID};
                GS.page.resetRefreshButton()
            }
        }, "button.followArtist click":function (b) {
            var d = b.attr("data-artistid");
            GS.Models.Artist.getArtist(d, function () {
                if (GS.user.favorites.artists.hasOwnProperty(d)) {
                    GS.user.removeFromArtistFavorites(d, true);
                    b.attr("title", "");
                    $(".artistID" + d).removeClass("following").addClass("plus").find("span.label").attr("data-translate-text", "ARTIST_FOLLOW").text($.localize.getString("ARTIST_FOLLOW"))
                } else {
                    GS.user.addToArtistFavorites(d, true);
                    b.attr("title", $.localize.getString("UNFOLLOW"));
                    $(".artistID" + d).removeClass("plus").addClass("following").find("span.label").attr("data-translate-text", "ARTIST_FOLLOWING").text($.localize.getString("ARTIST_FOLLOWING"))
                }
            }, null, false)
        }, "button.subscribePlaylist click":function (b) {
            var d = b.attr("data-playlistid");
            GS.Models.Playlist.getPlaylist(d, function () {
                if (GS.user.favorites.playlists.hasOwnProperty(d)) {
                    GS.user.removeFromPlaylistFavorites(d, false);
                    $(".playlistID" + d).removeClass("subscribed").addClass("plus").find("span.label").attr("data-translate-text",
                            $.localize.getString("PLAYLIST_SUBSCRIBE")).text($.localize.getString("PLAYLIST_SUBSCRIBE"))
                } else {
                    GS.user.addToPlaylistFavorites(d, false);
                    $(".playlistID" + d).removeClass("plus").addClass("subscribed").find("span.label").attr("data-translate-text", $.localize.getString("PLAYLIST_SUBSCRIBED")).text($.localize.getString("PLAYLIST_SUBSCRIBED"))
                }
            }, null, false)
        }, "button.librarySong click":function (b) {
            b = b.attr("data-songid");
            if (GS.user.library.songs.hasOwnProperty(b)) {
                GS.user.removeFromLibrary(b, false);
                $(".songID" +
                        b).removeClass("inLibrary").addClass("plus").find("span.label").attr("data-translate-text", $.localize.getString("SONG_ADD_LIBRARY")).text($.localize.getString("SONG_ADD_LIBRARY"))
            } else {
                GS.user.addToLibrary(b, false);
                $(".songID" + b).removeClass("plus").addClass("inLibrary").find("span.label").attr("data-translate-text", $.localize.getString("SONG_IN_LIBRARY")).text($.localize.getString("SONG_IN_LIBRARY"))
            }
        }, whatsNewTooltips:[
            {ID:1, title:"TOOLTIP_UK3_UPDATES_TITLE", message:"TOOLTIP_UK3_UPDATES_MESSAGE",
                buttons:{left:{text:"CLOSE"}, right:{text:"NEXT"}}},
            {ID:2, title:"TOOLTIP_UK3_FEATURES_TITLE", message:"TOOLTIP_UK3_FEATURES_MESSAGE", buttons:{left:{text:"CLOSE"}, right:{text:_.toArray(GS.user.playlists).length ? "GET_STARTED" : "SHORTCUTS_CREATE_PLAYLIST"}}}
        ], currentTipElement:null, tooltipTimer:null, "#page .tooltip mouseover":function (b) {
            clearTimeout(this.toolTipTimer);
            if (this.currentTipElement != b.get(0)) {
                this.currentTipElement = b.get(0);
                b = $(b);
                var d = b.attr("data-tip-type"), f = null;
                f = null;
                var g = b.offset(),
                        k = g.left + b.width() + 350 > $("body").width() ? "left" : "right", m = {};
                $("#tooltip").stop().remove();
                switch (d) {
                    case "song":
                        f = GS.Models.Song.getOneFromCache(b.attr("data-SongID"), b.attr("data-cachePrefix"));
                        break;
                    case "artist":
                        f = GS.Models.Artist.getOneFromCache(b.attr("data-ArtistID"), b.attr("data-cachePrefix"));
                        break;
                    case "playlist":
                        f = GS.Models.Playlist.getOneFromCache(b.attr("data-PlaylistID"), b.attr("data-cachePrefix"));
                        break;
                    case "album":
                        f = GS.Models.Album.getOneFromCache(b.attr("data-AlbumID"), b.attr("data-cachePrefix"));
                        break;
                    case "video":
                        f = GS.Models.Video.getOneFromCache(b.attr("data-VideoID"), b.attr("data-cachePrefix"));
                        break;
                    case "feed":
                        f = GS.Models.FeedEvent.getOneFromCache(b.attr("data-EventID"));
                        k = "top";
                        m.index = b.attr("data-index");
                        break;
                    case "flattr":
                        k = "left";
                        f = {flattrTarget:b.attr("data-tip-target"), flattrContext:"artist"};
                        break
                }
                if (f)if (d == "flattr") {
                    f = $(this.view("/shared/tooltips/" + d, {data:f, direction:k}));
                    $("body").append(f.css({visibility:"hidden"}));
                    k == "left" ? f.css({top:g.top - 10, left:g.left - parseFloat(b.attr("data-tip-width")) -
                            10}) : f.css({top:g.top, left:g.left + b.width() + 5});
                    $("body").append(f.hide().css({visibility:"visible"}).delay(250).fadeIn("fast"));
                    f.bind("mouseover", this.callback(function (h) {
                        $(h.currentTarget).attr("data-tooltip-mouseover", true)
                    })).bind("mouseout", this.callback(function (h) {
                        $(h.currentTarget).attr("data-tooltip-mouseover", null);
                        this.toolTipTimer = setTimeout(this.callback("closeTooltip"), 750)
                    }))
                } else {
                    f = $(this.view("/shared/tooltips/" + d, {data:f, direction:k, info:m}));
                    $("body").append(f.css({visibility:"hidden"}));
                    d = 0;
                    if (k == "left")f.css({top:g.top, right:g.left - 5}); else if (k == "right")f.css({top:g.top, left:g.left + b.width() + 5}); else {
                        if (k == "top") {
                            d = Math.max(5, g.left + b.width() / 2 - f.width() / 2 - 6);
                            f.css({top:g.top - f.height() - 5, left:d})
                        } else {
                            d = Math.max(5, g.left + b.width() / 2 - f.width() / 2 - 6);
                            f.css({top:g.top + f.height(), left:d})
                        }
                        $("#tooltip_caret", f).css({left:g.left - d + 14})
                    }
                    $("body").append(f.hide().css({visibility:"visible"}).delay(500).fadeIn("fast"))
                }
            }
        }, "#page .tooltip mouseout":function () {
            this.toolTipTimer = setTimeout(this.callback("closeTooltip"),
                    750)
        }, delayCloseTooltip:function () {
            clearTimeout(this.toolTipTimer)
        }, closeTooltip:function () {
            if (!$("#tooltip.displayOnHover").attr("data-tooltip-mouseover")) {
                clearTimeout(this.tooltipTimer);
                this.tooltipTimer = this.currentTipElement = null;
                $("#tooltip").stop().fadeOut(50, function () {
                    $(this).remove()
                })
            }
        }, ".playBtn click":function (b, d) {
            d.preventDefault();
            if (b.attr("data-playlistid"))GS.Models.Playlist.getPlaylist(b.attr("data-playlistid"), function (g) {
                g.play(GS.player.INDEX_NEXT, true)
            }); else if (b.attr("data-songid"))if (b.attr("data-eventid") &&
                    this.feed && this.feed.cache && this.feed.cache[b.attr("data-eventid")]) {
                var f = _.orEqual(b.attr("data-index"), 0);
                (f = GS.Models.Song.wrap(this.feed.cache[b.attr("data-eventid")].data.songs[f])) && GS.player.addSongsToQueueAt([f.SongID], GS.player.INDEX_NEXT, true)
            } else GS.player.addSongsToQueueAt([b.attr("data-songid")], GS.player.INDEX_NEXT, true); else b.attr("data-albumid") ? GS.Models.Album.getAlbum(b.attr("data-albumid"), function (g) {
                g.play(GS.player.INDEX_NEXT, true)
            }) : console.warn("Not a valid data attribute")
        },
        ".songLink click":function (b, d) {
            d.preventDefault();
            var f = b.attr("data-songid");
            f && GS.Models.Song.getSong(f, function (g) {
                (g = g && $.isFunction(g.toUrl) ? g.toUrl() : false) && GS.router.setHash(g)
            })
        }, sliderOrBoxDragSetup:function (b, d) {
            b.unbind("draginit").unbind("dragstart").unbind("drag").unbind("dragend");
            b.bind("draginit",function (f, g) {
                var k = $(f.target).closest(d);
                if (k.length === 0)return false;
                g.draggedItemID = k.attr("data-dragid");
                g.draggedItemsType = k.attr("data-dragtype");
                if (!g.draggedItemID || !g.draggedItemsType)return false;
                g.proxyOffsetX = f.clientX - k.offset().left;
                g.proxyOffsetY = f.clientY - k.offset().top
            }).bind("dragstart",function (f, g) {
                        var k, m;
                        k = GS.Controllers.PageController.getActiveController();
                        g.draggedItemsContext = k.getPlayContext();
                        g.draggedItems = [];
                        g.draggedItemsSource = "grid";
                        switch (g.draggedItemsType) {
                            case "album":
                                m = GS.Models.Album.getOneFromCache(parseInt(g.draggedItemID, 10));
                                break;
                            case "playlist":
                                m = GS.Models.Playlist.getOneFromCache(parseInt(g.draggedItemID, 10));
                                break;
                            case "artist":
                                m = GS.Models.Artist.getOneFromCache(parseInt(g.draggedItemID,
                                        10));
                                break;
                            case "user":
                                m = GS.Models.User.getOneFromCache(parseInt(g.draggedItemID, 10));
                                break;
                            case "song":
                                m = GS.Models.Song.getOneFromCache(parseInt(g.draggedItemID, 10));
                                break
                        }
                        if (!m)return false;
                        g.draggedItems.push(m);
                        k = $('<div class="dragProxy slick-reorder-proxy"><div class="status"></div><span class="info"><span class="text"></span></span></div>').css({position:"absolute", zIndex:"99999", "min-height":"50px", "padding-right":"50px"}).appendTo("body").mousewheel(_.globalDragProxyMousewheel);
                        $.isFunction(m.toProxyLabel) ?
                                k.find(".text").html(m.toProxyLabel()) : k.find(".text").html(m.toString());
                        g.proxyOffsetX = Math.floor(k.width() / 2) + 15;
                        g.proxyOffsetY = k.height() * 2 - 52;
                        $.publish("gs.drag.start", g);
                        return k
                    }).bind("drag",function (f, g) {
                        g.clientX = f.clientX;
                        g.clientY = f.clientY;
                        $(g.proxy).css("top", f.clientY - g.proxyOffsetY).css("left", f.clientX - g.proxyOffsetX);
                        var k = false, m = false;
                        _.forEach(g.drop, function (h) {
                            $.isFunction(h.updateDropOnDrag) && h.updateDropOnDrag(f, g);
                            if (!k)if ($(h).within(f.clientX, f.clientY).length > 0)if ($(h).data("ignoreForOverDrop"))m =
                                    true; else {
                                m = false;
                                k = true
                            }
                        });
                        m || (k ? $(g.proxy).addClass("valid").removeClass("invalid") : $(g.proxy).addClass("invalid").removeClass("valid"))
                    }).bind("dragend", function (f, g) {
                        $(g.proxy).remove();
                        $.publish("gs.drag.end", g)
                    })
        }, likeWidth:"48px", likeWidthCache:{}, loadLikeButtonCount:function (b, d) {
            if (!d && this.likeWidthCache[b]) {
                this.likeWidth = this.likeWidthCache[b];
                $("#page_content_social_buttons .fblike").css("width", this.likeWidth)
            }
            GS.getFacebook().queryFQL('SELECT total_count FROM link_stat WHERE url="' +
                    b + '"', this.callback(function (f) {
                if (f[0].total_count) {
                    this.likeWidth = f[0].total_count > 1E4 ? "80px" : f[0].total_count > 1E3 ? "77px" : f[0].total_count > 100 ? "80px" : f[0].total_count > 10 ? "77px" : f[0].total_count > 0 ? "77px" : "48px";
                    $("#page_content_social_buttons .fblike").css("width", this.likeWidth);
                    this.likeWidthCache[b] = this.likeWidth
                }
            }), this.callback(function () {
                this.likeWidth = "48px";
                $("#page_content_social_buttons .fblike").css("width", this.likeWidth)
            }))
        }})
})();

