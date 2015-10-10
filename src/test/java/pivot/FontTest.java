package pivot;

import java.awt.Font;
import java.awt.GraphicsEnvironment;

/**
 * prints all fonts which are capable of displaying chinese characters
 */
public class FontTest {

    public static void main(String[] args) {
        for (String fn : GraphicsEnvironment.getLocalGraphicsEnvironment().getAvailableFontFamilyNames()) {
            Font f = Font.decode(fn + "-plain-12");
            if (f.canDisplayUpTo("才洲少年") == -1)
                System.out.println(f);
        }
    }

}
