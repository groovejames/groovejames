package groovejames.util;

import org.apache.log4j.Logger;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.util.concurrent.TaskExecutionException;

import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;

public class Util {

    private static final Logger log = Logger.getLogger(Util.class);

    private static final Pattern QUERY_PARAM_PATTERN = Pattern.compile("([^&=]+)=?([^&=]+)?");

    private static final String desKey = "7b0a2751683f601b";
    private static final Cipher desCipher;
    private static final Key desSecretKey;
    private static final MessageDigest md5digest;
    private static final MessageDigest sha1digest;

    static {
        try {
            desCipher = Cipher.getInstance("DES");
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException("no DES", ex);
        } catch (NoSuchPaddingException ex) {
            throw new RuntimeException("DES error", ex);
        }
        try {
            DESKeySpec passwdKeySpec = new DESKeySpec(hexStringToBytes(desKey));
            desSecretKey = SecretKeyFactory.getInstance("DES").generateSecret(passwdKeySpec);
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException("no DES", ex);
        } catch (InvalidKeyException ex) {
            throw new RuntimeException("invalid key", ex);
        } catch (InvalidKeySpecException ex) {
            throw new RuntimeException("invalid key spec", ex);
        }
        try {
            md5digest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException("no MD5 digester", ex);
        }
        try {
            sha1digest = MessageDigest.getInstance("SHA1");
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException("no SHA1 digester", ex);
        }
    }

    public static String md5(String s) {
        try {
            return bytesToHexString(md5digest.digest(s.getBytes("UTF-8")));
        } catch (UnsupportedEncodingException ex) {
            // utf-8 always available
            throw new RuntimeException("no UTF-8 decoder available", ex);
        }
    }

    public static String sha1(String s) {
        try {
            return bytesToHexString(sha1digest.digest(s.getBytes("UTF-8")));
        } catch (UnsupportedEncodingException ex) {
            // utf-8 always available
            throw new RuntimeException("no UTF-8 decoder available", ex);
        }
    }


