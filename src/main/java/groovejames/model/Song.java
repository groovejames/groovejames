package groovejames.model;

public class Song extends BaseModelObject {

    private long artistID;
    private String artistName;
    private String name;
    private String songName;
    private long songID;
    private long albumID;
    private String albumName;
    private String imageURL;
    private Integer trackNum;
    private Double estimateDuration;
    /** must be a number between 0.0 and 1.0 */
    private Double popularity;

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
        return name != null ? name : songName;
    }

    public void setName(String name) {
        this.name = name;
        if (this.songName == null)
            this.songName = name;
    }

    public String getSongName() {
        return songName != null ? songName : name;
    }

    public void setSongName(String songName) {
        this.songName = songName;
    }

    public long getSongID() {
        return songID;
    }

    public void setSongID(long songID) {
        this.songID = songID;
    }

    public Integer getTrackNum() {
        return trackNum;
    }

    public void setTrackNum(Integer trackNum) {
        this.trackNum = trackNum;
    }

    public long getAlbumID() {
        return albumID;
    }

    public void setAlbumID(long albumID) {
        this.albumID = albumID;
    }

    public String getAlbumName() {
        return albumName;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
    }

    @Override
    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    /**
     * Return estimate duration of this song, in seconds
     *
     * @return the estimate duration, in seconds, or {@code null} if duration is unknown
     */
    public Double getEstimateDuration() {
        return estimateDuration;
    }

    /**
     * Set the estimate duration of this song, in seconds.
     *
     * @param estimateDuration the estimate duration, in seconds, or {@code null} if duration is unknown
     */
    public void setEstimateDuration(Double estimateDuration) {
        this.estimateDuration = estimateDuration;
    }

    /** get popularity, a value between 0.0 and 1.0, or {@code null} if popularity is unknown */

    public Double getPopularity() {
        return popularity;
    }

    /**
     * Set popularity
     *
     * @param popularity must be either {@code null} or a value between 0.0 and 1.0 (inclusive)
     */
    public void setPopularity(Double popularity) {
        this.popularity = popularity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Song song = (Song) o;
        return songID == song.songID;
    }

    @Override
    public int hashCode() {
        return (int) songID;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Song");
        sb.append("{songID=").append(songID);
        sb.append(", songName='").append(songName).append('\'');
        sb.append(", imageURL='").append(imageURL).append('\'');
        sb.append(", estimateDuration=").append(estimateDuration);
        sb.append('}');
        return sb.toString();
    }
}
