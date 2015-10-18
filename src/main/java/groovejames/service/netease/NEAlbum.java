package groovejames.service.netease;

public class NEAlbum {
    public long id;
    public String name;
    public NEArtist artist;
    public NEArtist[] artists;
    public String description;
    public String company;
    public String picUrl;
    public long picId;
    public String blurPicUrl;
    /** publishing time of album, in milliseconds since 1970 */
    public long publishTime;
    public int size;
    public NESong[] songs;
    public int status;
}
