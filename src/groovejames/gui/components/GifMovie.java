package groovejames.gui.components;

import org.apache.pivot.wtk.media.Movie;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.image.ImageObserver;
import java.io.File;
import java.io.IOException;
import java.net.URL;

/**
 * A movie component that can display animated gif files.
 */
public class GifMovie extends Movie {

    private Image img;
    private volatile boolean isPlaying = true;

    public void setFile(File file) throws IOException {
        this.img = Toolkit.getDefaultToolkit().createImage(file.getAbsolutePath());
    }

    public void setURL(URL url) throws IOException {
        this.img = Toolkit.getDefaultToolkit().createImage(url);
    }

    @Override public int getTotalFrames() {
        return 1;
    }

    @Override public int getWidth() {
        WidthFetcher imageObserver = new WidthFetcher();
        int width = img.getWidth(imageObserver);
        if (width == -1) {
            width = imageObserver.getValue();
        }
        return width;
    }

    @Override public int getHeight() {
        HeightFetcher imageObserver = new HeightFetcher();
        int height = img.getHeight(imageObserver);
        if (height == -1) {
            height = imageObserver.getValue();
        }
        return height;
    }

    @Override public void play() {
        isPlaying = true;
        movieListeners.movieStarted(this);
        // send a dummy sizeChanged event so that the component gets repainted
        movieListeners.sizeChanged(this, 0, 0);
    }

    @Override public void stop() {
        isPlaying = false;
        movieListeners.movieStopped(this);
    }

    @Override public boolean isPlaying() {
        return isPlaying;
    }

    @Override public void paint(Graphics2D g) {
        g.drawImage(img, 0, 0, new ImageObserver() {
            @Override public boolean imageUpdate(Image img, int infoflags, int x, int y, int width, int height) {
                if (isPlaying) {
                    movieListeners.regionUpdated(GifMovie.this, x, y, width, height);
                    return true;
                } else {
                    return false;
                }
            }
        });
    }


    private static abstract class ValueFetcher implements ImageObserver {
        private volatile int value = -1;

        protected void setValue(int value) {
            this.value = value;
            synchronized (this) {
                notifyAll();
            }
        }

        public int getValue() {
            if (value == -1) {
                try {
                    synchronized (this) {
                        wait();
                    }
                } catch (InterruptedException ex) {
                    if (value == -1) {
                        value = 0; // return 0 from now on
                    }
                }
            }
            return value;
        }
    }


    private static class WidthFetcher extends ValueFetcher {
        @Override public boolean imageUpdate(Image img, int infoflags, int x, int y, int width, int height) {
            boolean hasWidth = (infoflags & WIDTH) != 0;
            if (hasWidth) {
                setValue(width);
            }
            return hasWidth;
        }
    }


    private static class HeightFetcher extends ValueFetcher {
        @Override public boolean imageUpdate(Image img, int infoflags, int x, int y, int width, int height) {
            boolean hasHeight = (infoflags & HEIGHT) != 0;
            if (hasHeight) {
                setValue(height);
            }
            return hasHeight;
        }
    }
}
