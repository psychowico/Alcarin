<?php

namespace EngineBase\GameObject\Char;

use EngineBase\GameObject\GameEvent\SqueezableInterface;

class Character extends \Core\GameObject
                implements SqueezableInterface
{
    protected $source_data;
    const MAX_AGE = 140; // max game time days that character can live

    public function __construct($source_data = null)
    {
        $this->source_data = $source_data;
    }

    public function id()
    {
        return $this->source_data['id'];
    }

    /**
     * name that was given to character by his player.
     */
    public function name()
    {
        return $this->source_data['name'];
    }

    /**
     * text representation of character age
     */
    public function ageName()
    {
        $current_age = $this->age();
        $defs        = $this->getServicesContainer()->get('translations-defs');
        $options     = $defs->get('static', 'man-age')['defaults'];
        $max   = count($options) - 1;
        $index = min(round($max * $current_age / self::MAX_AGE), $max);
        return array_values($options)[$index];
    }

    /**
     * name that others players will see
     */
    public function displayname()
    {
        # code...
    }


    public function squeeze()
    {
        return [
            'type' => 'char',
            'id' => $this->id(),
        ];
    }

    /**
     * character age in days.
     */
    public function age()
    {
        $born = empty($this->source_data['born']) ? 0 : $this->source_data['born'];
        $diff = $this->time()->timestamp() - $born;
        $game_time = new \Core\GameTime($diff);
        return $game_time->day();
    }

    public function loc()
    {
        return (object)$this->source_data['loc'];
    }

    public function toArray()
    {
        return $this->source_data;
    }
}