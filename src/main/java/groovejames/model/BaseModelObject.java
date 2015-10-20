package groovejames.model;

import org.apache.pivot.wtk.media.Image;

public abstract class BaseModelObject implements ImageObject, Relevance {

    protected volatile Image image;
    protected volatile boolean loadingImage;
    protected volatile Double relevance;

    @Override
    public abstract String getImageURL();

    @Override
    public Image getImage() {
        return image;
    }

    @Override
    public void setImage(Image image) {
        this.image = image;
    }

    @Override
    public boolean isLoadingImage() {
        return loadingImage;
    }

    @Override
    public void setLoadingImage(boolean loadingImage) {
        this.loadingImage = loadingImage;
    }

    @Override
    public Double getRelevance() {
        return relevance;
    }

    @Override
    public void setRelevance(Double relevance) {
        this.relevance = relevance;
    }
}
