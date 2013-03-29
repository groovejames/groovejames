package groovejames.gui.action;

import groovejames.service.Services;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Component;

public class SongPlayPauseAction extends Action {

    @Override public void perform(Component source) {
        if (Services.getPlayService().isPaused())
            Services.getPlayService().resume();
        else if (Services.getPlayService().isPlaying())
            Services.getPlayService().pause();
        else
            Services.getPlayService().play();
    }

}
