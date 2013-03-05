<?php

namespace EngineBase\GameObject\Extension;

class MapProperties extends \Core\GameObject
{
    public function radius()
    {
        return $this->get('radius');
    }

    public function find()
    {
        $map_center = $this->mongo()->map->findOne(['loc.x'=> 0, 'loc.y'=> 0], ['properties']);
        return empty($map_center['properties']) ? [] : $map_center['properties'];
    }
    public function get($key)
    {
        $property_path = 'properties.' . $key;

        $value = $this->mongo()->map->findOne([
            'loc.x'=> 0,
            'loc.y'=> 0,
            $property_path => ['$exists'=> true],
        ], [$property_path]);

        return empty($value['properties'][$key]) ? null : $value['properties'][$key];
    }
    public function set($key, $value)
    {
        $property_path = 'properties.' . $key;
        return $this->mongo()->map->update_safe(
            ['loc.x'=> 0, 'loc.y'=> 0],
            ['$set' => [$property_path => $value]],
            ['upsert' => true]
        );
    }
}