package com.grooveshark.framework.playback
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.commands.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;
    import mx.events.*;

    public class Queue extends ListCollectionView
    {
        protected var _currentTagMethod:String = "autoplayGetSong";
        private var _1796994653lastPlaylistID:int;
        private var _1117335380previousSong:QueueSong;
        private var _37396582hasPreviousSong:Boolean = false;
        var chunkSize:int = 100;
        var source:Array;
        var queueSongLookupBySongID:Object;
        var pendingAdds:int = 0;
        var maxChunks:int = 10;
        protected var _shuffleEnabled:Boolean = false;
        var autoplayStatus:AutoplayStatus = null;
        protected var _crossfadeEnabled:Boolean = false;
        private var __activeSong:QueueSong;
        private var _repeatMode:int = 0;
        protected var __autoplayEnabled:Boolean = false;
        var commandQueue:CommandQueue;
        var queueSongLookupByQueueSongID:Object;
        private var _crossfadeSongStopTimer:Timer;
        private var _655172076queueID:String;
        protected var _currentAutoplayTag:Tag;
        var pendingSongs:Array;
        protected var service:IDualService;
        var lastFailedAutoplayRequest:int;
        private var crossfadeNewAmount:int;
        var autoplayUserInitiated:Boolean = false;
        private var _3866466hasNextSong:Boolean = false;
        private var _crossfadeRunning:Boolean = false;
        protected var prefetchedSongs:Array;
        private var _1424376488nextSong:QueueSong;
        private var crossfadeAmountChanged:Boolean = false;
        var playedSongs:Array;
        var consecutiveFailedAutoplayRequests:int;
        private var _crossfadeSong:QueueSong;
        protected var _crossfadeInOutEnabled:Boolean = false;
        var songCount:int = 1;
        private var _crossfadeAmount:int = 5000;
        public static const INDEX_LAST:int = -3;
        private static var _staticBindingEventDispatcher:EventDispatcher = new EventDispatcher();
        private static var _1923488829userTrackingID:Number = 0;
        static var streamKeys:Object = {};
        private static var _200723786prefetchEnabled:Boolean = true;
        public static const INDEX_DEFAULT:int = -1;
        public static const REPEAT_NONE:int = 0;
        public static const REPEAT_ALL:int = 1;
        public static const INDEX_NEXT:int = -2;
        public static const REPEAT_ONE:int = 2;
        public static const CROSSFADE_STEPS:int = 6;
        static const INDEX_RELATIVE:int = -4;

        public function Queue(param1:IDualService, param2:Boolean = false, param3:Boolean = true)
        {
            var _loc_5:InitiateQueue = null;
            source = [];
            playedSongs = [];
            pendingSongs = [];
            prefetchedSongs = [];
            queueSongLookupBySongID = {};
            queueSongLookupByQueueSongID = {};
            commandQueue = new CommandQueue();
            this.service = param1;
            this.autoAutoplayDisabled = param2;
            if (param3)
            {
                _loc_5 = new InitiateQueue(param1, this);
                this.commandQueue.queueCommand(_loc_5);
            }
            var _loc_4:* = this.crossfadeAmount as Number;
            this.crossfadeSongStopTimer = new Timer(1 / CROSSFADE_STEPS * 1000, CROSSFADE_STEPS * _loc_4 / 1000);
            return;
        }// end function

        protected function generateTurnOffAutoplay() : void
        {
            var _loc_1:* = new TurnOffAutoplay(service, this);
            this.commandQueue.queueCommand(_loc_1);
            return;
        }// end function

        private function set _1799419675crossfadeEnabled(param1:Boolean) : void
        {
            var _loc_2:Boolean = false;
            if (param1 != _crossfadeEnabled)
            {
                _loc_2 = _crossfadeEnabled;
                _crossfadeEnabled = param1;
                dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "crossfadeEnabled", _loc_2, param1));
            }
            return;
        }// end function

        public function set currentIndex(param1:int) : void
        {
            var _loc_2:* = this.currentIndex;
            if (_loc_2 !== param1)
            {
                this._1448410841currentIndex = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "currentIndex", _loc_2, param1));
            }
            return;
        }// end function

        public function get shuffleEnabled() : Boolean
        {
            return _shuffleEnabled;
        }// end function

        protected function get adjustedActiveSongIndex() : int
        {
            var _loc_1:int = 0;
            if (!_activeSong)
            {
                return -1;
            }
            if (_shuffleEnabled)
            {
                _loc_1 = playedSongs.indexOf(_activeSong);
                return _loc_1 != -1 ? (_loc_1) : (0);
            }
            else
            {
                return source.indexOf(_activeSong);
            }
        }// end function

        private function properlyOrderSongs(param1:Array) : Array
        {
            var _loc_3:QueueSong = null;
            var _loc_2:Array = [];
            for each (_loc_3 in this)
            {
                
                if (param1.indexOf(_loc_3) != -1)
                {
                    _loc_2.push(_loc_3);
                }
            }
            return _loc_2;
        }// end function

        function completeAddSongsAt(param1:Array, param2:int, param3:Boolean, param4:Boolean, param5:QueueSong = null) : void
        {
            var _loc_9:QueueSong = null;
            var _loc_10:String = null;
            var _loc_11:int = 0;
            var _loc_12:int = 0;
            var _loc_13:QueueSong = null;
            var _loc_14:Array = null;
            var _loc_15:PropertyChangeEvent = null;
            var _loc_16:int = 0;
            var _loc_17:QueueSong = null;
            if (!param1.length)
            {
                return;
            }
            var _loc_6:Boolean = false;
            if (_shuffleEnabled && this.length == 0)
            {
                _loc_6 = true;
            }
            var _loc_7:* = (param1[0] as QueueSong).source == "user";
            if (param2 >= 0)
            {
                _loc_10 = "index";
            }
            else if (_loc_7 && param2 == Queue.INDEX_RELATIVE && param5 && this.contains(param5))
            {
                _loc_10 = "relative";
            }
            else if (_loc_7 && _activeSong && (param2 == Queue.INDEX_NEXT || param2 == Queue.INDEX_DEFAULT && param3))
            {
                _loc_10 = "next";
            }
            else
            {
                _loc_10 = "last";
            }
            switch(_loc_10)
            {
                case "index":
                {
                    _loc_11 = param2;
                    break;
                }
                case "relative":
                {
                    _loc_11 = source.indexOf(param5) + 1;
                    break;
                }
                case "next":
                {
                    if (_activeSong.playStatus == PlayableSong.PLAY_STATUS_NONE && !_activeSong.lastStreamKey)
                    {
                        _loc_11 = source.indexOf(_activeSong);
                    }
                    else
                    {
                        _loc_11 = source.indexOf(_activeSong) + 1;
                    }
                    break;
                }
                case "last":
                {
                }
                default:
                {
                    if (_loc_7)
                    {
                        _loc_11 = this.lengthAdjustedForAutoplay;
                    }
                    else
                    {
                        _loc_11 = this.length;
                    }
                    break;
                    break;
                }
            }
            source = insertItemsAtIndex(source, param1, _loc_11);
            if (_shuffleEnabled)
            {
                if (_loc_6)
                {
                    setupShuffle(true);
                }
                else
                {
                    _loc_12 = -1;
                    if (_loc_10 == "relative")
                    {
                        _loc_12 = playedSongs.indexOf(param5);
                    }
                    else if (_loc_10 == "next")
                    {
                        _loc_12 = adjustedActiveSongIndex;
                    }
                    if (_loc_12 == -1)
                    {
                        for each (_loc_13 in param1)
                        {
                            
                            pendingSongs.push(_loc_13);
                        }
                    }
                    else
                    {
                        playedSongs = insertItemsAtIndex(playedSongs, randomizeArray(param1), (_loc_12 + 1));
                    }
                }
            }
            var _loc_8:* = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE);
            new CollectionEvent(CollectionEvent.COLLECTION_CHANGE).kind = CollectionEventKind.ADD;
            _loc_8.location = _loc_11;
            _loc_8.items = param1;
            this.dispatchEvent(_loc_8);
            for each (_loc_9 in param1)
            {
                
                _loc_9.addEventListener(PlayableSongEvent.SONG_FLAGGED, onSongFlagged);
                _loc_9.addEventListener(PlayableSongEvent.SONG_VOTE_FAILED, onSongVoteFailed);
                _loc_14 = queueSongLookupBySongID[_loc_9.song.songID];
                if (_loc_14)
                {
                    _loc_14.push(_loc_9);
                }
                else
                {
                    queueSongLookupBySongID[_loc_9.song.songID] = [_loc_9];
                }
                queueSongLookupByQueueSongID[_loc_9.queueSongID] = _loc_9;
                _loc_15 = new PropertyChangeEvent(PropertyChangeEvent.PROPERTY_CHANGE);
                _loc_15.property = _loc_11;
                _loc_15.newValue = _loc_9;
                this.dispatchEvent(_loc_15);
                _loc_11++;
            }
            if (param3)
            {
                if (_shuffleEnabled && param1.length > 1)
                {
                    _loc_16 = Math.floor(Math.random() * param1.length);
                    this.playSong(param1[_loc_16], false, this.crossfadeEnabled);
                }
                else
                {
                    this.playSong(param1[0], false, this.crossfadeEnabled);
                }
            }
            else if (!_activeSong)
            {
                _activeSong = param1[0];
            }
            recalcHasNextPrev();
            if (autoplayStatus)
            {
                autoplayStatus.songsAddedToQueue(param1);
            }
            if (this.autoplayEnabled && (param1[0] as QueueSong).source == "user")
            {
                _loc_17 = source[(source.length - 1)] as QueueSong;
                if (_loc_17 && _loc_17.eligibleForAutoplayRemoval)
                {
                    generateRefreshPendingAutoplaySong(_loc_17);
                }
            }
            else if (!autoAutoplayDisabled || param4)
            {
                setAutoplayEnabled(true, param4);
            }
            return;
        }// end function

        public function stop() : void
        {
            if (_activeSong)
            {
                _activeSong.stop();
            }
            if (_crossfadeSong && _crossfadeSong.playStatus === PlayableSong.PLAY_STATUS_PLAYING)
            {
                crossfadeSongStop();
            }
            return;
        }// end function

        public function set shuffleEnabled(param1:Boolean) : void
        {
            var _loc_2:* = this.shuffleEnabled;
            if (_loc_2 !== param1)
            {
                this._342671880shuffleEnabled = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "shuffleEnabled", _loc_2, param1));
            }
            return;
        }// end function

        public function playPreviousSong(param1:Boolean = false) : void
        {
            var _loc_2:* = this.crossfadeAmount < 5 ? (5) : (this.crossfadeAmount);
            if (!param1 && _activeSong && _activeSong.position > _loc_2)
            {
                playSong(_activeSong, true, false);
                return;
            }
            if (crossfadeSongStopTimer && crossfadeSongStopTimer.running)
            {
                stopCrossfade();
                crossfadeSongStop();
                _activeSong.soundVolume = Number(1);
            }
            var _loc_3:* = determinePreviousSong();
            if (_loc_3)
            {
                playSong(_loc_3, true);
            }
            return;
        }// end function

        private function set _2043934011activeSong(param1:QueueSong) : void
        {
            return;
        }// end function

        public function playNextSong() : void
        {
            var _loc_2:* = undefined;
            if (this._activeSong && this.autoplayEnabled)
            {
                switch(this._activeSong.playStatus)
                {
                    case PlayableSong.PLAY_STATUS_INITIALIZING:
                    case PlayableSong.PLAY_STATUS_LOADING:
                    case PlayableSong.PLAY_STATUS_BUFFERING:
                    case PlayableSong.PLAY_STATUS_PLAYING:
                    {
                        _loc_2 = new MarkSongSkipped(service, this._activeSong);
                        this.commandQueue.queueCommand(_loc_2);
                    }
                    default:
                    {
                        break;
                    }
                }
            }
            var _loc_1:* = determineNextSong();
            if (crossfadeSongStopTimer && crossfadeSongStopTimer.running)
            {
                stopCrossfade();
                crossfadeSongStop();
                _activeSong.soundVolume = Number(1);
            }
            if (_loc_1)
            {
                playSong(_loc_1, true);
            }
            else if (this.autoplayEnabled)
            {
                generateGetAutoplaySong();
            }
            return;
        }// end function

        function get _autoplayEnabled() : Boolean
        {
            return __autoplayEnabled;
        }// end function

        override public function contains(param1:Object) : Boolean
        {
            return source.indexOf(param1) != -1;
        }// end function

        protected function generateRemoveSongsFromQueue(param1:Array, param2:Boolean) : void
        {
            var _loc_3:* = new RemoveSongsFromQueue(service, this, param1, param2);
            this.commandQueue.queueCommand(_loc_3);
            return;
        }// end function

        public function set queueID(param1:String) : void
        {
            var _loc_2:* = this._655172076queueID;
            if (_loc_2 !== param1)
            {
                this._655172076queueID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "queueID", _loc_2, param1));
            }
            return;
        }// end function

        public function resume() : void
        {
            if (_activeSong)
            {
                _activeSong.resume();
            }
            return;
        }// end function

        public function resetPendingAutoplaySuggestion(param1:Boolean = false) : void
        {
            generateRefreshPendingAutoplaySong(QueueSong(source[(source.length - 1)]), param1);
            return;
        }// end function

        public function seekInCurrentSong(param1:int) : void
        {
            if (_activeSong)
            {
                _activeSong.seekTo(param1);
            }
            return;
        }// end function

        public function addItemsAt(param1:Array, param2:int = -1, param3:Boolean = false, param4:Boolean = false, param5:Object = null) : void
        {
            var _loc_6:* = param1.splice(0, chunkSize * maxChunks);
            generateAddSongsToQueue(_loc_6, param2, param3, param4, param5);
            if (param1.length)
            {
                this.dispatchEvent(new QueueEvent(QueueEvent.ERROR_ADDING_SONGS, QueueEvent.TOO_MANY_SONGS, false, {songs:param1}));
            }
            return;
        }// end function

        public function get crossfadeAmount() : int
        {
            return _crossfadeAmount;
        }// end function

        protected function get lengthAdjustedForAutoplay() : int
        {
            var _loc_2:QueueSong = null;
            if (!_autoplayEnabled)
            {
                return this.length;
            }
            var _loc_1:int = 0;
            for each (_loc_2 in this)
            {
                
                if (!_loc_2.eligibleForAutoplayRemoval)
                {
                    _loc_1++;
                }
            }
            return _loc_1;
        }// end function

        private function checkForNeededAutoplay() : void
        {
            if (!this.autoplayEnabled)
            {
                return;
            }
            if (!this.hasNextSong)
            {
                generateGetAutoplaySong();
            }
            return;
        }// end function

        public function get activeSong() : QueueSong
        {
            return __activeSong;
        }// end function

        protected function onSongFlagged(event:PlayableSongEvent) : void
        {
            var _loc_2:* = event.currentTarget as QueueSong;
            if (_loc_2)
            {
                if (event.code < 4 && this.contains(_loc_2))
                {
                    this.removeItem(_loc_2);
                }
                dispatchEvent(new QueueEvent(QueueEvent.SONG_FLAGGED, "", true, {song:_loc_2}));
                if (this.autoplayStatus)
                {
                    this.autoplayStatus.songFlagged(_loc_2);
                }
            }
            return;
        }// end function

        protected function randomizeArray(param1:Array) : Array
        {
            var _loc_4:int = 0;
            var _loc_5:Object = null;
            var _loc_2:* = param1.concat();
            var _loc_3:Array = [];
            while (_loc_2.length)
            {
                
                _loc_4 = Math.floor(Math.random() * _loc_2.length);
                _loc_5 = _loc_2.splice(_loc_4, 1)[0];
                _loc_3.push(_loc_5);
            }
            return _loc_3;
        }// end function

        protected function onSongComplete(event:PlayableSongEvent) : void
        {
            var _loc_2:* = event.currentTarget as QueueSong;
            dispatchEvent(new QueueEvent(QueueEvent.SONG_COMPLETE, "", false, {song:event.currentTarget}));
            if (this.repeatMode == Queue.REPEAT_ONE)
            {
                playSong(_loc_2);
            }
            else if (_loc_2 === _crossfadeSong)
            {
                this.removeEventListeners(this._crossfadeSong);
                _crossfadeSong = null;
            }
            else if (this.hasNextSong)
            {
                if (this.crossfadeEnabled && event.code == PlayableSongEvent.COMPLETE_FORCE_FROWN_SKIP && _loc_2.playStatus == PlayableSong.PLAY_STATUS_COMPLETED)
                {
                    this.crossfadeSong = _loc_2;
                }
                playNextSong();
            }
            return;
        }// end function

        private function set _1448410841currentIndex(param1:int) : void
        {
            return;
        }// end function

        protected function set crossfadeSong(param1:QueueSong) : void
        {
            var _loc_2:* = this.crossfadeSong;
            if (_loc_2 !== param1)
            {
                this._1342440975crossfadeSong = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "crossfadeSong", _loc_2, param1));
            }
            return;
        }// end function

        public function set lastPlaylistID(param1:int) : void
        {
            var _loc_2:* = this._1796994653lastPlaylistID;
            if (_loc_2 !== param1)
            {
                this._1796994653lastPlaylistID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "lastPlaylistID", _loc_2, param1));
            }
            return;
        }// end function

        private function set _1593680990currentTagMethod(param1:String) : void
        {
            _currentTagMethod = param1;
            return;
        }// end function

        public function moveItemsTo(param1:Array, param2:int) : void
        {
            var _loc_4:QueueSong = null;
            var _loc_5:int = 0;
            var _loc_6:Array = null;
            var _loc_7:CollectionEvent = null;
            param1 = properlyOrderSongs(param1);
            var _loc_3:* = param2;
            for each (_loc_4 in param1)
            {
                
                _loc_5 = source.indexOf(_loc_4);
                if (_loc_5 != -1 && _loc_5 != param2)
                {
                    _loc_6 = source.slice(0, param2).concat(_loc_4).concat(source.slice(param2));
                    if (_loc_5 < param2)
                    {
                        _loc_6.splice(_loc_6.indexOf(_loc_4), 1);
                    }
                    else
                    {
                        _loc_6.splice(_loc_6.lastIndexOf(_loc_4), 1);
                    }
                    source = _loc_6;
                    _loc_7 = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE);
                    _loc_7.kind = CollectionEventKind.MOVE;
                    _loc_7.location = source.indexOf(_loc_4);
                    _loc_7.oldLocation = _loc_5;
                    this.dispatchEvent(_loc_7);
                }
            }
            recalcHasNextPrev();
            return;
        }// end function

        public function set currentTagMethod(param1:String) : void
        {
            var _loc_2:* = this.currentTagMethod;
            if (_loc_2 !== param1)
            {
                this._1593680990currentTagMethod = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "currentTagMethod", _loc_2, param1));
            }
            return;
        }// end function

        public function setActiveSong(param1:QueueSong) : Boolean
        {
            if (!this.contains(param1))
            {
                return false;
            }
            this.stop();
            this._activeSong = param1;
            return true;
        }// end function

        function set _autoplayEnabled(param1:Boolean) : void
        {
            var _loc_2:* = this._autoplayEnabled;
            if (_loc_2 !== param1)
            {
                this._491406817_autoplayEnabled = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "gs_queue::_autoplayEnabled", _loc_2, param1));
            }
            return;
        }// end function

        public function set nextSong(param1:QueueSong) : void
        {
            var _loc_2:* = this._1424376488nextSong;
            if (_loc_2 !== param1)
            {
                this._1424376488nextSong = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "nextSong", _loc_2, param1));
            }
            return;
        }// end function

        override public function removeItemAt(param1:int) : Object
        {
            return null;
        }// end function

        protected function recalcHasNextPrev() : void
        {
            if (!this.length)
            {
                var _loc_2:Boolean = false;
                this.hasPreviousSong = false;
                this.hasNextSong = _loc_2;
                return;
            }
            var _loc_1:* = this.adjustedActiveSongIndex;
            this.hasPreviousSong = repeatMode == Queue.REPEAT_ALL || _loc_1 >= 1;
            this.hasNextSong = repeatMode == Queue.REPEAT_ALL || _loc_1 != -1 && _loc_1 < (this.length - 1);
            determinePreviousSong();
            determineNextSong();
            checkForNeededAutoplay();
            return;
        }// end function

        protected function generateGetAutoplaySong() : void
        {
            var _loc_1:* = new GetAutoplaySong(service, this);
            this.commandQueue.queueCommand(_loc_1);
            return;
        }// end function

        public function startTagAutoplay(param1:Tag, param2:Boolean, param3:String = "autoplayGetSong") : void
        {
            stopTagAutoplay();
            var _loc_4:* = new GetArtistsForTagAutoplay(service, this, param1, param2, param3);
            this.commandQueue.queueCommand(_loc_4);
            return;
        }// end function

        public function get autoplayEnabled() : Boolean
        {
            return __autoplayEnabled;
        }// end function

        public function set previousSong(param1:QueueSong) : void
        {
            var _loc_2:* = this._1117335380previousSong;
            if (_loc_2 !== param1)
            {
                this._1117335380previousSong = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "previousSong", _loc_2, param1));
            }
            return;
        }// end function

        function determineNextSong() : QueueSong
        {
            var _loc_3:Number = NaN;
            var _loc_4:int = 0;
            var _loc_1:QueueSong = null;
            var _loc_2:* = this.adjustedActiveSongIndex;
            if (_loc_2 >= (this.length - 1))
            {
                if (this.repeatMode == Queue.REPEAT_ALL)
                {
                    if (_shuffleEnabled)
                    {
                        _loc_1 = playedSongs[0];
                    }
                    else
                    {
                        _loc_1 = source[0];
                    }
                }
            }
            else if (_shuffleEnabled)
            {
                if (_loc_2 < (playedSongs.length - 1))
                {
                    _loc_1 = playedSongs[(_loc_2 + 1)];
                }
                else
                {
                    _loc_3 = Math.random();
                    _loc_4 = Math.floor(_loc_3 * pendingSongs.length);
                    _loc_1 = pendingSongs.splice(_loc_4, 1)[0];
                    playedSongs.push(_loc_1);
                }
            }
            else
            {
                _loc_1 = source[(_loc_2 + 1)];
            }
            this.nextSong = _loc_1;
            return _loc_1;
        }// end function

        protected function get crossfadeRunning() : Boolean
        {
            return _crossfadeRunning;
        }// end function

        public function set repeatMode(param1:int) : void
        {
            var _loc_2:* = this.repeatMode;
            if (_loc_2 !== param1)
            {
                this._1159370206repeatMode = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "repeatMode", _loc_2, param1));
            }
            return;
        }// end function

        public function get hasPreviousSong() : Boolean
        {
            return this._37396582hasPreviousSong;
        }// end function

        public function set crossfadeAmount(param1:int) : void
        {
            var _loc_2:* = this.crossfadeAmount;
            if (_loc_2 !== param1)
            {
                this._2112713164crossfadeAmount = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "crossfadeAmount", _loc_2, param1));
            }
            return;
        }// end function

        protected function removeEventListeners(param1:QueueSong) : void
        {
            param1.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onSongPropChange);
            param1.removeEventListener(PlayableSongEvent.COMPLETE, onSongComplete);
            param1.removeEventListener(PlayableSongEvent.ERROR, onSongError);
            param1.removeEventListener(PlayableSongEvent.PLAYBACK_BEGUN, onSongPlayback);
            return;
        }// end function

        public function crossfadeSongVolume(event:TimerEvent = null) : void
        {
            var _loc_2:Number = NaN;
            var _loc_3:Number = NaN;
            if (_crossfadeSong)
            {
                _loc_2 = 1 / (CROSSFADE_STEPS * crossfadeAmount / 1000);
                _crossfadeSong.soundVolume = _crossfadeSong.soundVolume >= _loc_2 ? (_crossfadeSong.soundVolume - _loc_2) : (0);
            }
            if (_activeSong)
            {
                _loc_3 = 1 / (CROSSFADE_STEPS * crossfadeAmount * 0.8 / 1000);
                _activeSong.soundVolume = _activeSong.soundVolume <= 1 - _loc_3 ? (_activeSong.soundVolume + _loc_3) : (1);
            }
            return;
        }// end function

        override public function addItem(param1:Object) : void
        {
            return;
        }// end function

        public function addItemsFromPlaylistAt(param1:BasePlaylist, param2:int = -1, param3:Boolean = false) : void
        {
            var _loc_4:* = new AddSongsFromPlaylist(service, this, param1, param2, param3);
            this.commandQueue.queueCommand(_loc_4);
            return;
        }// end function

        public function set currentAutoplayTag(param1:Tag) : void
        {
            var _loc_2:* = this.currentAutoplayTag;
            if (_loc_2 !== param1)
            {
                this._35740674currentAutoplayTag = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "currentAutoplayTag", _loc_2, param1));
            }
            return;
        }// end function

        public function playSong(param1:Object = null, param2:Boolean = false, param3:Boolean = true) : void
        {
            var _loc_7:int = 0;
            var _loc_8:Array = null;
            var _loc_9:QueueSong = null;
            var _loc_10:int = 0;
            var _loc_11:int = 0;
            var _loc_12:int = 0;
            var _loc_4:Boolean = false;
            var _loc_5:* = this.adjustedActiveSongIndex;
            var _loc_6:Boolean = false;
            if (param3)
            {
                _loc_6 = this.crossfadeEnabled;
            }
            if (param1 is QueueSong)
            {
                if (this.contains(param1))
                {
                    if (_loc_6 && this._activeSong && param1 !== this._activeSong && this._activeSong.playStatus === PlayableSong.PLAY_STATUS_PLAYING)
                    {
                        this.crossfadeSong = this._activeSong;
                        param1.soundVolume = 0;
                    }
                    this._activeSong = param1 as QueueSong;
                    checkCacheAndPlaySong(this.activeSong);
                    _loc_4 = true;
                }
                else
                {
                    this.addItemsAt([(param1 as QueueSong).song], -1, true);
                }
            }
            else if (param1 is BaseSong || int(param1))
            {
                _loc_7 = param1 is BaseSong ? ((param1 as BaseSong).songID) : (int(param1));
                _loc_8 = this.queueSongLookupBySongID[_loc_7];
                if (_loc_8 && _loc_8.length)
                {
                    _loc_9 = _loc_8[0];
                    if (this.contains(_loc_9))
                    {
                        if (_loc_6 && this._activeSong && _loc_9 !== this._activeSong && this._activeSong.playStatus === PlayableSong.PLAY_STATUS_PLAYING)
                        {
                            this.crossfadeSong = this._activeSong;
                            _loc_9.soundVolume = 0;
                        }
                        this._activeSong = _loc_9;
                        checkCacheAndPlaySong(this.activeSong);
                        _loc_4 = true;
                    }
                    else
                    {
                        _loc_8.shift();
                        if (!_loc_8.length)
                        {
                            delete this.queueSongLookupBySongID[_loc_7];
                        }
                        this.addItemsAt([_loc_9.song], -1, true);
                    }
                }
                else
                {
                    this.addItemsAt([_loc_7], -1, true);
                }
            }
            else if (param1 == null)
            {
                if (this._activeSong)
                {
                    checkCacheAndPlaySong(this.activeSong);
                    _loc_4 = true;
                }
                else if (this.length)
                {
                    this._activeSong = source[0];
                    checkCacheAndPlaySong(this.activeSong);
                    _loc_4 = true;
                }
            }
            if (_loc_4)
            {
                if (_shuffleEnabled)
                {
                    _loc_10 = playedSongs.indexOf(this._activeSong);
                    _loc_11 = pendingSongs.indexOf(this._activeSong);
                    _loc_12 = _loc_5 + 1;
                    if (!param2 && _loc_10 != -1)
                    {
                        playedSongs.splice(_loc_10, 1);
                        if (_loc_10 < _loc_12)
                        {
                            _loc_12 = _loc_12 - 1;
                        }
                        playedSongs.splice(_loc_12, 0, this._activeSong);
                    }
                    else if (_loc_11 != -1)
                    {
                        pendingSongs.splice(_loc_11, 1);
                        playedSongs.splice(_loc_12, 0, this._activeSong);
                    }
                }
            }
            recalcHasNextPrev();
            return;
        }// end function

        public function enableCrossfade(param1:Boolean, param2:int = 5000, param3:Boolean = false) : void
        {
            if (param1 != crossfadeEnabled)
            {
                crossfadeEnabled = param1;
            }
            if (param2 != crossfadeAmount)
            {
                crossfadeAmount = param2;
            }
            if (param3 != crossfadeInOutEnabled)
            {
                crossfadeInOutEnabled = param3;
            }
            return;
        }// end function

        protected function onSongVoteFailed(event:PlayableSongEvent) : void
        {
            var _loc_2:* = event.currentTarget as QueueSong;
            if (_loc_2)
            {
                dispatchEvent(new QueueEvent(QueueEvent.AUTOPLAY_VOTE_ERROR, "", true, {song:_loc_2}));
            }
            return;
        }// end function

        private function set _35740674currentAutoplayTag(param1:Tag) : void
        {
            _currentAutoplayTag = param1;
            return;
        }// end function

        protected function set _1360958307crossfadeRunning(param1:Boolean) : void
        {
            if (param1 != _crossfadeRunning)
            {
                _crossfadeRunning = param1;
                if (!param1 && crossfadeAmountChanged && crossfadeNewAmount > 0)
                {
                    crossfadeAmount = crossfadeNewAmount;
                    crossfadeAmountChanged = false;
                    crossfadeNewAmount = 0;
                }
            }
            return;
        }// end function

        protected function startCrossfade() : void
        {
            if (crossfadeEnabled && crossfadeSongStopTimer)
            {
                if (crossfadeSongStopTimer.running)
                {
                    stopCrossfade();
                    crossfadeSongStop();
                }
                crossfadeSongStopTimer.reset();
                crossfadeSongStopTimer.start();
                crossfadeRunning = true;
            }
            return;
        }// end function

        protected function generateAddSongsToQueue(param1:Array, param2:int, param3:Boolean, param4:Boolean, param5:Object) : void
        {
            var _loc_6:* = new AddSongsToQueue(service, this, param1, param2, param3, param4, param5);
            this.commandQueue.queueCommand(_loc_6);
            return;
        }// end function

        override public function removeAll() : void
        {
            return;
        }// end function

        public function set activeSong(param1:QueueSong) : void
        {
            var _loc_2:* = this.activeSong;
            if (_loc_2 !== param1)
            {
                this._2043934011activeSong = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "activeSong", _loc_2, param1));
            }
            return;
        }// end function

        public function get hasNextSong() : Boolean
        {
            return this._3866466hasNextSong;
        }// end function

        public function crossfadeSongStop(event:TimerEvent = null) : void
        {
            if (_crossfadeSong)
            {
                _crossfadeSong.stop();
                _crossfadeSong.soundVolume = Number(1);
                this.removeEventListeners(_crossfadeSong);
                _crossfadeSong = null;
                crossfadeRunning = false;
            }
            crossfadeRunning = false;
            if (_activeSong && _activeSong.playStatus === PlayableSong.PLAY_STATUS_PLAYING)
            {
                _activeSong.soundVolume = 1;
            }
            return;
        }// end function

        protected function set _1519093106crossfadeSongStopTimer(param1:Timer) : void
        {
            if (param1 !== _crossfadeSongStopTimer)
            {
                if (_crossfadeSongStopTimer)
                {
                    _crossfadeSongStopTimer.removeEventListener(TimerEvent.TIMER, crossfadeSongVolume);
                    _crossfadeSongStopTimer.removeEventListener(TimerEvent.TIMER_COMPLETE, crossfadeSongStop);
                }
                _crossfadeSongStopTimer = param1;
                if (_crossfadeSongStopTimer)
                {
                    _crossfadeSongStopTimer.addEventListener(TimerEvent.TIMER, crossfadeSongVolume);
                    _crossfadeSongStopTimer.addEventListener(TimerEvent.TIMER_COMPLETE, crossfadeSongStop);
                }
            }
            return;
        }// end function

        protected function set _1342440975crossfadeSong(param1:QueueSong) : void
        {
            if (param1 !== _crossfadeSong)
            {
                if (_crossfadeSong)
                {
                    crossfadeSongStop();
                }
                _crossfadeSong = param1;
            }
            return;
        }// end function

        override public function toArray() : Array
        {
            return source.concat();
        }// end function

        protected function get crossfadeSongStopTimer() : Timer
        {
            return _crossfadeSongStopTimer;
        }// end function

        function set _491406817_autoplayEnabled(param1:Boolean) : void
        {
            var _loc_2:Boolean = false;
            if (param1 != __autoplayEnabled)
            {
                _loc_2 = __autoplayEnabled;
                __autoplayEnabled = param1;
                dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "autoplayEnabled", _loc_2, param1));
            }
            return;
        }// end function

        public function get currentTagMethod() : String
        {
            return _currentTagMethod;
        }// end function

        public function setAutoplayEnabled(param1:Boolean, param2:Boolean = false, param3:Boolean = true, param4:Object = null) : void
        {
            var _loc_5:InitiateQueue = null;
            if (param1 != _autoplayEnabled)
            {
                this.autoplayUserInitiated = param2;
                consecutiveFailedAutoplayRequests = 0;
                lastFailedAutoplayRequest = 0;
                if (param1)
                {
                    this.repeatMode = Queue.REPEAT_NONE;
                    this.shuffleEnabled = false;
                    this._autoplayEnabled = true;
                    if (!this.queueID)
                    {
                        _loc_5 = new InitiateQueue(service, this);
                        this.commandQueue.queueCommand(_loc_5);
                    }
                    generateVerifyAutoplay(param3, param4);
                }
                else
                {
                    this._autoplayEnabled = false;
                    generateTurnOffAutoplay();
                }
            }
            return;
        }// end function

        private function checkCacheAndPlaySong(param1:QueueSong) : void
        {
            var _loc_2:* = new Date().valueOf();
            var _loc_3:* = Queue.streamKeys[param1.song.songID];
            if (_loc_3)
            {
                delete Queue.streamKeys[param1.song.songID];
                if (_loc_3.expires > _loc_2)
                {
                    param1.play(_loc_3.streamKey, _loc_3.ip, _loc_3.serverID, _loc_3.uSecs);
                    return;
                }
            }
            param1.play();
            return;
        }// end function

        override public function setItemAt(param1:Object, param2:int) : Object
        {
            return null;
        }// end function

        public function get lastPlaylistID() : int
        {
            return this._1796994653lastPlaylistID;
        }// end function

        override public function getItemAt(param1:int, param2:int = 0) : Object
        {
            if (param1 < 0 || param1 >= source.length)
            {
                throw new RangeError("[Queue] Index " + param1 + " is out of bounds.");
            }
            return source[param1];
        }// end function

        public function get previousSong() : QueueSong
        {
            return this._1117335380previousSong;
        }// end function

        function determinePreviousSong() : QueueSong
        {
            var _loc_3:int = 0;
            var _loc_1:QueueSong = null;
            var _loc_2:* = this.adjustedActiveSongIndex;
            if (_loc_2 <= 0)
            {
                if (this.repeatMode == Queue.REPEAT_ALL)
                {
                    if (_shuffleEnabled)
                    {
                        if (pendingSongs.length)
                        {
                            _loc_3 = Math.floor(Math.random() * (pendingSongs.length - 1));
                            _loc_1 = pendingSongs.splice(_loc_3, 1)[0];
                            playedSongs.unshift(_loc_1);
                        }
                        else
                        {
                            _loc_1 = playedSongs[(playedSongs.length - 1)];
                        }
                    }
                    else
                    {
                        _loc_1 = source[(this.length - 1)];
                    }
                }
            }
            else if (_shuffleEnabled)
            {
                _loc_1 = playedSongs[(_loc_2 - 1)];
            }
            else
            {
                _loc_1 = source[(_loc_2 - 1)];
            }
            this.previousSong = _loc_1;
            return _loc_1;
        }// end function

        private function set _806131506autoAutoplayDisabled(param1:Boolean) : void
        {
            return;
        }// end function

        private function set _342671880shuffleEnabled(param1:Boolean) : void
        {
            if (param1 != _shuffleEnabled)
            {
                _shuffleEnabled = param1;
                if (this.length || !param1)
                {
                    setupShuffle(param1);
                }
                else
                {
                    setupShuffle(false);
                }
            }
            return;
        }// end function

        protected function onSongPropChange(event:PropertyChangeEvent) : void
        {
            var _loc_3:QueueSong = null;
            var _loc_2:* = event.currentTarget as QueueSong;
            if (event.property == "position" && _loc_2 !== _crossfadeSong)
            {
                if (Queue.prefetchEnabled && PlayableSong.consecutiveFailedStreamKeys == 0 && this.repeatMode != Queue.REPEAT_ONE && _loc_2.fileLoaded && _loc_2.position && _loc_2.duration && _loc_2.duration - _loc_2.position < 20000)
                {
                    _loc_3 = determineNextSong();
                    if (_loc_3 && _loc_3 !== activeSong)
                    {
                        _loc_3.load();
                        prefetchedSongs.push(_loc_3);
                        if (this.crossfadeEnabled && _loc_2.duration - _loc_2.position < this.crossfadeAmount)
                        {
                            if (_loc_3.playStatus != PlayableSong.PLAY_STATUS_PLAYING)
                            {
                                playNextSong();
                            }
                        }
                    }
                }
                if (_crossfadeSong && (_crossfadeSong.playStatus === PlayableSong.PLAY_STATUS_PLAYING || _activeSong && _activeSong.soundVolume < 1) && _loc_2 === _activeSong && _loc_2.position > this.crossfadeAmount + 1000 && _loc_2.duration - _loc_2.position > this.crossfadeAmount)
                {
                    crossfadeSongStop();
                    if (_activeSong)
                    {
                        _activeSong.soundVolume = Number(1);
                    }
                }
            }
            return;
        }// end function

        public function removeItem(param1:Object, param2:Boolean = true) : void
        {
            this.removeItems([param1], param2);
            return;
        }// end function

        public function stopTagAutoplay() : void
        {
            this.currentAutoplayTag = null;
            this.currentTagMethod = "autoplayGetSong";
            if (this.autoplayEnabled)
            {
                this.autoplayStatus.addTagArtistSeeds([]);
            }
            return;
        }// end function

        private function set _2112713164crossfadeAmount(param1:int) : void
        {
            var _loc_2:Number = NaN;
            if (param1 != _crossfadeAmount)
            {
                if (crossfadeRunning)
                {
                    crossfadeAmountChanged = true;
                    crossfadeNewAmount = param1;
                }
                else
                {
                    _loc_2 = param1 as Number;
                    this.crossfadeSongStopTimer = new Timer(1 / CROSSFADE_STEPS * 1000, CROSSFADE_STEPS * _loc_2 / 1000);
                    _crossfadeAmount = param1;
                }
            }
            return;
        }// end function

        override public function addItemAt(param1:Object, param2:int) : void
        {
            return;
        }// end function

        private function setupShuffle(param1:Boolean) : void
        {
            var _loc_2:QueueSong = null;
            var _loc_3:int = 0;
            if (param1)
            {
                playedSongs = [];
                pendingSongs = source.concat();
                _loc_2 = _activeSong;
                if (!_loc_2 || _loc_2.playStatus == PlayableSong.PLAY_STATUS_NONE || _loc_2.playStatus == PlayableSong.PLAY_STATUS_COMPLETED)
                {
                    _loc_3 = Math.floor(Math.random() * (pendingSongs.length - 1));
                    _loc_2 = pendingSongs[_loc_3];
                }
                pendingSongs.splice(pendingSongs.indexOf(_loc_2), 1);
                playedSongs.unshift(_loc_2);
                _activeSong = _loc_2;
            }
            else
            {
                playedSongs = [];
                pendingSongs = [];
            }
            recalcHasNextPrev();
            return;
        }// end function

        public function set hasNextSong(param1:Boolean) : void
        {
            var _loc_2:* = this._3866466hasNextSong;
            if (_loc_2 !== param1)
            {
                this._3866466hasNextSong = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "hasNextSong", _loc_2, param1));
            }
            return;
        }// end function

        private function set _1672751092crossfadeInOutEnabled(param1:Boolean) : void
        {
            if (param1 != crossfadeInOutEnabled)
            {
                _crossfadeInOutEnabled = param1;
                if (_activeSong)
                {
                    _activeSong.setFadeOptions(param1);
                }
            }
            return;
        }// end function

        protected function set crossfadeRunning(param1:Boolean) : void
        {
            var _loc_2:* = this.crossfadeRunning;
            if (_loc_2 !== param1)
            {
                this._1360958307crossfadeRunning = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "crossfadeRunning", _loc_2, param1));
            }
            return;
        }// end function

        override public function getItemIndex(param1:Object) : int
        {
            return source.indexOf(param1);
        }// end function

        public function get nextSong() : QueueSong
        {
            return this._1424376488nextSong;
        }// end function

        public function set autoplayEnabled(param1:Boolean) : void
        {
            var _loc_2:* = this.autoplayEnabled;
            if (_loc_2 !== param1)
            {
                this._764699742autoplayEnabled = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "autoplayEnabled", _loc_2, param1));
            }
            return;
        }// end function

        function set _activeSong(param1:QueueSong) : void
        {
            var _loc_2:* = this._activeSong;
            if (_loc_2 !== param1)
            {
                this._1162720550_activeSong = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "gs_queue::_activeSong", _loc_2, param1));
            }
            return;
        }// end function

        function set _1162720550_activeSong(param1:QueueSong) : void
        {
            var _loc_2:QueueSong = null;
            var _loc_3:QueueSong = null;
            if (param1 != __activeSong)
            {
                _loc_2 = __activeSong;
                if (__activeSong && __activeSong !== crossfadeSong)
                {
                    __activeSong.stop();
                    this.removeEventListeners(__activeSong);
                }
                __activeSong = param1;
                if (__activeSong)
                {
                    __activeSong.setFadeOptions(this.crossfadeInOutEnabled);
                    __activeSong.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onSongPropChange, false, 0, true);
                    __activeSong.addEventListener(PlayableSongEvent.COMPLETE, onSongComplete, false, 0, true);
                    __activeSong.addEventListener(PlayableSongEvent.ERROR, onSongError, false, 0, true);
                    __activeSong.addEventListener(PlayableSongEvent.PLAYBACK_BEGUN, onSongPlayback, false, 0, true);
                }
                else if (this._crossfadeSong && this._crossfadeSong.playStatus == PlayableSong.PLAY_STATUS_PLAYING && !this.crossfadeSongStopTimer.running)
                {
                    startCrossfade();
                }
                while (prefetchedSongs.length)
                {
                    
                    _loc_3 = prefetchedSongs.shift();
                    if (_loc_3 !== __activeSong && _loc_3 !== crossfadeSong)
                    {
                        _loc_3.stop();
                    }
                }
                recalcHasNextPrev();
                dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "activeSong", _loc_2, param1));
            }
            return;
        }// end function

        protected function generateVerifyAutoplay(param1:Boolean = true, param2:Object = null) : void
        {
            var _loc_3:* = new VerifyAutoplay(service, this, param1, param2);
            this.commandQueue.queueCommand(_loc_3);
            return;
        }// end function

        private function set _764699742autoplayEnabled(param1:Boolean) : void
        {
            return;
        }// end function

        public function set hasPreviousSong(param1:Boolean) : void
        {
            var _loc_2:* = this._37396582hasPreviousSong;
            if (_loc_2 !== param1)
            {
                this._37396582hasPreviousSong = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "hasPreviousSong", _loc_2, param1));
            }
            return;
        }// end function

        protected function onSongError(event:PlayableSongEvent) : void
        {
            var _loc_2:String = null;
            var _loc_3:Boolean = false;
            switch(event.code)
            {
                case PlayableSongEvent.FAILED_IO_ERROR:
                case PlayableSongEvent.FAILED_TOO_MANY_BAD_FRAMES:
                case PlayableSongEvent.FAILED_STREAMKEY_OTHER:
                case PlayableSongEvent.FAILED_UNKNOWN_SERVER_ERROR:
                {
                    switch(event.preErrorStatus)
                    {
                        case PlayableSong.PLAY_STATUS_INITIALIZING:
                        case PlayableSong.PLAY_STATUS_LOADING:
                        case PlayableSong.PLAY_STATUS_BUFFERING:
                        case PlayableSong.PLAY_STATUS_PLAYING:
                        {
                            _loc_3 = true;
                            break;
                        }
                        default:
                        {
                            break;
                        }
                    }
                    if (this.hasNextSong && _loc_3)
                    {
                        _loc_2 = QueueEvent.UNKNOWN_HAS_NEXT;
                    }
                    else
                    {
                        _loc_2 = QueueEvent.UNKNOWN_STOPPING;
                    }
                    break;
                }
                case PlayableSongEvent.FAILED_STREAMKEY_LIMIT:
                {
                    _loc_2 = QueueEvent.RATE_LIMIT_EXCEEDED;
                    break;
                }
                case PlayableSongEvent.FAILED_TOO_MANY_STREAMKEY_FAILS:
                {
                    _loc_2 = QueueEvent.TOO_MANY_FAILURES;
                    break;
                }
                case PlayableSongEvent.WARNING_FREQUENT_BUFFERING:
                {
                    break;
                }
                default:
                {
                    break;
                    break;
                }
            }
            if (_loc_2)
            {
                dispatchEvent(new QueueEvent(QueueEvent.PLAYBACK_ERROR, _loc_2, true, {song:event.currentTarget, event:event}));
            }
            if (_loc_3 && this.hasNextSong)
            {
                playNextSong();
            }
            return;
        }// end function

        public function get autoAutoplayDisabled() : Boolean
        {
            return true;
        }// end function

        protected function generateRefreshPendingAutoplaySong(param1:QueueSong, param2:Boolean = false) : void
        {
            var _loc_3:* = new RefreshPendingAutoplaySong(service, this, param1, param2);
            this.commandQueue.queueCommand(_loc_3);
            return;
        }// end function

        public function get currentIndex() : int
        {
            if (!_activeSong)
            {
                return -1;
            }
            return source.indexOf(_activeSong);
        }// end function

        protected function stopCrossfade() : void
        {
            _crossfadeSongStopTimer.stop();
            crossfadeRunning = false;
            return;
        }// end function

        public function get repeatMode() : int
        {
            return _repeatMode;
        }// end function

        protected function insertItemsAtIndex(param1:Array, param2:Array, param3:int) : Array
        {
            var _loc_4:Array = [];
            if (param3 == 0)
            {
                _loc_4 = param2.concat(param1);
            }
            else if (param3 == param1.length)
            {
                _loc_4 = param1.concat(param2);
            }
            else
            {
                _loc_4 = param1.slice(0, param3).concat(param2).concat(param1.slice(param3));
            }
            return _loc_4;
        }// end function

        function get _activeSong() : QueueSong
        {
            return __activeSong;
        }// end function

        public function get crossfadeEnabled() : Boolean
        {
            return _crossfadeEnabled;
        }// end function

        override public function get length() : int
        {
            return source.length;
        }// end function

        protected function onSongPlayback(event:PlayableSongEvent) : void
        {
            if (this._crossfadeSong || this._activeSong && this._activeSong.soundVolume < 1)
            {
                startCrossfade();
            }
            return;
        }// end function

        function completeRemoveSongs(param1:Array) : void
        {
            var _loc_2:Number = NaN;
            var _loc_5:QueueSong = null;
            var _loc_6:int = 0;
            var _loc_8:int = 0;
            var _loc_9:Array = null;
            var _loc_10:CollectionEvent = null;
            var _loc_11:PropertyChangeEvent = null;
            var _loc_12:Boolean = false;
            var _loc_13:int = 0;
            var _loc_3:Boolean = false;
            var _loc_4:* = param1.length;
            var _loc_7:int = 0;
            while (_loc_7 < _loc_4)
            {
                
                _loc_5 = param1[_loc_7] as QueueSong;
                if (!_loc_5)
                {
                    break;
                }
                _loc_6 = source.indexOf(_loc_5);
                if (_loc_6 != -1)
                {
                    source.splice(_loc_6, 1);
                }
                _loc_8 = playedSongs.indexOf(_loc_5);
                if (_loc_8 != -1)
                {
                    playedSongs.splice(_loc_8, 1);
                }
                else
                {
                    _loc_8 = pendingSongs.indexOf(_loc_5);
                    if (_loc_8 != -1)
                    {
                        pendingSongs.splice(_loc_8, 1);
                    }
                }
                if (_loc_5 === _activeSong)
                {
                    _loc_2 = Number(_loc_6);
                    switch(_loc_5.playStatus)
                    {
                        case PlayableSong.PLAY_STATUS_INITIALIZING:
                        case PlayableSong.PLAY_STATUS_LOADING:
                        case PlayableSong.PLAY_STATUS_PLAYING:
                        case PlayableSong.PLAY_STATUS_PAUSED:
                        case PlayableSong.PLAY_STATUS_BUFFERING:
                        {
                            _loc_3 = true;
                            break;
                        }
                        default:
                        {
                            break;
                        }
                    }
                }
                this.removeEventListeners(_loc_5);
                _loc_9 = queueSongLookupBySongID[_loc_5.song.songID];
                if (_loc_9)
                {
                    _loc_8 = _loc_9.indexOf(_loc_5);
                    if (_loc_8 != -1)
                    {
                        _loc_9.splice(_loc_8, 1);
                    }
                    if (!_loc_9.length)
                    {
                        delete queueSongLookupBySongID[_loc_5.song.songID];
                    }
                }
                delete queueSongLookupByQueueSongID[_loc_5.queueSongID];
                _loc_7++;
            }
            if (param1.length == 1 && this.length)
            {
                _loc_10 = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE);
                _loc_10.kind = CollectionEventKind.REMOVE;
                _loc_10.location = _loc_6;
                _loc_10.items = [_loc_5];
                dispatchEvent(_loc_10);
                _loc_11 = new PropertyChangeEvent(PropertyChangeEvent.PROPERTY_CHANGE);
                _loc_11.property = _loc_6;
                _loc_11.oldValue = _loc_5;
                dispatchEvent(_loc_11);
            }
            else
            {
                _loc_10 = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE);
                _loc_10.kind = CollectionEventKind.RESET;
                dispatchEvent(_loc_10);
            }
            if (this.length && _loc_2.toString() != "NaN")
            {
                _loc_12 = false;
                if (this.crossfadeEnabled && this._activeSong.playStatus === PlayableSong.PLAY_STATUS_PLAYING)
                {
                    this.crossfadeSong = this._activeSong;
                }
                if (_shuffleEnabled)
                {
                    if (_loc_2 < playedSongs.length)
                    {
                        _activeSong = playedSongs[_loc_2];
                    }
                    else if (pendingSongs.length)
                    {
                        _loc_13 = Math.floor(Math.random() * (pendingSongs.length - 1));
                        _activeSong = pendingSongs.splice(_loc_13, 1)[0];
                        playedSongs.push(_activeSong);
                    }
                    else
                    {
                        _activeSong = playedSongs[(playedSongs.length - 1)];
                        _loc_12 = true;
                    }
                }
                else if (_loc_2 < this.length)
                {
                    _activeSong = source[_loc_2];
                }
                else
                {
                    _activeSong = source[(this.length - 1)];
                    _loc_12 = true;
                }
                if (_loc_3 && (!_loc_12 || _activeSong.playStatus == PlayableSong.PLAY_STATUS_NONE && !_activeSong.lastStreamKey))
                {
                    this.playSong(_activeSong);
                }
            }
            if (!this.length)
            {
                _activeSong = null;
            }
            recalcHasNextPrev();
            if (autoplayStatus)
            {
                autoplayStatus.songsRemovedFromQueue(param1);
            }
            return;
        }// end function

        private function set _1159370206repeatMode(param1:int) : void
        {
            if (param1 != _repeatMode)
            {
                _repeatMode = param1;
                recalcHasNextPrev();
            }
            return;
        }// end function

        public function get queueID() : String
        {
            return this._655172076queueID;
        }// end function

        public function set crossfadeInOutEnabled(param1:Boolean) : void
        {
            var _loc_2:* = this.crossfadeInOutEnabled;
            if (_loc_2 !== param1)
            {
                this._1672751092crossfadeInOutEnabled = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "crossfadeInOutEnabled", _loc_2, param1));
            }
            return;
        }// end function

        public function removeItems(param1:Array, param2:Boolean = true) : void
        {
            var _loc_3:Array = null;
            while (param1.length > 0)
            {
                
                _loc_3 = param1.splice(0, 100);
                generateRemoveSongsFromQueue(_loc_3, param2);
            }
            return;
        }// end function

        protected function set crossfadeSongStopTimer(param1:Timer) : void
        {
            var _loc_2:* = this.crossfadeSongStopTimer;
            if (_loc_2 !== param1)
            {
                this._1519093106crossfadeSongStopTimer = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "crossfadeSongStopTimer", _loc_2, param1));
            }
            return;
        }// end function

        public function pause() : void
        {
            if (_crossfadeSong && _crossfadeSong.playStatus === PlayableSong.PLAY_STATUS_PLAYING)
            {
                if (_crossfadeSong.duration - _crossfadeSong.position < this.crossfadeAmount)
                {
                    _crossfadeSong.soundVolume = 0;
                }
                else
                {
                    crossfadeSongStop();
                }
            }
            if (_activeSong)
            {
                _activeSong.pause();
                _activeSong.soundVolume = Number(1);
            }
            return;
        }// end function

        public function set crossfadeEnabled(param1:Boolean) : void
        {
            var _loc_2:* = this.crossfadeEnabled;
            if (_loc_2 !== param1)
            {
                this._1799419675crossfadeEnabled = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "crossfadeEnabled", _loc_2, param1));
            }
            return;
        }// end function

        protected function get crossfadeSong() : QueueSong
        {
            return _crossfadeSong;
        }// end function

        public function get crossfadeInOutEnabled() : Boolean
        {
            return _crossfadeInOutEnabled;
        }// end function

        public function get currentAutoplayTag() : Tag
        {
            return _currentAutoplayTag;
        }// end function

        public function set autoAutoplayDisabled(param1:Boolean) : void
        {
            var _loc_2:* = this.autoAutoplayDisabled;
            if (_loc_2 !== param1)
            {
                this._806131506autoAutoplayDisabled = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "autoAutoplayDisabled", _loc_2, param1));
            }
            return;
        }// end function

        public static function set userTrackingID(param1:Number) : void
        {
            var _loc_3:IEventDispatcher = null;
            var _loc_2:* = Queue._1923488829userTrackingID;
            if (_loc_2 !== param1)
            {
                Queue._1923488829userTrackingID = param1;
                _loc_3 = Queue.staticEventDispatcher;
                if (_loc_3 != null)
                {
                    _loc_3.dispatchEvent(PropertyChangeEvent.createUpdateEvent(Queue, "userTrackingID", _loc_2, param1));
                }
            }
            return;
        }// end function

        public static function get prefetchEnabled() : Boolean
        {
            return Queue._200723786prefetchEnabled;
        }// end function

        private static function onPrefetchComplete(event:Event) : void
        {
            var _loc_2:String = null;
            var _loc_4:PrefetchStreamKeys = null;
            var _loc_3:* = new Date().valueOf();
            for (_loc_2 in Queue.streamKeys)
            {
                
                if (Queue.streamKeys[_loc_2].expires <= _loc_3)
                {
                    delete Queue.streamKeys[_loc_2];
                }
            }
            _loc_4 = event.currentTarget as PrefetchStreamKeys;
            if (_loc_4 && _loc_4.results)
            {
                for (_loc_2 in _loc_4.results)
                {
                    
                    Queue.streamKeys[_loc_2] = _loc_4.results[_loc_2];
                }
            }
            return;
        }// end function

        public static function get staticEventDispatcher() : IEventDispatcher
        {
            return _staticBindingEventDispatcher;
        }// end function

        public static function set prefetchEnabled(param1:Boolean) : void
        {
            var _loc_3:IEventDispatcher = null;
            var _loc_2:* = Queue._200723786prefetchEnabled;
            if (_loc_2 !== param1)
            {
                Queue._200723786prefetchEnabled = param1;
                _loc_3 = Queue.staticEventDispatcher;
                if (_loc_3 != null)
                {
                    _loc_3.dispatchEvent(PropertyChangeEvent.createUpdateEvent(Queue, "prefetchEnabled", _loc_2, param1));
                }
            }
            return;
        }// end function

        public static function cacheStreamKeys(param1:Array, param2:IDualService) : void
        {
            var _loc_3:* = PlayableSong.STREAM_TYPE_DEFAULT;
            if (PlayableSong.userForReporting && PlayableSong.userForReporting.isPremium)
            {
                _loc_3 = _loc_3 | PlayableSong.STREAM_TYPE_VIP;
            }
            var _loc_4:* = new PrefetchStreamKeys(param2, param1, _loc_3);
            new PrefetchStreamKeys(param2, param1, _loc_3).addEventListener(Event.COMPLETE, onPrefetchComplete);
            _loc_4.execute();
            return;
        }// end function

        public static function get userTrackingID() : Number
        {
            return Queue._1923488829userTrackingID;
        }// end function

    }
}
