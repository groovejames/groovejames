package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.ListIdItem;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Song;
import groovejames.service.Services;
import groovejames.service.search.AlbumSearch;
import groovejames.service.search.ArtistSearch;
import groovejames.service.search.SearchParameter;
import groovejames.service.search.SearchType;
import groovejames.util.FilteredList;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.BXMLSerializer;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.HashSet;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.collections.immutable.ImmutableList;
import org.apache.pivot.serialization.SerializationException;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.Vote;
import org.apache.pivot.util.concurrent.Task;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.util.concurrent.TaskListener;
import org.apache.pivot.wtk.ActivityIndicator;
import org.apache.pivot.wtk.ApplicationContext;
import org.apache.pivot.wtk.BoxPane;
import org.apache.pivot.wtk.CardPane;
import org.apache.pivot.wtk.CardPaneListener;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.Label;
import org.apache.pivot.wtk.ListButton;
import org.apache.pivot.wtk.ListButtonSelectionListener;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.SortDirection;
import org.apache.pivot.wtk.Span;
import org.apache.pivot.wtk.TabPane;
import org.apache.pivot.wtk.TabPaneSelectionListener;
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TableViewColumnListener;
import org.apache.pivot.wtk.TableViewSelectionListener;
import org.apache.pivot.wtk.TextInput;
import org.apache.pivot.wtk.content.ButtonData;

import java.io.IOException;
import java.net.URL;
import java.util.Comparator;
import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

import static groovejames.util.Util.compareNullSafe;
import static groovejames.util.Util.containsIgnoringCase;

@SuppressWarnings({"UnusedDeclaration"})
public class SearchResultPane extends TablePane implements Bindable {

    private static final Log log = LogFactory.getLog(SearchResultPane.class);

    @BXML private TabPane tabPane;
    @BXML private CardPane songCardPane;
    @BXML private CardPane artistCardPane;
    @BXML private CardPane albumCardPane;
    @BXML private Label searchLabel;

    @BXML private SongPane songpane;
    @BXML private ArtistPane artistpane;
    @BXML private AlbumPane albumpane;

    private Main main;
    private SearchParameter searchParameter;
    private FilteredList<Song> songList = new FilteredList<Song>();
    private FilteredList<Song> songAlbumList = new FilteredList<Song>();
    private FilteredList<Song> albumList = new FilteredList<Song>();
    private FilteredList<Song> artistList = new FilteredList<Song>();
    private Long songListSelectedAlbumID;
    private boolean songsLoaded;
    private boolean albumsLoaded;
    private boolean artistsLoaded;
    private Preferences prefs = Preferences.userNodeForPackage(SearchResultPane.class);
    private Resources resources;

    public SearchResultPane() {
    }

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");
        this.resources = resources;

        tabPane.getTabPaneSelectionListeners().add(new TabPaneSelectionListener.Adapter() {
            @Override public void selectedIndexChanged(TabPane tabPane, int previousSelectedIndex) {
                startSearch();
            }
        });

        songpane.songGroupByButton.getListButtonSelectionListeners().add(new ListButtonSelectionListener.Adapter() {
            @Override public void selectedIndexChanged(ListButton listButton, int previousSelectedIndex) {
                int selectedIndex = listButton.getSelectedIndex();
                if (selectedIndex != previousSelectedIndex) {
                    ListIdItem selectedListIdItem = (ListIdItem) listButton.getListData().get(selectedIndex);
                    boolean groupByAlbum = "groupByAlbum".equals(selectedListIdItem.getId());
                    setSongsGroupByAlbum(groupByAlbum);
                    // save setting
                    getPrefsForTable("song").putBoolean("groupByAlbum", groupByAlbum);
                    // redistribute space among some of the columns
                    if (songpane.songTable.getUserData().get("dontRedistributeColumnWidths") != Boolean.TRUE) {
                        if (songpane.songSplitPane.getWidth() > 0) {
                            ArrayList<TableView.Column> columns = WtkUtil.getColumns(songpane.songTable, "songName", "artistName", "albumName");
                            int d = (int) (((songpane.songSplitPane.getWidth() * 0.25) + 6.0) / columns.getLength()) * (groupByAlbum ? -1 : 1);
                            for (TableView.Column column : columns) {
                                if (!column.isRelative()) {
                                    column.setWidth(Math.max(0, column.getWidth() + d));
                                }
                            }
                        }
                    }
                }
            }
        });

