<?php

namespace Admin\View\Helper;

use Zend\View\Helper\AbstractHelper;

class Uri extends AbstractHelper
{
    public function __invoke($name = null, array $params = array(), $options = array(), $reuseMatchedParams = false)
    {
        if($name == null) {
            return $this;
        }
        else {
            return $this->getView()->url($name, $params, $options, $reuseMatchedParams);
        }
    }

    public function parent()
    {
        return $this->up(1);
    }

    public function up($levels)
    {
        $sl = $this->getView()->getHelperPluginManager()->getServiceLocator();
        $uri = $sl->get('request')->getUri()->normalize();

        $path = $uri->getPath();
        for($i = 0; $i < $levels; $i++) {
            $pos = strrpos($path, '/');
            if($pos === false ) return null;
            $path = substr($path, 0, $pos);
        }

        return $path;
    }

    public function isAdmin()
    {
        $uri = $this->__toString();
        return strpos($uri, '/admin') === 0;
    }

    public function isGame()
    {
        $uri = $this->__toString();
        return strpos($uri, '/game') === 0;
    }

    /**
     * we want return current "path" when helper was called without args.
     */
    public function current()
    {
        return $this->__toString();
    }

    public function __toString()
    {
        $sl = $this->getView()->getHelperPluginManager()->getServiceLocator();
        $uri = $sl->get('request')->getUri()->normalize();
        return $uri->getPath();
    }
}