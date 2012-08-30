GS.Controllers.BaseController.extend("GS.Controllers.VimeoController", {isGSSingleton:true}, {f:null, API_URL:"http://vimeo.com/api/rest/v2/", API_KEY:"6bf5b02fd725f336e2587ee7feadcb42", API_SECRET:"247c4b613fcf18b5", init:function () {
    if (window.$f) {
        this.f = window.$f;
        window.$f = null
    }
    if (window.Froogaloop) {
        if (!this.f)this.f = window.Froogaloop;
        window.Froogaloop = null
    }
    this._super()
}, attachPlayer:function (c, a, b, d, f) {
    if (this.f) {
        var g = "http://player.vimeo.com/video/" + c + "?api=1&player_id=videoVObj" + d + "&autoplay=1";
        if (!c ||
                _.notDefined(c))return false;
        a = a || 480;
        b = b || 385;
        c = $("<iframe />").width(a).height(b).attr("src", g).attr("id", "videoVObj" + d);
        $("#" + d).html(c);
        var k = this.makeVideoObject($("#videoVObj" + d)[0]);
        f && k.addEvent("ready", function () {
            f(k)
        });
        return k[0]
    }
}, makeVideoObject:function (c) {
    var a = this.f(c);
    return{addEvent:function (b, d) {
        a.addEvent(b, d)
    }, play:function () {
        a.api("play")
    }, pause:function () {
        a.api("pause")
    }, isPaused:function (b) {
        a.api("paused", b)
    }, stop:function () {
        a.api("unload")
    }, getCurrentTime:function (b) {
        a.api("getCurrentTime",
                b)
    }, getVideoUrl:function (b) {
        a.api("getVideoUrl", b)
    }}
}, searchCache:{}, search:function (c, a, b) {
    if (!c || c == "")return false;
    this.searchCache[c] && $.isFunction(a) && a(this.searchCache[c]);
    var d = "jQueryVimeo" + OAuth.nonce(10), f = {per_page:10, query:c, method:"vimeo.videos.search", full_response:1, format:"jsonp", callback:d}, g = this.API_URL;
    OAuth.completeRequest({method:"GET", action:g, parameters:f}, {consumerKey:this.API_KEY, consumerSecret:this.API_SECRET});
    f = OAuth.getParameterMap(f);
    g = g + "?" + _.httpBuildQuery(f);
    $.ajax({url:g,
        success:this.callback("searchSuccess", a, b, c), error:this.callback("searchFailed", b), dataType:"jsonp", jsonp:false, jsonpCallback:d, cache:true})
}, searchSuccess:function (c, a, b, d) {
    if (d.videos && d.videos.video) {
        var f = [];
        _.forEach(d.videos.video, function (g) {
            f.push({Description:g.description || "", Duration:parseInt(g.duration), Height:parseInt(g.height), Width:parseInt(g.width), VideoID:g.id, Plays:parseInt(g.number_of_plays), Title:g.title || "", URL:"http://vimeo.com/" + g.id, Thumbnails:g.thumbnails.thumbnail})
        });
        this.searchCache[b] =
                f;
        $.isFunction(c) && c(f)
    } else {
        this.lastError = d;
        $.isFunction(a) && a(d)
    }
}, searchFailed:function (c, a) {
    this.lastError = a;
    $.isFunction(c) && c(a)
}});

