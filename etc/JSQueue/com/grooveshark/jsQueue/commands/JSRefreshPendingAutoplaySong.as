package com.grooveshark.jsQueue.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.framework.playback.commands.*;
    import com.grooveshark.jsQueue.*;
    import com.grooveshark.jsonrpc.*;

    public class JSRefreshPendingAutoplaySong extends RefreshPendingAutoplaySong
    {

        public function JSRefreshPendingAutoplaySong(param1:IDualService, param2:Queue, param3:QueueSong, param4:Boolean = false)
        {
            super(param1, param2, param3, param4);
            return;
        }// end function

        override protected function makeSongFromRaw(param1:Object) : BaseSong
        {
            var _loc_3:Array = null;
            var _loc_2:* = (queue as QueueJS).songCache[int(param1.SongID)];
            if (!_loc_2)
            {
                _loc_2 = new BaseSong();
                _loc_2.songID = param1.SongID;
                _loc_2.songName = param1.SongName;
                _loc_2.artistID = param1.ArtistID;
                _loc_2.artistName = param1.ArtistName;
                _loc_2.albumID = param1.AlbumID;
                _loc_2.albumName = param1.AlbumName;
                _loc_2.estimateDuration = int(param1.EstimateDuration) * 1000;
                _loc_2.flags = int(param1.Flags);
                if (param1.CoverArtUrl)
                {
                    _loc_3 = String(param1.CoverArtUrl).split("/");
                    if (_loc_3.length)
                    {
                        _loc_2.artFilename = String(_loc_3[(_loc_3.length - 1)]).substring(1);
                    }
                }
                (queue as QueueJS).songCache[_loc_2.songID] = _loc_2;
            }
            else if (param1.CoverArtUrl)
            {
                _loc_3 = String(param1.CoverArtUrl).split("/");
                if (_loc_3.length)
                {
                    _loc_2.artFilename = String(_loc_3[(_loc_3.length - 1)]).substring(1);
                }
            }
            return _loc_2;
        }// end function

    }
}
