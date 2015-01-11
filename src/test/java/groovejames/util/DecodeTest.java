package groovejames.util;

public class DecodeTest {

    public static void main(String[] args) {
        assertEquals("Kid Creole & The Coconuts/_/Annie, I'm Not Your Daddy",
            Util.urldecode("Kid%2BCreole%2B%2526%2BThe%2BCoconuts/_/Annie%2C+I%27m+Not+Your+Daddy"));
    }

    private static void assertEquals(String expected, String s) {
        if (expected == null && s != null)
            throw new AssertionError("expected: null, got: \"" + s + "\"");
        else if (expected != null && s == null)
            throw new AssertionError("expected: \"" + expected + "\", got: null");
        else if (expected != null && !expected.equals(s))
            throw new AssertionError("expected: \"" + expected + "\", got: \"" + s + "\"");
    }

}
