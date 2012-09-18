package groovejames.gui;

import groovejames.gui.clipboard.GroovesharkAlbumClipboardListener;
import groovejames.gui.clipboard.GroovesharkArtistClipboardListener;
import groovejames.gui.clipboard.GroovesharkPlaylistClipboardListener;
import groovejames.gui.clipboard.GroovesharkUserClipboardListener;
import groovejames.gui.clipboard.WatchClipboardTask;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.FixedTerraTooltipSkin;
import groovejames.gui.components.ImageLoader;
import groovejames.gui.components.SuggestionPopupTextInputContentListener;
import groovejames.gui.components.SuggestionsProvider;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.Settings;
import groovejames.model.Song;
import groovejames.model.Track;
import groovejames.service.PlayService;
import groovejames.service.PlayServiceListener;
import groovejames.service.ProxySettings;
import groovejames.service.Services;
import groovejames.service.search.GeneralSearch;
import groovejames.service.search.SearchParameter;
import groovejames.util.ConsoleUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.BXMLSerializer;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.List;
import org.apache.pivot.collections.ListListener;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.collections.adapter.ListAdapter;
import org.apache.pivot.serialization.SerializationException;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Alert;
import org.apache.pivot.wtk.Application;
import org.apache.pivot.wtk.ApplicationContext;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.ButtonPressListener;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.ComponentMouseButtonListener;
import org.apache.pivot.wtk.DesktopApplicationContext;
import org.apache.pivot.wtk.Display;
import org.apache.pivot.wtk.ImageView;
import org.apache.pivot.wtk.Keyboard;
import org.apache.pivot.wtk.Label;
import org.apache.pivot.wtk.Menu;
import org.apache.pivot.wtk.MenuHandler;
import org.apache.pivot.wtk.MessageType;
import org.apache.pivot.wtk.Meter;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.Platform;
import org.apache.pivot.wtk.Prompt;
import org.apache.pivot.wtk.PushButton;
import org.apache.pivot.wtk.ScrollPane;
import org.apache.pivot.wtk.Separator;
import org.apache.pivot.wtk.Sheet;
import org.apache.pivot.wtk.SheetCloseListener;
import org.apache.pivot.wtk.SplitPane;
import org.apache.pivot.wtk.SplitPaneListener;
import org.apache.pivot.wtk.TabPane;
import org.apache.pivot.wtk.TabPaneListener;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextArea;
import org.apache.pivot.wtk.TextInput;
import org.apache.pivot.wtk.Theme;
import org.apache.pivot.wtk.Tooltip;
import org.apache.pivot.wtk.Window;
import org.apache.pivot.wtk.content.ButtonData;
import org.apache.pivot.wtk.media.Image;
import org.apache.pivot.wtk.skin.terra.TerraTheme;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;
import java.util.Timer;
import java.util.TimerTask;
import java.util.prefs.Preferences;

import static groovejames.util.Util.durationToString;
import static groovejames.util.Util.isEmpty;
import static groovejames.util.Util.toErrorString;
import static java.lang.Math.max;
import static java.lang.Math.min;
import static java.lang.String.format;
import static org.apache.pivot.wtk.ScrollPane.ScrollBarPolicy.AUTO;
import static org.apache.pivot.wtk.ScrollPane.ScrollBarPolicy.FILL;

@SuppressWarnings({"UnusedDeclaration"})
public class Main implements Application {

    private static final Log log = LogFactory.getLog(Main.class);

    private Settings settings;
    private Resources resources;
    private Display display;
    private WatchClipboardTask watchClipboardTask;
    private ImageLoader imageLoader;
    private final ArrayList<Track> downloadTracks = new ArrayList<Track>();

    @BXML private Window window;
    @BXML private SplitPane mainSplitPane;
    @BXML private TabPane tabPane;
    @BXML private TabPane lowerPane;
    @BXML private TextInput searchField;
    @BXML private PushButton searchButton;
    @BXML private PushButton clipboardButton;
    @BXML private TableView downloadsTable;
    @BXML private TableView playerTable;
    @BXML private Label nowPlayingLabel;
    @BXML private Label nowPlayingArtist;
    @BXML private Label nowPlayingSongname;
    @BXML private Label nowPlayingFromTheAlbum;
    @BXML private Label nowPlayingAlbum;
    @BXML private ImageView nowPlayingImage;
    @BXML private Separator nowPlayingSeparator;
    @BXML private Meter playProgress;
    @BXML private Meter playDownloadProgress;
    @BXML private PushButton songPlayPauseButton;
    @BXML private PushButton radioButton;

