package groovejames.model;

import groovejames.service.FilenameSchemeParser;

public class Settings {

    private String proxyHost;
    private int proxyPort = 80;
    private String filenameScheme = FilenameSchemeParser.DEFAULT_FILENAME_SCHEME;

    public String getProxyHost() {
        return proxyHost;
    }

    public void setProxyHost(String proxyHost) {
        this.proxyHost = proxyHost;
    }

    public int getProxyPort() {
        return proxyPort;
    }

    public void setProxyPort(int proxyPort) {
        this.proxyPort = proxyPort;
    }

    public String getFilenameScheme() {
        return filenameScheme;
    }

    public void setFilenameScheme(String filenameScheme) {
        this.filenameScheme = filenameScheme;
    }
}
