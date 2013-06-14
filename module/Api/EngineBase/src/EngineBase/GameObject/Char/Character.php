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

    public function loc()
    {
        return (object)$this->source_data['loc'];
    }

    public function toArray()
    {
        return $this->source_data;
    }
}