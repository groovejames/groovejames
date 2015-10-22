package groovejames.model;

public class Artist extends BaseModelObject {

    private long artistID;
    private String artistName;
    private String imageURL;

    public long getArtistID() {
        return artistID;
    }

    public void setArtistID(long artistID) {
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

    @Override
    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Artist artist = (Artist) o;
        return artistID == artist.artistID;
    }

    @Override
    public int hashCode() {
        return Long.valueOf(artistID).hashCode();
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Artist");
        sb.append("{artistID=").append(artistID);
        sb.append(", artistName='").append(artistName).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
