# Infos about music.163.com / Netease 

## Informations

- https://github.com/yanunon/NeteaseCloudMusic/wiki/NetEase-cloud-music-analysis-API-%5BEN%5D
- https://gist.github.com/scturtle/5972996
- http://www.rubydoc.info/gems/mplug163/0.1.1/NetEase
- https://github.com/bluetomlee/NetEase-MusicBox/blob/master/src/api.py


## Netease API

### search

POST http://music.163.com/api/search/get

Params:

- s: (string) search string
- type: (int) 1: songs, 10: albums, 100: artists, 1000: playlists, 1002: users, 1008: djprograms, 1009: djchannels
- limit: (int)
- offset: (int)
- sub: (boolean) ??? set to false

Returns: SearchResult containing one of SongSearchResult (type=1), AlbumSearchResult (type=10), ArtistSearchResult (type=100), PlaylistSearchResult (type=1000), DjChannelSearchResult (type=1009)

### search suggestion (autocomplete)

POST http://music.163.com/api/search/suggest

Params:

- s: (string) search string
- limit: (int)

Returns: SearchResult containing SuggestResult

### artist details

GET http://music.163.com/api/artist/[artistId]

Returns: ArtistDetailSearchResult

### albums of an artist

GET http://music.163.com/api/artist/albums/[artistId]

Params:

- limit: (int)
- offset: (int)

Returns: ArtistAlbumsSearchResult

### album details

GET http://music.163.com/api/album/[albumId]

Params:

- limit: (int)
- offset: (int)

Returns: AlbumDetailSearchResult

### song details

POST http://music.163.com/api/song/detail

Params:

- ids: (string) array of song IDs as string, e.g. "[123,456]"

Returns: SongDetailSearchResult

### playlist details

POST http://music.163.com/api/playlist/detail

Params:

- id: (long) playlist id

Returns: PlaylistDetailSearchResult

### dj channel details

GET http://music.163.com/api/dj/program/detail

Params

- id: (long) dj channel ID

Returns: DjChannelDetailSearchResult


## NetEase Types

Not all properties are listed, only the more important ones.

### SearchResult

- code: (int) 200: ok, otherwise: error
- result: (PlaylistSearchResult | ArtistSearchResult | AlbumSearchResult | SongSearchResult | DjChannelSearchResult | SuggestResult)

### PlaylistSearchResult

- playlistCount: (int)
- playlists: (array of Playlist)

### ArtistSearchResult

- artistCount: (int)
- artists: (array of Artist)

### AlbumSearchResult

- albumCount: (int)
- albums: (array of Album)

### SongSearchResult

- songCount: (int)
- songs: (array of Song)

### ArtistDetailSearchResult

- code: (int) 200: ok, otherwise: error
- artist: (Artist)
- hotSongs: (array of SongDetail)
- more: (boolean) often true, but no way to get more hotSongs, because the artist details request doesn't accept offset and limit

### ArtistAlbumsSearchResult

- code: (int) 200: ok, otherwise: error
- artist: (Artist)
- hotAlbums: (array of Album)
- more: (boolean)

### Artist

- id: (long)
- name: (string)
- albumSize: (int) number of tracks
- followed: (boolean) ???
- mvSize: (int) ???
- alias: (array of ???) empty
- img1v1Url: (string) image URL
- img1v1: (long) ID in img1v1Url
- picUrl: (string) alternative image URL, sometimes null
- picId: (long) ID in picURL
- trans: (string) chinese translated name
- transnames: (array of string) chinese translated names
- mvSize: (int) ???

### Album

- id: (long)
- name: (string)
- alias: (array of ???) empty
- artist: (Artist)
- artists: (array of Artist)
- blurPicUrl: (string) mostly the same as picUrl
- company: (string)
- description: (string) mostly empty
- picUrl: (string) album picture
- picId: (long) ID in picUrl
- publishTime: (long) release date, in milliseconds since 1970
- size: (int) number of songs
- status: (int) ??? 0, 1, 2
- tags: (string) empty
- type: (string) e.g. "EP/Single" or chinese string

### AlbumDetail

_extends: Song_

- songs: (array of SongDetail) songs of this album

### AlbumDetailSearchResult

- code: (int) 200: ok
- album: (AlbumDetail)

### Song

- id: (long)
- name: (string)
- album: (Album)
- alias: (array of ???) empty
- artists: (array of Artist) if length>1 song has multiple authors. Attention! If artist.id == 0, then artist is not available in details search! 
- duration: (long) in ms
- fee: (int) ??? 0
- ftype: (int) ??? 0
- mvid: (int) ??? 0
- rUrl: (string) ??? null
- rtype: (int) ??? 0
- status: (int) ??? 1

### SongDetailSearchResult

- code: (int) 200: ok
- equalizers: (object) ???
- songs: (array of SongDetail)

### SongDetail

_extends: Song_

- mp3Url: (string) low quality mp3 url (96k)
- no: (int) position on album
- position: (int) position on album?!? mostly the same as "no", but not always
- popularity: (double) from 0.0 to 100.0
- score: (int) same as popularity, as int
- audition: (StreamInfo) m4a, very low quality (64k)
- bMusic: (StreamInfo) mp3, low quality (96k)
- lMusic: (StreamInfo) mp3, low quality (96k)
- mMusic: (StreamInfo) mp3, medium quality (160k)
- hMusic: (StreamInfo) mp3, high quality (320k)

### StreamInfo

- id: (long) stream id
- name: (string) song name
- bitrate: (long) 64000 - 320000
- dfsId: (long)
- extension: (string) "mp3", "m4a" etc.
- playTime: (long) ms
- size: (long) bytes
- sr: (int)
- volumeDelta: (double)

### Playlist

- id: (long)
- name: (string)
- coverImgUrl: (string)
- creator: (User)
- subscribed: (boolean)
- trackCount: (int) number of songs in playlist
- userId: (long)
- playCount: (int)
- bookCount: (int)
- highQuality: (boolean)

### PlaylistDetailSearchResult

- code: (int) 200: ok
- result: (PlaylistDetail)

### PlaylistDetail

_extends: Playlist_

- artists: null
- tracks: (array of SongDetail)
- description: (string)
- status: (int)
- tags: (array of string) chinese
- subscribers: (array) empty???
- subscribedCount: (int)
- totalDuration: (int) sum of duration of all tracks, in seconds

### User

- userId: (long)
- nickname: (string)
- userType: (int) ??? always 0?
- authStatus: (int) ??? 0 or 1

### DjChannelSearchResult

- djprogramCount: (int)
- djprograms: (array of DjChannel)
- djRadiosCount: (int)
- djRadios: (array of DjRadio)

### DjChannel

- id: (long)
- name: (string)
- duration: (int) total duration, in ms
- description: (string)
- dj: (DjInfo) TBD
- radio: (RadioInfo) TBD
- coverUrl: (string)
- trackCount: (int) if channel has additional track parts
- mainTrackId: (long) song id of main track
- createTime: (long) release date, in ms since 1970

### DjRadio

TBD

### DjChannelDetailSearchResult

- code: (int) 200: ok
- program: (DjChannelDetail)

### DjChannelDetail

_extends: DjChannel_

- mainSong: (SongDetail) the whole channel as one track
- songs: (array of SongDetail) optional, some tracks of the dj set

### SuggestResult

- order: (array of string) in which order to display results, possible values: "artists", "songs", "albums"
- artists: (array of Artist)
- albums: (array of Album)
- songs: (array of Song)
