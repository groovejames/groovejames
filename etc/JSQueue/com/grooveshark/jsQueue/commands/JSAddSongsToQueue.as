package com.grooveshark.jsQueue.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.framework.playback.commands.*;
    import com.grooveshark.jsQueue.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;

    public class JSAddSongsToQueue extends AddSongsToQueue
    {

        public function JSAddSongsToQueue(param1:IDualService, param2:Queue, param3:Array, param4:int, param5:Boolean, param6:Boolean, param7:Object)
        {
            super(param1, param2, param3, param4, param5, param6, param7);
            return;
        }// end function

        private function onSongCreateComplete(event:Event) : void
        {
            var _loc_5:BaseSong = null;
            var _loc_6:int = 0;
            var _loc_7:int = 0;
            var _loc_2:int = 0;
            var _loc_3:Array = [];
            var _loc_4:int = 0;
            while (_loc_4 < queueSongs.length)
            {
                
                if (!queueSongs[_loc_4])
                {
                    _loc_5 = (queue as QueueJS).songCache[idsToFetch[_loc_2]];
                    if (_loc_5)
                    {
                        queueSongs[_loc_4] = new QueueSong(_loc_5, queue, service, context);
                    }
                    else
                    {
                        _loc_3.push(_loc_4);
                    }
                    _loc_2++;
                }
                _loc_4++;
            }
            if (_loc_3.length)
            {
                _loc_6 = 0;
                while (_loc_6 < _loc_3.length)
                {
                    
                    _loc_7 = _loc_3[_loc_6] + _loc_6;
                    queueSongs.splice(_loc_7, 1);
                    _loc_6++;
                }
            }
            execute();
            return;
        }// end function

        override protected function idToSong(param1:int) : BaseSong
        {
            return (queue as QueueJS).songCache[param1];
        }// end function

        override protected function fetchMissingIDs() : void
        {
            var _loc_1:* = new CreateSongsFromIDs(service, (queue as QueueJS).songCache, idsToFetch);
            _loc_1.addEventListener(Event.COMPLETE, onSongCreateComplete, false, 0, true);
            _loc_1.addEventListener("failed", onSongCreateFailed, false, 0, true);
            _loc_1.execute();
            return;
        }// end function

        private function onSongCreateFailed(event:Event) : void
        {
            queue.dispatchEvent(new QueueEvent(QueueEvent.ERROR_ADDING_SONGS, QueueEvent.FAILED_TO_CREATE_SONGS, true, {songs:this.items}));
            var _loc_2:* = queue;
            var _loc_3:* = queue.pendingAdds - 1;
            _loc_2.pendingAdds = _loc_3;
            dispatchEvent(new Event("failed"));
            return;
        }// end function

    }
}
