package com.grooveshark.jsQueue
{
    import flash.events.*;

    final public class ServiceEvent extends Event
    {
        public var detail:String;
        public static const INVALID_CLIENT:String = "invalidClient";
        public static const TOKEN_FAILURE:String = "tokenFailure";
        public static const TOKEN_NEEDED:String = "tokenNeeded";
        public static const SERVICE_ERROR:String = "serviceError";
        public static const MAINTENANCE_MODE:String = "maintenanceMode";

        public function ServiceEvent(param1:String, param2:String = "", param3:Boolean = false, param4:Boolean = false)
        {
            super(param1, param3, param4);
            this.detail = param2;
            return;
        }// end function

        override public function clone() : Event
        {
            return new ServiceEvent(this.type, this.detail, this.bubbles, this.cancelable);
        }// end function

    }
}
