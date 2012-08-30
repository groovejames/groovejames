(function () {
    GS.Models.Base.extend("GS.Models.Event", {defaults:{EventID:0, City:"", EventName:"", StartTime:"", TicketsURL:"", VenueName:"", ArtistName:"", searchText:""}}, {init:function (c) {
        this._super(c);
        this.TicketsURL.match("utm_source") || (this.TicketsURL += "?utm_source=1&utm_medium=partner");
        this.searchText = [c.ArtistName, c.EventName, c.City, c.VenueName].join(" ").toLowerCase();
        if (!this.ArtistName) {
            this.ArtistName = this.EventName;
            c = this.ArtistName.lastIndexOf(" at ");
            if (c !== -1)this.ArtistName = this.ArtistName.substring(0,
                    c)
        }
    }})
})(jQuery);

