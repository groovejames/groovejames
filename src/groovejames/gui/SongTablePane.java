package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.ListIdItem;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Song;
import groovejames.service.PlayService;
import groovejames.service.Services;
import groovejames.service.search.AlbumSearch;
import groovejames.service.search.ArtistSearch;
import groovejames.service.search.SearchParameter;
import groovejames.service.search.SearchType;
import groovejames.util.FilteredList;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.HashSet;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.collections.immutable.ImmutableList;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.ButtonPressListener;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.ListButton;
import org.apache.pivot.wtk.ListButtonSelectionListener;
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
import java.util.prefs.Preferences;

import static groovejames.util.Util.compareNullSafe;
import static groovejames.util.Util.containsIgnoringCase;

public class SongTablePane extends TablePane implements Bindable, CardPaneContent<Song> {

    private @BXML ClickableTableView songTable;
    private @BXML TableView songAlbumTable;
    private @BXML ListButton songGroupByButton;
    private @BXML SplitPane songSplitPane;
    private @BXML PushButton downloadButton;
    private @BXML ListButton playButton;
    private @BXML TextInput songSearchInPage;

    private Main main;
    private FilteredList<Song> songList = new FilteredList<Song>();
    private FilteredList<Song> songAlbumList = new FilteredList<Song>();
    private Long songListSelectedAlbumID;
    private SearchParameter searchParameter;
    private Preferences prefs = Preferences.userNodeForPackage(SearchResultPane.class);

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        songGroupByButton.getListButtonSelectionListeners().add(new ListButtonSelectionListener.Adapter() {
            @Override public void selectedIndexChanged(ListButton listButton, int previousSelectedIndex) {
                int selectedIndex = listButton.getSelectedIndex();
                if (selectedIndex != previousSelectedIndex) {
                    ListIdItem selectedListIdItem = (ListIdItem) listButton.getListData().get(selectedIndex);
                    boolean groupByAlbum = "groupByAlbum".equals(selectedListIdItem.getId());
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
                    main.openSearchTab(new AlbumSearch(song.getAlbumID(), song.getAlbumName(), song.getArtistID(), song.getArtistName()));
                }
                return false;
            }
        });
        songTable.getTableViewSelectionListeners().add(new TableViewSelectionListener() {
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
                downloadButton.setEnabled(length > 0);
                downloadButton.setButtonData(new ButtonData(
                    ((ButtonData) downloadButton.getButtonData()).getIcon(),
                    "Download" + (length == 0 ? "" : " (" + length + ")")
                ));
                playButton.setEnabled(length > 0);
                for (Object listData : playButton.getListData()) {
                    ListIdItem item = (ListIdItem) listData;
                    item.setText(item.getUserData().toString() + (length == 0 ? "" : " (" + length + ")"));
                }
            }
        });

        songSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override public boolean keyTyped(Component searchField, char character) {
                songList.setFilter(new SongListFilter());
                return false;
            }
        });

        downloadButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override public void buttonPressed(Button button) {
                Sequence<?> selectedRows = songTable.getSelectedRows();
                for (int i = 0, len = selectedRows.getLength(); i < len; i++) {
                    Song song = (Song) selectedRows.get(i);
                    main.download(song);
                }
            }
        });

        playButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override @SuppressWarnings("unchecked")
            public void buttonPressed(Button button) {
                ListIdItem listIdItem = (ListIdItem) playButton.getSelectedItem();
                String listItemId = listIdItem.getId();
                PlayService.AddMode addMode =
                    listItemId.equals("playNow") ? PlayService.AddMode.NOW
                        : listItemId.equals("playNext") ? PlayService.AddMode.NEXT
                        : listItemId.equals("playLast") ? PlayService.AddMode.LAST
                        : PlayService.AddMode.REPLACE;
                Sequence<Song> selectedRows = (Sequence<Song>) songTable.getSelectedRows();
                main.play(selectedRows, addMode);
            }
        });
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

        WtkUtil.setupColumnWidthSaver(songTable, "songTable", searchParameter.getSearchType().name());

        if (searchParameter.getSearchType() == SearchType.Artist) {
            // remove "Artist" column
            WtkUtil.removeColumn(songTable, "artistName");
            // remove "Relevance" column because it is always 0 if we search for artist's songs
            WtkUtil.removeColumn(songTable, "scorePercentage");
            // sort by popularity (instead of score)
            songTable.setSort("popularityPercentage", SortDirection.DESCENDING);
        } else if (searchParameter.getSearchType() == SearchType.Album) {
            // remove "Album" column
            WtkUtil.removeColumn(songTable, "albumName");
            // remove "Relevance" column because it is always 0 if we search for album's songs
            WtkUtil.removeColumn(songTable, "scorePercentage");
            // sort by popularity (instead of score)
            songTable.setSort("popularityPercentage", SortDirection.DESCENDING);
        } else if (searchParameter.getSearchType() == SearchType.Playlist) {
            // remove "Relevance" column because it is always 0 if we search for playlist's songs
            WtkUtil.removeColumn(songTable, "scorePercentage");
            // sort by track number (instead of score)
            songTable.setSort("trackNum", SortDirection.ASCENDING);
        }
    }

    @Override public GuiAsyncTask<Song[]> getSearchTask(final SearchParameter searchParameter) {
        return new GuiAsyncTask<Song[]>
            ("searching for songs named \"" + searchParameter.getSimpleSearchString() + "\"") {
            @Override protected void beforeExecute() {
                if (searchParameter.getSearchType() == SearchType.Album) {
                    songGroupByButton.setVisible(false);
                    songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.TRUE);
                    songGroupByButton.setSelectedIndex(1); // select "Don't Group"
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
                if (searchParameter.getSearchType() != SearchType.Album) {
                    boolean groupByAlbum = prefs.node("songTable").node(searchParameter.getSearchType().name()).getBoolean("groupByAlbum", true);
                    songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.TRUE);
                    songGroupByButton.setSelectedIndex(groupByAlbum ? 0 : 1);
                    songTable.getUserData().put("dontRedistributeColumnWidths", Boolean.FALSE);
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
