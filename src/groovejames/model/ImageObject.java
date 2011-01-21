package groovejames.model;

import org.apache.pivot.wtk.media.Image;

public abstract class ImageObject {

    protected volatile Image image;
    protected volatile boolean loadingImage;

    public abstract String getImageFilename();
    
    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public boolean isLoadingImage() {
        return loadingImage;
    }

    public void setLoadingImage(boolean loadingImage) {
        this.loadingImage = loadingImage;
    }
}
