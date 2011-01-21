package groovejames.service;

import java.io.IOException;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;

public class GroovesharkService {

    public static Grooveshark connect(HttpClientService httpClientService) throws IOException {
        InvocationHandler invocationHandler = Boolean.getBoolean("mockNet")
                ? new GroovesharkMock()
                : new GroovesharkProxy(httpClientService);
        return (Grooveshark) Proxy.newProxyInstance(
                GroovesharkService.class.getClassLoader(),
                new Class[]{Grooveshark.class},
                invocationHandler);
    }
}
