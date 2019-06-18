package groovejames.gui;

import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.ApplicationContext;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TableViewColumnListener;
import org.apache.pivot.wtk.media.Image;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URL;
import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

public class WtkUtil {

    private static final Logger log = LoggerFactory.getLogger(WtkUtil.class);

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
        ArrayList<TableView.Column> columns = getColumns(tableView, columnNameToRemove);
        if (columns.isEmpty())
            throw new IllegalArgumentException("column not found: " + columnNameToRemove);
        TableView.Column columnToRemove = columns.get(0);
        tableView.getColumns().remove(columnToRemove);
    }

    public static void setupColumnWidthSaver(final TableView tableView, final String tableKey) {
        setupColumnWidthSaver(tableView, tableKey, null);
    }

    public static void setupColumnWidthSaver(final TableView tableView, final String tableKey, final String subKey) {
        try {
            Preferences columnPrefs = getTableColumnPrefs(tableKey, subKey);
            ArrayList<TableView.Column> columns = WtkUtil.getColumns(tableView, columnPrefs.keys());
            for (TableView.Column column : columns) {
                if (!column.isRelative()) {
                    int storedWidth = columnPrefs.getInt(column.getName(), column.getWidth());
                    column.setWidth(storedWidth);
                }
            }
        } catch (BackingStoreException ex) {
            log.error("cannot load column widths from preferences for table {}", tableKey, ex);
        }

        tableView.getTableViewColumnListeners().add(new TableViewColumnListener.Adapter() {
            @Override
            public void columnWidthChanged(TableView.Column column, int previousWidth, boolean previousRelative) {
                if (!column.getTableView().isVisible()) return;
                if (tableView.getUserData().get("dontRedistributeColumnWidths") == Boolean.TRUE) return;
                if (column.isRelative()) return;
                Preferences columnPrefs = getTableColumnPrefs(tableKey, subKey);
                columnPrefs.putInt(column.getName(), column.getWidth());
            }
        });
    }

    private static Preferences getTableColumnPrefs(String tableKey, String subKey) {
        Preferences columnPrefs = prefs.node(tableKey);
        if (subKey != null) columnPrefs = columnPrefs.node(subKey);
        columnPrefs = columnPrefs.node("columns");
        return columnPrefs;
    }

    public static Image getIcon(String iconResource, Class<?> relativeTo) {
        if (iconResource == null) {
            throw new IllegalArgumentException("iconResource is null");
        }
        URL iconURL = relativeTo.getResource(iconResource);
        if (iconURL == null) {
            throw new IllegalArgumentException("iconResource not found: " + iconResource);
        }
        return getIcon(iconURL);
    }

    public static Image getIcon(URL iconURL) {
        Image icon = (Image) ApplicationContext.getResourceCache().get(iconURL);
        if (icon == null) {
            try {
                icon = Image.load(iconURL);
            } catch (TaskExecutionException ex) {
                throw new IllegalArgumentException(ex);
            }
            ApplicationContext.getResourceCache().put(iconURL, icon);
        }
        return icon;
    }
}
