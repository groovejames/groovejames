package groovejames.service.search;

import static java.lang.String.format;

public class PlaylistSearch implements SearchParameter {

    private final Long playlistID;
    private final String name;

    public PlaylistSearch(Long playlistID, String name) {
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
    public String getSimpleSearchString() {
        return name;
    }

    public Long getPlaylistID() {
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
        return playlistID.equals(that.playlistID);
    }

    @Override
    public int hashCode() {
        return playlistID.hashCode();
    }
}
