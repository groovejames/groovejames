package groovejames.service.search;

abstract class AbstractSearchParameter implements SearchParameter {

    private int offset;
    private int limit;
    private int total; // -1 means unknown

    protected AbstractSearchParameter() {
        this.offset = 0;
        this.limit = DEFAULT_SEARCH_LIMIT;
        this.total = -1;
    }

    @Override
    public int getOffset() {
        return offset;
    }

    @Override
    public void setOffset(int offset) {
        this.offset = offset;
    }

    @Override
    public int getLimit() {
        return limit;
    }

    @Override
    public void setLimit(int limit) {
        this.limit = limit;
    }

    @Override
    public int getTotal() {
        return total;
    }

    @Override
    public void setTotal(int total) {
        this.total = total;
    }

    @Override
    public SearchParameter clone() {
        try {
            return (SearchParameter) super.clone();
        } catch (CloneNotSupportedException ex) {
            throw new RuntimeException(ex); // impossible
        }
    }
}
