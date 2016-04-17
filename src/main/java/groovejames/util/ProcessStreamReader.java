package groovejames.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

class ProcessStreamReader extends Thread {

    private static final Logger log = LoggerFactory.getLogger(ProcessStreamReader.class);

    private static int instanceNo = 1;

    private final InputStream inputStream;
    private final String cmd;

    public ProcessStreamReader(InputStream inputStream, String cmd) {
        super("processtreamreader-" + (instanceNo++));
        this.inputStream = inputStream;
        this.cmd = cmd;
        setDaemon(true);
    }

    @Override
    public void run() {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        try {
            while ((line = reader.readLine()) != null) {
                if (log.isDebugEnabled()) {
                    log.debug("{}: {}", cmd, line);
                }
            }
        } catch (IOException ex) {
            log.error("error reading from process {}", cmd, ex);
        } finally {
            IOUtils.closeQuietly(reader, "reader for " + cmd);
        }
        log.debug("process {} ends.", cmd);
    }
}
