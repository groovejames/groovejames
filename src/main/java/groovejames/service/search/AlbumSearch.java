package groovejames.service.search;

import static com.google.common.base.Strings.isNullOrEmpty;

public class AlbumSearch extends AbstractSearchParameter {

    private final long albumID;
    private final String albumName;
    private final String artistName;
    private final boolean autoplay;

    public AlbumSearch(long albumID, String albumName, String artistName, boolean autoplay) {
        this.albumID = albumID;
        this.albumName = albumName != null ? albumName : "";
        this.artistName = artistName;
        this.autoplay = autoplay;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.Album;
    }

    @Override
    public String getLabel() {
        return "Album: \"" + albumName + "\"" + (isNullOrEmpty(artistName) ? "" : " by " + artistName);
    }

    @Override
    public String getShortLabel() {
        return "Album: " + albumName;
    }

    @Override
    public String getDescription() {
        return albumName + (isNullOrEmpty(artistName) ? "" : " by " + artistName);
    }

    public long getAlbumID() {
        return albumID;
    }

    public String getAlbumName() {
        return albumName;
    }

    public String getArtistName() {
        return artistName;
    }

    public boolean isAutoplay() {
        return autoplay;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof AlbumSearch)) return false;
        AlbumSearch that = (AlbumSearch) o;
        return albumID == that.albumID;
    }

    @Override
    public int hashCode() {
        return Long.valueOf(albumID).hashCode();
    }
}
