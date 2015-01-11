package groovejames.model;

public class Track {

    public static enum Status {
        QUEUED, INITIALIZING, DOWNLOADING, FINISHED, CANCELLED, ERROR;

        public boolean isSuccessful() {
            return this == FINISHED;
        }

        public boolean isFinished() {
            return this == FINISHED || this == CANCELLED || this == ERROR;
        }
    }

    private final Song song;
    private final Store store;
    private long totalBytes;
    private long downloadedBytes;
    private Status status = Status.QUEUED;
    private Long startDownloadTime;
    private Long stopDownloadTime;
    private Exception fault;

    public Track(Song song, Store store) {
        if (song == null)
            throw new IllegalArgumentException("song is null");
        if (store == null)
            throw new IllegalArgumentException("store is null");
        this.song = song;
        this.store = store;
    }

    public Song getSong() {
        return song;
    }

    // used for binding in download table
    public String getSongName() {
        return song.getSongName();
    }

    // used for binding in download table
    public String getArtistName() {
        return song.getArtistName();
    }

    // used for binding in download table
    public String getAlbumName() {
        return song.getAlbumName();
    }

    public Store getStore() {
        return store;
    }

    public long getTotalBytes() {
        return totalBytes;
    }

    public void setTotalBytes(long totalBytes) {
        this.totalBytes = totalBytes;
    }

    public long getDownloadedBytes() {
        return downloadedBytes;
    }

    public void setDownloadedBytes(long downloadedBytes) {
        this.downloadedBytes = downloadedBytes;
    }

    public void incDownloadedBytes(long increment) {
        this.downloadedBytes += increment;
    }

    public double getProgress() {
        return totalBytes > 0 ? (double) downloadedBytes / (double) totalBytes : 0.0;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        if (!this.status.isFinished()) {
            this.status = status;
        }
    }

    public Exception getFault() {
        return fault;
    }

    public void setFault(Exception ex) {
        this.fault = ex;
    }

    public Long getStartDownloadTime() {
        return startDownloadTime;
    }

    public Long getStopDownloadTime() {
        return stopDownloadTime;
    }

    public void setStartDownloadTime(long startDownloadTime) {
        this.startDownloadTime = startDownloadTime;
    }

    public void setStopDownloadTime(long stopDownloadTime) {
        this.stopDownloadTime = stopDownloadTime;
    }

    /**
     * @return duration of download up until now, in ms
     */
    public Long getDownloadDuration() {
        if (startDownloadTime == null)
            return null;
        else if (stopDownloadTime != null)
            return stopDownloadTime - startDownloadTime;
        else
            return System.currentTimeMillis() - startDownloadTime;
    }

    /**
     * @return download rate in bytes/s
     */
    public Double getDownloadRate() {
        Long downloadDuration = getDownloadDuration();
        if (downloadDuration != null && downloadDuration > 0 && downloadedBytes > 0)
            return (double) downloadedBytes / downloadDuration * 1000.0;
        else
            return null;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Track");
        sb.append("{songID=").append(song.getSongID());
        sb.append(", store=").append(store.getDescription());
        sb.append(", status=").append(status);
        sb.append(", totalBytes=").append(totalBytes);
        sb.append(", downloadedBytes=").append(downloadedBytes);
        sb.append('}');
        return sb.toString();
    }
}
