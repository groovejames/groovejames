package groovejames.util;

public class Crypter {
    public static void main(String[] args) {
        switch (checkArgs(args)) {
            case "encrypt":
                System.out.println(CryptUtils.aesEncrypt(args[1], args[2]));
                break;
            case "decrypt":
                System.out.println(CryptUtils.aesDecrypt(args[1], args[2]));
                break;
            case "usage":
                System.err.println("Usage: Crypter --encrypt|-e <secret> <plaintext>");
                System.err.println("       Crypter --decrypt|-d <secret> <chiffre>");
                System.exit(1);
                break;
        }
        System.exit(0);
    }

    private static String checkArgs(String[] args) {
        if (args.length != 3) return "usage";
        if (args[0].equals("--encrypt") || args[0].equals("-e")) return "encrypt";
        if (args[0].equals("--decrypt") || args[0].equals("-d")) return "decrypt";
        return "usage";
    }

}
