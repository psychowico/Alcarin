<?php
return array(
    'module_layouts' => array(
        'Admin' => 'admin-layout',
    ),

    'controllers' => array(
        'invokables' => array(
            'Admin\Controller\Home'  => 'Admin\Controller\AdminHomeController',

            'Admin\Controller\Users' => 'Admin\Controller\UsersController',
            'Admin\Controller\Orbis' => 'Admin\Controller\OrbisController',

            'Admin\Controller\Orbis\Minimap' => 'Admin\Controller\Orbis\MinimapController',
            'Admin\Controller\Users\Privilages' => 'Admin\Controller\Users\PrivilagesController',
        ),
    ),

    'view_helpers' => array(
        'invokables'   => array(
            'uri'          => 'Admin\View\Helper\Uri',
        ),
    ),

    'game-modules' => array(
        'Admin' => array(
            'discription'  => 'Administrative module',
            'game-objects' => array(
                'orbis' => 'Admin\GameObject\Orbis',
            ),
            'game-objects-ext' => array(
                'Admin\GameObject\Orbis' => array(
                    'minimap' => 'Admin\GameObject\Extension\OrbisMinimap',
                ),
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
            'minimap'   => array(
                'type' => 'literal',
                'options' => array(
                    // Change this to something specific to your module
                    'route'    => '/admin/orbis/minimap',
                    'defaults' => array(
                        // Change this value to reflect the namespace in which
                        // the controllers for your module are found
                        'controller'    => 'Admin\Controller\Orbis\Minimap',
                    ),
                ),
            ),
        ),
        /* declaring specific routes subfolders and corresponding namespaces */
        'namespaces' => array(
            'admin/subdefault' => array(
                'users' => 'Admin\Controller\Users',
                'orbis' => 'Admin\Controller\Orbis',
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
