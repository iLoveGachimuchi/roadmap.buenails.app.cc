<?

namespace System\Lib\Database;

final class SchemaData
{
    protected $columns;

    public function __construct()
    {
        $this->columns = array();
    }

    public function getColumns()
    {
        return $this->columns;
    }

    public function getColumn($name)
    {
        return $this->fundColumn($name);
    }

    public function updateColumnValue($name, $val)
    {
        $index = $this->fundColumn($name, true);

        if ($index === null or $this->columns[$index]->setVal($val) === null)
            return false;
        
        return $this->columns[$index];
    }



    public function id($name = 'ID', $length = 10, $autoIncrement = false)
    {
        return $this->pushVal($this->setColumn($name, 'int', $length, null, null, false, $autoIncrement));
    }

    public function int($name, $length = 10, $default = null, $isNull = false)
    {
        return $this->pushVal($this->setColumn($name, 'int', $length, $default, null, $isNull));
    }

    public function bigint($name, $length = 14, $default = null, $isNull = false)
    {
        return $this->pushVal($this->setColumn($name, 'int', $length, $default, null, $isNull));
    }

    public function string($name, $length = 60, $default = null, $isNull = false)
    {
        return $this->pushVal($this->setColumn($name, 'varchar', $length, $default, null, $isNull));
    }

    public function text($name, $length = 180, $default = null, $isNull = false)
    {
        return $this->pushVal($this->setColumn($name, 'text', $length, $default, null, $isNull));
    }

    public function float($name, $length = '13,6', $default = null, $isNull = false)
    {
        return $this->pushVal($this->setColumn($name, 'decimal', $length, $default, null, $isNull));
    }

    public function double($name, $length = '36,18', $default = null, $isNull = false)
    {
        return $this->pushVal($this->setColumn($name, 'decimal', $length, $default, null, $isNull));
    }

    public function primaryKey($name)
    {
        return $this->pushVal($this->setKey($name, 'PRIMARY'));
    }

    public function uniqueKey($name)
    {
        return $this->pushVal($this->setKey($name, 'UNIQUE'));
    }

    public function key($name)
    {
        return $this->pushVal($this->setKey($name));
    }



    private function fundColumn($name, $indexOnly = false)
    {
        foreach ($this->getColumns() as $index => &$column) {
            if (!$column->isColumn)
                continue;
            
            if ($column->getName() == $name)
                return ($indexOnly === false ? $column : $index);
        }

        return null;
    }


    private function setColumn($name, $type, $length = null, $default = null, $att = null, $isNull = false, $isAutoIncr = false)
    {
        $column = new Columns\Column();

        return $column->set($name, $type, $length, $default, $att, $isNull, $isAutoIncr);
    }

    private function setKey($name, $type = '')
    {
        $type = (strlen($type) > 0 ? ' ' : '') . $type;
        
        if (!$this->columnExists($name))
            throw new \Exception("Column$type KEY '$name' does not exist", 400);
        if (strlen($type) > 0 and $this->columnExists('PRIMARY'))
            throw new \Exception("Column$type KEY '$name' already exist", 400);

        $key = new Columns\Key();

        return $key->setKey($name, trim($type));
    }

    private function pushVal($column)
    {
        if (!is_object($column))
            throw new \Exception("Column object requaired", 400);

        array_push($this->columns, $column);

        return $this;
    }

    private function columnExists($name)
    {
        return $this->fundColumn($name, true) !== null;
    }
}
