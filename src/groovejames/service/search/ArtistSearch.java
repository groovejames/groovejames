package groovejames.service.search;

public class ArtistSearch implements SearchParameter {

    private final Long artistID;
    private final String artistName;

    public ArtistSearch(Long artistID, String artistName) {
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
    public String getSimpleSearchString() {
        return artistName;
    }

    public Long getArtistID() {
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
        return artistID.equals(that.artistID);
    }

    @Override
    public int hashCode() {
        return artistID.hashCode();
    }
}
