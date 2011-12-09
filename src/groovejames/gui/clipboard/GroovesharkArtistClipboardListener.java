package groovejames.gui.clipboard;

import groovejames.gui.Main;
import groovejames.service.search.ArtistSearch;
import groovejames.service.search.ArtistURLNameSearch;
import groovejames.util.Util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GroovesharkArtistClipboardListener implements ClipboardListener {

    // finds urls like "http://grooveshark.com/#/artist/K+d+Lang/428326" or "http://grooveshark.com/artist/K+d+Lang/428326"
    private final Pattern pattern1 = Pattern.compile("http://grooveshark.com/(?:#/)?artist/([^/]*)/([0-9]+)");

    // finds urls like "http://grooveshark.com/sharon_jones_and_the_dap_kings"
    // Note: sometimes Grooveshark creates urls which it later does not find, e.g. "http://grooveshark.com/theblackkeys"
    // The right url would be "http://grooveshark.com/the_black_keys"
    private final Pattern pattern2 = Pattern.compile("http://grooveshark.com/([a-zA-Z0-9_]+)");

    private final Main main;

    public GroovesharkArtistClipboardListener(Main main) {
        this.main = main;
    }

    @Override
    public boolean clipboardContentsChanged(String newClipboardContent) {
        Matcher matcher = pattern1.matcher(newClipboardContent);
        if (matcher.matches()) {
            String artistName = Util.decodeURL(matcher.group(1));
            long artistID = Long.parseLong(matcher.group(2));
            main.openSearchTab(new ArtistSearch(artistID, artistName));
            return true;
        } else {
            matcher = pattern2.matcher(newClipboardContent);
            if (matcher.matches()) {
                String artistUrlName = matcher.group(1);
                main.openSearchTab(new ArtistURLNameSearch(artistUrlName));
                return true;
            }
        }
        return false;
    }

}
