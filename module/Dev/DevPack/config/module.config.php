<?php
return array(
    'view_manager' => array(
        'template_path_stack' => array(
            'zdt-pack' => __DIR__ . '/../view',
        ),
    ),

    'mongo' => array(
        'collection'    => 'DevPack\MongoCollection'
    ),

    'mongo_profiler' => array(
        'class'   => 'DevPack\Profiler',
        'options' => array(
        ),
    ),

    'controller_plugins' => array(
        'factories' => array(
            'debug' => 'DevPack\Factory\DebugLoggerFactory',
        ),
    ),

    'service_manager' => array(
        'invokables' => array(
            'DevPack\MongoCollector'  => 'DevPack\Collector\MongoCollector',
            'DevPack\MongoCollection' => 'DevPack\MongoCollection',
        ),
    ),

    'controllers' => array(
        'invokables' => array(
            'DevPack\DevConsoleController' => 'DevPack\Controller\DevConsoleController',
        ),
    ),

    'console' => array(
        'router' => array(
            'routes' => array(
                'create-su' => array(
                    'options' => array(
                        'route'    => 'create su <suemail> <supass>',
                        'defaults' => array(
                            'controller' => 'DevPack\DevConsoleController',
                            'action'     => 'createSu',
                        ),
                    ),
                ),
            ),
        ),
    ),
);
