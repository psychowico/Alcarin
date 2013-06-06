<?php

return array(

    'module_layouts' => array(
        'Admin' => 'admin-layout',
    ),

    'controllers' => array(
        'invokables' => array(
            'Admin\Controller\Home'  => 'Admin\Controller\AdminHomeController',

            'Admin\Controller\Translations'        => 'Admin\Controller\Translations\TranslationsPanelController',
            'Admin\Controller\TranslationsEvents' => 'Admin\Controller\Translations\TranslationEventsController',

            'Admin\Controller\Users' => 'Admin\Controller\UsersController',
            'Admin\Controller\Users\Privilages' => 'Admin\Controller\Users\PrivilagesController',

            'Admin\Controller\Orbis\Gateways' => 'Admin\Controller\Orbis\GatewaysController',
            'Admin\Controller\Orbis\GatewaysGroups' => 'Admin\Controller\Orbis\GatewaysGroupsController',
            'Admin\Controller\Orbis\GatewaysPanel' => 'Admin\Controller\Orbis\GatewaysPanelController',

            'Admin\Controller\Users\Privilages' => 'Admin\Controller\Users\PrivilagesController',


            'Admin\Controller\Modules' => 'Admin\Controller\ModulesController'
        ),
    ),


    'service_manager' => array(
        'factories'    => array(
            'gateways-form' => 'Admin\Factory\GatewaysFormFactory'
        ),
    ),

    'view_helpers' => array(
        'invokables'   => array(
            'uri'          => 'Admin\View\Helper\Uri',
            'help'         => 'Admin\View\Helper\HelpButton',
        ),
    ),

    'game-modules' => array(
        'Admin' => array(
            'description'  => 'Administrative module',
            'game-objects' => array(
                'orbis' => 'Admin\GameObject\Orbis',
                'properties' => 'EngineBase\GameObject\Extension\WorldProperties',
                'translations' => 'Admin\GameObject\DynamicTranslations',
            ),
            'game-objects-ext' => array(
                'Admin\GameObject\DynamicTranslations' => array(
                    'def' => 'Admin\GameObject\Extension\Translation\DynamicTranslationsDefinitions',
                ),
                'Admin\GameObject\Extension\OrbisMinimap' => array(
                    'properties' => 'EngineBase\GameObject\Extension\WorldProperties',
                ),
                'Admin\GameObject\Extension\OrbisMap' => array(
                    'properties' => 'EngineBase\GameObject\Extension\WorldProperties',
                ),
                'Admin\GameObject\Orbis' => array(
                    'gateways' => 'Admin\GameObject\Extension\OrbisGateways',
                    'minimap'  => 'Admin\GameObject\Extension\OrbisMinimap',
                    'map'      => 'Admin\GameObject\Extension\OrbisMap',
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

    'router' => include __DIR__ . '/router.config.php',

    'view_manager' => array(
        'template_map' => array(
            'admin-layout'           => __DIR__ . '/../view/layout/admin-layout.twig',
        ),
        'template_path_stack' => array(
            'admin' => __DIR__ . '/../view',
        ),
    ),
);
