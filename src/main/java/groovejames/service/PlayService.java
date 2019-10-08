package groovejames.service;

import groovejames.model.Song;
import groovejames.model.Track;
import javazoom.jl2.player.MP3Player;
import javazoom.jl2.player.PlayThread;
import javazoom.jl2.player.PlaybackListener;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.LinkedList;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.wtk.ApplicationContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.EventQueue;
import java.io.IOException;
import java.io.InputStream;

public class PlayService {

    public enum AddMode {
        NOW, NEXT, LAST, REPLACE
    }

    private static final Logger log = LoggerFactory.getLogger(PlayService.class);

    /**
     * how many bytes to pre-download before actually begin playing
     */
    private static final long PLAY_BUFFER_SIZE = 100000L;

    private final DownloadService downloadService;
    private final ArrayList<Song> playlist = new ArrayList<>();
    private int currentSongIndex = -1;
    private Track currentTrack;
    private int pausedFrame = -1;
    private PlayServiceListener listener;
    private PlayThread playThread;
    private boolean radio;

    public PlayService(DownloadService downloadService) {
        this.downloadService = downloadService;
        this.playThread = new PlayThread();
    }

    public void setListener(PlayServiceListener listener) {
        this.listener = listener;
    }

    public ArrayList<Song> getPlaylist() {
        return playlist;
    }

    public synchronized void add(final Sequence<Song> songs, final AddMode addMode) {
        if (songs.getLength() == 0) {
            return;
        }
        if (addMode == AddMode.REPLACE) {
            clearPlaylist();
        }
        int insertIdx = (addMode == AddMode.LAST ? playlist.getLength() : currentSongIndex + 1);
        for (int i = 0; i < songs.getLength(); i++) {
            Song song = songs.get(i);
            log.info("adding: {}", song);
            insertIdx = addSong(song, insertIdx);
            if (i == 0 && (addMode == AddMode.NOW || addMode == AddMode.REPLACE)) {
                currentSongIndex = insertIdx;
            }
            insertIdx++;
        }
        if (addMode == AddMode.NOW || addMode == AddMode.REPLACE) {
            Song song = songs.get(0);
            stopPlaying();
            startPlaying(song, 0);
        }
    }

    private int addSong(Song song, int insertIdx) {
        SongAdder songAdder = new SongAdder(song, insertIdx);
        if (EventQueue.isDispatchThread())
            songAdder.run();
        else
            ApplicationContext.queueCallback(songAdder, /*wait*/ true); // must wait to get the new insertedIdx
        return songAdder.getNewInsertIdx();
    }

    public synchronized void play() {
        if (currentSongIndex < 0 && !playlist.isEmpty())
            currentSongIndex = 0;
        Song currentSong = getCurrentSong();
        if (currentSong != null) {
            log.info("starting: {}", currentSong);
            startPlaying(currentSong, 0);
        } else {
            log.info("no current song");
        }
    }

    public synchronized void stop() {
        Song currentSong = getCurrentSong();
        if (currentSong != null) log.info("stopping: {}", currentSong);
        stopPlaying();
    }

    public synchronized void skipForward() {
        Song currentSong = getCurrentSong();
        if (currentSong != null) log.info("stopping because of skip: {}", currentSong);
        stopPlaying();
        skipToNext();
    }

    public synchronized void skipBackward() {
        Song currentSong = getCurrentSong();
        if (currentSong != null) log.info("stopping because of skip: {}", currentSong);
        stopPlaying();
        skipToPrevious();
    }

    public synchronized void pause() {
        Song currentSong = getCurrentSong();
        if (currentSong != null && !playThread.isStopForced()) {
            log.info("pausing: {}", currentSong);
            pausedFrame = playThread.forceStop();
            try {
                playThread.join();
            } catch (InterruptedException e) {
                // ignored
            }
            log.debug("paused at frame: {}, audioPosition: {}", pausedFrame, playThread.getCurrentPosition());
            if (listener != null)
                listener.playbackPaused(currentTrack);
        }
    }

