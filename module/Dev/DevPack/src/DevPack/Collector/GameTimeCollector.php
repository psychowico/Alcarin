<?php
/**
 * Zend Developer Tools for Zend Framework (http://framework.zend.com/)
 *
 * @link       http://github.com/zendframework/ZendDeveloperTools for the canonical source repository
 * @copyright  Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license    http://framework.zend.com/license/new-bsd New BSD License
 * @package    ZendDeveloperTools
 * @subpackage Collector
 */

namespace DevPack\Collector;

use Zend\Mvc\MvcEvent;
use ZendDeveloperTools\Collector\AbstractCollector;

class GameTimeCollector extends AbstractCollector
{
    protected $formattedTime = "00:00";

    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'gametime';
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
        $time = $sm->get('game-services')->get('time');

        //sprintf("%02d:%02d:%02d", $time->hour(), $time->min(), $time->sec());
        $this->data = [
            'hour' => $time->hour(),
            'min'  => $time->min(),
            'sec'  => $time->sec(),
        ];
    }

    public function getTime()
    {
        return $this->data;
    }
}