package groovejames.service.netease;

public class NEArtistDetailsResponse extends NEResponse {
    /** this is often true, but there is no way to retrieve more using the artist details request */
    public boolean more;
    public NESongDetails[] hotSongs;
}
