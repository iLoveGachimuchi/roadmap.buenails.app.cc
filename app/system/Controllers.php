<?

namespace System;

use Exception;

abstract class Controllers
{

    protected $validator;
    protected $request;
    protected $responce;
    protected $session;
    protected $cache;
    protected $cookie;

    protected $view = null;

    public function __construct()
    {
        $this->request = new Request;
        $this->responce = new Responce();
        $this->session = new Session;
    }



    protected function setView($viewMethodName, $args = array())
    {
        $this->installMethodNamespace($viewMethodName, 'Views\\');
        $this->view = Helper\Methods::installMethod($viewMethodName, $args);

        return $this;
    }

    protected function renderView($action, $params = array())
    {
        if (!$this->view)
            throw new \RuntimeException(
                'Controller View was not installed'
            );

        return Helper\Methods::callMethod($this->view, $action, $params);
    }

    protected function callModel($modelMethodName, $args = array())
    {
        $this->installMethodNamespace($modelMethodName, 'Models\\');
        return Helper\Methods::installMethod($modelMethodName, $args);
    }

    protected function callModelMethod($model, $modelMethodName, $args = array())
    {
        return Helper\Methods::callMethod($model, $modelMethodName, $args);
    }

    protected function requestMethodToOperName($methodCallName)
    {
        return $this->getOperNameByRequestMethod() . $methodCallName;
    }

    protected function getOperNameByRequestMethod()
    {
        $methodName = null;
        if ($this->request->getRequestMethod() == 'GET')
            $methodName = 'get';
        elseif ($this->request->getRequestMethod() == 'POST')
            $methodName = 'create';
        elseif ($this->request->getRequestMethod() == 'DELETE')
            $methodName = 'delete';
        elseif ($this->request->getRequestMethod() == 'PUT')
            $methodName = 'update';

        return $methodName;
    }

    private function installMethodNamespace(&$methodName, $namespace)
    {
        if (strpos($methodName, $namespace) === false)
            $methodName = $namespace . $methodName;
    }
    
}
