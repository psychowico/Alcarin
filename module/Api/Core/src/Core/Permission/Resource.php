<?php

namespace Core\Permission;

class Resource
{
    //main chars panel
    const PLAYER_PANEL              = 0;
    /* ADMINS privilages */
    const ADMIN_MENU                = 1;
    const ADMIN_USERS               = 2;
    const ADMIN_PRIVILAGES_MANAGING = 3;

    /**
     * useable on privilages managing panels
     */
    public static $Descriptions = [
        'General'   => [
            Resource::PLAYER_PANEL => ["Public", "Public data acessible for all logged users."],
        ],
        'Administrative' => [
            Resource::ADMIN_MENU => ["Admin menu", "Administrative menu."],
            Resource::ADMIN_USERS => ["Users menu", "Users administration menu."],
            Resource::ADMIN_PRIVILAGES_MANAGING => ["Administration of privileges", "Viewing and managing users privilages."],
        ],
    ];

    public static function defaultForLoggedUser()
    {
        return static::PLAYER_PANEL;
    }

     /*$refl = new \ReflectionClass('Core\Permission\Resource');
        $result = 0;
        foreach( $refl->getConstants() as $name => $value ) {
            if( strpos($name, 'ADMIN') === 0 ) {
                $result |= (1 << $value);
            }
        }
        return $result;
    */
}