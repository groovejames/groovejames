package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.ListIdItem;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.gui.search.AlbumSearch;
import groovejames.gui.search.ArtistSearch;
import groovejames.gui.search.GeneralSearch;
import groovejames.gui.search.SearchParameter;
import groovejames.gui.search.SearchType;
import groovejames.gui.search.UserSearch;
import groovejames.model.SearchSongsResultType;
import groovejames.model.SearchUsersResultType;
import groovejames.model.Song;
import groovejames.model.Songs;
import groovejames.model.User;
import groovejames.service.Grooveshark;
import groovejames.util.FilteredList;
import static groovejames.util.Util.compareNullSafe;
import static groovejames.util.Util.containsIgnoringCase;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.HashSet;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.collections.immutable.ImmutableList;
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
import org.apache.pivot.wtk.Span;
import org.apache.pivot.wtk.TabPane;
import org.apache.pivot.wtk.TabPaneSelectionListener;
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TableViewColumnListener;
import org.apache.pivot.wtk.TableViewSelectionListener;
import org.apache.pivot.wtk.TextInput;
import org.apache.pivot.wtk.content.ButtonData;

import java.net.URL;
import java.util.Arrays;
import java.util.Comparator;
import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

@SuppressWarnings({"UnusedDeclaration"})
public class SearchResultPane extends TablePane implements Bindable {

    private static final Log log = LogFactory.getLog(SearchResultPane.class);

    @BXML private TabPane tabPane;
    @BXML private CardPane songCardPane;
    @BXML private CardPane artistCardPane;
    @BXML private CardPane albumCardPane;
    @BXML private CardPane peopleCardPane;
    @BXML private Label searchLabel;

    @BXML private SongPane songpane;
    @BXML private ArtistPane artistpane;
    @BXML private AlbumPane albumpane;
    @BXML private PeoplePane peoplepane;

    private Main main;
    private SearchParameter searchParameter;
    private FilteredList<Song> songList = new FilteredList<Song>();
    private FilteredList<Song> songAlbumList = new FilteredList<Song>();
    private FilteredList<Song> albumList = new FilteredList<Song>();
    private FilteredList<Song> artistList = new FilteredList<Song>();
    private FilteredList<User> peopleList = new FilteredList<User>();
    private Long songListSelectedAlbumID;
    private boolean songsLoaded;
    private boolean albumsLoaded;
    private boolean artistsLoaded;
    private boolean peopleLoaded;
    private Preferences prefs = Preferences.userNodeForPackage(SearchResultPane.class);