        songpane.songAlbumTable.setTableData(songAlbumList);
        songpane.songAlbumTable.getComponentMouseListeners().add(new TooltipTableMouseListener());
        songpane.songAlbumTable.getTableViewSelectionListeners().add(new TableViewSelectionListener.Adapter() {
            @Override public void selectedRangesChanged(TableView tableView, Sequence<Span> previousSelectedRanges) {
                int idx = songpane.songAlbumTable.getSelectedIndex();
                songListSelectedAlbumID = idx >= 0 ? songAlbumList.get(idx).getAlbumID() : null;
                songList.setFilter(new SongListFilter());
            }
        });

        songpane.songTable.setTableData(songList);
        songpane.songTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        songpane.songTable.getComponentMouseListeners().add(new TooltipTableMouseListener());
        songpane.songTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                Song song = (Song) row;
                if ("artistName".equals(column.getName())) {
                    main.openSearchTab(new ArtistSearch(song.getArtistID(), song.getArtistName()));
                } else if ("albumName".equals(column.getName())) {
                    main.openSearchTab(new AlbumSearch(
                        song.getAlbumID(), song.getAlbumName(), song.getArtistID(), song.getArtistName()));
                }
                return false;
            }
        });

        songpane.songTable.getTableViewSelectionListeners().add(new TableViewSelectionListener() {
            @Override public void selectedRangeAdded(TableView tableView, int rangeStart, int rangeEnd) {
                selectionChanged(tableView);
            }

            @Override public void selectedRangeRemoved(TableView tableView, int rangeStart, int rangeEnd) {
                selectionChanged(tableView);
            }

            @Override public void selectedRangesChanged(TableView tableView, Sequence<Span> previousSelectedRanges) {
                selectionChanged(tableView);
            }

            @Override public void selectedRowChanged(TableView tableView, Object previousSelectedRow) {
                selectionChanged(tableView);
            }

            private void selectionChanged(TableView tableView) {
                int length = 0;
                ImmutableList<Span> ranges = tableView.getSelectedRanges();
                for (Span span : ranges) {
                    length += span.getLength();
                }
                songpane.downloadButton.setEnabled(length > 0);
                songpane.downloadButton.setButtonData(new ButtonData(
                    ((ButtonData) songpane.downloadButton.getButtonData()).getIcon(),
                    "Download" + (length == 0 ? "" : " (" + length + ")")
                ));
                songpane.playButton.setEnabled(length > 0);
                for (Object listData : songpane.playButton.getListData()) {
                    ListIdItem item = (ListIdItem) listData;
                    item.setText(item.getUserData().toString() + (length == 0 ? "" : " (" + length + ")"));
                }
            }
        });

        albumpane.albumTable.setTableData(albumList);
        albumpane.albumTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        albumpane.albumTable.getComponentMouseListeners().add(new TooltipTableMouseListener());
        albumpane.albumTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                Song song = (Song) row;
                if ("albumName".equals(column.getName())) {
                    main.openSearchTab(new AlbumSearch(song.getAlbumID(), song.getAlbumName(), song.getArtistID(), song.getArtistName()));
                } else if ("artistName".equals(column.getName())) {
                    main.openSearchTab(new ArtistSearch(song.getArtistID(), song.getArtistName()));
                }
                return false;
            }
        });

        artistpane.artistTable.setTableData(artistList);
        artistpane.artistTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        artistpane.artistTable.getComponentMouseListeners().add(new TooltipTableMouseListener());
        artistpane.artistTable.getClickableTableListeners().add(new ClickableTableListener() {
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

        songpane.songSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override public boolean keyTyped(Component searchField, char character) {
                songList.setFilter(new SongListFilter());
                return false;
            }
        });

        albumpane.albumSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
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

        artistpane.artistSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
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

    public SearchParameter getSearchParameter() {
        return searchParameter;
    }

    public void setSearchParameter(SearchParameter searchParameter) {
        this.searchParameter = searchParameter;
        this.searchLabel.setText(getLabel());
        switch (searchParameter.getSearchType()) {
            case General:
                try {
                    BXMLSerializer bxmlSerializer = new BXMLSerializer();
                    bxmlSerializer.getNamespace().put("main", main);
                    LazyLoadingCardPane lazyLoadingCardPane = (LazyLoadingCardPane) bxmlSerializer.readObject(getClass().getResource("lazyloadingcardpane.bxml"), resources);
                    lazyLoadingCardPane.setContentResource("peopletablepane.bxml");
                    tabPane.getTabs().add(lazyLoadingCardPane);
                    TabPane.setTabData(lazyLoadingCardPane, new ButtonData("People"));
                    tabPane.setSelectedIndex(0);
                } catch (IOException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                } catch (SerializationException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
                break;
            case Artist:
                // remove "Artist" column
                removeColumn(songpane.songTable, "artistName");
                // remove "Relevance" column because it is always 0
                removeColumn(songpane.songTable, "scorePercentage");
                // sort by popularity
                songpane.songTable.setSort("popularityPercentage", SortDirection.DESCENDING);
                // remove unnecessary tabs
                tabPane.getTabs().remove(albumCardPane);
                tabPane.getTabs().remove(artistCardPane);
                tabPane.setSelectedIndex(0);
                break;
            case Album:
                // remove "Album" column
                removeColumn(songpane.songTable, "albumName");
                // remove "Relevance" column because it is always 0
                removeColumn(songpane.songTable, "scorePercentage");
                // sort by popularity
                songpane.songTable.setSort("popularityPercentage", SortDirection.DESCENDING);
                // remove unnecessary tabs
                tabPane.getTabs().remove(albumCardPane);
                tabPane.getTabs().remove(artistCardPane);
                tabPane.setSelectedIndex(0);
                break;
            case User:
                tabPane.getTabs().remove(albumCardPane);
                tabPane.getTabs().remove(artistCardPane);
                tabPane.setSelectedIndex(0);
                break;
            default:
                throw new IllegalStateException("illegal branch: " + searchParameter.getSearchType());
        }

        loadColumnWidthsFromPreferences(songpane.songTable, "songTable");
        loadColumnWidthsFromPreferences(artistpane.artistTable, "artistTable");
        loadColumnWidthsFromPreferences(albumpane.albumTable, "albumTable");
    }

    public String getLabel() {
        return searchParameter.getLabel();
    }

    public String getShortLabel() {
        String shortLabel = searchParameter.getShortLabel();
        return shortLabel.length() > 20 ? shortLabel.substring(0, 20) + "..." : shortLabel;
    }

    public void setSongs(Song[] songs) {
        ArrayList<Song> songList = new ArrayList<Song>(songs);
        ArrayList<Song> albumList = filterAlbums(songList);
        Song allAlbumsEntry = new Song();
        allAlbumsEntry.setAlbumName("All Albums");
        albumList.insert(allAlbumsEntry, 0);
        this.songList.setSource(songList);
        this.songAlbumList.setSource(albumList);
        this.songpane.songAlbumTable.setSelectedIndex(0);
    }

    public void setArtists(Song[] artists) {
        artistList.setSource(new ArrayList<Song>(artists));
    }

    public void setAlbums(Song[] albums) {
        albumList.setSource(new ArrayList<Song>(albums));
    }

    public void startSearch() {
        Component selectedTab = tabPane.getSelectedTab();
        if (selectedTab == null)
            return;
        if (selectedTab == songCardPane)
            loadSongs();
        else if (selectedTab == artistCardPane)
            loadArtists();
        else if (selectedTab == albumCardPane)
            loadAlbums();
        else if (selectedTab instanceof LazyLoadingCardPane)
            try {
                ((LazyLoadingCardPane)selectedTab).load(searchParameter);
            } catch (SerializationException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            } catch (IOException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        else
            throw new IllegalStateException("illegal branch: " + selectedTab);
    }

    private void setSongsGroupByAlbum(boolean groupByAlbum) {
        if (groupByAlbum) {
            songpane.songSplitPane.getLeft().setVisible(true);
            songpane.songSplitPane.setLocked(false);
            songpane.songSplitPane.getStyles().put("splitterThickness", 6);
            songpane.songSplitPane.setSplitRatio(0.25f);
        } else {
            songpane.songSplitPane.setSplitRatio(0.0f);
            songpane.songSplitPane.getStyles().put("splitterThickness", 0);
            songpane.songSplitPane.getLeft().setVisible(false);
            songpane.songSplitPane.setLocked(true);
            if (songpane.songAlbumTable.getTableData().getLength() > 0) {
                songpane.songAlbumTable.setSelectedIndex(0); // select "All albums"
            }
        }
    }

    private void loadSongs() {
        if (!songsLoaded) {
            songsLoaded = true;
            if (searchParameter.getSearchType() == SearchType.User) {
                TabPane.setTabData(songCardPane, "Library");
            } else if (searchParameter.getSearchType() == SearchType.Album) {
                songpane.songGroupByButton.setVisible(false);
                songpane.songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.TRUE);
                songpane.songGroupByButton.setSelectedIndex(1); // select "Don't Group"
                songpane.songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.FALSE);
            }
            executeGuiAsyncTask(new SearchSongsTask(), songCardPane);
        }
    }

    private void loadArtists() {
        if (!artistsLoaded) {
            artistsLoaded = true;
            executeGuiAsyncTask(new SearchArtistsTask(), artistCardPane);
        }
    }

    private void loadAlbums() {
        if (!albumsLoaded) {
            albumsLoaded = true;
            executeGuiAsyncTask(new SearchAlbumsTask(), albumCardPane);
        }
    }

    private void loadColumnWidthsFromPreferences(final TableView tableView, final String tablePrefName) {
        try {
            Preferences columnPrefs = getPrefsForTable(tablePrefName).node("columns");
            ArrayList<TableView.Column> columns = WtkUtil.getColumns(tableView, columnPrefs.keys());
            for (TableView.Column column : columns) {
                if (!column.isRelative()) {
                    int storedWidth = columnPrefs.getInt(column.getName(), column.getWidth());
                    column.setWidth(storedWidth);
                }
            }
        } catch (BackingStoreException ex) {
            log.error("cannot load column widths from preferences for table " + tablePrefName, ex);
        }

        tableView.getTableViewColumnListeners().add(new TableViewColumnListener.Adapter() {
            @Override
            public void columnWidthChanged(TableView.Column column, int previousWidth, boolean previousRelative) {
                if (!column.getTableView().isVisible()) return;
                if (searchParameter == null) return;
                if (tableView.getUserData().get("dontRedistributeColumnWidths") == Boolean.TRUE) return;
                if (column.isRelative()) return;
                Preferences columnPrefs = getPrefsForTable(tablePrefName).node("columns");
                columnPrefs.putInt(column.getName(), column.getWidth());
            }
        });
    }

    private Preferences getPrefsForTable(String tablePrefName) {
        return prefs.node(tablePrefName).node(searchParameter.getSearchType().name());
    }

    private <V> void executeGuiAsyncTask(GuiAsyncTask<V> task, CardPane activityCardPane) {
        ActivityIndicator activityIndicator = (ActivityIndicator) ((BoxPane) activityCardPane.get(0)).get(0);
        GuiAsyncTaskListener<V> asyncTaskListener = new GuiAsyncTaskListener<V>(activityCardPane, activityIndicator);
        // show activity pane on the tab
        activityCardPane.getCardPaneListeners().add(asyncTaskListener);
        activityIndicator.setActive(true);
        activityCardPane.setSelectedIndex(0);
        // execute task
        task.execute(asyncTaskListener);
    }

    private static void removeColumn(TableView tableView, String columnNameToRemove) {
        TableView.Column columnToRemove = WtkUtil.getColumns(tableView, columnNameToRemove).get(0);
        tableView.getColumns().remove(columnToRemove);
    }

    private static ArrayList<Song> filterAlbums(ArrayList<Song> songs) {
        HashSet<Long> albumIDs = new HashSet<Long>();
        ArrayList<Song> result = new ArrayList<Song>(songs.getLength());
        for (Song song : songs) {
            if (!albumIDs.contains(song.getAlbumID())) {
                result.add(song);
                albumIDs.add(song.getAlbumID());
            }
        }
        ArrayList.sort(result, new Comparator<Song>() {
            @Override public int compare(Song song1, Song song2) {
                return compareNullSafe(song1.getAlbumName(), song2.getAlbumName());
            }
        });
        return result;
    }


    private class SongListFilter implements Filter<Song> {
        @Override public boolean include(Song song) {
            if (songListSelectedAlbumID != null)
                if (!songListSelectedAlbumID.equals(song.getAlbumID()))
                    return false;
            String searchString = songpane.songSearchInPage.getText().trim();
            if (containsIgnoringCase(song.getSongName(), searchString))
                return true;
            SearchType searchType = searchParameter.getSearchType();
            if (searchType != SearchType.Album)
                if (containsIgnoringCase(song.getAlbumName(), searchString))
                    return true;
            if (searchType != SearchType.Artist)
                if (containsIgnoringCase(song.getArtistName(), searchString))
                    return true;
            return false;
        }
    }


    private class GuiAsyncTaskListener<V> implements TaskListener<V>, CardPaneListener {
        private final CardPane activityCardPane;
        private final ActivityIndicator activityIndicator;
        private volatile boolean taskExecuted;

        public GuiAsyncTaskListener(CardPane activityCardPane, ActivityIndicator activityIndicator) {
            this.activityCardPane = activityCardPane;
            this.activityIndicator = activityIndicator;
        }

        @Override public void taskExecuted(Task<V> task) {
            taskExecuted = true;
            hideActivityPane();
        }

        @Override public void executeFailed(Task<V> task) {
            taskExecuted = true;
            Exception ex = task.getFault();
            hideActivityPane();
            main.showError("Error: " + ((GuiAsyncTask) task).getDescription(), ex);
        }

        private void hideActivityPane() {
            activityCardPane.setSelectedIndex(1);
            activityIndicator.setActive(false);
            activityCardPane.getCardPaneListeners().remove(this);
        }

        @Override public Vote previewSelectedIndexChange(CardPane cardPane, int selectedIndex) {
            return Vote.APPROVE;
        }

        @Override public void selectedIndexChangeVetoed(CardPane cardPane, Vote reason) {
        }

        @Override public void selectedIndexChanged(CardPane cardPane, int previousSelectedIndex) {
            if (cardPane.getSelectedIndex() == 0 && taskExecuted) {
                hideActivityPane();
            }
        }
    }


    private class SearchSongsTask extends GuiAsyncTask<Song[]> {
        public SearchSongsTask() {
            super("searching for songs named \"" + searchParameter.getSimpleSearchString() + "\"");
            setSongs(new Song[]{});
        }

        @Override public Song[] execute() throws TaskExecutionException {
            try {
                return Services.getSearchService().searchSongs(searchParameter);
            } catch (Exception ex) {
                throw new TaskExecutionException(ex);
            }
        }

        @Override protected void taskExecuted() {
            Song[] result = getResult();
            setSongs(result);
            if (searchParameter.getSearchType() == SearchType.General
                || searchParameter.getSearchType() == SearchType.Artist
                || searchParameter.getSearchType() == SearchType.User) {
                ApplicationContext.queueCallback(new Runnable() {
                    @Override public void run() {
                        boolean groupByAlbum = getPrefsForTable("song").getBoolean("groupByAlbum", true);
                        songpane.songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.TRUE);
                        songpane.songGroupByButton.setSelectedIndex(groupByAlbum ? 0 : 1);
                        songpane.songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.FALSE);
                    }
                });
            }
        }
    }


    private class SearchArtistsTask extends GuiAsyncTask<Song[]> {
        public SearchArtistsTask() {
            super("searching for artists named \"" + searchParameter.getSimpleSearchString() + "\"");
            setArtists(new Song[]{});
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
            setArtists(result);
        }
    }


    private class SearchAlbumsTask extends GuiAsyncTask<Song[]> {
        public SearchAlbumsTask() {
            super("searching for albums named \"" + searchParameter.getSimpleSearchString() + "\"");
            setAlbums(new Song[]{});
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
            setAlbums(result);
        }
    }
}
