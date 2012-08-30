package com.grooveshark.framework
{
    import com.grooveshark.utils.*;
    import flash.events.*;
    import mx.events.*;

    public class BaseSong extends EventDispatcher
    {
        private var _980229514artFilename:String = "";
        private var _110541305token:String = "";
        private var _150262052estimateDuration:Number = 0;
        private var _920410166albumID:int;
        private var _1270463035trackNum:int = 0;
        private var _249273754albumName:String = "";
        private var _896725776songID:int;
        private var _629723762artistName:String = "";
        private var _97513095flags:uint = 0;
        private var _1228393822artistID:int;
        private var _1535136064songName:String = "";
        public static const DEFAULT_ART_PATH:String = "http://beta.grooveshark.com/static/amazonart/";

        public function BaseSong()
        {
            return;
        }// end function

        public function get artistName() : String
        {
            return this._629723762artistName;
        }// end function

        public function get songName() : String
        {
            return this._1535136064songName;
        }// end function

        public function get albumID() : int
        {
            return this._920410166albumID;
        }// end function

        public function get token() : String
        {
            return this._110541305token;
        }// end function

        public function get flags() : uint
        {
            return this._97513095flags;
        }// end function

        public function set songName(param1:String) : void
        {
            var _loc_2:* = this._1535136064songName;
            if (_loc_2 !== param1)
            {
                this._1535136064songName = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "songName", _loc_2, param1));
            }
            return;
        }// end function

        public function get artFilename() : String
        {
            return this._980229514artFilename;
        }// end function

        public function set flags(param1:uint) : void
        {
            var _loc_2:* = this._97513095flags;
            if (_loc_2 !== param1)
            {
                this._97513095flags = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "flags", _loc_2, param1));
            }
            return;
        }// end function

        public function set artistID(param1:int) : void
        {
            var _loc_2:* = this._1228393822artistID;
            if (_loc_2 !== param1)
            {
                this._1228393822artistID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "artistID", _loc_2, param1));
            }
            return;
        }// end function

        public function set albumID(param1:int) : void
        {
            var _loc_2:* = this._920410166albumID;
            if (_loc_2 !== param1)
            {
                this._920410166albumID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "albumID", _loc_2, param1));
            }
            return;
        }// end function

        public function get estimateDuration() : Number
        {
            return this._150262052estimateDuration;
        }// end function

        public function get trackNum() : int
        {
            return this._1270463035trackNum;
        }// end function

        public function set token(param1:String) : void
        {
            var _loc_2:* = this._110541305token;
            if (_loc_2 !== param1)
            {
                this._110541305token = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "token", _loc_2, param1));
            }
            return;
        }// end function

        public function set songID(param1:int) : void
        {
            var _loc_2:* = this._896725776songID;
            if (_loc_2 !== param1)
            {
                this._896725776songID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "songID", _loc_2, param1));
            }
            return;
        }// end function

        public function get albumName() : String
        {
            return this._249273754albumName;
        }// end function

        public function set artFilename(param1:String) : void
        {
            var _loc_2:* = this._980229514artFilename;
            if (_loc_2 !== param1)
            {
                this._980229514artFilename = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "artFilename", _loc_2, param1));
            }
            return;
        }// end function

        public function set artistName(param1:String) : void
        {
            var _loc_2:* = this._629723762artistName;
            if (_loc_2 !== param1)
            {
                this._629723762artistName = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "artistName", _loc_2, param1));
            }
            return;
        }// end function

        public function get artistID() : int
        {
            return this._1228393822artistID;
        }// end function

        override public function toString() : String
        {
            return "[BaseSong] " + songID + ":" + songName;
        }// end function

        public function get songID() : int
        {
            return this._896725776songID;
        }// end function

        public function set trackNum(param1:int) : void
        {
            var _loc_2:* = this._1270463035trackNum;
            if (_loc_2 !== param1)
            {
                this._1270463035trackNum = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "trackNum", _loc_2, param1));
            }
            return;
        }// end function

        public function set estimateDuration(param1:Number) : void
        {
            var _loc_2:* = this._150262052estimateDuration;
            if (_loc_2 !== param1)
            {
                this._150262052estimateDuration = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "estimateDuration", _loc_2, param1));
            }
            return;
        }// end function

        public function getURL() : String
        {
            if (songID)
            {
                return LiteURLUtils.generateURL(songName, songID, "song");
            }
            return "";
        }// end function

        public function set albumName(param1:String) : void
        {
            var _loc_2:* = this._249273754albumName;
            if (_loc_2 !== param1)
            {
                this._249273754albumName = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "albumName", _loc_2, param1));
            }
            return;
        }// end function

    }
}
