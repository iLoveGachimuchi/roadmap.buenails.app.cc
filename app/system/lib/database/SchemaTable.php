<?

namespace System\Lib\Database;

class SchemaTable
{

    // protected $tableVariables;
    protected $tableName;
    protected $schemaData;

    public function __construct($tableName, $callSchemaData)
    {
        $this->setSchemeData($tableName, $callSchemaData);
    }

    public function __get($name)
    {
        return $this->$name;
    }

    public function getValue($var)
    {
        return $this->getColumn($var)->getValue();
    }

    public function setValue($var, $val)
    {
        return $this->schemaData->updateColumnValue($var, $val);
    }

    public function getColumn($name)
    {
        return $this->schemaData->getColumn($name);
    }

    public function setColumn($name)
    {

    }



    private function setSchemeData($tableName, $callSchemaData)
    {
        $this->tableName = $tableName;
        $this->schemaData = $callSchemaData(new SchemaData());
    }

}