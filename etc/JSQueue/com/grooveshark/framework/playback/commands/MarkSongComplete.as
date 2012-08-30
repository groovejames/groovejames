package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import mx.collections.*;

    public class MarkSongComplete extends SongCommand
    {

        public function MarkSongComplete(param1:IDualService, param2:PlayableSong)
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
            Debug.getInstance().print("[MarkSongComplete] Failed: " + param1 + " Giving up.");
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
            _loc_1.song = {};
            _loc_1.song.songID = song.song.songID;
            _loc_1.song.songName = song.song.songName;
            _loc_1.song.artistID = song.song.artistID;
            _loc_1.song.artistName = song.song.artistName;
            _loc_1.song.albumID = song.song.albumID;
            _loc_1.song.albumName = song.song.albumName;
            _loc_1.song.token = song.song.hasOwnProperty("token") ? (song.song["token"]) : ("");
            _loc_1.song.artFilename = song.song.artFilename.indexOf("default") == -1 ? (song.song.artFilename) : ("");
            var _loc_2:* = song;
            if (_loc_2.hasOwnProperty("context"))
            {
                _loc_1.context = {type:_loc_2.context.type, data:_loc_2.context.data};
            }
            if (PlayableSong.userForReporting)
            {
                _loc_1.user = PlayableSong.userForReporting;
            }
            service.send(false, "markSongComplete", _loc_1, new ItemResponder(serviceSuccess, serviceFault));
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
            return;
        }// end function

    }
}
