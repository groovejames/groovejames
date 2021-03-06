package groovejames.model;

public class Song extends BaseModelObject {

    private long artistID;
    private String artistName;
    private String songName;
    private long songID;
    private long albumID;
    private String albumName;
    private String albumArtistName;
    private String imageURL;
    private Integer trackNum;
    private Integer duration;
    /** must be a number between 0.0 and 1.0 */
    private Double popularity;
    private Integer bitrate;
    private String downloadURL;
    private String alternativeDownloadURL;

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

    public String getSongName() {
        return songName;
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

    public String getAlbumArtistName() {
        return albumArtistName;
    }

    public void setAlbumArtistName(String albumArtistName) {
        this.albumArtistName = albumArtistName;
    }

    @Override
    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    /**
     * Return duration of this song, in seconds
     *
     * @return the duration, in seconds, or {@code null} if duration is unknown
     */
    public Integer getDuration() {
        return duration;
    }

    /**
     * Set the duration of this song, in seconds.
     *
     * @param duration the duration, in seconds, or {@code null} if duration is unknown
     */
    public void setDuration(Integer duration) {
        this.duration = duration;
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

    public Integer getBitrate() {
        return bitrate;
    }

    public void setBitrate(Integer bitrate) {
        this.bitrate = bitrate;
    }

    public String getDownloadURL() {
        return downloadURL;
    }

    public void setDownloadURL(String downloadURL) {
        this.downloadURL = downloadURL;
    }

    public String getAlternativeDownloadURL() {
        return alternativeDownloadURL;
    }

    public void setAlternativeDownloadURL(String alternativeDownloadURL) {
        this.alternativeDownloadURL = alternativeDownloadURL;
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
        return Long.valueOf(songID).hashCode();
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Song");
        sb.append("{songID=").append(songID);
        sb.append(", songName='").append(songName).append('\'');
        sb.append(", duration=").append(duration);
        sb.append(", bitrate=").append(bitrate);
        sb.append('}');
        return sb.toString();
    }
}
