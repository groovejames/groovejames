package groovejames.gui.components;

import org.apache.pivot.wtk.Mouse;

public interface ClickableTableListener {

    /**
     * Called when a mouse button is clicked over a clickable table cell.
     *
     * @param source      the clickable table view instance
     * @param row         the clicked row
     * @param rowIndex    the clicked row index number
     * @param columnIndex the clicked column index number
     * @param button      the mouse button
     * @param clickCount  the mouse click count
     * @return <tt>true</tt> to consume the event; <tt>false</tt> to allow it to propagate.
     */
    boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex,
                        Mouse.Button button, int clickCount);

}
