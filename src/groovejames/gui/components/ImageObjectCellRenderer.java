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
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.ApplicationContext;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.content.TableViewImageCellRenderer;
import org.apache.pivot.wtk.media.Image;
import org.apache.pivot.wtk.media.Picture;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.net.URI;
import java.net.URL;
import java.util.WeakHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static groovejames.util.Util.isEmpty;
import static java.lang.String.format;

public class ImageObjectCellRenderer extends TableViewImageCellRenderer {

    private static final Log log = LogFactory.getLog(ImageObjectCellRenderer.class);
    private static final WeakHashMap<String, WeakReference<Image>> images = new WeakHashMap<String, WeakReference<Image>>();
    private static final ExecutorService executorService = Executors.newFixedThreadPool(3);

    private Image defaultImage;
    private String urlPrefix;

    public ImageObjectCellRenderer() {
        getStyles().put("fill", true);
    }

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
            } catch (TaskExecutionException exception) {
                throw new IllegalArgumentException(exception);
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

    public String getUrlPrefix() {
        return urlPrefix;
    }

    public void setUrlPrefix(String urlPrefix) {
        this.urlPrefix = urlPrefix;
    }

    @Override
    public void render(Object row, int rowIndex, int columnIndex, TableView tableView, String columnName, boolean selected, boolean highlighted, boolean disabled) {
        if (row != null) {
            ImageObject imageObject = (ImageObject) row;
            Image image = imageObject.getImage();
            if (image == null) {
                String filename = imageObject.getImageFilename();
                if (!isEmpty(filename)) {
                    WeakReference<Image> ref = images.get(filename);
                    if (ref != null) {
                        image = ref.get();
                        if (image == null) {
                            startLoadingImage(filename, imageObject, tableView);
                        }
                    } else {
                        startLoadingImage(filename, imageObject, tableView);
                    }
                } else {
                    image = defaultImage;
                }
            }
            setImage(image);
        }
    }

    private void startLoadingImage(final String filename, final ImageObject imageObject, final TableView tableView) {
        if (!imageObject.isLoadingImage()) {
            imageObject.setLoadingImage(true);
            executorService.submit(new Runnable() {
                @Override
                public void run() {
                    Image image;
                    String url = getUrl(filename);
                    try {
                        image = httpGetImage(URI.create(url));
                        if (image == null)
                            image = defaultImage;
                    } catch (IOException ex) {
                        log.error("error downloading image for imageObject " + imageObject + " from url " + url, ex);
                        image = defaultImage;
                    }
                    images.put(filename, new WeakReference<Image>(image));
                    imageObject.setImage(image);
                    imageObject.setLoadingImage(false);
                    tableView.repaint();
                }

                private String getUrl(String filename) {
                    if (!filename.startsWith("http:") && !filename.startsWith("https:")) {
                        if (urlPrefix != null) {
                            return urlPrefix + filename;
                        } else {
                            return filename;
                        }
                    } else {
                        return filename;
                    }
                }

                private Image httpGetImage(URI uri) throws IOException {
                    HttpResponse httpResponse = Services.getHttpClientService().getHttpClient().execute(new HttpGet(uri));
                    HttpEntity httpEntity = httpResponse.getEntity();
                    try {
                        StatusLine statusLine = httpResponse.getStatusLine();
                        int statusCode = statusLine.getStatusCode();
                        if (statusCode == HttpStatus.SC_OK) {
                            InputStream inputStream = httpEntity.getContent();
                            try {
                                BufferedImage image = ImageIO.read(inputStream);
                                return new Picture(image);
                            } finally {
                                inputStream.close();
                            }
                        } else {
                            throw new IOException(format("error loading image: uri=%s, status=%s%n", uri, statusLine));
                        }
                    } finally {
                        httpEntity.consumeContent();
                    }
                }
            });
        }
    }

}
