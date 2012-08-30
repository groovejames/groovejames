(function (c) {
    var a;
    GS.Models.Base.extend("GS.Models.Video", {id:"VideoID", artPath:"http://images.grooveshark.com/static/featured/", defaults:{title:"", author:"", type:"iframe", swf:"/webincludes/flash/videoplayer.swf", src:"", VideoID:"", VimeoID:""}, wrapYoutube:function (b, d) {
        if (!b.thumbnail)var f = b.Thumbnails && b.Thumbnails.length && b.Thumbnails[0] ? b.Thumbnails[0].url : "";
        d = d || b.Title || b.title || b.Video;
        return this.wrap(c.extend(true, {}, b, {title:d, duration:_.millisToMinutesSeconds((b.duration || b.Duration) *
                1E3), type:"youtube", thumbnail:f, width:_.orEqual(b.Width, 480), height:_.orEqual(b.Height, 385), author:_.orEqual(b.Author, "")}))
    }, exploreItemRenderer:function (b) {
        var d = "" + ('<a class="featuredVideoName name ellipsis" data-videoid="' + b.VideoID + '" data-videogroup="' + b.set + '">' + b.title + "</a>"), f = ['<img height="120" src="', b.getImageURL(120), '"/>'].join(""), g = ['<a href="', b.uri, '">', b.attributor, "</a>"].join("");
        g = c("<span></span>").localeDataString("BY_ARTIST", {artist:g});
        var k = b.set ? '<span class="group">in ' +
                b.set + "</span>" : "";
        return['<div  class="tooltip" data-tip-type="video" data-videoid="', b.VideoID, '" data-cachePrefix="', b.cachePrefix, '"><a class="videoImage insetBorder height120">', f, '<span class="videoPlayBtn" data-videoid="', b.VideoID, '" data-videogroup="' + b.set + '"></span></a>', '<div class="meta">', d, '<span class="by ellipsis">', g.render(), "</span>", k, "</div></div>"].join("")
    }, searchItemRenderer:function (b) {
        var d = ['<a class="name ellipsis" title="', b.title, '">' + b.title + "</a>"].join(""), f = ['<img height="90" src="',
            b.thumbnail, '"/>'].join("");
        return['<a class="videoImage insetBorder height120" title="', b.title, '">', f, '<span class="videoPlayBtn" data-videoid="', b.VideoID, '" data-videogroup="' + b.set + '"></span></a>', '<div class="meta">', d, "</div></div>"].join("")
    }}, {title:"", author:"", type:"flash", swf:"/webincludes/flash/videoplayer.swf", src:"", thumb:null, thumbnail:null, thumbTracking:null, originalWidth:null, originalHeight:null, id:"", width:480, height:385, flashvars:{version:gsConfig.coreVersion}, params:{allowscriptaccess:"always",
        allowfullscreen:true}, attributes:{name:"videoPlayer"}, object:null, init:function (b) {
        a = this;
        if (b) {
            this._super(b);
            this.type = _.orEqual(b.embedType, b.type);
            this.VideoID = _.orEqualEx(b.vimeoID, b.VimeoID, b.videoID, b.VideoID)
        }
    }, embed:function (b, d) {
        if (this.type == "flash") {
            d = _.orEqual(d, a.refreshWindow);
            object = swfobject.embedSWF(this.swf, b, this.width, this.height, "9.0.0", null, this.flashvars, this.params, this.attributes, d)
        } else if (this.type == "iframe" || this.type == "vimeo")return GS.getVimeo().attachPlayer(this.VideoID,
                this.width, this.height, b, d); else this.type == "youtube" && GS.getYoutube().attachPlayer(this.VideoID, this.width, this.height, b, d)
    }, refreshWindow:function () {
        setTimeout(function () {
            c(window).resize()
        }, 500)
    }, getImageURL:function (b) {
        b = _.orEqual(b, 70);
        if (this.Picture)return GS.Models.Video.artPath + b + "_" + this.Picture;
        return GS.Models.Video.artPath + b + "_artist.png"
    }})
})(jQuery);

