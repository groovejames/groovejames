package groovejames.service.netease;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mashape.unirest.http.ObjectMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;

import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;

class JacksonObjectMapper implements ObjectMapper {

    private static final Log log = LogFactory.getLog(JacksonObjectMapper.class);

    private final com.fasterxml.jackson.databind.ObjectMapper jacksonObjectMapper;

    public JacksonObjectMapper() {
        jacksonObjectMapper = new com.fasterxml.jackson.databind.ObjectMapper()
                .disable(FAIL_ON_UNKNOWN_PROPERTIES);
    }

    public <T> T readValue(String value, Class<T> valueType) {
        try {
            log.debug("got: " + value);
            log.debug("converting to " + valueType + " ...");
            return jacksonObjectMapper.readValue(value, valueType);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String writeValue(Object value) {
        try {
            return jacksonObjectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
