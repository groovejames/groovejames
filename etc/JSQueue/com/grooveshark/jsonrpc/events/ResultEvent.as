package com.grooveshark.jsonrpc.events
{
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;

    public class ResultEvent extends Event
    {
        public var result:JSONResult;
        public static const RESULT:String = "result";

        public function ResultEvent(param1:String, param2:JSONResult, param3:Boolean = false, param4:Boolean = false)
        {
            super(param1, param3, param4);
            this.result = param2;
            return;
        }// end function

        override public function clone() : Event
        {
            return new ResultEvent(type, result, bubbles, cancelable);
        }// end function

    }
}
