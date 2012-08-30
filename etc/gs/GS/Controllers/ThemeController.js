jQuery.Controller.extend("GS.Controllers.ThemeController", {_instance:null, themes:themes, sortOrder:themesSortOrder, plusThemes:plusThemes, artistThemes:artistThemes, instance:function () {
    return this._instance ? this._instance : new this($(document))
}, init:function () {
    this._super()
}}, {currentTheme:null, themes:null, sort:null, themesLocation:"themes", themePreferences:{}, hasSeenSponsoredTheme:true, hasSeenRotationCount:true, promptOnLogin:false, themeVisualizerForcedOnce:false, themeIsReady:false, manualSelectThemeID:null,
    lastActivePage:null, lastThemeNotification:null, lastDFPChange:null, lastUserChange:null, PAGE_HOME:"homecontroller", DEFAULT_USER_THEMEID:593, DEFAULT_PREMIUM_THEMEID:593, THEME_URL_PATTERN:/^#!\/(theme)\/(.*)\/?/, THEME_USER_LIMIT:6E5, THEME_RATE_LIMIT:6E4, THEME_NOTIF_RATE_LIMIT:864E5, THEME_FLAG_DEFAULT:0, THEME_FLAG_FAMILY_FRIENDLY:1, init:function () {
        this.themes = themes;
        this.sort = themesSortOrder;
        this.themePreferences = GS.store.get("themePreferences") || {};
        $.subscribe("gs.app.ready", this.callback(this.appReady));
        $.subscribe("gs.app.resize", this.callback(this.positionTheme));
        $.subscribe("gs.auth.update", this.callback(this.onAuthUpdate));
        $.subscribe("gs.page.home.update", this.callback(this.positionTheme));
        $.subscribe("gs.player.nowplaying", this.callback(this.onSongPlay));
        $.subscribe("gs.player.streamserver", this.callback(this.onStreamServer));
        $.subscribe("gs.page.view", this.callback(this.pageView));
        $.subscribe("gs.theme.click", this.callback(this.onThemeClick));
        $.subscribe("gs.theme.playVideo", this.callback(this.playVideo))
    },
    appReady:function () {
        if (!(location.hash && location.hash.match(GS.theme.THEME_URL_PATTERN))) {
            if (GS.user.UserID > 0 || _.defined(GS.store.get("isFirstVisit")) || _.defined(gsConfig.isNoob) && !gsConfig.isNoob) {
                this.isFirstVisit = false;
                this.resetTheme();
                this.handlePreviewLightboxTrigger()
            } else GS.service.isFirstVisit(this.callback("onIsFirstVisit"));
            setTimeout(this.callback(function () {
                this.currentTheme || this.lastOrDefault()
            }), 1E4)
        }
    }, onAuthUpdate:function (c) {
        if (!(c && c.hasOwnProperty("doNotReset") || location.hash.indexOf("#!/signup") ==
                0)) {
            this.lastDFPChange = this.lastUserChange = this.lastThemeNotification = null;
            this.hasSeenRotationCount = this.hasSeenSponsoredTheme = true;
            if (this.promptOnLogin && GS.user.UserID > 0) {
                this.promptOnLogin = false;
                this.lastDFPChange = (new Date).getTime();
                GS.getLightbox().open("promotion", {theme:this.currentTheme})
            } else!this.promptOnLogin && GS.getLightbox().curType !== "promotion" && this.resetTheme();
            if (GS.user.subscription.canHideAds()) {
                $("#sidebarCapital_160").removeClass("capital");
                GS.getAd().hideAdBar()
            }
            this.currentTheme &&
                    this.currentTheme.onAuthChange && this.currentTheme.onAuthChange()
        }
    }, resetTheme:function (c) {
        if (!(c && c.hasOwnProperty("doNotReset") || this.isFirstVisit)) {
            c = new Date;
            !gsConfig.isPreview && !GS.user.subscription.canHideAds() && this.hasSeenSponsoredTheme && this.hasSeenRotationCount && (!this.lastUserChange || c.getTime() - this.lastUserChange > this.THEME_USER_LIMIT) ? this.loadFromDFP() : this.lastOrDefault()
        }
    }, onIsFirstVisit:function (c) {
        this.isFirstVisit = c;
        GS.store.set("isFirstVisit", false);
        if (this.isFirstVisit) {
            this.setCurrentTheme(this.DEFAULT_USER_THEMEID);
            this.trackFirstVisit()
        } else this.resetTheme();
        this.handlePreviewLightboxTrigger()
    }, lastOrDefault:function () {
        var c = this.getLastTheme();
        if (this.themes) {
            if (c && themes[c] && (GS.user.subscription.canHideAds() && c || themes[c] && !themes[c].premium)) {
                themes[c].pageTracking = [];
                this.setCurrentTheme(c)
            } else GS.user.subscription.canHideAds() ? this.setCurrentTheme(this.DEFAULT_PREMIUM_THEMEID) : this.setCurrentTheme(this.DEFAULT_USER_THEMEID);
            this.themeNotification(GS.player.getCurrentSong())
        }
    }, setCurrentTheme:function (c, a) {
        if (!this.themes[c] || this.currentTheme && this.currentTheme.themeID == c || !GS.user.subscription.canHideAds() && this.themes[c].premium)return false;
        var b = !this.currentTheme;
        this.lastTheme = this.currentTheme;
        if (GS.getNotice() && this.lastTheme) {
            $.each(GS.getNotice().queuedNotifications.filter(function (f) {
                return f.iID == GS.theme.lastTheme.themeID
            }), function (f, g) {
                GS.getNotice().discardQueuedNotification(g)
            });
            $.each(GS.getNotice().openNotifications.filter(function (f) {
                return f.iID == GS.theme.lastTheme.themeID
            }),
                    function (f, g) {
                        g.close()
                    })
        }
        this.lastTheme && this.lastTheme.removeReady && this.lastTheme.removeReady();
        this.promptOnLogin = false;
        this.currentTheme = GS.Models.Theme.wrap(this.themes[c]);
        this.renderTheme();
        var d = new Date;
        if (GS.getAd)GS.getAd().rotationCountPerImpression = 0;
        if (a) {
            this.hasSeenRotationCount = this.hasSeenSponsoredTheme = true;
            this.setLastTheme(c);
            if (this.lastTheme)this.setLastSeen(this.lastTheme.themeID); else this.lastUserChange = d.getTime()
        } else {
            this.lastDFPChange = d.getTime();
            this.hasSeenRotationCount =
                    this.hasSeenSponsoredTheme = false
        }
        if (b) {
            this.onReady();
            GS.getGuts().gaTrackEvent("themes", "firstTheme", c);
            this.firstTheme = "" + c
        } else this.adSync();
        GS.getGuts().gaTrackEvent("themes", "change", c);
        this.themeImpression();
        this.themePageImpression();
        this.setRecentSeen(this.currentTheme.themeID);
        this.currentTheme.ready && setTimeout(this.callback(function () {
            this.currentTheme.ready();
            GS.getFacebook();
            GS.getNotice()
        }, 0));
        $.publish("gs.theme.set");
        this.buildSidebarAd()
    }, setLastTheme:function (c) {
        if (this.themePreferences[GS.user.UserID])this.themePreferences[GS.user.UserID].lastTheme =
                c; else this.themePreferences[GS.user.UserID] = {lastTheme:c, lastSeen:{}}
    }, setLastSeen:function (c) {
        var a = new Date;
        this.lastUserChange = a.getTime();
        if (this.themePreferences[GS.user.UserID])this.themePreferences[GS.user.UserID].lastSeen[c] = a.getTime()
    }, setRecentSeen:function (c) {
        var a = (new Date).getTime();
        this.themePreferences[GS.user.UserID] || (this.themePreferences[GS.user.UserID] = {lastTheme:c, lastSeen:{}, recentSeenThemes:[]});
        if (!this.themePreferences[GS.user.UserID].recentSeenThemes)this.themePreferences[GS.user.UserID].recentSeenThemes =
                [];
        for (var b = 0; b < this.themePreferences[GS.user.UserID].recentSeenThemes.length; b++) {
            var d = this.themePreferences[GS.user.UserID].recentSeenThemes[b];
            if (GS.theme.themes[d] && GS.theme.themes[d].seenExpiration) {
                d = GS.theme.themes[d].seenExpiration;
                a > d && this.themePreferences[GS.user.UserID].recentSeenThemes.splice(b, 1)
            } else this.themePreferences[GS.user.UserID].recentSeenThemes.splice(b, 1)
        }
        if (GS.theme.themes[c] && GS.theme.themes[c].seenExpiration) {
            d = GS.theme.themes[c].seenExpiration;
            a < d && GS.theme.themePreferences[GS.user.UserID].recentSeenThemes.indexOf(c) <
                    0 && this.themePreferences[GS.user.UserID].recentSeenThemes.push(c)
        }
    }, getRecentSeen:function () {
        return this.themePreferences[GS.user.UserID] ? this.themePreferences[GS.user.UserID].recentSeenThemes : null
    }, setLastDFPAction:function () {
        this.lastDFPChange = (new Date).getTime()
    }, getLastTheme:function () {
        return this.themePreferences[GS.user.UserID] && this.themePreferences[GS.user.UserID].lastTheme ? this.themePreferences[GS.user.UserID].lastTheme : null
    }, getLastSeen:function (c) {
        return this.themePreferences[GS.user.UserID] &&
                this.themePreferences[GS.user.UserID].lastSeen[c] ? this.themePreferences[GS.user.UserID].lastSeen[c] : null
    }, canCallAdServer:function () {
        return!this.isFirstVisit && !gsConfig.isPreview && !GS.user.subscription.canHideAds() && this.hasSeenSponsoredTheme && this.hasSeenRotationCount && (!this.lastUserChange || (new Date).getTime() - this.lastUserChange > this.THEME_USER_LIMIT)
    }, adSync:function () {
        if (!GS.user.subscription.canHideAds() && (this.currentTheme.misc && this.currentTheme.misc.adSync || this.currentTheme.adSync))GS.getAd().startAdTimer()
    },
    adUnSync:function () {
        if (!GS.user.subscription.canHideAds() && (this.currentTheme.misc && this.currentTheme.misc.adUnSync || this.currentTheme.adUnSync))GS.getAd().startAdTimer()
    }, hasAdSyncUnSync:function () {
        return this.currentTheme.misc && this.currentTheme.misc.adSync && this.currentTheme.misc.adUnSync || this.currentTheme.adSync && this.currentTheme.adUnSync
    }, loadFromDFPManual:function (c) {
        this.manualSelectThemeID = c;
        c = ";" + ["id=" + this.manualSelectThemeID, "m=1;dcmt=text/json;sz=777x777"].join(";");
        GS.service.getThemeFromDFP(c,
                this.callback("onGetThemeManual"), this.callback("onGetThemeErr"))
    }, onGetThemeManual:function (c) {
        this.onGetTheme(c, true)
    }, loadFromDFP:function () {
        var c = new Date;
        if (!gsConfig.isPreview && !GS.user.subscription.canHideAds() && (!this.lastDFPChange || c.getTime() - this.lastDFPChange > this.THEME_RATE_LIMIT))GS.service.getThemeFromDFP(this.buildParams(), this.callback("onGetTheme"), this.callback("onGetThemeErr"))
    }, onGetTheme:function (c, a) {
        var b = new Date;
        if (!a && b.getTime() - this.lastUserChange < this.THEME_USER_LIMIT)console.warn("[Stopped DFP Override]");
        else {
            try {
                c = JSON.parse(c)
            } catch (d) {
                console.log("invalid json from DFP", d);
                this.lastOrDefault();
                return
            }
            if (c) {
                if (a) {
                    if (this.manualSelectThemeID && this.manualSelectThemeID.toString() != c.themeID.toString()) {
                        this.themes[this.manualSelectThemeID].pageTracking = [];
                        this.setCurrentTheme(this.manualSelectThemeID, true);
                        return
                    }
                } else {
                    if (c.themeID < 0) {
                        this.trackDefault(c.themeID);
                        this.lastOrDefault();
                        return
                    }
                    if (this.getLastSeen(c.themeID)) {
                        this.lastOrDefault();
                        return
                    }
                }
                if (this.themes[c.themeID])$.extend(this.themes[c.themeID],
                        c); else this.themes[c.themeID] = c;
                this.themes[c.themeID].themeID = _.isString(c.themeID) ? parseInt(c.themeID) : c.themeID;
                this.themes[c.themeID].premium = _.isString(c.premium) ? c.premium === "true" : c.premium;
                this.themes[c.themeID].sponsored = _.isString(c.sponsored) ? c.sponsored === "true" : c.sponsored;
                this.themes[c.themeID].adSync = _.isString(c.adSync) ? c.adSync === "true" : c.adSync;
                this.themes[c.themeID].adUnSync = _.isString(c.adUnSync) ? c.adUnSync === "true" : c.adUnSync;
                b = parseFloat(c.pageHeaderFrequency);
                if (!isNaN(b))if (b ==
                        0 || Math.random() > b)this.themes[c.themeID].pageTracking = null;
                b = parseFloat(c.artistNotifFrequency);
                if (!isNaN(b))if (b == 0 || Math.random() > b)this.themes[c.themeID].artistNotifTracking = null;
                this.setCurrentTheme(c.themeID, a)
            } else this.lastOrDefault()
        }
    }, onGetThemeErr:function () {
        if (this.manualSelectThemeID && (!this.currentTheme || this.manualSelectThemeID != this.currentTheme.themeID) && this.themes[this.manualSelectThemeID]) {
            themes[this.manualSelectThemeID].pageTracking = [];
            this.setCurrentTheme(this.manualSelectThemeID,
                    true);
            this.manualSelectThemeID = null
        } else this.lastOrDefault()
    }, onReady:function () {
        if (!this.themeIsReady) {
            this.themeIsReady = true;
            GS.user.subscription.canHideAds() || GS.getAd().startAdTimer()
        }
    }, onSongPlay:function (c) {
        if (c && c.SongID)if (!this.currentSong || this.currentSong.SongID != c.SongID) {
            this.currentSong = c;
            this.canCallAdServer() ? this.loadFromDFP() : this.themeNotification(c)
        }
    }, onStreamServer:function (c) {
        if (document.visualizerTheme && document.visualizerTheme.loadCrossdomain) {
            document.visualizerTheme.loadCrossdomain(c.streamServer);
            if (!this.themeVisualizerForcedOnce)if (document.visualizerTheme && document.visualizerTheme.visualizerForceStart) {
                document.visualizerTheme.visualizerForceStart();
                this.themeVisualizerForcedOnce = true
            }
        }
    }, savePreferences:function () {
        GS.store.set("themePreferences", this.themePreferences)
    }, buildSidebarAd:function () {
        if (!GS.user.subscription.canHideAds() && !this.isFirstVisit && (!this.currentTheme.sponsored || this.currentTheme.sidebarAd) && GS.Controllers.PageController.activePageName.toLowerCase() == this.PAGE_HOME) {
            GS.getAd().showAdBar();
            GS.getAd().updateRotationCount();
            $("#sidebarCapital_160").addClass("capital");
            var c = (new Date).getTime();
            GS.getAd().buildAd($("#sidebarCapital_160"), 160, 600, ["p=home", "v=" + c])
        } else GS.getAd().hideAdBar()
    }, pageView:function (c) {
        if (!this.currentTheme && !this.themeIsReady || !this.lastActivePage)this.lastActivePage = c.toLowerCase(); else {
            switch (c.toLowerCase()) {
                case this.PAGE_HOME:
                    this.positionTheme();
                    this.hasAdSyncUnSync() && this.adSync();
                    this.themeImpression();
                    this.buildSidebarAd();
                    this.currentTheme && this.currentTheme.onDisplay &&
                    this.currentTheme.onDisplay();
                    break;
                default:
                    this.canCallAdServer() && this.loadFromDFP();
                    this.hasAdSyncUnSync() && this.lastActivePage == this.PAGE_HOME && this.adUnSync();
                    this.themePageImpression();
                    break
            }
            this.lastActivePage = c
        }
    }, themeImpression:function () {
        if (this.currentTheme && this.themeIsReady && this.currentTheme.sponsored)if (GS.Controllers.PageController.activePageName && GS.Controllers.PageController.activePageName.toLowerCase() == this.PAGE_HOME) {
            GS.getGuts().gaSetCustomVariable(3, "Theme", this.currentTheme.themeID,
                    2);
            if (this.currentTheme.tracking) {
                this.hasSeenSponsoredTheme = true;
                GS.service.logTargetedThemeImpression(this.currentTheme.themeID);
                this.loadTracking(this.currentTheme.tracking);
                if (GS.getAd)GS.getAd().rotationCountPerImpression = 0
            }
        }
    }, themePageImpression:function () {
        this.currentTheme && this.themeIsReady && this.currentTheme.sponsored && $("#theme_page_header").is(".active:visible") && this.loadTracking(this.currentTheme.pageTracking)
    }, loadTracking:function (c) {
        if ($.isArray(c)) {
            var a = (new Date).valueOf(), b;
            _.forEach(c,
                    function (d) {
                        if (d) {
                            if (d.indexOf("pointroll") == -1)d += d.indexOf("?") != -1 ? "&" + a : "?" + a;
                            b = new Image;
                            $("body").append($(b).load(function (f) {
                                $(f.target).remove()
                            }).css("visibility", "hidden").attr("src", d))
                        }
                    })
        }
    }, trackDefault:function (c) {
        this.loadTracking(["http://ad.doubleclick.net/ad/grooveshark.wall/;id=" + c + ";d=1;sz=1x1;ord="]);
        GS.getGuts().logEvent("trackDefaultTheme", {id:c})
    }, trackFirstVisit:function () {
        this.loadTracking(["http://ad.doubleclick.net/ad/grooveshark.wall/;id=-1;v=1;sz=1x1;ord="])
    }, onThemeClick:function (c) {
        c &&
                c.currentTarget && this.currentTheme && this.currentTheme.handleClick(c)
    }, playVideo:function (c) {
        if (this.currentTheme) {
            index = _.orEqual(c.index, 0);
            GS.getLightbox().open("video", {video:this.currentTheme.videos[index], videos:this.currentTheme.videos, index:index})
        }
    }, renderTheme:function () {
        var c = $("#theme_page_header.measure").height();
        if (this.currentTheme) {
            $("#themeStyleSheet").attr("href", [gsConfig.assetHost, this.themesLocation, this.currentTheme.location, "theme.css"].join("/") + "?ver=" + this.currentTheme.version);
            $(".theme_component").html("").removeClass("active");
            for (var a = 0; a < this.currentTheme.sections.length; a++)this.renderSection(this.currentTheme.sections[a]);
            this.positionTheme();
            a = window.location.hash.toString();
            a = a.replace(/^#!\/|^#\/|^\/|^#!|^#/, "");
            if (a !== "" && a.indexOf("theme") !== 0 && a.indexOf("sessions") !== 0) {
                $("#theme_home object").hide();
                a.indexOf("signup");
                this.currentTheme.artistIDs && this.themeNotification(GS.player.getCurrentSong())
            }
        }
        $("#theme_page_header.measure").height() !== c && GS.resize()
    },
    renderSection:function (c) {
        if (this.currentTheme && c.length && $(c).length) {
            var a = [this.themesLocation, this.currentTheme.location];
            a.push(c.substr(7, c.length));
            a = a.join("/");
            $(c).html(this.view(a)).addClass("active");
            if (c === "#theme_page_header" || c === "#theme_page_header_expandable")$(c).prepend($("<div class='border'></div>"));
            this.currentTheme.bindAssets(c)
        }
    }, positionTheme:function () {
        var c;
        if (this.currentTheme && this.currentTheme.sections)for (var a = 0; a < this.currentTheme.sections.length; a++) {
            c = this.currentTheme.sections[a];
            this.currentTheme.position(c)
        }
    }, themeNotification:function (c) {
        c = _.orEqual(c, GS.player.getCurrentSong());
        var a = new Date, b = window.location.hash.toString();
        b = b.replace(/^#!\/|^#\/|^\/|^#!|^#/, "");
        if (c && this.currentTheme.artistIDs && b !== "")for (var d = 0; d < this.currentTheme.artistIDs.length; d++) {
            b = this.currentTheme.artistIDs[d];
            if (b == c.ArtistID && this.currentTheme.artistNotifTracking && (!this.lastThemeNotification || a.getTime() - this.lastThemeNotification > this.THEME_NOTIF_RATE_LIMIT)) {
                this.lastThemeNotification =
                        a.getTime();
                GS.getNotice().displayThemeArtistNotification(c, this.currentTheme);
                break
            }
        }
    }, view:function (c, a, b) {
        var d = [c];
        if (b && b.type == "tooltip") {
            d = ["gs", "views"];
            d.push(c.replace(/^\//, ""))
        }
        a = _.orEqual(a, this);
        b = this.calculateHelpers.call(this, b);
        d = "/" + d.join("/");
        d += $.View.ext + "?ver=" + this.currentTheme.version.toString().replace(/[\/\.\?]/g, "_");
        d.replace(/[\/\.]/g, "_").replace(/_+/g, "_").replace(/^_/, "");
        return $.View(d, a, b)
    }, buildParams:function () {
        return GS.getAd().buildParams(["dcmt=text/json",
            "sz=777x777"], ";", ";")
    }, themeCenter:function () {
        $(".theme-center").each(function () {
            var c = $(this);
            c.css({left:"50%", marginLeft:-(c.outerWidth() / 2)})
        })
    }, downloadIE9:function () {
        function c(n) {
            return a.indexOf(n) >= 0
        }

        var a = navigator.userAgent.toLowerCase();
        parseFloat(window.navigator.appMinorVersion);
        c("windows nt");
        var b = c("windows nt 6.0"), d = c("windows nt 6.1"), f = c("windows nt 5.1"), g = c("msie");
        c("msie 7");
        c("msie 8");
        c("trident/5.0");
        c("trident/6.0");
        var k = c("firefox"), m = c("chrome"), h = false;
        if (m)Version =
                a.match(/chrome\/(\d{1,2})/)[1];
        if (k && /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent))Version = Number(RegExp.$1);
        if (g || k && Version >= 4 || m && Version >= 11) {
            BitSniffed = true;
            h = c("win64") || c("wow64")
        }
        WinVersion = f ? "xp" : b ? "vista" : d ? "win7" : "";
        WinBits = h ? "64" : "32";
        b = {"win7-32":"/8/6/D/86DB5DC9-5706-4A5B-BD46-FFBA6FA67D44/IE9-Windows7-x86-enu.exe", "win7-64":"/8/6/D/86DB5DC9-5706-4A5B-BD46-FFBA6FA67D44/IE9-Windows7-x64-enu.exe", "vista-32":"/8/6/D/86DB5DC9-5706-4A5B-BD46-FFBA6FA67D44/IE9-WindowsVista-x86-enu.exe",
            "vista-64":"/8/6/D/86DB5DC9-5706-4A5B-BD46-FFBA6FA67D44/IE9-WindowsVista-x64-enu.exe"};
        d = WinVersion ? WinVersion + "-" + WinBits : "";
        return b[d] ? "http://download.microsoft.com/download" + b[d] : false
    }, handlePreviewLightboxTrigger:function () {
        var c = new Date, a = new Date(2011, 11, 1);
        if (!(c.valueOf() > a.valueOf()))if (this.isFirstVisit)GS.store.set("hasSeenUkuleleWelcome", true); else if (!GS.store.get("hasSeenUkuleleWelcome")) {
            GS.store.set("hasSeenUkuleleWelcome", true);
            GS.getLightbox().open("preview")
        }
    }, currentTipElement:null,
    tooltipTimer:null, "#theme_home .tooltip mouseover":function (c) {
        clearTimeout(this.toolTipTimer);
        if (this.currentTipElement != c.get(0)) {
            this.currentTipElement = c.get(0);
            c = $(c);
            var a = c.attr("data-tip-type"), b = null;
            b = {flattrTarget:c.attr("data-tip-target"), flattrHeader:c.attr("data-tip-header"), flattrMessage:c.attr("data-tip-message"), flattrContext:"theme"};
            var d = c.offset(), f = d.left + c.width() + 350 > $("body").width() ? "left" : "right";
            $("#tooltip").stop().remove();
            b = c.attr("data-tip-view") ? $(this.view("themes/" +
                    this.currentTheme.location + "/tooltip", {data:b, direction:f}, {})) : $(this.view("/shared/tooltips/" + a, {data:b, direction:f}, {type:"tooltip"}));
            f == "left" ? b.css({top:d.top - 10, left:d.left - parseFloat(c.attr("data-tip-width")) - 10}) : b.css({top:d.top, left:d.left + c.width() + 5});
            $("body").append(b.hide().delay(250).fadeIn("fast"));
            b.bind("mouseover", this.callback(function (g) {
                $(g.currentTarget).attr("data-tooltip-mouseover", true)
            })).bind("mouseout", this.callback(function (g) {
                $(g.currentTarget).attr("data-tooltip-mouseover",
                        null);
                this.toolTipTimer = setTimeout(this.callback("closeTooltip"), 750)
            }))
        }
    }, "#theme_home .tooltip mouseout":function () {
        this.toolTipTimer = setTimeout(this.callback("closeTooltip"), 750)
    }, closeTooltip:function () {
        if (!$("#tooltip.displayOnHover").attr("data-tooltip-mouseover")) {
            clearTimeout(this.tooltipTimer);
            this.tooltipTimer = this.currentTipElement = null;
            $("#tooltip").stop().fadeOut(50, function () {
                $(this).remove()
            })
        }
    }});

