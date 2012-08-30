(function () {
    var c = 0, a = 0;
    GS.Controllers.BaseController.extend("GS.Controllers.AdController", {isGSSingleton:true}, {rotateTimer:0, rotationTime:45E3, defaultRotationTime:45E3, lastActive:null, maxIdleTime:24E4, lastIdleTime:null, lastRotation:null, rotationCountPerImpression:0, useTestAds:false, rotationCount:0, sessionStart:null, lastAdChange:null, chooseAdLimit:4E3, clickAdCatchTimeout:null, lastActivePage:null, campaignArtists:{}, campaignsByCampaignID:{}, userCampaigns:[], COUNTRIES_NO_CLICK:[106, 221, 166, 48, 45, 152,
        38, 7, 2, 14, 36, 22, 19, 24, 53, 54, 57, 62, 67, 72, 55, 85, 96, 105, 98, 131, 125, 129, 130, 148, 134, 161, 162, 174, 177, 182, 65, 42], COUNTRIES_ROTATION_2MINUTE:[38, 7, 2, 14, 36, 22, 19, 24, 53, 54, 57, 62, 67, 72, 55, 85, 96, 105, 98, 131, 125, 129, 130, 148, 134, 161, 162, 174, 177, 182, 65, 42], COUNTRIES_ROTATION_30SEC:[221], COUNTRIES_CUTOFF_5SECONDS:[38], COUNTRIES_CUTOFF_2MINUTE:[221], COUNTRIES_PAGE_BASED:[106, 166, 48, 45, 152], RANDOM_PERCENT:null, IS_IDLE:false, IDLE_COUNT:45E3, COUNTRIES_45SEC_IDLE_COUNT:[223, 221], locales:{en:"1", bg:"2", ca:"3", cs:"4", da:"5",
        de:"6", es:"7", eu:"8", fi:"9", fr:"10", it:"11", ja:"12", lt:"13", nb:"14", nl:"15", pl:"16", pt:"17", ro:"18", ru:"19", sk:"20", sl:"21", sv:"22", tr:"23", zh:"24"}, adPlacements:["home_160x600", "search_digest_300x250", "search_song_300x250", "search_artist_300x250", "search_album_300x250", "search_playlist_300x250", "search_user_300x250", "search_event_300x250", "search_digest_728x90", "search_song_728x90", "search_artist_728x90", "search_album_728x90", "search_playlist_728x90", "search_user_728x90", "search_event_728x90", "explore_featured_300x250",
        "explore_popular_300x250", "explore_stations_300x250", "explore_playlists_300x250", "explore_popular_728x90", "explore_videos_300x250", "explore_featured_728x90", "explore_stations_728x90", "explore_playlists_728x90", "explore_videos_728x90", "mymusic_songs_160x600", "mymusic_favorites_160x600", "mymusic_playlists_overview_160x600", "mymusic_playlists_subscribed_160x600", "community_activity_300x250", "community_activity_728x90", "community_mentions_300x250", "playlist_music_300x250", "playlist_albums_300x250", "playlist_subscribers_300x250",
        "playlist_music_728x90", "artist_profile_300x250", "artist_songs_300x250", "artist_albums_300x250", "artist_events_300x250", "artist_profile_728x90", "artist_similar_artists_300x250", "artist_fans_300x250", "album_overview_300x250", "song_overview_300x250", "song_overview_728x90", "myprofile_activity_300x250", "myprofile_following_300x250", "myprofile_fans_300x250", "myprofile_activity_728x90", "profile_activity_300x250", "profile_music_300x250", "profile_favorites_300x250", "profile_playlists_300x250", "profile_community_300x250",
        "profile_following_300x250", "profile_fans_300x250", "profile_activity_728x90", "vlb_header_728x90", "idle_300x250", "idle_160x600", "idle_728x90"], init:function () {
        this.RANDOM_PERCENT = Math.floor(Math.random() * 10) + 1;
        if (this.COUNTRIES_ROTATION_2MINUTE.indexOf(gsConfig.country.ID) >= 0)this.defaultRotationTime = 12E4;
        if (this.COUNTRIES_ROTATION_30SEC.indexOf(gsConfig.country.ID) >= 0)this.defaultRotationTime = 3E4;
        if (this.COUNTRIES_CUTOFF_5SECONDS.indexOf(gsConfig.country.ID) >= 0)this.maxIdleTime = 5E3;
        if (this.COUNTRIES_CUTOFF_2MINUTE.indexOf(gsConfig.country.ID) >=
                0)this.maxIdleTime = 12E4;
        this.sessionStart = (new Date).getTime();
        this.lastActive = new Date;
        this.subscribe("gs.auth.update", this.callback(this.update));
        this.subscribe("gs.player.nowplaying", this.callback(this.onSongPlay));
        this.subscribe("gs.app.resize", this.callback(this.adSpecific));
        this.subscribe("gs.drag.start", function () {
            $("div.capital iframe").hide().parent().hide()
        });
        this.subscribe("gs.drag.end", function () {
            $("div.capital iframe").show()
        });
        this.subscribe("gs.menu.show", function () {
            $("div.capital iframe").hide()
        });
        this.subscribe("gs.menu.hide", function () {
            setTimeout(function () {
                $("#lightbox:visible").length || $("div.capital iframe").show().parent().show()
            }, 10)
        });
        var b = this;
        $("body").bind("mousemove", function () {
            b.lastActive = new Date
        });
        this._super()
    }, appReady:function () {
        this.update()
    }, update:function () {
        this.user = GS.user;
        this.parseCampaignsForUser();
        GS.user.subscription.canHideAds() || this.startAdTimer();
        if (GS.user.subscription.canHideAds())$("#page").unbind("scroll", this.onScroll); else {
            $("#page").unbind("scroll",
                    this.onScroll);
            $("#page").bind("scroll", this.onScroll)
        }
        GS.user.IsPremium || setTimeout(this.onFlattrSuggestTest, 45E3);
        GS.resize()
    }, onSongPlay:function (b) {
        if (this.campaignArtists && this.campaignArtists[b.ArtistID]instanceof Array)for (var d = 0; d < this.campaignArtists[b.ArtistID].length; d++) {
            var f = this.campaignArtists[b.ArtistID][d];
            if (f) {
                var g = this.campaignsByCampaignID[f];
                if (!g) {
                    g = {id:f, count:1};
                    this.campaignsByCampaignID[f] = g;
                    this.userCampaigns.push(g)
                }
            }
        }
    }, parseCampaignsForUser:function () {
        this.userCampaigns =
                [];
        this.campaignsByCampaignID = {};
        var b = GS.store.get("artistsPlayed" + (this.user ? this.user.UserID : -1));
        if (this.campaignArtists && b)for (var d = 0; d < b.length; d++) {
            var f = b[d];
            if (f && this.campaignArtists[f]instanceof Array)for (var g = 0; g < this.campaignArtists[f].length; g++) {
                var k = this.campaignArtists[f][g];
                if (k) {
                    var m = this.campaignsByCampaignID[k];
                    if (m)m.count++; else {
                        m = {id:k, count:1};
                        this.campaignsByCampaignID[k] = m;
                        this.userCampaigns.push(m)
                    }
                }
            }
        }
    }, showAdBar:function () {
        $("#capitalSidebar").width(170).show();
        GS.resize()
    },
        startAdTimer:function () {
            if (!(this.COUNTRIES_PAGE_BASED.indexOf(gsConfig.country.ID) >= 0))if (GS.theme.themeIsReady) {
                clearInterval(this.rotateTimer);
                this.rotateTimer = setInterval(this.callback("onRotateTimer"), this.defaultRotationTime);
                this.chooseAd()
            }
        }, resetAdTimer:function () {
            if (!(this.COUNTRIES_PAGE_BASED.indexOf(gsConfig.country.ID) >= 0))if (GS.theme.themeIsReady) {
                clearInterval(this.rotateTimer);
                this.rotateTimer = setInterval(this.callback("onRotateTimer"), this.defaultRotationTime)
            }
        }, hideAdBar:function () {
            $("#capitalSidebar").hide().width(0);
            $("#sidebarCapital_160").children("iframe").attr("src", "");
            GS.resize();
            GS.player && GS.player.updateQueueWidth()
        }, onRotateTimer:function () {
            if (this.lastActive && !GS.user.subscription.canHideAds()) {
                var b = (new Date).valueOf(), d = b - (this.lastActive ? this.lastActive.valueOf() : 0);
                this.lastRotation && this.lastRotation.valueOf();
                if (d <= this.maxIdleTime) {
                    this.IS_IDLE = d >= this.IDLE_COUNT;
                    this.chooseAd()
                } else this.lastIdleTime = b
            }
        }, adAction:function (b) {
            if (b)if ($(b.target).hasClass("stopAdAction"))return;
            if (!(this.COUNTRIES_NO_CLICK.indexOf(gsConfig.country.ID) >=
                    0)) {
                b = (new Date).getTime();
                if (GS.theme.themeIsReady && !GS.user.subscription.canHideAds() && !this.clickAdCatchTimeout && (!this.lastAdChange || b - this.lastAdChange > this.chooseAdLimit)) {
                    this.IS_IDLE = false;
                    this.chooseAd()
                }
            }
        }, chooseAd:function (b) {
            $("div.capital iframe:visible").length !== 0 && setTimeout(this.callback(function () {
                this.lastRotation = new Date;
                this.updateAds(b);
                GS.getGuts().logEvent("adRotation", {})
            }), 100)
        }, buildParams:function (b, d, f) {
            b = b instanceof Array ? b : [];
            d = _.orEqual(d, "?");
            f = _.orEqual(f, "&");
            GS.player && GS.player.getCurrentSong() && b.push("2=" + GS.player.getCurrentSong().ArtistID);
            var g, k;
            if (GS.user.isLoggedIn) {
                if (GS.user.Sex) {
                    k = GS.user.Sex.toLowerCase() == "m" ? "0" : "1";
                    b.push("1=" + k)
                }
                if (GS.user.TSDOB) {
                    var m = GS.user.TSDOB.split("-");
                    if (m.length == 3) {
                        var h = new Date, n = h.getFullYear() - parseInt(m[0], 10);
                        if (parseInt(m[1], 10) > h.month)n -= 1; else if (parseInt(m[1], 10) == h.month && parseInt(m[2], 10) > h.date)n -= 1;
                        if (n >= 13 && n < 18)g = "1"; else if (n >= 18 && n < 25)g = "2"; else if (n >= 25 && n < 35)g = "3"; else if (n >= 35 && n < 50)g =
                                "4"; else if (n >= 50)g = "5";
                        n >= 21 && b.push("a=1");
                        g && b.push("10=" + g);
                        b.push("14=" + this.encodeInteger(n))
                    }
                }
                if (GS.user.Email) {
                    m = GS.user.Email.split(".");
                    m.length && m[m.length - 1] == "edu" && b.push("20=1")
                }
            }
            b.push("3=" + Math.round(((new Date).getTime() - this.sessionStart) / 1E3));
            b.push("4=" + this.rotationCount);
            b.push("5=" + ((GS.user.settings.local.themeFlags & GS.theme.THEME_FLAG_FAMILY_FRIENDLY) == GS.theme.THEME_FLAG_FAMILY_FRIENDLY ? 1 : 0));
            GS.theme.currentTheme && GS.theme.currentTheme.sections.indexOf("#theme_page_header") >=
                    0 && b.push("6=1");
            if (GS.Controllers.PageController.activePageName && GS.Controllers.PageController.activePageName.toLowerCase() == "homecontroller")b.push("9=1"); else GS.Controllers.PageController.activePageName && GS.Controllers.PageController.activePageName.toLowerCase() == "searchcontroller" && (!GS.search.type || GS.search.type === "" || GS.search.type == "everything") ? b.push("9=2") : b.push("9=0");
            if (GS.theme && GS.theme.currentTheme)(m = parseInt(GS.theme.currentTheme.themeID, 10)) && b.push("11=" + m);
            if (GS.player && GS.player.queue &&
                    GS.player.queue.currentAutoplayTagID) {
                b.push("12=1");
                b.push("13=" + GS.player.queue.currentAutoplayTagID)
            }
            b.push("15=" + this.rotationCountPerImpression);
            gsConfig && gsConfig.isPreview && b.push("16=1");
            if (GS.user.UserID > 0)if (GS.user.Flags & GS.Models.User.FLAG_ISARTIST)b.push("17=1"); else GS.user.Flags & GS.Models.User.FLAG_MUSIC_BUSINESS && b.push("17=2");
            b.push("18=" + (new Date).getDate());
            if (m = GS.theme.getRecentSeen())for (h = 0; h < m.length; h++)b.push("rec=" + m[h]);
            if (GS.user.UserID > 0)if (GS.user.subscription.isAnywhere())b.push("19=3");
            else GS.user.subscription.isPlus() ? b.push("19=2") : b.push("19=1"); else b.push("19=0");
            b.push("21=" + this.RANDOM_PERCENT);
            var q;
            try {
                q = "22=";
                var s = window.navigator.language.split("-")[0];
                q += this.locales[s]
            } catch (w) {
                q = "22=1"
            }
            b = b.concat([q]);
            this.useTestAds && b.push("testAds=1");
            if (q = GS.store ? GS.store.get("adhelper") : null) {
                if (!g) {
                    if (q.hasOwnProperty("ageRange"))switch (q.ageRange) {
                        case 29516:
                            g = "1";
                            break;
                        case 29517:
                            g = "2";
                            break;
                        case 30024:
                        case 30025:
                            g = "3";
                            break;
                        case 29520:
                        case 29521:
                            g = "4";
                            break;
                        case 29522:
                        case 29523:
                            g =
                                    "5";
                            break
                    }
                    g && b.push("10=" + g)
                }
                if (!k)if (q.hasOwnProperty("gender")) {
                    if (q.gender == 1536)k = "0"; else if (q.gender == 1537)k = "1";
                    k && b.push("1=" + k)
                }
            }
            if (!GS.user.subscription.canHideAds())if ((g = GS.store.get("webvisit")) && g.sidebar)b = b.concat(GS.store.get("webvisit").sidebar); else if ((g = GS.store.get("krux")) && g.params)b = b.concat(GS.store.get("krux").params);
            var o;
            try {
                o = "0=";
                o += this.locales[GS.getLocale().locale]
            } catch (u) {
                o = "0=1"
            }
            b = b.concat([o]);
            return d + b.join(f)
        }, encodeInteger:function (b) {
            b = b.toString(2).split("");
            for (var d = 1, f = b.length, g = 0; d < f;) {
                b.splice(d + g, 0, 0);
                d += 3;
                g++
            }
            return(parseInt(b.join(""), 2) * 751).toString(16)
        }, decodeInteger:function (b) {
            b = (parseInt(b, 16) / 751).toString(2).split("");
            for (var d = 1, f = 0; b[d + f] !== undefined;) {
                b[d + f] = null;
                d += 3;
                f++
            }
            return parseInt(b.join(""), 2)
        }, buildAd:function (b, d, f, g) {
            $("#capitalAboveFoldHelper_300").height(310);
            $("#capitalBelowFoldHelper_300").height(310);
            this.onScroll();
            if (b && b.length) {
                g || (g = []);
                var k = b.attr("data-iframe-type") && b.attr("data-iframe-type") == "afc";
                if (b.data("data-user-activity") ==
                        undefined) {
                    b.data("data-user-activity", null);
                    b.live("mouseover", function () {
                        $(this).data("data-user-activity", (new Date).getTime() + 9E4)
                    });
                    b.live("mouseout", function () {
                        $(this).data("data-user-activity", null)
                    })
                }
                $page = $("#page_content");
                for (var m = g.concat(), h = 0; h < g.length; h++) {
                    var n = g[h].split("=");
                    if (n.length > 1 && n[0] == "p")if (this.IS_IDLE && this.COUNTRIES_45SEC_IDLE_COUNT.indexOf(gsConfig.country.ID) >= 0)m[h] = "p=idle"; else if (n[1].indexOf("explore") == 0)g[h] = "p=search_song"; else {
                        g[h] = GS.getAd().adPlacements.indexOf(n[1] +
                                "_" + d + "x" + f) >= 0 ? g[h] : "p=default";
                        g[h] = GS.getAd().adPlacements.indexOf(n[1] + "_" + d + "x" + f) >= 0 ? g[h] : d == 300 || d == 728 ? "p=search_song" : "p=mymusic_favorites"
                    }
                }
                b.data("data-iframe-width", d).data("data-iframe-height", f).data("data-iframe-params", g.concat()).data("data-iframe-born", (new Date).getTime());
                if (this.IS_IDLE && this.COUNTRIES_45SEC_IDLE_COUNT.indexOf(gsConfig.country.ID) >= 0)m = GS.getAd().buildParams(m.concat(["w=" + d, "h=" + f])); else g = GS.getAd().buildParams(g.concat(["w=" + d, "h=" + f]));
                var q = b.children("iframe"),
                        s;
                if (q.length > 1) {
                    for (f = q.length - 1; f > 0; f--)q.eq(f).unbind("load").remove();
                    q = q.eq(0);
                    s = q.clone()
                } else s = $('<iframe height="' + f + '" width="' + d + '" class="' + (k ? "afcCapitalFrame_" : "capitalFrame_") + d + '" frameborder="0" allowTransparency="true"></iframe>');
                s.css("visibility", "hidden");
                s.bind("load", this.callback(function () {
                    q.unbind("load").remove();
                    s.css("visibility", "visible").width(0);
                    b.parent().show();
                    if (d == 728 || d == 160) {
                        b.parent().parent().show();
                        this.adSpecific();
                        $("#capitalSidebar .capitalView_160").scrollTop(0)
                    }
                    d ==
                            300 && this.onScroll();
                    setTimeout(function () {
                        s.width(d)
                    }, 100);
                    setTimeout(function () {
                        s.width(d - 1);
                        s.width(d + 1)
                    }, 1500)
                }));
                this.lastAdChange = (new Date).getTime();
                this.resetAdTimer();
                if (b.attr("data-iframe-type") && b.attr("data-iframe-type") == "afc")s.attr("src", "/afcAds.html" + g); else this.IS_IDLE && this.COUNTRIES_45SEC_IDLE_COUNT.indexOf(gsConfig.country.ID) >= 0 ? s.attr("src", "/dfpAds.html" + m) : s.attr("src", "/dfpAds.html" + g);
                b.append(s)
            }
        }, updateAds:function (b) {
            setTimeout(this.callback(function () {
                if (!this.lastActivePage ||
                        this.lastActivePage != GS.Controllers.PageController.activePageName + (GS.Controllers.PageController.activePage ? GS.Controllers.PageController.activePage.subpage : ""))this.lastActivePage = GS.Controllers.PageController.activePageName + (GS.Controllers.PageController.activePage ? GS.Controllers.PageController.activePage.subpage : ""); else {
                    this.lastActivePage = GS.Controllers.PageController.activePageName + (GS.Controllers.PageController.activePage ? GS.Controllers.PageController.activePage.subpage : "");
                    var d = (new Date).getTime(),
                            f = _.orEqual(b, ".capital");
                    if ($(f).length) {
                        $(f).each(this.callback(function (g, k) {
                            k = $(k);
                            if (d - k.data("data-iframe-born") > this.chooseAdLimit && (!k.data("data-user-activity") || k.data("data-user-activity") < d) && k.offset().top + k.data("data-iframe-height") >= 0 && k.offset().top <= $("#page").height() && k.is(":visible"))k.data("data-iframe-width") && k.data("data-iframe-height") && k.data("data-iframe-params") && this.buildAd(k, k.data("data-iframe-width"), k.data("data-iframe-height"), k.data("data-iframe-params"))
                        }));
                        this.updateRotationCount()
                    }
                }
            }),
                    500)
        }, updateRotationCount:function () {
            this.rotationCount++;
            this.rotationCountPerImpression++;
            if (GS.theme && !GS.theme.hasSeenRotationCount)GS.theme.hasSeenRotationCount = this.rotationCountPerImpression >= 3
        }, onScroll:function () {
            var b = $(".capitalWrapper_300"), d = $("#capitalBelowFoldHelper_300"), f = $("#capitalAboveFoldHelper_300");
            if (!(!b.length || !d.length || !f.length))if (f.length && f.offset().top + b.height() < 0)if (d.offset().top > 58) {
                b.hasClass("capitalFixedTop_300") && b.removeClass("capitalFixedTop_300");
                b.offset({top:d.offset().top})
            } else b.hasClass("capitalFixedTop_300") ||
            b.addClass("capitalFixedTop_300"); else if (f.length && f.offset().top + f.height() >= 0) {
                b.hasClass("capitalFixedTop_300") && b.removeClass("capitalFixedTop_300");
                b.offset({top:f.offset().top})
            }
        }, adSpecific:function () {
            if ($(".capital_728").length && $(".capital_728").is(":visible")) {
                var b = $(".capital_728"), d = $(".capitalWrapper_728"), f = $(".capitalSliderBtn"), g = $(".capitalView_728"), k = d.find(".horizAdRemoveLinks");
                g.scrollLeft(g.scrollLeft() / 0.5);
                if (d.width() < b.width() + 42) {
                    if (!f.is(":visible")) {
                        f.show();
                        b.css({left:0,
                            marginLeft:0});
                        g.css({left:"21px"});
                        k.addClass("sliderButtons")
                    }
                    g.css({width:d.width() - 42 + "px"})
                } else if (f.is(":visible")) {
                    f.hide();
                    b.css({left:"50%", marginLeft:"-364px"});
                    g.css({width:"100%", left:0});
                    k.removeClass("sliderButtons")
                }
            } else if ($("#capitalSidebar .capital_160").length && $("#capitalSidebar .capital_160").is(":visible")) {
                b = $("#capitalSidebar .capital_160");
                d = $("#capitalSidebar .capitalWrapper_160");
                f = $("#capitalSidebar .capitalSliderBtnRev");
                g = $("#capitalSidebar .capitalView_160");
                if (d.height() <
                        b.height() + 48) {
                    if (!f.is(":visible")) {
                        f.show();
                        g.css({top:"24px"})
                    }
                    g.css({height:d.height() - 78 - 7 + "px"})
                } else if (f.is(":visible")) {
                    f.hide();
                    g.css({height:"100%", top:0})
                }
            } else if ($("#page_wrapper .capital_160").length && $("#page_wrapper .capital_160").is(":visible")) {
                b = $("#page_wrapper .capital_160");
                d = $("#page_wrapper .capitalWrapper_160");
                f = $("#page_wrapper .capitalSliderBtnRev");
                g = $("#page_wrapper .capitalView_160");
                if (d.height() < b.height() + 78) {
                    if (!f.is(":visible")) {
                        f.show();
                        g.css({top:"21px"})
                    }
                    g.css({height:d.height() -
                            78 + "px"})
                } else if (f.is(":visible")) {
                    f.hide();
                    g.css({height:"100%", top:0})
                }
            }
        }, onFlattrSuggestTest:function () {
            GS.service.suggestFlattr(["http://ad.doubleclick.net/ad/pixel", gsConfig.httpHost + "/dfpAds.html?p=home&w=160&h=600", "http://ad.doubleclick.net/ad/pixel", gsConfig.httpHost + "/dfpAds.html?p=home&w=160&h=600"], 5, false, GS.getAd().onFlattrSuggestTestComplete, GS.getAd().onFlattrSuggestTestComplete)
        }, onFlattrSuggestTestComplete:function (b) {
            var d = (new Date).getDate(), f = GS.store.get("isDetected");
            if (b &&
                    f != d) {
                GS.store.set("isDetected", d);
                GS.getGuts().forceLogEvent("suggestFlattr", {})
            }
        }, determineAdInfo:function (b, d) {
            if (d) {
                if (d > 10)return""
            } else d = 0;
            var f, g = "";
            b = $(b);
            try {
                var k = b.find("iframe");
                for (f = 0; f < k.length && f < 3; f++)if (!k[f].src || k[f].src == "" || k[f].src == "about:blank" || k[f].src == 'javascript:window["contents"]' || k[f].src.indexOf("/") === 0 || k[f].src.indexOf("http://" + window.location.host + "/") === 0) {
                    var m = k[0].contentDocument ? k[0].contentDocument : k[0].contentWindow.document;
                    if (m.body)m = m.body;
                    return this.determineAdInfo(m,
                            d++)
                } else if (k[f].src.indexOf("quantserve") == -1 && k[f].height > 0 && k[f].width > 0) {
                    if (iframe.src.indexOf("doubleclick.net/aclk") > -1 || iframe.src.indexOf("googleadservices.com/pagead/aclk") > -1 || iframe.src.indexOf("track.pubmatic.com/") > -1)return k[f].src;
                    g = k[f].src
                }
            } catch (h) {
                if (k[f] && k[f].src.indexOf("quantserve") == -1 && k[f].src.indexOf("http://" + window.location.host + "/") != 0)g = k[f].src; else if (d < 1)return""
            }
            k = b.find("a");
            for (f = 0; f < k.length && f < 5; f++)if (k[f].href && (k[f].href.indexOf("adurl=h") > -1 || k[f].href.indexOf("/") ===
                    0 || k[f].href.indexOf("http://" + window.location.host + "/") === 0))return k[f].href;
            m = b.find("noscript");
            for (f = 0; f < m.length; f++)if (m[f].innerHTML && m[f].innerHTML.indexOf("href") > -1 && m[f].innerHTML.indexOf("adurl=h") > -1) {
                var n = unescape(m[f].innerHTML);
                if ((n = $(n).find("a")[0]) && n.href)return n.href
            }
            m = b.find("script");
            if (m.length) {
                n = "";
                for (f = 0; f < m.length && f < 6; f++)if (m[f].src && m[f].src != "" && m[f].src.indexOf("quantcast") == -1 && m[f].src.indexOf("googlesyndication") == -1 && m[f].src.indexOf("doubleclick.net/gampad") ==
                        -1 && m[f].src != "http://" + window.location.host + "/") {
                    if (m[f].src.indexOf("adurl") > -1 || m[f].src.indexOf("doubleclick.net/aclk") > -1 || m[f].src.indexOf("googleadservices.com/pagead/aclk") > -1 || m[f].src.indexOf("track.pubmatic.com/") > -1)return m[f].src;
                    n += m[f].src + ","
                }
                if (n != "" && g == "")return n = n.substr(0, n.length - 1)
            }
            if (k.length && g == "")return k[0].href;
            return g
        }, canReportAd:function () {
            if ((new Date).getTime() - a > 54E6)c = a = 0;
            if (c >= 3)return false;
            return true
        }, reportAd:function (b) {
            var d = (new Date).getTime();
            b = b.find(".capital");
            var f = this.determineAdInfo(b), g = b.attr("id");
            if (g && c < 3) {
                var k = false;
                $.publish("gs.ad.notification.report", function (m) {
                    if (h !== false && !k) {
                        m = _.orEqual(m, {});
                        var h = _.orEqual(m.desc, "");
                        m = _.orEqual(m.type, "");
                        GS.service.reportBadAd(g, h, f, m);
                        k = true
                    }
                });
                this.chooseAd(b);
                c++;
                a || (a = d);
                GS.getGuts().forceLogEvent("reportedAd", {placement:g, country:gsConfig.country.ID, time:Math.floor(d / 1E3)})
            }
            c >= 3 && $(".reportAdLink").hide()
        }, "#capitalSidebar .capitalSliderBtnRev click":function (b) {
            b = $(b);
            $(b).hasClass("capitalSliderDown") ?
                    $("#capitalSidebar .capitalView_160").animate({scrollTop:$("#capitalSidebar .capitalView_160").scrollTop() + 200}, 500) : $("#capitalSidebar .capitalView_160").animate({scrollTop:$("#capitalSidebar .capitalView_160").scrollTop() - 200}, 500)
        }, ".removeAdsLink click":function () {
            GS.getLightbox().open("vipPerks")
        }, ".reportAdLink click":function (b) {
            var d = $(b).data("parent");
            d && GS.getAd().reportAd($(b).parents("." + d))
        }})
})();

