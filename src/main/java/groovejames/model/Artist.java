package groovejames.model;

public class Artist extends BaseModelObject {

    private Long artistID;
    private String artistName;
    private String sortName;
    private String coverArtFilename;
    private String artistCoverArtFilename;

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

    public String getName() {
        return artistName;
    }

    public void setName(String name) {
        this.artistName = name;
    }

    public String getSortName() {
        return sortName;
    }

    public void setSortName(String sortName) {
        this.sortName = sortName;
    }

    public String getCoverArtFilename() {
        return coverArtFilename;
    }

    public void setCoverArtFilename(String coverArtFilename) {
        this.coverArtFilename = coverArtFilename;
    }

    public String getArtistCoverArtFilename() {
        return artistCoverArtFilename;
    }

    public void setArtistCoverArtFilename(String artistCoverArtFilename) {
        this.artistCoverArtFilename = artistCoverArtFilename;
    }

    @Override public String getImageFilename() {
        return artistCoverArtFilename != null ? artistCoverArtFilename : coverArtFilename;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Artist artist = (Artist) o;
        return artistID.equals(artist.artistID);
    }

    @Override
    public int hashCode() {
        return artistID.hashCode();
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Artist");
        sb.append("{artistID='").append(artistID).append('\'');
        sb.append(", artistName='").append(artistName).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
