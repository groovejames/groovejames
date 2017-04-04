package groovejames.service;

import groovejames.model.Song;
import org.junit.Assert;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class FilenameSchemaParserTest {

    @Test
    public void testParse() {
        FilenameSchemeParser parser = new FilenameSchemeParser();

        Song song = new Song();
        song.setArtistName("Beck");
        song.setAlbumName("Odelay");
        song.setSongName("Devil's Haircut");

        assertEquals("foo", parser.parse(song, "foo"));
        assertEquals("foo?", parser.parse(song, "foo?"));
        assertEquals("foo?bar", parser.parse(song, "foo?bar"));

        assertEquals("Beck", parser.parse(song, "<Artist>"));
        assertEquals("Beck".toLowerCase(), parser.parse(song, "<artist>"));
        assertEquals("Beck".toUpperCase(), parser.parse(song, "<ARTIST>"));

        assertEquals("Odelay", parser.parse(song, "<Album>"));
        assertEquals("Odelay".toLowerCase(), parser.parse(song, "<album>"));
        assertEquals("Odelay".toUpperCase(), parser.parse(song, "<ALBUM>"));

        assertEquals("Devil's Haircut", parser.parse(song, "<Title>"));
        assertEquals("Devil's Haircut".toLowerCase(), parser.parse(song, "<title>"));
        assertEquals("Devil's Haircut".toUpperCase(), parser.parse(song, "<TITLE>"));

        song.setTrackNum(20);
        assertEquals("20", parser.parse(song, "<#>"));
        assertEquals("0020", parser.parse(song, "<####>"));
        assertEquals("", parser.parse(song, "<#?>"));
        assertEquals("foo", parser.parse(song, "<#?foo>"));
        assertEquals("Beck", parser.parse(song, "<#?<Artist>>"));
        assertEquals("0020", parser.parse(song, "<#?<####>>"));
        assertEquals("Beck", parser.parse(song, "<####?<####?<Artist>>>"));

        song.setTrackNum(null);
        assertEquals("", parser.parse(song, "<#>"));
        assertEquals("", parser.parse(song, "<####>"));
        assertEquals("", parser.parse(song, "<#?>"));
        assertEquals("", parser.parse(song, "<#?foo>"));
        assertEquals("", parser.parse(song, "<#?<Artist>>"));
        assertEquals("", parser.parse(song, "<#?<####>>"));
        assertEquals("", parser.parse(song, "<####?<####?<Artist>>>"));

        assertEquals("?Beck", parser.parse(song, "<Artist??<Artist>>"));
        assertEquals("Beck?", parser.parse(song, "<Artist?<Artist>?>"));
        assertEquals("?Beck?", parser.parse(song, "<Artist??<Artist>?>"));

        assertEquals("BeckOdelay", parser.parse(song, "<Artist><Album>"));
        assertEquals("Beck - Odelay - Devil's Haircut", parser.parse(song, "<Artist> - <Album> - <Title>"));
        assertEquals("Beck/Odelay/Devil's Haircut", parser.parse(song, "<Artist>/<Album>/<Title>"));

        song.setAlbumName(null);
        song.setTrackNum(20);
        assertEquals("Beck//Devil's Haircut", parser.parse(song, "<Artist>/<Album>/<Title>"));
        assertEquals("Beck/Devil's Haircut", parser.parse(song, "<Artist><Album?/<Album>>/<Title>"));
        assertEquals("foo\\bar\\baz\\Beck/Devil's Haircut", parser.parse(song, "foo\\bar\\baz\\<Artist><Album?/<Album>>/<Title>"));
        assertEquals("Beck/020 - Devil's Haircut", parser.parse(song, "<Artist><Album?/<Album>>/<###?<###> - ><Title>"));

        assertIllegalArgumentException("scheme may not be empty", song, "");
        assertIllegalArgumentException("unbalanced < >", song, "<");
        assertIllegalArgumentException("invalid sequence: <>", song, "<>");
        assertIllegalArgumentException("invalid sequence: <?", song, "<?>");
        assertIllegalArgumentException("unknown tag: foo", song, "<foo>");
        assertIllegalArgumentException("invalid sequence: <?", song, "<?foo>");
        assertIllegalArgumentException("unknown tag: t", song, "<t?>");
        assertIllegalArgumentException("unknown tag: t", song, "<t?foo>");
        assertIllegalArgumentException("unknown tag: t", song, "<t?<foo>>");
        assertIllegalArgumentException("unbalanced < >", song, "<artist> > <title>.mp3");
        assertIllegalArgumentException("unbalanced < >", song, "<title?<foo>");
        assertIllegalArgumentException("unknown tag: foo", song, "<title?<foo>>");
        assertIllegalArgumentException("unknown tag: ##.###", song, "<##.###>");
        assertIllegalArgumentException("unknown tag: aLbuM", song, "<aLbuM>");

        // the parser must evaluate "?<foo>" even though album is null:
        song.setAlbumName(null);
        assertIllegalArgumentException("unknown tag: foo", song, "<album?<foo>>");
        assertIllegalArgumentException("unknown tag: foo", song, "<album?<album?<foo>>>");

        song.setArtistName("Beck");
        song.setAlbumName("Odelay");
        song.setSongName("Devil's Haircut");
        song.setTrackNum(1);
        assertEquals("Beck/Odelay/01 - Devil's Haircut", parser.parse(song, FilenameSchemeParser.DEFAULT_FILENAME_SCHEME));

        song.setArtistName(null);
        song.setAlbumName("");
        song.setTrackNum(1);
        assertEquals("01 - Devil's Haircut", parser.parse(song, FilenameSchemeParser.DEFAULT_FILENAME_SCHEME));
    }


    private static void assertIllegalArgumentException(String expectedExceptionMessage, Song song, String illegalFilenameScheme) {
        try {
            String result = new FilenameSchemeParser().parse(song, illegalFilenameScheme);
            Assert.fail("expected IllegalArgumentException, got: " + str(result));
        } catch (IllegalArgumentException expected) {
            assertEquals(expectedExceptionMessage, expected.getMessage());
        }
    }

    private static String str(String s) {
        return s == null ? "null" : "\"" + s + "\"";
    }

}
