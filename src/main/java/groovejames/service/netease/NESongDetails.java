package groovejames.service.netease;

public class NESongDetails {
    public String name;
    public long id;
    public String mp3Url;
    public int position;
    /** in milliseconds */
    public int duration;
    public double popularity;
    public double score;
    public int fee;
    public NEStreamInfo bMusic, lMusic, mMusic, hMusic;
    public NEAlbum album;
}

