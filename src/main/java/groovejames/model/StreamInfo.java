package groovejames.model;

public class StreamInfo {

    private final String downloadUrl;
    private final int duration;

    public StreamInfo(String downloadUrl, int duration) {
        this.downloadUrl = downloadUrl;
        this.duration = duration;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public int getDuration() {
        return duration;
    }

}
