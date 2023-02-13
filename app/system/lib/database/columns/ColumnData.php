<?

namespace System\Lib\Database\Columns;

class ColumnData implements \System\Interfaces\ColumnInterface
{
    public $columnVar;
    public $isColumn;
    protected $columnFormat;

    public function __construct()
    {
        $this->isColumn = true;
        $this->columnVar = null;
        $this->columnFormat = new ColumnFormat;
    }

    public function set($name, $type, $length = null, $default = null, $att = null, $isNull = false, $isAutoIncr = false)
    {
        $this->columnFormat->setFormat($name, $type, $length, $default, $att, $isNull, $isAutoIncr);

        return $this;
    }

    public function getValue()
    {
        return $this->columnFormat->value;
    }

    public function getType()
    {
        return $this->columnFormat->type;
    }
    
    public function setVal($val)
    {
        if (!$this->columnFormat or !$this->isColumn)
            return null;
            
        $this->valueTypeControll($val);
        
        return $this->columnFormat->setValue($val);
    }

    public function getName()
    {
        return $this->columnFormat->name;
    }

    public function getFormat()
    {
        return $this->columnFormat;
    }

    public function extract()
    {
        return $this->columnFormat->extract();
    }

    private function valueTypeControll($val)
    {
        // throw new \TypeError ("Unexpected variable type", 400);
    }
}
