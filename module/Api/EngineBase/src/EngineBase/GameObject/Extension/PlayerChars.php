<?php

namespace EngineBase\GameObject\Extension;

class PlayerChars extends \Core\GameObject
{
    use \Core\AutoCacheTrait;

    protected function init()
    {
        $this->initChildFactory('EngineBase\GameObject\Char\Character');
    }

    public function fetchAll()
    {
        $data = $this->mongo()->users->findOne(
            ['_id' => new \MongoId($this->parent()->id())],
            ['chars'=> 1]
        );

        if(empty($data['chars'])) return [];

        $chars = $this->mongo()->{'map.chars'}->find([
            '_id' => [ '$in' => $data['chars'] ]
        ])->fields(['name' => 1]);

        return $this->childrenFromArray($chars->toArray());
    }

    public function fromArray($data)
    {
        return $this->createChild($data);
    }

    /**
     * create simple test char
     */
    public function create($name)
    {
        $player = $this->parent()->id();

        //player only data for fast displaying
        $data = [
            'owner'=> new \MongoId($player),
            'name'=> $name,
            'loc' => ['x' => 0, 'y' => 0],
        ];
        $this->mongo()->{'map.chars'}->insert($data);

        //real-player in world

        $char_id = $data['_id'];
        $this->mongo()->users->update( ['_id' => new \MongoId($player)],
            ['$push' => ['chars' => $char_id]]);

        return $this->createChild($data);
    }
}