    public static String encryptDES(String plainValue) {
        try {
            desCipher.init(Cipher.ENCRYPT_MODE, desSecretKey);
            byte[] desEncryptedData = desCipher.doFinal(plainValue.getBytes());
            return bytesToHexString(desEncryptedData);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public static String decryptDES(String encryptedValue) {
        try {
            Cipher desCipher = Cipher.getInstance("DES");
            desCipher.init(Cipher.DECRYPT_MODE, desSecretKey);
            return new String(desCipher.doFinal(hexStringToBytes(encryptedValue)));
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public static String bytesToHexString(byte[] bytes) {
        StringBuilder result = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            String hex = Integer.toHexString((int) b & 0xFF);
            if (hex.length() == 1)
                result.append('0');
            result.append(hex);
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

    public static byte[] gunzip(byte[] zippedBytes) throws IOException {
        return gunzip(new ByteArrayInputStream(zippedBytes));
    }

    public static byte[] gunzip(InputStream is) throws IOException {
        GZIPInputStream gzis = new GZIPInputStream(is);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int r;
        while ((r = gzis.read(buf)) != -1) {
            baos.write(buf, 0, r);
        }
        gzis.close();
        baos.close();
        return baos.toByteArray();
    }

    public static String createRandomHexNumber(int length) {
        Random random = new Random(System.currentTimeMillis());
        char[] result = new char[length];
        for (int i = 0; i < length; i++) {
            int r = random.nextInt(16);
            result[i] = Integer.toHexString(r).charAt(0);
        }
        return new String(result);
    }

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

    public static String capitalize(String name) {
        if (name == null || name.length() == 0) {
            return name;
        }
        StringBuilder sb = new StringBuilder(name);
        sb.setCharAt(0, Character.toUpperCase(name.charAt(0)));
        return sb.toString();
    }

    public static String decapitalize(String name) {
        if (name == null || name.length() == 0) {
            return name;
        }
        StringBuilder sb = new StringBuilder(name);
        sb.setCharAt(0, Character.toLowerCase(name.charAt(0)));
        return sb.toString();
    }

    /**
     * Coerces a string value to a primitive type.
     *
     * @param value string value, may not be null
     * @param type  result type
     * @return The coerced value
     */
    public static Object coerce(String value, Class<?> type) {
        Object coercedValue;
        if (type == Boolean.class || type == Boolean.TYPE) {
            coercedValue = "1".equals(value) || Boolean.parseBoolean(value);
        } else if (type == Character.class || type == Character.TYPE) {
            if (value.length() == 1) {
                coercedValue = value.charAt(0);
            } else {
                throw new IllegalArgumentException("\"" + value + "\" is not a valid character");
            }
        } else if (type == Byte.class || type == Byte.TYPE) {
            coercedValue = Byte.parseByte(value);
        } else if (type == Short.class || type == Short.TYPE) {
            coercedValue = Short.parseShort(value);
        } else if (type == Integer.class || type == Integer.TYPE) {
            coercedValue = Integer.parseInt(value);
        } else if (type == Long.class || type == Long.TYPE) {
            coercedValue = Long.parseLong(value);
        } else if (type == Float.class || type == Float.TYPE) {
            coercedValue = Float.parseFloat(value);
        } else if (type == Double.class || type == Double.TYPE) {
            coercedValue = Double.parseDouble(value);
        } else {
            coercedValue = value;
        }
        return coercedValue;
    }

    /**
     * Coerces a long value to a primitive type.
     *
     * @param value long value
     * @param type  result type
     * @return The coerced value
     */
    public static Object coerce(long value, Class<?> type) {
        Object coercedValue;
        if (type == Boolean.class || type == Boolean.TYPE) {
            coercedValue = value == 0 ? Boolean.FALSE : Boolean.TRUE;
        } else if (type == Byte.class || type == Byte.TYPE) {
            coercedValue = new Long(value).byteValue();
        } else if (type == Short.class || type == Short.TYPE) {
            coercedValue = new Long(value).shortValue();
        } else if (type == Integer.class || type == Integer.TYPE) {
            coercedValue = new Long(value).intValue();
        } else if (type == Float.class || type == Float.TYPE) {
            coercedValue = new Long(value).floatValue();
        } else if (type == Double.class || type == Double.TYPE) {
            coercedValue = new Long(value).doubleValue();
        } else {
            coercedValue = value;
        }
        return coercedValue;
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
                if (!isEmpty(t.getMessage()))
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

    public static boolean isEmptyDirectory(File dir) {
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            return files != null && files.length == 0;
        }
        return false;
    }

    /**
     * Deletes a file, never throwing an exception.
     * If file is a directory, delete it and all sub-directories.
     * <p/>
     * The difference between File.delete() and this method are:
     * <ul>
     * <li>A directory to be deleted does not have to be empty.</li>
     * <li>No exceptions are thrown when a file or directory cannot be deleted.</li>
     * </ul>
     *
     * @param file file or directory to delete, can be <code>null</code>
     * @return <code>true</code> if the file or directory was deleted, otherwise
     *         <code>false</code>
     */
    public static boolean deleteQuietly(File file) {
        if (file == null) {
            return false;
        }
        try {
            if (file.isDirectory()) {
                cleanDirectory(file);
            }
        } catch (Exception ignore) {
            // intentionally ignored
        }
        try {
            return file.delete();
        } catch (Exception ignore) {
            return false;
        }
    }

    /**
     * Cleans a directory without deleting it.
     *
     * @param directory directory to clean
     * @throws IOException in case cleaning is unsuccessful
     */
    public static void cleanDirectory(File directory) throws IOException {
        if (!directory.exists()) {
            throw new IllegalArgumentException(directory + " does not exist");
        }

        if (!directory.isDirectory()) {
            throw new IllegalArgumentException(directory + " is not a directory");
        }

        File[] files = directory.listFiles();
        if (files == null) {  // null if security restricted
            throw new IOException("Failed to list contents of " + directory);
        }

        IOException exception = null;
        for (File file : files) {
            try {
                forceDelete(file);
            } catch (IOException ioe) {
                exception = ioe;
            }
        }

        if (null != exception) {
            throw exception;
        }
    }

    /**
     * Deletes a directory recursively.
     *
     * @param directory directory to delete
     * @throws IOException in case deletion is unsuccessful
     */
    public static void deleteDirectory(File directory) throws IOException {
        if (!directory.exists()) {
            return;
        }
        cleanDirectory(directory);
        if (!directory.delete()) {
            throw new IOException("Unable to delete directory: " + directory);
        }
    }

    /**
     * Deletes a file. If file is a directory, delete it and all sub-directories.
     * <p/>
     * The difference between File.delete() and this method are:
     * <ul>
     * <li>A directory to be deleted does not have to be empty.</li>
     * <li>You get exceptions when a file or directory cannot be deleted.
     * (java.io.File methods returns a boolean)</li>
     * </ul>
     *
     * @param file file or directory to delete, must not be <code>null</code>
     * @throws NullPointerException  if the directory is <code>null</code>
     * @throws FileNotFoundException if the file was not found
     * @throws IOException           in case deletion is unsuccessful
     */
    public static void forceDelete(File file) throws IOException {
        if (file.isDirectory()) {
            deleteDirectory(file);
        } else {
            boolean filePresent = file.exists();
            if (!file.delete()) {
                if (!filePresent) {
                    throw new FileNotFoundException("File does not exist: " + file);
                }
                throw new IOException("Unable to delete file: " + file);
            }
        }
    }

    public static String durationToString(Double duration) {
        if (duration == null) {
            return "";
        }
        long hour = (long) (duration / 3600.0);
        long min = ((long) (duration / 60.0)) % 60;
        long sec = Math.round(duration) % 60;
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

    public static String urldecode(String s) {
        String r = s, p = null;
        while (!r.equals(p)) {
            p = r;
            try {
                r = URLDecoder.decode(r, "UTF-8");
            } catch (UnsupportedEncodingException ex) {
                throw new RuntimeException("value: " + r, ex);
            }
        }
        return r;
    }

    public static String urlencode(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8");
        } catch (UnsupportedEncodingException ex) {
            throw new RuntimeException("value: " + s, ex);
        }
    }

    public static Map<String, List<String>> parseQueryParams(String uri) throws URISyntaxException {
        URI u = new URI(uri);
        return parseQueryParams(u);
    }

    public static Map<String, List<String>> parseQueryParams(URI uri) {
        String query = uri.getQuery();
        Map<String, List<String>> params = new HashMap<String, List<String>>();
        Matcher m = QUERY_PARAM_PATTERN.matcher(query);
        while (m.find()) {
            String name = urldecode(m.group(1));
            String value = m.groupCount() > 1 ? urldecode(m.group(2)) : null;
            List<String> values = params.get(name);
            if (values == null) {
                values = new LinkedList<String>();
                params.put(name, values);
            }
            if (value != null) {
                values.add(value);
            }
        }
        return params;
    }

    public static String clip(String s, int max) {
        if (s == null)
            return "";
        if (s.length() < max)
            return s;
        if (s.length() <= 3)
            return s;
        if (max <= 3)
            return s;
        return s.substring(0, max - 3) + "...";
    }

    public static String[] filterSystemProperties(String[] args) {
        ArrayList<String> result = new ArrayList<String>(args.length);
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

    public static String readFully(InputStream inputStream, String charsetName, String streamName) {
        InputStreamReader reader = createInputStreamReader(inputStream, charsetName);
        StringWriter sw = new StringWriter();
        char[] buf = new char[1024];
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
                if (!isEmpty(streamDescription)) {
                    log.error("error closing stream " + streamDescription + ": " + ex);
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
