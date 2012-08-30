(function (c) {
    GS.Models.Base.extend("GS.Models.Feed", {QUEUE_ADD_LIMIT:50}, {user:null, type:null, lastDocumentID:null, lastEventID:null, events:[], pages:[], currentPage:0, hasMore:false, isLoaded:false, isComplete:false, isDirty:false, isErrored:false, realTimeWaiting:[], lastRequest:0, cache:{}, RATE_LIMIT:6E4, PAGE_LIMIT:5, getFeed:function (a, b) {
        this.reset();
        this.isComplete ? a(this.events) : this.fetch({callback:a, errback:b})
    }, next:function (a, b) {
        this.fetch({callback:a, errback:b})
    }, reset:function () {
        var a = new Date;
        if (!this.isLoaded ||
                a.getTime() > this.lastRequest + this.RATE_LIMIT || this.isDirty) {
            this.events = [];
            this.lastDocumentID = this.lastEventID = 0;
            this.isLoaded = this.hasMore = this.isComplete = this.isDirty = this.isErrored = false;
            this.lastRequest = a.getTime();
            this.cache = {};
            this.pages = [];
            this.currentPage = 0
        }
    }, fetch:function () {
        return[]
    }, onError:function (a) {
        this.isLoaded = this.isErrored = true;
        a && a.errback && a.errback([])
    }, filterFollows:function (a) {
        return a.type == GS.Models.FeedEvent.USER_FOLLOWED_TYPE || a.type == GS.Models.FeedEvent.USERS_FOLLOWED_TYPE ||
                a.type == GS.Models.FeedEvent.FAVORITE_USERS_TYPE ? false : true
    }, parseEvent:function (a) {
        var b = null;
        try {
            b = GS.Models.FeedEvent.wrap(a)
        } catch (d) {
            gsConfig.runMode != "production" && console.warn("Feed Parse Error: ", a.activityName, a, d)
        }
        return b
    }, parseUser:function (a, b) {
        var d = [], f;
        for (var g in a)if (a.hasOwnProperty(g))if (f = parseEvent(g)) {
            f.user = b;
            d.push(f)
        }
        return d
    }, getEvents:function (a) {
        a = _.orEqual(a, 0);
        var b = this.events.concat();
        if (a) {
            b = [];
            for (var d = 0; d < this.events.length; d++)if (this.events[d].timestamp > a)b.push(this.events[d]);
            else break
        }
        return b
    }, getSongGroups:function (a, b) {
        var d = [], f, g, k, m, h, n = 0, q = {};
        a = _.orEqual(a, 0);
        b = _.orEqual(b, GS.Models.Feed.QUEUE_ADD_LIMIT);
        var s = this.getEvents(a);
        for (k = 0; k < s.length; k++) {
            h = s[k];
            f = h.getSongs();
            if (n <= b && f.length && GS.Models.FeedEvent.ListenTypes[h.activityName]) {
                g = [];
                for (m = 0; m < f.length; m++)if (!q[f[m].SongID]) {
                    g.push(f[m].SongID);
                    q[f[m].SongID] = true;
                    n++
                }
                d.push({songIDs:g, context:h.getDetailsForFeeds()});
                if (n > b)break
            }
        }
        return d
    }, play:function (a, b, d, f, g) {
        this.isComplete ? this.playSongs(a,
                b, d, f, g) : this.getFeed(this.callback(function () {
            this.isComplete && this.playSongs(a, b, d, f, g)
        }))
    }, playSongs:function (a, b, d, f, g) {
        if (this.isComplete) {
            a = _.orEqual(a, -1);
            b = _.orEqual(b, false);
            d = _.orEqual(d, 0);
            f = _.orEqual(f, GS.Models.Feed.QUEUE_ADD_LIMIT);
            g = _.orEqual(g, false);
            for (var k = this.getSongGroups(d, f), m = this.getDetailsForFeeds(), h = k.length - 1; h >= 0; h--) {
                d = k[h];
                f = d.songIDs.reverse();
                GS.player.addSongsToQueueAt(f, a, b, c.extend({event:d.context}, m), g && h === 0);
                a = a == GS.player.INDEX_REPLACE ? GS.player.INDEX_DEFAULT :
                        a;
                if (f.length)b = false
            }
        }
    }, getDetailsForFeeds:function () {
        return{user:this.user ? this.user.getDetailsForFeeds() : null, type:GS.player.PLAY_CONTEXT_FEED, feedType:this.type}
    }})
})(jQuery);

