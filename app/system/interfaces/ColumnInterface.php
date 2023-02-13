<?php

namespace System\Interfaces;

interface ColumnInterface {

    public function set($name, $type, $length = null, $default = null, $att = null, $isNull = false, $isAutoIncr = false);

    public function getName();

    public function getFormat();

    public function extract();

    // public function __get($name);
}
