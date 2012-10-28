<?php

namespace Alcarin\View\Helper;

use Zend\View\Helper\AbstractHelper;

use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;

class IsAllowed extends AbstractHelper implements ServiceManagerAwareInterface
{
    protected $serviceManager;

    /**
     * check that logged user is allowed to use specific $resource
     * @param $resource it should be constant from \Core\Permission\Resources class
     */
    public function __invoke( $resource = null )
    {
         if( $resource == null ) {
            throw new \DomainException( 'Resource can not be null.' );
        }

        $auth = $this->getServiceManager()->get('zfcuser_auth_service');

        if( !$auth->hasIdentity() ) return false;

        $identity = $auth->getIdentity();
        $privilages = $identity->getPrivilages();

        return ($privilages & $resource ) == $resource;
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