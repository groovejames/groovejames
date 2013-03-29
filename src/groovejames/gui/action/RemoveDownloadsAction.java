package groovejames.gui.action;

import groovejames.gui.Main;
import groovejames.model.Track;
import groovejames.service.Services;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Component;

import java.util.Iterator;

public class RemoveDownloadsAction extends Action {

    private final Main main;
    private final boolean selectedOnly;
    private final boolean successfulOnly;
    private final boolean removeFromDisc;

    public RemoveDownloadsAction(Main main, boolean selectedOnly, boolean successfulOnly, boolean removeFromDisc) {
        this.main = main;
        this.selectedOnly = selectedOnly;
        this.successfulOnly = successfulOnly;
        this.removeFromDisc = removeFromDisc;
    }

    @Override @SuppressWarnings("unchecked")
    public void perform(Component source) {
        Sequence<Track> selectedTracks = selectedOnly ? main.getSelectedDownloadTracks() : new ArrayList<Track>();
        Iterator<Track> it = main.getDownloadTracks().iterator();
        while (it.hasNext()) {
            Track track = it.next();
            if ((selectedOnly && selectedTracks.indexOf(track) != -1)
                || (!selectedOnly && successfulOnly && track.getStatus().isSuccessful())
                || (!selectedOnly && !successfulOnly && track.getStatus().isFinished())) {
                Services.getDownloadService().cancelDownload(track, removeFromDisc);
                it.remove();
                selectedTracks.remove(track);
            }
        }
    }
}
