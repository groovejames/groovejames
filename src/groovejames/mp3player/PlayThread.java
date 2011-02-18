package groovejames.mp3player;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

/**
 * Usage:
 * <pre>
 * File mp3File = new File(...);
 * PlayThread playThread = new PlayThread(mp3File);
 * playThread.start();
 * ...
 * int lastFrame = playThread.forceStop(); // stops player, closes file stream
 * ...
 * playThread = new PlayThread(mp3File, lastFrame);
 * playThread.start(); // reopenes stream and resumes play at last position
 * ...
 * playThread.forceStop();
 * </pre>
 */
public class PlayThread extends Thread {

    private final InputStream inputStream;
    private final int firstFrame;
    private final PlaybackListener playbackListener;
    private volatile MP3Player player;
    private volatile boolean stopForced;
    private long estimateDuration;
    private int currentFrameMock;

    public PlayThread() {
        this.inputStream = null;
        this.firstFrame = 0;
        this.playbackListener = null;
    }

    public PlayThread(InputStream inputStream, int firstFrame, PlaybackListener playbackListener) {
        super("player");
        setDaemon(true);
        setPriority(NORM_PRIORITY + 2);
        this.inputStream = inputStream;
        this.firstFrame = firstFrame;
        this.playbackListener = playbackListener;
    }

    /**
     * Set the estimate duration. This is only used when the net is mocked.
     *
     * @param estimateDuration estimate duration, in seconds
     */
    public void setEstimateDuration(Long estimateDuration) {
        this.estimateDuration = estimateDuration != null ? estimateDuration : 180L;
    }

    /**
     * Retrieves the position in milliseconds of the current audio sample being played.
     *
     * @return position, in milliseconds
     */
    public int getCurrentPosition() {
        return player != null ? player.getCurrentAudioDevicePosition() : 0;
    }

    public boolean isStopForced() {
        return stopForced;
    }

    @Override
    public void run() {
        if (inputStream == null)
            return;
        try {
            try {
                if (Boolean.getBoolean("mockNet")) {
                    player = new MP3Player(new ByteArrayInputStream(new byte[0]));
                } else {
                    player = new MP3Player(inputStream);
                }
                LocalPlaybackListener localPlaybackListener = new LocalPlaybackListener();
                if (playbackListener != null)
                    localPlaybackListener.otherListener = playbackListener;
                player.setPlayBackListener(localPlaybackListener);
                if (Boolean.getBoolean("mockNet")) {
                    localPlaybackListener.playbackStarted(player, 0);
                    currentFrameMock = firstFrame;
                    while (currentFrameMock < estimateDuration && !stopForced && !Thread.currentThread().isInterrupted()) {
                        localPlaybackListener.positionChanged(player, currentFrameMock * 1000);
                        sleepInterruptedly(1000);
                        currentFrameMock++;
                    }
                    player.setComplete(currentFrameMock >= estimateDuration);
                    localPlaybackListener.playbackFinished(player, currentFrameMock * 1000);
                } else {
                    player.play(firstFrame, Integer.MAX_VALUE);
                }
            } finally {
                inputStream.close();
            }
        }
        catch (Exception ex) {
            if (playbackListener != null)
                playbackListener.exception(player, ex);
        }
        finally {
            System.out.println("thread ends");
        }
    }

    private void sleepInterruptedly(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException ex) {
            System.out.println("interrupted");
            Thread.currentThread().interrupt();
        }
    }

    public int forceStop() {
        stopForced = true;

        if (Boolean.getBoolean("mockNet"))
            return currentFrameMock;

        int currentFrame = 0;
        if (player != null) {
            synchronized (this) {
                if (player != null) {
                    player.stop();
                    currentFrame = player.getCurrentFrame();
                    player = null;
                }
            }
        }
        return currentFrame;
    }


    private class LocalPlaybackListener implements PlaybackListener {
        private PlaybackListener otherListener;

        @Override public void playbackStarted(MP3Player player, int audioPosition) {
            if (otherListener != null)
                otherListener.playbackStarted(player, audioPosition);
        }

        @Override public void playbackFinished(MP3Player player, int audioPosition) {
            synchronized (PlayThread.this) {
                PlayThread.this.player = null;
            }
            if (otherListener != null)
                otherListener.playbackFinished(player, audioPosition);
        }

        @Override public void positionChanged(MP3Player player, int audioPosition) {
            if (otherListener != null)
                otherListener.positionChanged(player, audioPosition);
        }

        @Override public void exception(MP3Player player, Exception ex) {
            if (otherListener != null)
                otherListener.exception(player, ex);
        }
    }
}