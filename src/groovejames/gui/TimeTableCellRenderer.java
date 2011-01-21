package groovejames.gui;

import groovejames.model.Song;
import groovejames.model.Track;
import org.apache.pivot.wtk.HorizontalAlignment;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.content.TableViewCellRenderer;

public class TimeTableCellRenderer extends TableViewCellRenderer {

    public TimeTableCellRenderer() {
        getStyles().put("horizontalAlignment", HorizontalAlignment.RIGHT);
    }

    @SuppressWarnings("unchecked")
    @Override
    public void render(Object row, int rowIndex, int columnIndex,
                       TableView tableView, String columnName,
                       boolean selected, boolean highlighted, boolean disabled) {
        renderStyles(tableView, selected, disabled);
        setText(toString(row, columnName));
    }

    @SuppressWarnings("unchecked")
    public String toString(Object row, String columnName) {
        Long duration = getDuration(row);
        if (duration == null) {
            return "";
        }
        long hour = duration / 3600;
        long min = duration / 60 % 60;
        long sec = duration % 60;
        StringBuilder sb = new StringBuilder();
        if (hour > 0) {
            if (hour < 10) {
                sb.append('0');
            }
            sb.append(hour);
            sb.append(':');
        }
        if (min < 10) {
            sb.append('0');
        }
        sb.append(min);
        sb.append(':');
        if (sec < 10) {
            sb.append('0');
        }
        sb.append(sec);
        return sb.toString();
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
