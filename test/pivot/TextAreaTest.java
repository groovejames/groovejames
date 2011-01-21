package pivot;

import org.apache.pivot.collections.Map;
import org.apache.pivot.wtk.Application;
import org.apache.pivot.wtk.DesktopApplicationContext;
import org.apache.pivot.wtk.Display;
import org.apache.pivot.wtk.ScrollPane;
import static org.apache.pivot.wtk.ScrollPane.ScrollBarPolicy.AUTO;
import static org.apache.pivot.wtk.ScrollPane.ScrollBarPolicy.FILL;
import org.apache.pivot.wtk.TextArea;
import org.apache.pivot.wtk.Window;

import java.awt.Color;

/**
 * @see <a href="https://issues.apache.org/jira/browse/PIVOT-485">PIVOT-485</a>
 */
public class TextAreaTest implements Application {

    public static void main(String[] args) {
        DesktopApplicationContext.main(TextAreaTest.class, args);
    }

    public void startup(Display display, Map<String, String> properties) throws Exception {
        final TextArea errorText = new TextArea();
        errorText.setEditable(false);
        errorText.getStyles().put("wrapText", true);
        errorText.getStyles().put("backgroundColor", Color.YELLOW);
        errorText.setText(getLongText());
        ScrollPane scrollPane = new ScrollPane(FILL, AUTO);
        scrollPane.getStyles().put("backgroundColor", Color.BLUE);
        scrollPane.setView(errorText);
        Window window = new Window(scrollPane);
        window.setMaximized(true);
        window.open(display);
    }

    public String getLongText() {
        String s = "I promise I won't use any other GUI toolkit again.";
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 100; i++)
            sb.append('#').append(i).append(' ').append(s).append(' ');
        return sb.toString();
    }

    public boolean shutdown(boolean optional) throws Exception {
        return false;
    }

    public void suspend() throws Exception {
    }

    public void resume() throws Exception {
    }
}
