package groovejames.gui;

import groovejames.service.search.SearchParameter;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.BXMLSerializer;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.Map;
import org.apache.pivot.serialization.SerializationException;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.Vote;
import org.apache.pivot.util.concurrent.Task;
import org.apache.pivot.util.concurrent.TaskListener;
import org.apache.pivot.wtk.ActivityIndicator;
import org.apache.pivot.wtk.CardPane;
import org.apache.pivot.wtk.CardPaneListener;
import org.apache.pivot.wtk.Component;

import java.io.IOException;
import java.net.URL;

public class LazyLoadingCardPane extends CardPane implements Bindable, CardPaneWrapper {

    private boolean loaded = false;
    private String contentResource;
    private Main main;
    private Resources resources;

    @BXML private ActivityIndicator activityIndicator;

    public LazyLoadingCardPane() {
    }

    public void setContentResource(String contentResource) {
        this.contentResource = contentResource;
    }

    @Override
    public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");
        this.resources = resources;
    }

    public void load(SearchParameter searchParameter) throws SerializationException, IOException {
        if (!loaded) {
            loaded = true;

            // show activity pane on the tab
            activityIndicator.setActive(true);
            setSelectedIndex(0);

            BXMLSerializer serializer = new BXMLSerializer();
            serializer.getNamespace().put("main", main);
            Component component = (Component) serializer.readObject(getClass().getResource(contentResource), resources);
            add(component);

            CardPaneContent content = (CardPaneContent) component;
            content.setSearchParameter(searchParameter);
            content.setCardPane(this);
            content.afterLoad();

            search(content);
        }
    }

    @Override
    public void search(CardPaneContent content) {
        GuiAsyncTask<?> searchTask = content.createSearchTask();
        GuiAsyncTaskListener asyncTaskListener = new GuiAsyncTaskListener();
        getCardPaneListeners().add(asyncTaskListener);
        searchTask.execute(asyncTaskListener);
    }

    private class GuiAsyncTaskListener<V> implements TaskListener<V>, CardPaneListener {
        private volatile boolean taskExecuted;

        @Override
        public void taskExecuted(Task<V> task) {
            taskExecuted = true;
            hideActivityPane();
        }

        @Override
        public void executeFailed(Task<V> task) {
            taskExecuted = true;
            Throwable ex = task.getFault();
            hideActivityPane();
            main.showError("Error: " + ((GuiAsyncTask) task).getDescription(), ex);
        }

        private void hideActivityPane() {
            setSelectedIndex(1);
            activityIndicator.setActive(false);
            getCardPaneListeners().remove(this);
        }

        @Override
        public Vote previewSelectedIndexChange(CardPane cardPane, int selectedIndex) {
            return Vote.APPROVE;
        }

        @Override
        public void selectedIndexChangeVetoed(CardPane cardPane, Vote reason) {
        }

        @Override
        public void selectedIndexChanged(CardPane cardPane, int previousSelectedIndex) {
            if (cardPane.getSelectedIndex() == 0 && taskExecuted) {
                hideActivityPane();
            }
        }
    }
}
