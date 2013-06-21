<?php

namespace Alcarin\Controller\Game;

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
            $this->player()->chars()->create($data['name']);
        }
        return $this->redirect()->toParent();
    }
}
