<?

namespace Views;

class Index extends \System\Views
{

    public function __construct()
    {
        $responce = new \System\Responce('json');
        parent::__construct($responce);
    }

    public function StickersView($args)
    {
        return $this->responce->setContentType('json')->withText($args);
    }

}
