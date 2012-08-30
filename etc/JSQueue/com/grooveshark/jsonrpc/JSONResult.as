package com.grooveshark.jsonrpc
{
    import com.adobe.serialization.json.*;

    public class JSONResult extends Object
    {
        public var header:Object;
        public var rawResult:String;
        public var method:String;
        public var result:Object;

        public function JSONResult()
        {
            return;
        }// end function

        public function toString() : String
        {
            return JSON.encode(this);
        }// end function

    }
}
