﻿package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;
    import mx.utils.*;

    public class RefreshPendingAutoplaySong extends QueueCommand
    {
        private var attempts:int = 0;
        private var playOnAdd:Boolean;
        private var status:Object;
        private var song:QueueSong;

        public function RefreshPendingAutoplaySong(param1:IDualService, param2:Queue, param3:QueueSong, param4:Boolean = false)
        {
            super(param1, param2);
            this.song = param3;
            this.playOnAdd = param4;
            if (!param2.autoplayStatus)
            {
                param2.autoplayStatus = new AutoplayStatus(param2);
            }
            this.status = param2.autoplayStatus.statusForRPC;
            return;
        }// end function

        private function reexecute(event:Event) : void
        {
            execute();
            return;
        }// end function

        private function serviceFault(param1:Object, param2:Object = null) : void
        {
            var _loc_4:String = null;
            var _loc_3:* = param1 as JSONFault;
            switch(_loc_3.code)
            {
                case 2048:
                {
                    _loc_4 = QueueEvent.NO_RECOMMENDATIONS;
                    queue.setAutoplayEnabled(false, false);
                    break;
                }
                case 512:
                {
                    _loc_4 = QueueEvent.RATE_LIMIT_EXCEEDED;
                    queue.setAutoplayEnabled(false, false);
                    break;
                }
                case -256:
                {
                    _loc_4 = "tokenFailure";
                    queue.setAutoplayEnabled(false, false);
                    break;
                }
                case 10:
                {
                    _loc_4 = "maintenanceMode";
                    queue.setAutoplayEnabled(false, false);
                    break;
                }
                default:
                {
                    _loc_4 = QueueEvent.UNKNOWN_ERROR;
                    break;
                    break;
                }
            }
            onFail(_loc_4, _loc_4 == QueueEvent.UNKNOWN_ERROR);
            return;
        }// end function

        override public function execute() : void
        {
            if (!queue || !queue.queueID)
            {
                onFail(QueueEvent.QUEUE_NOT_READY, false);
                return;
            }
            if (!queue.autoplayEnabled || !song.eligibleForAutoplayRemoval)
            {
                onFail("songNotRequired", false);
                return;
            }
            if (status.seedArtists.length == 0)
            {
                onFail(QueueEvent.NO_SEEDS, false);
                return;
            }
            if (queue.consecutiveFailedAutoplayRequests >= 3 && getTimer() - queue.lastFailedAutoplayRequest < 5000)
            {
                onFail(QueueEvent.TOO_MANY_FAILURES, false);
                return;
            }
            var _loc_1:String = "autoplayGetSong";
            var _loc_2:* = ObjectUtil.copy(status);
            _loc_2.songQueueID = queue.queueID;
            _loc_2.country = service.country;
            var _loc_4:* = attempts + 1;
            attempts = _loc_4;
            if (queue.currentAutoplayTag)
            {
                _loc_2.tagID = queue.currentAutoplayTag.tagID;
                if (queue.currentTagMethod)
                {
                    _loc_1 = queue.currentTagMethod;
                }
            }
            service.send(false, _loc_1, _loc_2, new ItemResponder(serviceSuccess, serviceFault));
            return;
        }// end function

        protected function makeSongFromRaw(param1:Object) : BaseSong
        {
            var _loc_3:Array = null;
            var _loc_2:* = new BaseSong();
            _loc_2.songID = param1.SongID;
            _loc_2.songName = param1.SongName;
            _loc_2.artistID = param1.ArtistID;
            _loc_2.artistName = param1.ArtistName;
            _loc_2.albumID = param1.AlbumID;
            _loc_2.albumName = param1.AlbumName;
            _loc_2.estimateDuration = int(param1.EstimateDuration) * 1000;
            if (param1.CoverArtUrl)
            {
                _loc_3 = String(param1.CoverArtUrl).split("/");
                if (_loc_3.length)
                {
                    _loc_2.artFilename = String(_loc_3[(_loc_3.length - 1)]).substring(1);
                }
            }
            return _loc_2;
        }// end function

        private function serviceSuccess(param1:Object, param2:Object = null) : void
        {
            queue.consecutiveFailedAutoplayRequests = 0;
            if (!song.eligibleForAutoplayRemoval || !queue.contains(song))
            {
                onFail("songNotRequired", false);
                return;
            }
            var _loc_3:* = (param1 as JSONResult).result;
            if (!_loc_3)
            {
                onFail(QueueEvent.UNKNOWN_ERROR);
                return;
            }
            var _loc_4:* = makeSongFromRaw(_loc_3);
            var _loc_5:* = new QueueSong(_loc_4, queue, service, {type:"radio", data:{}});
            new QueueSong(_loc_4, queue, service, {type:"radio", data:{}}).source = _loc_3.source;
            if (queue.currentAutoplayTag)
            {
                _loc_5.context.data.tagID = queue.currentAutoplayTag.tagID;
            }
            _loc_5.sponsoredAutoplayID = int(_loc_3.SponsoredAutoplayID);
            var _loc_6:* = StringUtils.condenseTitle(_loc_5.song.songName);
            if (queue.autoplayStatus && queue.autoplayStatus.badTitles.indexOf(_loc_6) != -1 && attempts < 3)
            {
                this.status.songIDsAlreadySeen.push(_loc_5.song.songID);
                onFail("Title Match");
                return;
            }
            queue.addItemsAt([_loc_5], -1, playOnAdd);
            queue.removeItems([song], false);
            dispatchEvent(new Event(Event.COMPLETE));
            return;
        }// end function

        private function onFail(param1:String, param2:Boolean = true) : void
        {
            var _loc_3:int = 0;
            var _loc_4:Timer = null;
            if (param2 && attempts < 3)
            {
                Debug.getInstance().print("[RefreshPendingAutoplaySong] Failed: " + param1 + " Will re-attempt.");
                _loc_3 = 100 + Math.floor(Math.random() * 400);
                _loc_4 = new Timer(_loc_3, 1);
                _loc_4.addEventListener(TimerEvent.TIMER_COMPLETE, reexecute, false, 0, true);
                _loc_4.start();
            }
            else
            {
                switch(param1)
                {
                    case "songNotRequired":
                    {
                        break;
                    }
                    case QueueEvent.TOO_MANY_FAILURES:
                    {
                        queue.dispatchEvent(new QueueEvent(QueueEvent.AUTOPLAY_FAILED, param1, true));
                        queue.setAutoplayEnabled(false, false);
                        break;
                    }
                    case "tokenFailure":
                    case "maintenanceMode":
                    {
                        var _loc_5:* = queue;
                        var _loc_6:* = queue.consecutiveFailedAutoplayRequests + 1;
                        _loc_5.consecutiveFailedAutoplayRequests = _loc_6;
                        queue.lastFailedAutoplayRequest = getTimer();
                        break;
                    }
                    default:
                    {
                        var _loc_5:* = queue;
                        var _loc_6:* = queue.consecutiveFailedAutoplayRequests + 1;
                        _loc_5.consecutiveFailedAutoplayRequests = _loc_6;
                        queue.lastFailedAutoplayRequest = getTimer();
                        queue.dispatchEvent(new QueueEvent(QueueEvent.AUTOPLAY_FAILED, param1, false));
                        break;
                        break;
                    }
                }
                Debug.getInstance().print("[RefreshPendingAutoplaySong] Failed: " + param1 + " Giving up.");
                dispatchEvent(new Event("failed"));
            }
            return;
        }// end function

    }
}
