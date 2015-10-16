package groovejames.service.search;

import java.util.Set;

public class SongSearch extends AbstractSearchParameter {

    private final Set<Long> songIDs;
    private final Set<String> songNames;
    private final Set<Long> autoPlaySongIds;

    public SongSearch(Set<Long> songIDs, Set<String> songNames, Set<Long> autoPlaySongIds) {
        this.songIDs = songIDs;
        this.songNames = songNames;
        this.autoPlaySongIds = autoPlaySongIds;
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

    public Set<Long> getSongIDs() {
        return songIDs;
    }

    public Set<Long> getAutoPlaySongIds() {
        return autoPlaySongIds;
    }

    public Set<String> getSongNames() {
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
