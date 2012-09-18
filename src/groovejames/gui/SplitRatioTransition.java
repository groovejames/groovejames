package groovejames.gui;

import org.apache.pivot.wtk.SplitPane;
import org.apache.pivot.wtk.effects.Transition;
import org.apache.pivot.wtk.effects.TransitionListener;

public class SplitRatioTransition extends Transition {

    private static final String RUNNING_KEY = "transitionRunning-" + SplitRatioTransition.class.getName();

    private final SplitPane splitPane;
    private final float initialSplitRatio;
    private float finalRatio;

    public SplitRatioTransition(SplitPane splitPane, float finalRatio, int duration, int rate) {
        super(duration, rate, false);
        this.splitPane = splitPane;
        this.initialSplitRatio = splitPane.getSplitRatio();
        this.finalRatio = finalRatio;
    }

    @Override
    public void start(TransitionListener transitionListener) {
        splitPane.getUserData().put(RUNNING_KEY, Boolean.TRUE);
        super.start(transitionListener);
    }

    @Override
    protected void update() {
        float percentComplete = getPercentComplete();
        float ratio;
        if (percentComplete < 1.0f) {
            ratio = (initialSplitRatio - finalRatio) * (1.0f - percentComplete) + finalRatio;
        } else {
            ratio = finalRatio;
        }
        splitPane.setSplitRatio(ratio);
    }

    @Override
    public void stop() {
        super.stop();
        splitPane.getUserData().remove(RUNNING_KEY);
    }

    public static boolean isTransitionRunning(SplitPane splitPane) {
        return splitPane.getUserData().containsKey(RUNNING_KEY);
    }
}
