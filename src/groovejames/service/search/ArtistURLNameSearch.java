package groovejames.service.search;

public class ArtistURLNameSearch implements SearchParameter {

    private final String artistURLName;
    private final String artistBeautifiedName;

    public ArtistURLNameSearch(String artistURLName) {
        this.artistURLName = artistURLName;
        this.artistBeautifiedName = beautify(artistURLName);
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.Artist;
    }

    @Override
    public String getLabel() {
        return "Artist: " + artistBeautifiedName;
    }

    @Override
    public String getShortLabel() {
        return getLabel();
    }

    @Override
    public String getDescription() {
        return artistURLName;
    }

    public String getArtistURLName() {
        return artistURLName;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof ArtistURLNameSearch)) return false;
        ArtistURLNameSearch that = (ArtistURLNameSearch) o;
        return artistURLName.equals(that.artistURLName);
    }

    @Override
    public int hashCode() {
        return artistURLName.hashCode();
    }

    // "sharon_jones_and_the_dap_kings" --> "Sharon Jones And The Dap Kings"
    private static String beautify(String urlpart) {
        StringBuilder sb = new StringBuilder(urlpart.length() + 1);
        boolean nextIsUpperCase = true;
        for (int i = 0, len = urlpart.length(); i < len; i++) {
            char c = urlpart.charAt(i);
            if (c == '_' || c == '+') {
                sb.append(' ');
                nextIsUpperCase = true;
            } else {
                sb.append(nextIsUpperCase ? Character.toUpperCase(c) : c);
                nextIsUpperCase = false;
            }
        }
        return sb.toString();
    }
}
