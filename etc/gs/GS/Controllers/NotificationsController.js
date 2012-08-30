GS.Controllers.BaseController.extend("GS.Controllers.NotificationsController", {isGSSingleton:true, preSetup:function () {
    var c = GS.Controllers.BaseController.singletonCallback, a = $.subscribe;
    a("gs.notification", c("notice", "displayMessage"));
    a("gs.player.nowplaying", c("notice", "onSongPlay"));
    a("gs.notification.restorequeue", c("notice", "displayRestoreQueue"));
    a("gs.notification.favorite.song", c("notice", "displayFavoritedObject", "song"));
    a("gs.notification.favorite.playlist", c("notice", "displayFavoritedObject",
            "playlist"));
    a("gs.notification.favorite.artist", c("notice", "displayFavoritedObject", "artist"));
    a("gs.notification.favorite.user", c("notice", "displayFavoritedObject", "user"));
    a("gs.notification.playlist.create", c("notice", "displayFavoritedObject", "newPlaylist"));
    a("gs.auth.library.songsAdded", c("notice", "displayLibraryAddedObject"));
    a("gs.twitter.notification.sent", c("notice", "displayTwitterSent"));
    a("gs.twitter.notification.findFriends", c("notice", "displayTwitterFindFriends"));
    a("gs.ad.notification.report",
            c("notice", "displayReportAdFeedback"));
    a("gs.notification.hipster", c("notice", "displayHipsterNotification"));
    a("gs.notification.html5.nag", c("notice", "displayHTML5NagNotification"))
}}, {appIsReady:false, localeIsReady:false, queuedNotifications:[], openNotifications:[], maxOnScreen:3, uniquesLookup:{}, notificationLookup:{}, seenArtistNotifications:[], sawSignupNotification:false, sawRestoreQueueNotification:false, feedbackOnNextSong:false, sawPreviewNotification:0, doNotShowPreviewNotification:false, sawPreviewNotificationThisSession:false,
    beenToPreview:false, frequencyUnitMap:{minute:6E4, hour:36E5, day:864E5, week:6048E5, visit:0}, rateLimitMap:{survey:{lastSeen:null, countSeen:0, frequencyCount:20, frequencyUnitCount:1, frequencyUnit:"hour", uniqueID:false, hasSeenID:{}}, theme:{lastSeen:null, countSeen:0, frequencyCount:0, frequencyUnitCount:0, frequencyUnit:null, uniqueID:false, hasSeenID:{}}, promotion:{lastSeen:null, countSeen:0, frequencyCount:1, frequencyUnitCount:5, frequencyUnit:"hour", uniqueID:true, hasSeenID:{}}, success:{lastSeen:null, countSeen:0,
        frequencyCount:0, frequencyUnitCount:0, frequencyUnit:null, uniqueID:false, hasSeenID:{}}, error:{lastSeen:null, countSeen:0, frequencyCount:0, frequencyUnitCount:0, frequencyUnit:null, uniqueID:false, hasSeenID:{}}, info:{lastSeen:null, countSeen:0, frequencyCount:0, frequencyUnitCount:0, frequencyUnit:null, uniqueID:false, hasSeenID:{}}, notice:{lastSeen:null, countSeen:0, frequencyCount:0, frequencyUnitCount:0, frequencyUnit:null, uniqueID:false, hasSeenID:{}}, misc:{lastSeen:null, countSeen:0, frequencyCount:0, frequencyUnitCount:0,
        frequencyUnit:null, uniqueID:false, hasSeenID:{}}}, init:function () {
        this.seenPromoNotifications = GS.store.get("seenPromoNotifications") || {};
        this.sawPreviewNotification = parseInt(GS.store.get("sawPreviewNotification"), 10) || 0;
        this.doNotShowPreviewNotification = _.orEqual(GS.store.get("doNotShowPreviewNotification"), false);
        this.sawRestoreQueueNotification = parseInt(GS.store.get("sawRestoreQueueNotification"), 10) || 0;
        this.beenToPreview = _.orEqual(GS.store.get("beenToPreview"), false);
        this.sawFacebookListenNotification =
                _.orEqual(GS.store.get("sawFBListenNotification"), false);
        this.sawHTML5SpamNotification = _.orEqual(GS.store.get("sawHTML5SpamNotification"), false);
        this._super();
        if ($.localize.ready)this.localeIsReady = true; else this.subscribe("gs.locale.ready", this.callback("localeReady"));
        GS.Notification.prototype.controller = this;
        var c = _.browserDetect(), a = false;
        switch (c.browser) {
            case "chrome":
                a = true;
                break;
            case "firefox":
                a = c.version >= 6;
                break;
            case "msie":
                a = c.version >= 8;
                break
        }
        GS.Notification.defaults.useAnimation = a;
        if (GS.store &&
                GS.store.get("notificationRateLimitMap"))this.rateLimitMap = GS.store.get("notificationRateLimitMap");
        setInterval(this.callback("checkPriorityQueue"), 4E3)
    }, appReady:function () {
        this.appIsReady = true;
        this.openNext();
        this.getPromotionalNotification()
    }, showPreviewLightbox:function () {
        if (!this.beenToPreview && (GS.user.subscription.isPremium() || GS.user.UserID % 5 === 0)) {
            this.beenToPreview = true;
            GS.store.set("beenToPreview", true);
            GS.getLightbox().open("preview")
        }
    }, localeReady:function () {
        this.localeIsReady = true;
        this.openNext()
    },
    generateNotificationID:function () {
        var c = (Math.floor(Math.random() * 1E4) + 1).toString();
        return this.notificationLookup.hasOwnProperty(c) ? this.generateNotificationID() : c
    }, updateRateLimitData:function (c) {
        var a = (new Date).getTime();
        this.rateLimitMap[c.rateLimitType] || (this.rateLimitMap[c.rateLimitType] = {lastSeen:null, countSeen:0, frequencyCount:0, frequencyUnitCount:0, frequencyUnit:null, uniqueID:false, hasSeenID:{}});
        this.rateLimitMap[c.rateLimitType].countSeen++;
        this.rateLimitMap[c.rateLimitType].lastSeen =
                a;
        var b = c.iID ? c.iID : c.xID;
        if (b)this.rateLimitMap[c.rateLimitType].hasSeenID[b] = a;
        GS.store.set("notificationRateLimitMap", this.rateLimitMap)
    }, checkPriorityQueue:function () {
        if (this.queuedNotifications.length) {
            var c = this.getTopPriority();
            if (c)if (this.checkAllLimit(c))this.checkStack(c) && this.openNext(); else {
                this.discardQueuedNotification(c);
                this.checkPriorityQueue()
            }
        }
    }, getTopPriority:function () {
        var c;
        if (this.queuedNotifications.length) {
            this.queuedNotifications.sort(function (a, b) {
                return a.priority > b.priority
            });
            c = this.queuedNotifications[0]
        }
        return c
    }, placeNotificationNext:function (c) {
        this.queuedNotifications.splice(this.queuedNotifications.indexOf(c), 1);
        this.queuedNotifications.unshift(c)
    }, idCheck:function (c) {
        var a = c.iID ? c.iID : c.xID;
        if (!a)return true;
        return!this.rateLimitMap[c.rateLimitType].hasSeenID[a] || this.rateLimitMap[c.rateLimitType].hasSeenID[a] && !this.rateLimitMap[c.rateLimitType].uniqueID
    }, frequencyCheck:function (c) {
        var a = this.rateLimitMap[c.rateLimitType];
        if (!a)if (c.customLimit) {
            this.rateLimitMap[c.rateLimitType] =
                    c.customLimit;
            a = this.rateLimitMap[c.rateLimitType]
        } else return false;
        if (!a.frequencyCount || !a.frequencyUnitCount || !a.frequencyUnit)return true;
        c = (new Date).getTime();
        var b = this.frequencyUnitMap[a.frequencyUnit] * a.frequencyUnitCount;
        if (a.lastSeen)if (c - a.lastSeen < b)return a.countSeen < a.frequencyCount ? true : false; else {
            a.countSeen = 0;
            return true
        } else {
            a.countSeen = 0;
            return true
        }
    }, expirationCheck:function (c) {
        var a = (new Date).getTime();
        return c.timestamp + c.expiration > a ? true : false
    }, subscriptionCheck:function (c) {
        if (!c.subscription)return true;
        switch (c.subscription) {
            case "anywhere":
                return GS.user.subscription.isAnywhere();
            case "plus":
                return!GS.user.subscription.isAnywhere() && GS.user.IsPremium;
            case "free":
                return!GS.user.IsPremium
        }
    }, loggedInCheck:function (c) {
        if (!c.loggedIn)return true;
        return c.loggedIn && GS.user.UserID > 0
    }, nowOrNeverCheck:function (c) {
        if (c.nowOrNever)if (this.checkAllLimit(c) && this.checkStack(c))return true; else this.discardQueuedNotification(c);
        return false
    }, newFeatureTooltipCheck:function () {
        if ($("#tooltip-mini.tooltip-mini").length)return false;
        return true
    }, checkAllLimit:function (c) {
        return this.idCheck(c) && this.frequencyCheck(c) && this.expirationCheck(c) && this.subscriptionCheck(c) && this.loggedInCheck(c)
    }, checkStack:function (c) {
        return!this.openNotifications.length || (c.priority == 1 || c.nowOrNever) && this.openNotifications.length < this.maxOnScreen
    }, discardQueuedNotification:function (c) {
        return this.queuedNotifications.splice(this.queuedNotifications.indexOf(c), 1)
    }, queueNotification:function (c) {
        c.timestamp = (new Date).getTime();
        this.queuedNotifications.indexOf(c) ===
                -1 && this.queuedNotifications.push(c);
        if (c.force || this.nowOrNeverCheck(c)) {
            this.placeNotificationNext(c);
            this.openNext()
        }
    }, openNext:function () {
        if (this.appIsReady && this.localeIsReady && this.queuedNotifications.length && this.openNotifications.length < this.maxOnScreen) {
            var c = this.queuedNotifications.shift();
            if (this.newFeatureTooltipCheck()) {
                c.open();
                this.updateRateLimitData(c)
            }
        }
    }, reportOpen:function (c) {
        this.openNotifications.indexOf(c) === -1 && this.openNotifications.push(c)
    }, reportClose:function (c) {
        var a =
                this.openNotifications.indexOf(c);
        a !== -1 && this.openNotifications.splice(a, 1);
        this.notificationLookup.hasOwnProperty(c.notificationID) && delete this.notificationLookup[c.notificationID];
        c.uniqueInstance && this.uniquesLookup.hasOwnProperty(c.uniqueInstance) && delete this.uniquesLookup[c.uniqueInstance]
    }, displayMessage:function (c) {
        var a;
        c.force = true;
        if (c.type && !c.rateLimitType) {
            c.rateLimitType = c.type;
            if (c.type == "error")c.expiration = 8E3
        }
        if (c.uniqueInstance)if ((a = this.uniquesLookup[c.uniqueInstance]) && a.isOpen) {
            a.beginTimeout();
            return
        }
        a || (a = new GS.Notification({view:"notification", viewParams:{controller:this, notification:c}, rateLimitType:_.orEqual(c.rateLimitType, "misc"), timestamp:_.orEqual(c.timestamp, null), nowOrNever:_.orEqual(c.nowOrNever, false), expiration:_.orEqual(c.expiration, 3E4), priority:_.orEqual(c.priority, 5), subscription:_.orEqual(c.subscription, null), loggedIn:_.orEqual(c.loggedIn, null), iID:_.orEqual(c.iID, null), xID:_.orEqual(c.xID, null), customLimit:_.orEqual(c.customLimit, null), force:_.orEqual(c.force, false),
            duration:c.manualClose ? 0 : c.displayDuration, uniqueInstance:_.orEqual(c.uniqueInstance, false)}));
        a.isOpen || this.queueNotification(a)
    }, onSongPlay:function (c) {
        if (c && (this.feedbackOnNextSong || c.sponsoredAutoplayID)) {
            this.feedbackOnNextSong = false;
            if (this.seenArtistNotifications.indexOf(c.ArtistID) === -1) {
                this.seenArtistNotifications.push(c.ArtistID);
                this.displayArtistFeedback(c)
            }
        }
        this.uniquesLookup.promotion || this.getPromotionalNotification({song:c})
    }, closeAllNotifs:function () {
        if (!_.isEmpty(this.uniquesLookup))for (var c in this.uniquesLookup)this.uniquesLookup.hasOwnProperty(c) &&
        this.uniquesLookup[c].close()
    }, closeAllSurveyNotifs:function () {
        if (!_.isEmpty(this.uniquesLookup))for (var c in this.uniquesLookup)if (this.uniquesLookup.hasOwnProperty(c))if (c == "surveyOptIn" || c == "surveyResult" || c == "surveyQuestion")this.uniquesLookup[c].close()
    }, isSurveyNotifOpen:function () {
        if (!_.isEmpty(this.uniquesLookup))for (var c in this.uniquesLookup)if (this.uniquesLookup.hasOwnProperty(c))if (c == "surveyOptIn" || c == "surveyResult" || c == "surveyQuestion")return true;
        return false
    }, userActivityCheck:function () {
        var c =
                false, a = 0;
        _.forEach(GS.theme.themePreferences, function (b, d) {
            a++;
            if (d != "-1" || a > 1)c = true
        });
        return c
    }, displayArtistFeedback:function (c) {
        this.uniquesLookup.artistFeedback || this.queueNotification(new GS.Notification({uniqueInstance:"artistFeedback", view:"artistNotification", viewParams:{controller:this, feedbackSong:c}, force:true, expiration:8E3, duration:15E3}))
    }, displayHipsterNotification:function () {
        if (!this.uniquesLookup.hipster) {
            this.queueNotification(new GS.Notification({uniqueInstance:"hipster", view:"hipsterNotification",
                viewParams:{controller:this}, duration:15E3}));
            GS.getGuts().gaTrackEvent("hipsterAprilFools", "seenHipster")
        }
    }, ".actions .shutUp click":function () {
        this.uniquesLookup.hipster.close();
        GS.user.hipsterFailCount++;
        GS.getGuts().gaTrackEvent("hipsterAprilFools", "shutupHipster")
    }, ".actions .moar click":function () {
        this.uniquesLookup.hipster.close();
        this.displayHipsterNotification();
        GS.getGuts().gaTrackEvent("hipsterAprilFools", "moarHipster")
    }, displayHTML5NagNotification:function () {
        if (!this.uniquesLookup.html5Nag) {
            this.queueNotification(new GS.Notification({uniqueInstance:"html5Nag",
                view:"html5CTA", viewParams:{controller:this}, rateLimitType:"promotion", priority:10, duration:0}));
            GS.getGuts().gaTrackEvent("html5Nag", "seenNotif");
            GS.store.set("sawHTML5SpamNotification", true)
        }
    }, ".HTML5Nag .actions .openLightbox click":function () {
        var c = this.uniquesLookup.html5Nag;
        c && c.close();
        GS.getLightbox().open("html5Promo")
    }, ".HTML5Nag .html5Link":function () {
        window.open("http://html5.grooveshark.com/", "_blank");
        GS.getGuts().gaTrackEvent("html5Nag", "openLink")
    }, ".HTML5Nag .actions .close click":function () {
        GS.getGuts().gaTrackEvent("html5Nag",
                "noThanks")
    }, displaySurveyQuestion:function (c) {
        c = _.orEqual(c, {});
        this.queueNotification(new GS.Notification({uniqueInstance:"surveyQuestion", view:"surveyQuestion", viewParams:{controller:this, question:c.question, callback:c.callback}, rateLimitType:"survey", duration:6E4}))
    }, displaySurveyOptIn:function (c) {
        c = _.orEqual(c, {});
        this.queueNotification(new GS.Notification({uniqueInstance:"surveyOptIn", view:"surveyOptIn", viewParams:{controller:this, question:c.question, callback:c.callback}, rateLimitType:"survey",
            duration:6E4}));
        GS.getGuts().logEvent("civicscience.invitationSeen", {userID:GS.user.UserID, timestamp:(new Date).getTime()})
    }, displaySurveyResult:function (c) {
        c = _.orEqual(c, {});
        this.queueNotification(new GS.Notification({uniqueInstance:"surveyResults", view:"surveyResults", viewParams:{controller:this, mostPopular:c.responses.mostPopular, selectedAnswer:c.responses.selectedAnswer, responses:c.responses, callback:c.callback}, rateLimitType:"survey", duration:15E3}))
    }, displaySurveyInvitation:function () {
        var c =
                $.localize.getString("SURVEY_CIVICSCIENCE_CTA"), a = window.location.hash.toString();
        a = a.replace(/^#!\/|^#\/|^\/|^#!|^#/, "");
        var b = function (f, g) {
            if (!f.uniquesLookup.surveyInvitation && a.indexOf("surveys") !== 0) {
                var k = new GS.Notification({uniqueInstance:"surveyInvitation", view:"surveyInvitation", viewParams:{controller:f, message:g}, rateLimitType:"survey", duration:15E3});
                f.queueNotification(k)
            }
        }, d = this;
        GS.user.isLoggedIn && GS.Models.Surveys.userHasKinesis() ? GS.Models.Surveys.initKinesis("notif", this.callback(function (f) {
            if (f.seskey) {
                GS.user.surveys =
                        f;
                GS.user.surveys.getEverything(function (g) {
                    GS.user.surveys.panelist = g;
                    c = GS.user.surveys.availableSurveys.length > 0 ? $.localize.getString("SURVEY_CIVICSCIENCE_AVAILABLE_MSG") : null;
                    b(d, c)
                })
            } else b(d, c)
        })) : b(d, c)
    }, displaySurveyInvitationV2:function () {
        this.queueNotification(new GS.Notification({uniqueInstance:"surveyInvitation", view:"surveyInvitationV2", viewParams:{controller:this}, rateLimitType:"survey", duration:15E3}))
    }, displaySurveyAvailable:function (c) {
        this.queueNotification(new GS.Notification({uniqueInstance:"surveyAvailable",
            view:"surveyAvailable", viewParams:{controller:this, points:c}, rateLimitType:"survey", duration:15E3}))
    }, displaySurveyPoints:function (c) {
        this.queueNotification(new GS.Notification({view:"surveyPoints", viewParams:{controller:this, points:c}, rateLimitType:"survey", duration:15E3}))
    }, "#surveyOptOut click":function (c, a) {
        a.preventDefault();
        var b = null;
        if ($(c).hasClass("optOut")) {
            GS.store.set("civicscience.hasSeenInvitation" + GS.user.UserID, true);
            b = this.uniquesLookup.surveyQuestion
        } else b = this.uniquesLookup.surveyOptIn;
        if (b) {
            GS.Models.Surveys.changeCivicScienceSettings(true);
            b.close()
        }
        return false
    }, "#surveyOptIn click":function (c, a) {
        a.preventDefault();
        GS.store.set("civicscience.hasSeenInvitation" + GS.user.UserID, true);
        var b = this.uniquesLookup.surveyOptIn;
        if (b) {
            var d = b.viewParams.callback;
            b.close();
            d();
            GS.getGuts().logEvent("civicscience.optIn", {userID:GS.user.UserID, timestamp:(new Date).getTime()})
        }
        return false
    }, "#nextQuestion click":function (c, a) {
        a.preventDefault();
        var b = this.uniquesLookup.surveyResults;
        if (b) {
            var d =
                    b.viewParams.callback;
            b.close();
            d()
        }
        return false
    }, "li.notification form.survey submit":function (c, a) {
        a.preventDefault();
        var b = this.uniquesLookup.surveyQuestion;
        if (b) {
            var d = b.viewParams.question.answers, f = $(c).find(".selection");
            name = b.viewParams.question.name;
            callback = b.viewParams.callback;
            if (f.attr("value") != "-")if (name == "CivicScience") {
                var g = GS.user.civicScience, k = g.session, m = null;
                if (f && f.length) {
                    for (m = 0; m < d.length; m++)if (d[m].id == f.attr("value")) {
                        m = d[m].option;
                        m.select();
                        break
                    }
                    b.close();
                    k.commit(g.handleCommit)
                }
            } else if ($.isFunction(callback)) {
                d =
                {text:f.text(), id:f.attr("value"), questionId:f.attr("name")};
                callback(d);
                b.close()
            }
        }
        return false
    }, "#goToSurveys click":function (c, a) {
        a.preventDefault();
        var b = this.uniquesLookup[$("li.notification").attr("id")];
        b && b.close();
        GS.router.setHash("/surveys");
        return false
    }, "#surveyAvailClose click":function (c, a) {
        a.preventDefault();
        var b = null;
        (b = this.uniquesLookup.surveyAvailable) && b.close();
        return false
    }, "#surveyInvitClose click":function (c, a) {
        a.preventDefault();
        var b = null;
        (b = this.uniquesLookup.surveyInvitation) &&
        b.close();
        return false
    }, "#surveyInvitation .surveyStart click":function (c, a) {
        a.preventDefault();
        var b = this.uniquesLookup.surveyInvitation;
        b && b.close();
        GS.router.setHash("/surveys");
        return false
    }, displayPerAnum:function () {
        this.queueNotification(new GS.Notification({view:"perAnum", viewParams:{controller:this}}))
    }, displayReportAdFeedback:function (c) {
        var a = this.uniquesLookup.adFeedback;
        a && a.close();
        if ($.isFunction(c)) {
            a = new GS.Notification({uniqueInstance:"adFeedback", view:"adFeedback", viewParams:{controller:this},
                nowOrNever:true, duration:1E4});
            a.onClose = c;
            this.queueNotification(a)
        }
    }, "#adFeedbackNotifForm .submit click":function (c, a) {
        a.preventDefault();
        var b = $("textarea.feedback", "#adFeedbackNotifForm").val(), d = $(".selection", "#adFeedbackNotifForm").attr("value");
        if (["", "none", "audio", "video", "nudity", "offen", "other"].indexOf(d) == -1)d = "";
        var f = this.uniquesLookup.adFeedback;
        f && f.close({desc:b, type:d});
        return false
    }, "#adFeedbackNotifForm .cancel click":function (c, a) {
        a.preventDefault();
        var b = this.uniquesLookup.adFeedback;
        b && b.close(false);
        return false
    }, displayThemeArtistNotification:function (c, a) {
        this.queueNotification(new GS.Notification({uniqueInstance:"artistFeedback", view:"themes/" + a.location + "/artist_notification", viewParams:{controller:this, feedbackSong:c}, rateLimitType:"theme", iID:GS.theme.currentTheme.themeID, force:true, duration:false}));
        GS.theme.lastDFPChange = (new Date).getTime() + 15E3
    }, displayThemeArtistNotificationTesting:function () {
        this.queueNotification(new GS.Notification({uniqueInstance:"artistFeedback",
            view:"themes/" + GS.theme.currentTheme.location + "/artist_notification", viewParams:{controller:this, feedbackSong:{ArtistID:"1453", ArtistName:"Spoon", SongID:"14679569", SongName:"The Way We Get By"}}, rateLimitType:"theme", iID:GS.theme.currentTheme.themeID, force:true, duration:false}));
        GS.theme.lastDFPChange = (new Date).getTime() + 15E3
    }, "li.notification a.theme_link click":function (c, a) {
        a.index = parseInt($(c).attr("data-video-index"), 10);
        if ($(c).attr("data-theme-id"))$(c).attr("data-click-id") && GS.service.logThemeOutboundLinkClick($(c).attr("data-theme-id"),
                $(c).attr("data-click-id")); else GS.theme.currentTheme.handleClick(a);
        GS.theme.lastDFPChange = (new Date).getTime();
        if ($(c).attr("data-click-action")) {
            var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
            b && b.close()
        }
    }, displayLibraryAddedObject:function (c) {
        var a = {controller:this};
        if (c.songs) {
            if (c.songs.length == 1) {
                a.msgKey = "NOTIF_LIBRARY_ADDED_SONG";
                a.msgData = c.songs[0];
                a.msgData.songLink = "<a class='songLink' rel='" + c.songs[0].songID + "'>" + c.songs[0].songName + "</a>";
                a.msgData.artistLink = "<a href='" + _.cleanUrl(c.songs[0].artistName, c.songs[0].artistID, "artist", null, null) + "'>" + c.songs[0].artistName + "</a>";
                a.object = c.songs[0].songID;
                a.type = "song"
            } else {
                a.msgKey = "NOTIFICATION_LIBRARY_ADD_SONGS";
                a.msgData = {numSongs:c.songs.length};
                a.type = "songs"
            }
            this.queueNotification(new GS.Notification({view:"libraryAddedNotification", viewParams:a, nowOrNever:true}))
        }
    }, displayFavoritedObject:function (c, a) {
        function b(g) {
            if (g.view == "libraryAddedNotification" && g.viewParams.type === "song" &&
                    g.viewParams.msgData)if (_.orEqual(g.viewParams.msgData.SongID, g.viewParams.msgData.songID) == _.orEqual(a.songID, a.SongID))return true;
            return false
        }

        var d, f;
        if (a) {
            if (c == "song") {
                for (d = 0; d < this.openNotifications.length; d++) {
                    f = this.openNotifications[d];
                    b(f) && f.close()
                }
                for (d = 0; d < this.queuedNotifications.length; d++) {
                    f = this.queuedNotifications[d];
                    if (b(f)) {
                        this.queuedNotifications.splice(d, 1);
                        d--
                    }
                }
            }
            d = {controller:this, type:c, object:a};
            switch (c) {
                case "playlist":
                    d.msgKey = "NOTIF_SUBSCRIBED_PLAYLIST";
                    d.msgData =
                    {playlistName:a.PlaylistName, playlistLink:"<a href='" + _.cleanUrl(a.PlaylistName, a.PlaylistID, "playlist", null, null) + "'>" + a.PlaylistName + "</a>"};
                    break;
                case "song":
                    d.msgKey = "NOTIF_FAVORITED_SONG";
                    d.msgData = {songName:_.orEqual(a.SongName, a.songName), artistName:_.orEqual(a.ArtistName, a.artistName), songLink:"<a class='songLink' rel='" + a.SongID + "'>" + a.SongName + "</a>", artistLink:"<a href='" + _.cleanUrl(a.ArtistName, a.ArtistID, "artist", null, null) + "'>" + a.ArtistName + "</a>"};
                    break;
                case "user":
                    if (a.Username) {
                        d.msgKey =
                                "NOTIF_FOLLOWED_USER";
                        d.msgData = {userName:a.Name, userLink:"<a href='" + _.cleanUrl(a.Name, a.UserID, "user", null, null) + "'>" + a.Name + "</a>"}
                    } else {
                        d.msgKey = "NOTIF_FOLLOWED_USERS";
                        d.msgData = {}
                    }
                    break;
                case "newPlaylist":
                    d.msgKey = "NOTIF_CREATED_PLAYLIST";
                    d.msgData = {playlistName:a.PlaylistName, playlistLink:"<a href='" + _.cleanUrl(a.PlaylistName, a.PlaylistID, "playlist", null, null) + "'>" + a.PlaylistName + "</a>"};
                    break;
                case "artist":
                    d.msgKey = "NOTIF_FOLLOWED_ARTIST";
                    d.msgData = {artistName:a.ArtistName, artistLink:"<a href='" +
                            _.cleanUrl(a.ArtistName, a.ArtistID, "artist", null, null) + "'>" + a.ArtistName + "</a>"};
                    break
            }
            f = new GS.Notification({view:"favoriteNotification", viewParams:d, nowOrNever:true});
            this.queueNotification(f)
        }
    }, "li.notification .favorited button.loginWithFacebook click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        if (b) {
            console.log(b, b.endTimeout);
            b.duration = false;
            b.endTimeout();
            $("button.loginWithFacebook", b.element).hide();
            $("button.closeNotif", b.element).show();
            GS.getFacebook().login(this.callback(function () {
                $("button.closeNotif", b.element).hide();
                b.duration = 5E3;
                this.shareWithFacebook(b)
            }))
        }
        return false
    }, "li.notification .favorited button.shareWithFacebook click":function (c, a) {
        a.stopImmediatePropagation();
        this.shareWithFacebook(this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")]);
        return false
    }, shareWithFacebook:function (c) {
        if (c) {
            c.element.removeClass("notification_success").addClass("notification_form");
            $("button.shareWithFacebook", c.element).hide();
            $("div.facebookShare", c.element).show();
            $("div.content", c.element).prepend('<img src="/webincludes/images/notifications/facebook.png" />');
            $("div.content p", c.element).addClass("hasIcon");
            var a = $("#fb_share_message", c.element);
            a.focus(this.callback(function () {
                a.val() == $.localize.getString("NOTIF_SHARE_PREFILL_MSG") && a.val("")
            }));
            a.focusout(this.callback(function () {
                a.val() === "" && a.val($.localize.getString("NOTIF_SHARE_PREFILL_MSG"))
            }))
        }
    }, "li.notification .favorited button.shareWithFacebookSubmit click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        if (b) {
            var d = b.viewParams.object, f = b.viewParams.type, g = $("#fb_share_message", b.element).val();
            if (g == $.localize.getString("NOTIF_SHARE_PREFILL_MSG"))g = "";
            switch (f) {
                case "song":
                    GS.getFacebook().onFavoriteSong(d, g, true);
                    break;
                case "playlist":
                    GS.getFacebook().onSubscribePlaylist(d, g);
                    break;
                case "newPlaylist":
                    GS.getFacebook().onPlaylistCreate(d, g, true);
                    break;
                case "user":
                    GS.getFacebook().onFollowUser(d,
                            g);
                    break;
                case "artist":
                    GS.getFacebook().onFollowArtist(d, g);
                    break
            }
            b.close()
        }
        return false
    }, displayTwitterSent:function (c) {
        if (c && c.type) {
            var a = this.uniquesLookup.twitter;
            a && a.close();
            a = new GS.Notification({uniqueInstance:"twitter", view:"twitterPostNotification", viewParams:{controller:this, type:c.type}});
            this.queueNotification(a)
        }
    }, displayFacebookSent:function (c) {
        if (c && c.params && c.data) {
            var a = this.uniquesLookup.facebook;
            a && a.close();
            a = new GS.Notification({uniqueInstance:"facebook", view:"facebookPostNotification",
                viewParams:{controller:this, type:c.params.type, hideUndo:c.params.hideUndo, ref:c.params.ref, data:c.data, object:c.params.object}});
            this.queueNotification(a)
        }
    }, "li.notification .facebook button.undo click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        if (b) {
            var d = b.viewParams.data;
            d.object = b.viewParams.object;
            GS.getFacebook().removeEvent(d);
            b.close()
        }
        return false
    }, "li.notification .facebook button.ok click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        b && b.close();
        return false
    }, "li.notification .facebook button.settings click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        if (b) {
            b.close();
            GS.router.setHash("/settings/services")
        }
        return false
    }, "li.notification .facebook a.resetPerms click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        b && b.close();
        GS.getFacebook().showReAuthLightbox();
        return false
    }, "li.notification a.logoutFacebook click":function () {
        GS.auth.logout(function () {
            FB.logout(function () {
                GS.router.setHash("/signup")
            })
        })
    }, "li.notification a.logoutGoogle click":function () {
        GS.auth.logout(function () {
            GS.router.setHash("/signup");
            GS.getGoogle().serviceLogout()
        })
    }, "li.notification a.logoutTwitter click":function () {
        GS.auth.logout(function () {
            GS.router.setHash("/signup");
            GS.getTwitter().serviceLogout()
        })
    }, displayFacebookUndoPost:function (c) {
        if (c.data) {
            var a =
                    "that one";
            if (c.params && c.params.object) {
                a = c.params.object;
                a = _.orEqualEx(a.SongName, a.PlaylistName, a.ArtistName, a.AlbumName)
            }
            (c = this.uniquesLookup.facebook) && c.close();
            c = new GS.Notification({uniqueInstance:"facebook", view:"facebookUndoPostNotification", viewParams:{controller:this, msgData:{title:a}, msgKey:"NOTIF_FACEBOOK_SHARE_UNDO"}, force:true});
            this.queueNotification(c)
        }
    }, displayFacebookCannotPost:function (c) {
        var a = this.uniquesLookup.facebookError;
        if (!a) {
            a = "facebook";
            if (c && c.error)a = "notification_error";
            a = new GS.Notification({uniqueInstance:"facebookError", view:"facebookCannotPostNotification", viewParams:{controller:this, successButton:c && c.successButton ? c.successButton : "POPUP_LOGIN_FACEBOOK", cancelButton:c && c.cancelButton ? c.cancelButton : null, notifLocale:c && c.notifLocale ? c.notifLocale : "POPUP_LOGIN_FACEBOOK_FLAGS", className:a}, expiration:3E4, duration:15E3});
            this.queueNotification(a)
        }
    }, "li.notification .facebook button.loginToFacebook click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        if (b) {
            GS.getFacebook().forceLogin = true;
            GS.getFacebook().loggedIntoFacebook ? GS.getFacebook().serviceLogout(this.callback(function () {
                GS.getFacebook().login()
            })) : GS.getFacebook().login();
            b.close()
        }
        return false
    }, "li.notification .facebook button.cancel click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        if (b) {
            GS.getLightbox().open("newFacebookUser", {showFindFriends:false});
            b.close()
        }
        return false
    }, displayFacebookRateLimit:function (c) {
        if (c.callback) {
            var a =
                    this.uniquesLookup.facebook;
            a && a.close();
            a = new GS.Notification({uniqueInstance:"facebook", view:"facebookRateLimitNotification", viewParams:{controller:this, callback:c.callback, type:c.type}});
            this.queueNotification(a)
        }
    }, "li.notification .facebook button.doItAnyway click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        if (b) {
            var d = b.viewParams.callback;
            d();
            b.close()
        }
        return false
    }, showFacebookListenNotification:function (c) {
        var a =
                this.uniquesLookup.facebook;
        a && a.close();
        a = new GS.Notification({uniqueInstance:"facebook", view:"facebookListens", viewParams:{controller:this, disable:c && c.disable ? true : false}, rateLimitType:"showFacebookListenNotification", customLimit:{lastSeen:null, countSeen:0, frequencyCount:1, frequencyUnitCount:1, frequencyUnit:"week", uniqueID:false, hasSeenID:{}}, duration:c && c.disable ? 5E3 : 1E4});
        this.queueNotification(a)
    }, "li.notification.facebookListens button.loginWithFacebook click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        if (b) {
            GS.user.UserID > 0 ? GS.getFacebook().login() : GS.auth.loginViaFacebook();
            b.close()
        }
        return false
    }, "li.notification.facebookListens button.disable click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        if (b) {
            GS.getLightbox().open("newFacebookUser", {showFindFriends:false});
            b.close()
        }
        return false
    }, "li.notification form.artistFeedback button click":function (c, a) {
        a.stopImmediatePropagation();
        var b = this.uniquesLookup.artistFeedback;
        if (b) {
            var d = $(c).attr("data-vote"), f = b.element.find("textarea").val();
            b = b.viewParams.feedbackSong;
            f && f.length && GS.service.provideSongFeedbackMessage(b.SongID, f);
            GS.service.provideSongFeedbackVote(b.SongID, d, b.ArtistID, this.callback("onArtistFeedback", d), this.callback("onArtistFeedbackFail"))
        }
        return false
    }, displayFacebookConnect:function () {
        var c = this.uniquesLookup.facebook;
        c && c.close();
        c = new GS.Notification({uniqueInstance:"facebook",
            view:"facebookConnectNotification", viewParams:{controller:this}, duration:1E4});
        this.queueNotification(c)
    }, "#fbNotifConnect-btn click":function (c) {
        (c = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")]) && c.close();
        GS.getFacebook().login(function () {
        }, this.callback("fbConnectErrback"))
    }, fbConnectErrback:function (c) {
        if (typeof c == "object" && c.error)c = c.error;
        this.queueNotification(new GS.Notification({view:"notification", viewParams:{controller:this, notification:{type:"error",
            message:$.localize.getString(c)}}, rateLimitType:"error", duration:5E3}))
    }, displayFacebookFindFriends:function (c) {
        var a = this.uniquesLookup.facebook;
        a && a.close();
        c || (c = {message:false, inviteFriends:false});
        a = new GS.Notification({uniqueInstance:"facebook", view:"facebookFindFriendsNotification", viewParams:{controller:this, message:c.message, inviteFriends:c.inviteFriends}, duration:1E4});
        this.queueNotification(a)
    }, "a.findFacebookFriends click":function (c, a) {
        if (a.which) {
            var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
            b && b.close();
            GS.getFacebook().getGroovesharkUsersFromFriends()
        }
    }, "a.inviteFriends click":function (c, a) {
        if (a.which) {
            var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
            b && b.close();
            GS.getLightbox().open("invite")
        }
    }, displayTwitterFindFriends:function (c) {
        var a = this.uniquesLookup.twitter;
        a && a.close();
        c || (c = {message:false, inviteFriends:false});
        a = new GS.Notification({uniqueInstance:"twitter", view:"twitterFindFriendsNotification", viewParams:{controller:this, message:c.message,
            inviteFriends:c.inviteFriends}});
        this.queueNotification(a)
    }, "a.findTwitterFriends click":function (c, a) {
        if (a.which) {
            var b = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
            b && b.close();
            GS.getTwitter().getGroovesharkUsersFromFollowing()
        }
    }, displayFacebookSongComment:function () {
        var c = this.uniquesLookup.facebook;
        c && c.close();
        c = new GS.Notification({uniqueInstance:"facebook", view:"facebookSongCommentNotification", viewParams:{controller:this}, duration:1E4});
        this.queueNotification(c)
    },
    "a.songLink click":function (c, a) {
        a.preventDefault();
        var b = parseInt($(c).attr("rel"), 10);
        b && GS.Models.Song.getSong(b, function (d) {
            d && GS.router.setHash(d.toUrl())
        })
    }, onArtistFeedback:function (c, a) {
        var b = this.uniquesLookup.artistFeedback;
        if (b) {
            var d = {controller:this, feedbackSong:b.viewParams.feedbackSong};
            if (a.success && c == 2) {
                d.urls = a.urls;
                b.element.find(".content").html(this.view("artistNotificationResult", d));
                _.isEmpty(a.urls) && b.beginTimeout(5E3)
            } else b.close()
        }
    }, onArtistFeedbackFail:function () {
        var c =
                this.uniquesLookup.artistFeedback;
        c && c.close()
    }, displayRestoreQueue:function () {
        if (this.sawRestoreQueueNotification < 3) {
            this.queueNotification(new GS.Notification({view:"restoreQueue", viewParams:{controller:this}, force:true}));
            this.sawRestoreQueueNotification++;
            GS.store.set("sawRestoreQueueNotification", this.sawRestoreQueueNotification)
        }
    }, "li.notification a.close click":function (c) {
        (c = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")]) && c.close()
    }, "li.notification .cancel click":function (c) {
        (c =
                this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")]) && c.close()
    }, "form.feedback submit":function () {
        console.log("submit song feedback");
        return false
    }, "li.notification .loginCTA click":function (c) {
        (c = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")]) && c.close();
        GS.getLightbox().open("login")
    }, "li.notification .signupCTA click":function (c) {
        (c = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")]) && c.close();
        GS.router.setHash("/signup")
    }, "li.notification.restoreQueue .restore click":function (c) {
        (c = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")]) && c.close();
        GS.player.restoreQueue()
    }, "li.notification.restoreQueue a.settings click":function (c) {
        (c = this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")]) && c.close();
        GS.user.isLoggedIn ? GS.router.setHash("/settings") : GS.getLightbox().open("login")
    }, "li.notification .playlistLink click":function (c) {
        var a =
                this.notificationLookup[$(c).closest("li.notification").attr("data-notificationid")];
        a && a.close();
        c = $(c).data("playlistid");
        GS.Models.Playlist.getPlaylist(c, function (b) {
            GS.router.setHash(b.toUrl())
        })
    }, "input focus":function (c) {
        $(c).parent().parent().addClass("active")
    }, "textarea focus":function (c) {
        $(c).parent().parent().parent().addClass("active")
    }, "input blur":function (c) {
        $(c).parent().parent().removeClass("active")
    }, "textarea blur":function (c) {
        $(c).parent().parent().parent().removeClass("active")
    },
    ".selection_survey, .selection_adType focus":function (c) {
        c.parents(".input_wrapper").addClass("active")
    }, ".selection_survey, .selection_adType blur":function (c) {
        c.parents(".input_wrapper").removeClass("active")
    }, ".selection_survey, .selection_adType keydown":function (c) {
        c.change()
    }, ".selection_survey change":function (c) {
        var a = c.siblings("span");
        c = c.find("#profilerQuestion:selected");
        a.html(c.html());
        a.attr("value", c.attr("value"))
    }, ".selection_adType change":function (c) {
        var a = c.siblings("span");
        c =
                c.find(".adTypeSelected:selected", "#adType");
        a.html(c.html());
        a.attr("value", c.attr("value"))
    }, "li.notification.promo .promoNotifClickTracking click":function () {
    }, getPromotionalNotification:function (c) {
        var a = c && c.manual;
        GS.service.getNotificationFromDFP(this.buildParams(c), this.callback("displayPromotion", a), this.callback("displayPromotionErr"))
    }, displayPromotion:function (c, a) {
        try {
            a = JSON.parse(a)
        } catch (b) {
            console.log("invalid json from DFP", b);
            return
        }
        a.id == "-1" ? console.log("no promo notif") : this.queueNotification(new GS.Notification({uniqueInstance:"promotion",
            view:a.view, viewParams:{controller:this, data:a}, duration:a.duration, type:a.type ? a.type : "promotion", nowOrNever:a.nowOrNever, expiration:a.expiration, priority:a.priority, subscription:a.subscription, loggedIn:a.loggedIn, xID:a.xID, force:c}))
    }, displayPromotionErr:function () {
        console.warn("Promotional Notification Error")
    }, buildParams:function (c) {
        var a = [];
        if (c && c.manual && c.xID) {
            a.push("m=1");
            a.push("xID=" + c.xID)
        }
        a = a.concat(["notif=1", "dcmt=text/json", "sz=468x60"]);
        return GS.getAd().buildParams(a, ";", ";")
    },
    loadTracking:function (c) {
        if ($.isArray(c)) {
            var a = (new Date).valueOf(), b;
            _.forEach(c, function (d) {
                d += d.indexOf("?") != -1 ? "&" + a : "?" + a;
                b = new Image;
                $("body").append($(b).load(function (f) {
                    $(f.target).remove()
                }).css("visibility", "hidden").attr("src", d))
            })
        }
    }});

