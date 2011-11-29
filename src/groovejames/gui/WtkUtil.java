package groovejames.gui;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TableViewColumnListener;

import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

public class WtkUtil {

    private static final Log log = LogFactory.getLog(WtkUtil.class);

    private static Preferences prefs = Preferences.userNodeForPackage(SearchResultPane.class);

    public static ArrayList<TableView.Column> getColumns(TableView tableView, String... names) {
        ArrayList<TableView.Column> result = new ArrayList<TableView.Column>();
        for (String name : names) {
            for (TableView.Column column : tableView.getColumns()) {
                if (name.equals(column.getName())) {
                    result.add(column);
                    break;
                }
            }
        }
        return result;
    }

    public static void removeColumn(TableView tableView, String columnNameToRemove) {
        TableView.Column columnToRemove = getColumns(tableView, columnNameToRemove).get(0);
        tableView.getColumns().remove(columnToRemove);
    }

    public static void setupColumnWidthSaver(final TableView tableView, final String tableKey, final String subKey) {
        try {
            Preferences columnPrefs = prefs.node(tableKey).node(subKey).node("columns");
            ArrayList<TableView.Column> columns = WtkUtil.getColumns(tableView, columnPrefs.keys());
            for (TableView.Column column : columns) {
                if (!column.isRelative()) {
                    int storedWidth = columnPrefs.getInt(column.getName(), column.getWidth());
                    column.setWidth(storedWidth);
                }
            }
        } catch (BackingStoreException ex) {
            log.error("cannot load column widths from preferences for table " + tableKey, ex);
        }

        tableView.getTableViewColumnListeners().add(new TableViewColumnListener.Adapter() {
            @Override
            public void columnWidthChanged(TableView.Column column, int previousWidth, boolean previousRelative) {
                if (!column.getTableView().isVisible()) return;
                if (tableView.getUserData().get("dontRedistributeColumnWidths") == Boolean.TRUE) return;
                if (column.isRelative()) return;
                Preferences columnPrefs = prefs.node(tableKey).node(subKey).node("columns");
                columnPrefs.putInt(column.getName(), column.getWidth());
            }
        });
    }

}
