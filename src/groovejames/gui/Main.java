package groovejames.gui;

import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.ImageGetter;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.gui.search.GeneralSearch;
import groovejames.gui.search.SearchParameter;
import groovejames.model.Settings;
import groovejames.model.Song;
import groovejames.model.Track;
import groovejames.service.DownloadService;
import groovejames.service.Grooveshark;
import groovejames.service.GroovesharkService;
import groovejames.service.HttpClientService;
import groovejames.service.ProxySettings;
import groovejames.util.ConsoleUtil;
import static groovejames.util.Util.isEmpty;
import static groovejames.util.Util.toErrorString;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpGet;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.BXMLSerializer;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.List;
import org.apache.pivot.collections.ListListener;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.serialization.SerializationException;
import org.apache.pivot.util.Resources;
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
import org.apache.pivot.wtk.Keyboard;
import org.apache.pivot.wtk.MessageType;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.Platform;
import org.apache.pivot.wtk.Prompt;
import org.apache.pivot.wtk.PushButton;
import org.apache.pivot.wtk.ScrollPane;
import static org.apache.pivot.wtk.ScrollPane.ScrollBarPolicy.AUTO;
import static org.apache.pivot.wtk.ScrollPane.ScrollBarPolicy.FILL;
import org.apache.pivot.wtk.Sheet;
import org.apache.pivot.wtk.SheetCloseListener;
import org.apache.pivot.wtk.SplitPane;
import org.apache.pivot.wtk.TabPane;
import org.apache.pivot.wtk.TabPaneListener;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextArea;
import org.apache.pivot.wtk.TextInput;
import org.apache.pivot.wtk.Window;
import org.apache.pivot.wtk.media.Image;
import org.apache.pivot.wtk.media.Picture;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import static java.lang.Math.max;
import static java.lang.Math.min;
import java.net.URI;
import java.util.Properties;
import java.util.Timer;
import java.util.TimerTask;
import java.util.prefs.Preferences;

@SuppressWarnings({"UnusedDeclaration"})
public class Main implements Application, ImageGetter {

    private static final Log log = LogFactory.getLog(Main.class);

    private Settings settings;
    private Resources resources;
    private Display display;
    private HttpClientService httpClientService;
    private DownloadService downloadService;
    private Grooveshark grooveshark;

    @BXML private Window window;
    @BXML private SplitPane mainSplitPane;
    @BXML private TabPane tabPane;
    @BXML private TextInput searchField;
    @BXML private PushButton searchButton;
    @BXML private TableView downloadsTable;

    public static void main(String[] args) {
        ConsoleUtil.redirectStdErrToCommonsLogging();
        ConsoleUtil.redirectStdOutToCommonsLogging();
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
        this.resources = new Resources("groovejames.gui.main");
        this.display = display;

        this.settings = loadSettings();
        this.httpClientService = new HttpClientService();
        this.downloadService = new DownloadService(httpClientService);
        this.downloadService.getTracks().getListListeners().add(new TrackListListener());

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
        settings.setProxyHost(prefs.get("proxyHost", settings.getProxyHost()));
        settings.setProxyPort(prefs.getInt("proxyPort", settings.getProxyPort()));
        return settings;
    }

    private void saveSettings() {
        Preferences prefs = Preferences.userNodeForPackage(Settings.class);
        prefs.put("proxyHost", settings.getProxyHost());
        prefs.putInt("proxyPort", settings.getProxyPort());
    }

    private void applySettings() {
        if (!isEmpty(settings.getProxyHost())) {
            httpClientService.setProxySettings(new ProxySettings(settings.getProxyHost(), settings.getProxyPort()));
        } else {
            httpClientService.setProxySettings(null);
        }
        grooveshark = null;
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
    }

    private Window createWindow() throws IOException, SerializationException {
        BXMLSerializer serializer = new BXMLSerializer();
        serializer.getNamespace().put("main", this);
        Window window = (Window) serializer.readObject(getClass().getResource("main.bxml"), resources);
        serializer.bind(this, Main.class);
        window.setTitle("GrooveJames " + getVersionNumber());
        return window;
    }

