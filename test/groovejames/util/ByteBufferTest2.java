package groovejames.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class ByteBufferTest2 {
    public static void main(String[] args) throws InterruptedException, IOException {
        final File fIn = new File(args[0]);
        final File fOut = new File(args[1]);
        final ByteBuffer buf = new ByteBuffer(2 * 1024 * 1024);

        System.out.printf("reading %s%n", fIn);
        System.out.printf("writing %s%n", fOut);

        Thread readThread = new Thread("read_fIn") {
            @Override public void run() {
                try {
                    InputStream inputStream = new FileInputStream(fIn);
                    OutputStream outputStream = buf.getOutputStream();
                    copy(inputStream, outputStream, 100);
                    outputStream.close();
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
            }
        };

        Thread writeThread = new Thread("write_fOut") {
            @Override public void run() {
                try {
                    InputStream inputStream = buf.getInputStream();
                    OutputStream outputStream = new FileOutputStream(fOut);
                    copy(inputStream, outputStream, 0);
                    outputStream.close();
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
            }
        };

        readThread.start();
        writeThread.start();
        readThread.join();

        System.out.println("comparing");
        if (fIn.length() != fOut.length())
            throw new AssertionError("fIn.length: " + fIn.length() + " fOut.length: " + fOut.length());
        InputStream isIn = new FileInputStream(fIn);
        InputStream isOut = new FileInputStream(fOut);
        long pos = 0;
        int bIn, bOut;
        do {
            bIn = isIn.read();
            bOut = isOut.read();
            if (bIn != bOut)
                throw new AssertionError("at: " + pos + " bIn: " + bIn + " bOut: " + bOut);
            pos++;
        } while (bIn != -1);
        pos--;
        if (pos != fIn.length())
            throw new AssertionError("file.length: " + fIn.length() + "; pos: " + pos);
        System.out.println("equal");
    }

    private static void copy(InputStream inputStream, OutputStream outputStream, long delay) throws IOException, InterruptedException {
        byte[] buf = new byte[10204];
        int l;
        while ((l = inputStream.read(buf)) != -1) {
            outputStream.write(buf, 0, l);
            Thread.sleep(delay);
        }
    }
}
