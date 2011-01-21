package groovejames.gui.components;

import org.apache.pivot.collections.List;
import org.apache.pivot.wtk.SortDirection;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TableViewSortListener;
import org.apache.pivot.wtk.content.TableViewRowComparator;

public class DefaultTableViewSortListener implements TableViewSortListener {

    public void sortAdded(TableView tableView, String columnName) {
        resort(tableView);
    }

    public void sortUpdated(TableView tableView, String columnName, SortDirection previousSortDirection) {
        resort(tableView);
    }

    public void sortRemoved(TableView tableView, String columnName, SortDirection sortDirection) {
        resort(tableView);
    }

    public void sortChanged(TableView tableView) {
        resort(tableView);
    }

    @SuppressWarnings("unchecked")
    private void resort(TableView tableView) {
        List<Object> tableData = (List<Object>) tableView.getTableData();
        tableData.setComparator(new TableViewRowComparator(tableView));
    }
}
