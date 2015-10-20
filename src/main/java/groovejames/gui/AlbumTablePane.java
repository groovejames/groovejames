package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Album;
import groovejames.model.SearchResult;
import groovejames.service.Services;
import groovejames.service.search.AlbumSearch;
import groovejames.service.search.ArtistSearch;
import groovejames.service.search.SearchType;
import groovejames.util.FilteredList;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.SortDirection;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextInput;

import java.net.URL;

import static groovejames.util.Util.containsIgnoringCase;

public class AlbumTablePane extends AbstractSearchTablePane<Album> {

    private Main main;
    private FilteredList<Album> albumList = new FilteredList<>(new ArrayList<Album>());

    @BXML private ClickableTableView albumTable;
    @BXML private TextInput albumSearchInPage;

    @Override
    public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
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
                    main.openSearchTab(new AlbumSearch(album.getAlbumID(), album.getAlbumName(), album.getArtistName(), false));
                } else if ("artistName".equals(column.getName())) {
                    main.openSearchTab(new ArtistSearch(album.getArtistID(), album.getArtistName()));
                }
                return false;
            }
        });

        albumSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override
            public boolean keyTyped(Component searchField, char character) {
                updateFilter();
                return false;
            }
        });

        updateFilter();
    }

    private void updateFilter() {
        final String searchString = albumSearchInPage.getText().trim();
        albumList.setFilter(new Filter<Album>() {
            @Override
            public boolean include(Album album) {
                return containsIgnoringCase(album.getAlbumName(), searchString) || containsIgnoringCase(album.getArtistName(), searchString);
            }
        });
    }

    @Override
    public void afterLoad() {
        super.afterLoad();

        WtkUtil.setupColumnWidthSaver(albumTable, "albumTable", searchParameter.getSearchType().name());

        // sort by name
        albumTable.setSort("albumName", SortDirection.ASCENDING);

        if (searchParameter.getSearchType() == SearchType.Artist) {
            // remove "Artist" column
            WtkUtil.removeColumn(albumTable, "artistName");
        }
    }

    @Override
    public String getSearchDescription() {
        return "searching for albums which contain the string or belong to artist \"" + searchParameter.getDescription() + "\"";
    }

    @Override
    public void beforeSearch() {
        // nothing to be done
    }

    @Override
    public SearchResult<Album> search() throws Exception {
        return Services.getSearchService().searchAlbums(searchParameter);
    }

    @Override
    public void afterSearch(SearchResult<Album> searchResult) {
        updateCountTextAndMoreLink(searchResult);
        Album[] albums = searchResult.getResult();
        for (Album album : albums) {
            albumList.add(album);
        }
    }
}
