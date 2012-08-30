(function (c) {
    GS.Models.Base.extend("GS.Models.UserSettings", {NOTIF_EMAIL_USER_FOLLOW:1, NOTIF_EMAIL_INVITE_SIGNUP:2, NOTIF_EMAIL_PLAYLIST_SUBSCRIBE:16, NOTIF_EMAIL_NEW_FEATURE:4096, NOTIF_CIVICSCIENCE:32768, NOTIF_EMAIL_KINESIS:65536, RSS_LISTENS:2, RSS_FAVORITES:1}, {UserID:0, local:{restoreQueue:0, lowerQuality:0, noPrefetch:0, playPauseFade:0, crossfadeAmount:5E3, crossfadeEnabled:0, tooltips:0, persistShuffle:1, lastShuffle:0, persistSidebar:0, disablePlayerShortcuts:0}, FName:"", Email:"", Country:"", Zip:"", Sex:"",
        TSDOB:"", FeedsDisabled:0, NotificationEmailPrefs:0, emailNotifications:{userFollow:true, inviteSignup:true, playlistSubscribe:true, newFeature:true, civicScience:true, kinesis:true}, rssFeeds:{listens:true, favorites:true}, _hasLoadedSettings:false, init:function (a) {
            this._super(a);
            a = GS.store.get("player.restoreQueue");
            if (!_.defined(a)) {
                a = GS.store.get("player.restoreQueue" + this.UserID);
                if (_.defined(a))try {
                    GS.store.set("player.restoreQueue", a)
                } catch (b) {
                }
            }
            this.local.restoreQueue = _.orEqual(a, 0);
            this.local.lowerQuality =
                    _.orEqual(GS.store.get("player.lowerQuality" + this.UserID), 0);
            this.local.noPrefetch = _.orEqual(GS.store.get("player.noPrefetch" + this.UserID), 0);
            this.local.playPauseFade = _.orEqual(GS.store.get("player.playPauseFade" + this.UserID), 0);
            this.local.crossfadeAmount = _.orEqual(GS.store.get("player.crossfadeAmount" + this.UserID), 5E3);
            this.local.crossfadeEnabled = _.orEqual(GS.store.get("player.crossfadeEnabled" + this.UserID), 0);
            this.local.lastShuffle = _.orEqual(GS.store.get("player.lastShuffle" + this.UserID), 0);
            this.local.persistShuffle =
                    _.orEqual(GS.store.get("player.persistShuffle" + this.UserID), 1);
            this.local.tooltips = _.orEqual(GS.store.get("user.tooltips" + this.UserID), 0);
            this.local.themeFlags = _.orEqual(GS.store.get("user.themeFlags" + this.UserID), 0);
            this.local.persistSidebar = _.orEqual(GS.store.get("user.persistSidebar" + this.UserID), window.innerWidth > 1200 ? 1 : 0);
            this.local.disablePlayerShortcuts = _.orEqual(GS.store.get("user.disablePlayerShortcuts" + this.UserID), 0);
            this.applyUserSettings(this.local);
            if (this.UserID <= 0)this._hasLoadedSettings =
                    true
        }, applyUserSettings:function (a) {
            if (a.disablePlayerShortcuts)c(document).unbind(".playerShortcut"); else GS.player && GS.player.addShortcuts()
        }, getUserSettings:function (a, b) {
            if (this.UserID)if (this._hasLoadedSettings)c.isFunction(a) && a(this); else GS.service.getUserSettings(this.callback(this._onSettingsSuccess, a), this.callback(this._onSettingsFailed, b))
        }, _onSettingsSuccess:function (a, b) {
            if (b.hasOwnProperty("userInfo")) {
                c.extend(this, b.userInfo);
                if (this.hasOwnProperty("LName") && this.hasOwnProperty("FName")) {
                    var d =
                            this.LName, f = this.FName;
                    this.LName = c.trim(this.LName);
                    this.FName = c.trim(this.FName);
                    if (this.LName) {
                        this.FName += " " + this.LName;
                        this.FName = c.trim(this.FName)
                    }
                    delete this.LName;
                    var g = {};
                    if (this.FName !== f)g.FName = this.FName;
                    if (d)g.LName = "";
                    _.isEmpty(g) || GS.service.changeUserInfoEx(g)
                }
                this.NotificationEmailPrefs = parseInt(this.NotificationEmailPrefs, 10);
                this.FeedsDisabled = parseInt(this.FeedsDisabled, 10);
                this._updateBitmaskProps()
            }
            this._hasLoadedSettings = true;
            c.isFunction(a) && a(this)
        }, _onSettingsFailed:function (a) {
            c.isFunction(a) &&
            a(this)
        }, _updateBitmaskProps:function () {
            this.emailNotifications = {userFollow:!(this.NotificationEmailPrefs & GS.Models.UserSettings.NOTIF_EMAIL_USER_FOLLOW), inviteSignup:!(this.NotificationEmailPrefs & GS.Models.UserSettings.NOTIF_EMAIL_INVITE_SIGNUP), playlistSubscribe:!(this.NotificationEmailPrefs & GS.Models.UserSettings.NOTIF_EMAIL_PLAYLIST_SUBSCRIBE), newFeature:!(this.NotificationEmailPrefs & GS.Models.UserSettings.NOTIF_EMAIL_NEW_FEATURE), civicScience:!(this.NotificationEmailPrefs & GS.Models.UserSettings.NOTIF_CIVICSCIENCE),
                kinesis:!(this.NotificationEmailPrefs & GS.Models.UserSettings.NOTIF_EMAIL_KINESIS)};
            this.rssFeeds = {listens:!(this.FeedsDisabled & GS.Models.UserSettings.RSS_LISTENS), favorites:!(this.FeedsDisabled & GS.Models.UserSettings.RSS_FAVORITES)}
        }, updateProfile:function (a, b, d) {
            a = c.extend({}, {FName:this.FName, Email:this.Email, Country:this.Country, Zip:this.Zip, Sex:this.Sex, TSDOB:this.TSDOB, PageName:GS.user.PathName}, a);
            if (this.UserID < 1)this._saveProfileFailed({statusCode:-1}); else {
                a.PageName === GS.user.PathName &&
                delete a.PageName;
                var f;
                for (f in a)a.hasOwnProperty(f) && a[f] == this[f] && delete a[f];
                if (_.isEmpty(a))this._saveProfileSuccess({statusCode:1}); else if ((a.hasOwnProperty("Email") || a.hasOwnProperty("PageName")) && !_.defined(a.password))GS.getLightbox().open("confirmPasswordProfile", {params:a, callback:b, errback:d}); else {
                    f = a.password;
                    delete a.password;
                    GS.service.changeUserInfoEx(a, f, this.callback(this._saveProfileSuccess, a, b, d), this.callback(this._saveProfileFailed, d))
                }
            }
        }, _saveProfileSuccess:function (a, b, d, f) {
            if (f && f.statusCode === 1) {
                c.extend(this, a);
                if (a.hasOwnProperty("PageName")) {
                    GS.router.deleteCachedPageName(GS.user.PathName);
                    a.PageName !== "" && GS.router.cachePageName(a.PageName, "user", GS.user.UserID);
                    GS.user.PathName = a.PageName;
                    c.publish("gs.auth.user.pathName")
                }
                c.isFunction(b) && b(f)
            } else this._saveProfileFailed(d, f)
        }, _saveProfileFailed:function (a, b) {
            c.isFunction(a) && a(b)
        }, changeNotificationSettings:function (a, b, d) {
            a = c.extend({}, this.emailNotifications, a);
            a = (a.userFollow ? 0 : GS.Models.UserSettings.NOTIF_EMAIL_USER_FOLLOW) |
                    (a.inviteSignup ? 0 : GS.Models.UserSettings.NOTIF_EMAIL_INVITE_SIGNUP) | (a.playlistSubscribe ? 0 : GS.Models.UserSettings.NOTIF_EMAIL_PLAYLIST_SUBSCRIBE) | (a.newFeature ? 0 : GS.Models.UserSettings.NOTIF_EMAIL_NEW_FEATURE) | (a.civicScience ? 0 : GS.Models.UserSettings.NOTIF_CIVICSCIENCE) | (a.kinesis ? 0 : GS.Models.UserSettings.NOTIF_EMAIL_KINESIS);
            if (this.UserID < 1)c.isFunction(d) && d("Not logged in"); else a === this.NotificationEmailPrefs ? this._notificationsSuccess(a, b, d, {statusCode:1}) : GS.service.changeNotificationSettings(a,
                    this.callback(this._notificationsSuccess, a, b, d), this.callback(this._notificationsFailed, d))
        }, _notificationsSuccess:function (a, b, d, f) {
            if (f && f.statusCode === 1) {
                this.NotificationEmailPrefs = a;
                this._updateBitmaskProps();
                c.isFunction(b) && b(f)
            } else this._notificationsFailed(d, f)
        }, _notificationsFailed:function (a, b) {
            c.isFunction(a) && a(b)
        }, changeRSSSettings:function (a, b, d) {
            a = c.extend({}, this.rssFeeds, a);
            a = (a.listens ? 0 : GS.Models.UserSettings.RSS_LISTENS) | (a.favorites ? 0 : GS.Models.UserSettings.RSS_FAVORITES);
            if (this.UserID <
                    1)c.isFunction(d) && d("Not logged in"); else a === this.FeedsDisabled ? this._rssSuccess(a, b, d, {statusCode:1}) : GS.service.changeFeedSettings(a, this.callback(this._notificationsSuccess, a, b, d), this.callback(this._notificationsFailed, d))
        }, _rssSuccess:function (a, b, d, f) {
            if (f && f.statusCode === 1) {
                this.FeedsDisabled = a;
                this._updateBitmaskProps();
                c.isFunction(b) && b(f)
            } else this._rssFailed(d, f)
        }, _rssFailed:function (a, b) {
            c.isFunction(a) && a(b)
        }, changeLocalSettings:function (a, b) {
            c.extend(this.local, a);
            GS.store.set("player.restoreQueue",
                    this.local.restoreQueue);
            GS.store.set("player.lowerQuality" + this.UserID, this.local.lowerQuality);
            GS.store.set("player.noPrefetch" + this.UserID, this.local.noPrefetch);
            GS.store.set("player.playPauseFade" + this.UserID, this.local.playPauseFade);
            GS.store.set("player.crossfadeAmount" + this.UserID, this.local.crossfadeAmount);
            GS.store.set("player.crossfadeEnabled" + this.UserID, this.local.crossfadeEnabled);
            GS.store.set("player.lastShuffle" + this.UserID, this.local.lastShuffle);
            GS.store.set("player.persistShuffle" +
                    this.UserID, this.local.persistShuffle);
            GS.store.set("user.tooltips" + this.UserID, this.local.tooltips);
            GS.store.set("user.themeFlags" + this.UserID, this.local.themeFlags);
            GS.store.set("user.persistSidebar" + this.UserID, this.local.persistSidebar);
            GS.store.set("user.disablePlayerShortcuts" + this.UserID, this.local.disablePlayerShortcuts);
            this.applyUserSettings(this.local);
            c.publish("gs.settings.local.update", this.local);
            c.isFunction(b) && b(this)
        }})
})(jQuery);

