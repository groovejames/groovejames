(function () {
    function c(g) {
        return["<span class='slick-column-name' data-translate-text='", g.name, "'>", $.localize.getString(g.name), "</span>"].join("")
    }

    function a(g, k, m, h, n) {
        g = _.ucwords(h.name);
        k = $("#grid").controller();
        if (n.IsVerified == 0.5)return h.name == "ARTIST" ? k.filter.hasOwnProperty("onlyVerified") && !k.filter.onlyVerified ? ['<div class="showMore showingMore" data-translate-text="SEARCH_RESULTS_SHOW_LESS">', $.localize.getString("SEARCH_RESULTS_SHOW_LESS"), "</div>"].join("") : ['<div class="showMore" data-translate-text="SEARCH_RESULTS_SHOW_MORE">',
            $.localize.getString("SEARCH_RESULTS_SHOW_MORE"), "</div>"].join("") : ""; else {
            h = h.name == "SONG" ? "javascript:_.redirectSong(" + n.SongID + ", event)" : h.name == "USER" ? _.cleanUrl(n.Name, n.UserID, "user") : h.name == "AUTHOR" ? _.cleanUrl(n.UserName, n.UserID, "user") : _.cleanUrl(n[g + "Name"], n[g + "ID"], h.name.toLowerCase());
            return n && n.Collaborative ? ['<a class="field" href="', h, '" class="ellipsis" title="', m, '">', m, '</a><span class="collabMsg right">', _.getString("PLAYLIST_COLLABORATIVE"), "</span>"].join("") : ['<a class="field" href="',
                h, '" class="ellipsis" title="', m, '">', m, "</a>"].join("")
        }
    }

    function b(g, k, m) {
        return['<span class="filter field ellipsis" title="', m, '">', m, '</span><span class="arrow rowOption"></span>'].join("")
    }

    function d(g, k, m, h, n) {
        if (n.IsVerified == 0.5)return""; else {
            g = GS.getGuts();
            k = n.isFavorite ? " isFavorite" : "";
            h = n.fromLibrary ? " inLibrary" : "";
            var q = n.fromLibrary ? "SONG_ROW_REMOVE_SONG_LIBRARY_TITLE" : "SONG_ROW_ADD_SONG_LIBRARY_TITLE", s = n.isFavorite ? "SONG_ROW_REMOVE_SONG_FAVORITE_TITLE" : "SONG_ROW_ADD_SONG_FAVORITE_TITLE",
                    w = GS.player.getCurrentQueue(), o = "SONG_ROW_ADD_SONG_PLAY_TITLE";
            if (w && w.songs && w.songs.length > 0)o = "SONG_ROW_ADD_SONG_ADD_TO_PLAYING_TITLE";
            w = g.currentTest && g.currentTest.name == "gridRowPlayV2" ? " AB_" + g.currentTest.name + "_" + g.currentGroup : "";
            if (g.currentTest && g.currentTest.name == "gridRowPlayV2" && g.currentGroup > 1) {
                var u = "";
                if (g.currentGroup > 4)u = ['<a class="addToQueue rowOption', w, '" rel="', n.SongID, '"></a>'].join("");
                return['<a class="play rowOption', w, '" data-translate-title="', o, '" title="', $.localize.getString(o),
                    '" rel="', n.SongID, '"></a>', u, '<div class="options ', k, " ", h, '"><a class="rowOption favorite option', k, '" data-translate-title="', s, '" title="', $.localize.getString(s), '" rel="', n.SongID, '"></a><a class="rowOption library option', h, '" data-translate-title="', q, '" title="', $.localize.getString(q), '" rel="', n.SongID, '"></a><a class="rowOption more option grid_song_more', h, '" data-translate-title="OPTIONS" title="', $.localize.getString("OPTIONS"), '" rel="', n.SongID, '"></a></div><span class="songName ellipsis"><a class="songLinkPlay ellipsis" title="',
                    m, '" rel="', n.SongID, '">', m, "</a></span>"].join("")
            } else return['<a class="play rowOption', w, '" data-translate-title="', o, '" title="', $.localize.getString(o), '" rel="', n.SongID, '"></a><div class="options ', k, " ", h, '"><a class="rowOption favorite option', k, '" data-translate-title="', s, '" title="', $.localize.getString(s), '" rel="', n.SongID, '"></a><a class="rowOption library option', h, '" data-translate-title="', q, '" title="', $.localize.getString(q), '" rel="', n.SongID, '"></a><a class="rowOption more option grid_song_more',
                h, '" data-translate-title="OPTIONS" title="', $.localize.getString("OPTIONS"), '" rel="', n.SongID, '"></a></div><span class="songName"><a class="songLink ellipsis" title="', m, '" rel="', n.SongID, '">', m, "</a></span>"].join("")
        }
    }

    function f(g, k, m) {
        m = m == "0" ? "&nbsp;" : m;
        return['<span class="track">', m, "</span>"].join("")
    }

    GS.Controllers.BaseController.extend("GS.Controllers.GridController", {columns:{song:[
        {id:"song", name:"SONG", field:"SongName", cssClass:"song", minWidth:150, formatter:d, behavior:"selectAndMove",
            sortable:true, columnFormatter:c},
        {id:"artist", name:"ARTIST", field:"ArtistName", cssClass:"artist", minWidth:100, formatter:a, behavior:"selectAndMove", sortable:true, columnFormatter:c},
        {id:"album", name:"ALBUM", field:"AlbumName", cssClass:"album", minWidth:100, formatter:a, behavior:"selectAndMove", sortable:true, columnFormatter:c},
        {id:"track", name:"TRACK_NUM", field:"TrackNum", cssClass:"track", minWidth:70, maxWidth:90, formatter:f, behavior:"selectAndMove", sortable:true, columnFormatter:c}
    ], albumSongs:[
        {id:"song",
            name:"SONG", field:"SongName", cssClass:"song", minWidth:150, formatter:d, behavior:"selectAndMove", sortable:true, columnFormatter:c, minWidth:300},
        {id:"artist", name:"ARTIST", field:"ArtistName", cssClass:"artist", minWidth:100, formatter:a, behavior:"selectAndMove", sortable:true, columnFormatter:c},
        {id:"track", name:"TRACK_NUM", field:"TrackNum", cssClass:"track", minWidth:70, maxWidth:90, formatter:f, behavior:"selectAndMove", sortable:true, columnFormatter:c}
    ], queuesong:[
        {id:"song", name:"SONG", field:"SongName", cssClass:"song",
            minWidth:150, formatter:function (g, k, m, h, n) {
            g = n.isFavorite ? " isFavorite" : "";
            k = n.fromLibrary ? " inLibrary" : "";
            h = n.fromLibrary ? "SONG_ROW_REMOVE_SONG_LIBRARY_TITLE" : "SONG_ROW_ADD_SONG_LIBRARY_TITLE";
            return['<a class="play rowOption ', GS.player.isPlaying ? "" : "paused", '" rel="', n.SongID, '"></a><div class="options ', g, " ", k, '"><a class="rowOption favorite option', g, '" rel="', n.SongID, '"></a><a class="rowOption library option', k, '" data-translate-title="', h, '" title="', $.localize.getString(h), '" rel="', n.SongID,
                '"></a><a class="rowOption more option', k, '" rel="', n.SongID, '"></a></div><span class="songName"><a class="songLink ellipsis" title="', m, '" rel="', n.SongID, '">', m, "</a></span>"].join("")
        }, behavior:"selectAndMove", sortable:true, columnFormatter:c},
        {id:"artist", name:"ARTIST", field:"ArtistName", cssClass:"artist", minWidth:100, formatter:function (g, k, m, h, n) {
            g = n.autoplayVote == 1 || n.autoplayVote == 0 && n.source === "user" ? "selected" : "";
            k = n.autoplayVote == -1 ? "selected" : "";
            var q = _.ucwords(h.name);
            h = _.cleanUrl(n[q +
                    "Name"], n[q + "ID"], h.name.toLowerCase());
            return['<div class="options"><a class="rowOption smile rowOption ', g, '"></a><a class="rowOption frown rowOption ', k, '"></a></div><a class="field ellipsis" href="', h, '" title="', m, '">', m, "</a>"].join("")
        }, behavior:"selectAndMove", sortable:true, columnFormatter:c},
        {id:"album", name:"ALBUM", field:"AlbumName", cssClass:"album", minWidth:100, formatter:a, behavior:"selectAndMove", sortable:true, columnFormatter:c},
        {id:"track", name:"TRACK_NUM", field:"TrackNum", cssClass:"track",
            minWidth:70, maxWidth:90, formatter:f, behavior:"selectAndMove", sortable:true, columnFormatter:c}
    ], playlistsong:[
        {id:"song", name:"SONG", field:"SongName", cssClass:"song", minWidth:150, formatter:d, behavior:"selectAndMove", sortable:false, columnFormatter:c},
        {id:"artist", name:"ARTIST", field:"ArtistName", cssClass:"artist", minWidth:100, formatter:a, behavior:"selectAndMove", sortable:false, columnFormatter:c},
        {id:"album", name:"ALBUM", field:"AlbumName", cssClass:"album", minWidth:100, formatter:a, behavior:"selectAndMove",
            sortable:false, columnFormatter:c}
    ], album:[
        {id:"album", name:"ALBUM", field:"AlbumName", cssClass:"albumDetail", formatter:function (g, k, m, h, n) {
            return['<a href="', n.toUrl(), '" class="image insetBorder height30"><img src="', n.getImageURL(30), '" width="30" height="30" class="avatar" /></a><a href="', n.toUrl(), '" class="title ellipsis">', n.AlbumName, "</a>"].join("")
        }, behavior:"selectAndMove", sortable:true, columnFormatter:c},
        {id:"artist", name:"ARTIST", field:"ArtistName", cssClass:"albumArtist", formatter:a, behavior:"selectAndMove",
            sortable:true, columnFormatter:c}
    ], artist:[
        {id:"artist", name:"ARTIST", field:"ArtistName", cssClass:"artist-row", formatter:function (g, k, m, h, n) {
            return['<a href="', n.toUrl(), '" class="image insetBorder height30"><img src="', n.getImageURL(30), '" width="30" height="30" class="avatar" /></a><a href="', n.toUrl(), '" class="title ellipsis">', n.ArtistName, "</a>"].join("")
        }, behavior:"selectAndMove", sortable:true, columnFormatter:c}
    ], playlist:[
        {id:"playlist", name:"PLAYLIST", field:"PlaylistName", cssClass:"playlist",
            formatter:function (g, k, m, h, n) {
                k = n.isSubscribed() ? "subscribed" : "";
                m = GS.page.activePage.objType == "subscribed" ? "alternate" : "";
                g = n && n.NumSongs && n.Artists ? true : false;
                if (GS.page.activePage && GS.page.activePage.objType == "collaborative") {
                    h = $.localize.getString("REMOVE");
                    k = n.UserID === GS.user.UserID ? "" : ['<a class="removePlaylist ', k, m, '" rel="', n.PlaylistID, '"><span>', h, "</span></a>"].join("")
                } else {
                    h = n.isSubscribed() ? $.localize.getString("PLAYLIST_UNSUBSCRIBE") : $.localize.getString("PLAYLIST_SUBSCRIBE");
                    k = n.UserID ===
                            GS.user.UserID ? "" : ['<a class="subscribe ', k, m, '" rel="', n.PlaylistID, '"><span>', h, "</span></a>"].join("")
                }
                if (g) {
                    g = n.Artists.split(",");
                    m = g.length;
                    g.splice(3, g.length);
                    m = m > g.length ? "..." : "";
                    return['<a href="', _.cleanUrl(n.PlaylistName, n.PlaylistID, "playlist"), '" class="image insetBorder height30"><img src="', n.getImageURL(30), '" width="30" height="30" class="albumart" /></a>', k, '<p><span class="title"><a class="v-ellip" href="', _.cleanUrl(n.PlaylistName, n.PlaylistID, "playlist"), '">', _.cleanText(n.PlaylistName),
                        " (", n.NumSongs, ' Songs) </a></span><span class="artists">', g.join(", "), m, "</span></p>"].join("")
                } else return['<a href="', _.cleanUrl(n.PlaylistName, n.PlaylistID, "playlist"), '" class="image insetBorder height30"><img src="', n.getImageURL(30), '" width="30" height="30" class="albumart" /></a>', k, '<p><span class="title"><a class="v-ellip" href="', _.cleanUrl(n.PlaylistName, n.PlaylistID, "playlist"), '">', _.cleanText(n.PlaylistName), "</a></span></p>"].join("")
            }, behavior:"selectAndMove", sortable:true, columnFormatter:c},
        {id:"username", name:"AUTHOR", field:"UserName", cssClass:"playlistAuthor", formatter:a, behavior:"selectAndMove", sortable:true, columnFormatter:c}
    ], user:[
        {id:"username", name:"USER", field:"Name", cssClass:"user", formatter:function (g, k, m, h, n) {
            g = n.isFavorite ? " following" : "";
            k = n.isFavorite ? "UNFOLLOW" : "FOLLOW";
            g = n.UserID === GS.user.UserID ? "" : ['<a class="follow ', g, '" data-follow-userid="', n.UserID, '"><span data-translate-text="' + k + '">', $.localize.getString(k), "</span></a>"].join("");
            k = _.cleanUrl(n.Name, n.UserID,
                    "user");
            m = '<div class="status ' + n.getVipPackage() + '"></div>';
            return['<a href="', k, '" class="who image">', m, '<img src="', n.getImageURL(30), '" width="30" height="30" class="avatar" /></a>', g, '<a href="', k, '" class="username">', n.Name, '</a><span class="location">', n.Country, "</span>"].join("")
        }, behavior:"selectAndMove", sortable:true, columnFormatter:c}
    ], albumFilter:[
        {id:"album", name:"ALBUM", field:"AlbumName", cssClass:"cell-title", formatter:b, behavior:"selectAndMove", sortable:false, collapsable:true, columnFormatter:c}
    ],
        artistFilter:[
            {id:"artist", name:"ARTIST", field:"ArtistName", cssClass:"cell-title", formatter:b, behavior:"selectAndMove", sortable:false, collapsable:true, columnFormatter:c}
        ], event:[
            {id:"date", name:"DATE", field:"StartTime", cssClass:"cell-title", formatter:function (g, k, m, h, n) {
                g = n.StartTime.split(" ");
                k = g[1] ? g[1].split(":") : "00:00:00";
                g = g[0].split("-");
                newDate = new Date(parseInt(g[0], 10), parseInt(g[1], 10) - 1, parseInt(g[2], 10), parseInt(k[0], 10), parseInt(k[1], 10), parseInt(k[2], 10));
                return['<div class="field event_calendar" title="',
                    newDate.format("D M j Y"), '"><span class="field month" >', newDate.format("M"), '</span><span class="field day" >', newDate.format("j"), "</span></div>"].join("")
            }, behavior:"none", sortable:false, columnFormatter:c, minWidth:40, maxWidth:45},
            {id:"artist", name:"ARTISTS", field:"ArtistName", cssClass:"cell-title", formatter:function (g, k, m) {
                g = (m || "").split(", ");
                k = [];
                m = 0;
                for (var h = g.length, n = h - 1; m < h; m++)k.push(g[m], m !== n ? ",&nbsp;" : "");
                return['<div class="filter"><a class="field url event_tickets" title="', $.localize.getString("BUY_TICKETS"),
                    '">', $.localize.getString("BUY_TICKETS"), '</a><span class="field artist ellipsis">', k.join(""), "</span></div>"].join("")
            }, behavior:"none", sortable:false, columnFormatter:c},
            {id:"location", name:"LOCATION", field:"Location", cssClass:"cell-title", formatter:function (g, k, m, h, n) {
                return['<div class="filter venues"><div class="venue-container"><span class="field ellipsis venue" title="', n.VenueName, '">', n.VenueName, '</span><span class="field ellipsis city" title="', n.City, '">', n.City, "</span></div></div>"].join("")
            },
                behavior:"none", sortable:false, columnFormatter:c}
        ], topSongs:[
            {id:"song", name:"TRACK", field:"SongName", cssClass:"song", formatter:d, behavior:"selectAndMove", sortable:false, columnFormatter:c},
            {id:"album", name:"ALBUM", field:"AlbumName", cssClass:"album", formatter:a, behavior:"selectAndMove", sortable:true, columnFormatter:c}
        ], station:[
            {id:"station", name:"STATIONS", field:"StationTitle", cssClass:"station", formatter:function (g, k, m, h, n) {
                return['<a class="play rowOption" data-translate-title="STATION_ROW_PLAY_TITLE" title="',
                    $.localize.getString("STATION_ROW_PLAY_TITLE"), '" data-tagid="', n.TagID, '"></a><span class="field ellipsis stationName" data-translate-text="', m, '" title="', $.localize.getString(m), '">', $.localize.getString(m), "</span>"].join("")
            }, behavior:"selectAndMove", sortable:true, columnFormatter:c}
        ]}, options:{enableCellNavigation:true, enableCellRangeSelection:true, onCellRangeSelected:function () {
        console.log("cell range select", arguments)
    }, onSelectedRowChanged:function () {
        console.log("selectd row change", arguments)
    },
        forceFitColumns:true, rowHeight:25, editable:false, enableAddRow:false, rowCssClasses:function (g, k, m) {
            var h = "";
            if (g && g.IsVerified == 1)h = "verified"; else if (g && g.IsVerified == 0.5)h = "verifiedDivider";
            if (k == m - 1)h += " slick-row-last";
            return h
        }, isSelectable:function (g) {
            return g.IsVerified === 0.5 ? false : true
        }, dragProxy:function (g) {
            var k = g;
            if (g.length > 1)if (g[0]instanceof GS.Models.Song)k = _.getString("SELECTION_SONGS_COUNT", {count:g.length}); else if (g[0]instanceof GS.Models.Playlist)k = _.getString("SELECTION_PLAYLIST_COUNT",
                    {count:g.length}); else if (g[0]instanceof GS.Models.Album)k = _.getString("SELECTION_ALBUM_COUNT", {count:g.length}); else {
                if (g[0]instanceof GS.Models.Artist)k = _.getString("SELECTION_ARTIST_COUNT", {count:g.length})
            } else if (g instanceof Array)k = g[0].toProxyLabel ? g[0].toProxyLabel() : g[0];
            return['<div class="status"></div><span class="info"><span class="text">', k, "</span></span>"].join("")
        }, disableMultiSelect:false}, rowHeights:{song:25, album:41, artist:41, playlist:41, user:41, event:41, station:25}, columnsByName:{song:"song",
        SongName:"song", album:"album", AlbumName:"album", artist:"artist", ArtistName:"artist", playlist:"playlist", PlaylistName:"playlist", user:"user", Name:"user", TrackNum:"track", tracknum:"track", track:"track", event:"user", Event:"user"}, defaultSort:{song:"ArtistName", album:"TrackNum", artist:"Popularity", user:"Name", playlist:"PlaylistName"}, defaultMultiSorts:{SongName:["SongName", "SongID", "GridKey"], ArtistName:["ArtistName", "AlbumName", "TrackNum", "SongName", "SongID", "GridKey"], AlbumName:["AlbumName", "TrackNum",
        "SongName", "SongID", "GridKey"], TrackNum:["TrackNum", "SongName", "SongID"], Popularity:["Popularity", "Weight", "NumPlays", "ArtistName", "AlbumName", "TrackNum", "SongName", "SongID"]}, numericColumns:{Rank:true, Sort:true, TrackNum:true, Popularity:true, Weight:true, NumPlays:true, Score:true, IsVerified:true, GridKey:true}, forcedSortDirections:{TSAdded:false, TSFavorited:false, Popularity:false, TrackNum:true}, init:function () {
        this._super();
        window.ctrlDown = false;
        $(document).keydown(this.callback(function (g) {
            if (!window.ctrlDown &&
                    (g.ctrlKey || g.metaKey || g.shiftKey || g.keyCode == 16 || g.keyCode == 17)) {
                $("div.gs_grid.songs .grid-canvas").addClass("noLinks");
                window.ctrlDown = true
            }
        }));
        $(document).keyup(this.callback(function (g) {
            if (window.ctrlDown && (!(g.ctrlKey || g.metaKey || g.shiftKey) || g.keyCode == 16 || g.keyCode == 17)) {
                $("div.gs_grid.songs .grid-canvas").removeClass("noLinks");
                window.ctrlDown = false
            }
        }))
    }, resizeTimer:null, resizeAfterRender:function () {
        this.resizeTimer && clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function () {
            GS.resize();
            $(".gs_grid").resize()
        }, 500)
    }}, {dataView:null, grid:null, idProperty:null, selectedRowIDs:[], currentRow:0, filter:{artistIDs:false, albumIDs:false, onlyVerified:false}, sortCol:"", sortCols:[], sortDir:1, origSortDir:1, onInitSort:true, sortNumeric:false, pastSorts:{}, searchString:"", data:null, columns:null, options:null, type:null, resizeSelf:function () {
        if (this.element)this.element.hasClass("songList") ? this.element.css({height:Math.min(200, Math.max(25, (this.data || []).length * this.options.rowHeight)), width:this.element.parent().innerWidth()}) :
                this.element.css({height:Math.min(this.element.parent().height(), $("#page").height()), width:this.element.parent().width()});
        this.grid && this.grid.resizeAndRender()
    }, init:function (g, k, m, h, n, q, s) {
        function w(B, E) {
            var F, y, I, C, H, K = 1;
            if (o.options.isFilter || o.options.useVerifiedSort)o.sortCols = ["IsVerified", o.sortCol];
            I = 0;
            for (C = o.sortCols.length; I < C; I++) {
                H = o.sortCols[I];
                if (K != 1)K = 1;
                if (H == "IsVerified")K = o.sortDir ? -1 : 1;
                if (o.Class.numericColumns[H]) {
                    F = parseFloat(_.notDefined(B) || _.notDefined(B[H]) ? -5000000 :
                            B[H], 10);
                    y = parseFloat(_.notDefined(E) || _.notDefined(E[H]) ? -5000000 : E[H], 10);
                    if (isNaN(F))F = 0;
                    if (isNaN(y))y = 0;
                    if (H === "TrackNum") {
                        if (F !== 0 && y === 0)return o.sortDir ? -1 : 1;
                        if (y !== 0 && F === 0)return o.sortDir ? 1 : -1
                    }
                } else {
                    F = _.notDefined(B) || !_.isString(B[H]) ? "" : B[H].toString().toLowerCase();
                    y = _.notDefined(E) || !_.isString(E[H]) ? "" : E[H].toString().toLowerCase()
                }
                if (F !== y)return(F > y ? 1 : -1) * K
            }
            return 0
        }

        n = _.orEqual(n, "song");
        h = _.orEqual(h, {});
        h.rowHeight = _.orEqual(h.rowHeight, GS.Controllers.GridController.rowHeights[n]);
        h.allowDragSort = _.orEqual(h.allowDragSort, false);
        h.allowDropOn = _.orEqual(h.allowDropOn, false);
        h.allowDuplicates = _.orEqual(h.allowDuplicates, false);
        h.useVerifiedSort = _.orEqual(h.useVerifiedSort, false);
        h.searchText = _.orEqual(h.searchText, "searchText");
        h = $.extend({}, GS.Controllers.GridController.options, h);
        if (h.allowDragSort)h.autoDragScroll = true;
        GS.getGuts().logEvent("gridInitialized", {type:n});
        this.subscribe("gs.auth." + n + ".update", this.callback(n + "Change"));
        s && this.subscribe("gs.auth.favorites." + n +
                "s.update", this.callback(n + "FavoritesChange"));
        this.subscribe("gs.player.queue.change", this.callback("queueChange"));
        s = GS.player.getCurrentQueue();
        this.element.toggleClass("hasSongs", s && s.songs && s.songs.length > 0);
        this.data = k;
        this.columns = m;
        this.options = h;
        this.type = n;
        this.idProperty = this.grid = this.dataView = null;
        this.selectedRowIDs = [];
        this.currentRow = 0;
        this.filter = _.orEqual(h.filters, {artistIDs:false, albumIDs:false, onlyVerified:false});
        this.sortCol = _.orEqual(h.sortCol, GS.Controllers.GridController.defaultSort[n]);
        this.sortCols = _.orEqual(GS.Controllers.GridController.defaultMultiSorts[this.sortCol], $.makeArray(this.sortCol));
        this.origSortDir = this.sortDir = (this.sortDir = _.orEqual(h.sortDir, 1)) ? true : false;
        this.onInitSort = _.orEqual(h.onInitSort, false);
        this.sortNumeric = GS.Controllers.GridController.numericColumns[this.sortCol] ? true : false;
        this.pastSorts = {};
        this.searchString = "";
        this.allowDragSort = _.orEqual(h.allowDragSort, false);
        this.allowDropOn = _.orEqual(h.allowDropOn, false);
        var o = this;
        this.idProperty = _.orEqual(q,
                _.ucwords(n) + "ID");
        this.dataView = new Slick.Data.DataView;
        this.grid = new Slick.Grid($(g), this.dataView.rows, this.columns, this.options);
        this.dataView.setAllowDuplicates(this.options.allowDuplicates);
        this.grid.onContextMenu = function (B, E) {
            B.preventDefault();
            var F = o.grid.getSelectedRows().sort(function (C, H) {
                return C - H
            }), y = [];
            if (!(F.length > 1) || F.indexOf(E) === -1) {
                o.currentRow = E;
                o.grid.setSelectedRows([E]);
                o.grid.onSelectedRowsChanged();
                F = [E]
            }
            switch (o.type) {
                case "artist":
                    y = GS.Models.Artist.getOneFromCache(o.dataView.rows[E].ArtistID).getContextMenu();
                    break;
                case "album":
                    y = GS.Models.Album.getOneFromCache(o.dataView.rows[E].AlbumID).getContextMenu();
                    break;
                case "song":
                    if (F.length > 1) {
                        y = [];
                        for (var I = 0; I < F.length; I++)y.push(o.dataView.rows[F[I]].SongID);
                        y = o.getContextMenuMultiselectForSong(y)
                    } else y = o.getContextMenuForSong(o.dataView.rows[E].SongID);
                    break;
                case "playlist":
                    F = GS.Models.Playlist.getOneFromCache(o.dataView.rows[E].PlaylistID);
                    if (!F && GS.user.PageNameData.CollabPlaylists)F = GS.Models.Playlist.wrap(GS.user.PageNameData.CollabPlaylists[o.dataView.rows[E].PlaylistID],
                            false);
                    y = F.getContextMenu();
                    break;
                case "station":
                    y = GS.Models.Station.getOneFromCache(o.dataView.rows[E].StationID).getContextMenu();
                    break;
                case "user":
                    y = GS.Models.User.getOneFromCache(o.dataView.rows[E].UserID).getContextMenu();
                    break
            }
            $(B.target).jjmenu(B, y, null, {xposition:"mouse", yposition:"mouse", show:"show", className:"contextmenu", shouldLog:true})
        };
        this.grid.onDblClick = function (B, E) {
            var F = o.dataView.rows[E];
            if (!($(B.target).parents(".options").length > 0))if (!$(B.target).is("a.play"))if (o.options.isNowPlaying &&
                    F.queueSongID)GS.player.playSong(F.queueSongID); else if (F.SongID) {
                var y = GS.Controllers.PageController.getActiveController().getPlayContext();
                GS.player.addSongAndPlay(F.SongID, y);
                y = {songID:F.SongID, rank:parseInt(E, 10) + 1};
                if (F.ppVersion)y.ppVersion = F.ppVersion;
                GS.getGuts().logEvent("doubleClickToPlay", y)
            } else F.StationID && GS.player.setAutoplay(true, F.StationID)
        };
        this.grid.onKeyDown = function (B) {
            if (B.which === 65 && (B.ctrlKey || B.metaKey)) {
                B = [];
                o.selectedRowIDs = [];
                for (var E = 0; E < o.dataView.rows.length; E++) {
                    B.push(E);
                    o.selectedRowIDs.push(o.dataView.rows[E].id)
                }
                o.currentRow = o.dataView.rows.length - 1;
                o.grid.setSelectedRows(_.arrUnique(B));
                o.grid.onSelectedRowsChanged();
                return true
            }
            if (o.handleKeyPress(B))return true;
            return $(B.target).is("input,textarea,select") ? true : false
        };
        this.grid.onSelectedRowsChanged = function () {
            o.selectedRowIDs = [];
            var B, E, F = o.grid.getSelectedRows().sort(function (I, C) {
                return I - C
            }), y = {};
            if (o.options.isFilter) {
                if (F.length === 1 && F[0] === 0 && o.dataView.getItemByIdx(0)[o.idProperty] === -1)F = [];
                B = F.indexOf(0);
                if (B > -1) {
                    F.splice(B, 1);
                    o.grid.setSelectedRows(F);
                    o.grid.onSelectedRowsChanged();
                    return
                }
                F.length === 0 ? $(".slick-row[row=0]", o.element).addClass("selected") : $(".slick-row[row=0]", o.element).removeClass("selected")
            }
            B = 0;
            for (l = F.length; B < l; B++)if (E = o.dataView.rows[F[B]]) {
                o.selectedRowIDs.push(E[o.idProperty]);
                y[E[o.idProperty]] = true
            }
            o.selectedRowIDs = _.arrUnique(o.selectedRowIDs);
            if (o.options.isFilter)if (o.type === "album") {
                if (F.length === 0)$(".gs_grid.songs").controller().filter.albumIDs = false; else $(".gs_grid.songs").controller().filter.albumIDs =
                        y;
                $(".gs_grid.songs").controller().dataView.refresh()
            } else if (o.type === "artist") {
                if (F.length === 0) {
                    $(".gs_grid.songs").controller().filter.artistIDs = false;
                    $(".gs_grid.albums").controller().filter.artistIDs = false
                } else {
                    $(".gs_grid.songs").controller().filter.artistIDs = y;
                    $(".gs_grid.albums").controller().filter.artistIDs = y
                }
                $(".gs_grid.songs").controller().dataView.refresh();
                $(".gs_grid.albums").controller().dataView.refresh();
                $(".gs_grid.albums").controller().grid.onSelectedRowsChanged()
            }
            o.currentRow =
                    _.orEqual(o.grid.getSelectedRows()[F.length - 1], 0);
            $.publish("gs.grid.selectedRows", {len:o.selectedRowIDs.length, type:o.type})
        };
        $(".slick-header-column").click(function () {
            $(this).addClass("selected");
            $(this).siblings().removeClass("selected")
        });
        this.grid.onSort = function (B, E, F) {
            var y, I;
            if (_.notDefined(E))E = _.defined(o.pastSorts[B]) && B == o.sortCol ? !o.pastSorts[B] : true;
            o.sortColData = B;
            o.sortName = B.name ? B.name : null;
            o.sortCol = B.field ? B.field : B;
            o.sortCols = _.orEqual(GS.Controllers.GridController.defaultMultiSorts[o.sortCol],
                    $.makeArray(o.sortCol));
            o.sortDir = E ? true : false;
            o.element.find(".slick-sort-indicator").removeClass("slick-sort-indicator-asc").removeClass("slick-sort-indicator-desc");
            y = GS.Controllers.GridController.columnsByName[o.sortCol];
            I = GS.Controllers.GridController.forcedSortDirections[o.sortCol];
            if (_.defined(y))o.grid.setSortColumn(y, o.sortDir); else o.sortDir = _.defined(I) ? I : o.origSortDir;
            o.pastSorts[o.sortCol] = o.sortDir;
            o.sortNumeric = GS.Controllers.GridController.numericColumns[o.sortCol] ? true : false;
            o.dataView.sort(w,
                    o.sortDir);
            if (!F && B) {
                F = $("button.dropdownButton.sort").find("span.label");
                if (o.sortName) {
                    if (o.sortName == "PLAYLIST" || o.sortName == "USER")o.sortName = "NAME";
                    F.attr("data-translate-text", "SORT_BY_" + o.sortName);
                    F.text($.localize.getString("SORT_BY_" + o.sortName))
                } else if (o.columns) {
                    y = 0;
                    for (I = o.columns.length; y < I; y++)if (o.columns[y] && o.columns[y].field === o.sortCol) {
                        y = "SORT_BY_" + o.columns[y].name;
                        if (GS.page.activePageName === "UserMusicController" && y == "SORT_BY_PLAYLIST")y = "SORT_BY_NAME";
                        F.attr("data-translate-text",
                                y);
                        F.text($.localize.getString(y));
                        break
                    }
                }
                if (GS.page.activePageName === "UserMusicController" && GS.page.activePageIdentifier == GS.user.UserID) {
                    y = "gs.sort.user.music";
                    F = GS.page.getActiveController().subpage;
                    if (F == "playlists")y = "gs.sort.user.playlists"; else if (F == "subscribed")y = "gs.sort.user.subscribed";
                    GS.store.set(y, {sortCol:B, sortDir:E, onInitSort:false})
                }
            }
        };
        o.dataView.onRowCountChanged.subscribe(function () {
            o.grid.updateRowCount()
        });
        o.dataView.onRowsChanged.subscribe(function (B) {
            o.grid.removeRows(B);
            o.grid.resizeAndRender();
            if (o.selectedRowIDs.length > 0) {
                B = [];
                for (var E, F = 0, y = o.selectedRowIDs.length; F < y; F++) {
                    E = o.dataView.getRowById(o.selectedRowIDs[F]);
                    E !== undefined && B.push(E)
                }
                o.currentRow = _.orEqual(E, 0);
                o.grid.setSelectedRows(_.arrUnique(B))
            } else {
                o.currentRow = 0;
                o.grid.setSelectedRows([])
            }
            o.grid.onSelectedRowsChanged()
        });
        o.grid.onBeforeMoveRows = function () {
            return o.allowDragSort
        };
        o.grid.onMoveRows = function (B, E) {
            var F = [], y = [], I = [], C = o.dataView.getItems(), H, K, r, t;
            if (!(!o.allowDragSort || o.sortCol !==
                    "Sort"))if (o.options.playlistID) {
                F = GS.Models.Playlist.getOneFromCache(o.options.playlistID);
                if (!F && GS.user.PageNameData.CollabPlaylists)F = GS.Models.Playlist.wrap(GS.user.PageNameData.CollabPlaylists[o.options.playlistID], false);
                F && F.moveSongsTo(B, E)
            } else {
                H = C.slice(0, E);
                K = C.slice(E, C.length);
                r = 0;
                for (t = B.length; r < t; r++) {
                    C[B[r]].Sort = r;
                    F.push(C[B[r]])
                }
                B.sort().reverse();
                r = 0;
                for (t = B.length; r < t; r++) {
                    C = B[r];
                    C < E ? H.splice(C, 1) : K.splice(C - E, 1);
                    y.push(H.length + r)
                }
                C = H.concat(F.concat(K));
                r = 0;
                for (t = C.length; r <
                        t; r++)C[r].Sort = r + 1;
                o.data = C;
                y = _.arrUnique(y);
                o.currentRow = y[y.length - 1];
                o.dataView.beginUpdate();
                o.grid.setSelectedRows(y);
                o.grid.onSelectedRowsChanged();
                o.dataView.setItems(o.data, o.idProperty);
                o.dataView.endUpdate();
                o.dataView.refresh();
                if (o.options.isNowPlaying) {
                    H = E;
                    r = 0;
                    for (t = F.length; r < t; r++) {
                        I.push(F[r].queueSongID);
                        y = $("#queue .queueSong:nth-child(" + E + ")");
                        y.after($("#" + F[r].queueSongID).remove());
                        E += 1
                    }
                    GS.player.moveSongsTo(I, H)
                }
            }
        };
        if (o.allowDragSort || o.allowDropOn) {
            h = o.grid.getOptions();
            var u =
                    $("#grid .slick-viewport"), z = h.scrollPane ? $(h.scrollPane) : u, D = function (B, E) {
                var F = B.clientY - u.find(".grid-canvas").offset().top;
                if (u.within(B.clientX, B.clientY).length > 0) {
                    $(E.proxy).addClass("valid").removeClass("invalid");
                    if (o.allowDragSort) {
                        F = Math.max(0, Math.min(Math.round(F / h.rowHeight), o.dataView && o.dataView.rows ? o.dataView.rows.length : 0));
                        if (F !== E.gridInsertIndex) {
                            if (o.onBeforeMoveRows && o.onBeforeMoveRows(o.grid.getSelectedRows(), F) === false) {
                                $("div.slick-reorder-guide").css("top", -1000).show();
                                E.canMove = false
                            } else {
                                $("div.slick-reorder-guide").css({top:F * h.rowHeight + h.padding}).show();
                                E.canMove = true
                            }
                            E.gridInsertIndex = F
                        }
                    } else {
                        F = $(".slick-row").within(E.clientX, E.clientY).eq(0);
                        if (F.length) {
                            F.addClass("hover").siblings().removeClass("hover");
                            E.gridInsertIndex = parseInt(F.attr("row"), 10)
                        }
                    }
                } else {
                    $(E.proxy).addClass("invalid").removeClass("valid");
                    $("div.slick-reorder-guide").hide()
                }
                if (h.autoDragScroll) {
                    var y = z.within(B.clientX, B.clientY).length > 0;
                    F = Math.ceil(z.height() * 0.2);
                    var I = h.rowHeight *
                            (k ? k.length : 0);
                    if (y)if (!($("#shortcuts").within(B.clientX, B.clientY).length > 0 || $("#footer").within(B.clientX, B.clientY).length > 0))if (E.gridAutoScrollWaitTimeout) {
                        y = function () {
                            var H = (new Date).valueOf();
                            if (E.gridAutoScrollHasWaited && (!E.gridAutoScrollLast || H - E.gridAutoScrollLast >= 200)) {
                                E.gridAutoScrollLast = H;
                                z.scrollTop(Math.max(0, z.scrollTop() - 41))
                            }
                        };
                        var C = function () {
                            var H = (new Date).valueOf();
                            if (E.gridAutoScrollHasWaited && (!E.gridAutoScrollLast || H - E.gridAutoScrollLast >= 200)) {
                                E.gridAutoScrollLast =
                                        H;
                                z.scrollTop(Math.min(I, z.scrollTop() + 41))
                            }
                        };
                        if (z.offset().top + F > B.clientY) {
                            y();
                            clearInterval(E.gridAutoScrollInterval);
                            E.gridAutoScrollInterval = setInterval(y, 200)
                        } else if (z.offset().top + z.height() - F < B.clientY) {
                            C();
                            clearInterval(E.gridAutoScrollInterval);
                            E.gridAutoScrollInterval = setInterval(C, 200)
                        } else {
                            clearTimeout(E.gridAutoScrollWaitTimeout);
                            E.gridAutoScrollWaitTimeout = false;
                            E.gridAutoScrollHasWaited = false;
                            clearInterval(E.gridAutoScrollInterval);
                            E.gridAutoScrollInterval = false
                        }
                    } else E.gridAutoScrollWaitTimeout =
                            setTimeout(function () {
                                E.gridAutoScrollHasWaited = true;
                                E.gridAutoScrollWaitTimeout = false
                            }, 500)
                }
            };
            z.data("ignoreForOverDrop", true).bind("dropinit",function () {
                this.updateDropOnDrag = D
            }).bind("dropstart",function (B, E) {
                if (!E.draggedItems) {
                    this.updateDropOnDrag = null;
                    return false
                }
                $("<div class='slick-reorder-guide'/>").css({position:"absolute", zIndex:"99998", width:u.innerWidth() - h.padding * 2, top:-1000, right:h.padding}).appendTo(u);
                E.gridInsertIndex = -1;
                E.gridAutoScrollHasWaited = false;
                E.gridAutoScrollWaitTimeout =
                        false
            }).bind("dropend",function (B, E) {
                        u.find(".slick-reorder-guide").remove();
                        u.find(".slick-row").removeClass("hover");
                        clearInterval(E.gridAutoScrollInterval);
                        E.gridAutoScrollInterval = false
                    }).bind("drop", function (B, E) {
                        function F(I, C) {
                            C = _.orEqual(C, new GS.Models.PlayContext);
                            var H, K = [], r;
                            for (H = 0; H < I.length; H++)K.push(I[H].SongID);
                            if (o.allowDropOn)(H = o.dataView.getItemByIdx(E.gridInsertIndex)) && H instanceof GS.Models.Playlist && H.addSongs(K, null, true); else if (o.options.playlistID) {
                                H = GS.Models.Playlist.getOneFromCache(o.options.playlistID);
                                if (!H && GS.user.PageNameData.CollabPlaylists)H = GS.Models.Playlist.wrap(GS.user.PageNameData.CollabPlaylists[o.options.playlistID], false);
                                r = E.gridInsertIndex !== -1 ? E.gridInsertIndex : null;
                                H.addSongs(K, r, true)
                            } else {
                                r = E.gridInsertIndex !== -1 ? E.gridInsertIndex : GS.player.INDEX_DEFAULT;
                                GS.player.addSongsToQueueAt(K, r, false, C)
                            }
                        }

                        var y;
                        if (u.within(B.clientX, B.clientY).length > 0)if (E.draggedItemsSource == "grid" && o.grid.onMoveRows && E.canMove) {
                            o.grid.onMoveRows(o.grid.getSelectedRows(), E.gridInsertIndex);
                            GS.getGuts().gaTrackEvent("grid",
                                    "dragSuccess")
                        } else {
                            E.draggedItemsType = E.draggedItemsType || _.guessDragType(E.draggedItems);
                            switch (E.draggedItemsType) {
                                case "song":
                                    F(E.draggedItems, E.draggedItemsContext);
                                    break;
                                case "album":
                                    for (y = 0; y < E.draggedItems.length; y++)E.draggedItems[y].getSongs(function (I) {
                                        I.sort(GS.Models.Album.defaultSongSort);
                                        F(I, new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_ALBUM, E.draggedItems[y]))
                                    }, null, true, {async:false});
                                    break;
                                case "artist":
                                    for (y = 0; y < E.draggedItems.length; y++)E.draggedItems[y].getSongs(function (I) {
                                        I.sort(GS.Models.Artist.defaultSongSort);
                                        F(I, new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_ARTIST, E.draggedItems[y]))
                                    }, false, null, {async:false});
                                    break;
                                case "playlist":
                                    for (y = 0; y < E.draggedItems.length; y++)E.draggedItems[y].getSongs(function (I) {
                                        F(I, new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_PLAYLIST, E.draggedItems[y]))
                                    }, null, {async:false});
                                    break;
                                case "user":
                                    for (y = 0; y < E.draggedItems.length; y++)E.draggedItems[y].getFavoritesByType("Song", function (I) {
                                                F(I, new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_USER, E.draggedItems[y]))
                                            }, null,
                                            {async:false});
                                    break;
                                default:
                                    console.error("grid drop, invalid drag type", E.draggedItemsType);
                                    return
                            }
                        }
                    })
        }
        o.dataView.beginUpdate();
        o.dataView.setItems(o.data, o.idProperty);
        o.dataView.setFilter(function (B) {
            if (o.options.isFilter && B.isFilterAll)return true;
            if (o.searchString != "" && (!B.hasOwnProperty(o.options.searchText) || B[o.options.searchText].toLowerCase().indexOf(o.searchString) == -1))return false;
            if (o.filter.hasOwnProperty("onlyVerified") && o.filter.onlyVerified && B.IsVerified === 0)return false;
            if (o.filter.artistIDs &&
                    !o.filter.artistIDs[B.ArtistID])return false;
            if (o.filter.albumIDs && !o.filter.albumIDs[B.AlbumID])return false;
            return true
        });
        o.sortCol !== "" && o.grid.onSort(o.sortCol, o.sortDir, o.onInitSort);
        $(window).resize();
        o.dataView.endUpdate();
        if (o.options.isFilter) {
            o.grid.setSelectedRows([0]);
            o.grid.onSelectedRowsChanged()
        }
        this.Class.resizeAfterRender();
        g && typeof g.addEventListener === "function" && window.Event && window.Event.prototype && typeof window.Event.prototype.stopImmediatePropagation === "function" && $("#grid.songs .slick-viewport").length &&
        $("#grid.songs .slick-viewport")[0].addEventListener("click", function (B) {
            if (B && B.srcElement && B.srcElement.id)if (B.srcElement.id && B.srcElement.id.length) {
                document.body.innerHTML = '<h1 style="font-size: 24px;">We noticed you were using a downloader. Please uninstall it to continue enjoying your free music.</h1>';
                B.stopPropagation();
                B.stopImmediatePropagation()
            }
        }, true)
    }, update:function () {
    }, songChange:function (g) {
        var k = $("#page").is(".gs_page_playlist") ? GS.Controllers.PageController.getActiveController() :
                false;
        k = k ? k.playlist.songIDLookup[g.SongID] : this.dataView.getItemById(g[this.idProperty]);
        if (!k)return false;
        var m = ["IsVerified", "TSAdded", "TSFavorited", "Sort", "Popularity"];
        for (var h in g)if (g.hasOwnProperty(h) && m.indexOf(h) == -1)k[h] = g[h];
        this.dataView.updateItem(k[this.idProperty], k)
    }, albumChange:function (g) {
        var k = this.dataView.getItemById(g[this.idProperty]);
        if (!k)return false;
        for (var m in g)if (g.hasOwnProperty(m))k[m] = g[m];
        this.dataView.updateItem(k.AlbumID, k)
    }, artistChange:function (g) {
        var k =
                this.dataView.getItemById(g[this.idProperty]);
        if (!k)return false;
        for (var m in g)if (g.hasOwnProperty(m))k[m] = g[m];
        this.dataView.updateItem(k.ArtistID, k)
    }, playlistChange:function (g) {
        var k = this.dataView.getItemById(g[this.idProperty]);
        if (k) {
            for (var m in g)if (g.hasOwnProperty(m))k[m] = g[m];
            this.dataView.updateItem(k.PlaylistID, k)
        }
    }, userChange:function (g) {
        var k = this.dataView.getItemById(g[this.idProperty]);
        if (!k)return false;
        for (var m in g)if (g.hasOwnProperty(m))k[m] = g[m];
        this.dataView.updateItem(k.UserID,
                k)
    }, songFavoritesChange:function () {
        this.data = this.dataView.getItems();
        for (var g = 0; g < this.data.length; g++)if (GS.user.favorites.songs[this.data[g].SongID]) {
            this.data[g].isFavorite = 1;
            this.data[g].fromLibrary = 1;
            this.dataView.updateItem(this.data[g].SongID, this.data[g])
        }
        this.dataView.beginUpdate();
        this.dataView.setItems(this.data, "SongID");
        this.dataView.endUpdate()
    }, albumFavoritesChange:function () {
        this.data = this.dataView.getItems();
        for (var g = 0; g < this.data.length; g++)if (GS.user.favorites.albums[this.data[g].AlbumID]) {
            this.data[g].isFavorite =
                    1;
            this.dataView.updateItem(this.data[g].SongID, this.data[g])
        }
        this.dataView.beginUpdate();
        this.dataView.setItems(this.data, "AlbumID");
        this.dataView.endUpdate()
    }, artistFavoritesChange:function () {
        this.data = this.dataView.getItems();
        for (var g = 0; g < this.data.length; g++)if (GS.user.favorites.artists[this.data[g].ArtistID])this.data[g].isFavorite = 1;
        this.dataView.beginUpdate();
        this.dataView.setItems(this.data, "ArtistID");
        this.dataView.endUpdate()
    }, playlistFavoritesChange:function () {
        this.data = this.dataView.getItems();
        for (var g = 0; g < this.data.length; g++)if (GS.user.favorites.playlists[this.data[g].PlaylistID])this.data[g].isFavorite = 1;
        this.dataView.beginUpdate();
        this.dataView.setItems(this.data, "PlaylistID");
        this.dataView.endUpdate()
    }, userFavoritesChange:function () {
        this.data = this.dataView.getItems();
        for (var g = 0; g < this.data.length; g++)if (GS.user.favorites.users[this.data[g].UserID])this.data[g].isFavorite = 1
    }, queueChange:function (g) {
        g || (g = GS.player.getCurrentQueue());
        if (this.element) {
            this.element.toggleClass("hasSongs",
                    g && g.songs && g.songs.length > 0);
            g && g.songs && g.songs.length > 0 ? $(".grid-canvas a.play").attr("data-translate-title", "SONG_ROW_ADD_SONG_ADD_TO_PLAYING_TITLE").attr("title", $.localize.getString("SONG_ROW_ADD_SONG_ADD_TO_PLAYING_TITLE")) : $(".grid-canvas a.play").attr("data-translate-title", "SONG_ROW_ADD_SONG_PLAY_TITLE").attr("title", $.localize.getString("SONG_ROW_ADD_SONG_PLAY_TITLE"))
        }
    }, getContextMenuForSong:function (g) {
        var k = GS.Controllers.PageController.getActiveController().getPlayContext(), m = GS.Models.Song.getOneFromCache(g),
                h = GS.getGuts().extractSongItemInfo(this), n = [
                    {title:$.localize.getString("CONTEXT_PLAY_SONG_NOW"), action:{type:"fn", callback:function () {
                        GS.player.addSongAndPlay(g, k)
                    }, log:this.callback(function () {
                        GS.getGuts().onContextMenuClick("contextPlaySongNow", "rightClickSingleSong", false, h)
                    })}, customClass:"last jj_menu_item_hasIcon jj_menu_item_play"},
                    {title:$.localize.getString("CONTEXT_PLAY_SONG_NEXT"), action:{type:"fn", callback:function () {
                        GS.player.addSongsToQueueAt([g], GS.player.INDEX_NEXT, false, k)
                    }, log:this.callback(function () {
                        GS.getGuts().onContextMenuClick("contextPlaySongNext",
                                "rightClickSingleSong", false, h)
                    })}, customClass:"last jj_menu_item_hasIcon jj_menu_item_play_next"},
                    {title:$.localize.getString("CONTEXT_PLAY_SONG_LAST"), action:{type:"fn", callback:function () {
                        GS.player.addSongsToQueueAt([g], GS.player.INDEX_LAST, false, k)
                    }, log:this.callback(function () {
                        GS.getGuts().onContextMenuClick("contextPlaySongLast", "rightClickSingleSong", false, h)
                    })}, customClass:"last jj_menu_item_hasIcon jj_menu_item_play_last"},
                    {customClass:"separator"}
                ];
        if (m)n = n.concat(m.getContextMenu({menuType:"rightClickSingleSong",
            gridController:this}));
        var q = GS.getGuts();
        q.currentTest && q.currentTest.name == "gridRowPlayV2" && q.currentGroup > 1 && n.push({customClass:"separator"}, {title:"Song Page", action:{type:"fn", callback:function () {
            GS.router.setHash(m.toUrl())
        }, log:this.callback(function () {
            GS.getGuts().onContextMenuClick("contextNavigateSongPage", "rightClickSingleSong", false, h)
        })}, customClass:"last jj_menu_item_hasIcon jj_menu_item_song_page"});
        return n
    }, getContextMenuMultiselectForSong:function (g) {
        var k = GS.Controllers.PageController.getActiveController().getPlayContext(),
                m = GS.getGuts().extractMultiSongInfo(this, g), h = {menuType:"rightClickMultiSong", multiClick:true, gridController:this}, n = [
                    {title:$.localize.getString("CONTEXT_PLAY_SONGS_NOW"), customClass:"jj_menu_item_hasIcon jj_menu_item_play", action:{type:"fn", callback:function () {
                        GS.player.addSongsToQueueAt(g, GS.player.INDEX_DEFAULT, true, k)
                    }, log:this.callback(function () {
                        GS.getGuts().onContextMenuClick("contextPlaySongsNow", "rightClickMultiSong", true, m)
                    })}},
                    {title:$.localize.getString("CONTEXT_PLAY_SONGS_NEXT"), customClass:"jj_menu_item_hasIcon jj_menu_item_play_next",
                        action:{type:"fn", callback:function () {
                            GS.player.addSongsToQueueAt(g, GS.player.INDEX_NEXT, false, k)
                        }, log:this.callback(function () {
                            GS.getGuts().onContextMenuClick("contextPlaySongsNext", "rightClickMultiSong", true, m)
                        })}},
                    {title:$.localize.getString("CONTEXT_PLAY_SONGS_LAST"), customClass:"jj_menu_item_hasIcon jj_menu_item_play_last", action:{type:"fn", callback:function () {
                        GS.player.addSongsToQueueAt(g, GS.player.INDEX_LAST, false, k)
                    }, log:this.callback(function () {
                        GS.getGuts().onContextMenuClick("contextPlaySongsLast",
                                "rightClickMultiSong", true, m)
                    })}},
                    {customClass:"separator"}
                ], q = true;
        if (GS.user.library)for (i in g) {
            if (g.hasOwnProperty(i)) {
                songID = g[i];
                if (parseInt(songID) && !GS.user.library.songs[songID]) {
                    q = false;
                    break
                }
            }
        } else q = false;
        q ? n.push({title:$.localize.getString("CONTEXT_REMOVE_FROM_LIBRARY"), customClass:"jj_menu_item_hasIcon jj_menu_item_remove_music", action:{type:"fn", callback:function () {
            GS.user.removeFromLibrary(g)
        }, log:this.callback(function () {
            GS.getGuts().onContextMenuClick("contextRemoveFromLibrary",
                    "rightClickMultiSong", true, m)
        })}}) : n.push({title:$.localize.getString("CONTEXT_ADD_TO_LIBRARY"), customClass:"jj_menu_item_hasIcon jj_menu_item_music", action:{type:"fn", callback:function () {
            GS.user.addToLibrary(g)
        }, log:this.callback(function () {
            GS.getGuts().onContextMenuClick("contextAddToLibrary", "rightClickMultiSong", true, m)
        })}});
        n.push({customClass:"separator"});
        if (_.isEmpty(GS.user.playlists))n.push({title:$.localize.getString("CONTEXT_NEW_PLAYLIST"), customClass:"jj_menu_item_hasIcon jj_menu_item_new_playlist",
            action:{type:"fn", callback:function () {
                GS.getLightbox().open("newPlaylist", g)
            }}}); else {
            n.push({title:$.localize.getString("CONTEXT_ADD_TO_PLAYLIST"), type:"sub", customClass:"jj_menu_item_hasIcon jj_menu_item_playlists", src:GS.Models.Playlist.getPlaylistsMenu(g, function (s) {
                s.addSongs(g, null, true)
            }, null, null, h)});
            k.type == "playlist" && GS.page.activePage && GS.page.activePage.playlist && GS.page.activePage.playlist.songs && n.push({title:$.localize.getString("CONTEXT_REMOVE_FROM_PLAYLIST"), customClass:"jj_menu_item_hasIcon jj_menu_item_remove_music",
                action:{type:"fn", callback:this.callback(function () {
                    var s = h.gridController, w = [], o = GS.page.activePage.playlist;
                    if (s && s.selectedRowIDs.length > 0)for (var u = 0; u < s.selectedRowIDs.length; u++) {
                        var z = o.gridKeyLookup[s.selectedRowIDs[u]];
                        z && w.push(o.songs.indexOf(z))
                    }
                    w.length && o.removeSongs(w)
                })}})
        }
        n.push({customClass:"separator"}, {title:$.localize.getString("CONTEXT_SHARE_SONGS"), customClass:"jj_menu_item_hasIcon jj_menu_item_share", action:{type:"fn", callback:function () {
            GS.getLightbox().open("widget", {type:"manySongs",
                id:g})
        }, log:this.callback(function () {
            GS.getGuts().onContextMenuClick("contextShareSongs", "rightClickMultiSong", true, m)
        })}}, {customClass:"separator"}, {title:$.localize.getString("CONTEXT_REPLACE_ALL_SONGS"), customClass:"jj_menu_item_hasIcon jj_menu_item_now_playing", action:{type:"fn", callback:function () {
            GS.player.addSongsToQueueAt(g, GS.player.INDEX_REPLACE, GS.player.isPlaying, k)
        }, log:this.callback(function () {
            GS.getGuts().onContextMenuClick("contextReplaceAllSongs", "rightClickMultiSong", true, m)
        })}});
        return n
    }, "input.search keyup":function (g) {
        Slick.GlobalEditorLock.cancelCurrentEdit();
        if (e.which == 27)g.value = "";
        this.searchString = g.value.toLowerCase();
        this.dataView.refresh()
    }, ".grid-canvas click":function (g, k) {
        if ($(k.target).parents(".slick-row").length === 0) {
            self.currentRow = 0;
            this.grid.setSelectedRows([]);
            this.grid.onSelectedRowsChanged()
        }
    }, "* keydown":function (g, k) {
        this.handleKeyPress(k)
    }, ".slick-collapse-indicator click":function (g, k) {
        k.preventDefault();
        var m = $(g).parents("div.page_column"), h =
                GS.page.getActiveController().Class, n = m.attr("id") + "Collapse";
        h[n] || (h[n] = {});
        m.toggleClass("collapsed");
        m.addClass("suppressAutoCollapse");
        if (m.hasClass("collapsed")) {
            m.addClass("manualCollapse").removeClass("manualOpen");
            $(".page_column_fixed.collapsed").width(this.grid.getScrollWidth());
            h[n].manualCollapse = true;
            h[n].manualOpen = false;
            h[n].collapsed = true
        } else {
            m.addClass("manualOpen").removeClass("manualCollapse");
            $(".page_column_fixed").width(175);
            h[n].manualOpen = true;
            h[n].manualCollapse = false;
            h[n].collapsed =
                    false
        }
        h.storeFilterCollapseState();
        GS.resize();
        $(this.element).resize()
    }, handleKeyPress:function (g) {
        if ((g.which === 38 || g.which === 40) && g.shiftKey) {
            var k = this.grid.getSelectedRows().sort(function (n, q) {
                return n - q
            });
            _.orEqual(k[k.length - 1], 1);
            var m, h;
            m = this.currentRow + (g.which === 38 ? -1 : 1);
            m = Math.max(0, Math.min(this.dataView.rows.length - 1, m));
            if ($.inArray(m, k) === -1) {
                k.push(m);
                this.selectedRowIDs.push(this.dataView.getItemByIdx(m).SongID);
                this.currentRow = m;
                this.grid.setSelectedRows(_.arrUnique(k));
                this.grid.onSelectedRowsChanged()
            } else if (g.which ===
                    38) {
                if (m < this.currentRow) {
                    h = $.inArray(this.currentRow, k);
                    _.arrRemove(k, h, h);
                    this.currentRow = m;
                    h = $.inArray(this.currentRow, k);
                    _.arrRemove(k, h, h);
                    k.push(this.currentRow);
                    this.grid.setSelectedRows(_.arrUnique(k));
                    this.grid.onSelectedRowsChanged()
                }
            } else if (m > this.currentRow) {
                h = $.inArray(this.currentRow, k);
                _.arrRemove(k, h, h);
                this.currentRow = m;
                h = $.inArray(this.currentRow, k);
                _.arrRemove(k, h, h);
                k.push(this.currentRow);
                this.grid.setSelectedRows(_.arrUnique(k));
                this.grid.onSelectedRowsChanged()
            }
            g.preventDefault();
            return true
        }
        if (g.which === 13 && this.type == "song") {
            g = this.selectedRowIDs;
            if (this.idProperty == "GridKey") {
                g = [];
                k = 0;
                for (m = this.selectedRowIDs.length; k < m; k++)g.push(this.dataView.getItemByIdx(this.selectedRowIDs[k] - 1).SongID)
            }
            GS.player.addSongsToQueueAt(g, GS.player.INDEX_DEFAULT, true);
            self.currentRow = 0;
            this.grid.setSelectedRows([]);
            this.grid.onSelectedRowsChanged()
        }
        return false
    }, "#grid.songs a.songLink, #grid.feeds div.songs a.songLink click":function (g, k) {
        k.preventDefault();
        var m = parseInt($(g).attr("rel"),
                10);
        if (m && _.defined(k.which) && !$(g).closest(".grid-canvas").hasClass("noLinks")) {
            var h = $(g).data("clickCount");
            h || (h = 0);
            h++;
            h == 1 && setTimeout(this.callback(function () {
                if ($(g).data("clickCount") == 1)if (g[0].href) {
                    var s = $(g).attr("href");
                    if (s.indexOf("#") > 1) {
                        s = s.split("#");
                        GS.router.setHash(s[1])
                    } else GS.router.setHash($(g).attr("href"))
                } else GS.Models.Song.getSong(m, this.callback(function (w) {
                    if (w) {
                        w = w.toUrl();
                        GS.router.setHash(w);
                        var o = parseInt(this.grid.getSelectedRows()[0]) + 1, u = o <= this.data.length ?
                                this.data[o - 1].ppVersion : 0;
                        GS.getGuts().handleFieldClick(w, o, m, u)
                    }
                }));
                $(g).data("clickCount", 0)
            }), 300);
            $(g).data("clickCount", h);
            if (h = $(g).attr("href")) {
                var n = parseInt(this.grid.getSelectedRows()[0]) + 1, q = n <= this.data.length ? this.data[n - 1].ppVersion : 0;
                GS.getGuts().handleFieldClick(h, n, m, q)
            }
        } else if (!_.defined(k.which))return false
    }, "#grid .grid-canvas.noLinks mouseenter":function (g, k) {
        if (window.ctrlDown && !k.shiftKey && !k.ctrlKey && !k.metaKey) {
            $("#grid .grid-canvas").removeClass("noLinks");
            window.ctrlDown =
                    false
        }
    }, "#grid.radioStations .station a click":function (g, k) {
        k.stopPropagation();
        var m = g.attr("data-tagid");
        GS.player.setAutoplay(true, m);
        return false
    }, "#grid.songs a.field click":function (g) {
        g = $(g).attr("href");
        var k = this.grid.getSelectedRows()[0];
        if (g) {
            var m = parseInt(k) + 1;
            k = this.dataView.rows[k].SongID;
            var h = m <= this.data.length ? this.data[m - 1].ppVersion : 0;
            GS.getGuts().handleFieldClick(g, m, k, h)
        }
    }, "#grid.songs .songLinkPlay click":function (g, k) {
        k.preventDefault();
        var m = g.attr("rel");
        if (m) {
            GS.player.addSongAndPlay(m);
            GS.getGuts().logEvent("gridSongsRowSongTitlePlay", {})
        }
    }, "#grid.songs .slick-row click":function () {
        GS.getGuts().logEvent("gridSongsRowClick", {})
    }})
})();

