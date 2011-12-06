package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Song;
import groovejames.service.Services;
import groovejames.service.search.AlbumSearch;
import groovejames.service.search.ArtistSearch;
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

public class AlbumTablePane extends TablePane implements Bindable, CardPaneContent<Song> {

    private Main main;
    private FilteredList<Song> albumList = new FilteredList<Song>();

    private @BXML ClickableTableView albumTable;
    private @BXML TextInput albumSearchInPage;

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
                Song song = (Song) row;
                if ("albumName".equals(column.getName())) {
                    main.openSearchTab(new AlbumSearch(song.getAlbumID(), song.getAlbumName(), song.getArtistName()));
                } else if ("artistName".equals(column.getName())) {
                    main.openSearchTab(new ArtistSearch(song.getArtistID(), song.getArtistName()));
                }
                return false;
            }
        });

        albumSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override public boolean keyTyped(Component searchField, char character) {
                final String searchString = ((TextInput) searchField).getText().trim();
                albumList.setFilter(new Filter<Song>() {
                    @Override public boolean include(Song song) {
                        return containsIgnoringCase(song.getAlbumName(), searchString)
                            || containsIgnoringCase(song.getArtistName(), searchString);
                    }
                });
                return false;
            }
        });
    }

    @Override public void afterLoad(SearchParameter searchParameter) {
        WtkUtil.setupColumnWidthSaver(albumTable, "albumTable", searchParameter.getSearchType().name());
    }

    @Override public GuiAsyncTask<Song[]> getSearchTask(final SearchParameter searchParameter) {
        return new GuiAsyncTask<Song[]>(
            "searching for albums named \"" + searchParameter.getSimpleSearchString() + "\"") {

            @Override protected void beforeExecute() {
                albumList.setSource(new ArrayList<Song>());
            }

            @Override public Song[] execute() throws TaskExecutionException {
                try {
                    return Services.getSearchService().searchAlbums(searchParameter);
                } catch (Exception ex) {
                    throw new TaskExecutionException(ex);
                }
            }

            @Override protected void taskExecuted() {
                Song[] result = getResult();
                albumList.setSource(new ArrayList<Song>(result));
            }

        };
    }
}
