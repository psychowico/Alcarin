<?php

namespace EngineBase\GameObject\Extension;

class GameEventBroadcaster extends \Core\GameObject
{
    const TABLE = 'map.chars';

    public function inRadius($meters)
    {

        // $test = $this->mongo()->{static::TABLE}->find([])
        //     ->fields(['_id'])->toArray();
        // \Zend\Debug\Debug::dump($test);

    }
}