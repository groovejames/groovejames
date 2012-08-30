package com.grooveshark.framework.playback
{
    import flash.events.*;
    import mx.events.*;

    public class Tag extends EventDispatcher
    {
        private var _1549184699tagName:String;
        private var _110119477tagID:uint;
        public static const TAG_STATIONS:Array = new Array(new Tag(13, "ALTERNATIVE"), new Tag(75, "AMBIENT"), new Tag(96, "BLUEGRASS"), new Tag(230, "BLUES"), new Tag(750, "CLASSICAL"), new Tag(3529, "CLASSIC_ROCK"), new Tag(80, "COUNTRY"), new Tag(67, "ELECTRONICA"), new Tag(191, "EXPERIMENTAL"), new Tag(122, "FOLK"), new Tag(29, "HIP_HOP"), new Tag(136, "INDIE"), new Tag(43, "JAZZ"), new Tag(528, "LATIN"), new Tag(17, "METAL"), new Tag(102, "OLDIES"), new Tag(56, "POP"), new Tag(111, "PUNK"), new Tag(3, "RAP"), new Tag(160, "REGGAE"), new Tag(4, "RNB"), new Tag(12, "ROCK"), new Tag(69, "TRANCE"));
        private static var _tagIDLookup:Object;

        public function Tag(param1:int, param2:String)
        {
            tagID = param1;
            tagName = param2;
            return;
        }// end function

        public function set tagID(param1:uint) : void
        {
            var _loc_2:* = this._110119477tagID;
            if (_loc_2 !== param1)
            {
                this._110119477tagID = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "tagID", _loc_2, param1));
            }
            return;
        }// end function

        public function get tagName() : String
        {
            return this._1549184699tagName;
        }// end function

        public function set tagName(param1:String) : void
        {
            var _loc_2:* = this._1549184699tagName;
            if (_loc_2 !== param1)
            {
                this._1549184699tagName = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "tagName", _loc_2, param1));
            }
            return;
        }// end function

        override public function toString() : String
        {
            return "[Tag] " + this.tagID + ":" + this.tagName;
        }// end function

        public function get tagID() : uint
        {
            return this._110119477tagID;
        }// end function

        public static function buildLookup() : Object
        {
            var _loc_2:Tag = null;
            var _loc_1:Object = {};
            for each (_loc_2 in Tag.TAG_STATIONS)
            {
                
                _loc_1[_loc_2.tagID] = _loc_2;
            }
            return _loc_1;
        }// end function

        public static function get tagIDLookup() : Object
        {
            if (!_tagIDLookup)
            {
                _tagIDLookup = buildLookup();
            }
            return _tagIDLookup;
        }// end function

    }
}
