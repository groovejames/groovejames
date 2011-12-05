package groovejames.gui.components;

import org.apache.pivot.wtk.PushButton;

public class ToggleButton extends PushButton {

    private Object selectedButtonData;
    private Object unselectedButtonData;

    public ToggleButton() {
        super(true);
        setTriState(false);
    }

    public void setSelectedButtonData(Object selectedButtonData) {
        this.selectedButtonData = selectedButtonData;
    }

    public Object getSelectedButtonData() {
        return selectedButtonData;
    }

    @Override public void setButtonData(Object buttonData) {
        super.setButtonData(buttonData);
        this.unselectedButtonData = buttonData;
    }

    @Override public void setToggleButton(boolean toggleButton) {
        if (!toggleButton)
            throw new IllegalArgumentException("you may not set toggleButton=false in ToggleButton");
        else
            super.setToggleButton(toggleButton);
    }

    @Override public void setTriState(boolean triState) {
        if (triState)
            throw new IllegalArgumentException("you may not set triState=true in ToggleButton");
        else
            super.setTriState(triState);
    }

    @Override public void setState(State state) {
        if (state == State.MIXED)
            throw new IllegalArgumentException("you may not set state=MIXED in ToggleButton");
        else {
            State oldState = getState();
            super.setState(state);
            if (oldState != state) {
                if (state == State.SELECTED && selectedButtonData != null) {
                    super.setButtonData(selectedButtonData);
                } else if (state == State.UNSELECTED && unselectedButtonData != null) {
                    super.setButtonData(unselectedButtonData);
                }
            }
        }
    }
}
