package groovejames.gui.clipboard;

import groovejames.gui.Main;
import groovejames.service.search.ArtistSearch;
import groovejames.util.Util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GroovesharkArtistClipboardListener implements ClipboardListener {

    // URL e.g.: "http://grooveshark.com/#/artist/K+d+Lang/428326" or "http://grooveshark.com/artist/K+d+Lang/428326"
    private final Pattern pattern = Pattern.compile("http://grooveshark.com/(?:#/)?artist/([^/]*)/([0-9]+)");

    private final Main main;

    public GroovesharkArtistClipboardListener(Main main) {
        this.main = main;
    }

    @Override
    public boolean clipboardContentsChanged(String newClipboardContent) {
        Matcher matcher = pattern.matcher(newClipboardContent);
        if (matcher.matches()) {
            String artistName = Util.decodeURL(matcher.group(1));
            long artistID = Long.parseLong(matcher.group(2));
            main.openSearchTab(new ArtistSearch(artistID, artistName));
            return true;
        }
        return false;
    }

}
