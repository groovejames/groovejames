package groovejames.model;

public class Artist extends ImageObject {

    private String artistID;
    private String artistNameID;
    private String name;
    private String sortName;
    private String coverArtFilename;

    public String getArtistID() {
        return artistID;
    }

    public void setArtistID(String artistID) {
        this.artistID = artistID;
    }

    public String getArtistNameID() {
        return artistNameID;
    }

    public void setArtistNameID(String artistNameID) {
        this.artistNameID = artistNameID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    @Override public String getImageFilename() {
        return coverArtFilename;
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
        sb.append(", artistNameID='").append(artistNameID).append('\'');
        sb.append(", name='").append(name).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
