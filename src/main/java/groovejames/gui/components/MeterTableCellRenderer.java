package groovejames.gui.components;

import org.apache.pivot.beans.BeanAdapter;
import org.apache.pivot.collections.Dictionary;
import org.apache.pivot.wtk.BoxPane;
import org.apache.pivot.wtk.Meter;
import org.apache.pivot.wtk.Orientation;
import org.apache.pivot.wtk.TableView;

import java.awt.Color;
import java.awt.Font;

public class MeterTableCellRenderer extends BoxPane implements TableView.CellRenderer {

    protected Meter meter;

    public MeterTableCellRenderer() {
        super(Orientation.VERTICAL);
        getStyles().put("fill", true);
        getStyles().put("verticalAlignment", "center");
        meter = new Meter();
        meter.getStyles().put("gridFrequency", 1.0);
        meter.setPreferredHeight(10);
        add(meter);
    }

    @Override
    public void setSize(int width, int height) {
        super.setSize(width, height);
        // Since this component doesn't have a parent, it won't be validated
        // via layout; ensure that it is valid here
        validate();
    }

    @Override
    @SuppressWarnings({"unchecked"})
    public void render(Object row, int rowIndex, int columnIndex,
                       TableView tableView, String columnName,
                       boolean selected, boolean highlighted, boolean disabled) {
        setStyles(tableView, rowIndex, selected, highlighted);

        // Get the row and cell data
        double percentage = 0.0;
        if (row != null && columnName != null) {
            Dictionary<String, Object> rowData;
            if (row instanceof Dictionary<?, ?>) {
                rowData = (Dictionary<String, Object>) row;
            } else {
                rowData = new BeanAdapter(row);
            }
            Object cellData = rowData.get(columnName);
            if (cellData != null) {
                if (cellData instanceof String) {
                    percentage = Double.parseDouble((String) cellData);
                } else if (cellData instanceof Number) {
                    percentage = ((Number) cellData).doubleValue();
                } else {
                    System.err.println("data for \"" + columnName + "\" is not a number: " + cellData);
                }
            }
        }
        meter.setPercentage(percentage);
    }

    protected void setStyles(TableView tableView, int rowIndex, boolean selected, boolean highlighted) {
        StyleDictionary tableViewStyles = tableView.getStyles();
        Font font = (Font) tableViewStyles.get("font");
        meter.getStyles().put("font", font);

        Color backgroundColor;
        if (selected) {
            if (tableView.isFocused()) {
                backgroundColor = (Color) tableViewStyles.get("selectionBackgroundColor");
            } else {
                backgroundColor = (Color) tableViewStyles.get("inactiveSelectionBackgroundColor");
            }
        } else if (highlighted) {
            backgroundColor = (Color) tableViewStyles.get("highlightBackgroundColor");
        } else {
            if ((rowIndex % 2) == 1) {
                backgroundColor = (Color) tableViewStyles.get("alternateRowColor");
            } else {
                backgroundColor = (Color) tableViewStyles.get("backgroundColor");
            }
        }
        getStyles().put("backgroundColor", backgroundColor);
    }

    @Override
    public String toString(Object row, String columnName) {
        return null;
    }
}
