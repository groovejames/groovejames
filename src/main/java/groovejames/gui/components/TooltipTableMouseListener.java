package groovejames.gui.components;

import groovejames.util.StringUtils;
import org.apache.pivot.collections.HashSet;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentMouseListener;
import org.apache.pivot.wtk.ComponentTooltipListener;
import org.apache.pivot.wtk.Display;
import org.apache.pivot.wtk.Insets;
import org.apache.pivot.wtk.Platform;
import org.apache.pivot.wtk.Point;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextArea;
import org.apache.pivot.wtk.Tooltip;

import java.awt.Font;
import java.awt.font.FontRenderContext;
import java.awt.geom.Rectangle2D;

public class TooltipTableMouseListener extends ComponentMouseListener.Adapter implements ComponentTooltipListener {

    private final HashSet<Integer> forColumns;
    private int lastCol = -1;
    private int lastRow = -1;

    private TooltipTableMouseListener(HashSet<Integer> forColumns) {
        this.forColumns = forColumns;
    }

    public static void install(TableView tableView, Integer... forColumns) {
        TooltipTableMouseListener listener = new TooltipTableMouseListener(new HashSet<Integer>(forColumns));
        tableView.getComponentMouseListeners().add(listener);
        ComponentTooltipListener oldComponentTooltipListener = tableView.getComponentTooltipListeners().iterator().next();
        tableView.getComponentTooltipListeners().remove(oldComponentTooltipListener);
        tableView.getComponentTooltipListeners().add(listener);
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
            if (col >= 0 && row >= 0 && (forColumns.isEmpty() || forColumns.contains(col))) {
                Object rowData = tableView.getTableData().get(row);
                TableView.Column column = tableView.getColumns().get(col);
                String text = column.getCellRenderer().toString(rowData, column.getName());
                Font font = (Font) tableView.getStyles().get("font");
                int columnWidth = tableView.getColumnBounds(col).width;
                int stringWidth = getStringWidth(text, font);
                if (stringWidth > columnWidth - 4 /* cell padding */) {
                    tableView.setTooltipText(text);
                }
            }
        }
        return false;
    }

    @Override
    public void tooltipTriggered(Component component, int x, int y) {
        String tooltipText = component.getTooltipText();
        if (!StringUtils.isEmpty(tooltipText)) {
            Display display = component.getDisplay();
            Point location = component.mapPointToAncestor(display, x, y);
            int tooltipX = location.x + 16;
            int tooltipY = location.y;
            TextArea content = new TextArea();
            content.getStyles().put("wrapText", Boolean.TRUE);
            content.getStyles().put("margin", new Insets(0));
            content.setPreferredWidth(Math.min(display.getWidth() - tooltipX, getStringWidth(tooltipText, (Font) content.getStyles().get("font"))));
            content.setText(tooltipText);
            Tooltip tooltip = new Tooltip(content);
            int tooltipWidth = tooltip.getPreferredWidth();
            int tooltipHeight = tooltip.getPreferredHeight();
            // ensure tooltip is inside display's bounds
            if (tooltipX + tooltipWidth > display.getWidth()) {
                tooltipX -= tooltipX + tooltipWidth - display.getWidth();
            }
            if (tooltipY + tooltipHeight > display.getHeight()) {
                tooltipY -= tooltipHeight;
            }
            tooltip.setLocation(tooltipX, tooltipY);
            tooltip.open(component.getWindow());
        }
    }

    private int getStringWidth(String text, Font font) {
        if (text == null)
            return 0;
        else {
            FontRenderContext fontRenderContext = Platform.getFontRenderContext();
            Rectangle2D stringBounds = font.getStringBounds(text, fontRenderContext);
            return (int) Math.ceil(stringBounds.getWidth());
        }
    }
}
