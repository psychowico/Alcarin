<?php
namespace Core\Service;

use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\ServiceManager\InitializerInterface;
use Core\Service\GameServiceAwareInterface;

class GameServicesInitializer implements InitializerInterface
{
    /**
     * Initialize
     *
     * @param $instance
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function initialize($instance, ServiceLocatorInterface $serviceLocator)
    {
        if ($instance instanceof GameServiceAwareInterface) {
            if( $serviceLocator instanceof \Zend\ServiceManager\AbstractPluginManager) {
                $gServices = $serviceLocator->getServiceLocator()->get('game-services');
            }
            else {
                $gServices = $serviceLocator->get('game-services');
            }

            $instance->setServicesContainer($gServices);
        }
    }
}
