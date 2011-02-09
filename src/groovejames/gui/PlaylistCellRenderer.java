package groovejames.gui;

import groovejames.service.PlayService;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.content.TableViewImageCellRenderer;
import org.apache.pivot.wtk.media.Image;

public class PlaylistCellRenderer extends TableViewImageCellRenderer {

    private final PlayService playService;
    private final Image pointerImage;

    public PlaylistCellRenderer(PlayService playService) {
        this.playService = playService;
        try {
            this.pointerImage = Image.load(getClass().getResource("pointer.png"));
        } catch (TaskExecutionException ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public void render(Object row, int rowIndex, int columnIndex,
                       TableView tableView, String columnName,
                       boolean selected, boolean highlighted, boolean disabled) {
        setImage(rowIndex == playService.getCurrentSongIndex() ? pointerImage : null);
    }
}