    private void initComponents() {
        window.setIcon(getClass().getResource("butler-48.png"));
        window.getActionMappings().add(new Window.ActionMapping(
                new Keyboard.KeyStroke(Keyboard.KeyCode.R, Platform.getCommandModifier().getMask()),
                "reloadGUI"));
        downloadsTable.setTableData(downloadService.getTracks());
        downloadsTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        downloadsTable.getComponentMouseListeners().add(new TooltipTableMouseListener());
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
        searchField.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override
            public boolean keyTyped(Component searchField, char character) {
                if (character == Keyboard.KeyCode.ENTER) {
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
        tabPane.getTabPaneListeners().add(new TabPaneListener.Adapter() {
            @Override public void tabsRemoved(TabPane tabPane, int index, Sequence<Component> tabs) {
                int numTabs = tabPane.getTabs().getLength();
                tabPane.setSelectedIndex(min(max(0, index), numTabs - 1));
            }
        });
    }

    public boolean shutdown(boolean optional) throws Exception {
        this.downloadService.shutdown();
        this.display = null;
        return false;
    }

    public void suspend() throws Exception {
    }

    public void resume() throws Exception {
    }

    public void download(Song song) {
        // show download pane if currently collapsed
        if (mainSplitPane.getSplitRatio() >= 0.95f) {
            float splitRatio = Preferences.userNodeForPackage(Main.class).node("mainSplitPane").getFloat("splitRatio", 0.5f);
            SplitRatioTransition transition = new SplitRatioTransition(mainSplitPane, splitRatio, 600, 50);
            transition.start();
        }
        downloadService.download(song, grooveshark);
    }

    public synchronized Grooveshark getGrooveshark() throws IOException {
        if (grooveshark == null)
            grooveshark = GroovesharkService.connect(httpClientService);
        return grooveshark;
    }

    public void showError(String message, Exception ex) {
        TextArea errorText = new TextArea();
        errorText.setEditable(false);
        errorText.getStyles().put("wrapText", true);
        errorText.setText(toErrorString(ex));
        ScrollPane scrollPane = new ScrollPane(FILL, AUTO);
        scrollPane.setPreferredHeight(300);
        scrollPane.setMaximumHeight(300);
        scrollPane.setView(errorText);
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
                searchResultPane.setMain(Main.this);
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

    public Image httpGetImage(URI uri) throws IOException {
        HttpResponse httpResponse = httpClientService.getHttpClient().execute(new HttpGet(uri));
        HttpEntity httpEntity = httpResponse.getEntity();
        try {
            StatusLine statusLine = httpResponse.getStatusLine();
            int statusCode = statusLine.getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                InputStream inputStream = httpEntity.getContent();
                BufferedImage image = ImageIO.read(inputStream);
                inputStream.close();
                return new Picture(image);
            } else {
                throw new IOException(String.format("error loading image: uri=%s, status=%s%n", uri, statusLine));
            }
        } finally {
            httpEntity.consumeContent();
        }
    }

    private int getVersionNumber() throws IOException {
        InputStream is = getClass().getResourceAsStream("version.properties");
        int versionNumber = 0;
        if (is != null) {
            Properties properties = new Properties();
            properties.load(is);
            versionNumber = Integer.parseInt(properties.getProperty("build.number", "0"));
            is.close();
        }
        return versionNumber;
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

        @Override
        public void perform(Component source) {
            for (Track track : getTracks()) {
                if (selectedOnly
                        || successfulOnly && track.getStatus().isSuccessful()
                        || !successfulOnly && track.getStatus().isFinished()) {
                    downloadService.cancelDownload(track, removeFromDisc);
                    downloadService.getTracks().remove(track);
                }
            }
        }

        @SuppressWarnings({"unchecked"})
        private ArrayList<Track> getTracks() {
            if (selectedOnly) {
                return new ArrayList<Track>((Sequence<Track>) downloadsTable.getSelectedRows());
            } else {
                return new ArrayList<Track>(downloadService.getTracks());
            }
        }
    }


    private class TrackListListener extends ListListener.Adapter<Track> {
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
                }, 0, 100);
            }
        }
    }
}
