<?php
return array(
    'game-modules' => array(
        'EngineBase' => array(
                'description' => 'Base game objects with minimum, critical for game functionality.',
                'game-objects' => array(
                    'players' => 'EngineBase\GameObject\Players',
                ),
                'game-objects-ext' => array(
                    'EngineBase\GameObject\Player' => array(
                        'chars' => 'EngineBase\GameObject\Extension\PlayerChars',
                    ),
                ),
        ),
    ),
);