    public SearchResultPane() {
    }

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
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
                            ArrayList<TableView.Column> columns = getColumns(songpane.songTable, "songName", "artistName", "albumName");
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
                for(Object listData : songpane.playButton.getListData()) {
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

        peoplepane.peopleTable.setTableData(peopleList);
        peoplepane.peopleTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        peoplepane.peopleTable.getComponentMouseListeners().add(new TooltipTableMouseListener());
        peoplepane.peopleTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                if ("username".equals(column.getName())) {
                    User user = (User) row;
                    main.openSearchTab(new UserSearch(user.getUserID(), user.getUsername()));
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

        peoplepane.peopleSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override public boolean keyTyped(Component searchField, char character) {
                final String searchString = ((TextInput) searchField).getText().trim();
                peopleList.setFilter(new Filter<User>() {
                    @Override public boolean include(User user) {
                        return containsIgnoringCase(user.getUsername(), searchString)
                            || containsIgnoringCase(user.getName(), searchString);
                    }
                });
                return false;
            }
        });
    }

    public void setMain(Main main) {
        this.main = main;
        this.artistpane.artistImageRenderer.setImageGetter(main);
        this.albumpane.albumImageRenderer.setImageGetter(main);
        this.peoplepane.peopleImageRenderer.setImageGetter(main);
    }

    public SearchParameter getSearchParameter() {
        return searchParameter;
    }

    public void setSearchParameter(SearchParameter searchParameter) {
        this.searchParameter = searchParameter;
        this.searchLabel.setText(getLabel());
        switch (searchParameter.getSearchType()) {
            case General:
                tabPane.setSelectedIndex(0);
                break;
            case Artist:
                // remove "Artist" column
                removeColumn(songpane.songTable, "artistName");
                // remove unneccessary tabs
                tabPane.getTabs().remove(albumCardPane);
                tabPane.getTabs().remove(artistCardPane);
                tabPane.getTabs().remove(peopleCardPane);
                tabPane.setSelectedIndex(0);
                break;
            case Album:
                // remove "Album" column
                removeColumn(songpane.songTable, "albumName");
                // remove unneccessary tabs
                tabPane.getTabs().remove(albumCardPane);
                tabPane.getTabs().remove(artistCardPane);
                tabPane.getTabs().remove(peopleCardPane);
                tabPane.setSelectedIndex(0);
                break;
            case User:
                tabPane.getTabs().remove(albumCardPane);
                tabPane.getTabs().remove(artistCardPane);
                tabPane.getTabs().remove(peopleCardPane);
                tabPane.setSelectedIndex(0);
                break;
            default:
                throw new IllegalStateException("illegal branch: " + searchParameter.getSearchType());
        }

        loadColumnWidthsFromPreferences(songpane.songTable, "songTable");
        loadColumnWidthsFromPreferences(artistpane.artistTable, "artistTable");
        loadColumnWidthsFromPreferences(albumpane.albumTable, "albumTable");
        loadColumnWidthsFromPreferences(peoplepane.peopleTable, "peopleTable");
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

    public void setPeople(User[] people) {
        peopleList.setSource(new ArrayList<User>(people));
    }

    public void startSearch() {
        Component selectedTab = tabPane.getSelectedTab();
        if (selectedTab == songCardPane)
            loadSongs();
        else if (selectedTab == artistCardPane)
            loadArtists();
        else if (selectedTab == albumCardPane)
            loadAlbums();
        else if (selectedTab == peopleCardPane)
            loadPeople();
        /*
        else
            throw new IllegalStateException("illegal branch: " + selectedTab);
        */
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

    private void loadPeople() {
        if (!peopleLoaded) {
            peopleLoaded = true;
            executeGuiAsyncTask(new SearchPeopleTask(), peopleCardPane);
        }
    }

    private void loadColumnWidthsFromPreferences(final TableView tableView, final String tablePrefName) {
        try {
            Preferences columnPrefs = getPrefsForTable(tablePrefName).node("columns");
            ArrayList<TableView.Column> columns = getColumns(tableView, columnPrefs.keys());
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
        TableView.Column columnToRemove = getColumns(tableView, columnNameToRemove).get(0);
        tableView.getColumns().remove(columnToRemove);
    }

    private static ArrayList<TableView.Column> getColumns(TableView tableView, String... names) {
        ArrayList<TableView.Column> result = new ArrayList<TableView.Column>();
        for (String name : names) {
            for (TableView.Column column : tableView.getColumns()) {
                if (name.equals(column.getName())) {
                    result.add(column);
                }
            }
        }
        return result;
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
            log.error("error in GuiAsyncTask", ex);
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
                Grooveshark grooveshark = main.getGrooveshark();
                SearchType searchType = searchParameter.getSearchType();
                Song[] result;
                if (searchType == SearchType.General) {
                    // search for song names via string search
                    String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                    result = grooveshark.getSearchResultsEx(SearchSongsResultType.Songs, searchString);
                } else if (searchType == SearchType.Album) {
                    // search for songs of the given album
                    Long albumID = ((AlbumSearch) searchParameter).getAlbumID();
                    java.util.ArrayList<Song> allSongs = new java.util.ArrayList<Song>();
                    Songs songs = grooveshark.albumGetSongs(albumID, 0, true);
                    allSongs.addAll(Arrays.asList(songs.getSongs()));
                    boolean hasMore = true;
                    int offset = 0;
                    while (hasMore) {
                        songs = grooveshark.albumGetSongs(albumID, offset, false);
                        allSongs.addAll(Arrays.asList(songs.getSongs()));
                        hasMore = songs.isHasMore();
                        offset += songs.getSongs().length;
                    }
                    result = filterDuplicateSongs(allSongs);
                } else if (searchType == SearchType.Artist) {
                    // search for all songs of the given artist
                    String artistID = ((ArtistSearch) searchParameter).getArtistID().toString();
                    java.util.ArrayList<Song> allSongs = new java.util.ArrayList<Song>();
                    Songs songs = grooveshark.artistGetSongs(artistID, 0, true);
                    allSongs.addAll(Arrays.asList(songs.getSongs()));
                    boolean hasMore = true;
                    int offset = 0;
                    while (hasMore) {
                        songs = grooveshark.artistGetSongs(artistID, offset, false);
                        allSongs.addAll(Arrays.asList(songs.getSongs()));
                        hasMore = songs.isHasMore();
                        offset += songs.getSongs().length;
                    }
                    result = filterDuplicateSongs(allSongs);
                } else if (searchType == SearchType.User) {
                    // search for library songs of the given user
                    String userID = ((UserSearch) searchParameter).getUserID().toString();
                    java.util.ArrayList<Song> allSongs = new java.util.ArrayList<Song>();
                    int page = 0;
                    boolean hasMore = true;
                    while (hasMore) {
                        Songs songs = grooveshark.userGetSongsInLibrary(userID, page);
                        allSongs.addAll(Arrays.asList(songs.getSongs()));
                        hasMore = songs.isHasMore();
                        page++;
                    }
                    // search for favorites, too
                    Song[] favorites = grooveshark.getFavorites(userID, SearchSongsResultType.Songs);
                    allSongs.addAll(Arrays.asList(favorites));
                    result = filterDuplicateSongs(allSongs);
                } else {
                    throw new IllegalArgumentException("invalid search type: " + searchType);
                }
                return result;
            } catch (Exception ex) {
                throw new TaskExecutionException(ex);
            }
        }

        private Song[] filterDuplicateSongs(java.util.ArrayList<Song> allSongs) {
            HashSet<Long> allSongsIds = new HashSet<Long>();
            ArrayList<Song> resultList = new ArrayList<Song>(allSongs.size());
            for (Song song : allSongs) {
                Long songID = song.getSongID();
                if (!allSongsIds.contains(songID)) {
                    resultList.add(song);
                    allSongsIds.add(songID);
                }
            }
            return resultList.toArray(Song[].class);
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
                Grooveshark grooveshark = main.getGrooveshark();
                SearchType searchType = searchParameter.getSearchType();
                Song[] result;
                if (searchType == SearchType.General) {
                    String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                    result = grooveshark.getSearchResultsEx(SearchSongsResultType.Artists, searchString);
                } else {
                    throw new IllegalArgumentException("invalid search type: " + searchType);
                }
                return result;
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
                Grooveshark grooveshark = main.getGrooveshark();
                SearchType searchType = searchParameter.getSearchType();
                Song[] result;
                if (searchType == SearchType.General) {
                    String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                    result = grooveshark.getSearchResultsEx(SearchSongsResultType.Albums, searchString);
                } else {
                    throw new IllegalArgumentException("invalid search type: " + searchType);
                }
                return result;
            } catch (Exception ex) {
                throw new TaskExecutionException(ex);
            }
        }

        @Override protected void taskExecuted() {
            Song[] result = getResult();
            setAlbums(result);
        }
    }


    private class SearchPeopleTask extends GuiAsyncTask<User[]> {
        public SearchPeopleTask() {
            super("searching for people named \"" + searchParameter.getSimpleSearchString() + "\"");
            setPeople(new User[]{});
        }

        @Override public User[] execute() throws TaskExecutionException {
            try {
                Grooveshark grooveshark = main.getGrooveshark();
                SearchType searchType = searchParameter.getSearchType();
                if (searchType == SearchType.General) {
                    String searchString = ((GeneralSearch) searchParameter).getGeneralSearchString();
                    return grooveshark.getSearchResultsEx(SearchUsersResultType.Users, searchString);
                }
                throw new IllegalArgumentException("invalid search type: " + searchType);
            } catch (Exception ex) {
                throw new TaskExecutionException(ex);
            }
        }

        @Override protected void taskExecuted() {
            User[] result = getResult();
            setPeople(result);
        }
    }
}
