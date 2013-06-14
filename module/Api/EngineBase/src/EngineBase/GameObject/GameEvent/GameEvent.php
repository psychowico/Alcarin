<?php

namespace EngineBase\GameObject\GameEvent;

class GameEvent extends \Core\GameObject
{
    // use \Core\AutoCacheTrait;

    protected $id;
    protected $args;

    public function __construct($game_event_id, $args)
    {
        $this->id = $game_event_id;
        $this->args = $args;
    }

    public function id()
    {
        return $this->id;
    }

    protected function fetchArgs()
    {
        $args = [];
        foreach($this->args as $arg) {
            $args []= is_object($arg) ? $arg->toString() : strval($arg);
        }
        return $args;
    }


    public function init()
    {
        // \Zend\Debug\Debug::dump($this->args());

    }
}