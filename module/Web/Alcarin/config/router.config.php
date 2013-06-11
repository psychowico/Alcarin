<?php

return array(
    'routes' => array(
        'alcarin' => array(
            'type' => 'literal',
            'options' => array(
                'route' => '/game',
                'defaults' => array(
                    'controller'    => 'Game\Panel',
                    '__NAMESPACE__' => 'Alcarin\Controller',
                ),
            ),
            'may_terminate' => true,
            'child_routes' => array(
                'default' => array(
                    'type' => 'segment',
                    'options' => array(
                        'route' => '/:controller[/:id]',
                        'constraints' => array(
                            'controller' => 'panel|create-char',
                            'id'         => '[a-zA-Z0-9_-]+',
                        ),
                        'defaults' => array(
                            'controller'    => 'Panel',
                            '__NAMESPACE__' => 'Alcarin\Controller\Game',
                        ),
                    ),
                ),
            ),
        ),
    ),
);