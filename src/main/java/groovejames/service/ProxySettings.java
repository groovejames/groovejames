package groovejames.service;

import java.util.Objects;

public class ProxySettings implements Comparable<ProxySettings> {

    private final String host;
    private final int port;

    public ProxySettings(String host, int port) {
        if (host == null)
            throw new IllegalArgumentException("host may not be null");
        this.host = host;
        this.port = port;
    }

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (!(o instanceof ProxySettings)) return false;
        ProxySettings that = (ProxySettings) o;
        return port == that.port && Objects.equals(host, that.host);
    }

    @Override
    public int hashCode() {
        return Objects.hash(host, port);
    }

    @Override
    public String toString() {
        return String.format("%s:%d", host, port);
    }

    @Override
    public int compareTo(ProxySettings other) {
        return this.toString().compareTo(other.toString());
    }
}
