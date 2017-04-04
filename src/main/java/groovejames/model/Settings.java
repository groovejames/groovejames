package groovejames.model;

import groovejames.service.DownloadService;
import groovejames.service.FilenameSchemeParser;

import java.util.Locale;
import java.util.prefs.Preferences;

public class Settings {

    private boolean proxyEnabled = false;
    private String proxyHost;
    private int proxyPort = 80;
    private String downloadLocation = DownloadService.defaultDownloadDir.getAbsolutePath();
    private String filenameScheme = FilenameSchemeParser.DEFAULT_FILENAME_SCHEME;
    private boolean watchClipboard = true;

    public static Settings load() {
        Settings settings = new Settings();
        Preferences prefs = Preferences.userNodeForPackage(Settings.class);
        settings.setProxyEnabled(prefs.getBoolean("proxyEnabled", settings.isProxyEnabled()));
        settings.setProxyHost(prefs.get("proxyHost", settings.getProxyHost()));
        settings.setProxyPort(prefs.getInt("proxyPort", settings.getProxyPort()));
        settings.setDownloadLocation(prefs.get("downloadLocation", settings.getDownloadLocation()));
        settings.setFilenameScheme(prefs.get("filenameScheme", settings.getFilenameScheme()));
        return settings;
    }

    public void save() {
        Preferences prefs = Preferences.userNodeForPackage(Settings.class);
        prefs.putBoolean("proxyEnabled", isProxyEnabled());
        prefs.put("proxyHost", getProxyHost());
        prefs.putInt("proxyPort", getProxyPort());
        prefs.put("downloadLocation", getDownloadLocation());
        prefs.put("filenameScheme", getFilenameScheme());
    }

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
        if (filenameScheme != null && filenameScheme.toLowerCase(Locale.ENGLISH).endsWith(".mp3")) {
            filenameScheme = filenameScheme.substring(0, filenameScheme.length() - 4); // cut off .mp3 from previous versions
        }
        this.filenameScheme = filenameScheme;
    }

    public boolean isWatchClipboard() {
        return watchClipboard;
    }

    public void setWatchClipboard(boolean watchClipboard) {
        this.watchClipboard = watchClipboard;
    }
}
