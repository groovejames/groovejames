package com.grooveshark.framework.playback.commands
{
    import com.grooveshark.framework.playback.*;
    import com.grooveshark.jsonrpc.*;
    import com.grooveshark.utils.*;
    import flash.events.*;
    import flash.utils.*;
    import mx.collections.*;

    public class VoteSongForAutoplay extends SongCommand
    {
        private var attempts:int = 0;
        private var vote:int;

        public function VoteSongForAutoplay(param1:IDualService, param2:QueueSong, param3:int)
        {
            super(param1, param2);
            this.vote = param3;
            return;
        }// end function

        private function reexecute(event:Event) : void
        {
            execute();
            return;
        }// end function

        private function voteUp(param1:Object) : void
        {
            var _loc_3:* = attempts + 1;
            attempts = _loc_3;
            service.send(false, "autoplayVoteUp", param1, new ItemResponder(voteSuccess, serviceFault));
            return;
        }// end function

        private function removeUpVote(param1:Object) : void
        {
            var _loc_3:* = attempts + 1;
            attempts = _loc_3;
            service.send(false, "autoplayRemoveVoteUp", param1, new ItemResponder(removeSuccess, serviceFault, param1));
            return;
        }// end function

        private function voteDown(param1:Object) : void
        {
            var _loc_3:* = attempts + 1;
            attempts = _loc_3;
            service.send(false, "autoplayVoteDown", param1, new ItemResponder(voteSuccess, serviceFault));
            return;
        }// end function

        private function serviceFault(param1:Object, param2:Object = null) : void
        {
            onFail((param1 as JSONFault).message, (param1 as JSONFault).code != -256);
            return;
        }// end function

        private function removeDownVote(param1:Object) : void
        {
            var _loc_3:* = attempts + 1;
            attempts = _loc_3;
            service.send(false, "autoplayRemoveVoteDown", param1, new ItemResponder(removeSuccess, serviceFault, param1));
            return;
        }// end function

        override public function execute() : void
        {
            if (!(song as QueueSong).parent || !(song as QueueSong).parent.queueID)
            {
                onFail("Queue not initialized.", false);
                return;
            }
            if (!song || !(song as QueueSong).queueSongID)
            {
                onFail("Either no song, or song is missing queueSongID.", false);
                return;
            }
            var _loc_1:Object = {};
            _loc_1.songQueueID = (song as QueueSong).parent.queueID;
            _loc_1.songQueueSongID = (song as QueueSong).queueSongID;
            if ((song as QueueSong).autoplayVote == QueueSong.AUTOPLAY_VOTE_UP)
            {
                removeUpVote(_loc_1);
            }
            else if ((song as QueueSong).autoplayVote == QueueSong.AUTOPLAY_VOTE_DOWN)
            {
                removeDownVote(_loc_1);
            }
            else if (vote == QueueSong.AUTOPLAY_VOTE_UP)
            {
                voteUp(_loc_1);
            }
            else
            {
                voteDown(_loc_1);
            }
            return;
        }// end function

        private function voteSuccess(param1:Object, param2:Object = null) : void
        {
            (song as QueueSong).autoplayVote = vote;
            dispatchEvent(new Event(Event.COMPLETE));
            return;
        }// end function

        private function onFail(param1:String, param2:Boolean = true) : void
        {
            var _loc_3:int = 0;
            var _loc_4:Timer = null;
            if (param2 && attempts < 3)
            {
                Debug.getInstance().print("[VoteSongForAutoplay] Failed: " + param1 + " Will re-attempt.");
                _loc_3 = 100 + Math.floor(Math.random() * 400);
                _loc_4 = new Timer(_loc_3, 1);
                _loc_4.addEventListener(TimerEvent.TIMER_COMPLETE, reexecute, false, 0, true);
                _loc_4.start();
            }
            else
            {
                Debug.getInstance().print("[VoteSongForAutoplay] Failed: " + param1 + " Giving up.");
                song.dispatchEvent(new PlayableSongEvent(PlayableSongEvent.SONG_VOTE_FAILED));
                dispatchEvent(new Event("failed"));
            }
            return;
        }// end function

        private function removeSuccess(param1:Object, param2:Object = null) : void
        {
            (song as QueueSong).autoplayVote = 0;
            attempts = 0;
            if (vote == QueueSong.AUTOPLAY_VOTE_UP)
            {
                voteUp(param2);
            }
            else if (vote == QueueSong.AUTOPLAY_VOTE_DOWN)
            {
                voteDown(param2);
            }
            else
            {
                dispatchEvent(new Event(Event.COMPLETE));
            }
            return;
        }// end function

    }
}
