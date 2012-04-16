package groovejames.model;

public class Country {

    // used in com/grooveshark/jsonrpc/TokenizedJSONService.as:
    // country: {"ID":223, "IPR":0, "CC1":0, "CC2":0, "CC3":0, "CC4":1073741824, "DMA":501}
    public static final Country DEFAULT_COUNTRY = new Country(223, 0, 0, 0, 0, 1073741824, 501);

    // used at runtime (german locale):
    // country:{"ID":55, "IPR":10174, "CC1":18014398509481984, "CC2":0, "CC3":0, "CC4":0, "DMA":0}
    public static final Country GERMAN_COUNTRY = new Country(55, 10174, 18014398509481984L, 0, 0, 0, 0);

    private long ID;
    private long IPR;
    private long CC1;
    private long CC2;
    private long CC3;
    private long CC4;
    private long DMA;

    public Country() {
    }

    public Country(long ID, long IPR, long CC1, long CC2, long CC3, long CC4, long DMA) {
        this.ID = ID;
        this.IPR = IPR;
        this.CC1 = CC1;
        this.CC2 = CC2;
        this.CC3 = CC3;
        this.CC4 = CC4;
        this.DMA = DMA;
    }

    public long getID() {
        return ID;
    }

    public void setID(long ID) {
        this.ID = ID;
    }

    public long getIPR() {
        return IPR;
    }

    public void setIPR(long IPR) {
        this.IPR = IPR;
    }

    public long getCC1() {
        return CC1;
    }

    public void setCC1(long CC1) {
        this.CC1 = CC1;
    }

    public long getCC2() {
        return CC2;
    }

    public void setCC2(long CC2) {
        this.CC2 = CC2;
    }

    public long getCC3() {
        return CC3;
    }

    public void setCC3(long CC3) {
        this.CC3 = CC3;
    }

    public long getCC4() {
        return CC4;
    }

    public void setCC4(long CC4) {
        this.CC4 = CC4;
    }

    public long getDMA() {
        return DMA;
    }

    public void setDMA(long DMA) {
        this.DMA = DMA;
    }

    @Override
    public String toString() {
        return new StringBuilder("Country")
            .append("{ID=").append(ID)
            .append(", IPR=").append(IPR)
            .append(", CC1=").append(CC1)
            .append(", CC2=").append(CC2)
            .append(", CC3=").append(CC3)
            .append(", CC4=").append(CC4)
            .append(", DMA=").append(DMA)
            .append('}').toString();
    }
}