    public static void main(String[] args) {
        ConsoleUtil.redirectStdErrToCommonsLogging();
        ConsoleUtil.redirectStdOutToCommonsLogging();
        System.setProperty("org.apache.pivot.wtk.skin.terra.location", "/groovejames/gui/GrooveJames_theme.json");
        args = filterSystemProperties(args);
        DesktopApplicationContext.main(Main.class, args);
    }

    private static String[] filterSystemProperties(String[] args) {
        ArrayList<String> result = new ArrayList<String>(args.length);
        for (String arg : args) {
            if (arg.startsWith("\"") && arg.endsWith("\""))
                arg = arg.substring(1, arg.length() - 1);
            if (arg.startsWith("-D"))
                setSystemProperty(arg.substring(2));
            else
                result.add(arg);
        }
        return result.toArray(String[].class);
    }

    private static void setSystemProperty(String arg) {
        String[] arr = arg.split("=", 2);
        String key = arr[0];
        String value = arr.length > 1 ? arr[1] : "";
        System.setProperty(key, value);
    }


    public void startup(Display display, Map<String, String> properties) throws Exception {
        // fix a bug in Pivot: replace the Tooltip skin class to set the background color of tooltips properly
        Theme.getTheme().set(Tooltip.class, FixedTerraTooltipSkin.class);

        this.resources = new Resources("groovejames.gui.resources");
        this.display = display;
        this.settings = loadSettings();
        this.downloadTracks.getListListeners().add(new DownloadTracksListListener());
        this.imageLoader = new ImageLoader();
        this.imageLoader.setUrlPrefix("http://images.grooveshark.com/static/albums/");

        Services.getPlayService().setListener(new PlaylistListener());
        Services.getPlayService().getPlaylist().getListListeners().add(new PlaylistListListener());

        applySettings();
        initActions();
        window = createWindow();
        initComponents();
        window.open(display);
        searchField.requestFocus();
    }

    private Settings loadSettings() {
        Settings settings = new Settings();
        Preferences prefs = Preferences.userNodeForPackage(Settings.class);
        settings.setProxyEnabled(prefs.getBoolean("proxyEnabled", settings.isProxyEnabled()));
        settings.setProxyHost(prefs.get("proxyHost", settings.getProxyHost()));
        settings.setProxyPort(prefs.getInt("proxyPort", settings.getProxyPort()));
        settings.setDownloadLocation(prefs.get("downloadLocation", settings.getDownloadLocation()));
        settings.setFilenameScheme(prefs.get("filenameScheme", settings.getFilenameScheme()));
        return settings;
    }

    private void saveSettings() {
        Preferences prefs = Preferences.userNodeForPackage(Settings.class);
        prefs.putBoolean("proxyEnabled", settings.isProxyEnabled());
        prefs.put("proxyHost", settings.getProxyHost());
        prefs.putInt("proxyPort", settings.getProxyPort());
        prefs.put("downloadLocation", settings.getDownloadLocation());
        prefs.put("filenameScheme", settings.getFilenameScheme());
    }

    private void applySettings() {
        Services.getHttpClientService().setProxySettings(settings.isProxyEnabled() && !isEmpty(settings.getProxyHost()) ? new ProxySettings(settings.getProxyHost(), settings.getProxyPort()) : null);
        Services.getDownloadService().setDownloadDir(new File(settings.getDownloadLocation()));
        Services.getDownloadService().getFilenameSchemeParser().setFilenameScheme(settings.getFilenameScheme());
        Services.resetGrooveshark();
    }

