package com.grooveshark.jsonrpc.events
{
    import flash.events.*;

    public class HeaderEvent extends Event
    {
        public var header:Object;
        public static const HEADER:String = "header";

        public function HeaderEvent(param1:String, param2:Object, param3:Boolean = false, param4:Boolean = false)
        {
            super(param1, param3, param4);
            this.header = param2;
            return;
        }// end function

        override public function clone() : Event
        {
            return new HeaderEvent(type, header, bubbles, cancelable);
        }// end function

    }
}
