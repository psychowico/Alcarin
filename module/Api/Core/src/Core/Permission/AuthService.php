<?php

namespace Core\Permission;

use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;
use Core\Permission\Resource;

class AuthService implements ServiceManagerAwareInterface
{
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
        $sm = $this->getServiceManager();
        $config = $sm->get('config');

        if( !isset( $config['controllers_access']['controllers'] ) ) return true;
        $access_list = $config['controllers_access']['controllers'];

        if( isset( $access_list[$controller_alias] ) ) {
            $resources = $access_list[$controller_alias];

            if( is_scalar( $resources ) ) $resources = [ $resources ];

            foreach( $resources as $resource ) {
                if( !$this->isAllowed( $resource ) ) {
                    return false;
                }
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
            $this->auth = $this->getServiceManager()->get('zfcuser_auth_service');
        }
        return $this->auth;
    }


    /**
     * Retrieve service manager instance
     *
     * @return ServiceManager
     */
    public function getServiceManager()
    {
        return $this->serviceManager;
    }

    /**
     * Set service manager instance
     *
     * @param ServiceManager $locator
     * @return void
     */
    public function setServiceManager(ServiceManager $serviceManager)
    {
        $this->serviceManager = $serviceManager;
    }
}