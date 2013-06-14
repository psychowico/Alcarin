<?php

namespace EngineBase\GameObject\Extension;

class GameEventBroadcaster extends \Core\GameObject
{
    const TABLE = 'map.chars';
    protected $unitConverter;

    protected function unitConverter()
    {
        if($this->unitConverter == null) {
            $this->unitConverter = $this->getServicesContainer()->get('world-units');
        }
        return $this->unitConverter;
    }

    protected function pushEvent($char_id, $event)
    {
        return $this->mongo()->{static::TABLE}->updateById($char_id,
            ['$push' => ['events' => $event]]
        );
    }

    public function byIds($ids)
    {
        $game_event = $this->parent();

        $text = $game_event->self();
        \Zend\Debug\Debug::dump($text);

        $this->pushEvent($this->currentChar()->id(), $text);

        $text = $game_event->others();
        foreach($ids as $char_id) {
            $this->pushEvent($char_id, $text);
        }
    }

    public function inRadius($meters)
    {
        $loc = $this->currentChar()->loc();
        $radius = $this->unitConverter()->fromMeters($meters);

        $chars_in_radius = $this->mongo()->{static::TABLE}->find([
            'loc' => [
                '$geoWithin'        => [
                    '$center' => [
                        [$loc->x, $loc->y],
                        $radius,
                    ]
                ],
            ],
        ])->fields(['_id'])->toArray();

        $chars_in_radius = $this->mongo()->translArr($chars_in_radius);
        unset($chars_in_radius[$this->currentChar()->id()]);
        $this->byIds(array_keys($chars_in_radius));
    }
}