package groovejames.model;

import groovejames.service.DownloadService;
import groovejames.service.FilenameSchemeParser;

public class Settings {

    private boolean proxyEnabled = false;
    private String proxyHost;
    private int proxyPort = 80;
    private String downloadLocation = DownloadService.defaultDownloadDir.getAbsolutePath();
    private String filenameScheme = FilenameSchemeParser.DEFAULT_FILENAME_SCHEME;

    public boolean isProxyEnabled() {
        return proxyEnabled;
    }

    public void setProxyEnabled(boolean proxyEnabled) {
        this.proxyEnabled = proxyEnabled;
    }

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

    public String getDownloadLocation() {
        return downloadLocation;
    }

    public void setDownloadLocation(String downloadLocation) {
        this.downloadLocation = downloadLocation;
    }

    public String getFilenameScheme() {
        return filenameScheme;
    }

    public void setFilenameScheme(String filenameScheme) {
        this.filenameScheme = filenameScheme;
    }
}
