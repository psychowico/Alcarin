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
        $this->args = $this->squeezeArgs($args);
    }

    /**
     * iterate arguments, simple arguments (string, numbers) cast to text,
     * for object return "squeeze()" function value
     */
    protected function squeezeArgs($_args)
    {
        $args = [];
        foreach($_args as $arg) {
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
        return $args;
    }

    /**
     * serialize event in specific language in database store form
     */
    public function squeeze($variety = 'std', $lang = 'pl')
    {
        return [
            'tagid'   => $this->id,
            'variety' => $variety,
            'args'    => $this->args,
        ];
    }

    public function id()
    {
        return $this->id;
    }
}