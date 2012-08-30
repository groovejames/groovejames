package com.grooveshark.jsQueue.commands
{
    import com.grooveshark.framework.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;
    import mx.rpc.*;
    import mx.rpc.http.*;

    final public class SuggestFlattr extends EventDispatcher implements ICommand
    {
        private var reverse:Boolean;
        private var urls:Array;
        private var timer:Timer;
        private var loader:HTTPService;
        public var result:Boolean;
        public var key:String;

        public function SuggestFlattr(param1:Object, param2:String)
        {
            urls = ["http://ad.doubleclick.net/crossdomain.xml", "http://grooveshark.com/dfpAds.html", "http://pagead2.googlesyndication.com/pagead/show_ads.js"];
            this.key = param2;
            if (param1 && param1.urls is Array && (param1.urls as Array).length)
            {
                this.urls = param1.urls as Array;
            }
            var _loc_3:Number = 10000;
            if (param1 && !isNaN(param1.delay))
            {
                _loc_3 = Number(param1.delay);
            }
            if (param1.hasOwnProperty(reverse))
            {
                this.reverse = Boolean(param1.reverse);
            }
            this.timer = new Timer(_loc_3);
            this.timer.addEventListener(TimerEvent.TIMER, reexecute);
            this.loader = new HTTPService();
            this.loader.resultFormat = "text";
            this.loader.method = "GET";
            return;
        }// end function

        private function reexecute(event:TimerEvent) : void
        {
            execute();
            return;
        }// end function

        private function itemFault(param1:Object, param2:Object = null) : void
        {
            if (!this.reverse && this.urls.length)
            {
                timer.reset();
                timer.start();
            }
            else
            {
                this.result = true;
                dispatchEvent(new Event(Event.COMPLETE));
            }
            return;
        }// end function

        private function itemSuccess(param1:Object, param2:Object = null) : void
        {
            if (this.reverse && this.urls.length)
            {
                timer.reset();
                timer.start();
            }
            else
            {
                this.result = false;
                dispatchEvent(new Event(Event.COMPLETE));
            }
            return;
        }// end function

        public function execute() : void
        {
            this.loader.url = urls.shift();
            var _loc_1:* = this.loader.send();
            _loc_1.addResponder(new ItemResponder(itemSuccess, itemFault));
            return;
        }// end function

    }
}
