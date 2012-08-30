package com.grooveshark.jsonrpc
{
    import com.adobe.serialization.json.*;

    public class JSONFault extends Object
    {
        public var rawResult:String;
        public var message:String;
        public var method:String;
        public var code:Number;
        public static const CLIENT_EXPIRED:int = 1024;
        public static const HTTP_ERROR:int = 2;
        public static const DOWN_FOR_MAINTENCE:int = 10;
        public static var lastError:Array;
        public static const PARSE_ERROR:int = 4;

        public function JSONFault(param1:Number, param2:String, param3:String, param4:String)
        {
            var _loc_5:String = null;
            var _loc_6:RegExp = null;
            var _loc_7:RegExp = null;
            this.code = param1;
            this.message = param2;
            this.rawResult = param3;
            this.method = param4;
            if (param1 != DOWN_FOR_MAINTENCE && param1 != CLIENT_EXPIRED)
            {
                if (!lastError)
                {
                    lastError = [];
                }
                _loc_5 = param2;
                _loc_6 = /url:.*?http.*?(?=""|\s|])""url:.*?http.*?(?="|\s|])/gi;
                _loc_7 = /(?:bubbles|cancelable|eventphase)(?::|=).*?(?=""|\s|])""(?:bubbles|cancelable|eventphase)(?::|=).*?(?="|\s|])/gi;
                _loc_5 = _loc_5.replace(_loc_6, "").replace(_loc_7, "");
                lastError.push({message:param2, code:param1, rawResult:param3, method:param4, string:(param1 == HTTP_ERROR ? ("HTTP_ERROR:") : ("ERROR:")) + "(" + param4 + "): " + _loc_5});
                if (lastError.length > 3)
                {
                    lastError.shift();
                }
            }
            return;
        }// end function

        public function toString() : String
        {
            return JSON.encode(this);
        }// end function

    }
}
