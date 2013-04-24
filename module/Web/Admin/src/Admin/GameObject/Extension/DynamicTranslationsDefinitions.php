<?php

namespace Admin\GameObject\Extension;

use Admin\GameObject\DynamicTranslations;

/**
 * definitions for events translation tags. so, tranlator can know how many
 * args specific translation tags has etc.
 */
class DynamicTranslationsDefinitions extends \Core\GameObject
{
    const TEXT   = 0;
    const CHAR   = 1;
    const OBJECT = 2;

    protected $defs = [
        'events.public-talk' => [
            'descr' => 'Talking that can be hear only by involved chars - and by staying really close, in part.',
            'args'        => [
                ['type' => TEXT, 'descr' => 'Talking content.']
            ]
        ]
    ];

    public function get($group, $key)
    {
        $a_key = sprintf('%s.%s', $group, $key);
        return empty($defs[$a_key]) ? null : $defs[$a_key];
    }
}