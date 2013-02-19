<?php
return array(
    'modules' => array(
        //external libraries
        'AssetsCompiler',
        'ZfcTwig',
        'ZfcBase',
        'ZfcUser',
        'EdpModuleLayouts',
        //my game web panels
        'Guest',
        'Alcarin',
        'GameMaster',
        'Admin',
        //game api modules
        'Core',
        'Errors',
        'DevPack',
        //profiling modules, can be removed in production
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
