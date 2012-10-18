<?php
return array(
    'minifier'    => array(
        'adapter'   => 'Minifier\Adapter\Minify',
        'options'   => array(
        ),
    ),
    'service_manager' => array(
        'factories' => array(
            'minifier'       =>  'Minifier\Factory',
        ),
        'invokables' => array(
            // Keys are the service names
            // Values are valid class names to instantiate.
            //'UserInputFiler' => 'SomeModule\InputFilter\User',
        ),
        'shared' => array(
            // Usually, you'll only indicate services that should _NOT_ be
            // shared -- i.e., ones where you want a different instance
            // every time.
        ),
    ),
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
