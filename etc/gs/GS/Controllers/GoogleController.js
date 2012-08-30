(function () {
    var c = 0;
    GS.Controllers.BaseController.extend("GS.Controllers.GoogleController", {isGSSingleton:true}, {SERVICE_ID:64, GOOGLE_ONLY_SERVICE_ID:32, REQUIRED:"email,firstname,lastname", EXTENSIONS:{"openid.ns.ax":"http://openid.net/srv/ax/1.0", "openid.ax.mode":"fetch_request", "openid.ax.type.email":"http://axschema.org/contact/email", "openid.ax.type.firstname":"http://axschema.org/namePerson/first", "openid.ax.type.lastname":"http://axschema.org/namePerson/last", "openid.ax.required":"email,firstname,lastname",
        "openid.ui.icon":"true"}, googleOpener:null, googleOpenerWindow:null, googleOpenerInterval:null, connected:false, registeredWithGoogle:false, email:"", firstname:"", lastname:"", googleID:"", lastError:"", onLoginSaveData:null, googlePlusloaded:false, loginSuccessCallback:null, loginFailedCallback:null, init:function () {
        this.subscribe("gs.auth.update", this.callback("update"));
        if (!window.confirmGoogleConnection)window.confirmGoogleConnection = this.callback(function (a) {
            if (this.googleOpenerWindow) {
                this.googleOpenerWindow.close();
                this.googleOpenerWindow = null
            }
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
                GS.getGoogle().onLogin(a)
            }, 300) : this.onLogin(a)
        });
        this._super()
    }, appReady:function () {
        c = this.subscribe("gs.cowbell.ready", this.callback("commReady"));
        this.googleOpener = googleOpenIDPopup.createPopupOpener({realm:"http://*.grooveshark.com",
            opEndpoint:"https://www.google.com/accounts/o8/ud", returnToUrl:"http://" + window.location.hostname + "/googleCallback.php?window=" + window.name, shouldEncodeUrls:true, extensions:this.EXTENSIONS});
        if (!window.name)window.name = gsConfig.windowName
    }, commReady:function () {
        if (_.browserDetect().browser != "msie" || _.browserDetect().version > 6) {
            window.goPLoadAttempts = 0;
            window.loadGooglePlus = function () {
                try {
                    var a = document.getElementById("go-root");
                    if (a && a.getElementsByTagName("script").length) {
                        a.removeChild(a.getElementsByTagName("script")[0]);
                        a.getElementsByTagName("div").length && a.removeChild(a.getElementsByTagName("div")[0]);
                        window.gapi = null;
                        GS.getGoogle().googlePlusloaded = false
                    }
                    var b = document.createElement("script");
                    b.async = true;
                    b.src = document.location.protocol + "//apis.google.com/js/plusone.js";
                    b.text = "{parsetags: 'explicit'}";
                    b.onload = b.onreadystatechange = function () {
                        if ($.browser.msie && this.readyState) {
                            if (this.readyState === "complete" || this.readyState === "loaded") {
                                this.onload = this.onreadystatechange = null;
                                setTimeout(function () {
                                    window.gapi &&
                                    GS.getGoogle().initGooglePlus()
                                }, 10)
                            }
                        } else {
                            this.onload = this.onreadystatechange = null;
                            setTimeout(function () {
                                window.gapi && GS.getGoogle().initGooglePlus()
                            }, 10)
                        }
                    };
                    document.getElementById("go-root").appendChild(b);
                    window.goPLoadAttempts++;
                    window.googlePlusLoadTimeout = setTimeout(function () {
                                if ((!window.gapi || !GS.getGoogle().googlePlusloaded) && window.goPLoadAttempts < 3)window.loadGooglePlus(); else!window.gapi && window.goPLoadAttempts >= 3 || window.gapi && !GS.getGoogle().googlePlusloaded && GS.getGoogle().initGooglePlus()
                            },
                            2E4)
                } catch (d) {
                    console.error("Could not load Google JS. Fatal Error: ", d);
                    GS.getGoogle().lastError = d
                }
            };
            window.loadGooglePlus()
        }
        this.update();
        c && $.unsubscribe(c)
    }, initGooglePlus:function () {
        this.googlePlusloaded = true;
        window.googlePlusLoadTimeout && clearTimeout(window.googlePlusLoadTimeout);
        this.parsePlusWidgets();
        $.subscribe("gs.theme.set", function () {
            window.document.getElementById("theme_home") && GS.getGoogle().parsePlusWidgets(window.document.getElementById("theme_home"))
        })
    }, parsePlusWidgets:function (a) {
        if (window.gapi)try {
            window.gapi.plusone.go(a ?
                    a : document.body)
        } catch (b) {
        }
    }, update:function () {
        if (GS.user && GS.user.isLoggedIn && GS.user.UserID > 0 && (GS.user.Flags & this.SERVICE_ID || GS.user.Flags & this.GOOGLE_ONLY_SERVICE_ID)) {
            this.registeredWithGoogle = (GS.user.Flags & this.GOOGLE_ONLY_SERVICE_ID) > 0;
            GS.service.getUserGoogleData(this.callback("onUserGoogleData", null, null))
        } else GS.user && GS.user.isLoggedIn && this.onLoginSaveData && this.onLoginSaveData == GS.user.Email ? GS.service.saveUserGoogleData(this.callback("onSaveUserGoogleData", null, null), function () {
            GS.getGoogle().clearInfo()
        }) :
                this.clearInfo()
    }, showReAuthLightbox:function () {
        GS.getLightbox().open({type:"reAuthGoogle", view:{header:"POPUP_GOOGLE_REAUTH_TITLE", message:"POPUP_GOOGLE_REAUTH_MESSAGE", buttonsRight:[
            {label:"POPUP_REAUTH_SUBMIT", className:"submit"}
        ], buttonsLeft:GS.getGoogle().registeredWithGoogle ? [] : [
            {label:"POPUP_GOOGLE_REAUTH_CANCEL", className:"close"}
        ]}, callbacks:{".submit":function () {
            GS.getGoogle().logout(function () {
                GS.getGoogle().login(function () {
                    GS.getLightbox().close()
                })
            })
        }, ".close":function () {
            GS.getGoogle().logout(function () {
                GS.getLightbox().close()
            })
        }}})
    },
        onUserGoogleData:function (a, b, d) {
            try {
                if (d && d.GoogleEmailAddress && d.GoogleID) {
                    this.email = d.GoogleEmailAddress;
                    this.googleID = d.GoogleID;
                    this.connected = true;
                    $.publish("gs.google.profile.update");
                    a && a()
                } else if (d && (!d.GoogleEmailAddress || !d.GoogleID))this.showReAuthLightbox(); else {
                    GS.user.Flags = (GS.user.Flags | this.SERVICE_ID) - this.SERVICE_ID;
                    if (this.registeredWithGoogle)GS.user.Flags = (GS.user.Flags | this.GOOGLE_ONLY_SERVICE_ID) - this.GOOGLE_ONLY_SERVICE_ID;
                    this.clearInfo();
                    $.isFunction(b) && b({error:"GOOGLE_MISSING_LOGIN_INFO_ERROR_MSG"})
                }
            } catch (f) {
                this.connected =
                        false;
                $.isFunction(b) && b({error:"GOOGLE_MISSING_LOGIN_INFO_ERROR_MSG"})
            }
        }, onAuthGoogleUser:function (a, b, d) {
            if (d)if (d.userID === 0)this.register(a, b); else {
                a(d);
                $.publish("gs.google.profile.update");
                GS.getGuts().logEvent("googleAuthenticated", {authenticated:true})
            } else b && b(d)
        }, onSaveUserGoogleData:function (a, b, d) {
            if (d == 1) {
                this.connected = true;
                $.publish("gs.google.profile.update");
                GS.user.Flags |= this.SERVICE_ID;
                $.isFunction(a) && a()
            } else if (d == -1)if (GS.user.Flags & this.SERVICE_ID || GS.user.Flags & this.GOOGLE_ONLY_SERVICE_ID)GS.service.getUserGoogleData(this.callback("onUserGoogleData",
                    a, function () {
                        b("GOOGLE_PROBLEM_CONNECTING_ERROR_MSG")
                    }), function () {
                b("GOOGLE_PROBLEM_CONNECTING_ERROR_MSG")
            }); else b && b({error:"GOOGLE_DUPLICATE_ACCOUNT_ERROR_MSG", signupError:4096}); else if (d == -2)b && b({error:"GOOGLE_MISSING_LOGIN_INFO_ERROR_MSG"}); else b && b({error:"POPUP_SIGNUP_LOGIN_FORM_GOOGLE_ERROR"})
        }, register:function (a, b) {
            var d = this.email.split("@")[0];
            if (d) {
                d = d.replace(/^[\.\-_]|[^a-zA-Z0-9\.\-_]|[\.\-_]$/g, "");
                d = d.replace(/([\.\-_]){2,}/g, "$1")
            }
            var f = this.firstname + " " + this.lastname, g = Math.floor(Math.random() *
                    997508) + 1005;
            f || d ? GS.service.getUsernameSuggestions(d, f, g, this.callback("usernameSuggestSuccess", a, b), this.callback("usernameSuggestFailed", a, b)) : this.usernameSuggestFailed("")
        }, usernameSuggestSuccess:function (a, b, d) {
            b = "";
            if (d && d.length > 0)b = d[0];
            this.openRegisterLightbox(a, b)
        }, usernameSuggestFailed:function (a, b) {
            a && b ? b({error:"POPUP_SIGNUP_LOGIN_FORM_GOOGLE_ERROR"}) : this.openRegisterLightbox(null, "")
        }, openRegisterLightbox:function (a, b) {
            var d = {isGoogle:true, googleData:{email:this.email, googleID:this.googleID},
                username:b, email:this.email, fname:this.firstname + " " + this.lastname, message:$.localize.getString("POPUP_SIGNUP_LOGIN_FORM_GOOGLE_NOT_FOUND")};
            GS.user.defaultFromService = d;
            GS.getLightbox().close();
            GS.page.activePageName == "SignupController" ? GS.page.activePage.update(d) : GS.router.setHash("/signup");
            GS.getGuts().logEvent("googleRegistered", {registered:true})
        }, login:function (a, b) {
            this.googleOpenerWindow = this.googleOpener.popup(450, 600);
            this.loginSuccessCallback = a;
            this.loginFailedCallback = b;
            if (GS.airbridge &&
                    GS.airbridge.isDesktop)this.googleOpenerWindow.parentSandboxBridge = {confirmGoogleConnection:window.confirmGoogleConnection}
        }, onLogin:function (a) {
            if (a.error) {
                this.lastError = a.error;
                this.loginFailedCallback()
            } else {
                if (a.firstName)this.firstname = a.firstName;
                if (a.lastName)this.lastname = a.lastName;
                if (a.email)this.email = a.email;
                if (a.googleID)this.googleID = a.googleID;
                if (GS.user.isLoggedIn)GS.user.Flags & this.SERVICE_ID || GS.user.Flags & this.GOOGLE_ONLY_SERVICE_ID ? GS.service.updateUserGoogleData(this.callback("onSaveUserGoogleData",
                        this.loginSuccessCallback, this.loginFailedCallback), this.loginFailedCallback) : GS.service.saveUserGoogleData(this.callback("onSaveUserGoogleData", this.loginSuccessCallback, this.loginFailedCallback), this.loginFailedCallback); else GS.service.authenticateGoogleUser(this.callback("onAuthGoogleUser", this.loginSuccessCallback, this.loginFailedCallback), this.loginFailedCallback)
            }
        }, onCancelledLogin:function () {
        }, onLogout:function (a) {
            if (!this.registeredWithGoogle)GS.user.Flags = (GS.user.Flags | this.SERVICE_ID) -
                    this.SERVICE_ID;
            this.clearInfo();
            $.publish("gs.google.profile.update");
            this.registeredWithGoogle && GS.auth.logout();
            $.isFunction(a) && a()
        }, clearInfo:function () {
            this.identity = null;
            this.lastname = this.firstname = this.email = "";
            this.registeredWithGoogle = this.connected = false;
            this.googleID = this.onLoginSaveData = null
        }, logout:function (a) {
            this.googleID ? GS.service.removeUserGoogleData(this.googleID, this.callback("onLogout", a)) : GS.service.removeUserGoogleData(false, this.callback("onLogout", a))
        }, serviceLogout:function () {
            var a =
                    googleOpenIDPopup.getCenteredCoords(890, 600);
            window.open("https://www.google.com/accounts/Logout", "", "width=890,height=600,status=1,location=1,resizable=yes,left=" + a[0] + ",top=" + a[1])
        }})
})();

