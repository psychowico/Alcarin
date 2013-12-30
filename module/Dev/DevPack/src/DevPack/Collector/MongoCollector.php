<?php
namespace DevPack\Collector;

use Zend\Mvc\MvcEvent;
use ZendDeveloperTools\Collector\AbstractCollector;

class MongoCollector extends AbstractCollector
{
    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'mongo';
    }

    /**
     * @inheritdoc
     */
    public function getPriority()
    {
        return 100;
    }

    /**
     * @inheritdoc
     */
    public function collect(MvcEvent $mvcEvent)
    {
        $sm = $mvcEvent->getApplication()->getServiceManager();
        $this->data = $sm->get('mongo_profiler')->getStoredData();
    }

    public function getQueries()
    {
        $result = [];
        foreach( $this->data as $value ) {
            $result[ $value['query'] ] = $value;
        }
        return $result;
    }

    public function getQueryCount()
    {
        return count( $this->data );
    }

    public function getTotalTime()
    {
        return array_sum( array_map( function( $el ) {
            return $el['time'];
        }, $this->data ) );
    }
}
