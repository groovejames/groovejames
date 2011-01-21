package groovejames.gui.components;

import org.apache.pivot.collections.HashSet;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentMouseListener;
import org.apache.pivot.wtk.Platform;
import org.apache.pivot.wtk.TableView;

import java.awt.*;
import java.awt.font.FontRenderContext;
import java.awt.geom.Rectangle2D;

public class TooltipTableMouseListener extends ComponentMouseListener.Adapter {

    private final HashSet<Integer> forColumns;
    private int lastCol = -1;
    private int lastRow = -1;

    public TooltipTableMouseListener() {
        this.forColumns = null;
    }

    public TooltipTableMouseListener(HashSet<Integer> forColumns) {
        this.forColumns = forColumns;
    }

    @Override
    public boolean mouseMove(Component component, int x, int y) {
        TableView tableView = (TableView) component;
        int col = tableView.getColumnAt(x);
        int row = tableView.getRowAt(y);
        if (col != lastCol || row != lastRow) {
            lastCol = col;
            lastRow = row;
            tableView.setTooltipText(null);
            if (col >= 0 && row >= 0 && (forColumns == null || forColumns.contains(col))) {
                Object rowData = tableView.getTableData().get(row);
                TableView.Column column = tableView.getColumns().get(col);
                String text = column.getCellRenderer().toString(rowData, column.getName());
                Font font = (Font) tableView.getStyles().get("font");
                int columnWidth = tableView.getColumnBounds(col).width;
                int stringWidth = getStringWidth(font, text);
                if (stringWidth > columnWidth - 4 /*cellpadding*/) {
                    tableView.setTooltipText(text);
                }
            }
        }
        return false;
    }

    private int getStringWidth(Font font, String text) {
        if (text == null)
            return 0;
        else {
            FontRenderContext fontRenderContext = Platform.getFontRenderContext();
            Rectangle2D stringBounds = font.getStringBounds(text, fontRenderContext);
            return (int) Math.ceil(stringBounds.getWidth());
        }
    }
}
