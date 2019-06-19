package groovejames.gui.action;

import groovejames.gui.Main;
import groovejames.model.Track;
import groovejames.service.Services;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Component;

import java.util.Iterator;

import static groovejames.gui.action.RemoveDownloadsAction.Mode.ALL;
import static groovejames.gui.action.RemoveDownloadsAction.Mode.SELECTED;
import static groovejames.gui.action.RemoveDownloadsAction.Mode.SUCESSFUL;

public class RemoveDownloadsAction extends Action {

    private final Main main;

    public enum Mode {SELECTED, SUCESSFUL, ALL}

    private final Mode mode;

    public RemoveDownloadsAction(Main main, Mode mode) {
        this.main = main;
        this.mode = mode;
        setEnabled(false);
    }

    @Override
    public void perform(Component source) {
        Sequence<Track> selectedTracks = mode == SELECTED ? main.getSelectedDownloadTracks() : new ArrayList<Track>();
        Iterator<Track> it = main.getDownloadTracks().iterator();
        while (it.hasNext()) {
            Track track = it.next();
            boolean isSelected = mode == SELECTED && selectedTracks.indexOf(track) != -1;
            if (mode == SELECTED && isSelected
                || mode == SUCESSFUL && track.getStatus().isSuccessful()
                || mode == ALL && track.getStatus().isFinished()) {
                Services.getDownloadService().cancelDownload(track, isSelected || !track.getStatus().isSuccessful());
                it.remove();
                selectedTracks.remove(track);
            }
        }
    }
}
