package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Album;
import groovejames.service.Services;
import groovejames.service.search.AlbumSearch;
import groovejames.service.search.ArtistSearch;
import groovejames.service.search.SearchParameter;
import groovejames.service.search.SearchType;
import groovejames.util.FilteredList;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.ButtonGroup;
import org.apache.pivot.wtk.ButtonGroupListener;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.Menu;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.SortDirection;
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextInput;

import java.net.URL;

import static groovejames.util.Util.containsIgnoringCase;

public class AlbumTablePane extends TablePane implements Bindable, CardPaneContent<Album> {

    private Main main;
    private FilteredList<Album> albumList = new FilteredList<Album>();

    private @BXML ClickableTableView albumTable;
    private @BXML TextInput albumSearchInPage;
    private @BXML ButtonGroup showButtonGroup;
    private @BXML Menu.Item showAll;
    private @BXML Menu.Item showVerified;

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        TooltipTableMouseListener.install(albumTable);
        albumTable.setTableData(albumList);
        albumTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        albumTable.getComponentKeyListeners().add(new TableSelectAllKeyListener());
        albumTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                Album album = (Album) row;
                if ("albumName".equals(column.getName())) {
                    main.openSearchTab(new AlbumSearch(album.getAlbumID(), album.getAlbumName(), album.getArtistName()));
                } else if ("artistName".equals(column.getName())) {
                    main.openSearchTab(new ArtistSearch(album.getArtistID(), album.getArtistName()));
                }
                return false;
            }
        });

        albumSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override public boolean keyTyped(Component searchField, char character) {
                updateFilter();
                return false;
            }
        });

        showButtonGroup.getButtonGroupListeners().add(new ButtonGroupListener.Adapter() {
            @Override public void selectionChanged(ButtonGroup buttonGroup, Button previousSelection) {
                updateFilter();
            }
        });

        updateFilter();
    }

    private void updateFilter() {
        final boolean showOnlyVerified = showVerified.isSelected();
        final String searchString = albumSearchInPage.getText().trim();
        albumList.setFilter(new Filter<Album>() {
            @Override public boolean include(Album album) {
                return (!showOnlyVerified || album.getIsVerified())
                    && (containsIgnoringCase(album.getAlbumName(), searchString) || containsIgnoringCase(album.getArtistName(), searchString));
            }
        });
    }

    @Override public void afterLoad(SearchParameter searchParameter) {
        WtkUtil.setupColumnWidthSaver(albumTable, "albumTable", searchParameter.getSearchType().name());

        if (searchParameter.getSearchType() == SearchType.Artist) {
            // sort by name (instead of popularity)
            albumTable.setSort("albumName", SortDirection.ASCENDING);
            // remove "Artist" column
            WtkUtil.removeColumn(albumTable, "artistName");
            // remove "Relevance" column
            WtkUtil.removeColumn(albumTable, "popularityPercentage");
        }
    }

    @Override public GuiAsyncTask<Album[]> getSearchTask(final SearchParameter searchParameter) {
        return new GuiAsyncTask<Album[]>(
            "searching for albums which contain the string or belong to artist \"" + searchParameter.getDescription() + "\"") {

            @Override protected void beforeExecute() {
                albumList.setSource(new ArrayList<Album>());
            }

            @Override public Album[] execute() throws TaskExecutionException {
                try {
                    return Services.getSearchService().searchAlbums(searchParameter);
                } catch (Exception ex) {
                    throw new TaskExecutionException(ex);
                }
            }

            @Override protected void taskExecuted() {
                Album[] result = getResult();
                albumList.setSource(new ArrayList<Album>(result));
                if (albumList.getLength() == 0) {
                    showAll.setSelected(true);
                }
            }

        };
    }
}
