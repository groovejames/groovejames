package com.grooveshark.jsQueue.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.jsQueue.*;
    import flash.events.*;
    import flash.utils.*;

    final public class RestoreQueue extends EventDispatcher implements ICommand
    {
        public var error:Object;
        private var storedQueue:Object;
        private var model:Model;
        private var service:Service;

        public function RestoreQueue(param1:Service, param2:Model, param3:Object)
        {
            this.service = param1;
            this.model = param2;
            this.storedQueue = param3;
            return;
        }// end function

        private function onSongCreateComplete(event:Event) : void
        {
            var newQueue:QueueJS;
            var event:* = event;
            trace("[RestoreQueue] song creation complete");
            try
            {
                newQueue = QueueJS.createFromStoredQueue(storedQueue, model.songCache, service);
            }
            catch (e:Error)
            {
                trace("[RestoreQueue] queue creation failed");
                this.error = {type:"queueRestorationFailed", details:{reason:"Queue creation failed."}};
                dispatchEvent(new Event("failed"));
                return;
            }
            model.previousQueue = newQueue;
            dispatchEvent(new Event("complete"));
            return;
        }// end function

        private function onSongCreateFailed(event:Event) : void
        {
            trace("[RestoreQueue] song creation failed");
            this.error = {type:"queueRestorationFailed", details:{reason:"Song creation failed."}};
            dispatchEvent(new Event("failed"));
            return;
        }// end function

        public function execute() : void
        {
            var _loc_2:Object = null;
            var _loc_3:int = 0;
            var _loc_4:CreateSongsFromIDs = null;
            var _loc_5:Timer = null;
            var _loc_1:Array = [];
            for each (_loc_2 in storedQueue.songs)
            {
                
                _loc_3 = int(_loc_2.songID);
                if (_loc_3)
                {
                    _loc_1.push(_loc_3);
                }
            }
            if (_loc_1.length)
            {
                _loc_4 = new CreateSongsFromIDs(service, model.songCache, _loc_1);
                _loc_4.addEventListener(Event.COMPLETE, onSongCreateComplete);
                _loc_4.addEventListener("failed", onSongCreateFailed);
                _loc_4.execute();
            }
            else
            {
                _loc_5 = new Timer(100, 1);
                _loc_5.addEventListener(TimerEvent.TIMER_COMPLETE, onSongCreateComplete);
                _loc_5.start();
            }
            return;
        }// end function

    }
}
