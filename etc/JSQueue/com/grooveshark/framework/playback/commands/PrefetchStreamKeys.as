package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;
    import mx.collections.*;

    final public class PrefetchStreamKeys extends EventDispatcher implements ICommand
    {
        private var songIDs:Array;
        private var service:IDualService;
        public var results:Object;
        private var type:int;

        public function PrefetchStreamKeys(param1:IDualService, param2:Array, param3:int = 0)
        {
            this.service = param1;
            this.songIDs = param2;
            this.type = param3;
            this.results = {};
            return;
        }// end function

        private function serviceFault(param1:Object, param2:Object = null) : void
        {
            dispatchEvent(new Event("failed"));
            return;
        }// end function

        private function serviceSuccess(param1:Object, param2:Object = null) : void
        {
            var _loc_5:String = null;
            var _loc_6:String = null;
            var _loc_7:String = null;
            var _loc_8:int = 0;
            var _loc_9:Number = NaN;
            var _loc_10:Object = null;
            var _loc_3:* = param1 as JSONResult;
            var _loc_4:* = new Date().valueOf() + 9 * 60 * 1000;
            if (_loc_3 && _loc_3.result)
            {
                for (_loc_5 in _loc_3.result)
                {
                    
                    _loc_6 = _loc_3.result[_loc_5].streamKey as String;
                    _loc_7 = _loc_3.result[_loc_5].ip as String;
                    _loc_8 = int(_loc_3.result[_loc_5].streamServerID);
                    _loc_9 = Number(_loc_3.result[_loc_5].uSecs);
                    if (_loc_6 !== "false" && _loc_6 !== "null" && _loc_8)
                    {
                        _loc_10 = {streamKey:_loc_6, ip:_loc_7, serverID:_loc_8, uSecs:_loc_9, expires:_loc_4};
                        this.results[int(_loc_5)] = _loc_10;
                    }
                }
            }
            this.dispatchEvent(new Event(Event.COMPLETE));
            return;
        }// end function

        public function execute() : void
        {
            service.send(false, "getStreamKeysFromSongIDs", {songIDs:songIDs, prefetch:false, country:service.country, mobile:PlayableSong.useMobile, type:this.type}, new ItemResponder(serviceSuccess, serviceFault));
            return;
        }// end function

    }
}
