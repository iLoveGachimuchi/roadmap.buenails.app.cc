<?

namespace System\Utils;


class StringUtils
{

    public static function strTrim(&$s)
    {
        if (!is_array($s))
            $s = trim($s);
        else
            foreach ($s as $i => $v)
                StringUtils::strTrim($s[$i]);
    }

    public static function htmlChars($s)
    {

        if (!is_array($s))
            $s = htmlspecialchars($s);
        else
            foreach ($s as $i => $v)
                $s[$i] = StringUtils::htmlChars($s[$i]);
        return $s;
    }
}
