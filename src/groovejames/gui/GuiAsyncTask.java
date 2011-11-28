package groovejames.gui;

import org.apache.pivot.util.concurrent.Task;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.util.concurrent.TaskListener;
import org.apache.pivot.wtk.ApplicationContext;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

public abstract class GuiAsyncTask<V> extends Task<V> {

    private String description;

    public GuiAsyncTask(String description) {
        this.description = description;
        beforeExecute();
    }

    protected void beforeExecute() {
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public final V executeSynchronously() throws TaskExecutionException {
        final CountDownLatch doneSignal = new CountDownLatch(2);
        execute(new TaskListener<V>() {
            @Override
            public void taskExecuted(Task<V> vTask) {
                doneSignal.countDown();
            }

            @Override
            public void executeFailed(Task<V> vTask) {
                doneSignal.countDown();
            }
        });
        doneSignal.countDown();
        try {
            doneSignal.await(getTimeout(), TimeUnit.MILLISECONDS);
        } catch (InterruptedException ex) {
            throw new TaskExecutionException(ex);
        }
        if (getFault() != null) {
            throw new TaskExecutionException(getFault());
        } else {
            return getResult();
        }
    }

    public final void executeAsynchronously() throws TaskExecutionException {
        execute(null);
    }

    @Override
    public final void execute(TaskListener<V> taskListener) {
        super.execute(new WrappedTaskListener<V>(taskListener));
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
