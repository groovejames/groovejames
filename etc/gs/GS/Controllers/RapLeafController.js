GS.Controllers.BaseController.extend("GS.Controllers.RapLeafController", {isGSSingleton:true, preSetup:function () {
    $.subscribe("gs.auth.update", GS.Controllers.BaseController.singletonCallback("rapleaf", "update"))
}}, {personalizeMapTheme:{"4097253982":"10=2", "4097253968":"10=2", "4097253992":"10=3", "4097253999":"10=4", "4097254011":"10=5", "4097254001":"10=5", "4097254007":"10=5", "4097253897":"1=0", "4097253890":"1=1"}, personalizeMapSidebar:{"4097253982":"10=2", "4097253968":"10=2", "4097253992":"10=3", "4097253999":"10=4",
    "4097254011":"10=5", "4097254001":"10=5", "4097254007":"10=5", "4097253897":"1=0", "4097253890":"1=1"}, init:function () {
    this._super()
}, appReady:function () {
    this.onPersonalize()
}, update:function () {
    this.onPersonalize()
}, onPersonalize:function () {
    if (!GS.user.subscription.isPremium() && !GS.user.isLoggedIn) {
        var c = GS.store.get("webvisit");
        c ? this.updateParams(c) : $.getScript("http://rd.rlcdn.com/rd?type=js&site=108574", this.callback("onPersonalizeCallback"))
    }
}, updateParams:function (c) {
    for (var a = 0; a < c.theme.length; a++) {
        if (c.theme[a].indexOf("0=") ==
                0) {
            c.theme[a] = c.theme[a].replace("0=18-24", "10=2");
            c.theme[a] = c.theme[a].replace("0=25-34", "10=3");
            c.theme[a] = c.theme[a].replace("0=35-44", "10=4");
            c.theme[a] = c.theme[a].replace("0=50-", "10=5")
        }
        if (c.sidebar[a].indexOf("AgeRange=") == 0) {
            c.sidebar[a] = c.sidebar[a].replace("AgeRange=18-24", "10=2");
            c.sidebar[a] = c.sidebar[a].replace("AgeRange=25-34", "10=3");
            c.sidebar[a] = c.sidebar[a].replace("AgeRange=35-44", "10=4");
            c.sidebar[a] = c.sidebar[a].replace("AgeRange=50-", "10=5")
        } else if (c.sidebar[a].indexOf("Gender=M") ==
                0)c.sidebar[a] = c.sidebar[a].replace("Gender=M", "1=0"); else if (c.sidebar[a].indexOf("Gender=F") == 0)c.sidebar[a] = c.sidebar[a].replace("Gender=F", "1=1")
    }
    GS.store.set("webvisit", c)
}, onPersonalizeCallback:function () {
    if (_rlcdnsegs && _rlcdnsegs.length) {
        for (var c = {theme:[], sidebar:[]}, a = 0; a < _rlcdnsegs.length; a++)try {
            c.theme.push(this.personalizeMapTheme[_rlcdnsegs[a].toString()]);
            c.sidebar.push(this.personalizeMapSidebar[_rlcdnsegs[a].toString()])
        } catch (b) {
            console.warn("[ Personalize Out of Bounds ]")
        }
        GS.store.set("webvisit",
                c);
        a = {};
        a.params = c.sidebar.toString();
        jQuery.isEmptyObject(a) || GS.getGuts().logEvent("rapleafCollectedData", a)
    } else GS.store.remove("webvisit")
}});

