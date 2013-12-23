<?php

namespace EngineBase\GameObject\Extension;

class PlayerChars extends \Core\GameObject
{
    use \Core\AutoCacheTrait;

    protected function init()
    {
        $this->initChildFactory('EngineBase\GameObject\Char\Character');
    }

    public function fetchNames()
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

    /**
     * check that character with specific id is related with this user.
     */
    public function belong($charid)
    {
        $player_id = new \MongoId($this->parent()->id());
        $count = $this->mongo()->{'map.chars'}->count([
            '_id' => new \MongoId($charid),
            'owner' => $player_id,
        ]);
        return $count > 0;
    }

    public function get($id)
    {
        $player_id = new \MongoId($this->parent()->id());
        $char = $this->mongo()->{'map.chars'}->findOne([
            '_id' => new \MongoId($id),
            'owner' => $player_id,
        ]);
        $this->mongo()->transl($char);

        return $this->createChild($char);
    }

    public function fromArray($data)
    {
        return $this->createChild($data);
    }

    /**
     * create new character
     */
    public function create($name, $options)
    {
        $player = $this->parent();

        //char only data for fast displaying
        $data = [
            'owner' => new \MongoId($player->id()),
            'name'  => $name,
            'loc'   => ['x' => 0, 'y' => 0],
            'lang'  => $player->lang(),
            'options' => $options
        ];
        $this->mongo()->{'map.chars'}->insert($data);

        //link real-char in world
        $char_id = $data['_id'];
        $this->mongo()->users->update( ['_id' => new \MongoId($player->id())],
            ['$push' => ['chars' => $char_id]]);

        return $this->createChild($data);
    }
}
