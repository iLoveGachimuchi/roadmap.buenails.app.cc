<?

namespace Models\Help;

final class HelpRouting
{

    private $routes = '';


    public function __construct()
    {
        $this->routes = require AssetsDirectory . '/data/routes.php';
    }

    public function __invoke($e)
    {
        return $this->extractRoutingView();
    }


    private function extractRoutingView()
    {
        $router = new \System\Router();
        $router->add($this->routes);

        $routes = array();

        foreach($router->getRoutes() as $route => $methods) {
            if (!is_array($methods)) {
                $routes[$route] = '*';
                continue;
            }

            $routes[$route] = implode('|', array_keys($methods));
        }
        return $routes;
    }
}
