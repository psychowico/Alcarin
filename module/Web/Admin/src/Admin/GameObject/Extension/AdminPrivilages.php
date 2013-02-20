<?php

namespace Admin\GameObject\Extension;

class AdminPrivilages extends \Core\GameObject
{
    protected function parentUser()
    {
        return $this->parent()->parent();
    }

    public function hasAccessTo($resource)
    {
        $user_data = $this->parentUser()->data();
        $user_priv = empty( $user_data['privilages'] ) ? false : $user_data['privilages'];

        if( $user_priv === false ) return false;

        $resource_privilage = ( 1 << $resource );

        return ($user_priv & $resource_privilage ) == $resource_privilage;
    }

    public function update($resources_array)
    {
        $user_data = $this->parentUser()->data();
        $user_priv = empty( $user_data['privilages'] ) ? 0 : $user_data['privilages'];

        foreach( $resources_array as $resource => $value ) {
            $res_bit = (1 << $resource);
            $user_priv = ( $user_priv & (~$res_bit) ) | ( $value ? $res_bit : 0 ) ;
        }
        $user_data['privilages'] = $user_priv;

        $this->parentUser()->save($user_data);
    }
}