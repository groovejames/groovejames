package com.grooveshark.utils
{
    import flash.utils.*;

    public class StringUtils extends Object
    {

        public function StringUtils()
        {
            return;
        }// end function

        public static function ucfirst(param1:String) : String
        {
            return param1.substr(0, 1).toUpperCase() + param1.substr(1);
        }// end function

        public static function toBejeebusString(param1:Object, param2:String = "") : String
        {
            var _loc_4:String = null;
            var _loc_8:XML = null;
            var _loc_9:XMLList = null;
            var _loc_3:* = param2 + "[";
            var _loc_5:* = describeType(param1);
            var _loc_6:* = describeType(param1).@name;
            if (describeType(param1).@name.indexOf("::") != -1)
            {
                _loc_6 = _loc_6.substring(_loc_6.indexOf("::") + 2);
            }
            _loc_3 = _loc_3 + (_loc_6 + "]\n");
            var _loc_7:* = _loc_5.descendants("accessor");
            for each (_loc_8 in _loc_7)
            {
                
                _loc_4 = String(param1[_loc_8.@name]);
                _loc_3 = _loc_3 + (param2 + "    " + _loc_8.@name + ":" + _loc_8.@type + "=" + _loc_4 + "\n");
                if (_loc_4 == "[object Object]")
                {
                    _loc_3 = _loc_3 + toStringExpanded(param1[_loc_8.@name], param2 + "    ");
                }
            }
            _loc_9 = _loc_5.descendants("variable");
            for each (_loc_8 in _loc_9)
            {
                
                _loc_4 = String(param1[_loc_8.@name]);
                _loc_3 = _loc_3 + (param2 + "    " + _loc_8.@name + ":" + _loc_8.@type + "=" + _loc_4 + "\n");
                if (_loc_4 == "[object Object]")
                {
                    _loc_3 = _loc_3 + toStringExpanded(param1[_loc_8.@name], param2 + "    ");
                }
            }
            return _loc_3;
        }// end function

        public static function condenseTitle(param1:String) : String
        {
            var _loc_2:* = /[^A-Za-z0-9]+""[^A-Za-z0-9]+/g;
            var _loc_3:* = /\sand\s|\sbut\s|\sor\s|\sthe\s""\sand\s|\sbut\s|\sor\s|\sthe\s/g;
            param1 = param1.toLowerCase();
            param1 = param1.replace(_loc_2, " ");
            param1 = " " + param1 + " ";
            param1 = param1.replace(_loc_3, " ");
            param1 = param1.replace(/\s""\s/g, "");
            return param1;
        }// end function

        public static function ucwords(param1:String) : String
        {
            var _loc_2:* = param1.split(" ");
            var _loc_3:int = 0;
            while (_loc_3 < _loc_2.length)
            {
                
                _loc_2[_loc_3] = StringUtils.ucfirst(_loc_2[_loc_3]);
                _loc_3++;
            }
            return _loc_2.join(" ");
        }// end function

        public static function toStringExpanded(param1:Object, param2:String = "") : String
        {
            var _loc_4:String = null;
            var _loc_7:String = null;
            var _loc_3:* = param2 + "[";
            var _loc_5:* = describeType(param1);
            var _loc_6:* = describeType(param1).@name;
            if (describeType(param1).@name.indexOf("::") != -1)
            {
                _loc_6 = _loc_6.substring(_loc_6.indexOf("::") + 2);
            }
            _loc_3 = _loc_3 + (_loc_6 + "]\n");
            for (_loc_7 in param1)
            {
                
                _loc_4 = String(param1[_loc_7]);
                _loc_3 = _loc_3 + (param2 + "    " + _loc_7 + ": " + _loc_4 + "\n");
                if (_loc_4 === "[object Object]")
                {
                    _loc_3 = _loc_3 + toStringExpanded(param1[_loc_7], param2 + "    ");
                }
            }
            return _loc_3;
        }// end function

        public static function readArrayToString(param1:Array) : String
        {
            var _loc_4:int = 0;
            var _loc_2:* = new String();
            var _loc_3:int = 2;
            while (_loc_3 < param1[0])
            {
                
                _loc_4 = param1[_loc_3];
                if (_loc_4 >= 48 && _loc_4 <= 57)
                {
                    _loc_4 = _loc_4 - param1[0] + 2 - 48;
                    if (_loc_4 < 0)
                    {
                        _loc_4 = _loc_4 + (57 - 48 + 1);
                    }
                    _loc_4 = _loc_4 % (57 - 48 + param1[1] - param1[0] + 2) + 48;
                }
                else if (_loc_4 >= 65 && _loc_4 <= 90)
                {
                    _loc_4 = _loc_4 - param1[0] + 2 - 65;
                    if (_loc_4 < 0)
                    {
                        _loc_4 = _loc_4 + (90 - 65 + 1);
                    }
                    _loc_4 = _loc_4 % (90 - 65 + param1[1] - param1[0] + 2) + 65;
                }
                else if (_loc_4 >= 97 && _loc_4 <= 122)
                {
                    _loc_4 = _loc_4 - param1[0] + 2 - 97;
                    if (_loc_4 < 0)
                    {
                        _loc_4 = _loc_4 + (122 - 97 + 1);
                    }
                    _loc_4 = _loc_4 % (122 - 97 + param1[1] - param1[0] + 2) + 97;
                }
                _loc_2 = _loc_2 + String.fromCharCode(_loc_4);
                _loc_3++;
            }
            return _loc_2;
        }// end function

    }
}
