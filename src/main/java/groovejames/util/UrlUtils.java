package groovejames.util;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URIBuilder;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class UrlUtils {

    public static String urlencode(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8");
        } catch (UnsupportedEncodingException ex) {
            throw new RuntimeException("value: " + s, ex);
        }
    }

    public static String urldecode(String s) {
        String r = s, p = null;
        while (!r.equals(p)) {
            p = r;
            try {
                r = URLDecoder.decode(r, "UTF-8");
            } catch (UnsupportedEncodingException ex) {
                throw new RuntimeException("value: " + r, ex);
            }
        }
        return r;
    }

    public static Map<String, List<String>> parseQueryParams(String uri) throws URISyntaxException {
        List<NameValuePair> queryParams = new URIBuilder(uri).getQueryParams();
        Map<String, List<String>> params = new HashMap<>();
        for (NameValuePair queryParam : queryParams) {
            List<String> values = params.get(queryParam.getName());
            if (values == null) {
                values = new LinkedList<>();
                params.put(queryParam.getName(), values);
            }
            if (queryParam.getValue() != null) {
                values.add(queryParam.getValue());
            }
        }
        return params;
    }

}
