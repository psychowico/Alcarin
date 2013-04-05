<?php

namespace EngineBase\GameObject;

/**
 *
 */
class Time extends \Core\GameObject
{
    use \Core\AutoCacheTrait;

    const DAY_SEC = 345600; //60 * 60 * 96;

    public function fetchTimestamp()
    {
        $time_struct = $this->getServicesContainer()->get('properties')->get('time');
        if($time_struct === null) {
            $time_struct = [
                'last_game_timestamp' => 0,
                'last_real_timestamp' => time(),
                'freeze'              => false,
            ];
            $this->getServicesContainer()->get('properties')->set('time', $time_struct);
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
        $this->getServicesContainer()->get('properties')->set('time', $time_struct);
    }

    public function unfreeze()
    {
        $time_struct = [
            'last_game_timestamp' => $this->timestamp(),
            'last_real_timestamp' => time(),
            'freeze' => false,
        ];
        $this->getServicesContainer()->get('properties')->set('time', $time_struct);
    }

    public function fetchDay()
    {
        //sec * min * {hours in day}
        return floor($this->timestamp() / static::DAY_SEC);
    }

    public function fetchHour()
    {
        return floor( ($this->timestamp() % static::DAY_SEC) / (60 * 60) );
    }

    public function fetchMin()
    {
        return floor( ($this->timestamp() % (60 * 60)) / 60 );
    }

    public function fetchSec()
    {
        return $this->timestamp() % 60;
    }
}