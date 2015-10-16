package groovejames.gui.clipboard;

import groovejames.gui.Main;
import groovejames.service.search.SongSearch;
import groovejames.util.Util;
import org.apache.log4j.Logger;
import org.apache.pivot.wtk.ApplicationContext;

import java.net.URISyntaxException;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GrooveJamesSongClipboardListener implements ClipboardListener {

    private static final Logger log = Logger.getLogger(GrooveJamesSongClipboardListener.class);

    // URL examples:
    // "groovejames://song?id=1002"
    // "groovejames://song?id=1002&id=1004"
    // "groovejames://song?id=1003&id=1004&id=1005&autoplay=true"
    // "groovejames://song?id=1003&songName=Flies+on+the+windscreen"
    // "groovejames://song?id=1003&songName=Flies+on+the+windscreen&id=1004&songName=A+question+of+lust&autoplay=true"
    // Note: the songName won't get used for search; it is there for informational purposes only
    // Note: the pattern may occur multiple times in the clipboard content; we're searching for all occurrences
    private final Pattern pattern = Pattern.compile("groovejames://song\\?[^\\s<>\"']+");

    private final Main main;

    public GrooveJamesSongClipboardListener(Main main) {
        this.main = main;
    }

    @Override
    public boolean clipboardContentsChanged(String newClipboardContent) {
        final Set<Long> songIds = new LinkedHashSet<>();
        final Set<Long> autoPlaySongIds = new LinkedHashSet<>();
        final Set<String> songNames = new LinkedHashSet<>();
        Matcher matcher = pattern.matcher(newClipboardContent);
        while (matcher.find()) {
            String uri = matcher.group();
            log.debug("found match: " + uri);
            try {
                Map<String, List<String>> queryParams = Util.parseQueryParams(uri);
                List<String> autoplayStrings = queryParams.get("autoplay");
                boolean autoplay = autoplayStrings != null && autoplayStrings.contains("true");
                List<String> songIdList = queryParams.get("id");
                if (songIdList != null) {
                    for (String songIdString : songIdList) {
                        long songID = Long.parseLong(songIdString);
                        songIds.add(songID);
                        if (autoplay) {
                            autoPlaySongIds.add(songID);
                        }
                        log.debug("found song id=" + songID + "; autoplay=" + autoplay);
                    }
                }
                List<String> songNameList = queryParams.get("songName");
                if (songNameList != null) {
                    songNames.addAll(songNameList);
                }
            } catch (URISyntaxException ex) {
                log.error("wrong uri pattern: " + uri + "; exception: " + ex);
            } catch (NumberFormatException ex) {
                log.error("invalid song id: " + uri + "; exception: " + ex);
            }
        }
        if (!songIds.isEmpty()) {
            ApplicationContext.queueCallback(new Runnable() {
                @Override
                public void run() {
                    main.openSearchTab(new SongSearch(songIds, songNames, autoPlaySongIds));

                }
            });
            return true;
        } else {
            return false;
        }
    }
}
