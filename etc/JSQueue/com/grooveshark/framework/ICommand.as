package com.grooveshark.framework
{
    import flash.events.*;

    public interface ICommand extends IEventDispatcher
    {

        public function ICommand();

        function execute() : void;

    }
}
