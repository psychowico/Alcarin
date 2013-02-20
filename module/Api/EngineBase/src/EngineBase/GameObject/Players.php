<?php

namespace EngineBase\GameObject;

use EngineBase\GameObject\Player;

/**
 * main factory to manage users groups, finding users and similar.
 */
class Players extends \Core\GameObject
{
    protected $current;
    protected $players = [];

    public function current()
    {
        if($this->current == null) {
            $auth = $this->getServicesContainer()->get('zfcuser_auth_service');
            if(!$auth->hasIdentity()) return null;

            $logged = $auth->getIdentity()->getArrayCopy();
            $this->current = $this->createPlayer($logged);
        }
        return $this->current;
    }

    public function get($playerid)
    {
        return $this->createPlayer($playerid);
    }

    protected function createPlayer($data_or_id)
    {
        $id   = $data_or_id;
        $data = null;
        if( is_array($data_or_id) ) {
            $id   = $data_or_id['_id'];
            $data = $data_or_id;
        }
        if(isset($this->players[$id])) return $this->players[$id];

        $player = new Player($this, $id, $data);
        $player->setServicesContainer($this->getServicesContainer());
        return $player;
    }

}