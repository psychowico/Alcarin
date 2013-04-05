<?php

namespace Alcarin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;
use Core\Permission\Resource;

class CreateCharController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        return [];
    }

    public function create($data)
    {
        if(!empty($data['name'])) {
            $gServices = $this->getServiceLocator()->get('game-services');
            $player = $gServices->get('players')->current();
            $player->chars()->create($data['name']);
        }
        return $this->redirect()->toParent();
    }
}
