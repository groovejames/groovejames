package groovejames.gui.components;

import org.apache.pivot.wtk.Theme;
import org.apache.pivot.wtk.skin.terra.TerraTheme;
import org.apache.pivot.wtk.skin.terra.TerraTooltipSkin;

public class FixedTerraTooltipSkin extends TerraTooltipSkin {
    public FixedTerraTooltipSkin() {
        super();
        TerraTheme theme = (TerraTheme) Theme.getTheme();
        setBackgroundColor(theme.getColor(4));
    }
}
