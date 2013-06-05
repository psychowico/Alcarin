<?php

namespace Core\Mvc\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;

/**
 * simple plugin that checking that actual request except "json" response
 */
class IsJson extends AbstractPlugin
{
    protected $is_json = null;

    public function __invoke( $array = null )
    {
        if($this->is_json === null) {
            $headers = $this->getController()->getRequest()->getHeaders();
            if (!$headers->has('accept')) return false;

            $accept  = $headers->get('accept');

            $match = $accept->match('application/json, application/javascript');
            $this->is_json = $match->getTypeString() == 'application/json';
        }

        return $this->is_json;
    }
}