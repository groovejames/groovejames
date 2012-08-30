(function (c) {
    function a(m, h, n, q) {
        var s = {};
        s.method = m;
        s.format = "jsonp";
        s.data = JSON.stringify(h);
        c.ajax({contentType:"application/javascript", type:"GET", dataType:"jsonp", url:"https://surveys.grooveshark.com/panel/api.pro", data:s, error:function (w, o, u) {
            console.log("Survey AJAX error occured: " + u + " Status: " + o);
            if (c.isFunction(q)) {
                w = {};
                w.message = o;
                w.callback = n;
                c.isFunction(q) && q(w)
            }
        }, success:function (w) {
            if (w.success)c.isFunction(n) && n(w); else {
                console.log("Survey error occured: " + JSON.stringify(w));
                if (c.isFunction(q)) {
                    var o =
                    {};
                    o.errno = w.errno;
                    o.message = w.error;
                    o.callback = n;
                    c.isFunction(q) && q(o)
                }
            }
        }})
    }

    var b = false, d = false, f = false, g = false, k = null;
    GS.Models.Base.extend("GS.Models.Surveys", {panelID:9, numPointsForPlus:300, numPointsForAnywhere:500, init:function () {
        c.subscribe("gs.player.ready", function () {
            d = true;
            GS.Models.Surveys.askOptInCivicScience(6E5);
            GS.Models.Surveys.setupAvailableNotif(18E4)
        });
        c.subscribe("gs.app.ready", function () {
            b = true;
            GS.Models.Surveys.askOptInCivicScience(6E5);
            GS.Models.Surveys.setupAvailableNotif(18E4)
        });
        c.subscribe("gs.auth.update", function () {
            GS.Models.Surveys.askOptInCivicScience(6E5);
            GS.Models.Surveys.setupAvailableNotif(18E4);
            GS.user.Flags & GS.Models.User.FLAG_CLEARVOICE && (GS.user.Flags & GS.Models.User.FLAG_KINESIS) == 0 && GS.user.getPoints(function (m) {
                GS.getLightbox().open("surveysConvert", {points:m})
            })
        });
        c.subscribe("gs.state.active", function () {
            GS.Models.Surveys.askOptInCivicScience(45E3);
            GS.Models.Surveys.setupAvailableNotif(0)
        })
    }, askOptInCivicScience:function (m) {
        !b || !d || GS.user.subscription.isPremium() ||
        GS.user.settings.getUserSettings(function (h) {
            if (!((GS.user.isLoggedIn ? !h.emailNotifications.civicScience : GS.store.get("civicscience.optOut")) || GS.getNotice().isSurveyNotifOpen())) {
                var n = GS.store.get("civicscience.10" + GS.user.UserID);
                if (!_.defined(n)) {
                    n = Math.floor(Math.random() * 10) == 0 ? 2 : 1;
                    GS.store.set("civicscience.10" + GS.user.UserID, n)
                }
                if (n == 1) {
                    if (GS.player.player.getNumVisitedDays() >= 5 && GS.player.player.getNumPlayedSongs() >= 60)GS.Models.Surveys.userHasKinesis() || g || (g = setTimeout(function () {
                        g = false;
                        if (!GS.user.isIdle()) {
                            GS.getNotice().displaySurveyInvitationV2();
                            GS.getGuts().logEvent("kinesis.ctaV2.seen", {userID:GS.user.UserID, timestamp:(new Date).getTime()})
                        }
                    }, m))
                } else if (n == 2)if (GS.store.get("civicscience.hasSeenInvitation" + GS.user.UserID))GS.Models.Surveys.setupCivicScience(m); else f || (f = setTimeout(function () {
                            var q = window.location.hash.toString();
                            q = q.replace(/^#!\/|^#\/|^\/|^#!|^#/, "");
                            if (!GS.user.subscription.isPremium() && q.indexOf("signup") !== 0 && (!GS.page.activePage || GS.page.activePage.type !=
                                    "surveys")) {
                                f = false;
                                q = GS.user.isIdle();
                                var s = GS.user.isLoggedIn ? !h.emailNotifications.civicScience : GS.store.get("civicscience.optOut");
                                if (!(q || s)) {
                                    q = {text:c.localize.getString("SURVEY_CIVICSCIENCE_OPTIN"), id:"optInCivicScience", name:"GS", type:"radio", answers:[
                                        {text:c.localize.getString("SURVEY_CIVICSCIENCE_OPTIN_SURE"), id:0},
                                        {text:c.localize.getString("SURVEY_CIVICSCIENCE_OPTIN_NO"), id:1}
                                    ]};
                                    GS.getNotice().displaySurveyOptIn({question:q, callback:function () {
                                        GS.Models.Surveys.setupCivicScience(0)
                                    }})
                                }
                            }
                        },
                        m))
            }
        })
    }, setupCivicScience:function (m) {
        var h = {};
        h.answeredList = [];
        h.answeredIndex = 0;
        h.session = new civicscience.iqapi.Session(473, false);
        h.askQuestion = function (n) {
            if (n == null) {
                var q = new Date;
                if (GS.store.get("civicscience.polltroll" + GS.user.UserID) != q.toDateString()) {
                    GS.getNotice().displaySurveyInvitation();
                    GS.store.set("civicscience.polltroll" + GS.user.UserID, q.toDateString())
                }
            } else {
                q = {text:n.getText(), id:n.getId(), name:"CivicScience", type:"radio"};
                n = n.getOptions();
                var s = [];
                _.forEach(n, function (w) {
                    s.push({text:w.getText(),
                        id:w.getId(), option:w})
                });
                q.answers = s;
                h.question = q;
                GS.getNotice().displaySurveyQuestion({question:q})
            }
        };
        h.handleCommit = function () {
            h.handleResults()
        };
        h.handleResults = function () {
            h.answeredList = h.session.getAnsweredQuestions();
            var n = h.answeredList[h.answeredIndex];
            if (h.question.id == 484 || h.question.id == 7078)if (GS.store) {
                var q = GS.store.get("adhelper");
                q || (q = {ageRange:null, gender:null});
                var s = n.getSelectedOption();
                if (h.question.id == 484)q.gender = s.getId(); else if (h.question.id == 7078)q.ageRange = s.getId();
                GS.store.set("adhelper", q)
            }
            n.getResults(h.showResults);
            GS.getGuts().logEvent("civicscience.questionAnswered", {userID:GS.user.UserID, questionNum:h.answeredIndex, timestamp:(new Date).getTime()});
            h.answeredIndex++
        };
        h.showResults = function (n, q) {
            if (q) {
                var s = {};
                s.questionText = n.getText();
                s.numOfTotalResponses = q.getTotal();
                var w = q.getCommittedOption(), o = n.getOptions(), u = [];
                w.id = w.getId();
                _.forEach(o, function (B) {
                    var E = q.getCountForOption(B), F = 0;
                    if (s.numOfTotalResponses != 0) {
                        F = Math.round(100 * E / s.numOfTotalResponses);
                        u.push({text:B.getText(), id:B.getId(), percent:F, selected:w.id == B.getId() ? true : false})
                    }
                });
                s.answers = u;
                o = u[0].percent;
                var z = u[0];
                w = u[0];
                for (var D = 0; D < u.length - 1; D++) {
                    if (u[D + 1].selected)w = u[D + 1];
                    if (o < u[D + 1].percent) {
                        o = u[D + 1].percent;
                        z = u[D + 1]
                    }
                }
                s.selectedAnswer = w;
                s.mostPopular = z;
                GS.getNotice().displaySurveyResult({responses:s, callback:function () {
                    h.session.getNextUnansweredQuestion(h.askQuestion)
                }})
            }
        };
        if (GS.user.userPrivacyTokens && GS.user.userPrivacyTokens.authenticated) {
            h.session.setExternalUserId(GS.user.userPrivacyTokens.authenticated);
            GS.user.civicScience = h;
            GS.Models.Surveys.initCivicScienceNotifTracking(h, m)
        }
    }, initCivicScienceNotifTracking:function (m, h) {
        f || (f = setTimeout(function () {
                    f = false;
                    var n = window.location.hash.toString();
                    n = n.replace(/^#!\/|^#\/|^\/|^#!|^#/, "");
                    if (!GS.user.subscription.isPremium() && n.indexOf("signup") !== 0 && (!GS.page.activePage || GS.page.activePage.type != "surveys")) {
                        n = GS.user.isIdle();
                        !(GS.user.isLoggedIn ? !GS.user.settings.emailNotifications.civicScience : GS.store.get("civicscience.optOut")) && !n && m.session.getNextUnansweredQuestion(m.askQuestion)
                    }
                },
                h))
    }, changeCivicScienceSettings:function (m) {
        if (m)if (GS.user.isLoggedIn)GS.user.settings.changeNotificationSettings({civicScience:false}, function () {
            c.publish("gs.notification", {type:"notice", message:c.localize.getString("SURVEY_CIVICSCIENCE_OPTOUT")});
            GS.getGuts().logEvent("civicscience.optOut", {userID:GS.user.UserID, timestamp:(new Date).getTime()})
        }); else {
            GS.store.set("civicscience.optOut", true);
            c.publish("gs.notification", {type:"notice", message:c.localize.getString("SURVEY_CIVICSCIENCE_OPTOUT")});
            GS.getGuts().logEvent("civicscience.optOut", {userID:GS.user.UserID, timestamp:(new Date).getTime()})
        }
    }, userHasKinesis:function () {
        return GS.user.Flags & GS.Models.User.FLAG_KINESIS
    }, changeKinesisFlag:function (m) {
        GS.user.Flags = m ? GS.user.Flags ^ GS.Models.User.FLAG_KINESIS : GS.user.Flags | GS.Models.User.FLAG_KINESIS
    }, setupAvailableNotif:function (m) {
        if (b && GS.user.isLoggedIn && GS.Models.Surveys.userHasKinesis() && !GS.store.get("kinesis.notifications" + GS.user.UserID))k || (k = setTimeout(this.callback(function () {
            if (GS.Models.Surveys.userHasKinesis() &&
                    !GS.user.isIdle()) {
                if (GS.user.surveys && GS.user.surveys.availableSurveys && GS.user.surveys.completedSurveys)return;
                GS.Models.Surveys.initKinesis("notif", GS.Models.Surveys.displaySurveyAvailableNotif)
            }
            k = null
        }), m))
    }, displaySurveyAvailableNotif:function (m) {
        var h = GS.store.get("kinesis.seenSurveysNotifLast" + GS.user.UserID);
        if (!((new Date).getTime() - h < 864E5)) {
            var n = GS.store.get("kinesis.seenSurveysV2" + GS.user.UserID);
            m.getAvailableSurveys("all", function (q) {
                if (q.success) {
                    m.availableSurveys = q.surveys;
                    m.getAllProfileSurveysStatus(function () {
                        var s =
                                m.availableSurveys, w = [], o = false;
                        if (n)for (var u = 0; u < s.length; u++) {
                            o = false;
                            for (var z = 0; z < n.length; z++)if (s[u].projectid == n[z]) {
                                o = true;
                                break
                            }
                            o || w.push(s[u])
                        } else w = s;
                        w.length && m.getCompletedSurveys("all", function (D) {
                            if (D.success) {
                                m.completedSurveys = D.surveys;
                                D = m.completedSurveys;
                                temp = w;
                                w = [];
                                for (var B = 0; B < temp.length; B++) {
                                    o = false;
                                    for (var E = 0; E < D.length; E++)if (temp[B].projectid == D[E].projectid) {
                                        o = true;
                                        break
                                    }
                                    o || w.push(temp[B])
                                }
                                if (w.length) {
                                    w.sort(function (F, y) {
                                        return y.points - F.points
                                    });
                                    GS.getNotice().displaySurveyAvailable(w[0].points);
                                    GS.getGuts().logEvent("surveysAvailableNotif", {points:w[0].points});
                                    GS.store.set("kinesis.seenSurveysNotifLast" + GS.user.UserID, (new Date).getTime())
                                }
                            }
                        })
                    })
                }
            })
        }
    }, removeKinesisFromUser:function (m, h) {
        GS.service.removeKinesisFromUser(m, h)
    }, addKinesisToUser:function (m, h) {
        GS.service.addKinesisToUser(m, h)
    }, _addKinesisToUser:function (m, h) {
        GS.service.addKinesisToUser(this.callback("createPanelistCallback", m, h), this.callback("createPanelistErrback"))
    }, getKinesisUserPassword:function (m, h) {
        GS.service.getKinesisUserPassword(m,
                h)
    }, _getKinesisUserPasswordCallback:function (m, h) {
        m.password = h;
        m.username = GS.user.UserID + "@gsuser.com";
        GS.Models.Surveys.loginPanelist(m.username, m.password, this.callback("_loginPanelistCallback", m), this.callback("_loginPanelistErrback", m))
    }, _getKinesisUserPasswordErrback:function (m) {
        GS.Models.Surveys.wrapSurveysObject(m)
    }, initKinesis:function (m, h) {
        var n = GS.Models.Surveys.createPanelistObject(m);
        n.finalCallback = h;
        GS.user.isLoggedIn && n.hasKinesis ? GS.Models.Surveys.getKinesisUserPassword(this.callback("_getKinesisUserPasswordCallback",
                n), this.callback("_getKinesisUserPasswordErrback", n)) : GS.Models.Surveys.wrapSurveysObject(n)
    }, createPanelistObject:function (m) {
        var h = {};
        m = _.orEqual(m, "login");
        h.hasKinesis = GS.Models.Surveys.userHasKinesis();
        h.panelistid = null;
        h.seskey = null;
        h.availableSurveys = [];
        h.completedSurveys = [];
        h.finalCallback = null;
        h.from = m;
        return h
    }, loginPanelist:function (m, h, n, q) {
        a("portal.auth.login", {panelid:GS.Models.Surveys.panelID, portalid:"1", username:m, password:h}, n, q)
    }, _loginPanelistCallback:function (m, h) {
        if (h.seskey) {
            m.seskey =
                    h.seskey;
            m.panelistid = h.panelistid;
            GS.Models.Surveys.wrapSurveysObject(m)
        } else this._loginPanelistErrback(m, h)
    }, _loginPanelistErrback:function (m, h) {
        if (h.errno == 40010) {
            m.from = "create";
            GS.Models.Surveys.initCreateRoute(m, this.callback("createConfirm", m), this.callback("createPanelistErrback", m))
        } else {
            var n = m.finalCallback || h.originalCallback;
            m = this.createPanelistObject("login");
            m.finalCallback = n;
            GS.Models.Surveys.wrapSurveysObject(m)
        }
    }, initCreateRoute:function (m, h, n) {
        m = _.orEqual(m, GS.Models.Surveys.createPanelistObject("create"));
        GS.Models.Surveys.createPanelist(m, h, n)
    }, createPanelist:function (m, h, n) {
        var q = GS.user.Sex;
        q = q == "M" ? 1 : q == "F" ? 2 : null;
        a("portal.panelist.create", {panelid:GS.Models.Surveys.panelID, datapoints:[
            {label:"email", answer:m.username},
            {label:"password", answer:m.password},
            {label:"gender", answer:q},
            {label:"zip", answer:GS.user.Zip},
            {label:"dma", answer:gsConfig.country.DMA},
            {label:"dob", answer:GS.user.TSDOB}
        ]}, h, n)
    }, createConfirm:function (m, h) {
        a("portal.panelist.confirm", {panelid:GS.Models.Surveys.panelID, panelistid:h.panelistid,
            verification:h.verification}, this.callback("_addKinesisToUser", m), this.callback("createPanelistErrback"))
    }, createPanelistCallback:function (m, h) {
        if (h.seskey) {
            m.seskey = h.seskey;
            m.panelistid = h.panelistid;
            GS.Models.Surveys.wrapSurveysObject(m)
        } else h.success ? GS.Models.Surveys.loginPanelist(m.username, m.password, this.callback("_loginPanelistCallback", m), this.callback("_loginPanelistErrback", m)) : this.createPanelistErrback(m, h)
    }, createPanelistErrback:function (m, h) {
        GS.Models.Surveys.publishGeneralError(h);
        m && c.isFunction(m.finalCallback) && m.finalCallback(m)
    }, wrapSurveysObject:function (m) {
        GS.user.surveys = GS.Models.Surveys.wrap(m)
    }, publishGeneralError:function (m) {
        c.publish("gs.notification", {type:"error", message:"Oops! Something went wrong. Please <a href='http://help.grooveshark.com/customer/portal/topics/31006-surveys/articles' target='_blank'>contact our friendly support team </a> with the error number " + m.errno + " for assistance."})
    }}, {seskey:null, username:null, password:null, panelistid:null, from:null,
        hasKinesis:false, availableSurveys:[], completedSurveys:[], profiles:[], init:function (m) {
            this._super(m);
            this.hasKinesis = m.hasKinesis;
            this.seskey = m.seskey;
            this.from = m.from;
            this.username = m.username;
            this.password = m.password;
            this.panelistid = m.panelistid;
            this.profiles = _.orEqual(m.profiles, []);
            this.availableSurveys = _.orEqual(m.availableSurveys, []);
            this.completedSurveys = _.orEqual(m.completedSurveys, []);
            c.isFunction(m.finalCallback) && m.finalCallback(this)
        }, handleInvalidSession:function (m, h, n, q, s) {
            if (s.errno ==
                    30100 && h.seskey)GS.Models.Surveys.loginPanelist(this.username, this.password, this.callback(function (w) {
                if (w.seskey) {
                    this.seskey = w.seskey;
                    this.panelistID = w.panelistid;
                    h.seskey = w.seskey;
                    a(m, h, n, q)
                } else c.isFunction(q) && q()
            }), q); else c.isFunction(q) && q(s)
        }, logoutPanelist:function (m, h) {
            a("portal.auth.logout", {seskey:this.seskey}, m, h)
        }, updatePanelist:function (m, h, n) {
            m = {seskey:this.seskey, datapoints:m};
            a("portal.panelist.update", m, h, this.callback("handleInvalidSession", "portal.panelist.update", m, h, n))
        },
        validateSeskey:function (m, h) {
            a("portal.auth.validate", {seskey:this.seskey}, m, h)
        }, getPanelistInfo:function (m, h, n) {
            m = {seskey:this.seskey, datapoints:m};
            a("portal.panelist.read", m, h, this.callback("handleInvalidSession", "portal.panelist.read", m, h, n))
        }, getAvailableSurveys:function (m, h, n) {
            m = {seskey:this.seskey, limit:m};
            a("portal.survey.available", m, h, this.callback("handleInvalidSession", "portal.survey.available", m, h, n))
        }, getCompletedSurveys:function (m, h, n) {
            m = {seskey:this.seskey, limit:m};
            a("portal.survey.completed",
                    m, h, this.callback("handleInvalidSession", "portal.survey.completed", m, h, n))
        }, getAllSurveys:function (m, h, n) {
            h = _.orEqual(h, 5);
            --h > 0 && c.isFunction(n) ? this.getAvailableSurveys("all", this.callback(function (q) {
                this.availableSurveys = c.isArray(q.surveys) ? q.surveys : [];
                this.getCompletedSurveys("all", this.callback(function (s) {
                    this.completedSurveys = c.isArray(s.surveys) ? s.surveys : [];
                    this.availableSurveys.length + this.completedSurveys.length == 0 ? setTimeout(this.callback(function () {
                        this.getAllSurveys("all", h, n)
                    }),
                            3E3) : n(this)
                }))
            })) : n(this)
        }, getAllProfileSurveysStatus:function (m, h) {
            this.profiles = [];
            this.getPanelistInfo(["profile1", "profile2", "profile3", "profile4", "profile5", "profile6", "profile7", "profile8", "profile9", "profile10", "profile11", "profile12", "profile13", "profile14", "profile15"], this.callback(function (n) {
                if (n.success)for (var q = 0; q < n.values.length; q++) {
                    var s = n.values[q].label;
                    s = s.length == 8 ? s.substring(7, 8) : s.substring(7, 9);
                    if (n.values[q].answer) {
                        for (var w = [], o = 0; o < this.availableSurveys.length; o++)if (this.availableSurveys[o].subject.substring(0,
                                15) !== "Profile Survey:")w.push(this.availableSurveys[o]); else {
                            var u;
                            if (this.availableSurveys[o].body.length == 22)u = this.availableSurveys[o].body.substring(20, 21); else if (this.availableSurveys[o].body.length == 23)u = this.availableSurveys[o].body.substring(20, 22);
                            u === s ? this.profiles.push(this.availableSurveys[o]) : w.push(this.availableSurveys[o])
                        }
                        this.availableSurveys = w
                    }
                }
                m()
            }), h)
        }, getEverything:function (m) {
            this.getAvailableSurveys("all", this.callback(function (h) {
                this.availableSurveys = c.isArray(h.surveys) ?
                        h.surveys : [];
                this.getAllProfileSurveysStatus(this.callback(function () {
                    this.getCompletedSurveys("all", this.callback(function (n) {
                        this.completedSurveys = c.isArray(n.surveys) ? n.surveys : [];
                        if (c.isFunction(m))this.availableSurveys.length + this.completedSurveys.length == 0 && this.from == "create" ? this.getAllSurveys("all", 24, m) : m(this)
                    }))
                }))
            }))
        }})
})(jQuery);

