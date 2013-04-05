<?php

namespace Alcarin\Controller;

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
                ['controller' => 'panel', 'id' => current($chars)['id']]);
        }
    }

    public function get($id)
    {
        $char = $this->player()->chars()->all()[$id];
        return [
            'current_char'  => $char['name'],
            'version' => \Zend\Version\Version::VERSION,
            'href' => $this->getRequest()->getQuery('href')
        ];
    }
}
