package groovejames.service.search;

import groovejames.util.Util;

import static java.lang.String.format;

public class UserSearch implements SearchParameter {

    private final Long userID;
    private final String username;
    private final String name;

    public UserSearch(Long userID, String username, String name) {
        this.userID = userID;
        this.username = username;
        this.name = name;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.User;
    }

    @Override
    public String getLabel() {
        return format("User: %s", Util.isEmpty(name) ? username : name);
    }

    @Override
    public String getShortLabel() {
        return getLabel();
    }

    @Override
    public String getDescription() {
        return username;
    }

    public Long getUserID() {
        return userID;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
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
