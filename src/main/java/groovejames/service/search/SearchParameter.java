package groovejames.service.search;

public interface SearchParameter {

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

    /**
     * used for comparision of tab contents: two search tabs are considered equal
     * if comparing their search parameters using this method returns true.
     */
    boolean equals(SearchParameter o);

    /**
     * contract for {@code equals}
     */
    int hashCode();

}

