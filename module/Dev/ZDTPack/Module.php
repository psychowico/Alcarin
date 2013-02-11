<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace ZDTPack;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Console\Adapter\AdapterInterface as ConsoleAdapterInterface;
use Zend\ModuleManager\Feature\ConsoleUsageProviderInterface;

/**
 * this module extending ZendDevelopTools toolbar about new features
 */
class Module implements ConsoleUsageProviderInterface
{
    /**
     * @param ConsoleAdapterInterface $console
     * @return array|string|null
     */
    public function getConsoleUsage(ConsoleAdapterInterface $console)
    {
        return array(
            'create su <suemail> <supass>' => 'Create super user with specific email and password. SU will have all possible privilages.',
        );
    }

    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'mongo_profiler' => function( $sm ) {
                    $profiler_config = $sm->get('config')['mongo_profiler'];
                    $profiler_class  = $profiler_config['class'];

                    $options = isset( $profiler_config['options'] ) ? $profiler_config['options'] : [];

                    $profiler = new $profiler_class( $options );

                    return $profiler;
                }
            ),
        );
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }
}
