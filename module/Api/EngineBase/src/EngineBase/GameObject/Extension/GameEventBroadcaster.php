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
        $current_id = $this->currentChar()->id();
        $timestamp = $this->getServicesContainer()->get('time')->timestamp();

        $event_data = $game_event->serialize('std');
        $event_data['time'] = $timestamp;
        $this->pushEvent($current_id, $event_data);

        $event_data = $game_event->serialize('others');
        $event_data['time'] = $timestamp;
        foreach($ids as $char_id) {
            if($current_id === $char_id)continue;
            $this->pushEvent($char_id, $event_data);
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
        $this->byIds(array_keys($chars_in_radius));
    }
}