<?php

namespace EngineBase\GameObject\GameEvent;

use EngineBase\GameObject\GameEvents\GameEvent;

/**
 * service that can generate gameevents objects
 */
class GameEventsService extends \Core\GameObject
{
    public function init()
    {
        $this->initChildFactory('EngineBase\GameObject\GameEvent\GameEvent');
    }

    /**
     * generate new GameEvent object, $game_event_id is exacly equal to translations 'tagid'.
     */
    public function generate($game_event_id)
    {
        $args = array_slice(func_get_args(), 1);
        return $this->createChild($game_event_id, $args);
    }
}