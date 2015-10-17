package groovejames.gui;

import groovejames.model.BaseModelObject;
import groovejames.model.SearchResult;
import groovejames.service.search.SearchParameter;

public interface CardPaneContent<T extends BaseModelObject> {

    void setSearchParameter(SearchParameter searchParameter);

    void setCardPane(CardPaneWrapper cardPane);

    /** executed on EDT */
    void afterLoad();

    /** only used for error reporting */
    String getSearchDescription();

    /** executed on EDT */
    void beforeSearch();

    /** executed asynchronously */
    SearchResult<T> search() throws Exception;

    /** executed on EDT */
    void afterSearch(SearchResult<T> searchResult);

}
