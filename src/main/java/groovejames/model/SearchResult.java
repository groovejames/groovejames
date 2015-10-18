package groovejames.model;

public class SearchResult<T extends BaseModelObject> {

    private final boolean totalUnknown;
    private final int total;
    private final T[] result;
    private final boolean hasMore;

    public SearchResult(T[] result, boolean hasMore) {
        this.totalUnknown = true;
        this.total = -1;
        this.result = result;
        this.hasMore = hasMore;
    }

    public SearchResult(T[] result, int total) {
        this.totalUnknown = false;
        this.total = total;
        this.result = result;
        this.hasMore = true;
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
}
