package groovejames.service;

public class ProxySettings {

    private String host;
    private int port;

    public ProxySettings() {
    }

    public ProxySettings(String host, int port) {
        if (host == null)
            throw new IllegalArgumentException("host may not be null");
        this.host = host;
        this.port = port;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProxySettings that = (ProxySettings) o;
        return port == that.port && !(host != null ? !host.equals(that.host) : that.host != null);
    }

    @Override
    public int hashCode() {
        int result = host != null ? host.hashCode() : 0;
        result = 31 * result + port;
        return result;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("ProxySettings");
        sb.append("{host='").append(host).append('\'');
        sb.append(", port=").append(port);
        sb.append('}');
        return sb.toString();
    }
}
