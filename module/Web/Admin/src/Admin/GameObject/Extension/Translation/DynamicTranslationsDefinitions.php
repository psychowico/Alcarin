<?php

namespace Admin\GameObject\Extension\Translation;


/**
 * definitions for "events" and "static" translation tags. so, tranlator can know how many
 * args specific translation tags has etc.
 */
class DynamicTranslationsDefinitions extends \Core\GameObject
{
    const TEXT   = 0;
    //CHARNAME - visible in way how observer calls arg char.
    const CHARNAME   = 1;

    protected $defs = [
        'events' => [
            'public-talk' => [
                'descr'     => 'Talking that can be hear by characters on specific distance - and by staying really close, in part.',
                'args'      => [
                    ['type' => DynamicTranslationsDefinitions::TEXT, 'descr' => 'Talking content.'],
                    ['type' => DynamicTranslationsDefinitions::CHARNAME, 'descr' => 'Speaking person name.']
                ],
                'defaults'  => [
                    'self'   => 'You say: %0',
                    'others' => '%1 says: %0',
                ],
            ],
        ],
        'static' => [
        ],
    ];

    public function get($group, $key = null)
    {
        if(empty($this->defs[$group])) return null;
        if($key === null) return $this->defs[$group];

        return empty($this->defs[$group][$key]) ? null : $this->defs[$group][$key];
    }

}