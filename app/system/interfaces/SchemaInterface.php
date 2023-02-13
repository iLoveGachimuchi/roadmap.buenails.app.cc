<?php

namespace System\Interfaces;

interface SchemaInterface {

    public function __set($var, $val);

    public function __get($var);

    public function setScheme($schemaTable);

    public function load();

    public function select();

    public function update();

    public function insert();

    public function delete();
}
