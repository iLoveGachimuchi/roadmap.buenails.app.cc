<?

namespace Controllers;

use Exception;

class Constructor extends \System\Controllers
{

    private $defaultAssetsPath;

    public function __construct()
    {
        parent::__construct();

        $this->defaultAssetsPath = 'assets/templates/html/origin/';
    }

    public function Index()
    {
        $this->responce->setContentType('text');
        return $this->responce->withHtml(new \System\TemplateData('constructor.html', null, $this->defaultAssetsPath));
    }



}
