package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.SearchResult;
import groovejames.model.Song;
import groovejames.service.PlayService;
import groovejames.service.Services;
import groovejames.service.search.AlbumSearch;
import groovejames.service.search.ArtistSearch;
import groovejames.service.search.SearchType;
import groovejames.service.search.SongSearch;
import groovejames.util.FilteredList;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.HashSet;
import org.apache.pivot.collections.List;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.collections.immutable.ImmutableList;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.ButtonStateListener;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.Menu;
import org.apache.pivot.wtk.MenuHandler;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.PushButton;
import org.apache.pivot.wtk.SortDirection;
import org.apache.pivot.wtk.Span;
import org.apache.pivot.wtk.SplitPane;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TableViewSelectionListener;
import org.apache.pivot.wtk.TextInput;
import org.apache.pivot.wtk.content.ButtonData;

import java.net.URL;
import java.util.Comparator;
import java.util.Set;
import java.util.prefs.Preferences;

import static groovejames.util.StringUtils.compareNullSafe;
import static groovejames.util.StringUtils.containsIgnoringCase;

public class SongTablePane extends AbstractSearchTablePane<Song> {

    @BXML private ClickableTableView songTable;
    @BXML private TableView songAlbumTable;
    @BXML private SplitPane songSplitPane;
    @BXML private PushButton downloadButton;
    @BXML private PushButton playButton;
    @BXML private PushButton enqueueButton;
    @BXML private PushButton shareButton;
    @BXML private TextInput songSearchInPage;
    @BXML private Menu.Item groupByAlbum;

    private Main main;
    private FilteredList<Song> songList = new FilteredList<>(new ArrayList<Song>());
    private FilteredList<Song> songAlbumList = new FilteredList<>(new ArrayList<Song>());
    private Long songListSelectedAlbumID;
    private Preferences prefs = Preferences.userNodeForPackage(SearchResultPane.class);

    private Action downloadAction;
    private Action playAction;
    private Action enqueueAction;
    private Action shareAction;

    @Override
    public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        downloadAction = new Action(false) {
            @Override
            public void perform(Component source) {
                Sequence<Song> selectedRows = getSelectedSongs();
                for (int i = 0, len = selectedRows.getLength(); i < len; i++) {
                    Song song = selectedRows.get(i);
                    main.download(song);
                }
            }
        };

        playAction = new Action(false) {
            @Override
            public void perform(Component source) {
                Sequence<Song> selectedRows = getSelectedSongs();
                main.play(selectedRows, PlayService.AddMode.NOW);
            }
        };

        enqueueAction = new Action(false) {
            @Override
            public void perform(Component source) {
                Sequence<Song> selectedRows = getSelectedSongs();
                main.play(selectedRows, PlayService.AddMode.LAST);
            }
        };

        shareAction = new Action(false) {
            @Override
            public void perform(Component source) {
                Sequence<Song> selectedRows = getSelectedSongs();
                if (selectedRows.getLength() > 0) {
                    main.shareSongs(selectedRows);
                } else if (searchParameter.getSearchType() == SearchType.Album) {
                    AlbumSearch currentAlbumSearch = (AlbumSearch) searchParameter;
                    AlbumSearch newAlbumSearch = new AlbumSearch(currentAlbumSearch.getAlbumID(), currentAlbumSearch.getAlbumName(), currentAlbumSearch.getArtistName(), true);
                    main.shareAlbum(newAlbumSearch);
                }
            }
        };

        downloadButton.setAction(downloadAction);
        playButton.setAction(playAction);
        enqueueButton.setAction(enqueueAction);
        shareButton.setAction(shareAction);

