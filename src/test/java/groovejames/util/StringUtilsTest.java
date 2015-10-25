package groovejames.util;

import org.junit.Test;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;

public class StringUtilsTest {

    @Test
    public void testReverse() {
        assertEquals("", StringUtils.reverse(""));
        assertEquals("a", StringUtils.reverse("a"));
        assertEquals("dcba", StringUtils.reverse("abcd"));
    }

    @Test
    public void testBytesToHex() {
        byte[] bytes = {2, 54, -1, -10, -128, 127, -127, 0, 1};
        String hex = "0236fff6807f810001";
        assertEquals(hex, StringUtils.bytesToHexString(bytes));
        assertArrayEquals(bytes, StringUtils.hexStringToBytes(hex));
    }

}
