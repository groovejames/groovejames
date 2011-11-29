package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Playlist;
import groovejames.service.Services;
import groovejames.service.search.PlaylistSearch;
import groovejames.service.search.SearchParameter;
import groovejames.util.FilteredList;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextInput;

import java.net.URL;

import static groovejames.util.Util.containsIgnoringCase;

public class PlaylistTablePane extends TablePane implements Bindable, CardPaneContent<Playlist> {

    private Main main;
    private FilteredList<Playlist> playlistList = new FilteredList<Playlist>();

    private @BXML ClickableTableView playlistTable;
    private @BXML TextInput playlistSearchInPage;

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        playlistTable.setTableData(playlistList);
        playlistTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        playlistTable.getComponentMouseListeners().add(new TooltipTableMouseListener());
        playlistTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                if ("name".equals(column.getName())) {
                    Playlist playlist = (Playlist) row;
                    main.openSearchTab(new PlaylistSearch(playlist.getPlaylistID(), playlist.getName()));
                }
                return false;
            }
        });

        playlistSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override public boolean keyTyped(Component searchField, char character) {
                final String searchString = ((TextInput) searchField).getText().trim();
                playlistList.setFilter(new Filter<Playlist>() {
                    @Override public boolean include(Playlist playlist) {
                        return containsIgnoringCase(playlist.getName(), searchString)
                            || containsIgnoringCase(playlist.getAbout(), searchString);
                    }
                });
                return false;
            }
        });
    }

    @Override public void afterLoad(SearchParameter searchParameter) {
        WtkUtil.setupColumnWidthSaver(playlistTable, "playlistTable", searchParameter.getSearchType().name());
    }

    @Override public GuiAsyncTask<Playlist[]> getSearchTask(final SearchParameter searchParameter) {
        return new GuiAsyncTask<Playlist[]>(
            "searching for playlists named \"" + searchParameter.getSimpleSearchString() + "\"") {

            @Override protected void beforeExecute() {
                playlistList.setSource(new ArrayList<Playlist>());
            }

            @Override public Playlist[] execute() throws TaskExecutionException {
                try {
                    return Services.getSearchService().searchPlaylists(searchParameter);
                } catch (Exception ex) {
                    throw new TaskExecutionException(ex);
                }
            }

            @Override protected void taskExecuted() {
                Playlist[] result = getResult();
                playlistList.setSource(new ArrayList<Playlist>(result));
            }

        };
    }
}
