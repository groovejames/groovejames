package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Playlist;
import groovejames.model.SearchResult;
import groovejames.service.Services;
import groovejames.service.search.PlaylistSearch;
import groovejames.service.search.UserSearch;
import groovejames.util.FilteredList;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextInput;

import java.net.URL;

import static groovejames.util.Util.containsIgnoringCase;

public class PlaylistTablePane extends AbstractSearchTablePane<Playlist> {

    private Main main;
    private FilteredList<Playlist> playlistList = new FilteredList<>();

    @BXML private ClickableTableView playlistTable;
    @BXML private TextInput playlistSearchInPage;

    @Override
    public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        TooltipTableMouseListener.install(playlistTable);
        playlistTable.setTableData(playlistList);
        playlistTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        playlistTable.getComponentKeyListeners().add(new TableSelectAllKeyListener());
        playlistTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                if ("name".equals(column.getName())) {
                    Playlist playlist = (Playlist) row;
                    main.openSearchTab(new PlaylistSearch(playlist.getPlaylistID(), playlist.getName()));
                } else if ("userName".equals(column.getName())) {
                    Playlist playlist = (Playlist) row;
                    main.openSearchTab(new UserSearch(playlist.getUserID(), playlist.getUserName()));
                }
                return false;
            }
        });

        playlistSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override
            public boolean keyTyped(Component searchField, char character) {
                final String searchString = ((TextInput) searchField).getText().trim();
                playlistList.setFilter(new Filter<Playlist>() {
                    @Override
                    public boolean include(Playlist playlist) {
                        return containsIgnoringCase(playlist.getName(), searchString);
                    }
                });
                return false;
            }
        });
    }

    @Override
    public void afterLoad() {
        super.afterLoad();
        WtkUtil.setupColumnWidthSaver(playlistTable, "playlistTable", searchParameter.getSearchType().name());
    }

    @Override
    public String getSearchDescription() {
        return "searching for playlists named \"" + searchParameter.getDescription() + "\"";
    }

    @Override
    public void beforeSearch() {
        playlistList.setSource(new ArrayList<Playlist>());
    }

    @Override
    public SearchResult<Playlist> search() throws Exception {
        return Services.getSearchService().searchPlaylists(searchParameter);
    }

    @Override
    public void afterSearch(SearchResult<Playlist> searchResult) {
        updateCountTextAndMoreLink(searchResult);
        Playlist[] playlists = searchResult.getResult();
        playlistList.setSource(new ArrayList<>(playlists));
    }
}
