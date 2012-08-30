package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;

    public class AddSongsToQueue extends QueueCommand
    {
        protected var ignoreInitFail:Boolean = false;
        private var relativeSong:QueueSong = null;
        protected var items:Array;
        protected var index:int;
        protected var processTimer:Timer;
        protected var autoplayOnAdd:Boolean;
        protected var idsToFetch:Array;
        protected var queueSongs:Array;
        protected var playOnAdd:Boolean;
        protected var context:Object;

        public function AddSongsToQueue(param1:IDualService, param2:Queue, param3:Array, param4:int, param5:Boolean, param6:Boolean, param7:Object)
        {
            idsToFetch = [];
            super(param1, param2);
            this.items = param3;
            this.index = param4;
            this.playOnAdd = param5;
            this.autoplayOnAdd = param6;
            this.context = param7;
            var _loc_8:* = param2;
            var _loc_9:* = param2.pendingAdds + 1;
            _loc_8.pendingAdds = _loc_9;
            return;
        }// end function

        private function onSongCreateComplete(param1:Object, param2:Object = null) : void
        {
            var _loc_5:Object = null;
            var _loc_6:int = 0;
            var _loc_7:Array = null;
            var _loc_8:int = 0;
            var _loc_9:BaseSong = null;
            var _loc_10:int = 0;
            var _loc_11:int = 0;
            var _loc_3:* = (param1 as JSONResult).result as Array;
            var _loc_4:Object = {};
            for each (_loc_5 in _loc_3)
            {
                
                _loc_9 = new BaseSong();
                _loc_9.songID = int(_loc_5.SongID);
                _loc_9.songName = String(_loc_5.Name);
                _loc_9.artistID = int(_loc_5.ArtistID);
                _loc_9.artistName = String(_loc_5.ArtistName);
                _loc_9.albumID = int(_loc_5.AlbumID);
                _loc_9.albumName = String(_loc_5.AlbumName);
                if (_loc_5.CoverArtFilename)
                {
                    _loc_9.artFilename = String(_loc_5.CoverArtFilename);
                }
                if (int(_loc_5.EstimateDuration))
                {
                    _loc_9.estimateDuration = int(_loc_5.EstimateDuration) * 1000;
                }
                _loc_4[_loc_9.songID] = _loc_9;
            }
            _loc_6 = 0;
            _loc_7 = [];
            _loc_8 = 0;
            while (_loc_8 < queueSongs.length)
            {
                
                if (!queueSongs[_loc_8])
                {
                    _loc_9 = _loc_4[idsToFetch[_loc_6]];
                    if (_loc_9)
                    {
                        queueSongs[_loc_8] = new QueueSong(_loc_9, queue, service, context);
                    }
                    else
                    {
                        _loc_7.push(_loc_8);
                    }
                    _loc_6++;
                }
                _loc_8++;
            }
            if (_loc_7.length)
            {
                _loc_10 = 0;
                while (_loc_10 < _loc_7.length)
                {
                    
                    _loc_11 = _loc_7[_loc_10] + _loc_10;
                    queueSongs.splice(_loc_11, 1);
                    _loc_10++;
                }
            }
            execute();
            return;
        }// end function

        private function onSongCreateFailed(param1:Object, param2:Object = null) : void
        {
            queue.dispatchEvent(new QueueEvent(QueueEvent.ERROR_ADDING_SONGS, QueueEvent.FAILED_TO_CREATE_SONGS, true, {songs:this.items}));
            var _loc_3:* = queue;
            var _loc_4:* = queue.pendingAdds - 1;
            _loc_3.pendingAdds = _loc_4;
            dispatchEvent(new Event("failed"));
            return;
        }// end function

        private function processSongs(event:TimerEvent) : void
        {
            trace("[AddSongsToQueue] processSongs: songs left " + queueSongs.length);
            if (!queueSongs.length)
            {
                processTimer.stop();
                processTimer.removeEventListener(TimerEvent.TIMER, processSongs);
                var _loc_4:* = queue;
                var _loc_5:* = queue.pendingAdds - 1;
                _loc_4.pendingAdds = _loc_5;
                this.dispatchEvent(new Event(Event.COMPLETE));
                return;
            }
            var _loc_2:* = queueSongs.splice(0, queue.chunkSize);
            var _loc_3:* = buildParams(_loc_2);
            service.send(false, "addSongsToQueue", _loc_3);
            if (relativeSong)
            {
                index = Queue.INDEX_RELATIVE;
                playOnAdd = false;
                autoplayOnAdd = false;
            }
            trace("Sent " + _loc_2.length + "items, queue chunk size is: " + queue.chunkSize);
            queue.completeAddSongsAt(_loc_2, index, playOnAdd, autoplayOnAdd, relativeSong);
            relativeSong = _loc_2[(_loc_2.length - 1)] as QueueSong;
            return;
        }// end function

        private function buildParams(param1:Array) : Object
        {
            var _loc_3:QueueSong = null;
            var _loc_4:Object = null;
            var _loc_5:Object = null;
            var _loc_2:Array = [];
            for each (_loc_3 in param1)
            {
                
                _loc_3.queueSongID = queue.songCount;
                var _loc_8:* = queue;
                var _loc_9:* = queue.songCount + 1;
                _loc_8.songCount = _loc_9;
                _loc_5 = {};
                _loc_5.songID = _loc_3.song.songID;
                _loc_5.artistID = _loc_3.song.artistID;
                _loc_5.songQueueSongID = _loc_3.queueSongID;
                _loc_5.source = _loc_3.source;
                _loc_2.push(_loc_5);
            }
            _loc_4 = {};
            _loc_4.songIDsArtistIDs = _loc_2;
            _loc_4.songQueueID = queue.queueID;
            return _loc_4;
        }// end function

        protected function buildQueueSongsArray() : void
        {
            var _loc_3:Object = null;
            var _loc_4:BaseSong = null;
            var _loc_5:int = 0;
            var _loc_6:int = 0;
            queueSongs = new Array(items.length);
            var _loc_1:Array = [];
            var _loc_2:int = 0;
            while (_loc_2 < items.length)
            {
                
                _loc_3 = items[_loc_2];
                if (_loc_3 is QueueSong)
                {
                    if ((_loc_3 as QueueSong).queueSongID != 0)
                    {
                        queueSongs[_loc_2] = new QueueSong(_loc_3.song, queue, service, context);
                    }
                    else
                    {
                        queueSongs[_loc_2] = _loc_3;
                    }
                }
                else if (_loc_3 is BaseSong)
                {
                    queueSongs[_loc_2] = new QueueSong(_loc_3 as BaseSong, queue, service, context);
                }
                else if (int(_loc_3))
                {
                    _loc_4 = idToSong(int(_loc_3));
                    if (_loc_4)
                    {
                        queueSongs[_loc_2] = new QueueSong(_loc_4, queue, service, context);
                    }
                    else
                    {
                        idsToFetch.push(int(_loc_3));
                    }
                }
                else
                {
                    _loc_1.push(_loc_2);
                }
                _loc_2++;
            }
            if (_loc_1.length)
            {
                _loc_5 = 0;
                while (_loc_5 < _loc_1.length)
                {
                    
                    _loc_6 = _loc_1[_loc_5] + _loc_5;
                    queueSongs.splice(_loc_6, 1);
                    _loc_5++;
                }
            }
            if (idsToFetch.length)
            {
                fetchMissingIDs();
            }
            else
            {
                execute();
            }
            return;
        }// end function

        private function reexecute(event:Event) : void
        {
            execute();
            return;
        }// end function

        protected function idToSong(param1:int) : BaseSong
        {
            return null;
        }// end function

        private function onInitQueueFail(event:Event) : void
        {
            ignoreInitFail = true;
            execute();
            return;
        }// end function

        protected function fetchMissingIDs() : void
        {
            service.send(false, "getQueueSongListFromSongIDs", {songIDs:idsToFetch}, new ItemResponder(onSongCreateComplete, onSongCreateFailed));
            return;
        }// end function

        override public function execute() : void
        {
            var _loc_1:InitiateQueue = null;
            if (!items || !items.length)
            {
                trace("tried to add empty array to queue");
                dispatchEvent(new Event("failed"));
                return;
            }
            if (!queue.queueID && !ignoreInitFail)
            {
                _loc_1 = new InitiateQueue(service, queue);
                _loc_1.addEventListener(Event.COMPLETE, reexecute, false, 0, true);
                _loc_1.addEventListener("failed", onInitQueueFail, false, 0, true);
                _loc_1.execute();
                return;
            }
            if (!queueSongs)
            {
                buildQueueSongsArray();
                return;
            }
            if (!queueSongs.length)
            {
                trace("tried to add empty array to queue");
                dispatchEvent(new Event("failed"));
                return;
            }
            trace("[AddSongsToQueue] execute: " + queueSongs.length + " songs total");
            processTimer = new Timer(50);
            processTimer.addEventListener(TimerEvent.TIMER, processSongs);
            processTimer.start();
            return;
        }// end function

    }
}
