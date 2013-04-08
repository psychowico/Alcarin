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
            'controller'    => 'zfcuser',
            'action'        => 'login',
            '__NAMESPACE__' => '',
        ),
        /* controllers and their required resources privilages */
        'controllers' => array(
            //zfcuser module controller and guest controllers
            //are public available - we need sign it by empty array
            //because by default all controllers are unaccessible.
            'zfcuser'                           => [],
            'guest-home'                        => [],
            'external'                          => [],

            'Alcarin\Controller\Panel'          => Resource::PLAYER_PANEL,
            'Alcarin\Controller\CreateChar'          => Resource::PLAYER_PANEL,

            'Admin\Controller\Home'             => Resource::ADMIN_MENU,
            'Admin\Controller\Users'            => Resource::ADMIN_USERS,
            'Admin\Controller\Translations'     => Resource::ADMIN_TRANSLATIONS,
            'Admin\Controller\Users\Privilages' => [Resource::ADMIN_USERS, Resource::ADMIN_PRIVILAGES_MANAGING],
            'Admin\Controller\Orbis\Orbis'    => [Resource::ADMIN_ORBIS],
            'Admin\Controller\Orbis\Gateways' => [Resource::ADMIN_ORBIS],
            'Admin\Controller\Orbis\Map'      => [Resource::ADMIN_ORBIS],
            'Admin\Controller\Orbis\Editor'   => [Resource::ADMIN_ORBIS],
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