package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Song;
import groovejames.service.Services;
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

public class ArtistTablePane extends TablePane implements Bindable, CardPaneContent<Song> {

    private Main main;
    private FilteredList<Song> artistList = new FilteredList<Song>();

    private @BXML ClickableTableView artistTable;
    private @BXML TextInput artistSearchInPage;

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        artistTable.setTableData(artistList);
        artistTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        artistTable.getComponentMouseListeners().add(new TooltipTableMouseListener());
        artistTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                if ("artistName".equals(column.getName())) {
                    Song song = (Song) row;
                    main.openSearchTab(new ArtistSearch(song.getArtistID(), song.getArtistName()));
                }
                return false;
            }
        });

        artistSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override public boolean keyTyped(Component searchField, char character) {
                final String searchString = ((TextInput) searchField).getText().trim();
                artistList.setFilter(new Filter<Song>() {
                    @Override public boolean include(Song song) {
                        return containsIgnoringCase(song.getArtistName(), searchString);
                    }
                });
                return false;
            }
        });
    }

    @Override public void afterLoad(SearchParameter searchParameter) {
        WtkUtil.setupColumnWidthSaver(artistTable, "artistTable", searchParameter.getSearchType().name());
    }

    @Override public GuiAsyncTask<Song[]> getSearchTask(final SearchParameter searchParameter) {
        return new GuiAsyncTask<Song[]>(
            "searching for artists named \"" + searchParameter.getSimpleSearchString() + "\"") {

            @Override protected void beforeExecute() {
                artistList.setSource(new ArrayList<Song>());
            }

            @Override public Song[] execute() throws TaskExecutionException {
                try {
                    return Services.getSearchService().searchArtists(searchParameter);
                } catch (Exception ex) {
                    throw new TaskExecutionException(ex);
                }
            }

            @Override protected void taskExecuted() {
                Song[] result = getResult();
                artistList.setSource(new ArrayList<Song>(result));
            }
        };
    }
}
