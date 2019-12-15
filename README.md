# GrooveJames

### A standalone Java application to download songs from music.163.com

Current status: r39 (stable): allows searching for artists, albums, songs, playlists; downloading of songs and albums, preview songs

### Requirements
- Java7 or higher

### Download
See [Releases](https://github.com/groovejames/groovejames/releases)

### History
See [CHANGES.md](https://github.com/groovejames/groovejames/blob/master/CHANGES.md)

### Development

The sources have IntelliJ project files, so you can just open the
top-level source folder as an IntelliJ project. 

There are some IntelliJ run configurations already checked in to
start with.

The main class is `groovejames.gui.Main` in `src/main/java`. 

Execute `./gradlew jar` to build an executable uber-jar at `build/libs/groovejames-<version>.jar`

You can run this uber-jar with `java -jar build/libs/groovejames-<version>.jar`

Execute `./gradlew distAll` to create binary and source distributions.

For Windows there is even a small wrapper `groovejames.exe` generated
by [Launch4J](http://launch4j.sourceforge.net/) which starts Groovejames
with the system Java. Just put `groovejames.jar` and `groovejames.exe`
into the same directory and double click `groovejames.exe` to start it.
