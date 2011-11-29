package groovejames.gui;

import groovejames.gui.components.ClickableTableListener;
import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.DefaultTableViewSortListener;
import groovejames.gui.components.TooltipTableMouseListener;
import groovejames.model.User;
import groovejames.service.Services;
import groovejames.service.search.SearchParameter;
import groovejames.service.search.UserSearch;
import groovejames.util.FilteredList;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Filter;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.ComponentKeyListener;
import org.apache.pivot.wtk.Mouse;
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextInput;

import java.net.URL;

import static groovejames.util.Util.containsIgnoringCase;

public class PeopleTablePane extends TablePane implements Bindable, CardPaneContent<User> {

    private Main main;
    private FilteredList<User> peopleList = new FilteredList<User>();

    private @BXML ClickableTableView peopleTable;
    private @BXML TextInput peopleSearchInPage;

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        this.main = (Main) namespace.get("main");

        peopleTable.setTableData(peopleList);
        peopleTable.getTableViewSortListeners().add(new DefaultTableViewSortListener());
        peopleTable.getComponentMouseListeners().add(new TooltipTableMouseListener());
        peopleTable.getClickableTableListeners().add(new ClickableTableListener() {
            @Override
            public boolean cellClicked(ClickableTableView source, Object row, int rowIndex, int columnIndex, Mouse.Button button, int clickCount) {
                TableView.Column column = source.getColumns().get(columnIndex);
                if ("username".equals(column.getName()) || "name".equals(column.getName())) {
                    User user = (User) row;
                    main.openSearchTab(new UserSearch(user.getUserID(), user.getUsername(), user.getName()));
                }
                return false;
            }
        });

        peopleSearchInPage.getComponentKeyListeners().add(new ComponentKeyListener.Adapter() {
            @Override public boolean keyTyped(Component searchField, char character) {
                final String searchString = ((TextInput) searchField).getText().trim();
                peopleList.setFilter(new Filter<User>() {
                    @Override public boolean include(User user) {
                        return containsIgnoringCase(user.getUsername(), searchString)
                            || containsIgnoringCase(user.getName(), searchString);
                    }
                });
                return false;
            }
        });
    }

    @Override public void afterLoad(SearchParameter searchParameter) {
        WtkUtil.setupColumnWidthSaver(peopleTable, "peopleTable", searchParameter.getSearchType().name());
    }

    @Override public GuiAsyncTask<User[]> getSearchTask(final SearchParameter searchParameter) {
        return new GuiAsyncTask<User[]>(
            "searching for people named \"" + searchParameter.getSimpleSearchString() + "\"") {

            @Override protected void beforeExecute() {
                peopleList.setSource(new ArrayList<User>());
            }

            @Override public User[] execute() throws TaskExecutionException {
                try {
                    return Services.getSearchService().searchPeople(searchParameter);
                } catch (Exception ex) {
                    throw new TaskExecutionException(ex);
                }
            }

            @Override protected void taskExecuted() {
                User[] result = getResult();
                peopleList.setSource(new ArrayList<User>(result));
            }

        };
    }
}
