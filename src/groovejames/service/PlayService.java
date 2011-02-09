package groovejames.service;

import groovejames.model.Song;
import groovejames.model.Track;
import groovejames.mp3player.MP3Player;
import groovejames.mp3player.PlayThread;
import groovejames.mp3player.PlaybackListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Sequence;

import java.io.IOException;
import java.io.InputStream;

public class PlayService {

    public static enum AddMode {
        NOW, NEXT, LAST, REPLACE
    }

    private static final Log log = LogFactory.getLog(PlayService.class);

    private final DownloadService downloadService;
    private final ArrayList<Song> playlist = new ArrayList<Song>();
    private int currentSongIndex = -1;
    private Track currentTrack;
    private int pausedFrame = -1;
    private PlayServiceListener listener;
    private PlayThread playThread = new PlayThread();

    public PlayService(DownloadService downloadService) {
        this.downloadService = downloadService;
    }

    public void setListener(PlayServiceListener listener) {
        this.listener = listener;
    }

    public ArrayList<Song> getPlaylist() {
        return playlist;
    }

    public synchronized void add(Sequence<Song> songs, AddMode addMode) {
        if (songs.getLength() == 0) {
            return;
        }
        if (addMode == AddMode.REPLACE) {
            playlist.clear();
            currentSongIndex = -1;
            currentTrack = null;
            pausedFrame = -1;
        }
        int insertIdx = (addMode == AddMode.LAST ? playlist.getLength()
                : addMode == AddMode.NEXT ? currentSongIndex + 1 : currentSongIndex);
        for (int i = 0; i < songs.getLength(); i++) {
            Song song = songs.get(i);
            log.info("adding: " + song);
            if (insertIdx >= 0 && insertIdx < playlist.getLength()) {
                playlist.insert(song, insertIdx);
            } else {
                int newIdx = playlist.add(song);
                if (i == 0 && addMode == AddMode.NOW) {
                    currentSongIndex = newIdx;
                }
            }
            insertIdx++;
        }
        if (addMode == AddMode.NOW) {
            Song song = songs.get(0);
            log.info("starting: " + song);
            startPlaying(song, 0);
        }
    }

    public synchronized void play() {
        Song currentSong = getCurrentSong();
        if (currentSong != null) {
            log.info("starting: " + currentSong);
            startPlaying(currentSong, 0);
        } else {
            log.info("no current song");
        }
    }

    public synchronized void stop() {
        Song currentSong = getCurrentSong();
        log.info("stopping: " + currentSong);
        stopPlaying();
    }

    public synchronized void skipForward() {
        Song finishedSong = getCurrentSong();
        log.info("stopping because of skip: " + finishedSong);
        stopPlaying();
        if (currentSongIndex < playlist.getLength() - 1) {
            currentSongIndex++;
            Song currentSong = getCurrentSong();
            log.info("skipping forward to: " + currentSong);
            startPlaying(currentSong, 0);
        } else {
            log.info("skipped beyond end of playlist");
        }
    }

    public synchronized void skipBackward() {
        Song finishedSong = getCurrentSong();
        log.info("stopping because of skip: " + finishedSong);
        stopPlaying();
        if (currentSongIndex > 0) {
            currentSongIndex--;
            Song currentSong = getCurrentSong();
            log.info("skipping back to: " + currentSong);
            startPlaying(currentSong, 0);
        } else {
            log.info("skipped beyond start of playlist");
        }
    }

    public synchronized void pause() {
        Song song = getCurrentSong();
        if (song != null && !playThread.isStopForced()) {
            log.info("pausing: " + song);
            pausedFrame = playThread.forceStop();
            log.debug("paused at: " + pausedFrame);
        }
    }

    public synchronized void resume() {
        Song song = getCurrentSong();
        if (song != null && pausedFrame != -1) {
            log.info("resuming from frame " + pausedFrame + ": " + song);
            startPlaying(song, pausedFrame);
        }
    }

    public synchronized boolean isPaused() {
        return pausedFrame != -1;
    }

    /**
     * Retrieves the position in milliseconds of the current audio sample being played.
     *
     * @return current audio position, in milliseconds
     */
    public int getCurrentPosition() {
        return playThread != null ? playThread.getCurrentPosition() : 0;
    }

    public int getCurrentSongIndex() {
        return currentSongIndex;
    }

    public Song getCurrentSong() {
        return currentSongIndex >= 0 ? playlist.get(currentSongIndex) : null;
    }

    private void startPlaying(Song song, int framePosition) {
        try {
            if (currentTrack != null)
                downloadService.cancelDownload(currentTrack, true);
            stopPlaying();
            currentTrack = downloadService.downloadToMemory(song, listener);
            InputStream inputStream = currentTrack.getStore().getInputStream();
            playThread = new PlayThread(inputStream, framePosition, new PlayThreadListener());
            playThread.start();
        } catch (IOException ex) {
            handlePlayException(ex);
        }
    }

    private void stopPlaying() {
        playThread.forceStop();
        currentTrack = null;
        pausedFrame = -1;
    }

    private void handlePlayException(Exception ex) {
        log.error("error playing track " + currentTrack, ex);
        if (listener != null)
            listener.exception(currentTrack, ex);
        stop();
    }


    private class PlayThreadListener implements PlaybackListener {
        @Override public void playbackStarted(MP3Player player, int audioPosition) {
            log.info("playback started: " + currentTrack);
            if (listener != null)
                listener.playbackStarted(currentTrack);
        }

        @Override public void playbackFinished(MP3Player player, int audioPosition) {
            log.info("playback finished: " + currentTrack);
            if (listener != null)
                listener.playbackFinished(currentTrack);
            skipForward();
        }

        @Override public void positionChanged(MP3Player player, int audioPosition) {
            if (listener != null)
                listener.positionChanged(currentTrack, audioPosition);
        }

        @Override public void exception(MP3Player player, Exception ex) {
            handlePlayException(ex);
        }
    }
}
