package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TableSelectAllKeyListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.SearchResult;
import groovejames.model.User;
import groovejames.service.Services;
import groovejames.service.search.UserSearch;
import groovejames.util.FilteredList;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.SortDirection;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextInput;

import java.net.URL;

import static groovejames.util.StringUtils.containsIgnoringCase;

public class PeopleTablePane extends AbstractSearchTablePane<User> {

    private Main main;
    private FilteredList<User> peopleList = new FilteredList<>();

    @BXML private ClickableTableView peopleTable;
    @BXML private TextInput peopleSearchInPage;

    @Override
    public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        TooltipTableMouseListener.install(peopleTable);
        peopleTable.setTableData(peopleList);
        peopleTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        peopleTable.getComponentKeyListeners().add(new TableSelectAllKeyListener());
        peopleTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                if ("username".equals(column.getName()) || "name".equals(column.getName())) {
                    User user = (User) row;
                    main.openSearchTab(new UserSearch(user.getUserID(), user.getUsername()));
                }
                return false;
            }
        });

        peopleSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override
            public boolean keyTyped(Component searchField, char character) {
                final String searchString = ((TextInput) searchField).getText().trim();
                peopleList.setFilter(new Filter<User>() {
                    @Override
                    public boolean include(User user) {
                        return containsIgnoringCase(user.getUsername(), searchString)
                                || containsIgnoringCase(user.getName(), searchString);
                    }
                });
                return false;
            }
        });
    }

    @Override
    public void afterLoad() {
        super.afterLoad();
        peopleTable.setSort("username", SortDirection.ASCENDING);
        WtkUtil.setupColumnWidthSaver(peopleTable, "peopleTable", searchParameter.getSearchType().name());
    }

    @Override
    public String getSearchDescription() {
        return "searching for people named \"" + searchParameter.getDescription() + "\"";
    }

    @Override
    public void beforeSearch() {
        peopleList.setSource(new ArrayList<User>());
    }

    @Override
    public SearchResult<User> search() throws Exception {
        return Services.getSearchService().searchPeople(searchParameter);
    }

    @Override
    public void afterSearch(SearchResult<User> searchResult) {
        updateCountTextAndMoreLink(searchResult);
        User[] people = searchResult.getResult();
        peopleList.setSource(new ArrayList<>(people));
    }
}
