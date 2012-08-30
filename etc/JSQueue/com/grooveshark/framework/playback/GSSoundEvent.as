package com.grooveshark.framework.playback
{
    import flash.events.*;

    final public class GSSoundEvent extends Event
    {
        public static const URL_CHANGED:String = "urlChanged";
        public static const BUFFER_FULL:String = "bufferFull";
        public static const IO_ERROR:String = "ioError";
        public static const DOWNLOAD_COMPLETE:String = "downloadComplete";
        public static const BUFFER_EMPTY:String = "bufferEmpty";
        public static const PLAYBACK_BEGUN:String = "playbackBegun";
        public static const PLAYBACK_COMPLETE:String = "playbackComplete";

        public function GSSoundEvent(param1:String, param2:Boolean = false, param3:Boolean = false)
        {
            super(param1, param2, param3);
            return;
        }// end function

        override public function clone() : Event
        {
            return new GSSoundEvent(this.type, this.bubbles, this.cancelable);
        }// end function

    }
}
