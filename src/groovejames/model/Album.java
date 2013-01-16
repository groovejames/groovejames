package groovejames.model;

import static java.lang.Math.max;
import static java.lang.Math.min;

// {"AlbumID":"5247723","ArtistID":"402081","Name":"Could You Believe","Year":"2010","GenreID":"80","CoverArtFilename":"5247723.jpg","IsVerified":"1","ReleaseStatus":"1","ReleaseType":"2","Popularity":"0","Flags":"0"},
public class Album extends ImageObject {

    private Long artistID;
    private String artistName;
    private Long albumID;
    private String albumName;
    private String coverArtFilename;
    private String year;
    private double popularity;
    private double popularityPercentage;
    private String isVerified; // "1" or "0"

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
    public String getImageFilename() {
        return coverArtFilename;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public double getPopularity() {
        return popularity;
    }

    public void setPopularity(double popularity) {
        this.popularity = popularity;
    }

    public double getPopularityPercentage() {
        return popularityPercentage;
    }

    public void setPopularityPercentage(double popularityPercentage) {
        this.popularityPercentage = max(min(popularityPercentage, 1.0), 0.0);
    }

    public String getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(String verified) {
        isVerified = verified;
    }

    public String getReleaseType() {
        return releaseType;
    }

    public void setReleaseType(String releaseType) {
        this.releaseType = releaseType;
    }

    /**
     * Create an Album instance from the given song.
     *
     * @param song a Song
     * @return a new Album instance
     */
    public static Album createAlbum(Song song) {
        Album album = new Album();
        album.setAlbumID(song.getAlbumID());
        album.setAlbumName(song.getAlbumName());
        album.setArtistID(song.getArtistID());
        album.setArtistName(song.getArtistName());
        album.setCoverArtFilename(song.getCoverArtFilename());
        album.setYear(song.getYear());
        album.setPopularity(song.getPopularity());
        album.setPopularityPercentage(song.getPopularityPercentage());
        album.setIsVerified(song.getIsVerified());
        return album;
    }

    public static Album[] createAlbumsFromSongs(Song[] songs) {
        Album[] result = new Album[songs.length];
        for (int i = 0; i < songs.length; i++) {
            result[i] = createAlbum(songs[i]);
        }
        return result;
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
        sb.append(", isVerified='").append(isVerified).append('\'');
        sb.append(", releaseType='").append(releaseType).append('\'');
        sb.append(", coverArtFilename='").append(coverArtFilename).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
