package groovejames.gui.components;

import org.apache.pivot.wtk.media.Image;

import java.io.IOException;
import java.net.URI;

public interface ImageGetter {
    Image httpGetImage(URI uri) throws IOException;
}
