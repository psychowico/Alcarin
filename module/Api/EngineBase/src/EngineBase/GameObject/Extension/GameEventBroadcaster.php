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
        if(!empty($event['char'])) {
            throw new \DomainException('Fields "char" and "time" are reserved in event structure.');
        }
        $event_data = [
            'char' => new \MongoId($char_id),
        ];
        $event_data += $event;

        #pushing to database
        return $this->mongo()->{static::EVENTS_TABLE}->insert($event_data);
    }

    protected function sendToAlcarinCacher($sender_id, $target_ids,
                                            $sender_struct, $others_struct)
    {
        $bridge = $this->getServicesContainer()->get('alcarin-cacher');
        $bridge->connect();

        $bridge->sendEvent($sender_id, $sender_struct);
        $bridge->sendEvent($target_ids, $others_struct);

        $bridge->disconnect();
    }

    public function byIds($ids)
    {
        $game_event = $this->parent();
        $current_id = $this->currentChar()->id();

        $ids = array_flip($ids);
        unset($ids[$current_id]);
        $ids = array_keys($ids);

        $timestamp = $this->getServicesContainer()->get('time')->timestamp();

        $owner_event_data = $game_event->squeeze('std');
        $owner_event_data['time'] = $timestamp;

        $this->pushEvent($current_id, $owner_event_data);

        $event_data = $game_event->squeeze('others');
        $event_data['time']  = $timestamp;

        foreach($ids as $char_id) {
            $this->pushEvent($char_id, $event_data);
        }

        $this->sendToAlcarinCacher($current_id, $ids, $owner_event_data, $event_data);
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