<?php
return array(
    'view_manager' => array(
        'template_path_stack' => array(
            'zdt-pack' => __DIR__ . '/../view',
        ),
    ),

    'service_manager' => array(
        'invokables' => array(
            'ZDTPack\TestCollector' => 'ZDTPack\Collector\TestCollector',
        ),
    ),
);
