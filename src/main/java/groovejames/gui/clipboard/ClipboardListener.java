package groovejames.gui.clipboard;

public interface ClipboardListener {

    /**
     * Gets called if the text contents of the clipboard have changed.
     *
     * @param newClipboardContent new clipboard content
     * @return true if the clipboard listener handles the change. If true, the event will no longer be promoted to other listeners.
     */
    boolean clipboardContentsChanged(String newClipboardContent);

}
