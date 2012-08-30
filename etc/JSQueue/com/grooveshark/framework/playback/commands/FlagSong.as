package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;

    public class FlagSong extends SongCommand
    {
        public var flagReason:int;
        private var attempts:int = 0;

        public function FlagSong(param1:IDualService, param2:PlayableSong)
        {
            super(param1, param2);
            return;
        }// end function

        private function reexecute(event:Event) : void
        {
            execute();
            return;
        }// end function

        override public function execute() : void
        {
            if (!song || !song.lastStreamKey)
            {
                onFail("Either no song, or song is missing streamKey.", false);
                return;
            }
            var _loc_1:Object = {};
            _loc_1.streamKey = song.lastStreamKey;
            _loc_1.streamServerID = song.lastStreamServer;
            _loc_1.songID = song.song.songID;
            _loc_1.reason = flagReason;
            var _loc_3:* = attempts + 1;
            attempts = _loc_3;
            service.send(false, "flagSong", _loc_1, new ItemResponder(serviceSuccess, serviceFault));
            return;
        }// end function

        private function serviceFault(param1:Object, param2:Object = null) : void
        {
            var _loc_3:* = (param1 as JSONFault).code;
            onFail((param1 as JSONFault).message, _loc_3 != -256 && _loc_3 != 10 && _loc_3 != 1024);
            return;
        }// end function

        private function serviceSuccess(param1:Object, param2:Object = null) : void
        {
            song.dispatchEvent(new PlayableSongEvent(PlayableSongEvent.SONG_FLAGGED, flagReason));
            dispatchEvent(new Event(Event.COMPLETE));
            return;
        }// end function

        private function onFail(param1:String, param2:Boolean = true) : void
        {
            var _loc_3:int = 0;
            var _loc_4:Timer = null;
            if (param2 && attempts < 3)
            {
                Debug.getInstance().print("[FlagSong] Failed: " + param1 + " Will re-attempt.");
                _loc_3 = 100 + Math.floor(Math.random() * 400);
                _loc_4 = new Timer(_loc_3, 1);
                _loc_4.addEventListener(TimerEvent.TIMER_COMPLETE, reexecute, false, 0, true);
                _loc_4.start();
            }
            else
            {
                Debug.getInstance().print("[FlagSong] Failed: " + param1 + " Giving up.");
                dispatchEvent(new Event("failed"));
            }
            return;
        }// end function

    }
}
