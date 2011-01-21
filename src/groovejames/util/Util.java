package groovejames.util;

import org.apache.pivot.util.concurrent.TaskExecutionException;

import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Random;
import java.util.zip.GZIPInputStream;

public class Util {

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
        }
        catch (NoSuchAlgorithmException ex) {
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
        }
        catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public static String decryptDES(String encryptedValue) {
        try {
            Cipher desCipher = Cipher.getInstance("DES");
            desCipher.init(Cipher.DECRYPT_MODE, desSecretKey);
            return new String(desCipher.doFinal(hexStringToBytes(encryptedValue)));
        }
        catch (Exception ex) {
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

    public static String createRandomLettersAndNumbersOfLength(int length) {
        Random random = new Random(System.currentTimeMillis());
        char[] result = new char[length];
        for (int i = 0; i < length; i++) {
            int r = random.nextInt(36);
            result[i] = r < 10 ? Character.forDigit(r, 10) : Character.toChars('a' + (r - 10))[0];
        }
        return new String(result);
    }

    public static boolean isEmpty(String s) {
        return s == null || s.isEmpty();
    }

    public static boolean containsIgnoringCase(String s, String searchString) {
        return s == null || searchString == null || searchString.isEmpty() || !s.isEmpty()
                && s.toLowerCase().contains(searchString.toLowerCase());
    }

    public static int compareNullSafe(String s1, String s2) {
        return s1 == null ? s2 == null ? 0 : Integer.MIN_VALUE
                : s2 == null ? Integer.MAX_VALUE : s1.compareTo(s2);
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
     * @param value string value
     * @param type  result type
     * @return The coerced value
     */
    public static Object coerce(String value, Class<?> type) {
        Object coercedValue;
        if (type == Boolean.class || type == Boolean.TYPE) {
            coercedValue = Boolean.parseBoolean(value);
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

    public static String toErrorString(Throwable t) {
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
                    result.append("\nReason: ");
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
}