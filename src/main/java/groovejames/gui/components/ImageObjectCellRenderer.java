package groovejames.gui.components;

import groovejames.model.ImageObject;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.content.TableViewImageCellRenderer;
import org.apache.pivot.wtk.media.Image;

import java.net.URL;

@SuppressWarnings("unused")
public class ImageObjectCellRenderer extends TableViewImageCellRenderer {

    private final ImageLoader imageLoader;

    public ImageObjectCellRenderer() {
        getStyles().put("fill", true);
        imageLoader = new ImageLoader();
    }

    public Image getDefaultImage() {
        return imageLoader.getDefaultImage();
    }

    public void setDefaultImage(Image defaultImage) {
        imageLoader.setDefaultImage(defaultImage);
    }

    public void setDefaultImage(URL defaultImageURL) {
        imageLoader.setDefaultImage(defaultImageURL);
    }

    public void setDefaultImage(String defaultImageName) {
        imageLoader.setDefaultImage(defaultImageName);
    }

    @Override
    public void render(Object row, int rowIndex, int columnIndex, TableView tableView, String columnName, boolean selected, boolean highlighted, boolean disabled) {
        if (row != null) {
            ImageObject imageObject = (ImageObject) row;
            Image image = imageLoader.getImage(imageObject, tableView, getWidth(), getHeight());
            setImage(image);
        }
    }

}
