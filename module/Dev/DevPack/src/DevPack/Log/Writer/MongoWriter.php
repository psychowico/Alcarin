<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/zf2 for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 * @package   Zend_Log
 */

namespace DevPack\Log\Writer;

use Zend\Log\Writer\AbstractWriter;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * extends zend log to support working with our simple mongo library.
 */
class MongoWriter extends AbstractWriter
                  implements ServiceLocatorAwareInterface
{
    protected $sl;
    protected $mongo;
    protected $tableName;

    public function __construct( $tableName = 'logs' )
    {
        $this->tableName = $tableName;
    }

    /**
     * Set service locator
     *
     * @param ServiceLocatorInterface $serviceLocator
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->sl = $serviceLocator;
        return $this;
    }

    /**
     * Get service locator
     *
     * @return ServiceLocatorInterface
     */
    public function getServiceLocator()
    {
        return $this->sl;
    }

    protected function mongo()
    {
        if( $this->mongo == null ) {
            $this->mongo = $this->getServiceLocator()->get('mongo');
        }
        return $this->mongo;
    }

   /**
     * Write a message to the log
     *
     * @param array $event log data event
     * @return void
     */
    protected function doWrite(array $event)
    {
        $table = $this->tableName;
        $this->mongo()->{$table}->insert( [
            'time'  => new \MongoDate( $event['timestamp']->getTimestamp()),
            'priority' => [
                'id'   => $event['priority'],
                'name' => $event['priorityName'],
            ],
            'msg'   => $event['message'],
        ] );
    }
}
