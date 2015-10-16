package groovejames.model;

public class SearchResult<T extends BaseModelObject> {

    private final int total;
    private final T[] result;

    public SearchResult(int total, T[] result) {
        this.total = total;
        this.result = result;
    }

    public int getTotal() {
        return total;
    }

    public T[] getResult() {
        return result;
    }

}
