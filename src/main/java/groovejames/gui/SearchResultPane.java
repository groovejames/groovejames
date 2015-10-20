package groovejames.gui;

import groovejames.service.search.SearchParameter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.BXMLSerializer;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.Map;
import org.apache.pivot.serialization.SerializationException;
import org.apache.pivot.util.Resources;
import org.apache.pivot.wtk.Label;
import org.apache.pivot.wtk.TabPane;
import org.apache.pivot.wtk.TabPaneSelectionListener;
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.content.ButtonData;

import java.io.IOException;
import java.net.URL;

@SuppressWarnings({"UnusedDeclaration"})
public class SearchResultPane extends TablePane implements Bindable {

    private static final Log log = LogFactory.getLog(SearchResultPane.class);

    @BXML private TabPane tabPane;
    @BXML private Label searchLabel;

    private Main main;
    private SearchParameter searchParameter;
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
    }

    public SearchParameter getSearchParameter() {
        return searchParameter;
    }

    public void setSearchParameter(SearchParameter searchParameter) {
        this.searchParameter = searchParameter;
        this.searchLabel.setText(getLabel());
        switch (searchParameter.getSearchType()) {
            case General:
                addTab("artisttablepane.bxml", "Artists");
                addTab("songtablepane.bxml", "Songs");
                addTab("albumtablepane.bxml", "Albums");
                addTab("playlisttablepane.bxml", "Playlists");
                addTab("peopletablepane.bxml", "Users");
                break;
            case Artist:
                addTab("albumtablepane.bxml", "Albums");
                addTab("songtablepane.bxml", "Songs");
                break;
            case Album:
                addTab("songtablepane.bxml", "Songs");
                break;
            case User:
                addTab("songtablepane.bxml", "Library");
                addTab("playlisttablepane.bxml", "Playlists");
                break;
            case Playlist:
                addTab("songtablepane.bxml", "Songs");
                break;
            case Songs:
                addTab("songtablepane.bxml", "Songs");
                break;
            default:
                throw new IllegalStateException("illegal branch: " + searchParameter.getSearchType());
        }
        tabPane.setSelectedIndex(0);
    }

    private void addTab(String contentResource, String tabTitle) {
        try {
            LazyLoadingCardPane lazyLoadingCardPane = createNewLazyLoadingCardPane();
            lazyLoadingCardPane.setContentResource(contentResource);
            tabPane.getTabs().add(lazyLoadingCardPane);
            TabPane.setTabData(lazyLoadingCardPane, new ButtonData(tabTitle));
        } catch (Exception ex) {
            main.showError("could not add tab " + tabTitle + " using " + contentResource, ex);
        }
    }

    private LazyLoadingCardPane createNewLazyLoadingCardPane() throws SerializationException, IOException {
        BXMLSerializer bxmlSerializer = new BXMLSerializer();
        bxmlSerializer.getNamespace().put("main", main);
        return (LazyLoadingCardPane) bxmlSerializer.readObject(getClass().getResource("lazyloadingcardpane.bxml"), resources);
    }

    public String getLabel() {
        return searchParameter.getLabel();
    }

    public String getShortLabel() {
        String shortLabel = searchParameter.getShortLabel();
        return shortLabel.length() > 20 ? shortLabel.substring(0, 20) + "..." : shortLabel;
    }

    public void startSearch() {
        LazyLoadingCardPane selectedCardPane = (LazyLoadingCardPane) tabPane.getSelectedTab();
        if (selectedCardPane != null) {
            try {
                selectedCardPane.load(searchParameter.clone());
            } catch (Exception ex) {
                main.showError("could not open " + searchParameter.getShortLabel(), ex);
            }
        }
    }
}
