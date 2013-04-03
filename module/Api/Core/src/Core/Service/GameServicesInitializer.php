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
            $instance->setServicesContainer($serviceLocator->get('game-services'));
        }
    }
}
