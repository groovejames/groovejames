package groovejames.model;

public class Playlist extends BaseModelObject {

    private long playlistID;
    private String name;
    private String about;
    private String artists;
    private Long numSongs;
    private Long userID;
    private String picture;

    public long getPlaylistID() {
        return playlistID;
    }

    public void setPlaylistID(long playlistID) {
        this.playlistID = playlistID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getArtists() {
        return artists;
    }

    public void setArtists(String artists) {
        this.artists = artists;
    }

    public Long getNumSongs() {
        return numSongs;
    }

    public void setNumSongs(Long numSongs) {
        this.numSongs = numSongs;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    @Override public String getImageFilename() {
        return picture;
    }
}
