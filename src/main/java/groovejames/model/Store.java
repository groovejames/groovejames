package groovejames.model;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public interface Store {

    // return a new instance of an OutputStream to write the store contents to
    OutputStream getOutputStream() throws IOException;

    // return a new instance of an InputStream to read the store contents
    InputStream getInputStream() throws IOException;

    void writeTrackInfo(Track track) throws IOException;

    void deleteStore();

    String getDescription();

    boolean isSameLocation(Store other);
}
