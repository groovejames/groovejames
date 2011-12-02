(function(a, d) {
    function c(g) {
        var k = U[g] = {},n,p;
        g = g.split(/\s+/);
        n = 0;
        for (p = g.length; n < p; n++)k[g[n]] = true;
        return k
    }

    function b(g, k, n) {
        if (n === d && g.nodeType === 1) {
            n = "data-" + k.replace(Da, "-$1").toLowerCase();
            n = g.getAttribute(n);
            if (typeof n === "string") {
                try {
                    n = n === "true" ? true : n === "false" ? false : n === "null" ? null : m.isNumeric(n) ? parseFloat(n) : ya.test(n) ? m.parseJSON(n) : n
                } catch(p) {
                }
                m.data(g, k, n)
            } else n = d
        }
        return n
    }

    function e(g) {
        for (var k in g)if (!(k === "data" && m.isEmptyObject(g[k])))if (k !== "toJSON")return false;
        return true
    }

    function f(g, k, n) {
        var p = k + "defer",q = k + "queue",v = k + "mark",z = m._data(g, p);
        if (z && (n === "queue" || !m._data(g, q)) && (n === "mark" || !m._data(g, v)))setTimeout(function() {
            if (!m._data(g, q) && !m._data(g, v)) {
                m.removeData(g, p, true);
                z.fire()
            }
        }, 0)
    }

    function j() {
        return false
    }

    function h() {
        return true
    }

    function l(g, k, n) {
        k = k || 0;
        if (m.isFunction(k))return m.grep(g, function(q, v) {
            return!!k.call(q, v, q) === n
        }); else if (k.nodeType)return m.grep(g, function(q) {
            return q === k === n
        }); else if (typeof k === "string") {
            var p = m.grep(g, function(q) {
                return q.nodeType ===
                        1
            });
            if (pb.test(k))return m.filter(k, p, !n); else k = m.filter(k, p)
        }
        return m.grep(g, function(q) {
            return m.inArray(q, k) >= 0 === n
        })
    }

    function o(g) {
        var k = eb.split(" ");
        g = g.createDocumentFragment();
        if (g.createElement)for (; k.length;)g.createElement(k.pop());
        return g
    }

    function r(g, k) {
        if (!(k.nodeType !== 1 || !m.hasData(g))) {
            var n,p,q;
            p = m._data(g);
            var v = m._data(k, p),z = p.events;
            if (z) {
                delete v.handle;
                v.events = {};
                for (n in z) {
                    p = 0;
                    for (q = z[n].length; p < q; p++)m.event.add(k, n + (z[n][p].namespace ? "." : "") + z[n][p].namespace, z[n][p],
                            z[n][p].data)
                }
            }
            if (v.data)v.data = m.extend({}, v.data)
        }
    }

    function u(g, k) {
        var n;
        if (k.nodeType === 1) {
            k.clearAttributes && k.clearAttributes();
            k.mergeAttributes && k.mergeAttributes(g);
            n = k.nodeName.toLowerCase();
            if (n === "object")k.outerHTML = g.outerHTML; else if (n === "input" && (g.type === "checkbox" || g.type === "radio")) {
                if (g.checked)k.defaultChecked = k.checked = g.checked;
                if (k.value !== g.value)k.value = g.value
            } else if (n === "option")k.selected = g.defaultSelected; else if (n === "input" || n === "textarea")k.defaultValue = g.defaultValue;
            k.removeAttribute(m.expando)
        }
    }

    function C(g) {
        return typeof g.getElementsByTagName !== "undefined" ? g.getElementsByTagName("*") : typeof g.querySelectorAll !== "undefined" ? g.querySelectorAll("*") : []
    }

    function F(g) {
        if (g.type === "checkbox" || g.type === "radio")g.defaultChecked = g.checked
    }

    function x(g) {
        var k = (g.nodeName || "").toLowerCase();
        if (k === "input")F(g); else k !== "script" && typeof g.getElementsByTagName !== "undefined" && m.grep(g.getElementsByTagName("input"), F)
    }

    function I(g, k) {
        k.src ? m.ajax({url:k.src,async:false,
            dataType:"script"}) : m.globalEval((k.text || k.textContent || k.innerHTML || "").replace(ac, "/*$0*/"));
        k.parentNode && k.parentNode.removeChild(k)
    }

    function G(g, k, n) {
        var p = k === "width" ? g.offsetWidth : g.offsetHeight,q = k === "width" ? Wb : Jb;
        if (p > 0) {
            n !== "border" && m.each(q, function() {
                n || (p -= parseFloat(m.css(g, "padding" + this)) || 0);
                if (n === "margin")p += parseFloat(m.css(g, n + this)) || 0; else p -= parseFloat(m.css(g, "border" + this + "Width")) || 0
            });
            return p + "px"
        }
        p = ab(g, k, k);
        if (p < 0 || p == null)p = g.style[k] || 0;
        p = parseFloat(p) || 0;
        n && m.each(q,
                function() {
                    p += parseFloat(m.css(g, "padding" + this)) || 0;
                    if (n !== "padding")p += parseFloat(m.css(g, "border" + this + "Width")) || 0;
                    if (n === "margin")p += parseFloat(m.css(g, n + this)) || 0
                });
        return p + "px"
    }

    function H(g) {
        return function(k, n) {
            if (typeof k !== "string") {
                n = k;
                k = "*"
            }
            if (m.isFunction(n))for (var p = k.toLowerCase().split(hb),q = 0,v = p.length,z,D; q < v; q++) {
                z = p[q];
                if (D = /^\+/.test(z))z = z.substr(1) || "*";
                z = g[z] = g[z] || [];
                z[D ? "unshift" : "push"](n)
            }
        }
    }

    function A(g, k, n, p, q, v) {
        q = q || k.dataTypes[0];
        v = v || {};
        v[q] = true;
        q = g[q];
        for (var z =
                0,D = q ? q.length : 0,P = g === Za,T; z < D && (P || !T); z++) {
            T = q[z](k, n, p);
            if (typeof T === "string")if (!P || v[T])T = d; else {
                k.dataTypes.unshift(T);
                T = A(g, k, n, p, T, v)
            }
        }
        if ((P || !T) && !v["*"])T = A(g, k, n, p, "*", v);
        return T
    }

    function N(g, k) {
        var n,p,q = m.ajaxSettings.flatOptions || {};
        for (n in k)if (k[n] !== d)(q[n] ? g : p || (p = {}))[n] = k[n];
        p && m.extend(true, g, p)
    }

    function ba(g, k, n, p) {
        if (m.isArray(k))m.each(k, function(v, z) {
            n || Kb.test(g) ? p(g, z) : ba(g + "[" + (typeof z === "object" || m.isArray(z) ? v : "") + "]", z, n, p)
        }); else if (!n && k != null && typeof k === "object")for (var q in k)ba(g +
                "[" + q + "]", k[q], n, p); else p(g, k)
    }

    function K() {
        try {
            return new a.XMLHttpRequest
        } catch(g) {
        }
    }

    function W() {
        setTimeout(ka, 0);
        return ib = m.now()
    }

    function ka() {
        ib = d
    }

    function fa(g, k) {
        var n = {};
        m.each(Cb.concat.apply([], Cb.slice(0, k)), function() {
            n[this] = g
        });
        return n
    }

    function ha(g) {
        if (!Ja[g]) {
            var k = aa.body,n = m("<" + g + ">").appendTo(k),p = n.css("display");
            n.remove();
            if (p === "none" || p === "") {
                if (!Ea) {
                    Ea = aa.createElement("iframe");
                    Ea.frameBorder = Ea.width = Ea.height = 0
                }
                k.appendChild(Ea);
                if (!qb || !Ea.createElement) {
                    qb = (Ea.contentWindow ||
                            Ea.contentDocument).document;
                    qb.write((aa.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>");
                    qb.close()
                }
                n = qb.createElement(g);
                qb.body.appendChild(n);
                p = m.css(n, "display");
                k.removeChild(Ea)
            }
            Ja[g] = p
        }
        return Ja[g]
    }

    function qa(g) {
        return m.isWindow(g) ? g : g.nodeType === 9 ? g.defaultView || g.parentWindow : false
    }

    var aa = a.document,ca = a.navigator,ea = a.location,m = function() {
        function g() {
            if (!k.isReady) {
                try {
                    aa.documentElement.doScroll("left")
                } catch(E) {
                    setTimeout(g, 1);
                    return
                }
                k.ready()
            }
        }

        var k = function(E, ga) {
            return new k.fn.init(E,
                    ga, q)
        },n = a.jQuery,p = a.$,q,v = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,z = /\S/,D = /^\s+/,P = /\s+$/,T = /\d/,pa = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,X = /^[\],:{}\s]*$/,ra = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,ja = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,Ia = /(?:^|:|,)(?:\s*\[)+/g,Xa = /(webkit)[ \/]([\w.]+)/,s = /(opera)(?:.*version)?[ \/]([\w.]+)/,w = /(msie) ([\w.]+)/,J = /(mozilla)(?:.*? rv:([\w.]+))?/,Y = /-([a-z]|[0-9])/ig,V = /^-ms-/,ta = function(E, ga) {
            return(ga + "").toUpperCase()
        },t = ca.userAgent,
                B,L,M = Object.prototype.toString,R = Object.prototype.hasOwnProperty,S = Array.prototype.push,ma = Array.prototype.slice,da = String.prototype.trim,wa = Array.prototype.indexOf,za = {};
        k.fn = k.prototype = {constructor:k,init:function(E, ga, ia) {
            var na;
            if (!E)return this;
            if (E.nodeType) {
                this.context = this[0] = E;
                this.length = 1;
                return this
            }
            if (E === "body" && !ga && aa.body) {
                this.context = aa;
                this[0] = aa.body;
                this.selector = E;
                this.length = 1;
                return this
            }
            if (typeof E === "string")if ((na = E.charAt(0) === "<" && E.charAt(E.length - 1) === ">" && E.length >=
                    3 ? [null,E,null] : v.exec(E)) && (na[1] || !ga))if (na[1]) {
                ia = (ga = ga instanceof k ? ga[0] : ga) ? ga.ownerDocument || ga : aa;
                if (E = pa.exec(E))if (k.isPlainObject(ga)) {
                    E = [aa.createElement(E[1])];
                    k.fn.attr.call(E, ga, true)
                } else E = [ia.createElement(E[1])]; else {
                    E = k.buildFragment([na[1]], [ia]);
                    E = (E.cacheable ? k.clone(E.fragment) : E.fragment).childNodes
                }
                return k.merge(this, E)
            } else {
                if ((ga = aa.getElementById(na[2])) && ga.parentNode) {
                    if (ga.id !== na[2])return ia.find(E);
                    this.length = 1;
                    this[0] = ga
                }
                this.context = aa;
                this.selector = E;
                return this
            } else return!ga ||
                    ga.jquery ? (ga || ia).find(E) : this.constructor(ga).find(E); else if (k.isFunction(E))return ia.ready(E);
            if (E.selector !== d) {
                this.selector = E.selector;
                this.context = E.context
            }
            return k.makeArray(E, this)
        },selector:"",jquery:"1.7",length:0,size:function() {
            return this.length
        },toArray:function() {
            return ma.call(this, 0)
        },get:function(E) {
            return E == null ? this.toArray() : E < 0 ? this[this.length + E] : this[E]
        },pushStack:function(E, ga, ia) {
            var na = this.constructor();
            k.isArray(E) ? S.apply(na, E) : k.merge(na, E);
            na.prevObject = this;
            na.context =
                    this.context;
            if (ga === "find")na.selector = this.selector + (this.selector ? " " : "") + ia; else if (ga)na.selector = this.selector + "." + ga + "(" + ia + ")";
            return na
        },each:function(E, ga) {
            return k.each(this, E, ga)
        },ready:function(E) {
            k.bindReady();
            B.add(E);
            return this
        },eq:function(E) {
            return E === -1 ? this.slice(E) : this.slice(E, +E + 1)
        },first:function() {
            return this.eq(0)
        },last:function() {
            return this.eq(-1)
        },slice:function() {
            return this.pushStack(ma.apply(this, arguments), "slice", ma.call(arguments).join(","))
        },map:function(E) {
            return this.pushStack(k.map(this,
                    function(ga, ia) {
                        return E.call(ga, ia, ga)
                    }))
        },end:function() {
            return this.prevObject || this.constructor(null)
        },push:S,sort:[].sort,splice:[].splice};
        k.fn.init.prototype = k.fn;
        k.extend = k.fn.extend = function() {
            var E,ga,ia,na,Aa,Ga = arguments[0] || {},Sa = 1,Ta = arguments.length,rb = false;
            if (typeof Ga === "boolean") {
                rb = Ga;
                Ga = arguments[1] || {};
                Sa = 2
            }
            if (typeof Ga !== "object" && !k.isFunction(Ga))Ga = {};
            if (Ta === Sa) {
                Ga = this;
                --Sa
            }
            for (; Sa < Ta; Sa++)if ((E = arguments[Sa]) != null)for (ga in E) {
                ia = Ga[ga];
                na = E[ga];
                if (Ga !== na)if (rb && na &&
                        (k.isPlainObject(na) || (Aa = k.isArray(na)))) {
                    if (Aa) {
                        Aa = false;
                        ia = ia && k.isArray(ia) ? ia : []
                    } else ia = ia && k.isPlainObject(ia) ? ia : {};
                    Ga[ga] = k.extend(rb, ia, na)
                } else if (na !== d)Ga[ga] = na
            }
            return Ga
        };
        k.extend({noConflict:function(E) {
            if (a.$ === k)a.$ = p;
            if (E && a.jQuery === k)a.jQuery = n;
            return k
        },isReady:false,readyWait:1,holdReady:function(E) {
            if (E)k.readyWait++; else k.ready(true)
        },ready:function(E) {
            if (E === true && !--k.readyWait || E !== true && !k.isReady) {
                if (!aa.body)return setTimeout(k.ready, 1);
                k.isReady = true;
                if (!(E !== true &&
                        --k.readyWait > 0)) {
                    B.fireWith(aa, [k]);
                    k.fn.trigger && k(aa).trigger("ready").unbind("ready")
                }
            }
        },bindReady:function() {
            if (!B) {
                B = k.Callbacks("once memory");
                if (aa.readyState === "complete")return setTimeout(k.ready, 1);
                if (aa.addEventListener) {
                    aa.addEventListener("DOMContentLoaded", L, false);
                    a.addEventListener("load", k.ready, false)
                } else if (aa.attachEvent) {
                    aa.attachEvent("onreadystatechange", L);
                    a.attachEvent("onload", k.ready);
                    var E = false;
                    try {
                        E = a.frameElement == null
                    } catch(ga) {
                    }
                    aa.documentElement.doScroll && E && g()
                }
            }
        },
            isFunction:function(E) {
                return k.type(E) === "function"
            },isArray:Array.isArray || function(E) {
                return k.type(E) === "array"
            },isWindow:function(E) {
                return E && typeof E === "object" && "setInterval"in E
            },isNumeric:function(E) {
                return E != null && T.test(E) && !isNaN(E)
            },type:function(E) {
                return E == null ? String(E) : za[M.call(E)] || "object"
            },isPlainObject:function(E) {
                if (!E || k.type(E) !== "object" || E.nodeType || k.isWindow(E))return false;
                try {
                    if (E.constructor && !R.call(E, "constructor") && !R.call(E.constructor.prototype, "isPrototypeOf"))return false
                } catch(ga) {
                    return false
                }
                var ia;
                for (ia in E);
                return ia === d || R.call(E, ia)
            },isEmptyObject:function(E) {
                for (var ga in E)return false;
                return true
            },error:function(E) {
                throw E;
            },parseJSON:function(E) {
                if (typeof E !== "string" || !E)return null;
                E = k.trim(E);
                if (a.JSON && a.JSON.parse)return a.JSON.parse(E);
                if (X.test(E.replace(ra, "@").replace(ja, "]").replace(Ia, "")))return(new Function("return " + E))();
                k.error("Invalid JSON: " + E)
            },parseXML:function(E) {
                var ga,ia;
                try {
                    if (a.DOMParser) {
                        ia = new DOMParser;
                        ga = ia.parseFromString(E, "text/xml")
                    } else {
                        ga = new ActiveXObject("Microsoft.XMLDOM");
                        ga.async = "false";
                        ga.loadXML(E)
                    }
                } catch(na) {
                    ga = d
                }
                if (!ga || !ga.documentElement || ga.getElementsByTagName("parsererror").length)k.error("Invalid XML: " + E);
                return ga
            },noop:function() {
            },globalEval:function(E) {
                if (E && z.test(E))(a.execScript || function(ga) {
                    a.eval.call(a, ga)
                })(E)
            },camelCase:function(E) {
                return E.replace(V, "ms-").replace(Y, ta)
            },nodeName:function(E, ga) {
                return E.nodeName && E.nodeName.toUpperCase() === ga.toUpperCase()
            },each:function(E, ga, ia) {
                var na,Aa = 0,Ga = E.length,Sa = Ga === d || k.isFunction(E);
                if (ia)if (Sa)for (na in E) {
                    if (ga.apply(E[na],
                            ia) === false)break
                } else for (; Aa < Ga;) {
                    if (ga.apply(E[Aa++], ia) === false)break
                } else if (Sa)for (na in E) {
                    if (ga.call(E[na], na, E[na]) === false)break
                } else for (; Aa < Ga;)if (ga.call(E[Aa], Aa, E[Aa++]) === false)break;
                return E
            },trim:da ? function(E) {
                return E == null ? "" : da.call(E)
            } : function(E) {
                return E == null ? "" : E.toString().replace(D, "").replace(P, "")
            },makeArray:function(E, ga) {
                var ia = ga || [];
                if (E != null) {
                    var na = k.type(E);
                    E.length == null || na === "string" || na === "function" || na === "regexp" || k.isWindow(E) ? S.call(ia, E) : k.merge(ia, E)
                }
                return ia
            },
            inArray:function(E, ga, ia) {
                var na;
                if (ga) {
                    if (wa)return wa.call(ga, E, ia);
                    na = ga.length;
                    for (ia = ia ? ia < 0 ? Math.max(0, na + ia) : ia : 0; ia < na; ia++)if (ia in ga && ga[ia] === E)return ia
                }
                return-1
            },merge:function(E, ga) {
                var ia = E.length,na = 0;
                if (typeof ga.length === "number")for (var Aa = ga.length; na < Aa; na++)E[ia++] = ga[na]; else for (; ga[na] !== d;)E[ia++] = ga[na++];
                E.length = ia;
                return E
            },grep:function(E, ga, ia) {
                var na = [],Aa;
                ia = !!ia;
                for (var Ga = 0,Sa = E.length; Ga < Sa; Ga++) {
                    Aa = !!ga(E[Ga], Ga);
                    ia !== Aa && na.push(E[Ga])
                }
                return na
            },map:function(E, ga, ia) {
                var na,Aa,Ga = [],Sa = 0,Ta = E.length;
                if (E instanceof k || Ta !== d && typeof Ta === "number" && (Ta > 0 && E[0] && E[Ta - 1] || Ta === 0 || k.isArray(E)))for (; Sa < Ta; Sa++) {
                    na = ga(E[Sa], Sa, ia);
                    if (na != null)Ga[Ga.length] = na
                } else for (Aa in E) {
                    na = ga(E[Aa], Aa, ia);
                    if (na != null)Ga[Ga.length] = na
                }
                return Ga.concat.apply([], Ga)
            },guid:1,proxy:function(E, ga) {
                if (typeof ga === "string") {
                    var ia = E[ga];
                    ga = E;
                    E = ia
                }
                if (!k.isFunction(E))return d;
                var na = ma.call(arguments, 2);
                ia = function() {
                    return E.apply(ga, na.concat(ma.call(arguments)))
                };
                ia.guid = E.guid =
                        E.guid || ia.guid || k.guid++;
                return ia
            },access:function(E, ga, ia, na, Aa, Ga) {
                var Sa = E.length;
                if (typeof ga === "object") {
                    for (var Ta in ga)k.access(E, Ta, ga[Ta], na, Aa, ia);
                    return E
                }
                if (ia !== d) {
                    na = !Ga && na && k.isFunction(ia);
                    for (Ta = 0; Ta < Sa; Ta++)Aa(E[Ta], ga, na ? ia.call(E[Ta], Ta, Aa(E[Ta], ga)) : ia, Ga);
                    return E
                }
                return Sa ? Aa(E[0], ga) : d
            },now:function() {
                return(new Date).getTime()
            },uaMatch:function(E) {
                E = E.toLowerCase();
                E = Xa.exec(E) || s.exec(E) || w.exec(E) || E.indexOf("compatible") < 0 && J.exec(E) || [];
                return{browser:E[1] || "",version:E[2] ||
                        "0"}
            },sub:function() {
                function E(ia, na) {
                    return new E.fn.init(ia, na)
                }

                k.extend(true, E, this);
                E.superclass = this;
                E.fn = E.prototype = this();
                E.fn.constructor = E;
                E.sub = this.sub;
                E.fn.init = function(ia, na) {
                    if (na && na instanceof k && !(na instanceof E))na = E(na);
                    return k.fn.init.call(this, ia, na, ga)
                };
                E.fn.init.prototype = E.fn;
                var ga = E(aa);
                return E
            },browser:{}});
        k.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(E, ga) {
            za["[object " + ga + "]"] = ga.toLowerCase()
        });
        t = k.uaMatch(t);
        if (t.browser) {
            k.browser[t.browser] =
                    true;
            k.browser.version = t.version
        }
        if (k.browser.webkit)k.browser.safari = true;
        if (z.test("\u00a0")) {
            D = /^[\s\xA0]+/;
            P = /[\s\xA0]+$/
        }
        q = k(aa);
        if (aa.addEventListener)L = function() {
            aa.removeEventListener("DOMContentLoaded", L, false);
            k.ready()
        }; else if (aa.attachEvent)L = function() {
            if (aa.readyState === "complete") {
                aa.detachEvent("onreadystatechange", L);
                k.ready()
            }
        };
        typeof define === "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
            return k
        });
        return k
    }(),U = {};
    m.Callbacks = function(g) {
        g = g ? U[g] ||
                c(g) : {};
        var k = [],n = [],p,q,v,z,D,P = function(X) {
            var ra,ja,Ia,Xa;
            ra = 0;
            for (ja = X.length; ra < ja; ra++) {
                Ia = X[ra];
                Xa = m.type(Ia);
                if (Xa === "array")P(Ia); else if (Xa === "function")if (!g.unique || !pa.has(Ia))k.push(Ia)
            }
        },T = function(X, ra) {
            ra = ra || [];
            p = !g.memory || [X,ra];
            q = true;
            D = v || 0;
            v = 0;
            for (z = k.length; k && D < z; D++)if (k[D].apply(X, ra) === false && g.stopOnFalse) {
                p = true;
                break
            }
            q = false;
            if (k)if (g.once)if (p === true)pa.disable(); else k = []; else if (n && n.length) {
                p = n.shift();
                pa.fireWith(p[0], p[1])
            }
        },pa = {add:function() {
            if (k) {
                var X = k.length;
                P(arguments);
                if (q)z = k.length; else if (p && p !== true) {
                    v = X;
                    T(p[0], p[1])
                }
            }
            return this
        },remove:function() {
            if (k)for (var X = arguments,ra = 0,ja = X.length; ra < ja; ra++)for (var Ia = 0; Ia < k.length; Ia++)if (X[ra] === k[Ia]) {
                if (q)if (Ia <= z) {
                    z--;
                    Ia <= D && D--
                }
                k.splice(Ia--, 1);
                if (g.unique)break
            }
            return this
        },has:function(X) {
            if (k)for (var ra = 0,ja = k.length; ra < ja; ra++)if (X === k[ra])return true;
            return false
        },empty:function() {
            k = [];
            return this
        },disable:function() {
            k = n = p = d;
            return this
        },disabled:function() {
            return!k
        },lock:function() {
            n = d;
            if (!p ||
                    p === true)pa.disable();
            return this
        },locked:function() {
            return!n
        },fireWith:function(X, ra) {
            if (n)if (q)g.once || n.push([X,ra]); else g.once && p || T(X, ra);
            return this
        },fire:function() {
            pa.fireWith(this, arguments);
            return this
        },fired:function() {
            return!!p
        }};
        return pa
    };
    var sa = [].slice;
    m.extend({Deferred:function(g) {
        var k = m.Callbacks("once memory"),n = m.Callbacks("once memory"),p = m.Callbacks("memory"),q = "pending",v = {resolve:k,reject:n,notify:p},z = {done:k.add,fail:n.add,progress:p.add,state:function() {
            return q
        },isResolved:k.fired,
            isRejected:n.fired,then:function(T, pa, X) {
                D.done(T).fail(pa).progress(X);
                return this
            },always:function() {
                return D.done.apply(D, arguments).fail.apply(D, arguments)
            },pipe:function(T, pa, X) {
                return m.Deferred(
                        function(ra) {
                            m.each({done:[T,"resolve"],fail:[pa,"reject"],progress:[X,"notify"]}, function(ja, Ia) {
                                var Xa = Ia[0],s = Ia[1],w;
                                m.isFunction(Xa) ? D[ja](function() {
                                    (w = Xa.apply(this, arguments)) && m.isFunction(w.promise) ? w.promise().then(ra.resolve, ra.reject, ra.notify) : ra[s + "With"](this === D ? ra : this, [w])
                                }) : D[ja](ra[s])
                            })
                        }).promise()
            },
            promise:function(T) {
                if (T == null)T = z; else for (var pa in z)T[pa] = z[pa];
                return T
            }},D = z.promise({}),P;
        for (P in v) {
            D[P] = v[P].fire;
            D[P + "With"] = v[P].fireWith
        }
        D.done(
                function() {
                    q = "resolved"
                }, n.disable, p.lock).fail(function() {
                    q = "rejected"
                }, k.disable, p.lock);
        g && g.call(D, D);
        return D
    },when:function(g) {
        function k(pa) {
            return function(X) {
                p[pa] = arguments.length > 1 ? sa.call(arguments, 0) : X;
                --D || P.resolveWith(P, p)
            }
        }

        function n(pa) {
            return function(X) {
                z[pa] = arguments.length > 1 ? sa.call(arguments, 0) : X;
                P.notifyWith(T, z)
            }
        }

        var p =
                sa.call(arguments, 0),q = 0,v = p.length,z = Array(v),D = v,P = v <= 1 && g && m.isFunction(g.promise) ? g : m.Deferred(),T = P.promise();
        if (v > 1) {
            for (; q < v; q++)if (p[q] && p[q].promise && m.isFunction(p[q].promise))p[q].promise().then(k(q), P.reject, n(q)); else--D;
            D || P.resolveWith(P, p)
        } else if (P !== g)P.resolveWith(P, v ? [g] : []);
        return T
    }});
    m.support = function() {
        var g = aa.createElement("div"),k = aa.documentElement,n,p,q,v,z,D,P,T;
        g.setAttribute("className", "t");
        g.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/><nav></nav>";
        n = g.getElementsByTagName("*");
        p = g.getElementsByTagName("a")[0];
        if (!n || !n.length || !p)return{};
        q = aa.createElement("select");
        v = q.appendChild(aa.createElement("option"));
        n = g.getElementsByTagName("input")[0];
        z = {leadingWhitespace:g.firstChild.nodeType === 3,tbody:!g.getElementsByTagName("tbody").length,htmlSerialize:!!g.getElementsByTagName("link").length,style:/top/.test(p.getAttribute("style")),hrefNormalized:p.getAttribute("href") === "/a",opacity:/^0.55/.test(p.style.opacity),cssFloat:!!p.style.cssFloat,
            unknownElems:!!g.getElementsByTagName("nav").length,checkOn:n.value === "on",optSelected:v.selected,getSetAttribute:g.className !== "t",enctype:!!aa.createElement("form").enctype,submitBubbles:true,changeBubbles:true,focusinBubbles:false,deleteExpando:true,noCloneEvent:true,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableMarginRight:true};
        n.checked = true;
        z.noCloneChecked = n.cloneNode(true).checked;
        q.disabled = true;
        z.optDisabled = !v.disabled;
        try {
            delete g.test
        } catch(pa) {
            z.deleteExpando = false
        }
        if (!g.addEventListener &&
                g.attachEvent && g.fireEvent) {
            g.attachEvent("onclick", function() {
                z.noCloneEvent = false
            });
            g.cloneNode(true).fireEvent("onclick")
        }
        n = aa.createElement("input");
        n.value = "t";
        n.setAttribute("type", "radio");
        z.radioValue = n.value === "t";
        n.setAttribute("checked", "checked");
        g.appendChild(n);
        p = aa.createDocumentFragment();
        p.appendChild(g.lastChild);
        z.checkClone = p.cloneNode(true).cloneNode(true).lastChild.checked;
        g.innerHTML = "";
        g.style.width = g.style.paddingLeft = "1px";
        D = aa.getElementsByTagName("body")[0];
        P = aa.createElement(D ?
                "div" : "body");
        p = {visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"};
        D && m.extend(p, {position:"absolute",left:"-999px",top:"-999px"});
        for (T in p)P.style[T] = p[T];
        P.appendChild(g);
        k = D || k;
        k.insertBefore(P, k.firstChild);
        z.appendChecked = n.checked;
        z.boxModel = g.offsetWidth === 2;
        if ("zoom"in g.style) {
            g.style.display = "inline";
            g.style.zoom = 1;
            z.inlineBlockNeedsLayout = g.offsetWidth === 2;
            g.style.display = "";
            g.innerHTML = "<div style='width:4px;'></div>";
            z.shrinkWrapBlocks = g.offsetWidth !== 2
        }
        g.innerHTML =
                "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
        p = g.getElementsByTagName("td");
        n = p[0].offsetHeight === 0;
        p[0].style.display = "";
        p[1].style.display = "none";
        z.reliableHiddenOffsets = n && p[0].offsetHeight === 0;
        g.innerHTML = "";
        if (aa.defaultView && aa.defaultView.getComputedStyle) {
            n = aa.createElement("div");
            n.style.width = "0";
            n.style.marginRight = "0";
            g.appendChild(n);
            z.reliableMarginRight = (parseInt((aa.defaultView.getComputedStyle(n, null) || {marginRight:0}).marginRight, 10) || 0) ===
                    0
        }
        if (g.attachEvent)for (T in{submit:1,change:1,focusin:1}) {
            p = "on" + T;
            n = p in g;
            if (!n) {
                g.setAttribute(p, "return;");
                n = typeof g[p] === "function"
            }
            z[T + "Bubbles"] = n
        }
        m(function() {
            var X,ra,ja,Ia;
            if (D = aa.getElementsByTagName("body")[0]) {
                X = aa.createElement("div");
                X.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
                D.insertBefore(X, D.firstChild);
                P = aa.createElement("div");
                P.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;visibility:hidden;border:0;";
                P.innerHTML = "<div style='position:absolute;top:0;left:0;width:1px;height:1px;margin:0;border:5px solid #000;padding:0;'><div></div></div><table style='position:absolute;top:0;left:0;width:1px;height:1px;margin:0;border:5px solid #000;padding:0;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
                X.appendChild(P);
                ra = P.firstChild;
                ja = ra.firstChild;
                Ia = {doesNotAddBorder:ja.offsetTop !== 5,doesAddBorderForTableAndCells:ra.nextSibling.firstChild.firstChild.offsetTop === 5};
                ja.style.position = "fixed";
                ja.style.top = "20px";
                Ia.fixedPosition = ja.offsetTop === 20 || ja.offsetTop === 15;
                ja.style.position = ja.style.top = "";
                ra.style.overflow = "hidden";
                ra.style.position = "relative";
                Ia.subtractsBorderForOverflowNotVisible = ja.offsetTop === -5;
                Ia.doesNotIncludeMarginInBodyOffset = D.offsetTop !== 1;
                D.removeChild(X);
                P = null;
                m.extend(z, Ia)
            }
        });
        P.innerHTML = "";
        k.removeChild(P);
        P = p = q = v = D = n = g = n = null;
        return z
    }();
    m.boxModel = m.support.boxModel;
    var ya = /^(?:\{.*\}|\[.*\])$/,Da = /([A-Z])/g;
    m.extend({cache:{},uuid:0,expando:"jQuery" + (m.fn.jquery +
            Math.random()).replace(/\D/g, ""),noData:{embed:true,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:true},hasData:function(g) {
        g = g.nodeType ? m.cache[g[m.expando]] : g[m.expando];
        return!!g && !e(g)
    },data:function(g, k, n, p) {
        if (m.acceptData(g)) {
            var q,v = typeof k === "string",z = (q = g.nodeType) ? m.cache : g,D = q ? g[m.expando] : g[m.expando] && m.expando,P = k === "events";
            if (!((!D || !z[D] || !P && !p && !z[D].data) && v && n === d)) {
                if (!D)if (q)g[m.expando] = D = ++m.uuid; else D = m.expando;
                if (!z[D]) {
                    z[D] = {};
                    if (!q)z[D].toJSON = m.noop
                }
                if (typeof k ===
                        "object" || typeof k === "function")if (p)z[D] = m.extend(z[D], k); else z[D].data = m.extend(z[D].data, k);
                q = g = z[D];
                if (!p) {
                    if (!g.data)g.data = {};
                    g = g.data
                }
                if (n !== d)g[m.camelCase(k)] = n;
                if (P && !g[k])return q.events;
                if (v) {
                    n = g[k];
                    if (n == null)n = g[m.camelCase(k)]
                } else n = g;
                return n
            }
        }
    },removeData:function(g, k, n) {
        if (m.acceptData(g)) {
            var p,q,v,z = g.nodeType,D = z ? m.cache : g,P = z ? g[m.expando] : m.expando;
            if (D[P]) {
                if (k)if (p = n ? D[P] : D[P].data) {
                    if (!m.isArray(k))if (k in p)k = [k]; else {
                        k = m.camelCase(k);
                        k = k in p ? [k] : k.split(" ")
                    }
                    q = 0;
                    for (v =
                                 k.length; q < v; q++)delete p[k[q]];
                    if (!(n ? e : m.isEmptyObject)(p))return
                }
                if (!n) {
                    delete D[P].data;
                    if (!e(D[P]))return
                }
                if (m.support.deleteExpando || !D.setInterval)delete D[P]; else D[P] = null;
                if (z)if (m.support.deleteExpando)delete g[m.expando]; else if (g.removeAttribute)g.removeAttribute(m.expando); else g[m.expando] = null
            }
        }
    },_data:function(g, k, n) {
        return m.data(g, k, n, true)
    },acceptData:function(g) {
        if (g.nodeName) {
            var k = m.noData[g.nodeName.toLowerCase()];
            if (k)return!(k === true || g.getAttribute("classid") !== k)
        }
        return true
    }});
    m.fn.extend({data:function(g, k) {
        var n,p,q,v = null;
        if (typeof g === "undefined") {
            if (this.length) {
                v = m.data(this[0]);
                if (this[0].nodeType === 1 && !m._data(this[0], "parsedAttrs")) {
                    p = this[0].attributes;
                    for (var z = 0,D = p.length; z < D; z++) {
                        q = p[z].name;
                        if (q.indexOf("data-") === 0) {
                            q = m.camelCase(q.substring(5));
                            b(this[0], q, v[q])
                        }
                    }
                    m._data(this[0], "parsedAttrs", true)
                }
            }
            return v
        } else if (typeof g === "object")return this.each(function() {
            m.data(this, g)
        });
        n = g.split(".");
        n[1] = n[1] ? "." + n[1] : "";
        if (k === d) {
            v = this.triggerHandler("getData" +
                    n[1] + "!", [n[0]]);
            if (v === d && this.length) {
                v = m.data(this[0], g);
                v = b(this[0], g, v)
            }
            return v === d && n[1] ? this.data(n[0]) : v
        } else return this.each(function() {
            var P = m(this),T = [n[0],k];
            P.triggerHandler("setData" + n[1] + "!", T);
            m.data(this, g, k);
            P.triggerHandler("changeData" + n[1] + "!", T)
        })
    },removeData:function(g) {
        return this.each(function() {
            m.removeData(this, g)
        })
    }});
    m.extend({_mark:function(g, k) {
        if (g) {
            k = (k || "fx") + "mark";
            m._data(g, k, (m._data(g, k) || 0) + 1)
        }
    },_unmark:function(g, k, n) {
        if (g !== true) {
            n = k;
            k = g;
            g = false
        }
        if (k) {
            n =
                    n || "fx";
            var p = n + "mark";
            if (g = g ? 0 : (m._data(k, p) || 1) - 1)m._data(k, p, g); else {
                m.removeData(k, p, true);
                f(k, n, "mark")
            }
        }
    },queue:function(g, k, n) {
        var p;
        if (g) {
            k = (k || "fx") + "queue";
            p = m._data(g, k);
            if (n)if (!p || m.isArray(n))p = m._data(g, k, m.makeArray(n)); else p.push(n);
            return p || []
        }
    },dequeue:function(g, k) {
        k = k || "fx";
        var n = m.queue(g, k),p = n.shift(),q = {};
        if (p === "inprogress")p = n.shift();
        if (p) {
            k === "fx" && n.unshift("inprogress");
            m._data(g, k + ".run", q);
            p.call(g, function() {
                m.dequeue(g, k)
            }, q)
        }
        if (!n.length) {
            m.removeData(g, k + "queue " +
                    k + ".run", true);
            f(g, k, "queue")
        }
    }});
    m.fn.extend({queue:function(g, k) {
        if (typeof g !== "string") {
            k = g;
            g = "fx"
        }
        if (k === d)return m.queue(this[0], g);
        return this.each(function() {
            var n = m.queue(this, g, k);
            g === "fx" && n[0] !== "inprogress" && m.dequeue(this, g)
        })
    },dequeue:function(g) {
        return this.each(function() {
            m.dequeue(this, g)
        })
    },delay:function(g, k) {
        g = m.fx ? m.fx.speeds[g] || g : g;
        k = k || "fx";
        return this.queue(k, function(n, p) {
            var q = setTimeout(n, g);
            p.stop = function() {
                clearTimeout(q)
            }
        })
    },clearQueue:function(g) {
        return this.queue(g ||
                "fx", [])
    },promise:function(g, k) {
        function n() {
            --z || p.resolveWith(q, [q])
        }

        if (typeof g !== "string") {
            k = g;
            g = d
        }
        g = g || "fx";
        for (var p = m.Deferred(),q = this,v = q.length,z = 1,D = g + "defer",P = g + "queue",T = g + "mark",pa; v--;)if (pa = m.data(q[v], D, d, true) || (m.data(q[v], P, d, true) || m.data(q[v], T, d, true)) && m.data(q[v], D, m.Callbacks("once memory"), true)) {
            z++;
            pa.add(n)
        }
        n();
        return p.promise()
    }});
    var Ba = /[\n\t\r]/g,y = /\s+/,Q = /\r/g,ua = /^(?:button|input)$/i,oa = /^(?:button|input|object|select|textarea)$/i,O = /^a(?:rea)?$/i,Z = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
            la = m.support.getSetAttribute,va,xa,Fa;
    m.fn.extend({attr:function(g, k) {
        return m.access(this, g, k, true, m.attr)
    },removeAttr:function(g) {
        return this.each(function() {
            m.removeAttr(this, g)
        })
    },prop:function(g, k) {
        return m.access(this, g, k, true, m.prop)
    },removeProp:function(g) {
        g = m.propFix[g] || g;
        return this.each(function() {
            try {
                this[g] = d;
                delete this[g]
            } catch(k) {
            }
        })
    },addClass:function(g) {
        var k,n,p,q,v,z,D;
        if (m.isFunction(g))return this.each(function(P) {
            m(this).addClass(g.call(this, P, this.className))
        });
        if (g && typeof g ===
                "string") {
            k = g.split(y);
            n = 0;
            for (p = this.length; n < p; n++) {
                q = this[n];
                if (q.nodeType === 1)if (!q.className && k.length === 1)q.className = g; else {
                    v = " " + q.className + " ";
                    z = 0;
                    for (D = k.length; z < D; z++)~v.indexOf(" " + k[z] + " ") || (v += k[z] + " ");
                    q.className = m.trim(v)
                }
            }
        }
        return this
    },removeClass:function(g) {
        var k,n,p,q,v,z,D;
        if (m.isFunction(g))return this.each(function(P) {
            m(this).removeClass(g.call(this, P, this.className))
        });
        if (g && typeof g === "string" || g === d) {
            k = (g || "").split(y);
            n = 0;
            for (p = this.length; n < p; n++) {
                q = this[n];
                if (q.nodeType ===
                        1 && q.className)if (g) {
                    v = (" " + q.className + " ").replace(Ba, " ");
                    z = 0;
                    for (D = k.length; z < D; z++)v = v.replace(" " + k[z] + " ", " ");
                    q.className = m.trim(v)
                } else q.className = ""
            }
        }
        return this
    },toggleClass:function(g, k) {
        var n = typeof g,p = typeof k === "boolean";
        if (m.isFunction(g))return this.each(function(q) {
            m(this).toggleClass(g.call(this, q, this.className, k), k)
        });
        return this.each(function() {
            if (n === "string")for (var q,v = 0,z = m(this),D = k,P = g.split(y); q = P[v++];) {
                D = p ? D : !z.hasClass(q);
                z[D ? "addClass" : "removeClass"](q)
            } else if (n ===
                    "undefined" || n === "boolean") {
                this.className && m._data(this, "__className__", this.className);
                this.className = this.className || g === false ? "" : m._data(this, "__className__") || ""
            }
        })
    },hasClass:function(g) {
        g = " " + g + " ";
        for (var k = 0,n = this.length; k < n; k++)if (this[k].nodeType === 1 && (" " + this[k].className + " ").replace(Ba, " ").indexOf(g) > -1)return true;
        return false
    },val:function(g) {
        var k,n,p,q = this[0];
        if (!arguments.length) {
            if (q) {
                if ((k = m.valHooks[q.nodeName.toLowerCase()] || m.valHooks[q.type]) && "get"in k && (n = k.get(q, "value")) !==
                        d)return n;
                n = q.value;
                return typeof n === "string" ? n.replace(Q, "") : n == null ? "" : n
            }
            return d
        }
        p = m.isFunction(g);
        return this.each(function(v) {
            var z = m(this);
            if (this.nodeType === 1) {
                v = p ? g.call(this, v, z.val()) : g;
                if (v == null)v = ""; else if (typeof v === "number")v += ""; else if (m.isArray(v))v = m.map(v, function(D) {
                    return D == null ? "" : D + ""
                });
                k = m.valHooks[this.nodeName.toLowerCase()] || m.valHooks[this.type];
                if (!k || !("set"in k) || k.set(this, v, "value") === d)this.value = v
            }
        })
    }});
    m.extend({valHooks:{option:{get:function(g) {
        var k = g.attributes.value;
        return!k || k.specified ? g.value : g.text
    }},select:{get:function(g) {
        var k,n,p = g.selectedIndex,q = [],v = g.options,z = g.type === "select-one";
        if (p < 0)return null;
        g = z ? p : 0;
        for (n = z ? p + 1 : v.length; g < n; g++) {
            k = v[g];
            if (k.selected && (m.support.optDisabled ? !k.disabled : k.getAttribute("disabled") === null) && (!k.parentNode.disabled || !m.nodeName(k.parentNode, "optgroup"))) {
                k = m(k).val();
                if (z)return k;
                q.push(k)
            }
        }
        if (z && !q.length && v.length)return m(v[p]).val();
        return q
    },set:function(g, k) {
        var n = m.makeArray(k);
        m(g).find("option").each(function() {
            this.selected =
                    m.inArray(m(this).val(), n) >= 0
        });
        if (!n.length)g.selectedIndex = -1;
        return n
    }}},attrFn:{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true},attr:function(g, k, n, p) {
        var q,v,z = g.nodeType;
        if (!g || z === 3 || z === 8 || z === 2)return d;
        if (p && k in m.attrFn)return m(g)[k](n);
        if (!("getAttribute"in g))return m.prop(g, k, n);
        if (p = z !== 1 || !m.isXMLDoc(g)) {
            k = k.toLowerCase();
            v = m.attrHooks[k] || (Z.test(k) ? xa : va)
        }
        if (n !== d)if (n === null) {
            m.removeAttr(g, k);
            return d
        } else if (v && "set"in v && p && (q = v.set(g, n,
                k)) !== d)return q; else {
            g.setAttribute(k, "" + n);
            return n
        } else if (v && "get"in v && p && (q = v.get(g, k)) !== null)return q; else {
            q = g.getAttribute(k);
            return q === null ? d : q
        }
    },removeAttr:function(g, k) {
        var n,p,q,v,z = 0;
        if (g.nodeType === 1) {
            p = (k || "").split(y);
            for (v = p.length; z < v; z++) {
                q = p[z].toLowerCase();
                n = m.propFix[q] || q;
                m.attr(g, q, "");
                g.removeAttribute(la ? q : n);
                if (Z.test(q) && n in g)g[n] = false
            }
        }
    },attrHooks:{type:{set:function(g, k) {
        if (ua.test(g.nodeName) && g.parentNode)m.error("type property can't be changed"); else if (!m.support.radioValue &&
                k === "radio" && m.nodeName(g, "input")) {
            var n = g.value;
            g.setAttribute("type", k);
            if (n)g.value = n;
            return k
        }
    }},value:{get:function(g, k) {
        if (va && m.nodeName(g, "button"))return va.get(g, k);
        return k in g ? g.value : null
    },set:function(g, k, n) {
        if (va && m.nodeName(g, "button"))return va.set(g, k, n);
        g.value = k
    }}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",
        contenteditable:"contentEditable"},prop:function(g, k, n) {
        var p,q,v = g.nodeType;
        if (!g || v === 3 || v === 8 || v === 2)return d;
        if (v !== 1 || !m.isXMLDoc(g)) {
            k = m.propFix[k] || k;
            q = m.propHooks[k]
        }
        return n !== d ? q && "set"in q && (p = q.set(g, n, k)) !== d ? p : g[k] = n : q && "get"in q && (p = q.get(g, k)) !== null ? p : g[k]
    },propHooks:{tabIndex:{get:function(g) {
        var k = g.getAttributeNode("tabindex");
        return k && k.specified ? parseInt(k.value, 10) : oa.test(g.nodeName) || O.test(g.nodeName) && g.href ? 0 : d
    }}}});
    m.attrHooks.tabindex = m.propHooks.tabIndex;
    xa = {get:function(g, k) {
        var n,p = m.prop(g, k);
        return p === true || typeof p !== "boolean" && (n = g.getAttributeNode(k)) && n.nodeValue !== false ? k.toLowerCase() : d
    },set:function(g, k, n) {
        if (k === false)m.removeAttr(g, n); else {
            k = m.propFix[n] || n;
            if (k in g)g[k] = true;
            g.setAttribute(n, n.toLowerCase())
        }
        return n
    }};
    if (!la) {
        Fa = {name:true,id:true};
        va = m.valHooks.button = {get:function(g, k) {
            var n;
            return(n = g.getAttributeNode(k)) && (Fa[k] ? n.nodeValue !== "" : n.specified) ? n.nodeValue : d
        },set:function(g, k, n) {
            var p = g.getAttributeNode(n);
            if (!p) {
                p = aa.createAttribute(n);
                g.setAttributeNode(p)
            }
            return p.nodeValue = k + ""
        }};
        m.attrHooks.tabindex.set = va.set;
        m.each(["width","height"], function(g, k) {
            m.attrHooks[k] = m.extend(m.attrHooks[k], {set:function(n, p) {
                if (p === "") {
                    n.setAttribute(k, "auto");
                    return p
                }
            }})
        });
        m.attrHooks.contenteditable = {get:va.get,set:function(g, k, n) {
            if (k === "")k = "false";
            va.set(g, k, n)
        }}
    }
    m.support.hrefNormalized || m.each(["href","src","width","height"], function(g, k) {
        m.attrHooks[k] = m.extend(m.attrHooks[k], {get:function(n) {
            n = n.getAttribute(k, 2);
            return n === null ? d : n
        }})
    });
    if (!m.support.style)m.attrHooks.style = {get:function(g) {
        return g.style.cssText.toLowerCase() || d
    },set:function(g, k) {
        return g.style.cssText = "" + k
    }};
    if (!m.support.optSelected)m.propHooks.selected = m.extend(m.propHooks.selected, {get:function() {
        return null
    }});
    if (!m.support.enctype)m.propFix.enctype = "encoding";
    m.support.checkOn || m.each(["radio","checkbox"], function() {
        m.valHooks[this] = {get:function(g) {
            return g.getAttribute("value") === null ? "on" : g.value
        }}
    });
    m.each(["radio","checkbox"], function() {
        m.valHooks[this] =
                m.extend(m.valHooks[this], {set:function(g, k) {
                    if (m.isArray(k))return g.checked = m.inArray(m(g).val(), k) >= 0
                }})
    });
    var Ha = /^(?:textarea|input|select)$/i,Pa = /^([^\.]*)?(?:\.(.+))?$/,Qa = /\bhover(\.\S+)?/,sb = /^key/,wb = /^(?:mouse|contextmenu)|click/,fb = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,db = function(g) {
        if (g = fb.exec(g)) {
            g[1] = (g[1] || "").toLowerCase();
            g[3] = g[3] && RegExp("(?:^|\\s)" + g[3] + "(?:\\s|$)")
        }
        return g
    },jb = function(g) {
        return m.event.special.hover ? g : g.replace(Qa, "mouseenter$1 mouseleave$1")
    };
    m.event =
    {add:function(g, k, n, p, q) {
        var v,z,D,P,T,pa,X,ra,ja;
        if (!(g.nodeType === 3 || g.nodeType === 8 || !k || !n || !(v = m._data(g)))) {
            if (n.handler) {
                X = n;
                n = X.handler
            }
            if (!n.guid)n.guid = m.guid++;
            D = v.events;
            if (!D)v.events = D = {};
            z = v.handle;
            if (!z) {
                v.handle = z = function(Ia) {
                    return typeof m !== "undefined" && (!Ia || m.event.triggered !== Ia.type) ? m.event.dispatch.apply(z.elem, arguments) : d
                };
                z.elem = g
            }
            k = jb(k).split(" ");
            for (v = 0; v < k.length; v++) {
                P = Pa.exec(k[v]) || [];
                T = P[1];
                pa = (P[2] || "").split(".").sort();
                ja = m.event.special[T] || {};
                T = (q ? ja.delegateType :
                        ja.bindType) || T;
                ja = m.event.special[T] || {};
                P = m.extend({type:T,origType:P[1],data:p,handler:n,guid:n.guid,selector:q,namespace:pa.join(".")}, X);
                if (q) {
                    P.quick = db(q);
                    if (!P.quick && m.expr.match.POS.test(q))P.isPositional = true
                }
                ra = D[T];
                if (!ra) {
                    ra = D[T] = [];
                    ra.delegateCount = 0;
                    if (!ja.setup || ja.setup.call(g, p, pa, z) === false)if (g.addEventListener)g.addEventListener(T, z, false); else g.attachEvent && g.attachEvent("on" + T, z)
                }
                if (ja.add) {
                    ja.add.call(g, P);
                    if (!P.handler.guid)P.handler.guid = n.guid
                }
                q ? ra.splice(ra.delegateCount++,
                        0, P) : ra.push(P);
                m.event.global[T] = true
            }
            g = null
        }
    },global:{},remove:function(g, k, n, p) {
        var q = m.hasData(g) && m._data(g),v,z,D,P,T,pa,X,ra,ja;
        if (q && (pa = q.events)) {
            k = jb(k || "").split(" ");
            for (v = 0; v < k.length; v++) {
                z = Pa.exec(k[v]) || [];
                D = z[1];
                z = z[2];
                if (!D) {
                    z = z ? "." + z : "";
                    for (T in pa)m.event.remove(g, T + z, n, p);
                    return
                }
                X = m.event.special[D] || {};
                D = (p ? X.delegateType : X.bindType) || D;
                ra = pa[D] || [];
                P = ra.length;
                z = z ? RegExp("(^|\\.)" + z.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                if (n || z || p || X.remove)for (T = 0; T < ra.length; T++) {
                    ja =
                            ra[T];
                    if (!n || n.guid === ja.guid)if (!z || z.test(ja.namespace))if (!p || p === ja.selector || p === "**" && ja.selector) {
                        ra.splice(T--, 1);
                        ja.selector && ra.delegateCount--;
                        X.remove && X.remove.call(g, ja)
                    }
                } else ra.length = 0;
                if (ra.length === 0 && P !== ra.length) {
                    if (!X.teardown || X.teardown.call(g, z) === false)m.removeEvent(g, D, q.handle);
                    delete pa[D]
                }
            }
            if (m.isEmptyObject(pa)) {
                if (k = q.handle)k.elem = null;
                m.removeData(g, ["events","handle"], true)
            }
        }
    },customEvent:{getData:true,setData:true,changeData:true},trigger:function(g, k, n, p) {
        if (!(n &&
                (n.nodeType === 3 || n.nodeType === 8))) {
            var q = g.type || g,v = [],z,D,P,T;
            if (q.indexOf("!") >= 0) {
                q = q.slice(0, -1);
                z = true
            }
            if (q.indexOf(".") >= 0) {
                v = q.split(".");
                q = v.shift();
                v.sort()
            }
            if (!((!n || m.event.customEvent[q]) && !m.event.global[q])) {
                g = typeof g === "object" ? g[m.expando] ? g : new m.Event(q, g) : new m.Event(q);
                g.type = q;
                g.isTrigger = true;
                g.exclusive = z;
                g.namespace = v.join(".");
                g.namespace_re = g.namespace ? RegExp("(^|\\.)" + v.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                v = q.indexOf(":") < 0 ? "on" + q : "";
                if (p || !n)g.preventDefault();
                if (n) {
                    g.result =
                            d;
                    if (!g.target)g.target = n;
                    k = k != null ? m.makeArray(k) : [];
                    k.unshift(g);
                    z = m.event.special[q] || {};
                    if (!(z.trigger && z.trigger.apply(n, k) === false)) {
                        T = [
                            [n,z.bindType || q]
                        ];
                        if (!p && !z.noBubble && !m.isWindow(n)) {
                            P = z.delegateType || q;
                            D = null;
                            for (p = n.parentNode; p; p = p.parentNode) {
                                T.push([p,P]);
                                D = p
                            }
                            if (D && D === n.ownerDocument)T.push([D.defaultView || D.parentWindow || a,P])
                        }
                        for (D = 0; D < T.length; D++) {
                            p = T[D][0];
                            g.type = T[D][1];
                            (P = (m._data(p, "events") || {})[g.type] && m._data(p, "handle")) && P.apply(p, k);
                            (P = v && p[v]) && m.acceptData(p) &&
                            P.apply(p, k);
                            if (g.isPropagationStopped())break
                        }
                        g.type = q;
                        if (!g.isDefaultPrevented())if ((!z._default || z._default.apply(n.ownerDocument, k) === false) && !(q === "click" && m.nodeName(n, "a")) && m.acceptData(n))if (v && n[q] && (q !== "focus" && q !== "blur" || g.target.offsetWidth !== 0) && !m.isWindow(n)) {
                            if (D = n[v])n[v] = null;
                            m.event.triggered = q;
                            n[q]();
                            m.event.triggered = d;
                            if (D)n[v] = D
                        }
                        return g.result
                    }
                } else {
                    n = m.cache;
                    for (D in n)n[D].events && n[D].events[q] && m.event.trigger(g, k, n[D].handle.elem, true)
                }
            }
        }
    },dispatch:function(g) {
        g = m.event.fix(g ||
                a.event);
        var k = (m._data(this, "events") || {})[g.type] || [],n = k.delegateCount,p = [].slice.call(arguments, 0),q = !g.exclusive && !g.namespace,v = (m.event.special[g.type] || {}).handle,z = [],D,P,T,pa,X,ra,ja;
        p[0] = g;
        g.delegateTarget = this;
        if (n && !g.target.disabled && !(g.button && g.type === "click"))for (P = g.target; P != this; P = P.parentNode || this) {
            pa = {};
            X = [];
            for (D = 0; D < n; D++) {
                T = k[D];
                ra = T.selector;
                ja = pa[ra];
                if (T.isPositional)ja = (ja || (pa[ra] = m(ra))).index(P) >= 0; else if (ja === d)ja = pa[ra] = T.quick ? (!T.quick[1] || P.nodeName.toLowerCase() ===
                        T.quick[1]) && (!T.quick[2] || P.id === T.quick[2]) && (!T.quick[3] || T.quick[3].test(P.className)) : m(P).is(ra);
                ja && X.push(T)
            }
            X.length && z.push({elem:P,matches:X})
        }
        k.length > n && z.push({elem:this,matches:k.slice(n)});
        for (D = 0; D < z.length && !g.isPropagationStopped(); D++) {
            n = z[D];
            g.currentTarget = n.elem;
            for (k = 0; k < n.matches.length && !g.isImmediatePropagationStopped(); k++) {
                T = n.matches[k];
                if (q || !g.namespace && !T.namespace || g.namespace_re && g.namespace_re.test(T.namespace)) {
                    g.data = T.data;
                    g.handleObj = T;
                    T = (v || T.handler).apply(n.elem,
                            p);
                    if (T !== d) {
                        g.result = T;
                        if (T === false) {
                            g.preventDefault();
                            g.stopPropagation()
                        }
                    }
                }
            }
        }
        return g.result
    },props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(g, k) {
        if (g.which == null)g.which = k.charCode != null ? k.charCode : k.keyCode;
        return g
    }},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement wheelDelta".split(" "),
        filter:function(g, k) {
            var n,p,q = k.button,v = k.fromElement;
            if (g.pageX == null && k.clientX != null) {
                n = g.target.ownerDocument || aa;
                p = n.documentElement;
                n = n.body;
                g.pageX = k.clientX + (p && p.scrollLeft || n && n.scrollLeft || 0) - (p && p.clientLeft || n && n.clientLeft || 0);
                g.pageY = k.clientY + (p && p.scrollTop || n && n.scrollTop || 0) - (p && p.clientTop || n && n.clientTop || 0)
            }
            if (!g.relatedTarget && v)g.relatedTarget = v === g.target ? k.toElement : v;
            if (!g.which && q !== d)g.which = q & 1 ? 1 : q & 2 ? 3 : q & 4 ? 2 : 0;
            return g
        }},fix:function(g) {
        if (g[m.expando])return g;
        var k,
                n,p = g,q = m.event.fixHooks[g.type] || {},v = q.props ? this.props.concat(q.props) : this.props;
        g = m.Event(p);
        for (k = v.length; k;) {
            n = v[--k];
            g[n] = p[n]
        }
        if (!g.target)g.target = p.srcElement || aa;
        if (g.target.nodeType === 3)g.target = g.target.parentNode;
        if (g.metaKey === d)g.metaKey = g.ctrlKey;
        return q.filter ? q.filter(g, p) : g
    },special:{ready:{setup:m.bindReady},focus:{delegateType:"focusin",noBubble:true},blur:{delegateType:"focusout",noBubble:true},beforeunload:{setup:function(g, k, n) {
        if (m.isWindow(this))this.onbeforeunload = n
    },
        teardown:function(g, k) {
            if (this.onbeforeunload === k)this.onbeforeunload = null
        }}},simulate:function(g, k, n, p) {
        g = m.extend(new m.Event, n, {type:g,isSimulated:true,originalEvent:{}});
        p ? m.event.trigger(g, null, k) : m.event.dispatch.call(k, g);
        g.isDefaultPrevented() && n.preventDefault()
    }};
    m.event.handle = m.event.dispatch;
    m.removeEvent = aa.removeEventListener ? function(g, k, n) {
        g.removeEventListener && g.removeEventListener(k, n, false)
    } : function(g, k, n) {
        g.detachEvent && g.detachEvent("on" + k, n)
    };
    m.Event = function(g, k) {
        if (!(this instanceof
                m.Event))return new m.Event(g, k);
        if (g && g.type) {
            this.originalEvent = g;
            this.type = g.type;
            this.isDefaultPrevented = g.defaultPrevented || g.returnValue === false || g.getPreventDefault && g.getPreventDefault() ? h : j
        } else this.type = g;
        k && m.extend(this, k);
        this.timeStamp = g && g.timeStamp || m.now();
        this[m.expando] = true
    };
    m.Event.prototype = {preventDefault:function() {
        this.isDefaultPrevented = h;
        var g = this.originalEvent;
        if (g)if (g.preventDefault)g.preventDefault(); else g.returnValue = false
    },stopPropagation:function() {
        this.isPropagationStopped =
                h;
        var g = this.originalEvent;
        if (g) {
            g.stopPropagation && g.stopPropagation();
            g.cancelBubble = true
        }
    },stopImmediatePropagation:function() {
        this.isImmediatePropagationStopped = h;
        this.stopPropagation()
    },isDefaultPrevented:j,isPropagationStopped:j,isImmediatePropagationStopped:j};
    m.each({mouseenter:"mouseover",mouseleave:"mouseout"}, function(g, k) {
        m.event.special[g] = m.event.special[k] = {delegateType:k,bindType:k,handle:function(n) {
            var p = n.relatedTarget,q = n.handleObj,v;
            if (!p || q.origType === n.type || p !== this && !m.contains(this,
                    p)) {
                p = n.type;
                n.type = q.origType;
                v = q.handler.apply(this, arguments);
                n.type = p
            }
            return v
        }}
    });
    if (!m.support.submitBubbles)m.event.special.submit = {setup:function() {
        if (m.nodeName(this, "form"))return false;
        m.event.add(this, "click._submit keypress._submit", function(g) {
            g = g.target;
            if ((g = m.nodeName(g, "input") || m.nodeName(g, "button") ? g.form : d) && !g._submit_attached) {
                m.event.add(g, "submit._submit", function(k) {
                    this.parentNode && m.event.simulate("submit", this.parentNode, k, true)
                });
                g._submit_attached = true
            }
        })
    },teardown:function() {
        if (m.nodeName(this,
                "form"))return false;
        m.event.remove(this, "._submit")
    }};
    if (!m.support.changeBubbles)m.event.special.change = {setup:function() {
        if (Ha.test(this.nodeName)) {
            if (this.type === "checkbox" || this.type === "radio") {
                m.event.add(this, "propertychange._change", function(g) {
                    if (g.originalEvent.propertyName === "checked")this._just_changed = true
                });
                m.event.add(this, "click._change", function(g) {
                    if (this._just_changed) {
                        this._just_changed = false;
                        m.event.simulate("change", this, g, true)
                    }
                })
            }
            return false
        }
        m.event.add(this, "beforeactivate._change",
                function(g) {
                    g = g.target;
                    if (Ha.test(g.nodeName) && !g._change_attached) {
                        m.event.add(g, "change._change", function(k) {
                            this.parentNode && !k.isSimulated && m.event.simulate("change", this.parentNode, k, true)
                        });
                        g._change_attached = true
                    }
                })
    },handle:function(g) {
        var k = g.target;
        if (this !== k || g.isSimulated || g.isTrigger || k.type !== "radio" && k.type !== "checkbox")return g.handleObj.handler.apply(this, arguments)
    },teardown:function() {
        m.event.remove(this, "._change");
        return Ha.test(this.nodeName)
    }};
    m.support.focusinBubbles || m.each({focus:"focusin",
        blur:"focusout"}, function(g, k) {
        var n = 0,p = function(q) {
            m.event.simulate(k, q.target, m.event.fix(q), true)
        };
        m.event.special[k] = {setup:function() {
            n++ === 0 && aa.addEventListener(g, p, true)
        },teardown:function() {
            --n === 0 && aa.removeEventListener(g, p, true)
        }}
    });
    m.fn.extend({on:function(g, k, n, p, q) {
        var v,z;
        if (typeof g === "object") {
            if (typeof k !== "string") {
                n = k;
                k = d
            }
            for (z in g)this.on(z, k, n, g[z], q);
            return this
        }
        if (n == null && p == null) {
            p = k;
            n = k = d
        } else if (p == null)if (typeof k === "string") {
            p = n;
            n = d
        } else {
            p = n;
            n = k;
            k = d
        }
        if (p === false)p =
                j; else if (!p)return this;
        if (q === 1) {
            v = p;
            p = function(D) {
                m().off(D);
                return v.apply(this, arguments)
            };
            p.guid = v.guid || (v.guid = m.guid++)
        }
        return this.each(function() {
            m.event.add(this, g, p, n, k)
        })
    },one:function(g, k, n, p) {
        return this.on.call(this, g, k, n, p, 1)
    },off:function(g, k, n) {
        if (g && g.preventDefault && g.handleObj) {
            var p = g.handleObj;
            m(g.delegateTarget).off(p.namespace ? p.type + "." + p.namespace : p.type, p.selector, p.handler);
            return this
        }
        if (typeof g === "object") {
            for (p in g)this.off(p, k, g[p]);
            return this
        }
        if (k === false || typeof k ===
                "function") {
            n = k;
            k = d
        }
        if (n === false)n = j;
        return this.each(function() {
            m.event.remove(this, g, n, k)
        })
    },bind:function(g, k, n) {
        return this.on(g, null, k, n)
    },unbind:function(g, k) {
        return this.off(g, null, k)
    },live:function(g, k, n) {
        m(this.context).on(g, this.selector, k, n);
        return this
    },die:function(g, k) {
        m(this.context).off(g, this.selector || "**", k);
        return this
    },delegate:function(g, k, n, p) {
        return this.on(k, g, n, p)
    },undelegate:function(g, k, n) {
        return arguments.length == 1 ? this.off(g, "**") : this.off(k, g, n)
    },trigger:function(g, k) {
        return this.each(function() {
            m.event.trigger(g, k, this)
        })
    },triggerHandler:function(g, k) {
        if (this[0])return m.event.trigger(g, k, this[0], true)
    },toggle:function(g) {
        var k = arguments,n = g.guid || m.guid++,p = 0,q = function(v) {
            var z = (m._data(this, "lastToggle" + g.guid) || 0) % p;
            m._data(this, "lastToggle" + g.guid, z + 1);
            v.preventDefault();
            return k[z].apply(this, arguments) || false
        };
        for (q.guid = n; p < k.length;)k[p++].guid = n;
        return this.click(q)
    },hover:function(g, k) {
        return this.mouseenter(g).mouseleave(k || g)
    }});
    m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
            function(g, k) {
                m.fn[k] = function(n, p) {
                    if (p == null) {
                        p = n;
                        n = null
                    }
                    return arguments.length > 0 ? this.bind(k, n, p) : this.trigger(k)
                };
                if (m.attrFn)m.attrFn[k] = true;
                if (sb.test(k))m.event.fixHooks[k] = m.event.keyHooks;
                if (wb.test(k))m.event.fixHooks[k] = m.event.mouseHooks
            });
    (function() {
        function g(t, B, L, M, R, S) {
            R = 0;
            for (var ma = M.length; R < ma; R++) {
                var da = M[R];
                if (da) {
                    var wa = false;
                    for (da = da[t]; da;) {
                        if (da[p] === L) {
                            wa = M[da.sizset];
                            break
                        }
                        if (da.nodeType === 1 && !S) {
                            da[p] = L;
                            da.sizset = R
                        }
                        if (da.nodeName.toLowerCase() === B) {
                            wa = da;
                            break
                        }
                        da =
                                da[t]
                    }
                    M[R] = wa
                }
            }
        }

        function k(t, B, L, M, R, S) {
            R = 0;
            for (var ma = M.length; R < ma; R++) {
                var da = M[R];
                if (da) {
                    var wa = false;
                    for (da = da[t]; da;) {
                        if (da[p] === L) {
                            wa = M[da.sizset];
                            break
                        }
                        if (da.nodeType === 1) {
                            if (!S) {
                                da[p] = L;
                                da.sizset = R
                            }
                            if (typeof B !== "string") {
                                if (da === B) {
                                    wa = true;
                                    break
                                }
                            } else if (X.filter(B, [da]).length > 0) {
                                wa = da;
                                break
                            }
                        }
                        da = da[t]
                    }
                    M[R] = wa
                }
            }
        }

        var n = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,p = "sizcache" + (Math.random() + "").replace(".",
                ""),q = 0,v = Object.prototype.toString,z = false,D = true,P = /\\/g,T = /\r\n/g,pa = /\W/;
        [0,0].sort(function() {
            D = false;
            return 0
        });
        var X = function(t, B, L, M) {
            L = L || [];
            var R = B = B || aa;
            if (B.nodeType !== 1 && B.nodeType !== 9)return[];
            if (!t || typeof t !== "string")return L;
            var S,ma,da,wa,za,E = true,ga = X.isXML(B),ia = [],na = t;
            do{
                n.exec("");
                if (S = n.exec(na)) {
                    na = S[3];
                    ia.push(S[1]);
                    if (S[2]) {
                        wa = S[3];
                        break
                    }
                }
            } while (S);
            if (ia.length > 1 && Ia.exec(t))if (ia.length === 2 && ja.relative[ia[0]])ma = ta(ia[0] + ia[1], B, M); else for (ma = ja.relative[ia[0]] ? [B] :
                    X(ia.shift(), B); ia.length;) {
                t = ia.shift();
                if (ja.relative[t])t += ia.shift();
                ma = ta(t, ma, M)
            } else {
                if (!M && ia.length > 1 && B.nodeType === 9 && !ga && ja.match.ID.test(ia[0]) && !ja.match.ID.test(ia[ia.length - 1])) {
                    S = X.find(ia.shift(), B, ga);
                    B = S.expr ? X.filter(S.expr, S.set)[0] : S.set[0]
                }
                if (B) {
                    S = M ? {expr:ia.pop(),set:w(M)} : X.find(ia.pop(), ia.length === 1 && (ia[0] === "~" || ia[0] === "+") && B.parentNode ? B.parentNode : B, ga);
                    ma = S.expr ? X.filter(S.expr, S.set) : S.set;
                    if (ia.length > 0)da = w(ma); else E = false;
                    for (; ia.length;) {
                        S = za = ia.pop();
                        if (ja.relative[za])S =
                                ia.pop(); else za = "";
                        if (S == null)S = B;
                        ja.relative[za](da, S, ga)
                    }
                } else da = []
            }
            da || (da = ma);
            da || X.error(za || t);
            if (v.call(da) === "[object Array]")if (E)if (B && B.nodeType === 1)for (t = 0; da[t] != null; t++) {
                if (da[t] && (da[t] === true || da[t].nodeType === 1 && X.contains(B, da[t])))L.push(ma[t])
            } else for (t = 0; da[t] != null; t++)da[t] && da[t].nodeType === 1 && L.push(ma[t]); else L.push.apply(L, da); else w(da, L);
            if (wa) {
                X(wa, R, L, M);
                X.uniqueSort(L)
            }
            return L
        };
        X.uniqueSort = function(t) {
            if (Y) {
                z = D;
                t.sort(Y);
                if (z)for (var B = 1; B < t.length; B++)t[B] ===
                        t[B - 1] && t.splice(B--, 1)
            }
            return t
        };
        X.matches = function(t, B) {
            return X(t, null, null, B)
        };
        X.matchesSelector = function(t, B) {
            return X(B, null, null, [t]).length > 0
        };
        X.find = function(t, B, L) {
            var M,R,S,ma,da,wa;
            if (!t)return[];
            R = 0;
            for (S = ja.order.length; R < S; R++) {
                da = ja.order[R];
                if (ma = ja.leftMatch[da].exec(t)) {
                    wa = ma[1];
                    ma.splice(1, 1);
                    if (wa.substr(wa.length - 1) !== "\\") {
                        ma[1] = (ma[1] || "").replace(P, "");
                        M = ja.find[da](ma, B, L);
                        if (M != null) {
                            t = t.replace(ja.match[da], "");
                            break
                        }
                    }
                }
            }
            M || (M = typeof B.getElementsByTagName !== "undefined" ?
                    B.getElementsByTagName("*") : []);
            return{set:M,expr:t}
        };
        X.filter = function(t, B, L, M) {
            for (var R,S,ma,da,wa,za,E,ga,ia = t,na = [],Aa = B,Ga = B && B[0] && X.isXML(B[0]); t && B.length;) {
                for (ma in ja.filter)if ((R = ja.leftMatch[ma].exec(t)) != null && R[2]) {
                    za = ja.filter[ma];
                    wa = R[1];
                    S = false;
                    R.splice(1, 1);
                    if (wa.substr(wa.length - 1) !== "\\") {
                        if (Aa === na)na = [];
                        if (ja.preFilter[ma])if (R = ja.preFilter[ma](R, Aa, L, na, M, Ga)) {
                            if (R === true)continue
                        } else S = da = true;
                        if (R)for (E = 0; (wa = Aa[E]) != null; E++)if (wa) {
                            da = za(wa, R, E, Aa);
                            ga = M ^ da;
                            if (L && da != null)if (ga)S =
                                    true; else Aa[E] = false; else if (ga) {
                                na.push(wa);
                                S = true
                            }
                        }
                        if (da !== d) {
                            L || (Aa = na);
                            t = t.replace(ja.match[ma], "");
                            if (!S)return[];
                            break
                        }
                    }
                }
                if (t === ia)if (S == null)X.error(t); else break;
                ia = t
            }
            return Aa
        };
        X.error = function(t) {
            throw"Syntax error, unrecognized expression: " + t;
        };
        var ra = X.getText = function(t) {
            var B,L;
            B = t.nodeType;
            var M = "";
            if (B)if (B === 1)if (typeof t.textContent === "string")return t.textContent; else if (typeof t.innerText === "string")return t.innerText.replace(T, ""); else for (t = t.firstChild; t; t = t.nextSibling)M +=
                    ra(t); else {
                if (B === 3 || B === 4)return t.nodeValue
            } else for (B = 0; L = t[B]; B++)if (L.nodeType !== 8)M += ra(L);
            return M
        },ja = X.selectors = {order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
            POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(t) {
            return t.getAttribute("href")
        },type:function(t) {
            return t.getAttribute("type")
        }},relative:{"+":function(t, B) {
            var L = typeof B === "string",M = L && !pa.test(B);
            L = L && !M;
            if (M)B = B.toLowerCase();
            M = 0;
            for (var R = t.length,S; M < R; M++)if (S = t[M]) {
                for (; (S = S.previousSibling) && S.nodeType !==
                        1;);
                t[M] = L || S && S.nodeName.toLowerCase() === B ? S || false : S === B
            }
            L && X.filter(B, t, true)
        },">":function(t, B) {
            var L,M = typeof B === "string",R = 0,S = t.length;
            if (M && !pa.test(B))for (B = B.toLowerCase(); R < S; R++) {
                if (L = t[R]) {
                    L = L.parentNode;
                    t[R] = L.nodeName.toLowerCase() === B ? L : false
                }
            } else {
                for (; R < S; R++)if (L = t[R])t[R] = M ? L.parentNode : L.parentNode === B;
                M && X.filter(B, t, true)
            }
        },"":function(t, B, L) {
            var M,R = q++,S = k;
            if (typeof B === "string" && !pa.test(B)) {
                M = B = B.toLowerCase();
                S = g
            }
            S("parentNode", B, R, t, M, L)
        },"~":function(t, B, L) {
            var M,R =
                    q++,S = k;
            if (typeof B === "string" && !pa.test(B)) {
                M = B = B.toLowerCase();
                S = g
            }
            S("previousSibling", B, R, t, M, L)
        }},find:{ID:function(t, B, L) {
            if (typeof B.getElementById !== "undefined" && !L)return(t = B.getElementById(t[1])) && t.parentNode ? [t] : []
        },NAME:function(t, B) {
            if (typeof B.getElementsByName !== "undefined") {
                for (var L = [],M = B.getElementsByName(t[1]),R = 0,S = M.length; R < S; R++)M[R].getAttribute("name") === t[1] && L.push(M[R]);
                return L.length === 0 ? null : L
            }
        },TAG:function(t, B) {
            if (typeof B.getElementsByTagName !== "undefined")return B.getElementsByTagName(t[1])
        }},
            preFilter:{CLASS:function(t, B, L, M, R, S) {
                t = " " + t[1].replace(P, "") + " ";
                if (S)return t;
                S = 0;
                for (var ma; (ma = B[S]) != null; S++)if (ma)if (R ^ (ma.className && (" " + ma.className + " ").replace(/[\t\n\r]/g, " ").indexOf(t) >= 0))L || M.push(ma); else if (L)B[S] = false;
                return false
            },ID:function(t) {
                return t[1].replace(P, "")
            },TAG:function(t) {
                return t[1].replace(P, "").toLowerCase()
            },CHILD:function(t) {
                if (t[1] === "nth") {
                    t[2] || X.error(t[0]);
                    t[2] = t[2].replace(/^\+|\s*/g, "");
                    var B = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(t[2] === "even" && "2n" ||
                            t[2] === "odd" && "2n+1" || !/\D/.test(t[2]) && "0n+" + t[2] || t[2]);
                    t[2] = B[1] + (B[2] || 1) - 0;
                    t[3] = B[3] - 0
                } else t[2] && X.error(t[0]);
                t[0] = q++;
                return t
            },ATTR:function(t, B, L, M, R, S) {
                B = t[1] = t[1].replace(P, "");
                if (!S && ja.attrMap[B])t[1] = ja.attrMap[B];
                t[4] = (t[4] || t[5] || "").replace(P, "");
                if (t[2] === "~=")t[4] = " " + t[4] + " ";
                return t
            },PSEUDO:function(t, B, L, M, R) {
                if (t[1] === "not")if ((n.exec(t[3]) || "").length > 1 || /^\w/.test(t[3]))t[3] = X(t[3], null, null, B); else {
                    t = X.filter(t[3], B, L, true ^ R);
                    L || M.push.apply(M, t);
                    return false
                } else if (ja.match.POS.test(t[0]) ||
                        ja.match.CHILD.test(t[0]))return true;
                return t
            },POS:function(t) {
                t.unshift(true);
                return t
            }},filters:{enabled:function(t) {
                return t.disabled === false && t.type !== "hidden"
            },disabled:function(t) {
                return t.disabled === true
            },checked:function(t) {
                return t.checked === true
            },selected:function(t) {
                return t.selected === true
            },parent:function(t) {
                return!!t.firstChild
            },empty:function(t) {
                return!t.firstChild
            },has:function(t, B, L) {
                return!!X(L[3], t).length
            },header:function(t) {
                return/h\d/i.test(t.nodeName)
            },text:function(t) {
                var B =
                        t.getAttribute("type"),L = t.type;
                return t.nodeName.toLowerCase() === "input" && "text" === L && (B === L || B === null)
            },radio:function(t) {
                return t.nodeName.toLowerCase() === "input" && "radio" === t.type
            },checkbox:function(t) {
                return t.nodeName.toLowerCase() === "input" && "checkbox" === t.type
            },file:function(t) {
                return t.nodeName.toLowerCase() === "input" && "file" === t.type
            },password:function(t) {
                return t.nodeName.toLowerCase() === "input" && "password" === t.type
            },submit:function(t) {
                var B = t.nodeName.toLowerCase();
                return(B === "input" ||
                        B === "button") && "submit" === t.type
            },image:function(t) {
                return t.nodeName.toLowerCase() === "input" && "image" === t.type
            },reset:function(t) {
                var B = t.nodeName.toLowerCase();
                return(B === "input" || B === "button") && "reset" === t.type
            },button:function(t) {
                var B = t.nodeName.toLowerCase();
                return B === "input" && "button" === t.type || B === "button"
            },input:function(t) {
                return/input|select|textarea|button/i.test(t.nodeName)
            },focus:function(t) {
                return t === t.ownerDocument.activeElement
            }},setFilters:{first:function(t, B) {
                return B === 0
            },last:function(t, B, L, M) {
                return B === M.length - 1
            },even:function(t, B) {
                return B % 2 === 0
            },odd:function(t, B) {
                return B % 2 === 1
            },lt:function(t, B, L) {
                return B < L[3] - 0
            },gt:function(t, B, L) {
                return B > L[3] - 0
            },nth:function(t, B, L) {
                return L[3] - 0 === B
            },eq:function(t, B, L) {
                return L[3] - 0 === B
            }},filter:{PSEUDO:function(t, B, L, M) {
                var R = B[1],S = ja.filters[R];
                if (S)return S(t, L, B, M); else if (R === "contains")return(t.textContent || t.innerText || ra([t]) || "").indexOf(B[3]) >= 0; else if (R === "not") {
                    B = B[3];
                    L = 0;
                    for (M = B.length; L < M; L++)if (B[L] === t)return false;
                    return true
                } else X.error(R)
            },
                CHILD:function(t, B) {
                    var L,M,R,S,ma,da;
                    L = B[1];
                    da = t;
                    switch (L) {
                        case "only":
                        case "first":
                            for (; da = da.previousSibling;)if (da.nodeType === 1)return false;
                            if (L === "first")return true;
                            da = t;
                        case "last":
                            for (; da = da.nextSibling;)if (da.nodeType === 1)return false;
                            return true;
                        case "nth":
                            L = B[2];
                            M = B[3];
                            if (L === 1 && M === 0)return true;
                            R = B[0];
                            if ((S = t.parentNode) && (S[p] !== R || !t.nodeIndex)) {
                                ma = 0;
                                for (da = S.firstChild; da; da = da.nextSibling)if (da.nodeType === 1)da.nodeIndex = ++ma;
                                S[p] = R
                            }
                            da = t.nodeIndex - M;
                            return L === 0 ? da === 0 : da % L === 0 &&
                                    da / L >= 0
                    }
                },ID:function(t, B) {
                    return t.nodeType === 1 && t.getAttribute("id") === B
                },TAG:function(t, B) {
                    return B === "*" && t.nodeType === 1 || !!t.nodeName && t.nodeName.toLowerCase() === B
                },CLASS:function(t, B) {
                    return(" " + (t.className || t.getAttribute("class")) + " ").indexOf(B) > -1
                },ATTR:function(t, B) {
                    var L = B[1];
                    L = X.attr ? X.attr(t, L) : ja.attrHandle[L] ? ja.attrHandle[L](t) : t[L] != null ? t[L] : t.getAttribute(L);
                    var M = L + "",R = B[2],S = B[4];
                    return L == null ? R === "!=" : !R && X.attr ? L != null : R === "=" ? M === S : R === "*=" ? M.indexOf(S) >= 0 : R === "~=" ? (" " +
                            M + " ").indexOf(S) >= 0 : !S ? M && L !== false : R === "!=" ? M !== S : R === "^=" ? M.indexOf(S) === 0 : R === "$=" ? M.substr(M.length - S.length) === S : R === "|=" ? M === S || M.substr(0, S.length + 1) === S + "-" : false
                },POS:function(t, B, L, M) {
                    var R = ja.setFilters[B[2]];
                    if (R)return R(t, L, B, M)
                }}},Ia = ja.match.POS,Xa = function(t, B) {
            return"\\" + (B - 0 + 1)
        };
        for (var s in ja.match) {
            ja.match[s] = RegExp(ja.match[s].source + /(?![^\[]*\])(?![^\(]*\))/.source);
            ja.leftMatch[s] = RegExp(/(^(?:.|\r|\n)*?)/.source + ja.match[s].source.replace(/\\(\d+)/g, Xa))
        }
        var w = function(t, B) {
            t = Array.prototype.slice.call(t, 0);
            if (B) {
                B.push.apply(B, t);
                return B
            }
            return t
        };
        try {
            Array.prototype.slice.call(aa.documentElement.childNodes, 0)
        } catch(J) {
            w = function(t, B) {
                var L = 0,M = B || [];
                if (v.call(t) === "[object Array]")Array.prototype.push.apply(M, t); else if (typeof t.length === "number")for (var R = t.length; L < R; L++)M.push(t[L]); else for (; t[L]; L++)M.push(t[L]);
                return M
            }
        }
        var Y,V;
        if (aa.documentElement.compareDocumentPosition)Y = function(t, B) {
            if (t === B) {
                z = true;
                return 0
            }
            if (!t.compareDocumentPosition || !B.compareDocumentPosition)return t.compareDocumentPosition ?
                    -1 : 1;
            return t.compareDocumentPosition(B) & 4 ? -1 : 1
        }; else {
            Y = function(t, B) {
                if (t === B) {
                    z = true;
                    return 0
                } else if (t.sourceIndex && B.sourceIndex)return t.sourceIndex - B.sourceIndex;
                var L,M,R = [],S = [];
                L = t.parentNode;
                M = B.parentNode;
                var ma = L;
                if (L === M)return V(t, B); else if (L) {
                    if (!M)return 1
                } else return-1;
                for (; ma;) {
                    R.unshift(ma);
                    ma = ma.parentNode
                }
                for (ma = M; ma;) {
                    S.unshift(ma);
                    ma = ma.parentNode
                }
                L = R.length;
                M = S.length;
                for (ma = 0; ma < L && ma < M; ma++)if (R[ma] !== S[ma])return V(R[ma], S[ma]);
                return ma === L ? V(t, S[ma], -1) : V(R[ma], B, 1)
            };
            V = function(t, B, L) {
                if (t === B)return L;
                for (t = t.nextSibling; t;) {
                    if (t === B)return-1;
                    t = t.nextSibling
                }
                return 1
            }
        }
        (function() {
            var t = aa.createElement("div"),B = "script" + (new Date).getTime(),L = aa.documentElement;
            t.innerHTML = "<a name='" + B + "'/>";
            L.insertBefore(t, L.firstChild);
            if (aa.getElementById(B)) {
                ja.find.ID = function(M, R, S) {
                    if (typeof R.getElementById !== "undefined" && !S)return(R = R.getElementById(M[1])) ? R.id === M[1] || typeof R.getAttributeNode !== "undefined" && R.getAttributeNode("id").nodeValue === M[1] ? [R] : d : []
                };
                ja.filter.ID =
                        function(M, R) {
                            var S = typeof M.getAttributeNode !== "undefined" && M.getAttributeNode("id");
                            return M.nodeType === 1 && S && S.nodeValue === R
                        }
            }
            L.removeChild(t);
            L = t = null
        })();
        (function() {
            var t = aa.createElement("div");
            t.appendChild(aa.createComment(""));
            if (t.getElementsByTagName("*").length > 0)ja.find.TAG = function(B, L) {
                var M = L.getElementsByTagName(B[1]);
                if (B[1] === "*") {
                    for (var R = [],S = 0; M[S]; S++)M[S].nodeType === 1 && R.push(M[S]);
                    M = R
                }
                return M
            };
            t.innerHTML = "<a href='#'></a>";
            if (t.firstChild && typeof t.firstChild.getAttribute !==
                    "undefined" && t.firstChild.getAttribute("href") !== "#")ja.attrHandle.href = function(B) {
                return B.getAttribute("href", 2)
            };
            t = null
        })();
        aa.querySelectorAll && function() {
            var t = X,B = aa.createElement("div");
            B.innerHTML = "<p class='TEST'></p>";
            if (!(B.querySelectorAll && B.querySelectorAll(".TEST").length === 0)) {
                X = function(M, R, S, ma) {
                    R = R || aa;
                    if (!ma && !X.isXML(R)) {
                        var da = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(M);
                        if (da && (R.nodeType === 1 || R.nodeType === 9))if (da[1])return w(R.getElementsByTagName(M), S); else if (da[2] && ja.find.CLASS &&
                                R.getElementsByClassName)return w(R.getElementsByClassName(da[2]), S);
                        if (R.nodeType === 9) {
                            if (M === "body" && R.body)return w([R.body], S); else if (da && da[3]) {
                                var wa = R.getElementById(da[3]);
                                if (wa && wa.parentNode) {
                                    if (wa.id === da[3])return w([wa], S)
                                } else return w([], S)
                            }
                            try {
                                return w(R.querySelectorAll(M), S)
                            } catch(za) {
                            }
                        } else if (R.nodeType === 1 && R.nodeName.toLowerCase() !== "object") {
                            da = R;
                            var E = (wa = R.getAttribute("id")) || "__sizzle__",ga = R.parentNode,ia = /^\s*[+~]/.test(M);
                            if (wa)E = E.replace(/'/g, "\\$&"); else R.setAttribute("id",
                                    E);
                            if (ia && ga)R = R.parentNode;
                            try {
                                if (!ia || ga)return w(R.querySelectorAll("[id='" + E + "'] " + M), S)
                            } catch(na) {
                            } finally {
                                wa || da.removeAttribute("id")
                            }
                        }
                    }
                    return t(M, R, S, ma)
                };
                for (var L in t)X[L] = t[L];
                B = null
            }
        }();
        (function() {
            var t = aa.documentElement,B = t.matchesSelector || t.mozMatchesSelector || t.webkitMatchesSelector || t.msMatchesSelector;
            if (B) {
                var L = !B.call(aa.createElement("div"), "div"),M = false;
                try {
                    B.call(aa.documentElement, "[test!='']:sizzle")
                } catch(R) {
                    M = true
                }
                X.matchesSelector = function(S, ma) {
                    ma = ma.replace(/\=\s*([^'"\]]*)\s*\]/g,
                            "='$1']");
                    if (!X.isXML(S))try {
                        if (M || !ja.match.PSEUDO.test(ma) && !/!=/.test(ma)) {
                            var da = B.call(S, ma);
                            if (da || !L || S.document && S.document.nodeType !== 11)return da
                        }
                    } catch(wa) {
                    }
                    return X(ma, null, null, [S]).length > 0
                }
            }
        })();
        (function() {
            var t = aa.createElement("div");
            t.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (!(!t.getElementsByClassName || t.getElementsByClassName("e").length === 0)) {
                t.lastChild.className = "e";
                if (t.getElementsByClassName("e").length !== 1) {
                    ja.order.splice(1, 0, "CLASS");
                    ja.find.CLASS =
                            function(B, L, M) {
                                if (typeof L.getElementsByClassName !== "undefined" && !M)return L.getElementsByClassName(B[1])
                            };
                    t = null
                }
            }
        })();
        X.contains = aa.documentElement.contains ? function(t, B) {
            return t !== B && (t.contains ? t.contains(B) : true)
        } : aa.documentElement.compareDocumentPosition ? function(t, B) {
            return!!(t.compareDocumentPosition(B) & 16)
        } : function() {
            return false
        };
        X.isXML = function(t) {
            return(t = (t ? t.ownerDocument || t : 0).documentElement) ? t.nodeName !== "HTML" : false
        };
        var ta = function(t, B, L) {
            var M,R = [],S = "";
            for (B = B.nodeType ? [B] :
                    B; M = ja.match.PSEUDO.exec(t);) {
                S += M[0];
                t = t.replace(ja.match.PSEUDO, "")
            }
            t = ja.relative[t] ? t + "*" : t;
            M = 0;
            for (var ma = B.length; M < ma; M++)X(t, B[M], R, L);
            return X.filter(S, R)
        };
        X.attr = m.attr;
        X.selectors.attrMap = {};
        m.find = X;
        m.expr = X.selectors;
        m.expr[":"] = m.expr.filters;
        m.unique = X.uniqueSort;
        m.text = X.getText;
        m.isXMLDoc = X.isXML;
        m.contains = X.contains
    })();
    var kb = /Until$/,bc = /^(?:parents|prevUntil|prevAll)/,cc = /,/,pb = /^.[^:#\[\.,]*$/,dc = Array.prototype.slice,Lb = m.expr.match.POS,ec = {children:true,contents:true,next:true,
        prev:true};
    m.fn.extend({find:function(g) {
        var k = this,n,p;
        if (typeof g !== "string")return m(g).filter(function() {
            n = 0;
            for (p = k.length; n < p; n++)if (m.contains(k[n], this))return true
        });
        var q = this.pushStack("", "find", g),v,z,D;
        n = 0;
        for (p = this.length; n < p; n++) {
            v = q.length;
            m.find(g, this[n], q);
            if (n > 0)for (z = v; z < q.length; z++)for (D = 0; D < v; D++)if (q[D] === q[z]) {
                q.splice(z--, 1);
                break
            }
        }
        return q
    },has:function(g) {
        var k = m(g);
        return this.filter(function() {
            for (var n = 0,p = k.length; n < p; n++)if (m.contains(this, k[n]))return true
        })
    },not:function(g) {
        return this.pushStack(l(this,
                g, false), "not", g)
    },filter:function(g) {
        return this.pushStack(l(this, g, true), "filter", g)
    },is:function(g) {
        return!!g && (typeof g === "string" ? Lb.test(g) ? m(g, this.context).index(this[0]) >= 0 : m.filter(g, this).length > 0 : this.filter(g).length > 0)
    },closest:function(g, k) {
        var n = [],p,q,v = this[0];
        if (m.isArray(g)) {
            for (q = 1; v && v.ownerDocument && v !== k;) {
                for (p = 0; p < g.length; p++)m(v).is(g[p]) && n.push({selector:g[p],elem:v,level:q});
                v = v.parentNode;
                q++
            }
            return n
        }
        var z = Lb.test(g) || typeof g !== "string" ? m(g, k || this.context) : 0;
        p = 0;
        for (q = this.length; p < q; p++)for (v = this[p]; v;)if (z ? z.index(v) > -1 : m.find.matchesSelector(v, g)) {
            n.push(v);
            break
        } else {
            v = v.parentNode;
            if (!v || !v.ownerDocument || v === k || v.nodeType === 11)break
        }
        n = n.length > 1 ? m.unique(n) : n;
        return this.pushStack(n, "closest", g)
    },index:function(g) {
        if (!g)return this[0] && this[0].parentNode ? this.prevAll().length : -1;
        if (typeof g === "string")return m.inArray(this[0], m(g));
        return m.inArray(g.jquery ? g[0] : g, this)
    },add:function(g, k) {
        var n = typeof g === "string" ? m(g, k) : m.makeArray(g && g.nodeType ?
                [g] : g),p = m.merge(this.get(), n);
        return this.pushStack(!n[0] || !n[0].parentNode || n[0].parentNode.nodeType === 11 || !p[0] || !p[0].parentNode || p[0].parentNode.nodeType === 11 ? p : m.unique(p))
    },andSelf:function() {
        return this.add(this.prevObject)
    }});
    m.each({parent:function(g) {
        return(g = g.parentNode) && g.nodeType !== 11 ? g : null
    },parents:function(g) {
        return m.dir(g, "parentNode")
    },parentsUntil:function(g, k, n) {
        return m.dir(g, "parentNode", n)
    },next:function(g) {
        return m.nth(g, 2, "nextSibling")
    },prev:function(g) {
        return m.nth(g,
                2, "previousSibling")
    },nextAll:function(g) {
        return m.dir(g, "nextSibling")
    },prevAll:function(g) {
        return m.dir(g, "previousSibling")
    },nextUntil:function(g, k, n) {
        return m.dir(g, "nextSibling", n)
    },prevUntil:function(g, k, n) {
        return m.dir(g, "previousSibling", n)
    },siblings:function(g) {
        return m.sibling(g.parentNode.firstChild, g)
    },children:function(g) {
        return m.sibling(g.firstChild)
    },contents:function(g) {
        return m.nodeName(g, "iframe") ? g.contentDocument || g.contentWindow.document : m.makeArray(g.childNodes)
    }}, function(g, k) {
        m.fn[g] = function(n, p) {
            var q = m.map(this, k, n),v = dc.call(arguments);
            kb.test(g) || (p = n);
            if (p && typeof p === "string")q = m.filter(p, q);
            q = this.length > 1 && !ec[g] ? m.unique(q) : q;
            if ((this.length > 1 || cc.test(p)) && bc.test(g))q = q.reverse();
            return this.pushStack(q, g, v.join(","))
        }
    });
    m.extend({filter:function(g, k, n) {
        if (n)g = ":not(" + g + ")";
        return k.length === 1 ? m.find.matchesSelector(k[0], g) ? [k[0]] : [] : m.find.matches(g, k)
    },dir:function(g, k, n) {
        var p = [];
        for (g = g[k]; g && g.nodeType !== 9 && (n === d || g.nodeType !== 1 || !m(g).is(n));) {
            g.nodeType ===
                    1 && p.push(g);
            g = g[k]
        }
        return p
    },nth:function(g, k, n) {
        k = k || 1;
        for (var p = 0; g; g = g[n])if (g.nodeType === 1 && ++p === k)break;
        return g
    },sibling:function(g, k) {
        for (var n = []; g; g = g.nextSibling)g.nodeType === 1 && g !== k && n.push(g);
        return n
    }});
    var eb = "abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",Mb = / jQuery\d+="(?:\d+|null)"/g,Nb = /^\s+/,Xb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Db = /<([\w:]+)/,
            Yb = /<tbody/i,fc = /<|&#?\w+;/,Ob = /<(?:script|style)/i,xb = /<(?:script|object|embed|option|style)/i,gc = RegExp("<(?:" + eb.replace(" ", "|") + ")", "i"),Zb = /checked\s*(?:[^=]|=\s*.checked.)/i,Pb = /\/(java|ecma)script/i,ac = /^\s*<!(?:\[CDATA\[|\-\-)/,bb = {option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>",
        "</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},hc = o(aa);
    bb.optgroup = bb.option;
    bb.tbody = bb.tfoot = bb.colgroup = bb.caption = bb.thead;
    bb.th = bb.td;
    if (!m.support.htmlSerialize)bb._default = [1,"div<div>","</div>"];
    m.fn.extend({text:function(g) {
        if (m.isFunction(g))return this.each(function(k) {
            var n = m(this);
            n.text(g.call(this, k, n.text()))
        });
        if (typeof g !== "object" && g !== d)return this.empty().append((this[0] && this[0].ownerDocument || aa).createTextNode(g));
        return m.text(this)
    },wrapAll:function(g) {
        if (m.isFunction(g))return this.each(function(n) {
            m(this).wrapAll(g.call(this,
                    n))
        });
        if (this[0]) {
            var k = m(g, this[0].ownerDocument).eq(0).clone(true);
            this[0].parentNode && k.insertBefore(this[0]);
            k.map(
                    function() {
                        for (var n = this; n.firstChild && n.firstChild.nodeType === 1;)n = n.firstChild;
                        return n
                    }).append(this)
        }
        return this
    },wrapInner:function(g) {
        if (m.isFunction(g))return this.each(function(k) {
            m(this).wrapInner(g.call(this, k))
        });
        return this.each(function() {
            var k = m(this),n = k.contents();
            n.length ? n.wrapAll(g) : k.append(g)
        })
    },wrap:function(g) {
        return this.each(function() {
            m(this).wrapAll(g)
        })
    },
        unwrap:function() {
            return this.parent().each(
                    function() {
                        m.nodeName(this, "body") || m(this).replaceWith(this.childNodes)
                    }).end()
        },append:function() {
            return this.domManip(arguments, true, function(g) {
                this.nodeType === 1 && this.appendChild(g)
            })
        },prepend:function() {
            return this.domManip(arguments, true, function(g) {
                this.nodeType === 1 && this.insertBefore(g, this.firstChild)
            })
        },before:function() {
            if (this[0] && this[0].parentNode)return this.domManip(arguments, false, function(k) {
                this.parentNode.insertBefore(k, this)
            }); else if (arguments.length) {
                var g =
                        m(arguments[0]);
                g.push.apply(g, this.toArray());
                return this.pushStack(g, "before", arguments)
            }
        },after:function() {
            if (this[0] && this[0].parentNode)return this.domManip(arguments, false, function(k) {
                this.parentNode.insertBefore(k, this.nextSibling)
            }); else if (arguments.length) {
                var g = this.pushStack(this, "after", arguments);
                g.push.apply(g, m(arguments[0]).toArray());
                return g
            }
        },remove:function(g, k) {
            for (var n = 0,p; (p = this[n]) != null; n++)if (!g || m.filter(g, [p]).length) {
                if (!k && p.nodeType === 1) {
                    m.cleanData(p.getElementsByTagName("*"));
                    m.cleanData([p])
                }
                p.parentNode && p.parentNode.removeChild(p)
            }
            return this
        },empty:function() {
            for (var g = 0,k; (k = this[g]) != null; g++)for (k.nodeType === 1 && m.cleanData(k.getElementsByTagName("*")); k.firstChild;)k.removeChild(k.firstChild);
            return this
        },clone:function(g, k) {
            g = g == null ? false : g;
            k = k == null ? g : k;
            return this.map(function() {
                return m.clone(this, g, k)
            })
        },html:function(g) {
            if (g === d)return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(Mb, "") : null; else if (typeof g === "string" && !Ob.test(g) && (m.support.leadingWhitespace ||
                    !Nb.test(g)) && !bb[(Db.exec(g) || ["",""])[1].toLowerCase()]) {
                g = g.replace(Xb, "<$1></$2>");
                try {
                    for (var k = 0,n = this.length; k < n; k++)if (this[k].nodeType === 1) {
                        m.cleanData(this[k].getElementsByTagName("*"));
                        this[k].innerHTML = g
                    }
                } catch(p) {
                    this.empty().append(g)
                }
            } else m.isFunction(g) ? this.each(function(q) {
                var v = m(this);
                v.html(g.call(this, q, v.html()))
            }) : this.empty().append(g);
            return this
        },replaceWith:function(g) {
            if (this[0] && this[0].parentNode) {
                if (m.isFunction(g))return this.each(function(k) {
                    var n = m(this),p = n.html();
                    n.replaceWith(g.call(this, k, p))
                });
                if (typeof g !== "string")g = m(g).detach();
                return this.each(function() {
                    var k = this.nextSibling,n = this.parentNode;
                    m(this).remove();
                    k ? m(k).before(g) : m(n).append(g)
                })
            } else return this.length ? this.pushStack(m(m.isFunction(g) ? g() : g), "replaceWith", g) : this
        },detach:function(g) {
            return this.remove(g, true)
        },domManip:function(g, k, n) {
            var p,q,v,z = g[0],D = [];
            if (!m.support.checkClone && arguments.length === 3 && typeof z === "string" && Zb.test(z))return this.each(function() {
                m(this).domManip(g,
                        k, n, true)
            });
            if (m.isFunction(z))return this.each(function(pa) {
                var X = m(this);
                g[0] = z.call(this, pa, k ? X.html() : d);
                X.domManip(g, k, n)
            });
            if (this[0]) {
                p = z && z.parentNode;
                p = m.support.parentNode && p && p.nodeType === 11 && p.childNodes.length === this.length ? {fragment:p} : m.buildFragment(g, this, D);
                v = p.fragment;
                if (q = v.childNodes.length === 1 ? v = v.firstChild : v.firstChild) {
                    k = k && m.nodeName(q, "tr");
                    q = 0;
                    for (var P = this.length,T = P - 1; q < P; q++)n.call(k ? m.nodeName(this[q], "table") ? this[q].getElementsByTagName("tbody")[0] || this[q].appendChild(this[q].ownerDocument.createElement("tbody")) :
                            this[q] : this[q], p.cacheable || P > 1 && q < T ? m.clone(v, true, true) : v)
                }
                D.length && m.each(D, I)
            }
            return this
        }});
    m.buildFragment = function(g, k, n) {
        var p,q,v,z,D = g[0];
        if (k && k[0])z = k[0].ownerDocument || k[0];
        z.createDocumentFragment || (z = aa);
        if (g.length === 1 && typeof D === "string" && D.length < 512 && z === aa && D.charAt(0) === "<" && !xb.test(D) && (m.support.checkClone || !Zb.test(D)) && !m.support.unknownElems && gc.test(D)) {
            q = true;
            if ((v = m.fragments[D]) && v !== 1)p = v
        }
        if (!p) {
            p = z.createDocumentFragment();
            m.clean(g, z, p, n)
        }
        if (q)m.fragments[D] = v ?
                p : 1;
        return{fragment:p,cacheable:q}
    };
    m.fragments = {};
    m.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"}, function(g, k) {
        m.fn[g] = function(n) {
            var p = [];
            n = m(n);
            var q = this.length === 1 && this[0].parentNode;
            if (q && q.nodeType === 11 && q.childNodes.length === 1 && n.length === 1) {
                n[k](this[0]);
                return this
            } else {
                q = 0;
                for (var v = n.length; q < v; q++) {
                    var z = (q > 0 ? this.clone(true) : this).get();
                    m(n[q])[k](z);
                    p = p.concat(z)
                }
                return this.pushStack(p, g, n.selector)
            }
        }
    });
    m.extend({clone:function(g, k, n) {
        var p = g.cloneNode(true),q,v,z;
        if ((!m.support.noCloneEvent || !m.support.noCloneChecked) && (g.nodeType === 1 || g.nodeType === 11) && !m.isXMLDoc(g)) {
            u(g, p);
            q = C(g);
            v = C(p);
            for (z = 0; q[z]; ++z)v[z] && u(q[z], v[z])
        }
        if (k) {
            r(g, p);
            if (n) {
                q = C(g);
                v = C(p);
                for (z = 0; q[z]; ++z)r(q[z], v[z])
            }
        }
        return p
    },clean:function(g, k, n, p) {
        k = k || aa;
        if (typeof k.createElement === "undefined")k = k.ownerDocument || k[0] && k[0].ownerDocument || aa;
        for (var q = [],v,z = 0,D; (D = g[z]) != null; z++) {
            if (typeof D === "number")D += "";
            if (D) {
                if (typeof D === "string")if (fc.test(D)) {
                    D =
                            D.replace(Xb, "<$1></$2>");
                    v = (Db.exec(D) || ["",""])[1].toLowerCase();
                    var P = bb[v] || bb._default,T = P[0],pa = k.createElement("div");
                    k === aa ? hc.appendChild(pa) : o(k).appendChild(pa);
                    for (pa.innerHTML = P[1] + D + P[2]; T--;)pa = pa.lastChild;
                    if (!m.support.tbody) {
                        T = Yb.test(D);
                        P = v === "table" && !T ? pa.firstChild && pa.firstChild.childNodes : P[1] === "<table>" && !T ? pa.childNodes : [];
                        for (v = P.length - 1; v >= 0; --v)m.nodeName(P[v], "tbody") && !P[v].childNodes.length && P[v].parentNode.removeChild(P[v])
                    }
                    !m.support.leadingWhitespace && Nb.test(D) &&
                    pa.insertBefore(k.createTextNode(Nb.exec(D)[0]), pa.firstChild);
                    D = pa.childNodes
                } else D = k.createTextNode(D);
                var X;
                if (!m.support.appendChecked)if (D[0] && typeof(X = D.length) === "number")for (v = 0; v < X; v++)x(D[v]); else x(D);
                if (D.nodeType)q.push(D); else q = m.merge(q, D)
            }
        }
        if (n) {
            g = function(ra) {
                return!ra.type || Pb.test(ra.type)
            };
            for (z = 0; q[z]; z++)if (p && m.nodeName(q[z], "script") && (!q[z].type || q[z].type.toLowerCase() === "text/javascript"))p.push(q[z].parentNode ? q[z].parentNode.removeChild(q[z]) : q[z]); else {
                if (q[z].nodeType ===
                        1) {
                    k = m.grep(q[z].getElementsByTagName("script"), g);
                    q.splice.apply(q, [z + 1,0].concat(k))
                }
                n.appendChild(q[z])
            }
        }
        return q
    },cleanData:function(g) {
        for (var k,n,p = m.cache,q = m.event.special,v = m.support.deleteExpando,z = 0,D; (D = g[z]) != null; z++)if (!(D.nodeName && m.noData[D.nodeName.toLowerCase()]))if (n = D[m.expando]) {
            if ((k = p[n]) && k.events) {
                for (var P in k.events)q[P] ? m.event.remove(D, P) : m.removeEvent(D, P, k.handle);
                if (k.handle)k.handle.elem = null
            }
            if (v)delete D[m.expando]; else D.removeAttribute && D.removeAttribute(m.expando);
            delete p[n]
        }
    }});
    var Qb = /alpha\([^)]*\)/i,mc = /opacity=([^)]*)/,nc = /([A-Z]|^ms)/g,ic = /^-?\d+(?:px)?$/i,lb = /^-?\d/,Va = /^([\-+])=([\-+.\de]+)/,Ra = {position:"absolute",visibility:"hidden",display:"block"},Wb = ["Left","Right"],Jb = ["Top","Bottom"],ab,gb,tb;
    m.fn.css = function(g, k) {
        if (arguments.length === 2 && k === d)return this;
        return m.access(this, g, k, true, function(n, p, q) {
            return q !== d ? m.style(n, p, q) : m.css(n, p)
        })
    };
    m.extend({cssHooks:{opacity:{get:function(g, k) {
        if (k) {
            var n = ab(g, "opacity", "opacity");
            return n === "" ?
                    "1" : n
        } else return g.style.opacity
    }}},cssNumber:{fillOpacity:true,fontWeight:true,lineHeight:true,opacity:true,orphans:true,widows:true,zIndex:true,zoom:true},cssProps:{"float":m.support.cssFloat ? "cssFloat" : "styleFloat"},style:function(g, k, n, p) {
        if (!(!g || g.nodeType === 3 || g.nodeType === 8 || !g.style)) {
            var q,v = m.camelCase(k),z = g.style,D = m.cssHooks[v];
            k = m.cssProps[v] || v;
            if (n !== d) {
                p = typeof n;
                if (p === "string" && (q = Va.exec(n))) {
                    n = +(q[1] + 1) * +q[2] + parseFloat(m.css(g, k));
                    p = "number"
                }
                if (!(n == null || p === "number" && isNaN(n))) {
                    if (p ===
                            "number" && !m.cssNumber[v])n += "px";
                    if (!D || !("set"in D) || (n = D.set(g, n)) !== d)try {
                        z[k] = n
                    } catch(P) {
                    }
                }
            } else {
                if (D && "get"in D && (q = D.get(g, false, p)) !== d)return q;
                return z[k]
            }
        }
    },css:function(g, k, n) {
        var p,q;
        k = m.camelCase(k);
        q = m.cssHooks[k];
        k = m.cssProps[k] || k;
        if (k === "cssFloat")k = "float";
        if (q && "get"in q && (p = q.get(g, true, n)) !== d)return p; else if (ab)return ab(g, k)
    },swap:function(g, k, n) {
        var p = {};
        for (var q in k) {
            p[q] = g.style[q];
            g.style[q] = k[q]
        }
        n.call(g);
        for (q in k)g.style[q] = p[q]
    }});
    m.curCSS = m.css;
    m.each(["height",
        "width"], function(g, k) {
        m.cssHooks[k] = {get:function(n, p, q) {
            var v;
            if (p) {
                if (n.offsetWidth !== 0)return G(n, k, q); else m.swap(n, Ra, function() {
                    v = G(n, k, q)
                });
                return v
            }
        },set:function(n, p) {
            if (ic.test(p)) {
                p = parseFloat(p);
                if (p >= 0)return p + "px"
            } else return p
        }}
    });
    if (!m.support.opacity)m.cssHooks.opacity = {get:function(g, k) {
        return mc.test((k && g.currentStyle ? g.currentStyle.filter : g.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : k ? "1" : ""
    },set:function(g, k) {
        var n = g.style,p = g.currentStyle,q = m.isNumeric(k) ? "alpha(opacity=" +
                k * 100 + ")" : "",v = p && p.filter || n.filter || "";
        n.zoom = 1;
        if (k >= 1 && m.trim(v.replace(Qb, "")) === "") {
            n.removeAttribute("filter");
            if (p && !p.filter)return
        }
        n.filter = Qb.test(v) ? v.replace(Qb, q) : v + " " + q
    }};
    m(function() {
        if (!m.support.reliableMarginRight)m.cssHooks.marginRight = {get:function(g, k) {
            var n;
            m.swap(g, {display:"inline-block"}, function() {
                n = k ? ab(g, "margin-right", "marginRight") : g.style.marginRight
            });
            return n
        }}
    });
    if (aa.defaultView && aa.defaultView.getComputedStyle)gb = function(g, k) {
        var n,p;
        k = k.replace(nc, "-$1").toLowerCase();
        if (!(p = g.ownerDocument.defaultView))return d;
        if (p = p.getComputedStyle(g, null)) {
            n = p.getPropertyValue(k);
            if (n === "" && !m.contains(g.ownerDocument.documentElement, g))n = m.style(g, k)
        }
        return n
    };
    if (aa.documentElement.currentStyle)tb = function(g, k) {
        var n,p,q = g.currentStyle && g.currentStyle[k],v = g.style;
        if (q === null && v && (n = v[k]))q = n;
        if (!ic.test(q) && lb.test(q)) {
            n = v.left;
            if (p = g.runtimeStyle && g.runtimeStyle.left)g.runtimeStyle.left = g.currentStyle.left;
            v.left = k === "fontSize" ? "1em" : q || 0;
            q = v.pixelLeft + "px";
            v.left = n;
            if (p)g.runtimeStyle.left =
                    p
        }
        return q === "" ? "auto" : q
    };
    ab = gb || tb;
    if (m.expr && m.expr.filters) {
        m.expr.filters.hidden = function(g) {
            var k = g.offsetHeight;
            return g.offsetWidth === 0 && k === 0 || !m.support.reliableHiddenOffsets && (g.style && g.style.display || m.css(g, "display")) === "none"
        };
        m.expr.filters.visible = function(g) {
            return!m.expr.filters.hidden(g)
        }
    }
    var yb = /%20/g,Kb = /\[\]$/,ub = /\r?\n/g,Ua = /#.*$/,zb = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,Eb = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
            Wa = /^(?:GET|HEAD)$/,Fb = /^\/\//,Ca = /\?/,vb = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,$a = /^(?:select|textarea)/i,hb = /\s+/,jc = /([?&])_=[^&]*/,Na = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,La = m.fn.load,Za = {},$b = {},mb,nb,Gb = ["*/"] + ["*"];
    try {
        mb = ea.href
    } catch(pc) {
        mb = aa.createElement("a");
        mb.href = "";
        mb = mb.href
    }
    nb = Na.exec(mb.toLowerCase()) || [];
    m.fn.extend({load:function(g, k, n) {
        if (typeof g !== "string" && La)return La.apply(this, arguments); else if (!this.length)return this;
        var p = g.indexOf(" ");
        if (p >= 0) {
            var q = g.slice(p, g.length);
            g = g.slice(0, p)
        }
        p = "GET";
        if (k)if (m.isFunction(k)) {
            n = k;
            k = d
        } else if (typeof k === "object") {
            k = m.param(k, m.ajaxSettings.traditional);
            p = "POST"
        }
        var v = this;
        m.ajax({url:g,type:p,dataType:"html",data:k,complete:function(z, D, P) {
            P = z.responseText;
            if (z.isResolved()) {
                z.done(function(T) {
                    P = T
                });
                v.html(q ? m("<div>").append(P.replace(vb, "")).find(q) : P)
            }
            n && v.each(n, [P,D,z])
        }});
        return this
    },serialize:function() {
        return m.param(this.serializeArray())
    },serializeArray:function() {
        return this.map(
                function() {
                    return this.elements ?
                            m.makeArray(this.elements) : this
                }).filter(
                function() {
                    return this.name && !this.disabled && (this.checked || $a.test(this.nodeName) || Eb.test(this.type))
                }).map(
                function(g, k) {
                    var n = m(this).val();
                    return n == null ? null : m.isArray(n) ? m.map(n, function(p) {
                        return{name:k.name,value:p.replace(ub, "\r\n")}
                    }) : {name:k.name,value:n.replace(ub, "\r\n")}
                }).get()
    }});
    m.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(g, k) {
        m.fn[k] = function(n) {
            return this.bind(k, n)
        }
    });
    m.each(["get","post"],
            function(g, k) {
                m[k] = function(n, p, q, v) {
                    if (m.isFunction(p)) {
                        v = v || q;
                        q = p;
                        p = d
                    }
                    return m.ajax({type:k,url:n,data:p,success:q,dataType:v})
                }
            });
    m.extend({getScript:function(g, k) {
        return m.get(g, d, k, "script")
    },getJSON:function(g, k, n) {
        return m.get(g, k, n, "json")
    },ajaxSetup:function(g, k) {
        if (k)N(g, m.ajaxSettings); else {
            k = g;
            g = m.ajaxSettings
        }
        N(g, k);
        return g
    },ajaxSettings:{url:mb,isLocal:/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(nb[1]),global:true,type:"GET",contentType:"application/x-www-form-urlencoded",
        processData:true,async:true,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":Gb},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":true,"text json":m.parseJSON,"text xml":m.parseXML},flatOptions:{context:true,url:true}},ajaxPrefilter:H(Za),ajaxTransport:H($b),ajax:function(g, k) {
        function n(B, L, M, R) {
            if (w !== 2) {
                w = 2;
                Xa && clearTimeout(Xa);
                Ia =
                        d;
                ra = R || "";
                V.readyState = B > 0 ? 4 : 0;
                var S,ma,da;
                R = L;
                if (M) {
                    var wa = p,za = V,E = wa.contents,ga = wa.dataTypes,ia = wa.responseFields,na,Aa,Ga,Sa;
                    for (Aa in ia)if (Aa in M)za[ia[Aa]] = M[Aa];
                    for (; ga[0] === "*";) {
                        ga.shift();
                        if (na === d)na = wa.mimeType || za.getResponseHeader("content-type")
                    }
                    if (na)for (Aa in E)if (E[Aa] && E[Aa].test(na)) {
                        ga.unshift(Aa);
                        break
                    }
                    if (ga[0]in M)Ga = ga[0]; else {
                        for (Aa in M) {
                            if (!ga[0] || wa.converters[Aa + " " + ga[0]]) {
                                Ga = Aa;
                                break
                            }
                            Sa || (Sa = Aa)
                        }
                        Ga = Ga || Sa
                    }
                    if (Ga) {
                        Ga !== ga[0] && ga.unshift(Ga);
                        M = M[Ga]
                    } else M = void 0
                } else M =
                        d;
                M = M;
                if (B >= 200 && B < 300 || B === 304) {
                    if (p.ifModified) {
                        if (na = V.getResponseHeader("Last-Modified"))m.lastModified[T] = na;
                        if (na = V.getResponseHeader("Etag"))m.etag[T] = na
                    }
                    if (B === 304) {
                        R = "notmodified";
                        S = true
                    } else try {
                        na = p;
                        M = M;
                        if (na.dataFilter)M = na.dataFilter(M, na.dataType);
                        var Ta = na.dataTypes;
                        Aa = {};
                        var rb,kc,qc = Ta.length,lc,Ab = Ta[0],Rb,oc,Bb,Hb,Sb;
                        for (rb = 1; rb < qc; rb++) {
                            if (rb === 1)for (kc in na.converters)if (typeof kc === "string")Aa[kc.toLowerCase()] = na.converters[kc];
                            Rb = Ab;
                            Ab = Ta[rb];
                            if (Ab === "*")Ab = Rb; else if (Rb !==
                                    "*" && Rb !== Ab) {
                                oc = Rb + " " + Ab;
                                Bb = Aa[oc] || Aa["* " + Ab];
                                if (!Bb) {
                                    Sb = d;
                                    for (Hb in Aa) {
                                        lc = Hb.split(" ");
                                        if (lc[0] === Rb || lc[0] === "*")if (Sb = Aa[lc[1] + " " + Ab]) {
                                            Hb = Aa[Hb];
                                            if (Hb === true)Bb = Sb; else if (Sb === true)Bb = Hb;
                                            break
                                        }
                                    }
                                }
                                Bb || Sb || m.error("No conversion from " + oc.replace(" ", " to "));
                                if (Bb !== true)M = Bb ? Bb(M) : Sb(Hb(M))
                            }
                        }
                        ma = M;
                        R = "success";
                        S = true
                    } catch(rc) {
                        R = "parsererror";
                        da = rc
                    }
                } else {
                    da = R;
                    if (!R || B) {
                        R = "error";
                        if (B < 0)B = 0
                    }
                }
                V.status = B;
                V.statusText = "" + (L || R);
                S ? z.resolveWith(q, [ma,R,V]) : z.rejectWith(q, [V,R,da]);
                V.statusCode(P);
                P = d;
                if (J)v.trigger("ajax" + (S ? "Success" : "Error"), [V,p,S ? ma : da]);
                D.fireWith(q, [V,R]);
                if (J) {
                    v.trigger("ajaxComplete", [V,p]);
                    --m.active || m.event.trigger("ajaxStop")
                }
            }
        }

        if (typeof g === "object") {
            k = g;
            g = d
        }
        k = k || {};
        var p = m.ajaxSetup({}, k),q = p.context || p,v = q !== p && (q.nodeType || q instanceof m) ? m(q) : m.event,z = m.Deferred(),D = m.Callbacks("once memory"),P = p.statusCode || {},T,pa = {},X = {},ra,ja,Ia,Xa,s,w = 0,J,Y,V = {readyState:0,setRequestHeader:function(B, L) {
            if (!w) {
                var M = B.toLowerCase();
                B = X[M] = X[M] || B;
                pa[B] = L
            }
            return this
        },
            getAllResponseHeaders:function() {
                return w === 2 ? ra : null
            },getResponseHeader:function(B) {
                var L;
                if (w === 2) {
                    if (!ja)for (ja = {}; L = zb.exec(ra);)ja[L[1].toLowerCase()] = L[2];
                    L = ja[B.toLowerCase()]
                }
                return L === d ? null : L
            },overrideMimeType:function(B) {
                if (!w)p.mimeType = B;
                return this
            },abort:function(B) {
                B = B || "abort";
                Ia && Ia.abort(B);
                n(0, B);
                return this
            }};
        z.promise(V);
        V.success = V.done;
        V.error = V.fail;
        V.complete = D.add;
        V.statusCode = function(B) {
            if (B) {
                var L;
                if (w < 2)for (L in B)P[L] = [P[L],B[L]]; else {
                    L = B[V.status];
                    V.then(L, L)
                }
            }
            return this
        };
        p.url = ((g || p.url) + "").replace(Ua, "").replace(Fb, nb[1] + "//");
        p.dataTypes = m.trim(p.dataType || "*").toLowerCase().split(hb);
        if (p.crossDomain == null) {
            s = Na.exec(p.url.toLowerCase());
            p.crossDomain = !!(s && (s[1] != nb[1] || s[2] != nb[2] || (s[3] || (s[1] === "http:" ? 80 : 443)) != (nb[3] || (nb[1] === "http:" ? 80 : 443))))
        }
        if (p.data && p.processData && typeof p.data !== "string")p.data = m.param(p.data, p.traditional);
        A(Za, p, k, V);
        if (w === 2)return false;
        J = p.global;
        p.type = p.type.toUpperCase();
        p.hasContent = !Wa.test(p.type);
        J && m.active++ === 0 &&
        m.event.trigger("ajaxStart");
        if (!p.hasContent) {
            if (p.data) {
                p.url += (Ca.test(p.url) ? "&" : "?") + p.data;
                delete p.data
            }
            T = p.url;
            if (p.cache === false) {
                s = m.now();
                var ta = p.url.replace(jc, "$1_=" + s);
                p.url = ta + (ta === p.url ? (Ca.test(p.url) ? "&" : "?") + "_=" + s : "")
            }
        }
        if (p.data && p.hasContent && p.contentType !== false || k.contentType)V.setRequestHeader("Content-Type", p.contentType);
        if (p.ifModified) {
            T = T || p.url;
            m.lastModified[T] && V.setRequestHeader("If-Modified-Since", m.lastModified[T]);
            m.etag[T] && V.setRequestHeader("If-None-Match",
                    m.etag[T])
        }
        V.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + (p.dataTypes[0] !== "*" ? ", " + Gb + "; q=0.01" : "") : p.accepts["*"]);
        for (Y in p.headers)V.setRequestHeader(Y, p.headers[Y]);
        if (p.beforeSend && (p.beforeSend.call(q, V, p) === false || w === 2)) {
            V.abort();
            return false
        }
        for (Y in{success:1,error:1,complete:1})V[Y](p[Y]);
        if (Ia = A($b, p, k, V)) {
            V.readyState = 1;
            J && v.trigger("ajaxSend", [V,p]);
            if (p.async && p.timeout > 0)Xa = setTimeout(function() {
                V.abort("timeout")
            }, p.timeout);
            try {
                w =
                        1;
                Ia.send(pa, n)
            } catch(t) {
                w < 2 ? n(-1, t) : m.error(t)
            }
        } else n(-1, "No Transport");
        return V
    },param:function(g, k) {
        var n = [],p = function(v, z) {
            z = m.isFunction(z) ? z() : z;
            n[n.length] = encodeURIComponent(v) + "=" + encodeURIComponent(z)
        };
        if (k === d)k = m.ajaxSettings.traditional;
        if (m.isArray(g) || g.jquery && !m.isPlainObject(g))m.each(g, function() {
            p(this.name, this.value)
        }); else for (var q in g)ba(q, g[q], k, p);
        return n.join("&").replace(yb, "+")
    }});
    m.extend({active:0,lastModified:{},etag:{}});
    var Tb = m.now(),Ib = /(\=)\?(&|$)|\?\?/i;
    m.ajaxSetup({jsonp:"callback",jsonpCallback:function() {
        return m.expando + "_" + Tb++
    }});
    m.ajaxPrefilter("json jsonp", function(g, k, n) {
        k = g.contentType === "application/x-www-form-urlencoded" && typeof g.data === "string";
        if (g.dataTypes[0] === "jsonp" || g.jsonp !== false && (Ib.test(g.url) || k && Ib.test(g.data))) {
            var p,q = g.jsonpCallback = m.isFunction(g.jsonpCallback) ? g.jsonpCallback() : g.jsonpCallback,v = a[q],z = g.url,D = g.data,P = "$1" + q + "$2";
            if (g.jsonp !== false) {
                z = z.replace(Ib, P);
                if (g.url === z) {
                    if (k)D = D.replace(Ib, P);
                    if (g.data ===
                            D)z += (/\?/.test(z) ? "&" : "?") + g.jsonp + "=" + q
                }
            }
            g.url = z;
            g.data = D;
            a[q] = function(T) {
                p = [T]
            };
            n.always(function() {
                a[q] = v;
                p && m.isFunction(v) && a[q](p[0])
            });
            g.converters["script json"] = function() {
                p || m.error(q + " was not called");
                return p[0]
            };
            g.dataTypes[0] = "json";
            return"script"
        }
    });
    m.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(g) {
        m.globalEval(g);
        return g
    }}});
    m.ajaxPrefilter("script",
            function(g) {
                if (g.cache === d)g.cache = false;
                if (g.crossDomain) {
                    g.type = "GET";
                    g.global = false
                }
            });
    m.ajaxTransport("script", function(g) {
        if (g.crossDomain) {
            var k,n = aa.head || aa.getElementsByTagName("head")[0] || aa.documentElement;
            return{send:function(p, q) {
                k = aa.createElement("script");
                k.async = "async";
                if (g.scriptCharset)k.charset = g.scriptCharset;
                k.src = g.url;
                k.onload = k.onreadystatechange = function(v, z) {
                    if (z || !k.readyState || /loaded|complete/.test(k.readyState)) {
                        k.onload = k.onreadystatechange = null;
                        n && k.parentNode && n.removeChild(k);
                        k = d;
                        z || q(200, "success")
                    }
                };
                n.insertBefore(k, n.firstChild)
            },abort:function() {
                k && k.onload(0, 1)
            }}
        }
    });
    var ob = a.ActiveXObject ? function() {
        for (var g in Oa)Oa[g](0, 1)
    } : false,Ka = 0,Oa;
    m.ajaxSettings.xhr = a.ActiveXObject ? function() {
        var g;
        if (!(g = !this.isLocal && K()))a:{
            try {
                g = new a.ActiveXObject("Microsoft.XMLHTTP");
                break a
            } catch(k) {
            }
            g = void 0
        }
        return g
    } : K;
    (function(g) {
        m.extend(m.support, {ajax:!!g,cors:!!g && "withCredentials"in g})
    })(m.ajaxSettings.xhr());
    m.support.ajax && m.ajaxTransport(function(g) {
        if (!g.crossDomain ||
                m.support.cors) {
            var k;
            return{send:function(n, p) {
                var q = g.xhr(),v,z;
                g.username ? q.open(g.type, g.url, g.async, g.username, g.password) : q.open(g.type, g.url, g.async);
                if (g.xhrFields)for (z in g.xhrFields)q[z] = g.xhrFields[z];
                g.mimeType && q.overrideMimeType && q.overrideMimeType(g.mimeType);
                if (!g.crossDomain && !n["X-Requested-With"])n["X-Requested-With"] = "XMLHttpRequest";
                try {
                    for (z in n)q.setRequestHeader(z, n[z])
                } catch(D) {
                }
                q.send(g.hasContent && g.data || null);
                k = function(P, T) {
                    var pa,X,ra,ja,Ia;
                    try {
                        if (k && (T || q.readyState ===
                                4)) {
                            k = d;
                            if (v) {
                                q.onreadystatechange = m.noop;
                                ob && delete Oa[v]
                            }
                            if (T)q.readyState !== 4 && q.abort(); else {
                                pa = q.status;
                                ra = q.getAllResponseHeaders();
                                ja = {};
                                if ((Ia = q.responseXML) && Ia.documentElement)ja.xml = Ia;
                                ja.text = q.responseText;
                                try {
                                    X = q.statusText
                                } catch(Xa) {
                                    X = ""
                                }
                                if (!pa && g.isLocal && !g.crossDomain)pa = ja.text ? 200 : 404; else if (pa === 1223)pa = 204
                            }
                        }
                    } catch(s) {
                        T || p(-1, s)
                    }
                    ja && p(pa, X, ja, ra)
                };
                if (!g.async || q.readyState === 4)k(); else {
                    v = ++Ka;
                    if (ob) {
                        if (!Oa) {
                            Oa = {};
                            m(a).unload(ob)
                        }
                        Oa[v] = k
                    }
                    q.onreadystatechange = k
                }
            },abort:function() {
                k &&
                k(0, 1)
            }}
        }
    });
    var Ja = {},Ea,qb,Ub = /^(?:toggle|show|hide)$/,Ma = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cb,Cb = [
        ["height","marginTop","marginBottom","paddingTop","paddingBottom"],
        ["width","marginLeft","marginRight","paddingLeft","paddingRight"],
        ["opacity"]
    ],ib;
    m.fn.extend({show:function(g, k, n) {
        if (g || g === 0)return this.animate(fa("show", 3), g, k, n); else {
            n = 0;
            for (var p = this.length; n < p; n++) {
                g = this[n];
                if (g.style) {
                    k = g.style.display;
                    if (!m._data(g, "olddisplay") && k === "none")k = g.style.display = "";
                    k === "" && m.css(g, "display") ===
                            "none" && m._data(g, "olddisplay", ha(g.nodeName))
                }
            }
            for (n = 0; n < p; n++) {
                g = this[n];
                if (g.style) {
                    k = g.style.display;
                    if (k === "" || k === "none")g.style.display = m._data(g, "olddisplay") || ""
                }
            }
            return this
        }
    },hide:function(g, k, n) {
        if (g || g === 0)return this.animate(fa("hide", 3), g, k, n); else {
            n = 0;
            for (var p = this.length; n < p; n++) {
                g = this[n];
                if (g.style) {
                    k = m.css(g, "display");
                    k !== "none" && !m._data(g, "olddisplay") && m._data(g, "olddisplay", k)
                }
            }
            for (n = 0; n < p; n++)if (this[n].style)this[n].style.display = "none";
            return this
        }
    },_toggle:m.fn.toggle,
        toggle:function(g, k, n) {
            var p = typeof g === "boolean";
            if (m.isFunction(g) && m.isFunction(k))this._toggle.apply(this, arguments); else g == null || p ? this.each(function() {
                var q = p ? g : m(this).is(":hidden");
                m(this)[q ? "show" : "hide"]()
            }) : this.animate(fa("toggle", 3), g, k, n);
            return this
        },fadeTo:function(g, k, n, p) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({opacity:k}, g, n, p)
        },animate:function(g, k, n, p) {
            function q() {
                v.queue === false && m._mark(this);
                var z = m.extend({}, v),D = this.nodeType === 1,P = D && m(this).is(":hidden"),
                        T,pa,X,ra,ja;
                z.animatedProperties = {};
                for (X in g) {
                    T = m.camelCase(X);
                    if (X !== T) {
                        g[T] = g[X];
                        delete g[X]
                    }
                    pa = g[T];
                    if (m.isArray(pa)) {
                        z.animatedProperties[T] = pa[1];
                        pa = g[T] = pa[0]
                    } else z.animatedProperties[T] = z.specialEasing && z.specialEasing[T] || z.easing || "swing";
                    if (pa === "hide" && P || pa === "show" && !P)return z.complete.call(this);
                    if (D && (T === "height" || T === "width")) {
                        z.overflow = [this.style.overflow,this.style.overflowX,this.style.overflowY];
                        if (m.css(this, "display") === "inline" && m.css(this, "float") === "none")if (!m.support.inlineBlockNeedsLayout ||
                                ha(this.nodeName) === "inline")this.style.display = "inline-block"; else this.style.zoom = 1
                    }
                }
                if (z.overflow != null)this.style.overflow = "hidden";
                for (X in g) {
                    D = new m.fx(this, z, X);
                    pa = g[X];
                    if (Ub.test(pa))if (T = m._data(this, "toggle" + X) || (pa === "toggle" ? P ? "show" : "hide" : 0)) {
                        m._data(this, "toggle" + X, T === "show" ? "hide" : "show");
                        D[T]()
                    } else D[pa](); else {
                        T = Ma.exec(pa);
                        ra = D.cur();
                        if (T) {
                            pa = parseFloat(T[2]);
                            ja = T[3] || (m.cssNumber[X] ? "" : "px");
                            if (ja !== "px") {
                                m.style(this, X, (pa || 1) + ja);
                                ra = (pa || 1) / D.cur() * ra;
                                m.style(this, X, ra + ja)
                            }
                            if (T[1])pa =
                                    (T[1] === "-=" ? -1 : 1) * pa + ra;
                            D.custom(ra, pa, ja)
                        } else D.custom(ra, pa, "")
                    }
                }
                return true
            }

            var v = m.speed(k, n, p);
            if (m.isEmptyObject(g))return this.each(v.complete, [false]);
            g = m.extend({}, g);
            return v.queue === false ? this.each(q) : this.queue(v.queue, q)
        },stop:function(g, k, n) {
            if (typeof g !== "string") {
                n = k;
                k = g;
                g = d
            }
            if (k && g !== false)this.queue(g || "fx", []);
            return this.each(function() {
                function p(P, T, pa) {
                    T = T[pa];
                    m.removeData(P, pa, true);
                    T.stop(n)
                }

                var q,v = false,z = m.timers,D = m._data(this);
                n || m._unmark(true, this);
                if (g == null)for (q in D)D[q].stop &&
                        q.indexOf(".run") === q.length - 4 && p(this, D, q); else if (D[q = g + ".run"] && D[q].stop)p(this, D, q);
                for (q = z.length; q--;)if (z[q].elem === this && (g == null || z[q].queue === g)) {
                    n ? z[q](true) : z[q].saveState();
                    v = true;
                    z.splice(q, 1)
                }
                n && v || m.dequeue(this, g)
            })
        }});
    m.each({slideDown:fa("show", 1),slideUp:fa("hide", 1),slideToggle:fa("toggle", 1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}}, function(g, k) {
        m.fn[g] = function(n, p, q) {
            return this.animate(k, n, p, q)
        }
    });
    m.extend({speed:function(g, k, n) {
        var p =
                g && typeof g === "object" ? m.extend({}, g) : {complete:n || !n && k || m.isFunction(g) && g,duration:g,easing:n && k || k && !m.isFunction(k) && k};
        p.duration = m.fx.off ? 0 : typeof p.duration === "number" ? p.duration : p.duration in m.fx.speeds ? m.fx.speeds[p.duration] : m.fx.speeds._default;
        if (p.queue == null || p.queue === true)p.queue = "fx";
        p.old = p.complete;
        p.complete = function(q) {
            m.isFunction(p.old) && p.old.call(this);
            if (p.queue)m.dequeue(this, p.queue); else q !== false && m._unmark(this)
        };
        return p
    },easing:{linear:function(g, k, n, p) {
        return n +
                p * g
    },swing:function(g, k, n, p) {
        return(-Math.cos(g * Math.PI) / 2 + 0.5) * p + n
    }},timers:[],fx:function(g, k, n) {
        this.options = k;
        this.elem = g;
        this.prop = n;
        k.orig = k.orig || {}
    }});
    m.fx.prototype = {update:function() {
        this.options.step && this.options.step.call(this.elem, this.now, this);
        (m.fx.step[this.prop] || m.fx.step._default)(this)
    },cur:function() {
        if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null))return this.elem[this.prop];
        var g,k = m.css(this.elem, this.prop);
        return isNaN(g = parseFloat(k)) ?
                !k || k === "auto" ? 0 : k : g
    },custom:function(g, k, n) {
        function p(z) {
            return q.step(z)
        }

        var q = this,v = m.fx;
        this.startTime = ib || W();
        this.end = k;
        this.now = this.start = g;
        this.pos = this.state = 0;
        this.unit = n || this.unit || (m.cssNumber[this.prop] ? "" : "px");
        p.queue = this.options.queue;
        p.elem = this.elem;
        p.saveState = function() {
            q.options.hide && m._data(q.elem, "fxshow" + q.prop) === d && m._data(q.elem, "fxshow" + q.prop, q.start)
        };
        if (p() && m.timers.push(p) && !cb)cb = setInterval(v.tick, v.interval)
    },show:function() {
        var g = m._data(this.elem, "fxshow" +
                this.prop);
        this.options.orig[this.prop] = g || m.style(this.elem, this.prop);
        this.options.show = true;
        g !== d ? this.custom(this.cur(), g) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
        m(this.elem).show()
    },hide:function() {
        this.options.orig[this.prop] = m._data(this.elem, "fxshow" + this.prop) || m.style(this.elem, this.prop);
        this.options.hide = true;
        this.custom(this.cur(), 0)
    },step:function(g) {
        var k,n = ib || W(),p = true,q = this.elem,v = this.options;
        if (g || n >= v.duration + this.startTime) {
            this.now = this.end;
            this.pos = this.state = 1;
            this.update();
            v.animatedProperties[this.prop] = true;
            for (k in v.animatedProperties)if (v.animatedProperties[k] !== true)p = false;
            if (p) {
                v.overflow != null && !m.support.shrinkWrapBlocks && m.each(["","X","Y"], function(z, D) {
                    q.style["overflow" + D] = v.overflow[z]
                });
                v.hide && m(q).hide();
                if (v.hide || v.show)for (k in v.animatedProperties) {
                    m.style(q, k, v.orig[k]);
                    m.removeData(q, "fxshow" + k, true);
                    m.removeData(q, "toggle" + k, true)
                }
                if (g = v.complete) {
                    v.complete = false;
                    g.call(q)
                }
            }
            return false
        } else {
            if (v.duration ==
                    Infinity)this.now = n; else {
                g = n - this.startTime;
                this.state = g / v.duration;
                this.pos = m.easing[v.animatedProperties[this.prop]](this.state, g, 0, 1, v.duration);
                this.now = this.start + (this.end - this.start) * this.pos
            }
            this.update()
        }
        return true
    }};
    m.extend(m.fx, {tick:function() {
        for (var g,k = m.timers,n = 0; n < k.length; n++) {
            g = k[n];
            !g() && k[n] === g && k.splice(n--, 1)
        }
        k.length || m.fx.stop()
    },interval:13,stop:function() {
        clearInterval(cb);
        cb = null
    },speeds:{slow:600,fast:200,_default:400},step:{opacity:function(g) {
        m.style(g.elem, "opacity",
                g.now)
    },_default:function(g) {
        if (g.elem.style && g.elem.style[g.prop] != null)g.elem.style[g.prop] = g.now + g.unit; else g.elem[g.prop] = g.now
    }}});
    m.each(["width","height"], function(g, k) {
        m.fx.step[k] = function(n) {
            m.style(n.elem, k, Math.max(0, n.now))
        }
    });
    if (m.expr && m.expr.filters)m.expr.filters.animated = function(g) {
        return m.grep(m.timers,
                function(k) {
                    return g === k.elem
                }).length
    };
    var Ya = /^t(?:able|d|h)$/i,Vb = /^(?:body|html)$/i;
    m.fn.offset = "getBoundingClientRect"in aa.documentElement ? function(g) {
        var k = this[0],n;
        if (g)return this.each(function(z) {
            m.offset.setOffset(this,
                    g, z)
        });
        if (!k || !k.ownerDocument)return null;
        if (k === k.ownerDocument.body)return m.offset.bodyOffset(k);
        try {
            n = k.getBoundingClientRect()
        } catch(p) {
        }
        var q = k.ownerDocument,v = q.documentElement;
        if (!n || !m.contains(v, k))return n ? {top:n.top,left:n.left} : {top:0,left:0};
        k = q.body;
        q = qa(q);
        return{top:n.top + (q.pageYOffset || m.support.boxModel && v.scrollTop || k.scrollTop) - (v.clientTop || k.clientTop || 0),left:n.left + (q.pageXOffset || m.support.boxModel && v.scrollLeft || k.scrollLeft) - (v.clientLeft || k.clientLeft || 0)}
    } : function(g) {
        var k =
                this[0];
        if (g)return this.each(function(pa) {
            m.offset.setOffset(this, g, pa)
        });
        if (!k || !k.ownerDocument)return null;
        if (k === k.ownerDocument.body)return m.offset.bodyOffset(k);
        var n,p = k.offsetParent,q = k,v = k.ownerDocument,z = v.documentElement,D = v.body;
        n = (v = v.defaultView) ? v.getComputedStyle(k, null) : k.currentStyle;
        for (var P = k.offsetTop,T = k.offsetLeft; (k = k.parentNode) && k !== D && k !== z;) {
            if (m.support.fixedPosition && n.position === "fixed")break;
            n = v ? v.getComputedStyle(k, null) : k.currentStyle;
            P -= k.scrollTop;
            T -= k.scrollLeft;
            if (k === p) {
                P += k.offsetTop;
                T += k.offsetLeft;
                if (m.support.doesNotAddBorder && !(m.support.doesAddBorderForTableAndCells && Ya.test(k.nodeName))) {
                    P += parseFloat(n.borderTopWidth) || 0;
                    T += parseFloat(n.borderLeftWidth) || 0
                }
                q = p;
                p = k.offsetParent
            }
            if (m.support.subtractsBorderForOverflowNotVisible && n.overflow !== "visible") {
                P += parseFloat(n.borderTopWidth) || 0;
                T += parseFloat(n.borderLeftWidth) || 0
            }
            n = n
        }
        if (n.position === "relative" || n.position === "static") {
            P += D.offsetTop;
            T += D.offsetLeft
        }
        if (m.support.fixedPosition && n.position ===
                "fixed") {
            P += Math.max(z.scrollTop, D.scrollTop);
            T += Math.max(z.scrollLeft, D.scrollLeft)
        }
        return{top:P,left:T}
    };
    m.offset = {bodyOffset:function(g) {
        var k = g.offsetTop,n = g.offsetLeft;
        if (m.support.doesNotIncludeMarginInBodyOffset) {
            k += parseFloat(m.css(g, "marginTop")) || 0;
            n += parseFloat(m.css(g, "marginLeft")) || 0
        }
        return{top:k,left:n}
    },setOffset:function(g, k, n) {
        var p = m.css(g, "position");
        if (p === "static")g.style.position = "relative";
        var q = m(g),v = q.offset(),z = m.css(g, "top"),D = m.css(g, "left"),P = {},T = {};
        if ((p === "absolute" ||
                p === "fixed") && m.inArray("auto", [z,D]) > -1) {
            T = q.position();
            p = T.top;
            D = T.left
        } else {
            p = parseFloat(z) || 0;
            D = parseFloat(D) || 0
        }
        if (m.isFunction(k))k = k.call(g, n, v);
        if (k.top != null)P.top = k.top - v.top + p;
        if (k.left != null)P.left = k.left - v.left + D;
        "using"in k ? k.using.call(g, P) : q.css(P)
    }};
    m.fn.extend({position:function() {
        if (!this[0])return null;
        var g = this[0],k = this.offsetParent(),n = this.offset(),p = Vb.test(k[0].nodeName) ? {top:0,left:0} : k.offset();
        n.top -= parseFloat(m.css(g, "marginTop")) || 0;
        n.left -= parseFloat(m.css(g, "marginLeft")) ||
                0;
        p.top += parseFloat(m.css(k[0], "borderTopWidth")) || 0;
        p.left += parseFloat(m.css(k[0], "borderLeftWidth")) || 0;
        return{top:n.top - p.top,left:n.left - p.left}
    },offsetParent:function() {
        return this.map(function() {
            for (var g = this.offsetParent || aa.body; g && !Vb.test(g.nodeName) && m.css(g, "position") === "static";)g = g.offsetParent;
            return g
        })
    }});
    m.each(["Left","Top"], function(g, k) {
        var n = "scroll" + k;
        m.fn[n] = function(p) {
            var q,v;
            if (p === d) {
                q = this[0];
                if (!q)return null;
                return(v = qa(q)) ? "pageXOffset"in v ? v[g ? "pageYOffset" : "pageXOffset"] :
                        m.support.boxModel && v.document.documentElement[n] || v.document.body[n] : q[n]
            }
            return this.each(function() {
                if (v = qa(this))v.scrollTo(!g ? p : m(v).scrollLeft(), g ? p : m(v).scrollTop()); else this[n] = p
            })
        }
    });
    m.each(["Height","Width"], function(g, k) {
        var n = k.toLowerCase();
        m.fn["inner" + k] = function() {
            var p = this[0];
            return p ? p.style ? parseFloat(m.css(p, n, "padding")) : this[n]() : null
        };
        m.fn["outer" + k] = function(p) {
            var q = this[0];
            return q ? q.style ? parseFloat(m.css(q, n, p ? "margin" : "border")) : this[n]() : null
        };
        m.fn[n] = function(p) {
            var q =
                    this[0];
            if (!q)return p == null ? null : this;
            if (m.isFunction(p))return this.each(function(D) {
                var P = m(this);
                P[n](p.call(this, D, P[n]()))
            });
            if (m.isWindow(q)) {
                var v = q.document.documentElement["client" + k],z = q.document.body;
                return q.document.compatMode === "CSS1Compat" && v || z && z["client" + k] || v
            } else if (q.nodeType === 9)return Math.max(q.documentElement["client" + k], q.body["scroll" + k], q.documentElement["scroll" + k], q.body["offset" + k], q.documentElement["offset" + k]); else if (p === d) {
                q = m.css(q, n);
                v = parseFloat(q);
                return m.isNumeric(v) ?
                        v : q
            } else return this.css(n, typeof p === "string" ? p : p + "px")
        }
    });
    a.jQuery = a.$ = m
})(window);
(function(a) {
    var d = false,c = /xyz/.test(function() {
    }),b = /\b_super\b/,e = function(f, j, h) {
        var l;
        h = h || f;
        for (l in f)h[l] = typeof f[l] == "function" && typeof j[l] == "function" && (!c || b.test(f[l])) ? function(o, r) {
            return function() {
                var u = this._super,C;
                this._super = j[o];
                C = r.apply(this, arguments);
                this._super = u;
                return C
            }
        }(l, f[l]) : f[l]
    };
    jQuery.Class = function() {
        arguments.length && this.extend.apply(this, arguments)
    };
    a.extend(a.Class, {callback:function(f) {
        var j = jQuery.makeArray(arguments),h;
        f = j.shift();
        jQuery.isArray(f) || (f =
                [f]);
        h = this;
        return function() {
            for (var l = j.concat(jQuery.makeArray(arguments)),o,r = f.length,u = 0,C; u < r; u++)if (C = f[u]) {
                if ((o = typeof C == "string") && h._set_called)h.called = C;
                l = (o ? h[C] : C).apply(h, l || []);
                if (u < r - 1)l = !jQuery.isArray(l) || l._use_call ? [l] : l
            }
            return l
        }
    },getObject:function(f, j) {
        j = j || window;
        for (var h = f ? f.split(/\./) : [],l = 0,o = h.length; l < o; l++)j = j[h[l]] || (j[h[l]] = {});
        return j
    },newInstance:function() {
        var f = this.rawInstance(),j;
        if (f.setup)j = f.setup.apply(f, arguments);
        if (f.init)f.init.apply(f, a.isArray(j) ?
                j : arguments);
        return f
    },setup:function(f) {
        this.defaults = a.extend(true, {}, f.defaults, this.defaults);
        return arguments
    },rawInstance:function() {
        d = true;
        var f = new this;
        d = false;
        return f
    },extend:function(f, j, h) {
        function l() {
            if (!d)return this.constructor !== l && arguments.length ? this.extend.apply(this, arguments) : this.Class.newInstance.apply(this.Class, arguments)
        }

        if (typeof f != "string") {
            h = j;
            j = f;
            f = null
        }
        if (!h) {
            h = j;
            j = null
        }
        h = h || {};
        var o = this.prototype,r = /\./,u,C,F,x;
        d = true;
        x = new this;
        d = false;
        e(h, o, x);
        for (u in this)if (this.hasOwnProperty(u) &&
                a.inArray(u, ["prototype","defaults","getObject"]) == -1)l[u] = this[u];
        e(j, this, l);
        if (f) {
            F = f.split(r);
            C = F.pop();
            F = o = a.Class.getObject(F.join("."));
            o[C] = l
        }
        a.extend(l, {prototype:x,namespace:F,shortName:C,constructor:l,fullName:f});
        l.prototype.Class = l.prototype.constructor = l;
        C = l.setup.apply(l, [this].concat(a.makeArray(arguments)));
        if (l.init)l.init.apply(l, C || []);
        return l
    }});
    jQuery.Class.prototype.callback = jQuery.Class.callback
})(jQuery);
(function(a) {
    var d = {undHash:/_|-/,colons:/::/,words:/([A-Z]+)([A-Z][a-z])/g,lowerUpper:/([a-z\d])([A-Z])/g,dash:/([a-z\d])([A-Z])/g},c = a.String = {strip:function(b) {
        return b.replace(/^\s+/, "").replace(/\s+$/, "")
    },capitalize:function(b) {
        return b.charAt(0).toUpperCase() + b.substr(1)
    },endsWith:function(b, e) {
        var f = b.length - e.length;
        return f >= 0 && b.lastIndexOf(e) === f
    },camelize:function(b) {
        b = b.split(d.undHash);
        var e = 1;
        for (b[0] = b[0].charAt(0).toLowerCase() + b[0].substr(1); e < b.length; e++)b[e] = c.capitalize(b[e]);
        return b.join("")
    },classize:function(b) {
        b = b.split(d.undHash);
        for (var e = 0; e < b.length; e++)b[e] = c.capitalize(b[e]);
        return b.join("")
    },niceName:function(b) {
        b = b.split(d.undHash);
        for (var e = 0; e < b.length; e++)b[e] = c.capitalize(b[e]);
        return b.join(" ")
    },underscore:function(b) {
        return b.replace(d.colons, "/").replace(d.words, "$1_$2").replace(d.lowerUpper, "$1_$2").replace(d.dash, "_").toLowerCase()
    }}
})(jQuery);
(function(a) {
    a.String.rsplit = function(d, c) {
        for (var b = c.exec(d),e = [],f; b != null;) {
            f = b.index;
            if (f != 0) {
                e.push(d.substring(0, f));
                d = d.slice(f)
            }
            e.push(b[0]);
            d = d.slice(b[0].length);
            b = c.exec(d)
        }
        d != "" && e.push(d);
        return e
    }
})(jQuery);
(function(a) {
    var d = jQuery.cleanData;
    a.cleanData = function(c) {
        for (var b = 0,e; (e = c[b]) != null; b++)a(e).triggerHandler("destroyed");
        d(c)
    }
})(jQuery);
(function(a) {
    var d = function(x, I, G) {
        var H;
        if (I.indexOf(">") == 0) {
            I = I.substr(1);
            H = function(A) {
                A.target === x ? G.apply(this, arguments) : A.handled = null
            }
        }
        a(x).bind(I, H || G);
        return function() {
            a(x).unbind(I, H || G);
            x = I = G = H = null
        }
    },c = function(x, I, G, H) {
        a(x).delegate(I, G, H);
        return function() {
            a(x).undelegate(I, G, H);
            x = G = H = I = null
        }
    },b = function(x, I, G, H) {
        return H ? c(x, H, I, G) : d(x, I, G)
    },e = function(x) {
        return function() {
            return x.apply(null, [a(this)].concat(Array.prototype.slice.call(arguments, 0)))
        }
    },f = /\./g,j = /_?controllers?/ig,
            h = /[^\w]/,l = /^(>?default\.)|(>)/,o = /\{([^\}]+)\}/g,r = /^(?:(.*?)\s)?([\w\.\:>]+)$/;
    a.Class.extend("jQuery.Controller", {init:function() {
        if (!(!this.shortName || this.fullName == "jQuery.Controller")) {
            this._fullName = a.String.underscore(this.fullName.replace(f, "_").replace(j, ""));
            this._shortName = a.String.underscore(this.shortName.replace(f, "_").replace(j, ""));
            var x = this,I = this._fullName,G;
            a.fn[I] || (a.fn[I] = function(H) {
                var A = a.makeArray(arguments),N = typeof H == "string" && a.isFunction(x.prototype[H]),ba = A[0];
                this.each(function() {
                    var K = a.data(this, "controllers");
                    if (K = K && K[I])N ? K[ba].apply(K, A.slice(1)) : K.update.apply(K, A); else x.newInstance.apply(x, [this].concat(A))
                });
                return this
            });
            if (!a.isArray(this.listensTo))throw"listensTo is not an array in " + this.fullName;
            this.actions = {};
            for (G in this.prototype)if (a.isFunction(this.prototype[G]))this._isAction(G) && (this.actions[G] = this._getAction(G));
            this.onDocument && new this(document.documentElement)
        }
    },hookup:function(x) {
        return new this(x)
    },_isAction:function(x) {
        if (h.test(x))return true;
        else {
            x = x.replace(l, "");
            return a.inArray(x, this.listensTo) > -1 || a.event.special[x] || a.Controller.processors[x]
        }
    },_getAction:function(x, I) {
        o.lastIndex = 0;
        if (!I && o.test(x))return null;
        var G = (I ? x.replace(o, function(H, A) {
            return a.Class.getObject(A, I).toString()
        }) : x).match(r);
        return{processor:this.processors[G[2]] || u,parts:G}
    },processors:{},listensTo:[]}, {setup:function(x, I) {
        var G,H,A = this.Class;
        x = x.jquery ? x[0] : x;
        this.element = a(x).addClass(A._fullName);
        (a.data(x, "controllers") || a.data(x, "controllers", {}))[A._fullName] =
                this;
        this._bindings = [];
        this.options = a.extend(a.extend(true, {}, A.defaults), I);
        for (G in A.actions) {
            H = A.actions[G] || A._getAction(G, this.options);
            this._bindings.push(H.processor(x, H.parts[2], H.parts[1], this.callback(G), this))
        }
        this.called = "init";
        var N = e(this.callback("destroy"));
        this.element.bind("destroyed", N);
        this._bindings.push(function() {
            N.removed = true;
            a(x).unbind("destroyed", N)
        });
        return this.element
    },bind:function(x, I, G) {
        if (typeof x == "string") {
            G = I;
            I = x;
            x = this.element
        }
        return this._binder(x, I, G)
    },_binder:function(x, I, G, H) {
        if (typeof G == "string")G = e(this.callback(G));
        this._bindings.push(b(x, I, G, H));
        return this._bindings.length
    },delegate:function(x, I, G, H) {
        if (typeof x == "string") {
            H = G;
            G = I;
            I = x;
            x = this.element
        }
        return this._binder(x, G, H, I)
    },update:function(x) {
        a.extend(this.options, x)
    },destroy:function() {
        if (this._destroyed)throw this.Class.shortName + " controller instance has been deleted";
        var x = this,I = this.Class._fullName;
        this._destroyed = true;
        this.element.removeClass(I);
        a.each(this._bindings, function(H, A) {
            a.isFunction(A) &&
            A(x.element[0])
        });
        delete this._actions;
        var G = this.element.data("controllers");
        G && G[I] && delete G[I];
        this.element = null
    },find:function(x) {
        return this.element.find(x)
    },_set_called:true});
    var u = function(x, I, G, H, A) {
        A = A.Class;
        if (A.onDocument && !/^Main(Controller)?$/.test(A.shortName))G = G ? "#" + A._shortName + " " + G : "#" + A._shortName;
        return b(x, I, e(H), G)
    },C = a.Controller.processors,F = function(x, I, G, H) {
        return b(window, I.replace(/window/, ""), e(H))
    };
    a.each("change click contextmenu dblclick keydown keyup keypress mousedown mousemove mouseout mouseover mouseup reset windowresize resize windowscroll scroll select submit dblclick focusin focusout load unload ready hashchange mouseenter mouseleave".split(" "),
            function(x, I) {
                C[I] = u
            });
    a.each(["windowresize","windowscroll","load","ready","unload","hashchange"], function(x, I) {
        C[I] = F
    });
    C.ready = function(x, I, G, H) {
        a(e(H))
    };
    a.fn.mixin = function() {
        var x = a.makeArray(arguments);
        return this.each(function() {
            for (var I = 0; I < x.length; I++)new x[I](this)
        })
    };
    a.fn.controllers = function() {
        var x = a.makeArray(arguments),I = [],G;
        this.each(function() {
            if (G = a.data(this, "controllers"))for (var H in G) {
                var A = G[H],N;
                if (!(N = !x.length))a:{
                    for (N = 0; N < x.length; N++)if (typeof x[N] == "string" ? A.Class._shortName ==
                            x[N] : A instanceof x[N]) {
                        N = true;
                        break a
                    }
                    N = false
                }
                N && I.push(A)
            }
        });
        return I
    };
    a.fn.controller = function() {
        return this.controllers.apply(this, arguments)[0]
    }
})(jQuery);
(function(a) {
    a.Controller.getFolder = function() {
        return a.String.underscore(this.fullName.replace(/\./g, "/")).replace("/Controllers", "")
    };
    a.Controller.prototype.calculateHelpers = function(d) {
        var c = {};
        if (d)if (a.isArray(d))for (var b = 0; b < d.length; b++)a.extend(c, d[b]); else a.extend(c, d); else {
            if (this._default_helpers)c = this._default_helpers;
            d = window;
            b = this.Class.fullName.split(/\./);
            for (var e = 0; e < b.length; e++) {
                typeof d.Helpers == "object" && a.extend(c, d.Helpers);
                d = d[b[e]]
            }
            typeof d.Helpers == "object" && a.extend(c,
                    d.Helpers);
            this._default_helpers = c
        }
        return c
    };
    a.Controller.prototype.view = function(d, c, b) {
        if (!d)throw Error("no view was provided");
        d = "gs/views/" + this.Class._shortName + "/" + d + a.View.ext;
        c = c || this;
        b = this.calculateHelpers.call(this, b);
        return a.View(d, c, b)
    }
})(jQuery);
(function() {
    jQuery.fn.compare = function(a) {
        try {
            a = a.jquery ? a[0] : a
        } catch(d) {
            return null
        }
        if (window.HTMLElement) {
            var c = HTMLElement.prototype.toString.call(a);
            if (c == "[xpconnect wrapped native prototype]" || c == "[object XULElement]")return null
        }
        if (this[0].compareDocumentPosition)return this[0].compareDocumentPosition(a);
        if (this[0] == document && a != document)return 8;
        c = (this[0] !== a && this[0].contains(a) && 16) + (this[0] != a && a.contains(this[0]) && 8);
        var b = document.documentElement;
        if (this[0].sourceIndex) {
            c += this[0].sourceIndex <
                    a.sourceIndex && 4;
            c += this[0].sourceIndex > a.sourceIndex && 2;
            c += (this[0].ownerDocument !== a.ownerDocument || this[0] != b && this[0].sourceIndex <= 0 || a != b && a.sourceIndex <= 0) && 1
        } else {
            b = document.createRange();
            var e = document.createRange();
            b.selectNode(this[0]);
            e.selectNode(a);
            b.compareBoundaryPoints(Range.START_TO_START, e)
        }
        return c
    }
})(jQuery);
(function(a) {
    a.fn.within = function(d, c, b) {
        var e = [];
        this.each(function() {
            var f = jQuery(this);
            if (this == document.documentElement)return e.push(this);
            f = b ? jQuery.data(this, "offset", f.offset()) : f.offset();
            c >= f.top && c < f.top + this.offsetHeight && d >= f.left && d < f.left + this.offsetWidth && e.push(this)
        });
        return this.pushStack(jQuery.unique(e), "within", d + "," + c)
    };
    a.fn.withinBox = function(d, c, b, e, f) {
        var j = [];
        this.each(function() {
            var h = jQuery(this);
            if (this == document.documentElement)return this.ret.push(this);
            var l = f ? jQuery.data(this,
                    "offset", h.offset()) : h.offset(),o = h.width();
            h = h.height();
            (res = !(l.top > c + e || l.top + h < c || l.left > d + b || l.left + o < d)) && j.push(this)
        });
        return this.pushStack(jQuery.unique(j), "withinBox", jQuery.makeArray(arguments).join(","))
    }
})(jQuery);
(function(a) {
    var d = 1;
    a.View = function(f, j, h) {
        var l = f.match(/\.[\w\d]+/),o,r;
        if (!l) {
            l = a.View.ext;
            f += a.View.ext
        }
        r = f.replace(/[\/\.]/g, "_");
        l = a.View.types[l];
        if (a.View.cached[r])f = a.View.cached[r]; else if (o = document.getElementById(r)) {
            o = o.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
            f = l.renderer(r, o)
        } else f = (o = a.View.preCached[r] || a.View.preCached[r.replace(/^_/, "")]) ? l.renderer(r, o) : l.get(r, f);
        if (a.View.cache)a.View.cached[r] = f;
        return f.call(l, j, h).replace(/\uFEFF/, "")
    };
    a.extend(a.View, {hookups:{},hookup:function(f) {
        var j = ++d;
        jQuery.View.hookups[j] = f;
        return j
    },cached:{},preCached:{},cache:true,register:function(f) {
        this.types["." + f.suffix] = f
    },types:{},ext:".ejs",registerScript:function(f, j, h) {
        return"$.View.preload('" + j + "'," + a.View.types["." + f].script(j, h) + ");"
    },preload:function(f, j) {
        a.View.cached[f] = function(h, l) {
            return j.call(h, h, l)
        }
    }});
    for (var c = ["prepend","append","after","before","replace","text","html","replaceWith"],b = function(f) {
        var j = jQuery.fn[f];
        jQuery.fn[f] =
                function() {
                    var h = arguments,l;
                    l = typeof arguments[1];
                    if (typeof arguments[0] == "string" && (l == "object" || l == "function") && !arguments[1].nodeType && !arguments[1].jquery)h = [a.View.apply(a.View, a.makeArray(arguments))];
                    for (var o in jQuery.View.hookups);
                    if (o)h[0] = a(h[0]);
                    l = j.apply(this, h);
                    if (o) {
                        var r = h[0];
                        h = a.View.hookups;
                        var u;
                        o = 0;
                        var C,F;
                        a.View.hookups = {};
                        r = r.add("[data-view-id]", r);
                        for (u = r.length; o < u; o++)if (r[o].getAttribute && (C = r[o].getAttribute("data-view-id")) && (F = h[C])) {
                            F(r[o], C);
                            delete h[C];
                            r[o].removeAttribute("data-view-id")
                        }
                        a.extend(a.View.hookups,
                                h)
                    }
                    return l
                }
    },e = 0; e < c.length; e++)b(c[e])
})(jQuery);
(function(a) {
    var d = a.extend,c = a.isArray,b = function(e) {
        if (this.constructor != b) {
            var f = new b(e);
            return function(h, l) {
                return f.render(h, l)
            }
        }
        if (typeof e == "function") {
            this.template = {};
            this.template.process = e
        } else {
            a.extend(this, b.options, e);
            var j = new b.Compiler(this.text, this.type);
            j.compile(e, this.name);
            this.template = j
        }
    };
    a.View.EJS = b;
    b.prototype = {constructor:b,render:function(e, f) {
        e = e || {};
        this._extra_helpers = f;
        var j = new b.Helpers(e, f || {});
        return this.template.process.call(e, e, j)
    },out:function() {
        return this.template.out
    }};
    b.defaultSplitRegexp = /(<%%)|(%%>)|(<%=)|(<%#)|(<%)|(%>\n)|(%>)|(\n)/;
    b.Scanner = function(e, f, j) {
        d(this, {left_delimiter:f + "%",right_delimiter:"%" + j,double_left:f + "%%",double_right:"%%" + j,left_equal:f + "%=",left_comment:f + "%#"});
        this.SplitRegexp = f == "<" ? b.defaultSplitRegexp : RegExp("(" + this.double_left + ")|(%%" + this.double_right + ")|(" + this.left_equal + ")|(" + this.left_comment + ")|(" + this.left_delimiter + ")|(" + this.right_delimiter + "\n)|(" + this.right_delimiter + ")|(\n)");
        this.source = e;
        this.stag = null;
        this.lines =
                0
    };
    b.Scanner.to_text = function(e) {
        var f;
        if (e == null || e === undefined)return"";
        if (e instanceof Date)return e.toDateString();
        if (e.hookup) {
            f = a.View.hookup(function(j, h) {
                e.hookup.call(e, j, h)
            });
            return"data-view-id='" + f + "'"
        }
        if (typeof e == "function")return"data-view-id='" + a.View.hookup(e) + "'";
        if (c(e)) {
            f = a.View.hookup(function(j, h) {
                for (var l = 0,o = e.length; l < o; l++)(e[l].hookup || e[l])(j, h)
            });
            return"data-view-id='" + f + "'"
        }
        if (e.nodeName || e.jQuery)throw"elements in views are not supported";
        if (e.toString)return f ? e.toString(f) :
                e.toString();
        return""
    };
    b.Scanner.prototype = {scan:function(e) {
        var f = this.SplitRegexp;
        if (this.source != "") {
            var j = a.String.rsplit(this.source, /\n/),h,l;
            h = 0;
            for (l = j.length; h < l; h++)this.scanline(j[h], f, e)
        }
    },scanline:function(e, f, j) {
        this.lines++;
        e = a.String.rsplit(e, f);
        var h;
        for (f = 0; (h = e[f]) != null; f++)try {
            j(h, this)
        } catch(l) {
            throw{type:"jQuery.View.EJS.Scanner",line:this.lines};
        }
    }};
    b.Buffer = function(e, f) {
        this.line = [];
        this.script = "";
        this.pre_cmd = e;
        this.post_cmd = f;
        for (var j = 0,h = this.pre_cmd.length; j < h; j++)this.push(e[j])
    };
    b.Buffer.prototype = {push:function(e) {
        this.line.push(e)
    },cr:function() {
        this.script += this.line.join("; ");
        this.line = [];
        this.script += "\n"
    },close:function() {
        if (this.line.length > 0) {
            for (var e = 0,f = this.post_cmd.length; e < f; e++)this.push(pre_cmd[e]);
            this.script += this.line.join("; ");
            line = null
        }
    }};
    b.Compiler = function(e, f) {
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
        this.scanner = new b.Scanner(this.source, f, j);
        this.out = ""
    };
    b.Compiler.prototype = {compile:function(e, f) {
        e = e || {};
        this.out = "";
        var j = new b.Buffer(this.pre_cmd, this.post_cmd),h = "",l = function(C) {
            C = C.replace(/\\/g, "\\\\");
            C = C.replace(/\n/g, "\\n");
            return C = C.replace(/"/g, '\\"')
        };
        this.scanner.scan(function(C, F) {
            if (F.stag == null)switch (C) {
                case "\n":
                    h +=
                            "\n";
                    j.push('___ViewO.push("' + l(h) + '");');
                    j.cr();
                    h = "";
                    break;
                case F.left_delimiter:
                case F.left_equal:
                case F.left_comment:
                    F.stag = C;
                    h.length > 0 && j.push('___ViewO.push("' + l(h) + '")');
                    h = "";
                    break;
                case F.double_left:
                    h += F.left_delimiter;
                    break;
                default:
                    h += C;
                    break
            } else switch (C) {
                case F.right_delimiter:
                    switch (F.stag) {
                        case F.left_delimiter:
                            if (h[h.length - 1] == "\n") {
                                h = h.substr(0, h.length - 1);
                                j.push(h);
                                j.cr()
                            } else j.push(h);
                            break;
                        case F.left_equal:
                            j.push("___ViewO.push((jQuery.View.EJS.Scanner.to_text(" + h + ")))");
                            break
                    }
                    F.stag =
                            null;
                    h = "";
                    break;
                case F.double_right:
                    h += F.right_delimiter;
                    break;
                default:
                    h += C;
                    break
            }
        });
        h.length > 0 && j.push('___ViewO.push("' + l(h) + '")');
        j.close();
        this.out = j.script + ";";
        var o = ["/*",f,"*/this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {",this.out," return ___ViewO.join('');}}}catch(e){console.log(___ViewO);e.lineNumber=null;throw e;}};"].join("");
        try {
            eval(o)
        } catch(r) {
            if (typeof JSLINT != "undefined") {
                JSLINT(this.out);
                for (var u = 0; u < JSLINT.errors.length; u++) {
                    o = JSLINT.errors[u];
                    if (o.reason != "Unnecessary semicolon.") {
                        o.line++;
                        u = Error(o.reason);
                        u.lineNumber = o.line;
                        if (e.view)u.fileName = e.view;
                        throw u;
                    }
                }
            } else throw r;
        }
    }};
    b.options = {cache:true,type:"<",ext:".ejs"};
    b.INVALID_PATH = -1;
    b.Helpers = function(e, f) {
        this._data = e;
        this._extras = f;
        d(this, f)
    };
    b.Helpers.prototype = {view:function(e, f, j) {
        if (!j)j = this._extras;
        if (!f)f = this._data;
        return a.View(e, f, j)
    },to_text:function(e, f) {
        if (e == null || e === undefined)return f || "";
        if (e instanceof Date)return e.toDateString();
        if (e.toString)return e.toString().replace(/\n/g,
                "<br />").replace(/''/g, "'");
        return""
    },plugin:function() {
        var e = a.makeArray(arguments),f = e.shift();
        return function(j) {
            j = a(j);
            j[f].apply(j, e)
        }
    }};
    a.View.register({suffix:"ejs",get:function(e, f) {
        var j = f.match(/\.[\w\d]+[\?]+/);
        j = a.ajax({async:false,url:f + (j ? "&" : "?") + ("cver=" + gsConfig.coreVersion),dataType:"text",error:function() {
            throw"ejs.js ERROR: There is no template or an empty template at " + f;
        }}).responseText;
        if (!j.match(/[^\s]/))throw"ejs.js ERROR: There is no template or an empty template at " +
                f;
        return this.renderer(e, j)
    },script:function(e, f) {
        return["jQuery.View.EJS(function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {",(new b({text:f})).out()," return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}})"].join("")
    },renderer:function(e, f) {
        var j = new b({text:f,name:e});
        return function(h, l) {
            return j.render.call(j, h, l)
        }
    }})
})(jQuery);
(function(a) {
    var d = a.String.underscore;
    jQuery.Class.extend("jQuery.Model", {setup:function() {
        this.attributes = {};
        this.associations = {};
        this._fullName = d(this.fullName.replace(/\./g, "_"));
        if (this.fullName.substr(0, 7) != "jQuery.")jQuery.Model.models[this._fullName] = this
    },defaults:{},wrap:function(c) {
        if (!c)return null;
        return new this(c[this.singularName] || c.attributes || c)
    },wrapMany:function(c) {
        if (!c)return null;
        var b = new (this.List || Array),e = a.isArray(c),f = e ? c : c.data,j = f.length,h = 0;
        for (b._use_call = true; h <
                j; h++)b.push(this.wrap(f[h]));
        if (!e)for (var l in c)if (l !== "data")b[l] = c[l];
        return b
    },id:"id",addAttr:function(c, b) {
        this.attributes[c] || (this.attributes[c] = b);
        return b
    },models:{},guessType:function(c) {
        if (typeof c != "string") {
            if (c == null)return typeof c;
            if (c.constructor == Date)return"date";
            if (a.isArray(c))return"array";
            return typeof c
        }
        if (c == "")return"string";
        if (c == "true" || c == "false")return"boolean";
        if (!isNaN(c))return"number";
        return typeof c
    },converters:{date:function(c) {
        return this._parseDate(c)
    },number:function(c) {
        return parseFloat(c)
    },
        "boolean":function(c) {
            return Boolean(c)
        }},_parseDate:function(c) {
        return typeof c == "string" ? Date.parse(c) == NaN ? null : Date.parse(c) : c
    }}, {init:function(c) {
        this.Class.defaults && this.attrs(this.Class.defaults);
        this.attrs(c)
    },attr:function(c, b) {
        b !== undefined && this._setProperty(c, b);
        return this[c]
    },_setProperty:function(c, b) {
        var e = this.Class,f = e.attributes[c] || e.addAttr(c, e.guessType(b));
        f = e.converters[f];
        this[c] = b == null ? null : f ? f.call(e, b) : b
    },attrs:function(c) {
        var b;
        if (c) {
            var e = this.Class.id;
            for (b in c)b !=
                    e && this.attr(b, c[b]);
            e in c && this.attr(e, c[e])
        } else {
            c = {};
            for (b in this.Class.attributes)c[b] = this.attr(b)
        }
        return c
    }});
    a.fn.models = function() {
        var c = [],b,e;
        this.each(function() {
            a.each(a.data(this, "models") || {}, function(f, j) {
                b = b === undefined ? j.Class.List || null : j.Class.List === b ? b : null;
                c.push(j)
            })
        });
        e = new (b || a.Model.list || Array);
        e.push.apply(e, a.unique(c));
        return e
    };
    a.fn.model = function() {
        return this.models.apply(this, arguments)[0]
    }
})(jQuery);
(function(a) {
    this._ = {defined:function(d) {
        return d !== a && d !== null
    },notDefined:function(d) {
        return d === a || d === null
    },orEqual:function(d, c) {
        return this.defined(d) ? d : c
    },measure:function(d, c, b) {
        var e;
        if (d._wrapped)return d; else {
            e = function() {
                console.time(c);
                d.apply(b || window, arguments);
                console.timeEnd(c)
            };
            e._wrapped = true;
            return e
        }
    },orEqualEx:function() {
        var d,c = arguments.length;
        for (d = 0; d < c; d++)if (this.defined(arguments[d]))return arguments[d];
        return arguments[c - 1]
    },generate404:function() {
        return"#/404"
    },redirectSong:function(d, c) {
        console.log("redirect user to song: " + d);
        _.orEqual(c, window.event);
        var b = GS.Models.Song.getOneFromCache(d);
        if (!(b && b.SongID && b.SongID > 0))throw"redirectSong: Invalid SongID given: " + d;
        url = _.cleanUrl(b.SongName, b.SongID, "song", b.getToken());
        GS.router.redirect(url)
    },cleanUrl:function(d, c, b, e, f) {
        var j;
        j = "";
        if (isNaN(parseInt(c, 10))) {
            j = c;
            c = d;
            d = j
        }
        d = d || "Unknown";
        d = _.cleanNameForURL(d, b != "user");
        b = b.toLowerCase();
        f = _.orEqual(f, "");
        if (f.length)f = "/" + f;
        if (b === "s" && !e)return _.generate404();
        if (e) {
            if (b == "song")b =
                    "s";
            j = "#/" + b + "/" + d + "/" + e + f + "?src=5"
        } else j = "#/" + b + "/" + d + "/" + c + f;
        return j
    },makeUrlFromPathName:function(d, c) {
        c = _.orEqual(c, "");
        if (c.length)c = "/" + c;
        return"#/" + d + c
    },makeUrlForShare:function(d, c, b) {
        var e = encodeURIComponent("http://grooveshark.com" + b.toUrl().substr(1)),f = "";
        switch (c) {
            case "song":
                f = b.SongName + " by " + b.ArtistName;
                break;
            case "playlist":
                f = b.PlaylistName + " by " + b.UserName;
                break;
            case "album":
                f = b.AlbumName + " by " + b.ArtistName;
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
    },cleanNameForURL:function(d, c) {
        if (c = _.orEqual(c, true))d = _.ucwords(d, true);
        d = ("" + d).replace(/&/g, " and ").replace(/#/g, " number ").replace(/[^\w]/g, "_");
        d = $.trim(d).replace(/\s/g, "_");
        d = d.replace(/__+/g, "_");
        d = encodeURIComponent(d);
        return d = d.replace(/_/g, "+")
    },cleanURLSlug:function(d) {
        d = d.replace(/^\s+|\s+$/g, "");
        d = d.toLowerCase();
        for (var c = 0; c < 28; c++)d = d.replace(RegExp("\u00e0\u00e1\u00e4\u00e2\u00e8\u00e9\u00eb\u00ea\u00ec\u00ed\u00ef\u00ee\u00f2\u00f3\u00f6\u00f4\u00f9\u00fa\u00fc\u00fb\u00f1\u00e7\u00b7/_,:;".charAt(c),
                "g"), "aaaaeeeeiiiioooouuuunc------".charAt(c));
        return d = d.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "_").replace(/-+/g, "_")
    },cleanTextDiv:$("<div/>"),cleanText:function(d) {
        if ((d = $.trim(d)) && d.length)return $.trim(_.cleanTextDiv.text(d).html().replace(/\"/g, "&quot;").replace(/&amp\;/g, "&"));
        return""
    },uncleanText:function(d) {
        if (d && d.length)return _.cleanTextDiv.html(d).text().replace(/\"/g, '"');
        return""
    },getString:function(d, c) {
        var b = $.localize.getString(d);
        if (b && b.length)return(new GS.Models.DataString(b,
                c)).render();
        return""
    },ucwords:function(d, c) {
        c || (d = (d + "").toLowerCase());
        return(d + "").replace(/^(.)|\s(.)/g, function(b) {
            return b.toUpperCase()
        })
    },arrRemove:function(d, c, b) {
        d.splice(c, (b || c || 1) + (c < 0 ? d.length : 0));
        return d
    },arrUnique:function(d) {
        for (var c = [],b = {},e = 0,f = d.length; e < f; e++)if (!b[d[e]]) {
            c.push(d[e]);
            b[d[e]] = true
        }
        return c
    },isNumber:function(d) {
        return d === +d || Object.prototype.toString.call(d) === "[object Number]"
    },isArray:Array.isArray || function(d) {
        return!!(d && d.concat && d.unshift && !d.callee)
    },
        isString:function(d) {
            return!!(d === "" || d && d.charCodeAt && d.substr)
        },forEach:function(d, c, b) {
            if (!_.isEmpty(d)) {
                if (Array.prototype.forEach && d.forEach === Array.prototype.forEach)d.forEach(c, b); else if (_.isNumber(d.length))for (var e = 0,f = d.length; e < f; e++)c.call(b, d[e], e, d); else for (e in d)Object.prototype.hasOwnProperty.call(d, e) && c.call(b, d[e], e, d);
                return d
            }
        },map:function(d, c, b) {
            if (Array.prototype.map && d.map === Array.prototype.map)return d.map(c, b);
            var e = [];
            _.forEach(d, function(f, j, h) {
                e.push(c.call(b, f, j,
                        h))
            });
            return e
        },arrInclude:function(d, c) {
            return d.indexOf(c) != -1
        },toArray:function(d) {
            var c = [];
            for (var b in d)d.hasOwnProperty(b) && d[b] !== true && c.push(d[b]);
            return c
        },toArrayID:function(d) {
            var c = [];
            for (var b in d)d.hasOwnProperty(b) && c.push(b);
            return c
        },isEmpty:function(d) {
            if (_.isArray(d) || _.isString(d))return d.length === 0;
            for (var c in d)if (Object.prototype.hasOwnProperty.call(d, c))return false;
            return true
        },count:function(d) {
            var c = 0;
            for (var b in d)d.hasOwnProperty(b) && c++;
            return c
        },unixTime:function(d) {
            d =
                    _.orEqual(d, new Date);
            return parseInt(d.getTime() / 1E3, 10)
        },millisToMinutesSeconds:function(d, c) {
            c = _.orEqual(c, false);
            var b = Math.round((d ? d : 0) / 1E3),e = Math.floor(b / 60);
            b -= e * 60;
            if (b < 10)b = "0" + b;
            if (e < 10 && c)e = "0" + e;
            return e + ":" + b
        },dobToAge:function(d, c, b) {
            d = d && _.notDefined(c) && _.notDefined(b) ? new Date(d) : new Date(d, c, b);
            d = ((new Date).getTime() - d.getTime()) / 864E5;
            d = Math.floor(d / 365.24);
            return isNaN(d) ? false : d
        },guessDragType:function(d) {
            if (typeof d === "undefined")return"unknown";
            if ($.isArray(d) && d.length)d =
                    d[0];
            if (typeof d.SongID !== "undefined")return"song";
            if (typeof d.AlbumID !== "undefined")return"album";
            if (typeof d.ArtistID !== "undefined")return"artist";
            if (typeof d.PlaylistID !== "undefined")return"playlist";
            if (typeof d.UserID !== "undefined")return"user";
            if (typeof d.StationID !== "undefined")return"station";
            return"unknown"
        },globalDragProxyMousewheel:function(d, c) {
            var b = $("#shortcuts_scroll .viewport");
            if (b.within(d.clientX, d.clientY).length > 0)b.scrollTop(b.scrollTop() - 82 * c); else {
                b = $("#queue_list_window");
                if (b.within(d.clientX, d.clientY).length > 0)b.scrollLeft(b.scrollLeft() - 82 * c); else {
                    b = $("#sidebar_pinboard .viewport");
                    if (b.within(d.clientX, d.clientY).length > 0)b.scrollTop(b.scrollTop() - 82 * c); else {
                        b = (b = $("#grid").controller()) && b.options.scrollPane ? b.options.scrollPane : $("#grid .slick-viewport");
                        b.within(d.clientX, d.clientY).length > 0 && b.scrollTop(b.scrollTop() - 82 * c)
                    }
                }
            }
        },browserDetect:function() {
            var d = {browser:"",version:0},c = navigator.userAgent.toLowerCase();
            $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
            $.browser.adobeair = /adobeair/.test(navigator.userAgent.toLowerCase());
            if ($.browser.msie) {
                c = $.browser.version;
                c = c.substring(0, c.indexOf("."));
                d.browser = "msie";
                d.version = parseFloat(c)
            }
            if ($.browser.chrome && !$.browser.msie) {
                c = c.substring(c.indexOf("chrome/") + 7);
                c = c.substring(0, c.indexOf("."));
                d.browser = "chrome";
                d.version = parseFloat(c);
                $.browser.safari = false
            }
            if ($.browser.adobeair) {
                c = c.substring(c.indexOf("adobeair/") + 9);
                c = c.substring(0, c.indexOf("."));
                d.browser = "adobeair";
                d.version = parseFloat(c);
                $.browser.safari =
                        false
            }
            if ($.browser.safari) {
                c = c.substring(c.indexOf("safari/") + 7);
                c = c.substring(0, c.indexOf("."));
                d.browser = "safari";
                d.version = parseFloat(c)
            }
            if ($.browser.mozilla)if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
                c = c.substring(c.indexOf("firefox/") + 8);
                c = c.substring(0, c.indexOf("."));
                d.browser = "firefox";
                d.version = parseFloat(c)
            } else {
                d.browser = "mozilla";
                d.version = parseFloat($.browser.version)
            }
            if ($.browser.opera) {
                c = c.substring(c.indexOf("version/") + 8);
                c = c.substring(0, c.indexOf("."));
                d.browser =
                        "opera";
                d.version = parseFloat(c)
            }
            return d
        },getSort:function(d, c) {
            c = c ? 1 : -1;
            return function(b, e) {
                var f = _.isString(b[d]) ? b[d].toLowerCase() : b[d],j = _.isString(e[d]) ? e[d].toLowerCase() : e[d];
                if (f > j)return c;
                if (f < j)return-1 * c;
                return 0
            }
        },numSortA:function(d, c) {
            return d - c
        },numSortD:function(d, c) {
            return c - d
        },expandedTrace:function(d, c) {
            c = _.orEqual(c, "");
            for (var b in d)if (d.hasOwnProperty(b)) {
                console.log(c + b + ": " + d[b]);
                d[b] && d[b].toString() === "[object Object]" && this.expandedTrace(d[b], c + "\t")
            }
        },printf:function(d, c) {
            return c ? (new GS.Models.DataString($.localize.getString(d), c)).render() : $.localize.getString(d)
        },wait:function(d) {
            return $.Deferred(function(c) {
                setTimeout(c.resolve, d)
            })
        },emailRegex:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i,keys:{ESC:27,ENTER:13,UP:38,DOWN:40,LEFT:37,RIGHT:39,TAB:9,BACKSPACE:8,AT:64},states:["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
            "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],countries:[
            {iso:"US",name:"United States",callingCode:"1"},
            {iso:"AF",name:"Afghanistan",callingCode:"93"},
            {iso:"AL",name:"Albania",callingCode:"355"},
            {iso:"DZ",name:"Algeria",callingCode:"213"},
            {iso:"AS",name:"American Samoa",callingCode:"1"},
            {iso:"AD",name:"Andorra",callingCode:"376"},
            {iso:"AO",name:"Angola",callingCode:"244"},
            {iso:"AI",
                name:"Anguilla",callingCode:"1"},
            {iso:"AQ",name:"Antarctica",callingCode:"672"},
            {iso:"AG",name:"Antigua and Barbuda",callingCode:"1"},
            {iso:"AR",name:"Argentina",callingCode:"54"},
            {iso:"AM",name:"Armenia",callingCode:"374"},
            {iso:"AW",name:"Aruba",callingCode:"297"},
            {iso:"AU",name:"Australia",callingCode:"672"},
            {iso:"AT",name:"Austria",callingCode:"43"},
            {iso:"AZ",name:"Azerbaijan",callingCode:"994"},
            {iso:"BS",name:"Bahamas",callingCode:"1"},
            {iso:"BH",name:"Bahrain",callingCode:"973"},
            {iso:"BD",name:"Bangladesh",
                callingCode:"880"},
            {iso:"BB",name:"Barbados",callingCode:"1"},
            {iso:"BY",name:"Belarus",callingCode:"375"},
            {iso:"BE",name:"Belgium",callingCode:"32"},
            {iso:"BZ",name:"Belize",callingCode:"501"},
            {iso:"BJ",name:"Benin",callingCode:"229"},
            {iso:"BM",name:"Bermuda",callingCode:"1"},
            {iso:"BT",name:"Bhutan",callingCode:"975"},
            {iso:"BO",name:"Bolivia",callingCode:"591"},
            {iso:"BA",name:"Bosnia and Herzegovina",callingCode:"387"},
            {iso:"BW",name:"Botswana",callingCode:"267"},
            {iso:"BV",name:"Bouvet Island",callingCode:""},
            {iso:"BR",name:"Brazil",callingCode:"55"},
            {iso:"IO",name:"British Indian Ocean Territory",callingCode:"246"},
            {iso:"BN",name:"Brunei Darussalam",callingCode:"673"},
            {iso:"BG",name:"Bulgaria",callingCode:"359"},
            {iso:"BF",name:"Burkina Faso",callingCode:"226"},
            {iso:"BI",name:"Burundi",callingCode:"257"},
            {iso:"KH",name:"Cambodia",callingCode:"855"},
            {iso:"CM",name:"Cameroon",callingCode:"237"},
            {iso:"CA",name:"Canada",callingCode:"1"},
            {iso:"CV",name:"Cape Verde",callingCode:"238"},
            {iso:"KY",name:"Cayman Islands",
                callingCode:"996"},
            {iso:"CF",name:"Central African Republic",callingCode:"236"},
            {iso:"TD",name:"Chad",callingCode:"235"},
            {iso:"CL",name:"Chile",callingCode:"56"},
            {iso:"CN",name:"China",callingCode:"86"},
            {iso:"CX",name:"Christmas Island",callingCode:"61"},
            {iso:"CC",name:"Cocos (Keeling) Islands",callingCode:"61"},
            {iso:"CO",name:"Colombia",callingCode:"57"},
            {iso:"KM",name:"Comoros",callingCode:"269"},
            {iso:"CG",name:"Congo",callingCode:"242"},
            {iso:"CD",name:"Congo, the Democratic Republic of the",callingCode:"243"},
            {iso:"CK",name:"Cook Islands",callingCode:"682"},
            {iso:"CR",name:"Costa Rica",callingCode:"506"},
            {iso:"CI",name:"Cote D'Ivoire",callingCode:"225"},
            {iso:"HR",name:"Croatia",callingCode:"385"},
            {iso:"CU",name:"Cuba",callingCode:"53"},
            {iso:"CY",name:"Cyprus",callingCode:"357"},
            {iso:"CZ",name:"Czech Republic",callingCode:"420"},
            {iso:"DK",name:"Denmark",callingCode:"45"},
            {iso:"DJ",name:"Djibouti",callingCode:"253"},
            {iso:"DM",name:"Dominica",callingCode:"1"},
            {iso:"DO",name:"Dominican Republic",callingCode:"1"},
            {iso:"EC",name:"Ecuador",callingCode:"593"},
            {iso:"EG",name:"Egypt",callingCode:"20"},
            {iso:"SV",name:"El Salvador",callingCode:"503"},
            {iso:"GQ",name:"Equatorial Guinea",callingCode:"240"},
            {iso:"ER",name:"Eritrea",callingCode:"291"},
            {iso:"EE",name:"Estonia",callingCode:"372"},
            {iso:"ET",name:"Ethiopia",callingCode:"251"},
            {iso:"FK",name:"Falkland Islands (Malvinas)",callingCode:"500"},
            {iso:"FO",name:"Faroe Islands",callingCode:"298"},
            {iso:"FJ",name:"Fiji",callingCode:"679"},
            {iso:"FI",name:"Finland",callingCode:"358"},
            {iso:"FR",name:"France",callingCode:"33"},
            {iso:"GF",name:"French Guiana",callingCode:"594"},
            {iso:"PF",name:"French Polynesia",callingCode:"689"},
            {iso:"TF",name:"French Southern Territories",callingCode:"262"},
            {iso:"GA",name:"Gabon",callingCode:"241"},
            {iso:"GM",name:"Gambia",callingCode:"220"},
            {iso:"GE",name:"Georgia",callingCode:"995"},
            {iso:"DE",name:"Germany",callingCode:"49"},
            {iso:"GH",name:"Ghana",callingCode:"233"},
            {iso:"GI",name:"Gibraltar",callingCode:"350"},
            {iso:"GR",name:"Greece",callingCode:"30"},
            {iso:"GL",name:"Greenland",callingCode:"299"},
            {iso:"GD",name:"Grenada",callingCode:"1"},
            {iso:"GP",name:"Guadeloupe",callingCode:"590"},
            {iso:"GU",name:"Guam",callingCode:"1"},
            {iso:"GT",name:"Guatemala",callingCode:"502"},
            {iso:"GN",name:"Guinea",callingCode:"224"},
            {iso:"GW",name:"Guinea-Bissau",callingCode:"245"},
            {iso:"GY",name:"Guyana",callingCode:"592"},
            {iso:"HT",name:"Haiti",callingCode:"509"},
            {iso:"HM",name:"Heard Island and Mcdonald Islands",callingCode:""},
            {iso:"VA",name:"Holy See (Vatican City State)",
                callingCode:"379"},
            {iso:"HN",name:"Honduras",callingCode:"504"},
            {iso:"HK",name:"Hong Kong",callingCode:"852"},
            {iso:"HU",name:"Hungary",callingCode:"36"},
            {iso:"IS",name:"Iceland",callingCode:"354"},
            {iso:"IN",name:"India",callingCode:"91"},
            {iso:"ID",name:"Indonesia",callingCode:"62"},
            {iso:"IR",name:"Iran, Islamic Republic of",callingCode:"98"},
            {iso:"IQ",name:"Iraq",callingCode:"964"},
            {iso:"IE",name:"Ireland",callingCode:"353"},
            {iso:"IL",name:"Israel",callingCode:"972"},
            {iso:"IT",name:"Italy",callingCode:"39"},
            {iso:"JM",name:"Jamaica",callingCode:"1"},
            {iso:"JP",name:"Japan",callingCode:"81"},
            {iso:"JO",name:"Jordan",callingCode:"962"},
            {iso:"KZ",name:"Kazakhstan",callingCode:"7"},
            {iso:"KE",name:"Kenya",callingCode:"254"},
            {iso:"KI",name:"Kiribati",callingCode:"686"},
            {iso:"KP",name:"Korea, Democratic People's Republic of",callingCode:"850"},
            {iso:"KR",name:"Korea, Republic of",callingCode:"82"},
            {iso:"KW",name:"Kuwait",callingCode:"965"},
            {iso:"KG",name:"Kyrgyzstan",callingCode:"996"},
            {iso:"LA",name:"Lao People's Democratic Republic",
                callingCode:"856"},
            {iso:"LV",name:"Latvia",callingCode:"371"},
            {iso:"LB",name:"Lebanon",callingCode:"961"},
            {iso:"LS",name:"Lesotho",callingCode:"266"},
            {iso:"LR",name:"Liberia",callingCode:"231"},
            {iso:"LY",name:"Libyan Arab Jamahiriya",callingCode:"218"},
            {iso:"LI",name:"Liechtenstein",callingCode:"423"},
            {iso:"LT",name:"Lithuania",callingCode:"370"},
            {iso:"LU",name:"Luxembourg",callingCode:"352"},
            {iso:"MO",name:"Macao",callingCode:"853"},
            {iso:"MK",name:"Macedonia, the Former Yugoslav Republic of",callingCode:"389"},
            {iso:"MG",name:"Madagascar",callingCode:"261"},
            {iso:"MW",name:"Malawi",callingCode:"265"},
            {iso:"MY",name:"Malaysia",callingCode:"60"},
            {iso:"MV",name:"Maldives",callingCode:"960"},
            {iso:"ML",name:"Mali",callingCode:"223"},
            {iso:"MT",name:"Malta",callingCode:"356"},
            {iso:"MH",name:"Marshall Islands",callingCode:"692"},
            {iso:"MQ",name:"Martinique",callingCode:"596"},
            {iso:"MR",name:"Mauritania",callingCode:"222"},
            {iso:"MU",name:"Mauritius",callingCode:"230"},
            {iso:"YT",name:"Mayotte",callingCode:"269"},
            {iso:"MX",
                name:"Mexico",callingCode:"52"},
            {iso:"FM",name:"Micronesia, Federated States of",callingCode:"691"},
            {iso:"MD",name:"Moldova, Republic of",callingCode:"373"},
            {iso:"MC",name:"Monaco",callingCode:"377"},
            {iso:"MN",name:"Mongolia",callingCode:"976"},
            {iso:"ME",name:"Montenegro",callingCode:"382"},
            {iso:"MS",name:"Montserrat",callingCode:"1"},
            {iso:"MA",name:"Morocco",callingCode:"212"},
            {iso:"MZ",name:"Mozambique",callingCode:"258"},
            {iso:"MM",name:"Myanmar",callingCode:"95"},
            {iso:"NA",name:"Namibia",callingCode:"264"},
            {iso:"NR",name:"Nauru",callingCode:"674"},
            {iso:"NP",name:"Nepal",callingCode:"977"},
            {iso:"NL",name:"Netherlands",callingCode:"31"},
            {iso:"AN",name:"Netherlands Antilles",callingCode:"599"},
            {iso:"NC",name:"New Caledonia",callingCode:"687"},
            {iso:"NZ",name:"New Zealand",callingCode:"64"},
            {iso:"NI",name:"Nicaragua",callingCode:"505"},
            {iso:"NE",name:"Niger",callingCode:"227"},
            {iso:"NG",name:"Nigeria",callingCode:"234"},
            {iso:"NU",name:"Niue",callingCode:"683"},
            {iso:"NF",name:"Norfolk Island",callingCode:"672"},
            {iso:"MP",name:"Northern Mariana Islands",callingCode:"1"},
            {iso:"NO",name:"Norway",callingCode:"47"},
            {iso:"OM",name:"Oman",callingCode:"968"},
            {iso:"PK",name:"Pakistan",callingCode:"92"},
            {iso:"PW",name:"Palau",callingCode:"680"},
            {iso:"PS",name:"Palestinian Territory, Occupied",callingCode:"970"},
            {iso:"PA",name:"Panama",callingCode:"507"},
            {iso:"PG",name:"Papua New Guinea",callingCode:"675"},
            {iso:"PY",name:"Paraguay",callingCode:"595"},
            {iso:"PE",name:"Peru",callingCode:"51"},
            {iso:"PH",name:"Philippines",
                callingCode:"63"},
            {iso:"PN",name:"Pitcairn",callingCode:"872"},
            {iso:"PL",name:"Poland",callingCode:"48"},
            {iso:"PT",name:"Portugal",callingCode:"351"},
            {iso:"PR",name:"Puerto Rico",callingCode:"1"},
            {iso:"QA",name:"Qatar",callingCode:"974"},
            {iso:"RE",name:"Reunion",callingCode:"262"},
            {iso:"RO",name:"Romania",callingCode:"40"},
            {iso:"RU",name:"Russian Federation",callingCode:"7"},
            {iso:"RW",name:"Rwanda",callingCode:"250"},
            {iso:"SH",name:"Saint Helena",callingCode:"290"},
            {iso:"KN",name:"Saint Kitts and Nevis",
                callingCode:"1"},
            {iso:"LC",name:"Saint Lucia",callingCode:"1"},
            {iso:"PM",name:"Saint Pierre and Miquelon",callingCode:"508"},
            {iso:"VC",name:"Saint Vincent and the Grenadines",callingCode:"1"},
            {iso:"WS",name:"Samoa",callingCode:"685"},
            {iso:"SM",name:"San Marino",callingCode:"378"},
            {iso:"ST",name:"Sao Tome and Principe",callingCode:"239"},
            {iso:"SA",name:"Saudi Arabia",callingCode:"966"},
            {iso:"SN",name:"Senegal",callingCode:"221"},
            {iso:"RS",name:"Serbia",callingCode:"381"},
            {iso:"SC",name:"Seychelles",
                callingCode:"248"},
            {iso:"SL",name:"Sierra Leone",callingCode:"232"},
            {iso:"SG",name:"Singapore",callingCode:"65"},
            {iso:"SK",name:"Slovakia",callingCode:"421"},
            {iso:"SI",name:"Slovenia",callingCode:"386"},
            {iso:"SB",name:"Solomon Islands",callingCode:"677"},
            {iso:"SO",name:"Somalia",callingCode:"252"},
            {iso:"ZA",name:"South Africa",callingCode:"27"},
            {iso:"GS",name:"South Georgia and the South Sandwich Islands",callingCode:""},
            {iso:"ES",name:"Spain",callingCode:"34"},
            {iso:"LK",name:"Sri Lanka",callingCode:"94"},
            {iso:"SD",name:"Sudan",callingCode:"249"},
            {iso:"SR",name:"Suriname",callingCode:"597"},
            {iso:"SJ",name:"Svalbard and Jan Mayen",callingCode:"79"},
            {iso:"SZ",name:"Swaziland",callingCode:"268"},
            {iso:"SE",name:"Sweden",callingCode:"46"},
            {iso:"CH",name:"Switzerland",callingCode:"41"},
            {iso:"SY",name:"Syrian Arab Republic",callingCode:"963"},
            {iso:"TW",name:"Taiwan",callingCode:"886"},
            {iso:"TJ",name:"Tajikistan",callingCode:"992"},
            {iso:"TZ",name:"Tanzania, United Republic of",callingCode:"255"},
            {iso:"TH",
                name:"Thailand",callingCode:"66"},
            {iso:"TL",name:"Timor-Leste",callingCode:"670"},
            {iso:"TG",name:"Togo",callingCode:"228"},
            {iso:"TK",name:"Tokelau",callingCode:"690"},
            {iso:"TO",name:"Tonga",callingCode:"676"},
            {iso:"TT",name:"Trinidad and Tobago",callingCode:"1"},
            {iso:"TN",name:"Tunisia",callingCode:"216"},
            {iso:"TR",name:"Turkey",callingCode:"90"},
            {iso:"TM",name:"Turkmenistan",callingCode:"993"},
            {iso:"TC",name:"Turks and Caicos Islands",callingCode:"1"},
            {iso:"TV",name:"Tuvalu",callingCode:"688"},
            {iso:"UG",
                name:"Uganda",callingCode:"256"},
            {iso:"UA",name:"Ukraine",callingCode:"380"},
            {iso:"AE",name:"United Arab Emirates",callingCode:"971"},
            {iso:"GB",name:"United Kingdom",callingCode:"44"},
            {iso:"US",name:"United States",callingCode:"1"},
            {iso:"UM",name:"United States Minor Outlying Islands",callingCode:"699"},
            {iso:"UY",name:"Uruguay",callingCode:"598"},
            {iso:"UZ",name:"Uzbekistan",callingCode:"998"},
            {iso:"VU",name:"Vanuatu",callingCode:"678"},
            {iso:"VE",name:"Venezuela",callingCode:"58"},
            {iso:"VN",name:"Viet Nam",
                callingCode:"84"},
            {iso:"VG",name:"Virgin Islands, British",callingCode:"1"},
            {iso:"VI",name:"Virgin Islands, U.S.",callingCode:"1"},
            {iso:"WF",name:"Wallis and Futuna",callingCode:"681"},
            {iso:"EH",name:"Western Sahara",callingCode:"212"},
            {iso:"YE",name:"Yemen",callingCode:"967"},
            {iso:"ZM",name:"Zambia",callingCode:"260"},
            {iso:"ZW",name:"Zimbabwe",callingCode:"263"}
        ],accentMap:{a:"\u1e9a\u00c1\u00e1\u00c0\u00e0\u0102\u0103\u1eae\u1eaf\u1eb0\u1eb1\u1eb4\u1eb5\u1eb2\u1eb3\u00c2\u00e2\u1ea4\u1ea5\u1ea6\u1ea7\u1eaa\u1eab\u1ea8\u1ea9\u01cd\u01ce\u00c5\u00e5\u01fa\u01fb\u00c4\u00e4\u01de\u01df\u00c3\u00e3\u0226\u0227\u01e0\u01e1\u0104\u0105\u0100\u0101\u1ea2\u1ea3\u0200\u0201\u0202\u0203\u1ea0\u1ea1\u1eb6\u1eb7\u1eac\u1ead\u1e00\u1e01\u023a\u2c65\u01fc\u01fd\u01e2\u01e3\uff21\uff41",
            b:"\u1e02\u1e03\u1e04\u1e05\u1e06\u1e07\u0243\u0180\u1d6c\u0181\u0253\u0182\u0183\uff42\uff22",c:"\u0106\u0107\u0108\u0109\u010c\u010d\u010a\u010b\u00c7\u00e7\u1e08\u1e09\u023b\u023c\u0187\u0188\u0255\uff43\uff23",d:"\u010e\u010f\u1e0a\u1e0b\u1e10\u1e11\u1e0c\u1e0d\u1e12\u1e13\u1e0e\u1e0f\u0110\u0111\u1d6d\u0189\u0256\u018a\u0257\u018b\u018c\u0221\u00f0\uff44\uff24",e:"\u00c9\u018f\u018e\u01dd\u00e9\u00c8\u00e8\u0114\u0115\u00ca\u00ea\u1ebe\u1ebf\u1ec0\u1ec1\u1ec4\u1ec5\u1ec2\u1ec3\u011a\u011b\u00cb\u00eb\u1ebc\u1ebd\u0116\u0117\u0228\u0229\u1e1c\u1e1d\u0118\u0119\u0112\u0113\u1e16\u1e17\u1e14\u1e15\u1eba\u1ebb\u0204\u0205\u0206\u0207\u1eb8\u1eb9\u1ec6\u1ec7\u1e18\u1e19\u1e1a\u1e1b\u0246\u0247\u025a\u025d\uff45\uff25",
            f:"\u1e1e\u1e1f\u1d6e\u0191\u0192\uff46\uff26",g:"\u01f4\u01f5\u011e\u011f\u011c\u011d\u01e6\u01e7\u0120\u0121\u0122\u0123\u1e20\u1e21\u01e4\u01e5\u0193\u0260\uff47\uff27",h:"\u0124\u0125\u021e\u021f\u1e26\u1e27\u1e22\u1e23\u1e28\u1e29\u1e24\u1e25\u1e2a\u1e2bH\u1e96\u0126\u0127\u2c67\u2c68\uff48\uff28",i:"\u00cd\u00cc\u00ec\u012c\u012d\u00ce\u00ee\u01cf\u01d0\u00cf\u00ef\u1e2e\u1e2f\u0128\u0129\u0130i\u012e\u012f\u012a\u012b\u1ec8\u1ec9\u0208\u0209\u020a\u020b\u1eca\u1ecb\u1e2c\u1e2dI\u0131\u0197\u0268\uff49\uff29",
            j:"\u0135J\u01f0\u0237\u0248\u0249\u029d\u025f\u0284\uff4a\uff2a\u0134",k:"\u2c69\u1e30\u2c6a\uff4b\uff2b\u1e31\u01e9\u01e8\u0137\u0136\u1e33\u1e32\u1e35\u1e34\u0199\u0198",l:"\u023d\u019a\u026b\u026c\u026d\u0234\u2c60\u2c61\u2c62\uff4c\uff2c\u013a\u0139\u013e\u013d\u0140\u013f\u0142\u0142\u0141\u0141\u013c\u013b\u1e39\u1e37\u1e38\u1e36\u1e3d\u1e3c\u1e3b\u1e3a",m:"\u0271\uff4d\uff2d\u1e3f\u1e3e\u1e41\u1e40\u1e43\u1e42",n:"\u019d\u0272\u0220\u019e\u0273\u0235\uff4e\uff2enN\u0144\u0143\u01f9\u01f8\u0148\u0147\u00f1\u00d1\u1e45\u1e44\u0146\u0145\u1e47\u1e46\u1e4b\u1e4a\u1e49\u1e48",
            o:"\uff4f\uff2f\u00f3\u00d3\u00f2\u00d2\u014f\u014e\u1ed1\u1ed3\u1ed7\u1ed5\u1ed9\u00f4\u1ed0\u1ed2\u1ed6\u1ed4\u1ed8\u00d4\u01d2\u01d1\u022b\u00f6\u0275\u022a\u00d6\u019f\u0151\u0150\u1e4d\u1e4f\u022d\u00f5\u1e4c\u1e4e\u022c\u00d5\u0231\u022f\u0230\u022e\u01ff\u00f8\u01fe\u00d8\u01ed\u01eb\u01ec\u01ea\u1e53\u1e51\u014d\u1e52\u1e50\u014c\u1ecf\u1ece\u020d\u020c\u020f\u020e\u1ecd\u1ecc\u1edb\u1edd\u1ee1\u1edf\u1ee3\u01a1\u1eda\u1edc\u1ee0\u1ede\u1ee2\u01a0",p:"\u01a4\u01a5\u2c63\uff50\uff30pP\u1e55\u1e54\u1e57\u1e56",
            q:"\u02a0\u024a\u024b\uff51\uff31",r:"\u024c\u024d\u027c\u027d\u027e\u1d72\u2c64\u1d73\uff52\uff32\u0155\u0154\u0159\u0158\u1e59\u1e58\u0157\u0156\u0211\u0210\u0213\u0212\u1e5d\u1e5b\u1e5c\u1e5a\u1e5f\u1e5e",s:"\u0282\uff53\uff33sS\u1e65\u015b\u1e64\u015a\u015d\u015c\u1e67\u0161\u1e66\u0160\u1e61\u1e60\u015f\u0219\u015e\u0218\u1e69\u1e63\u1e68\u1e62\u1e9b\u00df",t:"\u023e\u01ab\u01ac\u01ad\u01ae\u0288\u0236\u2c66\u1d75\uff54\uff34T\u0165\u0164\u1e97\u1e6b\u1e6a\u0167\u0166\u0163\u021b\u0162\u021a\u1e6d\u1e6c\u1e71\u1e70\u1e6f\u1e6e\u00fe\u00de",
            u:"\u0214\u0216\u0244\u0289\uff55\uff35\u00fa\u00da\u00f9\u00d9\u016d\u016c\u00fb\u00db\u01d4\u01d3\u016f\u016e\u01d8\u01dc\u01da\u01d6\u00fc\u01d7\u01db\u01d9\u01d5\u00dc\u0171\u0170\u1e79\u0169\u1e78\u0168\u0173\u0172\u1e7b\u016b\u1e7a\u016a\u1ee7\u1ee6\u0215\u0217\u1ee5\u1ee4\u1e73\u1e72\u1e77\u1e76\u1e75\u1e74\u1ee9\u1eeb\u1eef\u1eed\u1ef1\u01b0\u1ee8\u1eea\u1eee\u1eec\u1ef0\u01af",v:"\u01b2\u028b\uff56\uff36\u1e7d\u1e7c\u1e7f\u1e7e",w:"\uff57\uff37W\u1e83\u1e82\u1e81\u1e80\u0175\u0174\u1e98\u1e85\u1e84\u1e87\u1e86\u1e89\u1e88",
            x:"\uff58\uff38\u1e8d\u1e8c\u1e8b\u1e8a",y:"\u028f\u024e\u024f\uff59\uff39Y\u00fd\u00dd\u1ef3\u1ef2\u0177\u0176\u1e99\u00ff\u0178\u1ef9\u1ef8\u1e8f\u1e8e\u0233\u0232\u1ef7\u1ef6\u1ef5\u1ef4\u01b4\u01b3",z:"\u0290\u0291\u01ba\u2c6b\u2c6c\uff5a\uff3a\u017a\u0179\u1e91\u1e90\u017e\u017d\u017c\u017b\u01b6\u01b5\u1e93\u1e92\u1e95\u1e94\u0225\u0224\u01ef\u01ee"},foldedAccents:{},unfoldAccents:function(d) {
            return d
        },randWeightedIndex:function(d) {
            var c,b,e;
            c = 0;
            for (e in d)if (d.hasOwnProperty(e))c += d[e];
            b = Math.random() *
                    c;
            for (e in d)if (d.hasOwnProperty(e)) {
                c = d[e];
                if (b <= c)return e; else b -= c
            }
            return 0
        },httpBuildQuery:function(d) {
            var c = "";
            _.forEach(d, function(b, e) {
                c = c + e + "=" + encodeURIComponent(b) + "&"
            });
            return c = c.substring(0, c.length - 1)
        },base62Encode:function(d) {
            for (var c = "",b = Math.floor(Math.log(d) / Math.log(62)); b >= 0; b--) {
                var e = Math.floor(d / Math.pow(62, b));
                c += "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[e];
                d -= e * Math.pow(62, b)
            }
            return c
        }};
    if (!Array.prototype.indexOf)Array.prototype.indexOf = function(d, c) {
        var b = this.length >>> 0,e = Number(c) || 0;
        e = e < 0 ? Math.ceil(e) : Math.floor(e);
        if (e < 0)e += b;
        for (; e < b; e++)if (e in this && this[e] === d)return e;
        return-1
    };
    if (!Array.prototype.unique)Array.prototype.unique = function() {
        for (var d = this.concat(),c = 0; c < d.length; ++c)for (var b = c + 1; b < d.length; ++b)d[c] === d[b] && d.splice(b, 1);
        return d
    };
    if (!Array.prototype.shuffle)Array.prototype.shuffle = function() {
        var d,c,b = this.concat(),e = b.length;
        if (e)for (; --e;) {
            c = Math.floor(Math.random() * (e + 1));
            d = b[c];
            b[c] = b[e];
            b[e] = d
        }
        return b
    };
    if (!Array.prototype.filter)Array.prototype.filter =
            function(d, c) {
                if (this === void 0 || this === null)throw new TypeError;
                var b = Object(this),e = b.length >>> 0;
                if (typeof d !== "function")throw new TypeError;
                for (var f = [],j = 0; j < e; j++)if (j in b) {
                    var h = b[j];
                    d.call(c, h, j, b) && f.push(h)
                }
                return f
            }
})();
if (!this.JSON)this.JSON = {};
(function() {
    function a(o) {
        return o < 10 ? "0" + o : o
    }

    function d(o) {
        e.lastIndex = 0;
        return e.test(o) ? '"' + o.replace(e, function(r) {
            var u = h[r];
            return typeof u === "string" ? u : "\\u" + ("0000" + r.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + o + '"'
    }

    function c(o, r) {
        var u,C,F,x,I = f,G,H = r[o];
        if (H && typeof H === "object" && typeof H.toJSON === "function")H = H.toJSON(o);
        if (typeof l === "function")H = l.call(r, o, H);
        switch (typeof H) {
            case "string":
                return d(H);
            case "number":
                return isFinite(H) ? String(H) : "null";
            case "boolean":
            case "null":
                return String(H);
            case "object":
                if (!H)return"null";
                f += j;
                G = [];
                if (Object.prototype.toString.apply(H) === "[object Array]") {
                    x = H.length;
                    for (u = 0; u < x; u += 1)G[u] = c(u, H) || "null";
                    F = G.length === 0 ? "[]" : f ? "[\n" + f + G.join(",\n" + f) + "\n" + I + "]" : "[" + G.join(",") + "]";
                    f = I;
                    return F
                }
                if (l && typeof l === "object") {
                    x = l.length;
                    for (u = 0; u < x; u += 1) {
                        C = l[u];
                        if (typeof C === "string")if (F = c(C, H))G.push(d(C) + (f ? ": " : ":") + F)
                    }
                } else for (C in H)if (Object.hasOwnProperty.call(H, C))if (F = c(C, H))G.push(d(C) + (f ? ": " : ":") + F);
                F = G.length === 0 ? "{}" : f ? "{\n" + f + G.join(",\n" + f) +
                        "\n" + I + "}" : "{" + G.join(",") + "}";
                f = I;
                return F
        }
    }

    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + a(this.getUTCMonth() + 1) + "-" + a(this.getUTCDate()) + "T" + a(this.getUTCHours()) + ":" + a(this.getUTCMinutes()) + ":" + a(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        }
    }
    var b = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            e = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,f,j,h = {"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},l;
    if (typeof JSON.stringify !== "function")JSON.stringify = function(o, r, u) {
        var C;
        j = f = "";
        if (typeof u === "number")for (C = 0; C < u; C += 1)j += " "; else if (typeof u === "string")j = u;
        if ((l = r) && typeof r !== "function" && (typeof r !== "object" || typeof r.length !== "number"))throw Error("JSON.stringify");
        return c("",
                {"":o})
    };
    if (typeof JSON.parse !== "function")JSON.parse = function(o, r) {
        function u(F, x) {
            var I,G,H = F[x];
            if (H && typeof H === "object")for (I in H)if (Object.hasOwnProperty.call(H, I)) {
                G = u(H, I);
                if (G !== undefined)H[I] = G; else delete H[I]
            }
            return r.call(F, x, H)
        }

        var C;
        o = String(o);
        b.lastIndex = 0;
        if (b.test(o))o = o.replace(b, function(F) {
            return"\\u" + ("0000" + F.charCodeAt(0).toString(16)).slice(-4)
        });
        if (/^[\],:{}\s]*$/.test(o.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            C = eval("(" + o + ")");
            return typeof r === "function" ? u({"":C}, "") : C
        }
        throw new SyntaxError("JSON.parse");
    }
})();
var store = function() {
    var a = {},d = window,c = d.document,b;
    a.set = function() {
    };
    a.get = function() {
    };
    a.remove = function() {
    };
    a.clear = function() {
    };
    a.transact = function(j, h) {
        var l = a.get(j);
        if (typeof l == "undefined")l = {};
        h(l);
        a.set(j, l)
    };
    a.serialize = function(j) {
        return JSON.stringify(j)
    };
    a.deserialize = function(j) {
        if (typeof j == "string")return JSON.parse(j)
    };
    try {
        if ("localStorage"in d && d.localStorage) {
            b = d.localStorage;
            a.set = function(j, h) {
                b.setItem(j, a.serialize(h))
            };
            a.get = function(j) {
                return a.deserialize(b.getItem(j))
            };
            a.remove = function(j) {
                b.removeItem(j)
            };
            a.clear = function() {
                b.clear()
            }
        } else if ("globalStorage"in d && d.globalStorage) {
            b = d.globalStorage[d.location.hostname];
            a.set = function(j, h) {
                b[j] = a.serialize(h)
            };
            a.get = function(j) {
                return a.deserialize(b[j] && b[j].value)
            };
            a.remove = function(j) {
                delete b[j]
            };
            a.clear = function() {
                for (var j in b)delete b[j]
            }
        } else if (c.documentElement.addBehavior) {
            b = document.getElementById("userDataTag");
            try {
                b.load("localStorage")
            } catch(e) {
                console.warn("localStorage turned off");
                b.parentNode.removeChild(b);
                b = null
            }
            d = function(j) {
                if (!b)return function() {
                };
                return function() {
                    try {
                        var h = Array.prototype.slice.call(arguments, 0);
                        b.load("localStorage");
                        return j.apply(a, h)
                    } catch(l) {
                        console.warn("localStorage error");
                        return null
                    }
                }
            };
            a.set = d(function(j, h) {
                j = j.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g, "-");
                b.setAttribute(j, a.serialize(h));
                try {
                    b.save("localStorage")
                } catch(l) {
                    a.cleanup()
                }
            });
            a.get = d(function(j) {
                j = j.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g,
                        "-");
                return a.deserialize(b.getAttribute(j))
            });
            a.remove = d(function(j) {
                j = j.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g, "-");
                b.removeAttribute(j);
                b.save("localStorage")
            });
            a.clear = d(function() {
                var j = b.XMLDocument.documentElement.attributes;
                b.load("localStorage");
                for (var h = 0,l; l = j[h]; h++)b.removeAttribute(l.name);
                b.save("localStorage")
            });
            a.cleanup = d(function() {
                var j = b.XMLDocument.documentElement.attributes;
                b.load("localStorage");
                for (var h =
                        0,l; l = j[h]; h++) {
                    b.removeAttribute(l.name);
                    try {
                        b.save("localStorage");
                        return
                    } catch(o) {
                    }
                }
            })
        }
    } catch(f) {
    }
    return a
}();
(function() {
    function a(c) {
        return function() {
            try {
                return store[c].apply(store, arguments)
            } catch(b) {
            }
        }
    }

    if (!window.GS)window.GS = {};
    if (!window.store)throw"store.js didn't load!";
    GS.store = {};
    for (var d in window.store)if (store.hasOwnProperty(d) && $.isFunction(store[d]))GS.store[d] = a(d)
})();
var swfobject = function() {
    function a() {
        if (!Da) {
            try {
                var O = ka.getElementsByTagName("body")[0].appendChild(ka.createElement("span"));
                O.parentNode.removeChild(O)
            } catch(Z) {
                return
            }
            Da = true;
            O = qa.length;
            for (var la = 0; la < O; la++)qa[la]()
        }
    }

    function d(O) {
        if (Da)O(); else qa[qa.length] = O
    }

    function c(O) {
        if (typeof W.addEventListener != A)W.addEventListener("load", O, false); else if (typeof ka.addEventListener != A)ka.addEventListener("load", O, false); else if (typeof W.attachEvent != A)F(W, "onload", O); else if (typeof W.onload == "function") {
            var Z =
                    W.onload;
            W.onload = function() {
                Z();
                O()
            }
        } else W.onload = O
    }

    function b() {
        var O = ka.getElementsByTagName("body")[0],Z = ka.createElement(N);
        Z.setAttribute("type", ba);
        var la = O.appendChild(Z);
        if (la) {
            var va = 0;
            (function() {
                if (typeof la.GetVariable != A) {
                    var xa = la.GetVariable("$version");
                    if (xa) {
                        xa = xa.split(" ")[1].split(",");
                        oa.pv = [parseInt(xa[0], 10),parseInt(xa[1], 10),parseInt(xa[2], 10)]
                    }
                } else if (va < 10) {
                    va++;
                    setTimeout(arguments.callee, 10);
                    return
                }
                O.removeChild(Z);
                la = null;
                e()
            })()
        } else e()
    }

    function e() {
        var O = aa.length;
        if (O > 0)for (var Z = 0; Z < O; Z++) {
            var la = aa[Z].id,va = aa[Z].callbackFn,xa = {success:false,id:la};
            if (oa.pv[0] > 0) {
                var Fa = C(la);
                if (Fa)if (x(aa[Z].swfVersion) && !(oa.wk && oa.wk < 312)) {
                    G(la, true);
                    if (va) {
                        xa.success = true;
                        xa.ref = f(la);
                        va(xa)
                    }
                } else if (aa[Z].expressInstall && j()) {
                    xa = {};
                    xa.data = aa[Z].expressInstall;
                    xa.width = Fa.getAttribute("width") || "0";
                    xa.height = Fa.getAttribute("height") || "0";
                    if (Fa.getAttribute("class"))xa.styleclass = Fa.getAttribute("class");
                    if (Fa.getAttribute("align"))xa.align = Fa.getAttribute("align");
                    var Ha = {};
                    Fa = Fa.getElementsByTagName("param");
                    for (var Pa = Fa.length,Qa = 0; Qa < Pa; Qa++)if (Fa[Qa].getAttribute("name").toLowerCase() != "movie")Ha[Fa[Qa].getAttribute("name")] = Fa[Qa].getAttribute("value");
                    h(xa, Ha, la, va)
                } else {
                    l(Fa);
                    va && va(xa)
                }
            } else {
                G(la, true);
                if (va) {
                    if ((la = f(la)) && typeof la.SetVariable != A) {
                        xa.success = true;
                        xa.ref = la
                    }
                    va(xa)
                }
            }
        }
    }

    function f(O) {
        var Z = null;
        if ((O = C(O)) && O.nodeName == "OBJECT")if (typeof O.SetVariable != A)Z = O; else if (O = O.getElementsByTagName(N)[0])Z = O;
        return Z
    }

    function j() {
        return!Ba &&
                x("6.0.65") && (oa.win || oa.mac) && !(oa.wk && oa.wk < 312)
    }

    function h(O, Z, la, va) {
        Ba = true;
        sa = va || null;
        ya = {success:false,id:la};
        var xa = C(la);
        if (xa) {
            if (xa.nodeName == "OBJECT") {
                m = o(xa);
                U = null
            } else {
                m = xa;
                U = la
            }
            O.id = K;
            if (typeof O.width == A || !/%$/.test(O.width) && parseInt(O.width, 10) < 310)O.width = "310";
            if (typeof O.height == A || !/%$/.test(O.height) && parseInt(O.height, 10) < 137)O.height = "137";
            ka.title = ka.title.slice(0, 47) + " - Flash Player Installation";
            va = oa.ie && oa.win ? "ActiveX" : "PlugIn";
            va = "MMredirectURL=" + W.location.toString().replace(/&/g,
                    "%26") + "&MMplayerType=" + va + "&MMdoctitle=" + ka.title;
            if (typeof Z.flashvars != A)Z.flashvars += "&" + va; else Z.flashvars = va;
            if (oa.ie && oa.win && xa.readyState != 4) {
                va = ka.createElement("div");
                la += "SWFObjectNew";
                va.setAttribute("id", la);
                xa.parentNode.insertBefore(va, xa);
                xa.style.display = "none";
                (function() {
                    xa.readyState == 4 ? xa.parentNode.removeChild(xa) : setTimeout(arguments.callee, 10)
                })()
            }
            r(O, Z, la)
        }
    }

    function l(O) {
        if (oa.ie && oa.win && O.readyState != 4) {
            var Z = ka.createElement("div");
            O.parentNode.insertBefore(Z, O);
            Z.parentNode.replaceChild(o(O),
                    Z);
            O.style.display = "none";
            (function() {
                O.readyState == 4 ? O.parentNode.removeChild(O) : setTimeout(arguments.callee, 10)
            })()
        } else O.parentNode.replaceChild(o(O), O)
    }

    function o(O) {
        var Z = ka.createElement("div");
        if (oa.win && oa.ie)Z.innerHTML = O.innerHTML; else if (O = O.getElementsByTagName(N)[0])if (O = O.childNodes)for (var la = O.length,va = 0; va < la; va++)!(O[va].nodeType == 1 && O[va].nodeName == "PARAM") && O[va].nodeType != 8 && Z.appendChild(O[va].cloneNode(true));
        return Z
    }

    function r(O, Z, la) {
        var va,xa = C(la);
        if (oa.wk && oa.wk < 312)return va;
        if (xa) {
            if (typeof O.id == A)O.id = la;
            if (oa.ie && oa.win) {
                var Fa = "";
                for (var Ha in O)if (O[Ha] != Object.prototype[Ha])if (Ha.toLowerCase() == "data")Z.movie = O[Ha]; else if (Ha.toLowerCase() == "styleclass")Fa += ' class="' + O[Ha] + '"'; else if (Ha.toLowerCase() != "classid")Fa += " " + Ha + '="' + O[Ha] + '"';
                Ha = "";
                for (var Pa in Z)if (Z[Pa] != Object.prototype[Pa])Ha += '<param name="' + Pa + '" value="' + Z[Pa] + '" />';
                xa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + Fa + ">" + Ha + "</object>";
                ca[ca.length] = O.id;
                va = C(O.id)
            } else {
                Pa =
                        ka.createElement(N);
                Pa.setAttribute("type", ba);
                for (var Qa in O)if (O[Qa] != Object.prototype[Qa])if (Qa.toLowerCase() == "styleclass")Pa.setAttribute("class", O[Qa]); else Qa.toLowerCase() != "classid" && Pa.setAttribute(Qa, O[Qa]);
                for (Fa in Z)if (Z[Fa] != Object.prototype[Fa] && Fa.toLowerCase() != "movie") {
                    O = Pa;
                    Ha = Fa;
                    Qa = Z[Fa];
                    la = ka.createElement("param");
                    la.setAttribute("name", Ha);
                    la.setAttribute("value", Qa);
                    O.appendChild(la)
                }
                xa.parentNode.replaceChild(Pa, xa);
                va = Pa
            }
        }
        return va
    }

    function u(O) {
        var Z = C(O);
        if (Z && Z.nodeName ==
                "OBJECT")if (oa.ie && oa.win) {
            Z.style.display = "none";
            (function() {
                if (Z.readyState == 4) {
                    var la = C(O);
                    if (la) {
                        for (var va in la)if (typeof la[va] == "function")la[va] = null;
                        la.parentNode.removeChild(la)
                    }
                } else setTimeout(arguments.callee, 10)
            })()
        } else Z.parentNode.removeChild(Z)
    }

    function C(O) {
        var Z = null;
        try {
            Z = ka.getElementById(O)
        } catch(la) {
        }
        return Z
    }

    function F(O, Z, la) {
        O.attachEvent(Z, la);
        ea[ea.length] = [O,Z,la]
    }

    function x(O) {
        var Z = oa.pv;
        O = O.split(".");
        O[0] = parseInt(O[0], 10);
        O[1] = parseInt(O[1], 10) || 0;
        O[2] = parseInt(O[2],
                10) || 0;
        return Z[0] > O[0] || Z[0] == O[0] && Z[1] > O[1] || Z[0] == O[0] && Z[1] == O[1] && Z[2] >= O[2] ? true : false
    }

    function I(O, Z, la, va) {
        if (!(oa.ie && oa.mac)) {
            var xa = ka.getElementsByTagName("head")[0];
            if (xa) {
                la = la && typeof la == "string" ? la : "screen";
                if (va)Q = y = null;
                if (!y || Q != la) {
                    va = ka.createElement("style");
                    va.setAttribute("type", "text/css");
                    va.setAttribute("media", la);
                    y = xa.appendChild(va);
                    if (oa.ie && oa.win && typeof ka.styleSheets != A && ka.styleSheets.length > 0)y = ka.styleSheets[ka.styleSheets.length - 1];
                    Q = la
                }
                if (oa.ie && oa.win)y &&
                        typeof y.addRule == N && y.addRule(O, Z); else y && typeof ka.createTextNode != A && y.appendChild(ka.createTextNode(O + " {" + Z + "}"))
            }
        }
    }

    function G(O, Z) {
        if (ua) {
            var la = Z ? "visible" : "hidden";
            if (Da && C(O))C(O).style.visibility = la; else I("#" + O, "visibility:" + la)
        }
    }

    function H(O) {
        return/[\\\"<>\.;]/.exec(O) != null && typeof encodeURIComponent != A ? encodeURIComponent(O) : O
    }

    var A = "undefined",N = "object",ba = "application/x-shockwave-flash",K = "SWFObjectExprInst",W = window,ka = document,fa = navigator,ha = false,qa = [function() {
        ha ? b() : e()
    }],
            aa = [],ca = [],ea = [],m,U,sa,ya,Da = false,Ba = false,y,Q,ua = true,oa = function() {
        var O = typeof ka.getElementById != A && typeof ka.getElementsByTagName != A && typeof ka.createElement != A,Z = fa.userAgent.toLowerCase(),la = fa.platform.toLowerCase(),va = la ? /win/.test(la) : /win/.test(Z);
        la = la ? /mac/.test(la) : /mac/.test(Z);
        Z = /webkit/.test(Z) ? parseFloat(Z.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false;
        var xa = !+"\u000b1",Fa = [0,0,0],Ha = null;
        if (typeof fa.plugins != A && typeof fa.plugins["Shockwave Flash"] == N) {
            if ((Ha = fa.plugins["Shockwave Flash"].description) &&
                    !(typeof fa.mimeTypes != A && fa.mimeTypes[ba] && !fa.mimeTypes[ba].enabledPlugin)) {
                ha = true;
                xa = false;
                Ha = Ha.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                Fa[0] = parseInt(Ha.replace(/^(.*)\..*$/, "$1"), 10);
                Fa[1] = parseInt(Ha.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                Fa[2] = /[a-zA-Z]/.test(Ha) ? parseInt(Ha.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            }
        } else if (typeof W.ActiveXObject != A)try {
            var Pa = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            if (Pa)if (Ha = Pa.GetVariable("$version")) {
                xa = true;
                Ha = Ha.split(" ")[1].split(",");
                Fa = [parseInt(Ha[0],
                        10),parseInt(Ha[1], 10),parseInt(Ha[2], 10)]
            }
        } catch(Qa) {
        }
        return{w3:O,pv:Fa,wk:Z,ie:xa,win:va,mac:la}
    }();
    (function() {
        if (oa.w3) {
            if (typeof ka.readyState != A && ka.readyState == "complete" || typeof ka.readyState == A && (ka.getElementsByTagName("body")[0] || ka.body))a();
            if (!Da) {
                typeof ka.addEventListener != A && ka.addEventListener("DOMContentLoaded", a, false);
                if (oa.ie && oa.win) {
                    ka.attachEvent("onreadystatechange", function() {
                        if (ka.readyState == "complete") {
                            ka.detachEvent("onreadystatechange", arguments.callee);
                            a()
                        }
                    });
                    W == top &&
                    function() {
                        if (!Da) {
                            try {
                                ka.documentElement.doScroll("left")
                            } catch(O) {
                                setTimeout(arguments.callee, 0);
                                return
                            }
                            a()
                        }
                    }()
                }
                oa.wk && function() {
                    Da || (/loaded|complete/.test(ka.readyState) ? a() : setTimeout(arguments.callee, 0))
                }();
                c(a)
            }
        }
    })();
    (function() {
        oa.ie && oa.win && window.attachEvent("onunload", function() {
            for (var O = ea.length,Z = 0; Z < O; Z++)ea[Z][0].detachEvent(ea[Z][1], ea[Z][2]);
            O = ca.length;
            for (Z = 0; Z < O; Z++)u(ca[Z]);
            for (var la in oa)oa[la] = null;
            oa = null;
            for (var va in swfobject)swfobject[va] = null;
            swfobject = null
        })
    })();
    return{registerObject:function(O, Z, la, va) {
        if (oa.w3 && O && Z) {
            var xa = {};
            xa.id = O;
            xa.swfVersion = Z;
            xa.expressInstall = la;
            xa.callbackFn = va;
            aa[aa.length] = xa;
            G(O, false)
        } else va && va({success:false,id:O})
    },getObjectById:function(O) {
        if (oa.w3)return f(O)
    },embedSWF:function(O, Z, la, va, xa, Fa, Ha, Pa, Qa, sb) {
        var wb = {success:false,id:Z};
        if (oa.w3 && !(oa.wk && oa.wk < 312) && O && Z && la && va && xa) {
            G(Z, false);
            d(function() {
                la += "";
                va += "";
                var fb = {};
                if (Qa && typeof Qa === N)for (var db in Qa)fb[db] = Qa[db];
                fb.data = O;
                fb.width = la;
                fb.height = va;
                db =
                {};
                if (Pa && typeof Pa === N)for (var jb in Pa)db[jb] = Pa[jb];
                if (Ha && typeof Ha === N)for (var kb in Ha)if (typeof db.flashvars != A)db.flashvars += "&" + kb + "=" + Ha[kb]; else db.flashvars = kb + "=" + Ha[kb];
                if (x(xa)) {
                    jb = r(fb, db, Z);
                    fb.id == Z && G(Z, true);
                    wb.success = true;
                    wb.ref = jb
                } else if (Fa && j()) {
                    fb.data = Fa;
                    h(fb, db, Z, sb);
                    return
                } else G(Z, true);
                sb && sb(wb)
            })
        } else sb && sb(wb)
    },switchOffAutoHideShow:function() {
        ua = false
    },ua:oa,getFlashPlayerVersion:function() {
        return{major:oa.pv[0],minor:oa.pv[1],release:oa.pv[2]}
    },hasFlashPlayerVersion:x,
        createSWF:function(O, Z, la) {
            if (oa.w3)return r(O, Z, la)
        },showExpressInstall:function(O, Z, la, va) {
            oa.w3 && j() && h(O, Z, la, va)
        },removeSWF:function(O) {
            oa.w3 && u(O)
        },createCSS:function(O, Z, la, va) {
            oa.w3 && I(O, Z, la, va)
        },addDomLoadEvent:d,addLoadEvent:c,getQueryParamValue:function(O) {
            var Z = ka.location.search || ka.location.hash;
            if (Z) {
                if (/\?/.test(Z))Z = Z.split("?")[1];
                if (O == null)return H(Z);
                Z = Z.split("&");
                for (var la = 0; la < Z.length; la++)if (Z[la].substring(0, Z[la].indexOf("=")) == O)return H(Z[la].substring(Z[la].indexOf("=") +
                        1))
            }
            return""
        },expressInstallCallback:function() {
            if (Ba) {
                var O = C(K);
                if (O && m) {
                    O.parentNode.replaceChild(m, O);
                    if (U) {
                        G(U, true);
                        if (oa.ie && oa.win)m.style.display = "block"
                    }
                    sa && sa(ya)
                }
                Ba = false
            }
        }}
}();
(function(a) {
    var d = {};
    a.publish = function(c, b) {
        b = a.makeArray(b);
        d[c] && a.each(d[c], function() {
            try {
                this.apply(a, b || [])
            } catch(e) {
                console.error("pub/sub. topic: ", c, ", error: ", e, "msg:", e.message, "stack:", e.stack, ", func: ", this)
            }
        })
    };
    a.subscribe = function(c, b) {
        d[c] || (d[c] = []);
        d[c].push(b);
        return[c,b]
    };
    a.unsubscribe = function(c) {
        var b = c[0];
        d[b] && a.each(d[b], function(e) {
            this == c[1] && d[b].splice(e, 1)
        })
    };
    a.subscriptions = d
})(jQuery);
(function(a, d, c) {
    function b(r) {
        r = r || location.href;
        return"#" + r.replace(/^[^#]*#?(.*)$/, "$1")
    }

    var e = "hashchange",f = document,j,h = a.event.special,l = f.documentMode,o = "on" + e in d && (l === c || l > 7);
    a.fn[e] = function(r) {
        return r ? this.bind(e, r) : this.trigger(e)
    };
    a.fn[e].delay = 50;
    h[e] = a.extend(h[e], {setup:function() {
        if (o)return false;
        a(j.start)
    },teardown:function() {
        if (o)return false;
        a(j.stop)
    }});
    j = function() {
        function r() {
            var H = b(),A = G(F);
            if (H !== F) {
                I(F = H, A);
                a(d).trigger(e)
            } else if (A !== F)location.href = location.href.replace(/#.*/,
                    "") + A;
            C = setTimeout(r, a.fn[e].delay)
        }

        var u = {},C,F = b(),x = function(H) {
            return H
        },I = x,G = x;
        u.start = function() {
            C || r()
        };
        u.stop = function() {
            C && clearTimeout(C);
            C = c
        };
        a.browser.msie && !o && function() {
            var H,A;
            u.start = function() {
                if (!H) {
                    A = (A = a.fn[e].src) && A + b();
                    H = a('<iframe tabindex="-1" title="empty"/>').hide().one("load",
                            function() {
                                A || I(b());
                                r()
                            }).attr("src", A || "javascript:0").insertAfter("body")[0].contentWindow;
                    f.onpropertychange = function() {
                        try {
                            if (event.propertyName === "title")H.document.title = f.title
                        } catch(N) {
                        }
                    }
                }
            };
            u.stop = x;
            G = function() {
                return b(H.location.href)
            };
            I = function(N, ba) {
                var K = H.document,W = a.fn[e].domain;
                if (N !== ba) {
                    K.title = f.title;
                    K.open();
                    W && K.write('<script>document.domain="' + W + '"<\/script>');
                    K.close();
                    H.location.hash = N
                }
            }
        }();
        return u
    }()
})(jQuery, this);
(function(a, d) {
    function c(e, f) {
        var j = e.nodeName.toLowerCase();
        if ("area" === j) {
            j = e.parentNode;
            var h = j.name;
            if (!e.href || !h || j.nodeName.toLowerCase() !== "map")return false;
            j = a("img[usemap=#" + h + "]")[0];
            return!!j && b(j)
        }
        return(/input|select|textarea|button|object/.test(j) ? !e.disabled : "a" == j ? e.href || f : f) && b(e)
    }

    function b(e) {
        return!a(e).parents().andSelf().filter(
                function() {
                    return a.curCSS(this, "visibility") === "hidden" || a.expr.filters.hidden(this)
                }).length
    }

    a.ui = a.ui || {};
    if (!a.ui.version) {
        a.extend(a.ui, {version:"1.8.16",
            keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});
        a.fn.extend({propAttr:a.fn.prop || a.fn.attr,_focus:a.fn.focus,focus:function(e, f) {
            return typeof e === "number" ? this.each(function() {
                var j =
                        this;
                setTimeout(function() {
                    a(j).focus();
                    f && f.call(j)
                }, e)
            }) : this._focus.apply(this, arguments)
        },scrollParent:function() {
            var e;
            e = a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(
                    function() {
                        return/(relative|absolute|fixed)/.test(a.curCSS(this, "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
                    }).eq(0) : this.parents().filter(
                    function() {
                        return/(auto|scroll)/.test(a.curCSS(this,
                                "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
                    }).eq(0);
            return/fixed/.test(this.css("position")) || !e.length ? a(document) : e
        },zIndex:function(e) {
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
        },disableSelection:function() {
            return this.bind((a.support.selectstart ? "selectstart" :
                    "mousedown") + ".ui-disableSelection", function(e) {
                e.preventDefault()
            })
        },enableSelection:function() {
            return this.unbind(".ui-disableSelection")
        }});
        a.each(["Width","Height"], function(e, f) {
            function j(r, u, C, F) {
                a.each(h, function() {
                    u -= parseFloat(a.curCSS(r, "padding" + this, true)) || 0;
                    if (C)u -= parseFloat(a.curCSS(r, "border" + this + "Width", true)) || 0;
                    if (F)u -= parseFloat(a.curCSS(r, "margin" + this, true)) || 0
                });
                return u
            }

            var h = f === "Width" ? ["Left","Right"] : ["Top","Bottom"],l = f.toLowerCase(),o = {innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,
                outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};
            a.fn["inner" + f] = function(r) {
                if (r === d)return o["inner" + f].call(this);
                return this.each(function() {
                    a(this).css(l, j(this, r) + "px")
                })
            };
            a.fn["outer" + f] = function(r, u) {
                if (typeof r !== "number")return o["outer" + f].call(this, r);
                return this.each(function() {
                    a(this).css(l, j(this, r, true, u) + "px")
                })
            }
        });
        a.extend(a.expr[":"], {data:function(e, f, j) {
            return!!a.data(e, j[3])
        },focusable:function(e) {
            return c(e, !isNaN(a.attr(e, "tabindex")))
        },tabbable:function(e) {
            var f = a.attr(e,
                    "tabindex"),j = isNaN(f);
            return(j || f >= 0) && c(e, !j)
        }});
        a(function() {
            var e = document.body,f = e.appendChild(f = document.createElement("div"));
            a.extend(f.style, {minHeight:"100px",height:"auto",padding:0,borderWidth:0});
            a.support.minHeight = f.offsetHeight === 100;
            a.support.selectstart = "onselectstart"in f;
            e.removeChild(f).style.display = "none"
        });
        a.extend(a.ui, {plugin:{add:function(e, f, j) {
            e = a.ui[e].prototype;
            for (var h in j) {
                e.plugins[h] = e.plugins[h] || [];
                e.plugins[h].push([f,j[h]])
            }
        },call:function(e, f, j) {
            if ((f = e.plugins[f]) &&
                    e.element[0].parentNode)for (var h = 0; h < f.length; h++)e.options[f[h][0]] && f[h][1].apply(e.element, j)
        }},contains:function(e, f) {
            return document.compareDocumentPosition ? e.compareDocumentPosition(f) & 16 : e !== f && e.contains(f)
        },hasScroll:function(e, f) {
            if (a(e).css("overflow") === "hidden")return false;
            var j = f && f === "left" ? "scrollLeft" : "scrollTop",h = false;
            if (e[j] > 0)return true;
            e[j] = 1;
            h = e[j] > 0;
            e[j] = 0;
            return h
        },isOverAxis:function(e, f, j) {
            return e > f && e < f + j
        },isOver:function(e, f, j, h, l, o) {
            return a.ui.isOverAxis(e, j, l) &&
                    a.ui.isOverAxis(f, h, o)
        }})
    }
})(jQuery);
(function(a, d) {
    if (a.cleanData) {
        var c = a.cleanData;
        a.cleanData = function(e) {
            for (var f = 0,j; (j = e[f]) != null; f++)try {
                a(j).triggerHandler("remove")
            } catch(h) {
            }
            c(e)
        }
    } else {
        var b = a.fn.remove;
        a.fn.remove = function(e, f) {
            return this.each(function() {
                if (!f)if (!e || a.filter(e, [this]).length)a("*", this).add([this]).each(function() {
                    try {
                        a(this).triggerHandler("remove")
                    } catch(j) {
                    }
                });
                return b.call(a(this), e, f)
            })
        }
    }
    a.widget = function(e, f, j) {
        var h = e.split(".")[0],l;
        e = e.split(".")[1];
        l = h + "-" + e;
        if (!j) {
            j = f;
            f = a.Widget
        }
        a.expr[":"][l] =
                function(o) {
                    return!!a.data(o, e)
                };
        a[h] = a[h] || {};
        a[h][e] = function(o, r) {
            arguments.length && this._createWidget(o, r)
        };
        f = new f;
        f.options = a.extend(true, {}, f.options);
        a[h][e].prototype = a.extend(true, f, {namespace:h,widgetName:e,widgetEventPrefix:a[h][e].prototype.widgetEventPrefix || e,widgetBaseClass:l}, j);
        a.widget.bridge(e, a[h][e])
    };
    a.widget.bridge = function(e, f) {
        a.fn[e] = function(j) {
            var h = typeof j === "string",l = Array.prototype.slice.call(arguments, 1),o = this;
            j = !h && l.length ? a.extend.apply(null, [true,j].concat(l)) :
                    j;
            if (h && j.charAt(0) === "_")return o;
            h ? this.each(function() {
                var r = a.data(this, e),u = r && a.isFunction(r[j]) ? r[j].apply(r, l) : r;
                if (u !== r && u !== d) {
                    o = u;
                    return false
                }
            }) : this.each(function() {
                var r = a.data(this, e);
                r ? r.option(j || {})._init() : a.data(this, e, new f(j, this))
            });
            return o
        }
    };
    a.Widget = function(e, f) {
        arguments.length && this._createWidget(e, f)
    };
    a.Widget.prototype = {widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(e, f) {
        a.data(f, this.widgetName, this);
        this.element = a(f);
        this.options =
                a.extend(true, {}, this.options, this._getCreateOptions(), e);
        var j = this;
        this.element.bind("remove." + this.widgetName, function() {
            j.destroy()
        });
        this._create();
        this._trigger("create");
        this._init()
    },_getCreateOptions:function() {
        return a.metadata && a.metadata.get(this.element[0])[this.widgetName]
    },_create:function() {
    },_init:function() {
    },destroy:function() {
        this.element.unbind("." + this.widgetName).removeData(this.widgetName);
        this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass +
                "-disabled ui-state-disabled")
    },widget:function() {
        return this.element
    },option:function(e, f) {
        var j = e;
        if (arguments.length === 0)return a.extend({}, this.options);
        if (typeof e === "string") {
            if (f === d)return this.options[e];
            j = {};
            j[e] = f
        }
        this._setOptions(j);
        return this
    },_setOptions:function(e) {
        var f = this;
        a.each(e, function(j, h) {
            f._setOption(j, h)
        });
        return this
    },_setOption:function(e, f) {
        this.options[e] = f;
        if (e === "disabled")this.widget()[f ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled",
                f);
        return this
    },enable:function() {
        return this._setOption("disabled", false)
    },disable:function() {
        return this._setOption("disabled", true)
    },_trigger:function(e, f, j) {
        var h = this.options[e];
        f = a.Event(f);
        f.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase();
        j = j || {};
        if (f.originalEvent) {
            e = a.event.props.length;
            for (var l; e;) {
                l = a.event.props[--e];
                f[l] = f.originalEvent[l]
            }
        }
        this.element.trigger(f, j);
        return!(a.isFunction(h) && h.call(this.element[0], f, j) === false || f.isDefaultPrevented())
    }}
})(jQuery);
(function(a) {
    var d = false;
    a(document).mouseup(function() {
        d = false
    });
    a.widget("ui.mouse", {options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function() {
        var c = this;
        this.element.bind("mousedown." + this.widgetName,
                function(b) {
                    return c._mouseDown(b)
                }).bind("click." + this.widgetName, function(b) {
                    if (true === a.data(b.target, c.widgetName + ".preventClickEvent")) {
                        a.removeData(b.target, c.widgetName + ".preventClickEvent");
                        b.stopImmediatePropagation();
                        return false
                    }
                });
        this.started = false
    },_mouseDestroy:function() {
        this.element.unbind("." +
                this.widgetName)
    },_mouseDown:function(c) {
        if (!d) {
            this._mouseStarted && this._mouseUp(c);
            this._mouseDownEvent = c;
            var b = this,e = c.which == 1,f = typeof this.options.cancel == "string" && c.target.nodeName ? a(c.target).closest(this.options.cancel).length : false;
            if (!e || f || !this._mouseCapture(c))return true;
            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet)this._mouseDelayTimer = setTimeout(function() {
                b.mouseDelayMet = true
            }, this.options.delay);
            if (this._mouseDistanceMet(c) && this._mouseDelayMet(c)) {
                this._mouseStarted =
                        this._mouseStart(c) !== false;
                if (!this._mouseStarted) {
                    c.preventDefault();
                    return true
                }
            }
            true === a.data(c.target, this.widgetName + ".preventClickEvent") && a.removeData(c.target, this.widgetName + ".preventClickEvent");
            this._mouseMoveDelegate = function(j) {
                return b._mouseMove(j)
            };
            this._mouseUpDelegate = function(j) {
                return b._mouseUp(j)
            };
            a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
            c.preventDefault();
            return d = true
        }
    },_mouseMove:function(c) {
        if (a.browser.msie &&
                !(document.documentMode >= 9) && !c.button)return this._mouseUp(c);
        if (this._mouseStarted) {
            this._mouseDrag(c);
            return c.preventDefault()
        }
        if (this._mouseDistanceMet(c) && this._mouseDelayMet(c))(this._mouseStarted = this._mouseStart(this._mouseDownEvent, c) !== false) ? this._mouseDrag(c) : this._mouseUp(c);
        return!this._mouseStarted
    },_mouseUp:function(c) {
        a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
        if (this._mouseStarted) {
            this._mouseStarted =
                    false;
            c.target == this._mouseDownEvent.target && a.data(c.target, this.widgetName + ".preventClickEvent", true);
            this._mouseStop(c)
        }
        return false
    },_mouseDistanceMet:function(c) {
        return Math.max(Math.abs(this._mouseDownEvent.pageX - c.pageX), Math.abs(this._mouseDownEvent.pageY - c.pageY)) >= this.options.distance
    },_mouseDelayMet:function() {
        return this.mouseDelayMet
    },_mouseStart:function() {
    },_mouseDrag:function() {
    },_mouseStop:function() {
    },_mouseCapture:function() {
        return true
    }})
})(jQuery);
(function(a) {
    a.ui = a.ui || {};
    var d = /left|center|right/,c = /top|center|bottom/,b = a.fn.position,e = a.fn.offset;
    a.fn.position = function(f) {
        if (!f || !f.of)return b.apply(this, arguments);
        f = a.extend({}, f);
        var j = a(f.of),h = j[0],l = (f.collision || "flip").split(" "),o = f.offset ? f.offset.split(" ") : [0,0],r,u,C;
        if (h.nodeType === 9) {
            r = j.width();
            u = j.height();
            C = {top:0,left:0}
        } else if (h.setTimeout) {
            r = j.width();
            u = j.height();
            C = {top:j.scrollTop(),left:j.scrollLeft()}
        } else if (h.preventDefault) {
            f.at = "left top";
            r = u = 0;
            C = {top:f.of.pageY,
                left:f.of.pageX}
        } else {
            r = j.outerWidth();
            u = j.outerHeight();
            C = j.offset()
        }
        a.each(["my","at"], function() {
            var F = (f[this] || "").split(" ");
            if (F.length === 1)F = d.test(F[0]) ? F.concat(["center"]) : c.test(F[0]) ? ["center"].concat(F) : ["center","center"];
            F[0] = d.test(F[0]) ? F[0] : "center";
            F[1] = c.test(F[1]) ? F[1] : "center";
            f[this] = F
        });
        if (l.length === 1)l[1] = l[0];
        o[0] = parseInt(o[0], 10) || 0;
        if (o.length === 1)o[1] = o[0];
        o[1] = parseInt(o[1], 10) || 0;
        if (f.at[0] === "right")C.left += r; else if (f.at[0] === "center")C.left += r / 2;
        if (f.at[1] === "bottom")C.top +=
                u; else if (f.at[1] === "center")C.top += u / 2;
        C.left += o[0];
        C.top += o[1];
        return this.each(function() {
            var F = a(this),x = F.outerWidth(),I = F.outerHeight(),G = parseInt(a.curCSS(this, "marginLeft", true)) || 0,H = parseInt(a.curCSS(this, "marginTop", true)) || 0,A = x + G + (parseInt(a.curCSS(this, "marginRight", true)) || 0),N = I + H + (parseInt(a.curCSS(this, "marginBottom", true)) || 0),ba = a.extend({}, C),K;
            if (f.my[0] === "right")ba.left -= x; else if (f.my[0] === "center")ba.left -= x / 2;
            if (f.my[1] === "bottom")ba.top -= I; else if (f.my[1] === "center")ba.top -=
                    I / 2;
            ba.left = Math.round(ba.left);
            ba.top = Math.round(ba.top);
            K = {left:ba.left - G,top:ba.top - H};
            a.each(["left","top"], function(W, ka) {
                a.ui.position[l[W]] && a.ui.position[l[W]][ka](ba, {targetWidth:r,targetHeight:u,elemWidth:x,elemHeight:I,collisionPosition:K,collisionWidth:A,collisionHeight:N,offset:o,my:f.my,at:f.at})
            });
            a.fn.bgiframe && F.bgiframe();
            F.offset(a.extend(ba, {using:f.using}))
        })
    };
    a.ui.position = {fit:{left:function(f, j) {
        var h = a(window);
        h = j.collisionPosition.left + j.collisionWidth - h.width() - h.scrollLeft();
        f.left = h > 0 ? f.left - h : Math.max(f.left - j.collisionPosition.left, f.left)
    },top:function(f, j) {
        var h = a(window);
        h = j.collisionPosition.top + j.collisionHeight - h.height() - h.scrollTop();
        f.top = h > 0 ? f.top - h : Math.max(f.top - j.collisionPosition.top, f.top)
    }},flip:{left:function(f, j) {
        if (j.at[0] !== "center") {
            var h = a(window);
            h = j.collisionPosition.left + j.collisionWidth - h.width() - h.scrollLeft();
            var l = j.my[0] === "left" ? -j.elemWidth : j.my[0] === "right" ? j.elemWidth : 0,o = j.at[0] === "left" ? j.targetWidth : -j.targetWidth,r = -2 * j.offset[0];
            f.left += j.collisionPosition.left < 0 ? l + o + r : h > 0 ? l + o + r : 0
        }
    },top:function(f, j) {
        if (j.at[1] !== "center") {
            var h = a(window);
            h = j.collisionPosition.top + j.collisionHeight - h.height() - h.scrollTop();
            var l = j.my[1] === "top" ? -j.elemHeight : j.my[1] === "bottom" ? j.elemHeight : 0,o = j.at[1] === "top" ? j.targetHeight : -j.targetHeight,r = -2 * j.offset[1];
            f.top += j.collisionPosition.top < 0 ? l + o + r : h > 0 ? l + o + r : 0
        }
    }}};
    if (!a.offset.setOffset) {
        a.offset.setOffset = function(f, j) {
            if (/static/.test(a.curCSS(f, "position")))f.style.position = "relative";
            var h =
                    a(f),l = h.offset(),o = parseInt(a.curCSS(f, "top", true), 10) || 0,r = parseInt(a.curCSS(f, "left", true), 10) || 0;
            l = {top:j.top - l.top + o,left:j.left - l.left + r};
            "using"in j ? j.using.call(f, l) : h.css(l)
        };
        a.fn.offset = function(f) {
            var j = this[0];
            if (!j || !j.ownerDocument)return null;
            if (f)return this.each(function() {
                a.offset.setOffset(this, f)
            });
            return e.call(this)
        }
    }
})(jQuery);
(function(a) {
    a.widget("ui.draggable", a.ui.mouse, {widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function() {
        if (this.options.helper ==
                "original" && !/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position = "relative";
        this.options.addClasses && this.element.addClass("ui-draggable");
        this.options.disabled && this.element.addClass("ui-draggable-disabled");
        this._mouseInit()
    },destroy:function() {
        if (this.element.data("draggable")) {
            this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
            this._mouseDestroy();
            return this
        }
    },_mouseCapture:function(d) {
        var c =
                this.options;
        if (this.helper || c.disabled || a(d.target).is(".ui-resizable-handle"))return false;
        this.handle = this._getHandle(d);
        if (!this.handle)return false;
        if (c.iframeFix)a(c.iframeFix === true ? "iframe" : c.iframeFix).each(function() {
            a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth + "px",height:this.offsetHeight + "px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(a(this).offset()).appendTo("body")
        });
        return true
    },_mouseStart:function(d) {
        var c = this.options;
        this.helper = this._createHelper(d);
        this._cacheHelperProportions();
        if (a.ui.ddmanager)a.ui.ddmanager.current = this;
        this._cacheMargins();
        this.cssPosition = this.helper.css("position");
        this.scrollParent = this.helper.scrollParent();
        this.offset = this.positionAbs = this.element.offset();
        this.offset = {top:this.offset.top - this.margins.top,left:this.offset.left - this.margins.left};
        a.extend(this.offset, {click:{left:d.pageX - this.offset.left,top:d.pageY - this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});
        this.originalPosition = this.position = this._generatePosition(d);
        this.originalPageX = d.pageX;
        this.originalPageY = d.pageY;
        c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt);
        c.containment && this._setContainment();
        if (this._trigger("start", d) === false) {
            this._clear();
            return false
        }
        this._cacheHelperProportions();
        a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, d);
        this.helper.addClass("ui-draggable-dragging");
        this._mouseDrag(d, true);
        a.ui.ddmanager && a.ui.ddmanager.dragStart(this, d);
        return true
    },
        _mouseDrag:function(d, c) {
            this.position = this._generatePosition(d);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!c) {
                var b = this._uiHash();
                if (this._trigger("drag", d, b) === false) {
                    this._mouseUp({});
                    return false
                }
                this.position = b.position
            }
            if (!this.options.axis || this.options.axis != "y")this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x")this.helper[0].style.top = this.position.top + "px";
            a.ui.ddmanager && a.ui.ddmanager.drag(this, d);
            return false
        },_mouseStop:function(d) {
            var c =
                    false;
            if (a.ui.ddmanager && !this.options.dropBehaviour)c = a.ui.ddmanager.drop(this, d);
            if (this.dropped) {
                c = this.dropped;
                this.dropped = false
            }
            if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")return false;
            if (this.options.revert == "invalid" && !c || this.options.revert == "valid" && c || this.options.revert === true || a.isFunction(this.options.revert) && this.options.revert.call(this.element, c)) {
                var b = this;
                a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration,
                        10), function() {
                    b._trigger("stop", d) !== false && b._clear()
                })
            } else this._trigger("stop", d) !== false && this._clear();
            return false
        },_mouseUp:function(d) {
            this.options.iframeFix === true && a("div.ui-draggable-iframeFix").each(function() {
                this.parentNode.removeChild(this)
            });
            a.ui.ddmanager && a.ui.ddmanager.dragStop(this, d);
            return a.ui.mouse.prototype._mouseUp.call(this, d)
        },cancel:function() {
            this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear();
            return this
        },_getHandle:function(d) {
            var c = !this.options.handle ||
                    !a(this.options.handle, this.element).length ? true : false;
            a(this.options.handle, this.element).find("*").andSelf().each(function() {
                if (this == d.target)c = true
            });
            return c
        },_createHelper:function(d) {
            var c = this.options;
            d = a.isFunction(c.helper) ? a(c.helper.apply(this.element[0], [d])) : c.helper == "clone" ? this.element.clone().removeAttr("id") : this.element;
            d.parents("body").length || d.appendTo(c.appendTo == "parent" ? this.element[0].parentNode : c.appendTo);
            d[0] != this.element[0] && !/(fixed|absolute)/.test(d.css("position")) &&
            d.css("position", "absolute");
            return d
        },_adjustOffsetFromHelper:function(d) {
            if (typeof d == "string")d = d.split(" ");
            if (a.isArray(d))d = {left:+d[0],top:+d[1] || 0};
            if ("left"in d)this.offset.click.left = d.left + this.margins.left;
            if ("right"in d)this.offset.click.left = this.helperProportions.width - d.right + this.margins.left;
            if ("top"in d)this.offset.click.top = d.top + this.margins.top;
            if ("bottom"in d)this.offset.click.top = this.helperProportions.height - d.bottom + this.margins.top
        },_getParentOffset:function() {
            this.offsetParent =
                    this.helper.offsetParent();
            var d = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                d.left += this.scrollParent.scrollLeft();
                d.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie)d = {top:0,left:0};
            return{top:d.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),left:d.left + (parseInt(this.offsetParent.css("borderLeftWidth"),
                    10) || 0)}
        },_getRelativeOffset:function() {
            if (this.cssPosition == "relative") {
                var d = this.element.position();
                return{top:d.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),left:d.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()}
            } else return{top:0,left:0}
        },_cacheMargins:function() {
            this.margins = {left:parseInt(this.element.css("marginLeft"), 10) || 0,top:parseInt(this.element.css("marginTop"), 10) || 0,right:parseInt(this.element.css("marginRight"), 10) || 0,bottom:parseInt(this.element.css("marginBottom"),
                    10) || 0}
        },_cacheHelperProportions:function() {
            this.helperProportions = {width:this.helper.outerWidth(),height:this.helper.outerHeight()}
        },_setContainment:function() {
            var d = this.options;
            if (d.containment == "parent")d.containment = this.helper[0].parentNode;
            if (d.containment == "document" || d.containment == "window")this.containment = [d.containment == "document" ? 0 : a(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,d.containment == "document" ? 0 : a(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
                (d.containment == "document" ? 0 : a(window).scrollLeft()) + a(d.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left,(d.containment == "document" ? 0 : a(window).scrollTop()) + (a(d.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(d.containment) && d.containment.constructor != Array) {
                d = a(d.containment);
                var c = d[0];
                if (c) {
                    d.offset();
                    var b = a(c).css("overflow") !=
                            "hidden";
                    this.containment = [(parseInt(a(c).css("borderLeftWidth"), 10) || 0) + (parseInt(a(c).css("paddingLeft"), 10) || 0),(parseInt(a(c).css("borderTopWidth"), 10) || 0) + (parseInt(a(c).css("paddingTop"), 10) || 0),(b ? Math.max(c.scrollWidth, c.offsetWidth) : c.offsetWidth) - (parseInt(a(c).css("borderLeftWidth"), 10) || 0) - (parseInt(a(c).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,(b ? Math.max(c.scrollHeight, c.offsetHeight) : c.offsetHeight) - (parseInt(a(c).css("borderTopWidth"),
                            10) || 0) - (parseInt(a(c).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom];
                    this.relative_container = d
                }
            } else if (d.containment.constructor == Array)this.containment = d.containment
        },_convertPositionTo:function(d, c) {
            if (!c)c = this.position;
            var b = d == "absolute" ? 1 : -1,e = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,f = /(html|body)/i.test(e[0].tagName);
            return{top:c.top +
                    this.offset.relative.top * b + this.offset.parent.top * b - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0 : e.scrollTop()) * b),left:c.left + this.offset.relative.left * b + this.offset.parent.left * b - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0 : e.scrollLeft()) * b)}
        },_generatePosition:function(d) {
            var c = this.options,b = this.cssPosition == "absolute" &&
                    !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,e = /(html|body)/i.test(b[0].tagName),f = d.pageX,j = d.pageY;
            if (this.originalPosition) {
                var h;
                if (this.containment) {
                    if (this.relative_container) {
                        h = this.relative_container.offset();
                        h = [this.containment[0] + h.left,this.containment[1] + h.top,this.containment[2] + h.left,this.containment[3] + h.top]
                    } else h = this.containment;
                    if (d.pageX - this.offset.click.left < h[0])f = h[0] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top < h[1])j = h[1] + this.offset.click.top;
                    if (d.pageX - this.offset.click.left > h[2])f = h[2] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top > h[3])j = h[3] + this.offset.click.top
                }
                if (c.grid) {
                    j = c.grid[1] ? this.originalPageY + Math.round((j - this.originalPageY) / c.grid[1]) * c.grid[1] : this.originalPageY;
                    j = h ? !(j - this.offset.click.top < h[1] || j - this.offset.click.top > h[3]) ? j : !(j - this.offset.click.top < h[1]) ? j - c.grid[1] : j + c.grid[1] : j;
                    f = c.grid[0] ? this.originalPageX + Math.round((f - this.originalPageX) /
                            c.grid[0]) * c.grid[0] : this.originalPageX;
                    f = h ? !(f - this.offset.click.left < h[0] || f - this.offset.click.left > h[2]) ? f : !(f - this.offset.click.left < h[0]) ? f - c.grid[0] : f + c.grid[0] : f
                }
            }
            return{top:j - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : b.scrollTop()),left:f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && a.browser.version <
                    526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : b.scrollLeft())}
        },_clear:function() {
            this.helper.removeClass("ui-draggable-dragging");
            this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove();
            this.helper = null;
            this.cancelHelperRemoval = false
        },_trigger:function(d, c, b) {
            b = b || this._uiHash();
            a.ui.plugin.call(this, d, [c,b]);
            if (d == "drag")this.positionAbs = this._convertPositionTo("absolute");
            return a.Widget.prototype._trigger.call(this, d, c,
                    b)
        },plugins:{},_uiHash:function() {
            return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}
        }});
    a.extend(a.ui.draggable, {version:"1.8.16"});
    a.ui.plugin.add("draggable", "connectToSortable", {start:function(d, c) {
        var b = a(this).data("draggable"),e = b.options,f = a.extend({}, c, {item:b.element});
        b.sortables = [];
        a(e.connectToSortable).each(function() {
            var j = a.data(this, "sortable");
            if (j && !j.options.disabled) {
                b.sortables.push({instance:j,shouldRevert:j.options.revert});
                j.refreshPositions();
                j._trigger("activate", d, f)
            }
        })
    },stop:function(d, c) {
        var b = a(this).data("draggable"),e = a.extend({}, c, {item:b.element});
        a.each(b.sortables, function() {
            if (this.instance.isOver) {
                this.instance.isOver = 0;
                b.cancelHelperRemoval = true;
                this.instance.cancelHelperRemoval = false;
                if (this.shouldRevert)this.instance.options.revert = true;
                this.instance._mouseStop(d);
                this.instance.options.helper = this.instance.options._helper;
                b.options.helper == "original" && this.instance.currentItem.css({top:"auto",left:"auto"})
            } else {
                this.instance.cancelHelperRemoval =
                        false;
                this.instance._trigger("deactivate", d, e)
            }
        })
    },drag:function(d, c) {
        var b = a(this).data("draggable"),e = this;
        a.each(b.sortables, function() {
            this.instance.positionAbs = b.positionAbs;
            this.instance.helperProportions = b.helperProportions;
            this.instance.offset.click = b.offset.click;
            if (this.instance._intersectsWith(this.instance.containerCache)) {
                if (!this.instance.isOver) {
                    this.instance.isOver = 1;
                    this.instance.currentItem = a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", true);
                    this.instance.options._helper = this.instance.options.helper;
                    this.instance.options.helper = function() {
                        return c.helper[0]
                    };
                    d.target = this.instance.currentItem[0];
                    this.instance._mouseCapture(d, true);
                    this.instance._mouseStart(d, true, true);
                    this.instance.offset.click.top = b.offset.click.top;
                    this.instance.offset.click.left = b.offset.click.left;
                    this.instance.offset.parent.left -= b.offset.parent.left - this.instance.offset.parent.left;
                    this.instance.offset.parent.top -= b.offset.parent.top - this.instance.offset.parent.top;
                    b._trigger("toSortable", d);
                    b.dropped = this.instance.element;
                    b.currentItem = b.element;
                    this.instance.fromOutside = b
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
                b._trigger("fromSortable", d);
                b.dropped = false
            }
        })
    }});
    a.ui.plugin.add("draggable", "cursor", {start:function() {
        var d = a("body"),c = a(this).data("draggable").options;
        if (d.css("cursor"))c._cursor = d.css("cursor");
        d.css("cursor", c.cursor)
    },stop:function() {
        var d = a(this).data("draggable").options;
        d._cursor && a("body").css("cursor", d._cursor)
    }});
    a.ui.plugin.add("draggable", "opacity", {start:function(d, c) {
        var b = a(c.helper),e = a(this).data("draggable").options;
        if (b.css("opacity"))e._opacity =
                b.css("opacity");
        b.css("opacity", e.opacity)
    },stop:function(d, c) {
        var b = a(this).data("draggable").options;
        b._opacity && a(c.helper).css("opacity", b._opacity)
    }});
    a.ui.plugin.add("draggable", "scroll", {start:function() {
        var d = a(this).data("draggable");
        if (d.scrollParent[0] != document && d.scrollParent[0].tagName != "HTML")d.overflowOffset = d.scrollParent.offset()
    },drag:function(d) {
        var c = a(this).data("draggable"),b = c.options,e = false;
        if (c.scrollParent[0] != document && c.scrollParent[0].tagName != "HTML") {
            if (!b.axis || b.axis !=
                    "x")if (c.overflowOffset.top + c.scrollParent[0].offsetHeight - d.pageY < b.scrollSensitivity)c.scrollParent[0].scrollTop = e = c.scrollParent[0].scrollTop + b.scrollSpeed; else if (d.pageY - c.overflowOffset.top < b.scrollSensitivity)c.scrollParent[0].scrollTop = e = c.scrollParent[0].scrollTop - b.scrollSpeed;
            if (!b.axis || b.axis != "y")if (c.overflowOffset.left + c.scrollParent[0].offsetWidth - d.pageX < b.scrollSensitivity)c.scrollParent[0].scrollLeft = e = c.scrollParent[0].scrollLeft + b.scrollSpeed; else if (d.pageX - c.overflowOffset.left <
                    b.scrollSensitivity)c.scrollParent[0].scrollLeft = e = c.scrollParent[0].scrollLeft - b.scrollSpeed
        } else {
            if (!b.axis || b.axis != "x")if (d.pageY - a(document).scrollTop() < b.scrollSensitivity)e = a(document).scrollTop(a(document).scrollTop() - b.scrollSpeed); else if (a(window).height() - (d.pageY - a(document).scrollTop()) < b.scrollSensitivity)e = a(document).scrollTop(a(document).scrollTop() + b.scrollSpeed);
            if (!b.axis || b.axis != "y")if (d.pageX - a(document).scrollLeft() < b.scrollSensitivity)e = a(document).scrollLeft(a(document).scrollLeft() -
                    b.scrollSpeed); else if (a(window).width() - (d.pageX - a(document).scrollLeft()) < b.scrollSensitivity)e = a(document).scrollLeft(a(document).scrollLeft() + b.scrollSpeed)
        }
        e !== false && a.ui.ddmanager && !b.dropBehaviour && a.ui.ddmanager.prepareOffsets(c, d)
    }});
    a.ui.plugin.add("draggable", "snap", {start:function() {
        var d = a(this).data("draggable"),c = d.options;
        d.snapElements = [];
        a(c.snap.constructor != String ? c.snap.items || ":data(draggable)" : c.snap).each(function() {
            var b = a(this),e = b.offset();
            this != d.element[0] && d.snapElements.push({item:this,
                width:b.outerWidth(),height:b.outerHeight(),top:e.top,left:e.left})
        })
    },drag:function(d, c) {
        for (var b = a(this).data("draggable"),e = b.options,f = e.snapTolerance,j = c.offset.left,h = j + b.helperProportions.width,l = c.offset.top,o = l + b.helperProportions.height,r = b.snapElements.length - 1; r >= 0; r--) {
            var u = b.snapElements[r].left,C = u + b.snapElements[r].width,F = b.snapElements[r].top,x = F + b.snapElements[r].height;
            if (u - f < j && j < C + f && F - f < l && l < x + f || u - f < j && j < C + f && F - f < o && o < x + f || u - f < h && h < C + f && F - f < l && l < x + f || u - f < h && h < C + f && F - f < o &&
                    o < x + f) {
                if (e.snapMode != "inner") {
                    var I = Math.abs(F - o) <= f,G = Math.abs(x - l) <= f,H = Math.abs(u - h) <= f,A = Math.abs(C - j) <= f;
                    if (I)c.position.top = b._convertPositionTo("relative", {top:F - b.helperProportions.height,left:0}).top - b.margins.top;
                    if (G)c.position.top = b._convertPositionTo("relative", {top:x,left:0}).top - b.margins.top;
                    if (H)c.position.left = b._convertPositionTo("relative", {top:0,left:u - b.helperProportions.width}).left - b.margins.left;
                    if (A)c.position.left = b._convertPositionTo("relative", {top:0,left:C}).left - b.margins.left
                }
                var N =
                        I || G || H || A;
                if (e.snapMode != "outer") {
                    I = Math.abs(F - l) <= f;
                    G = Math.abs(x - o) <= f;
                    H = Math.abs(u - j) <= f;
                    A = Math.abs(C - h) <= f;
                    if (I)c.position.top = b._convertPositionTo("relative", {top:F,left:0}).top - b.margins.top;
                    if (G)c.position.top = b._convertPositionTo("relative", {top:x - b.helperProportions.height,left:0}).top - b.margins.top;
                    if (H)c.position.left = b._convertPositionTo("relative", {top:0,left:u}).left - b.margins.left;
                    if (A)c.position.left = b._convertPositionTo("relative", {top:0,left:C - b.helperProportions.width}).left - b.margins.left
                }
                if (!b.snapElements[r].snapping &&
                        (I || G || H || A || N))b.options.snap.snap && b.options.snap.snap.call(b.element, d, a.extend(b._uiHash(), {snapItem:b.snapElements[r].item}));
                b.snapElements[r].snapping = I || G || H || A || N
            } else {
                b.snapElements[r].snapping && b.options.snap.release && b.options.snap.release.call(b.element, d, a.extend(b._uiHash(), {snapItem:b.snapElements[r].item}));
                b.snapElements[r].snapping = false
            }
        }
    }});
    a.ui.plugin.add("draggable", "stack", {start:function() {
        var d = a(this).data("draggable").options;
        d = a.makeArray(a(d.stack)).sort(function(b, e) {
            return(parseInt(a(b).css("zIndex"),
                    10) || 0) - (parseInt(a(e).css("zIndex"), 10) || 0)
        });
        if (d.length) {
            var c = parseInt(d[0].style.zIndex) || 0;
            a(d).each(function(b) {
                this.style.zIndex = c + b
            });
            this[0].style.zIndex = c + d.length
        }
    }});
    a.ui.plugin.add("draggable", "zIndex", {start:function(d, c) {
        var b = a(c.helper),e = a(this).data("draggable").options;
        if (b.css("zIndex"))e._zIndex = b.css("zIndex");
        b.css("zIndex", e.zIndex)
    },stop:function(d, c) {
        var b = a(this).data("draggable").options;
        b._zIndex && a(c.helper).css("zIndex", b._zIndex)
    }})
})(jQuery);
(function(a) {
    a.widget("ui.droppable", {widgetEventPrefix:"drop",options:{accept:"*",activeClass:false,addClasses:true,greedy:false,hoverClass:false,scope:"default",tolerance:"intersect"},_create:function() {
        var d = this.options,c = d.accept;
        this.isover = 0;
        this.isout = 1;
        this.accept = a.isFunction(c) ? c : function(b) {
            return b.is(c)
        };
        this.proportions = {width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};
        a.ui.ddmanager.droppables[d.scope] = a.ui.ddmanager.droppables[d.scope] || [];
        a.ui.ddmanager.droppables[d.scope].push(this);
        d.addClasses && this.element.addClass("ui-droppable")
    },destroy:function() {
        for (var d = a.ui.ddmanager.droppables[this.options.scope],c = 0; c < d.length; c++)d[c] == this && d.splice(c, 1);
        this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");
        return this
    },_setOption:function(d, c) {
        if (d == "accept")this.accept = a.isFunction(c) ? c : function(b) {
            return b.is(c)
        };
        a.Widget.prototype._setOption.apply(this, arguments)
    },_activate:function(d) {
        var c = a.ui.ddmanager.current;
        this.options.activeClass &&
        this.element.addClass(this.options.activeClass);
        c && this._trigger("activate", d, this.ui(c))
    },_deactivate:function(d) {
        var c = a.ui.ddmanager.current;
        this.options.activeClass && this.element.removeClass(this.options.activeClass);
        c && this._trigger("deactivate", d, this.ui(c))
    },_over:function(d) {
        var c = a.ui.ddmanager.current;
        if (!(!c || (c.currentItem || c.element)[0] == this.element[0]))if (this.accept.call(this.element[0], c.currentItem || c.element)) {
            this.options.hoverClass && this.element.addClass(this.options.hoverClass);
            this._trigger("over", d, this.ui(c))
        }
    },_out:function(d) {
        var c = a.ui.ddmanager.current;
        if (!(!c || (c.currentItem || c.element)[0] == this.element[0]))if (this.accept.call(this.element[0], c.currentItem || c.element)) {
            this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
            this._trigger("out", d, this.ui(c))
        }
    },_drop:function(d, c) {
        var b = c || a.ui.ddmanager.current;
        if (!b || (b.currentItem || b.element)[0] == this.element[0])return false;
        var e = false;
        this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
            var f =
                    a.data(this, "droppable");
            if (f.options.greedy && !f.options.disabled && f.options.scope == b.options.scope && f.accept.call(f.element[0], b.currentItem || b.element) && a.ui.intersect(b, a.extend(f, {offset:f.element.offset()}), f.options.tolerance)) {
                e = true;
                return false
            }
        });
        if (e)return false;
        if (this.accept.call(this.element[0], b.currentItem || b.element)) {
            this.options.activeClass && this.element.removeClass(this.options.activeClass);
            this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
            this._trigger("drop",
                    d, this.ui(b));
            return this.element
        }
        return false
    },ui:function(d) {
        return{draggable:d.currentItem || d.element,helper:d.helper,position:d.position,offset:d.positionAbs}
    }});
    a.extend(a.ui.droppable, {version:"1.8.16"});
    a.ui.intersect = function(d, c, b) {
        if (!c.offset)return false;
        var e = (d.positionAbs || d.position.absolute).left,f = e + d.helperProportions.width,j = (d.positionAbs || d.position.absolute).top,h = j + d.helperProportions.height,l = c.offset.left,o = l + c.proportions.width,r = c.offset.top,u = r + c.proportions.height;
        switch (b) {
            case "fit":
                return l <=
                        e && f <= o && r <= j && h <= u;
            case "intersect":
                return l < e + d.helperProportions.width / 2 && f - d.helperProportions.width / 2 < o && r < j + d.helperProportions.height / 2 && h - d.helperProportions.height / 2 < u;
            case "pointer":
                return a.ui.isOver((d.positionAbs || d.position.absolute).top + (d.clickOffset || d.offset.click).top, (d.positionAbs || d.position.absolute).left + (d.clickOffset || d.offset.click).left, r, l, c.proportions.height, c.proportions.width);
            case "touch":
                return(j >= r && j <= u || h >= r && h <= u || j < r && h > u) && (e >= l && e <= o || f >= l && f <= o || e < l && f > o);
            default:
                return false
        }
    };
    a.ui.ddmanager = {current:null,droppables:{"default":[]},prepareOffsets:function(d, c) {
        var b = a.ui.ddmanager.droppables[d.options.scope] || [],e = c ? c.type : null,f = (d.currentItem || d.element).find(":data(droppable)").andSelf(),j = 0;
        a:for (; j < b.length; j++)if (!(b[j].options.disabled || d && !b[j].accept.call(b[j].element[0], d.currentItem || d.element))) {
            for (var h = 0; h < f.length; h++)if (f[h] == b[j].element[0]) {
                b[j].proportions.height = 0;
                continue a
            }
            b[j].visible = b[j].element.css("display") != "none";
            if (b[j].visible) {
                e ==
                        "mousedown" && b[j]._activate.call(b[j], c);
                b[j].offset = b[j].element.offset();
                b[j].proportions = {width:b[j].element[0].offsetWidth,height:b[j].element[0].offsetHeight}
            }
        }
    },drop:function(d, c) {
        var b = false;
        a.each(a.ui.ddmanager.droppables[d.options.scope] || [], function() {
            if (this.options) {
                if (!this.options.disabled && this.visible && a.ui.intersect(d, this, this.options.tolerance))b = b || this._drop.call(this, c);
                if (!this.options.disabled && this.visible && this.accept.call(this.element[0], d.currentItem || d.element)) {
                    this.isout =
                            1;
                    this.isover = 0;
                    this._deactivate.call(this, c)
                }
            }
        });
        return b
    },dragStart:function(d, c) {
        d.element.parents(":not(body,html)").bind("scroll.droppable", function() {
            d.options.refreshPositions || a.ui.ddmanager.prepareOffsets(d, c)
        })
    },drag:function(d, c) {
        d.options.refreshPositions && a.ui.ddmanager.prepareOffsets(d, c);
        a.each(a.ui.ddmanager.droppables[d.options.scope] || [], function() {
            if (!(this.options.disabled || this.greedyChild || !this.visible)) {
                var b = a.ui.intersect(d, this, this.options.tolerance);
                if (b = !b && this.isover ==
                        1 ? "isout" : b && this.isover == 0 ? "isover" : null) {
                    var e;
                    if (this.options.greedy) {
                        var f = this.element.parents(":data(droppable):eq(0)");
                        if (f.length) {
                            e = a.data(f[0], "droppable");
                            e.greedyChild = b == "isover" ? 1 : 0
                        }
                    }
                    if (e && b == "isover") {
                        e.isover = 0;
                        e.isout = 1;
                        e._out.call(e, c)
                    }
                    this[b] = 1;
                    this[b == "isout" ? "isover" : "isout"] = 0;
                    this[b == "isover" ? "_over" : "_out"].call(this, c);
                    if (e && b == "isout") {
                        e.isout = 0;
                        e.isover = 1;
                        e._over.call(e, c)
                    }
                }
            }
        })
    },dragStop:function(d, c) {
        d.element.parents(":not(body,html)").unbind("scroll.droppable");
        d.options.refreshPositions ||
        a.ui.ddmanager.prepareOffsets(d, c)
    }}
})(jQuery);
(function(a) {
    a.widget("ui.resizable", a.ui.mouse, {widgetEventPrefix:"resize",options:{alsoResize:false,animate:false,animateDuration:"slow",animateEasing:"swing",aspectRatio:false,autoHide:false,containment:false,ghost:false,grid:false,handles:"e,s,se",helper:false,iframeFix:false,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1E3},_create:function() {
        var b = this,e = this.options;
        this.element.addClass("ui-resizable");
        a.extend(this, {_aspectRatio:!!e.aspectRatio,aspectRatio:e.aspectRatio,originalElement:this.element,
            _proportionallyResizeElements:[],_helper:e.helper || e.ghost || e.animate ? e.helper || "ui-resizable-helper" : null});
        if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {
            /relative/.test(this.element.css("position")) && a.browser.opera && this.element.css({position:"relative",top:"auto",left:"auto"});
            this.element.wrap(a('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),
                top:this.element.css("top"),left:this.element.css("left")}));
            this.element = this.element.parent().data("resizable", this.element.data("resizable"));
            this.elementIsWrapper = true;
            this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")});
            this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});
            this.originalResizeStyle =
                    this.originalElement.css("resize");
            this.originalElement.css("resize", "none");
            this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"}));
            this.originalElement.css({margin:this.originalElement.css("margin")});
            this._proportionallyResize()
        }
        this.handles = e.handles || (!a(".ui-resizable-handle", this.element).length ? "e,s,se" : {n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",
            nw:".ui-resizable-nw"});
        if (this.handles.constructor == String) {
            if (this.handles == "all")this.handles = "n,e,s,w,se,sw,ne,nw";
            var f = this.handles.split(",");
            this.handles = {};
            for (var j = 0; j < f.length; j++) {
                var h = a.trim(f[j]),l = a('<div class="ui-resizable-handle ' + ("ui-resizable-" + h) + '"></div>');
                /sw|se|ne|nw/.test(h) && l.css({zIndex:++e.zIndex});
                "se" == h && l.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
                this.handles[h] = ".ui-resizable-" + h;
                this.element.append(l)
            }
        }
        this._renderAxis = function(o) {
            o = o || this.element;
            for (var r in this.handles) {
                if (this.handles[r].constructor ==
                        String)this.handles[r] = a(this.handles[r], this.element).show();
                if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                    var u = a(this.handles[r], this.element),C = 0;
                    C = /sw|ne|nw|se|n|s/.test(r) ? u.outerHeight() : u.outerWidth();
                    u = ["padding",/ne|nw|n/.test(r) ? "Top" : /se|sw|s/.test(r) ? "Bottom" : /^e$/.test(r) ? "Right" : "Left"].join("");
                    o.css(u, C);
                    this._proportionallyResize()
                }
                a(this.handles[r])
            }
        };
        this._renderAxis(this.element);
        this._handles = a(".ui-resizable-handle", this.element).disableSelection();
        this._handles.mouseover(function() {
            if (!b.resizing) {
                if (this.className)var o = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                b.axis = o && o[1] ? o[1] : "se"
            }
        });
        if (e.autoHide) {
            this._handles.hide();
            a(this.element).addClass("ui-resizable-autohide").hover(function() {
                if (!e.disabled) {
                    a(this).removeClass("ui-resizable-autohide");
                    b._handles.show()
                }
            }, function() {
                if (!e.disabled)if (!b.resizing) {
                    a(this).addClass("ui-resizable-autohide");
                    b._handles.hide()
                }
            })
        }
        this._mouseInit()
    },destroy:function() {
        this._mouseDestroy();
        var b = function(f) {
            a(f).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
        };
        if (this.elementIsWrapper) {
            b(this.element);
            var e = this.element;
            e.after(this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")})).remove()
        }
        this.originalElement.css("resize", this.originalResizeStyle);
        b(this.originalElement);
        return this
    },_mouseCapture:function(b) {
        var e =
                false;
        for (var f in this.handles)if (a(this.handles[f])[0] == b.target)e = true;
        return!this.options.disabled && e
    },_mouseStart:function(b) {
        var e = this.options,f = this.element.position(),j = this.element;
        this.resizing = true;
        this.documentScroll = {top:a(document).scrollTop(),left:a(document).scrollLeft()};
        if (j.is(".ui-draggable") || /absolute/.test(j.css("position")))j.css({position:"absolute",top:f.top,left:f.left});
        a.browser.opera && /relative/.test(j.css("position")) && j.css({position:"relative",top:"auto",left:"auto"});
        this._renderProxy();
        f = d(this.helper.css("left"));
        var h = d(this.helper.css("top"));
        if (e.containment) {
            f += a(e.containment).scrollLeft() || 0;
            h += a(e.containment).scrollTop() || 0
        }
        this.offset = this.helper.offset();
        this.position = {left:f,top:h};
        this.size = this._helper ? {width:j.outerWidth(),height:j.outerHeight()} : {width:j.width(),height:j.height()};
        this.originalSize = this._helper ? {width:j.outerWidth(),height:j.outerHeight()} : {width:j.width(),height:j.height()};
        this.originalPosition = {left:f,top:h};
        this.sizeDiff =
        {width:j.outerWidth() - j.width(),height:j.outerHeight() - j.height()};
        this.originalMousePosition = {left:b.pageX,top:b.pageY};
        this.aspectRatio = typeof e.aspectRatio == "number" ? e.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
        e = a(".ui-resizable-" + this.axis).css("cursor");
        a("body").css("cursor", e == "auto" ? this.axis + "-resize" : e);
        j.addClass("ui-resizable-resizing");
        this._propagate("start", b);
        return true
    },_mouseDrag:function(b) {
        var e = this.helper,f = this.originalMousePosition,j = this._change[this.axis];
        if (!j)return false;
        f = j.apply(this, [b,b.pageX - f.left || 0,b.pageY - f.top || 0]);
        this._updateVirtualBoundaries(b.shiftKey);
        if (this._aspectRatio || b.shiftKey)f = this._updateRatio(f, b);
        f = this._respectSize(f, b);
        this._propagate("resize", b);
        e.css({top:this.position.top + "px",left:this.position.left + "px",width:this.size.width + "px",height:this.size.height + "px"});
        !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize();
        this._updateCache(f);
        this._trigger("resize", b, this.ui());
        return false
    },
        _mouseStop:function(b) {
            this.resizing = false;
            var e = this.options;
            if (this._helper) {
                var f = this._proportionallyResizeElements,j = f.length && /textarea/i.test(f[0].nodeName);
                f = j && a.ui.hasScroll(f[0], "left") ? 0 : this.sizeDiff.height;
                j = j ? 0 : this.sizeDiff.width;
                j = {width:this.helper.width() - j,height:this.helper.height() - f};
                f = parseInt(this.element.css("left"), 10) + (this.position.left - this.originalPosition.left) || null;
                var h = parseInt(this.element.css("top"), 10) + (this.position.top - this.originalPosition.top) || null;
                e.animate ||
                this.element.css(a.extend(j, {top:h,left:f}));
                this.helper.height(this.size.height);
                this.helper.width(this.size.width);
                this._helper && !e.animate && this._proportionallyResize()
            }
            a("body").css("cursor", "auto");
            this.element.removeClass("ui-resizable-resizing");
            this._propagate("stop", b);
            this._helper && this.helper.remove();
            return false
        },_updateVirtualBoundaries:function(b) {
            var e = this.options,f,j,h;
            e = {minWidth:c(e.minWidth) ? e.minWidth : 0,maxWidth:c(e.maxWidth) ? e.maxWidth : Infinity,minHeight:c(e.minHeight) ? e.minHeight :
                    0,maxHeight:c(e.maxHeight) ? e.maxHeight : Infinity};
            if (this._aspectRatio || b) {
                b = e.minHeight * this.aspectRatio;
                j = e.minWidth / this.aspectRatio;
                f = e.maxHeight * this.aspectRatio;
                h = e.maxWidth / this.aspectRatio;
                if (b > e.minWidth)e.minWidth = b;
                if (j > e.minHeight)e.minHeight = j;
                if (f < e.maxWidth)e.maxWidth = f;
                if (h < e.maxHeight)e.maxHeight = h
            }
            this._vBoundaries = e
        },_updateCache:function(b) {
            this.offset = this.helper.offset();
            if (c(b.left))this.position.left = b.left;
            if (c(b.top))this.position.top = b.top;
            if (c(b.height))this.size.height =
                    b.height;
            if (c(b.width))this.size.width = b.width
        },_updateRatio:function(b) {
            var e = this.position,f = this.size,j = this.axis;
            if (c(b.height))b.width = b.height * this.aspectRatio; else if (c(b.width))b.height = b.width / this.aspectRatio;
            if (j == "sw") {
                b.left = e.left + (f.width - b.width);
                b.top = null
            }
            if (j == "nw") {
                b.top = e.top + (f.height - b.height);
                b.left = e.left + (f.width - b.width)
            }
            return b
        },_respectSize:function(b) {
            var e = this._vBoundaries,f = this.axis,j = c(b.width) && e.maxWidth && e.maxWidth < b.width,h = c(b.height) && e.maxHeight && e.maxHeight <
                    b.height,l = c(b.width) && e.minWidth && e.minWidth > b.width,o = c(b.height) && e.minHeight && e.minHeight > b.height;
            if (l)b.width = e.minWidth;
            if (o)b.height = e.minHeight;
            if (j)b.width = e.maxWidth;
            if (h)b.height = e.maxHeight;
            var r = this.originalPosition.left + this.originalSize.width,u = this.position.top + this.size.height,C = /sw|nw|w/.test(f);
            f = /nw|ne|n/.test(f);
            if (l && C)b.left = r - e.minWidth;
            if (j && C)b.left = r - e.maxWidth;
            if (o && f)b.top = u - e.minHeight;
            if (h && f)b.top = u - e.maxHeight;
            if ((e = !b.width && !b.height) && !b.left && b.top)b.top = null;
            else if (e && !b.top && b.left)b.left = null;
            return b
        },_proportionallyResize:function() {
            if (this._proportionallyResizeElements.length)for (var b = this.helper || this.element,e = 0; e < this._proportionallyResizeElements.length; e++) {
                var f = this._proportionallyResizeElements[e];
                if (!this.borderDif) {
                    var j = [f.css("borderTopWidth"),f.css("borderRightWidth"),f.css("borderBottomWidth"),f.css("borderLeftWidth")],h = [f.css("paddingTop"),f.css("paddingRight"),f.css("paddingBottom"),f.css("paddingLeft")];
                    this.borderDif = a.map(j,
                            function(l, o) {
                                var r = parseInt(l, 10) || 0,u = parseInt(h[o], 10) || 0;
                                return r + u
                            })
                }
                a.browser.msie && (a(b).is(":hidden") || a(b).parents(":hidden").length) || f.css({height:b.height() - this.borderDif[0] - this.borderDif[2] || 0,width:b.width() - this.borderDif[1] - this.borderDif[3] || 0})
            }
        },_renderProxy:function() {
            var b = this.options;
            this.elementOffset = this.element.offset();
            if (this._helper) {
                this.helper = this.helper || a('<div style="overflow:hidden;"></div>');
                var e = a.browser.msie && a.browser.version < 7,f = e ? 1 : 0;
                e = e ? 2 : -1;
                this.helper.addClass(this._helper).css({width:this.element.outerWidth() +
                        e,height:this.element.outerHeight() + e,position:"absolute",left:this.elementOffset.left - f + "px",top:this.elementOffset.top - f + "px",zIndex:++b.zIndex});
                this.helper.appendTo("body").disableSelection()
            } else this.helper = this.element
        },_change:{e:function(b, e) {
            return{width:this.originalSize.width + e}
        },w:function(b, e) {
            return{left:this.originalPosition.left + e,width:this.originalSize.width - e}
        },n:function(b, e, f) {
            return{top:this.originalPosition.top + f,height:this.originalSize.height - f}
        },s:function(b, e, f) {
            return{height:this.originalSize.height +
                    f}
        },se:function(b, e, f) {
            return a.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [b,e,f]))
        },sw:function(b, e, f) {
            return a.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [b,e,f]))
        },ne:function(b, e, f) {
            return a.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [b,e,f]))
        },nw:function(b, e, f) {
            return a.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [b,e,f]))
        }},_propagate:function(b, e) {
            a.ui.plugin.call(this, b, [e,this.ui()]);
            b != "resize" && this._trigger(b, e, this.ui())
        },plugins:{},ui:function() {
            return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}
        }});
    a.extend(a.ui.resizable, {version:"1.8.16"});
    a.ui.plugin.add("resizable", "alsoResize", {start:function() {
        var b = a(this).data("resizable").options,e = function(f) {
            a(f).each(function() {
                var j = a(this);
                j.data("resizable-alsoresize", {width:parseInt(j.width(),
                        10),height:parseInt(j.height(), 10),left:parseInt(j.css("left"), 10),top:parseInt(j.css("top"), 10),position:j.css("position")})
            })
        };
        if (typeof b.alsoResize == "object" && !b.alsoResize.parentNode)if (b.alsoResize.length) {
            b.alsoResize = b.alsoResize[0];
            e(b.alsoResize)
        } else a.each(b.alsoResize, function(f) {
            e(f)
        }); else e(b.alsoResize)
    },resize:function(b, e) {
        var f = a(this).data("resizable"),j = f.options,h = f.originalSize,l = f.originalPosition,o = {height:f.size.height - h.height || 0,width:f.size.width - h.width || 0,top:f.position.top -
                l.top || 0,left:f.position.left - l.left || 0},r = function(u, C) {
            a(u).each(function() {
                var F = a(this),x = a(this).data("resizable-alsoresize"),I = {},G = C && C.length ? C : F.parents(e.originalElement[0]).length ? ["width","height"] : ["width","height","top","left"];
                a.each(G, function(H, A) {
                    var N = (x[A] || 0) + (o[A] || 0);
                    if (N && N >= 0)I[A] = N || null
                });
                if (a.browser.opera && /relative/.test(F.css("position"))) {
                    f._revertToRelativePosition = true;
                    F.css({position:"absolute",top:"auto",left:"auto"})
                }
                F.css(I)
            })
        };
        typeof j.alsoResize == "object" &&
                !j.alsoResize.nodeType ? a.each(j.alsoResize, function(u, C) {
            r(u, C)
        }) : r(j.alsoResize)
    },stop:function() {
        var b = a(this).data("resizable"),e = b.options,f = function(j) {
            a(j).each(function() {
                var h = a(this);
                h.css({position:h.data("resizable-alsoresize").position})
            })
        };
        if (b._revertToRelativePosition) {
            b._revertToRelativePosition = false;
            typeof e.alsoResize == "object" && !e.alsoResize.nodeType ? a.each(e.alsoResize, function(j) {
                f(j)
            }) : f(e.alsoResize)
        }
        a(this).removeData("resizable-alsoresize")
    }});
    a.ui.plugin.add("resizable",
            "animate", {stop:function(b) {
                var e = a(this).data("resizable"),f = e.options,j = e._proportionallyResizeElements,h = j.length && /textarea/i.test(j[0].nodeName),l = h && a.ui.hasScroll(j[0], "left") ? 0 : e.sizeDiff.height;
                h = {width:e.size.width - (h ? 0 : e.sizeDiff.width),height:e.size.height - l};
                l = parseInt(e.element.css("left"), 10) + (e.position.left - e.originalPosition.left) || null;
                var o = parseInt(e.element.css("top"), 10) + (e.position.top - e.originalPosition.top) || null;
                e.element.animate(a.extend(h, o && l ? {top:o,left:l} : {}), {duration:f.animateDuration,
                    easing:f.animateEasing,step:function() {
                        var r = {width:parseInt(e.element.css("width"), 10),height:parseInt(e.element.css("height"), 10),top:parseInt(e.element.css("top"), 10),left:parseInt(e.element.css("left"), 10)};
                        j && j.length && a(j[0]).css({width:r.width,height:r.height});
                        e._updateCache(r);
                        e._propagate("resize", b)
                    }})
            }});
    a.ui.plugin.add("resizable", "containment", {start:function() {
        var b = a(this).data("resizable"),e = b.element,f = b.options.containment;
        if (e = f instanceof a ? f.get(0) : /parent/.test(f) ? e.parent().get(0) :
                f) {
            b.containerElement = a(e);
            if (/document/.test(f) || f == document) {
                b.containerOffset = {left:0,top:0};
                b.containerPosition = {left:0,top:0};
                b.parentData = {element:a(document),left:0,top:0,width:a(document).width(),height:a(document).height() || document.body.parentNode.scrollHeight}
            } else {
                var j = a(e),h = [];
                a(["Top","Right","Left","Bottom"]).each(function(r, u) {
                    h[r] = d(j.css("padding" + u))
                });
                b.containerOffset = j.offset();
                b.containerPosition = j.position();
                b.containerSize = {height:j.innerHeight() - h[3],width:j.innerWidth() -
                        h[1]};
                f = b.containerOffset;
                var l = b.containerSize.height,o = b.containerSize.width;
                o = a.ui.hasScroll(e, "left") ? e.scrollWidth : o;
                l = a.ui.hasScroll(e) ? e.scrollHeight : l;
                b.parentData = {element:e,left:f.left,top:f.top,width:o,height:l}
            }
        }
    },resize:function(b) {
        var e = a(this).data("resizable"),f = e.options,j = e.containerOffset,h = e.position;
        b = e._aspectRatio || b.shiftKey;
        var l = {top:0,left:0},o = e.containerElement;
        if (o[0] != document && /static/.test(o.css("position")))l = j;
        if (h.left < (e._helper ? j.left : 0)) {
            e.size.width += e._helper ?
                    e.position.left - j.left : e.position.left - l.left;
            if (b)e.size.height = e.size.width / f.aspectRatio;
            e.position.left = f.helper ? j.left : 0
        }
        if (h.top < (e._helper ? j.top : 0)) {
            e.size.height += e._helper ? e.position.top - j.top : e.position.top;
            if (b)e.size.width = e.size.height * f.aspectRatio;
            e.position.top = e._helper ? j.top : 0
        }
        e.offset.left = e.parentData.left + e.position.left;
        e.offset.top = e.parentData.top + e.position.top;
        f = Math.abs((e._helper ? e.offset.left - l.left : e.offset.left - l.left) + e.sizeDiff.width);
        j = Math.abs((e._helper ? e.offset.top -
                l.top : e.offset.top - j.top) + e.sizeDiff.height);
        h = e.containerElement.get(0) == e.element.parent().get(0);
        l = /relative|absolute/.test(e.containerElement.css("position"));
        if (h && l)f -= e.parentData.left;
        if (f + e.size.width >= e.parentData.width) {
            e.size.width = e.parentData.width - f;
            if (b)e.size.height = e.size.width / e.aspectRatio
        }
        if (j + e.size.height >= e.parentData.height) {
            e.size.height = e.parentData.height - j;
            if (b)e.size.width = e.size.height * e.aspectRatio
        }
    },stop:function() {
        var b = a(this).data("resizable"),e = b.options,f = b.containerOffset,
                j = b.containerPosition,h = b.containerElement,l = a(b.helper),o = l.offset(),r = l.outerWidth() - b.sizeDiff.width;
        l = l.outerHeight() - b.sizeDiff.height;
        b._helper && !e.animate && /relative/.test(h.css("position")) && a(this).css({left:o.left - j.left - f.left,width:r,height:l});
        b._helper && !e.animate && /static/.test(h.css("position")) && a(this).css({left:o.left - j.left - f.left,width:r,height:l})
    }});
    a.ui.plugin.add("resizable", "ghost", {start:function() {
        var b = a(this).data("resizable"),e = b.options,f = b.size;
        b.ghost = b.originalElement.clone();
        b.ghost.css({opacity:0.25,display:"block",position:"relative",height:f.height,width:f.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof e.ghost == "string" ? e.ghost : "");
        b.ghost.appendTo(b.helper)
    },resize:function() {
        var b = a(this).data("resizable");
        b.ghost && b.ghost.css({position:"relative",height:b.size.height,width:b.size.width})
    },stop:function() {
        var b = a(this).data("resizable");
        b.ghost && b.helper && b.helper.get(0).removeChild(b.ghost.get(0))
    }});
    a.ui.plugin.add("resizable", "grid",
            {resize:function() {
                var b = a(this).data("resizable"),e = b.options,f = b.size,j = b.originalSize,h = b.originalPosition,l = b.axis;
                e.grid = typeof e.grid == "number" ? [e.grid,e.grid] : e.grid;
                var o = Math.round((f.width - j.width) / (e.grid[0] || 1)) * (e.grid[0] || 1);
                e = Math.round((f.height - j.height) / (e.grid[1] || 1)) * (e.grid[1] || 1);
                if (/^(se|s|e)$/.test(l)) {
                    b.size.width = j.width + o;
                    b.size.height = j.height + e
                } else if (/^(ne)$/.test(l)) {
                    b.size.width = j.width + o;
                    b.size.height = j.height + e;
                    b.position.top = h.top - e
                } else {
                    if (/^(sw)$/.test(l)) {
                        b.size.width =
                                j.width + o;
                        b.size.height = j.height + e
                    } else {
                        b.size.width = j.width + o;
                        b.size.height = j.height + e;
                        b.position.top = h.top - e
                    }
                    b.position.left = h.left - o
                }
            }});
    a.ui.plugin.add("resizable", "iframeFix", {start:function() {
        var b = a(this).data("resizable").options;
        a(b.iframeFix === true ? "iframe" : b.iframeFix).each(function() {
            a('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth + "px",height:this.offsetHeight + "px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(a(this).offset()).appendTo("body")
        })
    },
        stop:function() {
            a("div.ui-resizable-iframeFix").each(function() {
                this.parentNode.removeChild(this)
            })
        }});
    var d = function(b) {
        return parseInt(b, 10) || 0
    },c = function(b) {
        return!isNaN(parseInt(b, 10))
    }
})(jQuery);
(function(a) {
    a.widget("ui.sortable", a.ui.mouse, {widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1E3},_create:function() {
        var d = this.options;
        this.containerCache = {};
        this.element.addClass("ui-sortable");
        this.refresh();
        this.floating = this.items.length ? d.axis === "x" || /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : false;
        this.offset = this.element.offset();
        this._mouseInit()
    },destroy:function() {
        this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
        this._mouseDestroy();
        for (var d = this.items.length - 1; d >= 0; d--)this.items[d].item.removeData("sortable-item");
        return this
    },_setOption:function(d, c) {
        if (d ===
                "disabled") {
            this.options[d] = c;
            this.widget()[c ? "addClass" : "removeClass"]("ui-sortable-disabled")
        } else a.Widget.prototype._setOption.apply(this, arguments)
    },_mouseCapture:function(d, c) {
        if (this.reverting)return false;
        if (this.options.disabled || this.options.type == "static")return false;
        this._refreshItems(d);
        var b = null,e = this;
        a(d.target).parents().each(function() {
            if (a.data(this, "sortable-item") == e) {
                b = a(this);
                return false
            }
        });
        if (a.data(d.target, "sortable-item") == e)b = a(d.target);
        if (!b)return false;
        if (this.options.handle &&
                !c) {
            var f = false;
            a(this.options.handle, b).find("*").andSelf().each(function() {
                if (this == d.target)f = true
            });
            if (!f)return false
        }
        this.currentItem = b;
        this._removeCurrentsFromItems();
        return true
    },_mouseStart:function(d, c, b) {
        c = this.options;
        this.currentContainer = this;
        this.refreshPositions();
        this.helper = this._createHelper(d);
        this._cacheHelperProportions();
        this._cacheMargins();
        this.scrollParent = this.helper.scrollParent();
        this.offset = this.currentItem.offset();
        this.offset = {top:this.offset.top - this.margins.top,left:this.offset.left -
                this.margins.left};
        this.helper.css("position", "absolute");
        this.cssPosition = this.helper.css("position");
        a.extend(this.offset, {click:{left:d.pageX - this.offset.left,top:d.pageY - this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});
        this.originalPosition = this._generatePosition(d);
        this.originalPageX = d.pageX;
        this.originalPageY = d.pageY;
        c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt);
        this.domPosition = {prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};
        this.helper[0] != this.currentItem[0] && this.currentItem.hide();
        this._createPlaceholder();
        c.containment && this._setContainment();
        if (c.cursor) {
            if (a("body").css("cursor"))this._storedCursor = a("body").css("cursor");
            a("body").css("cursor", c.cursor)
        }
        if (c.opacity) {
            if (this.helper.css("opacity"))this._storedOpacity = this.helper.css("opacity");
            this.helper.css("opacity", c.opacity)
        }
        if (c.zIndex) {
            if (this.helper.css("zIndex"))this._storedZIndex = this.helper.css("zIndex");
            this.helper.css("zIndex", c.zIndex)
        }
        if (this.scrollParent[0] !=
                document && this.scrollParent[0].tagName != "HTML")this.overflowOffset = this.scrollParent.offset();
        this._trigger("start", d, this._uiHash());
        this._preserveHelperProportions || this._cacheHelperProportions();
        if (!b)for (b = this.containers.length - 1; b >= 0; b--)this.containers[b]._trigger("activate", d, this._uiHash(this));
        if (a.ui.ddmanager)a.ui.ddmanager.current = this;
        a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, d);
        this.dragging = true;
        this.helper.addClass("ui-sortable-helper");
        this._mouseDrag(d);
        return true
    },_mouseDrag:function(d) {
        this.position = this._generatePosition(d);
        this.positionAbs = this._convertPositionTo("absolute");
        if (!this.lastPositionAbs)this.lastPositionAbs = this.positionAbs;
        if (this.options.scroll) {
            var c = this.options,b = false;
            if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
                if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - d.pageY < c.scrollSensitivity)this.scrollParent[0].scrollTop = b = this.scrollParent[0].scrollTop + c.scrollSpeed; else if (d.pageY - this.overflowOffset.top <
                        c.scrollSensitivity)this.scrollParent[0].scrollTop = b = this.scrollParent[0].scrollTop - c.scrollSpeed;
                if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - d.pageX < c.scrollSensitivity)this.scrollParent[0].scrollLeft = b = this.scrollParent[0].scrollLeft + c.scrollSpeed; else if (d.pageX - this.overflowOffset.left < c.scrollSensitivity)this.scrollParent[0].scrollLeft = b = this.scrollParent[0].scrollLeft - c.scrollSpeed
            } else {
                if (d.pageY - a(document).scrollTop() < c.scrollSensitivity)b = a(document).scrollTop(a(document).scrollTop() -
                        c.scrollSpeed); else if (a(window).height() - (d.pageY - a(document).scrollTop()) < c.scrollSensitivity)b = a(document).scrollTop(a(document).scrollTop() + c.scrollSpeed);
                if (d.pageX - a(document).scrollLeft() < c.scrollSensitivity)b = a(document).scrollLeft(a(document).scrollLeft() - c.scrollSpeed); else if (a(window).width() - (d.pageX - a(document).scrollLeft()) < c.scrollSensitivity)b = a(document).scrollLeft(a(document).scrollLeft() + c.scrollSpeed)
            }
            b !== false && a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this,
                    d)
        }
        this.positionAbs = this._convertPositionTo("absolute");
        if (!this.options.axis || this.options.axis != "y")this.helper[0].style.left = this.position.left + "px";
        if (!this.options.axis || this.options.axis != "x")this.helper[0].style.top = this.position.top + "px";
        for (c = this.items.length - 1; c >= 0; c--) {
            b = this.items[c];
            var e = b.item[0],f = this._intersectsWithPointer(b);
            if (f)if (e != this.currentItem[0] && this.placeholder[f == 1 ? "next" : "prev"]()[0] != e && !a.ui.contains(this.placeholder[0], e) && (this.options.type == "semi-dynamic" ? !a.ui.contains(this.element[0],
                    e) : true)) {
                this.direction = f == 1 ? "down" : "up";
                if (this.options.tolerance == "pointer" || this._intersectsWithSides(b))this._rearrange(d, b); else break;
                this._trigger("change", d, this._uiHash());
                break
            }
        }
        this._contactContainers(d);
        a.ui.ddmanager && a.ui.ddmanager.drag(this, d);
        this._trigger("sort", d, this._uiHash());
        this.lastPositionAbs = this.positionAbs;
        return false
    },_mouseStop:function(d, c) {
        if (d) {
            a.ui.ddmanager && !this.options.dropBehaviour && a.ui.ddmanager.drop(this, d);
            if (this.options.revert) {
                var b = this,e = b.placeholder.offset();
                b.reverting = true;
                a(this.helper).animate({left:e.left - this.offset.parent.left - b.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),top:e.top - this.offset.parent.top - b.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)}, parseInt(this.options.revert, 10) || 500, function() {
                    b._clear(d)
                })
            } else this._clear(d, c);
            return false
        }
    },cancel:function() {
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
                    {helper:null,dragging:false,reverting:false,_noFinalSort:null});
            this.domPosition.prev ? a(this.domPosition.prev).after(this.currentItem) : a(this.domPosition.parent).prepend(this.currentItem)
        }
        return this
    },serialize:function(d) {
        var c = this._getItemsAsjQuery(d && d.connected),b = [];
        d = d || {};
        a(c).each(function() {
            var e = (a(d.item || this).attr(d.attribute || "id") || "").match(d.expression || /(.+)[-=_](.+)/);
            if (e)b.push((d.key || e[1] + "[]") + "=" + (d.key && d.expression ? e[1] : e[2]))
        });
        !b.length && d.key && b.push(d.key + "=");
        return b.join("&")
    },
        toArray:function(d) {
            var c = this._getItemsAsjQuery(d && d.connected),b = [];
            d = d || {};
            c.each(function() {
                b.push(a(d.item || this).attr(d.attribute || "id") || "")
            });
            return b
        },_intersectsWith:function(d) {
            var c = this.positionAbs.left,b = c + this.helperProportions.width,e = this.positionAbs.top,f = e + this.helperProportions.height,j = d.left,h = j + d.width,l = d.top,o = l + d.height,r = this.offset.click.top,u = this.offset.click.left;
            r = e + r > l && e + r < o && c + u > j && c + u < h;
            return this.options.tolerance == "pointer" || this.options.forcePointerForContainers ||
                    this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > d[this.floating ? "width" : "height"] ? r : j < c + this.helperProportions.width / 2 && b - this.helperProportions.width / 2 < h && l < e + this.helperProportions.height / 2 && f - this.helperProportions.height / 2 < o
        },_intersectsWithPointer:function(d) {
            var c = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, d.top, d.height);
            d = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, d.left, d.width);
            c = c && d;
            d = this._getDragVerticalDirection();
            var b = this._getDragHorizontalDirection();
            if (!c)return false;
            return this.floating ? b && b == "right" || d == "down" ? 2 : 1 : d && (d == "down" ? 2 : 1)
        },_intersectsWithSides:function(d) {
            var c = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, d.top + d.height / 2, d.height);
            d = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, d.left + d.width / 2, d.width);
            var b = this._getDragVerticalDirection(),e = this._getDragHorizontalDirection();
            return this.floating && e ? e == "right" && d || e == "left" && !d : b && (b == "down" && c || b == "up" && !c)
        },
        _getDragVerticalDirection:function() {
            var d = this.positionAbs.top - this.lastPositionAbs.top;
            return d != 0 && (d > 0 ? "down" : "up")
        },_getDragHorizontalDirection:function() {
            var d = this.positionAbs.left - this.lastPositionAbs.left;
            return d != 0 && (d > 0 ? "right" : "left")
        },refresh:function(d) {
            this._refreshItems(d);
            this.refreshPositions();
            return this
        },_connectWith:function() {
            var d = this.options;
            return d.connectWith.constructor == String ? [d.connectWith] : d.connectWith
        },_getItemsAsjQuery:function(d) {
            var c = [],b = [],e = this._connectWith();
            if (e && d)for (d = e.length - 1; d >= 0; d--)for (var f = a(e[d]),j = f.length - 1; j >= 0; j--) {
                var h = a.data(f[j], "sortable");
                if (h && h != this && !h.options.disabled)b.push([a.isFunction(h.options.items) ? h.options.items.call(h.element) : a(h.options.items, h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),h])
            }
            b.push([a.isFunction(this.options.items) ? this.options.items.call(this.element, null, {options:this.options,item:this.currentItem}) : a(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),
                this]);
            for (d = b.length - 1; d >= 0; d--)b[d][0].each(function() {
                c.push(this)
            });
            return a(c)
        },_removeCurrentsFromItems:function() {
            for (var d = this.currentItem.find(":data(sortable-item)"),c = 0; c < this.items.length; c++)for (var b = 0; b < d.length; b++)d[b] == this.items[c].item[0] && this.items.splice(c, 1)
        },_refreshItems:function(d) {
            this.items = [];
            this.containers = [this];
            var c = this.items,b = [
                [a.isFunction(this.options.items) ? this.options.items.call(this.element[0], d, {item:this.currentItem}) : a(this.options.items, this.element),
                    this]
            ],e = this._connectWith();
            if (e)for (var f = e.length - 1; f >= 0; f--)for (var j = a(e[f]),h = j.length - 1; h >= 0; h--) {
                var l = a.data(j[h], "sortable");
                if (l && l != this && !l.options.disabled) {
                    b.push([a.isFunction(l.options.items) ? l.options.items.call(l.element[0], d, {item:this.currentItem}) : a(l.options.items, l.element),l]);
                    this.containers.push(l)
                }
            }
            for (f = b.length - 1; f >= 0; f--) {
                d = b[f][1];
                e = b[f][0];
                h = 0;
                for (j = e.length; h < j; h++) {
                    l = a(e[h]);
                    l.data("sortable-item", d);
                    c.push({item:l,instance:d,width:0,height:0,left:0,top:0})
                }
            }
        },refreshPositions:function(d) {
            if (this.offsetParent &&
                    this.helper)this.offset.parent = this._getParentOffset();
            for (var c = this.items.length - 1; c >= 0; c--) {
                var b = this.items[c];
                if (!(b.instance != this.currentContainer && this.currentContainer && b.item[0] != this.currentItem[0])) {
                    var e = this.options.toleranceElement ? a(this.options.toleranceElement, b.item) : b.item;
                    if (!d) {
                        b.width = e.outerWidth();
                        b.height = e.outerHeight()
                    }
                    e = e.offset();
                    b.left = e.left;
                    b.top = e.top
                }
            }
            if (this.options.custom && this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this); else for (c =
                                                                                                                                                 this.containers.length - 1; c >= 0; c--) {
                e = this.containers[c].element.offset();
                this.containers[c].containerCache.left = e.left;
                this.containers[c].containerCache.top = e.top;
                this.containers[c].containerCache.width = this.containers[c].element.outerWidth();
                this.containers[c].containerCache.height = this.containers[c].element.outerHeight()
            }
            return this
        },_createPlaceholder:function(d) {
            var c = d || this,b = c.options;
            if (!b.placeholder || b.placeholder.constructor == String) {
                var e = b.placeholder;
                b.placeholder = {element:function() {
                    var f =
                            a(document.createElement(c.currentItem[0].nodeName)).addClass(e || c.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                    if (!e)f.style.visibility = "hidden";
                    return f
                },update:function(f, j) {
                    if (!(e && !b.forcePlaceholderSize)) {
                        j.height() || j.height(c.currentItem.innerHeight() - parseInt(c.currentItem.css("paddingTop") || 0, 10) - parseInt(c.currentItem.css("paddingBottom") || 0, 10));
                        j.width() || j.width(c.currentItem.innerWidth() - parseInt(c.currentItem.css("paddingLeft") || 0, 10) - parseInt(c.currentItem.css("paddingRight") ||
                                0, 10))
                    }
                }}
            }
            c.placeholder = a(b.placeholder.element.call(c.element, c.currentItem));
            c.currentItem.after(c.placeholder);
            b.placeholder.update(c, c.placeholder)
        },_contactContainers:function(d) {
            for (var c = null,b = null,e = this.containers.length - 1; e >= 0; e--)if (!a.ui.contains(this.currentItem[0], this.containers[e].element[0]))if (this._intersectsWith(this.containers[e].containerCache)) {
                if (!(c && a.ui.contains(this.containers[e].element[0], c.element[0]))) {
                    c = this.containers[e];
                    b = e
                }
            } else if (this.containers[e].containerCache.over) {
                this.containers[e]._trigger("out",
                        d, this._uiHash(this));
                this.containers[e].containerCache.over = 0
            }
            if (c)if (this.containers.length === 1) {
                this.containers[b]._trigger("over", d, this._uiHash(this));
                this.containers[b].containerCache.over = 1
            } else if (this.currentContainer != this.containers[b]) {
                c = 1E4;
                e = null;
                for (var f = this.positionAbs[this.containers[b].floating ? "left" : "top"],j = this.items.length - 1; j >= 0; j--)if (a.ui.contains(this.containers[b].element[0], this.items[j].item[0])) {
                    var h = this.items[j][this.containers[b].floating ? "left" : "top"];
                    if (Math.abs(h -
                            f) < c) {
                        c = Math.abs(h - f);
                        e = this.items[j]
                    }
                }
                if (e || this.options.dropOnEmpty) {
                    this.currentContainer = this.containers[b];
                    e ? this._rearrange(d, e, null, true) : this._rearrange(d, null, this.containers[b].element, true);
                    this._trigger("change", d, this._uiHash());
                    this.containers[b]._trigger("change", d, this._uiHash(this));
                    this.options.placeholder.update(this.currentContainer, this.placeholder);
                    this.containers[b]._trigger("over", d, this._uiHash(this));
                    this.containers[b].containerCache.over = 1
                }
            }
        },_createHelper:function(d) {
            var c =
                    this.options;
            d = a.isFunction(c.helper) ? a(c.helper.apply(this.element[0], [d,this.currentItem])) : c.helper == "clone" ? this.currentItem.clone() : this.currentItem;
            d.parents("body").length || a(c.appendTo != "parent" ? c.appendTo : this.currentItem[0].parentNode)[0].appendChild(d[0]);
            if (d[0] == this.currentItem[0])this._storedCSS = {width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")};
            if (d[0].style.width ==
                    "" || c.forceHelperSize)d.width(this.currentItem.width());
            if (d[0].style.height == "" || c.forceHelperSize)d.height(this.currentItem.height());
            return d
        },_adjustOffsetFromHelper:function(d) {
            if (typeof d == "string")d = d.split(" ");
            if (a.isArray(d))d = {left:+d[0],top:+d[1] || 0};
            if ("left"in d)this.offset.click.left = d.left + this.margins.left;
            if ("right"in d)this.offset.click.left = this.helperProportions.width - d.right + this.margins.left;
            if ("top"in d)this.offset.click.top = d.top + this.margins.top;
            if ("bottom"in d)this.offset.click.top =
                    this.helperProportions.height - d.bottom + this.margins.top
        },_getParentOffset:function() {
            this.offsetParent = this.helper.offsetParent();
            var d = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                d.left += this.scrollParent.scrollLeft();
                d.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie)d =
            {top:0,left:0};
            return{top:d.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),left:d.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)}
        },_getRelativeOffset:function() {
            if (this.cssPosition == "relative") {
                var d = this.currentItem.position();
                return{top:d.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),left:d.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()}
            } else return{top:0,left:0}
        },_cacheMargins:function() {
            this.margins = {left:parseInt(this.currentItem.css("marginLeft"),
                    10) || 0,top:parseInt(this.currentItem.css("marginTop"), 10) || 0}
        },_cacheHelperProportions:function() {
            this.helperProportions = {width:this.helper.outerWidth(),height:this.helper.outerHeight()}
        },_setContainment:function() {
            var d = this.options;
            if (d.containment == "parent")d.containment = this.helper[0].parentNode;
            if (d.containment == "document" || d.containment == "window")this.containment = [0 - this.offset.relative.left - this.offset.parent.left,0 - this.offset.relative.top - this.offset.parent.top,a(d.containment == "document" ?
                    document : window).width() - this.helperProportions.width - this.margins.left,(a(d.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(d.containment)) {
                var c = a(d.containment)[0];
                d = a(d.containment).offset();
                var b = a(c).css("overflow") != "hidden";
                this.containment = [d.left + (parseInt(a(c).css("borderLeftWidth"), 10) || 0) + (parseInt(a(c).css("paddingLeft"), 10) || 0) - this.margins.left,d.top + (parseInt(a(c).css("borderTopWidth"),
                        10) || 0) + (parseInt(a(c).css("paddingTop"), 10) || 0) - this.margins.top,d.left + (b ? Math.max(c.scrollWidth, c.offsetWidth) : c.offsetWidth) - (parseInt(a(c).css("borderLeftWidth"), 10) || 0) - (parseInt(a(c).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left,d.top + (b ? Math.max(c.scrollHeight, c.offsetHeight) : c.offsetHeight) - (parseInt(a(c).css("borderTopWidth"), 10) || 0) - (parseInt(a(c).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
            }
        },_convertPositionTo:function(d, c) {
            if (!c)c =
                    this.position;
            var b = d == "absolute" ? 1 : -1,e = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,f = /(html|body)/i.test(e[0].tagName);
            return{top:c.top + this.offset.relative.top * b + this.offset.parent.top * b - (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0 : e.scrollTop()) * b),left:c.left + this.offset.relative.left * b + this.offset.parent.left * b - (a.browser.safari &&
                    this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0 : e.scrollLeft()) * b)}
        },_generatePosition:function(d) {
            var c = this.options,b = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,e = /(html|body)/i.test(b[0].tagName);
            if (this.cssPosition == "relative" && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0]))this.offset.relative = this._getRelativeOffset();
            var f = d.pageX,j = d.pageY;
            if (this.originalPosition) {
                if (this.containment) {
                    if (d.pageX - this.offset.click.left < this.containment[0])f = this.containment[0] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top < this.containment[1])j = this.containment[1] + this.offset.click.top;
                    if (d.pageX - this.offset.click.left > this.containment[2])f = this.containment[2] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top > this.containment[3])j = this.containment[3] + this.offset.click.top
                }
                if (c.grid) {
                    j = this.originalPageY + Math.round((j -
                            this.originalPageY) / c.grid[1]) * c.grid[1];
                    j = this.containment ? !(j - this.offset.click.top < this.containment[1] || j - this.offset.click.top > this.containment[3]) ? j : !(j - this.offset.click.top < this.containment[1]) ? j - c.grid[1] : j + c.grid[1] : j;
                    f = this.originalPageX + Math.round((f - this.originalPageX) / c.grid[0]) * c.grid[0];
                    f = this.containment ? !(f - this.offset.click.left < this.containment[0] || f - this.offset.click.left > this.containment[2]) ? f : !(f - this.offset.click.left < this.containment[0]) ? f - c.grid[0] : f + c.grid[0] : f
                }
            }
            return{top:j -
                    this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : b.scrollTop()),left:f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : b.scrollLeft())}
        },_rearrange:function(d, c, b, e) {
            b ? b[0].appendChild(this.placeholder[0]) : c.item[0].parentNode.insertBefore(this.placeholder[0],
                    this.direction == "down" ? c.item[0] : c.item[0].nextSibling);
            this.counter = this.counter ? ++this.counter : 1;
            var f = this,j = this.counter;
            window.setTimeout(function() {
                j == f.counter && f.refreshPositions(!e)
            }, 0)
        },_clear:function(d, c) {
            this.reverting = false;
            var b = [];
            !this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem);
            this._noFinalSort = null;
            if (this.helper[0] == this.currentItem[0]) {
                for (var e in this._storedCSS)if (this._storedCSS[e] == "auto" || this._storedCSS[e] == "static")this._storedCSS[e] =
                        "";
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else this.currentItem.show();
            this.fromOutside && !c && b.push(function(f) {
                this._trigger("receive", f, this._uiHash(this.fromOutside))
            });
            if ((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !c)b.push(function(f) {
                this._trigger("update", f, this._uiHash())
            });
            if (!a.ui.contains(this.element[0], this.currentItem[0])) {
                c || b.push(function(f) {
                    this._trigger("remove",
                            f, this._uiHash())
                });
                for (e = this.containers.length - 1; e >= 0; e--)if (a.ui.contains(this.containers[e].element[0], this.currentItem[0]) && !c) {
                    b.push(function(f) {
                        return function(j) {
                            f._trigger("receive", j, this._uiHash(this))
                        }
                    }.call(this, this.containers[e]));
                    b.push(function(f) {
                        return function(j) {
                            f._trigger("update", j, this._uiHash(this))
                        }
                    }.call(this, this.containers[e]))
                }
            }
            for (e = this.containers.length - 1; e >= 0; e--) {
                c || b.push(function(f) {
                    return function(j) {
                        f._trigger("deactivate", j, this._uiHash(this))
                    }
                }.call(this,
                        this.containers[e]));
                if (this.containers[e].containerCache.over) {
                    b.push(function(f) {
                        return function(j) {
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
                if (!c) {
                    this._trigger("beforeStop",
                            d, this._uiHash());
                    for (e = 0; e < b.length; e++)b[e].call(this, d);
                    this._trigger("stop", d, this._uiHash())
                }
                return false
            }
            c || this._trigger("beforeStop", d, this._uiHash());
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
            this.helper[0] != this.currentItem[0] && this.helper.remove();
            this.helper = null;
            if (!c) {
                for (e = 0; e < b.length; e++)b[e].call(this, d);
                this._trigger("stop", d, this._uiHash())
            }
            this.fromOutside = false;
            return true
        },_trigger:function() {
            a.Widget.prototype._trigger.apply(this, arguments) === false && this.cancel()
        },
        _uiHash:function(d) {
            var c = d || this;
            return{helper:c.helper,placeholder:c.placeholder || a([]),position:c.position,originalPosition:c.originalPosition,offset:c.positionAbs,item:c.currentItem,sender:d ? d.element : null}
        }});
    a.extend(a.ui.sortable, {version:"1.8.16"})
})(jQuery);
(function(a) {
    var d = 0;
    a.widget("ui.autocomplete", {options:{appendTo:"body",autoFocus:false,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function() {
        var c = this,b = this.element[0].ownerDocument,e;
        this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",
                function(f) {
                    if (!(c.options.disabled || c.element.propAttr("readOnly"))) {
                        e =
                                false;
                        var j = a.ui.keyCode;
                        switch (f.keyCode) {
                            case j.PAGE_UP:
                                c._move("previousPage", f);
                                break;
                            case j.PAGE_DOWN:
                                c._move("nextPage", f);
                                break;
                            case j.UP:
                                c._move("previous", f);
                                f.preventDefault();
                                break;
                            case j.DOWN:
                                c._move("next", f);
                                f.preventDefault();
                                break;
                            case j.ENTER:
                            case j.NUMPAD_ENTER:
                                if (c.menu.active) {
                                    e = true;
                                    f.preventDefault()
                                }
                            case j.TAB:
                                if (!c.menu.active)return;
                                c.menu.select(f);
                                break;
                            case j.ESCAPE:
                                c.element.val(c.term);
                                c.close(f);
                                break;
                            default:
                                clearTimeout(c.searching);
                                c.searching = setTimeout(function() {
                                    if (c.term !=
                                            c.element.val()) {
                                        c.selectedItem = null;
                                        c.search(null, f)
                                    }
                                }, c.options.delay);
                                break
                        }
                    }
                }).bind("keypress.autocomplete",
                function(f) {
                    if (e) {
                        e = false;
                        f.preventDefault()
                    }
                }).bind("focus.autocomplete",
                function() {
                    if (!c.options.disabled) {
                        c.selectedItem = null;
                        c.previous = c.element.val()
                    }
                }).bind("blur.autocomplete", function(f) {
                    if (!c.options.disabled) {
                        clearTimeout(c.searching);
                        c.closing = setTimeout(function() {
                            c.close(f);
                            c._change(f)
                        }, 150)
                    }
                });
        this._initSource();
        this.response = function() {
            return c._response.apply(c, arguments)
        };
        this.menu = a("<ul></ul>").addClass("ui-autocomplete").appendTo(a(this.options.appendTo || "body", b)[0]).mousedown(
                function(f) {
                    var j = c.menu.element[0];
                    a(f.target).closest(".ui-menu-item").length || setTimeout(function() {
                        a(document).one("mousedown", function(h) {
                            h.target !== c.element[0] && h.target !== j && !a.ui.contains(j, h.target) && c.close()
                        })
                    }, 1);
                    setTimeout(function() {
                        clearTimeout(c.closing)
                    }, 13)
                }).menu({focus:function(f, j) {
                    var h = j.item.data("item.autocomplete");
                    false !== c._trigger("focus", f, {item:h}) && /^key/.test(f.originalEvent.type) &&
                    c.element.val(h.value)
                },selected:function(f, j) {
                    var h = j.item.data("item.autocomplete"),l = c.previous;
                    if (c.element[0] !== b.activeElement) {
                        c.element.focus();
                        c.previous = l;
                        setTimeout(function() {
                            c.previous = l;
                            c.selectedItem = h
                        }, 1)
                    }
                    false !== c._trigger("select", f, {item:h}) && c.element.val(h.value);
                    c.term = c.element.val();
                    c.close(f);
                    c.selectedItem = h
                },blur:function() {
                    c.menu.element.is(":visible") && c.element.val() !== c.term && c.element.val(c.term)
                }}).zIndex(this.element.zIndex() + 3).css({top:0,left:0}).hide().data("menu");
        a.fn.bgiframe && this.menu.element.bgiframe()
    },destroy:function() {
        this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
        this.menu.element.remove();
        a.Widget.prototype.destroy.call(this)
    },_setOption:function(c, b) {
        a.Widget.prototype._setOption.apply(this, arguments);
        c === "source" && this._initSource();
        if (c === "appendTo")this.menu.element.appendTo(a(b || "body", this.element[0].ownerDocument)[0]);
        c === "disabled" &&
                b && this.xhr && this.xhr.abort()
    },_initSource:function() {
        var c = this,b,e;
        if (a.isArray(this.options.source)) {
            b = this.options.source;
            this.source = function(f, j) {
                j(a.ui.autocomplete.filter(b, f.term))
            }
        } else if (typeof this.options.source === "string") {
            e = this.options.source;
            this.source = function(f, j) {
                c.xhr && c.xhr.abort();
                c.xhr = a.ajax({url:e,data:f,dataType:"json",autocompleteRequest:++d,success:function(h) {
                    this.autocompleteRequest === d && j(h)
                },error:function() {
                    this.autocompleteRequest === d && j([])
                }})
            }
        } else this.source =
                this.options.source
    },search:function(c, b) {
        c = c != null ? c : this.element.val();
        this.term = this.element.val();
        if (c.length < this.options.minLength)return this.close(b);
        clearTimeout(this.closing);
        if (this._trigger("search", b) !== false)return this._search(c)
    },_search:function(c) {
        this.pending++;
        this.element.addClass("ui-autocomplete-loading");
        this.source({term:c}, this.response)
    },_response:function(c) {
        if (!this.options.disabled && c && c.length) {
            c = this._normalize(c);
            this._suggest(c);
            this._trigger("open")
        } else this.close();
        this.pending--;
        this.pending || this.element.removeClass("ui-autocomplete-loading")
    },close:function(c) {
        clearTimeout(this.closing);
        if (this.menu.element.is(":visible")) {
            this.menu.element.hide();
            this.menu.deactivate();
            this._trigger("close", c)
        }
    },_change:function(c) {
        this.previous !== this.element.val() && this._trigger("change", c, {item:this.selectedItem})
    },_normalize:function(c) {
        if (c.length && c[0].label && c[0].value)return c;
        return a.map(c, function(b) {
            if (typeof b === "string")return{label:b,value:b};
            return a.extend({label:b.label ||
                    b.value,value:b.value || b.label}, b)
        })
    },_suggest:function(c) {
        var b = this.menu.element.empty().zIndex(this.element.zIndex() + 1E3);
        this._renderMenu(b, c);
        this.menu.deactivate();
        this.menu.refresh();
        b.show();
        this._resizeMenu();
        b.position(a.extend({of:this.element}, this.options.position));
        this.options.autoFocus && this.menu.next(new a.Event("mouseover"))
    },_resizeMenu:function() {
        var c = this.menu.element;
        c.outerWidth(Math.min(c.width("").outerWidth(), this.element.outerWidth()))
    },_renderMenu:function(c, b) {
        var e =
                this;
        a.each(b, function(f, j) {
            e._renderItem(c, j)
        })
    },_renderItem:function(c, b) {
        return a("<li></li>").data("item.autocomplete", b).append(a("<a></a>").text(b.label)).appendTo(c)
    },_move:function(c, b) {
        if (this.menu.element.is(":visible"))if (this.menu.first() && /^previous/.test(c) || this.menu.last() && /^next/.test(c)) {
            this.element.val(this.term);
            this.menu.deactivate()
        } else this.menu[c](b); else this.search(null, b)
    },widget:function() {
        return this.menu.element
    }});
    a.extend(a.ui.autocomplete, {escapeRegex:function(c) {
        return c.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,
                "\\$&")
    },filter:function(c, b) {
        var e = RegExp(a.ui.autocomplete.escapeRegex(b), "i");
        return a.grep(c, function(f) {
            return e.test(f.label || f.value || f)
        })
    }})
})(jQuery);
(function(a) {
    a.widget("ui.menu", {_create:function() {
        var d = this;
        this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(c) {
            if (a(c.target).closest(".ui-menu-item a").length) {
                c.preventDefault();
                d.select(c)
            }
        });
        this.refresh()
    },refresh:function() {
        var d = this;
        this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem").children("a").addClass("ui-corner-all").attr("tabindex",
                -1).mouseenter(
                function(c) {
                    d.activate(c, a(this).parent())
                }).mouseleave(function() {
                    d.deactivate()
                })
    },activate:function(d, c) {
        this.deactivate();
        if (this.hasScroll()) {
            var b = c.offset().top - this.element.offset().top,e = this.element.scrollTop(),f = this.element.height();
            if (b < 0)this.element.scrollTop(e + b); else b >= f && this.element.scrollTop(e + b - f + c.height())
        }
        this.active = c.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end();
        this._trigger("focus", d, {item:c})
    },deactivate:function() {
        if (this.active) {
            this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
            this._trigger("blur");
            this.active = null
        }
    },next:function(d) {
        this.move("next", ".ui-menu-item:first", d)
    },previous:function(d) {
        this.move("prev", ".ui-menu-item:last", d)
    },first:function() {
        return this.active && !this.active.prevAll(".ui-menu-item").length
    },last:function() {
        return this.active && !this.active.nextAll(".ui-menu-item").length
    },move:function(d, c, b) {
        if (this.active) {
            d = this.active[d + "All"](".ui-menu-item").eq(0);
            d.length ? this.activate(b, d) : this.activate(b, this.element.children(c))
        } else this.activate(b,
                this.element.children(c))
    },nextPage:function(d) {
        if (this.hasScroll())if (!this.active || this.last())this.activate(d, this.element.children(".ui-menu-item:first")); else {
            var c = this.active.offset().top,b = this.element.height(),e = this.element.children(".ui-menu-item").filter(function() {
                var f = a(this).offset().top - c - b + a(this).height();
                return f < 10 && f > -10
            });
            e.length || (e = this.element.children(".ui-menu-item:last"));
            this.activate(d, e)
        } else this.activate(d, this.element.children(".ui-menu-item").filter(!this.active ||
                this.last() ? ":first" : ":last"))
    },previousPage:function(d) {
        if (this.hasScroll())if (!this.active || this.first())this.activate(d, this.element.children(".ui-menu-item:last")); else {
            var c = this.active.offset().top,b = this.element.height();
            result = this.element.children(".ui-menu-item").filter(function() {
                var e = a(this).offset().top - c + b - a(this).height();
                return e < 10 && e > -10
            });
            result.length || (result = this.element.children(".ui-menu-item:first"));
            this.activate(d, result)
        } else this.activate(d, this.element.children(".ui-menu-item").filter(!this.active ||
                this.first() ? ":last" : ":first"))
    },hasScroll:function() {
        return this.element.height() < this.element[a.fn.prop ? "prop" : "attr"]("scrollHeight")
    },select:function(d) {
        this._trigger("selected", d, {item:this.active})
    }})
})(jQuery);
(function(a) {
    a.widget("ui.slider", a.ui.mouse, {widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function() {
        var d = this,c = this.options,b = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),e = c.values && c.values.length || 1,f = [];
        this._mouseSliding = this._keySliding = false;
        this._animateOff = true;
        this._handleIndex = null;
        this._detectOrientation();
        this._mouseInit();
        this.element.addClass("ui-slider ui-slider-" +
                this.orientation + " ui-widget ui-widget-content ui-corner-all" + (c.disabled ? " ui-slider-disabled ui-disabled" : ""));
        this.range = a([]);
        if (c.range) {
            if (c.range === true) {
                if (!c.values)c.values = [this._valueMin(),this._valueMin()];
                if (c.values.length && c.values.length !== 2)c.values = [c.values[0],c.values[0]]
            }
            this.range = a("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header" + (c.range === "min" || c.range === "max" ? " ui-slider-range-" + c.range : ""))
        }
        for (var j = b.length; j < e; j += 1)f.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
        this.handles = b.add(a(f.join("")).appendTo(d.element));
        this.handle = this.handles.eq(0);
        this.handles.add(this.range).filter("a").click(
                function(h) {
                    h.preventDefault()
                }).hover(
                function() {
                    c.disabled || a(this).addClass("ui-state-hover")
                },
                function() {
                    a(this).removeClass("ui-state-hover")
                }).focus(
                function() {
                    if (c.disabled)a(this).blur(); else {
                        a(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
                        a(this).addClass("ui-state-focus")
                    }
                }).blur(function() {
                    a(this).removeClass("ui-state-focus")
                });
        this.handles.each(function(h) {
            a(this).data("index.ui-slider-handle",
                    h)
        });
        this.handles.keydown(
                function(h) {
                    var l = true,o = a(this).data("index.ui-slider-handle"),r,u,C;
                    if (!d.options.disabled) {
                        switch (h.keyCode) {
                            case a.ui.keyCode.HOME:
                            case a.ui.keyCode.END:
                            case a.ui.keyCode.PAGE_UP:
                            case a.ui.keyCode.PAGE_DOWN:
                            case a.ui.keyCode.UP:
                            case a.ui.keyCode.RIGHT:
                            case a.ui.keyCode.DOWN:
                            case a.ui.keyCode.LEFT:
                                l = false;
                                if (!d._keySliding) {
                                    d._keySliding = true;
                                    a(this).addClass("ui-state-active");
                                    r = d._start(h, o);
                                    if (r === false)return
                                }
                                break
                        }
                        C = d.options.step;
                        r = d.options.values && d.options.values.length ?
                                u = d.values(o) : u = d.value();
                        switch (h.keyCode) {
                            case a.ui.keyCode.HOME:
                                u = d._valueMin();
                                break;
                            case a.ui.keyCode.END:
                                u = d._valueMax();
                                break;
                            case a.ui.keyCode.PAGE_UP:
                                u = d._trimAlignValue(r + (d._valueMax() - d._valueMin()) / 5);
                                break;
                            case a.ui.keyCode.PAGE_DOWN:
                                u = d._trimAlignValue(r - (d._valueMax() - d._valueMin()) / 5);
                                break;
                            case a.ui.keyCode.UP:
                            case a.ui.keyCode.RIGHT:
                                if (r === d._valueMax())return;
                                u = d._trimAlignValue(r + C);
                                break;
                            case a.ui.keyCode.DOWN:
                            case a.ui.keyCode.LEFT:
                                if (r === d._valueMin())return;
                                u = d._trimAlignValue(r -
                                        C);
                                break
                        }
                        d._slide(h, o, u);
                        return l
                    }
                }).keyup(function(h) {
                    var l = a(this).data("index.ui-slider-handle");
                    if (d._keySliding) {
                        d._keySliding = false;
                        d._stop(h, l);
                        d._change(h, l);
                        a(this).removeClass("ui-state-active")
                    }
                });
        this._refreshValue();
        this._animateOff = false
    },destroy:function() {
        this.handles.remove();
        this.range.remove();
        this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
        this._mouseDestroy();
        return this
    },_mouseCapture:function(d) {
        var c = this.options,b,e,f,j,h;
        if (c.disabled)return false;
        this.elementSize = {width:this.element.outerWidth(),height:this.element.outerHeight()};
        this.elementOffset = this.element.offset();
        b = this._normValueFromMouse({x:d.pageX,y:d.pageY});
        e = this._valueMax() - this._valueMin() + 1;
        j = this;
        this.handles.each(function(l) {
            var o = Math.abs(b - j.values(l));
            if (e > o) {
                e = o;
                f = a(this);
                h = l
            }
        });
        if (c.range === true && this.values(1) === c.min) {
            h += 1;
            f = a(this.handles[h])
        }
        if (this._start(d, h) === false)return false;
        this._mouseSliding = true;
        j._handleIndex = h;
        f.addClass("ui-state-active").focus();
        c = f.offset();
        this._clickOffset = !a(d.target).parents().andSelf().is(".ui-slider-handle") ? {left:0,top:0} : {left:d.pageX - c.left - f.width() / 2,top:d.pageY - c.top - f.height() / 2 - (parseInt(f.css("borderTopWidth"), 10) || 0) - (parseInt(f.css("borderBottomWidth"), 10) || 0) + (parseInt(f.css("marginTop"), 10) || 0)};
        this.handles.hasClass("ui-state-hover") || this._slide(d, h, b);
        return this._animateOff = true
    },_mouseStart:function() {
        return true
    },_mouseDrag:function(d) {
        var c =
                this._normValueFromMouse({x:d.pageX,y:d.pageY});
        this._slide(d, this._handleIndex, c);
        return false
    },_mouseStop:function(d) {
        this.handles.removeClass("ui-state-active");
        this._mouseSliding = false;
        this._stop(d, this._handleIndex);
        this._change(d, this._handleIndex);
        this._clickOffset = this._handleIndex = null;
        return this._animateOff = false
    },_detectOrientation:function() {
        this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal"
    },_normValueFromMouse:function(d) {
        var c;
        if (this.orientation === "horizontal") {
            c =
                    this.elementSize.width;
            d = d.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)
        } else {
            c = this.elementSize.height;
            d = d.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)
        }
        c = d / c;
        if (c > 1)c = 1;
        if (c < 0)c = 0;
        if (this.orientation === "vertical")c = 1 - c;
        d = this._valueMax() - this._valueMin();
        return this._trimAlignValue(this._valueMin() + c * d)
    },_start:function(d, c) {
        var b = {handle:this.handles[c],value:this.value()};
        if (this.options.values && this.options.values.length) {
            b.value = this.values(c);
            b.values = this.values()
        }
        return this._trigger("start", d, b)
    },_slide:function(d, c, b) {
        var e;
        if (this.options.values && this.options.values.length) {
            e = this.values(c ? 0 : 1);
            if (this.options.values.length === 2 && this.options.range === true && (c === 0 && b > e || c === 1 && b < e))b = e;
            if (b !== this.values(c)) {
                e = this.values();
                e[c] = b;
                d = this._trigger("slide", d, {handle:this.handles[c],value:b,values:e});
                this.values(c ? 0 : 1);
                d !== false && this.values(c, b, true)
            }
        } else if (b !== this.value()) {
            d = this._trigger("slide", d, {handle:this.handles[c],value:b});
            d !== false && this.value(b)
        }
    },_stop:function(d, c) {
        var b = {handle:this.handles[c],value:this.value()};
        if (this.options.values && this.options.values.length) {
            b.value = this.values(c);
            b.values = this.values()
        }
        this._trigger("stop", d, b)
    },_change:function(d, c) {
        if (!this._keySliding && !this._mouseSliding) {
            var b = {handle:this.handles[c],value:this.value()};
            if (this.options.values && this.options.values.length) {
                b.value = this.values(c);
                b.values = this.values()
            }
            this._trigger("change", d, b)
        }
    },value:function(d) {
        if (arguments.length) {
            this.options.value =
                    this._trimAlignValue(d);
            this._refreshValue();
            this._change(null, 0)
        } else return this._value()
    },values:function(d, c) {
        var b,e,f;
        if (arguments.length > 1) {
            this.options.values[d] = this._trimAlignValue(c);
            this._refreshValue();
            this._change(null, d)
        } else if (arguments.length)if (a.isArray(arguments[0])) {
            b = this.options.values;
            e = arguments[0];
            for (f = 0; f < b.length; f += 1) {
                b[f] = this._trimAlignValue(e[f]);
                this._change(null, f)
            }
            this._refreshValue()
        } else return this.options.values && this.options.values.length ? this._values(d) :
                this.value(); else return this._values()
    },_setOption:function(d, c) {
        var b,e = 0;
        if (a.isArray(this.options.values))e = this.options.values.length;
        a.Widget.prototype._setOption.apply(this, arguments);
        switch (d) {
            case "disabled":
                if (c) {
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
                for (b = 0; b < e; b += 1)this._change(null, b);
                this._animateOff = false;
                break
        }
    },_value:function() {
        var d = this.options.value;
        return d = this._trimAlignValue(d)
    },_values:function(d) {
        var c,b;
        if (arguments.length) {
            c = this.options.values[d];
            return c = this._trimAlignValue(c)
        } else {
            c = this.options.values.slice();
            for (b = 0; b < c.length; b += 1)c[b] = this._trimAlignValue(c[b]);
            return c
        }
    },_trimAlignValue:function(d) {
        if (d <= this._valueMin())return this._valueMin();
        if (d >= this._valueMax())return this._valueMax();
        var c = this.options.step > 0 ? this.options.step : 1,b = (d - this._valueMin()) % c;
        d = d - b;
        if (Math.abs(b) * 2 >= c)d += b > 0 ? c : -c;
        return parseFloat(d.toFixed(5))
    },_valueMin:function() {
        return this.options.min
    },_valueMax:function() {
        return this.options.max
    },_refreshValue:function() {
        var d =
                this.options.range,c = this.options,b = this,e = !this._animateOff ? c.animate : false,f,j = {},h,l,o,r;
        if (this.options.values && this.options.values.length)this.handles.each(function(u) {
            f = (b.values(u) - b._valueMin()) / (b._valueMax() - b._valueMin()) * 100;
            j[b.orientation === "horizontal" ? "left" : "bottom"] = f + "%";
            a(this).stop(1, 1)[e ? "animate" : "css"](j, c.animate);
            if (b.options.range === true)if (b.orientation === "horizontal") {
                if (u === 0)b.range.stop(1, 1)[e ? "animate" : "css"]({left:f + "%"}, c.animate);
                if (u === 1)b.range[e ? "animate" : "css"]({width:f -
                        h + "%"}, {queue:false,duration:c.animate})
            } else {
                if (u === 0)b.range.stop(1, 1)[e ? "animate" : "css"]({bottom:f + "%"}, c.animate);
                if (u === 1)b.range[e ? "animate" : "css"]({height:f - h + "%"}, {queue:false,duration:c.animate})
            }
            h = f
        }); else {
            l = this.value();
            o = this._valueMin();
            r = this._valueMax();
            f = r !== o ? (l - o) / (r - o) * 100 : 0;
            j[b.orientation === "horizontal" ? "left" : "bottom"] = f + "%";
            this.handle.stop(1, 1)[e ? "animate" : "css"](j, c.animate);
            if (d === "min" && this.orientation === "horizontal")this.range.stop(1, 1)[e ? "animate" : "css"]({width:f + "%"},
                    c.animate);
            if (d === "max" && this.orientation === "horizontal")this.range[e ? "animate" : "css"]({width:100 - f + "%"}, {queue:false,duration:c.animate});
            if (d === "min" && this.orientation === "vertical")this.range.stop(1, 1)[e ? "animate" : "css"]({height:f + "%"}, c.animate);
            if (d === "max" && this.orientation === "vertical")this.range[e ? "animate" : "css"]({height:100 - f + "%"}, {queue:false,duration:c.animate})
        }
    }});
    a.extend(a.ui.slider, {version:"1.8.16"})
})(jQuery);
(function(a, d) {
    function c() {
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
        this.regional[""] = {closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su",
            "Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:""};
        this._defaults = {showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:false,hideIfNoPrevNext:false,navigationAsDateFormat:false,gotoCurrent:false,changeMonth:false,changeYear:false,yearRange:"c-10:c+10",showOtherMonths:false,selectOtherMonths:false,showWeek:false,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",
            minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:true,showButtonPanel:false,autoSize:false,disabled:false};
        a.extend(this._defaults, this.regional[""]);
        this.dpDiv = b(a('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))
    }

    function b(h) {
        return h.bind("mouseout",
                function(l) {
                    l = a(l.target).closest("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a");
                    l.length && l.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")
                }).bind("mouseover", function(l) {
                    l = a(l.target).closest("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a");
                    if (!(a.datepicker._isDisabledDatepicker(j.inline ? h.parent()[0] : j.input[0]) || !l.length)) {
                        l.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
                        l.addClass("ui-state-hover");
                        l.hasClass("ui-datepicker-prev") && l.addClass("ui-datepicker-prev-hover");
                        l.hasClass("ui-datepicker-next") && l.addClass("ui-datepicker-next-hover")
                    }
                })
    }

    function e(h, l) {
        a.extend(h, l);
        for (var o in l)if (l[o] == null || l[o] == d)h[o] = l[o];
        return h
    }

    a.extend(a.ui, {datepicker:{version:"1.8.16"}});
    var f = (new Date).getTime(),j;
    a.extend(c.prototype, {markerClassName:"hasDatepicker",maxRows:4,log:function() {
        this.debug && console.log.apply("", arguments)
    },_widgetDatepicker:function() {
        return this.dpDiv
    },
        setDefaults:function(h) {
            e(this._defaults, h || {});
            return this
        },_attachDatepicker:function(h, l) {
            var o = null;
            for (var r in this._defaults) {
                var u = h.getAttribute("date:" + r);
                if (u) {
                    o = o || {};
                    try {
                        o[r] = eval(u)
                    } catch(C) {
                        o[r] = u
                    }
                }
            }
            r = h.nodeName.toLowerCase();
            u = r == "div" || r == "span";
            if (!h.id) {
                this.uuid += 1;
                h.id = "dp" + this.uuid
            }
            var F = this._newInst(a(h), u);
            F.settings = a.extend({}, l || {}, o || {});
            if (r == "input")this._connectDatepicker(h, F); else u && this._inlineDatepicker(h, F)
        },_newInst:function(h, l) {
            return{id:h[0].id.replace(/([^A-Za-z0-9_-])/g,
                    "\\\\$1"),input:h,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:l,dpDiv:!l ? this.dpDiv : b(a('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}
        },_connectDatepicker:function(h, l) {
            var o = a(h);
            l.append = a([]);
            l.trigger = a([]);
            if (!o.hasClass(this.markerClassName)) {
                this._attachments(o, l);
                o.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",
                        function(r, u, C) {
                            l.settings[u] = C
                        }).bind("getData.datepicker", function(r, u) {
                            return this._get(l, u)
                        });
                this._autoSize(l);
                a.data(h, "datepicker", l);
                l.settings.disabled && this._disableDatepicker(h)
            }
        },_attachments:function(h, l) {
            var o = this._get(l, "appendText"),r = this._get(l, "isRTL");
            l.append && l.append.remove();
            if (o) {
                l.append = a('<span class="' + this._appendClass + '">' + o + "</span>");
                h[r ? "before" : "after"](l.append)
            }
            h.unbind("focus", this._showDatepicker);
            l.trigger && l.trigger.remove();
            o = this._get(l, "showOn");
            if (o ==
                    "focus" || o == "both")h.focus(this._showDatepicker);
            if (o == "button" || o == "both") {
                o = this._get(l, "buttonText");
                var u = this._get(l, "buttonImage");
                l.trigger = a(this._get(l, "buttonImageOnly") ? a("<img/>").addClass(this._triggerClass).attr({src:u,alt:o,title:o}) : a('<button type="button"></button>').addClass(this._triggerClass).html(u == "" ? o : a("<img/>").attr({src:u,alt:o,title:o})));
                h[r ? "before" : "after"](l.trigger);
                l.trigger.click(function() {
                    a.datepicker._datepickerShowing && a.datepicker._lastInput == h[0] ? a.datepicker._hideDatepicker() :
                            a.datepicker._showDatepicker(h[0]);
                    return false
                })
            }
        },_autoSize:function(h) {
            if (this._get(h, "autoSize") && !h.inline) {
                var l = new Date(2009, 11, 20),o = this._get(h, "dateFormat");
                if (o.match(/[DM]/)) {
                    var r = function(u) {
                        for (var C = 0,F = 0,x = 0; x < u.length; x++)if (u[x].length > C) {
                            C = u[x].length;
                            F = x
                        }
                        return F
                    };
                    l.setMonth(r(this._get(h, o.match(/MM/) ? "monthNames" : "monthNamesShort")));
                    l.setDate(r(this._get(h, o.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - l.getDay())
                }
                h.input.attr("size", this._formatDate(h, l).length)
            }
        },_inlineDatepicker:function(h, l) {
            var o = a(h);
            if (!o.hasClass(this.markerClassName)) {
                o.addClass(this.markerClassName).append(l.dpDiv).bind("setData.datepicker",
                        function(r, u, C) {
                            l.settings[u] = C
                        }).bind("getData.datepicker", function(r, u) {
                            return this._get(l, u)
                        });
                a.data(h, "datepicker", l);
                this._setDate(l, this._getDefaultDate(l), true);
                this._updateDatepicker(l);
                this._updateAlternate(l);
                l.settings.disabled && this._disableDatepicker(h);
                l.dpDiv.css("display", "block")
            }
        },_dialogDatepicker:function(h, l, o, r, u) {
            h = this._dialogInst;
            if (!h) {
                this.uuid +=
                        1;
                this._dialogInput = a('<input type="text" id="' + ("dp" + this.uuid) + '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
                this._dialogInput.keydown(this._doKeyDown);
                a("body").append(this._dialogInput);
                h = this._dialogInst = this._newInst(this._dialogInput, false);
                h.settings = {};
                a.data(this._dialogInput[0], "datepicker", h)
            }
            e(h.settings, r || {});
            l = l && l.constructor == Date ? this._formatDate(h, l) : l;
            this._dialogInput.val(l);
            this._pos = u ? u.length ? u : [u.pageX,u.pageY] : null;
            if (!this._pos)this._pos = [document.documentElement.clientWidth /
                    2 - 100 + (document.documentElement.scrollLeft || document.body.scrollLeft),document.documentElement.clientHeight / 2 - 150 + (document.documentElement.scrollTop || document.body.scrollTop)];
            this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px");
            h.settings.onSelect = o;
            this._inDialog = true;
            this.dpDiv.addClass(this._dialogClass);
            this._showDatepicker(this._dialogInput[0]);
            a.blockUI && a.blockUI(this.dpDiv);
            a.data(this._dialogInput[0], "datepicker", h);
            return this
        },_destroyDatepicker:function(h) {
            var l =
                    a(h),o = a.data(h, "datepicker");
            if (l.hasClass(this.markerClassName)) {
                var r = h.nodeName.toLowerCase();
                a.removeData(h, "datepicker");
                if (r == "input") {
                    o.append.remove();
                    o.trigger.remove();
                    l.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)
                } else if (r == "div" || r == "span")l.removeClass(this.markerClassName).empty()
            }
        },_enableDatepicker:function(h) {
            var l = a(h),o = a.data(h, "datepicker");
            if (l.hasClass(this.markerClassName)) {
                var r =
                        h.nodeName.toLowerCase();
                if (r == "input") {
                    h.disabled = false;
                    o.trigger.filter("button").each(
                            function() {
                                this.disabled = false
                            }).end().filter("img").css({opacity:"1.0",cursor:""})
                } else if (r == "div" || r == "span") {
                    l = l.children("." + this._inlineClass);
                    l.children().removeClass("ui-state-disabled");
                    l.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")
                }
                this._disabledInputs = a.map(this._disabledInputs, function(u) {
                    return u == h ? null : u
                })
            }
        },_disableDatepicker:function(h) {
            var l = a(h),o = a.data(h,
                    "datepicker");
            if (l.hasClass(this.markerClassName)) {
                var r = h.nodeName.toLowerCase();
                if (r == "input") {
                    h.disabled = true;
                    o.trigger.filter("button").each(
                            function() {
                                this.disabled = true
                            }).end().filter("img").css({opacity:"0.5",cursor:"default"})
                } else if (r == "div" || r == "span") {
                    l = l.children("." + this._inlineClass);
                    l.children().addClass("ui-state-disabled");
                    l.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled", "disabled")
                }
                this._disabledInputs = a.map(this._disabledInputs, function(u) {
                    return u ==
                            h ? null : u
                });
                this._disabledInputs[this._disabledInputs.length] = h
            }
        },_isDisabledDatepicker:function(h) {
            if (!h)return false;
            for (var l = 0; l < this._disabledInputs.length; l++)if (this._disabledInputs[l] == h)return true;
            return false
        },_getInst:function(h) {
            try {
                return a.data(h, "datepicker")
            } catch(l) {
                throw"Missing instance data for this datepicker";
            }
        },_optionDatepicker:function(h, l, o) {
            var r = this._getInst(h);
            if (arguments.length == 2 && typeof l == "string")return l == "defaults" ? a.extend({}, a.datepicker._defaults) : r ? l == "all" ?
                    a.extend({}, r.settings) : this._get(r, l) : null;
            var u = l || {};
            if (typeof l == "string") {
                u = {};
                u[l] = o
            }
            if (r) {
                this._curInst == r && this._hideDatepicker();
                var C = this._getDateDatepicker(h, true),F = this._getMinMaxDate(r, "min"),x = this._getMinMaxDate(r, "max");
                e(r.settings, u);
                if (F !== null && u.dateFormat !== d && u.minDate === d)r.settings.minDate = this._formatDate(r, F);
                if (x !== null && u.dateFormat !== d && u.maxDate === d)r.settings.maxDate = this._formatDate(r, x);
                this._attachments(a(h), r);
                this._autoSize(r);
                this._setDate(r, C);
                this._updateAlternate(r);
                this._updateDatepicker(r)
            }
        },_changeDatepicker:function(h, l, o) {
            this._optionDatepicker(h, l, o)
        },_refreshDatepicker:function(h) {
            (h = this._getInst(h)) && this._updateDatepicker(h)
        },_setDateDatepicker:function(h, l) {
            var o = this._getInst(h);
            if (o) {
                this._setDate(o, l);
                this._updateDatepicker(o);
                this._updateAlternate(o)
            }
        },_getDateDatepicker:function(h, l) {
            var o = this._getInst(h);
            o && !o.inline && this._setDateFromField(o, l);
            return o ? this._getDate(o) : null
        },_doKeyDown:function(h) {
            var l = a.datepicker._getInst(h.target),o = true,
                    r = l.dpDiv.is(".ui-datepicker-rtl");
            l._keyEvent = true;
            if (a.datepicker._datepickerShowing)switch (h.keyCode) {
                case 9:
                    a.datepicker._hideDatepicker();
                    o = false;
                    break;
                case 13:
                    o = a("td." + a.datepicker._dayOverClass + ":not(." + a.datepicker._currentClass + ")", l.dpDiv);
                    o[0] && a.datepicker._selectDay(h.target, l.selectedMonth, l.selectedYear, o[0]);
                    if (h = a.datepicker._get(l, "onSelect")) {
                        o = a.datepicker._formatDate(l);
                        h.apply(l.input ? l.input[0] : null, [o,l])
                    } else a.datepicker._hideDatepicker();
                    return false;
                case 27:
                    a.datepicker._hideDatepicker();
                    break;
                case 33:
                    a.datepicker._adjustDate(h.target, h.ctrlKey ? -a.datepicker._get(l, "stepBigMonths") : -a.datepicker._get(l, "stepMonths"), "M");
                    break;
                case 34:
                    a.datepicker._adjustDate(h.target, h.ctrlKey ? +a.datepicker._get(l, "stepBigMonths") : +a.datepicker._get(l, "stepMonths"), "M");
                    break;
                case 35:
                    if (h.ctrlKey || h.metaKey)a.datepicker._clearDate(h.target);
                    o = h.ctrlKey || h.metaKey;
                    break;
                case 36:
                    if (h.ctrlKey || h.metaKey)a.datepicker._gotoToday(h.target);
                    o = h.ctrlKey || h.metaKey;
                    break;
                case 37:
                    if (h.ctrlKey || h.metaKey)a.datepicker._adjustDate(h.target,
                            r ? +1 : -1, "D");
                    o = h.ctrlKey || h.metaKey;
                    if (h.originalEvent.altKey)a.datepicker._adjustDate(h.target, h.ctrlKey ? -a.datepicker._get(l, "stepBigMonths") : -a.datepicker._get(l, "stepMonths"), "M");
                    break;
                case 38:
                    if (h.ctrlKey || h.metaKey)a.datepicker._adjustDate(h.target, -7, "D");
                    o = h.ctrlKey || h.metaKey;
                    break;
                case 39:
                    if (h.ctrlKey || h.metaKey)a.datepicker._adjustDate(h.target, r ? -1 : +1, "D");
                    o = h.ctrlKey || h.metaKey;
                    if (h.originalEvent.altKey)a.datepicker._adjustDate(h.target, h.ctrlKey ? +a.datepicker._get(l, "stepBigMonths") :
                            +a.datepicker._get(l, "stepMonths"), "M");
                    break;
                case 40:
                    if (h.ctrlKey || h.metaKey)a.datepicker._adjustDate(h.target, +7, "D");
                    o = h.ctrlKey || h.metaKey;
                    break;
                default:
                    o = false
            } else if (h.keyCode == 36 && h.ctrlKey)a.datepicker._showDatepicker(this); else o = false;
            if (o) {
                h.preventDefault();
                h.stopPropagation()
            }
        },_doKeyPress:function(h) {
            var l = a.datepicker._getInst(h.target);
            if (a.datepicker._get(l, "constrainInput")) {
                l = a.datepicker._possibleChars(a.datepicker._get(l, "dateFormat"));
                var o = String.fromCharCode(h.charCode == d ?
                        h.keyCode : h.charCode);
                return h.ctrlKey || h.metaKey || o < " " || !l || l.indexOf(o) > -1
            }
        },_doKeyUp:function(h) {
            h = a.datepicker._getInst(h.target);
            if (h.input.val() != h.lastVal)try {
                if (a.datepicker.parseDate(a.datepicker._get(h, "dateFormat"), h.input ? h.input.val() : null, a.datepicker._getFormatConfig(h))) {
                    a.datepicker._setDateFromField(h);
                    a.datepicker._updateAlternate(h);
                    a.datepicker._updateDatepicker(h)
                }
            } catch(l) {
                a.datepicker.log(l)
            }
            return true
        },_showDatepicker:function(h) {
            h = h.target || h;
            if (h.nodeName.toLowerCase() !=
                    "input")h = a("input", h.parentNode)[0];
            if (!(a.datepicker._isDisabledDatepicker(h) || a.datepicker._lastInput == h)) {
                var l = a.datepicker._getInst(h);
                if (a.datepicker._curInst && a.datepicker._curInst != l) {
                    a.datepicker._datepickerShowing && a.datepicker._triggerOnClose(a.datepicker._curInst);
                    a.datepicker._curInst.dpDiv.stop(true, true)
                }
                var o = a.datepicker._get(l, "beforeShow");
                o = o ? o.apply(h, [h,l]) : {};
                if (o !== false) {
                    e(l.settings, o);
                    l.lastVal = null;
                    a.datepicker._lastInput = h;
                    a.datepicker._setDateFromField(l);
                    if (a.datepicker._inDialog)h.value =
                            "";
                    if (!a.datepicker._pos) {
                        a.datepicker._pos = a.datepicker._findPos(h);
                        a.datepicker._pos[1] += h.offsetHeight
                    }
                    var r = false;
                    a(h).parents().each(function() {
                        r |= a(this).css("position") == "fixed";
                        return!r
                    });
                    if (r && a.browser.opera) {
                        a.datepicker._pos[0] -= document.documentElement.scrollLeft;
                        a.datepicker._pos[1] -= document.documentElement.scrollTop
                    }
                    o = {left:a.datepicker._pos[0],top:a.datepicker._pos[1]};
                    a.datepicker._pos = null;
                    l.dpDiv.empty();
                    l.dpDiv.css({position:"absolute",display:"block",top:"-1000px"});
                    a.datepicker._updateDatepicker(l);
                    o = a.datepicker._checkOffset(l, o, r);
                    l.dpDiv.css({position:a.datepicker._inDialog && a.blockUI ? "static" : r ? "fixed" : "absolute",display:"none",left:o.left + "px",top:o.top + "px"});
                    if (!l.inline) {
                        o = a.datepicker._get(l, "showAnim");
                        var u = a.datepicker._get(l, "duration"),C = function() {
                            var F = l.dpDiv.find("iframe.ui-datepicker-cover");
                            if (F.length) {
                                var x = a.datepicker._getBorders(l.dpDiv);
                                F.css({left:-x[0],top:-x[1],width:l.dpDiv.outerWidth(),height:l.dpDiv.outerHeight()})
                            }
                        };
                        l.dpDiv.zIndex(a(h).zIndex() + 1);
                        a.datepicker._datepickerShowing =
                                true;
                        a.effects && a.effects[o] ? l.dpDiv.show(o, a.datepicker._get(l, "showOptions"), u, C) : l.dpDiv[o || "show"](o ? u : null, C);
                        if (!o || !u)C();
                        l.input.is(":visible") && !l.input.is(":disabled") && l.input.focus();
                        a.datepicker._curInst = l
                    }
                }
            }
        },_updateDatepicker:function(h) {
            this.maxRows = 4;
            var l = a.datepicker._getBorders(h.dpDiv);
            j = h;
            h.dpDiv.empty().append(this._generateHTML(h));
            var o = h.dpDiv.find("iframe.ui-datepicker-cover");
            o.length && o.css({left:-l[0],top:-l[1],width:h.dpDiv.outerWidth(),height:h.dpDiv.outerHeight()});
            h.dpDiv.find("." + this._dayOverClass + " a").mouseover();
            l = this._getNumberOfMonths(h);
            o = l[1];
            h.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
            o > 1 && h.dpDiv.addClass("ui-datepicker-multi-" + o).css("width", 17 * o + "em");
            h.dpDiv[(l[0] != 1 || l[1] != 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi");
            h.dpDiv[(this._get(h, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
            h == a.datepicker._curInst && a.datepicker._datepickerShowing && h.input && h.input.is(":visible") &&
                    !h.input.is(":disabled") && h.input[0] != document.activeElement && h.input.focus();
            if (h.yearshtml) {
                var r = h.yearshtml;
                setTimeout(function() {
                    r === h.yearshtml && h.yearshtml && h.dpDiv.find("select.ui-datepicker-year:first").replaceWith(h.yearshtml);
                    r = h.yearshtml = null
                }, 0)
            }
        },_getBorders:function(h) {
            var l = function(o) {
                return{thin:1,medium:2,thick:3}[o] || o
            };
            return[parseFloat(l(h.css("border-left-width"))),parseFloat(l(h.css("border-top-width")))]
        },_checkOffset:function(h, l, o) {
            var r = h.dpDiv.outerWidth(),u = h.dpDiv.outerHeight(),
                    C = h.input ? h.input.outerWidth() : 0,F = h.input ? h.input.outerHeight() : 0,x = document.documentElement.clientWidth + a(document).scrollLeft(),I = document.documentElement.clientHeight + a(document).scrollTop();
            l.left -= this._get(h, "isRTL") ? r - C : 0;
            l.left -= o && l.left == h.input.offset().left ? a(document).scrollLeft() : 0;
            l.top -= o && l.top == h.input.offset().top + F ? a(document).scrollTop() : 0;
            l.left -= Math.min(l.left, l.left + r > x && x > r ? Math.abs(l.left + r - x) : 0);
            l.top -= Math.min(l.top, l.top + u > I && I > u ? Math.abs(u + F) : 0);
            return l
        },_findPos:function(h) {
            for (var l =
                    this._get(this._getInst(h), "isRTL"); h && (h.type == "hidden" || h.nodeType != 1 || a.expr.filters.hidden(h));)h = h[l ? "previousSibling" : "nextSibling"];
            h = a(h).offset();
            return[h.left,h.top]
        },_triggerOnClose:function(h) {
            var l = this._get(h, "onClose");
            if (l)l.apply(h.input ? h.input[0] : null, [h.input ? h.input.val() : "",h])
        },_hideDatepicker:function(h) {
            var l = this._curInst;
            if (!(!l || h && l != a.data(h, "datepicker")))if (this._datepickerShowing) {
                h = this._get(l, "showAnim");
                var o = this._get(l, "duration"),r = function() {
                    a.datepicker._tidyDialog(l);
                    this._curInst = null
                };
                a.effects && a.effects[h] ? l.dpDiv.hide(h, a.datepicker._get(l, "showOptions"), o, r) : l.dpDiv[h == "slideDown" ? "slideUp" : h == "fadeIn" ? "fadeOut" : "hide"](h ? o : null, r);
                h || r();
                a.datepicker._triggerOnClose(l);
                this._datepickerShowing = false;
                this._lastInput = null;
                if (this._inDialog) {
                    this._dialogInput.css({position:"absolute",left:"0",top:"-100px"});
                    if (a.blockUI) {
                        a.unblockUI();
                        a("body").append(this.dpDiv)
                    }
                }
                this._inDialog = false
            }
        },_tidyDialog:function(h) {
            h.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick:function(h) {
            if (a.datepicker._curInst) {
                h = a(h.target);
                h[0].id != a.datepicker._mainDivId && h.parents("#" + a.datepicker._mainDivId).length == 0 && !h.hasClass(a.datepicker.markerClassName) && !h.hasClass(a.datepicker._triggerClass) && a.datepicker._datepickerShowing && !(a.datepicker._inDialog && a.blockUI) && a.datepicker._hideDatepicker()
            }
        },_adjustDate:function(h, l, o) {
            h = a(h);
            var r = this._getInst(h[0]);
            if (!this._isDisabledDatepicker(h[0])) {
                this._adjustInstDate(r, l + (o == "M" ? this._get(r, "showCurrentAtPos") :
                        0), o);
                this._updateDatepicker(r)
            }
        },_gotoToday:function(h) {
            h = a(h);
            var l = this._getInst(h[0]);
            if (this._get(l, "gotoCurrent") && l.currentDay) {
                l.selectedDay = l.currentDay;
                l.drawMonth = l.selectedMonth = l.currentMonth;
                l.drawYear = l.selectedYear = l.currentYear
            } else {
                var o = new Date;
                l.selectedDay = o.getDate();
                l.drawMonth = l.selectedMonth = o.getMonth();
                l.drawYear = l.selectedYear = o.getFullYear()
            }
            this._notifyChange(l);
            this._adjustDate(h)
        },_selectMonthYear:function(h, l, o) {
            h = a(h);
            var r = this._getInst(h[0]);
            r["selected" + (o == "M" ?
                    "Month" : "Year")] = r["draw" + (o == "M" ? "Month" : "Year")] = parseInt(l.options[l.selectedIndex].value, 10);
            this._notifyChange(r);
            this._adjustDate(h)
        },_selectDay:function(h, l, o, r) {
            var u = a(h);
            if (!(a(r).hasClass(this._unselectableClass) || this._isDisabledDatepicker(u[0]))) {
                u = this._getInst(u[0]);
                u.selectedDay = u.currentDay = a("a", r).html();
                u.selectedMonth = u.currentMonth = l;
                u.selectedYear = u.currentYear = o;
                this._selectDate(h, this._formatDate(u, u.currentDay, u.currentMonth, u.currentYear))
            }
        },_clearDate:function(h) {
            h = a(h);
            this._getInst(h[0]);
            this._selectDate(h, "")
        },_selectDate:function(h, l) {
            var o = this._getInst(a(h)[0]);
            l = l != null ? l : this._formatDate(o);
            o.input && o.input.val(l);
            this._updateAlternate(o);
            var r = this._get(o, "onSelect");
            if (r)r.apply(o.input ? o.input[0] : null, [l,o]); else o.input && o.input.trigger("change");
            if (o.inline)this._updateDatepicker(o); else {
                this._hideDatepicker();
                this._lastInput = o.input[0];
                typeof o.input[0] != "object" && o.input.focus();
                this._lastInput = null
            }
        },_updateAlternate:function(h) {
            var l = this._get(h,
                    "altField");
            if (l) {
                var o = this._get(h, "altFormat") || this._get(h, "dateFormat"),r = this._getDate(h),u = this.formatDate(o, r, this._getFormatConfig(h));
                a(l).each(function() {
                    a(this).val(u)
                })
            }
        },noWeekends:function(h) {
            h = h.getDay();
            return[h > 0 && h < 6,""]
        },iso8601Week:function(h) {
            h = new Date(h.getTime());
            h.setDate(h.getDate() + 4 - (h.getDay() || 7));
            var l = h.getTime();
            h.setMonth(0);
            h.setDate(1);
            return Math.floor(Math.round((l - h) / 864E5) / 7) + 1
        },parseDate:function(h, l, o) {
            if (h == null || l == null)throw"Invalid arguments";
            l = typeof l ==
                    "object" ? l.toString() : l + "";
            if (l == "")return null;
            var r = (o ? o.shortYearCutoff : null) || this._defaults.shortYearCutoff;
            r = typeof r != "string" ? r : (new Date).getFullYear() % 100 + parseInt(r, 10);
            for (var u = (o ? o.dayNamesShort : null) || this._defaults.dayNamesShort,C = (o ? o.dayNames : null) || this._defaults.dayNames,F = (o ? o.monthNamesShort : null) || this._defaults.monthNamesShort,x = (o ? o.monthNames : null) || this._defaults.monthNames,I = o = -1,G = -1,H = -1,A = false,N = function(qa) {
                (qa = fa + 1 < h.length && h.charAt(fa + 1) == qa) && fa++;
                return qa
            },ba =
                    function(qa) {
                        var aa = N(qa);
                        qa = RegExp("^\\d{1," + (qa == "@" ? 14 : qa == "!" ? 20 : qa == "y" && aa ? 4 : qa == "o" ? 3 : 2) + "}");
                        qa = l.substring(ka).match(qa);
                        if (!qa)throw"Missing number at position " + ka;
                        ka += qa[0].length;
                        return parseInt(qa[0], 10)
                    },K = function(qa, aa, ca) {
                qa = a.map(N(qa) ? ca : aa,
                        function(m, U) {
                            return[
                                [U,m]
                            ]
                        }).sort(function(m, U) {
                            return-(m[1].length - U[1].length)
                        });
                var ea = -1;
                a.each(qa, function(m, U) {
                    var sa = U[1];
                    if (l.substr(ka, sa.length).toLowerCase() == sa.toLowerCase()) {
                        ea = U[0];
                        ka += sa.length;
                        return false
                    }
                });
                if (ea != -1)return ea +
                        1; else throw"Unknown name at position " + ka;
            },W = function() {
                if (l.charAt(ka) != h.charAt(fa))throw"Unexpected literal at position " + ka;
                ka++
            },ka = 0,fa = 0; fa < h.length; fa++)if (A)if (h.charAt(fa) == "'" && !N("'"))A = false; else W(); else switch (h.charAt(fa)) {
                case "d":
                    G = ba("d");
                    break;
                case "D":
                    K("D", u, C);
                    break;
                case "o":
                    H = ba("o");
                    break;
                case "m":
                    I = ba("m");
                    break;
                case "M":
                    I = K("M", F, x);
                    break;
                case "y":
                    o = ba("y");
                    break;
                case "@":
                    var ha = new Date(ba("@"));
                    o = ha.getFullYear();
                    I = ha.getMonth() + 1;
                    G = ha.getDate();
                    break;
                case "!":
                    ha = new Date((ba("!") -
                            this._ticksTo1970) / 1E4);
                    o = ha.getFullYear();
                    I = ha.getMonth() + 1;
                    G = ha.getDate();
                    break;
                case "'":
                    if (N("'"))W(); else A = true;
                    break;
                default:
                    W()
            }
            if (ka < l.length)throw"Extra/unparsed characters found in date: " + l.substring(ka);
            if (o == -1)o = (new Date).getFullYear(); else if (o < 100)o += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (o <= r ? 0 : -100);
            if (H > -1) {
                I = 1;
                G = H;
                do{
                    r = this._getDaysInMonth(o, I - 1);
                    if (G <= r)break;
                    I++;
                    G -= r
                } while (1)
            }
            ha = this._daylightSavingAdjust(new Date(o, I - 1, G));
            if (ha.getFullYear() != o || ha.getMonth() +
                    1 != I || ha.getDate() != G)throw"Invalid date";
            return ha
        },ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 24 * 60 * 60 * 1E7,formatDate:function(h, l, o) {
            if (!l)return"";
            var r = (o ? o.dayNamesShort : null) || this._defaults.dayNamesShort,u = (o ? o.dayNames : null) || this._defaults.dayNames,
                    C = (o ? o.monthNamesShort : null) || this._defaults.monthNamesShort;
            o = (o ? o.monthNames : null) || this._defaults.monthNames;
            var F = function(N) {
                (N = A + 1 < h.length && h.charAt(A + 1) == N) && A++;
                return N
            },x = function(N, ba, K) {
                ba = "" + ba;
                if (F(N))for (; ba.length < K;)ba = "0" + ba;
                return ba
            },I = function(N, ba, K, W) {
                return F(N) ? W[ba] : K[ba]
            },G = "",H = false;
            if (l)for (var A = 0; A < h.length; A++)if (H)if (h.charAt(A) == "'" && !F("'"))H = false; else G += h.charAt(A); else switch (h.charAt(A)) {
                case "d":
                    G += x("d", l.getDate(), 2);
                    break;
                case "D":
                    G += I("D", l.getDay(),
                            r, u);
                    break;
                case "o":
                    G += x("o", Math.round(((new Date(l.getFullYear(), l.getMonth(), l.getDate())).getTime() - (new Date(l.getFullYear(), 0, 0)).getTime()) / 864E5), 3);
                    break;
                case "m":
                    G += x("m", l.getMonth() + 1, 2);
                    break;
                case "M":
                    G += I("M", l.getMonth(), C, o);
                    break;
                case "y":
                    G += F("y") ? l.getFullYear() : (l.getYear() % 100 < 10 ? "0" : "") + l.getYear() % 100;
                    break;
                case "@":
                    G += l.getTime();
                    break;
                case "!":
                    G += l.getTime() * 1E4 + this._ticksTo1970;
                    break;
                case "'":
                    if (F("'"))G += "'"; else H = true;
                    break;
                default:
                    G += h.charAt(A)
            }
            return G
        },_possibleChars:function(h) {
            for (var l =
                    "",o = false,r = function(C) {
                (C = u + 1 < h.length && h.charAt(u + 1) == C) && u++;
                return C
            },u = 0; u < h.length; u++)if (o)if (h.charAt(u) == "'" && !r("'"))o = false; else l += h.charAt(u); else switch (h.charAt(u)) {
                case "d":
                case "m":
                case "y":
                case "@":
                    l += "0123456789";
                    break;
                case "D":
                case "M":
                    return null;
                case "'":
                    if (r("'"))l += "'"; else o = true;
                    break;
                default:
                    l += h.charAt(u)
            }
            return l
        },_get:function(h, l) {
            return h.settings[l] !== d ? h.settings[l] : this._defaults[l]
        },_setDateFromField:function(h, l) {
            if (h.input.val() != h.lastVal) {
                var o = this._get(h,
                        "dateFormat"),r = h.lastVal = h.input ? h.input.val() : null,u,C;
                u = C = this._getDefaultDate(h);
                var F = this._getFormatConfig(h);
                try {
                    u = this.parseDate(o, r, F) || C
                } catch(x) {
                    this.log(x);
                    r = l ? "" : r
                }
                h.selectedDay = u.getDate();
                h.drawMonth = h.selectedMonth = u.getMonth();
                h.drawYear = h.selectedYear = u.getFullYear();
                h.currentDay = r ? u.getDate() : 0;
                h.currentMonth = r ? u.getMonth() : 0;
                h.currentYear = r ? u.getFullYear() : 0;
                this._adjustInstDate(h)
            }
        },_getDefaultDate:function(h) {
            return this._restrictMinMax(h, this._determineDate(h, this._get(h, "defaultDate"),
                    new Date))
        },_determineDate:function(h, l, o) {
            var r = function(C) {
                var F = new Date;
                F.setDate(F.getDate() + C);
                return F
            },u = function(C) {
                try {
                    return a.datepicker.parseDate(a.datepicker._get(h, "dateFormat"), C, a.datepicker._getFormatConfig(h))
                } catch(F) {
                }
                var x = (C.toLowerCase().match(/^c/) ? a.datepicker._getDate(h) : null) || new Date,I = x.getFullYear(),G = x.getMonth();
                x = x.getDate();
                for (var H = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,A = H.exec(C); A;) {
                    switch (A[2] || "d") {
                        case "d":
                        case "D":
                            x += parseInt(A[1], 10);
                            break;
                        case "w":
                        case "W":
                            x +=
                                    parseInt(A[1], 10) * 7;
                            break;
                        case "m":
                        case "M":
                            G += parseInt(A[1], 10);
                            x = Math.min(x, a.datepicker._getDaysInMonth(I, G));
                            break;
                        case "y":
                        case "Y":
                            I += parseInt(A[1], 10);
                            x = Math.min(x, a.datepicker._getDaysInMonth(I, G));
                            break
                    }
                    A = H.exec(C)
                }
                return new Date(I, G, x)
            };
            if (l = (l = l == null || l === "" ? o : typeof l == "string" ? u(l) : typeof l == "number" ? isNaN(l) ? o : r(l) : new Date(l.getTime())) && l.toString() == "Invalid Date" ? o : l) {
                l.setHours(0);
                l.setMinutes(0);
                l.setSeconds(0);
                l.setMilliseconds(0)
            }
            return this._daylightSavingAdjust(l)
        },_daylightSavingAdjust:function(h) {
            if (!h)return null;
            h.setHours(h.getHours() > 12 ? h.getHours() + 2 : 0);
            return h
        },_setDate:function(h, l, o) {
            var r = !l,u = h.selectedMonth,C = h.selectedYear;
            l = this._restrictMinMax(h, this._determineDate(h, l, new Date));
            h.selectedDay = h.currentDay = l.getDate();
            h.drawMonth = h.selectedMonth = h.currentMonth = l.getMonth();
            h.drawYear = h.selectedYear = h.currentYear = l.getFullYear();
            if ((u != h.selectedMonth || C != h.selectedYear) && !o)this._notifyChange(h);
            this._adjustInstDate(h);
            if (h.input)h.input.val(r ? "" : this._formatDate(h))
        },_getDate:function(h) {
            return!h.currentYear ||
                    h.input && h.input.val() == "" ? null : this._daylightSavingAdjust(new Date(h.currentYear, h.currentMonth, h.currentDay))
        },_generateHTML:function(h) {
            var l = new Date;
            l = this._daylightSavingAdjust(new Date(l.getFullYear(), l.getMonth(), l.getDate()));
            var o = this._get(h, "isRTL"),r = this._get(h, "showButtonPanel"),u = this._get(h, "hideIfNoPrevNext"),C = this._get(h, "navigationAsDateFormat"),F = this._getNumberOfMonths(h),x = this._get(h, "showCurrentAtPos"),I = this._get(h, "stepMonths"),G = F[0] != 1 || F[1] != 1,H = this._daylightSavingAdjust(!h.currentDay ?
                    new Date(9999, 9, 9) : new Date(h.currentYear, h.currentMonth, h.currentDay)),A = this._getMinMaxDate(h, "min"),N = this._getMinMaxDate(h, "max");
            x = h.drawMonth - x;
            var ba = h.drawYear;
            if (x < 0) {
                x += 12;
                ba--
            }
            if (N) {
                var K = this._daylightSavingAdjust(new Date(N.getFullYear(), N.getMonth() - F[0] * F[1] + 1, N.getDate()));
                for (K = A && K < A ? A : K; this._daylightSavingAdjust(new Date(ba, x, 1)) > K;) {
                    x--;
                    if (x < 0) {
                        x = 11;
                        ba--
                    }
                }
            }
            h.drawMonth = x;
            h.drawYear = ba;
            K = this._get(h, "prevText");
            K = !C ? K : this.formatDate(K, this._daylightSavingAdjust(new Date(ba, x - I,
                    1)), this._getFormatConfig(h));
            K = this._canAdjustMonth(h, -1, ba, x) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + f + ".datepicker._adjustDate('#" + h.id + "', -" + I + ", 'M');\" title=\"" + K + '"><span class="ui-icon ui-icon-circle-triangle-' + (o ? "e" : "w") + '">' + K + "</span></a>" : u ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + K + '"><span class="ui-icon ui-icon-circle-triangle-' + (o ? "e" : "w") + '">' + K + "</span></a>";
            var W = this._get(h, "nextText");
            W = !C ? W : this.formatDate(W, this._daylightSavingAdjust(new Date(ba,
                    x + I, 1)), this._getFormatConfig(h));
            u = this._canAdjustMonth(h, +1, ba, x) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + f + ".datepicker._adjustDate('#" + h.id + "', +" + I + ", 'M');\" title=\"" + W + '"><span class="ui-icon ui-icon-circle-triangle-' + (o ? "w" : "e") + '">' + W + "</span></a>" : u ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + W + '"><span class="ui-icon ui-icon-circle-triangle-' + (o ? "w" : "e") + '">' + W + "</span></a>";
            I = this._get(h, "currentText");
            W = this._get(h, "gotoCurrent") &&
                    h.currentDay ? H : l;
            I = !C ? I : this.formatDate(I, W, this._getFormatConfig(h));
            C = !h.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + f + '.datepicker._hideDatepicker();">' + this._get(h, "closeText") + "</button>" : "";
            r = r ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (o ? C : "") + (this._isInRange(h, W) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' +
                    f + ".datepicker._gotoToday('#" + h.id + "');\">" + I + "</button>" : "") + (o ? "" : C) + "</div>" : "";
            C = parseInt(this._get(h, "firstDay"), 10);
            C = isNaN(C) ? 0 : C;
            I = this._get(h, "showWeek");
            W = this._get(h, "dayNames");
            this._get(h, "dayNamesShort");
            var ka = this._get(h, "dayNamesMin"),fa = this._get(h, "monthNames"),ha = this._get(h, "monthNamesShort"),qa = this._get(h, "beforeShowDay"),aa = this._get(h, "showOtherMonths"),ca = this._get(h, "selectOtherMonths");
            this._get(h, "calculateWeek");
            for (var ea = this._getDefaultDate(h),m = "",U = 0; U < F[0]; U++) {
                var sa =
                        "";
                this.maxRows = 4;
                for (var ya = 0; ya < F[1]; ya++) {
                    var Da = this._daylightSavingAdjust(new Date(ba, x, h.selectedDay)),Ba = " ui-corner-all",y = "";
                    if (G) {
                        y += '<div class="ui-datepicker-group';
                        if (F[1] > 1)switch (ya) {
                            case 0:
                                y += " ui-datepicker-group-first";
                                Ba = " ui-corner-" + (o ? "right" : "left");
                                break;
                            case F[1] - 1:
                                y += " ui-datepicker-group-last";
                                Ba = " ui-corner-" + (o ? "left" : "right");
                                break;
                            default:
                                y += " ui-datepicker-group-middle";
                                Ba = "";
                                break
                        }
                        y += '">'
                    }
                    y += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + Ba +
                            '">' + (/all|left/.test(Ba) && U == 0 ? o ? u : K : "") + (/all|right/.test(Ba) && U == 0 ? o ? K : u : "") + this._generateMonthYearHeader(h, x, ba, A, N, U > 0 || ya > 0, fa, ha) + '</div><table class="ui-datepicker-calendar"><thead><tr>';
                    var Q = I ? '<th class="ui-datepicker-week-col">' + this._get(h, "weekHeader") + "</th>" : "";
                    for (Ba = 0; Ba < 7; Ba++) {
                        var ua = (Ba + C) % 7;
                        Q += "<th" + ((Ba + C + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + '><span title="' + W[ua] + '">' + ka[ua] + "</span></th>"
                    }
                    y += Q + "</tr></thead><tbody>";
                    Q = this._getDaysInMonth(ba, x);
                    if (ba == h.selectedYear &&
                            x == h.selectedMonth)h.selectedDay = Math.min(h.selectedDay, Q);
                    Ba = (this._getFirstDayOfMonth(ba, x) - C + 7) % 7;
                    Q = Math.ceil((Ba + Q) / 7);
                    this.maxRows = Q = G ? this.maxRows > Q ? this.maxRows : Q : Q;
                    ua = this._daylightSavingAdjust(new Date(ba, x, 1 - Ba));
                    for (var oa = 0; oa < Q; oa++) {
                        y += "<tr>";
                        var O = !I ? "" : '<td class="ui-datepicker-week-col">' + this._get(h, "calculateWeek")(ua) + "</td>";
                        for (Ba = 0; Ba < 7; Ba++) {
                            var Z = qa ? qa.apply(h.input ? h.input[0] : null, [ua]) : [true,""],la = ua.getMonth() != x,va = la && !ca || !Z[0] || A && ua < A || N && ua > N;
                            O += '<td class="' + ((Ba +
                                    C + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (la ? " ui-datepicker-other-month" : "") + (ua.getTime() == Da.getTime() && x == h.selectedMonth && h._keyEvent || ea.getTime() == ua.getTime() && ea.getTime() == Da.getTime() ? " " + this._dayOverClass : "") + (va ? " " + this._unselectableClass + " ui-state-disabled" : "") + (la && !aa ? "" : " " + Z[1] + (ua.getTime() == H.getTime() ? " " + this._currentClass : "") + (ua.getTime() == l.getTime() ? " ui-datepicker-today" : "")) + '"' + ((!la || aa) && Z[2] ? ' title="' + Z[2] + '"' : "") + (va ? "" : ' onclick="DP_jQuery_' + f + ".datepicker._selectDay('#" +
                                    h.id + "'," + ua.getMonth() + "," + ua.getFullYear() + ', this);return false;"') + ">" + (la && !aa ? "&#xa0;" : va ? '<span class="ui-state-default">' + ua.getDate() + "</span>" : '<a class="ui-state-default' + (ua.getTime() == l.getTime() ? " ui-state-highlight" : "") + (ua.getTime() == H.getTime() ? " ui-state-active" : "") + (la ? " ui-priority-secondary" : "") + '" href="#">' + ua.getDate() + "</a>") + "</td>";
                            ua.setDate(ua.getDate() + 1);
                            ua = this._daylightSavingAdjust(ua)
                        }
                        y += O + "</tr>"
                    }
                    x++;
                    if (x > 11) {
                        x = 0;
                        ba++
                    }
                    y += "</tbody></table>" + (G ? "</div>" + (F[0] > 0 && ya ==
                            F[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : "");
                    sa += y
                }
                m += sa
            }
            m += r + (a.browser.msie && parseInt(a.browser.version, 10) < 7 && !h.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : "");
            h._keyEvent = false;
            return m
        },_generateMonthYearHeader:function(h, l, o, r, u, C, F, x) {
            var I = this._get(h, "changeMonth"),G = this._get(h, "changeYear"),H = this._get(h, "showMonthAfterYear"),A = '<div class="ui-datepicker-title">',N = "";
            if (C || !I)N += '<span class="ui-datepicker-month">' + F[l] +
                    "</span>"; else {
                F = r && r.getFullYear() == o;
                var ba = u && u.getFullYear() == o;
                N += '<select class="ui-datepicker-month" onchange="DP_jQuery_' + f + ".datepicker._selectMonthYear('#" + h.id + "', this, 'M');\" >";
                for (var K = 0; K < 12; K++)if ((!F || K >= r.getMonth()) && (!ba || K <= u.getMonth()))N += '<option value="' + K + '"' + (K == l ? ' selected="selected"' : "") + ">" + x[K] + "</option>";
                N += "</select>"
            }
            H || (A += N + (C || !(I && G) ? "&#xa0;" : ""));
            if (!h.yearshtml) {
                h.yearshtml = "";
                if (C || !G)A += '<span class="ui-datepicker-year">' + o + "</span>"; else {
                    x = this._get(h,
                            "yearRange").split(":");
                    var W = (new Date).getFullYear();
                    F = function(ka) {
                        ka = ka.match(/c[+-].*/) ? o + parseInt(ka.substring(1), 10) : ka.match(/[+-].*/) ? W + parseInt(ka, 10) : parseInt(ka, 10);
                        return isNaN(ka) ? W : ka
                    };
                    l = F(x[0]);
                    x = Math.max(l, F(x[1] || ""));
                    l = r ? Math.max(l, r.getFullYear()) : l;
                    x = u ? Math.min(x, u.getFullYear()) : x;
                    for (h.yearshtml += '<select class="ui-datepicker-year" onchange="DP_jQuery_' + f + ".datepicker._selectMonthYear('#" + h.id + "', this, 'Y');\" >"; l <= x; l++)h.yearshtml += '<option value="' + l + '"' + (l == o ? ' selected="selected"' :
                            "") + ">" + l + "</option>";
                    h.yearshtml += "</select>";
                    A += h.yearshtml;
                    h.yearshtml = null
                }
            }
            A += this._get(h, "yearSuffix");
            if (H)A += (C || !(I && G) ? "&#xa0;" : "") + N;
            A += "</div>";
            return A
        },_adjustInstDate:function(h, l, o) {
            var r = h.drawYear + (o == "Y" ? l : 0),u = h.drawMonth + (o == "M" ? l : 0);
            l = Math.min(h.selectedDay, this._getDaysInMonth(r, u)) + (o == "D" ? l : 0);
            r = this._restrictMinMax(h, this._daylightSavingAdjust(new Date(r, u, l)));
            h.selectedDay = r.getDate();
            h.drawMonth = h.selectedMonth = r.getMonth();
            h.drawYear = h.selectedYear = r.getFullYear();
            if (o ==
                    "M" || o == "Y")this._notifyChange(h)
        },_restrictMinMax:function(h, l) {
            var o = this._getMinMaxDate(h, "min"),r = this._getMinMaxDate(h, "max");
            o = o && l < o ? o : l;
            return o = r && o > r ? r : o
        },_notifyChange:function(h) {
            var l = this._get(h, "onChangeMonthYear");
            if (l)l.apply(h.input ? h.input[0] : null, [h.selectedYear,h.selectedMonth + 1,h])
        },_getNumberOfMonths:function(h) {
            h = this._get(h, "numberOfMonths");
            return h == null ? [1,1] : typeof h == "number" ? [1,h] : h
        },_getMinMaxDate:function(h, l) {
            return this._determineDate(h, this._get(h, l + "Date"), null)
        },
        _getDaysInMonth:function(h, l) {
            return 32 - this._daylightSavingAdjust(new Date(h, l, 32)).getDate()
        },_getFirstDayOfMonth:function(h, l) {
            return(new Date(h, l, 1)).getDay()
        },_canAdjustMonth:function(h, l, o, r) {
            var u = this._getNumberOfMonths(h);
            o = this._daylightSavingAdjust(new Date(o, r + (l < 0 ? l : u[0] * u[1]), 1));
            l < 0 && o.setDate(this._getDaysInMonth(o.getFullYear(), o.getMonth()));
            return this._isInRange(h, o)
        },_isInRange:function(h, l) {
            var o = this._getMinMaxDate(h, "min"),r = this._getMinMaxDate(h, "max");
            return(!o || l.getTime() >=
                    o.getTime()) && (!r || l.getTime() <= r.getTime())
        },_getFormatConfig:function(h) {
            var l = this._get(h, "shortYearCutoff");
            l = typeof l != "string" ? l : (new Date).getFullYear() % 100 + parseInt(l, 10);
            return{shortYearCutoff:l,dayNamesShort:this._get(h, "dayNamesShort"),dayNames:this._get(h, "dayNames"),monthNamesShort:this._get(h, "monthNamesShort"),monthNames:this._get(h, "monthNames")}
        },_formatDate:function(h, l, o, r) {
            if (!l) {
                h.currentDay = h.selectedDay;
                h.currentMonth = h.selectedMonth;
                h.currentYear = h.selectedYear
            }
            l = l ? typeof l ==
                    "object" ? l : this._daylightSavingAdjust(new Date(r, o, l)) : this._daylightSavingAdjust(new Date(h.currentYear, h.currentMonth, h.currentDay));
            return this.formatDate(this._get(h, "dateFormat"), l, this._getFormatConfig(h))
        }});
    a.fn.datepicker = function(h) {
        if (!this.length)return this;
        if (!a.datepicker.initialized) {
            a(document).mousedown(a.datepicker._checkExternalClick).find("body").append(a.datepicker.dpDiv);
            a.datepicker.initialized = true
        }
        var l = Array.prototype.slice.call(arguments, 1);
        if (typeof h == "string" && (h == "isDisabled" ||
                h == "getDate" || h == "widget"))return a.datepicker["_" + h + "Datepicker"].apply(a.datepicker, [this[0]].concat(l));
        if (h == "option" && arguments.length == 2 && typeof arguments[1] == "string")return a.datepicker["_" + h + "Datepicker"].apply(a.datepicker, [this[0]].concat(l));
        return this.each(function() {
            typeof h == "string" ? a.datepicker["_" + h + "Datepicker"].apply(a.datepicker, [this].concat(l)) : a.datepicker._attachDatepicker(this, h)
        })
    };
    a.datepicker = new c;
    a.datepicker.initialized = false;
    a.datepicker.uuid = (new Date).getTime();
    a.datepicker.version = "1.8.16";
    window["DP_jQuery_" + f] = a
})(jQuery);
(function(a) {
    var d = 0;
    a.getScrollbarWidth = function() {
        if (!d)if (a.browser.msie) {
            var c = a('<textarea cols="10" rows="2"></textarea>').css({position:"absolute",top:-1000,left:-1000}).appendTo("body"),b = a('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>').css({position:"absolute",top:-1000,left:-1000}).appendTo("body");
            d = c.width() - b.width();
            c.add(b).remove()
        } else {
            c = a("<div />").css({width:100,height:100,overflow:"auto",position:"absolute",top:-1000,left:-1000}).prependTo("body").append("<div />").find("div").css({width:"100%",
                height:200});
            d = 100 - c.width();
            c.parent().remove()
        }
        return d
    }
})(jQuery);
(function(a) {
    a.fn.drag = function(e, f, j) {
        var h = typeof e == "string" ? e : "",l = a.isFunction(e) ? e : a.isFunction(f) ? f : null;
        if (h.indexOf("drag") !== 0)h = "drag" + h;
        j = (e == l ? f : j) || {};
        return l ? this.bind(h, j, l) : this.trigger(h)
    };
    var d = a.event,c = d.special,b = c.drag = {defaults:{which:1,distance:15,not:":input",handle:null,relative:false,drop:true,click:true},datakey:"dragdata",livekey:"livedrag",add:function(e) {
        var f = a.data(this, b.datakey),j = e.data || {};
        f.related += 1;
        if (!f.live && e.selector) {
            f.live = true;
            d.add(this, "draginit." +
                    b.livekey, b.delegate)
        }
        a.each(b.defaults, function(h) {
            if (j[h] !== undefined)f[h] = j[h]
        })
    },remove:function() {
        a.data(this, b.datakey).related -= 1
    },setup:function() {
        if (!a.data(this, b.datakey)) {
            var e = a.extend({related:0}, b.defaults);
            a.data(this, b.datakey, e);
            d.add(this, "mousedown", b.init, e);
            this.attachEvent && this.attachEvent("ondragstart", b.dontstart)
        }
    },teardown:function() {
        if (!a.data(this, b.datakey).related) {
            a.removeData(this, b.datakey);
            d.remove(this, "mousedown", b.init);
            d.remove(this, "draginit", b.delegate);
            b.textselect(true);
            this.detachEvent && this.detachEvent("ondragstart", b.dontstart)
        }
    },init:function(e) {
        var f = e.data,j;
        if (!(f.which > 0 && e.which != f.which))if (!a(e.target).is(f.not))if (!(f.handle && !a(e.target).closest(f.handle, e.currentTarget).length)) {
            f.propagates = 1;
            f.interactions = [b.interaction(this, f)];
            f.target = e.target;
            f.pageX = e.pageX;
            f.pageY = e.pageY;
            f.dragging = null;
            j = b.hijack(e, "draginit", f);
            if (f.propagates) {
                if ((j = b.flatten(j)) && j.length) {
                    f.interactions = [];
                    a.each(j, function() {
                        f.interactions.push(b.interaction(this, f))
                    })
                }
                f.propagates =
                        f.interactions.length;
                f.drop !== false && c.drop && c.drop.handler(e, f);
                b.textselect(false);
                d.add(document, "mousemove mouseup", b.handler, f);
                return false
            }
        }
    },interaction:function(e, f) {
        return{drag:e,callback:new b.callback,droppable:[],offset:a(e)[f.relative ? "position" : "offset"]() || {top:0,left:0}}
    },handler:function(e) {
        var f = e.data;
        switch (e.type) {
            case !f.dragging && "mousemove":
                if (Math.pow(e.pageX - f.pageX, 2) + Math.pow(e.pageY - f.pageY, 2) < Math.pow(f.distance, 2))break;
                e.target = f.target;
                b.hijack(e, "dragstart", f);
                if (f.propagates)f.dragging = true;
            case "mousemove":
                if (f.dragging) {
                    b.hijack(e, "drag", f);
                    if (f.propagates) {
                        f.drop !== false && c.drop && c.drop.handler(e, f);
                        break
                    }
                    e.type = "mouseup"
                }
            case "mouseup":
                d.remove(document, "mousemove mouseup", b.handler);
                if (f.dragging) {
                    f.drop !== false && c.drop && c.drop.handler(e, f);
                    b.hijack(e, "dragend", f)
                }
                b.textselect(true);
                if (f.click === false && f.dragging) {
                    jQuery.event.triggered = true;
                    setTimeout(function() {
                        jQuery.event.triggered = false
                    }, 20);
                    f.dragging = false
                }
                break
        }
    },delegate:function(e) {
        var f =
                [],j,h = a.data(this, "events") || {};
        a.each(h.live || [], function(l, o) {
            if (o.preType.indexOf("drag") === 0)if (j = a(e.target).closest(o.selector, e.currentTarget)[0]) {
                d.add(j, o.origType + "." + b.livekey, o.origHandler, o.data);
                a.inArray(j, f) < 0 && f.push(j)
            }
        });
        if (!f.length)return false;
        return a(f).bind("dragend." + b.livekey, function() {
            d.remove(this, "." + b.livekey)
        })
    },hijack:function(e, f, j, h, l) {
        if (j) {
            var o = {event:e.originalEvent,type:e.type},r = f.indexOf("drop") ? "drag" : "drop",u,C = h || 0,F,x;
            h = !isNaN(h) ? h : j.interactions.length;
            e.type = f;
            e.originalEvent = null;
            j.results = [];
            do if (F = j.interactions[C])if (!(f !== "dragend" && F.cancelled)) {
                x = b.properties(e, j, F);
                F.results = [];
                a(l || F[r] || j.droppable).each(function(I, G) {
                    u = (x.target = G) ? d.handle.call(G, e, x) : null;
                    if (u === false) {
                        if (r == "drag") {
                            F.cancelled = true;
                            j.propagates -= 1
                        }
                        if (f == "drop")F[r][I] = null
                    } else if (f == "dropinit")F.droppable.push(b.element(u) || G);
                    if (f == "dragstart")F.proxy = a(b.element(u) || F.drag)[0];
                    F.results.push(u);
                    delete e.result;
                    if (f !== "dropinit")return u
                });
                j.results[C] = b.flatten(F.results);
                if (f == "dropinit")F.droppable = b.flatten(F.droppable);
                f == "dragstart" && !F.cancelled && x.update()
            } while (++C < h);
            e.type = o.type;
            e.originalEvent = o.event;
            return b.flatten(j.results)
        }
    },properties:function(e, f, j) {
        var h = j.callback;
        h.drag = j.drag;
        h.proxy = j.proxy || j.drag;
        h.startX = f.pageX;
        h.startY = f.pageY;
        h.deltaX = e.pageX - f.pageX;
        h.deltaY = e.pageY - f.pageY;
        h.originalX = j.offset.left;
        h.originalY = j.offset.top;
        h.offsetX = e.pageX - (f.pageX - h.originalX);
        h.offsetY = e.pageY - (f.pageY - h.originalY);
        h.drop = b.flatten((j.drop || []).slice());
        h.available = b.flatten((j.droppable || []).slice());
        return h
    },element:function(e) {
        if (e && (e.jquery || e.nodeType == 1))return e
    },flatten:function(e) {
        return a.map(e, function(f) {
            return f && f.jquery ? a.makeArray(f) : f && f.length ? b.flatten(f) : f
        })
    },textselect:function(e) {
        a("body")[e ? "unbind" : "bind"]("selectstart", b.dontstart).attr("unselectable", e ? "off" : "on").css("MozUserSelect", e ? "" : "none")
    },dontstart:function() {
        return false
    },callback:function() {
    }};
    b.callback.prototype = {update:function() {
        c.drop && this.available.length &&
        a.each(this.available, function(e) {
            c.drop.locate(this, e)
        })
    }};
    c.draginit = c.dragstart = c.dragend = b
})(jQuery);
(function(a) {
    a.fn.drop = function(e, f, j) {
        var h = typeof e == "string" ? e : "",l = a.isFunction(e) ? e : a.isFunction(f) ? f : null;
        if (h.indexOf("drop") !== 0)h = "drop" + h;
        j = (e == l ? f : j) || {};
        return l ? this.bind(h, j, l) : this.trigger(h)
    };
    a.drop = function(e) {
        e = e || {};
        b.multi = e.multi === true ? Infinity : e.multi === false ? 1 : !isNaN(e.multi) ? e.multi : b.multi;
        b.delay = e.delay || b.delay;
        b.tolerance = a.isFunction(e.tolerance) ? e.tolerance : e.tolerance === null ? null : b.tolerance;
        b.mode = e.mode || b.mode || "intersect"
    };
    var d = a.event,c = d.special,b = a.event.special.drop =
    {multi:1,delay:20,mode:"overlap",targets:[],datakey:"dropdata",livekey:"livedrop",add:function(e) {
        var f = a.data(this, b.datakey);
        f.related += 1;
        if (!f.live && e.selector) {
            f.live = true;
            d.add(this, "dropinit." + b.livekey, b.delegate)
        }
    },remove:function() {
        a.data(this, b.datakey).related -= 1
    },setup:function() {
        if (!a.data(this, b.datakey)) {
            a.data(this, b.datakey, {related:0,active:[],anyactive:0,winner:0,location:{}});
            b.targets.push(this)
        }
    },teardown:function() {
        if (!a.data(this, b.datakey).related) {
            a.removeData(this, b.datakey);
            d.remove(this, "dropinit", b.delegate);
            var e = this;
            b.targets = a.grep(b.targets, function(f) {
                return f !== e
            })
        }
    },handler:function(e, f) {
        var j;
        if (f)switch (e.type) {
            case "mousedown":
                j = a(b.targets);
                if (typeof f.drop == "string")j = j.filter(f.drop);
                j.each(function() {
                    var h = a.data(this, b.datakey);
                    h.active = [];
                    h.anyactive = 0;
                    h.winner = 0
                });
                f.droppable = j;
                b.delegates = [];
                c.drag.hijack(e, "dropinit", f);
                b.delegates = a.unique(c.drag.flatten(b.delegates));
                break;
            case "mousemove":
                b.event = e;
                b.timer || b.tolerate(f);
                break;
            case "mouseup":
                b.timer =
                        clearTimeout(b.timer);
                if (f.propagates) {
                    c.drag.hijack(e, "drop", f);
                    c.drag.hijack(e, "dropend", f);
                    a.each(b.delegates || [], function() {
                        d.remove(this, "." + b.livekey)
                    })
                }
                break
        }
    },delegate:function(e) {
        var f = [],j,h = a.data(this, "events") || {};
        a.each(h.live || [], function(l, o) {
            if (o.preType.indexOf("drop") === 0) {
                j = a(e.currentTarget).find(o.selector);
                j.length && j.each(function() {
                    d.add(this, o.origType + "." + b.livekey, o.origHandler, o.data);
                    a.inArray(this, f) < 0 && f.push(this)
                })
            }
        });
        b.delegates.push(f);
        return f.length ? a(f) : false
    },
        locate:function(e, f) {
            var j = a.data(e, b.datakey),h = a(e),l = h.offset() || {},o = h.outerHeight();
            h = h.outerWidth();
            l = {elem:e,width:h,height:o,top:l.top,left:l.left,right:l.left + h,bottom:l.top + o};
            if (j) {
                j.location = l;
                j.index = f;
                j.elem = e
            }
            return l
        },contains:function(e, f) {
        return(f[0] || f.left) >= e.left && (f[0] || f.right) <= e.right && (f[1] || f.top) >= e.top && (f[1] || f.bottom) <= e.bottom
    },modes:{intersect:function(e, f, j) {
        return this.contains(j, [e.pageX,e.pageY]) ? 1E9 : this.modes.overlap.apply(this, arguments)
    },overlap:function(e, f, j) {
        return Math.max(0, Math.min(j.bottom, f.bottom) - Math.max(j.top, f.top)) * Math.max(0, Math.min(j.right, f.right) - Math.max(j.left, f.left))
    },fit:function(e, f, j) {
        return this.contains(j, f) ? 1 : 0
    },middle:function(e, f, j) {
        return this.contains(j, [f.left + f.width * 0.5,f.top + f.height * 0.5]) ? 1 : 0
    }},sort:function(e, f) {
        return f.winner - e.winner || e.index - f.index
    },tolerate:function(e) {
        var f,j,h,l,o,r,u = 0,C,F = e.interactions.length,x = [b.event.pageX,b.event.pageY],I = b.tolerance || b.modes[b.mode];
        do if (C = e.interactions[u]) {
            if (!C)return;
            C.drop = [];
            o = [];
            r = C.droppable.length;
            if (I)h = b.locate(C.proxy);
            f = 0;
            do if (j = C.droppable[f]) {
                l = a.data(j, b.datakey);
                if (j = l.location) {
                    l.winner = I ? I.call(b, b.event, h, j) : b.contains(j, x) ? 1 : 0;
                    o.push(l)
                }
            } while (++f < r);
            o.sort(b.sort);
            f = 0;
            do if (l = o[f])if (l.winner && C.drop.length < b.multi) {
                if (!l.active[u] && !l.anyactive)if (c.drag.hijack(b.event, "dropstart", e, u, l.elem)[0] !== false) {
                    l.active[u] = 1;
                    l.anyactive += 1
                } else l.winner = 0;
                l.winner && C.drop.push(l.elem)
            } else if (l.active[u] && l.anyactive == 1) {
                c.drag.hijack(b.event, "dropend",
                        e, u, l.elem);
                l.active[u] = 0;
                l.anyactive -= 1
            } while (++f < r)
        } while (++u < F);
        if (b.last && x[0] == b.last.pageX && x[1] == b.last.pageY)delete b.timer; else b.timer = setTimeout(function() {
            b.tolerate(e)
        }, b.delay);
        b.last = b.event
    }};
    c.dropinit = c.dropstart = c.dropend = b
})(jQuery);
(function(a) {
    function d(f) {
        f = f.replace(/_/, "-").toLowerCase();
        if (f.length > 3)f = f.substring(0, 3) + f.substring(3).toUpperCase();
        return f
    }

    var c = {},b = {};
    a.localize = function(f, j) {
        function h(H, A, N) {
            N = N || 1;
            var ba;
            if (j && j.loadBase && N == 1) {
                I = {};
                ba = H + ".json" + a.localize.cachebuster;
                l(ba, H, A, N)
            } else if (N == 1) {
                I = {};
                h(H, A, 2)
            } else if (N == 2 && A.length >= 2) {
                ba = H + "-" + A.substring(0, 2) + ".json" + a.localize.cachebuster;
                l(ba, H, A, N)
            } else if (N == 3 && A.length >= 5) {
                ba = H + "-" + A.substring(0, 5) + ".json" + a.localize.cachebuster;
                l(ba, H, A, N)
            }
        }

        function l(H, A, N) {
            function ba(W) {
                if (N === "en") {
                    console.log("$.localize has english");
                    a.localize.defaultLangData = W
                }
                I = a.extend({}, a.localize.defaultLangData, I, W);
                c[H] = I;
                u(I)
            }

            function K() {
                delete b[H]
            }

            if (j.pathPrefix)H = j.pathPrefix + "/" + H;
            if (c[H])u(c[H]); else if (b[H])b[H].done(ba); else b[H] = a.localize.jsonpCallback ? a.ajax({url:window.gsConfig.assetHost + H,async:true,dataType:"jsonp",jsonp:false,jsonpCallback:a.localize.jsonpCallback + N,data:null}).done(ba).fail(K) : a.ajax({url:H,async:true,dataType:"json",
                data:null}).done(ba).fail(K)
        }

        function o(H) {
            a.localize.data[f] = H;
            var A;
            x.each(function() {
                elem = a(this);
                key = elem.attr("data-translate-text");
                A = C(key, H);
                var N = elem.dataString();
                if (N)N.setString(A); else if (elem.data("localize-text") !== A) {
                    elem[0].tagName == "INPUT" ? elem.val(A) : elem.html(A);
                    elem.data("localize-text", A)
                }
            })
        }

        function r(H) {
            a.localize.data[f] = H;
            var A;
            x.each(function() {
                elem = a(this);
                key = elem.attr("data-translate-title");
                A = C(key, H);
                if (elem.data("localize-title") !== A) {
                    elem.attr("title", A);
                    elem.data("localize-text",
                            A)
                }
            })
        }

        function u(H) {
            if (j.callback)j.callback === "titleCallback" ? r(H) : j.callback(H, o); else o(H)
        }

        function C(H, A) {
            for (var N = H.split(/\./),ba = A; N.length > 0;)if (ba)ba = ba[N.shift()]; else return null;
            return ba
        }

        function F(H) {
            if (typeof H == "string")return"^" + H + "$"; else if (H.length) {
                for (var A = [],N = H.length; N--;)A.push(F(H[N]));
                return A.join("|")
            } else return H
        }

        var x = this,I = {};
        j = j || {};
        j.pathPrefix = "/locales";
        var G = d(j && j.language ? j.language : a.defaultLanguage);
        j.skipLanguage && G.match(F(j.skipLanguage)) || h(f, G, 1)
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
        for (var e in gsLocale)if (gsLocale.hasOwnProperty(e))a.localize.defaultLangData[e] = gsLocale[e]
    }
    a.localize("gs",
            {language:"en",callback:function() {
                a.localize.ready = true;
                a.publish("gs.locale.ready")
            }});
    a.localize.getString = function(f) {
        return this.data.gs[f] || this.defaultLangData[f]
    };
    a.defaultLanguage = d(navigator.language ? navigator.language : navigator.userLanguage)
})(jQuery);
(function(a) {
    function d(c) {
        if (typeof c.data === "string") {
            var b = c.handler,e = c.data.toLowerCase().split(" ");
            c.handler = function(f) {
                if (!(this !== f.target && /textarea|select/i.test(f.target.nodeName) && f.target.type === "text")) {
                    var j = f.type !== "keypress" && a.hotkeys.specialKeys[f.which],h = String.fromCharCode(f.which).toLowerCase(),l = "",o = {};
                    if (f.altKey && j !== "alt")l += "alt+";
                    if (f.ctrlKey && j !== "ctrl")l += "ctrl+";
                    if (f.metaKey && !f.ctrlKey && j !== "meta")l += "meta+";
                    if (f.shiftKey && j !== "shift")l += "shift+";
                    if (j)o[l + j] = true;
                    else {
                        o[l + h] = true;
                        o[l + a.hotkeys.shiftNums[h]] = true;
                        if (l === "shift+")o[a.hotkeys.shiftNums[h]] = true
                    }
                    j = 0;
                    for (h = e.length; j < h; j++)if (o[e[j]])return b.apply(this, arguments)
                }
            }
        }
    }

    a.hotkeys = {version:"0.8",specialKeys:{8:"backspace",9:"tab",13:"return",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",
        107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",191:"/",224:"meta"},shiftNums:{"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+",";":": ","'":'"',",":"<",".":">","/":"?","\\":"|"}};
    a.each(["keydown","keyup","keypress"], function() {
        a.event.special[this] = {add:d}
    })
})(jQuery);
(function(a) {
    function d(e) {
        var f = e || window.event,j = [].slice.call(arguments, 1),h = 0,l = 0,o = 0;
        e = a.event.fix(f);
        e.type = "mousewheel";
        if (f.wheelDelta)h = f.wheelDelta / 120;
        if (f.detail)h = -f.detail / 3;
        o = h;
        if (f.axis !== undefined && f.axis === f.HORIZONTAL_AXIS) {
            o = 0;
            l = -1 * h
        }
        if (f.wheelDeltaY !== undefined)o = f.wheelDeltaY / 120;
        if (f.wheelDeltaX !== undefined)l = -1 * f.wheelDeltaX / 120;
        j.unshift(e, h, l, o);
        return(a.event.dispatch || a.event.handle).apply(this, j)
    }

    var c = ["DOMMouseScroll","mousewheel"];
    if (a.event.fixHooks)for (var b = c.length; b;)a.event.fixHooks[c[--b]] =
            a.event.mouseHooks;
    a.event.special.mousewheel = {setup:function() {
        if (this.addEventListener)for (var e = c.length; e;)this.addEventListener(c[--e], d, false); else this.onmousewheel = d
    },teardown:function() {
        if (this.removeEventListener)for (var e = c.length; e;)this.removeEventListener(c[--e], d, false); else this.onmousewheel = null
    }};
    a.fn.extend({mousewheel:function(e) {
        return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
    },unmousewheel:function(e) {
        return this.unbind("mousewheel", e)
    }})
})(jQuery);
jQuery.fn.supersleight = function(a) {
    a = jQuery.extend({imgs:true,backgrounds:true,shim:"webincludes/images/blank.gif",apply_positioning:true}, a);
    return this.each(function() {
        jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 7 && parseInt(jQuery.browser.version, 10) > 4 && jQuery(this).find("*").andSelf().each(function(d, c) {
            var b = jQuery(c);
            if (a.backgrounds && b.css("background-image").match(/\.png/i) !== null) {
                var e = b.css("background-image");
                e = e.substring(5, e.length - 2);
                var f = b.css("background-repeat") == "no-repeat" ?
                        "crop" : "scale";
                e = {filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + e + "', sizingMethod='" + f + "')","background-image":"url(" + a.shim + ")"};
                b.css(e)
            }
            if (a.imgs && b.is("img[src$=png]")) {
                e = {width:b.width() + "px",height:b.height() + "px",filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + b.attr("src") + "', sizingMethod='scale')"};
                b.css(e).attr("src", a.shim)
            }
            if (a.apply_positioning && b.is("a, input") && (b.css("position") === "" || b.css("position") == "static"))b.css("position", "relative")
        })
    })
};
(function(a) {
    var d;
    a.fn.gsQueue = function(c, b) {
        d = this;
        c = a.extend({itemWidth:75,activeItemWidth:100,speed:800,scroll:40,dataKey:"queueSongID",activeIndex:0}, c);
        var e = a(".viewport", this),f = a("ol.queue", this),j = null,h = c.activeIndex,l = 0,o = 0,r = {floor:0,ceil:0},u = false,C = false,F = {},x = false,I = {},G = 0,H = 0;
        this.initialize = function() {
            this.itemRenderer = c.itemRenderer || this.itemRenderer;
            if (b.length)C = true; else f.html("");
            e.scrollLeft(0);
            e.scroll(d.render);
            c.activeItemWidthDiff = c.activeItemWidth - c.itemWidth;
            h &&
            this.scrollTo(l);
            a(window).resize(d.onResize);
            this.onResize();
            return this
        };
        this.updateSettings = function(A) {
            A = A || {};
            c = a.extend(c, A);
            e.scrollLeft(0);
            e.scroll(d.render);
            c.activeItemWidthDiff = c.activeItemWidth - c.itemWidth;
            A.activeIndex && this.scrollTo(l);
            a(window).resize(d.onResize);
            C = true;
            this.onResize();
            return this
        };
        this.destroy = function() {
            a(window).unbind("resize", this.onResize);
            e.unbind("scroll", this.render);
            delete d
        };
        this.onResize = function() {
            if (!x) {
                d.render();
                d.updateScrollbar()
            }
        };
        this.setItems = function(A, N) {
            var ba = b.length !== (A || []).length;
            b = A ? A : [];
            if (ba || N)C = true;
            if (!x) {
                if (h > A.length || A.length == 0) {
                    this.render();
                    this.moveTo(A.length, true)
                } else this.render();
                ba && d.updateScrollbar()
            }
        };
        this.updateItem = function(A) {
            var N = A[c.dataKey];
            if (N && b[N])b[N] = A; else console.warn("jquery-queue. item has invalid dataKey. settings:", c.dataKey, "item key:", A[c.dataKey])
        };
        this.updateScrollbar = function() {
            var A = a("#queue").height(),N = c.itemWidth,ba = c.activeItemWidth,K = parseInt(e.css("padding-left"), 10);
            N = N * b.length + ba +
                    K;
            a(f).width(Math.max(N, e.outerWidth() - K));
            if (j)j.update({axis:"x",contentSize:N}); else j = a(d).tinyscrollbar({axis:"x",contentSize:N,animationOptions:{duration:"fast",easing:"linear"}});
            e.scrollLeft() > e.width() && e.scrollLeft() + e.width() > N && this.scrollTo(N);
            a("#queue").height() != A && a(window).resize()
        };
        this.setDisabled = function(A) {
            if (x != A) {
                x = _.orEqual(A, false);
                C = true;
                x ? f.html("") : d.onResize()
            }
        };
        this.setActive = function(A, N) {
            if (!(_.notDefined(A) || A < 0)) {
                N = _.orEqual(N, true);
                if (h !== A) {
                    h = A;
                    C = u = true;
                    if (!x) {
                        a(".queue-item-active",
                                f).removeClass("queue-item-active");
                        N && h < b.length && this.moveTo(h, true);
                        this.render()
                    }
                }
            }
        };
        this.addToCache = function(A, N) {
            F[A] = N
        };
        this.getFromCache = function(A) {
            return F[A] || null
        };
        this.moveTo = function(A, N, ba) {
            ba = _.orEqual(ba, false);
            A = Math.max(0, Math.min(A, b.length - 1));
            A = this.calcOffset(A);
            ba || (A = Math.max(0, A - e.outerWidth(true) / 2));
            this.scrollTo(A, N)
        };
        this.scrollTo = function(A, N) {
            if (N || Math.abs(A - l) > e.width() * 2.5) {
                e.scrollLeft(A);
                d.updateScrollbar()
            } else e.stop().animate({scrollLeft:A}, "slow", "linear",
                    function() {
                        d.updateScrollbar()
                    });
            l = A;
            d.render()
        };
        this.render = function() {
            var A = +new Date;
            if (!(A - G < 60 && !C))if (C || b.length) {
                G = A;
                A = e.scrollLeft();
                var N = e.width(),ba = e.filter(":animated").length,K = Math.max(0, A - N * 1.1),W = Math.min(A + N * 1.4, b.length * c.itemWidth),ka = 0;
                N = 0;
                var fa,ha;
                r.floor = Math.floor(K / c.itemWidth);
                r.ceil = Math.ceil(W / c.itemWidth);
                W = b.length;
                if (C) {
                    f.html("");
                    F = {};
                    I = {}
                }
                for (fa in F)if (F.hasOwnProperty(fa)) {
                    ha = a(F[fa]);
                    K = ha.data("queueIndex");
                    if (K > r.ceil || K < r.floor || K > W || b[K][c.dataKey] != fa) {
                        if (!I[fa]) {
                            f[0].removeChild(ha[0]);
                            ka++
                        }
                        if (K > W || b[K][c.dataKey] != fa)delete F[fa]; else I[fa] = 1
                    }
                }
                ka = document.createDocumentFragment();
                ha = 0;
                K = r.floor;
                for (W = r.ceil; K < W; K++) {
                    if (fa = d.getFromCache(b[K][c.dataKey])) {
                        u && a(fa).css("left", d.calcOffset(K) + "px");
                        if (I[b[K][c.dataKey]]) {
                            ka.appendChild(fa);
                            ha++;
                            delete I[b[K][c.dataKey]]
                        } else if (ha) {
                            f.append(ka);
                            ka = document.createDocumentFragment();
                            ha = 0
                        }
                    } else if (!fa) {
                        fa = d.itemWrapper(b[K], K);
                        ka.appendChild(fa);
                        ha++;
                        N++
                    }
                    a(fa).data("queueIndex", K);
                    K == h && a(fa).addClass("queue-item-active")
                }
                ha && f.append(ka);
                C = u = false;
                o = A;
                if (ba) {
                    H && clearTimeout(H);
                    H = setTimeout(function() {
                        d.render()
                    }, 80)
                }
            }
        };
        this.calcOffset = function(A) {
            var N = A * c.itemWidth;
            if (A > h)N += c.activeItemWidthDiff;
            return N
        };
        this.calcIndex = function(A) {
            var N = A / c.itemWidth;
            if (N > h)N = (A - c.activeItemWidthDiff) / c.itemWidth;
            return Math.round(N)
        };
        this.itemWrapper = function(A, N) {
            var ba = this.calcOffset(N),K = "queue-item",W;
            if (N == h)K += " queue-item-active";
            W = d.getFromCache(A[c.dataKey]);
            if (!W) {
                W = d.itemRenderer(A, N, b.length);
                var ka = document.createElement("div");
                ka.innerHTML = ['<li class="',K,'" style="left: ',ba,"px; z-index: ",9E3 - N,'" rel="',N,'" data-queuesongid="',A.queueSongID,'"><div class="queue-item-content">',W,"</div></li>"].join("");
                W = ka.firstChild;
                d.addToCache(A[c.dataKey], W)
            }
            return W
        };
        this.itemRenderer = function(A) {
            return["<span>",A.toString(),"</span>"].join("")
        };
        return this.initialize()
    }
})(jQuery);
(function(a) {
    var d = function() {
        var c = a("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body"),b = {width:c.width() - c[0].clientWidth,height:c.height() - c[0].clientHeight};
        c.remove();
        return b
    }();
    a.fn.slickbox = function(c, b) {
        var e = this;
        c = a.extend({itemWidth:160,itemHeight:100,verticalGap:"auto",minHorizontalGap:2,maxHorizontalGap:25,dragAs:false,dragItemID:false}, c);
        var f = a(this),j,h,l = {};
        b = b;
        var o = 0,r = 0,u = 0,C = 0,F = 0,x = 0,I = 0,G = 0,
                H = 0,A = {floor:0,ceil:0},N = false,ba = false;
        this.initialize = function() {
            this.html("");
            this.itemRenderer = c.itemRenderer || this.itemRenderer;
            this.itemClass = c.itemClass || "";
            this.listClass = c.listClass || "";
            j = a("<ol class='slickbox-tiles " + this.listClass + "' style='position: relative;'></ol>");
            f.append(j);
            C = c.padding ? c.padding : 0;
            h = c.scrollPane ? a(c.scrollPane) : f;
            I = c.scrollPane ? f[0].offsetTop : 0;
            this.setSort(c.sortFunction);
            a(h).scroll(e.render);
            a(h).scroll(e.render);
            e.calculateGaps();
            e.render();
            return this
        };
        this.destroy =
                function() {
                    a(h).unbind("scroll", e.render);
                    delete e
                };
        this.calculateGaps = function() {
            var K = Math.max(1, Math.floor((f.outerWidth() - C * 2 - c.minHorizontalGap) / (c.itemWidth + c.minHorizontalGap))),W = Math.max(1, Math.floor((f.outerWidth() - C * 2 - c.maxHorizontalGap) / (c.itemWidth + c.maxHorizontalGap)));
            x = Math.max(K, W);
            F = Math.ceil(b.length / x);
            u = c.horizontalGap ? c.horizontalGap : Math.floor((f.outerWidth() - C * 2 - c.itemWidth * x) / (x - 1));
            r = c.verticalGap == "auto" ? u : c.verticalGap;
            j.height(F * c.itemHeight + (F - 1) * r + C * 2);
            H = 0;
            if (j.height() >
                    h.height()) {
                h.css("overflow", "auto");
                H = Math.floor(d.width / x)
            }
        };
        a(window).resize(function() {
            e.calculateGaps();
            ba = true;
            e.render()
        });
        this.setItems = function(K) {
            b = K ? K : [];
            ba = true;
            this.calculateGaps();
            this.sorted = b.concat();
            if (this.sortFunction)this.sorted = this.sorted.sort(this.sortFunction);
            if (o > K.length || K.length == 0) {
                this.render();
                this.moveTo(K.length, true)
            } else this.render()
        };
        this.setSort = function(K) {
            this.sortFunction = K;
            this.sorted = b.concat();
            if (b && this.sortFunction)this.sorted = this.sorted.sort(this.sortFunction);
            ba = true;
            this.render()
        };
        this.setActive = function(K, W) {
            if (!(_.notDefined(K) || K < 0)) {
                W = _.orEqual(W, true);
                if (o !== K) {
                    o = K;
                    N = true;
                    W && o < b.length && this.moveTo(o);
                    this.render()
                }
            }
        };
        this.addToCache = function(K, W) {
            l[K] = W
        };
        this.getFromCache = function(K) {
            return l[K] || null
        };
        this.moveTo = function(K, W) {
            K = Math.max(0, Math.min(K, b.length - 1));
            this.scrollTo(e.topOffset(K), W)
        };
        this.scrollTo = function(K, W) {
            W ? h.scrollLeft(K) : h.stop().animate({scrollTop:K}, "slow", "linear", function() {
                e.render()
            });
            G = K;
            e.render()
        };
        this.render = function() {
            e.renderTimeout &&
            clearTimeout(this.renderTimeout);
            e.renderTimeout = setTimeout(function() {
                var K = Math.max(0, h.scrollTop() - I),W = Math.max(K + 1, h.scrollTop() + h.height() - I);
                A.floor = Math.floor(K / (c.itemHeight + r)) * x;
                A.ceil = Math.ceil(W / (c.itemHeight + r)) * x;
                if (ba) {
                    l = {};
                    j.html("")
                } else for (var ka in l)if (l.hasOwnProperty(ka)) {
                    el = l[ka];
                    elTop = parseInt(a(el).css("top"), 10);
                    if (ka >= e.sorted.length || elTop + c.itemHeight < K || elTop - c.itemHeight > W) {
                        j.get(0).removeChild(el);
                        delete l[ka]
                    }
                }
                for (i = A.floor; i < A.ceil && i < e.sorted.length; i++) {
                    if (K =
                            e.getFromCache(i))N && a(K).css({left:e.leftOffset(i),top:e.topOffset(i)}); else {
                        K = e.itemWrapper(e.sorted[i], i);
                        j.append(K);
                        e.addToCache(i, K)
                    }
                    i == o && a(K).addClass("slickbox-item-active")
                }
                ba = N = false
            }, 60)
        };
        this.topOffset = function(K) {
            return Math.floor(K / x) * (c.itemHeight + r) + C
        };
        this.leftOffset = function(K) {
            return K % x * (c.itemWidth + (u - H)) + C
        };
        this.itemWrapper = function(K, W) {
            var ka = "slickbox-item ",fa,ha = "";
            if (W == o)ka += " slickbox-item-active";
            fa = e.itemRenderer(K, W, b);
            ka += a.isFunction(e.itemClass) ? " " + e.itemClass(K,
                    W, b) : " " + e.itemClass;
            if (c.dragItemID && K.hasOwnProperty(c.dragItemID))ha = 'data-dragid="' + K[c.dragItemID] + '"';
            if (c.dragAs)ha += 'data-dragtype="' + c.dragAs + '"';
            var qa = document.createElement("div"),aa = "";
            c.hidePositionInfo || (aa = '<span class="position">' + (W + 1) + " of " + b.length + "</span>");
            qa.innerHTML = ['<li class="',ka,'"',ha,' style="position:absolute; top: ' + e.topOffset(W) + "px; left: " + e.leftOffset(W) + "px; z-index: " + (5E3 - W) + '" rel="',W,'"><div class="slickbox-item-content">',fa,"</div>",aa,"</li>"].join("");
            return qa.firstChild
        };
        this.itemRenderer = function(K) {
            return["<span>",K.toString(),"</span>"].join("")
        };
        return this.initialize()
    }
})(jQuery);
(function(a) {
    a.fn.tinyscrollbar = function(d) {
        function c() {
            x.obj.bind("mousedown", b);
            F.obj.bind("mouseup", h);
            a(o).bind("keydown", e);
            if (l.scroll && this.addEventListener) {
                o[0].addEventListener("DOMMouseScroll", f, false);
                o[0].addEventListener("mousewheel", f, false)
            } else if (l.scroll)o[0].onmousewheel = f
        }

        function b(K) {
            a(o).focus();
            ba.start = I ? K.pageX : K.pageY;
            N.start = parseInt(x.obj.css(G));
            a(document).bind("mousemove", h);
            a(document).bind("mouseup", j);
            x.obj.bind("mouseup", j);
            return false
        }

        function e(K) {
            K = a.event.fix(K ||
                    window.event);
            if (!(K.ctrlKey || K.altKey || K.shiftKey && K.keyKode == 32)) {
                switch (K.keyCode) {
                    case 39:
                    case 40:
                        A += l.wheel;
                        K.preventDefault();
                        break;
                    case 37:
                    case 38:
                        A -= l.wheel;
                        K.preventDefault();
                        break;
                    case 34:
                        K = Math.min(F[l.axis] - x[l.axis], Math.max(0, parseInt(x.obj.css(G), 10) + 0.9 * x.obj.width()));
                        A = K * C.ratio;
                        break;
                    case 33:
                        K = Math.min(F[l.axis] - x[l.axis], Math.max(0, parseInt(x.obj.css(G), 10) - 0.9 * x.obj.width()));
                        A = K * C.ratio;
                        break;
                    case 35:
                        A = u[l.axis] - r[l.axis];
                        K.preventDefault();
                        break;
                    case 36:
                        A = 0;
                        K.preventDefault();
                        break
                }
                A = Math.min(u[l.axis] - r[l.axis], Math.max(0, A));
                x.obj.css(G, A / C.ratio);
                G == "top" ? r.obj.scrollTop(A) : r.obj.scrollLeft(A)
            }
        }

        function f(K) {
            a(o).focus();
            if (!(u.ratio >= 1)) {
                K = a.event.fix(K || window.event);
                K = K.originalEvent;
                var W = A;
                A -= (K.wheelDelta ? K.wheelDelta / 120 : -K.detail / 3) * l.wheel;
                A = Math.min(u[l.axis] - r[l.axis], Math.max(0, A));
                if (A !== W) {
                    x.obj.css(G, A / C.ratio);
                    G == "top" ? r.obj.scrollTop(A) : r.obj.scrollLeft(A)
                }
            }
        }

        function j() {
            a(document).unbind("mousemove", h);
            a(document).unbind("mouseup", j);
            x.obj.unbind("mouseup",
                    j);
            G == "top" ? r.obj.scrollTop(A) : r.obj.scrollLeft(A);
            return false
        }

        function h(K) {
            if (!(u.ratio >= 1) && C.ratio > 0) {
                N.now = Math.round(Math.min(F[l.axis] - x[l.axis], Math.max(0, N.start + ((I ? K.pageX : K.pageY) - ba.start))));
                A = Math.ceil(N.now * C.ratio);
                x.obj.css(G, N.now);
                G == "top" ? r.obj.stop().animate({scrollTop:A}, l.animationOptions) : r.obj.stop().animate({scrollLeft:A}, l.animationOptions)
            }
            return false
        }

        var l = a.extend({axis:"y",contentSize:false,wheel:40,scroll:true,size:"auto",sizethumb:"auto",onScroll:null,animationOptions:{}},
                d),o = a(this),r = {obj:a(".viewport", this)},u = {obj:a(".overview", this)},C = {obj:a(".scrollbar", this)},F = {obj:a(".track", C.obj)},x = {obj:a(".thumb", C.obj)},I = l.axis == "x",G = I ? "left" : "top",H = I ? "Width" : "Height",A = 0,N = {start:0,now:0},ba = {};
        if (this.length > 1) {
            this.each(function() {
                a(this).tinyscrollbar(l)
            });
            return this
        }
        this.initialize = function() {
            this.update();
            c();
            return this
        };
        this.update = function(K) {
            l = a.extend(l, K);
            r[l.axis] = r.obj[0]["offset" + H];
            u[l.axis] = l.contentSize && l.contentSize >= 0 ? l.contentSize : u.obj[0]["scroll" +
                    H];
            u.ratio = r[l.axis] / u[l.axis];
            C.obj.toggleClass("disable", u.ratio >= 1);
            r.obj.toggleClass("scrollable", u.ratio < 1);
            F[l.axis] = l.size == "auto" ? r[l.axis] - 10 : l.size;
            x[l.axis] = Math.min(F[l.axis], Math.max(0, l.sizethumb == "auto" ? F[l.axis] * u.ratio : l.sizethumb));
            C.ratio = l.sizethumb == "auto" ? u[l.axis] / F[l.axis] : (u[l.axis] - r[l.axis]) / (F[l.axis] - x[l.axis]);
            x.obj.removeAttr("style");
            ba.start = x.obj.offset()[G];
            K = H.toLowerCase();
            C.obj.css(K, F[l.axis]);
            F.obj.css(K, F[l.axis]);
            x.obj.css(K, Math.max(x[l.axis], 5));
            A = l.contentSize &&
                    l.contentSize >= 0 ? l.contentSize > r.obj["outer" + H]() ? -u.obj.offset()[G] : 0 : u.obj["outer" + H]() > r.obj["outer" + H]() ? -u.obj.offset()[G] : 0;
            x.obj.css(G, A / C.ratio)
        };
        return this.initialize()
    }
})(jQuery);
(function(a) {
    function d(b) {
        return typeof b == "object" ? b : {top:b,left:b}
    }

    var c = a.scrollTo = function(b, e, f) {
        a(window).scrollTo(b, e, f)
    };
    c.defaults = {axis:"xy",duration:parseFloat(a.fn.jquery) >= 1.3 ? 0 : 1};
    c.window = function() {
        return a(window)._scrollable()
    };
    a.fn._scrollable = function() {
        return this.map(function() {
            if (!(!this.nodeName || a.inArray(this.nodeName.toLowerCase(), ["iframe","#document","html","body"]) != -1))return this;
            var b = (this.contentWindow || this).document || this.ownerDocument || this;
            return a.browser.safari ||
                    b.compatMode == "BackCompat" ? b.body : b.documentElement
        })
    };
    a.fn.scrollTo = function(b, e, f) {
        if (typeof e == "object") {
            f = e;
            e = 0
        }
        if (typeof f == "function")f = {onAfter:f};
        if (b == "max")b = 9E9;
        f = a.extend({}, c.defaults, f);
        e = e || f.speed || f.duration;
        f.queue = f.queue && f.axis.length > 1;
        if (f.queue)e /= 2;
        f.offset = d(f.offset);
        f.over = d(f.over);
        return this._scrollable().each(
                function() {
                    function j(F) {
                        l.animate(u, e, f.easing, F && function() {
                            F.call(this, b, f)
                        })
                    }

                    var h = this,l = a(h),o = b,r,u = {},C = l.is("html,body");
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
                            if (o.is || o.style)r = (o = a(o)).offset()
                    }
                    a.each(f.axis.split(""), function(F, x) {
                        var I = x == "x" ? "Left" : "Top",G = I.toLowerCase(),H = "scroll" + I,A = h[H],N = c.max(h, x);
                        if (r) {
                            u[H] = r[G] + (C ? 0 : A - l.offset()[G]);
                            if (f.margin) {
                                u[H] -= parseInt(o.css("margin" + I)) || 0;
                                u[H] -= parseInt(o.css("border" + I + "Width")) || 0
                            }
                            u[H] += f.offset[G] || 0;
                            if (f.over[G])u[H] += o[x == "x" ? "width" : "height"]() * f.over[G]
                        } else {
                            I = o[G];
                            u[H] = I.slice && I.slice(-1) == "%" ? parseFloat(I) / 100 * N : I
                        }
                        if (/^\d+$/.test(u[H]))u[H] = u[H] <= 0 ?
                                0 : Math.min(u[H], N);
                        if (!F && f.queue) {
                            A != u[H] && j(f.onAfterFirst);
                            delete u[H]
                        }
                    });
                    j(f.onAfter)
                }).end()
    };
    c.max = function(b, e) {
        var f = e == "x" ? "Width" : "Height",j = "scroll" + f;
        if (!a(b).is("html,body"))return b[j] - a(b)[f.toLowerCase()]();
        f = "client" + f;
        var h = b.ownerDocument.documentElement,l = b.ownerDocument.body;
        return Math.max(h[j], l[j]) - Math.min(h[f], l[f])
    }
})(jQuery);
(function(a) {
    a.fn.konami = function(d, c) {
        var b = this;
        c = a.extend({}, a.fn.konami.params, c);
        this.bind("konami", d).bind("keyup", function(e) {
            b.checkCode(e)
        });
        this.checkCode = function(e) {
            c.timeout && clearTimeout(c.timeout);
            if (e.keyCode == c.code[c.step])c.step++; else c.step = 0;
            if (c.step == c.code.length) {
                b.trigger("konami");
                c.step = 0
            } else if (c.step > 0)c.timeout = setTimeout(b.reset, c.delay)
        };
        this.reset = function() {
            c.step = 0
        };
        return this
    };
    a.fn.konami.params = {code:[38,38,40,40,37,39,37,39,66,65],step:0,delay:500}
})(jQuery);
jQuery.cookie = function(a, d, c) {
    if (arguments.length > 1 && String(d) !== "[object Object]") {
        c = jQuery.extend({}, c);
        if (d === null || d === undefined)c.expires = -1;
        if (typeof c.expires === "number") {
            var b = c.expires,e = c.expires = new Date;
            e.setDate(e.getDate() + b)
        }
        d = String(d);
        return document.cookie = [encodeURIComponent(a),"=",c.raw ? d : encodeURIComponent(d),c.expires ? "; expires=" + c.expires.toUTCString() : "",c.path ? "; path=" + c.path : "",c.domain ? "; domain=" + c.domain : "",c.secure ? "; secure" : ""].join("")
    }
    c = d || {};
    e = c.raw ? function(f) {
        return f
    } :
            decodeURIComponent;
    return(b = RegExp("(?:^|; )" + encodeURIComponent(a) + "=([^;]*)").exec(document.cookie)) ? e(b[1]) : null
};
(function(a) {
    function d(j) {
        if (e === j.target) {
            b();
            e = null
        } else if (j.target !== c.target) {
            b();
            e = null;
            a(this).unbind("click", d)
        } else e = j.target
    }

    var c,b,e,f;
    a(document).bind("contextmenu", b);
    a.fn.jjmenu = function(j, h, l, o) {
        function r(F, x, I, G, H) {
            function A() {
                var ca = a(W).css("display") == "none" ? true : false,ea = false;
                if (H.orientation == "top" || H.orientation == "bottom")ea = true;
                a(W).show();
                a(".jj_menu_item:first", W).addClass("first_menu_item");
                a(".jj_menu_item:last", W).addClass("last_menu_item");
                ea = a(W).offset().top;
                var m = a(W).offset().left,U = parseInt(a(W).outerHeight(), 10),sa = parseInt(a(W).outerWidth(), 10),ya = ea - a(window).scrollTop();
                ca && a(W).hide();
                a(W).css({left:m + "px"});
                var Da = m;
                if (H.spill === "left") {
                    Da = m - sa;
                    a(W).addClass("spill_left").prevAll(".jjmenu").each(function(Ba, y) {
                        Da -= a(y).outerWidth() + 1
                    })
                } else if (m + sa > a(window).width()) {
                    Da = m - sa;
                    if (a(W).attr("id") == "jjmenu_main" && H.xposition == "auto")Da += a(G).outerWidth();
                    a(W).prev(".jjmenu").addClass("spill_left").each(function(Ba, y) {
                        Da -= a(y).outerWidth() + 1
                    })
                } else if (a(W).attr("id").match("jjmenu_main_sub"))Da +=
                        2;
                ca = true;
                if (H.yposition == "auto" && H.xposition == "left") {
                    if (ya + U + a(G).outerHeight() > a(window).height())ca = false
                } else if (ya + U > a(window).height())ca = false;
                ya = true;
                if (ea - U < 0)ya = false;
                if (H.yposition == "bottom")ea += a(G).outerHeight();
                if (H.orientation == "auto" && (ca || !ya || a(W).attr("id").match("jjmenu_main_sub")) || H.orientation == "bottom") {
                    if (ea + U > a(window).height())ea = a(window).height() - U; else {
                        if (H.yposition == "auto" && H.xposition == "left")ea = ea + a(G).outerHeight() + 1; else if (a(W).attr("id").match("jjmenu_main_sub"))ea -=
                                7;
                        ea = ea
                    }
                    a(W).addClass("bottomOriented")
                } else {
                    ea = ea - U < 0 ? a(window).height() - U : a(W).attr("id").match("jjmenu_main_sub") ? ea - U + 6 + a(G).outerHeight() : H.yposition == "mouse" ? ea - U + 10 : ea - U;
                    a(W).addClass("topOriented")
                }
                a(W).css({top:ea + "px",left:Da + "px"})
            }

            function N(ca) {
                if (ca.hasOwnProperty("title") || _.defined(ca.customClass) && ca.customClass === "separator") {
                    var ea = document.createElement("div");
                    a(ea).append(a('<span class="icon"></span><span class="more"></span>'));
                    a(ea).hover(function() {
                                a(this).addClass("jj_menu_item_hover")
                            },
                            function() {
                                a(this).removeClass("jj_menu_item_hover")
                            });
                    a(ea).click(function() {
                        ba(ca.action);
                        if (ca.type !== "sub") {
                            a("div[id^=jjmenu]").remove();
                            u.removeClass("active-context")
                        }
                    });
                    var m = document.createElement("span");
                    a(ea).append(m);
                    a(m).addClass("jj_menu_item_text");
                    switch (ca.type) {
                        case "sub":
                            ea.className = "jj_menu_item jj_menu_item_more";
                            a(ea).append(a('<span class="more"></span>'));
                            a(ea).mouseenter(function() {
                                new r(F + "_sub", ca.src, I, this, H);
                                ba(ca.action)
                            });
                            break;
                        default:
                            a(ea).hover(function() {
                                a("div[id^=jjmenu_" +
                                        F + "_sub]").remove()
                            });
                            ea.className = "jj_menu_item";
                            break
                    }
                    ca.customClass && ca.customClass.length > 0 && jQuery(ea).addClass(ca.customClass);
                    if (ca.useEllipsis) {
                        a(m).addClass("ellipsis").attr("title", K(ca.title));
                        a(m).html(K(ca.title))
                    } else if (ca.title) {
                        a(m).html(K(ca.title)).attr("title", K(ca.title));
                        a(m).html(K(ca.title))
                    }
                    a(ka).append(ea)
                }
            }

            function ba(ca) {
                if (ca)switch (ca.type) {
                    case "gourl":
                        if (ca.target) {
                            window.open(K(ca.url), ca.target).focus();
                            return false
                        } else document.location.href = K(ca.url);
                        break;
                    case "ajax":
                        a.getJSON(K(ca.url),
                                function(m) {
                                    var U = eval(ca.callback);
                                    typeof U == "function" && U(m)
                                });
                        break;
                    case "fn":
                        var ea = eval(ca.callback);
                        typeof ea == "function" && ea(I);
                        break
                }
            }

            function K(ca) {
                if (I)for (var ea in I)ca = ca.replace("#" + ea + "#", eval("myReplaces." + ea));
                return ca
            }

            if (F == "main")window.triggerElement = G;
            H = function(ca, ea) {
                var m = {show:"default",xposition:"right",yposition:"auto",orientation:"auto"};
                if (!ea)return m;
                if (!ea.show)ea.show = "default";
                var U = ea.show;
                if (!ea.xposition)ea.xposition = "right";
                if (!ea.yposition)ea.yposition = "auto";
                if (!ea.orientation)ea.orientation = "auto";
                if (!ea.spill)ea.spill = "auto";
                if (ca != "main") {
                    var sa = m;
                    sa.show = U;
                    sa.spill = ea.spill
                }
                return ca == "main" ? ea : sa
            }(F, H);
            var W = document.createElement("div"),ka = document.createElement("span");
            a("div[id^=jjmenu_" + F + "]").remove();
            a(W).append(ka);
            W.className = "jjmenu";
            if (H.className)W.className += " " + H.className;
            W.id = "jjmenu_" + F;
            a(W).css({display:"none"});
            if (!u.copy && u.is(".jjcopy")) {
                u.copy = u.clone();
                a(document.body).append(u.copy);
                u.copy.css({position:"absolute","z-index":100001,
                    top:u.offset().top,left:u.offset().left}).addClass("active-context copy")
            }
            a(document.body).append(W);
            (function() {
                var ca = a(G).offset(),ea = ca.left,m = ca.top;
                ea = H.xposition == "left" || H.xposition == "auto" ? ca.left : ca.left + a(G).outerWidth();
                if (H.xposition == "mouse")ea = Math.max(u.pageX - 5, 0);
                if (H.yposition == "mouse")m = Math.max(u.pageY - 5, 0);
                a(W).css({position:"absolute",top:m + "px",left:ea + "px"})
            })();
            var fa = false;
            for (var ha in x)if (x[ha].get) {
                fa = true;
                a.getJSON(K(x[ha].get), function(ca) {
                    for (var ea in ca)N(ca[ea]);
                    A()
                });
                a(this).ajaxError(function() {
                    A()
                })
            } else if (x[ha].getByService)x[ha].getByService(function(ca) {
                x[ha].dataHandler(ca, function(ea) {
                    for (var m in ea)N(ea[m]);
                    A()
                })
            }); else if (x[ha].getByFunction) {
                var qa = (typeof x[ha].getByFunction == "function" ? x[ha].getByFunction : eval(x[ha].getByFunction))(I);
                for (var aa in qa)N(qa[aa]);
                A()
            } else N(x[ha]);
            fa || A();
            (function() {
                if (!H || H.show == "default")a(W).show(); else {
                    var ca = parseInt(H.speed);
                    ca = isNaN(ca) ? 500 : ca;
                    switch (H.show) {
                        case "fadeIn":
                            a(W).fadeIn(ca);
                            break;
                        case "slideDown":
                            a(W).slideDown(ca);
                            break;
                        case "slideToggle":
                            a(W).slideToggle(ca);
                            break;
                        default:
                            a(W).show();
                            break
                    }
                }
                if (a(W).is("#jjmenu_main")) {
                    a.publish("gs.menu.show");
                    a(W).bind("remove", function() {
                        a.publish("gs.menu.hide")
                    })
                }
            })()
        }

        var u = this;
        u.pageX = j.pageX;
        u.pageY = j.pageY;
        j.preventDefault();
        c = j;
        b = function() {
            a(".active-context").removeClass("active-context");
            a("div[id^=jjmenu]").remove();
            u.copy && u.copy.remove()
        };
        if (typeof o.keepState !== "undefined") {
            var C = a(o.keepState);
            f && f[0] !== C[0] && f.blur();
            if (C[0].nodeName.toUpperCase() === "A") {
                C.attr("href");
                f = C
            } else f = undefined;
            C.trigger("focus").one("mousedown",
                    function() {
                        C.unbind("blur")
                    }).one("blur", function() {
                        C.removeClass("active-context")
                    })
        }
        a(document).unbind("click contextmenu", d).bind("click contextmenu", d);
        a(this).parents().one("scroll", b);
        new r("main", h, l, this, o)
    }
})(jQuery);
if (typeof jQuery === "undefined")throw Error("SlickGrid requires jquery module to be loaded");
if (!jQuery.fn.drag)throw Error("SlickGrid requires jquery.event.drag module to be loaded");
(function(a) {
    function d() {
        var b = null;
        this.isActive = function(e) {
            return e ? b === e : b !== null
        };
        this.activate = function(e) {
            if (e !== b) {
                if (b !== null)throw"SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController";
                if (!e.commitCurrentEdit)throw"SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()";
                if (!e.cancelCurrentEdit)throw"SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()";
                b = e
            }
        };
        this.deactivate = function(e) {
            if (b !==
                    e)throw"SlickGrid.EditorLock.deactivate: specified editController is not the currently active one";
            b = null
        };
        this.commitCurrentEdit = function() {
            return b ? b.commitCurrentEdit() : true
        };
        this.cancelCurrentEdit = function() {
            return b ? b.cancelCurrentEdit() : true
        }
    }

    var c;
    a.extend(true, window, {Slick:{Grid:function(b, e, f, j) {
        function h() {
            qa(a(j.scrollPane)[0].scrollTop, true)
        }

        function l() {
            var s = a("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body"),
                    w = {width:s.width() - s[0].clientWidth,height:s.height() - s[0].clientHeight};
            s.remove();
            return w
        }

        function o(s) {
            La.outerWidth(s);
            mb = s > $b - c.width
        }

        function r(s) {
            s && s.jquery && s.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function() {
                return false
            })
        }

        function u() {
            return lb.length
        }

        function C(s) {
            return lb[s]
        }

        function F() {
            function s() {
                a(this).addClass("ui-state-hover")
            }

            function w() {
                a(this).removeClass("ui-state-hover")
            }

            var J;
            $a.empty();
            q = {};
            var Y;
            for (J = 0; J < f.length; J++) {
                var V = f[J] =
                        a.extend({}, Wb, f[J]);
                q[V.id] = J;
                Y = V.columnFormatter ? V.columnFormatter(V) : "<span class='slick-column-name'>" + V.name + "</span>";
                Y = a("<div class='ui-state-default slick-header-column slick-header-column-" + V.id + "' id='" + Fb + V.id + "'/>").html(Y).width(V.width - Gb).css({left:"10000px","z-index":f.length - J}).attr("title", V.toolTip || "").data("fieldId", V.id).appendTo($a);
                V.currentWidth = 0;
                if (j.enableColumnReorder || V.sortable)Y.hover(s, w);
                if (V.collapsable) {
                    Y.append("<a class='slick-collapse-indicator' />");
                    a(".slick-collapse-indicator").width(c.width -
                            1);
                    a(".slick-collapse-indicator").css("marginRight", -c.width);
                    a(".slick-collapse-indicator").css("marginLeft", c.width / 2 - 3.5 + 1)
                }
                V.sortable && Y.append("<span class='slick-sort-indicator' />")
            }
            W(z, D);
            G();
            j.enableColumnReorder && I()
        }

        function x() {
            $a.click(function(s) {
                if (!(a(s.target).hasClass("slick-resizable-handle") || a(s.target).hasClass("slick-collapse-indicator")))if (Ca.onSort) {
                    s = a(s.target).closest(".slick-header-column");
                    if (s.length) {
                        s = f[Fa(s[0])];
                        if (s.sortable)if (j.editorLock.commitCurrentEdit()) {
                            if (s.id ===
                                    z)D = !D; else {
                                z = s.id;
                                D = true
                            }
                            W(z, D);
                            Ca.onSort(s, D)
                        }
                    }
                }
            })
        }

        function I() {
            $a.sortable({containment:"parent",axis:"x",cursor:"default",tolerance:"intersection",helper:"clone",placeholder:"slick-sortable-placeholder ui-state-default slick-header-column",forcePlaceholderSize:true,start:function(s, w) {
                a(w.helper).addClass("slick-header-column-active")
            },beforeStop:function(s, w) {
                a(w.helper).removeClass("slick-header-column-active")
            },stop:function(s) {
                if (j.editorLock.commitCurrentEdit()) {
                    for (var w = $a.sortable("toArray"),
                                 J = [],Y = 0; Y < w.length; Y++)J.push(f[N(w[Y].replace(Fb, ""))]);
                    ha(J);
                    Ca.onColumnsReordered && Ca.onColumnsReordered();
                    s.stopPropagation();
                    G()
                } else a(this).sortable("cancel")
            }})
        }

        function G() {
            var s,w,J,Y,V,ta,t,B,L;
            Y = $a.children();
            Y.find(".slick-resizable-handle").remove();
            Y.each(function(M) {
                if (f[M].resizable) {
                    if (t === undefined)t = M;
                    B = M
                }
            });
            Y.each(function(M, R) {
                a(R);
                t !== undefined && M < t || j.forceFitColumns && M >= B ? a("<div class='slick-resizable-handle' />").appendTo(R) : a("<div class='slick-resizable-handle'><span></span></div>").appendTo(R).bind("dragstart",
                        function(S) {
                            if (!j.editorLock.commitCurrentEdit())return false;
                            J = S.pageX;
                            a(this).parent().addClass("slick-header-column-active");
                            var ma = S = null;
                            Y.each(function(za, E) {
                                f[za].previousWidth = a(E).outerWidth()
                            });
                            if (j.forceFitColumns) {
                                ma = S = 0;
                                for (s = M + 1; s < Y.length; s++) {
                                    w = f[s];
                                    if (w.resizable) {
                                        if (ma !== null)if (w.maxWidth)ma += w.maxWidth - w.previousWidth; else ma = null;
                                        S += w.previousWidth - Math.max(w.minWidth || 0, ob)
                                    }
                                }
                            }
                            var da = 0,wa = 0;
                            for (s = 0; s <= M; s++) {
                                w = f[s];
                                if (w.resizable) {
                                    if (wa !== null)if (w.maxWidth)wa += w.maxWidth - w.previousWidth;
                                    else wa = null;
                                    da += w.previousWidth - Math.max(w.minWidth || 0, ob)
                                }
                            }
                            if (S === null)S = 1E5;
                            if (da === null)da = 1E5;
                            if (ma === null)ma = 1E5;
                            if (wa === null)wa = 1E5;
                            ta = J + Math.min(S, wa);
                            V = J - Math.min(da, ma);
                            L = La.width()
                        }).bind("drag",
                        function(S, ma) {
                            ma.clientX = S.clientX;
                            ma.clientY = S.clientY;
                            var da,wa = Math.min(ta, Math.max(V, S.pageX)) - J,za;
                            if (wa < 0) {
                                za = wa;
                                for (s = M; s >= 0; s--) {
                                    w = f[s];
                                    if (w.resizable) {
                                        da = Math.max(w.minWidth || 0, ob);
                                        if (za && w.previousWidth + za < da) {
                                            za += w.previousWidth - da;
                                            K(s, da, j.syncColumnCellResize)
                                        } else {
                                            K(s, w.previousWidth +
                                                    za, j.syncColumnCellResize);
                                            za = 0
                                        }
                                    }
                                }
                                if (j.forceFitColumns) {
                                    za = -wa;
                                    for (s = M + 1; s < Y.length; s++) {
                                        w = f[s];
                                        if (w.resizable)if (za && w.maxWidth && w.maxWidth - w.previousWidth < za) {
                                            za -= w.maxWidth - w.previousWidth;
                                            K(s, w.maxWidth, j.syncColumnCellResize)
                                        } else {
                                            K(s, w.previousWidth + za, j.syncColumnCellResize);
                                            za = 0
                                        }
                                    }
                                } else j.syncColumnCellResize && o(L + wa)
                            } else {
                                za = wa;
                                for (s = M; s >= 0; s--) {
                                    w = f[s];
                                    if (w.resizable)if (za && w.maxWidth && w.maxWidth - w.previousWidth < za) {
                                        za -= w.maxWidth - w.previousWidth;
                                        K(s, w.maxWidth, j.syncColumnCellResize)
                                    } else {
                                        K(s,
                                                w.previousWidth + za, j.syncColumnCellResize);
                                        za = 0
                                    }
                                }
                                if (j.forceFitColumns) {
                                    za = -wa;
                                    for (s = M + 1; s < Y.length; s++) {
                                        w = f[s];
                                        if (w.resizable) {
                                            da = Math.max(w.minWidth || 0, ob);
                                            if (za && w.previousWidth + za < da) {
                                                za += w.previousWidth - da;
                                                K(s, da, j.syncColumnCellResize)
                                            } else {
                                                K(s, w.previousWidth + za, j.syncColumnCellResize);
                                                za = 0
                                            }
                                        }
                                    }
                                } else j.syncColumnCellResize && o(L + wa)
                            }
                        }).bind("dragend", function() {
                            var S;
                            a(this).parent().removeClass("slick-header-column-active");
                            for (s = 0; s < Y.length; s++) {
                                w = f[s];
                                S = a(Y[s]).outerWidth();
                                w.previousWidth !==
                                        S && w.rerenderOnResize && m();
                                w.width = j.forceFitColumns ? Math.floor(w.width * (S - w.previousWidth) / w.previousWidth) + w.width : S;
                                !j.syncColumnCellResize && w.previousWidth !== S && K(s, S, true)
                            }
                            y();
                            Ca.onColumnsResized && Ca.onColumnsResized()
                        })
            })
        }

        function H() {
            function s(w) {
                return{start:{row:Math.min(w.start.row, w.end.row),cell:Math.min(w.start.cell, w.end.cell)},end:{row:Math.max(w.start.row, w.end.row),cell:Math.max(w.start.cell, w.end.cell)}}
            }

            La.bind("draginit",
                    function(w, J) {
                        var Y = a(w.target).closest(".slick-cell");
                        if (Y.length === 0)return false;
                        if (parseInt(Y.parent().attr("row"), 10) >= Va())return false;
                        Y = f[Fa(Y[0])];
                        if (Y.behavior == "move" || Y.behavior == "selectAndMove")J.mode = 1; else if (j.enableCellRangeSelection)J.mode = 2; else return false;
                        J.proxyOffsetX = 0;
                        J.proxyOffsetY = 0
                    }).bind("dragstart",
                    function(w, J) {
                        if (!j.editorLock.commitCurrentEdit())return false;
                        var Y = parseInt(a(w.target).closest(".slick-row").attr("row"), 10),V,ta,t = [];
                        V = GS.Controllers.PageController.getActiveController();
                        if (J.mode == 1) {
                            p[Y] || a(w.target).click();
                            J.draggedItemsContext = V.getPlayContext();
                            J.draggedItems = [];
                            J.draggedItemsSource = "grid";
                            if (J.draggedItemsContext.type == "playlist" && J.draggedItemsContext.data.userID == GS.user.UserID) {
                                var B = GS.Models.Playlist.getOneFromCache(J.draggedItemsContext.data.playlistID),L = [];
                                ta = a(".gs_grid:last").controller().selectedRowIDs;
                                for (Y = 0; Y < ta.length; Y++) {
                                    var M = B.gridKeyLookup[ta[Y]];
                                    M && L.push(B.songs.indexOf(M))
                                }
                                if (B && L.length)J.deleteAction = {label:L.length > 1 ? "SHORTCUTS_DELETE_FROM_PLAYLIST_COUNT" : "SHORTCUTS_DELETE_FROM_PLAYLIST",
                                    labelParams:{count:L.length},method:function() {
                                        B.removeSongs(L)
                                    }}
                            }
                            if (j.isFilter) {
                                var R = a("#page .gs_grid.songs").controller().dataView.rows;
                                R.sort(function(S, ma) {
                                    return S - ma
                                });
                                for (Y = 0; Y < R.length; Y++)J.draggedItems.push(R[Y]);
                                R = [];
                                for (Y = 0; Y < n.length; Y++)R.push(Ra(n[Y]))
                            } else {
                                n.sort(function(S, ma) {
                                    return S - ma
                                });
                                for (Y = 0; Y < n.length; Y++) {
                                    ta = Ra(n[Y]);
                                    J.draggedItems.push(ta);
                                    ta.queueSongID && t.push(ta.queueSongID)
                                }
                            }
                            J.draggedItemsType = J.draggedItemsType || _.guessDragType(J.draggedItems);
                            if (J.draggedItemsType ==
                                    "playlist" && J.draggedItems.length == 1)if ((B = GS.Models.Playlist.getOneFromCache(J.draggedItems[0].PlaylistID)) && B.UserID == GS.user.UserID)J.deleteAction = {label:"SHORTCUTS_DELETE_PLAYLIST",method:function() {
                                GS.user.deletePlaylist(B.PlaylistID, true)
                            }};
                            if (V.Class.shortName === "NowPlayingController" && t.length)J.deleteAction = {label:t.length > 1 ? "SHORTCUTS_DELETE_NOW_PLAYING_COUNT" : "SHORTCUTS_DELETE_NOW_PLAYING",labelParams:{count:t.length},method:function() {
                                GS.player.removeSongs(t)
                            }};
                            if (J.draggedItemsContext.type ==
                                    "user" && J.draggedItemsContext.data.userID == GS.user.UserID)J.deleteAction = {label:J.draggedItems.length > 1 ? "SHORTCUTS_DELETE_FROM_LIBRARY_COUNT" : "SHORTCUTS_DELETE_FROM_LIBRARY",labelParams:{count:J.draggedItems.length},method:function() {
                                _.forEach(J.draggedItems, function(S) {
                                    GS.user.removeFromLibrary(S.SongID)
                                })
                            }};
                            V = a("<div class='slick-reorder-proxy'/>").css({position:"absolute",zIndex:"99999","min-height":"50px","padding-right":"50px"}).appendTo("body").mousewheel(_.globalDragProxyMousewheel);
                            if (j.dragProxy)j.isFilter &&
                                    R ? V.html(j.dragProxy(R)) : V.html(j.dragProxy(J.draggedItems)); else V.html('<div class="status"></div><span class="info"><span class="text">' + J.draggedItems.length + "</span></span>");
                            J.proxyOffsetX = Math.floor(V.width() / 2) + 15;
                            J.proxyOffsetY = V.height() * 2 - 52;
                            GS.getGuts().gaTrackEvent("grid", "dragStart");
                            a.publish("gs.drag.start", J);
                            return V
                        }
                        if (J.mode == 2) {
                            V = kb(J.startX - La.offset().left, J.startY - La.offset().top);
                            if (!jb(V.row, V.cell))return false;
                            J.range = {start:V,end:{}};
                            V = a("<div class='slick-selection'></div>").appendTo(La);
                            J.proxyOffsetX = Math.floor(V.width() / 2) + 15;
                            J.proxyOffsetY = V.height() * 2 - 52;
                            return V
                        }
                    }).bind("drag",
                    function(w, J) {
                        J.clientX = w.clientX;
                        J.clientY = w.clientY;
                        if (J.mode == 1) {
                            a(J.proxy).css("top", w.clientY - J.proxyOffsetY).css("left", w.clientX - J.proxyOffsetX);
                            var Y = false,V = false;
                            _.forEach(J.drop, function(B) {
                                a.isFunction(B.updateDropOnDrag) && B.updateDropOnDrag(w, J);
                                if (!Y)if (a(B).within(w.clientX, w.clientY).length > 0)if (a(B).data("ignoreForOverDrop"))V = true; else {
                                    V = false;
                                    Y = true
                                }
                            });
                            V || (Y ? a(J.proxy).addClass("valid").removeClass("invalid") :
                                    a(J.proxy).addClass("invalid").removeClass("valid"))
                        }
                        if (J.mode == 2) {
                            var ta = kb(w.clientX - La.offset().left, w.clientY - La.offset().top);
                            if (jb(ta.row, ta.cell)) {
                                J.range.end = ta;
                                var t = s(J.range);
                                ta = bc(t.start.row, t.start.cell);
                                t = bc(t.end.row, t.end.cell);
                                a(J.proxy).css({top:ta.top,left:ta.left,height:t.bottom - ta.top - 2,width:t.right - ta.left - 2})
                            }
                        }
                    }).bind("dragend", function(w, J) {
                        a(J.proxy).remove();
                        var Y = Na.within(w.clientX, w.clientY).length > 0;
                        J.mode == 2 && Y && Ca.onCellRangeSelected && Ca.onCellRangeSelected(s(J.range));
                        a.publish("gs.drag.end", J)
                    })
        }

        function A() {
            var s = a("<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>").appendTo($a);
            Gb = s.outerWidth() - s.width();
            pc = s.outerHeight() - s.height();
            s.remove();
            var w = a("<div class='slick-row' />").appendTo(La);
            s = a("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(w);
            Tb = s.outerWidth() - s.width();
            Ib = s.outerHeight() - s.height();
            w.remove();
            ob = Math.max(Gb, Tb)
        }

        function N(s) {
            return q[s]
        }

        function ba() {
            var s,w,J,Y = {},V = Na.width();
            V = nb ? V - c.width : V;
            var ta = 0;
            for (s = 0; s < f.length; s++) {
                w = f[s];
                J = w.currentWidth || w.width;
                ta += J;
                Y[w.id] = J
            }
            V = V - ta;
            if (V !== 0) {
                var t = V > 0,B = f.concat().sort(function(M) {
                    return t ? M.maxWidth ? -1 : 1 : M.minWidth !== ob && M.minWidth !== Wb.minWidth ? -1 : 1
                }),L;
                for (s = 0; s < B.length; s++) {
                    w = B[s];
                    J = w.currentWidth || w.width;
                    L = Math.ceil(V * (J / ta));
                    if (!t && J + L < w.minWidth)L = Math.max(w.minWidth, 0) - J;
                    if (t && J + L > w.maxWidth)L = w.maxWidth - J;
                    V -= L;
                    ta -= J;
                    if (w.resizable)Y[w.id] += L
                }
                for (s = 0; s < f.length; s++)K(s, Y[f[s].id], true)
            }
        }

        function K(s, w, J) {
            f[s].currentWidth =
                    w;
            $a.children().eq(s).css("width", w - Gb);
            J && a("." + Fb + " .c" + s).css("width", w - Tb + "px")
        }

        function W(s, w) {
            z = s;
            D = w;
            var J = q[z];
            $a.children().removeClass("slick-header-column-sorted");
            $a.find(".slick-sort-indicator").removeClass("slick-sort-indicator-asc").removeClass("slick-sort-indicator-desc");
            if (J != null)$a.children().eq(J).addClass("slick-header-column-sorted").find(".slick-sort-indicator").addClass(D ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc")
        }

        function ka() {
            return n.concat()
        }

        function fa(s) {
            var w,
                    J,Y,V,ta = {};
            for (w = 0; w < s.length; w++)ta[s[w]] = true;
            for (w = 0; w < n.length; w++) {
                J = n[w];
                Ma[J] && !ta[J] && a(Ma[J]).removeClass("ui-state-active selected")
            }
            V = [];
            for (w = 0; w < s.length; w++) {
                J = s[w];
                Y = Ra(J);
                if (!a.isFunction(j.isSelectable) || j.isSelectable(Y)) {
                    Ma[J] && !p[J] && a(Ma[J]).addClass("ui-state-active selected");
                    V.push(J)
                }
            }
            n = V;
            p = ta
        }

        function ha(s) {
            f = s;
            m();
            F();
            y();
            va()
        }

        function qa(s, w) {
            var J = Ua;
            ub = Math.min(yb - 1, Math.floor(s / tb));
            Ua = Math.round(ub * Kb);
            var Y = s - Ua;
            if (Ua != J) {
                var V = ua(Y);
                ea(V.top, V.bottom);
                Z()
            }
            if (ib !=
                    Y) {
                Eb = ib + J < Y + Ua ? 1 : -1;
                Na[0].scrollTop = Vb = Ya = ib = Y;
                Ca.onViewportChanged && Ca.onViewportChanged()
            }
            if (w) {
                clearTimeout(renderTimer);
                setTimeout(function() {
                    Ca.render()
                }, 60)
            }
        }

        function aa(s, w, J) {
            return J === null || J === undefined ? "" : J
        }

        function ca(s) {
            return s.formatter || j.formatterFactory && j.formatterFactory.getFormatter(s) || aa
        }

        function ea(s) {
            for (var w in Ma)if ((w = parseInt(w, 10)) !== Ka && (w < s.top || w > s.bottom))U(w)
        }

        function m() {
            Ea && eb();
            La[0].innerHTML = "";
            Ma = {};
            X = {};
            Xa += cb;
            cb = 0
        }

        function U(s) {
            var w = Ma[s];
            if (w) {
                La[0].removeChild(w);
                delete Ma[s];
                delete X[s];
                cb--;
                Xa++
            }
        }

        function sa(s) {
            var w,J;
            if (s && s.length) {
                Eb = 0;
                var Y = [];
                w = 0;
                for (J = s.length; w < J; w++) {
                    Ea && Ka === w && eb();
                    Ma[s[w]] && Y.push(s[w])
                }
                if (cb > 10 && Y.length === cb)m(); else {
                    w = 0;
                    for (s = Y.length; w < s; w++)U(Y[w])
                }
            }
        }

        function ya(s) {
            sa([s])
        }

        function Da(s) {
            if (Ma[s]) {
                a(Ma[s]).children().each(function(w) {
                    var J = f[w];
                    if (s === Ka && w === Oa && Ea)Ea.loadValue(Ra(Ka)); else this.innerHTML = Ra(s) ? ca(J)(s, w, Ra(s)[J.field], J, Ra(s)) : ""
                });
                O(s)
            }
        }

        function Ba() {
            var s = j.rowHeight * (Va() + (j.enableAddRow ? 1 : 0) + (j.leaveSpaceForNewRows ?
                    Cb - 1 : 0)) + zb * 2;
            j.autoHeight ? Na.height(s).css({"overflow-y":"hidden"}) : Na.height(Wa.innerHeight() - vb.outerHeight() - (j.showSecondaryHeaderRow ? hb.outerHeight() : 0));
            $b = Na.innerWidth();
            Za = Math.min(Na.innerHeight(), a("body").height());
            Cb = Math.ceil(Za / j.rowHeight);
            s = Na.parent().width();
            nb = Na.css("overflow-y") === "auto";
            o(s);
            if (j.scrollPane) {
                a(j.scrollPane).css({"overflow-y":"auto"});
                Wa.css({overflow:"visible",height:"auto","overflow-y":"visible"});
                Na.css({overflow:"visible",height:"auto","overflow-y":"visible"})
            }
            Q();
            la()
        }

        function y() {
            Ba();
            j.forceFitColumns && ba()
        }

        function Q() {
            var s = Va() + (j.enableAddRow ? 1 : 0) + (j.leaveSpaceForNewRows ? Cb - 1 : 0),w = gb,J = Va();
            for (var Y in Ma)Y >= J && U(Y);
            ab = Math.max(j.rowHeight * s, Za - c.height);
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
            if (gb !== w) {
                La.outerHeight(gb);
                Ya = Na[0].scrollTop
            }
            s = Ya + Ua <= ab - Za;
            if (ab == 0 || Ya == 0)ub = Ua = 0; else s ? qa(Ya + Ua) : qa(ab - Za);
            gb != w && j.autoHeight && Ba()
        }

        function ua() {
            return{top:Math.floor((Ya + Ua) / j.rowHeight),bottom:Math.ceil((Ya +
                    Ua + Za) / j.rowHeight) - 1}
        }

        function oa() {
            if (j.enableAsyncPostRender) {
                clearTimeout(pa);
                pa = setTimeout(xa, j.asyncPostRenderDelay)
            }
        }

        function O(s) {
            delete X[s];
            ja = Math.min(ja, s);
            ra = Math.max(ra, s);
            oa()
        }

        function Z() {
            for (var s in Ma)Ma[s].style.top = s * j.rowHeight - Ua + "px"
        }

        function la() {
            var s = ua(),w = ua(void 0),J = Math.round(Za / j.rowHeight);
            w.top -= J;
            w.bottom += J;
            w.top = Math.max(0, w.top);
            w.bottom = Math.min(j.enableAddRow ? Va() : Va() - 1, w.bottom);
            ea(w);
            var Y,V = La[0],ta = cb;
            Y = [];
            var t = [],B = new Date,L = false,M = 0;
            for (J = w.top; J <=
                    w.bottom; J++)if (!Ma[J]) {
                cb++;
                M++;
                t.push(J);
                var R = Y,S = J,ma = Ra(S),da = S < Va() && !ma,wa = void 0,za = void 0;
                wa = "";
                var E = j.rowHeight - Ib;
                za = "slick-row " + (da ? " loading" : "") + (p[S] ? " selected ui-state-active" : "") + (S % 2 == 1 ? " odd" : " even");
                if (j.rowCssClasses)za += " " + j.rowCssClasses(ma, S, e.length);
                if (j.rowAttrs)wa = j.rowAttrs(ma);
                R.push("<div class='ui-widget-content " + za + "' row='" + S + "' style='top:" + (j.rowHeight * S - Ua + zb) + "px' " + wa + ">");
                da = za = 0;
                for (var ga = f.length; da < ga; da++) {
                    var ia = f[da];
                    za = 0;
                    if (da == 0)za += zb;
                    wa = "slick-cell c" +
                            da + (ia.cssClass ? " " + ia.cssClass : "");
                    if (v && v[S] && v[S][ia.id])wa += " " + j.cellHighlightCssClass;
                    za = "height: " + E + "px; line-height:" + E + "px; width: " + ((f[da].currentWidth || f[da].width) - za - Tb) + "px;";
                    R.push("<div class='" + wa + "' style='" + za + "'>");
                    ma && R.push(ca(ia)(S, da, ma[ia.field], ia, ma));
                    R.push("</div>")
                }
                R.push("</div>");
                if (Ja && Ka === J)L = true;
                Ia++
            }
            w = document.createElement("div");
            w.innerHTML = Y.join("");
            J = 0;
            for (Y = w.childNodes.length; J < Y; J++)Ma[t[J]] = V.appendChild(w.firstChild);
            if (L)Ja = a(Ma[Ka]).children().eq(Oa)[0];
            if (cb - ta > 5)k = (new Date - B) / (cb - ta);
            ja = s.top;
            ra = Math.min(j.enableAddRow ? Va() : Va() - 1, s.bottom);
            oa();
            Vb = Ya;
            T = null
        }

        function va() {
            Ya = Na[0].scrollTop;
            var s = Na[0].scrollLeft,w = Math.abs(Ya - ib);
            if (s !== g) {
                g = s;
                vb[0].scrollLeft = s;
                hb[0].scrollLeft = s
            }
            if (w) {
                Eb = ib < Ya ? 1 : -1;
                ib = Ya;
                if (w < Za)qa(Ya + Ua); else {
                    s = Ua;
                    ub = Math.min(yb - 1, Math.floor(Ya * ((ab - Za) / (gb - Za)) * (1 / tb)));
                    Ua = Math.round(ub * Kb);
                    s != Ua && m()
                }
                T && clearTimeout(T);
                if (Math.abs(Vb - Ya) < Za)la(); else T = setTimeout(la, 50);
                Ca.onViewportChanged && Ca.onViewportChanged()
            }
        }

        function xa() {
            for (; ja <=
                           ra;) {
                var s = Eb >= 0 ? ja++ : ra--,w = Ma[s];
                if (!(!w || X[s] || s >= Va())) {
                    var J = Ra(s);
                    w = w.childNodes;
                    for (var Y = 0,V = 0,ta = f.length; Y < ta; ++Y) {
                        var t = f[Y];
                        t.asyncPostRender && t.asyncPostRender(w[V], ja, J, t);
                        ++V
                    }
                    X[s] = true;
                    pa = setTimeout(xa, j.asyncPostRenderDelay);
                    return
                }
            }
        }

        function Fa(s) {
            for (var w = 0; s && s.previousSibling;) {
                w++;
                s = s.previousSibling
            }
            return w
        }

        function Ha(s) {
            if (!(Ca.onKeyDown && !j.editorLock.isActive() && Ca.onKeyDown(s, Ka, Oa)))if (!s.shiftKey && !s.altKey && !s.ctrlKey && !s.metaKey)if (s.which == 27) {
                if (!j.editorLock.isActive())return;
                Xb()
            } else if (s.which == 37)ac(); else if (s.which == 39)bb(); else if (s.which == 38)Zb(); else if (s.which == 40)Pb(); else if (s.which == 9)Qb(); else if (s.which == 13) {
                if (j.editable)if (Ea)Ka === u() ? Pb() : Nb(); else j.editorLock.commitCurrentEdit() && Mb()
            } else return; else if (s.which == 9 && s.shiftKey && !s.ctrlKey && !s.metaKey && !s.altKey)hc(); else return;
            s.stopPropagation();
            s.preventDefault();
            try {
                s.originalEvent.keyCode = 0
            } catch(w) {
            }
        }

        function Pa(s) {
            var w = a(s.target).closest(".slick-cell", La);
            if (w.length !== 0)if (!(Ja === w[0] && Ea !==
                    null)) {
                var J = parseInt(w.parent().attr("row"), 10),Y = Fa(w[0]),V = null,ta = f[Y],t = Ra(J),B = 0;
                if (!(a.isFunction(j.isSelectable) && !j.isSelectable(t))) {
                    if (!Wa.is("slick-grid-focused")) {
                        a(".slick-grid-focused").removeClass("slick-grid-focused");
                        Wa.addClass("slick-grid-focused")
                    }
                    if (t && (ta.behavior === "selectAndMove" || ta.behavior === "select" || s.ctrlKey || s.metaKey || s.shiftKey)) {
                        if (V = j.editorLock.commitCurrentEdit()) {
                            ta = ka();
                            var L = a.inArray(J, ta);
                            if (J == ta && s.timeStamp - B > 750)s.ctrlKey = true;
                            if (j.disableMultiSelect ||
                                    !s.ctrlKey && !s.metaKey && !s.shiftKey)ta = ta.length === 1 && ta[0] == J ? [] : [J]; else if (L === -1 && (s.ctrlKey || s.metaKey))ta.push(J); else if (L !== -1 && (s.ctrlKey || s.metaKey))ta = a.grep(ta, function(R) {
                                return R !== J
                            }); else if (ta.length && s.shiftKey) {
                                B = ta.pop();
                                var M = Math.min(J, B);
                                L = Math.max(J, B);
                                ta = [];
                                for (M = M; M <= L; M++)M !== B && ta.push(M);
                                ta.push(B)
                            }
                            cc();
                            fa(ta);
                            Ca.onSelectedRowsChanged && Ca.onSelectedRowsChanged();
                            if (t && Ca.onClick)if (V = j.editorLock.commitCurrentEdit())if (Ca.onClick(s, J, Y)) {
                                s.stopPropagation();
                                s.preventDefault();
                                return
                            }
                        }
                        if (s.ctrlKey || s.metaKey || s.shiftKey)return
                    }
                    if (t && Ca.onClick)if (V = j.editorLock.commitCurrentEdit())if (Ca.onClick(s, J, Y)) {
                        s.stopPropagation();
                        s.preventDefault()
                    }
                    if (j.enableCellNavigation && !f[Y].unselectable)if (V === true || V === null && j.editorLock.commitCurrentEdit()) {
                        Ob(J, false);
                        Lb(w[0], J === u() || j.autoEdit)
                    }
                    B = s.timeStamp
                }
            }
        }

        function Qa(s) {
            var w = a(s.target).closest(".slick-cell", La);
            if (w.length !== 0)if (!(Ja === w[0] && Ea !== null)) {
                var J = parseInt(w.parent().attr("row"), 10);
                w = Fa(w[0]);
                var Y = null;
                if (Ra(J) &&
                        Ca.onContextMenu)(Y = j.editorLock.commitCurrentEdit()) && Ca.onContextMenu(s, J, w) && s.preventDefault()
            }
        }

        function sb(s) {
            var w = a(s.target).closest(".slick-cell", La);
            if (w.length !== 0)if (!(Ja === w[0] && Ea !== null)) {
                var J = parseInt(w.parent().attr("row"), 10);
                w = Fa(w[0]);
                var Y = null;
                if (Ra(J) && Ca.onDblClick)(Y = j.editorLock.commitCurrentEdit()) && Ca.onDblClick(s, J, w) && s.preventDefault();
                j.editable && gc(J, w, true)
            }
        }

        function wb(s) {
            if (Ca.onHeaderContextMenu && j.editorLock.commitCurrentEdit()) {
                s.preventDefault();
                var w = a(s.target).closest(".slick-header-column",
                        ".slick-header-columns");
                Ca.onHeaderContextMenu(s, f[Ca.getColumnIndex(w.data("fieldId"))])
            }
        }

        function fb(s) {
            var w = a(s.target).closest(".slick-header-column");
            if (w.length != 0) {
                w = f[Fa(w[0])];
                if (Ca.onHeaderClick && j.editorLock.commitCurrentEdit()) {
                    s.preventDefault();
                    Ca.onHeaderClick(s, w)
                }
            }
        }

        function db(s) {
            if (j.enableAutoTooltips) {
                s = a(s.target).closest(".slick-cell", La);
                if (s.length)if (s.innerWidth() < s[0].scrollWidth) {
                    var w = a.trim(s.text());
                    s.attr("title", j.toolTipMaxLength && w.length > j.toolTipMaxLength ? w.substr(0,
                            j.toolTipMaxLength - 3) + "..." : w)
                } else s.attr("title", "")
            }
        }

        function jb(s, w) {
            return!(s < 0 || s >= Va() || w < 0 || w >= f.length)
        }

        function kb(s, w) {
            for (var J = Math.floor((w + Ua) / j.rowHeight),Y = 0,V = 0,ta = 0; ta < f.length && V < s; ta++) {
                V += f[ta].width;
                Y++
            }
            return{row:J,cell:Y - 1}
        }

        function bc(s, w) {
            if (!jb(s, w))return null;
            for (var J = s * j.rowHeight - Ua,Y = J + j.rowHeight - 1,V = 0,ta = 0; ta < w; ta++)V += f[ta].width;
            return{top:J,left:V,bottom:Y,right:V + f[w].width}
        }

        function cc() {
            dc(null, false)
        }

        function pb() {
            a(Ja).attr("tabIndex", 0).attr("hideFocus",
                    true);
            if (a.browser.msie && parseInt(a.browser.version) < 8) {
                Ja.setActive();
                var s = a(Ja).position().left,w = s + a(Ja).outerWidth(),J = Na.scrollLeft(),Y = J + Na.width();
                if (s < J)Na.scrollLeft(s); else w > Y && Na.scrollLeft(Math.min(s, w - Na[0].clientWidth))
            } else Ja.focus()
        }

        function dc(s, w) {
            if (Ja !== null) {
                eb();
                a(Ja).removeClass("selected")
            }
            Ja = s;
            if (Ja !== null) {
                Ka = parseInt(a(Ja).parent().attr("row"), 10);
                Oa = Fa(Ja);
                a(Ja).addClass("selected");
                if (j.editable && w && ec(Ka, Oa)) {
                    clearTimeout(P);
                    if (j.asyncEditorLoading)P = setTimeout(Mb,
                            j.asyncEditorLoadDelay); else Mb()
                } else pb();
                Ca.onCurrentCellChanged && Ca.onCurrentCellChanged(fc())
            } else Oa = Ka = null
        }

        function Lb(s, w) {
            dc(s, w);
            s ? fa([Ka]) : fa([]);
            Ca.onSelectedRowsChanged && Ca.onSelectedRowsChanged()
        }

        function ec(s, w) {
            if (s < Va() && !Ra(s))return false;
            if (f[w].cannotTriggerInsert && s >= Va())return false;
            if (!(f[w].editor || j.editorFactory && j.editorFactory.getEditor(f[w])))return false;
            return true
        }

        function eb() {
            if (Ea) {
                Ca.onBeforeCellEditorDestroy && Ca.onBeforeCellEditorDestroy(Ea);
                Ea.destroy();
                Ea =
                        null;
                if (Ja) {
                    a(Ja).removeClass("editable invalid");
                    if (Ra(Ka)) {
                        var s = f[Oa];
                        Ja.innerHTML = ca(s)(Ka, Oa, Ra(Ka)[s.field], s, Ra(Ka));
                        O(Ka)
                    }
                }
                if (a.browser.msie)if (document.selection && document.selection.empty)document.selection.empty(); else if (window.getSelection)(s = window.getSelection()) && s.removeAllRanges && s.removeAllRanges();
                j.editorLock.deactivate(Ub)
            }
        }

        function Mb() {
            if (Ja) {
                if (!j.editable)throw"Grid : makeSelectedCellEditable : should never get called when options.editable is false";
                clearTimeout(P);
                if (ec(Ka,
                        Oa))if (Ca.onBeforeEditCell && Ca.onBeforeEditCell(Ka, Oa, Ra(Ka)) === false)pb(); else {
                    j.editorLock.activate(Ub);
                    a(Ja).addClass("editable");
                    Ja.innerHTML = "";
                    var s = f[Oa],w = Ra(Ka);
                    Ea = new (s.editor || j.editorFactory && j.editorFactory.getEditor(s))({grid:Ca,gridPosition:Db(Wa[0]),position:Db(Ja),container:Ja,column:s,item:w || {},commitChanges:Nb,cancelChanges:Xb});
                    w && Ea.loadValue(w);
                    qb = Ea.serializeValue();
                    if (Ea.position)if (Ja) {
                        var J;
                        if (Ca.onCurrentCellPositionChanged) {
                            J = Yb();
                            Ca.onCurrentCellPositionChanged(J)
                        }
                        if (Ea) {
                            J =
                                    J || Yb();
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

        function Db(s) {
            var w = {top:s.offsetTop,left:s.offsetLeft,bottom:0,right:0,width:a(s).outerWidth(),height:a(s).outerHeight(),visible:true};
            w.bottom = w.top + w.height;
            w.right = w.left + w.width;
            for (var J = s.offsetParent; (s = s.parentNode) != document.body;) {
                if (w.visible && s.scrollHeight != s.offsetHeight &&
                        a(s).css("overflowY") != "visible")w.visible = w.bottom > s.scrollTop && w.top < s.scrollTop + s.clientHeight;
                if (w.visible && s.scrollWidth != s.offsetWidth && a(s).css("overflowX") != "visible")w.visible = w.right > s.scrollLeft && w.left < s.scrollLeft + s.clientWidth;
                w.left -= s.scrollLeft;
                w.top -= s.scrollTop;
                if (s === J) {
                    w.left += s.offsetLeft;
                    w.top += s.offsetTop;
                    J = s.offsetParent
                }
                w.bottom = w.top + w.height;
                w.right = w.left + w.width
            }
            return w
        }

        function Yb() {
            return Db(Ja)
        }

        function fc() {
            return Ja ? {row:Ka,cell:Oa} : null
        }

        function Ob(s, w) {
            var J =
                    s * j.rowHeight,Y = (s + 1) * j.rowHeight - Za + (mb ? c.height : 0);
            if ((s + 1) * j.rowHeight > Ya + Za + Ua) {
                qa(w ? J : Y);
                la()
            } else if (s * j.rowHeight < Ya + Ua) {
                qa(w ? Y : J);
                la()
            }
        }

        function xb(s, w, J) {
            function Y() {
                return!f[Fa(this)].unselectable
            }

            if (Ja && j.enableCellNavigation)if (j.editorLock.commitCurrentEdit()) {
                var V = Ma[Ka + s],ta = V && Oa + w >= 0 ? a(V).children().eq(Oa + w).filter(Y) : null;
                if (ta && !ta.length) {
                    var t = a(V).children().filter(
                            function(B) {
                                return w > 0 ? B > Oa + w : B < Oa + w
                            }).filter(Y);
                    if (t && t.length)ta = w > 0 ? t.eq(0) : t.eq(t.length - 1)
                }
                if (J && s === 0 &&
                        !(V && ta && ta.length))if (!ta || !ta.length) {
                    V = Ma[Ka + s + (w > 0 ? 1 : -1)];
                    t = a(V).children().filter(Y);
                    ta = w > 0 ? V ? t.eq(0) : null : V ? t.eq(t.length - 1) : null
                }
                if (V && ta && ta.length) {
                    s = parseInt(a(V).attr("row"), 10);
                    J = s == u();
                    Ob(s, !J);
                    Lb(ta[0], J || j.autoEdit);
                    Ea || pb()
                } else pb()
            }
        }

        function gc(s, w, J) {
            if (!(s > Va() || s < 0 || w >= f.length || w < 0))if (!(!j.enableCellNavigation || f[w].unselectable))if (j.editorLock.commitCurrentEdit()) {
                Ob(s, false);
                var Y = null;
                f[w].unselectable || (Y = a(Ma[s]).children().eq(w)[0]);
                Lb(Y, J || s === Va() || j.autoEdit);
                Ea ||
                pb()
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
            var s = Ra(Ka),w = f[Oa];
            if (Ea) {
                if (Ea.isValueChanged()) {
                    var J = Ea.validate();
                    if (J.valid) {
                        if (Ka < Va()) {
                            J = {row:Ka,cell:Oa,editor:Ea,serializedValue:Ea.serializeValue(),prevSerializedValue:qb,execute:function() {
                                this.editor.applyValue(s, this.serializedValue);
                                Da(this.row)
                            },undo:function() {
                                this.editor.applyValue(s, this.prevSerializedValue);
                                Da(this.row)
                            }};
                            if (j.editCommandHandler) {
                                eb();
                                j.editCommandHandler(s, w, J)
                            } else {
                                J.execute();
                                eb()
                            }
                            Ca.onCellChange && Ca.onCellChange(Ka, Oa, s)
                        } else if (Ca.onAddNewRow) {
                            J = {};
                            Ea.applyValue(J, Ea.serializeValue());
                            eb();
                            Ca.onAddNewRow(J, w)
                        }
                        return!j.editorLock.isActive()
                    } else {
                        a(Ja).addClass("invalid");
                        a(Ja).stop(true, true).effect("highlight", {color:"red"}, 300);
                        Ca.onValidationError && Ca.onValidationError(Ja, J, Ka, Oa, w);
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

        var ic = {rowHeight:25,
            defaultColumnWidth:80,enableAddRow:false,leaveSpaceForNewRows:false,editable:false,autoEdit:true,enableCellNavigation:true,enableCellRangeSelection:false,enableColumnReorder:false,asyncEditorLoading:false,asyncEditorLoadDelay:100,forceFitColumns:false,enableAsyncPostRender:false,asyncPostRenderDelay:60,autoHeight:false,editorLock:Slick.GlobalEditorLock,showSecondaryHeaderRow:false,secondaryHeaderRowHeight:25,syncColumnCellResize:false,enableAutoTooltips:true,toolTipMaxLength:null,formatterFactory:null,
            editorFactory:null,cellHighlightCssClass:"highlighted",cellFlashingCssClass:"flashing",multiSelect:true},lb,Va,Ra,Wb = {name:"",resizable:true,sortable:false,collapsable:false,minWidth:30},Jb,ab,gb,tb,yb,Kb,ub = 0,Ua = 0,zb = 0,Eb = 1,Wa,Fb = "slickgrid_" + Math.round(1E6 * Math.random()),Ca = this,vb,$a,hb,jc,Na,La,Za,$b,mb,nb,Gb,pc,Tb,Ib,ob,Ka,Oa,Ja = null,Ea = null,qb,Ub,Ma = {},cb = 0,Cb,ib = 0,Ya = 0,Vb = 0,g = 0,k = 10,n = [],p = {},q = {},v,z,D = true,P = null,T = null,pa = null,X = {},ra = null,ja = null,Ia = 0,Xa = 0;
        renderTimer = null;
        this.debug = function() {
            var s =
                    "";
            s += "\ncounter_rows_rendered:  " + Ia;
            s += "\ncounter_rows_removed:  " + Xa;
            s += "\nrenderedRows:  " + cb;
            s += "\nnumVisibleRows:  " + Cb;
            s += "\nmaxSupportedCssHeight:  " + Jb;
            s += "\nn(umber of pages):  " + yb;
            s += "\n(current) page:  " + ub;
            s += "\npage height (ph):  " + tb;
            s += "\nscrollDir:  " + Eb;
            alert(s)
        };
        this.eval = function(s) {
            return eval(s)
        };
        (function() {
            Wa = a(b);
            lb = e;
            Va = lb.getLength || u;
            Ra = lb.getItem || C;
            Jb = 15E5;
            c = c || l();
            j = a.extend({}, ic, j);
            Wb.width = j.defaultColumnWidth;
            j.padding = zb = _.orEqual(j.padding, zb);
            va = _.orEqual(j.handleScroll,
                    va);
            this.resizeAndRender = y;
            if (j.enableColumnReorder && !a.fn.sortable)throw Error('SlickGrid\'s "enableColumnReorder = true" option requires jquery-ui.sortable module to be loaded');
            Ub = {commitCurrentEdit:mc,cancelCurrentEdit:nc};
            Wa.empty().attr("tabIndex", 0).attr("hideFocus", true).css("overflow", "hidden").css("outline", 0).addClass(Fb).addClass("ui-widget");
            /relative|absolute|fixed/.test(Wa.css("position")) || Wa.css("position", "relative");
            vb = a("<div class='slick-header ui-state-default' style='overflow:hidden;position:relative;' />").appendTo(Wa);
            $a = a("<div class='slick-header-columns' style='width:100000px; left:-10000px' />").appendTo(vb);
            hb = a("<div class='slick-header-secondary ui-state-default' style='overflow:hidden;position:relative;' />").appendTo(Wa);
            jc = a('<div class="slick-header-columns-secondary" style="width:100000px; height: ' + j.secondaryHeaderRowHeight + 'px;" />').appendTo(hb);
            j.showSecondaryHeaderRow || hb.hide();
            Na = a("<div class='slick-viewport' tabIndex='0' hideFocus style='width:100%; overflow-x:hidden; outline:0; position:relative;'>").appendTo(Wa);
            Na.css({"overflow-y":"auto"});
            La = a("<div class='grid-canvas' tabIndex='0' hideFocus style='padding: " + zb + "px' />").appendTo(Na);
            A();
            Na.height(Wa.innerHeight() - vb.outerHeight() - (j.showSecondaryHeaderRow ? hb.outerHeight() : 0));
            r($a);
            Na.bind("selectstart.ui", function(s) {
                return a(s.target).is("input,textarea")
            });
            F();
            x();
            H();
            y();
            if (j.scrollPane) {
                a(j.scrollPane).bind("scroll", h).bind("resize", y);
                Wa.css({overflow:"visible",height:"auto","overflow-y":"visible"});
                Na.css({overflow:"visible",height:"auto","overflow-y":"visible"})
            } else Na.bind("scroll",
                    va);
            Wa.bind("resize.slickgrid", y);
            La.bind("keydown", Ha);
            La.bind("click", Pa);
            La.bind("dblclick", sb);
            La.bind("contextmenu", Qa);
            La.bind("mouseover", db);
            vb.bind("contextmenu", wb);
            vb.bind("click", fb)
        })();
        a.extend(this, {slickGridVersion:"1.4.2",onSort:null,onHeaderContextMenu:null,onClick:null,onDblClick:null,onContextMenu:null,onKeyDown:null,onAddNewRow:null,onValidationError:null,onViewportChanged:null,onSelectedRowsChanged:null,onColumnsReordered:null,onColumnsResized:null,onBeforeMoveRows:null,onMoveRows:null,
            onCellChange:null,onBeforeEditCell:null,onBeforeCellEditorDestroy:null,onBeforeDestroy:null,onCurrentCellChanged:null,onCurrentCellPositionChanged:null,onCellRangeSelected:null,getColumns:function() {
                return f
            },setColumns:ha,getOptions:function() {
                return j
            },setOptions:function(s) {
                if (j.editorLock.commitCurrentEdit()) {
                    eb();
                    j.enableAddRow !== s.enableAddRow && ya(Va());
                    j = a.extend(j, s);
                    la()
                }
            },setData:function(s, w) {
                m();
                lb = e = s;
                Va = lb.getLength || u;
                Ra = lb.getItem || C;
                w && qa(0)
            },destroy:function() {
                j.editorLock.cancelCurrentEdit();
                Ca.onBeforeDestroy && Ca.onBeforeDestroy();
                $a.sortable && $a.sortable("destroy");
                La.parents().unbind("scroll.slickgrid");
                Wa.unbind("resize.slickgrid");
                j.scrollPane && a(j.scrollPane).unbind("scroll").unbind("resize");
                La.unbind("draginit dragstart dragend drag");
                Wa.empty().removeClass(Fb)
            },getColumnIndex:N,autosizeColumns:ba,updateCell:function(s, w) {
                if (Ma[s]) {
                    var J = a(Ma[s]).children().eq(w);
                    if (J.length !== 0) {
                        var Y = f[w],V = Ra(s);
                        if (Ea && Ka === s && Oa === w)Ea.loadValue(V); else {
                            J[0].innerHTML = V ? ca(Y)(s, w, V[Y.field],
                                    Y, V) : "";
                            O(s)
                        }
                    }
                }
            },updateRow:Da,removeRow:ya,removeRows:sa,removeAllRows:m,render:la,resizeAndRender:y,invalidate:function() {
                Q();
                m();
                la()
            },setHighlightedCells:function(s) {
                var w,J,Y;
                for (var V in Ma)for (w = 0; w < f.length; w++) {
                    Y = v && v[V] && v[V][f[w].id];
                    J = s && s[V] && s[V][f[w].id];
                    if (Y != J) {
                        J = a(Ma[V]).children().eq(w);
                        J.length && J.toggleClass(j.cellHighlightCssClass)
                    }
                }
                v = s
            },flashCell:function(s, w, J) {
                J = J || 100;
                if (Ma[s]) {
                    var Y = a(Ma[s]).children().eq(w),V = function(ta) {
                        ta && setTimeout(function() {
                            Y.queue(function() {
                                Y.toggleClass(j.cellFlashingCssClass).dequeue();
                                V(ta - 1)
                            })
                        }, J)
                    };
                    V(4)
                }
            },getViewport:ua,resizeCanvas:Ba,updateRowCount:Q,getCellFromPoint:kb,getCellFromEvent:function(s) {
                s = a(s.target).closest(".slick-cell", La);
                if (!s.length)return null;
                return{row:s.parent().attr("row") | 0,cell:Fa(s[0])}
            },getCurrentCell:fc,getCurrentCellNode:function() {
                return Ja
            },resetCurrentCell:cc,navigatePrev:hc,navigateNext:Qb,navigateUp:Zb,navigateDown:Pb,navigateLeft:ac,navigateRight:bb,gotoCell:gc,editCurrentCell:Mb,getCellEditor:function() {
                return Ea
            },scrollRowIntoView:Ob,getSelectedRows:ka,
            setSelectedRows:fa,getSecondaryHeaderRow:function() {
                return jc[0]
            },showSecondaryHeaderRow:function() {
                j.showSecondaryHeaderRow = true;
                hb.slideDown("fast", Ba)
            },hideSecondaryHeaderRow:function() {
                j.showSecondaryHeaderRow = false;
                hb.slideUp("fast", Ba)
            },setSortColumn:W,getCurrentCellPosition:Yb,getGridPosition:function() {
                return Db(Wa[0])
            },getScrollWidth:function() {
                return c.width
            },scrollTo:qa,scrollPane:j.scrollPane,getEditController:function() {
                return Ub
            }})
    },EditorLock:d,GlobalEditorLock:new d}})
})(jQuery);
function EventHelper() {
    this.handlers = [];
    this.subscribe = function(a) {
        this.handlers.push(a)
    };
    this.notify = function(a) {
        for (var d = 0; d < this.handlers.length; d++)this.handlers[d].call(this, a)
    };
    return this
}
(function(a) {
    a.extend(true, window, {Slick:{Data:{DataView:function() {
        function d() {
            r = {};
            newItems = [];
            for (var ha = 0,qa = 0,aa = l.length; ha < aa; ha++) {
                var ca = l[ha][h];
                if (!(ca == undefined || !A && r[ca] != undefined)) {
                    newItems.push(l[ha]);
                    r[ca] = qa;
                    qa++
                }
            }
            l = newItems
        }

        function c() {
            return{pageSize:N,pageNum:ba,totalRows:K}
        }

        function b(ha, qa) {
            I = qa;
            G = ha;
            H = null;
            qa === false && l.reverse();
            l.sort(ha);
            qa === false && l.reverse();
            d();
            j()
        }

        function e(ha, qa) {
            I = qa;
            H = ha;
            G = null;
            var aa = Object.prototype.toString;
            Object.prototype.toString = typeof ha ==
                    "function" ? ha : function() {
                return this[ha]
            };
            qa === false && l.reverse();
            l.sort();
            Object.prototype.toString = aa;
            qa === false && l.reverse();
            d();
            j()
        }

        function f(ha, qa, aa, ca) {
            var ea = [];
            u = null;
            for (var m = qa.length,U = 0,sa = 0,ya,Da,Ba = 0,y = ha.length; Ba < y; ++Ba) {
                ya = ha[Ba];
                Da = ya[h];
                if (!aa || aa(ya)) {
                    if (!N || U >= N * ba && U < N * (ba + 1)) {
                        if (sa >= m || Da != qa[sa][h] || ca && ca[Da])ea[ea.length] = sa;
                        qa[sa] = ya;
                        sa++
                    }
                    U++
                }
            }
            m > sa && qa.splice(sa, m - sa);
            K = U;
            return ea
        }

        function j() {
            if (!x) {
                var ha = o.length,qa = K,aa = f(l, o, C, F);
                if (N && K < ba * N) {
                    ba = Math.floor(K / N);
                    aa = f(l, o, C, F)
                }
                F = null;
                qa != K && fa.notify(c());
                ha != o.length && W.notify({previous:ha,current:o.length});
                aa.length > 0 && ka.notify(aa)
            }
        }

        var h = "id",l = [],o = [],r = {},u = null,C = null,F = null,x = false,I = true,G = null,H = null,A = false,N = 0,ba = 0,K = 0,W = new EventHelper,ka = new EventHelper,fa = new EventHelper;
        return{rows:o,beginUpdate:function() {
            x = true
        },endUpdate:function() {
            x = false;
            j()
        },setPagingOptions:function(ha) {
            if (ha.pageSize != undefined)N = ha.pageSize;
            if (ha.pageNum != undefined)ba = Math.min(ha.pageNum, Math.ceil(K / N));
            fa.notify(c());
            j()
        },getPagingInfo:c,getItems:function() {
            return l
        },setItems:function(ha, qa) {
            if (qa !== undefined)h = qa;
            l = ha;
            d();
            j()
        },setFilter:function(ha) {
            C = ha;
            j()
        },setAllowDuplicates:function(ha) {
            A = ha ? true : false;
            j()
        },sort:b,fastSort:e,reSort:function() {
            if (G)b(G, I); else H && e(H, I)
        },getIdxById:function(ha) {
            return r[ha]
        },getRowById:function(ha) {
            if (!u) {
                u = {};
                for (var qa = 0,aa = o.length; qa < aa; ++qa)u[o[qa][h]] = qa
            }
            return u[ha]
        },getItemById:function(ha) {
            return l[r[ha]]
        },getItemByIdx:function(ha) {
            return l[ha]
        },refresh:j,updateItem:function(ha, qa) {
            if (!(r[ha] === undefined || ha !== qa[h])) {
                l[r[ha]] = qa;
                F || (F = {});
                F[ha] = true;
                j()
            }
        },insertItem:function(ha, qa) {
            l.splice(ha, 0, qa);
            d();
            j()
        },addItem:function(ha) {
            l.push(ha);
            d();
            j()
        },addItems:function(ha) {
            for (var qa = 0; qa < ha.length; qa++)l.push(ha[qa]);
            d();
            j()
        },deleteItem:function(ha) {
            if (r[ha] === undefined)throw"Invalid id";
            l.splice(r[ha], 1);
            d();
            j()
        },onRowCountChanged:W,onRowsChanged:ka,onPagingInfoChanged:fa}
    }}}})
})(jQuery);
var hexcase = 0,b64pad = "";
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
function any_hmac_md5(a, d, c) {
    return rstr2any(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(d)), c)
}
function md5_vm_test() {
    return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
}
function rstr_md5(a) {
    return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
}
function rstr_hmac_md5(a, d) {
    var c = rstr2binl(a);
    if (c.length > 16)c = binl_md5(c, a.length * 8);
    for (var b = Array(16),e = Array(16),f = 0; f < 16; f++) {
        b[f] = c[f] ^ 909522486;
        e[f] = c[f] ^ 1549556828
    }
    c = binl_md5(b.concat(rstr2binl(d)), 512 + d.length * 8);
    return binl2rstr(binl_md5(e.concat(c), 640))
}
function rstr2hex(a) {
    for (var d = hexcase ? "0123456789ABCDEF" : "0123456789abcdef",c = "",b,e = 0; e < a.length; e++) {
        b = a.charCodeAt(e);
        c += d.charAt(b >>> 4 & 15) + d.charAt(b & 15)
    }
    return c
}
function rstr2b64(a) {
    for (var d = "",c = a.length,b = 0; b < c; b += 3)for (var e = a.charCodeAt(b) << 16 | (b + 1 < c ? a.charCodeAt(b + 1) << 8 : 0) | (b + 2 < c ? a.charCodeAt(b + 2) : 0),f = 0; f < 4; f++)d += b * 8 + f * 6 > a.length * 8 ? b64pad : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >>> 6 * (3 - f) & 63);
    return d
}
function rstr2any(a, d) {
    var c = d.length,b,e,f,j,h,l = Array(Math.ceil(a.length / 2));
    for (b = 0; b < l.length; b++)l[b] = a.charCodeAt(b * 2) << 8 | a.charCodeAt(b * 2 + 1);
    var o = Math.ceil(a.length * 8 / (Math.log(d.length) / Math.log(2))),r = Array(o);
    for (e = 0; e < o; e++) {
        h = [];
        for (b = j = 0; b < l.length; b++) {
            j = (j << 16) + l[b];
            f = Math.floor(j / c);
            j -= f * c;
            if (h.length > 0 || f > 0)h[h.length] = f
        }
        r[e] = j;
        l = h
    }
    c = "";
    for (b = r.length - 1; b >= 0; b--)c += d.charAt(r[b]);
    return c
}
function str2rstr_utf8(a) {
    a = a.toString();
    for (var d = "",c = -1,b,e; ++c < a.length;) {
        b = a.charCodeAt(c);
        e = c + 1 < a.length ? a.charCodeAt(c + 1) : 0;
        if (55296 <= b && b <= 56319 && 56320 <= e && e <= 57343) {
            b = 65536 + ((b & 1023) << 10) + (e & 1023);
            c++
        }
        if (b <= 127)d += String.fromCharCode(b); else if (b <= 2047)d += String.fromCharCode(192 | b >>> 6 & 31, 128 | b & 63); else if (b <= 65535)d += String.fromCharCode(224 | b >>> 12 & 15, 128 | b >>> 6 & 63, 128 | b & 63); else if (b <= 2097151)d += String.fromCharCode(240 | b >>> 18 & 7, 128 | b >>> 12 & 63, 128 | b >>> 6 & 63, 128 | b & 63)
    }
    return d
}
function str2rstr_utf16le(a) {
    for (var d = "",c = 0; c < a.length; c++)d += String.fromCharCode(a.charCodeAt(c) & 255, a.charCodeAt(c) >>> 8 & 255);
    return d
}
function str2rstr_utf16be(a) {
    for (var d = "",c = 0; c < a.length; c++)d += String.fromCharCode(a.charCodeAt(c) >>> 8 & 255, a.charCodeAt(c) & 255);
    return d
}
function rstr2binl(a) {
    for (var d = Array(a.length >> 2),c = 0; c < d.length; c++)d[c] = 0;
    for (c = 0; c < a.length * 8; c += 8)d[c >> 5] |= (a.charCodeAt(c / 8) & 255) << c % 32;
    return d
}
function binl2rstr(a) {
    for (var d = "",c = 0; c < a.length * 32; c += 8)d += String.fromCharCode(a[c >> 5] >>> c % 32 & 255);
    return d
}
function binl_md5(a, d) {
    a[d >> 5] |= 128 << d % 32;
    a[(d + 64 >>> 9 << 4) + 14] = d;
    for (var c = 1732584193,b = -271733879,e = -1732584194,f = 271733878,j = 0; j < a.length; j += 16) {
        var h = c,l = b,o = e,r = f;
        c = md5_ff(c, b, e, f, a[j + 0], 7, -680876936);
        f = md5_ff(f, c, b, e, a[j + 1], 12, -389564586);
        e = md5_ff(e, f, c, b, a[j + 2], 17, 606105819);
        b = md5_ff(b, e, f, c, a[j + 3], 22, -1044525330);
        c = md5_ff(c, b, e, f, a[j + 4], 7, -176418897);
        f = md5_ff(f, c, b, e, a[j + 5], 12, 1200080426);
        e = md5_ff(e, f, c, b, a[j + 6], 17, -1473231341);
        b = md5_ff(b, e, f, c, a[j + 7], 22, -45705983);
        c = md5_ff(c, b, e, f, a[j + 8], 7,
                1770035416);
        f = md5_ff(f, c, b, e, a[j + 9], 12, -1958414417);
        e = md5_ff(e, f, c, b, a[j + 10], 17, -42063);
        b = md5_ff(b, e, f, c, a[j + 11], 22, -1990404162);
        c = md5_ff(c, b, e, f, a[j + 12], 7, 1804603682);
        f = md5_ff(f, c, b, e, a[j + 13], 12, -40341101);
        e = md5_ff(e, f, c, b, a[j + 14], 17, -1502002290);
        b = md5_ff(b, e, f, c, a[j + 15], 22, 1236535329);
        c = md5_gg(c, b, e, f, a[j + 1], 5, -165796510);
        f = md5_gg(f, c, b, e, a[j + 6], 9, -1069501632);
        e = md5_gg(e, f, c, b, a[j + 11], 14, 643717713);
        b = md5_gg(b, e, f, c, a[j + 0], 20, -373897302);
        c = md5_gg(c, b, e, f, a[j + 5], 5, -701558691);
        f = md5_gg(f, c, b, e, a[j +
                10], 9, 38016083);
        e = md5_gg(e, f, c, b, a[j + 15], 14, -660478335);
        b = md5_gg(b, e, f, c, a[j + 4], 20, -405537848);
        c = md5_gg(c, b, e, f, a[j + 9], 5, 568446438);
        f = md5_gg(f, c, b, e, a[j + 14], 9, -1019803690);
        e = md5_gg(e, f, c, b, a[j + 3], 14, -187363961);
        b = md5_gg(b, e, f, c, a[j + 8], 20, 1163531501);
        c = md5_gg(c, b, e, f, a[j + 13], 5, -1444681467);
        f = md5_gg(f, c, b, e, a[j + 2], 9, -51403784);
        e = md5_gg(e, f, c, b, a[j + 7], 14, 1735328473);
        b = md5_gg(b, e, f, c, a[j + 12], 20, -1926607734);
        c = md5_hh(c, b, e, f, a[j + 5], 4, -378558);
        f = md5_hh(f, c, b, e, a[j + 8], 11, -2022574463);
        e = md5_hh(e, f, c, b, a[j +
                11], 16, 1839030562);
        b = md5_hh(b, e, f, c, a[j + 14], 23, -35309556);
        c = md5_hh(c, b, e, f, a[j + 1], 4, -1530992060);
        f = md5_hh(f, c, b, e, a[j + 4], 11, 1272893353);
        e = md5_hh(e, f, c, b, a[j + 7], 16, -155497632);
        b = md5_hh(b, e, f, c, a[j + 10], 23, -1094730640);
        c = md5_hh(c, b, e, f, a[j + 13], 4, 681279174);
        f = md5_hh(f, c, b, e, a[j + 0], 11, -358537222);
        e = md5_hh(e, f, c, b, a[j + 3], 16, -722521979);
        b = md5_hh(b, e, f, c, a[j + 6], 23, 76029189);
        c = md5_hh(c, b, e, f, a[j + 9], 4, -640364487);
        f = md5_hh(f, c, b, e, a[j + 12], 11, -421815835);
        e = md5_hh(e, f, c, b, a[j + 15], 16, 530742520);
        b = md5_hh(b, e, f,
                c, a[j + 2], 23, -995338651);
        c = md5_ii(c, b, e, f, a[j + 0], 6, -198630844);
        f = md5_ii(f, c, b, e, a[j + 7], 10, 1126891415);
        e = md5_ii(e, f, c, b, a[j + 14], 15, -1416354905);
        b = md5_ii(b, e, f, c, a[j + 5], 21, -57434055);
        c = md5_ii(c, b, e, f, a[j + 12], 6, 1700485571);
        f = md5_ii(f, c, b, e, a[j + 3], 10, -1894986606);
        e = md5_ii(e, f, c, b, a[j + 10], 15, -1051523);
        b = md5_ii(b, e, f, c, a[j + 1], 21, -2054922799);
        c = md5_ii(c, b, e, f, a[j + 8], 6, 1873313359);
        f = md5_ii(f, c, b, e, a[j + 15], 10, -30611744);
        e = md5_ii(e, f, c, b, a[j + 6], 15, -1560198380);
        b = md5_ii(b, e, f, c, a[j + 13], 21, 1309151649);
        c = md5_ii(c,
                b, e, f, a[j + 4], 6, -145523070);
        f = md5_ii(f, c, b, e, a[j + 11], 10, -1120210379);
        e = md5_ii(e, f, c, b, a[j + 2], 15, 718787259);
        b = md5_ii(b, e, f, c, a[j + 9], 21, -343485551);
        c = safe_add(c, h);
        b = safe_add(b, l);
        e = safe_add(e, o);
        f = safe_add(f, r)
    }
    return Array(c, b, e, f)
}
function md5_cmn(a, d, c, b, e, f) {
    return safe_add(bit_rol(safe_add(safe_add(d, a), safe_add(b, f)), e), c)
}
function md5_ff(a, d, c, b, e, f, j) {
    return md5_cmn(d & c | ~d & b, a, d, e, f, j)
}
function md5_gg(a, d, c, b, e, f, j) {
    return md5_cmn(d & b | c & ~b, a, d, e, f, j)
}
function md5_hh(a, d, c, b, e, f, j) {
    return md5_cmn(d ^ c ^ b, a, d, e, f, j)
}
function md5_ii(a, d, c, b, e, f, j) {
    return md5_cmn(c ^ (d | ~b), a, d, e, f, j)
}
function safe_add(a, d) {
    var c = (a & 65535) + (d & 65535);
    return(a >> 16) + (d >> 16) + (c >> 16) << 16 | c & 65535
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
function any_hmac_sha1(a, d, c) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(d)), c)
}
function sha1_vm_test() {
    return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d"
}
function rstr_sha1(a) {
    return binb2rstr(binb_sha1(rstr2binb(a), a.length * 8))
}
function rstr_hmac_sha1(a, d) {
    var c = rstr2binb(a);
    if (c.length > 16)c = binb_sha1(c, a.length * 8);
    for (var b = Array(16),e = Array(16),f = 0; f < 16; f++) {
        b[f] = c[f] ^ 909522486;
        e[f] = c[f] ^ 1549556828
    }
    c = binb_sha1(b.concat(rstr2binb(d)), 512 + d.length * 8);
    return binb2rstr(binb_sha1(e.concat(c), 672))
}
function rstr2hex(a) {
    for (var d = hexcase ? "0123456789ABCDEF" : "0123456789abcdef",c = "",b,e = 0; e < a.length; e++) {
        b = a.charCodeAt(e);
        c += d.charAt(b >>> 4 & 15) + d.charAt(b & 15)
    }
    return c
}
function rstr2b64(a) {
    for (var d = "",c = a.length,b = 0; b < c; b += 3)for (var e = a.charCodeAt(b) << 16 | (b + 1 < c ? a.charCodeAt(b + 1) << 8 : 0) | (b + 2 < c ? a.charCodeAt(b + 2) : 0),f = 0; f < 4; f++)d += b * 8 + f * 6 > a.length * 8 ? b64pad : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >>> 6 * (3 - f) & 63);
    return d
}
function rstr2any(a, d) {
    var c = d.length,b = [],e,f,j,h,l = Array(Math.ceil(a.length / 2));
    for (e = 0; e < l.length; e++)l[e] = a.charCodeAt(e * 2) << 8 | a.charCodeAt(e * 2 + 1);
    for (; l.length > 0;) {
        h = [];
        for (e = j = 0; e < l.length; e++) {
            j = (j << 16) + l[e];
            f = Math.floor(j / c);
            j -= f * c;
            if (h.length > 0 || f > 0)h[h.length] = f
        }
        b[b.length] = j;
        l = h
    }
    c = "";
    for (e = b.length - 1; e >= 0; e--)c += d.charAt(b[e]);
    b = Math.ceil(a.length * 8 / (Math.log(d.length) / Math.log(2)));
    for (e = c.length; e < b; e++)c = d[0] + c;
    return c
}
function str2rstr_utf8(a) {
    for (var d = "",c = -1,b,e; ++c < a.length;) {
        b = a.charCodeAt(c);
        e = c + 1 < a.length ? a.charCodeAt(c + 1) : 0;
        if (55296 <= b && b <= 56319 && 56320 <= e && e <= 57343) {
            b = 65536 + ((b & 1023) << 10) + (e & 1023);
            c++
        }
        if (b <= 127)d += String.fromCharCode(b); else if (b <= 2047)d += String.fromCharCode(192 | b >>> 6 & 31, 128 | b & 63); else if (b <= 65535)d += String.fromCharCode(224 | b >>> 12 & 15, 128 | b >>> 6 & 63, 128 | b & 63); else if (b <= 2097151)d += String.fromCharCode(240 | b >>> 18 & 7, 128 | b >>> 12 & 63, 128 | b >>> 6 & 63, 128 | b & 63)
    }
    return d
}
function str2rstr_utf16le(a) {
    for (var d = "",c = 0; c < a.length; c++)d += String.fromCharCode(a.charCodeAt(c) & 255, a.charCodeAt(c) >>> 8 & 255);
    return d
}
function str2rstr_utf16be(a) {
    for (var d = "",c = 0; c < a.length; c++)d += String.fromCharCode(a.charCodeAt(c) >>> 8 & 255, a.charCodeAt(c) & 255);
    return d
}
function rstr2binb(a) {
    for (var d = Array(a.length >> 2),c = 0; c < d.length; c++)d[c] = 0;
    for (c = 0; c < a.length * 8; c += 8)d[c >> 5] |= (a.charCodeAt(c / 8) & 255) << 24 - c % 32;
    return d
}
function binb2rstr(a) {
    for (var d = "",c = 0; c < a.length * 32; c += 8)d += String.fromCharCode(a[c >> 5] >>> 24 - c % 32 & 255);
    return d
}
function binb_sha1(a, d) {
    a[d >> 5] |= 128 << 24 - d % 32;
    a[(d + 64 >> 9 << 4) + 15] = d;
    for (var c = Array(80),b = 1732584193,e = -271733879,f = -1732584194,j = 271733878,h = -1009589776,l = 0; l < a.length; l += 16) {
        for (var o = b,r = e,u = f,C = j,F = h,x = 0; x < 80; x++) {
            c[x] = x < 16 ? a[l + x] : bit_rol(c[x - 3] ^ c[x - 8] ^ c[x - 14] ^ c[x - 16], 1);
            var I = safe_add(safe_add(bit_rol(b, 5), sha1_ft(x, e, f, j)), safe_add(safe_add(h, c[x]), sha1_kt(x)));
            h = j;
            j = f;
            f = bit_rol(e, 30);
            e = b;
            b = I
        }
        b = safe_add(b, o);
        e = safe_add(e, r);
        f = safe_add(f, u);
        j = safe_add(j, C);
        h = safe_add(h, F)
    }
    return Array(b, e, f, j,
            h)
}
function sha1_ft(a, d, c, b) {
    if (a < 20)return d & c | ~d & b;
    if (a < 40)return d ^ c ^ b;
    if (a < 60)return d & c | d & b | c & b;
    return d ^ c ^ b
}
function sha1_kt(a) {
    return a < 20 ? 1518500249 : a < 40 ? 1859775393 : a < 60 ? -1894007588 : -899497514
}
function safe_add(a, d) {
    var c = (a & 65535) + (d & 65535);
    return(a >> 16) + (d >> 16) + (c >> 16) << 16 | c & 65535
}
function bit_rol(a, d) {
    return a << d | a >>> 32 - d
}
Date.prototype.format = function(a) {
    for (var d = "",c = Date.replaceChars,b = 0; b < a.length; b++) {
        var e = a.charAt(b);
        d += c[e] ? c[e].call(this) : e
    }
    return d
};
Date.replaceChars = {shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function() {
    return(this.getDate() < 10 ? "0" : "") + this.getDate()
},D:function() {
    return Date.replaceChars.shortDays[this.getDay()]
},j:function() {
    return this.getDate()
},
    l:function() {
        return Date.replaceChars.longDays[this.getDay()]
    },N:function() {
        return this.getDay() + 1
    },S:function() {
        return this.getDate() % 10 == 1 && this.getDate() != 11 ? "st" : this.getDate() % 10 == 2 && this.getDate() != 12 ? "nd" : this.getDate() % 10 == 3 && this.getDate() != 13 ? "rd" : "th"
    },w:function() {
        return this.getDay()
    },z:function() {
        return"Not Yet Supported"
    },W:function() {
        return"Not Yet Supported"
    },F:function() {
        return Date.replaceChars.longMonths[this.getMonth()]
    },m:function() {
        return(this.getMonth() < 9 ? "0" : "") + (this.getMonth() +
                1)
    },M:function() {
        return Date.replaceChars.shortMonths[this.getMonth()]
    },n:function() {
        return this.getMonth() + 1
    },t:function() {
        return"Not Yet Supported"
    },L:function() {
        return this.getFullYear() % 4 == 0 && this.getFullYear() % 100 != 0 || this.getFullYear() % 400 == 0 ? "1" : "0"
    },o:function() {
        return"Not Supported"
    },Y:function() {
        return this.getFullYear()
    },y:function() {
        return("" + this.getFullYear()).substr(2)
    },a:function() {
        return this.getHours() < 12 ? "am" : "pm"
    },A:function() {
        return this.getHours() < 12 ? "AM" : "PM"
    },B:function() {
        return"Not Yet Supported"
    },
    g:function() {
        return this.getHours() % 12 || 12
    },G:function() {
        return this.getHours()
    },h:function() {
        return((this.getHours() % 12 || 12) < 10 ? "0" : "") + (this.getHours() % 12 || 12)
    },H:function() {
        return(this.getHours() < 10 ? "0" : "") + this.getHours()
    },i:function() {
        return(this.getMinutes() < 10 ? "0" : "") + this.getMinutes()
    },s:function() {
        return(this.getSeconds() < 10 ? "0" : "") + this.getSeconds()
    },e:function() {
        return"Not Yet Supported"
    },I:function() {
        return"Not Supported"
    },O:function() {
        return(-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() /
                60) < 10 ? "0" : "") + Math.abs(this.getTimezoneOffset() / 60) + "00"
    },P:function() {
        return(-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") + Math.abs(this.getTimezoneOffset() / 60) + ":" + (Math.abs(this.getTimezoneOffset() % 60) < 10 ? "0" : "") + Math.abs(this.getTimezoneOffset() % 60)
    },T:function() {
        var a = this.getMonth();
        this.setMonth(0);
        var d = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, "$1");
        this.setMonth(a);
        return d
    },Z:function() {
        return-this.getTimezoneOffset() * 60
    },c:function() {
        return this.format("Y-m-d") +
                "T" + this.format("H:i:sP")
    },r:function() {
        return this.toString()
    },U:function() {
        return this.getTime() / 1E3
    }};
(function(a) {
    a.GrowingInput = function(c, b) {
        var e,f,j;
        b = a.extend({min:0,max:null,maxWidth:null,startWidth:30,correction:45}, b);
        c = a(c).data("growing", this);
        var h = this,l = function(r) {
            j.text(r);
            r = j.width();
            return(r ? r : b.startWidth) + b.correction
        },o = function() {
            f = e;
            var r = e = c.val();
            if ((b.min || b.min === 0) && e.length < b.min) {
                if ((f || f === 0) && f.length <= b.min)return;
                r = d(e, b.min, "-")
            } else if ((b.max || b.max === 0) && e.length > b.max) {
                if ((f || f === 0) && f.length >= b.max)return;
                r = e.substr(0, b.max)
            }
            b.maxWidth ? c.width(Math.min(b.maxWidth,
                    l(r))) : c.width(l(r));
            return h
        };
        this.resize = o;
        (function() {
            j = a("<span></span>").css({"float":"left",display:"inline-block",position:"absolute",left:-1000}).insertAfter(c);
            a.each(["font-size","font-family","padding-left","padding-top","padding-bottom","padding-right","border-left","border-right","border-top","border-bottom","word-spacing","letter-spacing","text-indent","text-transform"], function(r, u) {
                j.css(u, c.css(u))
            });
            c.blur(o).keyup(o).keydown(o).keypress(o);
            o()
        })()
    };
    var d = function(c, b, e, f) {
        if (c.length >=
                b)return this;
        e = e || " ";
        b = Array(b - c.length + 1).join(e).substr(0, b - c.length);
        if (!f || f == "right")return c + b;
        if (f == "left")return b + c;
        return b.substr(0, (b.length / 2).floor()) + c + b.substr(0, (b.length / 2).ceil())
    }
})(jQuery);
(function(a) {
    a.TextboxList = function(e, f) {
        var j,h,l,o,r = false,u = [],C,F = {},x = a.extend(true, {prefix:"textboxlist",max:null,unique:false,uniqueInsensitive:true,endEditableBit:true,startEditableBit:true,hideEditableBits:true,inBetweenEditableBits:true,keys:{previous:37,next:39},bitsOptions:{editable:{},box:{}},plugins:{},encode:function(U) {
                    return a.grep(a.map(U, function(sa) {
                        sa = d(sa[0]) ? sa[0] : sa[1];
                        return d(sa) ? sa.toString().replace(/,/, "") : null
                    }),
                            function(sa) {
                                return sa != undefined
                            }).join(",")
                },decode:function(U) {
                    return U.split(",")
                }},
                f);
        e = a(e);
        var I = this,G = function(U, sa) {
            I.plugins[U] = new (a.TextboxList[c(b(U))])(I, sa)
        },H = function() {
            x.endEditableBit && A("editable", null, {tabIndex:j.tabIndex}).inject(l);
            ca("bitAdd", aa, true);
            ca("bitRemove", aa, true);
            a(document).click(
                    function(U) {
                        if (r) {
                            if (U.target.className.indexOf(x.prefix) != -1) {
                                if (U.target == a(h).get(0))return;
                                if (a(U.target).parents("div." + x.prefix).get(0) == h.get(0))return
                            }
                            ka()
                        }
                    }).keydown(function(U) {
                        if (r && o) {
                            var sa = o.is("editable") ? o.getCaret() : null,ya = o.getValue()[1],Da = !!a.map(["shift",
                                "alt","meta","ctrl"],
                                    function(y) {
                                        return U[y]
                                    }).length || o.is("editable") && o.isSelected(),Ba = function() {
                                U.stopPropagation();
                                U.preventDefault()
                            };
                            switch (U.which) {
                                case 8:
                                    if (o.is("box")) {
                                        Ba();
                                        return o.remove()
                                    }
                                case x.keys.previous:
                                    if (o.is("box") || (sa == 0 || !ya.length) && !Da) {
                                        Ba();
                                        K("prev")
                                    }
                                    break;
                                case 46:
                                    if (o.is("box")) {
                                        Ba();
                                        return o.remove()
                                    }
                                case x.keys.next:
                                    if (o.is("box") || sa == ya.length && !Da) {
                                        Ba();
                                        K("next")
                                    }
                            }
                        }
                    });
            qa(x.decode(j.val()))
        },A = function(U, sa, ya) {
            if (U == "box") {
                if (d(x.max) && l.children("." + x.prefix +
                        "-bit-box").length + 1 > x.max)return false;
                if (x.unique && a.inArray(N(sa), u) != -1)return false
            }
            return new a.TextboxListBit(U, sa, I, a.extend(true, x.bitsOptions[U], ya))
        },N = function(U) {
            return d(U[0]) ? U[0] : x.uniqueInsensitive ? U[1].toLowerCase() : U[1]
        },ba = function(U, sa, ya, Da) {
            if (U = A("box", [sa,U,ya])) {
                if (!Da || !Da.length)Da = l.find("." + x.prefix + "-bit-box").filter(":last");
                U.inject(Da.length ? Da : l, Da.length ? "after" : "top")
            }
            return I
        },K = function(U, sa) {
            var ya = fa(sa && a(sa).length ? sa : o).toElement();
            (ya = fa(ya[U]())) && ya.focus();
            return I
        },W = function() {
            var U = l.children().filter(":last");
            U && fa(U).focus();
            return I
        },ka = function() {
            if (!r)return I;
            o && o.blur();
            r = false;
            return ea("blur")
        },fa = function(U) {
            return U.type && (U.type == "editable" || U.type == "box") ? U : a(U).data("textboxlist:bit")
        },ha = function() {
            var U = [];
            l.children().each(function() {
                var sa = fa(this);
                sa.is("editable") || U.push(sa.getValue())
            });
            return U
        },qa = function(U) {
            U && a.each(U, function(sa, ya) {
                if (ya)ba.apply(I, a.isArray(ya) ? [ya[1],ya[0],ya[2]] : [ya])
            })
        },aa = function() {
            j.val(x.encode(ha()))
        },
                ca = function(U, sa) {
                    if (F[U] == undefined)F[U] = [];
                    var ya = false;
                    a.each(F[U], function(Da) {
                        if (Da === sa)ya = true
                    });
                    ya || F[U].push(sa);
                    return I
                },ea = function(U, sa, ya) {
            if (!F || !F[U])return I;
            a.each(F[U], function(Da, Ba) {
                (function() {
                    sa = sa != undefined ? a.isArray(sa) ? sa : [sa] : Array.prototype.slice.call(arguments);
                    var y = function() {
                        return Ba.apply(I || null, sa)
                    };
                    if (ya)return setTimeout(y, ya);
                    return y()
                })()
            });
            return I
        },m = function(U) {
            return a.inArray(N(U), u)
        };
        this.onFocus = function(U) {
            o && o.blur();
            clearTimeout(C);
            o = U;
            h.addClass(x.prefix +
                    "-focus");
            if (!r) {
                r = true;
                ea("focus", U)
            }
        };
        this.onAdd = function(U) {
            x.unique && U.is("box") && u.push(N(U.getValue()));
            if (U.is("box"))if ((U = fa(U.toElement().prev())) && U.is("box") && x.inBetweenEditableBits || !U && x.startEditableBit) {
                U = U && U.toElement().length ? U.toElement() : false;
                U = A("editable").inject(U || l, U ? "after" : "top");
                x.hideEditableBits && U.hide()
            }
        };
        this.onRemove = function(U) {
            if (r) {
                if (x.unique && U.is("box")) {
                    var sa = m(U.getValue());
                    if (sa != -1)u = u.splice(sa + 1, 1)
                }
                (sa = fa(U.toElement().prev())) && sa.is("editable") &&
                sa.remove();
                K("next", U)
            }
        };
        this.onBlur = function(U, sa) {
            o = null;
            h.removeClass(x.prefix + "-focus");
            C = setTimeout(ka, sa ? 0 : 200)
        };
        this.setOptions = function(U) {
            x = a.extend(true, x, U)
        };
        this.getOptions = function() {
            return x
        };
        this.getContainer = function() {
            return h
        };
        this.isDuplicate = m;
        this.addEvent = ca;
        this.removeEvent = function(U, sa) {
            if (F[U])for (var ya = F[U].length; ya--;)F[U][ya] === sa && F[U].splice(ya, 1);
            return I
        };
        this.fireEvent = ea;
        this.create = A;
        this.add = ba;
        this.getValues = ha;
        this.plugins = [];
        (function() {
            j = e.css("display",
                    "none").attr("autocomplete", "off").focus(W);
            h = a('<div class="' + x.prefix + '" />').insertAfter(e).click(function(sa) {
                if ((sa.target == l.get(0) || sa.target == h.get(0)) && (!r || o && o.toElement().get(0) != l.find(":last-child").get(0)))W()
            });
            l = a('<ul class="' + x.prefix + '-bits" />').appendTo(h);
            for (var U in x.plugins)G(U, x.plugins[U]);
            H()
        })()
    };
    a.TextboxListBit = function(e, f, j, h) {
        var l,o,r,u,C,F = false,x = b(e),I = a.extend(true, e == "box" ? {deleteButton:true} : {tabIndex:null,growing:true,growingOptions:{},stopEnter:true,addOnBlur:false,
            addKeys:[13,188]}, h);
        this.type = e;
        this.value = f;
        var G = this,H = function(fa) {
            if (F)return G;
            ba();
            F = true;
            j.onFocus(G);
            o.addClass(r + "-focus").addClass(r + "-" + e + "-focus");
            W("focus");
            e == "editable" && !fa && l.focus();
            return G
        },A = function(fa) {
            if (!F)return G;
            F = false;
            j.onBlur(G);
            o.removeClass(r + "-focus").removeClass(r + "-" + e + "-focus");
            W("blur");
            if (e == "editable") {
                fa || l.blur();
                C && !l.val().length && K()
            }
            return G
        },N = function() {
            A();
            j.onRemove(G);
            o.remove();
            return W("remove")
        },ba = function() {
            o.css("display", "block");
            return G
        },
                K = function() {
                    o.css("display", "none");
                    C = true;
                    return G
                },W = function(fa) {
            fa = b(fa);
            j.fireEvent("bit" + fa, G).fireEvent("bit" + x + fa, G);
            return G
        };
        this.is = function(fa) {
            return e == fa
        };
        this.setValue = function(fa) {
            if (e == "editable") {
                l.val(d(fa[0]) ? fa[0] : fa[1]);
                I.growing && l.data("growing").resize()
            } else f = fa;
            return G
        };
        this.getValue = function() {
            return e == "editable" ? [null,l.val(),null] : f
        };
        if (e == "editable") {
            this.getCaret = function() {
                var fa = l.get(0);
                if (fa.createTextRange) {
                    var ha = document.selection.createRange().duplicate();
                    ha.moveEnd("character", fa.value.length);
                    if (ha.text === "")return fa.value.length;
                    return fa.value.lastIndexOf(ha.text)
                } else return fa.selectionStart
            };
            this.getCaretEnd = function() {
                var fa = l.get(0);
                if (fa.createTextRange) {
                    var ha = document.selection.createRange().duplicate();
                    ha.moveStart("character", -fa.value.length);
                    return ha.text.length
                } else return fa.selectionEnd
            };
            this.isSelected = function() {
                return F && G.getCaret() !== G.getCaretEnd()
            };
            var ka = function() {
                var fa = G.getValue();
                if (fa = j.create("box", fa)) {
                    fa.inject(o,
                            "before");
                    G.setValue([null,"",null]);
                    return fa
                }
                return null
            };
            this.toBox = ka
        }
        this.toElement = function() {
            return o
        };
        this.focus = H;
        this.blur = A;
        this.remove = N;
        this.inject = function(fa, ha) {
            switch (ha || "bottom") {
                case "top":
                    o.prependTo(fa);
                    break;
                case "bottom":
                    o.appendTo(fa);
                    break;
                case "before":
                    o.insertBefore(fa);
                    break;
                case "after":
                    o.insertAfter(fa);
                    break
            }
            j.onAdd(G);
            return W("add")
        };
        this.show = ba;
        this.hide = K;
        this.fireBitEvent = W;
        (function() {
            r = j.getOptions().prefix + "-bit";
            u = r + "-" + e;
            o = a("<li />").addClass(r).addClass(u).data("textboxlist:bit",
                    G).hover(function() {
                        o.addClass(r + "-hover").addClass(u + "-hover")
                    }, function() {
                        o.removeClass(r + "-hover").removeClass(u + "-hover")
                    });
            if (e == "box") {
                o.html(d(G.value[2]) ? G.value[2] : G.value[1]).click(H);
                if (I.deleteButton) {
                    o.addClass(u + "-deletable");
                    a('<a href="#" class="' + u + '-deletebutton" />').click(N).appendTo(o)
                }
                o.children().click(function(fa) {
                    fa.stopPropagation();
                    fa.preventDefault()
                })
            } else {
                l = a('<input type="text" class="' + u + '-input" autocomplete="off" />').val(G.value ? G.value[1] : "").appendTo(o);
                if (d(I.tabIndex))l.tabIndex =
                        I.tabIndex;
                I.growing && new a.GrowingInput(l, I.growingOptions);
                l.focus(
                        function() {
                            H(true)
                        }).blur(function() {
                            A(true);
                            I.addOnBlur && ka()
                        });
                if (I.addKeys || I.stopEnter)l.keydown(function(fa) {
                    if (F) {
                        if (I.stopEnter && fa.which === 13) {
                            fa.stopPropagation();
                            fa.preventDefault()
                        }
                        if (a.inArray(fa.which, a.isArray(I.addKeys) ? I.addKeys : [I.addKeys]) != -1) {
                            fa.stopPropagation();
                            fa.preventDefault();
                            ka()
                        }
                    }
                })
            }
        })()
    };
    var d = function(e) {
        return!!(e || e === 0)
    },c = function(e) {
        return e.replace(/-\D/g, function(f) {
            return f.charAt(1).toUpperCase()
        })
    },
            b = function(e) {
                return e.replace(/\b[a-z]/g, function(f) {
                    return f.toUpperCase()
                })
            };
    a.fn.extend({textboxlist:function(e) {
        return this.each(function() {
            new a.TextboxList(this, e)
        })
    }})
})(jQuery);
(function() {
    $.TextboxList.Autocomplete = function(d, c) {
        var b,e,f,j,h = [],l = [],o = false,r,u,C,F,x,I,G = $.extend(true, {minLength:1,maxResults:5,insensitive:true,highlight:true,highlightSelector:null,mouseInteraction:true,onlyFromValues:false,queryRemote:false,remote:{url:"",param:"search",extraParams:{},loadPlaceholder:"Please wait..."},method:"standard",placeholder:"Type to receive suggestions"}, c),H = function(ca) {
            ca.toElement().keydown(aa).keyup(function() {
                A()
            })
        },A = function(ca) {
            if (ca)u = ca;
            if (G.queryRemote ||
                    h.length) {
                var ea = $.trim(u.getValue()[1]);
                ea.length < G.minLength && o && o.css("display", "block");
                if (ea != x) {
                    x = ea;
                    j.css("display", "none");
                    if (!(ea.length < G.minLength)) {
                        if (G.queryRemote)if (l[ea])h = l[ea]; else {
                            ca = G.remote.extraParams;
                            ca[G.remote.param] = ea;
                            I && I.abort();
                            I = $.ajax({url:G.remote.url,data:ca,dataType:"json",success:function(m) {
                                h = l[ea] = m;
                                N(ea)
                            }})
                        }
                        N(ea)
                    }
                }
            }
        },N = function(ca) {
            var ea = e.filter(h, ca, G.insensitive, G.maxResults);
            if (d.getOptions().unique)ea = $.grep(ea, function(m) {
                return d.isDuplicate(m) == -1
            });
            W();
            if (ea.length) {
                fa();
                j.empty().css("display", "block");
                $.each(ea, function(m, U) {
                    ba(U, ca)
                });
                G.onlyFromValues && ka(j.find(":first"));
                ea = ea
            }
        },ba = function(ca, ea) {
            var m = $('<li class="' + b + '-result" />').html(ca[3] ? ca[3] : ca[1]).data("textboxlist:auto:value", ca);
            m.appendTo(j);
            if (G.highlight)$(G.highlightSelector ? m.find(G.highlightSelector) : m).each(function() {
                $(this).html() && e.highlight($(this), ea, G.insensitive, b + "-highlight")
            });
            if (G.mouseInteraction) {
                m.css("cursor", "pointer").hover(
                        function() {
                            ka(m)
                        }).mousedown(
                        function(U) {
                            U.stopPropagation();
                            U.preventDefault();
                            clearTimeout(C);
                            F = true
                        }).mouseup(function() {
                            if (F) {
                                qa();
                                u.focus();
                                A();
                                F = false
                            }
                        });
                G.onlyFromValues || m.mouseleave(function() {
                    r && r.get(0) == m.get(0) && fa()
                })
            }
        },K = function() {
            C = setTimeout(function() {
                W();
                j.css("display", "none");
                x = null
            }, $.browser.msie ? 150 : 0)
        },W = function() {
            o && o.css("display", "none")
        },ka = function(ca) {
            if (ca && ca.length) {
                fa();
                r = ca.addClass(b + "-result-focus")
            }
        },fa = function() {
            if (r && r.length) {
                r.removeClass(b + "-result-focus");
                r = null
            }
        },ha = function(ca) {
            if (!r || !r.length)return self;
            return ka(r[ca]())
        },qa = function() {
            var ca = r.data("textboxlist:auto:value"),ea = d.create("box", ca.slice(0, 3));
            if (ea) {
                ea.autoValue = ca;
                $.isArray(void 0) && (void 0).push(ca);
                u.setValue([null,"",null]);
                ea.inject(u.toElement(), "before")
            }
            fa();
            return self
        },aa = function(ca) {
            var ea = function() {
                ca.stopPropagation();
                ca.preventDefault()
            };
            switch (ca.which) {
                case 38:
                    ea();
                    !G.onlyFromValues && r && r.get(0) === j.find(":first").get(0) ? fa() : ha("prev");
                    break;
                case 40:
                    ea();
                    r && r.length ? ha("next") : ka(j.find(":first"));
                    break;
                case 13:
                    ea();
                    if (r && r.length)qa(); else if (!G.onlyFromValues) {
                        ea = u.getValue();
                        if (ea = d.create("box", ea)) {
                            ea.inject(u.toElement(), "before");
                            u.setValue([null,"",null])
                        }
                    }
            }
        };
        this.setValues = function(ca) {
            h = ca
        };
        (function() {
            d.addEvent("bitEditableAdd", H).addEvent("bitEditableFocus", A).addEvent("bitEditableBlur", K).setOptions({bitsOptions:{editable:{addKeys:false,stopEnter:false}}});
            $.browser.msie && d.setOptions({bitsOptions:{editable:{addOnBlur:false}}});
            b = d.getOptions().prefix + "-autocomplete";
            e = $.TextboxList.Autocomplete.Methods[G.method];
            f = $('<div class="' + b + '" />').appendTo(d.getContainer());
            if (G.placeholder || G.placeholder === 0)o = $('<div class="' + b + '-placeholder" />').html(G.placeholder).appendTo(f);
            j = $('<ul class="' + b + '-results" />').appendTo(f).click(function(ca) {
                ca.stopPropagation();
                ca.preventDefault()
            })
        })()
    };
    $.TextboxList.Autocomplete.Methods = {standard:{filter:function(d, c, b, e) {
        var f = [];
        c = RegExp("\\b" + a(c), b ? "i" : "");
        for (b = 0; b < d.length; b++) {
            if (f.length === e)break;
            c.test(d[b][1]) && f.push(d[b])
        }
        return f
    },highlight:function(d, c, b, e) {
        c = RegExp("(<[^>]*>)|(\\b" + a(c) + ")", b ? "ig" : "g");
        return d.html(d.html().replace(c, function(f, j, h) {
            return f.charAt(0) == "<" ? f : '<strong class="' + e + '">' + h + "</strong>"
        }))
    }}};
    var a = function(d) {
        return d.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1")
    }
})();
var googleOpenIDPopup = {constants:{openidSpec:{identifier_select:"http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select",namespace2:"http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0"}},getWindowInnerSize:function() {
    var a = 0,d = 0,c = null;
    if ("innerWidth"in window) {
        a = window.innerWidth;
        d = window.innerHeight
    } else {
        if ("BackCompat" === window.document.compatMode && "body"in window.document)c = window.document.body; else if ("documentElement"in window.document)c = window.document.documentElement;
        if (c !== null) {
            a = c.offsetWidth;
            d = c.offsetHeight
        }
    }
    return[a,d]
},getParentCoords:function() {
    var a = 0,d = 0;
    if ("screenLeft"in window) {
        a = window.screenLeft;
        d = window.screenTop
    } else if ("screenX"in window) {
        a = window.screenX;
        d = window.screenY
    }
    return[a,d]
},getCenteredCoords:function(a, d) {
    var c = this.getWindowInnerSize(),b = this.getParentCoords(),e = b[0] + Math.max(0, Math.floor((c[0] - a) / 2));
    c = b[1] + Math.max(0, Math.floor((c[1] - d) / 2));
    if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1)for (; e > screen.width;)e -= screen.width;
    if (e < 0)e += screen.width;
    return[e,c]
},createPopupOpener:function(a) {
    var d = null,c = null,b = this,e = "shouldEncodeUrls"in a ? a.shouldEncodeUrls : true,f = "identifier"in a ? e ? encodeURIComponent(a.identifier) : a.identifier : this.constants.openidSpec.identifier_select,j = "identity"in a ? e ? encodeURIComponent(a.identity) : a.identity : this.constants.openidSpec.identifier_select,h = "namespace"in a ? e ? encodeURIComponent(a.namespace) : a.namespace : this.constants.openidSpec.namespace2,l = "onOpenHandler"in a && "function" === typeof a.onOpenHandler ? a.onOpenHandler :
            this.darkenScreen,o = "onCloseHandler"in a && "function" === typeof a.onCloseHandler ? a.onCloseHandler : null,r = "returnToUrl"in a ? a.returnToUrl : null,u = "realm"in a ? a.realm : null,C = "opEndpoint"in a ? a.opEndpoint : null,F = "extensions"in a ? a.extensions : null,x = function() {
        if (!c || c.closed) {
            c = null;
            o && o();
            if (null !== d) {
                window.clearInterval(d);
                d = null
            }
        }
    };
    return{popup:function(I, G) {
        var H;
        H = "&";
        var A = null;
        A = null;
        if (null === C || null === r)H = void 0; else {
            if (C.indexOf("?") === -1)H = "?";
            A = e ? encodeURIComponent(r) : r;
            A = [C,H,"openid.ns=",
                h,"&openid.mode=checkid_setup&openid.claimed_id=",f,"&openid.identity=",j,"&openid.return_to=",A].join("");
            if (u !== null)A += "&openid.realm=" + (e ? encodeURIComponent(u) : u);
            if (F !== null) {
                H = A;
                A = "";
                for (key in F)A += ["&",key,"=",e ? encodeURIComponent(F[key]) : F[key]].join("");
                A = H + A
            }
            A += "&openid.ns.ui=" + encodeURIComponent("http://specs.openid.net/extensions/ui/1.0");
            A += "&openid.ui.mode=popup";
            H = A
        }
        l && l();
        A = b.getCenteredCoords(I, G);
        c = window.open(H, "", "width=" + I + ",height=" + G + ",status=1,location=1,resizable=yes,left=" +
                A[0] + ",top=" + A[1]);
        d = window.setInterval(x, 80);
        return c
    }}
}};
window.ZeroClipboard = {version:"1.0.7",clients:{},moviePath:"/webincludes/flash/ZeroClipboard.swf",nextId:1,$:function(a) {
    if (typeof a == "string")a = document.getElementById(a);
    if (!a.addClass) {
        a.hide = function() {
            this.style.display = "none"
        };
        a.show = function() {
            this.style.display = ""
        };
        a.addClass = function(d) {
            this.removeClass(d);
            this.className += " " + d
        };
        a.removeClass = function(d) {
            for (var c = this.className.split(/\s+/),b = -1,e = 0; e < c.length; e++)if (c[e] == d) {
                b = e;
                e = c.length
            }
            if (b > -1) {
                c.splice(b, 1);
                this.className = c.join(" ")
            }
            return this
        };
        a.hasClass = function(d) {
            return!!this.className.match(RegExp("\\s*" + d + "\\s*"))
        }
    }
    return a
},setMoviePath:function(a) {
    this.moviePath = a
},dispatch:function(a, d, c) {
    (a = this.clients[a]) && a.receiveEvent(d, c)
},register:function(a, d) {
    this.clients[a] = d
},getDOMObjectPosition:function(a, d) {
    for (var c = {left:0,top:0,width:a.width ? a.width : a.offsetWidth,height:a.height ? a.height : a.offsetHeight}; a && a != d;) {
        c.left += a.offsetLeft;
        c.top += a.offsetTop;
        a = a.offsetParent
    }
    return c
},Client:function(a) {
    this.handlers = {};
    this.id = ZeroClipboard.nextId++;
    this.movieId = "ZeroClipboardMovie_" + this.id;
    ZeroClipboard.register(this.id, this);
    a && this.glue(a)
}};
window.ZeroClipboard.Client.prototype = {id:0,ready:false,movie:null,clipText:"",handCursorEnabled:true,cssEffects:true,handlers:null,glue:function(a, d, c) {
    this.domElement = ZeroClipboard.$(a);
    if (typeof d == "string")d = ZeroClipboard.$(d); else if (typeof d == "undefined")d = document.getElementsByTagName("body")[0];
    a = ZeroClipboard.getDOMObjectPosition(this.domElement, d);
    this.div = document.createElement("div");
    var b = this.div.style;
    b.position = "absolute";
    b.left = "" + a.left + "px";
    b.top = "" + a.top + "px";
    b.width = "" + a.width +
            "px";
    b.height = "" + a.height + "px";
    b.zIndex = 1E5;
    if (typeof c == "object")for (addedStyle in c)b[addedStyle] = c[addedStyle];
    d.appendChild(this.div);
    this.div.innerHTML = this.getHTML(a.width, a.height)
},getHTML:function(a, d) {
    var c = "",b = "id=" + this.id + "&width=" + a + "&height=" + d;
    if (navigator.userAgent.match(/MSIE/)) {
        var e = location.href.match(/^https/i) ? "https://" : "http://";
        c += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + e + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' +
                a + '" height="' + d + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + b + '"/><param name="wmode" value="transparent"/></object>'
    } else c += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath +
            '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + a + '" height="' + d + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + b + '" wmode="transparent" />';
    return c
},hide:function() {
    if (this.div)this.div.style.left = "-2000px"
},show:function() {
    this.reposition()
},destroy:function() {
    if (this.domElement && this.div) {
        this.hide();
        this.div.innerHTML =
                "";
        var a = document.getElementsByTagName("body")[0];
        try {
            a.removeChild(this.div)
        } catch(d) {
        }
        this.div = this.domElement = null
    }
},reposition:function(a) {
    if (a)(this.domElement = ZeroClipboard.$(a)) || this.hide();
    if (this.domElement && this.div) {
        a = ZeroClipboard.getDOMObjectPosition(this.domElement);
        var d = this.div.style;
        d.left = "" + a.left + "px";
        d.top = "" + a.top + "px"
    }
},setText:function(a) {
    this.clipText = a;
    this.ready && this.movie.setText(a)
},addEventListener:function(a, d) {
    a = a.toString().toLowerCase().replace(/^on/, "");
    this.handlers[a] ||
    (this.handlers[a] = []);
    this.handlers[a].push(d)
},setHandCursor:function(a) {
    this.handCursorEnabled = a;
    this.ready && this.movie.setHandCursor(a)
},setCSSEffects:function(a) {
    this.cssEffects = !!a
},receiveEvent:function(a, d) {
    a = a.toString().toLowerCase().replace(/^on/, "");
    switch (a) {
        case "load":
            this.movie = document.getElementById(this.movieId);
            if (!this.movie) {
                var c = this;
                setTimeout(function() {
                    c.receiveEvent("load", null)
                }, 1);
                return
            }
            if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                c =
                        this;
                setTimeout(function() {
                    c.receiveEvent("load", null)
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
    if (this.handlers[a])for (var b = 0,e = this.handlers[a].length; b < e; b++) {
        var f = this.handlers[a][b];
        if (typeof f == "function")f(this, d); else if (typeof f == "object" && f.length == 2)f[0][f[1]](this, d); else typeof f == "string" && window[f](this, d)
    }
}};
(function(a) {
    var d = function(c) {
        var b = 65,e = {eventName:"click",onShow:function() {
        },onBeforeShow:function() {
        },onHide:function() {
        },onChange:function() {
        },onSubmit:function() {
        },color:"ff0000",livePreview:true,flat:false},f = function(y, Q) {
            var ua = Da(y);
            a(Q).data("colorpicker").fields.eq(1).val(ua.r).end().eq(2).val(ua.g).end().eq(3).val(ua.b).end()
        },j = function(y, Q) {
            a(Q).data("colorpicker").fields.eq(4).val(y.h).end().eq(5).val(y.s).end().eq(6).val(y.b).end()
        },h = function(y, Q) {
            a(Q).data("colorpicker").fields.eq(0).val(Ba(Da(y))).end()
        },
                l = function(y, Q) {
                    a(Q).data("colorpicker").selector.css("backgroundColor", "#" + Ba(Da({h:y.h,s:100,b:100})));
                    a(Q).data("colorpicker").selectorIndic.css({left:parseInt(150 * y.s / 100, 10),top:parseInt(150 * (100 - y.b) / 100, 10)})
                },o = function(y, Q) {
            a(Q).data("colorpicker").hue.css("top", parseInt(150 - 150 * y.h / 360, 10))
        },r = function(y, Q) {
            a(Q).data("colorpicker").currentColor.css("backgroundColor", "#" + Ba(Da(y)))
        },u = function(y, Q) {
            a(Q).data("colorpicker").newColor.css("backgroundColor", "#" + Ba(Da(y)))
        },C = function(y) {
            y = y.charCode ||
                    y.keyCode || -1;
            if (y > b && y <= 90 || y == 32)return false;
            a(this).parent().parent().data("colorpicker").livePreview === true && F.apply(this)
        },F = function(y) {
            var Q = a(this).parent().parent(),ua;
            if (this.parentNode.className.indexOf("_hex") > 0) {
                ua = Q.data("colorpicker");
                var oa = this.value,O = 6 - oa.length;
                if (O > 0) {
                    for (var Z = [],la = 0; la < O; la++)Z.push("0");
                    Z.push(oa);
                    oa = Z.join("")
                }
                oa = ya(sa(oa));
                ua.color = ua = oa
            } else if (this.parentNode.className.indexOf("_hsb") > 0)Q.data("colorpicker").color = ua = U({h:parseInt(Q.data("colorpicker").fields.eq(4).val(),
                    10),s:parseInt(Q.data("colorpicker").fields.eq(5).val(), 10),b:parseInt(Q.data("colorpicker").fields.eq(6).val(), 10)}); else {
                ua = Q.data("colorpicker");
                oa = {r:parseInt(Q.data("colorpicker").fields.eq(1).val(), 10),g:parseInt(Q.data("colorpicker").fields.eq(2).val(), 10),b:parseInt(Q.data("colorpicker").fields.eq(3).val(), 10)};
                ua.color = ua = ya({r:Math.min(255, Math.max(0, oa.r)),g:Math.min(255, Math.max(0, oa.g)),b:Math.min(255, Math.max(0, oa.b))})
            }
            if (y) {
                f(ua, Q.get(0));
                h(ua, Q.get(0));
                j(ua, Q.get(0))
            }
            l(ua, Q.get(0));
            o(ua, Q.get(0));
            u(ua, Q.get(0));
            Q.data("colorpicker").onChange.apply(Q, [ua,Ba(Da(ua)),Da(ua)])
        },x = function() {
            a(this).parent().parent().data("colorpicker").fields.parent().removeClass("colorpicker_focus")
        },I = function() {
            b = this.parentNode.className.indexOf("_hex") > 0 ? 70 : 65;
            a(this).parent().parent().data("colorpicker").fields.parent().removeClass("colorpicker_focus");
            a(this).parent().addClass("colorpicker_focus")
        },G = function(y) {
            var Q = a(this).parent().find("input").focus();
            y = {el:a(this).parent().addClass("colorpicker_slider"),
                max:this.parentNode.className.indexOf("_hsb_h") > 0 ? 360 : this.parentNode.className.indexOf("_hsb") > 0 ? 100 : 255,y:y.pageY,field:Q,val:parseInt(Q.val(), 10),preview:a(this).parent().parent().data("colorpicker").livePreview};
            a(document).bind("mouseup", y, A);
            a(document).bind("mousemove", y, H);
            return false
        },H = function(y) {
            y.data.field.val(Math.max(0, Math.min(y.data.max, parseInt(y.data.val + y.pageY - y.data.y, 10))));
            y.data.preview && F.apply(y.data.field.get(0), [true]);
            return false
        },A = function(y) {
            F.apply(y.data.field.get(0),
                    [true]);
            y.data.el.removeClass("colorpicker_slider").find("input").focus();
            a(document).unbind("mouseup", A);
            a(document).unbind("mousemove", H);
            return false
        },N = function() {
            var y = {cal:a(this).parent(),y:a(this).offset().top};
            y.preview = y.cal.data("colorpicker").livePreview;
            a(document).bind("mouseup", y, K);
            a(document).bind("mousemove", y, ba);
            return false
        },ba = function(y) {
            F.apply(y.data.cal.data("colorpicker").fields.eq(4).val(parseInt(360 * (150 - Math.max(0, Math.min(150, y.pageY - y.data.y))) / 150, 10)).get(0), [y.data.preview]);
            return false
        },K = function(y) {
            f(y.data.cal.data("colorpicker").color, y.data.cal.get(0));
            h(y.data.cal.data("colorpicker").color, y.data.cal.get(0));
            a(document).unbind("mouseup", K);
            a(document).unbind("mousemove", ba);
            return false
        },W = function(y) {
            var Q = {cal:a(this).parent(),pos:a(this).offset()};
            Q.preview = Q.cal.data("colorpicker").livePreview;
            a(document).bind("mouseup", Q, fa);
            a(document).bind("mousemove", Q, ka);
            y.data = Q;
            ka(y);
            return false
        },ka = function(y) {
            F.apply(y.data.cal.data("colorpicker").fields.eq(6).val(parseInt(100 *
                    (150 - Math.max(0, Math.min(150, y.pageY - y.data.pos.top))) / 150, 10)).end().eq(5).val(parseInt(100 * Math.max(0, Math.min(150, y.pageX - y.data.pos.left)) / 150, 10)).get(0), [y.data.preview]);
            return false
        },fa = function(y) {
            f(y.data.cal.data("colorpicker").color, y.data.cal.get(0));
            h(y.data.cal.data("colorpicker").color, y.data.cal.get(0));
            a(document).unbind("mouseup", fa);
            a(document).unbind("mousemove", ka);
            return false
        },ha = function() {
            a(this).addClass("colorpicker_focus")
        },qa = function() {
            a(this).removeClass("colorpicker_focus")
        },
                aa = function() {
                    var y = a(this).parent(),Q = y.data("colorpicker").color;
                    y.data("colorpicker").origColor = Q;
                    r(Q, y.get(0));
                    y.data("colorpicker").onSubmit(Q, Ba(Da(Q)), Da(Q));
                    return false
                },ca = function() {
            var y = a("#" + a(this).data("colorpickerId"));
            y.data("colorpicker").onBeforeShow.apply(this, [y.get(0)]);
            var Q = a(this).offset(),ua,oa,O,Z;
            if (document.documentElement) {
                ua = document.documentElement.scrollTop;
                oa = document.documentElement.scrollLeft;
                O = document.documentElement.scrollWidth;
                Z = document.documentElement.scrollHeight
            } else {
                ua =
                        document.body.scrollTop;
                oa = document.body.scrollLeft;
                O = document.body.scrollWidth;
                Z = document.body.scrollHeight
            }
            ua = {t:ua,l:oa,w:O,h:Z,iw:self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,ih:self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0};
            oa = Q.top + this.offsetHeight;
            Q = Q.left - 178;
            if (oa + 176 > ua.t + Math.min(ua.h, ua.ih))oa -= this.offsetHeight + 176;
            if (Q + 356 > ua.l + Math.min(ua.w, ua.iw))Q -= 356;
            y.css({left:Q + "px",top:oa + "px"});
            y.data("colorpicker").onShow.apply(this,
                    [y.get(0)]) != false && y.show();
            a(document).bind("mousedown", {cal:y}, ea);
            return false
        },ea = function(y) {
            if (!m(y.data.cal.get(0), y.target, y.data.cal.get(0))) {
                y.data.cal.data("colorpicker").onHide.apply(this, [y.data.cal.get(0)]) != false && y.data.cal.hide();
                a(document).unbind("mousedown", ea)
            }
        },m = function(y, Q, ua) {
            if (y == Q)return true;
            if (y.contains && !a.browser.safari)return y.contains(Q);
            if (y.compareDocumentPosition)return!!(y.compareDocumentPosition(Q) & 16);
            for (Q = Q.parentNode; Q && Q != ua;) {
                if (Q == y)return true;
                Q =
                        Q.parentNode
            }
            return false
        },U = function(y) {
            return{h:Math.min(360, Math.max(0, y.h)),s:Math.min(100, Math.max(0, y.s)),b:Math.min(100, Math.max(0, y.b))}
        },sa = function(y) {
            y = parseInt(y.indexOf("#") > -1 ? y.substring(1) : y, 16);
            return{r:y >> 16,g:(y & 65280) >> 8,b:y & 255}
        },ya = function(y) {
            var Q = {};
            Q.b = Math.max(Math.max(y.r, y.g), y.b);
            Q.s = Q.b <= 0 ? 0 : Math.round(100 * (Q.b - Math.min(Math.min(y.r, y.g), y.b)) / Q.b);
            Q.b = Math.round(Q.b / 255 * 100);
            Q.h = y.r == y.g && y.g == y.b ? 0 : y.r >= y.g && y.g >= y.b ? 60 * (y.g - y.b) / (y.r - y.b) : y.g >= y.r && y.r >= y.b ? 60 + 60 *
                    (y.g - y.r) / (y.g - y.b) : y.g >= y.b && y.b >= y.r ? 120 + 60 * (y.b - y.r) / (y.g - y.r) : y.b >= y.g && y.g >= y.r ? 180 + 60 * (y.b - y.g) / (y.b - y.r) : y.b >= y.r && y.r >= y.g ? 240 + 60 * (y.r - y.g) / (y.b - y.g) : y.r >= y.b && y.b >= y.g ? 300 + 60 * (y.r - y.b) / (y.r - y.g) : 0;
            Q.h = Math.round(Q.h);
            return Q
        },Da = function(y) {
            var Q = {},ua = Math.round(y.h),oa = Math.round(y.s * 255 / 100);
            y = Math.round(y.b * 255 / 100);
            if (oa == 0)Q.r = Q.g = Q.b = y; else {
                oa = (255 - oa) * y / 255;
                var O = (y - oa) * (ua % 60) / 60;
                if (ua == 360)ua = 0;
                if (ua < 60) {
                    Q.r = y;
                    Q.b = oa;
                    Q.g = oa + O
                } else if (ua < 120) {
                    Q.g = y;
                    Q.b = oa;
                    Q.r = y - O
                } else if (ua < 180) {
                    Q.g =
                            y;
                    Q.r = oa;
                    Q.b = oa + O
                } else if (ua < 240) {
                    Q.b = y;
                    Q.r = oa;
                    Q.g = y - O
                } else if (ua < 300) {
                    Q.b = y;
                    Q.g = oa;
                    Q.r = oa + O
                } else if (ua < 360) {
                    Q.r = y;
                    Q.g = oa;
                    Q.b = y - O
                } else {
                    Q.r = 0;
                    Q.g = 0;
                    Q.b = 0
                }
            }
            return{r:Math.round(Q.r),g:Math.round(Q.g),b:Math.round(Q.b)}
        },Ba = function(y) {
            var Q = [y.r.toString(16),y.g.toString(16),y.b.toString(16)];
            a.each(Q, function(ua, oa) {
                if (oa.length == 1)Q[ua] = "0" + oa
            });
            return Q.join("")
        };
        return{init:function(y) {
            y = a.extend({}, e, y || {});
            if (typeof y.color == "string")y.color = ya(sa(y.color)); else if (y.color.r != c && y.color.g != c &&
                    y.color.b != c)y.color = ya(y.color); else if (y.color.h != c && y.color.s != c && y.color.b != c)y.color = U(y.color); else return this;
            y.origColor = y.color;
            return this.each(function() {
                if (!a(this).data("colorpickerId")) {
                    var Q = "collorpicker_" + parseInt(Math.random() * 1E3);
                    a(this).data("colorpickerId", Q);
                    Q = a('<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>').attr("id",
                            Q);
                    y.flat ? Q.appendTo(this).show() : Q.appendTo(document.body);
                    y.fields = Q.find("input").bind("keydown", C).bind("change", F).bind("blur", x).bind("focus", I);
                    Q.find("span").bind("mousedown", G);
                    y.selector = Q.find("div.colorpicker_color").bind("mousedown", W);
                    y.selectorIndic = y.selector.find("div div");
                    y.hue = Q.find("div.colorpicker_hue div");
                    Q.find("div.colorpicker_hue").bind("mousedown", N);
                    y.newColor = Q.find("div.colorpicker_new_color");
                    y.currentColor = Q.find("div.colorpicker_current_color");
                    Q.data("colorpicker",
                            y);
                    Q.find("div.colorpicker_submit").bind("mouseenter", ha).bind("mouseleave", qa).bind("click", aa);
                    f(y.color, Q.get(0));
                    j(y.color, Q.get(0));
                    h(y.color, Q.get(0));
                    o(y.color, Q.get(0));
                    l(y.color, Q.get(0));
                    r(y.color, Q.get(0));
                    u(y.color, Q.get(0));
                    y.flat ? Q.css({position:"relative",display:"block"}) : a(this).bind(y.eventName, ca)
                }
            })
        },showPicker:function() {
            return this.each(function() {
                a(this).data("colorpickerId") && ca.apply(this)
            })
        },hidePicker:function() {
            return this.each(function(y) {
                a(this).data("colorpickerId") &&
                a("#" + a(this).data("colorpickerId")).hide();
                y.stopPropagation && y.stopPropagation();
                y.preventDefault && y.preventDefault();
                y.returnValue = false;
                y.cancelBubble = true
            })
        },setColor:function(y) {
            if (typeof y == "string")y = ya(sa(y)); else if (y.r != c && y.g != c && y.b != c)y = ya(y); else if (y.h != c && y.s != c && y.b != c)y = U(y); else return this;
            return this.each(function() {
                if (a(this).data("colorpickerId")) {
                    var Q = a("#" + a(this).data("colorpickerId"));
                    Q.data("colorpicker").color = y;
                    Q.data("colorpicker").origColor = y;
                    f(y, Q.get(0));
                    j(y, Q.get(0));
                    h(y, Q.get(0));
                    o(y, Q.get(0));
                    l(y, Q.get(0));
                    r(y, Q.get(0));
                    u(y, Q.get(0))
                }
            })
        }}
    }();
    a.fn.extend({ColorPicker:d.init,ColorPickerHide:d.hide,ColorPickerShow:d.show,ColorPickerSetColor:d.setColor})
})($);
(function(a, d) {
    var c = window.EYE = function() {
        var b = {init:[]};
        return{init:function() {
            a.each(b.init, function(e, f) {
                f.call()
            })
        },extend:function(e) {
            for (var f in e)if (e[f] != d)this[f] = e[f]
        },register:function(e, f) {
            b[f] || (b[f] = []);
            b[f].push(e)
        }}
    }();
    a(c.init)
})(jQuery);
(function(a) {
    EYE.extend({getPosition:function(d, c) {
        var b = 0,e = 0,f = d.style,j = false;
        if (c && jQuery.curCSS(d, "display") == "none") {
            var h = f.visibility,l = f.position;
            j = true;
            f.visibility = "hidden";
            f.display = "block";
            f.position = "absolute"
        }
        var o = d;
        if (o.getBoundingClientRect) {
            e = o.getBoundingClientRect();
            b = e.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) - 2;
            e = e.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - 2
        } else {
            b = o.offsetLeft;
            e = o.offsetTop;
            o = o.offsetParent;
            if (d !=
                    o)for (; o;) {
                b += o.offsetLeft;
                e += o.offsetTop;
                o = o.offsetParent
            }
            if (jQuery.browser.safari && jQuery.curCSS(d, "position") == "absolute") {
                b -= document.body.offsetLeft;
                e -= document.body.offsetTop
            }
            for (o = d.parentNode; o && o.tagName.toUpperCase() != "BODY" && o.tagName.toUpperCase() != "HTML";) {
                if (jQuery.curCSS(o, "display") != "inline") {
                    b -= o.scrollLeft;
                    e -= o.scrollTop
                }
                o = o.parentNode
            }
        }
        if (j == true) {
            f.display = "none";
            f.position = l;
            f.visibility = h
        }
        return{x:b,y:e}
    },getSize:function(d) {
        var c = parseInt(jQuery.curCSS(d, "width"), 10),b = parseInt(jQuery.curCSS(d,
                "height"), 10),e = 0,f = 0;
        if (jQuery.curCSS(d, "display") != "none") {
            e = d.offsetWidth;
            f = d.offsetHeight
        } else {
            var j = d.style,h = j.visibility,l = j.position;
            j.visibility = "hidden";
            j.display = "block";
            j.position = "absolute";
            e = d.offsetWidth;
            f = d.offsetHeight;
            j.display = "none";
            j.position = l;
            j.visibility = h
        }
        return{w:c,h:b,wb:e,hb:f}
    },getClient:function(d) {
        var c;
        if (d) {
            c = d.clientWidth;
            d = d.clientHeight
        } else {
            d = document.documentElement;
            c = window.innerWidth || self.innerWidth || d && d.clientWidth || document.body.clientWidth;
            d = window.innerHeight ||
                    self.innerHeight || d && d.clientHeight || document.body.clientHeight
        }
        return{w:c,h:d}
    },getScroll:function(d) {
        var c = 0,b = 0,e = 0,f = 0,j = 0,h = 0;
        if (d && d.nodeName.toLowerCase() != "body") {
            c = d.scrollTop;
            b = d.scrollLeft;
            e = d.scrollWidth;
            f = d.scrollHeight
        } else {
            if (document.documentElement) {
                c = document.documentElement.scrollTop;
                b = document.documentElement.scrollLeft;
                e = document.documentElement.scrollWidth;
                f = document.documentElement.scrollHeight
            } else if (document.body) {
                c = document.body.scrollTop;
                b = document.body.scrollLeft;
                e = document.body.scrollWidth;
                f = document.body.scrollHeight
            }
            if (typeof pageYOffset != "undefined") {
                c = pageYOffset;
                b = pageXOffset
            }
            j = self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
            h = self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
        }
        return{t:c,l:b,w:e,h:f,iw:j,ih:h}
    },getMargins:function(d, c) {
        var b = jQuery.curCSS(d, "marginTop") || "",e = jQuery.curCSS(d, "marginRight") || "",f = jQuery.curCSS(d, "marginBottom") || "",j = jQuery.curCSS(d, "marginLeft") || "";
        return c ? {t:parseInt(b,
                10) || 0,r:parseInt(e, 10) || 0,b:parseInt(f, 10) || 0,l:parseInt(j, 10)} : {t:b,r:e,b:f,l:j}
    },getPadding:function(d, c) {
        var b = jQuery.curCSS(d, "paddingTop") || "",e = jQuery.curCSS(d, "paddingRight") || "",f = jQuery.curCSS(d, "paddingBottom") || "",j = jQuery.curCSS(d, "paddingLeft") || "";
        return c ? {t:parseInt(b, 10) || 0,r:parseInt(e, 10) || 0,b:parseInt(f, 10) || 0,l:parseInt(j, 10)} : {t:b,r:e,b:f,l:j}
    },getBorder:function(d, c) {
        var b = jQuery.curCSS(d, "borderTopWidth") || "",e = jQuery.curCSS(d, "borderRightWidth") || "",f = jQuery.curCSS(d, "borderBottomWidth") ||
                "",j = jQuery.curCSS(d, "borderLeftWidth") || "";
        return c ? {t:parseInt(b, 10) || 0,r:parseInt(e, 10) || 0,b:parseInt(f, 10) || 0,l:parseInt(j, 10) || 0} : {t:b,r:e,b:f,l:j}
    },traverseDOM:function(d, c) {
        c(d);
        for (d = d.firstChild; d;) {
            EYE.traverseDOM(d, c);
            d = d.nextSibling
        }
    },getInnerWidth:function(d, c) {
        var b = d.offsetWidth;
        return c ? Math.max(d.scrollWidth, b) - b + d.clientWidth : d.clientWidth
    },getInnerHeight:function(d, c) {
        var b = d.offsetHeight;
        return c ? Math.max(d.scrollHeight, b) - b + d.clientHeight : d.clientHeight
    },getExtraWidth:function(d) {
        if (a.boxModel)return(parseInt(a.curCSS(d,
                "paddingLeft")) || 0) + (parseInt(a.curCSS(d, "paddingRight")) || 0) + (parseInt(a.curCSS(d, "borderLeftWidth")) || 0) + (parseInt(a.curCSS(d, "borderRightWidth")) || 0);
        return 0
    },getExtraHeight:function(d) {
        if (a.boxModel)return(parseInt(a.curCSS(d, "paddingTop")) || 0) + (parseInt(a.curCSS(d, "paddingBottom")) || 0) + (parseInt(a.curCSS(d, "borderTopWidth")) || 0) + (parseInt(a.curCSS(d, "borderBottomWidth")) || 0);
        return 0
    },isChildOf:function(d, c, b) {
        if (d == c)return true;
        if (!c || !c.nodeType || c.nodeType != 1)return false;
        if (d.contains &&
                !a.browser.safari)return d.contains(c);
        if (d.compareDocumentPosition)return!!(d.compareDocumentPosition(c) & 16);
        for (c = c.parentNode; c && c != b;) {
            if (c == d)return true;
            c = c.parentNode
        }
        return false
    },centerEl:function(d, c) {
        var b = EYE.getScroll(),e = EYE.getSize(d);
        if (!c || c == "vertically")a(d).css({top:b.t + (Math.min(b.h, b.ih) - e.hb) / 2 + "px"});
        if (!c || c == "horizontally")a(d).css({left:b.l + (Math.min(b.w, b.iw) - e.wb) / 2 + "px"})
    }});
    if (!a.easing.easeout)a.easing.easeout = function(d, c, b, e, f) {
        return-e * ((c = c / f - 1) * c * c * c - 1) + b
    }
})(jQuery);
(function(a) {
    var d = function() {
        var c = a("ul.navigationTabs a").removeClass("active").index(this);
        a(this).addClass("active").blur();
        a("div.tab").hide().eq(c).show()
    };
    EYE.register(function() {
        var c = window.location.hash.replace("#", "");
        c = a("ul.navigationTabs a").bind("click", d).filter("a[rel=" + c + "]");
        c.size() && d.apply(c.get(0), []);
        a("#colorpickerHolder").ColorPicker({flat:true});
        a("#colorpickerHolder2").ColorPicker({flat:true,color:"#00ff00",onSubmit:function(e, f) {
            a("#colorSelector2 div").css("backgroundColor",
                    "#" + f)
        }});
        a("#colorpickerHolder2>div").css("position", "absolute");
        var b = false;
        a("#colorSelector2").bind("click", function() {
            a("#colorpickerHolder2").stop().animate({height:b ? 0 : 173}, 500);
            b = !b
        });
        a("#colorpickerField1").ColorPicker({onSubmit:function(e, f) {
            a("#colorpickerField1").val(f)
        },onBeforeShow:function() {
            a(this).ColorPickerSetColor(this.value)
        }}).bind("keyup", function() {
                    a(this).ColorPickerSetColor(this.value)
                });
        a("#colorSelector").ColorPicker({color:"#0000ff",onShow:function(e) {
            a(e).fadeIn(500);
            return false
        },onHide:function(e) {
            a(e).fadeOut(500);
            return false
        },onChange:function(e, f) {
            a("#colorSelector div").css("backgroundColor", "#" + f)
        }})
    }, "init")
})(jQuery);
(function() {
    function a(j) {
        return new a.fn.init(j)
    }

    function d(j, h, l) {
        if (!l.contentWindow.postMessage)return false;
        var o = l.getAttribute("src").split("?")[0];
        j = JSON.stringify({method:j,value:h});
        l.contentWindow.postMessage(j, o)
    }

    function c(j) {
        if (j.origin != playerDomain)return false;
        var h = JSON.parse(j.data);
        j = h.value;
        var l = h.data,o = o == "" ? null : h.player_id;
        h = o ? e[o][h.event || h.method] : e[h.event || h.method];
        var r = [];
        if (!h)return false;
        j !== undefined && r.push(j);
        l && r.push(l);
        o && r.push(o);
        return r.length > 0 ? h.apply(null,
                r) : h.call()
    }

    function b(j, h, l) {
        if (l) {
            e[l] || (e[l] = {});
            e[l][j] = h
        } else e[j] = h
    }

    var e = {},f = false;
    a.fn = a.prototype = {playerDomain:"",element:null,init:function(j) {
        if (typeof j === "string")j = document.getElementById(j);
        this.element = j;
        return this
    },api:function(j, h) {
        if (!this.element || !j)return false;
        var l = this.element,o = l.id != "" ? l.id : null,r = !(h && h.constructor && h.call && h.apply) ? h : null,u = h && h.constructor && h.call && h.apply ? h : null;
        u && b(j, u, o);
        d(j, r, l);
        return this
    },addEvent:function(j, h) {
        if (!this.element)return false;
        var l = this.element;
        b(j, h, l.id != "" ? l.id : null);
        j != "ready" && d("addEventListener", j, l);
        if (f)return this;
        l = l.getAttribute("src").split("/");
        for (var o = "",r = 0,u = l.length; r < u; r++) {
            if (r < 3)o += l[r]; else break;
            if (r < 2)o += "/"
        }
        playerDomain = o;
        window.addEventListener ? window.addEventListener("message", c, false) : window.attachEvent("onmessage", c, false);
        f = true;
        return this
    },removeEvent:function(j) {
        if (!this.element)return false;
        var h = this.element,l;
        a:{
            if ((l = h.id != "" ? h.id : null) && e[l]) {
                if (!e[l][j]) {
                    l = false;
                    break a
                }
                e[l][j] =
                        null
            } else {
                if (!e[j]) {
                    l = false;
                    break a
                }
                e[j] = null
            }
            l = true
        }
        j != "ready" && l && d("removeEventListener", j, h)
    }};
    a.fn.init.prototype = a.fn;
    return window.Froogaloop = window.$f = a
})();
var OAuth;
if (OAuth == null)OAuth = {};
OAuth.setProperties = function(a, d) {
    if (a != null && d != null)for (var c in d)a[c] = d[c];
    return a
};
OAuth.setProperties(OAuth, {percentEncode:function(a) {
    if (a == null)return"";
    if (a instanceof Array) {
        for (var d = ""; 0 < a.length; ++a) {
            if (d != "")d += "&";
            d += OAuth.percentEncode(a[0])
        }
        return d
    }
    a = encodeURIComponent(a);
    a = a.replace(/\!/g, "%21");
    a = a.replace(/\*/g, "%2A");
    a = a.replace(/\'/g, "%27");
    a = a.replace(/\(/g, "%28");
    return a = a.replace(/\)/g, "%29")
},decodePercent:function(a) {
    if (a != null)a = a.replace(/\+/g, " ");
    return decodeURIComponent(a)
},getParameterList:function(a) {
    if (a == null)return[];
    if (typeof a != "object")return OAuth.decodeForm(a +
            "");
    if (a instanceof Array)return a;
    var d = [];
    for (var c in a)d.push([c,a[c]]);
    return d
},getParameterMap:function(a) {
    if (a == null)return{};
    if (typeof a != "object")return OAuth.getParameterMap(OAuth.decodeForm(a + ""));
    if (a instanceof Array) {
        for (var d = {},c = 0; c < a.length; ++c) {
            var b = a[c][0];
            if (d[b] === undefined)d[b] = a[c][1]
        }
        return d
    }
    return a
},getParameter:function(a, d) {
    if (a instanceof Array)for (var c = 0; c < a.length; ++c) {
        if (a[c][0] == d)return a[c][1]
    } else return OAuth.getParameterMap(a)[d];
    return null
},formEncode:function(a) {
    var d =
            "";
    a = OAuth.getParameterList(a);
    for (var c = 0; c < a.length; ++c) {
        var b = a[c][1];
        if (b == null)b = "";
        if (d != "")d += "&";
        d += OAuth.percentEncode(a[c][0]) + "=" + OAuth.percentEncode(b)
    }
    return d
},decodeForm:function(a) {
    var d = [];
    a = a.split("&");
    for (var c = 0; c < a.length; ++c) {
        var b = a[c];
        if (b != "") {
            var e = b.indexOf("="),f;
            if (e < 0) {
                f = OAuth.decodePercent(b);
                b = null
            } else {
                f = OAuth.decodePercent(b.substring(0, e));
                b = OAuth.decodePercent(b.substring(e + 1))
            }
            d.push([f,b])
        }
    }
    return d
},setParameter:function(a, d, c) {
    var b = a.parameters;
    if (b instanceof
            Array) {
        for (a = 0; a < b.length; ++a)if (b[a][0] == d)if (c === undefined)b.splice(a, 1); else {
            b[a][1] = c;
            c = undefined
        }
        c !== undefined && b.push([d,c])
    } else {
        b = OAuth.getParameterMap(b);
        b[d] = c;
        a.parameters = b
    }
},setParameters:function(a, d) {
    for (var c = OAuth.getParameterList(d),b = 0; b < c.length; ++b)OAuth.setParameter(a, c[b][0], c[b][1])
},completeRequest:function(a, d) {
    if (a.method == null)a.method = "GET";
    var c = OAuth.getParameterMap(a.parameters);
    if (c.oauth_consumer_key == null)OAuth.setParameter(a, "oauth_consumer_key", d.consumerKey ||
            "");
    c.oauth_token == null && d.token != null && OAuth.setParameter(a, "oauth_token", d.token);
    c.oauth_version == null && OAuth.setParameter(a, "oauth_version", "1.0");
    c.oauth_timestamp == null && OAuth.setParameter(a, "oauth_timestamp", OAuth.timestamp());
    c.oauth_nonce == null && OAuth.setParameter(a, "oauth_nonce", OAuth.nonce(6));
    OAuth.SignatureMethod.sign(a, d)
},setTimestampAndNonce:function(a) {
    OAuth.setParameter(a, "oauth_timestamp", OAuth.timestamp());
    OAuth.setParameter(a, "oauth_nonce", OAuth.nonce(6))
},addToURL:function(a, d) {
    newURL = a;
    if (d != null) {
        var c = OAuth.formEncode(d);
        if (c.length > 0) {
            var b = a.indexOf("?");
            newURL += b < 0 ? "?" : "&";
            newURL += c
        }
    }
    return newURL
},getAuthorizationHeader:function(a, d) {
    for (var c = 'OAuth realm="' + OAuth.percentEncode(a) + '"',b = OAuth.getParameterList(d),e = 0; e < b.length; ++e) {
        var f = b[e],j = f[0];
        if (j.indexOf("oauth_") == 0)c += "," + OAuth.percentEncode(j) + '="' + OAuth.percentEncode(f[1]) + '"'
    }
    return c
},correctTimestamp:function(a) {
    OAuth.timeCorrectionMsec = a * 1E3 - (new Date).getTime()
},timeCorrectionMsec:0,timestamp:function() {
    var a =
            (new Date).getTime() + OAuth.timeCorrectionMsec;
    return Math.floor(a / 1E3)
},nonce:function(a) {
    for (var d = OAuth.nonce.CHARS,c = "",b = 0; b < a; ++b) {
        var e = Math.floor(Math.random() * d.length);
        c += d.substring(e, e + 1)
    }
    return c
}});
OAuth.nonce.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
OAuth.declareClass = function(a, d, c) {
    var b = a[d];
    a[d] = c;
    if (c != null && b != null)for (var e in b)if (e != "prototype")c[e] = b[e];
    return c
};
OAuth.declareClass(OAuth, "SignatureMethod", function() {
});
OAuth.setProperties(OAuth.SignatureMethod.prototype, {sign:function(a) {
    var d = this.getSignature(OAuth.SignatureMethod.getBaseString(a));
    OAuth.setParameter(a, "oauth_signature", d);
    return d
},initialize:function(a, d) {
    var c;
    c = d.accessorSecret != null && a.length > 9 && a.substring(a.length - 9) == "-Accessor" ? d.accessorSecret : d.consumerSecret;
    this.key = OAuth.percentEncode(c) + "&" + OAuth.percentEncode(d.tokenSecret)
}});
OAuth.setProperties(OAuth.SignatureMethod, {sign:function(a, d) {
    var c = OAuth.getParameterMap(a.parameters).oauth_signature_method;
    if (c == null || c == "") {
        c = "HMAC-SHA1";
        OAuth.setParameter(a, "oauth_signature_method", c)
    }
    OAuth.SignatureMethod.newMethod(c, d).sign(a)
},newMethod:function(a, d) {
    var c = OAuth.SignatureMethod.REGISTERED[a];
    if (c != null) {
        var b = new c;
        b.initialize(a, d);
        return b
    }
    c = Error("signature_method_rejected");
    var e = "";
    for (b in OAuth.SignatureMethod.REGISTERED) {
        if (e != "")e += "&";
        e += OAuth.percentEncode(b)
    }
    c.oauth_acceptable_signature_methods =
            e;
    throw c;
},REGISTERED:{},registerMethodClass:function(a, d) {
    for (var c = 0; c < a.length; ++c)OAuth.SignatureMethod.REGISTERED[a[c]] = d
},makeSubclass:function(a) {
    var d = OAuth.SignatureMethod,c = function() {
        d.call(this)
    };
    c.prototype = new d;
    c.prototype.getSignature = a;
    return c.prototype.constructor = c
},getBaseString:function(a) {
    var d = a.action,c = d.indexOf("?");
    if (c < 0)c = a.parameters; else {
        c = OAuth.decodeForm(d.substring(c + 1));
        for (var b = OAuth.getParameterList(a.parameters),e = 0; e < b.length; ++e)c.push(b[e])
    }
    return OAuth.percentEncode(a.method.toUpperCase()) +
            "&" + OAuth.percentEncode(OAuth.SignatureMethod.normalizeUrl(d)) + "&" + OAuth.percentEncode(OAuth.SignatureMethod.normalizeParameters(c))
},normalizeUrl:function(a) {
    var d = OAuth.SignatureMethod.parseUri(a);
    a = d.protocol.toLowerCase();
    var c = d.authority.toLowerCase();
    if (a == "http" && d.port == 80 || a == "https" && d.port == 443) {
        var b = c.lastIndexOf(":");
        if (b >= 0)c = c.substring(0, b)
    }
    (d = d.path) || (d = "/");
    return a + "://" + c + d
},parseUri:function(a) {
    var d = {key:["source","protocol","authority","userInfo","user","password","host",
        "port","relative","path","directory","file","query","anchor"],parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/}};
    a = d.parser.strict.exec(a);
    for (var c = {},b = 14; b--;)c[d.key[b]] = a[b] || "";
    return c
},normalizeParameters:function(a) {
    if (a == null)return"";
    var d = OAuth.getParameterList(a);
    a = [];
    for (var c = 0; c < d.length; ++c) {
        var b = d[c];
        b[0] != "oauth_signature" && a.push([OAuth.percentEncode(b[0]) + " " + OAuth.percentEncode(b[1]),
            b])
    }
    a.sort(function(e, f) {
        if (e[0] < f[0])return-1;
        if (e[0] > f[0])return 1;
        return 0
    });
    d = [];
    for (c = 0; c < a.length; ++c)d.push(a[c][1]);
    return OAuth.formEncode(d)
}});
OAuth.SignatureMethod.registerMethodClass(["PLAINTEXT","PLAINTEXT-Accessor"], OAuth.SignatureMethod.makeSubclass(function() {
    return this.key
}));
OAuth.SignatureMethod.registerMethodClass(["HMAC-SHA1","HMAC-SHA1-Accessor"], OAuth.SignatureMethod.makeSubclass(function(a) {
    b64pad = "=";
    return b64_hmac_sha1(this.key, a)
}));
try {
    OAuth.correctTimestamp(gsConfig.timestamp)
} catch(e$$82) {
}
;
