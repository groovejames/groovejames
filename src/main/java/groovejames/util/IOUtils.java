package groovejames.util;

import org.apache.log4j.Logger;

import java.io.Closeable;
import java.io.IOException;

import static com.google.common.base.Strings.isNullOrEmpty;

public class IOUtils {

    private static final Logger log = Logger.getLogger(IOUtils.class);

    public static void closeQuietly(Closeable closeable) {
        closeQuietly(closeable, null);
    }

    public static void closeQuietly(Closeable closeable, String streamDescription) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException ex) {
                if (!isNullOrEmpty(streamDescription)) {
                    log.error("error closing stream " + streamDescription + ": " + ex);
                } else {
                    log.error("error closing stream: " + ex);
                }
            }
        }
    }
}
