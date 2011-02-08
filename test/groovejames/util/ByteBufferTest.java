package groovejames.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class ByteBufferTest {

    public static void main(String[] args) {
        final ByteBuffer buf = new ByteBuffer(1);

        new Thread("read") {
            @Override public void run() {
                try {
                    read(buf);
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
            }
        }.start();

        new Thread("write") {
            @Override public void run() {
                try {
                    write(buf);
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
            }
        }.start();
    }

    private static void read(ByteBuffer buf) throws IOException {
        InputStream is = buf.getInputStream();

        // read single byte
        System.out.println("Wait 500ms for single byte...");
        long startTime = System.currentTimeMillis();
        int b = is.read();
        long elapsed = System.currentTimeMillis() - startTime;
        assertBetween(500L, 600L, elapsed);
        assertEquals(b, 42);

        // read byte array
        System.out.println("Wait 500ms for 5 bytes...");
        startTime = System.currentTimeMillis();
        byte[] bytes = new byte[10];
        int cnt = is.read(bytes);
        elapsed = System.currentTimeMillis() - startTime;
        assertBetween(500L, 600L, elapsed);
        assertEquals(5, cnt);
        assertEquals(47, bytes[0]);
        assertEquals(11, bytes[1]);
        assertEquals(0, bytes[2]);
        assertEquals(8, bytes[3]);
        assertEquals(15, bytes[4]);

        // wait for end of stream
        System.out.println("Wait 500ms for end of stream...");
        startTime = System.currentTimeMillis();
        cnt = is.read(bytes, 0, 3);
        elapsed = System.currentTimeMillis() - startTime;
        assertBetween(500L, 600L, elapsed);
        assertEquals(-1, cnt);

        // test getBytes()
        bytes = buf.getBytes();
        assertEquals(6, bytes.length);
        assertEquals(42, bytes[0]);
        assertEquals(47, bytes[1]);
        assertEquals(11, bytes[2]);
        assertEquals(0, bytes[3]);
        assertEquals(8, bytes[4]);
        assertEquals(15, bytes[5]);

        System.out.println("All tests ok.");
    }

    private static void write(ByteBuffer buf) throws IOException, InterruptedException {
        OutputStream os = buf.getOutputStream();

        // write single byte after 500ms
        Thread.sleep(500);
        os.write(42);

        // write 5 bytes after 500ms
        Thread.sleep(500);
        os.write(new byte[]{47, 11, 0, 8, 15});

        // close stream after 500ms
        Thread.sleep(500);
        os.close();

        // check close
        try {
            os.write(42);
            throw new AssertionError("expected IOException");
        } catch (IOException ex) {
            // expected
        }
    }

    private static void assertEquals(int expected, int value) {
        if (expected != value) {
            throw new AssertionError("expected: " + expected + "; got: " + value);
        }
    }

    private static void assertBetween(long lowerBound, long upperBound, long value) {
        if (value < lowerBound || value > upperBound) {
            throw new AssertionError("expected: value in [" + lowerBound + "," + upperBound + "]; got: " + value);
        }
    }
}
