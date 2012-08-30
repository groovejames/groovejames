package com.grooveshark.jsonrpc
{
    import flash.events.*;
    import mx.rpc.*;

    public interface IDualService extends IEventDispatcher
    {

        public function IDualService();

        function getClient() : String;

        function get country() : Object;

        function send(param1:Boolean, param2:String, param3:Object = null, param4:IResponder = null, param5:String = "", param6:Object = null, param7:String = "") : void;

        function set country(param1:Object) : void;

        function fetchCountry() : void;

    }
}
