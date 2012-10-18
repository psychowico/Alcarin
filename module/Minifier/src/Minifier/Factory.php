<?php

namespace Minifier;

use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\ServiceManager\FactoryInterface;
use Minifier\Minifier;
use Minifier\Adapter\AdapterInterface;

/**
 * @author Wiktor Obrębski
 */
class Factory implements FactoryInterface
{
    public function createService( ServiceLocatorInterface $serviceLocator )
    {
        $options = $serviceLocator->get('config')['minifier'];

        $adapter_class = $options['adapter'];
        /*\Zend\Debug\Debug::dump( $adapter_class );

        \Zend\Debug\Debug::dump( class_exists($adapter_class) );
        */
        if (!class_exists($adapter_class)) {
            throw new \DomainException(sprintf(
                '%s expects the "adapter" attribute to resolve to an existing class; received "%s"',
                __METHOD__,
                $adapter_class
            ));
        }
        unset($options['adapter']);
        if( isset( $options['options'] ) ) {
            $options = $options['options'];
        }

        $adapter = new $adapter_class( $options );
        return new Minifier( $adapter );
    }
}
