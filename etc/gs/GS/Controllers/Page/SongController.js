GS.Controllers.PageController.extend("GS.Controllers.Page.SongController", {}, {type:"song", scrollToComment:false, index:function (c, a) {
    this.url = location.hash;
    this.token = c || "";
    this.subpage = a || "overview";
    this.token ? GS.Models.Song.getSongFromToken(this.token, this.callback("loadSong")) : GS.router.notFound()
}, loadSong:function (c) {
    if (c.validate()) {
        this.song = c;
        if (!c.fanbase)c.fanbase = GS.Models.Fanbase.wrap({objectID:c.SongID, objectType:"song"});
        this.correctUrl(this.song, this.subpage === "overview" ? "" : this.subpage);
        this.id = this.song.SongID;
        this.fbCommentsUrl = "http://listen.grooveshark.com/" + this.song.toUrl().replace("#!/", "");
        this.fbUrl = "http://grooveshark.com/" + this.song.toUrl().replace("#!/", "").split("?")[0];
        this.header.name = this.song.SongName;
        this.header.breadcrumbs = [
            {text:this.song.ArtistName, url:_.cleanUrl(this.song.ArtistName, this.song.ArtistID, "artist")},
            {text:this.song.AlbumName, url:_.cleanUrl(this.song.AlbumName, this.song.AlbumID, "album")}
        ];
        this.header.subpages = ["overview"];
        this.header.options = false;
        this.list.doPlayAddSelect = true;
        this.list.doSearchInPage = true;
        this.list.sortOptions = [
            {text:"Track", column:"TrackNum"},
            {text:"Popularity", column:"Popularity"},
            {text:"Song Name", column:"Name"},
            {text:"Artist Name", column:"ArtistName"}
        ];
        this.element.html(this.view("index"));
        switch (this.subpage) {
            case "overview":
            default:
                this.song.album = GS.Models.Album.getOneFromCache(this.song.AlbumID);
                this.triedUnverified = this.song.album ? this.song.album.songsLoaded && this.song.album.songsUnverifiedLoaded : false;
                GS.Controllers.PageController.title(this.song.getTitle());
                $("#page_header button.share").parent().show();
                if (window.FB && FB.XFBML && this.fbUrl && GS.getFacebook().initialXFBML)FB.XFBML.parse(window.document.getElementById("page_content"), this.callback("onPageLoaded")); else if (this.fbUrl) {
                    var a;
                    a = this.subscribe("gs.facebook.xfbml.ready", this.callback(function () {
                        FB.XFBML.parse(window.document.getElementById("page_content_pane"), this.callback("onPageLoaded"));
                        $.unsubscribe(a)
                    }))
                }
                this.fans = [];
                this.fansLoaded = false;
                this.song.fanbase.getFans(this.callback("loadSidebarFans"),
                        this.callback("loadSidebarFans"), false);
                break
        }
        c.getVideos(this.callback("loadVideos"), this.callback("loadVideosFailed"));
        GS.Models.Artist.getArtist(this.song.ArtistID, this.callback("loadDigests"));
        GS.service.getSongRecentListeners(this.song.SongID)
    } else GS.router.notFound()
}, onPageLoaded:function () {
    setTimeout(this.callback(function () {
        if ($("#page_content_social_buttons").length) {
            $("#page_content .comments").removeClass("loadingFBComments");
            $("#page_content_social_buttons .fblike").css("width", this.likeWidth);
            this.loadLikeButtonCount(this.fbUrl);
            FB.XFBML.parse(window.document.getElementById("fbLike"), this.callback(function () {
                setTimeout(function () {
                    $.publish("gs.facebook.xfbml.ready")
                }, 100);
                this.scrollToComment && this.scrollToFBComment();
                $("#page_content_social_buttons .fblike").css("width", this.likeWidth)
            }));
            GS.resize();
            GS.getTwitter().getTwitterShareMessage("song", this.song, this.fbUrl, this.callback(function (c, a) {
                var b = $(document.createElement("a"));
                b.attr("data-text", c.replace('"', '"'));
                b.attr("data-url",
                        a);
                b.attr("data-via", "grooveshark");
                b.attr("data-count", "none");
                b.addClass("twitter-share-button");
                b.text("Tweet");
                $("#page_content_social_buttons .tweetButton").empty().append(b);
                GS.getTwitter().parseWidgets()
            }));
            GS.getGoogle().parsePlusWidgets($("#page_content_social_buttons .googlePlusButton").get(0))
        }
    }), 10)
}, loadDigests:function (c) {
    this.artist = c;
    this.artist.getSongs(this.callback("loadAlbumDigest"));
    GS.service.artistGetSimilarArtists(this.artist.ArtistID, this.callback("loadSimilarDigest"));
    GS.service.getSongkickEventsFromArtists([this.artist.ArtistID],
            [this.artist.ArtistName], this.callback("loadEventsDigest"));
    if (!GS.user.subscription.canHideAds()) {
        c = (new Date).getTime();
        GS.getAd().updateRotationCount();
        GS.getAd().buildAd($("#songCapital_300"), 300, 250, ["p=song_overview", "v=" + c]);
        GS.getAd().buildAd($("#songCapital_728"), 728, 90, ["p=song_overview", "v=" + c])
    }
}, loadAlbumDigest:function () {
    if (this.artist && this.artist.albums) {
        var c = _.toArray(this.artist.albums).sort(GS.Models.Album.prettySort).slice(0, 6);
        c.length && $("#album_digest").html(this.view("/artist/album_digest",
                {artist:this.artist, albums:c}))
    }
}, loadSimilarDigest:function (c) {
    this.similarArtists = GS.Models.Artist.wrapCollection(c.SimilarArtists);
    this.similarArtists.length && this.element.find("#similarArtists_digest").html(this.view("/artist/similarArtists_digest"))
}, loadEventsDigest:function (c) {
    if (c && c.length) {
        c.sort(_.getSort("StartTime", -1));
        c = c.slice(0, 5);
        $("#events_digest").html(this.view("/artist/event_digest", {artist:this.artist, events:c}))
    }
}, loadVideos:function (c) {
    if (this.subpage === "overview")if (c && c.length) {
        this.videos =
                c;
        $("#song_videos").html(this.view("song_videos", {videos:c}))
    }
}, loadVideosFailed:function () {
    if (this.subpage === "overview")if (this.fans.length) {
        this.sliderObject = this.videos = this.fans;
        this.sliderObject.name = '<span data-translate-text="FANS">' + $.localize.getString("FANS") + "</span>";
        this.sliderWidth = this.fans.length * 140;
        this.sliderContents = this.fans;
        this.sliderRenderer = GS.Models.User.sliderRenderer;
        $("#song_subcontent").removeClass("loading").html(this.view("/shared/slider"))
    } else if (this.fansLoaded)$("#song_subcontent").removeClass("loading").hide();
    else this.loadSubFans = true
}, loadSidebarFans:function (c) {
    this.fansLoaded = true;
    if (c) {
        var a = [];
        for (var b in c)if (c.hasOwnProperty(b)) {
            if (a.length >= 20)break;
            c[b].Picture && a.push(c[b])
        }
        this.fans = a;
        this.sidebarFans = true;
        $("#song_fans").html(this.view("/shared/sidebarFans", {fans:a, seeAll:false}));
        this.loadSubFans && this.loadVideosFailed()
    } else this.loadSubFans && $("#song_subcontent").removeClass("loading").hide()
}, selectCurrentSong:function () {
    var c = this.element.find(".gs_grid").controller();
    if (c) {
        var a = c.dataView.getIdxById(this.song.SongID),
                b = c.grid.getSelectedRows();
        b.push(a);
        c.selectedRowIDs.push(this.song.SongID);
        c.grid.setSelectedRows(b);
        c.grid.onSelectedRowsChanged()
    }
}, scrollToFBComment:function () {
    this.scrollToComment = true
}, ".slick-row.verifiedDivider click":function (c, a) {
    a.stopPropagation();
    var b = $("#grid").controller(), d;
    if (b) {
        if (!this.triedUnverified) {
            this.triedUnverified = true;
            this.song.getRelatedSongs(this.callback("loadRelatedGrid"), null, false)
        }
        if (b.filter.onlyVerified) {
            c.find(".showMore").addClass("showingMore").attr("data-translate-text",
                    "SEARCH_RESULTS_SHOW_LESS").html($.localize.getString("SEARCH_RESULTS_SHOW_LESS"));
            b.filter.onlyVerified = false
        } else {
            c.find(".showMore").removeClass("showingMore").attr("data-translate-text", "SEARCH_RESULTS_SHOW_MORE").html($.localize.getString("SEARCH_RESULTS_SHOW_MORE"));
            b.filter.onlyVerified = 1
        }
        (d = b.grid) && d.onSort(b.sortCol, b.sortDir)
    }
}, ".page_content_profile_options .share click":function () {
    GS.getLightbox().open("share", {type:"song", id:this.song.SongID})
}, "a.songLink click":function (c, a) {
    a.preventDefault();
    var b = parseInt($(c).attr("rel"), 10);
    b && GS.Models.Song.getSong(b, function (d) {
        d && GS.router.setHash(d.toUrl())
    })
}, "a.video click":function (c) {
    c = parseInt($(c).attr("rel"), 10);
    GS.getLightbox().open("video", {videos:this.videos, index:c, autoSkipToNextVideo:false, renderSection:false})
}, ".capitalSliderBtn click":function (c) {
    c = $(c);
    c.scrollLeft(0);
    $(c).hasClass("capitalSliderNext") ? $(".capitalView_728").animate({scrollLeft:$(".capitalView_728").scrollLeft() + 200}, 500) : $(".capitalView_728").animate({scrollLeft:$(".capitalView_728").scrollLeft() -
            200}, 500)
}, ".capitalSliderBtn mouseup":function (c) {
    c = $(c);
    c.scrollLeft(0);
    console.warn("hereeee")
}, getOptionMenu:function () {
    var c = [], a = this.song.SongID;
    songName = this.song.SongName;
    GS.user.getIsShortcut("song", a) ? c.push({title:$.localize.getString("CONTEXT_REMOVE_FROM_PINBOARD"), action:{type:"fn", callback:function () {
        GS.user.removeFromShortcuts("song", a);
        $("#page_header a[name=shortcut]").parent().show();
        $("#page_header a[name=removeshortcut]").parent().hide()
    }}, customClass:"jj_menu_item_hasIcon jj_menu_remove_music"}) :
            c.push({title:$.localize.getString("CONTEXT_ADD_TO_PINBOARD"), action:{type:"fn", callback:function () {
                GS.user.addToShortcuts("song", a, songName, true);
                $("#page_header a[name=shortcut]").parent().hide();
                $("#page_header a[name=removeshortcut]").parent().show()
            }}, customClass:"jj_menu_item_hasIcon jj_menu_item_pinboard"});
    return c
}, getShopMenu:function () {
    var c = [], a = this.song.SongID;
    songName = this.song.SongName;
    c.push({title:$.localize.getString("CONTEXT_BUY_SONG"), action:{type:"fn", callback:function () {
        GS.getLightbox().open("buySong",
                a)
    }, log:function () {
        GS.getGuts().onContextMenuClick("contextBuySong", "songOptionsMenu", false, null)
    }}, customClass:"jj_menu_item_hasIcon jj_menu_item_download"});
    return c
}, getPlayMenu:function () {
    var c = this.getPlayContext(), a = [this.song.SongID], b = this.element;
    return[
        {title:$.localize.getString("PLAY_NOW"), action:{type:"fn", callback:function () {
            a.length && GS.player.addSongsToQueueAt(a, GS.player.INDEX_DEFAULT, true, c)
        }, log:function () {
            GS.getGuts().objectListPlayAdd(a, b, "play")
        }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play"},
        {title:$.localize.getString("PLAY_NEXT"), action:{type:"fn", callback:function () {
            a.length && GS.player.addSongsToQueueAt(a, GS.player.INDEX_NEXT, false, c)
        }, log:function () {
            GS.getGuts().objectListPlayAdd(a, b, "play")
        }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_next"},
        {title:$.localize.getString("PLAY_LAST"), action:{type:"fn", callback:function () {
            a.length && GS.player.addSongsToQueueAt(a, GS.player.INDEX_LAST, false, c)
        }, log:function () {
            GS.getGuts().objectListPlayAdd(a, b, "play")
        }}, customClass:"jj_menu_item_hasIcon jj_menu_item_play_last"},
        {customClass:"separator"},
        {title:$.localize.getString("REPLACE_QUEUE"), action:{type:"fn", callback:function () {
            a.length && GS.player.addSongsToQueueAt(a, GS.player.INDEX_REPLACE, true, c)
        }, log:function () {
            GS.getGuts().objectListPlayAdd(a, b, "play")
        }}, customClass:"jj_menu_item_hasIcon jj_menu_item_replace_playlist"},
        {title:$.localize.getString("START_RADIO"), action:{type:"fn", callback:function () {
            a.length && GS.player.addSongsToQueueAt(a, GS.player.INDEX_REPLACE, true, c, true)
        }, log:function () {
            GS.getGuts().objectListPlayAdd(a,
                    b, "play")
        }}, customClass:"jj_menu_item_hasIcon jj_menu_item_new_station"}
    ]
}});

