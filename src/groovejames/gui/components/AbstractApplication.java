package groovejames.gui.components;

import org.apache.pivot.wtk.Application;

public abstract class AbstractApplication implements Application {

    @Override public boolean shutdown(boolean optional) throws Exception {
        return false;
    }

    @Override public void suspend() throws Exception {
    }

    @Override public void resume() throws Exception {
    }

}
