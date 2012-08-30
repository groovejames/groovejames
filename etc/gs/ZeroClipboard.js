window.ZeroClipboard = {version:"1.0.7", clients:{}, moviePath:"/webincludes/flash/ZeroClipboard.swf", nextId:1, $:function (a) {
    if (typeof a == "string")a = document.getElementById(a);
    if (!a.addClass) {
        a.hide = function () {
            this.style.display = "none"
        };
        a.show = function () {
            this.style.display = ""
        };
        a.addClass = function (d) {
            this.removeClass(d);
            this.className += " " + d
        };
        a.removeClass = function (d) {
            for (var b = this.className.split(/\s+/), c = -1, e = 0; e < b.length; e++)if (b[e] == d) {
                c = e;
                e = b.length
            }
            if (c > -1) {
                b.splice(c, 1);
                this.className = b.join(" ")
            }
            return this
        };
        a.hasClass = function (d) {
            return!!this.className.match(RegExp("\\s*" + d + "\\s*"))
        }
    }
    return a
}, setMoviePath:function (a) {
    this.moviePath = a
}, dispatch:function (a, d, b) {
    (a = this.clients[a]) && a.receiveEvent(d, b)
}, register:function (a, d) {
    this.clients[a] = d
}, getDOMObjectPosition:function (a, d) {
    for (var b = {left:0, top:0, width:a.width ? a.width : a.offsetWidth, height:a.height ? a.height : a.offsetHeight}; a && a != d;) {
        b.left += a.offsetLeft;
        b.top += a.offsetTop;
        a = a.offsetParent
    }
    return b
}, Client:function (a) {
    this.handlers = {};
    this.id = ZeroClipboard.nextId++;
    this.movieId = "ZeroClipboardMovie_" + this.id;
    ZeroClipboard.register(this.id, this);
    a && this.glue(a)
}};
window.ZeroClipboard.Client.prototype = {id:0, ready:false, movie:null, clipText:"", handCursorEnabled:true, cssEffects:true, handlers:null, glue:function (a, d, b) {
    this.domElement = ZeroClipboard.$(a);
    if (typeof d == "string")d = ZeroClipboard.$(d); else if (typeof d == "undefined")d = document.getElementsByTagName("body")[0];
    a = ZeroClipboard.getDOMObjectPosition(this.domElement, d);
    this.div = document.createElement("div");
    var c = this.div.style;
    c.position = "absolute";
    c.left = "" + a.left + "px";
    c.top = "" + a.top + "px";
    c.width = "" + a.width +
            "px";
    c.height = "" + a.height + "px";
    c.zIndex = 1E5;
    if (typeof b == "object")for (addedStyle in b)c[addedStyle] = b[addedStyle];
    d.appendChild(this.div);
    this.div.innerHTML = this.getHTML(a.width, a.height)
}, getHTML:function (a, d) {
    var b = "", c = "id=" + this.id + "&width=" + a + "&height=" + d;
    if (navigator.userAgent.match(/MSIE/)) {
        var e = location.href.match(/^https/i) ? "https://" : "http://";
        b += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + e + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' +
                a + '" height="' + d + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + c + '"/><param name="wmode" value="transparent"/></object>'
    } else b += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath +
            '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + a + '" height="' + d + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + c + '" wmode="transparent" />';
    return b
}, hide:function () {
    if (this.div)this.div.style.left = "-2000px"
}, show:function () {
    this.reposition()
}, destroy:function () {
    if (this.domElement && this.div) {
        this.hide();
        this.div.innerHTML =
                "";
        var a = document.getElementsByTagName("body")[0];
        try {
            a.removeChild(this.div)
        } catch (d) {
        }
        this.div = this.domElement = null
    }
}, reposition:function (a) {
    if (a)(this.domElement = ZeroClipboard.$(a)) || this.hide();
    if (this.domElement && this.div) {
        a = ZeroClipboard.getDOMObjectPosition(this.domElement);
        var d = this.div.style;
        d.left = "" + a.left + "px";
        d.top = "" + a.top + "px"
    }
}, setText:function (a) {
    this.clipText = a;
    this.ready && this.movie.setText(a)
}, addEventListener:function (a, d) {
    a = a.toString().toLowerCase().replace(/^on/, "");
    this.handlers[a] ||
    (this.handlers[a] = []);
    this.handlers[a].push(d)
}, setHandCursor:function (a) {
    this.handCursorEnabled = a;
    this.ready && this.movie.setHandCursor(a)
}, setCSSEffects:function (a) {
    this.cssEffects = !!a
}, receiveEvent:function (a, d) {
    a = a.toString().toLowerCase().replace(/^on/, "");
    switch (a) {
        case "load":
            this.movie = document.getElementById(this.movieId);
            if (!this.movie) {
                var b = this;
                setTimeout(function () {
                    b.receiveEvent("load", null)
                }, 1);
                return
            }
            if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                b =
                        this;
                setTimeout(function () {
                    b.receiveEvent("load", null)
                }, 100);
                this.ready = true;
                return
            }
            this.ready = true;
            this.movie.setText(this.clipText);
            this.movie.setHandCursor(this.handCursorEnabled);
            break;
        case "mouseover":
            if (this.domElement && this.cssEffects) {
                this.domElement.addClass("hover");
                this.recoverActive && this.domElement.addClass("active")
            }
            break;
        case "mouseout":
            if (this.domElement && this.cssEffects) {
                this.recoverActive = false;
                if (this.domElement.hasClass("active")) {
                    this.domElement.removeClass("active");
                    this.recoverActive =
                            true
                }
                this.domElement.removeClass("hover")
            }
            break;
        case "mousedown":
            this.domElement && this.cssEffects && this.domElement.addClass("active");
            break;
        case "mouseup":
            if (this.domElement && this.cssEffects) {
                this.domElement.removeClass("active");
                this.recoverActive = false
            }
            break
    }
    if (this.handlers[a])for (var c = 0, e = this.handlers[a].length; c < e; c++) {
        var f = this.handlers[a][c];
        if (typeof f == "function")f(this, d); else if (typeof f == "object" && f.length == 2)f[0][f[1]](this, d); else typeof f == "string" && window[f](this, d)
    }
}};
