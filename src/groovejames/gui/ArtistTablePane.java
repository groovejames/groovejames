package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Artist;
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

public class ArtistTablePane extends TablePane implements Bindable, CardPaneContent<Artist> {

    private Main main;
    private FilteredList<Artist> artistList = new FilteredList<Artist>();

    private @BXML ClickableTableView artistTable;
    private @BXML TextInput artistSearchInPage;

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        TooltipTableMouseListener.install(artistTable);
        artistTable.setTableData(artistList);
        artistTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        artistTable.getComponentKeyListeners().add(new TableSelectAllKeyListener());
        artistTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                if ("artistName".equals(column.getName())) {
                    Artist artist = (Artist) row;
                    main.openSearchTab(new ArtistSearch(artist.getArtistID(), artist.getArtistName()));
                }
                return false;
            }
        });

        artistSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override public boolean keyTyped(Component searchField, char character) {
                final String searchString = ((TextInput) searchField).getText().trim();
                artistList.setFilter(new Filter<Artist>() {
                    @Override public boolean include(Artist artist) {
                        return containsIgnoringCase(artist.getArtistName(), searchString);
                    }
                });
                return false;
            }
        });
    }

    @Override public void afterLoad(SearchParameter searchParameter) {
        WtkUtil.setupColumnWidthSaver(artistTable, "artistTable", searchParameter.getSearchType().name());
    }

    @Override public GuiAsyncTask<Artist[]> getSearchTask(final SearchParameter searchParameter) {
        return new GuiAsyncTask<Artist[]>(
            "searching for artists named \"" + searchParameter.getDescription() + "\"") {

            @Override protected void beforeExecute() {
                artistList.setSource(new ArrayList<Artist>());
            }

            @Override public Artist[] execute() throws TaskExecutionException {
                try {
                    return Services.getSearchService().searchArtists(searchParameter);
                } catch (Exception ex) {
                    throw new TaskExecutionException(ex);
                }
            }

            @Override protected void taskExecuted() {
                Artist[] result = getResult();
                artistList.setSource(new ArrayList<Artist>(result));
            }
        };
    }
}
