(function () {
    GS.Models.Feed.extend("GS.Models.ArtistFeed", {}, {type:"artist", artist:null, fetch:function (c) {
        GS.service.getArtistProfileFeed(this.artist.ArtistID, this.lastDocumentID, this.lastEventID, this.callback("parseFeed", {artistID:this.artist.ArtistID, lastDocumentID:this.lastDocumentID, lastEventID:this.lastEventID, currentPage:this.currentPage, callback:c.callback, errback:c.errback}), c.errback)
    }, parseFeed:function (c, a) {
        var b, d = [];
        c = _.orEqual(c, {});
        if (!this.pages[c.currentPage]) {
            for (var f = 0; f < a.events.length; f++)if (a.events[f])if (b =
                    this.parseEvent(a.events[f])) {
                d.push(b);
                this.cache[b.eventID] = b
            }
            this.events = this.events.concat(d);
            this.pages.push(d);
            this.currentPage++;
            this.lastDocumentID = a.lastDocumentID;
            this.lastEventID = a.lastEventID;
            this.hasMore = Boolean(a.hasMore);
            this.isLoaded = !Boolean(a.hasMore) || this.events.length;
            this.isComplete = true;
            this.events.length < 25 && a.count >= 25 && ++this.pages.length
        }
        c.callback && c.callback(this.pages[c.currentPage]);
        this.isComplete || this.fetch(c)
    }})
})(jQuery);

