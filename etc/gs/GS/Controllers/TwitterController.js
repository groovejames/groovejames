(function () {
    var c = 0;
    GS.Controllers.BaseController.extend("GS.Controllers.TwitterController", {isGSSingleton:true, preSetup:function () {
        var a = GS.Controllers.BaseController.singletonCallback, b = $.subscribe;
        b("gs.auth.update", a("twitter", "update"))
    }}, {SERVICE_ID:4096, TWITTER_ONLY_SERVICE_ID:8192, twitterOpenerWindow:null, connected:false, registeredWithTwitter:false, profile:{}, oauthToken:"", oauthSecret:"", friendIDs:false, friends:{}, friendCount:0, followerIDs:false, followers:{}, followerCount:0, canUpdate:false,
        loginSuccessCallback:null, loginFailedCallback:null, twitterLoaded:false, lastError:null, init:function () {
            if (!window.confirmTwitterConnection)window.confirmTwitterConnection = this.callback(function (a) {
                if (this.twitterOpenerWindow)this.twitterOpenerWindow = null;
                try {
                    a = JSON.parse(a)
                } catch (b) {
                    this.lastError = "parseError";
                    this.loginFailedCallback();
                    return
                }
                if (a.mode == "cancel" || a.error == "cancel") {
                    this.lastError = "cancel";
                    this.onCancelledLogin()
                } else GS.airbridge && GS.airbridge.isDesktop ? window.setTimeout(function () {
                            GS.getTwitter().onLogin(a)
                        },
                        300) : this.onLogin(a)
            });
            this._super()
        }, appReady:function () {
            c = this.subscribe("gs.cowbell.ready", this.callback("commReady"));
            if (!window.name)window.name = gsConfig.windowName
        }, commReady:function () {
            if (_.browserDetect().browser != "msie" || _.browserDetect().version > 6) {
                window.twLoadAttempts = 0;
                window.loadTwitter = function () {
                    try {
                        if (document.getElementById("tw-root") && document.getElementById("tw-root").getElementsByTagName("script").length) {
                            document.getElementById("tw-root").removeChild(document.getElementById("tw-root").getElementsByTagName("script")[0]);
                            document.getElementById("tw-root") && document.getElementById("tw-root").getElementsByTagName("div").length && document.getElementById("tw-root").removeChild(document.getElementById("tw-root").getElementsByTagName("div")[0]);
                            window.twttr = null;
                            GS.getTwitter().twitterloaded = false
                        }
                        var a = document.createElement("script");
                        a.async = true;
                        a.src = document.location.protocol + "//platform.twitter.com/widgets.js";
                        a.onload = a.onreadystatechange = function () {
                            if ($.browser.msie && this.readyState) {
                                if (this.readyState === "complete" ||
                                        this.readyState === "loaded") {
                                    this.onload = this.onreadystatechange = null;
                                    setTimeout(function () {
                                        window.twttr && GS.getTwitter().initTwitter()
                                    }, 10)
                                }
                            } else {
                                this.onload = this.onreadystatechange = null;
                                setTimeout(function () {
                                    window.twttr && GS.getTwitter().initTwitter()
                                }, 10)
                            }
                        };
                        document.getElementById("tw-root").appendChild(a);
                        window.twLoadAttempts++;
                        window.twitterLoadTimeout = setTimeout(function () {
                            if ((!window.twttr || !GS.getTwitter().twitterloaded) && window.twLoadAttempts < 3)window.loadTwitter(); else!window.twttr && window.twLoadAttempts >=
                                    3 || window.twttr && !GS.getTwitter().twitterloaded && GS.getTwitter().initTwitter()
                        }, 2E4)
                    } catch (b) {
                        console.error("Could not load Twitter JS. Fatal Error: ", b);
                        GS.getTwitter().lastError = b
                    }
                };
                window.loadTwitter()
            }
            this.canUpdate = true;
            this.update();
            if (c) {
                $.unsubscribe(c);
                c = 0
            }
        }, initTwitter:function () {
            this.twitterLoaded = true;
            window.twitterLoadTimeout && clearTimeout(window.twitterLoadTimeout);
            twttr.events.bind("tweet", function (a) {
                if (a) {
                    var b;
                    if (a.target && a.target.nodeName == "IFRAME" && a.target.src) {
                        a = decodeURI(a.target.src).split("&");
                        for (var d = 0, f; f = a[d]; ++d)if (f.indexOf("url=") === 0)b = unescape(f.split("=")[1])
                    }
                    window._gaq && window._gaq.push && window._gaq.push(["_trackSocial", "twitter", "tweet", b])
                }
            });
            $.subscribe("gs.theme.set", this.parseWidgets)
        }, parseWidgets:function () {
            window.twttr && window.twttr.widgets.load()
        }, getTwitterShareMessage:function (a, b, d, f, g) {
            var k = this.callback(function (m) {
                m = m.tinySongURL;
                var h = new GS.Models.DataString;
                switch (a) {
                    case "song":
                        var n = b.SongName;
                        if (n.length > 40)n = n.substr(0, 40) + "...";
                        h.string = $.localize.getString("SHARE_TWITTER_SONG");
                        h.data = {SongName:n, ArtistName:b.ArtistName};
                        h = h.render();
                        break;
                    case "artist":
                        n = b.ArtistName;
                        if (n.length > 60)n = n.substr(0, 60) + "...";
                        h.string = $.localize.getString("SHARE_TWITTER_ARTIST");
                        h.data = {ArtistName:n};
                        h = h.render();
                        break;
                    case "album":
                        n = b.AlbumName;
                        if (n.length > 40)n = n.substr(0, 40) + "...";
                        h.string = $.localize.getString("SHARE_TWITTER_ALBUM");
                        h.data = {AlbumName:n, ArtistName:b.ArtistName};
                        h = h.render();
                        break;
                    case "playlist":
                        n = b.PlaylistName;
                        if (n.length > 40)n = n.substr(0, 40) + "...";
                        h.string = $.localize.getString("SHARE_TWITTER_PLAYLIST");
                        h.data = {PlaylistName:n, UserName:b.UserName};
                        h = h.render();
                        break;
                    default:
                        h = "";
                        break
                }
                if (h.length < 129 - m.length - 18)h += " #nowplaying";
                if (h.length < 128 - m.length - 18 && (new Date).format("D") === "Mon")h += " #musicmonday";
                if (h.length < 131 - m.length - 18 && (new Date).format("D") === "Tue")h += " #tunesday";
                f(h, m)
            });
            if (a == "playlist") {
                d = "http://tinysong.com/p/" + _.base62Encode(b.PlaylistID + "");
                k({tinySongURL:d})
            } else if (a == "song")GS.service.getDetailsForBroadcast(b.SongID, k, this.callback(function () {
                k({tinySongURL:d})
            })); else g ?
                    k({tinySongURL:d}) : this.getTinySongURL(d, this.callback(function (m) {
                k({tinySongURL:m})
            }))
        }, getTinySongURL:function (a, b) {
            $.ajax({url:"http://api.bitly.com/v3/shorten?login=grooveshark&apiKey=R_44014f5c4cfe09348eced3baebeadcc3&longUrl=" + a, dataType:"jsonp", success:this.callback(function (d) {
                d && d.data && d.data.url ? b(d.data.url) : b(a)
            }), error:this.callback(function () {
                b(a)
            })})
        }, update:function () {
            if (this.canUpdate) {
                this.canUpdate = false;
                if (GS.user && GS.user.isLoggedIn && (GS.user.Flags & this.SERVICE_ID || GS.user.Flags &
                        this.TWITTER_ONLY_SERVICE_ID)) {
                    this.registeredWithTwitter = (GS.user.Flags & this.TWITTER_ONLY_SERVICE_ID) > 0;
                    GS.service.getUserTwitterData(this.callback("onUserTwitterData", null, null))
                } else this.clearInfo();
                setTimeout(this.callback(function () {
                    this.canUpdate = true
                }), 0)
            }
        }, onUserTwitterData:function (a, b, d) {
            try {
                if (d) {
                    if (d.TwitterUserID && d.OAuthToken && d.OAuthSecret && d.twitterProfileURL) {
                        this.profile = {id_str:d.TwitterUserID};
                        this.oauthToken = d.OAuthToken;
                        this.oauthSecret = d.OAuthSecret;
                        this.getProfile(d.twitterProfileURL,
                                d.twitterProfileCallback)
                    } else this.showReAuthLightbox();
                    $.isFunction(a) && a(d)
                } else {
                    GS.user.Flags = (GS.user.Flags | this.SERVICE_ID) - this.SERVICE_ID;
                    if (this.registeredWithTwitter)GS.user.Flags = (GS.user.Flags | this.TWITTER_ONLY_SERVICE_ID) - this.TWITTER_ONLY_SERVICE_ID;
                    this.clearInfo();
                    $.isFunction(b) && b({error:"TWITTER_MISSING_LOGIN_INFO_ERROR_MSG"})
                }
            } catch (f) {
                this.connected = false;
                $.isFunction(b) && b({error:"TWITTER_MISSING_LOGIN_INFO_ERROR_MSG"})
            }
        }, showReAuthLightbox:function () {
            GS.getLightbox().close();
            GS.getLightbox().open({type:"reAuthTwitter", view:{header:"POPUP_TWITTER_REAUTH_TITLE", message:"POPUP_TWITTER_REAUTH_MESSAGE", buttonsRight:[
                {label:"POPUP_REAUTH_SUBMIT", className:"submit"}
            ], buttonsLeft:GS.getTwitter().registeredWithTwitter ? [] : [
                {label:"POPUP_TWITTER_REAUTH_CANCEL", className:"close"}
            ]}, callbacks:{".submit":function () {
                GS.getTwitter().logout(function () {
                    GS.getTwitter().login(function () {
                        GS.getLightbox().close()
                    })
                })
            }, ".close":function () {
                GS.getTwitter().logout(function () {
                    GS.getLightbox().close()
                })
            }}})
        },
        onAuthTwitterUser:function (a, b, d) {
            if (d && d.TwitterProfile && d.TwitterProfile.name) {
                this.profile = d.TwitterProfile;
                if (d.userID == 0)this.register(a, b); else {
                    $.isFunction(a) && a(d);
                    GS.getGuts().logEvent("twitterAuthenticated", {authenticated:true})
                }
            } else $.isFunction(b) && b({error:"TWITTER_MISSING_LOGIN_INFO_ERROR_MSG"})
        }, onSaveUserTwitterData:function (a, b, d) {
            if (d.result == 1) {
                this.getProfile(d.twitterProfileURL, d.twitterProfileCallback);
                $.isFunction(a) && a();
                if (!(GS.user.Flags & this.SERVICE_ID) && !(GS.user.Flags &
                        this.TWITTER_ONLY_SERVICE_ID)) {
                    $.publish("gs.twitter.notification.findFriends");
                    GS.getGuts().logEvent("twitterNewSave", {newSave:true})
                }
            } else if (d.result == -1)if (GS.user.Flags & this.SERVICE_ID || GS.user.Flags & this.TWITTER_ONLY_SERVICE_ID)GS.service.getUserTwitterData(this.callback("onUserTwitterData", a, function () {
                b("TWITTER_PROBLEM_CONNECTING_ERROR_MSG")
            })); else $.isFunction(b) && b({error:"TWITTER_DUPLICATE_ACCOUNT_ERROR_MSG"}); else if (d.result == -2)$.isFunction(b) && b({error:"TWITTER_MISSING_LOGIN_INFO_ERROR_MSG"});
            else b && b({error:"POPUP_SIGNUP_LOGIN_FORM_TWITTER_ERROR"})
        }, register:function (a, b) {
            var d = this.profile.screen_name, f = this.profile.name || "", g = this.profile.id_str;
            f || d ? GS.service.getUsernameSuggestions(d, f, g, this.callback("usernameSuggestSuccess", a, b), this.callback("usernameSuggestFailed", a, b)) : this.usernameSuggestFailed("")
        }, usernameSuggestSuccess:function (a, b, d) {
            b = "";
            if (d && d.length > 0)b = d[0];
            this.openRegisterLightbox(a, b)
        }, usernameSuggestFailed:function (a, b) {
            a && b ? b({error:"POPUP_SIGNUP_LOGIN_FORM_TWITTER_ERROR"}) :
                    this.openRegisterLightbox(null, "")
        }, openRegisterLightbox:function (a, b) {
            var d = {isTwitter:true, username:b, fname:this.profile.name, twitterData:{twitterUserID:this.profile.id_str, oauthToken:this.oauthToken, oauthSecret:this.oauthSecret}, message:$.localize.getString("POPUP_SIGNUP_LOGIN_FORM_TWITTER_NOT_FOUND")};
            GS.user.defaultFromService = d;
            GS.getLightbox().close();
            GS.page.activePageName == "SignupController" ? GS.page.activePage.update(d) : GS.router.setHash("/signup");
            GS.getGuts().logEvent("twitterRegistered",
                    {registered:true})
        }, login:function (a, b) {
            var d = googleOpenIDPopup.getCenteredCoords(650, 600);
            this.twitterOpenerWindow = window.open("http://" + window.location.host + "/twitterCallback.php?window=" + window.name, "", "width=650,height=600,left=" + d[0] + ",top=" + d[1]);
            this.loginSuccessCallback = a;
            this.loginFailedCallback = b;
            if (GS.airbridge && GS.airbridge.isDesktop)this.twitterOpenerWindow.parentSandboxBridge = {confirmTwitterConnection:window.confirmTwitterConnection}
        }, onLogin:function (a) {
            if (a.error) {
                this.lastError = a.error;
                this.loginFailedCallback()
            } else {
                if (a.oauth_token && a.oauth_token_secret) {
                    this.profile = a;
                    this.oauthToken = a.oauth_token;
                    this.oauthSecret = a.oauth_token_secret
                }
                if (GS.user.isLoggedIn)GS.user.Flags & this.SERVICE_ID || GS.user.Flags & this.TWITTER_ONLY_SERVICE_ID ? GS.service.updateUserTwitterData(this.profile.id_str, this.oauthToken, this.oauthSecret, this.callback("onSaveUserTwitterData", this.loginSuccessCallback, this.loginFailedCallback), this.loginFailedCallback) : GS.service.saveUserTwitterData(this.profile.id_str,
                        this.oauthToken, this.oauthSecret, this.callback("onSaveUserTwitterData", this.loginSuccessCallback, this.loginFailedCallback), this.loginFailedCallback); else GS.service.authenticateTwitterUser(this.profile.id_str, this.oauthToken, this.oauthSecret, this.callback("onAuthTwitterUser", this.loginSuccessCallback, this.loginFailedCallback), this.loginFailedCallback)
            }
        }, getProfile:function (a, b) {
            $.ajax({url:a, success:this.callback("onGetProfile"), error:this.callback(function (d) {
                this.lastError = d;
                this.showReAuthLightbox()
            }),
                dataType:"jsonp", jsonp:false, jsonpCallback:b, cache:true})
        }, onGetProfile:function (a) {
            if (a.id_str && a.profile_image_url) {
                this.profile = a;
                this.connected = true;
                $.publish("gs.twitter.profile.update")
            } else {
                this.lastError = a;
                this.showReAuthLightbox()
            }
        }, onCancelledLogin:function () {
        }, onLogout:function (a) {
            this.clearInfo();
            a && a()
        }, clearInfo:function () {
            this.connected = false;
            this.oauthSecret = this.oauthToken = null;
            this.profile = {};
            this.friendIDs = this.registeredWithTwitter = false;
            this.friends = {};
            this.friendCount = 0;
            this.followers =
            {};
            this.followersIDs = false;
            this.followerCount = 0;
            $.publish("gs.twitter.profile.update")
        }, logout:function (a) {
            this.profile && this.profile.id_str ? GS.service.removeUserTwitterData(this.profile.id_str, this.callback("onLogout", a)) : GS.service.removeUserTwitterData(null, this.callback("onLogout", a))
        }, serviceLogout:function () {
            var a = googleOpenIDPopup.getCenteredCoords(1E3, 580);
            window.open("https://twitter.com/logout", "", "width=1000,height=580,status=1,location=1,resizable=yes,left=" + a[0] + ",top=" + a[1])
        }, postTweet:function (a, b, d, f) {
            if (this.oauthToken && this.oauthSecret)GS.service.postTwitterStatus(a, this.oauthToken, this.oauthSecret, this.callback("onPostTweet", b, d, f), this.callback("onFailedPostTweet", f)); else $.isFunction(f) && f()
        }, onPostTweet:function (a, b, d, f) {
            if (f.success && f.response.id) {
                $.publish("gs.twitter.notification.sent", {type:a});
                $.isFunction(b) && b();
                GS.getGuts().forceLogEvent("twitterShareAPI", {userID:GS.user.UserID, success:1})
            } else this.onFailedPostTweet(d, f)
        }, onFailedPostTweet:function (a, b) {
            this.lastError = b;
            var d = {error:"POPUP_SHARE_TWITTER_ERROR"};
            if (b.response && b.response.error && b.response.error == "Status is over 140 characters.")d.error = "POPUP_SHARE_TWITTER_TOO_LONG";
            $.isFunction(a) && a(d);
            GS.getGuts().forceLogEvent("twitterShareAPI", {userID:GS.user.UserID, success:0})
        }, getFollowers:function (a, b) {
            this.followerIDs && this.followers && $.isFunction(a) ? a(this.followerIDs, this.followers) : GS.service.getTwitterFollowers(this.profile.id_str, this.oauthToken, this.oauthSecret, this.callback(function (d) {
                this.followers =
                {};
                this.followerCount = 0;
                if (d.requests.length && d.ids.length)_.forEach(d.requests, this.callback(function (f) {
                    $.ajax({url:f.url, success:this.callback("onGetFollowers", a, d.ids), error:b, dataType:"jsonp", jsonp:false, jsonpCallback:f.callback, cache:true})
                })); else $.isFunction(a) && a(d.ids, this.followers)
            }), this.callback(function (d) {
                this.lastError = d;
                $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_TWITTER_FOLLOWERS_ERROR")});
                $.isFunction(b) && b()
            }))
        }, onGetFollowers:function (a, b, d) {
            _.forEach(d,
                    function (f) {
                        GS.getTwitter().followers[f.id_str] = f;
                        GS.getTwitter().followerCount++
                    });
            $.publish("gs.twitter.followers.update");
            if (Math.ceil(b.length / 100) == Math.ceil(GS.getTwitter().followerCount / 100)) {
                GS.getTwitter().followerIDs = b;
                $.isFunction(a) && a(b, GS.getTwitter().followers)
            }
        }, getFollowing:function (a, b) {
            this.friendIDs && this.friends && $.isFunction(a) ? a(this.friendIDs, this.friends) : GS.service.getTwitterFriends(this.profile.id_str, this.oauthToken, this.oauthSecret, this.callback(function (d) {
                this.friends =
                {};
                this.friendCount = 0;
                if (d.requests && d.ids)_.forEach(d.requests, this.callback(function (f) {
                    $.ajax({url:f.url, success:this.callback("onGetFollowing", a, d.ids), error:b, dataType:"jsonp", jsonp:false, jsonpCallback:f.callback, cache:true})
                })); else $.isFunction(a) && a(d.ids, this.friends)
            }), this.callback(function (d) {
                this.lastError = d;
                $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_TWITTER_FINDFRIENDS_ERROR")});
                $.isFunction(b) && b()
            }))
        }, onGetFollowing:function (a, b, d) {
            _.forEach(d, function (f) {
                GS.getTwitter().friends[f.id_str] =
                        f;
                GS.getTwitter().friendCount++
            });
            $.publish("gs.twitter.friends.update");
            if (Math.ceil(b.length / 100) == Math.ceil(GS.getTwitter().friendCount / 100)) {
                GS.getTwitter().friendIDs = b;
                $.isFunction(a) && a(b, GS.getTwitter().friends)
            }
        }, getGroovesharkUsersFromFollowing:function (a) {
            this.getFollowing(this.callback(function (b) {
                if (b)GS.service.getGroovesharkUsersFromTwitterUserIDs(b, this.callback("onGetGroovesharkUsers", a), function () {
                    $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_TWITTER_FINDFRIENDS_ERROR")});
                    $.isFunction(a) && a()
                }); else {
                    $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_TWITTER_FINDFRIENDS_ERROR")});
                    $.isFunction(a) && a()
                }
            }), function () {
                $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_TWITTER_FINDFRIENDS_ERROR")});
                $.isFunction(a) && a()
            })
        }, onGetGroovesharkUsers:function (a, b) {
            var d = [], f = false;
            if (b) {
                $.each(b, function (g, k) {
                    if (k && k.UserID && k.TwitterUserID && GS.user.favorites.users && !GS.user.favorites.users[k.UserID]) {
                        k.TwitterProfile = GS.getTwitter().friends[k.TwitterUserID];
                        d.push(k)
                    } else if (GS.user.favorites.users && GS.user.favorites.users[k.UserID])f = true
                });
                if (d && d.length > 0)GS.getLightbox().open("gsUsersFromThirdParty", {users:d, isTwitter:true, isFacebook:false}); else f ? $.publish("gs.twitter.notification.findFriends", {message:"NOTIF_TWITTER_FINDFRIENDS_ALREADY", inviteFriends:false}) : $.publish("gs.twitter.notification.findFriends", {message:"NOTIF_TWITTER_FINDFRIENDS_NONE", inviteFriends:true})
            } else $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_TWITTER_FINDFRIENDS_ERROR")});
            $.isFunction(a) && a()
        }})
})();

