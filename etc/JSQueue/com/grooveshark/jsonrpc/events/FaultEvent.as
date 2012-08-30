package com.grooveshark.jsonrpc.events
{
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;

    public class FaultEvent extends Event
    {
        public var fault:JSONFault;
        public static const FAULT:String = "fault";

        public function FaultEvent(param1:String, param2:JSONFault, param3:Boolean = false, param4:Boolean = false)
        {
            super(param1, param3, param4);
            this.fault = param2;
            return;
        }// end function

        override public function clone() : Event
        {
            return new FaultEvent(type, fault, bubbles, cancelable);
        }// end function

    }
}
