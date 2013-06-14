<?php

namespace Alcarin\Controller\Game;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;
use Core\Permission\Resource;

class GamePanelController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        $chars = $this->player()->chars()->all();
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
        $game_events = $this->gameServices()->get('game-events');
        $game_events->generate('test', 1, 2, 3)->broadcast()->test();

        $char = $this->player()->chars()->all()[$id];

        $builder = $this->getServiceLocator()->get('AnnotationBuilderService');
        $talking_form    = $builder->createForm(new \Alcarin\Form\TalkingForm(), true, "Mów");

        return [
            'current_char'  => $char->name(),
            'version' => \Zend\Version\Version::VERSION,
            'href' => $this->getRequest()->getQuery('href'),
            'forms' => [
                'talking' => $talking_form,
            ]
        ];
    }
}
