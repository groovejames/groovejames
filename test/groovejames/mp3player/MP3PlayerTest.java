package groovejames.mp3player;

import groovejames.util.ByteBuffer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

public class MP3PlayerTest {
    public static void main(String[] args) throws IOException {
        final File file = new File(args[0]);
        final ByteBuffer byteBuffer = new ByteBuffer(2 * 1024 * 1024);

        Thread playThread = new Thread("play") {
            @Override public void run() {
                try {
                    MP3Player player = new MP3Player(byteBuffer.getInputStream());
                    player.play();
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
            }
        };

        Thread loadThread = new Thread("load") {
            @Override public void run() {
                try {
                    FileInputStream inputStream = new FileInputStream(file);
                    OutputStream outputStream = byteBuffer.getOutputStream();
                    byte[] buf = new byte[10240];
                    int l;
                    while ((l = inputStream.read(buf)) != -1) {
                        outputStream.write(buf, 0, l);
                        Thread.sleep(100);
                    }
                    outputStream.close();
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
            }
        };

        loadThread.start();
        playThread.start();
    }
}
