package groovejames.gui;

import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.ImageObjectCellRenderer;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Resources;
import org.apache.pivot.wtk.ListButton;
import org.apache.pivot.wtk.PushButton;
import org.apache.pivot.wtk.SplitPane;
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextInput;

import java.net.URL;

public class SongPane extends TablePane implements Bindable {

    @BXML ClickableTableView songTable;
    @BXML TableView songAlbumTable;
    @BXML ListButton songGroupByButton;
    @BXML SplitPane songSplitPane;
    @BXML PushButton downloadButton;
    @BXML TextInput songSearchInPage;
    @BXML ImageObjectCellRenderer songAlbumImageRenderer;

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
    }
}
