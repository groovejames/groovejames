GS.Controllers.BaseController.extend("GS.Controllers.GUTSController", {isGSSingleton:true, segments:[
    {targetRange:[0, 0.5], dateRange:["2012-06-28", "2012-07-01"], name:"delayInterruptListen", groups:["a", "b", "c", "d"]}
], loggingStatusDuration:6048E5}, {shouldLog:false, server:"/guts", appID:"html", context:false, debug:false, abTest:null, bufferLength:10, localLogs:[], searchClickLpid:"searchClick", loggedNormally:false, eligibleForABTest:false, abTestBucket:null, currentTest:null, currentGroup:null, loggingStatusExpirationDate:null,
    init:function () {
        this.context = {};
        this.server = _.orEqual(gsConfig.gutsServer, false);
        this.setLoggingStatus();
        if (this.debug = false) {
            this.bufferLength = 1;
            this.shouldLog = true
        }
        this.currentPage = {};
        this.currentPage.pageType = "home";
        this.currentPage.section = "";
        this.currentPage.subpage = "";
        this.currentPage.id = "";
        if (gsConfig.isPreview) {
            this.appID = "preview";
            this.shouldLog = true
        }
        var c = _.browserDetect();
        this.beginContext({sessionID:GS.service.sessionID});
        this.beginContext({initTime:(new Date).getTime()});
        this.beginContext({country:gsConfig.country.ID});
        GS.user && GS.user.UserID && GS.user.UserID > 0 && this.beginContext({userID:GS.user.UserID});
        this.logEvent("init", {browser:c.browser, browserVersion:c.version, os:navigator.platform, ip:gsConfig.remoteAddr, locale:GS.getLocale().locale});
        this._super()
    }, setLoggingStatus:function () {
        var c, a, b, d, f = GS.Controllers.GUTSController.segments;
        d = GS.store.get("currentTest");
        var g = GS.store.get("currentGroup");
        if (d) {
            c = GS.store.get("abTestBucket");
            a = GS.store.get("eligibleForABTest");
            b = GS.store.get("loggedNormally");
            if (typeof c ==
                    "number" && c >= 0 && c <= 1 && a && b == false && d.name && typeof g == "number")for (c = 0; c < f.length; c++)if (f[c].name == d.name && d.dateRange) {
                f = new Date;
                c = new Date(d.dateRange[0]);
                var k = new Date(d.dateRange[1]);
                if (f >= c && f < k) {
                    this.eligibleForABTest = a;
                    this.loggedNormally = b;
                    this.currentTest = d;
                    this.currentGroup = g;
                    this.beginContext({abtest:this.currentTest.name, group:this.currentGroup});
                    this.shouldLog = true;
                    this.gaSetCustomVariable(2, "GUTSLoggingStatus", this.currentTest.name + "_" + this.currentGroup, 2);
                    return
                }
                break
            }
            this.clearLoggingStatus()
        }
        c =
                GS.store.get("abTestBucket");
        a = GS.store.get("eligibleForABTest");
        b = GS.store.get("loggedNormally");
        if (d = GS.store.get("loggingStatusExpirationDate"))d = new Date(d);
        g = Math.random();
        f = new Date;
        if (d && f > d) {
            this.clearLoggingStatus();
            b = GS.store.get("loggedNormally");
            a = GS.store.get("eligibleForABTest");
            c = GS.store.get("abTestBucket");
            GS.store.get("currentTest");
            GS.store.get("currentGroup")
        }
        if (c && a && b == false) {
            this.abTestBucket = c;
            this.setCurrentTest()
        } else {
            if (typeof b == "undefined" || b == null) {
                b = g <= 0.1;
                GS.store.set("loggedNormally",
                        b)
            }
            if (this.loggedNormally = b) {
                this.eligibleForABTest = false;
                this.shouldLog = true;
                GS.store.set("eligibleForABTest", false);
                this.gaSetCustomVariable(2, "GUTSLoggingStatus", "normal", 2)
            } else if (typeof a == "undefined" || a == null) {
                this.eligibleForABTest = g > 0.1 && g <= 0.2;
                GS.store.set("eligibleForABTest", this.eligibleForABTest)
            } else this.eligibleForABTest = a;
            this.abTestBucket = this.eligibleForABTest ? Math.random() : null;
            GS.store.set("abTestBucket", this.abTestBucket);
            this.loggingStatusExpirationDate = new Date(f.getTime() +
                    GS.Controllers.GUTSController.loggingStatusDuration);
            GS.store.set("loggingStatusExpirationDate", this.loggingStatusExpirationDate);
            this.abTestBucket && this.setCurrentTest()
        }
    }, forceABTest:function (c, a) {
        if (c && typeof a == "number") {
            this.currentTest = {};
            this.currentTest.name = c;
            this.currentGroup = a;
            this.debug = this.shouldLog = true;
            this.loggedNormally = false;
            this.eligibleForABTest = true
        }
    }, forceExistingABTest:function (c, a, b) {
        if (c && typeof a == "number")for (var d = GS.Controllers.GUTSController.segments, f = 0; f < d.length; f++) {
            var g =
                    d[f];
            if (g.name == c) {
                this.currentTest = g;
                this.currentGroup = a;
                this.debug = this.shouldLog = true;
                this.loggedNormally = false;
                this.eligibleForABTest = true;
                this.abTestBucket = (g.targetRange[0] + g.targetRange[1]) / 2;
                if (b) {
                    GS.store.set("loggedNormally", false);
                    GS.store.set("eligibleForABTest", true);
                    GS.store.set("abTestBucket", this.abTestBucket);
                    GS.store.set("currentTest", this.currentTest);
                    GS.store.set("currentGroup", this.currentGroup)
                }
            }
        }
    }, clearLoggingStatus:function () {
        GS.store.set("loggedNormally", null);
        GS.store.set("eligibleForABTest",
                null);
        GS.store.set("abTestBucket", null);
        GS.store.set("currentTest", null);
        GS.store.set("currentGroup", null);
        GS.store.set("loggingStatusExpirationDate", null);
        this.shouldLog = false;
        this.currentGroup = this.currentTest = this.abTestBucket = this.eligibleForABTest = this.loggedNormally = null;
        _gaq.push(["_deleteCustomVar", 2])
    }, setCurrentTest:function () {
        if (this.abTestBucket)for (var c = GS.Controllers.GUTSController.segments, a, b = new Date, d, f, g = 0; g < c.length; g++) {
            a = c[g];
            d = new Date(a.dateRange[0]);
            f = new Date(a.dateRange[1]);
            if (a.targetRange[0] <= this.abTestBucket && a.targetRange[1] >= this.abTestBucket && d <= b && f >= b) {
                this.currentTest = a;
                GS.store.set("currentTest", a);
                this.currentGroup = Math.min(Math.floor((this.abTestBucket - a.targetRange[0]) / ((a.targetRange[1] - a.targetRange[0]) / a.groups.length)), a.groups.length - 1);
                GS.store.set("currentGroup", this.currentGroup);
                this.beginContext({abtest:a.name, group:this.currentGroup});
                this.shouldLog = true;
                this.gaSetCustomVariable(2, "GUTSLoggingStatus", a.name + "_" + this.currentGroup, 2);
                return a
            }
        }
        return null
    },
    beginContext:function (c) {
        _.forEach(c, function (a, b) {
            if (c.hasOwnProperty(b))this.context[b] = c[b]
        }, this)
    }, endContext:function (c) {
        _.defined(this.context[c]) && delete this.context[c]
    }, doLogEvent:function (c, a) {
        var b = this.currentTest;
        if (b && b.dateRange && b.dateRange.length == 2)if (new Date > new Date(b.dateRange[1])) {
            this.clearLoggingStatus();
            this.setLoggingStatus();
            if (!this.shouldLog)return
        }
        var d = {time:(new Date).getTime(), lpID:c, state:{}, context:{}};
        currentContext = this.context;
        _.forEach(currentContext, function (f, g) {
            if (currentContext.hasOwnProperty(g))if ($.isArray(currentContext[g])) {
                this.context[g] = [];
                _.forEach(currentContext[g], function (k, m) {
                    this.push(m)
                }, this.context[g])
            } else this.context[g] = _.orEqual(currentContext[g], "").toString()
        }, d);
        _.forEach(a, function (f, g) {
            if (a.hasOwnProperty(g))d.state[g] = _.orEqual(f, "").toString()
        }, d);
        this.localLogs.push(d);
        if (this.debug)this.forceSend(); else this.checkSendCondition() && this.sendLogs()
    }, logEvent:function (c, a) {
        this.shouldLog && this.doLogEvent(c, a)
    }, forceLogEvent:function (c, a) {
        a.forceLogged = true;
        this.doLogEvent(c, a)
    }, checkSendCondition:function () {
        return this.localLogs.length >= this.bufferLength
    }, forceSend:function () {
        this.sendLogs(true)
    }, sendLogsTimeout:false, sendLogsWait:3E4, sendLogs:function (c) {
        clearTimeout(this.sendLogsTimeout);
        if (c)this._internalSend(false); else this.sendLogsTimeout = setTimeout(this.callback(this._internalSend), this.sendLogsWait)
    }, _internalSend:function (c) {
        c = _.orEqual(c, true);
        if (this.localLogs.length > 0) {
            var a = this.toTransmissionFormat(this.localLogs);
            this.debug && console.log(a);
            this.currentTest ? $.ajax({contentType:"text/xml", type:"POST", data:a, url:"/guts-ab.php", cache:false, async:c, success:function () {
            }, error:function () {
            }}) : $.ajax({contentType:"text/xml", type:"POST", data:a, url:this.server, cache:false, async:c, success:function () {
            }, error:function () {
            }});
            this.localLogs = []
        }
    }, toTransmissionFormat:function (c) {
        var a = {result:(new Date).getTime() + "\n", appID:this.appID};
        _.forEach(c, function (b, d) {
            var f = /\:/g, g = /\\/g, k = c[d];
            this.result += this.appID + "\t";
            this.result +=
                    k.lpID + "\t";
            var m = k.context;
            _.forEach(m, function (n, q) {
                if (m.hasOwnProperty(q))this.result += q + ":" + m[q].replace(g, "\\\\").replace(f, "\\:") + "\t"
            }, this);
            var h = k.state;
            _.forEach(h, function (n, q) {
                if (h.hasOwnProperty(q))this.result += q + ":" + h[q].replace(g, "\\\\").replace(f, "\\:") + "\t"
            }, this);
            this.result += k.time + "\n"
        }, a);
        return a.result
    }, handlePageLoad:function (c, a) {
        var b = {};
        b.destinationPageType = c;
        switch (c) {
            case "home":
                if (a && a.redeemingPromoCard)b.reason = "redeem";
                break;
            case "user":
                switch (a.length) {
                    case 2:
                        b.destinationPageID =
                                a.id;
                        break;
                    case 3:
                        b.destinationPageID = a.id;
                        b.destinationSubpageType = a.section;
                        break;
                    case 4:
                        b.destinationPageID = a.id;
                        b.destinationSubpageType = a.subpage;
                        break
                }
                b.destinationSubpageType = _.orEqual(b.destinationSubpageType, "profile");
                break;
            case "playlist":
            case "album":
            case "artist":
                b.destinationPageID = a.id;
                b.destinationSubpageType = c == "album" && !a.subpage ? "tracklist" : c == "artist" && !a.subpage ? "overview" : a.subpage;
                break;
            case "search":
                b.destinationSubpageType = a.type == "everything" ? "everything" : a.type;
                break;
            case "popular":
                b.destinationSubpageType =
                        a.pageType;
                break;
            case "song":
                b.destinationPageID = a.token;
                b.destinationSubpageType = a.subpage;
                break;
            case "notFound":
                this.logEvent("pageNotFound", {pageSought:a.page});
                b.destinationPageType = "home";
                b.reason = "pageNotFound";
                break;
            case "settings":
                b.destinationSubpageType = _.orEqual(a.subpage, "profile");
                break;
            case "surveys":
                if (a.subpage)b.destinationSubpageType = a.subpage;
                break;
            case "signup":
                if (a.subpage)b.destinationSubpageType = a.subpage;
                break;
            case "explore":
                if (a.subpage && a.subpage == "popular") {
                    b.destinationPageType =
                            "popular";
                    b.destinationSubpageType = a.type || "daily"
                } else b.destinationSubpageType = a.subpage || "featured";
                break;
            case "music":
                if (a.subpage)b.destinationSubpageType = a.subpage;
            default:
                b.destinationPageType = c;
                break
        }
        if (this.pageParamsAreDifferent(b)) {
            this.logEvent("loadPage", b);
            this.beginContext({currentPageType:b.destinationPageType});
            b.destinationSubpageType ? this.beginContext({currentSubpage:b.destinationSubpageType}) : this.endContext("currentSubpage");
            b.destinationPageID ? this.beginContext({currentPageID:b.destinationPageID}) :
                    this.endContext("currentPageID")
        }
    }, updateCurrentPage:function (c) {
        this.currentPage.pageType = c.type;
        this.currentPage.id = c.id;
        this.currentPage.section = c.section;
        this.currentPage.subpage = c.subpage
    }, logPageLoad:function (c) {
        c.id ? this.logEvent("loadPage", {type:c.type, id:c.id}) : this.logEvent("loadPage", {type:c.type});
        this.beginContext({currentPageType:c.type});
        this.endContext("currentSubpage")
    }, logSubpageLoad:function (c) {
        this.logEvent("loadSubpage", {type:c.type});
        this.beginContext({currentSubpage:c.type})
    },
    handleFieldClick:function (c, a, b, d) {
        a = {songID:b, rank:a};
        if (d != null && d.length > 0)a.ppVersion = d;
        d = "";
        d = c.indexOf("artist") > -1 ? "OLartistPageLoad" : c.indexOf("album") > -1 ? "OLalbumPageLoad" : "OLSongPageLoad";
        GS.getGuts().logEvent(d, a)
    }, handleFeedEventClick:function (c) {
        var a = {};
        switch ($(c)[0].tagName) {
            case "A":
                feedEvent = $(c).parents(".event");
                if ($(c).attr("href")) {
                    var b = $(c).attr("href").split("/");
                    a.clickedType = b[1];
                    a.clickedID = b[3]
                } else a.clickedType = $(c).attr("class");
                break;
            case "LI":
                feedEvent = $(c).parents(".event");
                c = $(c).attr("class").split(" ");
                c = c[c.length - 1];
                if (c == "option")a.clickedType = "playSongs"; else if (c == "show")a.clickedType = "showSongs";
                break;
            default:
                break
        }
        a.rank = $(feedEvent).index() + 1;
        var d = $(feedEvent).attr("class");
        b = d.split(" ");
        a.whoseFeed = b[2].split("user")[1];
        _.forEach(b, function (m, h) {
            if (b[h].indexOf("type") > -1)a.eventType = b[h].substring(4, b[h].length)
        }, a);
        var f = {};
        $('.what>a[class!="showSongs"]', feedEvent).each(function () {
            var m = $(this).attr("href");
            if (m !== undefined) {
                m = m.split("/");
                var h = m[1];
                if (f[h])f[h] += 1; else f[h] = 1;
                a[h + f[h]] = m[3]
            }
        });
        var g = {};
        $("#feed>li").each(function () {
            d = $(this).attr("class");
            b = d.split(" ");
            var m = b[1].substring(4, b[1].length);
            if (g[m])g[m] += 1; else g[m] = 1
        });
        var k = "";
        _.forEach(g, function (m, h) {
            k = k + h + ";" + m + ","
        }, k);
        k = k.slice(0, k.length - 1);
        a.counts = k;
        this.logEvent("feedEventClick", a)
    }, objectListPlayAdd:function (c, a, b) {
        var d, f;
        switch (b) {
            case "play":
                d = "OLPlayClick";
                break;
            case "add":
                d = "OLAddClick";
                break;
            default:
                break
        }
        var g;
        a = $("#grid .slick-row.selected", a);
        if (a.length > 0) {
            f =
                    "";
            $(a).each(function () {
                g = parseInt($(this).attr("row"), 10);
                isNaN(g) || (f = f + (g + 1) + ",")
            });
            f = f.slice(0, f.length - 1)
        } else f = "all";
        this.logEvent(d, {songIDs:c, ranks:f})
    }, songItemLibraryClick:function (c) {
        this.logEvent("OLlibraryClick", c)
    }, songItemFavoriteClick:function (c) {
        this.logEvent("OLfavoriteClick", c)
    }, songsRemovedFromQueue:function (c) {
        var a = c.details.items;
        if (c) {
            var b = "";
            _.forEach(a, function (d, f) {
                b = b + f[d].songID + ","
            }, b);
            b = b.slice(0, b.length - 1);
            GS.getGuts().logEvent("songsRemovedFromQueue", {songIDs:b})
        }
    },
    handleSearchSidebarClick:function (c, a, b) {
        if (a = c.attr("href")) {
            a = a.split("/");
            var d = a[1], f = a[3], g = c.parents("li").attr("row");
            if ($(c).hasClass("image"))if (b == "user") {
                d = "user";
                this.logEvent("searchSidebarClick", {section:b, linkType:d, username:a[1], imageClick:"true", userID:f, rank:g})
            } else if (b == "playlist")this.logEvent("searchSidebarClick", {section:b, linkType:d, id:f, playlistID:f, rank:g, imageClick:"true"}); else if (b == "album")this.logEvent("searchSidebarClick", {section:b, linkType:d, id:f, albumID:f, rank:g,
                imageClick:"true"}); else b == "artist" ? this.logEvent("searchSidebarClick", {section:b, linkType:d, id:f, artistID:f, rank:g, imageClick:"true"}) : this.logEvent("searchSidebarClick", {section:b, linkType:d, id:f, rank:g, imageClick:"true"}); else if (b == "user")this.logEvent("searchSidebarClick", {section:b, linkType:d, id:f, userID:f, rank:g}); else if (b == "playlist")this.logEvent("searchSidebarClick", {section:b, linkType:d, id:f, playlistID:f, rank:g}); else if (b == "album")this.logEvent("searchSidebarClick", {section:b, linkType:d,
                id:f, albumID:f, rank:g}); else b == "artist" ? this.logEvent("searchSidebarClick", {section:b, linkType:d, id:f, artistID:f, rank:g}) : this.logEvent("searchSidebarClick", {section:b, linkType:d, id:f, rank:g})
        } else if (c.hasClass("searchLink")) {
            d = "seeAll";
            this.logEvent("searchSidebarClick", {section:b, linkType:d})
        }
    }, handleSearchSidebarEventClick:function (c) {
        if (c.hasClass("searchLink"))this.logEvent("searchSidebarClick", {section:"event", linkType:"seeAll"}); else(c = c.attr("href")) && this.logEvent("searchSidebarClick",
                {section:"event", linkType:"event", href:c})
    }, handleAutoplayOff:function () {
        this.forceLogEvent("autoplayOff", {});
        this.endContext("autoplay");
        this.endContext("autoplaySeedSongs")
    }, isSearchPage:function () {
        var c = $("#page").controller();
        if (c)return"GS.Controllers.Page.SearchController" == c.Class.fullName;
        return false
    }, onContextMenuClick:function (c, a, b, d, f) {
        if (c && a && typeof b !== "undefined" && d && this.isSearchPage())if (b) {
            if (d && d.songIDs && d.ranks) {
                var g = d.songIDs, k = d.ranks, m = d.ppVersions;
                b = {};
                var h = g.length;
                if ((b =
                        k.length == h) && m)b = m.length == h;
                if (b) {
                    b = {menuType:a, multiClick:"brokenDown"};
                    for (var n = 0; n < h; n++) {
                        var q = k[n], s = g[n];
                        if (m)b.ppVersions = d.ppVersions[n];
                        if (f)b.playlistID = f;
                        this.logSearchSingleSongClick(c, q, s, b)
                    }
                    g = d.songIDs.join();
                    k = d.ranks.join();
                    b = {menuType:a, multiClick:"multi"};
                    if (d.ppVersions)b.ppVersions = d.ppVersions.join();
                    if (f)b.playlistID = f;
                    this.logSearchMultiSongClick(c, k, g, b)
                }
            }
        } else if (d && d.songID && d.rank) {
            s = d.songID;
            q = d.rank;
            b = {menuType:a, multiClick:"single"};
            if (d.ppVersion)b.ppVersion = d.ppVersion;
            if (f)b.playlistID = f;
            this.logSearchSingleSongClick(c, q, s, b)
        }
    }, logSearchSingleSongClick:function (c, a, b, d) {
        if (c && a && b) {
            var f = {};
            if (d)f = d;
            f.clickType = c;
            f.rank = a;
            f.songID = b;
            GS.getGuts().logEvent(this.searchClickLpid, f)
        }
    }, logSearchMultiSongClick:function (c, a, b, d) {
        if (c && a && b) {
            var f = {};
            if (d)f = d;
            f.clickType = c;
            f.ranks = a;
            f.songIDs = b;
            GS.getGuts().logEvent(this.searchClickLpid, f)
        }
    }, extractSongItemInfo:function (c) {
        if (c) {
            var a = c.grid.getSelectedRows(), b = "", d = "";
            b = "";
            d = {};
            if (a.length == 1) {
                b = a[0];
                d = c.selectedRowIDs[0];
                d = {rank:b + 1, songID:d};
                if (c.data[b])if (b = c.data[b].ppVersion)d.ppVersion = b;
                return d
            }
        } else return null
    }, logMultiSongDrag:function (c, a) {
        if (a.songIDs && a.songIDs.length > 0 && a.ranks && a.ranks.length > 0) {
            var b, d = a.songIDs.length;
            for (b = 0; b < d; b++)a.ppVersions && a.ppVersions[b] ? this.logSearchSingleSongClick("drag", a.ranks[b], a.songIDs[b], {ppVersion:a.ppVersions[b]}) : this.logSearchSingleSongClick("drag", a.ranks[b], a.songIDs[b])
        }
        GS.getGuts().logEvent(c, a)
    }, extractMultiSongInfo:function (c, a) {
        if (c && a) {
            var b = c.grid.getSelectedRows().sort(_.numSortA),
                    d = [], f = [];
            _.forEach(b, function (g) {
                d.push(g + 1);
                (g = c.dataView.rows[g].ppVersion) && f.push(g)
            });
            b = {songIDs:a, ranks:d};
            if (f.length > 0)b.ppVersions = f;
            return b
        } else return null
    }, handleExtrasDeviceButtonClick:function (c) {
        this.logEvent("extrasDeviceButtonClick", {device:$(c).attr("rel").split("_")[2]})
    }, logQueueSaveInitiated:function () {
        this.logEvent("queueSaveInitiated", {})
    }, pageParamsAreDifferent:function (c) {
        if (!this.context.currentPageType || !this.context.currentSubpage || !this.context.currentPageID)return true;
        if (c && c.destinationPageType && c.destinationSubpageType && c.destinationPageID) {
            if (this.context.currentPageType != c.destinationPageType)return true;
            if (this.context.currentSubpage != c.destinationSubpageType)return true;
            if (this.context.currentPageID != c.destinationPageID)return true;
            return false
        } else return true
    }, artistPageSidebarClick:function (c, a, b) {
        a = {};
        a.section = b;
        if (c.hasClass("view_more"))a.linkType = "seeAll"; else {
            a.linkType = "notSeeAll";
            if (c = c.attr("href")) {
                var d = c.split("/");
                switch (b) {
                    case "similarArtists":
                        a.linkType =
                                "artist";
                        a.id = d[3];
                        break;
                    case "fans":
                        a.linkType = "user";
                        a.id = d[3];
                        break;
                    case "events":
                        a.linkType = "event";
                        a.href = c;
                        break;
                    default:
                        break
                }
            }
        }
        this.logEvent("artistPageSidebarClick", a)
    }, gaSetCustomVariable:function (c, a, b, d) {
        if (_.notDefined(c) || _.notDefined(a) || _.notDefined(b)) {
            console.warn("guts.gaSetCustomVariable: nonexistant slot, key, or value");
            return false
        }
        c = Number(c);
        if (isNaN(c) || c < 1) {
            console.warn("guts.gaSetCustomVariable: invalid slot");
            return false
        }
        d = _.orEqual(d, 3);
        window._gaq && window._gaq.push &&
        window._gaq.push(["_setCustomVar", c, a, b, d])
    }, gaTrackEvent:function (c, a, b, d) {
        if (_.notDefined(c) || _.notDefined(a))console.warn("guts.gaTrackEvent: bad category or action", c, a); else {
            b = "" + _.orEqual(b, "");
            d = parseFloat("" + _.orEqual(d, ""), 10);
            if (isNaN(d) || d == "")d = null;
            if (window._gaq && window._gaq.push)if (b && d)window._gaq.push(["_trackEvent", c, a, b, d]); else if (b)window._gaq.push(["_trackEvent", c, a, b]); else d ? window._gaq.push(["_trackEvent", c, a, null, d]) : window._gaq.push(["_trackEvent", c, a])
        }
    }});

