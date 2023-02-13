<?

namespace System\Lib\Database;

class SchemaWorker implements \System\Interfaces\SchemaInterface
{

    private $schemaFileName;

    private $schemaName;
    private $schemaTable;

    public function __construct()
    {
        $this->schemaFileName = '';
        
        $this->schemaName = '';
        // $this->schemaTable = null;
    }

    public function setScheme($schemaTableName)
    {
        $this->schemaFileName = $schemaTableName;

        $this->schemaTable = @require(AssetsDirectory . '/data/schemas/' . $this->schemaFileName . '.php');
        
        $this->schemaCheck();

        $this->schemaName = $this->schemaTable->tableName;
    }

    public function getName()
    {
        return $this->schemaName;
    }

    public function getScheme()
    {
        return $this->schemaTable;
    }

    public function val($var, $val = null)
    {
        if ($val !== null)
            return $this->setVal($var, $val);
            
        $this->schemaCheck();

        return $this->schemaTable->getValue($var);
    }

    public function setVal($var, $val)
    {
        $this->schemaCheck();

        return $this->schemaTable->setValue($var, $val);
    }

    public function load()
    {

    }

    public function select() { }
    public function update() { }
    public function delete() { }
    public function insert() { }

    public function __get($var)
    {
        
    }

    public function __set($var, $val)
    {
        
    }


    private function schemaCheck()
    {
        if (!$this->schemaTable)
            throw new \RuntimeException("Schema $this->schemaFileName not found", 500);
    }
}