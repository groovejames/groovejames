package com.grooveshark.framework.playback
{
    import flash.events.*;

    public interface IGSSound extends IEventDispatcher
    {

        public function IGSSound();

        function get filters() : Array;

        function get isStopped() : Boolean;

        function get position() : Number;

        function play() : void;

        function get url() : String;

        function get bytesLoaded() : uint;

        function stop() : void;

        function set position(param1:Number) : void;

        function set volume(param1:Number) : void;

        function set filters(param1:Array) : void;

        function get isPaused() : Boolean;

        function get bytesTotal() : int;

        function get volume() : Number;

        function get duration() : Number;

        function pause() : void;

        function get isBuffering() : Boolean;

    }
}