        groupByAlbum.getButtonStateListeners().add(new ButtonStateListener() {
            @Override
            public void stateChanged(Button button, Button.State previousState) {
                if (button.getState() != previousState) {
                    boolean groupByAlbum = button.isSelected();
                    setSongsGroupByAlbum(groupByAlbum);
                    // save setting
                    prefs.node("songTable").node(searchParameter.getSearchType().name()).putBoolean("groupByAlbum", groupByAlbum);
                    // redistribute space among some of the columns
                    if (songTable.getUserData().get("dontRedistributeColumnWidths") != Boolean.TRUE) {
                        if (songSplitPane.getWidth() > 0) {
                            ArrayList<TableView.Column> columns = WtkUtil.getColumns(songTable, "songName", "artistName", "albumName");
                            int d = (int) (((songSplitPane.getWidth() * 0.25) + 6.0) / columns.getLength()) * (groupByAlbum ? -1 : 1);
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

        songAlbumTable.setTableData(songAlbumList);
        TooltipTableMouseListener.install(songAlbumTable);
        songAlbumTable.getTableViewSelectionListeners().add(new TableViewSelectionListener.Adapter() {
            @Override
            public void selectedRangesChanged(TableView tableView, Sequence<Span> previousSelectedRanges) {
                int idx = songAlbumTable.getSelectedIndex();
                songListSelectedAlbumID = idx >= 0 ? songAlbumList.get(idx).getAlbumID() : null;
                songList.setFilter(new SongListFilter());
            }
        });

        TooltipTableMouseListener.install(songTable);
        songTable.setTableData(songList);
        songTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        songTable.getComponentKeyListeners().add(new TableSelectAllKeyListener());
        songTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                Song song = (Song) row;
                if ("artistName".equals(column.getName())) {
                    main.openSearchTab(new ArtistSearch(song.getArtistID(), song.getArtistName()));
                } else if ("albumName".equals(column.getName())) {
                    main.openSearchTab(new AlbumSearch(song.getAlbumID(), song.getAlbumName(), song.getArtistName(), false));
                }
                return false;
            }
        });
        songTable.getTableViewSelectionListeners().add(new TableViewSelectionListener() {
            @Override
            public void selectedRangeAdded(TableView tableView, int rangeStart, int rangeEnd) {
                updateToolbarButtons();
            }

            @Override
            public void selectedRangeRemoved(TableView tableView, int rangeStart, int rangeEnd) {
                updateToolbarButtons();
            }

            @Override
            public void selectedRangesChanged(TableView tableView, Sequence<Span> previousSelectedRanges) {
                updateToolbarButtons();
            }

            @Override
            public void selectedRowChanged(TableView tableView, Object previousSelectedRow) {
                updateToolbarButtons();
            }
        });
        songTable.setMenuHandler(new MenuHandler.Adapter() {
            @Override
            public boolean configureContextMenu(Component component, Menu menu, int x, int y) {
                int total = songTable.getTableData().getLength();
                int selected = getSelectedRows();
                String suffix = total == 0 ? "" : selected == 0 ? " all songs" : selected == 1 ? " this song" : " " + selected + " songs";
                Menu.Item downloadMenuItem = new Menu.Item("Download" + suffix);
                downloadMenuItem.setAction(downloadAction);
                Menu.Item playMenuItem = new Menu.Item("Play" + suffix);
                playMenuItem.setAction(playAction);
                Menu.Item enqueueMenuItem = new Menu.Item("Enqueue" + suffix);
                enqueueMenuItem.setAction(enqueueAction);
                Menu.Item shareMenuItem = new Menu.Item("Share" + suffix);
                shareMenuItem.setAction(shareAction);
                Menu.Section menuSection = new Menu.Section();
                menuSection.add(downloadMenuItem);
                menuSection.add(playMenuItem);
                menuSection.add(enqueueMenuItem);
                menuSection.add(shareMenuItem);
                menu.getSections().add(menuSection);
                return false;
            }
        });


        songSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override
            public boolean keyTyped(Component searchField, char character) {
                updateFilter();
                return false;
            }
        });

        updateFilter();
        updateToolbarButtons();
    }

    private void updateToolbarButtons() {
        boolean isSongsForAlbums = (searchParameter != null && searchParameter.getSearchType() == SearchType.Album);
        int total = songTable.getTableData().getLength();
        int selected = getSelectedRows();
        downloadAction.setEnabled(total > 0);
        playAction.setEnabled(total > 0);
        enqueueAction.setEnabled(total > 0);
        shareAction.setEnabled(isSongsForAlbums || total > 0);

        String suffix = total == 0 ? "" : selected == 0 ? " all" : " (" + selected + ")";
        downloadButton.setButtonData(new ButtonData(((ButtonData) downloadButton.getButtonData()).getIcon(), "Download" + suffix));
        playButton.setButtonData(new ButtonData(((ButtonData) playButton.getButtonData()).getIcon(), "Play" + suffix));
        enqueueButton.setButtonData(new ButtonData(((ButtonData) enqueueButton.getButtonData()).getIcon(), "Enqueue" + suffix));

        String shareButtonText = "Share song(s)";
        if (selected == 1 || total == 1) {
            shareButtonText = "Share this song";
        } else if (selected > 1) {
            shareButtonText = "Share " + selected + " songs";
        } else if (isSongsForAlbums) {
            shareButtonText = "Share this album";
        } else if (total > 1) {
            shareButtonText = "Share all songs";
        }
        shareButton.setButtonData(new ButtonData(((ButtonData) shareButton.getButtonData()).getIcon(), shareButtonText));
    }

    private int getSelectedRows() {
        int selected = 0;
        ImmutableList<Span> ranges = songTable.getSelectedRanges();
        for (Span span : ranges) {
            selected += span.getLength();
        }
        return selected;
    }

    @SuppressWarnings("unchecked")
    private Sequence<Song> getSelectedSongs() {
        if (songTable.getFirstSelectedIndex() == -1) {
            // nothing is selected, return all
            return (Sequence<Song>) songTable.getTableData();
        } else {
            return (Sequence<Song>) songTable.getSelectedRows();
        }
    }

    private void updateFilter() {
        songList.setFilter(new SongListFilter());
    }

    private void setSongsGroupByAlbum(boolean groupByAlbum) {
        if (groupByAlbum) {
            songSplitPane.getLeft().setVisible(true);
            songSplitPane.setLocked(false);
            songSplitPane.getStyles().put("splitterThickness", 6);
            songSplitPane.setSplitRatio(0.25f);
        } else {
            songSplitPane.setSplitRatio(0.0f);
            songSplitPane.getStyles().put("splitterThickness", 0);
            songSplitPane.getLeft().setVisible(false);
            songSplitPane.setLocked(true);
            if (songAlbumTable.getTableData().getLength() > 0) {
                songAlbumTable.setSelectedIndex(0); // select "All albums"
            }
        }
    }

