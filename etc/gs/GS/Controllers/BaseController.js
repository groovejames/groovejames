jQuery.Controller.extend("GS.Controllers.BaseController", {
setup:function () {
    this._super.apply(this, arguments);
    this.preSetup && this.preSetup()
}, init:function () {
    this._super();
    if (this.onWindow && !this.isGSSingleton)new this($(window)); else this.onElement && !this.isGSSingleton && new this($(this.onElement));
    this.shortName !== "BaseController" && GS.ClassLoader.register(this.fullName, this)
}, instance:function () {
    if (this.isGSSingleton)return new this(this.onElement && $(this.onElement) || this.onWindow && window || document.documentElement);
    if (this.onDocument)return $(document.documentElement).controller(this._shortName);
    if (this.onWindow)return $(window).controller(this._shortName);
    if (this.onElement)return $(this.onElement).controller(this._shortName);
    if (this.hasActiveElement)return $(this.hasActiveElement).controller(this._shortName);
    throw"BaseController. controller, " + this._shortName + ", is improperly embedded on page";
}, singletonCallback:function (c, a, b) {
    c = "get" + _.ucwords(c);
    var d = arguments;
    return function () {
        var f = GS[c](), g = jQuery.makeArray(d).slice(2);
        g.push.apply(g, arguments);
        if (!b && f.onUpdateSubscription && !f.loaded) {
            var k;
            k = $.subscribe(f.onUpdateSubscription, f.callback(function () {
                f.loaded = true;
                $.unsubscribe(k);
                f[a].apply(f, g)
            }));
            return null
        }
        return f[a].apply(f, g)
    }
}, viewBundles:{}, bundleVersions:{}}, {init:function () {
    this.subscribe("gs.app.ready", this.callback(this.appReady))
}, appReady:function () {
}, destroy:function () {
    if ($.isArray(this.subscriptions))for (; this.subscriptions.length;)$.unsubscribe(this.subscriptions.pop());
    this._super()
}, subscribe:function (c, a, b) {
    b = _.orEqual(b, true);
    if (!_.defined(this.subscriptions))this.subscriptions = [];
    if (b) {
        c = $.subscribe(c, a);
        this.subscriptions.push(c);
        return c
    } else return $.subscribe(c, a)
}, view:function (c, a, b, d) {
    var f = ["gs", "views"];
    if (c.match(/^themes/))f = [c]; else if (c.match(/^\//))f.push(c.replace(/^\//, "")); else {
        f.push(this.Class._shortName);
        f.push(c)
    }
    f = "/" + f.join("/");
    f += $.View.ext;
    var g = f.replace(/[\/\.]/g, "_").replace(/_+/g, "_").replace(/^_/, ""), k = GS.Controllers.BaseController.viewBundles[g], m = GS.Controllers.BaseController.bundleVersions[k] ||
            "", h = "", n = true;
    a = _.orEqual(a, this);
    b = this.calculateHelpers.call(this, b);
    if ($.View.preCached[g] || !k)return $.View(f, a, b);
    d = _.orEqual(d, 0);
    if (!(d >= 3)) {
        if (d > 0)n = false;
        g = {contentType:"application/json", dataType:"json", type:"GET", url:"/gs/views/" + k + ".json?" + m, async:false, cache:n, success:this.callback(function (q) {
            if (q) {
                _.forEach(q, function (s, w) {
                    $.View.preCached[w] = s
                });
                h = $.View(f, a, b)
            } else {
                d++;
                setTimeout(this.callback(function () {
                    this.view(c, a, b, d)
                }), d * 100)
            }
        }), error:this.callback(function () {
            d++;
            setTimeout(this.callback(function () {
                this.view(c,
                        a, b, d)
            }), d * 100)
        })};
        if (window.gsConfig && window.gsConfig.viewsJSONP) {
            g.url = gsConfig.assetHost + "/gs/views/" + k + ".json?" + m;
            g.dataType = "jsonp";
            g.jsonp = false;
            g.jsonpCallback = window.gsConfig.viewsJSONP + k
        }
        $.ajax(g);
        return h
    }
}});

