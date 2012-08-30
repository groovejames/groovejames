package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;

    public class SongCommand extends EventDispatcher implements ICommand
    {
        protected var song:PlayableSong;
        protected var service:IDualService;

        public function SongCommand(param1:IDualService, param2:PlayableSong)
        {
            this.service = param1;
            this.song = param2;
            return;
        }// end function

        public function execute() : void
        {
            return;
        }// end function

    }
}
