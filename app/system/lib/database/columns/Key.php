<?

namespace System\Lib\Database\Columns;

class Key extends ColumnData
{
    public function __construct()
    {
        parent::__construct();
        $this->isColumn = false;
    }

    public function setKey($name, $type = '')
    {
        return $this->set($type . ' KEY', strtoupper($name), $name);
    }
}
