<?php

namespace Admin\View\Helper;

use Zend\View\Helper\AbstractHelper;

class ParentUri extends AbstractHelper
{
    public function __invoke()
    {
        $sl = $this->getView()->getHelperPluginManager()->getServiceLocator();
        $uri = $sl->get('request')->getUri()->normalize();

        $path = $uri->getPath();

        $pos = strrpos($path, '/');
        if($pos === false ) return null;

        return substr($path, 0, $pos);
    }
}