package groovejames.service.search;

public interface SearchParameter extends Cloneable {

    int DEFAULT_SEARCH_LIMIT = 20;

    /**
     * the search type.
     */
    SearchType getSearchType();

    /**
     * used for longer display in a title above the search result area
     */
    String getLabel();

    /**
     * used for tab titles
     */
    String getShortLabel();

    /**
     * used for error messages, in case an error occured during this search
     */
    String getDescription();

    int getOffset();

    void setOffset(int offset);

    int getLimit();

    void setLimit(int limit);

    /**
     * used for comparision of tab contents: two search tabs are considered equal
     * if comparing their search parameters using this method returns true.
     */
    boolean equals(SearchParameter o);

    /**
     * contract for {@code equals}
     */
    int hashCode();

    SearchParameter clone();

}

