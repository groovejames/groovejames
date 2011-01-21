package groovejames.model;

public class Country {

    // used in com/grooveshark/jsonrpc/TokenizedJSONService.as:
    // country: {ID:223, CC1:"0", CC2:"0", CC3:"0", CC4:"2147483648"}
    public static final Country GSLITE_DEFAULT_COUNTRY = new Country("223", "", "0", "0", "0", "2147483648");

    // used at runtime (german locale):
    // country:{"ID":"55","CC3":"0","IPR":"10174","CC1":"18014398509481984","CC2":"0","CC4":"0"}
    public static final Country GSLITE_GERMAN_COUNTRY = new Country("55", "10174", "18014398509481984", "0", "0", "0");

    private String ID;
    private String IPR;
    private String CC1;
    private String CC2;
    private String CC3;
    private String CC4;

    public Country() {
    }

    public Country(String ID, String IPR, String CC1, String CC2, String CC3, String CC4) {
        this.ID = ID;
        this.IPR = IPR;
        this.CC1 = CC1;
        this.CC2 = CC2;
        this.CC3 = CC3;
        this.CC4 = CC4;
    }

    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public String getIPR() {
        return IPR;
    }

    public void setIPR(String IPR) {
        this.IPR = IPR;
    }

    public String getCC1() {
        return CC1;
    }

    public void setCC1(String CC1) {
        this.CC1 = CC1;
    }

    public String getCC2() {
        return CC2;
    }

    public void setCC2(String CC2) {
        this.CC2 = CC2;
    }

    public String getCC3() {
        return CC3;
    }

    public void setCC3(String CC3) {
        this.CC3 = CC3;
    }

    public String getCC4() {
        return CC4;
    }

    public void setCC4(String CC4) {
        this.CC4 = CC4;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Country");
        sb.append("{ID='").append(ID).append('\'');
        sb.append(", IPR='").append(IPR).append('\'');
        sb.append(", CC1='").append(CC1).append('\'');
        sb.append(", CC2='").append(CC2).append('\'');
        sb.append(", CC3='").append(CC3).append('\'');
        sb.append(", CC4='").append(CC4).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
