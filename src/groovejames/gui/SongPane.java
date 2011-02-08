package groovejames.gui;

import groovejames.gui.components.ClickableTableView;
import groovejames.gui.components.ImageObjectCellRenderer;
import groovejames.gui.components.ListIdItem;
import groovejames.model.Song;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.util.Resources;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.ButtonPressListener;
import org.apache.pivot.wtk.ListButton;
import org.apache.pivot.wtk.MenuButton;
import org.apache.pivot.wtk.PushButton;
import org.apache.pivot.wtk.SplitPane;
import org.apache.pivot.wtk.TablePane;
import org.apache.pivot.wtk.TableView;
import org.apache.pivot.wtk.TextInput;
import org.apache.pivot.wtk.ListButtonSelectionListener;

import java.net.URL;

public class SongPane extends TablePane implements Bindable {

    @BXML ClickableTableView songTable;
    @BXML TableView songAlbumTable;
    @BXML ListButton songGroupByButton;
    @BXML SplitPane songSplitPane;
    @BXML PushButton downloadButton;
    @BXML MenuButton playButton;
    @BXML Button songPlayNowButton;
    @BXML Button songAddAsNextButton;
    @BXML Button songAddAtEndButton;
    @BXML Button songReplacePlaylistButton;
    @BXML TextInput songSearchInPage;
    @BXML ImageObjectCellRenderer songAlbumImageRenderer;

    private Main main;

    public void setMain(Main main) {
        this.main = main;
        this.songAlbumImageRenderer.setImageGetter(main);
    }

    @Override public void initialize(Map<String, Object> namespace, URL location, Resources resources) {
        downloadButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override public void buttonPressed(Button button) {
                Sequence<?> selectedRows = songTable.getSelectedRows();
                for (int i = 0, len = selectedRows.getLength(); i < len; i++) {
                    Song song = (Song) selectedRows.get(i);
                    main.download(song);
                }
            }
        });

        songPlayNowButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override public void buttonPressed(Button button) {
                Sequence<?> selectedRows = songTable.getSelectedRows();
                for (int i = 0, len = selectedRows.getLength(); i < len; i++) {
                    Song song = (Song) selectedRows.get(i);
                    main.play(song);
                }
            }
        });
    }
}
