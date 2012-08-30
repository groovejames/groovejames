(function (c) {
    GS.Models.Base.extend("GS.Models.User", 
    {
    id:"UserID", cache:{}, usersLoaded:false, userIDs:[], artPath:"http://images.grooveshark.com/static/users/",
    defaults:{UserID:0, Username:"", Name:"", FName:"", LName:"", Picture:"", IsPremium:0, SignupDate:null, Location:"", Sex:"", FollowingFlags:0, Flags:0, PathName:null, PathNameEmpty:false, PageNameData:{}, isFavorite:0, library:{}, favorites:{songs:{}, albums:{}, artists:{}, playlists:{}, users:{}}, fanbase:null, playlists:{}, profileFeed:{}, communityFeed:{}, mentionsFeed:{},
    collabPlaylists:{}}, getUser:function (a, b, d) {
        var f = this.getOneFromCache(a);
        f ? b(f) : GS.service.getUserByID(a, this.callback(["wrapProxy", b]), d)
    }, itemRenderer:function (a) {
        var b = GS.user.favorites.users && GS.user.favorites.users[a.UserID] ? " following" : "", d = GS.user.favorites.users && GS.user.favorites.users[a.UserID] ? "FOLLOWING" : "FOLLOW", f = "" + ('<a class="name ellipsis capitalize" href="' + _.cleanUrl(a.UserID, a.Name, "user") + '">' + a.Name + "</a>"), g = a.City && a.State && a.Country ? a.Location : a.Country ? a.Country : "";
        g = ['<span class="location ellipsis',
            g.length ? "" : " emphasis", '">', g.length ? g : c.localize.getString("USER_NO_LOCATION"), "</span>"].join("");
        var k = a.getImageURL(70);
        k = ['<img src="', k, '"/>'].join("");
        b = a.UserID === GS.user.UserID ? "" : ['<button class="follow btn button_style2 ', b, '" data-follow-userid="', a.UserID, '" ><div><span class="icon"></span><span class="label" data-translate-text="', d, '">', c.localize.getString(d), "</span></div></button>"].join("");
        return['<a href="', _.cleanUrl(a.UserID, a.Name, "user"), '" class="userImage insetBorder height70"><div class="status ',
            a.getVipPackage(), '"></div>', k, '</a><div class="meta">', f, g, b, "</div>"].join("")
    }, sliderRenderer:function (a) {
        var b = '<div class="page_content_slide subcontent-item fans"><a href="' + a.toUrl() + '" class="image"><img src="' + a.getImageURL() + '"></a><a class="title" href="' + a.toUrl() + '">' + (a.FName || a.Name) + '</a><span class="duration">';
        a = a.getAccountDuration();
        b += c("<span></span>").localeDataString(a.key, a).render();
        b += "</span></div>";
        return b
    }, matchFilter:function (a) {
        var b = RegExp(a, "gi");
        return function (d) {
            return d.Name ?
                    d.Name.match(b) : false
        }
    }, wrapProxy:function (a) {
        return this.wrap(a.User || a)
    },
    FLAG_PLUS:1,
    FLAG_LASTFM:2, 
    FLAG_FACEBOOK:4, 
    FLAG_FACEBOOKUSER:16, 
    FLAG_GOOGLEUSER:32, 
    FLAG_GOOGLE:64, 
    FLAG_ANYWHERE:128, 
    FLAG_ISARTIST:256, 
    FLAG_CLEARVOICE:512, 
    FLAG_MUSIC_BUSINESS:1024, 
    FLAG_LITE:32768, 
    FLAG_KINESIS:16384
    },
    {
    validate:function () {
        if (this.UserID > 0)return true;
        return false
    }, init:function (a) {
        this._super(a);
        var b = _.orEqual(this.City, "");
        b += this.State && b.length ? ", " + this.State : _.orEqual(this.State, "");
        b += this.Country && b.length ?
                ", " + this.Country : _.orEqual(this.Country, "");
        this.FName = _.cleanText(this.FName);
        this.LName = _.cleanText(this.LName);
        if (_.defined(this.displayName))this.Name = _.cleanText(this.displayName); else if (_.defined(this.FName)) {
            this.Name = _.cleanText(this.FName);
            if (this.LName && this.LName.length)this.Name += " " + _.cleanText(this.LName)
        } else this.Name = "New User";
        this.Username = this.UserID > 0 ? this.Username && this.Username.length ? this.Username : this.Name : "New User";
        this.Location = b;
        this.IsPremium = this.IsPremium == 1 ? 1 : 0;
        this.library = this.isAuth ? {} : false;
        this.communityFeed = this.profileFeed = this.fanbase = false;
        this.mentionsFeed = GS.Models.MentionsFeed.wrap({user:this});
        this.searchText = [this.Locale, this.FName, this.LName].join(" ").toLowerCase();
        this.playlists = {};
        this.favorites = {songs:{}, albums:{}, artists:{}, playlists:{}, users:{}};
        this.TSAdded = _.orEqual(a.TSAdded, false);
        this.TSLogin = _.orEqual(a.TSLogin, null);
        this.TSModified = _.orEqual(a.TSModified, null)
    }, autocompleteFavoriteUsers:function () {
        var a = [];
        c.each(this.favorites.users,
                function (b, d) {
                    c.each(d.searchText.trim().split(), function (f, g) {
                        a.push([g.trim(), d.UserID])
                    })
                });
        return a
    }, getTopArtists:function (a, b) {
        _.isEmpty(this.topArtists) ? GS.service.getUserTopArtists(this.UserID, this.callback(function (d) {
            this._setTopArtists(d, a)
        }), b) : a(this.topArtists)
    }, _setTopArtists:function (a, b) {
        for (var d in a) {
            a[d].ArtistID = a[d].artistID;
            a[d].Name = a[d].artistName;
            delete a[d].artistID;
            delete a[d].artistName
        }
        this.topArtists = GS.Models.Artist.wrapCollectionInObject(a);
        b(this.topArtists)
    }, getFavoritesByType:function (a, b, d) {
        var f = arguments[arguments.length - 1] === d ? {} : arguments[arguments.length - 1], g = a.toLowerCase();
        if (_.isEmpty(this.favorites[g]))GS.service.getFavorites(this.UserID, a, !this.isAuth, this.callback(["load" + a + "Favorites", b]), d, f); else {
            f = this.favorites[g];
            this.favorites[g] = GS.Models[a.substring(0, a.length - 1)].wrapCollectionInObject(f, {TSFavorited:"", TSAdded:""});
            b(this.favorites[g])
        }
    }, loadAlbumsFavorites:function (a) {
        var b = {};
        for (var d in a)if (a.hasOwnProperty(d)) {
            a[d].TSAdded = a[d].TSFavorited;
            b[a[d].AlbumID] =
                    a[d];
            if (this.isAuth)a[d].isFavorite = 1
        }
        this.favorites.albums = GS.Models.Album.wrapCollectionInObject(b, {TSFavorited:"", TSAdded:""});
        return this.favorites.albums
    }, loadArtistsFavorites:function (a) {
        var b = {};
        for (var d in a)if (a.hasOwnProperty(d)) {
            a[d].TSAdded = a[d].TSFavorited;
            b[a[d].ArtistID] = a[d];
            if (this.isAuth)a[d].isFavorite = 1
        }
        this.favorites.artists = GS.Models.Artist.wrapCollectionInObject(b, {TSFavorited:"", TSAdded:""});
        return this.favorites.artists
    }, loadPlaylistsFavorites:function (a) {
        var b = {};
        for (var d in a)if (a.hasOwnProperty(d)) {
            a[d].TSAdded =
                    a[d].TSFavorited;
            b[a[d].PlaylistID] = a[d];
            if (this.isAuth)a[d].isFavorite = 1
        }
        this.favorites.playlists = GS.Models.Playlist.wrapCollectionInObject(b, {TSFavorited:"", TSAdded:""});
        return this.favorites.playlists
    }, loadSongsFavorites:function (a) {
        var b = {};
        for (var d in a)if (a.hasOwnProperty(d)) {
            a[d].TSAdded = a[d].TSFavorited;
            b[a[d].SongID] = a[d]
        }
        this.favorites.songs = GS.Models.Song.wrapCollectionInObject(b, {TSFavorited:"", TSAdded:"", fromLibrary:GS.user.UserID == this.userID ? 1 : 0});
        if (!this.library)this.library = GS.Models.Library.wrap({userID:this.UserID});
        this.propogateSongsFavorites();
        return this.favorites.songs
    }, propogateSongsFavorites:function () {
        var a, b;
        for (b in this.favorites.songs)if (this.favorites.songs.hasOwnProperty(b)) {
            a = this.favorites.songs[b];
            if (this.isAuth) {
                a.isFavorite = 1;
                a.fromLibrary = 1
            }
            this.library.songs[a.SongID] = a.dupe()
        }
    }, loadUsersFavorites:function (a) {
        var b = {};
        for (var d in a)if (a.hasOwnProperty(d)) {
            a[d].FollowingFlags = parseInt(a[d].FollowingFlags, 10);
            b[a[d].UserID] = a[d];
            if (this.isAuth)a[d].isFavorite = 1
        }
        this.favorites.users = GS.Models.User.wrapCollectionInObject(b,
                {TSFavorited:"", TSAdded:"", FollowingFlags:0});
        return this.favorites.users
    }, getShortName:function () {
        var a = "";
        if (this.Name.length > 12) {
            for (var b = this.Name.split(" "), d = 0; d < b.length; d++)if (a.length == 0 || b[d].length < 10 && a.length < 12) {
                if (a.length)a += " ";
                a += b[d]
            } else return a;
            if (a > 12)return a.substr(0, 12) + "&hellip;";
            return a
        }
        return this.Name
    }, getPlaylists:function (a, b) {
        if (_.isEmpty(this.playlists))GS.service.userGetPlaylists(this.UserID, !this.isAuth, this.callback(["cachePlaylists", a]), b); else c.isFunction(a) &&
        a()
    }, cachePlaylists:function (a) {
        var b = {};
        a = a.Playlists;
        for (var d in a)if (a.hasOwnProperty(d)) {
            a[d].UserName = this.Name;
            a[d].FName = this.FName;
            a[d].LName = this.LName;
            a[d].UserID = this.UserID;
            b[a[d].PlaylistID] = a[d]
        }
        d = this.playlists;
        this.playlists = GS.Models.Playlist.wrapCollectionInObject(b);
        if (this.isAuth) {
            _.forEach(d, function (f) {
                _.defined(this.playlists[f.PlaylistID]) || (this.playlists[f.PlaylistID] = f)
            }, this);
            c.publish("gs.auth.playlists.update")
        }
    }, getProfileFeed:function (a, b) {
        if (!this.profileFeed)this.profileFeed =
                GS.Models.ProfileFeed.wrap({user:this});
        this.profileFeed.getFeed(this.callback(a), b)
    }, getCommunityExceptions:function () {
        return this.isAuth ? this.filterFriends(1) : this.favorites.users
    }, getCommunityFeed:function (a, b) {
        var d = [];
        if (!this.communityFeed)this.communityFeed = GS.Models.CommunityFeed.wrap({user:user});
        if (this.isAuth)d = _.toArrayID(this.getCommunityExceptions());
        if (this.UserID > 0) {
            this.communityFeed.userIDs = d;
            this.communityFeed.getFeed(this.callback(a), b)
        }
    }, playUserRadio:function () {
    }, filterFriends:function (a, b) {
        var d = {};
        if (b)for (var f in this.favorites.users)this.favorites.users[f].FollowingFlags & a || (d[f] = this.favorites.users[f]); else for (f in this.favorites.users)if (this.favorites.users[f].FollowingFlags & a)d[f] = this.favorites.users[f];
        return d
    }, getRecentlyActiveUsersFeed:function (a, b) {
        this.recentActiveUsersFeed.getFeed(this.callback(a), b)
    }, getVipPackage:function () {
        var a = "";
        if (this.Flags & GS.Models.User.FLAG_ANYWHERE)a = "anywhere"; else if (this.Flags & GS.Models.User.FLAG_PLUS)a = "plus"; else if (this.Flags &
                GS.Models.User.FLAG_LITE)a = "lite";
        return a
    }, getAccountDuration:function () {
        var a = {};
        if (this.TSAdded) {
            var b = this.TSAdded.split(" ");
            if (b) {
                b = b[0].split("-");
                var d = new Date;
                a = parseInt(d.getFullYear() - parseInt(b[0]));
                b = parseInt(d.getMonth() - parseInt(b[1]) + 1);
                if (b < 0) {
                    a--;
                    b = 12 + parseInt(b)
                }
                a = {months:b, years:a};
                a.key = a.years > 0 ? a.years == 1 ? "USER_MEMBER_FOR_YEAR" : "USER_MEMBER_FOR_YEARS" : a.months < 1 ? "USER_MEMBER_LESS_THAN_MONTH" : a.months == 1 ? "USER_MEMBER_FOR_MONTH" : "USER_MEMBER_FOR_MONTHS"
            }
        }
        return a
    }, toUrl:function (a) {
        return this.PathName ?
                _.makeUrlFromPathName(this.PathName, a) : _.cleanUrl(this.UserID ? this.Name : "New User", this.UserID, "user", null, a)
    }, getPageNameData:function (a) {
        if (_.isEmpty(this.PageNameData))GS.service.getPageInfoByIDType(this.UserID, "user", this.callback(this._onPageNameDataSuccess, a), this.callback(this._onPageNameDataFailed, a)); else c.isFunction(a) && a(this.PageNameData)
    }, _onPageNameDataSuccess:function (a, b) {
        this.PageNameData = _.orEqual(b.Data, {});
        this.PageNameData.CollabPlaylists && this._updateCollabPlaylists();
        if (b.Name)this.PathName =
                b.Name; else {
            this.PathName = "";
            this.PathNameEmpty = true
        }
        c.isFunction(a) && a(this.PageNameData);
        if (this.UserID == GS.user.UserID) {
            c.publish("gs.auth.user.pathName");
            c.publish("gs.auth.user.collabPlaylists")
        }
    }, _onPageNameDataFailed:function (a, b) {
        this.PageNameData = {};
        this._onPathNameFailed(null, b);
        c.isFunction(a) && a(this.PageNameData)
    }, _updateCollabPlaylists:function (a) {
        var b = [], d, f;
        if (this.PageNameData.CollabPlaylists)for (f in this.PageNameData.CollabPlaylists)if (this.PageNameData.CollabPlaylists.hasOwnProperty(f)) {
            p =
                    this.PageNameData.CollabPlaylists[f];
            a || (d = GS.Models.Playlist.getOneFromCache(f));
            p.PlaylistName = _.orEqual(p.PlaylistName, p.Name);
            p.PlaylistID = _.orEqual(p.PlaylistID, f);
            p.Collaborative = _.orEqual(p.Collaborative, true);
            p.Collaborators = _.orEqual(p.Collaborators, []);
            p.Collaborators[GS.user.UserID] = GS.user;
            if (!a && d) {
                this.UserID == GS.user.UserID && d._updateUserPageNameData();
                b.push(d);
                p.Name = d.PlaylistName
            } else b.push(GS.Models.Playlist.wrap(p, false))
        }
        this.collabPlaylists = b;
        c.publish("gs.auth.user.collabPlaylists.update")
    },
        getPathName:function (a) {
            if (this.PathName || this.PathNameEmpty)c.isFunction(a) && a(this.PathName); else this.UserID > 0 && GS.service.getPageNameByIDType(this.UserID, "user", this.callback(this._onPathNameSuccess, a), this.callback(this._onPathNameFailed, a))
        }, _onPathNameSuccess:function (a, b) {
            if (b.name)this.PathName = b.name; else {
                this.PathName = "";
                this.PathNameEmpty = true
            }
            c.isFunction(a) && a(this.PathName);
            this.UserID == GS.user.UserID && c.publish("gs.auth.user.pathName")
        }, _onPathNameFailed:function (a) {
            this.PathName =
                    "";
            this.PathNameEmpty = true;
            c.isFunction(a) && a(this.PathName)
        }, getImageURL:function (a) {
            a = _.orEqual(a, 70);
            var b = GS.Models.User.artPath + a + "_user.png";
            if (this.Picture)b = GS.Models.User.artPath + a + "_" + this.Picture;
            return b
        }, getDetailsForFeeds:function () {
            return{userID:this.UserID, userName:this.Name, isPremium:this.IsPremium, location:this.location, picture:this.Picture}
        }, getTitle:function () {
            return this.Name
        }, getIsFavorite:function (a, b) {
            if (!b || !a)return false;
            a = a.toLowerCase();
            b = b.toString();
            switch (a) {
                case "playlist":
                    return Boolean(this.favorites.playlists[b]);
                case "song":
                    return Boolean(this.favorites.songs[b]);
                case "artist":
                    return Boolean(this.favorites.artists[b]);
                case "user":
                    return Boolean(this.favorites.users[b])
            }
            return false
        }, getContextMenu:function () {
            var a = [];
            if (GS.user.UserID != this.UserID)GS.user.getIsFavorite("user", this.UserID) ? a.push({title:c.localize.getString("CONTEXT_UNFOLLOW"), customClass:"last jj_menu_item_hasIcon jj_menu_item_unfollow", action:{type:"fn", callback:this.callback(function () {
                GS.user.removeFromUserFavorites(this.UserID)
            })}}) :
                    a.push({title:c.localize.getString("CONTEXT_FOLLOW"), customClass:"last jj_menu_item_hasIcon jj_menu_item_follow", action:{type:"fn", callback:this.callback(function () {
                        GS.user.addToUserFavorites(this.UserID, true)
                    })}});
            return a
        }, toString:function (a) {
            return(a = _.orEqual(a, false)) ? ["User. uid: ", this.UserID, ", uname:", this.Name].join("") : _.cleanText(this.Name)
        }})
})(jQuery);

