package groovejames.service.search;

import static java.lang.String.format;

public class UserSearch extends AbstractSearchParameter {

    private final long userID;
    private final String userName;

    public UserSearch(long userID, String userName) {
        this.userID = userID;
        this.userName = userName;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.User;
    }

    @Override
    public String getLabel() {
        return format("User: %s", userName);
    }

    @Override
    public String getShortLabel() {
        return getLabel();
    }

    @Override
    public String getDescription() {
        return userName;
    }

    public long getUserID() {
        return userID;
    }

    public String getUserName() {
        return userName;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof UserSearch)) return false;
        UserSearch that = (UserSearch) o;
        return userID == that.userID;
    }

    @Override
    public int hashCode() {
        return Long.valueOf(userID).hashCode();
    }
}
