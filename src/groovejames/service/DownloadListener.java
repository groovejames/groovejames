package groovejames.service;

import groovejames.model.Track;

public interface DownloadListener {
    void statusChanged(Track track);

    void downloadedBytesChanged(Track track);
}
