<?php

namespace EngineBase\GameObject;

class Player extends \Core\GameObject
{
    protected $id   = null;
    protected $data = null;

    public function __construct($parent, $id, $data = null)
    {
        parent::__construct($parent);
        $this->id   = $id;
        $this->data = $data;
    }

    public function id()
    {
        return $this->id;
    }

    public function data()
    {
        if( $this->data == null ) {
            $this->data = $this->mongo()->users->findById($this->id);
        }

        return $this->data;
    }

    public function save($new_data = null)
    {
        if($new_data != null) {
            $this->data = $new_data;
        }
        $this->mongo()->users->updateById($this->id(), $this->data);
    }
}