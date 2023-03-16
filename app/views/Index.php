<?

namespace Views;

class Index extends \System\Views
{

    public function __construct()
    {
        parent::__construct(new \System\Responce('json'));

        $this->responce->useFormatResponce(false);
    }

    public function StickersView($args)
    {
        return $this->responce->withText($args[0]);
    }

}
