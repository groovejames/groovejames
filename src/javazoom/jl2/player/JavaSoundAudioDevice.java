/*
 * 11/26/04		Buffer size modified to support JRE 1.5 optimizations.
 *              (CPU usage < 1% under P4/2Ghz, RAM < 12MB).
 *              jlayer@javazoom.net
 * 11/19/04		1.0 moved to LGPL.
 * 06/04/01		Too fast playback fixed. mdm@techie.com
 * 29/01/00		Initial version. mdm@techie.com
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

package javazoom.jl2.player;

import javazoom.jl2.decoder.Decoder;
import javazoom.jl2.decoder.JavaLayerException;

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
 * @since 0.0.8
 * @author Mat McGowan
 */
public class JavaSoundAudioDevice implements AudioDevice {

	private SourceDataLine	source = null;
	private AudioFormat		fmt = null;
	private byte[]			byteBuf = new byte[4096];
    private	boolean			open = false;
    private Decoder			decoder = null;

    protected void setAudioFormat(AudioFormat fmt)
	{
		this.fmt = fmt;
	}

	protected AudioFormat getAudioFormat()
	{
		if (fmt == null)
		{
			Decoder decoder = getDecoder();
			fmt = new AudioFormat(decoder.getOutputFrequency(), 16, decoder.getOutputChannels(), true, false);
        }
        return fmt;
	}

	protected DataLine.Info getSourceLineInfo()
	{
		AudioFormat fmt = getAudioFormat();
		//DataLine.Info info = new DataLine.Info(SourceDataLine.class, fmt, 4000);
        return new DataLine.Info(SourceDataLine.class, fmt);
	}

	public void open(AudioFormat fmt) throws JavaLayerException
	{
		if (!isOpen())
		{
			setAudioFormat(fmt);
			setOpen(true);
		}
	}

	protected SourceDataLine createSource() throws JavaLayerException
    {
        SourceDataLine source;
        try
        {
			Line line = AudioSystem.getLine(getSourceLineInfo());
            if (line instanceof SourceDataLine)
            {
         		source = (SourceDataLine)line;
                //source.open(fmt, millisecondsToBytes(fmt, 2000));
				source.open(fmt);
                source.start();
            }
            else
            {
                throw new JavaLayerException("cannot obtain source audio line, expected class " + SourceDataLine.class + ", got " + line.getClass());
            }
        }
        catch (RuntimeException ex)
        {
            throw new JavaLayerException("cannot obtain source audio line", ex);
        }
        catch (LinkageError ex)
        {
            throw new JavaLayerException("cannot obtain source audio line", ex);
        }
        catch (LineUnavailableException ex)
        {
            throw new JavaLayerException("cannot obtain source audio line", ex);
        }
        return source;
    }

	public int millisecondsToBytes(AudioFormat fmt, int time)
	{
		return (int) (time * (fmt.getSampleRate() * fmt.getChannels() * fmt.getSampleSizeInBits()) / 8000.0);
	}

    protected byte[] getByteArray(int length)
	{
		if (byteBuf.length < length)
		{
			byteBuf = new byte[length+1024];
		}
		return byteBuf;
	}

	protected byte[] toByteArray(short[] samples, int offs, int len)
	{
		byte[] b = getByteArray(len*2);
		int idx = 0;
		short s;
		while (len-- > 0)
		{
			s = samples[offs++];
			b[idx++] = (byte)s;
			b[idx++] = (byte)(s>>>8);
		}
		return b;
	}

    @Override
    public int getPosition()
	{
		int pos = 0;
		if (source != null)
		{
			pos = (int)(source.getMicrosecondPosition()/1000);
		}
		return pos;
	}

    /**
     * Opens this audio device.
     *
     * @param decoder	The decoder that will provide audio data
     *					to this audio device.
     */
    @Override
    public synchronized void open(Decoder decoder) throws JavaLayerException
    {
        if (!isOpen())
        {
            this.decoder = decoder;
            setOpen(true);
        }
    }

    /**
     * Sets the open state for this audio device.
     */
    protected void setOpen(boolean open)
    {
        this.open = open;
    }

    /**
     * Determines if this audio device is open or not.
     *
     * @return <code>true</code> if the audio device is open,
     *		<code>false</code> if it is not.
     */
    @Override
    public synchronized boolean isOpen()
    {
        return open;
    }

    /**
     * Closes this audio device. If the device is currently playing
     * audio, playback is stopped immediately without flushing
     * any buffered audio data.
     */
    @Override
    public synchronized void close()
    {
        if (isOpen())
        {
            if (source != null)
            {
                if (source.isActive())
                {
                    source.flush();
                    source.stop();
                }
                source.close();
                source = null;
                fmt = null;
            }
            setOpen(false);
            decoder = null;
        }
    }

    /**
     * Writes audio data to this audio device. Audio data is
     * assumed to be in the output format of the decoder. This
     * method may return before the data has actually been sounded
     * by the device if the device buffers audio samples.
     *
     * @param samples	The samples to write to the audio device.
     * @param offs		The offset into the array of the first sample to write.
     * @param len		The number of samples from the array to write.
     * @throws javazoom.jl2.decoder.JavaLayerException if the audio data could not be
     *			written to the audio device.
     * If the audio device is not open, this method does nthing.
     */
    public void write(short[] samples, int offs, int len)
        throws JavaLayerException
    {
        if (isOpen())
        {
            if (source == null)
                source = createSource();

            byte[] b = toByteArray(samples, offs, len);
            source.write(b, 0, len *2);
        }
    }

    /**
     * Waits for any buffered audio samples to be played by the
     * audio device. This method should only be called prior
     * to closing the device.
     */
    public void flush()
    {
        if (isOpen())
        {
            if (source != null)
            {
                source.drain();
            }
        }
    }

    /**
     * Retrieves the decoder that provides audio data to this
     * audio device.
     *
     * @return The associated decoder.
     */
    protected Decoder getDecoder()
    {
        return decoder;
    }
}
