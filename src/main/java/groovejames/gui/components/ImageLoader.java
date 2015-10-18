package groovejames.gui.components;

import groovejames.model.ImageObject;
import groovejames.service.Services;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.util.EntityUtils;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.ApplicationContext;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.media.Image;
import org.apache.pivot.wtk.media.Picture;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.net.URL;
import java.util.WeakHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static groovejames.util.Util.isEmpty;
import static java.lang.String.format;

public class ImageLoader {

    private static final Log log = LogFactory.getLog(ImageLoader.class);

    private static final WeakHashMap<String, WeakReference<Image>> images = new WeakHashMap<>();
    private static final ExecutorService executorService = Executors.newFixedThreadPool(5);

    private Image defaultImage;

    public Image getDefaultImage() {
        return defaultImage;
    }

    public void setDefaultImage(Image defaultImage) {
        this.defaultImage = defaultImage;
    }

    public void setDefaultImage(URL defaultImageURL) {
        if (defaultImageURL == null) {
            throw new IllegalArgumentException("defaultImageURL is null.");
        }
        Image defaultImage = (Image) ApplicationContext.getResourceCache().get(defaultImageURL);
        if (defaultImage == null) {
            try {
                defaultImage = Image.load(defaultImageURL);
            } catch (TaskExecutionException ex) {
                throw new IllegalArgumentException(ex);
            }
            ApplicationContext.getResourceCache().put(defaultImageURL, defaultImage);
        }
        setDefaultImage(defaultImage);
    }

    public void setDefaultImage(String defaultImageName) {
        if (defaultImageName == null) {
            throw new IllegalArgumentException("defaultImageName is null.");
        }
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        setDefaultImage(classLoader.getResource(defaultImageName));
    }

    public Image getImage(ImageObject imageObject, Component target) {
        Image image = imageObject.getImage();
        if (image == null) {
            String imageURL = imageObject.getImageURL();
            if (!isEmpty(imageURL)) {
                WeakReference<Image> ref = images.get(imageURL);
                if (ref != null) {
                    image = ref.get();
                    if (image == null) {
                        startLoadingImage(imageURL, imageObject, target);
                    }
                } else {
                    startLoadingImage(imageURL, imageObject, target);
                }
            } else {
                image = defaultImage;
            }
        }
        return image;
    }

    public Image getImageIgnoringCache(ImageObject imageObject, Component target) {
        String imageURL = imageObject.getImageURL();
        startLoadingImage(imageURL, imageObject, target);
        return imageObject.getImage();
    }

    private void startLoadingImage(final String url, final ImageObject imageObject, final Component target) {
        if (!imageObject.isLoadingImage()) {
            imageObject.setLoadingImage(true);
            executorService.submit(new Runnable() {
                @Override
                public void run() {
                    Image image;
                    try {
                        image = httpGetImage(url);
                        if (image == null) {
                            image = defaultImage;
                        }
                    } catch (IOException ex) {
                        log.error("error downloading image for imageObject " + imageObject + " from url " + url, ex);
                        image = defaultImage;
                    }
                    images.put(url, new WeakReference<>(image));
                    imageObject.setImage(image);
                    imageObject.setLoadingImage(false);
                    ApplicationContext.queueCallback(new Runnable() {
                        @Override
                        public void run() {
                            target.repaint();
                        }
                    });
                }
            });
        }
    }

    private Image httpGetImage(String uri) throws IOException {
        log.debug(format("getting image %s", uri));
        HttpResponse httpResponse = Services.getHttpClientService().getHttpClient().execute(new HttpGet(uri));
        HttpEntity httpEntity = httpResponse.getEntity();
        try {
            StatusLine statusLine = httpResponse.getStatusLine();
            int statusCode = statusLine.getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                try (InputStream inputStream = httpEntity.getContent()) {
                    BufferedImage image = ImageIO.read(inputStream);
                    return new Picture(image);
                }
            } else {
                throw new IOException(format("error loading image: uri=%s, status=%s%n", uri, statusLine));
            }
        } finally {
            EntityUtils.consume(httpEntity);
        }
    }

}
