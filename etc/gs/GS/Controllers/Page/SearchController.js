GS.Controllers.PageController.extend("GS.Controllers.Page.SearchController", {cache:{}}, {defaultType:"digest", validTypes:{song:true, playlist:true, user:true, event:true, album:true, artist:true, digest:true}, query:"", queryAsTag:"", tagID:0, type:"", ppOverride:false, originalUsers:null, searchUsers:null, startTimes:{}, currentFilterStr:null, currentSort:null, prefetchSize:3, displayMethod:"grid", videoResults:[], songs:[], albums:[], artists:[], GENRE_TAGS:{"40s":2837, "50s":1087, "60s":266, "70s":588, "80s":55, "8bit":2145,
    "90s":9, acapella:4263, acidjazz:3519, acoustic:105, alternativerock:1259, ambient:75, americana:922, anime:120, banda:4264, bass:585, beach:912, beat:1475, bhangra:130, blackmetal:4265, bluegrass:96, blues:230, bluesrock:1106, britpop:534, celtic:513, chanson:3692, chillout:251, chinese:4266, christian:439, christianmetal:4267, christianrock:4268, christmas:703, classical:750, classiccountry:4269, classicrock:3529, club:1038, contemporarychristian:4270, country:80, crunk:748, cumbia:4271, dance:71, dancehall:269, darkwave:2139, dcima:4272,
    deathmetal:4273, desi:2512, disco:899, disney:623, dnb:273, downtempo:153, dub:3501, dubstep:2563, electro:162, electronic:123, electronica:67, electropop:893, emo:131, eurodance:4028, experimental:191, flamenco:85, folk:122, folkrock:925, funk:397, funky:398, goa:2556, gospel:1489, grime:268, grunge:134, hardcore:245, hardstyle:4274, heavymetal:1054, hiphop:29, house:48, indie:136, indiefolk:1221, indiepop:573, indierock:1138, industrial:275, island:2294, jazz:43, jazzblues:4275, jazzfusion:4276, jesus:1356, jpop:568, jrock:434, jungle:248,
    kpop:1765, lounge:765, mathrock:4277, medieval:2585, meditation:700, melodic:929, merengue:84, metal:17, metalcore:705, minimal:2177, motown:4278, mpb:819, neofolk:1139, neosoul:4279, noise:171, nujazz:3518, numetal:1103, oi:4280, oldies:102, opera:1535, orchestra:2760, pagode:3606, pop:56, poppunk:1333, poprock:3468, posthardcore:1332, postrock:422, powermetal:4063, progressive:97, progressiverock:4137, psychedelic:1168, psychobilly:3909, punkrock:1754, ragga:4281, rap:3, rave:271, rb:4282, reggae:160, reggaeton:940, relax:1941, rnb:877,
    rock:12, rockabilly:1086, rocksteady:4283, rootsreggae:4284, rumba:3454, salsa:81, samba:4285, schlager:3162, screamo:166, sertanejo:4286, singersongwriter:923, ska:100, skapunk:1110, smoothjazz:3855, softrock:1311, soul:520, soundtrack:72, southernrock:1298, surf:1408, swing:1032, symphonicmetal:4287, synthpop:163, tango:2868, techno:47, tejano:789, texascountry:4288, thrashmetal:4289, trance:69, triphop:158, turkish:689, underground:468, vallenato:89, videogame:115, vocal:6, world:313, zydeco:4290}, index:function (c, a) {
    c = _.orEqual(c,
            "digest");
    this.ppOverride = _.orEqual(GS.user.searchVersion, false);
    var b = GS.getGuts();
    if (b.currentTest && b.currentTest.name == "interleaving_htp_htp4")this.ppOverride = "Interleaving_HTP_HTP4"; else if (b.currentTest && b.currentTest.name == "interleaving_songclicks_htp4")this.ppOverride = "Interleaving_SongClicks_HTP4";
    if (a.indexOf("ppVersion:", 0) === 0) {
        b = a.split(/\s+/);
        this.ppOverride = b[0].split(":")[1];
        a = b.splice(1, b.length).join(" ")
    }
    this.query = _.orEqual(a, "").replace(/\s+/g, " ");
    this.cleanQuery = _.cleanText(this.query);
    $("#header_search input.search").val(this.cleanQuery).siblings("span.placeholder").hide();
    this.type = c;
    this.queryAsTag = a.replace(/[-\s]*/g, "").toLowerCase();
    this.isTagSearch = false;
    if (this.GENRE_TAGS.hasOwnProperty(this.queryAsTag) && (this.type == "digest" || this.type == "song")) {
        this.isTagSearch = true;
        this.tagID = this.GENRE_TAGS[this.queryAsTag]
    }
    if (this.type && !this.validTypes[this.type])this.type = this.defaultType;
    GS.search.lastSearch = GS.search.search;
    GS.search.lastType = GS.search.type;
    GS.search.search = this.query;
    (GS.search.type = this.type) && this.type != "digest" ? GS.Controllers.PageController.title("All " + _.ucwords(this.type) + " Results: " + this.query) : GS.Controllers.PageController.title("Search: " + this.query);
    this.displayMethod = c == "digest" ? "slickbox" : "grid";
    this.element.html(this.view("index"));
    this.showGridLoading();
    if (this.query === "") {
        this.element.find(".gs_grid." + (c + "s")).html(this.view("noResults"));
        $(".gs_grid input[name=q]", this.element).val(this.query);
        $("#searchForm input").select();
        this.addAutocomplete("search");
        GS.resize();
        GS.getGuts().logEvent("search", {type:this.type || "song", searchString:this.query, searchTime:0, numResults:0});
        GS.getGuts().beginContext({mostRecentSearch:this.query, mostRecentSearchType:this.type || "song", mostRecentSearchVersion:""})
    } else {
        $("#page_search a.remove").removeClass("hide");
        $.localize.ready ? this.detectRadio() : this.subscribe("gs.locale.ready", this.callback(function () {
            this.detectRadio()
        }));
        this.startTimes.song = (new Date).getTime();
        var d = {Artists:this.callback(function (k) {
                    $("#page_nav_option_artist .count").text(k ?
                            k.length : 0);
                    this.artists = k && k.length ? k.slice(0, 3) : [];
                    $("#profile_artists").html(this.view("topArtists"))
                }), Songs:this.callback(function () {
                }), Albums:this.callback(function (k) {
                    this.albums = k && k.length ? k : [];
                    $("#profile_albums").html(this.view("topAlbums"))
                }), Users:this.callback(function (k) {
                    k.sort(this.sortByPicture);
                    this.users = k && k.length ? k.slice(0, 3) : [];
                    $("#profile_users").html(this.view("topUsers"))
                }), Playlists:this.callback(function (k) {
                    this.playlists = k && k.length ? k.slice(0, 3) : [];
                    $("#profile_playlists").html(this.view("topPlaylists"))
                }),
                    Events:this.callback(function (k) {
                        this.events = k && k.length ? k.slice(0, 3) : [];
                        $("#profile_events").html(this.view("topEvents"))
                    }), Eventsanddarfms:this.callback(function (k) {
                        this.events = k.event && k.event.length ? GS.Models.Event.wrapCollection(k.event.slice(0, 3), {ppVersion:""}) : [];
                        for (var m = 0, h = this.events.length; m < h; m++)if ((this.events[m].StartTime + "").indexOf(":") == -1) {
                            this.events[m].EventID = m;
                            this.events[m].StartTime = parseInt(this.events[m].StartTime);
                            if (this.events[m].StartTime)this.events[m].StartTime =
                                    (new Date(this.events[m].StartTime * 1E3)).format("Y-m-d G:i:s");
                            this.events[m].ArtistName = this.events[m].ArtistName || this.events[m].Artists
                        }
                        $("#profile_events").html(this.view("topEvents"));
                        if (k.darfm && k.darfm.length && !GS.user.subscription.canHideAds()) {
                            $("#searchCapitalWrapper_728").remove();
                            $("#darfm_728").attr("href", _.orEqual(k.darfm[0].Link, "http://dar.fm")).click(function () {
                                GS.getGuts().forceLogEvent("darFMClicked", {})
                            });
                            $("#darfmWrapper_728").show();
                            GS.getGuts().forceLogEvent("darFMShown", {})
                        }
                    })},
                f = [];
        b = this.callback(function (k, m, h, n, q) {
            if (!(!k.length && this.type == "digest" && (h == "song" || h == "album" || h == "artist"))) {
                this.type == "digest" && $("#page_content_pane .content").append(this.view("digestSection", {type:h, cleanQuery:this.cleanQuery}));
                m = h == "song" || this.type != "digest" || !$("#" + h + "Grid").length ? $("#grid") : $("#" + h + "Grid");
                this.items = k;
                this.options = n;
                this.columns = q;
                this.displayResults(this.displayMethod, m, h)
            }
        });
        if (this.type == "digest") {
            d.Songs = b;
            d.Albums = b;
            d.Artists = b;
            f = ["Songs", "Albums", "Artists"]
        } else {
            var g =
                    _.ucwords(this.type + "s");
            d[g] = b;
            if (this.type == "song" || this.type == "album" || this.type == "artist")f = ["Songs", "Albums", "Artists"]; else f.push(g)
        }
        if (!GS.user.subscription.canHideAds()) {
            $(".capitalWrapper_728").removeClass("hide");
            $(".capitalWrapper_300").removeClass("hide")
        }
        this.getResults(d, f, this.callback(function () {
            if (!GS.user.subscription.canHideAds()) {
                var k = ["q=" + this.query, "t=" + (this.type || "song"), "p=search_" + this.type];
                this.artists && this.artists[0] && k.push("7=" + this.artists[0].ArtistID, "8=" + this.artists[0].ArtistName);
                k.push("v=" + (new Date).getTime());
                GS.getAd().updateRotationCount();
                GS.getAd().buildAd($("#searchCapital_300"), 300, 250, k);
                GS.getAd().buildAd($("#searchCapital_728"), 728, 90, k)
            }
            k = (new Date).getTime();
            this.startTimes.artist = k;
            this.startTimes.album = k;
            this.startTimes.playlist = k;
            this.startTimes.user = k;
            this.type != "digest" && this.type != "artist" && this.type != "song" && this.type != "album" && this.getResults(d, ["Songs", "Albums", "Artists"], null, false);
            this.type != "playlist" && this.getResults(d, ["Playlists"], null, false);
            this.type != "user" && this.getResults(d, ["Users"], null, false);
            this.type != "event" && this.getResults(d, ["EventsAndDarFM"], null, false);
            this.suggest()
        }), true, this.isTagSearch);
        GS.getYoutube().search(this.query, 20, this.callback("displayVideoResults"), this.callback("getVideoResultsError"))
    }
}, getResults:function (c, a, b, d, f) {
    var g = this.callback(function (w, o, u) {
        if (w === this.query) {
            var z, D, B = {}, E = {sortCol:"Score", sortDir:0}, F, y, I = "Songs";
            if (a.length == 1) {
                if ($.isArray(a) && a.length === 1)F = a[0];
                if (F !== "EventsAndDarFM") {
                    F =
                            F.substring(0, F.length - 1);
                    y = F + "s"
                } else y = F;
                if (u.result && u.result[y] && u.result[y].length && u.result[y][0] && !u.result[y][0].init)u.result[y] = GS.Models[_.ucwords(F)].wrapCollection(u.result[y], {ppVersion:""});
                if (u.result && u.result[y])this[y.toLowerCase()] = u.result[y]; else this[y.toLowerCase()] = [];
                I = y
            } else {
                if (u.result && u.result.Songs && u.result.Songs.length && u.result.Songs[0] && !u.result.Songs[0].init)u.result.Songs = GS.Models.Song.wrapCollection(u.result.Songs, {ppVersion:""});
                if (u.result && u.result.Albums &&
                        u.result.Albums.length && u.result.Albums[0] && !u.result.Albums[0].init)u.result.Albums = GS.Models.Album.wrapCollection(u.result.Albums, {ppVersion:""});
                if (u.result && u.result.Artists && u.result.Artists.length && u.result.Artists[0] && !u.result.Artists[0].init)u.result.Artists = GS.Models.Artist.wrapCollection(u.result.Artists, {ppVersion:""});
                this.songs = u.result.Songs || [];
                this.albums = u.result.Albums || [];
                this.artists = u.result.Artists || [];
                var C = [];
                this.songs[0] ? C.push({name:this.songs[0].SongName.toLowerCase(),
                    verified:this.songs[0].IsVerified}) : C.push({name:"", verified:0});
                this.artists[0] ? C.push({name:this.artists[0].ArtistName.toLowerCase(), verified:this.artists[0].IsVerified}) : C.push({name:"", verified:0});
                this.albums[0] ? C.push({name:this.albums[0].AlbumName.toLowerCase(), verified:this.albums[0].IsVerified}) : C.push({name:"", verified:0});
                for (var H = 0, K = C.length, r = w.indexOf(" by "), t, v; H < K; H++) {
                    t = C[H].name == w.toLowerCase();
                    v = H != 1 && r > 0 ? C[H].name == w.toLowerCase().substring(0, r) : false;
                    if (t || v) {
                        switch (H) {
                            case 1:
                                I =
                                        "Artists";
                                break;
                            case 2:
                                I = "Albums";
                                break
                        }
                        if (C[H].verified)break
                    }
                }
            }
            var x = 0;
            w = this.callback(function (A) {
                if ((B = u.result[A]) && B.length) {
                    if (B[0].SongID)F = "song"; else if (B[0]instanceof GS.Models.Album)F = "album"; else if (B[0]instanceof GS.Models.Artist)F = "artist"; else if (B[0]instanceof GS.Models.Playlist)F = "playlist"; else if (B[0]instanceof GS.Models.User)F = "user"; else if (B[0]instanceof GS.Models.Event)F = "event";
                    if (F === "song") {
                        D = GS.Controllers.GridController.columns.song.concat();
                        z = [D[0], D[1], D[2]];
                        if (this.type ==
                                "digest" || this.type == "song") {
                            A = [];
                            for (var G = 0; G < B.length && G < this.prefetchSize; G++)A.push(B[G].SongID);
                            GS.player.prefetchStreamKeys(A)
                        }
                    } else {
                        z = GS.Controllers.GridController.columns[F];
                        if (F === "event") {
                            E = {sortCol:"StartTime", sortDir:1, rowCssClasses:function () {
                                return"event"
                            }};
                            A = 0;
                            for (G = B.length; A < G; A++)if ((B[A].StartTime + "").indexOf(":") == -1) {
                                B[A].EventID = A;
                                B[A].StartTime = parseInt(B[A].StartTime);
                                if (B[A].StartTime)B[A].StartTime = (new Date(B[A].StartTime * 1E3)).format("Y-m-d G:i:s");
                                B[A].ArtistName = B[A].ArtistName ||
                                        B[A].Artists
                            }
                        }
                    }
                    x++
                } else z = [];
                A = _.ucwords(F + "s");
                if (G = o[A])GS.Controllers.Page.SearchController.cache[G] = u;
                if (c && $.isFunction(c[A])) {
                    if (this.type == "digest" && !f && B.length)B = B.slice(0, 15);
                    c[A](B, o[A], F, E, z)
                }
            });
            w(I);
            for (y in u.result)if (I != y) {
                F = y.substring(0, y.length - 1).toLowerCase();
                this.validTypes[F] && w(y)
            }
            if (d) {
                if (!x) {
                    F = this.type ? this.type + "s" : "digest";
                    this.element.find(".gs_grid." + F.toLowerCase()).length ? this.element.find(".gs_grid." + F.toLowerCase()).html(this.view("noResults")) : $("#page_content_pane .content").append('<div id="grid">' +
                            this.view("noResults") + "</div>");
                    this.addAutocomplete("search");
                    GS.resize()
                }
                y = (new Date).getTime() - this.startTimes[F];
                GS.search.version = u.version;
                GS.search.server = _.orEqual(u.server, "not set");
                y = {type:this.type || "song", searchString:this.query, searchVersion:u.version, searchTime:y, numResults:B ? B.length : 0};
                if (this.isTagSearch) {
                    y.isTagSearch = true;
                    y.tag = this.queryAsTag
                }
                GS.getGuts().logEvent("search", y);
                y = {mostRecentSearch:this.query, mostRecentSearchType:this.type || "song", mostRecentSearchVersion:u.version};
                if (this.isTagSearch)y.mostRecentTagSearched = this.queryAsTag;
                GS.getGuts().beginContext(y);
                !this.isTagSearch && GS.getGuts().context.hasOwnProperty("mostRecentTagSearched") && GS.getGuts().endContext("mostRecentTagSearched");
                GS.getGuts().handlePageLoad("search", {type:this.type || "song"})
            }
            if (this.type == "song" && F == "song" && !GS.user.searchVersion)GS.user.searchVersion = u.assignedVersion;
            $.isFunction(b) && b()
        }
    }), k = this.callback(function (w, o, u) {
        u = {result:{Songs:u}};
        g(w, o, u)
    });
    a = _.orEqual(a, [this.type]);
    $.isArray(a) ||
    (a = [a]);
    for (var m = {}, h, n = 0, q = 0, s; s = a[q]; q++) {
        h = s + ":" + this.query + ":" + this.ppOverride;
        GS.Controllers.Page.SearchController.cache[h] && $.isFunction(c[s]) && n++;
        m[s] = h
    }
    if (f && $.inArray(a, "Songs")) {
        m = ["tagSearch:" + h];
        GS.service.tagRadioGetAllSongs(this.tagID, this.callback(k, this.query, m), this.callback(g, this.query, m))
    } else a.length > n ? GS.service.getResultsFromSearch(this.query, a, this.ppOverride, this.callback(g, this.query, m), this.callback(g, this.query, m)) : g(this.query, {}, GS.Controllers.Page.SearchController.cache[h])
},
    displayResults:function (c, a, b) {
        if (c != this.displayMethod)if (this.displayMethod == "grid") {
            a.controller().destroy();
            a.addClass("gs_grid")
        } else if (this.displayMethod == "slickbox") {
            this.slickbox.destroy();
            this.slickbox = null;
            this.artistSlickbox.destroy();
            this.artistSlickbox = null;
            this.albumSlickbox.destroy();
            this.albumSlickbox = null
        }
        if (b == "song" || b == "event" || b == "" || c == "grid") {
            this.options.scrollPane = $("#page");
            this.options.padding = 0;
            if (this.type === "user") {
                this.items = this.items.sort(this.sortByPicture);
                this.options.sortCol =
                        false
            } else if (b === "artist" || b == "event")this.options.disableMultiSelect = true;
            a.gs_grid(this.items, this.columns, this.options, b)
        } else b == "user" ? this.renderSlickBox(b, this.items, {sortType:"byPicture", sortFunction:this.sortByPicture}) : this.renderSlickBox(b, this.items, this.currentSort);
        this.displayMethod = c
    }, displayVideoResults:function (c) {
        this.videoResults = c;
        $("#profile_videos").html(this.view("videoResults"))
    }, "a.video click":function (c) {
        c = parseInt($(c).attr("rel"), 10);
        GS.getLightbox().open("video", {videos:this.videoResults,
            index:c, autoSkipToNextVideo:false, renderSection:false})
    }, getVideoResultsError:function () {
        console.warn("error with video search")
    }, suggest:function () {
        if ($("#page_content").is(".search")) {
            if (!window.google)window.google = {};
            if (!window.google.ac)window.google.ac = {};
            window.google.ac.h = this.callback(function (a) {
                var b = false;
                if (a[1].length > 0) {
                    a = a[1];
                    b = a[0][0].replace(/(?:\s?lyrics[^\s]*$|\<\/?[a-zA-Z]+\>)/g, "")
                }
                b && this.suggestSuccess("eg", b)
            });
            var c = "http://google.com/complete/search?output=json&q=" + $.trim(this.query) +
                    " lyrics&client=serp";
            $.ajax({url:c, dataType:"jsonp", jsonp:false, jsonpCallback:"window.google.ac.h", success:function () {
            }, error:function () {
            }})
        }
    }, suggestSuccess:function (c, a) {
        if ((a = _.uncleanText($.trim(a))) && $.trim(this.query).toLowerCase() !== a) {
            this.querySuggest = a;
            this.suggestSource = c;
            $("#didYouMean a").text(a).attr("title", a).data({searchquery:a, searchtype:this.type ? this.type : ""});
            $("#page_subheader").removeClass("hide");
            GS.resize();
            GS.getGuts().gaTrackEvent("search", "suggest", this.suggestSource);
            GS.getGuts().logEvent("suggest", {suggest:this.querySuggest, source:this.suggestSource, numSongs:$("#grid").controller() ? $("#grid").controller().dataView.rows.length : 0})
        }
    }, ".didYouMean a.remove click":function () {
        $("#page_subheader").remove();
        GS.resize()
    }, ".didYouMean a click":function () {
        var c = $("#grid").controller();
        c = c && c.dataView ? c.dataView.rows.length : 0;
        GS.getGuts().gaTrackEvent("search", "suggestClick", this.suggestSource, c);
        GS.getGuts().logEvent("suggestClick", {suggest:this.querySuggest, source:this.suggestSource,
            numSongs:c})
    }, detectRadio:function () {
        if ($("#page_content").is(".search")) {
            var c = GS.Models.Station.getStationByName(this.query.toLowerCase());
            if (c) {
                var a = new GS.Models.DataString;
                a.string = $.localize.getString("SEARCH_START_RADIO");
                a.data = {name:$.localize.getString(c.StationTitle)};
                $("#page_content_pane .radio_suggestion").removeClass("hide");
                $("#page_content_pane .radio_suggestion a.startRadio").attr("rel", c.StationID).html("<span>" + a.render() + "</span>")
            }
        }
    }, ".radio_artist_suggestion .startRadio click":function (c) {
        GS.player.setAutoplay(true,
                c.attr("data-tagid"))
    }, ".radio_suggestion .startRadio click":function (c) {
        GS.player.setAutoplay(true, c.attr("rel"))
    }, "#grid a, #songDigest a, #albumDigest a, #artistDigest a click":function (c) {
        if (c.attr("href")) {
            var a = false, b = c.attr("href").split("/");
            if (b[1] == "artist")a = {artistID:b[3]}; else if (b[1] == "album")a = {albumID:b[3]}; else if (b[1] == "user")a = {userID:b[3]}; else if (b[1] == "playlist")a = {playlistID:b[3]};
            if (a) {
                a.rank = c.parents("div.slick-row").length ? 1 + parseInt(c.parents("div.slick-row").attr("row"),
                        10) : 1 + parseInt(c.parents("li.slickbox-item").attr("rel"), 10);
                GS.getGuts().logEvent(GS.getGuts().searchClickLpid, a)
            }
        }
    }, renderSlickBox:function (c, a, b) {
        switch (c) {
            case "user":
                this.currentFilterStr = this.query;
                this.originalUsers = a.concat();
                this.renderUsers(this.originalUsers, b);
                break;
            case "playlist":
                this.renderPlaylists(a, b);
                break;
            case "album":
                this.renderAlbums(a, b);
                break;
            case "artist":
                this.renderArtists(a, b);
                break
        }
    }, renderAlbums:function (c, a) {
        var b = $("#albumGrid").length ? $("#albumGrid") : $("#grid");
        this.currentSort =
                _.orEqual(a, {sortType:"relevance", sortFunction:null});
        b.html("").css("height", "auto").addClass("albums");
        this.albumSlickbox = $("#albumGrid").slickbox({sortFunction:this.currentSort.sortFunction, scrollPane:"#page", padding:0, itemRenderer:GS.Models.Album.itemRenderer, itemWidth:195, itemHeight:70, maxHorizontalGap:20, minHorizontalGap:5, verticalGap:15, dragAs:"album", dragItemID:"AlbumID", hidePositionInfo:true, displayRows:this.type == "digest" ? 1 : -1}, c);
        this.sliderOrBoxDragSetup(this.albumSlickbox, ".slickbox-item")
    },
    renderPlaylists:function (c, a) {
        this.currentSort = _.orEqual(a, {sortType:"relevance", sortFunction:null});
        $("#playlistGrid").html("").css("height", "auto").addClass("playlistList");
        this.slickbox = $("#playlistGrid").slickbox({sortFunction:this.currentSort.sortFunction, scrollPane:"#page", padding:0, itemRenderer:GS.Models.Playlist.itemRenderer, itemWidth:195, itemHeight:70, maxHorizontalGap:20, minHorizontalGap:5, verticalGap:15, dragAs:"playlist", dragItemID:"PlaylistID"}, c);
        this.sliderOrBoxDragSetup(this.slickbox,
                ".slickbox-item")
    }, renderArtists:function (c, a) {
        var b = $("#artistGrid").length ? $("#artistGrid") : $("#grid");
        this.currentSort = _.orEqual(a, {sortType:"relevance", sortFunction:null});
        b.html("").css("height", "auto").addClass("artistList");
        this.artistSlickbox = $("#artistGrid").slickbox({sortFunction:this.currentSort.sortFunction, scrollPane:"#page", padding:0, itemRenderer:GS.Models.Artist.itemRenderer, itemWidth:195, itemHeight:70, maxHorizontalGap:20, minHorizontalGap:5, verticalGap:15, dragAs:"artist", dragItemID:"ArtistID",
            hidePositionInfo:true, displayRows:this.type == "digest" ? 1 : -1}, c);
        this.sliderOrBoxDragSetup(this.artistSlickbox, ".slickbox-item")
    }, renderUsers:function (c, a) {
        this.currentSort = _.orEqual(a, {sortType:"relevance", sortFunction:null});
        var b = $("body").width() <= 1024 || $("body").height() <= 800;
        $("#userGrid").html("").css("height", "auto").addClass("userlist");
        this.slickbox = $("#userGrid").slickbox({sortFunction:this.currentSort.sortFunction, scrollPane:"#page", padding:0, listClass:b ? "smallUserView" : "", itemRenderer:GS.Models.User.itemRenderer,
            itemWidth:b ? 175 : 130, itemHeight:b ? 50 : 185, maxHorizontalGap:20, minHorizontalGap:5, verticalGap:15}, c)
    }, getSortMenu:function () {
        switch (this.type) {
            case "song":
                return this.getSongSortMenu();
            case "playlist":
                return this.getPlaylistSortMenu();
            case "user":
                return this.getUserSortMenu();
            case "event":
                return this.getEventSortMenu();
            case "album":
            case "artist":
                return this.getArtistAlbumSortMenu();
            default:
                return[]
        }
    }, getSongSortMenu:function () {
        var c = this.setSort;
        return[
            {title:$.localize.getString("SORT_BY_RELEVANCE"),
                action:{type:"fn", callback:function () {
                    c("Rank", triggerElement, "SORT_BY_RELEVANCE")
                }}, customClass:"jj_menu_item_blank"},
            {title:$.localize.getString("SORT_BY_SONG"), action:{type:"fn", callback:function () {
                c("SongName", triggerElement, "SORT_BY_SONG")
            }}, customClass:"jj_menu_item_blank"},
            {title:$.localize.getString("SORT_BY_ARTIST"), action:{type:"fn", callback:function () {
                c("ArtistName", triggerElement, "SORT_BY_ARTIST")
            }}, customClass:"jj_menu_item_blank"},
            {title:$.localize.getString("SORT_BY_ALBUM"), action:{type:"fn",
                callback:function () {
                    c("AlbumName", triggerElement, "SORT_BY_ALBUM")
                }}, customClass:"jj_menu_item_blank"},
            {title:$.localize.getString("SORT_BY_POPULARITY"), action:{type:"fn", callback:function () {
                c("Popularity", triggerElement, "SORT_BY_POPULARITY")
            }}, customClass:"jj_menu_item_blank"}
        ]
    }, getPlaylistSortMenu:function () {
        var c = this.setSort;
        return[
            {title:$.localize.getString("SORT_BY_RELEVANCE"), action:{type:"fn", callback:function () {
                c("Rank", triggerElement, "SORT_BY_RELEVANCE")
            }}, customClass:"jj_menu_item_blank"},
            {title:$.localize.getString("SORT_BY_NAME"), action:{type:"fn", callback:function () {
                c("PlaylistName", triggerElement, "SORT_BY_NAME")
            }}, customClass:"jj_menu_item_blank"}
        ]
    }, getEventSortMenu:function () {
        var c = this.setSort;
        return[
            {title:$.localize.getString("SORT_BY_SOONEST_DATE"), action:{type:"fn", callback:function () {
                c("StartTime", triggerElement, "SORT_BY_SOONEST_DATE")
            }}, customClass:"jj_menu_item_blank"},
            {title:$.localize.getString("SORT_BY_RELEVANCE"), action:{type:"fn", callback:function () {
                c("Rank", triggerElement,
                        "SORT_BY_RELEVANCE")
            }}, customClass:"jj_menu_item_blank"}
        ]
    }, getUserSortMenu:function () {
        var c = this.setSort;
        return[
            {title:$.localize.getString("SORT_BY_RELEVANCE"), action:{type:"fn", callback:function () {
                c("Rank", triggerElement, "SORT_BY_RELEVANCE")
            }}, customClass:"jj_menu_item_blank"},
            {title:$.localize.getString("SORT_BY_NAME"), action:{type:"fn", callback:function () {
                c("Name", triggerElement, "SORT_BY_NAME")
            }}, customClass:"jj_menu_item_blank"}
        ]
    }, getArtistAlbumSortMenu:function () {
        var c = this.setSort;
        return[
            {title:$.localize.getString("SORT_BY_RELEVANCE"),
                action:{type:"fn", callback:function () {
                    c("Rank", triggerElement, "SORT_BY_RELEVANCE")
                }}, customClass:"jj_menu_item_blank"}
        ]
    }, sortByPicture:function (c, a) {
        return!c.Picture && a.Picture ? 1 : c.Picture && !a.Picture ? -1 : GS.user.favorites.users && !GS.user.favorites.users[c.UserID] && GS.user.favorites.users[a.UserID] ? 1 : GS.user.favorites.users && GS.user.favorites.users[c.UserID] && !GS.user.favorites.users[a.UserID] ? -1 : 0
    }, filterUsers:function (c) {
        if (this.currentFilterStr != c) {
            this.currentFilterStr = c;
            this.type == "user" && this.originalUsers &&
            this.renderUsers(this.originalUsers.filter(this.callback("filterUsersFunction")), this.currentSort)
        }
    }, filterUsersFunction:function (c) {
        return(c.Username.toLowerCase() + " " + c.Name.toLowerCase()).indexOf(this.currentFilterStr.toLowerCase()) !== -1
    }});

