<?php

namespace Alcarin\Controller\Game;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\Http\Header\ContentType;
use Zend\View\Model\ViewModel;

class CharacterEventsController extends AbstractAlcarinRestfulController
{
    public function fetchAction()
    {
        $events = $this->player()->currentChar()->events()->all();
        $events = array_map(function($e) {
            return $e->toArray();
        }, $events);
        return $this->json($events);
    }

    public function publicTalkAction()
    {
        $content = $this->params()->fromPost('content');
        if(empty($content)) {
            return $this->responses()->badRequest();
        }
        $gEvents = $this->gameServices()->get('game-events');

        $event   = $gEvents->generate('public-talk', $content);
        $event->broadcast()->inRadius(15);
        return $this->responses()->OK();
    }
}