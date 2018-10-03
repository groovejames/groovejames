package groovejames.service.netease;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum NESearchType {

    songs(1), albums(10), artists(100), playlists(1000), users(1002), unknown(1009);

    private final int type;

    NESearchType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    @JsonCreator
    public static NESearchType safeValueOf(String string) {
        try {
            return NESearchType.valueOf(string);
        } catch (IllegalArgumentException e) {
            return unknown;
        }
    }
}
