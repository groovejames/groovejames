package groovejames.service.search;

import java.util.Collections;
import java.util.List;

public class SongSearch extends AbstractSearchParameter {

    private final List<Long> songIDs;
    private final List<String> songNames;
    private final List<Long> autoPlaySongIds;

    public SongSearch(List<Long> songIDs, List<String> songNames, List<Long> autoPlaySongIds) {
        this.songIDs = songIDs;
        this.songNames = songNames;
        this.autoPlaySongIds = autoPlaySongIds;
    }

    public SongSearch(long songID, String songName, boolean autoplay) {
        this.songIDs = Collections.singletonList(songID);
        this.songNames = Collections.singletonList(songName);
        this.autoPlaySongIds = autoplay ? this.songIDs : Collections.<Long>emptyList();
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.Songs;
    }

    @Override
    public String getLabel() {
        if (songNames.size() == 1) {
            return "Song: \"" + songNames.iterator().next() + "\"";
        } else if (songNames.size() > 1) {
            return "Song: \"" + songNames.iterator().next() + "\" and others";
        } else if (songIDs.size() == 1) {
            return "One shared song";
        } else {
            return String.valueOf(songIDs.size()) + " shared songs";
        }
    }

    @Override
    public String getShortLabel() {
        return songIDs.size() == 1 ? "Song" : String.valueOf(songIDs.size()) + " songs";
    }

    @Override
    public String getDescription() {
        return getLabel();
    }

    public List<Long> getSongIDs() {
        return songIDs;
    }

    public List<Long> getAutoPlaySongIds() {
        return autoPlaySongIds;
    }

    public List<String> getSongNames() {
        return songNames;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof SongSearch)) return false;
        SongSearch that = (SongSearch) o;
        return songIDs.equals(that.songIDs);
    }

    @Override
    public int hashCode() {
        return songIDs.hashCode();
    }
}
