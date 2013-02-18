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
        /* route param that will used to render 'notallowed' site */
        'notallowed_route' => array(
            'controller' => 'zfcuser',
            'action'     => 'login',
        ),
        /* controllers and their required resources privilages */
        'controllers' => array(
            'home'           => Resource::PLAYER_PANEL,
            'admin-home'     => Resource::ADMIN_MENU,
            'admin-users'    => Resource::ADMIN_USERS,
            'privilages'     => [Resource::ADMIN_USERS, Resource::ADMIN_PRIVILAGES_MANAGING],
            /*'admin-home' => [ Resource::ADMIN_TRANSLATION_PANEL, ... ]*/
        ),
    ),
    'zfctwig' => array(
         /**
         * If set to true disables ZF's notion of parent/child layouts in favor of
         * Twig's inheritance model.
         */
        'disable_zf_model' => true,

        /**
         * Options that are passed directly to the Twig_Environment.
         */
        'environment_options' => array(
            'cache'            => __DIR__ . '/../../data/cache/twig',
        ),
    ),
);