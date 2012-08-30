package com.grooveshark.framework.playback
{
    import com.grooveshark.utils.*;

    final public class AutoplayStatus extends Object
    {
        var frowns:Array;
        var taggedArtistIDs:Array;
        var _minDuration:Number;
        var flaggedSongIDs:Array;
        var _minSeeds:int;
        var userSeeds:Array;
        var _maxDuration:Number;
        var _numPlayedArtists:int;
        var _weightModifierRange:Array;
        var smiles:Array;
        public var parent:Queue;
        var _numPlayedSongs:int;
        var _seedWeightRange:Array;
        var _numBadTitles:int;
        var _secondarySeedWeightMultiplier:Number;
        public static var numPlayedSongs:int = 50;
        public static var minDuration:Number = 60;
        public static var weightModifierRange:Array = [-9, 9];
        public static var minSeeds:int = 10;
        public static var numPlayedArtists:int = 5;
        public static var maxDuration:Number = 1500;
        public static var numBadTitles:int = 25;
        public static var seedWeightRange:Array = [70, 100];
        public static var secondarySeedWeightMultiplier:Number = 0.9;

        public function AutoplayStatus(param1:Queue, param2:Object = null) : void
        {
            var _loc_3:QueueSong = null;
            var _loc_4:Object = null;
            userSeeds = [];
            smiles = [];
            frowns = [];
            taggedArtistIDs = [];
            flaggedSongIDs = [];
            this.parent = param1;
            if (!param2)
            {
                param2 = {};
            }
            _minSeeds = AutoplayStatus.minSeeds;
            _numPlayedArtists = AutoplayStatus.numPlayedArtists;
            _numPlayedSongs = AutoplayStatus.numPlayedSongs;
            _numBadTitles = AutoplayStatus.numBadTitles;
            if (param2.hasOwnProperty("secondaryArtistWeightModifier"))
            {
                _secondarySeedWeightMultiplier = param2.secondaryArtistWeightModifier;
            }
            else
            {
                _secondarySeedWeightMultiplier = AutoplayStatus.secondarySeedWeightMultiplier;
            }
            if (param2.hasOwnProperty("seedArtistWeightRange"))
            {
                _seedWeightRange = param2.seedArtistWeightRange;
            }
            else
            {
                _seedWeightRange = AutoplayStatus.seedWeightRange;
            }
            if (param2.hasOwnProperty("weightModifierRange"))
            {
                _weightModifierRange = param2.weightModifierRange;
            }
            else
            {
                _weightModifierRange = AutoplayStatus.weightModifierRange;
            }
            _minDuration = AutoplayStatus.minDuration;
            _maxDuration = AutoplayStatus.maxDuration;
            for each (_loc_3 in param1)
            {
                
                if (_loc_3.source == "user")
                {
                    userSeeds.push(_loc_3);
                }
                if (_loc_3._autoplayVote == QueueSong.AUTOPLAY_VOTE_UP)
                {
                    smiles.push(_loc_3);
                    continue;
                }
                if (_loc_3._autoplayVote == QueueSong.AUTOPLAY_VOTE_DOWN)
                {
                    frowns.push(_loc_3);
                }
            }
            if (param2.hasOwnProperty("seeds") && param2.seeds is Array)
            {
                for each (_loc_4 in param2.seeds as Array)
                {
                    
                    trace("seed: " + _loc_4);
                    if (_loc_4.hasOwnProperty("artistID") && int(_loc_4.artistID))
                    {
                        userSeeds.push(int(_loc_4.artistID));
                        continue;
                    }
                    if (_loc_4.hasOwnProperty("ArtistID") && int(_loc_4.ArtistID))
                    {
                        userSeeds.push(int(_loc_4.ArtistID));
                        continue;
                    }
                    if (int(_loc_4))
                    {
                        userSeeds.push(int(_loc_4));
                    }
                }
            }
            if (param2.hasOwnProperty("frowns") && param2.frowns is Array)
            {
                for each (_loc_4 in param2.frowns as Array)
                {
                    
                    if (_loc_4.hasOwnProperty("artistID") && int(_loc_4.artistID))
                    {
                        frowns.push(int(_loc_4.artistID));
                        continue;
                    }
                    if (_loc_4.hasOwnProperty("ArtistID") && int(_loc_4.ArtistID))
                    {
                        frowns.push(int(_loc_4.ArtistID));
                        continue;
                    }
                    if (int(_loc_4))
                    {
                        frowns.push(int(_loc_4));
                    }
                }
            }
            return;
        }// end function

        public function songFlagged(param1:QueueSong) : void
        {
            var _loc_2:* = param1.song.songID;
            var _loc_3:* = flaggedSongIDs.indexOf(_loc_2);
            if (_loc_3 == -1)
            {
                flaggedSongIDs.push(_loc_2);
            }
            return;
        }// end function

        public function get badTitles() : Array
        {
            var _loc_3:QueueSong = null;
            var _loc_4:String = null;
            var _loc_1:Array = [];
            var _loc_2:* = parent.length - 1;
            while (_loc_2 >= 0)
            {
                
                if (_loc_1.length < AutoplayStatus.numBadTitles)
                {
                    _loc_3 = parent.getItemAt(_loc_2) as QueueSong;
                    _loc_4 = StringUtils.condenseTitle(_loc_3.song.songName);
                    if (_loc_4)
                    {
                        _loc_1.push(_loc_4);
                    }
                }
                else
                {
                    break;
                }
                _loc_2 = _loc_2 - 1;
            }
            return _loc_1;
        }// end function

        public function songsAddedToQueue(param1:Array) : void
        {
            var _loc_2:QueueSong = null;
            for each (_loc_2 in param1)
            {
                
                if (_loc_2.source == "user")
                {
                    userSeeds.push(_loc_2);
                }
            }
            return;
        }// end function

        public function addTagArtistSeeds(param1:Array) : void
        {
            taggedArtistIDs = param1;
            _seedWeightRange = [110, 130];
            _secondarySeedWeightMultiplier = 0.75;
            _numPlayedArtists = 15;
            return;
        }// end function

        public function createStoredParams() : Object
        {
            var _loc_2:Object = null;
            var _loc_3:QueueSong = null;
            var _loc_4:int = 0;
            var _loc_1:Object = {};
            _loc_1.version = 2;
            _loc_1.minSeeds = this._minSeeds;
            _loc_1.numPlayedArtists = this._numPlayedArtists;
            _loc_1.numPlayedSongs = this._numPlayedSongs;
            _loc_1.numBadTitles = this._numBadTitles;
            _loc_1.secondarySeedWeightMultiplier = this._secondarySeedWeightMultiplier;
            _loc_1.seedWeightRange = this._seedWeightRange;
            _loc_1.weightModifierRange = this._weightModifierRange;
            _loc_1.minDuration = this._minDuration;
            _loc_1.maxDuration = this._maxDuration;
            _loc_1.userSeeds = [];
            _loc_1.smiles = [];
            _loc_1.frowns = [];
            _loc_1.taggedArtistIDs = [];
            _loc_1.flaggedSongIDs = [];
            for each (_loc_2 in userSeeds)
            {
                
                if (_loc_2 is QueueSong)
                {
                    _loc_1.userSeeds.push({queueSongID:_loc_2.queueSongID});
                    continue;
                }
                if (int(_loc_2))
                {
                    _loc_1.userSeeds.push({artistID:int(_loc_2)});
                }
            }
            for each (_loc_3 in smiles)
            {
                
                _loc_1.smiles.push({queueSongID:_loc_3.queueSongID});
            }
            for each (_loc_2 in frowns)
            {
                
                if (_loc_2 is QueueSong)
                {
                    _loc_1.frowns.push({artistID:(_loc_2 as QueueSong).song.artistID});
                    continue;
                }
                if (int(_loc_2))
                {
                    _loc_1.frowns.push({artistID:int(_loc_2)});
                }
            }
            for each (_loc_4 in taggedArtistIDs)
            {
                
                _loc_1.taggedArtistIDs.push({artistID:_loc_4});
            }
            return _loc_1;
        }// end function

        public function songsRemovedFromQueue(param1:Array) : void
        {
            var _loc_2:QueueSong = null;
            var _loc_3:int = 0;
            for each (_loc_2 in param1)
            {
                
                _loc_3 = userSeeds.indexOf(_loc_2);
                if (_loc_3 != -1)
                {
                    userSeeds.splice(_loc_3, 1);
                }
                _loc_3 = smiles.indexOf(_loc_2);
                if (_loc_3 != -1)
                {
                    smiles.splice(_loc_3, 1);
                }
            }
            return;
        }// end function

        public function songVoted(param1:QueueSong) : void
        {
            var _loc_2:int = 0;
            switch(param1._autoplayVote)
            {
                case QueueSong.AUTOPLAY_VOTE_UP:
                {
                    if (smiles.indexOf(param1) == -1)
                    {
                        smiles.push(param1);
                    }
                    break;
                }
                case QueueSong.AUTOPLAY_VOTE_DOWN:
                {
                    if (frowns.indexOf(param1) == -1)
                    {
                        frowns.push(param1);
                    }
                    break;
                }
                case QueueSong.AUTOPLAY_VOTE_NONE:
                {
                    _loc_2 = smiles.indexOf(param1);
                    if (_loc_2 != -1)
                    {
                        smiles.splice(_loc_2, 1);
                    }
                    _loc_2 = frowns.indexOf(param1);
                    if (_loc_2 != -1)
                    {
                        frowns.splice(_loc_2, 1);
                    }
                    break;
                }
                default:
                {
                    break;
                }
            }
            return;
        }// end function

        public function get statusForRPC() : Object
        {
            var _loc_3:Object = null;
            var _loc_4:Array = null;
            var _loc_5:QueueSong = null;
            var _loc_6:Array = null;
            var _loc_7:Array = null;
            var _loc_8:Array = null;
            var _loc_9:int = 0;
            var _loc_11:int = 0;
            var _loc_12:int = 0;
            var _loc_13:Object = null;
            var _loc_14:QueueSong = null;
            var _loc_15:int = 0;
            var _loc_1:Object = {};
            var _loc_2:Array = [];
            for each (_loc_3 in frowns)
            {
                
                if (_loc_3 is QueueSong)
                {
                    _loc_2.push((_loc_3 as QueueSong).song.artistID);
                    continue;
                }
                if (int(_loc_3))
                {
                    _loc_2.push(int(_loc_3));
                }
            }
            _loc_4 = userSeeds.concat();
            for each (_loc_5 in smiles)
            {
                
                if (_loc_4.indexOf(_loc_5) == -1)
                {
                    _loc_4.push(_loc_5);
                }
            }
            _loc_4 = _loc_4.concat(taggedArtistIDs);
            _loc_6 = [];
            for each (_loc_3 in _loc_4)
            {
                
                if (_loc_3 is QueueSong)
                {
                    _loc_12 = (_loc_3 as QueueSong).song.artistID;
                }
                else if (int(_loc_3) != 0)
                {
                    _loc_12 = int(_loc_3);
                }
                _loc_11 = _loc_2.indexOf(_loc_12);
                if (_loc_11 == -1)
                {
                    _loc_13 = {};
                    _loc_13.artistID = _loc_12;
                    _loc_13.type = "p";
                    _loc_6.push(_loc_13);
                    continue;
                }
                _loc_2.splice(_loc_11, 1);
            }
            _loc_7 = [];
            _loc_8 = [];
            _loc_9 = parent.length - 1;
            while (_loc_9 >= 0)
            {
                
                _loc_14 = parent.getItemAt(_loc_9) as QueueSong;
                _loc_15 = _loc_14.song.songID;
                _loc_12 = _loc_14.song.artistID;
                if (_loc_6.length < _minSeeds && _loc_14.thirtySecReported && _loc_4.indexOf(_loc_14) == -1 && _loc_14.source != "sponsored")
                {
                    _loc_11 = _loc_2.indexOf(_loc_12);
                    if (_loc_11 == -1)
                    {
                        _loc_13 = {};
                        _loc_13.artistID = _loc_12;
                        _loc_13.type = "s";
                        _loc_6.push(_loc_13);
                    }
                    else
                    {
                        _loc_2.splice(_loc_11, 1);
                    }
                }
                if (_loc_7.length < _numPlayedArtists && _loc_7.indexOf(_loc_12) == -1)
                {
                    _loc_7.push(_loc_12);
                }
                if (_loc_8.length < _numPlayedSongs && _loc_8.indexOf(_loc_15) == -1)
                {
                    _loc_8.push(_loc_15);
                }
                if (_loc_6.length >= _minSeeds && _loc_7.length == _numPlayedArtists && _loc_8.length == _numPlayedSongs)
                {
                    break;
                }
                _loc_9 = _loc_9 - 1;
            }
            var _loc_10:Object = {};
            for each (_loc_13 in _loc_6)
            {
                
                if (!_loc_10[_loc_13.artistID])
                {
                    _loc_10[_loc_13.artistID] = _loc_13.type;
                }
            }
            _loc_1.seedArtists = _loc_10;
            _loc_1.frowns = _loc_2;
            _loc_1.recentArtists = _loc_7;
            _loc_1.songIDsAlreadySeen = _loc_8.concat(flaggedSongIDs);
            _loc_1.secondaryArtistWeightModifier = _secondarySeedWeightMultiplier;
            _loc_1.seedArtistWeightRange = _seedWeightRange;
            _loc_1.weightModifierRange = _weightModifierRange;
            _loc_1.minDuration = _minDuration;
            _loc_1.maxDuration = _maxDuration;
            return _loc_1;
        }// end function

        public static function paramsToStringArray() : Array
        {
            var _loc_1:Array = [];
            _loc_1.push("minSeeds: " + minSeeds);
            _loc_1.push("numPlayedArtists: " + numPlayedArtists);
            _loc_1.push("numPlayedSongs: " + numPlayedSongs);
            _loc_1.push("numBadTitles: " + numBadTitles);
            _loc_1.push("secondarySeedWeightMultiplier: " + secondarySeedWeightMultiplier);
            _loc_1.push("seedWeightRange: " + seedWeightRange);
            _loc_1.push("weightModifierRange: " + weightModifierRange);
            _loc_1.push("minDuration: " + minDuration);
            _loc_1.push("maxDuration: " + maxDuration);
            return _loc_1;
        }// end function

        public static function createFromStoredParams(param1:Queue, param2:Object) : AutoplayStatus
        {
            var _loc_4:Object = null;
            var _loc_5:QueueSong = null;
            var _loc_3:* = new AutoplayStatus(param1);
            if (param2)
            {
                if (param2.version == 1 || param2.version == 2)
                {
                    _loc_3._minSeeds = param2.minSeeds;
                    _loc_3._numPlayedArtists = param2.numPlayedArtists;
                    _loc_3._numPlayedSongs = param2.numPlayedSongs;
                    _loc_3._numBadTitles = param2.numBadTitles;
                    _loc_3._secondarySeedWeightMultiplier = param2.secondarySeedWeightMultiplier;
                    _loc_3._seedWeightRange = param2.seedWeightRange;
                    _loc_3._weightModifierRange = param2.weightModifierRange;
                    _loc_3._minDuration = param2.minDuration;
                    _loc_3._maxDuration = param2.maxDuration;
                    if (param2.hasOwnProperty("flaggedSongIDs") && param2.flaggedSongIDs is Array)
                    {
                        _loc_3.flaggedSongIDs = param2.flaggedSongIDs;
                    }
                    if (param2.version == 1)
                    {
                        for each (_loc_4 in param2.seeds)
                        {
                            
                            if (_loc_4.hasOwnProperty("queueSongID") && int(_loc_4.queueSongID))
                            {
                                _loc_5 = param1.queueSongLookupByQueueSongID[int(_loc_4.queueSongID)];
                                if (_loc_5)
                                {
                                    if (_loc_5.source == "user")
                                    {
                                        if (_loc_3.userSeeds.indexOf(_loc_5) == -1)
                                        {
                                            _loc_3.userSeeds.push(_loc_5);
                                        }
                                    }
                                    if (_loc_5._autoplayVote == QueueSong.AUTOPLAY_VOTE_UP)
                                    {
                                        if (_loc_3.smiles.indexOf(_loc_5) == -1)
                                        {
                                            _loc_3.smiles.push(_loc_5);
                                        }
                                    }
                                }
                                continue;
                            }
                            if (_loc_4.hasOwnProperty("artistID") && int(_loc_4.artistID))
                            {
                                _loc_3.taggedArtistIDs.push(int(_loc_4.artistID));
                            }
                        }
                        for each (_loc_4 in param2.frowns)
                        {
                            
                            if (_loc_4.hasOwnProperty("artistID") && int(_loc_4.artistID))
                            {
                                _loc_3.frowns.push(int(_loc_4.artistID));
                            }
                        }
                    }
                    else if (param2.version == 2)
                    {
                        for each (_loc_4 in param2.userSeeds)
                        {
                            
                            if (_loc_4.hasOwnProperty("queueSongID") && int(_loc_4.queueSongID))
                            {
                                _loc_5 = param1.queueSongLookupByQueueSongID[int(_loc_4.queueSongID)];
                                if (_loc_5 && _loc_5.source == "user" && _loc_3.userSeeds.indexOf(_loc_5) == -1)
                                {
                                    _loc_3.userSeeds.push(_loc_5);
                                }
                                continue;
                            }
                            if (_loc_4.hasOwnProperty("artistID") && int(_loc_4.artistID))
                            {
                                _loc_3.userSeeds.push(int(_loc_4.artistID));
                            }
                        }
                        for each (_loc_4 in param2.smiles)
                        {
                            
                            if (_loc_4.hasOwnProperty("queueSongID") && int(_loc_4.queueSongID))
                            {
                                _loc_5 = param1.queueSongLookupByQueueSongID[int(_loc_4.queueSongID)];
                                if (_loc_5 && _loc_5._autoplayVote == QueueSong.AUTOPLAY_VOTE_UP && _loc_3.smiles.indexOf(_loc_5) == -1)
                                {
                                    _loc_3.smiles.push(_loc_5);
                                }
                            }
                        }
                        for each (_loc_4 in param2.frowns)
                        {
                            
                            if (_loc_4.hasOwnProperty("artistID") && int(_loc_4.artistID))
                            {
                                _loc_3.frowns.push(int(_loc_4.artistID));
                            }
                        }
                        for each (_loc_4 in param2.taggedArtistIDs)
                        {
                            
                            if (_loc_4.hasOwnProperty("artistID") && int(_loc_4.artistID))
                            {
                                _loc_3.taggedArtistIDs.push(int(_loc_4.artistID));
                            }
                        }
                    }
                }
            }
            return _loc_3;
        }// end function

    }
}
