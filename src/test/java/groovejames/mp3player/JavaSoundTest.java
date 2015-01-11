package groovejames.mp3player;

import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Line;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.Mixer;

public class JavaSoundTest {

    public static void main(String[] args) throws LineUnavailableException {
        for (Mixer.Info mixerInfo : AudioSystem.getMixerInfo()) {
            Mixer mixer = AudioSystem.getMixer(mixerInfo);
            System.out.printf("Mixer %s:", mixer.getMixerInfo());
            try {
                mixer.open();
                System.out.println();
            } catch (LineUnavailableException ex) {
                System.out.printf(" UNAVAILABLE%n");
                continue;
            }
            for (Line.Info lineInfo : mixer.getSourceLineInfo()) {
                System.out.printf("  Source Line %s%n", lineInfo);
            }
            for (Line.Info lineInfo : mixer.getTargetLineInfo()) {
                System.out.printf("  Target Line %s%n", lineInfo);
            }
        }
    }

}
