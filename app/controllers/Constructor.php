<?

namespace Controllers;

use Exception;

class Constructor extends \System\Controllers
{

    use \System\Traits\Router;

    private $defaultAssetsPath;

    public function __construct()
    {
        parent::__construct();

        $this->defaultAssetsPath = 'assets/templates/html/origin/';
    }

    public function Index()
    {
        if (!$this->auth->isAccess(1)) {
            $router = $this->getRouter();

            $this->session->set('after_login', 'Controllers\Constructor@Index');

            return $this->responce->redirectTo($router->handlerToLink('Controllers\Login@LoginPage'));
        }

        $this->responce->setContentType('text');
        return $this->responce->withHtml(new \System\TemplateData('constructor.html', null, $this->defaultAssetsPath));
    }



}
