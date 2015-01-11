package groovejames.gui.validation;

import groovejames.model.Song;
import groovejames.service.FilenameSchemeParser;
import org.apache.pivot.wtk.validation.Validator;

public class FilenameSchemeTextValidator implements Validator {

  private static final FilenameSchemeParser filenameSchemeParser = new FilenameSchemeParser();
  private static final Song testSong = new Song();

  static {
    testSong.setTrackNum(2L);
    testSong.setArtistName("King Tubby");
    testSong.setAlbumName("Declaration of Dub");
    testSong.setName("African Roots");
  }

  @Override
  public boolean isValid(String filenameScheme) {
    return getErrorText(filenameScheme) == null;
  }

  public String getErrorText(String filenameScheme) {
    try {
      filenameSchemeParser.parse(testSong, filenameScheme);
      return null;
    } catch (IllegalArgumentException ex) {
      return ex.getMessage();
    }
  }
}
