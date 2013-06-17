<?php

namespace EngineBase\GameObject\GameEvent;

use EngineBase\GameObject\GameEvent\SqueezableInterface;

class GameEvent extends \Core\GameObject
{
    protected $id;
    protected $args;

    protected $resolved_args;

    public function __construct($game_event_id, $args)
    {
        $this->id   = $game_event_id;
        $this->args = $args;
    }

    protected function args()
    {
        if($this->resolved_args !== null) return $this->resolved_args;

        $args = [];
        foreach($this->args as $arg) {
            if(is_object($arg)) {
                if(!$arg instanceof SqueezableInterface) {
                    throw new \InvalidArgumentException('All gameevent arguments must provide SqueezableInterface or be non-object.');
                }
                $args []= $arg->squeeze();
            }
            else {
                $args []= strval($arg);
            }
        }
        $this->resolved_args = $args;
        return $args;
    }

    /**
     * return tag event text for this gameevent
     */
    protected function tagContent($variety)
    {
        return $this->getServicesContainer()->get('translations')
             ->translation('events', $this->id, $this->lang())->val($variety);
    }

    public function id()
    {
        return $this->id;
    }

    public function init()
    {
    }

    public function serialize($variety = 'std')
    {
        $result = [];
        $text = $this->tagContent($variety);
        if(!empty($text)) {
            $result['text'] = $text;
        }
        $args = $this->args();
        if(!empty($args)) {
            $result['args'] = $args;
        }

        return $result;
    }
}