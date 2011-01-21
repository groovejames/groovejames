package groovejames.gui.search;

public class AlbumSearch implements SearchParameter {

    private final String albumID;
    private final String albumName;
    private final String artistID;
    private final String artistName;

    public AlbumSearch(String albumID, String albumName, String artistID, String artistName) {
        this.albumID = albumID;
        this.albumName = albumName;
        this.artistName = artistName;
        this.artistID = artistID;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.Album;
    }

    @Override
    public String getLabel() {
        return "Album: \"" + albumName + "\" by " + artistName;
    }

    @Override
    public String getSimpleSearchString() {
        return albumName + " by " + artistName;
    }

    @Override
    public String getShortLabel() {
        return "Album: " + albumName;
    }

    public String getAlbumID() {
        return albumID;
    }

    public String getAlbumName() {
        return albumName;
    }

    public String getArtistID() {
        return artistID;
    }

    public String getArtistName() {
        return artistName;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof AlbumSearch)) return false;
        AlbumSearch that = (AlbumSearch) o;
        return albumID.equals(that.albumID) && artistID.equals(that.artistID);
    }

    @Override
    public int hashCode() {
        int result = albumID.hashCode();
        result = 31 * result + artistID.hashCode();
        return result;
    }
}
