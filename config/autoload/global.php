<?php

use Core\Permission\Resource;

/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return array(
    'controllers_access' => array(
        //route param that will used to render 'notallowed' site
        'notallowed_route' => array(
            'controller' => 'home',
            'action'     => 'index',
        ),
        //controllers and their required resources privilages
        'controllers' => array(
            'admin-home'     => Resource::ADMIN_TRANSLATION_PANEL,
            /*'admin-home' => array(
                'resources' => array(
                    Resource::ADMIN_TRANSLATION_PANEL
                ),
            )*/
    )   ,
    ),
);