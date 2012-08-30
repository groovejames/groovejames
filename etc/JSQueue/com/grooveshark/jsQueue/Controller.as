package com.grooveshark.jsQueue
{
    import com.adobe.crypto.*;
    import com.adobe.serialization.json.*;
    import com.grooveshark.framework.*;
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.framework.playback.commands.*;
    import com.grooveshark.jsQueue.commands.*;
    import com.grooveshark.socket.*;
    import flash.display.*;
    import flash.events.*;
    import flash.external.*;
    import flash.media.*;
    import flash.system.*;
    import flash.utils.*;
    import mx.collections.*;
    import mx.events.*;
    import mx.rpc.*;
    import mx.rpc.http.*;
    import mx.utils.*;
    import mx.validators.*;

    public class Controller extends Object
    {
        private const API:Class;
        private var _model:Model;
        private const INTERRUPT_SECRET:String = "balloonsRunFree";
        private var serviceController:String;
        private var propsDirty:Boolean;
        private const SETUP:Class;
        private var errorCallback:String;
        private var songsDirty:Array;
        private const PROXY_ALLOWED:Array;
        private var useFFT:Boolean = false;
        private var thirdPartyLoader:HTTPService;
        private var songPropertyChangeCallback:String;
        private var playerCreated:Boolean;
        private var zoomChangeCallback:String;
        private var lastWidth:int = 10;
        private var _activeSong:QueueSong;
        private var _chatClient:JSONChatClient;
        private var lastfmSecret:String = "f8ed9c4ea2f1b981e61e1d0df1a98406";
        private var setupString:String;
        private var _currentQueue:Queue;
        private var stage:Stage;
        private var needToken:Boolean;
        private var lastFMAudioScrobblerURL:String = "http://ws.audioscrobbler.com/2.0/";
        private var controllerKey:String;
        private var playStatusDirty:Boolean;
        private var queueDirty:Array;
        private var playerReady:Boolean;
        private var culmulativeSeconds:Number = 0;
        private var propertyChangeCallback:String;
        private var playbackStatusCallback:String;
        private var playerController:String;
        private var allowedHTTPMethods:Array;
        private var _service:Service;
        private var queueChangeCallback:String;
        private var computeSpectrumCallback:String;
        private var ready:Boolean;
        private var spectrum:ByteArray;
        private var serviceReady:Boolean;
        public static const RAPLEAF_ACCT_ID:String = "44241";
        public static const RAPLEAF_PERSONLIZE_URL_VISIT:String = "http://personalize.rlcdn.com/v4/wv";
        public static const RAPLEAF_API_KEY:String = "b1d31b086b1d9469ee82de9c7fa2b778";
        public static const RAPLEAF_PERSONLIZE_URL_DIRECT:String = "https://personalize.rlcdn.com/v4/dr";

        public function Controller(param1:Model, param2:Stage, param3:String, param4:String, param5:String)
        {
            API = Controller_API;
            SETUP = Controller_SETUP;
            songsDirty = [];
            queueDirty = [];
            controllerKey = String("breakfastBurritos");
            PROXY_ALLOWED = ["initiateSession", "getCommunicationToken", "userForgotPassword", "getUserByInviteID", "getGoogleAuthToken", "getGoogleContacts", "getDetailsForBroadcast", "broadcastSong", "getUserFacebookDataEx", "saveUserFacebookDataEx", "updateUserFacebookData", "getUserGoogleData", "getUserTwitterData", "authenticateUser", "authenticateFacebookUser", "authenticateGoogleUser", "authenticateTwitterUser", "authenticateLastfmUser", "reportUserChange", "changePassword", "resetPassword", "registerUser", "registerFacebookUser", "registerGoogleUser", "registerTwitterUser", "registerLastfmUser", "getLastfmService", "getThemeFromDFP", "getSubscriptionDetails", "userDisableAccount", "changeUserInfoEx", "isFirstVisit", "getClearvoiceMemberInfo", "saveClearvoiceMemberInfo", "addClearvoiceAnswers", "getUserIDByClearvoiceEmail", "saveUserAnswers", "finalizeUserSurvey", "getTunipopID", "getNotificationFromDFP", "getSubscriptionHistory", "suggestFlattr", "getVideoFromDFP", "saveUserFlattrData", "updateUserFlattrData", "getUserFlattrData", "userGetExtraData"];
            allowedHTTPMethods = ["GET", "POST", "HEAD", "OPTIONS", "PUT", "TRACE", "DELETE"];
            spectrum = new ByteArray();
            this.model = param1;
            this.playerController = param4;
            this.serviceController = param5;
            this.stage = param2;
            this.thirdPartyLoader = new HTTPService();
            this.thirdPartyLoader.resultFormat = "text";
            if (!ExternalInterface.available)
            {
                trace("ExternalInterface not available. Shouldn\'t have gotten this far.");
                return;
            }
            ExternalInterface.addCallback("getApplicationVersion", getApplicationVersion);
            ExternalInterface.addCallback("expireService", expireService);
            ExternalInterface.addCallback("getEverything", getEverything);
            ExternalInterface.addCallback("getVolume", getVolume);
            ExternalInterface.addCallback("setVolume", setVolume);
            ExternalInterface.addCallback("getIsMuted", getIsMuted);
            ExternalInterface.addCallback("setIsMuted", setIsMuted);
            ExternalInterface.addCallback("getCrossfadeAmount", getCrossfadeAmount);
            ExternalInterface.addCallback("setCrossfadeAmount", setCrossfadeAmount);
            ExternalInterface.addCallback("getCrossfadeEnabled", getCrossfadeEnabled);
            ExternalInterface.addCallback("setCrossfadeEnabled", setCrossfadeEnabled);
            ExternalInterface.addCallback("getPlayPauseFade", getPlayPauseFade);
            ExternalInterface.addCallback("setPlayPauseFade", setPlayPauseFade);
            ExternalInterface.addCallback("getPrefetchEnabled", getPrefetchEnabled);
            ExternalInterface.addCallback("setPrefetchEnabled", setPrefetchEnabled);
            ExternalInterface.addCallback("getLowerQuality", getLowerQuality);
            ExternalInterface.addCallback("setLowerQuality", setLowerQuality);
            ExternalInterface.addCallback("setPersistShuffle", setPersistShuffle);
            ExternalInterface.addCallback("setPropertyChangeCallback", setPropertyChangeCallback);
            ExternalInterface.addCallback("getSongDetails", getSongDetails);
            ExternalInterface.addCallback("setSongPropertyChangeCallback", setSongPropertyChangeCallback);
            ExternalInterface.addCallback("getCurrentQueue", getCurrentQueue);
            ExternalInterface.addCallback("getPreviousQueue", getPreviousQueue);
            ExternalInterface.addCallback("setQueueChangeCallback", setQueueChangeCallback);
            ExternalInterface.addCallback("getPlaybackStatus", getPlaybackStatus);
            ExternalInterface.addCallback("setPlaybackStatusCallback", setPlaybackStatusCallback);
            ExternalInterface.addCallback("setComputeSpectrumCallback", setComputeSpectrumCallback);
            ExternalInterface.addCallback("setErrorCallback", setErrorCallback);
            ExternalInterface.addCallback("addSongsToQueueAt", addSongsToQueueAt);
            ExternalInterface.addCallback("removeSongs", removeSongs);
            ExternalInterface.addCallback("moveSongsTo", moveSongsTo);
            ExternalInterface.addCallback("setActiveSong", setActiveSong);
            ExternalInterface.addCallback("clearQueue", clearQueue);
            ExternalInterface.addCallback("restoreQueue", restoreQueue);
            ExternalInterface.addCallback("getQueueIsRestorable", getQueueIsRestorable);
            ExternalInterface.addCallback("storeQueue", storeQueue);
            ExternalInterface.addCallback("setAutoplay", setAutoplay);
            ExternalInterface.addCallback("setShuffle", setShuffle);
            ExternalInterface.addCallback("getShuffle", getShuffle);
            ExternalInterface.addCallback("setRepeat", setRepeat);
            ExternalInterface.addCallback("playSong", playSong);
            ExternalInterface.addCallback("pauseSong", pauseSong);
            ExternalInterface.addCallback("resumeSong", resumeSong);
            ExternalInterface.addCallback("stopSong", stopSong);
            ExternalInterface.addCallback("nextSong", nextSong);
            ExternalInterface.addCallback("previousSong", previousSong);
            ExternalInterface.addCallback("seekTo", seekTo);
            ExternalInterface.addCallback("voteSong", voteSong);
            ExternalInterface.addCallback("flagSong", flagSong);
            ExternalInterface.addCallback("swfProxy", swfProxy);
            ExternalInterface.addCallback("setZoomChangeCallback", setZoomChangeCallback);
            ExternalInterface.addCallback("getCulmulativeListenTime", getCulmulativeListenTime);
            ExternalInterface.addCallback("setChatServers", setChatServers);
            ExternalInterface.addCallback("subscribeToPlaylistChannel", subscribeToPlaylistChannel);
            ExternalInterface.addCallback("unsubscribeFromPlaylistChannel", unsubscribeFromPlaylistChannel);
            ExternalInterface.addCallback("broadcastToChannel", broadcastToChannel);
            ExternalInterface.addCallback("prefetchStreamKeys", prefetchStreamKeys);
            ExternalInterface.addCallback("getNumVisitedDays", getNumVisitedDays);
            ExternalInterface.addCallback("getNumPlayedSongs", getNumPlayedSongs);
            ExternalInterface.addCallback("getRecentPlays", getRecentPlays);
            ExternalInterface.addCallback("updateInterruptionExpireTime", updateInterruptionExpireTime);
            ExternalInterface.addCallback("setFlattr", setFlattr);
            setupString = new this.SETUP();
            setupString = setupString.replace(/SWFNAME""SWFNAME/g, param3);
            setupString = setupString.replace(/PLAYER_CONTROLLER""PLAYER_CONTROLLER/g, param4);
            setupString = setupString.replace(/SERVICE_CONTROLLER""SERVICE_CONTROLLER/g, param5);
            param2.addEventListener(Event.ENTER_FRAME, handleCallbacks);
            return;
        }// end function

        public function restoreQueueFromLocal() : void
        {
            var _loc_1:RestoreQueue = null;
            trace("Checking for queue to restore: " + model.queueToRestore);
            if (model.queueToRestore)
            {
                _loc_1 = new RestoreQueue(model.service, model, model.queueToRestore);
                _loc_1.addEventListener(Event.COMPLETE, onQueueRestoreComplete);
                _loc_1.addEventListener("failed", onQueueRestoreFailed);
                _loc_1.execute();
            }
            return;
        }// end function

        public function moveSongsTo(param1:Array, param2:int) : void
        {
            var _loc_3:Array = null;
            var _loc_4:int = 0;
            var _loc_5:QueueSong = null;
            if (model.currentQueue)
            {
                _loc_3 = [];
                for each (_loc_4 in param1)
                {
                    
                    _loc_5 = model.currentQueue.queueSongLookupByQueueSongID[_loc_4];
                    if (_loc_5)
                    {
                        _loc_3.push(_loc_5);
                    }
                }
                model.currentQueue.moveItemsTo(_loc_3, param2);
            }
            return;
        }// end function

        public function getVolume() : Number
        {
            return model.volume;
        }// end function

        private function synchronizeHeaders(param1:Object) : void
        {
            if (param1.hasOwnProperty("session") && param1.session && param1.session !== model.service.session)
            {
                model.service.session = param1.session;
            }
            if (param1.hasOwnProperty("country") && param1.country)
            {
                model.service.country = param1.country;
            }
            if (param1.hasOwnProperty("uuid") && param1.uuid && param1.uuid !== model.service.uuid)
            {
                model.service.uuid = param1.uuid;
            }
            return;
        }// end function

        public function setVolume(param1:Number) : void
        {
            if (isNaN(param1) || param1 < 0)
            {
                param1 = 0;
            }
            if (param1 > 100)
            {
                param1 = 100;
            }
            model.isMuted = false;
            model.volume = param1;
            SoundMixer.soundTransform = new SoundTransform(param1 / 100);
            return;
        }// end function

        private function onChatData(event:JSONChatEvent) : void
        {
            if (event.data.data.type == "success")
            {
                return;
            }
            var _loc_2:* = cleanObjectForEI(event.data);
            trace(JSON.encode(_loc_2));
            makeSafeEICall(serviceController + ".onChatData", [_loc_2]);
            return;
        }// end function

        public function getIsMuted() : Boolean
        {
            return model.isMuted;
        }// end function

        private function set currentQueue(param1:Queue) : void
        {
            var _loc_2:QueueChangeEvent = null;
            if (param1 !== _currentQueue)
            {
                if (_currentQueue)
                {
                    _currentQueue.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onQueuePropChange);
                    _currentQueue.removeEventListener(CollectionEvent.COLLECTION_CHANGE, onQueueCollectionChange);
                    _currentQueue.removeEventListener(QueueEvent.AUTOPLAY_FAILED, onQueueAutoplayFailed);
                    _currentQueue.removeEventListener(QueueEvent.ERROR_ADDING_SONGS, onQueueAddError);
                    _currentQueue.removeEventListener(QueueEvent.PLAYBACK_ERROR, onQueuePlaybackError);
                    _currentQueue.removeEventListener(QueueEvent.AUTOPLAY_VOTE_ERROR, onAutoplayVoteError);
                    _currentQueue.removeEventListener(SongEvent.SONG_DIRTY, onSongDirty);
                    _currentQueue.removeEventListener(QueueEvent.SONG_COMPLETE, onSongComplete);
                }
                _currentQueue = param1;
                if (_currentQueue)
                {
                    _currentQueue.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onQueuePropChange, false, 0, true);
                    _currentQueue.addEventListener(CollectionEvent.COLLECTION_CHANGE, onQueueCollectionChange, false, 0, true);
                    _currentQueue.addEventListener(QueueEvent.AUTOPLAY_FAILED, onQueueAutoplayFailed, false, 0, true);
                    _currentQueue.addEventListener(QueueEvent.ERROR_ADDING_SONGS, onQueueAddError, false, 0, true);
                    _currentQueue.addEventListener(QueueEvent.PLAYBACK_ERROR, onQueuePlaybackError, false, 0, true);
                    _currentQueue.addEventListener(QueueEvent.AUTOPLAY_VOTE_ERROR, onAutoplayVoteError, false, 0, true);
                    _currentQueue.addEventListener(SongEvent.SONG_DIRTY, onSongDirty, false, 0, true);
                    _currentQueue.addEventListener(QueueEvent.SONG_COMPLETE, onSongComplete, false, 0, true);
                    activeSong = _currentQueue.activeSong;
                    _currentQueue.enableCrossfade(model.crossfadeEnabled, model.crossfadeAmount, model.playPauseFadeEnabled);
                    if (model.persistShuffle)
                    {
                        _currentQueue.shuffleEnabled = model.shuffleEnabled;
                    }
                    else
                    {
                        model.shuffleEnabled = _currentQueue.shuffleEnabled;
                    }
                }
                else
                {
                    activeSong = null;
                }
                _loc_2 = new QueueChangeEvent(QueueChangeEvent.QUEUE_RESET);
                queueDirty.push(_loc_2);
                propsDirty = true;
            }
            return;
        }// end function

        public function pauseSong() : void
        {
            if (model.currentQueue)
            {
                model.currentQueue.pause();
            }
            return;
        }// end function

        public function getSongDetails(param1:String, param2:Array) : Array
        {
            var _loc_5:int = 0;
            var _loc_6:QueueSong = null;
            var _loc_3:Array = [];
            var _loc_4:* = !param1 || model.currentQueue.queueID == param1 ? (model.currentQueue) : (model.previousQueue && model.previousQueue.queueID ? (model.previousQueue) : (null));
            if (!param1 || model.currentQueue.queueID == param1 ? (model.currentQueue) : (model.previousQueue && model.previousQueue.queueID ? (model.previousQueue) : (null)))
            {
                for each (_loc_5 in param2)
                {
                    
                    _loc_6 = _loc_4.queueSongLookupByQueueSongID[_loc_5];
                    if (_loc_6)
                    {
                        _loc_3.push(buildSong(_loc_6));
                    }
                }
            }
            return _loc_3;
        }// end function

        public function getNumVisitedDays() : uint
        {
            return model.numVisitedDays;
        }// end function

        private function reportPropertyChange() : Boolean
        {
            if (ready && propertyChangeCallback)
            {
                return makeSafeEICall(propertyChangeCallback, [buildProperties()]);
            }
            return false;
        }// end function

        private function onFlattrResult(param1:Object, param2:Object = null) : void
        {
            reportRequestSuccess(param1, param2.key);
            return;
        }// end function

        public function setShuffle(param1:Boolean) : void
        {
            model.shuffleEnabled = param1;
            if (model.currentQueue)
            {
                model.currentQueue.shuffleEnabled = param1;
            }
            return;
        }// end function

        public function setLowerQuality(param1:Boolean) : void
        {
            PlayableSong.useMobile = param1;
            return;
        }// end function

        private function reportPlaybackStatus() : Boolean
        {
            if (ready && playbackStatusCallback)
            {
                return makeSafeEICall(playbackStatusCallback, [buildPlaybackStatus()]);
            }
            return false;
        }// end function

        public function broadcastToChannel(param1:String, param2:Object, param3:Object = null) : Boolean
        {
            return model.chatClient.publishToChannel(param1, param2, param3);
        }// end function

        private function buildProperties() : Object
        {
            var _loc_1:Object = {volume:model.volume, isMuted:model.isMuted, crossfadeAmount:model.currentQueue ? (model.currentQueue.crossfadeAmount) : (0), crossfadeEnabled:model.currentQueue ? (model.currentQueue.crossfadeEnabled) : (false), playPauseFade:model.currentQueue ? (model.currentQueue.crossfadeInOutEnabled) : (false)};
            return _loc_1;
        }// end function

        private function onFacebookResult(param1:Object, param2:Object = null) : void
        {
            reportRequestSuccess(param1, param2.key);
            return;
        }// end function

        public function setPropertyChangeCallback(param1:String) : Object
        {
            this.propertyChangeCallback = param1;
            return buildProperties();
        }// end function

        private function tunipopFault(param1:Object, param2:Object = null) : void
        {
            reportRequestFailure({message:"HTTP_ERROR", details:param1, code:param1.statusCode}, param2.key);
            return;
        }// end function

        private function reportRequestFailure(param1:Object, param2:String) : void
        {
            makeSafeEICall(serviceController + ".swfFault", [param1, param2]);
            return;
        }// end function

        public function set model(param1:Model) : void
        {
            if (param1 !== _model)
            {
                if (_model)
                {
                    _model.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onModelChange);
                }
                _model = param1;
                if (_model)
                {
                    _model.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onModelChange);
                    service = _model.service;
                    currentQueue = _model.currentQueue;
                    chatClient = _model.chatClient;
                }
            }
            return;
        }// end function

        public function getQueueIsRestorable() : Boolean
        {
            return (!model.currentQueue || model.currentQueue.length == 0) && model.previousQueue && model.previousQueue.length > 0;
        }// end function

        public function stopSong() : void
        {
            if (model.currentQueue)
            {
                model.currentQueue.stop();
            }
            return;
        }// end function

        private function suggestFlattr(param1:Object, param2:Object, param3:String) : void
        {
            var _loc_4:* = new SuggestFlattr(param1.parameters, param3);
            new SuggestFlattr(param1.parameters, param3).addEventListener(Event.COMPLETE, onSuggestFlattrResult);
            _loc_4.execute();
            return;
        }// end function

        private function reportQueueChange() : Array
        {
            var _loc_1:Array = null;
            var _loc_2:Boolean = false;
            var _loc_3:Object = null;
            if (ready && queueChangeCallback)
            {
                _loc_1 = cleanQueueChangeEvents();
                _loc_2 = false;
                while (_loc_1.length)
                {
                    
                    _loc_3 = _loc_1.shift();
                    _loc_2 = !makeSafeEICall(queueChangeCallback, [_loc_3]);
                }
            }
            return _loc_2 ? ([new QueueChangeEvent(QueueChangeEvent.QUEUE_RESET)]) : ([]);
        }// end function

        private function rapleafFault(param1:Object, param2:Object = null) : void
        {
            reportRequestFailure({message:"HTTP_ERROR", details:param1, code:param1.statusCode}, param2.key);
            return;
        }// end function

        public function playSong(param1:int = 0) : void
        {
            var _loc_2:QueueSong = null;
            if (model.currentQueue)
            {
                _loc_2 = null;
                if (param1)
                {
                    _loc_2 = model.currentQueue.queueSongLookupByQueueSongID[param1];
                }
                model.currentQueue.playSong(_loc_2);
            }
            return;
        }// end function

        public function getCrossfadeEnabled() : Boolean
        {
            return model.crossfadeEnabled;
        }// end function

        public function setPlaybackStatusCallback(param1:String) : Object
        {
            this.playbackStatusCallback = param1;
            return buildPlaybackStatus();
        }// end function

        private function onChatError(event:JSONChatEvent) : void
        {
            trace(JSON.encode(event));
            makeSafeEICall(serviceController + ".onChatError", [cleanObjectForEI(event)]);
            return;
        }// end function

        private function set activeSong(param1:QueueSong) : void
        {
            if (param1 !== _activeSong)
            {
                if (_activeSong)
                {
                    _activeSong.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onSongPropChange);
                    _activeSong.removeEventListener(PlayableSongEvent.FLATTR_DATA, onFlattrData);
                    this.culmulativeSeconds = this.culmulativeSeconds + _activeSong.secondsListened;
                }
                _activeSong = param1;
                if (_activeSong)
                {
                    _activeSong.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onSongPropChange, false, 0, true);
                    _activeSong.addEventListener(PlayableSongEvent.FLATTR_DATA, onFlattrData, false, 0, true);
                }
                playStatusDirty = true;
            }
            return;
        }// end function

        private function onQueueAddError(event:QueueEvent) : void
        {
            var _loc_2:Object = {type:event.type, details:event.extra};
            _loc_2.details.reason = event.detail;
            this.reportError(_loc_2);
            return;
        }// end function

        public function getNumPlayedSongs() : uint
        {
            return model.numPlayedSongs;
        }// end function

        private function onQueueCollectionChange(event:CollectionEvent) : void
        {
            var _loc_2:QueueChangeEvent = null;
            var _loc_3:Object = {};
            switch(event.kind)
            {
                case CollectionEventKind.REFRESH:
                case CollectionEventKind.RESET:
                {
                    _loc_2 = new QueueChangeEvent(QueueChangeEvent.QUEUE_RESET);
                    break;
                }
                case CollectionEventKind.ADD:
                {
                    _loc_3.index = event.location;
                    _loc_3.items = event.items;
                    _loc_3.kind = "add";
                    _loc_2 = new QueueChangeEvent(QueueChangeEvent.CONTENT_CHANGE, _loc_3);
                    break;
                }
                case CollectionEventKind.REMOVE:
                {
                    _loc_3.index = event.location;
                    _loc_3.items = event.items;
                    _loc_3.kind = "remove";
                    _loc_2 = new QueueChangeEvent(QueueChangeEvent.CONTENT_CHANGE, _loc_3);
                    break;
                }
                case CollectionEventKind.MOVE:
                {
                    _loc_3.index = event.location;
                    _loc_3.oldIndex = event.oldLocation;
                    _loc_3.items = event.items;
                    _loc_3.kind = "move";
                    _loc_2 = new QueueChangeEvent(QueueChangeEvent.CONTENT_CHANGE, _loc_3);
                    break;
                }
                case CollectionEventKind.REPLACE:
                {
                    _loc_3.index = event.location;
                    _loc_3.items = event.items;
                    _loc_3.kind = "replace";
                    _loc_2 = new QueueChangeEvent(QueueChangeEvent.CONTENT_CHANGE, _loc_3);
                    break;
                }
                default:
                {
                    break;
                }
            }
            if (_loc_2)
            {
                queueDirty.push(_loc_2);
            }
            return;
        }// end function

        private function set chatClient(param1:JSONChatClient) : void
        {
            if (param1 !== _chatClient)
            {
                if (_chatClient)
                {
                    _chatClient.removeEventListener(JSONChatEvent.DATA_RECEIVED, onChatData);
                    _chatClient.removeEventListener(JSONChatEvent.DATA_PARSE_ERROR, onChatError);
                    _chatClient.removeEventListener(JSONChatEvent.CONNECTION_ERROR, onChatError);
                    _chatClient.removeEventListener(JSONChatEvent.CONNECTION_DROP, onChatError);
                    _chatClient.removeEventListener(JSONChatEvent.CHANNEL_JOIN_ERROR, onChatError);
                    _chatClient.removeEventListener(JSONChatEvent.OTHER_IO_ERROR, onChatError);
                }
                _chatClient = param1;
                if (_chatClient)
                {
                    _chatClient.addEventListener(JSONChatEvent.DATA_RECEIVED, onChatData, false, 0, true);
                    _chatClient.addEventListener(JSONChatEvent.DATA_PARSE_ERROR, onChatError, false, 0, true);
                    _chatClient.addEventListener(JSONChatEvent.CONNECTION_ERROR, onChatError, false, 0, true);
                    _chatClient.addEventListener(JSONChatEvent.CONNECTION_DROP, onChatError, false, 0, true);
                    _chatClient.addEventListener(JSONChatEvent.CHANNEL_JOIN_ERROR, onChatError, false, 0, true);
                    _chatClient.addEventListener(JSONChatEvent.OTHER_IO_ERROR, onChatError, false, 0, true);
                }
            }
            return;
        }// end function

        public function setPrefetchEnabled(param1:Boolean) : void
        {
            Queue.prefetchEnabled = param1;
            return;
        }// end function

        private function getThemeFromDFP(param1:Object, param2:Object, param3:String) : void
        {
            var _loc_4:* = param1.parameters && param1.parameters.paramString ? (param1.parameters.paramString) : ("");
            thirdPartyLoader.method = "GET";
            thirdPartyLoader.requestTimeout = 0;
            thirdPartyLoader.url = "http://ad.doubleclick.net/pfadx/grooveshark.wall/" + _loc_4;
            var _loc_5:* = thirdPartyLoader.send();
            thirdPartyLoader.send().addResponder(new ItemResponder(dfpResult, dfpFault, {request:param1, key:param3}));
            return;
        }// end function

        private function onQueueAutoplayFailed(event:QueueEvent) : void
        {
            var _loc_2:Object = {type:event.type, details:{reason:event.detail}};
            this.reportError(_loc_2);
            return;
        }// end function

        public function expireService() : void
        {
            model.service.expire();
            return;
        }// end function

        public function getCulmulativeListenTime() : Object
        {
            return {seconds:this.culmulativeSeconds, firstVisit:model.firstVisit};
        }// end function

        private function dfpFault(param1:Object, param2:Object = null) : void
        {
            reportRequestFailure({message:"HTTP_ERROR", details:param1, code:param1.statusCode}, param2.key);
            return;
        }// end function

        public function setRepeat(param1:int) : void
        {
            if (model.currentQueue)
            {
                model.currentQueue.repeatMode = param1;
            }
            return;
        }// end function

        private function onSongDirty(event:SongEvent) : void
        {
            if (songsDirty.indexOf(event.song) == -1)
            {
                songsDirty.push(event.song);
            }
            return;
        }// end function

        public function flagSong(param1:int, param2:int) : void
        {
            var _loc_3:QueueSong = null;
            if (model.currentQueue)
            {
                _loc_3 = model.currentQueue.queueSongLookupByQueueSongID[param1];
                if (_loc_3)
                {
                    _loc_3.flag(param2);
                }
            }
            return;
        }// end function

        private function buildSong(param1:QueueSong) : Object
        {
            var _loc_2:Object = {parentQueueID:param1.parent.queueID, queueSongID:param1.queueSongID, autoplayVote:param1.rawAutoplayVote, source:param1.source, context:param1.context, sponsoredAutoplayID:param1.sponsoredAutoplayID, SongID:param1.song.songID, SongName:cleanStringForEI(param1.song.songName), ArtistID:param1.song.artistID, ArtistName:cleanStringForEI(param1.song.artistName), AlbumID:param1.song.albumID, AlbumName:cleanStringForEI(param1.song.albumName), CoverArtFilename:param1.song.artFilename.indexOf("default") == -1 ? (param1.song.artFilename) : (""), EstimateDuration:param1.song.estimateDuration, Flags:param1.song.flags};
            return _loc_2;
        }// end function

        public function nextSong() : void
        {
            if (model.currentQueue)
            {
                model.currentQueue.playNextSong();
            }
            return;
        }// end function

        public function getEverything() : Object
        {
            return buildEverything();
        }// end function

        private function handleLastfmRequest(param1:Object, param2:String) : void
        {
            var _loc_4:String = null;
            var _loc_5:String = null;
            var _loc_6:int = 0;
            var _loc_7:AsyncToken = null;
            thirdPartyLoader.method = "POST";
            thirdPartyLoader.requestTimeout = 0;
            thirdPartyLoader.url = lastFMAudioScrobblerURL;
            thirdPartyLoader.headers = {};
            var _loc_3:Array = [];
            for (_loc_4 in param1.parameters)
            {
                
                _loc_3.push(_loc_4);
            }
            _loc_3.sort();
            _loc_5 = "";
            _loc_6 = 0;
            while (_loc_6 < _loc_3.length)
            {
                
                if (_loc_3[_loc_6] && param1.parameters.hasOwnProperty(_loc_3[_loc_6]))
                {
                    _loc_5 = _loc_5 + (_loc_3[_loc_6] + param1.parameters[_loc_3[_loc_6]]);
                }
                _loc_6++;
            }
            trace("LASTFM, method: " + thirdPartyLoader.method + ", url: " + thirdPartyLoader.url + ", sig: " + _loc_5);
            _loc_5 = _loc_5 + lastfmSecret;
            param1.parameters["api_sig"] = MD5.hash(_loc_5);
            param1.parameters["format"] = "json";
            for (_loc_4 in param1.parameters)
            {
                
                trace(_loc_4 + ":" + param1.parameters[_loc_4]);
            }
            _loc_7 = thirdPartyLoader.send(param1.parameters);
            _loc_7.addResponder(new ItemResponder(onLastfmResult, onLastfmFault, {request:param1, key:param2}));
            return;
        }// end function

        public function getPreviousQueue() : Object
        {
            return buildQueue(model.previousQueue);
        }// end function

        public function subscribeToPlaylistChannel(param1:Number, param2:Object = null) : Boolean
        {
            if (!isNaN(param1))
            {
                if (param2 != null)
                {
                    model.chatClient.joinChannels([{sub:"playlist" + param1, params:param2}], true);
                }
                else
                {
                    model.chatClient.joinChannels(["playlist" + param1]);
                }
                return true;
            }
            else
            {
                return false;
            }
        }// end function

        private function reportSongPropertyChange(param1:QueueSong) : Boolean
        {
            if (ready && songPropertyChangeCallback)
            {
                return makeSafeEICall(songPropertyChangeCallback, [buildSong(param1)]);
            }
            return false;
        }// end function

        public function storeQueue(param1:Boolean = false) : void
        {
            if (model.currentQueue && model.currentQueue.length > 1)
            {
                trace("STORE QUEUE " + param1 + ", " + model.currentQueue.length);
                model.lastQueue = model.currentQueue.createStoredQueue();
            }
            return;
        }// end function

        public function previousSong(param1:Boolean = false) : void
        {
            if (model.currentQueue)
            {
                model.currentQueue.playPreviousSong(param1);
            }
            return;
        }// end function

        private function get service() : Service
        {
            return _service;
        }// end function

        public function setFlattr(param1:Boolean) : void
        {
            MarkSongOver30Seconds.flattr = param1;
            return;
        }// end function

        private function swfFault(param1:Object, param2:Object = null) : void
        {
            param1.rawResult = cleanStringForEI(param1.rawResult);
            reportRequestFailure(param1, param2.key);
            return;
        }// end function

        public function getShuffle() : Boolean
        {
            return model.shuffleEnabled;
        }// end function

        public function setZoomChangeCallback(param1:String) : int
        {
            this.zoomChangeCallback = param1;
            this.lastWidth = stage.stageWidth;
            return stage.stageWidth - 10;
        }// end function

        public function setComputeSpectrumCallback(param1:String, param2:Boolean = false) : void
        {
            if (param1)
            {
                PlayableSong.checkPolicyFile = true;
                if (activeSong && activeSong.currentStreamServer)
                {
                    Security.loadPolicyFile(activeSong.currentStreamServer + "/crossdomain.xml");
                }
            }
            else
            {
                PlayableSong.checkPolicyFile = false;
            }
            this.computeSpectrumCallback = param1;
            this.useFFT = param2;
            return;
        }// end function

        public function addSongsToQueueAt(param1:Array, param2:int = -1, param3:Boolean = false, param4:Object = null, param5:Boolean = false) : void
        {
            var _loc_7:Object = null;
            var _loc_8:int = 0;
            var _loc_9:BaseSong = null;
            if (!model.currentQueue)
            {
                model.currentQueue = new QueueJS(model.service, model.songCache);
            }
            if (!param1 || !param1.length)
            {
                trace("addSongsToQueueAt called with no songs!");
                return;
            }
            if (param4)
            {
                param4 = cleanObjectForEI(param4);
            }
            var _loc_6:Array = [];
            for each (_loc_7 in param1)
            {
                
                if (_loc_7)
                {
                    _loc_8 = int(_loc_7.SongID);
                    if (_loc_8)
                    {
                        _loc_6.push(_loc_8);
                        _loc_9 = model.songCache[_loc_8];
                        if (!_loc_9)
                        {
                            _loc_9 = new BaseSong();
                            _loc_9.songID = _loc_8;
                            _loc_9.songName = String(_loc_7.SongName);
                            _loc_9.artistID = int(_loc_7.ArtistID);
                            _loc_9.artistName = String(_loc_7.ArtistName);
                            _loc_9.albumID = int(_loc_7.AlbumID);
                            _loc_9.albumName = String(_loc_7.AlbumName);
                            _loc_9.flags = int(_loc_7.Flags);
                            if (_loc_7.CoverArtFilename)
                            {
                                _loc_9.artFilename = String(_loc_7.CoverArtFilename);
                            }
                            if (int(_loc_7.EstimateDuration))
                            {
                                _loc_9.estimateDuration = int(_loc_7.EstimateDuration) * 1000;
                            }
                            model.songCache[_loc_9.songID] = _loc_9;
                        }
                    }
                }
            }
            model.currentQueue.addItemsAt(_loc_6, param2, param3, param5, param4);
            return;
        }// end function

        private function reportRequestSuccess(param1:Object, param2:String) : void
        {
            makeSafeEICall(serviceController + ".swfSuccess", [param1, param2]);
            return;
        }// end function

        public function setSongPropertyChangeCallback(param1:String) : void
        {
            this.songPropertyChangeCallback = param1;
            return;
        }// end function

        public function clearQueue() : void
        {
            model.previousQueue = model.currentQueue;
            model.currentQueue = new QueueJS(model.service, model.songCache);
            model.lastQueue = null;
            return;
        }// end function

        private function attemptReady() : void
        {
            var playerExists:Object;
            var apiDef:String;
            var serviceExists:Object;
            trace("attemptReady, playerCreated: " + playerCreated + ", playerReady: " + playerReady + ", serviceReady: " + serviceReady);
            if (!playerCreated)
            {
                try
                {
                    playerExists = ExternalInterface.call(playerController + ".playerExists");
                }
                catch (e:Error)
                {
                    trace(e);
                    playerExists;
                }
                trace("PLAYER EXIST ? " + playerExists);
                if (playerExists)
                {
                    try
                    {
                        playerCreated = true;
                        apiDef = new this.API();
                        ExternalInterface.call("function() { " + apiDef + "\n" + setupString + "}");
                    }
                    catch (e:Error)
                    {
                        trace(e);
                        playerCreated = false;
                    }
                    trace("PLAYER CREATED: " + playerCreated);
                }
            }
            if (playerCreated && !playerReady)
            {
                try
                {
                    trace("CALLING PLAYER READY");
                    playerReady = ExternalInterface.call(playerController + ".playerReady", buildEverything());
                }
                catch (e:Error)
                {
                    trace(e);
                    playerReady = false;
                }
                trace("PLAYER READY: " + playerReady);
            }
            if (playerReady && !serviceReady)
            {
                try
                {
                    serviceExists = ExternalInterface.call(serviceController + ".serviceExists");
                }
                catch (e:Error)
                {
                    trace(e);
                    serviceExists;
                }
                trace("SERVICE EXIST ? " + serviceExists);
                if (serviceExists)
                {
                    try
                    {
                        trace("CALLING SERVICE READY");
                        serviceReady = ExternalInterface.call(serviceController + ".swfReady", "thingy");
                    }
                    catch (e:Error)
                    {
                        trace(e);
                        serviceReady = false;
                    }
                    trace("SERVICE READY: " + serviceReady);
                }
            }
            if (playerCreated && playerReady && serviceReady)
            {
                this.ready = true;
                if (needToken)
                {
                    fetchToken();
                }
                this.restoreQueueFromLocal();
            }
            return;
        }// end function

        public function resumeSong() : void
        {
            if (model.currentQueue)
            {
                model.currentQueue.resume();
            }
            return;
        }// end function

        public function getPlaybackStatus() : Object
        {
            return buildPlaybackStatus();
        }// end function

        private function onLastfmFault(param1:Object, param2:Object = null) : void
        {
            reportRequestFailure({message:"HTTP_ERROR", details:param1, code:param1.statusCode}, param2.key);
            return;
        }// end function

        public function prefetchStreamKeys(param1:Array) : void
        {
            Queue.cacheStreamKeys(param1, model.service);
            return;
        }// end function

        private function onSongComplete(event:QueueEvent) : void
        {
            model.recordPlay(event.extra.song as PlayableSong);
            return;
        }// end function

        public function getRecentPlays() : Array
        {
            return model.recentPlays;
        }// end function

        private function onModelChange(event:PropertyChangeEvent) : void
        {
            switch(event.property)
            {
                case "service":
                {
                    service = event.newValue as Service;
                    break;
                }
                case "chatClient":
                {
                    chatClient = event.newValue as JSONChatClient;
                    break;
                }
                case "currentQueue":
                {
                    currentQueue = event.newValue as Queue;
                    break;
                }
                case "volume":
                case "isMuted":
                {
                    propsDirty = true;
                    break;
                }
                default:
                {
                    break;
                }
            }
            return;
        }// end function

        private function onAutoplayVoteError(event:QueueEvent) : void
        {
            var _loc_2:Object = {type:event.type, details:{}};
            _loc_2.details.song = buildSong(event.extra.song as QueueSong);
            this.reportError(_loc_2);
            return;
        }// end function

        private function parseGoogXML(param1:String) : Array
        {
            var contact:Object;
            var item:XML;
            var isValid:Boolean;
            var e:Array;
            var vr:ValidationResult;
            var rawXML:* = param1;
            var validator:* = new EmailValidator();
            var xml:* = new XML(rawXML);
            var gd:* = new Namespace("gd", "http://schemas.google.com/g/2005");
            var items:* = xml.channel.item;
            var contacts:Array;
            var _loc_3:int = 0;
            var _loc_4:* = items;
            while (_loc_4 in _loc_3)
            {
                
                item = _loc_4[_loc_3];
                contact = new Object();
                contact.title = String(XMLList(item).title.text());
                var _loc_6:int = 0;
                var _loc_7:* = gd::email;
                var _loc_5:* = new XMLList("");
                for each (_loc_8 in _loc_7)
                {
                    
                    var _loc_9:* = _loc_7[_loc_6];
                    with (_loc_7[_loc_6])
                    {
                        if (attribute("primary") == "true")
                        {
                            _loc_5[_loc_6] = _loc_8;
                        }
                    }
                }
                contact.address = String(_loc_5.@address);
                if (contact.address)
                {
                    isValid;
                    e = EmailValidator.validateEmail(validator, contact.address, "");
                    if (e.length)
                    {
                        var _loc_5:int = 0;
                        var _loc_6:* = e;
                        while (_loc_6 in _loc_5)
                        {
                            
                            vr = _loc_6[_loc_5];
                            if (vr.isError)
                            {
                                isValid;
                                break;
                            }
                        }
                    }
                    if (isValid)
                    {
                        contacts.push(contact);
                    }
                }
            }
            return contacts;
        }// end function

        private function onQueuePropChange(event:PropertyChangeEvent) : void
        {
            var _loc_2:QueueChangeEvent = null;
            switch(event.property)
            {
                case "activeSong":
                {
                    activeSong = event.newValue as QueueSong;
                }
                case "queueID":
                case "nextSong":
                case "previousSong":
                case "autoplayEnabled":
                case "autoplayEnabled":
                case "shuffleEnabled":
                case "repeatMode":
                case "currentAutoplayTag":
                {
                    _loc_2 = new QueueChangeEvent(QueueChangeEvent.PROPERTY_CHANGE, event.property);
                    queueDirty.push(_loc_2);
                    break;
                }
                case "crossfadeAmount":
                case "crossfadeEnabled":
                case "crossfadeInOutEnabled":
                {
                    propsDirty = true;
                    break;
                }
                default:
                {
                    break;
                }
            }
            return;
        }// end function

        public function getPlayPauseFade() : Boolean
        {
            return model.playPauseFadeEnabled;
        }// end function

        public function swfProxy(param1:Object, param2:Object, param3:String) : void
        {
            var _loc_4:Object = null;
            var _loc_5:Function = null;
            if (!param1)
            {
                reportRequestFailure({code:0, message:"Null request object"}, param3);
                return;
            }
            trace("swfProxy: " + param1.type + ": " + param1.method);
            switch(param1.type)
            {
                case "normal":
                {
                }
                default:
                {
                    this.synchronizeHeaders(param2);
                    _loc_4 = {client:"htmlshark"};
                    if (param2.clientRevision)
                    {
                        _loc_4.clientRevision = param2.clientRevision;
                    }
                    switch(param1.method)
                    {
                        case "getStoredUsers":
                        case "deleteStoredUser":
                        case "loginStoredUser":
                        case "reportUserChange":
                        case "getThemeFromDFP":
                        case "getNotificationFromDFP":
                        case "getVideoFromDFP":
                        case "isFirstVisit":
                        case "getTunipopID":
                        case "suggestFlattr":
                        {
                        }
                        default:
                        {
                            break;
                        }
                    }
                    break;
                }
                case "facebook":
                {
                    this.handleLastfmRequest(param1, param3);
                    break;
                }
                case "flattr":
                {
                    this.handleFacebookRequest(param1, param3);
                    break;
                }
                case "rapleaf":
                {
                    this.handleFlattrRequest(param1, param3);
                    break;
                }
                case :
                {
                    _loc_5 = this["rapleaf_" + param1.method] as Function;
                    if (_loc_5 !== null)
                    {
                        this._loc_5(param1, param3);
                    }
                    else
                    {
                        reportRequestFailure({message:"Invalid rapleaf method.", code:0}, param3);
                    }
                    break;
                    break;
                }
            }
            return;
        }// end function

        public function getPrefetchEnabled() : Boolean
        {
            return Queue.prefetchEnabled;
        }// end function

        private function onQueueRestoreComplete(event:Event) : void
        {
            trace("calling queueIsRestorable");
            makeSafeEICall(playerController + ".queueIsRestorable");
            return;
        }// end function

        private function get currentQueue() : Queue
        {
            return _currentQueue;
        }// end function

        private function onQueueRestoreFailed(event:Event) : void
        {
            trace("restore queue failed");
            var _loc_2:* = event.currentTarget as RestoreQueue;
            if (_loc_2 && _loc_2.error)
            {
                this.reportError(_loc_2.error);
            }
            return;
        }// end function

        public function voteSong(param1:int, param2:int) : void
        {
            var _loc_3:QueueSong = null;
            if (model.currentQueue)
            {
                _loc_3 = model.currentQueue.queueSongLookupByQueueSongID[param1];
                if (_loc_3)
                {
                    _loc_3.setAutoplayVote(param2);
                }
            }
            return;
        }// end function

        private function swfSuccess(param1:Object, param2:Object = null) : void
        {
            var _loc_4:Object = null;
            var _loc_5:String = null;
            var _loc_3:* = param2.request;
            _loc_4 = param1.result;
            switch(_loc_3.method)
            {
                case "getCommunicationToken":
                {
                    _loc_5 = String(_loc_4);
                    model.service.resetToken(_loc_5);
                    break;
                }
                case "getGoogleContacts":
                {
                    if (int(_loc_4.result.statusCode) == 1)
                    {
                        param1.result.result.parsedResult = parseGoogXML(_loc_4.result.rawResponse as String);
                    }
                    break;
                }
                default:
                {
                    break;
                }
            }
            param1.rawResult = cleanStringForEI(param1.rawResult);
            reportRequestSuccess(param1, param2.key);
            return;
        }// end function

        public function seekTo(param1:int) : void
        {
            if (model.currentQueue)
            {
                model.currentQueue.seekInCurrentSong(param1);
            }
            return;
        }// end function

        private function cleanObjectForEI(param1:Object) : Object
        {
            var _loc_3:String = null;
            if (!param1 || param1 is Number || param1 is Boolean || param1 is int || param1 is uint)
            {
                return param1;
            }
            var _loc_2:Object = {};
            for (_loc_3 in param1)
            {
                
                if (param1[_loc_3] is String)
                {
                    _loc_2[_loc_3] = cleanStringForEI(param1[_loc_3] as String);
                    continue;
                }
                if (param1[_loc_3] is Array)
                {
                    _loc_2[_loc_3] = cleanArrayForEI(param1[_loc_3] as Array);
                    continue;
                }
                if (param1[_loc_3] is Object)
                {
                    _loc_2[_loc_3] = cleanObjectForEI(param1[_loc_3]);
                    continue;
                }
                _loc_2[_loc_3] = param1[_loc_3];
            }
            return _loc_2;
        }// end function

        private function reportZoom() : void
        {
            var _loc_1:int = 0;
            if (ready && zoomChangeCallback && lastWidth !== stage.stageWidth)
            {
                _loc_1 = stage.stageWidth - 10;
                if (makeSafeEICall(zoomChangeCallback, [_loc_1]))
                {
                    lastWidth = stage.stageWidth;
                }
            }
            return;
        }// end function

        public function get model() : Model
        {
            return _model;
        }// end function

        public function restoreQueue() : Boolean
        {
            if ((!model.currentQueue || model.currentQueue.length == 0) && model.previousQueue)
            {
                model.currentQueue = model.previousQueue;
                if (model.currentQueue.autoplayEnabled)
                {
                    model.currentQueue.setAutoplayEnabled(true, model.currentQueue.autoplayUserInitiated, false);
                }
                return true;
            }
            return false;
        }// end function

        public function setErrorCallback(param1:String) : void
        {
            this.errorCallback = param1;
            return;
        }// end function

        public function rapleaf_direct(param1:Object, param2:String) : void
        {
            var _loc_4:AsyncToken = null;
            var _loc_3:* = param1.parameters && param1.parameters.email ? (param1.parameters.email) : ("");
            if (_loc_3)
            {
                _loc_3 = MD5.hash(_loc_3.toLowerCase().replace(/\s""\s/g, ""));
                thirdPartyLoader.method = "GET";
                thirdPartyLoader.requestTimeout = 0;
                thirdPartyLoader.url = RAPLEAF_PERSONLIZE_URL_DIRECT + "?api_key=" + RAPLEAF_API_KEY + "&md5_email=" + _loc_3;
                _loc_4 = thirdPartyLoader.send();
                _loc_4.addResponder(new ItemResponder(rapleafResult, rapleafFault, {request:param1, key:param2}));
            }
            else
            {
                reportRequestFailure({message:"Missing required parameter: email"}, param2);
            }
            return;
        }// end function

        public function getLowerQuality() : Boolean
        {
            return PlayableSong.useMobile;
        }// end function

        public function unsubscribeFromPlaylistChannel(param1:Number) : Boolean
        {
            if (!isNaN(param1))
            {
                model.chatClient.partChannels(["playlist" + param1]);
                return true;
            }
            return false;
        }// end function

        private function get activeSong() : QueueSong
        {
            return _activeSong;
        }// end function

        public function setActiveSong(param1:int) : Boolean
        {
            var _loc_2:QueueSong = null;
            if (model.currentQueue)
            {
                _loc_2 = model.currentQueue.queueSongLookupByQueueSongID[param1];
                if (_loc_2)
                {
                    return model.currentQueue.setActiveSong(_loc_2);
                }
            }
            return false;
        }// end function

        private function onFlattrData(event:PlayableSongEvent) : void
        {
            var _loc_2:* = cleanObjectForEI(event.data);
            _loc_2.messageType = "flattrData";
            makeSafeEICall(serviceController + ".onChatData", [_loc_2]);
            return;
        }// end function

        private function get chatClient() : JSONChatClient
        {
            return _chatClient;
        }// end function

        private function isFirstVisit(param1:Object, param2:Object, param3:String) : void
        {
            reportRequestSuccess(model.firstVisit, param3);
            return;
        }// end function

        private function onFlattrFault(param1:Object, param2:Object = null) : void
        {
            reportRequestFailure({message:"HTTP_ERROR", details:param1, code:param1.statusCode}, param2.key);
            return;
        }// end function

        private function cleanQueueChangeEvents() : Array
        {
            var _loc_6:QueueChangeEvent = null;
            var _loc_7:String = null;
            var _loc_8:Object = null;
            var _loc_9:int = 0;
            if (!model.currentQueue)
            {
                return [new QueueChangeEvent(QueueChangeEvent.QUEUE_RESET)];
            }
            var _loc_1:Object = {};
            var _loc_2:Boolean = false;
            var _loc_3:Array = [];
            var _loc_4:* = buildQueue(model.currentQueue);
            var _loc_5:Array = [];
            for each (_loc_6 in this.queueDirty)
            {
                
                switch(_loc_6.type)
                {
                    case QueueChangeEvent.QUEUE_RESET:
                    {
                        _loc_6.details = _loc_4;
                        _loc_6.fullQueue = _loc_4;
                        return [_loc_6];
                    }
                    case QueueChangeEvent.CONTENT_CHANGE:
                    {
                        _loc_9 = 0;
                        while (_loc_9 < _loc_6.details.items.length)
                        {
                            
                            _loc_6.details.items[_loc_9] = buildSong(_loc_6.details.items[_loc_9]);
                            _loc_9++;
                        }
                        _loc_6.fullQueue = _loc_4;
                        _loc_3.push(_loc_6);
                        break;
                    }
                    case QueueChangeEvent.PROPERTY_CHANGE:
                    {
                        _loc_2 = true;
                        _loc_7 = _loc_6.details as String;
                        _loc_8 = model.currentQueue[_loc_7];
                        if (_loc_8 is QueueSong)
                        {
                            _loc_8 = buildSong(_loc_8 as QueueSong);
                        }
                        else if (_loc_7 == "currentAutoplayTag")
                        {
                            _loc_7 = "currentAutoplayTagID";
                            _loc_8 = model.currentQueue.currentAutoplayTag ? (model.currentQueue.currentAutoplayTag.tagID) : (0);
                        }
                        _loc_1[_loc_7] = _loc_8;
                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }
            if (_loc_2)
            {
                _loc_6 = new QueueChangeEvent(QueueChangeEvent.PROPERTY_CHANGE, _loc_1);
                _loc_6.fullQueue = _loc_4;
                _loc_5.push(_loc_6);
            }
            return _loc_5.concat(_loc_3);
        }// end function

        private function reportComputeSpectrum() : void
        {
            var arr:Array;
            var i:int;
            if (ready && computeSpectrumCallback && !SoundMixer.areSoundsInaccessible())
            {
                try
                {
                    SoundMixer.computeSpectrum(spectrum, this.useFFT);
                }
                catch (e:Error)
                {
                    trace(e);
                    return;
                }
                arr;
                i;
                while (i < 512)
                {
                    
                    arr.push(spectrum.readFloat());
                    i = (i + 1);
                }
                makeSafeEICall(computeSpectrumCallback, [arr]);
            }
            return;
        }// end function

        public function setChatServers(param1:Object) : void
        {
            var _loc_3:String = null;
            var _loc_2:Array = [];
            for (_loc_3 in param1)
            {
                
                _loc_2.push({host:_loc_3, port:80, weight:param1[_loc_3]});
            }
            model.chatClient.setServers(_loc_2);
            return;
        }// end function

        private function tunipopResult(param1:Object, param2:Object = null) : void
        {
            var _loc_3:* = param1.result.split("\n");
            if (_loc_3.length >= 4)
            {
                reportRequestSuccess(_loc_3[3], param2.key);
            }
            else if (_loc_3[0] == "301")
            {
                reportRequestSuccess(0, param2.key);
            }
            else
            {
                reportRequestFailure({message:"tunipop error", details:param1.result, code:_loc_3[0]}, param2.key);
            }
            return;
        }// end function

        private function onQueuePlaybackError(event:QueueEvent) : void
        {
            var _loc_2:Object = {type:event.type, details:{}};
            _loc_2.details.reason = event.detail;
            _loc_2.details.song = buildSong(event.extra.song as QueueSong);
            _loc_2.details.errorDetail = "unknown";
            if (event.extra.event)
            {
                switch(event.extra.event.code)
                {
                    case PlayableSongEvent.FAILED_IO_ERROR:
                    {
                        _loc_2.details.errorDetail = "serverIOError";
                        break;
                    }
                    case PlayableSongEvent.FAILED_STREAMKEY_LIMIT:
                    {
                        _loc_2.details.errorDetail = "streamKeyRateLimit";
                        break;
                    }
                    case PlayableSongEvent.FAILED_TOO_MANY_STREAMKEY_FAILS:
                    {
                        _loc_2.details.errorDetail = "streamKeyMultipleFailures";
                        break;
                    }
                    case PlayableSongEvent.FAILED_STREAMKEY_OTHER:
                    {
                        _loc_2.details.errorDetail = "streamKeyFetchError";
                        break;
                    }
                    case PlayableSongEvent.FAILED_TOO_MANY_BAD_FRAMES:
                    {
                        _loc_2.details.errorDetail = "mp3Bad";
                        break;
                    }
                    case PlayableSongEvent.FAILED_UNKNOWN_SERVER_ERROR:
                    {
                        _loc_2.details.errorDetail = "serverUnknownError";
                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }
            this.reportError(_loc_2);
            return;
        }// end function

        public function getApplicationVersion() : String
        {
            return model.revision;
        }// end function

        private function fetchToken() : void
        {
            needToken = !makeSafeEICall(serviceController + ".swfNeedsToken");
            return;
        }// end function

        public function updateInterruptionExpireTime(param1:int, param2:String) : void
        {
            var _loc_4:Number = NaN;
            var _loc_3:* = param2.split("|");
            if (_loc_3.length == 2 && _loc_3[1] == MD5.hash(param1 + _loc_3[0] + INTERRUPT_SECRET))
            {
                _loc_4 = Number(_loc_3[0]);
                if (!isNaN(_loc_4))
                {
                    model.interruptionExpireTime = new Date().valueOf() + _loc_4 * 1000;
                }
            }
            return;
        }// end function

        private function buildQueue(param1:Queue) : Object
        {
            var _loc_3:QueueSong = null;
            var _loc_4:Object = null;
            if (!param1)
            {
                return null;
            }
            var _loc_2:Array = [];
            for each (_loc_3 in param1)
            {
                
                _loc_2.push(buildSong(_loc_3));
            }
            _loc_4 = {songs:_loc_2, queueID:param1.queueID, activeSong:param1.activeSong ? (buildSong(param1.activeSong)) : (null), previousSong:param1.previousSong ? (buildSong(param1.previousSong)) : (null), nextSong:param1.nextSong ? (buildSong(param1.nextSong)) : (null), autoplayEnabled:param1.autoplayEnabled, currentAutoplayTagID:param1.currentAutoplayTag ? (param1.currentAutoplayTag.tagID) : (0), shuffleEnabled:param1.shuffleEnabled, repeatMode:param1.repeatMode};
            if (_loc_4.activeSong)
            {
                _loc_4.activeSong.index = param1.getItemIndex(param1.activeSong);
            }
            return _loc_4;
        }// end function

        public function setCrossfadeEnabled(param1:Boolean) : void
        {
            model.crossfadeEnabled = param1;
            if (model.currentQueue)
            {
                model.currentQueue.crossfadeEnabled = param1;
            }
            if (model.previousQueue)
            {
                model.previousQueue.crossfadeEnabled = param1;
            }
            return;
        }// end function

        private function onServicePropChange(event:PropertyChangeEvent) : void
        {
            if (event.property == "session")
            {
                model.chatClient.session = event.newValue as String;
            }
            return;
        }// end function

        private function set service(param1:Service) : void
        {
            if (param1 !== _service)
            {
                if (_service)
                {
                    _service.removeEventListener(ServiceEvent.SERVICE_ERROR, onServiceError);
                    _service.removeEventListener(ServiceEvent.TOKEN_NEEDED, onServiceNeedsToken);
                    _service.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onServicePropChange);
                }
                _service = param1;
                if (_service)
                {
                    _service.addEventListener(ServiceEvent.SERVICE_ERROR, onServiceError, false, 0, true);
                    _service.addEventListener(ServiceEvent.TOKEN_NEEDED, onServiceNeedsToken, false, 0, true);
                    _service.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, onServicePropChange, false, 0, true);
                }
            }
            return;
        }// end function

        private function onFacebookFault(param1:Object, param2:Object = null) : void
        {
            reportRequestFailure({message:"HTTP_ERROR", details:param1, code:param1.statusCode}, param2.key);
            return;
        }// end function

        private function reportError(param1:Object) : void
        {
            if (ready && errorCallback)
            {
                makeSafeEICall(errorCallback, [param1]);
            }
            return;
        }// end function

        public function setCrossfadeAmount(param1:int) : void
        {
            model.crossfadeAmount = param1;
            if (model.currentQueue)
            {
                model.currentQueue.crossfadeAmount = param1;
            }
            if (model.previousQueue)
            {
                model.previousQueue.crossfadeAmount = param1;
            }
            return;
        }// end function

        public function setPlayPauseFade(param1:Boolean) : void
        {
            model.playPauseFadeEnabled = param1;
            if (model.currentQueue)
            {
                model.currentQueue.crossfadeInOutEnabled = param1;
            }
            if (model.previousQueue)
            {
                model.previousQueue.crossfadeInOutEnabled = param1;
            }
            return;
        }// end function

        private function cleanArrayForEI(param1:Array) : Array
        {
            var _loc_2:Array = [];
            var _loc_3:int = 0;
            while (_loc_3 < param1.length)
            {
                
                if (param1[_loc_3] is String)
                {
                    _loc_2[_loc_3] = cleanStringForEI(param1[_loc_3] as String);
                }
                else if (param1[_loc_3] is Array)
                {
                    _loc_2[_loc_3] = cleanArrayForEI(param1[_loc_3] as Array);
                }
                else if (param1[_loc_3] is Object)
                {
                    _loc_2[_loc_3] = cleanObjectForEI(param1[_loc_3]);
                }
                else
                {
                    _loc_2[_loc_3] = param1[_loc_3];
                }
                _loc_3++;
            }
            return _loc_2;
        }// end function

        private function getNotificationFromDFP(param1:Object, param2:Object, param3:String) : void
        {
            var _loc_4:* = param1.parameters && param1.parameters.paramString ? (param1.parameters.paramString) : ("");
            thirdPartyLoader.method = "GET";
            thirdPartyLoader.requestTimeout = 0;
            thirdPartyLoader.url = "http://ad.doubleclick.net/pfadx/grooveshark.notif/" + _loc_4;
            var _loc_5:* = thirdPartyLoader.send();
            thirdPartyLoader.send().addResponder(new ItemResponder(dfpResult, dfpFault, {request:param1, key:param3}));
            return;
        }// end function

        private function makeSafeEICall(param1:String, param2:Array = null) : Boolean
        {
            var methodName:* = param1;
            var args:* = param2;
            if (!args)
            {
                args;
            }
            var context:String;
            var i:* = methodName.lastIndexOf(".");
            var j:* = methodName.indexOf(".");
            if (i !== -1 && i !== j)
            {
                context = methodName.substring(0, i);
            }
            if (context.length)
            {
                context = "window." + context;
            }
            else
            {
                context;
            }
            var eiCall:* = "function(args) {" + "setTimeout(function() {" + "window." + methodName + ".apply(" + context + ", args);" + "}, 0);" + "}";
            try
            {
                ExternalInterface.call(eiCall, args);
            }
            catch (e:Error)
            {
                trace("EI failed on " + methodName + ": " + e);
                return false;
            }
            return true;
        }// end function

        private function handleCallbacks(event:Event) : void
        {
            var _loc_3:QueueSong = null;
            var _loc_4:int = 0;
            if (!ready)
            {
                attemptReady();
                return;
            }
            if (this.propsDirty)
            {
                this.propsDirty = !reportPropertyChange();
            }
            if (this.queueDirty.length)
            {
                this.queueDirty = reportQueueChange();
                if (this.ready)
                {
                    this.storeQueue(true);
                }
            }
            if (this.playStatusDirty)
            {
                this.playStatusDirty = !reportPlaybackStatus();
            }
            var _loc_2:* = songsDirty.concat();
            for each (_loc_3 in _loc_2)
            {
                
                if (reportSongPropertyChange(_loc_3))
                {
                    _loc_4 = songsDirty.indexOf(_loc_3);
                    songsDirty.splice(_loc_4, 1);
                }
            }
            reportComputeSpectrum();
            reportZoom();
            return;
        }// end function

        public function setPersistShuffle(param1:Boolean) : void
        {
            model.persistShuffle = param1;
            return;
        }// end function

        private function cleanStringForEI(param1:String) : String
        {
            return param1.replace(/\\\"""\\/g, "\\\\").replace(/\&""\&/g, "&amp;");
        }// end function

        public function getCurrentQueue() : Object
        {
            return buildQueue(model.currentQueue);
        }// end function

        private function handleFlattrRequest(param1:Object, param2:String) : void
        {
            var _loc_4:Base64Encoder = null;
            param1.httpMethod = String(param1.httpMethod).toUpperCase();
            if (allowedHTTPMethods.indexOf(param1.httpMethod) == -1)
            {
                param1.httpMethod = "POST";
            }
            thirdPartyLoader.method = param1.httpMethod;
            thirdPartyLoader.requestTimeout = 0;
            thirdPartyLoader.url = param1.url;
            thirdPartyLoader.headers = {};
            if (param1.parameters["grant_type"] && param1.parameters["grant_type"] == "authorization_code")
            {
                _loc_4 = new Base64Encoder();
                _loc_4.encode(param1.parameters["client_id"] + ":" + param1.parameters["client_secret"]);
                thirdPartyLoader.headers = {Authorization:"Basic " + _loc_4.toString()};
            }
            var _loc_3:* = thirdPartyLoader.send(param1.parameters);
            _loc_3.addResponder(new ItemResponder(onFlattrResult, onFlattrFault, {request:param1, key:param2}));
            return;
        }// end function

        private function getVideoFromDFP(param1:Object, param2:Object, param3:String) : void
        {
            var _loc_4:* = param1.parameters && param1.parameters.paramString ? (param1.parameters.paramString) : ("");
            thirdPartyLoader.method = "GET";
            thirdPartyLoader.requestTimeout = 3;
            thirdPartyLoader.url = "http://ad.doubleclick.net/pfadx/grooveshark.video/" + _loc_4;
            var _loc_5:* = thirdPartyLoader.send();
            thirdPartyLoader.send().addResponder(new ItemResponder(dfpResult, dfpFault, {request:param1, key:param3, tryParse:true}));
            return;
        }// end function

        private function handleFacebookRequest(param1:Object, param2:String) : void
        {
            var _loc_3:String = null;
            var _loc_4:AsyncToken = null;
            param1.httpMethod = String(param1.httpMethod).toUpperCase();
            if (allowedHTTPMethods.indexOf(param1.httpMethod) == -1)
            {
                param1.httpMethod = "POST";
            }
            thirdPartyLoader.method = param1.httpMethod;
            thirdPartyLoader.requestTimeout = 0;
            thirdPartyLoader.url = "https://graph.facebook.com/" + param1.method;
            thirdPartyLoader.headers = {};
            trace("FACEBOOK, method: " + thirdPartyLoader.method + ", url: " + thirdPartyLoader.url);
            for (_loc_3 in param1.parameters)
            {
                
                trace(_loc_3 + ":" + param1.parameters[_loc_3]);
            }
            _loc_4 = thirdPartyLoader.send(param1.parameters);
            _loc_4.addResponder(new ItemResponder(onFacebookResult, onFacebookFault, {request:param1, key:param2}));
            return;
        }// end function

        public function setIsMuted(param1:Boolean) : void
        {
            model.isMuted = param1;
            SoundMixer.soundTransform = new SoundTransform(model.isMuted ? (0) : (model.volume / 100));
            return;
        }// end function

        private function onSongPropChange(event:PropertyChangeEvent) : void
        {
            switch(event.property)
            {
                case "playStatus":
                {
                    playStatusDirty = !reportPlaybackStatus();
                    break;
                }
                case "currentStreamServer":
                case "bytesLoaded":
                case "bytesTotal":
                case "position":
                case "duration":
                {
                    playStatusDirty = true;
                    break;
                }
                default:
                {
                    break;
                }
            }
            return;
        }// end function

        private function reportUserChange(param1:Object, param2:Object, param3:String) : void
        {
            if (!param1.parameters)
            {
                reportRequestSuccess({result:false}, param3);
                return;
            }
            var _loc_4:* = int(param1.parameters.userID);
            if (!int(param1.parameters.userID))
            {
                _loc_4 = -1;
            }
            var _loc_5:* = uint(param1.parameters.privacy);
            var _loc_6:* = Number(param1.parameters.userTrackingID);
            if (isNaN(_loc_6))
            {
                _loc_6 = 0;
            }
            model.service.privacy = _loc_5;
            Queue.userTrackingID = _loc_6;
            if (_loc_4)
            {
                PlayableSong.userForReporting = {userID:_loc_4, username:param1.parameters.username, picture:param1.parameters.picture, isPremium:param1.parameters.isPremium ? (param1.parameters.isPremium) : (false)};
            }
            else
            {
                PlayableSong.userForReporting = null;
            }
            model.chatClient.userID = _loc_4;
            model.currentUserID = _loc_4;
            reportRequestSuccess({result:true}, param3);
            return;
        }// end function

        private function buildEverything() : Object
        {
            var _loc_1:* = buildProperties();
            _loc_1.currentQueue = buildQueue(model.currentQueue);
            _loc_1.previousQueue = buildQueue(model.previousQueue);
            _loc_1.verifyKey = this.controllerKey;
            _loc_1.interruptionExpireTime = model.interruptionExpireTime;
            return _loc_1;
        }// end function

        public function setQueueChangeCallback(param1:String) : Object
        {
            this.queueChangeCallback = param1;
            return buildQueue(model.currentQueue);
        }// end function

        private function onServiceNeedsToken(event:ServiceEvent) : void
        {
            if (ready)
            {
                fetchToken();
            }
            else
            {
                needToken = true;
            }
            return;
        }// end function

        public function rapleaf_personalize(param1:Object, param2:String) : void
        {
            var _loc_4:AsyncToken = null;
            var _loc_3:* = param1.parameters && param1.parameters.redirectURL ? (param1.parameters.redirectURL) : ("");
            if (_loc_3)
            {
                thirdPartyLoader.method = "GET";
                thirdPartyLoader.requestTimeout = 0;
                thirdPartyLoader.url = RAPLEAF_PERSONLIZE_URL_VISIT + "?acct=" + RAPLEAF_ACCT_ID + "&url=" + _loc_3;
                _loc_4 = thirdPartyLoader.send();
                _loc_4.addResponder(new ItemResponder(rapleafResult, rapleafFault, {request:param1, key:param2}));
            }
            else
            {
                reportRequestFailure({message:"Missing required parameter: redirectURL"}, param2);
            }
            return;
        }// end function

        private function onServiceError(event:ServiceEvent) : void
        {
            var _loc_2:Object = {type:event.type, details:event.detail};
            this.reportError(_loc_2);
            return;
        }// end function

        public function removeSongs(param1:Array) : void
        {
            var _loc_2:Array = null;
            var _loc_3:int = 0;
            var _loc_4:QueueSong = null;
            if (model.currentQueue)
            {
                _loc_2 = [];
                for each (_loc_3 in param1)
                {
                    
                    _loc_4 = model.currentQueue.queueSongLookupByQueueSongID[_loc_3];
                    if (_loc_4)
                    {
                        _loc_2.push(_loc_4);
                    }
                }
                model.currentQueue.removeItems(_loc_2);
            }
            return;
        }// end function

        private function onLastfmResult(param1:Object, param2:Object = null) : void
        {
            reportRequestSuccess(param1, param2.key);
            return;
        }// end function

        public function setAutoplay(param1:Boolean, param2:int = 0, param3:Object = null, param4:String = "autoplayGetSong") : void
        {
            var _loc_5:Boolean = false;
            var _loc_6:Tag = null;
            if (model.currentQueue)
            {
                if (param2)
                {
                    if (param1)
                    {
                        _loc_5 = true;
                        _loc_6 = Tag.tagIDLookup[param2];
                        if (!_loc_6)
                        {
                            _loc_6 = new Tag(param2, "");
                        }
                        model.currentQueue.startTagAutoplay(_loc_6, true, param4);
                    }
                }
                else
                {
                    model.currentQueue.stopTagAutoplay();
                }
                if (param1 != model.currentQueue.autoplayEnabled && !_loc_5)
                {
                    model.currentQueue.setAutoplayEnabled(param1, true, true, param3);
                }
            }
            return;
        }// end function

        private function dfpResult(param1:Object, param2:Object = null) : void
        {
            var result:* = param1;
            var token:* = param2;
            var r:* = result.result;
            if (token.tryParse)
            {
                try
                {
                    JSON.decode(r);
                }
                catch (e:Error)
                {
                    r;
                }
            }
            reportRequestSuccess(r, token.key);
            return;
        }// end function

        private function onSuggestFlattrResult(event:Event) : void
        {
            var _loc_2:* = event.currentTarget as SuggestFlattr;
            if (_loc_2)
            {
                reportRequestSuccess(_loc_2.result, _loc_2.key);
            }
            return;
        }// end function

        private function getTunipopID(param1:Object, param2:Object, param3:String) : void
        {
            var _loc_6:String = null;
            var _loc_7:AsyncToken = null;
            var _loc_4:* = param1.parameters && param1.parameters.brand ? (param1.parameters.brand) : ("");
            var _loc_5:* = param1.parameters && param1.parameters.artist ? (param1.parameters.artist) : ("");
            if (_loc_4)
            {
                _loc_6 = "&qufr=2&Brand=" + encodeURIComponent(_loc_4);
            }
            else if (_loc_5)
            {
                _loc_6 = "&qufr=3&Artist=" + encodeURIComponent(_loc_5);
            }
            if (_loc_6)
            {
                thirdPartyLoader.method = "GET";
                thirdPartyLoader.requestTimeout = 0;
                thirdPartyLoader.url = "https://query.tunipop.net/MerchLocator/RequestMerch.php?qucx=mm&rtid=7300" + _loc_6;
                _loc_7 = thirdPartyLoader.send();
                _loc_7.addResponder(new ItemResponder(tunipopResult, tunipopFault, {request:param1, key:param3}));
            }
            else
            {
                reportRequestFailure({code:0, message:"Missing required parameter: brand or artist"}, param3);
            }
            return;
        }// end function

        private function buildPlaybackStatus() : Object
        {
            var _loc_1:Object = null;
            if (activeSong)
            {
                _loc_1 = {activeSong:buildSong(activeSong), bytesLoaded:activeSong.bytesLoaded, bytesTotal:activeSong.bytesTotal, position:activeSong.position, duration:activeSong.duration, status:activeSong.playStatus, currentStreamServer:activeSong.currentStreamServer};
            }
            if (_loc_1 && _loc_1.activeSong && currentQueue)
            {
                _loc_1.activeSong.index = currentQueue.getItemIndex(activeSong);
            }
            return _loc_1;
        }// end function

        private function rapleafResult(param1:Object, param2:Object = null) : void
        {
            reportRequestSuccess(param1.result, param2.key);
            return;
        }// end function

        public function getCrossfadeAmount() : int
        {
            return model.crossfadeAmount;
        }// end function

    }
}
