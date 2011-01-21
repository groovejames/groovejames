package groovejames.model;

public class Artist extends ImageObject {

    private String artistID;
    private String name;
    private String picture;

    public String getArtistID() {
        return artistID;
    }

    public void setArtistID(String artistID) {
        this.artistID = artistID;
    }

    public String getName() {
        return name;
    }

    public String getArtistName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    @Override
    public String getImageFilename() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
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
        sb.append('}');
        return sb.toString();
    }
}
