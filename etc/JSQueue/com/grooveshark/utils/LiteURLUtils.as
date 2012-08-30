package com.grooveshark.utils
{
    import flash.utils.*;
    import mx.utils.*;

    public class LiteURLUtils extends Object
    {
        public static var hostname:String = "grooveshark.com";

        public function LiteURLUtils()
        {
            return;
        }// end function

        public static function cleanNameForURL(param1:String, param2:Boolean = true) : String
        {
            param1 = param1.replace(/&""&/g, " and ");
            param1 = param1.replace(/#""#/g, " number ");
            param1 = param1.replace(/[^\w]""[^\w]/g, "_");
            if (param2)
            {
                param1 = StringUtils.ucwords(param1);
            }
            param1 = StringUtil.trim(param1).replace(/\s""\s/g, "_");
            param1 = param1.replace(/__+""__+/g, "_");
            param1 = escapeMultiByte(param1);
            param1 = param1.replace(/%5F""%5F/g, "+");
            return param1;
        }// end function

        public static function generateURL(param1:String, param2:int, param3:String, param4:String = null, param5:Boolean = false) : String
        {
            var _loc_6:String = null;
            param1 = param1 ? (param1) : ("Unknown");
            param1 = cleanNameForURL(param1, param3 != "user");
            param3 = param3.toLowerCase();
            if (param4)
            {
                if (param3 == "song")
                {
                    param3 = "s";
                }
                if (param5)
                {
                    _loc_6 = "http://" + hostname + "/" + param3 + "/" + param1 + "/" + param4 + "?src=6";
                }
                else
                {
                    _loc_6 = "http://" + hostname + "/#/" + param3 + "/" + param1 + "/" + param4 + "?src=6";
                }
            }
            else if (param5)
            {
                _loc_6 = "http://" + hostname + "/" + param3 + "/" + param1 + "/" + param2 + "?src=6";
            }
            else
            {
                _loc_6 = "http://" + hostname + "/#/" + param3 + "/" + param1 + "/" + param2 + "?src=6";
            }
            return _loc_6;
        }// end function

        public static function generate404() : String
        {
            return "http://" + hostname + "/#/404?src=6";
        }// end function

        public static function extractURLFragment(param1:String) : String
        {
            var _loc_2:* = URLUtil.getServerName(param1);
            var _loc_3:* = param1.substr(param1.indexOf(_loc_2) + _loc_2.length);
            while (_loc_3.indexOf("/") == 0 || _loc_3.indexOf("#") == 0)
            {
                
                _loc_3 = _loc_3.substr(1);
            }
            return _loc_3;
        }// end function

    }
}
