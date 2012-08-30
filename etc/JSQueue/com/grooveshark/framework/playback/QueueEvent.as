package com.grooveshark.framework.playback
{
    import flash.events.*;

    final public class QueueEvent extends Event
    {
        public var detail:String;
        public var notifyUser:Boolean;
        public var extra:Object;
        public static const UNKNOWN_STOPPING:String = "unknownStopping";
        public static const PLAYBACK_ERROR:String = "playbackError";
        public static const FAILED_TO_CREATE_ARTIST_SONGS:String = "failedToCreateArtistSongs";
        public static const NO_SEEDS:String = "noSeeds";
        public static const UNKNOWN_HAS_NEXT:String = "unknownHasNext";
        public static const SONG_FLAGGED:String = "songFlagged";
        public static const UNKNOWN_ERROR:String = "unknownError";
        public static const FAILED_TO_CREATE_SONGS:String = "failedToCreateSongs";
        public static const SONG_COMPLETE:String = "songComplete";
        public static const AUTOPLAY_FAILED:String = "autoplayFailed";
        public static const QUEUE_NOT_READY:String = "queueNotReady";
        public static const FAILED_TO_CREATE_ALBUM_SONGS:String = "failedToCreateAlbumSongs";
        public static const AUTOPLAY_VOTE_ERROR:String = "autoplayVoteError";
        public static const TOO_MANY_SONGS:String = "tooManySongs";
        public static const RATE_LIMIT_EXCEEDED:String = "rateLimitExceeded";
        public static const ERROR_ADDING_SONGS:String = "errorAddingSongs";
        public static const NO_RECOMMENDATIONS:String = "noRecommendations";
        public static const TOO_MANY_FAILURES:String = "tooManyFailures";

        public function QueueEvent(param1:String, param2:String = "", param3:Boolean = false, param4:Object = null, param5:Boolean = false, param6:Boolean = false)
        {
            super(param1, param5, param6);
            this.detail = param2;
            this.notifyUser = param3;
            this.extra = param4;
            return;
        }// end function

        override public function clone() : Event
        {
            return new QueueEvent(this.type, this.detail, this.notifyUser, this.extra, this.bubbles, this.cancelable);
        }// end function

    }
}
