package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import mx.collections.*;

    final public class AddSongsFromPlaylist extends QueueCommand
    {
        private var index:int;
        private var playlist:BasePlaylist;
        private var playOnAdd:Boolean;

        public function AddSongsFromPlaylist(param1:IDualService, param2:Queue, param3:BasePlaylist, param4:int, param5:Boolean)
        {
            super(param1, param2);
            this.playlist = param3;
            this.index = param4;
            this.playOnAdd = param5;
            return;
        }// end function

        override public function execute() : void
        {
            if (playlist)
            {
                service.send(false, "playlistGetSongs", {playlistID:playlist.playlistID}, new ItemResponder(serviceSuccess, serviceFault));
            }
            else
            {
                Debug.getInstance().print("[AddSongsFromPlaylist] Failed: No playlist provided.");
                dispatchEvent(new Event("failed"));
            }
            return;
        }// end function

        private function serviceSuccess(param1:Object, param2:Object = null) : void
        {
            var _loc_5:Object = null;
            var _loc_6:BaseSong = null;
            var _loc_3:* = (param1 as JSONResult).result.Songs as Array;
            var _loc_4:Array = [];
            if (_loc_3)
            {
                _loc_3.sortOn("Sort", Array.NUMERIC);
                for each (_loc_5 in _loc_3)
                {
                    
                    _loc_6 = new BaseSong();
                    _loc_6.songID = int(_loc_5.SongID);
                    _loc_6.songName = String(_loc_5.Name);
                    _loc_6.artistID = int(_loc_5.ArtistID);
                    _loc_6.artistName = String(_loc_5.ArtistName);
                    _loc_6.albumID = int(_loc_5.AlbumID);
                    _loc_6.albumName = String(_loc_5.AlbumName);
                    if (_loc_5.CoverArtFilename)
                    {
                        _loc_6.artFilename = String(_loc_5.CoverArtFilename);
                    }
                    if (int(_loc_5.EstimateDuration))
                    {
                        _loc_6.estimateDuration = int(_loc_5.EstimateDuration) * 1000;
                    }
                    _loc_4.push(_loc_6);
                }
            }
            queue.addItemsAt(_loc_4, index, playOnAdd);
            queue.lastPlaylistID = playlist.playlistID;
            this.dispatchEvent(new Event(Event.COMPLETE));
            return;
        }// end function

        private function serviceFault(param1:Object, param2:Object = null) : void
        {
            queue.dispatchEvent(new QueueEvent(QueueEvent.ERROR_ADDING_SONGS, QueueEvent.FAILED_TO_CREATE_SONGS, true, {playlist:this.playlist}));
            dispatchEvent(new Event("failed"));
            return;
        }// end function

    }
}
