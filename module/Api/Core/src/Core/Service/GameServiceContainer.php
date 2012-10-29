<?php

namespace Core\Service;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * simply version of service manager to share game services between
 * game api modules. it have much less functionality, but works much faster.
 * you can register service bet $gsc->set( $key, $service ), where service
 * must be a closure that will be lazy called when needed, with $gsc argument.
 * this closure can't return closure itself. To get service you just call $gm->get( $key ).
 */
class GameServiceContainer implements ServiceLocatorAwareInterface
{
    protected $serviceLocator;
    protected $services = [];

    protected $resolved = [];

    public function has( $key )
    {
        return array_key_exists( $key, $this->services );
    }

    public function set( $key, \Closure $service_builder )
    {
        if( isset( $this->services[$key] ) ) {
            throw new \DomainException( sprintf(
                'A "%s" service already exists in %s.',
                $key, __CLASS__
            ));
        }

        $this->services[$key] = $service_builder;
    }

    public function get( $key, $throw_exceptions = true )
    {
        if( isset( $this->resolved[$key] ) ) {
            return $this->resolved[$key];
        }
        else {
            if( isset( $this->services[$key] ) ) {
                $service = $this->services[$key];
                $this->resolved[$key] = $service = $service( $this );
                unset( $this->services[$key] );
                return $service;
            }
            else {
                if( $throw_exceptions ) {
                    throw new \DomainException( sprintf(
                        'Service "%s" not exists in %s.',
                        $key, __CLASS__
                    ));
                }
                return null;
            }
        }
    }

    /**
     * Set service locator
     *
     * @param ServiceLocatorInterface $serviceLocator
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->serviceLocator = $serviceLocator;
    }

    /**
     * Get service locator
     *
     * @return ServiceLocatorInterface
     */
    public function getServiceLocator()
    {
        return $this->serviceLocator;
    }
}