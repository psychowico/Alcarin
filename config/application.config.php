<?php
return array(
    'modules' => array(
        'Guest',
        'Alcarin',
        'GameMaster',
        'Admin',
        //game api modules
        'Core',
        'Errors',
        //external libraries
        'AssetsCompiler',
        'ZfcTwig',
        'ZfcBase',
        'ZfcUser',
        'EdpModuleLayouts',
        //profiling modules, can be removed in production
        'ZendDeveloperTools',
        'ZDTPack',
        'ZF2NetteDebug'
    ),
    'module_listener_options' => array(
        'config_glob_paths'    => array(
            'config/autoload/{,*.}{global,local}.php',
        ),
        'module_paths' => array(
            './module/Web',
            './module/Api',
            './module',
            './vendor',
        ),
    ),
);
