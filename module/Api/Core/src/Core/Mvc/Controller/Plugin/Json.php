<?php

namespace Core\Mvc\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;

/**
 * simple plugin to avoid adding Zend\View\Model\JsonModel to use all the times.
 */
class Json extends AbstractPlugin
{
    public function __invoke( $array = null )
    {
        return new \Zend\View\Model\JsonModel($array);
    }
}