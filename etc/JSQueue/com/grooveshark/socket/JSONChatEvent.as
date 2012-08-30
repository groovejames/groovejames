package com.grooveshark.socket
{
    import flash.events.*;

    final public class JSONChatEvent extends Event
    {
        public var data:Object;
        public static const CONNECTION_ERROR:String = "connectionError";
        public static const CHANNEL_JOIN_ERROR:String = "channelJoinError";
        public static const CONNECTION_DROP:String = "connectionDrop";
        public static const DATA_RECEIVED:String = "dataReceived";
        public static const OTHER_IO_ERROR:String = "otherIOError";
        public static const DATA_PARSE_ERROR:String = "dataParseError";

        public function JSONChatEvent(param1:String, param2:Object = null, param3:Boolean = false, param4:Boolean = false)
        {
            super(param1, param3, param4);
            this.data = param2;
            return;
        }// end function

        override public function clone() : Event
        {
            return new JSONChatEvent(this.type, this.data, this.bubbles, this.cancelable);
        }// end function

    }
}
