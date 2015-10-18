package groovejames.model;

public class StreamInfo {

    private final String downloadUrl;
    private final int duration;
    private final String imageURL;

    public StreamInfo(String downloadUrl, int duration, String imageURL) {
        this.downloadUrl = downloadUrl;
        this.duration = duration;
        this.imageURL = imageURL;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public int getDuration() {
        return duration;
    }

    public String getImageURL() {
        return imageURL;
    }

}
