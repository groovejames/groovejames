package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Song;
import groovejames.service.PlayService;
import groovejames.service.Services;
import groovejames.service.search.AlbumSearch;
import groovejames.service.search.ArtistSearch;
import groovejames.service.search.SearchParameter;
import groovejames.service.search.SearchType;
import groovejames.service.search.SongSearch;
import groovejames.util.FilteredList;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.HashSet;
import org.apache.pivot.collections.List;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.collections.immutable.ImmutableList;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.ButtonGroup;
import org.apache.pivot.wtk.ButtonGroupListener;
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
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TableViewSelectionListener;
import org.apache.pivot.wtk.TextInput;
import org.apache.pivot.wtk.content.ButtonData;

import java.net.URL;
import java.util.Comparator;
import java.util.Set;
import java.util.prefs.Preferences;

import static groovejames.util.Util.compareNullSafe;
import static groovejames.util.Util.containsIgnoringCase;

public class SongTablePane extends TablePane implements Bindable, CardPaneContent<Song> {

    private @BXML ClickableTableView songTable;
    private @BXML TableView songAlbumTable;
    private @BXML SplitPane songSplitPane;
    private @BXML PushButton downloadButton;
    private @BXML PushButton playButton;
    private @BXML PushButton enqueueButton;
    private @BXML PushButton shareButton;
    private @BXML TextInput songSearchInPage;
    private @BXML ButtonGroup showButtonGroup;
    private @BXML Menu.Item showAll;
    private @BXML Menu.Item showVerified;
    private @BXML Menu.Item groupByAlbum;

    private Main main;
    private FilteredList<Song> songList = new FilteredList<Song>();
    private FilteredList<Song> songAlbumList = new FilteredList<Song>();
    private Long songListSelectedAlbumID;
    private SearchParameter searchParameter;
    private Preferences prefs = Preferences.userNodeForPackage(SearchResultPane.class);

    private Action downloadAction;
    private Action playAction;
    private Action enqueueAction;
    private Action shareAction;

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        downloadAction = new Action(false) {
            @Override public void perform(Component source) {
                Sequence<?> selectedRows = songTable.getSelectedRows();
                for (int i = 0, len = selectedRows.getLength(); i < len; i++) {
                    Song song = (Song) selectedRows.get(i);
                    main.download(song);
                }
            }
        };

        playAction = new Action(false) {
            @Override @SuppressWarnings("unchecked") public void perform(Component source) {
                Sequence<Song> selectedRows = (Sequence<Song>) songTable.getSelectedRows();
                main.play(selectedRows, PlayService.AddMode.NOW);
            }
        };

        enqueueAction = new Action(false) {
            @Override @SuppressWarnings("unchecked") public void perform(Component source) {
                Sequence<Song> selectedRows = (Sequence<Song>) songTable.getSelectedRows();
                main.play(selectedRows, PlayService.AddMode.LAST);
            }
        };

        shareAction = new Action(false) {
            @Override @SuppressWarnings("unchecked") public void perform(Component source) {
                Sequence<Song> selectedRows = (Sequence<Song>) songTable.getSelectedRows();
                if (selectedRows.getLength() > 0) {
                    main.mailSongs(selectedRows);
                } else if (searchParameter.getSearchType() == SearchType.Album) {
                    AlbumSearch currentAlbumSearch = (AlbumSearch) searchParameter;
                    AlbumSearch newAlbumSearch = new AlbumSearch(currentAlbumSearch.getAlbumID(), currentAlbumSearch.getAlbumName(), currentAlbumSearch.getArtistName(), true, showVerified.isSelected());
                    main.mailAlbum(newAlbumSearch);
                }
            }
        };

        downloadButton.setAction(downloadAction);
        playButton.setAction(playAction);
        enqueueButton.setAction(enqueueAction);
        shareButton.setAction(shareAction);

