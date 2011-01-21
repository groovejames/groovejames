package groovejames.gui;

import org.apache.pivot.collections.Map;
import org.apache.pivot.wtk.Application;
import org.apache.pivot.wtk.BoxPane;
import org.apache.pivot.wtk.DesktopApplicationContext;
import org.apache.pivot.wtk.Display;
import org.apache.pivot.wtk.Meter;
import org.apache.pivot.wtk.Orientation;
import org.apache.pivot.wtk.Window;

public class LayoutTest implements Application {

    public static void main(String[] args) {
        DesktopApplicationContext.main(LayoutTest.class, args);
    }

    @Override
    public void startup(Display display, Map<String, String> properties) throws Exception {
        Meter meter = new Meter();
        meter.setPercentage(1.0);

        BoxPane boxPane = new BoxPane(Orientation.VERTICAL);
        boxPane.setStyles("{fill:true, backgroundColor:'#00FF00', verticalAlignment:'center'}");
        meter.setPreferredHeight(10);
        boxPane.add(meter);

        Window window = new Window(boxPane);
        window.setMaximized(true);
        window.open(display);
    }

    @Override
    public boolean shutdown(boolean optional) throws Exception {
        return false;
    }

    @Override
    public void suspend() throws Exception {
    }

    @Override
    public void resume() throws Exception {
    }
}
