GS.Controllers.BaseController.extend("GS.Controllers.LightboxController", {onElement:"#lightbox_wrapper", isGSSingleton:true}, {priorities:{sessionBad:12, SESSION_BAD:12, maintenance:11, DOWN_FOR_MAINTENANCE:11, invalidClient:10, INVALID_CLIENT:10, badHost:8, BAD_HOST:8, interactionTime:7, INTERACTION_TIMER:7, vipRequiredLogin:5, VIP_REQUIRED_LOGIN:5, vipOnlyFeature:3, VIP_ONLY_FEATURE:3, feedback:2, signup:2, SIGNUP:2, vipSignup:1, VIP_SIGNUP:1, visualizer:-1}, notCloseable:function () {
    return!!this.options.notCloseable
},
    queue:[], queuedOptions:{}, curType:null, isOpen:false, priority:0, init:function () {
        this.subscribe("gs.app.resize", this.callback(this.positionLightbox));
        $(document).keydown(this.callback(function (c) {
            c.which == _.keys.ESC && this.isOpen && !this.notCloseable() && this.close()
        }));
        this.currentPriority = NaN;
        this._super()
    }, appReady:function () {
        if (gsConfig.lightboxOnInit) {
            this.open(gsConfig.lightboxOnInit.type, gsConfig.lightboxOnInit.defaults);
            gsConfig.lightboxOnInit = false
        }
    }, positionLightbox:function () {
        var c, a;
        return function () {
            if (this.isOpen &&
                    this.container) {
                a = a || $("#main");
                c = c || $("#lightbox");
                var b = this.container.find("#lightbox_content");
                if (this.curType !== "signup") {
                    b.css({height:"auto"});
                    c.css({width:"auto"})
                }
                var d = Math.max(c.width(), 400), f = Math.min(Math.max(c.height(), 100), $(document.body).height() - 10);
                d = Math.round(a.width() / 2 - d / 2);
                var g = Math.max(5, Math.round(a.height() / 2 - f / 2)), k = b.height(), m = this.element.find("#lightbox_header:visible").outerHeight() + this.element.find("#lightbox_footer:visible").outerHeight(), h = 0;
                b.find(".measure").each(function () {
                    h +=
                            $(this).height()
                });
                f = Math.min(Math.max(150, parseInt(f - m, 10)));
                f < k && !b.hasClass("fixed_content") && b.height(f).find(".lightbox_pane_content").height(b.height() - b.find("#pane_footer").outerHeight() - h);
                $("#lightbox_nav").height($("#lightbox_pane").height());
                this.element.css({top:g, left:d});
                this.queuedOptions[this.curType] && this.queuedOptions[this.curType].showPlayerControls && this.overlay.height($(window).height() - $("#player").height());
                $.publish("lightbox.position")
            }
        }
    }(), getContainer:function (c, a) {
        var b =
                this.element.find("." + c);
        if (b.length === 0) {
            b = $('<div class="lbcontainer"/>').addClass(c);
            c === "generic" && b.addClass(a.type);
            b.appendTo($("#lightbox"))
        }
        return b
    }, open:function (c, a) {
        if (typeof c === "object") {
            a = c;
            c = "generic"
        }
        this.options = a || {};
        var b = this.queue.indexOf(c), d = _.orEqual(this.priorities[c], 0);
        if (this.curType === c)return false;
        this.queuedOptions[c] = a;
        if (!isNaN(this.currentPriority) && d < this.currentPriority)this.queue.indexOf(c) === -1 && this.queue.push(c); else {
            if (this.curType) {
                this.close(false, true);
                this.queue.indexOf(this.curType) === -1 && this.queue.push(this.curType)
            }
            if (!(this.queue.length && b !== -1 && b > -1)) {
                this.curType = c;
                this.currentPriority = d;
                this.isOpen = true;
                this.queue.indexOf(c) === -1 && this.queue.unshift(c);
                var f = this;
                GS.ClassLoader.get(["GS.Controllers.Lightbox.", $.String.classize(c), "Controller"].join("")).then(function () {
                    if (f.curType === c && f.isOpen) {
                        f.overlay = f.overlay || $("#lightbox_overlay");
                        f.overlay.height("100%");
                        f.container = f.getContainer(c, a);
                        f.notCloseable() ? $("#lightbox_close").hide() :
                                $("#lightbox_close").show();
                        $.browser.mozilla && parseInt($.browser.version, 10) < 6 ? $("#theme_home .flash object").each(function (g, k) {
                            k.style.visibility = "hidden"
                        }) : $("#theme_home .flash object").hide();
                        $("div.capital iframe").hide().parent().hide();
                        f.element.add(f.overlay).add(f.container).show();
                        f.container[$.String.underscore("gs_lightbox_" + c)](a);
                        f.positionLightbox();
                        f.container.find(".focusFirst").focus();
                        c === "generic" ? f.trackLightboxView(a.type) : f.trackLightboxView(c)
                    }
                })
            }
        }
    }, close:function (c, a) {
        var b,
                d;
        c = _.orEqual(c, false);
        a = _.orEqual(a, false);
        if (c) {
            d = this.queue.indexOf(c);
            if (d != -1) {
                b = this.queue.splice(d, 1);
                delete this.queuedOptions[c]
            }
            if (c !== this.curType)return
        }
        c || (b = this.queue.shift());
        if (_.defined(b)) {
            (d = this.container.hide().controller()) && d.destroy();
            this.element.find(".lbcontainer." + b).empty()
        }
        if (!a) {
            this.queuedOptions[b] && this.queuedOptions[b].onComplete && this.queuedOptions[b].onComplete();
            this.curType = false;
            this.currentPriority = NaN;
            if (this.queue.length > 0) {
                this.queue = this.sortQueueByPriority(this.queue);
                b = this.queue.shift();
                d = this.queuedOptions[b];
                try {
                    this.open(b, d)
                } catch (f) {
                    console.warn("error opening next lightbox", f);
                    this.curType = false;
                    this.currentPriority = NaN;
                    this.isOpen = false;
                    this.element.add(this.overlay).hide();
                    $.browser.mozilla && parseInt($.browser.version, 10) < 6 ? $("#theme_home .flash object").each(function (g, k) {
                        k.style.visibility = "visible"
                    }) : $("#theme_home .flash object").show()
                }
            } else {
                this.curType = false;
                this.currentPriority = NaN;
                this.isOpen = false;
                this.element.add(this.overlay).hide();
                $.browser.mozilla &&
                        parseInt($.browser.version, 10) < 6 ? $("#theme_home .flash object").each(function (g, k) {
                    k.style.visibility = "visible"
                }) : $("#theme_home .flash object").show()
            }
            $("div.capital iframe").show().parent().show();
            $("#theme_share_header").hide();
            $.publish("gs.lightbox.close")
        }
    }, sortQueueByPriority:function (c) {
        c.sort(this.callback(function (a, b) {
            var d = _.orEqual(this.priorities[a], 0), f = _.orEqual(this.priorities[b], 0);
            return d == f ? 0 : d > f ? 1 : -1
        })).reverse();
        return c
    }, trackLightboxView:function (c) {
        c = "#!/lb/" + c;
        if (window._gaq &&
                window._gaq.push) {
            c = encodeURI(c);
            window._gaq.push(["_trackPageview", c])
        }
    }, ".close click":function () {
        GS.getLightbox().close()
    }, "select focus":function (c) {
        c.parents(".input_wrapper").addClass("active")
    }, "select blur":function (c) {
        c.parents(".input_wrapper").removeClass("active");
        c.change()
    }, "select keydown":function (c) {
        c.change()
    }, "select change":function (c) {
        $(c).prev("span").text($(c).find("option:selected").html())
    }, "input focus":function (c) {
        $(c).parent().parent().addClass("input_wrapper_active")
    },
    "textarea focus":function (c) {
        $(c).parent().parent().parent().addClass("textarea_wrapper_active")
    }, "input blur":function (c) {
        $(c).parent().parent().removeClass("input_wrapper_active")
    }, "textarea blur":function (c) {
        $(c).parent().parent().parent().removeClass("textarea_wrapper_active")
    }});

