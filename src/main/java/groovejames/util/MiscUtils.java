package groovejames.util;

import org.apache.pivot.util.concurrent.TaskExecutionException;

import java.lang.reflect.InvocationTargetException;
import java.util.Set;

/** utility methods that don't fit elsewhere. */
public class MiscUtils {

    public static long[] convert(Set<Long> longs) {
        long[] result = new long[longs.size()];
        int i = 0;
        for (Long l : longs) {
            result[i++] = l;
        }
        return result;
    }

    public static String toErrorString(Throwable t, String separator) {
        StringBuilder result = new StringBuilder();
        while (true) {
            if (t instanceof TaskExecutionException) {
                t = t.getCause();
            } else if (t instanceof InvocationTargetException) {
                t = ((InvocationTargetException) t).getTargetException();
            } else {
                result.append(t.getClass().getSimpleName());
                if (!StringUtils.isEmpty(t.getMessage()))
                    result.append(": ").append(t.getMessage());
                if (t.getCause() != t && t.getCause() != null) {
                    result.append(separator);
                    t = t.getCause();
                } else {
                    break;
                }
            }
        }
        return result.toString().trim();
    }

    /** @param duration a duration in milliseconds, or {@code null} */
    public static String durationToString(Integer duration) {
        if (duration == null) {
            return "";
        }
        int hour = duration / 3600;
        int min = duration / 60 % 60;
        int sec = duration % 60;
        StringBuilder sb = new StringBuilder();
        if (hour > 0) {
            if (hour < 10) {
                sb.append('0');
            }
            sb.append(hour);
            sb.append(':');
        }
        if (min < 10) {
            sb.append('0');
        }
        sb.append(min);
        sb.append(':');
        if (sec < 10) {
            sb.append('0');
        }
        sb.append(sec);
        return sb.toString();
    }
}
