package groovejames.gui.components;

import org.apache.pivot.collections.List;
import org.apache.pivot.collections.ListListener;
import org.apache.pivot.collections.Sequence;

/**
 * Simple ListListener which reacts to items inserted/removed/cleared events,
 * but not to updated events.
 */
public abstract class ListChangedListener<T> extends ListListener.Adapter<T> {

    public abstract void listChanged(List<T> list);

    @Override
    public void itemInserted(List<T> list, int index) {
        listChanged(list);
    }

    @Override
    public void itemsRemoved(List<T> list, int index, Sequence<T> items) {
        listChanged(list);
    }

    @Override
    public void listCleared(List<T> list) {
        listChanged(list);
    }

}
