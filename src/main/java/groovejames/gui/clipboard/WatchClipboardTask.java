package groovejames.gui.clipboard;

import org.apache.pivot.wtk.Clipboard;
import org.apache.pivot.wtk.Manifest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class WatchClipboardTask {

    private static final Logger log = LoggerFactory.getLogger(WatchClipboardTask.class);

    private static int instanceCount;

    private final List<ClipboardListener> clipboardListeners = new CopyOnWriteArrayList<>();
    private final Object mutex = new Object();

    private volatile long pollDelay = 1000;
    private volatile WatcherThread watcherThread = null;

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
        return new ArrayList<>(clipboardListeners);
    }

    public synchronized void startWatching() {
        if (watcherThread != null)
            stopWatching();
        watcherThread = new WatcherThread();
        watcherThread.start();
    }

    public synchronized void stopWatching() {
        if (watcherThread == null)
            return;
        log.info("stop requested...");
        watcherThread.shouldRun = false;
        synchronized (mutex) {
            mutex.notifyAll();
        }
        watcherThread = null;
    }

    public synchronized boolean isWatching() {
        return watcherThread != null && watcherThread.isAlive();
    }

    public void checkNow() {
        log.info("check forced...");
        if (watcherThread == null)
            startWatching();
        watcherThread.oldText = null;
        synchronized (mutex) {
            mutex.notifyAll();
        }
    }

    public void dontCheck(String text) {
        watcherThread.oldText = text;
    }

    public static void main(String[] args) {
        new WatchClipboardTask().startWatching();
    }

    private class WatcherThread extends Thread {
        private volatile boolean shouldRun = true;
        private volatile String oldText = null;

        public WatcherThread() {
            super("WatchClipboardTask-" + ++WatchClipboardTask.instanceCount);
            setDaemon(true);
        }

        @Override
        public void run() {
            log.info("thread started.");
            oldText = getClipboardText();
            while (shouldRun) {
                try {
                    work();
                    synchronized (mutex) {
                        mutex.wait(pollDelay);
                    }
                } catch (InterruptedException e) {
                    log.info("thread interrupted.");
                    break;
                } catch (Exception ex) {
                    log.error("error processing clipboard contents", ex);
                }
            }
            log.info("thread ends.");
        }

        private void work() throws IOException {
            String text = getClipboardText();
            if (text != null) {
                if (!text.equals(oldText)) {
                    oldText = text;
                    clipboardContentsChanged(text);
                }
            }
        }

        private String getClipboardText() {
            try {
                Manifest content = Clipboard.getContent();
                if (content != null && content.containsText()) {
                    return content.getText();
                }
            } catch (IOException ex) {
                log.error("error getting clipboard text contents: ", ex.toString());
            }
            return null;
        }

        private void clipboardContentsChanged(String text) {
            log.debug("clipboard contents changed");
            for (ClipboardListener clipboardListener : clipboardListeners) {
                try {
                    boolean consumed = clipboardListener.clipboardContentsChanged(text);
                    if (consumed) {
                        log.debug("handled by clipboard listener {}", clipboardListener);
                        return;
                    }
                } catch (Exception ex) {
                    log.error("error in clipboard listener {}", clipboardListener, ex);
                }
            }
            log.debug("content not handled by any clipboard listener");
        }
    }
}
