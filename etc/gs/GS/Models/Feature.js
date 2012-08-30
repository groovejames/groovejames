(function (c) {
    c.Model.extend("GS.Models.Feature", {TYPE_ACTIVATE:"ACTIVATE", TYPE_PASSIVE:"PASSIVE", TYPE_PLUGIN:"PLUGIN", Features:{}, Activated:{}, Plugins:{}, init:function () {
        GS.Models.Feature.Plugins.sharkZapper = new GS.Models.Feature({})
    }, register:function (a, b) {
        GS.Models.Feature.Features[a] = new GS.Models.Feature(b)
    }}, {FeatureID:"", TextKey:"", Author:"Grooveshark", URL:"", IsPremium:true, Type:"PASSIVE", IsLoaded:false, LoadOnActivate:false, ActivateCallback:null, IsActiveCallback:null, init:function (a) {
        this._super(a)
    },
        activate:function (a) {
            if ((GS.user.subscription.isPremium() || !this.IsPremium) && this.ActivateCallback) {
                this.ActivateCallback();
                a && a()
            } else this.ActivateCallback && GS.getLightbox().open("vipOnlyFeature", {callback:this.callback(this.activate, a)})
        }, isActive:function () {
            return this.IsActiveCallback ? this.IsActiveCallback() : false
        }, getImageURL:function (a) {
            a = _.orEqual(a, "s");
            return gsConfig.assetHost + "/features/" + this.FeatureID + "/icon_" + a + ".png"
        }, getButtonKey:function () {
            return this.Type + (this.isActive() ? "_BUTTON_OFF" :
                    "_BUTTON_ON")
        }})
})(jQuery);

