<?php

namespace Admin\View\Helper;

use Zend\View\Helper\AbstractHelper;

class ParentUri extends AbstractHelper
{
    public function __invoke()
    {
        $sl = $this->getView()->getHelperPluginManager()->getServiceLocator();
        $uri = clone $sl->get('request')->getUri()->normalize();
        $uri->setQuery('');
        $pos = strrpos($uri, '/');
        if($pos === false ) return null;

        return substr($uri->toString(), 0, $pos);
    }
}