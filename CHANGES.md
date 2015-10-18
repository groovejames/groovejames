# GrooveJames change history

### r28 (unreleased)
- since Grooveshark is dead, GrooveJames now uses music.163.com aka NetEase
- now requires Java7 or higher (instead of Java6)
- project switched from JavaForge to GitHub: https://github.com/groovejames/groovejames

### r27 (2015/01/11)
- nicer display of album image in playlist
- fixed display of wrong song lengths (Grooveshark's song lengths are unreliable unless you play the song)
- fixed problem when downloading many files, wait interval got longer and longer
- switched from Ant to Gradle
- updated libs (Pivot 2.0 -> 2.0.4, log4j 1.2.15 -> 1.2.17, json-simple 1.1 -> 1.1.1)

### r26 (2014/01/18)
- added shortcut ctrl-w / ctrl-shift-w to close current tab / all tabs, added action "close other tabs"
- fixed invalid token error (again)
- fixed getting songs of an artist

### r25 (2013/07/22)
- NEW: on click on the album image in playlist show the full image in the system's default image viewer
- fixed creation of mailto url
- log to $HOME/.groovejames.log

### r24 (2013/07/04)
- fixed share action mail encoding problem

### r23 (2013/06/02)
- updated grooveshark secrets

### r22 (2013/04/14)
- NEW: share songs in play pane, too
- fixed missing artist names in album search
- fixed possibility to share a single song
- fixed opening mail program on Linux without Gnome2 libs (fallback to xdg-open)
- share album: care about the "verified only" flag when sharing
- share album: if autoplay enabled, play in the right order

### r21 (2013/04/01)
- NEW: mail album or list of songs to someone, using a groovejames:// url
- NEW: listen on clipboard for groovejames:// urls
- fixed radio fetch next song
- moved radio buttons "show all/verified only" to submenu

### r20 (2013/03/17)
- show high-res pictures in player
- if songs list with "verified only" is empty, automatically show all songs
- if album list with "verified only" is empty, automatically show all albums

### r19 (2013/01/17)
- fixed artists and playlist images
- some refactoring on model and search classes

### r18 (2013/01/16)
- NEW: switch between verified and unverified content on album and song pane
- rearranged tabs to establish a more drill-down like search (artists->albums->songs)
- fixed clipboard watcher watching for Grooveshark URLs

### r17-dev (2012/10/11)
- bugfix: player sometimes produced garbled noise at the start of a track, or when pausing/resuming a track

### r16-dev (2012/09/27)
- NEW: download songs of playlist
- fixed closing autocomplete popup after search; autocomplete now more responsive
- another try to fix stutter on skip and pause/play (still not solved 100%)

### r15-dev (2012/09/18)
- NEW: Radio!
- NEW: now pre buffers 50kb of song data to avoid stuttering on slow networks
- NEW: double click in player's playlist to change current song
- NEW: replaced "Play Now" dropdown button with two buttons "Play" and "Enqueue"
- NEW: context menu on songs table
- NEW: artist and album columns in download and player tab are now linked with search
- new layout for Player panel, now displays image of current track if available
- get a session id faster by simply faking one, leads to faster startup
- fixed saving column widths for download and player table
- fixed saving horizontal splitpane position
- fixed no audio output problem when skipping fast between songs

### r14-dev (2012/08/30)
- fixed invalid token error (again)
- fixed race condition in MP3 player: skip to next song forced wait until current song downloaded completely
- faster loading of all songs of an artist

### r13-dev (2012/08/05)
- fixed invalid session id error
- never load more than one track simultaneously because otherwise GS may block the IP

### r12-dev (2012/04/16)
- fixed invalid token error (again)

### r11-dev (2012/03/12)
- fixed invalid token error (again)

### r10-dev (2012/01/23)
- fixed invalid session id error
- work around the fact that GS shutdown in Germany
- NEW: watch system clipboard for GS URLs; currently artist, album, playlist and user URLs are supported
- NEW: settings: can now specify download folder
- minor bug fixes

### r9-dev (2011/11/11)
- NEW: autocomplete in search field
- NEW: playlists
- NEW: dark skin

### r8-dev (2011/07/29)
- fixed invalid token error (again)
- many fixes for MP3 player
- NEW: "close all" context menu on tabs

### r7-dev (2011/07/08)
- NEW: embedded MP3 player

### r2-stable (2011/02/10)
- automatic deployment on JavaForge

### r1 (2011/01/28)
- initial release