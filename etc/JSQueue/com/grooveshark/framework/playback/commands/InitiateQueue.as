package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;

    public class InitiateQueue extends QueueCommand
    {
        private var attempts:int = 0;

        public function InitiateQueue(param1:IDualService, param2:Queue)
        {
            super(param1, param2);
            return;
        }// end function

        private function reexecute(event:TimerEvent) : void
        {
            execute();
            return;
        }// end function

        override public function execute() : void
        {
            var _loc_1:String = null;
            var _loc_2:String = null;
            if (Queue.userTrackingID > 0)
            {
                _loc_1 = String(Queue.userTrackingID);
                _loc_1 = _loc_1 + int(new Date().valueOf() / 1000);
                _loc_2 = Math.floor(Math.random() * 500).toString();
                while (_loc_2.length < 3)
                {
                    
                    _loc_2 = "0" + _loc_2;
                }
                _loc_1 = _loc_1 + _loc_2;
                queue.queueID = _loc_1;
                dispatchEvent(new Event(Event.COMPLETE));
            }
            else
            {
                var _loc_4:* = attempts + 1;
                attempts = _loc_4;
                service.send(false, "initiateQueue", null, new ItemResponder(serviceSuccess, serviceFault));
            }
            return;
        }// end function

        private function serviceFault(param1:Object, param2:Object = null) : void
        {
            onFail((param1 as JSONFault).message, (param1 as JSONFault).code != -256);
            return;
        }// end function

        private function serviceSuccess(param1:Object, param2:Object = null) : void
        {
            var _loc_3:* = String((param1 as JSONResult).result);
            if (_loc_3)
            {
                queue.queueID = _loc_3;
                dispatchEvent(new Event(Event.COMPLETE));
            }
            else
            {
                onFail("No id returned.");
            }
            return;
        }// end function

        private function onFail(param1:String, param2:Boolean = true) : void
        {
            var _loc_3:int = 0;
            var _loc_4:Timer = null;
            if (param2 && attempts < 0)
            {
                Debug.getInstance().print("[InitiateQueue] Failed: " + param1 + " Will re-attempt.");
                _loc_3 = 100 + Math.floor(Math.random() * 400);
                _loc_4 = new Timer(_loc_3, 1);
                _loc_4.addEventListener(TimerEvent.TIMER_COMPLETE, reexecute, false, 0, true);
                _loc_4.start();
            }
            else
            {
                Debug.getInstance().print("[InitiateQueue] Failed: " + param1 + " Giving up.");
                dispatchEvent(new Event("failed"));
            }
            return;
        }// end function

    }
}
