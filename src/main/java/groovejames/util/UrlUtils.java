package groovejames.util;

import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UrlUtils {

    private static final Pattern QUERY_PARAM_PATTERN = Pattern.compile("([^&=]+)=?([^&=]+)?");

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

    /**
     * strip path and query from url so that only protocol, userinfo,
     * host and port remains (that is, the "authority").
     *
     * @return stripped url or {@code null} if the given url is malformed
     */
    public static String getBaseUrl(String url) {
        if (url == null) return null;
        try {
            URL u = new URL(url);
            return u.getProtocol() + "://" + u.getAuthority();
        } catch (MalformedURLException e) {
            return null;
        }
    }

    public static Map<String, List<String>> parseQueryParams(String uri) throws URISyntaxException {
        URI u = new URI(uri);
        return parseQueryParams(u);
    }

    public static Map<String, List<String>> parseQueryParams(URI uri) {
        String query = uri.getRawQuery();
        Map<String, List<String>> params = new HashMap<>();
        Matcher m = QUERY_PARAM_PATTERN.matcher(query);
        while (m.find()) {
            String name = urldecode(m.group(1));
            String value = m.groupCount() > 1 ? urldecode(m.group(2)) : null;
            List<String> values = params.get(name);
            if (values == null) {
                values = new LinkedList<>();
                params.put(name, values);
            }
            if (value != null) {
                values.add(value);
            }
        }
        return params;
    }
}
