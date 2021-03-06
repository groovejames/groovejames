package groovejames.service.search;

import static java.lang.String.format;

public class PlaylistSearch extends AbstractSearchParameter {

    private final long playlistID;
    private final String name;

    public PlaylistSearch(long playlistID, String name) {
        this.playlistID = playlistID;
        this.name = name;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.Playlist;
    }

    @Override
    public String getLabel() {
        return format("Playlist: %s", name);
    }

    @Override
    public String getShortLabel() {
        return getLabel();
    }

    @Override
    public String getDescription() {
        return name;
    }

    public long getPlaylistID() {
        return playlistID;
    }

    public String getName() {
        return name;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof PlaylistSearch)) return false;
        PlaylistSearch that = (PlaylistSearch) o;
        return playlistID == that.playlistID;
    }

    @Override
    public int hashCode() {
        return Long.valueOf(playlistID).hashCode();
    }
}
