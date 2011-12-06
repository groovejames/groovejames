package groovejames.service.search;

import static groovejames.util.Util.isEmpty;

public class AlbumSearch implements SearchParameter {

    private final Long albumID;
    private final String albumName;
    private final String artistName;

    public AlbumSearch(Long albumID, String albumName) {
        this(albumID, albumName, null);
    }

    public AlbumSearch(Long albumID, String albumName, String artistName) {
        this.albumID = albumID;
        this.albumName = albumName != null ? albumName : "";
        this.artistName = artistName;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.Album;
    }

    @Override
    public String getLabel() {
        return "Album: \"" + albumName + "\"" + (isEmpty(artistName) ? "" : " by " + artistName);
    }

    @Override
    public String getSimpleSearchString() {
        return albumName + (isEmpty(artistName) ? "" : " by " + artistName);
    }

    @Override
    public String getShortLabel() {
        return "Album: " + albumName;
    }

    public Long getAlbumID() {
        return albumID;
    }

    public String getAlbumName() {
        return albumName;
    }

    public String getArtistName() {
        return artistName;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof AlbumSearch)) return false;
        AlbumSearch that = (AlbumSearch) o;
        return albumID.equals(that.albumID);
    }

    @Override
    public int hashCode() {
        return albumID.hashCode();
    }
}
