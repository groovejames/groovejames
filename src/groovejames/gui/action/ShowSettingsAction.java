package groovejames.gui.action;

import groovejames.gui.Main;
import groovejames.gui.SettingsDialog;
import groovejames.model.Settings;
import groovejames.service.Services;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.Sheet;
import org.apache.pivot.wtk.SheetCloseListener;

public class ShowSettingsAction extends Action {

    private final Main main;

    public ShowSettingsAction(Main main) {
        this.main = main;
    }

    public void perform(Component source) {
        final SettingsDialog settingsDialog = new SettingsDialog(main.getWindow(), main.getResources());
        final Settings settings = main.getSettings();
        settingsDialog.show(settings, new SheetCloseListener() {
            public void sheetClosed(Sheet sheet) {
                if (sheet.getResult()) {
                    Services.applySettings(settings);
                    settings.save();
                }
            }
        });
    }

}
