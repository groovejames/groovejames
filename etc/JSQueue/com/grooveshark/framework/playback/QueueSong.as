package com.grooveshark.framework.playback
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.commands.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.events.*;

    final public class QueueSong extends PlayableSong
    {
        private var _902545055queueSongID:int = 0;
        var _autoplayVote:int = 0;
        private var addedToRecent:Boolean = false;
        private var _1363713847eligibleForAutoplayRemoval:Boolean = false;
        private var _995424086parent:Queue;
        private var _sponsoredAutoplayID:uint;
        public static const AUTOPLAY_VOTE_NONE:int = 0;
        public static const AUTOPLAY_VOTE_UP:int = 1;
        public static const AUTOPLAY_VOTE_DOWN:int = -1;

        public function QueueSong(param1:BaseSong, param2:Queue, param3:IDualService, param4:Object = null)
        {
            super(param1, param3, param4);
            this.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onPropChange, false, 0, true);
            this.song.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onSongPropChange, false, 0, true);
            this.parent = param2;
            this.parent.addEventListener(CollectionEvent.COLLECTION_CHANGE, onQueueCollectionChange, false, 0, true);
            recalcEligibleForAutoplayRemoval();
            return;
        }// end function

        private function onQueueCollectionChange(event:CollectionEvent) : void
        {
            recalcEligibleForAutoplayRemoval();
            return;
        }// end function

        public function set queueSongID(param1:int) : void
        {
            var _loc_2:* = this._902545055queueSongID;
            if (_loc_2 !== param1)
            {
                this._902545055queueSongID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "queueSongID", _loc_2, param1));
            }
            return;
        }// end function

        public function set eligibleForAutoplayRemoval(param1:Boolean) : void
        {
            var _loc_2:* = this._1363713847eligibleForAutoplayRemoval;
            if (_loc_2 !== param1)
            {
                this._1363713847eligibleForAutoplayRemoval = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "eligibleForAutoplayRemoval", _loc_2, param1));
            }
            return;
        }// end function

        public function set parent(param1:Queue) : void
        {
            var _loc_2:* = this._995424086parent;
            if (_loc_2 !== param1)
            {
                this._995424086parent = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "parent", _loc_2, param1));
            }
            return;
        }// end function

        public function get sponsoredAutoplayID() : uint
        {
            return _sponsoredAutoplayID;
        }// end function

        private function onVoteDownTimer(event:TimerEvent) : void
        {
            if (this.autoplayVote == QueueSong.AUTOPLAY_VOTE_DOWN && this.parent && this.parent.contains(this))
            {
                this.parent.removeItem(this);
            }
            return;
        }// end function

        private function set _1640322797autoplayVote(param1:int) : void
        {
            var _loc_2:Timer = null;
            if (param1 != _autoplayVote)
            {
                _autoplayVote = param1;
                if (param1 == QueueSong.AUTOPLAY_VOTE_DOWN)
                {
                    _loc_2 = new Timer(10000, 1);
                    _loc_2.addEventListener(TimerEvent.TIMER_COMPLETE, onVoteDownTimer, false, 0, true);
                    _loc_2.start();
                    switch(this.playStatus)
                    {
                        case PlayableSong.PLAY_STATUS_INITIALIZING:
                        case PlayableSong.PLAY_STATUS_LOADING:
                        case PlayableSong.PLAY_STATUS_PLAYING:
                        case PlayableSong.PLAY_STATUS_BUFFERING:
                        {
                            this.playStatus = PlayableSong.PLAY_STATUS_COMPLETED;
                            this.dispatchEvent(new PlayableSongEvent(PlayableSongEvent.COMPLETE, PlayableSongEvent.COMPLETE_FORCE_FROWN_SKIP));
                            break;
                        }
                        default:
                        {
                            break;
                        }
                    }
                }
                if (parent && parent.autoplayStatus)
                {
                    parent.autoplayStatus.songVoted(this);
                }
            }
            return;
        }// end function

        function recalcEligibleForAutoplayRemoval() : void
        {
            var _loc_1:int = 0;
            if (this.autoplayVote == QueueSong.AUTOPLAY_VOTE_DOWN)
            {
                eligibleForAutoplayRemoval = true;
                return;
            }
            if (this.source != "user" && !this.lastStreamKey && this.autoplayVote == QueueSong.AUTOPLAY_VOTE_NONE && this.parent)
            {
                _loc_1 = this.parent.getItemIndex(this);
                this.eligibleForAutoplayRemoval = _loc_1 == (parent.length - 1);
                return;
            }
            this.eligibleForAutoplayRemoval = false;
            return;
        }// end function

        public function get queueSongID() : int
        {
            return this._902545055queueSongID;
        }// end function

        private function onSongPropChange(event:PropertyChangeEvent) : void
        {
            switch(event.property)
            {
                case "songName":
                {
                    dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "title", event.oldValue, event.newValue));
                    break;
                }
                case "artistName":
                {
                    dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "artist", event.oldValue, event.newValue));
                    break;
                }
                case "artURL":
                {
                    dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "image", event.oldValue, event.newValue));
                    break;
                }
                default:
                {
                    break;
                }
            }
            return;
        }// end function

        public function set autoplayVote(param1:int) : void
        {
            var _loc_2:* = this.autoplayVote;
            if (_loc_2 !== param1)
            {
                this._1640322797autoplayVote = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "autoplayVote", _loc_2, param1));
            }
            return;
        }// end function

        public function get parent() : Queue
        {
            return this._995424086parent;
        }// end function

        public function get autoplayVote() : int
        {
            return source == "user" && _autoplayVote == AUTOPLAY_VOTE_NONE ? (AUTOPLAY_VOTE_UP) : (_autoplayVote);
        }// end function

        public function setAutoplayVote(param1:int) : void
        {
            var _loc_2:* = new VoteSongForAutoplay(service, this, param1);
            _loc_2.execute();
            return;
        }// end function

        private function onPropChange(event:PropertyChangeEvent) : void
        {
            switch(event.property)
            {
                case "source":
                case "playStatus":
                case "autoplayVote":
                {
                    recalcEligibleForAutoplayRemoval();
                    break;
                }
                default:
                {
                    break;
                }
            }
            return;
        }// end function

        override public function play(param1:String = "", param2:String = "", param3:int = 0, param4:Number = 0) : void
        {
            this.addedToRecent = false;
            if (this.autoplayVote == QueueSong.AUTOPLAY_VOTE_DOWN && parent && parent.autoplayEnabled)
            {
                this.playStatus = PlayableSong.PLAY_STATUS_COMPLETED;
                this.dispatchEvent(new PlayableSongEvent(PlayableSongEvent.COMPLETE, PlayableSongEvent.COMPLETE_FORCE_FROWN_SKIP));
                return;
            }
            super.play(param1, param2, param3, param4);
            return;
        }// end function

        public function get rawAutoplayVote() : int
        {
            return _autoplayVote;
        }// end function

        private function set _1875337257sponsoredAutoplayID(param1:uint) : void
        {
            _sponsoredAutoplayID = param1;
            return;
        }// end function

        public function set sponsoredAutoplayID(param1:uint) : void
        {
            var _loc_2:* = this.sponsoredAutoplayID;
            if (_loc_2 !== param1)
            {
                this._1875337257sponsoredAutoplayID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "sponsoredAutoplayID", _loc_2, param1));
            }
            return;
        }// end function

        public function get eligibleForAutoplayRemoval() : Boolean
        {
            return this._1363713847eligibleForAutoplayRemoval;
        }// end function

    }
}
