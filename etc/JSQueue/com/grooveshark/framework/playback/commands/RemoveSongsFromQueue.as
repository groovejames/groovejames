package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;

    public class RemoveSongsFromQueue extends QueueCommand
    {
        private var userRemoved:Boolean;
        private var params:Object;
        private var removeWithoutReport:Array;
        private var songs:Array;

        public function RemoveSongsFromQueue(param1:IDualService, param2:Queue, param3:Array, param4:Boolean)
        {
            removeWithoutReport = [];
            super(param1, param2);
            this.songs = param3;
            this.userRemoved = param4;
            return;
        }// end function

        override public function execute() : void
        {
            if (!queue.queueID)
            {
                queue.completeRemoveSongs(songs);
                dispatchEvent(new Event("failed"));
                return;
            }
            if (!params)
            {
                buildParams();
            }
            if (!params.songQueueSongIDs.length)
            {
                if (removeWithoutReport.length)
                {
                    queue.completeRemoveSongs(removeWithoutReport);
                }
                dispatchEvent(new Event(Event.COMPLETE));
                return;
            }
            service.send(false, "removeSongsFromQueue", params);
            queue.completeRemoveSongs(songs);
            dispatchEvent(new Event(Event.COMPLETE));
            return;
        }// end function

        private function buildParams() : void
        {
            var _loc_2:QueueSong = null;
            var _loc_1:Array = [];
            for each (_loc_2 in songs)
            {
                
                if (_loc_2.queueSongID)
                {
                    if (_loc_2.autoplayVote == QueueSong.AUTOPLAY_VOTE_DOWN)
                    {
                        removeWithoutReport.push(_loc_2);
                        continue;
                    }
                    _loc_1.push(_loc_2.queueSongID);
                }
            }
            params = {};
            params.songQueueSongIDs = _loc_1;
            params.songQueueID = queue.queueID;
            params.userRemoved = userRemoved;
            return;
        }// end function

    }
}
