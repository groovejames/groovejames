import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import java.io.ByteArrayOutputStream;
import java.security.Key;

public class AntDESPropertyTask extends Task {

    private String name;
    private String encryptedvalue;
    private String deskey;

    public AntDESPropertyTask() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEncryptedvalue() {
        return encryptedvalue;
    }

    public void setEncryptedvalue(String encryptedvalue) {
        this.encryptedvalue = encryptedvalue;
    }

    public String getDeskey() {
        return deskey;
    }

    public void setDeskey(String deskey) {
        this.deskey = deskey;
    }

    public void execute() throws BuildException {
        if (getProject() == null) {
            throw new IllegalStateException("project has not been set");
        }
        if (name == null || encryptedvalue == null || deskey == null) {
            throw new BuildException("You must specify property name, encryptedvalue and deskey", getLocation());
        }
        getProject().setNewProperty(name, decryptDES(encryptedvalue, deskey));
    }

    private static String decryptDES(String encryptedValue, String desKey) {
        try {
            Cipher desCipher = Cipher.getInstance("DES");
            DESKeySpec passwdKeySpec = new DESKeySpec(hexStringToBytes(desKey));
            Key desSecretKey = SecretKeyFactory.getInstance("DES").generateSecret(passwdKeySpec);
            desCipher.init(Cipher.DECRYPT_MODE, desSecretKey);
            return new String(desCipher.doFinal(hexStringToBytes(encryptedValue)));
        }
        catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    private static byte[] hexStringToBytes(String hexStr) {
        ByteArrayOutputStream outBytes = new ByteArrayOutputStream((hexStr.length() + 1) / 2 + 1);
        for (int i = 0; i < hexStr.length(); i += 2) {
            String str = hexStr.substring(i, i + 2);
            byte byt = Integer.valueOf(Integer.parseInt(str, 16)).byteValue();
            outBytes.write(byt);
        }
        return outBytes.toByteArray();
    }
}