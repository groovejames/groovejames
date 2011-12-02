package groovejames.gui.components;

import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.Keyboard;
import org.apache.pivot.wtk.TableView;

public class TableSelectAllKeyListener extends ComponentKeyListener.Adapter {

    @Override
    public boolean keyPressed(Component component, int keyCode, Keyboard.KeyLocation keyLocation) {
        if (keyCode == Keyboard.KeyCode.A && Keyboard.isPressed(Keyboard.Modifier.CTRL)) {
            ((TableView) component).selectAll();
            return true;
        } else {
            return false;
        }
    }

}
