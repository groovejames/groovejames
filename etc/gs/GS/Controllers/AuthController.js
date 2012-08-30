GS.Controllers.BaseController.extend("GS.Controllers.AuthController", {onWindow:true}, {init:function () {
    GS.service = GS.service || GS.Controllers.ServiceController.instance();
    if (!gsConfig.user.UserID)gsConfig.user.UserID = -1;
    this._handleLoginChange(GS.Models.AuthUser.wrap(gsConfig.user));
    this._super();
    this.subscribe("gs.auth.update", this.callback(this._onAuthUpdate))
}, appReady:function () {
    if (GS.user.UserID > 0 && GS.user.TSDOB !== "" && GS.user.UserID != 42) {
        var c = new Date, a = GS.user.TSDOB.split("-"), b = parseInt(a[1],
                10) - 1;
        a = parseInt(a[2], 10);
        c.getMonth() == b && c.getDate() == a && GS.getNotice().displayPerAnum()
    }
    GS.getGuts().gaSetCustomVariable(1, "User", GS.user.getUserStringForAnalytics(), 2)
}, login:function (c, a, b, d, f) {
    GS.service.authenticateUser(c, a, b, this.callback(this._loginSuccess, "normal", d, f), this.callback(this._loginFailed, "normal", f))
}, loginViaFacebook:function () {
    GS.getLightbox().close();
    GS.getLightbox().open("forget", {message:"", title:"POPUP_RESET_PASSWORD_TITLE_FACEBOOK_FAIL", facebookBroken:true})
}, loginViaTwitter:function (c, a) {
    GS.getTwitter().login(this.callback(this._loginSuccess, "twitter", c, a), this.callback(this._loginFailed, "twitter", a))
}, loginViaGoogle:function (c, a) {
    GS.getGoogle().login(this.callback(this._loginSuccess, "google", c, a), this.callback(this._loginFailed, "google", a))
}, _loginSuccess:function (c, a, b, d) {
    if (d && d.userID === 0 || !d)return this._loginFailed(c, b, d);
    d.authType = c;
    c = {};
    if (window.GS && GS.Controllers.PageController.activePageName === "SurveysController")c.doNotReset = true;
    this._updateUser(c, {User:d});
    if (GS.airbridge &&
            GS.airbridge.isDesktop && !GS.user.subscription.canUseDesktop() || gsConfig.isPreview && parseInt(d.isPremium, 10) !== 1 && parseInt(d.userID, 10) % 5 != 0) {
        if ($.isFunction(b)) {
            d.error = "POPUP_SIGNUP_LOGIN_FORM_PREMIUM_REQUIRED_ERROR";
            b(d)
        }
    } else $.isFunction(a) && a(d);
    GS.getGuts().gaSetCustomVariable(1, "User", GS.user.getUserStringForAnalytics(), 2);
    return d
}, _loginFailed:function (c, a, b) {
    b || (b = {});
    b.authType = c;
    $.isFunction(a) && a(b);
    return b
}, logout:function (c) {
    GS.service.logoutUser(this.callback(this._logoutSuccess,
            c), this.callback(this._logoutFailed))
}, _logoutSuccess:function (c) {
    GS.user.clearData();
    GS.getGuts().logEvent("logout", {});
    GS.getGuts().endContext("userID");
    GS.router.setHash("/");
    this._handleLoginChange(GS.Models.AuthUser.wrap({userTrackingID:GS.user.userTrackingID}));
    GS.getGuts().gaSetCustomVariable(1, "User", GS.user.getUserStringForAnalytics(), 2);
    $.isFunction(c) && c()
}, _logoutFailed:function () {
}, signup:function (c, a, b, d, f, g, k, m, h, n) {
    var q = this._getInviteCode();
    GS.service.registerUser(c, a, b, "", d, f, g,
            k, q, m, this.callback(this._signupSuccess, "normal", q, d, h, n), this.callback(this._signupFailed, "normal", n))
}, signupViaFacebook:function (c, a, b, d, f, g, k, m, h) {
    var n = this._getInviteCode();
    k.accessToken1 ? GS.service.registerFacebookUser(c, a, b, d, f, g, n, k.facebookUserID, k.sessionKey, k.accessToken1, k.accessToken3, null, k.flags, this.callback(this._signupSuccess, "facebook", n, b, m, h), this.callback(this._signupFailed, "facebook", h)) : GS.service.registerFacebookUser(c, a, b, d, f, g, n, k.facebookUserID, "", "", "", k.accessTokenEx,
            k.flags, this.callback(this._signupSuccess, "facebook", n, b, m, h), this.callback(this._signupFailed, "facebook", h))
}, signupViaGoogle:function (c, a, b, d, f, g, k, m) {
    var h = this._getInviteCode();
    GS.service.registerGoogleUser(c, a, b, d, f, g, h, this.callback(this._signupSuccess, "google", h, b, k, m), this.callback(this._signupFailed, "google", m))
}, signupViaTwitter:function (c, a, b, d, f, g, k, m, h) {
    var n = this._getInviteCode();
    GS.service.registerTwitterUser(c, a, b, d, f, g, n, k.twitterUserID, k.oauthToken, k.oauthSecret, this.callback(this._signupSuccess,
            "twitter", n, b, m, h), this.callback(this._signupFailed, "twitter", h))
}, _signupSuccess:function (c, a, b, d, f, g) {
    if (g && g.userID === 0 || !g)return this._signupFailed(c, f, g);
    g.authType = c;
    g.Email = b;
    if (a) {
        GS.store.set("lastInviteCode", null);
        gsConfig.inviteCode = null;
        GS.service.getUserByInviteID(a, this.callback(this._getInviterSuccess))
    }
    g.doNotReset = true;
    GS.service.getUserByID(g.userID, this.callback(this._updateUser, g));
    $.isFunction(d) && d(g);
    return g
}, _signupFailed:function (c, a, b) {
    b || (b = {});
    b.authType = c;
    $.isFunction(a) &&
    a(b);
    return b
}, _getInviteCode:function () {
    var c = "", a = new Date, b = GS.store.get("lastInviteCode");
    if (b)if (b.expires && b.expires > a.valueOf())c = b.inviteCode; else GS.store.remove("lastInviteCode"); else if (gsConfig.inviteCode)c = gsConfig.inviteCode;
    return c
}, _getInviterSuccess:function (c) {
    var a = GS.Models.User.wrap(c);
    GS.getLightbox().open({type:"followInviter", view:{header:"POPUP_FOLLOW_INVITER_TITLE", messageHTML:(new GS.Models.DataString($.localize.getString("POPUP_FOLLOW_INVITER_MESSAGE"), {user:a.Name})).render(),
        buttonsLeft:[
            {label:"POPUP_FOLLOW_INVITER_CANCEL", className:"close"}
        ], buttonsRight:[
            {label:"POPUP_FOLLOW_INVITER_FOLLOW", className:"submit"}
        ]}, callbacks:{".submit":function () {
        GS.user.addToUserFavorites(a.UserID)
    }}})
}, _updateUser:function (c, a) {
    a.User.UserID = c.userID;
    c.doNotReset || GS.router.setHash("/");
    var b = $.extend({}, c, a.User);
    this._handleLoginChange(GS.Models.AuthUser.wrapFromService(b), c);
    $("#notifications li.survey").remove()
}, _handleLoginChange:function (c, a) {
    var b = GS.user;
    GS.user = c;
    GS.service.reportUserChange(GS.user);
    GS.user.UserID > 0 && !GS.Models.User.getOneFromCache(GS.user.UserID) && GS.Models.User.wrap(GS.user);
    if (b && b.isDirty) {
        var d = {};
        _.forEach(b.playlists, function (g) {
            var k = [], m = g.PlaylistID;
            _.forEach(g.songs, function (h) {
                k.push(h.SongID)
            });
            GS.user.createPlaylist(g.PlaylistName, k, g.Description, function () {
                d[m] = g.PlaylistID
            }, null, false)
        });
        var f = _.map(b.library.songs, function (g) {
            return g.SongID
        });
        GS.user.addToLibrary(f, false);
        _.forEach(b.favorites.artists, function (g) {
            GS.user.addToArtistFavorites(g.ArtistID, false)
        });
        _.forEach(b.favorites.playlists, function (g) {
            GS.user.addToPlaylistFavorites(g.PlaylistID, false)
        });
        _.forEach(b.favorites.songs, function (g) {
            GS.user.addToSongFavorites(g.SongID, false)
        });
        _.forEach(b.favorites.users, function (g) {
            GS.user.addToUserFavorites(g.UserID, false)
        });
        _.forEach(b.sidebar.stations, function (g) {
            b.defaultStations.indexOf(g) == -1 && GS.user.addToShortcuts("station", g, "", false)
        });
        _.forEach(b.sidebar.playlists, function (g) {
            if (g < 0)g = d[g];
            (g = GS.Models.Playlist.getOneFromCache(g)) && GS.user.addToShortcuts("playlist",
                    g.PlaylistID, g.PlaylistName, false)
        });
        _.forEach(b.sidebar.subscribedPlaylists, function (g) {
            (g = GS.Models.Playlist.getOneFromCache(g)) && GS.user.addToShortcuts("playlist", g.PlaylistID, g.PlaylistName, false)
        });
        _.forEach(b.sidebar.songs, function (g) {
            (g = GS.Models.Song.getOneFromCache(g)) && GS.user.addToShortcuts("song", g.SongID, g.SongName, false)
        });
        _.forEach(b.sidebar.artists, function (g) {
            (g = GS.Models.Artist.getOneFromCache(g)) && GS.user.addToShortcuts("artist", g.ArtistID, g.ArtistName, false)
        });
        _.forEach(b.sidebar.albums,
                function (g) {
                    (g = GS.Models.Album.getOneFromCache(g)) && GS.user.addToShortcuts("album", g.AlbumID, g.AlbumName, false)
                })
    }
    GS.service.reportUserChange(GS.user);
    $.publish("gs.auth.update", a);
    if (!GS.user.subscription.canUseDesktop() && GS.Controllers.AirbridgeController.instance().isDesktop || gsConfig.isPreview && !GS.user.subscription.isPremium() && GS.user.UserID % 5 != 0) {
        if (f = GS.getLightbox ? GS.getLightbox() : null)$("#lightbox_wrapper .lbcontainer.gs_lightbox_login:visible").length || f.open("login", {premiumRequired:true,
            showPreview:true, notCloseable:true}); else gsConfig.lightboxOnInit = {type:"login", defaults:{premiumRequired:true, showPreview:true, notCloseable:true}};
        GS.player && GS.player.pauseNextSong()
    }
    GS.user.isLoggedIn || $.publish("gs.auth.library.update");
    if (GS.getGuts && GS.user && GS.user.UserID > 0) {
        f = _.browserDetect();
        GS.getGuts().logEvent("login", {userID:GS.user.UserID, browser:f.browser, browserVersion:f.version, os:navigator.platform, ip:gsConfig.remoteAddr});
        GS.getGuts().beginContext({userID:GS.user.UserID})
    }
}, _onAuthUpdate:function () {
    $.isFunction(this.vipUpdateCallback) &&
            GS.user.subscription.isPremium() && this.vipUpdateCallback();
    this.vipUpdateCallback = null;
    $.isFunction(this.authUpdateCallback) && this.authUpdateCallback();
    this.authUpdateCallback = null
}});

