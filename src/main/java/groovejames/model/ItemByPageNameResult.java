package groovejames.model;

public class ItemByPageNameResult {

    // either artist or song gets filled
    private Artist artist;
    private Song song;

    public Artist getArtist() {
        return artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }
}
