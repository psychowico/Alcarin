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

        $chars = $this->mongo()->{'users.chars'}->find([
            '_id' => [ '$in' => $data['chars'] ]
        ])->fields(['name' => 1]);

        return $this->childrenFromArray($chars->toArray());
    }

    /**
     * create simple test char
     */
    public function create($name)
    {
        $player = $this->parent()->id();

        $data = ['owner'=> new \MongoId($player), 'name'=> $name];
        $this->mongo()->{'users.chars'}->insert($data);

        $char_id = $data['_id'];
        $this->mongo()->users->update( ['_id' => new \MongoId($player)],
            ['$push' => ['chars' => $char_id]]);
    }
}