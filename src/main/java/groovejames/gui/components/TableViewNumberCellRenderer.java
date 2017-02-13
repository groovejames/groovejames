package groovejames.gui.components;

import org.apache.pivot.json.JSON;

public class TableViewNumberCellRenderer extends org.apache.pivot.wtk.content.TableViewNumberCellRenderer {

    protected Double factor;

    public Double getFactor() {
        return factor;
    }

    public void setFactor(Double factor) {
        this.factor = factor;
    }

    @Override
    public String toString(Object row, String columnName) {
        Number cellData = JSON.get(row, columnName);
        if (cellData == null) return null;
        if (factor == null) return getNumberFormat().format(cellData);
        double scaledValue = cellData.doubleValue() / factor;
        return getNumberFormat().format(scaledValue);
    }

}
