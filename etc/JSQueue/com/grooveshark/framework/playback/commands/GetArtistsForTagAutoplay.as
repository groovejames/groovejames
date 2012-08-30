package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;

    public class GetArtistsForTagAutoplay extends QueueCommand
    {
        private var userInitiated:Boolean;
        private var attempts:int = 0;
        private var tag:Tag;
        private var tagMethod:String;

        public function GetArtistsForTagAutoplay(param1:IDualService, param2:Queue, param3:Tag, param4:Boolean, param5:String = "autoplayGetSong")
        {
            super(param1, param2);
            this.tag = param3;
            this.tagMethod = param5;
            this.userInitiated = param4;
            return;
        }// end function

        private function reexecute(event:TimerEvent) : void
        {
            execute();
            return;
        }// end function

        private function serviceFault(param1:Object, param2:Object = null) : void
        {
            onFail((param1 as JSONFault).message, (param1 as JSONFault).code != -256);
            return;
        }// end function

        private function serviceSuccess(param1:Object, param2:Object = null) : void
        {
            var _loc_4:Array = null;
            var _loc_5:Object = null;
            var _loc_6:int = 0;
            var _loc_3:* = (param1 as JSONResult).result as Array;
            if (!_loc_3)
            {
                _loc_3 = [];
            }
            if (_loc_3.length || tagMethod !== "autoplayGetSong")
            {
                _loc_4 = [];
                for each (_loc_5 in _loc_3)
                {
                    
                    _loc_6 = int(_loc_5.ArtistID);
                    if (_loc_6)
                    {
                        _loc_4.push(_loc_6);
                    }
                }
                if (!queue.autoplayStatus)
                {
                    queue.autoplayStatus = new AutoplayStatus(queue);
                }
                queue.autoplayStatus.addTagArtistSeeds(_loc_4);
                queue.currentAutoplayTag = tag;
                queue.currentTagMethod = tagMethod;
                if (queue.autoplayEnabled)
                {
                    queue.resetPendingAutoplaySuggestion(true);
                }
                else
                {
                    queue.setAutoplayEnabled(true, userInitiated);
                }
                dispatchEvent(new Event(Event.COMPLETE));
            }
            else
            {
                onFail("No artists returned.");
            }
            return;
        }// end function

        override public function execute() : void
        {
            if (!tag || !tag.tagID)
            {
                onFail("No tagID provided.", false);
                return;
            }
            var _loc_2:* = attempts + 1;
            attempts = _loc_2;
            service.send(false, "getArtistsForTagRadio", {tagID:tag.tagID}, new ItemResponder(serviceSuccess, serviceFault));
            return;
        }// end function

        private function onFail(param1:String, param2:Boolean = true) : void
        {
            var _loc_3:int = 0;
            var _loc_4:Timer = null;
            if (param2 && attempts < 3)
            {
                Debug.getInstance().print("[GetArtistsForTagAutoplay] Failed: " + param1 + " Will re-attempt.");
                _loc_3 = 100 + Math.floor(Math.random() * 400);
                _loc_4 = new Timer(_loc_3, 1);
                _loc_4.addEventListener(TimerEvent.TIMER_COMPLETE, reexecute, false, 0, true);
                _loc_4.start();
            }
            else
            {
                Debug.getInstance().print("[GetArtistsForTagAutoplay] Failed: " + param1 + " Giving up.");
                dispatchEvent(new Event("failed"));
            }
            return;
        }// end function

    }
}
