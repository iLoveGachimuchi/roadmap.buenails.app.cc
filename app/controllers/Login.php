<?

namespace Controllers;

use Exception;

class Login extends \System\Controllers
{

    use \System\Traits\Router;

    public function __construct()
    {
        parent::__construct();

        if ($this->request->getContentType() === 'json') {
            $this->responce->setContentType('json');
        }
    }


    public function LoginPage()
    {
        $this->responce->setContentType('text');
        return $this->responce->withHtml(new \System\TemplateData('login.html', array('accessLevel' => $this->auth->getAccessLevel())));
    }

    public function SigninPage()
    {
        $this->responce->setContentType('text');
        return $this->responce->withHtml(new \System\TemplateData('signin.html', array('accessLevel' => $this->auth->getAccessLevel())));
    }


    public function Login()
    {
        $this->request->throwIfValuesNotExist(array('username', 'username'), 'POST');

        $username = $this->request->val('username', 'POST');
        $password = $this->request->val('password', 'POST');
        $remember = $this->request->val('remember', 'POST');

        if (!$this->auth->newAccess($username, $password, $remember)) {
            return $this->responce->withHtml(
                new \System\TemplateData(
                    'login.html',
                    array(
                        'accessLevel' => $this->auth->getAccessLevel(),
                        'error' => 'User not found'
                    )
                )
            );
        }

        return $this->afterLogin();
    }

    public function Signin()
    {
        $this->request->throwIfValuesNotExist(array('username', 'username'), 'POST');

        $username = $this->request->val('username', 'POST');
        $password = $this->request->val('password', 'POST');

        try {
            $this->auth->createUser($username, $password, 1);
        } catch (Exception $ex) {
            return $this->responce->withHtml(
                new \System\TemplateData(
                    'signin.html',
                    array(
                        'accessLevel' => $this->auth->getAccessLevel(),
                        'error' => $ex->getMessage()
                    )
                )
            );
        }

        return $this->afterLogin();
    }

    public function Signout()
    {
        $this->auth->signout();

        $router = $this->getRouter();
        return $this->responce->redirectTo($router->handlerToLink('Controllers\Login@LoginPage'));
    }


    private function afterLogin()
    {
        if ($this->session->get('after_login')) {
            $router = $this->getRouter();

            $redirect = $router->handlerToLink($this->session->get('after_login'));

            $this->session->delete('after_login');

            return $this->responce->redirectTo($redirect);
        }
    }
}
