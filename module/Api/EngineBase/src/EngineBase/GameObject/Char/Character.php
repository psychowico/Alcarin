<?php

namespace EngineBase\GameObject\Char;

class Character extends \Core\GameObject
{
    protected $source_data;

    public function __construct($source_data = null)
    {
        $this->source_data = $source_data;
    }

    public function name()
    {
        return $this->source_data['name'];
    }

    public function id()
    {
        return $this->source_data['id'];
    }
}