<?php

namespace Alcarin\View\Helper;

use Zend\View\Helper\AbstractHelper;

use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;

class IsAllowed extends AbstractHelper implements ServiceManagerAwareInterface
{
    protected $serviceManager;
    protected $resource;
    protected $auth;

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
     * check that logged user is allowed to use specific $resource
     * @param $resource it should be constant from \Core\Permission\Resources class
     */
    public function __invoke( $resource = null )
    {
        if( $resource === null ) {
            throw new \DomainException( 'Resource can not be null.' );
        }

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