<?

namespace Controllers;

use Exception;

class Index extends \System\Controllers
{

    private $defaultAssetsPath;

    public function __construct()
    {
        parent::__construct();

        $this->defaultAssetsPath = '/assets/frontend/';
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

    

    public function StickersModal($stickerName)
    {
        return $this->sendStickerData('modal/' . $stickerName);
    }

    public function Stickers()
    {
        return $this->sendStickerData('stickers');
    }

    

    private function sendStickerData($stickerName)
    {
        if (strpos($stickerName, '.json') === false)
            $stickerName .= '.json';

        $stickerData = \System\Helper\Files::getFileContent(AssetsDirectory . '/frontend/var/' . $stickerName);

        return $this->setView('Index')->renderView('StickersView', array($stickerData));
    }

}
