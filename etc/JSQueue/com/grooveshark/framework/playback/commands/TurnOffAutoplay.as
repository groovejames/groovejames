package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;

    public class TurnOffAutoplay extends QueueCommand
    {
        private var userInitiated:Boolean;

        public function TurnOffAutoplay(param1:IDualService, param2:Queue)
        {
            super(param1, param2);
            this.userInitiated = param2.autoplayUserInitiated;
            return;
        }// end function

        override public function execute() : void
        {
            var _loc_2:QueueSong = null;
            queue.autoplayStatus = null;
            queue.currentAutoplayTag = null;
            queue.currentTagMethod = "autoplayGetSong";
            if (userInitiated)
            {
                queue.autoAutoplayDisabled = true;
            }
            var _loc_1:Array = [];
            for each (_loc_2 in queue)
            {
                
                if (_loc_2.eligibleForAutoplayRemoval)
                {
                    _loc_1.push(_loc_2);
                }
            }
            if (_loc_1.length)
            {
                queue.removeItems(_loc_1, false);
            }
            dispatchEvent(new Event(Event.COMPLETE));
            return;
        }// end function

    }
}
