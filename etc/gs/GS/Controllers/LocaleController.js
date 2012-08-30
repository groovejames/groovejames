(function () {
    function c(b) {
        if (a.indexOf(b) === -1)b = "en";
        $("[data-translate-text]").localize("gs", {language:b});
        $("[data-translate-title]").localize("gs", {language:b, callback:"titleCallback"})
    }

    var a = ["bg", "ca", "cs", "cy", "da", "de", "el", "en", "es", "eu", "et", "gl", "fi", "fr", "hr", "hu", "it", "ja", "ko", "lt", "lv", "nb", "nl", "pl", "pt", "ro", "ru", "sk", "sl", "sv", "tr", "uk", "zh"];
    GS.Controllers.BaseController.extend("GS.Controllers.LocaleController", {onWindow:true, isGSSingleton:true}, {locale:"en", init:function () {
        var b =
                this, d = (GS.store.get("gs.locale") || gsConfig.lang || this.detectLangauge() || this.locale || "en").substring(0, 2);
        if (a.indexOf(d) === -1)d = "en";
        c(d);
        this.updateWeeksMonths();
        this.subscribe("gs.locale.changed", function (f) {
            b.locale = f;
            b.callback("updateWeeksMonths");
            c(f);
            $.publish("gs.locale.update", f);
            GS.store.set("gs.locale", f)
        });
        this.locale = d;
        $.localize.ready ? c(d) : this.subscribe("gs.locale.ready", this.callback(function () {
            c(this.locale)
        }))
    }, daysOfWeek:[], monthsOfYear:[], updateWeeksMonths:function () {
        var b = $.localize.getString("WEEK_DAYS");
        if (b && b.length)this.daysOfWeek = b.split(",");
        if ((b = $.localize.getString("MONTHS")) && b.length)this.monthsOfYear = b.split(",")
    }, detectLangauge:function () {
        var b = window.navigator;
        return b.language || b.browserLanguage || b.systemLanguage || b.userLanguage
    }})
})();

