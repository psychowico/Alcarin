<?php

return array(
    'module_layouts' => array(
        'Alcarin' => 'alcarin-layout',
    ),

    'controllers' => array(
        'invokables' => array(
            'Alcarin\Controller\Game\Panel'      => 'Alcarin\Controller\Game\GamePanelController',
            'Alcarin\Controller\Game\CreateChar' => 'Alcarin\Controller\Game\CreateCharController',
        ),
    ),

    'zfctwig' => array(
        'extensions' => array(
            'alcarin-twig' => '\Alcarin\Twig\Extension\AlcarinTwigExtensions',
        )
    ),

    'service_manager' => array(
        'factories' => array(
            'translator' => 'Zend\I18n\Translator\TranslatorServiceFactory',
        ),
    ),

    'view_helpers' => array(
        'invokables' => array(
            'player' => 'Alcarin\View\Helper\CurrentPlayer',
        ),
        'aliases'   => array(
            'isLogged'  => 'zfcUserIdentity',
            '_'         => 'translate',
            'bootstrap' => 'form',
        ),
    ),


    'router' => include __DIR__ . '/router.config.php',

    'translator' => array(
        'locale' => 'en_US',
        'translation_file_patterns' => array(
            array(
                'type'     => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern'  => '%s.mo',
            ),
        ),
    ),

    'view_manager' => array(
        'doctype'               => 'HTML5',
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'alcarin-modal'  => __DIR__ . '/../view/alcarin/modal.twig',
            'common-layout'  => __DIR__ . '/../view/layout/common-layout.twig',
            'alcarin-layout' => __DIR__ . '/../view/layout/alcarin-layout.twig',
            'error/404'      => __DIR__ . '/../view/error/404.phtml',
        ),
        'template_path_stack' => array(
            'alcarin' => __DIR__ . '/../view',
        ),
    ),
);
