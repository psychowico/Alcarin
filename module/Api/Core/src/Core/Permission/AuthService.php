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
     * return true if specific privilages provides access to any
     * from admin panels
     */
    public function hasAccessToAdminPanels()
    {
        //check that user privilages and admin resources privilages
        //has at least one common value
        $privilages = $this->userPrivilages();

        if( $privilages === false ) return false;
        return ( ($privilages & Resource::adminResources() ) > 0 );
    }

    /**
     * check than specific privilages nb has access to specific resource
     */
    public function isAllowed( $resource )
    {
        $privilages = $this->userPrivilages();

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