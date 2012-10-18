<?php
return array(
    'controllers' => array(
        'invokables' => array(
            'Minifier\Controller\MinifierController' => 'Minifier\Controller\MinifierController',
        ),
    ),
    'console' => array(
        'router' => array(
            'routes' => array(
                'minify' => array(
                    'options' => array(
                        'route'    => 'minify [--verbose|-v]',
                        'defaults' => array(
                            'controller' => 'Minifier\Controller\MinifierController',
                            'action'     => 'minify',
                        ),
                    ),
                ),
            ),
        ),
    ),
);
