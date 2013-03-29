package groovejames.gui.clipboard;

import groovejames.gui.Main;
import groovejames.service.search.AlbumSearch;
import groovejames.util.Util;
import org.apache.log4j.Logger;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GrooveJamesAlbumClipboardListener implements ClipboardListener {

    private static final Logger log = Logger.getLogger(GrooveJamesAlbumClipboardListener.class);

    // URL examples
    // "groovejames://album?id=1426903"
    // "groovejames://album?id=1426903&autoplay=true"
    // "groovejames://album?id=1426903&id=32344"
    // "groovejames://album?id=1426903&albumName=Hymns+Of+The+49th+Parallel&autoplay=true"
    // Note: the albumName won't get used for search; it is there for informational purposes only
    // Note: the pattern may occur multiple times in the clipboard content; we're searching for all occurrences
    private final Pattern pattern = Pattern.compile("groovejames://album\\?[^\\s<>\"']+");

    private final Main main;

    public GrooveJamesAlbumClipboardListener(Main main) {
        this.main = main;
    }

    @Override
    public boolean clipboardContentsChanged(String newClipboardContent) {
        Matcher matcher = pattern.matcher(newClipboardContent);
        boolean foundMatch = false;
        boolean usedAutoplayOnce = false;
        while (matcher.find()) {
            String uri = matcher.group();
            log.debug("found match: " + uri);
            try {
                Map<String, List<String>> queryParams = Util.parseQueryParams(uri);
                List<String> autoplayStrings = queryParams.get("autoplay");
                boolean autoplay = !usedAutoplayOnce && autoplayStrings != null && autoplayStrings.contains("true");
                List<String> albumIdList = queryParams.get("id");
                List<String> albumNameList = queryParams.get("albumName");
                if (albumIdList != null) {
                    for (int i = 0, len = albumIdList.size(); i < len; i++) {
                        String albumIdString = albumIdList.get(i);
                        long albumID = Long.parseLong(albumIdString);
                        String albumName = albumNameList != null && albumNameList.size() > i ? albumNameList.get(i) : null;
                        log.debug("found album id=" + albumID + "; autoplay=" + autoplay + "; albumName=" + albumName);
                        main.openSearchTab(new AlbumSearch(albumID, albumName, autoplay));
                        foundMatch = true;
                        if (autoplay) {
                            usedAutoplayOnce = true;
                        }
                    }
                }
            } catch (URISyntaxException ex) {
                log.error("wrong uri pattern: " + uri + "; exception: " + ex);
            } catch (NumberFormatException ex) {
                log.error("invalid album id: " + uri + "; exception: " + ex);
            }
        }
        return foundMatch;
    }

}
