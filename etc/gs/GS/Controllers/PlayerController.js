(function () {
    function c(h) {
        if (!a())return false;
        h || setTimeout(function () {
            GS.player.pauseSong()
        }, 10);
        GS.getEngagements().showInterruptLightbox(true);
        GS.store.set("GS.videos.lastLoaded", (new Date).getTime());
        return true
    }

    function a() {
        var h = {42:true, 224:true, 61:true, 98:true, 96:true, 182:true, 219:true, 67:true, 85:true, 94:true, 87:true, 162:true, 110:true, 176:true, 49:true, 169:true, 166:true, 14:true, 174:true, 22:true, 59:true, 91:true, 38:true, 48:true, 45:true};
        if (GS.user.subscription.canListenUninterrupted())return k = false;
        if (!d || !k || !h[gsConfig.country.ID])return false;
        if (GS.getLightbox().curType == "interruptListen")return false;
        if (GS.getGuts().currentTest && GS.getGuts().currentTest.name == "delayInterruptListen" && GS.getGuts().currentGroup == 3)return false;
        g = 4;
        if (m)return false;
        return true
    }

    var b, d = true, f = new Date, g = 4, k = true, m = null;
    $.browser.mozilla || $.browser.opera ? $("body").bind("mousemove", function () {
        GS.user.subscription.canListenUninterrupted() || (f = new Date)
    }) : $("body").bind("mousemove", function () {
        f = new Date
    });
    GS.Controllers.BaseController.extend("GS.Controllers.PlayerController",
            {onElement:"#footer"}, {REPEAT_NONE:0, REPEAT_ALL:1, REPEAT_ONE:2, repeatStates:{none:0, all:1, one:2}, INDEX_DEFAULT:-1, INDEX_NEXT:-2, INDEX_LAST:-3, INDEX_REPLACE:-4, PLAY_STATUS_NONE:0, PLAY_STATUS_INITIALIZING:1, PLAY_STATUS_LOADING:2, PLAY_STATUS_PLAYING:3, PLAY_STATUS_PAUSED:4, PLAY_STATUS_BUFFERING:5, PLAY_STATUS_FAILED:6, PLAY_STATUS_COMPLETED:7, PLAY_CONTEXT_UNKNOWN:"unknown", PLAY_CONTEXT_SONG:"song", PLAY_CONTEXT_ALBUM:"album", PLAY_CONTEXT_ARTIST:"artist", PLAY_CONTEXT_PLAYLIST:"playlist", PLAY_CONTEXT_RADIO:"radio",
                PLAY_CONTEXT_SEARCH:"search", PLAY_CONTEXT_POPULAR:"popular", PLAY_CONTEXT_FEED:"feed", PLAY_CONTEXT_SIDEBAR:"sidebar", PLAY_CONTEXT_EXPLORE:"explore", PLAY_CONTEXT_USER:"user", QUEUE_ADD_LIMIT:1E3, crossfadeAmount:5E3, crossfadeEnabled:false, playPauseFade:false, prefetchEnabled:true, lowerQuality:false, embedTimeout:0, playlistName:$.localize.getString("NOW_PLAYING"), currentSongString:new GS.Models.DataString, songCountString:new GS.Models.DataString, numSongs:0, player:null, isPlaying:false, isPaused:false, isLoading:false,
                repeatMode:null, autoplayEnabled:null, activeSong:null, currentSongs:null, nextSongToPlay:null, nullStatus:{activeSong:{}, bytesLoaded:0, bytesTotal:0, duration:0, position:0, status:0}, SCRUB_LOCK:false, QUEUE_SIZES:{s:{width:144, activeWidth:144, className:"small"}, m:{width:86, activeWidth:86, className:"medium"}, l:{width:106, activeWidth:106, className:"large"}}, queueSize:"m", songWidth:86, activeSongWidth:86, queueClosed:false, queueClosedByUser:false, gsQueue:null, allowRestore:true, lastZoomLevel:0, videoModeEnabled:false,
                powerModeEnabled:false, exists:false, init:function () {
                    b = this;
                    var h = location.hash.match(/^#!?\/s\/(.*)\/?/);
                    if (h) {
                        h = h[0].replace(/\?([^#]*)$/, "");
                        this.allowRestore = false;
                        this.songToPlayOnReadyToken = h.split("/")[3]
                    }
                    this.beginDragDrop();
                    this.addQueueSeek();
                    this.addShortcuts();
                    this.addVolumeSlider();
                    this.addQueueResize();
                    this.queueSize = _.orEqual(GS.store.get("queueSize"), $(window).height() > 700 ? "m" : "s");
                    this.songWidth = this.QUEUE_SIZES[this.queueSize].width;
                    this.activeSongWidth = this.QUEUE_SIZES[this.queueSize].activeWidth;
                    this.setQueue("off", false);
                    this.subscribe("gs.auth.update", this.callback(this.userChange));
                    this.subscribe("gs.auth.song.update", this.callback(this.songChange));
                    this.subscribe("gs.auth.library.update", this.callback(this.libraryChange));
                    this.subscribe("gs.auth.favorites.songs.update", this.callback(this.libraryChange));
                    this.subscribe("gs.settings.local.update", this.callback(this.updateWithLocalSettings));
                    this.subscribe("gs.song.play", this.callback(this.eventPlaySong));
                    this.subscribe("gs.album.play",
                            this.callback(this.eventPlayAlbum));
                    this.subscribe("gs.playlist.play", this.callback(this.eventPlayPlaylist));
                    this.subscribe("gs.station.play", this.callback(this.eventPlayStation));
                    this.subscribe("gs.app.resize", this.callback(this.resize));
                    this.subscribe("gs.swf.invalidMethod", this.callback(this.swfDied));
                    this.exists = true;
                    GS.Models.Feature.register("videoMode", {FeatureID:"videoMode", TextKey:"VIDEO_MODE", ActivateCallback:this.callback("enableVideoMode"), Type:"ACTIVATED"});
                    GS.Models.Feature.register("visualizers",
                            {FeatureID:"visualizers", TextKey:"VISUALIZERS", ActivateCallback:this.callback(function () {
                                GS.getLightbox().open("visualizer", {showPlayerControls:true})
                            }), Type:"ACTIVATED"});
                    GS.Models.Feature.register("powerHour", {FeatureID:"powerHour", TextKey:"POWER_HOUR_MODE", ActivateCallback:this.callback("togglePowerMode"), IsActiveCallback:this.callback(function () {
                        return this.powerModeEnabled
                    })});
                    this._super()
                }, appReady:function () {
                    if (swfobject.hasFlashPlayerVersion("9.0.0"))this.embedTimeout = setTimeout(this.callback(this.onEmbedTimeout),
                            1E4); else setTimeout(function () {
                        GS.getLightbox().open({type:"noFlash", notCloseable:true, view:{header:"POPUP_NO_FLASH_TITLE", message:"POPUP_NO_FLASH_MSG", buttonsRight:[
                            {label:"POPUP_REFRESH_GROOVESHARK", className:"submit"}
                        ], buttonsLeft:[
                            {label:"POPUP_INSTALL_FLASH", href:"http://get.adobe.com/flashplayer/", className:"install"}
                        ]}, callbacks:{".submit":function (h) {
                            h.stopImmediatePropagation();
                            window.location.reload(true)
                        }, ".install":function () {
                            $(this).attr("target", "_blank")
                        }}})
                    }, 500)
                }, resize:function () {
                    b.updateQueueWidth()
                },
                setQueue:function (h, n, q) {
                    n = _.orEqual(n, true);
                    var s = h === "s" ? b.smallQueueSongToHtml : b.queueSongToHtml(h), w = b.getCurrentQueue(), o = _.defined(b.queue) && b.queue.songs ? b.queue.songs : [], u = 0, z = (h != b.queueSize || b.queueClosed) && h != "off", D = b.queueClosed;
                    q = 0;
                    $("#queue").height("auto");
                    if (b.QUEUE_SIZES[h]) {
                        b.queueSize = h;
                        if (n) {
                            b.queueClosed = false;
                            b.queueClosedByUser = false
                        }
                        b.songWidth = b.QUEUE_SIZES[h].width;
                        b.activeSongWidth = b.QUEUE_SIZES[h].activeWidth;
                        GS.store.set("queueSize", h)
                    } else if (h == "off") {
                        b.queueClosed =
                                true;
                        b.queueClosedByUser = n
                    }
                    if (w && w.activeSong)u = w.activeSong.index;
                    if (z) {
                        if (_.defined(b.gsQueue.lastLeftmostOnDragStart)) {
                            q = b.gsQueue.lastLeftmostOnDragStart;
                            b.gsQueue.lastLeftmostOnDragStart = null
                        } else q = b.gsQueue.calcIndex($("#queue_list_window").scrollLeft());
                        $("#queue").attr("class", "size-" + b.queueSize);
                        b.gsQueue.updateSettings({activeItemWidth:b.activeSongWidth, itemWidth:b.songWidth, itemRenderer:s})
                    } else if (!b.gsQueue)b.gsQueue = $("#queue").attr("class", "size-" + b.queueSize).gsQueue({activeItemWidth:b.activeSongWidth,
                        itemWidth:b.songWidth, itemRenderer:s, activeIndex:u}, o);
                    if (b.queueClosed) {
                        b.gsQueue.setDisabled(true);
                        $("#queue").height(0);
                        $("#player_queue_sizer").removeClass("small medium large").addClass("closed")
                    } else {
                        b.gsQueue.setDisabled(false);
                        z && setTimeout(function () {
                            if (D)b.gsQueue.moveTo(u, false, false); else q == 0 ? b.gsQueue.moveTo(u, false, false) : b.gsQueue.moveTo(q, false, true);
                            b.gsQueue.render(null, true)
                        }, 121);
                        $("#player_queue_sizer").removeClass("closed small medium large").addClass(this.QUEUE_SIZES[b.queueSize].className)
                    }
                    $(window).resize()
                },
                userChange:function () {
                    this.updateWithLocalSettings();
                    if (GS.user.subscription.canListenUninterrupted())k = false
                }, libraryChange:function () {
                    var h = {};
                    if ((h = b.player ? b.player.getCurrentQueue() : {activeSong:false, songs:[]}) && h.songs.length) {
                        var n = GS.Models.Song.wrapQueue(h.songs);
                        b.gsQueue.setItems(n, true);
                        b.updateQueueDetails()
                    }
                    if (h.activeSong) {
                        h = GS.Models.Song.wrapQueue([h.activeSong])[0];
                        b.updateSongOnPlayer(h, true, true)
                    }
                }, playerExists:function () {
                    return GS.isReady
                }, playerReady:function (h) {
                    var n = new Date,
                            q = n.getTime();
                    if (!b.isReady && h.interruptionExpireTime && d) {
                        n.setTime(h.interruptionExpireTime);
                        if (n.getTime() > q)d = false
                    }
                    if (!b.isReady && d) {
                        n = {42:true, 224:true, 61:true, 98:true, 96:true, 182:true, 219:true, 67:true, 85:true, 94:true};
                        var s = {87:true, 162:true, 49:true, 169:true, 174:true, 22:true}, w = {110:true, 176:true, 166:true, 14:true, 59:true, 91:true}, o = {38:true, 45:true, 48:true};
                        if (GS.user.IsPremium || $.browser.msie && parseInt($.browser.version) < 8 && window.attachEvent)k = false; else if (n[gsConfig.country.ID] && (!GS.player.player.getNumVisitedDays ||
                                GS.player.player.getNumVisitedDays() <= 5) && (!GS.player.player.getNumPlayedSongs || GS.player.player.getNumPlayedSongs() <= 20))k = false; else if (s[gsConfig.country.ID] && (!GS.player.player.getNumVisitedDays || GS.player.player.getNumVisitedDays() <= 3) && (!GS.player.player.getNumPlayedSongs || GS.player.player.getNumPlayedSongs() <= 20))k = false; else if (w[gsConfig.country.ID] && (!GS.player.player.getNumVisitedDays || GS.player.player.getNumVisitedDays() <= 7) && (!GS.player.player.getNumPlayedSongs || GS.player.player.getNumPlayedSongs() <=
                                20))k = false; else if (o[gsConfig.country.ID] && (!GS.player.player.getNumVisitedDays || GS.player.player.getNumVisitedDays() <= 5) && (!GS.player.player.getNumPlayedSongs || GS.player.player.getNumPlayedSongs() <= 20))k = false; else if (gsConfig.country.ID == 223)k = false; else if (!n[gsConfig.country.ID] && !s[gsConfig.country.ID] && !w[gsConfig.country.ID] && !o[gsConfig.country.ID] && gsConfig.country.ID != 223)k = false;
                        if (k)if ((n = GS.store.get("GS.videos.lastLoaded")) && q - n < 3E5)k = false; else GS.getEngagements().preloadEngagement()
                    }
                    b.isReady =
                            true;
                    if (!GS.isReady)return false;
                    return b.playerSetup(h)
                }, playerSetup:function (h) {
                    h || (h = b.player.getEverything());
                    $.publish("gs.player.ready");
                    b.player.setErrorCallback("GS.Controllers.PlayerController.instance().playerError");
                    b.player.setPlaybackStatusCallback("GS.Controllers.PlayerController.instance().playerStatus");
                    b.player.setPropertyChangeCallback("GS.Controllers.PlayerController.instance().propertyChange");
                    b.player.setQueueChangeCallback("GS.Controllers.PlayerController.instance().queueChange");
                    b.player.setSongPropertyChangeCallback("GS.Controllers.PlayerController.instance().songChange");
                    b.player.setChatServers(gsConfig.chatServersWeighted ? gsConfig.chatServersWeighted : {});
                    var n = b.player.setZoomChangeCallback("GS.Controllers.PlayerController.instance().onZoomChange");
                    b.onZoomChange(n);
                    GS.service.verifyControllerKey(h.verifyKey);
                    $("#volumeSlider").slider("value", b.player.getVolume());
                    b.updateWithLocalSettings();
                    clearTimeout(b.embedTimeout);
                    b.embedTimeout = null;
                    GS.getLightbox && GS.getLightbox().isOpen &&
                            GS.getLightbox().curType == "swfTimeout" && GS.getLightbox().close();
                    this.songToPlayOnReadyToken && GS.Models.Song.getSongFromToken(this.songToPlayOnReadyToken, function (q) {
                        q && q.validate() && b.addSongAndPlay(q.SongID)
                    }, null);
                    return true
                }, onEmbedTimeout:function () {
                    b.player || GS.getLightbox().open("swfTimeout", {notCloseable:true})
                }, swfDied:function () {
                    var h = _.getString("POPUP_SWF_CRASH_MESSAGE"), n = _.getString("POPUP_HTML5_MESSAGE", {url:"http://html5.grooveshark.com"});
                    GS.getLightbox().open({type:"swfCrash", view:{header:"POPUP_SWF_CRASH_TITLE",
                        messageHTML:"<p>" + h + "</p><p>" + n + "</p>", buttonsLeft:[
                            {label:"POPUP_SWF_CRASH_RELOAD", className:"reload"}
                        ]}, callbacks:{".reload":function () {
                        window.location.reload(true)
                    }}})
                }, queueIsRestorable:function () {
                    this.getCurrentQueue(true);
                    if (GS.user && GS.user.settings.local.restoreQueue && this.allowRestore)this.restoreQueue(); else {
                        $("#queue_clear_button").addClass("undo").attr("title", $.localize.getString("QUEUE_RESTORE_QUEUE")).attr("data-translate-title", "QUEUE_RESTORE_QUEUE").show();
                        $.publish("gs.notification.restorequeue")
                    }
                },
                onZoomChange:function (h) {
                    var n = window.GS && GS.airbridge ? GS.airbridge : GS.Controllers.AirbridgeController.instance();
                    if (h && !n.isDesktop) {
                        console.warn("ZOOM CHANGED, NOT ZERO", h);
                        alert($.localize.getString("ZOOM_ALERT"));
                        window._gaq && window._gaq.push && window._gaq.push(["_trackPageview", "#!/lb/zoom"])
                    } else h !== this.lastZoomLevel && $(window).resize();
                    this.lastZoomLevel = h
                }, expireSWFService:function () {
                    b.player && b.player.expireService()
                }, storeQueue:function () {
                    b.player && b.player.storeQueue()
                }, playerError:function (h) {
                    console.log("player.playererror",
                            h);
                    switch (h.type) {
                        case "errorAddingSongs":
                            console.log("player. failed to add songs: ", h.details.songs, h.details.reason);
                            h.details.reason == "tooManySongs" ? $.publish("gs.notification", {type:"notice", message:$.localize.getString("ERROR_TOO_MANY_SONGS")}) : $.publish("gs.notification", {type:"error", message:$.localize.getString("ERROR_ADDING_SONG") + ": " + h.details.reason});
                            break;
                        case "playbackError":
                            console.log("player. error playing song", h.details.song, h.details.reason, h.details.errorDetail);
                            h.details.reason ===
                                    "unknownHasNext" ? $.publish("gs.notification", {type:"error", message:$.localize.getString("ERROR_HASNEXT_MESSAGE")}) : $.publish("gs.notification", {type:"error", message:$.localize.getString("ERROR_PLAYING_SONG")});
                            break;
                        case "autoplayFailed":
                            console.log("player. error fetching autoplay song", h.details.reason);
                            if (h.details.reason === "unknownHasNext")$.publish("gs.notification", {type:"error", message:$.localize.getString("ERROR_HASNEXT_MESSAGE")}); else h.details.reason === "noRecommendations" ? this.showRadioStations() :
                                    $.publish("gs.notification", {type:"error", message:$.localize.getString("ERROR_FETCHING_RADIO")});
                            break;
                        case "autoplayVoteError":
                            console.log("player. error voting song", h.details.song);
                            $.publish("gs.notification", {type:"error", message:$.localize.getString("ERROR_VOTING_SONG")});
                            break;
                        case "serviceError":
                            console.log("player. service error", h.details);
                            $.publish("gs.notification", {type:"error", message:$.localize.getString("ERROR_FETCHING_INFO")});
                            break
                    }
                    h.details.errorDetail ? GS.getGuts().gaTrackEvent("playerError",
                            h.type, h.details.reason + ", " + h.details.errorDetail) : GS.getGuts().gaTrackEvent("playerError", h.type, h.details.reason)
                }, $seekBar:$("#player_seeking_back"), $seekBuffer:$("#player_seeking_buffer"), $seekProgress:$("#player_seeking_progress"), $seekScrubber:$("#player_seeking_scrubber"), lastStatus:false, lastPlayedQueueSongID:false, powerHourTimeout:6E4, powerHourSetTimeout:null, playerStatus:function (h) {
                    h = h || this.nullStatus;
                    if (!this.currentSong || !h.activeSong || this.currentSong && h.activeSong && this.currentSong.queueSongID !==
                            h.activeSong.queueSongID) {
                        if (h.status == b.PLAY_STATUS_PLAYING)return;
                        h.activeSong = GS.Models.Song.wrapQueue([h.activeSong ? h.activeSong : {}])[0];
                        this.updateSongOnPlayer(h.activeSong, true)
                    } else h.activeSong = this.currentSong;
                    var n = Math.min(1, h.bytesLoaded / h.bytesTotal), q = Math.min(1, h.position / h.duration), s = this.$seekBar.width();
                    n = Math.min(s, n * 100);
                    var w = Math.min(s, q * 100);
                    q = Math.min(s, Math.max(0, s * q));
                    n = isNaN(n) ? 0 : n;
                    w = isNaN(w) ? 0 : w;
                    q = isNaN(q) ? 0 : q;
                    this.$seekBuffer.width(n + "%");
                    this.$seekProgress.width(w + "%");
                    this.SCRUB_LOCK || this.$seekScrubber.css("left", q);
                    if (h.duration > 0) {
                        h.position == 0 ? $("#player_elapsed").text("00:00") : $("#player_elapsed").text(_.millisToMinutesSeconds(h.position, true));
                        h.duration == 0 ? $("#player_duration").text("00:00") : $("#player_duration").text(_.millisToMinutesSeconds(h.duration, true))
                    } else {
                        $("#player_elapsed").text("00:00");
                        $("#player_duration").text("00:00")
                    }
                    h.currentStreamServer && h.currentStreamServer !== this.lastStatus.currentStreamServer && $.publish("gs.player.streamserver", {streamServer:h.currentStreamServer});
                    if (this.powerModeEnabled && h.position > this.powerHourTimeout)if (!this.powerHourSetTimeout) {
                        this.nextSong();
                        this.powerHourSetTimeout = setTimeout(this.callback(function () {
                            this.powerHourSetTimeout = null
                        }), 1500)
                    }
                    q = this.autoplayEnabled ? "forceLogEvent" : "logEvent";
                    s = h.activeSong ? h.activeSong.SongID : false;
                    n = h.activeSong ? h.activeSong.AlbumID : false;
                    w = h.activeSong ? h.activeSong.ArtistID : false;
                    switch (h.status) {
                        case b.PLAY_STATUS_NONE:
                            this.lastStatus !== h.status && GS.getGuts()[q]("playStatusUpdate", {playStatus:"NONE",
                                activeSong:s, albumID:n, artistID:w, streamServer:h.currentStreamServer});
                            b.isPlaying = false;
                            b.isPaused = false;
                            b.isLoading = false;
                            b.seek.slider("disable");
                            $("#player_play_pause").addClass("play").removeClass("pause").removeClass("buffering");
                            $("#queue_list li.queue-item.queue-item-active a.play").addClass("paused");
                            $.publish("gs.player.stopped", h.activeSong);
                            break;
                        case b.PLAY_STATUS_INITIALIZING:
                            b.isPlaying = true;
                            b.isPaused = false;
                            b.isLoading = true;
                            if (this.lastStatus !== h.status) {
                                GS.getGuts()[q]("playStatusUpdate",
                                        {playStatus:"INITIALIZING", activeSong:s, albumID:n, artistID:w, streamServer:h.currentStreamServer});
                                this.lastStatus == b.PLAY_STATUS_COMPLETED && GS.getGuts().gaTrackEvent("player", "continueInterrupted", h.currentSongID)
                            }
                            if (GS.airbridge && GS.airbridge.isDesktop && !GS.user.subscription.canUseDesktop() || gsConfig.isPreview && !GS.user.subscription.isPremium() && GS.user.UserID % 5 != 0) {
                                this.stopSong();
                                GS.getLightbox().open("login", {premiumRequired:true, notCloseable:gsConfig.isPreview || GS.airbridge && GS.airbridge.isDesktop})
                            }
                            break;
                        case b.PLAY_STATUS_LOADING:
                            if (this.lastStatus !== h.status) {
                                GS.getGuts()[q]("playStatusUpdate", {playStatus:"LOADING", activeSong:s, albumID:n, artistID:w, streamServer:h.currentStreamServer});
                                b.isPlaying = true;
                                b.isPaused = false;
                                b.isLoading = true;
                                b.updateSongOnPlayer(h.activeSong);
                                $("#player_play_pause").is(".buffering") || $("#player_play_pause").removeClass("play").removeClass("pause").addClass("buffering");
                                GS.getGuts().gaTrackEvent("player", "loading", h.currentStreamServer);
                                b.lastLoadingQueueSongID = h.activeSong ?
                                        h.activeSong.queueSongID : false;
                                b.lastLoadingTime = (new Date).getTime()
                            }
                            $("#queue_list li.queue-item.queue-item-active a.play").removeClass("paused");
                            break;
                        case b.PLAY_STATUS_PLAYING:
                            if (this.lastStatus !== h.status || this.lastPlayedQueueSongID !== h.activeSong.queueSongID) {
                                GS.getGuts()[q]("playStatusUpdate", {playStatus:"PLAYING", activeSong:s, albumID:n, artistID:w, streamServer:h.currentStreamServer});
                                b.isPlaying = true;
                                b.isPaused = false;
                                b.isLoading = false;
                                b.seek.slider("enable");
                                $("#player_play_pause").is(".pause") ||
                                $("#player_play_pause").removeClass("play").addClass("pause").removeClass("buffering");
                                $.publish("gs.player.playing", h);
                                if (h.activeSong && (this.lastPlayedQueueSongID !== h.activeSong.queueSongID || this.repeatMode == b.REPEAT_ONE && this.lastStatus == b.PLAY_STATUS_LOADING)) {
                                    c();
                                    this.lastStatus == b.PLAY_STATUS_COMPLETED && GS.getGuts().gaTrackEvent("player", "continueNextSong", s);
                                    GS.getGuts().gaTrackEvent("player", "play", s);
                                    this.trackAutoplayEvent("play");
                                    this.updateSongOnPlayer(h.activeSong, true);
                                    if (h.duration)h.activeSong.playerDuration =
                                            h.duration;
                                    $.publish("gs.player.nowplaying", h.activeSong);
                                    $("#queue_list .queueSong a.play[rel=" + this.lastPlayedQueueSongID + "]").addClass("paused");
                                    this.lastPlayedQueueSongID = h.activeSong ? h.activeSong.queueSongID : false
                                }
                                this.lastStatus == b.PLAY_STATUS_LOADING ? GS.getGuts().gaTrackEvent("player", "loadingTime", h.currentStreamServer, (new Date).getTime() - this.lastLoadingTime) : GS.getGuts().gaTrackEvent("player", "loadingTime", h.currentStreamServer, 0)
                            }
                            if (this.pauseNextQueueSongID && h.activeSong && this.pauseNextQueueSongID ===
                                    h.activeSong.queueSongID) {
                                this.pauseNextQueueSongID = false;
                                setTimeout(this.callback(function () {
                                    this.pauseSong()
                                }), 10)
                            }
                            $("#queue_list li.queue-item.queue-item-active a.play").removeClass("paused");
                            $.publish("gs.player.playing.continue", h);
                            if (h.position % 10 < 1)if (!GS.user.subscription.canListenUninterrupted() && d)if (new Date - f > 36E5) {
                                g = 4;
                                GS.getLightbox().open("interactionTime")
                            }
                            break;
                        case b.PLAY_STATUS_PAUSED:
                            if (this.lastStatus !== h.status) {
                                GS.getGuts()[q]("playStatusUpdate", {playStatus:"PAUSED", activeSong:s,
                                    albumID:n, artistID:w, streamServer:h.currentStreamServer});
                                b.isPlaying = false;
                                b.isPaused = true;
                                b.isLoading = false;
                                $("#player_play_pause").is(".play") || $("#player_play_pause").addClass("play").removeClass("pause").removeClass("buffering");
                                $.publish("gs.player.paused", h.activeSong)
                            }
                            $("#queue_list li.queue-item.queue-item-active a.play").addClass("paused");
                            break;
                        case b.PLAY_STATUS_BUFFERING:
                            this.lastStatus !== h.status && GS.getGuts()[q]("playStatusUpdate", {playStatus:"BUFFERING", activeSong:s, albumID:n, artistID:w,
                                streamServer:h.currentStreamServer});
                            b.isPlaying = true;
                            b.isPaused = false;
                            b.isLoading = true;
                            $("#player_play_pause").is(".buffering") || $("#player_play_pause").removeClass("play").removeClass("pause").addClass("buffering");
                            $("#queue_list li.queue-item.queue-item-active a.play").removeClass("paused");
                            break;
                        case b.PLAY_STATUS_FAILED:
                            this.lastStatus !== h.status && GS.getGuts()[q]("playStatusUpdate", {playStatus:"FAILED", activeSong:s, albumID:n, artistID:w, streamServer:h.currentStreamServer});
                            b.isPlaying = false;
                            b.isPaused =
                                    false;
                            b.isLoading = false;
                            b.seek.slider("disable");
                            $("#player_play_pause").addClass("play").removeClass("pause").removeClass("buffering");
                            $("#queue_list li.queue-item.queue-item-active a.play").addClass("paused");
                            break;
                        case b.PLAY_STATUS_COMPLETED:
                            this.lastStatus !== h.status && GS.getGuts()[q]("playStatusUpdate", {playStatus:"COMPLETED", activeSong:s, albumID:n, artistID:w, streamServer:h.currentStreamServer});
                            b.isPlaying = false;
                            b.isPaused = false;
                            b.isLoading = false;
                            b.seek.slider("disable");
                            $("#player_play_pause").addClass("play").removeClass("pause").removeClass("buffering");
                            $("#queue_list li.queue-item.queue-item-active a.play").addClass("paused");
                            b.$seekBuffer.width("0%");
                            b.$seekProgress.width("0%");
                            b.$seekScrubber.css("left", 0);
                            $.publish("gs.player.stopped", h.activeSong);
                            $.publish("gs.player.completed", h.activeSong);
                            break
                    }
                    this.lastStatus !== h.status && $.publish("gs.player.playstatus.changed", h);
                    this.lastStatus = h.status;
                    $.publish("gs.player.playstatus", h)
                }, pauseNextQueueSongID:false, pauseNextSong:function () {
                    var h = this.getCurrentQueue(true);
                    this.pauseNextQueueSongID = h &&
                            h.nextSong && h.nextSong.queueSongID ? h.nextSong.queueSongID : false
                }, propertyChange:function (h) {
                    if (h.isMuted) {
                        $("#player_volume").addClass("muted");
                        $("#volumeSlider").slider("value", 0)
                    } else {
                        $("#player_volume").removeClass("muted");
                        $("#volumeSlider").slider("value", h.volume)
                    }
                    if (h.crossfadeEnabled) {
                        $("#player_crossfade").addClass("active");
                        this.crossfadeEnabled = true
                    } else {
                        $("#player_crossfade").removeClass("active");
                        this.crossfadeEnabled = false
                    }
                }, queueChange:function (h) {
                    var n = h.fullQueue;
                    if (b.player)n.hasRestoreQueue =
                            b.player.getQueueIsRestorable();
                    b.queue = false;
                    switch (h.type) {
                        case "queueReset":
                            n.activeSong = n.activeSong ? GS.Models.Song.wrapQueue([n.activeSong])[0] : null;
                            n.activeSong && this.updateSongOnPlayer(n.activeSong, true, b.currentSong && b.currentSong.queueSongID == n.activeSong.queueSongID);
                            n.songs = GS.Models.Song.wrapQueue(n.songs);
                            b.queue = n;
                            b.updateQueueDetails(n);
                            b.updateQueueSongs(n);
                            if (h.details.hasOwnProperty("autoplayEnabled"))if (h.details.autoplayEnabled == true) {
                                GS.player.getCurrentQueue();
                                GS.getGuts().forceLogEvent("autoplayOn",
                                        {tagID:h.details.currentAutoplayTagID});
                                GS.getGuts().beginContext({autoplay:h.details.currentAutoplayTagID})
                            } else GS.getGuts().endContext("autoplay");
                            break;
                        case "propertyChange":
                            if (h.details.hasOwnProperty("autoplayEnabled"))if (h.details.autoplayEnabled == true) {
                                n = b.getCurrentQueue().songs;
                                var q = {tagID:h.fullQueue.currentAutoplayTagID};
                                if (n) {
                                    for (var s = "", w = 0; w < n.length; w++)s = w == 0 ? n[w].SongID : s + "," + n[w].SongID;
                                    q.seedSongs = s
                                }
                                GS.getGuts().forceLogEvent("autoplayOn", q);
                                GS.getGuts().beginContext({autoplay:h.fullQueue.currentAutoplayTagID,
                                    autoplaySeedSongs:s})
                            } else GS.getGuts().handleAutoplayOff();
                            b.updateQueueDetails();
                            break;
                        case "contentChange":
                            b.gsQueue.setActive(b.getCurrentQueue().activeSong.index, false);
                            b.gsQueue.setItems(b.getCurrentQueue().songs);
                            b.updateQueueWidth();
                            b.updateQueueDetails();
                            break
                    }
                    $.publish("gs.player.queue.change")
                }, songChange:function (h) {
                    var n = ["parentQueueID", "queueSongID", "autoplayVote", "source", "sponsoredAutoplayID"], q = b.player ? b.player.getCurrentQueue() : {activeSong:false}, s, w, o, u, z = true;
                    h instanceof GS.Models.Song ||
                    (h = GS.Models.Song.wrapQueue([h])[0]);
                    o = q.songs;
                    for (s = 0; u = o[s]; s++)if (u.SongID == h.SongID)for (w in h)if (h.hasOwnProperty(w) && u[w] != h[w] && (u.queueSongID === h.queueSongID || n.indexOf(w) == -1)) {
                        u[w] = h[w];
                        z = false
                    }
                    if (!z) {
                        n = GS.Models.Song.wrapQueue(o);
                        b.gsQueue.setItems(n, true)
                    }
                    b.updateQueueDetails();
                    q.activeSong && h.queueSongID === q.activeSong.queueSongID && b.updateSongOnPlayer(h, true, true);
                    $.publish("gs.player.song.change", h)
                }, updateWithLocalSettings:function (h) {
                    if (this.player) {
                        h = h || GS.user.settings.local;
                        h.crossfadeEnabled !=
                                this.getCrossfadeEnabled() && this.setCrossfadeEnabled(h.crossfadeEnabled);
                        h.crossfadeAmount != this.getCrossfadeAmount() && this.setCrossfadeAmount(h.crossfadeAmount);
                        h.lowerQuality != this.getLowerQuality() && this.setLowerQuality(h.lowerQuality);
                        !h.noPrefetch != this.getPrefetchEnabled() && this.setPrefetchEnabled(!h.noPrefetch);
                        h.playPauseFade != this.getPlayPauseFade() && this.setPlayPauseFade(h.playPauseFade);
                        this.setPersistShuffle(h.persistShuffle);
                        h.persistShuffle && h.lastShuffle != this.getShuffle() && this.setShuffle(h.lastShuffle)
                    }
                },
                getEverything:function () {
                    if (b.player)return b.player.getEverything();
                    return{}
                }, getPlaybackStatus:function () {
                    if (b.player)return b.player.getPlaybackStatus();
                    return{}
                }, getSongDetails:function (h, n) {
                    var q;
                    h = _.orEqual(h, 0);
                    if (typeof n === "number" || typeof n === "string")n = [n];
                    if (b.player) {
                        q = b.player.getSongDetails(h, n);
                        return GS.Models.Song.wrapQueue(q)
                    }
                    return GS.Models.Song.wrap({})
                }, getCurrentSong:function () {
                    if (b.player)return b.getCurrentQueue().activeSong
                }, setActiveSong:function (h) {
                    if (h && b.player)return b.player.setActiveSong(h);
                    return false
                }, addSongsToQueueAt:function (h, n, q, s, w) {
                    n = _.orEqual(n, this.INDEX_DEFAULT);
                    q = _.orEqual(q, false);
                    s = _.orEqual(s, {type:this.PLAY_CONTEXT_UNKNOWN});
                    w = _.orEqual(w, false);
                    $.isArray(h) || (h = isNaN(h) ? h.split(",") : [h]);
                    var o, u = [];
                    for (o = 0; o < h.length; o++)h[o] > 0 && GS.Models.Song.getSong(h[o], this.callback(function (B) {
                        B = B.dupe();
                        B.songs = {};
                        B.albums = {};
                        B.fanbase = {};
                        u[o] = B
                    }), null, {async:false});
                    if (GS.getGuts().currentTest && GS.getGuts().currentTest.name == "delayInterruptListen" && !_.isNumber(m)) {
                        var z;
                        if (GS.getGuts().currentGroup ==
                                1)z = 3E5; else if (GS.getGuts().currentGroup == 0 || GS.getGuts().currentGroup == 2)z = 6E4;
                        var D = GS.player.getCurrentQueue();
                        if (GS.getGuts().currentGroup == 2 && h.length > 1 && (!D || D.songs.length === 0))c(true); else m = GS.getGuts().currentGroup != 3 ? setTimeout(function () {
                            m = null
                        }, z) : h.length < 2 ? true : null
                    }
                    if (b.player) {
                        if (n == -4) {
                            n = -1;
                            this.clearQueue()
                        }
                        b.player.addSongsToQueueAt(u, n, q, s, w);
                        this.autoplayEnabled ? GS.getGuts().forceLogEvent("songsQueued", {songIDs:h}) : GS.getGuts().logEvent("songsQueued", {songIDs:h})
                    }
                }, playSong:function (h) {
                    GS.isPlaying =
                            true;
                    b.player && b.player.playSong(h)
                }, eventPlaySong:function (h) {
                    if (h && h.songID) {
                        GS.getNotice().feedbackOnNextSong = _.orEqual(h.getFeedback, false);
                        b.addSongAndPlay(h.songID)
                    }
                }, eventPlayAlbum:function (h) {
                    if (h && h.albumID) {
                        GS.getNotice().feedbackOnNextSong = _.orEqual(h.getFeedback, false);
                        GS.Models.Album.getAlbum(h.albumID, this.callback("playAlbum", h), null, false)
                    }
                }, playAlbum:function (h, n) {
                    console.log("player.playAlbum", h, n);
                    var q = _.orEqual(h.index, -1), s = _.orEqual(h.playOnAdd, false), w = _.orEqual(h.shuffle,
                            false), o = _.orEqual(h.verified, true);
                    n.play(q, s, w, o)
                }, eventPlayPlaylist:function (h) {
                    if (h && h.playlistID) {
                        GS.getNotice().feedbackOnNextSong = _.orEqual(h.getFeedback, false);
                        GS.Models.Playlist.getPlaylist(h.playlistID, this.callback("playPlaylist", h), null, false)
                    }
                }, playPlaylist:function (h, n) {
                    console.log("player.playPlaylist", h, n);
                    var q = _.orEqual(h.index, -1), s = _.orEqual(h.playOnAdd, false), w = _.orEqual(h.shuffle, false);
                    n.play(q, s, w)
                }, eventPlayStation:function (h) {
                    if (h && h.tagID) {
                        console.log("play station", h.tagID);
                        b.setAutoplay(true, h.tagID)
                    }
                }, addSongAndPlay:function (h, n) {
                    b.player && b.addSongsToQueueAt([h], b.INDEX_DEFAULT, true, n)
                }, pauseSong:function () {
                    b.isPlaying = false;
                    b.isPaused = true;
                    b.player && b.player.pauseSong();
                    GS.getGuts().gaTrackEvent("player", "pauseSong")
                }, resumeSong:function (h) {
                    if (!h && (GS.getLightbox().curType == "interruptListen" || GS.getLightbox().curType == "generic" && GS.getLightbox().container && (GS.getLightbox().container.hasClass("watchAd") || GS.getLightbox().container.hasClass("interactionTime"))))return false;
                    b.isPlaying = true;
                    b.isPaused = false;
                    b.player && b.player.resumeSong();
                    GS.getGuts().gaTrackEvent("player", "resumeSong")
                }, stopSong:function () {
                    b.isPlaying = false;
                    b.isPaused = false;
                    b.player && b.player.stopSong();
                    GS.getGuts().gaTrackEvent("player", "stopSong")
                }, previousSong:function (h) {
                    h = h ? true : false;
                    if (b.player && !this.videoModeEnabled)b.player.previousSong(h); else {
                        h = b.getCurrentQueue();
                        var n = h.activeSong.index;
                        if (!h.songs[n - 1])return;
                        h = h.songs[n - 1];
                        b.setActiveSong(h.queueSongID);
                        $.publish("gs.video.player.loadSong",
                                h)
                    }
                    GS.getGuts().logEvent("prevSong", {});
                    GS.getGuts().gaTrackEvent("player", "prevSong");
                    b.trackAutoplayEvent("prev")
                }, nextSong:function () {
                    if (b.player && !this.videoModeEnabled)b.player.nextSong(); else {
                        var h = b.getCurrentQueue(), n = h.activeSong.index;
                        if (!h.songs[n + 1])return;
                        h = h.songs[n + 1];
                        b.setActiveSong(h.queueSongID);
                        $.publish("gs.video.player.loadSong", h)
                    }
                    GS.getGuts().logEvent("nextSong", {});
                    GS.getGuts().gaTrackEvent("player", "nextSong");
                    b.trackAutoplayEvent("next")
                }, seekTo:function (h) {
                    b.player && b.player.seekTo(h);
                    GS.getGuts().gaTrackEvent("player", "seekTo")
                }, clearQueue:function () {
                    if (b.player) {
                        b.queue && b.queue.autoplayEnabled && GS.getGuts().handleAutoplayOff();
                        b.queue = null;
                        b.currentSong = null;
                        b.player.stopSong();
                        b.player.clearQueue();
                        b.playerStatus(b.player.getPlaybackStatus());
                        b.updateQueueWidth();
                        b.gsQueue.setActive(0, false);
                        b.gsQueue.setItems([], true);
                        b.updateQueueDetails();
                        $("#playerDetails_nowPlaying").html("");
                        $.publish("gs.player.currentSong", null);
                        GS.getGuts().logEvent("queueCleared", {})
                    }
                    GS.getGuts().gaTrackEvent("player",
                            "clearQueue");
                    $.publish("gs.player.queue.change")
                }, restoreQueue:function () {
                    b.player && b.player.restoreQueue();
                    GS.getGuts().gaTrackEvent("player", "restoreQueue")
                }, saveQueue:function () {
                    for (var h = b.getCurrentQueue().songs, n = [], q = 0; q < h.length; q++)n.push(h[q].SongID);
                    GS.getLightbox().open("newPlaylist", n);
                    GS.getGuts().logQueueSaveInitiated();
                    GS.getGuts().gaTrackEvent("player", "saveQueue")
                }, getCurrentQueue:function (h) {
                    h = _.orEqual(h, false);
                    if (!h && b.queue)return b.queue;
                    if (b.player) {
                        h = b.player.getCurrentQueue();
                        if (h.activeSong) {
                            h.activeSong = GS.Models.Song.wrapQueue([h.activeSong])[0];
                            this.updateSongOnPlayer(h.activeSong, true, true)
                        }
                        if (h.songs && h.songs.length)h.songs = GS.Models.Song.wrapQueue(h.songs);
                        h.hasRestoreQueue = b.player.getQueueIsRestorable();
                        return b.queue = h
                    }
                }, getPreviousQueue:function () {
                    b.player && b.player.getPreviousQueue();
                    GS.getGuts().gaTrackEvent("player", "previousQueue")
                }, moveSongsTo:function (h, n) {
                    if (typeof h === "number" || typeof h === "string")h = [h];
                    b.player && b.player.moveSongsTo(h, n)
                }, removeSongs:function (h) {
                    if (typeof h ===
                            "number" || typeof h === "string")h = [h];
                    var n = [];
                    if (b.player) {
                        var q = b.getSongDetails(b.queue.queueID, h);
                        if ($.isArray(q))for (var s = 0; s < q.length; s++)q[s].SongID && n.push(q[s].SongID); else q.hasOwnProperty("SongID") && n.push(q.SongID);
                        b.player.removeSongs(h);
                        b.updateQueueWidth()
                    }
                    b.queue = false;
                    b.queue = b.getCurrentQueue();
                    $.publish("gs.player.queue.change");
                    GS.getGuts().gaTrackEvent("player", "removeSongs");
                    b.trackAutoplayEvent("removeSongs");
                    if (n.length)b.autoplayEnabled ? GS.getGuts().forceLogEvent("songsRemovedFromQueue",
                            {songIDs:n}) : GS.getGuts().logEvent("songsRemovedFromQueue", {songIDs:n})
                }, lastAutoplayInfo:false, setAutoplay:function (h, n, q, s) {
                    var w = b.getCurrentQueue();
                    h = h ? true : false;
                    n = parseInt(n, 10);
                    if (isNaN(n))n = 0; else {
                        var o = GS.store.get("eligibleForTagRadio");
                        if (o === undefined || o === null) {
                            o = Math.round(Math.random());
                            GS.store.set("eligibleForTagRadio", o)
                        }
                        if ({55:55, 9:9, 75:75, 230:230, 2563:2563, 123:123, 29:29, 102:102, 69:69, 1138:1138, 17:17, 160:160}[n] && o) {
                            s = "tagRadioGetSong";
                            GS.getGuts().gaSetCustomVariable(3, "GUTSLoggingStatus",
                                    "15115_tagRadioGetSong", 2)
                        } else GS.getGuts().gaSetCustomVariable(3, "GUTSLoggingStatus", "15115_normalRadioGetSong", 2)
                    }
                    if (w.songs.length == 0 && !n && !q)this.showRadioStations(w.songs.length == 0); else if ((n > 0 || q) && w && w.songs.length > 0) {
                        GS.getLightbox().close();
                        GS.getLightbox().open({type:"radioClearQueue", view:{header:"POPUP_START_RADIO_TITLE", message:"POPUP_START_RADIO_MESSAGE", buttonsLeft:[
                            {label:"CANCEL", className:"close"}
                        ], buttonsRight:[
                            {label:"POPUP_START_RADIO_TITLE", className:"submit"}
                        ]}, callbacks:{".submit":function () {
                            GS.player.clearQueue();
                            GS.player.setAutoplay(true, n, q, s)
                        }}})
                    } else {
                        if (b.player) {
                            if (h) {
                                $("#player_radio_button").addClass("active").children("span").text($.localize.getString("RADIO_ON")).attr("data-translate-text", "RADIO_ON");
                                GS.getGuts().beginContext({autoplay:n, method:s})
                            } else {
                                $("#player_radio_button").removeClass("active").children("span").text($.localize.getString("RADIO_OFF")).attr("data-translate-text", "RADIO_OFF");
                                GS.getGuts().endContext("autoplay")
                            }
                            b.player.setAutoplay(h, n, q, s);
                            $.publish("gs.player.autoplay.update",
                                    h)
                        }
                        GS.getGuts().gaTrackEvent("player", h ? "enableRadio" : "disableRadio", n)
                    }
                }, trackLastAutoplayInfo:function (h, n) {
                    if (b.lastAutoplayInfo && (!h || b.lastAutoplayInfo.tagID != n)) {
                        var q = (new Date).getTime() - b.lastAutoplayInfo.time;
                        GS.getGuts().gaTrackEvent("player", "autoplayDuration", b.lastAutoplayInfo.tagID, q)
                    }
                    if (h) {
                        if (!b.lastAutoplayInfo || b.lastAutoplayInfo && b.lastAutoplayInfo.tagID !== n)b.lastAutoplayInfo = {tagID:n, time:(new Date).getTime()}
                    } else b.lastAutoplayInfo = false
                }, trackAutoplayEvent:function (h) {
                    h = "" +
                            h;
                    b.lastAutoplayInfo && h && GS.getGuts().gaTrackEvent("player", "autoplay" + _.ucwords(h), b.lastAutoplayInfo.tagID)
                }, voteSong:function (h, n) {
                    var q;
                    if (b.player) {
                        b.player.voteSong(h, n);
                        q = this.getSongDetails(b.queue.queueID, [h])[0].SongID;
                        switch (n) {
                            case -1:
                                GS.getGuts().forceLogEvent("songDownVoted", {songID:q});
                                GS.getGuts().gaTrackEvent("player", "voteSongDown");
                                break;
                            case 0:
                                GS.getGuts().forceLogEvent("songVotedNeutral", {songID:q});
                                GS.getGuts().gaTrackEvent("player", "voteSongNeutral");
                                break;
                            case 1:
                                GS.getGuts().forceLogEvent("songUpVoted",
                                        {songID:q});
                                GS.getGuts().gaTrackEvent("player", "voteSongUp");
                                break
                        }
                        $.publish("gs.player.voted", n)
                    }
                }, flagSong:function (h, n) {
                    if (b.player) {
                        b.player.flagSong(h, n);
                        $.publish("gs.notification", {message:$.localize.getString("SUCCESS_FLAG_SONG")})
                    }
                    GS.getGuts().gaTrackEvent("player", "flagSong", n)
                }, getVolume:function () {
                    if (b.player)return b.player.getVolume()
                }, setVolume:function (h) {
                    h = Math.max(0, Math.min(100, parseInt(h, 10)));
                    b.player && b.player.setVolume(h);
                    GS.getGuts().gaTrackEvent("player", "setVolume", h)
                }, getCrossfadeAmount:function () {
                    if (b.player)return b.player.getCrossfadeAmount()
                },
                getCrossfadeEnabled:function () {
                    if (b.player)return b.player.getCrossfadeEnabled()
                }, setCrossfadeAmount:function (h) {
                    h = parseInt(h, 10);
                    b.player && b.player.setCrossfadeAmount(h);
                    GS.getGuts().gaTrackEvent("player", "setCrossfade", h)
                }, setCrossfadeEnabled:function (h) {
                    h = h && GS.user.subscription.canUsePlayerBonuses() ? true : false;
                    b.player && b.player.setCrossfadeEnabled(h);
                    GS.user.settings.changeLocalSettings({crossfadeEnabled:h ? 1 : 0});
                    GS.getGuts().gaTrackEvent("player", h ? "enableCrossfade" : "disableCrossfade")
                }, setPrefetchEnabled:function (h) {
                    h =
                            h ? true : false;
                    b.player && b.player.setPrefetchEnabled(h);
                    GS.getGuts().gaTrackEvent("player", h ? "enablePrefetch" : "disablePrefetch")
                }, getPrefetchEnabled:function () {
                    if (b.player)return b.player.getPrefetchEnabled()
                }, setLowerQuality:function (h) {
                    h = h ? true : false;
                    b.player && b.player.setLowerQuality(h);
                    GS.getGuts().gaTrackEvent("player", h ? "enableLowerQuality" : "disableLowerQuality")
                }, getLowerQuality:function () {
                    if (b.player)return b.player.getLowerQuality()
                }, getIsMuted:function () {
                    if (b.player)return b.player.getIsMuted()
                },
                setIsMuted:function (h) {
                    h = h ? true : false;
                    b.player && b.player.setIsMuted(h);
                    GS.getGuts().gaTrackEvent("player", h ? "enableMuted" : "disableMuted")
                }, getPlayPauseFade:function () {
                    if (b.player)return b.player.getPlayPauseFade()
                }, setPlayPauseFade:function (h) {
                    h = h ? true : false;
                    b.player && b.player.setPlayPauseFade(h);
                    GS.user.settings.changeLocalSettings({playPauseFade:h ? 1 : 0});
                    GS.getGuts().gaTrackEvent("player", h ? "enablePlayPauseFade" : "disablePlayPauseFade")
                }, setRepeat:function (h) {
                    b.repeat = h;
                    b.player && b.player.setRepeat(h);
                    GS.getGuts().gaTrackEvent("player", "setRepeat", h)
                }, getRepeat:function () {
                    if (b.player && b.player.getRepeat)return b.player.getRepeat();
                    return b.repeat
                }, setShuffle:function (h) {
                    if (!(b.queue && b.queue.autoplayEnabled)) {
                        h = h ? true : false;
                        b.player && b.player.setShuffle(h);
                        GS.user.settings.changeLocalSettings({lastShuffle:h ? 1 : 0});
                        GS.getGuts().gaTrackEvent("player", "shuffle", h ? "on" : "off")
                    }
                }, getShuffle:function () {
                    if (b.player)return b.player.getShuffle();
                    return false
                }, setPersistShuffle:function (h) {
                    h = h ? true : false;
                    b.player && b.player.setPersistShuffle(h);
                    GS.getGuts().gaTrackEvent("player", "persistShuffle", h ? "on" : "off")
                }, prefetchStreamKeys:function (h) {
                    if (b.player)return b.player.prefetchStreamKeys(h)
                }, getAPIVersion:function () {
                    if (b.player)return b.player.getAPIVersion()
                }, getApplicationVersion:function () {
                    if (b.player)return b.player.getApplicationVersion()
                }, updateSongOnPlayer:function (h, n, q) {
                    if (h) {
                        q = _.orEqual(q, false);
                        n = _.orEqual(n, false);
                        if (!(!n && b.currentSong && b.currentSong.queueSongID === h.queueSongID)) {
                            if (h instanceof
                                    GS.Models.Song)b.currentSong = h; else {
                                b.currentSong = GS.Models.Song.wrapQueue([h])[0];
                                if (!(b.currentSong instanceof GS.Models.Song))return
                            }
                            b.videoIndex = b.currentSong.index;
                            $("#queue_list li.queue-item.queue-item-active").removeClass("active");
                            $("#queue_list #" + b.currentSong.queueSongID).addClass("active");
                            $("#playerDetails_nowPlaying").html(b.view("currentSongDetails")).attr("rel", b.currentSong.SongID).attr("qsid", b.currentSong.queueSongID);
                            b.currentSongString.hookup($("#playerDetails_current_song"));
                            _.defined(b.currentSong.index && b.currentSong.index >= 0) && b.gsQueue.setActive(b.currentSong.index, !b.isMouseDown && !q);
                            $.publish("gs.player.currentSong", h);
                            GS.isApril1 && GS.user.hipsterFailCount < 1 && gsConfig.country.ID == 223 && $.publish("gs.notification.hipster")
                        }
                    }
                }, updateQueueDetails:function (h) {
                    h || (h = b.getCurrentQueue(true));
                    if (h && h.hasOwnProperty("songs") && b.currentSongs != h.songs) {
                        b.currentSongs = h.songs;
                        h.songs.length && b.queueClosed && !b.queueClosedByUser && b.setQueue(b.queueSize);
                        if (h.songs && h.songs.length >
                                0) {
                            $("#player_seeking_scrubber").show();
                            $("#player_previous").removeAttr("disabled").removeClass("disabled");
                            h.previousSong ? $("#player_previous").attr("data-tooltip", _.uncleanText(h.previousSong.SongName)) : $("#player_previous").removeAttr("data-tooltip")
                        } else if (!GS.player.queue.autoplayEnabled) {
                            $("#player_seeking_scrubber").hide();
                            $("#player_previous").attr("disabled", "disabled").addClass("disabled").removeAttr("data-tooltip");
                            $("#player_radio_button").removeClass("active").children("span").text($.localize.getString("RADIO_OFF")).attr("data-translate-text",
                                    "RADIO_OFF")
                        }
                    }
                    if (h && h.hasOwnProperty("nextSong") && b.nextSongToPlay != h.nextSong)if (b.nextSongToPlay = h.nextSong) {
                        $("#player_next").removeAttr("disabled").removeClass("disabled").attr("data-tooltip", _.uncleanText(h.nextSong.SongName));
                        if (b.pauseNextQueueSongID && h.nextSong.hasOwnProperty("queueSongID") && h && h.hasOwnProperty("activeSong") && b.pauseNextQueueSongID !== h.activeSong.queueSongID)b.pauseNextQueueSongID = h.nextSong.queueSongID
                    } else $("#player_next", b.element).attr("disabled", "disabled").addClass("disabled").removeAttr("data-tooltip");
                    if (b.activeSong != h.activeSong) {
                        var n = b.activeSong ? b.activeSong.queueSongID : null;
                        b.activeSong = h.activeSong;
                        if (h && h.hasOwnProperty("activeSong")) {
                            $("#player_play_pause").removeAttr("disabled").removeClass("disabled");
                            b.updateSongOnPlayer(h.activeSong, true, n && h.activeSong && n == h.activeSong.queueSongID)
                        } else $("#player_play_pause").attr("disabled", "disabled").addClass("disabled")
                    }
                    $("#playerDetails_queue").html(b.view("queueDetails"));
                    $("#queueClear").html(b.view("queueClear"));
                    n = h.songs.length === 0 ? "QUEUE_NO_SONGS" :
                            h.songs.length == 1 ? "QUEUE_ONE_SONG" : "QUEUE_NUM_SONGS";
                    $("#queue_songCountLink .label").localeDataString(n, {numSongs:h.songs.length});
                    if (h && h.hasOwnProperty("repeatMode") && b.repeatMode != h.repeatMode) {
                        b.repeatMode = h.repeatMode;
                        if (b.repeatMode === b.REPEAT_ALL)$("#player_loop").removeClass("none").addClass("all").addClass("active"); else if (b.repeatMode === b.REPEAT_ONE)$("#player_loop").removeClass("all").addClass("one").addClass("active"); else b.repeatMode === b.REPEAT_NONE && $("#player_loop").removeClass("one").addClass("none").removeClass("active")
                    }
                    if (h &&
                            h.hasOwnProperty("autoplayEnabled") && b.autoplayEnabled != h.autoplayEnabled) {
                        if (b.autoplayEnabled = h.autoplayEnabled) {
                            $("#queue_list").addClass("autoplay");
                            $("#player_shuffle").removeClass("active");
                            $("#player_radio_button").addClass("active").children("span").text($.localize.getString("RADIO_ON")).attr("data-translate-text", "RADIO_ON")
                        } else {
                            $("#queue_list").removeClass("autoplay");
                            $("#player_radio_button").removeClass("active").children("span").text($.localize.getString("RADIO_OFF")).attr("data-translate-text",
                                    "RADIO_OFF");
                            h.shuffleEnabled ? $("#player_shuffle").addClass("active") : $("#player_shuffle").removeClass("active")
                        }
                        $.publish("gs.player.autoplay.update", h.autoplayEnabled);
                        b.trackLastAutoplayInfo(h.autoplayEnabled, h.currentAutoplayTagID)
                    }
                }, updateQueueSongs:function (h) {
                    if (h.hasOwnProperty("songs"))if (h.songs.length) {
                        b.currentSong = h.activeSong;
                        b.songs = h.songs;
                        b.gsQueue.setActive(h.activeSong.index, false);
                        b.gsQueue.setItems(h.songs, true)
                    } else {
                        b.activeSong = h.activeSong;
                        b.songs = h.songs;
                        $("#playerDetails_nowPlaying").html("");
                        b.gsQueue.setActive(0, false);
                        b.gsQueue.setItems([], true)
                    }
                }, updateQueueWidth:function () {
                    var h, n, q = b.getCurrentQueue();
                    if (q) {
                        parseInt($("#queue_list_window").css("padding-left"), 10);
                        h = $("#queue").width();
                        n = $("#queue").height();
                        if (q && q.songs && q.songs.length > 0) {
                            h = b.songWidth * (q.songs.length - 1) + b.activeSongWidth;
                            $("#queue_list").removeClass("empty")
                        } else {
                            h = h;
                            $("#queue_list").addClass("empty").width("")
                        }
                        n !== $("#queue").height() && b.lastQueueWidth !== h && $(window).resize();
                        b.lastQueueWidth = h
                    }
                }, recordEngagement:function (h, n) {
                    if (!h || !n)return false;
                    d = false;
                    GS.player.player.updateInterruptionExpireTime(h, n);
                    return false
                }, autoScrollWaitDuration:300, beginDragDrop:function () {
                    function h(w, o) {
                        var u = $("#queue_songGuide");
                        if (n.within(w.clientX, w.clientY).length > 0) {
                            o.queueLength = _.orEqual(o.queueLength, b.getCurrentQueue().songs.length);
                            var z = n.parent(), D = b.activeSongWidth - b.songWidth, B = 0, E = n.offset().left, F = q.scrollLeft() - 10 - (w.clientX > parseInt($("#queue_list .queue-item-active").css("left"), 10) + b.activeSongWidth ? D : 0), y = parseInt(q.width(),
                                    10) * 0.05;
                            n.children();
                            D = b.getCurrentQueue().activeSong ? _.orEqual(b.getCurrentQueue().activeSong.index, 0) : 0;
                            stopIndex = Math.max(0, Math.min(o.queueLength, Math.round((w.clientX + F) / b.songWidth)));
                            guideLeft = stopIndex * b.songWidth + E - u.width() / 2;
                            E = function () {
                                var C = (new Date).valueOf();
                                if (!o.queueAutoScrollLast || C - o.queueAutoScrollLast >= b.autoScrollWaitDuration) {
                                    o.queueAutoScrollLast = C;
                                    B = Math.max(0, F - y);
                                    q.scrollLeft(B);
                                    b.gsQueue.updateScrollbar()
                                }
                            };
                            var I = function () {
                                var C = (new Date).valueOf();
                                if (!o.queueAutoScrollLast ||
                                        C - o.queueAutoScrollLast >= b.autoScrollWaitDuration) {
                                    o.queueAutoScrollLast = C;
                                    B = Math.min(n.width(), F + y);
                                    q.scrollLeft(B);
                                    b.gsQueue.updateScrollbar()
                                }
                            };
                            if (z.offset().left + 200 > w.clientX) {
                                E();
                                clearInterval(o.queueAutoScrollInterval);
                                o.queueAutoScrollInterval = setInterval(E, b.autoScrollWaitDuration)
                            } else if (z.width() - 200 < w.clientX) {
                                I();
                                clearInterval(o.queueAutoScrollInterval);
                                o.queueAutoScrollInterval = setInterval(I, b.autoScrollWaitDuration)
                            } else {
                                clearInterval(o.queueAutoScrollInterval);
                                o.queueAutoScrollInterval =
                                        false
                            }
                            if (stopIndex > D)guideLeft += b.activeSongWidth - b.songWidth;
                            u.css("left", guideLeft);
                            u.show()
                        } else {
                            clearInterval(o.queueAutoScrollInterval);
                            o.queueAutoScrollInterval = false;
                            u.hide()
                        }
                    }

                    var n = $("#queue_list"), q = $("#queue_list_window"), s = $("#queue");
                    $footer = $("#footer");
                    n.bind("draginit",function (w, o) {
                        var u = $(w.target).closest(".queue-item");
                        if (u.length === 0)return false;
                        o.draggedQueueItem = u;
                        o.proxyOffsetX = w.clientX - u.offset().left;
                        o.proxyOffsetY = w.clientY - u.offset().top
                    }).bind("dragstart",function (w, o) {
                        o.draggedItems = [GS.Models.Song.getOneFromCache($(o.draggedQueueItem).find(".queueSong").attr("rel"))];
                        o.draggedItemsType = "song";
                        o.draggedItemSource = "queue";
                        var u = parseInt(o.draggedQueueItem.attr("data-queuesongid"), 10);
                        if (u)o.deleteAction = {label:"SHORTCUTS_DELETE_NOW_PLAYING", method:function () {
                            GS.player.removeSongs(u)
                        }};
                        $.publish("gs.drag.start", o);
                        return $('<div class="queue-item-drag size-' + GS.player.queueSize + '" style="position:absolute; z-index: 99999;"><div class="status"></div></div>').append($(o.draggedQueueItem).clone()).appendTo("body").mousewheel(_.globalDragProxyMousewheel)
                    }).bind("drag",
                            function (w, o) {
                                o.clientX = w.clientX;
                                o.clientY = w.clientY;
                                $(o.proxy).css("top", w.clientY - o.proxyOffsetY).css("left", w.clientX - o.proxyOffsetX);
                                var u = false, z = false;
                                _.forEach(o.drop, function (D) {
                                    $.isFunction(D.updateDropOnDrag) && D.updateDropOnDrag(w, o);
                                    if (!u)if ($(D).within(w.clientX, w.clientY).length > 0)if ($(D).data("ignoreForOverDrop"))z = true; else {
                                        z = false;
                                        u = true
                                    }
                                });
                                z || (u ? $(o.proxy).addClass("valid").removeClass("invalid") : $(o.proxy).addClass("invalid").removeClass("valid"))
                            }).bind("dragend", function (w, o) {
                                $(o.proxy).remove();
                                GS.getGuts().gaTrackEvent("player", "dragSuccess");
                                $.publish("gs.drag.end", o)
                            });
                    $footer.bind("dropinit",function () {
                        this.updateDropOnDrag = h
                    }).bind("dropstart",function (w, o) {
                        if (!o.draggedItems) {
                            this.updateDropOnDrag = null;
                            return false
                        }
                        o.draggedItemsType = o.draggedItemsType || _.guessDragType(o.draggedItems);
                        $(".queue-item").length && o.draggedItemsType !== "station" && $("<div id='queue_songGuide'/>").addClass("size_" + GS.player.queueSize).css({position:"absolute", zIndex:"99998", height:$(".queue-item").outerHeight(true),
                            width:10, top:$(".queue-item").offset().top + 5}).hide().appendTo("body")
                    }).bind("dropend",function (w, o) {
                                $("#queue_songGuide").remove();
                                clearInterval(o.queueAutoScrollInterval)
                            }).bind("drop", function (w, o) {
                                $(this).offset();
                                var u = $footer.within(w.clientX, w.clientY).length > 0;
                                s.within(w.clientX, w.clientY);
                                var z = b.activeSongWidth - b.songWidth;
                                z = $("#queue_list_window").scrollLeft() - 10 - (w.clientX > parseInt($("#queue_list .queue-item-active").css("left"), 10) + b.activeSongWidth ? z : 0);
                                z = Math.max(0, Math.min(o.queueLength,
                                        Math.round((w.clientX + z) / b.songWidth)));
                                if (o.draggedItemSource == "queue") {
                                    if (!($(".queue-item", n).length < 2)) {
                                        queueSongID = o.draggedQueueItem.find(".queueSong").attr("id");
                                        b.moveSongsTo([queueSongID], z)
                                    }
                                } else {
                                    var D = [], B, E, F, y;
                                    if (u)if (!(w.clientX === 0 && w.layerX === 0 && w.offsetX === 0 && w.screenX === 0)) {
                                        o.draggedItemsType = o.draggedItemsType || _.guessDragType(o.draggedItems);
                                        switch (o.draggedItemsType) {
                                            case "song":
                                                B = [];
                                                for (F = 0; F < o.draggedItems.length; F++)B.push(o.draggedItems[F].SongID);
                                                D.push({songIDs:B, context:o.draggedItemsContext});
                                                var I, C = [], H = [];
                                                u = $("#grid");
                                                if (u.controller()) {
                                                    var K = u.controller().dataView.rows;
                                                    $('#grid .slick-row.selected[id!="showQueue"]').each(function (r, t) {
                                                        I = parseInt($(t).attr("row"), 10);
                                                        if (!isNaN(I)) {
                                                            C.push(I + 1);
                                                            var v = K[I].ppVersion;
                                                            v && H.push(v)
                                                        }
                                                    })
                                                }
                                                u = {ranks:C, songIDs:B};
                                                if (H.length > 0)u.ppVersions = H.join();
                                                GS.getGuts().logMultiSongDrag("OLSongsDraggedToQueue", u);
                                                break;
                                            case "album":
                                                for (F = 0; F < o.draggedItems.length; F++) {
                                                    B = [];
                                                    o.draggedItems[F].getSongs(function (r) {
                                                        r.sort(GS.Models.Album.defaultSongSort);
                                                        for (y =
                                                                     0; y < r.length; y++)B.push(r[y].SongID)
                                                    }, null, true, {async:false});
                                                    D.push({songIDs:B, context:new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_ALBUM, o.draggedItems[F])})
                                                }
                                                break;
                                            case "artist":
                                                for (F = 0; F < o.draggedItems.length; F++) {
                                                    B = [];
                                                    o.draggedItems[F].getSongs(function (r) {
                                                        r.sort(GS.Models.Artist.defaultSongSort);
                                                        for (y = 0; y < r.length; y++)B.push(r[y].SongID)
                                                    }, false, null, {async:false});
                                                    D.push({songIDs:B, context:new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_ARTIST, o.draggedItems[F])})
                                                }
                                                break;
                                            case "playlist":
                                                for (F =
                                                             0; F < o.draggedItems.length; F++) {
                                                    B = [];
                                                    o.draggedItems[F].getSongs(function (r) {
                                                        for (y = 0; y < r.length; y++)B.push(r[y].SongID)
                                                    }, null, {async:false});
                                                    D.push({songIDs:B, context:new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_PLAYLIST, o.draggedItems[F])})
                                                }
                                                break;
                                            case "user":
                                                for (F = 0; F < o.draggedItems.length; F++) {
                                                    B = [];
                                                    o.draggedItems[F].getFavoritesByType("Songs", function (r) {
                                                        _.forEach(r, function (t) {
                                                            B.push(t.SongID)
                                                        })
                                                    }, null, {async:false});
                                                    D.push({songIDs:B, context:new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_USER,
                                                            o.draggedItems[F])})
                                                }
                                                break;
                                            case "station":
                                                GS.player.setAutoplay(true, o.draggedItems[0].StationID);
                                                return;
                                            default:
                                                console.error("queue drop, invalid drag type", o.draggedItemsType);
                                                return
                                        }
                                        E = s.within(w.clientX, w.clientY).length > 0 || b.getCurrentQueue().songs.length > 0 ? false : true;
                                        for (F = 0; F < D.length; F++) {
                                            B = D[F].songIDs;
                                            u = _.orEqual(D[F].context, new GS.Models.PlayContext);
                                            b.addSongsToQueueAt(B, z, E, u);
                                            z += B.length;
                                            E = false
                                        }
                                        GS.getGuts().gaTrackEvent("player", "dropSuccess")
                                    }
                                }
                            })
                }, addQueueSeek:function () {
                    this.seek =
                            $("#seeking_wrapper");
                    this.seek.slider({disabled:true, max:1E3, start:function () {
                        GS.player.SCRUB_LOCK = true
                    }, stop:function () {
                        GS.player.SCRUB_LOCK = false
                    }, change:function (h, n) {
                        var q = n.value / 1E3, s = b.player.getPlaybackStatus();
                        b.seekTo(q * s.duration)
                    }})
                }, addShortcuts:function () {
                    if (!GS.user.settings.local.disablePlayerShortcuts) {
                        b.volumeSliderTimeout = null;
                        b.volumeSliderDuration = 300;
                        $(document).unbind(".playerShortcut");
                        $(document).bind("keyup.playerShortcut.playerShortcutPause", "space",function (h) {
                            $(h.target).is("button") &&
                            h.preventDefault()
                        }).bind("keydown.playerShortcut.playerShortcutPause", "space",function (h) {
                                    if (!($(h.target).is("input,textarea,select") && $(h.target).val().length > 0)) {
                                        b.togglePlayPause();
                                        GS.getGuts().gaTrackEvent("player", "playPauseShortcut");
                                        return false
                                    }
                                }).bind("keydown.playerShortcut.playerShortcutNext", "ctrl+right",function (h) {
                                    if (!($(h.target).is("input,textarea,select") && $(h.target).val().length > 0)) {
                                        b.nextSong();
                                        GS.getGuts().gaTrackEvent("player", "nextShortcut");
                                        return false
                                    }
                                }).bind("keydown.playerShortcut.playerShortcutNext",
                                "meta+right",function (h) {
                                    if (!($(h.target).is("input,textarea,select") && $(h.target).val().length > 0)) {
                                        b.nextSong();
                                        GS.getGuts().gaTrackEvent("player", "nextShortcut");
                                        return false
                                    }
                                }).bind("keydown.playerShortcut.playerShortcutPrevious", "ctrl+left",function (h) {
                                    if (!($(h.target).is("input,textarea,select") && $(h.target).val().length > 0)) {
                                        b.previousSong();
                                        GS.getGuts().gaTrackEvent("player", "prevShortcut");
                                        return false
                                    }
                                }).bind("keydown.playerShortcut.playerShortcutPrevious", "meta+left",function (h) {
                                    if (!($(h.target).is("input,textarea,select") &&
                                            $(h.target).val().length > 0)) {
                                        b.previousSong();
                                        GS.getGuts().gaTrackEvent("player", "prevShortcut");
                                        return false
                                    }
                                }).bind("keydown.playerShortcut.playerShortcutVolumeUp", "ctrl+up",function (h) {
                                    if (!($(h.target).is("input,textarea,select") && $(h.target).val().length > 0)) {
                                        b.setVolume(Math.min(100, b.getVolume() + 5));
                                        $("#volumeSlider").slider("value", b.getVolume());
                                        $("#volumeControl").show();
                                        clearTimeout(b.volumeSliderTimeout);
                                        b.volumeSliderTimeout = setTimeout(function () {
                                            $("#volumeControl").hide()
                                        }, b.volumeSliderDuration);
                                        GS.getGuts().gaTrackEvent("player", "volumeUpShortcut", b.getVolume());
                                        return false
                                    }
                                }).bind("keydown.playerShortcut.playerShortcutVolumeUp", "meta+up",function (h) {
                                    if (!($(h.target).is("input,textarea,select") && $(h.target).val().length > 0)) {
                                        b.setVolume(Math.min(100, b.getVolume() + 5));
                                        $("#volumeSlider").slider("value", b.getVolume());
                                        $("#volumeControl").show();
                                        clearTimeout(b.volumeSliderTimeout);
                                        b.volumeSliderTimeout = setTimeout(function () {
                                            $("#volumeControl").hide()
                                        }, b.volumeSliderDuration);
                                        GS.getGuts().gaTrackEvent("player",
                                                "volumeUpShortcut", b.getVolume());
                                        return false
                                    }
                                }).bind("keydown.playerShortcut.playerShortcutVolumeDown", "ctrl+down",function (h) {
                                    if (!($(h.target).is("input,textarea,select") && $(h.target).val().length > 0)) {
                                        b.setVolume(Math.max(0, b.getVolume() - 5));
                                        $("#volumeSlider").slider("value", b.getVolume());
                                        $("#volumeControl").show();
                                        clearTimeout(b.volumeSliderTimeout);
                                        b.volumeSliderTimeout = setTimeout(function () {
                                            $("#volumeControl").hide()
                                        }, b.volumeSliderDuration);
                                        GS.getGuts().gaTrackEvent("player", "volumeDownShortcut",
                                                b.getVolume());
                                        return false
                                    }
                                }).bind("keydown.playerShortcut.playerShortcutVolumeDown", "meta+down", function (h) {
                                    if (!($(h.target).is("input,textarea,select") && $(h.target).val().length > 0)) {
                                        b.setVolume(Math.max(0, b.getVolume() - 5));
                                        $("#volumeSlider").slider("value", b.getVolume());
                                        $("#volumeControl").show();
                                        clearTimeout(b.volumeSliderTimeout);
                                        b.volumeSliderTimeout = setTimeout(function () {
                                            $("#volumeControl").hide()
                                        }, b.volumeSliderDuration);
                                        GS.getGuts().gaTrackEvent("player", "volumeDownShortcut", b.getVolume());
                                        return false
                                    }
                                })
                    }
                }, addVolumeSlider:function () {
                    var h = ["off", "one", "two", "three", "four", "five"], n = function (q, s) {
                        var w = _.orEqual(Math.ceil(s.value / 20), 5);
                        w = h[w];
                        $("#player_volume").attr("class", "player_control main_asset " + w);
                        s.value == 0 && b.getIsMuted() ? $("#player_volume").addClass("muted") : b.setVolume(s.value)
                    };
                    $("#volumeSlider").slider({orientation:"vertical", range:"min", min:0, max:100, slide:n, change:n})
                }, addQueueResize:function () {
                    var h = this;
                    $("#player_queue").resizable({handles:{s:$("#player_queue_resize")},
                        minHeight:0, maxHeight:185, animate:false, distance:10, iframeFix:true, start:function () {
                            h.gsQueue.lastLeftmostOnDragStart = h.gsQueue.calcIndex($("#queue_list_window").scrollLeft())
                        }, resize:function () {
                            $("#deselector").select();
                            $("#queue_list_window").hide();
                            h.gsQueue && h.gsQueue.setDisabled(true);
                            GS.resize()
                        }, stop:function (n, q) {
                            var s = q.size.height - 30;
                            $("#queue_list_window").show();
                            if (s > 145)h.setQueue("l"); else if (s > 100)h.setQueue("m"); else s > 15 ? h.setQueue("s") : h.setQueue("off");
                            $("#player_queue").height("auto").width("auto");
                            GS.resize()
                        }})
                }, ".queueSong dblclick":function (h, n) {
                    n.stopPropagation();
                    b.getCurrentQueue(true) && b.playSong(h.attr("id"));
                    return false
                }, ".queueSong a.play click":function (h, n) {
                    n.stopImmediatePropagation();
                    var q = b.getCurrentQueue(true);
                    if (q && q.activeSong && h.attr("rel") == q.activeSong.queueSongID)if (b.isPlaying)b.pauseSong(); else b.isPaused ? b.resumeSong() : b.playSong(q.activeSong.queueSongID); else b.playSong(h.attr("rel"));
                    return false
                }, ".queueSong a.remove click":function (h, n) {
                    n.stopImmediatePropagation();
                    var q = b.getCurrentQueue().activeSong, s = b.getSongDetails(b.getCurrentQueue().queueID, h.parents(".queueSong").attr("id"))[0];
                    b.removeSongs([s.queueSongID]);
                    b.queue = false;
                    b.queue = b.getCurrentQueue();
                    b.updateQueueWidth();
                    b.gsQueue.setItems(b.queue.songs);
                    if (b.queue.activeSong)b.gsQueue.setActive(b.queue.activeSong.index, false); else q && q.index && q.index > 0 && b.gsQueue.setActive(q.index - 1, false);
                    GS.getGuts().gaTrackEvent("player", "removeSong", s.SongID);
                    return false
                }, ".queueSong a.add click":function (h, n) {
                    n.stopImmediatePropagation();
                    var q = b.getCurrentQueue(), s = h.is(".inLibrary"), w = h.parents(".queueSong").attr("id");
                    q = b.getSongDetails(q.queueID, [w])[0];
                    if (b.currentSong && b.currentSong.queueSongID === q.queueSongID)q = b.currentSong;
                    if (s) {
                        h.removeClass("inLibrary").removeClass("isFavorite");
                        GS.user.removeFromLibrary(q.SongID);
                        GS.getGuts().logEvent("playerRemoveFromLibrary", {songID:q.SongID})
                    } else {
                        h.addClass("inLibrary");
                        GS.user.addToLibrary(q.SongID);
                        GS.getGuts().logEvent("playerAddToLibrary", {songID:q.SongID})
                    }
                    return false
                }, ".queueSong a.favorite click":function (h, n) {
                    n.stopImmediatePropagation();
                    var q = b.getCurrentQueue(), s = h.is(".isFavorite"), w = h.parents(".queueSong").attr("id");
                    q = b.getSongDetails(q.queueID, [w])[0];
                    if (b.currentSong && b.currentSong.queueSongID === q.queueSongID)q = b.currentSong;
                    if (s) {
                        h.removeClass("isFavorite");
                        GS.user.removeFromSongFavorites(q.SongID);
                        GS.getGuts().logEvent("playerRemoveFromSongFavorites", {songID:q.SongID})
                    } else {
                        h.addClass("isFavorite");
                        GS.user.addToSongFavorites(q.SongID);
                        GS.getGuts().logEvent("playerAddToSongFavorites", {songID:q.SongID})
                    }
                    return false
                },
                ".queueSong a.options click":function (h, n) {
                    var q = this.getCurrentQueue(), s = h.parents(".queueSong").attr("id");
                    q = this.getSongDetails(q.queueID, [s])[0];
                    var w = {isQueue:true, flagSongCallback:function (o) {
                        GS.player.flagSong(s, o)
                    }, voteSongCallback:function (o) {
                        GS.player.voteSong(s, o)
                    }};
                    if ($("div.qsid" + s).is(":visible")) {
                        $("div.qsid" + s).hide();
                        h.removeClass("active-context")
                    } else {
                        h.addClass("active-context").jjmenu(n, q.getContextMenu(w), null, {xposition:"auto", yposition:"top", orientation:"top", show:"show", className:"queuemenu qsid" +
                                s, keepState:h});
                        GS.getGuts().gaTrackEvent("player", "songMenu", q.SongID)
                    }
                }, ".queueSong .smile click":function (h, n) {
                    n.stopImmediatePropagation();
                    console.log("player.smile click", h, n);
                    var q = h.parents(".queueSong").attr("id");
                    h.siblings(".frown").removeClass("active");
                    if (h.is(".active")) {
                        this.voteSong(q, 0);
                        h.removeClass("active");
                        GS.getGuts().gaTrackEvent("player", "unsmile", h.parents(".queueSong").attr("id"));
                        this.trackAutoplayEvent("unsmile")
                    } else {
                        this.voteSong(q, 1);
                        h.addClass("active");
                        GS.getGuts().gaTrackEvent("player",
                                "smile", h.parents(".queueSong").attr("id"));
                        this.trackAutoplayEvent("smile")
                    }
                    return false
                }, ".queueSong .frown click":function (h, n) {
                    n.stopImmediatePropagation();
                    console.log("player.frown click", h.get(), n);
                    var q = h.parents(".queueSong").attr("id");
                    h.siblings(".smile").removeClass("active");
                    if (h.is(".active")) {
                        this.voteSong(q, 0);
                        h.removeClass("active");
                        GS.getGuts().gaTrackEvent("player", "unfrown", h.parents(".queueSong").attr("id"));
                        this.trackAutoplayEvent("unfrown")
                    } else {
                        this.voteSong(q, -1);
                        h.addClass("active");
                        GS.getGuts().gaTrackEvent("player", "frown", h.parents(".queueSong").attr("id"));
                        this.trackAutoplayEvent("frown")
                    }
                    return false
                }, ".currentSongLink, a.queueSong_name click":function (h, n) {
                    n.stopImmediatePropagation();
                    var q = h.attr("rel"), s = GS.Models.Song.getOneFromCache(q);
                    if (s = s && $.isFunction(s.toUrl) ? s.toUrl() : false) {
                        GS.router.setHash(s);
                        GS.getGuts().gaTrackEvent("player", "songItemLink", q)
                    }
                    return false
                }, ".queueSong contextmenu":function (h, n) {
                    var q = GS.Models.Song.getOneFromCache(h.attr("rel")), s = h.attr("id");
                    h.jjmenu(n, q.getContextMenu({isQueue:true, flagSongCallback:function (w) {
                        GS.player.flagSong(s, w)
                    }, voteSongCallback:function (w) {
                        GS.player.voteSong(s, w)
                    }}), null, {xposition:"mouse", yposition:"mouse", show:"show", className:"queuemenu"});
                    GS.getGuts().gaTrackEvent("player", "songMenu", q.SongID)
                }, "#playerDetails_nowPlaying click":function (h, n) {
                    if (!$(n.target).is("a")) {
                        var q = $("#playerDetails_nowPlaying").attr("rel"), s = this.getCurrentSong().queueSongID, w = GS.Models.Song.getOneFromCache(q), o = {isQueue:true, flagSongCallback:function (u) {
                            GS.player.flagSong(s,
                                    u)
                        }, voteSongCallback:function (u) {
                            GS.player.voteSong(s, u)
                        }};
                        if (h.hasClass("active-context")) {
                            $(".jjplayerNowPlaying").hide();
                            h.removeClass("active-context")
                        } else {
                            h.addClass("active-context").jjmenu(n, w.getContextMenu(o), null, {xposition:"left", yposition:"top", orientation:"top", show:"show", className:"queuemenu jjplayerNowPlaying", keepState:h});
                            GS.getGuts().gaTrackEvent("player", "nowPlayingMenu", q)
                        }
                    }
                }, togglePlayPause:function () {
                    var h = this.player.getPlaybackStatus();
                    if (h) {
                        switch (h.status) {
                            case this.PLAY_STATUS_NONE:
                            case this.PLAY_STATUS_FAILED:
                            case this.PLAY_STATUS_COMPLETED:
                            default:
                                h.activeSong &&
                                this.playSong(h.activeSong.queueSongID);
                                break;
                            case this.PLAY_STATUS_INITIALIZING:
                            case this.PLAY_STATUS_LOADING:
                                this.stopSong();
                                break;
                            case this.PLAY_STATUS_PLAYING:
                            case this.PLAY_STATUS_BUFFERING:
                                this.pauseSong();
                                break;
                            case this.PLAY_STATUS_PAUSED:
                                this.resumeSong();
                                break
                        }
                        $.publish("gs.player.queue.change")
                    }
                }, "#player_play_pause click":function () {
                    this.togglePlayPause();
                    return false
                }, "#player_previous click":function () {
                    this.previousSong();
                    return false
                }, "#player_next click":function () {
                    this.nextSong();
                    return false
                }, "#player_shuffle click":function (h) {
                    if (!b.queue.autoplayEnabled) {
                        h.toggleClass("active");
                        h = h.is(".active") ? true : false;
                        b.setShuffle(h);
                        return false
                    }
                }, "#player_loop click":function (h) {
                    var n;
                    if (h.is(".none")) {
                        n = b.REPEAT_ALL;
                        h.removeClass("none").addClass("all").addClass("active")
                    } else if (h.is(".all")) {
                        n = b.REPEAT_ONE;
                        h.removeClass("all").addClass("one").addClass("active")
                    } else {
                        n = b.REPEAT_NONE;
                        h.removeClass("one").addClass("none").removeClass("active")
                    }
                    b.setRepeat(n);
                    return false
                }, "#player_crossfade click":function (h) {
                    if (GS.user.UserID >
                            0 && GS.user.subscription.canUsePlayerBonuses()) {
                        h.toggleClass("active");
                        h = h.is(".active") ? true : false;
                        b.setCrossfadeEnabled(h)
                    } else GS.getLightbox().open("vipOnlyFeature", {callback:this.callback(function () {
                        this.setCrossfadeEnabled(true)
                    })});
                    return false
                }, "#player_fullscreen click":function () {
                    return false
                }, "#player_volume click":function (h) {
                    console.log("player_volume toggle", this.getIsMuted());
                    if (this.getIsMuted()) {
                        this.setIsMuted(false);
                        $(h).removeClass("muted");
                        $("#volumeSlider").slider("value", b.player.getVolume())
                    } else {
                        this.setIsMuted(true);
                        $(h).addClass("muted");
                        $("#volumeSlider").slider("value", 0)
                    }
                    return false
                }, "#player_volume mouseenter":function () {
                    clearTimeout(this.volumeSliderTimeout);
                    $("#volumeControl").show();
                    return false
                }, "#player_volume mouseleave":function () {
                    clearTimeout(this.volumeSliderTimeout);
                    this.volumeSliderTimeout = setTimeout(this.callback(function () {
                        $("#volumeControl").hide()
                    }), this.volumeSliderDuration);
                    return false
                }, "#volumeControl mouseenter":function () {
                    clearTimeout(this.volumeSliderTimeout);
                    return false
                }, "#volumeControl mouseleave":function () {
                    clearTimeout(this.volumeSliderTimeout);
                    if (this.isMouseDown) {
                        var h = this, n = function () {
                            $("body").unbind("mouseup", n);
                            $("body").unbind("mouseleave", n);
                            h.isMouseDown = 0;
                            h.volumeSliderTimeout = setTimeout(h.callback(function () {
                                $("#volumeControl").hide()
                            }), h.volumeSliderDuration)
                        };
                        $("body").bind("mouseup", n);
                        $("body").bind("mouseleave", n)
                    } else this.volumeSliderTimeout = setTimeout(this.callback(function () {
                        $("#volumeControl").hide()
                    }), this.volumeSliderDuration);
                    return false
                }, isMouseDown:0, mousedown:function () {
                    this.isMouseDown = 1
                }, mouseup:function () {
                    this.isMouseDown =
                            0
                }, "#player_options click":function (h, n) {
                    var q = this.getCurrentQueue(), s = this, w = [], o = [
                        {title:$.localize.getString("QUEUE_LARGE"), customClass:!GS.player.queueClosed && GS.player.queueSize == "l" ? "jj_menu_item_hasIcon jj_menu_item_tick" : "jj_menu_item_hasIcon jj_menu_item_blank", action:{type:"fn", callback:function () {
                            GS.player.setQueue("l")
                        }}},
                        {title:$.localize.getString("QUEUE_NORMAL"), customClass:!GS.player.queueClosed && GS.player.queueSize == "m" ? "jj_menu_item_hasIcon jj_menu_item_tick" : "jj_menu_item_hasIcon jj_menu_item_blank",
                            action:{type:"fn", callback:function () {
                                GS.player.setQueue("m")
                            }}},
                        {title:$.localize.getString("QUEUE_SMALL"), customClass:!GS.player.queueClosed && GS.player.queueSize == "s" ? "jj_menu_item_hasIcon jj_menu_item_tick" : "jj_menu_item_hasIcon jj_menu_item_blank", action:{type:"fn", callback:function () {
                            GS.player.setQueue("s")
                        }}},
                        {title:$.localize.getString("QUEUE_HIDE"), customClass:GS.player.queueClosed ? "jj_menu_item_hasIcon jj_menu_item_tick" : "jj_menu_item_hasIcon jj_menu_item_blank", action:{type:"fn", callback:function () {
                            GS.player.setQueue("off")
                        }}}
                    ];
                    w.push({title:$.localize.getString("QUEUE_SIZES"), type:"sub", customClass:"jj_menu_item_hasIcon jj_menu_item_play", src:o});
                    GS.user.UserID > 0 && w.push({title:$.localize.getString("PLAYER_SHOW_SETTINGS"), customClass:"jj_menu_item_hasIcon jj_menu_item_privacy", action:{type:"fn", callback:function () {
                        GS.router.setHash("/settings/activity")
                    }}});
                    if (q && q.songs && q.songs.length) {
                        w.push({customClass:"separator"});
                        s.videoModeEnabled ? w.push({title:$.localize.getString("PLAYER_DISABLE_VIDEO_MODE"), customClass:"jj_menu_item_hasIcon jj_menu_item_video",
                            action:{type:"fn", callback:function () {
                                s.disableVideoMode()
                            }}}) : w.push({title:$.localize.getString("PLAYER_ENABLE_VIDEO_MODE"), customClass:"jj_menu_item_hasIcon jj_menu_item_video", action:{type:"fn", callback:function () {
                            s.enableVideoMode()
                        }}});
                        w.push({title:$.localize.getString("PLAYER_SHOW_VISUALIZER"), customClass:"jj_menu_item_hasIcon jj_menu_item_visualizer", action:{type:"fn", callback:function () {
                            if (GS.user.subscription.canUsePlayerBonuses())$("#lightbox .lbcontainer:visible").is(".gs_lightbox_visualizer") ||
                            GS.getLightbox().open("visualizer", {showPlayerControls:true}); else GS.getLightbox().open("vipOnlyFeature", {callback:s.callback(function () {
                                $("#lightbox .lbcontainer:visible").is(".gs_lightbox_visualizer") || GS.getLightbox().open("visualizer", {showPlayerControls:true})
                            })})
                        }}});
                        s.powerModeEnabled ? w.push({title:$.localize.getString("PLAYER_DISABLE_POWER_MODE"), customClass:"jj_menu_item_hasIcon jj_menu_item_clock", action:{type:"fn", callback:function () {
                            s.disablePowerMode()
                        }}}) : w.push({title:$.localize.getString("PLAYER_ENABLE_POWER_MODE"),
                            customClass:"jj_menu_item_hasIcon jj_menu_item_clock", action:{type:"fn", callback:function () {
                                GS.user.subscription.canUsePlayerBonuses() ? s.enablePowerMode() : GS.getLightbox().open("vipOnlyFeature", {callback:s.callback(function () {
                                    this.enablePowerMode()
                                })})
                            }}})
                    }
                    if (h.hasClass("active-context")) {
                        $(".jjQueueMenu").remove();
                        h.removeClass("active-context")
                    } else {
                        h.addClass("active-context").jjmenu(n, w, null, {xposition:"right", yposition:"top", orientation:"top", spill:"left", show:"show", className:"radiomenu jjQueueMenu",
                            keepState:h});
                        GS.getGuts().gaTrackEvent("player", "queueSongMenu")
                    }
                }, showRadioStations:function (h) {
                    messageKey = h ? "POPUP_START_RADIO_NO_SONGS_MESSAGE" : "POPUP_START_RADIO_NO_RECS_MESSAGE";
                    GS.getLightbox().open({type:"radioStations", view:{header:"POPUP_START_RADIO_TITLE", messageHTML:'<p data-translate-text="' + messageKey + '">' + $.localize.getString(messageKey) + '</p><div id="grid" class="gs_grid radioStations"></div>', buttonsRight:[], buttonsLeft:[
                        {label:"CLOSE", className:"close"}
                    ]}, callbacks:{".close":function () {
                        GS.getLightbox().close();
                        return false
                    }}, loadCallback:function () {
                        var n = GS.Models.Station.tagStations;
                        $("#lightbox_content .radioStations").gs_grid(n, GS.Controllers.GridController.columns.station, {allowDragSort:false, allowDuplicates:false, disableMultiSelect:true, sortCol:"StationTitle", sortDir:true}, "station");
                        GS.getLightbox().positionLightbox();
                        $.subscribe("gs.player.autoplay.update", function (q) {
                            q && GS.getLightbox().close()
                        })
                    }})
                }, "#player_radio_button click":function (h) {
                    $(h);
                    if (b.player && !b.player.getCurrentQueue().autoplayEnabled)if (b.player.getCurrentQueue().songs.length >
                            0) {
                        b.player.setAutoplay(true);
                        $("#player_radio_button").addClass("active").children("span").text($.localize.getString("RADIO_ON")).attr("data-translate-text", "RADIO_ON")
                    } else this.showRadioStations(true); else {
                        b.player.setAutoplay(false);
                        $("#player_radio_button").removeClass("active").children("span").text($.localize.getString("RADIO_OFF")).attr("data-translate-text", "RADIO_OFF")
                    }
                }, "#player_radio_label click":function (h, n) {
                    var q = GS.Models.Station.getStationsStartMenu();
                    if (h.hasClass("active-context")) {
                        $(".jjStationsMenu").hide();
                        h.removeClass("active-context")
                    } else {
                        h.addClass("active-context").jjmenu(n, q, null, {xposition:"right", yposition:"top", orientation:"top", spill:"left", show:"show", className:"radiomenu jjStationsMenu", keepState:h});
                        GS.getGuts().gaTrackEvent("player", "queueStationsMenu")
                    }
                }, "#player_queue_sizer click":function () {
                    if (b.queueClosed)b.setQueue("s", true); else if (b.queueSize == "s")b.setQueue("m", true); else if (b.queueSize == "m")b.setQueue("l", true); else b.queueSize == "l" && b.setQueue("off", true)
                }, "#queue_songCountLink click":function (h, n) {
                    n.preventDefault();
                    var q = this.getCurrentQueue(true), s = [];
                    s.push({title:$.localize.getString("NOW_PLAYING"), action:{type:"gourl", url:"#!/now_playing"}});
                    q && q.songs && q.songs.length > 0 && s.push({title:$.localize.getString("QUEUE_SAVE_QUEUE"), type:"sub", src:this.getSaveQueueMenu()});
                    GS.user.UserID > 0 && s.push({title:$.localize.getString("QUEUE_LOAD"), type:"sub", src:this.getLoadQueueMenu()});
                    if (h.hasClass("active-context")) {
                        $(".jjQueueMenu").hide();
                        h.removeClass("active-context")
                    } else {
                        h.addClass("active-context").jjmenu(n,
                                s, null, {xposition:"right", yposition:"top", orientation:"top", spill:"left", show:"show", className:"radiomenu jjQueueMenu", keepState:h});
                        GS.getGuts().gaTrackEvent("player", "queueCurrentSongsMenu")
                    }
                }, getSaveQueueMenu:function () {
                    var h = this.getCurrentQueue(true), n = [], q = [];
                    if (h && h.songs && h.songs.length > 0)n = [
                        {title:$.localize.getString("CONTEXT_ADD_TO_LIBRARY"), customClass:"addLibrary jj_menu_item_hasIcon jj_menu_item_music", action:{type:"fn", callback:function () {
                            var o, u = [];
                            for (o = 0; o < h.songs.length; o++) {
                                u.push(h.songs[o].SongID);
                                GS.getGuts().logEvent("playerAddToLibrary", {songID:h.songs[o].SongID})
                            }
                            GS.user.addToLibrary(u)
                        }}},
                        {customClass:"separator"}
                    ];
                    if (h && h.songs && h.songs.length > 0) {
                        _.forEach(h.songs, function (o) {
                            q.push(o.SongID)
                        });
                        var s = GS.Models.Playlist.getPlaylistsMenu(q, function (o) {
                            GS.getLightbox().open({type:"confirm", view:{header:"POPUP_OVERWRITE_PLAYLIST_TITLE", messageHTML:"<p>" + _.getString("POPUP_ARE_YOU_SURE_OVERWRITE_PLAYLIST", {playlist:_.cleanText(o.PlaylistName)}) + "</p>", buttonsLeft:[
                                {label:"CANCEL", className:"close"}
                            ],
                                buttonsRight:[
                                    {label:"OK", className:"submit"}
                                ]}, callbacks:{".submit":function () {
                                o.overwriteWithSongs(q, true)
                            }}})
                        }, false, true), w = GS.Models.Playlist.getPlaylistsMenu(q, function (o) {
                            o.addSongs(q, o.length, true)
                        }, false, false);
                        _.isEmpty(GS.user.playlists) ? n.push({title:$.localize.getString("CONTEXT_NEW_PLAYLIST"), customClass:"jj_menu_item_hasIcon jj_menu_item_new_playlist", action:{type:"fn", callback:function () {
                            GS.getLightbox().open("newPlaylist", q)
                        }}}) : n.push({title:$.localize.getString("QUEUE_SAVE_PLAYLIST"),
                            customClass:"jj_menu_item_hasIcon jj_menu_item_replace_playlist saveQueue", type:"sub", src:s});
                        w.length && n.push({title:$.localize.getString("QUEUE_ADD_TO_PLAYLIST"), customClass:"saveQueue jj_menu_item_hasIcon jj_menu_item_add_playlist", type:"sub", src:w});
                        n.length && n.push({customClass:"separator"});
                        n.push({title:$.localize.getString("QUEUE_EMBED_SONGS"), customClass:"jj_menu_item_hasIcon jj_menu_item_share_widget shareSongs", action:{type:"fn", callback:function () {
                            var o, u = [];
                            for (o = 0; o < h.songs.length; o++)u.push(h.songs[o].SongID);
                            GS.getLightbox().open("widget", {type:"manySongs", id:u})
                        }}})
                    }
                    return n
                }, getLoadQueueMenu:function () {
                    this.getCurrentQueue(true);
                    var h = this, n = [], q;
                    if (GS.user.favorites.songs) {
                        q = _.toArrayID(GS.user.favorites.songs);
                        q.length && n.push({title:$.localize.getString("QUEUE_LOAD_FAVORITES"), customClass:"stations jj_menu_item_hasIcon jj_menu_item_favorites", action:{type:"fn", callback:function () {
                            GS.player.addSongsToQueueAt(q)
                        }}})
                    }
                    var s = GS.Models.Playlist.getPlaylistsMenu([], function (w) {
                        var o = function () {
                            var u = [],
                                    z = new GS.Models.PlayContext(GS.player.PLAY_CONTEXT_PLAYLIST, w);
                            w.getSongs(function (D) {
                                for (j = 0; j < D.length; j++)u.push(D[j].SongID);
                                GS.player.addSongsToQueueAt(u, h.INDEX_REPLACE, true, z)
                            }, null, false, {async:false})
                        };
                        if (GS.player.queue && GS.player.queue.songs && GS.player.queue.songs.length > 0) {
                            GS.getLightbox().close();
                            GS.getLightbox().open({type:"playlistClearQueue", view:{header:"ARE_YOU_SURE", messageHTML:w.PlaylistName.length ? _.getString("POPUP_LOAD_PLAYLIST_MESSAGE_WITH_PLAYLIST", {playlistName:w.PlaylistName}) :
                                    _.getString("POPUP_LOAD_PLAYLIST_MESSAGE"), buttonsLeft:[
                                {label:"CANCEL", className:"close"}
                            ], buttonsRight:[
                                {label:"POPUP_LOAD_PLAYLIST_BTN", className:"submit"}
                            ]}, callbacks:{".submit":function () {
                                o();
                                GS.getGuts().logEvent("playlistOverwriteQueue", {overwrite:1})
                            }}});
                            GS.getGuts().logEvent("playlistOverwriteQueue", {overwrite:0})
                        } else o()
                    }, true, false);
                    s.length > 0 && n.push({title:$.localize.getString("QUEUE_LOAD_PLAYLIST"), customClass:"playlist jj_menu_item_hasIcon jj_menu_item_playlist", type:"sub", src:s});
                    return n
                }, videoIndex:0, enableVideoMode:function () {
                    this.videoModeEnabled = true;
                    this.showVideoLightbox();
                    if (this.powerModeEnabled) {
                        clearInterval(this.powerModeInterval);
                        this.powerModeInterval = setInterval($(".lbcontainer.gs_lightbox_video").controller().callback("powerHourCheckVideoMode"), 1E3)
                    }
                    GS.getGuts().gaTrackEvent("player", "enableVideoMode")
                }, disableVideoMode:function () {
                    this.videoModeEnabled = false;
                    this.hideVideoLightbox();
                    this.playSong();
                    this.powerModeEnabled && clearInterval(this.powerModeInterval);
                    GS.getGuts().gaTrackEvent("player", "disableVideoMode")
                }, showVideoLightbox:function () {
                    var h = this.currentSong;
                    if (h) {
                        GS.getLightbox().close();
                        GS.getLightbox().open("video", {isLoading:true, isVideoMode:true, song:h, sidebarHeader:"POPUP_VIDEO_ALTERNATE"})
                    } else {
                        $.publish("gs.notification", {type:"error", message:$.localize.getString("NOTIF_FEATURE_REQUIREMENT_SONGS")});
                        this.videoModeEnabled = false
                    }
                }, hideVideoLightbox:function () {
                    $("div.lbcontainer.gs_lightbox_video").is(":visible") && GS.getLightbox().close()
                },
                togglePowerMode:function () {
                    this.powerModeEnabled ? this.disablePowerMode() : this.enablePowerMode()
                }, enablePowerMode:function () {
                    this.powerModeEnabled = true;
                    if (this.videoModeEnabled && $(".lbcontainer.video")) {
                        clearInterval(this.powerModeInterval);
                        this.powerModeInterval = setInterval($(".lbcontainer.gs_lightbox_video").controller().callback("powerHourCheckVideoMode"), 1E3)
                    } else {
                        var h = this.player ? this.player.getPlaybackStatus() : null;
                        if (h)switch (h.status) {
                            case this.PLAY_STATUS_NONE:
                            case this.PLAY_STATUS_FAILED:
                            case this.PLAY_STATUS_COMPLETED:
                            case this.PLAY_STATUS_PAUSED:
                                if (h.activeSong) {
                                    this.playSong(h.activeSong.queueSongID);
                                    $.publish("gs.player.queue.change")
                                }
                                break
                        }
                    }
                    $.publish("gs.player.feature.change");
                    GS.getGuts().gaTrackEvent("player", "enablePowerMode")
                }, disablePowerMode:function () {
                    this.powerModeEnabled = false;
                    this.videoModeEnabled && clearInterval(this.powerModeInterval);
                    $.publish("gs.player.feature.change");
                    GS.getGuts().gaTrackEvent("player", "disablePowerMode")
                }, "#queue_clear_button click":function () {
                    var h = this.getCurrentQueue();
                    if (h.hasRestoreQueue)b.restoreQueue(); else if (h && h.songs && h.songs.length > 0) {
                        b.clearQueue();
                        b.setQueue("off", false)
                    }
                }, queueSongToHtml:function () {
                    return function (h, n, q) {
                        var s = "paused", w = [], o = b.getCurrentQueue(), u = "", z = h.fromLibrary ? "inLibrary" : "", D = h.isFavorite ? "isFavorite" : "", B = "", E = "";
                        if (h.context.data && h.context.data.hasOwnProperty("CoverArtFilename"))h.CoverArtFilename = h.context.data.CoverArtFilename;
                        if (o.activeSong && h.queueSongID === o.activeSong.queueSongID) {
                            u += " active";
                            if (b.isPlaying)s = ""
                        }
                        if (o.autoplayEnabled) {
                            if (h.autoplayVote === -1 || n === q - 1 && h.source !== "user")u += " suggestion";
                            if (h.autoplayVote ===
                                    1 || h.autoplayVote === 0 && h.source === "user") {
                                B = "active";
                                E = ""
                            } else if (h.autoplayVote === -1) {
                                E = "active";
                                B = ""
                            }
                        }
                        w.push('<div id="', h.queueSongID, '" rel="', h.SongID, '" class="', u, ' queueSong">', '<a class="remove" title="', $.localize.getString("removeSong"), '"></a>', '<div class="albumart">', '<div class="radio_options ', o && o.autoplayEnabled ? "active" : "", '">', '<a class="smile ', B, '" title="', $.localize.getString("QUEUE_ITEM_SMILE"), '"></a>', '<a class="frown ', E, '" title="', $.localize.getString("QUEUE_ITEM_FROWN"),
                                '"></a>', "</div>", '<div class="song_options ', z, " ", D, '">', '<a class="collection ', D, ' textToggle" title="', $.localize.getString("QUEUE_ADD_SONG_FAVORITE_TITLE"), '"></a>', '<a class="options selectbox" title="', $.localize.getString("QUEUE_ITEM_OPTIONS"), '"></a>', "</div>", '<a class="play ', s, '" rel="', h.queueSongID, '"></a>', '<img src="', h.getImageURL(b.queueSize == "l" ? 90 : 70), '" height="100%" width="100%" />', "</div>", '<a title="', _.cleanText(h.SongName), '" class="queueSong_name song ellipsis" rel="',
                                h.SongID, '">', _.cleanText(h.SongName), "</a>", '<a href="', _.cleanUrl(h.ArtistName, h.ArtistID, "artist"), '" title="', _.cleanText(h.ArtistName), '" class="queueSong_artist artist ellipsis">', _.cleanText(h.ArtistName), "</a>", "</div>");
                        return w.join("")
                    }
                }, smallQueueSongToHtml:function (h, n, q) {
                    var s = "paused", w = [], o = b.getCurrentQueue(), u = "", z = h.fromLibrary ? "inLibrary" : "", D = h.isFavorite ? "isFavorite" : "";
                    if (h.context.data && h.context.data.hasOwnProperty("CoverArtFilename"))h.CoverArtFilename = h.context.data.CoverArtFilename;
                    if (o.activeSong && h.queueSongID === o.activeSong.queueSongID) {
                        u += " active";
                        if (b.isPlaying)s = ""
                    }
                    if (o.autoplayEnabled)if (h.autoplayVote === -1 || n === q - 1 && h.source !== "user")u += " suggestion";
                    w.push('<div id="', h.queueSongID, '" rel="', h.SongID, '" class="', u, ' queueSong small">', '<div class="albumart ', z, " ", D, '">', '<a class="play ', s, '" rel="', h.queueSongID, '"></a>', '<a class="collection ', D, ' textToggle" title="', $.localize.getString("QUEUE_ADD_SONG_FAVORITE_TITLE"), '"></a>', '<a class="options selectbox" title="',
                            $.localize.getString("QUEUE_ITEM_OPTIONS"), '"></a>', '<img src="', h.getImageURL(70), '" height="33" width="33" />', "</div>", '<a class="remove" title="', $.localize.getString("removeSong"), '"></a>', '<a title="', _.cleanText(h.SongName), '" class="queueSong_name song ellipsis" rel="', h.SongID, '">', _.cleanText(h.SongName), "</a>", '<a href="', _.cleanUrl(h.ArtistName, h.ArtistID, "artist"), '" title="', _.cleanText(h.ArtistName), '" class="queueSong_artist artist ellipsis">', _.cleanText(h.ArtistName), "</a>", "</div>");
                    return w.join("")
                }})
})();

