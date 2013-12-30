<?php
namespace DevPack\Collector;

use Zend\Mvc\MvcEvent;
use ZendDeveloperTools\Collector\AbstractCollector;

class CharInfoCollector extends AbstractCollector
{
    public function getName()
    {
        return 'charinfo';
    }

    public function getPriority()
    {
        return -100;
    }

    public function collect(MvcEvent $mvcEvent)
    {
        $sm = $mvcEvent->getApplication()->getServiceManager();
        $player = $sm->get('game-services')->get('players')->current();
        $this->data = $player->currentChar()->toArray();
    }

    public function getLocation()
    {
        $loc = $this->data['loc'];
        return sprintf('%.2f, %.2f', $loc['x'], $loc['y']);
    }
}
