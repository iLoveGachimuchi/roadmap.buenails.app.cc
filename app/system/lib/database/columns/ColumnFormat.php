<?

namespace System\Lib\Database\Columns;

class ColumnFormat
{
    public $name = "";
    public $type = "";
    public $length = null;
    public $att = null;
    public $isAutoIncr = null;
    public $isNull = null;
    public $value = null;

    public function __construct()
    {
    }

    public function setFormat($name, $type, $length = null, $default = null, $att = null, $isNull = true, $isAutoIncr = false)
    {
        $this->name = $name;
        $this->type = $type;
        $this->length = $length;
        $this->default = $default;
        $this->att = $att;
        $this->isAutoIncr = $isAutoIncr;
        $this->name = $name;

        return $this;
    }

    public function setValue($value)
    {
        return $this->value = $this->valueTypeParse($value);
    }

    private function extractFormat($schemaTable)
    {
    }

    public function getName()
    {
        return $this->columnName;
    }

    public function getFormat()
    {
        return $this->columnFormat;
    }

    public function extract($schemaTable = null)
    {
        if ($schemaTable != null and is_object($schemaTable))
            return $this->extractFormat($schemaTable);

        return $this->columnFormat;
    }

    private function valueTypeParse($value)
    {
        switch ($this->type) {
            case 'int':
            case 'bigint':
                $value = @intval($value);
                break;
            case 'decimal':
                $value = @floatval($value);
                break;
            default:
                break;
        }
        return $value;
    }
}
