package groovejames.util;

import org.junit.Assert;
import org.junit.Test;

public class AesEncryptDecryptTest {

    @Test
    public void testAesEncryptAesDecrypt() {
        String secret = "1234567890123456";
        String plain = "Hello, World!";
        //System.out.println(plain);
        String encrypted = CryptUtils.aesEncrypt(secret, plain);
        //System.out.println(encrypted);
        String decrypted = CryptUtils.aesDecrypt(secret, encrypted);
        //System.out.println(decrypted);
        Assert.assertEquals(plain, decrypted);
    }

}
