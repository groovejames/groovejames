package groovejames.util;

public class AesEncryptDecryptTest {

    public static void main(String[] args) {
        String secret = "1234567890123456";
        String plain = "Hello, World!";
        System.out.println(plain);
        String encrypted = Util.aesEncrypt(secret, plain);
        System.out.println(encrypted);
        String decrypted = Util.aesDecrypt(secret, encrypted);
        System.out.println(decrypted);
        if (!plain.equals(decrypted)) throw new AssertionError("expected: " + plain + "; got: " + decrypted);
    }

}
