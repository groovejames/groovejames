(function () {
    GS.Models.Feed.extend("GS.Models.ProfileFeed", {}, {type:"profile", fetch:function (c) {
        this.user.UserID > 0 && GS.user.UserID == this.user.UserID ? GS.service.getProfileFeed(this.lastDocumentID, this.lastEventID, this.callback("parseFeed", {lastDocumentID:this.lastDocumentID, lastEventID:this.lastEventID, currentPage:this.currentPage, callback:c.callback, errback:c.errback}), this.callback("onError", c)) : GS.service.getUserProfileFeed(this.user.UserID, this.lastDocumentID, this.lastEventID, this.callback("parseFeed",
                {lastDocumentID:this.lastDocumentID, lastEventID:this.lastEventID, currentPage:this.currentPage, callback:c.callback, errback:c.errback}), this.callback("onError", c))
    }, parseFeed:function (c, a) {
        var b, d = [];
        if (_.isEmpty(a) || !a.events)return this.onError(c);
        if (!this.pages[c.currentPage]) {
            for (var f = 0; f < a.events.length; f++)if (a.events[f])if (b = this.parseEvent(a.events[f])) {
                d.push(b);
                this.cache[b.eventID] = b
            }
            this.events = this.events.concat(d);
            this.pages.push(d);
            this.currentPage++;
            this.lastDocumentID = a.lastDocumentID;
            this.lastEventID = a.lastEventID;
            this.isComplete = this.isLoaded = true;
            this.hasMore = a.count && this.currentPage < 10
        }
        c.callback && c.callback(this.pages[c.currentPage]);
        this.isComplete || this.fetch(c)
    }})
})(jQuery);

