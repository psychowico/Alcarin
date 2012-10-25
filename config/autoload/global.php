<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return array(
    'service_manager' => array(
        'factories'    => array(
            //override default zfcuser mapper by our own
            'zfcuser_user_mapper' => function( $sm ) {
                $mongo = $sm->get('mongo');
                $mapper = new \Alcarin\Mapper\MongoUserMapper();
                $mapper->setMongoDriver( $mongo );
                return $mapper;
            },
        ),
    ),

    'zfcuser'   => array(
        'user_entity_class' => 'Alcarin\Mapper\UserArrayMapper',
    ),
);