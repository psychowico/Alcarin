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
        $this->id = $game_event_id;
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
     * resolve game event argument to text or hyperlink representation
     */
    protected function resolveArg($arg)
    {
        //to do
        return strval($arg);
    }

    public function id()
    {
        return $this->id;
    }

    protected function content($variety)
    {
        $text = $this->getServicesContainer()->get('translations')
             ->translation('events', $this->id, $this->lang())->val($variety);
        $_args = $this->args();
        for($i = 0; $i < count($_args); $i++) {
            $arg = $this->resolveArg($_args[$i]);
            $text = str_replace('%' . $i, $arg, $text);
        }
        return $text;
    }

    public function self()
    {
        return $this->content('std');
    }

    public function others()
    {
        return $this->content('others');
    }

    public function init()
    {
    }
}