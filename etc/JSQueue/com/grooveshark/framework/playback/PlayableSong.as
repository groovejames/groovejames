package com.grooveshark.framework.playback
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.commands.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;
    import flash.net.*;
    import flash.utils.*;
    import mx.collections.*;
    import mx.events.*;

    public class PlayableSong extends EventDispatcher
    {
        private var _1935376537lastStreamServer:String;
        protected var playbackReported:Boolean = false;
        protected var _sound:IGSSound;
        protected var streamWatcher:Timer;
        private var _747804969position:Number = 0;
        protected var completeReported:Boolean = false;
        protected var noBufferCount:int = 0;
        private var _896505829source:String = "user";
        private var _102002428currentStreamServer:String;
        private var _soundVolume:Number = 1;
        private var _1992012396duration:Number = 0;
        private var _1582764102playStatus:int = 0;
        private var _1045430530thirtySecReported:Boolean = false;
        private var _1596130465fileLoaded:Boolean = false;
        private var _fadeTimerDown:Timer;
        private var _951530927context:Object;
        private var _2110014263lastStreamKey:String = "";
        private var killSoundTimer:Timer;
        protected var pausedPosition:int = 0;
        private var _1653441605secondsListened:Number = 0;
        protected var consecutiveBadFrames:int = 0;
        protected var downloadReported:Boolean = false;
        protected var isBuffering:Boolean = false;
        protected var bufferCount:int = 0;
        protected var service:IDualService;
        private var fadeAmountDown:Number = 600;
        private var _filters:Array;
        private var _341347244lastServerID:int;
        private var fadeAmountUp:Number = 1500;
        protected var playOnStreamKey:Boolean = false;
        private var fadeInOut:Boolean = false;
        private var _326983600bytesLoaded:Number = 0;
        private var _1382331801bytesTotal:Number = 0;
        protected var lastPosition:int = 0;
        private var _fadeTimerUp:Timer;
        private var _3536149song:BaseSong;
        protected var cancelPendingPlayback:Boolean = false;
        private static var _staticBindingEventDispatcher:EventDispatcher = new EventDispatcher();
        public static const MIN_BUFFER_SIZE:int = 3000;
        private static var _1444110662currentBufferSize:int = 3000;
        public static const STREAM_TYPE_POPULAR:int = 64;
        public static const MAX_BUFFER_SIZE:int = 20000;
        public static const PLAY_STATUS_BUFFERING:int = 5;
        public static const STREAM_TYPE_DMCA_RADIO:int = 4;
        public static const PLAY_STATUS_PLAYING:int = 3;
        public static const STREAM_TYPE_RADIO:int = 2;
        public static const STREAM_TYPE_PLAYLIST:int = 16;
        public static const PLAY_STATUS_LOADING:int = 2;
        private static var _1498006282checkPolicyFile:Boolean = false;
        private static var _603662715consecutiveFailedStreamKeys:int = 0;
        public static const PLAY_STATUS_COMPLETED:int = 7;
        private static var _1705597599useStagingScript:Boolean = false;
        private static var _705511159useMobile:Boolean = false;
        private static const PASSTHROUGH_PROP:Array = ["songName", "songID", "artistName", "artistID", "albumName", "albumID", "trackNum", "popularity", "isArtistVerified", "isAlbumVerified", "isFavorite", "token"];
        public static const PLAY_STATUS_PAUSED:int = 4;
        public static const STREAM_TYPE_VIP:int = 8;
        public static const PLAY_STATUS_NONE:int = 0;
        public static const PLAY_STATUS_FAILED:int = 6;
        private static var _1662479664userForReporting:Object = null;
        public static const PLAY_STATUS_INITIALIZING:int = 1;
        public static const STREAM_TYPE_STATION:int = 1;
        public static const STREAM_TYPE_DEFAULT:int = 0;
        public static const STREAM_TYPE_LIBRARY:int = 32;

        public function PlayableSong(param1:BaseSong, param2:IDualService, param3:Object = null)
        {
            _951530927context = {type:"unknown", data:{}};
            this.song = param1;
            if (param1.estimateDuration)
            {
                this.duration = param1.estimateDuration;
            }
            param1.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, songPropChange);
            this.service = param2;
            this.streamWatcher = new Timer(500);
            this.streamWatcher.addEventListener(TimerEvent.TIMER, onStreamPoll);
            if (param3)
            {
                this.context = param3;
            }
            if (!this.context.type)
            {
                this.context.type = "unknown";
            }
            if (!this.context.data)
            {
                this.context.data = {};
            }
            if (!this.context.data.client)
            {
                this.context.data.client = param2.getClient();
            }
            if (this.context.type == "userRadio")
            {
                this.source = "userRadio";
            }
            return;
        }// end function

        public function get token() : String
        {
            return song && song.token ? (song.token) : ("");
        }// end function

        public function set thirtySecReported(param1:Boolean) : void
        {
            var _loc_2:* = this._1045430530thirtySecReported;
            if (_loc_2 !== param1)
            {
                this._1045430530thirtySecReported = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "thirtySecReported", _loc_2, param1));
            }
            return;
        }// end function

        public function set filters(param1:Array) : void
        {
            var _loc_2:* = this.filters;
            if (_loc_2 !== param1)
            {
                this._854547461filters = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "filters", _loc_2, param1));
            }
            return;
        }// end function

        private function calculateStreamType() : int
        {
            var _loc_1:* = STREAM_TYPE_DEFAULT;
            if (PlayableSong.userForReporting && PlayableSong.userForReporting.isPremium)
            {
                _loc_1 = _loc_1 | STREAM_TYPE_VIP;
            }
            if (this.context && this.context.type)
            {
                switch(this.context.type)
                {
                    case "playlist":
                    {
                        _loc_1 = _loc_1 | STREAM_TYPE_PLAYLIST;
                        break;
                    }
                    case "radio":
                    {
                        if (this.context.data && this.context.data.tagID)
                        {
                            _loc_1 = _loc_1 | STREAM_TYPE_STATION;
                        }
                        else
                        {
                            _loc_1 = _loc_1 | STREAM_TYPE_RADIO;
                        }
                        break;
                    }
                    case "user":
                    {
                        if (this.context.data && this.context.data.userID && PlayableSong.userForReporting && this.context.data.userID == PlayableSong.userForReporting.userID)
                        {
                            _loc_1 = _loc_1 | STREAM_TYPE_LIBRARY;
                        }
                        break;
                    }
                    case "popular":
                    {
                        _loc_1 = _loc_1 | STREAM_TYPE_POPULAR;
                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }
            return _loc_1;
        }// end function

        public function get sound() : IGSSound
        {
            return _sound;
        }// end function

        public function stop() : void
        {
            this.streamWatcher.stop();
            if (this.sound)
            {
                this.sound.stop();
            }
            this.sound = null;
            this.cancelPendingPlayback = true;
            switch(this.playStatus)
            {
                case PlayableSong.PLAY_STATUS_COMPLETED:
                case PlayableSong.PLAY_STATUS_FAILED:
                {
                    break;
                }
                default:
                {
                    this.playStatus = PlayableSong.PLAY_STATUS_NONE;
                    break;
                }
            }
            return;
        }// end function

        public function seekTo(param1:int) : void
        {
            if (param1 < 0)
            {
                param1 = 0;
            }
            this.playSoundFrom(param1, true);
            return;
        }// end function

        public function get song() : BaseSong
        {
            return this._3536149song;
        }// end function

        public function get soundVolume() : Number
        {
            return _soundVolume;
        }// end function

        private function onDownloadComplete(event:Event) : void
        {
            var _loc_2:int = 0;
            var _loc_3:SongCommand = null;
            trace("[PlayableSong] onDownloadComplete: " + event + ", duration: " + sound.duration);
            this.fileLoaded = true;
            if (this.sound)
            {
                if (this.sound.duration == 0)
                {
                    this.sound.stop();
                    this.sound = null;
                    _loc_2 = this.playStatus;
                    this.playStatus = PlayableSong.PLAY_STATUS_FAILED;
                    dispatchEvent(new PlayableSongEvent(PlayableSongEvent.ERROR, PlayableSongEvent.FAILED_IO_ERROR, _loc_2));
                }
                else
                {
                    this.duration = this.sound.duration;
                    if (Math.abs(this.song.estimateDuration - this.duration) > 999)
                    {
                        _loc_3 = new ReportCorrectDuration(service, this);
                        _loc_3.execute();
                    }
                }
            }
            return;
        }// end function

        public function get thirtySecReported() : Boolean
        {
            return this._1045430530thirtySecReported;
        }// end function

        public function get source() : String
        {
            return this._896505829source;
        }// end function

        public function set sound(param1:IGSSound) : void
        {
            var _loc_2:* = this.sound;
            if (_loc_2 !== param1)
            {
                this._109627663sound = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "sound", _loc_2, param1));
            }
            return;
        }// end function

        private function set _854547461filters(param1:Array) : void
        {
            _filters = param1;
            if (_sound)
            {
                _sound.filters = param1;
            }
            return;
        }// end function

        public function set soundVolume(param1:Number) : void
        {
            var _loc_2:* = this.soundVolume;
            if (_loc_2 !== param1)
            {
                this._2006668553soundVolume = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "soundVolume", _loc_2, param1));
            }
            return;
        }// end function

        public function set duration(param1:Number) : void
        {
            var _loc_2:* = this._1992012396duration;
            if (_loc_2 !== param1)
            {
                this._1992012396duration = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "duration", _loc_2, param1));
            }
            return;
        }// end function

        public function get position() : Number
        {
            return this._747804969position;
        }// end function

        public function set song(param1:BaseSong) : void
        {
            var _loc_2:* = this._3536149song;
            if (_loc_2 !== param1)
            {
                this._3536149song = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "song", _loc_2, param1));
            }
            return;
        }// end function

        protected function set _563277148fadeTimerUp(param1:Timer) : void
        {
            if (param1 !== _fadeTimerUp)
            {
                if (_fadeTimerUp)
                {
                    _fadeTimerUp.removeEventListener(TimerEvent.TIMER, fadeInterval);
                    _fadeTimerUp.removeEventListener(TimerEvent.TIMER_COMPLETE, fadeStop);
                }
                _fadeTimerUp = param1;
                if (_fadeTimerUp)
                {
                    _fadeTimerUp.addEventListener(TimerEvent.TIMER, fadeInterval);
                    _fadeTimerUp.addEventListener(TimerEvent.TIMER_COMPLETE, fadeStop);
                }
            }
            return;
        }// end function

        public function resume() : void
        {
            if (_sound && this.playStatus == PlayableSong.PLAY_STATUS_PAUSED)
            {
                playSoundFrom(_sound.position);
            }
            return;
        }// end function

        public function fadeOut() : void
        {
            if (this._fadeTimerDown)
            {
                if (this._fadeTimerDown.running)
                {
                    this._fadeTimerDown.stop();
                }
                if (this._fadeTimerUp.running)
                {
                    this._fadeTimerUp.stop();
                }
                this._fadeTimerDown.reset();
                this._fadeTimerDown.start();
            }
            return;
        }// end function

        private function onKillSoundTimer(event:TimerEvent) : void
        {
            switch(this.playStatus)
            {
                case PLAY_STATUS_NONE:
                case PLAY_STATUS_FAILED:
                case PLAY_STATUS_COMPLETED:
                {
                    if (this.sound)
                    {
                        this.sound = null;
                    }
                    break;
                }
                default:
                {
                    break;
                }
            }
            return;
        }// end function

        public function play(param1:String = "", param2:String = "", param3:int = 0, param4:Number = 0) : void
        {
            trace("PlayableSong play called, songID " + song.songID);
            switch(this.playStatus)
            {
                case PlayableSong.PLAY_STATUS_INITIALIZING:
                {
                    playOnStreamKey = true;
                    return;
                }
                case PlayableSong.PLAY_STATUS_BUFFERING:
                case PlayableSong.PLAY_STATUS_PLAYING:
                {
                    if (this.position < 5)
                    {
                        return;
                    }
                    break;
                }
                default:
                {
                    break;
                }
            }
            if (_sound && !this.thirtySecReported)
            {
                playSoundFrom(0);
            }
            else
            {
                playOnStreamKey = true;
                fetchNewStreamKey(param1, param2, param3, param4);
            }
            return;
        }// end function

        public function get popularity() : Number
        {
            return song && song.hasOwnProperty("popularity") ? (song["popularity"]) : (0);
        }// end function

        public function set bytesTotal(param1:Number) : void
        {
            var _loc_2:* = this._1382331801bytesTotal;
            if (_loc_2 !== param1)
            {
                this._1382331801bytesTotal = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "bytesTotal", _loc_2, param1));
            }
            return;
        }// end function

        public function get trackNum() : int
        {
            return song ? (song.trackNum) : (0);
        }// end function

        protected function set _143963541fadeTimerDown(param1:Timer) : void
        {
            if (param1 !== _fadeTimerDown)
            {
                if (_fadeTimerDown)
                {
                    _fadeTimerDown.removeEventListener(TimerEvent.TIMER, fadeInterval);
                    _fadeTimerDown.removeEventListener(TimerEvent.TIMER_COMPLETE, fadeStop);
                }
                _fadeTimerDown = param1;
                if (_fadeTimerDown)
                {
                    _fadeTimerDown.addEventListener(TimerEvent.TIMER, fadeInterval);
                    _fadeTimerDown.addEventListener(TimerEvent.TIMER_COMPLETE, fadeStop);
                }
            }
            return;
        }// end function

        public function set source(param1:String) : void
        {
            var _loc_2:* = this._896505829source;
            if (_loc_2 !== param1)
            {
                this._896505829source = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "source", _loc_2, param1));
            }
            return;
        }// end function

        public function get songName() : String
        {
            return song ? (song.songName) : ("");
        }// end function

        public function set lastStreamServer(param1:String) : void
        {
            var _loc_2:* = this._1935376537lastStreamServer;
            if (_loc_2 !== param1)
            {
                this._1935376537lastStreamServer = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "lastStreamServer", _loc_2, param1));
            }
            return;
        }// end function

        public function set fileLoaded(param1:Boolean) : void
        {
            var _loc_2:* = this._1596130465fileLoaded;
            if (_loc_2 !== param1)
            {
                this._1596130465fileLoaded = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "fileLoaded", _loc_2, param1));
            }
            return;
        }// end function

        public function get secondsListened() : Number
        {
            return this._1653441605secondsListened;
        }// end function

        public function get playStatus() : int
        {
            return this._1582764102playStatus;
        }// end function

        public function get isAlbumVerified() : int
        {
            return song && song.hasOwnProperty("isAlbumVerified") ? (song["isAlbumVerified"]) : (-1);
        }// end function

        protected function set fadeTimerUp(param1:Timer) : void
        {
            var _loc_2:* = this.fadeTimerUp;
            if (_loc_2 !== param1)
            {
                this._563277148fadeTimerUp = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "fadeTimerUp", _loc_2, param1));
            }
            return;
        }// end function

        public function get bytesLoaded() : Number
        {
            return this._326983600bytesLoaded;
        }// end function

        public function set position(param1:Number) : void
        {
            var _loc_2:* = this._747804969position;
            if (_loc_2 !== param1)
            {
                this._747804969position = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "position", _loc_2, param1));
            }
            return;
        }// end function

        public function get lastServerID() : int
        {
            return this._341347244lastServerID;
        }// end function

        private function onSongFailure(param1:int) : void
        {
            this.streamWatcher.stop();
            if (this.sound)
            {
                this.sound.stop();
            }
            this.sound = null;
            var _loc_2:* = this.playStatus;
            this.playStatus = PlayableSong.PLAY_STATUS_FAILED;
            dispatchEvent(new PlayableSongEvent(PlayableSongEvent.ERROR, param1, _loc_2));
            return;
        }// end function

        public function fadeInterval(event:TimerEvent = null) : void
        {
            var _loc_2:Number = NaN;
            var _loc_3:Number = NaN;
            if (this.playStatus == PlayableSong.PLAY_STATUS_PAUSED)
            {
                _loc_2 = 1 / (Queue.CROSSFADE_STEPS * this.fadeAmountDown / 1000);
                this.soundVolume = this.soundVolume >= _loc_2 ? (this.soundVolume - _loc_2) : (0);
                var _loc_4:* = _sound.position;
                this.position = _sound.position;
                this.pausedPosition = _loc_4;
            }
            else if (this.playStatus == PlayableSong.PLAY_STATUS_PLAYING)
            {
                _loc_3 = 1 / (Queue.CROSSFADE_STEPS * this.fadeAmountUp / 1000);
                this.soundVolume = this.soundVolume <= 1 - _loc_3 ? (this.soundVolume + _loc_3) : (1);
            }
            return;
        }// end function

        protected function get fadeTimerDown() : Timer
        {
            return _fadeTimerDown;
        }// end function

        protected function loadSoundObject(param1:String, param2:Object, param3:Boolean = false) : void
        {
            var _loc_5:String = null;
            var _loc_6:URLRequest = null;
            var _loc_7:SongCommand = null;
            var _loc_4:* = new URLVariables();
            for (_loc_5 in param2)
            {
                
                _loc_4[_loc_5] = param2[_loc_5];
            }
            _loc_6 = new URLRequest(param1);
            _loc_6.method = URLRequestMethod.POST;
            _loc_6.data = _loc_4;
            this.sound = new GSSound9(_loc_6, PlayableSong.currentBufferSize, PlayableSong.checkPolicyFile);
            this.playStatus = PlayableSong.PLAY_STATUS_LOADING;
            this.isBuffering = false;
            this.fileLoaded = false;
            this.streamWatcher.reset();
            this.streamWatcher.start();
            if (param3)
            {
                playSoundFrom(0);
            }
            if (!this.downloadReported)
            {
                _loc_7 = new MarkSongDownloaded(service, this);
                _loc_7.execute();
                this.downloadReported = true;
            }
            return;
        }// end function

        public function get artistName() : String
        {
            return song ? (song.artistName) : ("");
        }// end function

        public function set context(param1:Object) : void
        {
            var _loc_2:* = this._951530927context;
            if (_loc_2 !== param1)
            {
                this._951530927context = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "context", _loc_2, param1));
            }
            return;
        }// end function

        public function flag(param1:int) : void
        {
            var _loc_2:* = new FlagSong(service, this);
            _loc_2.flagReason = param1;
            _loc_2.execute();
            return;
        }// end function

        protected function playSoundFrom(param1:int, param2:Boolean = false) : void
        {
            if (_sound)
            {
                if (param1 < 0)
                {
                    param1 = 0;
                }
                _sound.position = param1;
                var _loc_3:* = _sound.position;
                this.pausedPosition = _sound.position;
                var _loc_3:* = _loc_3;
                this.lastPosition = _loc_3;
                this.position = _loc_3;
                if (!param2 && (_sound.isPaused || _sound.isStopped || this._fadeTimerDown && this._fadeTimerDown.running))
                {
                    if (this.fadeInOut)
                    {
                        _sound.play();
                        this.fadeIn();
                    }
                    else
                    {
                        _sound.play();
                    }
                }
                if (!_sound.isPaused && !_sound.isStopped && _sound.position != _sound.duration)
                {
                    if (!this.streamWatcher.running)
                    {
                        this.streamWatcher.reset();
                        this.streamWatcher.start();
                    }
                    this.playStatus = PlayableSong.PLAY_STATUS_PLAYING;
                }
            }
            return;
        }// end function

        private function getStreamKeyResult(param1:Object, param2:Object = null) : void
        {
            var _loc_4:String = null;
            var _loc_5:String = null;
            var _loc_6:int = 0;
            var _loc_7:String = null;
            var _loc_8:Number = NaN;
            var _loc_9:String = null;
            var _loc_3:* = param1 as JSONResult;
            if (_loc_3 && _loc_3.result && !this.cancelPendingPlayback)
            {
                _loc_4 = _loc_3.result.streamKey as String;
                _loc_5 = _loc_3.result.ip as String;
                _loc_6 = int(_loc_3.result.streamServerID);
                _loc_7 = _loc_3.result.FileToken as String;
                _loc_8 = Number(_loc_3.result.uSecs);
                if (_loc_4 == "false" && Boolean(param2.prefetch))
                {
                    if (this.playOnStreamKey)
                    {
                        this.playStatus = PlayableSong.PLAY_STATUS_NONE;
                        this.play();
                        return;
                    }
                    return;
                }
                else if (_loc_4 == "false" || _loc_4 == "null" || _loc_5 == "null" || !_loc_6)
                {
                    var _loc_10:* = PlayableSong;
                    var _loc_11:* = PlayableSong.consecutiveFailedStreamKeys + 1;
                    _loc_10.consecutiveFailedStreamKeys = _loc_11;
                    onSongFailure(PlayableSongEvent.FAILED_STREAMKEY_OTHER);
                    trace("[PlayableSong] Error fetching streamKey: Result came back null.");
                    return;
                }
                if (PlayableSong.useStagingScript)
                {
                    _loc_5 = "staging." + _loc_5;
                }
                _loc_9 = "http://" + _loc_5 + "/stream.php";
                this.lastStreamKey = _loc_4;
                this.lastServerID = _loc_6;
                this.lastStreamServer = _loc_5;
                this.currentStreamServer = "http://" + _loc_5;
                loadSoundObject(_loc_9, {streamKey:_loc_4}, this.playOnStreamKey);
                PlayableSong.consecutiveFailedStreamKeys = 0;
                if (this.song.hasOwnProperty("token") && _loc_7 && _loc_7 != "null")
                {
                    this.song["token"] = _loc_7;
                }
                if (_loc_8)
                {
                    var _loc_10:* = _loc_8 / 1000;
                    this.song.estimateDuration = _loc_8 / 1000;
                    this.duration = _loc_10;
                }
            }
            else if (!_loc_3 || !_loc_3.result)
            {
                var _loc_10:* = PlayableSong;
                var _loc_11:* = PlayableSong.consecutiveFailedStreamKeys + 1;
                _loc_10.consecutiveFailedStreamKeys = _loc_11;
                onSongFailure(PlayableSongEvent.FAILED_STREAMKEY_OTHER);
                trace("[PlayableSong] Error fetching streamKey: Empty result set");
            }
            return;
        }// end function

        private function onUrlChanged(event:Event) : void
        {
            var _loc_3:int = 0;
            var _loc_2:* = (event.currentTarget as IGSSound).url;
            if (_loc_2)
            {
                _loc_3 = _loc_2.indexOf("/stream.php");
                if (_loc_3 != -1)
                {
                    this.currentStreamServer = _loc_2.substring(0, _loc_3);
                }
            }
            return;
        }// end function

        public function set playStatus(param1:int) : void
        {
            var _loc_2:* = this._1582764102playStatus;
            if (_loc_2 !== param1)
            {
                this._1582764102playStatus = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "playStatus", _loc_2, param1));
            }
            return;
        }// end function

        override public function toString() : String
        {
            return "[PlayableSong] " + song.songID + ":" + song.songName;
        }// end function

        public function set secondsListened(param1:Number) : void
        {
            var _loc_2:* = this._1653441605secondsListened;
            if (_loc_2 !== param1)
            {
                this._1653441605secondsListened = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "secondsListened", _loc_2, param1));
            }
            return;
        }// end function

        public function set lastStreamKey(param1:String) : void
        {
            var _loc_2:* = this._2110014263lastStreamKey;
            if (_loc_2 !== param1)
            {
                this._2110014263lastStreamKey = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "lastStreamKey", _loc_2, param1));
            }
            return;
        }// end function

        private function set _2006668553soundVolume(param1:Number) : void
        {
            if (param1 !== _soundVolume)
            {
                _soundVolume = param1;
                if (_sound)
                {
                    _sound.volume = param1;
                }
            }
            return;
        }// end function

        private function getStreamKeyFault(param1:Object, param2:Object = null) : void
        {
            var _loc_4:* = PlayableSong;
            var _loc_5:* = PlayableSong.consecutiveFailedStreamKeys + 1;
            _loc_4.consecutiveFailedStreamKeys = _loc_5;
            var _loc_3:* = param1 as JSONFault;
            if (_loc_3.code == 512)
            {
                onSongFailure(PlayableSongEvent.FAILED_STREAMKEY_LIMIT);
            }
            else
            {
                onSongFailure(PlayableSongEvent.FAILED_STREAMKEY_OTHER);
            }
            trace("[PlayableSong] Error fetching streamKey: " + _loc_3.message, "Raw result: " + _loc_3.rawResult);
            return;
        }// end function

        public function get duration() : Number
        {
            return this._1992012396duration;
        }// end function

        public function fadeStop(event:TimerEvent = null) : void
        {
            if (this.playStatus == PlayableSong.PLAY_STATUS_PAUSED)
            {
                _sound.pause();
                this.soundVolume = 0;
                var _loc_2:* = _sound.position;
                this.position = _sound.position;
                this.pausedPosition = _loc_2;
            }
            else if (this.playStatus == PlayableSong.PLAY_STATUS_PLAYING)
            {
                this.soundVolume = 1;
            }
            return;
        }// end function

        public function set bytesLoaded(param1:Number) : void
        {
            var _loc_2:* = this._326983600bytesLoaded;
            if (_loc_2 !== param1)
            {
                this._326983600bytesLoaded = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "bytesLoaded", _loc_2, param1));
            }
            return;
        }// end function

        public function get albumName() : String
        {
            return song ? (song.albumName) : ("");
        }// end function

        protected function get fadeTimerUp() : Timer
        {
            return _fadeTimerUp;
        }// end function

        private function onStreamPoll(event:TimerEvent) : void
        {
            var _loc_2:int = 0;
            var _loc_3:SongCommand = null;
            var _loc_4:int = 0;
            if (this.sound)
            {
                if (this.isBuffering != this.sound.isBuffering)
                {
                    if (this.sound.isBuffering)
                    {
                        if (this.playStatus != PlayableSong.PLAY_STATUS_INITIALIZING && this.playStatus != PlayableSong.PLAY_STATUS_LOADING && this.position > 0)
                        {
                            PlayableSong.currentBufferSize = PlayableSong.currentBufferSize + 3000;
                            var _loc_5:String = this;
                            var _loc_6:* = this.bufferCount + 1;
                            _loc_5.bufferCount = _loc_6;
                            this.noBufferCount = 0;
                            if (PlayableSong.currentBufferSize > PlayableSong.MAX_BUFFER_SIZE)
                            {
                                PlayableSong.currentBufferSize = PlayableSong.MAX_BUFFER_SIZE;
                                if (this.bufferCount > 5)
                                {
                                    dispatchEvent(new PlayableSongEvent(PlayableSongEvent.ERROR, PlayableSongEvent.WARNING_FREQUENT_BUFFERING));
                                }
                            }
                        }
                        if (this.playStatus != PlayableSong.PLAY_STATUS_LOADING)
                        {
                            this.playStatus = PlayableSong.PLAY_STATUS_BUFFERING;
                        }
                    }
                    isBuffering = this.sound.isBuffering;
                }
                if (!this.sound.isBuffering && !this.sound.isPaused && !this.sound.isStopped && (!this._fadeTimerDown || !this._fadeTimerDown.running))
                {
                    this.playStatus = PlayableSong.PLAY_STATUS_PLAYING;
                }
                this.bytesLoaded = this.sound.bytesLoaded;
                this.bytesTotal = this.sound.bytesTotal;
                _loc_2 = this.sound.duration;
                if (this.playStatus != PlayableSong.PLAY_STATUS_PAUSED)
                {
                    this.position = this.sound.position;
                }
                if (this.playStatus == PlayableSong.PLAY_STATUS_PLAYING && this.position > this.lastPosition && this.position + PlayableSong.currentBufferSize * 1.5 < this.sound.duration)
                {
                    var _loc_5:String = this;
                    var _loc_6:* = this.noBufferCount + 1;
                    _loc_5.noBufferCount = _loc_6;
                    if (this.noBufferCount % 70 == 0)
                    {
                        PlayableSong.currentBufferSize = PlayableSong.currentBufferSize - 4000;
                        if (PlayableSong.currentBufferSize < PlayableSong.MIN_BUFFER_SIZE)
                        {
                            PlayableSong.currentBufferSize = PlayableSong.MIN_BUFFER_SIZE;
                        }
                    }
                }
                if (!this.playbackReported && this.playStatus == PlayableSong.PLAY_STATUS_PLAYING)
                {
                    this.dispatchEvent(new PlayableSongEvent(PlayableSongEvent.PLAYBACK_BEGUN));
                    _loc_3 = new MarkSongPlayed(service, this);
                    _loc_3.execute();
                    this.playbackReported = true;
                }
                if (this.duration == 0 && !this.fileLoaded)
                {
                    this.duration = _loc_2;
                }
                if (this.position != 0 && this.position == this.lastPosition && this.playStatus == PlayableSong.PLAY_STATUS_PLAYING && this.fileLoaded)
                {
                    if (_loc_2 - position > 5000)
                    {
                        if (this.consecutiveBadFrames > 4)
                        {
                            onSongFailure(PlayableSongEvent.FAILED_TOO_MANY_BAD_FRAMES);
                        }
                        else
                        {
                            var _loc_5:String = this;
                            var _loc_6:* = this.consecutiveBadFrames + 1;
                            _loc_5.consecutiveBadFrames = _loc_6;
                            switch(this.consecutiveBadFrames)
                            {
                                case 0:
                                {
                                }
                                default:
                                {
                                    _loc_4 = 10;
                                    break;
                                }
                                case 2:
                                {
                                    _loc_4 = 100;
                                    break;
                                }
                                case 3:
                                {
                                    _loc_4 = 250;
                                    break;
                                }
                                case 4:
                                {
                                    _loc_4 = 500;
                                    break;
                                }
                                case :
                                {
                                    _loc_4 = 1000;
                                    break;
                                    break;
                                }
                            }
                            trace("[PlayableSong] Bad frame? Skipping " + _loc_4 + "ms");
                            this.lastPosition = this.position + _loc_4;
                            playSoundFrom(lastPosition);
                        }
                    }
                    else
                    {
                        trace("[PlayableSong] VBR Fake Stop");
                        onSoundComplete();
                    }
                }
                else
                {
                    this.consecutiveBadFrames = 0;
                    if (this.position != this.lastPosition && this.position != 0 && this.playStatus == PlayableSong.PLAY_STATUS_PLAYING)
                    {
                        this.secondsListened = this.secondsListened + 0.5;
                        if (this.secondsListened > 30 && !this.thirtySecReported)
                        {
                            _loc_3 = new MarkSongOver30Seconds(service, this);
                            _loc_3.execute();
                            this.thirtySecReported = true;
                        }
                    }
                    this.lastPosition = this.position;
                }
            }
            return;
        }// end function

        public function get bytesTotal() : Number
        {
            return this._1382331801bytesTotal;
        }// end function

        public function get fileLoaded() : Boolean
        {
            return this._1596130465fileLoaded;
        }// end function

        public function get lastStreamServer() : String
        {
            return this._1935376537lastStreamServer;
        }// end function

        public function set lastServerID(param1:int) : void
        {
            var _loc_2:* = this._341347244lastServerID;
            if (_loc_2 !== param1)
            {
                this._341347244lastServerID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "lastServerID", _loc_2, param1));
            }
            return;
        }// end function

        private function set _109627663sound(param1:IGSSound) : void
        {
            if (param1 != _sound)
            {
                if (this.killSoundTimer)
                {
                    this.killSoundTimer.reset();
                }
                if (_sound)
                {
                    _sound.stop();
                    _sound.removeEventListener(GSSoundEvent.URL_CHANGED, onUrlChanged);
                    _sound.removeEventListener(GSSoundEvent.DOWNLOAD_COMPLETE, onDownloadComplete);
                    _sound.removeEventListener(GSSoundEvent.PLAYBACK_COMPLETE, onSoundComplete);
                    _sound.removeEventListener(GSSoundEvent.IO_ERROR, onIOError);
                }
                _sound = param1;
                if (_sound)
                {
                    _sound.addEventListener(GSSoundEvent.URL_CHANGED, onUrlChanged, false, 0, true);
                    _sound.addEventListener(GSSoundEvent.DOWNLOAD_COMPLETE, onDownloadComplete, false, 0, true);
                    _sound.addEventListener(GSSoundEvent.PLAYBACK_COMPLETE, onSoundComplete, false, 0, true);
                    _sound.addEventListener(GSSoundEvent.IO_ERROR, onIOError, false, 0, true);
                    _sound.volume = _soundVolume;
                    _sound.filters = _filters;
                    if (!this.killSoundTimer)
                    {
                        this.killSoundTimer = new Timer(60000, 1);
                        this.killSoundTimer.addEventListener(TimerEvent.TIMER_COMPLETE, onKillSoundTimer);
                    }
                    this.killSoundTimer.start();
                }
            }
            return;
        }// end function

        public function setFadeOptions(param1:Boolean = false, param2:Number = 1500, param3:Number = 600) : void
        {
            if (this.fadeAmountUp != param2)
            {
                this.fadeAmountUp = param2;
            }
            if (this.fadeAmountDown != param3)
            {
                this.fadeAmountDown = param3;
            }
            if (this.fadeInOut != param1)
            {
                this.fadeInOut = param1;
                if (param1)
                {
                    this.fadeTimerDown = new Timer(1 / Queue.CROSSFADE_STEPS * 1000, Queue.CROSSFADE_STEPS * this.fadeAmountDown / 1000);
                    this.fadeTimerUp = new Timer(1 / Queue.CROSSFADE_STEPS * 1000, Queue.CROSSFADE_STEPS * this.fadeAmountUp / 1000);
                }
                else
                {
                    this.fadeTimerDown = null;
                    this.fadeTimerUp = null;
                }
            }
            return;
        }// end function

        private function onIOError(event:Event) : void
        {
            trace("[PlayableSong] IOError: " + event);
            onSongFailure(PlayableSongEvent.FAILED_IO_ERROR);
            return;
        }// end function

        public function fadeIn() : void
        {
            if (this._fadeTimerUp)
            {
                if (this._fadeTimerUp.running)
                {
                    this._fadeTimerUp.stop();
                }
                if (this._fadeTimerDown.running)
                {
                    this._fadeTimerDown.stop();
                }
                this._fadeTimerUp.reset();
                this._fadeTimerUp.start();
            }
            return;
        }// end function

        private function onSoundComplete(event:Event = null) : void
        {
            var _loc_2:int = 0;
            var _loc_3:SongCommand = null;
            trace("[PlayableSong] onSoundComplete: " + event);
            this.streamWatcher.stop();
            this.sound = null;
            this.playStatus = PlayableSong.PLAY_STATUS_COMPLETED;
            PlayableSong.currentBufferSize = PlayableSong.currentBufferSize - 1000;
            if (PlayableSong.currentBufferSize < PlayableSong.MIN_BUFFER_SIZE)
            {
                PlayableSong.currentBufferSize = PlayableSong.MIN_BUFFER_SIZE;
            }
            if (!this.completeReported)
            {
                _loc_3 = new MarkSongComplete(service, this);
                _loc_3.execute();
                completeReported = true;
            }
            if (event)
            {
                _loc_2 = PlayableSongEvent.COMPLETE_SOUND_COMPLETE;
            }
            else
            {
                _loc_2 = PlayableSongEvent.COMPLETE_VBR_COMPLETE;
            }
            dispatchEvent(new PlayableSongEvent(PlayableSongEvent.COMPLETE, _loc_2));
            return;
        }// end function

        public function get lastStreamKey() : String
        {
            return this._2110014263lastStreamKey;
        }// end function

        public function get context() : Object
        {
            return this._951530927context;
        }// end function

        protected function fetchNewStreamKey(param1:String = "", param2:String = "", param3:int = 0, param4:Number = 0) : void
        {
            var _loc_5:JSONResult = null;
            this.sound = null;
            this.lastStreamKey = "";
            this.lastServerID = 0;
            this.lastStreamServer = "";
            this.secondsListened = 0;
            this.downloadReported = false;
            this.playbackReported = false;
            this.thirtySecReported = false;
            this.completeReported = false;
            this.position = 0;
            this.bytesLoaded = 0;
            this.bytesTotal = 0;
            this.consecutiveBadFrames = 0;
            this.bufferCount = 0;
            this.noBufferCount = 0;
            this.cancelPendingPlayback = false;
            this.playStatus = PlayableSong.PLAY_STATUS_INITIALIZING;
            if (param1 && param2 && param3)
            {
                _loc_5 = new JSONResult();
                _loc_5.result = {streamKey:param1, ip:param2, streamServerID:param3, FileToken:"", uSecs:0};
                getStreamKeyResult(_loc_5, {prefetch:!playOnStreamKey});
            }
            else if (song.songID === 0)
            {
                dispatchEvent(new PlayableSongEvent(PlayableSongEvent.ERROR, PlayableSongEvent.FAILED_MUST_PROVIDE_STREAMKEY));
            }
            else if (PlayableSong.consecutiveFailedStreamKeys > 4)
            {
                this.playStatus = PlayableSong.PLAY_STATUS_NONE;
                PlayableSong.consecutiveFailedStreamKeys = 0;
                dispatchEvent(new PlayableSongEvent(PlayableSongEvent.ERROR, PlayableSongEvent.FAILED_TOO_MANY_STREAMKEY_FAILS));
            }
            else
            {
                service.send(false, "getStreamKeyFromSongIDEx", {songID:song.songID, prefetch:!this.playOnStreamKey, country:service.country, mobile:PlayableSong.useMobile, type:calculateStreamType()}, new ItemResponder(getStreamKeyResult, getStreamKeyFault, {prefetch:!this.playOnStreamKey}));
            }
            return;
        }// end function

        protected function set fadeTimerDown(param1:Timer) : void
        {
            var _loc_2:* = this.fadeTimerDown;
            if (_loc_2 !== param1)
            {
                this._143963541fadeTimerDown = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "fadeTimerDown", _loc_2, param1));
            }
            return;
        }// end function

        public function get isFavorite() : Boolean
        {
            return song && song.hasOwnProperty("isFavorite") ? (song["isFavorite"]) : (false);
        }// end function

        public function load(param1:String = "", param2:String = "", param3:int = 0, param4:Number = 0) : void
        {
            if (this.playStatus == PlayableSong.PLAY_STATUS_INITIALIZING)
            {
                return;
            }
            if (this.sound && !this.thirtySecReported)
            {
                return;
            }
            playOnStreamKey = false;
            fetchNewStreamKey(param1, param2, param3, param4);
            return;
        }// end function

        private function songPropChange(event:PropertyChangeEvent) : void
        {
            if (PlayableSong.PASSTHROUGH_PROP.indexOf(event.property) != -1)
            {
                dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, event.property, event.oldValue, event.newValue));
            }
            return;
        }// end function

        public function pause() : void
        {
            if (_sound)
            {
                if (this.fadeInOut)
                {
                    this.fadeOut();
                }
                else
                {
                    _sound.pause();
                }
                this.playStatus = PlayableSong.PLAY_STATUS_PAUSED;
            }
            else
            {
                playOnStreamKey = false;
            }
            return;
        }// end function

        public function get isArtistVerified() : int
        {
            return song && song.hasOwnProperty("isArtistVerified") ? (song["isArtistVerified"]) : (-1);
        }// end function

        public function get filters() : Array
        {
            return _sound ? (_sound.filters) : (null);
        }// end function

        public function get currentStreamServer() : String
        {
            return this._102002428currentStreamServer;
        }// end function

        public function set currentStreamServer(param1:String) : void
        {
            var _loc_2:* = this._102002428currentStreamServer;
            if (_loc_2 !== param1)
            {
                this._102002428currentStreamServer = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "currentStreamServer", _loc_2, param1));
            }
            return;
        }// end function

        public static function get consecutiveFailedStreamKeys() : int
        {
            return PlayableSong._603662715consecutiveFailedStreamKeys;
        }// end function

        public static function set currentBufferSize(param1:int) : void
        {
            var _loc_3:IEventDispatcher = null;
            var _loc_2:* = PlayableSong._1444110662currentBufferSize;
            if (_loc_2 !== param1)
            {
                PlayableSong._1444110662currentBufferSize = param1;
                _loc_3 = PlayableSong.staticEventDispatcher;
                if (_loc_3 != null)
                {
                    _loc_3.dispatchEvent(PropertyChangeEvent.createUpdateEvent(PlayableSong, "currentBufferSize", _loc_2, param1));
                }
            }
            return;
        }// end function

        public static function get checkPolicyFile() : Boolean
        {
            return PlayableSong._1498006282checkPolicyFile;
        }// end function

        public static function get useMobile() : Boolean
        {
            return PlayableSong._705511159useMobile;
        }// end function

        public static function set useMobile(param1:Boolean) : void
        {
            var _loc_3:IEventDispatcher = null;
            var _loc_2:* = PlayableSong._705511159useMobile;
            if (_loc_2 !== param1)
            {
                PlayableSong._705511159useMobile = param1;
                _loc_3 = PlayableSong.staticEventDispatcher;
                if (_loc_3 != null)
                {
                    _loc_3.dispatchEvent(PropertyChangeEvent.createUpdateEvent(PlayableSong, "useMobile", _loc_2, param1));
                }
            }
            return;
        }// end function

        public static function get useStagingScript() : Boolean
        {
            return PlayableSong._1705597599useStagingScript;
        }// end function

        public static function get staticEventDispatcher() : IEventDispatcher
        {
            return _staticBindingEventDispatcher;
        }// end function

        public static function set userForReporting(param1:Object) : void
        {
            var _loc_3:IEventDispatcher = null;
            var _loc_2:* = PlayableSong._1662479664userForReporting;
            if (_loc_2 !== param1)
            {
                PlayableSong._1662479664userForReporting = param1;
                _loc_3 = PlayableSong.staticEventDispatcher;
                if (_loc_3 != null)
                {
                    _loc_3.dispatchEvent(PropertyChangeEvent.createUpdateEvent(PlayableSong, "userForReporting", _loc_2, param1));
                }
            }
            return;
        }// end function

        public static function get currentBufferSize() : int
        {
            return PlayableSong._1444110662currentBufferSize;
        }// end function

        public static function set useStagingScript(param1:Boolean) : void
        {
            var _loc_3:IEventDispatcher = null;
            var _loc_2:* = PlayableSong._1705597599useStagingScript;
            if (_loc_2 !== param1)
            {
                PlayableSong._1705597599useStagingScript = param1;
                _loc_3 = PlayableSong.staticEventDispatcher;
                if (_loc_3 != null)
                {
                    _loc_3.dispatchEvent(PropertyChangeEvent.createUpdateEvent(PlayableSong, "useStagingScript", _loc_2, param1));
                }
            }
            return;
        }// end function

        public static function get userForReporting() : Object
        {
            return PlayableSong._1662479664userForReporting;
        }// end function

        public static function set checkPolicyFile(param1:Boolean) : void
        {
            var _loc_3:IEventDispatcher = null;
            var _loc_2:* = PlayableSong._1498006282checkPolicyFile;
            if (_loc_2 !== param1)
            {
                PlayableSong._1498006282checkPolicyFile = param1;
                _loc_3 = PlayableSong.staticEventDispatcher;
                if (_loc_3 != null)
                {
                    _loc_3.dispatchEvent(PropertyChangeEvent.createUpdateEvent(PlayableSong, "checkPolicyFile", _loc_2, param1));
                }
            }
            return;
        }// end function

        public static function set consecutiveFailedStreamKeys(param1:int) : void
        {
            var _loc_3:IEventDispatcher = null;
            var _loc_2:* = PlayableSong._603662715consecutiveFailedStreamKeys;
            if (_loc_2 !== param1)
            {
                PlayableSong._603662715consecutiveFailedStreamKeys = param1;
                _loc_3 = PlayableSong.staticEventDispatcher;
                if (_loc_3 != null)
                {
                    _loc_3.dispatchEvent(PropertyChangeEvent.createUpdateEvent(PlayableSong, "consecutiveFailedStreamKeys", _loc_2, param1));
                }
            }
            return;
        }// end function

    }
}
