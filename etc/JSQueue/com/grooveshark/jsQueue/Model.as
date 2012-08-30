package com.grooveshark.jsQueue
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.socket.*;
    import flash.events.*;
    import flash.net.*;
    import flash.utils.*;
    import mx.events.*;
    import mx.utils.*;

    public class Model extends EventDispatcher
    {
        private var flushLSOTimer:Timer;
        private var _260786213revision:String;
        private var _1799419675crossfadeEnabled:Boolean = false;
        private var _2129144446queueToRestore:Object;
        private var _2125426365chatClient:JSONChatClient;
        private var oldLSO:SharedObject;
        private var _662799197playPauseFadeEnabled:Boolean = false;
        private var _volume:Number = 100;
        private var _1995695873currentUserID:int = -1;
        private var _2065669729isMuted:Boolean = false;
        private var _279334822previousQueue:QueueJS;
        private var _334409581songCache:Dictionary;
        private var _1984153269service:Service;
        private var lso:SharedObject;
        private var _130732411persistShuffle:Boolean = false;
        private var _342671880shuffleEnabled:Boolean = false;
        private var _2112713164crossfadeAmount:int = 5000;
        private var _169428869firstVisit:Boolean = true;
        private var _1456008984currentQueue:QueueJS;

        public function Model(param1:Service)
        {
            var today:Date;
            var thirtyDays:Date;
            var d:String;
            var lastVisit:String;
            var numVisitedDays:uint;
            var numPlays:uint;
            var oldDate:Date;
            var lastVisitDate:Date;
            var playsPerDay:uint;
            var playsStored:uint;
            var service:* = param1;
            this.songCache = new Dictionary(true);
            this.service = service;
            this.currentQueue = new QueueJS(this.service, this.songCache);
            this.chatClient = new JSONChatClient(this.service.uuid);
            if (this.service.session)
            {
                this.chatClient.session = this.service.session;
            }
            try
            {
                oldLSO = SharedObject.getLocal("userAuth");
            }
            catch (e:Error)
            {
                oldLSO = null;
                try
                {
                }
                lso = SharedObject.getLocal("jsQueue", "/");
            }
            catch (e:Error)
            {
                lso = null;
            }
            if (lso)
            {
                queueToRestore = ObjectUtil.copy(lso.data.lastQueue);
                if (!isNaN(lso.data.volume))
                {
                    _volume = lso.data.volume;
                }
                if (!isNaN(lso.data.hasVisited) || lso.size !== 0)
                {
                    firstVisit = false;
                }
                lso.data.hasVisited = 1;
                if (!lso.data.visits)
                {
                    lso.data.visits = {};
                }
                today = new Date();
                thirtyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
                var _loc_3:int = 0;
                var _loc_4:* = lso.data.visits;
                while (_loc_4 in _loc_3)
                {
                    
                    d = _loc_4[_loc_3];
                    oldDate = new Date(d);
                    if (oldDate < thirtyDays)
                    {
                        delete lso.data.visits[d];
                    }
                }
                if (!lso.data.visits.hasOwnProperty(today.toDateString()))
                {
                    lso.data.visits[today.toDateString()] = 0;
                }
                lastVisit = lso.data.lastVisit;
                numVisitedDays = lso.data.numVisitedDays;
                numPlays = lso.data.numPlayedSongs;
                if (lastVisit && numVisitedDays)
                {
                    lastVisitDate = new Date(lastVisit);
                    if (lastVisitDate > thirtyDays)
                    {
                        playsPerDay = Math.ceil(numPlays / (lastVisitDate.valueOf() - thirtyDays.valueOf()) / (1000 * 60 * 60 * 24));
                        playsStored;
                        while (lastVisitDate > thirtyDays && playsStored < numPlays)
                        {
                            
                            lso.data.visits[lastVisitDate.toDateString()] = playsPerDay;
                            playsStored = playsStored + playsPerDay;
                            lastVisitDate = new Date(lastVisitDate.getFullYear(), lastVisitDate.getMonth(), (lastVisitDate.getDate() - 1));
                        }
                    }
                    delete lso.data.lastVisit;
                    delete lso.data.numVisitedDays;
                    delete lso.data.numPlayedSongs;
                }
            }
            if (oldLSO)
            {
                if (!queueToRestore)
                {
                    queueToRestore = ObjectUtil.copy(oldLSO.data.lastQueue);
                }
                if (!isNaN(oldLSO.data.hasVisited) || oldLSO.size !== 0)
                {
                    firstVisit = false;
                }
            }
            flushLSOTimer = new Timer(1000, 1);
            flushLSOTimer.addEventListener(TimerEvent.TIMER_COMPLETE, onFlushLSOTimer);
            resetLSOTimer();
            return;
        }// end function

        public function get numPlayedSongs() : uint
        {
            var _loc_2:String = null;
            var _loc_1:uint = 0;
            if (lso && lso.data.visits)
            {
                for (_loc_2 in lso.data.visits)
                {
                    
                    _loc_1 = _loc_1 + lso.data.visits[_loc_2];
                }
            }
            return _loc_1;
        }// end function

        public function set chatClient(param1:JSONChatClient) : void
        {
            var _loc_2:* = this._2125426365chatClient;
            if (_loc_2 !== param1)
            {
                this._2125426365chatClient = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "chatClient", _loc_2, param1));
            }
            return;
        }// end function

        public function get shuffleEnabled() : Boolean
        {
            return this._342671880shuffleEnabled;
        }// end function

        public function set persistShuffle(param1:Boolean) : void
        {
            var _loc_2:* = this._130732411persistShuffle;
            if (_loc_2 !== param1)
            {
                this._130732411persistShuffle = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "persistShuffle", _loc_2, param1));
            }
            return;
        }// end function

        public function set queueToRestore(param1:Object) : void
        {
            var _loc_2:* = this._2129144446queueToRestore;
            if (_loc_2 !== param1)
            {
                this._2129144446queueToRestore = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "queueToRestore", _loc_2, param1));
            }
            return;
        }// end function

        public function set interruptionExpireTime(param1:Number) : void
        {
            var _loc_2:* = this.interruptionExpireTime;
            if (_loc_2 !== param1)
            {
                this._1308537137interruptionExpireTime = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "interruptionExpireTime", _loc_2, param1));
            }
            return;
        }// end function

        public function get persistShuffle() : Boolean
        {
            return this._130732411persistShuffle;
        }// end function

        public function set shuffleEnabled(param1:Boolean) : void
        {
            var _loc_2:* = this._342671880shuffleEnabled;
            if (_loc_2 !== param1)
            {
                this._342671880shuffleEnabled = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "shuffleEnabled", _loc_2, param1));
            }
            return;
        }// end function

        public function get volume() : Number
        {
            return _volume;
        }// end function

        public function get lastQueue() : Object
        {
            if (lso)
            {
                return lso.data.lastQueue;
            }
            return null;
        }// end function

        public function get playPauseFadeEnabled() : Boolean
        {
            return this._662799197playPauseFadeEnabled;
        }// end function

        public function recordPlay(param1:PlayableSong) : void
        {
            var _loc_2:String = null;
            var _loc_3:int = 0;
            if (lso)
            {
                if (!lso.data.visits)
                {
                    lso.data.visits = {};
                }
                _loc_2 = new Date().toDateString();
                if (isNaN(lso.data.visits[_loc_2]))
                {
                    lso.data.visits[_loc_2] = 1;
                }
                else
                {
                    (lso.data.visits[_loc_2] + 1);
                }
                if (param1)
                {
                    if (!(lso.data.plays is Array))
                    {
                        lso.data.plays = [];
                    }
                    _loc_3 = lso.data.plays.indexOf(param1.song.songID);
                    if (_loc_3 != -1)
                    {
                        lso.data.plays.splice(_loc_3, 1);
                    }
                    lso.data.plays.push(param1.song.songID);
                    if (lso.data.plays.length > 50)
                    {
                        lso.data.plays = lso.data.plays.slice(0, 50);
                    }
                }
                resetLSOTimer();
            }
            return;
        }// end function

        public function get chatClient() : JSONChatClient
        {
            return this._2125426365chatClient;
        }// end function

        public function get currentQueue() : QueueJS
        {
            return this._1456008984currentQueue;
        }// end function

        private function set _810883302volume(param1:Number) : void
        {
            if (param1 !== _volume)
            {
                _volume = param1;
                if (lso)
                {
                    lso.data.volume = param1;
                    resetLSOTimer();
                }
            }
            return;
        }// end function

        public function get recentPlays() : Array
        {
            if (lso && lso.data.plays)
            {
                return lso.data.plays;
            }
            return [];
        }// end function

        private function set _1308537137interruptionExpireTime(param1:Number) : void
        {
            if (lso)
            {
                lso.data.interruptionExpireTime = param1;
                resetLSOTimer();
            }
            return;
        }// end function

        public function get queueToRestore() : Object
        {
            return this._2129144446queueToRestore;
        }// end function

        public function set currentQueue(param1:QueueJS) : void
        {
            var _loc_2:* = this._1456008984currentQueue;
            if (_loc_2 !== param1)
            {
                this._1456008984currentQueue = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "currentQueue", _loc_2, param1));
            }
            return;
        }// end function

        public function get interruptionExpireTime() : Number
        {
            if (lso)
            {
                return Number(lso.data.interruptionExpireTime);
            }
            return 0;
        }// end function

        public function get service() : Service
        {
            return this._1984153269service;
        }// end function

        public function set revision(param1:String) : void
        {
            var _loc_2:* = this._260786213revision;
            if (_loc_2 !== param1)
            {
                this._260786213revision = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "revision", _loc_2, param1));
            }
            return;
        }// end function

        public function get numVisitedDays() : uint
        {
            var _loc_2:String = null;
            var _loc_1:uint = 0;
            if (lso && lso.data.visits)
            {
                for (_loc_2 in lso.data.visits)
                {
                    
                    _loc_1 = _loc_1 + 1;
                }
            }
            return _loc_1;
        }// end function

        public function set lastQueue(param1:Object) : void
        {
            var _loc_2:* = this.lastQueue;
            if (_loc_2 !== param1)
            {
                this._2000405531lastQueue = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "lastQueue", _loc_2, param1));
            }
            return;
        }// end function

        public function set previousQueue(param1:QueueJS) : void
        {
            var _loc_2:* = this._279334822previousQueue;
            if (_loc_2 !== param1)
            {
                this._279334822previousQueue = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "previousQueue", _loc_2, param1));
            }
            return;
        }// end function

        public function set playPauseFadeEnabled(param1:Boolean) : void
        {
            var _loc_2:* = this._662799197playPauseFadeEnabled;
            if (_loc_2 !== param1)
            {
                this._662799197playPauseFadeEnabled = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "playPauseFadeEnabled", _loc_2, param1));
            }
            return;
        }// end function

        private function set _2000405531lastQueue(param1:Object) : void
        {
            if (lso)
            {
                lso.data.lastQueue = param1;
                resetLSOTimer();
            }
            return;
        }// end function

        public function set isMuted(param1:Boolean) : void
        {
            var _loc_2:* = this._2065669729isMuted;
            if (_loc_2 !== param1)
            {
                this._2065669729isMuted = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "isMuted", _loc_2, param1));
            }
            return;
        }// end function

        public function set crossfadeEnabled(param1:Boolean) : void
        {
            var _loc_2:* = this._1799419675crossfadeEnabled;
            if (_loc_2 !== param1)
            {
                this._1799419675crossfadeEnabled = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "crossfadeEnabled", _loc_2, param1));
            }
            return;
        }// end function

        private function resetLSOTimer(event:CollectionEvent = null) : void
        {
            flushLSOTimer.reset();
            flushLSOTimer.start();
            return;
        }// end function

        public function set volume(param1:Number) : void
        {
            var _loc_2:* = this.volume;
            if (_loc_2 !== param1)
            {
                this._810883302volume = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "volume", _loc_2, param1));
            }
            return;
        }// end function

        public function get revision() : String
        {
            return this._260786213revision;
        }// end function

        public function set songCache(param1:Dictionary) : void
        {
            var _loc_2:* = this._334409581songCache;
            if (_loc_2 !== param1)
            {
                this._334409581songCache = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "songCache", _loc_2, param1));
            }
            return;
        }// end function

        public function get crossfadeEnabled() : Boolean
        {
            return this._1799419675crossfadeEnabled;
        }// end function

        public function get isMuted() : Boolean
        {
            return this._2065669729isMuted;
        }// end function

        private function onFlushLSOTimer(event:TimerEvent) : void
        {
            var event:* = event;
            if (lso)
            {
                try
                {
                    lso.flush();
                }
                catch (e:Error)
                {
                }
            }
            return;
        }// end function

        public function set service(param1:Service) : void
        {
            var _loc_2:* = this._1984153269service;
            if (_loc_2 !== param1)
            {
                this._1984153269service = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "service", _loc_2, param1));
            }
            return;
        }// end function

        public function get songCache() : Dictionary
        {
            return this._334409581songCache;
        }// end function

        public function set crossfadeAmount(param1:int) : void
        {
            var _loc_2:* = this._2112713164crossfadeAmount;
            if (_loc_2 !== param1)
            {
                this._2112713164crossfadeAmount = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "crossfadeAmount", _loc_2, param1));
            }
            return;
        }// end function

        public function set firstVisit(param1:Boolean) : void
        {
            var _loc_2:* = this._169428869firstVisit;
            if (_loc_2 !== param1)
            {
                this._169428869firstVisit = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "firstVisit", _loc_2, param1));
            }
            return;
        }// end function

        public function get crossfadeAmount() : int
        {
            return this._2112713164crossfadeAmount;
        }// end function

        public function get firstVisit() : Boolean
        {
            return this._169428869firstVisit;
        }// end function

        public function get previousQueue() : QueueJS
        {
            return this._279334822previousQueue;
        }// end function

        public function set currentUserID(param1:int) : void
        {
            var _loc_2:* = this._1995695873currentUserID;
            if (_loc_2 !== param1)
            {
                this._1995695873currentUserID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "currentUserID", _loc_2, param1));
            }
            return;
        }// end function

        public function get currentUserID() : int
        {
            return this._1995695873currentUserID;
        }// end function

    }
}
