<?

namespace System;

abstract class Views
{

    protected $responce;

    public function __construct($responce)
    {
        $this->responce = $responce;
    }

    public function sendView($data, $template)
    {

    }
}
