package groovejames.gui;

import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Vote;
import org.apache.pivot.wtk.Application;
import org.apache.pivot.wtk.BoxPane;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.ButtonPressListener;
import org.apache.pivot.wtk.CardPane;
import org.apache.pivot.wtk.CardPaneListener;
import org.apache.pivot.wtk.DesktopApplicationContext;
import org.apache.pivot.wtk.Display;
import org.apache.pivot.wtk.Label;
import org.apache.pivot.wtk.Orientation;
import org.apache.pivot.wtk.PushButton;
import org.apache.pivot.wtk.Window;
import org.apache.pivot.wtk.content.ButtonData;
import org.apache.pivot.wtk.skin.CardPaneSkin;

public class CardPaneTest implements Application {

    public static void main(String[] args) {
        DesktopApplicationContext.main(CardPaneTest.class, args);
    }

    @Override
    public void startup(Display display, Map<String, String> properties) throws Exception {
        final CardPane cardPane = new CardPane();
        cardPane.getStyles().put("selectionChangeEffect", CardPaneSkin.SelectionChangeEffect.HORIZONTAL_SLIDE);
        cardPane.add(new Label("CardPane #0"));
        cardPane.add(new Label("CardPane #1"));
        cardPane.getCardPaneListeners().add(new CardPaneListener() {
            @Override
            public Vote previewSelectedIndexChange(CardPane cardPane, int selectedIndex) {
                System.out.printf("previewSelectedIndexChange(selectedIndex=%d)%n", selectedIndex);
                return Vote.APPROVE;
            }

            @Override
            public void selectedIndexChangeVetoed(CardPane cardPane, Vote reason) {
                System.out.printf("selectedIndexChangeVetoed(reason=%s)%n", reason);
            }

            @Override
            public void selectedIndexChanged(CardPane cardPane, int previousSelectedIndex) {
                System.out.printf("selectedIndexChanged(previousSelectedIndex=%d)%n", previousSelectedIndex);
            }
        });

        PushButton button = new PushButton(new ButtonData("switch CardPane"));
        button.getButtonPressListeners().add(new ButtonPressListener() {
            @Override
            public void buttonPressed(Button button) {
                // show cardpane #1
                cardPane.setSelectedIndex(1);
                // do some task that runs under 250ms, eg the following:
                try {
                    Thread.sleep(100);
                } catch (InterruptedException ignore) {
                }
                // show cardpane #0 again
                cardPane.setSelectedIndex(0);
            }
        });

        BoxPane boxPane = new BoxPane(Orientation.VERTICAL);
        boxPane.add(button);
        boxPane.add(cardPane);
        Window window = new Window(boxPane);
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
