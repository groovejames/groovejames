package groovejames.gui;

import groovejames.gui.validation.FilenameSchemeTextValidator;
import groovejames.model.Settings;
import groovejames.service.ProxySettings;
import groovejames.service.ProxyTestService;
import org.apache.pivot.beans.BXMLSerializer;
import org.apache.pivot.collections.Dictionary;
import org.apache.pivot.collections.HashMap;
import org.apache.pivot.collections.Map;
import org.apache.pivot.util.Resources;
import org.apache.pivot.util.Vote;
import org.apache.pivot.wtk.Alert;
import org.apache.pivot.wtk.ApplicationContext;
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
    private final ProxyTestService proxyTestService;

    private Form networkForm;
    private Form downloadForm;
    private Form miscForm;
    private Checkbox proxyEnabled;
    private TextInput proxyHost;
    private TextInput proxyPort;
    private Label proxyErrorLabel;
    private Button checkProxyButton;
    private Button searchProxyButton;
    private Button okButton;
    private Button cancelButton;
    private TextInput filenameScheme;
    private Label filenameSchemeErrorLabel;
    //private ToggleButton clipboardButton;

    @SuppressWarnings("unchecked") private final Map<String, String> errorStyle = new HashMap<>(new Dictionary.Pair<>("color", "red"));
    @SuppressWarnings("unchecked") private final Map<String, String> warningStyle = new HashMap<>(new Dictionary.Pair<>("color", "orange"));
    @SuppressWarnings("unchecked") private final Map<String, String> okStyle = new HashMap<>(new Dictionary.Pair<>("color", "green"));

    public SettingsDialog(Window window, Resources resources) {
        this.window = window;
        this.resources = resources;
        this.proxyTestService = new ProxyTestService();
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

        networkForm = (Form) serializer.getNamespace().get("networkForm");
        downloadForm = (Form) serializer.getNamespace().get("downloadForm");
        miscForm = (Form) serializer.getNamespace().get("miscForm");
        proxyEnabled = (Checkbox) serializer.getNamespace().get("proxyEnabled");
        proxyHost = (TextInput) serializer.getNamespace().get("proxyHost");
        proxyPort = (TextInput) serializer.getNamespace().get("proxyPort");
        proxyErrorLabel = (Label) serializer.getNamespace().get("proxyErrorLabel");
        checkProxyButton = (Button) serializer.getNamespace().get("checkProxyButton");
        searchProxyButton = (Button) serializer.getNamespace().get("searchProxyButton");
        filenameScheme = (TextInput) serializer.getNamespace().get("filenameScheme");
        filenameSchemeErrorLabel = (Label) serializer.getNamespace().get("filenameSchemeErrorLabel");
        //clipboardButton = (ToggleButton) serializer.getNamespace().get("clipboardButton");
        okButton = (Button) serializer.getNamespace().get("okButton");
        cancelButton = (Button) serializer.getNamespace().get("cancelButton");

        networkForm.load(settings);
        downloadForm.load(settings);
        miscForm.load(settings);

        proxyHost.setEnabled(settings.isProxyEnabled());
        proxyPort.setEnabled(settings.isProxyEnabled());
        checkProxyButton.setEnabled(settings.isProxyEnabled());
        searchProxyButton.setEnabled(settings.isProxyEnabled());

        proxyEnabled.getButtonStateListeners().add(new ButtonStateListener() {
            @Override
            public void stateChanged(Button button, Button.State previousState) {
                proxyHost.setEnabled(button.isSelected());
                proxyPort.setEnabled(button.isSelected());
                checkProxyButton.setEnabled(button.isSelected());
                searchProxyButton.setEnabled(button.isSelected());
            }
        });

        checkProxyButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override
            public void buttonPressed(Button button) {
                if (proxySettingsInvalid()) return;
                final String proxyHostAndPortText = proxyHost.getText() + ":" + proxyPort.getText();
                log.info("checking proxy " + proxyHostAndPortText + " ...");
                proxyErrorLabel.setText("Checking...");
                proxyErrorLabel.setStyles(warningStyle);
                setAllComponentsEnabled(false);
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            proxyTestService.checkProxy(proxyHost.getText(), Integer.parseInt(proxyPort.getText()));
                            log.info("proxy " + proxyHostAndPortText + " check ok.");
                            ApplicationContext.queueCallback(new Runnable() {
                                @Override
                                public void run() {
                                    proxyErrorLabel.setText("Check ok.");
                                    proxyErrorLabel.setStyles(okStyle);
                                }
                            });
                        } catch (final Exception e) {
                            log.error("error checking proxy " + proxyHostAndPortText, e);
                            ApplicationContext.queueCallback(new Runnable() {
                                @Override
                                public void run() {
                                    Form.setFlag(proxyHost, new Form.Flag(MessageType.ERROR, "This proxy host/port pair doesn't seem to work."));
                                    proxyErrorLabel.setText("This proxy host/port pair doesn't seem to work.");
                                    proxyErrorLabel.setStyles(errorStyle);
                                }
                            });
                        } finally {
                            ApplicationContext.queueCallback(new Runnable() {
                                @Override
                                public void run() {
                                    setAllComponentsEnabled(true);
                                }
                            });
                        }
                    }
                }, "check-proxy").start();
            }
        });

        searchProxyButton.getButtonPressListeners().add(new ButtonPressListener() {
            @Override
            public void buttonPressed(Button button) {
                if (proxySettingsInvalid()) return;
                proxyErrorLabel.setText("Fetching proxies ...");
                proxyErrorLabel.setStyles(warningStyle);
                setAllComponentsEnabled(false);
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            ProxySettings except = new ProxySettings(proxyHost.getText(), Integer.parseInt(proxyPort.getText()));
                            final ProxySettings newProxySettings = proxyTestService.findProxyExcept(except, new ProxyTestService.ProxyTestListener() {
                                @Override
                                public void checking(final String hostnameAndPort) {
                                    ApplicationContext.queueCallback(new Runnable() {
                                        @Override
                                        public void run() {
                                            proxyErrorLabel.setText("Checking " + hostnameAndPort + " ...");
                                            proxyErrorLabel.setStyles(warningStyle);
                                        }
                                    });
                                }
                            });
                            ApplicationContext.queueCallback(new Runnable() {
                                @Override
                                public void run() {
                                    if (newProxySettings != null) {
                                        proxyHost.setText(newProxySettings.getHost());
                                        proxyPort.setText(String.valueOf(newProxySettings.getPort()));
                                        proxyErrorLabel.setText("Got a working proxy.");
                                        proxyErrorLabel.setStyles(okStyle);
                                    } else {
                                        proxyErrorLabel.setText("Sorry, no working proxy found after 5 tries. Maybe try again.");
                                        proxyErrorLabel.setStyles(errorStyle);
                                    }
                                }
                            });
                        } catch (final Exception e) {
                            log.error("error fetching proxies", e);
                            ApplicationContext.queueCallback(new Runnable() {
                                @Override
                                public void run() {
                                    proxyErrorLabel.setText("Could not retrieve proxy list: " + e.toString());
                                    proxyErrorLabel.setStyles(errorStyle);
                                }
                            });
                        } finally {
                            ApplicationContext.queueCallback(new Runnable() {
                                @Override
                                public void run() {
                                    setAllComponentsEnabled(true);
                                }
                            });
                        }
                    }
                }, "search-proxy").start();
            }
        });

        filenameScheme.getTextInputContentListeners().add(new TextInputContentListener.Adapter() {
            @Override
            public void textChanged(TextInput textInput) {
                String errorText = new FilenameSchemeTextValidator().getErrorText(textInput.getText());
                filenameSchemeErrorLabel.setText(errorText != null ? errorText : "");
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
                if (proxyEnabled.isSelected()) {
                    if (proxySettingsInvalid()) {
                        return Vote.DENY;
                    }
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

    private void setAllComponentsEnabled(boolean enabled) {
        proxyEnabled.setEnabled(enabled);
        proxyHost.setEnabled(enabled);
        proxyPort.setEnabled(enabled);
        checkProxyButton.setEnabled(enabled);
        searchProxyButton.setEnabled(enabled);
        okButton.setEnabled(enabled);
        cancelButton.setEnabled(enabled);
    }

    private boolean proxySettingsInvalid() {
        if (proxyHost.getText().isEmpty()) {
            Form.setFlag(proxyHost, new Form.Flag(MessageType.ERROR, "Host is required"));
        }
        if (proxyPort.getText().isEmpty()) {
            Form.setFlag(proxyPort, new Form.Flag(MessageType.ERROR, "Port is required"));
        }
        if (proxyHost.getText().isEmpty() || proxyPort.getText().isEmpty()) {
            return true;
        }
        if (!proxyPort.isTextValid()) {
            Form.setFlag(proxyPort, new Form.Flag(MessageType.ERROR, "Please enter a valid decimal port number"));
            return true;
        }
        return false;
    }
}
