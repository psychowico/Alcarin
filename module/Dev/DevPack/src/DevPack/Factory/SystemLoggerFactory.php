<?php

namespace DevPack\Factory;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class SystemLoggerFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $sm)
    {
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

        $logger->debug('');
        $logger->debug('------------------------Request start------------------------');
        $logger->debug('');
        return $logger;
    }
}