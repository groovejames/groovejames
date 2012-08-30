(function () {
    GS.Models.Base.extend("GS.Models.Explore", {IMG_PATH:"http://images.grooveshark.com/static/featured/", cache:{}, getType:function (c) {
                var a = this.getOneFromCache(c);
                if (!a) {
                    a = this.wrap({type:c});
                    this.cache[c] = a
                }
                return a
            }, slideProxyRenderer:function (c, a, b) {
                if (c.PlaylistID)return GS.Models.Playlist.slideItemRenderer(c, a, b); else if (c.SongID)return GS.Models.Song.slideItemRenderer(c, a, b); else if (c.AlbumID)return GS.Models.Album.slideItemRenderer(c, a, b); else if (c.ArtistID)return GS.Models.Artist.slideItemRenderer(c,
                        a, b); else console.warn("Wrong type of object for featured itemrenderers")
            }, proxyRenderer:function (c, a, b) {
                if (c.PlaylistID)return GS.Models.Playlist.exploreItemRenderer(c, a, b); else if (c.VideoID)return GS.Models.Video.exploreItemRenderer(c, a, b); else if (c.SongID)return GS.Models.Song.exploreItemRenderer(c, a, b); else if (c.AlbumID)return GS.Models.Album.exploreItemRenderer(c, a, b); else if (c.ArtistID)return GS.Models.Artist.exploreItemRenderer(c, a, b); else console.warn("Wrong type of object for featured itemrenderers")
            }},
            {type:null, songsLoaded:false, featuredData:null, featuredPlaylists:[], featuredVideos:[], videoGroups:{}, init:function (c) {
                this._super(c);
                this.songsLoaded = false;
                this.songs = []
            }, getFeaturedData:function (c, a) {
                this.featuredData ? c(this.featuredData) : GS.service.featuredGetCurrentFeatured(null, this.callback(["wrapFeatured", c]), a)
            }, getFeaturedDataForDate:function (c, a, b) {
                this.featuredData = {};
                this.featuredVideos = [];
                GS.service.featuredGetCurrentFeatured(c, this.callback(["wrapFeatured", a]), b)
            }, wrapFeatured:function (c) {
                this.featuredPlaylists =
                        [];
                this.featuredData = c;
                i = 0;
                for (l = this.featuredData.Contents.length; i < l; i++) {
                    j = 0;
                    for (l2 = this.featuredData.Contents[i].items.length; j < l2; j++)if (this.featuredData.Contents[i].items[j].PlaylistID)this.featuredData.Contents[i].items[j] = GS.Models.Playlist.wrap(this.featuredData.Contents[i].items[j], true, "featured"); else if (this.featuredData.Contents[i].items[j].VideoID) {
                        this.featuredData.Contents[i].items[j] = GS.Models.Video.wrap(this.featuredData.Contents[i].items[j], true, "featured");
                        c = this.featuredData.Contents[i].items[j];
                        if (this.videoGroups[c.set])this.videoGroups[c.set].push(c); else this.videoGroups[c.set] = [c]
                    } else if (this.featuredData.Contents[i].items[j].SongID)this.featuredData.Contents[i].items[j] = GS.Models.Song.wrap(this.featuredData.Contents[i].items[j], true, "featured"); else if (this.featuredData.Contents[i].items[j].AlbumID)this.featuredData.Contents[i].items[j] = GS.Models.Album.wrap(this.featuredData.Contents[i].items[j], true, "featured"); else if (this.featuredData.Contents[i].items[j].ArtistID)this.featuredData.Contents[i].items[j] =
                            GS.Models.Artist.wrap(this.featuredData.Contents[i].items[j], true, "featured");
                    if (this.featuredData.Contents[i].items[0].PlaylistID)this.featuredPlaylists.push(this.featuredData.Contents[i]); else this.featuredData.Contents[i].items[0].VideoID && this.featuredVideos.push(this.featuredData.Contents[i])
                }
            }, getPopularSongs:function (c, a) {
                if (this.songsLoaded) {
                    this.songs = this.wrapSongCollection(this.songs, {Popularity:0, Weight:"", NumPlays:""});
                    c(this.songs)
                } else GS.service.popularGetSongs(this.type, this.callback(["wrapManySongs",
                    c]), a)
            }, wrapManySongs:function (c) {
                c.Songs && c.Songs.reverse();
                return this.wrapSongCollection(c, {USE_INDEX:"Popularity", Weight:"", NumPlays:""})
            }})
})(jQuery);

