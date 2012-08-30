package com.grooveshark.framework.playback
{
    import flash.events.*;

    final public class PlayableSongEvent extends Event
    {
        public var preErrorStatus:int;
        public var data:Object;
        public var code:int;
        public static const COMPLETE:String = "complete";
        public static const FAILED_TOO_MANY_STREAMKEY_FAILS:int = 3;
        public static const SONG_VOTE_FAILED:String = "songVoteFailed";
        public static const FAILED_MUST_PROVIDE_STREAMKEY:int = 11;
        public static const COMPLETE_SOUND_COMPLETE:int = 7;
        public static const FAILED_IO_ERROR:int = 1;
        public static var lastError:Array;
        public static const FAILED_TOO_MANY_BAD_FRAMES:int = 5;
        public static const PLAYBACK_BEGUN:String = "playbackBegun";
        public static const SONG_FLAGGED:String = "songFlagged";
        public static const FAILED_UNKNOWN_SERVER_ERROR:int = 6;
        public static const ERROR:String = "error";
        public static const FAILED_STREAMKEY_OTHER:int = 4;
        public static const SONG_VOTED:String = "songVoted";
        public static const FAILED_STREAMKEY_LIMIT:int = 2;
        public static const WARNING_FREQUENT_BUFFERING:int = 10;
        public static const COMPLETE_VBR_COMPLETE:int = 8;
        public static const FLATTR_DATA:String = "flattrData";
        public static const COMPLETE_FORCE_FROWN_SKIP:int = 9;

        public function PlayableSongEvent(param1:String, param2:int = 0, param3:int = -1, param4:Object = null, param5:Boolean = false, param6:Boolean = false)
        {
            super(param1, param5, param6);
            this.code = param2;
            this.preErrorStatus = param3;
            this.data = param4;
            if (param1 == ERROR)
            {
                if (!lastError)
                {
                    lastError = [];
                }
                lastError.push("SongEvent { " + param1 + ": finalCode:" + String(param2) + " resultCode:" + String(param3) + " }");
                if (lastError.length > 5)
                {
                    lastError.shift();
                }
            }
            return;
        }// end function

        override public function clone() : Event
        {
            return new PlayableSongEvent(this.type, this.code, this.preErrorStatus, this.data, this.bubbles, this.cancelable);
        }// end function

    }
}
