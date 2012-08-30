package com.grooveshark.jsQueue.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;

    final public class CreateSongsFromIDs extends EventDispatcher implements ICommand
    {
        public var songIDs:Array;
        private var songCache:Dictionary;
        public var results:Array;
        private var service:IDualService;

        public function CreateSongsFromIDs(param1:IDualService, param2:Dictionary, param3:Array)
        {
            this.service = param1;
            this.songCache = param2;
            this.songIDs = param3;
            return;
        }// end function

        private function serviceSuccess(param1:Object, param2:Object = null) : void
        {
            var _loc_4:Array = null;
            var _loc_5:Object = null;
            var _loc_6:int = 0;
            var _loc_7:BaseSong = null;
            var _loc_3:* = (param1 as JSONResult).result as Array;
            if (_loc_3 && _loc_3.length)
            {
                _loc_4 = [];
                for each (_loc_5 in _loc_3)
                {
                    
                    _loc_7 = songCache[int(_loc_5.songID)];
                    if (!_loc_7)
                    {
                        _loc_7 = new BaseSong();
                        _loc_7.songID = int(_loc_5.SongID);
                        _loc_7.songName = String(_loc_5.Name);
                        _loc_7.artistID = int(_loc_5.ArtistID);
                        _loc_7.artistName = String(_loc_5.ArtistName);
                        _loc_7.albumID = int(_loc_5.AlbumID);
                        _loc_7.albumName = String(_loc_5.AlbumName);
                        _loc_7.flags = int(_loc_5.Flags);
                        if (_loc_5.CoverArtFilename)
                        {
                            _loc_7.artFilename = String(_loc_5.CoverArtFilename);
                        }
                        if (int(_loc_5.EstimateDuration))
                        {
                            _loc_7.estimateDuration = int(_loc_5.EstimateDuration) * 1000;
                        }
                        songCache[_loc_7.songID] = _loc_7;
                    }
                }
                this.results = [];
                for each (_loc_6 in this.songIDs)
                {
                    
                    _loc_7 = songCache[_loc_6];
                    if (_loc_7)
                    {
                        results.push(_loc_7);
                    }
                }
                this.dispatchEvent(new Event(Event.COMPLETE));
            }
            else
            {
                onFail("No songs returned");
            }
            return;
        }// end function

        private function serviceFault(param1:Object, param2:Object = null) : void
        {
            onFail((param1 as JSONFault).message);
            return;
        }// end function

        public function execute() : void
        {
            if (songIDs.length)
            {
                service.send(false, "getQueueSongListFromSongIDs", {songIDs:songIDs}, new ItemResponder(serviceSuccess, serviceFault));
            }
            else
            {
                onFail("No songIDs provided.");
            }
            return;
        }// end function

        private function onFail(param1:String) : void
        {
            Debug.getInstance().print("[CreateSongsFromIDs] Failed: " + param1 + " Giving up.");
            dispatchEvent(new Event("failed"));
            return;
        }// end function

    }
}
