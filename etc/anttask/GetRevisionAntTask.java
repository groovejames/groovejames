import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;
import org.tmatesoft.svn.core.SVNDepth;
import org.tmatesoft.svn.core.SVNException;
import org.tmatesoft.svn.core.internal.wc.DefaultSVNOptions;
import org.tmatesoft.svn.core.wc.ISVNInfoHandler;
import org.tmatesoft.svn.core.wc.SVNClientManager;
import org.tmatesoft.svn.core.wc.SVNInfo;
import org.tmatesoft.svn.core.wc.SVNRevision;
import org.tmatesoft.svn.core.wc.SVNWCClient;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.security.Key;

public class GetRevisionAntTask extends Task {

    private File path;
    private String username;
    private String encryptedpassword;
    private String deskey;
    private String property;
    private File svnconfigdir;

    public GetRevisionAntTask() {
    }

    public File getPath() {
        return path;
    }

    public void setPath(File path) {
        this.path = path;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEncryptedpassword() {
        return encryptedpassword;
    }

    public void setEncryptedpassword(String encryptedpassword) {
        this.encryptedpassword = encryptedpassword;
    }

    public String getDeskey() {
        return deskey;
    }

    public void setDeskey(String deskey) {
        this.deskey = deskey;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public File getSvnconfigdir() {
        return svnconfigdir;
    }

    public void setSvnconfigdir(File svnconfigdir) {
        this.svnconfigdir = svnconfigdir;
    }

    public void execute() throws BuildException {
        if (getProject() == null) {
            throw new IllegalStateException("project has not been set");
        }
        if (path == null || username == null || encryptedpassword == null || deskey == null || property == null) {
            throw new BuildException("You must specify properties path, username, encryptedpassword, deskey and property", getLocation());
        }
        getProject().log("determining maximum revision number below path: " + path.getAbsolutePath(), Project.MSG_VERBOSE);
        String password = decryptDES(encryptedpassword, deskey);
        try {
            DefaultSVNOptions options = new DefaultSVNOptions(svnconfigdir, true);
            options.setAuthStorageEnabled(false);
            SVNClientManager svnClientManager = SVNClientManager.newInstance(options, username, password);
            SVNWCClient wcClient = svnClientManager.getWCClient();
            MaxRevisionSVNInfoHandler handler = new MaxRevisionSVNInfoHandler();
            wcClient.doInfo(path, SVNRevision.UNDEFINED, SVNRevision.UNDEFINED, SVNDepth.INFINITY, null, handler);
            getProject().log("setting property " + property + " = " + handler.getMaxRevision(), Project.MSG_VERBOSE);
            getProject().setNewProperty(property, String.valueOf(handler.getMaxRevision()));
        } catch (SVNException ex) {
            throw new BuildException(ex);
        }
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


    private static class MaxRevisionSVNInfoHandler implements ISVNInfoHandler {
        private long maxRevision = 0L;

        @Override public void handleInfo(SVNInfo info) throws SVNException {
            if (info.getRevision().getNumber() > maxRevision)
                maxRevision = info.getRevision().getNumber();
        }

        public long getMaxRevision() {
            return maxRevision;
        }
    }
}