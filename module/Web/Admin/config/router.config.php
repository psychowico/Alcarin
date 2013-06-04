<?php
return array(
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
        'orbis' => array(
            'type'    => 'segment',
            'options' => array(
                'route'    => '/admin/orbis/:controller[/__:template][/:id]',
                'constraints' => array(
                    'controller' => 'gateways-panel|gateways-groups|gateways',
                    'id'         => '[a-zA-Z0-9_-]+',
                    'template'   => '[a-zA-Z][a-zA-Z0-9_-]*',
                ),
                'defaults' => array(
                    'controller'    => 'GatewaysPanel',
                    '__NAMESPACE__' => 'Admin\Controller\Orbis',
                ),
            ),
        ),
        // 'orbis' => array(
        //     'type'    => 'alcarin',
        //     'options' => array(
        //         'route'    => '/admin/orbis',
        //         'namespace'=> 'Admin\Controller\Orbis',
        //         'restmode' => true,
        //         'defaults' => array(
        //             'controller' => 'Orbis',
        //         ),
        //     ),
        // ),
        'translations' => array(
            'type'    => 'segment',
            'options' => array(
                'route'    => '/admin/translations[/[:id[/[:action]]]]',
                'constraints' => array(
                    'id'     => '[a-zA-Z0-9_-]+',
                    'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                ),
                'defaults' => array(
                    'controller' => 'Admin\Controller\Translations',
                ),
            ),
        ),
    ),
    /* declaring specific routes subfolders and corresponding namespaces */
    'namespaces' => array(
        'admin/subdefault' => array(
            'users' => 'Admin\Controller\Users',
            'modules' => 'Admin\Controller\Modules',
            // 'orbis' => 'Admin\Controller\Orbis',
        ),
    ),
);
