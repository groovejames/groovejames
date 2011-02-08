package groovejames.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;

public class ByteBuffer {

    private byte buf[];
    private volatile int count;
    private volatile boolean closed;
    private final Object readLock = new Object();

    public ByteBuffer(int size) {
        if (size < 0) {
            throw new IllegalArgumentException("Negative initial size: " + size);
        }
        buf = new byte[size];
    }

    public OutputStream getOutputStream() {
        return new ByteBufferOutputStream();
    }

    public InputStream getInputStream() {
        return new ByteBufferInputStream();
    }

    public synchronized byte[] getBytes() {
        return buf;
    }

    public synchronized int size() {
        return count;
    }


    private class ByteBufferOutputStream extends OutputStream {

        @Override public synchronized void write(int b) throws IOException {
            checkClosed();
            int newcount = count + 1;
            if (newcount > buf.length) {
                buf = Arrays.copyOf(buf, Math.max(buf.length << 1, newcount));
            }
            buf[count] = (byte) b;
            count = newcount;
            notifyWrite();
        }

        @Override public synchronized void write(byte b[], int off, int len) throws IOException {
            checkClosed();
            if ((off < 0) || (off > b.length) || (len < 0) ||
                    ((off + len) > b.length) || ((off + len) < 0)) {
                throw new IndexOutOfBoundsException("off=" + off + "; len=" + len + "; b.length=" + b.length);
            } else if (len == 0) {
                return;
            }
            int newcount = count + len;
            if (newcount > buf.length) {
                buf = Arrays.copyOf(buf, Math.max(buf.length << 1, newcount));
            }
            System.arraycopy(b, off, buf, count, len);
            count = newcount;
            notifyWrite();
        }

        @Override public void close() {
            closed = true;
            notifyWrite();
        }

        private void checkClosed() throws IOException {
            if (closed) {
                throw new IOException("stream is closed");
            }
        }

        private void notifyWrite() {
            synchronized (readLock) {
                readLock.notifyAll();
            }
        }
    }


    private class ByteBufferInputStream extends InputStream {

        private int pos;

        @Override public synchronized int read() throws IOException {
            while (true) {
                if (pos < count)
                    return (buf[pos++] & 0xff);
                else if (closed)
                    return -1;
                else {
                    waitForWrite();
                }
            }
        }

        @Override public synchronized int read(byte b[], int off, int len) throws IOException {
            while (true) {
                if (b == null) {
                    throw new NullPointerException();
                } else if (off < 0 || len < 0 || len > b.length - off) {
                    throw new IndexOutOfBoundsException("off=" + off + "; len=" + len + "; b.length=" + b.length);
                }
                if (pos >= count) {
                    if (closed)
                        return -1;
                    else {
                        waitForWrite();
                        continue;
                    }
                }
                if (pos + len > count) {
                    len = count - pos;
                }
                if (len <= 0) {
                    return 0;
                }
                System.arraycopy(buf, pos, b, off, len);
                pos += len;
                return len;
            }
        }

        private void waitForWrite() throws IOException {
            synchronized (readLock) {
                try {
                    readLock.wait();
                } catch (InterruptedException ex) {
                    throw new IOException(ex);
                }
            }
        }

        @Override public synchronized long skip(long n) {
            if (pos + n > count) {
                n = count - pos;
            }
            if (n < 0) {
                return 0;
            }
            pos += n;
            return n;
        }

        @Override public synchronized int available() {
            return count - pos;
        }

        @Override public boolean markSupported() {
            return false;
        }

        @Override public void mark(int readAheadLimit) {
            throw new UnsupportedOperationException();
        }

        @Override public synchronized void reset() {
            throw new UnsupportedOperationException();
        }

        @Override public void close() {
        }
    }
}