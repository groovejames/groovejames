package groovejames.gui.action;

import groovejames.gui.Main;
import groovejames.model.Song;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Component;

public class SongKeepAction extends Action {

    private final Main main;

    public SongKeepAction(Main main) {
        this.main = main;
    }

    @Override public void perform(Component source) {
        Sequence<Song> selectedRows = main.getSelectedPlayerSongs();
        for (int i = 0, len = selectedRows.getLength(); i < len; i++) {
            Song selectedSong = selectedRows.get(i);
            main.download(selectedSong);
        }
    }

}
