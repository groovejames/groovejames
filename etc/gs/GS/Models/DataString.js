(function (c) {
    c.fn.dataString = function () {
        if (arguments.length === 0)return _.orEqual(this.data("DataString"), null);
        var a = new GS.Models.DataString(arguments[0], arguments[1]);
        a.hookup(this);
        return a
    };
    c.fn.localeDataString = function (a, b, d) {
        a = _.orEqual(a, "");
        b = _.orEqual(b, {});
        d = _.orEqual(d, false);
        var f = c(this).dataString();
        if (!f) {
            f = new GS.Models.DataString;
            f.hookup(this)
        }
        f.string = c.localize.getString(a);
        f.data = b;
        d ? c(this).attr("data-translate-title", a).attr("title", f.render()) : c(this).attr("data-translate-text",
                a).html(f.render());
        return f
    };
    c.Model.extend("GS.Models.DataString",
        {
            dateString:function (a) {
                var b, d = {};
                b = new Date;
                var f = b.getTime() - a.getTime(), g = GS.getLocale();
                if (f < 6E4)b = c.localize.getString("SECONDS_AGO"); else if (f < 36E5) {
                    b = c.localize.getString("MINUTES_AGO");
                    d = {minutes:Math.ceil(f / 6E4)}
                } else if (f < 432E5 || b.getDate() == a.getDate() && f < 6048E5) {
                    b = c.localize.getString("HOURS_AGO");
                    d = {hours:Math.ceil(f / 36E5)}
                } else if (b.getDate() - 1 == a.getDate() && f < 6048E5) {
                    b = c.localize.getString("YESTERDAY_AGO");
                    d = {time:a.format("g:i a")}
                } else if (f <
                        6048E5) {
                    b = c.localize.getString("DAY_AGO");
                    d = {day:g.daysOfWeek[a.getDay()], time:a.format("g:i a")}
                } else {
                    b = c.localize.getString("OVER_A_WEEK_AGO");
                    d = {day:g.daysOfWeek[a.getDay()], date:a.format("F jS Y")}
                }
                return new GS.Models.DataString(b, d)
            }
        },
        {
            string:null, data:null, element:null,
            init:function (a, b) {
                this.string = _.orEqual(a, "");
                this.data = _.orEqual(b, {})
            }, 
            setString:function (a) {
                if (this.string !== a) {
                    this.string = a;
                    this.render()
                }
            }, 
            setData:function (a, b) {
                if (this.data[a] !== b) {
                    this.data[a] = b;
                    this.render()
                }
            }, 
            hookup:function (a) {
                this.element =
                        c(a);
                this.element.data("DataString", this)
            }, 
            render:function () {
                for (var a = this.string, b = [], d, f = /^[^\{]+/, g = /^\{(.*?)\}/, k = this.data; a;) {
                    if (d = f.exec(a))b.push(d[0]); else if (d = g.exec(a)) {
                        var m = d[1];
                        k[m] ? b.push(k[m]) : b.push(d[0])
                    } else throw"Error rendering data object";
                    a = a.substring(d[0].length)
                }
                a = b.join("");
                if (this.element && this.element.length)this.element[0].tagName == "INPUT" ? this.element.val(a) : this.element.html(a);
                return a
            }
        }
    )
})(jQuery);

