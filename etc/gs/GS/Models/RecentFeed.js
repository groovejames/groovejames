(function () {
    GS.Models.Feed.extend("GS.Models.RecentFeed", {interestingFeed:null, init:function () {
        this.interestingFeed = new GS.Models.RecentFeed({})
    }}, {type:"recent", fetch:function (c) {
        c = _.orEqual(c, {});
        c.limit = _.orEqual(c.limit, 50);
        GS.service.getInterestingEvents(c.limit, this.callback("parseFeed", {limit:c.limit, callback:c.callback, errback:c.errback, currentPage:this.currentPage}), c.errback)
    }, parseFeed:function (c, a) {
        var b = [], d;
        if (!this.pages[c.currentPage]) {
            for (var f = 0; f < a.length; f++)if (d = this.parseEvent(a[f])) {
                b.push(d);
                this.cache[d.eventID] = d
            }
            this.events = this.events.concat(b);
            this.pages.push(b);
            this.currentPage++;
            this.isComplete = this.isLoaded = true
        }
        c.callback && c.callback(this.pages[c.currentPage]);
        this.isComplete || this.fetch(c)
    }})
})(jQuery);

