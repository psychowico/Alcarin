<?php

namespace Admin\GameObject\Extension\Translation;


/**
 * definitions for "events" and "static" translation tags. so, tranlator can know how many
 * args specific translation tags has etc.
 */
class DynamicTranslationsDefinitions extends \Core\GameObject
{
    const TEXT      = 0;
    const NUMBER    = 1;
    //CHARNAME - visible in way how observer calls arg char.
    const CHARNAME  = 2;
    //PLACENAME - visible in way how observer calls arg place
    const PLACENAME = 3;

    protected $defs = [
        'events' => [
            'public-talk' => [
                'descr'     => 'Talking that can be hear by characters on specific distance - and by staying really close, in part.',
                'args'      => [
                    ['type' => self::TEXT, 'descr' => 'Talking content.'],
                    ['type' => self::CHARNAME, 'descr' => 'Speaking person name.']
                ],
            ],
        ],
        'static' => [
            'man-age' => [
                'descr'     => 'Newly met men characters, before we give him name, does appear in this way.',
            ],
            'time-of-day' => [
                'descr'     => 'Textual representation of specific times of the day.',
            ],
            'no-named-place' => [
                'descr'     => 'Name of place, showing when player not give place any name.',
            ],
            'place-description-name' => [
                'descr'     => 'Description of place, showing when player is "inside" specific place, player naming part.',
                'args'      => [
                    ['type' => self::PLACENAME, 'descr' => 'Named place.'],
                ],
            ],
            'place-description-chars' => [
                'descr'     => 'Description of place, numbers of place inside this zone.',
                'args'      => [
                    ['type' => self::NUMBER, 'descr' => 'Number of chars inside zone.'],
                ],
            ],
            'race' => [
                'descr'     => 'Character races.',
            ],
            'sex' => [
                'descr'     => 'Character sex.',
            ],
        ],
    ];

    public function get($group, $key = null)
    {
        if(empty($this->defs[$group])) return null;
        if($key === null) return $this->defs[$group];

        return empty($this->defs[$group][$key]) ? null : $this->defs[$group][$key];
    }

}
