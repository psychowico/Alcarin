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

    'zfcuser'   => array(
        'user_entity_class' => 'Core\Mapper\UserArrayMapper',
    ),
    'zfcuser'   => array(
        'user_entity_class' => 'Alcarin\Mapper\UserArrayMapper',
    ),

    'controller_plugins' => array(
        'invokables'    => array(
            //can be helpful in modules to checking user privilages to specific resources
            'isAllowed' => 'Core\Controller\Plugin\IsAllowed',
        ),
    ),

    'service_manager' => array(
        'factories'    => array(
            //override default zfcuser mapper by our own
            'zfcuser_user_mapper' => function( $sm ) {
                $mongo = $sm->get('mongo');
                $mapper = new \Core\Mapper\MongoUserMapper();
                $mapper->setMongoDriver( $mongo );
                return $mapper;
            },
        ),
    ),

    'view_manager' => array(
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),
);
