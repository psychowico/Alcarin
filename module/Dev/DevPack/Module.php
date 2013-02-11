<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace DevPack;

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
                },
                'system-logger' => function( $sm ) {
                    $logger = new \Zend\Log\Logger();
                    $plugins_manager = new \Zend\Log\WriterPluginManager();

                    $writers = $sm->get('config')['logs']['writers'];

                    if( count($writers) == 0 ) {
                        $logger->addWriter( new \Zend\Log\Writer\Null() );
                        return $logger;
                    }

                    //let register dedicated writers
                    foreach( $writers as $writer_key => $options ) {
                        $service = isset( $options['service'] ) ? $options['service'] : null;
                        $writers[$writer_key]['type'] = empty($options['type']) ? $service : $options['type'];

                        if( $service == null ) continue;
                        if( !$plugins_manager->has( $service) ) {
                            $plugins_manager->setService($service, $sm->get( $service ) );
                        }
                    }
                    $logger->setWriterPluginManager( $plugins_manager );

                    //and add them as writers
                    foreach( $writers as $options ) {
                        $type = $options['type'];
                        unset($options['type']);

                        $writer = $logger->writerPlugin( $type, $options );
                        if( isset( $options['min-priority'] ) ) {
                            $filter = new \Zend\Log\Filter\Priority( $options['min-priority'] );
                            $writer->addFilter( $filter );
                            unset($options['min-priority']);
                        }

                        $logger->addWriter( $writer );
                    }
                    return $logger;
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
