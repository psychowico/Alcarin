<?php

namespace Core\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Core\Permission\AuthService;

/**
 * controller plugin to wrap GameServiceContainer class
 */
class GameServices extends AbstractPlugin
{
    protected $gameServicesContainer = null;

    protected function getServiceContainer()
    {
        if( $this->gameServicesContainer == null ) {
            $sl = $this->getController()->getServiceLocator();
            $this->gameServicesContainer = $sl->get('game-services');
        }

        return $this->gameServicesContainer;
    }
    /**
     * wrapper for GameServiceContainer. if called without args, return
     * GameServiceContainer instance, if called with $service_key param
     * only - try return specific service, if called with both, $service_key
     * and $service_closure will try to made new service.
     */
    public function __invoke( $service_key = null, $service_closure = null )
    {
        if( $service_key !== null ) {
            if( $service_closure == null ) {
                return $this->getServiceContainer()->get( $service_key );
            }
            return $this->getServiceContainer()->set( $service_key, $service_closure );
        }
        return $this->getServiceContainer();

    }
}