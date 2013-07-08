<?php

return array(
    'modules' => array(
        'Core',

        'AssetsCompiler',
        'ZfcTwig',
        'ZfcBase',
        'ZfcUser',
        'TwbBundle',

        'EngineBase',
        'Errors',
        'DevPack',
        //my game web panels
        'Guest',
        'Alcarin',
        'GameMaster',
        'Admin',
        //profiling modules
        'ZendDeveloperTools',
        'ZF2NetteDebug',
    ),
    'module_listener_options' => array(
        'config_glob_paths'    => array(
            'config/autoload/{,*.}{global,local}.php',
        ),
        'module_paths' => array(
            './module/Web',
            './module/Api',
            './module/Dev',
            './vendor',
        ),
    ),
);
