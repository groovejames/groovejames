package groovejames.gui.clipboard;

import groovejames.gui.Main;
import groovejames.service.search.AlbumSearch;
import groovejames.util.Util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GroovesharkAlbumClipboardListener implements ClipboardListener {

    // URL e.g.: "http://grooveshark.com/#/album/Hymns+Of+The+49th+Parallel/1426903" or "http://grooveshark.com/album/Hymns+Of+The+49th+Parallel/1426903"
    private final Pattern pattern = Pattern.compile("http://grooveshark.com/(?:#/)?album/([^/]*)/([0-9]+)");

    private final Main main;

    public GroovesharkAlbumClipboardListener(Main main) {
        this.main = main;
    }

    @Override
    public boolean clipboardContentsChanged(String newClipboardContent) {
        Matcher matcher = pattern.matcher(newClipboardContent);
        if (matcher.matches()) {
            String albumName = Util.decodeURL(matcher.group(1));
            long albumID = Long.parseLong(matcher.group(2));
            main.openSearchTab(new AlbumSearch(albumID, albumName));
            return true;
        }
        return false;
    }

}
