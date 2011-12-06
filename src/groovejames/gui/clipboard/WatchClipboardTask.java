package groovejames.gui.clipboard;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.pivot.wtk.Clipboard;
import org.apache.pivot.wtk.ClipboardContentListener;
import org.apache.pivot.wtk.LocalManifest;
import org.apache.pivot.wtk.Manifest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class WatchClipboardTask extends Thread {

    private static final Log log = LogFactory.getLog(WatchClipboardTask.class);

    private static int instanceCount;

    private volatile long pollDelay = 1000;
    private String oldText = null;
    private List<ClipboardListener> clipboardListeners = new CopyOnWriteArrayList<ClipboardListener>();

    public WatchClipboardTask() {
        super("WatchClipboardTask-" + ++instanceCount);
    }

    public long getPollDelay() {
        return pollDelay;
    }

    public void setPollDelay(long pollDelay) {
        this.pollDelay = pollDelay;
    }

    public void addClipboardListener(ClipboardListener clipboardListener) {
        clipboardListeners.add(clipboardListener);
    }

    public void removeClipboardListener(ClipboardListener clipboardListener) {
        clipboardListeners.remove(clipboardListener);
    }

    public List<ClipboardListener> getClipboardListeners() {
        return new ArrayList<ClipboardListener>(clipboardListeners);
    }

    public void requestAbort() {
        log.info("thread " + getName() + ": interrupt requested.");
        interrupt();
    }

    @Override public void run() {
        log.info("thread " + getName() + " started.");
        oldText = getClipboardText();
        if (oldText != null && oldText.length() > 0) {
            LocalManifest localManifest = new LocalManifest();
            localManifest.putText(oldText);
            Clipboard.setContent(localManifest, new ClipboardContentListener() {
                @Override public void contentChanged(LocalManifest previousContent) {
                    log.debug("thread " + getName() + ": lost clipboard ownership");
                    oldText = null;
                }
            });
        }
        while (!isInterrupted()) {
            try {
                work();
                Thread.sleep(pollDelay);
            } catch (InterruptedException e) {
                log.info("thread " + getName() + ": interrupted.");
                break;
            } catch (IOException ex) {
                log.error("error getting clipboard contents", ex);
            }
        }
        log.info("thread " + getName() + " ends.");
    }

    private void work() throws IOException {
        String text = getClipboardText();
        if (text != null) {
            if (!text.equals(oldText)) {
                clipboardContentsChanged(text);
            }
            oldText = text;
        }
    }

    private String getClipboardText() {
        Manifest content = Clipboard.getContent();
        if (content != null && content.containsText()) {
            try {
                return content.getText();
            } catch (IOException ex) {
                log.error("thread " + getName() + ": error getting clipboard text contents", ex);
            }
        }
        return null;
    }

    private void clipboardContentsChanged(String text) {
        log.debug("thread " + getName() + ": clipboard contents changed");
        for (ClipboardListener clipboardListener : clipboardListeners) {
            boolean consumed = clipboardListener.clipboardContentsChanged(text);
            if (consumed) {
                log.debug("thread " + getName() + ": handled by clipboard listener " + clipboardListener);
                return;
            }
        }
        log.debug("thread " + getName() + ": not handled by any clipboard listener");
    }
}
