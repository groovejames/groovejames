package groovejames.mp3player;

import groovejames.util.ByteBuffer;
import javazoom.jl2.player.MP3Player;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class MP3PlayerTest {

    public static final File TRACK1 = new File("src/test/resources/track1.mp3");
    public static final File TRACK2 = new File("src/test/resources/track2.mp3");

    private static volatile PlayThread playThread;

    public static void main(String[] args) throws IOException {
        playUsingByteBuffer(TRACK2);

        boolean paused = false;
        while (true) {
            System.out.printf((paused ? "paused" : "running") + ": press return to " + (paused ? "resume" : "pause") + ", enter 'e' to exit.");
            String line = new BufferedReader(new InputStreamReader(System.in)).readLine();
            if (line != null && line.trim().equalsIgnoreCase("e")) System.exit(0);
            if (paused) {
                playThread = playThread.unpause();
            } else {
                playThread.pause();
            }
            paused = !paused;
        }
    }

    private static void playUsingByteBuffer(final File file) {
        final ByteBuffer byteBuffer = new ByteBuffer(2 * 1024 * 1024);

        System.err.printf("playing \"%s\" ...%n", file.getAbsolutePath());

        LoadThread loadThread = new LoadThread(file, byteBuffer);
        playThread = new PlayThread(byteBuffer);

        playThread.setOnFinished(new Runnable() {
            @Override public void run() {
                playUsingByteBuffer(file == TRACK1 ? TRACK2 : TRACK1);
            }
        });

        loadThread.start();
        playThread.start();
    }

    private static class PlayThread extends Thread {
        private static volatile int instance;
        private final ByteBuffer byteBuffer;
        private MP3Player player;
        private int currentFrame;
        private Runnable onFinished;
        private boolean paused;

        public PlayThread(ByteBuffer byteBuffer) {
            super("PlayThread#" + instance++);
            this.byteBuffer = byteBuffer;
        }

        public void setOnFinished(Runnable onFinished) {
            this.onFinished = onFinished;
        }

        @Override public void run() {
            try {
                player = new MP3Player(byteBuffer.getInputStream());
                player.play(currentFrame, Integer.MAX_VALUE);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
            System.err.println(this + " ends.");
            if (!paused)
                onFinished.run();
        }

        public void pause() {
            this.paused = true;
            player.stop();
            this.currentFrame = player.getCurrentFrame();
        }

        public PlayThread unpause() {
            PlayThread playThread = new PlayThread(byteBuffer);
            playThread.currentFrame = this.currentFrame;
            playThread.onFinished = this.onFinished;
            playThread.start();
            return playThread;
        }
    }

    private static class LoadThread extends Thread {
        private static volatile int instance;
        private final File file;
        private final ByteBuffer byteBuffer;

        public LoadThread(File file, ByteBuffer byteBuffer) {
            super("LoadThread#" + instance++);
            this.file = file;
            this.byteBuffer = byteBuffer;
        }

        @Override public void run() {
            try {
                Thread.sleep(500);
                FileInputStream inputStream = new FileInputStream(file);
                byte[] buf = new byte[10240];
                int l;
                while ((l = inputStream.read(buf)) != -1) {
                    byteBuffer.write(buf, 0, l);
                    Thread.sleep(100);
                }
                byteBuffer.close();
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
            System.err.println(this + " ends.");
        }
    }
}
