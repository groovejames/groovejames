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
public class SuggestionPopupTextInputContentListener<V> extends TextInputContentListener.Adapter {

    private final SuggestionsProvider<V> suggestionsProvider;
    private final SuggestionPopup suggestionPopup;
    private SuggestionTask suggestionTask;
    private String lastText;

    public SuggestionPopupTextInputContentListener(SuggestionsProvider<V> suggestionsProvider) {
        this(suggestionsProvider, null);
    }

    public SuggestionPopupTextInputContentListener(SuggestionsProvider<V> suggestionsProvider, ListView.ItemRenderer suggestionRenderer) {
        if (suggestionsProvider == null) {
            throw new IllegalArgumentException("suggestionsProvider may not be null");
        }
        this.suggestionsProvider = suggestionsProvider;
        this.suggestionPopup = new SuggestionPopup();
        if (suggestionRenderer != null) {
            this.suggestionPopup.setSuggestionRenderer(suggestionRenderer);
        }
    }

    public SuggestionPopup getSuggestionPopup() {
        return suggestionPopup;
    }

    public void closeSuggestionPopup() {
        if (suggestionTask != null) {
            suggestionTask.abort();
        }
        suggestionPopup.close();
    }

    @Override
    public void textInserted(TextInput textInput, int index, int count) {
        getSuggestions(textInput);
    }

    @Override
    public void textChanged(TextInput textInput) {
        //getSuggestions(textInput);
    }

    @Override
    public void textRemoved(TextInput textInput, int index, int count) {
        getSuggestions(textInput);
    }

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
        suggestionTask.execute(new TaskAdapter<>(new TaskListener<List<V>>() {
            @Override
            public void taskExecuted(Task<List<V>> task) {
                if (task == suggestionTask) {
                    List<V> suggestions = suggestionTask.getResult();
                    if (suggestions == null || suggestions.isEmpty()) {
                        suggestionPopup.close();
                    } else {
                        suggestionPopup.setSuggestionData(suggestions);
                        suggestionPopup.open(textInput, new SuggestionPopupCloseListener() {
                            @Override
                            public void suggestionPopupClosed(final SuggestionPopup suggestionPopup) {
                                if (suggestionPopup.getResult()) {
                                    ApplicationContext.queueCallback(new Runnable() {
                                        @Override
                                        @SuppressWarnings("unchecked")
                                        public void run() {
                                            String text = textInput.getText();
                                            V selectedSuggestion = (V) suggestionPopup.getSelectedSuggestion();
                                            suggestionsProvider.accepted(text, selectedSuggestion);
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

    private class SuggestionTask extends Task<List<V>> {
        private final String query;

        public SuggestionTask(String query) {
            this.query = query;
        }

        @Override
        public final List<V> execute() throws TaskExecutionException {
            if (abort) {
                throw new AbortException();
            }
            try {
                List<V> suggestions = suggestionsProvider.getSuggestions(query);
                return abort ? null : suggestions;
            } catch (Exception ex) {
                throw new TaskExecutionException("error getting suggestions for " + query, ex);
            }
        }
    }
}
