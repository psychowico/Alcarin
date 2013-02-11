<?php
return array(
    'view_manager' => array(
        'template_path_stack' => array(
            'zdt-pack' => __DIR__ . '/../view',
        ),
    ),

    'mongo' => array(
        'collection'    => 'ZDTPack\MongoCollection'
    ),

    'mongo_profiler' => array(
        'class'   => 'ZDTPack\Profiler',
        'options' => array(
        ),
    ),

    'service_manager' => array(
        'invokables' => array(
            'ZDTPack\MongoCollector'  => 'ZDTPack\Collector\MongoCollector',
            'ZDTPack\MongoCollection' => 'ZDTPack\MongoCollection',
        ),
    ),

    'controllers' => array(
        'invokables' => array(
            'ZDTPack\DevConsoleController' => 'ZDTPack\Controller\DevConsoleController',
        ),
    ),

    'console' => array(
        'router' => array(
            'routes' => array(
                'create-su' => array(
                    'options' => array(
                        'route'    => 'create su <suemail> <supass>',
                        'defaults' => array(
                            'controller' => 'ZDTPack\DevConsoleController',
                            'action'     => 'createSu',
                        ),
                    ),
                ),
            ),
        ),
    ),
);
