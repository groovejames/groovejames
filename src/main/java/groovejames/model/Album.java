package groovejames.model;

public class Album extends BaseModelObject {

    private Long artistID;
    private String artistName;
    private Long albumID;
    private String albumName;
    private String coverArtFilename;
    private String year;

    /**
     * "1": song is actually an album name, "2": song is released on a Single or EP,
     * "0" or null: plain song
     */
    private String releaseType;

    public Long getArtistID() {
        return artistID;
    }

    public void setArtistID(Long artistID) {
        this.artistID = artistID;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public Long getAlbumID() {
        return albumID;
    }

    public void setAlbumID(Long albumID) {
        this.albumID = albumID;
    }

    public String getAlbumName() {
        return albumName;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
    }

    public String getName() {
        return getAlbumName();
    }

    public void setName(String name) {
        setAlbumName(name);
    }

    public String getCoverArtFilename() {
        return coverArtFilename;
    }

    public void setCoverArtFilename(String coverArtFilename) {
        this.coverArtFilename = coverArtFilename;
    }

    @Override
    public String getImageURL() {
        return coverArtFilename;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getReleaseType() {
        return releaseType;
    }

    public void setReleaseType(String releaseType) {
        this.releaseType = releaseType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Album album = (Album) o;
        return albumID.equals(album.albumID);
    }

    @Override
    public int hashCode() {
        return albumID.hashCode();
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Album");
        sb.append("{albumID=").append(albumID);
        sb.append(", albumName='").append(albumName).append('\'');
        sb.append(", releaseType='").append(releaseType).append('\'');
        sb.append(", coverArtFilename='").append(coverArtFilename).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
