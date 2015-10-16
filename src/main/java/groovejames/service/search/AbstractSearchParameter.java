package groovejames.service.search;

abstract class AbstractSearchParameter implements SearchParameter {

    private int offset;
    private int limit;

    protected AbstractSearchParameter() {
        this.offset = 0;
        this.limit = DEFAULT_SEARCH_LIMIT;
    }

    @Override
    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    @Override
    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }
}
