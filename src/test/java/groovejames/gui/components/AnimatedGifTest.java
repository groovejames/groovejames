package groovejames.gui.components;

import org.apache.pivot.collections.Map;
import org.apache.pivot.wtk.BoxPane;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.ButtonPressListener;
import org.apache.pivot.wtk.DesktopApplicationContext;
import org.apache.pivot.wtk.Display;
import org.apache.pivot.wtk.MovieView;
import org.apache.pivot.wtk.Orientation;
import org.apache.pivot.wtk.PushButton;
import org.apache.pivot.wtk.Window;
import org.apache.pivot.wtk.content.ButtonData;

import java.io.IOException;
import java.net.URL;

public class AnimatedGifTest extends AbstractApplication {

    public static void main(String[] args) throws IOException {
        System.setProperty("http.proxyHost", "bns04px-vm");
        System.setProperty("http.proxyPort", "80");
        DesktopApplicationContext.main(AnimatedGifTest.class, args);
    }

    @Override
    public void startup(Display display, Map<String, String> properties) throws Exception {
        final GifMovie gifMovie = new GifMovie();
//        gifMovie.setURL(new URL("http://www.animated-gifs.eu/avatars-100x100-humor/0003.gif"));
        gifMovie.setURL(new URL("http://www.animated-gifs.eu/avatars-100x100-humor/0016.gif"));
//        gifMovie.setURL(new URL("http://exchangecode.com/robert/images/bleedingedge_noodleincident.gif"));

        MovieView movieView = new MovieView();
        movieView.setMovie(gifMovie);

        PushButton startStopButton = new PushButton("Stop");
        startStopButton.setToggleButton(true);
        startStopButton.setSelected(true);
        startStopButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override public void buttonPressed(Button button) {
                if (button.isSelected()) {
                    button.setButtonData(new ButtonData("Stop"));
                    gifMovie.play();
                } else {
                    button.setButtonData(new ButtonData("Start"));
                    gifMovie.stop();
                }
            }
        });

        BoxPane boxPane = new BoxPane(Orientation.VERTICAL);
        boxPane.setStyles("{fill:true, backgroundColor:'#A0A0A0', verticalAlignment:'center'}");
        boxPane.add(movieView);
        boxPane.add(startStopButton);

        Window window = new Window(boxPane);
        window.setMaximized(true);
        window.open(display);
    }

}
