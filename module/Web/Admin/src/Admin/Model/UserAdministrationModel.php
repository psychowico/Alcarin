<?php

namespace Admin\Model;

class UserAdministrationModel implements \Zend\ServiceManager\ServiceLocatorAwareInterface
{
    use \Zend\ServiceManager\ServiceLocatorAwareTrait;

    protected $users_store = [];

    public function userHasAccessTo($userid, $resource)
    {
        $user_data = $this->getUser( $userid );
        $user_priv = empty( $user_data['privilages'] ) ? false : $user_data['privilages'];
        if( $user_priv === false ) return false;

        $resource_privilage = ( 1 << $resource );

        return ($user_priv & $resource_privilage ) == $resource_privilage;
    }

    public function updateUserPrivilages($userid, $resources_array)
    {
        $user_data = $this->getUser( $userid );
        $user_priv = empty( $user_data['privilages'] ) ? 0 : $user_data['privilages'];

        foreach( $resources_array as $resource => $value ) {
            $res_bit = (1 << $resource);
            $user_priv = ( $user_priv & (~$res_bit) ) | ( $value ? $res_bit : 0 ) ;
        }
        $user_data['privilages'] = $user_priv;
        $this->updateUser( $userid, $user_data );
    }

    private function getUser($userid)
    {
        if( empty( $this->users_store[$userid] ) ) {
            $mongo = $this->getServiceLocator()->get('mongo');
            $this->users_store[$userid] = $mongo->users->findById( $userid );
        }

        return $this->users_store[$userid];
    }

    private function updateUser($userid, $dataset)
    {
        $this->users_store[$userid] = $dataset;

        $mongo = $this->getServiceLocator()->get('mongo');
        $mongo->users->update_safe(['_id' => new \MongoId($userid)], $dataset);
    }
}