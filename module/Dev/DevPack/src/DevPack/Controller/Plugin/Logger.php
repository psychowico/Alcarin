<?php

namespace DevPack\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Core\Permission\Resources;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceManager;

/**
 * controller plugin helpers to have easy access to loging system,
 */
class Logger extends AbstractPlugin
{
    protected $logger;

    public function __call($method, $args)
    {
        $logger = $this->logger();
        if( method_exists($logger, $method) ) {
            $msg = $args[0];
            $args = array_splice($args, 1);
            $msg = vsprintf($msg, $args);

            return call_user_func([$logger, $method], $msg);
        }
        else {
            throw new \DomainException(sprintf('Method "%s" not exists.'), $method);
        }
    }


    /**
     * @return \Zend\Log\Logger
     */
    protected function logger()
    {
        if( $this->logger == null ) {
            $this->logger = $this->getController()->getServiceLocator()->get('system-logger');
        }
        return $this->logger;
    }

    /**
     *
     * @param $resource it should be constant from \Core\Permission\Resources class
     */
    public function __invoke( $msg = null, $priority = \Zend\Log\Logger::INFO )
    {
        if( $msg === null ) return $this;

        return $this->logger()->log( $priority, $msg );
    }
}