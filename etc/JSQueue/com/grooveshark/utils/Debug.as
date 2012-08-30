package com.grooveshark.utils
{
    import flash.events.*;

    public class Debug extends EventDispatcher
    {
        private static var _instance:Debug;

        public function Debug(param1:SingletonEnforcer)
        {
            return;
        }// end function

        public function print(param1) : void
        {
            var _loc_2:* = undefined;
            if (param1 is Array)
            {
                for each (_loc_2 in param1)
                {
                    
                    print(_loc_2);
                }
            }
            else
            {
                trace(param1);
            }
            return;
        }// end function

        public static function getInstance() : Debug
        {
            if (_instance == null)
            {
                _instance = new Debug(new SingletonEnforcer());
            }
            return _instance;
        }// end function

    }
}
