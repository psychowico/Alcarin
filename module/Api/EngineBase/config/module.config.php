<?php
return array(
    'game-modules' => array(
        'EngineBase' => array(
                'description' => 'Base game objects with minimum, critical for game functionality.',
                'game-objects' => array(
                    'game-events'=> 'EngineBase\GameObject\GameEvent\GameEventsService',
                    'players'    => 'EngineBase\GameObject\Players',
                    'time'       => 'EngineBase\GameObject\Time',
                    'properties' => 'EngineBase\GameObject\Extension\WorldProperties',
                    'world-units'=> 'EngineBase\GameObject\WorldUnitsService',
                ),
                'game-objects-ext' => array(
                    'EngineBase\GameObject\GameEvent\GameEvent' => array(
                        'broadcast' => 'EngineBase\GameObject\Extension\GameEventBroadcaster',
                    ),
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
