GS.Controllers.BaseController.extend("GS.Controllers.Lightbox.GenericController", {onDocument:false, viewDefaults:{buttonsLeft:[], buttonsRight:[], showFooter:true}}, {init:function (c, a) {
    this.update(a);
    _.forEach(this.options.callbacks, function (b, d) {
        this.delegate(this.element, d, "click", b)
    }, this);
    this.delegate(this.element, ".submit", "click", function (b) {
        GS.getLightbox().close();
        b.preventDefault()
    })
}, update:function (c) {
    this._super(c);
    this.options.view = $.extend(true, {}, this.options.view, GS.Controllers.Lightbox.GenericController.viewDefaults);
    this.options.view.showFooter = this.options.view.buttonsLeft.length > 0 || this.options.view.buttonsRight.length > 0;
    this.element.html(this.view("/lightbox/generic", this.options.view, {first:function (a) {
        return a === 0 ? "first" : ""
    }, last:function (a, b) {
        return a === b - 1 ? "last" : ""
    }, button:function (a) {
        var b = [], d = {"class":"btn btn_style4 " + (a.className || "")};
        if (a.href)d.href = a.href;
        if (a.disabled)d.disabled = "disabled";
        var f = a.href ? "a" : "button";
        b.push(this.tag(f, d));
        b.push(this.tag("div"));
        if (a.buttonHTML)b.push(a.buttonHTML);
        else a.labelHTML ? b.push(this.tag("span"), a.labelHTML, this.tagEnd("span")) : b.push(this.localeTag("span", a.label));
        b.push(this.tagEnd("div"));
        b.push(this.tagEnd(f));
        return b.join("")
    }}));
    $.isFunction(c.loadCallback) && c.loadCallback(this.element)
}, "#lightbox_footer button.closeBtn click":function (c, a) {
    if ($(c).hasClass("disabled")) {
        a.stopPropagation();
        a.preventDefault();
        return false
    }
    GS.getLightbox().close()
}, "form submit":function (c, a) {
    a.preventDefault()
}});

