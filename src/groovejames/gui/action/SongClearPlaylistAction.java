package groovejames.gui.action;

import groovejames.gui.Main;
import groovejames.service.Services;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Component;

public class SongClearPlaylistAction extends Action {

    private final Main main;

    public SongClearPlaylistAction(Main main) {
        this.main = main;
    }

    @Override public void perform(Component source) {
        Services.getPlayService().clearPlaylist();
        main.resetPlayInfo();
    }

}
