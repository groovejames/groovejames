package groovejames.gui;

import groovejames.model.User;
import groovejames.service.search.SearchParameter;
import org.apache.pivot.wtk.TableView;

public interface CardPaneContent<V> {

    TableView getTableView();

    String getTableKey();

    GuiAsyncTask<V[]> getSearchTask(SearchParameter searchParameter);

}
