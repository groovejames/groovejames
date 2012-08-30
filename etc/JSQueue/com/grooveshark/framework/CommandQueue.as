package com.grooveshark.framework
{
    import flash.events.*;

    public class CommandQueue extends Object
    {
        protected var queue:Array;
        protected var currentCommand:ICommand;

        public function CommandQueue()
        {
            queue = [];
            return;
        }// end function

        protected function onCommandComplete(event:Event) : void
        {
            var _loc_3:int = 0;
            var _loc_2:* = event.currentTarget as ICommand;
            _loc_2.removeEventListener(Event.COMPLETE, onCommandComplete);
            _loc_2.removeEventListener("failed", onCommandComplete);
            if (_loc_2 != currentCommand)
            {
                if (currentCommand.hasEventListener(Event.COMPLETE))
                {
                    currentCommand.removeEventListener(Event.COMPLETE, onCommandComplete);
                }
                if (currentCommand.hasEventListener("failed"))
                {
                    currentCommand.removeEventListener("failed", onCommandComplete);
                }
                _loc_3 = queue.indexOf(_loc_2);
                if (_loc_3 != -1)
                {
                    queue.splice(_loc_3, 1);
                }
            }
            if (queue.length)
            {
                currentCommand = queue.shift();
                currentCommand.addEventListener(Event.COMPLETE, onCommandComplete);
                currentCommand.addEventListener("failed", onCommandComplete);
                currentCommand.execute();
            }
            else
            {
                currentCommand = null;
            }
            return;
        }// end function

        public function queueCommand(param1:ICommand) : void
        {
            if (!currentCommand)
            {
                currentCommand = param1;
                currentCommand.addEventListener(Event.COMPLETE, onCommandComplete);
                currentCommand.addEventListener("failed", onCommandComplete);
                currentCommand.execute();
            }
            else
            {
                queue.push(param1);
            }
            return;
        }// end function

    }
}
