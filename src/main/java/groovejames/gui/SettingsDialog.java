package groovejames.gui;

import groovejames.gui.components.ToggleButton;
import groovejames.gui.validation.FilenameSchemeTextValidator;
import groovejames.model.Settings;
import org.apache.pivot.beans.BXMLSerializer;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.Vote;
import org.apache.pivot.wtk.Alert;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.ButtonPressListener;
import org.apache.pivot.wtk.ButtonStateListener;
import org.apache.pivot.wtk.Checkbox;
import org.apache.pivot.wtk.Form;
import org.apache.pivot.wtk.Label;
import org.apache.pivot.wtk.MessageType;
import org.apache.pivot.wtk.Sheet;
import org.apache.pivot.wtk.SheetCloseListener;
import org.apache.pivot.wtk.SheetStateListener;
import org.apache.pivot.wtk.TextInput;
import org.apache.pivot.wtk.TextInputContentListener;
import org.apache.pivot.wtk.Window;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SettingsDialog {

    private static final Logger log = LoggerFactory.getLogger(SettingsDialog.class);

    private final Window window;
    private final Resources resources;

    public SettingsDialog(Window window, Resources resources) {
        this.window = window;
        this.resources = resources;
    }

    public void show(final Settings settings, SheetCloseListener sheetCloseListener) {
        final BXMLSerializer serializer;
        final Sheet sheet;
        try {
            serializer = new BXMLSerializer();
            sheet = (Sheet) serializer.readObject(getClass().getResource("settings.bxml"), resources);
        } catch (Exception ex) {
            log.error("error loading settings.bxml", ex);
            Alert.alert(MessageType.ERROR, "error loading settings.bxml\n" + ex, window);
            return;
        }

        final Form networkForm = (Form) serializer.getNamespace().get("networkForm");
        final Form downloadForm = (Form) serializer.getNamespace().get("downloadForm");
        final Form miscForm = (Form) serializer.getNamespace().get("miscForm");
        final Checkbox proxyEnabled = (Checkbox) serializer.getNamespace().get("proxyEnabled");
        final TextInput proxyHost = (TextInput) serializer.getNamespace().get("proxyHost");
        final TextInput proxyPort = (TextInput) serializer.getNamespace().get("proxyPort");
        final Button okButton = (Button) serializer.getNamespace().get("okButton");
        final Button cancelButton = (Button) serializer.getNamespace().get("cancelButton");
        final TextInput filenameScheme = (TextInput) serializer.getNamespace().get("filenameScheme");
        final Label errorLabel = (Label) serializer.getNamespace().get("errorLabel");
        final ToggleButton clipboardButton = (ToggleButton) serializer.getNamespace().get("clipboardButton");

        networkForm.load(settings);
        downloadForm.load(settings);
        miscForm.load(settings);

        proxyHost.setEnabled(settings.isProxyEnabled());
        proxyPort.setEnabled(settings.isProxyEnabled());

        proxyEnabled.getButtonStateListeners().add(new ButtonStateListener() {
            @Override
            public void stateChanged(Button button, Button.State previousState) {
                proxyHost.setEnabled(button.isSelected());
                proxyPort.setEnabled(button.isSelected());
            }
        });

        filenameScheme.getTextInputContentListeners().add(new TextInputContentListener.Adapter() {
            @Override
            public void textChanged(TextInput textInput) {
                String errorText = new FilenameSchemeTextValidator().getErrorText(textInput.getText());
                errorLabel.setText(errorText != null ? errorText : "");
                if (errorText != null) {
                    Form.setFlag(filenameScheme, new Form.Flag(MessageType.ERROR, errorText));
                } else {
                    Form.clearFlag(filenameScheme);
                }
                okButton.setEnabled(errorText == null);
            }
        });

        okButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override
            public void buttonPressed(Button button) {
                sheet.close(true);
            }
        });

        cancelButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override
            public void buttonPressed(Button button) {
                sheet.close(false);
            }
        });

        sheet.getSheetStateListeners().add(new SheetStateListener() {
            @Override
            public Vote previewSheetClose(Sheet sheet, boolean result) {
                if (!proxyHost.getText().isEmpty() && proxyPort.getText().isEmpty()) {
                    Form.setFlag(proxyPort, new Form.Flag(MessageType.ERROR, "Port must be entered"));
                    return Vote.DENY;
                }
                if (!proxyPort.isTextValid()) {
                    Form.setFlag(proxyPort, new Form.Flag(MessageType.ERROR, "Please enter a valid decimal port number"));
                    return Vote.DENY;
                }
                if (proxyPort.getText().isEmpty()) {
                    proxyPort.setText("80");
                }
                return Vote.APPROVE;
            }

            @Override
            public void sheetCloseVetoed(Sheet sheet, Vote reason) {
            }

            @Override
            public void sheetClosed(Sheet sheet) {
                if (sheet.getResult()) {
                    networkForm.store(settings);
                    downloadForm.store(settings);
                    miscForm.store(settings);
                }
            }
        });
        sheet.open(window, sheetCloseListener);
    }
}