    private void initActions() {
        Action.getNamedActions().put("showSettings", new ShowSettingsAction());
        Action.getNamedActions().put("reloadGUI", new ReloadGUIAction());
        Action.getNamedActions().put("clearSelectedDownloads", new RemoveDownloadsAction(true, false, false));
        Action.getNamedActions().put("clearSuccessfulDownloads", new RemoveDownloadsAction(false, true, false));
        Action.getNamedActions().put("clearFinishedDownloads", new RemoveDownloadsAction(false, false, false));
        Action.getNamedActions().put("deleteSelectedDownloads", new RemoveDownloadsAction(true, false, true));
        Action.getNamedActions().put("deleteSuccessfulDownloads", new RemoveDownloadsAction(false, true, true));
        Action.getNamedActions().put("deleteFinishedDownloads", new RemoveDownloadsAction(false, false, true));

        Action.getNamedActions().put("songPlayPause", new SongPlayPauseAction());
        Action.getNamedActions().put("songPrevious", new SongPreviousAction());
        Action.getNamedActions().put("songNext", new SongNextAction());
        Action.getNamedActions().put("songClearPlaylist", new SongClearPlaylistAction());

        ToggleRadioAction toggleRadioAction = new ToggleRadioAction();
        toggleRadioAction.setEnabled(false);
        Action.getNamedActions().put("toggleRadio", toggleRadioAction);
    }

    private Window createWindow() throws IOException, SerializationException {
        BXMLSerializer serializer = new BXMLSerializer();
        serializer.getNamespace().put("main", this);
        Window window = (Window) serializer.readObject(getClass().getResource("main.bxml"), resources);
        serializer.bind(this, Main.class);
        window.setTitle("GrooveJames " + getVersionNumberAndDate());
        return window;
    }