        groupByAlbum.getButtonStateListeners().add(new ButtonStateListener() {
            @Override public void stateChanged(Button button, Button.State previousState) {
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
            @Override public void selectedRangesChanged(TableView tableView, Sequence<Span> previousSelectedRanges) {
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
                    main.openSearchTab(new AlbumSearch(song.getAlbumID(), song.getAlbumName(), song.getArtistName(), false, false));
                }
                return false;
            }
        });
        songTable.getTableViewSelectionListeners().add(new TableViewSelectionListener() {
            @Override public void selectedRangeAdded(TableView tableView, int rangeStart, int rangeEnd) {
                updateToolbarButtons();
            }

            @Override public void selectedRangeRemoved(TableView tableView, int rangeStart, int rangeEnd) {
                updateToolbarButtons();
            }

            @Override public void selectedRangesChanged(TableView tableView, Sequence<Span> previousSelectedRanges) {
                updateToolbarButtons();
            }

            @Override public void selectedRowChanged(TableView tableView, Object previousSelectedRow) {
                updateToolbarButtons();
            }
        });
        songTable.setMenuHandler(new MenuHandler.Adapter() {
            @Override
            public boolean configureContextMenu(Component component, Menu menu, int x, int y) {
                int length = 0;
                ImmutableList<Span> ranges = songTable.getSelectedRanges();
                for (Span span : ranges) {
                    length += span.getLength();
                }
                String suffix = length == 0 ? "" : length == 1 ? " this song" : " " + length + " songs";
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

        updateToolbarButtons();
        updateFilter();
    }

    private void updateToolbarButtons() {
        boolean isSongsForAlbums = (searchParameter != null && searchParameter.getSearchType() == SearchType.Album);
        int length = 0;
        ImmutableList<Span> ranges = songTable.getSelectedRanges();
        for (Span span : ranges) {
            length += span.getLength();
        }
        downloadAction.setEnabled(length > 0);
        playAction.setEnabled(length > 0);
        enqueueAction.setEnabled(length > 0);
        shareAction.setEnabled(isSongsForAlbums || length > 0);

        String suffix = length == 0 ? "" : " (" + length + ")";
        downloadButton.setButtonData(new ButtonData(((ButtonData) downloadButton.getButtonData()).getIcon(), "Download" + suffix));
        playButton.setButtonData(new ButtonData(((ButtonData) playButton.getButtonData()).getIcon(), "Play Now" + suffix));
        enqueueButton.setButtonData(new ButtonData(((ButtonData) enqueueButton.getButtonData()).getIcon(), "Enqueue" + suffix));

        String shareButtonText = "Share song(s)";
        if (length == 1) {
            shareButtonText = "Share this song";
        } else if (length > 1) {
            shareButtonText = "Share " + length + " songs";
        } else if (isSongsForAlbums) {
            shareButtonText = "Share this album";
        }
        shareButton.setButtonData(new ButtonData(((ButtonData) shareButton.getButtonData()).getIcon(), shareButtonText));
    }

    private void updateFilter() {
        songList.setFilter(new SongListFilter());
        songAlbumList.setFilter(new SongAlbumListFilter());
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

    @Override public void afterLoad(SearchParameter searchParameter) {
        this.searchParameter = searchParameter;

        updateToolbarButtons();

        WtkUtil.setupColumnWidthSaver(songTable, "songTable", searchParameter.getSearchType().name());

        switch (searchParameter.getSearchType()) {
            case Artist:
                // remove "Artist" column
                WtkUtil.removeColumn(songTable, "artistName");
                // sort by popularity (instead of score)
                songTable.setSort("popularityPercentage", SortDirection.DESCENDING);
                break;
            case Album:
                // remove "Album" column
                WtkUtil.removeColumn(songTable, "albumName");
                // sort by track number (instead of score)
                songTable.setSort("trackNum", SortDirection.ASCENDING);
                break;
            case Playlist:
                // remove "Relevance" column because it is always 0 if we search for playlist's songs
                WtkUtil.removeColumn(songTable, "scorePercentage");
                // show all instead of only verified tracks
                showAll.setSelected(true);
                // sort by track number (instead of score)
                songTable.setSort("trackNum", SortDirection.ASCENDING);
                break;
            case User:
                // remove "Relevance" column because it is always 0 if we search for user's songs
                WtkUtil.removeColumn(songTable, "scorePercentage");
                // show all instead of only verified tracks
                showAll.setSelected(true);
                // don't sort at all
                songTable.clearSort();
                break;
            case Songs:
                // show all instead of only verified tracks
                showAll.setSelected(true);
                // sort by track number (instead of score)
                songTable.setSort("trackNum", SortDirection.ASCENDING);
                break;
            default:
                break;
        }
    }

    @Override public GuiAsyncTask<Song[]> getSearchTask(final SearchParameter searchParameter) {
        return new GuiAsyncTask<Song[]>
            ("searching for songs named \"" + searchParameter.getDescription() + "\"") {
            @Override protected void beforeExecute() {
                SearchType searchType = searchParameter.getSearchType();
                if (searchType == SearchType.Album) {
                    groupByAlbum.setEnabled(false);
                }
                if (searchType == SearchType.Album || searchType == SearchType.Songs) {
                    songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.TRUE);
                    groupByAlbum.setSelected(false);
                    songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.FALSE);
                }
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
                if (searchParameter.getSearchType() == SearchType.Album) {
                    showAll.setSelected(!((AlbumSearch) searchParameter).isVerifiedOnly());
                }
                if (songList.getLength() == 0 || songAlbumList.getLength() == 0) {
                    showAll.setSelected(true);
                }
                Set<Long> autoPlaySongIds = new java.util.HashSet<Long>();
                if (searchParameter.getSearchType() == SearchType.Album) {
                    if (((AlbumSearch) searchParameter).isAutoplay()) {
                        for (Song song : result) {
                            if (!((AlbumSearch) searchParameter).isVerifiedOnly() || song.getIsVerified()) {
                                autoPlaySongIds.add(song.getSongID());
                            }
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
                if (!autoPlaySongIds.isEmpty()) {
                    List<Song> autoPlaySongs = new ArrayList<Song>();
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

            private void setSongs(Song[] songs) {
                ArrayList<Song> songLst = new ArrayList<Song>(songs);
                ArrayList<Song> albumList = filterAlbums(songLst);
                Song allAlbumsEntry = new Song();
                allAlbumsEntry.setAlbumName("All Albums");
                albumList.insert(allAlbumsEntry, 0);
                songList.setSource(songLst);
                songAlbumList.setSource(albumList);
                songAlbumTable.setSelectedIndex(0);
            }

            private ArrayList<Song> filterAlbums(ArrayList<Song> songs) {
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
        };
    }

    private class SongListFilter implements Filter<Song> {
        @Override public boolean include(Song song) {
            if (songListSelectedAlbumID != null)
                if (!songListSelectedAlbumID.equals(song.getAlbumID()))
                    return false;
            boolean showOnlyVerified = showVerified.isSelected();
            if (showOnlyVerified && !song.getIsVerified())
                return false;
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

    private class SongAlbumListFilter implements Filter<Song> {
        @Override public boolean include(Song song) {
            if (song.getAlbumID() == null) // "All Albums" entry
                return true;
            boolean showOnlyVerified = showVerified.isSelected();
            return !showOnlyVerified || song.getIsVerified();
        }
    }
}
