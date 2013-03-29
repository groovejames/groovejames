package groovejames.gui.action;

import groovejames.service.Services;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Button;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.Theme;
import org.apache.pivot.wtk.content.ButtonData;
import org.apache.pivot.wtk.skin.terra.TerraTheme;

public class ToggleRadioAction extends Action {

    public ToggleRadioAction() {
        super(false); // initially disabled
    }

    @Override public void perform(Component source) {
        Button radioButton = (Button) source;
        Services.getPlayService().setRadio(radioButton.isSelected());
        String buttonText = radioButton.isSelected() ? "RADIO ON" : "RADIO OFF";
        int colorThemeIndex = radioButton.isSelected() ? 16 : 10;
        ((ButtonData) radioButton.getButtonData()).setText(buttonText);
        radioButton.getStyles().put("backgroundColor", ((TerraTheme) Theme.getTheme()).getColor(colorThemeIndex));
        radioButton.repaint();
    }

}
