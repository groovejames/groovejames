package groovejames.gui;

import groovejames.gui.components.MeterTableCellRenderer;
import groovejames.model.Track;
import org.apache.pivot.wtk.TableView;

import java.awt.Color;

public class DownloadProgressTableCellRenderer extends MeterTableCellRenderer {

    private Color defaultMeterColor;

    public DownloadProgressTableCellRenderer() {
        super();
        defaultMeterColor = (Color) meter.getStyles().get("color");
        meter.setPreferredHeight(-1);
    }

    @Override
    public void render(Object row, int rowIndex, int columnIndex,
                       TableView tableView, String columnName,
                       boolean selected, boolean highlighted, boolean disabled) {
        super.setStyles(tableView, rowIndex, selected, highlighted);

        Color foregroundColor = defaultMeterColor;
        double percentage = 0.0;
        String text = "";

        if (row != null) {
            Track track = (Track) row;
            Double downloadRate = track.getDownloadRate();
            percentage = track.getProgress();
            switch (track.getStatus()) {
                case INITIALIZING:
                    text = "initializing...";
                    break;
                case QUEUED:
                    text = "waiting...";
                    break;
                case DOWNLOADING:
                    if (downloadRate != null) {
                        text = String.format("%%%1.0f, %d of %d kB, %1.0f kB/s",
                                track.getProgress() * 100.0,
                                track.getDownloadedBytes() / 1024,
                                track.getTotalBytes() / 1024,
                                downloadRate / 1024);
                    } else {
                        text = String.format("%%%1.0f, %d kB",
                                track.getProgress() * 100.0,
                                track.getTotalBytes() / 1024);
                    }
                    break;
                case FINISHED:
                    foregroundColor = Color.GREEN.darker().darker();
                    downloadRate = track.getDownloadRate();
                    if (downloadRate != null) {
                        text = String.format("%d kB, %1.0f kB/s",
                                track.getDownloadedBytes() / 1024,
                                downloadRate / 1024);
                    } else {
                        text = String.format("%d kB",
                                track.getDownloadedBytes() / 1024);
                    }
                    break;
                case CANCELLED:
                    text = "cancelled";
                    foregroundColor = Color.ORANGE.darker().darker();
                    break;
                case ERROR:
                    text = "Error";
                    foregroundColor = Color.RED.darker().darker();
                    percentage = 1.0;
                    break;
            }
        }

        meter.setText(text);
        meter.setPercentage(percentage);
        meter.getStyles().put("color", foregroundColor);
    }

    @Override
    public String toString(Object row, String columnName) {
        return null;
    }
}
