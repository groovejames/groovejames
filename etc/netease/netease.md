# Infos about music.163.com / Netease 

## Links

- https://github.com/yanunon/NeteaseCloudMusic/wiki/NetEase-cloud-music-analysis-API-%5BEN%5D
- https://gist.github.com/scturtle/5972996
- http://www.rubydoc.info/gems/mplug163/0.1.1/NetEase


## Netease API

### search

POST http://music.163.com/api/search/get

Params:

- s: (string) search string
- type: (int) 1000: playlists, 100: artists, 10: albums, 1: songs
- limit: (int)
- offset: (int)
- sub: (boolean) ??? set to false

Returns: SearchResult containing one of (PlaylistSearchResult | ArtistSearchResult | AlbumSearchResult | SongSearchResult)

### albums of an artist

GET http://music.163.com/api/artist/albums/[artistId]

Params:

- limit: (int)
- offset: (int)

Returns: ArtistAlbumsSearchResult

### album info

GET http://music.163.com/api/album/[albumId]

### song details

POST http://music.163.com/api/song/detail

Params:
- ids: (string) array of song IDs as string, e.g. "[123,456]"

Returns: SongDetailSearchResult

### SearchResult

- code: (int) 200: ok, otherwise: error
- result: (PlaylistSearchResult | ArtistSearchResult | AlbumSearchResult | SongSearchResult )

### PlaylistSearchResult

TBD

### ArtistSearchResult

- artistCount: (int)
- artists: (array of Artist)

### AlbumSearchResult

- albumCount: (int)
- albums: (array of Album)

### SongSearchResult

- songCount: (int)
- songs: (array of Song)

### ArtistAlbumsSearchResult

- code: (int) 200: ok, otherwise: error
- artist: (Artist)
- hotAlbums: (array of Album)
- more: boolean

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
- trans: chinese translated name
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
- songs: (array) empty
- status: (int) ??? 0, 1, 2
- tags: (string) empty
- type: (string) e.g. "EP/Single" or chinese string

### Song

- id: (long)
- name: (string)
- album: (Album)
- alias: (array of ???) empty
- artists: (array of Artist)
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

- id: (long) song ID
- name: (string)
- mp3Url: (string) low quality mp3 url (96k)
- duration: (long) ms
- no: (int) position on album???
- position: (int) position on album???
- album: (Album)
- artists: (array of Artist)
- audition: (StreamInfo) m4a, very low quality (64k)
- bMusic: (StreamInfo) mp3, low quality (96k)
- lMusic: (StreamInfo) mp3, low quality (96k)
- mMusic: (StreamInfo) mp3, medium quality (160k)
- hMusic: (StreamInfo) mp3, high quality (320k)
- status: (int) ???

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


