<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/zf2 for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Core\Factory;

use Zend\ServiceManager\FactoryInterface;
use Core\Service\AlcarinCacherBridge;
use Zend\ServiceManager\ServiceLocatorInterface;

class AlcarinCacherBridgeFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $config = $serviceLocator->get('config');
        $options = $config['alcarin-cacher'];

        $bridge = new AlcarinCacherBridge($options['host'], $options['port']);
        $bridge->setServiceLocator($serviceLocator);
        return $bridge;
    }
}
