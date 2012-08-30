GS.Controllers.BaseController.extend("GS.Controllers.HeaderController", {onElement:"#header"}, {init:function () {
    this.subscribe("gs.auth.update", this.callback("update"));
    this.subscribe("gs.auth.user.pathName", this.callback("update"));
    this.subscribe("gs.page.view", this.callback("updateSection"));
    this.subscribe("gs.router.history.change", this.callback("updateNavButtons"));
    this._super()
}, appReady:function () {
    this.update();
    var c = $.cookie("jvisible"), a = $.cookie("jpreview");
    if (c) {
        var b = (navigator.userAgent ||
                "").toLowerCase().indexOf("chrome") >= 0, d = GS.getLocale().locale;
        c = (c + "").split(":");
        if (c[1] == "838fa" && (!a || a == "yes") && b && d) {
            var f;
            switch (GS.getLocale().locale) {
                case "en":
                    f = 'We have a new design in the works! <a id="gotojh" style="color: #f77f00;">Check it out!</a> You can always switch back.';
                    break;
                case "es":
                    f = 'Tenemos un nueva versi\u00f3n de Grooveshark en camino! <a id="gotojh" style="color: #f77f00;">Pru\u00e9bala aqu\u00ed!</a> Siempre puedes regresar a la otra versi\u00f3n.';
                    break
            }
            $("#header").before('<div id="jh-invite" style="height: 30px; background: #000;"><p style="text-align: center; color: #fff; display: block; height: 30px; line-height: 30px;">' +
                    f + '</p><a class="close-invite" style="display:block; position: absolute; height: 16px; width: 16px; right: 10px; top: 7px; background: url(/webincludes/css/images/icons_16x16.gif) -16px -384px;"></a></div>');
            GS.getGuts().forceLogEvent("goToJawharpVisible", {});
            GS.getGuts().gaTrackEvent("site", "goToJawharpVisible");
            $(document).on("click", "#gotojh", function () {
                GS.getGuts().forceLogEvent("goToJawharp", {});
                GS.getGuts().gaTrackEvent("site", "goToJawharp");
                $.cookie("jpreview", "yes", {domain:".grooveshark.com",
                    expires:60});
                setTimeout(function () {
                    window.location.reload(true)
                }, 100)
            });
            $(document).on("click", "#jh-invite .close-invite", function () {
                GS.getGuts().forceLogEvent("goToJawharpCloseInvite", {});
                GS.getGuts().gaTrackEvent("site", "goToJawharpCloseInvite");
                $.cookie("jpreview", "1:no", {domain:".grooveshark.com", expires:60});
                $("#jh-invite").remove();
                GS.resize()
            })
        }
    }
}, update:function () {
    this.user = GS.user;
    this.isDesktop = GS.airbridge ? GS.airbridge.isDesktop : false;
    var c = $("#dropdown_loginForm");
    c.detach();
    $("#header_userOptions").html(this.view(GS.user.isLoggedIn ?
            "loggedIn" : "loggedOut"));
    $("#header_mainNavigation").html(this.view("mainNavigation"));
    if (GS.user.isLoggedIn) {
        $("#loginFormHolder").append(c);
        GS.user.getNotifications(this.callback("updateNotifications"))
    } else $("#putLoginFormHere").append(c);
    this.updateSection(GS.page.activePageName, GS.page.activePageIdentifier);
    this.updateNavButtons()
}, updateNotifications:function () {
    if (this.user === GS.user)if (GS.user.notificationsFeed.events && GS.user.notificationsFeed.events.length) {
        $("#header_notification").addClass("active");
        $("#header_notifications_list").html(this.view("notifications"));
        var c = GS.user.getLastSeenNotification();
        c = GS.user.notificationsFeed.getEvents(c);
        if (c.length) {
            $("#header_notification_pill").addClass("block");
            $("#header_notification_count").text(Math.min(c.length, 99))
        }
    } else {
        $("#header_notification").removeClass("active");
        $("#header_notification_count").text("")
    }
}, updateSection:function (c) {
    switch (c) {
        case "HomeController":
        case "SearchController":
            c = $("#header_search_btn");
            c.hasClass("active") || c.addClass("active").siblings().removeClass("active");
            break;
        case "MusicController":
            $("#header_explore_btn").addClass("active").siblings().removeClass("active");
            break;
        case "UserMusicController":
            GS.page.activePageIdentifier == GS.user.UserID ? $("#header_music_btn").addClass("active").siblings().removeClass("active") : $("#header_mainNavigation a").removeClass("active");
            break;
        case "UserController":
            GS.page.activePageIdentifier == GS.user.UserID && GS.page.activePageParams.section == "community" ? $("#header_community_btn").addClass("active").siblings().removeClass("active") :
                    $("#header_mainNavigation a").removeClass("active");
            break;
        default:
            $("#header_mainNavigation a").removeClass("active")
    }
}, updateFeedCount:function () {
    this.user = GS.user;
    this.isDesktop = GS.airbridge ? GS.airbridge.isDesktop : false;
    $("#header_mainNavigation").html(this.view("mainNavigation"));
    this.updateSection(GS.page.activePageName, GS.page.activePageIdentifier);
    this.updateNavButtons()
}, updateNavButtons:function () {
    if (GS.router && GS.airbridge.isDesktop) {
        $("#header_back_btn").attr("disabled", !GS.router.hasBack);
        $("#header_forward_btn").attr("disabled", !GS.router.hasForward)
    }
}, "#grooveshark click":function () {
    if ($("#page").is(".gs_page_home")) {
        $("input.search.autocomplete", "#page").focus();
        $("#searchBar_input input").val() == "" && $("#searchBar_input span").show()
    } else setTimeout(function () {
        $("input.search.autocomplete", "#page").blur()
    }, 0)
}, "#header_mainNavigation a click":function (c) {
    c = $(c).attr("href");
    GS.getGuts().logEvent("headerNavigationClick", {link:c})
}, "#header_search_btn mousedown":function () {
    if ($("#page").is(".gs_page_home")) {
        $("input.search.autocomplete",
                "#page").focus();
        $("#searchBar_input input").val() == "" && $("#searchBar_input span").show().addClass("faded");
        $("#searchBar_input input").addClass("focused")
    } else var c = $.subscribe("gs.page.home.view", function () {
        setTimeout(function () {
            $("input.search.autocomplete", "#page").focus()
        }, 0);
        $("#searchBar_input span").show();
        $.unsubscribe(c)
    })
}, "#header_forward_btn click":function () {
    GS.router.forward()
}, "#header_back_btn click":function () {
    GS.router.back()
}, "#header_login click":function (c) {
    $(c).toggleClass("active");
    $("#dropdown_loginForm_box").toggle();
    if ($("#dropdown_loginForm_box").is(":visible")) {
        $("#dropdown_loginForm_box").find("input:first").focus();
        this.element.find(".error").hide();
        $("div.capital iframe").hide().parent().hide()
    } else {
        $("#dropdown_loginForm").find("input").blur().val("");
        $("div.capital iframe").show().parent().show()
    }
    var a = this;
    $("body").click(function (b) {
        if (!$(b.target).parents("#dropdown_loginForm_box").length && !$(b.target).parents("#header_loginOption").length) {
            a.closeLoginDropdown();
            $("div.capital iframe").show().parent().show()
        }
    })
}, "#loginReplace click":function (c, a) {
    $("#header_login").trigger("click");
    a.preventDefault()
}, closeLoginDropdown:function () {
    $("#dropdown_loginForm_box").hide();
    $("#dropdown_loginForm").find("input").blur().val("");
    $("#header_login").removeClass("active")
}, "#headerSignup click":function () {
    var c = GS.getGuts();
    c.currentTest && c.currentTest.name == "signupDropdown" ? c.logEvent("loginDropdownSignupClick", 2) : c.logEvent("loginDropdownSignupClick", 1);
    this.closeLoginDropdown()
},
    "#header_search click":function (c, a) {
        $(a.target).is("a") || $(c).find("input.search").focus()
    }, "#header_search .placeholder click":function () {
        $("#header_search input").focus()
    }, "#header_search .remove click":function () {
        $("#header_search input").val("").focus();
        $("#header_search .remove").addClass("hide")
    }, "#header_search focus":function (c) {
        $headerSearchInput = $(c).find("input.search");
        $headerSearchInput.val($headerSearchInput.val());
        $("#header_search").addClass("active");
        $("#header_search .placeholder").hide();
        this.pageSearchHasFocus = true;
        GS.getGuts().logEvent("headerSearchFocused")
    }, "#header_search blur":function () {
        var c = $("#header_search input");
        $("#header_search").removeClass("active");
        this.pageSearchHasFocus = false;
        setTimeout(function () {
            $("#page_search_results").hide()
        }, 200);
        c.val() == "" && $("#header_search .placeholder").show()
    }, "#header_search input keydown":function (c, a) {
        var b = $("#page_search_results li.selected");
        switch (a.which) {
            case _.keys.ENTER:
                c.parents("form").submit();
                return;
            case _.keys.ESC:
                b =
                        $("#page_search_results");
                if (b.is(":visible")) {
                    b.hide();
                    $.publish("gs.menu.hide")
                } else {
                    c.siblings("a.remove").addClass("hide");
                    c.val("");
                    this.inpageSearch(c)
                }
                return;
            case _.keys.UP:
                b.is(":first-child") ? $("#page_search_results li:last").addClass("selected") : b.prev().addClass("selected");
                b.removeClass("selected");
                return;
            case _.keys.DOWN:
                b.is(":last-child") ? $("#page_search_results li:first").addClass("selected") : b.next().addClass("selected");
                b.removeClass("selected");
                return
        }
        $("#header_search a.remove").toggleClass("hide",
                !c.val().length);
        this.inpageSearch(c)
    }, ".search-item a click":function (c) {
        $("#page_search_results li.selected").removeClass("selected");
        $(c).parent().addClass("selected");
        $(c).is(".search-item") && c.closest("input").val($(c).text());
        c.submit()
    }, searchTimeout:false, searchTimeoutWait:100, inpageSearch:function (c) {
        if (!(GS.getGuts().currentTest && GS.getGuts().currentTest.name == "autocomplete")) {
            this.searchTimeout && clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(this.callback(function () {
                if (this.element) {
                    var a =
                            $.trim(c.val().toLowerCase());
                    if (a.length > 0)GS.service.getAutocomplete(a, "artist", this.callback("autocompleteSuccess"), this.callback("autocompleteFail")); else {
                        $("#page_search_results").hide();
                        $.publish("gs.menu.hide")
                    }
                }
            }), this.searchTimeoutWait)
        }
    }, autocompleteSuccess:function (c) {
        this.autocompleteResults = c;
        $("#page_search_results").html(this.view("/shared/pageSearchResults"));
        if (this.pageSearchHasFocus && c && c.length) {
            $("#page_search_results").show();
            $.publish("gs.menu.show")
        } else if (c && !c.length) {
            $("#page_search_results").hide();
            $.publish("gs.menu.hide")
        }
    }, autocompleteFail:function () {
        $("#page_search_results").remove(".search_result").hide();
        $.publish("gs.menu.hide")
    }, "#header_search submit":function (c, a) {
        a.preventDefault();
        GS.getGuts().logEvent("headerSearchSubmit");
        GS.search = _.orEqual(GS.search, {});
        GS.search.type = $(c).attr("data-search-type") || "";
        var b = $("#page_search_results li.selected");
        if (b.is(".search-item-result")) {
            GS.router.setHash("/artist/~/" + b.children("a.search-item").attr("data-artist-id"));
            $("#page_search_results").addClass("hide");
            $("input[name=q]", c).val("").blur()
        } else {
            GS.search.query = $("input[name=q]", c).val();
            if (GS.search.query && GS.search.query.length) {
                $("input[name=q]", c).val("").blur();
                $("#header_search a.remove").addClass("hide");
                GS.router.performSearch(GS.search.type, GS.search.query)
            }
            return false
        }
    }, showAccountOptions:function () {
        var c = [];
        if (GS.user.UserID > 0)c = [
            {title:$.localize.getString("PROFILE"), action:{type:"gourl", url:GS.user.toUrl("")}},
            {title:$.localize.getString("COLLECTION"), action:{type:"gourl", url:GS.user.toUrl("music")}},
            {title:$.localize.getString("FAVORITES"), action:{type:"gourl", url:GS.user.toUrl("music/favorites")}},
            {title:$.localize.getString("PLAYLISTS"), action:{type:"gourl", url:GS.user.toUrl("music/playlists")}},
            {customClass:"separator"}
        ];
        if (GS.user.isLoggedIn) {
            var a = [
                {title:$.localize.getString("HOME_SUPPORT"), action:{type:"gourl", target:"_blank", url:"http://help.grooveshark.com"}}
            ];
            if (GS.user.subscription.canDirectEmail())a = a.concat([
                {title:$.localize.getString("FEEDBACK"), action:{type:"fn", callback:function () {
                    GS.getLightbox().open("feedback")
                }}}
            ])
        }
        c =
                c.concat([
                    {title:$.localize.getString("LANGUAGE"), action:{type:"fn", callback:function () {
                        GS.getLightbox().open("locale")
                    }}},
                    {title:$.localize.getString("SETTINGS"), action:{type:"gourl", url:"/#!/settings"}},
                    {title:$.localize.getString("SURVEYS"), action:{type:"gourl", url:"/#!/surveys"}},
                    {title:$.localize.getString("HOME_FEATURES"), action:{type:"gourl", url:"/#!/features"}}
                ]);
        if (GS.user.isLoggedIn) {
            c.push({title:$.localize.getString("HOME_HELP"), type:"sub", src:a});
            c.push({title:$.localize.getString("INVITE_FRIENDS"),
                action:{type:"fn", callback:function () {
                    GS.getLightbox().open("invite")
                }}})
        } else c.push({title:$.localize.getString("HOME_SUPPORT"), action:{type:"gourl", target:"_blank", url:"http://help.grooveshark.com"}});
        c.push({customClass:"separator"});
        GS.user.UserID > 0 ? c.push({title:$.localize.getString("LOGOUT"), action:{type:"fn", callback:function () {
            GS.auth.logout()
        }}}) : c.push({title:$.localize.getString("SIGNUP"), action:{type:"gourl", url:"/#/signup"}});
        return c
    }, accountMenuTimer:null, "#header_account_group mouseenter":function (c, a) {
        this.closeLoginDropdown();
        this.openAccountDropDown(c, a)
    }, "#header_account_group click":function (c, a) {
        this.closeLoginDropdown();
        this.openAccountDropDown(c, a)
    }, "#header_account_group a click":function () {
        if (GS.user.UserID > 0)location = GS.user.toUrl("")
    }, openAccountDropDown:function (c, a) {
        this.accountMenuTimer && clearTimeout(this.accountMenuTimer);
        this.accountMenu = $(c).jjmenu(a, this.showAccountOptions(), null, {xposition:"right", yposition:"bottom", show:"default", spill:"left", keepState:c, className:"accountDropDown",
            append:$(this.element), shouldLog:true})
    }, ".accountDropDown mouseenter":function () {
        this.accountMenuTimer && clearTimeout(this.accountMenuTimer)
    }, "#header_account_group,.accountDropDown mouseleave":function () {
        this.accountMenuTimer && clearTimeout(this.accountMenuTimer);
        this.accountMenuTimer = setTimeout(this.callback("closeAccountDropDown"), 200)
    }, closeAccountDropDown:function () {
        $(document).trigger("contextmenu")
    }, "#header_notification.active click":function (c) {
        if ($(c).hasClass("active-context"))this.closeNotificationsDropdown();
        else {
            $(c).addClass("active-context");
            $("#header_notification_pill").removeClass("block");
            $("#header_notification_count").text("");
            GS.user && GS.user.UserID > 0 && GS.user.setLastSeenNotification()
        }
        var a = this;
        $("body").click(function (b) {
            $(b.target).parents("#header_notification").length || a.closeNotificationsDropdown()
        })
    }, "#dropdown_notification_box a click":function () {
        setTimeout(this.callback("closeNotificationsDropdown"), 100)
    }, closeNotificationsDropdown:function () {
        $("#header_notification").removeClass("active-context")
    },
    "input focus":function (c) {
        $(c).parent().parent().addClass("active")
    }, "textarea focus":function (c) {
        $(c).parent().parent().parent().addClass("active")
    }, "input blur":function (c) {
        $(c).parent().parent().removeClass("active")
    }, "textarea blur":function (c) {
        $(c).parent().parent().parent().removeClass("active")
    }, showError:function (c) {
        $("div.message", this.element).html($.localize.getString(c));
        this.element.find(".error").show()
    }, showMessage:function (c) {
        $("div.message", this.element).html(c);
        this.element.find(".error").show()
    },
    "form#dropdown_loginForm submit":function (c) {
        this.element.find(".error").hide();
        var a = $("input[name=username]", c).val(), b = $("input[name=password]", c).val();
        c = $("input[name=save]", c).val() ? 1 : 0;
        switch (a.toLowerCase()) {
            case "dbg:googlelogin":
                GS.getGoogle().lastError ? this.showMessage("Last Google Login Error: " + JSON.stringify(GS.getGoogle().lastError)) : this.showMessage("There does not appear to be any errors with Google Login");
                break;
            case "dbg:facebooklogin":
                GS.getFacebook().lastError ? this.showMessage("Last Facebook Login Error: " +
                        JSON.stringify(GS.getFacebook().lastError)) : this.showMessage("There does not appear to be any errors with Facebook Login");
                break;
            default:
                GS.auth.login(a, b, c, this.callback(this.loginSuccess), this.callback(this.loginFailed));
                break
        }
    }, "button.facebookLogin click":function () {
        GS.auth.loginViaFacebook(null, this.callback(this.extLoginFailed));
        this.closeLoginDropdown()
    }, "button.googleLogin click":function () {
        GS.auth.loginViaGoogle(null, this.callback(this.extLoginFailed));
        this.closeLoginDropdown()
    }, "button.twitterLogin click":function () {
        GS.auth.loginViaTwitter(null,
                this.callback(this.extLoginFailed));
        this.closeLoginDropdown()
    }, loginSuccess:function () {
        this.closeLoginDropdown()
    }, loginFailed:function (c) {
        if (c.error)this.showError(c.error); else c && c.userID == 0 ? this.showError("POPUP_SIGNUP_LOGIN_FORM_AUTH_ERROR") : this.showError("POPUP_SIGNUP_LOGIN_FORM_GENERAL_ERROR")
    }, extLoginFailed:function (c) {
        var a = {error:"POPUP_SIGNUP_LOGIN_FORM_GENERAL_ERROR", premiumRequired:gsConfig.isPreview, notCloseable:gsConfig.isPreview};
        if (c.error)a.error = c.error; else if (c && c.authType ==
                "facebook")a.error = "POPUP_SIGNUP_LOGIN_FORM_FACEBOOK_ERROR"; else if (c && c.authType == "google")a.error = "POPUP_SIGNUP_LOGIN_FORM_GOOGLE_ERROR"; else if (c && c.authType == "twitter")a.error = "POPUP_SIGNUP_LOGIN_FORM_TWITTER_ERROR";
        GS.getLightbox().open("login", a)
    }, "a.loginLink click":function () {
        $("#dropdown_loginForm_box").hide();
        $("#dropdown_loginForm_box").find("input").blur();
        $("#header_login").removeClass("active")
    }, "a.forget click":function () {
        GS.getLightbox().open("forget")
    }, ".songLink click":function (c, a) {
        a.preventDefault();
        var b = parseInt($(c).attr("data-songid"), 10);
        b && GS.Models.Song.getSong(b, function (d) {
            d && GS.router.setHash(d.toUrl())
        })
    }});

