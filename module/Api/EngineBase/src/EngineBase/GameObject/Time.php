<?php

namespace EngineBase\GameObject;

/**
 *
 */
class Time extends \Core\GameObject
{
    use \Core\AutoCacheTrait;

    const DAY_SEC = 345600; //60 * 60 * 24 * 4;

    protected function properties()
    {
        return $this->getServicesContainer()->get('properties');
    }

    protected function fetchGameTime()
    {
        return new \Core\GameTime($this->timestamp());
    }

    public function fetchTimestamp()
    {
        $time_struct = $this->properties()->get('time');
        if($time_struct === null) {
            $time_struct = [
                'last_game_timestamp' => 0,
                'last_real_timestamp' => time(),
                'freeze'              => false,
            ];
            $this->properties()->set('time', $time_struct);
        }
        $real = $time_struct['last_real_timestamp'];
        $time = $time_struct['last_game_timestamp'];

        if(empty($time_struct['freeze'])) {
            $time += (time() - $real);
        }

        return $time;
    }

    public function freeze()
    {
        $time_struct = [
            'last_game_timestamp' => $this->timestamp(),
            'last_real_timestamp' => time(),
            'freeze' => true,
        ];
        $this->properties()->set('time', $time_struct);
        $this->reset_cache('isFreezed');
    }

    public function unfreeze()
    {
        $time_struct = [
            'last_game_timestamp' => $this->timestamp(),
            'last_real_timestamp' => time(),
            'freeze' => false,
        ];
        $this->properties()->set('time', $time_struct);
        $this->reset_cache('isFreezed');
    }

    public function fetchIsFreezed()
    {
        $time_struct = $this->properties()->get('time');
        return !empty($time_struct['freeze']);
    }

    public function day()
    {
        return $this->gameTime()->day();
    }

    public function hour()
    {
        return $this->gameTime()->hour();
    }

    public function min()
    {
        return $this->gameTime()->min();
    }

    public function sec()
    {
        return $this->gameTime()->sec();
    }
}