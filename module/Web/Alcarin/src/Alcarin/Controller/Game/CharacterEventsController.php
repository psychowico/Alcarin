<?php

namespace Alcarin\Controller\Game;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\Http\Header\ContentType;
use Zend\View\Model\ViewModel;

class CharacterEventsController extends AbstractAlcarinRestfulController
{
    public function fetchAction()
    {
        $events = $this->player()->currentChar()->events()->fetchPlain();

        if($this->params()->fromQuery('json', false)) {
            return $this->json($events);
        }
        else {
            # send events to logged user, by alcarin cacher service
            $bridge = $this->gameServices()->get('alcarin-cacher');
            $bridge->connect();
            $bridge->resetEvents($this->player()->currentChar()->id(), array_values($events));

            $bridge->disconnect();
        }

        return $this->responses()->ok();
    }

    public function publicTalkAction()
    {
        $content = $this->params()->fromPost('content');
        if(empty($content)) {
            return $this->responses()->badRequest();
        }
        $gEvents = $this->gameServices()->get('game-events');

        $speaker = $this->player()->currentChar();
        $event   = $gEvents->generate('public-talk', $content, $speaker);
        $event->broadcast()->inRadius(15);
        return $this->responses()->OK();
    }
}