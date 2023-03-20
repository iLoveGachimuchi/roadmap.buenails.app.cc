<?

namespace System\Utils;

class Password
{
    public static function hash($password)
    {
        $config = new \System\Config();
        if (isset($config['salt']))
            $password .= $config['salt'];
            
        return sha1($password);
    }

    public static function uniqueHash($key)
    {
        $config = new \System\Config();
        if (isset($config['salt']))
            $key .= $config['salt'];

        return sha1($key . TimeWorker::timeToStamp());
    }
}