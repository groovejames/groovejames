package groovejames.gui.components;

import org.apache.pivot.collections.List;
import org.apache.pivot.util.ListenerList;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentMouseButtonListener;
import org.apache.pivot.wtk.ComponentMouseListener;
import org.apache.pivot.wtk.Cursor;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextDecoration;
import org.apache.pivot.wtk.content.TableViewCellRenderer;

public class ClickableTableView extends TableView {

    private ClickableTableListeners clickableTableListeners = new ClickableTableListeners();

    public ClickableTableView() {
    }

    public ClickableTableView(List<?> tableData) {
        super(tableData);
    }

    public void setClickableColumns(String listOfColumnIndices) {
        for (String columnIndex : listOfColumnIndices.split(",")) {
            setClickableColumn(Integer.parseInt(columnIndex));
        }
    }

    public void setClickableColumns(int... columnIndices) {
        for (int columnIndex : columnIndices) {
            setClickableColumn(columnIndex);
        }
    }

    public void setClickableColumn(int columnIndex) {
        Column column = getColumns().get(columnIndex);
        if (column == null) {
            throw new IllegalArgumentException("illegal column index: " + columnIndex);
        }
        LinkCellRenderer linkCellRenderer = new LinkCellRenderer();
        column.setCellRenderer(linkCellRenderer);
        ClickableTableMouseListener mouseListener = new ClickableTableMouseListener(linkCellRenderer, columnIndex);
        getComponentMouseListeners().add(mouseListener);
        getComponentMouseButtonListeners().add(mouseListener);
    }

    public ListenerList<ClickableTableListener> getClickableTableListeners() {
        return clickableTableListeners;
    }


    private static class ClickableTableListeners extends ListenerList<ClickableTableListener> implements ClickableTableListener {
        public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
            for (ClickableTableListener listener : this)
                if (listener.cellClicked(source, row, rowIndex, columnIndex, button, clickCount))
                    return true;
            return false;
        }
    }


    private static class ClickableTableMouseListener extends ComponentMouseButtonListener.Adapter implements ComponentMouseListener {
        private final LinkCellRenderer linkCellRenderer;
        private final int columnIndex;

        public ClickableTableMouseListener(LinkCellRenderer linkCellRenderer, int columnIndex) {
            this.linkCellRenderer = linkCellRenderer;
            this.columnIndex = columnIndex;
        }

        public boolean mouseMove(Component component, int x, int y) {
            ClickableTableView tableView = (ClickableTableView) component;
            int col = tableView.getColumnAt(x);
            int row = tableView.getRowAt(y);
            linkCellRenderer.setHoveredCell(tableView, row, col);
            return false;
        }

        public void mouseOver(Component component) {
        }

        public void mouseOut(Component component) {
            ClickableTableView tableView = (ClickableTableView) component;
            linkCellRenderer.setHoveredCell(tableView, -1, -1);
            tableView.setCursor(Cursor.DEFAULT);
        }

        @Override
        public boolean mouseClick(Component component, Mouse.Button button, int x, int y, int count) {
            ClickableTableView tableView = (ClickableTableView) component;
            int columnIndex = tableView.getColumnAt(x);
            if (columnIndex == this.columnIndex) {
                int rowIndex = tableView.getRowAt(y);
                List<?> tableData = tableView.getTableData();
                if (rowIndex >= 0 && tableData != null && rowIndex < tableData.getLength()) {
                    Object row = tableData.get(rowIndex);
                    return tableView.clickableTableListeners.cellClicked(tableView, row,
                            rowIndex, columnIndex, button, count);
                }
            }
            return false;
        }
    }


    private static class LinkCellRenderer extends TableViewCellRenderer {
        private int hoveredRowIndex = -1;
        private int hoveredColumnIndex = -1;

        @SuppressWarnings({"unchecked"})
        public void render(Object row, int rowIndex, int columnIndex,
                           TableView tableView, String columnName,
                           boolean selected, boolean highlighted, boolean disabled) {
            super.render(row, rowIndex, columnIndex, tableView, columnName, selected, highlighted, disabled);
            if (rowIndex == hoveredRowIndex && columnIndex == hoveredColumnIndex) {
                getStyles().put("textDecoration", TextDecoration.UNDERLINE);
                tableView.setCursor(Cursor.HAND);
            } else {
                getStyles().put("textDecoration", null);
            }
        }

        public void setHoveredCell(ClickableTableView tableView, int rowIndex, int columnIndex) {
            int oldHoveredRowIndex = this.hoveredRowIndex;
            int oldHoveredColumnIndex = this.hoveredColumnIndex;
            this.hoveredRowIndex = rowIndex;
            this.hoveredColumnIndex = columnIndex;
            if (oldHoveredRowIndex != rowIndex || oldHoveredColumnIndex != columnIndex) {
                tableView.setCursor(Cursor.DEFAULT);
                tableView.repaint();
            }
        }
    }
}
