package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import mx.collections.*;

    public class ReportCorrectDuration extends SongCommand
    {

        public function ReportCorrectDuration(param1:IDualService, param2:PlayableSong)
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
            Debug.getInstance().print("[ReportCorrectDuration] Failed: " + param1 + " Giving up.");
            dispatchEvent(new Event("failed"));
            return;
        }// end function

        override public function execute() : void
        {
            if (!song || !song.lastStreamKey || !song.duration)
            {
                onFail("Either no song, or song is missing streamKey or duration is 0.", false);
                return;
            }
            var _loc_1:Object = {};
            _loc_1.streamKey = song.lastStreamKey;
            _loc_1.streamServerID = song.lastStreamServer;
            _loc_1.songID = song.song.songID;
            _loc_1.length = song.duration / 1000;
            service.send(false, "updateStreamKeyLength", _loc_1, new ItemResponder(serviceSuccess, serviceFault));
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
