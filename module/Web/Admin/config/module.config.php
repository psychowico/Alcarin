<?php
return array(
    'module_layouts' => array(
        'Admin' => 'admin-layout',
    ),

    'controllers' => array(
        'invokables' => array(
            'Admin\Controller\Home'  => 'Admin\Controller\AdminHomeController',
            'Admin\Controller\Users' => 'Admin\Controller\UsersController',

            'Admin\Controller\Users\Privilages' => 'Admin\Controller\Users\PrivilagesController',
        ),
    ),

    'view_helpers' => array(
        'invokables'   => array(
            'parentUri'         => 'Admin\View\Helper\ParentUri',
        ),
    ),

    'game-modules' => array(
        'Admin' => array(
            'discription'  => 'Administrative module',
            'game-objects-ext' => array(
                'EngineBase\GameObject\Player' => array(
                    'admin' => 'Admin\GameObject\Extension\PlayerAdmin'
                ),
                'Admin\GameObject\Extension\PlayerAdmin' => array(
                    'privilages' => 'Admin\GameObject\Extension\AdminPrivilages',
                ),
            ),
        ),
    ),

    'router' => array(
        'routes' => array(
            'admin' => array(
                'type'    => 'alcarin',
                'options' => array(
                    'route'    => '/admin',
                    'namespace'=> 'Admin\Controller',
                    'restmode' => true,
                    'defaults' => array(
                        'controller' => 'Home',
                    ),
                ),
            ),
        ),
        /* declaring specific routes subfolders and corresponding namespaces */
        'namespaces' => array(
            'admin/subdefault' => array(
                'users' => 'Admin\Controller\Users',
            ),
        ),
    ),

    'view_manager' => array(
        'template_map' => array(
            'admin-layout'           => __DIR__ . '/../view/layout/admin-layout.twig',
        ),
        'template_path_stack' => array(
            'admin' => __DIR__ . '/../view',
        ),
    ),
);
