package groovejames.service.netease;

import com.mashape.unirest.http.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;

class JacksonObjectMapper implements ObjectMapper {

    private static final Logger log = LoggerFactory.getLogger(JacksonObjectMapper.class);

    private final com.fasterxml.jackson.databind.ObjectMapper jacksonObjectMapper;

    public JacksonObjectMapper() {
        jacksonObjectMapper = new com.fasterxml.jackson.databind.ObjectMapper()
                .disable(FAIL_ON_UNKNOWN_PROPERTIES);
    }

    public <T> T readValue(String value, Class<T> valueType) {
        try {
            log.debug("got: {}", value);
            log.debug("converting to {} ...", valueType);
            return jacksonObjectMapper.readValue(value, valueType);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String writeValue(Object value) {
        try {
            String string = jacksonObjectMapper.writeValueAsString(value);
            log.debug("write: {}", string);
            return string;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
