(function () {
    GS.Models.Feed.extend("GS.Models.NotificationsFeed", {}, {type:"notifications", fetch:function (c) {
        GS.user.UserID > 0 && GS.user.UserID == this.user.UserID && GS.service.getUserNotifications(this.callback("parseFeed", {currentPage:this.currentPage, callback:c.callback, errback:c.errback}), c.errback)
    }, parseFeed:function (c, a) {
        var b, d = [];
        c = _.orEqual(c, {});
        if (!this.pages[c.currentPage]) {
            for (var f = 0; f < a.length; f++)if (a[f])if (b = this.parseEvent(a[f])) {
                d.push(b);
                this.cache[b.eventID] = b
            }
            this.events = this.events.concat(d);
            this.pages.push(d);
            this.currentPage++;
            this.lastEventID = a.lastEventID;
            this.hasMore = Boolean(a.hasMore);
            this.isLoaded = !Boolean(a.hasMore) || this.events.length;
            this.isComplete = true
        }
        c.callback && c.callback(this.pages[c.currentPage]);
        this.isComplete || this.fetch(c)
    }})
})(jQuery);

