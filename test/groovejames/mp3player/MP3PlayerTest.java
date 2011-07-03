package groovejames.mp3player;

import groovejames.util.ByteBuffer;
import javazoom.jl.decoder.JavaLayerException;
import javazoom.jl.player.Player;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;

public class MP3PlayerTest {

    public static void main(String[] args) throws IOException, JavaLayerException {
        final File file = new File(args[0]);
        System.out.printf("Playing \"%s\" ...", file.getAbsolutePath());
        playDirectly(file);
//        playUsingByteBuffer(file);
    }

    private static void playDirectly(File file) throws FileNotFoundException, JavaLayerException {
        Player player = new Player(new FileInputStream(file));
        player.play();
    }

    private static void playUsingByteBuffer(final File file) {
        final ByteBuffer byteBuffer = new ByteBuffer(2 * 1024 * 1024);

        Thread playThread = new Thread("play") {
            @Override public void run() {
                try {
                    Player player = new Player(byteBuffer.getInputStream());
                    player.play();
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
            }
        };

        Thread loadThread = new Thread("load") {
            @Override public void run() {
                try {
                    Thread.sleep(2000);
                    FileInputStream inputStream = new FileInputStream(file);
                    OutputStream outputStream = byteBuffer;
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

        playThread.start();
        loadThread.start();
    }
}
