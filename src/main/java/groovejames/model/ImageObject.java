package groovejames.model;

import org.apache.pivot.wtk.media.Image;

public interface ImageObject {

    String getImageURL();

    Image getImage();

    void setImage(Image image);

    boolean isLoadingImage();

    void setLoadingImage(boolean loadingImage);

}
