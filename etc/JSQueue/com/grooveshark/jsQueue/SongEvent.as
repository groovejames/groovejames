package com.grooveshark.jsQueue
{
    import com.grooveshark.framework.playback.*;
    import flash.events.*;

    final public class SongEvent extends Event
    {
        public var song:QueueSong;
        public static const SONG_DIRTY:String = "songDirty";

        public function SongEvent(param1:String, param2:QueueSong, param3:Boolean = false, param4:Boolean = false)
        {
            super(param1, param3, param4);
            this.song = param2;
            return;
        }// end function

        override public function clone() : Event
        {
            return new SongEvent(this.type, this.song, this.bubbles, this.cancelable);
        }// end function

    }
}
