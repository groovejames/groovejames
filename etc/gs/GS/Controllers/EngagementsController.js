(function () {
    function c(q, s, w) {
        w = _.orEqual(w, "tollbooth");
        GS.getEngagements().getPlacementVideos(w, function (o) {
            if (o && o.length && o[0]) {
                n = {type:"v11", data:o[0]};
                s && s(o[0])
            } else {
                n = {type:"dfp", data:q};
                s && s(q)
            }
        })
    }

    function a(q, s) {
        GS.getEngagements().getPlacementActivities("tollbooth", function (w) {
            if (w && w.length && w[0]) {
                n = {type:"socialvibe", data:{height:w[0].window_height, width:w[0].window_width}, activity:w[0]};
                s && s(w[0])
            } else {
                n = {type:"dfp", data:q};
                s && s(q)
            }
        })
    }

    function b(q, s, w, o) {
        return d(q, s, w, o, true, true, "interactionLB")
    }

    function d(q, s, w, o, u, z, D) {
        z = _.orEqual(z, false);
        if (!u && (gsConfig.country.ID == 48 || gsConfig.country.ID == 45 || gsConfig.country.ID == 223)) {
            o = true;
            if (gsConfig.country.ID != 223)z = true
        }
        var B = GS.store.get("videoFromDFPCount");
        B || (B = 0);
        if (u)B = 3;
        if (B >= 2 && !w && !o)if (z || $("#mainContainer").width() < 1020 || $("#mainContainer").height() < 610)c(s, q, D); else GS.store.get("GS.user.paywall.preferredFree") === "socialvibe" ? a(s, q) : c(s, q, D); else if (B >= 2 && !w && !z && $("#mainContainer").width() >= 1020 && $("#mainContainer").height() >= 610)a(s,
                q); else {
            w && GS.getGuts().forceLogEvent("adBlockerDetected", {fromVideo:true});
            n = {type:"dfp", data:s};
            q && q(s)
        }
    }

    function f(q, s) {
        GS.player.recordEngagement(q, s);
        setTimeout(function () {
            $("#preloadEngagementFailedIframe").remove()
        }, 0)
    }

    function g(q) {
        var s = q ? q.id : Math.ceil(Math.random() * 1E4), w = GS.user.UserID;
        if (w < 1)w = GS.service.sessionID;
        window.adCallback = function (o, u, z) {
            if (z == w && u && u.length) {
                f(o, u);
                delete window.adCallback
            }
        };
        if (!q)return[w, s];
        return["", ""]
    }

    var k = {interactionLB:{id:"89099aa1c37d6b1a4607225be0d931ca",
        maxLength:120, limit:1}, tollbooth:{id:"0513bbc13de156ddf22f311b174d4da5", maxLength:150, limit:1}}, m = {partner_config_hash:"6c5673a47e1ef5525c824f330ffa029f4dd70a49"}, h = null, n;
    GS.Controllers.BaseController.extend("GS.Controllers.EngagementsController", {isGSSingleton:true}, {JSON_ENDPOINT:"http://b.v11media.com/json/3.0", cache:{}, socialVibeLoadedCallback:null, init:function () {
        this._super();
        this.subscribe("gs.auth.update", function () {
            h = null
        })
    }, preloadEngagement:function (q) {
        $("#mainContainer").width() >= 1020 &&
                $("#mainContainer").height() >= 610 && GS.store.get("GS.user.paywall.preferredFree") === "socialvibe" && GS.getEngagements().getSocialVibe(function () {
        });
        this.loadVideoAdFromDFP(this.callback(d, q))
    }, showInterruptLightbox:function (q) {
        if (n && n.data) {
            GS.getLightbox().close("interactionTime");
            GS.getLightbox().open("interruptListen", {notCloseable:true})
        } else if (q) {
            q = g(null);
            $(document.body).append('<iframe id="preloadEngagementFailedIframe" src="/v11callback.php?empty=1&uid=' + q[0] + "&vid=" + q[1] + '" scrolling="no" frameBorder="0" style="height: 1px; width: 1px; position: absolute; top: -2px; left: -2px; display: block;"></iframe>');
            GS.getGuts().forceLogEvent("noVideoAvailableAtAllForPaywall", {fromDFP:true})
        } else this.preloadEngagement(this.callback("showInterruptLightbox", true))
    }, getPendingEngagement:function (q) {
        q(n);
        n = null
    }, getInteractionEngagement:function (q) {
        this.loadVideoAdFromDFP(this.callback(b, q))
    }, getGender:function () {
        if (GS.user.Sex)return GS.user.Sex.toLowerCase();
        var q = GS.store ? GS.store.get("adhelper") : null;
        if (q)if (q.hasOwnProperty("gender")) {
            var s = false;
            if (q.gender == 1536)s = "m"; else if (q.gender == 1537)s = "f";
            if (s)return s
        }
        if (q =
                GS.store ? GS.store.get("webvisit") : null)if (q.hasOwnProperty("sidebar")) {
            q = q.sidebar;
            for (s = 0; s < q.length; s++)if (q[s].substring(0, 2) == "1=")return q[s] == "1=0" ? "m" : "f"
        }
        return false
    }, getAge:function (q) {
        if (GS.user.TSDOB) {
            var s = GS.user.TSDOB.split("-");
            s = new Date(s[0], s[1] - 1, s[2]);
            dateDiff = +new Date - +s;
            ageDays = dateDiff / 864E5;
            return s = Math.floor(ageDays / 365.24)
        }
        if (q)return null;
        if (q = GS.store ? GS.store.get("adhelper") : null) {
            if (q.hasOwnProperty("ageRange")) {
                s = 0;
                switch (q.ageRange) {
                    case 29516:
                        s = 15;
                        break;
                    case 29517:
                        s =
                                20;
                        break;
                    case 30024:
                        s = 27;
                        break;
                    case 30025:
                        s = 32;
                        break;
                    case 29520:
                        s = 40;
                        break;
                    case 29521:
                        s = 50;
                        break;
                    case 29522:
                        s = 65;
                        break;
                    case 29523:
                        s = 72;
                        break
                }
            }
            if (s)return s
        }
        if (q = GS.store ? GS.store.get("webvisit") : null)if (q.hasOwnProperty("sidebar")) {
            q = q.sidebar;
            for (var w = 0; w < q.length; w++)if (q[w].substring(0, 2) == "10") {
                switch (q[w]) {
                    case "10=1":
                        s = 15;
                        break;
                    case "10=2":
                        s = 21;
                        break;
                    case "10=3":
                        s = 30;
                        break;
                    case "10=4":
                        s = 42;
                        break;
                    case "10=5":
                        s = 60;
                        break
                }
                if (s)return s
            }
        }
        return null
    }, getDOB:function () {
        if (GS.user.TSDOB)return GS.user.TSDOB;
        var q = GS.store ? GS.store.get("adhelper") : null;
        if (q) {
            if (q.hasOwnProperty("ageRange")) {
                var s = 0;
                switch (q.ageRange) {
                    case 29516:
                        s = Math.floor(Math.random() * 4 + 13);
                        break;
                    case 29517:
                        s = Math.floor(Math.random() * 6 + 18);
                        break;
                    case 30024:
                        s = Math.floor(Math.random() * 4 + 25);
                        break;
                    case 30025:
                        s = Math.floor(Math.random() * 4 + 30);
                        break;
                    case 29520:
                        s = Math.floor(Math.random() * 9 + 35);
                        break;
                    case 29521:
                        s = Math.floor(Math.random() * 9 + 45);
                        break;
                    case 29522:
                        s = Math.floor(Math.random() * 9 + 64);
                        break;
                    case 29523:
                        s = Math.floor(Math.random() * 15 +
                                65);
                        break
                }
            }
            if (s) {
                s = (new Date).getYear() - s;
                return s + "-01-01"
            }
        }
        if (q = GS.store ? GS.store.get("webvisit") : null)if (q.hasOwnProperty("sidebar")) {
            q = q.sidebar;
            for (var w = 0; w < q.length; w++)if (q[w].substring(0, 2) == "10") {
                switch (q[w]) {
                    case "10=1":
                        s = Math.floor(Math.random() * 4 + 13);
                        break;
                    case "10=2":
                        s = Math.floor(Math.random() * 6 + 18);
                        break;
                    case "10=3":
                        s = Math.floor(Math.random() * 9 + 25);
                        break;
                    case "10=4":
                        s = Math.floor(Math.random() * 14 + 35);
                        break;
                    case "10=5":
                        s = Math.floor(Math.random() * 30 + 50);
                        break
                }
                if (s) {
                    s = (new Date).getYear() -
                            s;
                    return s + "-01-01"
                }
            }
        }
        return false
    }, getPlacementVideos:function (q, s, w) {
        if (k[q]) {
            var o = k[q], u = this.JSON_ENDPOINT + "?k=" + o.id;
            u += "&ua=" + encodeURIComponent(navigator.userAgent);
            var z = this.getDOB();
            if (z)u += "&dob=" + z;
            if (z = this.getGender())u += "&gender=" + z;
            u += "&ip=" + gsConfig.remoteAddr;
            u += GS.user.UserID > 0 ? "&uid=" + GS.user.UserID : "&uid=" + GS.service.sessionID;
            var D = this.callback("onVideos", s, o, q), B = function () {
                $.ajax({url:u, dataType:"jsonp", timeout:5E3, success:D, error:D})
            };
            w ? this.testForVideoBlocker(this.callback(function (E) {
                if (E)$.isFunction(s) &&
                s([]); else B()
            })) : B()
        }
    }, onVideos:function (q, s, w, o) {
        s = this.filterVideos(o, s);
        $.isFunction(q) && q(s)
    }, filterVideos:function (q, s) {
        if (!q || !q.length)return[];
        var w = 0;
        if (s.maxLength)w = s.maxLength;
        for (var o = [], u = null, z = 0, D = q.length; z < D; z++) {
            if (s.limit && s.limit <= o.length)break;
            if (!(w && q[z].length > w))if (q[z].height && q[z].width) {
                if (q[z].gender) {
                    if (u === null)u = this.getGender();
                    if (q[z].gender.toLowerCase() != u)continue
                }
                if (q[z].length)q[z].minsSecs = _.millisToMinutesSeconds(q[z].length * 1E3);
                o.push(q[z])
            }
        }
        return o
    },
        videoBlockerDetected:null, testForVideoBlocker:function (q) {
            this.videoBlockerDetected !== null && q(this.videoBlockerDetected);
            $.browser.chrome ? $.ajax({url:"http://ad.doubleclick.net/pfadx/grooveshark.wall/;dcmt=text/json", dataType:"json", timeout:500, success:this.callback(function () {
                this.videoBlockerResult(q, false)
            }), error:this.callback(function () {
                this.videoBlockerResult(q, true)
            })}) : GS.service.suggestFlattr(["http://ad.doubleclick.net/ad/pixel"], 5, true, this.callback("videoBlockerResult", q), this.callback("videoBlockerResult",
                    q))
        }, videoBlockerResult:function (q, s) {
            this.videoBlockerDetected = s;
            q(s)
        }, loadVideoAdFromDFP:function (q) {
            var s = GS.getAd().buildParams(["dcmt=text/json", "sz=777x777"], ";", ";");
            GS.service.getVideoFromDFP(s, this.callback("onVideoFromDFP", q, false), this.callback("onVideoFromDFPError", q))
        }, onVideoFromDFPError:function (q) {
            this.onVideoFromDFP(q, true, null)
        }, onVideoFromDFP:function (q, s, w) {
            var o = {};
            if (w)try {
                o = JSON.parse(w)
            } catch (u) {
                o = null
            }
            if (!o || !o.VideoID)q(null, s, false); else {
                if (!o.length)o.length = 10;
                if (!o.width)o.width =
                        560;
                if (!o.height)o.height = 315;
                if (o.autoplay !== true)o.autoplay = false;
                if (o.forceServe !== true)o.forceServe = false;
                o.load = this.callback(function (z, D, B, E, F) {
                    var y = this.callback("loadDFPStateTracking", o, o.tracking, "videowallVideoImpression", function () {
                        GS.store.set("sawHouseVideoAd:" + GS.user.UserID + ":" + o.VideoID, (new Date).getTime());
                        D && D()
                    });
                    GS.getYoutube().embedYoutubeAd(z, o.VideoID, o.width, o.height, y, o.length, this.callback("loadDFPStateTracking", o, o.on30Tracking, "videowallVideoWatched", E), this.callback("loadDFPStateTracking",
                            o, o.onCompleteTracking, "videowallVideoCompleted", null), B, F, o.autoplay)
                });
                q(o, s, o.forceServe)
            }
        }, loadDFPStateTracking:function (q, s, w, o) {
            $.isArray(s) && s.length && GS.theme.loadTracking(s);
            o && o();
            this.logGutsPoint(q, w)
        }, logGutsPoint:function (q, s, w) {
            GS.getGuts().forceLogEvent(s, {videoID:q.VideoID, videoLength:q.length});
            w && w()
        }, getSocialVibe:function (q) {
            if (window.socialvibe)$.isFunction(q) && q(window.socialvibe); else {
                this.socialVibeLoadedCallback = q;
                var s = null, w = this, o = document.getElementById("socialVibe-root"),
                        u = (new Date).getTime(), z = function () {
                            var D = $("#socialVibe-client-js");
                            if (D.length > 0) {
                                if (u - D.data("init-time") < 2500)return;
                                D.remove()
                            }
                            D = document.createElement("script");
                            D.id = "socialVibe-client-js";
                            D.async = true;
                            D.src = document.location.protocol + "//static.socialvi.be/js/socialvibe.client.js";
                            D.onload = D.onreadystatechange = function () {
                                if ($.browser.msie && this.readyState) {
                                    if (this.readyState === "complete" || this.readyState === "loaded") {
                                        this.onload = this.onreadystatechange = null;
                                        $.isFunction(w.socialVibeLoadedCallback) &&
                                        setTimeout(function () {
                                            w.socialVibeLoadedCallback(window.socialvibe)
                                        }, 10);
                                        clearTimeout(s)
                                    }
                                } else {
                                    this.onload = this.onreadystatechange = null;
                                    $.isFunction(w.socialVibeLoadedCallback) && setTimeout(function () {
                                        w.socialVibeLoadedCallback(window.socialvibe);
                                        clearTimeout(s)
                                    }, 10);
                                    clearTimeout(s)
                                }
                            };
                            s && clearTimeout(s);
                            s = setTimeout(function () {
                                !window.socialvibe && $.isFunction(w.socialVibeLoadedCallback) && w.socialVibeLoadedCallback(null)
                            }, 2500);
                            $(D).data("init-time", u);
                            o.appendChild(D)
                        };
                if (typeof window.easyXDM === "object")z();
                else {
                    q = $("#easyXDM-js");
                    if (q.length > 0) {
                        if (u - q.data("init-time") < 2500)return;
                        q.remove()
                    }
                    q = document.createElement("script");
                    q.id = "easyXDM-js";
                    q.async = true;
                    q.src = document.location.protocol + "//static.socialvi.be/js/easyXDM.min.js";
                    q.onload = q.onreadystatechange = function () {
                        if ($.browser.msie && this.readyState) {
                            if (this.readyState === "complete" || this.readyState === "loaded") {
                                this.onload = this.onreadystatechange = null;
                                setTimeout(function () {
                                    z()
                                }, 10)
                            }
                        } else {
                            this.onload = this.onreadystatechange = null;
                            setTimeout(function () {
                                        z()
                                    },
                                    10)
                        }
                    };
                    $(q).data("init-time", u);
                    o.appendChild(q);
                    s = setTimeout(function () {
                        !window.easyXDM && $.isFunction(w.socialVibeLoadedCallback) && w.socialVibeLoadedCallback(null)
                    }, 2500)
                }
            }
        }, getPlacementActivities:function (q, s, w) {
            if (q = this.getAge())m.age = q;
            if (q = this.getGender())m.gender = q;
            m.network_user_id = GS.user.UserID > 0 ? GS.user.UserID + "" : GS.service.sessionID;
            var o = this.callback(function (u) {
                try {
                    u.requestActivities(this.callback("onActivity", s, w, u))
                } catch (z) {
                    this.onActivity(s, w, u, [])
                }
            });
            h ? o(h) : this.getSocialVibe(this.callback(function (u) {
                if (u)u.client(m,
                        this.callback(function (z) {
                            h = z;
                            o(h)
                        })); else $.isFunction(s) && s([])
            }))
        }, onActivity:function (q, s, w, o) {
            o = this.filterActivities(o, s, w);
            $.isFunction(q) && q(o)
        }, filterActivities:function (q, s, w) {
            if (!q || !q.length)return[];
            for (var o = [], u = 0, z = q.length; u < z; u++) {
                q[u].type = "activity";
                s && $.isFunction(s.onCredit) && q[u].onCredit(s.onCredit);
                s && $.isFunction(s.onStart) && q[u].onStart(s.onStart);
                s && $.isFunction(s.onFinish) && q[u].onFinish(s.onFinish);
                q[u].loadIntoContainer = function (D) {
                    w.loadActivityIntoContainer(this, D)
                };
                o.push(q[u])
            }
            return o
        }})
})();

