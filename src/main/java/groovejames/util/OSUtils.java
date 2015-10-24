package groovejames.util;

import org.apache.log4j.Logger;
import org.apache.pivot.collections.ArrayList;

import java.io.IOException;
import java.util.Locale;

import static java.util.Arrays.asList;

public class OSUtils {

    private static final Logger log = Logger.getLogger(OSUtils.class);

    public static boolean isLinux() {
        String osname = System.getProperty("os.name");
        return osname != null && osname.toLowerCase(Locale.US).contains("linux");
    }

    public static void exec(String... args) throws IOException {
        if (args == null)
            throw new IllegalArgumentException("args is null");
        if (args.length < 1)
            throw new IllegalArgumentException("command is missing");
        ProcessBuilder processBuilder = new ProcessBuilder().command(args).redirectErrorStream(true);
        log.debug("starting " + asList(args) + " ...");
        Process process = processBuilder.start();
        new ProcessStreamReader(process.getInputStream(), args[0]).start();
    }

    public static String[] filterSystemProperties(String[] args) {
        ArrayList<String> result = new ArrayList<>(args.length);
        for (String arg : args) {
            if (arg.startsWith("\"") && arg.endsWith("\"")) {
                arg = arg.substring(1, arg.length() - 1);
            }
            if (arg.startsWith("-D")) {
                String[] arr = arg.substring(2).split("=", 2);
                String key = arr[0];
                String value = arr.length > 1 ? arr[1] : "";
                System.setProperty(key, value);
            } else {
                result.add(arg);
            }
        }
        return result.toArray(String[].class);
    }

}
