<?php

namespace EngineBase\GameObject;

class PlayerExt
{
    protected $player;

    public function __construct($player)
    {
        $this->player = $player;
    }

    public function stop()
    {
        \Zend\Debug\Debug::dump('działa');
        exit;
    }
}