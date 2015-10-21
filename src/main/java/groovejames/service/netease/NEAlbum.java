package groovejames.service.netease;

public class NEAlbum {
    public long id;
    public String name;
    public NEArtist artist;
    public NEArtist[] artists;
    public String picUrl;
    /** publishing time of album, in milliseconds since 1970 */
    public long publishTime;
    public int size;
    public NESongDetails[] songs;
    public int status;
}
