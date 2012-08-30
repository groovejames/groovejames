(function () {
    GS.Models.Base.extend("GS.Models.Visualizer", {}, {title:"", author:"", swf:"/webincludes/flash/visualizerplayer.swf", src:"", thumb:null, width:480, height:270, flashvars:{version:gsConfig.coreVersion}, params:{allowscriptaccess:"always", allowfullscreen:true, wmode:"window"}, attributes:{name:"visualizerPlayer"}, object:null, init:function (c) {
        c && this._super(c)
    }, embed:function (c) {
        object = swfobject.embedSWF(this.swf, c, this.width, this.height, "9.0.0", null, this.flashvars, this.params, this.attributes)
    }})
})(jQuery);

