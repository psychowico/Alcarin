<?php

namespace Alcarin\Controller\Game;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;
use Core\Permission\Resource;

class GamePanelController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        $chars = $this->player()->chars()->names();
        if(count($chars) == 0) {
            return $this->redirect()->toRoute('alcarin/default', ['controller' => 'create-char']);
        }
        else {
            return $this->redirect()->toRoute('alcarin/default',
                ['controller' => 'panel', 'id' => current($chars)->id()]);
        }
    }

    public function get($id)
    {
        $bridge = $this->getServiceLocator()->get('alcarin-cacher');
        $bridge->connect();
        $bridge->disconnect();

        $chars = $this->player()->chars();
        $all = $chars->names();
        if(empty($all[$id])) {
            return $this->redirect()->toRoute('alcarin/default', ['controller' => 'create-char']);
        }
        $char = $chars->get($id);
        $this->player()->setCurrentChar($char);

        $builder = $this->getServiceLocator()->get('AnnotationBuilderService');
        $talking_form    = $builder->createForm(new \Alcarin\Form\TalkingForm(), true, "Mów");

        // $events = $char->events()->all();
        // foreach ($events as $e) {
        //     \Zend\Debug\Debug::dump($e->toString());
        // }


        //tests
        // $game_events = $this->gameServices()->get('game-events');
        // $event = $game_events->generate('public-talk', 'Trup przemówił');
        // $event->broadcast()->inRadius(10);


        return [
            'charid'       => $id,
            'current_char' => $char->name(),
            'version'      => \Zend\Version\Version::VERSION,
            'href'         => $this->getRequest()->getQuery('href'),
            'forms'        => [
                'talking' => $talking_form,
            ]
        ];
    }
}
