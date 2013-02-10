<?php
return array(
    'module_layouts' => array(
        'Admin' => 'admin-layout',
    ),

    'controllers' => array(
        'invokables' => array(
            'admin-home' => 'Admin\Controller\AdminHomeController',
            'privilages' => 'Admin\Controller\PrivilagesController',
        ),
    ),
    'router' => array(
        'routes' => array(
            'admin' => array(
                'type'    => 'Segment',
                'options' => array(
                    // Change this to something specific to your module
                    'route'    => '/admin[/:controller[/:action]]',
                    'defaults' => array(
                        'controller'    => 'admin-home',
                        'action'        => 'index',
                    ),
                    'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                ),
                'may_terminate' => true,
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
