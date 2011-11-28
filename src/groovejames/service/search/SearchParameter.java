package groovejames.service.search;

public interface SearchParameter {
    SearchType getSearchType();
    String getLabel();
    String getShortLabel();
    String getSimpleSearchString();
    boolean equals(SearchParameter o);
    int hashCode();
}

