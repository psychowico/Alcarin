<?php

namespace Core\Permission;

class Resource
{
    //main chars panel
    const PLAYER_PANEL              = 0;
    /* ADMINS privilages */
    const ADMIN_MENU                = 1;
    const ADMIN_PRIVILAGES_MANAGING = 2;

    /**
     * useable on privilages managing panels
     */
    public static $Descriptions = [
        Resource::PLAYER_PANEL => ["Public", "Public data acessible for all logged users."],
        Resource::ADMIN_MENU => ["Admin menu", "Administrative menu."],
        Resource::ADMIN_PRIVILAGES_MANAGING => ["Administration of privileges", "Viewing and managing users privilages."],
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