package groovejames.service.netease;

public class NESongDetails extends NESong {
    public String mp3Url;
    public int position;
    public int no;
    /** in milliseconds */
    public int duration;
    /** value from 0.0 to 100.0 */
    public double popularity;
    /** same as {@link #popularity} but as int from 0 to 100 */
    public int score;
    public NEStreamInfo bMusic, lMusic, mMusic, hMusic;
}

