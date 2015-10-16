package groovejames.gui;

import groovejames.model.BaseModelObject;
import groovejames.model.SearchResult;
import groovejames.service.search.SearchParameter;
import groovejames.service.search.SearchType;

public interface CardPaneContent<V extends BaseModelObject> {

    void setSearchParameter(SearchParameter searchParameter);

    void setCardPane(CardPaneWrapper cardPane);

    void afterLoad();

    GuiAsyncTask<SearchResult<V>> createSearchTask();

}
