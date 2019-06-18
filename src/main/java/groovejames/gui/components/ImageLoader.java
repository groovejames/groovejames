package groovejames.gui.components;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import groovejames.gui.WtkUtil;
import groovejames.model.ImageObject;
import groovejames.service.Services;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.util.EntityUtils;
import org.apache.pivot.wtk.ApplicationContext;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.media.Image;
import org.apache.pivot.wtk.media.Picture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static com.google.common.base.Strings.isNullOrEmpty;
import static java.lang.String.format;

public class ImageLoader {

    private static final Logger log = LoggerFactory.getLogger(ImageLoader.class);

    private static final Cache<String, Image> imageCache = CacheBuilder.newBuilder().softValues().build();
    private static final Cache<String, Set<ImageTarget>> imageTargetCache = CacheBuilder.newBuilder().maximumSize(20000).build();
    private static final ExecutorService executorService = Executors.newFixedThreadPool(6);

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
        Image defaultImage = WtkUtil.getIcon(defaultImageURL);
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
            if (!isNullOrEmpty(imageURL)) {
                image = imageCache.getIfPresent(imageURL);
                if (image == null) {
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

    private synchronized void startLoadingImage(final String url, ImageObject imageObject, Component target) {
        if (!imageObject.isLoadingImage()) {
            imageObject.setLoadingImage(true);
            Set<ImageTarget> imageTargets = imageTargetCache.getIfPresent(url);
            if (imageTargets == null) {
                imageTargets = new HashSet<>();
                imageTargetCache.put(url, imageTargets);
                executorService.submit(new ImageUrlLoadTask(url, defaultImage));
            }
            imageTargets.add(new ImageTarget(imageObject, target));
        }
    }


    private static class ImageUrlLoadTask implements Runnable {
        private final String url;
        private final Image defaultImage;

        public ImageUrlLoadTask(String url, Image defaultImage) {
            this.url = url;
            this.defaultImage = defaultImage;
        }

        @Override
        public void run() {
            Image image;
            try {
                image = httpGetImage(url);
            } catch (IOException ex) {
                log.error("error downloading image from url {}", url, ex);
                image = defaultImage;
            }
            imageCache.put(url, image);
            notifyImageTargetsImageAvailable(image);
        }

        private Image httpGetImage(String uri) throws IOException {
            log.debug("getting image {}", uri);
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

        private void notifyImageTargetsImageAvailable(Image image) {
            Set<ImageTarget> imageTargets1 = imageTargetCache.getIfPresent(url);
            if (imageTargets1 != null) {
                for (final ImageTarget imageTarget : imageTargets1) {
                    imageTarget.imageObject.setImage(image);
                    imageTarget.imageObject.setLoadingImage(false);
                    ApplicationContext.queueCallback(new Runnable() {
                        @Override
                        public void run() {
                            imageTarget.target.repaint();
                        }
                    });
                }
                imageTargetCache.invalidate(url);
            }
        }
    }


    private static class ImageTarget {
        private final ImageObject imageObject;
        private final Component target;

        private ImageTarget(ImageObject imageObject, Component target) {
            this.imageObject = imageObject;
            this.target = target;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ImageTarget that = (ImageTarget) o;
            return imageObject.equals(that.imageObject) && target.equals(that.target);

        }

        @Override
        public int hashCode() {
            int result = imageObject.hashCode();
            result = 31 * result + target.hashCode();
            return result;
        }
    }

}
