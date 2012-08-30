GS.Controllers.BaseController.extend("GS.Controllers.FlattrController", {isGSSingleton:true, preSetup:function () {
    var c = GS.Controllers.BaseController.singletonCallback, a = $.subscribe;
    a("gs.auth.update", c("flattr", "update"));
    a("gs.player.nowplaying", c("flattr", "onNowPlaying"));
    a("gs.player.flattr", c("flattr", "onAutoFlattr"))
}}, {isInit:false, SERVICE_ID:131072, CLIENT_ID:gsConfig.httpHost == "grooveshark.com" ? "8CcZbdokZ3QPwuXmgZAjRpwxYB89Ba8zCboDeDO4xuJUPx6Wmw54LssAUqAlqyKT" : "yhco3fS9czbOCaKPNJ3X6oordPkF8oWxvYLo3to6TpLlql03VURR969cMjHKxt7T",
    API_SECRET:gsConfig.httpHost == "grooveshark.com" ? "zZnEt1yQl8A1vxNITJDv1VWLbmXrKybaooEHf2or1PimcWVWvoima4YbhLtSauSo" : "iJ7b2m8LBJXSVOMGytoyqnA2w8DUrBDzaBB3OAFg9sYV6AruUGSaTj3ghx0zYuZZ", URL_USER_AUTH:"https://flattr.com/oauth/authorize", URL_REST_API:"https://api.flattr.com/rest/v2/", musicBrainzArtistURL:"http://musicbrainz.org/artist/", accessToken:null, flattrUsername:null, flattrUserAvatar:null, flattrUserLink:null, autoFlattrPerMonthEnabled:false, autoFlattrPerStreamEnabled:false, flags:0, FLATTR_NO_AUTO_FLAG:0,
    FLATTR_AUTO_PER_MONTH_FLAG:1, FLATTR_AUTO_PER_STREAM_FLAG:2, hasFlattrCollection:{}, perMonthFlattrThrottleCollection:{}, canFlattrCurrentArtist:false, tmpAutoOff:false, init:function () {
        console.log("Init Flattr");
        if (window.flattrTesting) {
            if (!window.confirmFlattrConnection)window.confirmFlattrConnection = this.callback(function (c) {
                if (this.flattrOpenerWindow) {
                    this.flattrOpenerWindow.close();
                    this.flattrOpenerWindow = null
                }
                if (c) {
                    try {
                        c = JSON.parse(c)
                    } catch (a) {
                        this.loginFailedCallback();
                        return
                    }
                    if (c.hash) {
                        var b = {accessToken:null};
                        if ((c = c.hash.match(/access\_token\=([a-zA-Z0-9\-\_]+)/)) && c[1])b.accessToken = c[1];
                        GS.airbridge && GS.airbridge.isDesktop ? window.setTimeout(function () {
                            GS.getFlattr().onConnectFlattr(b)
                        }, 300) : this.onConnectFlattr(b)
                    } else this.loginFailedCallback()
                } else this.loginFailedCallback()
            });
            this._super()
        }
    }, connectFlattr:function (c, a) {
        if (GS.user && GS.user.isLoggedIn) {
            this.loginSuccessCallback = c;
            this.loginFailedCallback = a;
            var b = googleOpenIDPopup.getCenteredCoords(850, 600);
            c = "http://" + window.location.host + "/flattrCallback.php";
            var d = "window-" + window.name;
            this.flattrOpenerWindow = window.open(this.URL_USER_AUTH + "?response_type=token&scope=flattr&client_id=" + this.CLIENT_ID + "&redirect_uri=" + encodeURIComponent(c) + "&state=" + encodeURIComponent(d), "", "width=850,height=600,left=" + b[0] + ",top=" + b[1]);
            if (GS.airbridge && GS.airbridge.isDesktop)this.flattrOpenerWindow.parentSandboxBridge = {confirmFlattrConnection:window.confirmFlattrConnection}
        }
    }, onConnectFlattr:function (c) {
        if (c && c.accessToken) {
            this.accessToken = c.accessToken;
            this.getFlattrAuthenticatedUser(this.callback("onGetAuthUserForConnect"))
        }
    },
    appReady:function () {
        this.subscribe("gs.cowbell.ready", this.callback("commReady"))
    }, commReady:function () {
        !window.FlattrLoader && window.flattrTesting && $.ajax({cache:true, dataType:"script", url:"http://api.flattr.com/js/0.6/load.js?mode=auto"});
        this.update()
    }, update:function () {
        if (window.flattrTesting)GS.user && GS.user.isLoggedIn && GS.user.UserID > 0 && GS.user.Flags & this.SERVICE_ID ? GS.service.getUserFlattrData(this.callback("onGetUserFlattrData"), this.callback("onGetUserFlattrData")) : this.clearInfo()
    }, onGetUserFlattrData:function (c) {
        if (c.AccessToken) {
            this.accessToken =
                    c.AccessToken;
            this.flags = 0;
            this.flattrUsername = c.FlattrUsername;
            if (c.Flags) {
                this.flags = c.Flags;
                if (c.Flags & this.FLATTR_AUTO_PER_MONTH_FLAG)this.autoFlattrPerMonthEnabled = true; else if (c.Flags & this.FLATTR_AUTO_PER_STREAM_FLAG)this.autoFlattrPerStreamEnabled = true
            }
            this.getFlattrAuthenticatedUser(function (a) {
                try {
                    a = JSON.parse(a)
                } catch (b) {
                    console.log("getFlattrAuthenticatedUser - bad json");
                    GS.getFlattr().onFlattrFailed();
                    return
                }
                if (a && a.error) {
                    console.log("getFlattrAuthenticatedUserComplete - error", a.error);
                    GS.getFlattr().onFlattrFailed()
                } else {
                    if (a) {
                        if (a.avatar && a.avatar.length)GS.getFlattr().flattrUserAvatar = a.avatar; else GS.getFlattr().flattrUserAvatar = gsConfig.assetHost + "webincludes/css/images/services/flattr-small.png";
                        GS.getFlattr().flattrUserLink = a.link
                    }
                    GS.getFlattr().isInit = true;
                    GS.getFlattr().connected = true;
                    $.publish("gs.flattr.profile.update");
                    if (GS.player && GS.player.currentSong) {
                        GS.getFlattr().canFlattrCurrentArtist = GS.getFlattr().canFlattr(GS.player.currentSong.ArtistID);
                        GS.player.player.setFlattr(GS.getFlattr().canFlattrCurrentArtist)
                    }
                }
            })
        }
    },
    onGetAuthUserForConnect:function (c) {
        try {
            c = JSON.parse(c)
        } catch (a) {
            console.log("onGetAuthUserForConnect - bad json");
            this.onFlattrFailed();
            return
        }
        if (c.username) {
            this.flattrUsername = c.username;
            if (c.avatar && c.avatar.length)GS.getFlattr().flattrUserAvatar = c.avatar; else GS.getFlattr().flattrUserAvatar = gsConfig.assetHost + "webincludes/css/images/services/flattr-small.png";
            this.flattrUserLink = c.link;
            if (!this.flags)this.flags = this.FLATTR_NO_AUTO_FLAG;
            this.isInit = true;
            GS.service.saveUserFlattrData(this.accessToken,
                    this.flattrUsername, this.flags, this.callback("onSaveUserFlattrData", this.loginSuccessCallback, this.loginFailedCallback), this.loginFailedCallback)
        }
    }, updateFlattrData:function (c, a, b) {
        GS.service.updateUserFlattrData(this.accessToken, this.flattrUsername, c, a, b)
    }, onSaveUserFlattrData:function (c, a, b) {
        if (b == 1) {
            GS.user.Flags |= this.SERVICE_ID;
            this.connected = true;
            $.publish("gs.flattr.profile.update")
        } else {
            b != -1 && this.clearInfo();
            this.onFlattrFailed()
        }
    }, logout:function (c) {
        GS.service.removeUserFlattrData(this.callback("onLogout",
                c))
    }, onLogout:function (c, a) {
        if (a) {
            GS.user.Flags = (GS.user.Flags | this.SERVICE_ID) - this.SERVICE_ID;
            this.clearInfo();
            $.isFunction(c) && c()
        } else {
            console.log("onLogout - error");
            this.onFlattrFailed()
        }
    }, clearInfo:function () {
        this.flattrUserLink = this.flattrUserAvatar = this.flattrUsername = this.accessToken = null;
        this.canFlattrCurrentArtist = this.autoFlattrPerStreamEnabled = this.autoFlattrPerMonthEnabled = false;
        GS.player.player.setFlattr(this.canFlattrCurrentArtist);
        this.tmpAutoOff = false;
        this.flags = 0;
        this.connected =
                false;
        $.publish("gs.flattr.profile.update")
    }, getFlattrAuthenticatedUser:function (c, a) {
        var b = {access_token:this.accessToken};
        $.isFunction(c) || (c = this.callback("onGetFlattrAuthenticatedUserComplete"));
        $.isFunction(a) || (a = this.callback("onFlattrFailed"));
        GS.service.makeFlattrRequest(this.URL_REST_API + "user?compat-errors", b, "GET", c, a)
    }, onGetFlattrAuthenticatedUserComplete:function (c) {
        try {
            c = JSON.parse(c)
        } catch (a) {
            console.log("onGetFlattrAuthenticatedUserComplete - bad json");
            c = null
        }
        if (c && c.error) {
            console.log("onGetFlattrAuthenticatedUserComplete - error",
                    c.error);
            this.onFlattrFailed()
        } else if (c) {
            if (c.avatar && c.avatar.length)GS.getFlattr().flattrUserAvatar = c.avatar; else GS.getFlattr().flattrUserAvatar = gsConfig.assetHost + "webincludes/css/images/services/flattr-small.png";
            this.flattrUserLink = c.link
        }
    }, onAutoSubmitThingLookupComplete:function (c, a) {
        try {
            a = JSON.parse(a)
        } catch (b) {
            console.log("onAutoSubmitThingLookupComplete - bad json");
            a = null
        }
        if (a)if (a.error) {
            console.log("onAutoSubmitThingLookupComplete - error", a.error);
            this.onFlattrFailed()
        } else if (a.id) {
            this.renderEmbedButton(c);
            this.hasFlattrCollection[c.attr("data-flattr-mbID")] = (new Date).getTime()
        } else a.message && a.message == "flattrable" && this.renderAutoSubmitButton(c)
    }, autoSubmitThingLookup:function (c, a) {
        $.isFunction(a) || (a = function (b) {
            try {
                JSON.parse(b)
            } catch (d) {
                console.log("autoSubmitThingLookup - bad json");
                this.onFlattrFailed()
            }
        });
        GS.service.makeFlattrRequest(this.URL_REST_API + "things/lookup/?compat-errors&url=http://flattr.com/submit/auto?url=" + encodeURIComponent(c.url), {}, "GET", a, a)
    }, onFlattrIDComplete:function () {
    },
    onAutoFlattr:function (c) {
        c && c.Data && c.Data.mbID && this.flattrURL(c.Data.mbID, c.ItemID)
    }, flattrURL:function (c, a) {
        GS.service.makeFlattrRequest(this.URL_REST_API + "flattr?compat-errors", {access_token:this.accessToken, url:"http://flattr.com/submit/auto?url=" + (this.musicBrainzArtistURL + c)}, "POST", this.callback("onFlattrURLComplete", a), this.callback("onFlattrFailed"))
    }, onFlattrURLComplete:function (c, a) {
        try {
            a = JSON.parse(a)
        } catch (b) {
            console.log("onFlattrURLComplete - bad json");
            this.onFlattrFailed();
            return
        }
        if (a.message &&
                a.message == "ok")this.setFlattrThrottle(c); else if (a.error)switch (a.error) {
            case "flattr_once":
                this.setFlattrThrottle(c);
                break;
            case "flattr_owner":
                this.setFlattrThrottle(c);
                break;
            case "no_means":
                this.tmpAutoOff = true;
                break;
            case "not_found":
            case "invalid_request":
            default:
                console.log("onFlattrURLComplete - error" + a.error);
                this.onFlattrFailed();
                break
        }
    }, onFlattrFailed:function () {
        $.publish("gs.notification", {type:"error", message:"An error occurred while communicating with Flattr."})
    }, canFlattr:function (c) {
        if (this.tmpAutoOff)return false;
        if (this.perMonthFlattrThrottleCollection[c]) {
            var a = new Date;
            a = a.getDate() + a.getMonth() + a.getYear();
            if (this.perMonthFlattrThrottleCollection[c] >= a)return false
        }
        return this.connected && this.autoFlattrPerMonthEnabled
    }, setFlattrThrottle:function (c) {
        var a = new Date;
        a = a.getDate() + a.getMonth() + a.getYear();
        this.perMonthFlattrThrottleCollection[c] = a
    }, onNowPlaying:function (c) {
        if (window.flattrTesting)if (this.isInit && this.connected && this.autoFlattrPerMonthEnabled) {
            this.canFlattrCurrentArtist = this.canFlattr(c.ArtistID);
            GS.player.player.setFlattr(this.canFlattrCurrentArtist)
        }
    }, initArtistFlattrButton:function (c, a) {
        c.attr("data-flattr-mbID", a);
        if (c.attr("data-flattr-mbID") && c.attr("data-flattr-mbID").length)this.hasFlattrCollection[c.attr("data-flattr-mbID")] ? this.renderEmbedButton(c) : this.autoSubmitThingLookup({url:this.musicBrainzArtistURL + c.attr("data-flattr-mbID")}, this.callback("onAutoSubmitThingLookupComplete", c))
    }, parseButtons:function () {
        window.FlattrLoader && $.each($("a.FlattrButton"), function (c, a) {
            window.FlattrLoader.loadButton(a)
        })
    },
    renderEmbedButton:function (c, a) {
        var b = $('<a class="FlattrButton" style="display:none;" rev="flattr;button:compact;popout:0;" href="' + this.musicBrainzArtistURL + a + '"></a>');
        c.append(b);
        this.parseButtons()
    }, renderAutoSubmitButton:function (c) {
        var a = $('<a class="flattrAutoSubmit" href="https://flattr.com/submit/auto?url=' + this.musicBrainzArtistURL + c.attr("data-flattr-mbID") + '" target="_blank"></a>');
        c.append(a)
    }});

