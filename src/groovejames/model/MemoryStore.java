package groovejames.model;

import groovejames.util.ByteBuffer;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class MemoryStore implements Store {
    private final String description;
    private final ByteBuffer buf = new ByteBuffer(2 * 1024 * 1024);

    public MemoryStore(String description) {
        this.description = description;
    }

    @Override public OutputStream getOutputStream() throws IOException {
        return buf;
    }

    @Override public InputStream getInputStream() throws IOException {
        return buf.getInputStream();
    }

    @Override public void writeTrackInfo(Track track) {
    }

    @Override public void deleteStore(File downloadDir) {
    }

    @Override public String getDescription() {
        return "mem{" + description + ",size=" + buf.size() + "}";
    }

    @Override public boolean isSameLocation(Store other) {
        return false;
    }
}
