package groovejames.util;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class UrlUtilsTests {

    @Test
    public void testUrlDecode() {
        assertEquals("Kid Creole & The Coconuts/_/Annie, I'm Not Your Daddy",
            UrlUtils.urldecode("Kid%2BCreole%2B%2526%2BThe%2BCoconuts/_/Annie%2C+I%27m+Not+Your+Daddy"));
    }

}
