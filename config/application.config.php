<?php

return array(
    'modules' => array(
        //external libraries
        'AssetsCompiler',
        'ZfcTwig',
        'ZfcBase',
        'ZfcUser',
        'EdpModuleLayouts',
        //game api modules
        'Core',
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
