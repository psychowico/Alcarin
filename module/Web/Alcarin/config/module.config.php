<?php

return array(
    'module_layouts' => array(
        'Alcarin' => 'alcarin-layout',
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
        'aliases'   => array(
            '_'         => 'translate',
            'bootstrap'  => 'form',
        ),
    ),


    'router' => array(
        'routes' => array(
            'alcarin' => array(
                'type'    => 'alcarin',
                'options' => array(
                    'route'    => '/game',
                    'namespace'=> 'Alcarin\Controller',
                    'restmode' => false,
                    'defaults' => array(
                        'controller' => 'Index',
                        'action'     => 'index',
                    ),
                ),
            ),
        ),
    ),

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
    'controllers' => array(
        'invokables' => array(
            'Alcarin\Controller\Index' => 'Alcarin\Controller\IndexController'
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
            'common-layout'  => __DIR__ . '/../view/layout/common-layout.twig',
            'alcarin-layout' => __DIR__ . '/../view/layout/alcarin-layout.twig',
            'error/404'      => __DIR__ . '/../view/error/404.phtml',
        ),
        'template_path_stack' => array(
            'alcarin' => __DIR__ . '/../view',
        ),
    ),
);
