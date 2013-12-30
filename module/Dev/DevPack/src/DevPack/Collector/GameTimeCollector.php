<?php
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
            'freezed' => $time->isFreezed(),
            'hour'    => $time->hour(),
            'min'     => $time->min(),
            'sec'     => $time->sec(),
        ];
    }

    public function getTime()
    {
        return $this->data;
    }
}
