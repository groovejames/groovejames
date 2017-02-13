package groovejames.service.netease;

public class NEDownloadLocationResponse extends NEResponse {

    public static class NEDownloadLocation {
        public int br; // bitrate
        public long id;
        public long size;
        public String url;
    }

    public NEDownloadLocation[] data;

}

