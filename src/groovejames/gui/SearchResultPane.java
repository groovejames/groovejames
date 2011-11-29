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
                try {
                    BXMLSerializer bxmlSerializer = new BXMLSerializer();
                    bxmlSerializer.getNamespace().put("main", main);
                    LazyLoadingCardPane lazyLoadingCardPane = (LazyLoadingCardPane) bxmlSerializer.readObject(getClass().getResource("lazyloadingcardpane.bxml"), resources);
                    lazyLoadingCardPane.setContentResource("songtablepane.bxml");
                    tabPane.getTabs().add(lazyLoadingCardPane);
                    TabPane.setTabData(lazyLoadingCardPane, new ButtonData("Songs"));

                    bxmlSerializer = new BXMLSerializer();
                    bxmlSerializer.getNamespace().put("main", main);
                    lazyLoadingCardPane = (LazyLoadingCardPane) bxmlSerializer.readObject(getClass().getResource("lazyloadingcardpane.bxml"), resources);
                    lazyLoadingCardPane.setContentResource("artisttablepane.bxml");
                    tabPane.getTabs().add(lazyLoadingCardPane);
                    TabPane.setTabData(lazyLoadingCardPane, new ButtonData("Artists"));

                    bxmlSerializer = new BXMLSerializer();
                    bxmlSerializer.getNamespace().put("main", main);
                    lazyLoadingCardPane = (LazyLoadingCardPane) bxmlSerializer.readObject(getClass().getResource("lazyloadingcardpane.bxml"), resources);
                    lazyLoadingCardPane.setContentResource("albumtablepane.bxml");
                    tabPane.getTabs().add(lazyLoadingCardPane);
                    TabPane.setTabData(lazyLoadingCardPane, new ButtonData("Albums"));

                    bxmlSerializer = new BXMLSerializer();
                    bxmlSerializer.getNamespace().put("main", main);
                    lazyLoadingCardPane = (LazyLoadingCardPane) bxmlSerializer.readObject(getClass().getResource("lazyloadingcardpane.bxml"), resources);
                    lazyLoadingCardPane.setContentResource("peopletablepane.bxml");
                    tabPane.getTabs().add(lazyLoadingCardPane);
                    TabPane.setTabData(lazyLoadingCardPane, new ButtonData("People"));
                } catch (IOException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                } catch (SerializationException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
                break;
            case Artist:
                try {
                    BXMLSerializer bxmlSerializer = new BXMLSerializer();
                    bxmlSerializer.getNamespace().put("main", main);
                    LazyLoadingCardPane lazyLoadingCardPane = (LazyLoadingCardPane) bxmlSerializer.readObject(getClass().getResource("lazyloadingcardpane.bxml"), resources);
                    lazyLoadingCardPane.setContentResource("songtablepane.bxml");
                    tabPane.getTabs().add(lazyLoadingCardPane);
                    TabPane.setTabData(lazyLoadingCardPane, new ButtonData("Songs"));
                } catch (IOException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                } catch (SerializationException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
                break;
            case Album:
                try {
                    BXMLSerializer bxmlSerializer = new BXMLSerializer();
                    bxmlSerializer.getNamespace().put("main", main);
                    LazyLoadingCardPane lazyLoadingCardPane = (LazyLoadingCardPane) bxmlSerializer.readObject(getClass().getResource("lazyloadingcardpane.bxml"), resources);
                    lazyLoadingCardPane.setContentResource("songtablepane.bxml");
                    tabPane.getTabs().add(lazyLoadingCardPane);
                    TabPane.setTabData(lazyLoadingCardPane, new ButtonData("Songs"));
                } catch (IOException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                } catch (SerializationException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
                break;
            case User:
                try {
                    BXMLSerializer bxmlSerializer = new BXMLSerializer();
                    bxmlSerializer.getNamespace().put("main", main);
                    LazyLoadingCardPane lazyLoadingCardPane = (LazyLoadingCardPane) bxmlSerializer.readObject(getClass().getResource("lazyloadingcardpane.bxml"), resources);
                    lazyLoadingCardPane.setContentResource("songtablepane.bxml");
                    tabPane.getTabs().add(lazyLoadingCardPane);
                    TabPane.setTabData(lazyLoadingCardPane, new ButtonData("Library"));
                } catch (IOException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                } catch (SerializationException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
                break;
            default:
                throw new IllegalStateException("illegal branch: " + searchParameter.getSearchType());
        }
        tabPane.setSelectedIndex(0);
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
                selectedCardPane.load(searchParameter);
            } catch (SerializationException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            } catch (IOException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }
    }
}
