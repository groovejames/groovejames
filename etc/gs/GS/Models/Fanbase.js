(function (c) {
    GS.Models.Base.extend("GS.Models.Fanbase", {}, {currentPage:0, objectID:null, objectType:"", userIDs:[], fansLoaded:false, init:function (a) {
        this._super(a);
        this.userIDs = _.orEqual(a.userIDs, []);
        this.fansLoaded = _.orEqual(a.fansLoaded, false)
    }, getFans:function (a, b) {
        if (this.fansLoaded) {
            var d = GS.Models.User.getManyFromCache(this.userIDs);
            c.isFunction(a) && a(d)
        } else this.objectType === "playlist" ? GS.service[this.objectType + "GetFans"](this.objectID, this.callback(["cacheAndReturnUsers", a]), b) : GS.service[this.objectType +
                "GetFans"](this.objectID, this.currentPage, this.callback(["cacheAndReturnUsers", a]), b)
    }, cacheAndReturnUsers:function (a) {
        for (var b = GS.Models.User.wrapCollection(a.Users || a.Return.fans || a.Return), d = 0; d < b.length; d++) {
            var f = b[d];
            this.userIDs.indexOf(f.UserID) == -1 && this.userIDs.push(f.UserID)
        }
        if (_.defined(a.hasMore) && a.hasMore)this.currentPage++; else this.fansLoaded = true;
        return b
    }})
})(jQuery);

