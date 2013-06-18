<?php

namespace EngineBase\GameObject\Extension;

class CharacterEvents extends \Core\GameObject
{
    protected function init()
    {
        $this->initChildFactory('EngineBase\GameObject\Char\Event');
    }

    public function all()
    {
        $char_id = $this->parent()->id();
        $data = $this->mongo()->{'map.chars.events'}->find(
            ['char' => new \MongoId($char_id)]
        )->sort_desc('time')->toArray();

        return $this->childrenFromArray($data);
    }
}