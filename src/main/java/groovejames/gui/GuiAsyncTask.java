package groovejames.gui;

import org.apache.pivot.util.concurrent.Task;
import org.apache.pivot.util.concurrent.TaskListener;
import org.apache.pivot.wtk.ApplicationContext;

public abstract class GuiAsyncTask<V> extends Task<V> {

    private final String description;

    public GuiAsyncTask(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public final void execute(TaskListener<V> taskListener) {
        beforeExecute();
        super.execute(new WrappedTaskListener<>(taskListener));
    }

    protected void beforeExecute() {
    }

    /**
     * Called on the EDT.
     */
    protected void taskExecuted() {
    }

    /**
     * Called on the EDT.
     */
    protected void executeFailed() {
    }


    private static class WrappedTaskListener<V> implements TaskListener<V> {
        private final TaskListener<V> taskListener;

        public WrappedTaskListener(TaskListener<V> taskListener) {
            this.taskListener = taskListener;
        }

        @Override
        public void taskExecuted(final Task<V> task) {
            ApplicationContext.queueCallback(new Runnable() {
                @Override
                public void run() {
                    ((GuiAsyncTask) task).taskExecuted();
                    if (taskListener != null) {
                        taskListener.taskExecuted(task);
                    }
                }
            });
        }

        @Override
        public void executeFailed(final Task<V> task) {
            ApplicationContext.queueCallback(new Runnable() {
                @Override
                public void run() {
                    ((GuiAsyncTask) task).executeFailed();
                    if (taskListener != null) {
                        taskListener.executeFailed(task);
                    }
                }
            });
        }
    }
}
