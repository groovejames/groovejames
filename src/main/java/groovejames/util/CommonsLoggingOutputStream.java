package groovejames.util;

import org.apache.commons.logging.Log;

import java.io.IOException;
import java.io.OutputStream;

public class CommonsLoggingOutputStream extends OutputStream {

    public static enum Level {
        FATAL, ERROR, WARN, INFO, DEBUG, TRACE
    }

    private final Log log;
    private final Level level;
    private final String prefix;
    private char[] buf = new char[1024];
    private int count;

    public CommonsLoggingOutputStream(Log log, Level level) {
        this(log, level, null);
    }

    public CommonsLoggingOutputStream(Log log, Level level, String prefix) {
        this.log = log;
        this.level = level;
        this.prefix = prefix;
    }

    @Override
    public void write(int b) throws IOException {
        if (level == Level.TRACE && !log.isTraceEnabled()) return;
        if (level == Level.DEBUG && !log.isDebugEnabled()) return;
        if (level == Level.INFO && !log.isInfoEnabled()) return;
        if (level == Level.WARN && !log.isWarnEnabled()) return;
        if (level == Level.ERROR && !log.isErrorEnabled()) return;
        if (level == Level.FATAL && !log.isFatalEnabled()) return;
        if (b == '\r') return;

        if (b == '\n')
            flush();
        else {
            int newcount = count + 1;
            if (newcount > buf.length) {
                char newbuf[] = new char[Math.max(buf.length << 1, newcount)];
                System.arraycopy(buf, 0, newbuf, 0, count);
                buf = newbuf;
            }
            buf[count] = (char) b;
            count = newcount;
        }
    }

    @Override
    public void flush() throws IOException {
        String s = new String(buf, 0, count);
        if (s.length() > 0) {
            if (prefix != null)
                s = prefix + s;
            switch (level) {
                case TRACE:
                    log.trace(s);
                    break;
                case DEBUG:
                    log.debug(s);
                    break;
                case INFO:
                    log.info(s);
                    break;
                case WARN:
                    log.warn(s);
                    break;
                case ERROR:
                    log.error(s);
                    break;
                case FATAL:
                    log.fatal(s);
                    break;
            }
        }
        count = 0;
    }

    @Override
    public void close() throws IOException {
        flush();
    }
}
