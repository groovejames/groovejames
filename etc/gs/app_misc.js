$.extend($.View.EJS.Helpers.prototype, {
    localeTag:function (c, a, b, d) {
        b = b || {};
        b["data-translate-text"] = a;
        a = $.localize.getString(a);
        if (d)a = $("<span></span>").dataString(a, d).render();
        return[this.tag(c, b), a, this.tagEnd(c)].join("")
    },
    tag:function (c, a, b) {
        var d = ["<" + c];
        _.forEach(a, function (f, g) {
            d.push(" " + g + '="' + f + '"')
        });
        d.push(b || ">");
        return d.join("")
    },
    tagEnd:function (c) {
        return["</", c, ">"].join("")
    }
});

