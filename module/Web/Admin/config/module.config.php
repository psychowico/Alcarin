<?php
return array(
    'module_layouts' => array(
        'Admin' => 'admin-layout',
    ),

    'controllers' => array(
        'invokables' => array(
            'admin-home'            => 'Admin\Controller\AdminHomeController',
            'admin-users' => 'Admin\Controller\UsersController',
            'privilages'            => 'Admin\Controller\Users\PrivilagesController',
        ),
    ),
    'router' => array(
        'routes' => array(
            'admin' => array(
                'type'    => 'Segment',
                'options' => array(
                    // Change this to something specific to your module
                    'route'    => '/admin[/:controller][/:id][/:action]',
                    'defaults' => array(
                        'controller'    => 'admin-home',
                    ),
                    'constraints' => array(
                        'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[a-zA-Z0-9_-]+',
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                ),
            ),
            'admin-users' => array(
                'type'    => 'Segment',
                'options' => array(
                    // Change this to something specific to your module
                    'route'    => '/admin/users[/:id][/:controller][/:action]',
                    'defaults' => array(
                        'controller'    => 'admin-users',
                    ),
                    'constraints' => array(
                        'controller' => 'privilages',
                        'id'     => '[a-zA-Z0-9_-]+',
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                ),
            ),
        ),
    ),

    'view_manager' => array(
        'template_map' => array(
            'admin-layout'           => __DIR__ . '/../view/layout/layout.twig',
        ),
        'template_path_stack' => array(
            'admin' => __DIR__ . '/../view',
        ),
    ),
);
