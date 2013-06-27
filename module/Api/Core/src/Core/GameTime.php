<?php

namespace Core;

/**
 * game-time timestamp wrapper
 */
class GameTime
{
    use \Core\AutoCacheTrait;

    const DAY_SEC = 345600; //60 * 60 * 24 * 4;

    public function __construct($timestamp)
    {
        $this->timestamp = $timestamp;
    }

    public function fetchDay()
    {
        //sec * min * {hours in day}
        return floor($this->timestamp / static::DAY_SEC);
    }

    public function fetchHour()
    {
        return floor( ($this->timestamp % static::DAY_SEC) / (60 * 60) );
    }

    public function fetchMin()
    {
        return floor( ($this->timestamp % (60 * 60)) / 60 );
    }

    public function fetchSec()
    {
        return $this->timestamp % 60;
    }
}