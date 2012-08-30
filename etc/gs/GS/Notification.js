$.Class.extend("GS.Notification", {defaults:{duration:5E3, view:"notification", viewParams:false, uniqueInstance:false, element:null, isOpen:false, isAdded:false, timeout:false, focusInText:false, mouseIsOut:false, listenersSet:false, useAnimation:true, onOpen:null, onClose:null, rateLimitType:"misc", timestamp:null, nowOrNever:false, expiration:3E4, priority:5, subscription:null, loggedIn:null, iID:null, xID:null, customLimit:null, force:false}}, {controller:null, init:function (c) {
    c = $.extend({}, GS.Notification.defaults, c);
    for (var a in c)if (c.hasOwnProperty(a))this[a] = c[a];
    if (!this.notificationID)this.notificationID = this.controller.generateNotificationID();
    this.controller.notificationLookup[this.notificationID] = this;
    if (this.uniqueInstance)this.controller.uniquesLookup[this.uniqueInstance] = this;
    if (!this.viewParams)this.viewParams = {};
    this.viewParams.notificationID = this.notificationID;
    if (!this.element)this.element = $(this.controller.view(this.view, this.viewParams))
}, open:function () {
    this.isAdded || this.add();
    this.useAnimation ?
            this.element.slideDown("fast") : this.element.show();
    this.isOpen = true;
    this.beginTimeout();
    this.controller.reportOpen(this);
    $.isFunction(this.onOpen) && this.onOpen()
}, close:function (c) {
    this.remove();
    this.isOpen = false;
    this.endTimeout();
    this.controller.reportClose(this);
    $.isFunction(this.onClose) && this.onClose(c)
}, beginTimeout:function (c) {
    c = _.orEqual(c, this.duration);
    this.timeout && this.endTimeout();
    if (c)this.timeout = setTimeout(this.callback(function () {
        this.close()
    }), c)
}, endTimeout:function () {
    clearTimeout(this.timeout)
},
    setListeners:function () {
        this.element.mouseout(this.callback(function () {
            this.mouseOut = true;
            this.focusInText || this.beginTimeout(this.duration)
        }));
        this.element.mouseover(this.callback(function () {
            this.mouseOut = false;
            this.endTimeout()
        }));
        this.element.find("textarea").focus(this.callback(function () {
            this.focusInText = true;
            this.endTimeout()
        }));
        this.element.find("textarea").focusout(this.callback(function () {
            this.focusInText = false;
            this.mouseOut && this.beginTimeout(this.duration)
        }))
    }, add:function () {
        $("#notifications").append(this.element);
        this.element.hide();
        this.listenersSet || this.setListeners();
        this.isAdded = true
    }, remove:function () {
        if (this.useAnimation)this.element.stop().slideUp("fast", this.callback(function () {
            this.element.remove();
            this.isAdded = false
        })); else {
            this.element.remove();
            this.isAdded = false
        }
    }});