    private void initComponents() {
        window.getIcons().add(getIcon("images/butler-128.png"));
        window.getIcons().add(getIcon("images/butler-16.png"));
        window.getIcons().add(getIcon("images/butler-32.png"));
        window.getIcons().add(getIcon("images/butler-48.png"));
        window.getIcons().add(getIcon("images/butler-64.png"));
        window.getActionMappings().add(new Window.ActionMapping(
            new Keyboard.KeyStroke(Keyboard.KeyCode.R, Platform.getCommandModifier().getMask()),
            "reloadGUI"));

        downloadsTable.setTableData(downloadTracks);
        downloadsTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        downloadsTable.getComponentKeyListeners().add(new TableSelectAllKeyListener());
        downloadsTable.getComponentMouseButtonListeners().add(new ComponentMouseButtonListener.Adapter() {
            @Override
            public boolean mouseClick(Component component, Mouse.Button button, int x, int y, int count) {
                int col = downloadsTable.getColumnAt(x);
                int row = downloadsTable.getRowAt(y);
                if (col == 4 && row >= 0) {
                    Track track = (Track) downloadsTable.getTableData().get(row);
                    if (track.getStatus() == Track.Status.ERROR) {
                        showError("Download error", track.getFault());
                    }
                    return true;
                }
                return false;
            }
        });
        TooltipTableMouseListener.install(downloadsTable);
        WtkUtil.setupColumnWidthSaver(downloadsTable, "downloadsTable");

        playerTable.getColumns().get(0).setCellRenderer(new PlaylistCellRenderer(Services.getPlayService()));
        playerTable.setTableData(Services.getPlayService().getPlaylist());
        playerTable.getComponentKeyListeners().add(new TableSelectAllKeyListener());
        playerTable.getComponentMouseButtonListeners().add(new ComponentMouseButtonListener.Adapter() {
            @Override
            public boolean mouseClick(Component component, Mouse.Button button, int x, int y, int count) {
                if (count > 1) {
                    int row = playerTable.getRowAt(y);
                    if (row >= 0) {
                        Services.getPlayService().setCurrentTrackIndex(row);
                    }
                }
                return false;
            }
        });
        TooltipTableMouseListener.install(playerTable);
        WtkUtil.setupColumnWidthSaver(playerTable, "playerTable");

        final SuggestionPopupTextInputContentListener suggestionPopupTextInputContentListener = new SuggestionPopupTextInputContentListener(
            new SuggestionsProvider<String>() {
                @Override
                public List<String> getSuggestions(String query) throws Exception {
                    if (query.length() > 3) {
                        return new ListAdapter<String>(Services.getSearchService().getAutocomplete(query));
                    } else {
                        return null;
                    }
                }

                @Override
                public void accepted(String text) {
                    doSearch();
                }

                @Override
                public void executeGetSuggestionsFailed(String query, Exception exception) {
                    log.error(format("could not autocomplete '%s': %s", query, toErrorString(exception, "; reason: ")));
                }
            });
        searchField.getTextInputContentListeners().add(suggestionPopupTextInputContentListener);
        searchField.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override
            public boolean keyTyped(Component searchField, char character) {
                if (character == Keyboard.KeyCode.ENTER) {
                    if (suggestionPopupTextInputContentListener.getSuggestionPopup() != null) {
                        suggestionPopupTextInputContentListener.getSuggestionPopup().close();
                    }
                    doSearch();
                }
                return false;  //do not consume this event
            }
        });
        searchButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override
            public void buttonPressed(Button button) {
                doSearch();
            }
        });
        clipboardButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override
            public void buttonPressed(Button button) {
                if (button.isSelected())
                    startWatchingClipboard();
                else
                    stopWatchingClipboard();
            }
        });

        final Action tabCloseAction = new Action() {
            @Override
            public void perform(Component source) {
                tabPane.getTabs().remove(tabPane.getSelectedTab());
            }
        };
        tabCloseAction.setEnabled(false);
        final Action tabCloseAllAction = new Action() {
            @Override
            public void perform(Component source) {
                TabPane.TabSequence tabs = tabPane.getTabs();
                for (int i = tabs.getLength() - 1; i >= 0; i--) {
                    tabPane.getTabs().remove(tabs.get(i));
                }
            }
        };
        tabCloseAllAction.setEnabled(false);

        tabPane.setMenuHandler(new MenuHandler.Adapter() {
            @Override
            public boolean configureContextMenu(Component component, Menu menu, int x, int y) {
                if (tabPane.getTabs().getLength() > 0) {
                    Menu.Item closeCurrentTab = new Menu.Item("Close Tab");
                    closeCurrentTab.setAction(tabCloseAction);
                    Menu.Item closeAllTabs = new Menu.Item("Close All Tabs");
                    closeAllTabs.setAction(tabCloseAllAction);
                    Menu.Section menuSection = new Menu.Section();
                    menuSection.add(closeCurrentTab);
                    menuSection.add(closeAllTabs);
                    menu.getSections().add(menuSection);
                }
                return false;
            }
        });
        tabPane.getTabPaneListeners().add(new TabPaneListener.Adapter() {
            @Override
            public void tabInserted(TabPane tabPane, int index) {
                int numTabs = tabPane.getTabs().getLength();
                tabCloseAction.setEnabled(numTabs > 0);
                tabCloseAllAction.setEnabled(numTabs > 0);
            }

            @Override
            public void tabsRemoved(TabPane tabPane, int index, Sequence<Component> tabs) {
                int numTabs = tabPane.getTabs().getLength();
                tabPane.setSelectedIndex(min(max(0, index), numTabs - 1));
                tabCloseAction.setEnabled(numTabs > 0);
                tabCloseAllAction.setEnabled(numTabs > 0);
            }
        });

        mainSplitPane.getSplitPaneListeners().add(new SplitPaneListener.Adapter() {
            @Override public void splitRatioChanged(SplitPane splitPane, float previousSplitRatio) {
                if (!SplitRatioTransition.isTransitionRunning(splitPane)) {
                    Preferences splitPanePrefs = Preferences.userNodeForPackage(Main.class).node("mainSplitPane");
                    splitPanePrefs.putFloat("splitRatio", splitPane.getSplitRatio());
                }
            }
        });
    }

    public boolean shutdown(boolean optional) throws Exception {
        Services.getDownloadService().shutdown();
        this.display = null;
        return false;
    }

    public void suspend() throws Exception {
    }

    public void resume() throws Exception {
    }

    public void download(Song song) {
        showLowerSplitPane();
        lowerPane.setSelectedIndex(0);
        Track track = Services.getDownloadService().download(song);
        List.ItemIterator<Track> it = downloadTracks.iterator();
        //noinspection WhileLoopReplaceableByForEach
        while (it.hasNext()) {
            Track existingTrack = it.next();
            if (track.getStore().isSameLocation(existingTrack.getStore())) {
                it.update(track);
                return;
            }
        }
        downloadTracks.add(track);
    }

    public void play(Sequence<Song> songs, PlayService.AddMode addMode) {
        showLowerSplitPane();
        lowerPane.setSelectedIndex(1);
        Services.getPlayService().add(songs, addMode);
    }

    // show download/playlist pane if currently collapsed
    private void showLowerSplitPane() {
        final float initialSplitRatio = 0.5f;
        if (mainSplitPane.getSplitRatio() >= 0.95f) {
            final Preferences splitPanePrefs = Preferences.userNodeForPackage(Main.class).node("mainSplitPane");
            float savedSplitRatio = splitPanePrefs.getFloat("splitRatio", initialSplitRatio);
            boolean transitionShownAtLeastOnce = splitPanePrefs.getBoolean("transitionShownAtLeastOnce", false);
            if (savedSplitRatio < 0.95f || !transitionShownAtLeastOnce) {
                splitPanePrefs.putBoolean("transitionShownAtLeastOnce", true);
                if (!transitionShownAtLeastOnce && savedSplitRatio >= 0.95f) savedSplitRatio = initialSplitRatio;
                SplitRatioTransition transition = new SplitRatioTransition(mainSplitPane, savedSplitRatio, 600, 100);
                transition.start();
            }
        }
    }

    public void showError(String message, Exception ex) {
        log.error(message, ex);
        TextArea errorText = new TextArea();
        errorText.setEditable(false);
        errorText.getStyles().put("wrapText", true);
        errorText.setText(toErrorString(ex, "\nReason: "));
        ScrollPane scrollPane = new ScrollPane(FILL, AUTO);
        scrollPane.setPreferredHeight(300);
        scrollPane.setMaximumHeight(300);
        scrollPane.setView(errorText);
        scrollPane.getStyles().put("backgroundColor", "#2b2b2b");
        Prompt.prompt(MessageType.ERROR, message, scrollPane, window);
    }

    public void doSearch() {
        String searchString = searchField.getText().trim();
        if (!searchString.isEmpty()) {
            openSearchTab(new GeneralSearch(searchString));
        }
    }

    public void openSearchTab(final SearchParameter searchParameter) {
        int idx = findSearchResultPane(searchParameter);
        if (idx < 0) {
            final SearchResultPane searchResultPane = createSearchResultPane();
            if (searchResultPane != null) {
                searchResultPane.setSearchParameter(searchParameter);
                idx = tabPane.getTabs().add(searchResultPane);
                TabPane.setTabData(searchResultPane, searchResultPane.getShortLabel());
                tabPane.setSelectedIndex(idx);
                if (tabPane.getTabs().getLength() > 1)
                    searchResultPane.startSearch();
                else {
                    // workaround for GUI glitch: if this is the first tab that has been added,
                    // paint the activity indicator only after 600ms, otherwise a strange redraw
                    // error will occur
                    ApplicationContext.scheduleCallback(new Runnable() {
                        @Override
                        public void run() {
                            searchResultPane.startSearch();
                        }
                    }, 600);
                }
            }
            searchField.requestFocus();
        } else {
            tabPane.setSelectedIndex(idx);
        }
        display.getHostWindow().toFront();
    }

    private int findSearchResultPane(SearchParameter searchParameter) {
        for (int i = 0; i < tabPane.getTabs().getLength(); i++) {
            SearchResultPane searchResultPane = (SearchResultPane) tabPane.getTabs().get(i);
            if (searchResultPane.getSearchParameter().equals(searchParameter))
                return i;
        }
        return -1;
    }

    private SearchResultPane createSearchResultPane() {
        try {
            BXMLSerializer serializer = new BXMLSerializer();
            serializer.getNamespace().put("main", this);
            return (SearchResultPane) serializer.readObject(getClass().getResource("searchresultpane.bxml"), resources);
        } catch (Exception ex) {
            log.error("error loading searchresultpane.bxml", ex);
            Alert.alert(MessageType.ERROR, "error loading searchresultpane.bxml\n" + ex, window);
        }
        return null;
    }

    private String getVersionNumberAndDate() {
        Properties properties = loadProperties("version.properties");
        String buildNumber = properties.getProperty("build.number", "");
        String buildType = properties.getProperty("build.type", "");
        properties = loadProperties("build.properties");
        String buildDate = properties.getProperty("build.date", "");
        String versionNumberAndDate = "";
        if (!buildNumber.isEmpty()) {
            versionNumberAndDate += "r" + buildNumber;
            if (!buildType.isEmpty())
                versionNumberAndDate += "-" + buildType;
        }
        if (!buildDate.isEmpty())
            versionNumberAndDate += " (built on " + buildDate + ")";
        return versionNumberAndDate;
    }

    private Properties loadProperties(String resourceName) {
        Properties properties = new Properties();
        InputStream is = getClass().getResourceAsStream(resourceName);
        if (is != null) {
            try {
                properties.load(is);
            } catch (IOException ignore) {
                // intentionally ignored
            } finally {
                try {
                    is.close();
                } catch (IOException ignore) {
                }
            }
        }
        return properties;
    }

    private void startWatchingClipboard() {
        stopWatchingClipboard();
        watchClipboardTask = new WatchClipboardTask();
        watchClipboardTask.addClipboardListener(new GroovesharkArtistClipboardListener(this));
        watchClipboardTask.addClipboardListener(new GroovesharkAlbumClipboardListener(this));
        watchClipboardTask.addClipboardListener(new GroovesharkPlaylistClipboardListener(this));
        watchClipboardTask.addClipboardListener(new GroovesharkUserClipboardListener(this));
        watchClipboardTask.start();
    }

    private void stopWatchingClipboard() {
        if (watchClipboardTask != null)
            watchClipboardTask.interrupt();
        watchClipboardTask = null;
    }

    private static Image getIcon(String iconResource) {
        if (iconResource == null) {
            throw new IllegalArgumentException("iconResource is null");
        }
        URL iconURL = Main.class.getResource(iconResource);
        if (iconURL == null) {
            throw new IllegalArgumentException("iconResource not found: " + iconResource);
        }
        Image icon = (Image) ApplicationContext.getResourceCache().get(iconURL);
        if (icon == null) {
            try {
                icon = Image.load(iconURL);
            } catch (TaskExecutionException ex) {
                throw new IllegalArgumentException(ex);
            }
            ApplicationContext.getResourceCache().put(iconURL, icon);
        }
        return icon;
    }


    private class ShowSettingsAction extends Action {
        public void perform(Component source) {
            new SettingsDialog(window, resources).show(settings, new SheetCloseListener() {
                public void sheetClosed(Sheet sheet) {
                    if (sheet.getResult()) {
                        applySettings();
                        saveSettings();
                    }
                }
            });
        }

    }


    private class ReloadGUIAction extends Action {
        public void perform(Component source) {
            log.error("reload GUI");
            try {
                Window newWindow = createWindow();
                display.remove(window);
                window = newWindow;
                initComponents();
                display.add(window);
            } catch (Exception ex) {
                log.error("error loading main.bxml", ex);
                if (window != null)
                    Alert.alert(MessageType.ERROR, "error loading main.bxml\n" + ex, window);
                else
                    System.exit(1);
            }
        }
    }


    private class RemoveDownloadsAction extends Action {
        private final boolean selectedOnly;
        private final boolean successfulOnly;
        private final boolean removeFromDisc;

        private RemoveDownloadsAction(boolean selectedOnly, boolean successfulOnly, boolean removeFromDisc) {
            this.selectedOnly = selectedOnly;
            this.successfulOnly = successfulOnly;
            this.removeFromDisc = removeFromDisc;
        }

        @Override @SuppressWarnings("unchecked")
        public void perform(Component source) {
            Sequence<Track> selectedTracks = selectedOnly ? (Sequence<Track>) downloadsTable.getSelectedRows() : new ArrayList<Track>();
            List.ItemIterator<Track> it = downloadTracks.iterator();
            while (it.hasNext()) {
                Track track = it.next();
                if ((selectedOnly && selectedTracks.indexOf(track) != -1)
                    || (!selectedOnly && successfulOnly && track.getStatus().isSuccessful())
                    || (!selectedOnly && !successfulOnly && track.getStatus().isFinished())) {
                    Services.getDownloadService().cancelDownload(track, removeFromDisc);
                    it.remove();
                    selectedTracks.remove(track);
                }
            }
        }
    }


    private class SongPlayPauseAction extends Action {
        @Override public void perform(Component source) {
            if (Services.getPlayService().isPaused())
                Services.getPlayService().resume();
            else if (Services.getPlayService().isPlaying())
                Services.getPlayService().pause();
            else
                Services.getPlayService().play();
        }
    }


    private class SongNextAction extends Action {
        @Override public void perform(Component source) {
            Services.getPlayService().skipForward();
        }
    }


    private class SongPreviousAction extends Action {
        @Override public void perform(Component source) {
            Services.getPlayService().skipBackward();
        }
    }


    private class SongClearPlaylistAction extends Action {
        @Override public void perform(Component source) {
            Services.getPlayService().clearPlaylist();
            resetPlayInfo();
            updatePlayPauseButton(false);
        }
    }


    private class ToggleRadioAction extends Action {
        @Override public void perform(Component source) {
            Services.getPlayService().setRadio(radioButton.isSelected());
            String buttonText = radioButton.isSelected() ? "RADIO ON" : "RADIO OFF";
            int colorThemeIndex = radioButton.isSelected() ? 16 : 10;
            ((ButtonData) radioButton.getButtonData()).setText(buttonText);
            radioButton.getStyles().put("backgroundColor", ((TerraTheme) Theme.getTheme()).getColor(colorThemeIndex));
            radioButton.repaint();
        }
    }

    private class DownloadTracksListListener extends ListListener.Adapter<Track> {
        private Timer timer;

        @Override
        public void itemInserted(List<Track> trackList, int index) {
            startTimer();
        }

        @Override
        public void itemsRemoved(List<Track> trackList, int index, Sequence<Track> items) {
            if (trackList.getLength() == 0) {
                stopTimer();
            }
        }

        @Override
        public void listCleared(List<Track> trackList) {
            stopTimer();
        }

        private synchronized void stopTimer() {
            if (timer != null) {
                timer.cancel();
                timer = null;
            }
        }

        private synchronized void startTimer() {
            if (timer == null) {
                timer = new Timer("downloadTable repainter", true);
                timer.scheduleAtFixedRate(new TimerTask() {
                    @Override
                    public void run() {
                        if (downloadsTable != null) {
                            downloadsTable.repaint();
                        }
                    }
                }, 0, 500);
            }
        }
    }

    private class PlaylistListListener extends ListListener.Adapter<Song> {
        @Override
        public void itemInserted(List<Song> list, int index) {
            updateToggleRadioAction(list);
        }

        @Override
        public void itemsRemoved(List<Song> list, int index, Sequence<Song> items) {
            updateToggleRadioAction(list);
        }

        @Override
        public void listCleared(List<Song> list) {
            updateToggleRadioAction(list);
        }

        private void updateToggleRadioAction(List<Song> list) {
            Action.getNamedActions().get("toggleRadio").setEnabled(!list.isEmpty());
        }
    }

    private void updatePlayInfo(Track track, String nowPlayingText) {
        nowPlayingLabel.setVisible(true);
        nowPlayingLabel.setText(nowPlayingText);
        nowPlayingArtist.setVisible(true);
        nowPlayingArtist.setText(track.getArtistName());
        nowPlayingSongname.setVisible(true);
        nowPlayingSongname.setText(track.getSongName());
        if (!isEmpty(track.getAlbumName())) {
            nowPlayingFromTheAlbum.setVisible(true);
            nowPlayingAlbum.setVisible(true);
            nowPlayingAlbum.setText("«" + track.getAlbumName() + "»");
        } else {
            nowPlayingFromTheAlbum.setVisible(false);
            nowPlayingAlbum.setVisible(false);
            nowPlayingAlbum.setText("");
        }
        nowPlayingImage.setVisible(true);
        nowPlayingImage.setImage(imageLoader.getImage(track.getSong(), nowPlayingImage));
        nowPlayingSeparator.setVisible(true);
        playDownloadProgress.setVisible(true);
        playProgress.setVisible(true);
    }

    private void resetPlayInfo() {
        nowPlayingLabel.setVisible(false);
        nowPlayingLabel.setText("");
        nowPlayingArtist.setVisible(false);
        nowPlayingArtist.setText("");
        nowPlayingSongname.setVisible(false);
        nowPlayingSongname.setText("");
        nowPlayingFromTheAlbum.setVisible(false);
        nowPlayingAlbum.setVisible(false);
        nowPlayingAlbum.setText("");
        nowPlayingImage.setVisible(false);
        nowPlayingImage.setImage((Image) null);
        nowPlayingSeparator.setVisible(false);
        playDownloadProgress.setVisible(false);
        playDownloadProgress.setPercentage(0.0);
        playProgress.setVisible(false);
        playProgress.setPercentage(0.0);
        playProgress.setText("");
    }

    private void updatePlayPauseButton(boolean isPlaying) {
        String iconResourceName = isPlaying ? "player_pause.png" : "player_play.png";
        ((ButtonData) songPlayPauseButton.getButtonData()).setIcon(getClass().getResource("images/" + iconResourceName));
        songPlayPauseButton.repaint();
    }

    private void updatePlayProgress(Track track, int audioPosition) {
        audioPosition = max(audioPosition, 0);
        Double estimateDuration = track.getSong().getEstimateDuration();
        if (estimateDuration != null && estimateDuration > 0.0) {
            double percentage = (double) audioPosition / (estimateDuration * 1000L);
            playProgress.setPercentage(min(max(percentage, 0.0), 1.0));
            playProgress.setText(format("%s / %s", durationToString(audioPosition / 1000.0), durationToString(estimateDuration)));
        } else {
            playProgress.setText(durationToString(audioPosition / 1000.0));
        }
    }


    private class PlaylistListener implements PlayServiceListener {
        @Override public void playbackStarted(final Track track) {
            ApplicationContext.queueCallback(new Runnable() {
                public void run() {
                    updatePlayInfo(track, "Now playing");
                    updatePlayPauseButton(true);
                    playerTable.repaint();
                }
            });
        }

        @Override public void playbackPaused(final Track track, final int audioPosition) {
            ApplicationContext.queueCallback(new Runnable() {
                public void run() {
                    updatePlayInfo(track, "Paused");
                    updatePlayPauseButton(false);
                    playerTable.repaint();
                }
            });
        }

        @Override public void playbackFinished(final Track track, final int audioPosition) {
            ApplicationContext.queueCallback(new Runnable() {
                public void run() {
                    if (track.getStatus() == Track.Status.ERROR) {
                        updatePlayInfo(track, "ERROR");
                    } else {
                        resetPlayInfo();
                    }
                    updatePlayPauseButton(false);
                    playerTable.repaint();
                }
            });
        }

        @Override public void positionChanged(final Track track, final int audioPosition) {
            ApplicationContext.queueCallback(new Runnable() {
                public void run() {
                    updatePlayProgress(track, audioPosition);
                }
            });
        }

        @Override public void statusChanged(final Track track) {
            ApplicationContext.queueCallback(new Runnable() {
                public void run() {
                    if (track.getStatus() == Track.Status.ERROR) {
                        resetPlayInfo();
                        Services.getPlayService().stop();
                    } else {
                        updatePlayInfo(track, "Now playing");
                    }
                    playerTable.repaint();
                }
            });
        }

        @Override public void downloadedBytesChanged(final Track track) {
            ApplicationContext.queueCallback(new Runnable() {
                public void run() {
                    playDownloadProgress.setPercentage(track.getProgress());
                }
            });
        }

        @Override public void exception(final Track track, final Exception ex) {
            ApplicationContext.queueCallback(new Runnable() {
                public void run() {
                    showError("Error playing track " + track, ex);
                }
            });
        }
    }
}
