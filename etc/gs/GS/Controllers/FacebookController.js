(function () {
    var c = 0, a = null, b, d;
    GS.Controllers.BaseController.extend("GS.Controllers.FacebookController", {isGSSingleton:true, preSetup:function () {
        var f = GS.Controllers.BaseController.singletonCallback, g = $.subscribe;
        g("gs.auth.update", f("facebook", "update"));
        g("gs.auth.favorites.songs.add", f("facebook", "onFavoriteSong"));
        g("gs.auth.playlists.add", f("facebook", "onPlaylistCreate"));
        g("gs.player.nowplaying", f("facebook", "onNowPlaying"));
        g("gs.player.playing.continue", f("facebook", "onSongPlaying"));
        g("gs.player.playstatus",
                f("facebook", "onPlayStatusChange"));
        g("gs.theme.set", f("facebook", "parseTheme"))
    }}, {APPLICATION_ID:"111132365592157", SERVICE_ID:4, FACEBOOK_ONLY_SERVICE_ID:16, PERMISSIONS:"offline_access,publish_stream,email,user_about_me,user_likes,user_interests,user_location,user_birthday,publish_actions", REQUIRED_PERMISSIONS:"offline_access,publish_stream,email,user_about_me,user_location,user_birthday", PUBLISH_PERMISSION:"publish_stream", USER_ACTIONS:"publish_actions", WALL_FAVORITES:8, WALL_PLAYLIST_CREATE:16,
        SCROBBLING_OFF_FLAG:32, AUTO_RATE_LIMIT:18E6, MINIMUM_DURATION:15, profile:null, friends:null, registeredWithFacebook:false, facebookUserID:false, loggedIntoFacebook:false, flags:0, lastError:null, facebookLoaded:false, connectStatus:"unknown", connected:false, onLoginSaveData:null, initialXFBML:null, onUpdateCallback:null, lastUser:null, friendPermissions:{}, userPermissions:{}, forceLogin:false, subXFBML:null, canUpdate:false, scrobblingEnabled:false, currentListening:null, loginOnLoad:null, init:function () {
            this.LISTEN_APPLICATION_ID =
                    "111132365592157";
            if (window.location.host.indexOf("grooveshark.com") > -1 && this.APPLICATION_ID !== this.LISTEN_APPLICATION_ID || !this.APPLICATION_ID)this.APPLICATION_ID = this.LISTEN_APPLICATION_ID;
            this._super()
        }, appReady:function () {
            c = this.subscribe("gs.cowbell.ready", this.callback("commReady"))
        }, commReady:function () {
            if (_.browserDetect().browser != "msie" || _.browserDetect().version > 6) {
                window.fbAsyncInit = GS.getFacebook().callback("initFacebook");
                window.fbLoadAttempts = 0;
                var f = function () {
                    if ($.browser.msie && this.readyState) {
                        if (this.readyState ===
                                "complete" || this.readyState === "loaded") {
                            this.onload = this.onreadystatechange = null;
                            setTimeout(function () {
                                window.FB && GS.getFacebook().initFacebook()
                            }, 10)
                        }
                    } else {
                        this.onload = this.onreadystatechange = null;
                        setTimeout(function () {
                            window.FB && GS.getFacebook().initFacebook()
                        }, 10)
                    }
                };
                window.loadFacebook = function () {
                    try {
                        if (document.getElementById("fb-root") && document.getElementById("fb-root").getElementsByTagName("script").length) {
                            document.getElementById("fb-root").removeChild(document.getElementById("fb-root").getElementsByTagName("script")[0]);
                            document.getElementById("fb-root") && document.getElementById("fb-root").getElementsByTagName("div").length && document.getElementById("fb-root").removeChild(document.getElementById("fb-root").getElementsByTagName("div")[0]);
                            window.FB = null;
                            GS.getFacebook().facebookloaded = false
                        }
                        var g = document.createElement("script");
                        g.async = true;
                        g.src = document.location.protocol + "//connect.facebook.net/en_US/all.js?20120211";
                        g.onload = g.onreadystatechange = f;
                        document.getElementById("fb-root").appendChild(g);
                        window.fbLoadAttempts++;
                        window.facebookLoadTimeout = setTimeout(function () {
                            if ((!window.FB || !GS.getFacebook().facebookloaded) && window.fbLoadAttempts < 3)window.loadFacebook(); else if (!window.FB && window.fbLoadAttempts >= 3)$.publish("gs.notification", {type:"error", message:$.localize.getString("POPUP_UNABLE_LOAD_FACEBOOK")}); else GS.getFacebook().facebookloaded || GS.getFacebook().initFacebook()
                        }, 2E4)
                    } catch (k) {
                        console.error("Could not load Facebook Connect JS. Fatal Error: ", k);
                        GS.getFacebook().lastError = k;
                        $.publish("gs.notification",
                                {type:"error", message:$.localize.getString("POPUP_UNABLE_LOAD_FACEBOOK")})
                    }
                };
                window.loadFacebook()
            }
            if (c) {
                $.unsubscribe(c);
                c = 0
            }
        }, initFacebook:function () {
            if (window.FB && window.FB.init && (!window.FB._apiKey || !this.facebookLoaded)) {
                FB.init({appId:this.APPLICATION_ID, status:false, cookie:false, xfbml:false, oauth:true, channelUrl:"//" + window.location.hostname + "/channel.html"});
                this.facebookLoaded = true;
                window.facebookLoadTimeout && clearTimeout(window.facebookLoadTimeout);
                var f = _.browserDetect();
                if (f.browser ==
                        "chrome" && f.version < 15) {
                    FB.XD._origin = window.location.protocol + "//" + document.domain + "/" + FB.guid();
                    FB.XD.Flash.init();
                    FB.XD._transport = "flash"
                } else if (f.browser == "opera") {
                    FB.XD._transport = "fragment";
                    FB.XD.Fragment._channelUrl = window.location.protocol + "//" + window.location.host + "/"
                } else if (f.browser == "msie" && f.version == 8) {
                    FB.XD._origin = window.location.protocol + "//" + document.domain + "/" + FB.guid();
                    FB.XD.Flash.init();
                    FB.XD._transport = "flash"
                }
                FB.Event.subscribe("auth.statusChange", this.callback(this.onFacebookLoginStatus,
                        false));
                FB.Event.subscribe("auth.authResponseChange", this.callback(this.onFacebookAuthChanged));
                FB.getLoginStatus();
                FB.Event.subscribe("edge.create", function (g) {
                    window._gaq && window._gaq.push && window._gaq.push(["_trackSocial", "facebook", "like", g]);
                    if (GS.page && GS.page.activePage && GS.page.activePage.likeWidth == "48px") {
                        GS.page.activePage.likeWidth = "77px";
                        GS.page.activePage.likeWidthCache[GS.page.activePage.fbUrl] = "77px";
                        $("#page_content_social_buttons .fblike").css("width", GS.page.activePage.likeWidth)
                    }
                });
                FB.Event.subscribe("edge.remove", function (g) {
                    window._gaq && window._gaq.push && window._gaq.push(["_trackSocial", "facebook", "unlike", g])
                });
                if (!window.document.getElementById("theme_home") || window.location.hash && window.location.hash.indexOf("/s/") > -1) {
                    $.publish("gs.facebook.xfbml.ready", true);
                    GS.getFacebook().initialXFBML = true;
                    this.subXFBML = $.subscribe("gs.facebook.xfbml.ready", this.callback(this.parseTheme))
                } else this.parseTheme();
                setTimeout(this.callback(function () {
                    if (FB.Auth._loadState == "loading") {
                        FB.Auth._loadState =
                                null;
                        FB.getLoginStatus(this.callback(this.onFacebookLoginStatus, true))
                    }
                }), 1E4);
                console.log("FB initialized");
                this.canUpdate = true;
                this.loginOnLoad ? this.login(this.loginOnLoad.callback, this.loginOnLoad.errback, this.loginOnLoad.flags) : this.update()
            }
        }, parseTheme:function () {
            if (window.FB)window.document.getElementById("theme_home") && FB.XFBML.parse(window.document.getElementById("theme_home"), this.callback(function () {
                this.subXFBML && $.unsubscribe(this.subXFBML);
                setTimeout(function () {
                            $.publish("gs.facebook.xfbml.ready")
                        },
                        100);
                GS.getFacebook().initialXFBML = true
            })); else this.initFacebook()
        }, update:function () {
            if (this.canUpdate)this.canUpdate = false
        }, cleanSession:function (f) {
            if (f.accessToken.indexOf("|") >= 0) {
                f = f.accessToken.split("|");
                var g = f[1].split("-"), k = {};
                k.facebookUserID = g[1];
                k.sessionKey = g[0];
                k.accessToken1 = f[0];
                k.accessToken3 = f[2];
                return k
            } else return false
        }, onFacebookAuthChanged:function (f) {
            if (f.status == "connected" && f.authResponse && f.authResponse.userID == this.facebookUserID && this.facebookUserID != d && a != f.authResponse.accessToken)this.save(this.flags);
            else if (this.connected && f.authResponse && f.authResponse.userID != this.facebookUserID || !this.connected && f.authResponse && f.authResponse.userID == this.facebookUserID && this.facebookUserID != d)this.onFacebookLoginStatus(false, f)
        }, onFacebookLoginStatus:function (f, g) {
            if (g) {
                var k = false;
                if (this.connectStatus == g.status && this.connectStatus == "connected" && this.connected && a == g.authResponse.accessToken)k = true; else if (this.connectStatus == g.status && this.connectStatus == "unknown" && !this.connected && !a)k = true;
                this.connectStatus =
                        g.status;
                switch (this.connectStatus) {
                    case "connected":
                        this.loggedIntoFacebook = true;
                        if (!this.profile || this.facebookUserID != this.profile.id)if (g.authResponse.userID == this.facebookUserID)FB.api("/me", this.callback("onGetMyProfile", null, null)); else this.facebookUserID && FB.api("/?id=" + this.facebookUserID, this.callback("onGetMyProfile", null, null));
                        break;
                    case "not_authorized":
                        this.loggedIntoFacebook = true;
                        break;
                    case "unknown":
                    default:
                        if (b)return;
                        this.loggedIntoFacebook = false;
                        break
                }
                this.connected = this.loggedIntoFacebook &&
                        g.authResponse && g.authResponse.userID && g.authResponse.userID == this.facebookUserID ? true : false;
                if (!k) {
                    this.updateFacebookAuth();
                    $.publish("gs.facebook.status.update")
                }
                if ($.isFunction(this.onUpdateCallback)) {
                    this.onUpdateCallback();
                    this.onUpdateCallback = null
                }
            }
        }, updateFacebookAuth:function () {
            if (this.facebookUserID && a) {
                var f = FB.getAuthResponse();
                if (a && (!f || !f.accessToken))FB.Auth.setAuthResponse({accessToken:a, expiresIn:0, signedRequest:"", userID:this.facebookUserID}, "connected");
                if (this.connected) {
                    if ((this.flags &
                            this.WALL_FAVORITES) > 0 || (this.flags & this.WALL_PLAYLIST_CREATE) > 0) {
                        d = this.facebookUserID;
                        this.checkUserPermissions(this.PUBLISH_PERMISSION, this.callback(function (g) {
                            g || $.publish("gs.facebook.notification.cannotPost", {notifLocale:"POPUP_LOGIN_FACEBOOK_FLAGS_PERMS", successButton:"NOTIF_FACEBOOK_CONNECT_BUTTON"});
                            d = null
                        }), this.callback(function (g) {
                            if (g && g.error_code == 190) {
                                a = null;
                                this.showReAuthLightbox()
                            } else $.publish("gs.facebook.notification.cannotPost")
                        }))
                    }
                    if (!(this.flags & this.SCROBBLING_OFF_FLAG)) {
                        d =
                                this.facebookUserID;
                        this.checkUserPermissions(this.USER_ACTIONS, this.callback(function (g) {
                            if (!g) {
                                $.publish("gs.facebook.notification.cannotPost", {notifLocale:"POPUP_LOGIN_FACEBOOK_FLAGS_LISTEN_PERMS", cancelButton:"NOTIF_FACEBOOK_LISTENS_DISABLE", successButton:"SURE"});
                                this.scrobblingEnabled = false
                            }
                            d = null
                        }), this.callback(function (g) {
                            if (g && g.error_code == 190) {
                                a = null;
                                this.showReAuthLightbox()
                            } else {
                                $.publish("gs.facebook.notification.cannotPost", {notifLocale:"POPUP_LOGIN_FACEBOOK_FLAGS_LISTEN", successButton:"NOTIF_FACEBOOK_CONNECT_BUTTON"});
                                this.scrobblingEnabled = false
                            }
                        }))
                    }
                } else if (this.scrobblingEnabled)$.publish("gs.facebook.notification.cannotPost", {notifLocale:"POPUP_LOGIN_FACEBOOK_FLAGS_LISTEN"}); else(this.flags & this.WALL_FAVORITES) > 0 || (this.flags & this.WALL_PLAYLIST_CREATE) > 0 ? $.publish("gs.facebook.notification.cannotPost") : $.publish("gs.notification", {type:"error", message:$.localize.getString("POPUP_LOGOUT_FACEBOOK")})
            }
        }, onUserFacebookData:function (f) {
            try {
                if (window.FB && f && f.FacebookUserID) {
                    a = f.AccessToken1 ? f.AccessToken1 + "|" + f.SessionKey +
                            "-" + f.FacebookUserID + "|" + f.AccessToken3 : f.AccessTokenEx;
                    this.facebookUserID = f.FacebookUserID;
                    this.flags = f.Flags;
                    if ((this.flags & this.SCROBBLING_OFF_FLAG) == 0)this.scrobblingEnabled = true;
                    if (FB.Auth._loadState == "loading")FB.Auth._loadState = null;
                    FB.getLoginStatus(this.callback(this.onFacebookLoginStatus, false))
                } else this.connected = false
            } catch (g) {
                this.connected = false
            }
        }, onAuthFacebookUser:function (f, g, k) {
            if (k)if (k.userID == 0)this.register(f, g); else {
                FB.getLoginStatus(this.callback(this.onFacebookLoginStatus,
                        false));
                $.isFunction(f) && f(k);
                GS.getGuts().logEvent("facebookAuthenticated", {authenticated:true})
            } else $.isFunction(g) && g({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"})
        }, showReAuthLightbox:function () {
            GS.getLightbox().close();
            GS.getLightbox().open({type:"reAuthFacebook", view:{header:"POPUP_FACEBOOK_REAUTH_TITLE", message:"POPUP_FACEBOOK_REAUTH_MESSAGE", buttonsRight:[
                {label:"POPUP_REAUTH_SUBMIT", className:"submit"}
            ], buttonsLeft:[
                {label:"POPUP_FACEBOOK_REAUTH_CANCEL", className:"cancel"}
            ]}, callbacks:{".submit":function () {
                var f =
                        GS.getFacebook().flags;
                GS.getFacebook().logout(function () {
                    GS.getFacebook().login(function () {
                        GS.getLightbox().close()
                    }, null, f)
                })
            }, ".cancel":function () {
                if (GS.getFacebook().registeredWithFacebook) {
                    GS.getLightbox().close("reAuthFacebook");
                    GS.getLightbox().open("resetPassword", function () {
                        var f = GS.getFacebook().flags;
                        GS.getFacebook().logout(this.callback(function () {
                            GS.getLightbox().close()
                        }), f)
                    })
                } else GS.getFacebook().logout(function () {
                    GS.getLightbox().close()
                })
            }}})
        }, showInvalidPermissionsLightbox:function (f) {
            if ($.isFunction(f)) {
                GS.getLightbox().close();
                GS.getLightbox().open({type:"invalidPermissionsFacebook", view:{header:"POPUP_FACEBOOK_PERMS_TITLE", message:"POPUP_FACEBOOK_PERMS_MESSAGE", buttonsRight:[
                    {label:"POPUP_REAUTH_AUTH_SUBMIT", className:"submit"}
                ], buttonsLeft:[
                    {label:"POPUP_FACEBOOK_PERMS_CANCEL", className:"close"}
                ]}, callbacks:{".submit":function () {
                    f()
                }, ".close":function () {
                    GS.getFacebook().logout(function () {
                        GS.getLightbox().close()
                    })
                }}})
            }
        }, authErrors:[608, 450, 451, 452, 453, 454, 455, 200, 190, 10], queryFQL:function (f, g, k, m) {
            FB.api({method:"fql.query",
                query:f}, this.callback(function (h) {
                if (h.error_code) {
                    if ($.isFunction(k))k(h); else m && $.inArray(h.error_code, this.authErrors) && this.showReAuthLightbox();
                    if (m) {
                        h = h.error_code + " (" + m + ")";
                        GS.getGuts().forceLogEvent("facebookFQLErr", {errCode:h})
                    }
                } else $.isFunction(g) && g(h)
            }))
        }, register:function (f, g) {
            if (window.FB && FB.getAuthResponse() && FB.getAuthResponse().userID)this.queryFQL("select uid,name,first_name,last_name,profile_url,username,about_me,birthday_date,sex,email,locale from user where uid = me()", function (k) {
                if (k &&
                        k[0]) {
                    var m = {id:k[0].uid, name:k[0].name, first_name:k[0].first_name, last_name:k[0].last_name, link:k[0].profile_url, birthday:k[0].birthday_date, about:k[0].profile_blurb, gender:k[0].sex, email:k[0].email, locale:k[0].locale};
                    GS.getFacebook().gotProfileForRegister(f, g, k[0].username ? k[0].username : "", m)
                } else GS.getFacebook().gotProfileForRegister(f, g)
            }, function () {
                var k = FB.getAccessToken();
                FB.getLoginStatus(GS.getFacebook().callback(function (m) {
                    if (!m.authResponse || m.authResponse.accessToken != k) {
                        this.onFacebookLoginStatus(false,
                                m);
                        this.login(f, g)
                    }
                }), true)
            }, 4); else $.isFunction(g) && g({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"})
        }, gotProfileForRegister:function (f, g, k, m) {
            if (m && !m.error)GS.service.getUsernameSuggestions(k, m.name ? m.name : "", m.id, this.callback("usernameSuggestSuccess", f, g, m), this.callback("usernameSuggestFailed", f, g, m)); else g && g({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"})
        }, usernameSuggestSuccess:function (f, g, k, m) {
            g = "";
            if (m && m.length > 0)g = m[0];
            this.openRegisterLightbox(f, g, k)
        }, usernameSuggestFailed:function (f, g, k) {
            f && g ? g({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"}) : this.openRegisterLightbox(null, "", k)
        }, openRegisterLightbox:function (f, g, k) {
            f = {isFacebook:!_.isEmpty(k), username:g, session:this.cleanSession(FB.getAuthResponse()), fbFlags:0, message:$.localize.getString("POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_NOT_FOUND")};
            if (!f.session) {
                g = FB.getAuthResponse();
                f.session = {facebookUserID:g.userID, accessTokenEx:g.accessToken}
            }
            if (k) {
                if (k.birthday) {
                    g = k.birthday.split("/");
                    f.month = g[0];
                    f.day = g[1];
                    f.year = parseInt(g[2])
                }
                f.fname =
                        k.name ? k.name : "";
                if (k.gender == "female")f.sex = "F"; else if (k.gender == "male")f.sex = "M";
                f.email = k.email ? k.email : ""
            }
            GS.user.defaultFromService = f;
            GS.getLightbox().close();
            GS.page.activePageName == "SignupController" ? GS.page.activePage.update(f) : GS.router.setHash("/signup");
            GS.getGuts().logEvent("facebookRegistered", {registered:true})
        }, serviceLogout:function (f) {
            b = true;
            FB.logout(function () {
                FB.Auth.setAuthResponse({accessToken:null, expiresIn:0, signedRequest:"", userID:null}, "unknown");
                $.isFunction(f) && f();
                b =
                        false
            })
        }, login:function (f, g, k) {
            if (window.FB && window.FB.login)if (GS.airbridge && GS.airbridge.isDesktop)this.connectStatus == "connected" && !this.forceLogin ? FB.getLoginStatus(this.callback("onAIRLogin", f, g, k)) : FB.login(this.callback("onAIRLogin", f, g, k), {scope:this.PERMISSIONS}); else this.connectStatus == "connected" && !this.forceLogin ? FB.getLoginStatus(this.callback("onLogin", f, g, k)) : FB.login(this.callback("onLogin", f, g, k), {scope:this.PERMISSIONS}); else if (this.facebookLoaded)g && g({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"});
            else this.loginOnLoad = {callback:f, errback:g, flags:k}
        }, onAIRLogin:function (f, g, k, m) {
            window.setTimeout(function () {
                GS.getFacebook().onLogin(f, g, k, m)
            }, 300)
        }, onLogin:function (f, g, k, m) {
            m.authResponse && this.checkUserPermissions(this.REQUIRED_PERMISSIONS, this.callback(function (h) {
                if (h)if (GS.user.isLoggedIn) {
                    if (!this.connected && this.facebookUserID && this.facebookUserID != m.authResponse.userID)this.friends = this.profile = null;
                    this.save(k ? k : 0, f, g)
                } else(h = this.cleanSession(m.authResponse)) ? GS.service.authenticateFacebookUser(h.facebookUserID,
                        h.sessionKey, h.accessToken1, h.accessToken3, null, this.callback("onAuthFacebookUser", f, g), function () {
                            $.isFunction(g) && g({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"})
                        }) : GS.service.authenticateFacebookUser(m.authResponse.userID, "", "", "", m.authResponse.accessToken, this.callback("onAuthFacebookUser", f, g), function () {
                    $.isFunction(g) && g({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"})
                }); else GS.getFacebook().showInvalidPermissionsLightbox(GS.getFacebook().callback(function () {
                    GS.airbridge && GS.airbridge.isDesktop ?
                            FB.login(this.callback("onAIRLogin", f, g, k), {scope:this.REQUIRED_PERMISSIONS}) : FB.login(this.callback("onLogin", f, g, k), {scope:this.REQUIRED_PERMISSIONS})
                }))
            }), function () {
                $.isFunction(g) && g({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"});
                FB.getLoginStatus(GS.getFacebook().callback("onFacebookLoginStatus", false), true)
            })
        }, save:function (f, g, k) {
            if (window.FB && FB.getAccessToken() && GS.user.isLoggedIn) {
                var m = FB.getAuthResponse();
                if (m) {
                    var h = this.cleanSession(m);
                    if (GS.user.Flags & this.SERVICE_ID || GS.user.Flags &
                            this.FACEBOOK_ONLY_SERVICE_ID) {
                        h ? GS.service.updateUserFacebookData(h.facebookUserID, h.sessionKey, h.accessToken1, h.accessToken3, f ? f : 0, null, this.callback("onSaveUserFacebookData", g, k), k) : GS.service.updateUserFacebookData(m.userID, "", "", "", f ? f : 0, m.accessToken, this.callback("onSaveUserFacebookData", g, k), k);
                        if (!(f & this.SCROBBLING_OFF_FLAG) && (this.flags & this.SCROBBLING_OFF_FLAG) > 0)this.scrobblingEnabled = true
                    } else {
                        h ? GS.service.saveUserFacebookData(h.facebookUserID, h.sessionKey, h.accessToken1, h.accessToken3,
                                f ? f : 0, null, this.callback("onSaveUserFacebookData", g, k), k) : GS.service.saveUserFacebookData(m.userID, "", "", "", f ? f : 0, m.accessToken, this.callback("onSaveUserFacebookData", g, k), k);
                        if (!(f & this.SCROBBLING_OFF_FLAG))this.scrobblingEnabled = true
                    }
                    this.flags = f;
                    if (this.flags & this.SCROBBLING_OFF_FLAG)this.scrobblingEnabled = false; else this.checkUserPermissions(this.USER_ACTIONS, this.callback(function (n) {
                        if (n)this.scrobblingEnabled = true; else {
                            $.publish("gs.facebook.notification.cannotPost", {notifLocale:"POPUP_LOGIN_FACEBOOK_FLAGS_LISTEN_PERMS",
                                cancelButton:"NOTIF_FACEBOOK_LISTENS_DISABLE", successButton:"SURE"});
                            this.scrobblingEnabled = false
                        }
                    }), function () {
                        $.publish("gs.facebook.notification.cannotPost", {notifLocale:"POPUP_LOGIN_FACEBOOK_FLAGS_LISTEN_PERMS", cancelButton:"NOTIF_FACEBOOK_LISTENS_DISABLE", successButton:"SURE"});
                        this.scrobblingEnabled = false
                    })
                } else k && k({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"})
            }
        }, onSaveUserFacebookData:function (f, g, k) {
            if (k == 1 && window.FB) {
                this.facebookUserID = FB.getAuthResponse().userID;
                this.connected = true;
                FB.api("/me", this.callback("onGetMyProfile", f, g));
                if (!(GS.user.Flags & this.SERVICE_ID) && !(GS.user.Flags & this.FACEBOOK_ONLY_SERVICE_ID) && this.lastUser !== GS.user.UserID) {
                    !$("#lightbox_wrapper:visible").length && GS.page.activePageName != "SettingsController" && GS.getLightbox().open("newFacebookUser");
                    GS.getGuts().logEvent("facebookNewSave", {newSave:true})
                }
                GS.user.Flags |= this.SERVICE_ID
            } else if (k == -1)g && g({error:"FACEBOOK_DUPLICATE_ACCOUNT_ERROR_MSG", signupError:4096}); else g && g({error:"POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"})
        },
        onGetMyProfile:function (f, g, k) {
            if (k && k.id) {
                this.profile = k;
                $.publish("gs.facebook.profile.update");
                f && f()
            } else {
                this.connected = false;
                this.lastError = k;
                GS.user && GS.user.isLoggedIn && k.error && k.error.type == "OAuthException" && this.APPLICATION_ID == this.LISTEN_APPLICATION_ID && this.showReAuthLightbox();
                g && g()
            }
        }, logout:function (f) {
            if (GS.user.isLoggedIn)this.profile && this.profile.id ? GS.service.removeUserFacebookData(this.profile.id, this.callback("onLogout", f)) : GS.service.removeUserFacebookData(false, this.callback("onLogout",
                    f)); else {
                this.clearInfo();
                $.isFunction(f) && f()
            }
        }, onLogout:function (f) {
            if (!this.registeredWithFacebook) {
                GS.user.Flags = (GS.user.Flags | this.SERVICE_ID) - this.SERVICE_ID;
                this.lastUser = GS.user.UserID
            }
            this.clearInfo(f);
            this.forceLogin = true
        }, clearInfo:function (f) {
            this.profile = {};
            this.friends = null;
            this.friendPermissions = {};
            this.userPermissions = {};
            this.registeredWithFacebook = this.connected = false;
            this.onLoginSaveData = this.loginOnLoad = null;
            this.facebookUserID = false;
            this.flags = 0;
            this.scrobblingEnabled = false;
            a =
                    null;
            this.onUpdateCallback = f;
            FB.getLoginStatus(this.callback("onFacebookLoginStatus", false), true);
            $.isFunction(this.onUpdateCallback) && setTimeout(this.callback(function () {
                if ($.isFunction(this.onUpdateCallback)) {
                    this.onUpdateCallback();
                    this.onUpdateCallback = null
                }
            }), 1E4);
            $.publish("gs.facebook.profile.update")
        }, onFavoriteSong:function (f, g, k) {
            if (this.connected && (k || (this.flags & this.WALL_FAVORITES) > 0)) {
                var m = this.callback(function () {
                    $.isFunction(f.toUrl) ? this.postLink("me", "http://grooveshark.com" + f.toUrl().replace("#!/",
                            "/"), g, "song", k ? "notif" : "auto", this.callback("initiateRateLimit"), this.callback("onFailedPostEvent"), !k, f) : GS.Models.Song.getSong(_.orEqualEx(f.SongID, f.songID, f), this.callback(function (h) {
                        if ($.isFunction(h.toUrl))this.postLink("me", "http://grooveshark.com" + h.toUrl().replace("#!/", "/"), g, "song", k ? "notif" : "auto", this.callback("initiateRateLimit"), this.callback("onFailedPostEvent"), !k, h)
                    }), this.onFailedPostEvent)
                });
                this.autoRateLimited && !k ? setTimeout(function () {
                    $.publish("gs.facebook.notification.rateLimited",
                            {callback:m, type:"song"})
                }, 300) : m()
            }
        }, onPlaylistCreate:function (f, g, k) {
            if (this.connected && (k || (this.flags & this.WALL_PLAYLIST_CREATE) > 0)) {
                var m = this.callback(function () {
                    this.postLink("me", "http://grooveshark.com" + f.toUrl().replace("#!/", "/"), g, "playlist", k ? "notif" : "auto", this.callback("initiateRateLimit"), this.callback("onFailedPostEvent"), !k, f)
                });
                this.autoRateLimited && !k ? setTimeout(function () {
                    $.publish("gs.facebook.notification.rateLimited", {callback:m, type:"playlist"})
                }, 300) : m()
            }
        }, onSubscribePlaylist:function (f, g) {
            this.connected && this.postLink("me", "http://grooveshark.com" + f.toUrl().replace("#!/", "/"), g, "playlist", "notif", this.callback("initiateRateLimit"), this.callback("onFailedPostEvent"), false, f)
        }, onFollowUser:function (f, g) {
            this.connected && this.postLink("me", "http://grooveshark.com" + f.toUrl().replace("#!/", "/"), g, "user", "notif", this.callback("initiateRateLimit"), this.callback("onFailedPostEvent"), false, f)
        }, onFailedPostEvent:function () {
            $.publish("gs.facebook.notification.sent", {params:{type:"error", hideUndo:true},
                data:{}, notifData:{}})
        }, initiateRateLimit:function () {
            this.autoRateLimited && window.clearTimeout(this.autoRateLimited);
            this.autoRateLimited = setTimeout(this.callback(function () {
                this.autoRateLimited = null
            }), this.AUTO_RATE_LIMIT)
        }, postToFeed:function (f, g, k, m, h, n, q, s, w) {
            f = _.orEqual(f, "me");
            this.postToFacebook("/" + f + "/feed", f, g, k, m, h, n, q, false, w)
        }, postLink:function (f, g, k, m, h, n, q, s, w) {
            f = _.orEqual(f, "me");
            this.postToFacebook("/" + f + "/links", f, g, k, m, h, n, q, s, w)
        }, postToFacebook:function (f, g, k, m, h, n, q, s, w, o) {
            if (this.connected) {
                var u =
                {};
                u.link = k;
                u.message = m;
                u.access_token = FB.getAccessToken();
                u.type = _.orEqual(h, "song");
                u.ref = _.orEqual(n, "");
                k = $.extend(u, {hideUndo:!w, object:o});
                FB.api(f, "post", u, this.callback("onPostAPIReturn", k, f, g, q, s))
            } else $.isFunction(s) && s("No facebook session.")
        }, onPostAPIReturn:function (f, g, k, m, h, n) {
            n.error ? this.onFailedPost(g, h, n.error, k, f) : this.onFeedPost(f, m, k, n)
        }, onFeedPost:function (f, g, k, m) {
            m.target = k;
            f.type && $.publish("gs.facebook.notification.sent", {params:f, data:m, notifData:{}});
            g && g();
            GS.getGuts().forceLogEvent("facebookShareAPI",
                    {userID:GS.user.UserID, success:1})
        }, onFailedPost:function (f, g, k, m, h) {
            this.lastError = k;
            $.isFunction(g) && g(k);
            if (k.type == "OAuthException" && (k.message.indexOf("User not visible") > -1 || k.message.indexOf("Requires extended permission") > -1))k.message += " (Target: " + m + ")"; else if (h && k.type == "OAuthException" && k.message.indexOf("Param message must be non-blank text") > -1)k.message += " (Message: " + _.cleanText(h.message) + ")"; else if (h && k.type == "OAuthException" && k.message.indexOf("An active access token must be used to query information") >
                    -1)k.message = "An active access token needed.";
            if (GS.airbridge && GS.airbridge.isDesktop)k.message += " (Desktop)";
            k.message += FB.getAccessToken() && FB.getAccessToken() !== "" ? " (" + FB.getAccessToken().substring(0, 10) + ")" : " (No Access Token)";
            if (this.connected)k.message += " (Connected)";
            if (this.facebookUserID)k.message += " (FBUID: " + this.facebookUserID + ")";
            GS.getGuts().forceLogEvent("facebookShareErrMessage", {message:k.message, type:k.type});
            GS.getGuts().forceLogEvent("facebookShareAPI", {userID:GS.user.UserID,
                success:0})
        }, removeEvent:function (f) {
            if (window.FB && this.connected && f && f.id) {
                var g = (f.target == "me" ? FB.getAuthResponse().userID : f.user) + "_" + f.id;
                FB.api("/" + g + "?method=delete", this.callback("onRemoveEvent", f))
            }
        }, onRemoveEvent:function (f, g) {
            if (g)$.publish("gs.facebook.notification.removed", {data:g, params:f}); else {
                this.onFailedPost(null, null, g);
                $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_FACEBOOK_UNDO_FAILED")})
            }
        }, onNowPlaying:function (f) {
            if (this.connected && this.scrobblingEnabled) {
                if (!this.currentListening ||
                        f.queueSongID != this.currentListening.song.queueSongID || f.SongID != this.currentListening.song.SongID) {
                    this.currentListening && this.currentListening.id && this.currentListening.secondsListened < this.MINIMUM_DURATION && this.deleteListen(this.currentListening.id);
                    this.currentListening = {song:f, secondsListened:0, id:null, tries:0}
                } else if (GS.player.repeatMode == GS.player.REPEAT_ONE && f.queueSongID == this.currentListening.song.queueSongID) {
                    this.currentListening.secondsListened = 0;
                    if (this.currentListening.id) {
                        this.deleteListen(this.currentListening.id,
                                this.callback(function () {
                                    delete this.currentListening.id;
                                    this.currentListening.tries = 0;
                                    this.postListen(this.currentListening.song, this.callback("onNowPlayingComplete"))
                                }));
                        return
                    }
                } else return;
                f && this.postListen(f, this.callback("onNowPlayingComplete"))
            }
        }, onNowPlayingComplete:function (f, g) {
            if (!g || !g.id) {
                if (this.currentListening.tries > 1)if (g.error && g.error.message && (g.error.message.indexOf("Timeline is not activated") !== -1 || g.error.message.indexOf("Requires extended permission") !== -1)) {
                    $.publish("gs.facebook.notification.cannotPost",
                            {notifLocale:"POPUP_LOGIN_FACEBOOK_FLAGS_LISTEN_PERMS_FAILED", cancelButton:"NOTIF_FACEBOOK_LISTENS_DISABLE", successButton:"SURE", error:true});
                    this.scrobblingEnabled = false
                } else {
                    if (g.error && g.error.message)g.error.message += " (Scrobble)";
                    this.onFailedPost("scrobble", function () {
                        $.publish("gs.notification", {type:"error", message:$.localize.getString("POPUP_FAIL_LISTENS_FACEBOOK")})
                    }, g.error)
                }
            } else this.currentListening.id = g.id
        }, onSongPlaying:function (f) {
            if (this.connected && this.scrobblingEnabled) {
                f = f.activeSong;
                if (!this.currentListening || f.queueSongID != this.currentListening.song.queueSongID || f.SongID != this.currentListening.song.SongID)this.onNowPlaying(f); else this.currentListening.secondsListened += 0.5
            }
        }, onPlayStatusChange:function (f) {
            if (this.connected && this.scrobblingEnabled && this.currentListening && this.currentListening.song)switch (f.status) {
                case GS.player.PLAY_STATUS_FAILED:
                case GS.player.PLAY_STATUS_PAUSED:
                case GS.player.PLAY_STATUS_NONE:
                    if (this.currentListening.id && this.currentListening.secondsListened <
                            this.MINIMUM_DURATION)this.deleteListen(this.currentListening.id, this.callback(function () {
                        delete this.currentListening.id;
                        this.currentListening.tries = 0
                    })); else if (this.currentListening.id && !this.currentListening.paused) {
                        var g = new Date;
                        this.updateListenEndTime(this.currentListening.id, g);
                        this.currentListening.paused = true
                    }
                    break;
                case GS.player.PLAY_STATUS_PLAYING:
                    if (this.currentListening.id) {
                        if (this.currentListening.paused) {
                            g = new Date;
                            if (this.currentListening.expires && this.currentListening.expires - g <
                                    0)this.deleteListen(this.currentListening.id, this.callback(function () {
                                delete this.currentListening.id;
                                this.currentListening.tries = 0;
                                this.postListen(this.currentListening.song, this.callback("onNowPlayingComplete"))
                            })); else {
                                g = new Date;
                                g.setTime(g.getTime() + f.duration - f.position);
                                this.updateListenEndTime(this.currentListening.id, g)
                            }
                        }
                    } else this.postListen(this.currentListening.song, this.callback("onNowPlayingComplete"));
                    this.currentListening.paused = false;
                    break
            }
        }, postListen:function (f, g) {
            if (!(!FB.getAccessToken() ||
                    this.currentListening && (this.currentListening.posting || this.currentListening.tries > 1))) {
                if (this.currentListening) {
                    this.currentListening.posting = true;
                    this.currentListening.tries++
                }
                var k = GS.player.getPlaybackStatus();
                setTimeout(this.callback(function () {
                    var m = {}, h = f.toUrl().replace("#!/", "/");
                    if (h.toLowerCase() == "/notfound")$.publish("gs.notification", {type:"error", message:$.localize.getString("POPUP_FAIL_LISTENS_FACEBOOK")}); else {
                        m.song = "http://grooveshark.com" + h;
                        m.access_token = FB.getAccessToken();
                        if (f.AlbumID && f.AlbumName)m.album = "http://grooveshark.com" + _.cleanUrl(f.AlbumName, f.AlbumID, "album").replace("#!/", "/");
                        if (f.ArtistID && f.ArtistName)m.album = "http://grooveshark.com" + _.cleanUrl(f.ArtistName, f.ArtistID, "artist").replace("#!/", "/");
                        if (k.duration) {
                            m.expires_in = Math.round((k.duration - k.position) / 1E3);
                            h = new Date;
                            this.currentListening.expires = h.setTime(h.getTime() + k.duration)
                        }
                        FB.api("/me/grooveshark:listen", "post", m, this.callback(function (n) {
                            $.isFunction(g) && g(f, n);
                            delete this.currentListening.posting;
                            GS.getGuts().logEvent("facebookScrobbleSuccess", {userID:GS.user.UserID})
                        }))
                    }
                }), 50)
            }
        }, updateListenEndTime:function (f, g) {
            function k(h) {
                return h < 10 ? "0" + h : h
            }

            var m = g.getUTCFullYear() + "-" + k(g.getUTCMonth() + 1) + "-" + k(g.getUTCDate()) + "T" + k(g.getUTCHours()) + ":" + k(g.getUTCMinutes()) + ":" + k(g.getUTCSeconds()) + "Z";
            FB.api("/" + f + "?end_time=" + m, "post")
        }, deleteLastListen:function () {
            this.currentListening && this.currentListening.id && this.deleteListen(this.currentListening.id, this.callback(function () {
                delete this.currentListening.id;
                this.currentListening.tries = 0
            }))
        }, deleteListen:function (f, g) {
            if (!this.currentListening.deleting) {
                this.currentListening.deleting = true;
                FB.api("/" + f + "?method=delete", this.callback("onDeleteListen", g))
            }
        }, onDeleteListen:function (f, g) {
            if (g)$.isFunction(f) && f(); else $.publish("gs.notification", {type:"error", message:$.localize.getString("POPUP_FAIL_LISTENS_FACEBOOK")});
            delete this.currentListening.deleting
        }, getFriends:function (f) {
            if (this.friends)f(this.friends); else if (this.connected)FB.api("me/friends",
                    this.callback("onFacebookGetFriends", f)); else $.isFunction(f) && f(null)
        }, onFacebookGetFriends:function (f, g) {
            if (g.data) {
                var k = [];
                $.each(g.data, function (m, h) {
                    k.push(h)
                });
                k.sort(function (m, h) {
                    var n = (m.name || "").toLowerCase(), q = (h.name || "").toLowerCase();
                    if (n < q)return-1; else if (n > q)return 1;
                    return 0
                });
                this.friends = k
            } else if (g.error) {
                this.lastError = g.error;
                $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_FACEBOOK_FINDFRIENDS_ERROR")});
                $.isFunction(f) && f(null)
            }
            $.isFunction(f) &&
            f(this.friends)
        }, canPostToFriend:function (f, g) {
            (f = parseInt(f)) || $.isFunction(g) && g(false);
            if (this.friendPermissions[f] && typeof this.friendPermissions[f].canPost != "undefined")$.isFunction(g) && g(this.friendPermissions[f].canPost); else this.queryFQL("select can_post FROM user WHERE uid = " + f, this.callback(function (k) {
                if (k[0] && k[0]) {
                    if (this.friendPermissions[f])this.friendPermissions[f].canPost = k[0].can_post; else this.friendPermissions[f] = {canPost:k[0].can_post};
                    $.isFunction(g) && g(k[0].can_post)
                }
            }), function () {
                    },
                    2)
        }, checkUserPermissions:function (f, g, k) {
            if (!FB.getAccessToken()) {
                if (k)k(); else g && g(false);
                return false
            }
            if (this.userPermissions)if (f.indexOf(",") > 0) {
                for (var m = f.split(","), h = true, n = 0, q = m.length; n < q; n++)if (!this.userPermissions[m[n]] || this.userPermissions[m[n]] == "0") {
                    h = false;
                    break
                }
                if (h)if ($.isFunction(g)) {
                    g(true);
                    return
                }
            } else if (this.userPermissions[f] && this.userPermissions[f] != "0")if ($.isFunction(g)) {
                g(true);
                return
            }
            this.queryFQL("SELECT " + f + " FROM permissions WHERE uid = me()", this.callback(function (s) {
                if (s &&
                        s[0]) {
                    $.extend(this.userPermissions, s[0]);
                    for (var w in s[0])if (w && s[0].hasOwnProperty(w))if (s[0][w] == "0") {
                        $.isFunction(g) && g(false);
                        return
                    }
                    $.isFunction(g) && g(true)
                } else $.isFunction(g) && g(false)
            }), k, false)
        }, getFacebookDetails:function (f, g) {
            if (f.toUrl) {
                var k = "http://listen.grooveshark.com/" + f.toUrl().replace("#!/", "");
                GS.service.makeFacebookRequest("?ids=" + encodeURIComponent(k) + "&limit=100", null, "GET", function (m) {
                    try {
                        if (m) {
                            m = JSON.parse(m);
                            _.forEach(m, function (n) {
                                g(n)
                            })
                        }
                    } catch (h) {
                    }
                })
            }
        }, getGroovesharkUsersFromFriends:function (f) {
            this.getFriends(this.callback(function (g) {
                if ($.isArray(g)) {
                    var k =
                            [], m = [];
                    $.each(g, function (h, n) {
                        if (n && n.id) {
                            k.push(n.id);
                            m[n.id] = n.name
                        }
                    });
                    GS.service.getGroovesharkUsersFromFacebookUserIDs(k, this.callback("onGetGroovesharkUsers", m, f), function () {
                        $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_FACEBOOK_FINDFRIENDS_ERROR")});
                        $.isFunction(f) && f()
                    })
                } else {
                    $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_FACEBOOK_FINDFRIENDS_ERROR")});
                    $.isFunction(f) && f()
                }
            }))
        }, onGetGroovesharkUsers:function (f, g, k) {
            var m = [], h =
                    false;
            if (k) {
                $.each(k, function (n, q) {
                    if (q && q.UserID && q.FacebookUserID && GS.user.favorites.users && !GS.user.favorites.users[q.UserID]) {
                        q.FacebookName = f[q.FacebookUserID];
                        m.push(q)
                    } else if (GS.user.favorites.users && GS.user.favorites.users[q.UserID])h = true
                });
                if (m && m.length > 0)GS.getLightbox().open("gsUsersFromThirdParty", {users:m, isTwitter:false, isFacebook:true}); else h ? $.publish("gs.facebook.notification.findFriends", {message:"NOTIF_FACEBOOK_FINDFRIENDS_ALREADY", inviteFriends:false}) : $.publish("gs.facebook.notification.findFriends",
                        {message:"NOTIF_FACEBOOK_FINDFRIENDS_NONE", inviteFriends:true})
            } else $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_FACEBOOK_FINDFRIENDS_ERROR")});
            $.isFunction(g) && g()
        }})
})();

