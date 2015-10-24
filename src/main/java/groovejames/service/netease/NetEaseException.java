package groovejames.service.netease;

public class NetEaseException extends Exception {

    private final int code;

    public NetEaseException(int code, String message) {
        super(message + " (code " + code + ")");
        this.code = code;
    }

    public int getCode() {
        return code;
    }

}
