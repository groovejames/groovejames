package groovejames.util;

import org.apache.log4j.Logger;

import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;

public class IOUtils {

    private static final Logger log = Logger.getLogger(IOUtils.class);

    public static String readFully(InputStream inputStream, String charsetName, String streamName) {
        char[] buf = new char[1024];
        InputStreamReader reader = createInputStreamReader(inputStream, charsetName);
        StringWriter sw = new StringWriter();
        int r;
        try {
            while ((r = reader.read(buf)) != -1) {
                sw.write(buf, 0, r);
            }
        } catch (IOException ex) {
            throw new RuntimeException("error reading from stream " + streamName, ex);
        } finally {
            closeQuietly(reader, streamName);
            closeQuietly(sw);
        }
        return sw.toString();
    }

    public static void closeQuietly(Closeable closeable) {
        closeQuietly(closeable, null);
    }

    public static void closeQuietly(Closeable closeable, String streamDescription) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException ex) {
                if (!StringUtils.isEmpty(streamDescription)) {
                    log.error("error closing stream " + streamDescription + ": " + ex);
                } else {
                    log.error("error closing stream: " + ex);
                }
            }
        }
    }

    private static InputStreamReader createInputStreamReader(InputStream inputStream, String charsetName) {
        try {
            return new InputStreamReader(inputStream, charsetName);
        } catch (UnsupportedEncodingException ex) {
            throw new RuntimeException("unsupported encoding: " + charsetName, ex);
        }
    }
}
