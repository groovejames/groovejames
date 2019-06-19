package groovejames.gui.components;

import org.apache.pivot.collections.Sequence;
import org.apache.pivot.wtk.Span;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TableViewSelectionListener;

public abstract class SimpleTableViewSelectionListener implements TableViewSelectionListener {

    public abstract void selectionChanged(TableView tableView);

    @Override
    public void selectedRangeAdded(TableView tableView, int rangeStart, int rangeEnd) {
        selectionChanged(tableView);
    }

    @Override
    public void selectedRangeRemoved(TableView tableView, int rangeStart, int rangeEnd) {
        selectionChanged(tableView);
    }

    @Override
    public final void selectedRangesChanged(TableView tableView, Sequence<Span> previousSelectedRanges) {
        selectionChanged(tableView);
    }

    @Override
    public void selectedRowChanged(TableView tableView, Object previousSelectedRow) {
        selectionChanged(tableView);
    }

}
