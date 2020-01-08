package groovejames.gui.clipboard;

import groovejames.gui.Main;
import groovejames.service.search.SongSearch;
import groovejames.util.UrlUtils;
import org.apache.pivot.wtk.ApplicationContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GrooveJamesSongClipboardListener implements ClipboardListener {

    private static final Logger log = LoggerFactory.getLogger(GrooveJamesSongClipboardListener.class);

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
        final List<Long> songIds = new ArrayList<>();
        final List<Long> autoPlaySongIds = new ArrayList<>();
        final List<String> songNames = new ArrayList<>();
        Matcher matcher = pattern.matcher(newClipboardContent);
        while (matcher.find()) {
            String uri = matcher.group();
            log.debug("found match: {}", uri);
            try {
                Map<String, List<String>> queryParams = UrlUtils.parseQueryParams(uri);
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
                        log.debug("found song id={}; autoplay={}", songID, autoplay);
                    }
                }
                List<String> songNameList = queryParams.get("songName");
                if (songNameList != null) {
                    songNames.addAll(songNameList);
                }
            } catch (URISyntaxException ex) {
                log.error("wrong uri pattern: {}; exception: {}", uri, ex.toString());
            } catch (NumberFormatException ex) {
                log.error("invalid song id: {}; exception: {}", uri, ex.toString());
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
