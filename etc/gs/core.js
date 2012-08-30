// core.js?20120521.02.js

(function (a, d) {
    function b(h) {
        var l = P[h] = {}, n, p;
        h = h.split(/\s+/);
        n = 0;
        for (p = h.length; n < p; n++)l[h[n]] = true;
        return l
    }

    function c(h, l, n) {
        if (n === d && h.nodeType === 1) {
            n = "data-" + l.replace(Aa, "-$1").toLowerCase();
            n = h.getAttribute(n);
            if (typeof n === "string") {
                try {
                    n = n === "true" ? true : n === "false" ? false : n === "null" ? null : m.isNumeric(n) ? parseFloat(n) : wa.test(n) ? m.parseJSON(n) : n
                } catch (p) {
                }
                m.data(h, l, n)
            } else n = d
        }
        return n
    }

    function e(h) {
        for (var l in h)if (!(l === "data" && m.isEmptyObject(h[l])))if (l !== "toJSON")return false;
        return true
    }

    function f(h, l, n) {
        var p = l + "defer", u = l + "queue", z = l + "mark", D = m._data(h, p);
        if (D && (n === "queue" || !m._data(h, u)) && (n === "mark" || !m._data(h, z)))setTimeout(function () {
            if (!m._data(h, u) && !m._data(h, z)) {
                m.removeData(h, p, true);
                D.fire()
            }
        }, 0)
    }

    function j() {
        return false
    }

    function g() {
        return true
    }

    function k(h, l, n) {
        l = l || 0;
        if (m.isFunction(l))return m.grep(h, function (u, z) {
            return!!l.call(u, z, u) === n
        }); else if (l.nodeType)return m.grep(h, function (u) {
            return u === l === n
        }); else if (typeof l === "string") {
            var p = m.grep(h, function (u) {
                return u.nodeType ===
                        1
            });
            if (pb.test(l))return m.filter(l, p, !n); else l = m.filter(l, p)
        }
        return m.grep(h, function (u) {
            return m.inArray(u, l) >= 0 === n
        })
    }

    function o(h) {
        var l = eb.split(" ");
        h = h.createDocumentFragment();
        if (h.createElement)for (; l.length;)h.createElement(l.pop());
        return h
    }

    function s(h, l) {
        if (!(l.nodeType !== 1 || !m.hasData(h))) {
            var n, p, u;
            p = m._data(h);
            var z = m._data(l, p), D = p.events;
            if (D) {
                delete z.handle;
                z.events = {};
                for (n in D) {
                    p = 0;
                    for (u = D[n].length; p < u; p++)m.event.add(l, n + (D[n][p].namespace ? "." : "") + D[n][p].namespace, D[n][p],
                            D[n][p].data)
                }
            }
            if (z.data)z.data = m.extend({}, z.data)
        }
    }

    function q(h, l) {
        var n;
        if (l.nodeType === 1) {
            l.clearAttributes && l.clearAttributes();
            l.mergeAttributes && l.mergeAttributes(h);
            n = l.nodeName.toLowerCase();
            if (n === "object")l.outerHTML = h.outerHTML; else if (n === "input" && (h.type === "checkbox" || h.type === "radio")) {
                if (h.checked)l.defaultChecked = l.checked = h.checked;
                if (l.value !== h.value)l.value = h.value
            } else if (n === "option")l.selected = h.defaultSelected; else if (n === "input" || n === "textarea")l.defaultValue = h.defaultValue;
            l.removeAttribute(m.expando)
        }
    }

    function r(h) {
        return typeof h.getElementsByTagName !== "undefined" ? h.getElementsByTagName("*") : typeof h.querySelectorAll !== "undefined" ? h.querySelectorAll("*") : []
    }

    function v(h) {
        if (h.type === "checkbox" || h.type === "radio")h.defaultChecked = h.checked
    }

    function t(h) {
        var l = (h.nodeName || "").toLowerCase();
        if (l === "input")v(h); else l !== "script" && typeof h.getElementsByTagName !== "undefined" && m.grep(h.getElementsByTagName("input"), v)
    }

    function y(h, l) {
        l.src ? m.ajax({url:l.src, async:false,
            dataType:"script"}) : m.globalEval((l.text || l.textContent || l.innerHTML || "").replace(ac, "/*$0*/"));
        l.parentNode && l.parentNode.removeChild(l)
    }

    function E(h, l, n) {
        var p = l === "width" ? h.offsetWidth : h.offsetHeight, u = l === "width" ? Wb : Jb;
        if (p > 0) {
            n !== "border" && m.each(u, function () {
                n || (p -= parseFloat(m.css(h, "padding" + this)) || 0);
                if (n === "margin")p += parseFloat(m.css(h, n + this)) || 0; else p -= parseFloat(m.css(h, "border" + this + "Width")) || 0
            });
            return p + "px"
        }
        p = ab(h, l, l);
        if (p < 0 || p == null)p = h.style[l] || 0;
        p = parseFloat(p) || 0;
        n && m.each(u,
                function () {
                    p += parseFloat(m.css(h, "padding" + this)) || 0;
                    if (n !== "padding")p += parseFloat(m.css(h, "border" + this + "Width")) || 0;
                    if (n === "margin")p += parseFloat(m.css(h, n + this)) || 0
                });
        return p + "px"
    }

    function G(h) {
        return function (l, n) {
            if (typeof l !== "string") {
                n = l;
                l = "*"
            }
            if (m.isFunction(n))for (var p = l.toLowerCase().split(hb), u = 0, z = p.length, D, H; u < z; u++) {
                D = p[u];
                if (H = /^\+/.test(D))D = D.substr(1) || "*";
                D = h[D] = h[D] || [];
                D[H ? "unshift" : "push"](n)
            }
        }
    }

    function B(h, l, n, p, u, z) {
        u = u || l.dataTypes[0];
        z = z || {};
        z[u] = true;
        u = h[u];
        for (var D =
                0, H = u ? u.length : 0, R = h === Za, V; D < H && (R || !V); D++) {
            V = u[D](l, n, p);
            if (typeof V === "string")if (!R || z[V])V = d; else {
                l.dataTypes.unshift(V);
                V = B(h, l, n, p, V, z)
            }
        }
        if ((R || !V) && !z["*"])V = B(h, l, n, p, "*", z);
        return V
    }

    function N(h, l) {
        var n, p, u = m.ajaxSettings.flatOptions || {};
        for (n in l)if (l[n] !== d)(u[n] ? h : p || (p = {}))[n] = l[n];
        p && m.extend(true, h, p)
    }

    function ba(h, l, n, p) {
        if (m.isArray(l))m.each(l, function (z, D) {
            n || Kb.test(h) ? p(h, D) : ba(h + "[" + (typeof D === "object" || m.isArray(D) ? z : "") + "]", D, n, p)
        }); else if (!n && l != null && typeof l === "object")for (var u in l)ba(h +
                "[" + u + "]", l[u], n, p); else p(h, l)
    }

    function L() {
        try {
            return new a.XMLHttpRequest
        } catch (h) {
        }
    }

    function ja() {
        setTimeout(K, 0);
        return ib = m.now()
    }

    function K() {
        ib = d
    }

    function Z(h, l) {
        var n = {};
        m.each(Cb.concat.apply([], Cb.slice(0, l)), function () {
            n[this] = h
        });
        return n
    }

    function X(h) {
        if (!Ja[h]) {
            var l = W.body, n = m("<" + h + ">").appendTo(l), p = n.css("display");
            n.remove();
            if (p === "none" || p === "") {
                if (!Ea) {
                    Ea = W.createElement("iframe");
                    Ea.frameBorder = Ea.width = Ea.height = 0
                }
                l.appendChild(Ea);
                if (!qb || !Ea.createElement) {
                    qb = (Ea.contentWindow ||
                            Ea.contentDocument).document;
                    qb.write((W.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>");
                    qb.close()
                }
                n = qb.createElement(h);
                qb.body.appendChild(n);
                p = m.css(n, "display");
                l.removeChild(Ea)
            }
            Ja[h] = p
        }
        return Ja[h]
    }

    function da(h) {
        return m.isWindow(h) ? h : h.nodeType === 9 ? h.defaultView || h.parentWindow : false
    }

    var W = a.document,
            ra = a.navigator,
            Y = a.location,

            m = function () {

                function h() {
                    if (!l.isReady) {
                        try {
                            W.documentElement.doScroll("left")
                        } catch (I) {
                            setTimeout(h, 1);
                            return
                        }
                        l.ready()
                    }
                }

                var l = function (I, ha) {
                            return new l.fn.init(I, ha, u)
                        },
                        n = a.jQuery,
                        p = a.$,
                        u, z = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                        D = /\S/,
                        H = /^\s+/,
                        R = /\s+$/,
                        V = /\d/,
                        qa = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                        ca = /^[\],:{}\s]*$/,
                        sa = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                        ka = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                        Ia = /(?:^|:|,)(?:\s*\[)+/g,
                        Xa = /(webkit)[ \/]([\w.]+)/,
                        w = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                        A = /(msie) ([\w.]+)/,
                        J = /(mozilla)(?:.*? rv:([\w.]+))?/,
                        ea = /-([a-z]|[0-9])/ig,
                        aa = /^-ms-/,
                        ta = function (I, ha) {
                            return(ha + "").toUpperCase()
                        },
                        x = ra.userAgent,
                        F, M, O = Object.prototype.toString,
                        U = Object.prototype.hasOwnProperty,
                        T = Array.prototype.push,
                        na = Array.prototype.slice,
                        ga = String.prototype.trim,
                        xa = Array.prototype.indexOf,
                        Ba = {};
                l.fn = l.prototype = {
                    constructor:l,
                    init:function (I, ha, ia) {
                        var oa;
                        if (!I)return this;
                        if (I.nodeType) {
                            this.context = this[0] = I;
                            this.length = 1;
                            return this
                        }
                        if (I === "body" && !ha && W.body) {
                            this.context = W;
                            this[0] = W.body;
                            this.selector = I;
                            this.length = 1;
                            return this
                        }
                        if (typeof I === "string")if ((oa = I.charAt(0) === "<" && I.charAt(I.length - 1) === ">" && I.length >=
                                3 ? [null, I, null] : z.exec(I)) && (oa[1] || !ha))if (oa[1]) {
                            ia = (ha = ha instanceof l ? ha[0] : ha) ? ha.ownerDocument || ha : W;
                            if (I = qa.exec(I))if (l.isPlainObject(ha)) {
                                I = [W.createElement(I[1])];
                                l.fn.attr.call(I, ha, true)
                            } else I = [ia.createElement(I[1])]; else {
                                I = l.buildFragment([oa[1]], [ia]);
                                I = (I.cacheable ? l.clone(I.fragment) : I.fragment).childNodes
                            }
                            return l.merge(this, I)
                        } else {
                            if ((ha = W.getElementById(oa[2])) && ha.parentNode) {
                                if (ha.id !== oa[2])return ia.find(I);
                                this.length = 1;
                                this[0] = ha
                            }
                            this.context = W;
                            this.selector = I;
                            return this
                        } else return!ha ||
                                ha.jquery ? (ha || ia).find(I) : this.constructor(ha).find(I); else if (l.isFunction(I))return ia.ready(I);
                        if (I.selector !== d) {
                            this.selector = I.selector;
                            this.context = I.context
                        }
                        return l.makeArray(I, this)
                    }, selector:"", jquery:"1.7", length:0, size:function () {
                        return this.length
                    }, toArray:function () {
                        return na.call(this, 0)
                    }, get:function (I) {
                        return I == null ? this.toArray() : I < 0 ? this[this.length + I] : this[I]
                    }, pushStack:function (I, ha, ia) {
                        var oa = this.constructor();
                        l.isArray(I) ? T.apply(oa, I) : l.merge(oa, I);
                        oa.prevObject = this;
                        oa.context =
                                this.context;
                        if (ha === "find")oa.selector = this.selector + (this.selector ? " " : "") + ia; else if (ha)oa.selector = this.selector + "." + ha + "(" + ia + ")";
                        return oa
                    }, each:function (I, ha) {
                        return l.each(this, I, ha)
                    }, ready:function (I) {
                        l.bindReady();
                        F.add(I);
                        return this
                    }, eq:function (I) {
                        return I === -1 ? this.slice(I) : this.slice(I, +I + 1)
                    }, first:function () {
                        return this.eq(0)
                    }, last:function () {
                        return this.eq(-1)
                    }, slice:function () {
                        return this.pushStack(na.apply(this, arguments), "slice", na.call(arguments).join(","))
                    }, map:function (I) {
                        return this.pushStack(l.map(this,
                                function (ha, ia) {
                                    return I.call(ha, ia, ha)
                                }))
                    }, end:function () {
                        return this.prevObject || this.constructor(null)
                    },
                    push:T,
                    sort:[].sort,
                    splice:[].splice
                };

                l.fn.init.prototype = l.fn;

                l.extend = l.fn.extend = function () {
                    var I, ha, ia, oa, Ca, Ga = arguments[0] || {}, Sa = 1, Ta = arguments.length, rb = false;
                    if (typeof Ga === "boolean") {
                        rb = Ga;
                        Ga = arguments[1] || {};
                        Sa = 2
                    }
                    if (typeof Ga !== "object" && !l.isFunction(Ga))Ga = {};
                    if (Ta === Sa) {
                        Ga = this;
                        --Sa
                    }
                    for (; Sa < Ta; Sa++)if ((I = arguments[Sa]) != null)for (ha in I) {
                        ia = Ga[ha];
                        oa = I[ha];
                        if (Ga !== oa)if (rb && oa &&
                                (l.isPlainObject(oa) || (Ca = l.isArray(oa)))) {
                            if (Ca) {
                                Ca = false;
                                ia = ia && l.isArray(ia) ? ia : []
                            } else ia = ia && l.isPlainObject(ia) ? ia : {};
                            Ga[ha] = l.extend(rb, ia, oa)
                        } else if (oa !== d)Ga[ha] = oa
                    }
                    return Ga
                };
                l.extend({
                    noConflict:function (I) {
                        if (a.$ === l)a.$ = p;
                        if (I && a.jQuery === l)a.jQuery = n;
                        return l
                    }, isReady:false, readyWait:1, holdReady:function (I) {
                        if (I)l.readyWait++; else l.ready(true)
                    }, ready:function (I) {
                        if (I === true && !--l.readyWait || I !== true && !l.isReady) {
                            if (!W.body)return setTimeout(l.ready, 1);
                            l.isReady = true;
                            if (!(I !== true &&
                                    --l.readyWait > 0)) {
                                F.fireWith(W, [l]);
                                l.fn.trigger && l(W).trigger("ready").unbind("ready")
                            }
                        }
                    }, bindReady:function () {
                        if (!F) {
                            F = l.Callbacks("once memory");
                            if (W.readyState === "complete")return setTimeout(l.ready, 1);
                            if (W.addEventListener) {
                                W.addEventListener("DOMContentLoaded", M, false);
                                a.addEventListener("load", l.ready, false)
                            } else if (W.attachEvent) {
                                W.attachEvent("onreadystatechange", M);
                                a.attachEvent("onload", l.ready);
                                var I = false;
                                try {
                                    I = a.frameElement == null
                                } catch (ha) {
                                }
                                W.documentElement.doScroll && I && h()
                            }
                        }
                    }, isFunction:function (I) {
                        return l.type(I) ===
                                "function"
                    }, isArray:Array.isArray || function (I) {
                        return l.type(I) === "array"
                    }, isWindow:function (I) {
                        return I && typeof I === "object" && "setInterval"in I
                    }, isNumeric:function (I) {
                        return I != null && V.test(I) && !isNaN(I)
                    }, type:function (I) {
                        return I == null ? String(I) : Ba[O.call(I)] || "object"
                    }, isPlainObject:function (I) {
                        if (!I || l.type(I) !== "object" || I.nodeType || l.isWindow(I))return false;
                        try {
                            if (I.constructor && !U.call(I, "constructor") && !U.call(I.constructor.prototype, "isPrototypeOf"))return false
                        } catch (ha) {
                            return false
                        }
                        var ia;
                        for (ia in I);
                        return ia === d || U.call(I, ia)
                    }, isEmptyObject:function (I) {
                        for (var ha in I)return false;
                        return true
                    }, error:function (I) {
                        throw I;
                    }, parseJSON:function (I) {
                        if (typeof I !== "string" || !I)return null;
                        I = l.trim(I);
                        if (a.JSON && a.JSON.parse)return a.JSON.parse(I);
                        if (ca.test(I.replace(sa, "@").replace(ka, "]").replace(Ia, "")))return(new Function("return " + I))();
                        l.error("Invalid JSON: " + I)
                    }, parseXML:function (I) {
                        var ha, ia;
                        try {
                            if (a.DOMParser) {
                                ia = new DOMParser;
                                ha = ia.parseFromString(I, "text/xml")
                            } else {
                                ha = new ActiveXObject("Microsoft.XMLDOM");
                                ha.async = "false";
                                ha.loadXML(I)
                            }
                        } catch (oa) {
                            ha = d
                        }
                        if (!ha || !ha.documentElement || ha.getElementsByTagName("parsererror").length)l.error("Invalid XML: " + I);
                        return ha
                    }, noop:function () {
                    }, globalEval:function (I) {
                        if (I && D.test(I))(a.execScript || function (ha) {
                            a.eval.call(a, ha)
                        })(I)
                    }, camelCase:function (I) {
                        return I.replace(aa, "ms-").replace(ea, ta)
                    }, nodeName:function (I, ha) {
                        return I.nodeName && I.nodeName.toUpperCase() === ha.toUpperCase()
                    }, each:function (I, ha, ia) {
                        var oa, Ca = 0, Ga = I.length, Sa = Ga === d || l.isFunction(I);
                        if (ia)if (Sa)for (oa in I) {
                            if (ha.apply(I[oa],
                                    ia) === false)break
                        } else for (; Ca < Ga;) {
                            if (ha.apply(I[Ca++], ia) === false)break
                        } else if (Sa)for (oa in I) {
                            if (ha.call(I[oa], oa, I[oa]) === false)break
                        } else for (; Ca < Ga;)if (ha.call(I[Ca], Ca, I[Ca++]) === false)break;
                        return I
                    }, trim:ga ? function (I) {
                        return I == null ? "" : ga.call(I)
                    } : function (I) {
                        return I == null ? "" : I.toString().replace(H, "").replace(R, "")
                    }, makeArray:function (I, ha) {
                        var ia = ha || [];
                        if (I != null) {
                            var oa = l.type(I);
                            I.length == null || oa === "string" || oa === "function" || oa === "regexp" || l.isWindow(I) ? T.call(ia, I) : l.merge(ia, I)
                        }
                        return ia
                    },
                    inArray:function (I, ha, ia) {
                        var oa;
                        if (ha) {
                            if (xa)return xa.call(ha, I, ia);
                            oa = ha.length;
                            for (ia = ia ? ia < 0 ? Math.max(0, oa + ia) : ia : 0; ia < oa; ia++)if (ia in ha && ha[ia] === I)return ia
                        }
                        return-1
                    }, merge:function (I, ha) {
                        var ia = I.length, oa = 0;
                        if (typeof ha.length === "number")for (var Ca = ha.length; oa < Ca; oa++)I[ia++] = ha[oa]; else for (; ha[oa] !== d;)I[ia++] = ha[oa++];
                        I.length = ia;
                        return I
                    }, grep:function (I, ha, ia) {
                        var oa = [], Ca;
                        ia = !!ia;
                        for (var Ga = 0, Sa = I.length; Ga < Sa; Ga++) {
                            Ca = !!ha(I[Ga], Ga);
                            ia !== Ca && oa.push(I[Ga])
                        }
                        return oa
                    }, map:function (I, ha, ia) {
                        var oa, Ca, Ga = [], Sa = 0, Ta = I.length;
                        if (I instanceof l || Ta !== d && typeof Ta === "number" && (Ta > 0 && I[0] && I[Ta - 1] || Ta === 0 || l.isArray(I)))for (; Sa < Ta; Sa++) {
                            oa = ha(I[Sa], Sa, ia);
                            if (oa != null)Ga[Ga.length] = oa
                        } else for (Ca in I) {
                            oa = ha(I[Ca], Ca, ia);
                            if (oa != null)Ga[Ga.length] = oa
                        }
                        return Ga.concat.apply([], Ga)
                    }, guid:1, proxy:function (I, ha) {
                        if (typeof ha === "string") {
                            var ia = I[ha];
                            ha = I;
                            I = ia
                        }
                        if (!l.isFunction(I))return d;
                        var oa = na.call(arguments, 2);
                        ia = function () {
                            return I.apply(ha, oa.concat(na.call(arguments)))
                        };
                        ia.guid = I.guid =
                                I.guid || ia.guid || l.guid++;
                        return ia
                    }, access:function (I, ha, ia, oa, Ca, Ga) {
                        var Sa = I.length;
                        if (typeof ha === "object") {
                            for (var Ta in ha)l.access(I, Ta, ha[Ta], oa, Ca, ia);
                            return I
                        }
                        if (ia !== d) {
                            oa = !Ga && oa && l.isFunction(ia);
                            for (Ta = 0; Ta < Sa; Ta++)Ca(I[Ta], ha, oa ? ia.call(I[Ta], Ta, Ca(I[Ta], ha)) : ia, Ga);
                            return I
                        }
                        return Sa ? Ca(I[0], ha) : d
                    }, now:function () {
                        return(new Date).getTime()
                    }, uaMatch:function (I) {
                        I = I.toLowerCase();
                        I = Xa.exec(I) || w.exec(I) || A.exec(I) || I.indexOf("compatible") < 0 && J.exec(I) || [];
                        return{browser:I[1] || "", version:I[2] ||
                                "0"}
                    }, sub:function () {
                        function I(ia, oa) {
                            return new I.fn.init(ia, oa)
                        }

                        l.extend(true, I, this);
                        I.superclass = this;
                        I.fn = I.prototype = this();
                        I.fn.constructor = I;
                        I.sub = this.sub;
                        I.fn.init = function (ia, oa) {
                            if (oa && oa instanceof l && !(oa instanceof I))oa = I(oa);
                            return l.fn.init.call(this, ia, oa, ha)
                        };
                        I.fn.init.prototype = I.fn;
                        var ha = I(W);
                        return I
                    },
                    browser:{}
                });

                l.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (I, ha) {
                    Ba["[object " + ha + "]"] = ha.toLowerCase()
                });
                x = l.uaMatch(x);
                if (x.browser) {
                    l.browser[x.browser] =
                            true;
                    l.browser.version = x.version
                }
                if (l.browser.webkit)l.browser.safari = true;
                if (D.test("\u00a0")) {
                    H = /^[\s\xA0]+/;
                    R = /[\s\xA0]+$/
                }
                u = l(W);
                if (W.addEventListener)M = function () {
                    W.removeEventListener("DOMContentLoaded", M, false);
                    l.ready()
                }; else if (W.attachEvent)M = function () {
                    if (W.readyState === "complete") {
                        W.detachEvent("onreadystatechange", M);
                        l.ready()
                    }
                };
                typeof define === "function" && define.amd && define.amd.jQuery && define("jquery", [], function () {
                    return l
                });
                return l
            }(),

            P = {};

    m.Callbacks = function (h) {
        h = h ? P[h] || b(h) : {};
        var l = [], n = [], p, u, z, D, H, R = function (ca) {
            var sa, ka, Ia, Xa;
            sa = 0;
            for (ka = ca.length; sa < ka; sa++) {
                Ia = ca[sa];
                Xa = m.type(Ia);
                if (Xa === "array")R(Ia); else if (Xa === "function")if (!h.unique || !qa.has(Ia))l.push(Ia)
            }
        }, V = function (ca, sa) {
            sa = sa || [];
            p = !h.memory || [ca, sa];
            u = true;
            H = z || 0;
            z = 0;
            for (D = l.length; l && H < D; H++)if (l[H].apply(ca, sa) === false && h.stopOnFalse) {
                p = true;
                break
            }
            u = false;
            if (l)if (h.once)if (p === true)qa.disable(); else l = []; else if (n && n.length) {
                p = n.shift();
                qa.fireWith(p[0], p[1])
            }
        }, qa = {add:function () {
            if (l) {
                var ca = l.length;
                R(arguments);
                if (u)D = l.length; else if (p && p !== true) {
                    z = ca;
                    V(p[0], p[1])
                }
            }
            return this
        }, remove:function () {
            if (l)for (var ca = arguments, sa = 0, ka = ca.length; sa < ka; sa++)for (var Ia = 0; Ia < l.length; Ia++)if (ca[sa] === l[Ia]) {
                if (u)if (Ia <= D) {
                    D--;
                    Ia <= H && H--
                }
                l.splice(Ia--, 1);
                if (h.unique)break
            }
            return this
        }, has:function (ca) {
            if (l)for (var sa = 0, ka = l.length; sa < ka; sa++)if (ca === l[sa])return true;
            return false
        }, empty:function () {
            l = [];
            return this
        }, disable:function () {
            l = n = p = d;
            return this
        }, disabled:function () {
            return!l
        }, lock:function () {
            n =
                    d;
            if (!p || p === true)qa.disable();
            return this
        }, locked:function () {
            return!n
        }, fireWith:function (ca, sa) {
            if (n)if (u)h.once || n.push([ca, sa]); else h.once && p || V(ca, sa);
            return this
        }, fire:function () {
            qa.fireWith(this, arguments);
            return this
        }, fired:function () {
            return!!p
        }};
        return qa
    };

    var la = [].slice;

    m.extend({Deferred:function (h) {
        var l = m.Callbacks("once memory"), n = m.Callbacks("once memory"), p = m.Callbacks("memory"), u = "pending", z = {resolve:l, reject:n, notify:p},
                D = {
                    done:l.add, fail:n.add, progress:p.add, state:function () {
                        return u
                    },
                    isResolved:l.fired, isRejected:n.fired, then:function (V, qa, ca) {
                        H.done(V).fail(qa).progress(ca);
                        return this
                    }, always:function () {
                        return H.done.apply(H, arguments).fail.apply(H, arguments)
                    }, pipe:function (V, qa, ca) {
                        return m.Deferred(function (sa) {
                            m.each({done:[V, "resolve"], fail:[qa, "reject"], progress:[ca, "notify"]}, function (ka, Ia) {
                                var Xa = Ia[0], w = Ia[1], A;
                                m.isFunction(Xa) ? H[ka](function () {
                                    (A = Xa.apply(this, arguments)) && m.isFunction(A.promise) ? A.promise().then(sa.resolve, sa.reject, sa.notify) : sa[w + "With"](this ===
                                            H ? sa : this, [A])
                                }) : H[ka](sa[w])
                            })
                        }).promise()
                    }, promise:function (V) {
                        if (V == null)V = D; else for (var qa in D)V[qa] = D[qa];
                        return V
                    }
                },
                H = D.promise({}), R;
        for (R in z) {
            H[R] = z[R].fire;
            H[R + "With"] = z[R].fireWith
        }
        H.done(function () {
            u = "resolved"
        }, n.disable, p.lock).fail(function () {
                    u = "rejected"
                }, l.disable, p.lock);
        h && h.call(H, H);
        return H
    },
        when:function (h) {
            function l(qa) {
                return function (ca) {
                    p[qa] = arguments.length > 1 ? la.call(arguments, 0) : ca;
                    --H || R.resolveWith(R, p)
                }
            }

            function n(qa) {
                return function (ca) {
                    D[qa] = arguments.length >
                            1 ? la.call(arguments, 0) : ca;
                    R.notifyWith(V, D)
                }
            }

            var p = la.call(arguments, 0), u = 0, z = p.length, D = Array(z), H = z, R = z <= 1 && h && m.isFunction(h.promise) ? h : m.Deferred(), V = R.promise();
            if (z > 1) {
                for (; u < z; u++)if (p[u] && p[u].promise && m.isFunction(p[u].promise))p[u].promise().then(l(u), R.reject, n(u)); else--H;
                H || R.resolveWith(R, p)
            } else if (R !== h)R.resolveWith(R, z ? [h] : []);
            return V
        }});

    m.support = function () {
        var h = W.createElement("div"), l = W.documentElement, n, p, u, z, D, H, R, V;
        h.setAttribute("className", "t");
        h.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/><nav></nav>";
        n = h.getElementsByTagName("*");
        p = h.getElementsByTagName("a")[0];
        if (!n || !n.length || !p)return{};
        u = W.createElement("select");
        z = u.appendChild(W.createElement("option"));
        n = h.getElementsByTagName("input")[0];
        D = {leadingWhitespace:h.firstChild.nodeType === 3, tbody:!h.getElementsByTagName("tbody").length, htmlSerialize:!!h.getElementsByTagName("link").length, style:/top/.test(p.getAttribute("style")), hrefNormalized:p.getAttribute("href") === "/a", opacity:/^0.55/.test(p.style.opacity), cssFloat:!!p.style.cssFloat,
            unknownElems:!!h.getElementsByTagName("nav").length, checkOn:n.value === "on", optSelected:z.selected, getSetAttribute:h.className !== "t", enctype:!!W.createElement("form").enctype, submitBubbles:true, changeBubbles:true, focusinBubbles:false, deleteExpando:true, noCloneEvent:true, inlineBlockNeedsLayout:false, shrinkWrapBlocks:false, reliableMarginRight:true};
        n.checked = true;
        D.noCloneChecked = n.cloneNode(true).checked;
        u.disabled = true;
        D.optDisabled = !z.disabled;
        try {
            delete h.test
        } catch (qa) {
            D.deleteExpando = false
        }
        if (!h.addEventListener &&
                h.attachEvent && h.fireEvent) {
            h.attachEvent("onclick", function () {
                D.noCloneEvent = false
            });
            h.cloneNode(true).fireEvent("onclick")
        }
        n = W.createElement("input");
        n.value = "t";
        n.setAttribute("type", "radio");
        D.radioValue = n.value === "t";
        n.setAttribute("checked", "checked");
        h.appendChild(n);
        p = W.createDocumentFragment();
        p.appendChild(h.lastChild);
        D.checkClone = p.cloneNode(true).cloneNode(true).lastChild.checked;
        h.innerHTML = "";
        h.style.width = h.style.paddingLeft = "1px";
        H = W.getElementsByTagName("body")[0];
        R = W.createElement(H ?
                "div" : "body");
        p = {visibility:"hidden", width:0, height:0, border:0, margin:0, background:"none"};
        H && m.extend(p, {position:"absolute", left:"-999px", top:"-999px"});
        for (V in p)R.style[V] = p[V];
        R.appendChild(h);
        l = H || l;
        l.insertBefore(R, l.firstChild);
        D.appendChecked = n.checked;
        D.boxModel = h.offsetWidth === 2;
        if ("zoom"in h.style) {
            h.style.display = "inline";
            h.style.zoom = 1;
            D.inlineBlockNeedsLayout = h.offsetWidth === 2;
            h.style.display = "";
            h.innerHTML = "<div style='width:4px;'></div>";
            D.shrinkWrapBlocks = h.offsetWidth !== 2
        }
        h.innerHTML =
                "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
        p = h.getElementsByTagName("td");
        n = p[0].offsetHeight === 0;
        p[0].style.display = "";
        p[1].style.display = "none";
        D.reliableHiddenOffsets = n && p[0].offsetHeight === 0;
        h.innerHTML = "";
        if (W.defaultView && W.defaultView.getComputedStyle) {
            n = W.createElement("div");
            n.style.width = "0";
            n.style.marginRight = "0";
            h.appendChild(n);
            D.reliableMarginRight = (parseInt((W.defaultView.getComputedStyle(n, null) || {marginRight:0}).marginRight, 10) || 0) === 0
        }
        if (h.attachEvent)for (V in{submit:1,
            change:1, focusin:1}) {
            p = "on" + V;
            n = p in h;
            if (!n) {
                h.setAttribute(p, "return;");
                n = typeof h[p] === "function"
            }
            D[V + "Bubbles"] = n
        }
        m(function () {
            var ca, sa, ka, Ia;
            if (H = W.getElementsByTagName("body")[0]) {
                ca = W.createElement("div");
                ca.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
                H.insertBefore(ca, H.firstChild);
                R = W.createElement("div");
                R.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;visibility:hidden;border:0;";
                R.innerHTML = "<div style='position:absolute;top:0;left:0;width:1px;height:1px;margin:0;border:5px solid #000;padding:0;'><div></div></div><table style='position:absolute;top:0;left:0;width:1px;height:1px;margin:0;border:5px solid #000;padding:0;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
                ca.appendChild(R);
                sa = R.firstChild;
                ka = sa.firstChild;
                Ia = {doesNotAddBorder:ka.offsetTop !== 5, doesAddBorderForTableAndCells:sa.nextSibling.firstChild.firstChild.offsetTop === 5};
                ka.style.position = "fixed";
                ka.style.top = "20px";
                Ia.fixedPosition = ka.offsetTop === 20 || ka.offsetTop === 15;
                ka.style.position = ka.style.top = "";
                sa.style.overflow = "hidden";
                sa.style.position = "relative";
                Ia.subtractsBorderForOverflowNotVisible = ka.offsetTop === -5;
                Ia.doesNotIncludeMarginInBodyOffset = H.offsetTop !== 1;
                H.removeChild(ca);
                R = null;
                m.extend(D,
                        Ia)
            }
        });
        R.innerHTML = "";
        l.removeChild(R);
        R = p = u = z = H = n = h = n = null;
        return D
    }();

    m.boxModel = m.support.boxModel;
    var wa = /^(?:\{.*\}|\[.*\])$/, Aa = /([A-Z])/g;

    m.extend({cache:{}, uuid:0, expando:"jQuery" + (m.fn.jquery + Math.random()).replace(/\D/g, ""), noData:{embed:true, object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet:true}, hasData:function (h) {
        h = h.nodeType ? m.cache[h[m.expando]] : h[m.expando];
        return!!h && !e(h)
    }, data:function (h, l, n, p) {
        if (m.acceptData(h)) {
            var u, z = typeof l === "string", D = (u = h.nodeType) ? m.cache : h,
                    H = u ? h[m.expando] : h[m.expando] && m.expando, R = l === "events";
            if (!((!H || !D[H] || !R && !p && !D[H].data) && z && n === d)) {
                if (!H)if (u)h[m.expando] = H = ++m.uuid; else H = m.expando;
                if (!D[H]) {
                    D[H] = {};
                    if (!u)D[H].toJSON = m.noop
                }
                if (typeof l === "object" || typeof l === "function")if (p)D[H] = m.extend(D[H], l); else D[H].data = m.extend(D[H].data, l);
                u = h = D[H];
                if (!p) {
                    if (!h.data)h.data = {};
                    h = h.data
                }
                if (n !== d)h[m.camelCase(l)] = n;
                if (R && !h[l])return u.events;
                if (z) {
                    n = h[l];
                    if (n == null)n = h[m.camelCase(l)]
                } else n = h;
                return n
            }
        }
    }, removeData:function (h, l, n) {
        if (m.acceptData(h)) {
            var p, u, z, D = h.nodeType, H = D ? m.cache : h, R = D ? h[m.expando] : m.expando;
            if (H[R]) {
                if (l)if (p = n ? H[R] : H[R].data) {
                    if (!m.isArray(l))if (l in p)l = [l]; else {
                        l = m.camelCase(l);
                        l = l in p ? [l] : l.split(" ")
                    }
                    u = 0;
                    for (z = l.length; u < z; u++)delete p[l[u]];
                    if (!(n ? e : m.isEmptyObject)(p))return
                }
                if (!n) {
                    delete H[R].data;
                    if (!e(H[R]))return
                }
                if (m.support.deleteExpando || !H.setInterval)delete H[R]; else H[R] = null;
                if (D)if (m.support.deleteExpando)delete h[m.expando]; else if (h.removeAttribute)h.removeAttribute(m.expando);
                else h[m.expando] = null
            }
        }
    }, _data:function (h, l, n) {
        return m.data(h, l, n, true)
    }, acceptData:function (h) {
        if (h.nodeName) {
            var l = m.noData[h.nodeName.toLowerCase()];
            if (l)return!(l === true || h.getAttribute("classid") !== l)
        }
        return true
    }});
    m.fn.extend({data:function (h, l) {
        var n, p, u, z = null;
        if (typeof h === "undefined") {
            if (this.length) {
                z = m.data(this[0]);
                if (this[0].nodeType === 1 && !m._data(this[0], "parsedAttrs")) {
                    p = this[0].attributes;
                    for (var D = 0, H = p.length; D < H; D++) {
                        u = p[D].name;
                        if (u.indexOf("data-") === 0) {
                            u = m.camelCase(u.substring(5));
                            c(this[0], u, z[u])
                        }
                    }
                    m._data(this[0], "parsedAttrs", true)
                }
            }
            return z
        } else if (typeof h === "object")return this.each(function () {
            m.data(this, h)
        });
        n = h.split(".");
        n[1] = n[1] ? "." + n[1] : "";
        if (l === d) {
            z = this.triggerHandler("getData" + n[1] + "!", [n[0]]);
            if (z === d && this.length) {
                z = m.data(this[0], h);
                z = c(this[0], h, z)
            }
            return z === d && n[1] ? this.data(n[0]) : z
        } else return this.each(function () {
            var R = m(this), V = [n[0], l];
            R.triggerHandler("setData" + n[1] + "!", V);
            m.data(this, h, l);
            R.triggerHandler("changeData" + n[1] + "!", V)
        })
    }, removeData:function (h) {
        return this.each(function () {
            m.removeData(this,
                    h)
        })
    }});
    m.extend({_mark:function (h, l) {
        if (h) {
            l = (l || "fx") + "mark";
            m._data(h, l, (m._data(h, l) || 0) + 1)
        }
    }, _unmark:function (h, l, n) {
        if (h !== true) {
            n = l;
            l = h;
            h = false
        }
        if (l) {
            n = n || "fx";
            var p = n + "mark";
            if (h = h ? 0 : (m._data(l, p) || 1) - 1)m._data(l, p, h); else {
                m.removeData(l, p, true);
                f(l, n, "mark")
            }
        }
    }, queue:function (h, l, n) {
        var p;
        if (h) {
            l = (l || "fx") + "queue";
            p = m._data(h, l);
            if (n)if (!p || m.isArray(n))p = m._data(h, l, m.makeArray(n)); else p.push(n);
            return p || []
        }
    }, dequeue:function (h, l) {
        l = l || "fx";
        var n = m.queue(h, l), p = n.shift(), u = {};
        if (p === "inprogress")p =
                n.shift();
        if (p) {
            l === "fx" && n.unshift("inprogress");
            m._data(h, l + ".run", u);
            p.call(h, function () {
                m.dequeue(h, l)
            }, u)
        }
        if (!n.length) {
            m.removeData(h, l + "queue " + l + ".run", true);
            f(h, l, "queue")
        }
    }});
    m.fn.extend({queue:function (h, l) {
        if (typeof h !== "string") {
            l = h;
            h = "fx"
        }
        if (l === d)return m.queue(this[0], h);
        return this.each(function () {
            var n = m.queue(this, h, l);
            h === "fx" && n[0] !== "inprogress" && m.dequeue(this, h)
        })
    }, dequeue:function (h) {
        return this.each(function () {
            m.dequeue(this, h)
        })
    }, delay:function (h, l) {
        h = m.fx ? m.fx.speeds[h] ||
                h : h;
        l = l || "fx";
        return this.queue(l, function (n, p) {
            var u = setTimeout(n, h);
            p.stop = function () {
                clearTimeout(u)
            }
        })
    }, clearQueue:function (h) {
        return this.queue(h || "fx", [])
    }, promise:function (h, l) {
        function n() {
            --D || p.resolveWith(u, [u])
        }

        if (typeof h !== "string") {
            l = h;
            h = d
        }
        h = h || "fx";
        for (var p = m.Deferred(), u = this, z = u.length, D = 1, H = h + "defer", R = h + "queue", V = h + "mark", qa; z--;)if (qa = m.data(u[z], H, d, true) || (m.data(u[z], R, d, true) || m.data(u[z], V, d, true)) && m.data(u[z], H, m.Callbacks("once memory"), true)) {
            D++;
            qa.add(n)
        }
        n();
        return p.promise()
    }});
    var za = /[\n\t\r]/g, C = /\s+/, S = /\r/g, ua = /^(?:button|input)$/i, pa = /^(?:button|input|object|select|textarea)$/i, Q = /^a(?:rea)?$/i, fa = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, ma = m.support.getSetAttribute, va, ya, Fa;
    m.fn.extend({attr:function (h, l) {
        return m.access(this, h, l, true, m.attr)
    }, removeAttr:function (h) {
        return this.each(function () {
            m.removeAttr(this, h)
        })
    }, prop:function (h, l) {
        return m.access(this, h, l, true, m.prop)
    }, removeProp:function (h) {
        h =
                m.propFix[h] || h;
        return this.each(function () {
            try {
                this[h] = d;
                delete this[h]
            } catch (l) {
            }
        })
    }, addClass:function (h) {
        var l, n, p, u, z, D, H;
        if (m.isFunction(h))return this.each(function (R) {
            m(this).addClass(h.call(this, R, this.className))
        });
        if (h && typeof h === "string") {
            l = h.split(C);
            n = 0;
            for (p = this.length; n < p; n++) {
                u = this[n];
                if (u.nodeType === 1)if (!u.className && l.length === 1)u.className = h; else {
                    z = " " + u.className + " ";
                    D = 0;
                    for (H = l.length; D < H; D++)~z.indexOf(" " + l[D] + " ") || (z += l[D] + " ");
                    u.className = m.trim(z)
                }
            }
        }
        return this
    }, removeClass:function (h) {
        var l,
                n, p, u, z, D, H;
        if (m.isFunction(h))return this.each(function (R) {
            m(this).removeClass(h.call(this, R, this.className))
        });
        if (h && typeof h === "string" || h === d) {
            l = (h || "").split(C);
            n = 0;
            for (p = this.length; n < p; n++) {
                u = this[n];
                if (u.nodeType === 1 && u.className)if (h) {
                    z = (" " + u.className + " ").replace(za, " ");
                    D = 0;
                    for (H = l.length; D < H; D++)z = z.replace(" " + l[D] + " ", " ");
                    u.className = m.trim(z)
                } else u.className = ""
            }
        }
        return this
    }, toggleClass:function (h, l) {
        var n = typeof h, p = typeof l === "boolean";
        if (m.isFunction(h))return this.each(function (u) {
            m(this).toggleClass(h.call(this,
                    u, this.className, l), l)
        });
        return this.each(function () {
            if (n === "string")for (var u, z = 0, D = m(this), H = l, R = h.split(C); u = R[z++];) {
                H = p ? H : !D.hasClass(u);
                D[H ? "addClass" : "removeClass"](u)
            } else if (n === "undefined" || n === "boolean") {
                this.className && m._data(this, "__className__", this.className);
                this.className = this.className || h === false ? "" : m._data(this, "__className__") || ""
            }
        })
    }, hasClass:function (h) {
        h = " " + h + " ";
        for (var l = 0, n = this.length; l < n; l++)if (this[l].nodeType === 1 && (" " + this[l].className + " ").replace(za, " ").indexOf(h) >
                -1)return true;
        return false
    }, val:function (h) {
        var l, n, p, u = this[0];
        if (!arguments.length) {
            if (u) {
                if ((l = m.valHooks[u.nodeName.toLowerCase()] || m.valHooks[u.type]) && "get"in l && (n = l.get(u, "value")) !== d)return n;
                n = u.value;
                return typeof n === "string" ? n.replace(S, "") : n == null ? "" : n
            }
            return d
        }
        p = m.isFunction(h);
        return this.each(function (z) {
            var D = m(this);
            if (this.nodeType === 1) {
                z = p ? h.call(this, z, D.val()) : h;
                if (z == null)z = ""; else if (typeof z === "number")z += ""; else if (m.isArray(z))z = m.map(z, function (H) {
                    return H == null ? "" :
                            H + ""
                });
                l = m.valHooks[this.nodeName.toLowerCase()] || m.valHooks[this.type];
                if (!l || !("set"in l) || l.set(this, z, "value") === d)this.value = z
            }
        })
    }});
    m.extend({valHooks:{option:{get:function (h) {
        var l = h.attributes.value;
        return!l || l.specified ? h.value : h.text
    }}, select:{get:function (h) {
        var l, n, p = h.selectedIndex, u = [], z = h.options, D = h.type === "select-one";
        if (p < 0)return null;
        h = D ? p : 0;
        for (n = D ? p + 1 : z.length; h < n; h++) {
            l = z[h];
            if (l.selected && (m.support.optDisabled ? !l.disabled : l.getAttribute("disabled") === null) && (!l.parentNode.disabled ||
                    !m.nodeName(l.parentNode, "optgroup"))) {
                l = m(l).val();
                if (D)return l;
                u.push(l)
            }
        }
        if (D && !u.length && z.length)return m(z[p]).val();
        return u
    }, set:function (h, l) {
        var n = m.makeArray(l);
        m(h).find("option").each(function () {
            this.selected = m.inArray(m(this).val(), n) >= 0
        });
        if (!n.length)h.selectedIndex = -1;
        return n
    }}}, attrFn:{val:true, css:true, html:true, text:true, data:true, width:true, height:true, offset:true}, attr:function (h, l, n, p) {
        var u, z, D = h.nodeType;
        if (!h || D === 3 || D === 8 || D === 2)return d;
        if (p && l in m.attrFn)return m(h)[l](n);
        if (!("getAttribute"in h))return m.prop(h, l, n);
        if (p = D !== 1 || !m.isXMLDoc(h)) {
            l = l.toLowerCase();
            z = m.attrHooks[l] || (fa.test(l) ? ya : va)
        }
        if (n !== d)if (n === null) {
            m.removeAttr(h, l);
            return d
        } else if (z && "set"in z && p && (u = z.set(h, n, l)) !== d)return u; else {
            h.setAttribute(l, "" + n);
            return n
        } else if (z && "get"in z && p && (u = z.get(h, l)) !== null)return u; else {
            u = h.getAttribute(l);
            return u === null ? d : u
        }
    }, removeAttr:function (h, l) {
        var n, p, u, z, D = 0;
        if (h.nodeType === 1) {
            p = (l || "").split(C);
            for (z = p.length; D < z; D++) {
                u = p[D].toLowerCase();
                n = m.propFix[u] ||
                        u;
                m.attr(h, u, "");
                h.removeAttribute(ma ? u : n);
                if (fa.test(u) && n in h)h[n] = false
            }
        }
    }, attrHooks:{type:{set:function (h, l) {
        if (ua.test(h.nodeName) && h.parentNode)m.error("type property can't be changed"); else if (!m.support.radioValue && l === "radio" && m.nodeName(h, "input")) {
            var n = h.value;
            h.setAttribute("type", l);
            if (n)h.value = n;
            return l
        }
    }}, value:{get:function (h, l) {
        if (va && m.nodeName(h, "button"))return va.get(h, l);
        return l in h ? h.value : null
    }, set:function (h, l, n) {
        if (va && m.nodeName(h, "button"))return va.set(h, l, n);
        h.value =
                l
    }}}, propFix:{tabindex:"tabIndex", readonly:"readOnly", "for":"htmlFor", "class":"className", maxlength:"maxLength", cellspacing:"cellSpacing", cellpadding:"cellPadding", rowspan:"rowSpan", colspan:"colSpan", usemap:"useMap", frameborder:"frameBorder", contenteditable:"contentEditable"}, prop:function (h, l, n) {
        var p, u, z = h.nodeType;
        if (!h || z === 3 || z === 8 || z === 2)return d;
        if (z !== 1 || !m.isXMLDoc(h)) {
            l = m.propFix[l] || l;
            u = m.propHooks[l]
        }
        return n !== d ? u && "set"in u && (p = u.set(h, n, l)) !== d ? p : h[l] = n : u && "get"in u && (p = u.get(h, l)) !==
                null ? p : h[l]
    }, propHooks:{tabIndex:{get:function (h) {
        var l = h.getAttributeNode("tabindex");
        return l && l.specified ? parseInt(l.value, 10) : pa.test(h.nodeName) || Q.test(h.nodeName) && h.href ? 0 : d
    }}}});
    m.attrHooks.tabindex = m.propHooks.tabIndex;
    ya = {get:function (h, l) {
        var n, p = m.prop(h, l);
        return p === true || typeof p !== "boolean" && (n = h.getAttributeNode(l)) && n.nodeValue !== false ? l.toLowerCase() : d
    }, set:function (h, l, n) {
        if (l === false)m.removeAttr(h, n); else {
            l = m.propFix[n] || n;
            if (l in h)h[l] = true;
            h.setAttribute(n, n.toLowerCase())
        }
        return n
    }};
    if (!ma) {
        Fa = {name:true, id:true};
        va = m.valHooks.button = {get:function (h, l) {
            var n;
            return(n = h.getAttributeNode(l)) && (Fa[l] ? n.nodeValue !== "" : n.specified) ? n.nodeValue : d
        }, set:function (h, l, n) {
            var p = h.getAttributeNode(n);
            if (!p) {
                p = W.createAttribute(n);
                h.setAttributeNode(p)
            }
            return p.nodeValue = l + ""
        }};
        m.attrHooks.tabindex.set = va.set;
        m.each(["width", "height"], function (h, l) {
            m.attrHooks[l] = m.extend(m.attrHooks[l], {set:function (n, p) {
                if (p === "") {
                    n.setAttribute(l, "auto");
                    return p
                }
            }})
        });
        m.attrHooks.contenteditable = {get:va.get,
            set:function (h, l, n) {
                if (l === "")l = "false";
                va.set(h, l, n)
            }}
    }
    m.support.hrefNormalized || m.each(["href", "src", "width", "height"], function (h, l) {
        m.attrHooks[l] = m.extend(m.attrHooks[l], {get:function (n) {
            n = n.getAttribute(l, 2);
            return n === null ? d : n
        }})
    });
    if (!m.support.style)m.attrHooks.style = {get:function (h) {
        return h.style.cssText.toLowerCase() || d
    }, set:function (h, l) {
        return h.style.cssText = "" + l
    }};
    if (!m.support.optSelected)m.propHooks.selected = m.extend(m.propHooks.selected, {get:function () {
        return null
    }});
    if (!m.support.enctype)m.propFix.enctype =
            "encoding";
    m.support.checkOn || m.each(["radio", "checkbox"], function () {
        m.valHooks[this] = {get:function (h) {
            return h.getAttribute("value") === null ? "on" : h.value
        }}
    });
    m.each(["radio", "checkbox"], function () {
        m.valHooks[this] = m.extend(m.valHooks[this], {set:function (h, l) {
            if (m.isArray(l))return h.checked = m.inArray(m(h).val(), l) >= 0
        }})
    });
    var Ha = /^(?:textarea|input|select)$/i, Pa = /^([^\.]*)?(?:\.(.+))?$/, Qa = /\bhover(\.\S+)?/, sb = /^key/, wb = /^(?:mouse|contextmenu)|click/, fb = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, db =
            function (h) {
                if (h = fb.exec(h)) {
                    h[1] = (h[1] || "").toLowerCase();
                    h[3] = h[3] && RegExp("(?:^|\\s)" + h[3] + "(?:\\s|$)")
                }
                return h
            }, jb = function (h) {
        return m.event.special.hover ? h : h.replace(Qa, "mouseenter$1 mouseleave$1")
    };
    m.event = {add:function (h, l, n, p, u) {
        var z, D, H, R, V, qa, ca, sa, ka;
        if (!(h.nodeType === 3 || h.nodeType === 8 || !l || !n || !(z = m._data(h)))) {
            if (n.handler) {
                ca = n;
                n = ca.handler
            }
            if (!n.guid)n.guid = m.guid++;
            H = z.events;
            if (!H)z.events = H = {};
            D = z.handle;
            if (!D) {
                z.handle = D = function (Ia) {
                    return typeof m !== "undefined" && (!Ia || m.event.triggered !==
                            Ia.type) ? m.event.dispatch.apply(D.elem, arguments) : d
                };
                D.elem = h
            }
            l = jb(l).split(" ");
            for (z = 0; z < l.length; z++) {
                R = Pa.exec(l[z]) || [];
                V = R[1];
                qa = (R[2] || "").split(".").sort();
                ka = m.event.special[V] || {};
                V = (u ? ka.delegateType : ka.bindType) || V;
                ka = m.event.special[V] || {};
                R = m.extend({type:V, origType:R[1], data:p, handler:n, guid:n.guid, selector:u, namespace:qa.join(".")}, ca);
                if (u) {
                    R.quick = db(u);
                    if (!R.quick && m.expr.match.POS.test(u))R.isPositional = true
                }
                sa = H[V];
                if (!sa) {
                    sa = H[V] = [];
                    sa.delegateCount = 0;
                    if (!ka.setup || ka.setup.call(h,
                            p, qa, D) === false)if (h.addEventListener)h.addEventListener(V, D, false); else h.attachEvent && h.attachEvent("on" + V, D)
                }
                if (ka.add) {
                    ka.add.call(h, R);
                    if (!R.handler.guid)R.handler.guid = n.guid
                }
                u ? sa.splice(sa.delegateCount++, 0, R) : sa.push(R);
                m.event.global[V] = true
            }
            h = null
        }
    },

        global:{},

        remove:function (h, l, n, p) {
            var u = m.hasData(h) && m._data(h), z, D, H, R, V, qa, ca, sa, ka;
            if (u && (qa = u.events)) {
                l = jb(l || "").split(" ");
                for (z = 0; z < l.length; z++) {
                    D = Pa.exec(l[z]) || [];
                    H = D[1];
                    D = D[2];
                    if (!H) {
                        D = D ? "." + D : "";
                        for (V in qa)m.event.remove(h, V +
                                D, n, p);
                        return
                    }
                    ca = m.event.special[H] || {};
                    H = (p ? ca.delegateType : ca.bindType) || H;
                    sa = qa[H] || [];
                    R = sa.length;
                    D = D ? RegExp("(^|\\.)" + D.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                    if (n || D || p || ca.remove)for (V = 0; V < sa.length; V++) {
                        ka = sa[V];
                        if (!n || n.guid === ka.guid)if (!D || D.test(ka.namespace))if (!p || p === ka.selector || p === "**" && ka.selector) {
                            sa.splice(V--, 1);
                            ka.selector && sa.delegateCount--;
                            ca.remove && ca.remove.call(h, ka)
                        }
                    } else sa.length = 0;
                    if (sa.length === 0 && R !== sa.length) {
                        if (!ca.teardown || ca.teardown.call(h,
                                D) === false)m.removeEvent(h, H, u.handle);
                        delete qa[H]
                    }
                }
                if (m.isEmptyObject(qa)) {
                    if (l = u.handle)l.elem = null;
                    m.removeData(h, ["events", "handle"], true)
                }
            }
        },

        customEvent:{getData:true, setData:true, changeData:true},

        trigger:function (h, l, n, p) {
            if (!(n && (n.nodeType === 3 || n.nodeType === 8))) {
                var u = h.type || h, z = [], D, H, R, V;
                if (u.indexOf("!") >= 0) {
                    u = u.slice(0, -1);
                    D = true
                }
                if (u.indexOf(".") >= 0) {
                    z = u.split(".");
                    u = z.shift();
                    z.sort()
                }
                if (!((!n || m.event.customEvent[u]) && !m.event.global[u])) {
                    h = typeof h === "object" ? h[m.expando] ? h : new m.Event(u,
                            h) : new m.Event(u);
                    h.type = u;
                    h.isTrigger = true;
                    h.exclusive = D;
                    h.namespace = z.join(".");
                    h.namespace_re = h.namespace ? RegExp("(^|\\.)" + z.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                    z = u.indexOf(":") < 0 ? "on" + u : "";
                    if (p || !n)h.preventDefault();
                    if (n) {
                        h.result = d;
                        if (!h.target)h.target = n;
                        l = l != null ? m.makeArray(l) : [];
                        l.unshift(h);
                        D = m.event.special[u] || {};
                        if (!(D.trigger && D.trigger.apply(n, l) === false)) {
                            V = [
                                [n, D.bindType || u]
                            ];
                            if (!p && !D.noBubble && !m.isWindow(n)) {
                                R = D.delegateType || u;
                                H = null;
                                for (p = n.parentNode; p; p = p.parentNode) {
                                    V.push([p,
                                        R]);
                                    H = p
                                }
                                if (H && H === n.ownerDocument)V.push([H.defaultView || H.parentWindow || a, R])
                            }
                            for (H = 0; H < V.length; H++) {
                                p = V[H][0];
                                h.type = V[H][1];
                                (R = (m._data(p, "events") || {})[h.type] && m._data(p, "handle")) && R.apply(p, l);
                                (R = z && p[z]) && m.acceptData(p) && R.apply(p, l);
                                if (h.isPropagationStopped())break
                            }
                            h.type = u;
                            if (!h.isDefaultPrevented())if ((!D._default || D._default.apply(n.ownerDocument, l) === false) && !(u === "click" && m.nodeName(n, "a")) && m.acceptData(n))if (z && n[u] && (u !== "focus" && u !== "blur" || h.target.offsetWidth !== 0) && !m.isWindow(n)) {
                                if (H =
                                        n[z])n[z] = null;
                                m.event.triggered = u;
                                n[u]();
                                m.event.triggered = d;
                                if (H)n[z] = H
                            }
                            return h.result
                        }
                    } else {
                        n = m.cache;
                        for (H in n)n[H].events && n[H].events[u] && m.event.trigger(h, l, n[H].handle.elem, true)
                    }
                }
            }
        },

        dispatch:function (h) {
            h = m.event.fix(h || a.event);
            var l = (m._data(this, "events") || {})[h.type] || [], n = l.delegateCount, p = [].slice.call(arguments, 0), u = !h.exclusive && !h.namespace, z = (m.event.special[h.type] || {}).handle, D = [], H, R, V, qa, ca, sa, ka;
            p[0] = h;
            h.delegateTarget = this;
            if (n && !h.target.disabled && !(h.button && h.type ===
                    "click"))for (R = h.target; R != this; R = R.parentNode || this) {
                qa = {};
                ca = [];
                for (H = 0; H < n; H++) {
                    V = l[H];
                    sa = V.selector;
                    ka = qa[sa];
                    if (V.isPositional)ka = (ka || (qa[sa] = m(sa))).index(R) >= 0; else if (ka === d)ka = qa[sa] = V.quick ? (!V.quick[1] || R.nodeName.toLowerCase() === V.quick[1]) && (!V.quick[2] || R.id === V.quick[2]) && (!V.quick[3] || V.quick[3].test(R.className)) : m(R).is(sa);
                    ka && ca.push(V)
                }
                ca.length && D.push({elem:R, matches:ca})
            }
            l.length > n && D.push({elem:this, matches:l.slice(n)});
            for (H = 0; H < D.length && !h.isPropagationStopped(); H++) {
                n =
                        D[H];
                h.currentTarget = n.elem;
                for (l = 0; l < n.matches.length && !h.isImmediatePropagationStopped(); l++) {
                    V = n.matches[l];
                    if (u || !h.namespace && !V.namespace || h.namespace_re && h.namespace_re.test(V.namespace)) {
                        h.data = V.data;
                        h.handleObj = V;
                        V = (z || V.handler).apply(n.elem, p);
                        if (V !== d) {
                            h.result = V;
                            if (V === false) {
                                h.preventDefault();
                                h.stopPropagation()
                            }
                        }
                    }
                }
            }
            return h.result
        },

        props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks:{},
        keyHooks:{
            props:"char charCode key keyCode".split(" "),
            filter:function (h, l) {
                if (h.which == null)h.which = l.charCode != null ? l.charCode : l.keyCode;
                return h
            }
        },
        mouseHooks:{
            props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement wheelDelta".split(" "),
            filter:function (h, l) {
                var n, p, u = l.button, z = l.fromElement;
                if (h.pageX == null && l.clientX != null) {
                    n = h.target.ownerDocument || W;
                    p = n.documentElement;
                    n = n.body;
                    h.pageX = l.clientX + (p && p.scrollLeft || n && n.scrollLeft ||
                            0) - (p && p.clientLeft || n && n.clientLeft || 0);
                    h.pageY = l.clientY + (p && p.scrollTop || n && n.scrollTop || 0) - (p && p.clientTop || n && n.clientTop || 0)
                }
                if (!h.relatedTarget && z)h.relatedTarget = z === h.target ? l.toElement : z;
                if (!h.which && u !== d)h.which = u & 1 ? 1 : u & 2 ? 3 : u & 4 ? 2 : 0;
                return h
            }
        },
        fix:function (h) {
            if (h[m.expando])return h;
            var l, n, p = h, u = m.event.fixHooks[h.type] || {}, z = u.props ? this.props.concat(u.props) : this.props;
            h = m.Event(p);
            for (l = z.length; l;) {
                n = z[--l];
                h[n] = p[n]
            }
            if (!h.target)h.target = p.srcElement || W;
            if (h.target.nodeType === 3)h.target =
                    h.target.parentNode;
            if (h.metaKey === d)h.metaKey = h.ctrlKey;
            return u.filter ? u.filter(h, p) : h
        },
        special:{
            ready:{setup:m.bindReady}, focus:{delegateType:"focusin", noBubble:true}, blur:{delegateType:"focusout", noBubble:true}, beforeunload:{setup:function (h, l, n) {
                if (m.isWindow(this))this.onbeforeunload = n
            }, teardown:function (h, l) {
                if (this.onbeforeunload === l)this.onbeforeunload = null
            }}},
        simulate:function (h, l, n, p) {
            h = m.extend(new m.Event, n, {type:h, isSimulated:true, originalEvent:{}});
            p ? m.event.trigger(h, null, l) : m.event.dispatch.call(l,
                    h);
            h.isDefaultPrevented() && n.preventDefault()
        }
    };
    m.event.handle = m.event.dispatch;
    m.removeEvent = W.removeEventListener ? function (h, l, n) {
        h.removeEventListener && h.removeEventListener(l, n, false)
    } : function (h, l, n) {
        h.detachEvent && h.detachEvent("on" + l, n)
    };
    m.Event = function (h, l) {
        if (!(this instanceof m.Event))return new m.Event(h, l);
        if (h && h.type) {
            this.originalEvent = h;
            this.type = h.type;
            this.isDefaultPrevented = h.defaultPrevented || h.returnValue === false || h.getPreventDefault && h.getPreventDefault() ? g : j
        } else this.type =
                h;
        l && m.extend(this, l);
        this.timeStamp = h && h.timeStamp || m.now();
        this[m.expando] = true
    };
    m.Event.prototype = {preventDefault:function () {
        this.isDefaultPrevented = g;
        var h = this.originalEvent;
        if (h)if (h.preventDefault)h.preventDefault(); else h.returnValue = false
    }, stopPropagation:function () {
        this.isPropagationStopped = g;
        var h = this.originalEvent;
        if (h) {
            h.stopPropagation && h.stopPropagation();
            h.cancelBubble = true
        }
    }, stopImmediatePropagation:function () {
        this.isImmediatePropagationStopped = g;
        this.stopPropagation()
    }, isDefaultPrevented:j,
        isPropagationStopped:j, isImmediatePropagationStopped:j};
    m.each({mouseenter:"mouseover", mouseleave:"mouseout"}, function (h, l) {
        m.event.special[h] = m.event.special[l] = {delegateType:l, bindType:l, handle:function (n) {
            var p = n.relatedTarget, u = n.handleObj, z;
            if (!p || u.origType === n.type || p !== this && !m.contains(this, p)) {
                p = n.type;
                n.type = u.origType;
                z = u.handler.apply(this, arguments);
                n.type = p
            }
            return z
        }}
    });
    if (!m.support.submitBubbles)
        m.event.special.submit = {
            setup:function () {
                if (m.nodeName(this, "form"))return false;
                m.event.add(this,
                        "click._submit keypress._submit", function (h) {
                            h = h.target;
                            if ((h = m.nodeName(h, "input") || m.nodeName(h, "button") ? h.form : d) && !h._submit_attached) {
                                m.event.add(h, "submit._submit", function (l) {
                                    this.parentNode && m.event.simulate("submit", this.parentNode, l, true)
                                });
                                h._submit_attached = true
                            }
                        })
            }, teardown:function () {
                if (m.nodeName(this, "form"))return false;
                m.event.remove(this, "._submit")
            }
        };
    if (!m.support.changeBubbles)
        m.event.special.change = {
            setup:function () {
                if (Ha.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type ===
                            "radio") {
                        m.event.add(this, "propertychange._change", function (h) {
                            if (h.originalEvent.propertyName === "checked")this._just_changed = true
                        });
                        m.event.add(this, "click._change", function (h) {
                            if (this._just_changed) {
                                this._just_changed = false;
                                m.event.simulate("change", this, h, true)
                            }
                        })
                    }
                    return false
                }
                m.event.add(this, "beforeactivate._change", function (h) {
                    h = h.target;
                    if (Ha.test(h.nodeName) && !h._change_attached) {
                        m.event.add(h, "change._change", function (l) {
                            this.parentNode && !l.isSimulated && m.event.simulate("change", this.parentNode,
                                    l, true)
                        });
                        h._change_attached = true
                    }
                })
            }, handle:function (h) {
                var l = h.target;
                if (this !== l || h.isSimulated || h.isTrigger || l.type !== "radio" && l.type !== "checkbox")return h.handleObj.handler.apply(this, arguments)
            }, teardown:function () {
                m.event.remove(this, "._change");
                return Ha.test(this.nodeName)
            }};
    m.support.focusinBubbles || m.each({focus:"focusin", blur:"focusout"}, function (h, l) {
        var n = 0, p = function (u) {
            m.event.simulate(l, u.target, m.event.fix(u), true)
        };
        m.event.special[l] = {setup:function () {
            n++ === 0 && W.addEventListener(h,
                    p, true)
        }, teardown:function () {
            --n === 0 && W.removeEventListener(h, p, true)
        }}
    });
    m.fn.extend({on:function (h, l, n, p, u) {
        var z, D;
        if (typeof h === "object") {
            if (typeof l !== "string") {
                n = l;
                l = d
            }
            for (D in h)this.on(D, l, n, h[D], u);
            return this
        }
        if (n == null && p == null) {
            p = l;
            n = l = d
        } else if (p == null)if (typeof l === "string") {
            p = n;
            n = d
        } else {
            p = n;
            n = l;
            l = d
        }
        if (p === false)p = j; else if (!p)return this;
        if (u === 1) {
            z = p;
            p = function (H) {
                m().off(H);
                return z.apply(this, arguments)
            };
            p.guid = z.guid || (z.guid = m.guid++)
        }
        return this.each(function () {
            m.event.add(this,
                    h, p, n, l)
        })
    }, one:function (h, l, n, p) {
        return this.on.call(this, h, l, n, p, 1)
    }, off:function (h, l, n) {
        if (h && h.preventDefault && h.handleObj) {
            var p = h.handleObj;
            m(h.delegateTarget).off(p.namespace ? p.type + "." + p.namespace : p.type, p.selector, p.handler);
            return this
        }
        if (typeof h === "object") {
            for (p in h)this.off(p, l, h[p]);
            return this
        }
        if (l === false || typeof l === "function") {
            n = l;
            l = d
        }
        if (n === false)n = j;
        return this.each(function () {
            m.event.remove(this, h, n, l)
        })
    }, bind:function (h, l, n) {
        return this.on(h, null, l, n)
    }, unbind:function (h, l) {
        return this.off(h,
                null, l)
    }, live:function (h, l, n) {
        m(this.context).on(h, this.selector, l, n);
        return this
    }, die:function (h, l) {
        m(this.context).off(h, this.selector || "**", l);
        return this
    }, delegate:function (h, l, n, p) {
        return this.on(l, h, n, p)
    }, undelegate:function (h, l, n) {
        return arguments.length == 1 ? this.off(h, "**") : this.off(l, h, n)
    }, trigger:function (h, l) {
        return this.each(function () {
            m.event.trigger(h, l, this)
        })
    }, triggerHandler:function (h, l) {
        if (this[0])return m.event.trigger(h, l, this[0], true)
    }, toggle:function (h) {
        var l = arguments, n = h.guid ||
                m.guid++, p = 0, u = function (z) {
            var D = (m._data(this, "lastToggle" + h.guid) || 0) % p;
            m._data(this, "lastToggle" + h.guid, D + 1);
            z.preventDefault();
            return l[D].apply(this, arguments) || false
        };
        for (u.guid = n; p < l.length;)l[p++].guid = n;
        return this.click(u)
    }, hover:function (h, l) {
        return this.mouseenter(h).mouseleave(l || h)
    }});
    m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
            function (h, l) {
                m.fn[l] = function (n, p) {
                    if (p == null) {
                        p = n;
                        n = null
                    }
                    return arguments.length > 0 ? this.bind(l, n, p) : this.trigger(l)
                };
                if (m.attrFn)m.attrFn[l] = true;
                if (sb.test(l))m.event.fixHooks[l] = m.event.keyHooks;
                if (wb.test(l))m.event.fixHooks[l] = m.event.mouseHooks
            });
    (function () {
        function h(x, F, M, O, U, T) {
            U = 0;
            for (var na = O.length; U < na; U++) {
                var ga = O[U];
                if (ga) {
                    var xa = false;
                    for (ga = ga[x]; ga;) {
                        if (ga[p] === M) {
                            xa = O[ga.sizset];
                            break
                        }
                        if (ga.nodeType === 1 && !T) {
                            ga[p] = M;
                            ga.sizset = U
                        }
                        if (ga.nodeName.toLowerCase() === F) {
                            xa = ga;
                            break
                        }
                        ga =
                                ga[x]
                    }
                    O[U] = xa
                }
            }
        }

        function l(x, F, M, O, U, T) {
            U = 0;
            for (var na = O.length; U < na; U++) {
                var ga = O[U];
                if (ga) {
                    var xa = false;
                    for (ga = ga[x]; ga;) {
                        if (ga[p] === M) {
                            xa = O[ga.sizset];
                            break
                        }
                        if (ga.nodeType === 1) {
                            if (!T) {
                                ga[p] = M;
                                ga.sizset = U
                            }
                            if (typeof F !== "string") {
                                if (ga === F) {
                                    xa = true;
                                    break
                                }
                            } else if (ca.filter(F, [ga]).length > 0) {
                                xa = ga;
                                break
                            }
                        }
                        ga = ga[x]
                    }
                    O[U] = xa
                }
            }
        }

        var n = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, p = "sizcache" + (Math.random() + "").replace(".",
                ""), u = 0, z = Object.prototype.toString, D = false, H = true, R = /\\/g, V = /\r\n/g, qa = /\W/;
        [0, 0].sort(function () {
            H = false;
            return 0
        });
        var ca = function (x, F, M, O) {
            M = M || [];
            var U = F = F || W;
            if (F.nodeType !== 1 && F.nodeType !== 9)return[];
            if (!x || typeof x !== "string")return M;
            var T, na, ga, xa, Ba, I = true, ha = ca.isXML(F), ia = [], oa = x;
            do {
                n.exec("");
                if (T = n.exec(oa)) {
                    oa = T[3];
                    ia.push(T[1]);
                    if (T[2]) {
                        xa = T[3];
                        break
                    }
                }
            } while (T);
            if (ia.length > 1 && Ia.exec(x))if (ia.length === 2 && ka.relative[ia[0]])na = ta(ia[0] + ia[1], F, O); else for (na = ka.relative[ia[0]] ? [F] :
                    ca(ia.shift(), F); ia.length;) {
                x = ia.shift();
                if (ka.relative[x])x += ia.shift();
                na = ta(x, na, O)
            } else {
                if (!O && ia.length > 1 && F.nodeType === 9 && !ha && ka.match.ID.test(ia[0]) && !ka.match.ID.test(ia[ia.length - 1])) {
                    T = ca.find(ia.shift(), F, ha);
                    F = T.expr ? ca.filter(T.expr, T.set)[0] : T.set[0]
                }
                if (F) {
                    T = O ? {expr:ia.pop(), set:A(O)} : ca.find(ia.pop(), ia.length === 1 && (ia[0] === "~" || ia[0] === "+") && F.parentNode ? F.parentNode : F, ha);
                    na = T.expr ? ca.filter(T.expr, T.set) : T.set;
                    if (ia.length > 0)ga = A(na); else I = false;
                    for (; ia.length;) {
                        T = Ba = ia.pop();
                        if (ka.relative[Ba])T = ia.pop(); else Ba = "";
                        if (T == null)T = F;
                        ka.relative[Ba](ga, T, ha)
                    }
                } else ga = []
            }
            ga || (ga = na);
            ga || ca.error(Ba || x);
            if (z.call(ga) === "[object Array]")if (I)if (F && F.nodeType === 1)for (x = 0; ga[x] != null; x++) {
                if (ga[x] && (ga[x] === true || ga[x].nodeType === 1 && ca.contains(F, ga[x])))M.push(na[x])
            } else for (x = 0; ga[x] != null; x++)ga[x] && ga[x].nodeType === 1 && M.push(na[x]); else M.push.apply(M, ga); else A(ga, M);
            if (xa) {
                ca(xa, U, M, O);
                ca.uniqueSort(M)
            }
            return M
        };
        ca.uniqueSort = function (x) {
            if (ea) {
                D = H;
                x.sort(ea);
                if (D)for (var F =
                        1; F < x.length; F++)x[F] === x[F - 1] && x.splice(F--, 1)
            }
            return x
        };
        ca.matches = function (x, F) {
            return ca(x, null, null, F)
        };
        ca.matchesSelector = function (x, F) {
            return ca(F, null, null, [x]).length > 0
        };
        ca.find = function (x, F, M) {
            var O, U, T, na, ga, xa;
            if (!x)return[];
            U = 0;
            for (T = ka.order.length; U < T; U++) {
                ga = ka.order[U];
                if (na = ka.leftMatch[ga].exec(x)) {
                    xa = na[1];
                    na.splice(1, 1);
                    if (xa.substr(xa.length - 1) !== "\\") {
                        na[1] = (na[1] || "").replace(R, "");
                        O = ka.find[ga](na, F, M);
                        if (O != null) {
                            x = x.replace(ka.match[ga], "");
                            break
                        }
                    }
                }
            }
            O || (O = typeof F.getElementsByTagName !==
                    "undefined" ? F.getElementsByTagName("*") : []);
            return{set:O, expr:x}
        };
        ca.filter = function (x, F, M, O) {
            for (var U, T, na, ga, xa, Ba, I, ha, ia = x, oa = [], Ca = F, Ga = F && F[0] && ca.isXML(F[0]); x && F.length;) {
                for (na in ka.filter)if ((U = ka.leftMatch[na].exec(x)) != null && U[2]) {
                    Ba = ka.filter[na];
                    xa = U[1];
                    T = false;
                    U.splice(1, 1);
                    if (xa.substr(xa.length - 1) !== "\\") {
                        if (Ca === oa)oa = [];
                        if (ka.preFilter[na])if (U = ka.preFilter[na](U, Ca, M, oa, O, Ga)) {
                            if (U === true)continue
                        } else T = ga = true;
                        if (U)for (I = 0; (xa = Ca[I]) != null; I++)if (xa) {
                            ga = Ba(xa, U, I, Ca);
                            ha = O ^
                                    ga;
                            if (M && ga != null)if (ha)T = true; else Ca[I] = false; else if (ha) {
                                oa.push(xa);
                                T = true
                            }
                        }
                        if (ga !== d) {
                            M || (Ca = oa);
                            x = x.replace(ka.match[na], "");
                            if (!T)return[];
                            break
                        }
                    }
                }
                if (x === ia)if (T == null)ca.error(x); else break;
                ia = x
            }
            return Ca
        };
        ca.error = function (x) {
            throw"Syntax error, unrecognized expression: " + x;
        };
        var sa = ca.getText = function (x) {
            var F, M;
            F = x.nodeType;
            var O = "";
            if (F)if (F === 1)if (typeof x.textContent === "string")return x.textContent; else if (typeof x.innerText === "string")return x.innerText.replace(V, ""); else for (x = x.firstChild; x; x =
                    x.nextSibling)O += sa(x); else {
                if (F === 3 || F === 4)return x.nodeValue
            } else for (F = 0; M = x[F]; F++)if (M.nodeType !== 8)O += sa(M);
            return O
        }, ka = ca.selectors = {order:["ID", "NAME", "TAG"], match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/, ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/, TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/, CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
            POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/, PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/}, leftMatch:{}, attrMap:{"class":"className", "for":"htmlFor"}, attrHandle:{href:function (x) {
            return x.getAttribute("href")
        }, type:function (x) {
            return x.getAttribute("type")
        }}, relative:{"+":function (x, F) {
            var M = typeof F === "string", O = M && !qa.test(F);
            M = M && !O;
            if (O)F = F.toLowerCase();
            O = 0;
            for (var U = x.length, T; O < U; O++)if (T = x[O]) {
                for (; (T = T.previousSibling) && T.nodeType !==
                        1;);
                x[O] = M || T && T.nodeName.toLowerCase() === F ? T || false : T === F
            }
            M && ca.filter(F, x, true)
        }, ">":function (x, F) {
            var M, O = typeof F === "string", U = 0, T = x.length;
            if (O && !qa.test(F))for (F = F.toLowerCase(); U < T; U++) {
                if (M = x[U]) {
                    M = M.parentNode;
                    x[U] = M.nodeName.toLowerCase() === F ? M : false
                }
            } else {
                for (; U < T; U++)if (M = x[U])x[U] = O ? M.parentNode : M.parentNode === F;
                O && ca.filter(F, x, true)
            }
        }, "":function (x, F, M) {
            var O, U = u++, T = l;
            if (typeof F === "string" && !qa.test(F)) {
                O = F = F.toLowerCase();
                T = h
            }
            T("parentNode", F, U, x, O, M)
        }, "~":function (x, F, M) {
            var O,
                    U = u++, T = l;
            if (typeof F === "string" && !qa.test(F)) {
                O = F = F.toLowerCase();
                T = h
            }
            T("previousSibling", F, U, x, O, M)
        }}, find:{ID:function (x, F, M) {
            if (typeof F.getElementById !== "undefined" && !M)return(x = F.getElementById(x[1])) && x.parentNode ? [x] : []
        }, NAME:function (x, F) {
            if (typeof F.getElementsByName !== "undefined") {
                for (var M = [], O = F.getElementsByName(x[1]), U = 0, T = O.length; U < T; U++)O[U].getAttribute("name") === x[1] && M.push(O[U]);
                return M.length === 0 ? null : M
            }
        }, TAG:function (x, F) {
            if (typeof F.getElementsByTagName !== "undefined")return F.getElementsByTagName(x[1])
        }},
            preFilter:{CLASS:function (x, F, M, O, U, T) {
                x = " " + x[1].replace(R, "") + " ";
                if (T)return x;
                T = 0;
                for (var na; (na = F[T]) != null; T++)if (na)if (U ^ (na.className && (" " + na.className + " ").replace(/[\t\n\r]/g, " ").indexOf(x) >= 0))M || O.push(na); else if (M)F[T] = false;
                return false
            }, ID:function (x) {
                return x[1].replace(R, "")
            }, TAG:function (x) {
                return x[1].replace(R, "").toLowerCase()
            }, CHILD:function (x) {
                if (x[1] === "nth") {
                    x[2] || ca.error(x[0]);
                    x[2] = x[2].replace(/^\+|\s*/g, "");
                    var F = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(x[2] === "even" && "2n" ||
                            x[2] === "odd" && "2n+1" || !/\D/.test(x[2]) && "0n+" + x[2] || x[2]);
                    x[2] = F[1] + (F[2] || 1) - 0;
                    x[3] = F[3] - 0
                } else x[2] && ca.error(x[0]);
                x[0] = u++;
                return x
            }, ATTR:function (x, F, M, O, U, T) {
                F = x[1] = x[1].replace(R, "");
                if (!T && ka.attrMap[F])x[1] = ka.attrMap[F];
                x[4] = (x[4] || x[5] || "").replace(R, "");
                if (x[2] === "~=")x[4] = " " + x[4] + " ";
                return x
            }, PSEUDO:function (x, F, M, O, U) {
                if (x[1] === "not")if ((n.exec(x[3]) || "").length > 1 || /^\w/.test(x[3]))x[3] = ca(x[3], null, null, F); else {
                    x = ca.filter(x[3], F, M, true ^ U);
                    M || O.push.apply(O, x);
                    return false
                } else if (ka.match.POS.test(x[0]) ||
                        ka.match.CHILD.test(x[0]))return true;
                return x
            }, POS:function (x) {
                x.unshift(true);
                return x
            }}, filters:{enabled:function (x) {
                return x.disabled === false && x.type !== "hidden"
            }, disabled:function (x) {
                return x.disabled === true
            }, checked:function (x) {
                return x.checked === true
            }, selected:function (x) {
                return x.selected === true
            }, parent:function (x) {
                return!!x.firstChild
            }, empty:function (x) {
                return!x.firstChild
            }, has:function (x, F, M) {
                return!!ca(M[3], x).length
            }, header:function (x) {
                return/h\d/i.test(x.nodeName)
            }, text:function (x) {
                var F =
                        x.getAttribute("type"), M = x.type;
                return x.nodeName.toLowerCase() === "input" && "text" === M && (F === M || F === null)
            }, radio:function (x) {
                return x.nodeName.toLowerCase() === "input" && "radio" === x.type
            }, checkbox:function (x) {
                return x.nodeName.toLowerCase() === "input" && "checkbox" === x.type
            }, file:function (x) {
                return x.nodeName.toLowerCase() === "input" && "file" === x.type
            }, password:function (x) {
                return x.nodeName.toLowerCase() === "input" && "password" === x.type
            }, submit:function (x) {
                var F = x.nodeName.toLowerCase();
                return(F === "input" ||
                        F === "button") && "submit" === x.type
            }, image:function (x) {
                return x.nodeName.toLowerCase() === "input" && "image" === x.type
            }, reset:function (x) {
                var F = x.nodeName.toLowerCase();
                return(F === "input" || F === "button") && "reset" === x.type
            }, button:function (x) {
                var F = x.nodeName.toLowerCase();
                return F === "input" && "button" === x.type || F === "button"
            }, input:function (x) {
                return/input|select|textarea|button/i.test(x.nodeName)
            }, focus:function (x) {
                return x === x.ownerDocument.activeElement
            }}, setFilters:{first:function (x, F) {
                return F === 0
            }, last:function (x, F, M, O) {
                return F === O.length - 1
            }, even:function (x, F) {
                return F % 2 === 0
            }, odd:function (x, F) {
                return F % 2 === 1
            }, lt:function (x, F, M) {
                return F < M[3] - 0
            }, gt:function (x, F, M) {
                return F > M[3] - 0
            }, nth:function (x, F, M) {
                return M[3] - 0 === F
            }, eq:function (x, F, M) {
                return M[3] - 0 === F
            }}, filter:{PSEUDO:function (x, F, M, O) {
                var U = F[1], T = ka.filters[U];
                if (T)return T(x, M, F, O); else if (U === "contains")return(x.textContent || x.innerText || sa([x]) || "").indexOf(F[3]) >= 0; else if (U === "not") {
                    F = F[3];
                    M = 0;
                    for (O = F.length; M < O; M++)if (F[M] === x)return false;
                    return true
                } else ca.error(U)
            },
                CHILD:function (x, F) {
                    var M, O, U, T, na, ga;
                    M = F[1];
                    ga = x;
                    switch (M) {
                        case "only":
                        case "first":
                            for (; ga = ga.previousSibling;)if (ga.nodeType === 1)return false;
                            if (M === "first")return true;
                            ga = x;
                        case "last":
                            for (; ga = ga.nextSibling;)if (ga.nodeType === 1)return false;
                            return true;
                        case "nth":
                            M = F[2];
                            O = F[3];
                            if (M === 1 && O === 0)return true;
                            U = F[0];
                            if ((T = x.parentNode) && (T[p] !== U || !x.nodeIndex)) {
                                na = 0;
                                for (ga = T.firstChild; ga; ga = ga.nextSibling)if (ga.nodeType === 1)ga.nodeIndex = ++na;
                                T[p] = U
                            }
                            ga = x.nodeIndex - O;
                            return M === 0 ? ga === 0 : ga % M === 0 &&
                                    ga / M >= 0
                    }
                }, ID:function (x, F) {
                    return x.nodeType === 1 && x.getAttribute("id") === F
                }, TAG:function (x, F) {
                    return F === "*" && x.nodeType === 1 || !!x.nodeName && x.nodeName.toLowerCase() === F
                }, CLASS:function (x, F) {
                    return(" " + (x.className || x.getAttribute("class")) + " ").indexOf(F) > -1
                }, ATTR:function (x, F) {
                    var M = F[1];
                    M = ca.attr ? ca.attr(x, M) : ka.attrHandle[M] ? ka.attrHandle[M](x) : x[M] != null ? x[M] : x.getAttribute(M);
                    var O = M + "", U = F[2], T = F[4];
                    return M == null ? U === "!=" : !U && ca.attr ? M != null : U === "=" ? O === T : U === "*=" ? O.indexOf(T) >= 0 : U === "~=" ?
                            (" " + O + " ").indexOf(T) >= 0 : !T ? O && M !== false : U === "!=" ? O !== T : U === "^=" ? O.indexOf(T) === 0 : U === "$=" ? O.substr(O.length - T.length) === T : U === "|=" ? O === T || O.substr(0, T.length + 1) === T + "-" : false
                }, POS:function (x, F, M, O) {
                    var U = ka.setFilters[F[2]];
                    if (U)return U(x, M, F, O)
                }}}, Ia = ka.match.POS, Xa = function (x, F) {
            return"\\" + (F - 0 + 1)
        };
        for (var w in ka.match) {
            ka.match[w] = RegExp(ka.match[w].source + /(?![^\[]*\])(?![^\(]*\))/.source);
            ka.leftMatch[w] = RegExp(/(^(?:.|\r|\n)*?)/.source + ka.match[w].source.replace(/\\(\d+)/g, Xa))
        }
        var A = function (x, F) {
            x = Array.prototype.slice.call(x, 0);
            if (F) {
                F.push.apply(F, x);
                return F
            }
            return x
        };
        try {
            Array.prototype.slice.call(W.documentElement.childNodes, 0)
        } catch (J) {
            A = function (x, F) {
                var M = 0, O = F || [];
                if (z.call(x) === "[object Array]")Array.prototype.push.apply(O, x); else if (typeof x.length === "number")for (var U = x.length; M < U; M++)O.push(x[M]); else for (; x[M]; M++)O.push(x[M]);
                return O
            }
        }
        var ea, aa;
        if (W.documentElement.compareDocumentPosition)ea = function (x, F) {
            if (x === F) {
                D = true;
                return 0
            }
            if (!x.compareDocumentPosition || !F.compareDocumentPosition)return x.compareDocumentPosition ?
                    -1 : 1;
            return x.compareDocumentPosition(F) & 4 ? -1 : 1
        }; else {
            ea = function (x, F) {
                if (x === F) {
                    D = true;
                    return 0
                } else if (x.sourceIndex && F.sourceIndex)return x.sourceIndex - F.sourceIndex;
                var M, O, U = [], T = [];
                M = x.parentNode;
                O = F.parentNode;
                var na = M;
                if (M === O)return aa(x, F); else if (M) {
                    if (!O)return 1
                } else return-1;
                for (; na;) {
                    U.unshift(na);
                    na = na.parentNode
                }
                for (na = O; na;) {
                    T.unshift(na);
                    na = na.parentNode
                }
                M = U.length;
                O = T.length;
                for (na = 0; na < M && na < O; na++)if (U[na] !== T[na])return aa(U[na], T[na]);
                return na === M ? aa(x, T[na], -1) : aa(U[na],
                        F, 1)
            };
            aa = function (x, F, M) {
                if (x === F)return M;
                for (x = x.nextSibling; x;) {
                    if (x === F)return-1;
                    x = x.nextSibling
                }
                return 1
            }
        }
        (function () {
            var x = W.createElement("div"), F = "script" + (new Date).getTime(), M = W.documentElement;
            x.innerHTML = "<a name='" + F + "'/>";
            M.insertBefore(x, M.firstChild);
            if (W.getElementById(F)) {
                ka.find.ID = function (O, U, T) {
                    if (typeof U.getElementById !== "undefined" && !T)return(U = U.getElementById(O[1])) ? U.id === O[1] || typeof U.getAttributeNode !== "undefined" && U.getAttributeNode("id").nodeValue === O[1] ? [U] : d : []
                };
                ka.filter.ID = function (O, U) {
                    var T = typeof O.getAttributeNode !== "undefined" && O.getAttributeNode("id");
                    return O.nodeType === 1 && T && T.nodeValue === U
                }
            }
            M.removeChild(x);
            M = x = null
        })();
        (function () {
            var x = W.createElement("div");
            x.appendChild(W.createComment(""));
            if (x.getElementsByTagName("*").length > 0)ka.find.TAG = function (F, M) {
                var O = M.getElementsByTagName(F[1]);
                if (F[1] === "*") {
                    for (var U = [], T = 0; O[T]; T++)O[T].nodeType === 1 && U.push(O[T]);
                    O = U
                }
                return O
            };
            x.innerHTML = "<a href='#'></a>";
            if (x.firstChild && typeof x.firstChild.getAttribute !==
                    "undefined" && x.firstChild.getAttribute("href") !== "#")ka.attrHandle.href = function (F) {
                return F.getAttribute("href", 2)
            };
            x = null
        })();
        W.querySelectorAll && function () {
            var x = ca, F = W.createElement("div");
            F.innerHTML = "<p class='TEST'></p>";
            if (!(F.querySelectorAll && F.querySelectorAll(".TEST").length === 0)) {
                ca = function (O, U, T, na) {
                    U = U || W;
                    if (!na && !ca.isXML(U)) {
                        var ga = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(O);
                        if (ga && (U.nodeType === 1 || U.nodeType === 9))if (ga[1])return A(U.getElementsByTagName(O), T); else if (ga[2] && ka.find.CLASS &&
                                U.getElementsByClassName)return A(U.getElementsByClassName(ga[2]), T);
                        if (U.nodeType === 9) {
                            if (O === "body" && U.body)return A([U.body], T); else if (ga && ga[3]) {
                                var xa = U.getElementById(ga[3]);
                                if (xa && xa.parentNode) {
                                    if (xa.id === ga[3])return A([xa], T)
                                } else return A([], T)
                            }
                            try {
                                return A(U.querySelectorAll(O), T)
                            } catch (Ba) {
                            }
                        } else if (U.nodeType === 1 && U.nodeName.toLowerCase() !== "object") {
                            ga = U;
                            var I = (xa = U.getAttribute("id")) || "__sizzle__", ha = U.parentNode, ia = /^\s*[+~]/.test(O);
                            if (xa)I = I.replace(/'/g, "\\$&"); else U.setAttribute("id",
                                    I);
                            if (ia && ha)U = U.parentNode;
                            try {
                                if (!ia || ha)return A(U.querySelectorAll("[id='" + I + "'] " + O), T)
                            } catch (oa) {
                            } finally {
                                xa || ga.removeAttribute("id")
                            }
                        }
                    }
                    return x(O, U, T, na)
                };
                for (var M in x)ca[M] = x[M];
                F = null
            }
        }();
        (function () {
            var x = W.documentElement, F = x.matchesSelector || x.mozMatchesSelector || x.webkitMatchesSelector || x.msMatchesSelector;
            if (F) {
                var M = !F.call(W.createElement("div"), "div"), O = false;
                try {
                    F.call(W.documentElement, "[test!='']:sizzle")
                } catch (U) {
                    O = true
                }
                ca.matchesSelector = function (T, na) {
                    na = na.replace(/\=\s*([^'"\]]*)\s*\]/g,
                            "='$1']");
                    if (!ca.isXML(T))try {
                        if (O || !ka.match.PSEUDO.test(na) && !/!=/.test(na)) {
                            var ga = F.call(T, na);
                            if (ga || !M || T.document && T.document.nodeType !== 11)return ga
                        }
                    } catch (xa) {
                    }
                    return ca(na, null, null, [T]).length > 0
                }
            }
        })();
        (function () {
            var x = W.createElement("div");
            x.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (!(!x.getElementsByClassName || x.getElementsByClassName("e").length === 0)) {
                x.lastChild.className = "e";
                if (x.getElementsByClassName("e").length !== 1) {
                    ka.order.splice(1, 0, "CLASS");
                    ka.find.CLASS =
                            function (F, M, O) {
                                if (typeof M.getElementsByClassName !== "undefined" && !O)return M.getElementsByClassName(F[1])
                            };
                    x = null
                }
            }
        })();
        ca.contains = W.documentElement.contains ? function (x, F) {
            return x !== F && (x.contains ? x.contains(F) : true)
        } : W.documentElement.compareDocumentPosition ? function (x, F) {
            return!!(x.compareDocumentPosition(F) & 16)
        } : function () {
            return false
        };
        ca.isXML = function (x) {
            return(x = (x ? x.ownerDocument || x : 0).documentElement) ? x.nodeName !== "HTML" : false
        };
        var ta = function (x, F, M) {
            var O, U = [], T = "";
            for (F = F.nodeType ? [F] :
                    F; O = ka.match.PSEUDO.exec(x);) {
                T += O[0];
                x = x.replace(ka.match.PSEUDO, "")
            }
            x = ka.relative[x] ? x + "*" : x;
            O = 0;
            for (var na = F.length; O < na; O++)ca(x, F[O], U, M);
            return ca.filter(T, U)
        };
        ca.attr = m.attr;
        ca.selectors.attrMap = {};
        m.find = ca;
        m.expr = ca.selectors;
        m.expr[":"] = m.expr.filters;
        m.unique = ca.uniqueSort;
        m.text = ca.getText;
        m.isXMLDoc = ca.isXML;
        m.contains = ca.contains
    })();
    var kb = /Until$/, bc = /^(?:parents|prevUntil|prevAll)/, cc = /,/, pb = /^.[^:#\[\.,]*$/, dc = Array.prototype.slice, Lb = m.expr.match.POS, ec = {children:true, contents:true,
        next:true, prev:true};
    m.fn.extend({find:function (h) {
        var l = this, n, p;
        if (typeof h !== "string")return m(h).filter(function () {
            n = 0;
            for (p = l.length; n < p; n++)if (m.contains(l[n], this))return true
        });
        var u = this.pushStack("", "find", h), z, D, H;
        n = 0;
        for (p = this.length; n < p; n++) {
            z = u.length;
            m.find(h, this[n], u);
            if (n > 0)for (D = z; D < u.length; D++)for (H = 0; H < z; H++)if (u[H] === u[D]) {
                u.splice(D--, 1);
                break
            }
        }
        return u
    }, has:function (h) {
        var l = m(h);
        return this.filter(function () {
            for (var n = 0, p = l.length; n < p; n++)if (m.contains(this, l[n]))return true
        })
    },
        not:function (h) {
            return this.pushStack(k(this, h, false), "not", h)
        }, filter:function (h) {
            return this.pushStack(k(this, h, true), "filter", h)
        }, is:function (h) {
            return!!h && (typeof h === "string" ? Lb.test(h) ? m(h, this.context).index(this[0]) >= 0 : m.filter(h, this).length > 0 : this.filter(h).length > 0)
        }, closest:function (h, l) {
            var n = [], p, u, z = this[0];
            if (m.isArray(h)) {
                for (u = 1; z && z.ownerDocument && z !== l;) {
                    for (p = 0; p < h.length; p++)m(z).is(h[p]) && n.push({selector:h[p], elem:z, level:u});
                    z = z.parentNode;
                    u++
                }
                return n
            }
            var D = Lb.test(h) || typeof h !==
                    "string" ? m(h, l || this.context) : 0;
            p = 0;
            for (u = this.length; p < u; p++)for (z = this[p]; z;)if (D ? D.index(z) > -1 : m.find.matchesSelector(z, h)) {
                n.push(z);
                break
            } else {
                z = z.parentNode;
                if (!z || !z.ownerDocument || z === l || z.nodeType === 11)break
            }
            n = n.length > 1 ? m.unique(n) : n;
            return this.pushStack(n, "closest", h)
        }, index:function (h) {
            if (!h)return this[0] && this[0].parentNode ? this.prevAll().length : -1;
            if (typeof h === "string")return m.inArray(this[0], m(h));
            return m.inArray(h.jquery ? h[0] : h, this)
        }, add:function (h, l) {
            var n = typeof h === "string" ?
                    m(h, l) : m.makeArray(h && h.nodeType ? [h] : h), p = m.merge(this.get(), n);
            return this.pushStack(!n[0] || !n[0].parentNode || n[0].parentNode.nodeType === 11 || !p[0] || !p[0].parentNode || p[0].parentNode.nodeType === 11 ? p : m.unique(p))
        }, andSelf:function () {
            return this.add(this.prevObject)
        }});
    m.each({parent:function (h) {
                return(h = h.parentNode) && h.nodeType !== 11 ? h : null
            }, parents:function (h) {
                return m.dir(h, "parentNode")
            }, parentsUntil:function (h, l, n) {
                return m.dir(h, "parentNode", n)
            }, next:function (h) {
                return m.nth(h, 2, "nextSibling")
            },
                prev:function (h) {
                    return m.nth(h, 2, "previousSibling")
                }, nextAll:function (h) {
                    return m.dir(h, "nextSibling")
                }, prevAll:function (h) {
                    return m.dir(h, "previousSibling")
                }, nextUntil:function (h, l, n) {
                    return m.dir(h, "nextSibling", n)
                }, prevUntil:function (h, l, n) {
                    return m.dir(h, "previousSibling", n)
                }, siblings:function (h) {
                    return m.sibling(h.parentNode.firstChild, h)
                }, children:function (h) {
                    return m.sibling(h.firstChild)
                }, contents:function (h) {
                    return m.nodeName(h, "iframe") ? h.contentDocument || h.contentWindow.document : m.makeArray(h.childNodes)
                }},
            function (h, l) {
                m.fn[h] = function (n, p) {
                    var u = m.map(this, l, n), z = dc.call(arguments);
                    kb.test(h) || (p = n);
                    if (p && typeof p === "string")u = m.filter(p, u);
                    u = this.length > 1 && !ec[h] ? m.unique(u) : u;
                    if ((this.length > 1 || cc.test(p)) && bc.test(h))u = u.reverse();
                    return this.pushStack(u, h, z.join(","))
                }
            });
    m.extend({filter:function (h, l, n) {
        if (n)h = ":not(" + h + ")";
        return l.length === 1 ? m.find.matchesSelector(l[0], h) ? [l[0]] : [] : m.find.matches(h, l)
    }, dir:function (h, l, n) {
        var p = [];
        for (h = h[l]; h && h.nodeType !== 9 && (n === d || h.nodeType !== 1 || !m(h).is(n));) {
            h.nodeType ===
                    1 && p.push(h);
            h = h[l]
        }
        return p
    }, nth:function (h, l, n) {
        l = l || 1;
        for (var p = 0; h; h = h[n])if (h.nodeType === 1 && ++p === l)break;
        return h
    }, sibling:function (h, l) {
        for (var n = []; h; h = h.nextSibling)h.nodeType === 1 && h !== l && n.push(h);
        return n
    }});
    var eb = "abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video", Mb = / jQuery\d+="(?:\d+|null)"/g, Nb = /^\s+/, Xb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, Db = /<([\w:]+)/,
            Yb = /<tbody/i, fc = /<|&#?\w+;/, Ob = /<(?:script|style)/i, xb = /<(?:script|object|embed|option|style)/i, gc = RegExp("<(?:" + eb.replace(" ", "|") + ")", "i"), Zb = /checked\s*(?:[^=]|=\s*.checked.)/i, Pb = /\/(java|ecma)script/i, ac = /^\s*<!(?:\[CDATA\[|\-\-)/, bb = {option:[1, "<select multiple='multiple'>", "</select>"], legend:[1, "<fieldset>", "</fieldset>"], thead:[1, "<table>", "</table>"], tr:[2, "<table><tbody>", "</tbody></table>"], td:[3, "<table><tbody><tr>", "</tr></tbody></table>"], col:[2, "<table><tbody></tbody><colgroup>",
                "</colgroup></table>"], area:[1, "<map>", "</map>"], _default:[0, "", ""]}, hc = o(W);
    bb.optgroup = bb.option;
    bb.tbody = bb.tfoot = bb.colgroup = bb.caption = bb.thead;
    bb.th = bb.td;
    if (!m.support.htmlSerialize)bb._default = [1, "div<div>", "</div>"];
    m.fn.extend({text:function (h) {
        if (m.isFunction(h))return this.each(function (l) {
            var n = m(this);
            n.text(h.call(this, l, n.text()))
        });
        if (typeof h !== "object" && h !== d)return this.empty().append((this[0] && this[0].ownerDocument || W).createTextNode(h));
        return m.text(this)
    }, wrapAll:function (h) {
        if (m.isFunction(h))return this.each(function (n) {
            m(this).wrapAll(h.call(this,
                    n))
        });
        if (this[0]) {
            var l = m(h, this[0].ownerDocument).eq(0).clone(true);
            this[0].parentNode && l.insertBefore(this[0]);
            l.map(function () {
                for (var n = this; n.firstChild && n.firstChild.nodeType === 1;)n = n.firstChild;
                return n
            }).append(this)
        }
        return this
    }, wrapInner:function (h) {
        if (m.isFunction(h))return this.each(function (l) {
            m(this).wrapInner(h.call(this, l))
        });
        return this.each(function () {
            var l = m(this), n = l.contents();
            n.length ? n.wrapAll(h) : l.append(h)
        })
    }, wrap:function (h) {
        return this.each(function () {
            m(this).wrapAll(h)
        })
    },
        unwrap:function () {
            return this.parent().each(function () {
                m.nodeName(this, "body") || m(this).replaceWith(this.childNodes)
            }).end()
        }, append:function () {
            return this.domManip(arguments, true, function (h) {
                this.nodeType === 1 && this.appendChild(h)
            })
        }, prepend:function () {
            return this.domManip(arguments, true, function (h) {
                this.nodeType === 1 && this.insertBefore(h, this.firstChild)
            })
        }, before:function () {
            if (this[0] && this[0].parentNode)return this.domManip(arguments, false, function (l) {
                this.parentNode.insertBefore(l, this)
            }); else if (arguments.length) {
                var h =
                        m(arguments[0]);
                h.push.apply(h, this.toArray());
                return this.pushStack(h, "before", arguments)
            }
        }, after:function () {
            if (this[0] && this[0].parentNode)return this.domManip(arguments, false, function (l) {
                this.parentNode.insertBefore(l, this.nextSibling)
            }); else if (arguments.length) {
                var h = this.pushStack(this, "after", arguments);
                h.push.apply(h, m(arguments[0]).toArray());
                return h
            }
        }, remove:function (h, l) {
            for (var n = 0, p; (p = this[n]) != null; n++)if (!h || m.filter(h, [p]).length) {
                if (!l && p.nodeType === 1) {
                    m.cleanData(p.getElementsByTagName("*"));
                    m.cleanData([p])
                }
                p.parentNode && p.parentNode.removeChild(p)
            }
            return this
        }, empty:function () {
            for (var h = 0, l; (l = this[h]) != null; h++)for (l.nodeType === 1 && m.cleanData(l.getElementsByTagName("*")); l.firstChild;)l.removeChild(l.firstChild);
            return this
        }, clone:function (h, l) {
            h = h == null ? false : h;
            l = l == null ? h : l;
            return this.map(function () {
                return m.clone(this, h, l)
            })
        }, html:function (h) {
            if (h === d)return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(Mb, "") : null; else if (typeof h === "string" && !Ob.test(h) && (m.support.leadingWhitespace ||
                    !Nb.test(h)) && !bb[(Db.exec(h) || ["", ""])[1].toLowerCase()]) {
                h = h.replace(Xb, "<$1></$2>");
                try {
                    for (var l = 0, n = this.length; l < n; l++)if (this[l].nodeType === 1) {
                        m.cleanData(this[l].getElementsByTagName("*"));
                        this[l].innerHTML = h
                    }
                } catch (p) {
                    this.empty().append(h)
                }
            } else m.isFunction(h) ? this.each(function (u) {
                var z = m(this);
                z.html(h.call(this, u, z.html()))
            }) : this.empty().append(h);
            return this
        }, replaceWith:function (h) {
            if (this[0] && this[0].parentNode) {
                if (m.isFunction(h))return this.each(function (l) {
                    var n = m(this), p = n.html();
                    n.replaceWith(h.call(this, l, p))
                });
                if (typeof h !== "string")h = m(h).detach();
                return this.each(function () {
                    var l = this.nextSibling, n = this.parentNode;
                    m(this).remove();
                    l ? m(l).before(h) : m(n).append(h)
                })
            } else return this.length ? this.pushStack(m(m.isFunction(h) ? h() : h), "replaceWith", h) : this
        }, detach:function (h) {
            return this.remove(h, true)
        }, domManip:function (h, l, n) {
            var p, u, z, D = h[0], H = [];
            if (!m.support.checkClone && arguments.length === 3 && typeof D === "string" && Zb.test(D))return this.each(function () {
                m(this).domManip(h,
                        l, n, true)
            });
            if (m.isFunction(D))return this.each(function (qa) {
                var ca = m(this);
                h[0] = D.call(this, qa, l ? ca.html() : d);
                ca.domManip(h, l, n)
            });
            if (this[0]) {
                p = D && D.parentNode;
                p = m.support.parentNode && p && p.nodeType === 11 && p.childNodes.length === this.length ? {fragment:p} : m.buildFragment(h, this, H);
                z = p.fragment;
                if (u = z.childNodes.length === 1 ? z = z.firstChild : z.firstChild) {
                    l = l && m.nodeName(u, "tr");
                    u = 0;
                    for (var R = this.length, V = R - 1; u < R; u++)n.call(l ? m.nodeName(this[u], "table") ? this[u].getElementsByTagName("tbody")[0] || this[u].appendChild(this[u].ownerDocument.createElement("tbody")) :
                            this[u] : this[u], p.cacheable || R > 1 && u < V ? m.clone(z, true, true) : z)
                }
                H.length && m.each(H, y)
            }
            return this
        }});
    m.buildFragment = function (h, l, n) {
        var p, u, z, D, H = h[0];
        if (l && l[0])D = l[0].ownerDocument || l[0];
        D.createDocumentFragment || (D = W);
        if (h.length === 1 && typeof H === "string" && H.length < 512 && D === W && H.charAt(0) === "<" && !xb.test(H) && (m.support.checkClone || !Zb.test(H)) && !m.support.unknownElems && gc.test(H)) {
            u = true;
            if ((z = m.fragments[H]) && z !== 1)p = z
        }
        if (!p) {
            p = D.createDocumentFragment();
            m.clean(h, D, p, n)
        }
        if (u)m.fragments[H] = z ? p :
                1;
        return{fragment:p, cacheable:u}
    };
    m.fragments = {};
    m.each({appendTo:"append", prependTo:"prepend", insertBefore:"before", insertAfter:"after", replaceAll:"replaceWith"}, function (h, l) {
        m.fn[h] = function (n) {
            var p = [];
            n = m(n);
            var u = this.length === 1 && this[0].parentNode;
            if (u && u.nodeType === 11 && u.childNodes.length === 1 && n.length === 1) {
                n[l](this[0]);
                return this
            } else {
                u = 0;
                for (var z = n.length; u < z; u++) {
                    var D = (u > 0 ? this.clone(true) : this).get();
                    m(n[u])[l](D);
                    p = p.concat(D)
                }
                return this.pushStack(p, h, n.selector)
            }
        }
    });
    m.extend({clone:function (h, l, n) {
        var p = h.cloneNode(true), u, z, D;
        if ((!m.support.noCloneEvent || !m.support.noCloneChecked) && (h.nodeType === 1 || h.nodeType === 11) && !m.isXMLDoc(h)) {
            q(h, p);
            u = r(h);
            z = r(p);
            for (D = 0; u[D]; ++D)z[D] && q(u[D], z[D])
        }
        if (l) {
            s(h, p);
            if (n) {
                u = r(h);
                z = r(p);
                for (D = 0; u[D]; ++D)s(u[D], z[D])
            }
        }
        return p
    }, clean:function (h, l, n, p) {
        l = l || W;
        if (typeof l.createElement === "undefined")l = l.ownerDocument || l[0] && l[0].ownerDocument || W;
        for (var u = [], z, D = 0, H; (H = h[D]) != null; D++) {
            if (typeof H === "number")H += "";
            if (H) {
                if (typeof H === "string")if (fc.test(H)) {
                    H =
                            H.replace(Xb, "<$1></$2>");
                    z = (Db.exec(H) || ["", ""])[1].toLowerCase();
                    var R = bb[z] || bb._default, V = R[0], qa = l.createElement("div");
                    l === W ? hc.appendChild(qa) : o(l).appendChild(qa);
                    for (qa.innerHTML = R[1] + H + R[2]; V--;)qa = qa.lastChild;
                    if (!m.support.tbody) {
                        V = Yb.test(H);
                        R = z === "table" && !V ? qa.firstChild && qa.firstChild.childNodes : R[1] === "<table>" && !V ? qa.childNodes : [];
                        for (z = R.length - 1; z >= 0; --z)m.nodeName(R[z], "tbody") && !R[z].childNodes.length && R[z].parentNode.removeChild(R[z])
                    }
                    !m.support.leadingWhitespace && Nb.test(H) &&
                    qa.insertBefore(l.createTextNode(Nb.exec(H)[0]), qa.firstChild);
                    H = qa.childNodes
                } else H = l.createTextNode(H);
                var ca;
                if (!m.support.appendChecked)if (H[0] && typeof(ca = H.length) === "number")for (z = 0; z < ca; z++)t(H[z]); else t(H);
                if (H.nodeType)u.push(H); else u = m.merge(u, H)
            }
        }
        if (n) {
            h = function (sa) {
                return!sa.type || Pb.test(sa.type)
            };
            for (D = 0; u[D]; D++)if (p && m.nodeName(u[D], "script") && (!u[D].type || u[D].type.toLowerCase() === "text/javascript"))p.push(u[D].parentNode ? u[D].parentNode.removeChild(u[D]) : u[D]); else {
                if (u[D].nodeType ===
                        1) {
                    l = m.grep(u[D].getElementsByTagName("script"), h);
                    u.splice.apply(u, [D + 1, 0].concat(l))
                }
                n.appendChild(u[D])
            }
        }
        return u
    }, cleanData:function (h) {
        for (var l, n, p = m.cache, u = m.event.special, z = m.support.deleteExpando, D = 0, H; (H = h[D]) != null; D++)if (!(H.nodeName && m.noData[H.nodeName.toLowerCase()]))if (n = H[m.expando]) {
            if ((l = p[n]) && l.events) {
                for (var R in l.events)u[R] ? m.event.remove(H, R) : m.removeEvent(H, R, l.handle);
                if (l.handle)l.handle.elem = null
            }
            if (z)delete H[m.expando]; else H.removeAttribute && H.removeAttribute(m.expando);
            delete p[n]
        }
    }});
    var Qb = /alpha\([^)]*\)/i, mc = /opacity=([^)]*)/, nc = /([A-Z]|^ms)/g, ic = /^-?\d+(?:px)?$/i, lb = /^-?\d/, Va = /^([\-+])=([\-+.\de]+)/, Ra = {position:"absolute", visibility:"hidden", display:"block"}, Wb = ["Left", "Right"], Jb = ["Top", "Bottom"], ab, gb, tb;
    m.fn.css = function (h, l) {
        if (arguments.length === 2 && l === d)return this;
        return m.access(this, h, l, true, function (n, p, u) {
            return u !== d ? m.style(n, p, u) : m.css(n, p)
        })
    };
    m.extend({cssHooks:{opacity:{get:function (h, l) {
        if (l) {
            var n = ab(h, "opacity", "opacity");
            return n === "" ?
                    "1" : n
        } else return h.style.opacity
    }}}, cssNumber:{fillOpacity:true, fontWeight:true, lineHeight:true, opacity:true, orphans:true, widows:true, zIndex:true, zoom:true}, cssProps:{"float":m.support.cssFloat ? "cssFloat" : "styleFloat"}, style:function (h, l, n, p) {
        if (!(!h || h.nodeType === 3 || h.nodeType === 8 || !h.style)) {
            var u, z = m.camelCase(l), D = h.style, H = m.cssHooks[z];
            l = m.cssProps[z] || z;
            if (n !== d) {
                p = typeof n;
                if (p === "string" && (u = Va.exec(n))) {
                    n = +(u[1] + 1) * +u[2] + parseFloat(m.css(h, l));
                    p = "number"
                }
                if (!(n == null || p === "number" && isNaN(n))) {
                    if (p ===
                            "number" && !m.cssNumber[z])n += "px";
                    if (!H || !("set"in H) || (n = H.set(h, n)) !== d)try {
                        D[l] = n
                    } catch (R) {
                    }
                }
            } else {
                if (H && "get"in H && (u = H.get(h, false, p)) !== d)return u;
                return D[l]
            }
        }
    }, css:function (h, l, n) {
        var p, u;
        l = m.camelCase(l);
        u = m.cssHooks[l];
        l = m.cssProps[l] || l;
        if (l === "cssFloat")l = "float";
        if (u && "get"in u && (p = u.get(h, true, n)) !== d)return p; else if (ab)return ab(h, l)
    }, swap:function (h, l, n) {
        var p = {};
        for (var u in l) {
            p[u] = h.style[u];
            h.style[u] = l[u]
        }
        n.call(h);
        for (u in l)h.style[u] = p[u]
    }});
    m.curCSS = m.css;
    m.each(["height",
        "width"], function (h, l) {
        m.cssHooks[l] = {get:function (n, p, u) {
            var z;
            if (p) {
                if (n.offsetWidth !== 0)return E(n, l, u); else m.swap(n, Ra, function () {
                    z = E(n, l, u)
                });
                return z
            }
        }, set:function (n, p) {
            if (ic.test(p)) {
                p = parseFloat(p);
                if (p >= 0)return p + "px"
            } else return p
        }}
    });
    if (!m.support.opacity)m.cssHooks.opacity = {get:function (h, l) {
        return mc.test((l && h.currentStyle ? h.currentStyle.filter : h.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : l ? "1" : ""
    }, set:function (h, l) {
        var n = h.style, p = h.currentStyle, u = m.isNumeric(l) ? "alpha(opacity=" +
                l * 100 + ")" : "", z = p && p.filter || n.filter || "";
        n.zoom = 1;
        if (l >= 1 && m.trim(z.replace(Qb, "")) === "") {
            n.removeAttribute("filter");
            if (p && !p.filter)return
        }
        n.filter = Qb.test(z) ? z.replace(Qb, u) : z + " " + u
    }};
    m(function () {
        if (!m.support.reliableMarginRight)m.cssHooks.marginRight = {get:function (h, l) {
            var n;
            m.swap(h, {display:"inline-block"}, function () {
                n = l ? ab(h, "margin-right", "marginRight") : h.style.marginRight
            });
            return n
        }}
    });
    if (W.defaultView && W.defaultView.getComputedStyle)gb = function (h, l) {
        var n, p;
        l = l.replace(nc, "-$1").toLowerCase();
        if (!(p = h.ownerDocument.defaultView))return d;
        if (p = p.getComputedStyle(h, null)) {
            n = p.getPropertyValue(l);
            if (n === "" && !m.contains(h.ownerDocument.documentElement, h))n = m.style(h, l)
        }
        return n
    };
    if (W.documentElement.currentStyle)tb = function (h, l) {
        var n, p, u = h.currentStyle && h.currentStyle[l], z = h.style;
        if (u === null && z && (n = z[l]))u = n;
        if (!ic.test(u) && lb.test(u)) {
            n = z.left;
            if (p = h.runtimeStyle && h.runtimeStyle.left)h.runtimeStyle.left = h.currentStyle.left;
            z.left = l === "fontSize" ? "1em" : u || 0;
            u = z.pixelLeft + "px";
            z.left = n;
            if (p)h.runtimeStyle.left =
                    p
        }
        return u === "" ? "auto" : u
    };
    ab = gb || tb;
    if (m.expr && m.expr.filters) {
        m.expr.filters.hidden = function (h) {
            var l = h.offsetHeight;
            return h.offsetWidth === 0 && l === 0 || !m.support.reliableHiddenOffsets && (h.style && h.style.display || m.css(h, "display")) === "none"
        };
        m.expr.filters.visible = function (h) {
            return!m.expr.filters.hidden(h)
        }
    }
    var yb = /%20/g, Kb = /\[\]$/, ub = /\r?\n/g, Ua = /#.*$/, zb = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, Eb = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
            Wa = /^(?:GET|HEAD)$/, Fb = /^\/\//, Da = /\?/, vb = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, $a = /^(?:select|textarea)/i, hb = /\s+/, jc = /([?&])_=[^&]*/, Na = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, La = m.fn.load, Za = {}, $b = {}, mb, nb, Gb = ["*/"] + ["*"];
    try {
        mb = Y.href
    } catch (pc) {
        mb = W.createElement("a");
        mb.href = "";
        mb = mb.href
    }
    nb = Na.exec(mb.toLowerCase()) || [];
    m.fn.extend({load:function (h, l, n) {
        if (typeof h !== "string" && La)return La.apply(this, arguments); else if (!this.length)return this;
        var p = h.indexOf(" ");
        if (p >=
                0) {
            var u = h.slice(p, h.length);
            h = h.slice(0, p)
        }
        p = "GET";
        if (l)if (m.isFunction(l)) {
            n = l;
            l = d
        } else if (typeof l === "object") {
            l = m.param(l, m.ajaxSettings.traditional);
            p = "POST"
        }
        var z = this;
        m.ajax({url:h, type:p, dataType:"html", data:l, complete:function (D, H, R) {
            R = D.responseText;
            if (D.isResolved()) {
                D.done(function (V) {
                    R = V
                });
                z.html(u ? m("<div>").append(R.replace(vb, "")).find(u) : R)
            }
            n && z.each(n, [R, H, D])
        }});
        return this
    }, serialize:function () {
        return m.param(this.serializeArray())
    }, serializeArray:function () {
        return this.map(function () {
            return this.elements ?
                    m.makeArray(this.elements) : this
        }).filter(function () {
                    return this.name && !this.disabled && (this.checked || $a.test(this.nodeName) || Eb.test(this.type))
                }).map(function (h, l) {
                    var n = m(this).val();
                    return n == null ? null : m.isArray(n) ? m.map(n, function (p) {
                        return{name:l.name, value:p.replace(ub, "\r\n")}
                    }) : {name:l.name, value:n.replace(ub, "\r\n")}
                }).get()
    }});
    m.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (h, l) {
        m.fn[l] = function (n) {
            return this.bind(l, n)
        }
    });
    m.each(["get", "post"],
            function (h, l) {
                m[l] = function (n, p, u, z) {
                    if (m.isFunction(p)) {
                        z = z || u;
                        u = p;
                        p = d
                    }
                    return m.ajax({type:l, url:n, data:p, success:u, dataType:z})
                }
            });
    m.extend({getScript:function (h, l) {
        return m.get(h, d, l, "script")
    }, getJSON:function (h, l, n) {
        return m.get(h, l, n, "json")
    }, ajaxSetup:function (h, l) {
        if (l)N(h, m.ajaxSettings); else {
            l = h;
            h = m.ajaxSettings
        }
        N(h, l);
        return h
    }, ajaxSettings:{url:mb, isLocal:/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(nb[1]), global:true, type:"GET", contentType:"application/x-www-form-urlencoded",
        processData:true, async:true, accepts:{xml:"application/xml, text/xml", html:"text/html", text:"text/plain", json:"application/json, text/javascript", "*":Gb}, contents:{xml:/xml/, html:/html/, json:/json/}, responseFields:{xml:"responseXML", text:"responseText"}, converters:{"* text":a.String, "text html":true, "text json":m.parseJSON, "text xml":m.parseXML}, flatOptions:{context:true, url:true}}, ajaxPrefilter:G(Za), ajaxTransport:G($b), ajax:function (h, l) {
        function n(F, M, O, U) {
            if (A !== 2) {
                A = 2;
                Xa && clearTimeout(Xa);
                Ia =
                        d;
                sa = U || "";
                aa.readyState = F > 0 ? 4 : 0;
                var T, na, ga;
                U = M;
                if (O) {
                    var xa = p, Ba = aa, I = xa.contents, ha = xa.dataTypes, ia = xa.responseFields, oa, Ca, Ga, Sa;
                    for (Ca in ia)if (Ca in O)Ba[ia[Ca]] = O[Ca];
                    for (; ha[0] === "*";) {
                        ha.shift();
                        if (oa === d)oa = xa.mimeType || Ba.getResponseHeader("content-type")
                    }
                    if (oa)for (Ca in I)if (I[Ca] && I[Ca].test(oa)) {
                        ha.unshift(Ca);
                        break
                    }
                    if (ha[0]in O)Ga = ha[0]; else {
                        for (Ca in O) {
                            if (!ha[0] || xa.converters[Ca + " " + ha[0]]) {
                                Ga = Ca;
                                break
                            }
                            Sa || (Sa = Ca)
                        }
                        Ga = Ga || Sa
                    }
                    if (Ga) {
                        Ga !== ha[0] && ha.unshift(Ga);
                        O = O[Ga]
                    } else O = void 0
                } else O =
                        d;
                O = O;
                if (F >= 200 && F < 300 || F === 304) {
                    if (p.ifModified) {
                        if (oa = aa.getResponseHeader("Last-Modified"))m.lastModified[V] = oa;
                        if (oa = aa.getResponseHeader("Etag"))m.etag[V] = oa
                    }
                    if (F === 304) {
                        U = "notmodified";
                        T = true
                    } else try {
                        oa = p;
                        O = O;
                        if (oa.dataFilter)O = oa.dataFilter(O, oa.dataType);
                        var Ta = oa.dataTypes;
                        Ca = {};
                        var rb, kc, qc = Ta.length, lc, Ab = Ta[0], Rb, oc, Bb, Hb, Sb;
                        for (rb = 1; rb < qc; rb++) {
                            if (rb === 1)for (kc in oa.converters)if (typeof kc === "string")Ca[kc.toLowerCase()] = oa.converters[kc];
                            Rb = Ab;
                            Ab = Ta[rb];
                            if (Ab === "*")Ab = Rb; else if (Rb !==
                                    "*" && Rb !== Ab) {
                                oc = Rb + " " + Ab;
                                Bb = Ca[oc] || Ca["* " + Ab];
                                if (!Bb) {
                                    Sb = d;
                                    for (Hb in Ca) {
                                        lc = Hb.split(" ");
                                        if (lc[0] === Rb || lc[0] === "*")if (Sb = Ca[lc[1] + " " + Ab]) {
                                            Hb = Ca[Hb];
                                            if (Hb === true)Bb = Sb; else if (Sb === true)Bb = Hb;
                                            break
                                        }
                                    }
                                }
                                Bb || Sb || m.error("No conversion from " + oc.replace(" ", " to "));
                                if (Bb !== true)O = Bb ? Bb(O) : Sb(Hb(O))
                            }
                        }
                        na = O;
                        U = "success";
                        T = true
                    } catch (rc) {
                        U = "parsererror";
                        ga = rc
                    }
                } else {
                    ga = U;
                    if (!U || F) {
                        U = "error";
                        if (F < 0)F = 0
                    }
                }
                aa.status = F;
                aa.statusText = "" + (M || U);
                T ? D.resolveWith(u, [na, U, aa]) : D.rejectWith(u, [aa, U, ga]);
                aa.statusCode(R);
                R = d;
                if (J)z.trigger("ajax" + (T ? "Success" : "Error"), [aa, p, T ? na : ga]);
                H.fireWith(u, [aa, U]);
                if (J) {
                    z.trigger("ajaxComplete", [aa, p]);
                    --m.active || m.event.trigger("ajaxStop")
                }
            }
        }

        if (typeof h === "object") {
            l = h;
            h = d
        }
        l = l || {};
        var p = m.ajaxSetup({}, l), u = p.context || p, z = u !== p && (u.nodeType || u instanceof m) ? m(u) : m.event, D = m.Deferred(), H = m.Callbacks("once memory"), R = p.statusCode || {}, V, qa = {}, ca = {}, sa, ka, Ia, Xa, w, A = 0, J, ea, aa = {readyState:0, setRequestHeader:function (F, M) {
            if (!A) {
                var O = F.toLowerCase();
                F = ca[O] = ca[O] || F;
                qa[F] = M
            }
            return this
        },
            getAllResponseHeaders:function () {
                return A === 2 ? sa : null
            }, getResponseHeader:function (F) {
                var M;
                if (A === 2) {
                    if (!ka)for (ka = {}; M = zb.exec(sa);)ka[M[1].toLowerCase()] = M[2];
                    M = ka[F.toLowerCase()]
                }
                return M === d ? null : M
            }, overrideMimeType:function (F) {
                if (!A)p.mimeType = F;
                return this
            }, abort:function (F) {
                F = F || "abort";
                Ia && Ia.abort(F);
                n(0, F);
                return this
            }};
        D.promise(aa);
        aa.success = aa.done;
        aa.error = aa.fail;
        aa.complete = H.add;
        aa.statusCode = function (F) {
            if (F) {
                var M;
                if (A < 2)for (M in F)R[M] = [R[M], F[M]]; else {
                    M = F[aa.status];
                    aa.then(M,
                            M)
                }
            }
            return this
        };
        p.url = ((h || p.url) + "").replace(Ua, "").replace(Fb, nb[1] + "//");
        p.dataTypes = m.trim(p.dataType || "*").toLowerCase().split(hb);
        if (p.crossDomain == null) {
            w = Na.exec(p.url.toLowerCase());
            p.crossDomain = !!(w && (w[1] != nb[1] || w[2] != nb[2] || (w[3] || (w[1] === "http:" ? 80 : 443)) != (nb[3] || (nb[1] === "http:" ? 80 : 443))))
        }
        if (p.data && p.processData && typeof p.data !== "string")p.data = m.param(p.data, p.traditional);
        B(Za, p, l, aa);
        if (A === 2)return false;
        J = p.global;
        p.type = p.type.toUpperCase();
        p.hasContent = !Wa.test(p.type);
        J &&
                m.active++ === 0 && m.event.trigger("ajaxStart");
        if (!p.hasContent) {
            if (p.data) {
                p.url += (Da.test(p.url) ? "&" : "?") + p.data;
                delete p.data
            }
            V = p.url;
            if (p.cache === false) {
                w = m.now();
                var ta = p.url.replace(jc, "$1_=" + w);
                p.url = ta + (ta === p.url ? (Da.test(p.url) ? "&" : "?") + "_=" + w : "")
            }
        }
        if (p.data && p.hasContent && p.contentType !== false || l.contentType)aa.setRequestHeader("Content-Type", p.contentType);
        if (p.ifModified) {
            V = V || p.url;
            m.lastModified[V] && aa.setRequestHeader("If-Modified-Since", m.lastModified[V]);
            m.etag[V] && aa.setRequestHeader("If-None-Match",
                    m.etag[V])
        }
        aa.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + (p.dataTypes[0] !== "*" ? ", " + Gb + "; q=0.01" : "") : p.accepts["*"]);
        for (ea in p.headers)aa.setRequestHeader(ea, p.headers[ea]);
        if (p.beforeSend && (p.beforeSend.call(u, aa, p) === false || A === 2)) {
            aa.abort();
            return false
        }
        for (ea in{success:1, error:1, complete:1})aa[ea](p[ea]);
        if (Ia = B($b, p, l, aa)) {
            aa.readyState = 1;
            J && z.trigger("ajaxSend", [aa, p]);
            if (p.async && p.timeout > 0)Xa = setTimeout(function () {
                        aa.abort("timeout")
                    },
                    p.timeout);
            try {
                A = 1;
                Ia.send(qa, n)
            } catch (x) {
                A < 2 ? n(-1, x) : m.error(x)
            }
        } else n(-1, "No Transport");
        return aa
    }, param:function (h, l) {
        var n = [], p = function (z, D) {
            D = m.isFunction(D) ? D() : D;
            n[n.length] = encodeURIComponent(z) + "=" + encodeURIComponent(D)
        };
        if (l === d)l = m.ajaxSettings.traditional;
        if (m.isArray(h) || h.jquery && !m.isPlainObject(h))m.each(h, function () {
            p(this.name, this.value)
        }); else for (var u in h)ba(u, h[u], l, p);
        return n.join("&").replace(yb, "+")
    }});
    m.extend({active:0, lastModified:{}, etag:{}});
    var Tb = m.now(), Ib = /(\=)\?(&|$)|\?\?/i;
    m.ajaxSetup({jsonp:"callback", jsonpCallback:function () {
        return m.expando + "_" + Tb++
    }});
    m.ajaxPrefilter("json jsonp", function (h, l, n) {
        l = h.contentType === "application/x-www-form-urlencoded" && typeof h.data === "string";
        if (h.dataTypes[0] === "jsonp" || h.jsonp !== false && (Ib.test(h.url) || l && Ib.test(h.data))) {
            var p, u = h.jsonpCallback = m.isFunction(h.jsonpCallback) ? h.jsonpCallback() : h.jsonpCallback, z = a[u], D = h.url, H = h.data, R = "$1" + u + "$2";
            if (h.jsonp !== false) {
                D = D.replace(Ib, R);
                if (h.url === D) {
                    if (l)H = H.replace(Ib, R);
                    if (h.data ===
                            H)D += (/\?/.test(D) ? "&" : "?") + h.jsonp + "=" + u
                }
            }
            h.url = D;
            h.data = H;
            a[u] = function (V) {
                p = [V]
            };
            n.always(function () {
                a[u] = z;
                p && m.isFunction(z) && a[u](p[0])
            });
            h.converters["script json"] = function () {
                p || m.error(u + " was not called");
                return p[0]
            };
            h.dataTypes[0] = "json";
            return"script"
        }
    });
    m.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents:{script:/javascript|ecmascript/}, converters:{"text script":function (h) {
        m.globalEval(h);
        return h
    }}});
    m.ajaxPrefilter("script",
            function (h) {
                if (h.cache === d)h.cache = false;
                if (h.crossDomain) {
                    h.type = "GET";
                    h.global = false
                }
            });
    m.ajaxTransport("script", function (h) {
        if (h.crossDomain) {
            var l, n = W.head || W.getElementsByTagName("head")[0] || W.documentElement;
            return{send:function (p, u) {
                l = W.createElement("script");
                l.async = "async";
                if (h.scriptCharset)l.charset = h.scriptCharset;
                l.src = h.url;
                l.onload = l.onreadystatechange = function (z, D) {
                    if (D || !l.readyState || /loaded|complete/.test(l.readyState)) {
                        l.onload = l.onreadystatechange = null;
                        n && l.parentNode && n.removeChild(l);
                        l = d;
                        D || u(200, "success")
                    }
                };
                n.insertBefore(l, n.firstChild)
            }, abort:function () {
                l && l.onload(0, 1)
            }}
        }
    });
    var ob = a.ActiveXObject ? function () {
        for (var h in Oa)Oa[h](0, 1)
    } : false, Ka = 0, Oa;
    m.ajaxSettings.xhr = a.ActiveXObject ? function () {
        var h;
        if (!(h = !this.isLocal && L()))a:{
            try {
                h = new a.ActiveXObject("Microsoft.XMLHTTP");
                break a
            } catch (l) {
            }
            h = void 0
        }
        return h
    } : L;
    (function (h) {
        m.extend(m.support, {ajax:!!h, cors:!!h && "withCredentials"in h})
    })(m.ajaxSettings.xhr());
    m.support.ajax && m.ajaxTransport(function (h) {
        if (!h.crossDomain ||
                m.support.cors) {
            var l;
            return{send:function (n, p) {
                var u = h.xhr(), z, D;
                h.username ? u.open(h.type, h.url, h.async, h.username, h.password) : u.open(h.type, h.url, h.async);
                if (h.xhrFields)for (D in h.xhrFields)u[D] = h.xhrFields[D];
                h.mimeType && u.overrideMimeType && u.overrideMimeType(h.mimeType);
                if (!h.crossDomain && !n["X-Requested-With"])n["X-Requested-With"] = "XMLHttpRequest";
                try {
                    for (D in n)u.setRequestHeader(D, n[D])
                } catch (H) {
                }
                u.send(h.hasContent && h.data || null);
                l = function (R, V) {
                    var qa, ca, sa, ka, Ia;
                    try {
                        if (l && (V || u.readyState ===
                                4)) {
                            l = d;
                            if (z) {
                                u.onreadystatechange = m.noop;
                                ob && delete Oa[z]
                            }
                            if (V)u.readyState !== 4 && u.abort(); else {
                                qa = u.status;
                                sa = u.getAllResponseHeaders();
                                ka = {};
                                if ((Ia = u.responseXML) && Ia.documentElement)ka.xml = Ia;
                                ka.text = u.responseText;
                                try {
                                    ca = u.statusText
                                } catch (Xa) {
                                    ca = ""
                                }
                                if (!qa && h.isLocal && !h.crossDomain)qa = ka.text ? 200 : 404; else if (qa === 1223)qa = 204
                            }
                        }
                    } catch (w) {
                        V || p(-1, w)
                    }
                    ka && p(qa, ca, ka, sa)
                };
                if (!h.async || u.readyState === 4)l(); else {
                    z = ++Ka;
                    if (ob) {
                        if (!Oa) {
                            Oa = {};
                            m(a).unload(ob)
                        }
                        Oa[z] = l
                    }
                    u.onreadystatechange = l
                }
            }, abort:function () {
                l &&
                l(0, 1)
            }}
        }
    });
    var Ja = {}, Ea, qb, Ub = /^(?:toggle|show|hide)$/, Ma = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, cb, Cb = [
        ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
        ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
        ["opacity"]
    ], ib;
    m.fn.extend({show:function (h, l, n) {
        if (h || h === 0)return this.animate(Z("show", 3), h, l, n); else {
            n = 0;
            for (var p = this.length; n < p; n++) {
                h = this[n];
                if (h.style) {
                    l = h.style.display;
                    if (!m._data(h, "olddisplay") && l === "none")l = h.style.display = "";
                    l === "" && m.css(h, "display") ===
                            "none" && m._data(h, "olddisplay", X(h.nodeName))
                }
            }
            for (n = 0; n < p; n++) {
                h = this[n];
                if (h.style) {
                    l = h.style.display;
                    if (l === "" || l === "none")h.style.display = m._data(h, "olddisplay") || ""
                }
            }
            return this
        }
    }, hide:function (h, l, n) {
        if (h || h === 0)return this.animate(Z("hide", 3), h, l, n); else {
            n = 0;
            for (var p = this.length; n < p; n++) {
                h = this[n];
                if (h.style) {
                    l = m.css(h, "display");
                    l !== "none" && !m._data(h, "olddisplay") && m._data(h, "olddisplay", l)
                }
            }
            for (n = 0; n < p; n++)if (this[n].style)this[n].style.display = "none";
            return this
        }
    }, _toggle:m.fn.toggle,
        toggle:function (h, l, n) {
            var p = typeof h === "boolean";
            if (m.isFunction(h) && m.isFunction(l))this._toggle.apply(this, arguments); else h == null || p ? this.each(function () {
                var u = p ? h : m(this).is(":hidden");
                m(this)[u ? "show" : "hide"]()
            }) : this.animate(Z("toggle", 3), h, l, n);
            return this
        }, fadeTo:function (h, l, n, p) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({opacity:l}, h, n, p)
        }, animate:function (h, l, n, p) {
            function u() {
                z.queue === false && m._mark(this);
                var D = m.extend({}, z), H = this.nodeType === 1, R = H && m(this).is(":hidden"),
                        V, qa, ca, sa, ka;
                D.animatedProperties = {};
                for (ca in h) {
                    V = m.camelCase(ca);
                    if (ca !== V) {
                        h[V] = h[ca];
                        delete h[ca]
                    }
                    qa = h[V];
                    if (m.isArray(qa)) {
                        D.animatedProperties[V] = qa[1];
                        qa = h[V] = qa[0]
                    } else D.animatedProperties[V] = D.specialEasing && D.specialEasing[V] || D.easing || "swing";
                    if (qa === "hide" && R || qa === "show" && !R)return D.complete.call(this);
                    if (H && (V === "height" || V === "width")) {
                        D.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];
                        if (m.css(this, "display") === "inline" && m.css(this, "float") === "none")if (!m.support.inlineBlockNeedsLayout ||
                                X(this.nodeName) === "inline")this.style.display = "inline-block"; else this.style.zoom = 1
                    }
                }
                if (D.overflow != null)this.style.overflow = "hidden";
                for (ca in h) {
                    H = new m.fx(this, D, ca);
                    qa = h[ca];
                    if (Ub.test(qa))if (V = m._data(this, "toggle" + ca) || (qa === "toggle" ? R ? "show" : "hide" : 0)) {
                        m._data(this, "toggle" + ca, V === "show" ? "hide" : "show");
                        H[V]()
                    } else H[qa](); else {
                        V = Ma.exec(qa);
                        sa = H.cur();
                        if (V) {
                            qa = parseFloat(V[2]);
                            ka = V[3] || (m.cssNumber[ca] ? "" : "px");
                            if (ka !== "px") {
                                m.style(this, ca, (qa || 1) + ka);
                                sa = (qa || 1) / H.cur() * sa;
                                m.style(this, ca,
                                        sa + ka)
                            }
                            if (V[1])qa = (V[1] === "-=" ? -1 : 1) * qa + sa;
                            H.custom(sa, qa, ka)
                        } else H.custom(sa, qa, "")
                    }
                }
                return true
            }

            var z = m.speed(l, n, p);
            if (m.isEmptyObject(h))return this.each(z.complete, [false]);
            h = m.extend({}, h);
            return z.queue === false ? this.each(u) : this.queue(z.queue, u)
        }, stop:function (h, l, n) {
            if (typeof h !== "string") {
                n = l;
                l = h;
                h = d
            }
            if (l && h !== false)this.queue(h || "fx", []);
            return this.each(function () {
                function p(R, V, qa) {
                    V = V[qa];
                    m.removeData(R, qa, true);
                    V.stop(n)
                }

                var u, z = false, D = m.timers, H = m._data(this);
                n || m._unmark(true, this);
                if (h == null)for (u in H)H[u].stop && u.indexOf(".run") === u.length - 4 && p(this, H, u); else if (H[u = h + ".run"] && H[u].stop)p(this, H, u);
                for (u = D.length; u--;)if (D[u].elem === this && (h == null || D[u].queue === h)) {
                    n ? D[u](true) : D[u].saveState();
                    z = true;
                    D.splice(u, 1)
                }
                n && z || m.dequeue(this, h)
            })
        }});
    m.each({slideDown:Z("show", 1), slideUp:Z("hide", 1), slideToggle:Z("toggle", 1), fadeIn:{opacity:"show"}, fadeOut:{opacity:"hide"}, fadeToggle:{opacity:"toggle"}}, function (h, l) {
        m.fn[h] = function (n, p, u) {
            return this.animate(l, n, p, u)
        }
    });
    m.extend({speed:function (h, l, n) {
        var p = h && typeof h === "object" ? m.extend({}, h) : {complete:n || !n && l || m.isFunction(h) && h, duration:h, easing:n && l || l && !m.isFunction(l) && l};
        p.duration = m.fx.off ? 0 : typeof p.duration === "number" ? p.duration : p.duration in m.fx.speeds ? m.fx.speeds[p.duration] : m.fx.speeds._default;
        if (p.queue == null || p.queue === true)p.queue = "fx";
        p.old = p.complete;
        p.complete = function (u) {
            m.isFunction(p.old) && p.old.call(this);
            if (p.queue)m.dequeue(this, p.queue); else u !== false && m._unmark(this)
        };
        return p
    }, easing:{linear:function (h, l, n, p) {
        return n + p * h
    }, swing:function (h, l, n, p) {
        return(-Math.cos(h * Math.PI) / 2 + 0.5) * p + n
    }}, timers:[], fx:function (h, l, n) {
        this.options = l;
        this.elem = h;
        this.prop = n;
        l.orig = l.orig || {}
    }});
    m.fx.prototype = {update:function () {
        this.options.step && this.options.step.call(this.elem, this.now, this);
        (m.fx.step[this.prop] || m.fx.step._default)(this)
    }, cur:function () {
        if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null))return this.elem[this.prop];
        var h, l = m.css(this.elem, this.prop);
        return isNaN(h = parseFloat(l)) ?
                !l || l === "auto" ? 0 : l : h
    }, custom:function (h, l, n) {
        function p(D) {
            return u.step(D)
        }

        var u = this, z = m.fx;
        this.startTime = ib || ja();
        this.end = l;
        this.now = this.start = h;
        this.pos = this.state = 0;
        this.unit = n || this.unit || (m.cssNumber[this.prop] ? "" : "px");
        p.queue = this.options.queue;
        p.elem = this.elem;
        p.saveState = function () {
            u.options.hide && m._data(u.elem, "fxshow" + u.prop) === d && m._data(u.elem, "fxshow" + u.prop, u.start)
        };
        if (p() && m.timers.push(p) && !cb)cb = setInterval(z.tick, z.interval)
    }, show:function () {
        var h = m._data(this.elem, "fxshow" +
                this.prop);
        this.options.orig[this.prop] = h || m.style(this.elem, this.prop);
        this.options.show = true;
        h !== d ? this.custom(this.cur(), h) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
        m(this.elem).show()
    }, hide:function () {
        this.options.orig[this.prop] = m._data(this.elem, "fxshow" + this.prop) || m.style(this.elem, this.prop);
        this.options.hide = true;
        this.custom(this.cur(), 0)
    }, step:function (h) {
        var l, n = ib || ja(), p = true, u = this.elem, z = this.options;
        if (h || n >= z.duration + this.startTime) {
            this.now = this.end;
            this.pos = this.state = 1;
            this.update();
            z.animatedProperties[this.prop] = true;
            for (l in z.animatedProperties)if (z.animatedProperties[l] !== true)p = false;
            if (p) {
                z.overflow != null && !m.support.shrinkWrapBlocks && m.each(["", "X", "Y"], function (D, H) {
                    u.style["overflow" + H] = z.overflow[D]
                });
                z.hide && m(u).hide();
                if (z.hide || z.show)for (l in z.animatedProperties) {
                    m.style(u, l, z.orig[l]);
                    m.removeData(u, "fxshow" + l, true);
                    m.removeData(u, "toggle" + l, true)
                }
                if (h = z.complete) {
                    z.complete = false;
                    h.call(u)
                }
            }
            return false
        } else {
            if (z.duration ==
                    Infinity)this.now = n; else {
                h = n - this.startTime;
                this.state = h / z.duration;
                this.pos = m.easing[z.animatedProperties[this.prop]](this.state, h, 0, 1, z.duration);
                this.now = this.start + (this.end - this.start) * this.pos
            }
            this.update()
        }
        return true
    }};
    m.extend(m.fx, {tick:function () {
        for (var h, l = m.timers, n = 0; n < l.length; n++) {
            h = l[n];
            !h() && l[n] === h && l.splice(n--, 1)
        }
        l.length || m.fx.stop()
    }, interval:13, stop:function () {
        clearInterval(cb);
        cb = null
    }, speeds:{slow:600, fast:200, _default:400}, step:{opacity:function (h) {
        m.style(h.elem, "opacity",
                h.now)
    }, _default:function (h) {
        if (h.elem.style && h.elem.style[h.prop] != null)h.elem.style[h.prop] = h.now + h.unit; else h.elem[h.prop] = h.now
    }}});
    m.each(["width", "height"], function (h, l) {
        m.fx.step[l] = function (n) {
            m.style(n.elem, l, Math.max(0, n.now))
        }
    });
    if (m.expr && m.expr.filters)m.expr.filters.animated = function (h) {
        return m.grep(m.timers,function (l) {
            return h === l.elem
        }).length
    };
    var Ya = /^t(?:able|d|h)$/i, Vb = /^(?:body|html)$/i;
    m.fn.offset = "getBoundingClientRect"in W.documentElement ? function (h) {
        var l = this[0], n;
        if (h)return this.each(function (D) {
            m.offset.setOffset(this,
                    h, D)
        });
        if (!l || !l.ownerDocument)return null;
        if (l === l.ownerDocument.body)return m.offset.bodyOffset(l);
        try {
            n = l.getBoundingClientRect()
        } catch (p) {
        }
        var u = l.ownerDocument, z = u.documentElement;
        if (!n || !m.contains(z, l))return n ? {top:n.top, left:n.left} : {top:0, left:0};
        l = u.body;
        u = da(u);
        return{top:n.top + (u.pageYOffset || m.support.boxModel && z.scrollTop || l.scrollTop) - (z.clientTop || l.clientTop || 0), left:n.left + (u.pageXOffset || m.support.boxModel && z.scrollLeft || l.scrollLeft) - (z.clientLeft || l.clientLeft || 0)}
    } : function (h) {
        var l =
                this[0];
        if (h)return this.each(function (qa) {
            m.offset.setOffset(this, h, qa)
        });
        if (!l || !l.ownerDocument)return null;
        if (l === l.ownerDocument.body)return m.offset.bodyOffset(l);
        var n, p = l.offsetParent, u = l, z = l.ownerDocument, D = z.documentElement, H = z.body;
        n = (z = z.defaultView) ? z.getComputedStyle(l, null) : l.currentStyle;
        for (var R = l.offsetTop, V = l.offsetLeft; (l = l.parentNode) && l !== H && l !== D;) {
            if (m.support.fixedPosition && n.position === "fixed")break;
            n = z ? z.getComputedStyle(l, null) : l.currentStyle;
            R -= l.scrollTop;
            V -= l.scrollLeft;
            if (l === p) {
                R += l.offsetTop;
                V += l.offsetLeft;
                if (m.support.doesNotAddBorder && !(m.support.doesAddBorderForTableAndCells && Ya.test(l.nodeName))) {
                    R += parseFloat(n.borderTopWidth) || 0;
                    V += parseFloat(n.borderLeftWidth) || 0
                }
                u = p;
                p = l.offsetParent
            }
            if (m.support.subtractsBorderForOverflowNotVisible && n.overflow !== "visible") {
                R += parseFloat(n.borderTopWidth) || 0;
                V += parseFloat(n.borderLeftWidth) || 0
            }
            n = n
        }
        if (n.position === "relative" || n.position === "static") {
            R += H.offsetTop;
            V += H.offsetLeft
        }
        if (m.support.fixedPosition && n.position ===
                "fixed") {
            R += Math.max(D.scrollTop, H.scrollTop);
            V += Math.max(D.scrollLeft, H.scrollLeft)
        }
        return{top:R, left:V}
    };
    m.offset = {bodyOffset:function (h) {
        var l = h.offsetTop, n = h.offsetLeft;
        if (m.support.doesNotIncludeMarginInBodyOffset) {
            l += parseFloat(m.css(h, "marginTop")) || 0;
            n += parseFloat(m.css(h, "marginLeft")) || 0
        }
        return{top:l, left:n}
    }, setOffset:function (h, l, n) {
        var p = m.css(h, "position");
        if (p === "static")h.style.position = "relative";
        var u = m(h), z = u.offset(), D = m.css(h, "top"), H = m.css(h, "left"), R = {}, V = {};
        if ((p === "absolute" ||
                p === "fixed") && m.inArray("auto", [D, H]) > -1) {
            V = u.position();
            p = V.top;
            H = V.left
        } else {
            p = parseFloat(D) || 0;
            H = parseFloat(H) || 0
        }
        if (m.isFunction(l))l = l.call(h, n, z);
        if (l.top != null)R.top = l.top - z.top + p;
        if (l.left != null)R.left = l.left - z.left + H;
        "using"in l ? l.using.call(h, R) : u.css(R)
    }};
    m.fn.extend({position:function () {
        if (!this[0])return null;
        var h = this[0], l = this.offsetParent(), n = this.offset(), p = Vb.test(l[0].nodeName) ? {top:0, left:0} : l.offset();
        n.top -= parseFloat(m.css(h, "marginTop")) || 0;
        n.left -= parseFloat(m.css(h, "marginLeft")) ||
                0;
        p.top += parseFloat(m.css(l[0], "borderTopWidth")) || 0;
        p.left += parseFloat(m.css(l[0], "borderLeftWidth")) || 0;
        return{top:n.top - p.top, left:n.left - p.left}
    }, offsetParent:function () {
        return this.map(function () {
            for (var h = this.offsetParent || W.body; h && !Vb.test(h.nodeName) && m.css(h, "position") === "static";)h = h.offsetParent;
            return h
        })
    }});
    m.each(["Left", "Top"], function (h, l) {
        var n = "scroll" + l;
        m.fn[n] = function (p) {
            var u, z;
            if (p === d) {
                u = this[0];
                if (!u)return null;
                return(z = da(u)) ? "pageXOffset"in z ? z[h ? "pageYOffset" : "pageXOffset"] :
                        m.support.boxModel && z.document.documentElement[n] || z.document.body[n] : u[n]
            }
            return this.each(function () {
                if (z = da(this))z.scrollTo(!h ? p : m(z).scrollLeft(), h ? p : m(z).scrollTop()); else this[n] = p
            })
        }
    });
    m.each(["Height", "Width"], function (h, l) {
        var n = l.toLowerCase();
        m.fn["inner" + l] = function () {
            var p = this[0];
            return p ? p.style ? parseFloat(m.css(p, n, "padding")) : this[n]() : null
        };
        m.fn["outer" + l] = function (p) {
            var u = this[0];
            return u ? u.style ? parseFloat(m.css(u, n, p ? "margin" : "border")) : this[n]() : null
        };
        m.fn[n] = function (p) {
            var u =
                    this[0];
            if (!u)return p == null ? null : this;
            if (m.isFunction(p))return this.each(function (H) {
                var R = m(this);
                R[n](p.call(this, H, R[n]()))
            });
            if (m.isWindow(u)) {
                var z = u.document.documentElement["client" + l], D = u.document.body;
                return u.document.compatMode === "CSS1Compat" && z || D && D["client" + l] || z
            } else if (u.nodeType === 9)return Math.max(u.documentElement["client" + l], u.body["scroll" + l], u.documentElement["scroll" + l], u.body["offset" + l], u.documentElement["offset" + l]); else if (p === d) {
                u = m.css(u, n);
                z = parseFloat(u);
                return m.isNumeric(z) ?
                        z : u
            } else return this.css(n, typeof p === "string" ? p : p + "px")
        }
    });
    a.jQuery = a.$ = m
})(window);


(function (a) {
    var d = false, b = /xyz/.test(function () {
    }), c = /\b_super\b/, e = function (f, j, g) {
        var k;
        g = g || f;
        for (k in f)g[k] = typeof f[k] == "function" && typeof j[k] == "function" && (!b || c.test(f[k])) ? function (o, s) {
            return function () {
                var q = this._super, r;
                this._super = j[o];
                r = s.apply(this, arguments);
                this._super = q;
                return r
            }
        }(k, f[k]) : f[k]
    };
    jQuery.Class = function () {
        arguments.length && this.extend.apply(this, arguments)
    };
    a.extend(a.Class, {callback:function (f) {
        var j = jQuery.makeArray(arguments), g;
        f = j.shift();
        jQuery.isArray(f) || (f =
                [f]);
        g = this;
        return function () {
            for (var k = j.concat(jQuery.makeArray(arguments)), o, s = f.length, q = 0, r; q < s; q++)if (r = f[q]) {
                if ((o = typeof r == "string") && g._set_called)g.called = r;
                k = (o ? g[r] : r).apply(g, k || []);
                if (q < s - 1)k = !jQuery.isArray(k) || k._use_call ? [k] : k
            }
            return k
        }
    }, getObject:function (f, j) {
        j = j || window;
        for (var g = f ? f.split(/\./) : [], k = 0, o = g.length; k < o; k++)j = j[g[k]] || (j[g[k]] = {});
        return j
    }, newInstance:function () {
        var f = this.rawInstance(), j;
        if (f.setup)j = f.setup.apply(f, arguments);
        if (f.init)f.init.apply(f, a.isArray(j) ?
                j : arguments);
        return f
    }, setup:function (f) {
        this.defaults = a.extend(true, {}, f.defaults, this.defaults);
        return arguments
    }, rawInstance:function () {
        d = true;
        var f = new this;
        d = false;
        return f
    }, extend:function (f, j, g) {
        function k() {
            if (!d)return this.constructor !== k && arguments.length ? this.extend.apply(this, arguments) : this.Class.newInstance.apply(this.Class, arguments)
        }

        if (typeof f != "string") {
            g = j;
            j = f;
            f = null
        }
        if (!g) {
            g = j;
            j = null
        }
        g = g || {};
        var o = this.prototype, s = /\./, q, r, v, t;
        d = true;
        t = new this;
        d = false;
        e(g, o, t);
        for (q in this)if (this.hasOwnProperty(q) &&
                a.inArray(q, ["prototype", "defaults", "getObject"]) == -1)k[q] = this[q];
        e(j, this, k);
        if (f) {
            v = f.split(s);
            r = v.pop();
            v = o = a.Class.getObject(v.join("."));
            o[r] = k
        }
        a.extend(k, {prototype:t, namespace:v, shortName:r, constructor:k, fullName:f});
        k.prototype.Class = k.prototype.constructor = k;
        r = k.setup.apply(k, [this].concat(a.makeArray(arguments)));
        if (k.init)k.init.apply(k, r || []);
        return k
    }});
    jQuery.Class.prototype.callback = jQuery.Class.callback
})(jQuery);


(function (a) {
    var d = {undHash:/_|-/, colons:/::/, words:/([A-Z]+)([A-Z][a-z])/g, lowerUpper:/([a-z\d])([A-Z])/g, dash:/([a-z\d])([A-Z])/g}, b = a.String = {strip:function (c) {
        return c.replace(/^\s+/, "").replace(/\s+$/, "")
    }, capitalize:function (c) {
        return c.charAt(0).toUpperCase() + c.substr(1)
    }, endsWith:function (c, e) {
        var f = c.length - e.length;
        return f >= 0 && c.lastIndexOf(e) === f
    }, camelize:function (c) {
        c = c.split(d.undHash);
        var e = 1;
        for (c[0] = c[0].charAt(0).toLowerCase() + c[0].substr(1); e < c.length; e++)c[e] = b.capitalize(c[e]);
        return c.join("")
    }, classize:function (c) {
        c = c.split(d.undHash);
        for (var e = 0; e < c.length; e++)c[e] = b.capitalize(c[e]);
        return c.join("")
    }, niceName:function (c) {
        c = c.split(d.undHash);
        for (var e = 0; e < c.length; e++)c[e] = b.capitalize(c[e]);
        return c.join(" ")
    }, underscore:function (c) {
        return c.replace(d.colons, "/").replace(d.words, "$1_$2").replace(d.lowerUpper, "$1_$2").replace(d.dash, "_").toLowerCase()
    }}
})(jQuery);


(function (a) {
    a.String.rsplit = function (d, b) {
        for (var c = b.exec(d), e = [], f; c != null;) {
            f = c.index;
            if (f != 0) {
                e.push(d.substring(0, f));
                d = d.slice(f)
            }
            e.push(c[0]);
            d = d.slice(c[0].length);
            c = b.exec(d)
        }
        d != "" && e.push(d);
        return e
    }
})(jQuery);


(function (a) {
    var d = jQuery.cleanData;
    a.cleanData = function (b) {
        for (var c = 0, e; (e = b[c]) != null; c++)a(e).triggerHandler("destroyed");
        d(b)
    }
})(jQuery);


(function (a) {
    var d = function (t, y, E) {
                var G;
                if (y.indexOf(">") == 0) {
                    y = y.substr(1);
                    G = function (B) {
                        B.target === t ? E.apply(this, arguments) : B.handled = null
                    }
                }
                a(t).bind(y, G || E);
                return function () {
                    a(t).unbind(y, G || E);
                    t = y = E = G = null
                }
            }, b = function (t, y, E, G) {
                a(t).delegate(y, E, G);
                return function () {
                    a(t).undelegate(y, E, G);
                    t = E = G = y = null
                }
            }, c = function (t, y, E, G) {
                return G ? b(t, G, y, E) : d(t, y, E)
            }, e = function (t) {
                return function () {
                    return t.apply(null, [a(this)].concat(Array.prototype.slice.call(arguments, 0)))
                }
            }, f = /\./g, j = /_?controllers?/ig,
            g = /[^\w]/, k = /^(>?default\.)|(>)/, o = /\{([^\}]+)\}/g, s = /^(?:(.*?)\s)?([\w\.\:>]+)$/;
    a.Class.extend("jQuery.Controller", {init:function () {
        if (!(!this.shortName || this.fullName == "jQuery.Controller")) {
            this._fullName = a.String.underscore(this.fullName.replace(f, "_").replace(j, ""));
            this._shortName = a.String.underscore(this.shortName.replace(f, "_").replace(j, ""));
            var t = this, y = this._fullName, E;
            a.fn[y] || (a.fn[y] = function (G) {
                var B = a.makeArray(arguments), N = typeof G == "string" && a.isFunction(t.prototype[G]), ba = B[0];
                this.each(function () {
                    var L = a.data(this, "controllers");
                    if (L = L && L[y])N ? L[ba].apply(L, B.slice(1)) : L.update.apply(L, B); else t.newInstance.apply(t, [this].concat(B))
                });
                return this
            });
            if (!a.isArray(this.listensTo))throw"listensTo is not an array in " + this.fullName;
            this.actions = {};
            for (E in this.prototype)if (a.isFunction(this.prototype[E]))this._isAction(E) && (this.actions[E] = this._getAction(E));
            this.onDocument && new this(document.documentElement)
        }
    }, hookup:function (t) {
        return new this(t)
    }, _isAction:function (t) {
        if (g.test(t))return true;
        else {
            t = t.replace(k, "");
            return a.inArray(t, this.listensTo) > -1 || a.event.special[t] || a.Controller.processors[t]
        }
    }, _getAction:function (t, y) {
        o.lastIndex = 0;
        if (!y && o.test(t))return null;
        var E = (y ? t.replace(o, function (G, B) {
            return a.Class.getObject(B, y).toString()
        }) : t).match(s);
        return{processor:this.processors[E[2]] || q, parts:E}
    }, processors:{}, listensTo:[]}, {setup:function (t, y) {
        var E, G, B = this.Class;
        t = t.jquery ? t[0] : t;
        this.element = a(t).addClass(B._fullName);
        (a.data(t, "controllers") || a.data(t, "controllers", {}))[B._fullName] =
                this;
        this._bindings = [];
        this.options = a.extend(a.extend(true, {}, B.defaults), y);
        for (E in B.actions) {
            G = B.actions[E] || B._getAction(E, this.options);
            this._bindings.push(G.processor(t, G.parts[2], G.parts[1], this.callback(E), this))
        }
        this.called = "init";
        var N = e(this.callback("destroy"));
        this.element.bind("destroyed", N);
        this._bindings.push(function () {
            N.removed = true;
            a(t).unbind("destroyed", N)
        });
        return this.element
    }, bind:function (t, y, E) {
        if (typeof t == "string") {
            E = y;
            y = t;
            t = this.element
        }
        return this._binder(t, y, E)
    }, _binder:function (t, y, E, G) {
        if (typeof E == "string")E = e(this.callback(E));
        this._bindings.push(c(t, y, E, G));
        return this._bindings.length
    }, delegate:function (t, y, E, G) {
        if (typeof t == "string") {
            G = E;
            E = y;
            y = t;
            t = this.element
        }
        return this._binder(t, E, G, y)
    }, update:function (t) {
        a.extend(this.options, t)
    }, destroy:function () {
        if (this._destroyed)throw this.Class.shortName + " controller instance has been deleted";
        var t = this, y = this.Class._fullName;
        this._destroyed = true;
        this.element.removeClass(y);
        a.each(this._bindings, function (G, B) {
            a.isFunction(B) &&
            B(t.element[0])
        });
        delete this._actions;
        var E = this.element.data("controllers");
        E && E[y] && delete E[y];
        this.element = null
    }, find:function (t) {
        return this.element.find(t)
    }, _set_called:true});
    var q = function (t, y, E, G, B) {
        B = B.Class;
        if (B.onDocument && !/^Main(Controller)?$/.test(B.shortName))E = E ? "#" + B._shortName + " " + E : "#" + B._shortName;
        return c(t, y, e(G), E)
    }, r = a.Controller.processors, v = function (t, y, E, G) {
        return c(window, y.replace(/window/, ""), e(G))
    };
    a.each("change click contextmenu dblclick keydown keyup keypress mousedown mousemove mouseout mouseover mouseup reset windowresize resize windowscroll scroll select submit dblclick focusin focusout load unload ready hashchange mouseenter mouseleave".split(" "),
            function (t, y) {
                r[y] = q
            });
    a.each(["windowresize", "windowscroll", "load", "ready", "unload", "hashchange"], function (t, y) {
        r[y] = v
    });
    r.ready = function (t, y, E, G) {
        a(e(G))
    };
    a.fn.mixin = function () {
        var t = a.makeArray(arguments);
        return this.each(function () {
            for (var y = 0; y < t.length; y++)new t[y](this)
        })
    };
    a.fn.controllers = function () {
        var t = a.makeArray(arguments), y = [], E;
        this.each(function () {
            if (E = a.data(this, "controllers"))for (var G in E) {
                var B = E[G], N;
                if (!(N = !t.length))a:{
                    for (N = 0; N < t.length; N++)if (typeof t[N] == "string" ? B.Class._shortName ==
                            t[N] : B instanceof t[N]) {
                        N = true;
                        break a
                    }
                    N = false
                }
                N && y.push(B)
            }
        });
        return y
    };
    a.fn.controller = function () {
        return this.controllers.apply(this, arguments)[0]
    }
})(jQuery);
(function (a) {
    a.Controller.getFolder = function () {
        return a.String.underscore(this.fullName.replace(/\./g, "/")).replace("/Controllers", "")
    };
    a.Controller.prototype.calculateHelpers = function (d) {
        var b = {};
        if (d)if (a.isArray(d))for (var c = 0; c < d.length; c++)a.extend(b, d[c]); else a.extend(b, d); else {
            if (this._default_helpers)b = this._default_helpers;
            d = window;
            c = this.Class.fullName.split(/\./);
            for (var e = 0; e < c.length; e++) {
                typeof d.Helpers == "object" && a.extend(b, d.Helpers);
                d = d[c[e]]
            }
            typeof d.Helpers == "object" && a.extend(b,
                    d.Helpers);
            this._default_helpers = b
        }
        return b
    };
    a.Controller.prototype.view = function (d, b, c) {
        if (!d)throw Error("no view was provided");
        d = "gs/views/" + this.Class._shortName + "/" + d + a.View.ext;
        b = b || this;
        c = this.calculateHelpers.call(this, c);
        return a.View(d, b, c)
    }
})(jQuery);
(function () {
    jQuery.fn.compare = function (a) {
        try {
            a = a.jquery ? a[0] : a
        } catch (d) {
            return null
        }
        if (window.HTMLElement) {
            var b = HTMLElement.prototype.toString.call(a);
            if (b == "[xpconnect wrapped native prototype]" || b == "[object XULElement]")return null
        }
        if (this[0].compareDocumentPosition)return this[0].compareDocumentPosition(a);
        if (this[0] == document && a != document)return 8;
        b = (this[0] !== a && this[0].contains(a) && 16) + (this[0] != a && a.contains(this[0]) && 8);
        var c = document.documentElement;
        if (this[0].sourceIndex) {
            b += this[0].sourceIndex <
                    a.sourceIndex && 4;
            b += this[0].sourceIndex > a.sourceIndex && 2;
            b += (this[0].ownerDocument !== a.ownerDocument || this[0] != c && this[0].sourceIndex <= 0 || a != c && a.sourceIndex <= 0) && 1
        } else {
            c = document.createRange();
            var e = document.createRange();
            c.selectNode(this[0]);
            e.selectNode(a);
            c.compareBoundaryPoints(Range.START_TO_START, e)
        }
        return b
    }
})(jQuery);
(function (a) {
    a.fn.within = function (d, b, c) {
        var e = [];
        this.each(function () {
            var f = jQuery(this);
            if (this == document.documentElement)return e.push(this);
            f = c ? jQuery.data(this, "offset", f.offset()) : f.offset();
            b >= f.top && b < f.top + this.offsetHeight && d >= f.left && d < f.left + this.offsetWidth && e.push(this)
        });
        return this.pushStack(jQuery.unique(e), "within", d + "," + b)
    };
    a.fn.withinBox = function (d, b, c, e, f) {
        var j = [];
        this.each(function () {
            var g = jQuery(this);
            if (this == document.documentElement)return this.ret.push(this);
            var k = f ? jQuery.data(this,
                    "offset", g.offset()) : g.offset(), o = g.width();
            g = g.height();
            (res = !(k.top > b + e || k.top + g < b || k.left > d + c || k.left + o < d)) && j.push(this)
        });
        return this.pushStack(jQuery.unique(j), "withinBox", jQuery.makeArray(arguments).join(","))
    }
})(jQuery);
(function (a) {
    var d = 1;
    a.View = function (f, j, g) {
        var k = f.match(/\.[\w\d]+/), o, s;
        if (!k) {
            k = a.View.ext;
            f += a.View.ext
        }
        s = f.replace(/[\/\.]/g, "_");
        k = a.View.types[k];
        if (a.View.cached[s])f = a.View.cached[s]; else if (o = document.getElementById(s)) {
            o = o.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
            f = k.renderer(s, o)
        } else f = (o = a.View.preCached[s] || a.View.preCached[s.replace(/^_/, "")]) ? k.renderer(s, o) : k.get(s, f);
        if (a.View.cache)a.View.cached[s] = f;
        return f.call(k, j, g).replace(/\uFEFF/, "")
    };
    a.extend(a.View, {hookups:{}, hookup:function (f) {
        var j = ++d;
        jQuery.View.hookups[j] = f;
        return j
    }, cached:{}, preCached:{}, cache:true, register:function (f) {
        this.types["." + f.suffix] = f
    }, types:{}, ext:".ejs", registerScript:function (f, j, g) {
        return"$.View.preload('" + j + "'," + a.View.types["." + f].script(j, g) + ");"
    }, preload:function (f, j) {
        a.View.cached[f] = function (g, k) {
            return j.call(g, g, k)
        }
    }});
    for (var b = ["prepend", "append", "after", "before", "replace", "text", "html", "replaceWith"], c = function (f) {
        var j = jQuery.fn[f];
        jQuery.fn[f] =
                function () {
                    var g = arguments, k;
                    k = typeof arguments[1];
                    if (typeof arguments[0] == "string" && (k == "object" || k == "function") && !arguments[1].nodeType && !arguments[1].jquery)g = [a.View.apply(a.View, a.makeArray(arguments))];
                    for (var o in jQuery.View.hookups);
                    if (o)g[0] = a(g[0]);
                    k = j.apply(this, g);
                    if (o) {
                        var s = g[0];
                        g = a.View.hookups;
                        var q;
                        o = 0;
                        var r, v;
                        a.View.hookups = {};
                        s = s.add("[data-view-id]", s);
                        for (q = s.length; o < q; o++)if (s[o].getAttribute && (r = s[o].getAttribute("data-view-id")) && (v = g[r])) {
                            v(s[o], r);
                            delete g[r];
                            s[o].removeAttribute("data-view-id")
                        }
                        a.extend(a.View.hookups,
                                g)
                    }
                    return k
                }
    }, e = 0; e < b.length; e++)c(b[e])
})(jQuery);
(function (a) {
    var d = a.extend, b = a.isArray, c = function (e) {
        if (this.constructor != c) {
            var f = new c(e);
            return function (g, k) {
                return f.render(g, k)
            }
        }
        if (typeof e == "function") {
            this.template = {};
            this.template.process = e
        } else {
            a.extend(this, c.options, e);
            var j = new c.Compiler(this.text, this.type);
            j.compile(e, this.name);
            this.template = j
        }
    };
    a.View.EJS = c;
    c.prototype = {constructor:c, render:function (e, f) {
        e = e || {};
        this._extra_helpers = f;
        var j = new c.Helpers(e, f || {});
        return this.template.process.call(e, e, j)
    }, out:function () {
        return this.template.out
    }};
    c.defaultSplitRegexp = /(<%%)|(%%>)|(<%=)|(<%#)|(<%)|(%>\n)|(%>)|(\n)/;
    c.Scanner = function (e, f, j) {
        d(this, {left_delimiter:f + "%", right_delimiter:"%" + j, double_left:f + "%%", double_right:"%%" + j, left_equal:f + "%=", left_comment:f + "%#"});
        this.SplitRegexp = f == "<" ? c.defaultSplitRegexp : RegExp("(" + this.double_left + ")|(%%" + this.double_right + ")|(" + this.left_equal + ")|(" + this.left_comment + ")|(" + this.left_delimiter + ")|(" + this.right_delimiter + "\n)|(" + this.right_delimiter + ")|(\n)");
        this.source = e;
        this.stag = null;
        this.lines =
                0
    };
    c.Scanner.to_text = function (e) {
        var f;
        if (e == null || e === undefined)return"";
        if (e instanceof Date)return e.toDateString();
        if (e.hookup) {
            f = a.View.hookup(function (j, g) {
                e.hookup.call(e, j, g)
            });
            return"data-view-id='" + f + "'"
        }
        if (typeof e == "function")return"data-view-id='" + a.View.hookup(e) + "'";
        if (b(e)) {
            f = a.View.hookup(function (j, g) {
                for (var k = 0, o = e.length; k < o; k++)(e[k].hookup || e[k])(j, g)
            });
            return"data-view-id='" + f + "'"
        }
        if (e.nodeName || e.jQuery)throw"elements in views are not supported";
        if (e.toString)return f ? e.toString(f) :
                e.toString();
        return""
    };
    c.Scanner.prototype = {scan:function (e) {
        var f = this.SplitRegexp;
        if (this.source != "") {
            var j = a.String.rsplit(this.source, /\n/), g, k;
            g = 0;
            for (k = j.length; g < k; g++)this.scanline(j[g], f, e)
        }
    }, scanline:function (e, f, j) {
        this.lines++;
        e = a.String.rsplit(e, f);
        var g;
        for (f = 0; (g = e[f]) != null; f++)try {
            j(g, this)
        } catch (k) {
            throw{type:"jQuery.View.EJS.Scanner", line:this.lines};
        }
    }};
    c.Buffer = function (e, f) {
        this.line = [];
        this.script = "";
        this.pre_cmd = e;
        this.post_cmd = f;
        for (var j = 0, g = this.pre_cmd.length; j < g; j++)this.push(e[j])
    };
    c.Buffer.prototype = {push:function (e) {
        this.line.push(e)
    }, cr:function () {
        this.script += this.line.join("; ");
        this.line = [];
        this.script += "\n"
    }, close:function () {
        if (this.line.length > 0) {
            for (var e = 0, f = this.post_cmd.length; e < f; e++)this.push(pre_cmd[e]);
            this.script += this.line.join("; ");
            line = null
        }
    }};
    c.Compiler = function (e, f) {
        this.pre_cmd = ["var ___ViewO = [];"];
        this.post_cmd = [];
        this.source = " ";
        if (e != null) {
            if (typeof e == "string") {
                e = e.replace(/\r\n/g, "\n");
                this.source = e = e.replace(/\r/g, "\n")
            } else if (e.innerHTML)this.source =
                    e.innerHTML;
            if (typeof this.source != "string")this.source = ""
        }
        f = f || "<";
        var j = ">";
        switch (f) {
            case "[":
                j = "]";
                break;
            case "<":
                break;
            default:
                throw f + " is not a supported deliminator";
        }
        this.scanner = new c.Scanner(this.source, f, j);
        this.out = ""
    };
    c.Compiler.prototype = {compile:function (e, f) {
        e = e || {};
        this.out = "";
        var j = new c.Buffer(this.pre_cmd, this.post_cmd), g = "", k = function (r) {
            r = r.replace(/\\/g, "\\\\");
            r = r.replace(/\n/g, "\\n");
            return r = r.replace(/"/g, '\\"')
        };
        this.scanner.scan(function (r, v) {
            if (v.stag == null)switch (r) {
                case "\n":
                    g +=
                            "\n";
                    j.push('___ViewO.push("' + k(g) + '");');
                    j.cr();
                    g = "";
                    break;
                case v.left_delimiter:
                case v.left_equal:
                case v.left_comment:
                    v.stag = r;
                    g.length > 0 && j.push('___ViewO.push("' + k(g) + '")');
                    g = "";
                    break;
                case v.double_left:
                    g += v.left_delimiter;
                    break;
                default:
                    g += r;
                    break
            } else switch (r) {
                case v.right_delimiter:
                    switch (v.stag) {
                        case v.left_delimiter:
                            if (g[g.length - 1] == "\n") {
                                g = g.substr(0, g.length - 1);
                                j.push(g);
                                j.cr()
                            } else j.push(g);
                            break;
                        case v.left_equal:
                            j.push("___ViewO.push((jQuery.View.EJS.Scanner.to_text(" + g + ")))");
                            break
                    }
                    v.stag =
                            null;
                    g = "";
                    break;
                case v.double_right:
                    g += v.right_delimiter;
                    break;
                default:
                    g += r;
                    break
            }
        });
        g.length > 0 && j.push('___ViewO.push("' + k(g) + '")');
        j.close();
        this.out = j.script + ";";
        var o = ["/*", f, "*/this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {", this.out, " return ___ViewO.join('');}}}catch(e){console.log(___ViewO);e.lineNumber=null;throw e;}};"].join("");
        try {
            eval(o)
        } catch (s) {
            if (typeof JSLINT != "undefined") {
                JSLINT(this.out);
                for (var q = 0; q < JSLINT.errors.length; q++) {
                    o = JSLINT.errors[q];
                    if (o.reason != "Unnecessary semicolon.") {
                        o.line++;
                        q = Error(o.reason);
                        q.lineNumber = o.line;
                        if (e.view)q.fileName = e.view;
                        throw q;
                    }
                }
            } else throw s;
        }
    }};
    c.options = {cache:true, type:"<", ext:".ejs"};
    c.INVALID_PATH = -1;
    c.Helpers = function (e, f) {
        this._data = e;
        this._extras = f;
        d(this, f)
    };
    c.Helpers.prototype = {view:function (e, f, j) {
        if (!j)j = this._extras;
        if (!f)f = this._data;
        return a.View(e, f, j)
    }, to_text:function (e, f) {
        if (e == null || e === undefined)return f || "";
        if (e instanceof Date)return e.toDateString();
        if (e.toString)return e.toString().replace(/\n/g,
                "<br />").replace(/''/g, "'");
        return""
    }, plugin:function () {
        var e = a.makeArray(arguments), f = e.shift();
        return function (j) {
            j = a(j);
            j[f].apply(j, e)
        }
    }};
    a.View.register({suffix:"ejs", get:function (e, f) {
        var j = f.match(/\.[\w\d]+[\?]+/), g = "", k = "ejs.js ERROR: There is no template or an empty template at " + f;
        g = a.ajax({async:false, url:f + (j ? "&" : "?") + ("cver=" + gsConfig.coreVersion), dataType:"text", statusCode:{404:function (o) {
            console.warn(o);
            throw k;
        }}, error:function () {
            throw k;
        }}).responseText;
        if (!g.match(/[^\s]/))throw"ejs.js ERROR: There is no template or an empty template at " +
                f;
        return this.renderer(e, g)
    }, script:function (e, f) {
        return["jQuery.View.EJS(function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {", (new c({text:f})).out(), " return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}})"].join("")
    }, renderer:function (e, f) {
        var j = new c({text:f, name:e});
        return function (g, k) {
            return j.render.call(j, g, k)
        }
    }})
})(jQuery);


(function (a) {
    var d = a.String.underscore;
    jQuery.Class.extend("jQuery.Model", {setup:function () {
        this.attributes = {};
        this.associations = {};
        this._fullName = d(this.fullName.replace(/\./g, "_"));
        if (this.fullName.substr(0, 7) != "jQuery.")jQuery.Model.models[this._fullName] = this
    }, defaults:{}, wrap:function (b) {
        if (!b)return null;
        return new this(b[this.singularName] || b.attributes || b)
    }, wrapMany:function (b) {
        if (!b)return null;
        var c = new (this.List || Array), e = a.isArray(b), f = e ? b : b.data, j = f.length, g = 0;
        for (c._use_call = true; g <
                j; g++)c.push(this.wrap(f[g]));
        if (!e)for (var k in b)if (k !== "data")c[k] = b[k];
        return c
    }, id:"id", addAttr:function (b, c) {
        this.attributes[b] || (this.attributes[b] = c);
        return c
    }, models:{}, guessType:function (b) {
        if (typeof b != "string") {
            if (b == null)return typeof b;
            if (b.constructor == Date)return"date";
            if (a.isArray(b))return"array";
            return typeof b
        }
        if (b == "")return"string";
        if (b == "true" || b == "false")return"boolean";
        if (!isNaN(b))return"number";
        return typeof b
    }, converters:{date:function (b) {
        return this._parseDate(b)
    }, number:function (b) {
        return parseFloat(b)
    },
        "boolean":function (b) {
            return Boolean(b)
        }}, _parseDate:function (b) {
        return typeof b == "string" ? Date.parse(b) == NaN ? null : Date.parse(b) : b
    }}, {init:function (b) {
        this.Class.defaults && this.attrs(this.Class.defaults);
        this.attrs(b)
    }, attr:function (b, c) {
        c !== undefined && this._setProperty(b, c);
        return this[b]
    }, _setProperty:function (b, c) {
        var e = this.Class, f = e.attributes[b] || e.addAttr(b, e.guessType(c));
        f = e.converters[f];
        this[b] = c == null ? null : f ? f.call(e, c) : c
    }, attrs:function (b) {
        var c;
        if (b) {
            var e = this.Class.id;
            for (c in b)c !=
                    e && this.attr(c, b[c]);
            e in b && this.attr(e, b[e])
        } else {
            b = {};
            for (c in this.Class.attributes)b[c] = this.attr(c)
        }
        return b
    }});
    a.fn.models = function () {
        var b = [], c, e;
        this.each(function () {
            a.each(a.data(this, "models") || {}, function (f, j) {
                c = c === undefined ? j.Class.List || null : j.Class.List === c ? c : null;
                b.push(j)
            })
        });
        e = new (c || a.Model.list || Array);
        e.push.apply(e, a.unique(b));
        return e
    };
    a.fn.model = function () {
        return this.models.apply(this, arguments)[0]
    }
})(jQuery);


(function (a) {
    this._ = {defined:function (d) {
        return d !== a && d !== null
    }, notDefined:function (d) {
        return d === a || d === null
    }, orEqual:function (d, b) {
        return this.defined(d) ? d : b
    }, measure:function (d, b, c) {
        var e;
        if (d._wrapped)return d; else {
            e = function () {
                console.time(b);
                d.apply(c || window, arguments);
                console.timeEnd(b)
            };
            e._wrapped = true;
            return e
        }
    }, orEqualEx:function () {
        var d, b = arguments.length;
        for (d = 0; d < b; d++)if (this.defined(arguments[d]))return arguments[d];
        return arguments[b - 1]
    }, generate404:function () {
        return"#!/notFound"
    },
        redirectSong:function (d, b) {
            console.log("redirect user to song: " + d);
            _.orEqual(b, window.event);
            var c = GS.Models.Song.getOneFromCache(d);
            if (!(c && c.SongID && c.SongID > 0))throw"redirectSong: Invalid SongID given: " + d;
            url = _.cleanUrl(c.SongName, c.SongID, "song", c.getToken());
            GS.router.setHash(url)
        }, cleanUrl:function (d, b, c, e, f) {
            var j;
            j = "";
            if (isNaN(parseInt(b, 10))) {
                j = b;
                b = d;
                d = j
            }
            d = d || "Unknown";
            d = _.cleanNameForURL(d, c != "user");
            c = c.toLowerCase();
            f = _.orEqual(f, "");
            if (f.length)f = "/" + f;
            if (c === "s" && !e)return _.generate404();
            if (e) {
                if (c == "song")c = "s";
                j = "#!/" + c + "/" + d + "/" + e + f + "?src=5"
            } else j = "#!/" + c + "/" + d + "/" + b + f;
            return j
        }, makeUrlFromPathName:function (d, b) {
            b = _.orEqual(b, "");
            if (b.length)b = "/" + b;
            return"#!/" + d + b
        }, makeUrlForShare:function (d, b, c) {
            var e = encodeURIComponent("http://grooveshark.com" + c.toUrl().replace("#!", "")), f = "";
            switch (b) {
                case "song":
                    f = c.ArtistName + " - " + c.SongName;
                    break;
                case "playlist":
                    f = c.PlaylistName + " by " + c.UserName;
                    break;
                case "album":
                case "artist":
                    f = c.ArtistName;
                    break
            }
            f = encodeURIComponent(f);
            switch (d) {
                case "reddit":
                    return"http://www.reddit.com/submit?title=" +
                            f + "&url=" + e;
                case "stumbleupon":
                    return"http://www.stumbleupon.com/submit?url=" + e
            }
            return""
        }, cleanNameForURL:function (d, b) {
            if (b = _.orEqual(b, true))d = _.ucwords(d, true);
            d = ("" + d).replace(/&/g, " and ").replace(/#/g, " number ").replace(/[^\w]/g, "_");
            d = d.replace(/\s+/g, "_");
            d = encodeURIComponent(d);
            d = d.replace(/_+/g, "+");
            d = d.replace(/^\++|\++$/g, "");
            if (d == "")d = "-";
            return d
        }, cleanURLSlug:function (d) {
            d = d.replace(/^\s+|\s+$/g, "");
            d = d.toLowerCase();
            for (var b = 0; b < 28; b++)d = d.replace(RegExp("\u00e0\u00e1\u00e4\u00e2\u00e8\u00e9\u00eb\u00ea\u00ec\u00ed\u00ef\u00ee\u00f2\u00f3\u00f6\u00f4\u00f9\u00fa\u00fc\u00fb\u00f1\u00e7\u00b7/_,:;".charAt(b),
                    "g"), "aaaaeeeeiiiioooouuuunc------".charAt(b));
            return d = d.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "_").replace(/-+/g, "_").replace(/^_+|_+$/g, "")
        }, cleanTextDiv:$(document.createElement("div")), cleanText:function (d) {
            if ((d = $.trim(d)) && d.length) {
                var b = _.cleanTextDiv;
                b.empty().append((b[0] && b[0].ownerDocument || document).createTextNode(d));
                return $.trim(b[0].innerHTML.replace(/\"/g, "&quot;").replace(/&amp\;/g, "&"))
            }
            return""
        }, uncleanText:function (d) {
            if (d && d.length)return _.cleanTextDiv.html(d).text().replace(/\"/g,
                    '"');
            return""
        }, getString:function (d, b) {
            var c = $.localize.getString(d);
            if (c && c.length)return(new GS.Models.DataString(c, b)).render();
            return""
        }, ucwords:function (d, b) {
            b || (d = (d + "").toLowerCase());
            return(d + "").replace(/^(.)|\s(.)/g, function (c) {
                return c.toUpperCase()
            })
        }, arrRemove:function (d, b, c) {
            d.splice(b, (c || b || 1) + (b < 0 ? d.length : 0));
            return d
        }, arrUnique:function (d) {
            for (var b = [], c = {}, e = 0, f = d.length; e < f; e++)if (!c[d[e]]) {
                b.push(d[e]);
                c[d[e]] = true
            }
            return b
        }, isNumber:function (d) {
            return d === +d || Object.prototype.toString.call(d) ===
                    "[object Number]"
        }, isObject:function (d) {
            return typeof d === "object"
        }, isArray:Array.isArray || function (d) {
            return!!(d && d.concat && d.unshift && !d.callee)
        }, isString:function (d) {
            return!!(d === "" || d && d.charCodeAt && d.substr)
        }, forEach:function (d, b, c) {
            if (!_.isEmpty(d)) {
                if (Array.prototype.forEach && d.forEach === Array.prototype.forEach)d.forEach(b, c); else if (_.isNumber(d.length))for (var e = 0, f = d.length; e < f; e++)b.call(c, d[e], e, d); else for (e in d)Object.prototype.hasOwnProperty.call(d, e) && b.call(c, d[e], e, d);
                return d
            }
        },
        map:function (d, b, c) {
            if (Array.prototype.map && d.map === Array.prototype.map)return d.map(b, c);
            var e = [];
            _.forEach(d, function (f, j, g) {
                e.push(b.call(c, f, j, g))
            });
            return e
        }, arrInclude:function (d, b) {
            return d.indexOf(b) != -1
        }, toArray:function (d) {
            var b = [];
            for (var c in d)d.hasOwnProperty(c) && d[c] !== true && b.push(d[c]);
            return b
        }, toArrayID:function (d) {
            var b = [];
            for (var c in d)d.hasOwnProperty(c) && b.push(c);
            return b
        }, isEmpty:function (d) {
            if (_.isArray(d) || _.isString(d))return d.length === 0;
            for (var b in d)if (Object.prototype.hasOwnProperty.call(d,
                    b))return false;
            return true
        }, count:function (d) {
            var b = 0;
            for (var c in d)d.hasOwnProperty(c) && b++;
            return b
        }, unixTime:function (d) {
            d = _.orEqual(d, new Date);
            return parseInt(d.getTime() / 1E3, 10)
        }, millisToMinutesSeconds:function (d, b) {
            b = _.orEqual(b, false);
            var c = Math.round((d ? d : 0) / 1E3), e = Math.floor(c / 60);
            c -= e * 60;
            if (c < 10)c = "0" + c;
            if (e < 10 && b)e = "0" + e;
            return e + ":" + c
        }, dobToAge:function (d, b, c) {
            d = d && _.notDefined(b) && _.notDefined(c) ? new Date(d) : new Date(d, b, c);
            d = ((new Date).getTime() - d.getTime()) / 864E5;
            d = Math.floor(d /
                    365.24);
            return isNaN(d) ? false : d
        }, guessDragType:function (d) {
            if (typeof d === "undefined")return"unknown";
            if ($.isArray(d) && d.length)d = d[0];
            if (typeof d.SongID !== "undefined")return"song";
            if (typeof d.AlbumID !== "undefined")return"album";
            if (typeof d.ArtistID !== "undefined")return"artist";
            if (typeof d.PlaylistID !== "undefined")return"playlist";
            if (typeof d.UserID !== "undefined")return"user";
            if (typeof d.StationID !== "undefined")return"station";
            return"unknown"
        }, globalDragProxyMousewheel:function (d, b) {
            var c = $("#shortcuts_scroll .viewport");
            if (c.within(d.clientX, d.clientY).length > 0)c.scrollTop(c.scrollTop() - 82 * b); else {
                c = $("#queue_list_window");
                if (c.within(d.clientX, d.clientY).length > 0)c.scrollLeft(c.scrollLeft() - 82 * b); else {
                    c = $("#sidebar_pinboard .viewport");
                    if (c.within(d.clientX, d.clientY).length > 0)c.scrollTop(c.scrollTop() - 82 * b); else {
                        c = (c = $("#grid").controller()) && c.options.scrollPane ? c.options.scrollPane : $("#grid .slick-viewport");
                        c.within(d.clientX, d.clientY).length > 0 && c.scrollTop(c.scrollTop() - 82 * b)
                    }
                }
            }
        }, browserDetect:function () {
            var d =
            {browser:"", version:0}, b = navigator.userAgent.toLowerCase();
            $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
            $.browser.adobeair = /adobeair/.test(navigator.userAgent.toLowerCase());
            if ($.browser.msie) {
                b = $.browser.version;
                b = b.substring(0, b.indexOf("."));
                d.browser = "msie";
                d.version = parseFloat(b)
            }
            if ($.browser.chrome && !$.browser.msie) {
                b = b.substring(b.indexOf("chrome/") + 7);
                b = b.substring(0, b.indexOf("."));
                d.browser = "chrome";
                d.version = parseFloat(b);
                $.browser.safari = false
            }
            if ($.browser.adobeair) {
                b =
                        b.substring(b.indexOf("adobeair/") + 9);
                b = b.substring(0, b.indexOf("."));
                d.browser = "adobeair";
                d.version = parseFloat(b);
                $.browser.safari = false
            }
            if ($.browser.safari) {
                b = b.substring(b.indexOf("safari/") + 7);
                b = b.substring(0, b.indexOf("."));
                d.browser = "safari";
                d.version = parseFloat(b)
            }
            if ($.browser.mozilla)if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
                b = b.substring(b.indexOf("firefox/") + 8);
                b = b.substring(0, b.indexOf("."));
                d.browser = "firefox";
                d.version = parseFloat(b)
            } else {
                d.browser = "mozilla";
                d.version =
                        parseFloat($.browser.version)
            }
            if ($.browser.opera) {
                b = b.substring(b.indexOf("version/") + 8);
                b = b.substring(0, b.indexOf("."));
                d.browser = "opera";
                d.version = parseFloat(b)
            }
            return d
        }, getSort:function (d, b) {
            b = b ? 1 : -1;
            return function (c, e) {
                var f = _.isString(c[d]) ? c[d].toLowerCase() : c[d], j = _.isString(e[d]) ? e[d].toLowerCase() : e[d];
                if (f > j)return b;
                if (f < j)return-1 * b;
                return 0
            }
        }, numSortA:function (d, b) {
            return d - b
        }, numSortD:function (d, b) {
            return b - d
        }, expandedTrace:function (d, b) {
            b = _.orEqual(b, "");
            for (var c in d)if (d.hasOwnProperty(c)) {
                console.log(b +
                        c + ": " + d[c]);
                d[c] && d[c].toString() === "[object Object]" && this.expandedTrace(d[c], b + "\t")
            }
        }, printf:function (d, b) {
            return b ? (new GS.Models.DataString($.localize.getString(d), b)).render() : $.localize.getString(d)
        }, wait:function (d) {
            return $.Deferred(function (b) {
                setTimeout(b.resolve, d)
            })
        }, checkEmailMisspells:function (d, b) {
            var c = d.split("@");
            if (c < 2)return{error:"Not an valid e-mail."};
            var e = function (f, j) {
                for (var g, k = 99, o = null, s = 0; s < j.length; s++) {
                    g = j[s];
                    if (f == null || f.length === 0)g = g == null || g.length === 0 ? 0 : g.length;
                    else if (g == null || g.length === 0)g = f.length; else {
                        for (var q = 0, r = 0, v = 0, t = 0; q + r < f.length && q + v < g.length;) {
                            if (f[q + r] == g[q + v])t++; else for (var y = v = r = 0; y < 5; y++) {
                                if (q + y < f.length && f[q + y] == g[q]) {
                                    r = y;
                                    break
                                }
                                if (q + y < g.length && f[q] == g[q + y]) {
                                    v = y;
                                    break
                                }
                            }
                            q++
                        }
                        g = (f.length + g.length) / 2 - t
                    }
                    if (g < k) {
                        k = g;
                        o = j[s]
                    }
                }
                return k <= 2 && o !== null && o !== f ? o : false
            }(c[1], ["yahoo.com", "google.com", "hotmail.com", "gmail.com", "me.com", "aol.com", "mac.com", "live.com", "comcast.net", "googlemail.com", "msn.com", "hotmail.co.uk", "yahoo.co.uk", "facebook.com",
                "verizon.net", "sbcglobal.net", "att.net", "gmx.com", "mail.com"]);
            return e ? b({address:c[0], domain:e, full:c[0] + "@" + e}) : {}
        }, USPhoneRegex:/^(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})$/i, emailRegex:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i, keys:{ESC:27,
            ENTER:13, UP:38, DOWN:40, LEFT:37, RIGHT:39, TAB:9, BACKSPACE:8, AT:64}, states:["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"], countries:[
            {iso:"US", name:"United States"},
            {iso:"AF", name:"Afghanistan"},
            {iso:"AL", name:"Albania"},
            {iso:"DZ", name:"Algeria"},
            {iso:"AS", name:"American Samoa"},
            {iso:"AD", name:"Andorra"},
            {iso:"AO", name:"Angola"},
            {iso:"AI", name:"Anguilla"},
            {iso:"AQ", name:"Antarctica"},
            {iso:"AG", name:"Antigua and Barbuda"},
            {iso:"AR", name:"Argentina"},
            {iso:"AM", name:"Armenia"},
            {iso:"AW", name:"Aruba"},
            {iso:"AU", name:"Australia"},
            {iso:"AT", name:"Austria"},
            {iso:"AX", name:"\u00c5land Islands"},
            {iso:"AZ", name:"Azerbaijan"},
            {iso:"BS", name:"Bahamas"},
            {iso:"BH", name:"Bahrain"},
            {iso:"BD", name:"Bangladesh"},
            {iso:"BB", name:"Barbados"},
            {iso:"BY", name:"Belarus"},
            {iso:"BE", name:"Belgium"},
            {iso:"BZ", name:"Belize"},
            {iso:"BJ", name:"Benin"},
            {iso:"BM", name:"Bermuda"},
            {iso:"BT", name:"Bhutan"},
            {iso:"BO", name:"Bolivia"},
            {iso:"BA", name:"Bosnia and Herzegovina"},
            {iso:"BW", name:"Botswana"},
            {iso:"BV", name:"Bouvet Island", callingCode:""},
            {iso:"BR", name:"Brazil"},
            {iso:"IO", name:"British Indian Ocean Territory"},
            {iso:"BN", name:"Brunei Darussalam"},
            {iso:"BG", name:"Bulgaria"},
            {iso:"BF", name:"Burkina Faso"},
            {iso:"BI", name:"Burundi"},
            {iso:"KH", name:"Cambodia"},
            {iso:"CM", name:"Cameroon"},
            {iso:"CA", name:"Canada"},
            {iso:"CV", name:"Cape Verde"},
            {iso:"KY", name:"Cayman Islands"},
            {iso:"CF", name:"Central African Republic"},
            {iso:"TD", name:"Chad"},
            {iso:"CL", name:"Chile"},
            {iso:"CN", name:"China"},
            {iso:"CX", name:"Christmas Island"},
            {iso:"CC", name:"Cocos (Keeling) Islands"},
            {iso:"CO", name:"Colombia"},
            {iso:"KM", name:"Comoros"},
            {iso:"CG", name:"Congo"},
            {iso:"CD", name:"Congo, the Democratic Republic of the"},
            {iso:"CK", name:"Cook Islands"},
            {iso:"CR", name:"Costa Rica"},
            {iso:"CI", name:"Cote D'Ivoire"},
            {iso:"HR", name:"Croatia"},
            {iso:"CU", name:"Cuba"},
            {iso:"CY",
                name:"Cyprus"},
            {iso:"CZ", name:"Czech Republic"},
            {iso:"DK", name:"Denmark"},
            {iso:"DJ", name:"Djibouti"},
            {iso:"DM", name:"Dominica"},
            {iso:"DO", name:"Dominican Republic"},
            {iso:"EC", name:"Ecuador"},
            {iso:"EG", name:"Egypt"},
            {iso:"SV", name:"El Salvador"},
            {iso:"GQ", name:"Equatorial Guinea"},
            {iso:"ER", name:"Eritrea"},
            {iso:"EE", name:"Estonia"},
            {iso:"ET", name:"Ethiopia"},
            {iso:"FK", name:"Falkland Islands (Malvinas)"},
            {iso:"FO", name:"Faroe Islands"},
            {iso:"FJ", name:"Fiji"},
            {iso:"FI", name:"Finland"},
            {iso:"FR", name:"France"},
            {iso:"GF", name:"French Guiana"},
            {iso:"PF", name:"French Polynesia"},
            {iso:"TF", name:"French Southern Territories"},
            {iso:"GA", name:"Gabon"},
            {iso:"GM", name:"Gambia"},
            {iso:"GE", name:"Georgia"},
            {iso:"DE", name:"Germany"},
            {iso:"GH", name:"Ghana"},
            {iso:"GI", name:"Gibraltar"},
            {iso:"GR", name:"Greece"},
            {iso:"GL", name:"Greenland"},
            {iso:"GD", name:"Grenada"},
            {iso:"GP", name:"Guadeloupe"},
            {iso:"GU", name:"Guam"},
            {iso:"GT", name:"Guatemala"},
            {iso:"GN", name:"Guinea"},
            {iso:"GW", name:"Guinea-Bissau"},
            {iso:"GY", name:"Guyana"},
            {iso:"HT", name:"Haiti"},
            {iso:"HM", name:"Heard Island and Mcdonald Islands"},
            {iso:"VA", name:"Holy See (Vatican City State)"},
            {iso:"HN", name:"Honduras"},
            {iso:"HK", name:"Hong Kong"},
            {iso:"HU", name:"Hungary"},
            {iso:"IS", name:"Iceland"},
            {iso:"IN", name:"India"},
            {iso:"ID", name:"Indonesia"},
            {iso:"IR", name:"Iran, Islamic Republic of"},
            {iso:"IQ", name:"Iraq"},
            {iso:"IE", name:"Ireland"},
            {iso:"IL", name:"Israel"},
            {iso:"IT", name:"Italy"},
            {iso:"JM", name:"Jamaica"},
            {iso:"JP", name:"Japan"},
            {iso:"JE", name:"Jersey"},
            {iso:"JO",
                name:"Jordan"},
            {iso:"KZ", name:"Kazakhstan"},
            {iso:"KE", name:"Kenya"},
            {iso:"KI", name:"Kiribati"},
            {iso:"KP", name:"Korea, Democratic People's Republic of"},
            {iso:"KR", name:"Korea, Republic of"},
            {iso:"KW", name:"Kuwait"},
            {iso:"KG", name:"Kyrgyzstan"},
            {iso:"LA", name:"Lao People's Democratic Republic"},
            {iso:"LV", name:"Latvia"},
            {iso:"LB", name:"Lebanon"},
            {iso:"LS", name:"Lesotho"},
            {iso:"LR", name:"Liberia"},
            {iso:"LY", name:"Libyan Arab Jamahiriya"},
            {iso:"LI", name:"Liechtenstein"},
            {iso:"LT", name:"Lithuania"},
            {iso:"LU",
                name:"Luxembourg"},
            {iso:"MO", name:"Macao"},
            {iso:"MK", name:"Macedonia, the Former Yugoslav Republic of"},
            {iso:"MG", name:"Madagascar"},
            {iso:"MW", name:"Malawi"},
            {iso:"MY", name:"Malaysia"},
            {iso:"MV", name:"Maldives"},
            {iso:"ML", name:"Mali"},
            {iso:"MT", name:"Malta"},
            {iso:"MH", name:"Marshall Islands"},
            {iso:"MQ", name:"Martinique"},
            {iso:"MR", name:"Mauritania"},
            {iso:"MU", name:"Mauritius"},
            {iso:"YT", name:"Mayotte"},
            {iso:"MX", name:"Mexico"},
            {iso:"FM", name:"Micronesia, Federated States of"},
            {iso:"MD", name:"Moldova, Republic of"},
            {iso:"MC", name:"Monaco"},
            {iso:"MN", name:"Mongolia"},
            {iso:"ME", name:"Montenegro"},
            {iso:"MS", name:"Montserrat"},
            {iso:"MA", name:"Morocco"},
            {iso:"MZ", name:"Mozambique"},
            {iso:"MM", name:"Myanmar"},
            {iso:"NA", name:"Namibia"},
            {iso:"NR", name:"Nauru"},
            {iso:"NP", name:"Nepal"},
            {iso:"NL", name:"Netherlands"},
            {iso:"AN", name:"Netherlands Antilles"},
            {iso:"NC", name:"New Caledonia"},
            {iso:"NZ", name:"New Zealand"},
            {iso:"NI", name:"Nicaragua"},
            {iso:"NE", name:"Niger"},
            {iso:"NG", name:"Nigeria"},
            {iso:"NU", name:"Niue"},
            {iso:"NF",
                name:"Norfolk Island"},
            {iso:"MP", name:"Northern Mariana Islands"},
            {iso:"NO", name:"Norway"},
            {iso:"OM", name:"Oman"},
            {iso:"PK", name:"Pakistan"},
            {iso:"PW", name:"Palau"},
            {iso:"PS", name:"Palestinian Territory, Occupied"},
            {iso:"PA", name:"Panama"},
            {iso:"PG", name:"Papua New Guinea"},
            {iso:"PY", name:"Paraguay"},
            {iso:"PE", name:"Peru"},
            {iso:"PH", name:"Philippines"},
            {iso:"PN", name:"Pitcairn"},
            {iso:"PL", name:"Poland"},
            {iso:"PT", name:"Portugal"},
            {iso:"PR", name:"Puerto Rico"},
            {iso:"QA", name:"Qatar"},
            {iso:"RE", name:"Reunion"},
            {iso:"RO", name:"Romania"},
            {iso:"RU", name:"Russian Federation"},
            {iso:"RW", name:"Rwanda"},
            {iso:"SH", name:"Saint Helena"},
            {iso:"KN", name:"Saint Kitts and Nevis"},
            {iso:"LC", name:"Saint Lucia"},
            {iso:"PM", name:"Saint Pierre and Miquelon"},
            {iso:"VC", name:"Saint Vincent and the Grenadines"},
            {iso:"WS", name:"Samoa"},
            {iso:"SM", name:"San Marino"},
            {iso:"ST", name:"Sao Tome and Principe"},
            {iso:"SA", name:"Saudi Arabia"},
            {iso:"SN", name:"Senegal"},
            {iso:"RS", name:"Serbia"},
            {iso:"SC", name:"Seychelles"},
            {iso:"SL", name:"Sierra Leone"},
            {iso:"SG", name:"Singapore"},
            {iso:"SK", name:"Slovakia"},
            {iso:"SI", name:"Slovenia"},
            {iso:"SB", name:"Solomon Islands"},
            {iso:"SO", name:"Somalia"},
            {iso:"ZA", name:"South Africa"},
            {iso:"GS", name:"South Georgia and the South Sandwich Islands"},
            {iso:"ES", name:"Spain"},
            {iso:"LK", name:"Sri Lanka"},
            {iso:"SD", name:"Sudan"},
            {iso:"SR", name:"Suriname"},
            {iso:"SJ", name:"Svalbard and Jan Mayen"},
            {iso:"SZ", name:"Swaziland"},
            {iso:"SE", name:"Sweden"},
            {iso:"CH", name:"Switzerland"},
            {iso:"SY", name:"Syrian Arab Republic"},
            {iso:"TW", name:"Taiwan"},
            {iso:"TJ", name:"Tajikistan"},
            {iso:"TZ", name:"Tanzania, United Republic of"},
            {iso:"TH", name:"Thailand"},
            {iso:"TL", name:"Timor-Leste"},
            {iso:"TG", name:"Togo"},
            {iso:"TK", name:"Tokelau"},
            {iso:"TO", name:"Tonga"},
            {iso:"TT", name:"Trinidad and Tobago"},
            {iso:"TN", name:"Tunisia"},
            {iso:"TR", name:"Turkey"},
            {iso:"TM", name:"Turkmenistan"},
            {iso:"TC", name:"Turks and Caicos Islands"},
            {iso:"TV", name:"Tuvalu"},
            {iso:"UG", name:"Uganda"},
            {iso:"UA", name:"Ukraine"},
            {iso:"AE", name:"United Arab Emirates"},
            {iso:"GB", name:"United Kingdom"},
            {iso:"US", name:"United States"},
            {iso:"UM", name:"United States Minor Outlying Islands"},
            {iso:"UY", name:"Uruguay"},
            {iso:"UZ", name:"Uzbekistan"},
            {iso:"VU", name:"Vanuatu"},
            {iso:"VE", name:"Venezuela"},
            {iso:"VN", name:"Vietnam"},
            {iso:"VG", name:"Virgin Islands, British"},
            {iso:"VI", name:"Virgin Islands, U.S."},
            {iso:"WF", name:"Wallis and Futuna"},
            {iso:"EH", name:"Western Sahara"},
            {iso:"YE", name:"Yemen"},
            {iso:"ZM", name:"Zambia"},
            {iso:"ZW", name:"Zimbabwe"}
        ], countryCodes:{"2":"AD",
            "3":"AE", "4":"AF", "5":"AG", "6":"AI", "7":"AL", "8":"AM", "9":"AN", "10":"AO", "11":"AQ", "12":"AR", "13":"AS", "14":"AT", "15":"AU", "16":"AW", "17":"AX", "18":"AZ", "19":"BA", "20":"BB", "21":"BD", "22":"BE", "23":"BF", "24":"BG", "25":"BH", "26":"BI", "27":"BJ", "240":"BL", "28":"BM", "29":"BN", "30":"BO", "31":"BR", "32":"BS", "33":"BT", "34":"BV", "35":"BW", "36":"BY", "37":"BZ", "38":"CA", "241":"CC", "39":"CD", "40":"CF", "41":"CG", "42":"CH", "43":"CI", "44":"CK", "45":"CL", "46":"CM", "47":"CN", "48":"CO", "49":"CR", "50":"CS", "51":"CU",
            "52":"CV", "242":"CX", "53":"CY", "54":"CZ", "55":"DE", "56":"DJ", "57":"DK", "58":"DM", "59":"DO", "60":"DZ", "61":"EC", "62":"EE", "63":"EG", "243":"EH", "64":"ER", "65":"ES", "66":"ET", "67":"FI", "68":"FJ", "69":"FK", "70":"FM", "71":"FO", "72":"FR", "73":"GA", "221":"GB", "74":"GD", "75":"GE", "76":"GF", "77":"GG", "78":"GH", "79":"GI", "80":"GL", "81":"GM", "82":"GN", "83":"GP", "84":"GQ", "85":"GR", "86":"GS", "87":"GT", "88":"GU", "89":"GW", "90":"GY", "91":"HK", "92":"HM", "93":"HN", "94":"HR", "95":"HT", "96":"HU", "97":"ID", "98":"IE",
            "99":"IL", "100":"IM", "101":"IN", "102":"IO", "103":"IQ", "104":"IR", "105":"IS", "106":"IT", "107":"JE", "108":"JM", "109":"JO", "110":"JP", "111":"KE", "112":"KG", "113":"KH", "114":"KI", "115":"KM", "116":"KN", "117":"KP", "118":"KR", "119":"KW", "120":"KY", "121":"KZ", "122":"LA", "123":"LB", "124":"LC", "125":"LI", "126":"LK", "127":"LR", "128":"LS", "129":"LT", "130":"LU", "131":"LV", "132":"LY", "133":"MA", "134":"MC", "135":"MD", "136":"ME", "244":"MF", "137":"MG", "138":"MH", "139":"MK", "140":"ML", "141":"MM", "142":"MN", "143":"MO",
            "144":"MP", "145":"MQ", "146":"MR", "147":"MS", "148":"MT", "149":"MU", "150":"MV", "151":"MW", "152":"MX", "153":"MY", "154":"MZ", "155":"NA", "156":"NC", "157":"NE", "158":"NF", "159":"NG", "160":"NI", "161":"NL", "162":"NO", "163":"NP", "164":"NR", "165":"NU", "166":"NZ", "167":"OM", "168":"PA", "169":"PE", "170":"PF", "171":"PG", "172":"PH", "173":"PK", "174":"PL", "245":"PM", "175":"PN", "176":"PR", "246":"PS", "177":"PT", "178":"PW", "179":"PY", "180":"QA", "181":"RE", "182":"RO", "183":"RS", "184":"RU", "185":"RW", "186":"SA", "187":"SB",
            "188":"SC", "189":"SD", "190":"SE", "191":"SG", "247":"SH", "192":"SI", "248":"SJ", "193":"SK", "194":"SL", "195":"SM", "196":"SN", "197":"SO", "198":"SR", "199":"ST", "200":"SV", "201":"SY", "202":"SZ", "203":"TC", "204":"TD", "205":"TF", "206":"TG", "207":"TH", "208":"TJ", "209":"TK", "210":"TL", "211":"TM", "212":"TN", "213":"TO", "214":"TR", "215":"TT", "216":"TV", "217":"TW", "218":"TZ", "219":"UA", "220":"UG", "222":"UM", "223":"US", "224":"UY", "225":"UZ", "226":"VA", "227":"VC", "228":"VE", "229":"VG", "230":"VI", "231":"VN", "232":"VU",
            "233":"WF", "234":"WS", "235":"YE", "236":"YT", "237":"ZA", "238":"ZM", "239":"ZW"}, accentMap:{a:"\u1e9a\u00c1\u00e1\u00c0\u00e0\u0102\u0103\u1eae\u1eaf\u1eb0\u1eb1\u1eb4\u1eb5\u1eb2\u1eb3\u00c2\u00e2\u1ea4\u1ea5\u1ea6\u1ea7\u1eaa\u1eab\u1ea8\u1ea9\u01cd\u01ce\u00c5\u00e5\u01fa\u01fb\u00c4\u00e4\u01de\u01df\u00c3\u00e3\u0226\u0227\u01e0\u01e1\u0104\u0105\u0100\u0101\u1ea2\u1ea3\u0200\u0201\u0202\u0203\u1ea0\u1ea1\u1eb6\u1eb7\u1eac\u1ead\u1e00\u1e01\u023a\u2c65\u01fc\u01fd\u01e2\u01e3\uff21\uff41", b:"\u1e02\u1e03\u1e04\u1e05\u1e06\u1e07\u0243\u0180\u1d6c\u0181\u0253\u0182\u0183\uff42\uff22",
            c:"\u0106\u0107\u0108\u0109\u010c\u010d\u010a\u010b\u00c7\u00e7\u1e08\u1e09\u023b\u023c\u0187\u0188\u0255\uff43\uff23", d:"\u010e\u010f\u1e0a\u1e0b\u1e10\u1e11\u1e0c\u1e0d\u1e12\u1e13\u1e0e\u1e0f\u0110\u0111\u1d6d\u0189\u0256\u018a\u0257\u018b\u018c\u0221\u00f0\uff44\uff24", e:"\u00c9\u018f\u018e\u01dd\u00e9\u00c8\u00e8\u0114\u0115\u00ca\u00ea\u1ebe\u1ebf\u1ec0\u1ec1\u1ec4\u1ec5\u1ec2\u1ec3\u011a\u011b\u00cb\u00eb\u1ebc\u1ebd\u0116\u0117\u0228\u0229\u1e1c\u1e1d\u0118\u0119\u0112\u0113\u1e16\u1e17\u1e14\u1e15\u1eba\u1ebb\u0204\u0205\u0206\u0207\u1eb8\u1eb9\u1ec6\u1ec7\u1e18\u1e19\u1e1a\u1e1b\u0246\u0247\u025a\u025d\uff45\uff25",
            f:"\u1e1e\u1e1f\u1d6e\u0191\u0192\uff46\uff26", g:"\u01f4\u01f5\u011e\u011f\u011c\u011d\u01e6\u01e7\u0120\u0121\u0122\u0123\u1e20\u1e21\u01e4\u01e5\u0193\u0260\uff47\uff27", h:"\u0124\u0125\u021e\u021f\u1e26\u1e27\u1e22\u1e23\u1e28\u1e29\u1e24\u1e25\u1e2a\u1e2bH\u1e96\u0126\u0127\u2c67\u2c68\uff48\uff28", i:"\u00cd\u00cc\u00ec\u012c\u012d\u00ce\u00ee\u01cf\u01d0\u00cf\u00ef\u1e2e\u1e2f\u0128\u0129\u0130i\u012e\u012f\u012a\u012b\u1ec8\u1ec9\u0208\u0209\u020a\u020b\u1eca\u1ecb\u1e2c\u1e2dI\u0131\u0197\u0268\uff49\uff29",
            j:"\u0135J\u01f0\u0237\u0248\u0249\u029d\u025f\u0284\uff4a\uff2a\u0134", k:"\u2c69\u1e30\u2c6a\uff4b\uff2b\u1e31\u01e9\u01e8\u0137\u0136\u1e33\u1e32\u1e35\u1e34\u0199\u0198", l:"\u023d\u019a\u026b\u026c\u026d\u0234\u2c60\u2c61\u2c62\uff4c\uff2c\u013a\u0139\u013e\u013d\u0140\u013f\u0142\u0142\u0141\u0141\u013c\u013b\u1e39\u1e37\u1e38\u1e36\u1e3d\u1e3c\u1e3b\u1e3a", m:"\u0271\uff4d\uff2d\u1e3f\u1e3e\u1e41\u1e40\u1e43\u1e42", n:"\u019d\u0272\u0220\u019e\u0273\u0235\uff4e\uff2enN\u0144\u0143\u01f9\u01f8\u0148\u0147\u00f1\u00d1\u1e45\u1e44\u0146\u0145\u1e47\u1e46\u1e4b\u1e4a\u1e49\u1e48",
            o:"\uff4f\uff2f\u00f3\u00d3\u00f2\u00d2\u014f\u014e\u1ed1\u1ed3\u1ed7\u1ed5\u1ed9\u00f4\u1ed0\u1ed2\u1ed6\u1ed4\u1ed8\u00d4\u01d2\u01d1\u022b\u00f6\u0275\u022a\u00d6\u019f\u0151\u0150\u1e4d\u1e4f\u022d\u00f5\u1e4c\u1e4e\u022c\u00d5\u0231\u022f\u0230\u022e\u01ff\u00f8\u01fe\u00d8\u01ed\u01eb\u01ec\u01ea\u1e53\u1e51\u014d\u1e52\u1e50\u014c\u1ecf\u1ece\u020d\u020c\u020f\u020e\u1ecd\u1ecc\u1edb\u1edd\u1ee1\u1edf\u1ee3\u01a1\u1eda\u1edc\u1ee0\u1ede\u1ee2\u01a0", p:"\u01a4\u01a5\u2c63\uff50\uff30pP\u1e55\u1e54\u1e57\u1e56",
            q:"\u02a0\u024a\u024b\uff51\uff31", r:"\u024c\u024d\u027c\u027d\u027e\u1d72\u2c64\u1d73\uff52\uff32\u0155\u0154\u0159\u0158\u1e59\u1e58\u0157\u0156\u0211\u0210\u0213\u0212\u1e5d\u1e5b\u1e5c\u1e5a\u1e5f\u1e5e", s:"\u0282\uff53\uff33sS\u1e65\u015b\u1e64\u015a\u015d\u015c\u1e67\u0161\u1e66\u0160\u1e61\u1e60\u015f\u0219\u015e\u0218\u1e69\u1e63\u1e68\u1e62\u1e9b\u00df", t:"\u023e\u01ab\u01ac\u01ad\u01ae\u0288\u0236\u2c66\u1d75\uff54\uff34T\u0165\u0164\u1e97\u1e6b\u1e6a\u0167\u0166\u0163\u021b\u0162\u021a\u1e6d\u1e6c\u1e71\u1e70\u1e6f\u1e6e\u00fe\u00de",
            u:"\u0214\u0216\u0244\u0289\uff55\uff35\u00fa\u00da\u00f9\u00d9\u016d\u016c\u00fb\u00db\u01d4\u01d3\u016f\u016e\u01d8\u01dc\u01da\u01d6\u00fc\u01d7\u01db\u01d9\u01d5\u00dc\u0171\u0170\u1e79\u0169\u1e78\u0168\u0173\u0172\u1e7b\u016b\u1e7a\u016a\u1ee7\u1ee6\u0215\u0217\u1ee5\u1ee4\u1e73\u1e72\u1e77\u1e76\u1e75\u1e74\u1ee9\u1eeb\u1eef\u1eed\u1ef1\u01b0\u1ee8\u1eea\u1eee\u1eec\u1ef0\u01af", v:"\u01b2\u028b\uff56\uff36\u1e7d\u1e7c\u1e7f\u1e7e", w:"\uff57\uff37W\u1e83\u1e82\u1e81\u1e80\u0175\u0174\u1e98\u1e85\u1e84\u1e87\u1e86\u1e89\u1e88",
            x:"\uff58\uff38\u1e8d\u1e8c\u1e8b\u1e8a", y:"\u028f\u024e\u024f\uff59\uff39Y\u00fd\u00dd\u1ef3\u1ef2\u0177\u0176\u1e99\u00ff\u0178\u1ef9\u1ef8\u1e8f\u1e8e\u0233\u0232\u1ef7\u1ef6\u1ef5\u1ef4\u01b4\u01b3", z:"\u0290\u0291\u01ba\u2c6b\u2c6c\uff5a\uff3a\u017a\u0179\u1e91\u1e90\u017e\u017d\u017c\u017b\u01b6\u01b5\u1e93\u1e92\u1e95\u1e94\u0225\u0224\u01ef\u01ee"}, foldedAccents:{}, unfoldAccents:function (d) {
            return d
        }, randWeightedIndex:function (d) {
            var b, c, e;
            b = 0;
            for (e in d)if (d.hasOwnProperty(e))b += d[e];
            c = Math.random() *
                    b;
            for (e in d)if (d.hasOwnProperty(e)) {
                b = d[e];
                if (c <= b)return e; else c -= b
            }
            return 0
        }, httpBuildQuery:function (d) {
            var b = "";
            _.forEach(d, function (c, e) {
                b = b + e + "=" + encodeURIComponent(c) + "&"
            });
            return b = b.substring(0, b.length - 1)
        }, base62Encode:function (d) {
            for (var b = "", c = Math.floor(Math.log(d) / Math.log(62)); c >= 0; c--) {
                var e = Math.floor(d / Math.pow(62, c));
                b += "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[e];
                d -= e * Math.pow(62, c)
            }
            return b
        }};
    if (!Array.prototype.indexOf)Array.prototype.indexOf = function (d, b) {
        var c = this.length >>> 0, e = Number(b) || 0;
        e = e < 0 ? Math.ceil(e) : Math.floor(e);
        if (e < 0)e += c;
        for (; e < c; e++)if (e in this && this[e] === d)return e;
        return-1
    };
    if (!Array.prototype.unique)Array.prototype.unique = function () {
        for (var d = this.concat(), b = 0; b < d.length; ++b)for (var c = b + 1; c < d.length; ++c)d[b] === d[c] && d.splice(c, 1);
        return d
    };
    if (!Array.prototype.shuffle)Array.prototype.shuffle = function () {
        var d, b, c = this.concat(), e = c.length;
        if (e)for (; --e;) {
            b = Math.floor(Math.random() * (e + 1));
            d = c[b];
            c[b] = c[e];
            c[e] = d
        }
        return c
    };
    if (!Array.prototype.filter)Array.prototype.filter =
            function (d, b) {
                if (this === void 0 || this === null)throw new TypeError;
                var c = Object(this), e = c.length >>> 0;
                if (typeof d !== "function")throw new TypeError;
                for (var f = [], j = 0; j < e; j++)if (j in c) {
                    var g = c[j];
                    d.call(b, g, j, c) && f.push(g)
                }
                return f
            }
})();


if (!this.JSON)
    this.JSON = {};


(function () {
    function a(o) {
        return o < 10 ? "0" + o : o
    }

    function d(o) {
        e.lastIndex = 0;
        return e.test(o) ? '"' + o.replace(e, function (s) {
            var q = g[s];
            return typeof q === "string" ? q : "\\u" + ("0000" + s.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + o + '"'
    }

    function b(o, s) {
        var q, r, v, t, y = f, E, G = s[o];
        if (G && typeof G === "object" && typeof G.toJSON === "function")G = G.toJSON(o);
        if (typeof k === "function")G = k.call(s, o, G);
        switch (typeof G) {
            case "string":
                return d(G);
            case "number":
                return isFinite(G) ? String(G) : "null";
            case "boolean":
            case "null":
                return String(G);
            case "object":
                if (!G)return"null";
                f += j;
                E = [];
                if (Object.prototype.toString.apply(G) === "[object Array]") {
                    t = G.length;
                    for (q = 0; q < t; q += 1)E[q] = b(q, G) || "null";
                    v = E.length === 0 ? "[]" : f ? "[\n" + f + E.join(",\n" + f) + "\n" + y + "]" : "[" + E.join(",") + "]";
                    f = y;
                    return v
                }
                if (k && typeof k === "object") {
                    t = k.length;
                    for (q = 0; q < t; q += 1) {
                        r = k[q];
                        if (typeof r === "string")if (v = b(r, G))E.push(d(r) + (f ? ": " : ":") + v)
                    }
                } else for (r in G)if (Object.hasOwnProperty.call(G, r))if (v = b(r, G))E.push(d(r) + (f ? ": " : ":") + v);
                v = E.length === 0 ? "{}" : f ? "{\n" + f + E.join(",\n" + f) +
                        "\n" + y + "}" : "{" + E.join(",") + "}";
                f = y;
                return v
        }
    }

    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + a(this.getUTCMonth() + 1) + "-" + a(this.getUTCDate()) + "T" + a(this.getUTCHours()) + ":" + a(this.getUTCMinutes()) + ":" + a(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
            return this.valueOf()
        }
    }
    var c = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            e = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, f, j, g = {"\u0008":"\\b", "\t":"\\t", "\n":"\\n", "\u000c":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, k;
    if (typeof JSON.stringify !== "function")JSON.stringify = function (o, s, q) {
        var r;
        j = f = "";
        if (typeof q === "number")for (r = 0; r < q; r += 1)j += " "; else if (typeof q === "string")j = q;
        if ((k = s) && typeof s !== "function" && (typeof s !== "object" || typeof s.length !== "number"))throw Error("JSON.stringify");
        return b("",
                {"":o})
    };
    if (typeof JSON.parse !== "function")JSON.parse = function (o, s) {
        function q(v, t) {
            var y, E, G = v[t];
            if (G && typeof G === "object")for (y in G)if (Object.hasOwnProperty.call(G, y)) {
                E = q(G, y);
                if (E !== undefined)G[y] = E; else delete G[y]
            }
            return s.call(v, t, G)
        }

        var r;
        o = String(o);
        c.lastIndex = 0;
        if (c.test(o))o = o.replace(c, function (v) {
            return"\\u" + ("0000" + v.charCodeAt(0).toString(16)).slice(-4)
        });
        if (/^[\],:{}\s]*$/.test(o.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            r = eval("(" + o + ")");
            return typeof s === "function" ? q({"":r}, "") : r
        }
        throw new SyntaxError("JSON.parse");
    }
})();


var store = function () {
    var a = {}, d = window, b = d.document, c;
    a.set = function () {
    };
    a.get = function () {
    };
    a.remove = function () {
    };
    a.clear = function () {
    };
    a.transact = function (j, g) {
        var k = a.get(j);
        if (typeof k == "undefined")k = {};
        g(k);
        a.set(j, k)
    };
    a.serialize = function (j) {
        return JSON.stringify(j)
    };
    a.deserialize = function (j) {
        if (typeof j == "string")return JSON.parse(j)
    };
    try {
        if ("localStorage"in d && d.localStorage) {
            c = d.localStorage;
            a.set = function (j, g) {
                c.setItem(j, a.serialize(g))
            };
            a.get = function (j) {
                return a.deserialize(c.getItem(j))
            };
            a.remove = function (j) {
                c.removeItem(j)
            };
            a.clear = function () {
                c.clear()
            }
        } else if ("globalStorage"in d && d.globalStorage) {
            c = d.globalStorage[d.location.hostname];
            a.set = function (j, g) {
                c[j] = a.serialize(g)
            };
            a.get = function (j) {
                return a.deserialize(c[j] && c[j].value)
            };
            a.remove = function (j) {
                delete c[j]
            };
            a.clear = function () {
                for (var j in c)delete c[j]
            }
        } else if (b.documentElement.addBehavior) {
            c = document.getElementById("userDataTag");
            try {
                c.load("localStorage")
            } catch (e) {
                console.warn("localStorage turned off");
                c.parentNode.removeChild(c);
                c = null
            }
            d = function (j) {
                if (!c)return function () {
                };
                return function () {
                    try {
                        var g = Array.prototype.slice.call(arguments, 0);
                        c.load("localStorage");
                        return j.apply(a, g)
                    } catch (k) {
                        console.warn("localStorage error");
                        return null
                    }
                }
            };
            a.set = d(function (j, g) {
                j = j.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g, "-");
                c.setAttribute(j, a.serialize(g));
                try {
                    c.save("localStorage")
                } catch (k) {
                    a.cleanup()
                }
            });
            a.get = d(function (j) {
                j = j.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g,
                        "-");
                return a.deserialize(c.getAttribute(j))
            });
            a.remove = d(function (j) {
                j = j.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g, "-");
                c.removeAttribute(j);
                c.save("localStorage")
            });
            a.clear = d(function () {
                var j = c.XMLDocument.documentElement.attributes;
                c.load("localStorage");
                for (var g = 0, k; k = j[g]; g++)c.removeAttribute(k.name);
                c.save("localStorage")
            });
            a.cleanup = d(function () {
                var j = c.XMLDocument.documentElement.attributes;
                c.load("localStorage");
                for (var g =
                        0, k; k = j[g]; g++) {
                    c.removeAttribute(k.name);
                    try {
                        c.save("localStorage");
                        return
                    } catch (o) {
                    }
                }
            })
        }
    } catch (f) {
    }
    return a
}();


(function () {
    function a(b) {
        return function () {
            try {
                return store[b].apply(store, arguments)
            } catch (c) {
            }
        }
    }

    if (!window.GS)window.GS = {};
    if (!window.store)throw"store.js didn't load!";
    GS.store = {};
    for (var d in window.store)
        if (store.hasOwnProperty(d) && $.isFunction(store[d]))
            GS.store[d] = a(d)
})();


var swfobject = function () {
    function a() {
        if (!Aa) {
            try {
                var Q = K.getElementsByTagName("body")[0].appendChild(K.createElement("span"));
                Q.parentNode.removeChild(Q)
            } catch (fa) {
                return
            }
            Aa = true;
            Q = da.length;
            for (var ma = 0; ma < Q; ma++)da[ma]()
        }
    }

    function d(Q) {
        if (Aa)Q(); else da[da.length] = Q
    }

    function b(Q) {
        if (typeof ja.addEventListener != B)ja.addEventListener("load", Q, false); else if (typeof K.addEventListener != B)K.addEventListener("load", Q, false); else if (typeof ja.attachEvent != B)v(ja, "onload", Q); else if (typeof ja.onload ==
                "function") {
            var fa = ja.onload;
            ja.onload = function () {
                fa();
                Q()
            }
        } else ja.onload = Q
    }

    function c() {
        var Q = K.getElementsByTagName("body")[0], fa = K.createElement(N);
        fa.setAttribute("type", ba);
        var ma = Q.appendChild(fa);
        if (ma) {
            var va = 0;
            (function () {
                if (typeof ma.GetVariable != B) {
                    var ya = ma.GetVariable("$version");
                    if (ya) {
                        ya = ya.split(" ")[1].split(",");
                        pa.pv = [parseInt(ya[0], 10), parseInt(ya[1], 10), parseInt(ya[2], 10)]
                    }
                } else if (va < 10) {
                    va++;
                    setTimeout(arguments.callee, 10);
                    return
                }
                Q.removeChild(fa);
                ma = null;
                e()
            })()
        } else e()
    }

    function e() {
        var Q = W.length;
        if (Q > 0)for (var fa = 0; fa < Q; fa++) {
            var ma = W[fa].id, va = W[fa].callbackFn, ya = {success:false, id:ma};
            if (pa.pv[0] > 0) {
                var Fa = r(ma);
                if (Fa)if (t(W[fa].swfVersion) && !(pa.wk && pa.wk < 312)) {
                    E(ma, true);
                    if (va) {
                        ya.success = true;
                        ya.ref = f(ma);
                        va(ya)
                    }
                } else if (W[fa].expressInstall && j()) {
                    ya = {};
                    ya.data = W[fa].expressInstall;
                    ya.width = Fa.getAttribute("width") || "0";
                    ya.height = Fa.getAttribute("height") || "0";
                    if (Fa.getAttribute("class"))ya.styleclass = Fa.getAttribute("class");
                    if (Fa.getAttribute("align"))ya.align =
                            Fa.getAttribute("align");
                    var Ha = {};
                    Fa = Fa.getElementsByTagName("param");
                    for (var Pa = Fa.length, Qa = 0; Qa < Pa; Qa++)if (Fa[Qa].getAttribute("name").toLowerCase() != "movie")Ha[Fa[Qa].getAttribute("name")] = Fa[Qa].getAttribute("value");
                    g(ya, Ha, ma, va)
                } else {
                    k(Fa);
                    va && va(ya)
                }
            } else {
                E(ma, true);
                if (va) {
                    if ((ma = f(ma)) && typeof ma.SetVariable != B) {
                        ya.success = true;
                        ya.ref = ma
                    }
                    va(ya)
                }
            }
        }
    }

    function f(Q) {
        var fa = null;
        if ((Q = r(Q)) && Q.nodeName == "OBJECT")if (typeof Q.SetVariable != B)fa = Q; else if (Q = Q.getElementsByTagName(N)[0])fa = Q;
        return fa
    }

    function j() {
        return!za && t("6.0.65") && (pa.win || pa.mac) && !(pa.wk && pa.wk < 312)
    }

    function g(Q, fa, ma, va) {
        za = true;
        la = va || null;
        wa = {success:false, id:ma};
        var ya = r(ma);
        if (ya) {
            if (ya.nodeName == "OBJECT") {
                m = o(ya);
                P = null
            } else {
                m = ya;
                P = ma
            }
            Q.id = L;
            if (typeof Q.width == B || !/%$/.test(Q.width) && parseInt(Q.width, 10) < 310)Q.width = "310";
            if (typeof Q.height == B || !/%$/.test(Q.height) && parseInt(Q.height, 10) < 137)Q.height = "137";
            K.title = K.title.slice(0, 47) + " - Flash Player Installation";
            va = pa.ie && pa.win ? "ActiveX" : "PlugIn";
            va = "MMredirectURL=" +
                    ja.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + va + "&MMdoctitle=" + K.title;
            if (typeof fa.flashvars != B)fa.flashvars += "&" + va; else fa.flashvars = va;
            if (pa.ie && pa.win && ya.readyState != 4) {
                va = K.createElement("div");
                ma += "SWFObjectNew";
                va.setAttribute("id", ma);
                ya.parentNode.insertBefore(va, ya);
                ya.style.display = "none";
                (function () {
                    ya.readyState == 4 ? ya.parentNode.removeChild(ya) : setTimeout(arguments.callee, 10)
                })()
            }
            s(Q, fa, ma)
        }
    }

    function k(Q) {
        if (pa.ie && pa.win && Q.readyState != 4) {
            var fa = K.createElement("div");
            Q.parentNode.insertBefore(fa, Q);
            fa.parentNode.replaceChild(o(Q), fa);
            Q.style.display = "none";
            (function () {
                Q.readyState == 4 ? Q.parentNode.removeChild(Q) : setTimeout(arguments.callee, 10)
            })()
        } else Q.parentNode.replaceChild(o(Q), Q)
    }

    function o(Q) {
        var fa = K.createElement("div");
        if (pa.win && pa.ie)fa.innerHTML = Q.innerHTML; else if (Q = Q.getElementsByTagName(N)[0])if (Q = Q.childNodes)for (var ma = Q.length, va = 0; va < ma; va++)!(Q[va].nodeType == 1 && Q[va].nodeName == "PARAM") && Q[va].nodeType != 8 && fa.appendChild(Q[va].cloneNode(true));
        return fa
    }

    function s(Q, fa, ma) {
        var va, ya = r(ma);
        if (pa.wk && pa.wk < 312)return va;
        if (ya) {
            if (typeof Q.id == B)Q.id = ma;
            if (pa.ie && pa.win) {
                var Fa = "";
                for (var Ha in Q)if (Q[Ha] != Object.prototype[Ha])if (Ha.toLowerCase() == "data")fa.movie = Q[Ha]; else if (Ha.toLowerCase() == "styleclass")Fa += ' class="' + Q[Ha] + '"'; else if (Ha.toLowerCase() != "classid")Fa += " " + Ha + '="' + Q[Ha] + '"';
                Ha = "";
                for (var Pa in fa)if (fa[Pa] != Object.prototype[Pa])Ha += '<param name="' + Pa + '" value="' + fa[Pa] + '" />';
                ya.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' +
                        Fa + ">" + Ha + "</object>";
                ra[ra.length] = Q.id;
                va = r(Q.id)
            } else {
                Pa = K.createElement(N);
                Pa.setAttribute("type", ba);
                for (var Qa in Q)if (Q[Qa] != Object.prototype[Qa])if (Qa.toLowerCase() == "styleclass")Pa.setAttribute("class", Q[Qa]); else Qa.toLowerCase() != "classid" && Pa.setAttribute(Qa, Q[Qa]);
                for (Fa in fa)if (fa[Fa] != Object.prototype[Fa] && Fa.toLowerCase() != "movie") {
                    Q = Pa;
                    Ha = Fa;
                    Qa = fa[Fa];
                    ma = K.createElement("param");
                    ma.setAttribute("name", Ha);
                    ma.setAttribute("value", Qa);
                    Q.appendChild(ma)
                }
                ya.parentNode.replaceChild(Pa,
                        ya);
                va = Pa
            }
        }
        return va
    }

    function q(Q) {
        var fa = r(Q);
        if (fa && fa.nodeName == "OBJECT")if (pa.ie && pa.win) {
            fa.style.display = "none";
            (function () {
                if (fa.readyState == 4) {
                    var ma = r(Q);
                    if (ma) {
                        for (var va in ma)if (typeof ma[va] == "function")ma[va] = null;
                        ma.parentNode.removeChild(ma)
                    }
                } else setTimeout(arguments.callee, 10)
            })()
        } else fa.parentNode.removeChild(fa)
    }

    function r(Q) {
        var fa = null;
        try {
            fa = K.getElementById(Q)
        } catch (ma) {
        }
        return fa
    }

    function v(Q, fa, ma) {
        Q.attachEvent(fa, ma);
        Y[Y.length] = [Q, fa, ma]
    }

    function t(Q) {
        var fa = pa.pv;
        Q =
                Q.split(".");
        Q[0] = parseInt(Q[0], 10);
        Q[1] = parseInt(Q[1], 10) || 0;
        Q[2] = parseInt(Q[2], 10) || 0;
        return fa[0] > Q[0] || fa[0] == Q[0] && fa[1] > Q[1] || fa[0] == Q[0] && fa[1] == Q[1] && fa[2] >= Q[2] ? true : false
    }

    function y(Q, fa, ma, va) {
        if (!(pa.ie && pa.mac)) {
            var ya = K.getElementsByTagName("head")[0];
            if (ya) {
                ma = ma && typeof ma == "string" ? ma : "screen";
                if (va)S = C = null;
                if (!C || S != ma) {
                    va = K.createElement("style");
                    va.setAttribute("type", "text/css");
                    va.setAttribute("media", ma);
                    C = ya.appendChild(va);
                    if (pa.ie && pa.win && typeof K.styleSheets != B && K.styleSheets.length >
                            0)C = K.styleSheets[K.styleSheets.length - 1];
                    S = ma
                }
                if (pa.ie && pa.win)C && typeof C.addRule == N && C.addRule(Q, fa); else C && typeof K.createTextNode != B && C.appendChild(K.createTextNode(Q + " {" + fa + "}"))
            }
        }
    }

    function E(Q, fa) {
        if (ua) {
            var ma = fa ? "visible" : "hidden";
            if (Aa && r(Q))r(Q).style.visibility = ma; else y("#" + Q, "visibility:" + ma)
        }
    }

    function G(Q) {
        return/[\\\"<>\.;]/.exec(Q) != null && typeof encodeURIComponent != B ? encodeURIComponent(Q) : Q
    }

    var B = "undefined", N = "object", ba = "application/x-shockwave-flash", L = "SWFObjectExprInst", ja =
            window, K = document, Z = navigator, X = false, da = [function () {
        X ? c() : e()
    }], W = [], ra = [], Y = [], m, P, la, wa, Aa = false, za = false, C, S, ua = true, pa = function () {
        var Q = typeof K.getElementById != B && typeof K.getElementsByTagName != B && typeof K.createElement != B, fa = Z.userAgent.toLowerCase(), ma = Z.platform.toLowerCase(), va = ma ? /win/.test(ma) : /win/.test(fa);
        ma = ma ? /mac/.test(ma) : /mac/.test(fa);
        fa = /webkit/.test(fa) ? parseFloat(fa.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false;
        var ya = !+"\u000b1", Fa = [0, 0, 0], Ha = null;
        if (typeof Z.plugins !=
                B && typeof Z.plugins["Shockwave Flash"] == N) {
            if ((Ha = Z.plugins["Shockwave Flash"].description) && !(typeof Z.mimeTypes != B && Z.mimeTypes[ba] && !Z.mimeTypes[ba].enabledPlugin)) {
                X = true;
                ya = false;
                Ha = Ha.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                Fa[0] = parseInt(Ha.replace(/^(.*)\..*$/, "$1"), 10);
                Fa[1] = parseInt(Ha.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                Fa[2] = /[a-zA-Z]/.test(Ha) ? parseInt(Ha.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            }
        } else if (typeof ja.ActiveXObject != B)try {
            var Pa = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            if (Pa)if (Ha = Pa.GetVariable("$version")) {
                ya = true;
                Ha = Ha.split(" ")[1].split(",");
                Fa = [parseInt(Ha[0], 10), parseInt(Ha[1], 10), parseInt(Ha[2], 10)]
            }
        } catch (Qa) {
        }
        return{w3:Q, pv:Fa, wk:fa, ie:ya, win:va, mac:ma}
    }();
    (function () {
        if (pa.w3) {
            if (typeof K.readyState != B && K.readyState == "complete" || typeof K.readyState == B && (K.getElementsByTagName("body")[0] || K.body))a();
            if (!Aa) {
                typeof K.addEventListener != B && K.addEventListener("DOMContentLoaded", a, false);
                if (pa.ie && pa.win) {
                    K.attachEvent("onreadystatechange", function () {
                        if (K.readyState ==
                                "complete") {
                            K.detachEvent("onreadystatechange", arguments.callee);
                            a()
                        }
                    });
                    ja == top && function () {
                        if (!Aa) {
                            try {
                                K.documentElement.doScroll("left")
                            } catch (Q) {
                                setTimeout(arguments.callee, 0);
                                return
                            }
                            a()
                        }
                    }()
                }
                pa.wk && function () {
                    Aa || (/loaded|complete/.test(K.readyState) ? a() : setTimeout(arguments.callee, 0))
                }();
                b(a)
            }
        }
    })();
    (function () {
        pa.ie && pa.win && window.attachEvent("onunload", function () {
            for (var Q = Y.length, fa = 0; fa < Q; fa++)Y[fa][0].detachEvent(Y[fa][1], Y[fa][2]);
            Q = ra.length;
            for (fa = 0; fa < Q; fa++)q(ra[fa]);
            for (var ma in pa)pa[ma] =
                    null;
            pa = null;
            for (var va in swfobject)swfobject[va] = null;
            swfobject = null
        })
    })();
    return{registerObject:function (Q, fa, ma, va) {
        if (pa.w3 && Q && fa) {
            var ya = {};
            ya.id = Q;
            ya.swfVersion = fa;
            ya.expressInstall = ma;
            ya.callbackFn = va;
            W[W.length] = ya;
            E(Q, false)
        } else va && va({success:false, id:Q})
    }, getObjectById:function (Q) {
        if (pa.w3)return f(Q)
    }, embedSWF:function (Q, fa, ma, va, ya, Fa, Ha, Pa, Qa, sb) {
        var wb = {success:false, id:fa};
        if (pa.w3 && !(pa.wk && pa.wk < 312) && Q && fa && ma && va && ya) {
            E(fa, false);
            d(function () {
                ma += "";
                va += "";
                var fb = {};
                if (Qa &&
                        typeof Qa === N)for (var db in Qa)fb[db] = Qa[db];
                fb.data = Q;
                fb.width = ma;
                fb.height = va;
                db = {};
                if (Pa && typeof Pa === N)for (var jb in Pa)db[jb] = Pa[jb];
                if (Ha && typeof Ha === N)for (var kb in Ha)if (typeof db.flashvars != B)db.flashvars += "&" + kb + "=" + Ha[kb]; else db.flashvars = kb + "=" + Ha[kb];
                if (t(ya)) {
                    jb = s(fb, db, fa);
                    fb.id == fa && E(fa, true);
                    wb.success = true;
                    wb.ref = jb
                } else if (Fa && j()) {
                    fb.data = Fa;
                    g(fb, db, fa, sb);
                    return
                } else E(fa, true);
                sb && sb(wb)
            })
        } else sb && sb(wb)
    }, switchOffAutoHideShow:function () {
        ua = false
    }, ua:pa, getFlashPlayerVersion:function () {
        return{major:pa.pv[0],
            minor:pa.pv[1], release:pa.pv[2]}
    }, hasFlashPlayerVersion:t, createSWF:function (Q, fa, ma) {
        if (pa.w3)return s(Q, fa, ma)
    }, showExpressInstall:function (Q, fa, ma, va) {
        pa.w3 && j() && g(Q, fa, ma, va)
    }, removeSWF:function (Q) {
        pa.w3 && q(Q)
    }, createCSS:function (Q, fa, ma, va) {
        pa.w3 && y(Q, fa, ma, va)
    }, addDomLoadEvent:d, addLoadEvent:b, getQueryParamValue:function (Q) {
        var fa = K.location.search || K.location.hash;
        if (fa) {
            if (/\?/.test(fa))fa = fa.split("?")[1];
            if (Q == null)return G(fa);
            fa = fa.split("&");
            for (var ma = 0; ma < fa.length; ma++)if (fa[ma].substring(0,
                    fa[ma].indexOf("=")) == Q)return G(fa[ma].substring(fa[ma].indexOf("=") + 1))
        }
        return""
    }, expressInstallCallback:function () {
        if (za) {
            var Q = r(L);
            if (Q && m) {
                Q.parentNode.replaceChild(m, Q);
                if (P) {
                    E(P, true);
                    if (pa.ie && pa.win)m.style.display = "block"
                }
                la && la(wa)
            }
            za = false
        }
    }}
}();
(function (a) {
    var d = {};
    a.publish = function (b, c) {
        c = a.makeArray(c);
        d[b] && a.each(d[b].concat(), function () {
            try {
                this.apply(a, c || [])
            } catch (e) {
                console.error("pub/sub. topic: ", b, ", error: ", e, "msg:", e.message, "stack:", e.stack, ", func: ", this)
            }
        })
    };
    a.subscribe = function (b, c) {
        d[b] || (d[b] = []);
        d[b].push(c);
        return[b, c]
    };
    a.unsubscribe = function (b) {
        var c = b[0];
        d[c] && a.each(d[c], function (e) {
            this == b[1] && d[c].splice(e, 1)
        })
    };
    a.subscriptions = d
})(jQuery);
(function (a, d, b) {
    function c(s) {
        s = s || location.href;
        return"#" + s.replace(/^[^#]*#?(.*)$/, "$1")
    }

    var e = "hashchange", f = document, j, g = a.event.special, k = f.documentMode, o = "on" + e in d && (k === b || k > 7);
    a.fn[e] = function (s) {
        return s ? this.bind(e, s) : this.trigger(e)
    };
    a.fn[e].delay = 50;
    g[e] = a.extend(g[e], {setup:function () {
        if (o)return false;
        a(j.start)
    }, teardown:function () {
        if (o)return false;
        a(j.stop)
    }});
    j = function () {
        function s() {
            var G = c(), B = E(v);
            if (G !== v) {
                y(v = G, B);
                a(d).trigger(e)
            } else if (B !== v)location.href = location.href.replace(/#.*/,
                    "") + B;
            r = setTimeout(s, a.fn[e].delay)
        }

        var q = {}, r, v = c(), t = function (G) {
            return G
        }, y = t, E = t;
        q.start = function () {
            r || s()
        };
        q.stop = function () {
            r && clearTimeout(r);
            r = b
        };
        a.browser.msie && !o && function () {
            var G, B;
            q.start = function () {
                if (!G) {
                    B = (B = a.fn[e].src) && B + c();
                    G = a('<iframe tabindex="-1" title="empty"/>').hide().one("load",function () {
                        B || y(c());
                        s()
                    }).attr("src", B || "javascript:0").insertAfter("body")[0].contentWindow;
                    f.onpropertychange = function () {
                        try {
                            if (event.propertyName === "title")G.document.title = f.title
                        } catch (N) {
                        }
                    }
                }
            };
            q.stop = t;
            E = function () {
                return c(G.location.href)
            };
            y = function (N, ba) {
                var L = G.document, ja = a.fn[e].domain;
                if (N !== ba) {
                    L.title = f.title;
                    L.open();
                    ja && L.write('<script>document.domain="' + ja + '"<\/script>');
                    L.close();
                    G.location.hash = N
                }
            }
        }();
        return q
    }()
})(jQuery, this);
(function (a, d) {
    function b(e, f) {
        var j = e.nodeName.toLowerCase();
        if ("area" === j) {
            j = e.parentNode;
            var g = j.name;
            if (!e.href || !g || j.nodeName.toLowerCase() !== "map")return false;
            j = a("img[usemap=#" + g + "]")[0];
            return!!j && c(j)
        }
        return(/input|select|textarea|button|object/.test(j) ? !e.disabled : "a" == j ? e.href || f : f) && c(e)
    }

    function c(e) {
        return!a(e).parents().andSelf().filter(function () {
            return a.curCSS(this, "visibility") === "hidden" || a.expr.filters.hidden(this)
        }).length
    }

    a.ui = a.ui || {};
    if (!a.ui.version) {
        a.extend(a.ui, {version:"1.8.16",
            keyCode:{ALT:18, BACKSPACE:8, CAPS_LOCK:20, COMMA:188, COMMAND:91, COMMAND_LEFT:91, COMMAND_RIGHT:93, CONTROL:17, DELETE:46, DOWN:40, END:35, ENTER:13, ESCAPE:27, HOME:36, INSERT:45, LEFT:37, MENU:93, NUMPAD_ADD:107, NUMPAD_DECIMAL:110, NUMPAD_DIVIDE:111, NUMPAD_ENTER:108, NUMPAD_MULTIPLY:106, NUMPAD_SUBTRACT:109, PAGE_DOWN:34, PAGE_UP:33, PERIOD:190, RIGHT:39, SHIFT:16, SPACE:32, TAB:9, UP:38, WINDOWS:91}});
        a.fn.extend({propAttr:a.fn.prop || a.fn.attr, _focus:a.fn.focus, focus:function (e, f) {
            return typeof e === "number" ? this.each(function () {
                var j =
                        this;
                setTimeout(function () {
                    a(j).focus();
                    f && f.call(j)
                }, e)
            }) : this._focus.apply(this, arguments)
        }, scrollParent:function () {
            var e;
            e = a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
                return/(relative|absolute|fixed)/.test(a.curCSS(this, "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
            }).eq(0) : this.parents().filter(function () {
                return/(auto|scroll)/.test(a.curCSS(this,
                        "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
            }).eq(0);
            return/fixed/.test(this.css("position")) || !e.length ? a(document) : e
        }, zIndex:function (e) {
            if (e !== d)return this.css("zIndex", e);
            if (this.length) {
                e = a(this[0]);
                for (var f; e.length && e[0] !== document;) {
                    f = e.css("position");
                    if (f === "absolute" || f === "relative" || f === "fixed") {
                        f = parseInt(e.css("zIndex"), 10);
                        if (!isNaN(f) && f !== 0)return f
                    }
                    e = e.parent()
                }
            }
            return 0
        }, disableSelection:function () {
            return this.bind((a.support.selectstart ? "selectstart" :
                    "mousedown") + ".ui-disableSelection", function (e) {
                e.preventDefault()
            })
        }, enableSelection:function () {
            return this.unbind(".ui-disableSelection")
        }});
        a.each(["Width", "Height"], function (e, f) {
            function j(s, q, r, v) {
                a.each(g, function () {
                    q -= parseFloat(a.curCSS(s, "padding" + this, true)) || 0;
                    if (r)q -= parseFloat(a.curCSS(s, "border" + this + "Width", true)) || 0;
                    if (v)q -= parseFloat(a.curCSS(s, "margin" + this, true)) || 0
                });
                return q
            }

            var g = f === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], k = f.toLowerCase(), o = {innerWidth:a.fn.innerWidth, innerHeight:a.fn.innerHeight,
                outerWidth:a.fn.outerWidth, outerHeight:a.fn.outerHeight};
            a.fn["inner" + f] = function (s) {
                if (s === d)return o["inner" + f].call(this);
                return this.each(function () {
                    a(this).css(k, j(this, s) + "px")
                })
            };
            a.fn["outer" + f] = function (s, q) {
                if (typeof s !== "number")return o["outer" + f].call(this, s);
                return this.each(function () {
                    a(this).css(k, j(this, s, true, q) + "px")
                })
            }
        });
        a.extend(a.expr[":"], {data:function (e, f, j) {
            return!!a.data(e, j[3])
        }, focusable:function (e) {
            return b(e, !isNaN(a.attr(e, "tabindex")))
        }, tabbable:function (e) {
            var f = a.attr(e,
                    "tabindex"), j = isNaN(f);
            return(j || f >= 0) && b(e, !j)
        }});
        a(function () {
            var e = document.body, f = e.appendChild(f = document.createElement("div"));
            a.extend(f.style, {minHeight:"100px", height:"auto", padding:0, borderWidth:0});
            a.support.minHeight = f.offsetHeight === 100;
            a.support.selectstart = "onselectstart"in f;
            e.removeChild(f).style.display = "none"
        });
        a.extend(a.ui, {plugin:{add:function (e, f, j) {
            e = a.ui[e].prototype;
            for (var g in j) {
                e.plugins[g] = e.plugins[g] || [];
                e.plugins[g].push([f, j[g]])
            }
        }, call:function (e, f, j) {
            if ((f = e.plugins[f]) &&
                    e.element[0].parentNode)for (var g = 0; g < f.length; g++)e.options[f[g][0]] && f[g][1].apply(e.element, j)
        }}, contains:function (e, f) {
            return document.compareDocumentPosition ? e.compareDocumentPosition(f) & 16 : e !== f && e.contains(f)
        }, hasScroll:function (e, f) {
            if (a(e).css("overflow") === "hidden")return false;
            var j = f && f === "left" ? "scrollLeft" : "scrollTop", g = false;
            if (e[j] > 0)return true;
            e[j] = 1;
            g = e[j] > 0;
            e[j] = 0;
            return g
        }, isOverAxis:function (e, f, j) {
            return e > f && e < f + j
        }, isOver:function (e, f, j, g, k, o) {
            return a.ui.isOverAxis(e, j, k) &&
                    a.ui.isOverAxis(f, g, o)
        }})
    }
})(jQuery);
(function (a, d) {
    if (a.cleanData) {
        var b = a.cleanData;
        a.cleanData = function (e) {
            for (var f = 0, j; (j = e[f]) != null; f++)try {
                a(j).triggerHandler("remove")
            } catch (g) {
            }
            b(e)
        }
    } else {
        var c = a.fn.remove;
        a.fn.remove = function (e, f) {
            return this.each(function () {
                if (!f)if (!e || a.filter(e, [this]).length)a("*", this).add([this]).each(function () {
                    try {
                        a(this).triggerHandler("remove")
                    } catch (j) {
                    }
                });
                return c.call(a(this), e, f)
            })
        }
    }
    a.widget = function (e, f, j) {
        var g = e.split(".")[0], k;
        e = e.split(".")[1];
        k = g + "-" + e;
        if (!j) {
            j = f;
            f = a.Widget
        }
        a.expr[":"][k] =
                function (o) {
                    return!!a.data(o, e)
                };
        a[g] = a[g] || {};
        a[g][e] = function (o, s) {
            arguments.length && this._createWidget(o, s)
        };
        f = new f;
        f.options = a.extend(true, {}, f.options);
        a[g][e].prototype = a.extend(true, f, {namespace:g, widgetName:e, widgetEventPrefix:a[g][e].prototype.widgetEventPrefix || e, widgetBaseClass:k}, j);
        a.widget.bridge(e, a[g][e])
    };
    a.widget.bridge = function (e, f) {
        a.fn[e] = function (j) {
            var g = typeof j === "string", k = Array.prototype.slice.call(arguments, 1), o = this;
            j = !g && k.length ? a.extend.apply(null, [true, j].concat(k)) :
                    j;
            if (g && j.charAt(0) === "_")return o;
            g ? this.each(function () {
                var s = a.data(this, e), q = s && a.isFunction(s[j]) ? s[j].apply(s, k) : s;
                if (q !== s && q !== d) {
                    o = q;
                    return false
                }
            }) : this.each(function () {
                var s = a.data(this, e);
                s ? s.option(j || {})._init() : a.data(this, e, new f(j, this))
            });
            return o
        }
    };
    a.Widget = function (e, f) {
        arguments.length && this._createWidget(e, f)
    };
    a.Widget.prototype = {widgetName:"widget", widgetEventPrefix:"", options:{disabled:false}, _createWidget:function (e, f) {
        a.data(f, this.widgetName, this);
        this.element = a(f);
        this.options =
                a.extend(true, {}, this.options, this._getCreateOptions(), e);
        var j = this;
        this.element.bind("remove." + this.widgetName, function () {
            j.destroy()
        });
        this._create();
        this._trigger("create");
        this._init()
    }, _getCreateOptions:function () {
        return a.metadata && a.metadata.get(this.element[0])[this.widgetName]
    }, _create:function () {
    }, _init:function () {
    }, destroy:function () {
        this.element.unbind("." + this.widgetName).removeData(this.widgetName);
        this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass +
                "-disabled ui-state-disabled")
    }, widget:function () {
        return this.element
    }, option:function (e, f) {
        var j = e;
        if (arguments.length === 0)return a.extend({}, this.options);
        if (typeof e === "string") {
            if (f === d)return this.options[e];
            j = {};
            j[e] = f
        }
        this._setOptions(j);
        return this
    }, _setOptions:function (e) {
        var f = this;
        a.each(e, function (j, g) {
            f._setOption(j, g)
        });
        return this
    }, _setOption:function (e, f) {
        this.options[e] = f;
        if (e === "disabled")this.widget()[f ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled",
                f);
        return this
    }, enable:function () {
        return this._setOption("disabled", false)
    }, disable:function () {
        return this._setOption("disabled", true)
    }, _trigger:function (e, f, j) {
        var g = this.options[e];
        f = a.Event(f);
        f.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase();
        j = j || {};
        if (f.originalEvent) {
            e = a.event.props.length;
            for (var k; e;) {
                k = a.event.props[--e];
                f[k] = f.originalEvent[k]
            }
        }
        this.element.trigger(f, j);
        return!(a.isFunction(g) && g.call(this.element[0], f, j) === false || f.isDefaultPrevented())
    }}
})(jQuery);
(function (a) {
    var d = false;
    a(document).mouseup(function () {
        d = false
    });
    a.widget("ui.mouse", {options:{cancel:":input,option", distance:1, delay:0}, _mouseInit:function () {
        var b = this;
        this.element.bind("mousedown." + this.widgetName,function (c) {
            return b._mouseDown(c)
        }).bind("click." + this.widgetName, function (c) {
                    if (true === a.data(c.target, b.widgetName + ".preventClickEvent")) {
                        a.removeData(c.target, b.widgetName + ".preventClickEvent");
                        c.stopImmediatePropagation();
                        return false
                    }
                });
        this.started = false
    }, _mouseDestroy:function () {
        this.element.unbind("." +
                this.widgetName)
    }, _mouseDown:function (b) {
        if (!d) {
            this._mouseStarted && this._mouseUp(b);
            this._mouseDownEvent = b;
            var c = this, e = b.which == 1, f = typeof this.options.cancel == "string" && b.target.nodeName ? a(b.target).closest(this.options.cancel).length : false;
            if (!e || f || !this._mouseCapture(b))return true;
            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet)this._mouseDelayTimer = setTimeout(function () {
                c.mouseDelayMet = true
            }, this.options.delay);
            if (this._mouseDistanceMet(b) && this._mouseDelayMet(b)) {
                this._mouseStarted =
                        this._mouseStart(b) !== false;
                if (!this._mouseStarted) {
                    b.preventDefault();
                    return true
                }
            }
            true === a.data(b.target, this.widgetName + ".preventClickEvent") && a.removeData(b.target, this.widgetName + ".preventClickEvent");
            this._mouseMoveDelegate = function (j) {
                return c._mouseMove(j)
            };
            this._mouseUpDelegate = function (j) {
                return c._mouseUp(j)
            };
            a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
            b.preventDefault();
            return d = true
        }
    }, _mouseMove:function (b) {
        if (a.browser.msie &&
                !(document.documentMode >= 9) && !b.button)return this._mouseUp(b);
        if (this._mouseStarted) {
            this._mouseDrag(b);
            return b.preventDefault()
        }
        if (this._mouseDistanceMet(b) && this._mouseDelayMet(b))(this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== false) ? this._mouseDrag(b) : this._mouseUp(b);
        return!this._mouseStarted
    }, _mouseUp:function (b) {
        a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
        if (this._mouseStarted) {
            this._mouseStarted =
                    false;
            b.target == this._mouseDownEvent.target && a.data(b.target, this.widgetName + ".preventClickEvent", true);
            this._mouseStop(b)
        }
        return false
    }, _mouseDistanceMet:function (b) {
        return Math.max(Math.abs(this._mouseDownEvent.pageX - b.pageX), Math.abs(this._mouseDownEvent.pageY - b.pageY)) >= this.options.distance
    }, _mouseDelayMet:function () {
        return this.mouseDelayMet
    }, _mouseStart:function () {
    }, _mouseDrag:function () {
    }, _mouseStop:function () {
    }, _mouseCapture:function () {
        return true
    }})
})(jQuery);
(function (a) {
    a.ui = a.ui || {};
    var d = /left|center|right/, b = /top|center|bottom/, c = a.fn.position, e = a.fn.offset;
    a.fn.position = function (f) {
        if (!f || !f.of)return c.apply(this, arguments);
        f = a.extend({}, f);
        var j = a(f.of), g = j[0], k = (f.collision || "flip").split(" "), o = f.offset ? f.offset.split(" ") : [0, 0], s, q, r;
        if (g.nodeType === 9) {
            s = j.width();
            q = j.height();
            r = {top:0, left:0}
        } else if (g.setTimeout) {
            s = j.width();
            q = j.height();
            r = {top:j.scrollTop(), left:j.scrollLeft()}
        } else if (g.preventDefault) {
            f.at = "left top";
            s = q = 0;
            r = {top:f.of.pageY,
                left:f.of.pageX}
        } else {
            s = j.outerWidth();
            q = j.outerHeight();
            r = j.offset()
        }
        a.each(["my", "at"], function () {
            var v = (f[this] || "").split(" ");
            if (v.length === 1)v = d.test(v[0]) ? v.concat(["center"]) : b.test(v[0]) ? ["center"].concat(v) : ["center", "center"];
            v[0] = d.test(v[0]) ? v[0] : "center";
            v[1] = b.test(v[1]) ? v[1] : "center";
            f[this] = v
        });
        if (k.length === 1)k[1] = k[0];
        o[0] = parseInt(o[0], 10) || 0;
        if (o.length === 1)o[1] = o[0];
        o[1] = parseInt(o[1], 10) || 0;
        if (f.at[0] === "right")r.left += s; else if (f.at[0] === "center")r.left += s / 2;
        if (f.at[1] === "bottom")r.top +=
                q; else if (f.at[1] === "center")r.top += q / 2;
        r.left += o[0];
        r.top += o[1];
        return this.each(function () {
            var v = a(this), t = v.outerWidth(), y = v.outerHeight(), E = parseInt(a.curCSS(this, "marginLeft", true)) || 0, G = parseInt(a.curCSS(this, "marginTop", true)) || 0, B = t + E + (parseInt(a.curCSS(this, "marginRight", true)) || 0), N = y + G + (parseInt(a.curCSS(this, "marginBottom", true)) || 0), ba = a.extend({}, r), L;
            if (f.my[0] === "right")ba.left -= t; else if (f.my[0] === "center")ba.left -= t / 2;
            if (f.my[1] === "bottom")ba.top -= y; else if (f.my[1] === "center")ba.top -=
                    y / 2;
            ba.left = Math.round(ba.left);
            ba.top = Math.round(ba.top);
            L = {left:ba.left - E, top:ba.top - G};
            a.each(["left", "top"], function (ja, K) {
                a.ui.position[k[ja]] && a.ui.position[k[ja]][K](ba, {targetWidth:s, targetHeight:q, elemWidth:t, elemHeight:y, collisionPosition:L, collisionWidth:B, collisionHeight:N, offset:o, my:f.my, at:f.at})
            });
            a.fn.bgiframe && v.bgiframe();
            v.offset(a.extend(ba, {using:f.using}))
        })
    };
    a.ui.position = {fit:{left:function (f, j) {
        var g = a(window);
        g = j.collisionPosition.left + j.collisionWidth - g.width() - g.scrollLeft();
        f.left = g > 0 ? f.left - g : Math.max(f.left - j.collisionPosition.left, f.left)
    }, top:function (f, j) {
        var g = a(window);
        g = j.collisionPosition.top + j.collisionHeight - g.height() - g.scrollTop();
        f.top = g > 0 ? f.top - g : Math.max(f.top - j.collisionPosition.top, f.top)
    }}, flip:{left:function (f, j) {
        if (j.at[0] !== "center") {
            var g = a(window);
            g = j.collisionPosition.left + j.collisionWidth - g.width() - g.scrollLeft();
            var k = j.my[0] === "left" ? -j.elemWidth : j.my[0] === "right" ? j.elemWidth : 0, o = j.at[0] === "left" ? j.targetWidth : -j.targetWidth, s = -2 * j.offset[0];
            f.left += j.collisionPosition.left < 0 ? k + o + s : g > 0 ? k + o + s : 0
        }
    }, top:function (f, j) {
        if (j.at[1] !== "center") {
            var g = a(window);
            g = j.collisionPosition.top + j.collisionHeight - g.height() - g.scrollTop();
            var k = j.my[1] === "top" ? -j.elemHeight : j.my[1] === "bottom" ? j.elemHeight : 0, o = j.at[1] === "top" ? j.targetHeight : -j.targetHeight, s = -2 * j.offset[1];
            f.top += j.collisionPosition.top < 0 ? k + o + s : g > 0 ? k + o + s : 0
        }
    }}};
    if (!a.offset.setOffset) {
        a.offset.setOffset = function (f, j) {
            if (/static/.test(a.curCSS(f, "position")))f.style.position = "relative";
            var g =
                    a(f), k = g.offset(), o = parseInt(a.curCSS(f, "top", true), 10) || 0, s = parseInt(a.curCSS(f, "left", true), 10) || 0;
            k = {top:j.top - k.top + o, left:j.left - k.left + s};
            "using"in j ? j.using.call(f, k) : g.css(k)
        };
        a.fn.offset = function (f) {
            var j = this[0];
            if (!j || !j.ownerDocument)return null;
            if (f)return this.each(function () {
                a.offset.setOffset(this, f)
            });
            return e.call(this)
        }
    }
})(jQuery);
(function (a) {
    a.widget("ui.draggable", a.ui.mouse, {widgetEventPrefix:"drag", options:{addClasses:true, appendTo:"parent", axis:false, connectToSortable:false, containment:false, cursor:"auto", cursorAt:false, grid:false, handle:false, helper:"original", iframeFix:false, opacity:false, refreshPositions:false, revert:false, revertDuration:500, scope:"default", scroll:true, scrollSensitivity:20, scrollSpeed:20, snap:false, snapMode:"both", snapTolerance:20, stack:false, zIndex:false}, _create:function () {
        if (this.options.helper ==
                "original" && !/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position = "relative";
        this.options.addClasses && this.element.addClass("ui-draggable");
        this.options.disabled && this.element.addClass("ui-draggable-disabled");
        this._mouseInit()
    }, destroy:function () {
        if (this.element.data("draggable")) {
            this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
            this._mouseDestroy();
            return this
        }
    }, _mouseCapture:function (d) {
        var b =
                this.options;
        if (this.helper || b.disabled || a(d.target).is(".ui-resizable-handle"))return false;
        this.handle = this._getHandle(d);
        if (!this.handle)return false;
        if (b.iframeFix)a(b.iframeFix === true ? "iframe" : b.iframeFix).each(function () {
            a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth + "px", height:this.offsetHeight + "px", position:"absolute", opacity:"0.001", zIndex:1E3}).css(a(this).offset()).appendTo("body")
        });
        return true
    }, _mouseStart:function (d) {
        var b = this.options;
        this.helper = this._createHelper(d);
        this._cacheHelperProportions();
        if (a.ui.ddmanager)a.ui.ddmanager.current = this;
        this._cacheMargins();
        this.cssPosition = this.helper.css("position");
        this.scrollParent = this.helper.scrollParent();
        this.offset = this.positionAbs = this.element.offset();
        this.offset = {top:this.offset.top - this.margins.top, left:this.offset.left - this.margins.left};
        a.extend(this.offset, {click:{left:d.pageX - this.offset.left, top:d.pageY - this.offset.top}, parent:this._getParentOffset(), relative:this._getRelativeOffset()});
        this.originalPosition = this.position = this._generatePosition(d);
        this.originalPageX = d.pageX;
        this.originalPageY = d.pageY;
        b.cursorAt && this._adjustOffsetFromHelper(b.cursorAt);
        b.containment && this._setContainment();
        if (this._trigger("start", d) === false) {
            this._clear();
            return false
        }
        this._cacheHelperProportions();
        a.ui.ddmanager && !b.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, d);
        this.helper.addClass("ui-draggable-dragging");
        this._mouseDrag(d, true);
        a.ui.ddmanager && a.ui.ddmanager.dragStart(this, d);
        return true
    },
        _mouseDrag:function (d, b) {
            this.position = this._generatePosition(d);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!b) {
                var c = this._uiHash();
                if (this._trigger("drag", d, c) === false) {
                    this._mouseUp({});
                    return false
                }
                this.position = c.position
            }
            if (!this.options.axis || this.options.axis != "y")this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x")this.helper[0].style.top = this.position.top + "px";
            a.ui.ddmanager && a.ui.ddmanager.drag(this, d);
            return false
        }, _mouseStop:function (d) {
            var b =
                    false;
            if (a.ui.ddmanager && !this.options.dropBehaviour)b = a.ui.ddmanager.drop(this, d);
            if (this.dropped) {
                b = this.dropped;
                this.dropped = false
            }
            if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")return false;
            if (this.options.revert == "invalid" && !b || this.options.revert == "valid" && b || this.options.revert === true || a.isFunction(this.options.revert) && this.options.revert.call(this.element, b)) {
                var c = this;
                a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration,
                        10), function () {
                    c._trigger("stop", d) !== false && c._clear()
                })
            } else this._trigger("stop", d) !== false && this._clear();
            return false
        }, _mouseUp:function (d) {
            this.options.iframeFix === true && a("div.ui-draggable-iframeFix").each(function () {
                this.parentNode.removeChild(this)
            });
            a.ui.ddmanager && a.ui.ddmanager.dragStop(this, d);
            return a.ui.mouse.prototype._mouseUp.call(this, d)
        }, cancel:function () {
            this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear();
            return this
        }, _getHandle:function (d) {
            var b = !this.options.handle ||
                    !a(this.options.handle, this.element).length ? true : false;
            a(this.options.handle, this.element).find("*").andSelf().each(function () {
                if (this == d.target)b = true
            });
            return b
        }, _createHelper:function (d) {
            var b = this.options;
            d = a.isFunction(b.helper) ? a(b.helper.apply(this.element[0], [d])) : b.helper == "clone" ? this.element.clone().removeAttr("id") : this.element;
            d.parents("body").length || d.appendTo(b.appendTo == "parent" ? this.element[0].parentNode : b.appendTo);
            d[0] != this.element[0] && !/(fixed|absolute)/.test(d.css("position")) &&
            d.css("position", "absolute");
            return d
        }, _adjustOffsetFromHelper:function (d) {
            if (typeof d == "string")d = d.split(" ");
            if (a.isArray(d))d = {left:+d[0], top:+d[1] || 0};
            if ("left"in d)this.offset.click.left = d.left + this.margins.left;
            if ("right"in d)this.offset.click.left = this.helperProportions.width - d.right + this.margins.left;
            if ("top"in d)this.offset.click.top = d.top + this.margins.top;
            if ("bottom"in d)this.offset.click.top = this.helperProportions.height - d.bottom + this.margins.top
        }, _getParentOffset:function () {
            this.offsetParent =
                    this.helper.offsetParent();
            var d = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                d.left += this.scrollParent.scrollLeft();
                d.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie)d = {top:0, left:0};
            return{top:d.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left:d.left + (parseInt(this.offsetParent.css("borderLeftWidth"),
                    10) || 0)}
        }, _getRelativeOffset:function () {
            if (this.cssPosition == "relative") {
                var d = this.element.position();
                return{top:d.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left:d.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()}
            } else return{top:0, left:0}
        }, _cacheMargins:function () {
            this.margins = {left:parseInt(this.element.css("marginLeft"), 10) || 0, top:parseInt(this.element.css("marginTop"), 10) || 0, right:parseInt(this.element.css("marginRight"), 10) || 0, bottom:parseInt(this.element.css("marginBottom"),
                    10) || 0}
        }, _cacheHelperProportions:function () {
            this.helperProportions = {width:this.helper.outerWidth(), height:this.helper.outerHeight()}
        }, _setContainment:function () {
            var d = this.options;
            if (d.containment == "parent")d.containment = this.helper[0].parentNode;
            if (d.containment == "document" || d.containment == "window")this.containment = [d.containment == "document" ? 0 : a(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, d.containment == "document" ? 0 : a(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
                (d.containment == "document" ? 0 : a(window).scrollLeft()) + a(d.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (d.containment == "document" ? 0 : a(window).scrollTop()) + (a(d.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(d.containment) && d.containment.constructor != Array) {
                d = a(d.containment);
                var b = d[0];
                if (b) {
                    d.offset();
                    var c = a(b).css("overflow") !=
                            "hidden";
                    this.containment = [(parseInt(a(b).css("borderLeftWidth"), 10) || 0) + (parseInt(a(b).css("paddingLeft"), 10) || 0), (parseInt(a(b).css("borderTopWidth"), 10) || 0) + (parseInt(a(b).css("paddingTop"), 10) || 0), (c ? Math.max(b.scrollWidth, b.offsetWidth) : b.offsetWidth) - (parseInt(a(b).css("borderLeftWidth"), 10) || 0) - (parseInt(a(b).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (c ? Math.max(b.scrollHeight, b.offsetHeight) : b.offsetHeight) - (parseInt(a(b).css("borderTopWidth"),
                            10) || 0) - (parseInt(a(b).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom];
                    this.relative_container = d
                }
            } else if (d.containment.constructor == Array)this.containment = d.containment
        }, _convertPositionTo:function (d, b) {
            if (!b)b = this.position;
            var c = d == "absolute" ? 1 : -1, e = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, f = /(html|body)/i.test(e[0].tagName);
            return{top:b.top +
                    this.offset.relative.top * c + this.offset.parent.top * c - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0 : e.scrollTop()) * c), left:b.left + this.offset.relative.left * c + this.offset.parent.left * c - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0 : e.scrollLeft()) * c)}
        }, _generatePosition:function (d) {
            var b = this.options, c = this.cssPosition == "absolute" &&
                    !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, e = /(html|body)/i.test(c[0].tagName), f = d.pageX, j = d.pageY;
            if (this.originalPosition) {
                var g;
                if (this.containment) {
                    if (this.relative_container) {
                        g = this.relative_container.offset();
                        g = [this.containment[0] + g.left, this.containment[1] + g.top, this.containment[2] + g.left, this.containment[3] + g.top]
                    } else g = this.containment;
                    if (d.pageX - this.offset.click.left < g[0])f = g[0] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top < g[1])j = g[1] + this.offset.click.top;
                    if (d.pageX - this.offset.click.left > g[2])f = g[2] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top > g[3])j = g[3] + this.offset.click.top
                }
                if (b.grid) {
                    j = b.grid[1] ? this.originalPageY + Math.round((j - this.originalPageY) / b.grid[1]) * b.grid[1] : this.originalPageY;
                    j = g ? !(j - this.offset.click.top < g[1] || j - this.offset.click.top > g[3]) ? j : !(j - this.offset.click.top < g[1]) ? j - b.grid[1] : j + b.grid[1] : j;
                    f = b.grid[0] ? this.originalPageX + Math.round((f - this.originalPageX) /
                            b.grid[0]) * b.grid[0] : this.originalPageX;
                    f = g ? !(f - this.offset.click.left < g[0] || f - this.offset.click.left > g[2]) ? f : !(f - this.offset.click.left < g[0]) ? f - b.grid[0] : f + b.grid[0] : f
                }
            }
            return{top:j - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : c.scrollTop()), left:f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && a.browser.version <
                    526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : c.scrollLeft())}
        }, _clear:function () {
            this.helper.removeClass("ui-draggable-dragging");
            this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove();
            this.helper = null;
            this.cancelHelperRemoval = false
        }, _trigger:function (d, b, c) {
            c = c || this._uiHash();
            a.ui.plugin.call(this, d, [b, c]);
            if (d == "drag")this.positionAbs = this._convertPositionTo("absolute");
            return a.Widget.prototype._trigger.call(this, d, b,
                    c)
        }, plugins:{}, _uiHash:function () {
            return{helper:this.helper, position:this.position, originalPosition:this.originalPosition, offset:this.positionAbs}
        }});
    a.extend(a.ui.draggable, {version:"1.8.16"});
    a.ui.plugin.add("draggable", "connectToSortable", {start:function (d, b) {
        var c = a(this).data("draggable"), e = c.options, f = a.extend({}, b, {item:c.element});
        c.sortables = [];
        a(e.connectToSortable).each(function () {
            var j = a.data(this, "sortable");
            if (j && !j.options.disabled) {
                c.sortables.push({instance:j, shouldRevert:j.options.revert});
                j.refreshPositions();
                j._trigger("activate", d, f)
            }
        })
    }, stop:function (d, b) {
        var c = a(this).data("draggable"), e = a.extend({}, b, {item:c.element});
        a.each(c.sortables, function () {
            if (this.instance.isOver) {
                this.instance.isOver = 0;
                c.cancelHelperRemoval = true;
                this.instance.cancelHelperRemoval = false;
                if (this.shouldRevert)this.instance.options.revert = true;
                this.instance._mouseStop(d);
                this.instance.options.helper = this.instance.options._helper;
                c.options.helper == "original" && this.instance.currentItem.css({top:"auto", left:"auto"})
            } else {
                this.instance.cancelHelperRemoval =
                        false;
                this.instance._trigger("deactivate", d, e)
            }
        })
    }, drag:function (d, b) {
        var c = a(this).data("draggable"), e = this;
        a.each(c.sortables, function () {
            this.instance.positionAbs = c.positionAbs;
            this.instance.helperProportions = c.helperProportions;
            this.instance.offset.click = c.offset.click;
            if (this.instance._intersectsWith(this.instance.containerCache)) {
                if (!this.instance.isOver) {
                    this.instance.isOver = 1;
                    this.instance.currentItem = a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", true);
                    this.instance.options._helper = this.instance.options.helper;
                    this.instance.options.helper = function () {
                        return b.helper[0]
                    };
                    d.target = this.instance.currentItem[0];
                    this.instance._mouseCapture(d, true);
                    this.instance._mouseStart(d, true, true);
                    this.instance.offset.click.top = c.offset.click.top;
                    this.instance.offset.click.left = c.offset.click.left;
                    this.instance.offset.parent.left -= c.offset.parent.left - this.instance.offset.parent.left;
                    this.instance.offset.parent.top -= c.offset.parent.top - this.instance.offset.parent.top;
                    c._trigger("toSortable", d);
                    c.dropped = this.instance.element;
                    c.currentItem = c.element;
                    this.instance.fromOutside = c
                }
                this.instance.currentItem && this.instance._mouseDrag(d)
            } else if (this.instance.isOver) {
                this.instance.isOver = 0;
                this.instance.cancelHelperRemoval = true;
                this.instance.options.revert = false;
                this.instance._trigger("out", d, this.instance._uiHash(this.instance));
                this.instance._mouseStop(d, true);
                this.instance.options.helper = this.instance.options._helper;
                this.instance.currentItem.remove();
                this.instance.placeholder &&
                this.instance.placeholder.remove();
                c._trigger("fromSortable", d);
                c.dropped = false
            }
        })
    }});
    a.ui.plugin.add("draggable", "cursor", {start:function () {
        var d = a("body"), b = a(this).data("draggable").options;
        if (d.css("cursor"))b._cursor = d.css("cursor");
        d.css("cursor", b.cursor)
    }, stop:function () {
        var d = a(this).data("draggable").options;
        d._cursor && a("body").css("cursor", d._cursor)
    }});
    a.ui.plugin.add("draggable", "opacity", {start:function (d, b) {
        var c = a(b.helper), e = a(this).data("draggable").options;
        if (c.css("opacity"))e._opacity =
                c.css("opacity");
        c.css("opacity", e.opacity)
    }, stop:function (d, b) {
        var c = a(this).data("draggable").options;
        c._opacity && a(b.helper).css("opacity", c._opacity)
    }});
    a.ui.plugin.add("draggable", "scroll", {start:function () {
        var d = a(this).data("draggable");
        if (d.scrollParent[0] != document && d.scrollParent[0].tagName != "HTML")d.overflowOffset = d.scrollParent.offset()
    }, drag:function (d) {
        var b = a(this).data("draggable"), c = b.options, e = false;
        if (b.scrollParent[0] != document && b.scrollParent[0].tagName != "HTML") {
            if (!c.axis || c.axis !=
                    "x")if (b.overflowOffset.top + b.scrollParent[0].offsetHeight - d.pageY < c.scrollSensitivity)b.scrollParent[0].scrollTop = e = b.scrollParent[0].scrollTop + c.scrollSpeed; else if (d.pageY - b.overflowOffset.top < c.scrollSensitivity)b.scrollParent[0].scrollTop = e = b.scrollParent[0].scrollTop - c.scrollSpeed;
            if (!c.axis || c.axis != "y")if (b.overflowOffset.left + b.scrollParent[0].offsetWidth - d.pageX < c.scrollSensitivity)b.scrollParent[0].scrollLeft = e = b.scrollParent[0].scrollLeft + c.scrollSpeed; else if (d.pageX - b.overflowOffset.left <
                    c.scrollSensitivity)b.scrollParent[0].scrollLeft = e = b.scrollParent[0].scrollLeft - c.scrollSpeed
        } else {
            if (!c.axis || c.axis != "x")if (d.pageY - a(document).scrollTop() < c.scrollSensitivity)e = a(document).scrollTop(a(document).scrollTop() - c.scrollSpeed); else if (a(window).height() - (d.pageY - a(document).scrollTop()) < c.scrollSensitivity)e = a(document).scrollTop(a(document).scrollTop() + c.scrollSpeed);
            if (!c.axis || c.axis != "y")if (d.pageX - a(document).scrollLeft() < c.scrollSensitivity)e = a(document).scrollLeft(a(document).scrollLeft() -
                    c.scrollSpeed); else if (a(window).width() - (d.pageX - a(document).scrollLeft()) < c.scrollSensitivity)e = a(document).scrollLeft(a(document).scrollLeft() + c.scrollSpeed)
        }
        e !== false && a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(b, d)
    }});
    a.ui.plugin.add("draggable", "snap", {start:function () {
        var d = a(this).data("draggable"), b = d.options;
        d.snapElements = [];
        a(b.snap.constructor != String ? b.snap.items || ":data(draggable)" : b.snap).each(function () {
            var c = a(this), e = c.offset();
            this != d.element[0] && d.snapElements.push({item:this,
                width:c.outerWidth(), height:c.outerHeight(), top:e.top, left:e.left})
        })
    }, drag:function (d, b) {
        for (var c = a(this).data("draggable"), e = c.options, f = e.snapTolerance, j = b.offset.left, g = j + c.helperProportions.width, k = b.offset.top, o = k + c.helperProportions.height, s = c.snapElements.length - 1; s >= 0; s--) {
            var q = c.snapElements[s].left, r = q + c.snapElements[s].width, v = c.snapElements[s].top, t = v + c.snapElements[s].height;
            if (q - f < j && j < r + f && v - f < k && k < t + f || q - f < j && j < r + f && v - f < o && o < t + f || q - f < g && g < r + f && v - f < k && k < t + f || q - f < g && g < r + f && v - f < o &&
                    o < t + f) {
                if (e.snapMode != "inner") {
                    var y = Math.abs(v - o) <= f, E = Math.abs(t - k) <= f, G = Math.abs(q - g) <= f, B = Math.abs(r - j) <= f;
                    if (y)b.position.top = c._convertPositionTo("relative", {top:v - c.helperProportions.height, left:0}).top - c.margins.top;
                    if (E)b.position.top = c._convertPositionTo("relative", {top:t, left:0}).top - c.margins.top;
                    if (G)b.position.left = c._convertPositionTo("relative", {top:0, left:q - c.helperProportions.width}).left - c.margins.left;
                    if (B)b.position.left = c._convertPositionTo("relative", {top:0, left:r}).left - c.margins.left
                }
                var N =
                        y || E || G || B;
                if (e.snapMode != "outer") {
                    y = Math.abs(v - k) <= f;
                    E = Math.abs(t - o) <= f;
                    G = Math.abs(q - j) <= f;
                    B = Math.abs(r - g) <= f;
                    if (y)b.position.top = c._convertPositionTo("relative", {top:v, left:0}).top - c.margins.top;
                    if (E)b.position.top = c._convertPositionTo("relative", {top:t - c.helperProportions.height, left:0}).top - c.margins.top;
                    if (G)b.position.left = c._convertPositionTo("relative", {top:0, left:q}).left - c.margins.left;
                    if (B)b.position.left = c._convertPositionTo("relative", {top:0, left:r - c.helperProportions.width}).left - c.margins.left
                }
                if (!c.snapElements[s].snapping &&
                        (y || E || G || B || N))c.options.snap.snap && c.options.snap.snap.call(c.element, d, a.extend(c._uiHash(), {snapItem:c.snapElements[s].item}));
                c.snapElements[s].snapping = y || E || G || B || N
            } else {
                c.snapElements[s].snapping && c.options.snap.release && c.options.snap.release.call(c.element, d, a.extend(c._uiHash(), {snapItem:c.snapElements[s].item}));
                c.snapElements[s].snapping = false
            }
        }
    }});
    a.ui.plugin.add("draggable", "stack", {start:function () {
        var d = a(this).data("draggable").options;
        d = a.makeArray(a(d.stack)).sort(function (c, e) {
            return(parseInt(a(c).css("zIndex"),
                    10) || 0) - (parseInt(a(e).css("zIndex"), 10) || 0)
        });
        if (d.length) {
            var b = parseInt(d[0].style.zIndex) || 0;
            a(d).each(function (c) {
                this.style.zIndex = b + c
            });
            this[0].style.zIndex = b + d.length
        }
    }});
    a.ui.plugin.add("draggable", "zIndex", {start:function (d, b) {
        var c = a(b.helper), e = a(this).data("draggable").options;
        if (c.css("zIndex"))e._zIndex = c.css("zIndex");
        c.css("zIndex", e.zIndex)
    }, stop:function (d, b) {
        var c = a(this).data("draggable").options;
        c._zIndex && a(b.helper).css("zIndex", c._zIndex)
    }})
})(jQuery);
(function (a) {
    a.widget("ui.droppable", {widgetEventPrefix:"drop", options:{accept:"*", activeClass:false, addClasses:true, greedy:false, hoverClass:false, scope:"default", tolerance:"intersect"}, _create:function () {
        var d = this.options, b = d.accept;
        this.isover = 0;
        this.isout = 1;
        this.accept = a.isFunction(b) ? b : function (c) {
            return c.is(b)
        };
        this.proportions = {width:this.element[0].offsetWidth, height:this.element[0].offsetHeight};
        a.ui.ddmanager.droppables[d.scope] = a.ui.ddmanager.droppables[d.scope] || [];
        a.ui.ddmanager.droppables[d.scope].push(this);
        d.addClasses && this.element.addClass("ui-droppable")
    }, destroy:function () {
        for (var d = a.ui.ddmanager.droppables[this.options.scope], b = 0; b < d.length; b++)d[b] == this && d.splice(b, 1);
        this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");
        return this
    }, _setOption:function (d, b) {
        if (d == "accept")this.accept = a.isFunction(b) ? b : function (c) {
            return c.is(b)
        };
        a.Widget.prototype._setOption.apply(this, arguments)
    }, _activate:function (d) {
        var b = a.ui.ddmanager.current;
        this.options.activeClass &&
        this.element.addClass(this.options.activeClass);
        b && this._trigger("activate", d, this.ui(b))
    }, _deactivate:function (d) {
        var b = a.ui.ddmanager.current;
        this.options.activeClass && this.element.removeClass(this.options.activeClass);
        b && this._trigger("deactivate", d, this.ui(b))
    }, _over:function (d) {
        var b = a.ui.ddmanager.current;
        if (!(!b || (b.currentItem || b.element)[0] == this.element[0]))if (this.accept.call(this.element[0], b.currentItem || b.element)) {
            this.options.hoverClass && this.element.addClass(this.options.hoverClass);
            this._trigger("over", d, this.ui(b))
        }
    }, _out:function (d) {
        var b = a.ui.ddmanager.current;
        if (!(!b || (b.currentItem || b.element)[0] == this.element[0]))if (this.accept.call(this.element[0], b.currentItem || b.element)) {
            this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
            this._trigger("out", d, this.ui(b))
        }
    }, _drop:function (d, b) {
        var c = b || a.ui.ddmanager.current;
        if (!c || (c.currentItem || c.element)[0] == this.element[0])return false;
        var e = false;
        this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function () {
            var f =
                    a.data(this, "droppable");
            if (f.options.greedy && !f.options.disabled && f.options.scope == c.options.scope && f.accept.call(f.element[0], c.currentItem || c.element) && a.ui.intersect(c, a.extend(f, {offset:f.element.offset()}), f.options.tolerance)) {
                e = true;
                return false
            }
        });
        if (e)return false;
        if (this.accept.call(this.element[0], c.currentItem || c.element)) {
            this.options.activeClass && this.element.removeClass(this.options.activeClass);
            this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
            this._trigger("drop",
                    d, this.ui(c));
            return this.element
        }
        return false
    }, ui:function (d) {
        return{draggable:d.currentItem || d.element, helper:d.helper, position:d.position, offset:d.positionAbs}
    }});
    a.extend(a.ui.droppable, {version:"1.8.16"});
    a.ui.intersect = function (d, b, c) {
        if (!b.offset)return false;
        var e = (d.positionAbs || d.position.absolute).left, f = e + d.helperProportions.width, j = (d.positionAbs || d.position.absolute).top, g = j + d.helperProportions.height, k = b.offset.left, o = k + b.proportions.width, s = b.offset.top, q = s + b.proportions.height;
        switch (c) {
            case "fit":
                return k <=
                        e && f <= o && s <= j && g <= q;
            case "intersect":
                return k < e + d.helperProportions.width / 2 && f - d.helperProportions.width / 2 < o && s < j + d.helperProportions.height / 2 && g - d.helperProportions.height / 2 < q;
            case "pointer":
                return a.ui.isOver((d.positionAbs || d.position.absolute).top + (d.clickOffset || d.offset.click).top, (d.positionAbs || d.position.absolute).left + (d.clickOffset || d.offset.click).left, s, k, b.proportions.height, b.proportions.width);
            case "touch":
                return(j >= s && j <= q || g >= s && g <= q || j < s && g > q) && (e >= k && e <= o || f >= k && f <= o || e < k && f > o);
            default:
                return false
        }
    };
    a.ui.ddmanager = {current:null, droppables:{"default":[]}, prepareOffsets:function (d, b) {
        var c = a.ui.ddmanager.droppables[d.options.scope] || [], e = b ? b.type : null, f = (d.currentItem || d.element).find(":data(droppable)").andSelf(), j = 0;
        a:for (; j < c.length; j++)if (!(c[j].options.disabled || d && !c[j].accept.call(c[j].element[0], d.currentItem || d.element))) {
            for (var g = 0; g < f.length; g++)if (f[g] == c[j].element[0]) {
                c[j].proportions.height = 0;
                continue a
            }
            c[j].visible = c[j].element.css("display") != "none";
            if (c[j].visible) {
                e ==
                        "mousedown" && c[j]._activate.call(c[j], b);
                c[j].offset = c[j].element.offset();
                c[j].proportions = {width:c[j].element[0].offsetWidth, height:c[j].element[0].offsetHeight}
            }
        }
    }, drop:function (d, b) {
        var c = false;
        a.each(a.ui.ddmanager.droppables[d.options.scope] || [], function () {
            if (this.options) {
                if (!this.options.disabled && this.visible && a.ui.intersect(d, this, this.options.tolerance))c = c || this._drop.call(this, b);
                if (!this.options.disabled && this.visible && this.accept.call(this.element[0], d.currentItem || d.element)) {
                    this.isout =
                            1;
                    this.isover = 0;
                    this._deactivate.call(this, b)
                }
            }
        });
        return c
    }, dragStart:function (d, b) {
        d.element.parents(":not(body,html)").bind("scroll.droppable", function () {
            d.options.refreshPositions || a.ui.ddmanager.prepareOffsets(d, b)
        })
    }, drag:function (d, b) {
        d.options.refreshPositions && a.ui.ddmanager.prepareOffsets(d, b);
        a.each(a.ui.ddmanager.droppables[d.options.scope] || [], function () {
            if (!(this.options.disabled || this.greedyChild || !this.visible)) {
                var c = a.ui.intersect(d, this, this.options.tolerance);
                if (c = !c && this.isover ==
                        1 ? "isout" : c && this.isover == 0 ? "isover" : null) {
                    var e;
                    if (this.options.greedy) {
                        var f = this.element.parents(":data(droppable):eq(0)");
                        if (f.length) {
                            e = a.data(f[0], "droppable");
                            e.greedyChild = c == "isover" ? 1 : 0
                        }
                    }
                    if (e && c == "isover") {
                        e.isover = 0;
                        e.isout = 1;
                        e._out.call(e, b)
                    }
                    this[c] = 1;
                    this[c == "isout" ? "isover" : "isout"] = 0;
                    this[c == "isover" ? "_over" : "_out"].call(this, b);
                    if (e && c == "isout") {
                        e.isout = 0;
                        e.isover = 1;
                        e._over.call(e, b)
                    }
                }
            }
        })
    }, dragStop:function (d, b) {
        d.element.parents(":not(body,html)").unbind("scroll.droppable");
        d.options.refreshPositions ||
        a.ui.ddmanager.prepareOffsets(d, b)
    }}
})(jQuery);
(function (a) {
    a.widget("ui.resizable", a.ui.mouse, {widgetEventPrefix:"resize", options:{alsoResize:false, animate:false, animateDuration:"slow", animateEasing:"swing", aspectRatio:false, autoHide:false, containment:false, ghost:false, grid:false, handles:"e,s,se", helper:false, maxHeight:null, maxWidth:null, minHeight:10, minWidth:10, zIndex:1E3}, _create:function () {
        var c = this, e = this.options;
        this.element.addClass("ui-resizable");
        a.extend(this, {_aspectRatio:!!e.aspectRatio, aspectRatio:e.aspectRatio, originalElement:this.element,
            _proportionallyResizeElements:[], _helper:e.helper || e.ghost || e.animate ? e.helper || "ui-resizable-helper" : null});
        if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {
            /relative/.test(this.element.css("position")) && a.browser.opera && this.element.css({position:"relative", top:"auto", left:"auto"});
            this.element.wrap(a('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"), width:this.element.outerWidth(), height:this.element.outerHeight(),
                top:this.element.css("top"), left:this.element.css("left")}));
            this.element = this.element.parent().data("resizable", this.element.data("resizable"));
            this.elementIsWrapper = true;
            this.element.css({marginLeft:this.originalElement.css("marginLeft"), marginTop:this.originalElement.css("marginTop"), marginRight:this.originalElement.css("marginRight"), marginBottom:this.originalElement.css("marginBottom")});
            this.originalElement.css({marginLeft:0, marginTop:0, marginRight:0, marginBottom:0});
            this.originalResizeStyle =
                    this.originalElement.css("resize");
            this.originalElement.css("resize", "none");
            this._proportionallyResizeElements.push(this.originalElement.css({position:"static", zoom:1, display:"block"}));
            this.originalElement.css({margin:this.originalElement.css("margin")});
            this._proportionallyResize()
        }
        this.handles = e.handles || (!a(".ui-resizable-handle", this.element).length ? "e,s,se" : {n:".ui-resizable-n", e:".ui-resizable-e", s:".ui-resizable-s", w:".ui-resizable-w", se:".ui-resizable-se", sw:".ui-resizable-sw", ne:".ui-resizable-ne",
            nw:".ui-resizable-nw"});
        if (this.handles.constructor == String) {
            if (this.handles == "all")this.handles = "n,e,s,w,se,sw,ne,nw";
            var f = this.handles.split(",");
            this.handles = {};
            for (var j = 0; j < f.length; j++) {
                var g = a.trim(f[j]), k = a('<div class="ui-resizable-handle ' + ("ui-resizable-" + g) + '"></div>');
                /sw|se|ne|nw/.test(g) && k.css({zIndex:++e.zIndex});
                "se" == g && k.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
                this.handles[g] = ".ui-resizable-" + g;
                this.element.append(k)
            }
        }
        this._renderAxis = function (o) {
            o = o || this.element;
            for (var s in this.handles) {
                if (this.handles[s].constructor ==
                        String)this.handles[s] = a(this.handles[s], this.element).show();
                if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                    var q = a(this.handles[s], this.element), r = 0;
                    r = /sw|ne|nw|se|n|s/.test(s) ? q.outerHeight() : q.outerWidth();
                    q = ["padding", /ne|nw|n/.test(s) ? "Top" : /se|sw|s/.test(s) ? "Bottom" : /^e$/.test(s) ? "Right" : "Left"].join("");
                    o.css(q, r);
                    this._proportionallyResize()
                }
                a(this.handles[s])
            }
        };
        this._renderAxis(this.element);
        this._handles = a(".ui-resizable-handle", this.element).disableSelection();
        this._handles.mouseover(function () {
            if (!c.resizing) {
                if (this.className)var o = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                c.axis = o && o[1] ? o[1] : "se"
            }
        });
        if (e.autoHide) {
            this._handles.hide();
            a(this.element).addClass("ui-resizable-autohide").hover(function () {
                if (!e.disabled) {
                    a(this).removeClass("ui-resizable-autohide");
                    c._handles.show()
                }
            }, function () {
                if (!e.disabled)if (!c.resizing) {
                    a(this).addClass("ui-resizable-autohide");
                    c._handles.hide()
                }
            })
        }
        this._mouseInit()
    }, destroy:function () {
        this._mouseDestroy();
        var c = function (f) {
            a(f).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
        };
        if (this.elementIsWrapper) {
            c(this.element);
            var e = this.element;
            e.after(this.originalElement.css({position:e.css("position"), width:e.outerWidth(), height:e.outerHeight(), top:e.css("top"), left:e.css("left")})).remove()
        }
        this.originalElement.css("resize", this.originalResizeStyle);
        c(this.originalElement);
        return this
    }, _mouseCapture:function (c) {
        var e =
                false;
        for (var f in this.handles)if (a(this.handles[f])[0] == c.target)e = true;
        return!this.options.disabled && e
    }, _mouseStart:function (c) {
        var e = this.options, f = this.element.position(), j = this.element;
        this.resizing = true;
        this.documentScroll = {top:a(document).scrollTop(), left:a(document).scrollLeft()};
        if (j.is(".ui-draggable") || /absolute/.test(j.css("position")))j.css({position:"absolute", top:f.top, left:f.left});
        a.browser.opera && /relative/.test(j.css("position")) && j.css({position:"relative", top:"auto", left:"auto"});
        this._renderProxy();
        f = d(this.helper.css("left"));
        var g = d(this.helper.css("top"));
        if (e.containment) {
            f += a(e.containment).scrollLeft() || 0;
            g += a(e.containment).scrollTop() || 0
        }
        this.offset = this.helper.offset();
        this.position = {left:f, top:g};
        this.size = this._helper ? {width:j.outerWidth(), height:j.outerHeight()} : {width:j.width(), height:j.height()};
        this.originalSize = this._helper ? {width:j.outerWidth(), height:j.outerHeight()} : {width:j.width(), height:j.height()};
        this.originalPosition = {left:f, top:g};
        this.sizeDiff =
        {width:j.outerWidth() - j.width(), height:j.outerHeight() - j.height()};
        this.originalMousePosition = {left:c.pageX, top:c.pageY};
        this.aspectRatio = typeof e.aspectRatio == "number" ? e.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
        e = a(".ui-resizable-" + this.axis).css("cursor");
        a("body").css("cursor", e == "auto" ? this.axis + "-resize" : e);
        j.addClass("ui-resizable-resizing");
        this._propagate("start", c);
        return true
    }, _mouseDrag:function (c) {
        var e = this.helper, f = this.originalMousePosition, j = this._change[this.axis];
        if (!j)return false;
        f = j.apply(this, [c, c.pageX - f.left || 0, c.pageY - f.top || 0]);
        this._updateVirtualBoundaries(c.shiftKey);
        if (this._aspectRatio || c.shiftKey)f = this._updateRatio(f, c);
        f = this._respectSize(f, c);
        this._propagate("resize", c);
        e.css({top:this.position.top + "px", left:this.position.left + "px", width:this.size.width + "px", height:this.size.height + "px"});
        !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize();
        this._updateCache(f);
        this._trigger("resize", c, this.ui());
        return false
    },
        _mouseStop:function (c) {
            this.resizing = false;
            var e = this.options;
            if (this._helper) {
                var f = this._proportionallyResizeElements, j = f.length && /textarea/i.test(f[0].nodeName);
                f = j && a.ui.hasScroll(f[0], "left") ? 0 : this.sizeDiff.height;
                j = j ? 0 : this.sizeDiff.width;
                j = {width:this.helper.width() - j, height:this.helper.height() - f};
                f = parseInt(this.element.css("left"), 10) + (this.position.left - this.originalPosition.left) || null;
                var g = parseInt(this.element.css("top"), 10) + (this.position.top - this.originalPosition.top) || null;
                e.animate ||
                this.element.css(a.extend(j, {top:g, left:f}));
                this.helper.height(this.size.height);
                this.helper.width(this.size.width);
                this._helper && !e.animate && this._proportionallyResize()
            }
            a("body").css("cursor", "auto");
            this.element.removeClass("ui-resizable-resizing");
            this._propagate("stop", c);
            this._helper && this.helper.remove();
            return false
        }, _updateVirtualBoundaries:function (c) {
            var e = this.options, f, j, g;
            e = {minWidth:b(e.minWidth) ? e.minWidth : 0, maxWidth:b(e.maxWidth) ? e.maxWidth : Infinity, minHeight:b(e.minHeight) ? e.minHeight :
                    0, maxHeight:b(e.maxHeight) ? e.maxHeight : Infinity};
            if (this._aspectRatio || c) {
                c = e.minHeight * this.aspectRatio;
                j = e.minWidth / this.aspectRatio;
                f = e.maxHeight * this.aspectRatio;
                g = e.maxWidth / this.aspectRatio;
                if (c > e.minWidth)e.minWidth = c;
                if (j > e.minHeight)e.minHeight = j;
                if (f < e.maxWidth)e.maxWidth = f;
                if (g < e.maxHeight)e.maxHeight = g
            }
            this._vBoundaries = e
        }, _updateCache:function (c) {
            this.offset = this.helper.offset();
            if (b(c.left))this.position.left = c.left;
            if (b(c.top))this.position.top = c.top;
            if (b(c.height))this.size.height =
                    c.height;
            if (b(c.width))this.size.width = c.width
        }, _updateRatio:function (c) {
            var e = this.position, f = this.size, j = this.axis;
            if (b(c.height))c.width = c.height * this.aspectRatio; else if (b(c.width))c.height = c.width / this.aspectRatio;
            if (j == "sw") {
                c.left = e.left + (f.width - c.width);
                c.top = null
            }
            if (j == "nw") {
                c.top = e.top + (f.height - c.height);
                c.left = e.left + (f.width - c.width)
            }
            return c
        }, _respectSize:function (c) {
            var e = this._vBoundaries, f = this.axis, j = b(c.width) && e.maxWidth && e.maxWidth < c.width, g = b(c.height) && e.maxHeight && e.maxHeight <
                    c.height, k = b(c.width) && e.minWidth && e.minWidth > c.width, o = b(c.height) && e.minHeight && e.minHeight > c.height;
            if (k)c.width = e.minWidth;
            if (o)c.height = e.minHeight;
            if (j)c.width = e.maxWidth;
            if (g)c.height = e.maxHeight;
            var s = this.originalPosition.left + this.originalSize.width, q = this.position.top + this.size.height, r = /sw|nw|w/.test(f);
            f = /nw|ne|n/.test(f);
            if (k && r)c.left = s - e.minWidth;
            if (j && r)c.left = s - e.maxWidth;
            if (o && f)c.top = q - e.minHeight;
            if (g && f)c.top = q - e.maxHeight;
            if ((e = !c.width && !c.height) && !c.left && c.top)c.top = null;
            else if (e && !c.top && c.left)c.left = null;
            return c
        }, _proportionallyResize:function () {
            if (this._proportionallyResizeElements.length)for (var c = this.helper || this.element, e = 0; e < this._proportionallyResizeElements.length; e++) {
                var f = this._proportionallyResizeElements[e];
                if (!this.borderDif) {
                    var j = [f.css("borderTopWidth"), f.css("borderRightWidth"), f.css("borderBottomWidth"), f.css("borderLeftWidth")], g = [f.css("paddingTop"), f.css("paddingRight"), f.css("paddingBottom"), f.css("paddingLeft")];
                    this.borderDif = a.map(j,
                            function (k, o) {
                                var s = parseInt(k, 10) || 0, q = parseInt(g[o], 10) || 0;
                                return s + q
                            })
                }
                a.browser.msie && (a(c).is(":hidden") || a(c).parents(":hidden").length) || f.css({height:c.height() - this.borderDif[0] - this.borderDif[2] || 0, width:c.width() - this.borderDif[1] - this.borderDif[3] || 0})
            }
        }, _renderProxy:function () {
            var c = this.options;
            this.elementOffset = this.element.offset();
            if (this._helper) {
                this.helper = this.helper || a('<div style="overflow:hidden;"></div>');
                var e = a.browser.msie && a.browser.version < 7, f = e ? 1 : 0;
                e = e ? 2 : -1;
                this.helper.addClass(this._helper).css({width:this.element.outerWidth() +
                        e, height:this.element.outerHeight() + e, position:"absolute", left:this.elementOffset.left - f + "px", top:this.elementOffset.top - f + "px", zIndex:++c.zIndex});
                this.helper.appendTo("body").disableSelection()
            } else this.helper = this.element
        }, _change:{e:function (c, e) {
            return{width:this.originalSize.width + e}
        }, w:function (c, e) {
            return{left:this.originalPosition.left + e, width:this.originalSize.width - e}
        }, n:function (c, e, f) {
            return{top:this.originalPosition.top + f, height:this.originalSize.height - f}
        }, s:function (c, e, f) {
            return{height:this.originalSize.height +
                    f}
        }, se:function (c, e, f) {
            return a.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [c, e, f]))
        }, sw:function (c, e, f) {
            return a.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [c, e, f]))
        }, ne:function (c, e, f) {
            return a.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [c, e, f]))
        }, nw:function (c, e, f) {
            return a.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [c, e, f]))
        }}, _propagate:function (c, e) {
            a.ui.plugin.call(this, c, [e, this.ui()]);
            c != "resize" && this._trigger(c, e, this.ui())
        }, plugins:{}, ui:function () {
            return{originalElement:this.originalElement, element:this.element, helper:this.helper, position:this.position, size:this.size, originalSize:this.originalSize, originalPosition:this.originalPosition}
        }});
    a.extend(a.ui.resizable, {version:"1.8.16"});
    a.ui.plugin.add("resizable", "alsoResize", {start:function () {
        var c = a(this).data("resizable").options, e = function (f) {
            a(f).each(function () {
                var j = a(this);
                j.data("resizable-alsoresize", {width:parseInt(j.width(),
                        10), height:parseInt(j.height(), 10), left:parseInt(j.css("left"), 10), top:parseInt(j.css("top"), 10), position:j.css("position")})
            })
        };
        if (typeof c.alsoResize == "object" && !c.alsoResize.parentNode)if (c.alsoResize.length) {
            c.alsoResize = c.alsoResize[0];
            e(c.alsoResize)
        } else a.each(c.alsoResize, function (f) {
            e(f)
        }); else e(c.alsoResize)
    }, resize:function (c, e) {
        var f = a(this).data("resizable"), j = f.options, g = f.originalSize, k = f.originalPosition, o = {height:f.size.height - g.height || 0, width:f.size.width - g.width || 0, top:f.position.top -
                k.top || 0, left:f.position.left - k.left || 0}, s = function (q, r) {
            a(q).each(function () {
                var v = a(this), t = a(this).data("resizable-alsoresize"), y = {}, E = r && r.length ? r : v.parents(e.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                a.each(E, function (G, B) {
                    var N = (t[B] || 0) + (o[B] || 0);
                    if (N && N >= 0)y[B] = N || null
                });
                if (a.browser.opera && /relative/.test(v.css("position"))) {
                    f._revertToRelativePosition = true;
                    v.css({position:"absolute", top:"auto", left:"auto"})
                }
                v.css(y)
            })
        };
        typeof j.alsoResize == "object" &&
                !j.alsoResize.nodeType ? a.each(j.alsoResize, function (q, r) {
            s(q, r)
        }) : s(j.alsoResize)
    }, stop:function () {
        var c = a(this).data("resizable"), e = c.options, f = function (j) {
            a(j).each(function () {
                var g = a(this);
                g.css({position:g.data("resizable-alsoresize").position})
            })
        };
        if (c._revertToRelativePosition) {
            c._revertToRelativePosition = false;
            typeof e.alsoResize == "object" && !e.alsoResize.nodeType ? a.each(e.alsoResize, function (j) {
                f(j)
            }) : f(e.alsoResize)
        }
        a(this).removeData("resizable-alsoresize")
    }});
    a.ui.plugin.add("resizable",
            "animate", {stop:function (c) {
                var e = a(this).data("resizable"), f = e.options, j = e._proportionallyResizeElements, g = j.length && /textarea/i.test(j[0].nodeName), k = g && a.ui.hasScroll(j[0], "left") ? 0 : e.sizeDiff.height;
                g = {width:e.size.width - (g ? 0 : e.sizeDiff.width), height:e.size.height - k};
                k = parseInt(e.element.css("left"), 10) + (e.position.left - e.originalPosition.left) || null;
                var o = parseInt(e.element.css("top"), 10) + (e.position.top - e.originalPosition.top) || null;
                e.element.animate(a.extend(g, o && k ? {top:o, left:k} : {}), {duration:f.animateDuration,
                    easing:f.animateEasing, step:function () {
                        var s = {width:parseInt(e.element.css("width"), 10), height:parseInt(e.element.css("height"), 10), top:parseInt(e.element.css("top"), 10), left:parseInt(e.element.css("left"), 10)};
                        j && j.length && a(j[0]).css({width:s.width, height:s.height});
                        e._updateCache(s);
                        e._propagate("resize", c)
                    }})
            }});
    a.ui.plugin.add("resizable", "containment", {start:function () {
        var c = a(this).data("resizable"), e = c.element, f = c.options.containment;
        if (e = f instanceof a ? f.get(0) : /parent/.test(f) ? e.parent().get(0) :
                f) {
            c.containerElement = a(e);
            if (/document/.test(f) || f == document) {
                c.containerOffset = {left:0, top:0};
                c.containerPosition = {left:0, top:0};
                c.parentData = {element:a(document), left:0, top:0, width:a(document).width(), height:a(document).height() || document.body.parentNode.scrollHeight}
            } else {
                var j = a(e), g = [];
                a(["Top", "Right", "Left", "Bottom"]).each(function (s, q) {
                    g[s] = d(j.css("padding" + q))
                });
                c.containerOffset = j.offset();
                c.containerPosition = j.position();
                c.containerSize = {height:j.innerHeight() - g[3], width:j.innerWidth() -
                        g[1]};
                f = c.containerOffset;
                var k = c.containerSize.height, o = c.containerSize.width;
                o = a.ui.hasScroll(e, "left") ? e.scrollWidth : o;
                k = a.ui.hasScroll(e) ? e.scrollHeight : k;
                c.parentData = {element:e, left:f.left, top:f.top, width:o, height:k}
            }
        }
    }, resize:function (c) {
        var e = a(this).data("resizable"), f = e.options, j = e.containerOffset, g = e.position;
        c = e._aspectRatio || c.shiftKey;
        var k = {top:0, left:0}, o = e.containerElement;
        if (o[0] != document && /static/.test(o.css("position")))k = j;
        if (g.left < (e._helper ? j.left : 0)) {
            e.size.width += e._helper ?
                    e.position.left - j.left : e.position.left - k.left;
            if (c)e.size.height = e.size.width / f.aspectRatio;
            e.position.left = f.helper ? j.left : 0
        }
        if (g.top < (e._helper ? j.top : 0)) {
            e.size.height += e._helper ? e.position.top - j.top : e.position.top;
            if (c)e.size.width = e.size.height * f.aspectRatio;
            e.position.top = e._helper ? j.top : 0
        }
        e.offset.left = e.parentData.left + e.position.left;
        e.offset.top = e.parentData.top + e.position.top;
        f = Math.abs((e._helper ? e.offset.left - k.left : e.offset.left - k.left) + e.sizeDiff.width);
        j = Math.abs((e._helper ? e.offset.top -
                k.top : e.offset.top - j.top) + e.sizeDiff.height);
        g = e.containerElement.get(0) == e.element.parent().get(0);
        k = /relative|absolute/.test(e.containerElement.css("position"));
        if (g && k)f -= e.parentData.left;
        if (f + e.size.width >= e.parentData.width) {
            e.size.width = e.parentData.width - f;
            if (c)e.size.height = e.size.width / e.aspectRatio
        }
        if (j + e.size.height >= e.parentData.height) {
            e.size.height = e.parentData.height - j;
            if (c)e.size.width = e.size.height * e.aspectRatio
        }
    }, stop:function () {
        var c = a(this).data("resizable"), e = c.options, f = c.containerOffset,
                j = c.containerPosition, g = c.containerElement, k = a(c.helper), o = k.offset(), s = k.outerWidth() - c.sizeDiff.width;
        k = k.outerHeight() - c.sizeDiff.height;
        c._helper && !e.animate && /relative/.test(g.css("position")) && a(this).css({left:o.left - j.left - f.left, width:s, height:k});
        c._helper && !e.animate && /static/.test(g.css("position")) && a(this).css({left:o.left - j.left - f.left, width:s, height:k})
    }});
    a.ui.plugin.add("resizable", "ghost", {start:function () {
        var c = a(this).data("resizable"), e = c.options, f = c.size;
        c.ghost = c.originalElement.clone();
        c.ghost.css({opacity:0.25, display:"block", position:"relative", height:f.height, width:f.width, margin:0, left:0, top:0}).addClass("ui-resizable-ghost").addClass(typeof e.ghost == "string" ? e.ghost : "");
        c.ghost.appendTo(c.helper)
    }, resize:function () {
        var c = a(this).data("resizable");
        c.ghost && c.ghost.css({position:"relative", height:c.size.height, width:c.size.width})
    }, stop:function () {
        var c = a(this).data("resizable");
        c.ghost && c.helper && c.helper.get(0).removeChild(c.ghost.get(0))
    }});
    a.ui.plugin.add("resizable", "grid",
            {resize:function () {
                var c = a(this).data("resizable"), e = c.options, f = c.size, j = c.originalSize, g = c.originalPosition, k = c.axis;
                e.grid = typeof e.grid == "number" ? [e.grid, e.grid] : e.grid;
                var o = Math.round((f.width - j.width) / (e.grid[0] || 1)) * (e.grid[0] || 1);
                e = Math.round((f.height - j.height) / (e.grid[1] || 1)) * (e.grid[1] || 1);
                if (/^(se|s|e)$/.test(k)) {
                    c.size.width = j.width + o;
                    c.size.height = j.height + e
                } else if (/^(ne)$/.test(k)) {
                    c.size.width = j.width + o;
                    c.size.height = j.height + e;
                    c.position.top = g.top - e
                } else {
                    if (/^(sw)$/.test(k)) {
                        c.size.width =
                                j.width + o;
                        c.size.height = j.height + e
                    } else {
                        c.size.width = j.width + o;
                        c.size.height = j.height + e;
                        c.position.top = g.top - e
                    }
                    c.position.left = g.left - o
                }
            }});
    a.ui.plugin.add("resizable", "iframeFix", {start:function () {
        var c = a(this).data("resizable").options;
        a(c.iframeFix === true ? "iframe" : c.iframeFix).each(function () {
            a('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth + "px", height:this.offsetHeight + "px", position:"absolute", opacity:"0.001", zIndex:1E3}).css(a(this).offset()).appendTo("body")
        })
    },
        stop:function () {
            a("div.ui-resizable-iframeFix").each(function () {
                this.parentNode.removeChild(this)
            })
        }});
    var d = function (c) {
        return parseInt(c, 10) || 0
    }, b = function (c) {
        return!isNaN(parseInt(c, 10))
    }
})(jQuery);
(function (a) {
    a.widget("ui.sortable", a.ui.mouse, {widgetEventPrefix:"sort", options:{appendTo:"parent", axis:false, connectWith:false, containment:false, cursor:"auto", cursorAt:false, dropOnEmpty:true, forcePlaceholderSize:false, forceHelperSize:false, grid:false, handle:false, helper:"original", items:"> *", opacity:false, placeholder:false, revert:false, scroll:true, scrollSensitivity:20, scrollSpeed:20, scope:"default", tolerance:"intersect", zIndex:1E3}, _create:function () {
        var d = this.options;
        this.containerCache = {};
        this.element.addClass("ui-sortable");
        this.refresh();
        this.floating = this.items.length ? d.axis === "x" || /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : false;
        this.offset = this.element.offset();
        this._mouseInit()
    }, destroy:function () {
        this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
        this._mouseDestroy();
        for (var d = this.items.length - 1; d >= 0; d--)this.items[d].item.removeData("sortable-item");
        return this
    }, _setOption:function (d, b) {
        if (d ===
                "disabled") {
            this.options[d] = b;
            this.widget()[b ? "addClass" : "removeClass"]("ui-sortable-disabled")
        } else a.Widget.prototype._setOption.apply(this, arguments)
    }, _mouseCapture:function (d, b) {
        if (this.reverting)return false;
        if (this.options.disabled || this.options.type == "static")return false;
        this._refreshItems(d);
        var c = null, e = this;
        a(d.target).parents().each(function () {
            if (a.data(this, "sortable-item") == e) {
                c = a(this);
                return false
            }
        });
        if (a.data(d.target, "sortable-item") == e)c = a(d.target);
        if (!c)return false;
        if (this.options.handle &&
                !b) {
            var f = false;
            a(this.options.handle, c).find("*").andSelf().each(function () {
                if (this == d.target)f = true
            });
            if (!f)return false
        }
        this.currentItem = c;
        this._removeCurrentsFromItems();
        return true
    }, _mouseStart:function (d, b, c) {
        b = this.options;
        this.currentContainer = this;
        this.refreshPositions();
        this.helper = this._createHelper(d);
        this._cacheHelperProportions();
        this._cacheMargins();
        this.scrollParent = this.helper.scrollParent();
        this.offset = this.currentItem.offset();
        this.offset = {top:this.offset.top - this.margins.top, left:this.offset.left -
                this.margins.left};
        this.helper.css("position", "absolute");
        this.cssPosition = this.helper.css("position");
        a.extend(this.offset, {click:{left:d.pageX - this.offset.left, top:d.pageY - this.offset.top}, parent:this._getParentOffset(), relative:this._getRelativeOffset()});
        this.originalPosition = this._generatePosition(d);
        this.originalPageX = d.pageX;
        this.originalPageY = d.pageY;
        b.cursorAt && this._adjustOffsetFromHelper(b.cursorAt);
        this.domPosition = {prev:this.currentItem.prev()[0], parent:this.currentItem.parent()[0]};
        this.helper[0] != this.currentItem[0] && this.currentItem.hide();
        this._createPlaceholder();
        b.containment && this._setContainment();
        if (b.cursor) {
            if (a("body").css("cursor"))this._storedCursor = a("body").css("cursor");
            a("body").css("cursor", b.cursor)
        }
        if (b.opacity) {
            if (this.helper.css("opacity"))this._storedOpacity = this.helper.css("opacity");
            this.helper.css("opacity", b.opacity)
        }
        if (b.zIndex) {
            if (this.helper.css("zIndex"))this._storedZIndex = this.helper.css("zIndex");
            this.helper.css("zIndex", b.zIndex)
        }
        if (this.scrollParent[0] !=
                document && this.scrollParent[0].tagName != "HTML")this.overflowOffset = this.scrollParent.offset();
        this._trigger("start", d, this._uiHash());
        this._preserveHelperProportions || this._cacheHelperProportions();
        if (!c)for (c = this.containers.length - 1; c >= 0; c--)this.containers[c]._trigger("activate", d, this._uiHash(this));
        if (a.ui.ddmanager)a.ui.ddmanager.current = this;
        a.ui.ddmanager && !b.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, d);
        this.dragging = true;
        this.helper.addClass("ui-sortable-helper");
        this._mouseDrag(d);
        return true
    }, _mouseDrag:function (d) {
        this.position = this._generatePosition(d);
        this.positionAbs = this._convertPositionTo("absolute");
        if (!this.lastPositionAbs)this.lastPositionAbs = this.positionAbs;
        if (this.options.scroll) {
            var b = this.options, c = false;
            if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
                if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - d.pageY < b.scrollSensitivity)this.scrollParent[0].scrollTop = c = this.scrollParent[0].scrollTop + b.scrollSpeed; else if (d.pageY - this.overflowOffset.top <
                        b.scrollSensitivity)this.scrollParent[0].scrollTop = c = this.scrollParent[0].scrollTop - b.scrollSpeed;
                if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - d.pageX < b.scrollSensitivity)this.scrollParent[0].scrollLeft = c = this.scrollParent[0].scrollLeft + b.scrollSpeed; else if (d.pageX - this.overflowOffset.left < b.scrollSensitivity)this.scrollParent[0].scrollLeft = c = this.scrollParent[0].scrollLeft - b.scrollSpeed
            } else {
                if (d.pageY - a(document).scrollTop() < b.scrollSensitivity)c = a(document).scrollTop(a(document).scrollTop() -
                        b.scrollSpeed); else if (a(window).height() - (d.pageY - a(document).scrollTop()) < b.scrollSensitivity)c = a(document).scrollTop(a(document).scrollTop() + b.scrollSpeed);
                if (d.pageX - a(document).scrollLeft() < b.scrollSensitivity)c = a(document).scrollLeft(a(document).scrollLeft() - b.scrollSpeed); else if (a(window).width() - (d.pageX - a(document).scrollLeft()) < b.scrollSensitivity)c = a(document).scrollLeft(a(document).scrollLeft() + b.scrollSpeed)
            }
            c !== false && a.ui.ddmanager && !b.dropBehaviour && a.ui.ddmanager.prepareOffsets(this,
                    d)
        }
        this.positionAbs = this._convertPositionTo("absolute");
        if (!this.options.axis || this.options.axis != "y")this.helper[0].style.left = this.position.left + "px";
        if (!this.options.axis || this.options.axis != "x")this.helper[0].style.top = this.position.top + "px";
        for (b = this.items.length - 1; b >= 0; b--) {
            c = this.items[b];
            var e = c.item[0], f = this._intersectsWithPointer(c);
            if (f)if (e != this.currentItem[0] && this.placeholder[f == 1 ? "next" : "prev"]()[0] != e && !a.ui.contains(this.placeholder[0], e) && (this.options.type == "semi-dynamic" ? !a.ui.contains(this.element[0],
                    e) : true)) {
                this.direction = f == 1 ? "down" : "up";
                if (this.options.tolerance == "pointer" || this._intersectsWithSides(c))this._rearrange(d, c); else break;
                this._trigger("change", d, this._uiHash());
                break
            }
        }
        this._contactContainers(d);
        a.ui.ddmanager && a.ui.ddmanager.drag(this, d);
        this._trigger("sort", d, this._uiHash());
        this.lastPositionAbs = this.positionAbs;
        return false
    }, _mouseStop:function (d, b) {
        if (d) {
            a.ui.ddmanager && !this.options.dropBehaviour && a.ui.ddmanager.drop(this, d);
            if (this.options.revert) {
                var c = this, e = c.placeholder.offset();
                c.reverting = true;
                a(this.helper).animate({left:e.left - this.offset.parent.left - c.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft), top:e.top - this.offset.parent.top - c.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)}, parseInt(this.options.revert, 10) || 500, function () {
                    c._clear(d)
                })
            } else this._clear(d, b);
            return false
        }
    }, cancel:function () {
        if (this.dragging) {
            this._mouseUp({target:null});
            this.options.helper == "original" ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") :
                    this.currentItem.show();
            for (var d = this.containers.length - 1; d >= 0; d--) {
                this.containers[d]._trigger("deactivate", null, this._uiHash(this));
                if (this.containers[d].containerCache.over) {
                    this.containers[d]._trigger("out", null, this._uiHash(this));
                    this.containers[d].containerCache.over = 0
                }
            }
        }
        if (this.placeholder) {
            this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
            this.options.helper != "original" && this.helper && this.helper[0].parentNode && this.helper.remove();
            a.extend(this,
                    {helper:null, dragging:false, reverting:false, _noFinalSort:null});
            this.domPosition.prev ? a(this.domPosition.prev).after(this.currentItem) : a(this.domPosition.parent).prepend(this.currentItem)
        }
        return this
    }, serialize:function (d) {
        var b = this._getItemsAsjQuery(d && d.connected), c = [];
        d = d || {};
        a(b).each(function () {
            var e = (a(d.item || this).attr(d.attribute || "id") || "").match(d.expression || /(.+)[-=_](.+)/);
            if (e)c.push((d.key || e[1] + "[]") + "=" + (d.key && d.expression ? e[1] : e[2]))
        });
        !c.length && d.key && c.push(d.key + "=");
        return c.join("&")
    },
        toArray:function (d) {
            var b = this._getItemsAsjQuery(d && d.connected), c = [];
            d = d || {};
            b.each(function () {
                c.push(a(d.item || this).attr(d.attribute || "id") || "")
            });
            return c
        }, _intersectsWith:function (d) {
            var b = this.positionAbs.left, c = b + this.helperProportions.width, e = this.positionAbs.top, f = e + this.helperProportions.height, j = d.left, g = j + d.width, k = d.top, o = k + d.height, s = this.offset.click.top, q = this.offset.click.left;
            s = e + s > k && e + s < o && b + q > j && b + q < g;
            return this.options.tolerance == "pointer" || this.options.forcePointerForContainers ||
                    this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > d[this.floating ? "width" : "height"] ? s : j < b + this.helperProportions.width / 2 && c - this.helperProportions.width / 2 < g && k < e + this.helperProportions.height / 2 && f - this.helperProportions.height / 2 < o
        }, _intersectsWithPointer:function (d) {
            var b = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, d.top, d.height);
            d = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, d.left, d.width);
            b = b && d;
            d = this._getDragVerticalDirection();
            var c = this._getDragHorizontalDirection();
            if (!b)return false;
            return this.floating ? c && c == "right" || d == "down" ? 2 : 1 : d && (d == "down" ? 2 : 1)
        }, _intersectsWithSides:function (d) {
            var b = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, d.top + d.height / 2, d.height);
            d = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, d.left + d.width / 2, d.width);
            var c = this._getDragVerticalDirection(), e = this._getDragHorizontalDirection();
            return this.floating && e ? e == "right" && d || e == "left" && !d : c && (c == "down" && b || c == "up" && !b)
        },
        _getDragVerticalDirection:function () {
            var d = this.positionAbs.top - this.lastPositionAbs.top;
            return d != 0 && (d > 0 ? "down" : "up")
        }, _getDragHorizontalDirection:function () {
            var d = this.positionAbs.left - this.lastPositionAbs.left;
            return d != 0 && (d > 0 ? "right" : "left")
        }, refresh:function (d) {
            this._refreshItems(d);
            this.refreshPositions();
            return this
        }, _connectWith:function () {
            var d = this.options;
            return d.connectWith.constructor == String ? [d.connectWith] : d.connectWith
        }, _getItemsAsjQuery:function (d) {
            var b = [], c = [], e = this._connectWith();
            if (e && d)for (d = e.length - 1; d >= 0; d--)for (var f = a(e[d]), j = f.length - 1; j >= 0; j--) {
                var g = a.data(f[j], "sortable");
                if (g && g != this && !g.options.disabled)c.push([a.isFunction(g.options.items) ? g.options.items.call(g.element) : a(g.options.items, g.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), g])
            }
            c.push([a.isFunction(this.options.items) ? this.options.items.call(this.element, null, {options:this.options, item:this.currentItem}) : a(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),
                this]);
            for (d = c.length - 1; d >= 0; d--)c[d][0].each(function () {
                b.push(this)
            });
            return a(b)
        }, _removeCurrentsFromItems:function () {
            for (var d = this.currentItem.find(":data(sortable-item)"), b = 0; b < this.items.length; b++)for (var c = 0; c < d.length; c++)d[c] == this.items[b].item[0] && this.items.splice(b, 1)
        }, _refreshItems:function (d) {
            this.items = [];
            this.containers = [this];
            var b = this.items, c = [
                [a.isFunction(this.options.items) ? this.options.items.call(this.element[0], d, {item:this.currentItem}) : a(this.options.items, this.element),
                    this]
            ], e = this._connectWith();
            if (e)for (var f = e.length - 1; f >= 0; f--)for (var j = a(e[f]), g = j.length - 1; g >= 0; g--) {
                var k = a.data(j[g], "sortable");
                if (k && k != this && !k.options.disabled) {
                    c.push([a.isFunction(k.options.items) ? k.options.items.call(k.element[0], d, {item:this.currentItem}) : a(k.options.items, k.element), k]);
                    this.containers.push(k)
                }
            }
            for (f = c.length - 1; f >= 0; f--) {
                d = c[f][1];
                e = c[f][0];
                g = 0;
                for (j = e.length; g < j; g++) {
                    k = a(e[g]);
                    k.data("sortable-item", d);
                    b.push({item:k, instance:d, width:0, height:0, left:0, top:0})
                }
            }
        }, refreshPositions:function (d) {
            if (this.offsetParent &&
                    this.helper)this.offset.parent = this._getParentOffset();
            for (var b = this.items.length - 1; b >= 0; b--) {
                var c = this.items[b];
                if (!(c.instance != this.currentContainer && this.currentContainer && c.item[0] != this.currentItem[0])) {
                    var e = this.options.toleranceElement ? a(this.options.toleranceElement, c.item) : c.item;
                    if (!d) {
                        c.width = e.outerWidth();
                        c.height = e.outerHeight()
                    }
                    e = e.offset();
                    c.left = e.left;
                    c.top = e.top
                }
            }
            if (this.options.custom && this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this); else for (b =
                                                                                                                                                 this.containers.length - 1; b >= 0; b--) {
                e = this.containers[b].element.offset();
                this.containers[b].containerCache.left = e.left;
                this.containers[b].containerCache.top = e.top;
                this.containers[b].containerCache.width = this.containers[b].element.outerWidth();
                this.containers[b].containerCache.height = this.containers[b].element.outerHeight()
            }
            return this
        }, _createPlaceholder:function (d) {
            var b = d || this, c = b.options;
            if (!c.placeholder || c.placeholder.constructor == String) {
                var e = c.placeholder;
                c.placeholder = {element:function () {
                    var f =
                            a(document.createElement(b.currentItem[0].nodeName)).addClass(e || b.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                    if (!e)f.style.visibility = "hidden";
                    return f
                }, update:function (f, j) {
                    if (!(e && !c.forcePlaceholderSize)) {
                        j.height() || j.height(b.currentItem.innerHeight() - parseInt(b.currentItem.css("paddingTop") || 0, 10) - parseInt(b.currentItem.css("paddingBottom") || 0, 10));
                        j.width() || j.width(b.currentItem.innerWidth() - parseInt(b.currentItem.css("paddingLeft") || 0, 10) - parseInt(b.currentItem.css("paddingRight") ||
                                0, 10))
                    }
                }}
            }
            b.placeholder = a(c.placeholder.element.call(b.element, b.currentItem));
            b.currentItem.after(b.placeholder);
            c.placeholder.update(b, b.placeholder)
        }, _contactContainers:function (d) {
            for (var b = null, c = null, e = this.containers.length - 1; e >= 0; e--)if (!a.ui.contains(this.currentItem[0], this.containers[e].element[0]))if (this._intersectsWith(this.containers[e].containerCache)) {
                if (!(b && a.ui.contains(this.containers[e].element[0], b.element[0]))) {
                    b = this.containers[e];
                    c = e
                }
            } else if (this.containers[e].containerCache.over) {
                this.containers[e]._trigger("out",
                        d, this._uiHash(this));
                this.containers[e].containerCache.over = 0
            }
            if (b)if (this.containers.length === 1) {
                this.containers[c]._trigger("over", d, this._uiHash(this));
                this.containers[c].containerCache.over = 1
            } else if (this.currentContainer != this.containers[c]) {
                b = 1E4;
                e = null;
                for (var f = this.positionAbs[this.containers[c].floating ? "left" : "top"], j = this.items.length - 1; j >= 0; j--)if (a.ui.contains(this.containers[c].element[0], this.items[j].item[0])) {
                    var g = this.items[j][this.containers[c].floating ? "left" : "top"];
                    if (Math.abs(g -
                            f) < b) {
                        b = Math.abs(g - f);
                        e = this.items[j]
                    }
                }
                if (e || this.options.dropOnEmpty) {
                    this.currentContainer = this.containers[c];
                    e ? this._rearrange(d, e, null, true) : this._rearrange(d, null, this.containers[c].element, true);
                    this._trigger("change", d, this._uiHash());
                    this.containers[c]._trigger("change", d, this._uiHash(this));
                    this.options.placeholder.update(this.currentContainer, this.placeholder);
                    this.containers[c]._trigger("over", d, this._uiHash(this));
                    this.containers[c].containerCache.over = 1
                }
            }
        }, _createHelper:function (d) {
            var b =
                    this.options;
            d = a.isFunction(b.helper) ? a(b.helper.apply(this.element[0], [d, this.currentItem])) : b.helper == "clone" ? this.currentItem.clone() : this.currentItem;
            d.parents("body").length || a(b.appendTo != "parent" ? b.appendTo : this.currentItem[0].parentNode)[0].appendChild(d[0]);
            if (d[0] == this.currentItem[0])this._storedCSS = {width:this.currentItem[0].style.width, height:this.currentItem[0].style.height, position:this.currentItem.css("position"), top:this.currentItem.css("top"), left:this.currentItem.css("left")};
            if (d[0].style.width ==
                    "" || b.forceHelperSize)d.width(this.currentItem.width());
            if (d[0].style.height == "" || b.forceHelperSize)d.height(this.currentItem.height());
            return d
        }, _adjustOffsetFromHelper:function (d) {
            if (typeof d == "string")d = d.split(" ");
            if (a.isArray(d))d = {left:+d[0], top:+d[1] || 0};
            if ("left"in d)this.offset.click.left = d.left + this.margins.left;
            if ("right"in d)this.offset.click.left = this.helperProportions.width - d.right + this.margins.left;
            if ("top"in d)this.offset.click.top = d.top + this.margins.top;
            if ("bottom"in d)this.offset.click.top =
                    this.helperProportions.height - d.bottom + this.margins.top
        }, _getParentOffset:function () {
            this.offsetParent = this.helper.offsetParent();
            var d = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                d.left += this.scrollParent.scrollLeft();
                d.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie)d =
            {top:0, left:0};
            return{top:d.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left:d.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)}
        }, _getRelativeOffset:function () {
            if (this.cssPosition == "relative") {
                var d = this.currentItem.position();
                return{top:d.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left:d.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()}
            } else return{top:0, left:0}
        }, _cacheMargins:function () {
            this.margins = {left:parseInt(this.currentItem.css("marginLeft"),
                    10) || 0, top:parseInt(this.currentItem.css("marginTop"), 10) || 0}
        }, _cacheHelperProportions:function () {
            this.helperProportions = {width:this.helper.outerWidth(), height:this.helper.outerHeight()}
        }, _setContainment:function () {
            var d = this.options;
            if (d.containment == "parent")d.containment = this.helper[0].parentNode;
            if (d.containment == "document" || d.containment == "window")this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, a(d.containment == "document" ?
                    document : window).width() - this.helperProportions.width - this.margins.left, (a(d.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(d.containment)) {
                var b = a(d.containment)[0];
                d = a(d.containment).offset();
                var c = a(b).css("overflow") != "hidden";
                this.containment = [d.left + (parseInt(a(b).css("borderLeftWidth"), 10) || 0) + (parseInt(a(b).css("paddingLeft"), 10) || 0) - this.margins.left, d.top + (parseInt(a(b).css("borderTopWidth"),
                        10) || 0) + (parseInt(a(b).css("paddingTop"), 10) || 0) - this.margins.top, d.left + (c ? Math.max(b.scrollWidth, b.offsetWidth) : b.offsetWidth) - (parseInt(a(b).css("borderLeftWidth"), 10) || 0) - (parseInt(a(b).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, d.top + (c ? Math.max(b.scrollHeight, b.offsetHeight) : b.offsetHeight) - (parseInt(a(b).css("borderTopWidth"), 10) || 0) - (parseInt(a(b).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
            }
        }, _convertPositionTo:function (d, b) {
            if (!b)b =
                    this.position;
            var c = d == "absolute" ? 1 : -1, e = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, f = /(html|body)/i.test(e[0].tagName);
            return{top:b.top + this.offset.relative.top * c + this.offset.parent.top * c - (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0 : e.scrollTop()) * c), left:b.left + this.offset.relative.left * c + this.offset.parent.left * c - (a.browser.safari &&
                    this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0 : e.scrollLeft()) * c)}
        }, _generatePosition:function (d) {
            var b = this.options, c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, e = /(html|body)/i.test(c[0].tagName);
            if (this.cssPosition == "relative" && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0]))this.offset.relative = this._getRelativeOffset();
            var f = d.pageX, j = d.pageY;
            if (this.originalPosition) {
                if (this.containment) {
                    if (d.pageX - this.offset.click.left < this.containment[0])f = this.containment[0] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top < this.containment[1])j = this.containment[1] + this.offset.click.top;
                    if (d.pageX - this.offset.click.left > this.containment[2])f = this.containment[2] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top > this.containment[3])j = this.containment[3] + this.offset.click.top
                }
                if (b.grid) {
                    j = this.originalPageY + Math.round((j -
                            this.originalPageY) / b.grid[1]) * b.grid[1];
                    j = this.containment ? !(j - this.offset.click.top < this.containment[1] || j - this.offset.click.top > this.containment[3]) ? j : !(j - this.offset.click.top < this.containment[1]) ? j - b.grid[1] : j + b.grid[1] : j;
                    f = this.originalPageX + Math.round((f - this.originalPageX) / b.grid[0]) * b.grid[0];
                    f = this.containment ? !(f - this.offset.click.left < this.containment[0] || f - this.offset.click.left > this.containment[2]) ? f : !(f - this.offset.click.left < this.containment[0]) ? f - b.grid[0] : f + b.grid[0] : f
                }
            }
            return{top:j -
                    this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : c.scrollTop()), left:f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : c.scrollLeft())}
        }, _rearrange:function (d, b, c, e) {
            c ? c[0].appendChild(this.placeholder[0]) : b.item[0].parentNode.insertBefore(this.placeholder[0],
                    this.direction == "down" ? b.item[0] : b.item[0].nextSibling);
            this.counter = this.counter ? ++this.counter : 1;
            var f = this, j = this.counter;
            window.setTimeout(function () {
                j == f.counter && f.refreshPositions(!e)
            }, 0)
        }, _clear:function (d, b) {
            this.reverting = false;
            var c = [];
            !this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem);
            this._noFinalSort = null;
            if (this.helper[0] == this.currentItem[0]) {
                for (var e in this._storedCSS)if (this._storedCSS[e] == "auto" || this._storedCSS[e] == "static")this._storedCSS[e] =
                        "";
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else this.currentItem.show();
            this.fromOutside && !b && c.push(function (f) {
                this._trigger("receive", f, this._uiHash(this.fromOutside))
            });
            if ((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !b)c.push(function (f) {
                this._trigger("update", f, this._uiHash())
            });
            if (!a.ui.contains(this.element[0], this.currentItem[0])) {
                b || c.push(function (f) {
                    this._trigger("remove",
                            f, this._uiHash())
                });
                for (e = this.containers.length - 1; e >= 0; e--)if (a.ui.contains(this.containers[e].element[0], this.currentItem[0]) && !b) {
                    c.push(function (f) {
                        return function (j) {
                            f._trigger("receive", j, this._uiHash(this))
                        }
                    }.call(this, this.containers[e]));
                    c.push(function (f) {
                        return function (j) {
                            f._trigger("update", j, this._uiHash(this))
                        }
                    }.call(this, this.containers[e]))
                }
            }
            for (e = this.containers.length - 1; e >= 0; e--) {
                b || c.push(function (f) {
                    return function (j) {
                        f._trigger("deactivate", j, this._uiHash(this))
                    }
                }.call(this,
                        this.containers[e]));
                if (this.containers[e].containerCache.over) {
                    c.push(function (f) {
                        return function (j) {
                            f._trigger("out", j, this._uiHash(this))
                        }
                    }.call(this, this.containers[e]));
                    this.containers[e].containerCache.over = 0
                }
            }
            this._storedCursor && a("body").css("cursor", this._storedCursor);
            this._storedOpacity && this.helper.css("opacity", this._storedOpacity);
            if (this._storedZIndex)this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex);
            this.dragging = false;
            if (this.cancelHelperRemoval) {
                if (!b) {
                    this._trigger("beforeStop",
                            d, this._uiHash());
                    for (e = 0; e < c.length; e++)c[e].call(this, d);
                    this._trigger("stop", d, this._uiHash())
                }
                return false
            }
            b || this._trigger("beforeStop", d, this._uiHash());
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
            this.helper[0] != this.currentItem[0] && this.helper.remove();
            this.helper = null;
            if (!b) {
                for (e = 0; e < c.length; e++)c[e].call(this, d);
                this._trigger("stop", d, this._uiHash())
            }
            this.fromOutside = false;
            return true
        }, _trigger:function () {
            a.Widget.prototype._trigger.apply(this, arguments) === false && this.cancel()
        },
        _uiHash:function (d) {
            var b = d || this;
            return{helper:b.helper, placeholder:b.placeholder || a([]), position:b.position, originalPosition:b.originalPosition, offset:b.positionAbs, item:b.currentItem, sender:d ? d.element : null}
        }});
    a.extend(a.ui.sortable, {version:"1.8.16"})
})(jQuery);
(function (a) {
    var d = 0;
    a.widget("ui.autocomplete", {options:{appendTo:"body", autoFocus:false, delay:300, minLength:1, position:{my:"left top", at:"left bottom", collision:"none"}, source:null}, pending:0, _create:function () {
        var b = this, c = this.element[0].ownerDocument, e;
        this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({role:"textbox", "aria-autocomplete":"list", "aria-haspopup":"true"}).bind("keydown.autocomplete",function (f) {
            if (!(b.options.disabled || b.element.propAttr("readOnly"))) {
                e =
                        false;
                var j = a.ui.keyCode;
                switch (f.keyCode) {
                    case j.PAGE_UP:
                        b._move("previousPage", f);
                        break;
                    case j.PAGE_DOWN:
                        b._move("nextPage", f);
                        break;
                    case j.UP:
                        b._move("previous", f);
                        f.preventDefault();
                        break;
                    case j.DOWN:
                        b._move("next", f);
                        f.preventDefault();
                        break;
                    case j.ENTER:
                    case j.NUMPAD_ENTER:
                        if (b.menu.active) {
                            e = true;
                            f.preventDefault()
                        }
                    case j.TAB:
                        if (!b.menu.active)return;
                        b.menu.select(f);
                        break;
                    case j.ESCAPE:
                        b.element.val(b.term);
                        b.close(f);
                        break;
                    default:
                        clearTimeout(b.searching);
                        b.searching = setTimeout(function () {
                            if (b.term !=
                                    b.element.val()) {
                                b.selectedItem = null;
                                b.search(null, f)
                            }
                        }, b.options.delay);
                        break
                }
            }
        }).bind("keypress.autocomplete",function (f) {
                    if (e) {
                        e = false;
                        f.preventDefault()
                    }
                }).bind("focus.autocomplete",function () {
                    if (!b.options.disabled) {
                        b.selectedItem = null;
                        b.previous = b.element.val()
                    }
                }).bind("blur.autocomplete", function (f) {
                    if (!b.options.disabled) {
                        clearTimeout(b.searching);
                        b.closing = setTimeout(function () {
                            b.close(f);
                            b._change(f)
                        }, 150)
                    }
                });
        this._initSource();
        this.response = function () {
            return b._response.apply(b, arguments)
        };
        this.menu = a("<ul></ul>").addClass("ui-autocomplete").appendTo(a(this.options.appendTo || "body", c)[0]).mousedown(function (f) {
            var j = b.menu.element[0];
            a(f.target).closest(".ui-menu-item").length || setTimeout(function () {
                a(document).one("mousedown", function (g) {
                    g.target !== b.element[0] && g.target !== j && !a.ui.contains(j, g.target) && b.close()
                })
            }, 1);
            setTimeout(function () {
                clearTimeout(b.closing)
            }, 13)
        }).menu({focus:function (f, j) {
                    var g = j.item.data("item.autocomplete");
                    false !== b._trigger("focus", f, {item:g}) && /^key/.test(f.originalEvent.type) &&
                    b.element.val(g.value)
                }, selected:function (f, j) {
                    var g = j.item.data("item.autocomplete"), k = b.previous;
                    if (b.element[0] !== c.activeElement) {
                        b.element.focus();
                        b.previous = k;
                        setTimeout(function () {
                            b.previous = k;
                            b.selectedItem = g
                        }, 1)
                    }
                    false !== b._trigger("select", f, {item:g}) && b.element.val(g.value);
                    b.term = b.element.val();
                    b.close(f);
                    b.selectedItem = g
                }, blur:function () {
                    b.menu.element.is(":visible") && b.element.val() !== b.term && b.element.val(b.term)
                }}).zIndex(this.element.zIndex() + 3).css({top:0, left:0}).hide().data("menu");
        a.fn.bgiframe && this.menu.element.bgiframe()
    }, destroy:function () {
        this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
        this.menu.element.remove();
        a.Widget.prototype.destroy.call(this)
    }, _setOption:function (b, c) {
        a.Widget.prototype._setOption.apply(this, arguments);
        b === "source" && this._initSource();
        if (b === "appendTo")this.menu.element.appendTo(a(c || "body", this.element[0].ownerDocument)[0]);
        b === "disabled" &&
                c && this.xhr && this.xhr.abort()
    }, _initSource:function () {
        var b = this, c, e;
        if (a.isArray(this.options.source)) {
            c = this.options.source;
            this.source = function (f, j) {
                j(a.ui.autocomplete.filter(c, f.term))
            }
        } else if (typeof this.options.source === "string") {
            e = this.options.source;
            this.source = function (f, j) {
                b.xhr && b.xhr.abort();
                b.xhr = a.ajax({url:e, data:f, dataType:"json", autocompleteRequest:++d, success:function (g) {
                    this.autocompleteRequest === d && j(g)
                }, error:function () {
                    this.autocompleteRequest === d && j([])
                }})
            }
        } else this.source =
                this.options.source
    }, search:function (b, c) {
        b = b != null ? b : this.element.val();
        this.term = this.element.val();
        if (b.length < this.options.minLength)return this.close(c);
        clearTimeout(this.closing);
        if (this._trigger("search", c) !== false)return this._search(b)
    }, _search:function (b) {
        this.pending++;
        this.element.addClass("ui-autocomplete-loading");
        this.source({term:b}, this.response)
    }, _response:function (b) {
        if (!this.options.disabled && b && b.length) {
            b = this._normalize(b);
            this._suggest(b);
            this._trigger("open")
        } else this.close();
        this.pending--;
        this.pending || this.element.removeClass("ui-autocomplete-loading")
    }, close:function (b) {
        clearTimeout(this.closing);
        if (this.menu.element.is(":visible")) {
            this.menu.element.hide();
            this.menu.deactivate();
            this._trigger("close", b)
        }
    }, _change:function (b) {
        this.previous !== this.element.val() && this._trigger("change", b, {item:this.selectedItem})
    }, _normalize:function (b) {
        if (b.length && b[0].label && b[0].value)return b;
        return a.map(b, function (c) {
            if (typeof c === "string")return{label:c, value:c};
            return a.extend({label:c.label ||
                    c.value, value:c.value || c.label}, c)
        })
    }, _suggest:function (b) {
        var c = this.menu.element.empty().zIndex(this.element.zIndex() + 1E3);
        this._renderMenu(c, b);
        this.menu.deactivate();
        this.menu.refresh();
        c.show();
        this._resizeMenu();
        c.position(a.extend({of:this.element}, this.options.position));
        this.options.autoFocus && this.menu.next(new a.Event("mouseover"))
    }, _resizeMenu:function () {
        var b = this.menu.element;
        b.outerWidth(Math.min(b.width("").outerWidth(), this.element.outerWidth()))
    }, _renderMenu:function (b, c) {
        var e =
                this;
        a.each(c, function (f, j) {
            e._renderItem(b, j)
        })
    }, _renderItem:function (b, c) {
        return a("<li></li>").data("item.autocomplete", c).append(a("<a></a>").text(c.label)).appendTo(b)
    }, _move:function (b, c) {
        if (this.menu.element.is(":visible"))if (this.menu.first() && /^previous/.test(b) || this.menu.last() && /^next/.test(b)) {
            this.element.val(this.term);
            this.menu.deactivate()
        } else this.menu[b](c); else this.search(null, c)
    }, widget:function () {
        return this.menu.element
    }});
    a.extend(a.ui.autocomplete, {escapeRegex:function (b) {
        return b.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,
                "\\$&")
    }, filter:function (b, c) {
        var e = RegExp(a.ui.autocomplete.escapeRegex(c), "i");
        return a.grep(b, function (f) {
            return e.test(f.label || f.value || f)
        })
    }})
})(jQuery);
(function (a) {
    a.widget("ui.menu", {_create:function () {
        var d = this;
        this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox", "aria-activedescendant":"ui-active-menuitem"}).click(function (b) {
            if (a(b.target).closest(".ui-menu-item a").length) {
                b.preventDefault();
                d.select(b)
            }
        });
        this.refresh()
    }, refresh:function () {
        var d = this;
        this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem").children("a").addClass("ui-corner-all").attr("tabindex",
                -1).mouseenter(function (b) {
                    d.activate(b, a(this).parent())
                }).mouseleave(function () {
                    d.deactivate()
                })
    }, activate:function (d, b) {
        this.deactivate();
        if (this.hasScroll()) {
            var c = b.offset().top - this.element.offset().top, e = this.element.scrollTop(), f = this.element.height();
            if (c < 0)this.element.scrollTop(e + c); else c >= f && this.element.scrollTop(e + c - f + b.height())
        }
        this.active = b.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end();
        this._trigger("focus", d, {item:b})
    }, deactivate:function () {
        if (this.active) {
            this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
            this._trigger("blur");
            this.active = null
        }
    }, next:function (d) {
        this.move("next", ".ui-menu-item:first", d)
    }, previous:function (d) {
        this.move("prev", ".ui-menu-item:last", d)
    }, first:function () {
        return this.active && !this.active.prevAll(".ui-menu-item").length
    }, last:function () {
        return this.active && !this.active.nextAll(".ui-menu-item").length
    }, move:function (d, b, c) {
        if (this.active) {
            d = this.active[d + "All"](".ui-menu-item").eq(0);
            d.length ? this.activate(c, d) : this.activate(c, this.element.children(b))
        } else this.activate(c,
                this.element.children(b))
    }, nextPage:function (d) {
        if (this.hasScroll())if (!this.active || this.last())this.activate(d, this.element.children(".ui-menu-item:first")); else {
            var b = this.active.offset().top, c = this.element.height(), e = this.element.children(".ui-menu-item").filter(function () {
                var f = a(this).offset().top - b - c + a(this).height();
                return f < 10 && f > -10
            });
            e.length || (e = this.element.children(".ui-menu-item:last"));
            this.activate(d, e)
        } else this.activate(d, this.element.children(".ui-menu-item").filter(!this.active ||
                this.last() ? ":first" : ":last"))
    }, previousPage:function (d) {
        if (this.hasScroll())if (!this.active || this.first())this.activate(d, this.element.children(".ui-menu-item:last")); else {
            var b = this.active.offset().top, c = this.element.height();
            result = this.element.children(".ui-menu-item").filter(function () {
                var e = a(this).offset().top - b + c - a(this).height();
                return e < 10 && e > -10
            });
            result.length || (result = this.element.children(".ui-menu-item:first"));
            this.activate(d, result)
        } else this.activate(d, this.element.children(".ui-menu-item").filter(!this.active ||
                this.first() ? ":last" : ":first"))
    }, hasScroll:function () {
        return this.element.height() < this.element[a.fn.prop ? "prop" : "attr"]("scrollHeight")
    }, select:function (d) {
        this._trigger("selected", d, {item:this.active})
    }})
})(jQuery);
(function (a) {
    a.widget("ui.slider", a.ui.mouse, {widgetEventPrefix:"slide", options:{animate:false, distance:0, max:100, min:0, orientation:"horizontal", range:false, step:1, value:0, values:null}, _create:function () {
        var d = this, b = this.options, c = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"), e = b.values && b.values.length || 1, f = [];
        this._mouseSliding = this._keySliding = false;
        this._animateOff = true;
        this._handleIndex = null;
        this._detectOrientation();
        this._mouseInit();
        this.element.addClass("ui-slider ui-slider-" +
                this.orientation + " ui-widget ui-widget-content ui-corner-all" + (b.disabled ? " ui-slider-disabled ui-disabled" : ""));
        this.range = a([]);
        if (b.range) {
            if (b.range === true) {
                if (!b.values)b.values = [this._valueMin(), this._valueMin()];
                if (b.values.length && b.values.length !== 2)b.values = [b.values[0], b.values[0]]
            }
            this.range = a("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header" + (b.range === "min" || b.range === "max" ? " ui-slider-range-" + b.range : ""))
        }
        for (var j = c.length; j < e; j += 1)f.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
        this.handles = c.add(a(f.join("")).appendTo(d.element));
        this.handle = this.handles.eq(0);
        this.handles.add(this.range).filter("a").click(function (g) {
            g.preventDefault()
        }).hover(function () {
                    b.disabled || a(this).addClass("ui-state-hover")
                },function () {
                    a(this).removeClass("ui-state-hover")
                }).focus(function () {
                    if (b.disabled)a(this).blur(); else {
                        a(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
                        a(this).addClass("ui-state-focus")
                    }
                }).blur(function () {
                    a(this).removeClass("ui-state-focus")
                });
        this.handles.each(function (g) {
            a(this).data("index.ui-slider-handle",
                    g)
        });
        this.handles.keydown(function (g) {
            var k = true, o = a(this).data("index.ui-slider-handle"), s, q, r;
            if (!d.options.disabled) {
                switch (g.keyCode) {
                    case a.ui.keyCode.HOME:
                    case a.ui.keyCode.END:
                    case a.ui.keyCode.PAGE_UP:
                    case a.ui.keyCode.PAGE_DOWN:
                    case a.ui.keyCode.UP:
                    case a.ui.keyCode.RIGHT:
                    case a.ui.keyCode.DOWN:
                    case a.ui.keyCode.LEFT:
                        k = false;
                        if (!d._keySliding) {
                            d._keySliding = true;
                            a(this).addClass("ui-state-active");
                            s = d._start(g, o);
                            if (s === false)return
                        }
                        break
                }
                r = d.options.step;
                s = d.options.values && d.options.values.length ?
                        q = d.values(o) : q = d.value();
                switch (g.keyCode) {
                    case a.ui.keyCode.HOME:
                        q = d._valueMin();
                        break;
                    case a.ui.keyCode.END:
                        q = d._valueMax();
                        break;
                    case a.ui.keyCode.PAGE_UP:
                        q = d._trimAlignValue(s + (d._valueMax() - d._valueMin()) / 5);
                        break;
                    case a.ui.keyCode.PAGE_DOWN:
                        q = d._trimAlignValue(s - (d._valueMax() - d._valueMin()) / 5);
                        break;
                    case a.ui.keyCode.UP:
                    case a.ui.keyCode.RIGHT:
                        if (s === d._valueMax())return;
                        q = d._trimAlignValue(s + r);
                        break;
                    case a.ui.keyCode.DOWN:
                    case a.ui.keyCode.LEFT:
                        if (s === d._valueMin())return;
                        q = d._trimAlignValue(s -
                                r);
                        break
                }
                d._slide(g, o, q);
                return k
            }
        }).keyup(function (g) {
                    var k = a(this).data("index.ui-slider-handle");
                    if (d._keySliding) {
                        d._keySliding = false;
                        d._stop(g, k);
                        d._change(g, k);
                        a(this).removeClass("ui-state-active")
                    }
                });
        this._refreshValue();
        this._animateOff = false
    }, destroy:function () {
        this.handles.remove();
        this.range.remove();
        this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
        this._mouseDestroy();
        return this
    }, _mouseCapture:function (d) {
        var b = this.options, c, e, f, j, g;
        if (b.disabled)return false;
        this.elementSize = {width:this.element.outerWidth(), height:this.element.outerHeight()};
        this.elementOffset = this.element.offset();
        c = this._normValueFromMouse({x:d.pageX, y:d.pageY});
        e = this._valueMax() - this._valueMin() + 1;
        j = this;
        this.handles.each(function (k) {
            var o = Math.abs(c - j.values(k));
            if (e > o) {
                e = o;
                f = a(this);
                g = k
            }
        });
        if (b.range === true && this.values(1) === b.min) {
            g += 1;
            f = a(this.handles[g])
        }
        if (this._start(d, g) === false)return false;
        this._mouseSliding = true;
        j._handleIndex = g;
        f.addClass("ui-state-active").focus();
        b = f.offset();
        this._clickOffset = !a(d.target).parents().andSelf().is(".ui-slider-handle") ? {left:0, top:0} : {left:d.pageX - b.left - f.width() / 2, top:d.pageY - b.top - f.height() / 2 - (parseInt(f.css("borderTopWidth"), 10) || 0) - (parseInt(f.css("borderBottomWidth"), 10) || 0) + (parseInt(f.css("marginTop"), 10) || 0)};
        this.handles.hasClass("ui-state-hover") || this._slide(d, g, c);
        return this._animateOff = true
    }, _mouseStart:function () {
        return true
    }, _mouseDrag:function (d) {
        var b =
                this._normValueFromMouse({x:d.pageX, y:d.pageY});
        this._slide(d, this._handleIndex, b);
        return false
    }, _mouseStop:function (d) {
        this.handles.removeClass("ui-state-active");
        this._mouseSliding = false;
        this._stop(d, this._handleIndex);
        this._change(d, this._handleIndex);
        this._clickOffset = this._handleIndex = null;
        return this._animateOff = false
    }, _detectOrientation:function () {
        this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal"
    }, _normValueFromMouse:function (d) {
        var b;
        if (this.orientation === "horizontal") {
            b =
                    this.elementSize.width;
            d = d.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)
        } else {
            b = this.elementSize.height;
            d = d.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)
        }
        b = d / b;
        if (b > 1)b = 1;
        if (b < 0)b = 0;
        if (this.orientation === "vertical")b = 1 - b;
        d = this._valueMax() - this._valueMin();
        return this._trimAlignValue(this._valueMin() + b * d)
    }, _start:function (d, b) {
        var c = {handle:this.handles[b], value:this.value()};
        if (this.options.values && this.options.values.length) {
            c.value = this.values(b);
            c.values = this.values()
        }
        return this._trigger("start", d, c)
    }, _slide:function (d, b, c) {
        var e;
        if (this.options.values && this.options.values.length) {
            e = this.values(b ? 0 : 1);
            if (this.options.values.length === 2 && this.options.range === true && (b === 0 && c > e || b === 1 && c < e))c = e;
            if (c !== this.values(b)) {
                e = this.values();
                e[b] = c;
                d = this._trigger("slide", d, {handle:this.handles[b], value:c, values:e});
                this.values(b ? 0 : 1);
                d !== false && this.values(b, c, true)
            }
        } else if (c !== this.value()) {
            d = this._trigger("slide", d, {handle:this.handles[b], value:c});
            d !== false && this.value(c)
        }
    }, _stop:function (d, b) {
        var c = {handle:this.handles[b], value:this.value()};
        if (this.options.values && this.options.values.length) {
            c.value = this.values(b);
            c.values = this.values()
        }
        this._trigger("stop", d, c)
    }, _change:function (d, b) {
        if (!this._keySliding && !this._mouseSliding) {
            var c = {handle:this.handles[b], value:this.value()};
            if (this.options.values && this.options.values.length) {
                c.value = this.values(b);
                c.values = this.values()
            }
            this._trigger("change", d, c)
        }
    }, value:function (d) {
        if (arguments.length) {
            this.options.value =
                    this._trimAlignValue(d);
            this._refreshValue();
            this._change(null, 0)
        } else return this._value()
    }, values:function (d, b) {
        var c, e, f;
        if (arguments.length > 1) {
            this.options.values[d] = this._trimAlignValue(b);
            this._refreshValue();
            this._change(null, d)
        } else if (arguments.length)if (a.isArray(arguments[0])) {
            c = this.options.values;
            e = arguments[0];
            for (f = 0; f < c.length; f += 1) {
                c[f] = this._trimAlignValue(e[f]);
                this._change(null, f)
            }
            this._refreshValue()
        } else return this.options.values && this.options.values.length ? this._values(d) :
                this.value(); else return this._values()
    }, _setOption:function (d, b) {
        var c, e = 0;
        if (a.isArray(this.options.values))e = this.options.values.length;
        a.Widget.prototype._setOption.apply(this, arguments);
        switch (d) {
            case "disabled":
                if (b) {
                    this.handles.filter(".ui-state-focus").blur();
                    this.handles.removeClass("ui-state-hover");
                    this.handles.propAttr("disabled", true);
                    this.element.addClass("ui-disabled")
                } else {
                    this.handles.propAttr("disabled", false);
                    this.element.removeClass("ui-disabled")
                }
                break;
            case "orientation":
                this._detectOrientation();
                this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                this._refreshValue();
                break;
            case "value":
                this._animateOff = true;
                this._refreshValue();
                this._change(null, 0);
                this._animateOff = false;
                break;
            case "values":
                this._animateOff = true;
                this._refreshValue();
                for (c = 0; c < e; c += 1)this._change(null, c);
                this._animateOff = false;
                break
        }
    }, _value:function () {
        var d = this.options.value;
        return d = this._trimAlignValue(d)
    }, _values:function (d) {
        var b, c;
        if (arguments.length) {
            b = this.options.values[d];
            return b = this._trimAlignValue(b)
        } else {
            b = this.options.values.slice();
            for (c = 0; c < b.length; c += 1)b[c] = this._trimAlignValue(b[c]);
            return b
        }
    }, _trimAlignValue:function (d) {
        if (d <= this._valueMin())return this._valueMin();
        if (d >= this._valueMax())return this._valueMax();
        var b = this.options.step > 0 ? this.options.step : 1, c = (d - this._valueMin()) % b;
        d = d - c;
        if (Math.abs(c) * 2 >= b)d += c > 0 ? b : -b;
        return parseFloat(d.toFixed(5))
    }, _valueMin:function () {
        return this.options.min
    }, _valueMax:function () {
        return this.options.max
    }, _refreshValue:function () {
        var d =
                this.options.range, b = this.options, c = this, e = !this._animateOff ? b.animate : false, f, j = {}, g, k, o, s;
        if (this.options.values && this.options.values.length)this.handles.each(function (q) {
            f = (c.values(q) - c._valueMin()) / (c._valueMax() - c._valueMin()) * 100;
            j[c.orientation === "horizontal" ? "left" : "bottom"] = f + "%";
            a(this).stop(1, 1)[e ? "animate" : "css"](j, b.animate);
            if (c.options.range === true)if (c.orientation === "horizontal") {
                if (q === 0)c.range.stop(1, 1)[e ? "animate" : "css"]({left:f + "%"}, b.animate);
                if (q === 1)c.range[e ? "animate" : "css"]({width:f -
                        g + "%"}, {queue:false, duration:b.animate})
            } else {
                if (q === 0)c.range.stop(1, 1)[e ? "animate" : "css"]({bottom:f + "%"}, b.animate);
                if (q === 1)c.range[e ? "animate" : "css"]({height:f - g + "%"}, {queue:false, duration:b.animate})
            }
            g = f
        }); else {
            k = this.value();
            o = this._valueMin();
            s = this._valueMax();
            f = s !== o ? (k - o) / (s - o) * 100 : 0;
            j[c.orientation === "horizontal" ? "left" : "bottom"] = f + "%";
            this.handle.stop(1, 1)[e ? "animate" : "css"](j, b.animate);
            if (d === "min" && this.orientation === "horizontal")this.range.stop(1, 1)[e ? "animate" : "css"]({width:f + "%"},
                    b.animate);
            if (d === "max" && this.orientation === "horizontal")this.range[e ? "animate" : "css"]({width:100 - f + "%"}, {queue:false, duration:b.animate});
            if (d === "min" && this.orientation === "vertical")this.range.stop(1, 1)[e ? "animate" : "css"]({height:f + "%"}, b.animate);
            if (d === "max" && this.orientation === "vertical")this.range[e ? "animate" : "css"]({height:100 - f + "%"}, {queue:false, duration:b.animate})
        }
    }});
    a.extend(a.ui.slider, {version:"1.8.16"})
})(jQuery);
(function (a, d) {
    function b() {
        this.debug = false;
        this._curInst = null;
        this._keyEvent = false;
        this._disabledInputs = [];
        this._inDialog = this._datepickerShowing = false;
        this._mainDivId = "ui-datepicker-div";
        this._inlineClass = "ui-datepicker-inline";
        this._appendClass = "ui-datepicker-append";
        this._triggerClass = "ui-datepicker-trigger";
        this._dialogClass = "ui-datepicker-dialog";
        this._disableClass = "ui-datepicker-disabled";
        this._unselectableClass = "ui-datepicker-unselectable";
        this._currentClass = "ui-datepicker-current-day";
        this._dayOverClass =
                "ui-datepicker-days-cell-over";
        this.regional = [];
        this.regional[""] = {closeText:"Done", prevText:"Prev", nextText:"Next", currentText:"Today", monthNames:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], monthNamesShort:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], dayNames:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], dayNamesShort:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], dayNamesMin:["Su",
            "Mo", "Tu", "We", "Th", "Fr", "Sa"], weekHeader:"Wk", dateFormat:"mm/dd/yy", firstDay:0, isRTL:false, showMonthAfterYear:false, yearSuffix:""};
        this._defaults = {showOn:"focus", showAnim:"fadeIn", showOptions:{}, defaultDate:null, appendText:"", buttonText:"...", buttonImage:"", buttonImageOnly:false, hideIfNoPrevNext:false, navigationAsDateFormat:false, gotoCurrent:false, changeMonth:false, changeYear:false, yearRange:"c-10:c+10", showOtherMonths:false, selectOtherMonths:false, showWeek:false, calculateWeek:this.iso8601Week, shortYearCutoff:"+10",
            minDate:null, maxDate:null, duration:"fast", beforeShowDay:null, beforeShow:null, onSelect:null, onChangeMonthYear:null, onClose:null, numberOfMonths:1, showCurrentAtPos:0, stepMonths:1, stepBigMonths:12, altField:"", altFormat:"", constrainInput:true, showButtonPanel:false, autoSize:false, disabled:false};
        a.extend(this._defaults, this.regional[""]);
        this.dpDiv = c(a('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))
    }

    function c(g) {
        return g.bind("mouseout",
                function (k) {
                    k = a(k.target).closest("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a");
                    k.length && k.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")
                }).bind("mouseover", function (k) {
                    k = a(k.target).closest("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a");
                    if (!(a.datepicker._isDisabledDatepicker(j.inline ? g.parent()[0] : j.input[0]) || !k.length)) {
                        k.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
                        k.addClass("ui-state-hover");
                        k.hasClass("ui-datepicker-prev") && k.addClass("ui-datepicker-prev-hover");
                        k.hasClass("ui-datepicker-next") && k.addClass("ui-datepicker-next-hover")
                    }
                })
    }

    function e(g, k) {
        a.extend(g, k);
        for (var o in k)if (k[o] == null || k[o] == d)g[o] = k[o];
        return g
    }

    a.extend(a.ui, {datepicker:{version:"1.8.16"}});
    var f = (new Date).getTime(), j;
    a.extend(b.prototype, {markerClassName:"hasDatepicker", maxRows:4, log:function () {
        this.debug && console.log.apply("", arguments)
    }, _widgetDatepicker:function () {
        return this.dpDiv
    },
        setDefaults:function (g) {
            e(this._defaults, g || {});
            return this
        }, _attachDatepicker:function (g, k) {
            var o = null;
            for (var s in this._defaults) {
                var q = g.getAttribute("date:" + s);
                if (q) {
                    o = o || {};
                    try {
                        o[s] = eval(q)
                    } catch (r) {
                        o[s] = q
                    }
                }
            }
            s = g.nodeName.toLowerCase();
            q = s == "div" || s == "span";
            if (!g.id) {
                this.uuid += 1;
                g.id = "dp" + this.uuid
            }
            var v = this._newInst(a(g), q);
            v.settings = a.extend({}, k || {}, o || {});
            if (s == "input")this._connectDatepicker(g, v); else q && this._inlineDatepicker(g, v)
        }, _newInst:function (g, k) {
            return{id:g[0].id.replace(/([^A-Za-z0-9_-])/g,
                    "\\\\$1"), input:g, selectedDay:0, selectedMonth:0, selectedYear:0, drawMonth:0, drawYear:0, inline:k, dpDiv:!k ? this.dpDiv : c(a('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}
        }, _connectDatepicker:function (g, k) {
            var o = a(g);
            k.append = a([]);
            k.trigger = a([]);
            if (!o.hasClass(this.markerClassName)) {
                this._attachments(o, k);
                o.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",
                        function (s, q, r) {
                            k.settings[q] = r
                        }).bind("getData.datepicker", function (s, q) {
                            return this._get(k, q)
                        });
                this._autoSize(k);
                a.data(g, "datepicker", k);
                k.settings.disabled && this._disableDatepicker(g)
            }
        }, _attachments:function (g, k) {
            var o = this._get(k, "appendText"), s = this._get(k, "isRTL");
            k.append && k.append.remove();
            if (o) {
                k.append = a('<span class="' + this._appendClass + '">' + o + "</span>");
                g[s ? "before" : "after"](k.append)
            }
            g.unbind("focus", this._showDatepicker);
            k.trigger && k.trigger.remove();
            o = this._get(k, "showOn");
            if (o ==
                    "focus" || o == "both")g.focus(this._showDatepicker);
            if (o == "button" || o == "both") {
                o = this._get(k, "buttonText");
                var q = this._get(k, "buttonImage");
                k.trigger = a(this._get(k, "buttonImageOnly") ? a("<img/>").addClass(this._triggerClass).attr({src:q, alt:o, title:o}) : a('<button type="button"></button>').addClass(this._triggerClass).html(q == "" ? o : a("<img/>").attr({src:q, alt:o, title:o})));
                g[s ? "before" : "after"](k.trigger);
                k.trigger.click(function () {
                    a.datepicker._datepickerShowing && a.datepicker._lastInput == g[0] ? a.datepicker._hideDatepicker() :
                            a.datepicker._showDatepicker(g[0]);
                    return false
                })
            }
        }, _autoSize:function (g) {
            if (this._get(g, "autoSize") && !g.inline) {
                var k = new Date(2009, 11, 20), o = this._get(g, "dateFormat");
                if (o.match(/[DM]/)) {
                    var s = function (q) {
                        for (var r = 0, v = 0, t = 0; t < q.length; t++)if (q[t].length > r) {
                            r = q[t].length;
                            v = t
                        }
                        return v
                    };
                    k.setMonth(s(this._get(g, o.match(/MM/) ? "monthNames" : "monthNamesShort")));
                    k.setDate(s(this._get(g, o.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - k.getDay())
                }
                g.input.attr("size", this._formatDate(g, k).length)
            }
        }, _inlineDatepicker:function (g, k) {
            var o = a(g);
            if (!o.hasClass(this.markerClassName)) {
                o.addClass(this.markerClassName).append(k.dpDiv).bind("setData.datepicker",function (s, q, r) {
                    k.settings[q] = r
                }).bind("getData.datepicker", function (s, q) {
                            return this._get(k, q)
                        });
                a.data(g, "datepicker", k);
                this._setDate(k, this._getDefaultDate(k), true);
                this._updateDatepicker(k);
                this._updateAlternate(k);
                k.settings.disabled && this._disableDatepicker(g);
                k.dpDiv.css("display", "block")
            }
        }, _dialogDatepicker:function (g, k, o, s, q) {
            g = this._dialogInst;
            if (!g) {
                this.uuid +=
                        1;
                this._dialogInput = a('<input type="text" id="' + ("dp" + this.uuid) + '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
                this._dialogInput.keydown(this._doKeyDown);
                a("body").append(this._dialogInput);
                g = this._dialogInst = this._newInst(this._dialogInput, false);
                g.settings = {};
                a.data(this._dialogInput[0], "datepicker", g)
            }
            e(g.settings, s || {});
            k = k && k.constructor == Date ? this._formatDate(g, k) : k;
            this._dialogInput.val(k);
            this._pos = q ? q.length ? q : [q.pageX, q.pageY] : null;
            if (!this._pos)this._pos = [document.documentElement.clientWidth /
                    2 - 100 + (document.documentElement.scrollLeft || document.body.scrollLeft), document.documentElement.clientHeight / 2 - 150 + (document.documentElement.scrollTop || document.body.scrollTop)];
            this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px");
            g.settings.onSelect = o;
            this._inDialog = true;
            this.dpDiv.addClass(this._dialogClass);
            this._showDatepicker(this._dialogInput[0]);
            a.blockUI && a.blockUI(this.dpDiv);
            a.data(this._dialogInput[0], "datepicker", g);
            return this
        }, _destroyDatepicker:function (g) {
            var k =
                    a(g), o = a.data(g, "datepicker");
            if (k.hasClass(this.markerClassName)) {
                var s = g.nodeName.toLowerCase();
                a.removeData(g, "datepicker");
                if (s == "input") {
                    o.append.remove();
                    o.trigger.remove();
                    k.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)
                } else if (s == "div" || s == "span")k.removeClass(this.markerClassName).empty()
            }
        }, _enableDatepicker:function (g) {
            var k = a(g), o = a.data(g, "datepicker");
            if (k.hasClass(this.markerClassName)) {
                var s =
                        g.nodeName.toLowerCase();
                if (s == "input") {
                    g.disabled = false;
                    o.trigger.filter("button").each(function () {
                        this.disabled = false
                    }).end().filter("img").css({opacity:"1.0", cursor:""})
                } else if (s == "div" || s == "span") {
                    k = k.children("." + this._inlineClass);
                    k.children().removeClass("ui-state-disabled");
                    k.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")
                }
                this._disabledInputs = a.map(this._disabledInputs, function (q) {
                    return q == g ? null : q
                })
            }
        }, _disableDatepicker:function (g) {
            var k = a(g), o = a.data(g,
                    "datepicker");
            if (k.hasClass(this.markerClassName)) {
                var s = g.nodeName.toLowerCase();
                if (s == "input") {
                    g.disabled = true;
                    o.trigger.filter("button").each(function () {
                        this.disabled = true
                    }).end().filter("img").css({opacity:"0.5", cursor:"default"})
                } else if (s == "div" || s == "span") {
                    k = k.children("." + this._inlineClass);
                    k.children().addClass("ui-state-disabled");
                    k.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled", "disabled")
                }
                this._disabledInputs = a.map(this._disabledInputs, function (q) {
                    return q ==
                            g ? null : q
                });
                this._disabledInputs[this._disabledInputs.length] = g
            }
        }, _isDisabledDatepicker:function (g) {
            if (!g)return false;
            for (var k = 0; k < this._disabledInputs.length; k++)if (this._disabledInputs[k] == g)return true;
            return false
        }, _getInst:function (g) {
            try {
                return a.data(g, "datepicker")
            } catch (k) {
                throw"Missing instance data for this datepicker";
            }
        }, _optionDatepicker:function (g, k, o) {
            var s = this._getInst(g);
            if (arguments.length == 2 && typeof k == "string")return k == "defaults" ? a.extend({}, a.datepicker._defaults) : s ? k == "all" ?
                    a.extend({}, s.settings) : this._get(s, k) : null;
            var q = k || {};
            if (typeof k == "string") {
                q = {};
                q[k] = o
            }
            if (s) {
                this._curInst == s && this._hideDatepicker();
                var r = this._getDateDatepicker(g, true), v = this._getMinMaxDate(s, "min"), t = this._getMinMaxDate(s, "max");
                e(s.settings, q);
                if (v !== null && q.dateFormat !== d && q.minDate === d)s.settings.minDate = this._formatDate(s, v);
                if (t !== null && q.dateFormat !== d && q.maxDate === d)s.settings.maxDate = this._formatDate(s, t);
                this._attachments(a(g), s);
                this._autoSize(s);
                this._setDate(s, r);
                this._updateAlternate(s);
                this._updateDatepicker(s)
            }
        }, _changeDatepicker:function (g, k, o) {
            this._optionDatepicker(g, k, o)
        }, _refreshDatepicker:function (g) {
            (g = this._getInst(g)) && this._updateDatepicker(g)
        }, _setDateDatepicker:function (g, k) {
            var o = this._getInst(g);
            if (o) {
                this._setDate(o, k);
                this._updateDatepicker(o);
                this._updateAlternate(o)
            }
        }, _getDateDatepicker:function (g, k) {
            var o = this._getInst(g);
            o && !o.inline && this._setDateFromField(o, k);
            return o ? this._getDate(o) : null
        }, _doKeyDown:function (g) {
            var k = a.datepicker._getInst(g.target), o = true,
                    s = k.dpDiv.is(".ui-datepicker-rtl");
            k._keyEvent = true;
            if (a.datepicker._datepickerShowing)switch (g.keyCode) {
                case 9:
                    a.datepicker._hideDatepicker();
                    o = false;
                    break;
                case 13:
                    o = a("td." + a.datepicker._dayOverClass + ":not(." + a.datepicker._currentClass + ")", k.dpDiv);
                    o[0] && a.datepicker._selectDay(g.target, k.selectedMonth, k.selectedYear, o[0]);
                    if (g = a.datepicker._get(k, "onSelect")) {
                        o = a.datepicker._formatDate(k);
                        g.apply(k.input ? k.input[0] : null, [o, k])
                    } else a.datepicker._hideDatepicker();
                    return false;
                case 27:
                    a.datepicker._hideDatepicker();
                    break;
                case 33:
                    a.datepicker._adjustDate(g.target, g.ctrlKey ? -a.datepicker._get(k, "stepBigMonths") : -a.datepicker._get(k, "stepMonths"), "M");
                    break;
                case 34:
                    a.datepicker._adjustDate(g.target, g.ctrlKey ? +a.datepicker._get(k, "stepBigMonths") : +a.datepicker._get(k, "stepMonths"), "M");
                    break;
                case 35:
                    if (g.ctrlKey || g.metaKey)a.datepicker._clearDate(g.target);
                    o = g.ctrlKey || g.metaKey;
                    break;
                case 36:
                    if (g.ctrlKey || g.metaKey)a.datepicker._gotoToday(g.target);
                    o = g.ctrlKey || g.metaKey;
                    break;
                case 37:
                    if (g.ctrlKey || g.metaKey)a.datepicker._adjustDate(g.target,
                            s ? +1 : -1, "D");
                    o = g.ctrlKey || g.metaKey;
                    if (g.originalEvent.altKey)a.datepicker._adjustDate(g.target, g.ctrlKey ? -a.datepicker._get(k, "stepBigMonths") : -a.datepicker._get(k, "stepMonths"), "M");
                    break;
                case 38:
                    if (g.ctrlKey || g.metaKey)a.datepicker._adjustDate(g.target, -7, "D");
                    o = g.ctrlKey || g.metaKey;
                    break;
                case 39:
                    if (g.ctrlKey || g.metaKey)a.datepicker._adjustDate(g.target, s ? -1 : +1, "D");
                    o = g.ctrlKey || g.metaKey;
                    if (g.originalEvent.altKey)a.datepicker._adjustDate(g.target, g.ctrlKey ? +a.datepicker._get(k, "stepBigMonths") :
                            +a.datepicker._get(k, "stepMonths"), "M");
                    break;
                case 40:
                    if (g.ctrlKey || g.metaKey)a.datepicker._adjustDate(g.target, +7, "D");
                    o = g.ctrlKey || g.metaKey;
                    break;
                default:
                    o = false
            } else if (g.keyCode == 36 && g.ctrlKey)a.datepicker._showDatepicker(this); else o = false;
            if (o) {
                g.preventDefault();
                g.stopPropagation()
            }
        }, _doKeyPress:function (g) {
            var k = a.datepicker._getInst(g.target);
            if (a.datepicker._get(k, "constrainInput")) {
                k = a.datepicker._possibleChars(a.datepicker._get(k, "dateFormat"));
                var o = String.fromCharCode(g.charCode == d ?
                        g.keyCode : g.charCode);
                return g.ctrlKey || g.metaKey || o < " " || !k || k.indexOf(o) > -1
            }
        }, _doKeyUp:function (g) {
            g = a.datepicker._getInst(g.target);
            if (g.input.val() != g.lastVal)try {
                if (a.datepicker.parseDate(a.datepicker._get(g, "dateFormat"), g.input ? g.input.val() : null, a.datepicker._getFormatConfig(g))) {
                    a.datepicker._setDateFromField(g);
                    a.datepicker._updateAlternate(g);
                    a.datepicker._updateDatepicker(g)
                }
            } catch (k) {
                a.datepicker.log(k)
            }
            return true
        }, _showDatepicker:function (g) {
            g = g.target || g;
            if (g.nodeName.toLowerCase() !=
                    "input")g = a("input", g.parentNode)[0];
            if (!(a.datepicker._isDisabledDatepicker(g) || a.datepicker._lastInput == g)) {
                var k = a.datepicker._getInst(g);
                if (a.datepicker._curInst && a.datepicker._curInst != k) {
                    a.datepicker._datepickerShowing && a.datepicker._triggerOnClose(a.datepicker._curInst);
                    a.datepicker._curInst.dpDiv.stop(true, true)
                }
                var o = a.datepicker._get(k, "beforeShow");
                o = o ? o.apply(g, [g, k]) : {};
                if (o !== false) {
                    e(k.settings, o);
                    k.lastVal = null;
                    a.datepicker._lastInput = g;
                    a.datepicker._setDateFromField(k);
                    if (a.datepicker._inDialog)g.value =
                            "";
                    if (!a.datepicker._pos) {
                        a.datepicker._pos = a.datepicker._findPos(g);
                        a.datepicker._pos[1] += g.offsetHeight
                    }
                    var s = false;
                    a(g).parents().each(function () {
                        s |= a(this).css("position") == "fixed";
                        return!s
                    });
                    if (s && a.browser.opera) {
                        a.datepicker._pos[0] -= document.documentElement.scrollLeft;
                        a.datepicker._pos[1] -= document.documentElement.scrollTop
                    }
                    o = {left:a.datepicker._pos[0], top:a.datepicker._pos[1]};
                    a.datepicker._pos = null;
                    k.dpDiv.empty();
                    k.dpDiv.css({position:"absolute", display:"block", top:"-1000px"});
                    a.datepicker._updateDatepicker(k);
                    o = a.datepicker._checkOffset(k, o, s);
                    k.dpDiv.css({position:a.datepicker._inDialog && a.blockUI ? "static" : s ? "fixed" : "absolute", display:"none", left:o.left + "px", top:o.top + "px"});
                    if (!k.inline) {
                        o = a.datepicker._get(k, "showAnim");
                        var q = a.datepicker._get(k, "duration"), r = function () {
                            var v = k.dpDiv.find("iframe.ui-datepicker-cover");
                            if (v.length) {
                                var t = a.datepicker._getBorders(k.dpDiv);
                                v.css({left:-t[0], top:-t[1], width:k.dpDiv.outerWidth(), height:k.dpDiv.outerHeight()})
                            }
                        };
                        k.dpDiv.zIndex(a(g).zIndex() + 1);
                        a.datepicker._datepickerShowing =
                                true;
                        a.effects && a.effects[o] ? k.dpDiv.show(o, a.datepicker._get(k, "showOptions"), q, r) : k.dpDiv[o || "show"](o ? q : null, r);
                        if (!o || !q)r();
                        k.input.is(":visible") && !k.input.is(":disabled") && k.input.focus();
                        a.datepicker._curInst = k
                    }
                }
            }
        }, _updateDatepicker:function (g) {
            this.maxRows = 4;
            var k = a.datepicker._getBorders(g.dpDiv);
            j = g;
            g.dpDiv.empty().append(this._generateHTML(g));
            var o = g.dpDiv.find("iframe.ui-datepicker-cover");
            o.length && o.css({left:-k[0], top:-k[1], width:g.dpDiv.outerWidth(), height:g.dpDiv.outerHeight()});
            g.dpDiv.find("." + this._dayOverClass + " a").mouseover();
            k = this._getNumberOfMonths(g);
            o = k[1];
            g.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
            o > 1 && g.dpDiv.addClass("ui-datepicker-multi-" + o).css("width", 17 * o + "em");
            g.dpDiv[(k[0] != 1 || k[1] != 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi");
            g.dpDiv[(this._get(g, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
            g == a.datepicker._curInst && a.datepicker._datepickerShowing && g.input && g.input.is(":visible") &&
                    !g.input.is(":disabled") && g.input[0] != document.activeElement && g.input.focus();
            if (g.yearshtml) {
                var s = g.yearshtml;
                setTimeout(function () {
                    s === g.yearshtml && g.yearshtml && g.dpDiv.find("select.ui-datepicker-year:first").replaceWith(g.yearshtml);
                    s = g.yearshtml = null
                }, 0)
            }
        }, _getBorders:function (g) {
            var k = function (o) {
                return{thin:1, medium:2, thick:3}[o] || o
            };
            return[parseFloat(k(g.css("border-left-width"))), parseFloat(k(g.css("border-top-width")))]
        }, _checkOffset:function (g, k, o) {
            var s = g.dpDiv.outerWidth(), q = g.dpDiv.outerHeight(),
                    r = g.input ? g.input.outerWidth() : 0, v = g.input ? g.input.outerHeight() : 0, t = document.documentElement.clientWidth + a(document).scrollLeft(), y = document.documentElement.clientHeight + a(document).scrollTop();
            k.left -= this._get(g, "isRTL") ? s - r : 0;
            k.left -= o && k.left == g.input.offset().left ? a(document).scrollLeft() : 0;
            k.top -= o && k.top == g.input.offset().top + v ? a(document).scrollTop() : 0;
            k.left -= Math.min(k.left, k.left + s > t && t > s ? Math.abs(k.left + s - t) : 0);
            k.top -= Math.min(k.top, k.top + q > y && y > q ? Math.abs(q + v) : 0);
            return k
        }, _findPos:function (g) {
            for (var k =
                    this._get(this._getInst(g), "isRTL"); g && (g.type == "hidden" || g.nodeType != 1 || a.expr.filters.hidden(g));)g = g[k ? "previousSibling" : "nextSibling"];
            g = a(g).offset();
            return[g.left, g.top]
        }, _triggerOnClose:function (g) {
            var k = this._get(g, "onClose");
            if (k)k.apply(g.input ? g.input[0] : null, [g.input ? g.input.val() : "", g])
        }, _hideDatepicker:function (g) {
            var k = this._curInst;
            if (!(!k || g && k != a.data(g, "datepicker")))if (this._datepickerShowing) {
                g = this._get(k, "showAnim");
                var o = this._get(k, "duration"), s = function () {
                    a.datepicker._tidyDialog(k);
                    this._curInst = null
                };
                a.effects && a.effects[g] ? k.dpDiv.hide(g, a.datepicker._get(k, "showOptions"), o, s) : k.dpDiv[g == "slideDown" ? "slideUp" : g == "fadeIn" ? "fadeOut" : "hide"](g ? o : null, s);
                g || s();
                a.datepicker._triggerOnClose(k);
                this._datepickerShowing = false;
                this._lastInput = null;
                if (this._inDialog) {
                    this._dialogInput.css({position:"absolute", left:"0", top:"-100px"});
                    if (a.blockUI) {
                        a.unblockUI();
                        a("body").append(this.dpDiv)
                    }
                }
                this._inDialog = false
            }
        }, _tidyDialog:function (g) {
            g.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick:function (g) {
            if (a.datepicker._curInst) {
                g = a(g.target);
                g[0].id != a.datepicker._mainDivId && g.parents("#" + a.datepicker._mainDivId).length == 0 && !g.hasClass(a.datepicker.markerClassName) && !g.hasClass(a.datepicker._triggerClass) && a.datepicker._datepickerShowing && !(a.datepicker._inDialog && a.blockUI) && a.datepicker._hideDatepicker()
            }
        }, _adjustDate:function (g, k, o) {
            g = a(g);
            var s = this._getInst(g[0]);
            if (!this._isDisabledDatepicker(g[0])) {
                this._adjustInstDate(s, k + (o == "M" ? this._get(s, "showCurrentAtPos") :
                        0), o);
                this._updateDatepicker(s)
            }
        }, _gotoToday:function (g) {
            g = a(g);
            var k = this._getInst(g[0]);
            if (this._get(k, "gotoCurrent") && k.currentDay) {
                k.selectedDay = k.currentDay;
                k.drawMonth = k.selectedMonth = k.currentMonth;
                k.drawYear = k.selectedYear = k.currentYear
            } else {
                var o = new Date;
                k.selectedDay = o.getDate();
                k.drawMonth = k.selectedMonth = o.getMonth();
                k.drawYear = k.selectedYear = o.getFullYear()
            }
            this._notifyChange(k);
            this._adjustDate(g)
        }, _selectMonthYear:function (g, k, o) {
            g = a(g);
            var s = this._getInst(g[0]);
            s["selected" + (o == "M" ?
                    "Month" : "Year")] = s["draw" + (o == "M" ? "Month" : "Year")] = parseInt(k.options[k.selectedIndex].value, 10);
            this._notifyChange(s);
            this._adjustDate(g)
        }, _selectDay:function (g, k, o, s) {
            var q = a(g);
            if (!(a(s).hasClass(this._unselectableClass) || this._isDisabledDatepicker(q[0]))) {
                q = this._getInst(q[0]);
                q.selectedDay = q.currentDay = a("a", s).html();
                q.selectedMonth = q.currentMonth = k;
                q.selectedYear = q.currentYear = o;
                this._selectDate(g, this._formatDate(q, q.currentDay, q.currentMonth, q.currentYear))
            }
        }, _clearDate:function (g) {
            g = a(g);
            this._getInst(g[0]);
            this._selectDate(g, "")
        }, _selectDate:function (g, k) {
            var o = this._getInst(a(g)[0]);
            k = k != null ? k : this._formatDate(o);
            o.input && o.input.val(k);
            this._updateAlternate(o);
            var s = this._get(o, "onSelect");
            if (s)s.apply(o.input ? o.input[0] : null, [k, o]); else o.input && o.input.trigger("change");
            if (o.inline)this._updateDatepicker(o); else {
                this._hideDatepicker();
                this._lastInput = o.input[0];
                typeof o.input[0] != "object" && o.input.focus();
                this._lastInput = null
            }
        }, _updateAlternate:function (g) {
            var k = this._get(g,
                    "altField");
            if (k) {
                var o = this._get(g, "altFormat") || this._get(g, "dateFormat"), s = this._getDate(g), q = this.formatDate(o, s, this._getFormatConfig(g));
                a(k).each(function () {
                    a(this).val(q)
                })
            }
        }, noWeekends:function (g) {
            g = g.getDay();
            return[g > 0 && g < 6, ""]
        }, iso8601Week:function (g) {
            g = new Date(g.getTime());
            g.setDate(g.getDate() + 4 - (g.getDay() || 7));
            var k = g.getTime();
            g.setMonth(0);
            g.setDate(1);
            return Math.floor(Math.round((k - g) / 864E5) / 7) + 1
        }, parseDate:function (g, k, o) {
            if (g == null || k == null)throw"Invalid arguments";
            k = typeof k ==
                    "object" ? k.toString() : k + "";
            if (k == "")return null;
            var s = (o ? o.shortYearCutoff : null) || this._defaults.shortYearCutoff;
            s = typeof s != "string" ? s : (new Date).getFullYear() % 100 + parseInt(s, 10);
            for (var q = (o ? o.dayNamesShort : null) || this._defaults.dayNamesShort, r = (o ? o.dayNames : null) || this._defaults.dayNames, v = (o ? o.monthNamesShort : null) || this._defaults.monthNamesShort, t = (o ? o.monthNames : null) || this._defaults.monthNames, y = o = -1, E = -1, G = -1, B = false, N = function (da) {
                (da = Z + 1 < g.length && g.charAt(Z + 1) == da) && Z++;
                return da
            }, ba = function (da) {
                var W =
                        N(da);
                da = RegExp("^\\d{1," + (da == "@" ? 14 : da == "!" ? 20 : da == "y" && W ? 4 : da == "o" ? 3 : 2) + "}");
                da = k.substring(K).match(da);
                if (!da)throw"Missing number at position " + K;
                K += da[0].length;
                return parseInt(da[0], 10)
            }, L = function (da, W, ra) {
                da = a.map(N(da) ? ra : W,function (m, P) {
                    return[
                        [P, m]
                    ]
                }).sort(function (m, P) {
                            return-(m[1].length - P[1].length)
                        });
                var Y = -1;
                a.each(da, function (m, P) {
                    var la = P[1];
                    if (k.substr(K, la.length).toLowerCase() == la.toLowerCase()) {
                        Y = P[0];
                        K += la.length;
                        return false
                    }
                });
                if (Y != -1)return Y + 1; else throw"Unknown name at position " +
                        K;
            }, ja = function () {
                if (k.charAt(K) != g.charAt(Z))throw"Unexpected literal at position " + K;
                K++
            }, K = 0, Z = 0; Z < g.length; Z++)if (B)if (g.charAt(Z) == "'" && !N("'"))B = false; else ja(); else switch (g.charAt(Z)) {
                case "d":
                    E = ba("d");
                    break;
                case "D":
                    L("D", q, r);
                    break;
                case "o":
                    G = ba("o");
                    break;
                case "m":
                    y = ba("m");
                    break;
                case "M":
                    y = L("M", v, t);
                    break;
                case "y":
                    o = ba("y");
                    break;
                case "@":
                    var X = new Date(ba("@"));
                    o = X.getFullYear();
                    y = X.getMonth() + 1;
                    E = X.getDate();
                    break;
                case "!":
                    X = new Date((ba("!") - this._ticksTo1970) / 1E4);
                    o = X.getFullYear();
                    y = X.getMonth() + 1;
                    E = X.getDate();
                    break;
                case "'":
                    if (N("'"))ja(); else B = true;
                    break;
                default:
                    ja()
            }
            if (K < k.length)throw"Extra/unparsed characters found in date: " + k.substring(K);
            if (o == -1)o = (new Date).getFullYear(); else if (o < 100)o += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (o <= s ? 0 : -100);
            if (G > -1) {
                y = 1;
                E = G;
                do {
                    s = this._getDaysInMonth(o, y - 1);
                    if (E <= s)break;
                    y++;
                    E -= s
                } while (1)
            }
            X = this._daylightSavingAdjust(new Date(o, y - 1, E));
            if (X.getFullYear() != o || X.getMonth() + 1 != y || X.getDate() != E)throw"Invalid date";
            return X
        },
        ATOM:"yy-mm-dd", COOKIE:"D, dd M yy", ISO_8601:"yy-mm-dd", RFC_822:"D, d M y", RFC_850:"DD, dd-M-y", RFC_1036:"D, d M y", RFC_1123:"D, d M yy", RFC_2822:"D, d M yy", RSS:"D, d M y", TICKS:"!", TIMESTAMP:"@", W3C:"yy-mm-dd", _ticksTo1970:(718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 24 * 60 * 60 * 1E7, formatDate:function (g, k, o) {
            if (!k)return"";
            var s = (o ? o.dayNamesShort : null) || this._defaults.dayNamesShort, q = (o ? o.dayNames : null) || this._defaults.dayNames, r = (o ? o.monthNamesShort : null) || this._defaults.monthNamesShort;
            o = (o ? o.monthNames : null) || this._defaults.monthNames;
            var v = function (N) {
                (N = B + 1 < g.length && g.charAt(B + 1) == N) && B++;
                return N
            }, t = function (N, ba, L) {
                ba = "" + ba;
                if (v(N))for (; ba.length < L;)ba = "0" + ba;
                return ba
            }, y = function (N, ba, L, ja) {
                return v(N) ? ja[ba] : L[ba]
            }, E = "", G = false;
            if (k)for (var B = 0; B < g.length; B++)if (G)if (g.charAt(B) == "'" && !v("'"))G = false; else E += g.charAt(B); else switch (g.charAt(B)) {
                case "d":
                    E += t("d", k.getDate(), 2);
                    break;
                case "D":
                    E += y("D", k.getDay(), s, q);
                    break;
                case "o":
                    E += t("o", Math.round(((new Date(k.getFullYear(),
                            k.getMonth(), k.getDate())).getTime() - (new Date(k.getFullYear(), 0, 0)).getTime()) / 864E5), 3);
                    break;
                case "m":
                    E += t("m", k.getMonth() + 1, 2);
                    break;
                case "M":
                    E += y("M", k.getMonth(), r, o);
                    break;
                case "y":
                    E += v("y") ? k.getFullYear() : (k.getYear() % 100 < 10 ? "0" : "") + k.getYear() % 100;
                    break;
                case "@":
                    E += k.getTime();
                    break;
                case "!":
                    E += k.getTime() * 1E4 + this._ticksTo1970;
                    break;
                case "'":
                    if (v("'"))E += "'"; else G = true;
                    break;
                default:
                    E += g.charAt(B)
            }
            return E
        }, _possibleChars:function (g) {
            for (var k = "", o = false, s = function (r) {
                (r = q + 1 < g.length &&
                        g.charAt(q + 1) == r) && q++;
                return r
            }, q = 0; q < g.length; q++)if (o)if (g.charAt(q) == "'" && !s("'"))o = false; else k += g.charAt(q); else switch (g.charAt(q)) {
                case "d":
                case "m":
                case "y":
                case "@":
                    k += "0123456789";
                    break;
                case "D":
                case "M":
                    return null;
                case "'":
                    if (s("'"))k += "'"; else o = true;
                    break;
                default:
                    k += g.charAt(q)
            }
            return k
        }, _get:function (g, k) {
            return g.settings[k] !== d ? g.settings[k] : this._defaults[k]
        }, _setDateFromField:function (g, k) {
            if (g.input.val() != g.lastVal) {
                var o = this._get(g, "dateFormat"), s = g.lastVal = g.input ? g.input.val() :
                        null, q, r;
                q = r = this._getDefaultDate(g);
                var v = this._getFormatConfig(g);
                try {
                    q = this.parseDate(o, s, v) || r
                } catch (t) {
                    this.log(t);
                    s = k ? "" : s
                }
                g.selectedDay = q.getDate();
                g.drawMonth = g.selectedMonth = q.getMonth();
                g.drawYear = g.selectedYear = q.getFullYear();
                g.currentDay = s ? q.getDate() : 0;
                g.currentMonth = s ? q.getMonth() : 0;
                g.currentYear = s ? q.getFullYear() : 0;
                this._adjustInstDate(g)
            }
        }, _getDefaultDate:function (g) {
            return this._restrictMinMax(g, this._determineDate(g, this._get(g, "defaultDate"), new Date))
        }, _determineDate:function (g, k, o) {
            var s = function (r) {
                var v = new Date;
                v.setDate(v.getDate() + r);
                return v
            }, q = function (r) {
                try {
                    return a.datepicker.parseDate(a.datepicker._get(g, "dateFormat"), r, a.datepicker._getFormatConfig(g))
                } catch (v) {
                }
                var t = (r.toLowerCase().match(/^c/) ? a.datepicker._getDate(g) : null) || new Date, y = t.getFullYear(), E = t.getMonth();
                t = t.getDate();
                for (var G = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, B = G.exec(r); B;) {
                    switch (B[2] || "d") {
                        case "d":
                        case "D":
                            t += parseInt(B[1], 10);
                            break;
                        case "w":
                        case "W":
                            t += parseInt(B[1], 10) * 7;
                            break;
                        case "m":
                        case "M":
                            E +=
                                    parseInt(B[1], 10);
                            t = Math.min(t, a.datepicker._getDaysInMonth(y, E));
                            break;
                        case "y":
                        case "Y":
                            y += parseInt(B[1], 10);
                            t = Math.min(t, a.datepicker._getDaysInMonth(y, E));
                            break
                    }
                    B = G.exec(r)
                }
                return new Date(y, E, t)
            };
            if (k = (k = k == null || k === "" ? o : typeof k == "string" ? q(k) : typeof k == "number" ? isNaN(k) ? o : s(k) : new Date(k.getTime())) && k.toString() == "Invalid Date" ? o : k) {
                k.setHours(0);
                k.setMinutes(0);
                k.setSeconds(0);
                k.setMilliseconds(0)
            }
            return this._daylightSavingAdjust(k)
        }, _daylightSavingAdjust:function (g) {
            if (!g)return null;
            g.setHours(g.getHours() > 12 ? g.getHours() + 2 : 0);
            return g
        }, _setDate:function (g, k, o) {
            var s = !k, q = g.selectedMonth, r = g.selectedYear;
            k = this._restrictMinMax(g, this._determineDate(g, k, new Date));
            g.selectedDay = g.currentDay = k.getDate();
            g.drawMonth = g.selectedMonth = g.currentMonth = k.getMonth();
            g.drawYear = g.selectedYear = g.currentYear = k.getFullYear();
            if ((q != g.selectedMonth || r != g.selectedYear) && !o)this._notifyChange(g);
            this._adjustInstDate(g);
            if (g.input)g.input.val(s ? "" : this._formatDate(g))
        }, _getDate:function (g) {
            return!g.currentYear ||
                    g.input && g.input.val() == "" ? null : this._daylightSavingAdjust(new Date(g.currentYear, g.currentMonth, g.currentDay))
        }, _generateHTML:function (g) {
            var k = new Date;
            k = this._daylightSavingAdjust(new Date(k.getFullYear(), k.getMonth(), k.getDate()));
            var o = this._get(g, "isRTL"), s = this._get(g, "showButtonPanel"), q = this._get(g, "hideIfNoPrevNext"), r = this._get(g, "navigationAsDateFormat"), v = this._getNumberOfMonths(g), t = this._get(g, "showCurrentAtPos"), y = this._get(g, "stepMonths"), E = v[0] != 1 || v[1] != 1, G = this._daylightSavingAdjust(!g.currentDay ?
                    new Date(9999, 9, 9) : new Date(g.currentYear, g.currentMonth, g.currentDay)), B = this._getMinMaxDate(g, "min"), N = this._getMinMaxDate(g, "max");
            t = g.drawMonth - t;
            var ba = g.drawYear;
            if (t < 0) {
                t += 12;
                ba--
            }
            if (N) {
                var L = this._daylightSavingAdjust(new Date(N.getFullYear(), N.getMonth() - v[0] * v[1] + 1, N.getDate()));
                for (L = B && L < B ? B : L; this._daylightSavingAdjust(new Date(ba, t, 1)) > L;) {
                    t--;
                    if (t < 0) {
                        t = 11;
                        ba--
                    }
                }
            }
            g.drawMonth = t;
            g.drawYear = ba;
            L = this._get(g, "prevText");
            L = !r ? L : this.formatDate(L, this._daylightSavingAdjust(new Date(ba, t - y,
                    1)), this._getFormatConfig(g));
            L = this._canAdjustMonth(g, -1, ba, t) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + f + ".datepicker._adjustDate('#" + g.id + "', -" + y + ", 'M');\" title=\"" + L + '"><span class="ui-icon ui-icon-circle-triangle-' + (o ? "e" : "w") + '">' + L + "</span></a>" : q ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + L + '"><span class="ui-icon ui-icon-circle-triangle-' + (o ? "e" : "w") + '">' + L + "</span></a>";
            var ja = this._get(g, "nextText");
            ja = !r ? ja : this.formatDate(ja,
                    this._daylightSavingAdjust(new Date(ba, t + y, 1)), this._getFormatConfig(g));
            q = this._canAdjustMonth(g, +1, ba, t) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + f + ".datepicker._adjustDate('#" + g.id + "', +" + y + ", 'M');\" title=\"" + ja + '"><span class="ui-icon ui-icon-circle-triangle-' + (o ? "w" : "e") + '">' + ja + "</span></a>" : q ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + ja + '"><span class="ui-icon ui-icon-circle-triangle-' + (o ? "w" : "e") + '">' + ja + "</span></a>";
            y = this._get(g,
                    "currentText");
            ja = this._get(g, "gotoCurrent") && g.currentDay ? G : k;
            y = !r ? y : this.formatDate(y, ja, this._getFormatConfig(g));
            r = !g.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + f + '.datepicker._hideDatepicker();">' + this._get(g, "closeText") + "</button>" : "";
            s = s ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (o ? r : "") + (this._isInRange(g, ja) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' +
                    f + ".datepicker._gotoToday('#" + g.id + "');\">" + y + "</button>" : "") + (o ? "" : r) + "</div>" : "";
            r = parseInt(this._get(g, "firstDay"), 10);
            r = isNaN(r) ? 0 : r;
            y = this._get(g, "showWeek");
            ja = this._get(g, "dayNames");
            this._get(g, "dayNamesShort");
            var K = this._get(g, "dayNamesMin"), Z = this._get(g, "monthNames"), X = this._get(g, "monthNamesShort"), da = this._get(g, "beforeShowDay"), W = this._get(g, "showOtherMonths"), ra = this._get(g, "selectOtherMonths");
            this._get(g, "calculateWeek");
            for (var Y = this._getDefaultDate(g), m = "", P = 0; P < v[0]; P++) {
                var la =
                        "";
                this.maxRows = 4;
                for (var wa = 0; wa < v[1]; wa++) {
                    var Aa = this._daylightSavingAdjust(new Date(ba, t, g.selectedDay)), za = " ui-corner-all", C = "";
                    if (E) {
                        C += '<div class="ui-datepicker-group';
                        if (v[1] > 1)switch (wa) {
                            case 0:
                                C += " ui-datepicker-group-first";
                                za = " ui-corner-" + (o ? "right" : "left");
                                break;
                            case v[1] - 1:
                                C += " ui-datepicker-group-last";
                                za = " ui-corner-" + (o ? "left" : "right");
                                break;
                            default:
                                C += " ui-datepicker-group-middle";
                                za = "";
                                break
                        }
                        C += '">'
                    }
                    C += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + za +
                            '">' + (/all|left/.test(za) && P == 0 ? o ? q : L : "") + (/all|right/.test(za) && P == 0 ? o ? L : q : "") + this._generateMonthYearHeader(g, t, ba, B, N, P > 0 || wa > 0, Z, X) + '</div><table class="ui-datepicker-calendar"><thead><tr>';
                    var S = y ? '<th class="ui-datepicker-week-col">' + this._get(g, "weekHeader") + "</th>" : "";
                    for (za = 0; za < 7; za++) {
                        var ua = (za + r) % 7;
                        S += "<th" + ((za + r + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + '><span title="' + ja[ua] + '">' + K[ua] + "</span></th>"
                    }
                    C += S + "</tr></thead><tbody>";
                    S = this._getDaysInMonth(ba, t);
                    if (ba == g.selectedYear &&
                            t == g.selectedMonth)g.selectedDay = Math.min(g.selectedDay, S);
                    za = (this._getFirstDayOfMonth(ba, t) - r + 7) % 7;
                    S = Math.ceil((za + S) / 7);
                    this.maxRows = S = E ? this.maxRows > S ? this.maxRows : S : S;
                    ua = this._daylightSavingAdjust(new Date(ba, t, 1 - za));
                    for (var pa = 0; pa < S; pa++) {
                        C += "<tr>";
                        var Q = !y ? "" : '<td class="ui-datepicker-week-col">' + this._get(g, "calculateWeek")(ua) + "</td>";
                        for (za = 0; za < 7; za++) {
                            var fa = da ? da.apply(g.input ? g.input[0] : null, [ua]) : [true, ""], ma = ua.getMonth() != t, va = ma && !ra || !fa[0] || B && ua < B || N && ua > N;
                            Q += '<td class="' +
                                    ((za + r + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (ma ? " ui-datepicker-other-month" : "") + (ua.getTime() == Aa.getTime() && t == g.selectedMonth && g._keyEvent || Y.getTime() == ua.getTime() && Y.getTime() == Aa.getTime() ? " " + this._dayOverClass : "") + (va ? " " + this._unselectableClass + " ui-state-disabled" : "") + (ma && !W ? "" : " " + fa[1] + (ua.getTime() == G.getTime() ? " " + this._currentClass : "") + (ua.getTime() == k.getTime() ? " ui-datepicker-today" : "")) + '"' + ((!ma || W) && fa[2] ? ' title="' + fa[2] + '"' : "") + (va ? "" : ' onclick="DP_jQuery_' + f + ".datepicker._selectDay('#" +
                                    g.id + "'," + ua.getMonth() + "," + ua.getFullYear() + ', this);return false;"') + ">" + (ma && !W ? "&#xa0;" : va ? '<span class="ui-state-default">' + ua.getDate() + "</span>" : '<a class="ui-state-default' + (ua.getTime() == k.getTime() ? " ui-state-highlight" : "") + (ua.getTime() == G.getTime() ? " ui-state-active" : "") + (ma ? " ui-priority-secondary" : "") + '" href="#">' + ua.getDate() + "</a>") + "</td>";
                            ua.setDate(ua.getDate() + 1);
                            ua = this._daylightSavingAdjust(ua)
                        }
                        C += Q + "</tr>"
                    }
                    t++;
                    if (t > 11) {
                        t = 0;
                        ba++
                    }
                    C += "</tbody></table>" + (E ? "</div>" + (v[0] > 0 && wa ==
                            v[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : "");
                    la += C
                }
                m += la
            }
            m += s + (a.browser.msie && parseInt(a.browser.version, 10) < 7 && !g.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : "");
            g._keyEvent = false;
            return m
        }, _generateMonthYearHeader:function (g, k, o, s, q, r, v, t) {
            var y = this._get(g, "changeMonth"), E = this._get(g, "changeYear"), G = this._get(g, "showMonthAfterYear"), B = '<div class="ui-datepicker-title">', N = "";
            if (r || !y)N += '<span class="ui-datepicker-month">' + v[k] +
                    "</span>"; else {
                v = s && s.getFullYear() == o;
                var ba = q && q.getFullYear() == o;
                N += '<select class="ui-datepicker-month" onchange="DP_jQuery_' + f + ".datepicker._selectMonthYear('#" + g.id + "', this, 'M');\" >";
                for (var L = 0; L < 12; L++)if ((!v || L >= s.getMonth()) && (!ba || L <= q.getMonth()))N += '<option value="' + L + '"' + (L == k ? ' selected="selected"' : "") + ">" + t[L] + "</option>";
                N += "</select>"
            }
            G || (B += N + (r || !(y && E) ? "&#xa0;" : ""));
            if (!g.yearshtml) {
                g.yearshtml = "";
                if (r || !E)B += '<span class="ui-datepicker-year">' + o + "</span>"; else {
                    t = this._get(g,
                            "yearRange").split(":");
                    var ja = (new Date).getFullYear();
                    v = function (K) {
                        K = K.match(/c[+-].*/) ? o + parseInt(K.substring(1), 10) : K.match(/[+-].*/) ? ja + parseInt(K, 10) : parseInt(K, 10);
                        return isNaN(K) ? ja : K
                    };
                    k = v(t[0]);
                    t = Math.max(k, v(t[1] || ""));
                    k = s ? Math.max(k, s.getFullYear()) : k;
                    t = q ? Math.min(t, q.getFullYear()) : t;
                    for (g.yearshtml += '<select class="ui-datepicker-year" onchange="DP_jQuery_' + f + ".datepicker._selectMonthYear('#" + g.id + "', this, 'Y');\" >"; k <= t; k++)g.yearshtml += '<option value="' + k + '"' + (k == o ? ' selected="selected"' :
                            "") + ">" + k + "</option>";
                    g.yearshtml += "</select>";
                    B += g.yearshtml;
                    g.yearshtml = null
                }
            }
            B += this._get(g, "yearSuffix");
            if (G)B += (r || !(y && E) ? "&#xa0;" : "") + N;
            B += "</div>";
            return B
        }, _adjustInstDate:function (g, k, o) {
            var s = g.drawYear + (o == "Y" ? k : 0), q = g.drawMonth + (o == "M" ? k : 0);
            k = Math.min(g.selectedDay, this._getDaysInMonth(s, q)) + (o == "D" ? k : 0);
            s = this._restrictMinMax(g, this._daylightSavingAdjust(new Date(s, q, k)));
            g.selectedDay = s.getDate();
            g.drawMonth = g.selectedMonth = s.getMonth();
            g.drawYear = g.selectedYear = s.getFullYear();
            if (o ==
                    "M" || o == "Y")this._notifyChange(g)
        }, _restrictMinMax:function (g, k) {
            var o = this._getMinMaxDate(g, "min"), s = this._getMinMaxDate(g, "max");
            o = o && k < o ? o : k;
            return o = s && o > s ? s : o
        }, _notifyChange:function (g) {
            var k = this._get(g, "onChangeMonthYear");
            if (k)k.apply(g.input ? g.input[0] : null, [g.selectedYear, g.selectedMonth + 1, g])
        }, _getNumberOfMonths:function (g) {
            g = this._get(g, "numberOfMonths");
            return g == null ? [1, 1] : typeof g == "number" ? [1, g] : g
        }, _getMinMaxDate:function (g, k) {
            return this._determineDate(g, this._get(g, k + "Date"), null)
        },
        _getDaysInMonth:function (g, k) {
            return 32 - this._daylightSavingAdjust(new Date(g, k, 32)).getDate()
        }, _getFirstDayOfMonth:function (g, k) {
            return(new Date(g, k, 1)).getDay()
        }, _canAdjustMonth:function (g, k, o, s) {
            var q = this._getNumberOfMonths(g);
            o = this._daylightSavingAdjust(new Date(o, s + (k < 0 ? k : q[0] * q[1]), 1));
            k < 0 && o.setDate(this._getDaysInMonth(o.getFullYear(), o.getMonth()));
            return this._isInRange(g, o)
        }, _isInRange:function (g, k) {
            var o = this._getMinMaxDate(g, "min"), s = this._getMinMaxDate(g, "max");
            return(!o || k.getTime() >=
                    o.getTime()) && (!s || k.getTime() <= s.getTime())
        }, _getFormatConfig:function (g) {
            var k = this._get(g, "shortYearCutoff");
            k = typeof k != "string" ? k : (new Date).getFullYear() % 100 + parseInt(k, 10);
            return{shortYearCutoff:k, dayNamesShort:this._get(g, "dayNamesShort"), dayNames:this._get(g, "dayNames"), monthNamesShort:this._get(g, "monthNamesShort"), monthNames:this._get(g, "monthNames")}
        }, _formatDate:function (g, k, o, s) {
            if (!k) {
                g.currentDay = g.selectedDay;
                g.currentMonth = g.selectedMonth;
                g.currentYear = g.selectedYear
            }
            k = k ? typeof k ==
                    "object" ? k : this._daylightSavingAdjust(new Date(s, o, k)) : this._daylightSavingAdjust(new Date(g.currentYear, g.currentMonth, g.currentDay));
            return this.formatDate(this._get(g, "dateFormat"), k, this._getFormatConfig(g))
        }});
    a.fn.datepicker = function (g) {
        if (!this.length)return this;
        if (!a.datepicker.initialized) {
            a(document).mousedown(a.datepicker._checkExternalClick).find("body").append(a.datepicker.dpDiv);
            a.datepicker.initialized = true
        }
        var k = Array.prototype.slice.call(arguments, 1);
        if (typeof g == "string" && (g == "isDisabled" ||
                g == "getDate" || g == "widget"))return a.datepicker["_" + g + "Datepicker"].apply(a.datepicker, [this[0]].concat(k));
        if (g == "option" && arguments.length == 2 && typeof arguments[1] == "string")return a.datepicker["_" + g + "Datepicker"].apply(a.datepicker, [this[0]].concat(k));
        return this.each(function () {
            typeof g == "string" ? a.datepicker["_" + g + "Datepicker"].apply(a.datepicker, [this].concat(k)) : a.datepicker._attachDatepicker(this, g)
        })
    };
    a.datepicker = new b;
    a.datepicker.initialized = false;
    a.datepicker.uuid = (new Date).getTime();
    a.datepicker.version = "1.8.16";
    window["DP_jQuery_" + f] = a
})(jQuery);
jQuery.effects || function (a, d) {
    function b(q) {
        var r;
        if (q && q.constructor == Array && q.length == 3)return q;
        if (r = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(q))return[parseInt(r[1], 10), parseInt(r[2], 10), parseInt(r[3], 10)];
        if (r = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(q))return[parseFloat(r[1]) * 2.55, parseFloat(r[2]) * 2.55, parseFloat(r[3]) * 2.55];
        if (r = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(q))return[parseInt(r[1], 16),
            parseInt(r[2], 16), parseInt(r[3], 16)];
        if (r = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(q))return[parseInt(r[1] + r[1], 16), parseInt(r[2] + r[2], 16), parseInt(r[3] + r[3], 16)];
        if (/rgba\(0, 0, 0, 0\)/.exec(q))return k.transparent;
        return k[a.trim(q).toLowerCase()]
    }

    function c() {
        var q = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle, r = {}, v, t;
        if (q && q.length && q[0] && q[q[0]])for (var y = q.length; y--;) {
            v = q[y];
            if (typeof q[v] == "string") {
                t = v.replace(/\-(\w)/g, function (E, G) {
                    return G.toUpperCase()
                });
                r[t] = q[v]
            }
        } else for (v in q)if (typeof q[v] === "string")r[v] = q[v];
        return r
    }

    function e(q) {
        var r, v;
        for (r in q) {
            v = q[r];
            if (v == null || a.isFunction(v) || r in s || /scrollbar/.test(r) || !/color/i.test(r) && isNaN(parseFloat(v)))delete q[r]
        }
        return q
    }

    function f(q, r) {
        var v = {_:0}, t;
        for (t in r)if (q[t] != r[t])v[t] = r[t];
        return v
    }

    function j(q, r, v, t) {
        if (typeof q == "object") {
            t = r;
            v = null;
            r = q;
            q = r.effect
        }
        if (a.isFunction(r)) {
            t = r;
            v = null;
            r = {}
        }
        if (typeof r == "number" || a.fx.speeds[r]) {
            t = v;
            v = r;
            r = {}
        }
        if (a.isFunction(v)) {
            t = v;
            v = null
        }
        r = r || {};
        v = v || r.duration;
        v = a.fx.off ? 0 : typeof v == "number" ? v : v in a.fx.speeds ? a.fx.speeds[v] : a.fx.speeds._default;
        t = t || r.complete;
        return[q, r, v, t]
    }

    function g(q) {
        if (!q || typeof q === "number" || a.fx.speeds[q])return true;
        if (typeof q === "string" && !a.effects[q])return true;
        return false
    }

    a.effects = {};
    a.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderColor", "color", "outlineColor"], function (q, r) {
        a.fx.step[r] = function (v) {
            if (!v.colorInit) {
                var t;
                t = v.elem;
                var y = r, E;
                do {
                    E =
                            a.curCSS(t, y);
                    if (E != "" && E != "transparent" || a.nodeName(t, "body"))break;
                    y = "backgroundColor"
                } while (t = t.parentNode);
                t = b(E);
                v.start = t;
                v.end = b(v.end);
                v.colorInit = true
            }
            v.elem.style[r] = "rgb(" + Math.max(Math.min(parseInt(v.pos * (v.end[0] - v.start[0]) + v.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt(v.pos * (v.end[1] - v.start[1]) + v.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt(v.pos * (v.end[2] - v.start[2]) + v.start[2], 10), 255), 0) + ")"
        }
    });
    var k = {aqua:[0, 255, 255], azure:[240, 255, 255], beige:[245, 245, 220], black:[0,
        0, 0], blue:[0, 0, 255], brown:[165, 42, 42], cyan:[0, 255, 255], darkblue:[0, 0, 139], darkcyan:[0, 139, 139], darkgrey:[169, 169, 169], darkgreen:[0, 100, 0], darkkhaki:[189, 183, 107], darkmagenta:[139, 0, 139], darkolivegreen:[85, 107, 47], darkorange:[255, 140, 0], darkorchid:[153, 50, 204], darkred:[139, 0, 0], darksalmon:[233, 150, 122], darkviolet:[148, 0, 211], fuchsia:[255, 0, 255], gold:[255, 215, 0], green:[0, 128, 0], indigo:[75, 0, 130], khaki:[240, 230, 140], lightblue:[173, 216, 230], lightcyan:[224, 255, 255], lightgreen:[144, 238, 144], lightgrey:[211,
        211, 211], lightpink:[255, 182, 193], lightyellow:[255, 255, 224], lime:[0, 255, 0], magenta:[255, 0, 255], maroon:[128, 0, 0], navy:[0, 0, 128], olive:[128, 128, 0], orange:[255, 165, 0], pink:[255, 192, 203], purple:[128, 0, 128], violet:[128, 0, 128], red:[255, 0, 0], silver:[192, 192, 192], white:[255, 255, 255], yellow:[255, 255, 0], transparent:[255, 255, 255]}, o = ["add", "remove", "toggle"], s = {border:1, borderBottom:1, borderColor:1, borderLeft:1, borderRight:1, borderTop:1, borderWidth:1, margin:1, padding:1};
    a.effects.animateClass = function (q, r, v, t) {
        if (a.isFunction(v)) {
            t = v;
            v = null
        }
        return this.queue(function () {
            var y = a(this), E = y.attr("style") || " ", G = e(c.call(this)), B, N = y.attr("class");
            a.each(o, function (ba, L) {
                q[L] && y[L + "Class"](q[L])
            });
            B = e(c.call(this));
            y.attr("class", N);
            y.animate(f(G, B), {queue:false, duration:r, easing:v, complete:function () {
                a.each(o, function (ba, L) {
                    q[L] && y[L + "Class"](q[L])
                });
                if (typeof y.attr("style") == "object") {
                    y.attr("style").cssText = "";
                    y.attr("style").cssText = E
                } else y.attr("style", E);
                t && t.apply(this, arguments);
                a.dequeue(this)
            }})
        })
    };
    a.fn.extend({_addClass:a.fn.addClass, addClass:function (q, r, v, t) {
        return r ? a.effects.animateClass.apply(this, [
            {add:q},
            r,
            v,
            t
        ]) : this._addClass(q)
    }, _removeClass:a.fn.removeClass, removeClass:function (q, r, v, t) {
        return r ? a.effects.animateClass.apply(this, [
            {remove:q},
            r,
            v,
            t
        ]) : this._removeClass(q)
    }, _toggleClass:a.fn.toggleClass, toggleClass:function (q, r, v, t, y) {
        return typeof r == "boolean" || r === d ? v ? a.effects.animateClass.apply(this, [r ? {add:q} : {remove:q}, v, t, y]) : this._toggleClass(q, r) : a.effects.animateClass.apply(this,
                [
                    {toggle:q},
                    r,
                    v,
                    t
                ])
    }, switchClass:function (q, r, v, t, y) {
        return a.effects.animateClass.apply(this, [
            {add:r, remove:q},
            v,
            t,
            y
        ])
    }});
    a.extend(a.effects, {version:"1.8.16", save:function (q, r) {
        for (var v = 0; v < r.length; v++)r[v] !== null && q.data("ec.storage." + r[v], q[0].style[r[v]])
    }, restore:function (q, r) {
        for (var v = 0; v < r.length; v++)r[v] !== null && q.css(r[v], q.data("ec.storage." + r[v]))
    }, setMode:function (q, r) {
        if (r == "toggle")r = q.is(":hidden") ? "show" : "hide";
        return r
    }, getBaseline:function (q, r) {
        var v, t;
        switch (q[0]) {
            case "top":
                v =
                        0;
                break;
            case "middle":
                v = 0.5;
                break;
            case "bottom":
                v = 1;
                break;
            default:
                v = q[0] / r.height
        }
        switch (q[1]) {
            case "left":
                t = 0;
                break;
            case "center":
                t = 0.5;
                break;
            case "right":
                t = 1;
                break;
            default:
                t = q[1] / r.width
        }
        return{x:t, y:v}
    }, createWrapper:function (q) {
        if (q.parent().is(".ui-effects-wrapper"))return q.parent();
        var r = {width:q.outerWidth(true), height:q.outerHeight(true), "float":q.css("float")}, v = a("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%", background:"transparent", border:"none", margin:0, padding:0}),
                t = document.activeElement;
        q.wrap(v);
        if (q[0] === t || a.contains(q[0], t))a(t).focus();
        v = q.parent();
        if (q.css("position") == "static") {
            v.css({position:"relative"});
            q.css({position:"relative"})
        } else {
            a.extend(r, {position:q.css("position"), zIndex:q.css("z-index")});
            a.each(["top", "left", "bottom", "right"], function (y, E) {
                r[E] = q.css(E);
                if (isNaN(parseInt(r[E], 10)))r[E] = "auto"
            });
            q.css({position:"relative", top:0, left:0, right:"auto", bottom:"auto"})
        }
        return v.css(r).show()
    }, removeWrapper:function (q) {
        var r, v = document.activeElement;
        if (q.parent().is(".ui-effects-wrapper")) {
            r = q.parent().replaceWith(q);
            if (q[0] === v || a.contains(q[0], v))a(v).focus();
            return r
        }
        return q
    }, setTransition:function (q, r, v, t) {
        t = t || {};
        a.each(r, function (y, E) {
            unit = q.cssUnit(E);
            if (unit[0] > 0)t[E] = unit[0] * v + unit[1]
        });
        return t
    }});
    a.fn.extend({effect:function (q) {
        var r = j.apply(this, arguments), v = {options:r[1], duration:r[2], callback:r[3]};
        r = v.options.mode;
        var t = a.effects[q];
        if (a.fx.off || !t)return r ? this[r](v.duration, v.callback) : this.each(function () {
            v.callback && v.callback.call(this)
        });
        return t.call(this, v)
    }, _show:a.fn.show, show:function (q) {
        if (g(q))return this._show.apply(this, arguments); else {
            var r = j.apply(this, arguments);
            r[1].mode = "show";
            return this.effect.apply(this, r)
        }
    }, _hide:a.fn.hide, hide:function (q) {
        if (g(q))return this._hide.apply(this, arguments); else {
            var r = j.apply(this, arguments);
            r[1].mode = "hide";
            return this.effect.apply(this, r)
        }
    }, __toggle:a.fn.toggle, toggle:function (q) {
        if (g(q) || typeof q === "boolean" || a.isFunction(q))return this.__toggle.apply(this, arguments); else {
            var r = j.apply(this,
                    arguments);
            r[1].mode = "toggle";
            return this.effect.apply(this, r)
        }
    }, cssUnit:function (q) {
        var r = this.css(q), v = [];
        a.each(["em", "px", "%", "pt"], function (t, y) {
            if (r.indexOf(y) > 0)v = [parseFloat(r), y]
        });
        return v
    }});
    a.easing.jswing = a.easing.swing;
    a.extend(a.easing, {def:"easeOutQuad", swing:function (q, r, v, t, y) {
        return a.easing[a.easing.def](q, r, v, t, y)
    }, easeInQuad:function (q, r, v, t, y) {
        return t * (r /= y) * r + v
    }, easeOutQuad:function (q, r, v, t, y) {
        return-t * (r /= y) * (r - 2) + v
    }, easeInOutQuad:function (q, r, v, t, y) {
        if ((r /= y / 2) < 1)return t /
                2 * r * r + v;
        return-t / 2 * (--r * (r - 2) - 1) + v
    }, easeInCubic:function (q, r, v, t, y) {
        return t * (r /= y) * r * r + v
    }, easeOutCubic:function (q, r, v, t, y) {
        return t * ((r = r / y - 1) * r * r + 1) + v
    }, easeInOutCubic:function (q, r, v, t, y) {
        if ((r /= y / 2) < 1)return t / 2 * r * r * r + v;
        return t / 2 * ((r -= 2) * r * r + 2) + v
    }, easeInQuart:function (q, r, v, t, y) {
        return t * (r /= y) * r * r * r + v
    }, easeOutQuart:function (q, r, v, t, y) {
        return-t * ((r = r / y - 1) * r * r * r - 1) + v
    }, easeInOutQuart:function (q, r, v, t, y) {
        if ((r /= y / 2) < 1)return t / 2 * r * r * r * r + v;
        return-t / 2 * ((r -= 2) * r * r * r - 2) + v
    }, easeInQuint:function (q, r, v, t, y) {
        return t * (r /= y) * r * r * r * r + v
    }, easeOutQuint:function (q, r, v, t, y) {
        return t * ((r = r / y - 1) * r * r * r * r + 1) + v
    }, easeInOutQuint:function (q, r, v, t, y) {
        if ((r /= y / 2) < 1)return t / 2 * r * r * r * r * r + v;
        return t / 2 * ((r -= 2) * r * r * r * r + 2) + v
    }, easeInSine:function (q, r, v, t, y) {
        return-t * Math.cos(r / y * (Math.PI / 2)) + t + v
    }, easeOutSine:function (q, r, v, t, y) {
        return t * Math.sin(r / y * (Math.PI / 2)) + v
    }, easeInOutSine:function (q, r, v, t, y) {
        return-t / 2 * (Math.cos(Math.PI * r / y) - 1) + v
    }, easeInExpo:function (q, r, v, t, y) {
        return r == 0 ? v : t * Math.pow(2, 10 * (r / y - 1)) + v
    }, easeOutExpo:function (q, r, v, t, y) {
        return r == y ? v + t : t * (-Math.pow(2, -10 * r / y) + 1) + v
    }, easeInOutExpo:function (q, r, v, t, y) {
        if (r == 0)return v;
        if (r == y)return v + t;
        if ((r /= y / 2) < 1)return t / 2 * Math.pow(2, 10 * (r - 1)) + v;
        return t / 2 * (-Math.pow(2, -10 * --r) + 2) + v
    }, easeInCirc:function (q, r, v, t, y) {
        return-t * (Math.sqrt(1 - (r /= y) * r) - 1) + v
    }, easeOutCirc:function (q, r, v, t, y) {
        return t * Math.sqrt(1 - (r = r / y - 1) * r) + v
    }, easeInOutCirc:function (q, r, v, t, y) {
        if ((r /= y / 2) < 1)return-t / 2 * (Math.sqrt(1 - r * r) - 1) + v;
        return t / 2 * (Math.sqrt(1 - (r -= 2) * r) + 1) + v
    }, easeInElastic:function (q, r, v, t, y) {
        q = 1.70158;
        var E = 0, G = t;
        if (r == 0)return v;
        if ((r /= y) == 1)return v + t;
        E || (E = y * 0.3);
        if (G < Math.abs(t)) {
            G = t;
            q = E / 4
        } else q = E / (2 * Math.PI) * Math.asin(t / G);
        return-(G * Math.pow(2, 10 * (r -= 1)) * Math.sin((r * y - q) * 2 * Math.PI / E)) + v
    }, easeOutElastic:function (q, r, v, t, y) {
        q = 1.70158;
        var E = 0, G = t;
        if (r == 0)return v;
        if ((r /= y) == 1)return v + t;
        E || (E = y * 0.3);
        if (G < Math.abs(t)) {
            G = t;
            q = E / 4
        } else q = E / (2 * Math.PI) * Math.asin(t / G);
        return G * Math.pow(2, -10 * r) * Math.sin((r * y - q) * 2 * Math.PI / E) + t + v
    }, easeInOutElastic:function (q, r, v, t, y) {
        q = 1.70158;
        var E =
                0, G = t;
        if (r == 0)return v;
        if ((r /= y / 2) == 2)return v + t;
        E || (E = y * 0.3 * 1.5);
        if (G < Math.abs(t)) {
            G = t;
            q = E / 4
        } else q = E / (2 * Math.PI) * Math.asin(t / G);
        if (r < 1)return-0.5 * G * Math.pow(2, 10 * (r -= 1)) * Math.sin((r * y - q) * 2 * Math.PI / E) + v;
        return G * Math.pow(2, -10 * (r -= 1)) * Math.sin((r * y - q) * 2 * Math.PI / E) * 0.5 + t + v
    }, easeInBack:function (q, r, v, t, y, E) {
        if (E == d)E = 1.70158;
        return t * (r /= y) * r * ((E + 1) * r - E) + v
    }, easeOutBack:function (q, r, v, t, y, E) {
        if (E == d)E = 1.70158;
        return t * ((r = r / y - 1) * r * ((E + 1) * r + E) + 1) + v
    }, easeInOutBack:function (q, r, v, t, y, E) {
        if (E == d)E = 1.70158;
        if ((r /= y / 2) < 1)return t / 2 * r * r * (((E *= 1.525) + 1) * r - E) + v;
        return t / 2 * ((r -= 2) * r * (((E *= 1.525) + 1) * r + E) + 2) + v
    }, easeInBounce:function (q, r, v, t, y) {
        return t - a.easing.easeOutBounce(q, y - r, 0, t, y) + v
    }, easeOutBounce:function (q, r, v, t, y) {
        return(r /= y) < 1 / 2.75 ? t * 7.5625 * r * r + v : r < 2 / 2.75 ? t * (7.5625 * (r -= 1.5 / 2.75) * r + 0.75) + v : r < 2.5 / 2.75 ? t * (7.5625 * (r -= 2.25 / 2.75) * r + 0.9375) + v : t * (7.5625 * (r -= 2.625 / 2.75) * r + 0.984375) + v
    }, easeInOutBounce:function (q, r, v, t, y) {
        if (r < y / 2)return a.easing.easeInBounce(q, r * 2, 0, t, y) * 0.5 + v;
        return a.easing.easeOutBounce(q,
                r * 2 - y, 0, t, y) * 0.5 + t * 0.5 + v
    }})
}(jQuery);
(function (a) {
    var d = 0;
    a.getScrollbarWidth = function () {
        if (!d)if (a.browser.msie) {
            var b = a('<textarea cols="10" rows="2"></textarea>').css({position:"absolute", top:-1000, left:-1000}).appendTo("body"), c = a('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>').css({position:"absolute", top:-1000, left:-1000}).appendTo("body");
            d = b.width() - c.width();
            b.add(c).remove()
        } else {
            b = a("<div />").css({width:100, height:100, overflow:"auto", position:"absolute", top:-1000, left:-1000}).prependTo("body").append("<div />").find("div").css({width:"100%",
                height:200});
            d = 100 - b.width();
            b.parent().remove()
        }
        return d
    }
})(jQuery);
(function (a) {
    a.fn.drag = function (e, f, j) {
        var g = typeof e == "string" ? e : "", k = a.isFunction(e) ? e : a.isFunction(f) ? f : null;
        if (g.indexOf("drag") !== 0)g = "drag" + g;
        j = (e == k ? f : j) || {};
        return k ? this.bind(g, j, k) : this.trigger(g)
    };
    var d = a.event, b = d.special, c = b.drag = {defaults:{which:1, distance:15, not:":input", handle:null, relative:false, drop:true, click:true}, datakey:"dragdata", livekey:"livedrag", add:function (e) {
        var f = a.data(this, c.datakey), j = e.data || {};
        f.related += 1;
        if (!f.live && e.selector) {
            f.live = true;
            d.add(this, "draginit." +
                    c.livekey, c.delegate)
        }
        a.each(c.defaults, function (g) {
            if (j[g] !== undefined)f[g] = j[g]
        })
    }, remove:function () {
        a.data(this, c.datakey).related -= 1
    }, setup:function () {
        if (!a.data(this, c.datakey)) {
            var e = a.extend({related:0}, c.defaults);
            a.data(this, c.datakey, e);
            d.add(this, "mousedown", c.init, e);
            this.attachEvent && this.attachEvent("ondragstart", c.dontstart)
        }
    }, teardown:function () {
        if (!a.data(this, c.datakey).related) {
            a.removeData(this, c.datakey);
            d.remove(this, "mousedown", c.init);
            d.remove(this, "draginit", c.delegate);
            c.textselect(true);
            this.detachEvent && this.detachEvent("ondragstart", c.dontstart)
        }
    }, init:function (e) {
        var f = e.data, j;
        if (!(f.which > 0 && e.which != f.which))if (!a(e.target).is(f.not))if (!(f.handle && !a(e.target).closest(f.handle, e.currentTarget).length)) {
            f.propagates = 1;
            f.interactions = [c.interaction(this, f)];
            f.target = e.target;
            f.pageX = e.pageX;
            f.pageY = e.pageY;
            f.dragging = null;
            j = c.hijack(e, "draginit", f);
            if (f.propagates) {
                if ((j = c.flatten(j)) && j.length) {
                    f.interactions = [];
                    a.each(j, function () {
                        f.interactions.push(c.interaction(this, f))
                    })
                }
                f.propagates =
                        f.interactions.length;
                f.drop !== false && b.drop && b.drop.handler(e, f);
                c.textselect(false);
                d.add(document, "mousemove mouseup", c.handler, f);
                return false
            }
        }
    }, interaction:function (e, f) {
        return{drag:e, callback:new c.callback, droppable:[], offset:a(e)[f.relative ? "position" : "offset"]() || {top:0, left:0}}
    }, handler:function (e) {
        var f = e.data;
        switch (e.type) {
            case !f.dragging && "mousemove":
                if (Math.pow(e.pageX - f.pageX, 2) + Math.pow(e.pageY - f.pageY, 2) < Math.pow(f.distance, 2))break;
                e.target = f.target;
                c.hijack(e, "dragstart", f);
                if (f.propagates)f.dragging = true;
            case "mousemove":
                if (f.dragging) {
                    c.hijack(e, "drag", f);
                    if (f.propagates) {
                        f.drop !== false && b.drop && b.drop.handler(e, f);
                        break
                    }
                    e.type = "mouseup"
                }
            case "mouseup":
                d.remove(document, "mousemove mouseup", c.handler);
                if (f.dragging) {
                    f.drop !== false && b.drop && b.drop.handler(e, f);
                    c.hijack(e, "dragend", f)
                }
                c.textselect(true);
                if (f.click === false && f.dragging) {
                    jQuery.event.triggered = true;
                    setTimeout(function () {
                        jQuery.event.triggered = false
                    }, 20);
                    f.dragging = false
                }
                break
        }
    }, delegate:function (e) {
        var f =
                [], j, g = a.data(this, "events") || {};
        a.each(g.live || [], function (k, o) {
            if (o.preType.indexOf("drag") === 0)if (j = a(e.target).closest(o.selector, e.currentTarget)[0]) {
                d.add(j, o.origType + "." + c.livekey, o.origHandler, o.data);
                a.inArray(j, f) < 0 && f.push(j)
            }
        });
        if (!f.length)return false;
        return a(f).bind("dragend." + c.livekey, function () {
            d.remove(this, "." + c.livekey)
        })
    }, hijack:function (e, f, j, g, k) {
        if (j) {
            var o = {event:e.originalEvent, type:e.type}, s = f.indexOf("drop") ? "drag" : "drop", q, r = g || 0, v, t;
            g = !isNaN(g) ? g : j.interactions.length;
            e.type = f;
            e.originalEvent = null;
            j.results = [];
            do if (v = j.interactions[r])if (!(f !== "dragend" && v.cancelled)) {
                t = c.properties(e, j, v);
                v.results = [];
                a(k || v[s] || j.droppable).each(function (y, E) {
                    q = (t.target = E) ? d.handle.call(E, e, t) : null;
                    if (q === false) {
                        if (s == "drag") {
                            v.cancelled = true;
                            j.propagates -= 1
                        }
                        if (f == "drop")v[s][y] = null
                    } else if (f == "dropinit")v.droppable.push(c.element(q) || E);
                    if (f == "dragstart")v.proxy = a(c.element(q) || v.drag)[0];
                    v.results.push(q);
                    delete e.result;
                    if (f !== "dropinit")return q
                });
                j.results[r] = c.flatten(v.results);
                if (f == "dropinit")v.droppable = c.flatten(v.droppable);
                f == "dragstart" && !v.cancelled && t.update()
            } while (++r < g);
            e.type = o.type;
            e.originalEvent = o.event;
            return c.flatten(j.results)
        }
    }, properties:function (e, f, j) {
        var g = j.callback;
        g.drag = j.drag;
        g.proxy = j.proxy || j.drag;
        g.startX = f.pageX;
        g.startY = f.pageY;
        g.deltaX = e.pageX - f.pageX;
        g.deltaY = e.pageY - f.pageY;
        g.originalX = j.offset.left;
        g.originalY = j.offset.top;
        g.offsetX = e.pageX - (f.pageX - g.originalX);
        g.offsetY = e.pageY - (f.pageY - g.originalY);
        g.drop = c.flatten((j.drop || []).slice());
        g.available = c.flatten((j.droppable || []).slice());
        return g
    }, element:function (e) {
        if (e && (e.jquery || e.nodeType == 1))return e
    }, flatten:function (e) {
        return a.map(e, function (f) {
            return f && f.jquery ? a.makeArray(f) : f && f.length ? c.flatten(f) : f
        })
    }, textselect:function (e) {
        a("body")[e ? "unbind" : "bind"]("selectstart", c.dontstart).attr("unselectable", e ? "off" : "on").css("MozUserSelect", e ? "" : "none")
    }, dontstart:function () {
        return false
    }, callback:function () {
    }};
    c.callback.prototype = {update:function () {
        b.drop && this.available.length &&
        a.each(this.available, function (e) {
            b.drop.locate(this, e)
        })
    }};
    b.draginit = b.dragstart = b.dragend = c
})(jQuery);
(function (a) {
    a.fn.drop = function (e, f, j) {
        var g = typeof e == "string" ? e : "", k = a.isFunction(e) ? e : a.isFunction(f) ? f : null;
        if (g.indexOf("drop") !== 0)g = "drop" + g;
        j = (e == k ? f : j) || {};
        return k ? this.bind(g, j, k) : this.trigger(g)
    };
    a.drop = function (e) {
        e = e || {};
        c.multi = e.multi === true ? Infinity : e.multi === false ? 1 : !isNaN(e.multi) ? e.multi : c.multi;
        c.delay = e.delay || c.delay;
        c.tolerance = a.isFunction(e.tolerance) ? e.tolerance : e.tolerance === null ? null : c.tolerance;
        c.mode = e.mode || c.mode || "intersect"
    };
    var d = a.event, b = d.special, c = a.event.special.drop =
    {multi:1, delay:20, mode:"overlap", targets:[], datakey:"dropdata", livekey:"livedrop", add:function (e) {
        var f = a.data(this, c.datakey);
        f.related += 1;
        if (!f.live && e.selector) {
            f.live = true;
            d.add(this, "dropinit." + c.livekey, c.delegate)
        }
    }, remove:function () {
        a.data(this, c.datakey).related -= 1
    }, setup:function () {
        if (!a.data(this, c.datakey)) {
            a.data(this, c.datakey, {related:0, active:[], anyactive:0, winner:0, location:{}});
            c.targets.push(this)
        }
    }, teardown:function () {
        if (!a.data(this, c.datakey).related) {
            a.removeData(this, c.datakey);
            d.remove(this, "dropinit", c.delegate);
            var e = this;
            c.targets = a.grep(c.targets, function (f) {
                return f !== e
            })
        }
    }, handler:function (e, f) {
        var j;
        if (f)switch (e.type) {
            case "mousedown":
                j = a(c.targets);
                if (typeof f.drop == "string")j = j.filter(f.drop);
                j.each(function () {
                    var g = a.data(this, c.datakey);
                    g.active = [];
                    g.anyactive = 0;
                    g.winner = 0
                });
                f.droppable = j;
                c.delegates = [];
                b.drag.hijack(e, "dropinit", f);
                c.delegates = a.unique(b.drag.flatten(c.delegates));
                break;
            case "mousemove":
                c.event = e;
                c.timer || c.tolerate(f);
                break;
            case "mouseup":
                c.timer =
                        clearTimeout(c.timer);
                if (f.propagates) {
                    b.drag.hijack(e, "drop", f);
                    b.drag.hijack(e, "dropend", f);
                    a.each(c.delegates || [], function () {
                        d.remove(this, "." + c.livekey)
                    })
                }
                break
        }
    }, delegate:function (e) {
        var f = [], j, g = a.data(this, "events") || {};
        a.each(g.live || [], function (k, o) {
            if (o.preType.indexOf("drop") === 0) {
                j = a(e.currentTarget).find(o.selector);
                j.length && j.each(function () {
                    d.add(this, o.origType + "." + c.livekey, o.origHandler, o.data);
                    a.inArray(this, f) < 0 && f.push(this)
                })
            }
        });
        c.delegates.push(f);
        return f.length ? a(f) : false
    },
        locate:function (e, f) {
            var j = a.data(e, c.datakey), g = a(e), k = g.offset() || {}, o = g.outerHeight();
            g = g.outerWidth();
            k = {elem:e, width:g, height:o, top:k.top, left:k.left, right:k.left + g, bottom:k.top + o};
            if (j) {
                j.location = k;
                j.index = f;
                j.elem = e
            }
            return k
        }, contains:function (e, f) {
        return(f[0] || f.left) >= e.left && (f[0] || f.right) <= e.right && (f[1] || f.top) >= e.top && (f[1] || f.bottom) <= e.bottom
    }, modes:{intersect:function (e, f, j) {
        return this.contains(j, [e.pageX, e.pageY]) ? 1E9 : this.modes.overlap.apply(this, arguments)
    }, overlap:function (e, f, j) {
        return Math.max(0, Math.min(j.bottom, f.bottom) - Math.max(j.top, f.top)) * Math.max(0, Math.min(j.right, f.right) - Math.max(j.left, f.left))
    }, fit:function (e, f, j) {
        return this.contains(j, f) ? 1 : 0
    }, middle:function (e, f, j) {
        return this.contains(j, [f.left + f.width * 0.5, f.top + f.height * 0.5]) ? 1 : 0
    }}, sort:function (e, f) {
        return f.winner - e.winner || e.index - f.index
    }, tolerate:function (e) {
        var f, j, g, k, o, s, q = 0, r, v = e.interactions.length, t = [c.event.pageX, c.event.pageY], y = c.tolerance || c.modes[c.mode];
        do if (r = e.interactions[q]) {
            if (!r)return;
            r.drop = [];
            o = [];
            s = r.droppable.length;
            if (y)g = c.locate(r.proxy);
            f = 0;
            do if (j = r.droppable[f]) {
                k = a.data(j, c.datakey);
                if (j = k.location) {
                    k.winner = y ? y.call(c, c.event, g, j) : c.contains(j, t) ? 1 : 0;
                    o.push(k)
                }
            } while (++f < s);
            o.sort(c.sort);
            f = 0;
            do if (k = o[f])if (k.winner && r.drop.length < c.multi) {
                if (!k.active[q] && !k.anyactive)if (b.drag.hijack(c.event, "dropstart", e, q, k.elem)[0] !== false) {
                    k.active[q] = 1;
                    k.anyactive += 1
                } else k.winner = 0;
                k.winner && r.drop.push(k.elem)
            } else if (k.active[q] && k.anyactive == 1) {
                b.drag.hijack(c.event, "dropend",
                        e, q, k.elem);
                k.active[q] = 0;
                k.anyactive -= 1
            } while (++f < s)
        } while (++q < v);
        if (c.last && t[0] == c.last.pageX && t[1] == c.last.pageY)delete c.timer; else c.timer = setTimeout(function () {
            c.tolerate(e)
        }, c.delay);
        c.last = c.event
    }};
    b.dropinit = b.dropstart = b.dropend = c
})(jQuery);
(function (a) {
    function d(f) {
        f || (f = "en-US");
        f = f.replace(/_/, "-").toLowerCase();
        if (f.length > 3)f = f.substring(0, 3) + f.substring(3).toUpperCase();
        return f
    }

    var b = {}, c = {};
    a.localize = function (f, j) {
        function g(G, B, N) {
            N = N || 1;
            var ba;
            if (j && j.loadBase && N == 1) {
                y = {};
                ba = G + ".json" + a.localize.cachebuster;
                k(ba, G, B, N)
            } else if (N == 1) {
                y = {};
                g(G, B, 2)
            } else if (N == 2 && B.length >= 2) {
                ba = G + "-" + B.substring(0, 2) + ".json" + a.localize.cachebuster;
                k(ba, G, B, N)
            } else if (N == 3 && B.length >= 5) {
                ba = G + "-" + B.substring(0, 5) + ".json" + a.localize.cachebuster;
                k(ba, G, B, N)
            }
        }

        function k(G, B, N) {
            function ba(ja) {
                if (N === "en") {
                    console.log("$.localize has english");
                    a.localize.defaultLangData = ja
                }
                y = a.extend({}, a.localize.defaultLangData, y, ja);
                b[G] = y;
                q(y)
            }

            function L() {
                delete c[G]
            }

            if (j.pathPrefix)G = j.pathPrefix + "/" + G;
            if (b[G])q(b[G]); else if (c[G])c[G].done(ba); else c[G] = a.localize.jsonpCallback ? a.ajax({url:window.gsConfig.assetHost + G, async:true, dataType:"jsonp", jsonp:false, jsonpCallback:a.localize.jsonpCallback + N, data:null}).done(ba).fail(L) : a.ajax({url:G, async:true,
                dataType:"json", data:null}).done(ba).fail(L)
        }

        function o(G) {
            a.localize.data[f] = G;
            var B;
            t.each(function () {
                elem = a(this);
                key = elem.attr("data-translate-text");
                B = r(key, G);
                var N = elem.dataString();
                if (N)N.setString(B); else if (elem.data("localize-text") !== B) {
                    elem[0].tagName == "INPUT" ? elem.val(B) : elem.html(B);
                    elem.data("localize-text", B)
                }
            })
        }

        function s(G) {
            a.localize.data[f] = G;
            var B;
            t.each(function () {
                elem = a(this);
                key = elem.attr("data-translate-title");
                B = r(key, G);
                if (elem.data("localize-title") !== B) {
                    elem.attr("title",
                            B);
                    elem.data("localize-text", B)
                }
            })
        }

        function q(G) {
            if (j.callback)j.callback === "titleCallback" ? s(G) : j.callback(G, o); else o(G)
        }

        function r(G, B) {
            for (var N = G.split(/\./), ba = B; N.length > 0;)if (ba)ba = ba[N.shift()]; else return null;
            return ba
        }

        function v(G) {
            if (typeof G == "string")return"^" + G + "$"; else if (G.length) {
                for (var B = [], N = G.length; N--;)B.push(v(G[N]));
                return B.join("|")
            } else return G
        }

        var t = this, y = {};
        j = j || {};
        j.pathPrefix = "/locales";
        var E = d(j && j.language ? j.language : a.defaultLanguage);
        j.skipLanguage && E.match(v(j.skipLanguage)) ||
        g(f, E, 1)
    };
    a.fn.localize = a.localize;
    a.localize.data = {};
    a.localize.defaultLangData = {};
    a.localize.cachebuster = "";
    a.localize.ready = false;
    if (_.defined(window.gsConfig) && window.gsConfig.localeVersion)a.localize.cachebuster = "?v=" + window.gsConfig.localeVersion;
    a.localize.jsonpCallback = _.defined(window.gsConfig) && window.gsConfig.localeJSONP ? window.gsConfig.localeJSONP : false;
    if (_.defined(window.gsLocale)) {
        a.localize.data.gs = gsLocale;
        for (var e in gsLocale)if (gsLocale.hasOwnProperty(e))a.localize.defaultLangData[e] =
                gsLocale[e]
    }
    a.localize("gs", {language:"en", callback:function () {
        a.localize.ready = true;
        a.publish("gs.locale.ready")
    }});
    a.localize.getString = function (f) {
        return this.data.gs[f] || this.defaultLangData[f]
    };
    a.defaultLanguage = d(navigator.language ? navigator.language : navigator.userLanguage)
})(jQuery);
(function (a) {
    function d(b) {
        if (typeof b.data === "string") {
            var c = b.handler, e = b.data.toLowerCase().split(" ");
            b.handler = function (f) {
                if (!(this !== f.target && /textarea|select/i.test(f.target.nodeName) && f.target.type === "text")) {
                    var j = f.type !== "keypress" && a.hotkeys.specialKeys[f.which], g = String.fromCharCode(f.which).toLowerCase(), k = "", o = {};
                    if (f.altKey && j !== "alt")k += "alt+";
                    if (f.ctrlKey && j !== "ctrl")k += "ctrl+";
                    if (f.metaKey && !f.ctrlKey && j !== "meta")k += "meta+";
                    if (f.shiftKey && j !== "shift")k += "shift+";
                    if (j)o[k + j] = true;
                    else {
                        o[k + g] = true;
                        o[k + a.hotkeys.shiftNums[g]] = true;
                        if (k === "shift+")o[a.hotkeys.shiftNums[g]] = true
                    }
                    j = 0;
                    for (g = e.length; j < g; j++)if (o[e[j]])return c.apply(this, arguments)
                }
            }
        }
    }

    a.hotkeys = {version:"0.8", specialKeys:{8:"backspace", 9:"tab", 13:"return", 16:"shift", 17:"ctrl", 18:"alt", 19:"pause", 20:"capslock", 27:"esc", 32:"space", 33:"pageup", 34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right", 40:"down", 45:"insert", 46:"del", 96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9", 106:"*",
        107:"+", 109:"-", 110:".", 111:"/", 112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12", 144:"numlock", 145:"scroll", 191:"/", 224:"meta"}, shiftNums:{"`":"~", "1":"!", "2":"@", "3":"#", "4":"$", "5":"%", "6":"^", "7":"&", "8":"*", "9":"(", "0":")", "-":"_", "=":"+", ";":": ", "'":'"', ",":"<", ".":">", "/":"?", "\\":"|"}};
    a.each(["keydown", "keyup", "keypress"], function () {
        a.event.special[this] = {add:d}
    })
})(jQuery);
(function (a) {
    function d(e) {
        var f = e || window.event, j = [].slice.call(arguments, 1), g = 0, k = 0, o = 0;
        e = a.event.fix(f);
        e.type = "mousewheel";
        if (f.wheelDelta)g = f.wheelDelta / 120;
        if (f.detail)g = -f.detail / 3;
        o = g;
        if (f.axis !== undefined && f.axis === f.HORIZONTAL_AXIS) {
            o = 0;
            k = -1 * g
        }
        if (f.wheelDeltaY !== undefined)o = f.wheelDeltaY / 120;
        if (f.wheelDeltaX !== undefined)k = -1 * f.wheelDeltaX / 120;
        j.unshift(e, g, k, o);
        return(a.event.dispatch || a.event.handle).apply(this, j)
    }

    var b = ["DOMMouseScroll", "mousewheel"];
    if (a.event.fixHooks)for (var c = b.length; c;)a.event.fixHooks[b[--c]] =
            a.event.mouseHooks;
    a.event.special.mousewheel = {setup:function () {
        if (this.addEventListener)for (var e = b.length; e;)this.addEventListener(b[--e], d, false); else this.onmousewheel = d
    }, teardown:function () {
        if (this.removeEventListener)for (var e = b.length; e;)this.removeEventListener(b[--e], d, false); else this.onmousewheel = null
    }};
    a.fn.extend({mousewheel:function (e) {
        return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
    }, unmousewheel:function (e) {
        return this.unbind("mousewheel", e)
    }})
})(jQuery);
(function (a) {
    var d;
    a.fn.gsQueue = function (b, c) {
        d = this;
        b = a.extend({itemWidth:75, activeItemWidth:100, speed:800, scroll:40, dataKey:"queueSongID", activeIndex:0}, b);
        var e = a(".viewport", this), f = a("ol.queue", this), j = null, g = b.activeIndex, k = 0, o = 0, s = {floor:0, ceil:0}, q = false, r = false, v = {}, t = false, y = {}, E = 0, G = 0;
        this.initialize = function () {
            this.itemRenderer = b.itemRenderer || this.itemRenderer;
            if (c.length)r = true; else f.html("");
            e.scrollLeft(0);
            e.scroll(d.render);
            b.activeItemWidthDiff = b.activeItemWidth - b.itemWidth;
            g &&
            this.scrollTo(k);
            a(window).resize(d.onResize);
            this.onResize();
            return this
        };
        this.updateSettings = function (B) {
            B = B || {};
            b = a.extend(b, B);
            e.scrollLeft(0);
            e.scroll(d.render);
            b.activeItemWidthDiff = b.activeItemWidth - b.itemWidth;
            B.activeIndex && this.scrollTo(k);
            r = true;
            this.onResize();
            return this
        };
        this.destroy = function () {
            a(window).unbind("resize", this.onResize);
            e.unbind("scroll", this.render);
            delete d
        };
        this.onResize = function () {
            if (!t) {
                d.render();
                d.updateScrollbar()
            }
        };
        this.setItems = function (B, N) {
            var ba = c.length !==
                    (B || []).length;
            c = B ? B : [];
            if (ba || N)r = true;
            if (!t) {
                if (g > B.length || B.length == 0) {
                    this.render();
                    this.moveTo(B.length, true)
                } else this.render();
                ba && d.updateScrollbar()
            }
        };
        this.updateItem = function (B) {
            var N = B[b.dataKey];
            if (N && c[N])c[N] = B; else console.warn("jquery-queue. item has invalid dataKey. settings:", b.dataKey, "item key:", B[b.dataKey])
        };
        this.updateScrollbar = function () {
            var B = a("#queue").height(), N = b.itemWidth, ba = b.activeItemWidth, L = parseInt(e.css("padding-left"), 10);
            N = N * c.length + ba + L;
            a(f).width(Math.max(N,
                    e.outerWidth() - L));
            if (j)j.update({axis:"x", contentSize:N}); else j = a(d).tinyscrollbar({axis:"x", contentSize:N, animationOptions:{duration:50, easing:"linear"}});
            e.scrollLeft() > e.width() && e.scrollLeft() + e.width() > N && this.scrollTo(N);
            a("#queue").height() != B && a(window).resize()
        };
        this.setDisabled = function (B) {
            if (t != B) {
                t = _.orEqual(B, false);
                r = true;
                t ? f.html("") : d.onResize()
            }
        };
        this.setActive = function (B, N) {
            if (!(_.notDefined(B) || B < 0)) {
                N = _.orEqual(N, true);
                if (g !== B) {
                    g = B;
                    r = q = true;
                    if (t)return;
                    a(".queue-item-active",
                            f).removeClass("queue-item-active")
                }
                if (!t)if (N && g < c.length) {
                    this.moveTo(g, true);
                    this.render()
                }
            }
        };
        this.addToCache = function (B, N) {
            v[B] = N
        };
        this.getFromCache = function (B) {
            return v[B] || null
        };
        this.moveTo = function (B, N, ba) {
            ba = _.orEqual(ba, false);
            B = Math.max(0, Math.min(B, c.length - 1));
            B = this.calcOffset(B);
            ba || (B = Math.max(0, B - e.outerWidth(true) / 2));
            this.scrollTo(B, N)
        };
        this.scrollTo = function (B, N) {
            if (N || Math.abs(B - k) > e.width() * 2.5) {
                e.scrollLeft(B);
                d.updateScrollbar()
            } else e.stop().animate({scrollLeft:B}, "slow", "linear",
                    function () {
                        d.updateScrollbar()
                    });
            k = B;
            d.render()
        };
        this.render = function (B, N) {
            N = N === true ? true : false;
            var ba = +new Date;
            if (!(!N && ba - E < 60 && !r))if (!(!N && !r && !c.length)) {
                E = ba;
                ba = e.scrollLeft();
                var L = e.width(), ja = e.filter(":animated").length, K = Math.max(0, ba - L * 1.1), Z = Math.min(ba + L * 1.4, c.length * b.itemWidth), X = 0;
                L = 0;
                var da, W;
                s.floor = Math.floor(K / b.itemWidth);
                s.ceil = Math.ceil(Z / b.itemWidth);
                Z = c.length;
                if (r) {
                    f.html("");
                    v = {};
                    y = {}
                }
                for (da in v)if (v.hasOwnProperty(da)) {
                    W = a(v[da]);
                    K = W.data("queueIndex");
                    if (K > s.ceil ||
                            K < s.floor || K > Z || c[K][b.dataKey] != da) {
                        if (!y[da]) {
                            f[0].removeChild(W[0]);
                            X++
                        }
                        if (K > Z || c[K][b.dataKey] != da)delete v[da]; else y[da] = 1
                    }
                }
                X = document.createDocumentFragment();
                W = 0;
                K = s.floor;
                for (Z = s.ceil; K < Z; K++) {
                    if (da = d.getFromCache(c[K][b.dataKey])) {
                        q && a(da).css("left", d.calcOffset(K) + "px");
                        if (y[c[K][b.dataKey]]) {
                            X.appendChild(da);
                            W++;
                            delete y[c[K][b.dataKey]]
                        } else if (W) {
                            f.append(X);
                            X = document.createDocumentFragment();
                            W = 0
                        }
                    } else if (!da) {
                        da = d.itemWrapper(c[K], K);
                        X.appendChild(da);
                        W++;
                        L++
                    }
                    a(da).data("queueIndex",
                            K);
                    K == g && a(da).addClass("queue-item-active")
                }
                W && f.append(X);
                r = q = false;
                o = ba;
                if (ja) {
                    G && clearTimeout(G);
                    G = setTimeout(function () {
                        d.render()
                    }, 80)
                }
            }
        };
        this.calcOffset = function (B) {
            var N = B * b.itemWidth;
            if (B > g)N += b.activeItemWidthDiff;
            return N
        };
        this.calcIndex = function (B) {
            var N = B / b.itemWidth;
            if (N > g)N = (B - b.activeItemWidthDiff) / b.itemWidth;
            return Math.round(N)
        };
        this.itemWrapper = function (B, N) {
            var ba = this.calcOffset(N), L = "queue-item", ja;
            if (N == g)L += " queue-item-active";
            ja = d.getFromCache(B[b.dataKey]);
            if (!ja) {
                ja = d.itemRenderer(B,
                        N, c.length);
                var K = document.createElement("div");
                K.innerHTML = ['<li class="', L, '" style="left: ', ba, "px; z-index: ", 9E3 - N, '" rel="', N, '" data-queuesongid="', B.queueSongID, '"><div class="queue-item-content">', ja, "</div></li>"].join("");
                ja = K.firstChild;
                d.addToCache(B[b.dataKey], ja)
            }
            return ja
        };
        this.itemRenderer = function (B) {
            return["<span>", B.toString(), "</span>"].join("")
        };
        return this.initialize()
    }
})(jQuery);
(function (a) {
    var d = function () {
        var b = a("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body"), c = {width:b.width() - b[0].clientWidth, height:b.height() - b[0].clientHeight};
        b.remove();
        return c
    }();
    a.fn.slickbox = function (b, c) {
        var e = this;
        b = a.extend({itemWidth:160, itemHeight:100, verticalGap:"auto", minHorizontalGap:2, maxHorizontalGap:25, dragAs:false, dragItemID:false, displayRows:-1}, b);
        var f = a(this), j, g, k = {};
        c = c;
        var o = 0, s = 0, q = 0, r = 0, v =
                0, t = 0, y = 0, E = 0, G = 0, B = {floor:0, ceil:0}, N = false, ba = false;
        this.initialize = function () {
            this.html("");
            this.itemRenderer = b.itemRenderer || this.itemRenderer;
            this.itemClass = b.itemClass || "";
            this.listClass = b.listClass || "";
            j = a("<ol class='slickbox-tiles " + this.listClass + "' style='position: relative;'></ol>");
            f.append(j);
            r = b.padding ? b.padding : 0;
            g = b.scrollPane ? a(b.scrollPane) : f;
            y = b.scrollPane ? a(f[0]).offset().top : 0;
            this.setSort(b.sortFunction);
            a(g).scroll(e.render);
            a(g).scroll(e.render);
            e.calculateGaps();
            e.render();
            return this
        };
        this.destroy = function () {
            a(g).unbind("scroll", e.render);
            delete e
        };
        this.calculateGaps = function () {
            var L = Math.max(1, Math.floor((f.outerWidth() - r * 2 - b.minHorizontalGap) / (b.itemWidth + b.minHorizontalGap))), ja = Math.max(1, Math.floor((f.outerWidth() - r * 2 - b.maxHorizontalGap) / (b.itemWidth + b.maxHorizontalGap)));
            t = Math.max(L, ja);
            v = Math.ceil(c.length / t);
            q = b.horizontalGap ? b.horizontalGap : Math.floor((f.outerWidth() - r * 2 - b.itemWidth * t) / (t - 1));
            s = b.verticalGap == "auto" ? q : b.verticalGap;
            j.height(v * b.itemHeight +
                    (v - 1) * s + r * 2);
            G = 0;
            if (j.height() > g.height()) {
                g.css("overflow", "auto");
                G = Math.floor(d.width / t)
            }
        };
        a(window).resize(function () {
            e.calculateGaps();
            ba = true;
            e.render()
        });
        this.setItems = function (L) {
            c = L ? L : [];
            ba = true;
            this.calculateGaps();
            this.sorted = c.concat();
            if (this.sortFunction)this.sorted = this.sorted.sort(this.sortFunction);
            if (o > L.length || L.length == 0) {
                this.render();
                this.moveTo(L.length, true)
            } else this.render()
        };
        this.setSort = function (L) {
            this.sortFunction = L;
            this.sorted = c.concat();
            if (c && this.sortFunction)this.sorted =
                    this.sorted.sort(this.sortFunction);
            ba = true;
            this.render()
        };
        this.setActive = function (L, ja) {
            if (!(_.notDefined(L) || L < 0)) {
                ja = _.orEqual(ja, true);
                if (o !== L) {
                    o = L;
                    N = true;
                    ja && o < c.length && this.moveTo(o);
                    this.render()
                }
            }
        };
        this.addToCache = function (L, ja) {
            k[L] = ja
        };
        this.getFromCache = function (L) {
            return k[L] || null
        };
        this.moveTo = function (L, ja) {
            L = Math.max(0, Math.min(L, c.length - 1));
            this.scrollTo(e.topOffset(L), ja)
        };
        this.scrollTo = function (L, ja) {
            ja ? g.scrollLeft(L) : g.stop().animate({scrollTop:L}, "slow", "linear", function () {
                e.render()
            });
            E = L;
            e.render()
        };
        this.render = function () {
            e.renderTimeout && clearTimeout(this.renderTimeout);
            e.renderTimeout = setTimeout(function () {
                var L = Math.max(0, g.scrollTop() - y), ja = Math.max(L + 1, g.scrollTop() + g.height() - y);
                if (b.displayRows > -1) {
                    B.floor = Math.floor(L / (b.itemHeight + s)) * t;
                    B.ceil = b.displayRows * t
                } else {
                    B.floor = Math.floor(L / (b.itemHeight + s)) * t;
                    B.ceil = Math.ceil(ja / (b.itemHeight + s)) * t
                }
                if (ba) {
                    k = {};
                    j.html("")
                } else for (var K in k)if (k.hasOwnProperty(K)) {
                    el = k[K];
                    elTop = parseInt(a(el).css("top"), 10);
                    if (K >= e.sorted.length ||
                            elTop + b.itemHeight < L || elTop - b.itemHeight > ja) {
                        j.get(0).removeChild(el);
                        delete k[K]
                    }
                }
                for (i = B.floor; i < B.ceil && i < e.sorted.length; i++) {
                    if (L = e.getFromCache(i))N && a(L).css({left:e.leftOffset(i), top:e.topOffset(i)}); else {
                        L = e.itemWrapper(e.sorted[i], i);
                        j.append(L);
                        e.addToCache(i, L)
                    }
                    i == o && a(L).addClass("slickbox-item-active")
                }
                ba = N = false
            }, 60)
        };
        this.topOffset = function (L) {
            return Math.floor(L / t) * (b.itemHeight + s) + r
        };
        this.leftOffset = function (L) {
            return L % t * (b.itemWidth + (q - G)) + r
        };
        this.itemWrapper = function (L, ja) {
            var K =
                    "slickbox-item ", Z, X = "";
            if (ja == o)K += " slickbox-item-active";
            Z = e.itemRenderer(L, ja, c);
            K += a.isFunction(e.itemClass) ? " " + e.itemClass(L, ja, c) : " " + e.itemClass;
            if (b.dragItemID && L.hasOwnProperty(b.dragItemID))X = 'data-dragid="' + L[b.dragItemID] + '"';
            if (b.dragAs)X += 'data-dragtype="' + b.dragAs + '"';
            var da = document.createElement("div"), W = "";
            b.hidePositionInfo || (W = '<span class="position">' + (ja + 1) + " of " + c.length + "</span>");
            da.innerHTML = ['<li class="', K, '"', X, ' style="position:absolute; top: ' + e.topOffset(ja) + "px; left: " +
                    e.leftOffset(ja) + "px; z-index: " + (5E3 - ja) + '" rel="', ja, '"><div class="slickbox-item-content">', Z, "</div>", W, "</li>"].join("");
            return da.firstChild
        };
        this.itemRenderer = function (L) {
            return["<span>", L.toString(), "</span>"].join("")
        };
        this.setDisplayRows = function (L) {
            b.displayRows = L;
            this.render()
        };
        return this.initialize()
    }
})(jQuery);
(function (a) {
    a.fn.tinyscrollbar = function (d) {
        function b() {
            t.obj.bind("mousedown", c);
            v.obj.bind("mouseup", g);
            a(o).bind("keydown", e);
            if (k.scroll && this.addEventListener) {
                o[0].addEventListener("DOMMouseScroll", f, false);
                o[0].addEventListener("mousewheel", f, false)
            } else if (k.scroll)o[0].onmousewheel = f
        }

        function c(L) {
            a(o).focus();
            ba.start = y ? L.pageX : L.pageY;
            N.start = parseInt(t.obj.css(E));
            a(document).bind("mousemove", g);
            a(document).bind("mouseup", j);
            t.obj.bind("mouseup", j);
            return false
        }

        function e(L) {
            L = a.event.fix(L ||
                    window.event);
            if (!(L.ctrlKey || L.altKey || L.shiftKey && L.keyKode == 32)) {
                switch (L.keyCode) {
                    case 39:
                    case 40:
                        B += k.wheel;
                        L.preventDefault();
                        break;
                    case 37:
                    case 38:
                        B -= k.wheel;
                        L.preventDefault();
                        break;
                    case 34:
                        L = Math.min(v[k.axis] - t[k.axis], Math.max(0, parseInt(t.obj.css(E), 10) + 0.9 * t.obj.width()));
                        B = L * r.ratio;
                        break;
                    case 33:
                        L = Math.min(v[k.axis] - t[k.axis], Math.max(0, parseInt(t.obj.css(E), 10) - 0.9 * t.obj.width()));
                        B = L * r.ratio;
                        break;
                    case 35:
                        B = q[k.axis] - s[k.axis];
                        L.preventDefault();
                        break;
                    case 36:
                        B = 0;
                        L.preventDefault();
                        break
                }
                B = Math.min(q[k.axis] - s[k.axis], Math.max(0, B));
                t.obj.css(E, B / r.ratio);
                E == "top" ? s.obj.scrollTop(B) : s.obj.scrollLeft(B)
            }
        }

        function f(L) {
            a(o).focus();
            if (!(q.ratio >= 1)) {
                L = a.event.fix(L || window.event);
                L = L.originalEvent;
                var ja = B;
                B -= (L.wheelDelta ? L.wheelDelta / 120 : -L.detail / 3) * k.wheel;
                B = Math.min(q[k.axis] - s[k.axis], Math.max(0, B));
                if (B !== ja) {
                    t.obj.css(E, B / r.ratio);
                    E == "top" ? s.obj.scrollTop(B) : s.obj.scrollLeft(B)
                }
            }
        }

        function j() {
            a(document).unbind("mousemove", g);
            a(document).unbind("mouseup", j);
            t.obj.unbind("mouseup",
                    j);
            E == "top" ? s.obj.scrollTop(B) : s.obj.scrollLeft(B);
            return false
        }

        function g(L) {
            if (!(q.ratio >= 1) && r.ratio > 0) {
                N.now = Math.round(Math.min(v[k.axis] - t[k.axis], Math.max(0, N.start + ((y ? L.pageX : L.pageY) - ba.start))));
                B = Math.ceil(N.now * r.ratio);
                t.obj.css(E, N.now);
                E == "top" ? s.obj.stop().animate({scrollTop:B}, k.animationOptions) : s.obj.stop().animate({scrollLeft:B}, k.animationOptions)
            }
            return false
        }

        var k = a.extend({axis:"y", contentSize:false, wheel:40, scroll:true, size:"auto", sizethumb:"auto", onScroll:null, animationOptions:{}},
                d), o = a(this), s = {obj:a(".viewport", this)}, q = {obj:a(".overview", this)}, r = {obj:a(".scrollbar", this)}, v = {obj:a(".track", r.obj)}, t = {obj:a(".thumb", r.obj)}, y = k.axis == "x", E = y ? "left" : "top", G = y ? "Width" : "Height", B = 0, N = {start:0, now:0}, ba = {};
        if (this.length > 1) {
            this.each(function () {
                a(this).tinyscrollbar(k)
            });
            return this
        }
        this.initialize = function () {
            this.update();
            b();
            return this
        };
        this.update = function (L) {
            k = a.extend(k, L);
            s[k.axis] = s.obj[0]["offset" + G];
            q[k.axis] = k.contentSize && k.contentSize >= 0 ? k.contentSize : q.obj[0]["scroll" +
                    G];
            q.ratio = s[k.axis] / q[k.axis];
            r.obj.toggleClass("disable", q.ratio >= 1);
            s.obj.toggleClass("scrollable", q.ratio < 1);
            v[k.axis] = k.size == "auto" ? s[k.axis] - 10 : k.size;
            t[k.axis] = Math.min(v[k.axis], Math.max(0, k.sizethumb == "auto" ? v[k.axis] * q.ratio : k.sizethumb));
            r.ratio = k.sizethumb == "auto" ? q[k.axis] / v[k.axis] : (q[k.axis] - s[k.axis]) / (v[k.axis] - t[k.axis]);
            t.obj.removeAttr("style");
            ba.start = t.obj.offset()[E];
            L = G.toLowerCase();
            r.obj.css(L, v[k.axis]);
            v.obj.css(L, v[k.axis]);
            t.obj.css(L, Math.max(t[k.axis], 5));
            B = k.contentSize &&
                    k.contentSize >= 0 ? k.contentSize > s.obj["outer" + G]() ? -q.obj.offset()[E] : 0 : q.obj["outer" + G]() > s.obj["outer" + G]() ? -q.obj.offset()[E] : 0;
            this.redraw()
        };
        this.redraw = function () {
            B = Math.min(q[k.axis] - s[k.axis], Math.max(0, B));
            t.obj.css(E, B / r.ratio);
            E == "top" ? s.obj.scrollTop(B) : s.obj.scrollLeft(B)
        };
        return this.initialize()
    }
})(jQuery);
(function (a) {
    function d(c) {
        return typeof c == "object" ? c : {top:c, left:c}
    }

    var b = a.scrollTo = function (c, e, f) {
        a(window).scrollTo(c, e, f)
    };
    b.defaults = {axis:"xy", duration:parseFloat(a.fn.jquery) >= 1.3 ? 0 : 1};
    b.window = function () {
        return a(window)._scrollable()
    };
    a.fn._scrollable = function () {
        return this.map(function () {
            if (!(!this.nodeName || a.inArray(this.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"]) != -1))return this;
            var c = (this.contentWindow || this).document || this.ownerDocument || this;
            return a.browser.safari ||
                    c.compatMode == "BackCompat" ? c.body : c.documentElement
        })
    };
    a.fn.scrollTo = function (c, e, f) {
        if (typeof e == "object") {
            f = e;
            e = 0
        }
        if (typeof f == "function")f = {onAfter:f};
        if (c == "max")c = 9E9;
        f = a.extend({}, b.defaults, f);
        e = e || f.speed || f.duration;
        f.queue = f.queue && f.axis.length > 1;
        if (f.queue)e /= 2;
        f.offset = d(f.offset);
        f.over = d(f.over);
        return this._scrollable().each(function () {
            function j(v) {
                k.animate(q, e, f.easing, v && function () {
                    v.call(this, c, f)
                })
            }

            var g = this, k = a(g), o = c, s, q = {}, r = k.is("html,body");
            switch (typeof o) {
                case "number":
                case "string":
                    if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(o)) {
                        o =
                                d(o);
                        break
                    }
                    o = a(o, this);
                case "object":
                    if (o.is || o.style)s = (o = a(o)).offset()
            }
            a.each(f.axis.split(""), function (v, t) {
                var y = t == "x" ? "Left" : "Top", E = y.toLowerCase(), G = "scroll" + y, B = g[G], N = b.max(g, t);
                if (s) {
                    q[G] = s[E] + (r ? 0 : B - k.offset()[E]);
                    if (f.margin) {
                        q[G] -= parseInt(o.css("margin" + y)) || 0;
                        q[G] -= parseInt(o.css("border" + y + "Width")) || 0
                    }
                    q[G] += f.offset[E] || 0;
                    if (f.over[E])q[G] += o[t == "x" ? "width" : "height"]() * f.over[E]
                } else {
                    y = o[E];
                    q[G] = y.slice && y.slice(-1) == "%" ? parseFloat(y) / 100 * N : y
                }
                if (/^\d+$/.test(q[G]))q[G] = q[G] <= 0 ?
                        0 : Math.min(q[G], N);
                if (!v && f.queue) {
                    B != q[G] && j(f.onAfterFirst);
                    delete q[G]
                }
            });
            j(f.onAfter)
        }).end()
    };
    b.max = function (c, e) {
        var f = e == "x" ? "Width" : "Height", j = "scroll" + f;
        if (!a(c).is("html,body"))return c[j] - a(c)[f.toLowerCase()]();
        f = "client" + f;
        var g = c.ownerDocument.documentElement, k = c.ownerDocument.body;
        return Math.max(g[j], k[j]) - Math.min(g[f], k[f])
    }
})(jQuery);
(function (a) {
    a.fn.konami = function (d, b) {
        var c = this;
        b = a.extend({}, a.fn.konami.params, b);
        this.bind("konami", d).bind("keyup", function (e) {
            c.checkCode(e)
        });
        this.checkCode = function (e) {
            b.timeout && clearTimeout(b.timeout);
            if (e.keyCode == b.code[b.step])b.step++; else b.step = 0;
            if (b.step == b.code.length) {
                c.trigger("konami");
                b.step = 0
            } else if (b.step > 0)b.timeout = setTimeout(c.reset, b.delay)
        };
        this.reset = function () {
            b.step = 0
        };
        return this
    };
    a.fn.konami.params = {code:[38, 38, 40, 40, 37, 39, 37, 39, 66, 65], step:0, delay:500}
})(jQuery);
jQuery.cookie = function (a, d, b) {
    if (arguments.length > 1 && String(d) !== "[object Object]") {
        b = jQuery.extend({}, b);
        if (d === null || d === undefined)b.expires = -1;
        if (typeof b.expires === "number") {
            var c = b.expires, e = b.expires = new Date;
            e.setDate(e.getDate() + c)
        }
        d = String(d);
        return document.cookie = [encodeURIComponent(a), "=", b.raw ? d : encodeURIComponent(d), b.expires ? "; expires=" + b.expires.toUTCString() : "", b.path ? "; path=" + b.path : "", b.domain ? "; domain=" + b.domain : "", b.secure ? "; secure" : ""].join("")
    }
    b = d || {};
    e = b.raw ? function (f) {
        return f
    } :
            decodeURIComponent;
    return(c = RegExp("(?:^|; )" + encodeURIComponent(a) + "=([^;]*)").exec(document.cookie)) ? e(c[1]) : null
};
function QR8bitByte(a) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = a
}
QR8bitByte.prototype = {getLength:function () {
    return this.data.length
}, write:function (a) {
    for (var d = 0; d < this.data.length; d++)a.put(this.data.charCodeAt(d), 8)
}};
function QRCode(a, d) {
    this.typeNumber = a;
    this.errorCorrectLevel = d;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = []
}
QRCode.prototype = {addData:function (a) {
    this.dataList.push(new QR8bitByte(a));
    this.dataCache = null
}, isDark:function (a, d) {
    if (a < 0 || this.moduleCount <= a || d < 0 || this.moduleCount <= d)throw Error(a + "," + d);
    return this.modules[a][d]
}, getModuleCount:function () {
    return this.moduleCount
}, make:function () {
    if (this.typeNumber < 1) {
        var a = 1;
        for (a = 1; a < 40; a++) {
            for (var d = QRRSBlock.getRSBlocks(a, this.errorCorrectLevel), b = new QRBitBuffer, c = 0, e = 0; e < d.length; e++)c += d[e].dataCount;
            for (e = 0; e < this.dataList.length; e++) {
                d = this.dataList[e];
                b.put(d.mode, 4);
                b.put(d.getLength(), QRUtil.getLengthInBits(d.mode, a));
                d.write(b)
            }
            if (b.getLengthInBits() <= c * 8)break
        }
        this.typeNumber = a
    }
    this.makeImpl(false, this.getBestMaskPattern())
}, makeImpl:function (a, d) {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = Array(this.moduleCount);
    for (var b = 0; b < this.moduleCount; b++) {
        this.modules[b] = Array(this.moduleCount);
        for (var c = 0; c < this.moduleCount; c++)this.modules[b][c] = null
    }
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(a, d);
    this.typeNumber >= 7 && this.setupTypeNumber(a);
    if (this.dataCache == null)this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
    this.mapData(this.dataCache, d)
}, setupPositionProbePattern:function (a, d) {
    for (var b = -1; b <= 7; b++)if (!(a + b <= -1 || this.moduleCount <= a + b))for (var c = -1; c <= 7; c++)d + c <= -1 || this.moduleCount <= d + c || (this.modules[a + b][d + c] =
            0 <= b && b <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (b == 0 || b == 6) || 2 <= b && b <= 4 && 2 <= c && c <= 4 ? true : false)
}, getBestMaskPattern:function () {
    for (var a = 0, d = 0, b = 0; b < 8; b++) {
        this.makeImpl(true, b);
        var c = QRUtil.getLostPoint(this);
        if (b == 0 || a > c) {
            a = c;
            d = b
        }
    }
    return d
}, createMovieClip:function (a, d, b) {
    a = a.createEmptyMovieClip(d, b);
    this.make();
    for (d = 0; d < this.modules.length; d++) {
        b = d * 1;
        for (var c = 0; c < this.modules[d].length; c++) {
            var e = c * 1;
            if (this.modules[d][c]) {
                a.beginFill(0, 100);
                a.moveTo(e, b);
                a.lineTo(e + 1, b);
                a.lineTo(e + 1, b + 1);
                a.lineTo(e,
                        b + 1);
                a.endFill()
            }
        }
    }
    return a
}, setupTimingPattern:function () {
    for (var a = 8; a < this.moduleCount - 8; a++)if (this.modules[a][6] == null)this.modules[a][6] = a % 2 == 0;
    for (a = 8; a < this.moduleCount - 8; a++)if (this.modules[6][a] == null)this.modules[6][a] = a % 2 == 0
}, setupPositionAdjustPattern:function () {
    for (var a = QRUtil.getPatternPosition(this.typeNumber), d = 0; d < a.length; d++)for (var b = 0; b < a.length; b++) {
        var c = a[d], e = a[b];
        if (this.modules[c][e] == null)for (var f = -2; f <= 2; f++)for (var j = -2; j <= 2; j++)this.modules[c + f][e + j] = f == -2 || f == 2 ||
                j == -2 || j == 2 || f == 0 && j == 0 ? true : false
    }
}, setupTypeNumber:function (a) {
    for (var d = QRUtil.getBCHTypeNumber(this.typeNumber), b = 0; b < 18; b++) {
        var c = !a && (d >> b & 1) == 1;
        this.modules[Math.floor(b / 3)][b % 3 + this.moduleCount - 8 - 3] = c
    }
    for (b = 0; b < 18; b++) {
        c = !a && (d >> b & 1) == 1;
        this.modules[b % 3 + this.moduleCount - 8 - 3][Math.floor(b / 3)] = c
    }
}, setupTypeInfo:function (a, d) {
    for (var b = QRUtil.getBCHTypeInfo(this.errorCorrectLevel << 3 | d), c = 0; c < 15; c++) {
        var e = !a && (b >> c & 1) == 1;
        if (c < 6)this.modules[c][8] = e; else if (c < 8)this.modules[c + 1][8] = e; else this.modules[this.moduleCount -
                15 + c][8] = e
    }
    for (c = 0; c < 15; c++) {
        e = !a && (b >> c & 1) == 1;
        if (c < 8)this.modules[8][this.moduleCount - c - 1] = e; else if (c < 9)this.modules[8][15 - c - 1 + 1] = e; else this.modules[8][15 - c - 1] = e
    }
    this.modules[this.moduleCount - 8][8] = !a
}, mapData:function (a, d) {
    for (var b = -1, c = this.moduleCount - 1, e = 7, f = 0, j = this.moduleCount - 1; j > 0; j -= 2)for (j == 6 && j--; ;) {
        for (var g = 0; g < 2; g++)if (this.modules[c][j - g] == null) {
            var k = false;
            if (f < a.length)k = (a[f] >>> e & 1) == 1;
            if (QRUtil.getMask(d, c, j - g))k = !k;
            this.modules[c][j - g] = k;
            e--;
            if (e == -1) {
                f++;
                e = 7
            }
        }
        c += b;
        if (c < 0 ||
                this.moduleCount <= c) {
            c -= b;
            b = -b;
            break
        }
    }
}};
QRCode.PAD0 = 236;
QRCode.PAD1 = 17;
QRCode.createData = function (a, d, b) {
    d = QRRSBlock.getRSBlocks(a, d);
    for (var c = new QRBitBuffer, e = 0; e < b.length; e++) {
        var f = b[e];
        c.put(f.mode, 4);
        c.put(f.getLength(), QRUtil.getLengthInBits(f.mode, a));
        f.write(c)
    }
    for (e = a = 0; e < d.length; e++)a += d[e].dataCount;
    if (c.getLengthInBits() > a * 8)throw Error("code length overflow. (" + c.getLengthInBits() + ">" + a * 8 + ")");
    for (c.getLengthInBits() + 4 <= a * 8 && c.put(0, 4); c.getLengthInBits() % 8 != 0;)c.putBit(false);
    for (; ;) {
        if (c.getLengthInBits() >= a * 8)break;
        c.put(QRCode.PAD0, 8);
        if (c.getLengthInBits() >=
                a * 8)break;
        c.put(QRCode.PAD1, 8)
    }
    return QRCode.createBytes(c, d)
};
QRCode.createBytes = function (a, d) {
    for (var b = 0, c = 0, e = 0, f = Array(d.length), j = Array(d.length), g = 0; g < d.length; g++) {
        var k = d[g].dataCount, o = d[g].totalCount - k;
        c = Math.max(c, k);
        e = Math.max(e, o);
        f[g] = Array(k);
        for (var s = 0; s < f[g].length; s++)f[g][s] = 255 & a.buffer[s + b];
        b += k;
        s = QRUtil.getErrorCorrectPolynomial(o);
        k = (new QRPolynomial(f[g], s.getLength() - 1)).mod(s);
        j[g] = Array(s.getLength() - 1);
        for (s = 0; s < j[g].length; s++) {
            o = s + k.getLength() - j[g].length;
            j[g][s] = o >= 0 ? k.get(o) : 0
        }
    }
    for (s = g = 0; s < d.length; s++)g += d[s].totalCount;
    b =
            Array(g);
    for (s = k = 0; s < c; s++)for (g = 0; g < d.length; g++)if (s < f[g].length)b[k++] = f[g][s];
    for (s = 0; s < e; s++)for (g = 0; g < d.length; g++)if (s < j[g].length)b[k++] = j[g][s];
    return b
};
for (var QRMode = {MODE_NUMBER:1, MODE_ALPHA_NUM:2, MODE_8BIT_BYTE:4, MODE_KANJI:8}, QRErrorCorrectLevel = {L:1, M:0, Q:3, H:2}, QRMaskPattern = {PATTERN000:0, PATTERN001:1, PATTERN010:2, PATTERN011:3, PATTERN100:4, PATTERN101:5, PATTERN110:6, PATTERN111:7}, QRUtil = {PATTERN_POSITION_TABLE:[
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6,
        30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
], G15:1335, G18:7973, G15_MASK:21522, getBCHTypeInfo:function (a) {
    for (var d = a << 10; QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >=
            0;)d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
    return(a << 10 | d) ^ QRUtil.G15_MASK
}, getBCHTypeNumber:function (a) {
    for (var d = a << 12; QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0;)d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
    return a << 12 | d
}, getBCHDigit:function (a) {
    for (var d = 0; a != 0;) {
        d++;
        a >>>= 1
    }
    return d
}, getPatternPosition:function (a) {
    return QRUtil.PATTERN_POSITION_TABLE[a - 1]
}, getMask:function (a, d, b) {
    switch (a) {
        case QRMaskPattern.PATTERN000:
            return(d +
                    b) % 2 == 0;
        case QRMaskPattern.PATTERN001:
            return d % 2 == 0;
        case QRMaskPattern.PATTERN010:
            return b % 3 == 0;
        case QRMaskPattern.PATTERN011:
            return(d + b) % 3 == 0;
        case QRMaskPattern.PATTERN100:
            return(Math.floor(d / 2) + Math.floor(b / 3)) % 2 == 0;
        case QRMaskPattern.PATTERN101:
            return d * b % 2 + d * b % 3 == 0;
        case QRMaskPattern.PATTERN110:
            return(d * b % 2 + d * b % 3) % 2 == 0;
        case QRMaskPattern.PATTERN111:
            return(d * b % 3 + (d + b) % 2) % 2 == 0;
        default:
            throw Error("bad maskPattern:" + a);
    }
}, getErrorCorrectPolynomial:function (a) {
    for (var d = new QRPolynomial([1], 0), b =
            0; b < a; b++)d = d.multiply(new QRPolynomial([1, QRMath.gexp(b)], 0));
    return d
}, getLengthInBits:function (a, d) {
    if (1 <= d && d < 10)switch (a) {
        case QRMode.MODE_NUMBER:
            return 10;
        case QRMode.MODE_ALPHA_NUM:
            return 9;
        case QRMode.MODE_8BIT_BYTE:
            return 8;
        case QRMode.MODE_KANJI:
            return 8;
        default:
            throw Error("mode:" + a);
    } else if (d < 27)switch (a) {
        case QRMode.MODE_NUMBER:
            return 12;
        case QRMode.MODE_ALPHA_NUM:
            return 11;
        case QRMode.MODE_8BIT_BYTE:
            return 16;
        case QRMode.MODE_KANJI:
            return 10;
        default:
            throw Error("mode:" + a);
    } else if (d <
            41)switch (a) {
        case QRMode.MODE_NUMBER:
            return 14;
        case QRMode.MODE_ALPHA_NUM:
            return 13;
        case QRMode.MODE_8BIT_BYTE:
            return 16;
        case QRMode.MODE_KANJI:
            return 12;
        default:
            throw Error("mode:" + a);
    } else throw Error("type:" + d);
}, getLostPoint:function (a) {
    for (var d = a.getModuleCount(), b = 0, c = 0; c < d; c++)for (var e = 0; e < d; e++) {
        for (var f = 0, j = a.isDark(c, e), g = -1; g <= 1; g++)if (!(c + g < 0 || d <= c + g))for (var k = -1; k <= 1; k++)e + k < 0 || d <= e + k || g == 0 && k == 0 || j == a.isDark(c + g, e + k) && f++;
        if (f > 5)b += 3 + f - 5
    }
    for (c = 0; c < d - 1; c++)for (e = 0; e < d - 1; e++) {
        f = 0;
        a.isDark(c, e) && f++;
        a.isDark(c + 1, e) && f++;
        a.isDark(c, e + 1) && f++;
        a.isDark(c + 1, e + 1) && f++;
        if (f == 0 || f == 4)b += 3
    }
    for (c = 0; c < d; c++)for (e = 0; e < d - 6; e++)if (a.isDark(c, e) && !a.isDark(c, e + 1) && a.isDark(c, e + 2) && a.isDark(c, e + 3) && a.isDark(c, e + 4) && !a.isDark(c, e + 5) && a.isDark(c, e + 6))b += 40;
    for (e = 0; e < d; e++)for (c = 0; c < d - 6; c++)if (a.isDark(c, e) && !a.isDark(c + 1, e) && a.isDark(c + 2, e) && a.isDark(c + 3, e) && a.isDark(c + 4, e) && !a.isDark(c + 5, e) && a.isDark(c + 6, e))b += 40;
    for (e = f = 0; e < d; e++)for (c = 0; c < d; c++)a.isDark(c, e) && f++;
    b += Math.abs(100 * f / d / d - 50) /
            5 * 10;
    return b
}}, QRMath = {glog:function (a) {
    if (a < 1)throw Error("glog(" + a + ")");
    return QRMath.LOG_TABLE[a]
}, gexp:function (a) {
    for (; a < 0;)a += 255;
    for (; a >= 256;)a -= 255;
    return QRMath.EXP_TABLE[a]
}, EXP_TABLE:Array(256), LOG_TABLE:Array(256)}, i = 0; i < 8; i++)QRMath.EXP_TABLE[i] = 1 << i;
for (i = 8; i < 256; i++)QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
for (i = 0; i < 255; i++)QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
function QRPolynomial(a, d) {
    if (a.length == undefined)throw Error(a.length + "/" + d);
    for (var b = 0; b < a.length && a[b] == 0;)b++;
    this.num = Array(a.length - b + d);
    for (var c = 0; c < a.length - b; c++)this.num[c] = a[c + b]
}
QRPolynomial.prototype = {get:function (a) {
    return this.num[a]
}, getLength:function () {
    return this.num.length
}, multiply:function (a) {
    for (var d = Array(this.getLength() + a.getLength() - 1), b = 0; b < this.getLength(); b++)for (var c = 0; c < a.getLength(); c++)d[b + c] ^= QRMath.gexp(QRMath.glog(this.get(b)) + QRMath.glog(a.get(c)));
    return new QRPolynomial(d, 0)
}, mod:function (a) {
    if (this.getLength() - a.getLength() < 0)return this;
    for (var d = QRMath.glog(this.get(0)) - QRMath.glog(a.get(0)), b = Array(this.getLength()), c = 0; c < this.getLength(); c++)b[c] =
            this.get(c);
    for (c = 0; c < a.getLength(); c++)b[c] ^= QRMath.gexp(QRMath.glog(a.get(c)) + d);
    return(new QRPolynomial(b, 0)).mod(a)
}};
function QRRSBlock(a, d) {
    this.totalCount = a;
    this.dataCount = d
}
QRRSBlock.RS_BLOCK_TABLE = [
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70,
        44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12],
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1,
        75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    [6, 147,
        117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    [5, 145, 115, 10, 146, 116],
    [19,
        75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46,
        54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
];
QRRSBlock.getRSBlocks = function (a, d) {
    var b = QRRSBlock.getRsBlockTable(a, d);
    if (b == undefined)throw Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + d);
    for (var c = b.length / 3, e = [], f = 0; f < c; f++)for (var j = b[f * 3 + 0], g = b[f * 3 + 1], k = b[f * 3 + 2], o = 0; o < j; o++)e.push(new QRRSBlock(g, k));
    return e
};
QRRSBlock.getRsBlockTable = function (a, d) {
    switch (d) {
        case QRErrorCorrectLevel.L:
            return QRRSBlock.RS_BLOCK_TABLE[(a - 1) * 4 + 0];
        case QRErrorCorrectLevel.M:
            return QRRSBlock.RS_BLOCK_TABLE[(a - 1) * 4 + 1];
        case QRErrorCorrectLevel.Q:
            return QRRSBlock.RS_BLOCK_TABLE[(a - 1) * 4 + 2];
        case QRErrorCorrectLevel.H:
            return QRRSBlock.RS_BLOCK_TABLE[(a - 1) * 4 + 3];
        default:
            return
    }
};
function QRBitBuffer() {
    this.buffer = [];
    this.length = 0
}
QRBitBuffer.prototype = {get:function (a) {
    return(this.buffer[Math.floor(a / 8)] >>> 7 - a % 8 & 1) == 1
}, put:function (a, d) {
    for (var b = 0; b < d; b++)this.putBit((a >>> d - b - 1 & 1) == 1)
}, getLengthInBits:function () {
    return this.length
}, putBit:function (a) {
    var d = Math.floor(this.length / 8);
    this.buffer.length <= d && this.buffer.push(0);
    if (a)this.buffer[d] |= 128 >>> this.length % 8;
    this.length++
}};
(function (a) {
    a.fn.qrcode = function (d) {
        if (typeof d === "string")d = {text:d};
        d = a.extend({}, {render:"canvas", width:256, height:256, typeNumber:-1, correctLevel:QRErrorCorrectLevel.H, darkColor:"#000000"}, d);
        return this.each(function () {
            var b;
            if (d.render == "canvas") {
                b = new QRCode(d.typeNumber, d.correctLevel);
                b.addData(d.text);
                b.make();
                var c = document.createElement("canvas");
                c.width = d.width;
                c.height = d.height;
                for (var e = c.getContext("2d"), f = d.width / b.getModuleCount(), j = d.height / b.getModuleCount(), g = 0; g < b.getModuleCount(); g++)for (var k =
                        0; k < b.getModuleCount(); k++) {
                    e.fillStyle = b.isDark(g, k) ? d.darkColor : "#ffffff";
                    e.fillRect(k * f, g * j, f, j)
                }
                b = c
            } else {
                b = new QRCode(d.typeNumber, d.correctLevel);
                b.addData(d.text);
                b.make();
                c = a("<table></table>").css("width", d.width + "px").css("height", d.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", "#ffffff");
                e = d.width / b.getModuleCount();
                f = d.height / b.getModuleCount();
                for (j = 0; j < b.getModuleCount(); j++) {
                    g = a("<tr></tr>").css("height", f + "px").appendTo(c);
                    for (k = 0; k < b.getModuleCount(); k++)a("<td></td>").css("width",
                            e + "px").css("background-color", b.isDark(j, k) ? d.darkColor : "#ffffff").appendTo(g)
                }
                b = c
            }
            jQuery(b).appendTo(this)
        })
    }
})(jQuery);
(function (a) {
    function d(j) {
        if (e === j.target) {
            c();
            e = null
        } else if (j.target !== b.target) {
            c();
            e = null;
            a(this).unbind("click", d)
        } else e = j.target
    }

    var b, c, e, f;
    a(document).bind("contextmenu", c);
    a.fn.jjmenu = function (j, g, k, o) {
        function s(t, y, E, G, B) {
            function N() {
                var Y = a(K).css("display") == "none" ? true : false, m = false;
                if (B.orientation == "top" || B.orientation == "bottom")m = true;
                a(K).show().css("visibility", "hidden");
                a(".jj_menu_item:first", K).addClass("first_menu_item");
                a(".jj_menu_item:last", K).addClass("last_menu_item");
                m = a(K).offset().top;
                var P = a(K).offset().left;
                a(K).css({top:0, left:0});
                var la = parseInt(a(K).outerHeight(), 10), wa = Math.max(parseInt(a(K).outerWidth(), 10), 155), Aa = a("body").height();
                a("body").width();
                var za = m - a(window).scrollTop();
                Y && a(K).hide();
                a(K).css({left:P + "px"});
                var C = P;
                if (B.spill === "left") {
                    C = P - wa;
                    a(K).addClass("spill_left").prevAll(".jjmenu").each(function (S, ua) {
                        C -= a(ua).outerWidth() + 1
                    })
                } else if (P + wa > a("body").width()) {
                    C = P - wa;
                    if (a(K).attr("id") == "jjmenu_main" && B.xposition == "auto")C += a(G).outerWidth();
                    a(K).prev(".jjmenu").addClass("spill_left").each(function (S, ua) {
                        C -= a(ua).outerWidth() + 1
                    })
                } else if (a(K).attr("id").match("jjmenu_main_sub"))C += 2;
                Y = true;
                if (B.yposition == "auto" && B.xposition == "left") {
                    if (za + la + a(G).outerHeight() > Aa)Y = false
                } else if (za + la > Aa)Y = false;
                za = true;
                if (m - la < 0)za = false;
                if (B.yposition == "bottom")m += a(G).outerHeight();
                if (B.orientation == "auto" && (Y || !za || a(K).attr("id").match("jjmenu_main_sub")) || B.orientation == "bottom") {
                    if (m + la > Aa)m = a(window).height() - la; else {
                        if (B.yposition == "auto" &&
                                B.xposition == "left")m = m + a(G).outerHeight() + 1; else if (a(K).attr("id").match("jjmenu_main_sub"))m -= 7;
                        m = m
                    }
                    a(K).addClass("bottomOriented")
                } else {
                    m = m - la < 0 ? a(window).height() - la : a(K).attr("id").match("jjmenu_main_sub") ? m - la + 6 + a(G).outerHeight() : B.yposition == "mouse" ? m - la + 10 : m - la;
                    a(K).addClass("topOriented")
                }
                a(K).css({top:m + "px", left:C + "px", visibility:"visible"})
            }

            function ba(Y) {
                if (Y.hasOwnProperty("title") || _.defined(Y.customClass) && Y.customClass === "separator") {
                    var m = document.createElement("div");
                    a(m).append(a('<span class="icon"></span><span class="more"></span>'));
                    a(m).hover(function () {
                        a(this).addClass("jj_menu_item_hover")
                    }, function () {
                        a(this).removeClass("jj_menu_item_hover")
                    });
                    a(m).click(function () {
                        L(Y.action);
                        if (Y.type !== "sub") {
                            a("div[id^=jjmenu]").remove();
                            q.removeClass("active-context")
                        }
                        if (a.isFunction(Y.action.log) && r)Y.action.log(); else r && GS.getGuts().logEvent("contextMenuClick", {type:Y.action.type, text:Y.title})
                    });
                    var P = document.createElement("span");
                    a(m).append(P);
                    a(P).addClass("jj_menu_item_text");
                    switch (Y.type) {
                        case "sub":
                            m.className = "jj_menu_item jj_menu_item_more";
                            a(m).append(a('<span class="more"></span>'));
                            a(m).mouseenter(function () {
                                new s(t + "_sub", Y.src, E, this, B);
                                L(Y.action)
                            });
                            break;
                        default:
                            a(m).hover(function () {
                                a("div[id^=jjmenu_" + t + "_sub]").remove()
                            });
                            m.className = "jj_menu_item";
                            break
                    }
                    Y.customClass && Y.customClass.length > 0 && jQuery(m).addClass(Y.customClass);
                    if (Y.useEllipsis) {
                        a(P).addClass("ellipsis").attr("title", ja(Y.title));
                        a(P).html(ja(Y.title))
                    } else if (Y.title) {
                        a(P).html(ja(Y.title)).attr("title", ja(Y.title));
                        a(P).html(ja(Y.title))
                    }
                    a(Z).append(m)
                }
            }

            function L(Y) {
                if (Y)switch (Y.type) {
                    case "gourl":
                        if (Y.target) {
                            window.open(ja(Y.url),
                                    Y.target).focus();
                            return false
                        } else document.location.href = ja(Y.url);
                        break;
                    case "ajax":
                        a.getJSON(ja(Y.url), function (P) {
                            var la = eval(Y.callback);
                            typeof la == "function" && la(P)
                        });
                        break;
                    case "fn":
                        var m = eval(Y.callback);
                        typeof m == "function" && m(E);
                        break
                }
            }

            function ja(Y) {
                if (E)for (var m in E)Y = Y.replace("#" + m + "#", eval("myReplaces." + m));
                return Y
            }

            if (t == "main")window.triggerElement = G;
            B = function (Y, m) {
                var P = {show:"default", xposition:"right", yposition:"auto", orientation:"auto", append:document.body};
                if (!m)return P;
                if (!m.show)m.show = "default";
                var la = m.show;
                if (!m.xposition)m.xposition = "right";
                if (!m.yposition)m.yposition = "auto";
                if (!m.orientation)m.orientation = "auto";
                if (!m.spill)m.spill = "auto";
                if (!m.append)m.append = document.body;
                if (Y != "main") {
                    var wa = P;
                    wa.show = la;
                    wa.className = m.className;
                    wa.append = m.append
                }
                return Y == "main" ? m : wa
            }(t, B);
            var K = document.createElement("div"), Z = document.createElement("span");
            a("div[id^=jjmenu_" + t + "]").remove();
            a(K).append(Z);
            K.className = "jjmenu";
            if (B.className)K.className += " " + B.className;
            K.id = "jjmenu_" + t;
            a(K).css({display:"none"});
            if (!q.copy && q.is(".jjcopy")) {
                q.copy = q.clone();
                a(B.append).append(q.copy);
                q.copy.css({position:"absolute", "z-index":100001, top:q.offset().top, left:q.offset().left}).addClass("active-context copy")
            }
            a(B.append).append(K);
            (function () {
                if (a(G).length) {
                    var Y = a(G).offset(), m = Y.left, P = Y.top;
                    m = B.xposition == "left" || B.xposition == "auto" ? Y.left : Y.left + a(G).outerWidth();
                    if (B.xposition == "mouse")m = Math.max(q.pageX - 5, 0);
                    if (B.yposition == "mouse")P = Math.max(q.pageY - 5, 0);
                    a(K).css({position:"absolute",
                        top:P + "px", left:m + "px"})
                }
            })();
            var X = false;
            for (var da in y)if (y[da].get) {
                X = true;
                a.getJSON(ja(y[da].get), function (Y) {
                    for (var m in Y)ba(Y[m]);
                    N()
                });
                a(this).ajaxError(function () {
                    N()
                })
            } else if (y[da].getByService)y[da].getByService(function (Y) {
                y[da].dataHandler(Y, function (m) {
                    for (var P in m)ba(m[P]);
                    N()
                })
            }); else if (y[da].getByFunction) {
                var W = (typeof y[da].getByFunction == "function" ? y[da].getByFunction : eval(y[da].getByFunction))(E);
                for (var ra in W)ba(W[ra]);
                N()
            } else ba(y[da]);
            X || N();
            (function () {
                if (!B || B.show ==
                        "default")a(K).show(); else {
                    var Y = parseInt(B.speed);
                    Y = isNaN(Y) ? 500 : Y;
                    switch (B.show) {
                        case "fadeIn":
                            a(K).fadeIn(Y);
                            break;
                        case "slideDown":
                            a(K).slideDown(Y);
                            break;
                        case "slideToggle":
                            a(K).slideToggle(Y);
                            break;
                        default:
                            a(K).show();
                            break
                    }
                }
                if (a(K).is("#jjmenu_main")) {
                    a.publish("gs.menu.show");
                    a(K).bind("remove", function () {
                        a.publish("gs.menu.hide")
                    })
                }
            })()
        }

        if (!g || !g.length)return false;
        var q = this, r = false;
        q.pageX = j.pageX;
        q.pageY = j.pageY;
        j.preventDefault();
        b = j;
        c = function () {
            a(".active-context").removeClass("active-context");
            a("div[id^=jjmenu]").remove();
            q.copy && q.copy.remove()
        };
        c();
        if (o && o.shouldLog)r = o.shouldLog;
        if (typeof o.keepState !== "undefined") {
            var v = a(o.keepState);
            v.addClass("active-context");
            f && f[0] !== v[0] && f.blur();
            if (v[0].nodeName.toUpperCase() === "A") {
                v.attr("href");
                f = v
            } else f = undefined;
            v.trigger("focus").one("mousedown",function () {
                v.unbind("blur")
            }).one("blur", function () {
                        v.removeClass("active-context")
                    })
        }
        a(document).unbind("click contextmenu", d).bind("click contextmenu", d);
        a(this).parents().one("scroll", c);
        new s("main", g, k, this, o);
        return q
    }
})(jQuery);
var civicscience;
if (civicscience) {
    if (typeof civicscience != "object")throw Error('Non-object "civicscience" is already defined.');
} else civicscience = {};
if (civicscience.iqapi) {
    if (typeof civicscience.iqapi != "object")throw Error('Non-object "civicscience.iqapi" is already defined.');
} else civicscience.iqapi = {};
(function () {
    (function (a) {
        function d() {
            function f() {
                if (j == null) {
                    j = g.shift();
                    j != null && setTimeout(j, 0)
                }
            }

            var j = null, g = [];
            this.lock = function (k) {
                if (typeof k != "function")throw Error("Callback argument is not a function: " + k);
                g.push(k);
                f()
            };
            this.unlock = function () {
                j = null;
                f()
            }
        }

        var b = civicscience.iqapi, c = document.getElementsByTagName("HEAD")[0], e = function () {
            function f(s) {
                s = s;
                var q;
                for (q = 0; q < g.length; q++)s = 31 * s + g.charCodeAt(q) & 2147483647;
                return s
            }

            var j = {}, g = function () {
                var s = location.hostname;
                if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(s)) {
                    var q =
                            s.lastIndexOf(".");
                    if (q > 0) {
                        q = s.lastIndexOf(".", q - 1);
                        if (q > 0)s = s.substring(q + 1)
                    }
                }
                return s.toLowerCase()
            }(), k = function () {
                var s = Math.floor(Math.random() * 2147483647);
                return function () {
                    return s++ & 2147483647
                }
            }(), o = function (s, q) {
                this.send = function () {
                    var r = k();
                    j[r] = q;
                    s += s.indexOf("?") == -1 ? "?" : "&";
                    s += "reqId=" + encodeURIComponent(r) + "&callback=civicscience.iqapi.Request.acceptResponse&authv=1&hash=" + f(r);
                    r = document.createElement("SCRIPT");
                    r.type = "text/javascript";
                    r.src = s;
                    c.appendChild(r)
                }
            };
            o.acceptResponse = function (s) {
                if (s.reqId &&
                        s.hash == f(s.reqId)) {
                    var q = j[s.reqId];
                    delete j[s.reqId];
                    typeof q == "function" && q(s.data)
                }
            };
            return o
        }();
        b.Request = e;
        b.Session = function (f, j) {
            function g(K) {
                function Z(m) {
                    var P = this, la = m.uri;
                    if (la == null)throw Error("Missing answer value URI.");
                    var wa = m.text || "";
                    this.getQuestion = function () {
                        return X
                    };
                    this.getSession = function () {
                        return v
                    };
                    this.getId = function () {
                        return la
                    };
                    this.getText = function () {
                        return wa
                    };
                    this.select = function () {
                        var Aa;
                        for (Aa = 0; Aa < y.length && y[Aa] != X; Aa++);
                        if (Aa != y.length)Y = P
                    };
                    this.toString =
                            function () {
                                return"Option[qid=" + da + "; oid=" + la + "; text=" + wa + "]"
                            }
                }

                var X = this, da = K.id;
                if (da == null)throw Error("Missing question ID.");
                var W = K.text || "", ra = [], Y = null;
                (function () {
                    if (K.options != null) {
                        var m = {}, P;
                        for (P = 0; P < K.options.length; P++) {
                            var la = new Z(K.options[P]);
                            if (!m[la.getId()]) {
                                ra.push(la);
                                m[la.getId()] = true
                            }
                        }
                    }
                })();
                this.getSession = function () {
                    return v
                };
                this.getId = function () {
                    return da
                };
                this.getText = function () {
                    return W
                };
                this.getOptions = function () {
                    return[].concat(ra)
                };
                this.getOptionById = function (m) {
                    var P =
                            null, la;
                    for (la = 0; la < ra.length && P == null; la++)if (ra[la].getId() == m)P = ra[la];
                    return P
                };
                this.clearSelectedOption = function () {
                    var m;
                    for (m = 0; m < y.length && y[m] != X; m++);
                    if (m != y.length)Y = null
                };
                this.getSelectedOption = function () {
                    return Y
                };
                this.getResults = function (m) {
                    r(X, m)
                };
                this.toString = function () {
                    return"Question[qid=" + da + "; text=" + W + "]"
                }
            }

            function k(K, Z) {
                var X = K.getOptionById(Z.oid);
                if (X == null)throw Error("Missing or invalid selected option ID.");
                var da = {}, W = 0;
                (function () {
                    var ra = K.getOptions(), Y;
                    for (Y = 0; Y < ra.length; Y++)da[ra[Y].getId()] =
                            0;
                    if (Z.dist != null)for (oid in Z.dist)if (K.getOptionById(oid) != null) {
                        ra = Z.dist[oid] - 0;
                        if (ra < 0 || isNaN(ra))ra = 0;
                        da[oid] = ra;
                        W += ra
                    }
                })();
                this.getSession = function () {
                    return v
                };
                this.getQuestion = function () {
                    return K
                };
                this.getCommittedOption = function () {
                    return X
                };
                this.getTotal = function () {
                    return W
                };
                this.getCountForOption = function (ra) {
                    return da[ra.getId()] - 0
                }
            }

            function o(K) {
                if (K) {
                    ba = K.getQuestionsUrl;
                    L = K.putResponsesUrl;
                    ja = K.getResultsUrl
                } else ja = L = ba = null
            }

            function s(K) {
                var Z = null, X;
                for (X = 0; X < y.length && Z == null; X++)if (y[X].getId() ==
                        K)Z = y[X];
                for (X = 0; X < G.length && Z == null; X++)if (G[X].getId() == K)Z = G[X];
                return Z
            }

            function q(K) {
                if (typeof K != "function")throw Error("Callback argument is not a function: " + K);
                t.lock(function () {
                    if (y.length != 0 || E || !ba) {
                        t.unlock();
                        K([].concat(y))
                    } else(new e(ba, function (Z) {
                        if (Z.questions != null) {
                            var X;
                            for (X = 0; X < Z.questions.length; X++)try {
                                y.push(new g(Z.questions[X]))
                            } catch (da) {
                            }
                        }
                        E = y.length == 0;
                        Z.session != null && o(Z.session);
                        t.unlock();
                        K([].concat(y))
                    })).send()
                })
            }

            function r(K, Z) {
                if (typeof Z != "function")throw Error("Callback argument is not a function: " +
                        Z);
                t.lock(function () {
                    if (B[K.getId()]) {
                        t.unlock();
                        Z(K, B[K.getId()])
                    } else if (ja) {
                        var X;
                        for (X = 0; X < G.length && G[X] != K; X++);
                        if (X == G.length) {
                            t.unlock();
                            Z(K, null)
                        } else(new e(ja, function (da) {
                            var W = null;
                            if (da.results) {
                                var ra;
                                for (ra = 0; ra < da.results.length; ra++) {
                                    var Y = da.results[ra].qid;
                                    if (Y != null) {
                                        var m = s(Y);
                                        if (m != null)try {
                                            var P = new k(m, da.results[ra]);
                                            B[Y] = P;
                                            if (m == K)W = P
                                        } catch (la) {
                                        }
                                    }
                                }
                            }
                            da.session && o(da.session);
                            t.unlock(W);
                            Z(K, W)
                        })).send()
                    } else {
                        t.unlock();
                        Z(K, null)
                    }
                })
            }

            var v = this, t = new d, y = [], E = false, G = [], B = {},
                    N = "", ba = null, L = null, ja = null;
            if (a.rootUrl) {
                ba = a.rootUrl + "/iqapijs/api/getQuestions?tgt=" + encodeURIComponent(f);
                if (j)ba += "&test=1"
            }
            this.getQuestionById = s;
            this.setExternalUserId = function (K) {
                N = K + ""
            };
            this.getExternalUserId = function () {
                return N
            };
            this.getUnansweredQuestions = q;
            this.getNextUnansweredQuestion = function (K) {
                if (typeof K != "function")throw Error("Callback argument is not a function: " + K);
                q(function (Z) {
                    K(Z.shift())
                })
            };
            this.commit = function (K) {
                if (typeof K != "function")throw Error("Callback argument is not a function: " +
                        K);
                t.lock(function () {
                    var Z = [], X;
                    for (X = 0; X < y.length; X++) {
                        var da = y[X].getSelectedOption();
                        if (da != null) {
                            da = "q" + encodeURIComponent(y[X].getId()) + "=" + encodeURIComponent(da.getId());
                            Z.push(da)
                        }
                    }
                    if (Z.length == 0 || !L) {
                        t.unlock();
                        K([])
                    } else {
                        N != "" && Z.push("extuid=" + encodeURIComponent(N));
                        X = L;
                        X += X.indexOf("?") == -1 ? "?" : "&";
                        X += Z.join("&");
                        (new e(X, function (W) {
                            var ra = {}, Y;
                            if (W.qids)for (Y = 0; Y < W.qids.length; Y++)ra[W.qids[Y]] = true;
                            var m = [];
                            for (Y = 0; Y < y.length; Y++)if (ra[y[Y].getId()]) {
                                G.push(y[Y]);
                                m.push(y[Y]);
                                y.splice(Y--,
                                        1)
                            }
                            W.session != null && o(W.session);
                            t.unlock();
                            K(m)
                        })).send()
                    }
                })
            };
            this.getAnsweredQuestions = function () {
                return[].concat(G)
            }
        }
    })({rootUrl:"http://www.civicscience.com/"})
})();
if (typeof jQuery === "undefined")throw Error("SlickGrid requires jquery module to be loaded");
if (!jQuery.fn.drag)throw Error("SlickGrid requires jquery.event.drag module to be loaded");
(function (a) {
    function d() {
        var c = null;
        this.isActive = function (e) {
            return e ? c === e : c !== null
        };
        this.activate = function (e) {
            if (e !== c) {
                if (c !== null)throw"SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController";
                if (!e.commitCurrentEdit)throw"SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()";
                if (!e.cancelCurrentEdit)throw"SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()";
                c = e
            }
        };
        this.deactivate = function (e) {
            if (c !==
                    e)throw"SlickGrid.EditorLock.deactivate: specified editController is not the currently active one";
            c = null
        };
        this.commitCurrentEdit = function () {
            return c ? c.commitCurrentEdit() : true
        };
        this.cancelCurrentEdit = function () {
            return c ? c.cancelCurrentEdit() : true
        }
    }

    var b;
    a.extend(true, window, {Slick:{Grid:function (c, e, f, j) {
        function g() {
            da(a(j.scrollPane)[0].scrollTop, true)
        }

        function k() {
            var w = a("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body"),
                    A = {width:w.width() - w[0].clientWidth, height:w.height() - w[0].clientHeight};
            w.remove();
            return A
        }

        function o(w) {
            La.outerWidth(w);
            mb = w > $b - b.width
        }

        function s(w) {
            w && w.jquery && w.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function () {
                return false
            })
        }

        function q() {
            return lb.length
        }

        function r(w) {
            return lb[w]
        }

        function v() {
            function w() {
                a(this).addClass("ui-state-hover")
            }

            function A() {
                a(this).removeClass("ui-state-hover")
            }

            var J;
            $a.empty();
            u = {};
            var ea;
            for (J = 0; J < f.length; J++) {
                var aa = f[J] =
                        a.extend({}, Wb, f[J]);
                u[aa.id] = J;
                ea = aa.columnFormatter ? aa.columnFormatter(aa) : "<span class='slick-column-name'>" + aa.name + "</span>";
                ea = a("<div class='ui-state-default slick-header-column slick-header-column-" + aa.id + "' id='" + Fb + aa.id + "'/>").html(ea).width(aa.width - Gb).css({left:"10000px", "z-index":f.length - J}).attr("title", aa.toolTip || "").data("fieldId", aa.id).appendTo($a);
                aa.currentWidth = 0;
                if (j.enableColumnReorder || aa.sortable)ea.hover(w, A);
                if (aa.collapsable) {
                    ea.append("<a class='slick-collapse-indicator' />");
                    a(".slick-collapse-indicator").width(b.width - 1);
                    a(".slick-collapse-indicator").css("marginRight", -b.width);
                    a(".slick-collapse-indicator").css("marginLeft", b.width / 2 - 3.5 + 1)
                }
                aa.sortable && ea.append("<span class='slick-sort-indicator' />")
            }
            ja(D, H);
            E();
            j.enableColumnReorder && y()
        }

        function t() {
            $a.click(function (w) {
                if (!(a(w.target).hasClass("slick-resizable-handle") || a(w.target).hasClass("slick-collapse-indicator")))if (Da.onSort) {
                    w = a(w.target).closest(".slick-header-column");
                    if (w.length) {
                        w = f[Fa(w[0])];
                        if (w.sortable)if (j.editorLock.commitCurrentEdit()) {
                            if (w.id ===
                                    D)H = !H; else {
                                D = w.id;
                                H = true
                            }
                            ja(D, H);
                            Da.onSort(w, H)
                        }
                    }
                }
            })
        }

        function y() {
            $a.sortable({containment:"parent", axis:"x", cursor:"default", tolerance:"intersection", helper:"clone", placeholder:"slick-sortable-placeholder ui-state-default slick-header-column", forcePlaceholderSize:true, start:function (w, A) {
                a(A.helper).addClass("slick-header-column-active")
            }, beforeStop:function (w, A) {
                a(A.helper).removeClass("slick-header-column-active")
            }, stop:function (w) {
                if (j.editorLock.commitCurrentEdit()) {
                    for (var A = $a.sortable("toArray"),
                                 J = [], ea = 0; ea < A.length; ea++)J.push(f[N(A[ea].replace(Fb, ""))]);
                    X(J);
                    Da.onColumnsReordered && Da.onColumnsReordered();
                    w.stopPropagation();
                    E()
                } else a(this).sortable("cancel")
            }})
        }

        function E() {
            var w, A, J, ea, aa, ta, x, F, M;
            ea = $a.children();
            ea.find(".slick-resizable-handle").remove();
            ea.each(function (O) {
                if (f[O].resizable) {
                    if (x === undefined)x = O;
                    F = O
                }
            });
            ea.each(function (O, U) {
                a(U);
                x !== undefined && O < x || j.forceFitColumns && O >= F ? a("<div class='slick-resizable-handle' />").appendTo(U) : a("<div class='slick-resizable-handle'><span></span></div>").appendTo(U).bind("dragstart",
                        function (T) {
                            if (!j.editorLock.commitCurrentEdit())return false;
                            J = T.pageX;
                            a(this).parent().addClass("slick-header-column-active");
                            var na = T = null;
                            ea.each(function (Ba, I) {
                                f[Ba].previousWidth = a(I).outerWidth()
                            });
                            if (j.forceFitColumns) {
                                na = T = 0;
                                for (w = O + 1; w < ea.length; w++) {
                                    A = f[w];
                                    if (A.resizable) {
                                        if (na !== null)if (A.maxWidth)na += A.maxWidth - A.previousWidth; else na = null;
                                        T += A.previousWidth - Math.max(A.minWidth || 0, ob)
                                    }
                                }
                            }
                            var ga = 0, xa = 0;
                            for (w = 0; w <= O; w++) {
                                A = f[w];
                                if (A.resizable) {
                                    if (xa !== null)if (A.maxWidth)xa += A.maxWidth - A.previousWidth;
                                    else xa = null;
                                    ga += A.previousWidth - Math.max(A.minWidth || 0, ob)
                                }
                            }
                            if (T === null)T = 1E5;
                            if (ga === null)ga = 1E5;
                            if (na === null)na = 1E5;
                            if (xa === null)xa = 1E5;
                            ta = J + Math.min(T, xa);
                            aa = J - Math.min(ga, na);
                            M = La.width()
                        }).bind("drag",function (T, na) {
                            na.clientX = T.clientX;
                            na.clientY = T.clientY;
                            var ga, xa = Math.min(ta, Math.max(aa, T.pageX)) - J, Ba;
                            if (xa < 0) {
                                Ba = xa;
                                for (w = O; w >= 0; w--) {
                                    A = f[w];
                                    if (A.resizable) {
                                        ga = Math.max(A.minWidth || 0, ob);
                                        if (Ba && A.previousWidth + Ba < ga) {
                                            Ba += A.previousWidth - ga;
                                            L(w, ga, j.syncColumnCellResize)
                                        } else {
                                            L(w, A.previousWidth +
                                                    Ba, j.syncColumnCellResize);
                                            Ba = 0
                                        }
                                    }
                                }
                                if (j.forceFitColumns) {
                                    Ba = -xa;
                                    for (w = O + 1; w < ea.length; w++) {
                                        A = f[w];
                                        if (A.resizable)if (Ba && A.maxWidth && A.maxWidth - A.previousWidth < Ba) {
                                            Ba -= A.maxWidth - A.previousWidth;
                                            L(w, A.maxWidth, j.syncColumnCellResize)
                                        } else {
                                            L(w, A.previousWidth + Ba, j.syncColumnCellResize);
                                            Ba = 0
                                        }
                                    }
                                } else j.syncColumnCellResize && o(M + xa)
                            } else {
                                Ba = xa;
                                for (w = O; w >= 0; w--) {
                                    A = f[w];
                                    if (A.resizable)if (Ba && A.maxWidth && A.maxWidth - A.previousWidth < Ba) {
                                        Ba -= A.maxWidth - A.previousWidth;
                                        L(w, A.maxWidth, j.syncColumnCellResize)
                                    } else {
                                        L(w,
                                                A.previousWidth + Ba, j.syncColumnCellResize);
                                        Ba = 0
                                    }
                                }
                                if (j.forceFitColumns) {
                                    Ba = -xa;
                                    for (w = O + 1; w < ea.length; w++) {
                                        A = f[w];
                                        if (A.resizable) {
                                            ga = Math.max(A.minWidth || 0, ob);
                                            if (Ba && A.previousWidth + Ba < ga) {
                                                Ba += A.previousWidth - ga;
                                                L(w, ga, j.syncColumnCellResize)
                                            } else {
                                                L(w, A.previousWidth + Ba, j.syncColumnCellResize);
                                                Ba = 0
                                            }
                                        }
                                    }
                                } else j.syncColumnCellResize && o(M + xa)
                            }
                        }).bind("dragend", function () {
                            var T;
                            a(this).parent().removeClass("slick-header-column-active");
                            for (w = 0; w < ea.length; w++) {
                                A = f[w];
                                T = a(ea[w]).outerWidth();
                                A.previousWidth !==
                                        T && A.rerenderOnResize && m();
                                A.width = j.forceFitColumns ? Math.floor(A.width * (T - A.previousWidth) / A.previousWidth) + A.width : T;
                                !j.syncColumnCellResize && A.previousWidth !== T && L(w, T, true)
                            }
                            C();
                            Da.onColumnsResized && Da.onColumnsResized()
                        })
            })
        }

        function G() {
            function w(A) {
                return{start:{row:Math.min(A.start.row, A.end.row), cell:Math.min(A.start.cell, A.end.cell)}, end:{row:Math.max(A.start.row, A.end.row), cell:Math.max(A.start.cell, A.end.cell)}}
            }

            La.bind("draginit",function (A, J) {
                var ea = a(A.target).closest(".slick-cell");
                if (ea.length === 0)return false;
                if (parseInt(ea.parent().attr("row"), 10) >= Va())return false;
                ea = f[Fa(ea[0])];
                if (ea.behavior == "move" || ea.behavior == "selectAndMove")J.mode = 1; else if (j.enableCellRangeSelection)J.mode = 2; else return false;
                J.proxyOffsetX = 0;
                J.proxyOffsetY = 0
            }).bind("dragstart",function (A, J) {
                        if (!j.editorLock.commitCurrentEdit())return false;
                        var ea = parseInt(a(A.target).closest(".slick-row").attr("row"), 10), aa, ta, x = [];
                        aa = GS.Controllers.PageController.getActiveController();
                        if (J.mode == 1) {
                            p[ea] || a(A.target).click();
                            J.draggedItemsContext = aa.getPlayContext();
                            J.draggedItems = [];
                            J.draggedItemsSource = "grid";
                            if (J.draggedItemsContext.type == "playlist" && GS.page.activePage.playlist.isEditable(GS.user.UserID)) {
                                var F = GS.Models.Playlist.getOneFromCache(J.draggedItemsContext.data.playlistID), M = [];
                                ta = a(".gs_grid:last").controller().selectedRowIDs;
                                for (ea = 0; ea < ta.length; ea++) {
                                    var O = F.gridKeyLookup[ta[ea]];
                                    O && M.push(F.songs.indexOf(O))
                                }
                                if (F && M.length)J.deleteAction = {label:M.length > 1 ? "SHORTCUTS_DELETE_FROM_PLAYLIST_COUNT" : "SHORTCUTS_DELETE_FROM_PLAYLIST",
                                    labelParams:{count:M.length}, method:function () {
                                        F.removeSongs(M)
                                    }}
                            }
                            if (j.isFilter) {
                                var U = a("#page .gs_grid.songs").controller().dataView.rows;
                                U.sort(function (T, na) {
                                    return T - na
                                });
                                for (ea = 0; ea < U.length; ea++)J.draggedItems.push(U[ea]);
                                U = [];
                                for (ea = 0; ea < n.length; ea++)U.push(Ra(n[ea]))
                            } else {
                                n.sort(function (T, na) {
                                    return T - na
                                });
                                for (ea = 0; ea < n.length; ea++) {
                                    ta = Ra(n[ea]);
                                    J.draggedItems.push(ta);
                                    ta.queueSongID && x.push(ta.queueSongID)
                                }
                            }
                            J.draggedItemsType = J.draggedItemsType || _.guessDragType(J.draggedItems);
                            if (J.draggedItemsType ==
                                    "playlist" && J.draggedItems.length == 1)if ((F = GS.Models.Playlist.getOneFromCache(J.draggedItems[0].PlaylistID)) && F.UserID == GS.user.UserID)J.deleteAction = {label:"SHORTCUTS_DELETE_PLAYLIST", method:function () {
                                GS.user.deletePlaylist(F.PlaylistID, true)
                            }};
                            if (aa.Class.shortName === "NowPlayingController" && x.length)J.deleteAction = {label:x.length > 1 ? "SHORTCUTS_DELETE_NOW_PLAYING_COUNT" : "SHORTCUTS_DELETE_NOW_PLAYING", labelParams:{count:x.length}, method:function () {
                                GS.player.removeSongs(x)
                            }};
                            if (J.draggedItemsContext.type ==
                                    "user" && J.draggedItemsContext.data.userID == GS.user.UserID)J.deleteAction = {label:J.draggedItems.length > 1 ? "SHORTCUTS_DELETE_FROM_LIBRARY_COUNT" : "SHORTCUTS_DELETE_FROM_LIBRARY", labelParams:{count:J.draggedItems.length}, method:function () {
                                var T = [];
                                _.forEach(J.draggedItems, function (na) {
                                    T.push(na.SongID)
                                });
                                T.length && GS.user.removeFromLibrary(T)
                            }};
                            aa = a("<div class='slick-reorder-proxy'/>").css({position:"absolute", zIndex:"99999", "min-height":"50px", "padding-right":"50px"}).appendTo("body").mousewheel(_.globalDragProxyMousewheel);
                            if (j.dragProxy)j.isFilter && U ? aa.html(j.dragProxy(U)) : aa.html(j.dragProxy(J.draggedItems)); else aa.html('<div class="status"></div><span class="info"><span class="text">' + J.draggedItems.length + "</span></span>");
                            J.proxyOffsetX = Math.floor(aa.width() / 2) + 15;
                            J.proxyOffsetY = aa.height() * 2 - 52;
                            GS.getGuts().gaTrackEvent("grid", "dragStart");
                            a.publish("gs.drag.start", J);
                            return aa
                        }
                        if (J.mode == 2) {
                            aa = kb(J.startX - La.offset().left, J.startY - La.offset().top);
                            if (!jb(aa.row, aa.cell))return false;
                            J.range = {start:aa, end:{}};
                            aa = a("<div class='slick-selection'></div>").appendTo(La);
                            J.proxyOffsetX = Math.floor(aa.width() / 2) + 15;
                            J.proxyOffsetY = aa.height() * 2 - 52;
                            return aa
                        }
                    }).bind("drag",function (A, J) {
                        J.clientX = A.clientX;
                        J.clientY = A.clientY;
                        if (J.mode == 1) {
                            a(J.proxy).css("top", A.clientY - J.proxyOffsetY).css("left", A.clientX - J.proxyOffsetX);
                            var ea = false, aa = false;
                            _.forEach(J.drop, function (F) {
                                a.isFunction(F.updateDropOnDrag) && F.updateDropOnDrag(A, J);
                                if (!ea)if (a(F).within(A.clientX, A.clientY).length > 0)if (a(F).data("ignoreForOverDrop"))aa =
                                        true; else {
                                    aa = false;
                                    ea = true
                                }
                            });
                            aa || (ea ? a(J.proxy).addClass("valid").removeClass("invalid") : a(J.proxy).addClass("invalid").removeClass("valid"))
                        }
                        if (J.mode == 2) {
                            var ta = kb(A.clientX - La.offset().left, A.clientY - La.offset().top);
                            if (jb(ta.row, ta.cell)) {
                                J.range.end = ta;
                                var x = w(J.range);
                                ta = bc(x.start.row, x.start.cell);
                                x = bc(x.end.row, x.end.cell);
                                a(J.proxy).css({top:ta.top, left:ta.left, height:x.bottom - ta.top - 2, width:x.right - ta.left - 2})
                            }
                        }
                    }).bind("dragend", function (A, J) {
                        a(J.proxy).remove();
                        var ea = Na.within(A.clientX,
                                A.clientY).length > 0;
                        J.mode == 2 && ea && Da.onCellRangeSelected && Da.onCellRangeSelected(w(J.range));
                        a.publish("gs.drag.end", J)
                    })
        }

        function B() {
            var w = a("<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>").appendTo($a);
            Gb = w.outerWidth() - w.width();
            pc = w.outerHeight() - w.height();
            w.remove();
            var A = a("<div class='slick-row' />").appendTo(La);
            w = a("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(A);
            Tb = w.outerWidth() - w.width();
            Ib = w.outerHeight() - w.height();
            A.remove();
            ob = Math.max(Gb, Tb)
        }

        function N(w) {
            return u[w]
        }

        function ba() {
            var w, A, J, ea = {}, aa = Na.width();
            aa = nb ? aa - b.width : aa;
            var ta = 0;
            for (w = 0; w < f.length; w++) {
                A = f[w];
                J = A.currentWidth || A.width;
                ta += J;
                ea[A.id] = J
            }
            aa = aa - ta;
            if (aa !== 0) {
                var x = aa > 0, F = f.concat().sort(function (O) {
                    return x ? O.maxWidth ? -1 : 1 : O.minWidth !== ob && O.minWidth !== Wb.minWidth ? -1 : 1
                }), M;
                for (w = 0; w < F.length; w++) {
                    A = F[w];
                    J = A.currentWidth || A.width;
                    M = Math.ceil(aa * (J / ta));
                    if (!x && J + M < A.minWidth)M = Math.max(A.minWidth, 0) - J;
                    if (x && J + M > A.maxWidth)M = A.maxWidth -
                            J;
                    aa -= M;
                    ta -= J;
                    if (A.resizable)ea[A.id] += M
                }
                for (w = 0; w < f.length; w++)L(w, ea[f[w].id], true)
            }
        }

        function L(w, A, J) {
            f[w].currentWidth = A;
            $a.children().eq(w).css("width", A - Gb);
            J && a("." + Fb + " .c" + w).css("width", A - Tb + "px")
        }

        function ja(w, A) {
            D = w;
            H = A;
            var J = u[D];
            $a.children().removeClass("slick-header-column-sorted");
            $a.find(".slick-sort-indicator").removeClass("slick-sort-indicator-asc").removeClass("slick-sort-indicator-desc");
            if (J != null)$a.children().eq(J).addClass("slick-header-column-sorted").find(".slick-sort-indicator").addClass(H ?
                    "slick-sort-indicator-asc" : "slick-sort-indicator-desc")
        }

        function K() {
            return n.concat()
        }

        function Z(w) {
            var A, J, ea, aa, ta = {};
            for (A = 0; A < w.length; A++)ta[w[A]] = true;
            for (A = 0; A < n.length; A++) {
                J = n[A];
                Ma[J] && !ta[J] && a(Ma[J]).removeClass("ui-state-active selected")
            }
            aa = [];
            for (A = 0; A < w.length; A++) {
                J = w[A];
                ea = Ra(J);
                if (!a.isFunction(j.isSelectable) || j.isSelectable(ea)) {
                    Ma[J] && !p[J] && a(Ma[J]).addClass("ui-state-active selected");
                    aa.push(J)
                }
            }
            n = aa;
            p = ta
        }

        function X(w) {
            f = w;
            m();
            v();
            C();
            va()
        }

        function da(w, A) {
            var J = Ua;
            ub = Math.min(yb -
                    1, Math.floor(w / tb));
            Ua = Math.round(ub * Kb);
            var ea = w - Ua;
            if (Ua != J) {
                var aa = ua(ea);
                Y(aa.top, aa.bottom);
                fa()
            }
            if (ib != ea) {
                Eb = ib + J < ea + Ua ? 1 : -1;
                Na[0].scrollTop = Vb = Ya = ib = ea;
                Da.onViewportChanged && Da.onViewportChanged()
            }
            if (A) {
                clearTimeout(renderTimer);
                setTimeout(function () {
                    Da.render()
                }, 60)
            }
        }

        function W(w, A, J) {
            return J === null || J === undefined ? "" : J
        }

        function ra(w) {
            return w.formatter || j.formatterFactory && j.formatterFactory.getFormatter(w) || W
        }

        function Y(w) {
            for (var A in Ma)if ((A = parseInt(A, 10)) !== Ka && (A < w.top || A > w.bottom))P(A)
        }

        function m() {
            Ea && eb();
            La[0].innerHTML = "";
            Ma = {};
            ca = {};
            Xa += cb;
            cb = 0
        }

        function P(w) {
            var A = Ma[w];
            if (A) {
                La[0] && La[0].removeChild(A);
                delete Ma[w];
                delete ca[w];
                cb--;
                Xa++
            }
        }

        function la(w) {
            var A, J;
            if (w && w.length) {
                Eb = 0;
                var ea = [];
                A = 0;
                for (J = w.length; A < J; A++) {
                    Ea && Ka === A && eb();
                    Ma[w[A]] && ea.push(w[A])
                }
                if (cb > 10 && ea.length === cb)m(); else {
                    A = 0;
                    for (w = ea.length; A < w; A++)P(ea[A])
                }
            }
        }

        function wa(w) {
            la([w])
        }

        function Aa(w) {
            if (Ma[w]) {
                a(Ma[w]).children().each(function (A) {
                    var J = f[A];
                    if (w === Ka && A === Oa && Ea)Ea.loadValue(Ra(Ka)); else this.innerHTML =
                            Ra(w) ? ra(J)(w, A, Ra(w)[J.field], J, Ra(w)) : ""
                });
                Q(w)
            }
        }

        function za() {
            var w = j.rowHeight * (Va() + (j.enableAddRow ? 1 : 0) + (j.leaveSpaceForNewRows ? Cb - 1 : 0)) + zb * 2;
            j.autoHeight ? Na.height(w).css({"overflow-y":"hidden"}) : Na.height(Wa.innerHeight() - vb.outerHeight() - (j.showSecondaryHeaderRow ? hb.outerHeight() : 0));
            $b = Na.innerWidth();
            Za = Math.min(Na.innerHeight(), a("body").height());
            Cb = Math.ceil(Za / j.rowHeight);
            w = Na.parent().width();
            nb = Na.css("overflow-y") === "auto";
            o(w);
            if (j.scrollPane) {
                a(j.scrollPane).css({"overflow-y":"auto"});
                Wa.css({overflow:"visible", height:"auto", "overflow-y":"visible"});
                Na.css({overflow:"visible", height:"auto", "overflow-y":"visible"})
            }
            S();
            ma()
        }

        function C() {
            za();
            j.forceFitColumns && ba()
        }

        function S() {
            var w = Va() + (j.enableAddRow ? 1 : 0) + (j.leaveSpaceForNewRows ? Cb - 1 : 0), A = gb, J = Va();
            for (var ea in Ma)ea >= J && P(ea);
            ab = Math.max(j.rowHeight * w, Za - b.height);
            if (ab < Jb) {
                gb = tb = ab;
                yb = 1;
                Kb = 0
            } else {
                gb = Jb;
                tb = gb / 100;
                yb = Math.floor(ab / tb);
                Kb = (ab - gb) / (yb - 1)
            }
            if (gb !== A) {
                La.outerHeight(gb);
                Ya = Na[0].scrollTop
            }
            w = Ya + Ua <= ab - Za;
            if (ab ==
                    0 || Ya == 0)ub = Ua = 0; else w ? da(Ya + Ua) : da(ab - Za);
            gb != A && j.autoHeight && za()
        }

        function ua() {
            return{top:Math.floor((Ya + Ua) / j.rowHeight), bottom:Math.ceil((Ya + Ua + Za) / j.rowHeight) - 1}
        }

        function pa() {
            if (j.enableAsyncPostRender) {
                clearTimeout(qa);
                qa = setTimeout(ya, j.asyncPostRenderDelay)
            }
        }

        function Q(w) {
            delete ca[w];
            ka = Math.min(ka, w);
            sa = Math.max(sa, w);
            pa()
        }

        function fa() {
            for (var w in Ma)Ma[w].style.top = w * j.rowHeight - Ua + "px"
        }

        function ma() {
            var w = ua(), A = ua(void 0), J = Math.round(Za / j.rowHeight);
            A.top -= J;
            A.bottom += J;
            A.top =
                    Math.max(0, A.top);
            A.bottom = Math.min(j.enableAddRow ? Va() : Va() - 1, A.bottom);
            Y(A);
            var ea, aa = La[0], ta = cb;
            ea = [];
            var x = [], F = new Date, M = false, O = 0;
            for (J = A.top; J <= A.bottom; J++)if (!Ma[J]) {
                cb++;
                O++;
                x.push(J);
                var U = ea, T = J, na = Ra(T), ga = T < Va() && !na, xa = void 0, Ba = void 0;
                xa = "";
                var I = j.rowHeight - Ib;
                Ba = "slick-row " + (ga ? " loading" : "") + (p[T] ? " selected ui-state-active" : "") + (T % 2 == 1 ? " odd" : " even");
                if (j.rowCssClasses)Ba += " " + j.rowCssClasses(na, T, e.length);
                if (j.rowAttrs)xa = j.rowAttrs(na);
                U.push("<div class='ui-widget-content " +
                        Ba + "' row='" + T + "' style='top:" + (j.rowHeight * T - Ua + zb) + "px' " + xa + ">");
                ga = Ba = 0;
                for (var ha = f.length; ga < ha; ga++) {
                    var ia = f[ga];
                    Ba = 0;
                    if (ga == 0)Ba += zb;
                    xa = "slick-cell c" + ga + (ia.cssClass ? " " + ia.cssClass : "");
                    if (z && z[T] && z[T][ia.id])xa += " " + j.cellHighlightCssClass;
                    Ba = "height: " + I + "px; line-height:" + I + "px; width: " + ((f[ga].currentWidth || f[ga].width) - Ba - Tb) + "px;";
                    U.push("<div class='" + xa + "' style='" + Ba + "'>");
                    na && U.push(ra(ia)(T, ga, na[ia.field], ia, na));
                    U.push("</div>")
                }
                U.push("</div>");
                if (Ja && Ka === J)M = true;
                Ia++
            }
            A =
                    document.createElement("div");
            A.innerHTML = ea.join("");
            J = 0;
            for (ea = A.childNodes.length; J < ea; J++)Ma[x[J]] = aa.appendChild(A.firstChild);
            if (M)Ja = a(Ma[Ka]).children().eq(Oa)[0];
            if (cb - ta > 5)l = (new Date - F) / (cb - ta);
            ka = w.top;
            sa = Math.min(j.enableAddRow ? Va() : Va() - 1, w.bottom);
            pa();
            Vb = Ya;
            V = null
        }

        function va() {
            Ya = Na[0].scrollTop;
            var w = Na[0].scrollLeft, A = Math.abs(Ya - ib);
            if (w !== h) {
                h = w;
                vb[0].scrollLeft = w;
                hb[0].scrollLeft = w
            }
            if (A) {
                Eb = ib < Ya ? 1 : -1;
                ib = Ya;
                if (A < Za)da(Ya + Ua); else {
                    w = Ua;
                    ub = Math.min(yb - 1, Math.floor(Ya * ((ab - Za) /
                            (gb - Za)) * (1 / tb)));
                    Ua = Math.round(ub * Kb);
                    w != Ua && m()
                }
                V && clearTimeout(V);
                if (Math.abs(Vb - Ya) < Za)ma(); else V = setTimeout(ma, 50);
                Da.onViewportChanged && Da.onViewportChanged()
            }
        }

        function ya() {
            for (; ka <= sa;) {
                var w = Eb >= 0 ? ka++ : sa--, A = Ma[w];
                if (!(!A || ca[w] || w >= Va())) {
                    var J = Ra(w);
                    A = A.childNodes;
                    for (var ea = 0, aa = 0, ta = f.length; ea < ta; ++ea) {
                        var x = f[ea];
                        x.asyncPostRender && x.asyncPostRender(A[aa], ka, J, x);
                        ++aa
                    }
                    ca[w] = true;
                    qa = setTimeout(ya, j.asyncPostRenderDelay);
                    return
                }
            }
        }

        function Fa(w) {
            for (var A = 0; w && w.previousSibling;) {
                A++;
                w = w.previousSibling
            }
            return A
        }

        function Ha(w) {
            if (!(Da.onKeyDown && !j.editorLock.isActive() && Da.onKeyDown(w, Ka, Oa)))if (!w.shiftKey && !w.altKey && !w.ctrlKey && !w.metaKey)if (w.which == 27) {
                if (!j.editorLock.isActive())return;
                Xb()
            } else if (w.which == 37)ac(); else if (w.which == 39)bb(); else if (w.which == 38)Zb(); else if (w.which == 40)Pb(); else if (w.which == 9)Qb(); else if (w.which == 13) {
                if (j.editable)if (Ea)Ka === q() ? Pb() : Nb(); else j.editorLock.commitCurrentEdit() && Mb()
            } else return; else if (w.which == 9 && w.shiftKey && !w.ctrlKey &&
                    !w.metaKey && !w.altKey)hc(); else return;
            w.stopPropagation();
            w.preventDefault();
            try {
                w.originalEvent.keyCode = 0
            } catch (A) {
            }
        }

        function Pa(w) {
            var A = a(w.target).closest(".slick-cell", La);
            if (A.length !== 0)if (!(Ja === A[0] && Ea !== null)) {
                var J = parseInt(A.parent().attr("row"), 10), ea = Fa(A[0]), aa = null, ta = f[ea], x = Ra(J), F = 0;
                if (!(a.isFunction(j.isSelectable) && !j.isSelectable(x))) {
                    if (!Wa.is("slick-grid-focused")) {
                        a(".slick-grid-focused").removeClass("slick-grid-focused");
                        Wa.addClass("slick-grid-focused")
                    }
                    if (x && (ta.behavior ===
                            "selectAndMove" || ta.behavior === "select" || w.ctrlKey || w.metaKey || w.shiftKey)) {
                        if (aa = j.editorLock.commitCurrentEdit()) {
                            ta = K();
                            var M = a.inArray(J, ta);
                            if (J == ta && w.timeStamp - F > 750)w.ctrlKey = true;
                            if (j.disableMultiSelect || !w.ctrlKey && !w.metaKey && !w.shiftKey)ta = ta.length === 1 && ta[0] == J ? [] : [J]; else if (M === -1 && (w.ctrlKey || w.metaKey))ta.push(J); else if (M !== -1 && (w.ctrlKey || w.metaKey))ta = a.grep(ta, function (U) {
                                return U !== J
                            }); else if (ta.length && w.shiftKey) {
                                F = ta.pop();
                                var O = Math.min(J, F);
                                M = Math.max(J, F);
                                ta = [];
                                for (O =
                                             O; O <= M; O++)O !== F && ta.push(O);
                                ta.push(F)
                            }
                            cc();
                            Z(ta);
                            Da.onSelectedRowsChanged && Da.onSelectedRowsChanged();
                            if (x && Da.onClick)if (aa = j.editorLock.commitCurrentEdit())if (Da.onClick(w, J, ea)) {
                                w.stopPropagation();
                                w.preventDefault();
                                return
                            }
                        }
                        if (w.ctrlKey || w.metaKey || w.shiftKey)return
                    }
                    if (x && Da.onClick)if (aa = j.editorLock.commitCurrentEdit())if (Da.onClick(w, J, ea)) {
                        w.stopPropagation();
                        w.preventDefault()
                    }
                    if (j.enableCellNavigation && !f[ea].unselectable)if (aa === true || aa === null && j.editorLock.commitCurrentEdit()) {
                        Ob(J,
                                false);
                        Lb(A[0], J === q() || j.autoEdit)
                    }
                    F = w.timeStamp
                }
            }
        }

        function Qa(w) {
            var A = a(w.target).closest(".slick-cell", La);
            if (A.length !== 0)if (!(Ja === A[0] && Ea !== null)) {
                var J = parseInt(A.parent().attr("row"), 10);
                A = Fa(A[0]);
                var ea = null;
                if (Ra(J) && Da.onContextMenu)(ea = j.editorLock.commitCurrentEdit()) && Da.onContextMenu(w, J, A) && w.preventDefault()
            }
        }

        function sb(w) {
            var A = a(w.target).closest(".slick-cell", La);
            if (A.length !== 0)if (!(Ja === A[0] && Ea !== null)) {
                var J = parseInt(A.parent().attr("row"), 10);
                A = Fa(A[0]);
                var ea = null;
                if (Ra(J) &&
                        Da.onDblClick)(ea = j.editorLock.commitCurrentEdit()) && Da.onDblClick(w, J, A) && w.preventDefault();
                j.editable && gc(J, A, true)
            }
        }

        function wb(w) {
            if (Da.onHeaderContextMenu && j.editorLock.commitCurrentEdit()) {
                w.preventDefault();
                var A = a(w.target).closest(".slick-header-column", ".slick-header-columns");
                Da.onHeaderContextMenu(w, f[Da.getColumnIndex(A.data("fieldId"))])
            }
        }

        function fb(w) {
            var A = a(w.target).closest(".slick-header-column");
            if (A.length != 0) {
                A = f[Fa(A[0])];
                if (Da.onHeaderClick && j.editorLock.commitCurrentEdit()) {
                    w.preventDefault();
                    Da.onHeaderClick(w, A)
                }
            }
        }

        function db(w) {
            if (j.enableAutoTooltips) {
                w = a(w.target).closest(".slick-cell", La);
                if (w.length)if (w.innerWidth() < w[0].scrollWidth) {
                    var A = a.trim(w.text());
                    w.attr("title", j.toolTipMaxLength && A.length > j.toolTipMaxLength ? A.substr(0, j.toolTipMaxLength - 3) + "..." : A)
                } else w.attr("title", "")
            }
        }

        function jb(w, A) {
            return!(w < 0 || w >= Va() || A < 0 || A >= f.length)
        }

        function kb(w, A) {
            for (var J = Math.floor((A + Ua) / j.rowHeight), ea = 0, aa = 0, ta = 0; ta < f.length && aa < w; ta++) {
                aa += f[ta].width;
                ea++
            }
            return{row:J, cell:ea -
                    1}
        }

        function bc(w, A) {
            if (!jb(w, A))return null;
            for (var J = w * j.rowHeight - Ua, ea = J + j.rowHeight - 1, aa = 0, ta = 0; ta < A; ta++)aa += f[ta].width;
            return{top:J, left:aa, bottom:ea, right:aa + f[A].width}
        }

        function cc() {
            dc(null, false)
        }

        function pb() {
            a(Ja).attr("tabIndex", 0).attr("hideFocus", true);
            if (a.browser.msie && parseInt(a.browser.version) < 8) {
                Ja.setActive();
                var w = a(Ja).position().left, A = w + a(Ja).outerWidth(), J = Na.scrollLeft(), ea = J + Na.width();
                if (w < J)Na.scrollLeft(w); else A > ea && Na.scrollLeft(Math.min(w, A - Na[0].clientWidth))
            } else Ja.focus()
        }

        function dc(w, A) {
            if (Ja !== null) {
                eb();
                a(Ja).removeClass("selected")
            }
            Ja = w;
            if (Ja !== null) {
                Ka = parseInt(a(Ja).parent().attr("row"), 10);
                Oa = Fa(Ja);
                a(Ja).addClass("selected");
                if (j.editable && A && ec(Ka, Oa)) {
                    clearTimeout(R);
                    if (j.asyncEditorLoading)R = setTimeout(Mb, j.asyncEditorLoadDelay); else Mb()
                } else pb();
                Da.onCurrentCellChanged && Da.onCurrentCellChanged(fc())
            } else Oa = Ka = null
        }

        function Lb(w, A) {
            dc(w, A);
            w ? Z([Ka]) : Z([]);
            Da.onSelectedRowsChanged && Da.onSelectedRowsChanged()
        }

        function ec(w, A) {
            if (w < Va() && !Ra(w))return false;
            if (f[A].cannotTriggerInsert && w >= Va())return false;
            if (!(f[A].editor || j.editorFactory && j.editorFactory.getEditor(f[A])))return false;
            return true
        }

        function eb() {
            if (Ea) {
                Da.onBeforeCellEditorDestroy && Da.onBeforeCellEditorDestroy(Ea);
                Ea.destroy();
                Ea = null;
                if (Ja) {
                    a(Ja).removeClass("editable invalid");
                    if (Ra(Ka)) {
                        var w = f[Oa];
                        Ja.innerHTML = ra(w)(Ka, Oa, Ra(Ka)[w.field], w, Ra(Ka));
                        Q(Ka)
                    }
                }
                if (a.browser.msie)if (document.selection && document.selection.empty)document.selection.empty(); else if (window.getSelection)(w = window.getSelection()) &&
                        w.removeAllRanges && w.removeAllRanges();
                j.editorLock.deactivate(Ub)
            }
        }

        function Mb() {
            if (Ja) {
                if (!j.editable)throw"Grid : makeSelectedCellEditable : should never get called when options.editable is false";
                clearTimeout(R);
                if (ec(Ka, Oa))if (Da.onBeforeEditCell && Da.onBeforeEditCell(Ka, Oa, Ra(Ka)) === false)pb(); else {
                    j.editorLock.activate(Ub);
                    a(Ja).addClass("editable");
                    Ja.innerHTML = "";
                    var w = f[Oa], A = Ra(Ka);
                    Ea = new (w.editor || j.editorFactory && j.editorFactory.getEditor(w))({grid:Da, gridPosition:Db(Wa[0]), position:Db(Ja),
                        container:Ja, column:w, item:A || {}, commitChanges:Nb, cancelChanges:Xb});
                    A && Ea.loadValue(A);
                    qb = Ea.serializeValue();
                    if (Ea.position)if (Ja) {
                        var J;
                        if (Da.onCurrentCellPositionChanged) {
                            J = Yb();
                            Da.onCurrentCellPositionChanged(J)
                        }
                        if (Ea) {
                            J = J || Yb();
                            if (Ea.show && Ea.hide)J.visible ? Ea.show() : Ea.hide();
                            Ea.position && Ea.position(J)
                        }
                    }
                }
            }
        }

        function Nb() {
            if (j.editorLock.commitCurrentEdit()) {
                pb();
                j.autoEdit && Pb()
            }
        }

        function Xb() {
            j.editorLock.cancelCurrentEdit() && pb()
        }

        function Db(w) {
            var A = {top:w.offsetTop, left:w.offsetLeft, bottom:0,
                right:0, width:a(w).outerWidth(), height:a(w).outerHeight(), visible:true};
            A.bottom = A.top + A.height;
            A.right = A.left + A.width;
            for (var J = w.offsetParent; (w = w.parentNode) != document.body;) {
                if (A.visible && w.scrollHeight != w.offsetHeight && a(w).css("overflowY") != "visible")A.visible = A.bottom > w.scrollTop && A.top < w.scrollTop + w.clientHeight;
                if (A.visible && w.scrollWidth != w.offsetWidth && a(w).css("overflowX") != "visible")A.visible = A.right > w.scrollLeft && A.left < w.scrollLeft + w.clientWidth;
                A.left -= w.scrollLeft;
                A.top -= w.scrollTop;
                if (w === J) {
                    A.left += w.offsetLeft;
                    A.top += w.offsetTop;
                    J = w.offsetParent
                }
                A.bottom = A.top + A.height;
                A.right = A.left + A.width
            }
            return A
        }

        function Yb() {
            return Db(Ja)
        }

        function fc() {
            return Ja ? {row:Ka, cell:Oa} : null
        }

        function Ob(w, A) {
            var J = w * j.rowHeight, ea = (w + 1) * j.rowHeight - Za + (mb ? b.height : 0);
            if ((w + 1) * j.rowHeight > Ya + Za + Ua) {
                da(A ? J : ea);
                ma()
            } else if (w * j.rowHeight < Ya + Ua) {
                da(A ? ea : J);
                ma()
            }
        }

        function xb(w, A, J) {
            function ea() {
                return!f[Fa(this)].unselectable
            }

            if (Ja && j.enableCellNavigation)if (j.editorLock.commitCurrentEdit()) {
                var aa =
                        Ma[Ka + w], ta = aa && Oa + A >= 0 ? a(aa).children().eq(Oa + A).filter(ea) : null;
                if (ta && !ta.length) {
                    var x = a(aa).children().filter(function (F) {
                        return A > 0 ? F > Oa + A : F < Oa + A
                    }).filter(ea);
                    if (x && x.length)ta = A > 0 ? x.eq(0) : x.eq(x.length - 1)
                }
                if (J && w === 0 && !(aa && ta && ta.length))if (!ta || !ta.length) {
                    aa = Ma[Ka + w + (A > 0 ? 1 : -1)];
                    x = a(aa).children().filter(ea);
                    ta = A > 0 ? aa ? x.eq(0) : null : aa ? x.eq(x.length - 1) : null
                }
                if (aa && ta && ta.length) {
                    w = parseInt(a(aa).attr("row"), 10);
                    J = w == q();
                    Ob(w, !J);
                    Lb(ta[0], J || j.autoEdit);
                    Ea || pb()
                } else pb()
            }
        }

        function gc(w, A, J) {
            if (!(w >
                    Va() || w < 0 || A >= f.length || A < 0))if (!(!j.enableCellNavigation || f[A].unselectable))if (j.editorLock.commitCurrentEdit()) {
                Ob(w, false);
                var ea = null;
                f[A].unselectable || (ea = a(Ma[w]).children().eq(A)[0]);
                Lb(ea, J || w === Va() || j.autoEdit);
                Ea || pb()
            }
        }

        function Zb() {
            xb(-1, 0, false)
        }

        function Pb() {
            xb(1, 0, false)
        }

        function ac() {
            xb(0, -1, false)
        }

        function bb() {
            xb(0, 1, false)
        }

        function hc() {
            xb(0, -1, true)
        }

        function Qb() {
            xb(0, 1, true)
        }

        function mc() {
            var w = Ra(Ka), A = f[Oa];
            if (Ea) {
                if (Ea.isValueChanged()) {
                    var J = Ea.validate();
                    if (J.valid) {
                        if (Ka <
                                Va()) {
                            J = {row:Ka, cell:Oa, editor:Ea, serializedValue:Ea.serializeValue(), prevSerializedValue:qb, execute:function () {
                                this.editor.applyValue(w, this.serializedValue);
                                Aa(this.row)
                            }, undo:function () {
                                this.editor.applyValue(w, this.prevSerializedValue);
                                Aa(this.row)
                            }};
                            if (j.editCommandHandler) {
                                eb();
                                j.editCommandHandler(w, A, J)
                            } else {
                                J.execute();
                                eb()
                            }
                            Da.onCellChange && Da.onCellChange(Ka, Oa, w)
                        } else if (Da.onAddNewRow) {
                            J = {};
                            Ea.applyValue(J, Ea.serializeValue());
                            eb();
                            Da.onAddNewRow(J, A)
                        }
                        return!j.editorLock.isActive()
                    } else {
                        a(Ja).addClass("invalid");
                        a(Ja).stop(true, true).effect("highlight", {color:"red"}, 300);
                        Da.onValidationError && Da.onValidationError(Ja, J, Ka, Oa, A);
                        Ea.focus();
                        return false
                    }
                }
                eb()
            }
            return true
        }

        function nc() {
            eb();
            return true
        }

        var ic = {rowHeight:25, defaultColumnWidth:80, enableAddRow:false, leaveSpaceForNewRows:false, editable:false, autoEdit:true, enableCellNavigation:true, enableCellRangeSelection:false, enableColumnReorder:false, asyncEditorLoading:false, asyncEditorLoadDelay:100, forceFitColumns:false, enableAsyncPostRender:false, asyncPostRenderDelay:60,
                    autoHeight:false, editorLock:Slick.GlobalEditorLock, showSecondaryHeaderRow:false, secondaryHeaderRowHeight:25, syncColumnCellResize:false, enableAutoTooltips:true, toolTipMaxLength:null, formatterFactory:null, editorFactory:null, cellHighlightCssClass:"highlighted", cellFlashingCssClass:"flashing", multiSelect:true}, lb, Va, Ra, Wb = {name:"", resizable:true, sortable:false, collapsable:false, minWidth:30}, Jb, ab, gb, tb, yb, Kb, ub = 0, Ua = 0, zb = 0, Eb = 1, Wa, Fb = "slickgrid_" + Math.round(1E6 * Math.random()), Da = this, vb, $a, hb, jc, Na, La,
                Za, $b, mb, nb, Gb, pc, Tb, Ib, ob, Ka, Oa, Ja = null, Ea = null, qb, Ub, Ma = {}, cb = 0, Cb, ib = 0, Ya = 0, Vb = 0, h = 0, l = 10, n = [], p = {}, u = {}, z, D, H = true, R = null, V = null, qa = null, ca = {}, sa = null, ka = null, Ia = 0, Xa = 0;
        renderTimer = null;
        this.debug = function () {
            var w = "";
            w += "\ncounter_rows_rendered:  " + Ia;
            w += "\ncounter_rows_removed:  " + Xa;
            w += "\nrenderedRows:  " + cb;
            w += "\nnumVisibleRows:  " + Cb;
            w += "\nmaxSupportedCssHeight:  " + Jb;
            w += "\nn(umber of pages):  " + yb;
            w += "\n(current) page:  " + ub;
            w += "\npage height (ph):  " + tb;
            w += "\nscrollDir:  " + Eb;
            alert(w)
        };
        this.eval = function (w) {
            return eval(w)
        };
        (function () {
            Wa = a(c);
            lb = e;
            Va = lb.getLength || q;
            Ra = lb.getItem || r;
            Jb = 15E5;
            b = b || k();
            j = a.extend({}, ic, j);
            Wb.width = j.defaultColumnWidth;
            j.padding = zb = _.orEqual(j.padding, zb);
            va = _.orEqual(j.handleScroll, va);
            this.resizeAndRender = C;
            if (j.enableColumnReorder && !a.fn.sortable)throw Error('SlickGrid\'s "enableColumnReorder = true" option requires jquery-ui.sortable module to be loaded');
            Ub = {commitCurrentEdit:mc, cancelCurrentEdit:nc};
            Wa.empty().attr("tabIndex", 0).attr("hideFocus",
                    true).css("overflow", "hidden").css("outline", 0).addClass(Fb).addClass("ui-widget");
            /relative|absolute|fixed/.test(Wa.css("position")) || Wa.css("position", "relative");
            vb = a("<div class='slick-header ui-state-default' style='overflow:hidden;position:relative;' />").appendTo(Wa);
            $a = a("<div class='slick-header-columns' style='width:100000px; left:-10000px' />").appendTo(vb);
            hb = a("<div class='slick-header-secondary ui-state-default' style='overflow:hidden;position:relative;' />").appendTo(Wa);
            jc = a('<div class="slick-header-columns-secondary" style="width:100000px; height: ' +
                    j.secondaryHeaderRowHeight + 'px;" />').appendTo(hb);
            j.showSecondaryHeaderRow || hb.hide();
            Na = a("<div class='slick-viewport' tabIndex='0' hideFocus style='width:100%; overflow-x:hidden; outline:0; position:relative;'>").appendTo(Wa);
            Na.css({"overflow-y":"auto"});
            La = a("<div class='grid-canvas' tabIndex='0' hideFocus style='padding: " + zb + "px' />").appendTo(Na);
            B();
            Na.height(Wa.innerHeight() - vb.outerHeight() - (j.showSecondaryHeaderRow ? hb.outerHeight() : 0));
            s($a);
            Na.bind("selectstart.ui", function (w) {
                return a(w.target).is("input,textarea")
            });
            v();
            t();
            G();
            C();
            if (j.scrollPane) {
                a(j.scrollPane).bind("scroll", g).bind("resize", C);
                Wa.css({overflow:"visible", height:"auto", "overflow-y":"visible"});
                Na.css({overflow:"visible", height:"auto", "overflow-y":"visible"})
            } else Na.bind("scroll", va);
            Wa.bind("resize.slickgrid", C);
            La.bind("keydown", Ha);
            La.bind("click", Pa);
            La.bind("dblclick", sb);
            La.bind("contextmenu", Qa);
            La.bind("mouseover", db);
            vb.bind("contextmenu", wb);
            vb.bind("click", fb)
        })();
        a.extend(this, {slickGridVersion:"1.4.2", onSort:null, onHeaderContextMenu:null,
            onClick:null, onDblClick:null, onContextMenu:null, onKeyDown:null, onAddNewRow:null, onValidationError:null, onViewportChanged:null, onSelectedRowsChanged:null, onColumnsReordered:null, onColumnsResized:null, onBeforeMoveRows:null, onMoveRows:null, onCellChange:null, onBeforeEditCell:null, onBeforeCellEditorDestroy:null, onBeforeDestroy:null, onCurrentCellChanged:null, onCurrentCellPositionChanged:null, onCellRangeSelected:null, getColumns:function () {
                return f
            }, setColumns:X, getOptions:function () {
                return j
            }, setOptions:function (w) {
                if (j.editorLock.commitCurrentEdit()) {
                    eb();
                    j.enableAddRow !== w.enableAddRow && wa(Va());
                    j = a.extend(j, w);
                    ma()
                }
            }, setData:function (w, A) {
                m();
                lb = e = w;
                Va = lb.getLength || q;
                Ra = lb.getItem || r;
                A && da(0)
            }, destroy:function () {
                j.editorLock.cancelCurrentEdit();
                Da.onBeforeDestroy && Da.onBeforeDestroy();
                $a.sortable && $a.sortable("destroy");
                La.parents().unbind("scroll.slickgrid");
                Wa.unbind("resize.slickgrid");
                j.scrollPane && a(j.scrollPane).unbind("scroll").unbind("resize");
                La.unbind("draginit dragstart dragend drag");
                Wa.empty().removeClass(Fb)
            }, getColumnIndex:N, autosizeColumns:ba,
            updateCell:function (w, A) {
                if (Ma[w]) {
                    var J = a(Ma[w]).children().eq(A);
                    if (J.length !== 0) {
                        var ea = f[A], aa = Ra(w);
                        if (Ea && Ka === w && Oa === A)Ea.loadValue(aa); else {
                            J[0].innerHTML = aa ? ra(ea)(w, A, aa[ea.field], ea, aa) : "";
                            Q(w)
                        }
                    }
                }
            }, updateRow:Aa, removeRow:wa, removeRows:la, removeAllRows:m, render:ma, resizeAndRender:C, invalidate:function () {
                S();
                m();
                ma()
            }, setHighlightedCells:function (w) {
                var A, J, ea;
                for (var aa in Ma)for (A = 0; A < f.length; A++) {
                    ea = z && z[aa] && z[aa][f[A].id];
                    J = w && w[aa] && w[aa][f[A].id];
                    if (ea != J) {
                        J = a(Ma[aa]).children().eq(A);
                        J.length && J.toggleClass(j.cellHighlightCssClass)
                    }
                }
                z = w
            }, flashCell:function (w, A, J) {
                J = J || 100;
                if (Ma[w]) {
                    var ea = a(Ma[w]).children().eq(A), aa = function (ta) {
                        ta && setTimeout(function () {
                            ea.queue(function () {
                                ea.toggleClass(j.cellFlashingCssClass).dequeue();
                                aa(ta - 1)
                            })
                        }, J)
                    };
                    aa(4)
                }
            }, getViewport:ua, resizeCanvas:za, updateRowCount:S, getCellFromPoint:kb, getCellFromEvent:function (w) {
                w = a(w.target).closest(".slick-cell", La);
                if (!w.length)return null;
                return{row:w.parent().attr("row") | 0, cell:Fa(w[0])}
            }, getCurrentCell:fc, getCurrentCellNode:function () {
                return Ja
            },
            resetCurrentCell:cc, navigatePrev:hc, navigateNext:Qb, navigateUp:Zb, navigateDown:Pb, navigateLeft:ac, navigateRight:bb, gotoCell:gc, editCurrentCell:Mb, getCellEditor:function () {
                return Ea
            }, scrollRowIntoView:Ob, getSelectedRows:K, setSelectedRows:Z, getSecondaryHeaderRow:function () {
                return jc[0]
            }, showSecondaryHeaderRow:function () {
                j.showSecondaryHeaderRow = true;
                hb.slideDown("fast", za)
            }, hideSecondaryHeaderRow:function () {
                j.showSecondaryHeaderRow = false;
                hb.slideUp("fast", za)
            }, setSortColumn:ja, getCurrentCellPosition:Yb,
            getGridPosition:function () {
                return Db(Wa[0])
            }, getScrollWidth:function () {
                return b.width
            }, scrollTo:da, scrollPane:j.scrollPane, getEditController:function () {
                return Ub
            }})
    }, EditorLock:d, GlobalEditorLock:new d}})
})(jQuery);
function EventHelper() {
    this.handlers = [];
    this.subscribe = function (a) {
        this.handlers.push(a)
    };
    this.notify = function (a) {
        for (var d = 0; d < this.handlers.length; d++)this.handlers[d].call(this, a)
    };
    return this
}
(function (a) {
    a.extend(true, window, {Slick:{Data:{DataView:function () {
        function d() {
            s = {};
            newItems = [];
            for (var X = 0, da = 0, W = k.length; X < W; X++) {
                var ra = k[X][g];
                if (!(ra == undefined || !B && s[ra] != undefined)) {
                    newItems.push(k[X]);
                    s[ra] = da;
                    da++
                }
            }
            k = newItems
        }

        function b() {
            return{pageSize:N, pageNum:ba, totalRows:L}
        }

        function c(X, da) {
            y = da;
            E = X;
            G = null;
            da === false && k.reverse();
            k.sort(X);
            da === false && k.reverse();
            d();
            j()
        }

        function e(X, da) {
            y = da;
            G = X;
            E = null;
            var W = Object.prototype.toString;
            Object.prototype.toString = typeof X == "function" ?
                    X : function () {
                return this[X]
            };
            da === false && k.reverse();
            k.sort();
            Object.prototype.toString = W;
            da === false && k.reverse();
            d();
            j()
        }

        function f(X, da, W, ra) {
            var Y = [];
            q = null;
            for (var m = da.length, P = 0, la = 0, wa, Aa, za = 0, C = X.length; za < C; ++za) {
                wa = X[za];
                Aa = wa[g];
                if (!W || W(wa)) {
                    if (!N || P >= N * ba && P < N * (ba + 1)) {
                        if (la >= m || Aa != da[la][g] || ra && ra[Aa])Y[Y.length] = la;
                        da[la] = wa;
                        la++
                    }
                    P++
                }
            }
            m > la && da.splice(la, m - la);
            L = P;
            return Y
        }

        function j() {
            if (!t) {
                var X = o.length, da = L, W = f(k, o, r, v);
                if (N && L < ba * N) {
                    ba = Math.floor(L / N);
                    W = f(k, o, r, v)
                }
                v = null;
                da !=
                        L && Z.notify(b());
                X != o.length && ja.notify({previous:X, current:o.length});
                K.notify(W)
            }
        }

        var g = "id", k = [], o = [], s = {}, q = null, r = null, v = null, t = false, y = true, E = null, G = null, B = false, N = 0, ba = 0, L = 0, ja = new EventHelper, K = new EventHelper, Z = new EventHelper;
        return{rows:o, beginUpdate:function () {
            t = true
        }, endUpdate:function () {
            t = false;
            j()
        }, setPagingOptions:function (X) {
            if (X.pageSize != undefined)N = X.pageSize;
            if (X.pageNum != undefined)ba = Math.min(X.pageNum, Math.ceil(L / N));
            Z.notify(b());
            j()
        }, getPagingInfo:b, getItems:function () {
            return k
        },
            setItems:function (X, da) {
                if (da !== undefined)g = da;
                k = X;
                d();
                j()
            }, setFilter:function (X) {
                r = X;
                j()
            }, setAllowDuplicates:function (X) {
                B = X ? true : false;
                j()
            }, sort:c, fastSort:e, reSort:function () {
                if (E)c(E, y); else G && e(G, y)
            }, getIdxById:function (X) {
                return s[X]
            }, getRowById:function (X) {
                if (!q) {
                    q = {};
                    for (var da = 0, W = o.length; da < W; ++da)q[o[da][g]] = da
                }
                return q[X]
            }, getItemById:function (X) {
                return k[s[X]]
            }, getItemByIdx:function (X) {
                return k[X]
            }, refresh:j, updateItem:function (X, da) {
                if (!(s[X] === undefined || X !== da[g])) {
                    k[s[X]] = da;
                    v ||
                    (v = {});
                    v[X] = true;
                    j()
                }
            }, insertItem:function (X, da) {
                k.splice(X, 0, da);
                d();
                j()
            }, addItem:function (X) {
                k.push(X);
                d();
                j()
            }, addItems:function (X) {
                for (var da = 0; da < X.length; da++)k.push(X[da]);
                d();
                j()
            }, deleteItem:function (X) {
                if (s[X] === undefined)throw"Invalid id";
                k.splice(s[X], 1);
                d();
                j()
            }, onRowCountChanged:ja, onRowsChanged:K, onPagingInfoChanged:Z}
    }}}})
})(jQuery);
var hexcase = 0, b64pad = "";
function hex_md5(a) {
    return rstr2hex(rstr_md5(str2rstr_utf8(a)))
}
function b64_md5(a) {
    return rstr2b64(rstr_md5(str2rstr_utf8(a)))
}
function any_md5(a, d) {
    return rstr2any(rstr_md5(str2rstr_utf8(a)), d)
}
function hex_hmac_md5(a, d) {
    return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(d)))
}
function b64_hmac_md5(a, d) {
    return rstr2b64(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(d)))
}
function any_hmac_md5(a, d, b) {
    return rstr2any(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(d)), b)
}
function md5_vm_test() {
    return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
}
function rstr_md5(a) {
    return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
}
function rstr_hmac_md5(a, d) {
    var b = rstr2binl(a);
    if (b.length > 16)b = binl_md5(b, a.length * 8);
    for (var c = Array(16), e = Array(16), f = 0; f < 16; f++) {
        c[f] = b[f] ^ 909522486;
        e[f] = b[f] ^ 1549556828
    }
    b = binl_md5(c.concat(rstr2binl(d)), 512 + d.length * 8);
    return binl2rstr(binl_md5(e.concat(b), 640))
}
function rstr2hex(a) {
    for (var d = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", b = "", c, e = 0; e < a.length; e++) {
        c = a.charCodeAt(e);
        b += d.charAt(c >>> 4 & 15) + d.charAt(c & 15)
    }
    return b
}
function rstr2b64(a) {
    for (var d = "", b = a.length, c = 0; c < b; c += 3)for (var e = a.charCodeAt(c) << 16 | (c + 1 < b ? a.charCodeAt(c + 1) << 8 : 0) | (c + 2 < b ? a.charCodeAt(c + 2) : 0), f = 0; f < 4; f++)d += c * 8 + f * 6 > a.length * 8 ? b64pad : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >>> 6 * (3 - f) & 63);
    return d
}
function rstr2any(a, d) {
    var b = d.length, c, e, f, j, g, k = Array(Math.ceil(a.length / 2));
    for (c = 0; c < k.length; c++)k[c] = a.charCodeAt(c * 2) << 8 | a.charCodeAt(c * 2 + 1);
    var o = Math.ceil(a.length * 8 / (Math.log(d.length) / Math.log(2))), s = Array(o);
    for (e = 0; e < o; e++) {
        g = [];
        for (c = j = 0; c < k.length; c++) {
            j = (j << 16) + k[c];
            f = Math.floor(j / b);
            j -= f * b;
            if (g.length > 0 || f > 0)g[g.length] = f
        }
        s[e] = j;
        k = g
    }
    b = "";
    for (c = s.length - 1; c >= 0; c--)b += d.charAt(s[c]);
    return b
}
function str2rstr_utf8(a) {
    a = a.toString();
    for (var d = "", b = -1, c, e; ++b < a.length;) {
        c = a.charCodeAt(b);
        e = b + 1 < a.length ? a.charCodeAt(b + 1) : 0;
        if (55296 <= c && c <= 56319 && 56320 <= e && e <= 57343) {
            c = 65536 + ((c & 1023) << 10) + (e & 1023);
            b++
        }
        if (c <= 127)d += String.fromCharCode(c); else if (c <= 2047)d += String.fromCharCode(192 | c >>> 6 & 31, 128 | c & 63); else if (c <= 65535)d += String.fromCharCode(224 | c >>> 12 & 15, 128 | c >>> 6 & 63, 128 | c & 63); else if (c <= 2097151)d += String.fromCharCode(240 | c >>> 18 & 7, 128 | c >>> 12 & 63, 128 | c >>> 6 & 63, 128 | c & 63)
    }
    return d
}
function str2rstr_utf16le(a) {
    for (var d = "", b = 0; b < a.length; b++)d += String.fromCharCode(a.charCodeAt(b) & 255, a.charCodeAt(b) >>> 8 & 255);
    return d
}
function str2rstr_utf16be(a) {
    for (var d = "", b = 0; b < a.length; b++)d += String.fromCharCode(a.charCodeAt(b) >>> 8 & 255, a.charCodeAt(b) & 255);
    return d
}
function rstr2binl(a) {
    for (var d = Array(a.length >> 2), b = 0; b < d.length; b++)d[b] = 0;
    for (b = 0; b < a.length * 8; b += 8)d[b >> 5] |= (a.charCodeAt(b / 8) & 255) << b % 32;
    return d
}
function binl2rstr(a) {
    for (var d = "", b = 0; b < a.length * 32; b += 8)d += String.fromCharCode(a[b >> 5] >>> b % 32 & 255);
    return d
}
function binl_md5(a, d) {
    a[d >> 5] |= 128 << d % 32;
    a[(d + 64 >>> 9 << 4) + 14] = d;
    for (var b = 1732584193, c = -271733879, e = -1732584194, f = 271733878, j = 0; j < a.length; j += 16) {
        var g = b, k = c, o = e, s = f;
        b = md5_ff(b, c, e, f, a[j + 0], 7, -680876936);
        f = md5_ff(f, b, c, e, a[j + 1], 12, -389564586);
        e = md5_ff(e, f, b, c, a[j + 2], 17, 606105819);
        c = md5_ff(c, e, f, b, a[j + 3], 22, -1044525330);
        b = md5_ff(b, c, e, f, a[j + 4], 7, -176418897);
        f = md5_ff(f, b, c, e, a[j + 5], 12, 1200080426);
        e = md5_ff(e, f, b, c, a[j + 6], 17, -1473231341);
        c = md5_ff(c, e, f, b, a[j + 7], 22, -45705983);
        b = md5_ff(b, c, e, f, a[j + 8], 7,
                1770035416);
        f = md5_ff(f, b, c, e, a[j + 9], 12, -1958414417);
        e = md5_ff(e, f, b, c, a[j + 10], 17, -42063);
        c = md5_ff(c, e, f, b, a[j + 11], 22, -1990404162);
        b = md5_ff(b, c, e, f, a[j + 12], 7, 1804603682);
        f = md5_ff(f, b, c, e, a[j + 13], 12, -40341101);
        e = md5_ff(e, f, b, c, a[j + 14], 17, -1502002290);
        c = md5_ff(c, e, f, b, a[j + 15], 22, 1236535329);
        b = md5_gg(b, c, e, f, a[j + 1], 5, -165796510);
        f = md5_gg(f, b, c, e, a[j + 6], 9, -1069501632);
        e = md5_gg(e, f, b, c, a[j + 11], 14, 643717713);
        c = md5_gg(c, e, f, b, a[j + 0], 20, -373897302);
        b = md5_gg(b, c, e, f, a[j + 5], 5, -701558691);
        f = md5_gg(f, b, c, e, a[j +
                10], 9, 38016083);
        e = md5_gg(e, f, b, c, a[j + 15], 14, -660478335);
        c = md5_gg(c, e, f, b, a[j + 4], 20, -405537848);
        b = md5_gg(b, c, e, f, a[j + 9], 5, 568446438);
        f = md5_gg(f, b, c, e, a[j + 14], 9, -1019803690);
        e = md5_gg(e, f, b, c, a[j + 3], 14, -187363961);
        c = md5_gg(c, e, f, b, a[j + 8], 20, 1163531501);
        b = md5_gg(b, c, e, f, a[j + 13], 5, -1444681467);
        f = md5_gg(f, b, c, e, a[j + 2], 9, -51403784);
        e = md5_gg(e, f, b, c, a[j + 7], 14, 1735328473);
        c = md5_gg(c, e, f, b, a[j + 12], 20, -1926607734);
        b = md5_hh(b, c, e, f, a[j + 5], 4, -378558);
        f = md5_hh(f, b, c, e, a[j + 8], 11, -2022574463);
        e = md5_hh(e, f, b, c, a[j +
                11], 16, 1839030562);
        c = md5_hh(c, e, f, b, a[j + 14], 23, -35309556);
        b = md5_hh(b, c, e, f, a[j + 1], 4, -1530992060);
        f = md5_hh(f, b, c, e, a[j + 4], 11, 1272893353);
        e = md5_hh(e, f, b, c, a[j + 7], 16, -155497632);
        c = md5_hh(c, e, f, b, a[j + 10], 23, -1094730640);
        b = md5_hh(b, c, e, f, a[j + 13], 4, 681279174);
        f = md5_hh(f, b, c, e, a[j + 0], 11, -358537222);
        e = md5_hh(e, f, b, c, a[j + 3], 16, -722521979);
        c = md5_hh(c, e, f, b, a[j + 6], 23, 76029189);
        b = md5_hh(b, c, e, f, a[j + 9], 4, -640364487);
        f = md5_hh(f, b, c, e, a[j + 12], 11, -421815835);
        e = md5_hh(e, f, b, c, a[j + 15], 16, 530742520);
        c = md5_hh(c, e, f,
                b, a[j + 2], 23, -995338651);
        b = md5_ii(b, c, e, f, a[j + 0], 6, -198630844);
        f = md5_ii(f, b, c, e, a[j + 7], 10, 1126891415);
        e = md5_ii(e, f, b, c, a[j + 14], 15, -1416354905);
        c = md5_ii(c, e, f, b, a[j + 5], 21, -57434055);
        b = md5_ii(b, c, e, f, a[j + 12], 6, 1700485571);
        f = md5_ii(f, b, c, e, a[j + 3], 10, -1894986606);
        e = md5_ii(e, f, b, c, a[j + 10], 15, -1051523);
        c = md5_ii(c, e, f, b, a[j + 1], 21, -2054922799);
        b = md5_ii(b, c, e, f, a[j + 8], 6, 1873313359);
        f = md5_ii(f, b, c, e, a[j + 15], 10, -30611744);
        e = md5_ii(e, f, b, c, a[j + 6], 15, -1560198380);
        c = md5_ii(c, e, f, b, a[j + 13], 21, 1309151649);
        b = md5_ii(b,
                c, e, f, a[j + 4], 6, -145523070);
        f = md5_ii(f, b, c, e, a[j + 11], 10, -1120210379);
        e = md5_ii(e, f, b, c, a[j + 2], 15, 718787259);
        c = md5_ii(c, e, f, b, a[j + 9], 21, -343485551);
        b = safe_add(b, g);
        c = safe_add(c, k);
        e = safe_add(e, o);
        f = safe_add(f, s)
    }
    return Array(b, c, e, f)
}
function md5_cmn(a, d, b, c, e, f) {
    return safe_add(bit_rol(safe_add(safe_add(d, a), safe_add(c, f)), e), b)
}
function md5_ff(a, d, b, c, e, f, j) {
    return md5_cmn(d & b | ~d & c, a, d, e, f, j)
}
function md5_gg(a, d, b, c, e, f, j) {
    return md5_cmn(d & c | b & ~c, a, d, e, f, j)
}
function md5_hh(a, d, b, c, e, f, j) {
    return md5_cmn(d ^ b ^ c, a, d, e, f, j)
}
function md5_ii(a, d, b, c, e, f, j) {
    return md5_cmn(b ^ (d | ~c), a, d, e, f, j)
}
function safe_add(a, d) {
    var b = (a & 65535) + (d & 65535);
    return(a >> 16) + (d >> 16) + (b >> 16) << 16 | b & 65535
}
function bit_rol(a, d) {
    return a << d | a >>> 32 - d
}
hexcase = 0;
b64pad = "";
function hex_sha1(a) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(a)))
}
function b64_sha1(a) {
    return rstr2b64(rstr_sha1(str2rstr_utf8(a)))
}
function any_sha1(a, d) {
    return rstr2any(rstr_sha1(str2rstr_utf8(a)), d)
}
function hex_hmac_sha1(a, d) {
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(d)))
}
function b64_hmac_sha1(a, d) {
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(d)))
}
function any_hmac_sha1(a, d, b) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(d)), b)
}
function sha1_vm_test() {
    return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d"
}
function rstr_sha1(a) {
    return binb2rstr(binb_sha1(rstr2binb(a), a.length * 8))
}
function rstr_hmac_sha1(a, d) {
    var b = rstr2binb(a);
    if (b.length > 16)b = binb_sha1(b, a.length * 8);
    for (var c = Array(16), e = Array(16), f = 0; f < 16; f++) {
        c[f] = b[f] ^ 909522486;
        e[f] = b[f] ^ 1549556828
    }
    b = binb_sha1(c.concat(rstr2binb(d)), 512 + d.length * 8);
    return binb2rstr(binb_sha1(e.concat(b), 672))
}
function rstr2hex(a) {
    for (var d = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", b = "", c, e = 0; e < a.length; e++) {
        c = a.charCodeAt(e);
        b += d.charAt(c >>> 4 & 15) + d.charAt(c & 15)
    }
    return b
}
function rstr2b64(a) {
    for (var d = "", b = a.length, c = 0; c < b; c += 3)for (var e = a.charCodeAt(c) << 16 | (c + 1 < b ? a.charCodeAt(c + 1) << 8 : 0) | (c + 2 < b ? a.charCodeAt(c + 2) : 0), f = 0; f < 4; f++)d += c * 8 + f * 6 > a.length * 8 ? b64pad : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >>> 6 * (3 - f) & 63);
    return d
}
function rstr2any(a, d) {
    var b = d.length, c = [], e, f, j, g, k = Array(Math.ceil(a.length / 2));
    for (e = 0; e < k.length; e++)k[e] = a.charCodeAt(e * 2) << 8 | a.charCodeAt(e * 2 + 1);
    for (; k.length > 0;) {
        g = [];
        for (e = j = 0; e < k.length; e++) {
            j = (j << 16) + k[e];
            f = Math.floor(j / b);
            j -= f * b;
            if (g.length > 0 || f > 0)g[g.length] = f
        }
        c[c.length] = j;
        k = g
    }
    b = "";
    for (e = c.length - 1; e >= 0; e--)b += d.charAt(c[e]);
    c = Math.ceil(a.length * 8 / (Math.log(d.length) / Math.log(2)));
    for (e = b.length; e < c; e++)b = d[0] + b;
    return b
}
function str2rstr_utf8(a) {
    for (var d = "", b = -1, c, e; ++b < a.length;) {
        c = a.charCodeAt(b);
        e = b + 1 < a.length ? a.charCodeAt(b + 1) : 0;
        if (55296 <= c && c <= 56319 && 56320 <= e && e <= 57343) {
            c = 65536 + ((c & 1023) << 10) + (e & 1023);
            b++
        }
        if (c <= 127)d += String.fromCharCode(c); else if (c <= 2047)d += String.fromCharCode(192 | c >>> 6 & 31, 128 | c & 63); else if (c <= 65535)d += String.fromCharCode(224 | c >>> 12 & 15, 128 | c >>> 6 & 63, 128 | c & 63); else if (c <= 2097151)d += String.fromCharCode(240 | c >>> 18 & 7, 128 | c >>> 12 & 63, 128 | c >>> 6 & 63, 128 | c & 63)
    }
    return d
}
function str2rstr_utf16le(a) {
    for (var d = "", b = 0; b < a.length; b++)d += String.fromCharCode(a.charCodeAt(b) & 255, a.charCodeAt(b) >>> 8 & 255);
    return d
}
function str2rstr_utf16be(a) {
    for (var d = "", b = 0; b < a.length; b++)d += String.fromCharCode(a.charCodeAt(b) >>> 8 & 255, a.charCodeAt(b) & 255);
    return d
}
function rstr2binb(a) {
    for (var d = Array(a.length >> 2), b = 0; b < d.length; b++)d[b] = 0;
    for (b = 0; b < a.length * 8; b += 8)d[b >> 5] |= (a.charCodeAt(b / 8) & 255) << 24 - b % 32;
    return d
}
function binb2rstr(a) {
    for (var d = "", b = 0; b < a.length * 32; b += 8)d += String.fromCharCode(a[b >> 5] >>> 24 - b % 32 & 255);
    return d
}
function binb_sha1(a, d) {
    a[d >> 5] |= 128 << 24 - d % 32;
    a[(d + 64 >> 9 << 4) + 15] = d;
    for (var b = Array(80), c = 1732584193, e = -271733879, f = -1732584194, j = 271733878, g = -1009589776, k = 0; k < a.length; k += 16) {
        for (var o = c, s = e, q = f, r = j, v = g, t = 0; t < 80; t++) {
            b[t] = t < 16 ? a[k + t] : bit_rol(b[t - 3] ^ b[t - 8] ^ b[t - 14] ^ b[t - 16], 1);
            var y = safe_add(safe_add(bit_rol(c, 5), sha1_ft(t, e, f, j)), safe_add(safe_add(g, b[t]), sha1_kt(t)));
            g = j;
            j = f;
            f = bit_rol(e, 30);
            e = c;
            c = y
        }
        c = safe_add(c, o);
        e = safe_add(e, s);
        f = safe_add(f, q);
        j = safe_add(j, r);
        g = safe_add(g, v)
    }
    return Array(c, e, f, j,
            g)
}
function sha1_ft(a, d, b, c) {
    if (a < 20)return d & b | ~d & c;
    if (a < 40)return d ^ b ^ c;
    if (a < 60)return d & b | d & c | b & c;
    return d ^ b ^ c
}
function sha1_kt(a) {
    return a < 20 ? 1518500249 : a < 40 ? 1859775393 : a < 60 ? -1894007588 : -899497514
}
function safe_add(a, d) {
    var b = (a & 65535) + (d & 65535);
    return(a >> 16) + (d >> 16) + (b >> 16) << 16 | b & 65535
}
function bit_rol(a, d) {
    return a << d | a >>> 32 - d
}
Date.prototype.format = function (a) {
    for (var d = "", b = Date.replaceChars, c = 0; c < a.length; c++) {
        var e = a.charAt(c);
        d += b[e] ? b[e].call(this) : e
    }
    return d
};
Date.replaceChars = {shortMonths:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], longMonths:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], shortDays:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], longDays:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], d:function () {
    return(this.getDate() < 10 ? "0" : "") + this.getDate()
}, D:function () {
    return Date.replaceChars.shortDays[this.getDay()]
}, j:function () {
    return this.getDate()
},
    l:function () {
        return Date.replaceChars.longDays[this.getDay()]
    }, N:function () {
        return this.getDay() + 1
    }, S:function () {
        return this.getDate() % 10 == 1 && this.getDate() != 11 ? "st" : this.getDate() % 10 == 2 && this.getDate() != 12 ? "nd" : this.getDate() % 10 == 3 && this.getDate() != 13 ? "rd" : "th"
    }, w:function () {
        return this.getDay()
    }, z:function () {
        return"Not Yet Supported"
    }, W:function () {
        return"Not Yet Supported"
    }, F:function () {
        return Date.replaceChars.longMonths[this.getMonth()]
    }, m:function () {
        return(this.getMonth() < 9 ? "0" : "") + (this.getMonth() +
                1)
    }, M:function () {
        return Date.replaceChars.shortMonths[this.getMonth()]
    }, n:function () {
        return this.getMonth() + 1
    }, t:function () {
        return"Not Yet Supported"
    }, L:function () {
        return this.getFullYear() % 4 == 0 && this.getFullYear() % 100 != 0 || this.getFullYear() % 400 == 0 ? "1" : "0"
    }, o:function () {
        return"Not Supported"
    }, Y:function () {
        return this.getFullYear()
    }, y:function () {
        return("" + this.getFullYear()).substr(2)
    }, a:function () {
        return this.getHours() < 12 ? "am" : "pm"
    }, A:function () {
        return this.getHours() < 12 ? "AM" : "PM"
    }, B:function () {
        return"Not Yet Supported"
    },
    g:function () {
        return this.getHours() % 12 || 12
    }, G:function () {
        return this.getHours()
    }, h:function () {
        return((this.getHours() % 12 || 12) < 10 ? "0" : "") + (this.getHours() % 12 || 12)
    }, H:function () {
        return(this.getHours() < 10 ? "0" : "") + this.getHours()
    }, i:function () {
        return(this.getMinutes() < 10 ? "0" : "") + this.getMinutes()
    }, s:function () {
        return(this.getSeconds() < 10 ? "0" : "") + this.getSeconds()
    }, e:function () {
        return"Not Yet Supported"
    }, I:function () {
        return"Not Supported"
    }, O:function () {
        return(-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() /
                60) < 10 ? "0" : "") + Math.abs(this.getTimezoneOffset() / 60) + "00"
    }, P:function () {
        return(-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") + Math.abs(this.getTimezoneOffset() / 60) + ":" + (Math.abs(this.getTimezoneOffset() % 60) < 10 ? "0" : "") + Math.abs(this.getTimezoneOffset() % 60)
    }, T:function () {
        var a = this.getMonth();
        this.setMonth(0);
        var d = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, "$1");
        this.setMonth(a);
        return d
    }, Z:function () {
        return-this.getTimezoneOffset() * 60
    }, c:function () {
        return this.format("Y-m-d") +
                "T" + this.format("H:i:sP")
    }, r:function () {
        return this.toString()
    }, U:function () {
        return this.getTime() / 1E3
    }};
(function (a) {
    a.GrowingInput = function (b, c) {
        var e, f, j;
        c = a.extend({min:0, max:null, maxWidth:null, startWidth:30, correction:45}, c);
        b = a(b).data("growing", this);
        var g = this, k = function (s) {
            j.text(s);
            s = j.width();
            return(s ? s : c.startWidth) + c.correction
        }, o = function () {
            f = e;
            var s = e = b.val();
            if ((c.min || c.min === 0) && e.length < c.min) {
                if ((f || f === 0) && f.length <= c.min)return;
                s = d(e, c.min, "-")
            } else if ((c.max || c.max === 0) && e.length > c.max) {
                if ((f || f === 0) && f.length >= c.max)return;
                s = e.substr(0, c.max)
            }
            c.maxWidth ? b.width(Math.min(c.maxWidth,
                    k(s))) : b.width(k(s));
            return g
        };
        this.resize = o;
        (function () {
            j = a("<span></span>").css({"float":"left", display:"inline-block", position:"absolute", left:-1000}).insertAfter(b);
            a.each(["font-size", "font-family", "padding-left", "padding-top", "padding-bottom", "padding-right", "border-left", "border-right", "border-top", "border-bottom", "word-spacing", "letter-spacing", "text-indent", "text-transform"], function (s, q) {
                j.css(q, b.css(q))
            });
            b.blur(o).keyup(o).keydown(o).keypress(o);
            o()
        })()
    };
    var d = function (b, c, e, f) {
        if (b.length >=
                c)return this;
        e = e || " ";
        c = Array(c - b.length + 1).join(e).substr(0, c - b.length);
        if (!f || f == "right")return b + c;
        if (f == "left")return c + b;
        return c.substr(0, (c.length / 2).floor()) + b + c.substr(0, (c.length / 2).ceil())
    }
})(jQuery);
(function (a) {
    a.TextboxList = function (e, f) {
        var j, g, k, o, s = false, q = [], r, v = {}, t = a.extend(true, {prefix:"textboxlist", max:null, unique:false, uniqueInsensitive:true, endEditableBit:true, startEditableBit:true, hideEditableBits:true, inBetweenEditableBits:true, keys:{previous:37, next:39}, bitsOptions:{editable:{}, box:{}}, plugins:{}, encode:function (P) {
                    return a.grep(a.map(P, function (la) {
                        la = d(la[0]) ? la[0] : la[1];
                        return d(la) ? la.toString().replace(/,/, "") : null
                    }),function (la) {
                        return la != undefined
                    }).join(",")
                }, decode:function (P) {
                    return P.split(",")
                }},
                f);
        e = a(e);
        var y = this, E = function (P, la) {
                    y.plugins[P] = new (a.TextboxList[b(c(P))])(y, la)
                }, G = function () {
                    t.endEditableBit && B("editable", null, {tabIndex:j.tabIndex}).inject(k);
                    ra("bitAdd", W, true);
                    ra("bitRemove", W, true);
                    a(document).click(function (P) {
                        if (s) {
                            if (P.target.className.indexOf(t.prefix) != -1) {
                                if (P.target == a(g).get(0))return;
                                if (a(P.target).parents("div." + t.prefix).get(0) == g.get(0))return
                            }
                            K()
                        }
                    }).keydown(function (P) {
                                if (s && o) {
                                    var la = o.is("editable") ? o.getCaret() : null, wa = o.getValue()[1], Aa = !!a.map(["shift",
                                        "alt", "meta", "ctrl"],function (C) {
                                        return P[C]
                                    }).length || o.is("editable") && o.isSelected(), za = function () {
                                        P.stopPropagation();
                                        P.preventDefault()
                                    };
                                    switch (P.which) {
                                        case 8:
                                            if (o.is("box")) {
                                                za();
                                                return o.remove()
                                            }
                                        case t.keys.previous:
                                            if (o.is("box") || (la == 0 || !wa.length) && !Aa) {
                                                za();
                                                L("prev");
                                                a("#backDerp").focus()
                                            }
                                            break;
                                        case 46:
                                            if (o.is("box")) {
                                                za();
                                                return o.remove()
                                            }
                                        case t.keys.next:
                                            if (o.is("box") || la == wa.length && !Aa) {
                                                za();
                                                L("next")
                                            }
                                    }
                                }
                            });
                    da(t.decode(j.val()))
                }, B = function (P, la, wa) {
                    if (P == "box") {
                        if (d(t.max) && k.children("." +
                                t.prefix + "-bit-box").length + 1 > t.max)return false;
                        if (t.unique && a.inArray(N(la), q) != -1)return false
                    }
                    return new a.TextboxListBit(P, la, y, a.extend(true, t.bitsOptions[P], wa))
                }, N = function (P) {
                    return d(P[0]) ? P[0] : t.uniqueInsensitive ? P[1].toLowerCase() : P[1]
                }, ba = function (P, la, wa, Aa) {
                    if (P = B("box", [la, P, wa])) {
                        if (!Aa || !Aa.length)Aa = k.find("." + t.prefix + "-bit-box").filter(":last");
                        P.inject(Aa.length ? Aa : k, Aa.length ? "after" : "top")
                    }
                    return y
                }, L = function (P, la) {
                    var wa = Z(la && a(la).length ? la : o).toElement();
                    (wa = Z(wa[P]())) &&
                    wa.focus();
                    return y
                }, ja = function () {
                    var P = k.children().filter(":last");
                    P && Z(P).focus();
                    return y
                }, K = function () {
                    if (!s)return y;
                    o && o.blur();
                    s = false;
                    return Y("blur")
                }, Z = function (P) {
                    return P.type && (P.type == "editable" || P.type == "box") ? P : a(P).data("textboxlist:bit")
                }, X = function () {
                    var P = [];
                    k.children().each(function () {
                        var la = Z(this);
                        la.is("editable") || P.push(la.getValue())
                    });
                    return P
                }, da = function (P) {
                    P && a.each(P, function (la, wa) {
                        if (wa)ba.apply(y, a.isArray(wa) ? [wa[1], wa[0], wa[2]] : [wa])
                    })
                }, W = function () {
                    j.val(t.encode(X()))
                },
                ra = function (P, la) {
                    if (v[P] == undefined)v[P] = [];
                    var wa = false;
                    a.each(v[P], function (Aa) {
                        if (Aa === la)wa = true
                    });
                    wa || v[P].push(la);
                    return y
                }, Y = function (P, la, wa) {
                    if (!v || !v[P])return y;
                    a.each(v[P], function (Aa, za) {
                        (function () {
                            la = la != undefined ? a.isArray(la) ? la : [la] : Array.prototype.slice.call(arguments);
                            var C = function () {
                                return za.apply(y || null, la)
                            };
                            if (wa)return setTimeout(C, wa);
                            return C()
                        })()
                    });
                    return y
                }, m = function (P) {
                    return a.inArray(N(P), q)
                };
        this.onFocus = function (P) {
            o && o.blur();
            clearTimeout(r);
            o = P;
            g.addClass(t.prefix +
                    "-focus");
            if (!s) {
                s = true;
                Y("focus", P)
            }
        };
        this.onAdd = function (P) {
            t.unique && P.is("box") && q.push(N(P.getValue()));
            if (P.is("box"))if ((P = Z(P.toElement().prev())) && P.is("box") && t.inBetweenEditableBits || !P && t.startEditableBit) {
                P = P && P.toElement().length ? P.toElement() : false;
                P = B("editable").inject(P || k, P ? "after" : "top");
                t.hideEditableBits && P.hide()
            }
        };
        this.onRemove = function (P) {
            if (s) {
                if (t.unique && P.is("box")) {
                    var la = m(P.getValue());
                    if (la != -1)q = q.splice(la + 1, 1)
                }
                (la = Z(P.toElement().prev())) && la.is("editable") && la.remove();
                L("next", P)
            }
        };
        this.onBlur = function (P, la) {
            o = null;
            g.removeClass(t.prefix + "-focus");
            r = setTimeout(K, la ? 0 : 200)
        };
        this.setOptions = function (P) {
            t = a.extend(true, t, P)
        };
        this.getOptions = function () {
            return t
        };
        this.getContainer = function () {
            return g
        };
        this.isDuplicate = m;
        this.addEvent = ra;
        this.removeEvent = function (P, la) {
            if (v[P])for (var wa = v[P].length; wa--;)v[P][wa] === la && v[P].splice(wa, 1);
            return y
        };
        this.fireEvent = Y;
        this.create = B;
        this.add = ba;
        this.getValues = X;
        this.plugins = [];
        (function () {
            j = e.css("display", "none").attr("autocomplete",
                    "off").focus(ja);
            g = a('<div class="' + t.prefix + '" />').insertAfter(e).click(function (la) {
                if ((la.target == k.get(0) || la.target == g.get(0)) && (!s || o && o.toElement().get(0) != k.find(":last-child").get(0)))ja()
            });
            k = a('<ul class="' + t.prefix + '-bits" />').appendTo(g);
            for (var P in t.plugins)E(P, t.plugins[P]);
            G()
        })()
    };
    a.TextboxListBit = function (e, f, j, g) {
        var k, o, s, q, r, v = false, t = c(e), y = a.extend(true, e == "box" ? {deleteButton:true} : {tabIndex:null, growing:true, growingOptions:{}, stopEnter:true, addOnBlur:false, addKeys:[13,
            188]}, g);
        this.type = e;
        this.value = f;
        var E = this, G = function (Z) {
            if (v)return E;
            ba();
            v = true;
            j.onFocus(E);
            o.addClass(s + "-focus").addClass(s + "-" + e + "-focus");
            ja("focus");
            e == "editable" && !Z && k.focus();
            return E
        }, B = function (Z) {
            if (!v)return E;
            v = false;
            j.onBlur(E);
            o.removeClass(s + "-focus").removeClass(s + "-" + e + "-focus");
            ja("blur");
            if (e == "editable") {
                Z || k.blur();
                r && !k.val().length && L()
            }
            return E
        }, N = function () {
            B();
            j.onRemove(E);
            o.remove();
            return ja("remove")
        }, ba = function () {
            o.css("display", "block");
            return E
        }, L = function () {
            o.css("display",
                    "none");
            r = true;
            return E
        }, ja = function (Z) {
            Z = c(Z);
            j.fireEvent("bit" + Z, E).fireEvent("bit" + t + Z, E);
            return E
        };
        this.is = function (Z) {
            return e == Z
        };
        this.setValue = function (Z) {
            if (e == "editable") {
                k.val(d(Z[0]) ? Z[0] : Z[1]);
                y.growing && k.data("growing").resize()
            } else f = Z;
            return E
        };
        this.getValue = function () {
            return e == "editable" ? [null, k.val(), null] : f
        };
        if (e == "editable") {
            this.getCaret = function () {
                var Z = k.get(0);
                if (Z.createTextRange) {
                    var X = document.selection.createRange().duplicate();
                    X.moveEnd("character", Z.value.length);
                    if (X.text ===
                            "")return Z.value.length;
                    return Z.value.lastIndexOf(X.text)
                } else return Z.selectionStart
            };
            this.getCaretEnd = function () {
                var Z = k.get(0);
                if (Z.createTextRange) {
                    var X = document.selection.createRange().duplicate();
                    X.moveStart("character", -Z.value.length);
                    return X.text.length
                } else return Z.selectionEnd
            };
            this.isSelected = function () {
                return v && E.getCaret() !== E.getCaretEnd()
            };
            var K = function () {
                var Z = E.getValue();
                if (Z[1]) {
                    if (Z = j.create("box", Z)) {
                        Z.inject(o, "before");
                        E.setValue([null, "", null]);
                        return Z
                    }
                    return null
                }
            };
            this.toBox = K
        }
        this.toElement = function () {
            return o
        };
        this.focus = G;
        this.blur = B;
        this.remove = N;
        this.inject = function (Z, X) {
            switch (X || "bottom") {
                case "top":
                    o.prependTo(Z);
                    break;
                case "bottom":
                    o.appendTo(Z);
                    break;
                case "before":
                    o.insertBefore(Z);
                    break;
                case "after":
                    o.insertAfter(Z);
                    break
            }
            j.onAdd(E);
            return ja("add")
        };
        this.show = ba;
        this.hide = L;
        this.fireBitEvent = ja;
        (function () {
            s = j.getOptions().prefix + "-bit";
            q = s + "-" + e;
            o = a("<li />").addClass(s).addClass(q).data("textboxlist:bit", E).hover(function () {
                o.addClass(s + "-hover").addClass(q +
                        "-hover")
            }, function () {
                o.removeClass(s + "-hover").removeClass(q + "-hover")
            });
            if (e == "box") {
                o.html(d(E.value[2]) ? E.value[2] : E.value[1]).click(G);
                if (y.deleteButton) {
                    o.addClass(q + "-deletable");
                    a('<a href="#" class="' + q + '-deletebutton" />').click(N).appendTo(o)
                }
                o.children().click(function (Z) {
                    Z.stopPropagation();
                    Z.preventDefault()
                })
            } else {
                k = a('<input type="text" class="' + q + '-input" autocomplete="off" />').val(E.value ? E.value[1] : "").appendTo(o);
                if (d(y.tabIndex))k.tabIndex = y.tabIndex;
                y.growing && new a.GrowingInput(k,
                        y.growingOptions);
                k.focus(function () {
                    G(true)
                }).blur(function () {
                            B(true);
                            y.addOnBlur && K()
                        });
                if (y.addKeys || y.stopEnter)k.keydown(function (Z) {
                    if (v) {
                        if (y.stopEnter && Z.which === 13) {
                            Z.stopPropagation();
                            Z.preventDefault()
                        }
                        if (a.inArray(Z.which, a.isArray(y.addKeys) ? y.addKeys : [y.addKeys]) != -1) {
                            Z.stopPropagation();
                            Z.preventDefault();
                            K()
                        }
                    }
                })
            }
        })()
    };
    var d = function (e) {
        return!!(e || e === 0)
    }, b = function (e) {
        return e.replace(/-\D/g, function (f) {
            return f.charAt(1).toUpperCase()
        })
    }, c = function (e) {
        return e.replace(/\b[a-z]/g,
                function (f) {
                    return f.toUpperCase()
                })
    };
    a.fn.extend({textboxlist:function (e) {
        return this.each(function () {
            new a.TextboxList(this, e)
        })
    }})
})(jQuery);
(function () {
    $.TextboxList.Autocomplete = function (d, b) {
        var c, e, f, j, g = [], k = [], o = false, s, q, r, v, t, y, E = $.extend(true, {minLength:1, maxResults:5, insensitive:true, highlight:true, highlightSelector:null, mouseInteraction:true, onlyFromValues:false, queryRemote:false, remote:{url:"", param:"search", extraParams:{}, loadPlaceholder:"Please wait..."}, method:"standard", placeholder:"Type to receive suggestions"}, b), G = function (ra) {
            ra.toElement().keydown(W).keyup(function () {
                B()
            })
        }, B = function (ra) {
            if (ra)q = ra;
            if (E.queryRemote ||
                    g.length) {
                var Y = $.trim(q.getValue()[1]);
                Y.length < E.minLength && o && o.css("display", "block");
                if (Y != t) {
                    t = Y;
                    j.css("display", "none");
                    if (!(Y.length < E.minLength)) {
                        if (E.queryRemote)if (k[Y])g = k[Y]; else {
                            ra = E.remote.extraParams;
                            ra[E.remote.param] = Y;
                            y && y.abort();
                            y = $.ajax({url:E.remote.url, data:ra, dataType:"json", success:function (m) {
                                g = k[Y] = m;
                                N(Y)
                            }})
                        }
                        N(Y)
                    }
                }
            }
        }, N = function (ra) {
            var Y = e.filter(g, ra, E.insensitive, E.maxResults);
            if (d.getOptions().unique)Y = $.grep(Y, function (m) {
                return d.isDuplicate(m) == -1
            });
            ja();
            if (Y.length) {
                Z();
                j.empty().css("display", "block");
                $.each(Y, function (m, P) {
                    ba(P, ra)
                });
                E.onlyFromValues && K(j.find(":first"));
                Y = Y
            }
        }, ba = function (ra, Y) {
            var m = ra[3] ? '<div class="outer"><img height="30" width="30" src="' + ra[3] + '" /><span class="username">' + ra[1] + "</span></div>" : ra[1], P = $(ra[3] ? '<li class="' + c + '-result hasImage" />' : '<li class="' + c + '-result" />').html(m).data("textboxlist:auto:value", ra);
            P.appendTo(j);
            if (E.highlight)$(E.highlightSelector ? P.find(E.highlightSelector) : P).each(function () {
                $(this).html() && e.highlight($(this),
                        Y, E.insensitive, c + "-highlight")
            });
            if (E.mouseInteraction) {
                P.css("cursor", "pointer").hover(function () {
                    K(P)
                }).mousedown(function (la) {
                            la.stopPropagation();
                            la.preventDefault();
                            clearTimeout(r);
                            v = true
                        }).mouseup(function () {
                            if (v) {
                                da();
                                q.focus();
                                B();
                                v = false
                            }
                        });
                E.onlyFromValues || P.mouseleave(function () {
                    s && s.get(0) == P.get(0) && Z()
                })
            }
        }, L = function () {
            r = setTimeout(function () {
                ja();
                j.css("display", "none");
                t = null
            }, $.browser.msie ? 150 : 0)
        }, ja = function () {
            o && o.css("display", "none")
        }, K = function (ra) {
            if (ra && ra.length) {
                Z();
                s =
                        ra.addClass(c + "-result-focus")
            }
        }, Z = function () {
            if (s && s.length) {
                s.removeClass(c + "-result-focus");
                s = null
            }
        }, X = function (ra) {
            if (!s || !s.length)return self;
            return K(s[ra]())
        }, da = function () {
            var ra = s.data("textboxlist:auto:value"), Y = d.create("box", ra.slice(0, 3));
            if (Y) {
                Y.autoValue = ra;
                $.isArray(void 0) && (void 0).push(ra);
                q.setValue([null, "", null]);
                Y.inject(q.toElement(), "before")
            }
            Z();
            return self
        }, W = function (ra) {
            var Y = function () {
                ra.stopPropagation();
                ra.preventDefault()
            };
            switch (ra.which) {
                case 38:
                    Y();
                    !E.onlyFromValues &&
                            s && s.get(0) === j.find(":first").get(0) ? Z() : X("prev");
                    break;
                case 40:
                    Y();
                    s && s.length ? X("next") : K(j.find(":first"));
                    break;
                case 13:
                    Y();
                    if (s && s.length)da(); else if (!E.onlyFromValues) {
                        Y = q.getValue();
                        if (Y = d.create("box", Y)) {
                            Y.inject(q.toElement(), "before");
                            q.setValue([null, "", null])
                        }
                    }
            }
        };
        this.setValues = function (ra) {
            g = ra
        };
        (function () {
            d.addEvent("bitEditableAdd", G).addEvent("bitEditableFocus", B).addEvent("bitEditableBlur", L).setOptions({bitsOptions:{editable:{addKeys:false, stopEnter:false}}});
            $.browser.msie &&
            d.setOptions({bitsOptions:{editable:{addOnBlur:false}}});
            c = d.getOptions().prefix + "-autocomplete";
            e = $.TextboxList.Autocomplete.Methods[E.method];
            f = $('<div class="' + c + '" />').appendTo(d.getContainer());
            if (E.placeholder || E.placeholder === 0)o = $('<div class="' + c + '-placeholder" />').html(E.placeholder).appendTo(f);
            j = $('<ul class="' + c + '-results" />').appendTo(f).click(function (ra) {
                ra.stopPropagation();
                ra.preventDefault()
            })
        })()
    };
    $.TextboxList.Autocomplete.Methods = {standard:{filter:function (d, b, c, e) {
        var f =
                [];
        b = RegExp("\\b" + a(b), c ? "i" : "");
        for (c = 0; c < d.length; c++) {
            if (f.length === e)break;
            b.test(d[c][1]) && f.push(d[c])
        }
        return f
    }, highlight:function (d, b, c, e) {
        b = RegExp("(<[^>]*>)|(\\b" + a(b) + ")", c ? "ig" : "g");
        return d.html(d.html().replace(b, function (f, j, g) {
            return f.charAt(0) == "<" ? f : '<strong class="' + e + '">' + g + "</strong>"
        }))
    }}};
    var a = function (d) {
        return d.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1")
    }
})();


var googleOpenIDPopup = {constants:{openidSpec:{identifier_select:"http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select", namespace2:"http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0"}}, getWindowInnerSize:function () {
    var a = 0, d = 0, b = null;
    if ("innerWidth"in window) {
        a = window.innerWidth;
        d = window.innerHeight
    } else {
        if ("BackCompat" === window.document.compatMode && "body"in window.document)b = window.document.body; else if ("documentElement"in window.document)b = window.document.documentElement;
        if (b !== null) {
            a = b.offsetWidth;
            d = b.offsetHeight
        }
    }
    return[a, d]
}, getParentCoords:function () {
    var a = 0, d = 0;
    if ("screenLeft"in window) {
        a = window.screenLeft;
        d = window.screenTop
    } else if ("screenX"in window) {
        a = window.screenX;
        d = window.screenY
    }
    return[a, d]
}, getCenteredCoords:function (a, d) {
    var b = this.getWindowInnerSize(), c = this.getParentCoords(), e = c[0] + Math.max(0, Math.floor((b[0] - a) / 2));
    b = c[1] + Math.max(0, Math.floor((b[1] - d) / 2));
    if (e < 0)e += screen.width;
    return[e, b]
}, createPopupOpener:function (a) {
    var d = null, b = null, c = this, e = "shouldEncodeUrls"in a ? a.shouldEncodeUrls :
            true, f = "identifier"in a ? e ? encodeURIComponent(a.identifier) : a.identifier : this.constants.openidSpec.identifier_select, j = "identity"in a ? e ? encodeURIComponent(a.identity) : a.identity : this.constants.openidSpec.identifier_select, g = "namespace"in a ? e ? encodeURIComponent(a.namespace) : a.namespace : this.constants.openidSpec.namespace2, k = "onOpenHandler"in a && "function" === typeof a.onOpenHandler ? a.onOpenHandler : this.darkenScreen, o = "onCloseHandler"in a && "function" === typeof a.onCloseHandler ? a.onCloseHandler : null, s = "returnToUrl"in
            a ? a.returnToUrl : null, q = "realm"in a ? a.realm : null, r = "opEndpoint"in a ? a.opEndpoint : null, v = "extensions"in a ? a.extensions : null, t = function () {
        if (!b || b.closed) {
            b = null;
            o && o();
            if (null !== d) {
                window.clearInterval(d);
                d = null
            }
        }
    };
    return{popup:function (y, E) {
        var G;
        G = "&";
        var B = null;
        B = null;
        if (null === r || null === s)G = void 0; else {
            if (r.indexOf("?") === -1)G = "?";
            B = e ? encodeURIComponent(s) : s;
            B = [r, G, "openid.ns=", g, "&openid.mode=checkid_setup&openid.claimed_id=", f, "&openid.identity=", j, "&openid.return_to=", B].join("");
            if (q !== null)B +=
                    "&openid.realm=" + (e ? encodeURIComponent(q) : q);
            if (v !== null) {
                G = B;
                B = "";
                for (key in v)B += ["&", key, "=", e ? encodeURIComponent(v[key]) : v[key]].join("");
                B = G + B
            }
            B += "&openid.ns.ui=" + encodeURIComponent("http://specs.openid.net/extensions/ui/1.0");
            B += "&openid.ui.mode=popup";
            G = B
        }
        k && k();
        B = c.getCenteredCoords(y, E);
        b = window.open(G, "", "width=" + y + ",height=" + E + ",status=1,location=1,resizable=yes,left=" + B[0] + ",top=" + B[1]);
        d = window.setInterval(t, 80);
        return b
    }}
}};


(function (a) {
    var d = function (b) {
        var c = 65, e = {eventName:"click", onShow:function () {
                }, onBeforeShow:function () {
                }, onHide:function () {
                }, onChange:function () {
                }, onSubmit:function () {
                }, color:"ff0000", livePreview:true, flat:false}, f = function (C, S) {
                    var ua = Aa(C);
                    a(S).data("colorpicker").fields.eq(1).val(ua.r).end().eq(2).val(ua.g).end().eq(3).val(ua.b).end()
                }, j = function (C, S) {
                    a(S).data("colorpicker").fields.eq(4).val(C.h).end().eq(5).val(C.s).end().eq(6).val(C.b).end()
                }, g = function (C, S) {
                    a(S).data("colorpicker").fields.eq(0).val(za(Aa(C))).end()
                },
                k = function (C, S) {
                    a(S).data("colorpicker").selector.css("backgroundColor", "#" + za(Aa({h:C.h, s:100, b:100})));
                    a(S).data("colorpicker").selectorIndic.css({left:parseInt(150 * C.s / 100, 10), top:parseInt(150 * (100 - C.b) / 100, 10)})
                }, o = function (C, S) {
                    a(S).data("colorpicker").hue.css("top", parseInt(150 - 150 * C.h / 360, 10))
                }, s = function (C, S) {
                    a(S).data("colorpicker").currentColor.css("backgroundColor", "#" + za(Aa(C)))
                }, q = function (C, S) {
                    a(S).data("colorpicker").newColor.css("backgroundColor", "#" + za(Aa(C)))
                }, r = function (C) {
                    C = C.charCode ||
                            C.keyCode || -1;
                    if (C > c && C <= 90 || C == 32)return false;
                    a(this).parent().parent().data("colorpicker").livePreview === true && v.apply(this)
                }, v = function (C) {
                    var S = a(this).parent().parent(), ua;
                    if (this.parentNode.className.indexOf("_hex") > 0) {
                        ua = S.data("colorpicker");
                        var pa = this.value, Q = 6 - pa.length;
                        if (Q > 0) {
                            for (var fa = [], ma = 0; ma < Q; ma++)fa.push("0");
                            fa.push(pa);
                            pa = fa.join("")
                        }
                        pa = wa(la(pa));
                        ua.color = ua = pa
                    } else if (this.parentNode.className.indexOf("_hsb") > 0)S.data("colorpicker").color = ua = P({h:parseInt(S.data("colorpicker").fields.eq(4).val(),
                            10), s:parseInt(S.data("colorpicker").fields.eq(5).val(), 10), b:parseInt(S.data("colorpicker").fields.eq(6).val(), 10)}); else {
                        ua = S.data("colorpicker");
                        pa = {r:parseInt(S.data("colorpicker").fields.eq(1).val(), 10), g:parseInt(S.data("colorpicker").fields.eq(2).val(), 10), b:parseInt(S.data("colorpicker").fields.eq(3).val(), 10)};
                        ua.color = ua = wa({r:Math.min(255, Math.max(0, pa.r)), g:Math.min(255, Math.max(0, pa.g)), b:Math.min(255, Math.max(0, pa.b))})
                    }
                    if (C) {
                        f(ua, S.get(0));
                        g(ua, S.get(0));
                        j(ua, S.get(0))
                    }
                    k(ua, S.get(0));
                    o(ua, S.get(0));
                    q(ua, S.get(0));
                    S.data("colorpicker").onChange.apply(S, [ua, za(Aa(ua)), Aa(ua)])
                }, t = function () {
                    a(this).parent().parent().data("colorpicker").fields.parent().removeClass("colorpicker_focus")
                }, y = function () {
                    c = this.parentNode.className.indexOf("_hex") > 0 ? 70 : 65;
                    a(this).parent().parent().data("colorpicker").fields.parent().removeClass("colorpicker_focus");
                    a(this).parent().addClass("colorpicker_focus")
                }, E = function (C) {
                    var S = a(this).parent().find("input").focus();
                    C = {el:a(this).parent().addClass("colorpicker_slider"),
                        max:this.parentNode.className.indexOf("_hsb_h") > 0 ? 360 : this.parentNode.className.indexOf("_hsb") > 0 ? 100 : 255, y:C.pageY, field:S, val:parseInt(S.val(), 10), preview:a(this).parent().parent().data("colorpicker").livePreview};
                    a(document).bind("mouseup", C, B);
                    a(document).bind("mousemove", C, G);
                    return false
                }, G = function (C) {
                    C.data.field.val(Math.max(0, Math.min(C.data.max, parseInt(C.data.val + C.pageY - C.data.y, 10))));
                    C.data.preview && v.apply(C.data.field.get(0), [true]);
                    return false
                }, B = function (C) {
                    v.apply(C.data.field.get(0),
                            [true]);
                    C.data.el.removeClass("colorpicker_slider").find("input").focus();
                    a(document).unbind("mouseup", B);
                    a(document).unbind("mousemove", G);
                    return false
                }, N = function () {
                    var C = {cal:a(this).parent(), y:a(this).offset().top};
                    C.preview = C.cal.data("colorpicker").livePreview;
                    a(document).bind("mouseup", C, L);
                    a(document).bind("mousemove", C, ba);
                    return false
                }, ba = function (C) {
                    v.apply(C.data.cal.data("colorpicker").fields.eq(4).val(parseInt(360 * (150 - Math.max(0, Math.min(150, C.pageY - C.data.y))) / 150, 10)).get(0), [C.data.preview]);
                    return false
                }, L = function (C) {
                    f(C.data.cal.data("colorpicker").color, C.data.cal.get(0));
                    g(C.data.cal.data("colorpicker").color, C.data.cal.get(0));
                    a(document).unbind("mouseup", L);
                    a(document).unbind("mousemove", ba);
                    return false
                }, ja = function (C) {
                    var S = {cal:a(this).parent(), pos:a(this).offset()};
                    S.preview = S.cal.data("colorpicker").livePreview;
                    a(document).bind("mouseup", S, Z);
                    a(document).bind("mousemove", S, K);
                    C.data = S;
                    K(C);
                    return false
                }, K = function (C) {
                    v.apply(C.data.cal.data("colorpicker").fields.eq(6).val(parseInt(100 *
                            (150 - Math.max(0, Math.min(150, C.pageY - C.data.pos.top))) / 150, 10)).end().eq(5).val(parseInt(100 * Math.max(0, Math.min(150, C.pageX - C.data.pos.left)) / 150, 10)).get(0), [C.data.preview]);
                    return false
                }, Z = function (C) {
                    f(C.data.cal.data("colorpicker").color, C.data.cal.get(0));
                    g(C.data.cal.data("colorpicker").color, C.data.cal.get(0));
                    a(document).unbind("mouseup", Z);
                    a(document).unbind("mousemove", K);
                    return false
                }, X = function () {
                    a(this).addClass("colorpicker_focus")
                }, da = function () {
                    a(this).removeClass("colorpicker_focus")
                },
                W = function () {
                    var C = a(this).parent(), S = C.data("colorpicker").color;
                    C.data("colorpicker").origColor = S;
                    s(S, C.get(0));
                    C.data("colorpicker").onSubmit(S, za(Aa(S)), Aa(S));
                    return false
                }, ra = function () {
                    var C = a("#" + a(this).data("colorpickerId"));
                    C.data("colorpicker").onBeforeShow.apply(this, [C.get(0)]);
                    var S = a(this).offset(), ua, pa, Q, fa;
                    if (document.documentElement) {
                        ua = document.documentElement.scrollTop;
                        pa = document.documentElement.scrollLeft;
                        Q = document.documentElement.scrollWidth;
                        fa = document.documentElement.scrollHeight
                    } else {
                        ua =
                                document.body.scrollTop;
                        pa = document.body.scrollLeft;
                        Q = document.body.scrollWidth;
                        fa = document.body.scrollHeight
                    }
                    ua = {t:ua, l:pa, w:Q, h:fa, iw:self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0, ih:self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0};
                    pa = S.top + this.offsetHeight;
                    S = S.left - 178;
                    if (pa + 176 > ua.t + Math.min(ua.h, ua.ih))pa -= this.offsetHeight + 176;
                    if (S + 356 > ua.l + Math.min(ua.w, ua.iw))S -= 356;
                    C.css({left:S + "px", top:pa + "px"});
                    C.data("colorpicker").onShow.apply(this,
                            [C.get(0)]) != false && C.show();
                    a(document).bind("mousedown", {cal:C}, Y);
                    return false
                }, Y = function (C) {
                    if (!m(C.data.cal.get(0), C.target, C.data.cal.get(0))) {
                        C.data.cal.data("colorpicker").onHide.apply(this, [C.data.cal.get(0)]) != false && C.data.cal.hide();
                        a(document).unbind("mousedown", Y)
                    }
                }, m = function (C, S, ua) {
                    if (C == S)return true;
                    if (C.contains && !a.browser.safari)return C.contains(S);
                    if (C.compareDocumentPosition)return!!(C.compareDocumentPosition(S) & 16);
                    for (S = S.parentNode; S && S != ua;) {
                        if (S == C)return true;
                        S = S.parentNode
                    }
                    return false
                },
                P = function (C) {
                    return{h:Math.min(360, Math.max(0, C.h)), s:Math.min(100, Math.max(0, C.s)), b:Math.min(100, Math.max(0, C.b))}
                }, la = function (C) {
                    C = parseInt(C.indexOf("#") > -1 ? C.substring(1) : C, 16);
                    return{r:C >> 16, g:(C & 65280) >> 8, b:C & 255}
                }, wa = function (C) {
                    var S = {};
                    S.b = Math.max(Math.max(C.r, C.g), C.b);
                    S.s = S.b <= 0 ? 0 : Math.round(100 * (S.b - Math.min(Math.min(C.r, C.g), C.b)) / S.b);
                    S.b = Math.round(S.b / 255 * 100);
                    S.h = C.r == C.g && C.g == C.b ? 0 : C.r >= C.g && C.g >= C.b ? 60 * (C.g - C.b) / (C.r - C.b) : C.g >= C.r && C.r >= C.b ? 60 + 60 * (C.g - C.r) / (C.g - C.b) : C.g >= C.b &&
                            C.b >= C.r ? 120 + 60 * (C.b - C.r) / (C.g - C.r) : C.b >= C.g && C.g >= C.r ? 180 + 60 * (C.b - C.g) / (C.b - C.r) : C.b >= C.r && C.r >= C.g ? 240 + 60 * (C.r - C.g) / (C.b - C.g) : C.r >= C.b && C.b >= C.g ? 300 + 60 * (C.r - C.b) / (C.r - C.g) : 0;
                    S.h = Math.round(S.h);
                    return S
                }, Aa = function (C) {
                    var S = {}, ua = Math.round(C.h), pa = Math.round(C.s * 255 / 100);
                    C = Math.round(C.b * 255 / 100);
                    if (pa == 0)S.r = S.g = S.b = C; else {
                        pa = (255 - pa) * C / 255;
                        var Q = (C - pa) * (ua % 60) / 60;
                        if (ua == 360)ua = 0;
                        if (ua < 60) {
                            S.r = C;
                            S.b = pa;
                            S.g = pa + Q
                        } else if (ua < 120) {
                            S.g = C;
                            S.b = pa;
                            S.r = C - Q
                        } else if (ua < 180) {
                            S.g = C;
                            S.r = pa;
                            S.b = pa + Q
                        } else if (ua <
                                240) {
                            S.b = C;
                            S.r = pa;
                            S.g = C - Q
                        } else if (ua < 300) {
                            S.b = C;
                            S.g = pa;
                            S.r = pa + Q
                        } else if (ua < 360) {
                            S.r = C;
                            S.g = pa;
                            S.b = C - Q
                        } else {
                            S.r = 0;
                            S.g = 0;
                            S.b = 0
                        }
                    }
                    return{r:Math.round(S.r), g:Math.round(S.g), b:Math.round(S.b)}
                }, za = function (C) {
                    var S = [C.r.toString(16), C.g.toString(16), C.b.toString(16)];
                    a.each(S, function (ua, pa) {
                        if (pa.length == 1)S[ua] = "0" + pa
                    });
                    return S.join("")
                };
        return{init:function (C) {
            C = a.extend({}, e, C || {});
            if (typeof C.color == "string")C.color = wa(la(C.color)); else if (C.color.r != b && C.color.g != b && C.color.b != b)C.color = wa(C.color);
            else if (C.color.h != b && C.color.s != b && C.color.b != b)C.color = P(C.color); else return this;
            C.origColor = C.color;
            return this.each(function () {
                if (!a(this).data("colorpickerId")) {
                    var S = "collorpicker_" + parseInt(Math.random() * 1E3);
                    a(this).data("colorpickerId", S);
                    S = a('<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>').attr("id",
                            S);
                    C.flat ? S.appendTo(this).show() : S.appendTo(document.body);
                    C.fields = S.find("input").bind("keydown", r).bind("change", v).bind("blur", t).bind("focus", y);
                    S.find("span").bind("mousedown", E);
                    C.selector = S.find("div.colorpicker_color").bind("mousedown", ja);
                    C.selectorIndic = C.selector.find("div div");
                    C.hue = S.find("div.colorpicker_hue div");
                    S.find("div.colorpicker_hue").bind("mousedown", N);
                    C.newColor = S.find("div.colorpicker_new_color");
                    C.currentColor = S.find("div.colorpicker_current_color");
                    S.data("colorpicker",
                            C);
                    S.find("div.colorpicker_submit").bind("mouseenter", X).bind("mouseleave", da).bind("click", W);
                    f(C.color, S.get(0));
                    j(C.color, S.get(0));
                    g(C.color, S.get(0));
                    o(C.color, S.get(0));
                    k(C.color, S.get(0));
                    s(C.color, S.get(0));
                    q(C.color, S.get(0));
                    C.flat ? S.css({position:"relative", display:"block"}) : a(this).bind(C.eventName, ra)
                }
            })
        }, showPicker:function () {
            return this.each(function () {
                a(this).data("colorpickerId") && ra.apply(this)
            })
        }, hidePicker:function () {
            return this.each(function (C) {
                a(this).data("colorpickerId") &&
                a("#" + a(this).data("colorpickerId")).hide();
                C.stopPropagation && C.stopPropagation();
                C.preventDefault && C.preventDefault();
                C.returnValue = false;
                C.cancelBubble = true
            })
        }, setColor:function (C) {
            if (typeof C == "string")C = wa(la(C)); else if (C.r != b && C.g != b && C.b != b)C = wa(C); else if (C.h != b && C.s != b && C.b != b)C = P(C); else return this;
            return this.each(function () {
                if (a(this).data("colorpickerId")) {
                    var S = a("#" + a(this).data("colorpickerId"));
                    S.data("colorpicker").color = C;
                    S.data("colorpicker").origColor = C;
                    f(C, S.get(0));
                    j(C, S.get(0));
                    g(C, S.get(0));
                    o(C, S.get(0));
                    k(C, S.get(0));
                    s(C, S.get(0));
                    q(C, S.get(0))
                }
            })
        }}
    }();
    a.fn.extend({ColorPicker:d.init, ColorPickerHide:d.hide, ColorPickerShow:d.show, ColorPickerSetColor:d.setColor})
})($);


(function (a, d) {
    var b = window.EYE = function () {
        var c = {init:[]};
        return{init:function () {
            a.each(c.init, function (e, f) {
                f.call()
            })
        }, extend:function (e) {
            for (var f in e)if (e[f] != d)this[f] = e[f]
        }, register:function (e, f) {
            c[f] || (c[f] = []);
            c[f].push(e)
        }}
    }();
    a(b.init)
})(jQuery);


(function (a) {
    EYE.extend({getPosition:function (d, b) {
        var c = 0, e = 0, f = d.style, j = false;
        if (b && jQuery.curCSS(d, "display") == "none") {
            var g = f.visibility, k = f.position;
            j = true;
            f.visibility = "hidden";
            f.display = "block";
            f.position = "absolute"
        }
        var o = d;
        if (o.getBoundingClientRect) {
            e = o.getBoundingClientRect();
            c = e.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) - 2;
            e = e.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - 2
        } else {
            c = o.offsetLeft;
            e = o.offsetTop;
            o = o.offsetParent;
            if (d !=
                    o)for (; o;) {
                c += o.offsetLeft;
                e += o.offsetTop;
                o = o.offsetParent
            }
            if (jQuery.browser.safari && jQuery.curCSS(d, "position") == "absolute") {
                c -= document.body.offsetLeft;
                e -= document.body.offsetTop
            }
            for (o = d.parentNode; o && o.tagName.toUpperCase() != "BODY" && o.tagName.toUpperCase() != "HTML";) {
                if (jQuery.curCSS(o, "display") != "inline") {
                    c -= o.scrollLeft;
                    e -= o.scrollTop
                }
                o = o.parentNode
            }
        }
        if (j == true) {
            f.display = "none";
            f.position = k;
            f.visibility = g
        }
        return{x:c, y:e}
    }, getSize:function (d) {
        var b = parseInt(jQuery.curCSS(d, "width"), 10), c = parseInt(jQuery.curCSS(d,
                "height"), 10), e = 0, f = 0;
        if (jQuery.curCSS(d, "display") != "none") {
            e = d.offsetWidth;
            f = d.offsetHeight
        } else {
            var j = d.style, g = j.visibility, k = j.position;
            j.visibility = "hidden";
            j.display = "block";
            j.position = "absolute";
            e = d.offsetWidth;
            f = d.offsetHeight;
            j.display = "none";
            j.position = k;
            j.visibility = g
        }
        return{w:b, h:c, wb:e, hb:f}
    }, getClient:function (d) {
        var b;
        if (d) {
            b = d.clientWidth;
            d = d.clientHeight
        } else {
            d = document.documentElement;
            b = window.innerWidth || self.innerWidth || d && d.clientWidth || document.body.clientWidth;
            d = window.innerHeight ||
                    self.innerHeight || d && d.clientHeight || document.body.clientHeight
        }
        return{w:b, h:d}
    }, getScroll:function (d) {
        var b = 0, c = 0, e = 0, f = 0, j = 0, g = 0;
        if (d && d.nodeName.toLowerCase() != "body") {
            b = d.scrollTop;
            c = d.scrollLeft;
            e = d.scrollWidth;
            f = d.scrollHeight
        } else {
            if (document.documentElement) {
                b = document.documentElement.scrollTop;
                c = document.documentElement.scrollLeft;
                e = document.documentElement.scrollWidth;
                f = document.documentElement.scrollHeight
            } else if (document.body) {
                b = document.body.scrollTop;
                c = document.body.scrollLeft;
                e = document.body.scrollWidth;
                f = document.body.scrollHeight
            }
            if (typeof pageYOffset != "undefined") {
                b = pageYOffset;
                c = pageXOffset
            }
            j = self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
            g = self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
        }
        return{t:b, l:c, w:e, h:f, iw:j, ih:g}
    }, getMargins:function (d, b) {
        var c = jQuery.curCSS(d, "marginTop") || "", e = jQuery.curCSS(d, "marginRight") || "", f = jQuery.curCSS(d, "marginBottom") || "", j = jQuery.curCSS(d, "marginLeft") || "";
        return b ? {t:parseInt(c,
                10) || 0, r:parseInt(e, 10) || 0, b:parseInt(f, 10) || 0, l:parseInt(j, 10)} : {t:c, r:e, b:f, l:j}
    }, getPadding:function (d, b) {
        var c = jQuery.curCSS(d, "paddingTop") || "", e = jQuery.curCSS(d, "paddingRight") || "", f = jQuery.curCSS(d, "paddingBottom") || "", j = jQuery.curCSS(d, "paddingLeft") || "";
        return b ? {t:parseInt(c, 10) || 0, r:parseInt(e, 10) || 0, b:parseInt(f, 10) || 0, l:parseInt(j, 10)} : {t:c, r:e, b:f, l:j}
    }, getBorder:function (d, b) {
        var c = jQuery.curCSS(d, "borderTopWidth") || "", e = jQuery.curCSS(d, "borderRightWidth") || "", f = jQuery.curCSS(d, "borderBottomWidth") ||
                "", j = jQuery.curCSS(d, "borderLeftWidth") || "";
        return b ? {t:parseInt(c, 10) || 0, r:parseInt(e, 10) || 0, b:parseInt(f, 10) || 0, l:parseInt(j, 10) || 0} : {t:c, r:e, b:f, l:j}
    }, traverseDOM:function (d, b) {
        b(d);
        for (d = d.firstChild; d;) {
            EYE.traverseDOM(d, b);
            d = d.nextSibling
        }
    }, getInnerWidth:function (d, b) {
        var c = d.offsetWidth;
        return b ? Math.max(d.scrollWidth, c) - c + d.clientWidth : d.clientWidth
    }, getInnerHeight:function (d, b) {
        var c = d.offsetHeight;
        return b ? Math.max(d.scrollHeight, c) - c + d.clientHeight : d.clientHeight
    }, getExtraWidth:function (d) {
        if (a.boxModel)return(parseInt(a.curCSS(d,
                "paddingLeft")) || 0) + (parseInt(a.curCSS(d, "paddingRight")) || 0) + (parseInt(a.curCSS(d, "borderLeftWidth")) || 0) + (parseInt(a.curCSS(d, "borderRightWidth")) || 0);
        return 0
    }, getExtraHeight:function (d) {
        if (a.boxModel)return(parseInt(a.curCSS(d, "paddingTop")) || 0) + (parseInt(a.curCSS(d, "paddingBottom")) || 0) + (parseInt(a.curCSS(d, "borderTopWidth")) || 0) + (parseInt(a.curCSS(d, "borderBottomWidth")) || 0);
        return 0
    }, isChildOf:function (d, b, c) {
        if (d == b)return true;
        if (!b || !b.nodeType || b.nodeType != 1)return false;
        if (d.contains &&
                !a.browser.safari)return d.contains(b);
        if (d.compareDocumentPosition)return!!(d.compareDocumentPosition(b) & 16);
        for (b = b.parentNode; b && b != c;) {
            if (b == d)return true;
            b = b.parentNode
        }
        return false
    }, centerEl:function (d, b) {
        var c = EYE.getScroll(), e = EYE.getSize(d);
        if (!b || b == "vertically")a(d).css({top:c.t + (Math.min(c.h, c.ih) - e.hb) / 2 + "px"});
        if (!b || b == "horizontally")a(d).css({left:c.l + (Math.min(c.w, c.iw) - e.wb) / 2 + "px"})
    }});
    if (!a.easing.easeout)a.easing.easeout = function (d, b, c, e, f) {
        return-e * ((b = b / f - 1) * b * b * b - 1) + c
    }
})(jQuery);


(function (a) {
    EYE.register(function () {
        a("#colorpickerHolder").ColorPicker({flat:true});
        a("#colorpickerHolder2").ColorPicker({flat:true, color:"#00ff00", onSubmit:function (b, c) {
            a("#colorSelector2 div").css("backgroundColor", "#" + c)
        }});
        a("#colorpickerHolder2>div").css("position", "absolute");
        var d = false;
        a("#colorSelector2").bind("click", function () {
            a("#colorpickerHolder2").stop().animate({height:d ? 0 : 173}, 500);
            d = !d
        });
        a("#colorpickerField1").ColorPicker({onSubmit:function (b, c) {
            a("#colorpickerField1").val(c)
        },
            onBeforeShow:function () {
                a(this).ColorPickerSetColor(this.value)
            }}).bind("keyup", function () {
                    a(this).ColorPickerSetColor(this.value)
                });
        a("#colorSelector").ColorPicker({color:"#0000ff", onShow:function (b) {
            a(b).fadeIn(500);
            return false
        }, onHide:function (b) {
            a(b).fadeOut(500);
            return false
        }, onChange:function (b, c) {
            a("#colorSelector div").css("backgroundColor", "#" + c)
        }})
    }, "init")
})(jQuery);


(function () {
    function a(j) {
        return new a.fn.init(j)
    }

    function d(j, g, k) {
        if (!k.contentWindow.postMessage)return false;
        var o = k.getAttribute("src").split("?")[0];
        j = JSON.stringify({method:j, value:g});
        k.contentWindow.postMessage(j, o)
    }

    function b(j) {
        if (j.origin != playerDomain)return false;
        var g = JSON.parse(j.data);
        j = g.value;
        var k = g.data, o = o == "" ? null : g.player_id;
        g = o ? e[o][g.event || g.method] : e[g.event || g.method];
        var s = [];
        if (!g)return false;
        j !== undefined && s.push(j);
        k && s.push(k);
        o && s.push(o);
        return s.length > 0 ? g.apply(null,
                s) : g.call()
    }

    function c(j, g, k) {
        if (k) {
            e[k] || (e[k] = {});
            e[k][j] = g
        } else e[j] = g
    }

    var e = {}, f = false;
    a.fn = a.prototype = {playerDomain:"", element:null, init:function (j) {
        if (typeof j === "string")j = document.getElementById(j);
        this.element = j;
        return this
    }, api:function (j, g) {
        if (!this.element || !j)return false;
        var k = this.element, o = k.id != "" ? k.id : null, s = !(g && g.constructor && g.call && g.apply) ? g : null, q = g && g.constructor && g.call && g.apply ? g : null;
        q && c(j, q, o);
        d(j, s, k);
        return this
    }, addEvent:function (j, g) {
        if (!this.element)return false;
        var k = this.element;
        c(j, g, k.id != "" ? k.id : null);
        j != "ready" && d("addEventListener", j, k);
        if (f)return this;
        k = k.getAttribute("src").split("/");
        for (var o = "", s = 0, q = k.length; s < q; s++) {
            if (s < 3)o += k[s]; else break;
            if (s < 2)o += "/"
        }
        playerDomain = o;
        window.addEventListener ? window.addEventListener("message", b, false) : window.attachEvent("onmessage", b, false);
        f = true;
        return this
    }, removeEvent:function (j) {
        if (!this.element)return false;
        var g = this.element, k;
        a:{
            if ((k = g.id != "" ? g.id : null) && e[k]) {
                if (!e[k][j]) {
                    k = false;
                    break a
                }
                e[k][j] =
                        null
            } else {
                if (!e[j]) {
                    k = false;
                    break a
                }
                e[j] = null
            }
            k = true
        }
        j != "ready" && k && d("removeEventListener", j, g)
    }};
    a.fn.init.prototype = a.fn;
    return window.Froogaloop = window.$f = a
})();




(function (a) {
    function d(o) {
        return[gsConfig.assetHost, "/gs/", o, ".js?r=", gsConfig.appVersion].join("")
    }

    function b(o) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = o;
        document.body.appendChild(s)
    }

    function c(o) {
        j[o] = true;
        b(d(o))
    }

    var e = {
                "GS.Controllers.Page.UserMusicController":["GS.Controllers.Page.UserController"],
                "GS.Controllers.Lightbox.InteractionTimeController":["GS.Controllers.Lightbox.GenericController"],
                "GS.Controllers.Lightbox.ResetPasswordController":["GS.Controllers.Lightbox.GenericController"],
                "GS.Controllers.Lightbox.SwfTimeoutController":["GS.Controllers.Lightbox.GenericController"],
                "GS.Controllers.Lightbox.VIPOnlyFeatureController":["GS.Controllers.Lightbox.GenericController"]
            },
            f = {
                "GS.Controllers.Page.ArtistController":"tier1",
                "GS.Controllers.Page.AlbumController":"tier1",
                "GS.Controllers.Page.PlaylistController":"tier1",
                "GS.Controllers.Page.UserController":"tier1",
                "GS.Controllers.Page.UserMusicController":"tier1",
                "GS.Controllers.Page.MusicController":"tier1",
                "GS.Controllers.Lightbox.LocaleController":"tier1",
                "GS.Controllers.Lightbox.ShareController":"tier1",
                "GS.Controllers.Lightbox.NewPlaylistController":"tier1",
                "GS.Controllers.Lightbox.InterruptListenController":"tier1",
                "GS.Controllers.Page.NowPlayingController":"tier2",
                "GS.Controllers.Page.SettingsController":"tier2",
                "GS.Controllers.Lightbox.LoginController":"tier2",
                "GS.Controllers.Lightbox.InviteController":"tier2",
                "GS.Controllers.Lightbox.InteractionTimeController":"tier2",
                "GS.Controllers.Lightbox.RadioStationsController":"tier2"
            },
            j = {tier1:false, tier2:false},
            g = {}, k = /\./g;
    if (!window.GS)window.GS = {};
    GS.ClassLoader = {
        get:function (o) {
            var s = a.String.underscore(o).replace(k, "_");
            if (!g.hasOwnProperty(s)) {
                g[s] = a.Deferred();
                var q = [];
                if (e.hasOwnProperty(o))for (var r = 0; r < e[o].length; r++)q.push(this.get(e[o][r]));
                a.when.apply(jQuery, q).then(function () {
                    a:{
                        var v, t = f[o];
                        if (t && (gsConfig.runMode == "production" || gsConfig.runMode == "staging")) {
                            if (j[t])break a;
                            v = d(t);
                            j[t] = true
                        } else v = [gsConfig.assetHost, "/", a.String.underscore(o).replace(k, "/"), ".js?r=", gsConfig.appVersion].join("");
                        b(v)
                    }
                })
            }
            return g[s].promise()
        }, register:function (o, s) {
            var q = a.String.underscore(o).replace(k, "_");
            g.hasOwnProperty(q) || (g[q] = a.Deferred());
            g[q].resolve(s)
        }
    };
    a.subscribe("gs.app.ready", function () {
        if (gsConfig.runMode == "production" || gsConfig.runMode == "staging")
            setTimeout(function () {
                if (j.tier1)j.tier2 || c("tier2"); else {
                    c("tier1");
                    setTimeout(function () {
                        j.tier2 || c("tier2")
                    }, 3E4)
                }
            }, 45E3)
    })
})(jQuery);
