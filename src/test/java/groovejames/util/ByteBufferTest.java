package groovejames.util;

import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

import static java.lang.String.format;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class ByteBufferTest {

    @Test
    public void testByteBuffers() throws Exception {
        final ByteBuffer buf = new ByteBuffer(1);
        final Exception[] threadException = new Exception[1];

        Thread readThread = new Thread("read") {
            @Override
            public void run() {
                try {
                    read(buf);
                } catch (Exception ex) {
                    threadException[0] = ex;
                    throw new RuntimeException(ex);
                }
            }
        };

        Thread writeThread = new Thread("write") {
            @Override
            public void run() {
                try {
                    write(buf);
                } catch (Exception ex) {
                    threadException[0] = ex;
                    throw new RuntimeException(ex);
                }
            }
        };

        readThread.start();
        writeThread.start();
        readThread.join();

        if (threadException[0] != null)
            throw threadException[0];
    }

    private static void read(ByteBuffer buf) throws IOException {
        InputStream is = buf.getInputStream();

        // read single byte
        System.out.println("Wait 1000ms for single byte...");
        long startTime = System.currentTimeMillis();
        int b = is.read();
        long elapsed = System.currentTimeMillis() - startTime;
        assertBetween(900L, 1100L, elapsed);
        assertEquals(b, 42);

        // read byte array
        System.out.println("Wait 1000ms for 5 bytes...");
        startTime = System.currentTimeMillis();
        byte[] bytes = new byte[10];
        int cnt = is.read(bytes);
        elapsed = System.currentTimeMillis() - startTime;
        assertBetween(900L, 1100L, elapsed);
        assertEquals(5, cnt);
        assertEquals(47, bytes[0]);
        assertEquals(11, bytes[1]);
        assertEquals(0, bytes[2]);
        assertEquals(8, bytes[3]);
        assertEquals(15, bytes[4]);

        // wait for end of stream
        System.out.println("Wait 1000ms for end of stream...");
        startTime = System.currentTimeMillis();
        cnt = is.read(bytes, 0, 3);
        elapsed = System.currentTimeMillis() - startTime;
        assertBetween(900L, 1100L, elapsed);
        assertEquals(-1, cnt);

        // test getBytes()
        bytes = buf.toByteArray();
        assertEquals(6, bytes.length);
        assertEquals(42, bytes[0]);
        assertEquals(47, bytes[1]);
        assertEquals(11, bytes[2]);
        assertEquals(0, bytes[3]);
        assertEquals(8, bytes[4]);
        assertEquals(15, bytes[5]);
    }

    private static void write(ByteBuffer os) throws IOException, InterruptedException {
        // write single byte after 1000ms
        Thread.sleep(1000);
        os.write(42);

        // write 5 bytes after 1000ms
        Thread.sleep(1000);
        os.write(new byte[] {47, 11, 0, 8, 15});

        // close stream after 1000ms
        Thread.sleep(1000);
        os.close();
    }

    private static void assertBetween(long lowerBound, long upperBound, long value) {
        if (value < lowerBound || value > upperBound) {
            fail(format("expected: value in [%d,%d]; got: %d", lowerBound, upperBound, value));
        }
    }
}