    @Override
    public void afterLoad() {
        super.afterLoad();

        updateToolbarButtons();

        WtkUtil.setupColumnWidthSaver(songTable, "songTable", searchParameter.getSearchType().name());

        switch (searchParameter.getSearchType()) {
            case Artist:
                // remove "Artist" column
                WtkUtil.removeColumn(songTable, "artistName");
                // remove "Relevance" column
                WtkUtil.removeColumn(songTable, "relevance");
                // sort by popularity (instead of relevance)
                songTable.setSort("popularity", SortDirection.DESCENDING);
                break;
            case Album:
                // remove "Album" column
                WtkUtil.removeColumn(songTable, "albumName");
                // remove "Relevance" column
                WtkUtil.removeColumn(songTable, "relevance");
                // sort by track number (instead of relevance)
                songTable.setSort("trackNum", SortDirection.ASCENDING);
                break;
            case Playlist:
            case Songs:
                // remove "Relevance" column
                WtkUtil.removeColumn(songTable, "relevance");
                // sort by track number (instead of relevance)
                songTable.setSort("trackNum", SortDirection.ASCENDING);
                break;
            case User:
                // don't sort at all
                songTable.clearSort();
                break;
            default:
                break;
        }
    }

    @Override
    public String getSearchDescription() {
        return "searching for songs named \"" + searchParameter.getDescription() + "\"";
    }

    @Override
    public void beforeSearch() {
        SearchType searchType = searchParameter.getSearchType();
        if (searchType == SearchType.Album) {
            groupByAlbum.setEnabled(false);
        }
        if (searchType == SearchType.Album || searchType == SearchType.Songs) {
            songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.TRUE);
            groupByAlbum.setSelected(false);
            songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.FALSE);
        }
    }

    @Override
    public SearchResult<Song> search() throws Exception {
        return Services.getSearchService().searchSongs(searchParameter);
    }

    @Override
    public void afterSearch(SearchResult<Song> result) {
        updateCountTextAndMoreLink(result);
        Song[] songs = result.getResult();
        boolean isFirstAdd = songList.isEmpty();
        addSongs(songs);
        updateToolbarButtons();
        Set<Long> autoPlaySongIds = new java.util.HashSet<>();
        if (searchParameter.getSearchType() == SearchType.Album) {
            if (((AlbumSearch) searchParameter).isAutoplay()) {
                for (Song song : songs) {
                    autoPlaySongIds.add(song.getSongID());
                }
            }
        } else if (searchParameter.getSearchType() == SearchType.Songs) {
            autoPlaySongIds = ((SongSearch) searchParameter).getAutoPlaySongIds();
        } else {
            boolean pGroupByAlbum = prefs.node("songTable").node(searchParameter.getSearchType().name()).getBoolean("groupByAlbum", true);
            songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.TRUE);
            groupByAlbum.setSelected(pGroupByAlbum);
            songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.FALSE);
        }
        if (isFirstAdd && !autoPlaySongIds.isEmpty()) {
            List<Song> autoPlaySongs = new ArrayList<>();
            List<?> tableData = songTable.getTableData();
            for (Object o : tableData) {
                Song song = (Song) o;
                if (autoPlaySongIds.contains(song.getSongID())) {
                    autoPlaySongs.add(song);
                }
            }
            main.play(autoPlaySongs, PlayService.AddMode.NOW);
        }
    }

    private void addSongs(Song[] songs) {
        for (Song song : songs) {
            songList.add(song);
        }
        ArrayList<Song> albumList = filterAlbums();
        Song allAlbumsEntry = new Song();
        allAlbumsEntry.setAlbumID(-1);
        allAlbumsEntry.setAlbumName("All Albums");
        albumList.insert(allAlbumsEntry, 0);
        songAlbumList.setSource(albumList);
        songAlbumTable.setSelectedIndex(0);
    }

    private ArrayList<Song> filterAlbums() {
        HashSet<Long> albumIDs = new HashSet<>();
        ArrayList<Song> result = new ArrayList<>(songList.getLength());
        for (Song song : songList) {
            if (!albumIDs.contains(song.getAlbumID())) {
                result.add(song);
                albumIDs.add(song.getAlbumID());
            }
        }
        ArrayList.sort(result, new Comparator<Song>() {
            @Override
            public int compare(Song song1, Song song2) {
                return compareNullSafe(song1.getAlbumName(), song2.getAlbumName());
            }
        });
        return result;
    }

    private class SongListFilter implements Filter<Song> {
        @Override
        public boolean include(Song song) {
            if (songListSelectedAlbumID != null && songListSelectedAlbumID != -1) {
                if (!songListSelectedAlbumID.equals(song.getAlbumID()))
                    return false;
            }
            String searchString = songSearchInPage.getText().trim();
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
}
