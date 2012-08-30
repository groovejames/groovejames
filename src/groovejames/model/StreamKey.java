package groovejames.model;

public class StreamKey {

    private String streamKey;
    private String ip;
    private Long streamServerID;

    /** length of stream, in microseconds. */
    private long uSecs;

    public StreamKey() {
    }

    public StreamKey(String streamKey, String ip, Long streamServerID) {
        this.streamKey = streamKey;
        this.ip = ip;
        this.streamServerID = streamServerID;
    }

    public String getStreamKey() {
        return streamKey;
    }

    public void setStreamKey(String streamKey) {
        this.streamKey = streamKey;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Long getStreamServerID() {
        return streamServerID;
    }

    public void setStreamServerID(Long streamServerID) {
        this.streamServerID = streamServerID;
    }

    public long getuSecs() {
        return uSecs;
    }

    public void setuSecs(long uSecs) {
        this.uSecs = uSecs;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("StreamKey");
        sb.append("{streamKey='").append(streamKey).append('\'');
        sb.append(", ip='").append(ip).append('\'');
        sb.append(", streamServerID=").append(streamServerID);
        sb.append(", uSecs='").append(uSecs).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
