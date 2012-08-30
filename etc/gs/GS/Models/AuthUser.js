(function (c) {
    GS.Models.User.extend("GS.Models.AuthUser", 
    {
        id:"AuthUserID", cache:{}, loggedOutPlaylistCount:0,
        wrap:function (a) {
            return this._super(a, false)
        }, wrapFromService:function (a) {
            return this.wrap(c.extend({}, a, {Email:a.Email || a.email, Sex:a.Sex || a.sex, UserID:a.UserID || a.userID, IsPremium:a.IsPremium || a.isPremium, FName:a.FName || a.fName, LName:a.LName || a.lName, TSDOB:a.TSDOB || a.tsDOB, Flags:a.Flags || a.flags, Username:a.Username || a.username, Privacy:_.orEqualEx(a.Privacy, a.privacy, 0)}))
        }
    },
    {
        authRealm:1, authToken:"",
        autoAutoplay:false, badAuthToken:false, favoritesLimit:500, librarySizeLimit:5E3, themeID:"", uploadsEnabled:0, UserID:-1, Username:"", Email:"", City:"", Country:"", State:"", TSDOB:"", Privacy:0, Flags:0, Points:0, settings:null, isLoggedIn:false, isAuth:true, artistsPlayed:[], defaultStations:["750", "12", "136", "3", "56", "67"], defaultFromService:null, searchVersion:"", promotions:{}, userFavoritesLoaded:false, userTrackingID:0, songPlays:0, notificationsFeed:null, PageNameData:{}, 
        init:function (a) {
            this._super(a);
            this.defaultFromService =
            {};
            this.refreshLibraryStatic = this.callback(this.refreshLibrary);
            this.library.songs = {};
            this.playlists = {};
            this.favorites = {songs:{}, albums:{}, artists:{}, playlists:{}, users:{}};
            this.sidebarLoaded = false;
            this.sidebar = {playlists:[], stations:[], subscribedPlaylists:[], songs:[], artists:[], albums:[], meta:{playlists:{}, stations:{}, subscribedPlaylists:{}, songs:{}, artists:{}, albums:{}}};
            this.settings = GS.Models.UserSettings.wrap({UserID:this.UserID});
            this._pointsDirty = true;
            this.Points = 0;
            if (this.UserID > 0) {
                this.isLoggedIn =
                        true;
                this.getPlaylists();
                this.getFavorites();
                this.getSidebar();
                this.getLibrary();
                this.handleLiveRamp();
                this.getPageNameData();
                this.notificationsFeed = GS.Models.NotificationsFeed.wrap({user:this})
            } else {
                this.isDirty = this.isLoggedIn = false;
                this.sidebarLoaded = true;
                this.sidebar.stations = this.defaultStations.concat()
            }
            this.artistsPlayed = GS.store.get("artistsPlayed" + this.UserID) || [];
            c.subscribe("gs.player.nowplaying", this.callback(this.onSongPlay));
            setTimeout(function () {
                        c.publish("gs.auth.stations.update")
                    },
                    10);
            var b = 0;
            if (this.Flags & GS.Models.User.FLAG_ANYWHERE)b = 8; else if (this.Flags & GS.Models.User.FLAG_PLUS)b = 6; else if (this.Flags & GS.Models.User.FLAG_LITE)b = 21; else if (this.IsPremium)b = 8;
            this.subscription = new GS.Models.Subscription({SubscriptionTypeID:b});
            setTimeout(this.callback(function () {
                GS.user.UserID === a.UserID && this.checkVipExpiring()
            }), 54E4);
            this.searchVersion = "";
            this.hipsterFailCount = 0
        }, uploadComplete:function () {
            var a = this.toUrl("music");
            this.library.reloadLibrary(function () {
                GS.router.setHash(a)
            })
        },
        getNotifications:function (a, b) {
            this.UserID > 0 && this.notificationsFeed.getFeed(a, b)
        }, setLastSeenNotification:function () {
            store.set(this.UserID + "_notificationTimestamp", this.notificationsFeed.events[0] ? this.notificationsFeed.events[0].timestamp : 0)
        }, getLastSeenNotification:function () {
            return store.get(this.UserID + "_notificationTimestamp")
        }, onSongPlay:function (a) {
            if (this === GS.user) {
                if (a && a.ArtistID) {
                    var b = this.artistsPlayed.indexOf(a.ArtistID);
                    b != -1 && this.artistsPlayed.splice(b, 1);
                    this.artistsPlayed.unshift(a.ArtistID);
                    this.artistsPlayed.splice(999, 1)
                }
                this.songPlays++;
                this.songPlays == 10 && this.UserID <= 0 && GS.page.activePageName != "SignupController" && GS.getLightbox().open("signupNow")
            }
        }, storeData:function () {
            var a;
            if (_.isEmpty(this.library.songs))a = null; else {
                a = {currentPage:this.library.currentPage, songsLoaded:this.library.songsLoaded, userID:this.library.userID, lastModified:this.library.lastModified, songs:{}};
                for (var b in this.library.songs)if (this.library.songs.hasOwnProperty(b))a.songs[b] = GS.Models.Song.archive(this.library.songs[b])
            }
            this.settings.changeLocalSettings({});
            GS.store.set("artistsPlayed" + this.UserID, this.artistsPlayed);
            GS.store.set("library" + this.UserID, a)
        }, clearData:function () {
            GS.store.remove("library" + this.UserID)
        }, createPlaylist:function (a, b, d, f, g, k) {
            k = _.orEqual(k, true);
            b = _.orEqual(b, []);
            if (this.isLoggedIn)GS.service.createPlaylist(a, b, d, this.callback(["createPlaylistSuccess"], {callback:f, name:a, songIDs:b, description:d, notify:k}), g); else {
                GS.Models.AuthUser.loggedOutPlaylistCount++;
                d = GS.Models.Playlist.wrap({PlaylistID:-GS.Models.AuthUser.loggedOutPlaylistCount,
                    PlaylistName:a, UserName:this.Name, UserID:this.UserID, songsLoaded:true, TSAdded:(new Date).format("Y-m-d G:i:s"), Description:d});
                d.addSongs(b, 0, true);
                this.playlists[d.PlaylistID] = d;
                this.isDirty = true;
                c.publish("gs.auth.playlists.update");
                c.publish("gs.auth.playlists.add", d);
                k && c.publish("gs.notification.playlist.create", d);
                f(d)
            }
            GS.getGuts().logEvent("playlistCreated", {playlistName:a});
            GS.getGuts().gaTrackEvent("user", "newPlaylist")
        }, createPlaylistSuccess:function (a, b) {
            var d = GS.Models.Playlist.wrap({PlaylistID:b,
                PlaylistName:a.name, Description:a.description, UserID:this.UserID, UserName:this.Name, FName:this.Name, TSAdded:(new Date).format("Y-m-d G:i:s"), NumSongs:a.songIDs.length});
            this.playlists[d.PlaylistID] = d;
            c.publish("gs.auth.playlists.update");
            a.notify && c.publish("gs.notification.playlist.create", d);
            a.callback(d)
        }, deletePlaylist:function (a, b) {
            var d = GS.Models.Playlist.getOneFromCache(a);
            if (d && d.UserID === this.UserID) {
                b = _.orEqual(b, true);
                if (this.isLoggedIn)GS.service.deletePlaylist(d.PlaylistID, d.PlaylistName,
                        this.callback(function () {
                            d.isDeleted = true;
                            this.removeFromShortcuts("playlist", d.PlaylistID, false);
                            delete this.playlists[d.PlaylistID];
                            c.publish("gs.playlist.view.update", d);
                            c.publish("gs.auth.playlists.update");
                            c.publish("gs.user.playlist.remove");
                            if (b) {
                                var f = (new GS.Models.DataString(c.localize.getString("POPUP_DELETE_PLAYLIST_MSG"), {playlist:d.PlaylistName})).render();
                                c.publish("gs.notification", {type:"notice", message:f})
                            }
                        }), this.callback(function () {
                            d.isDeleted = false;
                            if (b) {
                                var f = (new GS.Models.DataString(c.localize.getString("POPUP_FAIL_DELETE_PLAYLIST_MSG"),
                                        {playlist:d.PlaylistName})).render();
                                c.publish("gs.notification", {type:"error", message:f})
                            }
                        })); else {
                    d.isDeleted = true;
                    this.removeFromShortcuts("playlist", d.PlaylistID, false);
                    delete this.playlists[d.PlaylistID];
                    c.publish("gs.playlist.view.update", d);
                    c.publish("gs.auth.playlists.update");
                    c.publish("gs.user.playlist.remove");
                    b && c.publish("gs.notification", {type:"notice", message:c.localize.getString("NOTIFICATION_PLAYLIST_DELETED")})
                }
            }
            GS.getGuts().gaTrackEvent("user", "deletePlaylist")
        }, restorePlaylist:function (a, b) {
            var d = GS.Models.Playlist.getOneFromCache(a);
            if (d && d.UserID === this.UserID) {
                b = _.orEqual(b, true);
                if (this.isLoggedIn)GS.service.playlistUndelete(d.PlaylistID, this.callback(function () {
                    d.isDeleted = false;
                    this.playlists[d.PlaylistID] = d;
                    c.publish("gs.playlist.view.update", d);
                    b && c.publish("gs.notification", {type:"notice", message:c.localize.getString("NOTIFICATION_PLAYLIST_RESTORED")})
                }), function () {
                    b && c.publish("gs.notification", {type:"error", message:c.localize.getString("NOTIFICATION_PLAYLIST_RESTORE_FAIL")})
                });
                else {
                    d.isDeleted = false;
                    this.playlists[d.PlaylistID] = d;
                    c.publish("gs.playlist.view.update", d);
                    b && c.publish("gs.notification", {type:"notice", message:c.localize.getString("NOTIFICATION_PLAYLIST_RESTORED")})
                }
            }
            GS.getGuts().gaTrackEvent("user", "restorePlaylist")
        }, getSidebar:function () {
            GS.service.getUserSidebar(this.callback("loadSidebar"))
        }, loadSidebar:function (a) {
            this.sidebarLoaded = true;
            if (c.isArray(a.meta))a.meta = {};
            this.sidebar = c.extend(true, this.sidebar, a);
            c.publish("gs.auth.sidebar.loaded");
            if (this.sidebar.stations.length ===
                    0) {
                var b = this;
                _.forEach(this.defaultStations, function (d) {
                    b.addToShortcuts("station", d, "", false)
                })
            }
        }, getFavorites:function () {
            var a = this;
            _.forEach(["Albums", "Artists", "Playlists", "Songs", "Users"], function (b) {
                GS.service.getFavorites(a.UserID, b, false, a.callback("load" + b + "Favorites"))
            })
        }, loadAlbumsFavorites:function (a) {
            _.forEach(this.favorites.albums, function (b) {
                a.push(b)
            });
            this._super(a);
            c.publish("gs.auth.favorites.albums.update")
        }, loadArtistsFavorites:function (a) {
            _.forEach(this.favorites.artists, function (b) {
                a.push(b)
            });
            this._super(a);
            c.publish("gs.auth.favorites.artists.update")
        }, loadPlaylistsFavorites:function (a) {
            _.forEach(this.favorites.playlists, function (b) {
                a.push(b)
            });
            this._super(a);
            c.publish("gs.auth.favorites.playlists.update")
        }, loadSongsFavorites:function (a) {
            _.forEach(this.favorites.songs, function (b) {
                a.push(b)
            });
            this._super(a);
            c.publish("gs.auth.favorites.songs.update")
        }, loadUsersFavorites:function (a) {
            _.forEach(this.favorites.users, function (b) {
                a.push(b)
            });
            this._super(a);
            this.userFavoritesLoaded = true;
            c.publish("gs.auth.favorites.users.update")
        },
        getLibrary:function () {
            var a = GS.store.get("library" + this.UserID);
            if (a) {
                var b = a.songs;
                delete a.songs;
                this.library = GS.Models.Library.wrap(a);
                for (var d in b)if (b.hasOwnProperty(d)) {
                    b[d] = GS.Models.Song.unarchive(b[d]);
                    b[d].fromLibrary = 1
                }
                a = this.library.songs;
                this.library.songs = GS.Models.Song.wrapCollectionInObject(b, {TSAdded:"", TSFavorited:""});
                this.library.songsLoaded = true;
                _.forEach(a, function (f) {
                    _.defined(this.library.songs[f.SongID]) || (this.library.songs[f.SongID] = f)
                }, this);
                GS.service.userGetLibraryTSModified(this.UserID,
                        this.callback("refreshLibrary"))
            } else {
                this.library = GS.Models.Library.wrap({userID:this.UserID});
                this.library.getSongs(this.callback("loadLibrary"), false)
            }
        }, refreshLibrary:function (a) {
            a.TSModified > this.library.lastModified ? this.library.reloadLibrary(function () {
                this.propogateSongsFavorites();
                c.publish("gs.auth.library.update")
            }, null, false) : c.publish("gs.auth.library.update")
        }, loadLibrary:function (a) {
            for (var b = 0; b < a.length; b++)this.library.songs[a[b].SongID] = a[b];
            c.publish("gs.auth.library.update");
            this.library.songsLoaded || this.library.getSongs(this.callback("loadLibrary"), false)
        }, addToSongFavorites:function (a, b) {
            b = _.orEqual(b, true);
            if (!this.favorites.songs[a]) {
                var d = GS.Models.Song.getOneFromCache(a);
                if (!d)throw"AUTH.ADDTOSONGFAVES. SONGID NOT IN CACHE: " + a;
                d = d.dupe();
                d.isFavorite = 1;
                d.fromLibrary = 1;
                d.TSFavorited = (new Date).format("Y-m-d G:i:s");
                if (!_.defined(d.TSAdded) || d.TSAdded === "")d.TSAdded = d.TSFavorited;
                if (this.library.songs[a])this.library.songs[a] = d; else {
                    this.library.songs[a] = d;
                    c.publish("gs.auth.library.add",
                            d)
                }
                this.favorites.songs[a] = d.dupe();
                GS.getGuts().logEvent("objectFavorited", {type:"song", id:a});
                c.publish("gs.auth.song.update", d);
                c.publish("gs.auth.favorites.songs.add", d);
                b && c.publish("gs.notification.favorite.song", d);
                if (this.isLoggedIn)GS.service.favorite("Song", d.SongID, d.getDetailsForFeeds(), null, this.callback(this._favoriteFail, "Song", d)); else this.isDirty = true;
                GS.getGuts().gaTrackEvent("user", "favoriteSong")
            }
        }, addToPlaylistFavorites:function (a, b) {
            b = _.orEqual(b, true);
            if (!this.favorites.playlists[a]) {
                var d =
                        GS.Models.Playlist.getOneFromCache(a);
                if (!d)throw"AUTH.ADDTOPLAYLISTFAVES. PLAYLISTID NOT IN CACHE: " + a;
                d.isFavorite = 1;
                d.TSFavorited = (new Date).format("Y-m-d G:i:s");
                this.favorites.playlists[a] = d;
                GS.getGuts().logEvent("objectFavorited", {type:"playlist", id:a});
                this.addToShortcuts("playlist", a, d.PlaylistName, false);
                c.publish("gs.auth.favorites.playlists.update");
                c.publish("gs.auth.playlist.update", d);
                c.publish("gs.auth.favorite.playlist", d);
                c.publish("gs.playlist.view.update", this);
                b && c.publish("gs.notification.favorite.playlist",
                        d);
                if (this.isLoggedIn)GS.service.favorite("Playlist", d.PlaylistID, d.getDetailsForFeeds(), null, this.callback(this._favoriteFail, "Playlist", d)); else this.isDirty = true;
                GS.getGuts().gaTrackEvent("user", "favoritePlaylist")
            }
        }, removeFromPlaylistFavorites:function (a, b) {
            b = _.orEqual(b, true);
            var d = GS.Models.Playlist.getOneFromCache(a);
            if (d) {
                this.removeFromShortcuts("playlist", d.PlaylistID, false);
                d.isFavorite = 0;
                GS.Models.Playlist.cache[a] = d;
                delete this.favorites.playlists[a];
                GS.getGuts().logEvent("objectUnfavorited",
                        {type:"playlist", id:a});
                c.publish("gs.auth.favorites.playlists.update");
                c.publish("gs.auth.playlist.update", d);
                c.publish("gs.playlist.view.update", this);
                this.isLoggedIn && GS.service.unfavorite("Playlist", a);
                b && c.publish("gs.notification", {type:"notify", message:_.printf("NOTIFICATION_PLAYLIST_UNSUBSCRIBED", {playlist:d.PlaylistName})});
                GS.getGuts().gaTrackEvent("user", "unfavoritePlaylist")
            }
        }, addToArtistFavorites:function (a, b) {
            b = _.orEqual(b, true);
            if (!this.favorites.artists[a]) {
                var d = GS.Models.Artist.getOneFromCache(a);
                if (!d)throw"AUTH.ADDTOARTSTTFAVES. ARTISTID NOT IN CACHE: " + a;
                d.isFavorite = 1;
                d.TSFavorited = (new Date).format("Y-m-d G:i:s");
                this.favorites.artists[a] = d;
                GS.getGuts().logEvent("objectFavorited", {type:"artist", id:a});
                c.publish("gs.auth.favorites.artists.update");
                b && c.publish("gs.notification.favorite.artist", d);
                if (this.isLoggedIn)GS.service.favorite("Artist", d.ArtistID, d.getDetailsForFeeds(), null, this.callback(this._favoriteFail, "Artist", d)); else this.isDirty = true;
                GS.getGuts().gaTrackEvent("user", "favoriteArtist")
            }
        },
        removeFromArtistFavorites:function (a, b) {
            b = _.orEqual(b, true);
            var d = GS.Models.Artist.getOneFromCache(a);
            if (d) {
                d.isFavorite = 0;
                GS.Models.Artist.cache[a] = d;
                delete this.favorites.artists[a];
                GS.getGuts().logEvent("objectUnfavorited", {type:"artist", id:a});
                c.publish("gs.auth.favorites.artists.update");
                this.isLoggedIn && GS.service.unfavorite("Artist", a);
                b && c.publish("gs.notification", {type:"notify", message:c.localize.getString("NOTIFICATION_ARTIST_UNSUBSCRIBED")});
                GS.getGuts().gaTrackEvent("user", "unfavoriteArtist")
            }
        },
        removeFromSongFavorites:function (a, b) {
            b = _.orEqual(b, true);
            var d = this.favorites.songs[a];
            if (d) {
                d.isFavorite = 0;
                delete this.favorites.songs[a];
                GS.getGuts().logEvent("objectUnfavorited", {type:"song", id:a});
                this.library.songs[a] = d.dupe();
                c.publish("gs.auth.song.update", d);
                c.publish("gs.auth.favorites.songs.remove", d);
                this.isLoggedIn && GS.service.unfavorite("Song", d.SongID);
                if (b) {
                    d = {songLink:"<a class='songLink' rel='" + d.SongID + "'>" + d.SongName + "</a>", artistLink:"<a href='" + _.cleanUrl(d.ArtistName, d.ArtistID,
                            "artist", null, null) + "'>" + d.ArtistName + "</a>"};
                    c.publish("gs.notification", {type:"notify", message:(new GS.Models.DataString(c.localize.getString("NOTIF_UNFAVORITED_SONG"), d)).render()})
                }
                GS.getGuts().gaTrackEvent("user", "unfavoriteSong")
            }
        }, addToUserFavorites:function (a, b) {
            b = _.orEqual(b, true);
            if (!(!a || this.favorites.users[a])) {
                var d = GS.Models.User.getOneFromCache(a);
                if (!d || this.UserID === d.UserID)this._favoriteFail("User", null); else {
                    d.isFavorite = 1;
                    this.favorites.users[a] = d;
                    GS.getGuts().logEvent("objectFavorited",
                            {type:"user", id:a});
                    c.publish("gs.auth.favorites.users.update");
                    c.publish("gs.auth.user.update", d);
                    c.publish("gs.auth.favorite.user", d);
                    b && c.publish("gs.notification.favorite.user", d);
                    if (this.isLoggedIn)GS.service.favorite("User", d.UserID, d.getDetailsForFeeds(), null, this.callback(this._favoriteFail, "User", d)); else this.isDirty = true;
                    this.communityFeed.isDirty = true;
                    GS.getGuts().gaTrackEvent("user", "followUser")
                }
            }
        }, removeFromUserFavorites:function (a) {
            var b = GS.Models.User.getOneFromCache(a);
            if (!(!b ||
                    this.UserID === b.UserID)) {
                b.isFavorite = 0;
                GS.Models.User.cache[a] = b;
                delete this.favorites.users[a];
                GS.getGuts().logEvent("objectUnfavorited", {type:"user", id:a});
                c.publish("gs.auth.favorites.users.update");
                c.publish("gs.auth.user.update", b);
                this.communityFeed.isDirty = true;
                this.isLoggedIn && GS.service.unfavorite("User", b.UserID);
                GS.getGuts().gaTrackEvent("user", "unfollowUser")
            }
        }, changeFollowFlags:function (a) {
            if (this.isLoggedIn) {
                var b = false;
                for (var d in a)if (a.hasOwnProperty(d))if (!this.favorites.users[a[d].userID] ||
                        this.favorites.users[a[d].userID].FollowingFlags !== a[d].flags) {
                    b = true;
                    break
                }
                b ? GS.service.changeFollowFlags(a, this.callback("changeFollowFlagsSuccess", a), this.callback("changeFollowFlagsFail")) : this.changeFollowFlagsSuccess(a, {success:true})
            } else this.changeFollowFlagsFail()
        }, changeFollowFlagsSuccess:function (a, b) {
            if (b.success) {
                for (var d in a)if (a.hasOwnProperty(d))if (this.favorites.users[a[d].userID])this.favorites.users[a[d].userID].FollowingFlags = a[d].flags;
                this.communityFeed.isDirty = true;
                c.publish("gs.auth.favorites.users.update")
            } else this.changeFollowFlagsFail()
        },
        changeFollowFlagsFail:function () {
            c.publish("gs.notification", {message:c.localize.getString("SETTINGS_USER_HIDE_FAIL")})
        }, addToLibrary:function (a, b) {
            b = _.orEqual(b, true);
            var d = [];
            a = c.makeArray(a);
            for (var f = 0; f < a.length; f++) {
                var g = a[f];
                if (!this.library.songs[g]) {
                    var k = GS.Models.Song.getOneFromCache(g);
                    if (k) {
                        k = k.dupe();
                        k.fromLibrary = 1;
                        if (this.favorites.songs[g])k.isFavorite = 1;
                        if (!_.defined(k.TSAdded) || k.TSAdded === "")k.TSAdded = (new Date).format("Y-m-d G:i:s");
                        this.library.songs[g] = k;
                        var m = k.ArtistID, h =
                                k.AlbumID;
                        GS.getGuts().logEvent("songAddedToLibrary", {id:g, artistID:m, albumID:h});
                        c.publish("gs.auth.library.add", k);
                        c.publish("gs.auth.song.update", k);
                        d.push(k.getDetailsForFeeds())
                    }
                }
            }
            if (!_.isEmpty(d)) {
                if (this.isLoggedIn)GS.service.userAddSongsToLibrary(d, this.callback("addToLibrarySuccess", b, d), this.callback("addtoLibraryFailed")); else {
                    this.isDirty = true;
                    this.addToLibrarySuccess(b, d)
                }
                GS.getGuts().gaTrackEvent("user", "addLibrarySong")
            }
        }, addToLibrarySuccess:function (a, b, d) {
            a && c.publish("gs.auth.library.songsAdded",
                    {songs:b});
            if (d) {
                tsAdded = parseInt(d.Timestamps.newTSModified, 10);
                parseInt(d.Timestamps.oldTSModified, 10) > this.library.lastModified && this.library.reloadLibrary(function () {
                    c.publish("gs.auth.library.update")
                }, null, false)
            } else tsAdded = _.unixTime();
            this.library.lastModified = tsAdded;
            a = (new Date(tsAdded * 1E3)).format("Y-m-d G:i:s");
            for (d = 0; d < b.length; d++)this.library.songs[b[d].songID].TSAdded = a
        }, _favoriteFail:function (a, b) {
            var d = "NOTIFICATION_LIBRARY_ADD_FAIL", f = {};
            if (b)switch (a) {
                case "Song":
                    d += "_SONG";
                    f.name = b.SongName;
                    break;
                case "Playlist":
                    d += "_PLAYLIST";
                    f.name = b.PlaylistName;
                    break;
                case "User":
                    d += "_USER";
                    f.name = b.Name;
                    break
            }
            c.publish("gs.notification", {type:"error", message:(new GS.Models.DataString(c.localize.getString(d), f)).render()})
        }, addToLibraryFailed:function () {
            var a = {numSongs:songIDsToAdd.length};
            c.publish("gs.notification", {type:"error", message:(new GS.Models.DataString(c.localize.getString(songIDsToAdd.length > 1 ? "NOTIFICATION_LIBRARY_ADD_SONGS_FAIL" : "NOTIFICATION_LIBRARY_ADD_SONG_FAIL"),
                    a)).render()})
        }, removeFromLibrary:function (a, b) {
            b = _.orEqual(b, true);
            a = c.makeArray(a);
            for (var d = [], f = [], g = [], k = 0; k < a.length; k++) {
                var m = a[k], h = this.library.songs[m];
                if (h) {
                    delete this.library.songs[m];
                    GS.getGuts().logEvent("songRemovedFromLibrary", {id:m});
                    delete this.favorites.songs[m];
                    h.fromLibrary = 0;
                    h.isFavorite = 0;
                    GS.Models.Song.cache[h.SongID] = h;
                    c.publish("gs.auth.library.remove", h);
                    c.publish("gs.auth.song.update", h);
                    d.push(h.SongID);
                    f.push(h.ArtistID);
                    g.push(h.AlbumID)
                } else console.warn("removing song not in library!",
                        m)
            }
            if (!_.isEmpty(d)) {
                if (this.isLoggedIn) {
                    GS.service.userRemoveSongsFromLibrary(this.UserID, d, g, f, this.callback("removeFromLibrarySuccess", b, d), this.callback("removeFromLibraryFailed", h));
                    GS.service.unfavorite("Song", h.SongID)
                } else this.removeFromLibrarySuccess(b, d);
                GS.getGuts().gaTrackEvent("user", "removeLibrarySong")
            }
        }, removeFromLibrarySuccess:function (a, b, d) {
            if (d) {
                parseInt(d.Timestamps.oldTSModified, 10) > this.library.lastModified && this.library.reloadLibrary(function () {
                            c.publish("gs.auth.library.update")
                        },
                        null, false);
                this.library.lastModified = parseInt(d.Timestamps.newTSModified, 10)
            }
            if (a) {
                a = GS.Models.Song.getOneFromCache(b[0]);
                !a || !a.SongName || b.length > 1 ? c.publish("gs.notification", {message:_.getString("NOTIFICATION_LIBRARY_REMOVE_SONGS", {numSongs:b.length})}) : c.publish("gs.notification", {message:_.getString("NOTIFICATION_LIBRARY_REMOVE_SONG", {song:a.SongName})})
            }
        }, removeFromLibraryFailed:function () {
            c.publish("gs.notification", {type:"error", message:c.localize.getString("NOTIFICATION_LIBRARY_REMOVE_FAIL")})
        },
        getIsShortcut:function (a, b) {
            if (!b || !a)return false;
            a = a.toLowerCase();
            b = b.toString();
            switch (a) {
                case "playlist":
                    return this.sidebar.playlists.indexOf(b) > -1 || this.sidebar.subscribedPlaylists.indexOf(b) > -1;
                case "station":
                    return this.sidebar.stations.indexOf(b) > -1;
                case "song":
                    return this.sidebar.songs.indexOf(b) > -1;
                case "artist":
                    return this.sidebar.artists.indexOf(b) > -1;
                case "album":
                    return this.sidebar.albums.indexOf(b) > -1
            }
            return false
        }, addToShortcuts:function (a, b, d, f) {
            f = _.orEqual(f, true);
            a = a.toLowerCase();
            var g = b.toString();
            switch (a) {
                case "playlist":
                    a = GS.Models.Playlist.getOneFromCache(b);
                    if (!a)return;
                    a = a.UserID === this.UserID ? "playlists" : "subscribedPlaylists";
                    break;
                case "station":
                case "song":
                case "artist":
                case "album":
                    a = a + "s";
                    break;
                default:
                    return
            }
            if (this.sidebar[a].indexOf(g) === -1) {
                this.sidebar[a].unshift(g);
                this.sidebar.meta[a][b] = d;
                c.publish("gs.auth.pinboard.update", {type:a});
                if (this.isLoggedIn)GS.service.addShortcutToUserSidebar(a, b, d, this.callback(this._addShortcutSuccess, a, b, f), this.callback(this._addShortcutFailed,
                        a, b, f)); else {
                    this.isDirty = true;
                    this._addShortcutSuccess(a, b, f, {})
                }
                GS.getGuts().gaTrackEvent("user", "addShortcut")
            }
        }, _addShortcutSuccess:function (a, b, d) {
            var f, g = {};
            switch (a) {
                case "playlists":
                case "subscribedPlaylists":
                    if (a = GS.Models.Playlist.getOneFromCache(b)) {
                        f = "NOTIFICATION_PLAYLIST_PINBOARD_ADD_SUCCESS";
                        g.playlist = a.PlaylistName;
                        c.publish("gs.playlist.view.update", a)
                    }
                    break;
                case "stations":
                    a = GS.Models.Station.getOneFromCache(b);
                    f = "NOTIFICATION_STATION_PINBOARD_ADD_SUCCESS";
                    g.station = c.localize.getString(a.StationTitle);
                    break;
                case "songs":
                    if (a = GS.Models.Song.getOneFromCache(b)) {
                        f = "NOTIFICATION_SONG_PINBOARD_ADD_SUCCESS";
                        g.song = a.SongName
                    }
                    break;
                case "artists":
                    if (a = GS.Models.Artist.getOneFromCache(b)) {
                        f = "NOTIFICATION_ARTIST_PINBOARD_ADD_SUCCESS";
                        g.artist = a.ArtistName
                    }
                    break;
                case "albums":
                    if (a = GS.Models.Album.getOneFromCache(b)) {
                        f = "NOTIFICATION_ALBUM_PINBOARD_ADD_SUCCESS";
                        g.album = a.AlbumName
                    }
                    break
            }
            if (d && f) {
                d = new GS.Models.DataString(c.localize.getString(f), g);
                c.publish("gs.notification", {type:"notice", message:d.render()})
            }
        },
        _addShortcutFailed:function (a, b, d) {
            var f, g = {}, k = this.sidebar[a].indexOf(b.toString());
            if (k != -1) {
                this.sidebar[a].splice(k, 1);
                c.publish("gs.auth.pinboard.update", {type:a})
            }
            switch (a) {
                case "playlists":
                case "subscribedPlaylists":
                    if (a = GS.Models.Playlist.getOneFromCache(b)) {
                        f = "NOTIFICATION_PLAYLIST_PINBOARD_ADD_FAILED";
                        g.playlist = a.PlaylistName;
                        c.publish("gs.playlist.view.update", a)
                    }
                    break;
                case "stations":
                    a = GS.Models.Station.getOneFromCache(b);
                    f = "NOTIFICATION_STATION_PINBOARD_ADD_FAILED";
                    g.station = c.localize.getString(a.StationTitle);
                    break;
                case "songs":
                    if (a = GS.Models.Song.getOneFromCache(b)) {
                        f = "NOTIFICATION_SONG_PINBOARD_ADD_FAILED";
                        g.song = a.SongName
                    }
                    break;
                case "artists":
                    if (a = GS.Models.Artist.getOneFromCache(b)) {
                        f = "NOTIFICATION_ARTIST_PINBOARD_ADD_FAILED";
                        g.artist = a.ArtistName
                    }
                    break;
                case "albums":
                    if (a = GS.Models.Album.getOneFromCache(b)) {
                        f = "NOTIFICATION_ALBUM_PINBOARD_ADD_FAILED";
                        g.album = a.AlbumName
                    }
                    break
            }
            if (d && f) {
                d = new GS.Models.DataString(c.localize.getString(f), g);
                c.publish("gs.notification", {type:"error", message:d.render()})
            }
        },
        removeFromShortcuts:function (a, b, d) {
            d = _.orEqual(d, true);
            switch (a) {
                case "playlist":
                    a = GS.Models.Playlist.getOneFromCache(b);
                    if (!a)return;
                    a = a.UserID === this.UserID ? "playlists" : "subscribedPlaylists";
                    break;
                case "station":
                case "song":
                case "artist":
                case "album":
                    a = a + "s";
                    break;
                default:
                    return
            }
            var f = this.sidebar[a].indexOf(b.toString());
            if (f != -1) {
                this.sidebar[a].splice(f, 1);
                c.publish("gs.auth.pinboard.update", {type:a});
                if (this.isLoggedIn)GS.service.removeShortcutFromUserSidebar(a, b, this.callback(this._removeShortcutSuccess,
                        a, b, d), this.callback(this._removeShortcutFailed, a, b, f, d)); else {
                    this.isDirty = true;
                    this._removeShortcutSuccess(a, b, d, {})
                }
                GS.getGuts().gaTrackEvent("user", "removeShortcut")
            }
        }, _removeShortcutSuccess:function (a, b, d) {
            var f, g = {};
            switch (a) {
                case "playlists":
                case "subscribedPlaylists":
                    if (a = GS.Models.Playlist.getOneFromCache(b)) {
                        f = "NOTIFICATION_PLAYLIST_PINBOARD_REMOVE_SUCCESS";
                        g.playlist = a.PlaylistName;
                        c.publish("gs.playlist.view.update", a)
                    }
                    break;
                case "stations":
                    a = GS.Models.Station.getOneFromCache(b);
                    f = "NOTIFICATION_STATION_PINBOARD_REMOVE_SUCCESS";
                    g.station = c.localize.getString(a.StationTitle);
                    break;
                case "songs":
                    if (a = GS.Models.Song.getOneFromCache(b)) {
                        f = "NOTIFICATION_SONG_PINBOARD_REMOVE_SUCCESS";
                        g.song = a.SongName
                    }
                    break;
                case "artists":
                    if (a = GS.Models.Artist.getOneFromCache(b)) {
                        f = "NOTIFICATION_ARTIST_PINBOARD_REMOVE_SUCCESS";
                        g.artist = a.ArtistName
                    }
                    break;
                case "albums":
                    if (a = GS.Models.Album.getOneFromCache(b)) {
                        f = "NOTIFICATION_ALBUM_PINBOARD_REMOVE_SUCCESS";
                        g.album = a.AlbumName
                    }
                    break
            }
            if (d && f) {
                d = new GS.Models.DataString(c.localize.getString(f), g);
                c.publish("gs.notification",
                        {type:"notice", message:d.render()})
            }
        }, _removeShortcutFailed:function (a, b, d, f) {
            var g, k, m = {};
            if (d < 0)d = 0;
            switch (a) {
                case "playlists":
                case "subscribedPlaylists":
                    if (g = GS.Models.Playlist.getOneFromCache(b)) {
                        k = "NOTIFICATION_PLAYLIST_PINBOARD_REMOVE_FAILED";
                        m.playlist = g.PlaylistName;
                        c.publish("gs.playlist.view.update", g)
                    }
                    break;
                case "stations":
                    g = GS.Models.Station.getOneFromCache(b);
                    k = "NOTIFICATION_STATION_PINBOARD_REMOVE_FAILED";
                    m.station = c.localize.getString(g.StationTitle);
                    break;
                case "songs":
                    if (g = GS.Models.Song.getOneFromCache(b)) {
                        k =
                                "NOTIFICATION_SONG_PINBOARD_REMOVE_FAILED";
                        m.song = g.SongName
                    }
                    break;
                case "artists":
                    if (g = GS.Models.Artist.getOneFromCache(b)) {
                        k = "NOTIFICATION_ARTIST_PINBOARD_REMOVE_FAILED";
                        m.artist = g.ArtistName
                    }
                    break;
                case "albums":
                    if (g = GS.Models.Album.getOneFromCache(b)) {
                        k = "NOTIFICATION_ALBUM_PINBOARD_REMOVE_FAILED";
                        m.album = g.AlbumName
                    }
                    break
            }
            if (d != -1) {
                this.sidebar[a].splice(d, 0, b.toString());
                c.publish("gs.auth.pinboard.update", {type:a})
            }
            if (f && k) {
                a = new GS.Models.DataString(c.localize.getString(k), m);
                c.publish("gs.notification",
                        {type:"error", message:a.render()})
            }
        }, changePassword:function (a, b, d, f) {
            this.isLoggedIn ? GS.service.changePassword(a, b, this.callback(this._passwordSuccess, d, f), this.callback(this._passwordFailed, f)) : this._passwordFailed(f);
            GS.getGuts().gaTrackEvent("user", "changePassword")
        }, _passwordSuccess:function (a, b, d) {
            if (d && d.statusCode === 1)c.isFunction(a) && a(d); else this._passwordFailed(b, d)
        }, _passwordFailed:function (a, b) {
            c.isFunction(a) && a(b)
        }, updateAccountType:function (a) {
            a = a.toLowerCase();
            switch (a) {
                case "plus":
                    this.IsPremium =
                            1;
                    this.Flags |= 1;
                    break;
                case "anywhere":
                    this.IsPremium = 1;
                    this.Flags |= 128;
                    break;
                case "lite":
                case "liteEx":
                    this.IsPremium = 1;
                    this.Flags |= 32768;
                    break;
                default:
                    this.IsPremium = 0;
                    this.Flags &= -2;
                    this.Flags &= -129;
                    this.Flags &= -32769;
                    break
            }
            GS.service.getSubscriptionDetails(this.callback(function (b) {
                this.subscription = GS.Models.Subscription.getSubscriptionFromDetails(b, this)
            }));
            c.publish("gs.auth.update");
            GS.getGuts().gaTrackEvent("user", "updateAccount", a)
        }, checkVipExpiring:function () {
            this.IsPremium && GS.service.getSubscriptionDetails(this.callback("checkVipExpiringCallback"),
                    this.callback("checkVipExpiringCallback"))
        }, checkVipExpiringCallback:function (a) {
            var b = new Date, d;
            if (!(a.fault || a.code)) {
                this.subscription = GS.Models.Subscription.getSubscriptionFromDetails(a, this);
                if (!(this.subscription.recurring || this.subscription.isSpecial()))if (d = this.subscription.endDate) {
                    a = _.orEqual(GS.store.get("gs.vipExpire.dontPrompt" + this.UserID), 0);
                    if (!(b.getTime() - a < 12096E5)) {
                        a = _.orEqual(GS.store.get("gs.vipExpire.hasSeen" + this.UserID), 0);
                        a = b.getTime() - a;
                        b = d.getTime() - b.getTime();
                        d = Math.max(0,
                                Math.ceil(b / 864E5));
                        d += d == 1 ? " day" : " days";
                        d = b <= 0 ? (new GS.Models.DataString(c.localize.getString("POPUP_VIP_EXPIRES_NO_DAYS"), {vipPackage:this.subscription.getTypeName()})).render() : (new GS.Models.DataString(c.localize.getString("POPUP_VIP_EXPIRES_DAYS_LEFT"), {daysLeft:d, vipPackage:this.subscription.getTypeName()})).render();
                        this.subscription.daysLeft = d;
                        this.subscription.notCloseable = true;
                        if (a >= 1728E5)if (b < 864E5) {
                            this.subscription.timeframe = "oneDay";
                            GS.getLightbox().open("vipExpires", this.subscription)
                        } else if (b <
                                1728E5) {
                            this.subscription.timeframe = "twoDays";
                            GS.getLightbox().open("vipExpires", this.subscription)
                        } else if (b < 12096E5) {
                            this.subscription.timeframe = "twoWeeks";
                            GS.getLightbox().open("vipExpires", this.subscription)
                        } else if (b <= 0 && Math.abs(b) <= 6048E5) {
                            this.subscription.timeframe = "expired";
                            GS.getLightbox().open("vipExpires", this.subscription)
                        }
                        setTimeout(this.callback("checkVipExpiring"), 1728E5)
                    }
                }
            }
        }, isVip:function () {
            return this.subscription.vip
        }, getAutoNewPlaylistName:function () {
            var a, b, d, f = [];
            d = this.Name &&
                    this.Name.length ? this.Name + "'s Playlist " : "Playlist ";
            _.forEach(this.playlists, function (g) {
                a = g.PlaylistName.indexOf(d);
                if (a != -1)(b = parseInt(g.PlaylistName.substring(a + d.length), 10)) && f.push(b)
            });
            if (f.length) {
                f.sort(_.numSortA);
                b = f[f.length - 1] + 1
            } else b = 1;
            return d + b
        }, isPlaylistNameAvailable:function (a) {
            var b;
            for (b in this.playlists)if (this.playlists.hasOwnProperty(b))if (a === this.playlists[b].PlaylistName)return false;
            return true
        }, getPoints:function (a, b) {
            if (this._pointsDirty)if (this._pointsPending)this._pointsPending.then(a,
                    b); else {
                this._pointsPending = c.Deferred();
                this._pointsPending.then(a, b);
                GS.service.userGetPoints(this.callback("_pointsSuccess"), this.callback("_pointsFail"))
            } else a(this.Points)
        }, _pointsSuccess:function (a) {
            var b = parseInt(a, 10);
            if (isNaN(b)) {
                this._pointsPending.reject(a);
                this._pointsPending = false
            } else {
                var d = this.Points;
                this._pointsDirty = false;
                this.Points = b;
                this._pointsPending.resolve(b);
                this._pointsPending = false;
                d !== b && c.publish("gs.auth.pointsUpdated");
                return a
            }
        }, _pointsFail:function (a) {
            this._pointsPending.reject(a);
            this._pointsPending = false;
            return a
        }, invalidatePoints:function () {
            this._pointsDirty = true;
            c.publish("gs.auth.pointsUpdated")
        }, addPoints:function (a, b) {
            b = _.orEqual(b, false);
            a = parseInt(a, 10);
            if (!isNaN(a)) {
                this._pointsDirty = true;
                this.Points += a;
                c.publish("gs.auth.pointsUpdated");
                b || GS.getNotice().displaySurveyPoints(a)
            }
        }, handleLiveRamp:function () {
            var a = GS.store.get("lastLiveRamp" + this.UserID), b = (new Date).valueOf();
            if (this.Email && (!a || b - a > 1296E6)) {
                GS.store.set("lastLiveRamp" + this.UserID, b);
                var d = hex_sha1(c.trim(this.Email.toLowerCase()));
                _.wait(3E4).then(function () {
                    c("iframe#liveRamp").remove();
                    var f = c('<iframe id="liveRamp" name="_rlcdn" width=0 height=0 frameborder=0></iframe>'), g = "http://ei.rlcdn.com/44054.html?s=" + d;
                    f.css("visibility", "hidden");
                    f.bind("load", function () {
                        f.css("visibility", "visible").unbind("load")
                    });
                    f.attr("src", g);
                    c("body").append(f)
                })
            }
        }, isIdle:function () {
            var a = GS.getAd().lastActive.getTime(), b = (new Date).getTime(), d = GS.getAd().maxRotationTime;
            return b - a > d
        }, getUserAge:function () {
            var a;
            if (this.TSDOB) {
                a = this.TSDOB.match(/(\d+)/g);
                return _.dobToAge(Number(a[0]), Number(a[1]) - 1, Number(a[2]))
            } else return false
        }, getUserStringForAnalytics:function () {
            var a, b, d, f = "";
            a = this.isLoggedIn ? "Y" : "N";
            b = _.defined(this.Sex) ? this.Sex : "U";
            d = this.getUserAge();
            switch (true) {
                case d >= 13 && d <= 17:
                    userAgeGroup = "A";
                    break;
                case d >= 18 && d <= 23:
                    userAgeGroup = "B";
                    break;
                case d >= 24 && d <= 29:
                    userAgeGroup = "C";
                    break;
                case d >= 30 && d < 40:
                    userAgeGroup = "D";
                    break;
                case d >= 40 && d < 50:
                    userAgeGroup = "E";
                    break;
                case d >= 50 && d < 60:
                    userAgeGroup = "F";
                    break;
                case d >= 60 && d < 70:
                    userAgeGroup = "G";
                    break;
                case d >= 70 && d < 80:
                    userAgeGroup = "H";
                    break;
                case d >= 80 && d < 90:
                    userAgeGroup = "I";
                    break;
                case d >= 90:
                    userAgeGroup = "J";
                    break;
                default:
                    userAgeGroup = "U"
            }
            f += "L:" + a;
            f += ",S:" + b;
            f += ",A:" + userAgeGroup;
            return f
        }})
})(jQuery);

