<?php

namespace EngineBase\GameObject\Char;

class Event extends \Core\GameObject
{
    protected $source_data;

    public function __construct($source_data = null)
    {
        $this->source_data = $source_data;
    }

    public function time()
    {
        return $this->source_data['time'];
    }
}