<?php

namespace Core\Mvc\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;

/**
 * simple plugin that checking that actual request except "json" response
 */
class IsJson extends AbstractPlugin
{
    public function __invoke( $array = null )
    {
        $headers = $this->getController()->getRequest()->getHeaders();
        if (!$headers->has('accept')) return false;

        $accept  = $headers->get('accept');

        $match = $accept->match('application/json, application/javascript');
        return $match->getTypeString() == 'application/json';
    }
}