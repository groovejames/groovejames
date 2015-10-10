package groovejames.model;

public class Song extends BaseModelObject {

    private Long artistID;
    private String artistName;
    private String name;
    private String songName;
    private Long songID;
    private Long albumID;
    private String albumName;
    private String coverArtFilename;
    private String year;
    private Long trackNum;
    private Double estimateDuration; // in seconds, alas not reliable; often 0.00

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

    public Long getSongID() {
        return songID;
    }

    public void setSongID(Long songID) {
        this.songID = songID;
    }

    public Long getTrackNum() {
        return trackNum;
    }

    public void setTrackNum(Long trackNum) {
        this.trackNum = trackNum;
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

    public String getCoverArtFilename() {
        return coverArtFilename;
    }

    public void setCoverArtFilename(String coverArtFilename) {
        this.coverArtFilename = coverArtFilename;
    }

    @Override
    public String getImageFilename() {
        return coverArtFilename;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Song song = (Song) o;
        return songID.equals(song.songID);
    }

    @Override
    public int hashCode() {
        return songID.hashCode();
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Song");
        sb.append("{songID=").append(songID);
        sb.append(", songName='").append(songName).append('\'');
        sb.append(", isVerified=").append(isVerified);
        sb.append(", coverArtFilename='").append(coverArtFilename).append('\'');
        sb.append(", estimateDuration=").append(estimateDuration);
        sb.append('}');
        return sb.toString();
    }
}