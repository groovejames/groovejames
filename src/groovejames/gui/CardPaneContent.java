package groovejames.gui;

import groovejames.service.search.SearchParameter;

public interface CardPaneContent<V> {

    GuiAsyncTask<V[]> getSearchTask(SearchParameter searchParameter);

    void afterLoad(SearchParameter searchParameter);
}
