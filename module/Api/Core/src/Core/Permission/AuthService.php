<?php

namespace Core\Permission;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Core\Permission\Resource;

class AuthService implements ServiceLocatorAwareInterface
{
    use \Zend\ServiceManager\ServiceLocatorAwareTrait;

    protected $serviceManager;
    protected $auth;

    /**
     * checking resources needed to see $controller_alias in
     * controllers_access->controllers configuration list and
     * return true, if user have privilages to them. otherwise
     * return false.
     */
    public function isAllowedToController( $controller_alias )
    {
        $sm = $this->getServiceLocator();
        $config = $sm->get('config');

        if( empty( $config['controllers_access']['controllers'][$controller_alias] ) ) return false;

        $resources = $config['controllers_access']['controllers'][$controller_alias];

        if( is_scalar( $resources ) ) $resources = [ $resources ];

        foreach( $resources as $resource ) {
            if( !$this->isAllowed( $resource ) ) {
                return false;
            }
        }
        return true;
    }

    /**
     * check than logged user has access to specific resource
     */
    public function isAllowed( $resource )
    {
        $privilages = $this->userPrivilages();

        if( $privilages === false ) return false;

        $resource_privilage = ( 1 << $resource );

        return ($privilages & $resource_privilage ) == $resource_privilage;
    }

    /**
     * return logged user privilages or false if user isn't logged
     */
    protected function userPrivilages()
    {
        if( !$this->auth()->hasIdentity() ) return false;

        $identity = $this->auth()->getIdentity();

        return $identity->getPrivilages();
    }

    protected function auth()
    {
        if( $this->auth == null ) {
            $this->auth = $this->getServiceLocator()->get('zfcuser_auth_service');
        }
        return $this->auth;
    }
}