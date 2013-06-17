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
        $data = $this->mongo()->{'map.chars'}->findById($char_id, ['events' => 1]);

        if(!empty($data['events'])){
            return $this->childrenFromArray($data['events']);
        }
        else {
            return [];
        }

    }
}