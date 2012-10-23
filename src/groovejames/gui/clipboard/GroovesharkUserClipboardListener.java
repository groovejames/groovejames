package groovejames.gui.clipboard;

import groovejames.gui.Main;
import groovejames.service.search.UserSearch;
import groovejames.util.Util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GroovesharkUserClipboardListener implements ClipboardListener {

    // URL e.g.: "http://grooveshark.com/#!/user/Sheila+Nicholls/932298" or "http://grooveshark.com/user/Sheila+Nicholls/932298"
    private final Pattern pattern = Pattern.compile("http://grooveshark.com/(?:#!/)?user/([^/]*)/([0-9]+)");

    private final Main main;

    public GroovesharkUserClipboardListener(Main main) {
        this.main = main;
    }

    @Override
    public boolean clipboardContentsChanged(String newClipboardContent) {
        Matcher matcher = pattern.matcher(newClipboardContent);
        if (matcher.matches()) {
            String name = Util.decodeURL(matcher.group(1));
            long artistID = Long.parseLong(matcher.group(2));
            main.openSearchTab(new UserSearch(artistID, null, name));
            return true;
        }
        return false;
    }

}
