GS.Controllers.BaseController.extend("GS.Controllers.LastfmController", {isGSSingleton:true, preSetup:function () {
    var c = GS.Controllers.BaseController.singletonCallback, a = $.subscribe;
    a("gs.auth.update", c("lastfm", "update", true));
    a("gs.player.nowplaying", c("lastfm", "onNowPlaying"));
    a("gs.player.playing.continue", c("lastfm", "onSongPlaying"))
}}, {SERVICE_ID:2, API_KEY:"b1ecfd8a5f8ec4dbb4cdacb8f3638f6d", P_VERSION:"1.2.1", URL_USER_AUTH:"http://www.last.fm/api/auth", URL_AUDIOSCROBBLER:"http://ws.audioscrobbler.com/2.0/",
    CLIENT_ID:"gvs", CLIENT_VERSION:"1", MINIMUM_DURATION:240, SCROBBLING_FLAG:1, FAVORITES_FLAG:2, DEFAULT_FLAGS:1, authToken:null, sessionKey:null, username:null, sessionID:null, flags:0, scrobblingEnabled:false, lastError:null, nowPlaying:null, lastPlayed:null, currentListening:null, canUpdate:false, onUpdateSubscription:"gs.lastfm.profile.update", init:function () {
        if (!window.confirmLastfmConnection)window.confirmLastfmConnection = this.callback(function (c) {
            console.log("last.fm confirm connection", c);
            if (this.lastfmOpenerWindow) {
                this.lastfmOpenerWindow.close();
                this.lastfmOpenerWindow = null
            }
            try {
                c = JSON.parse(c)
            } catch (a) {
                this.lastError = "parseError";
                this.loginFailedCallback();
                return
            }
            GS.airbridge && GS.airbridge.isDesktop ? window.setTimeout(function () {
                GS.getLastfm().onLogin(c)
            }, 300) : this.onLogin(c)
        });
        this._super()
    }, appReady:function () {
        this.subscribe("gs.cowbell.ready", this.callback("commReady"))
    }, commReady:function () {
        this.canUpdate = true;
        this.update()
    }, update:function () {
        if (this.canUpdate) {
            this.canUpdate = false;
            GS.user && GS.user.isLoggedIn && GS.user.UserID > 0 && GS.user.Flags &
                    this.SERVICE_ID ? GS.service.getLastfmService(this.callback("onGetService"), this.callback("onGetService")) : this.clearInfo();
            setTimeout(this.callback(function () {
                this.canUpdate = true
            }), 0);
            this.loaded = true
        }
    }, onGetService:function (c) {
        if (c.Session) {
            this.username = c.LastfmUsername;
            this.sessionKey = c.Session;
            this.flags = 1;
            this.scrobblingEnabled = true;
            if (c.FlagScrb) {
                this.flags |= this.SCROBBLING_FLAG;
                this.scrobblingEnabled = true
            }
            if (c.FlagFav)this.flags |= this.FAVORITES_FLAG;
            this.connected = true;
            $.publish("gs.lastfm.profile.update")
        }
    },
    showReAuthLightbox:function () {
        GS.getLightbox().open({type:"reAuthLastfm", view:{header:"POPUP_LASTFM_REAUTH_TITLE", message:"POPUP_LASTFM_REAUTH_MESSAGE", buttonsRight:[
            {label:"POPUP_REAUTH_SUBMIT", className:"submit"}
        ], buttonsLeft:GS.getLastfm().registeredWithLastfm ? [] : [
            {label:"POPUP_LASTFM_REAUTH_CANCEL", className:"close"}
        ]}, callbacks:{".submit":function () {
            GS.getLastfm().logout(function () {
                GS.getLastfm().login(function () {
                    GS.getLightbox().close()
                })
            })
        }, ".close":function () {
            GS.getLastfm().logout(function () {
                GS.getLightbox().close()
            })
        }}})
    },
    login:function (c, a) {
        if (GS.user && GS.user.isLoggedIn) {
            this.loginSuccessCallback = c;
            this.loginFailedCallback = a;
            this.sessionKey = null;
            var b = "http://" + window.location.host + "/lastfmCallback.php?window=" + window.name, d = googleOpenIDPopup.getCenteredCoords(950, 700);
            this.lastfmOpenerWindow = window.open(this.URL_USER_AUTH + "?api_key=" + this.API_KEY + "&cb=" + b, "", "width=950,height=700,left=" + d[0] + ",top=" + d[1]);
            if (GS.airbridge && GS.airbridge.isDesktop)this.lastfmOpenerWindow.parentSandboxBridge = {confirmLastfmConnection:window.confirmLastfmConnection}
        } else a({error:"LASTFM_PROBLEM_NOT_LOGGED_IN_ERROR_MSG"})
    },
    onLogin:function (c) {
        if (c.error || !c.token) {
            this.lastError = c.error;
            this.loginFailedCallback()
        } else {
            if (!this.flags)this.flags = this.DEFAULT_FLAGS;
            if (GS.user.Flags & this.SERVICE_ID || GS.user.Flags & this.LASTFM_ONLY_SERVICE_ID)GS.service.updateLastfmService("", c.token, "", 0, 0, this.callback("onSaveLastfmService", this.loginSuccessCallback, this.loginFailedCallback), this.loginFailedCallback); else {
                GS.service.saveLastfmService("", c.token, "", this.flags, this.callback("onSaveLastfmService", this.loginSuccessCallback,
                        this.loginFailedCallback), this.loginFailedCallback);
                if ((this.flags & this.SCROBBLING_FLAG) > 0)this.scrobblingEnabled = true
            }
        }
    }, onSaveLastfmService:function (c, a, b) {
        if (b.result && b.lastfmData && b.lastfmData.user) {
            this.username = b.lastfmData.user;
            this.sessionKey = b.lastfmData.session;
            this.connected = true;
            $.publish("gs.lastfm.profile.update");
            GS.user.Flags |= this.SERVICE_ID;
            $.isFunction(a) && c()
        } else if (b.result == -1)if (GS.user.Flags & this.SERVICE_ID || GS.user.Flags & this.FACEBOOK_ONLY_SERVICE_ID)GS.service.getLastfmService(this.callback("onGetService",
                c, function () {
                    $.isFunction(a) && a({error:"LASTFM_PROBLEM_CONNECTING_ERROR_MSG"})
                }), function () {
            $.isFunction(a) && a({error:"LASTFM_PROBLEM_CONNECTING_ERROR_MSG"})
        }); else $.isFunction(a) && a({error:"LASTFM_DUPLICATE_ACCOUNT_ERROR_MSG"}); else $.isFunction(a) && a({error:"POPUP_SIGNUP_LOGIN_FORM_LASTFM_ERROR"})
    }, saveFlags:function (c, a, b) {
        var d = 0, f = 0;
        if (c & this.SCROBBLING_FLAG && !(this.flags & this.SCROBBLING_FLAG)) {
            d |= this.SCROBBLING_FLAG;
            this.scrobblingEnabled = true
        } else if (!(c & this.SCROBBLING_FLAG) && this.flags &
                this.SCROBBLING_FLAG)f |= this.SCROBBLING_FLAG;
        if (c & this.FAVORITES_FLAG && !(this.flags & this.FAVORITES_FLAG))d |= this.FAVORITES_FLAG; else if (!(c & this.FAVORITES_FLAG) && this.flags & this.FAVORITES_FLAG)f |= this.FAVORITES_FLAG;
        this.flags = c;
        GS.user.Flags & this.SERVICE_ID || GS.user.Flags & this.LASTFM_ONLY_SERVICE_ID ? GS.service.updateLastfmService("", this.sessionKey, this.username, d, f, this.callback("onSaveLastfmService", a, b), b) : GS.service.saveLastfmService("", this.sessionKey, this.username, d, this.callback("onSaveLastfmService",
                a, b), b)
    }, logout:function (c) {
        this.username ? GS.service.removeLastfmService(this.username, this.callback("onLogout", c)) : GS.service.removeLastfmService(false, this.callback("onLogout", c))
    }, onLogout:function (c) {
        GS.user.Flags = (GS.user.Flags | this.SERVICE_ID) - this.SERVICE_ID;
        this.clearInfo();
        $.isFunction(c) && c()
    }, clearInfo:function () {
        this.sessionKey = null;
        this.username = "";
        this.flags = null;
        this.scrobblingEnabled = this.connected = false;
        $.publish("gs.lastfm.profile.update")
    }, onNowPlaying:function (c) {
        if (!this.currentListening ||
                c.queueSongID != this.currentListening.queueSongID || c.SongID != this.currentListening.songID)this.currentListening = {songID:c.SongID, queueSongID:c.queueSongID, secondsListened:0, scrobbled:false}; else if (GS.player.repeatMode == GS.player.REPEAT_ONE && c.queueSongID == this.currentListening.queueSongID) {
            this.currentListening.scrobbled = false;
            this.currentListening.secondsListened = 0
        } else return;
        if ((this.flags & this.SCROBBLING_FLAG) > 0 && this.scrobblingEnabled && c) {
            this.nowPlaying = {track:c.SongName, artist:c.ArtistName,
                album:c.AlbumName, method:"track.updateNowPlaying", sk:this.sessionKey, api_key:this.API_KEY};
            if (c.TrackNum)this.nowPlaying.trackNumber = String(c.TrackNum);
            if (c.EstimateDuration)this.nowPlaying.duration = Math.round(c.EstimateDuration / 1E3);
            this.getJSON(this.URL_AUDIOSCROBBLER, this.nowPlaying, this.callback("onNowPlayingComplete"), this.callback("onNowPlayingFailed"), true)
        }
    }, onNowPlayingComplete:function (c) {
        if (!c || !c.nowplaying)this.onLastfmError("POPUP_FAIL_SCROBBLE_LASTFM", c);
        GS.getGuts().logEvent("lastfmScrobbleSuccess",
                {userID:GS.user.UserID})
    }, onLastfmError:function (c, a) {
        c || (c = "POPUP_FAIL_COMMUNICATE_LASTFM");
        (this.lastError = a) && a.error && a.error == 9 ? this.showReAuthLightbox() : $.publish("gs.notification", {type:"error", message:$.localize.getString(c)});
        GS.getGuts().forceLogEvent("lastfmScrobbleFailed", {userID:GS.user.UserID, message:a.message})
    }, onSongPlaying:function (c) {
        var a = c.activeSong;
        c = Math.round(c.duration / 1E3);
        if (!this.currentListening || a.queueSongID != this.currentListening.queueSongID || a.SongID != this.currentListening.songID)this.currentListening =
        {songID:a.SongID, queueSongID:a.queueSongID, secondsListened:0, scrobbled:false}; else this.currentListening.secondsListened += 0.5;
        if ((this.flags & this.SCROBBLING_FLAG) > 0 && this.scrobblingEnabled && a && c >= 30 && (this.currentListening.secondsListened >= this.MINIMUM_DURATION || this.currentListening.secondsListened >= c / 2) && !this.currentListening.scrobbled) {
            var b = Math.round((new Date).getTime() / 1E3);
            this.lastPlayed = {artist:a.ArtistName, track:a.SongName, timestamp:b, duration:c, album:a.AlbumName, method:"track.scrobble",
                sk:this.sessionKey, api_key:this.API_KEY};
            if (a.TrackNum)this.lastPlayed.trackNumber = String(a.TrackNum);
            if (a && a.context)if (a.context.type == GS.player.PLAY_CONTEXT_USER)this.lastPlayed.chosenByUser = 1; else if (a.context.type == GS.player.PLAY_CONTEXT_RADIO)this.lastPlayed.chosenByUser = 0;
            this.currentListening.scrobbled = true;
            this.currentListening.timestamp = b;
            this.getJSON(this.URL_AUDIOSCROBBLER, this.lastPlayed, this.callback("onSongPlayingComplete"), this.callback("onNowPlayingFailed"), true)
        }
    }, onSongPlayingComplete:function (c) {
        if (!c ||
                !c.scrobbles)this.onLastfmError("POPUP_FAIL_SCROBBLE_LASTFM", c);
        GS.getGuts().logEvent("lastfmScrobbleCompleteSuccess", {userID:GS.user.UserID})
    }, deleteLastScrobble:function () {
        var c = GS.player.getCurrentSong();
        this.currentListening && this.currentListening.scrobbled && this.getJSON(this.URL_AUDIOSCROBBLER, {artist:c.ArtistName, track:c.SongName, timestamp:this.currentListening.timestamp, method:"library.removeScrobble", sk:this.sessionKey, api_key:this.API_KEY}, this.callback("onUnScrobbleComplete"), null, true)
    },
    onUnScrobbleComplete:function () {
    }, getJSON:function (c, a, b, d, f) {
        if (c && a && b)if (f)GS.service.makeLastfmRequest(a, function (g) {
            try {
                g = JSON.parse(g)
            } catch (k) {
                g = null
            }
            b(g)
        }, d ? d : b); else {
            a.format = "json";
            $.ajax({url:c, data:a, success:b, error:d ? d : b, dataType:"jsonp", cache:true})
        }
    }});

