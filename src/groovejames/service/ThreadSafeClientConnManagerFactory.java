package groovejames.service;

import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.ClientConnectionManagerFactory;
import org.apache.http.conn.params.ConnManagerParams;
import org.apache.http.conn.params.ConnPerRouteBean;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.params.HttpParams;

public class ThreadSafeClientConnManagerFactory implements ClientConnectionManagerFactory {
    @Override
    public ClientConnectionManager newInstance(HttpParams params, SchemeRegistry schemeRegistry) {
        // Increase max total connection to 200
        ConnManagerParams.setMaxTotalConnections(params, 200);

        // Increase default max connection per route to 200
        ConnPerRouteBean connPerRoute = new ConnPerRouteBean(200);
        ConnManagerParams.setMaxConnectionsPerRoute(params, connPerRoute);

        return new ThreadSafeClientConnManager(params, schemeRegistry);
    }
}
