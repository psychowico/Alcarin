<?php

namespace Alcarin\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Core\Permission\Resource;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        return [
            'version' => \Zend\Version\Version::VERSION,
            'href' => $this->getRequest()->getQuery('href')
        ];
    }
}
