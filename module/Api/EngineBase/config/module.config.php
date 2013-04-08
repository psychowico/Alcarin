<?php
return array(
    'game-modules' => array(
        'EngineBase' => array(
                'description' => 'Base game objects with minimum, critical for game functionality.',
                'game-objects' => array(
                    'players' => 'EngineBase\GameObject\Players',
                    'time'    => 'EngineBase\GameObject\Time',
                ),
                'game-objects-ext' => array(
                    'EngineBase\GameObject\Player' => array(
                        'chars' => 'EngineBase\GameObject\Extension\PlayerChars',
                    ),
                    'EngineBase\GameObject\Char\Character' => array(
                        'events' => 'EngineBase\GameObject\Extension\CharacterEvents',
                    ),
                ),
        ),
    ),
);
