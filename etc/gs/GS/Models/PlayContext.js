(function (c) {
    c.Model.extend("GS.Models.PlayContext", {}, {type:null, data:null, init:function (a, b) {
        this.type = _.orEqual(a, "unknown");
        this.data = _.orEqual(b, {});
        var d;
        if (this.type === "album" && this.data.hasOwnProperty("CoverArtFilename"))d = this.data.CoverArtFilename;
        if (c.isFunction(this.data.getDetailsForFeeds))this.data = this.data.getDetailsForFeeds();
        if (d)this.data.CoverArtFilename = d
    }})
})(jQuery);

