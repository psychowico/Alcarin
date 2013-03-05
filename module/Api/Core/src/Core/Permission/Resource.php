<?php

namespace Core\Permission;

class Resource
{
    //you shouldn't defining more resources that this number,
    //because it can generate problems with 'long' numbers in php.
    const RESOURCE_LIMIT = 50;

    //main chars panel
    const PLAYER_PANEL              = 0;
    /* ADMINS privilages */
    const ADMIN_MENU                = 1;
    const ADMIN_USERS               = 2;
    const ADMIN_PRIVILAGES_MANAGING = 3;
    const ADMIN_ORBIS = 4;

    /**
     * useable on privilages managing panels
     */
    public static $Descriptions = [
        'General'   => [
            Resource::PLAYER_PANEL => ["Public", "Public data acessible for all logged users"],
        ],
        'Administrative' => [
            Resource::ADMIN_MENU => ["Admin menu", "Administrative menu"],
            Resource::ADMIN_USERS => ["Users menu", "Users administration menu"],
            Resource::ADMIN_PRIVILAGES_MANAGING => ["Administration of privileges", "Viewing and managing users privilages"],
            Resource::ADMIN_ORBIS => ["Orbis Editor Access", "Global map editor"],
        ],
    ];

    public static function defaultForLoggedUser()
    {
        return static::PLAYER_PANEL;
    }
}