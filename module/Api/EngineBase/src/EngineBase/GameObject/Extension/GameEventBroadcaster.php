<?php

namespace EngineBase\GameObject\Extension;

class GameEventBroadcaster extends \Core\GameObject
{
    const CHARS_TABLE  = 'map.chars';
    const EVENTS_TABLE = 'map.chars.events';
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
        if(!empty($event['char']) || !empty($event['time'])) {
            throw new \DomainException('Fields "char" and "time" are reserved in event structure.');
        }
        $timestamp = $this->getServicesContainer()->get('time')->timestamp();
        $event_data = [
            'char' => new \MongoId($char_id),
            'time' => $timestamp,
        ];
        $event_data += $event;

        return $this->mongo()->{static::EVENTS_TABLE}->insert($event_data);
    }

    public function byIds($ids)
    {
        $game_event = $this->parent();
        $current_id = $this->currentChar()->id();

        $event_data = $game_event->serialize('std');
        $this->pushEvent($current_id, $event_data);

        $event_data = $game_event->serialize('others');
        foreach($ids as $char_id) {
            if($current_id === $char_id)continue;
            $this->pushEvent($char_id, $event_data);
        }
    }

    public function inRadius($meters)
    {
        $loc = $this->currentChar()->loc();
        $radius = $this->unitConverter()->fromMeters($meters);

        $chars_in_radius = $this->mongo()->{static::CHARS_TABLE}->find([
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