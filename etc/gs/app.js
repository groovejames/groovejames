// app.js?20120521.54

(function (c) {
    function a(s) {
        s = s.replace("#!/", "");
        var w = c("<img />");
        w.load(function () {
            w.remove()
        }).error(function () {
                    w.remove()
                });
        w.attr("src", "http://t.fuziontech.net/tp/landing.gif?p=" + s + "&r=" + (new Date).valueOf() + Math.floor(Math.random() * 10)).appendTo("body")
    }

    function b(s, w) {
        if (_.defined(s.inviteCode)) {
            gsConfig.inviteCode = s.inviteCode;
            var o = (new Date).valueOf() + 12096E5;
            try {
                GS.store.set("lastInviteCode", {inviteCode:s.inviteCode, expires:o})
            } catch (u) {
            }
        }
        if (s.hasOwnProperty("password")) {
            o = {};
            if (s.hasOwnProperty("code"))o.resetCode =
                    s.code;
            GS.getLightbox().open("forget", o)
        }
        s.hasOwnProperty("invite") && GS.getLightbox().open("invite");
        s.hasOwnProperty("signup") && GS.getLightbox().open("signup");
        if (s.hasOwnProperty("login"))if (!GS.user || !GS.user.isLoggedIn)w ? GS.getLightbox().open("login", {callback:function () {
            setTimeout(function () {
                GS.router.setHash(w)
            }, 0)
        }}) : GS.getLightbox().open("login");
        if (s.hasOwnProperty("testAds"))GS.getAd().useTestAds = true;
        if (s.hasOwnProperty("flattrbeta"))window.flattrTesting = true;
        s.hasOwnProperty("unsubscribeClearvoiceEmail") &&
        GS.getLightbox().open("surveyResult", {gsResult:-999, ResultCode:"Unsub"});
        s.hasOwnProperty("activateClearvoiceEmail") && GS.getLightbox().open("surveyResult", {gsResult:-999, ResultCode:"Activate"});
        if (s.hasOwnProperty("measurePerformance")) {
            var z = false, D = function () {
                if (c("#grid ul.options").length) {
                    top.hasLoaded("search");
                    GS.player.addSongsToQueueAt([c("#grid ul.options:first").attr("rel")], -1, true);
                    setTimeout(B, 1)
                } else setTimeout(D, 1)
            }, B = function () {
                if (GS.player.isPlaying && !GS.player.isLoading && !z) {
                    z =
                            true;
                    top.hasLoaded("play")
                } else setTimeout(B, 1)
            };
            if (window.top && window != top && c.isFunction(top.hasLoaded)) {
                top.hasLoaded("page");
                setTimeout(D, 1);
                GS.router.setHash("/search?q=eminem")
            }
        }
    }

    function d(s, w) {
        extraGutsParams = _.orEqual(w, false);
        var o = _.defined(s.search), u = _.defined(s.notFound), z = {identifier:null, params:s};
        n = z;
        h = "home";
        GS.router.page.getPageClass(h).then(function (D) {
            if (h === "home" && n === z)if (u) {
                GS.router.page.activate(D, z).notFound();
                GS.getGuts().handlePageLoad("notFound", s)
            } else {
                GS.router.page.activate(D,
                        z).index(o);
                GS.getGuts().handlePageLoad("home", w ? parse : {})
            }
        })
    }

    function f(s) {
        var w = new m(s.splat, "login", "id", "section", "subpage", "objType"), o, u;
        if (w.section == "playlists") {
            w.objType = w.subpage;
            w.subpage = w.section;
            w.section = "music";
            w.length = w.objType ? 5 : 4
        }
        if (w.section == "music") {
            h = "user_music";
            n = o = {identifier:w.id, params:w};
            GS.router.page.getPageClass(h).then(function (z) {
                if (h === "user_music" && n === o) {
                    u = GS.router.page.activate(z, o);
                    switch (w.length) {
                        case 3:
                            u.index(w.id, "");
                            break;
                        case 4:
                            u[w.subpage](w.id);
                            break;
                        case 5:
                            u[w.subpage](w.id, w.objType);
                            break;
                        default:
                            GS.router.notFound()
                    }
                    GS.getGuts().handlePageLoad("user", w)
                }
            })
        } else {
            h = "user";
            n = o = {identifier:w.id, params:w};
            GS.router.page.getPageClass(h).then(function (z) {
                if (h === "user" && n === o) {
                    u = GS.router.page.activate(z, o);
                    switch (w.length) {
                        case 2:
                            u.index(w.id);
                            break;
                        case 3:
                            u[w.section](w.id, "");
                            break;
                        case 4:
                            u[w.section](w.id, w.subpage);
                            break;
                        default:
                            GS.router.notFound()
                    }
                    GS.getGuts().handlePageLoad("user", w)
                }
            })
        }
    }

    function g(s) {
        var w = s.splat.shift(), o = new m(s.splat,
                "name", "id", "subpage"), u, z;
        h = w;
        n = u = {identifier:o.id};
        GS.router.page.getPageClass(h).then(function (D) {
            if (h === w && n === u) {
                z = GS.router.page.activate(D, u);
                switch (o.length) {
                    case 2:
                    case 3:
                        z.index(o.id, o.subpage, s.play);
                        break;
                    default:
                        this.notFound()
                }
                GS.getGuts().handlePageLoad(w, o)
            }
        })
    }

    function k(s, w) {
        var o = s.indexOf("/");
        return o !== -1 ? s.substring(0, o) + "/" + w + s.substring(o) : s + "/" + w
    }

    function m() {
        var s = c.makeArray(arguments), w = s.shift()[0], o = this;
        if (_.isEmpty(w))o.length = 0; else {
            w = w.replace(/\/$/, "").split("/");
            o.length = w.length;
            var u;
            _.forEach(w, function (z, D) {
                u = s[D];
                o[u] = z
            })
        }
    }

    if (typeof window._comscore != "object")window._comscore = [];
    GS.router = new (function () {
        function s(o) {
            var u = o.indexOf("#");
            if (u != -1)return o.indexOf("#!") !== u ? "#!" + o.substring(u + 1) : o.substring(u);
            u = o.indexOf("/");
            return u !== 0 ? "#!/" + o : "#!" + o
        }

        var w = this;
        this._routes = [];
        this._history = [];
        this._nextHashShift = this._historyIndex = 0;
        this._pageNameCache = {};
        this.hasForward = this.hasBack = false;
        this.setHash = function (o) {
            o = s(o);
            window.location.hash = o
        };
        this.replaceHash = function (o) {
            o = s(o);
            window.location.replace(window.location.protocol + "//" + window.location.hostname + "/" + o)
        };
        this.get = function (o, u, z) {
            z = _.orEqual(z, this);
            if (!(o instanceof RegExp) && !_.isString(o))console.error("invalid route, must be String or RegExp"); else {
                if (_.isString(o))o = RegExp("^" + o + "$");
                this._routes.push({path:o, callback:u, context:z})
            }
        };
        this.notFound = function () {
            this.replaceHash("notFound")
        };
        this.back = function () {
            this.navHistory(-1)
        };
        this.forward = function () {
            this.navHistory(1)
        };
        this.navHistory = function (o) {
            var u = this._historyIndex + o;
            if (u >= 0 && u < this._history.length) {
                this._nextHashShift = o;
                this.setHash(this._history[u])
            }
        };
        this.performSearch = function (o, u) {
            u = u.toString();
            if (u.indexOf("http://") === 0 && u.indexOf("tinysong") == -1) {
                u = u.substring(7);
                this.setHash(u)
            } else {
                o = o.toLowerCase();
                u = encodeURIComponent(u);
                u = u.replace(/%20/g, "+");
                o ? this.setHash("/search/" + o + "?q=" + u) : this.setHash("/search?q=" + u)
            }
        };
        this.cachePageName = function (o, u, z) {
            this._pageNameCache[o] = {type:u, id:z}
        };
        this.deleteCachedPageName =
                function (o) {
                    this._pageNameCache.hasOwnProperty(o) && delete this._pageNameCache[o]
                };
        this.run = function () {
            this.page = GS.Controllers.PageController;
            this.before = this.page.checkLock;
            c(window).hashchange(function () {
                var o = location.hash;
                if (o && o.length)o = location.href.substring(location.href.indexOf("#"));
                w._onHashChange(o)
            });
            c(window).trigger("hashchange")
        };
        this._onHashChange = function (o) {
            if (c.isFunction(this.before))if (!this.before())return;
            window._gaq && _gaq.push && _gaq.push(["_trackPageview", o]);
            var u = {c1:2,
                c2:"8187464", c4:(location.protocol + "//" + location.host + "/" + o).replace("#!/", "")};
            window.COMSCORE && COMSCORE.beacon ? COMSCORE.beacon(u) : window._comscore.push(u);
            a(o);
            if (this._nextHashShift !== 0) {
                u = this._historyIndex + this._nextHashShift;
                if (u >= 0 && u < this._history.length && this._history[u] == o)this._historyIndex = u; else this._nextHashShift = 0
            }
            if (this._nextHashShift === 0) {
                this._history = this._history.slice(0, this._historyIndex + 1);
                o && this._history.push(o);
                this._historyIndex = this._history.length - 1
            }
            this._nextHashShift =
                    0;
            u = this._parseQueryString(o);
            o = o.replace(q, "");
            var z = this._getRouteForPath(o);
            if (z) {
                var D = o.match(z.path);
                D.shift();
                u.splat = D;
                if (c.isFunction(z.callback)) {
                    z.callback.call(z.context, u);
                    b(u, o)
                }
                this.hasBack = this._history.length && this._historyIndex > 0;
                this.hasForward = this._history.length && this._historyIndex < this._history.length - 1;
                c.publish("gs.router.history.change")
            } else this.notFound()
        };
        this._getRouteForPath = function (o) {
            var u, z, D;
            z = 0;
            for (D = this._routes.length; z < D; z++)if (this._routes[z].path.test(o)) {
                u =
                        this._routes[z];
                break
            }
            return u
        };
        this._parseQueryString = function (o) {
            var u = {}, z = /\+/g, D, B, E;
            if (o = o.match(q)) {
                o = o[1].split("&");
                B = 0;
                for (E = o.length; B < E; B++) {
                    D = o[B].split("=");
                    if (D[0] === "q" || D[0] === "query")D[1] = D[1].replace(z, "%20");
                    u = this._parseParamPair(u, decodeURIComponent(D[0]), decodeURIComponent(D[1]))
                }
            }
            return u
        };
        this._parseParamPair = function (o, u, z) {
            if (o[u])if (_isArray(o[u]))o[u].push(z); else o[u] = [o[u], z]; else o[u] = z;
            return o
        };
        this._getTypeIDForPageName = function (o) {
            var u = c.Deferred(), z, D, B;
            _.defined(this._pageNameCache[o]) ?
                    u.resolve(this._pageNameCache[o]) : GS.service.getItemByPageName(o, function (E) {
                if (E && E.type)if (B = E[E.type]) {
                    B.PageName = o;
                    switch (E.type) {
                        case "user":
                            z = GS.Models.User.wrap(B);
                            D = z.UserID;
                            break;
                        case "artist":
                            z = GS.Models.Artist.wrap(B);
                            D = z.ArtistID;
                            break;
                        case "album":
                            z = GS.Models.Album.wrap(B);
                            D = z.AlbumID;
                            break;
                        case "theme":
                            z = B;
                            D = B.themeID;
                            break;
                        default:
                            console.warn("unknown type for PageName", E.type, o);
                            u.reject(E);
                            return
                    }
                    w._pageNameCache[o] = {type:E.type, id:D, item:z};
                    u.resolve(w._pageNameCache[o])
                } else u.reject(E);
                else u.reject(E)
            }, function (E) {
                u.reject(E)
            });
            return u.promise()
        }
    });
    var h = "", n = null;
    GS.router.get("", function (s) {
        d(s)
    });
    GS.router.get(/^#!?\/$/, function (s) {
        d(s)
    });
    GS.router.get(/^#!?\/notFound\/?$/, function (s) {
        s.notFound = true;
        d(s)
    });
    GS.router.get(/^#!?\/user\/(.*)\/?$/, f);
    GS.router.get(/^#!?\/playlist\/(.*)\/?/, function (s) {
        var w = new m(s.splat, "name", "id", "subpage"), o, u;
        h = "playlist";
        n = o = {identifier:w.id, params:w};
        GS.router.page.getPageClass(h).then(function (z) {
            if (h === "playlist" && n === o) {
                u = GS.router.page.activate(z,
                        o);
                switch (w.length) {
                    case 2:
                    case 3:
                        z = _.orEqual(w.subpage, "music");
                        u.index(w.id, z, s.play);
                        w.subpage = z;
                        break;
                    default:
                        this.notFound()
                }
                GS.getGuts().handlePageLoad("playlist", w)
            }
        })
    });
    GS.router.get(/^#!?\/s(?:ong)?\/(.*)\/?/, function (s) {
        var w = new m(s.splat, "name", "token", "subpage");
        if (s.fbComment && GS.page.activePage && GS.page.activePage.token === w.token)return false;
        var o, u;
        h = "song";
        n = o = {identifier:w.token, params:w};
        GS.router.page.getPageClass(h).then(function (z) {
            if (h === "song" && n === o) {
                u = GS.router.page.activate(z,
                        o);
                switch (w.length) {
                    case 2:
                    case 3:
                        var D = _.orEqual(w.subpage, "overview");
                        u.index(w.token, D);
                        break;
                    default:
                        this.notFound()
                }
                w.subpage = D;
                GS.getGuts().handlePageLoad("song", w)
            }
        })
    });
    GS.router.get(/^#!?\/(album|artist|promotion)\/(.*)\/?/, g);
    GS.router.get(/^#!\/redeem\/?(.*)\/?/, function (s) {
        s = new m(s.splat, "type", "code");
        s.redeemingPromoCard = true;
        d(s);
        GS.getLightbox().open("redeem", {type:s.type, code:s.code})
    });
    GS.router.get(/^#!?\/login(?:$|\/(.*)\/?)/, function (s) {
        s = new m(s.splat, "type");
        d(s);
        GS.getLightbox().open("login",
                {type:s.type})
    });
    GS.router.get(/^#!?\/themes(?:$|\/(.*)\/?)/, function (s) {
        s = new m(s.splat, "type");
        d(s);
        GS.getLightbox().open("themes", {type:s.type})
    });
    GS.router.get(/^#!?\/(theme)\/(.*)\/?/, function (s) {
        s.splat.shift();
        s = new m(s.splat, "name", "themeid", "type");
        GS.theme.loadFromDFPManual(s.themeid);
        d(s)
    });
    GS.router.get(/^#!?\/boxee(?:$|\/(.*)\/?)/, function (s) {
        s = new m(s.splat, "type");
        d(s);
        GS.getLightbox().open("feature", {feature:"boxee"})
    });
    GS.router.get(/^#!?\/perks(?:$|\/(.*)\/?)/, function (s) {
        s = new m(s.splat,
                "type");
        d(s);
        GS.theme.setCurrentTheme(163, true);
        GS.getLightbox().open("vipPerks")
    });
    GS.router.get(/^#!?\/(sessions)/, function () {
        GS.theme.setCurrentTheme(247, true);
        d({})
    });
    GS.router.get(/^#!?\/(censorship)$/, function () {
        d({});
        GS.player.powerHourTimeout = 29E3;
        GS.player.enablePowerMode();
        var s = c("#altStyle");
        c("body").addClass("sopa");
        s.attr("href", "/webincludes/css/sopa.css")
    });
    GS.router.get(/^#!?\/search(?:$|\/(.*)\/?)/, function (s) {
        var w = new m(s.splat, "type"), o, u;
        h = "search";
        n = o = {identifier:(w.type ||
                "everything") + (s.q || s.query), params:w};
        GS.router.page.getPageClass(h).then(function (z) {
            if (h === "search" && n === o) {
                u = GS.router.page.activate(z, o);
                u.index(w.type, s.q || s.query);
                if (w.type)w.subpage = w.type; else w.type = "everything"
            }
        })
    });
    GS.router.get(/^#!?\/surveys(?:$|\/(.*)\/?|\/(.*)\/(.*)\/?)/, function (s) {
        var w = new m(s.splat, "subpage", "id"), o, u;
        h = "surveys";
        n = o = {};
        GS.router.page.getPageClass(h).then(function (z) {
            if (h === "surveys" && n === o) {
                u = GS.router.page.activate(z, o);
                if (!w.subpage)w.subpage = "index";
                if (!w.id)w.id =
                        false;
                u.index(w.subpage, w.id);
                GS.getGuts().handlePageLoad("surveys", w)
            }
        })
    });
    GS.router.get(/^#!\/(?:music|explore)(?:$|\/(.*)\/?)/, function (s) {
        var w = new m(s.splat, "subpage", "type", "id"), o, u;
        h = "music";
        n = o = {params:w};
        GS.router.page.getPageClass(h).then(function (z) {
            if (h === "music" && n === o) {
                u = GS.router.page.activate(z, o);
                if (!w.type)w.type = false;
                u.index(w.subpage, w.type, w);
                GS.getGuts().handlePageLoad("music", w)
            }
        })
    });
    GS.router.get(/^#!?\/(.*)\/?$/, function (s) {
        var w = new m(s.splat, "page", "subpage", "type"), o,
                u, z, D = this;
        o = w.page;
        if (w.page == "popular") {
            D.replaceHash("music/popular");
            w.page = "music";
            w.subpage = "popular";
            o = "music"
        }
        if (w.page == "community")D.setHash(GS.user.toUrl("community")); else {
            h = o;
            n = u = {params:w};
            D.page.getPageClass(h).then(function (B) {
                if (h === o && n === u)if (_.defined(B)) {
                    z = GS.router.page.activate(B, u);
                    z.index(w.subpage)
                } else D._getTypeIDForPageName(w.page).done(function (E) {
                    switch (E.type) {
                        case "user":
                            s.splat[0] = k(s.splat[0], E.id);
                            f(s);
                            break;
                        case "artist":
                        case "album":
                            s.splat[1] = k(s.splat[0], E.id);
                            s.splat[0] = E.type;
                            g(s);
                            break;
                        case "theme":
                            D.setHash("/theme/" + (E.item.themeName ? E.item.themeName : "x") + "/" + E.id);
                            break;
                        default:
                            console.warn("cant handle pageName type", E);
                            D.notFound();
                            break
                    }
                }).fail(function () {
                            D.notFound()
                        })
            })
        }
    });
    GS.router.get(/^#!?(?:[a-z0-9A-Z])/, function () {
        if (GS.page.activePage)if (GS.page.activePage) {
            var s = GS.page.activePage.url;
            s = s.replace(/(&|\?)fb_comment_id=([a-zA-Z0-9\_\-]+)/, "$1fbComment");
            var w = GS.page.activePage.element.controller();
            w.scrollToFBComment && w.scrollToFBComment();
            location.replace(s)
        }
    });
    var q = /\?([^#]*)$/
})(jQuery);


