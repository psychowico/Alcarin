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

    protected function auth()
    {
        if( $this->auth == null ) {
            $this->auth = $this->getServiceManager()->get('zfcuser_auth_service');
        }
        return $this->auth;
    }

    /**
     * check that logged user is allowed to use specific $resource
     * @param $resource it should be constant from \Core\Permission\Resources class
     */
    public function __invoke( $resource )
    {
        if( $resource == null ) {
            throw new \DomainException( 'Resource can not be null.' );
        }


        if( !$this->auth()->hasIdentity() ) return false;

        $identity = $this->auth()->getIdentity();
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