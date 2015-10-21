package groovejames.service.search;

import java.util.ArrayList;
import java.util.List;

public class AutocompleteResult {

    private final List<SearchParameter> searchParameters = new ArrayList<>();

    public void add(SearchParameter searchParameter) {
        searchParameters.add(searchParameter);
    }
}
