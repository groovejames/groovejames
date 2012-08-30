(function (c) {
    var a;
    GS.Models.Base.extend("GS.Models.Theme", {}, {themeID:null, version:"1.0", title:"Unknown", author:"Grooveshark", location:"default", premium:false, sponsored:false, sections:null, assetLocation:"", clickIDs:null, tracking:null, pageTracking:null, expandableTracking:null, artistNotifTracking:null, videoLBTracking:null, shareTracking:null, shareHeaderTracking:null, adSync:false, misc:null, videos:null, artistIDs:null, isFirstLoad:true, isFirstLoadPageheader:true, screensaver:false, ready:null, removeReady:null,
        onDisplay:null, onAuthChange:null, seenExpiration:null, tooltipHeader:null, tooltipMsg:null, CSS:"css", TOP:"top", BOTTOM:"bottom", CENTER:"center", LEFT:"left", RIGHT:"right", AUTO:"auto", SCALEX:"scalex", SCALEY:"scaley", backgroundImageSize:null, init:function (b) {
            a = this;
            b && this._super(b);
            this.assetLocation = "/themes/" + b.location + "/assets/"
        }, bindAssets:function (b) {
            var d, f, g, k, m, h, n = 0, q;
            b = c(b);
            var s = b.attr("id");
            b.children().each(function () {
                var w = c(this);
                w.hasClass("flash") || w.click(a.callback(a.handleClick));
                if (w.hasClass("flash")) {
                    d =
                            _.orEqual(w.attr("data-flash-wmode"), "opaque");
                    f = _.orEqual(w.attr("data-flash-width"), "100%");
                    g = _.orEqual(w.attr("data-flash-height"), "100%");
                    k = _.orEqual(w.attr("data-flash-src"), null);
                    flashParams = _.orEqual(w.attr("data-flash-params"), "");
                    flashVisualizer = _.orEqual(w.attr("data-flash-visualizer"), null);
                    if (k && w.attr("id")) {
                        q = flashVisualizer ? "visualizerTheme" : s + "-flash-" + n++;
                        w.append('<div id="' + q + '"></div>');
                        swfobject.embedSWF(a.assetLocation + k + "?ver=" + a.version + "&themeID=" + a.themeID + "&currentTarget=#" +
                                w.attr("id") + flashParams, q, f, g, "9.0.0", null, null, {wmode:d})
                    }
                } else if (w.hasClass("img"))if (h = _.orEqual(w.attr("data-img-src"), null)) {
                    if (w.hasClass("scalable"))try {
                        a.backgroundImageSize = a.getBackgroundImageSize();
                        h = a.backgroundImageSize + h
                    } catch (o) {
                    }
                    m = c(new Image);
                    m.css({visibility:"hidden"}).bind("load", {section:b}, a.onImageLoad).attr("src", gsConfig.assetHost + a.assetLocation + h + "?ver=" + a.version).appendTo(w)
                }
            })
        }, bindAsset:function (b, d) {
            console.warn("asset", b, "section", d);
            var f, g, k, m, h = 0;
            d = c(d);
            var n =
                    d.attr("id"), q = c(b);
            console.warn("element", q);
            q.hasClass("flash") || q.click(a.callback(a.handleClick));
            if (q.hasClass("flash")) {
                f = _.orEqual(q.attr("data-flash-wmode"), "opaque");
                g = _.orEqual(q.attr("data-flash-width"), "100%");
                k = _.orEqual(q.attr("data-flash-height"), "100%");
                m = _.orEqual(q.attr("data-flash-src"), null);
                flashParams = _.orEqual(q.attr("data-flash-params"), "");
                flashVisualizer = _.orEqual(q.attr("data-flash-visualizer"), null);
                if (m && q.attr("id")) {
                    h = flashVisualizer ? "visualizerTheme" : n + "-flash-" + h++;
                    q.append('<div id="' + h + '"></div>');
                    swfobject.embedSWF(a.assetLocation + m + "?ver=" + a.version + "&themeID=" + a.themeID + "&currentTarget=#" + q.attr("id") + flashParams, h, g, k, "9.0.0", null, null, {wmode:f})
                }
            } else if (q.hasClass("img"))if (g = _.orEqual(q.attr("data-img-src"), null)) {
                if (q.hasClass("scalable"))try {
                    a.backgroundImageSize = a.getBackgroundImageSize();
                    g = a.backgroundImageSize + g
                } catch (s) {
                }
                f = c(new Image);
                f.css({visibility:"hidden"}).bind("load", {section:d}, a.onImageLoad).attr("src", gsConfig.assetHost + a.assetLocation +
                        g + "?ver=" + a.version).appendTo(q)
            }
        }, onImageLoad:function (b) {
            var d = c(this);
            b = b.data.section;
            var f = d.is("[display=none]") || b.is("[display=none]");
            d.parent().andSelf().show();
            var g = !b.is(":visible");
            b.show();
            var k = d[0].width, m = d[0].height;
            f && d.parent().andSelf().hide();
            d.css({visibility:"visible"}).attr({"data-img-width":k, "data-img-height":m});
            g && b.hide();
            a.position(b)
        }, position:function (b) {
            var d = GS.page.getActiveController();
            if (!(!d || d.Class.fullName !== "GS.Controllers.Page.HomeController")) {
                b = c(b);
                var f, g, k, m, h, n, q, s, w, o, u, z, D, B, E, F, y, I, C = c(b).height(), H = c(b).width();
                b.children(".img").each(function () {
                    f = c(this);
                    g = f.find("img");
                    k = _.orEqual(parseInt(g.attr("data-img-width")), 0);
                    m = _.orEqual(parseInt(g.attr("data-img-height")), 0);
                    if (k && m) {
                        y = _.orEqual(f.attr("data-img-top"), 0);
                        I = _.orEqual(f.attr("data-img-bottom"), 0);
                        E = _.orEqual(f.attr("data-img-left"), 0);
                        F = _.orEqual(f.attr("data-img-right"), 0);
                        n = H - E - F;
                        h = C - y - I;
                        w = parseInt(_.orEqual(f.attr("data-img-min-width"), 0));
                        q = parseInt(_.orEqual(f.attr("data-img-min-height"),
                                0));
                        s = parseInt(_.orEqual(f.attr("data-img-max-height"), h));
                        maxWidth = parseInt(_.orEqual(f.attr("data-img-max-width"), n));
                        o = f.attr("data-img-proportional") === "false" ? false : true;
                        switch (f.attr("data-img-scale")) {
                            case "scalex":
                                g.width(Math.min(Math.max(w, n), maxWidth));
                                o ? g.height(Math.round(g.width() / k * m)) : g.height(Math.min(Math.max(q, Math.round(h), s)));
                                break;
                            case "scaley":
                                g.height(Math.min(Math.max(q, h), s));
                                o ? g.width(Math.round(g.height() / m * k)) : g.width(Math.min(Math.max(w, Math.round(n), maxWidth)));
                                break;
                            case "fit":
                                u = Math.min(n / k, h / m);
                                g.width(Math.round(u * k));
                                g.height(Math.round(u * m));
                                break;
                            case "none":
                                break;
                            case "auto":
                            default:
                                if (o) {
                                    u = Math.max(n / k, h / m);
                                    g.width(Math.round(u * k));
                                    g.height(Math.round(u * m))
                                } else {
                                    g.width(Math.round(n / k * k));
                                    g.height(Math.round(h / m * m))
                                }
                                break
                        }
                        z = _.orEqual(f.attr("data-pos-x"), a.CENTER);
                        D = _.orEqual(f.attr("data-pos-y"), a.CENTER);
                        switch (z) {
                            case a.LEFT:
                                B = isNaN(E) ? E : E + "px";
                                g.css(a.LEFT, B);
                                break;
                            case a.RIGHT:
                                B = isNaN(F) ? F : F + "px";
                                g.css(a.RIGHT, B);
                                break;
                            case a.CENTER:
                                g.css(a.LEFT,
                                        Math.round((n - g.width()) / 2) + "px");
                                break
                        }
                        switch (D) {
                            case a.TOP:
                                B = isNaN(y) ? y : y + "px";
                                g.css(a.TOP, B);
                                break;
                            case a.BOTTOM:
                                B = isNaN(I) ? I : I + "px";
                                g.css(a.BOTTOM, B);
                                break;
                            case a.CENTER:
                                g.css(a.TOP, Math.round((h - g.height()) / 2) + "px");
                                break
                        }
                    }
                });
                if (a.backgroundImageSize) {
                    b = a.getBackgroundImageSize();
                    if (b != a.backgroundImageSize) {
                        a.backgroundImageSize = b;
                        GS.theme.renderSection("#theme_home")
                    }
                }
            }
        }, getBackgroundImageSize:function () {
            if (a.backgroundImageSize == "l_")return"l_";
            var b = c("#theme_home").width();
            c("#theme_home").height();
            if (b >= 1366)return"l_"; else if (b >= 1024)return"m_"; else if (a.backgroundImageSize != "m_")return"s_";
            return a.backgroundImageSize
        }, handleClick:function (b) {
            var d = c(b.currentTarget), f;
            GS.theme.setLastDFPAction();
            switch (d.attr("data-click-action")) {
                case "playSong":
                    (b = d.attr("data-song-id")) && c.publish("gs.song.play", {songID:b, playOnAdd:true, getFeedback:true});
                    break;
                case "playAlbum":
                    b = d.attr("data-album-id");
                    verified = d.attr("data-album-verified") ? Boolean(parseInt(d.attr("data-album-verified"))) : true;
                    f = d.attr("data-album-shuffle") ==
                            "true";
                    b && c.publish("gs.album.play", {albumID:b, playOnAdd:true, getFeedback:true, shuffle:f, verified:verified});
                    break;
                case "playPlaylist":
                    b = d.attr("data-playlist-id");
                    f = d.attr("data-playlist-shuffle") == "true";
                    var g = d.attr("data-radio-enabled") == "true";
                    b && c.publish("gs.playlist.play", {playlistID:b, playOnAdd:true, getFeedback:true, shuffle:f});
                    g && setTimeout(function () {
                        GS.player.setAutoplay(true)
                    }, 5E3);
                    break;
                case "playStation":
                    b = d.attr("data-station-id");
                    f = d.attr("data-station-name");
                    if (b && f) {
                        GS.Models.Station.extraStations[b] =
                                f;
                        c.publish("gs.station.play", {tagID:b, stationName:f})
                    }
                    break;
                case "playVideo":
                    b = new GS.Models.Video({src:d.attr("data-video-src"), swf:d.attr("data-video-swf"), title:_.orEqual(d.attr("data-video-title"), null), author:_.orEqual(d.attr("data-video-author"), null), tracking:_.orEqual(d.attr("data-video-tracking"), null), originalWidth:_.orEqual(d.attr("data-video-originalWidth"), null), originalHeight:_.orEqual(d.attr("data-video-originalHeight"), null)});
                    b.swf.length && GS.getLightbox().open("video", {video:b});
                    break;
                case "playVideos":
                    if (a.videos && a.videos.length) {
                        b = _.defined(b.index) ? b.index % a.videos.length : 0;
                        f = d.attr("data-video-noads") ? true : false;
                        GS.getLightbox().open("video", {video:a.videos[b], videos:a.videos, index:b, overrideAds:f})
                    }
                    break;
                case "promotion":
                    GS.getLightbox().open("promotion", {theme:a});
                    break;
                case "openLightbox":
                    (b = d.attr("data-lightbox-name")) && GS.getLightbox().open(b);
                    break;
                case "expandable":
                    b = d.attr("data-expandable-id");
                    f = d.attr("data-expandable-height");
                    c(b).animate({height:f});
                    if (c.isArray(a.expandableTracking)) {
                        var k =
                                (new Date).valueOf(), m = c("body"), h;
                        _.forEach(a.expandableTracking, function (n) {
                            n += n.indexOf("?") != -1 ? "&" + k : "?" + k;
                            h = new Image;
                            m.append(c(h).load(function (q) {
                                c(q.target).remove()
                            }).css("visibility", "hidden").attr("src", n))
                        })
                    }
                    break;
                case "collapse":
                    b = d.attr("data-expandable-id");
                    c(b).height(0);
                    break;
                case "windowOpen":
                    (b = d.attr("data-click-url")) && window.open(b, "_newtab");
                    break;
                default:
                    break
            }
            d.attr("data-click-id") && GS.service.logThemeOutboundLinkClick(a.themeID, d.attr("data-click-id"))
        }})
})(jQuery);

