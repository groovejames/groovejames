package groovejames.service;

import groovejames.model.Track;

public interface PlayServiceListener extends DownloadListener {
    void playbackStarted(Track track);

    void playbackFinished(Track track);

    void positionChanged(Track track, int audioPosition);

    void exception(Track track, Exception ex);
}
