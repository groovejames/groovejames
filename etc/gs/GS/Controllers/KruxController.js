GS.Controllers.BaseController.extend("GS.Controllers.KruxController", {isGSSingleton:true, preSetup:function () {
    var c = GS.Controllers.BaseController.singletonCallback;
    $.subscribe("gs.auth.update", c("krux", "update"));
    $.subscribe("gs.app.ready", c("krux", "update"))
}}, {ksgmnts:null, kuid:null, kruxTimeoutID:null, kruxMap:{lpza0398b:"k=lpza0398b"}, init:function () {
    this._super()
}, update:function () {
    this.onPersonalize()
}, onPersonalize:function () {
    if (GS.user.subscription.isPremium())clearTimeout(this.kruxTimeoutID);
    else {
        if (GS.user.isLoggedIn) {
            var c = {};
            if (GS.user.Sex)c["1"] = GS.user.Sex.toLowerCase() == "m" ? "0" : "1";
            if (GS.user.TSDOB) {
                var a = GS.user.TSDOB.split("-");
                if (a.length == 3) {
                    var b = new Date, d = b.getFullYear() - parseInt(a[0], 10);
                    if (parseInt(a[1], 10) > b.month)d -= 1; else if (parseInt(a[1], 10) == b.month && parseInt(a[2], 10) > b.date)d -= 1;
                    var f;
                    if (d >= 13 && d < 18)f = "1"; else if (d >= 18 && d < 25)f = "2"; else if (d >= 25 && d < 35)f = "3"; else if (d >= 35 && d < 50)f = "4"; else if (d >= 50)f = "5"
                }
                c["10"] = f;
                c["14"] = GS.getAd().encodeInteger(d)
            }
            try {
                c["0"] = GS.getAd().locales[GS.getLocale().locale]
            } catch (g) {
                c["0"] =
                        "0=1"
            }
            window.KRUXSetup = {pubid:"b5c2e077-e8aa-4ed6-9bf5-d6e958d0e2ca", site:"Grooveshark.com", section:"Listen", sub_section:"Rock", async:true, userAttributes:c}
        } else window.KRUXSetup = {pubid:"b5c2e077-e8aa-4ed6-9bf5-d6e958d0e2ca", site:"Grooveshark.com", async:true, loadSegments:true};
        c = !GS.user.isLoggedIn ? 1E4 : 100;
        this.kruxTimeoutID = setTimeout(this.callback(function () {
            $.ajax({cache:true, dataType:"script", url:"http://cdn.krxd.net/krux.js", success:this.callback("onKruxLoad")})
        }), c)
    }
}, onKruxLoad:function () {
    if (KRUX) {
        var c =
                KRUX.getSegments();
        if (c && c.length) {
            var a = {params:[]};
            this.ksgmnts = c.split(",");
            for (c = 0; c < this.ksgmnts.length; c++)try {
                this.kruxMap[this.ksgmnts[c].toString()] && a.params.push(this.kruxMap[this.ksgmnts[c].toString()])
            } catch (b) {
                console.warn("[ Krux Out of Bounds ]")
            }
            a.params.length && GS.store.set("krux", a)
        } else GS.store.set("krux", null)
    }
}});

