package groovejames.util;

public class DESTest {
    public static void main(String[] args) {
        if (args.length == 2 && args[0].equals("encrypt"))
            System.out.println(Util.encryptDES(args[1]));
        else if (args.length == 2 && args[0].equals("decrypt"))
            System.out.println(Util.decryptDES(args[1]));
        else
            System.err.println("Usage: DESTest encrypt|decrypt <string>");
    }
}
