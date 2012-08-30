package com.grooveshark.framework.playback
{
    import com.grooveshark.framework.playback.*;
    import flash.errors.*;
    import flash.events.*;
    import flash.media.*;
    import flash.net.*;

    public class GSSound9 extends EventDispatcher implements IGSSound
    {
        protected var sourceSound:Sound;
        private var _url:String;
        private var _volume:Number = 1;
        private var _outputSoundChannel:SoundChannel;
        protected var _isStopped:Boolean = true;
        protected var _isPaused:Boolean = false;
        protected var pausedPosition:Number = 0;
        public static const DEFAULT_NETWORK_BUFFER:int = 3000;

        public function GSSound9(param1:URLRequest, param2:Number = 3000, param3:Boolean = true)
        {
            _url = param1.url;
            sourceSound = new Sound();
            sourceSound.addEventListener(ProgressEvent.PROGRESS, onProgress);
            sourceSound.addEventListener(Event.COMPLETE, onDownloadComplete);
            sourceSound.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
            sourceSound.load(param1, new SoundLoaderContext(param2, param3));
            return;
        }// end function

        public function stop() : void
        {
            _isPaused = false;
            _isStopped = true;
            if (outputSoundChannel)
            {
                outputSoundChannel.stop();
            }
            if (sourceSound && sourceSound.bytesLoaded < sourceSound.bytesTotal)
            {
                try
                {
                    sourceSound.close();
                }
                catch (error:IOError)
                {
                }
                sourceSound.removeEventListener(ProgressEvent.PROGRESS, onProgress);
                sourceSound.removeEventListener(Event.COMPLETE, onDownloadComplete);
                sourceSound.removeEventListener(IOErrorEvent.IO_ERROR, onIOError);
                sourceSound = null;
            }
            return;
        }// end function

        public function set filters(param1:Array) : void
        {
            return;
        }// end function

        public function get duration() : Number
        {
            if (sourceSound.bytesLoaded <= 0)
            {
                return 0;
            }
            return sourceSound.length / (sourceSound.bytesLoaded / sourceSound.bytesTotal);
        }// end function

        protected function get outputSoundChannel() : SoundChannel
        {
            return _outputSoundChannel;
        }// end function

        public function get isBuffering() : Boolean
        {
            return sourceSound.isBuffering;
        }// end function

        public function get bytesTotal() : int
        {
            return sourceSound.bytesTotal;
        }// end function

        public function get volume() : Number
        {
            return _volume;
        }// end function

        public function get position() : Number
        {
            return isPaused ? (pausedPosition) : (outputSoundChannel ? (outputSoundChannel.position) : (0));
        }// end function

        protected function set outputSoundChannel(param1:SoundChannel) : void
        {
            var _loc_2:SoundTransform = null;
            if (param1 !== _outputSoundChannel)
            {
                if (_outputSoundChannel)
                {
                    _outputSoundChannel.removeEventListener(Event.SOUND_COMPLETE, onSoundComplete);
                    _outputSoundChannel.stop();
                }
                _outputSoundChannel = param1;
                if (_outputSoundChannel)
                {
                    _loc_2 = _outputSoundChannel.soundTransform;
                    _loc_2.volume = _volume;
                    _outputSoundChannel.soundTransform = _loc_2;
                    _outputSoundChannel.addEventListener(Event.SOUND_COMPLETE, onSoundComplete);
                }
            }
            return;
        }// end function

        protected function onProgress(event:Event) : void
        {
            if (sourceSound.url && sourceSound.url !== _url)
            {
                _url = sourceSound.url;
                dispatchEvent(new GSSoundEvent(GSSoundEvent.URL_CHANGED));
            }
            return;
        }// end function

        public function get isStopped() : Boolean
        {
            return _isStopped;
        }// end function

        protected function onSoundComplete(event:Event) : void
        {
            if (sourceSound.bytesLoaded >= sourceSound.bytesTotal)
            {
                dispatchEvent(new GSSoundEvent(GSSoundEvent.PLAYBACK_COMPLETE));
            }
            return;
        }// end function

        public function play() : void
        {
            var _loc_1:Number = NaN;
            if (_isPaused)
            {
                _loc_1 = pausedPosition;
            }
            else if (_isStopped)
            {
                _loc_1 = 0;
            }
            else if (outputSoundChannel)
            {
                _loc_1 = outputSoundChannel.position;
            }
            else
            {
                _loc_1 = 0;
            }
            _isPaused = false;
            _isStopped = false;
            outputSoundChannel = sourceSound.play(_loc_1);
            return;
        }// end function

        public function set position(param1:Number) : void
        {
            if (isPaused)
            {
                pausedPosition = param1;
            }
            else
            {
                this.pause();
                pausedPosition = param1;
                this.play();
            }
            return;
        }// end function

        public function set volume(param1:Number) : void
        {
            var _loc_2:SoundTransform = null;
            if (isNaN(param1))
            {
                param1 = 0;
            }
            if (param1 < 0)
            {
                param1 = 0;
            }
            if (param1 > 1)
            {
                param1 = 1;
            }
            if (param1 !== _volume)
            {
                _volume = param1;
                if (outputSoundChannel)
                {
                    _loc_2 = outputSoundChannel.soundTransform;
                    _loc_2.volume = param1;
                    outputSoundChannel.soundTransform = _loc_2;
                }
            }
            return;
        }// end function

        public function get bytesLoaded() : uint
        {
            return sourceSound.bytesLoaded;
        }// end function

        protected function onIOError(event:IOErrorEvent) : void
        {
            this.stop();
            dispatchEvent(new GSSoundEvent(GSSoundEvent.IO_ERROR));
            return;
        }// end function

        protected function onDownloadComplete(event:Event) : void
        {
            dispatchEvent(new GSSoundEvent(GSSoundEvent.DOWNLOAD_COMPLETE));
            return;
        }// end function

        public function get isPaused() : Boolean
        {
            return _isPaused;
        }// end function

        public function get filters() : Array
        {
            return null;
        }// end function

        public function pause() : void
        {
            _isPaused = true;
            if (outputSoundChannel)
            {
                pausedPosition = outputSoundChannel.position;
                outputSoundChannel.stop();
            }
            return;
        }// end function

        public function get url() : String
        {
            return _url;
        }// end function

    }
}
