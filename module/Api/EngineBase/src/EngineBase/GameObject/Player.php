<?php

namespace EngineBase\GameObject;

class Player extends \Core\GameObject
{
    protected $id   = null;
    protected $data = null;
    protected $current_char = null;

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

    public function lang()
    {
        $data = $this->data();
        return empty($data['lang']) ? 'pl' : $data['lang'];
    }

    public function save($new_data = null)
    {
        if($new_data != null) {
            $this->data = $new_data;
        }
        $this->mongo()->users->updateById($this->id, $this->data);
    }

    public function setCurrentChar($char)
    {
        $char_session = $this->getServicesContainer()->get('char-session');
        $char_session->id = $char->id();
        $char_session->char = $char->toArray();
    }

    public function currentChar()
    {
        if($this->current_char == null) {
            $char_session = $this->getServicesContainer()->get('char-session');
            if(!isset($char_session->char)) {
                throw new Exception('Can not use current char outside setted character scope.');
            }
            $this->current_char = $this->chars()->fromArray($char_session->char);
        }
        return $this->current_char;
    }
}