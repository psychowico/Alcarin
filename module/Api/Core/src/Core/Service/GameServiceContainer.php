<?php

namespace Core\Service;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Core\Service\GameServiceAwareInterface;

/**
 * simply version of service manager to share game services between
 * game api modules. it have much less functionality, but works much faster.
 * you can register service bet $gsc->set( $key, $service ), where service
 * must be a closure that will be lazy called when needed, with $gsc argument.
 * To get service you just call $gm->get( $key ).
 *
 * If GameServiceContainer can not found a service, it try use standard
 * zend service manager and cache results as himself.
 */
class GameServiceContainer implements ServiceLocatorAwareInterface
{
    use \Zend\ServiceManager\ServiceLocatorAwareTrait;

    protected $services = [];
    protected $resolved = [];

    public function has( $key )
    {
        return array_key_exists( $key, $this->services );
    }

    public function set( $key, $service_builder_or_invokable )
    {
        if( isset($this->services[$key] ) ) {
            throw new \DomainException( sprintf(
                'A "%s" service already exists in %s.',
                $key, __CLASS__
            ));
        }

        $this->services[$key] = $service_builder_or_invokable;
    }

    public function get( $key, $throw_exceptions = true )
    {
        if( isset($this->resolved[$key]) ) {
            return $this->resolved[$key];
        }
        else {
            if( isset($this->services[$key]) ) {
                $service = $this->services[$key];
                if(is_string($service)){
                    //invokable
                    $service = new $service();
                }
                else {
                    //factory
                    $service = $service( $this );
                }
                $this->resolved[$key] = $service;
                unset( $this->services[$key] );
            }
            else {
                if( $this->getServiceLocator()->has( $key ) ) {
                    $this->resolved[$key] = $service =
                                            $this->getServiceLocator()->get( $key );
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

            if( $service instanceof GameServiceAwareInterface ) {
                $service->setServicesContainer($this);
            }
            return $service;
        }
    }

    public function registerGameModule($module)
    {
        $extManager   = $this->get('ext-manager');

        //$desc = $module->getGameModuleDescription();
        foreach( $module->getGameObjects() as $key => $game_object ) {
            $this->set($key, $game_object);
        }
        foreach( $module->getGameObjectsPlugins() as $object => $plugins ) {
            foreach( $plugins as $ext_name => $ext ) {
                $extManager->registerFactory($object, $ext_name, $ext);
            }
        }
    }
}