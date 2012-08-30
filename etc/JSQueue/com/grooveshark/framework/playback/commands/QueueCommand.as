package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import flash.events.*;

    public class QueueCommand extends EventDispatcher implements ICommand
    {
        protected var queue:Queue;
        protected var service:IDualService;

        public function QueueCommand(param1:IDualService, param2:Queue)
        {
            this.service = param1;
            this.queue = param2;
            return;
        }// end function

        public function execute() : void
        {
            return;
        }// end function

    }
}
