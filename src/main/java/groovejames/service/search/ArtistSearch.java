package groovejames.service.search;

public class ArtistSearch extends AbstractSearchParameter {

    private final long artistID;
    private final String artistName;

    public ArtistSearch(long artistID, String artistName) {
        this.artistName = artistName;
        this.artistID = artistID;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.Artist;
    }

    @Override
    public String getLabel() {
        return "Artist: " + artistName;
    }

    @Override
    public String getShortLabel() {
        return getLabel();
    }

    @Override
    public String getDescription() {
        return artistName;
    }

    public long getArtistID() {
        return artistID;
    }

    public String getArtistName() {
        return artistName;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof ArtistSearch)) return false;
        ArtistSearch that = (ArtistSearch) o;
        return artistID == that.artistID;
    }

    @Override
    public int hashCode() {
        return Long.valueOf(artistID).hashCode();
    }
}
