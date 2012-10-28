<?php
return array(
    'mongo' => array(
        'server'    => 'mongodb://localhost:27017',
        'database'  => 'dbname',
        //profiling enable
        'profiling' => false,
        //class to use as default collection support
        'collection'=> 'Mongo_Collection',
    ),

    'controller_plugins' => array(
        'invokables'    => array(
            //can be helpful in modules to checking user privilages to specific resources
            'isAllowed' => 'Core\Controller\Plugin\IsAllowed',
        ),
    ),

    'service_manager' => array(
        'invokables' => array(
        ),
        'factories'  => array(
        ),
    ),

    'view_manager' => array(
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),
);
