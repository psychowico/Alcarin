<?php

namespace DevPack\Factory;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * @author Wiktor Obrębski
 */
class DebugLoggerFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $logger = clone $serviceLocator->get('log');
        $logger->setDefaultPriority( \Zend\Log\Logger::DEBUG );
        return $logger;
    }
}
