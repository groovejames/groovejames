package groovejames.gui.action;

import groovejames.service.Services;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Component;

public class SongPreviousAction extends Action {
    @Override public void perform(Component source) {
        Services.getPlayService().skipBackward();
    }
}
