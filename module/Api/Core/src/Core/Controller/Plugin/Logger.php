<?php

namespace Core\Controller\Plugin;

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
        if( $msg == null ) return $this->logger();

        return $this->logger()->log( $priority, $msg );
    }
}