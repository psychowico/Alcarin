<?php

namespace Core\Permission;

class Resource
{
    //main chars panel
    const PLAYER_PANEL             = 0;
    /*all admins access should be started from "ADMIN_"*/
    const ADMIN_TRANSLATION_PANEL  = 1;
    const ADMIN_TRANSLATION_ACCEPT = 2;

    public function defaultForLoggedUser()
    {
        return static::PLAYER_PANEL;
    }

    public function hasAccessToAdminPanels( $privilages )
    {
        //check that user privilages and admin resources privilages
        //has at least one common value
        return( ($privilages & static::adminResources() ) > 0 );
    }

    /**
     * check than specific privilages nb has access to specific resource
     */
    public function isAllowed( $privilages, $resource )
    {
        $resource_privilage = ( 1 << $resource );

        return ($privilages & $resource_privilage ) == $resource_privilage;
    }

    private function adminResources()
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