package groovejames.util;

import static groovejames.util.CommonsLoggingOutputStream.Level.ERROR;
import static groovejames.util.CommonsLoggingOutputStream.Level.INFO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.PrintStream;

public class ConsoleUtil {
    private static final Log stderr = LogFactory.getLog("stderr");
    private static final Log stdout = LogFactory.getLog("stdout");

    public static void redirectStdErrToCommonsLogging() {
        System.setErr(new PrintStream(new CommonsLoggingOutputStream(stderr, ERROR)));
    }

    public static void redirectStdOutToCommonsLogging() {
        System.setOut(new PrintStream(new CommonsLoggingOutputStream(stdout, INFO)));
    }
}
