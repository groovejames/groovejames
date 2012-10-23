package groovejames.gui.clipboard;

import groovejames.gui.Main;
import groovejames.service.search.PlaylistSearch;
import groovejames.util.Util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GroovesharkPlaylistClipboardListener implements ClipboardListener {

    // URL e.g.: "http://grooveshark.com/#!/playlist/K+D+LANG/8690613" or "http://grooveshark.com/playlist/K+D+LANG/8690613"
    private final Pattern pattern = Pattern.compile("http://grooveshark.com/(?:#!/)?playlist/([^/]*)/([0-9]+)");

    private final Main main;

    public GroovesharkPlaylistClipboardListener(Main main) {
        this.main = main;
    }

    @Override
    public boolean clipboardContentsChanged(String newClipboardContent) {
        Matcher matcher = pattern.matcher(newClipboardContent);
        if (matcher.matches()) {
            String playlistName = Util.decodeURL(matcher.group(1));
            long playlistID = Long.parseLong(matcher.group(2));
            main.openSearchTab(new PlaylistSearch(playlistID, playlistName));
            return true;
        }
        return false;
    }

}
