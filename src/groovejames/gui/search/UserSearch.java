package groovejames.gui.search;

public class UserSearch implements SearchParameter {

    private final String userID;
    private final String username;

    public UserSearch(String userID, String username) {
        this.userID = userID;
        this.username = username;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.User;
    }

    @Override
    public String getLabel() {
        return "User: " + username;
    }

    @Override
    public String getShortLabel() {
        return getLabel();
    }

    @Override
    public String getSimpleSearchString() {
        return username;
    }

    public String getUserID() {
        return userID;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public boolean equals(SearchParameter o) {
        if (this == o) return true;
        if (!(o instanceof UserSearch)) return false;
        UserSearch that = (UserSearch) o;
        return userID.equals(that.userID);
    }

    @Override
    public int hashCode() {
        return userID.hashCode();
    }
}
