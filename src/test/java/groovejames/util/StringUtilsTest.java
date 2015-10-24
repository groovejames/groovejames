package groovejames.util;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class StringUtilsTest {

    @Test
    public void testLpad() {
        assertEquals("", StringUtils.lpad("", 'a', 0));
        assertEquals("a", StringUtils.lpad("", 'a', 1));
        assertEquals("b", StringUtils.lpad("b", 'a', 1));
        assertEquals("ab", StringUtils.lpad("b", 'a', 2));
        assertEquals("aab", StringUtils.lpad("b", 'a', 3));
        assertEquals("bbbb", StringUtils.lpad("bbbb", 'a', 0));
        assertEquals("bbbb", StringUtils.lpad("bbbb", 'a', 3));
    }

    @Test
    public void testRepeat() {
        assertEquals("", StringUtils.repeat('0', 0));
        assertEquals("0", StringUtils.repeat('0', 1));
        assertEquals("00", StringUtils.repeat('0', 2));
    }

    @Test
    public void testReverse() {
        assertEquals("", StringUtils.reverse(""));
        assertEquals("a", StringUtils.reverse("a"));
        assertEquals("dcba", StringUtils.reverse("abcd"));
    }

}
