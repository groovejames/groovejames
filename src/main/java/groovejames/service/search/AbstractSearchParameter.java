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

}
