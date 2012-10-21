<?php
return array(
    'modules' => array(
        'Alcarin',
        //external libraries
        'Minifier',
        'ZfcTwig'
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
