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
    public NEStreamInfo bMusic, lMusic, mMusic, hMusic;
    /** seems to indicated whether the song is freely available or not. Seen values: 1 or 8. 1 seems non-free. */
    public int fee;

    /* not part of response, gets computed */
    public int bitrate;
    /* not part of response, gets computed */
    public String mp3UrlAlternative;

}

