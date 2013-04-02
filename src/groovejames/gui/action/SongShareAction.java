package groovejames.gui.action;

import groovejames.gui.Main;
import groovejames.model.Song;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Component;

public class SongShareAction extends Action {

    private final Main main;

    public SongShareAction(Main main) {
        this.main = main;
    }

    @Override public void perform(Component source) {
        Sequence<Song> selectedRows = main.getSelectedPlayerSongs();
        main.mailSongs(selectedRows);
    }

}
