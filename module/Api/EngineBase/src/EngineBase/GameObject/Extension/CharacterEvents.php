<?php

namespace EngineBase\GameObject\Extension;

class CharacterEvents extends \Core\GameObject
{
    protected function init()
    {
        $this->initChildFactory('EngineBase\GameObject\Char\Event');
    }

    public function fetchPlain()
    {
        $char_id = $this->parent()->id();
        return $this->mongo()->{'map.chars.events'}->find(
                ['char' => new \MongoId($char_id)]
            )->fields(['tagid', 'variety', 'args', 'time', 'text'])->toArray();
    }

    public function all()
    {
        $char_id = $this->parent()->id();
        $data = $this->mongo()->{'map.chars.events'}->find(
            ['char' => new \MongoId($char_id)]
        )->toArray();

        return $this->childrenFromArray($data);
    }
}