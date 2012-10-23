<?php
return array(
    'modules' => array(
        'Alcarin',
        //external libraries
        'AssetsCompiler',
        'ZfcTwig',
        'ZfcBase',
        'ZfcUser',
        //profiling modules, can be removed in production
        'ZendDeveloperTools',
        'BjyProfiler',
        'ZF2NetteDebug'
    ),
    'module_listener_options' => array(
        'config_glob_paths'    => array(
            'config/autoload/{,*.}{global,local}.php',
        ),
        'module_paths' => array(
            './module',
            './vendor',
        ),
    ),
);
