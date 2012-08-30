package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import mx.collections.*;

    public class MarkSongSkipped extends SongCommand
    {

        public function MarkSongSkipped(param1:IDualService, param2:QueueSong)
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
            Debug.getInstance().print("[MarkSongSkipped] Failed: " + param1 + " Giving up.");
            dispatchEvent(new Event("failed"));
            return;
        }// end function

        override public function execute() : void
        {
            if (!(song as QueueSong).parent || !(song as QueueSong).parent.queueID || !(song as QueueSong).parent.autoplayEnabled)
            {
                onFail("Queue not initialized, or autoplay is off.", false);
                return;
            }
            if (!song || !(song as QueueSong).queueSongID)
            {
                onFail("Either no song, or song is missing queueSongID.", false);
                return;
            }
            var _loc_1:Object = {};
            _loc_1.songQueueSongID = (song as QueueSong).queueSongID;
            _loc_1.songQueueID = (song as QueueSong).parent.queueID;
            service.send(false, "markSongSkipped", _loc_1, new ItemResponder(serviceSuccess, serviceFault));
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
