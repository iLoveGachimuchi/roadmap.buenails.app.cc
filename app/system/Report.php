<?

namespace System;

use Exception;

class Report
{
    protected $reportModule = '';
    protected $reportFile = '';
    protected $reportData = array();

    public function __construct($module = null)
    {
        $this->setModuleReport($module ? $module : 'reporter');
        $this->reportFile = AppDirectory . '/report/report-' . $this->reportModule . '.json';
        $this->reportData = $this->getdata();
    }

    public function __invoke($module)
    {
        $this->setModuleReport($module);
        return $this;
    }

    public function setdata($data)
    {
        if (($newReportRow = $this->reportDateLine()) != '')
            $this->reportData[] = $newReportRow;

        foreach ($data as $v) {
            $this->reportData[] = $v;
        }
    }

    public function commit()
    {
        $this->reportFileCheck();
        
        file_put_contents($this->reportFile, json_encode($this->reportData));
    }

    protected function setModuleReport($module)
    {
        $this->reportModule = $module;
    }

    protected function reportDateLine($timeRangeLength = 10)
    {
        clearstatcache();

        $timeRange = abs(time() - (file_exists($this->reportFile) ? @filemtime($this->reportFile) : 0));

        if ($timeRangeLength <= $timeRange)
            return "- - - - - [" . gmdate("d.m.y H:i:s") . ($timeRange <= 120 ? " +" . $timeRange : "") . "] - - - - -\n";

        return '';
    }

    protected function reportFileCheck()
    {
        if (!$this->reportFile)
            throw new Exception("Report file is not setted");

        return true;
    }

    private function getdata()
    {
        $this->reportFileCheck();

        $tdata = @json_decode(file_get_contents($this->reportFile));

        if (!$tdata)
            return array();

        return $tdata;
    }
}
