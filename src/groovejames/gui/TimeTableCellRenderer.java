package groovejames.gui;

import groovejames.model.Song;
import groovejames.model.Track;
import static groovejames.util.Util.durationToString;
import org.apache.pivot.wtk.HorizontalAlignment;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.content.TableViewCellRenderer;

public class TimeTableCellRenderer extends TableViewCellRenderer {

    public TimeTableCellRenderer() {
        getStyles().put("horizontalAlignment", HorizontalAlignment.RIGHT);
    }

    @Override
    public void render(Object row, int rowIndex, int columnIndex,
                       TableView tableView, String columnName,
                       boolean selected, boolean highlighted, boolean disabled) {
        renderStyles(tableView, selected, disabled);
        setText(toString(row, columnName));
    }

    public String toString(Object row, String columnName) {
        return durationToString(getDuration(row));
    }

    private Long getDuration(Object row) {
        if (row == null)
            return null;
        else if (row instanceof Song)
            return ((Song) row).getEstimateDuration();
        else if (row instanceof Track)
            return ((Track) row).getSong().getEstimateDuration();
        else
            throw new IllegalStateException("row not instance of Song or Track");
    }
}
