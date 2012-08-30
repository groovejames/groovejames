(function () {
    function c() {
        this.requests = [];
        this.pendingRequest = null
    }

    function a() {
        I = {}
    }

    function b(r) {
        var t = [].slice.call(arguments, 1), v = (new Date).valueOf(), x = new this;
        this.apply(x, t);
        t = 6E5;
        if (r) {
            if (typeof r == "number")t = r;
            var A = x.getCacheKey(), G = I[A];
            if (_.defined(G) && (!G.isResolved() || v - G.lastResolution < t))x = G; else I[A] = x
        }
        return x
    }

    function d(r, t, v, x, A) {
        function G() {
            J.isPending = false;
            J.lastResolution = (new Date).valueOf()
        }

        this.method = _.orEqual(r, "");
        this.parameters = _.orEqual(t, {});
        this.options = _.orEqual(v, {});
        this.useHTTPS = _.orEqual(x, false);
        this.useSWF = _.orEqual(A, false);
        this.overrideHeaders = {};
        this.type = "normal";
        this.isPending = this.failedAuth = false;
        this.numRetries = 0;
        this.lastFault = null;
        this.lastResolution = 0;
        this.successFilters = [];
        this.faultFilters = [];
        this._dfd = $.Deferred();
        var J = this;
        this.promise().then(G, G)
    }

    function f(r, t, v) {
        d.call(this, r, t);
        this.httpMethod = _.orEqual(v, "POST");
        this.type = "facebook"
    }

    function g(r) {
        d.call(this, null, r);
        this.type = "lastfm"
    }

    function k(r, t, v) {
        d.call(this, null, t);
        this.httpMethod =
                _.orEqual(v, "POST");
        this.type = "flattr";
        this.url = r
    }

    function m() {
        var r = String(Math.floor(Math.random() * 1E4));
        return!GS.service.outgoingSWFCalls[r] ? r : m()
    }

    function h(r, t) {
        var v;
        if ($.isFunction(GS.service.swfProxy)) {
            v = m();
            GS.service.outgoingSWFCalls[v] = r;
            GS.service.swfProxy(r.getSWFable(), t, v)
        } else {
            r.isPending = false;
            GS.service.callsPendingSWF.push(r)
        }
    }

    function createRandomizer() {
        for (var r = "", t = 0; t < 6; t++)
            r += Math.floor(Math.random() * 16).toString(16);
        return r != GS.service.lastRandomizer ? r : createRandomizer()
    }

    function q(r) {
        r = _.orEqual(r, {});
        var t = {client:GS.service.client, clientRevision:GS.service.clientRevision, privacy:GS.service.privacy, country:GS.service.country, uuid:GS.service.uuID};
        if (GS.service.sessionID) t.session = GS.service.sessionID;
        return $.extend(t, r)
    }

    function response_received(response, t) {
        _.defined(response) || (response = {fault:{message:"Empty Result", code:GS.service.faultCodes.EMPTY_RESULT}});
        if (response.header) {
            var v = response.header, x = v.session;
            if (x && x != GS.service.sessionID) {
                GS.service.sessionID = x;
                GS.service.tokenPending = false;
                fetchNewCommunicationToken()
            }
            if (v.expiredClient) {
                GS.service.clientExpired = true;
                GS.player && GS.player.expireSWFService();
                w()
            }
            v = v.secondsUntilDowntime;
            if (v < 0)
                _.wait(5E3).then(D);
            else if (v > 0) {
                v = Math.floor(v / 60);
                x = (new Date).valueOf();
                if (v <= 60)
                    if (GS.service.lastDowntimeNotification == 0
                            || v > 30 && x - GS.service.lastDowntimeNotification > 36E5
                            || v <= 30 && v > 15 && x - GS.service.lastDowntimeNotification > 18E5
                            || v <= 15 && v > 10 && x - GS.service.lastDowntimeNotification > 9E5
                            || v <= 10 && v > 5 && x - GS.service.lastDowntimeNotification > 6E5
                            || v <= 5 && x - GS.service.lastDowntimeNotification > 3E5) {
                        GS.service.lastDowntimeNotification = x;
                        v = new GS.Models.DataString($.localize.getString("NOTIFICATION_MAINTENANCE_WARNING"), {min:v});
                        $.publish("gs.notification", {type:"info", message:v})
                    }
            }
        }
        response.fault ? o(response.fault, t) : t.resolve(response.hasOwnProperty("result") ? response.result : response)
    }

    function w() {
        GS.getLightbox().open({type:"invalidClient", notCloseable:true, view:{header:"POPUP_INVALID_CLIENT_TITLE", message:"POPUP_INVALID_CLIENT_MSG", buttonsRight:[
            {label:"POPUP_INVALID_CLIENT_SUBMIT", className:"submit"}
        ]}, callbacks:{".submit":function (r) {
            r.stopImmediatePropagation();
            window.location.reload(true)
        }}})
    }

    function o(r, t) {
        if (r && _.defined(r.code)) {
            console.log("HANDLE FAULT CODE", r.code, t.method);
            if (r.code == GS.service.faultCodes.INVALID_TOKEN) {
                var v = (new Date).valueOf();
                if ((!GS.service.lastTokenFailed || v - GS.service.lastTokenFailed >= 3E5) && t.numRetries === 0) {
                    GS.service.lastTokenFailed = false;
                    t.isPending = false;
                    t.numRetries++;
                    GS.service.callsPendingToken.push(t);
                    fetchNewCommunicationToken();
                    return
                } else $.publish("gs.notification", {type:"error", message:$.localize.getString("SERVICE_ERROR_COMMUNICATING"),
                    uniqueInstance:"errorCommunicating"})
            } else if (r.code == GS.service.faultCodes.HTTP_TIMEOUT || r.code == GS.service.faultCodes.EMPTY_RESULT) {
                t.lastFault = r;
                t.retry(100 + t.numRetries * 100);
                return
            } else if (r.code == GS.service.faultCodes.MAINTENANCE)_.wait(5E3).then(D); else if (r.code == GS.service.faultCodes.INVALID_CLIENT)w(); else if (r.code == GS.service.faultCodes.INVALID_SESSION)GS.getLightbox().open({type:"sessionBad", notCloseable:true, view:{header:"POPUP_SESSION_BAD_TITLE", message:"POPUP_SESSION_BAD_MSG", buttonsLeft:[
                {label:"POPUP_REFRESH_GROOVESHARK",
                    className:"submit"}
            ]}, callbacks:{".submit":function (x) {
                x.stopImmediatePropagation();
                window.location.reload(true)
            }}}); else if (gsConfig.runMode == "dev" && r.code == GS.service.faultCodes.HTTP_ERROR && t.method == "getCommunicationToken")window.location = "https://" + window.location.host + window.location.hash
        }
        t.reject(r)
    }

    function fetchNewCommunicationToken() {
        if (!GS.service.tokenPending) {
            GS.service.currentToken = null;
            GS.service.tokenExpires = 0;
            GS.service.tokenPending = true;
            if (GS.service.sessionID) {
                var r = hex_md5(GS.service.sessionID);
                r = C(false, "getCommunicationToken", {secretKey:r}, {}, true);
                r.promise().then(newCommunicationTokenReceived, function () {
                    var t = new Date;
                    GS.service.tokenPending = false;
                    for (GS.service.lastTokenFailed = t.valueOf(); GS.service.callsPendingToken.length;) {
                        t = GS.service.callsPendingToken.shift();
                        t.reject({message:$.localize.getString("SERVICE_CREATE_TOKEN_FAIL"), code:GS.service.faultCodes.INVALID_TOKEN})
                    }
                })
            } else
                r = C(false, "initiateSession");
            r.send()
        }
    }

    function newCommunicationTokenReceived(newToken) {
        var t = new Date;
        GS.service.lastTokenFailed = false;
        GS.service.currentToken = newToken;
        GS.service.tokenPending = false;
        for (GS.service.tokenExpires = 15E5 + t.valueOf(); GS.service.callsPendingToken.length;) {
            var r = GS.service.callsPendingToken.shift();
            r.send()
        }
        $.publish("gs.cowbell.ready")
    }

    function D() {
        if (!GS.service.downForMaintenance) {
            GS.service.downForMaintenance = true;
            GS.getLightbox().open({type:"maintenance", notCloseable:true, view:{header:"POPUP_MAINT_TITLE", message:"POPUP_MAINT_MESSAGE", buttonsLeft:[
                {label:"POPUP_MAINT_TWITTER", href:"http://twitter.com/sharkjanitor"}
            ]}});
            B()
        }
    }

    function B() {
        var r = C(false, "getServiceStatus");
        r.promise().then(E, F);
        r.send()
    }

    function E(r) {
        if (r.status == 1) {
            GS.service.downForMaintenance = false;
            GS.getLightbox().close()
        } else _.wait(2E4).then(B)
    }

    function F() {
        _.wait(2E4).then(B)
    }

    c.prototype.queue = function (r) {
        function t() {
            if (this.requests.length) {
                this.pendingRequest = this.requests.shift();
                var v = this, x = function () {
                    v.pendingRequest = null;
                    t.call(v)
                };
                this.pendingRequest.promise().then(x, x);
                this.pendingRequest.send()
            }
        }

        this.requests.push(r);
        this.pendingRequest || t.call(this)
    };

    var y = function (r, t) {
        return r[r.length - 1] === t ? {} : r[r.length - 1]
    }, I = {};

    d.createRequest = function () {
        return b.apply(this, arguments)
    };

    var C = function () {
        return b.apply(d, arguments)
    };

    d.prototype.promise = function () {
        return this._dfd.promise()
    };

    d.prototype.isResolved = function () {
        return this._dfd.isResolved()
    };

    d.prototype.isRejected = function () {
        return this._dfd.isRejected()
    };

    d.prototype.resolve = function (r) {
        for (var t = 0; t < this.successFilters.length; t++)if ($.isFunction(this.successFilters[t]))r = this.successFilters[t](r);
        this.lastResolution = (new Date).valueOf();
        this._dfd.resolve(r)
    };

    d.prototype.resolveWith = function (r, t) {
        for (var v = 0; v < this.successFilters.length; v++)if ($.isFunction(this.successFilters[v]))t = this.successFilters[v](t);
        this.lastResolution = (new Date).valueOf();
        this._dfd.resolveWith(r, t)
    };

    d.prototype.reject = function (r) {
        for (var t = 0; t < this.faultFilters.length; t++)if ($.isFunction(this.faultFilters[t]))r = this.faultFilters[t](r);
        this._dfd.reject(r)
    };

    d.prototype.rejectWith = function (r, t) {
        for (var v = 0; v < this.faultFilters.length; v++)if ($.isFunction(this.faultFilters[v]))t =
                this.faultFilters[v](t);
        this._dfd.rejectWith(r, t)
    };

    d.prototype.getSWFable = function () {
        return{type:this.type, method:this.method, parameters:this.parameters, useHTTPS:this.useHTTPS, overrideHeaders:this.overrideHeaders, overrideKey:H}
    };

    d.prototype.cacheKeyProps = ["method", "parameters", "type"];

    d.prototype.getCacheKey = function () {
        var r, t, v = "";
        for (r in this.cacheKeyProps)if (this.cacheKeyProps.hasOwnProperty(r)) {
            t = this[this.cacheKeyProps[r]];
            v += t instanceof String ? t : JSON.stringify(t)
        }
        return hex_md5(v)
    };

    d.prototype.send = function (r) {
        r && r.length == 2 && this.promise().then(r[0], r[1]);
        GS.service = GS.service || GS.Controllers.ServiceController.instance();
        var t = this;
        r = true;
        var v = (new Date).valueOf();
        if (!(this.isPending || this.isResolved()))
            if (GS.service.clientExpired)
                this.reject({message:$.localize.getString("POPUP_INVALID_CLIENT_MSG"), code:GS.service.faultCodes.INVALID_CLIENT});
            else {
                this.isPending = true;
                if (this.numRetries >= 3)
                    this.reject(this.lastFault);
                else {
                    if (this.numRetries > 0)
                        r = false;
                    if (this.type == "facebook" || this.type == "lastfm" || this.type == "flattr")
                        h(this, {});
                    else if (GS.service.tokenExpires > v || ["getCommunicationToken", "initiateSession", "getServiceStatus"].indexOf(this.method) != -1)
                        if (GS.service.downForMaintenance && this.method != "getServiceStatus")
                            this.reject({message:$.localize.getString("SERVICE_DOWN_MAINTENANCE"), code:GS.service.faultCodes.MAINTENANCE});
                        else {
                            v = "http://" + GS.service.hostname + "/" + GS.service.defaultEndpoint + "?" + this.method;
                            var x = {header:q(this.overrideHeaders), method:this.method, parameters:this.parameters};
                            if (GS.service.currentToken) {
                                GS.service.lastRandomizer = createRandomizer();
                                var revToken = GS.service.revToken;
                                if (GS.service.revToken != H)
                                    revToken = H;
                                revToken = hex_sha1(this.method + ":" + GS.service.currentToken + ":" + revToken + ":" + GS.service.lastRandomizer);
                                x.header.token = GS.service.lastRandomizer + revToken
                            }
                            this.useSWF || this.useHTTPS ? h(this, x.header) : $.ajax($.extend({}, this.options, {
                                contentType:"application/json",
                                dataType:"json",
                                type:"POST",
                                data:JSON.stringify(x),
                                cache:r,
                                url:v,
                                success:function (response) {
                                    response_received(response, t)
                                },
                                error:function (G, J, L) {
                                    console.warn("ajax error: status: " + J + ", error: " + L, G, this);
                                    G = {};
                                    switch (J) {
                                        case "parsererror":
                                            G.code = GS.service.faultCodes.PARSE_ERROR;
                                            G.message = $.localize.getString("SERVICE_PARSE_JSON");
                                            break;
                                        case "timeout":
                                            G.code = GS.service.faultCodes.HTTP_TIMEOUT;
                                            G.message = $.localize.getString("SERVICE_REQUEST_TIMEOUT");
                                            break;
                                        case "error":
                                        case "notmodified":
                                        default:
                                            G.code = GS.service.faultCodes.HTTP_ERROR;
                                            G.message = $.localize.getString("SERVICE_HTTP_ERROR");
                                            break
                                    }
                                    o(G, t)
                                }}))
                        } else {
                        this.isPending = false;
                        GS.service.callsPendingToken.push(this);
                        fetchNewCommunicationToken()
                    }
                }
            }
    };

    d.prototype.retry = function (r) {
        var t = this;
        this.isPending = false;
        this.numRetries++;
        _.wait(r).then(function () {
            t.send()
        })
    };

    d.prototype.queue = function (r) {
        if (!_.defined(d.prototype.queues))d.prototype.queues = {};
        var t = d.prototype.queues[r];
        _.defined(t) || (t = d.prototype.queues[r] = new c);
        t.queue(this)
    };

    f.createRequest = function () {
        return b.apply(this, arguments)
    };

    f.prototype = $.extend(f.prototype, d.prototype);

    f.prototype.getSWFable = function () {
        return{type:this.type, method:this.method, parameters:this.parameters, httpMethod:this.httpMethod}
    };

    g.createRequest = function () {
        return b.apply(this, arguments)
    };

    g.prototype = $.extend(g.prototype, d.prototype);

    g.prototype.getSWFable = function () {
        return{type:this.type, parameters:this.parameters}
    };

    k.createRequest = function () {
        return b.apply(this, arguments)
    };

    k.prototype = $.extend(k.prototype, d.prototype);

    k.prototype.getSWFable = function () {
        return{type:this.type, url:this.url, parameters:this.parameters, httpMethod:this.httpMethod}
    };

    var H = "grahamCrackersRYummy", K;

    $.Class.extend("GS.Controllers.ServiceController",
            {
                configDefaults:{
                    hostname:window.location.host,
                    sessionID:null,
                    client:"htmlshark",
                    clientRevision:"20120312",
                    revToken:"reallyHotSauce",
                    country:null,
                    privacy:0,
                    uuID:"",
                    defaultEndpoint:"more.php"
                },
                instance:function () {
                    K || (K = new GS.Controllers.ServiceController({
                        hostname:window.location.host,
                        sessionID:gsConfig.sessionID,
                        country:gsConfig.country,
                        privacy:gsConfig.user.Privacy,
                        uuID:gsConfig.uuid,
                        defaultEndpoint:gsConfig.endpoint
                    }));
                    return K
                }
            },
            {
                faultCodes:{
                    INVALID_CLIENT:1024,
                    RATE_LIMITED:512,
                    INVALID_TOKEN:256,
                    INVALID_SESSION:16,
                    MAINTENANCE:10,
                    MUST_BE_LOGGED_IN:8,
                    HTTP_TIMEOUT:6,
                    PARSE_ERROR:4,
                    HTTP_ERROR:2,
                    EMPTY_RESULT:-256
                },
                init:function (r) {
                    $.extend(this, GS.Controllers.ServiceController.configDefaults, r);
                    this.currentToken = null;
                    this.tokenExpires = 0;
                    this.lastTokenFailed = this.tokenPending = false;
                    this.lastRandomizer = null;
                    this.downForMaintenance = false;
                    this.lastDowntimeNotification = 0;
                    this.clientExpired = false;
                    this.callsPendingToken = [];
                    this.callsPendingSWF = [];
                    this.outgoingSWFCalls = {};
                    this.swfProxy = null;
                    this.sessionID || C(false, "initiateSession", {}, {async:false}).send();
                    $.subscribe("gs.auth.update", a)
                },
                verifyControllerKey:function (controllerKey) {
                    if (controllerKey != H) {
                        H = controllerKey;
                        return false
                    }
                    return true
                },
                serviceExists:function () {
                    return true
                },
                swfReady:function () {
                    for (var r; this.callsPendingSWF.length;) {
                        r = this.callsPendingSWF.shift();
                        r.send()
                    }
                    return true
                },
                swfBadHost:function () {
                    GS.getLightbox().open({type:"badHost", notCloseable:true, view:{header:"POPUP_BAD_HOST_TITLE", message:"POPUP_BAD_HOST_MSG", buttonsLeft:[
                        {href:"http://www.grooveshark.com", labelHTML:"http://www.grooveshark.com"}
                    ]}})
                },
                swfSuccess:function (r, t) {
                    var v = this.outgoingSWFCalls[t];
                    v && response_received(r, v);
                    delete this.outgoingSWFCalls[t]
                },
                swfFault:function (r, t) {
                    var v = this.outgoingSWFCalls[t];
                    v && o(r, v);
                    delete this.outgoingSWFCalls[t]
                },
                swfNeedsToken:function () {
                    fetchNewCommunicationToken()
                },
                onChatData:function (r) {
                    if (r.data && r.data.data)
                        r = r.data.data;
                    else if (r.data)
                        r = r.data;
                    if (r)switch (r.messageType) {
                        case "userPointsAwarded":
                            r.awardedPoints && GS.user && GS.user.addPoints(r.awardedPoints);
                            break;
                        case "apiMethodCall":
                            if (r.method && window.Grooveshark) {
                                if (!$.isArray(r.parameters))r.parameters = [];
                                var t = Grooveshark[r.method];
                                $.isFunction(t) &&
                                t.apply(Grooveshark, r.parameters)
                            }
                            break;
                        case "userRemote":
                            console.warn("userRemote", r);
                            var v = GS.getParty();
                            v.enabled && v.updateQueueFromBroadcast(r);
                            break;
                        case "feedEvent":
                            r.data && $.publish("gs.user.feedEvent", r.data);
                            break;
                        case "playlist":
                            t = r.data.playlistID;
                            v = GS.getParty();
                            v.enabled && v.playlist.PlaylistID == t && v.updateQueueFromBroadcast(r);
                            (v = GS.Models.Playlist.getOneFromCache(t)) && v.updateFromBroadcast(r);
                            GS.page.activePage && GS.page.activePage.playlist && GS.page.activePage.playlist.PlaylistID == t &&
                                    $.isFunction(GS.page.activePage.updateFromBroadcast) && GS.page.activePage.updateFromBroadcast(r);
                            break;
                        case "removedFromCollaborativePlaylist":
                            if (r.playlist && r.playlist.PlaylistID)if (GS.user.PageNameData && GS.user.PageNameData.CollabPlaylists && GS.user.PageNameData.CollabPlaylists[r.playlist.PlaylistID]) {
                                delete GS.user.PageNameData.CollabPlaylists[r.playlist.PlaylistID];
                                GS.user._updateCollabPlaylists();
                                (t = GS.Models.Playlist.getOneFromCache(r.playlist.PlaylistID)) && delete t.Collaborators[GS.user.UserID];
                                GS.page.activePage && GS.page.activePage.playlist && GS.page.activePage.playlist.PlaylistID == r.playlist.PlaylistID && $.publish("gs.playlist.view.update", t)
                            }
                            break;
                        case "addedToCollaborativePlaylist":
                            if (r.playlist && r.playlist.PlaylistID)if (GS.user.PageNameData && GS.user.PageNameData.CollabPlaylists) {
                                r.playlist.songsLoaded = false;
                                GS.user.PageNameData.CollabPlaylists[r.playlist.PlaylistID] = r.playlist;
                                GS.user._updateCollabPlaylists();
                                if (t = GS.Models.Playlist.getOneFromCache(r.playlist.PlaylistID)) {
                                    t.Collaborative =
                                            true;
                                    t.Collaborators[GS.user.UserID] = GS.user
                                }
                                GS.page.activePage && GS.page.activePage.playlist && GS.page.activePage.playlist.PlaylistID == r.playlist.PlaylistID && $.publish("gs.playlist.view.update", t)
                            }
                            break;
                        case "flattrData":
                            $.publish("gs.player.flattr", r);
                            break;
                        default:
                            console.log("unhandled chat data:", r)
                    }
                },
                onChatError:function (r) {
                    console.log("Got chat error, event:", r)
                },
                httpsFormSubmit:function (r, t, v) {
                    var x = $("#httpsForm");
                    $("#httpsIframe");
                    var A = [];
                    x.html("");
                    x.attr("action", r);
                    x.attr("method", "post");
                    x.attr("target", "httpsIframe");
                    x.attr("enctype", "multipart/form-data");
                    _.forEach(t, function (G, J) {
                        A.push('<input type="hidden" name="' + J + '" value="' + G + '" />')
                    });
                    x.append(A.join(""));
                    window.setupBridge = GS.airbridge && GS.airbridge.isDesktop ? function () {
                        var G = {};
                        G[v] = window[v];
                        document.getElementById("httpsIframe").contentWindow.parentSandboxBridge = G
                    } : function () {
                    };
                    x.submit()
                },
                isFirstVisit:function (r) {
                    C(false, "isFirstVisit", {}, {}, false, true).send([r, null])
                },
                makeFacebookRequest:function (r, t, v, x, A) {
                    f.createRequest(false,
                            r, t, v).send([x, A])
                },
                makeLastfmRequest:function (r, t, v) {
                    g.createRequest(false, r).send([t, v])
                },
                makeFlattrRequest:function (r, t, v, x, A) {
                    r = k.createRequest(false, r, t, v);
                    r.promise().then(x, A);
                    r.send()
                },
                rapleafPersonalize:function (r, t, v) {
                    var x = y(arguments, v);
                    x = C(false, "personalize", {redirectURL:r}, x, false, true);
                    x.type = "rapleaf";
                    x.send([t, v])
                },
                rapleafDirect:function (r, t, v) {
                    var x = y(arguments, v);
                    x = C(false, "direct", {email:r}, x, false, true);
                    x.type = "rapleaf";
                    x.send([t, v])
                }, getAlbumByID:function (r, t, v) {
                var x = y(arguments,
                        v);
                C(true, "getAlbumByID", {albumID:r}, x).send([t, v])
            },
                getArtistByID:function (r, t, v) {
                    var x = y(arguments, v);
                    C(true, "getArtistByID", {artistID:r}, x).send([t, v])
                },
                getPlaylistByID:function (r, t, v) {
                    var x = y(arguments, v);
                    C(true, "getPlaylistByID", {playlistID:r}, x).send([t, v])
                },
                getQueueSongListFromSongIDs:function (r, t, v) {
                    var x = y(arguments, v);
                    C(true, "getQueueSongListFromSongIDs", {songIDs:r}, x).send([t, v])
                },
                getSongFromToken:function (r, t, v) {
                    var x = y(arguments, v);
                    C(true, "getSongFromToken", {token:r, country:this.country},
                            x).send([t, v])
                },
                getTokenForSong:function (r, t, v) {
                    var x = y(arguments, v);
                    C(true, "getTokenForSong", {songID:r, country:this.country}, x).send([t, v])
                },
                getUserByID:function (r, t, v) {
                    var x = y(arguments, v);
                    C(true, "getUserByID", {userID:r}, x).send([t, v])
                },
                albumGetSongs:function (r, t, v, x, A) {
                    t = _.orEqual(t, true);
                    v = _.orEqual(v, 0);
                    var G = y(arguments, A);
                    C(true, "albumGetSongs", {albumID:r, isVerified:t, offset:v}, G).send([x, A])
                }, albumGetAllSongs:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "albumGetAllSongs", {albumID:r}, x).send([t,
                    v])
            }, artistGetAllSongs:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "artistGetAllSongs", {artistID:r}, x).send([t, v])
            }, artistGetArtAttribution:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "artistGetArtAttribution", {artistID:r}, x).send([t, v])
            }, playlistGetSongs:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "playlistGetSongs", {playlistID:r}, x).send([t, v])
            }, getArtistRecentListeners:function (r, t, v) {
                req = d.createRequest(true, "getArtistRecentListeners", {artistID:r}, arguments[arguments.length - 1] === v ? {} : arguments[arguments.length -
                        1]);
                req.send([t, v])
            }, getAlbumRecentListeners:function (r, t, v) {
                req = d.createRequest(true, "getAlbumRecentListeners", {albumID:r}, arguments[arguments.length - 1] === v ? {} : arguments[arguments.length - 1]);
                req.send([t, v])
            }, getSongRecentListeners:function (r, t, v) {
                req = d.createRequest(true, "getSongRecentListeners", {songID:r}, arguments[arguments.length - 1] === v ? {} : arguments[arguments.length - 1]);
                req.send([t, v])
            }, popularGetSongs:function (r, t, v) {
                var x = y(arguments, v);
                ({daily:true, weekly:true, monthly:true})[r] || (r = "daily");
                C(true, "popularGetSongs", {type:r}, x).send([t, v])
            }, featuredGetCurrentFeatured:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "featuredGetCurrentFeatured", {date:r}, x).send([t, v])
            }, getArtistsForTagRadio:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "getArtistsForTagRadio", {tagID:r}, x).send([t, v])
            }, albumGetFans:function (r, t, v, x) {
                var A = y(arguments, x);
                C(true, "albumGetFans", {albumID:r, offset:t}, A).send([v, x])
            }, artistGetFans:function (r, t, v, x) {
                var A = y(arguments, x);
                C(true, "artistGetFans", {artistID:r, offset:t}, A).send([v,
                    x])
            }, playlistGetFans:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "playlistGetFans", {playlistID:r}, x).send([t, v])
            }, songGetFans:function (r, t, v, x) {
                var A = y(arguments, x);
                C(true, "songGetFans", {songID:r, offset:t}, A).send([v, x])
            }, userGetFans:function (r, t, v, x) {
                var A = y(arguments, x);
                C(true, "userGetFans", {userID:r, offset:t}, A).send([v, x])
            }, authenticateUser:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(false, "authenticateUser", {username:r, password:t, savePassword:v}, G, true, true).send([x, A])
            }, authenticateFacebookUser:function (r, t, v, x, A, G, J) {
                var L = y(arguments, J);
                C(false, "authenticateFacebookUser", {facebookUserID:r, sessionKey:t, accessToken1:v, accessToken3:x, accessTokenEx:A}, L, true, true).send([G, J])
            }, authenticateGoogleUser:function (r, t) {
                var v = y(arguments, t);
                C(false, "authenticateGoogleUser", {}, v, true, true).send([r, t])
            }, authenticateTwitterUser:function (r, t, v, x, A) {
                req = d.createRequest(false, "authenticateTwitterUser", {twitterUserID:r, oauthToken:t, oauthSecret:v}, arguments[arguments.length - 1] === A ? {} : arguments[arguments.length - 1],
                        true, false);
                req.send([x, A])
            }, reportUserChange:function (r, t, v, x) {
                var A = y(arguments, x), G = {userID:r.UserID, email:r.Email, username:r.FName, userTrackingID:r.userTrackingID, picture:r.Picture, privacy:_.defined(t) ? t : r.Privacy, isPremium:r.IsPremium};
                C(false, "reportUserChange", G, A, false, true).send([v, x])
            }, logoutUser:function (r, t) {
                var v = y(arguments, t);
                C(false, "logoutUser", {}, v).send([r, t])
            }, userForgotPassword:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "userForgotPassword", {usernameOrEmail:r}, x).send([t, v])
            },
                resetPassword:function (r, t, v, x, A) {
                    var G = y(arguments, A);
                    C(false, "resetPassword", {usernameOrEmail:r, secretResetCode:t, newPassword:v}, G, true).send([x, A])
                }, changePassword:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "changePassword", {oldPassword:r, newPassword:t}, A, true, true).send([v, x])
            }, registerUser:function (r, t, v, x, A, G, J, L, M, N, P, O) {
                var Q = y(arguments, O);
                C(false, "registerUser", {username:r, password:t, firstName:v, lastName:x, emailAddress:A, sex:G, birthDate:J, flags:L, inviteID:M, savePassword:N}, Q, true, true).send([P,
                    O])
            }, userDisableAccount:function (r, t, v, x, A, G) {
                var J = y(arguments, G);
                C(false, "userDisableAccount", {password:r, reason:t, details:v, contact:x}, J, true, true).send([A, G])
            }, getIsUsernameEmailAvailable:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "getIsUsernameEmailAvailable", {username:r, emailAddress:t}, A).send([v, x])
            }, getUserByInviteID:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "getUserByInviteID", {inviteID:r}, x, true).send([t, v])
            }, sendInvites:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "sendInvites", {emailAddresses:r},
                        x).send([t, v])
            }, getUserSettings:function (r, t) {
                var v = y(arguments, t);
                C(false, "getUserSettings", {}, v).send([r, t])
            }, getUserTopArtists:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "getUserTopArtists", {userID:r}, x).send([t, v])
            }, changeUserInfoEx:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "changeUserInfoEx", {shitToChange:r, password:t}, A, true).send([v, x])
            }, changeNotificationSettings:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "changeNotificationSettings", {newValue:r}, x).send([t, v])
            }, changePrivacySettings:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "changePrivacySettings", {newValue:r}, x).send([t, v])
            }, changeFeedSettings:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "changeFeedSettings", {newValue:r}, x).send([t, v])
            }, getSubscriptionDetails:function (r, t) {
                var v = y(arguments, t);
                C(false, "getSubscriptionDetails", {}, v, true, true).send([r, t])
            }, userGetSongsInLibrary:function (r, t, v, x, A) {
                t = _.orEqual(t, 0);
                var G = y(arguments, A);
                C(v, "userGetSongsInLibrary", {userID:r, page:t}, G).send([x, A])
            }, userGetLibraryTSModified:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "userGetLibraryTSModified", {userID:r}, x).send([t, v])
            }, userAddSongsToLibrary:function (r, t, v) {
                var x = y(arguments, v);
                x = C(false, "userAddSongsToLibrary", {songs:r}, x);
                x.promise().then(t, v);
                x.queue("library")
            }, userRemoveSongsFromLibrary:function (r, t, v, x, A, G) {
                var J = y(arguments, G);
                J = C(false, "userRemoveSongsFromLibrary", {userID:r, songIDs:t, albumIDs:v, artistIDs:x}, J);
                J.promise().then(A, G);
                J.queue("library")
            }, getFavorites:function (r, t, v, x, A) {
                t = t || "Songs";
                var G = y(arguments, A);
                C(v,
                        "getFavorites", {userID:r, ofWhat:t}, G).send([x, A])
            }, favorite:function (r, t, v, x, A) {
                var G = y(arguments, A);
                G = C(false, "favorite", {what:r, ID:t, details:v}, G);
                G.promise().then(x, A);
                G.queue("library")
            }, unfavorite:function (r, t, v, x) {
                var A = y(arguments, x);
                A = C(false, "unfavorite", {what:r, ID:t}, A);
                A.promise().then(v, x);
                A.queue("library")
            }, getUserSidebar:function (r, t) {
                var v = y(arguments, t);
                C(false, "getUserSidebar", {}, v).send([r, t])
            }, addShortcutToUserSidebar:function (r, t, v, x, A) {
                var G = y(arguments, A);
                G = C(false, "addShortcutToUserSidebar",
                        {what:r, id:t, name:v}, G);
                G.promise().then(x, A);
                G.queue("library")
            }, removeShortcutFromUserSidebar:function (r, t, v, x) {
                var A = y(arguments, x);
                A = C(false, "removeShortcutFromUserSidebar", {what:r, id:t}, A);
                A.promise().then(v, x);
                A.queue("library")
            }, userGetPlaylists:function (r, t, v, x) {
                var A = y(arguments, x);
                C(t, "userGetPlaylists", {userID:r}, A).send([v, x])
            }, createPlaylist:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(false, "createPlaylist", {playlistName:r, songIDs:t, playlistAbout:v}, G).send([x, A])
            }, deletePlaylist:function (r, t, v, x) {
                var A = y(arguments, x);
                A = C(false, "deletePlaylist", {playlistID:r, name:t}, A);
                A.promise().then(v, x);
                A.queue("playlist")
            }, playlistUndelete:function (r, t, v) {
                var x = y(arguments, v);
                x = C(false, "playlistUndelete", {playlistID:r}, x);
                x.promise().then(t, v);
                x.queue("playlist")
            }, overwritePlaylist:function (r, t, v, x, A, G) {
                var J = y(arguments, G);
                J = C(false, "overwritePlaylist", {playlistID:r, playlistName:t, songIDs:v, songs:x}, J);
                J.promise().then(A, G);
                J.queue("playlist")
            }, playlistAddSongToExisting:function (r, t, v, x, A) {
                var G =
                        y(arguments, A);
                G = C(false, "playlistAddSongToExisting", {playlistID:r, songID:t, song:v}, G);
                G.promise().then(x, A);
                G.queue("playlist")
            }, renamePlaylist:function (r, t, v, x, A) {
                var G = y(arguments, A);
                G = C(false, "renamePlaylist", {playlistID:r, playlistName:t, broadcast:v}, G);
                G.promise().then(x, A);
                G.queue("playlist")
            }, setPlaylistAbout:function (r, t, v, x, A) {
                var G = y(arguments, A);
                G = C(false, "setPlaylistAbout", {playlistID:r, about:t, broadcast:v}, G);
                G.promise().then(x, A);
                G.queue("playlist")
            }, playlistSetCollaboration:function (r, t, v, x) {
                var A = y(arguments, x);
                A = C(false, "playlistSetCollaboration", {playlistID:r, enabled:t}, A);
                A.promise().then(v, x);
                A.queue("playlist")
            }, playlistSetUserPermissions:function (r, t, v, x, A) {
                var G = y(arguments, A);
                G = C(false, "playlistSetUserPermissions", {playlistID:r, userID:t, permissions:v}, G);
                G.promise().then(x, A);
                G.queue("playlist")
            }, tagRadioGetAllSongs:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "tagRadioGetAllSongs", {tagID:r}, x).send([t, v])
            }, getResultsFromSearch:function (r, t, v, x, A) {
                var G = y(arguments, A);
                G = C(true, "getResultsFromSearch", {query:r, type:t, guts:GS.guts ? GS.getGuts().shouldLog : 0, ppOverride:v}, G);
                t === "Artists" && G.successFilters.push(function (J) {
                    if ($.isArray(J.result))J.result = _.map(J.result, function (L) {
                        L.hasOwnProperty("AlbumID") && delete L.AlbumID;
                        L.hasOwnProperty("AlbumName") && delete L.AlbumName;
                        L.hasOwnProperty("SongName") && delete L.SongName;
                        return L
                    });
                    return J
                });
                G.send([x, A])
            }, getSearchSuggestion:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "getSearchSuggestion", {query:r}, x).send([t, v])
            },
                getAutocomplete:function (r, t, v, x) {
                    var A = y(arguments, x);
                    C(true, "getAutocomplete", {query:r, type:t}, A).send([v, x])
                }, getProfileFeed:function (r, t, v, x) {
                var A = y(arguments, x);
                C(1E4, "getProfileFeed", {lastDocumentID:r, lastEventID:t}, A).send([v, x])
            }, getUserProfileFeed:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(1E4, "getUserProfileFeed", {userID:r, lastDocumentID:t, lastEventID:v}, G).send([x, A])
            }, getCombinedFeed:function (r, t, v, x) {
                var A = y(arguments, x);
                C(1E4, "getCombinedFeed", {excludeUsers:r, lastEventID:t}, A).send([v,
                    x])
            }, getUserCombinedFeed:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(3E4, "getUserCombinedFeed", {userID:r, excludeUsers:t, lastEventID:v}, G).send([x, A])
            }, getUserFeedEvent:function (r, t, v) {
                var x = y(arguments, v);
                C(3E4, "getUserFeedEvent", {eventID:r}, x).send([t, v])
            }, getInterestingEvents:function (r, t, v) {
                var x = y(arguments, v);
                C(3E4, "getInterestingEvents", {limit:r}, x).send([t, v])
            }, getArtistProfileFeed:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(false, "getArtistProfileFeed", {artistID:r, lastDocumentID:t, lastEventID:v},
                        G).send([x, A])
            }, hideUserEvent:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "hideUserEvent", {eventID:r}, x).send([t, v])
            }, changeFollowFlags:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "changeFollowFlags", {userIDsFlags:r}, x).send([t, v])
            }, sendFeedBroadcast:function (r, t, v, x, A, G) {
                var J = y(arguments, G);
                C(false, "sendFeedBroadcast", {what:r, ID:t, people:v, message:x}, J).send([A, G])
            }, addEventComment:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "addEventComment", {eventID:r, comment:t}, A).send([v, x])
            }, hideEventComment:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "hideEventComment", {eventID:t, commentID:r}, A).send([v, x])
            }, getUserNotifications:function (r, t) {
                var v = y(arguments, t);
                C(6E4, "getUserNotifications", {}, v).send([r, t])
            }, feedsBanArtist:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "feedsBanArtist", {artistID:r}, x).send([t, v])
            }, feedsUnbanArtist:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "feedsUnbanArtist", {artistID:r}, x).send([t, v])
            }, feedsGetBannedArtists:function (r, t) {
                var v = y(arguments, t);
                C(false, "feedsGetBannedArtists",
                        {}, v).send([r, t])
            }, feedsRemoveEventFromProfile:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "feedsRemoveEventFromProfile", {type:r, time:t}, A).send([v, x])
            }, logTargetedThemeImpression:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "logTargetedThemeImpression", {themeID:r}, x).send([t, v])
            }, logThemeOutboundLinkClick:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "logThemeOutboundLinkClick", {themeID:r, linkID:t}, A).send([v, x])
            }, provideSongFeedbackMessage:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "provideSongFeedbackMessage",
                        {songID:r, message:t}, A).send([v, x])
            }, provideSongFeedbackVote:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(false, "provideSongFeedbackVote", {songID:r, vote:t, artistID:v}, G).send([x, A])
            }, sendShare:function (r, t, v, x, A, G, J, L) {
                var M = y(arguments, L);
                M = C(false, "sendShare", {what:r, ID:t, people:v, country:this.country, override:x, message:A}, M);
                if (G)M.overrideHeaders.privacy = 1;
                M.send([J, L]);
                GS.getGuts().logEvent("itemSharePerformed", {type:r, id:t})
            }, getContactInfoForFollowers:function (r, t) {
                var v = y(arguments, t);
                C(false,
                        "getContactInfoForFollowers", {}, v).send([r, t])
            }, getSongkickEventsFromArtists:function (r, t, v, x) {
                var A = y(arguments, x);
                C(true, "getSongkickEventsFromArtists", {artistIDs:r, names:t}, A).send([v, x])
            }, getGoogleAuthToken:function (r, t, v, x) {
                var A = "EscapeMG-Grooveshark-" + this.clientRevision, G = y(arguments, x);
                C(false, "getGoogleAuthToken", {Email:r, Passwd:t, source:A}, G, true).send([v, x])
            }, getGoogleContacts:function (r, t, v) {
                var x = y(arguments, v);
                req = C(false, "getGoogleContacts", {authToken:r}, x, false, true);
                req.send([t,
                    v])
            }, getDetailsForBroadcast:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "getDetailsForBroadcast", {songID:r}, x).send([t, v])
            }, broadcastSong:function (r, t, v, x, A, G, J, L, M) {
                var N = y(arguments, M);
                C(false, "broadcastSong", {songID:r, message:t, username:v, password:x, saveCredentials:A, service:G, song:J}, N, true).send([L, M])
            }, getUserFacebookData:function (r, t) {
                var v = y(arguments, t);
                C(false, "getUserFacebookDataEx", {}, v, true).send([r, t])
            }, saveUserFacebookData:function (r, t, v, x, A, G, J, L) {
                var M = y(arguments, L);
                C(false, "saveUserFacebookDataEx",
                        {facebookUserID:r, sessionKey:t, accessToken1:v, accessToken3:x, flags:A, accessTokenEx:G}, M, true, true).send([J, L])
            }, updateUserFacebookData:function (r, t, v, x, A, G, J, L) {
                var M = y(arguments, L);
                C(false, "updateUserFacebookData", {facebookUserID:r, sessionKey:t, accessToken1:v, accessToken3:x, flags:A, accessTokenEx:G}, M, true, true).send([J, L])
            }, removeUserFacebookData:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "removeUserFacebookData", {facebookUserID:r}, x).send([t, v])
            }, getUserGoogleData:function (r, t) {
                var v = y(arguments,
                        t);
                C(false, "getUserGoogleData", {}, v, true, true).send([r, t])
            }, saveUserGoogleData:function (r, t) {
                var v = y(arguments, t);
                C(false, "saveUserGoogleData", {}, v).send([r, t])
            }, updateUserGoogleData:function (r, t) {
                req = d.createRequest(false, "updateUserGoogleData", {}, arguments[arguments.length - 1] === t ? {} : arguments[arguments.length - 1]);
                req.send([r, t])
            }, removeUserGoogleData:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "removeUserGoogleData", {googleID:r}, x).send([t, v])
            }, getUserTwitterData:function (r, t) {
                req = d.createRequest(false,
                        "getUserTwitterData", {}, arguments[arguments.length - 1] === t ? {} : arguments[arguments.length - 1], true, true);
                req.send([r, t])
            }, saveUserTwitterData:function (r, t, v, x, A) {
                req = d.createRequest(false, "saveUserTwitterData", {twitterUserID:r, oauthToken:t, oauthSecret:v}, arguments[arguments.length - 1] === A ? {} : arguments[arguments.length - 1]);
                req.send([x, A])
            }, updateUserTwitterData:function (r, t, v, x, A) {
                req = d.createRequest(false, "updateUserTwitterData", {twitterUserID:r, oauthToken:t, oauthSecret:v}, arguments[arguments.length -
                        1] === A ? {} : arguments[arguments.length - 1]);
                req.send([x, A])
            }, removeUserTwitterData:function (r, t, v) {
                req = d.createRequest(false, "removeUserTwitterData", {twitterUserID:r}, arguments[arguments.length - 1] === v ? {} : arguments[arguments.length - 1]);
                req.send([t, v])
            }, postTwitterStatus:function (r, t, v, x, A) {
                req = d.createRequest(false, "postTwitterStatus", {message:r, oauthToken:t, oauthSecret:v}, arguments[arguments.length - 1] === A ? {} : arguments[arguments.length - 1]);
                req.send([x, A])
            }, getTwitterFriends:function (r, t, v, x, A) {
                req = d.createRequest(false,
                        "getTwitterFriends", {twitterUserID:r, oauthToken:t, oauthSecret:v}, arguments[arguments.length - 1] === A ? {} : arguments[arguments.length - 1]);
                req.send([x, A])
            }, getTwitterFollowers:function (r, t, v, x, A) {
                req = d.createRequest(false, "getTwitterFollowers", {twitterUserID:r, oauthToken:t, oauthSecret:v}, arguments[arguments.length - 1] === A ? {} : arguments[arguments.length - 1]);
                req.send([x, A])
            }, getUsernameSuggestions:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(true, "getUsernameSuggestions", {baseUsername:r, fullName:t, idOrRand:v},
                        G).send([x, A])
            }, registerFacebookUser:function (r, t, v, x, A, G, J, L, M, N, P, O, Q, S, R) {
                var T = y(arguments, R);
                C(false, "registerFacebookUser", {username:r, firstName:t, emailAddress:v, sex:x, birthDate:A, flags:G, inviteID:J, facebookUserID:L, sessionKey:M, accessToken1:N, accessToken3:P, accessTokenEx:O, facebookFlags:Q}, T, true, true).send([S, R])
            }, getGroovesharkUsersFromFacebookUserIDs:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "getGroovesharkUsersFromFacebookUserIDs", {facebookUserIDs:r}, x).send([t, v])
            }, getGroovesharkUsersFromTwitterUserIDs:function (r, t, v) {
                req = d.createRequest(false, "getGroovesharkUsersFromTwitterUserIDs", {twitterUserIDs:r}, arguments[arguments.length - 1] === v ? {} : arguments[arguments.length - 1]);
                req.send([t, v])
            }, registerGoogleUser:function (r, t, v, x, A, G, J, L, M) {
                var N = y(arguments, M);
                C(false, "registerGoogleUser", {username:r, firstName:t, emailAddress:v, sex:x, birthDate:A, flags:G, inviteID:J}, N, true, true).send([L, M])
            }, registerTwitterUser:function (r, t, v, x, A, G, J, L, M, N, P, O) {
                req = d.createRequest(false, "registerTwitterUser", {username:r, firstName:t,
                    emailAddress:v, sex:x, birthDate:A, flags:G, inviteID:J, twitterUserID:L, oauthToken:M, oauthSecret:N}, arguments[arguments.length - 1] === O ? {} : arguments[arguments.length - 1], true, true);
                req.send([P, O])
            }, updateLastfmService:function (r, t, v, x, A, G, J) {
                var L = y(arguments, J);
                C(false, "updateLastfmService", {session:r, token:t, username:v, flagsAdd:x, flagsRemove:A}, L).send([G, J])
            }, saveLastfmService:function (r, t, v, x, A, G) {
                var J = y(arguments, G);
                C(false, "saveLastfmService", {session:r, token:t, username:v, flags:x}, J).send([A, G])
            },
                getLastfmService:function (r, t) {
                    var v = y(arguments, t);
                    C(false, "getLastfmService", {}, v).send([r, t])
                }, removeLastfmService:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "removeLastfmService", {lastfmUsername:r}, x).send([t, v])
            }, saveUserFlattrData:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(false, "saveUserFlattrData", {accessToken:r, flattrUsername:t, flags:v}, G, true).send([x, A])
            }, updateUserFlattrData:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(false, "updateUserFlattrData", {accessToken:r, flattrUsername:t, flags:v},
                        G, true).send([x, A])
            }, getUserFlattrData:function (r, t) {
                var v = y(arguments, t);
                C(false, "getUserFlattrData", {}, v, true).send([r, t])
            }, removeUserFlattrData:function (r, t) {
                var v = y(arguments, t);
                C(false, "removeUserFlattrData", {}, v).send([r, t])
            }, getAffiliateDownloadURLs:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "getAffiliateDownloadURLs", {songName:r, artistName:t}, A).send([v, x])
            }, getServiceStatus:function (r, t) {
                var v = y(arguments, t);
                C(false, "getServiceStatus", {}, v).send([r, t])
            }, provideVIPFeedback:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(false, "provideVIPFeedback", {fromAddress:r, message:t, type:v}, G).send([x, A])
            }, artistGetSimilarArtists:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "artistGetSimilarArtists", {artistID:r}, x).send([t, v])
            }, getThemeFromDFP:function (r, t, v) {
                var x = y(arguments, v);
                x = C(false, "getThemeFromDFP", {paramString:r}, x, false, true);
                x.type = "dfp";
                x.send([t, v])
            }, getNotificationFromDFP:function (r, t, v) {
                var x = y(arguments, v);
                x = C(false, "getNotificationFromDFP", {paramString:r}, x, false, true);
                x.type =
                        "dfp";
                x.send([t, v])
            }, getVideoFromDFP:function (r, t, v) {
                var x = y(arguments, v);
                x = C(false, "getVideoFromDFP", {paramString:r}, x, false, true);
                x.type = "dfp";
                x.send([t, v])
            }, getItemByPageName:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "getItemByPageName", {name:r}, x).send([t, v])
            }, getPageNameByIDType:function (r, t, v, x) {
                var A = y(arguments, x);
                A = C(true, "getPageNameByIDType", {id:r, type:t}, A);
                A.promise().then(v, x);
                A.promise().then(function (G) {
                    G.name && window.GS && GS.router && GS.router.cachePageName(G.name, t, r)
                });
                A.send()
            },
                getPageInfoByIDType:function (r, t, v, x) {
                    var A = y(arguments, x);
                    A = C(true, "getPageInfoByIDType", {id:r, type:t}, A);
                    A.promise().then(v, x);
                    A.promise().then(function (G) {
                        G.Name && window.GS && GS.router && GS.router.cachePageName(G.Name, t, r)
                    });
                    A.send()
                }, userCollaborativePlaylistChanged:function (r, t, v) {
                var x = y(arguments, v);
                C(true, "userCollaborativePlaylistChanged", {playlist:r}, x).send([t, v])
            }, userGetPoints:function (r, t) {
                var v = y(arguments, t);
                C(false, "userGetPoints", {}, v).send([r, t])
            }, getClearvoiceMemberInfo:function (r, t, v) {
                var x = y(arguments, v), A = {};
                if (r)A.guid = r;
                C(false, "getClearvoiceMemberInfo", A, x, true).send([t, v])
            }, getUserIDByClearvoiceEmail:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "getUserIDByClearvoiceEmail", {email:r}, x, true).send([t, v])
            }, saveClearvoiceMemberInfo:function (r, t, v, x, A, G) {
                var J = y(arguments, G);
                C(false, "saveClearvoiceMemberInfo", {guid:r, fName:t, lName:v, email:x}, J, true).send([A, G])
            }, addClearvoiceAnswers:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "addClearvoiceAnswers", {questionsAndAnswers:r},
                        x, true).send([t, v])
            }, removeClearvoiceFromUser:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "removeClearvoiceFromUser", {givePoints:r}, x).send([t, v])
            }, getUserSurveys:function (r, t, v) {
                var x = y(arguments, v);
                C(false, "getUserSurveys", {userID:r}, x).send([t, v])
            }, getAvailableSurveys:function (r, t) {
                var v = y(arguments, t);
                C(false, "getAvailableSurveys", {}, v).send([r, t])
            }, saveUserAnswers:function (r, t, v, x, A, G) {
                var J = y(arguments, G);
                C(false, "saveUserAnswers", {surveyID:r, userID:t, questionsAndAnswers:v, finalize:x}, J, true,
                        true).send([A, G])
            }, finalizeUserSurvey:function (r, t, v, x) {
                var A = y(arguments, x);
                C(false, "finalizeUserSurvey", {surveyID:r, userID:t}, A, true, true).send([v, x])
            }, addKinesisToUser:function (r, t) {
                var v = y(arguments, t);
                C(false, "addKinesisToUser", {}, v).send([r, t])
            }, removeKinesisFromUser:function (r, t) {
                var v = y(arguments, t);
                C(false, "removeKinesisFromUser", {}, v).send([r, t])
            }, getKinesisUserPassword:function (r, t) {
                var v = y(arguments, t);
                C(false, "getKinesisUserPassword", {}, v).send([r, t])
            }, submitPlaylistForCampaign:function (r, t, v, x) {
                var A = y(arguments, x);
                (new d("submitPlaylistForCampaign", {playlistID:r, campaignID:t}, A, false)).send([v, x])
            }, submitSongVoteForCampaign:function (r, t, v, x) {
                var A = y(arguments, x);
                (new d("submitSongVoteForCampaign", {songID:r, campaignID:t}, A, false)).send([v, x])
            }, getPlaylistsForCampaign:function (r, t, v) {
                var x = y(arguments, v);
                (new d("getPlaylistsForCampaign", {campaignID:r}, x, false)).send([t, v])
            }, submitEmailForCampaign:function (r, t, v, x) {
                var A = y(arguments, x);
                (new d("submitEmailForCampaign", {campaignID:r,
                    email:t}, A, false)).send([v, x])
            }, submitPhoneNumberForCampaign:function (r, t, v, x) {
                var A = y(arguments, x);
                (new d("submitPhoneNumberForCampaign", {campaignID:r, phoneNumber:t}, A, false)).send([v, x])
            }, getSubscriptionHistory:function (r, t) {
                var v = y(arguments, t);
                C(true, "getSubscriptionHistory", {}, v, true, true).send([r, t])
            }, getPartyHash:function (r, t) {
                var v = y(arguments, t);
                v = C(false, "getPartyHash", {}, v);
                v.promise().then(r, t);
                v.queue("playlist")
            }, suggestFlattr:function (r, t, v, x, A) {
                var G = y(arguments, A);
                C(false, "suggestFlattr",
                        {urls:r, delay:t, reverse:v}, G, false, true).send([x, A])
            }, reportBadAd:function (r, t, v, x, A, G) {
                var J = y(arguments, G);
                C(false, "reportBadAd", {placement:r, desc:t, info:v, type:x}, J).send([A, G])
            }
            })
})();

