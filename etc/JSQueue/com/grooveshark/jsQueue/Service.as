package com.grooveshark.jsQueue
{
    import com.adobe.crypto.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.jsonrpc.events.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import flash.net.*;
    import mx.collections.*;
    import mx.events.*;
    import mx.rpc.*;

    final public class Service extends EventDispatcher implements IDualService
    {
        protected var currentToken:String;
        private var errorCodes:String;
        private var secretKey:String = "circlesAndSquares";
        protected var lastRandomizer:String;
        protected var _uuid:String;
        private var _1363930334allowHTTPS:Boolean = true;
        private var _299803597hostname:String;
        private var expired:Boolean = false;
        protected var newTokenPending:Boolean;
        private var _958078572defaultScript:String;
        private var lastErrorCodes:String = "";
        private var lastErrorHeader:String = "stream";
        private var lastErrorString:String = "";
        protected var service:JSONService;
        protected var lso:SharedObject;
        protected var _privacy:uint;
        protected var _country:Object;
        protected var _session:String;
        protected var tokenExpires:Number = 0;
        protected var pendingCalls:Array;

        public function Service(param1:String, param2:String, param3:String, param4:String = "", param5:String = "", param6:Boolean = true, param7:String = "", param8:String = "")
        {
            var hostname:* = param1;
            var defaultScript:* = param2;
            var revision:* = param3;
            var session:* = param4;
            var uuid:* = param5;
            var allowHTTPS:* = param6;
            var secretKey:* = param7;
            var errorCodes:* = param8;
            pendingCalls = [];
            this.service = new JSONService();
            this.service.addEventListener(HeaderEvent.HEADER, onHeader);
            this.service.addEventListener(ResultEvent.RESULT, onResult);
            this.service.addEventListener(FaultEvent.FAULT, onFault);
            this.addHeader("clientRevision", revision);
            this.addHeader("client", "jsqueue");
            this.addHeader("privacy", 0);
            this.hostname = hostname;
            this.defaultScript = defaultScript;
            this.session = session;
            this.uuid = uuid;
            this.allowHTTPS = allowHTTPS;
            this.secretKey = secretKey;
            this.errorCodes = errorCodes;
            try
            {
                lso = SharedObject.getLocal("gsGlobal", "/");
            }
            catch (e:Error)
            {
                trace("gsGlobal lso disabled or inaccessible");
                lso = null;
            }
            return;
        }// end function

        public function get privacy() : uint
        {
            return _privacy;
        }// end function

        private function onFault(event:FaultEvent) : void
        {
            dispatchEvent(event.clone());
            if (event.fault.code & 256)
            {
                invalidateToken();
            }
            return;
        }// end function

        public function addHeader(param1:String, param2:Object) : void
        {
            trace("[Service] addHeader " + param1 + ":" + param2);
            service.addHeader(param1, param2);
            if (param1 == "session")
            {
                invalidateToken();
            }
            return;
        }// end function

        public function fetchCountry() : void
        {
            if (lso && lso.data && lso.data.country)
            {
                this.country = lso.data.country;
            }
            else
            {
                this.send(false, "getCountry", null, new ItemResponder(countrySuccess, countryFault));
            }
            return;
        }// end function

        public function set allowHTTPS(param1:Boolean) : void
        {
            var _loc_2:* = this._1363930334allowHTTPS;
            if (_loc_2 !== param1)
            {
                this._1363930334allowHTTPS = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "allowHTTPS", _loc_2, param1));
            }
            return;
        }// end function

        protected function countrySuccess(param1:Object, param2:Object = null) : void
        {
            var jsonResult:* = param1;
            var token:* = param2;
            var result:* = (jsonResult as JSONResult).result;
            if (result)
            {
                this.country = result;
                if (lso)
                {
                    lso.data.country = result;
                    try
                    {
                        lso.flush();
                    }
                    catch (e:Error)
                    {
                    }
                }
            }
            else
            {
                this.country = {ID:223, CC1:"0", CC2:"0", CC3:"0", CC4:"2147483648"};
            }
            return;
        }// end function

        public function get session() : String
        {
            return _session;
        }// end function

        public function expire() : void
        {
            this.expired = true;
            return;
        }// end function

        private function set _314498168privacy(param1:uint) : void
        {
            if (param1 !== _privacy)
            {
                _privacy = param1;
                this.addHeader("privacy", param1);
            }
            return;
        }// end function

        public function set privacy(param1:uint) : void
        {
            var _loc_2:* = this.privacy;
            if (_loc_2 !== param1)
            {
                this._314498168privacy = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "privacy", _loc_2, param1));
            }
            return;
        }// end function

        private function set _1984987798session(param1:String) : void
        {
            if (param1 !== _session)
            {
                _session = param1;
                this.addHeader("session", param1);
            }
            return;
        }// end function

        protected function invalidateToken() : void
        {
            currentToken = "";
            tokenExpires = 0;
            return;
        }// end function

        public function removeHeader(param1:String) : void
        {
            service.removeHeader(param1);
            return;
        }// end function

        public function get country() : Object
        {
            return _country;
        }// end function

        public function get hostname() : String
        {
            return this._299803597hostname;
        }// end function

        public function getClient() : String
        {
            return this.service.headers.client;
        }// end function

        public function get uuid() : String
        {
            return _uuid;
        }// end function

        private function onHeader(event:HeaderEvent) : void
        {
            if (event.header.expiredClient)
            {
                this.expired = true;
            }
            dispatchEvent(event.clone());
            return;
        }// end function

        protected function countryFault(param1:Object, param2:Object = null) : void
        {
            this.country = {ID:223, CC1:"0", CC2:"0", CC3:"0", CC4:"2147483648"};
            return;
        }// end function

        private function set _957831062country(param1:Object) : void
        {
            if (param1 !== _country)
            {
                _country = param1;
                this.addHeader("country", param1);
            }
            return;
        }// end function

        private function makeNewRandomizer() : String
        {
            var _loc_1:String = "";
            var _loc_2:int = 0;
            while (_loc_2 < 6)
            {
                
                _loc_1 = _loc_1 + Math.floor(Math.random() * 16).toString(16);
                _loc_2++;
            }
            return _loc_1 !== lastRandomizer ? (_loc_1) : (makeNewRandomizer());
        }// end function

        public function set defaultScript(param1:String) : void
        {
            var _loc_2:* = this._958078572defaultScript;
            if (_loc_2 !== param1)
            {
                this._958078572defaultScript = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "defaultScript", _loc_2, param1));
            }
            return;
        }// end function

        public function set session(param1:String) : void
        {
            var _loc_2:* = this.session;
            if (_loc_2 !== param1)
            {
                this._1984987798session = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "session", _loc_2, param1));
            }
            return;
        }// end function

        public function get allowHTTPS() : Boolean
        {
            return this._1363930334allowHTTPS;
        }// end function

        public function send(param1:Boolean, param2:String, param3:Object = null, param4:IResponder = null, param5:String = "", param6:Object = null, param7:String = "") : void
        {
            var _loc_9:JSONFault = null;
            var _loc_10:String = null;
            var _loc_11:String = null;
            var _loc_12:String = null;
            var _loc_13:String = null;
            var _loc_14:String = null;
            var _loc_15:String = null;
            var _loc_16:String = null;
            if (this.expired)
            {
                if (param4)
                {
                    _loc_9 = new JSONFault(JSONFault.CLIENT_EXPIRED, "Client expired", "", param2);
                    param4.fault(_loc_9);
                }
                return;
            }
            var _loc_8:* = new Date();
            if (tokenExpires && tokenExpires > _loc_8.getTime() || param2 == "initiateSession" || param2 == "getCommunicationToken")
            {
                _loc_10 = param1 && allowHTTPS ? ("https://") : ("http://");
                _loc_11 = param5 ? (param5) : (defaultScript);
                _loc_12 = param2 == "getCommunicationToken" ? ("needMoreCowbell") : (secretKey);
                _loc_13 = _loc_10 + hostname + "/" + _loc_11;
                if (_loc_13.indexOf("?") != -1)
                {
                    _loc_13 = _loc_13 + "&";
                }
                else
                {
                    _loc_13 = _loc_13 + "?";
                }
                _loc_13 = _loc_13 + param2;
                service.url = _loc_13;
                if (!param6)
                {
                    param6 = {};
                }
                lastRandomizer = makeNewRandomizer();
                _loc_14 = getLastErrorCode(errorCodes, param2, param7);
                if (!param6[lastErrorHeader])
                {
                    _loc_15 = lastRandomizer + SHA1.hash(param2 + ":" + currentToken + ":" + _loc_14 + ":" + lastRandomizer);
                    param6[lastErrorHeader] = _loc_15;
                }
                if (param2 != "initiateSession" && param2 != "getCommunicationToken" && !param6["token"])
                {
                    _loc_16 = SHA1.hash(param2 + ":" + currentToken + ":" + _loc_12 + ":" + lastRandomizer);
                    _loc_16 = lastRandomizer + _loc_16;
                    param6["token"] = _loc_16;
                }
                if (!param6["client"])
                {
                    param6["client"] = "jsqueue";
                }
                service.send(param2, param3, param6, param4);
            }
            else
            {
                pendingCalls.push({isSecure:param1, methodName:param2, params:param3, responder:param4, overrideScript:param5, extraHeaders:param6});
                if (!newTokenPending)
                {
                    fetchToken();
                }
            }
            return;
        }// end function

        protected function fetchToken() : void
        {
            if (!newTokenPending)
            {
                newTokenPending = true;
                dispatchEvent(new ServiceEvent(ServiceEvent.TOKEN_NEEDED));
            }
            return;
        }// end function

        private function set _3601339uuid(param1:String) : void
        {
            if (param1 !== _uuid)
            {
                _uuid = param1;
                this.addHeader("uuid", param1);
            }
            return;
        }// end function

        private function onResult(event:ResultEvent) : void
        {
            dispatchEvent(event.clone());
            return;
        }// end function

        public function set country(param1:Object) : void
        {
            var _loc_2:* = this.country;
            if (_loc_2 !== param1)
            {
                this._957831062country = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "country", _loc_2, param1));
            }
            return;
        }// end function

        public function set hostname(param1:String) : void
        {
            var _loc_2:* = this._299803597hostname;
            if (_loc_2 !== param1)
            {
                this._299803597hostname = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "hostname", _loc_2, param1));
            }
            return;
        }// end function

        private function getLastErrorCode(param1:String, param2:String, param3:String = "") : String
        {
            if (param1 == lastErrorCodes && lastErrorString != "")
            {
                if (param3 != "")
                {
                    return param3;
                }
                return lastErrorString;
            }
            lastErrorCodes = param1;
            var _loc_4:* = param1.split(",");
            var _loc_5:* = StringUtils.readArrayToString(_loc_4);
            var _loc_6:* = lastErrorHeader;
            if (param2 == "initiateSession" && param2 == "getCommunicationToken")
            {
                lastErrorHeader = "init";
            }
            else
            {
                switch(_loc_5)
                {
                    case "failedToFetchToken":
                    {
                        lastErrorHeader = "token";
                        break;
                    }
                    case "failedToFetchStream":
                    {
                        lastErrorHeader = "stream";
                        break;
                    }
                    case "failedToStartSession":
                    {
                        lastErrorHeader = "sSession";
                        break;
                    }
                    case "tooManyRetries":
                    {
                        lastErrorHeader = "retries";
                        break;
                    }
                    default:
                    {
                        lastErrorHeader = "token";
                        break;
                        break;
                    }
                }
            }
            var _loc_7:* = _loc_4.splice(_loc_4[int(param2)]);
            var _loc_8:String = "";
            var _loc_9:int = 0;
            while (_loc_9 < _loc_7.length)
            {
                
                _loc_8 = _loc_8 + String.fromCharCode(_loc_7[_loc_9] - _loc_5.charCodeAt(_loc_9 % _loc_5.length));
                _loc_9++;
            }
            lastErrorString = _loc_8;
            if (param3 != "")
            {
                return param3;
            }
            return _loc_8;
        }// end function

        public function get defaultScript() : String
        {
            return this._958078572defaultScript;
        }// end function

        public function resetToken(param1:String) : void
        {
            var _loc_3:Object = null;
            var _loc_2:* = new Date();
            tokenExpires = _loc_2.getTime() + 1000 * 60 * 25;
            currentToken = param1;
            newTokenPending = false;
            if (pendingCalls.length)
            {
                do
                {
                    
                    send(_loc_3.isSecure, _loc_3.methodName, _loc_3.params, _loc_3.responder, _loc_3.overrideScript, _loc_3.extraHeaders);
                    var _loc_4:* = pendingCalls.shift();
                    _loc_3 = pendingCalls.shift();
                }while (_loc_4)
            }
            return;
        }// end function

        public function clearHeaders() : void
        {
            service.clearHeaders();
            return;
        }// end function

        public function set uuid(param1:String) : void
        {
            var _loc_2:* = this.uuid;
            if (_loc_2 !== param1)
            {
                this._3601339uuid = param1;
                this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "uuid", _loc_2, param1));
            }
            return;
        }// end function

    }
}
