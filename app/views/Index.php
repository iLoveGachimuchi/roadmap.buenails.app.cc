<?

namespace Views;

class Index extends \System\Views
{

    public function __construct()
    {
        $responce = new \System\Responce('json');
        parent::__construct($responce);
    }

    public function HelpView($args)
    {
        // \System\Helper\Debug::varDump($args);
        return $this->responce->withJson($args);
    }

    public function HelpSwitch($args, $module)
    {
        switch (strtolower($module)) {
            case 'translate':
                return $this->responce->withText($args);
            default:
                return $this->responce->withJson($args);
        }
        // \System\Helper\Debug::varDump($args);
    }
}
