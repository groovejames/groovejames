package com.grooveshark.jsonrpc
{
    import com.adobe.serialization.json.*;
    import com.grooveshark.jsonrpc.events.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;
    import mx.rpc.*;
    import mx.rpc.http.*;
    import mx.utils.*;

    public class JSONService extends EventDispatcher
    {
        private var _headers:Object;
        private var httpService:HTTPService;
        public var debug:Boolean = false;

        public function JSONService(param1:String = "")
        {
            httpService = new HTTPService();
            _headers = {};
            httpService.method = "POST";
            httpService.contentType = "application/json";
            httpService.resultFormat = "text";
            this.url = param1;
            return;
        }// end function

        private function throwResult(param1:JSONResult, param2:IResponder = null) : void
        {
            if (param2)
            {
                param2.result(param1);
            }
            dispatchEvent(new ResultEvent(ResultEvent.RESULT, param1));
            return;
        }// end function

        private function handleResult(param1:Object, param2:Object = null) : void
        {
            var responder:IResponder;
            var rawResult:String;
            var jsonFault:JSONFault;
            var parsedResult:Object;
            var jsonResult:JSONResult;
            var result:* = param1;
            var token:* = param2;
            responder;
            if (token && token.responder)
            {
                responder = token.responder as ItemResponder;
            }
            rawResult = String(result.result);
            var i:* = rawResult.indexOf("{\"");
            var j:* = rawResult.lastIndexOf("}");
            if (debug)
            {
                trace("[" + token.method + "][" + getTimer() + "] Received raw response: " + rawResult);
            }
            if (i != -1 && j != -1)
            {
                try
                {
                    parsedResult = JSON.decode(rawResult.substring(i, (j + 1)));
                }
                catch (err:Error)
                {
                    jsonFault = new JSONFault(JSONFault.PARSE_ERROR, "Unable to parse result: " + err.message, rawResult, token.method);
                    throwFault(jsonFault, responder);
                    return;
                }
                if (parsedResult.fault)
                {
                    jsonFault = new JSONFault(parsedResult.fault.code, parsedResult.fault.message, rawResult, token.method);
                    throwFault(jsonFault, responder);
                }
                else
                {
                    jsonResult = new JSONResult();
                    jsonResult.header = parsedResult.header;
                    jsonResult.result = parsedResult.result;
                    jsonResult.rawResult = rawResult;
                    jsonResult.method = token.method;
                    throwResult(jsonResult, responder);
                }
                if (parsedResult.header)
                {
                    dispatchEvent(new HeaderEvent(HeaderEvent.HEADER, parsedResult.header));
                }
            }
            else
            {
                jsonFault = new JSONFault(JSONFault.PARSE_ERROR, "Unable to parse result: Not valid JSON", rawResult, token.method);
                throwFault(jsonFault, responder);
            }
            return;
        }// end function

        public function get headers() : Object
        {
            return _headers;
        }// end function

        public function send(param1:String, param2:Object = null, param3:Object = null, param4:IResponder = null) : void
        {
            var _loc_7:String = null;
            var _loc_5:* = new JSONRequest();
            new JSONRequest().header = ObjectUtil.copy(_headers);
            _loc_5.method = param1;
            _loc_5.parameters = param2;
            if (param3)
            {
                for (_loc_7 in param3)
                {
                    
                    _loc_5.header[_loc_7] = param3[_loc_7];
                }
            }
            var _loc_6:* = httpService.send(JSON.encode(_loc_5));
            httpService.send(JSON.encode(_loc_5)).addResponder(new ItemResponder(handleResult, handleFault, {responder:param4, method:_loc_5.method}));
            if (debug)
            {
                trace("[" + this.url + ":" + _loc_5.method + "][" + getTimer() + "] Sending request: " + JSON.encode(_loc_5));
            }
            return;
        }// end function

        private function handleFault(param1:Object, param2:Object = null) : void
        {
            var _loc_3:IResponder = null;
            if (param2 && param2.responder)
            {
                _loc_3 = param2.responder as ItemResponder;
            }
            if (debug)
            {
                trace("[" + param2.method + "][" + getTimer() + "] Received server fault: " + param1.toString());
            }
            var _loc_4:* = new JSONFault(JSONFault.HTTP_ERROR, "A server error occured: " + param1.toString(), "", param2.method);
            throwFault(_loc_4, _loc_3);
            return;
        }// end function

        public function addHeader(param1:String, param2:Object) : void
        {
            _headers[param1] = param2;
            return;
        }// end function

        public function get url() : String
        {
            return httpService.url;
        }// end function

        public function removeHeader(param1:String) : void
        {
            if (_headers[param1])
            {
                _headers[param1] = undefined;
            }
            return;
        }// end function

        public function clearHeaders() : void
        {
            _headers = {};
            return;
        }// end function

        private function throwFault(param1:JSONFault, param2:IResponder = null) : void
        {
            if (param2)
            {
                param2.fault(param1);
            }
            dispatchEvent(new FaultEvent(FaultEvent.FAULT, param1));
            return;
        }// end function

        public function set url(param1:String) : void
        {
            httpService.url = param1;
            return;
        }// end function

    }
}
