<?php

namespace Core\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Core\Permission\Resources;

use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;

class IsAllowed extends AbstractPlugin implements ServiceManagerAwareInterface
{
    protected $serviceManager;
    protected $auth;
    protected $resource;

    public function __construct()
    {
        $this->resource = new \Core\Permission\Resource();
    }

    protected function auth()
    {
        if( $this->auth == null ) {
            $this->auth = $this->getServiceManager()->get('zfcuser_auth_service');
        }
        return $this->auth;
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

    /**
     * return true if specific privilages provides access to any
     * from admin panels
     */
    public function hasAccessToAdminPanels()
    {
        $privilages = $this->userPrivilages();
        return $privilages ? $this->resource->hasAccessToAdminPanels( $privilages ) : false;
    }

    /**
     * check that logged user is allowed to use specific $resource
     * @param $resource it should be constant from \Core\Permission\Resources class
     */
    public function __invoke( $resource = null )
    {
        if( $resource === null ) return $this;

        $privilages = $this->userPrivilages();

        return $privilages ? $this->resource->isAllowed( $privilages, $resource ) : false;
    }


    /**
     * Retrieve service manager instance
     *
     * @return ServiceManager
     */
    public function getServiceManager()
    {
        return $this->serviceManager->getServiceLocator();
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