<?

namespace Controllers;


class Index extends \System\Controllers
{

    private $defaultAssetsPath;

    public function __construct()
    {
        parent::__construct();

        $this->defaultAssetsPath = "/assets/frontend/";
    }

    public function Home()
    {
        $this->responce->setContentType('text');
        return $this->responce->withHtml(new \System\TemplateData('roadmap.html'));
    }


    public function Prototypes()
    {
        $this->responce->setContentType('text');
        return $this->responce->withHtml(new \System\TemplateData('prototypes.html'));
    }
}
