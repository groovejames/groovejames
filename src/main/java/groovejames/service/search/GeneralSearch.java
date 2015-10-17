package groovejames.service.search;

public class GeneralSearch extends AbstractSearchParameter {

    private final String generalSearchString;

    public GeneralSearch(String generalSearchString) {
        this.generalSearchString = generalSearchString;
    }

    public String getGeneralSearchString() {
        return generalSearchString;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.General;
    }

    @Override
    public String getLabel() {
        return "Search: \"" + generalSearchString + "\"";
    }

    @Override
    public String getShortLabel() {
        return "Search: " + generalSearchString;
    }

    @Override
    public String getDescription() {
        return generalSearchString;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof GeneralSearch)) return false;
        GeneralSearch that = (GeneralSearch) o;
        return generalSearchString.equals(that.generalSearchString);
    }

    @Override
    public int hashCode() {
        return generalSearchString.hashCode();
    }
}
