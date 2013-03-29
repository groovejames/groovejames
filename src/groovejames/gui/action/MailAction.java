package groovejames.gui.action;

import groovejames.gui.components.AbstractApplication;
import groovejames.model.Song;
import groovejames.service.search.AlbumSearch;
import groovejames.util.Util;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.List;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Alert;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.DesktopApplicationContext;
import org.apache.pivot.wtk.Display;
import org.apache.pivot.wtk.MessageType;
import org.apache.pivot.wtk.TextArea;
import org.apache.pivot.wtk.Window;

import java.awt.Desktop;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Properties;

import static groovejames.util.Util.isEmpty;
import static groovejames.util.Util.urlencode;

public class MailAction extends Action {

    private static final Logger log = LogManager.getLogger(MailAction.class);
    private static final String mailTemplateResourceName = "mail.template.txt";

    private final Window window;
    private final AlbumSearch album;
    private final Sequence<Song> songs;

    public MailAction(Window window, Sequence<Song> songs) {
        this.window = window;
        this.songs = songs;
        this.album = null;
    }

    public MailAction(Window window, AlbumSearch album) {
        this.window = window;
        this.album = album;
        this.songs = null;
    }

    public void perform(Component source) {
        String mailSubject = createMailSubject();
        String mailBody = createMailBody();
        openMailClient(mailSubject, mailBody);
    }

    private String createMailSubject() {
        return "[GrooveJames] song tips from " + System.getProperty("user.name");
    }

    private String createMailBody() {
        InputStream inputStream = MailAction.class.getResourceAsStream(mailTemplateResourceName);
        String mailTemplate = Util.readFully(inputStream, "UTF-8", mailTemplateResourceName);
        boolean singular = album != null || songs.getLength() == 1;

        Properties props = new Properties();
        props.put("username", System.getProperty("user.name"));
        props.put("thisOrThese", singular ? "this" : "these");
        props.put("albumOrSongs", album != null ? "album" : singular ? "song" : "songs");
        props.put("titleList", createTitleList());
        props.put("url", createUrl());
        props.put("it", singular ? "it" : "them");

        return replacePlaceholders(mailTemplate, props);
    }

    private void openMailClient(String mailSubject, String mailBody) {
        try {
            Desktop.getDesktop().mail(toMailUri(mailSubject, mailBody));
        } catch (Exception ex) {
            log.error("error opening mail client", ex);
            alert("Sorry, I tried to open the mail client but it failed. (See log for details).", mailBody);
        }
    }

    private URI toMailUri(String subject, String body) throws URISyntaxException, UnsupportedEncodingException {
        String u = "mailto://?subject=" + urlencode(subject) + "&body=" + urlencode(body);
        URI uri = new URI(u);
        log.debug("created mail uri: " + uri);
        return uri;
    }

    //mailto://?subject=%5BGrooveJames%5D+song+tips+from+dirk&body=Hi%2C+this+is+GrooveJames.%0A%0Adirk+wants+you+to+check+out+this+cool+song%3A%0A%0A++++%22Devil%27s+Haircut+%28track1%29%22+by+Beck%0A%0ATo+hear+it+do+the+following%3A%0A%0A1.+Copy+the+following+link+to+your+clipboard%3A%0A%0A++++groovejames%3A%2F%2Fsong%3Fid%3D1001%26songName%3DDevil%2527s%2BHaircut%2B%2528track1%2529%26autoplay%3Dtrue%0A%0A2.+Start+GrooveJames%0A%0ARegards%2C%0AGrooveJames%0A%0APS%3A+Note+that+you+need+GrooveJames+21+or+higher.
    private void alert(String msg, String mailText) {
        TextArea mailTextArea = new TextArea();
        mailTextArea.setText(mailText);
        mailTextArea.setEditable(false);
        mailTextArea.setPreferredWidth(500);
        Alert alert = new Alert(MessageType.ERROR, msg + " Here's the mail text I tried to create:", null, mailTextArea, true);
        alert.setTitle("Mail error");
        alert.setPreferredWidth(500);
        alert.open(window.getDisplay(), window);
    }

    private String createTitleList() {
        StringBuilder sb = new StringBuilder();
        if (album != null) {
            sb.append("    \"").append(album.getAlbumName()).append("\" by ").append(album.getArtistName());
        } else {
            for (int i = 0, len = songs.getLength(); i < len; i++) {
                Song song = songs.get(i);
                if (i > 0) sb.append('\n');
                sb.append("    \"").append(song.getSongName()).append("\" by ").append(song.getArtistName());
            }
        }
        return sb.toString();
    }

    private String createUrl() {
        return urlencode(album != null ? createGroovejamesLink(album) : createGroovejamesLink(songs));
    }

    private static String createGroovejamesLink(AlbumSearch albumSearch) {
        StringBuilder sb = new StringBuilder("groovejames://album?id=").append(albumSearch.getAlbumID());
        if (!isEmpty(albumSearch.getAlbumName())) {
            sb.append("&albumName=").append(urlencode(albumSearch.getAlbumName()));
        }
        sb.append("&autoplay=true");
        return sb.toString();
    }

    private static String createGroovejamesLink(Sequence<Song> songs) {
        StringBuilder sb = new StringBuilder("groovejames://song");
        for (int i = 0, len = songs.getLength(); i < len; i++) {
            Song song = songs.get(i);
            sb.append(i == 0 ? '?' : '&');
            sb.append("id=").append(song.getSongID());
            if (!isEmpty(song.getSongName())) {
                sb.append("&songName=").append(urlencode(song.getSongName()));
            }
        }
        sb.append("&autoplay=true");
        return sb.toString();
    }

    private static String replacePlaceholders(final String template, final Properties props) {
        String t = template;
        for (int i = 0; i < 5; i++) {
            String t2 = replacePlaceholders1(t, props);
            if (t2.equals(t))
                return t2;
            t = t2;
        }
        return t;
    }

    private static String replacePlaceholders1(final String template, final Properties props) {
        String t = template;
        for (String key : props.stringPropertyNames()) {
            String value = props.getProperty(key);
            t = t.replace("{" + key + "}", value);
        }
        return t;
    }

    public static void main(String[] args) {
        DesktopApplicationContext.main(MailActionTestApp.class, args);

    }

    public static class MailActionTestApp extends AbstractApplication {
        @Override public void startup(Display display, Map<String, String> properties) throws Exception {
            Window window = new Window();
            window.open(display);
            AlbumSearch albumSearch = new AlbumSearch(1234L, "Hello World", "The Cool Artist");
            new MailAction(window, albumSearch).perform(null);
            Song song1 = new Song();
            song1.setSongID(1234L);
            song1.setSongName("Song 2");
            song1.setArtistName("Blur");
            Song song2 = new Song();
            song2.setSongID(43444343L);
            song2.setSongName("Caravan Of Love");
            song2.setArtistName("The Housemartins");
            List<Song> songs = new ArrayList<Song>(song1, song2);
            new MailAction(window, songs).perform(null);
        }
    }

}