    public synchronized void resume() {
        Song currentSong = getCurrentSong();
        if (currentSong != null && pausedFrame != -1) {
            log.info("resuming from frame: {}: {}", pausedFrame, currentSong);
            startPlaying(currentSong, pausedFrame);
            pausedFrame = -1;
        }
    }

    public synchronized boolean isPaused() {
        return pausedFrame != -1;
    }

    public synchronized boolean isPlaying() {
        return playThread.isAlive();
    }

    public void pauseOrResume() {
        if (isPlaying()) pause();
        else if (isPaused()) resume();
    }

    public void clearPlaylist() {
        stopPlaying();
        currentSongIndex = -1;
        playlist.clear();
    }

    /**
     * Retrieves the position in milliseconds of the current audio sample being played.
     *
     * @return current audio position, in milliseconds
     */
    public int getCurrentPosition() {
        return playThread.getCurrentPosition();
    }

    /**
     * @return the index of the song being played currently
     */
    public int getCurrentSongIndex() {
        return currentSongIndex;
    }

    public synchronized void playSong(int songIndex) {
        if (songIndex == currentSongIndex)
            return;
        if (songIndex < 0 || songIndex >= playlist.getLength()) {
            log.error("playSong: index out of bounds: {}; must be in range [0,{})", songIndex, playlist.getLength());
            return;
        }
        Song currentSong = getCurrentSong();
        if (currentSong != null)
            log.info("stopping because of song index change to {}: {}", songIndex, currentSong);
        stopPlaying();
        currentSongIndex = songIndex;
        currentSong = getCurrentSong();
        log.info("skipping to song index {}: {}", songIndex, currentSong);
        startPlaying(currentSong, 0);
    }

    /**
     * @return the track being played currently
     */
    public Track getCurrentTrack() {
        return currentTrack;
    }

    public void setRadio(boolean radio) {
        if (!radio) { // switch off radio
            this.radio = false;
            return;
        }
        // to enable radio playlist must not be empty
        if (playlist.isEmpty())
            return;
        this.radio = true;
        addNextRadioSong();
    }

    private Song getCurrentSong() {
        return currentSongIndex >= 0 ? playlist.get(currentSongIndex) : null;
    }

    private void startPlaying(final Song song, final int framePosition) {
        if (currentTrack != null && currentTrack.getSong() != song)
            stopPlaying();
        log.info("starting from {}: {}", framePosition, song);
        if (currentTrack == null || currentTrack.getSong() != song) {
            currentTrack = downloadService.downloadToMemory(song, new ChainedPlayServiceListener(listener) {
                @Override
                public void downloadedBytesChanged(Track track) {
                    if (!isPlaying() && !isPaused() && track == currentTrack && track.getDownloadedBytes() > PLAY_BUFFER_SIZE) {
                        startPlayingCurrentTrack(framePosition);
                    }
                    super.downloadedBytesChanged(track);
                }
            });
        } else {
            startPlayingCurrentTrack(framePosition);
        }
    }

    private void startPlayingCurrentTrack(int framePosition) {
        try {
            InputStream inputStream = currentTrack.getStore().getInputStream();
            playThread = new PlayThread(inputStream, framePosition);
            playThread.setPlaybackListener(new PlayThreadListener(currentTrack));
            playThread.start();
        } catch (IOException ex) {
            handlePlayException(currentTrack, ex);
        }
    }

    private void stopPlaying() {
        int stopFrame = playThread.forceStop();
        playThread.interrupt();
        try {
            playThread.join();
        } catch (InterruptedException ignore) {
            // intentionally ignored
        }
        if (stopFrame == 0 && currentTrack != null) // player didn't start yet
            if (listener != null)
                listener.playbackFinished(currentTrack);
        if (currentTrack != null)
            downloadService.cancelDownload(currentTrack, true);
        currentTrack = null;
        pausedFrame = -1;
    }

