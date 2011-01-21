package groovejames.gui;

import org.apache.pivot.wtk.SplitPane;
import org.apache.pivot.wtk.effects.Transition;
import org.apache.pivot.wtk.effects.easing.Easing;
import org.apache.pivot.wtk.effects.easing.Sine;

public class SplitRatioTransition extends Transition {
    private final SplitPane splitPane;
    private final float initialSplitRatio;
    private final Easing easing = new Sine();
    private float finalRatio;

    public SplitRatioTransition(SplitPane splitPane, float finalRatio, int duration, int rate) {
        super(duration, rate, false);
        this.splitPane = splitPane;
        this.initialSplitRatio = splitPane.getSplitRatio();
        this.finalRatio = finalRatio;
    }

    @Override
    protected void update() {
        float percentComplete = getPercentComplete();
        if (percentComplete < 1.0f) {
            float ratio = (initialSplitRatio - finalRatio) * (1.0f - percentComplete) + finalRatio;
            ratio = easing.easeInOut(getElapsedTime(), initialSplitRatio, ratio - initialSplitRatio, getDuration());
            splitPane.setSplitRatio(ratio);
            splitPane.repaint();
        }
    }
}
