package groovejames.service.netease;

public class NEStreamInfo {
    public long dfsId;
    public String extension;
    /** in bytes */
    public long size;
    /** in milliseconds */
    public int playTime;
    /** in bytes/s, e.g 384000 is 384kB/s */
    public int bitrate;
}
