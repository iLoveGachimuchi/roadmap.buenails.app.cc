<?

namespace Views;

class Install extends \System\Views
{

    public function __construct()
    {
        $responce = new \System\Responce('json');
        parent::__construct($responce);
    }

    public function MVC($args)
    {
        $result = array();

        foreach ($args as $k => &$arg) {
            if ($arg === 2)
                $arg = 'file exists and cannot be overwritten';
            elseif ($arg === -1)
                $arg = 'directory is not allowed to write';
            elseif ($arg === false)
                $arg = 'file was not created';
            elseif ($arg === true)
                $arg = 'OK';
            else
                $arg = 'unknown';

            switch ($k) {
                case 0:
                    $result['Controller'] = $arg;
                    break;
                case 1:
                    $result['Model'] = $arg;
                    break;
                case 2:
                    $result['View'] = $arg;
                    break;
            }
        }

        return $this->responce->withJson($result);
    }

    public function OneViewMVC($method, $arg)
    {
        if ($method == 'POST') {
            if ($arg === 2)
                $arg = 'file exists and cannot be overwritten';
            elseif ($arg === -1)
                $arg = 'directory is not allowed to write';
            elseif ($arg === false)
                $arg = 'file was not created';
            elseif ($arg === true)
                $arg = 'OK';
            else
                $arg = 'unknown';
        }
        if ($method == 'DELETE') {
            if ($arg === 2)
                $arg = 'file exists and cannot be overwritten';
            elseif ($arg === -1)
                $arg = 'directory is not allowed to write';
            elseif ($arg === -2)
                $arg = 'directory for deleted files is not allowed to write';
            elseif ($arg === false)
                $arg = 'file was not created';
            elseif ($arg === true)
                $arg = 'OK';
            elseif (is_string($arg))
                $arg = 'OK. Moved to: ' . $arg;
            else
                $arg = 'unknown';
        }
        return $this->responce->withJson($arg);
    }

    public function Route($method, $arg)
    {
        if ($method == 'PUT') {
            if ($arg === 2)
                $arg = 'file exists and cannot be overwritten';
            elseif ($arg === -1)
                $arg = 'directory is not allowed to write';
            elseif ($arg === -3)
                $arg = 'directory is not allowed to write';
            elseif ($arg === false)
                $arg = 'file was not created';
            elseif ($arg === true)
                $arg = 'OK';
            else
                $arg = 'unknown';
        }
        if ($method == 'DELETE') {
            if ($arg === 2)
                $arg = 'file exists and cannot be overwritten';
            elseif ($arg === -1)
                $arg = 'directory is not allowed to write';
            elseif ($arg === -2)
                $arg = 'directory for deleted files is not allowed to write';
            elseif ($arg === false)
                $arg = 'file was not created';
            elseif ($arg === true)
                $arg = 'OK';
            elseif (is_string($arg))
                $arg = 'OK. Moved to: ' . $arg;
            else
                $arg = 'unknown';
        }
        return $this->responce->withJson($arg);
    }
}
