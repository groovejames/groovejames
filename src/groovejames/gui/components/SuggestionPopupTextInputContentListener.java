package groovejames.gui.components;

import org.apache.pivot.collections.List;
import org.apache.pivot.util.concurrent.AbortException;
import org.apache.pivot.util.concurrent.Task;
import org.apache.pivot.util.concurrent.TaskExecutionException;
import org.apache.pivot.util.concurrent.TaskListener;
import org.apache.pivot.wtk.ApplicationContext;
import org.apache.pivot.wtk.ListView;
import org.apache.pivot.wtk.SuggestionPopup;
import org.apache.pivot.wtk.SuggestionPopupCloseListener;
import org.apache.pivot.wtk.TaskAdapter;
import org.apache.pivot.wtk.TextInput;
import org.apache.pivot.wtk.TextInputContentListener;

/**
 * @see <a href="http://svn.apache.org/repos/asf/pivot/trunk/demos/src/org/apache/pivot/demos/suggest/SuggestionDemo.java">SuggestionDemo.java</a>
 */
public class SuggestionPopupTextInputContentListener extends TextInputContentListener.Adapter {

    private SuggestionsProvider<?> suggestionsProvider;
    private SuggestionPopup suggestionPopup;
    private ListView.ItemRenderer suggestionRenderer;
    private SuggestionTask suggestionTask;
    private String lastText;

    public SuggestionPopupTextInputContentListener() {
    }

    public SuggestionPopupTextInputContentListener(SuggestionsProvider<?> suggestionsProvider) {
        this.suggestionsProvider = suggestionsProvider;
    }

    public SuggestionPopupTextInputContentListener setSuggestionsProvider(SuggestionsProvider<?> suggestionsProvider) {
        this.suggestionsProvider = suggestionsProvider;
        return this;
    }

    public SuggestionPopupTextInputContentListener setSuggestionRenderer(ListView.ItemRenderer suggestionRenderer) {
        this.suggestionRenderer = suggestionRenderer;
        return this;
    }

    @Override
    public void textInserted(TextInput textInput, int index, int count) {
        getSuggestions(textInput);
    }

    @Override
    public void textChanged(TextInput textInput) {
//        getSuggestions(textInput);
    }

    @Override
    public void textRemoved(TextInput textInput, int index, int count) {
//        getSuggestions(textInput);
    }


    @SuppressWarnings({"unchecked"})
    private void getSuggestions(final TextInput textInput) {
        final String query = textInput.getText();
        if (query.equals(lastText)) {
            return;
        }
        lastText = query;
        if (suggestionTask != null) {
            if (suggestionTask.query.equals(query)) {
                return;
            }
            if (suggestionTask.isPending()) {
                suggestionTask.abort();
            }
        }
        suggestionTask = new SuggestionTask(query);
        suggestionTask.execute(new TaskAdapter(new TaskListener() {
            @Override
            public void taskExecuted(Task task) {
                if (task == suggestionTask) {
                    List<?> suggestions = (List<?>) suggestionTask.getResult();
                    if (suggestions == null || suggestions.isEmpty()) {
                        if (suggestionPopup != null) {
                            suggestionPopup.close();
                        }
                    } else {
                        if (suggestionPopup == null) {
                            suggestionPopup = new SuggestionPopup();
                        }
                        if (suggestionRenderer != null) {
                            suggestionPopup.setSuggestionRenderer(suggestionRenderer);
                        }
                        suggestionPopup.setSuggestionData(suggestions);
                        suggestionPopup.open(textInput, new SuggestionPopupCloseListener() {
                            @Override
                            public void suggestionPopupClosed(SuggestionPopup suggestionPopup) {
                                if (suggestionPopup.getResult()) {
                                    ApplicationContext.queueCallback(new Runnable() {
                                        @Override public void run() {
                                            String text = textInput.getText();
                                            suggestionsProvider.accepted(text);
                                        }
                                    });
                                }
                            }
                        });
                    }
                    suggestionTask = null;
                }
            }

            @Override
            public void executeFailed(Task task) {
                if (task == suggestionTask) {
                    suggestionsProvider.executeGetSuggestionsFailed(query, task.getFault());
                    suggestionTask = null;
                }
            }
        }));
    }

    private class SuggestionTask extends Task {
        private final String query;

        public SuggestionTask(String query) {
            this.query = query;
        }

        @Override
        public final List execute() throws TaskExecutionException {
            if (abort) {
                throw new AbortException();
            }
            try {
                Thread.sleep(100);
            } catch (InterruptedException ex) {
                throw new AbortException();
            }
            try {
                if (abort) {
                    throw new AbortException();
                }
                return suggestionsProvider.getSuggestions(query);
            } catch (Exception ex) {
                throw new TaskExecutionException("error getting suggestions for " + query, ex);
            }
        }
    }
}
