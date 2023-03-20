<?

namespace Models;

use \Exception;

final class Auth
{

    protected $session;
    protected $cookie;
    protected $access;
    protected $accessLevel;
    protected $connection;
    protected $user;
    protected $defaultLength;

    public function __construct()
    {
        $this->session = new \System\Session();
        $this->cookie = new \System\Cookie();

        $this->connection = new \System\Connection();
        $this->user = null;


        $this->defaultLength = 2592000;
    }

    public function newAccess($login, $password, $remember = null)
    {
        $user = new User(0, $this->connection);

        $clientId = $user->findUser($login, $password);

        if (!$clientId)
            return false;

        $this->loginUser($clientId, $remember);

        return true;
    }

    public function createUser($login, $password)
    {
        $user = new User(0, $this->connection);

        $clientId = $user->newUser($login, $password, 1);

        if (!$clientId)
            return false;

        $this->loginUser($clientId);
    }

    public function signout()
    {
        $this->session->set('clientId', 0);
        $this->getClientData();
        $this->removeRememberConnect();
    }

    public function setAccessLevel($level)
    {
        $this->userLoaded();

        if (!$this->isAccess($level))
            throw new Exception('Authentication required', 403);
    }

    public function isAccess($level)
    {
        $this->userLoaded();

        return ($this->accessLevel >= $level);
    }

    public function getAccessLevel()
    {
        $this->userLoaded();

        return $this->accessLevel;
    }




    private function userLoaded()
    {
        if ($this->user === null) {
            if ($this->session->get('clientId'))
                $this->getClientData();
            else if (!$this->rememberUser())
                $this->getClientData();
        }
    }

    private function getClientData()
    {
        $this->user = new User($this->session->get('clientId'), $this->connection);
        $this->user->loadUser(true);
        $this->accessLevel = $this->user->accessLevel();
    }

    private function rememberUser()
    {
        if (!$this->cookie->get('clientId'))
            return false;

        $qr = $this->connection->fetch1Row($this->connection->select('Auth', '*', 'aKey=?', array($this->cookie->get('clientId')), 'aID DESC'));

        if (\System\Utils\TimeWorker::stampToTime($qr['aETS']) < time())
            return $this->removeRememberConnect();

        $this->loginUser($qr['auID']);

        return true;
    }

    private function removeRememberConnect($destroy = false)
    {
        if (!$this->cookie->get('clientId'))
            return;

        $this->connection->update(
            'Auth',
            array('aState' => 2, 'aITS' => \System\Utils\TimeWorker::timeToStamp()),
            '',
            'aKey=?',
            array($this->cookie->get('clientId'))
        );

        if ($destroy === true)
            $this->cookie->destroy('clientId');
        else
            $this->cookie->remove('clientId');
    }

    private function loginUser($clientId, $createCookie = null)
    {
        $this->session->set('clientId', $clientId);

        if ($createCookie) {
            $akey = \System\Utils\Password::uniqueHash($clientId);

            $this->cookie->set('clientId', $akey, $this->defaultLength);
            $this->connection->insert('Auth', array(
                'auID' => $clientId,
                'aKey' => $akey,
                'aCTS' => \System\Utils\TimeWorker::timeToStamp(time()),
                'aETS' => \System\Utils\TimeWorker::timeToStamp(time() + $this->defaultLength),
            ));
        }


        $this->getClientData();
    }
}
