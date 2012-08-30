var OAuth;

if (OAuth == null) OAuth = {};

OAuth.setProperties = function (a, d) {
    if (a != null && d != null)for (var b in d)a[b] = d[b];
    return a
};

OAuth.setProperties(OAuth, {
    percentEncode:function (a) {
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
    }, decodePercent:function (a) {
        if (a != null)a = a.replace(/\+/g, " ");
        return decodeURIComponent(a)
    }, getParameterList:function (a) {
        if (a == null)return[];
        if (typeof a != "object")return OAuth.decodeForm(a +
                "");
        if (a instanceof Array)return a;
        var d = [];
        for (var b in a)d.push([b, a[b]]);
        return d
    }, getParameterMap:function (a) {
        if (a == null)return{};
        if (typeof a != "object")return OAuth.getParameterMap(OAuth.decodeForm(a + ""));
        if (a instanceof Array) {
            for (var d = {}, b = 0; b < a.length; ++b) {
                var c = a[b][0];
                if (d[c] === undefined)d[c] = a[b][1]
            }
            return d
        }
        return a
    }, getParameter:function (a, d) {
        if (a instanceof Array)for (var b = 0; b < a.length; ++b) {
            if (a[b][0] == d)return a[b][1]
        } else return OAuth.getParameterMap(a)[d];
        return null
    }, formEncode:function (a) {
        var d =
                "";
        a = OAuth.getParameterList(a);
        for (var b = 0; b < a.length; ++b) {
            var c = a[b][1];
            if (c == null)c = "";
            if (d != "")d += "&";
            d += OAuth.percentEncode(a[b][0]) + "=" + OAuth.percentEncode(c)
        }
        return d
    }, decodeForm:function (a) {
        var d = [];
        a = a.split("&");
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            if (c != "") {
                var e = c.indexOf("="), f;
                if (e < 0) {
                    f = OAuth.decodePercent(c);
                    c = null
                } else {
                    f = OAuth.decodePercent(c.substring(0, e));
                    c = OAuth.decodePercent(c.substring(e + 1))
                }
                d.push([f, c])
            }
        }
        return d
    }, setParameter:function (a, d, b) {
        var c = a.parameters;
        if (c instanceof
                Array) {
            for (a = 0; a < c.length; ++a)if (c[a][0] == d)if (b === undefined)c.splice(a, 1); else {
                c[a][1] = b;
                b = undefined
            }
            b !== undefined && c.push([d, b])
        } else {
            c = OAuth.getParameterMap(c);
            c[d] = b;
            a.parameters = c
        }
    }, setParameters:function (a, d) {
        for (var b = OAuth.getParameterList(d), c = 0; c < b.length; ++c)OAuth.setParameter(a, b[c][0], b[c][1])
    }, completeRequest:function (a, d) {
        if (a.method == null)a.method = "GET";
        var b = OAuth.getParameterMap(a.parameters);
        if (b.oauth_consumer_key == null)OAuth.setParameter(a, "oauth_consumer_key", d.consumerKey ||
                "");
        b.oauth_token == null && d.token != null && OAuth.setParameter(a, "oauth_token", d.token);
        b.oauth_version == null && OAuth.setParameter(a, "oauth_version", "1.0");
        b.oauth_timestamp == null && OAuth.setParameter(a, "oauth_timestamp", OAuth.timestamp());
        b.oauth_nonce == null && OAuth.setParameter(a, "oauth_nonce", OAuth.nonce(6));
        OAuth.SignatureMethod.sign(a, d)
    }, setTimestampAndNonce:function (a) {
        OAuth.setParameter(a, "oauth_timestamp", OAuth.timestamp());
        OAuth.setParameter(a, "oauth_nonce", OAuth.nonce(6))
    }, addToURL:function (a, d) {
        newURL = a;
        if (d != null) {
            var b = OAuth.formEncode(d);
            if (b.length > 0) {
                var c = a.indexOf("?");
                newURL += c < 0 ? "?" : "&";
                newURL += b
            }
        }
        return newURL
    }, getAuthorizationHeader:function (a, d) {
        for (var b = 'OAuth realm="' + OAuth.percentEncode(a) + '"', c = OAuth.getParameterList(d), e = 0; e < c.length; ++e) {
            var f = c[e], j = f[0];
            if (j.indexOf("oauth_") == 0)b += "," + OAuth.percentEncode(j) + '="' + OAuth.percentEncode(f[1]) + '"'
        }
        return b
    }, correctTimestamp:function (a) {
        OAuth.timeCorrectionMsec = a * 1E3 - (new Date).getTime()
    }, timeCorrectionMsec:0, timestamp:function () {
        var a =
                (new Date).getTime() + OAuth.timeCorrectionMsec;
        return Math.floor(a / 1E3)
    }, nonce:function (a) {
        for (var d = OAuth.nonce.CHARS, b = "", c = 0; c < a; ++c) {
            var e = Math.floor(Math.random() * d.length);
            b += d.substring(e, e + 1)
        }
        return b
    }
});