    private void skipToNext() {
        if (currentSongIndex < playlist.getLength() - 1) {
            currentSongIndex++;
            Song currentSong = getCurrentSong();
            log.info("skipping forward to: {}", currentSong);
            startPlaying(currentSong, 0);
        } else {
            log.info("skipped beyond end of playlist");
            if (radio) {
                addNextRadioSong();
                skipToNext();
            }
        }
    }

    private void skipToPrevious() {
        if (currentSongIndex > 0) {
            currentSongIndex--;
            Song currentSong = getCurrentSong();
            log.info("skipping back to: {}", currentSong);
            startPlaying(currentSong, 0);
        } else {
            log.info("skipped beyond start of playlist");
        }
    }

    private void addNextRadioSong() {
        try {
            log.info("fetching next radio song...");
            Song[] nextRadioSongs = Services.getSearchService().autoplayGetSongs(playlist);
            add(new LinkedList<>(nextRadioSongs), AddMode.LAST);
        } catch (Exception ex) {
            log.error("error fetching next songs for radio", ex);
        }
    }

    private void handlePlayException(Track track, Exception ex) {
        log.error("error playing track {}", track, ex);
        if (listener != null)
            listener.exception(track, ex);
        stop();
    }


    /**
     * This class performs the complicated task of adding a song to the playlist.
     * Since the playlist is a (Pivot) observable ArrayList, modifications to the
     * list must be done from the event dispatch thread, so that's why this class
     * is a Runnable which will be scheduled on EDT in
     * {@link PlayService#addSong(Song, int)}.
     */
    private class SongAdder implements Runnable {
        private final Song song;
        private final int insertIdx;
        private int newInsertIdx;

        private SongAdder(Song song, int insertIdx) {
            this.song = song;
            this.insertIdx = insertIdx;
        }

        @Override
        public void run() {
            if (insertIdx < playlist.getLength()) {
                playlist.insert(song, insertIdx);
                newInsertIdx = insertIdx;
            } else {
                newInsertIdx = playlist.add(song);
            }
        }

        int getNewInsertIdx() {
            return newInsertIdx;
        }
    }


    private class PlayThreadListener implements PlaybackListener {
        private final Track track;

        private PlayThreadListener(Track track) {
            this.track = track;
        }

        @Override
        public void playbackStarted(MP3Player player, int audioPosition) {
            log.info("playback started: {}", track);
            if (listener != null) listener.playbackStarted(track);
        }

        @Override
        public void playbackFinished(MP3Player player, int audioPosition) {
            log.info("playback finished: {}", track);
            if (listener != null) listener.playbackFinished(track);
            if (player.isComplete()) skipToNext();
        }

        @Override
        public void positionChanged(MP3Player player, int audioPosition) {
            if (listener != null) listener.positionChanged(track, (int) player.getCurrentPosition());
        }

        @Override
        public void exception(MP3Player player, Exception ex) {
            handlePlayException(track, ex);
        }
    }

    private static abstract class ChainedPlayServiceListener implements PlayServiceListener {
        private final PlayServiceListener origListener;

        private ChainedPlayServiceListener(PlayServiceListener origListener) {
            this.origListener = origListener;
        }

        @Override
        public void playbackStarted(Track track) {
            if (origListener != null) origListener.playbackStarted(track);
        }

        @Override
        public void playbackPaused(Track track) {
            if (origListener != null) origListener.playbackPaused(track);
        }

        @Override
        public void playbackFinished(Track track) {
            if (origListener != null) origListener.playbackFinished(track);
        }

        @Override
        public void positionChanged(Track track, int audioPosition) {
            if (origListener != null) origListener.positionChanged(track, audioPosition);
        }

        @Override
        public void exception(Track track, Exception ex) {
            if (origListener != null) origListener.exception(track, ex);
        }

        @Override
        public void statusChanged(Track track) {
            if (origListener != null) origListener.statusChanged(track);
        }

        @Override
        public void downloadedBytesChanged(Track track) {
            if (origListener != null) origListener.downloadedBytesChanged(track);
        }
    }
}
