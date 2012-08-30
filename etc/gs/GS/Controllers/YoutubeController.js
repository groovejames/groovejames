GS.Controllers.BaseController.extend("GS.Controllers.YoutubeController", {isGSSingleton:true}, {readyCallbacks:[], API_URL:"http://gdata.youtube.com/feeds/api/videos", DEV_KEY:"AI39si6SJVyxgw9MFbAdbXE-wbtZFdTl8qnY2UWX3dFA97c9PrcfAYDpqUh0iLeVEkurJsjUvDmObBWvLX-wmsy_kW8KHAgN-Q", APPLICATION_ID:"Grooveshark", lastError:null, init:function () {
    window.onYouTubePlayerReady = function (c) {
        var a = GS.getYoutube(), b = a.makeVideoObject($("#" + c)[0], c), d = true;
        if (a.readyCallbacks[c]) {
            d = a.readyCallbacks[c](b);
            delete a.readyCallbacks[c]
        }
        d !==
                false && b.play()
    };
    this._super()
}, attachPlayer:function (c, a, b, d, f) {
    var g = "videoVObj" + d, k = "http://www.youtube.com/v/" + c + "?version=3&enablejsapi=1&version=3&fs=1&playerapiid=" + g, m = {id:g, name:g, allowFullScreen:"true"};
    if (!c || _.notDefined(c))return false;
    a = a || 480;
    b = b || 385;
    if ($.isFunction(f))GS.getYoutube().readyCallbacks[g] = f;
    swfobject.embedSWF(k, d, a, b, "8", null, {}, {allowScriptAccess:"always", allowFullScreen:"true"}, m)
}, makeVideoObject:function (c, a) {
    var b = {callbacks:[], addEvent:function (d, f) {
        if ($.isFunction(f)) {
            var g =
                    "yt" + d + a + Math.floor(Math.random() * 1001);
            window[g] = f;
            f = g;
            this.callbacks.push(g)
        }
        c.addEventListener(d, f)
    }, play:function () {
        c.playVideo()
    }, playVideoAt:function (d) {
        c.playVideoAt(d)
    }, pause:function () {
        c.pauseVideo()
    }, isPaused:function () {
        var d = this.getState();
        return d != 1 && d != 3
    }, getState:function () {
        return c.getPlayerState()
    }, stop:function () {
        c.stopVideo()
    }, getCurrentTime:function () {
        return c.getCurrentTime()
    }, getDuration:function () {
        return c.getDuration()
    }, getVideoUrl:function () {
        return c.getVideoUrl()
    }, getVolume:function () {
        return c.getVolume() /
                100
    }, setVolume:function (d) {
        c.setVolume(d * 100)
    }, loadVideoById:function (d) {
        c.loadVideoById(d);
        GS.getGuts().gaTrackEvent("youtube", "loadVideoById", d)
    }, loadVideoByUrl:function (d) {
        c.loadVideoByUrl(d)
    }};
    $(c).parent().bind("remove", function () {
        try {
            b.callbacks && b.callbacks.length && _.forEach(b.callbacks, function (f) {
                window[f] = null
            })
        } catch (d) {
        }
    });
    return b
}, searchCache:{}, search:function (c, a, b, d, f) {
    c = $.trim(_.orEqual(c, ""));
    a = _.orEqual(a, 10);
    if ((!c || c == "") && f) {
        c = '"' + f.SongName.replace(/[\(\[][a-zA-Z0-9\s]+[\]\)]/g,
                "") + '"';
        c = f.ArtistName.toLowerCase() != "unknown" && f.ArtistName.toLowerCase() != "unknown artist" ? ['"' + f.ArtistName + '"' || "", c || ""].join(" ") : c;
        c = $.trim(c)
    }
    if (!c) {
        $.isFunction(d) && d();
        return false
    }
    if (this.searchCache[c] && $.isFunction(b))b(this.searchCache[c]); else {
        var g = "jQueryYoutube" + OAuth.nonce(10), k = {"max-results":a, orderBy:"relevance", safeSearch:"none", alt:"json-in-script", time:"all_time", "start-index":1, q:c, callback:g, key:this.DEV_KEY, v:2, category:"music", restriction:gsConfig.remoteAddr, format:5};
        a = this.API_URL;
        OAuth.completeRequest({method:"GET", action:a, parameters:k}, {consumerKey:this.APPLICATION_ID, consumerSecret:this.DEV_KEY});
        k = OAuth.getParameterMap(k);
        a = a + "?" + _.httpBuildQuery(k);
        $.ajax({url:a, success:this.callback("searchSuccess", b, d, c, f), error:this.callback("searchFailed", d), dataType:"jsonp", jsonp:false, jsonpCallback:g, cache:true});
        GS.getGuts().gaTrackEvent("youtube", "search", c)
    }
}, searchSuccess:function (c, a, b, d, f) {
    if (f.feed && f.feed.entry) {
        var g = [], k = {};
        _.forEach(f.feed.entry, function (m) {
            if (m.media$group &&
                    m.media$group.media$thumbnail) {
                k = {Author:"", Description:"", Duration:0, Rating:0, LikeRatio:0, VideoID:"", Plays:0, URL:"", Title:"", Thumbnails:[]};
                if (m.author && m.author[0] && m.author[0].name && m.author[0].name.$t)k.Author = m.author[0].name.$t; else if (m.media$group.media$credit && m.media$group.media$credit.$t)k.Author = m.media$group.media$credit.$t;
                if (m.media$group.media$description && m.media$group.media$description.$t)k.Description = m.media$group.media$description.$t;
                if (m.media$group.yt$duration && m.media$group.yt$duration.seconds)k.Duration =
                        parseInt(m.media$group.yt$duration.seconds);
                if (m.gd$rating && m.gd$rating.average)k.Rating = parseFloat(m.gd$rating.average);
                if (m.yt$rating && m.yt$rating.numLikes && m.yt$rating.numDislikes)k.LikeRatio = parseInt(m.yt$rating.numLikes) / parseInt(m.yt$rating.numDislikes);
                if (m.media$group.yt$videoid && m.media$group.yt$videoid.$t)k.VideoID = m.media$group.yt$videoid.$t; else if (m.id) {
                    var h = m.id.split(":");
                    k.VideoID = h[h.length - 1]
                }
                if (m.yt$statistics && m.yt$statistics.viewCount)k.Plays = parseInt(m.yt$statistics.viewCount);
                if (m.title && m.title.$t)k.Title = m.title.$t;
                if (m.link && m.link[0] && m.link.href)k.URL = m.link.href;
                _.forEach(m.media$group.media$thumbnail, function (n) {
                    if (n.yt$name)switch (n.yt$name) {
                        case "default":
                            k.Thumbnails.unshift(n);
                            return;
                        case "hqdefault":
                            k.Thumbnails.length && k.Thumbnails[0].yt$name == "default" ? k.Thumbnails.splice(1, 0, n) : k.Thumbnails.unshift(n);
                            return
                    }
                    k.Thumbnails.push(n)
                });
                k = GS.Models.Video.wrapYoutube(k);
                g.push(k)
            }
        });
        if (d)g = this.filterSearchResults(d, g);
        this.searchCache[b] = g;
        $.isFunction(c) && c(g)
    } else {
        this.lastError =
                f;
        $.isFunction(a) && a(f)
    }
}, filterSearchResults:function (c, a) {
    var b = [], d = "";
    if (c && c.ArtistName)d = c.ArtistName.match(/[a-z0-9]/gi).join("").toLowerCase();
    _.forEach(a, function (f, g) {
        if (f.VideoID && f.Author && f.Duration > 60) {
            f.weight = Math.floor(4.01 * (a.length - g));
            if (f.Author.toLowerCase().lastIndexOf("vevo") > -1)f.weight *= 9.7; else if (f.Author.toLowerCase().lastIndexOf("emimusic") > -1)f.weight *= 8.98;
            if (d)if (f.Author.toLowerCase().indexOf(d) > -1)f.weight *= 2.101;
            if (f.Author.toLowerCase().lastIndexOf("records") >
                    -1)f.weight *= 2.209;
            var k = f.Title.toLowerCase();
            if (k.lastIndexOf("parody") > -1)f.weight *= 0.203; else if (k.lastIndexOf("official") > -1)f.weight *= 2.51;
            for (k = 0; k < b.length; k++)if (b[k].weight < f.weight) {
                b.splice(k, 0, f);
                return
            }
            b.push(f)
        }
    });
    return b
}, searchFailed:function (c, a) {
    this.lastError = a;
    $.isFunction(c) && c(a)
}, loadFloppyMusic:function () {
    var c = [];
    _.forEach([
        {Author:"sh4dowww90", Description:"Another useless device. Imperial march played by two floppy disk drives. Read the note about the next video: silent.org.pl Homepage: silent.org.pl Post in English: silent.org.pl Po polsku: silent.org.pl",
            VideoID:"yHJOz_y9rZE", Title:"Floppy music DUO - Imperial march", type:"youtube", duration:84, thumbnail:"http://i.ytimg.com/vi/yHJOz_y9rZE/default.jpg", width:480, height:385},
        {Author:"ToxicTripod0", Description:"Another attempt at playing midi on floppy drives", VideoID:"dmwLEf_2Tk8", Title:"Floppy Mario Theme", type:"youtube", duration:51, thumbnail:"http://i.ytimg.com/vi/dmwLEf_2Tk8/default.jpg", width:480, height:385},
        {Author:"Sammy1Am", Description:'My second multi-floppy song, as suggested by Neutrino. I\'m using an Arduino UNO hooked up to three drives (one 5.25" and two 3.5").',
            VideoID:"VJhvRQHNM1w", Title:"Floppy Kirby's Theme", type:"youtube", duration:82, thumbnail:"http://i.ytimg.com/vi/VJhvRQHNM1w/default.jpg", width:480, height:385},
        {Author:"CoolNapkins", Description:"Playing around with an old computer and the floppymidi driver for BeOS 1. Tetris 2. Super Mario 3. Zelda 4. Mr. Roboto 5. 1812 Overture", VideoID:"QkkrQ8xHJlM", Title:"The Floppy Music Machine", type:"youtube", duration:252, thumbnail:"http://i.ytimg.com/vi/QkkrQ8xHJlM/default.jpg", width:480, height:385},
        {Author:"Sammy1Am",
            Description:"Theme from Tetris as played on three floppy drives.", VideoID:"73Sie3yrcnE", Title:"Floppy Korobeiniki (Tetris Theme)", type:"youtube", duration:68, thumbnail:"http://i.ytimg.com/vi/73Sie3yrcnE/default.jpg", width:480, height:385}
    ], function (a) {
        c.push(GS.Models.Video.wrapYoutube(a))
    });
    GS.getLightbox().open("video", {videos:c})
}, loadDubstep:function () {
    var c = GS.Models.Video.wrapYoutube({Author:"tobyharris100", Description:"", VideoID:"QbZhbZBK2ZY", Title:"How To Dance To Dubstep! Parrot", type:"youtube",
        duration:163, thumbnail:"http://i.ytimg.com/vi/QbZhbZBK2ZY/default.jpg", width:480, height:385});
    GS.getLightbox().open("video", {video:c})
}, embedYoutubeAd:function (c, a, b, d, f, g, k, m, h, n, q) {
    var s = "ytAdPlayer" + Math.floor(Math.random() * 9);
    a = "http://www.youtube.com/v/" + a + "?version=3&controls=0&enablejsapi=1&showinfo=1&showsearch=0&iv_load_policy=3disablekb=1&playerapiid=" + s;
    var w = {id:s, name:s}, o = GS.player.player.getVolume();
    b = b || 560;
    d = d || 315;
    o = o ? o < 30 ? 0.3 : o / 100 : 1;
    g || (g = 30);
    var u = 0, z, D = false, B = 0;
    this.readyCallbacks[s] =
            function (E) {
                B && clearTimeout(B);
                E.setVolume(o);
                E.addEvent("onStateChange", function (F) {
                    if (F == 1) {
                        if (f && !D) {
                            f();
                            D = true
                        }
                        z && clearInterval(z);
                        setTimeout(function () {
                            z = setInterval(function () {
                                u++;
                                u == g && k && k();
                                h && h(u, g)
                            }, 1E3)
                        }, 0)
                    } else if (F == 2 || F == 3) {
                        if (z) {
                            clearInterval(z);
                            z = null
                        }
                    } else if (F == 0) {
                        m && m();
                        if (z) {
                            clearInterval(z);
                            z = null
                        }
                    }
                });
                n && E.addEvent("onError", n);
                return q
            };
    swfobject.embedSWF(a, c, b, d, "8", null, null, {allowScriptAccess:"always"}, w);
    B = setTimeout(function () {
                n && n();
                delete GS.getYoutube().readyCallbacks[s]
            },
            8E3)
}});

