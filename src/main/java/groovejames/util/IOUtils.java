package groovejames.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;
import java.io.IOException;

import static com.google.common.base.Strings.isNullOrEmpty;

public class IOUtils {

    private static final Logger log = LoggerFactory.getLogger(IOUtils.class);

    public static void closeQuietly(Closeable closeable) {
        closeQuietly(closeable, null);
    }

    public static void closeQuietly(Closeable closeable, String streamDescription) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException ex) {
                if (!isNullOrEmpty(streamDescription)) {
                    log.error("error closing stream {}: ", streamDescription, ex.toString());
                } else {
                    log.error("error closing stream: {}", ex.toString());
                }
            }
        }
    }
}
