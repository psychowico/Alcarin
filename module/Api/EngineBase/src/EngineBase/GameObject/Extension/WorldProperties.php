<?php

namespace EngineBase\GameObject\Extension;

class WorldProperties extends \Core\GameObject
{
    const DEFAULT_RADIUS = 150000;

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

        $result = empty($value['properties'][$key]) ? null : $value['properties'][$key];
        if($key == 'radius' && $result == null) {
            return static::DEFAULT_RADIUS;
        }
        return $result;
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

    public function __invoke($key = null, $value = null)
    {
        if($key == null) return $this;
        if($value == null) return $this->get($key);
        $this->set($key, $value);
    }
}