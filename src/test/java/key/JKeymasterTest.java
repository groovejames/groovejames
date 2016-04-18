package key;

import com.tulskiy.keymaster.common.HotKey;
import com.tulskiy.keymaster.common.HotKeyListener;
import com.tulskiy.keymaster.common.MediaKey;
import com.tulskiy.keymaster.common.Provider;

public class JKeymasterTest {
    public static void main(String[] args) {
        final Provider provider = Provider.getCurrentProvider(false);
        Runtime.getRuntime().addShutdownHook(new Thread("shutdown-hook") {
            @Override
            public void run() {
                provider.reset();
                provider.stop();
            }
        });
        provider.register(MediaKey.MEDIA_PLAY_PAUSE, new HotKeyListener() {
            @Override
            public void onHotKey(HotKey hotKey) {
                System.err.println("hotkey received" + hotKey);
            }
        });
    }

}
