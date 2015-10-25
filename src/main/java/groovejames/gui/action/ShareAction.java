package groovejames.gui.action;

import com.google.common.io.Resources;
import groovejames.gui.components.AbstractApplication;
import groovejames.model.Song;
import groovejames.service.Services;
import groovejames.service.search.AlbumSearch;
import groovejames.util.OSUtils;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.pivot.collections.ArrayList;
import org.apache.pivot.collections.List;
import org.apache.pivot.collections.Map;
import org.apache.pivot.collections.Sequence;
import org.apache.pivot.wtk.Action;
import org.apache.pivot.wtk.Alert;
import org.apache.pivot.wtk.Clipboard;
import org.apache.pivot.wtk.Component;
import org.apache.pivot.wtk.DesktopApplicationContext;
import org.apache.pivot.wtk.Display;
import org.apache.pivot.wtk.LocalManifest;
import org.apache.pivot.wtk.MessageType;
import org.apache.pivot.wtk.Prompt;
import org.apache.pivot.wtk.Sheet;
import org.apache.pivot.wtk.SheetCloseListener;
import org.apache.pivot.wtk.TextArea;
import org.apache.pivot.wtk.Window;

import java.awt.Desktop;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Properties;

import static com.google.common.base.Charsets.UTF_8;
import static com.google.common.base.Strings.isNullOrEmpty;
import static groovejames.util.UrlUtils.urlencode;

public class ShareAction extends Action {

    private static final Logger log = LogManager.getLogger(ShareAction.class);
    private static final String mailTemplateResourceName = "mail.template.txt";

    private final Window window;
    private final AlbumSearch album;
    private final Sequence<Song> songs;

    public ShareAction(Window window, Sequence<Song> songs) {
        this.window = window;
        this.songs = songs;
        this.album = null;
    }

    public ShareAction(Window window, AlbumSearch album) {
        this.window = window;
        this.album = album;
        this.songs = null;
    }

    public void perform(Component source) {
        if (album != null || (songs != null && songs.getLength() > 0)) {
            showDialog();
        }
    }

    private void showDialog() {
        TextArea urlTextArea = new TextArea();
        final String url = createUrl();
        urlTextArea.setText(url);
        urlTextArea.setEditable(false);
        urlTextArea.setPreferredWidth(500);
        ArrayList<String> options = new ArrayList<>("Cancel", "Copy to Clipboard", "Open Mail Client");
        final Prompt prompt = new Prompt(MessageType.INFO, "Send the following URL to a friend:", options, urlTextArea);
        prompt.setTitle("Share " + (album != null ? "album" : songs.getLength() == 1 ? "song" : "songs"));
        prompt.setPreferredWidth(500);
        prompt.open(window.getDisplay(), window, new SheetCloseListener() {
            @Override
            public void sheetClosed(Sheet sheet) {
                int selectedOptionIndex = prompt.getSelectedOptionIndex();
                if (selectedOptionIndex == 1) {
                    // copy to clipboard
                    Services.getWatchClipboardTask().dontCheck(url);
                    LocalManifest clipboardContent = new LocalManifest();
                    clipboardContent.putText(url);
                    Clipboard.setContent(clipboardContent);
                } else if (selectedOptionIndex == 2) {
                    // open mail client
                    String mailSubject = createMailSubject();
                    String mailBody = createMailBody();
                    openMailClient(mailSubject, mailBody);
                }
            }
        });
    }

    private String createMailSubject() {
        return "[GrooveJames] song tips from " + System.getProperty("user.name");
    }

    private String createMailBody() {
        String mailTemplate = readMailTemplate();
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

    private String readMailTemplate() {
        try {
            return Resources.toString(getClass().getResource(mailTemplateResourceName), UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void openMailClient(String mailSubject, String mailBody) {
        try {
            URI mailtoURI = toMailUri(mailSubject, mailBody);
            try {
                Desktop.getDesktop().mail(mailtoURI);
            } catch (IOException ex) {
                if (OSUtils.isLinux()) {
                    log.warn("error opening mail client -- trying xdg-open now...", ex);
                    OSUtils.exec("xdg-open", mailtoURI.toASCIIString());
                } else {
                    throw ex;
                }
            }
        } catch (Exception ex) {
            log.error("error opening mail client", ex);
            alert("Sorry, I tried to open the mail client but it failed. (See log for details).", mailBody);
        }
    }

    private URI toMailUri(String subject, String body) throws URISyntaxException, UnsupportedEncodingException {
        URI uri = new URI("mailto:?to=&subject=" + enc(subject) + "&body=" + enc(body));
        log.debug("created mail uri: " + uri);
        return uri;
    }

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
        return album != null ? createGroovejamesLink(album) : createGroovejamesLink(songs);
    }

    private static String createGroovejamesLink(AlbumSearch albumSearch) {
        StringBuilder sb = new StringBuilder("groovejames://album?id=").append(albumSearch.getAlbumID());
        if (!isNullOrEmpty(albumSearch.getAlbumName())) {
            sb.append("&albumName=").append(urlencode(albumSearch.getAlbumName()));
        }
        sb.append("&autoplay=").append(albumSearch.isAutoplay());
        return sb.toString();
    }

    private static String createGroovejamesLink(Sequence<Song> songs) {
        StringBuilder sb = new StringBuilder("groovejames://song");
        for (int i = 0, len = songs.getLength(); i < len; i++) {
            Song song = songs.get(i);
            sb.append(i == 0 ? '?' : '&');
            sb.append("id=").append(song.getSongID());
            if (!isNullOrEmpty(song.getSongName())) {
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

    private static String enc(String s) {
        StringBuilder sb = new StringBuilder(s.length() + 50);
        byte[] bytes = s.getBytes(UTF_8);
        for (byte b : bytes) {
            if (b != '?' && b != '&' && Character.isLetterOrDigit(b))
                sb.append((char) b);
            else
                sb.append(String.format("%%%02X", b));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        DesktopApplicationContext.main(ShareActionTestApp.class, args);
    }

    public static class ShareActionTestApp extends AbstractApplication {
        @Override
        public void startup(Display display, Map<String, String> properties) throws Exception {
            Window window = new Window();
            window.open(display);
            /*
            AlbumSearch albumSearch = new AlbumSearch(1L, "Hell\u00f6 W\u00f6rld", "The? Cool & Groovy \u00c4rtist", false, false);
            new ShareAction(window, albumSearch).perform(null);
            */
            Song song1 = new Song();
            song1.setSongID(1000L);
            song1.setSongName("S\u00f6ng 2 & S\u00f6ng 3");
            song1.setArtistName("Bl\u00fcr");
            Song song2 = new Song();
            song2.setSongID(1004L);
            song2.setSongName("Caravan? Of L\u00f6ve");
            song2.setArtistName("The Housem\u00e4rtins");
            List<Song> songs = new ArrayList<>(song1, song2);
            new ShareAction(window, songs).perform(null);
        }
    }

}
