package groovejames.gui;

import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.ImageObjectCellRenderer;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Resources;
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.TextInput;

import java.net.URL;

public class PeoplePane extends TablePane implements Bindable {

    @BXML ClickableTableView peopleTable;
    @BXML TextInput peopleSearchInPage;
    @BXML ImageObjectCellRenderer peopleImageRenderer;

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
    }
}
