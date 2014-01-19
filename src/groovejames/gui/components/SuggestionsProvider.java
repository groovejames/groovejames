package groovejames.gui.components;

import org.apache.pivot.collections.List;

public interface SuggestionsProvider<V> {

    List<V> getSuggestions(String query) throws Exception;

    void accepted(String text);

    void executeGetSuggestionsFailed(String query, Throwable exception);

    public static abstract class Adapter<V> implements SuggestionsProvider<V> {
        @Override public void accepted(String text) {
        }

        @Override public void executeGetSuggestionsFailed(String query, Throwable exception) {
        }
    }
}
