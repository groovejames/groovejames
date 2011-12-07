package groovejames.gui;

import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Map;
import org.apache.pivot.wtk.Application;
import org.apache.pivot.wtk.ApplicationContext;
import org.apache.pivot.wtk.BoxPane;
import org.apache.pivot.wtk.DesktopApplicationContext;
import org.apache.pivot.wtk.Display;
import org.apache.pivot.wtk.MovieView;
import org.apache.pivot.wtk.Orientation;
import org.apache.pivot.wtk.Window;
import org.apache.pivot.wtk.media.Movie;
import org.w3c.dom.Node;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.stream.ImageInputStream;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Iterator;

// see https://forums.oracle.com/forums/thread.jspa?threadID=1269862   !!!!

// see http://www.java2s.com/Code/Java/SWT-JFace-Eclipse/DisplayananimatedGIF.htm
// see http://www.webreference.com/content/studio/disposal.html
public class AnimatedGifTest implements Application {

    public static void main(String[] args) throws IOException {
        System.setProperty("http.proxyHost", "myproxy");
        System.setProperty("http.proxyPort", "8080");
        DesktopApplicationContext.main(AnimatedGifTest.class, args);
    }

    @Override
    public void startup(Display display, Map<String, String> properties) throws Exception {
        GifMovie gifMovie = new GifMovie();
//        gifMovie.setURL(new URL("http://www.animated-gifs.eu/avatars-100x100-humor/0003.gif"));
        gifMovie.setURL(new URL("http://www.animated-gifs.eu/avatars-100x100-humor/0016.gif"));

        MovieView movieView = new MovieView();
        movieView.setMovie(gifMovie);

        BoxPane boxPane = new BoxPane(Orientation.VERTICAL);
        boxPane.setStyles("{fill:true, backgroundColor:'#A0A0A0', verticalAlignment:'center'}");
        boxPane.add(movieView);

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


/**
 * @see <a href="http://www.daniweb.com/software-development/java/threads/177666">ImageObserver and Animated GIFs</a>
 */
class GifMovie extends Movie {

    private static class Frame {
        enum DisposalMethod {
            none, doNotDispose, restoreToBackgroundColor, restoreToPrevious,
            undefinedDisposalMethod4, undefinedDisposalMethod5, undefinedDisposalMethod6, undefinedDisposalMethod7
        }

        BufferedImage img;
        int x, y, w, h, delay;
        DisposalMethod disposalMethod;
    }

    private int width;
    private int height;
    private final ArrayList<Frame> frames = new ArrayList<Frame>();
    private Thread frameThread = null;
    private final Runnable nextFrameCallback = new NextFrameCallback();

    public void setFile(File file) throws IOException {
        load(new FileInputStream(file), file.getAbsolutePath());
    }

    public void setURL(URL url) throws IOException {
        load(url.openStream(), url.toString());
    }

    public void setInputStream(InputStream inputStream) throws IOException {
        load(inputStream, "<unspecified input stream>");
    }

    private void load(InputStream inputStream, String description) throws IOException {
        stop();
        int oldWidth = width;
        int oldHeight = height;
        frames.clear();
        width = 0;
        height = 0;
        ImageInputStream imageInputStream = ImageIO.createImageInputStream(inputStream);
        try {
            Iterator<ImageReader> imageReaders = ImageIO.getImageReaders(imageInputStream);
            if (!imageReaders.hasNext())
                throw new RuntimeException("no image reader found which is able to read from " + description);
            ImageReader imageReader = imageReaders.next();
            imageReader.setInput(imageInputStream);
            XPath xPath = XPathFactory.newInstance().newXPath();
            int frameNo = 0;
            while (true) {
                Frame frame = new Frame();
                try {
                    frame.img = imageReader.read(frameNo);
                } catch (IndexOutOfBoundsException e) {
                    break; // no more frames
                }
                write(frame.img, frameNo);
                // read frame size and delay from metadata
                // see http://docs.oracle.com/javase/6/docs/api/javax/imageio/metadata/doc-files/gif_metadata.html
                IIOMetadata imageMetadata = imageReader.getImageMetadata(frameNo);
                Node node = imageMetadata.getAsTree("javax_imageio_gif_image_1.0");
                try {
                    frame.x = Integer.parseInt(xPath.evaluate("ImageDescriptor/@imageLeftPosition", node));
                    frame.y = Integer.parseInt(xPath.evaluate("ImageDescriptor/@imageTopPosition", node));
                    frame.w = Integer.parseInt(xPath.evaluate("ImageDescriptor/@imageWidth", node));
                    frame.h = Integer.parseInt(xPath.evaluate("ImageDescriptor/@imageHeight", node));
                    frame.delay = Integer.parseInt(xPath.evaluate("GraphicControlExtension/@delayTime", node));
                    frame.disposalMethod = Frame.DisposalMethod.valueOf(xPath.evaluate("GraphicControlExtension/@disposalMethod", node));
                    System.err.printf("%d: delay %d %s%n", frameNo, frame.delay, frame.disposalMethod);
                    if (frame.delay == 0 || frame.delay == 1)
                        frame.delay = 10; // sanity checks
                } catch (XPathExpressionException ex) {
                    throw new RuntimeException(ex);
                }
                frames.add(frame);
                width = Math.max(frame.w, width);
                height = Math.max(frame.h, height);
                frameNo++;
            }
            setCurrentFrame(0);
            setLooping(true);
            movieListeners.sizeChanged(this, oldWidth, oldHeight);
            play();
        } finally {
            imageInputStream.close();
            inputStream.close();
        }
    }

    @Override public int getTotalFrames() {
        return frames.getLength();
    }

    @Override public int getWidth() {
        return width;
    }

    @Override public int getHeight() {
        return height;
    }

    @Override public void setCurrentFrame(int currentFrame) {
        super.setCurrentFrame(currentFrame);
        Frame frame = frames.get(currentFrame);
        movieListeners.regionUpdated(this, frame.x, frame.y, frame.w - 1, frame.h - 1);
    }

    @Override public void play() {
        if (frameThread != null) {
            throw new IllegalStateException("Movie is already playing.");
        }
        frameThread = new Thread(nextFrameCallback);
        frameThread.start();
        movieListeners.movieStarted(this);
    }

    @Override public void stop() {
        if (frameThread != null) {
            frameThread.interrupt();
        }
        frameThread = null;
        movieListeners.movieStopped(this);
    }

    @Override public boolean isPlaying() {
        return (frameThread != null);
    }

    Frame previousFrame;

    @Override public void paint(Graphics2D g) {
        int currentFrame = getCurrentFrame();
        if (currentFrame >= 0) {
            Frame frame = frames.get(currentFrame);
            if (frame.disposalMethod == Frame.DisposalMethod.restoreToPrevious && previousFrame != null) {
                paintFrame(previousFrame, g);
            }
            paintFrame(frame, g);
            if (frame.disposalMethod == Frame.DisposalMethod.none || frame.disposalMethod == Frame.DisposalMethod.doNotDispose) {
                previousFrame = frame;
            }
        }
    }

    private void paintFrame(Frame frame, Graphics2D g) {
        g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_IN, 1.0f));
        g.drawImage(frame.img, new AffineTransformOp(new AffineTransform(), AffineTransformOp.TYPE_BILINEAR), frame.x, frame.y);
    }

    private class NextFrameCallback implements Runnable {
        private int currentFrame = -1;

        @Override
        public void run() {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    if (currentFrame == getTotalFrames() - 1) {
                        if (isLooping()) {
                            currentFrame = 0;
                            setCurrentFrameAndSleep();
                        } else {
                            stop();
                            break;
                        }
                    } else {
                        ++currentFrame;
                        setCurrentFrameAndSleep();
                    }
                }
            } catch (InterruptedException ex) {
                stop();
            }
        }

        private void setCurrentFrameAndSleep() throws InterruptedException {
            ApplicationContext.queueCallback(new Runnable() {
                @Override public void run() {
                    setCurrentFrame(currentFrame);
                }
            }, true);
            int currentDelayMillis = frames.get(currentFrame).delay * 10;
            Thread.sleep(currentDelayMillis);
        }
    }

    private static void write(BufferedImage img, int frameNo) throws IOException {
        String filename = "C:\\dev\\temp\\gif" + frameNo + ".gif";
        ImageIO.write(img, "gif", new File(filename));
        System.err.printf("wrote %s%n", filename);
    }
}