OAuth.nonce.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

OAuth.declareClass = function (a, d, b) {
    var c = a[d];
    a[d] = b;
    if (b != null && c != null)for (var e in c)if (e != "prototype")b[e] = c[e];
    return b
};

OAuth.declareClass(OAuth, "SignatureMethod", function () {
});

OAuth.setProperties(OAuth.SignatureMethod.prototype, {
    sign:function (a) {
        var d = this.getSignature(OAuth.SignatureMethod.getBaseString(a));
        OAuth.setParameter(a, "oauth_signature", d);
        return d
    }, initialize:function (a, d) {
        var b;
        b = d.accessorSecret != null && a.length > 9 && a.substring(a.length - 9) == "-Accessor" ? d.accessorSecret : d.consumerSecret;
        this.key = OAuth.percentEncode(b) + "&" + OAuth.percentEncode(d.tokenSecret)
    }});
OAuth.setProperties(OAuth.SignatureMethod, {
    sign:function (a, d) {
        var b = OAuth.getParameterMap(a.parameters).oauth_signature_method;
        if (b == null || b == "") {
            b = "HMAC-SHA1";
            OAuth.setParameter(a, "oauth_signature_method", b)
        }
        OAuth.SignatureMethod.newMethod(b, d).sign(a)
    }, newMethod:function (a, d) {
        var b = OAuth.SignatureMethod.REGISTERED[a];
        if (b != null) {
            var c = new b;
            c.initialize(a, d);
            return c
        }
        b = Error("signature_method_rejected");
        var e = "";
        for (c in OAuth.SignatureMethod.REGISTERED) {
            if (e != "")e += "&";
            e += OAuth.percentEncode(c)
        }
        b.oauth_acceptable_signature_methods =
                e;
        throw b;
    }, REGISTERED:{},
    registerMethodClass:function (a, d) {
        for (var b = 0; b < a.length; ++b)
            OAuth.SignatureMethod.REGISTERED[a[b]] = d
    }, makeSubclass:function (a) {
        var d = OAuth.SignatureMethod, b = function () {
            d.call(this)
        };
        b.prototype = new d;
        b.prototype.getSignature = a;
        return b.prototype.constructor = b
    }, getBaseString:function (a) {
        var d = a.action, b = d.indexOf("?");
        if (b < 0)b = a.parameters; else {
            b = OAuth.decodeForm(d.substring(b + 1));
            for (var c = OAuth.getParameterList(a.parameters), e = 0; e < c.length; ++e)b.push(c[e])
        }
        return OAuth.percentEncode(a.method.toUpperCase()) +
                "&" + OAuth.percentEncode(OAuth.SignatureMethod.normalizeUrl(d)) + "&" + OAuth.percentEncode(OAuth.SignatureMethod.normalizeParameters(b))
    }, normalizeUrl:function (a) {
        var d = OAuth.SignatureMethod.parseUri(a);
        a = d.protocol.toLowerCase();
        var b = d.authority.toLowerCase();
        if (a == "http" && d.port == 80 || a == "https" && d.port == 443) {
            var c = b.lastIndexOf(":");
            if (c >= 0)b = b.substring(0, c)
        }
        (d = d.path) || (d = "/");
        return a + "://" + b + d
    }, parseUri:function (a) {
        var d = {key:["source", "protocol", "authority", "userInfo", "user", "password", "host",
            "port", "relative", "path", "directory", "file", "query", "anchor"], parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/}};
        a = d.parser.strict.exec(a);
        for (var b = {}, c = 14; c--;)b[d.key[c]] = a[c] || "";
        return b
    }, normalizeParameters:function (a) {
        if (a == null)return"";
        var d = OAuth.getParameterList(a);
        a = [];
        for (var b = 0; b < d.length; ++b) {
            var c = d[b];
            c[0] != "oauth_signature" && a.push([OAuth.percentEncode(c[0]) + " " + OAuth.percentEncode(c[1]),
                c])
        }
        a.sort(function (e, f) {
            if (e[0] < f[0])return-1;
            if (e[0] > f[0])return 1;
            return 0
        });
        d = [];
        for (b = 0; b < a.length; ++b)d.push(a[b][1]);
        return OAuth.formEncode(d)
    }});

OAuth.SignatureMethod.registerMethodClass(["PLAINTEXT", "PLAINTEXT-Accessor"], OAuth.SignatureMethod.makeSubclass(function () {
    return this.key
}));

OAuth.SignatureMethod.registerMethodClass(["HMAC-SHA1", "HMAC-SHA1-Accessor"], OAuth.SignatureMethod.makeSubclass(function (a) {
    b64pad = "=";
    return b64_hmac_sha1(this.key, a)
}));

try {
    OAuth.correctTimestamp(gsConfig.timestamp)
} catch (e$$86) {
}
