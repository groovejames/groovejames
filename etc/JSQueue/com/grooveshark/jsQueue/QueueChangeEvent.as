package com.grooveshark.jsQueue
{

    final public class QueueChangeEvent extends Object
    {
        public var details:Object;
        public var fullQueue:Object = null;
        public var type:String;
        public static const QUEUE_RESET:String = "queueReset";
        public static const CONTENT_CHANGE:String = "contentChange";
        public static const PROPERTY_CHANGE:String = "propertyChange";

        public function QueueChangeEvent(param1:String, param2:Object = null)
        {
            this.type = param1;
            this.details = param2 ? (param2) : ({});
            return;
        }// end function

    }
}
