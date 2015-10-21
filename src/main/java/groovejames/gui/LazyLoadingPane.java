package groovejames.gui;

import groovejames.model.BaseModelObject;
import groovejames.model.SearchResult;
import groovejames.service.search.SearchParameter;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.BXMLSerializer;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.Map;
import org.apache.pivot.serialization.SerializationException;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.concurrent.Task;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.util.concurrent.TaskListener;
import org.apache.pivot.wtk.ActivityIndicator;
import org.apache.pivot.wtk.ApplicationContext;
import org.apache.pivot.wtk.BoxPane;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.StackPane;

import java.io.IOException;
import java.net.URL;

public class LazyLoadingPane<T extends BaseModelObject> extends StackPane implements Bindable, CardPaneWrapper {

    private boolean loaded = false;
    private String contentResource;
    private Main main;
    private Resources resources;
    private CardPaneContent<T> content;
    private GuiAsyncTaskListener asyncTaskListener;

    @BXML private ActivityIndicator activityIndicator;
    @BXML private BoxPane boxPane;

    public LazyLoadingPane() {
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

            showActivityPane();

            BXMLSerializer serializer = new BXMLSerializer();
            serializer.getNamespace().put("main", main);
            Component component = (Component) serializer.readObject(getClass().getResource(contentResource), resources);
            insert(component, 0);

            asyncTaskListener = new GuiAsyncTaskListener();

            content = cast(component);
            content.setSearchParameter(searchParameter);
            content.setCardPane(this);
            content.afterLoad();

            search();
        }
    }

    @SuppressWarnings("unchecked")
    private CardPaneContent<T> cast(Component component) {
        return (CardPaneContent<T>) component;
    }

    @Override
    public void search() {
        showActivityPane();
        content.beforeSearch();
        createSearchTask().execute(asyncTaskListener);
    }

    private Task<SearchResult<T>> createSearchTask() {
        return new Task<SearchResult<T>>() {
            @Override
            public SearchResult<T> execute() throws TaskExecutionException {
                try {
                    return content.search();
                } catch (Exception ex) {
                    throw new TaskExecutionException(ex);
                }
            }
        };
    }

    private void showActivityPane() {
        activityIndicator.setActive(true);
        activityIndicator.setVisible(true);
        boxPane.setVisible(true);
    }

    private void hideActivityPane() {
        activityIndicator.setVisible(false);
        boxPane.setVisible(false);
        activityIndicator.setActive(false);
    }


    private class GuiAsyncTaskListener implements TaskListener<SearchResult<T>> {
        @Override
        public void taskExecuted(Task<SearchResult<T>> task) {
            final SearchResult<T> result = task.getResult();
            ApplicationContext.queueCallback(new Runnable() {
                @Override
                public void run() {
                    content.afterSearch(result);
                    hideActivityPane();
                }
            });
        }

        @Override
        public void executeFailed(Task<SearchResult<T>> task) {
            final Throwable ex = task.getFault();
            ApplicationContext.queueCallback(new Runnable() {
                @Override
                public void run() {
                    hideActivityPane();
                    main.showError("Error: " + content.getSearchDescription(), ex);
                }
            });
        }
    }
}
