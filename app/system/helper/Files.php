<?

namespace System\Helper;

class Files
{
    public static function isWritable_r($dir)
    {
        if (is_dir($dir)) {
            if (is_writable($dir)) {
                $objects = scandir($dir);
                foreach ($objects as $object) {
                    if ($object != "." && $object != "..") {
                        if (!\System\Helper\Files::isWritable_r($dir . "/" . $object)) return false;
                        else continue;
                    }
                }
                return true;
            } else {
                return false;
            }
        } else if (file_exists($dir)) {
            return (is_writable($dir));
        }
    }

    public static function fileRewrite($filePath, $content)
    {
        $fp = fopen($filePath, 'w+');
        fwrite($fp, $content);
        fclose($fp);
        chmod($filePath, 0777);
        clearstatcache();
    }
}
