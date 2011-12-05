package groovejames.gui;

public class WatchClipboardTask extends Thread {

    private static int instanceCount;

    private volatile long pollDelay = 2000;
    private volatile boolean abort = false;

    public WatchClipboardTask() {
        super("WatchClipboardTask-" + ++instanceCount);
    }

    public long getPollDelay() {
        return pollDelay;
    }

    public void setPollDelay(long pollDelay) {
        this.pollDelay = pollDelay;
    }

    @Override public void run() {
        while (true) {
            System.err.printf("interrupted: %s isInterrupted: %s%n", interrupted(), isInterrupted());
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.err.printf("%s interrupted: %s isInterrupted: %s%n", e.toString(), interrupted(), isInterrupted());
            }
        }
    }

    /**
     * main method.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) throws InterruptedException {
        WatchClipboardTask watchClipboardTask = new WatchClipboardTask();
        watchClipboardTask.start();
        Thread.sleep(3500);
        watchClipboardTask.interrupt();
        Thread.sleep(10000);
    }
}
