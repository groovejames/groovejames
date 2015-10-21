package groovejames.service.netease;

public enum NESearchType {

    songs(1), albums(10), artists(100), playlists(1000), users(1002), unknown(1009);

    private final int type;

    NESearchType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }
}
