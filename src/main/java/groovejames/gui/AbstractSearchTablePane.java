package groovejames.gui;

import groovejames.model.BaseModelObject;
import groovejames.model.SearchResult;
import groovejames.service.search.SearchParameter;
import org.apache.pivot.beans.BXML;
import org.apache.pivot.beans.Bindable;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.Label;
import org.apache.pivot.wtk.LinkButton;
import org.apache.pivot.wtk.TablePane;

abstract class AbstractSearchTablePane<V extends BaseModelObject> extends TablePane implements Bindable, CardPaneContent<V> {

    protected CardPaneWrapper cardPane;
    protected SearchParameter searchParameter;

    @BXML protected Label countText;
    @BXML protected LinkButton moreLink;

    @Override
    public void setCardPane(CardPaneWrapper cardPane) {
        this.cardPane = cardPane;
    }

    @Override
    public void setSearchParameter(SearchParameter searchParameter) {
        this.searchParameter = searchParameter;
    }

    @Override
    public void afterLoad() {
        updateCountTextAndMoreLink(null);
    }

    protected void updateCountTextAndMoreLink(SearchResult<?> searchResult) {
        if (countText == null || moreLink == null) return;
        if (searchResult == null) {
            countText.setText("Searching...");
            moreLink.setVisible(false);
            return;
        }
        int currentCount = searchParameter.getOffset() + searchResult.getResult().length;
        if (searchResult.isTotalUnknown()) {
            if (searchResult.hasMore()) {
                countText.setText("" + currentCount);
                moreLink.setVisible(true);
                moreLink.setAction(new MoreAction());
                searchParameter.setOffset(currentCount);
            } else if (currentCount == 0) {
                countText.setText("No results.");
                moreLink.setVisible(false);
            } else {
                countText.setText("Total: " + currentCount);
                moreLink.setVisible(false);
            }
        } else {
            int total = searchResult.getTotal();
            if (total == 0) {
                countText.setText("No results.");
                moreLink.setVisible(false);
            } else if (currentCount >= total) {
                countText.setText("Total: " + currentCount);
                moreLink.setVisible(false);
            } else {
                countText.setText("" + currentCount + " of " + total);
                moreLink.setVisible(true);
                moreLink.setAction(new MoreAction());
                searchParameter.setOffset(currentCount);
            }
        }
    }

    private class MoreAction extends Action {
        @Override
        public void perform(Component source) {
            cardPane.search();
        }
    }
}