(function (c) {
    function a() {
        if (!arguments.callee.prototype.locked) {
            var u = +new Date;
            if (h && u - h <= 100) {
                if (!q) {
                    n = setTimeout(arguments.callee, 101);
                    q = true
                }
            } else {
                q = false;
                h = u;
                var z = c("#application").width(), D = c("#header"), B = c("#footer"), E = c("#jh-invite"), F = c("#page");
                u = c("#page_wrapper");
                var y = c("#page_sidebar"), I = c("#page_header"), C = c("#page_content"), H = c("#capitalSidebar");
                page_controls = c(".page_controls");
                sticky_controls = c(".page_controls .sticky");
                c("#content").add("#sidebar").add(u).css({height:g.height() - D.height() -
                        B.height() - E.outerHeight()});
                c("#sidebar_pinboard").css({height:c("#sidebar").height() - c("#sidebar_music_navigation").height() - c("#sidebar_pinboard_header").height() - 1});
                u.css({width:z - c("#sidebar").width() - H.width()});
                F.css({height:u.height() - c("#page_footer").height() - c("#theme_page_header.measure").height(), width:u.width() - y.width()});
                sticky_controls.width(page_controls.width());
                if (C.hasClass("scrollable") || C.hasClass("grid"))C.css({height:F.height() - I.outerHeight()});
                D = {all:F.find(".noResults"),
                    panes:F.find(".noResults_pane")};
                c(".noResults_block_column").removeClass("js-center").css({margin:0});
                c(".noResults_block_center").removeClass("hide");
                if (D.all.width() <= 550) {
                    c(".noResults_block_center").addClass("hide");
                    c(".noResults_block_column").addClass("js-center")
                }
                D.all.css({top:Math.max((D.panes.height() - D.all.height()) / 2, 0)});
                C.find(".page_column_fluid").each(function () {
                    var K = 0, r = C.width();
                    c(this).siblings(".page_column").each(function () {
                        var t = c(this);
                        t.height(C.height());
                        if (t.hasClass("page_filter")) {
                            if (!t.hasClass("suppressAutoCollapse"))if (z <
                                    k && !t.hasClass("manualOpen"))t.addClass("collapsed"); else if (z < m && K > 0 && !t.hasClass("manualOpen"))t.addClass("collapsed"); else t.hasClass("manualCollapse") || t.removeClass("collapsed");
                            t.removeClass("suppressAutoCollapse");
                            if (t.hasClass("collapsed")) {
                                var v = t.find(".gs_grid").controller();
                                v && v.grid && t.width(v.grid.getScrollWidth())
                            } else t.width(175)
                        }
                        K += t.outerWidth()
                    });
                    c(this).css({width:r - K - (c("#page_content_profile").length ? 200 : 0), height:C.height()})
                });
                c(".js-center").each(function () {
                    var K = c(this);
                    K.css({marginLeft:Math.max(0, (K.parent().width() - K.outerWidth()) / 2)})
                });
                c.browser.msie && c.browser.version === "7.0" && c("#kinesisFrame").length && c("#kinesisFrame").height(u.height());
                arguments.callee.prototype.locked = true;
                c.publish("gs.app.resize");
                c(".gs_grid").each(function (K, r) {
                    r = c(r);
                    if (c.isFunction(r.controller)) {
                        var t = r.controller();
                        t && c.isFunction(t.resizeSelf) && r.controller().resizeSelf()
                    }
                });
                arguments.callee.prototype.locked = false
            }
        }
    }

    function b(u) {
        if (u) {
            if (GS.getAd().lastIdleTime) {
                c.publish("gs.state.active");
                GS.getAd().lastIdleTime = null
            }
            switch (u.type) {
                case "keydown":
                    if (u.keyCode == "13" || u.ctrlKey && u.keyCode == "37" || u.ctrlKey && u.keyCode == "38" || u.ctrlKey && u.keyCode == "39" || u.ctrlKey && u.keyCode == "40")GS.getAd().adAction(u);
                    break;
                default:
                    GS.getAd().adAction(u);
                    break
            }
        }
    }

    function d() {
        var u = document.title || "";
        if (u.indexOf("#") != -1)u = u.substring(0, u.indexOf("#"));
        if (document.title != u && u !== "")document.title = u
    }

    function f() {
        c("head").pinify({applicationName:"Grooveshark", favIcon:"/webincludes/images/favicon64.ico",
            navColor:"#f77f00", startUrl:"http://" + window.location.host, tooltip:"Launch Grooveshark", window:"width=100%;height=100%"});
        var u = [
            {name:"Explore", url:"/#!/music", icon:gsConfig.assetHost + "/webincludes/images/pinned/explore.ico"},
            {name:"Search", url:"/#!/", icon:gsConfig.assetHost + "/webincludes/images/pinned/search.ico"}
        ], z = function () {
            D({title:GS.user && GS.user.isLoggedIn ? GS.user.Name : "Grooveshark", items:[
                {name:"My Profile", url:GS.user.toUrl(), icon:gsConfig.assetHost + "/webincludes/images/pinned/profile.ico"},
                {name:"My Music", url:GS.user.toUrl("music"), icon:gsConfig.assetHost + "/webincludes/images/pinned/music.ico"},
                {name:"Community", url:GS.user.toUrl("communuity"), icon:gsConfig.assetHost + "/webincludes/images/pinned/community.ico"}
            ].concat(u)})
        }, D = function (H) {
            window.external.msSiteModeClearJumplist();
            window.external.msSiteModeCreateJumplist(H.title);
            c.each(H.items, function (K, r) {
                window.external.msSiteModeAddJumpListItem(r.name, r.url, r.icon, r.target || "self")
            });
            window.external.msSiteModeShowJumplist()
        };
        c.subscribe("gs.auth.update",
                z);
        z();
        var B = {previous:1, play:2, next:3, library:4, radio:5, smile:6, frown:7};
        c.pinify.createThumbbarButtons({buttons:[
            {icon:gsConfig.assetHost + "/webincludes/images/pinned/previous.ico", name:"Previous", click:function () {
                GS.player && GS.player.previousSong()
            }},
            {icon:gsConfig.assetHost + "/webincludes/images/pinned/play.ico", name:"Play", click:function () {
                if (GS.player)if (GS.player.isPaused) {
                    GS.player.resumeSong();
                    setTimeout(function () {
                        window.external.msSiteModeShowButtonStyle(B.play, 0)
                    }, 5)
                } else if (GS.player.isPlaying ||
                        GS.player.isLoading) {
                    GS.player.pauseSong();
                    setTimeout(function () {
                        window.external.msSiteModeShowButtonStyle(B.play, 1)
                    }, 5)
                } else {
                    GS.player.queue.activeSong && GS.player.playSong(GS.player.queue.activeSong.queueSongID);
                    setTimeout(function () {
                        window.external.msSiteModeShowButtonStyle(B.play, 0)
                    }, 5)
                }
            }, alternateStyle:{icon:gsConfig.assetHost + "/webincludes/images/pinned/pause.ico", name:"Pause"}},
            {icon:gsConfig.assetHost + "/webincludes/images/pinned/next.ico", name:"Next", click:function () {
                GS.player && GS.player.nextSong()
            }},
            {icon:gsConfig.assetHost + "/webincludes/images/pinned/mymusic_add.ico", name:"Add to My Music", click:function () {
                GS.player.queue.activeSong && GS.user.library && GS.user.library.songs && GS.user.library.songs[GS.player.queue.activeSong.SongID] ? GS.user.removeFromLibrary(GS.player.queue.activeSong.SongID) : GS.user.addToLibrary([GS.player.queue.activeSong.SongID])
            }, alternateStyle:{icon:gsConfig.assetHost + "/webincludes/images/pinned/mymusic_remove.ico", name:"Remove from My Music"}},
            {icon:gsConfig.assetHost + "/webincludes/images/pinned/radio_off.ico",
                name:"Start Radio", click:function () {
                var H = GS.player.queue.autoplayEnabled;
                GS.player.setAutoplay(!GS.player.queue.autoplayEnabled);
                H || setTimeout(function () {
                    window.external.msSiteModeShowButtonStyle(B.radio, 0)
                }, 5)
            }, alternateStyle:{icon:gsConfig.assetHost + "/webincludes/images/pinned/radio_on.ico", name:"Stop Radio"}}
        ]});
        var E = {}, F = function (H, K, r) {
            if (E[H] === undefined || E[H] !== r) {
                window.external.msSiteModeUpdateThumbBarButton(H, true, r);
                E[H] = r
            }
        }, y = 0;
        c.subscribe("gs.player.playstatus", function (H) {
            if (H.status !=
                    y) {
                switch (H.status) {
                    case GS.player.PLAY_STATUS_INITIALIZING:
                    case GS.player.PLAY_STATUS_LOADING:
                    case GS.player.PLAY_STATUS_PLAYING:
                        setTimeout(function () {
                            window.external.msSiteModeShowButtonStyle(B.play, 1)
                        }, 10);
                        break;
                    case GS.player.PLAY_STATUS_COMPLETED:
                    case GS.player.PLAY_STATUS_PAUSED:
                    case GS.player.PLAY_STATUS_NONE:
                    case GS.player.PLAY_STATUS_FAILED:
                        setTimeout(function () {
                            window.external.msSiteModeShowButtonStyle(B.play, 0)
                        }, 10);
                        break
                }
                y = H.status
            }
        });
        var I = function (H) {
            if (H) {
                window.external.msSiteModeShowButtonStyle(B.radio,
                        1);
                C = true
            } else {
                window.external.msSiteModeShowButtonStyle(B.radio, 0);
                C = false
            }
        }, C = false;
        c.subscribe("gs.player.autoplay.update", function () {
            if (GS.player.queue)if (GS.player.queue.autoplayEnabled && GS.player.queue.autoplayEnabled != C)I(true); else GS.player.queue.autoplayEnabled != C && I(false)
        });
        F(B.previous, true, true);
        window.external.msSiteModeShowButtonStyle(B.play, 0);
        F(B.play, true, true);
        F(B.next, true, true);
        window.external.msSiteModeShowButtonStyle(B.library, 0);
        F(B.library, true, false);
        window.external.msSiteModeShowButtonStyle(B.radio,
                0);
        F(B.radio, true, true);
        c.subscribe("gs.player.currentSong", function (H) {
            if (H) {
                typeof GS.player.queue.autoplayEnabled !== "undefined" && GS.player.queue.autoplayEnabled != C && I(GS.player.queue.autoplayEnabled);
                GS.player.queue.activeSong && GS.user.library && GS.user.library.songs && GS.user.library.songs[GS.player.queue.activeSong.SongID] ? window.external.msSiteModeShowButtonStyle(B.library, 1) : window.external.msSiteModeShowButtonStyle(B.library, 0);
                F(B.library, true, true)
            } else {
                window.external.msSiteModeShowButtonStyle(B.library,
                        0);
                F(B.library, true, false)
            }
        });
        if (GS.IE.isPinned && gsConfig.runMode == "production")GS.getGuts().gaTrackEvent("ie9Pinned", "isPinned"); else GS.IE.canPin && gsConfig.runMode == "production" && GS.getGuts().gaTrackEvent("ie9Pinned", "notPinned")
    }

    var g = c(window), k = 844, m = 1060, h = 0, n = 0, q = false;
    g.resize(a);
    if (c.browser.msie)window.onbeforeunload = function () {
        GS.user.isLoggedIn && GS.user.storeData();
        GS.theme && GS.theme.savePreferences()
    }; else g.bind("unload", function () {
        GS.user.isLoggedIn && GS.user.storeData();
        GS.theme && GS.theme.savePreferences()
    });
    c("body").konami(function () {
        c.publish("gs.playlist.play", {playlistID:40563861, playOnAdd:true})
    });
    c("body").bind("mousedown", b);
    c("body").bind("keydown", b);
    c.browser.msie && c(document).bind("propertychange", function () {
        event.propertyName == "title" && d()
    });
    GS.windowResizeTimeout = null;
    GS.windowResizeWait = 10;
    setTimeout(function () {
        g.resize()
    }, 0);
    if (window.gsViewBundles)GS.Controllers.BaseController.viewBundles = window.gsViewBundles;
    if (window.gsBundleVersions)GS.Controllers.BaseController.bundleVersions = window.gsBundleVersions;
    if (window.gsPageBundle && c.isPlainObject(gsPageBundle))
        for (var s in gsPageBundle)
            if (gsPageBundle.hasOwnProperty(s))
                c.View.preCached[s] = gsPageBundle[s];
    window.reportUploadComplete = window.uploadComplete = function () {
        window.GS && GS.user && GS.user.uploadComplete()
    };
    GS.airbridge = GS.Controllers.AirbridgeController.instance();
    s = function (u) {
        return function () {
            var z = arguments.callee.prototype.inst;
            if (z)return z;
            arguments.callee.prototype.inst = true;
            arguments.callee.prototype.inst = z = GS.Controllers[u].instance();
            z.appReady && c.isReady && z.appReady();
            z.commReady && GS.service.currentToken && z.commReady();
            return z
        }
    };
    GS.service = GS.Controllers.ServiceController.instance();
    GS.auth = GS.Controllers.AuthController.instance();
    GS.getLightbox = s("LightboxController");
    GS.getNotice = s("NotificationsController");
    GS.header = GS.Controllers.HeaderController.instance();
    GS.getSidebar = s("SidebarController");
    GS.theme = GS.Controllers.ThemeController.instance();
    GS.player = GS.Controllers.PlayerController.instance();
    GS.getYoutube = s("YoutubeController");
    GS.getVimeo = s("VimeoController");
    GS.getAd = s("AdController");
    GS.getGuts = s("GUTSController");
    GS.getLocale = s("LocaleController");
    GS.getFacebook = s("FacebookController");
    GS.getLastfm = s("LastfmController");
    GS.getFlattr = s("FlattrController");
    GS.getGoogle = s("GoogleController");
    GS.getTwitter = s("TwitterController");
    GS.getRapleaf = s("RapLeafController");
    GS.getKrux = s("KruxController");
    GS.getParty = s("PartyController");
    GS.getEngagements = s("EngagementsController");
    GS.page = GS.Controllers.PageController;
    GS.features =
            GS.Models.Feature.Features;
    GS.search = {search:"", type:"", lastSearch:"", lastType:"", version:""};
    GS.resize = a;
    GS.rand = Math.random();
    GS.shareTypes = {album:["email", "facebook", "stumbleupon", "twitter", "widget"], playlist:["email", "facebook", "stumbleupon", "twitter", "reddit", "widget"], song:["email", "facebook", "stumbleupon", "twitter", "reddit", "widget"], manySongs:["widget"]};
    GS.gotoUpgradePage = function () {
        GS.router.setHash("/settings/subscriptions")
    };
    window.Grooveshark = GS.Controllers.ApiController.instance();
    c(document).bind("keydown",
            "ctrl+a", function (u) {
                var z = [], D = c(".gs_grid:last").controller();
                if (!c(u.target).is("input,select,textarea") && D) {
                    for (u = 0; u < D.dataView.rows.length; u++) {
                        z.push(u);
                        D.selectedRowIDs.push(D.dataView.rows[u].id)
                    }
                    D.grid.setSelectedRows(z);
                    D.grid.onSelectedRowsChanged();
                    return false
                }
            });
    (function () {
        var u = new c.Event("remove"), z = c.fn.remove;
        c.fn.remove = function () {
            c(this).trigger(u);
            z.apply(this, arguments)
        }
    })();
    s = true;
    var w = _.browserDetect();
    switch (w.browser) {
        case "chrome":
            if (w.version >= 6)s = false;
            if (Boolean(navigator.userAgent.match(/GoogleTV/i))) {
                GS.getLightbox().open("unsupportedBrowser",
                        {isUncertain:true});
                s = false
            }
            break;
        case "safari":
            if (w.version >= 5)s = false;
            if (Boolean(navigator.userAgent.match(/luakit/i))) {
                GS.getLightbox().open("unsupportedBrowser", {isUncertain:true});
                s = false
            }
            break;
        case "msie":
            if (w.version >= 7 && w.version <= 9)s = false;
            if (w.version <= 6) {
                GS.getLightbox().open("unsupportedBrowser", {isChromeFrame:true});
                s = false
            }
            break;
        case "firefox":
            if (w.version >= 3)s = false;
            break;
        case "mozilla":
            if (w.version >= 1.9)s = false;
            break;
        case "opera":
            if (w.version >= 11)s = false;
            break;
        case "adobeair":
            s = false;
            break
    }
    s && GS.getLightbox().open("unsupportedBrowser", {browser:w});
    window.playSongFromAd = function (u) {
        try {
            u = u || [];
            typeof u == "object" && u.constructor == Array || (u = [u]);
            GS.player.addSongsToQueueAt(u, null, true)
        } catch (z) {
        }
    };
    s = function () {
        var u = {canPin:false, isPinned:false, firstPin:false, firstVisit:false};
        try {
            if ("external"in window && "msIsSiteMode"in window.external) {
                u.canPin = true;
                if (window.external.msIsSiteMode()) {
                    u.isPinned = true;
                    if ("msIsSiteModeFirstRun"in window.external && window.external.msIsSiteModeFirstRun(true) !==
                            0)u.firstPin = true; else u.firstVisit = GS.store.get("visitedIE9") || c.cookie("visitedIE9") ? false : true
                }
            }
        } catch (z) {
        }
        return u
    }();
    var o = true;
    s.canPin && c.subscribe("gs.app.ready", function () {
        var u = document.createElement("script");
        u.type = "text/javascript";
        u.async = true;
        u.src = gsConfig.assetHost + "/gs/resources/jquery.pinify.min.js";
        u.onload = u.onreadystatechange = function () {
            if (this.readyState && (this.readyState == "complete" || this.readyState !== "loaded") && o) {
                setTimeout(function () {
                    f(GS.IE)
                }, 100);
                o = false
            }
        };
        document.body.appendChild(u)
    });
    GS.IE = s;
    c(document).ready(function () {
        var u = c("body,#main,#page_wrapper,#mainContainer");
        u.scrollTop(0);
        document.body.scroll = "no";
        u.scroll(function (z) {
            if (c(this).scrollTop() > 0) {
                console.warn("Fixing Scroll", z.target);
                c(this).scrollTop(0)
            }
            return false
        });
        c.browser.msie && d();
        c.drop({mode:"mouse"});
        GS.isReady = true;
        c.publish("gs.app.ready");
        GS.player.isReady && GS.player.playerSetup();
        u = (new Date).format("m/d");
        GS.isApril1 = u == "04/01" ? true : false;
        GS.router.run();
        c(document).click(function (z) {
            var D = GS.getGuts();
            if (D)if (Math.random() < 0.0010) {
                z = c(z.target.outerHTML).html("").get(0).outerHTML;
                D.logEvent("globalClick", {outerHTML:z})
            }
        })
    })
})(jQuery);


var oldUnload = false;
if (window.onbeforeunload)oldUnload = window.onbeforeunload;
window.onbeforeunload = function (c) {
    GS.player.storeQueue();
    GS.getGuts().forceSend();
    var a;
    c = c || window.event;
    if (!GS.user.isLoggedIn && GS.user.isDirty) {
        a = $.localize.getString("ONCLOSE_PROMPT_LOGIN");
        GS.getLightbox().open("login", {extraMessage:"ONCLOSE_PROMPT_LOGIN"})
    }
    if (GS.player.isPlaying)a = $.localize.getString("ONCLOSE_PLAYING");
    if (!GS.Controllers.PageController.ALLOW_LOAD)a = GS.Controllers.PageController.confirmMessage;
    if (oldUnload) {
        var b = oldUnload;
        oldUnload = false;
        b()
    }
    if (a) {
        if (c)c.returnValue = a;
        return a
    }
};

