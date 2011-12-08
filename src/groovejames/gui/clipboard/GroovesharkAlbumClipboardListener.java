package groovejames.gui.clipboard;

import groovejames.gui.Main;
import groovejames.service.search.AlbumSearch;
import groovejames.util.Util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GroovesharkAlbumClipboardListener implements ClipboardListener {

    // "http://grooveshark.com/#/album/Hymns+Of+The+49th+Parallel/1426903" or "http://grooveshark.com/album/Hymns+Of+The+49th+Parallel/1426903"
    private final Pattern pattern1 = Pattern.compile("http://grooveshark.com/(?:#/)?album/([^/]*)/([0-9]+)");

    // "http://grooveshark.com/theblackkeys" or "http://grooveshark.com/sharon_jones_and_the_dap_kings"
    private final Pattern pattern2 = Pattern.compile("http://grooveshark.com/([a-zA-Z0-9_]+)");

    private final Main main;

    public GroovesharkAlbumClipboardListener(Main main) {
        this.main = main;
    }

    @Override
    public boolean clipboardContentsChanged(String newClipboardContent) {
        Matcher matcher = pattern1.matcher(newClipboardContent);
        if (matcher.matches()) {
            String albumName = Util.decodeURL(matcher.group(1));
            long albumID = Long.parseLong(matcher.group(2));
            main.openSearchTab(new AlbumSearch(albumID, albumName));
            return true;
        } else {
            matcher = pattern2.matcher(newClipboardContent);
            if (matcher.matches()) {
                String albumUrlName = matcher.group(1);

            }
        }
        return false;
    }

}
