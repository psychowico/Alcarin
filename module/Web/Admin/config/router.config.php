<?php
return array(
    'routes' => array(
        'admin' => array(
            'type'    => 'literal',
            'options' => array(
                'route'    => '/admin',
                'defaults' => array(
                    'controller'    => 'Home',
                    '__NAMESPACE__' => 'Admin\Controller',
                ),
            ),
            'may_terminate' => true,
            'child_routes' => array(
                'modules' => array(
                    'type' => 'literal',
                    'options' => array(
                        'route' => '/modules',
                        'defaults' => array(
                            'controller' => 'modules',
                        ),
                    ),
                ),
                'translations' => array(
                    'type'    => 'segment',
                    'options' => array(
                        'route'    => '/translations[/[:id[/[:action]]]]',
                        'constraints' => array(
                            'id'     => '[a-zA-Z0-9_-]+',
                            'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        ),
                        'defaults' => array(
                            'controller' => 'translations',
                        ),
                    ),
                ),
                'users' => array(
                    'type' => 'segment',
                    'options' => array(
                        'route' => '/users[/:id]',
                        'defaults' => array(
                            'controller' => 'users',
                        ),
                        'constraints' => array(
                            'id'            => '[a-zA-Z0-9_-]+',
                        ),
                    ),
                    'may_terminate' => true,
                    'child_routes' => array(
                        'privilages' => array(
                            'type'    => 'literal',
                            'options' => array(
                                'route'    => '/privilages',
                                'defaults' => array(
                                    'controller' => 'privilages',
                                    '__NAMESPACE__' => 'Admin\Controller\Users',
                                ),
                            ),
                        ),
                    ),
                ),
                'orbis' => array(
                    'type'    => 'literal',
                    'options' => array(
                        'route' => '/orbis'
                    ),
                    'may_terminate' => false,
                    'child_routes' => array(
                        'default' => array(
                            'type'    => 'segment',
                            'options' => array(
                                'route'    => '/:controller[/__:template][/:id]',
                                'constraints' => array(
                                    'controller' => 'gateways-panel|gateways-groups|gateways|world-editor',
                                    'id'         => '[a-zA-Z0-9%_-]+',
                                    'template'   => '[a-zA-Z][a-zA-Z0-9_-]*',
                                ),
                                'defaults' => array(
                                    'controller'    => 'GatewaysPanel',
                                    '__NAMESPACE__' => 'Admin\Controller\Orbis',
                                ),
                            ),
                        ),
                        'map' => array(
                            'type'    => 'segment',
                            'options' => array(
                                'route'    => '/map/:action',
                                'constraints' => array(
                                    'action'   => '[a-zA-Z][a-zA-Z0-9_-]*',
                                ),
                                'defaults' => array(
                                    'controller'    => 'Admin\Controller\Orbis\Map',
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
    /* declaring specific routes subfolders and corresponding namespaces */
    'namespaces' => array(
        'admin/subdefault' => array(
            'users' => 'Admin\Controller\Users',
            'modules' => 'Admin\Controller\Modules',
        ),
    ),
);
