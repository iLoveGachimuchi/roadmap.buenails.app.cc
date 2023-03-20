<?php

namespace System\Traits;

trait Router
{

    public function getRouter()
    {
        $routes = require AssetsDirectory . '/data/routes.php';
        $router = new \System\Router();
        $router->add($routes);

        return $router;
    }

}
