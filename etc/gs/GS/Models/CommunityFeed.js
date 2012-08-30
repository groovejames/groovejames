(function () {
    GS.Models.Feed.extend("GS.Models.CommunityFeed", {}, {type:"community", userIDs:[], fetch:function (c) {
        GS.user.UserID > 0 && GS.user.UserID == this.user.UserID ? GS.service.getCombinedFeed(this.userIDs, this.lastEventID, this.callback("parseFeed", {currentPage:this.currentPage, lastEventID:this.lastEventID, callback:c.callback, errback:c.errback}), this.callback("onError", c)) : GS.service.getUserCombinedFeed(this.user.UserID, this.userIDs, this.lastEventID, this.callback("parseFeed", {currentPage:this.currentPage,
            lastEventID:this.lastEventID, callback:c.callback, errback:c.errback}), this.callback("onError", c))
    }, parseFeed:function (c, a) {
        var b, d = [];
        c = _.orEqual(c, {});
        if (_.isEmpty(a) || !a.events)return this.onError(c);
        if (!this.pages[c.currentPage]) {
            for (var f = 0; f < a.events.length; f++)if (a.events[f])if (b = this.parseEvent(a.events[f])) {
                d.push(b);
                this.cache[b.eventID] = b
            }
            this.events = this.events.concat(d);
            this.pages.push(d);
            this.currentPage++;
            this.lastEventID = a.lastEventID;
            this.isLoaded = Boolean(this.events.length);
            this.isComplete =
                    true;
            if (this.events.length < 75 && a.count >= 25 && this.pages.length < GS.Models.Feed.PAGE_LIMIT)this.isComplete = false;
            this.hasMore = a.count && this.currentPage < 10
        }
        c.callback && c.callback(this.pages[c.currentPage]);
        this.isComplete || this.fetch(c)
    }})
})(jQuery);

