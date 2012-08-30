GS.Controllers.BaseController.extend("GS.Controllers.InviteInterface", {onDocument:false}, {userInfo:{}, googleContacts:null, facebookFriends:[], fbIDs:{}, slickbox:false, peopleError:null, people:null, onFollowersSuccess:function (c) {
    var a = [];
    $.each(c, this.callback(function (b, d) {
        a.push([d.Email, d.Name + " " + d.Email, d.Name, d.Name]);
        this.userInfo[d.UserID] = d;
        this.userInfo[d.Email] = d
    }));
    c = new $.TextboxList("#emails", {addOnBlur:true, bitsOptions:{editable:{growing:true, growingOptions:{maxWidth:$("#emails").innerWidth() - 10}}},
        plugins:{autocomplete:{placeholder:$.localize.getString("SHARE_EMAIL_PLACEHOLDER")}}, encode:this.callback(function (b) {
            for (var d = [], f = 0; f < b.length; f++)if (b[f][0])this.userInfo[b[f][0]] ? d.push(this.userInfo[b[f][0]].Email) : d.push(b[f][0]); else if (b[f][1])this.userInfo[b[f][1]] ? d.push(this.userInfo[b[f][1]].Email) : d.push(b[f][1]);
            return d.join(",")
        })});
    c.plugins.autocomplete.setValues(a);
    c.addEvent("bitAdd", this.callback(function (b) {
        b.getValue()[1] === "" && b.hide();
        if (this.userInfo[b.getValue()[1]] && _.notDefined(b.getValue()[0])) {
            var d =
                    this.userInfo[b.getValue()[1]];
            b.setValue([d.Email, d.Name + " " + d.Email, d.Name, d.Name]);
            b.show()
        }
    }));
    $("#services_content input.textboxlist-bit-editable-input").focus()
}, extractInviteEmails:function (c) {
    var a, b = [], d, f = $.trim(c).split(",");
    for (c = 0; c < f.length; c++) {
        d = $.trim(f[c]).split(" ");
        for (a = 0; a < d.length; a++) {
            d[a] = $.trim(d[a]);
            d[a] && b.push(d[a])
        }
    }
    return b
}, onFollowersFailed:function (c) {
    console.warn("failed grabbing contact info for followers", autocompleteTerms, c);
    $.publish("gs.notification", {type:"error",
        message:$.localize.getString("POPUP_FAIL_FANS_EMAIL_ONLY")})
}, onFacebookFriends:function (c) {
    this.facebookFriends = c || [];
    var a = [];
    $.each(this.facebookFriends, this.callback(function (b, d) {
        a.push([d.id, d.name, d.name])
    }));
    this.facebookLoaded = true;
    if (a.length > 0)this.friendsLoaded = true;
    if ($("a.facebook_service", "#invite_options").hasClass("active")) {
        $("#lightbox_pane", this.element).html(this.view("/lightbox/invite/facebook"));
        GS.getLightbox().positionLightbox();
        if (a.length > 0) {
            c = new $.TextboxList("#facebook_invite_list",
                    {addOnBlur:true, bitsOptions:{editable:{growing:true, growingOptions:{maxWidth:$("#facebook_invite_list").innerWidth() - 10}}}, plugins:{autocomplete:{placeholder:$.localize.getString("SHARE_FACEBOOK_PLACEHOLDER")}}, encode:this.callback(function (b) {
                        var d = [];
                        if (b.length) {
                            for (var f = 0; f < b.length; f++)b[f][0] && d.push(b[f][0]);
                            this.element.find(".submit span").attr("data-translate-text", "SHARE_FACEBOOK_FRIENDS").html($.localize.getString("SHARE_FACEBOOK_FRIENDS"))
                        } else this.element.find(".submit span").attr("data-translate-text",
                                "SHARE_FACEBOOK_WALL").html($.localize.getString("SHARE_FACEBOOK_WALL"));
                        return d.join(",")
                    })});
            c.plugins.autocomplete.setValues(a);
            c.addEvent("bitAdd", this.callback(function (b) {
                this.element.find(".error").hide();
                if (b.getValue()[1] === "")b.hide(); else {
                    var d = $("#facebook_invite_list").val().split(",");
                    if (d) {
                        var f = d.indexOf(b.getValue()[0]);
                        b.getValue()[0] && f >= 0 && f != d.length - 1 && b.hide();
                        if (b.getValue()[0])GS.getFacebook().canPostToFriend(b.getValue()[0], this.callback(function (g) {
                            if (!g) {
                                g = b.getValue()[1];
                                var k = $.localize.getString("POPUP_SHARE_ERROR_FACEBOOK_CANTPOST");
                                k = k.replace("{name}", g);
                                this.element.find(".error").show().find(".message").html(k);
                                b.remove();
                                if (d.length == 1) {
                                    this.submitKey = "SHARE_FACEBOOK_WALL";
                                    this.element.find(".submit span").html($.localize.getString(this.submitKey))
                                }
                                GS.getLightbox().positionLightbox()
                            }
                        })); else {
                            b.remove();
                            if (d.length == 1) {
                                this.submitKey = "SHARE_FACEBOOK_WALL";
                                this.element.find(".submit span").html($.localize.getString(this.submitKey))
                            }
                        }
                    }
                }
            }));
            $("#services_content input.textboxlist-bit-editable-input").focus()
        }
    }
},
    formSubmit:function () {
        var c = this, a = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        this.peopleError = [];
        this.people = [];
        switch (this.submitType) {
            case "email":
                var b;
                b = $.trim($("textarea[name=emails]", this.element).val());
                var d = $("div.textboxlist", this.element).find(".textboxlist-bit").not(".textboxlist-bit-box-deletable").filter(":last").text();
                if (b !== "") {
                    b = this.extractInviteEmails(b);
                    _.forEach(b, function (k) {
                        k.match(a) ? c.people.push(k) : c.peopleError.push(k)
                    })
                }
                if (d) {
                    d = this.extractInviteEmails(d);
                    for (b = 0; b <
                            d.length; b++)d[b].match(a) ? this.people.push(d[b]) : this.peopleError.push(d[b])
                }
                if (this.people.length)GS.service.sendInvites(this.people, this.callback("sendInviteSuccess"), this.callback("sendInviteFailed")); else this.peopleError.length && this.invalidInviteEmail();
                break;
            case "googleLogin":
                d = $("input[name=google_username]", this.element).val();
                b = $("input[name=google_password]", this.element).val();
                GS.service.getGoogleAuthToken(d, b, this.callback("googAuthSuccess"), this.callback("googAuthFailed"));
                break;
            case "googleContacts":
                var f =
                        [];
                $(".contactsContainer input:checked", this.element).each(function () {
                    f.push(this.value)
                });
                f.length && GS.service.sendInvites(f, this.callback("sendInviteSuccess"), this.callback("sendInviteFailed"));
                break;
            case "facebook":
                d = $("#facebook_invite_list").val() ? $("#facebook_invite_list").val().split(",") : [];
                var g = _.orEqual($("textarea[name=facebookMessage]", this.element).val(), "");
                if (d.length > 0) {
                    GS.getFacebook().lastError = false;
                    _.forEach(d, this.callback(function (k) {
                        GS.getFacebook().lastError || GS.getFacebook().postToFeed(k,
                                "http://grooveshark.com/", g, "link", "invite", null, this.callback("facebookFailed"))
                    }));
                    if (!GS.getFacebook().lastError) {
                        d.length > 1 ? $.publish("gs.facebook.notification.sent", {params:{type:"invites", hideUndo:true}, data:{}, notifData:{}}) : $.publish("gs.facebook.notification.sent", {params:{type:"invite", hideUndo:true}, data:{}, notifData:{}});
                        this.facebookSuccess()
                    }
                } else if (GS.getFacebook().connected && window.FB && FB.getAccessToken())g != "" ? GS.getFacebook().postToFeed("me", "http://grooveshark.com/", g, "link", "invite",
                        this.callback("facebookSuccess"), this.callback("facebookFailed")) : GS.getFacebook().postLink("me", "http://grooveshark.com/", g, "link", "invite", this.callback("facebookSuccess"), this.callback("facebookFailed")); else if (GS.getFacebook().facebookLoaded && GS.getFacebook().connected)this.facebookFailed(); else {
                    window.open("http://www.facebook.com/sharer.php?u=http://grooveshark.com&t=Grooveshark&ref=invite");
                    this.facebookSuccessCallback()
                }
                break;
            case "twitter":
                d = $("textarea[name=twitterMessage]", this.element).val();
                if (GS.getTwitter().connected)GS.getTwitter().postTweet(d, "invite", this.callback("twitterSuccess"), this.callback("twitterFailed")); else {
                    d = d.replace(" " + this.tinysong.tinySongURL, "");
                    window.open("http://twitter.com/share?related=grooveshark&via=grooveshark&url=" + encodeURIComponent(this.tinysong.tinySongURL) + "&text=" + encodeURIComponent(d), "_blank");
                    GS.getLightbox().close()
                }
                break
        }
        return false
    }, sendInviteSuccess:function (c) {
        var a = [], b = [], d = [], f = [], g = "";
        if (c)for (var k in c)switch (c[k].status) {
            case "error":
                c[k].errorCode ==
                        -3 ? f.push(k) : a.push(k);
                break;
            case "followed":
                b.push(_.cleanText(c[k].FName));
                break;
            case "invited":
                d.push(k);
                break
        }
        if (b.length) {
            g = (new GS.Models.DataString($.localize.getString("POPUP_INVITE_FORM_RESPONSE_FOLLOWING"), {list:b.join(", ")})).render();
            $.publish("gs.notification", {type:"info", message:g})
        }
        if (d.length) {
            g = d.length > 5 ? (new GS.Models.DataString($.localize.getString("POPUP_INVITE_FORM_RESPONSE_INVITED_SUM"), {sum:String(d.length)})).render() : (new GS.Models.DataString($.localize.getString("POPUP_INVITE_FORM_RESPONSE_INVITED_LIST"),
                    {list:d.join(", ")})).render();
            $.publish("gs.notification", {type:"info", message:g})
        }
        if (f.length) {
            g = (new GS.Models.DataString($.localize.getString("POPUP_INVITE_FORM_RESPONSE_ALREADY_SENT"), {list:f.join(", ")})).render();
            $.publish("gs.notification", {type:"info", message:g})
        }
        if (a.length) {
            g = (new GS.Models.DataString($.localize.getString("POPUP_INVITE_FORM_RESPONSE_ERROR"), {list:a.join(", ")})).render();
            $.publish("gs.notification", {type:"error", message:g})
        }
        if (this.peopleError.length)this.invalidInviteEmail();
        else if (a.length + b.length + d.length + f.length == 0) {
            this.element.find(".message").attr("data-translate-text", "POPUP_INVITE_FORM_RESPONSE_UNKNOWN_ERROR").html($.localize.getString("POPUP_INVITE_FORM_RESPONSE_UNKNOWN_ERROR"));
            this.element.find(".error").show()
        } else this.sendInviteSuccessCallback()
    }, sendInviteFailed:function (c) {
        console.warn("invite failed", c);
        this.element.find(".message").attr("data-translate-text", "POPUP_INVITE_FORM_RESPONSE_UNKNOWN_ERROR").html($.localize.getString("POPUP_INVITE_FORM_RESPONSE_UNKNOWN_ERROR"));
        this.element.find(".error").show()
    }, invalidInviteEmail:function () {
        console.warn("invalid invite email");
        var c = $("div.textboxlist", this.element).find(".textboxlist-bit").not(".textboxlist-bit-box-deletable").filter(":last").text();
        c && this.people.indexOf(c) >= 0 && $("div.textboxlist", this.element).find(".textboxlist-bit").not(".textboxlist-bit-box-deletable").remove();
        _.forEach(this.people, function (a) {
            $("li.textboxlist-bit:contains('" + a + "')").remove()
        });
        this.element.find(".message").attr("data-translate-text",
                "POPUP_INVITE_FORM_RESPONSE_INVALID_EMAIL_ERROR").html($.localize.getString("POPUP_INVITE_FORM_RESPONSE_INVALID_EMAIL_ERROR"));
        this.element.find(".error").show()
    }, googAuthSuccess:function (c) {
        switch (parseInt(c.result.statusCode)) {
            case 1:
                c = String(c.result.rawResponse);
                c = c.substr(c.indexOf("Auth=") + 5);
                GS.service.getGoogleContacts(c, this.callback("googContactsSuccess"), this.callback("googContactsFailed"));
                break;
            case 2:
                this.element.find(".message").attr("data-translate-text", "POPUP_INVITE_GOOGAUTH_RESPONSE_AUTH_ERROR").html($.localize.getString("POPUP_INVITE_GOOGAUTH_RESPONSE_AUTH_ERROR"));
                this.element.find(".error").show();
                break;
            default:
                this.element.find(".message").attr("data-translate-text", "POPUP_INVITE_GOOGAUTH_RESPONSE_UNKNOWN_ERROR").html($.localize.getString("POPUP_INVITE_GOOGAUTH_RESPONSE_UNKNOWN_ERROR"));
                this.element.find(".error").show();
                break
        }
    }, googAuthFailed:function () {
        this.element.find(".message").attr("data-translate-text", "POPUP_INVITE_GOOGAUTH_RESPONSE_UNKNOWN_ERROR").html($.localize.getString("POPUP_INVITE_GOOGAUTH_RESPONSE_UNKNOWN_ERROR"));
        this.element.find(".error").show()
    },
    googContactsSuccess:function (c) {
        switch (parseInt(c.result.statusCode, 10)) {
            case 1:
                this.googleContacts = c.result.parsedResult;
                this.showOnlyNamedContacts = true;
                this.googContactsSuccessCallback();
                break;
            case 2:
                this.element.find(".message").attr("data-translate-text", "POPUP_INVITE_GOOGAUTH_RESPONSE_AUTH_ERROR").html($.localize.getString("POPUP_INVITE_GOOGAUTH_RESPONSE_AUTH_ERROR"));
                this.element.find(".error").show();
                break;
            default:
                this.element.find(".message").attr("data-translate-text", "POPUP_INVITE_GOOGAUTH_RESPONSE_UNKNOWN_ERROR").html($.localize.getString("POPUP_INVITE_GOOGAUTH_RESPONSE_UNKNOWN_ERROR"));
                this.element.find(".error").show();
                break
        }
    }, googContactsFailed:function (c) {
        console.warn("goog contacts failed", c);
        this.element.find(".message").attr("data-translate-text", "POPUP_INVITE_GOOGAUTH_RESPONSE_UNKNOWN_ERROR").html($.localize.getString("POPUP_INVITE_GOOGAUTH_RESPONSE_UNKNOWN_ERROR"));
        this.element.find(".error").show()
    }, facebookSuccess:function () {
        this.facebookSuccessCallback()
    }, facebookFailed:function () {
        this.element.find(".message").attr("data-translate-text", "POPUP_SHARE_FACEBOOK_ERROR").html($.localize.getString("POPUP_SHARE_FACEBOOK_ERROR"));
        this.element.find(".error").show()
    }, twitterSuccess:function () {
        this.twitterSuccessCallback()
    }, twitterFailed:function () {
        this.element.find(".message").attr("data-translate-text", "POPUP_SHARE_TWITTER_ERROR").html($.localize.getString("POPUP_SHARE_TWITTER_ERROR"));
        this.element.find(".error").show()
    }, "input keydown":function (c, a) {
        a.keyCode && a.keyCode == 13 && c.is("[name*=google]") && this.formSubmit()
    }, "input.googleContact click":function (c) {
        $(c).is(":checked") ? $(c).closest("li.contact").addClass("selected") :
                $(c).closest("li.contact").removeClass("selected")
    }, "button.uncheckAll click":function () {
        if (this.submitType == "facebook")this.facebookClearSelected(); else this.submitType == "googleContacts" && $(".google_contacts input", this.element).attr("checked", false)
    }, "button.checkAll click":function () {
        if (this.submitType == "facebook") {
            this.element.find(".submit span").attr("data-translate-text", "SEND_INVITE").html($.localize.getString("SEND_INVITE"));
            _.forEach(this.facebookFriends, function (c, a) {
                this.facebookFriends[a].selected =
                        true;
                this.fbIDs[c.id] = c.id
            }, this);
            this.slickbox.setItems(this.facebookFriends)
        } else this.submitType == "googleContacts" && $(".google_contacts input", this.element).attr("checked", true)
    }, updateFacebookForm:function () {
        $("#settings_facebook_form").html(this.view("/shared/inviteFacebook"));
        $("#settings_facebook_form .error").addClass("hide");
        $(window).resize()
    }, updateFacebookFormWithError:function (c) {
        if (typeof c == "object" && c.error)c = c.error;
        $("#settings_facebook_form .error").html($.localize.getString(c));
        $("#settings_facebook_form .error").removeClass("hide");
        $(window).resize()
    }, "#fbConnect-btn.fbConnect click":function () {
        var c = GS.getFacebook().flags;
        GS.getFacebook().logout(this.callback(function () {
            GS.getFacebook().login(null, this.callback(function (a) {
                a && a.error ? this.element.find(".error").show().find(".message").html($.localize.getString(a.error)) : this.element.find(".error").show().find(".message").html($.localize.getString("FACEBOOK_PROBLEM_CONNECTING_ERROR_MSG"));
                GS.getLightbox().positionLightbox()
            }),
                    c)
        }))
    }, "#fbConnect-btn.fbLogin click":function () {
        GS.getFacebook().login(null, this.callback(function (c) {
            c && c.error ? this.element.find(".error").show().find(".message").html($.localize.getString(c.error)) : this.element.find(".error").show().find(".message").html($.localize.getString("FACEBOOK_PROBLEM_CONNECTING_ERROR_MSG"));
            GS.getLightbox().positionLightbox()
        }))
    }, "#lightbox .error .message .resetPerms click":function (c, a) {
        a.preventDefault();
        var b = GS.getFacebook().flags;
        GS.getFacebook().logout(function () {
            GS.getFacebook().login(function () {
                        $("#lightbox").find(".error").hide()
                    },
                    this.callback(function () {
                        error && error.error ? this.element.find(".error").show().find(".message").html($.localize.getString(error.error)) : this.element.find(".error").show().find(".message").html($.localize.getString("FACEBOOK_PROBLEM_CONNECTING_ERROR_MSG"));
                        GS.getLightbox().positionLightbox()
                    }), b)
        })
    }, "#fbInvalid a.fbConnect click":function () {
        var c = GS.getFacebook().flags;
        GS.getFacebook().logout(this.callback(function () {
            GS.getFacebook().login(null, this.callback(function (a) {
                a && a.error ? this.element.find(".error").show().find(".message").html($.localize.getString(a.error)) :
                        this.element.find(".error").show().find(".message").html($.localize.getString("FACEBOOK_PROBLEM_CONNECTING_ERROR_MSG"));
                GS.getLightbox().positionLightbox()
            }), c)
        }))
    }, "#fbConnect-btn.fbChange click":function () {
        GS.getFacebook().serviceLogout(this.callback(function () {
            GS.getFacebook().login(null, this.callback(function (c) {
                c && c.error ? this.element.find(".error").show().find(".message").html($.localize.getString(c.error)) : this.element.find(".error").show().find(".message").html($.localize.getString("FACEBOOK_PROBLEM_CONNECTING_ERROR_MSG"));
                GS.getLightbox().positionLightbox()
            }))
        }))
    }, "#lightbox .error .changeFBLogin click":function () {
        GS.getFacebook().serviceLogout(this.callback(function () {
            GS.getFacebook().login(null, this.callback(function (c) {
                c && c.error ? this.element.find(".error").show().find(".message").html($.localize.getString(c.error)) : this.element.find(".error").show().find(".message").html($.localize.getString("FACEBOOK_PROBLEM_CONNECTING_ERROR_MSG"));
                GS.getLightbox().positionLightbox()
            }))
        }))
    }});

