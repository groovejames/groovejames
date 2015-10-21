package groovejames.service.netease;

public class NESongDetails extends NESong {
    public NEAlbum album;
    public NEArtist[] artists;
    public String mp3Url;
    /** disc number if multi-disc, or empty string */
    public String disc;
    /** position on disc */
    public int no;
    /** what that's for? It's not always the position on the album. */
    public int position;
    /** in milliseconds */
    public int duration;
    /** value from 0.0 to 100.0 */
    public double popularity;
    /** same as {@link #popularity} but as int from 0 to 100 */
    public int score;
    public NEStreamInfo bMusic, lMusic, mMusic, hMusic;
}

