package groovejames.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

public class CryptUtils {

    private static final MessageDigest md5digest;

    static {
        try {
            md5digest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException("no MD5 digester", ex);
        }
    }

    public static String md5(String s) {
        try {
            return StringUtils.bytesToHexString(md5digest.digest(s.getBytes("UTF-8")));
        } catch (UnsupportedEncodingException ex) {
            // utf-8 always available
            throw new RuntimeException("no UTF-8 decoder available", ex);
        }
    }

    /** @param secret secret key, must have length 16 */
    public static String aesEncrypt(String secret, String plain) {
        try {
            byte[] data = plain.getBytes("UTF-8");
            byte[] encrypted = aesEncryptDecrypt(secret, data, Cipher.ENCRYPT_MODE);
            return StringUtils.bytesToHexString(encrypted);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    /** @param secret secret key, must have length 16 */
    public static String aesDecrypt(String secret, String encrypted) {
        try {
            byte[] data = StringUtils.hexStringToBytes(encrypted);
            byte[] decrypted = aesEncryptDecrypt(secret, data, Cipher.DECRYPT_MODE);
            return new String(decrypted, "UTF-8");
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    private static byte[] aesEncryptDecrypt(String secret, byte[] data, int mode) throws Exception {
        byte[] key = secret.getBytes("UTF-8");
        Cipher c = Cipher.getInstance("AES");
        SecretKeySpec k = new SecretKeySpec(key, "AES");
        c.init(mode, k);
        return c.doFinal(data);
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

}
