package com.grooveshark.jsonrpc
{
    import com.adobe.serialization.json.*;

    public class JSONRequest extends Object
    {
        public var method:String = "";
        public var parameters:Object;
        public var header:Object;

        public function JSONRequest()
        {
            header = {};
            parameters = {};
            return;
        }// end function

        public function toString() : String
        {
            return JSON.encode(this);
        }// end function

    }
}
