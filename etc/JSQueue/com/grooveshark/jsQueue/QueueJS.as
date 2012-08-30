package com.grooveshark.jsQueue
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.framework.playback.commands.*;
    import com.grooveshark.jsQueue.commands.*;
    import com.grooveshark.jsonrpc.*;
    import flash.utils.*;
    import mx.events.*;

    final public class QueueJS extends Queue
    {
        var songCache:Dictionary;

        public function QueueJS(param1:IDualService, param2:Dictionary, param3:Boolean = true, param4:Boolean = false)
        {
            super(param1, param3, param4);
            this.songCache = param2;
            this.chunkSize = 1000;
            this.maxChunks = 1;
            return;
        }// end function

        override protected function generateGetAutoplaySong() : void
        {
            var _loc_1:* = new JSGetAutoplaySong(service, this);
            this.commandQueue.queueCommand(_loc_1);
            return;
        }// end function

        override function completeRemoveSongs(param1:Array) : void
        {
            var _loc_2:QueueSong = null;
            super.completeRemoveSongs(param1);
            for each (_loc_2 in param1)
            {
                
                _loc_2.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE, dirtySong);
            }
            return;
        }// end function

        public function createStoredQueue() : Object
        {
            var _loc_2:QueueSong = null;
            var _loc_3:Object = null;
            var _loc_1:Object = {};
            _loc_1.version = 1;
            _loc_1.queueID = this.queueID;
            _loc_1.lastPlaylistID = this.lastPlaylistID;
            _loc_1.autoAutoplayDisabled = this.autoAutoplayDisabled;
            _loc_1.autoplayUserInitiated = this.autoplayUserInitiated;
            _loc_1.autoplayEnabled = this.autoplayEnabled;
            _loc_1.shuffleEnabled = this.shuffleEnabled;
            _loc_1.repeatMode = this.repeatMode;
            _loc_1.currentAutoplayTagID = this.currentAutoplayTag ? (this.currentAutoplayTag.tagID) : (0);
            _loc_1.currentTagMethod = this.currentTagMethod;
            _loc_1.crossfadeEnabled = this.crossfadeEnabled;
            _loc_1.crossfadeAmount = this.crossfadeAmount;
            _loc_1.crossfadeInOutEnabled = this.crossfadeInOutEnabled;
            _loc_1.activeSong = this.activeSong ? (this.activeSong.queueSongID) : (0);
            _loc_1.playedSongs = [];
            for each (_loc_2 in this.playedSongs)
            {
                
                if (_loc_2)
                {
                    _loc_1.playedSongs.push(_loc_2.queueSongID);
                }
            }
            _loc_1.pendingSongs = [];
            for each (_loc_2 in this.pendingSongs)
            {
                
                if (_loc_2)
                {
                    _loc_1.pendingSongs.push(_loc_2.queueSongID);
                }
            }
            _loc_1.songs = [];
            for each (_loc_2 in this)
            {
                
                if (_loc_2)
                {
                    _loc_3 = {};
                    _loc_3.songID = _loc_2.song.songID;
                    _loc_3.queueSongID = _loc_2.queueSongID;
                    _loc_3.autoplayVote = _loc_2._autoplayVote;
                    _loc_3.sponsoredAutoplayID = _loc_2.sponsoredAutoplayID;
                    _loc_3.source = _loc_2.source;
                    _loc_3.context = _loc_2.context;
                    _loc_1.songs.push(_loc_3);
                }
            }
            _loc_1.autoplayStatus = this.autoplayStatus ? (this.autoplayStatus.createStoredParams()) : (null);
            return _loc_1;
        }// end function

        override protected function generateAddSongsToQueue(param1:Array, param2:int, param3:Boolean, param4:Boolean, param5:Object) : void
        {
            var _loc_6:* = new JSAddSongsToQueue(service, this, param1, param2, param3, param4, param5);
            this.commandQueue.queueCommand(_loc_6);
            return;
        }// end function

        private function dirtySong(event:PropertyChangeEvent) : void
        {
            var _loc_2:* = event.currentTarget as QueueSong;
            if (_loc_2)
            {
                switch(event.property)
                {
                    case "queueSongID":
                    case "autoplayVote":
                    case "source":
                    case "sponsoredAutoplayID":
                    case "songID":
                    case "songName":
                    case "artistID":
                    case "artistName":
                    case "albumID":
                    case "albumName":
                    case "estimateDuration":
                    {
                        this.dispatchEvent(new SongEvent(SongEvent.SONG_DIRTY, _loc_2));
                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }
            return;
        }// end function

        override protected function generateVerifyAutoplay(param1:Boolean = true, param2:Object = null) : void
        {
            var _loc_3:* = new JSVerifyAutoplay(service, this, param1, param2);
            this.commandQueue.queueCommand(_loc_3);
            return;
        }// end function

        override function completeAddSongsAt(param1:Array, param2:int, param3:Boolean, param4:Boolean, param5:QueueSong = null) : void
        {
            var _loc_6:QueueSong = null;
            super.completeAddSongsAt(param1, param2, param3, param4, param5);
            for each (_loc_6 in param1)
            {
                
                _loc_6.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, dirtySong);
            }
            return;
        }// end function

        override protected function generateRefreshPendingAutoplaySong(param1:QueueSong, param2:Boolean = false) : void
        {
            var _loc_3:* = new JSRefreshPendingAutoplaySong(service, this, param1, param2);
            this.commandQueue.queueCommand(_loc_3);
            return;
        }// end function

        override public function addItemsFromPlaylistAt(param1:BasePlaylist, param2:int = -1, param3:Boolean = false) : void
        {
            throw new Error("QueueJS does not support adding playlists, add as songs instead");
        }// end function

        public static function createFromStoredQueue(param1:Object, param2:Dictionary, param3:IDualService, param4:Boolean = false, param5:Boolean = false) : QueueJS
        {
            var _loc_8:Object = null;
            var _loc_9:int = 0;
            var _loc_10:Object = null;
            var _loc_11:BaseSong = null;
            var _loc_12:QueueSong = null;
            var _loc_13:Array = null;
            var _loc_6:QueueJS = null;
            var _loc_7:int = 0;
            if (param1 && param1.version == 1)
            {
                _loc_6 = new QueueJS(param3, param2, param4, false);
                for each (_loc_8 in param1.songs)
                {
                    
                    _loc_11 = param2[int(_loc_8.songID)];
                    if (_loc_11)
                    {
                        _loc_12 = new QueueSong(_loc_11, _loc_6, param3);
                        _loc_12.queueSongID = int(_loc_8.queueSongID);
                        _loc_12._autoplayVote = int(_loc_8.autoplayVote);
                        _loc_12.sponsoredAutoplayID = int(_loc_8.sponsoredAutoplayID);
                        _loc_12.source = String(_loc_8.source);
                        if (_loc_8.context)
                        {
                            _loc_12.context = _loc_8.context;
                        }
                        _loc_6.source.push(_loc_12);
                        _loc_12.addEventListener(PlayableSongEvent.SONG_FLAGGED, _loc_6.onSongFlagged);
                        _loc_12.addEventListener(PlayableSongEvent.SONG_VOTE_FAILED, _loc_6.onSongVoteFailed);
                        _loc_12.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, _loc_6.dirtySong);
                        _loc_13 = _loc_6.queueSongLookupBySongID[_loc_12.song.songID];
                        if (_loc_13)
                        {
                            _loc_13.push(_loc_12);
                        }
                        else
                        {
                            _loc_6.queueSongLookupBySongID[_loc_12.song.songID] = [_loc_12];
                        }
                        _loc_6.queueSongLookupByQueueSongID[_loc_12.queueSongID] = _loc_12;
                        if (_loc_12.queueSongID > _loc_7)
                        {
                            _loc_7 = _loc_12.queueSongID;
                        }
                    }
                }
                for each (_loc_9 in param1.playedSongs)
                {
                    
                    _loc_12 = _loc_6.queueSongLookupByQueueSongID[_loc_9];
                    if (_loc_12)
                    {
                        _loc_6.playedSongs.push(_loc_12);
                    }
                }
                for each (_loc_9 in param1.pendingSongs)
                {
                    
                    _loc_12 = _loc_6.queueSongLookupByQueueSongID[_loc_9];
                    if (_loc_12)
                    {
                        _loc_6.pendingSongs.push(_loc_12);
                    }
                }
                _loc_6.queueID = String(param1.queueID);
                _loc_6.lastPlaylistID = int(param1.lastPlaylistID);
                _loc_6.autoAutoplayDisabled = Boolean(param1.autoAutoplayDisabled);
                _loc_6.shuffleEnabled = Boolean(param1.shuffleEnabled);
                _loc_6.repeatMode = int(param1.repeatMode);
                _loc_6.crossfadeEnabled = Boolean(param1.crossfadeEnabled);
                _loc_10 = param1.crossfadeAmount;
                if (_loc_10 != null)
                {
                    _loc_6.crossfadeAmount = int(_loc_10);
                }
                _loc_6.crossfadeInOutEnabled = Boolean(param1.crossfadeInOutEnabled);
                if (param1.currentAutoplayTagID)
                {
                    _loc_6.currentAutoplayTag = Tag.tagIDLookup[param1.currentAutoplayTagID];
                }
                if (param1.currentTagMethod)
                {
                    _loc_6.currentTagMethod = param1.currentTagMethod;
                }
                _loc_12 = _loc_6.queueSongLookupByQueueSongID[int(param1.activeSong)];
                if (_loc_12)
                {
                    _loc_6._activeSong = _loc_12;
                }
                else if (_loc_6.length)
                {
                    _loc_6._activeSong = _loc_6.getItemAt(0) as QueueSong;
                }
                for each (_loc_12 in _loc_6)
                {
                    
                    _loc_12.recalcEligibleForAutoplayRemoval();
                }
                _loc_6.autoplayStatus = AutoplayStatus.createFromStoredParams(_loc_6, param1.autoplayStatus);
                if (param5)
                {
                    _loc_6.setAutoplayEnabled(true, Boolean(param1.autoplayUserInitiated), false);
                }
                else
                {
                    _loc_6._autoplayEnabled = Boolean(param1.autoplayEnabled);
                    _loc_6.autoplayUserInitiated = Boolean(param1.autoplayUserInitiated);
                }
            }
            _loc_6.songCount = _loc_7 + 1;
            return _loc_6;
        }// end function

    }
}
