package com.grooveshark.socket
{
    import com.adobe.serialization.json.*;
    import flash.events.*;
    import flash.net.*;
    import flash.system.*;
    import mx.utils.*;

    public class JSONChatClient extends EventDispatcher
    {
        private var uuid:String;
        private var _userID:int = -1;
        private var availableServers:Object;
        private var failedServers:Array;
        private var responsePending:Boolean = false;
        private var _session:String;
        public var currentServer:Object;
        private var dataQueue:Array;
        private var _socket:Socket;
        private var shouldAuthenticate:Boolean = false;
        public var currentChannels:Array;
        public var channelParams:Object;
        private var pendingServer:Object;
        private var readBuffer:String = "";

        public function JSONChatClient(param1:String, param2:Array = null)
        {
            dataQueue = [];
            currentChannels = [];
            channelParams = {};
            this.availableServers = param2 ? (param2) : ([]);
            this.failedServers = [];
            this.uuid = param1;
            return;
        }// end function

        private function chooseServer() : Object
        {
            var _loc_4:Number = NaN;
            var _loc_1:Number = 0;
            var _loc_2:int = 0;
            while (_loc_2 < this.availableServers.length)
            {
                
                _loc_1 = _loc_1 + this.availableServers[_loc_2].weight;
                _loc_2++;
            }
            var _loc_3:* = Math.floor(Math.random() * _loc_1);
            _loc_1 = 0;
            _loc_2 = 0;
            while (_loc_2 < this.availableServers.length)
            {
                
                _loc_4 = _loc_1;
                _loc_1 = _loc_1 + this.availableServers[_loc_2].weight;
                if (_loc_4 <= _loc_3 && _loc_1 > _loc_3)
                {
                    return this.availableServers[_loc_2];
                }
                _loc_2++;
            }
            return this.availableServers[0];
        }// end function

        private function onSocketSecurityError(event:SecurityErrorEvent) : void
        {
            this.dispatchEvent(new JSONChatEvent(JSONChatEvent.CONNECTION_ERROR, {type:"securityError", server:this.pendingServer}));
            failServer(this.pendingServer);
            this.pendingServer = null;
            reconnect();
            return;
        }// end function

        public function set session(param1:String) : void
        {
            if (param1 !== _session)
            {
                if (_session)
                {
                    this.partChannels([_session]);
                }
                _session = param1;
                this.joinChannels([_session], shouldAuthenticate);
            }
            return;
        }// end function

        private function failServer(param1:Object) : void
        {
            var _loc_2:* = this.availableServers.indexOf(param1);
            if (_loc_2 != -1)
            {
                this.availableServers.splice(_loc_2, 1);
            }
            _loc_2 = this.failedServers.indexOf(param1);
            if (_loc_2 != -1)
            {
                this.failedServers.push(param1);
            }
            return;
        }// end function

        public function set userID(param1:int) : void
        {
            if (param1 !== _userID)
            {
                if (_userID > 0)
                {
                    this.partChannels(["UserID" + _userID, _userID + "_feeds"]);
                }
                _userID = param1;
                if (userID > 0)
                {
                    this.joinChannels([{sub:"UserID" + param1, params:{publishers:[String(param1)]}}, param1 + "_feeds"]);
                }
            }
            return;
        }// end function

        private function writeToSocket(param1:String) : Boolean
        {
            var data:* = param1;
            trace("CHAT: sending data: " + data);
            try
            {
                this.socket.writeUTFBytes(String(data));
                this.socket.flush();
            }
            catch (e:Error)
            {
                trace("CHAT: socket write error: " + e);
                return false;
            }
            return true;
        }// end function

        private function sendNextInQueue() : void
        {
            var _loc_1:String = null;
            if (!this.responsePending && this.dataQueue.length)
            {
                _loc_1 = this.dataQueue.shift();
                this.responsePending = writeToSocket(_loc_1);
            }
            return;
        }// end function

        private function onSocketConnect(event:Event) : void
        {
            this.currentServer = this.pendingServer;
            this.pendingServer = null;
            if (this.currentChannels.length)
            {
                updateChannelList();
            }
            return;
        }// end function

        public function joinChannels(param1:Array, param2:Boolean = false) : void
        {
            var _loc_3:Boolean = false;
            var _loc_4:Object = null;
            var _loc_5:String = null;
            var _loc_6:Object = null;
            for each (_loc_4 in param1)
            {
                
                if (_loc_4 is String)
                {
                    _loc_5 = _loc_4 as String;
                    _loc_6 = {};
                }
                else
                {
                    _loc_5 = _loc_4.sub;
                    _loc_6 = _loc_4.params;
                }
                if (_loc_5)
                {
                    if (currentChannels.indexOf(_loc_5) == -1)
                    {
                        currentChannels.push(_loc_5);
                        _loc_3 = true;
                    }
                    if (!channelParams.hasOwnProperty(_loc_5) || ObjectUtil.compare(channelParams[_loc_5], _loc_6) !== 0)
                    {
                        channelParams[_loc_5] = _loc_6;
                        _loc_3 = true;
                    }
                }
            }
            if (_loc_3 || param2)
            {
                trace("CHAT: Updating channel list");
                updateChannelList(param2);
            }
            if (param2)
            {
                shouldAuthenticate = true;
            }
            return;
        }// end function

        public function setServers(param1:Array) : void
        {
            var _loc_2:Object = null;
            trace("CHAT: set servers " + param1);
            this.availableServers = param1;
            this.failedServers = [];
            if (this.currentServer || this.pendingServer)
            {
                for each (_loc_2 in param1)
                {
                    
                    if (this.currentServer && _loc_2.host == this.currentServer.host)
                    {
                        this.currentServer = _loc_2;
                    }
                    if (this.pendingServer && _loc_2.host == this.pendingServer.host)
                    {
                        this.pendingServer = _loc_2;
                    }
                }
            }
            else
            {
                this.reconnect();
            }
            return;
        }// end function

        private function reconnect() : void
        {
            if (this.socket && this.socket.connected)
            {
                this.socket.close();
            }
            this.socket = new Socket();
            if (this.availableServers.length)
            {
                this.pendingServer = chooseServer();
                Security.allowDomain(this.pendingServer.host);
                Security.loadPolicyFile("xmlsocket://" + this.pendingServer.host + ":" + this.pendingServer.port);
                this.socket.connect(this.pendingServer.host, this.pendingServer.port);
                trace("CHAT attempting to connect: " + this.pendingServer.host);
            }
            else if (this.failedServers.length)
            {
                this.dispatchEvent(new JSONChatEvent(JSONChatEvent.CONNECTION_ERROR, {type:"noServersAvailable", previouslyFailed:this.failedServers}));
            }
            return;
        }// end function

        public function partChannels(param1:Array) : void
        {
            var _loc_2:Boolean = false;
            var _loc_3:String = null;
            var _loc_4:int = 0;
            for each (_loc_3 in param1)
            {
                
                _loc_4 = currentChannels.indexOf(_loc_3);
                if (_loc_4 != -1)
                {
                    currentChannels.splice(_loc_4, 1);
                    delete channelParams[_loc_3];
                    _loc_2 = true;
                }
            }
            if (_loc_2)
            {
                updateChannelList();
            }
            return;
        }// end function

        public function get session() : String
        {
            return _session;
        }// end function

        private function sendData(param1:Object) : Boolean
        {
            var data:* = param1;
            if (!(data is String))
            {
                try
                {
                    data = JSON.encode(data);
                }
                catch (e:Error)
                {
                    trace("CHAT data to send is not string, but JSON encode failed");
                    return false;
                }
            }
            if (data.charAt((data.length - 1)) !== "\n")
            {
                data = data + "\n";
            }
            this.dataQueue.push(data);
            this.sendNextInQueue();
            return true;
        }// end function

        private function set socket(param1:Socket) : void
        {
            if (_socket)
            {
                _socket.removeEventListener(Event.CONNECT, onSocketConnect);
                _socket.removeEventListener(Event.CLOSE, onSocketClose);
                _socket.removeEventListener(IOErrorEvent.IO_ERROR, onSocketIOError);
                _socket.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, onSocketSecurityError);
                _socket.removeEventListener(ProgressEvent.SOCKET_DATA, onSocketData);
            }
            _socket = param1;
            if (_socket)
            {
                _socket.addEventListener(Event.CONNECT, onSocketConnect);
                _socket.addEventListener(Event.CLOSE, onSocketClose);
                _socket.addEventListener(IOErrorEvent.IO_ERROR, onSocketIOError);
                _socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onSocketSecurityError);
                _socket.addEventListener(ProgressEvent.SOCKET_DATA, onSocketData);
            }
            return;
        }// end function

        private function onSocketIOError(event:IOErrorEvent) : void
        {
            this.dispatchEvent(new JSONChatEvent(JSONChatEvent.OTHER_IO_ERROR, {server:this.currentServer}));
            return;
        }// end function

        private function get socket() : Socket
        {
            return _socket;
        }// end function

        public function get userID() : int
        {
            return _userID;
        }// end function

        public function publishToChannel(param1:String, param2:Object, param3:Object = null) : Boolean
        {
            var _loc_4:Boolean = false;
            if (currentChannels.indexOf(param1) === -1)
            {
                _loc_4 = true;
                joinChannels([{sub:param1, params:param3}], true);
            }
            var _loc_5:Object = {command:"pub", params:{type:"data", value:param2, subs:[param1]}};
            if (shouldAuthenticate && this.session)
            {
                _loc_5.params.session = this.session;
                _loc_5.params.userid = String(this.userID);
            }
            var _loc_6:* = sendData(_loc_5);
            if (_loc_4)
            {
                this.partChannels([param1]);
            }
            return _loc_6;
        }// end function

        private function onSocketData(event:ProgressEvent) : void
        {
            var msgs:Array;
            var msg:String;
            var i:int;
            var l:int;
            var data:Object;
            var event:* = event;
            var dataStr:* = this.socket.readUTFBytes(this.socket.bytesAvailable);
            msgs = dataStr.split("\n");
            if (msgs[0] == dataStr)
            {
                trace("CHAT: we got partial data from manatee: " + dataStr);
                readBuffer = readBuffer + dataStr;
                return;
            }
            i;
            l = msgs.length;
            while (i < l)
            {
                
                msg = msgs[i];
                if (i == 0 && readBuffer.length)
                {
                    msg = readBuffer + msg;
                    readBuffer = "";
                }
                if (msg.length)
                {
                    trace("CHAT: raw data: " + msg);
                    try
                    {
                        data = JSON.decode(msg);
                    }
                    catch (e:Error)
                    {
                        if (i == 0 && msgs[i] != msg)
                        {
                            try
                            {
                                msg = msgs[i];
                                data = JSON.decode(msg);
                            }
                            catch (e:Error)
                            {
                                trace("CHAT: readBuffer broke the data, discarding");
                                this.dispatchEvent(new JSONChatEvent(JSONChatEvent.DATA_PARSE_ERROR, {server:this.currentServer, rawData:msg}));
                                ;
                            }
                        }
                        else
                        {
                            if ((i + 1) == l && l > 1)
                            {
                                trace("CHAT: partial data flush: " + msg);
                                readBuffer = readBuffer + msg;
                                return;
                            }
                            this.dispatchEvent(new JSONChatEvent(JSONChatEvent.DATA_PARSE_ERROR, {server:this.currentServer, rawData:msg}));
                        }
                        else
                        {
                            if (data.type == "success" && data.hasOwnProperty("loggedin"))
                            {
                                if (data.loggedin)
                                {
                                    trace("CHAT: We are authenticated!!");
                                }
                            }
                            this.dispatchEvent(new JSONChatEvent(JSONChatEvent.DATA_RECEIVED, {server:this.currentServer, rawData:msg, data:data}));
                            this.responsePending = false;
                            this.sendNextInQueue();
                        }
                    }
                    i = (i + 1);
                }
                return;
        }// end function

        private function onSocketClose(event:Event) : void
        {
            this.dispatchEvent(new JSONChatEvent(JSONChatEvent.CONNECTION_DROP, {server:this.currentServer}));
            var _loc_2:* = new Date().valueOf();
            if (!this.currentServer.lastConnectionDrop || _loc_2 - this.currentServer.lastConnectionDrop > 60000)
            {
                this.currentServer.lastConnectionDrop = _loc_2;
            }
            else
            {
                failServer(this.currentServer);
            }
            this.currentServer = null;
            reconnect();
            return;
        }// end function

        private function updateChannelList(param1:Boolean = false) : void
        {
            var _loc_2:Array = null;
            var _loc_3:String = null;
            var _loc_4:Object = null;
            if (this.socket && this.socket.connected)
            {
                _loc_2 = [];
                for each (_loc_3 in this.currentChannels)
                {
                    
                    _loc_2.push({sub:_loc_3, params:this.channelParams[_loc_3]});
                }
                _loc_4 = {command:"sub", params:{uid:this.uuid, subs:_loc_2}};
                if ((param1 || shouldAuthenticate) && this.session)
                {
                    trace("CHAT: authenticating with manatee with " + this.session);
                    _loc_4.params.session = this.session;
                    _loc_4.params.userid = String(this.userID);
                }
                if (!this.sendData(_loc_4))
                {
                    this.dispatchEvent(new JSONChatEvent(JSONChatEvent.CHANNEL_JOIN_ERROR, {server:this.currentServer, channels:this.currentChannels}));
                }
            }
            else if (!this.pendingServer)
            {
                this.reconnect();
            }
            return;
        }// end function

    }
}
