<?php

namespace EngineBase\GameObject;

use EngineBase\GameObject\Player;

/**
 * main factory to manage users groups, finding users and similar.
 */
class WorldUnitsService
{
    CONST UNITS_PER_METER = 0.01;

    public function fromMeters($meters)
    {
        return $meters * static::UNITS_PER_METER;
    }
}