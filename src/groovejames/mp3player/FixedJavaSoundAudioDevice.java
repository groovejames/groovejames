/*
 * 09/18/12     Fixed problems with closing and reopening the audio device
 * 11/26/04     Buffer size modified to support JRE 1.5 optimizations.
 *              (CPU usage < 1% under P4/2Ghz, RAM < 12MB).
 *              jlayer@javazoom.net
 * 11/19/04     1.0 moved to LGPL.
 * 04/06/01     Too fast playback fixed. mdm@techie.com
 * 01/29/00     Initial version. mdm@techie.com
 *-----------------------------------------------------------------------
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License as published
 *   by the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Library General Public License for more details.
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the Free Software
 *   Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *----------------------------------------------------------------------
 */

package groovejames.mp3player;

import javazoom.jl.decoder.Decoder;
import javazoom.jl.decoder.JavaLayerException;
import javazoom.jl.player.AudioDeviceBase;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.Line;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.SourceDataLine;

/**
 * The <code>JavaSoundAudioDevice</code> implements an audio
 * device by using the JavaSound API.
 *
 * @author Mat McGowan
 */
public class FixedJavaSoundAudioDevice extends AudioDeviceBase {

    private SourceDataLine source = null;

    private AudioFormat fmt = null;

    private byte[] byteBuf = new byte[4096];

    protected void setAudioFormat(AudioFormat fmt0) {
        fmt = fmt0;
    }

    protected AudioFormat getAudioFormat() {
        if (fmt == null) {
            Decoder decoder = getDecoder();
            fmt = new AudioFormat(decoder.getOutputFrequency(), 16, decoder.getOutputChannels(), true, false);
        }
        return fmt;
    }

    protected DataLine.Info getSourceLineInfo() {
        AudioFormat fmt = getAudioFormat();
        return new DataLine.Info(SourceDataLine.class, fmt);
    }

    public void open(AudioFormat fmt) throws JavaLayerException {
        if (!isOpen()) {
            setAudioFormat(fmt);
            openImpl();
            setOpen(true);
        }
    }

    protected void openImpl() throws JavaLayerException {
        // ### BEGIN FIX 09/18/12 ###
        if (source != null && !source.isOpen()) {
            try {
                source.open(fmt);
                source.start();
            } catch (LineUnavailableException ex) {
                throw new JavaLayerException("cannot reopen source audio line", ex);
            }
        }
        // ### END FIX 09/18/12 ###
    }

    protected void createSource() throws JavaLayerException {
        Throwable t = null;
        try {
            Line line = AudioSystem.getLine(getSourceLineInfo());
            if (line instanceof SourceDataLine) {
                source = (SourceDataLine) line;
                //source.open(fmt, millisecondsToBytes(fmt, 2000));
                source.open(fmt);
                source.start();
            }
        } catch (RuntimeException ex) {
            t = ex;
        } catch (LinkageError ex) {
            t = ex;
        } catch (LineUnavailableException ex) {
            t = ex;
        }
        if (source == null)
            throw new JavaLayerException("cannot obtain source audio line", t);
    }

    public int millisecondsToBytes(AudioFormat fmt, int time) {
        return (int) (time * (fmt.getSampleRate() * fmt.getChannels() * fmt.getSampleSizeInBits()) / 8000.0);
    }

    protected void closeImpl() {
        if (source != null) {
            // ### BEGIN FIX 09/18/12 ###
            if (source.isActive()) {
                source.flush();
                source.stop();
            }
            // ### END FIX 09/18/12 ###
            source.close();
        }
    }

    protected void writeImpl(short[] samples, int offs, int len) throws JavaLayerException {
        if (source == null)
            createSource();
        byte[] b = toByteArray(samples, offs, len);
        source.write(b, 0, len * 2);
    }

    protected byte[] getByteArray(int length) {
        if (byteBuf.length < length) {
            byteBuf = new byte[length + 1024];
        }
        return byteBuf;
    }

    protected byte[] toByteArray(short[] samples, int offs, int len) {
        byte[] b = getByteArray(len * 2);
        int idx = 0;
        short s;
        while (len-- > 0) {
            s = samples[offs++];
            b[idx++] = (byte) s;
            b[idx++] = (byte) (s >>> 8);
        }
        return b;
    }

    protected void flushImpl() {
        if (source != null) {
            source.drain();
        }
    }

    public int getPosition() {
        int pos = 0;
        if (source != null) {
            pos = (int) (source.getMicrosecondPosition() / 1000);
        }
        return pos;
    }

    /**
     * Runs a short test by playing a short silent sound.
     */
    public static void main(String[] args) throws JavaLayerException {
        FixedJavaSoundAudioDevice dev = new FixedJavaSoundAudioDevice();
        dev.open(new AudioFormat(22050, 16, 1, true, false));
        short[] data = new short[22050];
        dev.write(data, 0, data.length);
        dev.flush();
        dev.close();
    }
}
