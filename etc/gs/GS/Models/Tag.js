(function (c) {
    GS.Models.Base.extend("GS.Models.Tag", {id:"TagID", GENRE_TAGS:{}, getGenreTags:function () {
        _.isEmpty(this.GENRE_TAGS) && c.getJSON("gs/models/tags_with_ids.json", this.callback(function (a) {
            this.GENRE_TAGS = a
        }));
        return this.GENRE_TAGS
    }, init:function () {
    }}, {})
})(jQuery);

