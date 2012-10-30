<?php

namespace Core\Permission;

class Resource
{
    //main chars panel
    const PLAYER_PANEL             = 0;
    /*all admins access should be started from "ADMIN_"*/
    const ADMIN_TRANSLATION_PANEL  = 1;
    const ADMIN_TRANSLATION_ACCEPT = 2;

    public static function defaultForLoggedUser()
    {
        return static::PLAYER_PANEL;
    }

    public static function adminResources()
    {
        /*$refl = new \ReflectionClass('Core\Permission\Resource');
        $result = 0;
        foreach( $refl->getConstants() as $name => $value ) {
            if( strpos($name, 'ADMIN') === 0 ) {
                $result |= (1 << $value);
            }
        }
        return $result;
        */
        //precalc value from commented code
        return 6;
    }
}