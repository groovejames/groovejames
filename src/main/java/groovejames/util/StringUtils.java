package groovejames.util;

import java.io.ByteArrayOutputStream;

public class StringUtils {

    public static boolean isEmpty(String s) {
        return s == null || s.isEmpty();
    }

    public static boolean containsIgnoringCase(String s, String searchString) {
        return searchString == null || searchString.isEmpty()
            || (s != null && (!s.isEmpty() && s.toLowerCase().contains(searchString.toLowerCase())));
    }

    public static int compareNullSafe(String s1, String s2) {
        return s1 == null ? s2 == null ? 0 : Integer.MIN_VALUE : s2 == null ? Integer.MAX_VALUE : s1.compareTo(s2);
    }

    public static String bytesToHexString(byte[] bytes) {
        StringBuilder result = new StringBuilder(bytes.length * 2 + 10);
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    public static byte[] hexStringToBytes(String hexStr) {
        ByteArrayOutputStream outBytes = new ByteArrayOutputStream((hexStr.length() + 1) / 2 + 1);
        for (int i = 0; i < hexStr.length(); i += 2) {
            String str = hexStr.substring(i, i + 2);
            byte byt = Integer.valueOf(Integer.parseInt(str, 16)).byteValue();
            outBytes.write(byt);
        }
        return outBytes.toByteArray();
    }

    public static String repeat(char c, int times) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < times; i++)
            sb.append(c);
        return sb.toString();
    }

    public static String reverse(String s) {
        StringBuilder sb = new StringBuilder(s.length() + 10);
        for (int i = s.length() - 1; i >= 0; i--)
            sb.append(s.charAt(i));
        return sb.toString();
    }

    public static String encodeHex(String s) {
        StringBuilder sb = new StringBuilder(s.length() * 2 + 10);
        for (int i = 0; i < s.length(); i++)
            sb.append(String.format("%02x", (int) s.charAt(i)));
        return sb.toString();
    }

    public static String lpad(String s, char padChar, int length) {
        if (s.length() >= length) return s;
        StringBuilder sb = new StringBuilder(length + 10);
        int numCharsToPad = length - s.length();
        for (int i = 0; i < numCharsToPad; i++)
            sb.append(padChar);
        sb.append(s);
        return sb.toString();
    }

    public static String join(long[] ids, char separator) {
        StringBuilder sb = new StringBuilder();
        for (long id : ids) {
            if (sb.length() > 0) {
                sb.append(separator);
            }
            sb.append(Long.toString(id));
        }
        return sb.toString();
    }
}
