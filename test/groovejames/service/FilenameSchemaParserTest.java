package groovejames.service;

import groovejames.model.Song;

public class FilenameSchemaParserTest /* extends TestCase */ {
    public void testParse() {
        FilenameSchemeParser parser = new FilenameSchemeParser();

        Song song = new Song();
        song.setArtistName("Beck");
        song.setAlbumName("Odelay");
        song.setName("Devil's Haircut");

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

        song.setTrackNum(20L);
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
        assertEquals("foo", parser.parse(song, "<#?foo>"));
        assertEquals("Beck", parser.parse(song, "<#?<Artist>>"));
        assertEquals("", parser.parse(song, "<#?<####>>"));
        assertEquals("Beck", parser.parse(song, "<####?<####?<Artist>>>"));

        assertEquals("?Beck", parser.parse(song, "<Artist??<Artist>>"));
        assertEquals("Beck?", parser.parse(song, "<Artist?<Artist>?>"));
        assertEquals("?Beck?", parser.parse(song, "<Artist??<Artist>?>"));

        assertEquals("BeckOdelay", parser.parse(song, "<Artist><Album>"));
        assertEquals("Beck - Odelay - Devil's Haircut.mp3", parser.parse(song, "<Artist> - <Album> - <Title>.mp3"));
        assertEquals("Beck/Odelay/Devil's Haircut.mp3", parser.parse(song, "<Artist>/<Album>/<Title>.mp3"));

        song.setAlbumName(null);
        song.setTrackNum(20L);
        assertEquals("Beck//Devil's Haircut.mp3", parser.parse(song, "<Artist>/<Album>/<Title>.mp3"));
        assertEquals("Beck/Devil's Haircut.mp3", parser.parse(song, "<Artist><Album?/<Album>>/<Title>.mp3"));
        assertEquals("foo\\bar\\baz\\Beck/Devil's Haircut.mp3", parser.parse(song, "foo\\bar\\baz\\<Artist><Album?/<Album>>/<Title>.mp3"));
        assertEquals("Beck/020 - Devil's Haircut.mp3", parser.parse(song, "<Artist><Album?/<Album>>/<###?<###> - ><Title>.mp3"));

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
        song.setName("Devil's Haircut");
        song.setTrackNum(1L);
        assertEquals("Beck/Odelay/01 - Devil's Haircut.mp3", parser.parse(song, FilenameSchemeParser.DEFAULT_FILENAME_SCHEME));

        song.setArtistName(null);
        song.setAlbumName("");
        song.setTrackNum(1L);
        assertEquals("01 - Devil's Haircut.mp3", parser.parse(song, FilenameSchemeParser.DEFAULT_FILENAME_SCHEME));
    }


    private static void assertIllegalArgumentException(String expectedExceptionMessage, Song song, String illegalFilenameScheme) {
        try {
            String result = new FilenameSchemeParser().parse(song, illegalFilenameScheme);
            throw new AssertionError("expected IllegalArgumentException, got: " + str(result));
        }
        catch (IllegalArgumentException expected) {
            assertEquals(expectedExceptionMessage, expected.getMessage());
        }
    }

    private static void assertEquals(String expected, String actual) {
        if (expected == null) {
            if (actual != null)
                throw new AssertionError("expected: null, got: " + str(actual));
        } else if (!expected.equals(actual)) {
            throw new AssertionError("expected: " + str(expected) + ", got: " + str(actual));
        }
    }

    private static String str(String s) {
        return s == null ? "null" : "\"" + s + "\"";
    }

    public static void main(String[] args) {
        new FilenameSchemaParserTest().testParse();
    }
}
