package groovejames.model;

public class SearchResult<T extends BaseModelObject> {

    private final boolean totalUnknown;
    private final int total;
    private final T[] result;
    private final boolean hasMore;
    private final String updatedSearchLabel;

    public SearchResult(T[] result, boolean hasMore) {
        this.totalUnknown = true;
        this.total = -1;
        this.result = result;
        this.hasMore = hasMore;
        this.updatedSearchLabel = null;
    }

    public SearchResult(T[] result, int total) {
        this(result, total, null);
    }

    public SearchResult(T[] result, int total, String updatedSearchLabel) {
        this.totalUnknown = false;
        this.total = total;
        this.result = result;
        this.hasMore = true;
        this.updatedSearchLabel = updatedSearchLabel;
    }

    public boolean isTotalUnknown() {
        return totalUnknown;
    }

    public int getTotal() {
        return total;
    }

    public T[] getResult() {
        return result;
    }

    public boolean hasMore() {
        return hasMore;
    }

    public String getUpdatedSearchLabel() {
        return updatedSearchLabel;
    }
}
