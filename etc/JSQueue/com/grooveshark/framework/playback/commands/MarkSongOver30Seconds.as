package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import mx.collections.*;

    public class MarkSongOver30Seconds extends SongCommand
    {
        public static var flattr:Boolean = false;

        public function MarkSongOver30Seconds(param1:IDualService, param2:PlayableSong)
        {
            super(param1, param2);
            return;
        }// end function

        private function reexecute(event:Event) : void
        {
            execute();
            return;
        }// end function

        private function onFail(param1:String, param2:Boolean = true) : void
        {
            Debug.getInstance().print("[MarkSongOver30Seconds] Failed: " + param1 + " Giving up.");
            dispatchEvent(new Event("failed"));
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
            var _loc_2:* = song;
            if (_loc_2.hasOwnProperty("queueSongID"))
            {
                _loc_1.songQueueSongID = _loc_2.queueSongID;
            }
            else
            {
                _loc_1.songQueueSongID = 0;
            }
            if (_loc_2.hasOwnProperty("parent") && _loc_2.parent.hasOwnProperty("queueID"))
            {
                _loc_1.songQueueID = _loc_2.parent.queueID;
            }
            else
            {
                _loc_1.songQueueID = 0;
            }
            var _loc_3:Object = {};
            if (MarkSongOver30Seconds.flattr)
            {
                _loc_3.flattr = 1;
                _loc_1.artistID = song.song.artistID;
            }
            service.send(false, "markStreamKeyOver30Seconds", _loc_1, new ItemResponder(serviceSuccess, serviceFault), "", _loc_3);
            return;
        }// end function

        private function serviceFault(param1:Object, param2:Object = null) : void
        {
            onFail((param1 as JSONFault).message, (param1 as JSONFault).code != -256);
            return;
        }// end function

        private function serviceSuccess(param1:Object, param2:Object = null) : void
        {
            dispatchEvent(new Event(Event.COMPLETE));
            var _loc_3:* = param1 as JSONResult;
            if (_loc_3 && _loc_3.result && _loc_3.result.hasOwnProperty("pageInfo"))
            {
                song.dispatchEvent(new PlayableSongEvent(PlayableSongEvent.FLATTR_DATA, 0, 0, _loc_3.result.pageInfo));
            }
            return;
        }// end function

    }
}
