package com.grooveshark.framework
{
    import com.grooveshark.utils.*;
    import flash.events.*;
    import mx.events.*;

    public class BasePlaylist extends EventDispatcher
    {
        private var _980229514artFilename:String;
        private var _580007805playlistName:String = "";
        private var _2006098323playlistID:int = 0;
        private var _1899997672numSongs:int;
        private var _265713450username:String;
        private var _1724546052description:String = "";
        private var _836030938userID:int;

        public function BasePlaylist()
        {
            return;
        }// end function

        public function get description() : String
        {
            return this._1724546052description;
        }// end function

        public function getShareURL() : String
        {
            return LiteURLUtils.generateURL(playlistName, playlistID, "playlist", null, true);
        }// end function

        public function get artFilename() : String
        {
            return this._980229514artFilename;
        }// end function

        public function set userID(param1:int) : void
        {
            var _loc_2:* = this._836030938userID;
            if (_loc_2 !== param1)
            {
                this._836030938userID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "userID", _loc_2, param1));
            }
            return;
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

        public function get username() : String
        {
            return this._265713450username;
        }// end function

        public function set playlistID(param1:int) : void
        {
            var _loc_2:* = this._2006098323playlistID;
            if (_loc_2 !== param1)
            {
                this._2006098323playlistID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "playlistID", _loc_2, param1));
            }
            return;
        }// end function

        public function get numSongs() : int
        {
            return this._1899997672numSongs;
        }// end function

        override public function toString() : String
        {
            return "[BasePlaylist] " + playlistID + ":" + playlistName;
        }// end function

        public function get userID() : int
        {
            return this._836030938userID;
        }// end function

        public function get playlistID() : int
        {
            return this._2006098323playlistID;
        }// end function

        public function set numSongs(param1:int) : void
        {
            var _loc_2:* = this._1899997672numSongs;
            if (_loc_2 !== param1)
            {
                this._1899997672numSongs = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "numSongs", _loc_2, param1));
            }
            return;
        }// end function

        public function set description(param1:String) : void
        {
            var _loc_2:* = this._1724546052description;
            if (_loc_2 !== param1)
            {
                this._1724546052description = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "description", _loc_2, param1));
            }
            return;
        }// end function

        public function getURL() : String
        {
            return LiteURLUtils.generateURL(playlistName, playlistID, "playlist");
        }// end function

        public function set playlistName(param1:String) : void
        {
            var _loc_2:* = this._580007805playlistName;
            if (_loc_2 !== param1)
            {
                this._580007805playlistName = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "playlistName", _loc_2, param1));
            }
            return;
        }// end function

        public function set username(param1:String) : void
        {
            var _loc_2:* = this._265713450username;
            if (_loc_2 !== param1)
            {
                this._265713450username = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "username", _loc_2, param1));
            }
            return;
        }// end function

        public function get playlistName() : String
        {
            return this._580007805playlistName;
        }// end function

    }
}
