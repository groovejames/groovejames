GS.Controllers.PageController.extend("GS.Controllers.Page.HomeController", {}, {init:function (c, a) {
    this.update(a);
    this.subscribe("gs.app.resize", this.callback("resize"));
    this._super()
}, update:function () {
    if (!GS.getLightbox || !GS.getLightbox().isOpen)$("input.search.autocomplete", this.element).focus();
    !GS.user.isLoggedIn || GS.user.subscription.canHideAds() ? $(".home_upgrade").addClass("hide") : $(".home_upgrade").removeClass("hide");
    $.publish("gs.page.home.update")
}, index:function () {
    this._super();
    this.addAutocomplete("home");
    this.resize();
    this.subscribe("gs.app.resize", this.callback("resize"));
    this.subscribe("gs.auth.update", this.callback("update"));
    this.focusSearch();
    GS.Controllers.PageController.title("Listen to Free Music Online - Internet Radio - Free MP3 Streaming", false);
    $.publish("gs.page.home.view");
    GS.resize()
}, focusSearch:function () {
    if (!GS.getLightbox || !GS.getLightbox().isOpen)$("input.search.autocomplete", this.element).focus()
}, resize:function () {
    var c = $("#homeSearch"), a = 500;
    if (c.length) {
        a = Math.max(500, Math.min(400,
                $(this.element).width() - 200));
        c.width(a).css("marginLeft", -Math.round(a / 2))
    }
}, toggleHint:function (c, a) {
    var b = $("#searchBar_hint"), d = $("#searchBar_input input"), f = $("#searchBar_precomplete");
    if (a.type == "mousedown")d.val() === "" && a.button != 2 ? b.show() : b.hide(); else if (a.type == "keyup" || a.type == "keydown") {
        var g = _.orEqual(a.keyCode, a.which), k = String.fromCharCode(g).replace(/[\b]/g, "");
        if (String.fromCharCode(g).replace(/[\s]/g, "").length > 0)d.val() === "" && k.length < 1 ? b.show() : b.hide();
        if (a.type == "keydown") {
            f.hide();
            if (g == _.keys.TAB) {
                a.preventDefault();
                b = f.text();
                b.length && d.val(b)
            }
        }
    } else d.val() === "" ? b.show().removeClass("faded") : b.hide();
    d.val() === "" && f.text("")
}, "#homeSearch submit":function (c, a) {
    if ($("input[name=q]", c).val() === "") {
        a.stopImmediatePropagation();
        return false
    }
    return true
}, "#searchButton click":function () {
    $("#searchBar_input .search").val() ? $("#homeSearch").submit() : $("#searchBar_input span").trigger("click")
}, "#searchBar_input span click":function () {
    this.focusSearch()
}, "#homePage keydown":function () {
    this.focusSearch()
},
    "input.search.autocomplete mousedown":function (c, a) {
        return this.toggleHint(c, a)
    }, "input.search.autocomplete keydown":function (c, a) {
        return this.toggleHint(c, a)
    }, "input.search.autocomplete keyup":function (c, a) {
        return this.toggleHint(c, a)
    }, "input.search.autocomplete focusout":function (c, a) {
        if ($("#searchBar_input input").hasClass("focused")) {
            setTimeout(function () {
                $("input.search.autocomplete", "#page").focus()
            }, 0);
            $("#searchBar_input input").removeClass("focused");
            return true
        } else return this.toggleHint(c,
                a)
    }, "a.about click":function () {
        GS.getLightbox().open("about")
    }, "a.themes click":function () {
        GS.getLightbox().open("themes")
    }, "a.upgrade click":function () {
        GS.getLightbox().open("vipPerks")
    }, "a.station click":function (c, a) {
        a.stopPropagation();
        var b = c.attr("data-tagid");
        GS.player.setAutoplay(true, b);
        return false
    }, notFound:function () {
        this.element.html(this.view("not_found"));
        this.addAutocomplete("home");
        this.resize();
        this.subscribe("gs.app.resize", this.callback("resize"));
        this.subscribe("gs.auth.update",
                this.callback("update"));
        GS.Controllers.PageController.title("Unable To Find What You're Looking For")
    }});

